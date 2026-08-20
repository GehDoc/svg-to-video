import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApngEncoder } from './ApngEncoder';

vi.mock('upng-js', () => ({
  default: {
    encode: vi.fn().mockReturnValue(
      new Uint8Array([
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
      ]).buffer
    ),
  },
}));

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

  it('should inject tEXt chunks when metadata is provided', async () => {
    const metadata = { title: 'Hello', comment: 'World' };
    const canvas = document.createElement('canvas');
    await encoder.init({ ...mockOptions, metadata }, canvas);
    await encoder.addFrame(0, 100);

    const blob = await encoder.finalize();
    const resultBuffer = new Uint8Array(await blob.arrayBuffer());

    // Check for "tEXt" chunk type (0x74 0x45 0x58 0x74)
    let found = false;
    for (let i = 0; i < resultBuffer.length - 4; i++) {
      if (
        resultBuffer[i] === 0x74 &&
        resultBuffer[i + 1] === 0x45 &&
        resultBuffer[i + 2] === 0x58 &&
        resultBuffer[i + 3] === 0x74
      ) {
        found = true;
        break;
      }
    }
    expect(found).toBe(true);

    // Check for Title and Description content
    const text = new TextDecoder().decode(resultBuffer);
    expect(text).toContain('Title');
    expect(text).toContain('Hello');
    expect(text).toContain('Description');
    expect(text).toContain('World');
  });
});
