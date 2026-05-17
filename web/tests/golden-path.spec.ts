import { test, expect } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getProbeMetadata } from '../../tests/helpers/e2e.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test.describe('SVG to Video Golden Path', () => {
  test('should successfully render an SVG into an MP4', async ({ page }) => {
    // 1. Load the page
    await page.goto('/');

    // 2. Upload the fixture SVG
    // Note: The fixture is in tests/fixtures/font-test.svg relative to project root.
    // In the container/CI, ensure the path is accessible.
    const svgPath = path.resolve(
      __dirname,
      '../../tests/fixtures/font-test.svg'
    );
    await page.setInputFiles('input[type="file"]', svgPath);

    // 3. Configure (use defaults: 1s, 24fps)
    await page.fill('#duration', '1');
    await page.fill('#fps', '24');

    // Assert that the source dimensions are correctly detected
    // The meta-item element contains both the strong label and the dimension text
    await expect(page.locator('.meta-item:has-text("Source")')).toContainText(
      '500x300'
    );

    // 4. Trigger Render
    const exportButton = page.getByRole('button', {
      name: /Export/i,
    });
    await exportButton.click();

    // 5. Wait for completion (Success Card appears)
    const successCard = page.locator('.success-card');
    await expect(successCard).toBeVisible({ timeout: 30000 }); // Increase timeout for rendering

    // 6. Verify Result (Download button exists)
    const downloadButton = page.locator('text=Download');
    await expect(downloadButton).toBeVisible();

    // Start waiting for download before clicking
    const downloadPromise = page.waitForEvent('download');
    await downloadButton.click();
    const download = await downloadPromise;

    // Verify download filename
    expect(download.suggestedFilename()).toBe('font-test.mp4');

    // Verify metadata of the downloaded file
    const downloadPath = path.resolve(
      __dirname,
      '../.vitest-attachments/test-metadata.mp4'
    );
    await download.saveAs(downloadPath);

    const data = getProbeMetadata(downloadPath);
    expect(data['TAG:title']).toBeUndefined();
    expect(data['TAG:comment']).toMatch(
      /^Converted from SVG by svg-to-video v\d+\.\d+\.\d+ \(https:\/\/gehdoc\.github\.io\/svg-to-video\/\)$/
    );

    // Verify video element is present and has a blob source
    const video = page.locator('video');
    await expect(video).toBeVisible();
    const videoSrc = await video.getAttribute('src');
    expect(videoSrc).toContain('blob:');

    // 7. Dismiss modal and check Studio return
    const backButton = page.locator('text=Back to Studio');
    await backButton.click();
    await expect(successCard).toBeHidden();

    // 8. Assert Studio controls are active again
    const exportButtonAgain = page.getByRole('button', {
      name: /Export/i,
    });
    await expect(exportButtonAgain).toBeEnabled();
  });

  test('should successfully render an SVG into a WebM with transparency', async ({
    page,
  }) => {
    await page.goto('/');

    const svgPath = path.resolve(
      __dirname,
      '../../tests/fixtures/font-test.svg'
    );
    await page.setInputFiles('input[type="file"]', svgPath);

    // Select WebM and Transparency
    await page.selectOption('#format', 'webm');
    await page.check('#transparent');

    await page.fill('#duration', '1');
    await page.fill('#fps', '24');

    const exportButton = page.getByRole('button', {
      name: /Export WEBM/i,
    });
    await expect(exportButton).toBeEnabled();
    await exportButton.click();

    const successCard = page.locator('.success-card');
    await expect(successCard).toBeVisible({ timeout: 30000 });

    const downloadButton = page.locator('text=Download');
    const downloadPromise = page.waitForEvent('download');
    await downloadButton.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('font-test.webm');
  });

  test('should successfully render an SVG with custom metadata', async ({
    page,
  }) => {
    await page.goto('/');

    const svgPath = path.resolve(
      __dirname,
      '../../tests/fixtures/font-test.svg'
    );
    await page.setInputFiles('input[type="file"]', svgPath);

    // Enter metadata
    await page.fill('#meta-title', 'Web Title');
    await page.fill('#meta-comment', 'Web Comment');

    await page.fill('#duration', '1');
    await page.fill('#fps', '10');

    const exportButton = page.getByRole('button', {
      name: /Export MP4/i,
    });
    await exportButton.click();

    const successCard = page.locator('.success-card');
    await expect(successCard).toBeVisible({ timeout: 30000 });

    const downloadButton = page.locator('text=Download');
    const downloadPromise = page.waitForEvent('download');
    await downloadButton.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('font-test.mp4');

    // Verify metadata of the downloaded file (defaults: no title, only attribution)
    const downloadPath = path.resolve(
      __dirname,
      '../.vitest-attachments/test-default-metadata.mp4'
    );
    await download.saveAs(downloadPath);

    const data = getProbeMetadata(downloadPath);
    expect(data['TAG:title']).toBe('Web Title');
    expect(data['TAG:comment']).toMatch(
      /^Web Comment \| Converted from SVG by svg-to-video v\d+\.\d+\.\d+ \(https:\/\/gehdoc\.github\.io\/svg-to-video\/\)$/
    );
  });
});
