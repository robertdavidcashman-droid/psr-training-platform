import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should load homepage and redirect to dashboard", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("should navigate to all main pages", async ({ page }) => {
    await page.goto("/dashboard");

    // Check dashboard loads
    await expect(page.getByTestId("page-title")).toContainText("Dashboard");

    // Navigate to Syllabus
    await page.getByTestId("nav-syllabus-map").click();
    await expect(page).toHaveURL("/syllabus");
    await expect(page.getByTestId("syllabus-page")).toBeVisible();

    // Navigate to Practice
    await page.getByTestId("nav-practice").click();
    await expect(page).toHaveURL("/practice");
    await expect(page.getByTestId("practice-page")).toBeVisible();

    // Navigate to Mock Exam
    await page.getByTestId("nav-mock-exam").click();
    await expect(page).toHaveURL("/mock-exam");
    await expect(page.getByTestId("mock-exam-page")).toBeVisible();

    // Navigate to Critical Incidents
    await page.getByTestId("nav-critical-incidents").click();
    await expect(page).toHaveURL("/incidents");
    await expect(page.getByTestId("incidents-page")).toBeVisible();

    // Navigate to Portfolio
    await page.getByTestId("nav-portfolio").click();
    await expect(page).toHaveURL("/portfolio");
    await expect(page.getByTestId("portfolio-page")).toBeVisible();

    // Navigate to Resources
    await page.getByTestId("nav-resources").click();
    await expect(page).toHaveURL("/resources");
    await expect(page.getByTestId("resources-page")).toBeVisible();
  });

  test("should display header stats", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page.getByTestId("streak-display")).toBeVisible();
    await expect(page.getByTestId("xp-display")).toBeVisible();
    await expect(page.getByTestId("level-display")).toBeVisible();
  });

  test("should toggle mobile sidebar", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/dashboard");

    // Sidebar should be hidden on mobile
    await expect(page.getByTestId("sidebar")).not.toBeVisible();

    // Open sidebar
    await page.getByTestId("menu-button").click();
    await expect(page.getByTestId("sidebar")).toBeVisible();

    // Close sidebar
    await page.getByTestId("sidebar-close").click();
    await expect(page.getByTestId("sidebar")).not.toBeVisible();
  });
});
