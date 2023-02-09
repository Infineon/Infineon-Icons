/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */

const fs = require('fs').promises;
const fsr = require('fs');
const path = require('path');

const regex = /<svg.*?width="(.*?)".*?height="(.*?)".*?>(.*)<\/svg>/m;
const svgSourceFolder = './svg/';
const jsTargetFolder = './generated_js/';

const { DOMParser } = require('xmldom');

if (!fsr.existsSync(jsTargetFolder)) fsr.mkdirSync(jsTargetFolder, { recursive: true });

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
console.info('deletion successfull\n');

// #######################################
console.info('start reading svg files and creating js files');
// Loop through all the files in the temp directory
const parsePath = (html) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(html, 'text/xml');

  let stroke = '';
  let strokeLinecap = '';
  let strokeLinejoin = '';
  let d = '';

  if (document.childNodes['0'].attributes['0']) {
    stroke = document.childNodes['0'].attributes['0'].nodeValue;
  }
  if (document.childNodes['0'].attributes['1']) {
    strokeLinecap = document.childNodes['0'].attributes['1'].nodeValue;
  }

  if (document.childNodes['0'].attributes['2']) {
    strokeLinejoin = document.childNodes['0'].attributes['2'].nodeValue;
  }
  if (document.childNodes['0'].attributes['3']) {
    d = document.childNodes['0'].attributes['3'].nodeValue;
  }
  return {
    stroke, strokeLinecap, strokeLinejoin, d,
  };
};

fs.readdir(svgSourceFolder).then(async (files) => {
  const addedIcons = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    // Make one pass and make the file complete
    const svgFile = path.join(svgSourceFolder, file);
    const jsFile = path.join(jsTargetFolder, file.replace('.svg', '.js'));

    const stat = await fs.stat(svgFile);

    if (stat.isFile()) {
      const fileContent = await fs.readFile(svgFile, 'utf8');

      const m = regex.exec(fileContent);

      if (m != null) {
        const name = file.substr(0, file.lastIndexOf('.'));
        const height = m[1];
        const width = m[2];
        const svgContent = m[3];
        const svgPath = parsePath(svgContent);

        const {
          d, stroke, strokeLinecap, strokeLinejoin,
        } = svgPath;

        // const pathD = svgPath[0].attributes[3].nodeValue;

        // building js file content
        let content = '';

        content += `export default {\n  name: '${name}',\n  height: ${height},\n  width: ${width},\n  d: '${d}',\n  stroke: '${stroke}',\n  strokeLinecap: '${strokeLinecap}',\n  strokeLinejoin: '${strokeLinejoin}',\n};\n`;

        // do some sanity checks before writing
        if (!name) {
          console.error(`${svgFile}: File Name doesn't match expected format. Expects {svgName}.svg`);
        } else if (!height || isNaN(height)
                    || !width || isNaN(width)
                    || !svgContent) {
          console.error(`${svgFile}: Content not in expected format! Executed regex didn't deliver results.`);
        } else {
          fs.writeFile(jsFile, content);
          addedIcons.push(file.replace('.svg', ''));
        }
      } else {
        console.error(`${svgFile}: Content not found! Executed regex didn't deliver results.`);
      }
    } else if (stat.isDirectory()) {
      console.error("'%s' is a directory. This script is currently not recursive and can't handle sub directories.", svgFile);
    }
  }

  const makeCamelCase = (str) => str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());

  const indexFileImportContent = `${addedIcons.map((addedIcon) => `import ${makeCamelCase(addedIcon)} from './${addedIcon}'`).join(';\n')};\n\n`;
  const indexFileExportDefaultContent = `const icons = {\n${
    addedIcons.map((addedIcon) => `  ${makeCamelCase(addedIcon)}`).join(',\n')},\n};\n`;
  console.log('indexFileExportDefaultContent', indexFileExportDefaultContent);
  fs.writeFile(`${jsTargetFolder}index.js`, indexFileImportContent + indexFileExportDefaultContent, (err3) => {
    if (err3) {
      console.error(err3);
    }
  });
});
