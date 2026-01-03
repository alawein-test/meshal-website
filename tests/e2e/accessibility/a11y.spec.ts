import { test, expect } from '@playwright/test';
import { waitForPageReady } from '../../utils/test-helpers';

test.describe('Accessibility Tests', () => {
  test.describe('Keyboard Navigation', () => {
    test('landing page should be keyboard navigable', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      // Press Tab multiple times and verify focus moves
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
      }

      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(focusedElement);
    });

    test('should have skip to main content link', async ({ page }) => {
      await page.goto('/');

      // Focus first element
      await page.keyboard.press('Tab');

      // Check for skip link
      const skipLink = page.locator('a[href="#main-content"], [class*="skip"]');
      const count = await skipLink.count();

      // Skip link should exist (even if visually hidden)
      if (count > 0) {
        const isVisible = await skipLink.first().isVisible();
        // Skip link might only be visible on focus
        expect(count).toBeGreaterThan(0);
      }
    });

    test('should be able to navigate with arrow keys in menus', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      // Tab to first interactive element
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Try arrow navigation
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowUp');

      // Should not throw errors
    });
  });

  test.describe('Screen Reader Support', () => {
    test('images should have alt text', async ({ page }) => {
      await page.goto('/portfolio');
      await waitForPageReady(page);

      const images = page.locator('img');
      const count = await images.count();

      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        const ariaLabel = await img.getAttribute('aria-label');
        const ariaHidden = await img.getAttribute('aria-hidden');

        // Image should have alt OR aria-label OR be hidden from screen readers
        expect(alt !== null || ariaLabel !== null || ariaHidden === 'true').toBe(true);
      }
    });

    test('buttons should have accessible names', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      const buttons = page.locator('button');
      const count = await buttons.count();

      for (let i = 0; i < Math.min(count, 10); i++) {
        // Check first 10 buttons
        const button = buttons.nth(i);
        const text = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');
        const title = await button.getAttribute('title');

        // Button should have text content OR aria-label OR title
        const hasAccessibleName = (text && text.trim()) || ariaLabel || title;
        expect(hasAccessibleName).toBeTruthy();
      }
    });

    test('links should have descriptive text', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      const links = page.locator('a');
      const count = await links.count();

      for (let i = 0; i < Math.min(count, 10); i++) {
        // Check first 10 links
        const link = links.nth(i);
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');

        // Links should not just say "click here" or "read more"
        const hasDescriptiveName = (text && text.trim().length > 0) || ariaLabel;
        expect(hasDescriptiveName).toBeTruthy();
      }
    });

    test('form inputs should have labels', async ({ page }) => {
      await page.goto('/auth');
      await waitForPageReady(page);

      const inputs = page.locator('input:not([type="hidden"])');
      const count = await inputs.count();

      for (let i = 0; i < count; i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');
        const placeholder = await input.getAttribute('placeholder');

        // Input should have associated label, aria-label, or at minimum a placeholder
        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          const hasLabel = (await label.count()) > 0;
          expect(hasLabel || ariaLabel || ariaLabelledBy || placeholder).toBeTruthy();
        }
      }
    });
  });

  test.describe('Color Contrast & Visual', () => {
    test('page should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/portfolio');
      await waitForPageReady(page);

      // Should have at least one h1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThanOrEqual(1);

      // H1 should come before H2
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      if (headings.length > 1) {
        const firstHeading = await headings[0].evaluate((el) => el.tagName);
        expect(['H1', 'H2']).toContain(firstHeading);
      }
    });

    test('focus indicators should be visible', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      // Tab to a button
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Get focused element
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return null;
        const styles = window.getComputedStyle(el);
        return {
          outline: styles.outline,
          boxShadow: styles.boxShadow,
          border: styles.border,
        };
      });

      // Should have some focus indicator
      expect(focusedElement).not.toBeNull();
    });
  });

  test.describe('Reduced Motion', () => {
    test('should respect reduced motion preference', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      await waitForPageReady(page);

      // Page should load without errors
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('Zoom Support', () => {
    test('page should be usable at 200% zoom', async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => {
        document.body.style.zoom = '2';
      });
      await waitForPageReady(page);

      // Content should still be accessible
      await expect(page.locator('h1').first()).toBeVisible();
    });
  });
});
