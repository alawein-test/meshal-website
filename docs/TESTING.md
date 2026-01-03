# Testing Guide

> Last verified: 2025-12-09

This guide covers all testing frameworks, patterns, and practices used in the
Alawein Platform.

---

## Overview

The platform uses a dual testing strategy:

| Framework      | Purpose                | Config File            | Test Location      |
| -------------- | ---------------------- | ---------------------- | ------------------ |
| **Playwright** | End-to-end testing     | `playwright.config.ts` | `tests/e2e/`       |
| **Vitest**     | Unit/component testing | `vitest.config.ts`     | `src/**/*.test.ts` |

---

## Quick Start

```bash
# Run all unit tests
npm run test

# Run unit tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npx playwright test --ui

# Run specific test file
npm run test -- src/hooks/__tests__/useAuth.test.ts
npx playwright test tests/e2e/auth/auth.spec.ts
```

---

## Playwright E2E Testing

### Test Suites

| Suite             | Path                       | Description                          |
| ----------------- | -------------------------- | ------------------------------------ |
| **Accessibility** | `tests/e2e/accessibility/` | WCAG compliance, keyboard navigation |
| **Auth**          | `tests/e2e/auth/`          | Login, signup, session management    |
| **Dashboard**     | `tests/e2e/dashboard/`     | CRUD operations, data display        |
| **Icons**         | `tests/e2e/icons/`         | Icon component rendering             |
| **Integration**   | `tests/e2e/integration/`   | Cross-feature data flow              |
| **Navigation**    | `tests/e2e/navigation/`    | Route transitions, deep linking      |
| **Performance**   | `tests/e2e/performance/`   | Load times, Core Web Vitals          |
| **PWA**           | `tests/e2e/pwa/`           | Service worker, offline mode         |
| **SEO**           | `tests/e2e/seo/`           | Meta tags, structured data           |
| **Visual**        | `tests/e2e/visual/`        | Visual regression, brand consistency |

### Configuration

```typescript
// playwright.config.ts highlights
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  timeout: 60 * 1000,

  use: {
    baseURL: 'http://localhost:8081',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
});
```

### Writing E2E Tests

```typescript
// tests/e2e/example.spec.ts
import { test, expect } from '@playwright/test';
import { waitForPageReady } from '../utils/test-helpers';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/route');
    await waitForPageReady(page);

    await expect(page.getByRole('heading', { name: /title/i })).toBeVisible();
    await page.getByRole('button', { name: /action/i }).click();
    await expect(page.getByText(/success/i)).toBeVisible();
  });
});
```

### Test Helpers

```typescript
// tests/utils/test-helpers.ts
import { Page } from '@playwright/test';

export async function waitForPageReady(page: Page) {
  await page.waitForLoadState('networkidle');
}

export async function login(page: Page, email: string, password: string) {
  await page.goto('/auth');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();
}
```

### Fixtures & Setup

```typescript
// tests/fixtures/global-setup.ts
// - Creates auth fixtures directory
// - Pre-warms browser
// - Validates dev server is running

// tests/fixtures/global-teardown.ts
// - Cleanup temporary files
// - Close browser instances
```

### Running Specific Browsers

```bash
# Run on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run mobile tests
npx playwright test --project="Mobile Chrome"
```

---

## Vitest Unit Testing

### Configuration

```typescript
// vitest.config.ts highlights
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['**/*.test.{ts,tsx}'],

    coverage: {
      provider: 'v8',
      thresholds: {
        global: { branches: 85, functions: 85, lines: 85, statements: 85 },
      },
    },
  },
});
```

### Test Locations

```
src/hooks/__tests__/
├── useAuth.test.ts
├── useLocalStorage.test.ts
├── useMediaQuery.test.ts
└── useSimulations.test.ts
```

### Writing Unit Tests

```typescript
// src/hooks/__tests__/useAuth.test.ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';

describe('useAuth', () => {
  it('should return initial auth state', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle login', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

### Mocking

```typescript
// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
    })),
  },
}));
```

---

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run tests
        run: npm run test:e2e

      - name: Upload report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### Test Reports

| Format | Location                    | Purpose                    |
| ------ | --------------------------- | -------------------------- |
| HTML   | `playwright-report/`        | Interactive browser report |
| JSON   | `test-results/results.json` | CI parsing                 |
| JUnit  | `test-results/results.xml`  | CI integration             |

---

## Debugging Failed Tests

### Playwright Debug Mode

```bash
# Run with debug mode
PWDEBUG=1 npx playwright test

# Run with headed browser
npx playwright test --headed

# Show trace viewer
npx playwright show-trace trace.zip
```

### View Test Artifacts

```bash
# Open HTML report
npx playwright show-report

# Screenshots saved to: test-results/
# Videos saved to: test-results/
# Traces saved to: test-results/
```

### Vitest Debug

```bash
# Run in watch mode
npm run test -- --watch

# Run with verbose output
npm run test -- --reporter=verbose

# Debug specific test
npm run test -- --testNamePattern="should handle login"
```

---

## Coverage Requirements

### Thresholds

```typescript
// vitest.config.ts
coverage: {
  thresholds: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
}
```

### Generate Coverage Report

```bash
# Run tests with coverage
npm run test:coverage

# Coverage report at: coverage/index.html
```

---

## Best Practices

### Do

- ✅ Use semantic selectors (`getByRole`, `getByLabel`, `getByText`)
- ✅ Wait for network idle before assertions
- ✅ Test user-visible behavior, not implementation
- ✅ Keep tests independent and isolated
- ✅ Use descriptive test names
- ✅ Mock external services in unit tests

### Don't

- ❌ Use fragile CSS selectors
- ❌ Hardcode timeouts without reason
- ❌ Share state between tests
- ❌ Test third-party library internals
- ❌ Skip tests without documenting why

---

## Common Patterns

### Testing Protected Routes

```typescript
test('should redirect to auth if not logged in', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/auth/);
});
```

### Testing Form Validation

```typescript
test('should show validation errors', async ({ page }) => {
  await page.goto('/auth');
  await page.getByRole('button', { name: /submit/i }).click();
  await expect(page.getByText(/required/i)).toBeVisible();
});
```

### Testing API Integration

```typescript
test('should display data from API', async ({ page }) => {
  await page.goto('/dashboard');
  await page.waitForResponse('**/functions/v1/**');
  await expect(page.getByRole('table')).toBeVisible();
});
```

---

## Troubleshooting

### "Element not found"

```typescript
// Wait for element to be visible
await expect(page.getByRole('button')).toBeVisible({ timeout: 10000 });

// Or wait for network
await page.waitForLoadState('networkidle');
```

### "Timeout exceeded"

```typescript
// Increase timeout for slow operations
test('slow test', async ({ page }) => {
  test.setTimeout(120000);
  // ...
});
```

### "Flaky test"

```typescript
// Add retry for flaky tests
test.describe.configure({ retries: 2 });

// Or use soft assertions
await expect.soft(page.getByText('maybe')).toBeVisible();
```

---

## Related Documentation

- [Architecture](./ARCHITECTURE.md) - System design
- [Development](./DEVELOPMENT.md) - Local setup
- CI/CD Workflows - Automation
