import { test, expect } from "@playwright/test";

test.describe("API Endpoints", () => {
  test("GET /api/health should return status ok", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.status).toBe("ok");
    expect(data.timestamp).toBeDefined();
    expect(data.version).toBeDefined();
    expect(data.checks).toBeDefined();
    expect(data.checks.envLoaded).toBe(true);
    expect(data.checks.contentLoaded).toBe(true);
  });

  test("GET /api/self-test should pass all tests", async ({ request }) => {
    const response = await request.get("/api/self-test");
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.status).toBe("pass");
    expect(data.tests).toBeDefined();
    expect(Array.isArray(data.tests)).toBe(true);

    // All tests should pass
    data.tests.forEach((t: { name: string; passed: boolean }) => {
      expect(t.passed).toBe(true);
    });
  });

  test("POST /api/ai/generate-question should return question", async ({
    request,
  }) => {
    const response = await request.post("/api/ai/generate-question", {
      data: {
        topicId: "pace-s24-arrest",
      },
    });
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.question).toBeDefined();
    expect(data.question.stem).toBeDefined();
    expect(data.question.options).toBeDefined();
    expect(data.question.references).toBeDefined();
    expect(data.source).toBeDefined();
  });

  test("POST /api/ai/generate-scenario should return scenario", async ({
    request,
  }) => {
    const response = await request.post("/api/ai/generate-scenario", {
      data: {
        topicId: "interview-intervention",
      },
    });
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.scenario).toBeDefined();
    expect(data.scenario.title).toBeDefined();
    expect(data.scenario.steps).toBeDefined();
  });

  test("POST /api/ai/generate-question should validate request", async ({
    request,
  }) => {
    const response = await request.post("/api/ai/generate-question", {
      data: {},
    });
    expect(response.status()).toBe(400);
  });
});
