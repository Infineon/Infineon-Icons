export type IconName = string;

export interface IconAvoidance {
  case: string;
  useInsteadIcons?: readonly IconName[];
  useInsteadText?: string;
}

export interface IconMetadata {
  name: IconName;
  file: string;
  category: string;
  metaphor: string;
  useFor: readonly string[];
  keywords: readonly string[];
  avoidFor: readonly IconAvoidance[];
  figma: string;
}

export type IconMetadataMap = Readonly<Record<IconName, IconMetadata>>;

export const METADATA_SCHEMA_VERSION: 1;
export const iconMetadata: IconMetadataMap;
export const getIconMetadata: (icon: string) => IconMetadata | undefined;
export const searchIconMetadata: (query: string) => IconMetadata[];