import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { spawnSync } from 'child_process';
import fs from 'node:fs';
import path from 'node:path';
import ffprobeStatic from 'ffprobe-static';
import { FIXTURE_DIR_RELATIVE, OUTPUT_DIR_RELATIVE } from './utils.mjs';

describe('End-to-End Rendering', () => {
  const outputDir = OUTPUT_DIR_RELATIVE;

  before(() => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  });

  after(() => {
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
  });

  test('should render font-test.svg into a valid mp4 file', () => {
    const TEST_SVG_NAME = 'font-test';
    const inputFile = path.join(FIXTURE_DIR_RELATIVE, `${TEST_SVG_NAME}.svg`);
    const outputFile = path.join(outputDir, `${TEST_SVG_NAME}.mp4`);

    const result = spawnSync(
      'node',
      [
        'src/index.js',
        inputFile,
        '1',
        '30',
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
    assert.ok(fs.existsSync(outputFile));

    const probe = spawnSync(ffprobeStatic.path, [
      '-v', 'error',
      '-select_streams', 'v:0',
      '-show_entries', 'stream=pix_fmt',
      '-of', 'default=noprint_wrappers=1',
      outputFile
    ], { encoding: 'utf-8' });

    assert.ok(probe.stdout.includes('yuv420p'), `Expected yuv420p, got: ${probe.stdout}`);
  });

  test('should render transparent-test.svg with transparent background and alpha channel', () => {
    const transparentOutputFile = path.join(outputDir, 'transparent-test.webm');
    const transparentInputFile = path.join(FIXTURE_DIR_RELATIVE, 'transparent-test.svg');
    const result = spawnSync(
      'node',
      [
        'src/index.js',
        transparentInputFile,
        '1',
        '30',
        outputDir,
        '--transparent',
        '--force',
      ],
      { encoding: 'utf-8' }
    );

    assert.strictEqual(
      result.status,
      0,
      `Process failed with stderr: ${result.stderr}`
    );
    assert.ok(fs.existsSync(transparentOutputFile));

    const probe = spawnSync(ffprobeStatic.path, [
      '-v', 'error',
      '-select_streams', 'v:0',
      '-show_entries', 'stream_tags=alpha_mode',
      '-of', 'default=noprint_wrappers=1',
      transparentOutputFile
    ], { encoding: 'utf-8' });

    assert.ok(probe.stdout.includes('alpha_mode=1'), `Expected alpha_mode=1, got: ${probe.stdout}`);
  });
});
