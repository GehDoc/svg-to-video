import { describe, it, expect, vi } from 'vitest';
import { discoverFormats } from './discoverFormats';

// Mock Mediabunny to avoid actual browser codec checks in test environment
vi.mock('mediabunny', () => {
  class MockOutputFormat {
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
    Mp4OutputFormat: MockOutputFormat,
    WebMOutputFormat: MockOutputFormat,
    MkvOutputFormat: MockOutputFormat,
    MovOutputFormat: MockOutputFormat,
    getFirstEncodableVideoCodec: vi.fn().mockResolvedValue('vp9'),
  };
});

describe('discoverFormats', () => {
  it('should discover supported formats', async () => {
    const formats = await discoverFormats();
    expect(formats.length).toBeGreaterThan(0);
    expect(formats[0]).toHaveProperty('id');
    expect(formats[0]).toHaveProperty('supportsAlpha');
  });
});
