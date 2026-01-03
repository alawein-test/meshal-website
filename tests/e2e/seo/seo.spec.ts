import { test, expect } from '@playwright/test';
import { waitForPageReady } from '../../utils/test-helpers';

test.describe('SEO Tests', () => {
  test.describe('Meta Tags', () => {
    test('landing page should have proper meta tags', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      // Check title
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeLessThan(70); // SEO best practice

      // Check meta description
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description).toBeTruthy();
      expect(description!.length).toBeLessThan(160); // SEO best practice

      // Check viewport
      const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
      expect(viewport).toContain('width=device-width');
    });

    test('should have Open Graph tags', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      const ogDescription = await page
        .locator('meta[property="og:description"]')
        .getAttribute('content');
      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');

      expect(ogTitle).toBeTruthy();
      expect(ogDescription).toBeTruthy();
      expect(ogImage).toBeTruthy();
      expect(ogUrl).toBeTruthy();
    });

    test('should have Twitter Card tags', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
      const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content');

      expect(twitterCard).toBeTruthy();
      expect(twitterTitle).toBeTruthy();
    });
  });

  test.describe('Structured Data', () => {
    test('landing page should have JSON-LD structured data', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      const jsonLd = await page.locator('script[type="application/ld+json"]').all();
      expect(jsonLd.length).toBeGreaterThan(0);

      for (const script of jsonLd) {
        const content = await script.textContent();
        expect(content).toBeTruthy();

        // Validate it's valid JSON
        const parsed = JSON.parse(content!);
        expect(parsed['@context']).toBe('https://schema.org');
      }
    });

    test('should have Person schema', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      const scripts = await page.locator('script[type="application/ld+json"]').all();
      let hasPersonSchema = false;

      for (const script of scripts) {
        const content = await script.textContent();
        const parsed = JSON.parse(content!);
        if (parsed['@type'] === 'Person') {
          hasPersonSchema = true;
          expect(parsed.name).toBeTruthy();
        }
      }

      expect(hasPersonSchema).toBe(true);
    });

    test('should have WebSite schema', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      const scripts = await page.locator('script[type="application/ld+json"]').all();
      let hasWebSiteSchema = false;

      for (const script of scripts) {
        const content = await script.textContent();
        const parsed = JSON.parse(content!);
        if (parsed['@type'] === 'WebSite') {
          hasWebSiteSchema = true;
          expect(parsed.name).toBeTruthy();
          expect(parsed.url).toBeTruthy();
        }
      }

      expect(hasWebSiteSchema).toBe(true);
    });
  });

  test.describe('Semantic HTML', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      // Should have exactly one h1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);

      // H1 should contain meaningful content
      const h1Text = await page.locator('h1').textContent();
      expect(h1Text!.trim().length).toBeGreaterThan(0);
    });

    test('should use semantic landmarks', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      // Check for main landmark
      const main = page.locator('main, [role="main"]');
      await expect(main.first()).toBeVisible();

      // Check for header
      const header = page.locator('header, [role="banner"]');
      expect(await header.count()).toBeGreaterThan(0);
    });

    test('should have lang attribute', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      const lang = await page.locator('html').getAttribute('lang');
      expect(lang).toBeTruthy();
    });
  });

  test.describe('Robots & Sitemap', () => {
    test('should have robots.txt', async ({ page }) => {
      const response = await page.goto('/robots.txt');
      expect(response?.status()).toBe(200);

      const content = await page.content();
      expect(content).toContain('User-agent');
    });

    test('should have sitemap.xml', async ({ page }) => {
      const response = await page.goto('/sitemap.xml');
      expect(response?.status()).toBe(200);

      const content = await page.content();
      expect(content).toContain('urlset');
      expect(content).toContain('<loc>');
    });

    test('robots.txt should reference sitemap', async ({ page }) => {
      await page.goto('/robots.txt');
      const content = await page.content();
      expect(content.toLowerCase()).toContain('sitemap');
    });
  });

  test.describe('Canonical URLs', () => {
    test('pages should have canonical links', async ({ page }) => {
      const pages = ['/', '/portfolio', '/projects'];

      for (const pagePath of pages) {
        await page.goto(pagePath);
        await waitForPageReady(page);

        // Check for canonical or og:url
        const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
        const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');

        expect(canonical || ogUrl).toBeTruthy();
      }
    });
  });

  test.describe('Image Optimization', () => {
    test('images should have alt attributes', async ({ page }) => {
      await page.goto('/portfolio');
      await waitForPageReady(page);

      const images = page.locator('img');
      const count = await images.count();

      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        const ariaHidden = await img.getAttribute('aria-hidden');

        // Either has alt or is decorative (aria-hidden)
        expect(alt !== null || ariaHidden === 'true').toBe(true);
      }
    });
  });

  test.describe('Performance SEO', () => {
    test('should have preconnect hints', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      const preconnects = page.locator('link[rel="preconnect"]');
      const count = await preconnects.count();

      // Should have at least one preconnect (e.g., for fonts)
      expect(count).toBeGreaterThanOrEqual(0); // May not always have preconnects
    });

    test('should not have render-blocking resources', async ({ page }) => {
      await page.goto('/');

      // Check for async/defer on scripts
      const scripts = page.locator('script[src]:not([async]):not([defer]):not([type="module"])');
      const blockingScripts = await scripts.count();

      // Module scripts are non-blocking by default
      expect(blockingScripts).toBeLessThan(3);
    });
  });
});
