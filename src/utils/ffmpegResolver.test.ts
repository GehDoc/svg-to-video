import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  findSystemFfmpeg,
  getBundledFfmpeg,
  resolveFfmpegPath,
} from './ffmpegResolver.js';

describe('ffmpegResolver', () => {
  const originalEnv = { ...process.env };
  let tempDir: string;
  let fakeFfmpegPath: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ffmpeg-test-'));
    fakeFfmpegPath = path.join(tempDir, 'fake-ffmpeg');
    fs.writeFileSync(fakeFfmpegPath, '#!/bin/sh\nexit 0\n', { mode: 0o755 });
    delete process.env.FFMPEG_PATH;
    delete process.env.FFMPEG_EXECUTABLE_PATH;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('findSystemFfmpeg returns boolean status', () => {
    const result = findSystemFfmpeg();
    assert.strictEqual(typeof result, 'boolean');
  });

  test('getBundledFfmpeg returns string or null', () => {
    const result = getBundledFfmpeg();
    assert.ok(result === null || typeof result === 'string');
  });

  test('resolveFfmpegPath returns explicit path when it exists', () => {
    const resolved = resolveFfmpegPath(fakeFfmpegPath);
    assert.strictEqual(resolved, fakeFfmpegPath);
  });

  test('resolveFfmpegPath throws if explicit path does not exist', () => {
    const nonExistent = path.join(tempDir, 'does-not-exist');
    assert.throws(
      () => resolveFfmpegPath(nonExistent),
      /Configured FFmpeg path not found or not executable/
    );
  });

  test('resolveFfmpegPath prioritizes FFMPEG_PATH environment variable', () => {
    process.env.FFMPEG_PATH = fakeFfmpegPath;
    const resolved = resolveFfmpegPath();
    assert.strictEqual(resolved, fakeFfmpegPath);
  });

  test('resolveFfmpegPath prioritizes FFMPEG_EXECUTABLE_PATH environment variable', () => {
    process.env.FFMPEG_EXECUTABLE_PATH = fakeFfmpegPath;
    const resolved = resolveFfmpegPath();
    assert.strictEqual(resolved, fakeFfmpegPath);
  });

  test('resolveFfmpegPath throws if FFMPEG_PATH points to non-existent file', () => {
    process.env.FFMPEG_PATH = path.join(tempDir, 'missing-ffmpeg');
    assert.throws(
      () => resolveFfmpegPath(),
      /Configured FFmpeg path not found or not executable/
    );
  });

  test('resolveFfmpegPath returns "ffmpeg" when system FFmpeg exists and no override is set', () => {
    if (findSystemFfmpeg()) {
      const resolved = resolveFfmpegPath();
      assert.strictEqual(resolved, 'ffmpeg');
    }
  });
});
