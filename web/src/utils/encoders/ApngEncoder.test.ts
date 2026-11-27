import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ApngEncoder,
  injectApngMetadata,
  setApngNumPlays,
} from './ApngEncoder';

const mockPngHeader = new Uint8Array([
  0x89,
  0x50,
  0x4e,
  0x47,
  0x0d,
  0x0a,
  0x1a,
  0x0a, // Signature
  0x00,
  0x00,
  0x00,
  0x0d,
  0x49,
  0x48,
  0x44,
  0x52, // IHDR
  0x00,
  0x00,
  0x00,
  0x0a,
  0x00,
  0x00,
  0x00,
  0x0a,
  0x08,
  0x06,
  0x00,
  0x00,
  0x00,
  0x8d,
  0x32,
  0xcf,
  0xbd, // ...data...
  0x00,
  0x00,
  0x00,
  0x00,
  0x49,
  0x45,
  0x4e,
  0x44,
  0xae,
  0x42,
  0x60,
  0x82, // IEND
]);

vi.mock('upng-js', () => ({
  default: {
    encode: vi
      .fn()
      .mockReturnValue(
        new Uint8Array([
          0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00,
          0x0d, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x0a, 0x00, 0x00,
          0x00, 0x0a, 0x08, 0x06, 0x00, 0x00, 0x00, 0x8d, 0x32, 0xcf, 0xbd,
          0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60,
          0x82,
        ]).buffer
      ),
  },
}));

describe('injectApngMetadata', () => {
  it('should return original buffer when metadata is undefined or has no fields', () => {
    expect(injectApngMetadata(mockPngHeader, undefined)).toBe(mockPngHeader);
    expect(injectApngMetadata(mockPngHeader, {})).toBe(mockPngHeader);
  });

  it('should inject Title tEXt chunk when title only is set', () => {
    const result = injectApngMetadata(mockPngHeader, { title: 'My Title' });
    const text = new TextDecoder().decode(result);
    expect(text).toContain('Title');
    expect(text).toContain('My Title');
    expect(text).toContain('Description');
    expect(text).not.toContain('My Comment');
  });

  it('should inject Description tEXt chunk when comment only is set', () => {
    const result = injectApngMetadata(mockPngHeader, { comment: 'My Comment' });
    const text = new TextDecoder().decode(result);
    expect(text).not.toContain('Title');
    expect(text).toContain('Description');
    expect(text).toContain('My Comment');
  });

  it('should inject both Title and Description tEXt chunks when both are set', () => {
    const result = injectApngMetadata(mockPngHeader, {
      title: 'My Title',
      comment: 'My Comment',
    });
    const text = new TextDecoder().decode(result);
    expect(text).toContain('Title');
    expect(text).toContain('My Title');
    expect(text).toContain('Description');
    expect(text).toContain('My Comment');
  });
});

describe('ApngEncoder', () => {
  let encoder: ApngEncoder;
  const mockOptions = {
    width: 10,
    height: 10,
    fps: 10,
    duration: 1,
    isTransparent: true,
    mimeType: 'image/png',
    format: 'apng',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    encoder = new ApngEncoder();

    // Mock Canvas Context
    const mockCtx = {
      getImageData: vi.fn().mockReturnValue({
        data: new Uint8ClampedArray(10 * 10 * 4),
      }),
    };
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockCtx);
  });

  it('should call injectApngMetadata during finalize', async () => {
    const metadata = { title: 'Hello', comment: 'World' };
    const canvas = document.createElement('canvas');
    await encoder.init({ ...mockOptions, metadata }, canvas);
    await encoder.addFrame(0, 100);

    const blob = await encoder.finalize();
    const resultBuffer = new Uint8Array(await blob.arrayBuffer());

    const text = new TextDecoder().decode(resultBuffer);
    expect(text).toContain('Title');
    expect(text).toContain('Hello');
  });

  it('should patch acTL num_plays when loop is false', () => {
    // Construct a mock APNG with signature + IHDR + acTL chunk (length 8) + IEND
    const testApng = new Uint8Array([
      0x89,
      0x50,
      0x4e,
      0x47,
      0x0d,
      0x0a,
      0x1a,
      0x0a, // Signature
      // acTL chunk: length 8, 'acTL', num_frames = 5, num_plays = 0, crc (placeholder)
      0x00,
      0x00,
      0x00,
      0x08,
      0x61,
      0x63,
      0x54,
      0x4c, // 'acTL'
      0x00,
      0x00,
      0x00,
      0x05, // num_frames = 5
      0x00,
      0x00,
      0x00,
      0x00, // num_plays = 0 (infinite)
      0x00,
      0x00,
      0x00,
      0x00, // CRC
    ]);

    const patched = setApngNumPlays(testApng, 1);
    const view = new DataView(
      patched.buffer,
      patched.byteOffset,
      patched.byteLength
    );
    // Offset for acTL: 8 bytes sig + 4 bytes length + 4 bytes type + 4 bytes num_frames = 20
    expect(view.getUint32(20, false)).toBe(1);
  });
});
