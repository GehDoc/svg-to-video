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
      /--scale can only be used with --resolution original and without custom width or height options/
    );
  });

  test('should throw error when scale is set with custom width or height', () => {
    assert.throws(
      () =>
        validateOptions({
          scale: 2,
          resolution: 'custom',
          transparent: false,
          bgColor: '#ffffff',
          width: 500,
        }),
      /--scale can only be used with --resolution original and without custom width or height options/
    );
  });

  test('should throw error when resolution is not custom and width/height are provided', () => {
    assert.throws(
      () =>
        validateOptions({
          scale: 1,
          resolution: 'original',
          transparent: false,
          bgColor: '#ffffff',
          width: 500,
        }),
      /Providing --width or --height is rejected when --resolution is set to 'original'/
    );

    assert.throws(
      () =>
        validateOptions({
          scale: 1,
          resolution: '1080x1080',
          transparent: false,
          bgColor: '#ffffff',
          width: 500,
        }),
      /Providing --width or --height is rejected when --resolution is set to '1080x1080'/
    );

    assert.throws(
      () =>
        validateOptions({
          scale: 1,
          resolution: '1080p',
          transparent: false,
          bgColor: '#ffffff',
          width: 500,
        }),
      /Providing --width or --height is rejected when --resolution is set to '1080p'/
    );

    assert.throws(
      () =>
        validateOptions({
          scale: 1,
          resolution: '720p',
          transparent: false,
          bgColor: '#ffffff',
          height: 400,
        }),
      /Providing --width or --height is rejected when --resolution is set to '720p'/
    );
  });

  test('should throw error when width or height exceeds maximum limit of 7680px', () => {
    assert.throws(
      () =>
        validateOptions({
          scale: 1,
          resolution: 'original',
          transparent: false,
          bgColor: '#ffffff',
          width: 10000,
        }),
      /Width exceeds maximum supported limit of 7680 pixels/
    );

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

  test('should validate resolution custom preset requirements', () => {
    assert.throws(
      () =>
        validateOptions({
          scale: 1,
          resolution: 'custom',
          transparent: false,
          bgColor: '#ffffff',
        }),
      /When --resolution is set to 'custom', --width or --height must be provided/
    );

    assert.doesNotThrow(() =>
      validateOptions({
        scale: 1,
        resolution: 'custom',
        transparent: false,
        bgColor: '#ffffff',
        width: 1080,
      })
    );
  });

  test('should pass with valid custom width/height or formatted resolution string', () => {
    assert.doesNotThrow(() =>
      validateOptions({
        scale: 1,
        resolution: 'custom',
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
