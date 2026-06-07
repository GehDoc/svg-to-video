import path from 'path';
import { TestInfo } from '@playwright/test';
import { OUTPUT_DIR_RELATIVE } from '../../../tests/helpers/e2e.js';

/**
 * Sanitizes a string for use in filenames.
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Generates a unique, readable output path for a test artifact.
 */
export const getTestOutputPath = (
  testInfo: TestInfo,
  filename: string
): string => {
  const testSlug = slugify(testInfo.title);
  const uniqueFilename = `${testSlug}--${filename}`;
  return path.resolve(OUTPUT_DIR_RELATIVE, uniqueFilename);
};
