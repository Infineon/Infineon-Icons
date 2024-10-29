/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-len */
const fs = require('fs').promises;
const fsr = require('fs'); // Use this for synchronous methods
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');
const webfont = require('webfont').default;

const svgSourceFolder = './svg/';
const jsTargetFolder = './generated_js/';
const fontTargetFolder = './dist/fonts/';
const glyphMapFile = './glyphmap.json';
const START_CODEPOINT = 0xe900;

if (!fsr.existsSync(jsTargetFolder)) fsr.mkdirSync(jsTargetFolder, { recursive: true });
if (!fsr.existsSync(fontTargetFolder)) fsr.mkdirSync(fontTargetFolder, { recursive: true });

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

const validateSVG = (filePath) => {
  try {
    execSync(`xmllint --noout ${filePath}`);
    return true;
  } catch (err) {
    console.error(`Invalid SVG at ${filePath}:`, err.message);
    throw new Error(`Invalid SVG at ${filePath}`);
  }
};

const generateJSFiles = async (icons) => {
  const makeCamelCase = (str) => str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());

  const svgImports = icons.map((icon) => `import ${makeCamelCase(icon)}Icon from ".${svgSourceFolder}${icon}.svg";`).join('\n');
  const indexFileRegistryContent = `export const iconRegistry = {};\n${
    icons.map((icon) => `export const ${makeCamelCase(icon)} = () => iconRegistry["${makeCamelCase(icon)}"] = ${makeCamelCase(icon)}Icon;`).join('\n')}`;

  const data = [svgImports, indexFileRegistryContent].join('\n');

  try {
    await fs.writeFile(`${jsTargetFolder}index.js`, data);
  } catch (err) {
    console.error('Error writing JS files:', err);
    throw err;
  }
};

const generateFont = async (icons, glyphMap) => {
  try {
    const iconFiles = icons.map((iconName) => ({
      path: path.join(svgSourceFolder, `${iconName}.svg`),
      name: iconName,
      codepoint: glyphMap[iconName].codepoint,
    }));

    const result = await webfont({
      files: iconFiles.map((icon) => icon.path),
      fontName: 'iconfont',
      formats: ['ttf', 'woff', 'woff2'],
      glyphTransformFn: (originalObj) => {
        const obj = { ...originalObj };
        const icon = iconFiles.find((i) => i.path === obj.path);
        obj.name = icon.name;
        obj.unicode = [String.fromCharCode(icon.codepoint)];
        return obj;
      },
      normalize: true,
      fontHeight: 1000,
      descent: 200,
      dest: fontTargetFolder,
      template: 'css', // Optionally generate CSS file
      templateClassName: 'icon',
      templateFontPath: './',
    });

    ['ttf', 'woff', 'woff2'].forEach((ext) => {
      if (result[ext]) {
        const outputPath = path.join(fontTargetFolder, `iconfont.${ext}`);
        fsr.writeFileSync(outputPath, result[ext]); // Correct usage of writeFileSync
      }
    });

    if (result.template) {
      const cssOutputPath = path.join(fontTargetFolder, 'iconfont.css');
      fsr.writeFileSync(cssOutputPath, result.template);
    }

    console.log('Font generation completed successfully!');
  } catch (err) {
    console.error('Error in font generation:', err);
    throw err;
  }
};

const main = async () => {
  const glyphMap = await readGlyphMap();

  await cleanDirectory(jsTargetFolder);

  try {
    const files = await fs.readdir(svgSourceFolder);

    const iconsForJS = files.filter((file) => file.endsWith('.svg'));
    const iconsForFont = files.filter((file) => file.endsWith('.svg') && !file.endsWith('-24.svg'));

    const updatedIconsForJS = await Promise.all(
      iconsForJS.map(async (file) => {
        const iconName = file.slice(0, -4); // Remove '.svg' extension
        const svgFile = path.join(svgSourceFolder, file);

        validateSVG(svgFile);

        const fileHash = await computeFileHash(svgFile);
        return { iconName, fileHash };
      }),
    );

    const updatedIconsForFont = await Promise.all(
      iconsForFont.map(async (file) => {
        const iconName = file.endsWith('-16.svg') ? file.slice(0, -7) : file.slice(0, -4); // Remove suffix and '.svg' extension if necessary
        const svgFile = path.join(svgSourceFolder, file);

        validateSVG(svgFile);

        const fileHash = await computeFileHash(svgFile);
        return { iconName, fileHash };
      }),
    );

    const highestCodepoint = Object.values(glyphMap).reduce((max, { codepoint }) => Math.max(max, codepoint), START_CODEPOINT);

    const currentIconsForJS = updatedIconsForJS.map(({ iconName }) => iconName);
    const currentIconsForFont = updatedIconsForFont.map(({ iconName }) => iconName);

    const currentHashesForFont = updatedIconsForFont.reduce((acc, { iconName, fileHash }) => {
      acc[iconName] = fileHash;
      return acc;
    }, {});

    let nextCodepoint = highestCodepoint + 1;

    currentIconsForFont.forEach((iconName) => {
      if (!glyphMap[iconName]) {
        glyphMap[iconName] = { codepoint: nextCodepoint };
        nextCodepoint += 1;
      }
      if (glyphMap[iconName].hash !== currentHashesForFont[iconName]) {
        glyphMap[iconName].hash = currentHashesForFont[iconName];
      }
    });

    const deletedIcons = Object.keys(glyphMap).filter((icon) => !currentIconsForFont.includes(icon));
    deletedIcons.forEach((icon) => {
      delete glyphMap[icon];
    });

    await generateJSFiles(currentIconsForJS);
    await generateFont(currentIconsForFont, glyphMap);
    await writeGlyphMap(glyphMap);
  } catch (err) {
    console.error('Error processing SVG files:', err);
  }
};

main();
