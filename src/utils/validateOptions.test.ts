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

  test('should throw error when crf is out of bounds or NaN', () => {
    assert.throws(
      () =>
        validateOptions({
          scale: 1,
          resolution: 'original',
          transparent: false,
          bgColor: '#ffffff',
          crf: -1,
        }),
      /CRF value must be a number between 0 and 63/
    );

    assert.throws(
      () =>
        validateOptions({
          scale: 1,
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
