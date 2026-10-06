import { formatRegistry } from '../formats/registry.js';

const MAX_DIMENSION_PIXELS = 7680; // Maximum supported resolution dimension (8K UHD)

/**
 * Validates CLI options
 */
export interface ValidateOptionsParams {
  duration?: number;
  scale: number;
  resolution: string;
  transparent: boolean;
  bgColor: string;
  format?: string;
  width?: number;
  height?: number;
}

export function validateOptions(options: ValidateOptionsParams): void {
  if (options.duration !== undefined && options.duration <= 0) {
    throw new Error('Duration must be a positive number.');
  }

  if (
    options.width !== undefined &&
    (isNaN(options.width) || options.width <= 0)
  ) {
    throw new Error('Width must be a positive number.');
  }

  if (options.width !== undefined && options.width > MAX_DIMENSION_PIXELS) {
    throw new Error(
      `Width exceeds maximum supported limit of ${MAX_DIMENSION_PIXELS} pixels.`
    );
  }

  if (
    options.height !== undefined &&
    (isNaN(options.height) || options.height <= 0)
  ) {
    throw new Error('Height must be a positive number.');
  }

  if (options.height !== undefined && options.height > MAX_DIMENSION_PIXELS) {
    throw new Error(
      `Height exceeds maximum supported limit of ${MAX_DIMENSION_PIXELS} pixels.`
    );
  }

  const isPreset = ['original', '1080p', '720p'].includes(options.resolution);
  const resMatch = /^(\d+)x(\d+)$/i.exec(options.resolution);

  if (!isPreset) {
    if (!resMatch) {
      throw new Error(
        `Invalid resolution option "${options.resolution}". Expected 'original', '1080p', '720p', or a custom dimension string like '1080x1080'.`
      );
    }
    const resW = parseInt(resMatch[1], 10);
    const resH = parseInt(resMatch[2], 10);
    if (resW <= 0 || resH <= 0) {
      throw new Error('Custom resolution dimensions must be positive numbers.');
    }
    if (resW > MAX_DIMENSION_PIXELS || resH > MAX_DIMENSION_PIXELS) {
      throw new Error(
        `Custom resolution dimensions must not exceed ${MAX_DIMENSION_PIXELS} pixels.`
      );
    }
    if (options.width !== undefined || options.height !== undefined) {
      throw new Error(
        '--width and --height cannot be used when a custom resolution string (e.g. 1080x1080) is provided.'
      );
    }
  }

  if (
    options.scale !== 1 &&
    (options.resolution !== 'original' ||
      options.width !== undefined ||
      options.height !== undefined)
  ) {
    throw new Error(
      '--scale can only be used with --resolution original and without custom width or height options.'
    );
  }

  if (options.transparent && options.bgColor !== '#ffffff') {
    throw new Error('--transparent and --bg-color cannot be used together.');
  }

  if (options.format && !formatRegistry.isSupported(options.format)) {
    const supported = formatRegistry.getSupportedFormatNames().join(', ');
    throw new Error(
      `Invalid format "${options.format}". Supported formats are: ${supported}.`
    );
  }
}
