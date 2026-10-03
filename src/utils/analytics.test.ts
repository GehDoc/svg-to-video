import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import {
  isOptedOut,
  sendEvent,
  trackEvent,
  flushAnalytics,
} from './analytics.js';
import {
  UMAMI_WEBSITE_ID,
  UMAMI_WEBSITE_HOSTNAME,
} from '../../shared/analytics-schema.js';

describe('analytics', () => {
  const originalEnv = process.env.DO_NOT_TRACK;
  const originalCi = process.env.CI;
  const originalNodeEnv = process.env.NODE_ENV;
  const originalVitest = process.env.VITEST;
  const originalPlaywright = process.env.PLAYWRIGHT_TEST;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    delete process.env.DO_NOT_TRACK;
    delete process.env.CI;
    delete process.env.NODE_ENV;
    delete process.env.VITEST;
    delete process.env.PLAYWRIGHT_TEST;
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.DO_NOT_TRACK = originalEnv;
    } else {
      delete process.env.DO_NOT_TRACK;
    }
    if (originalCi !== undefined) {
      process.env.CI = originalCi;
    } else {
      delete process.env.CI;
    }
    if (originalNodeEnv !== undefined) {
      process.env.NODE_ENV = originalNodeEnv;
    } else {
      delete process.env.NODE_ENV;
    }
    if (originalVitest !== undefined) {
      process.env.VITEST = originalVitest;
    } else {
      delete process.env.VITEST;
    }
    if (originalPlaywright !== undefined) {
      process.env.PLAYWRIGHT_TEST = originalPlaywright;
    } else {
      delete process.env.PLAYWRIGHT_TEST;
    }
    globalThis.fetch = originalFetch;
  });

  describe('isOptedOut', () => {
    test('should return false when DO_NOT_TRACK, CI, and NODE_ENV are not set', () => {
      assert.strictEqual(isOptedOut(), false);
    });

    test('should return true when DO_NOT_TRACK is 1', () => {
      process.env.DO_NOT_TRACK = '1';
      assert.strictEqual(isOptedOut(), true);
    });

    test('should return true when DO_NOT_TRACK is true (case-insensitive)', () => {
      process.env.DO_NOT_TRACK = 'TRUE';
      assert.strictEqual(isOptedOut(), true);
    });

    test('should return true when CI environment variable is set', () => {
      process.env.CI = 'true';
      assert.strictEqual(isOptedOut(), true);
    });

    test('should return true when NODE_ENV is test', () => {
      process.env.NODE_ENV = 'test';
      assert.strictEqual(isOptedOut(), true);
    });

    test('should return true when VITEST environment variable is set', () => {
      process.env.VITEST = 'true';
      assert.strictEqual(isOptedOut(), true);
    });

    test('should return true when PLAYWRIGHT_TEST environment variable is set', () => {
      process.env.PLAYWRIGHT_TEST = 'true';
      assert.strictEqual(isOptedOut(), true);
    });

    test('should return false for DO_NOT_TRACK=0 or other values when not in CI/test', () => {
      process.env.DO_NOT_TRACK = '0';
      assert.strictEqual(isOptedOut(), false);
      process.env.DO_NOT_TRACK = 'false';
      assert.strictEqual(isOptedOut(), false);
    });
  });

  describe('sendEvent', () => {
    const dummyFileLoad = {
      detectedDuration: 5,
      hasAnimation: true,
      aspectRatio: 'landscape' as const,
      isDimensionsDetected: true,
    };

    test('should skip HTTP POST when opted out via DO_NOT_TRACK', async () => {
      process.env.DO_NOT_TRACK = '1';
      let fetchCalled = false;
      globalThis.fetch = (async () => {
        fetchCalled = true;
        return new Response(null, { status: 200 });
      }) as typeof fetch;

      const result = await sendEvent('file-load', dummyFileLoad);
      assert.strictEqual(result, false);
      assert.strictEqual(fetchCalled, false);
    });

    test('should skip HTTP POST when in CI environment', async () => {
      process.env.CI = 'true';
      let fetchCalled = false;
      globalThis.fetch = (async () => {
        fetchCalled = true;
        return new Response(null, { status: 200 });
      }) as typeof fetch;

      const result = await sendEvent('file-load', dummyFileLoad);
      assert.strictEqual(result, false);
      assert.strictEqual(fetchCalled, false);
    });

    test('should construct correct Umami payload and User-Agent when sending event', async () => {
      let requestUrl = '';
      let requestOptions: RequestInit = {};

      globalThis.fetch = (async (
        url: string | URL | Request,
        init?: RequestInit
      ) => {
        requestUrl = url.toString();
        if (init) requestOptions = init;
        return new Response(JSON.stringify({ ok: true }), { status: 200 });
      }) as typeof fetch;

      const success = await sendEvent('file-load', dummyFileLoad, 'cli');

      assert.strictEqual(success, true);
      assert.strictEqual(requestUrl, 'https://cloud.umami.is/api/send');

      const headers = requestOptions.headers as Record<string, string>;
      assert.strictEqual(headers['Content-Type'], 'application/json');
      assert.ok(headers['User-Agent'].startsWith('Mozilla/5.0 Umami/'));

      const body = JSON.parse(requestOptions.body as string);
      assert.strictEqual(body.type, 'event');
      assert.strictEqual(body.payload.website, UMAMI_WEBSITE_ID);
      assert.strictEqual(body.payload.hostname, UMAMI_WEBSITE_HOSTNAME);
      assert.strictEqual(body.payload.url, '/cli');
      assert.strictEqual(body.payload.name, 'file-load');
      assert.strictEqual(body.payload.data.detectedDuration, 5);
      assert.strictEqual(body.payload.data.hasAnimation, true);
      assert.ok(typeof body.payload.data.version === 'string');
    });

    test('should silently return false on network error', async () => {
      globalThis.fetch = (async () => {
        throw new Error('Network error');
      }) as typeof fetch;

      const result = await sendEvent('conversion-failed', {
        error: 'Failed',
        format: 'webm',
        isTransparent: false,
        captureMethod: 'puppeteer',
        processDurationSec: 2,
      });
      assert.strictEqual(result, false);
    });
  });

  describe('flushAnalytics', () => {
    test('should resolve promptly when no active promises', async () => {
      const start = Date.now();
      await flushAnalytics(1000);
      const elapsed = Date.now() - start;
      assert.ok(elapsed < 100);
    });

    test('should await active trackEvent promises', async () => {
      let resolveFetch: ((res: Response) => void) | undefined;
      globalThis.fetch = (async () => {
        return new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        });
      }) as typeof fetch;

      const trackPromise = trackEvent('file-load', {
        detectedDuration: 5,
        hasAnimation: true,
        aspectRatio: 'landscape',
        isDimensionsDetected: true,
      });

      let flushed = false;
      const flushPromise = flushAnalytics(1000).then(() => {
        flushed = true;
      });

      assert.strictEqual(flushed, false);
      if (resolveFetch) {
        resolveFetch(
          new Response(JSON.stringify({ ok: true }), { status: 200 })
        );
      }
      await flushPromise;
      assert.strictEqual(flushed, true);
      await trackPromise;
    });
  });
});
