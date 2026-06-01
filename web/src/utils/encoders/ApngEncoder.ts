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

    // UPNG.encode expects an array of ArrayBuffers (one per frame)
    // The frames should be in RGBA format (as added in `addFrame`)
    return UPNG.encode(buffers, this.width, this.height, 0, delays);
  }
}
