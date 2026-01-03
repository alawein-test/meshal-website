import { test, expect } from '@playwright/test';
import { waitForPageReady } from '../../utils/test-helpers';

test.describe('Visual Regression Tests', () => {
  test.describe('Landing Page', () => {
    test('landing page visual snapshot', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      // Wait for animations to settle
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('landing-page.png', {
        maxDiffPixels: 500,
        threshold: 0.2,
      });
    });

    test('landing page mobile visual snapshot', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await waitForPageReady(page);
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('landing-page-mobile.png', {
        maxDiffPixels: 500,
        threshold: 0.2,
      });
    });
  });

  test.describe('Portfolio Page', () => {
    test('portfolio page visual snapshot', async ({ page }) => {
      await page.goto('/portfolio');
      await waitForPageReady(page);
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('portfolio-page.png', {
        maxDiffPixels: 500,
        threshold: 0.2,
      });
    });

    test('portfolio hero section snapshot', async ({ page }) => {
      await page.goto('/portfolio');
      await waitForPageReady(page);
      await page.waitForTimeout(1000);

      const heroSection = page.locator('section').first();
      await expect(heroSection).toHaveScreenshot('portfolio-hero.png', {
        maxDiffPixels: 300,
        threshold: 0.2,
      });
    });
  });

  test.describe('Dashboard Pages', () => {
    test('SimCore dashboard visual snapshot', async ({ page }) => {
      await page.goto('/projects/simcore');
      await waitForPageReady(page);
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('simcore-dashboard.png', {
        maxDiffPixels: 500,
        threshold: 0.2,
      });
    });

    test('TalAI dashboard visual snapshot', async ({ page }) => {
      await page.goto('/projects/talai');
      await waitForPageReady(page);
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('talai-dashboard.png', {
        maxDiffPixels: 500,
        threshold: 0.2,
      });
    });

    test('QMLab dashboard visual snapshot', async ({ page }) => {
      await page.goto('/projects/qmlab');
      await waitForPageReady(page);
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('qmlab-dashboard.png', {
        maxDiffPixels: 500,
        threshold: 0.2,
      });
    });

    test('OptiLibria dashboard visual snapshot', async ({ page }) => {
      await page.goto('/projects/optilibria');
      await waitForPageReady(page);
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('optilibria-dashboard.png', {
        maxDiffPixels: 500,
        threshold: 0.2,
      });
    });

    test('MEZAN dashboard visual snapshot', async ({ page }) => {
      await page.goto('/projects/mezan');
      await waitForPageReady(page);
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('mezan-dashboard.png', {
        maxDiffPixels: 500,
        threshold: 0.2,
      });
    });
  });

  test.describe('Dark Mode', () => {
    test('landing page dark mode snapshot', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('/');
      await waitForPageReady(page);
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('landing-dark-mode.png', {
        maxDiffPixels: 500,
        threshold: 0.2,
      });
    });
  });

  test.describe('Component Snapshots', () => {
    test('button variants snapshot', async ({ page }) => {
      await page.goto('/docs/components');
      await waitForPageReady(page);
      await page.waitForTimeout(1000);

      const buttonSection = page.locator('[class*="button"]').first();
      if (await buttonSection.isVisible()) {
        await expect(buttonSection).toHaveScreenshot('button-variants.png', {
          maxDiffPixels: 200,
          threshold: 0.2,
        });
      }
    });

    test('card components snapshot', async ({ page }) => {
      await page.goto('/docs/components');
      await waitForPageReady(page);
      await page.waitForTimeout(1000);

      const cardSection = page.locator('[class*="card"]').first();
      if (await cardSection.isVisible()) {
        await expect(cardSection).toHaveScreenshot('card-component.png', {
          maxDiffPixels: 200,
          threshold: 0.2,
        });
      }
    });
  });

  test.describe('Auth Page', () => {
    test('auth page visual snapshot', async ({ page }) => {
      await page.goto('/auth');
      await waitForPageReady(page);
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('auth-page.png', {
        maxDiffPixels: 500,
        threshold: 0.2,
      });
    });
  });

  test.describe('Responsive Breakpoints', () => {
    const breakpoints = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1280, height: 800 },
      { name: 'large-desktop', width: 1920, height: 1080 },
    ];

    for (const bp of breakpoints) {
      test(`landing page at ${bp.name} breakpoint`, async ({ page }) => {
        await page.setViewportSize({ width: bp.width, height: bp.height });
        await page.goto('/');
        await waitForPageReady(page);
        await page.waitForTimeout(1000);

        await expect(page).toHaveScreenshot(`landing-${bp.name}.png`, {
          maxDiffPixels: 500,
          threshold: 0.2,
        });
      });
    }
  });
});
