import { trackEvent } from '../analytics';

export type IngestionMethod = 'file-picker' | 'drag-and-drop';

export interface SvgDimensionInfo {
  width: number;
  height: number;
  isDimensionsDetected: boolean;
}

/**
 * Dedicated tracking helper for SVG file ingestion (`file-load`).
 * Computes aspect ratio and animation detection internally.
 */
export function trackFileLoad(
  method: IngestionMethod,
  dim: SvgDimensionInfo,
  detectedDuration?: number
): void {
  let aspectRatio: 'square' | 'landscape' | 'portrait' | 'unknown' = 'unknown';

  if (dim.isDimensionsDetected && dim.width > 0 && dim.height > 0) {
    if (dim.width === dim.height) {
      aspectRatio = 'square';
    } else if (dim.width > dim.height) {
      aspectRatio = 'landscape';
    } else {
      aspectRatio = 'portrait';
    }
  }

  const hasAnimation = detectedDuration !== undefined && detectedDuration > 0;

  trackEvent('file-load', {
    method,
    aspectRatio,
    hasAnimation,
    detectedDuration: detectedDuration ?? 0,
    isDimensionsDetected: dim.isDimensionsDetected,
  });
}
