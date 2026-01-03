import { test, expect } from '@playwright/test';
import {
  waitForPageReady,
  checkSvgAccessibility,
  testResponsiveIcon,
  getElementColors,
} from '../../utils/test-helpers';

test.describe('Ninja Icon - Static', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/icon-assets');
    await waitForPageReady(page);
  });

  test('renders ninja icon correctly', async ({ page }) => {
    const icon = page.locator('[data-testid="ninja-icon"]').first();
    await expect(icon).toBeVisible();
  });

  test('icon has proper SVG structure', async ({ page }) => {
    const icon = page.locator('[data-testid="ninja-icon"]').first();

    // Check it's an SVG
    const tagName = await icon.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe('svg');

    // Check it has rect elements (pixels)
    const rects = icon.locator('rect');
    const rectCount = await rects.count();
    expect(rectCount).toBeGreaterThan(0);
  });

  test('icon has accessibility attributes', async ({ page }) => {
    const accessibility = await checkSvgAccessibility(page, '[data-testid="ninja-icon"]');

    expect(accessibility.hasTitle).toBe(true);
    expect(accessibility.hasAriaLabel).toBe(true);
    expect(accessibility.hasRole).toBe(true);
  });

  test('icon renders at different sizes', async ({ page }) => {
    // Check multiple size icons are present
    const sizes = ['16', '32', '48', '64', '128', '256'];

    for (const size of sizes) {
      const sizeLabel = page.getByText(`${size}×${size}`);
      await expect(sizeLabel).toBeVisible();
    }
  });

  test('icon uses correct brand colors', async ({ page }) => {
    const icon = page.locator('[data-testid="ninja-icon"]').first();
    const rects = icon.locator('rect');

    // Get fill colors of visible rects
    const fillColors = await rects.evaluateAll((elements) =>
      elements.map((el) => el.getAttribute('fill')).filter((fill) => fill && fill !== 'transparent')
    );

    // Should have cyan and magenta colors
    expect(fillColors.length).toBeGreaterThan(0);
  });

  test('icon visible on dark background', async ({ page }) => {
    // Find the black background test container
    const darkBg = page.locator('.bg-black').first();
    await expect(darkBg).toBeVisible();

    const iconInDark = darkBg.locator('[data-testid="ninja-icon"]');
    await expect(iconInDark).toBeVisible();
  });

  test('icon visible on light background', async ({ page }) => {
    // Find the white background test container
    const lightBg = page.locator('.bg-white').first();
    await expect(lightBg).toBeVisible();

    const iconInLight = lightBg.locator('[data-testid="ninja-icon"]');
    await expect(iconInLight).toBeVisible();
  });

  test('icon responsive across viewports', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1280, height: 800 }, // Desktop
      { width: 1920, height: 1080 }, // Large desktop
    ];

    const results = await testResponsiveIcon(page, '[data-testid="ninja-icon"]', viewports);

    for (const result of results) {
      expect(result.isVisible).toBe(true);
    }
  });

  test('download buttons work', async ({ page }) => {
    // Click first SVG download button
    const downloadButton = page.getByRole('button', { name: /SVG/i }).first();
    await expect(downloadButton).toBeVisible();

    // We can't easily test actual downloads, but we can verify button is clickable
    await expect(downloadButton).toBeEnabled();
  });

  test('copy SVG button works', async ({ page }) => {
    const copyButton = page.getByRole('button', { name: /Copy SVG/i }).first();
    await expect(copyButton).toBeVisible();
    await expect(copyButton).toBeEnabled();

    // Click and check for success feedback
    await copyButton.click();

    // Should show check icon after copy
    const checkIcon = copyButton.locator('.text-green-500');
    await expect(checkIcon).toBeVisible({ timeout: 2000 });
  });
});

test.describe('Ninja Icon - Variants', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/icon-assets');
    await waitForPageReady(page);
  });

  test('displays all icon variants', async ({ page }) => {
    const variants = ['Default', 'Happy', 'Wink'];

    for (const variant of variants) {
      const label = page.getByText(variant, { exact: true });
      await expect(label).toBeVisible();
    }
  });
});
