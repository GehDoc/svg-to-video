import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { spawnSync } from 'child_process';
import fs from 'node:fs';
import {
  OUTPUT_DIR_RELATIVE,
  getTestPaths,
  getProbeData,
  extractFrame,
  getPixelColor,
} from './helpers/e2e.js';

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
    const { inputFile, outputFile } = getTestPaths('font-test');
    const result = spawnSync(
      'npx',
      ['tsx', 'src/index.ts', inputFile, '30', outputDir, '-d', '1', '--force'],
      { encoding: 'utf-8' }
    );

    assert.strictEqual(
      result.status,
      0,
      `Process failed with stderr: ${result.stderr}`
    );
    assert.ok(fs.existsSync(outputFile));

    const data = getProbeData(outputFile);
    assert.strictEqual(data.width, '500');
    assert.strictEqual(data.height, '300');
    assert.ok(parseFloat(data.duration) >= 1.0);
    assert.ok(!data['TAG:alpha_mode'] || data['TAG:alpha_mode'] !== '1');
  });

  test('should render font-test.svg with explicit 1080p resolution', () => {
    const { inputFile, outputFile } = getTestPaths('font-test');
    const result = spawnSync(
      'npx',
      [
        'tsx',
        'src/index.ts',
        inputFile,
        '30',
        outputDir,
        '-d',
        '1',
        '--resolution',
        '1080p',
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

    const data = getProbeData(outputFile);
    assert.strictEqual(data.width, '1920');
    assert.strictEqual(data.height, '1080');
  });

  test('should render transparent-test.svg with explicit background color (blue)', () => {
    const { inputFile, outputFile } = getTestPaths('transparent-test');
    const framePath = outputFile.replace('.mp4', '.png');

    const result = spawnSync(
      'npx',
      [
        'tsx',
        'src/index.ts',
        inputFile,
        '30',
        outputDir,
        '-d',
        '1',
        '--bg-color',
        '#0000FF',
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

    assert.ok(extractFrame(outputFile, framePath), 'Frame should be extracted');
    const actualColor = getPixelColor(framePath);
    const expectedColor = '#0000FF';
    const diff = Math.abs(
      parseInt(actualColor.slice(5), 16) - parseInt(expectedColor.slice(5), 16)
    );
    assert.ok(
      diff <= 5,
      `Expected color close to ${expectedColor}, got ${actualColor}`
    );
  });

  test('should render font-test.svg with explicit scale factor', () => {
    const { inputFile, outputFile } = getTestPaths('font-test');
    const result = spawnSync(
      'npx',
      [
        'tsx',
        'src/index.ts',
        inputFile,
        '30',
        outputDir,
        '-d',
        '1',
        '--scale',
        '2.0',
        '--resolution',
        'original',
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

    const data = getProbeData(outputFile);
    assert.strictEqual(data.width, '1000');
    assert.strictEqual(data.height, '600');
  });

  test('should render transparent-test.svg with transparent background and alpha channel', () => {
    const { inputFile, outputFile } = getTestPaths('transparent-test', '.webm');
    const result = spawnSync(
      'npx',
      [
        'tsx',
        'src/index.ts',
        inputFile,
        '30',
        outputDir,
        '-d',
        '2',
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
    assert.ok(fs.existsSync(outputFile));

    const data = getProbeData(outputFile);
    assert.strictEqual(data.width, '500');
    assert.strictEqual(data.height, '300');
    assert.ok(parseFloat(data.duration) >= 2.0);
    assert.strictEqual(data['TAG:alpha_mode'], '1');
  });
});
