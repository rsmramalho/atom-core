import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables for test configuration
dotenv.config();

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['list'],
  ],
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    // Public tests (no auth required)
    {
      name: 'public',
      testMatch: /^(?!.*\.auth\.spec\.ts).*\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    // Authenticated tests
    {
      name: 'authenticated',
      testMatch: /\.auth\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    // Mobile tests
    {
      name: 'mobile',
      testMatch: /^(?!.*\.auth\.spec\.ts).*\.spec\.ts$/,
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
