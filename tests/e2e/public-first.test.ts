import { test, expect } from "@playwright/test";

test.describe("Public-First Site (No Sign-In Required)", () => {
  test("home page loads and shows Start Training CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("start-training-cta")).toBeVisible();
    await expect(page.getByTestId("start-training-cta")).toContainText("Start Training");
  });

  test("home page does not show sign-in button", async ({ page }) => {
    await page.goto("/");
    // Should not find any sign-in related elements
    const signInElements = await page.getByText(/sign.?in/i).count();
    expect(signInElements).toBe(0);
  });

  test("practice page is accessible without sign-in", async ({ page }) => {
    await page.goto("/practice");
    await expect(page.getByTestId("practice-page")).toBeVisible();
    // Should be able to start a practice session
    const startButton = page.getByRole("button", { name: /start|begin|practice/i }).first();
    await expect(startButton).toBeVisible();
  });

  test("mock exam is accessible without sign-in", async ({ page }) => {
    await page.goto("/mock-exam");
    await expect(page.getByTestId("mock-exam-page")).toBeVisible();
  });

  test("coverage page is accessible without sign-in", async ({ page }) => {
    await page.goto("/coverage");
    await expect(page.getByTestId("coverage-page")).toBeVisible();
  });

  test("syllabus page is accessible without sign-in", async ({ page }) => {
    await page.goto("/syllabus");
    await expect(page.getByTestId("syllabus-page")).toBeVisible();
  });

  test("incidents page is accessible without sign-in", async ({ page }) => {
    await page.goto("/incidents");
    await expect(page.getByTestId("incidents-page")).toBeVisible();
  });

  test("legal pages are accessible", async ({ page }) => {
    await page.goto("/legal/privacy");
    await expect(page.getByText(/privacy policy/i)).toBeVisible();

    await page.goto("/legal/terms");
    await expect(page.getByText(/terms of service/i)).toBeVisible();

    await page.goto("/legal/disclaimer");
    await expect(page.getByText(/disclaimer/i)).toBeVisible();

    await page.goto("/legal/contact");
    await expect(page.getByText(/contact/i)).toBeVisible();
  });

  test("404 page shows helpful message", async ({ page }) => {
    await page.goto("/nonexistent-page");
    await expect(page.getByText(/404|not found/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /back to home/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /start training/i })).toBeVisible();
  });
});
