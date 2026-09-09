import { test, describe } from 'node:test';
import assert from 'node:assert';
import { Logger, isLoggerJsonOutput } from './logger.js';

describe('Logger', () => {
  const dummyHomepage = 'https://github.com/GehDoc/svg-to-video';

  test('default mode should allow info, warn, error', () => {
    const logger = new Logger({ homepage: dummyHomepage });
    assert.strictEqual(logger.quiet, false);
    assert.strictEqual(logger.isJson, false);
  });

  test('quiet mode should set quiet to true', () => {
    const logger = new Logger({ quiet: true, homepage: dummyHomepage });
    assert.strictEqual(logger.quiet, true);
    assert.strictEqual(logger.isJson, false);
  });

  test('json mode should set both isJson and quiet to true', () => {
    const logger = new Logger({ json: true, homepage: dummyHomepage });
    assert.strictEqual(logger.quiet, true);
    assert.strictEqual(logger.isJson, true);
  });

  test('done should format output with LoggerDoneData payload', () => {
    const logger = new Logger({ quiet: true, homepage: dummyHomepage });
    assert.doesNotThrow(() => {
      logger.done('output.mp4', {
        duration: 5,
        fps: 60,
        format: 'mp4',
        totalFrames: 300,
        resolution: 'original',
        transparent: false,
      });
    });
  });

  describe('isLoggerJsonOutput type guard', () => {
    test('should return true for valid success and error payloads', () => {
      assert.strictEqual(
        isLoggerJsonOutput({ success: true, outputFile: 'out.mp4' }),
        true
      );
      assert.strictEqual(
        isLoggerJsonOutput({ success: false, error: 'Failed' }),
        true
      );
    });

    test('should return false for invalid payloads', () => {
      assert.strictEqual(isLoggerJsonOutput(null), false);
      assert.strictEqual(isLoggerJsonOutput('string'), false);
      assert.strictEqual(isLoggerJsonOutput(123), false);
      assert.strictEqual(isLoggerJsonOutput({ foo: 'bar' }), false);
      assert.strictEqual(isLoggerJsonOutput({ success: 'yes' }), false);
    });
  });
});
