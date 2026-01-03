import { test, expect } from '@playwright/test';
import { waitForPageReady, measureAnimationPerformance } from '../../utils/test-helpers';

test.describe('Performance Tests', () => {
  test.describe('Page Load Performance', () => {
    test('landing page should load within 5 seconds', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      await waitForPageReady(page);
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(5000);
    });

    test('portfolio page should load within 5 seconds', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/portfolio');
      await waitForPageReady(page);
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(5000);
    });

    test('dashboard pages should load within 5 seconds', async ({ page }) => {
      const dashboards = ['/projects/simcore', '/projects/talai', '/projects/qmlab'];

      for (const dashboard of dashboards) {
        const startTime = Date.now();
        await page.goto(dashboard);
        await waitForPageReady(page);
        const loadTime = Date.now() - startTime;

        expect(loadTime).toBeLessThan(5000);
      }
    });
  });

  test.describe('Animation Performance', () => {
    test('landing page animations should not cause jank', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      const { fps, jank } = await measureAnimationPerformance(page, 2000);

      // FPS should be above 30 for smooth animations
      expect(fps).toBeGreaterThan(30);
    });

    test('page transitions should be smooth', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      // Navigate to another page
      const startTime = Date.now();
      await page
        .getByRole('link', { name: /portfolio/i })
        .first()
        .click();
      await waitForPageReady(page);
      const transitionTime = Date.now() - startTime;

      // Transition should be under 2 seconds
      expect(transitionTime).toBeLessThan(2000);
    });
  });

  test.describe('Memory Usage', () => {
    test('should not have memory leaks on navigation', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      // Get initial memory
      const initialMetrics = await page.evaluate(() => {
        if ('memory' in performance) {
          return (performance as any).memory.usedJSHeapSize;
        }
        return 0;
      });

      // Navigate back and forth multiple times
      for (let i = 0; i < 5; i++) {
        await page.goto('/portfolio');
        await waitForPageReady(page);
        await page.goto('/');
        await waitForPageReady(page);
      }

      // Force garbage collection if available
      await page.evaluate(() => {
        if ('gc' in window) {
          (window as any).gc();
        }
      });

      const finalMetrics = await page.evaluate(() => {
        if ('memory' in performance) {
          return (performance as any).memory.usedJSHeapSize;
        }
        return 0;
      });

      // Memory shouldn't grow more than 50% (accounting for normal variance)
      if (initialMetrics > 0) {
        const memoryGrowth = (finalMetrics - initialMetrics) / initialMetrics;
        expect(memoryGrowth).toBeLessThan(0.5);
      }
    });
  });

  test.describe('Network Performance', () => {
    test('should minimize network requests on initial load', async ({ page }) => {
      const requests: string[] = [];

      page.on('request', (request) => {
        requests.push(request.url());
      });

      await page.goto('/');
      await waitForPageReady(page);

      // Should not have excessive requests (adjust threshold as needed)
      expect(requests.length).toBeLessThan(100);
    });

    test('should use caching for static assets', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      // Second load should be faster due to caching
      const startTime = Date.now();
      await page.reload();
      await waitForPageReady(page);
      const reloadTime = Date.now() - startTime;

      expect(reloadTime).toBeLessThan(3000);
    });
  });

  test.describe('Core Web Vitals', () => {
    test('should have good LCP (Largest Contentful Paint)', async ({ page }) => {
      await page.goto('/');

      // Wait for LCP
      const lcp = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1] as any;
            resolve(lastEntry.startTime);
          }).observe({ entryTypes: ['largest-contentful-paint'] });

          // Fallback timeout
          setTimeout(() => resolve(2500), 5000);
        });
      });

      // LCP should be under 2.5 seconds for "good" score
      expect(lcp).toBeLessThan(2500);
    });

    test('should have low CLS (Cumulative Layout Shift)', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      const cls = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let clsValue = 0;

          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            }
          });

          observer.observe({ entryTypes: ['layout-shift'] });

          // Wait and collect shifts
          setTimeout(() => {
            observer.disconnect();
            resolve(clsValue);
          }, 3000);
        });
      });

      // CLS should be under 0.1 for "good" score
      expect(cls).toBeLessThan(0.1);
    });
  });
});
