/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */
const fs = require('fs').promises;
const path = require('path');

const regex = /<svg.*height="(.*?)".*?width="(.*?)".*?>(.*)<\/svg>/m;
const svgSourceFolder = './svg/';
const jsTargetFolder = './js/';

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
        const name = file.substr(0, file.lastIndexOf('-'));
        const sizeSuffix = file.substr(file.lastIndexOf('-') + 1, file.length - file.lastIndexOf('.') - 2);
        const height = m[1];
        const width = m[2];
        const svgContent = m[3];
        // building js file content
        let content = '';
        content += `const name = '${name}';\n`;
        content += `const svgSuffix = ${sizeSuffix};\n`;
        content += `const height = ${height};\n`;
        content += `const width = ${width};\n`;
        content += `const svgContent = '${svgContent};'\n`;
        content += 'export default {\n  name,\n  svgSuffix,\n  height,\n  width,\n  svgContent,\n};';

        // do some sanity checks before writing
        if (!name || !sizeSuffix || isNaN(sizeSuffix)) {
          console.error(`${svgFile}: File Name doesn't match expected format. Expects {svgName}-{sizeFlag}.svg`);
        } else if (!height || isNaN(height)
                    || !width || isNaN(width)
                    || !svgContent) {
          console.error(`${svgFile}: Content not in expected format! Executed regex didn't deliver results.`);
        } else {
          fs.writeFile(jsFile, content);
          addedIcons.push(file.replace('.svg', ''));
        }
      } else {
        console.error(`${svgFile}: Content not in expected format! Executed regex didn't deliver results.`);
      }
    } else if (stat.isDirectory()) {
      console.error("'%s' is a directory. This script is currently not recursive and can't handle sub directories.", svgFile);
    }
  }

  const makeCamelCase = (str) => str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());

  const indexFileImportContent = `${addedIcons.map((addedIcon) => `import ${makeCamelCase(addedIcon)} from './${addedIcon}'`).join(';\n')};\n\n`;
  const indexFileExportDefaultContent = `export default {\n${
    addedIcons.map((addedIcon) => `  ${makeCamelCase(addedIcon)}`).join(',\n')},\n};\n`;

  fs.writeFile(`${jsTargetFolder}index.js`, indexFileImportContent + indexFileExportDefaultContent, (err3) => {
    if (err3) {
      console.error(err3);
    }
  });
});
