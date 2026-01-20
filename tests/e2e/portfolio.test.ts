import { test, expect } from "@playwright/test";

test.describe("Portfolio Workbook", () => {
  test("should create and save a portfolio draft", async ({ page }) => {
    await page.goto("/portfolio");

    // Should see portfolio page
    await expect(page.getByTestId("portfolio-page")).toBeVisible();

    // Create new draft
    await page.getByTestId("new-draft-btn").click();

    // Should be in edit mode
    await expect(page.getByTestId("portfolio-edit")).toBeVisible();

    // Edit title
    await page.getByTestId("portfolio-title").fill("Test Case Reflection");

    // Fill in a section
    await page
      .getByTestId("section-clientInstructions")
      .fill("Test client instructions content");

    // Save draft
    await page.getByTestId("save-draft-btn").click();

    // Go back to list
    await page.getByRole("button", { name: /back/i }).click();

    // Should see the draft in the list
    await expect(page.getByText("Test Case Reflection")).toBeVisible();
  });

  test("should persist portfolio draft in localStorage", async ({ page }) => {
    // Create a draft
    await page.goto("/portfolio");
    await page.getByTestId("new-draft-btn").click();
    await page.getByTestId("portfolio-title").fill("Persistence Test");
    await page.getByTestId("save-draft-btn").click();

    // Navigate away and back
    await page.goto("/dashboard");
    await page.goto("/portfolio");

    // Draft should still be there
    await expect(page.getByText("Persistence Test")).toBeVisible();
  });

  test("should export portfolio draft", async ({ page }) => {
    await page.goto("/portfolio");
    await page.getByTestId("new-draft-btn").click();
    await page.getByTestId("portfolio-title").fill("Export Test");
    await page.getByTestId("save-draft-btn").click();

    // Export button should be visible
    await expect(page.getByTestId("export-pdf-btn")).toBeVisible();
  });
});
