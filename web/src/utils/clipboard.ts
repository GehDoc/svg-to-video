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
 * Copies the video as a Data URL (Base64) to the clipboard.
 */
export const copyDataUrl = async (url: string): Promise<boolean> => {
  try {
    const dataUrl = await blobToDataUrl(url);
    await navigator.clipboard.writeText(dataUrl);
    return true;
  } catch (error) {
    console.error('Clipboard copy data-url failed:', error);
    return false;
  }
};

/**
 * Attempts to copy the video as a binary file to the clipboard.
 */
export const copyBinaryFile = async (
  url: string,
  mimeType: string
): Promise<boolean> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    if (
      typeof ClipboardItem !== 'undefined' &&
      (ClipboardItem.supports ? ClipboardItem.supports(mimeType) : true)
    ) {
      const item = new ClipboardItem({ [mimeType]: blob });
      await navigator.clipboard.write([item]);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Clipboard copy binary failed:', error);
    return false;
  }
};
