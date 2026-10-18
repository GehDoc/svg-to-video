/**
 * Composites an image onto a 2D canvas context, handling background colors and color keying.
 *
 * When `needsColorKeying` is true (e.g. for transparent GIF exports):
 * - The canvas background remains transparent.
 * - Semi-transparent anti-aliased edge pixels are keyed against `backgroundColor`
 *   using 'source-in' + 'source-over' compositing to prevent halos.
 *
 * When `needsColorKeying` is false:
 * - If `backgroundColor` is provided, fills the canvas with that solid background.
 * - Draws the image source on top.
 */
export function compositeFrame(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  width: number,
  height: number,
  backgroundColor?: string,
  needsColorKeying?: boolean
): void {
  ctx.clearRect(0, 0, width, height);
  if (backgroundColor) {
    if (needsColorKeying) {
      ctx.drawImage(source, 0, 0, width, height);
      ctx.globalCompositeOperation = 'source-in';
    }
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
  }
  ctx.drawImage(source, 0, 0, width, height);
}
