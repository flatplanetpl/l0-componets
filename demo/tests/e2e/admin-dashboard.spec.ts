import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard (Unauthenticated)', () => {
  test('should redirect to signin when not authenticated', async ({ page }) => {
    await page.goto('/admin/dashboard');

    // Should redirect to signin page
    await expect(page).toHaveURL(/\/signin/);
  });

  test('should not have console errors on public pages', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Test brandbook page since it doesn't require auth
    await page.goto('/brandbook');
    await page.waitForLoadState('networkidle');

    // Filter out known non-critical errors and warnings
    const criticalErrors = consoleErrors.filter(error => {
      const lowerError = error.toLowerCase();
      return !error.includes('favicon') &&
             !error.includes('404') &&
             !error.includes('telemetry') &&
             !error.includes('Warning:') && // React warnings
             !error.includes('did not match') && // Hydration warnings
             !error.includes('aria-hidden') && // aria-hidden hydration warnings
             !lowerError.includes('deprecated') // Deprecation warnings
    });

    expect(criticalErrors).toHaveLength(0);
  });
});
