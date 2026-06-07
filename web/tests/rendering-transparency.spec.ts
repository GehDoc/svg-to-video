import { test, expect } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  hasAlphaStream,
  isPixelTransparent,
  extractFrame,
  getPixelRGBA,
  getFrameCount,
  SUCCESS_TIMEOUT,
  ensureOutputDir,
} from '../../tests/helpers/e2e.js';
import { getTestOutputPath } from './helpers/web-e2e.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TEST_DURATION = '0.5';
const TEST_FPS = '10';
const TEST_BG_COLOR = '#ff0000';

// Ensure output dir for E2E verification
ensureOutputDir();

test.describe('Rendering Pipeline: Transparency & Backgrounds', () => {
  test('should successfully render an SVG into an MP4 (opaque with background backfilling)', async ({
    page,
  }, testInfo) => {
    await page.goto('/');

    const svgPath = path.resolve(
      __dirname,
      '../../tests/fixtures/transparent-loop-test.svg'
    );
    await page.setInputFiles('input[type="file"]', svgPath);

    // Select MP4 (default), Opaque, and custom background color
    await page.uncheck('#transparent');
    await page.fill('#bg-color', TEST_BG_COLOR); // Set background to red

    await page.fill('#duration', TEST_DURATION);
    await page.fill('#fps', TEST_FPS);

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

    const suggestedName = download.suggestedFilename();
    expect(suggestedName).toBe('transparent-loop-test.mp4');

    // Verify background color (flattened red background - allow tolerance for encoding)
    const outputPath = getTestOutputPath(testInfo, suggestedName);
    await download.saveAs(outputPath);
    const framePath = getTestOutputPath(testInfo, 'frame.png');
    extractFrame(outputPath, framePath);
    const pixel = getPixelRGBA(framePath, 10, 10);

    // Check if pixel is close to Red
    expect(pixel.r).toBeGreaterThan(240);
    expect(pixel.g).toBeLessThan(15);
    expect(pixel.b).toBeLessThan(15);
    expect(pixel.a).toBe(255); // Opaque
  });

  test('should successfully render an SVG into a WebM with transparency', async ({
    page,
  }, testInfo) => {
    await page.goto('/');

    const svgPath = path.resolve(
      __dirname,
      '../../tests/fixtures/transparent-loop-test.svg'
    );
    await page.setInputFiles('input[type="file"]', svgPath);

    // Select WebM and Transparency
    await page.selectOption('#format', 'webm');
    await page.check('#transparent');

    await page.fill('#duration', TEST_DURATION);
    await page.fill('#fps', TEST_FPS);

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

    const suggestedName = download.suggestedFilename();
    expect(suggestedName).toBe('transparent-loop-test.webm');

    // Verify transparency in WebM
    const outputPath = getTestOutputPath(testInfo, suggestedName);
    await download.saveAs(outputPath);

    // Extract a frame and verify transparency
    const framePath = getTestOutputPath(testInfo, 'frame.png');
    extractFrame(outputPath, framePath);
    expect(isPixelTransparent(framePath, 10, 10)).toBe(true);
    expect(hasAlphaStream(outputPath)).toBe(true);
  });

  test('should successfully render an SVG into a WebM (opaque with background backfilling)', async ({
    page,
  }, testInfo) => {
    await page.goto('/');

    const svgPath = path.resolve(
      __dirname,
      '../../tests/fixtures/transparent-loop-test.svg'
    );
    await page.setInputFiles('input[type="file"]', svgPath);

    // Select WebM, Opaque, and custom background color
    await page.selectOption('#format', 'webm');
    await page.uncheck('#transparent');
    await page.fill('#bg-color', TEST_BG_COLOR); // Set background to red

    await page.fill('#duration', TEST_DURATION);
    await page.fill('#fps', TEST_FPS);

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

    const suggestedName = download.suggestedFilename();
    expect(suggestedName).toBe('transparent-loop-test.webm');

    // Verify no alpha stream and correct background color in opaque WebM
    const outputPath = getTestOutputPath(testInfo, suggestedName);
    await download.saveAs(outputPath);

    // Extract a frame and verify opacity and background color
    const framePath = getTestOutputPath(testInfo, 'frame.png');
    extractFrame(outputPath, framePath);
    const pixel = getPixelRGBA(framePath, 10, 10);

    // Check if pixel is close to Red
    expect(pixel.r).toBeGreaterThan(240);
    expect(pixel.g).toBeLessThan(15);
    expect(pixel.b).toBeLessThan(15);
    expect(pixel.a).toBe(255); // Opaque
  });

  test('should successfully render an SVG into an aPNG with transparency', async ({
    page,
  }, testInfo) => {
    await page.goto('/');

    const svgPath = path.resolve(
      __dirname,
      '../../tests/fixtures/transparent-loop-test.svg'
    );
    await page.setInputFiles('input[type="file"]', svgPath);

    await page.selectOption('#format', 'apng');
    await page.check('#transparent');

    await page.fill('#duration', TEST_DURATION);
    await page.fill('#fps', TEST_FPS);

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

    const suggestedName = download.suggestedFilename();
    expect(suggestedName).toBe('transparent-loop-test.png');

    // Verify transparency in aPNG
    const outputPath = getTestOutputPath(testInfo, suggestedName);
    await download.saveAs(outputPath);

    // Verify frame count
    expect(getFrameCount(outputPath)).toBe(5);

    expect(hasAlphaStream(outputPath)).toBe(true);
    expect(isPixelTransparent(outputPath)).toBe(true);
  });

  test('should successfully render an SVG into an aPNG (opaque with background backfilling)', async ({
    page,
  }, testInfo) => {
    await page.goto('/');

    const svgPath = path.resolve(
      __dirname,
      '../../tests/fixtures/transparent-loop-test.svg'
    );
    await page.setInputFiles('input[type="file"]', svgPath);

    // Select aPNG, Opaque, and custom background color
    await page.selectOption('#format', 'apng');
    await page.uncheck('#transparent');
    await page.fill('#bg-color', TEST_BG_COLOR); // Set background to red

    await page.fill('#duration', TEST_DURATION);
    await page.fill('#fps', TEST_FPS);

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

    const suggestedName = download.suggestedFilename();
    expect(suggestedName).toBe('transparent-loop-test.png');

    // Verify background color (flattened red background)
    const outputPath = getTestOutputPath(testInfo, suggestedName);
    await download.saveAs(outputPath);
    const pixel = getPixelRGBA(outputPath, 10, 10);

    // Check if pixel is close to Red
    expect(pixel.r).toBeGreaterThan(240);
    expect(pixel.g).toBeLessThan(15);
    expect(pixel.b).toBeLessThan(15);
    expect(pixel.a).toBe(255); // Opaque
  });

  test('should successfully render an SVG into a transparent GIF (GIF89a)', async ({
    page,
  }, testInfo) => {
    await page.goto('/');

    const svgPath = path.resolve(
      __dirname,
      '../../tests/fixtures/transparent-loop-test.svg'
    );
    await page.setInputFiles('input[type="file"]', svgPath);

    await page.selectOption('#format', 'gif');
    await page.check('#transparent');

    await page.fill('#duration', TEST_DURATION);
    await page.fill('#fps', TEST_FPS);

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

    const suggestedName = download.suggestedFilename();
    expect(suggestedName).toBe('transparent-loop-test.gif');

    // Verify transparency in GIF
    const outputPath = getTestOutputPath(testInfo, suggestedName);
    await download.saveAs(outputPath);

    // Verify frame count
    expect(getFrameCount(outputPath)).toBe(5);

    // Extract a frame to check transparency
    const framePath = getTestOutputPath(testInfo, 'frame.png');
    extractFrame(outputPath, framePath);
    expect(isPixelTransparent(framePath, 10, 10)).toBe(true);
  });

  test('should successfully render an SVG into an opaque GIF (with background backfilling)', async ({
    page,
  }, testInfo) => {
    await page.goto('/');

    const svgPath = path.resolve(
      __dirname,
      '../../tests/fixtures/transparent-loop-test.svg'
    );
    await page.setInputFiles('input[type="file"]', svgPath);

    await page.selectOption('#format', 'gif');
    await page.uncheck('#transparent');
    await page.fill('#bg-color', TEST_BG_COLOR); // Set background to red

    await page.fill('#duration', TEST_DURATION);
    await page.fill('#fps', TEST_FPS);

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

    const suggestedName = download.suggestedFilename();
    expect(suggestedName).toBe('transparent-loop-test.gif');

    // Verify background color (flattened red background - allow tolerance for encoding)
    const outputPath = getTestOutputPath(testInfo, suggestedName);
    await download.saveAs(outputPath);

    // Verify frame count
    expect(getFrameCount(outputPath)).toBe(5);

    const framePath = getTestOutputPath(testInfo, 'frame.png');
    extractFrame(outputPath, framePath);
    const pixel = getPixelRGBA(framePath, 10, 10);

    // Check if pixel is close to Red and Opaque
    expect(pixel.r).toBeGreaterThan(240);
    expect(pixel.g).toBeLessThan(15);
    expect(pixel.b).toBeLessThan(15);
    expect(pixel.a).toBe(255); // Opaque
  });
});
