import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GifEncoder, injectGifMetadata, applyBayerPalette } from './GifEncoder';
import * as gifenc from 'gifenc';

const mockGifHeader = new Uint8Array([
  0x47,
  0x49,
  0x46,
  0x38,
  0x39,
  0x61,
  0x3b, // Header + trailer 0x3B
]);

describe('injectGifMetadata', () => {
  it('should return original buffer when metadata is undefined or empty', () => {
    expect(injectGifMetadata(mockGifHeader, undefined)).toBe(mockGifHeader);
    expect(injectGifMetadata(mockGifHeader, {})).toBe(mockGifHeader);
  });

  it('should inject title only when title is set', () => {
    const result = injectGifMetadata(mockGifHeader, { title: 'My Title' });
    const text = new TextDecoder().decode(result);
    expect(text).toContain('My Title');
    expect(result[result.length - 1]).toBe(0x3b);
  });

  it('should inject comment only when comment is set', () => {
    const result = injectGifMetadata(mockGifHeader, { comment: 'My Comment' });
    const text = new TextDecoder().decode(result);
    expect(text).toContain('My Comment');
    expect(result[result.length - 1]).toBe(0x3b);
  });

  it('should inject combined title and comment when both are set', () => {
    const result = injectGifMetadata(mockGifHeader, {
      title: 'My Title',
      comment: 'My Comment',
    });
    const text = new TextDecoder().decode(result);
    expect(text).toContain('My Title - My Comment');
    expect(result[result.length - 1]).toBe(0x3b);
  });
});

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

  it('should reserve index 0 for transparent color and quantize opaque pixels with rgb565', async () => {
    const opaquePalette: number[][] = Array.from({ length: 255 }, () => [
      255, 0, 0, 255,
    ]);
    vi.mocked(gifenc.quantize).mockReturnValue(opaquePalette);
    vi.mocked(gifenc.applyPalette).mockReturnValue(new Uint8Array(100));

    // Mock Canvas Context with some opaque pixels (alpha = 255)
    const frameData = new Uint8ClampedArray(10 * 10 * 4);
    for (let i = 0; i < frameData.length; i += 4) {
      frameData[i] = 255;
      frameData[i + 1] = 0;
      frameData[i + 2] = 0;
      frameData[i + 3] = i < 200 ? 0 : 255; // 50 transparent pixels, 50 opaque pixels
    }
    const mockCtx = {
      getImageData: vi.fn().mockReturnValue({ data: frameData }),
    };
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockCtx);

    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;
    await encoder.init(mockOptions, canvas);
    await encoder.addFrame(0, 100);

    await expect(encoder.finalize()).resolves.toBeDefined();

    // Verify quantize was called with 255 colors and rgb565 format
    expect(gifenc.quantize).toHaveBeenCalledWith(
      expect.any(Uint8ClampedArray),
      255,
      { format: 'rgb565' }
    );

    // Verify GIFEncoder was called with transparentIndex 0 and palette prepended with [0,0,0,0]
    const mockGifObj = vi.mocked(gifenc.GIFEncoder)();
    expect(mockGifObj.writeFrame).toHaveBeenCalledWith(
      expect.any(Uint8Array),
      10,
      10,
      expect.objectContaining({
        transparent: true,
        transparentIndex: 0,
        palette: expect.arrayContaining([[0, 0, 0, 0]]),
      })
    );
  });

  it('should handle completely transparent frames without calling quantize', async () => {
    // Canvas with all alpha = 0
    const frameData = new Uint8ClampedArray(10 * 10 * 4); // all zeroes
    const mockCtx = {
      getImageData: vi.fn().mockReturnValue({ data: frameData }),
    };
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockCtx);

    const canvas = document.createElement('canvas');
    await encoder.init(mockOptions, canvas);
    await encoder.addFrame(0, 100);

    await encoder.finalize();

    expect(gifenc.quantize).not.toHaveBeenCalled();

    const mockGifObj = vi.mocked(gifenc.GIFEncoder)();
    expect(mockGifObj.writeFrame).toHaveBeenCalledWith(
      expect.any(Uint8Array),
      10,
      10,
      expect.objectContaining({
        transparent: true,
        transparentIndex: 0,
        palette: [[0, 0, 0, 0]],
      })
    );
  });

  it('should quantize 256 colors with rgb565 when isTransparent is false', async () => {
    const fullPalette: number[][] = Array.from({ length: 256 }, () => [
      0, 255, 0, 255,
    ]);
    vi.mocked(gifenc.quantize).mockReturnValue(fullPalette);
    vi.mocked(gifenc.applyPalette).mockReturnValue(new Uint8Array(100));

    const canvas = document.createElement('canvas');
    await encoder.init({ ...mockOptions, isTransparent: false }, canvas);
    await encoder.addFrame(0, 100);

    await encoder.finalize();

    expect(gifenc.quantize).toHaveBeenCalledWith(
      expect.any(Uint8ClampedArray),
      256,
      { format: 'rgb565' }
    );

    const mockGifObj = vi.mocked(gifenc.GIFEncoder)();
    expect(mockGifObj.writeFrame).toHaveBeenCalledWith(
      expect.any(Uint8Array),
      10,
      10,
      expect.not.objectContaining({
        transparent: true,
      })
    );
  });

  it('should call injectGifMetadata during finalize when metadata is provided', async () => {
    const palette: number[][] = Array.from({ length: 256 }, () => [
      0, 0, 0, 255,
    ]);
    vi.mocked(gifenc.quantize).mockReturnValue(palette);
    vi.mocked(gifenc.applyPalette).mockReturnValue(new Uint8Array(100));

    // Mock GIF buffer ending with trailer 0x3B
    const initialBuffer = new Uint8Array([
      0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x3b,
    ]);
    vi.mocked(gifenc.GIFEncoder).mockImplementation(() => ({
      writeFrame: vi.fn(),
      finish: vi.fn(),
      buffer: initialBuffer.buffer,
      bytes: vi.fn(),
      bytesView: vi.fn(),
      writeHeader: vi.fn(),
      reset: vi.fn(),
      stream: vi.fn(),
    }));

    const metadata = { title: 'Hello', comment: 'World' };
    const canvas = document.createElement('canvas');
    await encoder.init({ ...mockOptions, metadata }, canvas);
    await encoder.addFrame(0, 100);

    const blob = await encoder.finalize();
    const resultBuffer = new Uint8Array(await blob.arrayBuffer());

    // Content check: "Hello - World"
    const text = new TextDecoder().decode(resultBuffer);
    expect(text).toContain('Hello - World');
  });

  it('should pass repeat: -1 when loop option is false', async () => {
    const mockWriteFrame = vi.fn();
    vi.mocked(gifenc.GIFEncoder).mockImplementation(() => ({
      writeFrame: mockWriteFrame,
      finish: vi.fn(),
      buffer: new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x3b]).buffer,
      bytes: vi.fn(),
      bytesView: vi.fn(),
      writeHeader: vi.fn(),
      reset: vi.fn(),
      stream: vi.fn() as never,
    }));

    const canvas = document.createElement('canvas');
    await encoder.init({ ...mockOptions, loop: false }, canvas);
    await encoder.addFrame(0, 100);

    await encoder.finalize();

    expect(mockWriteFrame).toHaveBeenCalledWith(
      expect.anything(),
      10,
      10,
      expect.objectContaining({ repeat: -1 })
    );
  });

  it('should pass repeat: 0 when loop option is true or omitted', async () => {
    const mockWriteFrame = vi.fn();
    vi.mocked(gifenc.GIFEncoder).mockImplementation(() => ({
      writeFrame: mockWriteFrame,
      finish: vi.fn(),
      buffer: new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x3b]).buffer,
      bytes: vi.fn(),
      bytesView: vi.fn(),
      writeHeader: vi.fn(),
      reset: vi.fn(),
      stream: vi.fn() as never,
    }));

    const canvas = document.createElement('canvas');
    await encoder.init({ ...mockOptions, loop: true }, canvas);
    await encoder.addFrame(0, 100);

    await encoder.finalize();

    expect(mockWriteFrame).toHaveBeenCalledWith(
      expect.anything(),
      10,
      10,
      expect.objectContaining({ repeat: 0 })
    );
  });
});

describe('applyBayerPalette', () => {
  it('should map transparent pixels to index 0 when isTransparent is true', () => {
    const palette = [
      [0, 0, 0, 0],
      [255, 0, 0],
    ];
    // 2x2 image: pixel 0 transparent, pixel 1 opaque red
    const frameData = new Uint8ClampedArray([
      0,
      0,
      0,
      0, // transparent
      255,
      0,
      0,
      255, // red
      0,
      0,
      0,
      50, // transparent (< 128)
      255,
      0,
      0,
      200, // red (>= 128)
    ]);
    const colorCache = new Map<number, number>();
    const indices = applyBayerPalette(
      frameData,
      2,
      2,
      palette,
      true,
      colorCache
    );

    expect(indices[0]).toBe(0);
    expect(indices[1]).toBe(1);
    expect(indices[2]).toBe(0);
    expect(indices[3]).toBe(1);
  });

  it('should strictly test alpha threshold boundary at 127 vs 128', () => {
    const palette = [
      [0, 0, 0, 0],
      [255, 0, 0],
    ];
    // 2x1 image: pixel 0 with alpha=127 (transparent), pixel 1 with alpha=128 (opaque)
    const frameData = new Uint8ClampedArray([
      255,
      0,
      0,
      127, // boundary: < 128 should map to 0
      255,
      0,
      0,
      128, // boundary: >= 128 should map to 1
    ]);
    const colorCache = new Map<number, number>();
    const indices = applyBayerPalette(
      frameData,
      2,
      1,
      palette,
      true,
      colorCache
    );

    expect(indices[0]).toBe(0);
    expect(indices[1]).toBe(1);
  });

  it('should apply ordered dithering to smooth gradients', () => {
    const palette = [
      [0, 0, 0],
      [255, 255, 255],
    ];
    // A mid-gray image (128, 128, 128)
    const frameData = new Uint8ClampedArray(8 * 8 * 4);
    for (let i = 0; i < frameData.length; i += 4) {
      frameData[i] = 128;
      frameData[i + 1] = 128;
      frameData[i + 2] = 128;
      frameData[i + 3] = 255;
    }
    const colorCache = new Map<number, number>();
    const indices = applyBayerPalette(
      frameData,
      8,
      8,
      palette,
      false,
      colorCache
    );

    // Dithering creates a pattern containing both index 0 (black) and index 1 (white)
    const hasZero = indices.some((idx) => idx === 0);
    const hasOne = indices.some((idx) => idx === 1);
    expect(hasZero).toBe(true);
    expect(hasOne).toBe(true);
  });
});
