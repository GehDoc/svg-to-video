import { test, expect } from '@playwright/test';

test.describe('SVG to Video Web Smoke Test', () => {
  test('should load the page and show the correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/web/);
    await expect(page.locator('h1')).toContainText('SVG to Video');
  });

  test('should have a disabled render button by default', async ({ page }) => {
    await page.goto('/');
    const renderButton = page.locator('button.render-button');
    await expect(renderButton).toBeDisabled();
    await expect(renderButton).toContainText('Render & Download MP4');
  });
});
