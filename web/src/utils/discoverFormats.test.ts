import { describe, it, expect, vi } from 'vitest';
import { discoverFormats } from './discoverFormats';

// Mock Mediabunny to avoid actual browser codec checks in test environment
vi.mock('mediabunny', () => {
  class MockOutputFormat {
    getSupportedCodecs() {
      return ['vp9'];
    }
    getSupportedVideoCodecs() {
      return ['vp9'];
    }
    get fileExtension() {
      return '.test';
    }
    get mimeType() {
      return 'video/test';
    }
  }
  return {
    OutputFormat: MockOutputFormat,
    Mp4OutputFormat: MockOutputFormat,
    WebMOutputFormat: MockOutputFormat,
    MkvOutputFormat: MockOutputFormat,
    MovOutputFormat: MockOutputFormat,
    getFirstEncodableVideoCodec: vi.fn().mockImplementation((codecs) => {
      // For testing, say any codec or even no codecs (for apng/gif) is encodable
      return Promise.resolve(codecs.length > 0 ? codecs[0] : 'mock-codec');
    }),
  };
});

describe('discoverFormats', () => {
  it('should discover supported formats, including aPNG and GIF', async () => {
    const formats = await discoverFormats();
    expect(formats.length).toBeGreaterThan(0);

    const ids = formats.map((f) => f.id);
    expect(ids).toContain('apng');
    expect(ids).toContain('gif');

    const apng = formats.find((f) => f.id === 'apng');
    expect(apng?.supportsAlpha).toBe(true);
    expect(apng?.mimeType).toBe('image/png');

    const gif = formats.find((f) => f.id === 'gif');
    expect(gif?.supportsAlpha).toBe(false);
    expect(gif?.mimeType).toBe('image/gif');
  });
});
