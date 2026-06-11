import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GifEncoder } from './GifEncoder';
import * as gifenc from 'gifenc';

vi.mock('gifenc', async (importOriginal) => {
  const actual = await importOriginal<typeof import('gifenc')>();
  return {
    ...actual,
    quantize: vi.fn(),
    applyPalette: vi.fn(),
    GIFEncoder: vi.fn().mockReturnValue({
      writeFrame: vi.fn(),
      finish: vi.fn(),
      buffer: new Uint8Array(),
    }),
  };
});

describe('GifEncoder', () => {
  let encoder: GifEncoder;
  const mockOptions = {
    width: 10,
    height: 10,
    fps: 10,
    duration: 1,
    isTransparent: true,
    mimeType: 'image/gif',
    format: 'gif',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    encoder = new GifEncoder();

    // Mock Canvas Context
    const mockCtx = {
      getImageData: vi.fn().mockReturnValue({
        data: new Uint8ClampedArray(10 * 10 * 4),
      }),
    };
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockCtx);
  });

  it('should manually add transparent color if quantize fails to include it', async () => {
    // Mock quantize to return a palette without any transparent color (alpha 0)
    // We quantized for 255 colors, so we return 255 opaque colors.
    const opaquePalette: number[][] = Array.from({ length: 255 }, () => [
      255, 0, 0, 255,
    ]);
    vi.mocked(gifenc.quantize).mockReturnValue(opaquePalette);
    vi.mocked(gifenc.applyPalette).mockReturnValue(new Uint8Array(100));

    // Initialize and add a frame
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;
    await encoder.init(mockOptions, canvas);
    await encoder.addFrame(0, 100);

    // Should not throw
    await expect(encoder.finalize()).resolves.toBeDefined();

    // Verify quantize was called with 255
    expect(gifenc.quantize).toHaveBeenCalledWith(
      expect.any(Uint8ClampedArray),
      255,
      expect.any(Object)
    );

    // Verify palette was extended to 256
    expect(opaquePalette.length).toBe(256);
    expect(opaquePalette[255]).toEqual([0, 0, 0, 0]);

    // Verify GIFEncoder was called with the correct transparentIndex
    const mockGifObj = vi.mocked(gifenc.GIFEncoder)();
    expect(mockGifObj.writeFrame).toHaveBeenCalledWith(
      expect.any(Uint8Array),
      10,
      10,
      expect.objectContaining({
        transparent: true,
        transparentIndex: 255,
      })
    );
  });

  it('should use existing transparent color if quantize already included it', async () => {
    // Mock quantize to return a palette that ALREADY has a transparent color
    const paletteWithTrans: number[][] = Array.from({ length: 255 }, () => [
      255, 0, 0, 255,
    ]);
    paletteWithTrans[10] = [0, 0, 0, 0]; // Insert transparency at index 10
    vi.mocked(gifenc.quantize).mockReturnValue(paletteWithTrans);
    vi.mocked(gifenc.applyPalette).mockReturnValue(new Uint8Array(100));

    const canvas = document.createElement('canvas');
    await encoder.init(mockOptions, canvas);
    await encoder.addFrame(0, 100);

    await encoder.finalize();

    // Verify palette was NOT extended (still 255 from quantize count)
    expect(paletteWithTrans.length).toBe(255);

    // Verify GIFEncoder used the existing index 10
    const mockGifObj = vi.mocked(gifenc.GIFEncoder)();
    expect(mockGifObj.writeFrame).toHaveBeenCalledWith(
      expect.any(Uint8Array),
      10,
      10,
      expect.objectContaining({
        transparent: true,
        transparentIndex: 10,
      })
    );
  });
});
