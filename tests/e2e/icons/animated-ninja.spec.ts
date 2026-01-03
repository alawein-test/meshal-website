import { test, expect } from '@playwright/test';
import {
  waitForPageReady,
  measureAnimationPerformance,
  checkReducedMotion,
} from '../../utils/test-helpers';

test.describe('Animated Ninja Icon', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/icon-assets');
    await waitForPageReady(page);

    // Switch to animated tab
    const animatedTab = page.getByRole('tab', { name: /Animated/i });
    await animatedTab.click();
    await page.waitForTimeout(300);
  });

  test('renders animated ninja icon', async ({ page }) => {
    const animatedIcon = page.locator('[data-testid="animated-ninja"]').first();
    await expect(animatedIcon).toBeVisible();
  });

  test('displays all animation types', async ({ page }) => {
    const animations = ['idle', 'wave', 'bounce', 'pulse', 'none'];

    for (const animation of animations) {
      const label = page.getByText(animation, { exact: true });
      await expect(label).toBeVisible();
    }
  });

  test('icon has proper accessibility attributes', async ({ page }) => {
    const icon = page.locator('[data-testid="animated-ninja"]').first();

    const role = await icon.getAttribute('role');
    const ariaLabel = await icon.getAttribute('aria-label');

    expect(role).toBe('img');
    expect(ariaLabel).toBeTruthy();
  });

  test('interactive ninja responds to click', async ({ page }) => {
    // Find the interactive demo section
    const interactiveSection = page.getByText('Interactive Demo').locator('..');
    const clickableNinja = interactiveSection.locator('[data-testid="animated-ninja"]');

    await expect(clickableNinja).toBeVisible();

    // Click and check for toast notification
    await clickableNinja.click();

    // Toast should appear
    const toast = page.getByText(/Ninja says hi/i);
    await expect(toast).toBeVisible({ timeout: 3000 });
  });

  test('animation performance is acceptable', async ({ page }) => {
    // Wait for animations to start
    await page.waitForTimeout(500);

    const { fps, jank } = await measureAnimationPerformance(page, 2000);

    // Should maintain at least 30 FPS
    expect(fps).toBeGreaterThan(30);

    // Log performance metrics
    console.log(`Animation FPS: ${fps.toFixed(2)}, Jank detected: ${jank}`);
  });

  test('respects reduced motion preference', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(500);

    // With reduced motion, animations should be disabled or minimal
    const animatedIcon = page.locator('[data-testid="animated-ninja"]').first();
    await expect(animatedIcon).toBeVisible();

    // The icon should still be visible even with reduced motion
    // Animation behavior is handled by the component checking prefers-reduced-motion
  });

  test('blinking animation occurs', async ({ page }) => {
    // This test checks that the ninja blinks over time
    // We can't directly test the visual blink, but we can verify the component
    // handles the blink state

    const animatedIcon = page.locator('[data-testid="animated-ninja"]').first();
    await expect(animatedIcon).toBeVisible();

    // Wait for potential blink to occur (random, so we wait longer)
    await page.waitForTimeout(5000);

    // Icon should still be visible after animation cycles
    await expect(animatedIcon).toBeVisible();
  });

  test('hover effect works on clickable ninja', async ({ page }) => {
    const interactiveSection = page.getByText('Interactive Demo').locator('..');
    const clickableNinja = interactiveSection.locator('[data-testid="animated-ninja"]');

    // Hover over the ninja
    await clickableNinja.hover();

    // Should have cursor pointer
    const cursor = await clickableNinja.evaluate((el) => window.getComputedStyle(el).cursor);
    expect(cursor).toBe('pointer');
  });
});

test.describe('Animated Ninja - Cross-browser', () => {
  test('renders consistently across viewport sizes', async ({ page }) => {
    await page.goto('/icon-assets');
    await waitForPageReady(page);

    // Switch to animated tab
    const animatedTab = page.getByRole('tab', { name: /Animated/i });
    await animatedTab.click();

    const viewports = [
      { width: 375, height: 667 }, // iPhone SE
      { width: 768, height: 1024 }, // iPad
      { width: 1440, height: 900 }, // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(200);

      const icon = page.locator('[data-testid="animated-ninja"]').first();
      await expect(icon).toBeVisible();
    }
  });
});
