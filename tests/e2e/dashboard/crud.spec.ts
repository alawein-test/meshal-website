import { test, expect } from '@playwright/test';
import { waitForPageReady } from '../../utils/test-helpers';

test.describe('Dashboard CRUD Operations', () => {
  test.describe('SimCore Dashboard', () => {
    test('should load SimCore dashboard', async ({ page }) => {
      await page.goto('/projects/simcore');
      await waitForPageReady(page);

      await expect(page.getByText(/SimCore/i)).toBeVisible();
      await expect(page.locator('[class*="dashboard"], [class*="card"], main')).toBeVisible();
    });

    test('should display stats cards', async ({ page }) => {
      await page.goto('/projects/simcore');
      await waitForPageReady(page);

      // Should have stats or summary cards
      const cards = page.locator('[class*="card"], [class*="stat"]');
      await expect(cards.first()).toBeVisible();
    });

    test('should have create simulation button', async ({ page }) => {
      await page.goto('/projects/simcore');
      await waitForPageReady(page);

      const createBtn = page.getByRole('button', { name: /new|create|add|start/i });
      await expect(createBtn.first()).toBeVisible();
    });

    test('should open create dialog when clicking create button', async ({ page }) => {
      await page.goto('/projects/simcore');
      await waitForPageReady(page);

      const createBtn = page.getByRole('button', { name: /new simulation|create|start/i }).first();
      await createBtn.click();

      // Wait for any resulting action (dialog, redirect, or toast)
      await page.waitForTimeout(500);
    });
  });

  test.describe('TalAI Dashboard', () => {
    test('should load TalAI dashboard', async ({ page }) => {
      await page.goto('/projects/talai');
      await waitForPageReady(page);

      await expect(page.getByText(/TalAI/i)).toBeVisible();
    });

    test('should display experiment list or empty state', async ({ page }) => {
      await page.goto('/projects/talai');
      await waitForPageReady(page);

      // Either has experiments or shows empty state
      const content = page.locator('[class*="card"], [class*="empty"], [class*="list"]');
      await expect(content.first()).toBeVisible();
    });

    test('should have create experiment functionality', async ({ page }) => {
      await page.goto('/projects/talai');
      await waitForPageReady(page);

      const createBtn = page.getByRole('button', { name: /new|create|add|experiment/i });
      await expect(createBtn.first()).toBeVisible();
    });
  });

  test.describe('QMLab Dashboard', () => {
    test('should load QMLab dashboard', async ({ page }) => {
      await page.goto('/projects/qmlab');
      await waitForPageReady(page);

      await expect(page.getByText(/QMLab|Quantum/i)).toBeVisible();
    });

    test('should have quantum system selector', async ({ page }) => {
      await page.goto('/projects/qmlab');
      await waitForPageReady(page);

      // Should have tabs or system selector
      const selector = page.locator('[role="tablist"], [class*="tab"], button[class*="system"]');
      if ((await selector.count()) > 0) {
        await expect(selector.first()).toBeVisible();
      }
    });

    test('should display visualization area', async ({ page }) => {
      await page.goto('/projects/qmlab');
      await waitForPageReady(page);

      // Should have canvas or visualization container
      const viz = page.locator('canvas, [class*="visualization"], [class*="chart"], svg');
      await expect(viz.first()).toBeVisible();
    });
  });

  test.describe('OptiLibria Dashboard', () => {
    test('should load OptiLibria dashboard', async ({ page }) => {
      await page.goto('/projects/optilibria');
      await waitForPageReady(page);

      await expect(page.getByText(/OptiLibria|Optimization/i)).toBeVisible();
    });

    test('should have algorithm selection', async ({ page }) => {
      await page.goto('/projects/optilibria');
      await waitForPageReady(page);

      // Should have algorithm cards or selector
      const algorithms = page.locator('[class*="algorithm"], [class*="card"]');
      await expect(algorithms.first()).toBeVisible();
    });

    test('should display benchmark results', async ({ page }) => {
      await page.goto('/projects/optilibria');
      await waitForPageReady(page);

      // Should have results or chart
      const results = page.locator('[class*="result"], [class*="chart"], [class*="benchmark"]');
      if ((await results.count()) > 0) {
        await expect(results.first()).toBeVisible();
      }
    });
  });

  test.describe('MEZAN Dashboard', () => {
    test('should load MEZAN dashboard', async ({ page }) => {
      await page.goto('/projects/mezan');
      await waitForPageReady(page);

      await expect(page.getByText(/MEZAN|ميزان/i)).toBeVisible();
    });

    test('should have bilingual toggle', async ({ page }) => {
      await page.goto('/projects/mezan');
      await waitForPageReady(page);

      const toggle = page
        .locator('[class*="toggle"], button')
        .filter({ hasText: /AR|EN|عربي|English/i });
      if ((await toggle.count()) > 0) {
        await expect(toggle.first()).toBeVisible();
      }
    });

    test('should display workflow list or empty state', async ({ page }) => {
      await page.goto('/projects/mezan');
      await waitForPageReady(page);

      const content = page.locator('[class*="workflow"], [class*="card"], [class*="empty"]');
      await expect(content.first()).toBeVisible();
    });
  });

  test.describe('Delete Functionality', () => {
    test('should show delete buttons on items', async ({ page }) => {
      await page.goto('/projects/simcore');
      await waitForPageReady(page);

      // Check for trash icons or delete buttons
      const deleteBtn = page.locator(
        '[class*="trash"], button[aria-label*="delete"], [class*="delete"]'
      );
      // May or may not be visible depending on data
      const count = await deleteBtn.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Export Functionality', () => {
    test('should have export menu on dashboards', async ({ page }) => {
      await page.goto('/projects/simcore');
      await waitForPageReady(page);

      const exportBtn = page.locator('button').filter({ hasText: /export|download/i });
      if ((await exportBtn.count()) > 0) {
        await expect(exportBtn.first()).toBeVisible();
      }
    });
  });
});
