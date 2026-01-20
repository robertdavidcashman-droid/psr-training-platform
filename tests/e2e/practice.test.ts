import { test, expect } from "@playwright/test";

test.describe("Practice Mode", () => {
  test("should complete a quick practice session", async ({ page }) => {
    await page.goto("/practice");

    // Should see practice setup
    await expect(page.getByTestId("practice-page")).toBeVisible();

    // Start quick practice (10 questions, but we have 20 in seed)
    await page.getByTestId("start-quick-btn").click();

    // Should be in active practice mode
    await expect(page.getByTestId("practice-active")).toBeVisible();

    // Answer 10 questions
    for (let i = 0; i < 10; i++) {
      // Wait for question to load
      await expect(page.getByTestId("question-text")).toBeVisible();

      // Select first option
      await page.getByTestId("option-A").click();

      // Submit answer
      await page.getByTestId("submit-answer-btn").click();

      // Should show feedback
      await expect(page.getByTestId("feedback-section")).toBeVisible();

      // Go to next question or finish
      await page.getByTestId("next-question-btn").click();
    }

    // Should show completion screen
    await expect(page.getByTestId("practice-complete")).toBeVisible();
  });

  test("should display question with options", async ({ page }) => {
    await page.goto("/practice");
    await page.getByTestId("start-quick-btn").click();

    await expect(page.getByTestId("question-text")).toBeVisible();
    await expect(page.getByTestId("option-A")).toBeVisible();
    await expect(page.getByTestId("option-B")).toBeVisible();
  });

  test("should show feedback after answering", async ({ page }) => {
    await page.goto("/practice");
    await page.getByTestId("start-quick-btn").click();

    // Answer a question
    await page.getByTestId("option-A").click();
    await page.getByTestId("submit-answer-btn").click();

    // Check feedback is shown
    await expect(page.getByTestId("feedback-section")).toBeVisible();
  });
});
