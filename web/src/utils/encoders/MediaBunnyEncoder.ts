import * as Mediabunny from 'mediabunny';
import { VideoEncoder, EncoderOptions } from './types';
import { mergeMetadataComments } from '@shared/metadata';
import type { VideoMetadata } from '@shared/metadata';
import pkg from '../../../../package.json';
import { getFormatById } from '../discoverFormats';

export class MediaBunnyEncoder implements VideoEncoder {
  private options: EncoderOptions | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private target: Mediabunny.BufferTarget | null = null;
  private output: Mediabunny.Output | null = null;
  private source: Mediabunny.CanvasSource | null = null;

  async init(
    options: EncoderOptions,
    canvas: HTMLCanvasElement
  ): Promise<void> {
    this.options = options;
    this.canvas = canvas;

    const formatInfo = getFormatById(options.format);
    if (!formatInfo) throw new Error(`Unknown format: ${options.format}`);

    const outputFormat = new formatInfo.OutputFormatClass();
    const videoCodec = await Mediabunny.getFirstEncodableVideoCodec(
      outputFormat.getSupportedVideoCodecs(),
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
      format: outputFormat,
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
}
