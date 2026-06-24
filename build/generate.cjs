/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-len */
const fs = require('fs').promises;
const fsr = require('fs'); // Use this for synchronous methods
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const svgSourceFolder = './svg/';
const jsTargetFolder = './generated_js/';
const fontTargetFolder = './dist/fonts/';
const distTargetFolder = './dist/';
const glyphMapFile = './glyphmap.json';
const START_CODEPOINT = 0xe900;

if (!fsr.existsSync(jsTargetFolder)) fsr.mkdirSync(jsTargetFolder, { recursive: true });
if (!fsr.existsSync(fontTargetFolder)) fsr.mkdirSync(fontTargetFolder, { recursive: true });
if (!fsr.existsSync(distTargetFolder)) fsr.mkdirSync(distTargetFolder, { recursive: true });

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
    const data = await fs.readFile(filePath);
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return hash;
  } catch (err) {
    console.error('Error computing file hash:', err);
    throw err;
  }
};

const generateJSFiles = async (icons) => {
  const makeCamelCase = (str) => str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());

  const svgImports = icons.map((icon) => `import ${makeCamelCase(icon)}Icon from ".${svgSourceFolder}${icon}.svg";`).join('\n');

  const iconsObject = `export const icons = {\n${
    icons.map((icon) => `  ${makeCamelCase(icon)}: ${makeCamelCase(icon)}Icon`).join(',\n')
  }};`;

  const getIconFunction = 'export const getIcon = (icon) => icons[icon];';

  const indexFileRegistryContent = `export const iconRegistry = {};\n${icons.map((icon) => `export const ${makeCamelCase(icon)} = () => iconRegistry["${makeCamelCase(icon)}"] = ${makeCamelCase(icon)}Icon;`).join('\n')}`;

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
  const makeCamelCase = (str) => str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());

  const iconExports = icons.map((icon) => `export const ${makeCamelCase(icon)}: () => IconData;`).join('\n');

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

const generateFont = async (icons, glyphMap) => {
  const { generateFonts, FontAssetType, OtherAssetType } = await import('fantasticon');

  // Build codepoints map: iconName -> codepoint number
  const codepoints = {};
  for (const icon of icons) {
    codepoints[icon.iconName] = glyphMap[icon.iconName].codepoint;
  }

  // Copy filtered/renamed SVGs to a temp dir so fantasticon sees the right icon names
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ifx-icons-'));
  try {
    await Promise.all(
      icons.map((icon) => fs.copyFile(
        path.join(svgSourceFolder, icon.originalIconName),
        path.join(tmpDir, `${icon.iconName}.svg`),
      )),
    );

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
    await fs.rm(tmpDir, { recursive: true, force: true });
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

    // Step 1: Extract iconName values from the array of objects
    const iconNames = updatedIconsForFont.map((obj) => obj.iconName);

    // Step 2: Iterate through the map keys and delete entries not in the iconNames array
    Object.keys(glyphMap).forEach((key) => {
      if (!iconNames.includes(key)) {
        delete glyphMap[key];
      }
    });

    await generateJSFiles(currentIconsForJS);
    await generateTypesFile(currentIconsForJS);
    await generateFont(updatedIconsForFont, glyphMap);
    await writeGlyphMap(glyphMap);
  } catch (err) {
    console.error('Error processing SVG files:', err);
  }
};

main();
