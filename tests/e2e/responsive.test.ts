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

  test("practice 10Q run: answer 2 questions and references panel renders", async ({ page }) => {
    await page.goto("/practice");
    await expect(page.getByTestId("practice-page")).toBeVisible();

    await page.getByTestId("start-quick-btn").click();
    await expect(page.getByTestId("practice-active")).toBeVisible();

    for (let i = 0; i < 2; i++) {
      await expect(page.getByTestId("question-text")).toBeVisible();
      await page.getByTestId("option-A").click();
      await page.getByTestId("submit-answer-btn").click();
      await expect(page.getByTestId("feedback-section")).toBeVisible();

      // References panel should exist (may be empty for non-legal topics).
      await expect(page.getByTestId("references-details")).toBeVisible();
      await page.getByTestId("references-toggle").click();
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
});

