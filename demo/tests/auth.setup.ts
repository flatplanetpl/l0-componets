import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');

/**
 * Authentication setup for Playwright tests
 *
 * This setup file runs before tests that require authentication.
 * It uses the test credentials provider defined in lib/auth.test.ts
 *
 * Prerequisites:
 * 1. Update app/api/auth/[...nextauth]/route.ts to use authOptionsTest in test mode
 * 2. Ensure NEXTAUTH_SECRET is set in .env.local
 * 3. Create a signin page that supports credentials provider
 */

setup('authenticate as admin', async ({ page }) => {
  // Navigate to the signin page
  await page.goto('/signin');

  // Wait for the page to load
  await page.waitForLoadState('networkidle');

  // If using credentials provider, fill in the form
  // Note: You need to create a signin page that supports the credentials provider
  // For now, this is a template - adjust selectors based on your actual signin page

  // Option 1: If you have a credentials signin form
  try {
    const emailInput = page.locator('input[name="email"], input[type="email"]');
    const passwordInput = page.locator('input[name="password"], input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    if (await emailInput.isVisible({ timeout: 2000 })) {
      await emailInput.fill('admin@test.com');
      await passwordInput.fill('test123');
      await submitButton.click();

      // Wait for redirect after successful login
      await page.waitForURL(/\/admin|\/dashboard/, { timeout: 10000 });
    } else {
      throw new Error('Signin form not found');
    }
  } catch (error) {
    // Option 2: If credentials form doesn't exist, use API approach
    console.log('Signin form not available, using API approach');

    // Call NextAuth signin API directly
    const response = await page.request.post('/api/auth/signin/credentials', {
      form: {
        email: 'admin@test.com',
        password: 'test123',
        csrfToken: '', // NextAuth will handle this
        callbackUrl: '/admin/dashboard',
        json: 'true'
      }
    });

    if (!response.ok()) {
      console.error('Authentication failed:', await response.text());
      throw new Error('Failed to authenticate');
    }

    // Navigate to a page to ensure cookies are set
    await page.goto('/admin/dashboard');
  }

  // Verify authentication succeeded
  await expect(page).not.toHaveURL(/\/signin/);

  // Save the authenticated state
  await page.context().storageState({ path: authFile });

  console.log('✓ Authentication setup complete');
});
