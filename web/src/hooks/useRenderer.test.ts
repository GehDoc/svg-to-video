import { describe, it, expect, vi } from 'vitest';
import { getBestCodec } from './useRenderer';
import * as Mediabunny from 'mediabunny';

vi.mock('mediabunny', async () => {
  const actual = await vi.importActual('mediabunny');
  return {
    ...actual,
    getFirstEncodableVideoCodec: vi.fn().mockResolvedValue('vp9'),
    Mp4OutputFormat: class {
      getSupportedVideoCodecs() {
        return ['avc1'];
      }
    },
    WebMOutputFormat: class {
      getSupportedVideoCodecs() {
        return ['vp9'];
      }
    },
  };
});

describe('getBestCodec', () => {
  it('should select codec based on format', async () => {
    const codec = await getBestCodec(500, 500, 'webm');
    expect(codec).toBe('vp9');
    expect(Mediabunny.WebMOutputFormat).toHaveBeenCalled();
  });
});
