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

  test('should throw error when scale is set with custom width or height', () => {
    assert.throws(
      () =>
        validateOptions({
          scale: 2,
          resolution: 'original',
          transparent: false,
          bgColor: '#ffffff',
          width: 500,
        }),
      /--scale can only be used with --resolution original/
    );
  });

  test('should throw error when transparent and bgColor are set together', () => {
    assert.throws(
      () =>
        validateOptions({
          scale: 1,
          resolution: 'original',
          transparent: true,
          bgColor: '#000000',
        }),
      /--transparent and --bg-color cannot be used together/
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

  test('should throw error when width or height is <= 0 or NaN', () => {
    assert.throws(
      () =>
        validateOptions({
          scale: 1,
          resolution: 'original',
          transparent: false,
          bgColor: '#ffffff',
          width: 0,
        }),
      /Width must be a positive number/
    );

    assert.throws(
      () =>
        validateOptions({
          scale: 1,
          resolution: 'original',
          transparent: false,
          bgColor: '#ffffff',
          height: -100,
        }),
      /Height must be a positive number/
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

  test('should pass with valid custom width/height or formatted resolution string', () => {
    assert.doesNotThrow(() =>
      validateOptions({
        scale: 1,
        resolution: 'original',
        transparent: false,
        bgColor: '#ffffff',
        width: 1080,
        height: 1920,
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
