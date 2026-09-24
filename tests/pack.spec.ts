import { describe, it } from 'node:test';
import assert from 'node:assert';
import { execSync, spawnSync } from 'node:child_process';

const REQUIRED_FILES = [
  'LICENSE',
  'README.md',
  'package.json',
  'dist/src/index.js',
  'dist/src/mcp.js',
  'dist/src/utils/logger.js',
  'skills/svg-to-video/SKILL.md',
];

const FORBIDDEN_PREFIXES = [
  'web/',
  'specs/',
  'tests/',
  '.github/',
  '.husky/',
  'src/',
  'shared/',
];

const FORBIDDEN_EXACT_FILES = [
  'tsconfig.json',
  'tsconfig.build.json',
  'Dockerfile',
  'docker-compose.yml',
  '.eslintrc.json',
  '.prettierrc.json',
];

describe('npm pack & compiled dist smoke verification', () => {
  it('published npm package contains all required runtime files and zero extra files', () => {
    // Ensure build is up to date
    execSync('npm run build', { encoding: 'utf-8' });

    const rawOutput = execSync('npm pack --dry-run --json', {
      encoding: 'utf-8',
    });

    const jsonStart = rawOutput.search(/[{[]/);
    assert.ok(
      jsonStart !== -1,
      `Could not find JSON start in npm pack output:\n${rawOutput}`
    );
    const parsed: unknown = JSON.parse(rawOutput.slice(jsonStart));

    const fileList: Array<{ path?: unknown }> = [];
    if (Array.isArray(parsed)) {
      for (const entry of parsed) {
        if (entry && typeof entry === 'object') {
          if ('files' in entry && Array.isArray(entry.files)) {
            fileList.push(...entry.files);
          } else if ('path' in entry) {
            fileList.push(entry);
          }
        }
      }
    } else if (parsed && typeof parsed === 'object') {
      for (const value of Object.values(parsed)) {
        if (
          value &&
          typeof value === 'object' &&
          'files' in value &&
          Array.isArray(value.files)
        ) {
          fileList.push(...(value.files as Array<{ path?: unknown }>));
        }
      }
    }

    const shippedPaths = fileList
      .map((f) => f.path)
      .filter((p): p is string => typeof p === 'string')
      .sort();

    // 1. Assert all required files are present
    for (const requiredFile of REQUIRED_FILES) {
      assert.ok(
        shippedPaths.includes(requiredFile),
        `Required runtime file missing from npm package: ${requiredFile}`
      );
    }

    // 2. Assert no forbidden directories or files are present
    for (const shippedPath of shippedPaths) {
      for (const forbiddenPrefix of FORBIDDEN_PREFIXES) {
        assert.strictEqual(
          shippedPath.startsWith(forbiddenPrefix),
          false,
          `Forbidden directory file found in npm package: ${shippedPath}`
        );
      }

      assert.strictEqual(
        FORBIDDEN_EXACT_FILES.includes(shippedPath),
        false,
        `Forbidden file found in npm package: ${shippedPath}`
      );
    }

    // 3. Assert exact match against expected file count
    assert.strictEqual(
      shippedPaths.length,
      27,
      `Expected exactly 27 files in npm package, found ${shippedPaths.length}: ${JSON.stringify(shippedPaths)}`
    );
  });

  it('compiled CLI artifact (dist/src/index.js) executes cleanly without ESM module errors', () => {
    execSync('npm run build', { encoding: 'utf-8' });

    const result = spawnSync('node', ['dist/src/index.js', '--version'], {
      encoding: 'utf-8',
    });

    assert.strictEqual(
      result.status,
      0,
      `CLI execution failed with stderr: ${result.stderr}`
    );
    assert.match(result.stdout, /\d+\.\d+\.\d+/);
  });

  it('compiled MCP server artifact (dist/src/mcp.js) starts cleanly without ESM module errors', () => {
    execSync('npm run build', { encoding: 'utf-8' });

    const proc = spawnSync('node', ['dist/src/mcp.js'], {
      encoding: 'utf-8',
      input: '',
      timeout: 2000,
    });

    // Node process for MCP server listens on stdio and exits 0 when stdin closes
    assert.ok(
      proc.status === 0 ||
        (proc.error as { code?: string } | undefined)?.code === 'ETIMEDOUT',
      `MCP server failed to start: ${proc.stderr}`
    );
    assert.strictEqual(
      proc.stderr.includes('ERR_MODULE_NOT_FOUND'),
      false,
      `ERR_MODULE_NOT_FOUND thrown by dist/src/mcp.js: ${proc.stderr}`
    );
  });
});
