/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */

const fs = require('fs').promises;
const fsr = require('fs');
const path = require('path');

const svgSourceFolder = './svg/';
const jsTargetFolder = './generated_js/';
const fontTargetFolder = './generated_fonts/';

if (!fsr.existsSync(jsTargetFolder)) fsr.mkdirSync(jsTargetFolder, { recursive: true });
if (!fsr.existsSync(fontTargetFolder)) fsr.mkdirSync(fontTargetFolder, { recursive: true });

// #######################################
console.info(`removing files from target directory ${jsTargetFolder}`);
fs.readdir(jsTargetFolder, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    fs.unlink(path.join(jsTargetFolder, file), (err2) => {
      if (err2) throw err2;
    });
  });
});
console.info('deletion successful\n');

// #######################################
console.info('start reading svg files and creating js files');
// Loop through all the files in the temp directory

fs.readdir(svgSourceFolder).then(async (files) => {
  const addedIcons = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    // Make one pass and make the file complete
    const svgFile = path.join(svgSourceFolder, file);

    const stat = await fs.stat(svgFile);

    if (stat.isFile()) {
      const name = file.substr(0, file.lastIndexOf('.'));

      // do some sanity checks before writing
      if (!name) {
        console.error(`${svgFile}: File Name doesn't match expected format. Expects {svgName}.svg`);
      } else {
        addedIcons.push(file.replace('.svg', ''));
      }
    } else if (stat.isDirectory()) {
      console.error("'%s' is a directory. This script is currently not recursive and can't handle sub directories.", svgFile);
    }
  }

  const makeCamelCase = (str) => str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());

  const svgImports = addedIcons.map((addedIcon) => 
  `import ${makeCamelCase(addedIcon)}Icon from ".${svgSourceFolder}${addedIcon}.svg"`).join(';\n') + ";"
 
  const indexFileRegistryContent = "\n export const iconRegistry = {};"+
  "\n" + 
  addedIcons.map((addedIcon) => `export const ${makeCamelCase(addedIcon)} = () => iconRegistry["${makeCamelCase(addedIcon)}"] = ${makeCamelCase(addedIcon)}Icon`).join(';\n') + ";"


  const data = [svgImports, indexFileRegistryContent];

  fs.writeFile(`${jsTargetFolder}index.js`, data, (err3) => {
    if (err3) {
      console.error(err3);
    }
  });

  // Dynamically import SVGIcons2SVGFontStream
  const { SVGIcons2SVGFontStream } = await import('svgicons2svgfont');

  // Create the icon font
  const fontStream = new SVGIcons2SVGFontStream({
    fontName: 'iconfont',
  });

  fontStream.pipe(fsr.createWriteStream(path.join(fontTargetFolder, 'iconfont.svg')))
    .on('finish', () => {
      console.log('Font successfully created!');
    })
    .on('error', (err) => {
      console.error(err);
    });

  files.forEach((file) => {
    const glyph = fsr.createReadStream(path.join(svgSourceFolder, file));
    glyph.metadata = {
      unicode: [String.fromCharCode(0xe000 + addedIcons.indexOf(file.replace('.svg', '')))],
      name: file.replace('.svg', ''),
    };
    fontStream.write(glyph);
  });

  fontStream.end();
});