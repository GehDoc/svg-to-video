/**
 * Checks whether a given File object is a valid SVG file
 * by inspecting its MIME type or file extension.
 */
export function isSvgFile(file: File): boolean {
  return (
    file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')
  );
}
