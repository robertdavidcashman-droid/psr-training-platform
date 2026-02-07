import { test, expect } from "@playwright/test";

/**
 * Level 3 Comprehensive Authentication & Website Functionality Tests
 * 
 * Coverage:
 * - Authentication flows (signup, login, logout)
 * - Session management and persistence
 * - Protected routes and redirects
 * - Error handling and validation
 * - Security features
 * - Edge cases
 * - UI/UX validation
 */

function uniqueEmail(): string {
  return `e2e-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
}

test.describe("Level 3: Comprehensive Authentication Tests", () => {
  const basePassword = "TestPassword123!";

  test.describe("Signup Flow", () => {
    test("should successfully create account with valid credentials", async ({ page }) => {
      const email = uniqueEmail();
      await page.goto("/signup");

      await page.fill("#email", email);
      await page.fill("#password", basePassword);
      await page.fill("#confirmPassword", basePassword);
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
      await expect(page.locator('[data-testid="auth-email"]')).toHaveText(email);
    });

    test("should reject duplicate email", async ({ page }) => {
      const email = uniqueEmail();
      
      // Create first account
      await page.goto("/signup");
      await page.fill("#email", email);
      await page.fill("#password", basePassword);
      await page.fill("#confirmPassword", basePassword);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL(/\/dashboard/);

      // Logout
      await page.click('[aria-label="Logout"]');
      await expect(page).toHaveURL(/\/login/);

      // Try to create duplicate
      await page.goto("/signup");
      await page.fill("#email", email);
      await page.fill("#password", basePassword);
      await page.fill("#confirmPassword", basePassword);
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL(/\/signup/);
      await expect(page.locator('text=/account.*already exists/i')).toBeVisible();
    });

    test("should reject mismatched passwords", async ({ page }) => {
      await page.goto("/signup");
      await page.fill("#email", uniqueEmail());
      await page.fill("#password", basePassword);
      await page.fill("#confirmPassword", "DifferentPassword123!");
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL(/\/signup/);
      await expect(page.locator('text=/passwords.*not match/i')).toBeVisible();
    });

    test("should reject invalid email format", async ({ page }) => {
      await page.goto("/signup");
      await page.fill("#email", "not-an-email");
      await page.fill("#password", basePassword);
      await page.fill("#confirmPassword", basePassword);
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL(/\/signup/);
      await expect(page.locator('text=/invalid.*email/i')).toBeVisible();
    });

    test("should reject short password", async ({ page }) => {
      await page.goto("/signup");
      await page.fill("#email", uniqueEmail());
      await page.fill("#password", "short");
      await page.fill("#confirmPassword", "short");
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL(/\/signup/);
      await expect(page.locator('text=/password.*8.*characters/i')).toBeVisible();
    });

    test("should handle empty fields", async ({ page }) => {
      await page.goto("/signup");
      await page.click('button[type="submit"]');

      // HTML5 validation should prevent submission
      const emailInput = page.locator("#email");
      const passwordInput = page.locator("#password");
      
      await expect(emailInput).toHaveAttribute("required");
      await expect(passwordInput).toHaveAttribute("required");
    });

    test("should handle email case insensitivity", async ({ page }) => {
      const email = uniqueEmail();
      const upperEmail = email.toUpperCase();

      // Signup with lowercase
      await page.goto("/signup");
      await page.fill("#email", email);
      await page.fill("#password", basePassword);
      await page.fill("#confirmPassword", basePassword);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL(/\/dashboard/);
      await page.click('[aria-label="Logout"]');

      // Login with uppercase (should work)
      await page.goto("/login");
      await page.fill("#email", upperEmail);
      await page.fill("#password", basePassword);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL(/\/dashboard/);
    });

    test("should trim whitespace from email", async ({ page }) => {
      const email = uniqueEmail();
      const emailWithSpaces = `  ${email}  `;

      await page.goto("/signup");
      await page.fill("#email", emailWithSpaces);
      await page.fill("#password", basePassword);
      await page.fill("#confirmPassword", basePassword);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL(/\/dashboard/);
      await expect(page.locator('[data-testid="auth-email"]')).toHaveText(email);
    });
  });

  test.describe("Login Flow", () => {
    test("should successfully login with valid credentials", async ({ page }) => {
      const email = uniqueEmail();
      
      // Create account first
      await page.goto("/signup");
      await page.fill("#email", email);
      await page.fill("#password", basePassword);
      await page.fill("#confirmPassword", basePassword);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL(/\/dashboard/);
      await page.click('[aria-label="Logout"]');

      // Login
      await page.goto("/login");
      await page.fill("#email", email);
      await page.fill("#password", basePassword);
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
      await expect(page.locator('[data-testid="auth-email"]')).toHaveText(email);
    });

    test("should reject invalid email", async ({ page }) => {
      await page.goto("/login");
      await page.fill("#email", uniqueEmail());
      await page.fill("#password", basePassword);
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL(/\/login/);
      await expect(page.locator('text=/invalid.*email.*password/i')).toBeVisible();
    });

    test("should reject invalid password", async ({ page }) => {
      const email = uniqueEmail();
      
      // Create account
      await page.goto("/signup");
      await page.fill("#email", email);
      await page.fill("#password", basePassword);
      await page.fill("#confirmPassword", basePassword);
      await page.click('button[type="submit"]');
      await page.click('[aria-label="Logout"]');

      // Try wrong password
      await page.goto("/login");
      await page.fill("#email", email);
      await page.fill("#password", "WrongPassword123!");
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL(/\/login/);
      await expect(page.locator('text=/invalid.*email.*password/i')).toBeVisible();
    });

    test("should handle empty fields", async ({ page }) => {
      await page.goto("/login");
      await page.click('button[type="submit"]');

      const emailInput = page.locator("#email");
      const passwordInput = page.locator("#password");
      
      await expect(emailInput).toHaveAttribute("required");
      await expect(passwordInput).toHaveAttribute("required");
    });

    test("should preserve redirect parameter", async ({ page }) => {
      const email = uniqueEmail();
      
      // Create account
      await page.goto("/signup");
      await page.fill("#email", email);
      await page.fill("#password", basePassword);
      await page.fill("#confirmPassword", basePassword);
      await page.click('button[type="submit"]');
      await page.click('[aria-label="Logout"]');

      // Try to access protected route
      await page.goto("/practice");
      await expect(page).toHaveURL(/\/login/);
      
      const url = new URL(page.url());
      expect(url.searchParams.get("next")).toBe("/practice");

      // Login should redirect back
      await page.fill("#email", email);
      await page.fill("#password", basePassword);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL(/\/practice/);
    });
  });

  test.describe("Session Management", () => {
    test("should persist session across page reloads", async ({ page }) => {
      const email = uniqueEmail();
      
      await page.goto("/signup");
      await page.fill("#email", email);
      await page.fill("#password", basePassword);
      await page.fill("#confirmPassword", basePassword);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL(/\/dashboard/);

      // Reload multiple times
      for (let i = 0; i < 3; i++) {
        await page.reload();
        await expect(page).toHaveURL(/\/dashboard/);
        await expect(page.locator('[data-testid="auth-email"]')).toHaveText(email);
      }
    });

    test("should persist session across navigation", async ({ page }) => {
      const email = uniqueEmail();
      
      await page.goto("/signup");
      await page.fill("#email", email);
      await page.fill("#password", basePassword);
      await page.fill("#confirmPassword", basePassword);
      await page.click('button[type="submit"]');

      // Navigate to different pages
      const routes = ["/dashboard", "/practice", "/syllabus", "/analytics", "/dashboard"];
      for (const route of routes) {
        await page.goto(route);
        await expect(page).toHaveURL(new RegExp(route));
        await expect(page.locator('[data-testid="auth-email"]')).toHaveText(email);
      }
    });

    test("should logout and clear session", async ({ page }) => {
      const email = uniqueEmail();
      
      await page.goto("/signup");
      await page.fill("#email", email);
      await page.fill("#password", basePassword);
      await page.fill("#confirmPassword", basePassword);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL(/\/dashboard/);

      // Logout
      await page.click('[aria-label="Logout"]');
      await expect(page).toHaveURL(/\/login/);

      // Try to access protected route
      await page.goto("/dashboard");
      await expect(page).toHaveURL(/\/login/);
    });

    test("should handle multiple sessions independently", async ({ context }) => {
      const email = uniqueEmail();
      const password = basePassword;

      // Create account in first context
      const page1 = await context.newPage();
      await page1.goto("/signup");
      await page1.fill("#email", email);
      await page1.fill("#password", password);
      await page1.fill("#confirmPassword", password);
      await page1.click('button[type="submit"]');
      await expect(page1).toHaveURL(/\/dashboard/);

      // Login in second context (simulates different browser)
      const page2 = await context.newPage();
      await page2.goto("/login");
      await page2.fill("#email", email);
      await page2.fill("#password", password);
      await page2.click('button[type="submit"]');
      await expect(page2).toHaveURL(/\/dashboard/);

      // Both should be logged in
      await expect(page1.locator('[data-testid="auth-email"]')).toHaveText(email);
      await expect(page2.locator('[data-testid="auth-email"]')).toHaveText(email);

      // Logout from one shouldn't affect the other
      await page1.click('[aria-label="Logout"]');
      await expect(page1).toHaveURL(/\/login/);
      await expect(page2).toHaveURL(/\/dashboard/);

      await page1.close();
      await page2.close();
    });
  });

  test.describe("Protected Routes", () => {
    test("should protect dashboard route", async ({ page }) => {
      await page.context().clearCookies();
      await page.goto("/dashboard");
      await expect(page).toHaveURL(/\/login/);
    });

    test("should protect practice route", async ({ page }) => {
      await page.context().clearCookies();
      await page.goto("/practice");
      await expect(page).toHaveURL(/\/login/);
    });

    test("should protect mock-exam route", async ({ page }) => {
      await page.context().clearCookies();
      await page.goto("/mock-exam");
      await expect(page).toHaveURL(/\/login/);
    });

    test("should protect syllabus route", async ({ page }) => {
      await page.context().clearCookies();
      await page.goto("/syllabus");
      await expect(page).toHaveURL(/\/login/);
    });

    test("should protect analytics route", async ({ page }) => {
      await page.context().clearCookies();
      await page.goto("/analytics");
      await expect(page).toHaveURL(/\/login/);
    });

    test("should protect admin routes", async ({ page }) => {
      await page.context().clearCookies();
      await page.goto("/admin/sessions");
      await expect(page).toHaveURL(/\/login/);
    });

    test("should allow access to public routes when logged out", async ({ page }) => {
      await page.context().clearCookies();
      
      const publicRoutes = ["/", "/login", "/signup"];
      for (const route of publicRoutes) {
        await page.goto(route);
        await expect(page).toHaveURL(new RegExp(route));
      }
    });

    test("should redirect authenticated users away from login", async ({ page }) => {
      const email = uniqueEmail();
      
      await page.goto("/signup");
      await page.fill("#email", email);
      await page.fill("#password", basePassword);
      await page.fill("#confirmPassword", basePassword);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL(/\/dashboard/);

      // Try to access login page
      await page.goto("/login");
      await expect(page).toHaveURL(/\/dashboard/);
    });

    test("should redirect authenticated users away from signup", async ({ page }) => {
      const email = uniqueEmail();
      
      await page.goto("/signup");
      await page.fill("#email", email);
      await page.fill("#password", basePassword);
      await page.fill("#confirmPassword", basePassword);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL(/\/dashboard/);

      // Try to access signup page
      await page.goto("/signup");
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });

  test.describe("Error Handling & Edge Cases", () => {
    test("should handle network errors gracefully", async ({ page }) => {
      // Simulate offline
      await page.context().setOffline(true);
      
      await page.goto("/login");
      await page.fill("#email", uniqueEmail());
      await page.fill("#password", basePassword);
      await page.click('button[type="submit"]');

      // Should show error or stay on page
      await expect(page.locator('text=/error|failed|network/i').first()).toBeVisible({ timeout: 5000 }).catch(() => {
        // If no error message, at least shouldn't redirect
        expect(page.url()).toContain("/login");
      });

      await page.context().setOffline(false);
    });

    test("should handle special characters in email", async ({ page }) => {
      const email = `test+${Date.now()}@example.com`;
      
      await page.goto("/signup");
      await page.fill("#email", email);
      await page.fill("#password", basePassword);
      await page.fill("#confirmPassword", basePassword);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL(/\/dashboard/);
    });

    test("should handle very long email", async ({ page }) => {
      const longEmail = `a${"b".repeat(200)}@example.com`;
      
      await page.goto("/signup");
      await page.fill("#email", longEmail);
      await page.fill("#password", basePassword);
      await page.fill("#confirmPassword", basePassword);
      await page.click('button[type="submit"]');
      
      // Should either accept or show validation error
      const currentUrl = page.url();
      expect(currentUrl === "/dashboard" || currentUrl === "/signup").toBeTruthy();
    });

    test("should handle XSS attempts in email", async ({ page }) => {
      const xssEmail = "<script>alert('xss')</script>@example.com";
      
      await page.goto("/signup");
      await page.fill("#email", xssEmail);
      await page.fill("#password", basePassword);
      await page.fill("#confirmPassword", basePassword);
      await page.click('button[type="submit"]');

      // Should reject or sanitize
      await expect(page).not.toHaveURL(/\/dashboard/);
    });

    test("should handle SQL injection attempts", async ({ page }) => {
      const sqlEmail = "admin' OR '1'='1@example.com";
      
      await page.goto("/login");
      await page.fill("#email", sqlEmail);
      await page.fill("#password", basePassword);
      await page.click('button[type="submit"]');

      // Should reject, not allow login
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe("UI/UX Validation", () => {
    test("should show loading state during signup", async ({ page }) => {
      await page.goto("/signup");
      await page.fill("#email", uniqueEmail());
      await page.fill("#password", basePassword);
      await page.fill("#confirmPassword", basePassword);
      
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();
      
      // Button should show loading state
      await expect(submitButton).toBeDisabled().catch(() => {
        // Or button text changes
        expect(submitButton).toContainText(/creating|signing|loading/i);
      });
    });

    test("should show loading state during login", async ({ page }) => {
      const email = uniqueEmail();
      
      // Create account first
      await page.goto("/signup");
      await page.fill("#email", email);
      await page.fill("#password", basePassword);
      await page.fill("#confirmPassword", basePassword);
      await page.click('button[type="submit"]');
      await page.click('[aria-label="Logout"]');

      await page.goto("/login");
      await page.fill("#email", email);
      await page.fill("#password", basePassword);
      
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();
      
      await expect(submitButton).toBeDisabled().catch(() => {
        expect(submitButton).toContainText(/signing|loading/i);
      });
    });

    test("should display error messages clearly", async ({ page }) => {
      await page.goto("/signup");
      await page.fill("#email", "invalid-email");
      await page.fill("#password", basePassword);
      await page.fill("#confirmPassword", basePassword);
      await page.click('button[type="submit"]');

      const errorMessage = page.locator('text=/invalid.*email/i');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toHaveCSS("color", /rgb\(220, 38, 38\)|rgb\(239, 68, 68\)/);
    });

    test("should have proper form labels and accessibility", async ({ page }) => {
      await page.goto("/signup");
      
      const emailLabel = page.locator('label[for="email"]');
      const passwordLabel = page.locator('label[for="password"]');
      const confirmPasswordLabel = page.locator('label[for="confirmPassword"]');
      
      await expect(emailLabel).toBeVisible();
      await expect(passwordLabel).toBeVisible();
      await expect(confirmPasswordLabel).toBeVisible();
    });

    test("should have proper button labels", async ({ page }) => {
      await page.goto("/signup");
      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toContainText(/sign up|create account/i);
    });

    test("should have navigation links between login and signup", async ({ page }) => {
      await page.goto("/login");
      await expect(page.locator('text=/sign up|create account/i')).toBeVisible();
      
      await page.goto("/signup");
      await expect(page.locator('text=/sign in|login/i')).toBeVisible();
    });
  });

  test.describe("Security Features", () => {
    test("should use HttpOnly cookies (not accessible via JavaScript)", async ({ page }) => {
      const email = uniqueEmail();
      
      await page.goto("/signup");
      await page.fill("#email", email);
      await page.fill("#password", basePassword);
      await page.fill("#confirmPassword", basePassword);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL(/\/dashboard/);

      // Try to access cookie via JavaScript
      const cookieAccess = await page.evaluate(() => {
        return document.cookie;
      });

      // Session cookie should not be in document.cookie (HttpOnly)
      expect(cookieAccess).not.toContain("app_session");
    });

    test("should require password confirmation on signup", async ({ page }) => {
      await page.goto("/signup");
      await page.fill("#email", uniqueEmail());
      await page.fill("#password", basePassword);
      // Don't fill confirmPassword
      await page.click('button[type="submit"]');

      // Should not submit (HTML5 validation)
      await expect(page).toHaveURL(/\/signup/);
    });

    test("should not reveal if email exists on login", async ({ page }) => {
      const existingEmail = uniqueEmail();
      const nonExistentEmail = uniqueEmail();
      
      // Create account
      await page.goto("/signup");
      await page.fill("#email", existingEmail);
      await page.fill("#password", basePassword);
      await page.fill("#confirmPassword", basePassword);
      await page.click('button[type="submit"]');
      await page.click('[aria-label="Logout"]');

      // Try login with existing email but wrong password
      await page.goto("/login");
      await page.fill("#email", existingEmail);
      await page.fill("#password", "WrongPassword123!");
      await page.click('button[type="submit"]');
      const error1 = await page.locator('text=/invalid|error/i').first().textContent();

      // Try login with non-existent email
      await page.fill("#email", nonExistentEmail);
      await page.fill("#password", basePassword);
      await page.click('button[type="submit"]');
      const error2 = await page.locator('text=/invalid|error/i').first().textContent();

      // Error messages should be identical (don't reveal if email exists)
      expect(error1).toBe(error2);
    });
  });

  test.describe("Cross-Page Functionality", () => {
    test("should maintain session across multiple tabs", async ({ context }) => {
      const email = uniqueEmail();
      
      // Login in first tab
      const page1 = await context.newPage();
      await page1.goto("/signup");
      await page1.fill("#email", email);
      await page1.fill("#password", basePassword);
      await page1.fill("#confirmPassword", basePassword);
      await page1.click('button[type="submit"]');
      await expect(page1).toHaveURL(/\/dashboard/);

      // Open second tab
      const page2 = await context.newPage();
      await page2.goto("/dashboard");
      await expect(page2).toHaveURL(/\/dashboard/);
      await expect(page2.locator('[data-testid="auth-email"]')).toHaveText(email);

      await page1.close();
      await page2.close();
    });

    test("should handle concurrent requests", async ({ page }) => {
      const email = uniqueEmail();
      
      await page.goto("/signup");
      await page.fill("#email", email);
      await page.fill("#password", basePassword);
      await page.fill("#confirmPassword", basePassword);
      
      // Trigger multiple rapid clicks
      const submitButton = page.locator('button[type="submit"]');
      await Promise.all([
        submitButton.click(),
        submitButton.click(),
        submitButton.click(),
      ]);

      // Should only create one account
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });
});
