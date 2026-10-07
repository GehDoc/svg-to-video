import { formatRegistry } from './encoders/Registry';
import { MEDIABUNNY_FORMATS } from './encoders/MediaBunnyEncoder';
import { ApngFormat } from './encoders/ApngEncoder';
import { GifFormat } from './encoders/GifEncoder';

export interface VideoFormat {
  id: string;
  label: string;
  extension: string;
  mimeType: string;
  supportsAlpha: boolean;
  supportsMetadata: boolean;
  needsColorKeying: boolean;
  isSupported?: boolean;
}

/**
 * Register all available formats into the registry.
 * This is called by discoverFormats to ensure the registry is populated.
 */
const registerFormats = () => {
  // Check if already registered to avoid duplicates
  if (formatRegistry.getAllFormats().length > 0) return;

  MEDIABUNNY_FORMATS.forEach((f) => formatRegistry.register(f));
  formatRegistry.register(new ApngFormat());
  formatRegistry.register(new GifFormat());
};

export const getFormatById = (id: string): VideoFormat | undefined => {
  registerFormats();
  const format = formatRegistry.getFormat(id);
  if (!format) return undefined;

  return {
    id: format.id,
    label: format.label,
    extension: format.extension,
    mimeType: format.mimeType,
    supportsAlpha: format.supportsAlpha,
    supportsMetadata: format.supportsMetadata,
    needsColorKeying: format.needsColorKeying,
  };
};

export const getMimeTypeById = (id: string): string => {
  const format = getFormatById(id);
  if (!format) throw new Error(`Format ID not found: ${id}`);
  return format.mimeType;
};

export const isImageMimeType = (mimeType: string): boolean => {
  return !!mimeType && mimeType.startsWith('image/');
};

export const discoverFormats = async (resolution?: {
  width: number;
  height: number;
}): Promise<VideoFormat[]> => {
  registerFormats();
  const formats = formatRegistry.getAllFormats();
  const res =
    resolution && resolution.width > 0 && resolution.height > 0
      ? resolution
      : { width: 1920, height: 1080 };

  return Promise.all(
    formats.map(async (f) => {
      let isSupported = true;
      try {
        isSupported = await f.isSupported(res);
      } catch {
        isSupported = false;
      }
      return {
        id: f.id,
        label: f.label,
        extension: f.extension,
        mimeType: f.mimeType,
        supportsAlpha: f.supportsAlpha,
        supportsMetadata: f.supportsMetadata,
        needsColorKeying: f.needsColorKeying,
        isSupported,
      };
    })
  );
};
