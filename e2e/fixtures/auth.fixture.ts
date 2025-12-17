import { test as base, expect } from '@playwright/test';

// Extend base test with authentication fixture
export const test = base.extend<{
  authenticatedPage: ReturnType<typeof base.page>;
}>({
  authenticatedPage: async ({ page }, use) => {
    // This fixture would handle authentication setup
    // In a real implementation, you would:
    // 1. Use Supabase service role to create test user
    // 2. Programmatically login
    // 3. Set session tokens
    
    // For now, we just provide the page
    // Real implementation would look like:
    /*
    const testEmail = `e2e-test-${Date.now()}@example.com`;
    const testPassword = 'E2ETestPassword123!';
    
    // Create test user via API
    await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true
    });
    
    // Login via UI or API
    await page.goto('/');
    await page.getByRole('textbox', { name: /email/i }).fill(testEmail);
    await page.getByRole('textbox', { name: /password/i }).fill(testPassword);
    await page.getByRole('button', { name: /login/i }).click();
    
    // Wait for successful login
    await page.waitForURL('/', { timeout: 10000 });
    */
    
    await use(page);
    
    // Cleanup: delete test user after test
    /*
    await supabaseAdmin.auth.admin.deleteUser(userId);
    */
  },
});

export { expect };

// Helper to check if user is authenticated
export async function isAuthenticated(page: ReturnType<typeof base.page>): Promise<boolean> {
  const authForm = page.getByRole('textbox', { name: /email/i });
  return !(await authForm.isVisible());
}

// Helper to perform login
export async function login(
  page: ReturnType<typeof base.page>,
  email: string,
  password: string
): Promise<void> {
  await page.goto('/');
  await page.getByRole('textbox', { name: /email/i }).fill(email);
  await page.getByRole('textbox', { name: /password/i }).fill(password);
  await page.getByRole('button', { name: /entrar|login/i }).click();
  
  // Wait for redirect or error
  await page.waitForTimeout(2000);
}

// Helper to perform logout
export async function logout(page: ReturnType<typeof base.page>): Promise<void> {
  // Open user menu or settings
  const userMenu = page.locator('[data-testid="user-menu"]');
  if (await userMenu.isVisible()) {
    await userMenu.click();
    await page.getByRole('button', { name: /sair|logout/i }).click();
  }
}
