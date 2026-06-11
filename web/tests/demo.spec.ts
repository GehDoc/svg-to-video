import { test, type Locator } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRIVER_JS_PATH = path.resolve(
  __dirname,
  '../../node_modules/driver.js/dist/driver.js.iife.js'
);
const DRIVER_CSS_PATH = path.resolve(
  __dirname,
  '../../node_modules/driver.js/dist/driver.css'
);

// Conditional video recording
test.use({
  video: process.env.GENERATE_DEMO ? 'on' : 'off',
  viewport: { width: 1280, height: 720 },
});

test.setTimeout(120000);

test('Generate Demo Video - Web Studio', async ({ page }) => {
  await page.goto('/');

  // Wait for the app to be ready and splash screen to fade out
  await page.waitForSelector('input[type="file"]');
  await page.waitForLoadState('networkidle');

  // Ensure Splash Screen is gone before starting recording interactions
  const splash = page.locator('.seo-fallback');
  await splash.waitFor({ state: 'hidden', timeout: 5000 });

  // =========================================================================
  // 1. INJECTION OF DRIVER.JS (Local dependencies)
  // =========================================================================
  await page.addStyleTag({ path: DRIVER_CSS_PATH });
  await page.addScriptTag({ path: DRIVER_JS_PATH });
  await page.evaluate(() => {
    window.driverObj = window.driver.js.driver({
      showProgress: false,
      animate: true,
      smoothScroll: true,
      overlayColor: '#000',
      overlayOpacity: 0.5,
      stagePadding: 4,
    });
  });

  const spotlight = async (
    target: string | Locator,
    title = '',
    description = '',
    side: 'top' | 'bottom' | 'left' | 'right' = 'bottom',
    align: 'start' | 'center' | 'end' = 'start'
  ) => {
    const locator =
      typeof target === 'string' ? page.locator(target).first() : target;

    // 1. Ensure the element is attached
    await locator.waitFor({ state: 'attached' });

    // 2. Trigger Morph and Scroll simultaneously (no popover yet)
    await locator.evaluate((element) => {
      window.driverObj!.highlight({ element });
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // 3. Wait for the scroll to stabilize
    await locator.evaluate(async (element) => {
      const getScrollParent = (
        node: HTMLElement | null
      ): HTMLElement | null => {
        if (node == null) return null;
        if (node.scrollHeight > node.clientHeight) {
          const overflowY = window.getComputedStyle(node).overflowY;
          if (overflowY === 'auto' || overflowY === 'scroll') return node;
        }
        return getScrollParent(node.parentElement);
      };

      const scrollContainer = getScrollParent(element as HTMLElement);
      if (scrollContainer) {
        await new Promise((resolve) => {
          let lastPos = scrollContainer.scrollTop;
          let identicalFrameCount = 0;
          function verifyMovement() {
            const currentPos = scrollContainer!.scrollTop;
            if (currentPos === lastPos) identicalFrameCount++;
            else identicalFrameCount = 0;
            lastPos = currentPos;
            if (identicalFrameCount > 10) resolve(true);
            else requestAnimationFrame(verifyMovement);
          }
          requestAnimationFrame(verifyMovement);
        });
      } else {
        await new Promise((r) => setTimeout(r, 500));
      }
    });

    // 4. Show the popover once stable
    if (title) {
      await locator.evaluate(
        (element, { title, description, side, align }) => {
          window.driverObj!.highlight({
            element,
            popover: { title, description, side, align },
          });
        },
        { title, description, side, align }
      );
    }

    await page.waitForTimeout(1500);
  };

  const clearSpotlight = async () => {
    await page.evaluate(() => window.driverObj!.destroy());
    await page.waitForTimeout(400);
  };

  // =========================================================================
  // 2. SCENARIO
  // =========================================================================

  // Step 1: Import SVG
  await spotlight(
    'input[type="file"]',
    'Drop your animated SVG',
    'Start by dropping your file here.'
  );
  const svgPath = path.resolve(
    __dirname,
    '../../tests/fixtures/demo-fixture.svg'
  );
  await page.setInputFiles('input[type="file"]', svgPath);
  // Not timeout before the file is fully processed, as the dropzone will change apparence causing highlighting issues.

  // Step 2: Select Format
  await spotlight(
    '#format',
    'WebM for transparency',
    'Choose WebM to preserve alpha channel support.'
  );
  await page.selectOption('#format', 'webm');
  await page.waitForTimeout(1000);

  // Step 3: Timing - Duration
  await spotlight(
    '#duration',
    'Smart auto-detection',
    'Duration is automatically extracted from your SVG.',
    'top'
  );
  await page.locator('#duration').fill('2');
  await page.waitForTimeout(1000);

  // Step 4: Timing - FPS
  await spotlight(
    '#fps',
    'Adjust quality',
    'Set your desired frames per second.',
    'top'
  );
  await page.locator('#fps').fill('12');
  await page.waitForTimeout(1000);

  // Step 5: Transparency
  await spotlight(
    '.checkbox-wrapper',
    'Enable transparency',
    'Enable transparent backgrounds for overlays.',
    'top'
  );
  await page.check('#transparent');
  await page.waitForTimeout(1000);

  // Step 6: Metadata
  await spotlight(
    '.config-section:nth-of-type(4)',
    'Add metadata',
    'Personalize your video with a title.',
    'top'
  );
  await page.locator('#meta-title').fill('My Animation');
  await page.waitForTimeout(1000);

  // Step 7: Export
  const exportButton = page.getByRole('button', { name: /Export/i });
  await spotlight(
    exportButton,
    'Browser-side rendering',
    'Click export to render frame-by-frame locally.',
    'top'
  );
  await exportButton.click();
  await page.waitForTimeout(500);
  await clearSpotlight();

  // Step 8: Success
  const successCard = page.locator('.success-card').first();
  await successCard.waitFor({ state: 'visible', timeout: 60000 });
  await page.waitForTimeout(500); // necessary for the animation to complete and the card to be fully visible
  await spotlight(
    '.success-card',
    '100% Private & Local',
    'Your video was rendered entirely in your browser.'
  );

  // Step 9: Download
  await spotlight(
    'text=Download',
    'Get your video',
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
});
