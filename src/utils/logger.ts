export interface LoggerOptions {
  quiet?: boolean;
  json?: boolean;
  homepage: string;
}

export interface LoggerJsonSuccessOutput {
  success: true;
  outputFile: string;
  duration: number;
  fps: number;
  format: string;
  totalFrames: number;
  resolution: string;
  transparent: boolean;
}

export interface LoggerJsonErrorOutput {
  success: false;
  error: string;
  details?: string;
}

export type LoggerJsonOutput = LoggerJsonSuccessOutput | LoggerJsonErrorOutput;
export type LoggerDoneData = Omit<
  LoggerJsonSuccessOutput,
  'success' | 'outputFile'
>;

export function isLoggerJsonOutput(obj: unknown): obj is LoggerJsonOutput {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'success' in obj &&
    typeof (obj as { success: unknown }).success === 'boolean'
  );
}

export class Logger {
  public readonly quiet: boolean;
  public readonly isJson: boolean;
  private readonly homepage: string;

  constructor(options: LoggerOptions) {
    this.isJson = !!options.json;
    this.quiet = !!options.quiet || this.isJson;
    this.homepage = options.homepage;
  }

  /**
   * Log standard informative messages (suppressed in quiet/json mode)
   */
  public info(...args: unknown[]): void {
    if (!this.quiet) {
      console.log(...args);
    }
  }

  /**
   * Write raw progress strings to stdout (e.g., \r progress bar - suppressed in quiet/json mode)
   */
  public writeProgress(msg: string): void {
    if (!this.quiet) {
      process.stdout.write(msg);
    }
  }

  /**
   * Log warning messages (suppressed in quiet/json mode)
   */
  public warn(...args: unknown[]): void {
    if (!this.quiet) {
      console.warn(...args);
    }
  }

  /**
   * Log non-fatal error messages (suppressed in json mode to preserve unpolluted stdout)
   */
  public error(...args: unknown[]): void {
    if (!this.isJson) {
      console.error(...args);
    }
  }

  /**
   * Called at successful completion of conversion process.
   * Outputs JSON payload if --json is active, or friendly completion summary if not quiet.
   */
  public done(outputFile: string, data: LoggerDoneData): void {
    if (this.isJson) {
      const payload: LoggerJsonSuccessOutput = {
        success: true,
        outputFile,
        ...data,
      };
      console.log(JSON.stringify(payload, null, 2));
    } else if (!this.quiet) {
      console.log(`\n✅ Done! File saved to ${outputFile}`);
      console.log(
        '\x1b[2m%s\x1b[0m',
        `Love this tool? Star it on GitHub: ${this.homepage}`
      );
    }
  }

  /**
   * Output fatal error (as JSON or stderr string) and terminate execution
   */
  public fatal(msg: string, details?: unknown): never {
    if (this.isJson) {
      const payload: LoggerJsonErrorOutput = {
        success: false,
        error: msg,
        ...(details ? { details: String(details) } : {}),
      };
      console.log(JSON.stringify(payload, null, 2));
    } else {
      console.error(`❌ Error: ${msg}`);
      if (details) console.error(details);
    }
    process.exit(1);
  }
}
