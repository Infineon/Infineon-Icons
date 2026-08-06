import rawIconMetadata from './metadata.json' with { type: 'json' };

export const METADATA_SCHEMA_VERSION = 1;

const deepFreeze = (value) => {
  if (Array.isArray(value)) {
    value.forEach(deepFreeze);
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
  }

  return Object.freeze(value);
};

export const iconMetadata = deepFreeze(rawIconMetadata);

export const getIconMetadata = (icon) => iconMetadata[icon];

export const searchIconMetadata = (query) => {
  const normalizedQuery = query.trim().toLowerCase();
  const entries = Object.values(iconMetadata);
  if (!normalizedQuery) return entries;

  return entries.filter((entry) => [
    entry.name,
    entry.category,
    entry.metaphor,
    ...entry.useFor,
    ...entry.keywords,
  ].some((value) => value.toLowerCase().includes(normalizedQuery)));
};