import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { spawnSync } from 'child_process';
import fs from 'node:fs';
import path from 'node:path';
import { FIXTURE_DIR_RELATIVE, OUTPUT_DIR_RELATIVE } from './utils.mjs';

describe('End-to-End Rendering', () => {
  const TEST_SVG_NAME = 'font-test';
  const inputFile = path.join(FIXTURE_DIR_RELATIVE, `${TEST_SVG_NAME}.svg`);
  const outputDir = OUTPUT_DIR_RELATIVE;
  const outputFile = path.join(outputDir, `${TEST_SVG_NAME}.mp4`);

  before(() => {
    // Ensure output directory exists before tests run
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  });

  after(() => {
    // Cleanup output directory and file after all tests
    if (fs.existsSync(outputFile)) {
      fs.unlinkSync(outputFile);
    }
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
  });

  test('should render font-test.svg into a valid mp4 file', () => {
    const result = spawnSync(
      'node',
      [
        'src/index.js',
        inputFile,
        '1', // duration
        '30', // fps
        outputDir,
        '--force',
      ],
      { encoding: 'utf-8' }
    );

    assert.strictEqual(
      result.status,
      0,
      `Process failed with stderr: ${result.stderr}`
    );
    assert.ok(fs.existsSync(outputFile), 'The output MP4 file was not created');

    const stats = fs.statSync(outputFile);
    assert.ok(
      stats.size > 1000,
      'The generated video file is suspiciously small (possibly empty)'
    );
  });
});
