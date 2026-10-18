import { describe, it, expect, vi } from 'vitest';
import { compositeFrame } from './canvasCompositing.js';

describe('compositeFrame', () => {
  const mockImage = {} as CanvasImageSource;

  it('should clear canvas and draw image directly when no backgroundColor is provided', () => {
    const ctx = {
      clearRect: vi.fn(),
      drawImage: vi.fn(),
      fillRect: vi.fn(),
      globalCompositeOperation: 'source-over',
      fillStyle: '',
    } as unknown as CanvasRenderingContext2D;

    compositeFrame(ctx, mockImage, 100, 100);

    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 100, 100);
    expect(ctx.fillRect).not.toHaveBeenCalled();
    expect(ctx.drawImage).toHaveBeenCalledTimes(1);
    expect(ctx.drawImage).toHaveBeenCalledWith(mockImage, 0, 0, 100, 100);
  });

  it('should fill solid background when backgroundColor is provided and needsColorKeying is false', () => {
    const ctx = {
      clearRect: vi.fn(),
      drawImage: vi.fn(),
      fillRect: vi.fn(),
      globalCompositeOperation: 'source-over',
      fillStyle: '',
    } as unknown as CanvasRenderingContext2D;

    compositeFrame(ctx, mockImage, 200, 150, '#123456', false);

    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 200, 150);
    expect(ctx.fillStyle).toBe('#123456');
    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 200, 150);
    expect(ctx.globalCompositeOperation).toBe('source-over');
    expect(ctx.drawImage).toHaveBeenCalledTimes(1);
    expect(ctx.drawImage).toHaveBeenCalledWith(mockImage, 0, 0, 200, 150);
  });

  it('should perform source-in + source-over keying when needsColorKeying is true', () => {
    const ops: string[] = [];
    let gco = 'source-over';
    const ctx = {
      clearRect: vi.fn(),
      drawImage: vi.fn(() => ops.push(`drawImage:${gco}`)),
      fillRect: vi.fn(() => ops.push(`fillRect:${gco}`)),
      get globalCompositeOperation() {
        return gco;
      },
      set globalCompositeOperation(val: string) {
        gco = val;
      },
      fillStyle: '',
    } as unknown as CanvasRenderingContext2D;

    compositeFrame(ctx, mockImage, 300, 200, '#ff0000', true);

    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 300, 200);
    expect(ctx.fillStyle).toBe('#ff0000');
    expect(ops).toEqual([
      'drawImage:source-over',
      'fillRect:source-in',
      'drawImage:source-over',
    ]);
  });
});
