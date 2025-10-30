import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard (Authenticated)', () => {
  test('should load dashboard page without errors', async ({ page }) => {
    await page.goto('/admin/dashboard');

    // Check if page loads
    await expect(page).toHaveTitle(/EduPlatform/);

    // Check for main dashboard elements
    await expect(page.locator('h1')).toContainText('Dashboard');

    // Check for stats cards
    const statsCards = page.locator('.bg-white.p-6.rounded-xl');
    await expect(statsCards.first()).toBeVisible();

    // Check for navigation
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should have responsive layout', async ({ page }) => {
    await page.goto('/admin/dashboard');

    // Desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('body')).toBeVisible();

    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();

    // Check no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 20); // Allow small margin
  });

  test('should not have console errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/admin/dashboard');
    await page.waitForLoadState('networkidle');

    // Filter out known non-critical errors and warnings
    const criticalErrors = consoleErrors.filter(error => {
      const lowerError = error.toLowerCase();
      return !error.includes('favicon') &&
             !error.includes('404') &&
             !error.includes('telemetry') &&
             !error.includes('Warning:') && // React warnings
             !error.includes('did not match') && // Hydration warnings
             !lowerError.includes('deprecated') // Deprecation warnings
    });

    expect(criticalErrors).toHaveLength(0);
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/admin/dashboard');

    // Find navigation links
    const navLinks = page.locator('a[href^="/admin"]');
    const linkCount = await navLinks.count();

    expect(linkCount).toBeGreaterThan(0);

    // Test first few links
    for (let i = 0; i < Math.min(3, linkCount); i++) {
      const link = navLinks.nth(i);
      const href = await link.getAttribute('href');

      if (href && href !== '/admin/dashboard') {
        await link.click();
        await page.waitForLoadState('networkidle');
        expect(page.url()).toContain(href);
        await page.goBack();
      }
    }
  });

  test('should display user information', async ({ page }) => {
    await page.goto('/admin/dashboard');

    // Check for user name in the interface
    await expect(page.locator('text=Test Admin')).toBeVisible();

    // Check for user role (from session)
    const roleText = page.locator('text=/admin|user|operator/i');
    await expect(roleText.first()).toBeVisible();
  });

  test('should display dashboard statistics', async ({ page }) => {
    await page.goto('/admin/dashboard');

    // Check for stat cards with numbers
    await expect(page.locator('text=/Total Users|Active Courses|Monthly Revenue/i').first()).toBeVisible();

    // Check for numeric values
    await expect(page.locator('text=/\\d+,?\\d*/').first()).toBeVisible();
  });

  test('should have functional sidebar navigation', async ({ page }) => {
    await page.goto('/admin/dashboard');

    // Get all sidebar links
    const sidebarLinks = page.locator('nav a[href^="/admin"]');
    const count = await sidebarLinks.count();

    // Should have multiple navigation items
    expect(count).toBeGreaterThan(3);

    // Check that clicking users link navigates correctly
    const usersLink = page.locator('nav a[href="/admin/users"]');
    if (await usersLink.count() > 0) {
      await usersLink.click();
      await expect(page).toHaveURL(/\/admin\/users/);
    }
  });
});
