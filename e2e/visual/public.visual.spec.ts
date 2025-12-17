import { test, expect } from '@playwright/test';

test.describe('Visual Regression - Public Pages', () => {
  test.describe('Authentication Page', () => {
    test('login form appearance', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Wait for auth form to be visible
      const authForm = page.locator('form');
      if (await authForm.isVisible()) {
        await expect(authForm).toHaveScreenshot('auth-login-form.png', {
          maxDiffPixels: 100,
        });
      }
    });

    test('login form - filled state', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const emailInput = page.getByRole('textbox', { name: /email/i });
      const passwordInput = page.locator('input[type="password"]');

      if (await emailInput.isVisible()) {
        await emailInput.fill('test@example.com');
        await passwordInput.fill('password123');

        await expect(page.locator('form')).toHaveScreenshot('auth-login-form-filled.png', {
          maxDiffPixels: 100,
        });
      }
    });

    test('login form - error state', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const emailInput = page.getByRole('textbox', { name: /email/i });
      const passwordInput = page.locator('input[type="password"]');
      const loginButton = page.getByRole('button', { name: /entrar|login/i });

      if (await emailInput.isVisible()) {
        await emailInput.fill('invalid@test.com');
        await passwordInput.fill('wrongpassword');
        await loginButton.click();

        // Wait for error to appear
        await page.waitForTimeout(2000);

        await expect(page).toHaveScreenshot('auth-login-error.png', {
          maxDiffPixels: 200,
        });
      }
    });
  });

  test.describe('Loading States', () => {
    test('initial loading spinner', async ({ page }) => {
      // Capture loading state before content loads
      await page.goto('/', { waitUntil: 'commit' });

      const loadingSpinner = page.locator('[data-testid="loading"]');
      if (await loadingSpinner.isVisible({ timeout: 1000 })) {
        await expect(loadingSpinner).toHaveScreenshot('loading-spinner.png');
      }
    });
  });
});

test.describe('Visual Regression - Responsive', () => {
  test.describe('Mobile Viewport', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('auth page mobile', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('auth-mobile.png', {
        fullPage: true,
        maxDiffPixels: 150,
      });
    });
  });

  test.describe('Tablet Viewport', () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test('auth page tablet', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('auth-tablet.png', {
        fullPage: true,
        maxDiffPixels: 150,
      });
    });
  });

  test.describe('Desktop Viewport', () => {
    test.use({ viewport: { width: 1920, height: 1080 } });

    test('auth page desktop wide', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('auth-desktop-wide.png', {
        fullPage: true,
        maxDiffPixels: 150,
      });
    });
  });
});
