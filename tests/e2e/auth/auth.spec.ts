import { test, expect } from '@playwright/test';
import { waitForPageReady } from '../../utils/test-helpers';

test.describe('Authentication Flows', () => {
  test.describe('Login Page', () => {
    test('should display login form', async ({ page }) => {
      await page.goto('/auth');
      await waitForPageReady(page);

      await expect(page.getByRole('heading', { name: /sign in|login/i })).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /sign in|login/i })).toBeVisible();
    });

    test('should show validation errors for empty fields', async ({ page }) => {
      await page.goto('/auth');
      await waitForPageReady(page);

      await page.getByRole('button', { name: /sign in|login/i }).click();

      // Should show validation errors
      await expect(page.getByText(/email|required/i)).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/auth');
      await waitForPageReady(page);

      await page.getByLabel(/email/i).fill('invalid@test.com');
      await page.getByLabel(/password/i).fill('wrongpassword');
      await page.getByRole('button', { name: /sign in|login/i }).click();

      // Wait for error message
      await expect(page.getByText(/invalid|error|incorrect/i)).toBeVisible({ timeout: 10000 });
    });

    test('should have link to signup page', async ({ page }) => {
      await page.goto('/auth');
      await waitForPageReady(page);

      const signUpLink = page.getByRole('button', { name: /sign up|register|create account/i });
      await expect(signUpLink).toBeVisible();
    });
  });

  test.describe('Signup Flow', () => {
    test('should display signup form when toggled', async ({ page }) => {
      await page.goto('/auth');
      await waitForPageReady(page);

      // Toggle to signup mode
      await page.getByRole('button', { name: /sign up|register|create account/i }).click();

      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
      await page.goto('/auth');
      await waitForPageReady(page);

      await page.getByRole('button', { name: /sign up|register|create account/i }).click();
      await page.getByLabel(/email/i).fill('invalidemail');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: /sign up|create/i }).click();

      await expect(page.getByText(/valid email|invalid email/i)).toBeVisible();
    });
  });

  test.describe('Auth Page Accessibility', () => {
    test('should have proper heading structure', async ({ page }) => {
      await page.goto('/auth');
      await waitForPageReady(page);

      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
    });

    test('should be keyboard navigable', async ({ page }) => {
      await page.goto('/auth');
      await waitForPageReady(page);

      // Tab through form elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Should be able to focus form elements
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(['INPUT', 'BUTTON', 'A']).toContain(focusedElement);
    });
  });
});
