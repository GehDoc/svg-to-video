import { describe, it } from 'node:test';
import assert from 'node:assert';
import { fileURLToPath } from 'node:url';
import {
  findSystemBrowserExecutable,
  launchBrowser,
} from './browserLauncher.js';

const currentFilePath = fileURLToPath(import.meta.url);

describe('browserLauncher', () => {
  it('findSystemBrowserExecutable respects valid PUPPETEER_EXECUTABLE_PATH', () => {
    const originalEnv = process.env.PUPPETEER_EXECUTABLE_PATH;
    try {
      process.env.PUPPETEER_EXECUTABLE_PATH = currentFilePath;
      const result = findSystemBrowserExecutable();
      assert.strictEqual(result, currentFilePath);
    } finally {
      process.env.PUPPETEER_EXECUTABLE_PATH = originalEnv;
    }
  });

  it('launchBrowser launches headless browser or provides clean error', async () => {
    try {
      const browser = await launchBrowser();
      assert.ok(browser);
      await browser.close();
    } catch (err: unknown) {
      assert.ok(err instanceof Error);
      assert.ok(
        err.message.includes('Failed to launch Chrome/Chromium') ||
          err.message.includes('Troubleshooting Fixes')
      );
    }
  });
});
