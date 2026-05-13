import { getFormatById } from './discoverFormats';

export const isTransparencySupported = (formatId: string): boolean => {
  const format = getFormatById(formatId);
  return !!format?.supportsAlpha;
};
