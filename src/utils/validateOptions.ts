import { formatRegistry } from '../formats/registry.js';

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
  bitrate?: string;
  crf?: number;
  quality?: number;
}

export function validateOptions(options: ValidateOptionsParams): void {
  if (options.duration !== undefined && options.duration <= 0) {
    throw new Error('Duration must be a positive number.');
  }

  if (
    options.crf !== undefined &&
    (isNaN(options.crf) || options.crf < 0 || options.crf > 63)
  ) {
    throw new Error('CRF value must be a number between 0 and 63.');
  }

  if (
    options.quality !== undefined &&
    (isNaN(options.quality) || options.quality < 1 || options.quality > 100)
  ) {
    throw new Error('Quality value must be a number between 1 and 100.');
  }

  if (
    options.bitrate !== undefined &&
    !/^\d+[kKmMgG]?$/.test(options.bitrate)
  ) {
    throw new Error(
      'Invalid bitrate format. Expected format like "2000k" or "5M".'
    );
  }

  if (options.scale !== 1 && options.resolution !== 'original') {
    throw new Error('--scale can only be used with --resolution original.');
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
