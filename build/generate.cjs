/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-len */
const fs = require('fs').promises;
const fsr = require('fs'); // Use this for synchronous methods
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFile } = require('child_process');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);

const svgSourceFolder = './svg/';
const jsTargetFolder = './generated_js/';
const fontTargetFolder = './dist/fonts/';
const distTargetFolder = './dist/';
const glyphMapFile = './glyphmap.json';
const metadataFile = './icons.meta.json';
const metadataModuleFile = './metadata.js';
const metadataTypesFile = './metadata.d.ts';
const START_CODEPOINT = 0xe900;

if (!fsr.existsSync(jsTargetFolder)) fsr.mkdirSync(jsTargetFolder, { recursive: true });
if (!fsr.existsSync(fontTargetFolder)) fsr.mkdirSync(fontTargetFolder, { recursive: true });
if (!fsr.existsSync(distTargetFolder)) fsr.mkdirSync(distTargetFolder, { recursive: true });

const makeJavaScriptIconName = (fileName) => fileName
  .replace(/\.svg$/i, '')
  .toLowerCase()
  .replace(/[^a-zA-Z0-9]+(.)/g, (match, character) => character.toUpperCase());

const readGlyphMap = async () => {
  try {
    const glyphMapData = await fs.readFile(glyphMapFile, 'utf-8');
    return JSON.parse(glyphMapData);
  } catch (err) {
    console.error('Error reading glyph map:', err);
    return {};
  }
};

const writeGlyphMap = async (glyphMap) => {
  try {
    await fs.writeFile(glyphMapFile, JSON.stringify(glyphMap, null, 2));
  } catch (err) {
    console.error('Error saving glyph map:', err);
  }
};

const cleanDirectory = async (directory) => {
  try {
    const files = await fs.readdir(directory);
    await Promise.all(files.map((file) => fs.unlink(path.join(directory, file))));
  } catch (err) {
    console.error(`Error cleaning directory ${directory}:`, err);
  }
};

const computeFileHash = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    // Normalize line endings so hashes are stable across OS/editor defaults.
    const normalizedData = data.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const hash = crypto.createHash('sha256').update(normalizedData, 'utf8').digest('hex');
    return hash;
  } catch (err) {
    console.error('Error computing file hash:', err);
    throw err;
  }
};

const generateJSFiles = async (icons) => {
  const svgImports = icons.map((icon) => `import ${makeJavaScriptIconName(icon)}Icon from ".${svgSourceFolder}${icon}.svg";`).join('\n');

  const iconsObject = `export const icons = {\n${
    icons.map((icon) => `  ${makeJavaScriptIconName(icon)}: ${makeJavaScriptIconName(icon)}Icon`).join(',\n')
  }};`;

  const getIconFunction = 'export const getIcon = (icon) => icons[icon];';

  const indexFileRegistryContent = `export const iconRegistry = {};\n${icons.map((icon) => `export const ${makeJavaScriptIconName(icon)} = () => iconRegistry["${makeJavaScriptIconName(icon)}"] = ${makeJavaScriptIconName(icon)}Icon;`).join('\n')}`;

  const data = [
    svgImports,
    indexFileRegistryContent,
    iconsObject,
    getIconFunction,
  ].join('\n\n');

  try {
    await fs.writeFile(`${jsTargetFolder}index.js`, data);
  } catch (err) {
    console.error('Error writing JS files:', err);
    throw err;
  }
};

const generateTypesFile = async (icons) => {
  const iconExports = icons.map((icon) => `export const ${makeJavaScriptIconName(icon)}: () => IconData;`).join('\n');

  const data = [
    'export type IconData = string;',
    'export const iconRegistry: Record<string, IconData>;',
    'export const icons: Record<string, IconData>;',
    'export const getIcon: (icon: string) => IconData | undefined;',
    iconExports,
  ].join('\n\n');

  try {
    await fs.writeFile(path.join(distTargetFolder, 'icons.d.ts'), `${data}\n`);
  } catch (err) {
    console.error('Error writing types file:', err);
    throw err;
  }
};

const readIconMetadata = async () => {
  try {
    const metadata = JSON.parse(await fs.readFile(metadataFile, 'utf-8'));
    if (!metadata || Array.isArray(metadata) || typeof metadata !== 'object') {
      throw new Error('Metadata root must be an object keyed by icon name.');
    }
    return metadata;
  } catch (err) {
    throw new Error(`Error reading icon metadata: ${err.message}`);
  }
};

const assertString = (value, label) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${label} must be a non-empty string.`);
  }
};

const assertStringArray = (value, label) => {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || !item.trim())) {
    throw new Error(`${label} must be an array of non-empty strings.`);
  }
};

const validateIconMetadata = (metadata, sourceFiles) => {
  const availableIcons = new Set([...sourceFiles].map(makeJavaScriptIconName));

  for (const [iconName, entry] of Object.entries(metadata)) {
    const label = `Metadata entry "${iconName}"`;
    if (!entry || Array.isArray(entry) || typeof entry !== 'object') {
      throw new Error(`${label} must be an object.`);
    }
    if (!availableIcons.has(iconName)) {
      throw new Error(`${label} does not match a generated font icon.`);
    }
    assertString(entry.name, `${label}.name`);
    if (entry.name !== iconName) {
      throw new Error(`${label}.name must match its key.`);
    }
    assertString(entry.file, `${label}.file`);
    if (!sourceFiles.has(entry.file)) {
      throw new Error(`${label}.file does not exist in ${svgSourceFolder}.`);
    }
    if (iconName !== makeJavaScriptIconName(entry.file)) {
      throw new Error(`${label} must match the JavaScript export name derived from its file.`);
    }
    assertString(entry.category, `${label}.category`);
    assertString(entry.metaphor, `${label}.metaphor`);
    assertString(entry.figma, `${label}.figma`);
    assertStringArray(entry.useFor, `${label}.useFor`);
    assertStringArray(entry.keywords, `${label}.keywords`);

    if (!Array.isArray(entry.avoidFor)) {
      throw new Error(`${label}.avoidFor must be an array.`);
    }
    entry.avoidFor.forEach((avoidance, index) => {
      const avoidanceLabel = `${label}.avoidFor[${index}]`;
      if (!avoidance || Array.isArray(avoidance) || typeof avoidance !== 'object') {
        throw new Error(`${avoidanceLabel} must be an object.`);
      }
      assertString(avoidance.case, `${avoidanceLabel}.case`);
      if (avoidance.useInsteadText !== undefined) {
        assertString(avoidance.useInsteadText, `${avoidanceLabel}.useInsteadText`);
      }
      if (avoidance.useInsteadIcons !== undefined) {
        assertStringArray(avoidance.useInsteadIcons, `${avoidanceLabel}.useInsteadIcons`);
        avoidance.useInsteadIcons.forEach((replacementIcon) => {
          if (!availableIcons.has(replacementIcon)) {
            throw new Error(`${avoidanceLabel}.useInsteadIcons references unknown icon "${replacementIcon}".`);
          }
        });
      }
      if (avoidance.useInsteadText === undefined && avoidance.useInsteadIcons === undefined) {
        throw new Error(`${avoidanceLabel} must include useInsteadText or useInsteadIcons.`);
      }
    });
  }
};

const generateMetadataFiles = async () => {
  await Promise.all([
    fs.copyFile(metadataModuleFile, path.join(distTargetFolder, 'metadata.js')),
    fs.copyFile(metadataTypesFile, path.join(distTargetFolder, 'metadata.d.ts')),
    fs.copyFile(metadataFile, path.join(distTargetFolder, 'metadata.json')),
  ]);
};

const prepareFontSvgs = async (icons, sourceDir, targetDir) => {
  await Promise.all(icons.map((icon) => fs.copyFile(
    path.join(svgSourceFolder, icon.originalIconName),
    path.join(sourceDir, `${icon.iconName}.svg`),
  )));

  try {
    await execFileAsync(process.env.PYTHON || 'python3', [
      path.join(__dirname, 'normalize_font_svgs.py'),
      sourceDir,
      targetDir,
    ]);
  } catch (error) {
    const details = error.stderr?.trim() || error.message;
    throw new Error(
      `picosvg font normalization failed. Install requirements-font.txt.\n${details}`,
    );
  }
};

const generateFont = async (icons, glyphMap) => {
  const { generateFonts, FontAssetType, OtherAssetType } = await import('fantasticon');

  // Build codepoints map: iconName -> codepoint number
  const codepoints = {};
  for (const icon of icons) {
    codepoints[icon.iconName] = glyphMap[icon.iconName].codepoint;
  }

  // Normalize filtered/renamed SVGs in temp dirs so fonts retain even-odd holes.
  const sourceTmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ifx-icons-source-'));
  let tmpDir;
  try {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ifx-icons-'));
    await prepareFontSvgs(icons, sourceTmpDir, tmpDir);

    await generateFonts({
      inputDir: tmpDir,
      outputDir: fontTargetFolder,
      name: 'infineon-icons',
      fontTypes: [FontAssetType.TTF, FontAssetType.WOFF, FontAssetType.WOFF2],
      assetTypes: [OtherAssetType.CSS],
      codepoints,
      normalize: true,
      fontHeight: 1000,
      descent: 200,
      selector: '.icon',
      prefix: 'icon',
    });

    console.log('Font generation completed successfully!');
  } catch (err) {
    console.error('Error in font generation:', err);
    throw err;
  } finally {
    await fs.rm(sourceTmpDir, { recursive: true, force: true });
    if (tmpDir) await fs.rm(tmpDir, { recursive: true, force: true });
  }
};

const main = async () => {
  const glyphMap = await readGlyphMap();

  await cleanDirectory(jsTargetFolder);

  try {
    const files = await fs.readdir(svgSourceFolder);

    const iconsForJS = files.filter((file) => file.endsWith('.svg'));
    const iconsForFont = files.filter((file) => file.endsWith('.svg') && !file.endsWith('-24.svg') && !file.endsWith('-12.svg'));

    const updatedIconsForJS = await Promise.all(
      iconsForJS.map(async (file) => {
        const iconName = file.slice(0, -4); // Remove '.svg' extension
        const svgFile = path.join(svgSourceFolder, file);

        const fileHash = await computeFileHash(svgFile);
        return { iconName, fileHash };
      }),
    );

    const updatedIconsForFont = await Promise.all(
      iconsForFont.map(async (file) => {
        const iconName = file.endsWith('-16.svg') ? file.slice(0, -7) : file.slice(0, -4); // Remove suffix and '.svg' extension if necessary
        const originalIconName = file;
        const svgFile = path.join(svgSourceFolder, file);

        const fileHash = await computeFileHash(svgFile);
        return { iconName: iconName.toLowerCase(), originalIconName, fileHash };
      }),
    );

    const highestCodepoint = Object.values(glyphMap).reduce((max, { codepoint }) => Math.max(max, codepoint), START_CODEPOINT);

    const currentIconsForJS = updatedIconsForJS.map(({ iconName }) => iconName);

    const currentHashesForFont = updatedIconsForFont.reduce((acc, { iconName, fileHash }) => {
      acc[iconName] = fileHash;
      return acc;
    }, {});

    let nextCodepoint = highestCodepoint + 1;

    updatedIconsForFont.forEach((icon) => {
      if (!glyphMap[icon.iconName]) {
        glyphMap[icon.iconName] = { codepoint: nextCodepoint };
        nextCodepoint += 1;
      }
      if (glyphMap[icon.iconName].hash !== currentHashesForFont[icon.iconName]) {
        glyphMap[icon.iconName].hash = currentHashesForFont[icon.iconName];
      }
    });

    const fontIconNames = updatedIconsForFont.map((icon) => icon.iconName);
    const iconMetadata = await readIconMetadata();
    validateIconMetadata(iconMetadata, new Set(files));

    // Retain codepoints for the existing font identifier namespace.
    Object.keys(glyphMap).forEach((key) => {
      if (!fontIconNames.includes(key)) {
        delete glyphMap[key];
      }
    });

    await generateJSFiles(currentIconsForJS);
    await generateTypesFile(currentIconsForJS);
    await generateMetadataFiles();
    await generateFont(updatedIconsForFont, glyphMap);
    await writeGlyphMap(glyphMap);
  } catch (err) {
    console.error('Error processing SVG files:', err);
    throw err;
  }
};

main().catch(() => {
  process.exitCode = 1;
});
