import { test as base, expect, Page } from '@playwright/test';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for test configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://jsmebwwhlxdhvztgovpq.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzbWVid3dobHhkaHZ6dGdvdnBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NjQ0NDMsImV4cCI6MjA4MTM0MDQ0M30.UpmKC_agNGXfufsG9cdJ2RyMwDyZd9PrlxRgxDiVN2s';

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
  supabaseClient: SupabaseClient;
}

/**
 * Creates a Supabase client with anon key
 * Used for regular authentication (signup/login)
 */
function createAnonClient(): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
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
 * Creates a test user via normal signup
 * Requires auto-confirm to be enabled in Supabase Auth settings
 */
async function createTestUser(
  anonClient: SupabaseClient,
  config: TestUserConfig = {}
): Promise<TestUser | null> {
  const email = config.email || generateTestEmail();
  const password = config.password || 'E2ETestPassword123!';

  try {
    const { data, error } = await anonClient.auth.signUp({
      email,
      password,
      options: {
        data: config.metadata || { isTestUser: true },
      },
    });

    if (error) {
      // If user already exists, try to sign in
      if (error.message.includes('already registered')) {
        const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError || !signInData.user) {
          console.error('Failed to sign in existing user:', signInError?.message);
          return null;
        }
        
        return {
          id: signInData.user.id,
          email,
          password,
        };
      }
      
      console.error('Failed to create test user:', error.message);
      return null;
    }

    if (!data.user) {
      console.error('No user data returned from signup');
      return null;
    }

    // Sign out after creating so we can sign in fresh
    await anonClient.auth.signOut();

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
 * No longer requires SUPABASE_SERVICE_ROLE_KEY - uses normal signup/login
 */
export const test = base.extend<AuthFixtures>({
  // Supabase Anon client fixture
  supabaseClient: async ({}, use) => {
    const client = createAnonClient();
    await use(client);
  },

  // Test user fixture - creates user via signup (auto-confirm enabled)
  testUser: async ({ supabaseClient }, use) => {
    // Create test user via normal signup
    const user = await createTestUser(supabaseClient);
    
    if (!user) {
      throw new Error('Failed to create test user. Ensure auto-confirm is enabled in Supabase Auth settings.');
    }

    // Provide user to test
    await use(user);

    // Note: We don't delete test users since we can't without service_role_key
    // Test users use unique emails so they won't conflict
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
  createAnonClient,
  createTestUser,
  loginViaUI,
  loginProgrammatically,
  logout,
  generateTestEmail,
};

export type { TestUser, TestUserConfig };
