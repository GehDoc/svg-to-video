import { GIFEncoder, quantize, applyPalette, WriteFrameOpts } from 'gifenc';
import { VideoEncoder, EncoderOptions, BaseFormat } from './types';
import { injectGifMetadata as sharedInjectGifMetadata } from '@shared/gifMetadataInjector';
import pkg from '../../../../package.json';

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

    const { width, height, isTransparent, metadata } = this.options;
    const encoder = GIFEncoder();

    if (isTransparent) {
      // 1. Separate opaque pixels across all frames to dedicate the palette to visible colors
      let totalOpaque = 0;
      for (const f of this.frames) {
        for (let i = 3; i < f.data.length; i += 4) {
          if (f.data[i] >= 128) totalOpaque++;
        }
      }

      let palette: number[][];
      let opaquePalette: number[][] = [];
      const transparentIndex = 0;

      if (totalOpaque > 0) {
        const opaquePixels = new Uint8ClampedArray(totalOpaque * 4);
        let offset = 0;
        for (const f of this.frames) {
          for (let i = 0; i < f.data.length; i += 4) {
            if (f.data[i + 3] >= 128) {
              opaquePixels[offset++] = f.data[i];
              opaquePixels[offset++] = f.data[i + 1];
              opaquePixels[offset++] = f.data[i + 2];
              opaquePixels[offset++] = 255;
            }
          }
        }
        opaquePalette = quantize(opaquePixels, 255, { format: 'rgb565' });
        palette = [[0, 0, 0, 0], ...opaquePalette];
      } else {
        palette = [[0, 0, 0, 0]];
      }

      // 2. Encode frames with clean 1-bit transparency mapping
      const numPixels = width * height;
      for (let i = 0; i < this.frames.length; i++) {
        const frame = this.frames[i];
        const index = new Uint8Array(numPixels);
        const colorIndices =
          opaquePalette.length > 0
            ? applyPalette(frame.data, opaquePalette, 'rgb565')
            : new Uint8Array(numPixels);

        for (let p = 0; p < numPixels; p++) {
          if (frame.data[p * 4 + 3] < 128) {
            index[p] = transparentIndex;
          } else {
            index[p] = colorIndices[p] + 1; // offset by 1 because index 0 is transparent
          }
        }

        const options: WriteFrameOpts = {
          delay: Math.round(frame.delay),
          transparent: true,
          transparentIndex,
        };

        if (i === 0) {
          options.palette = palette;
        }

        encoder.writeFrame(index, width, height, options);
      }
    } else {
      // Non-transparent: Combine all frames to build a full 256-color palette
      const allPixels = new Uint8ClampedArray(
        this.frames.length * width * height * 4
      );
      this.frames.forEach((f, i) =>
        allPixels.set(f.data, i * width * height * 4)
      );

      const palette = quantize(allPixels, 256, { format: 'rgb565' });

      for (let i = 0; i < this.frames.length; i++) {
        const frame = this.frames[i];
        const index = applyPalette(frame.data, palette, 'rgb565');

        const options: WriteFrameOpts = {
          delay: Math.round(frame.delay),
        };

        if (i === 0) {
          options.palette = palette;
        }

        encoder.writeFrame(index, width, height, options);
      }
    }

    encoder.finish();
    let gifBytes: Uint8Array<ArrayBuffer> = new Uint8Array(encoder.buffer);

    if (metadata) {
      gifBytes = injectGifMetadata(gifBytes, metadata);
    }

    return new Blob([gifBytes], { type: 'image/gif' });
  }

  cancel(): void {
    this.frames = [];
  }

  get needsColorKeying(): boolean {
    return true;
  }
}
export function injectGifMetadata(
  gifBytes: Uint8Array<ArrayBuffer>,
  metadata?: EncoderOptions['metadata']
): Uint8Array<ArrayBuffer> {
  return sharedInjectGifMetadata(gifBytes, metadata, pkg.version);
}

export class GifFormat extends BaseFormat {
  constructor() {
    super('gif');
  }

  createEncoder(): VideoEncoder {
    return new GifEncoder();
  }
}
