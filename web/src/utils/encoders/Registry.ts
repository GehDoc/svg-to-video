import { VideoFormat } from './types';

export class FormatRegistry {
  private static instance: FormatRegistry;
  private formats: Map<string, VideoFormat> = new Map();

  private constructor() {}

  public static getInstance(): FormatRegistry {
    if (!FormatRegistry.instance) {
      FormatRegistry.instance = new FormatRegistry();
    }
    return FormatRegistry.instance;
  }

  public register(format: VideoFormat): void {
    this.formats.set(format.id, format);
  }

  public getFormat(id: string): VideoFormat | undefined {
    return this.formats.get(id);
  }

  public getAllFormats(): VideoFormat[] {
    return Array.from(this.formats.values());
  }

  public async discoverSupportedFormats(resolution: {
    width: number;
    height: number;
  }): Promise<VideoFormat[]> {
    const all = this.getAllFormats();
    const results = await Promise.all(
      all.map(async (f) => {
        const supported = await f.isSupported(resolution);
        return supported ? f : null;
      })
    );
    return results.filter((f): f is VideoFormat => f !== null);
  }
}

export const formatRegistry = FormatRegistry.getInstance();
