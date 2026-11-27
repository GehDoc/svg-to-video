import { mergeMetadataComments } from './metadata.js';
import { crc32 } from './crc32.js';

export interface ApngMetadataOptions {
  title?: string;
  comment?: string;
  [key: string]: string | undefined;
}

export function injectApngMetadata(
  buffer: Uint8Array<ArrayBuffer>,
  metadata?: ApngMetadataOptions,
  version?: string
): Uint8Array<ArrayBuffer> {
  if (!metadata || (!metadata.title && !metadata.comment)) {
    return buffer;
  }

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
    const view = new DataView(chunk.buffer, chunk.byteOffset, chunk.byteLength);
    view.setUint32(0, chunkLength, false);
    chunk.set(chunkType, 4);
    chunk.set(chunkData, 8);

    const crcInput = new Uint8Array(chunkType.length + chunkLength);
    crcInput.set(chunkType);
    crcInput.set(chunkData, chunkType.length);
    view.setUint32(8 + chunkLength, crc32(crcInput), false);

    chunks.push(chunk);
  };

  if (metadata.title) addTextChunk('Title', metadata.title.trim());
  const descriptionText = mergeMetadataComments(
    metadata.comment?.trim(),
    version
  );
  addTextChunk('Description', descriptionText);

  if (buffer.length < 33) return buffer;
  const ihdrLength = new DataView(
    buffer.buffer,
    buffer.byteOffset + 8,
    4
  ).getUint32(0, false);
  const ihdrEnd = 8 + 4 + 4 + ihdrLength + 4;

  const newBuffer = new Uint8Array(
    buffer.length + chunks.reduce((acc, c) => acc + c.length, 0)
  );
  newBuffer.set(buffer.subarray(0, ihdrEnd), 0);
  let offset = ihdrEnd;
  for (const chunk of chunks) {
    newBuffer.set(chunk, offset);
    offset += chunk.length;
  }
  newBuffer.set(buffer.subarray(ihdrEnd), offset);
  return newBuffer;
}

export function setApngNumPlays(
  buffer: Uint8Array<ArrayBuffer>,
  numPlays: number
): Uint8Array<ArrayBuffer> {
  if (buffer.length < 8) return buffer;
  // Verify PNG signature (89 50 4E 47 0D 0A 1A 0A)
  if (
    buffer[0] !== 0x89 ||
    buffer[1] !== 0x50 ||
    buffer[2] !== 0x4e ||
    buffer[3] !== 0x47
  ) {
    return buffer;
  }

  const result = new Uint8Array(buffer);
  const view = new DataView(
    result.buffer,
    result.byteOffset,
    result.byteLength
  );

  let offset = 8;
  while (offset + 12 <= result.length) {
    const chunkLength = view.getUint32(offset, false);
    const chunkType = String.fromCharCode(
      result[offset + 4],
      result[offset + 5],
      result[offset + 6],
      result[offset + 7]
    );

    if (chunkType === 'acTL' && chunkLength >= 8) {
      // Chunk layout:
      // [offset..offset+3]: length (8)
      // [offset+4..offset+7]: 'acTL'
      // [offset+8..offset+11]: num_frames
      // [offset+12..offset+15]: num_plays
      view.setUint32(offset + 12, numPlays, false);

      // Recompute CRC over chunk type (4 bytes) + chunk data (chunkLength bytes)
      const crcInput = result.subarray(offset + 4, offset + 8 + chunkLength);
      const newCrc = crc32(crcInput);
      view.setUint32(offset + 8 + chunkLength, newCrc, false);
      break;
    }

    offset += 12 + chunkLength;
  }

  return result;
}
