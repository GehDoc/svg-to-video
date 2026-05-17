import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { spawnSync } from 'child_process';
import fs from 'node:fs';
import {
  OUTPUT_DIR_RELATIVE as outputDir,
  getTestPaths,
  getProbeMetadata,
  extractFrame,
  getPixelColor,
} from './helpers/e2e.js';

describe('CLI Functionality', () => {
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

  describe('Version', () => {
    test('should output version', () => {
      const result = spawnSync('npx', ['tsx', 'src/index.ts', '--version'], {
        encoding: 'utf-8',
      });
      assert.match(result.stdout, /\d+\.\d+\.\d+/);
    });
  });

  describe('Duration Auto-Detection', () => {
    test('should auto-detect duration from loop-test.svg', () => {
      const { inputFile, outputFile } = getTestPaths('loop-test');
      const result = spawnSync(
        'npx',
        ['tsx', 'src/index.ts', inputFile, '30', outputDir, '--force'],
        { encoding: 'utf-8' }
      );
      assert.strictEqual(result.status, 0, result.stderr);
      assert.ok(fs.existsSync(outputFile));
    });

    test('should fail if no duration is provided and cannot detect', () => {
      const { inputFile } = getTestPaths('font-test');
      const result = spawnSync(
        'npx',
        ['tsx', 'src/index.ts', inputFile, '30', outputDir, '--force'],
        { encoding: 'utf-8' }
      );
      assert.strictEqual(result.status, 1);
      assert.match(result.stderr, /Could not detect duration/);
    });
  });

  describe('Rendering', () => {
    test('should render font-test.svg into a valid mp4 file', () => {
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
          '--force',
        ],
        { encoding: 'utf-8' }
      );
      assert.strictEqual(result.status, 0, result.stderr);
      assert.ok(fs.existsSync(outputFile));

      const data = getProbeMetadata(outputFile);
      assert.strictEqual(data.width, '500');
      assert.strictEqual(data.height, '300');
      assert.ok(parseFloat(data.duration) >= 1.0);
      assert.strictEqual(data['TAG:title'], undefined);
      assert.match(
        data['TAG:comment'],
        /^Converted from SVG by svg-to-video v\d+\.\d+\.\d+ \(https:\/\/gehdoc\.github\.io\/svg-to-video\/\)$/
      );
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
      assert.strictEqual(result.status, 0, result.stderr);
      assert.ok(fs.existsSync(outputFile));
      const data = getProbeMetadata(outputFile);
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
      assert.strictEqual(result.status, 0, result.stderr);
      assert.ok(fs.existsSync(outputFile));

      assert.ok(
        extractFrame(outputFile, framePath),
        'Frame should be extracted'
      );
      const actualColor = getPixelColor(framePath);
      const expectedColor = '#0000FF';
      const diff = Math.abs(
        parseInt(actualColor.slice(5), 16) -
          parseInt(expectedColor.slice(5), 16)
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

      const data = getProbeMetadata(outputFile);
      assert.strictEqual(data.width, '1000');
      assert.strictEqual(data.height, '600');
    });

    test('should render transparent-test.svg with transparent background and alpha channel', () => {
      const { inputFile, outputFile } = getTestPaths(
        'transparent-test',
        '.webm'
      );
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

      const data = getProbeMetadata(outputFile);
      assert.strictEqual(data.width, '500');
      assert.strictEqual(data.height, '300');
      assert.ok(parseFloat(data.duration) >= 2.0);
      assert.strictEqual(data['TAG:alpha_mode'], '1');
    });

    test('should render font-test.svg with custom metadata', () => {
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
          '--metadata',
          'title=Custom Title',
          'comment=Test Comment',
          '--force',
        ],
        { encoding: 'utf-8' }
      );
      assert.strictEqual(result.status, 0, result.stderr);
      assert.ok(fs.existsSync(outputFile));

      const data = getProbeMetadata(outputFile);
      assert.strictEqual(data['TAG:title'], 'Custom Title');
      assert.match(
        data['TAG:comment'],
        /^Test Comment \| Converted from SVG by svg-to-video v\d+\.\d+\.\d+ \(https:\/\/gehdoc\.github\.io\/svg-to-video\/\)$/
      );
    });
  });
});
