export interface CLIFormatOptions {
  outputFileName: string;
  fps: number;
  padWidth: number;
  hold: number;
  outDir: string;
  transparent: boolean;
  metadata?: string[];
  inputPattern: string;
  pkgVersion: string;
  bitrate?: string;
  crf?: number;
  quality?: number;
  loop?: number | boolean;
  noLoop?: boolean;
}

export interface CLIFormatGenerator {
  readonly id: string;
  readonly extensions: string[];
  readonly mimeType: string;
  readonly supportsAlpha: boolean;
  readonly supportsLoop: boolean;
  readonly needsColorKeying: boolean;
  buildFfmpegArgs(options: CLIFormatOptions): string[];
  postProcess?(outputFilePath: string, options: CLIFormatOptions): void;
}
