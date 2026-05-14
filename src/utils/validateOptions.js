/**
 * Validates CLI options
 * @param {{ scale: number; resolution: string; transparent: boolean; bgColor: string }} options
 */
export function validateOptions(options) {
  if (options.scale !== 1 && options.resolution !== 'original') {
    throw new Error('--scale can only be used with --resolution original.');
  }

  if (options.transparent && options.bgColor !== '#ffffff') {
    throw new Error('--transparent and --bg-color cannot be used together.');
  }
}
