// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { blobToDataUrl, copyDataUrl } from './clipboard';

describe('clipboard utils', () => {
  const mockBlob = new Blob(['test'], { type: 'video/mp4' });
  const mockDataUrl = 'data:video/mp4;base64,dGVzdA==';

  beforeEach(() => {
    vi.resetAllMocks();

    global.fetch = vi.fn().mockResolvedValue({
      blob: () => Promise.resolve(mockBlob),
    });

    class MockFileReader {
      result: string | null = null;
      onloadend: () => void = () => {};
      onerror: (error: unknown) => void = () => {};
      readAsDataURL() {
        this.result = mockDataUrl;
        setTimeout(() => this.onloadend(), 0);
      }
    }
    vi.stubGlobal('FileReader', MockFileReader);

    vi.stubGlobal('navigator', {
      clipboard: {
        write: vi.fn().mockResolvedValue(undefined),
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  describe('blobToDataUrl', () => {
    it('converts blob URL to data URL', async () => {
      const result = await blobToDataUrl('blob:test');
      expect(result).toBe(mockDataUrl);
    });
  });

  describe('copyDataUrl', () => {
    it('writes data URL to clipboard', async () => {
      const success = await copyDataUrl('blob:test');
      expect(success).toBe(true);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockDataUrl);
    });
  });
});
