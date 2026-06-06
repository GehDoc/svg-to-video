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

  test('should have a valid sitemap.xml', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
    const body = await response?.text();
    expect(body).toContain('<loc>https://gehdoc.github.io/svg-to-video/</loc>');
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
});
