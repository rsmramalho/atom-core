import { test as base, expect, Page } from '@playwright/test';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

// Environment variables for test configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Test user configuration
interface TestUserConfig {
  email?: string;
  password?: string;
  metadata?: Record<string, unknown>;
}

interface TestUser {
  id: string;
  email: string;
  password: string;
}

interface AuthFixtures {
  testUser: TestUser;
  authenticatedPage: Page;
  supabaseAdmin: SupabaseClient;
  supabaseClient: SupabaseClient;
}

/**
 * Creates a Supabase Admin client with service role key
 * Used for creating/deleting test users
 */
function createAdminClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('Supabase credentials not configured. Skipping admin client creation.');
    return null;
  }
  
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Creates a Supabase client with anon key
 * Used for regular authentication
 */
function createAnonClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Supabase credentials not configured. Skipping anon client creation.');
    return null;
  }
  
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/**
 * Generates a unique test user email
 */
function generateTestEmail(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `e2e-test-${timestamp}-${random}@test.mindmate.app`;
}

/**
 * Creates a test user via Supabase Admin API
 */
async function createTestUser(
  adminClient: SupabaseClient,
  config: TestUserConfig = {}
): Promise<TestUser | null> {
  const email = config.email || generateTestEmail();
  const password = config.password || 'E2ETestPassword123!';

  try {
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: config.metadata || { isTestUser: true },
    });

    if (error) {
      console.error('Failed to create test user:', error.message);
      return null;
    }

    if (!data.user) {
      console.error('No user data returned');
      return null;
    }

    return {
      id: data.user.id,
      email,
      password,
    };
  } catch (err) {
    console.error('Error creating test user:', err);
    return null;
  }
}

/**
 * Deletes a test user via Supabase Admin API
 */
async function deleteTestUser(
  adminClient: SupabaseClient,
  userId: string
): Promise<boolean> {
  try {
    const { error } = await adminClient.auth.admin.deleteUser(userId);
    
    if (error) {
      console.error('Failed to delete test user:', error.message);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error deleting test user:', err);
    return false;
  }
}

/**
 * Logs in a user via the UI
 */
async function loginViaUI(
  page: Page,
  email: string,
  password: string
): Promise<boolean> {
  await page.goto('/');
  
  // Wait for auth form to be visible
  const emailInput = page.getByRole('textbox', { name: /email/i });
  const passwordInput = page.locator('input[type="password"]');
  
  if (!(await emailInput.isVisible({ timeout: 5000 }))) {
    // Already logged in or no auth form
    return true;
  }
  
  await emailInput.fill(email);
  await passwordInput.fill(password);
  
  // Click login button
  const loginButton = page.getByRole('button', { name: /entrar|login|sign in/i });
  await loginButton.click();
  
  // Wait for navigation or dashboard content
  try {
    await page.waitForURL('/', { timeout: 10000 });
    
    // Verify we're logged in by checking auth form is gone
    await expect(emailInput).not.toBeVisible({ timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Logs in a user programmatically by setting session
 */
async function loginProgrammatically(
  page: Page,
  anonClient: SupabaseClient,
  email: string,
  password: string
): Promise<boolean> {
  try {
    // Sign in to get session
    const { data, error } = await anonClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      console.error('Failed to sign in:', error?.message);
      return false;
    }

    // Navigate to app first
    await page.goto('/');

    // Inject session into localStorage
    await page.evaluate(
      ({ accessToken, refreshToken, expiresAt, user }) => {
        const storageKey = 'sb-jsmebwwhlxdhvztgovpq-auth-token';
        const session = {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: expiresAt,
          expires_in: 3600,
          token_type: 'bearer',
          user,
        };
        localStorage.setItem(storageKey, JSON.stringify(session));
      },
      {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at,
        user: data.session.user,
      }
    );

    // Reload to pick up session
    await page.reload();
    await page.waitForLoadState('networkidle');

    return true;
  } catch (err) {
    console.error('Error in programmatic login:', err);
    return false;
  }
}

/**
 * Logs out a user
 */
async function logout(page: Page): Promise<void> {
  await page.evaluate(() => {
    // Clear Supabase auth storage
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('supabase') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  });
  
  await page.reload();
}

/**
 * Extended test with authentication fixtures
 */
export const test = base.extend<AuthFixtures>({
  // Supabase Admin client fixture
  supabaseAdmin: async ({}, use) => {
    const client = createAdminClient();
    if (!client) {
      throw new Error('Supabase Admin client not configured. Set SUPABASE_SERVICE_ROLE_KEY.');
    }
    await use(client);
  },

  // Supabase Anon client fixture
  supabaseClient: async ({}, use) => {
    const client = createAnonClient();
    if (!client) {
      throw new Error('Supabase Anon client not configured.');
    }
    await use(client);
  },

  // Test user fixture - creates user before test, deletes after
  testUser: async ({ supabaseAdmin }, use) => {
    // Create test user
    const user = await createTestUser(supabaseAdmin);
    
    if (!user) {
      throw new Error('Failed to create test user');
    }

    // Provide user to test
    await use(user);

    // Cleanup: delete test user after test
    await deleteTestUser(supabaseAdmin, user.id);
  },

  // Authenticated page fixture - logs in before providing page
  authenticatedPage: async ({ page, testUser, supabaseClient }, use) => {
    // Login programmatically
    const success = await loginProgrammatically(
      page,
      supabaseClient,
      testUser.email,
      testUser.password
    );

    if (!success) {
      // Fallback to UI login
      const uiSuccess = await loginViaUI(page, testUser.email, testUser.password);
      if (!uiSuccess) {
        throw new Error('Failed to authenticate test user');
      }
    }

    // Provide authenticated page to test
    await use(page);

    // Cleanup: logout after test
    await logout(page);
  },
});

export { expect };

// Export helpers for use in other test files
export {
  createAdminClient,
  createAnonClient,
  createTestUser,
  deleteTestUser,
  loginViaUI,
  loginProgrammatically,
  logout,
  generateTestEmail,
};

export type { TestUser, TestUserConfig };
