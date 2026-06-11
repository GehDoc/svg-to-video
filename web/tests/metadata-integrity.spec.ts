import { test, expect } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getProbeMetadata, ensureOutputDir } from '../../tests/helpers/e2e.js';
import { getTestOutputPath, exportStudioVideo } from './helpers/web-e2e.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TEST_METADATA = {
  title: 'E2E Metadata Test',
  comment: 'This is a comment for E2E testing.',
};

const PKG_VERSION = '0.18.0';
const EXPECTED_COMMENT = `${TEST_METADATA.comment} | Converted from SVG by svg-to-video v${PKG_VERSION} (https://gehdoc.github.io/svg-to-video/)`;

// Ensure output dir for E2E verification
ensureOutputDir();

test.describe('Rendering Pipeline: Metadata Integrity', () => {
  test.describe('Supported Formats (MP4, WebM)', () => {
    const supportedFormats = [
      { id: 'mp4', extension: '.mp4' },
      { id: 'webm', extension: '.webm' },
    ];

    for (const format of supportedFormats) {
      test(`should correctly embed and verify metadata for ${format.id.toUpperCase()}`, async ({
        page,
      }, testInfo) => {
        await page.goto('/');

        const svgPath = path.resolve(
          __dirname,
          '../../tests/fixtures/demo-fixture.svg'
        );

        const download = await exportStudioVideo(page, svgPath, {
          format: format.id,
          title: TEST_METADATA.title,
          comment: TEST_METADATA.comment,
          duration: '0.2',
          fps: '10',
        });

        const suggestedName = download.suggestedFilename();
        expect(suggestedName).toBe(`demo-fixture${format.extension}`);

        const outputPath = getTestOutputPath(testInfo, suggestedName);
        await download.saveAs(outputPath);

        const metadata = getProbeMetadata(outputPath);

        // Helper to find a tag case-insensitively, with or without "TAG:" prefix
        const findTag = (tagName: string) => {
          const lowerTag = tagName.toLowerCase();
          for (const [key, value] of Object.entries(metadata)) {
            const cleanKey = key.replace(/^TAG:/, '').toLowerCase();
            if (cleanKey === lowerTag || cleanKey.endsWith('/' + lowerTag))
              return value;
          }
          return undefined;
        };

        const title = findTag('title');
        const comment = findTag('comment') || findTag('description');

        expect(
          title,
          `Title metadata missing or incorrect for ${format.id}`
        ).toBe(TEST_METADATA.title);
        expect(
          comment,
          `Comment metadata missing or incorrect for ${format.id}`
        ).toBe(EXPECTED_COMMENT);
      });
    }
  });

  test.describe('Unsupported Formats (aPNG, GIF)', () => {
    const unsupportedFormats = [
      { id: 'apng', extension: '.png' },
      { id: 'gif', extension: '.gif' },
    ];

    for (const format of unsupportedFormats) {
      test(`should have metadata inputs disabled for ${format.id.toUpperCase()}`, async ({
        page,
      }) => {
        await page.goto('/');

        const svgPath = path.resolve(
          __dirname,
          '../../tests/fixtures/demo-fixture.svg'
        );

        await page.setInputFiles('input[type="file"]', svgPath);
        await page.selectOption('#format', format.id);

        // Verify that metadata fields are strictly disabled in the UI
        const titleInput = page.locator('#meta-title');
        const commentInput = page.locator('#meta-comment');

        await expect(titleInput).toBeDisabled();
        await expect(commentInput).toBeDisabled();

        // Verify that export still works without metadata
        const exportButton = page.getByRole('button', {
          name: new RegExp(`Export ${format.id}`, 'i'),
        });
        await expect(exportButton).toBeEnabled();
      });
    }
  });
});
