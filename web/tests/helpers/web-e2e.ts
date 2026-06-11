import { Page, expect, Download, TestInfo } from '@playwright/test';
import path from 'path';
import {
  SUCCESS_TIMEOUT,
  OUTPUT_DIR_RELATIVE,
} from '../../../tests/helpers/e2e.js';

/**
 * Common options for rendering a video in the Web Studio.
 */
export interface RenderOptions {
  format?: string;
  isTransparent?: boolean;
  backgroundColor?: string;
  duration?: string;
  fps?: string;
  hold?: string;
  title?: string;
  comment?: string;
}

/**
 * Automates the rendering and downloading of a video from the Web Studio.
 */
export async function exportStudioVideo(
  page: Page,
  svgPath: string,
  options: RenderOptions = {}
): Promise<Download> {
  const {
    format = 'mp4',
    isTransparent = false,
    backgroundColor,
    duration,
    fps,
    hold,
    title,
    comment,
  } = options;

  await page.setInputFiles('input[type="file"]', svgPath);

  if (format !== 'mp4') {
    await page.selectOption('#format', format);
  }

  if (isTransparent) {
    await page.check('#transparent');
  } else {
    await page.uncheck('#transparent');
  }

  if (backgroundColor) {
    await page.fill('#bg-color', backgroundColor);
  }

  if (duration) {
    await page.fill('#duration', duration);
  }

  if (fps) {
    await page.fill('#fps', fps);
  }

  if (hold) {
    await page.fill('#hold', hold);
  }

  if (title) {
    await page.fill('#meta-title', title);
  }

  if (comment) {
    await page.fill('#meta-comment', comment);
  }

  const exportButton = page.getByRole('button', {
    name: new RegExp(`Export ${format}`, 'i'),
  });
  await expect(exportButton).toBeEnabled();
  await exportButton.click();

  const successCard = page.locator('.success-card');
  await expect(successCard).toBeVisible({ timeout: SUCCESS_TIMEOUT });

  const downloadButton = page.locator('text=Download');
  const downloadPromise = page.waitForEvent('download');
  await downloadButton.click();
  return downloadPromise;
}

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
