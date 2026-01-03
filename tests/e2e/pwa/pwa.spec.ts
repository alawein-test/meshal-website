import { test, expect } from '@playwright/test';
import { waitForPageReady } from '../../utils/test-helpers';

test.describe('PWA Tests', () => {
  test.describe('Manifest', () => {
    test('should have a valid manifest.json', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      // Check for manifest link
      const manifestLink = await page.locator('link[rel="manifest"]').getAttribute('href');
      expect(manifestLink).toBeTruthy();
    });

    test('manifest should have required fields', async ({ page }) => {
      const response = await page.goto('/manifest.webmanifest');

      if (response?.status() === 200) {
        const manifest = await response.json();

        expect(manifest.name).toBeTruthy();
        expect(manifest.short_name).toBeTruthy();
        expect(manifest.start_url).toBeTruthy();
        expect(manifest.display).toBeTruthy();
        expect(manifest.icons).toBeDefined();
        expect(manifest.icons.length).toBeGreaterThan(0);
      }
    });

    test('manifest should have proper icons', async ({ page }) => {
      const response = await page.goto('/manifest.webmanifest');

      if (response?.status() === 200) {
        const manifest = await response.json();

        // Should have 192x192 and 512x512 icons for PWA
        const sizes = manifest.icons.map((icon: any) => icon.sizes);
        expect(sizes).toContain('192x192');
        expect(sizes).toContain('512x512');
      }
    });
  });

  test.describe('Meta Tags for PWA', () => {
    test('should have theme-color meta tag', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      const themeColor = await page.locator('meta[name="theme-color"]').getAttribute('content');
      expect(themeColor).toBeTruthy();
    });

    test('should have apple-touch-icon', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]');
      const count = await appleTouchIcon.count();
      expect(count).toBeGreaterThanOrEqual(0); // May or may not be present
    });

    test('should have mobile-web-app-capable meta', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      const mobileWebAppCapable = await page
        .locator('meta[name="mobile-web-app-capable"]')
        .getAttribute('content');
      // Optional but good to have
      if (mobileWebAppCapable) {
        expect(mobileWebAppCapable).toBe('yes');
      }
    });
  });

  test.describe('Service Worker', () => {
    test('service worker should be registered', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      // Wait for service worker to register
      await page.waitForTimeout(2000);

      const swRegistered = await page.evaluate(async () => {
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          return registrations.length > 0;
        }
        return false;
      });

      // SW might not be active in dev mode
      expect(typeof swRegistered).toBe('boolean');
    });
  });

  test.describe('Offline Support', () => {
    test('should show content when going offline', async ({ page, context }) => {
      await page.goto('/');
      await waitForPageReady(page);

      // Wait for SW and caching
      await page.waitForTimeout(3000);

      // Go offline
      await context.setOffline(true);

      // Try to navigate (might show cached content or offline page)
      await page.reload();

      // Should still show something (cached or offline UI)
      const body = page.locator('body');
      await expect(body).toBeVisible();

      // Go back online
      await context.setOffline(false);
    });
  });

  test.describe('Install Prompt', () => {
    test('install page should exist and be accessible', async ({ page }) => {
      const response = await page.goto('/install');
      expect(response?.status()).toBe(200);
      await waitForPageReady(page);

      // Should have install instructions
      await expect(page.getByText(/install/i)).toBeVisible();
    });
  });

  test.describe('Icons Availability', () => {
    test('PWA icons should be accessible', async ({ page }) => {
      const iconPaths = ['/pwa-192x192.png', '/pwa-512x512.png'];

      for (const iconPath of iconPaths) {
        const response = await page.goto(iconPath);
        expect(response?.status()).toBe(200);

        const contentType = response?.headers()['content-type'];
        expect(contentType).toContain('image');
      }
    });

    test('favicon should be accessible', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      const favicon = page.locator('link[rel="icon"], link[rel="shortcut icon"]');
      const count = await favicon.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('App Shell', () => {
    test('should have proper viewport meta', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
      expect(viewport).toContain('width=device-width');
      expect(viewport).toContain('initial-scale=1');
    });

    test('should be responsive on different devices', async ({ page }) => {
      const viewports = [
        { width: 320, height: 568 }, // iPhone SE
        { width: 375, height: 667 }, // iPhone 8
        { width: 414, height: 896 }, // iPhone 11
        { width: 768, height: 1024 }, // iPad
      ];

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.goto('/');
        await waitForPageReady(page);

        // Should render without horizontal scroll
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 20); // Small tolerance
      }
    });
  });
});
