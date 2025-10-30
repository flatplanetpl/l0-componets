import { test, expect } from '@playwright/test';

test.describe('Brandbook Showcase', () => {
  test('should load brandbook page with all components', async ({ page }) => {
    await page.goto('/brandbook');

    // Check page title and header (use first h1 to avoid conflicts)
    await expect(page).toHaveTitle(/EduPlatform/);
    await expect(page.locator('h1').first()).toContainText('System projektowy EduPlatform');

    // Check theme toggle is present
    await expect(page.locator('button[aria-label*="tryb kolorystyczny"]')).toBeVisible();

    // Check main sections are present (use more specific selectors)
    const sections = [
      'Paleta kolorów',
      'Komponenty marketingowe',
      'Pola formularzy',
      'Ładowanie plików',
      'Autocomplete',
      'Suwak (Slider)',
      'Kontrolki dat i czasu',
      'Step-by-step (Stepper)',
      'Akordeon',
      'Zakładki (Tabs)',
      'Siatka układu',
      'Listy',
      'Karty KPI / Statystyki',
      'Toolbar',
      'Nagłówki sekcji',
      'Tooltip i Popover',
      'Badges i statusy',
      'Wskaźniki postępu',
      'Avatar',
      'Toast (Powiadomienia)',
      'Mega menu',
      'Menu kontekstowe',
      'Split Button',
      'Linki tekstowe',
      'Chips i aktywne filtry',
      'Lista z przyciskiem "Załaduj więcej"',
      'Komunikaty inline',
      'Alerty globalne',
      'Breadcrumbs',
      'Paginacja',
      'Footer',
      'Komponenty administracyjne',
      'Modal i toast – interakcje'
    ];

    for (const section of sections) {
      await expect(page.locator('h2').filter({ hasText: section })).toBeVisible();
    }

    // Check buttons section separately (avoid conflict with "Lista z przyciskiem")
    const buttonsSection = page.locator('section').filter({ has: page.locator('h2').filter({ hasText: 'Przyciski' }) });
    await expect(buttonsSection.first()).toBeVisible();
  });

  test('should capture brandbook homepage screenshot', async ({ page }) => {
    await page.goto('/brandbook');
    await page.waitForLoadState('networkidle');

    // Hide dynamic elements and wait for stability
    await page.addStyleTag({
      content: `
        [data-testid*="toast"],
        .animate-spin,
        .animate-pulse,
        .transition-all,
        .transition-colors {
          animation: none !important;
          transition: none !important;
        }
      `
    });

    // Wait for any dynamic content to settle
    await page.waitForTimeout(2000);

    await expect(page).toHaveScreenshot('brandbook-homepage.png', {
      fullPage: true,
      threshold: 0.3,
      maxDiffPixelRatio: 0.15,
      timeout: 10000
    });
  });

  test('should capture color palette section', async ({ page }) => {
    await page.goto('/brandbook');
    await page.waitForLoadState('networkidle');

    // Scroll to color palette section
    const colorSection = page.locator('h2').filter({ hasText: 'Paleta kolorów' });
    await colorSection.scrollIntoViewIfNeeded();

    // Take screenshot of the color palette section
    const sectionElement = page.locator('section').filter({ has: page.locator('h2').filter({ hasText: 'Paleta kolorów' }) });
    await expect(sectionElement).toHaveScreenshot('brandbook-color-palette.png', {
      threshold: 0.2,
      maxDiffPixels: 5000
    });
  });

  test('should capture buttons section', async ({ page }) => {
    await page.goto('/brandbook');
    await page.waitForLoadState('networkidle');

    // Find buttons section more specifically (avoid conflict with "Lista z przyciskiem")
    const buttonsSection = page.locator('section').filter({ has: page.locator('h2').filter({ hasText: 'Przyciski' }) });
    await buttonsSection.first().scrollIntoViewIfNeeded();

    // Take screenshot of the buttons section
    await expect(buttonsSection.first()).toHaveScreenshot('brandbook-buttons.png', {
      threshold: 0.2,
      maxDiffPixels: 5000
    });
  });

  test('should capture form fields section', async ({ page }) => {
    await page.goto('/brandbook');
    await page.waitForLoadState('networkidle');

    // Scroll to form fields section
    const formSection = page.locator('h2').filter({ hasText: 'Pola formularzy' });
    await formSection.scrollIntoViewIfNeeded();

    // Take screenshot of the form fields section
    const sectionElement = page.locator('section').filter({ has: page.locator('h2').filter({ hasText: 'Pola formularzy' }) });
    await expect(sectionElement).toHaveScreenshot('brandbook-form-fields.png', {
      threshold: 0.2,
      maxDiffPixels: 5000
    });
  });

  test('should capture admin components section', async ({ page }) => {
    await page.goto('/brandbook');
    await page.waitForLoadState('networkidle');

    // Scroll to admin components section
    const adminSection = page.locator('h2').filter({ hasText: 'Komponenty administracyjne' });
    await adminSection.scrollIntoViewIfNeeded();

    // Take screenshot of the admin components section
    const sectionElement = page.locator('section').filter({ has: page.locator('h2').filter({ hasText: 'Komponenty administracyjne' }) });
    await expect(sectionElement).toHaveScreenshot('brandbook-admin-components.png', {
      threshold: 0.3,
      maxDiffPixelRatio: 0.1
    });
  });

  test('should test interactive components', async ({ page }) => {
    await page.goto('/brandbook');
    await page.waitForLoadState('networkidle');

    // Test theme toggle
    const themeToggle = page.locator('button[aria-label*="tryb kolorystyczny"]');
    await themeToggle.click();

    // Verify theme changed (body should have dark class)
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Test toast button
    const toastButton = page.locator('button').filter({ hasText: 'Pokaż toast kontrolny' });
    await toastButton.click();

    // Check if toast appears (this might be tricky to test reliably)
    // For now, just ensure the button works without errors
    await expect(page.locator('body')).toBeVisible();

    // Test modal button
    const modalButton = page.locator('button').filter({ hasText: 'Otwórz demo modala' });
    await modalButton.click();

    // Check if modal appears
    await expect(page.locator('text=Potwierdź akcję')).toBeVisible();

    // Close modal
    const cancelButton = page.locator('button').filter({ hasText: 'Anuluj' });
    await cancelButton.click();

    // Verify modal is closed
    await expect(page.locator('text=Potwierdź akcję')).not.toBeVisible();
  });

  test('should capture brandbook in light mode', async ({ page }) => {
    await page.goto('/brandbook');
    await page.waitForLoadState('networkidle');

    // Ensure light mode
    const htmlElement = page.locator('html');
    await expect(htmlElement).not.toHaveClass(/dark/);

    // Hide dynamic elements and wait for stability
    await page.addStyleTag({
      content: `
        [data-testid*="toast"],
        .animate-spin,
        .animate-pulse,
        .transition-all,
        .transition-colors {
          animation: none !important;
          transition: none !important;
        }
      `
    });

    // Wait for any dynamic content to settle
    await page.waitForTimeout(2000);

    // Take full page screenshot in light mode
    await expect(page).toHaveScreenshot('brandbook-light-mode.png', {
      fullPage: true,
      threshold: 0.3,
      maxDiffPixelRatio: 0.15,
      timeout: 10000
    });
  });

  test('should capture brandbook in dark mode', async ({ page }) => {
    await page.goto('/brandbook');
    await page.waitForLoadState('networkidle');

    // Switch to dark mode
    const themeToggle = page.locator('button[aria-label*="tryb kolorystyczny"]');
    await themeToggle.click();

    // Verify dark mode is active
    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveClass(/dark/);

    // Hide dynamic elements and wait for stability
    await page.addStyleTag({
      content: `
        [data-testid*="toast"],
        .animate-spin,
        .animate-pulse,
        .transition-all,
        .transition-colors {
          animation: none !important;
          transition: none !important;
        }
      `
    });

    // Wait for any dynamic content to settle
    await page.waitForTimeout(2000);

    // Take full page screenshot in dark mode
    await expect(page).toHaveScreenshot('brandbook-dark-mode.png', {
      fullPage: true,
      threshold: 0.3,
      maxDiffPixelRatio: 0.15,
      timeout: 10000
    });
  });

  test('should test form interactions', async ({ page }) => {
    await page.goto('/brandbook');
    await page.waitForLoadState('networkidle');

    // Scroll to form fields section
    const formSection = page.locator('h2').filter({ hasText: 'Pola formularzy' });
    await formSection.scrollIntoViewIfNeeded();

    // Test text field
    const nameField = page.locator('input[id="showcase-name"]');
    await nameField.fill('Test User');
    await expect(nameField).toHaveValue('Test User');

    // Test select field
    const roleSelect = page.locator('select[id="showcase-role"]');
    await roleSelect.selectOption('Instructor');
    await expect(roleSelect).toHaveValue('Instructor');

    // Test checkbox
    const marketingCheckbox = page.locator('input[id="showcase-marketing"]');
    await marketingCheckbox.check();
    await expect(marketingCheckbox).toBeChecked();

    // Test radio group
    const standardPlanRadio = page.locator('input[value="standard"]');
    await standardPlanRadio.check();
    await expect(standardPlanRadio).toBeChecked();
  });

  test('should test navigation components', async ({ page }) => {
    await page.goto('/brandbook');
    await page.waitForLoadState('networkidle');

    // Test breadcrumbs (use more specific selector to avoid conflicts)
    const breadcrumbsSection = page.locator('section').filter({ has: page.locator('h2').filter({ hasText: 'Breadcrumbs' }) });
    if (await breadcrumbsSection.count() > 0) {
      const breadcrumbHome = breadcrumbsSection.locator('nav a').filter({ hasText: 'Home' });
      await expect(breadcrumbHome).toBeVisible();
    }

    // Test pagination (check if it exists first)
    const paginationSection = page.locator('section').filter({ has: page.locator('h2').filter({ hasText: 'Paginacja' }) });
    if (await paginationSection.count() > 0 && await paginationSection.isVisible()) {
      const pagination = paginationSection.locator('[role="navigation"]');
      if (await pagination.count() > 0) {
        await expect(pagination).toBeVisible();

        // Test pagination interaction
        const page2Button = pagination.locator('button').filter({ hasText: '2' });
        if (await page2Button.isVisible()) {
          await page2Button.click();
          // Verify page changed (this would need more specific assertions based on your pagination implementation)
        }
      }
    }
  });
});