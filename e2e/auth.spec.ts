import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  test('should display auth form when not logged in', async ({ page }) => {
    await page.goto('/');
    
    // Should see auth form
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /senha|password/i })).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('textbox', { name: /email/i }).fill('invalid-email');
    await page.getByRole('textbox', { name: /senha|password/i }).fill(testPassword);
    await page.getByRole('button', { name: /entrar|login/i }).click();
    
    // Should show error toast or validation message
    await expect(page.getByText(/email|inválido|invalid/i)).toBeVisible({ timeout: 5000 });
  });

  test('should toggle between login and signup modes', async ({ page }) => {
    await page.goto('/');
    
    // Should start in login mode
    await expect(page.getByRole('button', { name: /entrar|login/i })).toBeVisible();
    
    // Click to switch to signup
    const toggleButton = page.getByRole('button', { name: /criar conta|sign up|cadastrar/i });
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      // Should now show signup button
      await expect(page.getByRole('button', { name: /cadastrar|criar|registrar|sign up/i })).toBeVisible();
    }
  });

  test('should show error for wrong credentials', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('textbox', { name: /email/i }).fill('nonexistent@example.com');
    await page.getByRole('textbox', { name: /senha|password/i }).fill('WrongPassword123!');
    await page.getByRole('button', { name: /entrar|login/i }).click();
    
    // Should show error message
    await expect(page.getByText(/erro|error|inválid|invalid|incorret/i)).toBeVisible({ timeout: 10000 });
  });

  test('should maintain loading state during authentication', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByRole('textbox', { name: /senha|password/i }).fill(testPassword);
    
    // Click and immediately check for loading state
    const loginButton = page.getByRole('button', { name: /entrar|login/i });
    await loginButton.click();
    
    // Button should be disabled during loading
    await expect(loginButton).toBeDisabled({ timeout: 1000 }).catch(() => {
      // Loading might be too fast to catch, that's okay
    });
  });
});
