import { test, expect } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  hasAlphaStream,
  isPixelTransparent,
  extractFrame,
  getPixelRGBA,
  getFrameCount,
  ensureOutputDir,
} from '../../tests/helpers/e2e.js';
import { getTestOutputPath, exportStudioVideo } from './helpers/web-e2e.js';

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

    const download = await exportStudioVideo(page, svgPath, {
      format: 'mp4',
      isTransparent: false,
      backgroundColor: TEST_BG_COLOR,
      duration: TEST_DURATION,
      fps: TEST_FPS,
    });

    const suggestedName = download.suggestedFilename();
    expect(suggestedName).toBe('transparent-loop-test.mp4');

    const outputPath = getTestOutputPath(testInfo, suggestedName);
    await download.saveAs(outputPath);
    const framePath = getTestOutputPath(testInfo, 'frame.png');
    extractFrame(outputPath, framePath);
    const pixel = getPixelRGBA(framePath, 10, 10);

    expect(pixel.r).toBeGreaterThan(240);
    expect(pixel.g).toBeLessThan(15);
    expect(pixel.b).toBeLessThan(15);
    expect(pixel.a).toBe(255);
  });

  test('should successfully render an SVG into a WebM with transparency', async ({
    page,
  }, testInfo) => {
    await page.goto('/');

    const svgPath = path.resolve(
      __dirname,
      '../../tests/fixtures/transparent-loop-test.svg'
    );

    const download = await exportStudioVideo(page, svgPath, {
      format: 'webm',
      isTransparent: true,
      duration: TEST_DURATION,
      fps: TEST_FPS,
    });

    const suggestedName = download.suggestedFilename();
    expect(suggestedName).toBe('transparent-loop-test.webm');

    const outputPath = getTestOutputPath(testInfo, suggestedName);
    await download.saveAs(outputPath);

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

    const download = await exportStudioVideo(page, svgPath, {
      format: 'webm',
      isTransparent: false,
      backgroundColor: TEST_BG_COLOR,
      duration: TEST_DURATION,
      fps: TEST_FPS,
    });

    const suggestedName = download.suggestedFilename();
    expect(suggestedName).toBe('transparent-loop-test.webm');

    const outputPath = getTestOutputPath(testInfo, suggestedName);
    await download.saveAs(outputPath);

    const framePath = getTestOutputPath(testInfo, 'frame.png');
    extractFrame(outputPath, framePath);
    const pixel = getPixelRGBA(framePath, 10, 10);

    expect(pixel.r).toBeGreaterThan(240);
    expect(pixel.g).toBeLessThan(15);
    expect(pixel.b).toBeLessThan(15);
    expect(pixel.a).toBe(255);
  });

  test('should successfully render an SVG into an aPNG with transparency', async ({
    page,
  }, testInfo) => {
    await page.goto('/');

    const svgPath = path.resolve(
      __dirname,
      '../../tests/fixtures/transparent-loop-test.svg'
    );

    const download = await exportStudioVideo(page, svgPath, {
      format: 'apng',
      isTransparent: true,
      duration: TEST_DURATION,
      fps: TEST_FPS,
    });

    const suggestedName = download.suggestedFilename();
    expect(suggestedName).toBe('transparent-loop-test.png');

    const outputPath = getTestOutputPath(testInfo, suggestedName);
    await download.saveAs(outputPath);

    expect(getFrameCount(outputPath)).toBe(5);
    expect(hasAlphaStream(outputPath)).toBe(true);

    const framePath = getTestOutputPath(testInfo, 'frame.png');
    extractFrame(outputPath, framePath);
    expect(isPixelTransparent(framePath, 10, 10)).toBe(true);
  });

  test('should successfully render an SVG into an aPNG (opaque with background backfilling)', async ({
    page,
  }, testInfo) => {
    await page.goto('/');

    const svgPath = path.resolve(
      __dirname,
      '../../tests/fixtures/transparent-loop-test.svg'
    );

    const download = await exportStudioVideo(page, svgPath, {
      format: 'apng',
      isTransparent: false,
      backgroundColor: TEST_BG_COLOR,
      duration: TEST_DURATION,
      fps: TEST_FPS,
    });

    const suggestedName = download.suggestedFilename();
    expect(suggestedName).toBe('transparent-loop-test.png');

    const outputPath = getTestOutputPath(testInfo, suggestedName);
    await download.saveAs(outputPath);

    const framePath = getTestOutputPath(testInfo, 'frame.png');
    extractFrame(outputPath, framePath);
    const pixel = getPixelRGBA(framePath, 10, 10);

    expect(pixel.r).toBeGreaterThan(240);
    expect(pixel.g).toBeLessThan(15);
    expect(pixel.b).toBeLessThan(15);
    expect(pixel.a).toBe(255);
  });

  test('should successfully render an SVG into a transparent GIF (GIF89a)', async ({
    page,
  }, testInfo) => {
    await page.goto('/');

    const svgPath = path.resolve(
      __dirname,
      '../../tests/fixtures/transparent-loop-test.svg'
    );

    const download = await exportStudioVideo(page, svgPath, {
      format: 'gif',
      isTransparent: true,
      duration: TEST_DURATION,
      fps: TEST_FPS,
    });

    const suggestedName = download.suggestedFilename();
    expect(suggestedName).toBe('transparent-loop-test.gif');

    const outputPath = getTestOutputPath(testInfo, suggestedName);
    await download.saveAs(outputPath);

    expect(getFrameCount(outputPath)).toBe(5);

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

    const download = await exportStudioVideo(page, svgPath, {
      format: 'gif',
      isTransparent: false,
      backgroundColor: TEST_BG_COLOR,
      duration: TEST_DURATION,
      fps: TEST_FPS,
    });

    const suggestedName = download.suggestedFilename();
    expect(suggestedName).toBe('transparent-loop-test.gif');

    const outputPath = getTestOutputPath(testInfo, suggestedName);
    await download.saveAs(outputPath);

    expect(getFrameCount(outputPath)).toBe(5);

    const framePath = getTestOutputPath(testInfo, 'frame.png');
    extractFrame(outputPath, framePath);
    const pixel = getPixelRGBA(framePath, 10, 10);

    expect(pixel.r).toBeGreaterThan(240);
    expect(pixel.g).toBeLessThan(15);
    expect(pixel.b).toBeLessThan(15);
    expect(pixel.a).toBe(255);
  });
});
