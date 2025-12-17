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
  
  // Visual regression settings
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
    },
  },
  
  // Snapshot settings
  snapshotDir: './e2e/__snapshots__',
  snapshotPathTemplate: '{snapshotDir}/{testFilePath}/{arg}{ext}',
  
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
      testMatch: /^(?!.*\.(auth|visual)\.spec\.ts).*\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    // Authenticated tests
    {
      name: 'authenticated',
      testMatch: /\.auth\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    // Visual regression tests (public)
    {
      name: 'visual',
      testMatch: /visual\/public\.visual\.spec\.ts$/,
      use: { 
        ...devices['Desktop Chrome'],
        // Consistent viewport for visual tests
        viewport: { width: 1280, height: 720 },
      },
    },
    // Visual regression tests (authenticated)
    {
      name: 'visual-auth',
      testMatch: /visual\/(authenticated|components)\.visual\.spec\.ts$/,
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
    // Theme visual tests
    {
      name: 'visual-themes',
      testMatch: /visual\/themes\.visual\.spec\.ts$/,
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
    // Mobile tests
    {
      name: 'mobile',
      testMatch: /^(?!.*\.(auth|visual)\.spec\.ts).*\.spec\.ts$/,
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
