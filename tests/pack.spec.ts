import { describe, it } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'node:child_process';

const REQUIRED_FILES = [
  'LICENSE',
  'README.md',
  'package.json',
  'dist/src/index.js',
  'dist/src/mcp.js',
  'dist/src/utils/browserLauncher.js',
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

describe('npm pack file-list verification', () => {
  it('published npm package contains all required runtime files and zero extra files', () => {
    // Ensure build is up to date
    execSync('npm run build', { encoding: 'utf-8' });

    const rawOutput = execSync('npm pack --dry-run --json', {
      encoding: 'utf-8',
    });

    const jsonMatch = rawOutput.match(/\[\s*\{[\s\S]*\}\s*\]/);
    assert.ok(
      jsonMatch,
      `Could not find JSON array in npm pack output:\n${rawOutput}`
    );
    const parsed: unknown = JSON.parse(jsonMatch[0]);
    const items = Array.isArray(parsed) ? parsed : [parsed];
    const shippedPaths = items
      .map((f: Record<string, unknown>) => f.path)
      .filter((p: unknown): p is string => typeof p === 'string')
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
      24,
      `Expected exactly 24 files in npm package, found ${shippedPaths.length}: ${JSON.stringify(shippedPaths)}`
    );
  });
});
