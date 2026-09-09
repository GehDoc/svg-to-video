import { test, describe } from 'node:test';
import assert from 'node:assert';
import { Logger } from './logger.js';

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
});
