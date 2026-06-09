import { GIFEncoder, quantize, applyPalette, WriteFrameOpts } from 'gifenc';
import { VideoEncoder, EncoderOptions, VideoFormat } from './types';

export class GifEncoder implements VideoEncoder {
  private frames: { data: Uint8ClampedArray; delay: number }[] = [];
  private options: EncoderOptions | null = null;
  private canvas: HTMLCanvasElement | null = null;

  async init(
    options: EncoderOptions,
    canvas: HTMLCanvasElement
  ): Promise<void> {
    this.options = options;
    this.canvas = canvas;
    this.frames = [];
  }

  async addFrame(_timestampMs: number, durationMs: number): Promise<void> {
    if (!this.canvas || !this.options) return;

    const { width, height, isTransparent } = this.options;

    // Create a temporary canvas or use the provided one to get imageData
    // Since we need to capture the current state, and the main canvas might be cleared/overwritten,
    // we should capture the imageData immediately.
    const ctx = this.canvas.getContext('2d', { alpha: isTransparent });
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, width, height);
    this.frames.push({ data: imageData.data, delay: durationMs });
  }

  async finalize(): Promise<Blob> {
    if (!this.options) throw new Error('Encoder not initialized');

    const { width, height, isTransparent } = this.options;
    const encoder = GIFEncoder();

    const format = isTransparent ? 'rgba4444' : 'rgb565';

    // Combine all frames to build a comprehensive palette
    const allPixels = new Uint8ClampedArray(
      this.frames.length * width * height * 4
    );
    this.frames.forEach((f, i) =>
      allPixels.set(f.data, i * width * height * 4)
    );

    // 1. Generate palette
    const palette = quantize(allPixels, 256, { format });
    const transparentIndex = isTransparent
      ? palette.findIndex(([_r, _g, _b, a]) => a === 0)
      : -1;

    if (isTransparent && transparentIndex === -1) {
      throw new Error('Transparent color specified but not found in palette');
    }

    // 2. Encode frames
    for (let i = 0; i < this.frames.length; i++) {
      const frame = this.frames[i];

      const index = applyPalette(frame.data, palette, format);

      const options: WriteFrameOpts = {
        delay: Math.round(frame.delay),
      };

      if (isTransparent) {
        options.transparent = true;
        options.transparentIndex = transparentIndex;
      }

      if (i === 0) {
        options.palette = palette;
      }

      encoder.writeFrame(index, width, height, options);
    }

    encoder.finish();
    const buffer = encoder.buffer;
    return new Blob([buffer], { type: 'image/gif' });
  }

  cancel(): void {
    this.frames = [];
  }

  get needsColorKeying(): boolean {
    return true;
  }
}

export class GifFormat implements VideoFormat {
  readonly id = 'gif';
  readonly label = 'GIF';
  readonly extension = '.gif';
  readonly mimeType = 'image/gif';
  readonly supportsAlpha = true;
  readonly supportsMetadata = false;
  readonly needsColorKeying = true;

  createEncoder(): VideoEncoder {
    return new GifEncoder();
  }

  async isSupported(): Promise<boolean> {
    return true;
  }
}
