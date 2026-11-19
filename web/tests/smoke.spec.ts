import { test, expect } from '@playwright/test';

test.describe('SVG to Video Web Smoke Test', () => {
  test('should load the page and show the correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/SVG to Video/);
    await expect(page.locator('.header-title')).toContainText('SVG to Video');
  });

  test('should have a disabled render button by default', async ({ page }) => {
    await page.goto('/');
    const renderButton = page.getByRole('button', {
      name: /Export MP4|Processing/i,
    });
    await expect(renderButton).toBeDisabled();
    await expect(renderButton).toContainText('Export MP4');
  });

  test('should have configuration inputs', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('label[for="duration"]')).toBeVisible();
    await expect(page.locator('label[for="hold"]')).toBeVisible();
    await expect(page.locator('label[for="fps"]')).toBeVisible();
    await expect(page.locator('label[for="resolution"]')).toBeVisible();
  });

  test('should have a valid sitemap.xml with weekly change frequency', async ({
    page,
  }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
    const body = await response?.text();
    expect(body).toContain('<loc>https://gehdoc.github.io/svg-to-video/</loc>');
    expect(body).toContain('<changefreq>weekly</changefreq>');
  });

  test('should keep home page indexable and omit canonical link', async ({
    page,
  }) => {
    await page.goto('/');
    const canonicalLink = page.locator('link[rel="canonical"]');
    await expect(canonicalLink).toHaveCount(0);

    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveCount(0);
  });

  test('should disallow Storybook in robots.txt', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
    const body = await response?.text();
    expect(body).toContain('Disallow: /storybook/');
    expect(body).toContain('Disallow: /storybook');
    expect(body).toContain(
      'Sitemap: https://gehdoc.github.io/svg-to-video/sitemap.xml'
    );
  });

  test('should declare Storybook manager and preview as non-indexable in head templates', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const { fileURLToPath } = await import('node:url');
    const dirname = path.dirname(fileURLToPath(import.meta.url));
    const managerHead = fs.readFileSync(
      path.resolve(dirname, '../.storybook/manager-head.html'),
      'utf-8'
    );
    const previewHead = fs.readFileSync(
      path.resolve(dirname, '../.storybook/preview-head.html'),
      'utf-8'
    );

    expect(managerHead).toContain(
      '<meta name="robots" content="noindex, nofollow" />'
    );
    expect(previewHead).toContain(
      '<meta name="robots" content="noindex, nofollow" />'
    );
  });

  test('should apply mobile layout breakpoint on small screen', async ({
    page,
  }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const layout = page.locator('.studio-layout');
    await expect(layout).toBeVisible();

    // Verify computed style for mobile breakpoint
    await expect(layout).toHaveCSS('flex-direction', 'column');
  });

  test('should allow opening sample modal, selecting a sample, and resetting via header home link', async ({
    page,
  }) => {
    await page.goto('/');
    const landingView = page.locator('.landing-view');
    await expect(landingView).toBeVisible();

    // 1. Click Browse Samples button in ConfigPanel
    const browseBtn = page.getByRole('button', {
      name: /Browse sample SVG animations/i,
    });
    await expect(browseBtn).toBeVisible();
    await browseBtn.click();

    // 2. Sample modal should be open
    const modal = page.getByRole('dialog', { name: /Sample Animations/i });
    await expect(modal).toBeVisible();

    // 3. Select a sample from within the modal
    const sampleBtn = modal.getByRole('button', {
      name: /Test Radar Scanner sample/i,
    });
    await sampleBtn.click();

    // 4. Modal closes and RenderingView / preview monitor is visible
    await expect(modal).toBeHidden();
    await expect(landingView).toBeHidden();
    const clearBtn = page.getByRole('button', {
      name: /Clear active SVG and return to home screen/i,
    });
    await expect(clearBtn).toBeVisible();

    // 5. Click Header Home link to reset back to LandingView
    const homeLink = page.getByRole('button', {
      name: /SVG to Video Home/i,
    });
    await homeLink.click();

    // 6. LandingView is restored without full page reload
    await expect(landingView).toBeVisible();
    await expect(clearBtn).toBeHidden();
  });

  test('should allow clearing loaded SVG via ConfigPanel clear button', async ({
    page,
  }) => {
    await page.goto('/');
    const landingView = page.locator('.landing-view');
    await expect(landingView).toBeVisible();

    // Select sample from LandingView
    const rocketBtn = page.getByRole('button', {
      name: /Test Rocket Launch sample/i,
    });
    await rocketBtn.click();

    await expect(landingView).toBeHidden();
    const clearBtn = page.getByRole('button', {
      name: /Clear active SVG and return to home screen/i,
    });
    await expect(clearBtn).toBeVisible();

    // Click clear button
    await clearBtn.click();

    // LandingView is restored
    await expect(landingView).toBeVisible();
    await expect(clearBtn).toBeHidden();
  });
});
