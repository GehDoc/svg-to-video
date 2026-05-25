import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Conditional video recording
test.use({
  video: process.env.GENERATE_DEMO ? 'on' : 'off',
  viewport: { width: 1280, height: 720 },
});

test.setTimeout(120000);

test('Generate Demo Video - Web Studio', async ({ page }) => {
  await page.goto('/');

  // Wait for the app to be ready
  await page.waitForSelector('input[type="file"]');
  await page.waitForTimeout(1000);

  // =========================================================================
  // 1. INJECTION OF DRIVER.JS (Local dependencies)
  // =========================================================================
  const driverJsPath = path.resolve(
    __dirname,
    '../../node_modules/driver.js/dist/driver.js.iife.js'
  );
  const driverCssPath = path.resolve(
    __dirname,
    '../../node_modules/driver.js/dist/driver.css'
  );

  await page.addStyleTag({ path: driverCssPath });
  await page.addScriptTag({ path: driverJsPath });

  await page.evaluate(() => {
    window.driverObj = window.driver.js.driver({
      showProgress: false,
      animate: true,
      overlayColor: '#000',
      overlayOpacity: 0.5,
      stagePadding: 4,
    });
  });

  const spotlight = async (
    selector: string,
    title = '',
    description = '',
    side: 'top' | 'bottom' | 'left' | 'right' = 'bottom',
    align: 'start' | 'center' | 'end' = 'start'
  ) => {
    const locator = page.locator(selector).first();
    await locator.waitFor({ state: 'visible' });

    await locator.evaluate(
      (el, config) => {
        window.driverObj.highlight({
          element: el,
          popover: config.t
            ? {
                title: config.t,
                description: config.d,
                side: config.s,
                align: config.a,
              }
            : undefined,
        });
      },
      { t: title, d: description, s: side, a: align }
    );

    await page.waitForTimeout(2000);
  };

  const clearSpotlight = async () => {
    await page.evaluate(() => window.driverObj.destroy());
    await page.waitForTimeout(500);
  };

  // =========================================================================
  // 2. SCENARIO
  // =========================================================================

  // Step 1: Import SVG
  await spotlight(
    'input[type="file"]',
    'Import SVG',
    'Start by dropping your animated SVG file here.'
  );
  const svgPath = path.resolve(
    __dirname,
    '../../tests/fixtures/transparent-test.svg'
  );
  await page.setInputFiles('input[type="file"]', svgPath);
  await clearSpotlight();
  await page.waitForTimeout(1000);

  // Step 2: Select Format
  await spotlight(
    '#format',
    'Choose Format',
    'Select your preferred video format. WebM supports transparency!'
  );
  await page.selectOption('#format', 'webm');
  await page.waitForTimeout(1000);
  await clearSpotlight();

  // Step 3: Resolution & Size Detection
  await spotlight(
    '#resolution',
    'Resolution & Size',
    'The tool automatically detects your SVG dimensions.'
  );
  await clearSpotlight();

  // Step 4: Duration & FPS
  await spotlight(
    '#duration',
    'Timing Controls',
    'Duration is auto-detected. Framerate can be adjusted manually for optimal quality.'
  );
  await page.waitForTimeout(500);
  await spotlight(
    '#fps',
    'Timing Controls',
    'Set your desired frames per second.'
  );
  await page.locator('#fps').fill('30');
  await page.waitForTimeout(1000);
  await clearSpotlight();

  // Step 4b: Enable Transparency
  await page.locator('.checkbox-wrapper').scrollIntoViewIfNeeded();
  await spotlight(
    '.checkbox-wrapper',
    'Transparency',
    'Enable transparent background for your overlays and animations.',
    'top'
  );
  await page.check('#transparent');
  await page.waitForTimeout(1000);
  await clearSpotlight();

  // Step 5: Metadata
  await spotlight(
    '.config-section:nth-of-type(4)',
    'Metadata',
    'Add professional touches like titles and comments to your video.'
  );
  await page.locator('#meta-title').fill('Demo Animation');
  await page
    .locator('#meta-comment')
    .fill('Generated automatically using svg-to-video Web Studio.');
  await page.waitForTimeout(1000);
  await clearSpotlight();

  // Step 6: Export
  const exportButton = page.getByRole('button', { name: /Export/i });
  await spotlight(
    '.render-actions button',
    'Export Video',
    'Click export to render your video frame-by-frame in your browser.'
  );
  await exportButton.click();
  await page.waitForTimeout(1000);
  await clearSpotlight();

  // Step 7: Success & Download
  const successCard = page.locator('.success-card, [class*="success"]').first();
  // Ensure we focus on it as soon as it appears
  await successCard.waitFor({ state: 'visible', timeout: 60000 });

  await page.waitForTimeout(500);
  await spotlight(
    '.success-card, [class*="success"]',
    'Success!',
    'Your video is ready! It was rendered entirely locally for maximum privacy.'
  );
  await page.waitForTimeout(1000);
  await clearSpotlight();

  await spotlight(
    'text=Download',
    'Download',
    'Save your high-quality video to your device.',
    'top'
  );
  const downloadPromise = page.waitForEvent('download');
  await page.locator('text=Download').first().click();
  const download = await downloadPromise;

  const downloadPath = path.resolve(
    __dirname,
    '../.vitest-attachments/demo.webm'
  );
  await download.saveAs(downloadPath);

  await page.waitForTimeout(1000);
  await clearSpotlight();
  await page.waitForTimeout(1000); // Final outro
});
