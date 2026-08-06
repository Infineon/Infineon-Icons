import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  METADATA_SCHEMA_VERSION,
  getIconMetadata,
  iconMetadata,
  searchIconMetadata,
} from '@infineon/infineon-icons/metadata';

const rawMetadata = JSON.parse(
  await readFile(new URL('../dist/metadata.json', import.meta.url), 'utf-8'),
);
const { default: exportedJsonMetadata } = await import(
  '@infineon/infineon-icons/metadata.json',
  { with: { type: 'json' } },
);

assert.equal(METADATA_SCHEMA_VERSION, 1);
assert.deepEqual(iconMetadata, rawMetadata);
assert.deepEqual(exportedJsonMetadata, rawMetadata);
const makeJavaScriptIconName = (fileName) => fileName
  .replace(/\.svg$/i, '')
  .toLowerCase()
  .replace(/[^a-zA-Z0-9]+(.)/g, (match, character) => character.toUpperCase());

for (const [iconName, entry] of Object.entries(rawMetadata)) {
  assert.equal(iconName, makeJavaScriptIconName(entry.file));
  assert.equal(entry.name, iconName);
}

assert.deepEqual(getIconMetadata('filePdf16'), rawMetadata.filePdf16);
assert.equal(getIconMetadata('not-an-icon'), undefined);
assert(searchIconMetadata('PDF').some((entry) => entry.name === 'filePdf16'));
assert(searchIconMetadata('attachments').some((entry) => entry.name === 'file16'));
assert.equal(searchIconMetadata('').length, Object.keys(rawMetadata).length);

console.log(`Metadata API verified for ${Object.keys(rawMetadata).length} icons.`);