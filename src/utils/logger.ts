export interface LoggerOptions {
  quiet?: boolean;
  json?: boolean;
  homepage?: string;
}

export class Logger {
  public readonly quiet: boolean;
  public readonly isJson: boolean;
  private readonly homepage: string;

  constructor(options: LoggerOptions = {}) {
    this.isJson = !!options.json;
    this.quiet = !!options.quiet || this.isJson;
    this.homepage =
      options.homepage || 'https://github.com/GehDoc/svg-to-video';
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
  public done(outputFile: string, data: Record<string, unknown> = {}): void {
    if (this.isJson) {
      console.log(
        JSON.stringify(
          {
            success: true,
            outputFile,
            ...data,
          },
          null,
          2
        )
      );
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
  public fatal(msg: string, details?: unknown): void {
    if (this.isJson) {
      console.log(
        JSON.stringify(
          {
            success: false,
            error: msg,
            ...(details ? { details: String(details) } : {}),
          },
          null,
          2
        )
      );
    } else {
      console.error(`❌ Error: ${msg}`);
      if (details) console.error(details);
    }
    process.exit(1);
  }
}
