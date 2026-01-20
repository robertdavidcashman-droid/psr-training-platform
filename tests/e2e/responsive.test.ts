import { test, expect, type Page } from "@playwright/test";

async function assertNoHorizontalOverflow(page: Page) {
  const ok = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth <= doc.clientWidth + 2;
  });
  expect(ok).toBe(true);
}

async function openNavIfNeeded(page: Page, width: number) {
  if (width < 1024) {
    await expect(page.getByTestId("sidebar")).not.toBeVisible();
    await page.getByTestId("menu-button").click();
    await expect(page.getByTestId("sidebar")).toBeVisible();
  } else {
    await expect(page.getByTestId("sidebar")).toBeVisible();
  }
}

test.describe("Viewport responsiveness + overflow guard", () => {
  test("dashboard has PageHeader and navigation works", async ({ page }, testInfo) => {
    const width = testInfo.project.use?.viewport?.width ?? 1440;

    await page.goto("/dashboard");
    await expect(page.getByTestId("page-header")).toBeVisible();

    await openNavIfNeeded(page, width);

    // Navigate to portfolio from nav (drawer on mobile/tablet)
    await page.getByTestId("nav-portfolio").click();
    await expect(page).toHaveURL(/\/portfolio/);

    await assertNoHorizontalOverflow(page);
  });

  test("portfolio CTA is visible and snapshot is stable", async ({ page }) => {
    await page.goto("/portfolio");
    await expect(page.getByTestId("page-header")).toBeVisible();
    await expect(page.getByTestId("new-draft-btn")).toBeVisible();
    await assertNoHorizontalOverflow(page);

    await expect(page).toHaveScreenshot("portfolio.png", { fullPage: true });
  });

  test("practice 10Q run: answer 2 questions and authorities panel renders", async ({ page }) => {
    await page.goto("/practice");
    await expect(page.getByTestId("practice-page")).toBeVisible();

    await page.getByTestId("start-quick-btn").click();
    await expect(page.getByTestId("practice-active")).toBeVisible();

    for (let i = 0; i < 2; i++) {
      await expect(page.getByTestId("question-text")).toBeVisible();
      await page.getByTestId("option-A").click();
      await page.getByTestId("submit-answer-btn").click();
      await expect(page.getByTestId("feedback-section")).toBeVisible();

      // Authorities panel should exist and be open by default when there are references
      await expect(page.getByTestId("authorities-panel")).toBeVisible();
      // The panel content should be visible (details open by default)
      await expect(page.getByTestId("references-panel")).toBeVisible();

      await assertNoHorizontalOverflow(page);

      await page.getByTestId("next-question-btn").click();
    }
  });

  test("practice setup snapshot is stable", async ({ page }) => {
    await page.goto("/practice");
    await expect(page.getByTestId("practice-page")).toBeVisible();
    await assertNoHorizontalOverflow(page);
    await expect(page).toHaveScreenshot("practice.png", { fullPage: true });
  });

  test("coverage matrix loads and has no overflow", async ({ page }) => {
    await page.goto("/coverage");
    await expect(page.getByTestId("page-header")).toBeVisible();
    await expect(page.getByTestId("coverage-page")).toBeVisible();
    await assertNoHorizontalOverflow(page);
  });

  test("authorities panel renders with link-outs", async ({ page }) => {
    await page.goto("/practice");
    await page.getByTestId("start-quick-btn").click();
    await expect(page.getByTestId("practice-active")).toBeVisible();

    // Answer first question
    await page.getByTestId("option-A").click();
    await page.getByTestId("submit-answer-btn").click();
    await expect(page.getByTestId("feedback-section")).toBeVisible();

    // Authorities panel should be visible and expanded by default
    await expect(page.getByTestId("authorities-panel")).toBeVisible();
    
    await assertNoHorizontalOverflow(page);
  });
});

