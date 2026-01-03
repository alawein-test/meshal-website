import { Page, expect } from '@playwright/test';

/**
 * Wait for the page to be fully loaded and hydrated
 */
export async function waitForPageReady(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Check if an SVG element has proper accessibility attributes
 */
export async function checkSvgAccessibility(
  page: Page,
  selector: string
): Promise<{ hasTitle: boolean; hasAriaLabel: boolean; hasRole: boolean }> {
  const svg = page.locator(selector);

  const hasTitle = (await svg.locator('title').count()) > 0;
  const ariaLabel = await svg.getAttribute('aria-label');
  const role = await svg.getAttribute('role');

  return {
    hasTitle,
    hasAriaLabel: !!ariaLabel,
    hasRole: role === 'img',
  };
}

/**
 * Measure animation performance using Performance API
 */
export async function measureAnimationPerformance(
  page: Page,
  duration: number = 2000
): Promise<{ fps: number; jank: boolean }> {
  const frames = await page.evaluate(async (duration) => {
    return new Promise<number[]>((resolve) => {
      const frameTimestamps: number[] = [];
      let lastTime = performance.now();

      const measure = () => {
        const now = performance.now();
        frameTimestamps.push(now - lastTime);
        lastTime = now;

        if (frameTimestamps.length < duration / 16) {
          requestAnimationFrame(measure);
        } else {
          resolve(frameTimestamps);
        }
      };

      requestAnimationFrame(measure);
    });
  }, duration);

  const avgFrameTime = frames.reduce((a, b) => a + b, 0) / frames.length;
  const fps = 1000 / avgFrameTime;
  const jank = frames.some((time) => time > 50); // Frame took more than 50ms

  return { fps, jank };
}

/**
 * Check color contrast ratio (simplified version)
 */
export async function getElementColors(
  page: Page,
  selector: string
): Promise<{ fill: string | null; stroke: string | null }> {
  const element = page.locator(selector).first();

  const fill = await element.evaluate((el) => {
    return window.getComputedStyle(el).fill || el.getAttribute('fill');
  });

  const stroke = await element.evaluate((el) => {
    return window.getComputedStyle(el).stroke || el.getAttribute('stroke');
  });

  return { fill, stroke };
}

/**
 * Test icon at different viewport sizes
 */
export async function testResponsiveIcon(
  page: Page,
  selector: string,
  viewports: { width: number; height: number }[]
): Promise<{ viewport: { width: number; height: number }; isVisible: boolean }[]> {
  const results: { viewport: { width: number; height: number }; isVisible: boolean }[] = [];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(100); // Allow rerender

    const isVisible = await page.locator(selector).isVisible();
    results.push({ viewport, isVisible });
  }

  return results;
}

/**
 * Capture icon screenshot for visual regression
 */
export async function captureIconScreenshot(
  page: Page,
  selector: string,
  name: string
): Promise<Buffer> {
  const element = page.locator(selector).first();
  return await element.screenshot({ path: `test-results/icons/${name}.png` });
}

/**
 * Check if element respects reduced motion preference
 */
export async function checkReducedMotion(page: Page, selector: string): Promise<boolean> {
  // Enable reduced motion
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(100);

  const hasAnimation = await page.locator(selector).evaluate((el) => {
    const style = window.getComputedStyle(el);
    return style.animation !== 'none' || style.transition !== 'none';
  });

  // Reset
  await page.emulateMedia({ reducedMotion: 'no-preference' });

  return !hasAnimation;
}
