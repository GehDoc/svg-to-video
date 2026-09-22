import type {
  AnalyticsEventMap,
  CaptureMethodType,
} from './analytics-schema.js';

export interface ConversionTrackerOptions {
  format: string;
  isTransparent: boolean;
  captureMethod: CaptureMethodType;
  fps: number;
  videoDurationSec: number;
}

export type TrackFn = <K extends keyof AnalyticsEventMap>(
  eventName: K,
  properties: AnalyticsEventMap[K]
) => void;

/**
 * Calculates elapsed duration in seconds.
 * Uses performance.now() if available, otherwise Date.now().
 */
export function calculateElapsedSec(startTimeMs: number): number {
  const now =
    typeof performance !== 'undefined' ? performance.now() : Date.now();
  return parseFloat(((now - startTimeMs) / 1000).toFixed(2));
}

/**
 * Shared ConversionTracker class that manages timing state and telemetry dispatch
 * for video/image rendering across Web Studio, CLI, and MCP interfaces.
 */
export class ConversionTracker {
  private startTimeMs: number;

  constructor(
    private options: ConversionTrackerOptions,
    private trackFn: TrackFn
  ) {
    this.startTimeMs =
      typeof performance !== 'undefined' ? performance.now() : Date.now();
  }

  start(): void {
    this.trackFn('conversion-start', {
      format: this.options.format,
      isTransparent: this.options.isTransparent,
      captureMethod: this.options.captureMethod,
      fps: this.options.fps,
      videoDurationSec: this.options.videoDurationSec,
    });
  }

  success(totalFrames: number): void {
    const processDurationSec = calculateElapsedSec(this.startTimeMs);
    this.trackFn('conversion-success', {
      format: this.options.format,
      isTransparent: this.options.isTransparent,
      captureMethod: this.options.captureMethod,
      fps: this.options.fps,
      videoDurationSec: this.options.videoDurationSec,
      totalFrames,
      processDurationSec,
    });
  }

  failed(error: Error | string): void {
    const processDurationSec = calculateElapsedSec(this.startTimeMs);
    const errorMessage = typeof error === 'string' ? error : error.message;
    this.trackFn('conversion-failed', {
      error: errorMessage,
      format: this.options.format,
      isTransparent: this.options.isTransparent,
      captureMethod: this.options.captureMethod,
      processDurationSec,
    });
  }

  cancel(): void {
    const processDurationSec = calculateElapsedSec(this.startTimeMs);
    this.trackFn('conversion-cancel', {
      format: this.options.format,
      isTransparent: this.options.isTransparent,
      captureMethod: this.options.captureMethod,
      processDurationSec,
    });
  }
}
