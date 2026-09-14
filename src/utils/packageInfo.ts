import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

export interface PackageJson {
  name: string;
  version: string;
  description: string;
  homepage: string;
  funding: { url: string };
  bugs: { url: string };
  repository: { url: string };
  [key: string]: any;
}

export function getPackageJson(importMetaUrl: string): PackageJson {
  const require = createRequire(importMetaUrl);
  const filename = fileURLToPath(importMetaUrl);
  const dirname = path.dirname(filename);

  const localPkg = path.join(dirname, '../package.json');
  const parentPkg = path.join(dirname, '../../package.json');

  if (fs.existsSync(localPkg)) return require(localPkg);
  if (fs.existsSync(parentPkg)) return require(parentPkg);
  return require('../package.json');
}
