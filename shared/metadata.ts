export interface VideoMetadata {
  title?: string;
  author?: string;
  description?: string;
  comment?: string;
  [key: string]: string | undefined;
}

export const mergeMetadataComments = (userComment?: string): string => {
  const attribution =
    'Converted from SVG with https://gehdoc.github.io/svg-to-video/';
  return userComment ? `${attribution} | ${userComment}` : attribution;
};
