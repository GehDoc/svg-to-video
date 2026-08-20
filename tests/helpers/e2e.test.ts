import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import {
  ensureOutputDir,
  getTestPaths,
  getProbeMetadata,
  hasAlphaStream,
  OUTPUT_DIR_RELATIVE,
} from './e2e.js';

describe('e2e helper functions', () => {
  test('ensureOutputDir creates output directory if it does not exist', () => {
    ensureOutputDir();
    assert.strictEqual(fs.existsSync(OUTPUT_DIR_RELATIVE), true);
  });

  test('getTestPaths returns correct input and output paths with default and custom extension', () => {
    const defaultPaths = getTestPaths('sample');
    assert.strictEqual(
      defaultPaths.inputFile,
      path.join('./tests/fixtures', 'sample.svg')
    );
    assert.strictEqual(
      defaultPaths.outputFile,
      path.join('./out-dir-test', 'sample.mp4')
    );

    const gifPaths = getTestPaths('sample', '.gif');
    assert.strictEqual(
      gifPaths.outputFile,
      path.join('./out-dir-test', 'sample.gif')
    );
  });

  test('getProbeMetadata parses PNG metadata correctly', () => {
    ensureOutputDir();
    const pngPath = path.join(OUTPUT_DIR_RELATIVE, 'test-meta-probe.png');
    // PNG Signature (8) + IHDR chunk (13 + 12) + tEXt chunk (Title\0Sample) + IEND (12)
    const header = Buffer.from([
      0x89,
      0x50,
      0x4e,
      0x47,
      0x0d,
      0x0a,
      0x1a,
      0x0a, // Signature
      0x00,
      0x00,
      0x00,
      0x0d,
      0x49,
      0x48,
      0x44,
      0x52, // IHDR length & type
      0x00,
      0x00,
      0x00,
      0x01,
      0x00,
      0x00,
      0x00,
      0x01,
      0x08,
      0x06,
      0x00,
      0x00,
      0x00,
      0x1f,
      0x15,
      0xc4,
      0x89, // IHDR data & crc
    ]);
    const keyword = Buffer.from('Title\0Sample', 'utf-8');
    const textLen = Buffer.alloc(4);
    textLen.writeUInt32BE(keyword.length, 0);
    const textType = Buffer.from('tEXt', 'ascii');
    const textCrc = Buffer.alloc(4);

    const pngBuffer = Buffer.concat([
      header,
      textLen,
      textType,
      keyword,
      textCrc,
    ]);
    fs.writeFileSync(pngPath, pngBuffer);

    const meta = getProbeMetadata(pngPath);
    assert.strictEqual(meta['TAG:title'], 'Sample');

    if (fs.existsSync(pngPath)) fs.unlinkSync(pngPath);
  });

  test('hasAlphaStream detects alpha stream for PNG with rgba format', () => {
    ensureOutputDir();
    const pngPath = path.join(OUTPUT_DIR_RELATIVE, 'test-alpha-probe.png');
    // Minimal PNG header with color type 6 (RGBA)
    const pngBuffer = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89,
    ]);
    fs.writeFileSync(pngPath, pngBuffer);

    assert.strictEqual(hasAlphaStream(pngPath), false);

    if (fs.existsSync(pngPath)) fs.unlinkSync(pngPath);
  });
});
