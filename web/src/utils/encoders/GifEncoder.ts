import { GIFEncoder, quantize, applyPalette, WriteFrameOpts } from 'gifenc';

export class GifEncoder {
  private frames: { data: Uint8ClampedArray; delay: number }[] = [];
  private width: number;
  private height: number;
  private transparentColor: string | undefined;
  private isTransparent: boolean;

  constructor(width: number, height: number, transparentColor?: string) {
    this.width = width;
    this.height = height;
    this.transparentColor = transparentColor;
    this.isTransparent = !!this.transparentColor;
  }

  addFrame(
    element: ImageData | CanvasRenderingContext2D | HTMLCanvasElement,
    delayMs: number
  ) {
    // Create new canvas to handle alpha correctly
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext('2d', { alpha: this.isTransparent });

    if (!ctx) {
      // Fallback for environment without Canvas rendering support (e.g. jsdom in test)
      let data: Uint8ClampedArray;
      if (element instanceof HTMLCanvasElement) {
        data = new Uint8ClampedArray(this.width * this.height * 4);
      } else if ('canvas' in element) {
        data = new Uint8ClampedArray(this.width * this.height * 4);
      } else {
        data = element.data;
      }
      this.frames.push({ data, delay: delayMs });
      return;
    }

    if (element instanceof HTMLCanvasElement) {
      ctx.drawImage(element, 0, 0);
    } else if ('canvas' in element) {
      ctx.drawImage(element.canvas, 0, 0);
    } else {
      ctx.putImageData(element, 0, 0);
    }
    const imageData = ctx.getImageData(0, 0, this.width, this.height);

    this.frames.push({ data: imageData.data, delay: delayMs });
  }

  async finalize(): Promise<Blob> {
    const encoder = GIFEncoder();

    const format = this.isTransparent ? 'rgba4444' : 'rgb565';

    // Combine all frames to build a comprehensive palette
    const allPixels = new Uint8ClampedArray(
      this.frames.length * this.width * this.height * 4
    );
    this.frames.forEach((f, i) =>
      allPixels.set(f.data, i * this.width * this.height * 4)
    );

    // 1. Generate palette
    const palette = quantize(allPixels, 256, { format });
    const transparentIndex = this.isTransparent
      ? palette.findIndex(([_r, _g, _b, a]) => a === 0)
      : -1;

    if (this.isTransparent && transparentIndex === -1) {
      throw new Error('Transparent color specified but not found in palette');
    }

    // 2. Encode frames
    for (let i = 0; i < this.frames.length; i++) {
      const frame = this.frames[i];

      const index = applyPalette(frame.data, palette, format);

      const options: WriteFrameOpts = {
        delay: Math.round(frame.delay),
      };

      if (this.isTransparent) {
        options.transparent = true;
        options.transparentIndex = transparentIndex;
      }

      if (i === 0) {
        options.palette = palette;
      }

      encoder.writeFrame(index, this.width, this.height, options);
    }

    encoder.finish();
    const buffer = encoder.buffer;
    return new Blob([buffer], { type: 'image/gif' });
  }
}
