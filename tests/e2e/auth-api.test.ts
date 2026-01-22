import { test, expect } from "@playwright/test";

/**
 * API-level authentication tests
 * These test the API endpoints directly
 */

const TEST_EMAIL = process.env.TEST_EMAIL || "test@example.com";
const TEST_PASSWORD = process.env.TEST_PASSWORD || "test-password";

test.describe("Authentication API", () => {
  test.describe("Session Start", () => {
    test("should require authentication", async ({ request }) => {
      const response = await request.post("/api/auth/session-start");
      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.error).toBe("Unauthorized");
    });

    test("should create session for authenticated user", async ({ page, request }) => {
      test.skip(!TEST_PASSWORD || TEST_PASSWORD === "test-password", "Test credentials not configured");

      // Login via browser to get cookies
      await page.goto("/login");
      await page.getByLabel("Email").fill(TEST_EMAIL);
      await page.getByLabel("Password").fill(TEST_PASSWORD);
      await page.getByRole("button", { name: "Sign In" }).click();
      await page.waitForURL("**/dashboard", { timeout: 10000 });

      // Get cookies from browser context
      const cookies = await page.context().cookies();
      const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join("; ");

      // Call session-start API with cookies
      const response = await request.post("/api/auth/session-start", {
        headers: {
          Cookie: cookieHeader,
        },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.success || body.sessionId).toBeTruthy();
    });
  });

  test.describe("Session Ping", () => {
    test("should require authentication", async ({ request }) => {
      const response = await request.post("/api/auth/ping");
      expect(response.status()).toBe(401);
    });

    test("should update last_seen_at for authenticated user", async ({ page, request }) => {
      test.skip(!TEST_PASSWORD || TEST_PASSWORD === "test-password", "Test credentials not configured");

      // Login
      await page.goto("/login");
      await page.getByLabel("Email").fill(TEST_EMAIL);
      await page.getByLabel("Password").fill(TEST_PASSWORD);
      await page.getByRole("button", { name: "Sign In" }).click();
      await page.waitForURL("**/dashboard", { timeout: 10000 });

      // Wait for session to be created
      await page.waitForTimeout(2000);

      // Get cookies
      const cookies = await page.context().cookies();
      const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join("; ");

      // Call ping endpoint
      const response = await request.post("/api/auth/ping", {
        headers: {
          Cookie: cookieHeader,
        },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
    });
  });

  test.describe("Session End", () => {
    test("should allow unauthenticated call (graceful handling)", async ({ request }) => {
      const response = await request.post("/api/auth/session-end");
      // Should return 200 even if not logged in (graceful)
      expect(response.status()).toBe(200);
    });

    test("should end session for authenticated user", async ({ page, request }) => {
      test.skip(!TEST_PASSWORD || TEST_PASSWORD === "test-password", "Test credentials not configured");

      // Login
      await page.goto("/login");
      await page.getByLabel("Email").fill(TEST_EMAIL);
      await page.getByLabel("Password").fill(TEST_PASSWORD);
      await page.getByRole("button", { name: "Sign In" }).click();
      await page.waitForURL("**/dashboard", { timeout: 10000 });

      await page.waitForTimeout(2000);

      // Get cookies
      const cookies = await page.context().cookies();
      const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join("; ");

      // Call session-end
      const response = await request.post("/api/auth/session-end", {
        headers: {
          Cookie: cookieHeader,
        },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
    });
  });

  test.describe("Logout", () => {
    test("should logout authenticated user", async ({ page, request }) => {
      test.skip(!TEST_PASSWORD || TEST_PASSWORD === "test-password", "Test credentials not configured");

      // Login
      await page.goto("/login");
      await page.getByLabel("Email").fill(TEST_EMAIL);
      await page.getByLabel("Password").fill(TEST_PASSWORD);
      await page.getByRole("button", { name: "Sign In" }).click();
      await page.waitForURL("**/dashboard", { timeout: 10000 });

      await page.waitForTimeout(2000);

      // Get cookies
      const cookies = await page.context().cookies();
      const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join("; ");

      // Call logout
      const response = await request.post("/api/auth/logout", {
        headers: {
          Cookie: cookieHeader,
        },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
    });
  });

  test.describe("Admin Force Logout", () => {
    test("should require authentication", async ({ request }) => {
      const response = await request.post("/api/admin/force-logout", {
        data: { sessionId: "test-id" },
      });
      expect(response.status()).toBe(401);
    });

    test("should require admin role", async ({ page, request }) => {
      test.skip(!TEST_PASSWORD || TEST_PASSWORD === "test-password", "Test credentials not configured");

      // Login as regular user
      await page.goto("/login");
      await page.getByLabel("Email").fill(TEST_EMAIL);
      await page.getByLabel("Password").fill(TEST_PASSWORD);
      await page.getByRole("button", { name: "Sign In" }).click();
      await page.waitForURL("**/dashboard", { timeout: 10000 });

      await page.waitForTimeout(2000);

      // Get cookies
      const cookies = await page.context().cookies();
      const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join("; ");

      // Try to force logout (should fail - not admin)
      const response = await request.post("/api/admin/force-logout", {
        headers: {
          Cookie: cookieHeader,
        },
        data: { sessionId: "test-id" },
      });

      expect(response.status()).toBe(403);
      const body = await response.json();
      expect(body.error).toBe("Forbidden");
    });
  });
});
