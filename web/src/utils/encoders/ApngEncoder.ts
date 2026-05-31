import UPNG from 'upng-js';

export interface EncoderFrame {
  data: Uint8Array; // RGBA
  delay: number; // in milliseconds
}

export class ApngEncoder {
  private frames: EncoderFrame[] = [];
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  addFrame(data: Uint8Array, delayMs: number) {
    this.frames.push({ data, delay: delayMs });
  }

  async finalize(): Promise<ArrayBuffer> {
    const buffers = this.frames.map((f) => f.data.buffer) as ArrayBuffer[];
    const delays = this.frames.map((f) => f.delay);

    // UPNG.encode(frames, w, h, cnum, [delays])
    // cnum: number of colors in the palette. 0 for lossless PNG.
    return UPNG.encode(buffers, this.width, this.height, 0, delays);
  }
}
