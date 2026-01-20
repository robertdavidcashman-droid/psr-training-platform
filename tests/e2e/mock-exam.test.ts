import { test, expect } from "@playwright/test";

test.describe("Mock Exam", () => {
  test("should complete a short mock exam", async ({ page }) => {
    await page.goto("/mock-exam");

    // Should see exam setup
    await expect(page.getByTestId("mock-exam-page")).toBeVisible();

    // Start short exam (5 questions)
    await page.getByTestId("exam-mode-short").click();

    // Should be in active exam mode
    await expect(page.getByTestId("mock-exam-active")).toBeVisible();

    // Answer 5 questions
    for (let i = 0; i < 5; i++) {
      // Wait for question to load
      await expect(page.getByTestId("exam-question-text")).toBeVisible();

      // Select an option
      await page.getByTestId("exam-option-a").click();

      // Navigate to next or submit
      if (i < 4) {
        await page.getByTestId("exam-next-btn").click();
      }
    }

    // Submit exam
    await page.getByTestId("submit-exam-btn").click();

    // Should show results
    await expect(page.getByTestId("mock-exam-complete")).toBeVisible();
  });

  test("should display timer during exam", async ({ page }) => {
    await page.goto("/mock-exam");
    await page.getByTestId("exam-mode-short").click();

    // Timer should be visible
    await expect(page.getByText(/\d:\d{2}/)).toBeVisible();
  });

  test("should allow question navigation", async ({ page }) => {
    await page.goto("/mock-exam");
    await page.getByTestId("exam-mode-short").click();

    // Navigate to question 2
    await page.getByTestId("nav-q-1").click();

    // Should show question 2
    await expect(page.getByText("Question 2 of 5")).toBeVisible();
  });
});
