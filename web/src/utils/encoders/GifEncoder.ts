import { GIFEncoder, quantize, WriteFrameOpts } from 'gifenc';
import { VideoEncoder, EncoderOptions, BaseFormat } from './types';
import { injectGifMetadata as sharedInjectGifMetadata } from '@shared/gifMetadataInjector';
import pkg from '../../../../package.json';

export const BAYER_8X8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

export function applyBayerPalette(
  frameData: Uint8ClampedArray,
  width: number,
  height: number,
  palette: number[][],
  isTransparent: boolean,
  colorCache: Map<number, number>
): Uint8Array {
  const numPixels = width * height;
  const index = new Uint8Array(numPixels);
  const spread = 12; // dither amplitude

  // For transparent images, palette[0] is [0, 0, 0, 0] and palette[1..] are opaque colors.
  const searchStart = isTransparent ? 1 : 0;

  for (let y = 0; y < height; y++) {
    const y8 = y % 8;
    for (let x = 0; x < width; x++) {
      const p = y * width + x;
      const offset = p * 4;

      if (isTransparent && frameData[offset + 3] < 128) {
        index[p] = 0;
        continue;
      }

      const threshold = BAYER_8X8[y8][x % 8] / 64 - 0.5;
      const dither = threshold * spread;

      const r = Math.min(
        255,
        Math.max(0, Math.round(frameData[offset] + dither))
      );
      const g = Math.min(
        255,
        Math.max(0, Math.round(frameData[offset + 1] + dither))
      );
      const b = Math.min(
        255,
        Math.max(0, Math.round(frameData[offset + 2] + dither))
      );

      const key = (r << 16) | (g << 8) | b;
      let bestIdx = colorCache.get(key);
      if (bestIdx === undefined) {
        let bestDist = Infinity;
        bestIdx = searchStart;
        for (let i = searchStart; i < palette.length; i++) {
          const pal = palette[i];
          const dr = pal[0] - r;
          const dg = pal[1] - g;
          const db = pal[2] - b;
          const dist = dr * dr + dg * dg + db * db;
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = i;
          }
        }
        colorCache.set(key, bestIdx);
      }
      index[p] = bestIdx;
    }
  }

  return index;
}

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

      // 2. Encode frames with clean 1-bit transparency mapping and Bayer dithering
      const colorCache = new Map<number, number>();
      for (let i = 0; i < this.frames.length; i++) {
        const frame = this.frames[i];
        const index =
          opaquePalette.length > 0
            ? applyBayerPalette(
                frame.data,
                width,
                height,
                palette,
                true,
                colorCache
              )
            : new Uint8Array(width * height);

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
      const colorCache = new Map<number, number>();

      for (let i = 0; i < this.frames.length; i++) {
        const frame = this.frames[i];
        const index = applyBayerPalette(
          frame.data,
          width,
          height,
          palette,
          false,
          colorCache
        );

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
