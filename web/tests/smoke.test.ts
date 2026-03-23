import { test, expect } from '@playwright/test';

test.describe('SVG to Video Web Smoke Test', () => {
  test('should load the page and show the correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/SVG to Video/);
    await expect(page.locator('h1')).toContainText('SVG to Video');
  });

  test('should have a disabled render button by default', async ({ page }) => {
    await page.goto('/');
    const renderButton = page.locator('button.render-button');
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
});
