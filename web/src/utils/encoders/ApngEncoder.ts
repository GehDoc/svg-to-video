import UPNG from 'upng-js';
import { VideoEncoder, EncoderOptions } from './types';

export interface EncoderFrame {
  data: Uint8Array; // RGBA
  delay: number; // in milliseconds
}

export class ApngEncoder implements VideoEncoder {
  private frames: EncoderFrame[] = [];
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
    const ctx = this.canvas.getContext('2d', { alpha: isTransparent });
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, width, height);
    this.frames.push({
      data: new Uint8Array(imageData.data),
      delay: durationMs,
    });
  }

  async finalize(): Promise<Blob> {
    if (!this.options) throw new Error('Encoder not initialized');
    const { width, height, mimeType } = this.options;

    const buffers = this.frames.map((f) => f.data.buffer) as ArrayBuffer[];
    const delays = this.frames.map((f) => f.delay);

    // UPNG.encode expects an array of ArrayBuffers (one per frame)
    // The frames should be in RGBA format (as added in `addFrame`)
    const buffer = UPNG.encode(buffers, width, height, 0, delays);
    return new Blob([buffer], { type: mimeType });
  }

  cancel(): void {
    this.frames = [];
  }
}
