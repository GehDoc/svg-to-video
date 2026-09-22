import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

export interface PackageJson {
  name: string;
  version: string;
  description: string;
  homepage: string;
  funding: { url: string };
  bugs: { url: string };
  repository: { url: string };
  [key: string]: unknown;
}

// Resolve package.json at module load time.
// This file lives at one of:
//   src/utils/packageInfo.ts     (tsx / dev) → root is 2 levels up
//   dist/src/utils/packageInfo.js (built)    → root is 3 levels up
// We try both depths and throw a clear error if neither exists.
const _require = createRequire(import.meta.url);
const _dir = path.dirname(fileURLToPath(import.meta.url));

function findPkg(): PackageJson {
  for (const rel of ['../../package.json', '../../../package.json']) {
    const candidate = path.resolve(_dir, rel);
    if (fs.existsSync(candidate)) return _require(candidate);
  }
  throw new Error(`Could not locate package.json from: ${_dir}`);
}

export const pkg: PackageJson = findPkg();
