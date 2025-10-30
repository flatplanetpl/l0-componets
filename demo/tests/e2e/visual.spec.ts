import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test.skip('admin dashboard visual test', async ({ page }) => {
    // Skip this test as it requires authentication setup
    await page.goto('/admin/dashboard');
    await page.waitForLoadState('networkidle');

    // Hide dynamic content
    await page.addStyleTag({
      content: `
        [data-testid="current-time"],
        .animate-spin,
        .animate-pulse {
          visibility: hidden !important;
        }
      `
    });

    await expect(page).toHaveScreenshot('admin-dashboard.png', {
      threshold: 0.2,
      maxDiffPixels: 5000
    });
  });

  test.skip('responsive dashboard views', async ({ page }) => {
    // Skip this test as it requires authentication setup
    await page.goto('/admin/dashboard');
    await page.waitForLoadState('networkidle');

    // Desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page).toHaveScreenshot('dashboard-desktop.png', {
      threshold: 0.2,
      maxDiffPixels: 5000
    });

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page).toHaveScreenshot('dashboard-tablet.png', {
      threshold: 0.2,
      maxDiffPixels: 5000
    });

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page).toHaveScreenshot('dashboard-mobile.png', {
      threshold: 0.2,
      maxDiffPixels: 5000
    });
  });
});
