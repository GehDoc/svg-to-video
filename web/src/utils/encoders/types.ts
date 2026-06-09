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
  init(options: EncoderOptions, canvas: HTMLCanvasElement): Promise<void>;
  addFrame(timestampMs: number, durationMs: number): Promise<void>;
  finalize(): Promise<Blob>;
  cancel(): void;
  /**
   * Runtime hook for the renderer to know if this encoder instance
   * requires color keying to handle transparency.
   */
  readonly needsColorKeying?: boolean;
}

/**
 * Enhanced VideoFormat interface acting as a Factory for encoders.
 */
export interface VideoFormat {
  readonly id: string;
  readonly label: string;
  readonly extension: string;
  readonly mimeType: string;
  readonly supportsAlpha: boolean;
  readonly supportsMetadata: boolean;

  /**
   * Creates a new instance of the encoder for this format.
   */
  createEncoder(): VideoEncoder;

  /**
   * Checks if this format is supported in the current environment.
   */
  isSupported(resolution: { width: number; height: number }): Promise<boolean>;

  /**
   * Returns true if this format requires color keying for transparency.
   */
  readonly needsColorKeying: boolean;
}
