import { test, describe } from 'node:test';
import assert from 'node:assert';
import { formatRegistry } from './registry.js';
import { CLIFormatOptions } from './types.js';

describe('CLIFormatRegistry', () => {
  const baseOptions: CLIFormatOptions = {
    outputFileName: 'test-output.mp4',
    fps: 30,
    padWidth: 5,
    hold: 0,
    outDir: './out-test',
    transparent: false,
    inputPattern: './out-test/%05d.png',
    pkgVersion: '1.0.0',
  };

  test('should retrieve format generators by id and extension', () => {
    assert.strictEqual(formatRegistry.get('mp4')?.id, 'mp4');
    assert.strictEqual(formatRegistry.get('.mp4')?.id, 'mp4');
    assert.strictEqual(formatRegistry.get('gif')?.id, 'gif');
    assert.strictEqual(formatRegistry.get('.gif')?.id, 'gif');
    assert.strictEqual(formatRegistry.get('apng')?.id, 'apng');
    assert.strictEqual(formatRegistry.get('.apng')?.id, 'apng');
    assert.strictEqual(formatRegistry.get('png')?.id, 'apng');
    assert.strictEqual(formatRegistry.get('.png')?.id, 'apng');
  });

  test('should assert format support correctly', () => {
    assert.strictEqual(formatRegistry.isSupported('mp4'), true);
    assert.strictEqual(formatRegistry.isSupported('gif'), true);
    assert.strictEqual(formatRegistry.isSupported('invalid_fmt'), false);
  });

  test('should resolve format and extension with default fallbacks', () => {
    const res1 = formatRegistry.resolveFormatAndExtension(undefined, false);
    assert.strictEqual(res1.format, 'mp4');
    assert.strictEqual(res1.extension, '.mp4');

    const res2 = formatRegistry.resolveFormatAndExtension(undefined, true);
    assert.strictEqual(res2.format, 'webm');
    assert.strictEqual(res2.extension, '.webm');

    const res3 = formatRegistry.resolveFormatAndExtension('gif', false);
    assert.strictEqual(res3.format, 'gif');
    assert.strictEqual(res3.extension, '.gif');

    assert.throws(
      () => formatRegistry.resolveFormatAndExtension('invalid'),
      /Invalid format "invalid"/
    );
  });

  test('should build correct FFmpeg args for MP4', () => {
    const mp4Gen = formatRegistry.get('mp4')!;
    const args = mp4Gen.buildFfmpegArgs({
      ...baseOptions,
      outputFileName: 'test.mp4',
    });
    assert.ok(args.includes('-c:v'));
    assert.ok(args.includes('libx264'));
    assert.ok(args[args.length - 1].includes('test.mp4'));
  });

  test('should build correct FFmpeg args for GIF with transparency', () => {
    const gifGen = formatRegistry.get('gif')!;
    const args = gifGen.buildFfmpegArgs({
      ...baseOptions,
      outputFileName: 'test.gif',
      transparent: true,
    });
    assert.ok(args.includes('-filter_complex'));
    const filterIdx = args.indexOf('-filter_complex') + 1;
    assert.ok(args[filterIdx].includes('reserve_transparent=1'));
  });

  test('should build correct FFmpeg args for aPNG with transparency', () => {
    const apngGen = formatRegistry.get('apng')!;
    const args = apngGen.buildFfmpegArgs({
      ...baseOptions,
      outputFileName: 'test.apng',
      transparent: true,
    });
    assert.ok(args.includes('-f'));
    assert.ok(args.includes('apng'));
    assert.ok(args.includes('-pix_fmt'));
    assert.ok(args.includes('rgba'));
  });
});
