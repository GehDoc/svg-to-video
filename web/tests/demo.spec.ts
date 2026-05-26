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

  // Wait for the app to be ready
  await page.waitForSelector('input[type="file"]');
  await page.waitForLoadState('networkidle');

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

    // 1. Ensure the element is attached to the DOM
    await locator.waitFor({ state: 'attached' });

    // 2. Force a native browser SMOOTH scroll to the element first
    await locator.evaluate((el) => {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'center', // Centers the element in the viewport for a better looking demo
      });
    });

    // 3. Dynamically locate the scrollable parent container and track its frames
    await locator.evaluate(async (el) => {
      // Helper function to find the nearest scrollable parent element
      const getScrollParent = (
        node: HTMLElement | null
      ): HTMLElement | null => {
        if (node == null) {
          return null;
        }
        if (node.scrollHeight > node.clientHeight) {
          const overflowY = window.getComputedStyle(node).overflowY;
          if (overflowY === 'auto' || overflowY === 'scroll') {
            return node;
          }
        }
        return getScrollParent(node.parentElement);
      };

      const scrollContainer = getScrollParent(el as HTMLElement);

      // Monitor the container's internal scroll position until it settles
      if (scrollContainer) {
        await new Promise((resolve) => {
          let lastPos = scrollContainer.scrollTop;
          let identicalFrameCount = 0;

          function verifyMovement() {
            const currentPos = scrollContainer!.scrollTop;

            if (currentPos === lastPos) {
              identicalFrameCount++;
            } else {
              identicalFrameCount = 0; // Container is still smoothly scrolling
            }
            lastPos = currentPos;

            // Settle frame allowance
            if (identicalFrameCount > 8) {
              resolve(true);
            } else {
              requestAnimationFrame(verifyMovement);
            }
          }
          requestAnimationFrame(verifyMovement);
        });
      }
    });

    // 4. Now that we are smoothly positioned near the element, trigger Driver.js
    await locator.evaluate(
      (el, config) => {
        window.driverObj!.highlight({
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
  await page.waitForTimeout(500);
  await clearSpotlight();

  // Step 2: Select Format
  await spotlight(
    '#format',
    'WebM for transparency',
    'Choose WebM to preserve alpha channel support.'
  );
  await page.selectOption('#format', 'webm');
  await page.waitForTimeout(1000);
  await clearSpotlight();

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
  await clearSpotlight();

  // Step 5: Transparency
  await spotlight(
    '.checkbox-wrapper',
    'Enable transparency',
    'Enable transparent backgrounds for overlays.',
    'top'
  );
  await page.check('#transparent');
  await page.waitForTimeout(1000);
  await clearSpotlight();

  // Step 6: Metadata
  await spotlight(
    '.config-section:nth-of-type(4)',
    'Add metadata',
    'Personalize your video with a title.',
    'top'
  );
  await page.locator('#meta-title').fill('My Animation');
  await page.waitForTimeout(1000);
  await clearSpotlight();

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
  const successCard = page.locator('.success-card, [class*="success"]').first();
  await successCard.waitFor({ state: 'visible', timeout: 60000 });
  await page.waitForTimeout(500); // necessary for the animation to complete and the card to be fully visible
  await spotlight(
    '.success-card, [class*="success"]',
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

  await clearSpotlight();
  await page.waitForTimeout(1000); // Final outro
});
