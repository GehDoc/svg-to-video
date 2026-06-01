import * as Mediabunny from 'mediabunny';

export interface VideoFormat {
  id: string;
  label: string;
  extension: string;
  mimeType: string;
  supportsAlpha: boolean;
  supportsMetadata: boolean;
  needsColorKeying?: boolean;
  // We store the class to instantiate it later
  OutputFormatClass: new () => Mediabunny.OutputFormat;
}

export const AVAILABLE_FORMATS: VideoFormat[] = [
  {
    id: 'mp4',
    label: 'MP4',
    extension: '.mp4',
    mimeType: 'video/mp4',
    supportsAlpha: false,
    supportsMetadata: true,
    OutputFormatClass: Mediabunny.Mp4OutputFormat,
  },
  {
    id: 'webm',
    label: 'WebM',
    extension: '.webm',
    mimeType: 'video/webm',
    supportsAlpha: true,
    supportsMetadata: true,
    OutputFormatClass: Mediabunny.WebMOutputFormat,
  },
  {
    id: 'mkv',
    label: 'MKV',
    extension: '.mkv',
    mimeType: 'video/x-matroska',
    supportsAlpha: true,
    supportsMetadata: true,
    OutputFormatClass: Mediabunny.MkvOutputFormat,
  },
  {
    id: 'mov',
    label: 'MOV',
    extension: '.mov',
    mimeType: 'video/quicktime',
    supportsAlpha: false,
    supportsMetadata: true,
    OutputFormatClass: Mediabunny.MovOutputFormat,
  },
  {
    id: 'apng',
    label: 'aPNG',
    extension: '.png',
    mimeType: 'image/png',
    supportsAlpha: true,
    supportsMetadata: false,
    OutputFormatClass: class extends Mediabunny.OutputFormat {
      get fileExtension() {
        return '.png';
      }
      get mimeType() {
        return 'image/png';
      }
      getSupportedCodecs(): Mediabunny.MediaCodec[] {
        return [];
      }
      getSupportedTrackCounts(): Mediabunny.TrackCountLimits {
        return {
          video: { min: 1, max: 1 },
          audio: { min: 0, max: 0 },
          subtitle: { min: 0, max: 0 },
          total: { min: 1, max: 1 },
        };
      }
      get supportsVideoRotationMetadata() {
        return false;
      }
      get supportsTimestampedMediaData() {
        return true;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      _createMuxer(): any {
        return null;
      }
      get _name() {
        return 'aPNG';
      }
    },
  },
  {
    id: 'gif',
    label: 'GIF',
    extension: '.gif',
    mimeType: 'image/gif',
    supportsAlpha: true,
    supportsMetadata: false,
    needsColorKeying: true,
    OutputFormatClass: class extends Mediabunny.OutputFormat {
      get fileExtension() {
        return '.gif';
      }
      get mimeType() {
        return 'image/gif';
      }
      getSupportedCodecs(): Mediabunny.MediaCodec[] {
        return [];
      }
      getSupportedTrackCounts(): Mediabunny.TrackCountLimits {
        return {
          video: { min: 1, max: 1 },
          audio: { min: 0, max: 0 },
          subtitle: { min: 0, max: 0 },
          total: { min: 1, max: 1 },
        };
      }
      get supportsVideoRotationMetadata() {
        return false;
      }
      get supportsTimestampedMediaData() {
        return true;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      _createMuxer(): any {
        return null;
      }
      get _name() {
        return 'GIF';
      }
    },
  },
];

/**
 * Gets a format by its ID.
 */
export const getFormatById = (id: string): VideoFormat | undefined => {
  return AVAILABLE_FORMATS.find((f) => f.id === id);
};

/**
 * Gets the MIME type for a given format ID.
 * Throws if format is not found.
 */
export const getMimeTypeById = (id: string): string => {
  const format = getFormatById(id);
  if (!format) {
    throw new Error(
      `Critical Error: Format info not found for format ID: ${id}`
    );
  }
  return format.mimeType;
};

/**
 * Checks if a MIME type refers to an image format.
 */
export const isImageMimeType = (mimeType: string): boolean => {
  return mimeType.startsWith('image/');
};

/**
 * Discovers the video formats supported by the current browser.
 */
export const discoverFormats = async (): Promise<VideoFormat[]> => {
  const encodableFormats: VideoFormat[] = [];

  for (const format of AVAILABLE_FORMATS) {
    try {
      const instance = new format.OutputFormatClass();
      const codecs = instance.getSupportedVideoCodecs();

      // For custom formats like aPNG or GIF that don't use WebCodecs,
      // we bypass the encodable codec check.
      if (['apng', 'gif', 'gif-transparent'].includes(format.id)) {
        encodableFormats.push({
          ...format,
          extension: instance.fileExtension,
          mimeType: instance.mimeType,
        });
        continue;
      }

      // Check if at least one codec is encodable in the current browser.
      // We use a standard 720p resolution for the check.
      const bestCodec = await Mediabunny.getFirstEncodableVideoCodec(codecs, {
        width: 1280,
        height: 720,
      });

      if (bestCodec) {
        encodableFormats.push({
          ...format,
          // Use the actual extension and MIME type from the Mediabunny instance
          extension: instance.fileExtension,
          mimeType: instance.mimeType,
        });
      }
    } catch (e) {
      // If the format is not supported or fails to initialize, skip it
      console.warn(
        `Format ${format.id} is not supported in this environment:`,
        e
      );
    }
  }

  return encodableFormats;
};
