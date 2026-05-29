import { expect, test } from "@playwright/test";

const cases = [
  ["members-detail", "/members/detail"],
  ["products-list", "/products/p001"],
  ["dashboard-builder", "/dashboard/builder"],
  ["support-drawer", "/members/detail?support=1"]
] as const;

test.describe("Visual Regression Test — approved publishing screens", () => {
  for (const [name, route] of cases) {
    test(`${name} matches screenshot baseline`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(route.replace("?support=1", ""));
      if (route.includes("support=1")) await page.getByRole("button", { name: "문서/계약" }).click();
      await expect(page).toHaveScreenshot(`${name}.png`, {
        fullPage: true,
        animations: "disabled",
        caret: "hide",
        maxDiffPixelRatio: 0.02
      });
    });
  }
});
