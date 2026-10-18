import { test, describe } from 'node:test';
import assert from 'node:assert';
import { validateOptions } from './validateOptions.js';

describe('validateOptions', () => {
  test('should throw error when scale is set without resolution original', () => {
    assert.throws(
      () =>
        validateOptions({
          scale: 2,
          resolution: '1080p',
          transparent: false,
          bgColor: '#ffffff',
        }),
      /--scale can only be used with --resolution original/
    );
  });

  test('should throw error when resolution dimension exceeds maximum limit of 7680px', () => {
    assert.throws(
      () =>
        validateOptions({
          scale: 1,
          resolution: '10000x1080',
          transparent: false,
          bgColor: '#ffffff',
        }),
      /Custom resolution dimensions must not exceed 7680 pixels/
    );
  });

  test('should throw error when transparent is set for format without alpha support', () => {
    assert.throws(
      () =>
        validateOptions({
          scale: 1,
          resolution: 'original',
          transparent: true,
          bgColor: '#ffffff',
          format: 'mp4',
        }),
      /Format "mp4" does not support transparency/
    );
  });

  test('should enforce transparent and bgColor constraints based on format needsColorKeying', () => {
    // GIF has needsColorKeying: true, so transparent + custom bgColor is allowed
    assert.doesNotThrow(() =>
      validateOptions({
        scale: 1,
        resolution: 'original',
        transparent: true,
        bgColor: '#000000',
        format: 'gif',
      })
    );

    // webm has needsColorKeying: false, so transparent + custom bgColor throws
    assert.throws(
      () =>
        validateOptions({
          scale: 1,
          resolution: 'original',
          transparent: true,
          bgColor: '#000000',
          format: 'webm',
        }),
      /--transparent and --bg-color cannot be used together for format "webm"/
    );

    // apng has needsColorKeying: false, so transparent + custom bgColor throws
    assert.throws(
      () =>
        validateOptions({
          scale: 1,
          resolution: 'original',
          transparent: true,
          bgColor: '#000000',
          format: 'apng',
        }),
      /--transparent and --bg-color cannot be used together for format "apng"/
    );

    // Transparent format without bgColor passes
    assert.doesNotThrow(() =>
      validateOptions({
        scale: 1,
        resolution: 'original',
        transparent: true,
      })
    );

    // webm with explicit #ffffff bgColor also throws because webm does not need color keying
    assert.throws(
      () =>
        validateOptions({
          scale: 1,
          resolution: 'original',
          transparent: true,
          bgColor: '#ffffff',
          format: 'webm',
        }),
      /--transparent and --bg-color cannot be used together for format "webm"/
    );
  });

  test('should throw error when invalid format is provided', () => {
    assert.throws(
      () =>
        validateOptions({
          scale: 1,
          resolution: 'original',
          transparent: false,
          bgColor: '#ffffff',
          format: 'avi',
        }),
      /Invalid format "avi"\. Supported formats are:/
    );
  });

  test('should throw error when resolution string is invalid or contains non-positive numbers', () => {
    assert.throws(
      () =>
        validateOptions({
          scale: 1,
          resolution: 'invalid_res',
          transparent: false,
          bgColor: '#ffffff',
        }),
      /Invalid resolution option "invalid_res"/
    );

    assert.throws(
      () =>
        validateOptions({
          scale: 1,
          resolution: '0x1080',
          transparent: false,
          bgColor: '#ffffff',
        }),
      /Custom resolution dimensions must be positive numbers/
    );
  });

  test('should pass with valid formatted resolution strings', () => {
    assert.doesNotThrow(() =>
      validateOptions({
        scale: 1,
        resolution: '1080x1920',
        transparent: false,
        bgColor: '#ffffff',
      })
    );

    assert.doesNotThrow(() =>
      validateOptions({
        scale: 1,
        resolution: '1080x1080',
        transparent: false,
        bgColor: '#ffffff',
      })
    );
  });

  test('should pass with valid options', () => {
    assert.doesNotThrow(() =>
      validateOptions({
        scale: 1,
        resolution: '1080p',
        transparent: false,
        bgColor: '#ffffff',
        format: 'gif',
      })
    );
  });
});
