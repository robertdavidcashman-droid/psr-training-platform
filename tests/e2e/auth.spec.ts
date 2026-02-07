import { test, expect } from "@playwright/test";

function uniqueEmail(): string {
  return `e2e-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
}

test.describe("Custom auth (email/password + DB sessions)", () => {
  const email = uniqueEmail();
  const password = "TestPassword123!";

  test("signup -> dashboard shows email", async ({ page }) => {
    await page.goto("/signup");
    await page.fill("#email", email);
    await page.fill("#password", password);
    await page.fill("#confirmPassword", password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('[data-testid="auth-email"]')).toHaveText(email);
  });

  test("logout -> redirect to login", async ({ page }) => {
    // ensure logged in from previous test state is not assumed
    await page.goto("/login");
    await page.fill("#email", email);
    await page.fill("#password", password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    await page.click('[aria-label="Logout"]');
    await expect(page).toHaveURL(/\/login/);
  });

  test("login -> dashboard loads -> refresh keeps session", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", email);
    await page.fill("#password", password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('[data-testid="auth-email"]')).toHaveText(email);

    await page.reload();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('[data-testid="auth-email"]')).toHaveText(email);
  });

  test("protected route while logged out redirects to login?next=", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);

    const url = new URL(page.url());
    expect(url.searchParams.get("next")).toBe("/dashboard");
  });
});

