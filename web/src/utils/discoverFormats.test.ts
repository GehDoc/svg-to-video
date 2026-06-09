import { describe, it, expect, vi, beforeEach } from 'vitest';

// We must import Formats to trigger registration
import './encoders/Formats';
import { discoverFormats, getFormatById } from './discoverFormats';

// Mock Mediabunny
vi.mock('mediabunny', () => {
  class MockOutputFormat {
    getSupportedVideoCodecs() {
      return ['mock-codec'];
    }
    get fileExtension() {
      return '.mock';
    }
    get mimeType() {
      return 'video/mock';
    }
  }
  return {
    Mp4OutputFormat: class extends MockOutputFormat {
      get mimeType() {
        return 'video/mp4';
      }
    },
    WebMOutputFormat: class extends MockOutputFormat {
      get mimeType() {
        return 'video/webm';
      }
    },
    MkvOutputFormat: class extends MockOutputFormat {
      get mimeType() {
        return 'video/x-matroska';
      }
    },
    MovOutputFormat: class extends MockOutputFormat {
      get mimeType() {
        return 'video/quicktime';
      }
    },
    getFirstEncodableVideoCodec: vi.fn().mockResolvedValue('mock-codec'),
  };
});

describe('discoverFormats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should discover supported formats from registry', async () => {
    const formats = await discoverFormats();
    expect(formats.length).toBeGreaterThan(0);

    const ids = formats.map((f) => f.id);
    expect(ids).toContain('apng');
    expect(ids).toContain('gif');
    expect(ids).toContain('mp4');

    const apng = formats.find((f) => f.id === 'apng');
    expect(apng?.supportsAlpha).toBe(true);
    expect(apng?.mimeType).toBe('image/png');
  });

  it('should get format by id from registry', () => {
    const mp4 = getFormatById('mp4');
    expect(mp4).toBeDefined();
    expect(mp4?.id).toBe('mp4');
    expect(mp4?.mimeType).toBe('video/mp4');
  });

  it('should return undefined for unknown format', () => {
    const unknown = getFormatById('unknown');
    expect(unknown).toBeUndefined();
  });
});
