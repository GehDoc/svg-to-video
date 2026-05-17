export interface VideoMetadata {
  title?: string;
  author?: string;
  description?: string;
  comment?: string;
  [key: string]: string | undefined;
}

export const mergeMetadataComments = (
  userComment?: string,
  version?: string
): string => {
  const toolName = 'svg-to-video';
  const versionStr = version ? ` v${version}` : '';
  const attribution = `Converted from SVG by ${toolName}${versionStr} (https://gehdoc.github.io/svg-to-video/)`;
  return userComment ? `${userComment} | ${attribution}` : attribution;
};
