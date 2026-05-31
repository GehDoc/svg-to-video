import { describe, it, expect, vi } from 'vitest';
import { GifEncoder } from './GifEncoder';

// Mock GIF because of workers in vitest
vi.mock('gif.js.optimized', () => {
  return {
    default: class {
      finishedCb: ((blob: Blob) => void) | null = null;
      on(event: string, cb: (blob: Blob) => void) {
        if (event === 'finished') {
          this.finishedCb = cb;
        }
      }
      addFrame() {}
      render() {
        if (this.finishedCb) {
          this.finishedCb(new Blob(['mock-gif']));
        }
      }
    },
  };
});

describe('GifEncoder', () => {
  it('should initialize and finalize', async () => {
    const encoder = new GifEncoder(10, 10);
    const canvas = document.createElement('canvas');
    encoder.addFrame(canvas, 100);

    const result = await encoder.finalize();
    expect(result).toBeInstanceOf(Blob);
    expect(result.size).toBeGreaterThan(0);
  });
});
