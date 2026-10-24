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

<<<<<<< HEAD
  test('should throw error when crf is out of bounds or NaN', () => {
=======
  test('should throw error when resolution string is invalid or contains non-positive numbers', () => {
>>>>>>> origin/main
    assert.throws(
      () =>
        validateOptions({
          scale: 1,
<<<<<<< HEAD
          resolution: 'original',
          transparent: false,
          bgColor: '#ffffff',
          crf: -1,
        }),
      /CRF value must be a number between 0 and 63/
=======
          resolution: 'invalid_res',
          transparent: false,
          bgColor: '#ffffff',
        }),
      /Invalid resolution option "invalid_res"/
>>>>>>> origin/main
    );

    assert.throws(
      () =>
        validateOptions({
          scale: 1,
<<<<<<< HEAD
          resolution: 'original',
          transparent: false,
          bgColor: '#ffffff',
          crf: 64,
        }),
      /CRF value must be a number between 0 and 63/
    );
  });

  test('should throw error when quality is out of bounds or NaN', () => {
    assert.throws(
      () =>
        validateOptions({
          scale: 1,
          resolution: 'original',
          transparent: false,
          bgColor: '#ffffff',
          quality: 0,
        }),
      /Quality value must be a number between 1 and 100/
    );

    assert.throws(
      () =>
        validateOptions({
          scale: 1,
          resolution: 'original',
          transparent: false,
          bgColor: '#ffffff',
          quality: 101,
        }),
      /Quality value must be a number between 1 and 100/
    );
  });

  test('should throw error when bitrate is invalid', () => {
    assert.throws(
      () =>
        validateOptions({
          scale: 1,
          resolution: 'original',
          transparent: false,
          bgColor: '#ffffff',
          bitrate: 'invalid_bitrate',
        }),
      /Invalid bitrate format/
=======
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
>>>>>>> origin/main
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
        crf: 20,
        bitrate: '5M',
        quality: 80,
      })
    );
  });
});
