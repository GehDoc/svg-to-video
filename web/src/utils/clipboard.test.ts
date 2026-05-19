// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { blobToDataUrl, copyDataUrl, copyBinaryFile } from './clipboard';

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

  describe('copyBinaryFile', () => {
    it('writes binary file to clipboard when supported', async () => {
      const mockClipboardItem = vi.fn();
      vi.stubGlobal('ClipboardItem', mockClipboardItem);
      ClipboardItem.supports = vi.fn().mockReturnValue(true);

      const success = await copyBinaryFile('blob:test', 'video/mp4');
      expect(success).toBe(true);
      expect(navigator.clipboard.write).toHaveBeenCalled();
      expect(mockClipboardItem).toHaveBeenCalledWith({ 'video/mp4': mockBlob });
    });

    it('returns false when not supported', async () => {
      vi.stubGlobal('ClipboardItem', undefined);
      const success = await copyBinaryFile('blob:test', 'video/mp4');
      expect(success).toBe(false);
    });
  });
});
