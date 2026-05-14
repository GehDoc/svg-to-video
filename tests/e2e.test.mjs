import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { spawnSync } from 'child_process';
import fs from 'node:fs';
import ffprobeStatic from 'ffprobe-static';
import { OUTPUT_DIR_RELATIVE, getTestPaths } from './utils.mjs';

describe('End-to-End Rendering', () => {
  const outputDir = OUTPUT_DIR_RELATIVE;

  const getProbeData = (filePath) => {
    const probe = spawnSync(
      ffprobeStatic.path,
      [
        '-v',
        'error',
        '-select_streams',
        'v:0',
        '-show_entries',
        'stream=width,height:format=duration',
        '-show_entries',
        'stream_tags=alpha_mode',
        '-of',
        'default=noprint_wrappers=1',
        filePath,
      ],
      { encoding: 'utf-8' }
    );
    const lines = probe.stdout.split('\n');
    const data = {};
    for (const line of lines) {
      const [key, value] = line.split('=');
      if (key && value) data[key] = value;
    }
    return data;
  };

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
      'node',
      ['src/index.js', inputFile, '1', '30', outputDir, '--force'],
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
      'node',
      [
        'src/index.js',
        inputFile,
        '1',
        '30',
        outputDir,
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
    const result = spawnSync(
      'node',
      [
        'src/index.js',
        inputFile,
        '1',
        '30',
        outputDir,
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

    const data = getProbeData(outputFile);
    assert.strictEqual(data.width, '500');
    assert.strictEqual(data.height, '300');
  });

  test('should render transparent-test.svg with transparent background and alpha channel', () => {
    const { inputFile, outputFile } = getTestPaths('transparent-test', '.webm');
    const result = spawnSync(
      'node',
      [
        'src/index.js',
        inputFile,
        '2',
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
    assert.ok(fs.existsSync(outputFile));

    const data = getProbeData(outputFile);
    assert.strictEqual(data.width, '500');
    assert.strictEqual(data.height, '300');
    assert.ok(parseFloat(data.duration) >= 2.0);
    assert.strictEqual(data['TAG:alpha_mode'], '1');
  });
});
