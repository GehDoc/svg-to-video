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
}

const ALLOWED_FORMATS = ['mp4', 'webm', 'mkv', 'mov', 'gif', 'apng', 'png'];

export function validateOptions(options: ValidateOptionsParams): void {
  if (options.duration !== undefined && options.duration <= 0) {
    throw new Error('Duration must be a positive number.');
  }

  if (options.scale !== 1 && options.resolution !== 'original') {
    throw new Error('--scale can only be used with --resolution original.');
  }

  if (options.transparent && options.bgColor !== '#ffffff') {
    throw new Error('--transparent and --bg-color cannot be used together.');
  }

  if (
    options.format &&
    !ALLOWED_FORMATS.includes(options.format.toLowerCase())
  ) {
    throw new Error(
      `Invalid format "${options.format}". Supported formats are: ${ALLOWED_FORMATS.join(', ')}.`
    );
  }
}
