import { expect, test, type Page } from "@playwright/test";

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 1000 }
];
const routes = ["/members/detail", "/products/p001", "/dashboard/builder"];

async function visibleOverflowCount(page: Page) {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    return Array.from(document.querySelectorAll("main button, main a, main input, main textarea, main [role='tab'], main [role='dialog']")).filter((element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      if (rect.width === 0 || rect.height === 0 || style.display === "none" || style.visibility === "hidden") return false;
      if (element.closest(".overflow-x-auto, [data-allow-horizontal-scroll='true']")) return false;
      return rect.left < -2 || rect.right > width + 2;
    }).length;
  });
}

test.describe("Responsive Test — mobile/tablet/desktop publishing routes", () => {
  for (const viewport of viewports) {
    for (const route of routes) {
      test(`${viewport.name} ${route} renders key controls without clipped interactive elements`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(route);
        await expect(page.getByRole("main")).toBeVisible();
        await expect(page.getByRole("button", { name: "문서/계약" })).toBeVisible();
        expect(await visibleOverflowCount(page)).toBe(0);
      });
    }
  }
});
