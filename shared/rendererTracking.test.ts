import { describe, it, expect, vi } from 'vitest';
import { ConversionTracker } from './rendererTracking.js';

describe('ConversionTracker', () => {
  const dummyOptions = {
    format: 'webm',
    isTransparent: true,
    captureMethod: 'puppeteer' as const,
    fps: 60,
    videoDurationSec: 5,
  };

  it('should track conversion-start on start()', () => {
    const trackFn = vi.fn();
    const tracker = new ConversionTracker(dummyOptions, trackFn);

    tracker.start();

    expect(trackFn).toHaveBeenCalledWith('conversion-start', {
      format: 'webm',
      isTransparent: true,
      captureMethod: 'puppeteer',
      fps: 60,
      videoDurationSec: 5,
    });
  });

  it('should track conversion-success with calculated processDurationSec', () => {
    const trackFn = vi.fn();
    const tracker = new ConversionTracker(dummyOptions, trackFn);

    tracker.success(300);

    expect(trackFn).toHaveBeenCalledWith(
      'conversion-success',
      expect.objectContaining({
        format: 'webm',
        isTransparent: true,
        captureMethod: 'puppeteer',
        fps: 60,
        videoDurationSec: 5,
        totalFrames: 300,
        processDurationSec: expect.any(Number),
      })
    );
  });

  it('should track conversion-failed with calculated processDurationSec', () => {
    const trackFn = vi.fn();
    const tracker = new ConversionTracker(dummyOptions, trackFn);

    tracker.failed(new Error('Render timeout'));

    expect(trackFn).toHaveBeenCalledWith(
      'conversion-failed',
      expect.objectContaining({
        error: 'Render timeout',
        format: 'webm',
        isTransparent: true,
        captureMethod: 'puppeteer',
        processDurationSec: expect.any(Number),
      })
    );
  });

  it('should track conversion-cancel with calculated processDurationSec', () => {
    const trackFn = vi.fn();
    const tracker = new ConversionTracker(dummyOptions, trackFn);

    tracker.cancel();

    expect(trackFn).toHaveBeenCalledWith(
      'conversion-cancel',
      expect.objectContaining({
        format: 'webm',
        isTransparent: true,
        captureMethod: 'puppeteer',
        processDurationSec: expect.any(Number),
      })
    );
  });
});
