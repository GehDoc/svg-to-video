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
