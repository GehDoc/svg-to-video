import * as Mediabunny from 'mediabunny';

export interface VideoFormat {
  id: string;
  label: string;
  extension: string;
  mimeType: string;
  supportsAlpha: boolean;
  supportsMetadata: boolean;
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
];

/**
 * Gets a format by its ID.
 */
export const getFormatById = (id: string): VideoFormat | undefined => {
  return AVAILABLE_FORMATS.find((f) => f.id === id);
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
