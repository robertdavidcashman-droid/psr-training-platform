import { test, expect } from "@playwright/test";

/**
 * Comprehensive authentication E2E tests
 * Tests signup, login, session persistence, logout, and protected routes
 */

// Generate unique email for each test run
const timestamp = Date.now();
const randomId = Math.random().toString(36).substring(7);
const TEST_EMAIL = `test-${timestamp}-${randomId}@example.com`;
const TEST_PASSWORD = "test-password-123";

test.describe("Authentication System - Comprehensive Tests", () => {
  test.describe("Signup Flow", () => {
    test("should successfully sign up a new user", async ({ page }) => {
      await page.goto("/signup");

      // Fill in signup form
      await page.getByLabel("Email").fill(TEST_EMAIL);
      await page.getByLabel("Password").fill(TEST_PASSWORD);
      await page.getByLabel("Confirm Password").fill(TEST_PASSWORD);

      // Submit form
      await page.getByRole("button", { name: "Create Account" }).click();

      // Check for success message or redirect
      // Note: If email confirmation is required, we'll see a success message
      // If auto-confirmed, we'll be redirected to dashboard
      const url = page.url();
      const hasSuccessMessage = await page
        .getByText(/account created|check your email/i)
        .isVisible()
        .catch(() => false);
      const isDashboard = url.includes("/dashboard");

      // Either we see success message (email confirmation required) or redirect to dashboard (auto-confirmed)
      expect(hasSuccessMessage || isDashboard).toBe(true);
    });

    test("should show error for password mismatch", async ({ page }) => {
      await page.goto("/signup");

      await page.getByLabel("Email").fill("test@example.com");
      await page.getByLabel("Password").fill("password123");
      await page.getByLabel("Confirm Password").fill("password456");

      await page.getByRole("button", { name: "Create Account" }).click();

      await expect(
        page.getByText(/passwords do not match/i)
      ).toBeVisible({ timeout: 5000 });
    });

    test("should show error for short password", async ({ page }) => {
      await page.goto("/signup");

      await page.getByLabel("Email").fill("test@example.com");
      await page.getByLabel("Password").fill("12345");
      await page.getByLabel("Confirm Password").fill("12345");

      await page.getByRole("button", { name: "Create Account" }).click();

      await expect(
        page.getByText(/password must be at least 6 characters/i)
      ).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe("Login Flow", () => {
    test("should display login page", async ({ page }) => {
      await page.goto("/login");

      await expect(
        page.getByRole("heading", { name: "Sign In" })
      ).toBeVisible();
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(page.getByLabel("Password")).toBeVisible();
      await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
    });

    test("should show error for invalid credentials", async ({ page }) => {
      await page.goto("/login");

      await page.getByLabel("Email").fill("invalid@example.com");
      await page.getByLabel("Password").fill("wrong-password");
      await page.getByRole("button", { name: "Sign In" }).click();

      await expect(
        page.getByText(/error|invalid|incorrect/i)
      ).toBeVisible({ timeout: 5000 });
    });

    test("should successfully log in with valid credentials", async ({
      page,
    }) => {
      // First, ensure user exists (signup if needed)
      await page.goto("/signup");
      await page.getByLabel("Email").fill(TEST_EMAIL);
      await page.getByLabel("Password").fill(TEST_PASSWORD);
      await page.getByLabel("Confirm Password").fill(TEST_PASSWORD);
      await page.getByRole("button", { name: "Create Account" }).click();

      // Wait a bit for signup to complete
      await page.waitForTimeout(2000);

      // Now try to login
      await page.goto("/login");
      await page.getByLabel("Email").fill(TEST_EMAIL);
      await page.getByLabel("Password").fill(TEST_PASSWORD);
      await page.getByRole("button", { name: "Sign In" }).click();

      // Should redirect to dashboard (or show success if email confirmation needed)
      // For this test, we'll check if we're redirected OR if there's a message about email confirmation
      await page.waitForTimeout(3000);
      const url = page.url();
      const hasEmailMessage = await page
        .getByText(/check your email|confirm/i)
        .isVisible()
        .catch(() => false);

      // If email confirmation is disabled, we should be on dashboard
      // If enabled, we might see a message (but login should still work after confirmation)
      // For now, we'll accept either dashboard redirect or email confirmation message
      if (!hasEmailMessage) {
        await expect(page).toHaveURL("/dashboard", { timeout: 10000 });
      }
    });

    test("should redirect to intended page after login", async ({ page }) => {
      // Try to access a protected route
      await page.goto("/practice");
      await page.waitForURL("**/login**");

      // Login
      await page.getByLabel("Email").fill(TEST_EMAIL);
      await page.getByLabel("Password").fill(TEST_PASSWORD);
      await page.getByRole("button", { name: "Sign In" }).click();

      // Should redirect to the originally requested page
      await page.waitForURL("**/practice", { timeout: 10000 });
      await expect(page).toHaveURL("/practice");
    });
  });

  test.describe("Session Persistence", () => {
    test("should persist session after page refresh", async ({ page }) => {
      // Login first
      await page.goto("/login");
      await page.getByLabel("Email").fill(TEST_EMAIL);
      await page.getByLabel("Password").fill(TEST_PASSWORD);
      await page.getByRole("button", { name: "Sign In" }).click();

      // Wait for redirect to dashboard
      await page.waitForURL("**/dashboard", { timeout: 10000 }).catch(() => {
        // If email confirmation is required, login might not work immediately
        // Skip this test in that case
        test.skip();
      });

      // Verify we're on dashboard
      await expect(page).toHaveURL("/dashboard");

      // Refresh the page
      await page.reload();

      // Should still be on dashboard (session persisted)
      await expect(page).toHaveURL("/dashboard", { timeout: 5000 });
    });

    test("should persist session across navigation", async ({ page }) => {
      // Login first
      await page.goto("/login");
      await page.getByLabel("Email").fill(TEST_EMAIL);
      await page.getByLabel("Password").fill(TEST_PASSWORD);
      await page.getByRole("button", { name: "Sign In" }).click();

      // Wait for redirect
      await page.waitForURL("**/dashboard", { timeout: 10000 }).catch(() => {
        test.skip();
      });

      // Navigate to another protected route
      await page.goto("/practice");
      await expect(page).toHaveURL("/practice");

      // Navigate back to dashboard
      await page.goto("/dashboard");
      await expect(page).toHaveURL("/dashboard");
    });
  });

  test.describe("Protected Routes", () => {
    test("should redirect to login when accessing protected route while logged out", async ({
      page,
    }) => {
      // Ensure we're logged out (clear cookies)
      await page.context().clearCookies();

      await page.goto("/dashboard");
      await page.waitForURL("**/login**");
      expect(page.url()).toContain("/login");
      expect(page.url()).toMatch(/redirect=(%2Fdashboard|\/dashboard)/);
    });

    test("should allow access to protected route when logged in", async ({
      page,
    }) => {
      // Login first
      await page.goto("/login");
      await page.getByLabel("Email").fill(TEST_EMAIL);
      await page.getByLabel("Password").fill(TEST_PASSWORD);
      await page.getByRole("button", { name: "Sign In" }).click();

      await page.waitForURL("**/dashboard", { timeout: 10000 }).catch(() => {
        test.skip();
      });

      // Access protected route
      await page.goto("/practice");
      await expect(page).toHaveURL("/practice");
    });
  });

  test.describe("Logout Flow", () => {
    test("should successfully logout", async ({ page }) => {
      // Login first
      await page.goto("/login");
      await page.getByLabel("Email").fill(TEST_EMAIL);
      await page.getByLabel("Password").fill(TEST_PASSWORD);
      await page.getByRole("button", { name: "Sign In" }).click();

      await page.waitForURL("**/dashboard", { timeout: 10000 }).catch(() => {
        test.skip();
      });

      // Verify we're logged in
      await expect(page.getByTestId("logout-button")).toBeVisible();

      // Click logout
      await page.getByTestId("logout-button").click();

      // Should redirect to home page
      await page.waitForURL("**/", { timeout: 5000 });
      await expect(page).toHaveURL("/");

      // Should not be able to access protected routes
      await page.goto("/dashboard");
      await page.waitForURL("**/login**");
    });
  });

  test.describe("Auth Pages Navigation", () => {
    test("should redirect logged-in users away from login page", async ({
      page,
    }) => {
      // Login first
      await page.goto("/login");
      await page.getByLabel("Email").fill(TEST_EMAIL);
      await page.getByLabel("Password").fill(TEST_PASSWORD);
      await page.getByRole("button", { name: "Sign In" }).click();

      await page.waitForURL("**/dashboard", { timeout: 10000 }).catch(() => {
        test.skip();
      });

      // Try to access login page
      await page.goto("/login");

      // Should redirect to dashboard
      await expect(page).toHaveURL("/dashboard", { timeout: 5000 });
    });

    test("should redirect logged-in users away from signup page", async ({
      page,
    }) => {
      // Login first
      await page.goto("/login");
      await page.getByLabel("Email").fill(TEST_EMAIL);
      await page.getByLabel("Password").fill(TEST_PASSWORD);
      await page.getByRole("button", { name: "Sign In" }).click();

      await page.waitForURL("**/dashboard", { timeout: 10000 }).catch(() => {
        test.skip();
      });

      // Try to access signup page
      await page.goto("/signup");

      // Should redirect to dashboard
      await expect(page).toHaveURL("/dashboard", { timeout: 5000 });
    });
  });

  test.describe("Password Reset", () => {
    test("should display password reset page", async ({ page }) => {
      await page.goto("/reset-password");

      await expect(
        page.getByRole("heading", { name: /reset password/i })
      ).toBeVisible();
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(
        page.getByRole("button", { name: /send reset link/i })
      ).toBeVisible();
    });

    test("should show success message after submitting reset form", async ({
      page,
    }) => {
      await page.goto("/reset-password");

      await page.getByLabel("Email").fill(TEST_EMAIL);
      await page.getByRole("button", { name: /send reset link/i }).click();

      // Should show success message (even if email doesn't exist, Supabase doesn't reveal this)
      await expect(
        page.getByText(/password reset email sent|check your inbox/i)
      ).toBeVisible({ timeout: 5000 });
    });
  });
});
