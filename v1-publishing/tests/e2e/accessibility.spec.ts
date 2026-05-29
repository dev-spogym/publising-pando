import { expect, test } from "@playwright/test";

const routes = ["/members/detail", "/products/p001", "/dashboard/builder"];

test.describe("Accessibility Test — keyboard, landmarks, dialog semantics", () => {
  for (const route of routes) {
    test(`${route} exposes main landmark and keyboard-reachable support drawer`, async ({ page }) => {
      await page.goto(route);
      await expect(page.getByRole("main")).toBeVisible();
      await page.keyboard.press("Tab");
      await expect(page.locator(":focus")).toBeVisible();

      await page.getByRole("button", { name: "문서/계약" }).focus();
      await expect(page.getByRole("button", { name: "문서/계약" })).toBeFocused();
      await page.keyboard.press("Enter");
      const drawer = page.getByTestId("screen-support-drawer");
      await expect(drawer).toBeVisible();
      await expect(drawer.getByRole("button", { name: "닫기", exact: true })).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(drawer).not.toBeVisible();
    });
  }

  test("runtime DLG uses dialog role and can close by keyboard", async ({ page }) => {
    await page.goto("/members/detail");
    await page.getByRole("button", { name: "문서/계약" }).click();
    await page.getByTestId("screen-support-drawer").locator("[data-dialog-id]").first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
});
