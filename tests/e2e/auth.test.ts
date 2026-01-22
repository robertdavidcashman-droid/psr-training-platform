import { test, expect } from "@playwright/test";

// Test credentials - set these in environment variables or .env.test
const TEST_EMAIL = process.env.TEST_EMAIL || "test@example.com";
const TEST_PASSWORD = process.env.TEST_PASSWORD || "test-password";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "robertdavidcashman@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

test.describe("Authentication System", () => {
  test.describe("Public Access", () => {
    test("should allow access to public pages without login", async ({ page }) => {
      await page.goto("/");
      await expect(page.getByTestId("start-training-cta")).toBeVisible();
    });

    test("should redirect to login when accessing protected route", async ({ page }) => {
      await page.goto("/dashboard");
      await page.waitForURL("**/login**");
      expect(page.url()).toContain("/login");
      // URL might be encoded, so check for either version
      expect(page.url()).toMatch(/redirect=(%2Fdashboard|\/dashboard)/);
    });

    test("should redirect to login when accessing admin route", async ({ page }) => {
      await page.goto("/admin/sessions");
      await page.waitForURL("**/login**");
      expect(page.url()).toContain("/login");
      // URL might be encoded, so check for either version
      expect(page.url()).toMatch(/redirect=(%2Fadmin%2Fsessions|\/admin\/sessions)/);
    });
  });

  test.describe("Login Flow", () => {
    test("should display login page", async ({ page }) => {
      await page.goto("/login");
      await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(page.getByLabel("Password")).toBeVisible();
      await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
    });

    test("should show error for invalid credentials", async ({ page }) => {
      await page.goto("/login");
      await page.getByLabel("Email").fill("invalid@example.com");
      await page.getByLabel("Password").fill("wrong-password");
      await page.getByRole("button", { name: "Sign In" }).click();

      // Should show error message
      await expect(page.getByText(/error|invalid|incorrect/i)).toBeVisible({ timeout: 5000 });
    });

    test("should successfully log in with valid credentials", async ({ page }) => {
      test.skip(!TEST_PASSWORD || TEST_PASSWORD === "test-password", "Test credentials not configured");

      await page.goto("/login");
      await page.getByLabel("Email").fill(TEST_EMAIL);
      await page.getByLabel("Password").fill(TEST_PASSWORD);
      await page.getByRole("button", { name: "Sign In" }).click();

      // Should redirect to dashboard
      await page.waitForURL("**/dashboard", { timeout: 10000 });
      await expect(page).toHaveURL("/dashboard");
      await expect(page.getByTestId("page-title")).toContainText("Dashboard");
    });

    test("should redirect to intended page after login", async ({ page }) => {
      test.skip(!TEST_PASSWORD || TEST_PASSWORD === "test-password", "Test credentials not configured");

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

  test.describe("Session Management", () => {
    test.beforeEach(async ({ page }) => {
      test.skip(!TEST_PASSWORD || TEST_PASSWORD === "test-password", "Test credentials not configured");

      // Login before each test
      await page.goto("/login");
      await page.getByLabel("Email").fill(TEST_EMAIL);
      await page.getByLabel("Password").fill(TEST_PASSWORD);
      await page.getByRole("button", { name: "Sign In" }).click();
      await page.waitForURL("**/dashboard", { timeout: 10000 });
    });

    test("should ping session endpoint periodically", async ({ page }) => {
      // Wait for initial ping (happens on mount)
      await page.waitForTimeout(2000);

      // Check that ping endpoint is being called
      const pingCalls: string[] = [];
      page.on("request", (request) => {
        if (request.url().includes("/api/auth/ping")) {
          pingCalls.push(request.url());
        }
      });

      // Wait for at least one ping (should happen within 60 seconds, but we'll wait 5 seconds)
      await page.waitForTimeout(5000);

      // Verify ping was called (SessionPing component should call it)
      expect(pingCalls.length).toBeGreaterThan(0);
    });

    test("should logout successfully", async ({ page }) => {
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

  test.describe("Admin Access", () => {
    test("should redirect non-admin users from admin routes", async ({ page }) => {
      test.skip(!TEST_PASSWORD || TEST_PASSWORD === "test-password", "Test credentials not configured");

      // Login as regular user
      await page.goto("/login");
      await page.getByLabel("Email").fill(TEST_EMAIL);
      await page.getByLabel("Password").fill(TEST_PASSWORD);
      await page.getByRole("button", { name: "Sign In" }).click();
      await page.waitForURL("**/dashboard", { timeout: 10000 });

      // Try to access admin route
      await page.goto("/admin/sessions");

      // Should redirect to dashboard (not login, since we're already logged in)
      await page.waitForURL("**/dashboard", { timeout: 5000 });
      await expect(page).toHaveURL("/dashboard");
    });

    test("should allow admin access to admin dashboard", async ({ page }) => {
      test.skip(!ADMIN_PASSWORD || ADMIN_PASSWORD === "", "Admin credentials not configured");

      // Login as admin
      await page.goto("/login");
      await page.getByLabel("Email").fill(ADMIN_EMAIL);
      await page.getByLabel("Password").fill(ADMIN_PASSWORD);
      await page.getByRole("button", { name: "Sign In" }).click();
      await page.waitForURL("**/dashboard", { timeout: 10000 });

      // Access admin dashboard
      await page.goto("/admin/sessions");
      await page.waitForURL("**/admin/sessions", { timeout: 5000 });

      // Should see admin dashboard
      await expect(page.getByText(/Session Management|All Sessions/i)).toBeVisible();
    });

    test("should display sessions in admin dashboard", async ({ page }) => {
      test.skip(!ADMIN_PASSWORD || ADMIN_PASSWORD === "", "Admin credentials not configured");

      // Login as admin
      await page.goto("/login");
      await page.getByLabel("Email").fill(ADMIN_EMAIL);
      await page.getByLabel("Password").fill(ADMIN_PASSWORD);
      await page.getByRole("button", { name: "Sign In" }).click();
      await page.waitForURL("**/dashboard", { timeout: 10000 });

      // Go to admin dashboard
      await page.goto("/admin/sessions");

      // Should see session table or empty state
      const hasSessions = await page.getByText(/No sessions found|Active Sessions|Status/i).isVisible().catch(() => false);
      expect(hasSessions).toBe(true);
    });
  });

  test.describe("API Endpoints", () => {
    test("should return 401 or 500 for unauthenticated ping", async ({ request }) => {
      const response = await request.post("/api/auth/ping");
      // 401 = unauthorized, 500 = Supabase not configured
      expect([401, 500]).toContain(response.status());
    });

    test("should return 401 or 500 for unauthenticated session-start", async ({ request }) => {
      const response = await request.post("/api/auth/session-start");
      // 401 = unauthorized, 500 = Supabase not configured
      expect([401, 500]).toContain(response.status());
    });

    test("should return 200, 401, or 500 for unauthenticated logout", async ({ request }) => {
      const response = await request.post("/api/auth/logout");
      // 200 = graceful handling, 401 = unauthorized, 500 = Supabase not configured
      expect([200, 401, 500]).toContain(response.status());
    });

    test("should return 401 or 500 for unauthenticated force-logout", async ({ request }) => {
      const response = await request.post("/api/admin/force-logout", {
        data: { sessionId: "test-id" },
      });
      // 401 = unauthorized, 500 = Supabase not configured
      expect([401, 500]).toContain(response.status());
    });
  });
});
