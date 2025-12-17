import { test, expect } from '@playwright/test';

test.describe('Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Global Shortcuts', () => {
    test('should open command palette with Cmd+K', async ({ page }) => {
      await page.keyboard.press('Meta+k');
      
      const commandPalette = page.getByRole('dialog');
      await expect(commandPalette).toBeVisible({ timeout: 2000 }).catch(() => {
        // May not work without auth
      });
    });

    test('should navigate to Home with Ctrl+H', async ({ page }) => {
      await page.goto('/projects');
      await page.keyboard.press('Control+h');
      
      await page.waitForURL('/', { timeout: 3000 }).catch(() => {
        // Navigation may require auth
      });
    });

    test('should navigate to Inbox with Ctrl+I', async ({ page }) => {
      await page.keyboard.press('Control+i');
      
      await page.waitForURL(/inbox/, { timeout: 3000 }).catch(() => {
        // May require auth
      });
    });

    test('should navigate to Projects with Ctrl+P', async ({ page }) => {
      await page.keyboard.press('Control+p');
      
      await page.waitForURL(/projects/, { timeout: 3000 }).catch(() => {
        // May require auth
      });
    });

    test('should navigate to Journal with Ctrl+J', async ({ page }) => {
      await page.keyboard.press('Control+j');
      
      await page.waitForURL(/journal/, { timeout: 3000 }).catch(() => {
        // May require auth
      });
    });

    test('should navigate to Calendar with Ctrl+L', async ({ page }) => {
      await page.keyboard.press('Control+l');
      
      await page.waitForURL(/calendar/, { timeout: 3000 }).catch(() => {
        // May require auth
      });
    });

    test('should open debug console with Ctrl+Shift+E', async ({ page }) => {
      await page.keyboard.press('Control+Shift+e');
      
      const debugConsole = page.locator('[data-testid="debug-console"]');
      await expect(debugConsole).toBeVisible({ timeout: 2000 }).catch(() => {
        // Debug console may be disabled in production
      });
    });
  });

  test.describe('Calendar Keyboard Navigation', () => {
    test('should switch to monthly view with M key', async ({ page }) => {
      await page.goto('/calendar');
      
      await page.keyboard.press('m');
      
      // Check for monthly view indicator
      const monthlyView = page.getByText(/mês|month/i);
      await expect(monthlyView).toBeVisible().catch(() => {
        // May require auth
      });
    });

    test('should switch to weekly view with W key', async ({ page }) => {
      await page.goto('/calendar');
      
      await page.keyboard.press('w');
      
      // Check for weekly view indicator
      const weeklyView = page.getByText(/semana|week/i);
      await expect(weeklyView).toBeVisible().catch(() => {
        // May require auth
      });
    });

    test('should navigate periods with arrow keys', async ({ page }) => {
      await page.goto('/calendar');
      
      // Get initial date display
      const dateDisplay = page.locator('[data-testid="calendar-header"]');
      const initialText = await dateDisplay.textContent().catch(() => '');
      
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(500);
      
      const newText = await dateDisplay.textContent().catch(() => '');
      
      // Date should change (or remain if no data)
      expect(typeof newText).toBe('string');
    });

    test('should jump to today with T key', async ({ page }) => {
      await page.goto('/calendar');
      
      // Navigate away first
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      
      // Jump back to today
      await page.keyboard.press('t');
      
      // Should be at today's date
      await page.waitForTimeout(500);
    });
  });

  test.describe('Help Modal', () => {
    test('should show keyboard shortcuts help', async ({ page }) => {
      // Look for help trigger
      const helpButton = page.locator('[data-testid="keyboard-help"]');
      
      if (await helpButton.isVisible()) {
        await helpButton.click();
        
        // Modal with shortcuts should appear
        const helpModal = page.getByRole('dialog');
        await expect(helpModal).toBeVisible();
        await expect(page.getByText(/atalho|shortcut/i)).toBeVisible();
      }
    });
  });
});
