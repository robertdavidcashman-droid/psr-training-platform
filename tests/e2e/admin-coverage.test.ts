import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "robertdavidcashman@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

test.describe("Admin Coverage Dashboard E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!ADMIN_PASSWORD || ADMIN_PASSWORD === "", "Admin credentials not configured");

    // Login as admin
    await page.goto("/login");
    await page.getByLabel("Email").fill(ADMIN_EMAIL);
    await page.getByLabel("Password").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.waitForURL("**/dashboard", { timeout: 10000 });
  });

  test("should allow admin to access coverage dashboard", async ({ page }) => {
    await page.goto("/admin/coverage");
    await page.waitForURL("**/admin/coverage", { timeout: 5000 });

    // Should see admin coverage page
    await expect(page.getByText(/Coverage|Gaps|Criteria/i)).toBeVisible();
  });

  test("should display gaps table", async ({ page }) => {
    await page.goto("/admin/coverage");

    // Should see gaps table or empty state
    const hasTable = await page
      .getByText(/No gaps|Gaps|Backlog|Criteria/i)
      .isVisible()
      .catch(() => false);
    expect(hasTable).toBe(true);
  });

  test("should show summary statistics", async ({ page }) => {
    await page.goto("/admin/coverage");

    // Should see summary stats
    const hasStats = await page
      .getByText(/Total|Covered|Missing|Partial/i)
      .isVisible()
      .catch(() => false);
    expect(hasStats).toBe(true);
  });

  test("should handle top-up button click (idempotent)", async ({ page }) => {
    await page.goto("/admin/coverage");

    // Look for top-up button
    const topUpButton = page.getByRole("button", { name: /top.?up|generate/i }).first();
    const buttonExists = await topUpButton.isVisible().catch(() => false);

    if (buttonExists) {
      // Click should not cause errors (even if already compliant)
      await topUpButton.click();
      // Wait a bit for any async operations
      await page.waitForTimeout(2000);
      // Page should still be accessible
      await expect(page.getByText(/Coverage|Gaps/i)).toBeVisible();
    }
  });

  test("should not expose service role keys", async ({ page }) => {
    await page.goto("/admin/coverage");

    // Check page source for service role key patterns
    const pageContent = await page.content();
    const hasServiceKey = pageContent.includes("SUPABASE_SERVICE_ROLE_KEY") ||
      (pageContent.match(/sbp_[a-zA-Z0-9]{100,}/g)?.length ?? 0) > 0;

    expect(hasServiceKey).toBe(false);
  });

  test("should prevent non-admin access", async ({ page }) => {
    // Logout first
    await page.getByTestId("logout-button").click().catch(() => {});
    await page.waitForURL("**/", { timeout: 5000 });

    // Try to access admin route without login
    await page.goto("/admin/coverage");
    // Should redirect to login
    await page.waitForURL("**/login**", { timeout: 5000 });
  });
});
