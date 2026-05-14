import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { spawnSync } from 'child_process';
import fs from 'node:fs';
import ffprobeStatic from 'ffprobe-static';
import { PNG } from 'pngjs';
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
      if (line.includes('=')) {
        const [key, value] = line.split('=');
        data[key] = value;
      }
    }
    return data;
  };

  const extractFrame = (videoPath, framePath) => {
    spawnSync('ffmpeg', ['-y', '-i', videoPath, '-vframes', '1', framePath], {
      stdio: 'pipe',
    });
    return fs.existsSync(framePath);
  };

  const getPixelColor = (imagePath) => {
    const data = fs.readFileSync(imagePath);
    const png = PNG.sync.read(data);
    const idx = 0;
    const r = png.data[idx];
    const g = png.data[idx + 1];
    const b = png.data[idx + 2];
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
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
    const framePath = outputFile.replace('.mp4', '.png');

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
