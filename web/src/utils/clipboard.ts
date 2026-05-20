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
