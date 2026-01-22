import { describe, it, expect } from "vitest";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

// Skip API endpoint tests if server is not running
// Note: These tests require the Next.js dev server to be running
// In CI, these should be run as part of E2E tests with Playwright
const skipApiTests = !process.env.TEST_BASE_URL && process.env.CI !== "true";

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

  describe("Auth Endpoints", () => {
    it("should return 401 for unauthenticated session-start", async () => {
      const response = await fetch(`${BASE_URL}/api/auth/session-start`, {
        method: "POST",
      });
      expect(response.status).toBe(401);
    });

    it("should return 401 for unauthenticated ping", async () => {
      const response = await fetch(`${BASE_URL}/api/auth/ping`, {
        method: "POST",
      });
      expect(response.status).toBe(401);
    });

    it("should return 401 for unauthenticated session-end", async () => {
      const response = await fetch(`${BASE_URL}/api/auth/session-end`, {
        method: "POST",
      });
      expect(response.status).toBe(401);
    });

    it("should return 200 or 401 for logout (may work without auth)", async () => {
      const response = await fetch(`${BASE_URL}/api/auth/logout`, {
        method: "POST",
      });
      expect([200, 401]).toContain(response.status);
    });
  });

  describe("Admin Endpoints", () => {
    it("should return 401 for unauthenticated admin/coverage/topup", async () => {
      const response = await fetch(`${BASE_URL}/api/admin/coverage/topup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ criterionId: "test" }),
      });
      expect(response.status).toBe(401);
    });

    it("should return 401 for unauthenticated admin/coverage/regenerate", async () => {
      const response = await fetch(`${BASE_URL}/api/admin/coverage/regenerate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ criterionId: "test" }),
      });
      expect(response.status).toBe(401);
    });

    it("should return 401 for unauthenticated admin/force-logout", async () => {
      const response = await fetch(`${BASE_URL}/api/admin/force-logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: "test" }),
      });
      expect(response.status).toBe(401);
    });

    it("should return 401 for unauthenticated admin/user-emails", async () => {
      const response = await fetch(`${BASE_URL}/api/admin/user-emails`);
      expect(response.status).toBe(401);
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
