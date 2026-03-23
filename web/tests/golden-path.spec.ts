import { test, expect } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

    // 3. Configure (use defaults: 3s, 24fps)
    await page.fill('#duration', '3');
    await page.fill('#fps', '24');

    // Assert that the source dimensions are correctly detected
    // The meta-item element contains both the strong label and the dimension text
    await expect(page.locator('.meta-item:has-text("Source")')).toContainText(
      '500x300'
    );

    // 4. Trigger Render
    const renderButton = page.locator('button.render-button');
    await renderButton.click();

    // 5. Wait for completion (Success Card appears)
    const successCard = page.locator('.success-card');
    await expect(successCard).toBeVisible({ timeout: 30000 }); // Increase timeout for rendering

    // 6. Verify Result (Download button exists)
    const downloadButton = page.locator('text=Download MP4');
    await expect(downloadButton).toBeVisible();

    // Start waiting for download before clicking
    const downloadPromise = page.waitForEvent('download');
    await downloadButton.click();
    const download = await downloadPromise;

    // Verify download filename
    expect(download.suggestedFilename()).toBe('font-test.mp4');

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
    const exportButton = page.locator('button.render-button');
    await expect(exportButton).toBeEnabled();
  });
});
