// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { blobToDataUrl, copyVideoToClipboard } from './clipboard';

describe('clipboard utils', () => {
  const mockBlob = new Blob(['test'], { type: 'video/mp4' });
  const mockDataUrl = 'data:video/mp4;base64,dGVzdA==';

  beforeEach(() => {
    vi.resetAllMocks();

    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      blob: () => Promise.resolve(mockBlob),
    });

    // Mock FileReader as a proper constructor
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

    // Mock navigator.clipboard
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
      expect(global.fetch).toHaveBeenCalledWith('blob:test');
    });
  });

  describe('copyVideoToClipboard', () => {
    it('attempts binary copy first when supported', async () => {
      const mockClipboardItem = vi.fn();
      vi.stubGlobal('ClipboardItem', mockClipboardItem);
      ClipboardItem.supports = vi.fn().mockReturnValue(true);

      const result = await copyVideoToClipboard('blob:test', 'video/mp4');

      expect(result).toEqual({ type: 'binary', success: true });
      expect(navigator.clipboard.write).toHaveBeenCalled();
      expect(mockClipboardItem).toHaveBeenCalledWith({ 'video/mp4': mockBlob });
    });

    it('falls back to data-url when binary copy fails', async () => {
      const mockClipboardItem = vi.fn();
      vi.stubGlobal('ClipboardItem', mockClipboardItem);
      ClipboardItem.supports = vi.fn().mockReturnValue(true);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const writeSpy = navigator.clipboard.write as any;
      writeSpy.mockRejectedValue(new Error('Failed'));

      const result = await copyVideoToClipboard('blob:test', 'video/mp4');

      expect(result).toEqual({ type: 'data-url', success: true });
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockDataUrl);
    });

    it('falls back to data-url when ClipboardItem is not supported', async () => {
      vi.stubGlobal('ClipboardItem', undefined);

      const result = await copyVideoToClipboard('blob:test', 'video/mp4');

      expect(result).toEqual({ type: 'data-url', success: true });
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockDataUrl);
    });
  });
});
