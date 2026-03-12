import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { spawnSync } from 'child_process';
import fs from 'node:fs';
import path from 'node:path';
import {
  FIXTURE_DIR_RELATIVE,
  OUTPUT_DIR_RELATIVE,
  resolveEnvironmentPath,
} from './utils.mjs';

const logs = [];
const logger = (msg) => logs.push(`[${new Date().toISOString()}] ${msg}`);

describe('End-to-End Rendering', () => {
  const TEST_SVG_NAME = 'font-test';
  const testSvgPathRelative = path.join(
    FIXTURE_DIR_RELATIVE,
    `${TEST_SVG_NAME}.svg`
  );

  const outputFileRelative = path.join(
    OUTPUT_DIR_RELATIVE,
    `${TEST_SVG_NAME}.mp4`
  );

  const cliSvgPathArg = resolveEnvironmentPath(testSvgPathRelative);
  const cliOutputDirArg = resolveEnvironmentPath(OUTPUT_DIR_RELATIVE);

  before(() => {
    // Ensure output directory exists before tests run
    if (!fs.existsSync(OUTPUT_DIR_RELATIVE)) {
      fs.mkdirSync(OUTPUT_DIR_RELATIVE, { recursive: true });
    }
  });

  after(() => {
    // Cleanup output directory and file after all tests
    if (fs.existsSync(outputFileRelative)) {
      fs.unlinkSync(outputFileRelative);
    }
    if (fs.existsSync(OUTPUT_DIR_RELATIVE)) {
      fs.rmSync(OUTPUT_DIR_RELATIVE, { recursive: true, force: true });
    }
  });

  test('should render font-test.svg into a valid mp4 file', () => {
    logger('Starting test...');
    logger(`UID: ${process.getuid()}`);
    logger(`HOME: ${process.env.HOME}`);

    let result;
    try {
      // 2. Execute the CLI tool
      result = spawnSync(
        'node',
        [
          'src/index.js',
          cliSvgPathArg,
          '1', // duration
          '30', // fps
          cliOutputDirArg,
          '--force',
        ],
        { encoding: 'utf-8' }
      );
      logger(result.stdout);
      if (result.stderr) {
        logger(`STDERR: ${result.stderr}`);
      }
    } catch (err) {
      logger(`FATAL ERROR: ${err.message}`);
      if (err.stack) logger(err.stack);

      // ICI : On force l'affichage de TOUT ce qu'on a capturé sur stderr
      // fs.writeSync est synchrone et ne peut pas être intercepté par le test runner
      fs.writeSync(
        2,
        `\n=== CAPTURED LOGS ON FAILURE ===\n${logs.join('\n')}\n================================\n`
      );
      logs.length = 0; // Clear logs after dumping

      // On re-balance l'erreur pour que le test soit marqué comme "failed"
      throw err;
    }
    fs.writeSync(
      2,
      `\n=== CAPTURED LOGS ON SUCCESS ===\n${logs.join('\n')}\n================================\n`
    );
    // 3. Assertions
    assert.strictEqual(
      result.status,
      0,
      `Process failed with stderr: ${result.stderr}`
    );
    assert.ok(
      fs.existsSync(outputFileRelative),
      'The output MP4 file was not created'
    );

    const stats = fs.statSync(outputFileRelative);
    assert.ok(
      stats.size > 1000,
      'The generated video file is suspiciously small (possibly empty)'
    );
  });
});
