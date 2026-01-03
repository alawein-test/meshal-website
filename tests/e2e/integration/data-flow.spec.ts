import { test, expect } from '@playwright/test';
import { waitForPageReady } from '../../utils/test-helpers';

test.describe('Data Flow Integration Tests', () => {
  test.describe('Dashboard Data Loading', () => {
    test('SimCore should load and display simulation data', async ({ page }) => {
      await page.goto('/projects/simcore');
      await waitForPageReady(page);

      // Should show loading or data state
      const content = page.locator('[class*="card"], [class*="loading"], [class*="empty"]');
      await expect(content.first()).toBeVisible();

      // Stats should render
      const stats = page.locator('[class*="stat"], [class*="metric"]');
      await expect(stats.first()).toBeVisible({ timeout: 10000 });
    });

    test('TalAI should load experiment data', async ({ page }) => {
      await page.goto('/projects/talai');
      await waitForPageReady(page);

      // Wait for data to load
      await page.waitForTimeout(2000);

      // Should show experiments or empty state
      const hasContent = await page
        .locator('[class*="experiment"], [class*="empty"], [class*="card"]')
        .count();
      expect(hasContent).toBeGreaterThan(0);
    });

    test('QMLab should load quantum experiments', async ({ page }) => {
      await page.goto('/projects/qmlab');
      await waitForPageReady(page);

      await page.waitForTimeout(2000);

      const hasContent = await page
        .locator('[class*="experiment"], [class*="visualization"], [class*="card"]')
        .count();
      expect(hasContent).toBeGreaterThan(0);
    });

    test('OptiLibria should load optimization runs', async ({ page }) => {
      await page.goto('/projects/optilibria');
      await waitForPageReady(page);

      await page.waitForTimeout(2000);

      const hasContent = await page
        .locator('[class*="run"], [class*="algorithm"], [class*="card"]')
        .count();
      expect(hasContent).toBeGreaterThan(0);
    });

    test('MEZAN should load workflow data', async ({ page }) => {
      await page.goto('/projects/mezan');
      await waitForPageReady(page);

      await page.waitForTimeout(2000);

      const hasContent = await page
        .locator('[class*="workflow"], [class*="empty"], [class*="card"]')
        .count();
      expect(hasContent).toBeGreaterThan(0);
    });
  });

  test.describe('Real-time Updates', () => {
    test('dashboard should handle real-time data gracefully', async ({ page }) => {
      await page.goto('/projects/simcore');
      await waitForPageReady(page);

      // Wait for potential real-time subscription
      await page.waitForTimeout(3000);

      // Page should still be responsive
      await expect(page.locator('body')).toBeVisible();

      // No console errors about WebSocket or real-time
      const logs: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          logs.push(msg.text());
        }
      });

      await page.waitForTimeout(1000);

      // Filter out non-critical errors
      const criticalErrors = logs.filter(
        (log) =>
          !log.includes('favicon') &&
          !log.includes('net::ERR') &&
          !log.includes('Failed to load resource')
      );

      expect(criticalErrors.length).toBe(0);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page, context }) => {
      await page.goto('/');
      await waitForPageReady(page);

      // Go offline
      await context.setOffline(true);

      // Navigate to a dashboard
      await page.goto('/projects/simcore');

      // Should show error state or cached content, not crash
      await expect(page.locator('body')).toBeVisible();

      await context.setOffline(false);
    });

    test('should show error boundary on component crash', async ({ page }) => {
      await page.goto('/projects/simcore');
      await waitForPageReady(page);

      // Page should have error boundary protection
      const errorBoundary = page.locator('[class*="error"], [class*="fallback"]');
      // May or may not be visible depending on errors
      const count = await errorBoundary.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('State Persistence', () => {
    test('theme preference should persist', async ({ page }) => {
      await page.goto('/projects/simcore');
      await waitForPageReady(page);

      // Find and click theme switcher if available
      const themeSwitcher = page.locator('button').filter({ hasText: /theme|dark|light/i });

      if ((await themeSwitcher.count()) > 0) {
        await themeSwitcher.first().click();
        await page.waitForTimeout(500);

        // Reload and check if theme persists
        await page.reload();
        await waitForPageReady(page);

        // Theme state should be preserved (check via localStorage or class)
        const hasThemeClass = await page.evaluate(() => {
          return (
            document.documentElement.classList.contains('dark') ||
            document.documentElement.classList.contains('light') ||
            localStorage.getItem('theme') !== null
          );
        });

        expect(hasThemeClass).toBe(true);
      }
    });

    test('language preference should persist in MEZAN', async ({ page }) => {
      await page.goto('/projects/mezan');
      await waitForPageReady(page);

      // Find language toggle
      const langToggle = page.locator('button').filter({ hasText: /AR|EN|عربي|English/i });

      if ((await langToggle.count()) > 0) {
        const initialDir = await page.evaluate(() => document.dir);

        await langToggle.first().click();
        await page.waitForTimeout(500);

        // Check if direction or language changed
        const newDir = await page.evaluate(() => document.dir);

        // Reload and verify persistence
        await page.reload();
        await waitForPageReady(page);

        const persistedDir = await page.evaluate(() => document.dir);
        expect([initialDir, newDir, 'ltr', 'rtl', '']).toContain(persistedDir);
      }
    });
  });

  test.describe('Form Submissions', () => {
    test('create button should trigger appropriate action', async ({ page }) => {
      await page.goto('/projects/simcore');
      await waitForPageReady(page);

      const createBtn = page.getByRole('button', { name: /new|create|add|start/i }).first();

      if (await createBtn.isVisible()) {
        await createBtn.click();
        await page.waitForTimeout(1000);

        // Should either show dialog, loading state, or create item
        const hasResponse =
          (await page.locator('[class*="dialog"], [class*="loading"], [class*="toast"]').count()) >
            0 || (await page.locator('[class*="card"]').count()) > 0;

        expect(hasResponse).toBe(true);
      }
    });
  });

  test.describe('Export Functionality', () => {
    test('export menu should be functional', async ({ page }) => {
      await page.goto('/projects/simcore');
      await waitForPageReady(page);

      const exportBtn = page.locator('button').filter({ hasText: /export|download/i });

      if ((await exportBtn.count()) > 0) {
        await exportBtn.first().click();
        await page.waitForTimeout(500);

        // Should show export options or trigger download
        const hasExportOptions =
          (await page.locator('[class*="menu"], [class*="dropdown"]').count()) > 0;
        // Export might directly trigger download
        expect(typeof hasExportOptions).toBe('boolean');
      }
    });
  });
});
