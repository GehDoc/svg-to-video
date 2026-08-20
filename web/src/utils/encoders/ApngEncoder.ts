import UPNG from 'upng-js';
import { VideoEncoder, EncoderOptions, BaseFormat } from './types';
import { crc32 } from './crc32';
import { mergeMetadataComments } from '@shared/metadata';
import pkg from '../../../../package.json';

export interface EncoderFrame {
  data: Uint8Array; // RGBA
  delay: number; // in milliseconds
}

export class ApngEncoder implements VideoEncoder {
  private frames: EncoderFrame[] = [];
  private options: EncoderOptions | null = null;
  private canvas: HTMLCanvasElement | null = null;

  async init(
    options: EncoderOptions,
    canvas: HTMLCanvasElement
  ): Promise<void> {
    this.options = options;
    this.canvas = canvas;
    this.frames = [];
  }

  async addFrame(_timestampMs: number, durationMs: number): Promise<void> {
    if (!this.canvas || !this.options) return;

    const { width, height, isTransparent } = this.options;
    const ctx = this.canvas.getContext('2d', { alpha: isTransparent });
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, width, height);
    this.frames.push({
      data: new Uint8Array(imageData.data),
      delay: durationMs,
    });
  }

  async finalize(): Promise<Blob> {
    if (!this.options) throw new Error('Encoder not initialized');
    const { width, height, mimeType, metadata } = this.options;

    const buffers = this.frames.map((f) => f.data.buffer) as ArrayBuffer[];
    const delays = this.frames.map((f) => f.delay);

    // UPNG.encode expects an array of ArrayBuffers (one per frame)
    let buffer = new Uint8Array(UPNG.encode(buffers, width, height, 0, delays));

    // Inject Metadata (tEXt chunks)
    if (metadata && (metadata.title || metadata.comment)) {
      const chunks: Uint8Array[] = [];

      const addTextChunk = (keyword: string, text: string) => {
        const textBytes = new TextEncoder().encode(text);
        const keywordBytes = new TextEncoder().encode(keyword);
        const chunkData = new Uint8Array(
          keywordBytes.length + 1 + textBytes.length
        );
        chunkData.set(keywordBytes, 0);
        chunkData.set([0], keywordBytes.length);
        chunkData.set(textBytes, keywordBytes.length + 1);

        const chunkType = new TextEncoder().encode('tEXt');
        const chunkLength = chunkData.length;

        const chunk = new Uint8Array(12 + chunkLength);
        const view = new DataView(chunk.buffer);
        view.setUint32(0, chunkLength);
        chunk.set(chunkType, 4);
        chunk.set(chunkData, 8);

        const crcInput = new Uint8Array(chunkType.length + chunkLength);
        crcInput.set(chunkType);
        crcInput.set(chunkData, chunkType.length);
        view.setUint32(8 + chunkLength, crc32(crcInput));

        chunks.push(chunk);
      };

      if (metadata.title) addTextChunk('Title', metadata.title);
      const descriptionText = mergeMetadataComments(
        metadata.comment,
        pkg.version
      );
      addTextChunk('Description', descriptionText);

      // Insert after IHDR chunk
      // IHDR is chunk #1. The file starts with 8 bytes signature + 4 length + 4 type + IHDR data + 4 CRC.
      const ihdrLength = new DataView(
        buffer.buffer,
        buffer.byteOffset + 8,
        4
      ).getUint32(0, false);
      const ihdrEnd = 8 + 4 + 4 + ihdrLength + 4;

      const newBuffer = new Uint8Array(
        buffer.length + chunks.reduce((acc, c) => acc + c.length, 0)
      );
      newBuffer.set(buffer.slice(0, ihdrEnd), 0);
      let offset = ihdrEnd;
      for (const chunk of chunks) {
        newBuffer.set(chunk, offset);
        offset += chunk.length;
      }
      newBuffer.set(buffer.slice(ihdrEnd), offset);
      buffer = newBuffer;
    }

    return new Blob([buffer], { type: mimeType });
  }

  cancel(): void {
    this.frames = [];
  }

  get needsColorKeying(): boolean {
    return false;
  }
}

export class ApngFormat extends BaseFormat {
  readonly id = 'apng';
  readonly label = 'aPNG';
  readonly extension = '.png';
  readonly mimeType = 'image/png';
  override readonly supportsAlpha = true;
  override readonly supportsMetadata = true;

  createEncoder(): VideoEncoder {
    return new ApngEncoder();
  }
}
