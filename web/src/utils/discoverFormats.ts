import { formatRegistry } from './encoders/Registry';
import './encoders/Formats'; // Ensure formats are registered

export interface VideoFormat {
  id: string;
  label: string;
  extension: string;
  mimeType: string;
  supportsAlpha: boolean;
  supportsMetadata: boolean;
  needsColorKeying: boolean;
}

export const getFormatById = (id: string): VideoFormat | undefined => {
  return formatRegistry.getFormat(id);
};

export const getMimeTypeById = (id: string): string => {
  const format = getFormatById(id);
  if (!format) throw new Error(`Format ID not found: ${id}`);
  return format.mimeType;
};

export const isImageMimeType = (mimeType: string): boolean => {
  return !!mimeType && mimeType.startsWith('image/');
};

export const discoverFormats = async (): Promise<VideoFormat[]> => {
  return formatRegistry.discoverSupportedFormats({ width: 1280, height: 720 });
};
