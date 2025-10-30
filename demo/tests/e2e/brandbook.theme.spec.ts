import { test, expect } from '@playwright/test';

test.describe('Brandbook – motywy', () => {
  test('powinien poprawnie wyświetlać motyw jasny i ciemny', async ({ page }) => {
    await page.goto('/brandbook');
    await page.waitForLoadState('networkidle');

    const hero = page.locator('h1:has-text("System projektowy EduPlatform")');
    await expect(hero).toBeVisible();

    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('brandbook-light.png', {
      fullPage: true,
      threshold: 0.2,
      maxDiffPixelRatio: 0.05
    });

    const themeToggle = page.locator('button[aria-label="Przełącz tryb kolorystyczny"]');
    await themeToggle.click();
    await page.waitForTimeout(600);
    await expect(page).toHaveScreenshot('brandbook-dark.png', {
      fullPage: true,
      threshold: 0.2,
      maxDiffPixelRatio: 0.05
    });
  });
});
