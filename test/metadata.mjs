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
assert.deepEqual(getIconMetadata('file-pdf'), rawMetadata['file-pdf']);
assert.equal(getIconMetadata('not-an-icon'), undefined);
assert(searchIconMetadata('PDF').some((entry) => entry.name === 'file-pdf'));
assert(searchIconMetadata('attachments').some((entry) => entry.name === 'file'));
assert.equal(searchIconMetadata('').length, Object.keys(rawMetadata).length);

console.log(`Metadata API verified for ${Object.keys(rawMetadata).length} icons.`);