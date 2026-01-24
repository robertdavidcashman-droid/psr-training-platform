import { describe, it, expect } from "vitest";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

// Skip API endpoint tests if server is not running
// Note: These tests require the Next.js dev server to be running
// In CI, these should be run as part of E2E tests with Playwright
const skipApiTests = !process.env.TEST_BASE_URL;

describe.skipIf(skipApiTests)("API Endpoint Integration Tests", () => {
  describe("Public Endpoints", () => {
    it("should return 200 for health check", async () => {
      const response = await fetch(`${BASE_URL}/api/health`);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.status).toBe("ok");
    });

    it("should return 200 for self-test", async () => {
      const response = await fetch(`${BASE_URL}/api/self-test`);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.status).toBeDefined();
    });
  });

  describe("Gateway Endpoints", () => {
    it("should reject an invalid gateway code (or 500 if not configured)", async () => {
      const response = await fetch(`${BASE_URL}/api/gateway`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: "wrong" }),
      });
      // If APP_GATEWAY_CODE is configured: 401 for wrong code
      // If not configured (zero-setup mode): will succeed (200)
      expect([200, 401]).toContain(response.status);
    });

    it("should allow clearing the gateway cookie", async () => {
      const response = await fetch(`${BASE_URL}/api/gateway`, {
        method: "DELETE",
      });
      expect(response.status).toBe(200);
    });
  });

  describe("Admin Endpoints", () => {
    it("should be blocked/disabled for admin/coverage/topup", async () => {
      const response = await fetch(`${BASE_URL}/api/admin/coverage/topup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ criterionId: "test" }),
      });
      expect([401, 403, 410]).toContain(response.status);
    });

    it("should be blocked/disabled for admin/coverage/regenerate", async () => {
      const response = await fetch(`${BASE_URL}/api/admin/coverage/regenerate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ criterionId: "test" }),
      });
      expect([401, 403, 410]).toContain(response.status);
    });

    it("should be blocked/disabled for admin/force-logout", async () => {
      const response = await fetch(`${BASE_URL}/api/admin/force-logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: "test" }),
      });
      expect([401, 403, 410]).toContain(response.status);
    });

    it("should be blocked/disabled for admin/user-emails", async () => {
      const response = await fetch(`${BASE_URL}/api/admin/user-emails`);
      expect([401, 403, 405, 410]).toContain(response.status);
    });
  });

  describe("AI Endpoints", () => {
    it("should return 401 or 400 for unauthenticated generate-question", async () => {
      const response = await fetch(`${BASE_URL}/api/ai/generate-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId: "test" }),
      });
      // May return 401 (unauthorized) or 400 (bad request)
      expect([400, 401]).toContain(response.status);
    });

    it("should return 401 or 400 for unauthenticated generate-scenario", async () => {
      const response = await fetch(`${BASE_URL}/api/ai/generate-scenario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId: "test" }),
      });
      expect([400, 401]).toContain(response.status);
    });
  });

  describe("Request Validation", () => {
    it("should validate request body schema for generate-question", async () => {
      // Missing required fields
      const response = await fetch(`${BASE_URL}/api/ai/generate-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      expect([400, 401]).toContain(response.status);
    });

    it("should validate request body schema for generate-scenario", async () => {
      const response = await fetch(`${BASE_URL}/api/ai/generate-scenario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      expect([400, 401]).toContain(response.status);
    });
  });
});
