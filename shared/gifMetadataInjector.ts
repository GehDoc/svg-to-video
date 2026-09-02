import { mergeMetadataComments } from './metadata.js';

export interface GifMetadataOptions {
  title?: string;
  comment?: string;
  [key: string]: string | undefined;
}

export function injectGifMetadata(
  gifBytes: Uint8Array<ArrayBuffer>,
  metadata?: GifMetadataOptions,
  version?: string
): Uint8Array<ArrayBuffer> {
  if (!metadata || (!metadata.title && !metadata.comment)) {
    return gifBytes;
  }

  const title = metadata.title?.trim();
  const rawComment = metadata.comment?.trim();
  const commentWithAttribution = mergeMetadataComments(rawComment, version);

  const commentText = title
    ? `${title} - ${commentWithAttribution}`
    : commentWithAttribution;

  const textBytes = new TextEncoder().encode(commentText);
  const commentBlocks: number[] = [0x21, 0xfe];

  let offset = 0;
  while (offset < textBytes.length) {
    const blockSize = Math.min(255, textBytes.length - offset);
    commentBlocks.push(blockSize);
    for (let i = 0; i < blockSize; i++) {
      commentBlocks.push(textBytes[offset + i]);
    }
    offset += blockSize;
  }
  commentBlocks.push(0x00);

  const commentExtension = new Uint8Array(commentBlocks);

  const trailerIndex = gifBytes.lastIndexOf(0x3b);
  const insertOffset = trailerIndex !== -1 ? trailerIndex : gifBytes.length;

  const finalBuffer = new Uint8Array(gifBytes.length + commentExtension.length);
  finalBuffer.set(gifBytes.subarray(0, insertOffset), 0);
  finalBuffer.set(commentExtension, insertOffset);
  finalBuffer.set(
    gifBytes.subarray(insertOffset),
    insertOffset + commentExtension.length
  );
  return finalBuffer;
}
