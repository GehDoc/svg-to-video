import { CLIFormatGenerator } from './types.js';
import { Mp4FormatGenerator } from './generators/Mp4FormatGenerator.js';
import { WebmFormatGenerator } from './generators/WebmFormatGenerator.js';
import { GifFormatGenerator } from './generators/GifFormatGenerator.js';
import { ApngFormatGenerator } from './generators/ApngFormatGenerator.js';
import { MkvFormatGenerator } from './generators/MkvFormatGenerator.js';
import { MovFormatGenerator } from './generators/MovFormatGenerator.js';

export class CLIFormatRegistry {
  private generators: Map<string, CLIFormatGenerator> = new Map();

  constructor() {
    this.registerDefaults();
  }

  register(generator: CLIFormatGenerator): void {
    this.generators.set(generator.id.toLowerCase(), generator);
    for (const ext of generator.extensions) {
      const lower = ext.toLowerCase();
      this.generators.set(lower, generator);
      if (lower.startsWith('.')) {
        this.generators.set(lower.slice(1), generator);
      }
    }
  }

  get(formatOrExtension: string): CLIFormatGenerator | undefined {
    const key = formatOrExtension.toLowerCase().trim();
    return this.generators.get(key);
  }

  getAll(): CLIFormatGenerator[] {
    const unique = new Set<CLIFormatGenerator>();
    for (const gen of this.generators.values()) {
      unique.add(gen);
    }
    return Array.from(unique);
  }

  isSupported(formatOrExtension: string): boolean {
    return this.get(formatOrExtension) !== undefined;
  }

  getSupportedFormatNames(): string[] {
    const names = new Set<string>();
    for (const gen of this.getAll()) {
      names.add(gen.id);
      for (const ext of gen.extensions) {
        names.add(ext.startsWith('.') ? ext.slice(1) : ext);
      }
    }
    return Array.from(names);
  }

  resolveFormatAndExtension(
    rawFormat?: string,
    transparent?: boolean
  ): { generator: CLIFormatGenerator; format: string; extension: string } {
    const selectedFormat = rawFormat
      ? rawFormat.toLowerCase().trim()
      : transparent
        ? 'webm'
        : 'mp4';

    const generator = this.get(selectedFormat);
    if (!generator) {
      const supported = this.getSupportedFormatNames().join(', ');
      throw new Error(
        `Invalid format "${rawFormat}". Supported formats are: ${supported}.`
      );
    }

    const extension = selectedFormat.startsWith('.')
      ? selectedFormat
      : generator.extensions[0];

    return { generator, format: generator.id, extension };
  }

  private registerDefaults(): void {
    this.register(new Mp4FormatGenerator());
    this.register(new WebmFormatGenerator());
    this.register(new GifFormatGenerator());
    this.register(new ApngFormatGenerator());
    this.register(new MkvFormatGenerator());
    this.register(new MovFormatGenerator());
  }
}

export const formatRegistry = new CLIFormatRegistry();
