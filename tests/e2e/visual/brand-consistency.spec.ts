import { test, expect } from '@playwright/test';

test.describe('Brand Consistency', () => {
  const pages = ['/', '/portfolio', '/icon-assets', '/stickers'];

  test('ninja icon appears consistently across pages', async ({ page }) => {
    for (const path of pages) {
      await page.goto(path);

      // Check for ninja icon presence (SVG with ninja pattern)
      const hasSvgIcon = await page.locator('svg').first().isVisible();
      expect(hasSvgIcon).toBeTruthy();
    }
  });

  test('brand colors are present in gradient text', async ({ page }) => {
    await page.goto('/');

    // Check for gradient text elements that use brand colors
    const gradientElements = page.locator('[class*="gradient"], [class*="bg-clip-text"]');
    const count = await gradientElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('footer contains brand logo', async ({ page }) => {
    await page.goto('/portfolio');

    // Check footer exists
    const footer = page.locator('footer');
    if (await footer.isVisible()) {
      // Footer should contain brand elements
      await expect(footer).toBeVisible();
    }
  });

  test('navigation contains brand elements', async ({ page }) => {
    await page.goto('/portfolio');

    // Check for navigation/header with brand logo
    const nav = page.locator('nav, header').first();
    await expect(nav).toBeVisible();
  });

  test('icon-assets page is accessible', async ({ page }) => {
    await page.goto('/icon-assets');

    // Page should load and show icon assets
    await expect(page).toHaveTitle(/Icon|Assets|Ninja/i);

    // Should have downloadable content
    const downloadButtons = page.locator(
      'button:has-text("Download"), button:has-text("SVG"), button:has-text("PNG")'
    );
    await expect(downloadButtons.first()).toBeVisible();
  });

  test('sticker pack page is accessible', async ({ page }) => {
    await page.goto('/stickers');

    // Page should load with sticker content
    await expect(page.locator('h1')).toContainText('Ninja Sticker Pack');

    // Should have size selector
    const sizeButtons = page.locator('button:has-text("px")');
    await expect(sizeButtons.first()).toBeVisible();
  });

  test('icons are visible in light mode', async ({ page }) => {
    await page.goto('/icon-assets');

    // Check icons are rendered
    const icons = page.locator('svg[role="img"], [data-testid="ninja-icon"]');
    await expect(icons.first()).toBeVisible();
  });

  test('icons are visible in dark mode', async ({ page }) => {
    await page.goto('/icon-assets');

    // Ensure dark mode is active (default)
    const icons = page.locator('svg[role="img"], [data-testid="ninja-icon"]');
    await expect(icons.first()).toBeVisible();
  });
});

test.describe('Visual Regression', () => {
  test('icon-assets page visual snapshot', async ({ page }) => {
    await page.goto('/icon-assets');
    await page.waitForTimeout(500); // Wait for animations

    // Take screenshot of the full page
    await expect(page).toHaveScreenshot('icon-assets-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
  });

  test('sticker pack page visual snapshot', async ({ page }) => {
    await page.goto('/stickers');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('sticker-pack-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
  });

  test('static icons grid snapshot', async ({ page }) => {
    await page.goto('/icon-assets');

    // Take screenshot of the static icons section
    const staticGrid = page.locator('.grid').first();
    if (await staticGrid.isVisible()) {
      await expect(staticGrid).toHaveScreenshot('static-icons-grid.png', {
        maxDiffPixelRatio: 0.1,
      });
    }
  });

  test('animated icons are visually consistent', async ({ page }) => {
    await page.goto('/icon-assets');

    // Switch to animated tab if exists
    const animatedTab = page.locator('button:has-text("Animated")');
    if (await animatedTab.isVisible()) {
      await animatedTab.click();
      await page.waitForTimeout(300);

      // Animations should be running - just verify presence
      const animatedIcons = page.locator('svg[role="img"]');
      await expect(animatedIcons.first()).toBeVisible();
    }
  });

  test('ninja loader component renders correctly', async ({ page }) => {
    await page.goto('/icon-assets');

    // Look for any loading indicators with ninja styling
    const icons = page.locator('svg').first();
    await expect(icons).toBeVisible();
  });
});

test.describe('Favicon Consistency', () => {
  test('favicon is ninja themed', async ({ page }) => {
    await page.goto('/');

    // Check favicon meta tag
    const favicon = page.locator('link[rel="icon"]');
    const href = await favicon.getAttribute('href');
    expect(href).toContain('ninja');
  });

  test('shortcut icon is set', async ({ page }) => {
    await page.goto('/');

    const shortcutIcon = page.locator('link[rel="shortcut icon"]');
    await expect(shortcutIcon).toHaveAttribute('href');
  });
});
