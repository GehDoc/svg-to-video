import { test, expect } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  getProbeMetadata,
  hasAlphaStream,
  isPixelTransparent,
  extractFrame,
  getPixelRGBA,
  OUTPUT_DIR_RELATIVE,
} from '../../tests/helpers/e2e.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUCCESS_TIMEOUT = 30000; // 30 seconds, to allow for rendering time in CI

// Ensure output dir for E2E verification
if (!fs.existsSync(OUTPUT_DIR_RELATIVE)) {
  fs.mkdirSync(OUTPUT_DIR_RELATIVE, { recursive: true });
}

test.describe('SVG to Video Golden Path', () => {
  test('should successfully render an SVG into an MP4', async ({ page }) => {
    // 1. Load the page
    await page.goto('/');

    // 2. Upload the fixture SVG
    const svgPath = path.resolve(
      __dirname,
      '../../tests/fixtures/font-test.svg'
    );
    await page.setInputFiles('input[type="file"]', svgPath);

    // 3. Configure (use defaults: 1s, 24fps)
    await page.fill('#duration', '1');
    await page.fill('#fps', '24');

    // Assert that the source dimensions are correctly detected
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
    await expect(successCard).toBeVisible({ timeout: SUCCESS_TIMEOUT });

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
    const downloadPath = path.resolve(OUTPUT_DIR_RELATIVE, 'font-test.mp4');
    await download.saveAs(downloadPath);

    const data = getProbeMetadata(downloadPath);
    expect(data['TAG:title']).toBeUndefined();
    expect(data['TAG:comment']).toMatch(
      /^Converted from SVG by svg-to-video v\d+\.\d+\.\d+ \(https:\/\/gehdoc\.github\.io\/svg-to-video\/\)$/
    );

    // Verify video element is present
    const video = page.getByTestId('video-preview');
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

  test('should successfully render an SVG into an MP4 (opaque with background backfilling)', async ({
    page,
  }) => {
    await page.goto('/');

    const svgPath = path.resolve(
      __dirname,
      '../../tests/fixtures/transparent-loop-test.svg'
    );
    await page.setInputFiles('input[type="file"]', svgPath);

    // Select MP4 (default), Opaque, and custom background color
    await page.uncheck('#transparent');
    await page.fill('#bg-color', '#ff0000'); // Set background to red

    await page.fill('#duration', '0.5');
    await page.fill('#fps', '10');

    const exportButton = page.getByRole('button', {
      name: /Export MP4/i,
    });
    await expect(exportButton).toBeEnabled();
    await exportButton.click();

    const successCard = page.locator('.success-card');
    await expect(successCard).toBeVisible({ timeout: SUCCESS_TIMEOUT });

    const downloadButton = page.locator('text=Download');
    const downloadPromise = page.waitForEvent('download');
    await downloadButton.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('transparent-loop-test.mp4');

    // Verify background color (flattened red background - allow tolerance for encoding)
    const outputPath = path.resolve(
      OUTPUT_DIR_RELATIVE,
      'transparent-loop-test-opaque.mp4'
    );
    await download.saveAs(outputPath);
    const framePath = path.resolve(OUTPUT_DIR_RELATIVE, 'frame.png');
    extractFrame(outputPath, framePath);
    const pixel = getPixelRGBA(framePath, 10, 10);

    // Check if pixel is close to Red
    expect(pixel.r).toBeGreaterThan(240);
    expect(pixel.g).toBeLessThan(15);
    expect(pixel.b).toBeLessThan(15);
    expect(pixel.a).toBe(255); // Opaque
    // TODO: Add pixel-level transparency verification for MP4 output.
  });

  test('should successfully render an SVG into a WebM with transparency', async ({
    page,
  }) => {
    await page.goto('/');

    const svgPath = path.resolve(
      __dirname,
      '../../tests/fixtures/transparent-loop-test.svg'
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
    await expect(successCard).toBeVisible({ timeout: SUCCESS_TIMEOUT });

    const downloadButton = page.locator('text=Download');
    const downloadPromise = page.waitForEvent('download');
    await downloadButton.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('transparent-loop-test.webm');

    // Verify transparency in WebM
    const outputPath = path.resolve(
      OUTPUT_DIR_RELATIVE,
      'transparent-loop-test.webm'
    );
    await download.saveAs(outputPath);
    // TODO: Supplement hasAlphaStream (ffprobe) with pixel-level transparency verification for WebM.
    expect(hasAlphaStream(outputPath)).toBe(true);
  });

  test('should successfully render an SVG into a WebM (opaque with background backfilling)', async ({
    page,
  }) => {
    await page.goto('/');

    const svgPath = path.resolve(
      __dirname,
      '../../tests/fixtures/transparent-loop-test.svg'
    );
    await page.setInputFiles('input[type="file"]', svgPath);

    // Select WebM, Opaque, and custom background color
    await page.selectOption('#format', 'webm');
    await page.uncheck('#transparent');
    await page.fill('#bg-color', '#ff0000'); // Set background to red

    await page.fill('#duration', '1');
    await page.fill('#fps', '24');

    const exportButton = page.getByRole('button', {
      name: /Export WEBM/i,
    });
    await expect(exportButton).toBeEnabled();
    await exportButton.click();

    const successCard = page.locator('.success-card');
    await expect(successCard).toBeVisible({ timeout: SUCCESS_TIMEOUT });

    const downloadButton = page.locator('text=Download');
    const downloadPromise = page.waitForEvent('download');
    await downloadButton.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('transparent-loop-test.webm');

    // Verify no alpha stream in opaque WebM
    const outputPath = path.resolve(
      OUTPUT_DIR_RELATIVE,
      'transparent-loop-test-opaque.webm'
    );
    await download.saveAs(outputPath);
    // TODO: Supplement hasAlphaStream (ffprobe) with pixel-level opacity verification for WebM.
    expect(hasAlphaStream(outputPath)).toBe(false);
  });

  test('should successfully render an SVG into an aPNG with transparency', async ({
    page,
  }) => {
    await page.goto('/');

    const svgPath = path.resolve(
      __dirname,
      '../../tests/fixtures/transparent-loop-test.svg'
    );
    await page.setInputFiles('input[type="file"]', svgPath);

    await page.selectOption('#format', 'apng');
    await page.check('#transparent');

    await page.fill('#duration', '0.5'); // Shorter for faster test
    await page.fill('#fps', '10');

    const exportButton = page.getByRole('button', {
      name: /Export APNG/i,
    });
    await exportButton.click();

    const successCard = page.locator('.success-card');
    await expect(successCard).toBeVisible({ timeout: SUCCESS_TIMEOUT });

    const downloadButton = page.locator('text=Download');
    const downloadPromise = page.waitForEvent('download');
    await downloadButton.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('transparent-loop-test.png');

    // Verify transparency in aPNG
    const outputPath = path.resolve(
      OUTPUT_DIR_RELATIVE,
      'transparent-loop-test.png'
    );
    await download.saveAs(outputPath);
    expect(hasAlphaStream(outputPath)).toBe(true);
    expect(isPixelTransparent(outputPath)).toBe(true);
  });

  test('should successfully render an SVG into a transparent GIF (GIF89a)', async ({
    page,
  }) => {
    await page.goto('/');

    const svgPath = path.resolve(
      __dirname,
      '../../tests/fixtures/transparent-loop-test.svg'
    );
    await page.setInputFiles('input[type="file"]', svgPath);

    await page.selectOption('#format', 'gif');
    await page.check('#transparent');

    await page.fill('#duration', '0.5');
    await page.fill('#fps', '10');

    const exportButton = page.getByRole('button', {
      name: /Export GIF/i,
    });
    await exportButton.click();

    const successCard = page.locator('.success-card');
    // Increased timeout for GIF animation collection
    await expect(successCard).toBeVisible({ timeout: 60000 });

    const downloadButton = page.locator('text=Download');
    const downloadPromise = page.waitForEvent('download');
    await downloadButton.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('transparent-loop-test.gif');

    // Verify transparency in GIF
    const outputPath = path.resolve(
      OUTPUT_DIR_RELATIVE,
      'transparent-loop-test.gif'
    );
    await download.saveAs(outputPath);
    // TODO: Replace hasAlphaStream (ffprobe) with reliable pixel-level transparency verification for GIFs.
    expect(hasAlphaStream(outputPath)).toBe(true);
  });

  test('should successfully render an SVG into an opaque GIF (with background backfilling)', async ({
    page,
  }) => {
    await page.goto('/');

    const svgPath = path.resolve(
      __dirname,
      '../../tests/fixtures/transparent-loop-test.svg'
    );
    await page.setInputFiles('input[type="file"]', svgPath);

    await page.selectOption('#format', 'gif');
    await page.uncheck('#transparent');
    await page.fill('#bg-color', '#ff0000'); // Set background to red

    await page.fill('#duration', '0.5');
    await page.fill('#fps', '10');

    const exportButton = page.getByRole('button', {
      name: /Export GIF/i,
    });
    await exportButton.click();

    const successCard = page.locator('.success-card');
    await expect(successCard).toBeVisible({ timeout: SUCCESS_TIMEOUT });

    const downloadButton = page.locator('text=Download');
    const downloadPromise = page.waitForEvent('download');
    await downloadButton.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('transparent-loop-test.gif');

    // TODO: Add robust pixel-level opacity verification for opaque GIF output
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
      name: /Export MP4|Processing/i,
    });
    await expect(exportButton).toBeEnabled();
    await exportButton.click();

    const successCard = page.locator('.success-card');
    await expect(successCard).toBeVisible({ timeout: SUCCESS_TIMEOUT });

    const downloadButton = page.locator('text=Download');
    const downloadPromise = page.waitForEvent('download');
    await downloadButton.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('font-test.mp4');

    // Verify metadata of the downloaded file
    const downloadPath = path.resolve(
      OUTPUT_DIR_RELATIVE,
      'font-test-metadata.mp4'
    );
    await download.saveAs(downloadPath);

    const data = getProbeMetadata(downloadPath);
    expect(data['TAG:title']).toBe('Web Title');
    expect(data['TAG:comment']).toMatch(
      /^Web Comment \| Converted from SVG by svg-to-video v\d+\.\d+\.\d+ \(https:\/\/gehdoc\.github\.io\/svg-to-video\/\)$/
    );
  });
});
