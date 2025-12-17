# MindMate E2E Tests

## Setup

### 1. Install Dependencies

```bash
npm install
npx playwright install
```

### 2. Configure Environment Variables

Create a `.env.test` file with Supabase credentials for authenticated tests:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://jsmebwwhlxdhvztgovpq.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here

# Required for authenticated tests (create test users)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Note:** The service role key is required for creating/deleting test users. Never commit this key to version control.

## Running Tests

### Public Tests (No Authentication)

```bash
# Run all public tests
npx playwright test --project=public

# Run specific test file
npx playwright test e2e/auth.spec.ts
```

### Authenticated Tests

```bash
# Run authenticated tests (requires SUPABASE_SERVICE_ROLE_KEY)
npx playwright test --project=authenticated

# Run with debug mode
npx playwright test --project=authenticated --debug
```

### All Tests

```bash
# Run all tests
npx playwright test

# Run with UI mode (interactive)
npx playwright test --ui

# Run with headed browsers
npx playwright test --headed
```

### Mobile Tests

```bash
npx playwright test --project=mobile
```

### Visual Regression Tests

```bash
# Run all visual tests
npx playwright test --project=visual --project=visual-auth --project=visual-themes

# Update baseline screenshots
npx playwright test --project=visual --update-snapshots

# Run only theme visual tests
npx playwright test --project=visual-themes
```

## Test Structure

```
e2e/
├── __snapshots__/           # Baseline screenshots (auto-generated)
├── fixtures/
│   └── auth.fixture.ts      # Authentication fixtures and helpers
├── authenticated/
│   ├── task-management.auth.spec.ts
│   ├── ritual.auth.spec.ts
│   └── offline-sync.auth.spec.ts
├── visual/
│   ├── public.visual.spec.ts       # Public page screenshots
│   ├── authenticated.visual.spec.ts # Authenticated page screenshots
│   ├── components.visual.spec.ts    # UI component screenshots
│   └── themes.visual.spec.ts        # Dark/light mode screenshots
├── auth.spec.ts             # Public auth flow tests
├── task-management.spec.ts  # Public task tests
├── ritual.spec.ts           # Public ritual tests
├── offline-sync.spec.ts     # Public offline tests
├── keyboard-navigation.spec.ts
└── README.md
```

## Test Fixtures

### `testUser`
Creates a fresh Supabase user before each test and deletes it after.

```typescript
import { test, expect } from '../fixtures/auth.fixture';

test('my authenticated test', async ({ testUser }) => {
  console.log('Test user:', testUser.email);
  // Test user is automatically cleaned up after test
});
```

### `authenticatedPage`
Provides a page that's already logged in with the test user.

```typescript
test('my authenticated test', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/inbox');
  // Page is already authenticated
});
```

## Visual Regression Testing

### How It Works

Visual regression tests capture screenshots of pages and components, then compare them against baseline images. If differences exceed the threshold, the test fails.

### Screenshot Comparison Settings

- **maxDiffPixels**: Maximum allowed pixel differences (default: 100)
- **threshold**: Color difference threshold 0-1 (default: 0.2)

### Updating Baselines

When UI changes are intentional, update baseline screenshots:

```bash
# Update all visual test baselines
npx playwright test --project=visual --update-snapshots

# Update specific test baselines
npx playwright test -g "dashboard" --update-snapshots
```

### Reviewing Failures

When visual tests fail, Playwright generates comparison images:
- `actual.png` - Current screenshot
- `expected.png` - Baseline screenshot
- `diff.png` - Highlighted differences

View these in the HTML report:
```bash
npx playwright show-report
```

### Best Practices

1. **Consistent Viewport**: Visual tests use fixed 1280x720 viewport
2. **Wait for Stability**: Always `waitForLoadState('networkidle')` before screenshots
3. **Isolation**: Each test should be independent
4. **Meaningful Names**: Screenshot names should describe what's captured

## Reports

```bash
# View HTML report
npx playwright show-report

# Generate report
npx playwright test --reporter=html
```

## Debugging

```bash
# Debug mode with inspector
npx playwright test --debug

# Run specific test with trace
npx playwright test -g "should capture new task" --trace on

# View trace
npx playwright show-trace trace.zip
```

## CI/CD

In CI environments, set these environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for authenticated tests)

Example GitHub Actions:

```yaml
- name: Run E2E Tests
  env:
    VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    VITE_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
    SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
  run: npx playwright test

- name: Upload Visual Diff Artifacts
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: visual-diff
    path: e2e/__snapshots__/**/*-diff.png
```
