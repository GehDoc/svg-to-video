import { trackEvent } from '../analytics';
import type { RenderSettings } from '../../hooks/useRenderer';

/**
 * Calculates elapsed time in seconds with 2 decimal precision.
 */
export function getElapsedDurationSec(startTimeMs: number | null): number {
  if (!startTimeMs) return 0;
  return parseFloat(((performance.now() - startTimeMs) / 1000).toFixed(2));
}

/**
 * Dedicated analytics tracking helpers for conversion lifecycle events.
 */
export function trackConversionStart(
  settings: RenderSettings,
  videoDurationSec: number
): void {
  trackEvent('conversion-start', {
    format: settings.format,
    isTransparent: settings.isTransparent,
    captureMethod: settings.captureMethod,
    fps: settings.fps,
    videoDurationSec,
  });
}

export function trackConversionSuccess(
  settings: RenderSettings,
  videoDurationSec: number,
  totalFrames: number,
  startTimeMs: number | null
): void {
  trackEvent('conversion-success', {
    format: settings.format,
    isTransparent: settings.isTransparent,
    captureMethod: settings.captureMethod,
    fps: settings.fps,
    videoDurationSec,
    totalFrames,
    processDurationSec: getElapsedDurationSec(startTimeMs),
  });
}

export function trackConversionFailed(
  settings: RenderSettings,
  error: Error,
  startTimeMs: number | null
): void {
  trackEvent('conversion-failed', {
    error: error.message,
    format: settings.format,
    isTransparent: settings.isTransparent,
    captureMethod: settings.captureMethod,
    processDurationSec: getElapsedDurationSec(startTimeMs),
  });
}

export function trackConversionCancel(
  settings: RenderSettings | null,
  startTimeMs: number | null
): void {
  if (!settings) return;
  trackEvent('conversion-cancel', {
    format: settings.format,
    isTransparent: settings.isTransparent,
    captureMethod: settings.captureMethod,
    processDurationSec: getElapsedDurationSec(startTimeMs),
  });
}
