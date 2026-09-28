import { test, describe } from 'node:test';
import assert from 'node:assert';
import { trackEvent, flushAnalytics, isOptedOut } from './analytics.js';

describe('CLI Analytics Helper', () => {
  test('isOptedOut should return true when DO_NOT_TRACK=1', () => {
    const orig = process.env.DO_NOT_TRACK;
    try {
      process.env.DO_NOT_TRACK = '1';
      assert.strictEqual(isOptedOut(), true);
    } finally {
      process.env.DO_NOT_TRACK = orig;
    }
  });

  test('trackEvent should return false when opted out', async () => {
    const orig = process.env.DO_NOT_TRACK;
    try {
      process.env.DO_NOT_TRACK = '1';
      const result = await trackEvent('file-load', {
        detectedDuration: 5,
        hasAnimation: true,
        aspectRatio: 'landscape',
        isDimensionsDetected: true,
      });
      assert.strictEqual(result, false);
    } finally {
      process.env.DO_NOT_TRACK = orig;
    }
  });

  test('flushAnalytics should resolve promptly when no active promises', async () => {
    const start = Date.now();
    await flushAnalytics(1000);
    const elapsed = Date.now() - start;
    assert.ok(elapsed < 100);
  });
});
