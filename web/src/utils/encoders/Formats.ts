import * as Mediabunny from 'mediabunny';
import { VideoFormat, VideoEncoder } from './types';
import { MediaBunnyEncoder } from './MediaBunnyEncoder';
import { ApngEncoder } from './ApngEncoder';
import { GifEncoder } from './GifEncoder';
import { formatRegistry } from './Registry';

class MediaBunnyFormat implements VideoFormat {
  constructor(
    public readonly id: string,
    public readonly label: string,
    private OutputFormatClass: new () => Mediabunny.OutputFormat,
    public readonly supportsAlpha: boolean,
    public readonly supportsMetadata: boolean
  ) {}

  get extension(): string {
    return new this.OutputFormatClass().fileExtension;
  }

  get mimeType(): string {
    return new this.OutputFormatClass().mimeType;
  }

  createEncoder(): VideoEncoder {
    return new MediaBunnyEncoder(new this.OutputFormatClass());
  }

  async isSupported(resolution: {
    width: number;
    height: number;
  }): Promise<boolean> {
    try {
      const instance = new this.OutputFormatClass();
      const codecs = instance.getSupportedVideoCodecs();
      const bestCodec = await Mediabunny.getFirstEncodableVideoCodec(
        codecs,
        resolution
      );
      return !!bestCodec;
    } catch {
      return false;
    }
  }

  get needsColorKeying(): boolean {
    return false;
  }
}

class ApngFormat implements VideoFormat {
  readonly id = 'apng';
  readonly label = 'aPNG';
  readonly extension = '.png';
  readonly mimeType = 'image/png';
  readonly supportsAlpha = true;
  readonly supportsMetadata = false;
  readonly needsColorKeying = false;

  createEncoder(): VideoEncoder {
    return new ApngEncoder();
  }

  async isSupported(): Promise<boolean> {
    return true;
  }
}

class GifFormat implements VideoFormat {
  readonly id = 'gif';
  readonly label = 'GIF';
  readonly extension = '.gif';
  readonly mimeType = 'image/gif';
  readonly supportsAlpha = true;
  readonly supportsMetadata = false;
  readonly needsColorKeying = true;

  createEncoder(): VideoEncoder {
    return new GifEncoder();
  }

  async isSupported(): Promise<boolean> {
    return true;
  }
}

// Register default formats
formatRegistry.register(
  new MediaBunnyFormat('mp4', 'MP4', Mediabunny.Mp4OutputFormat, false, true)
);
formatRegistry.register(
  new MediaBunnyFormat('webm', 'WebM', Mediabunny.WebMOutputFormat, true, true)
);
formatRegistry.register(
  new MediaBunnyFormat('mkv', 'MKV', Mediabunny.MkvOutputFormat, true, true)
);
formatRegistry.register(
  new MediaBunnyFormat('mov', 'MOV', Mediabunny.MovOutputFormat, false, true)
);
formatRegistry.register(new ApngFormat());
formatRegistry.register(new GifFormat());
