import { getFormatCapability } from '#shared/formatCapabilities.js';
import { CLIFormatGenerator, CLIFormatOptions } from './types.js';

export abstract class BaseCLIFormatGenerator implements CLIFormatGenerator {
  readonly id: string;
  readonly extensions: string[];
  readonly mimeType: string;
  readonly supportsAlpha: boolean;
  readonly needsColorKeying: boolean;

  constructor(formatId: string) {
    const cap = getFormatCapability(formatId);
    if (!cap) {
      throw new Error(`Unknown format capability for ID: ${formatId}`);
    }
    this.id = cap.id;
    this.extensions = [...cap.extensions];
    this.mimeType = cap.mimeType;
    this.supportsAlpha = cap.supportsAlpha;
    this.needsColorKeying = cap.needsColorKeying;
  }

  abstract buildFfmpegArgs(options: CLIFormatOptions): string[];
}
