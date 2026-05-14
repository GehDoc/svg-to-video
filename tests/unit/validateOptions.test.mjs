import { test, describe } from 'node:test';
import assert from 'node:assert';
import { validateOptions } from '../../src/utils/validateOptions.js';

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

  test('should pass with valid options', () => {
    assert.doesNotThrow(() =>
      validateOptions({
        scale: 1,
        resolution: '1080p',
        transparent: false,
        bgColor: '#ffffff',
      })
    );
  });
});
