import type { VideoMetadata } from '../../../../shared/metadata';
import { getFormatCapability } from '@shared/formatCapabilities';

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

/**
 * Abstract base class for VideoFormat implementations to reduce redundancy.
 * Automatically resolves format capability metadata from shared/formatCapabilities.ts.
 */
export abstract class BaseFormat implements VideoFormat {
  readonly id: string;
  readonly label: string;
  readonly extension: string;
  readonly mimeType: string;
  readonly supportsAlpha: boolean;
  readonly supportsMetadata: boolean;
  readonly needsColorKeying: boolean;

  constructor(formatId: string) {
    const cap = getFormatCapability(formatId);
    if (!cap) {
      throw new Error(`Unknown format capability for ID: ${formatId}`);
    }
    this.id = cap.id;
    this.label = cap.label;
    this.extension = cap.extension;
    this.mimeType = cap.mimeType;
    this.supportsAlpha = cap.supportsAlpha;
    this.supportsMetadata = cap.supportsMetadata;
    this.needsColorKeying = cap.needsColorKeying;
  }

  abstract createEncoder(): VideoEncoder;

  async isSupported(_resolution: {
    width: number;
    height: number;
  }): Promise<boolean> {
    return true; // Most formats work everywhere; MediaBunny will override this.
  }
}
