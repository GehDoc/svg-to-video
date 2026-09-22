import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { isOptedOut, sendEvent, UMAMI_WEBSITE_ID } from './analytics.js';

describe('analytics', () => {
  const originalEnv = process.env.DO_NOT_TRACK;
  const originalCi = process.env.CI;
  const originalNodeEnv = process.env.NODE_ENV;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    delete process.env.DO_NOT_TRACK;
    delete process.env.CI;
    delete process.env.NODE_ENV;
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

    test('should return false for DO_NOT_TRACK=0 or other values when not in CI/test', () => {
      process.env.DO_NOT_TRACK = '0';
      assert.strictEqual(isOptedOut(), false);
      process.env.DO_NOT_TRACK = 'false';
      assert.strictEqual(isOptedOut(), false);
    });
  });

  describe('sendEvent', () => {
    test('should skip HTTP POST when opted out via DO_NOT_TRACK', async () => {
      process.env.DO_NOT_TRACK = '1';
      let fetchCalled = false;
      globalThis.fetch = (async () => {
        fetchCalled = true;
        return new Response(null, { status: 200 });
      }) as typeof fetch;

      const result = await sendEvent('file-load', { detectedDuration: 5 });
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

      const result = await sendEvent('file-load', { detectedDuration: 5 });
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

      const success = await sendEvent(
        'file-load',
        { detectedDuration: 5, hasAnimation: true },
        'cli'
      );

      assert.strictEqual(success, true);
      assert.strictEqual(requestUrl, 'https://cloud.umami.is/api/send');

      const headers = requestOptions.headers as Record<string, string>;
      assert.strictEqual(headers['Content-Type'], 'application/json');
      assert.ok(headers['User-Agent'].includes('CLI'));

      const body = JSON.parse(requestOptions.body as string);
      assert.strictEqual(body.type, 'event');
      assert.strictEqual(body.payload.website, UMAMI_WEBSITE_ID);
      assert.strictEqual(body.payload.hostname, 'cli');
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

      const result = await sendEvent('conversion-failed', { error: 'Failed' });
      assert.strictEqual(result, false);
    });
  });
});
