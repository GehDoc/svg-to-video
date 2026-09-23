import { trackEvent } from '../analytics';
import { calculateAspectRatio } from '@shared/analyzeSvgAnimation.js';

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
  const aspectRatio = calculateAspectRatio(
    dim.width,
    dim.height,
    dim.isDimensionsDetected
  );

  const hasAnimation = detectedDuration !== undefined && detectedDuration > 0;

  trackEvent('file-load', {
    method,
    aspectRatio,
    hasAnimation,
    detectedDuration: detectedDuration ?? 0,
    isDimensionsDetected: dim.isDimensionsDetected,
  });
}
