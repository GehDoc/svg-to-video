import * as Mediabunny from 'mediabunny';
import { VideoEncoder, EncoderOptions, VideoFormat } from './types';
import { mergeMetadataComments } from '@shared/metadata';
import type { VideoMetadata } from '@shared/metadata';
import pkg from '../../../../package.json';

export class MediaBunnyEncoder implements VideoEncoder {
  private options: EncoderOptions | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private target: Mediabunny.BufferTarget | null = null;
  private output: Mediabunny.Output | null = null;
  private source: Mediabunny.CanvasSource | null = null;

  constructor(private outputFormat: Mediabunny.OutputFormat) {}

  async init(
    options: EncoderOptions,
    canvas: HTMLCanvasElement
  ): Promise<void> {
    this.options = options;
    this.canvas = canvas;

    const videoCodec = await Mediabunny.getFirstEncodableVideoCodec(
      this.outputFormat.getSupportedVideoCodecs(),
      {
        width: options.width,
        height: options.height,
      }
    );

    if (!videoCodec) {
      throw new Error('No supported video codec found.');
    }

    this.target = new Mediabunny.BufferTarget();
    this.output = new Mediabunny.Output({
      format: this.outputFormat,
      target: this.target,
    });

    const metadata: VideoMetadata = {};
    if (options.metadata?.title?.trim()) {
      metadata.title = options.metadata.title.trim();
    }
    metadata.comment = mergeMetadataComments(
      options.metadata?.comment?.trim(),
      pkg.version
    );
    this.output.setMetadataTags(metadata);

    this.source = new Mediabunny.CanvasSource(canvas, {
      codec: videoCodec as Mediabunny.VideoCodec,
      bitrate: Mediabunny.QUALITY_HIGH,
      alpha: options.isTransparent ? 'keep' : 'discard',
    });
    this.output.addVideoTrack(this.source);

    await this.output.start();
  }

  async addFrame(timestampMs: number, durationMs: number): Promise<void> {
    if (!this.source) return;
    // MediaBunny expects seconds
    await this.source.add(timestampMs / 1000, durationMs / 1000);
  }

  async finalize(): Promise<Blob> {
    if (!this.output || !this.target || !this.options) {
      throw new Error('Encoder not initialized');
    }

    await this.output.finalize();
    const resultBuffer = this.target.buffer;
    if (!resultBuffer) throw new Error('Output buffer is empty');

    return new Blob([resultBuffer], {
      type: this.options.mimeType,
    });
  }

  cancel(): void {
    // MediaBunny doesn't have an explicit cancel, but we can stop references
    this.output = null;
    this.target = null;
    this.source = null;
  }

  get needsColorKeying(): boolean {
    return false;
  }
}

export class MediaBunnyFormat implements VideoFormat {
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

export const MEDIABUNNY_FORMATS = [
  new MediaBunnyFormat('mp4', 'MP4', Mediabunny.Mp4OutputFormat, false, true),
  new MediaBunnyFormat('webm', 'WebM', Mediabunny.WebMOutputFormat, true, true),
  new MediaBunnyFormat('mkv', 'MKV', Mediabunny.MkvOutputFormat, true, true),
  new MediaBunnyFormat('mov', 'MOV', Mediabunny.MovOutputFormat, false, true),
];
