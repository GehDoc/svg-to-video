/**
 * Converts a blob URL to a Data URL (Base64).
 */
export const blobToDataUrl = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Attempts to copy a video blob to the clipboard.
 * Fallback to copying as a Data URL if binary copy is not supported.
 */
export const copyVideoToClipboard = async (
  url: string,
  mimeType: string
): Promise<{ type: 'data-url' | 'binary'; success: boolean }> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    // 1. Try binary copy if supported
    if (
      typeof ClipboardItem !== 'undefined' &&
      (ClipboardItem.supports ? ClipboardItem.supports(mimeType) : true)
    ) {
      try {
        const item = new ClipboardItem({ [mimeType]: blob });
        await navigator.clipboard.write([item]);
        return { type: 'binary', success: true };
      } catch (e) {
        console.warn('Binary clipboard write failed, falling back to text:', e);
      }
    }

    // 2. Fallback to Data URL
    const dataUrl = await blobToDataUrl(url);
    await navigator.clipboard.writeText(dataUrl);
    return { type: 'data-url', success: true };
  } catch (error) {
    console.error('Clipboard copy failed:', error);
    return { type: 'data-url', success: false };
  }
};
