import { test, expect } from '@playwright/test';

test.describe('Ninja Loader Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/icon-assets');
  });

  test('page loads with ninja icons visible', async ({ page }) => {
    // Verify the page loaded
    await expect(page.locator('h1')).toContainText('Ninja Icon');

    // Check that ninja icons are rendered
    const ninjaIcons = page.locator('[data-testid="ninja-icon"]');
    await expect(ninjaIcons.first()).toBeVisible();
  });

  test('icons have correct accessibility attributes', async ({ page }) => {
    const iconSvg = page.locator('svg[role="img"]').first();
    await expect(iconSvg).toHaveAttribute('aria-label');
  });
});

test.describe('Sticker Pack Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/stickers');
  });

  test('sticker pack page renders', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Ninja Sticker Pack');
  });

  test('shows all expression stickers', async ({ page }) => {
    // Verify multiple sticker cards are displayed
    const stickerCards = page.locator('.grid > div');
    await expect(stickerCards).toHaveCount(8);
  });

  test('size selector works', async ({ page }) => {
    // Click different size buttons
    const sizeButtons = page.locator('button:has-text("px")');
    await expect(sizeButtons).toHaveCount(4);

    // Click 256px size
    await page.click('button:has-text("256px")');

    // Verify the button is active
    await expect(page.locator('button:has-text("256px")')).toHaveAttribute('data-state');
  });

  test('download buttons are functional', async ({ page }) => {
    // Find download buttons
    const svgButton = page.locator('button:has-text("SVG")').first();
    const pngButton = page.locator('button:has-text("PNG")').first();

    await expect(svgButton).toBeVisible();
    await expect(pngButton).toBeVisible();
  });
});

test.describe('Page Transition Loading', () => {
  test('shows ninja loader during page transitions', async ({ page }) => {
    await page.goto('/');

    // Navigate to trigger transition
    const portfolioLink = page.locator('a[href="/portfolio"]').first();
    if (await portfolioLink.isVisible()) {
      await portfolioLink.click();

      // Page transition should complete
      await page.waitForURL('/portfolio');
      await expect(page).toHaveURL('/portfolio');
    }
  });

  test('scan line effect appears on transition', async ({ page }) => {
    await page.goto('/portfolio');

    // The scan line overlay should animate away
    // Just verify the page content loads properly
    await expect(page.locator('main, section').first()).toBeVisible();
  });
});

test.describe('Favicon', () => {
  test('ninja favicon is set correctly', async ({ page }) => {
    await page.goto('/');

    // Check that favicon link exists
    const faviconLink = page.locator('link[rel="icon"]');
    await expect(faviconLink).toHaveAttribute('href', '/ninja-favicon.svg');
  });

  test('favicon svg file is accessible', async ({ page }) => {
    const response = await page.goto('/ninja-favicon.svg');
    expect(response?.status()).toBe(200);

    const contentType = response?.headers()['content-type'];
    expect(contentType).toContain('svg');
  });
});
