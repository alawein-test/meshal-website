import { test, expect } from '@playwright/test';
import { waitForPageReady } from '../../utils/test-helpers';

test.describe('Navigation', () => {
  test.describe('Main Navigation', () => {
    test('should navigate to landing page', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      await expect(page).toHaveURL('/');
      await expect(page.locator('h1')).toBeVisible();
    });

    test('should navigate to portfolio', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      await page
        .getByRole('link', { name: /portfolio/i })
        .first()
        .click();
      await expect(page).toHaveURL('/portfolio');
    });

    test('should navigate to studios', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      await page
        .getByRole('link', { name: /studios/i })
        .first()
        .click();
      await expect(page).toHaveURL('/studios');
    });

    test('should navigate to resume', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      // Find resume link in navigation
      const resumeLink = page.getByRole('link', { name: /resume/i }).first();
      if (await resumeLink.isVisible()) {
        await resumeLink.click();
        await expect(page).toHaveURL(/resume/);
      }
    });
  });

  test.describe('Project Navigation', () => {
    const projects = ['simcore', 'talai', 'qmlab', 'optilibria', 'mezan'];

    for (const project of projects) {
      test(`should navigate to ${project} project`, async ({ page }) => {
        await page.goto(`/projects/${project}`);
        await waitForPageReady(page);

        await expect(page).toHaveURL(`/projects/${project}`);
        await expect(page.locator('h1, h2, [class*="title"]').first()).toBeVisible();
      });
    }

    test('should navigate to projects hub', async ({ page }) => {
      await page.goto('/projects');
      await waitForPageReady(page);

      await expect(page).toHaveURL('/projects');
    });
  });

  test.describe('Breadcrumb Navigation', () => {
    test('should show breadcrumbs on project pages', async ({ page }) => {
      await page.goto('/projects/simcore');
      await waitForPageReady(page);

      // Check for breadcrumb or back navigation
      const breadcrumb = page.locator('[aria-label*="breadcrumb"], nav a');
      await expect(breadcrumb.first()).toBeVisible();
    });
  });

  test.describe('404 Page', () => {
    test('should show 404 for invalid routes', async ({ page }) => {
      await page.goto('/this-route-does-not-exist');
      await waitForPageReady(page);

      await expect(page.getByText(/404|not found|page doesn't exist/i)).toBeVisible();
    });

    test('should have link back to home', async ({ page }) => {
      await page.goto('/invalid-route-test');
      await waitForPageReady(page);

      const homeLink = page.getByRole('link', { name: /home|back|return/i });
      await expect(homeLink.first()).toBeVisible();
    });
  });

  test.describe('Mobile Navigation', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('should have mobile menu button', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      // Look for hamburger menu or mobile nav toggle
      const mobileMenuBtn = page.locator(
        'button[aria-label*="menu"], button[class*="menu"], [class*="hamburger"]'
      );
      if ((await mobileMenuBtn.count()) > 0) {
        await expect(mobileMenuBtn.first()).toBeVisible();
      }
    });

    test('should be scrollable on mobile', async ({ page }) => {
      await page.goto('/portfolio');
      await waitForPageReady(page);

      // Should be able to scroll
      const initialScrollY = await page.evaluate(() => window.scrollY);
      await page.evaluate(() => window.scrollTo(0, 500));
      const newScrollY = await page.evaluate(() => window.scrollY);

      expect(newScrollY).toBeGreaterThan(initialScrollY);
    });
  });
});
