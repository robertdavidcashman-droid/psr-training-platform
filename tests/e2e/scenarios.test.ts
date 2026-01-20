import { test, expect } from "@playwright/test";

test.describe("Critical Incidents", () => {
  test("should complete a scenario with 2 steps", async ({ page }) => {
    await page.goto("/incidents");

    // Should see scenario list
    await expect(page.getByTestId("incidents-page")).toBeVisible();

    // Click first scenario
    await page.getByTestId("scenario-scenario-001").click();

    // Should see briefing
    await expect(page.getByTestId("scenario-briefing")).toBeVisible();

    // Begin scenario
    await page.getByTestId("begin-scenario-btn").click();

    // Should be in active scenario
    await expect(page.getByTestId("scenario-active")).toBeVisible();

    // Complete step 1
    await expect(page.getByTestId("step-content")).toBeVisible();
    await page.getByTestId("choice-b").click();
    await page.getByTestId("submit-choice-btn").click();

    // Should show feedback
    await expect(page.getByTestId("choice-feedback")).toBeVisible();

    // Continue to step 2
    await page.getByTestId("next-step-btn").click();

    // Complete step 2
    await page.getByTestId("choice-a").click();
    await page.getByTestId("submit-choice-btn").click();
    await page.getByTestId("next-step-btn").click();

    // Should show debrief
    await expect(page.getByTestId("scenario-debrief")).toBeVisible();
  });

  test("should display scenario choices", async ({ page }) => {
    await page.goto("/incidents");
    await page.getByTestId("scenario-scenario-001").click();
    await page.getByTestId("begin-scenario-btn").click();

    // Should see choices
    await expect(page.getByTestId("choice-a")).toBeVisible();
    await expect(page.getByTestId("choice-b")).toBeVisible();
  });
});
