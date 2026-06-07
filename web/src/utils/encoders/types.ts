import type { VideoMetadata } from '../../../../shared/metadata';

export interface EncoderOptions {
  width: number;
  height: number;
  fps: number;
  duration: number;
  backgroundColor?: string;
  isTransparent: boolean;
  metadata?: VideoMetadata;
  mimeType: string;
  format: string;
}

export interface VideoEncoder {
  /**
   * Initializes the encoder with required settings and the canvas to capture from.
   * Can be async for libraries that need setup (like MediaBunny/WebCodecs).
   */
  init(options: EncoderOptions, canvas: HTMLCanvasElement): Promise<void>;

  /**
   * Adds a single frame to the encoding sequence.
   * @param timestampMs The absolute timestamp of this frame in milliseconds.
   * @param durationMs The duration this frame should be displayed in milliseconds.
   */
  addFrame(timestampMs: number, durationMs: number): Promise<void>;

  /**
   * Finalizes the encoding process and returns the result as a Blob.
   */
  finalize(): Promise<Blob>;

  /**
   * Cancels any pending encoding operations and cleans up resources.
   */
  cancel(): void;
}
