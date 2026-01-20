import { test, expect, type Page } from "@playwright/test";

const routes: Array<{ path: string; ctaTestId: string }> = [
  { path: "/dashboard", ctaTestId: "start-practice-btn" },
  { path: "/syllabus", ctaTestId: "topic-search" },
  { path: "/practice", ctaTestId: "start-quick-btn" },
  { path: "/mock-exam", ctaTestId: "exam-mode-short" },
  { path: "/incidents", ctaTestId: "scenario-scenario-001" },
  { path: "/portfolio", ctaTestId: "new-draft-btn" },
  { path: "/resources", ctaTestId: "resource-pace-codes-of-practice" },
];

async function assertNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth - doc.clientWidth;
  });
  expect(overflow).toBeLessThanOrEqual(1);
}

test.describe("Responsive smoke (mobile/tablet/desktop)", () => {
  test("base typography is readable", async ({ page }) => {
    await page.goto("/dashboard");
    const fontSizePx = await page.evaluate(() => {
      const size = getComputedStyle(document.body).fontSize;
      return parseFloat(size);
    });
    expect(fontSizePx).toBeGreaterThanOrEqual(15);
  });

  test("sidebar behavior matches viewport", async ({ page }, testInfo) => {
    await page.goto("/dashboard");

    const width = testInfo.project.use?.viewport?.width ?? 1440;

    if (width < 1024) {
      // Mobile/Tablet: drawer closed by default, can open/close
      await expect(page.getByTestId("sidebar")).not.toBeVisible();
      await page.getByTestId("menu-button").click();
      await expect(page.getByTestId("sidebar")).toBeVisible();
      await page.getByTestId("sidebar-close").click();
      await expect(page.getByTestId("sidebar")).not.toBeVisible();
    } else {
      // Desktop: sidebar visible, menu button not required
      await expect(page.getByTestId("sidebar")).toBeVisible();
    }
  });

  for (const route of routes) {
    test(`renders ${route.path} with header and CTA`, async ({ page }) => {
      await page.goto(route.path);

      await expect(page.getByTestId("page-header")).toBeVisible();
      await expect(page.getByTestId("page-title")).toBeVisible();

      await expect(page.getByTestId(route.ctaTestId)).toBeVisible();

      await assertNoHorizontalOverflow(page);
    });
  }
});

