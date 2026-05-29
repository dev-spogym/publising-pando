import { expect, test } from "@playwright/test";

for (const route of ["/login", "/members/detail", "/products/p001", "/dashboard/builder"] as const) {
  test(`Cross-browser smoke: ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.getByRole("main")).toBeVisible();
    if (route !== "/login") {
      await expect(page.getByRole("button", { name: "문서/계약" })).toBeVisible();
    }
  });
}
