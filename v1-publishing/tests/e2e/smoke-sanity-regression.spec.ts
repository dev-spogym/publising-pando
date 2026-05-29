import { expect, test } from "@playwright/test";

test.describe("Smoke Test — publishing shell basics", () => {
  test("login, routing shell, and global support drawer work", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("SCR-100")).toBeVisible();
    await page.getByRole("button", { name: "로그인" }).click();
    await expect(page).toHaveURL(/\/members\/?$/);
    await expect(page.getByRole("button", { name: "문서/계약" })).toBeVisible();
    await page.getByRole("button", { name: "문서/계약" }).click();
    await expect(page.getByTestId("screen-support-drawer")).toContainText("퍼블리싱 인수 기준");
  });
});

test.describe("Sanity Test — representative feature checks", () => {
  test("member detail and product management core flows remain usable", async ({ page }) => {
    await page.goto("/members/detail");
    await expect(page.getByTestId("member-detail-cockpit")).toBeVisible();
    await page.getByRole("tab", { name: /결제내역/ }).click();
    await expect(page.getByText("결제내역 상세").first()).toBeVisible();

    await page.goto("/products/p001");
    await page.getByText(/PT 20회권/).first().click();
    await expect(page.getByText("상품수정").first()).toBeVisible();
    await expect(page.getByText("SCR-P003").first()).toBeVisible();
  });
});

test.describe("Regression Test — previously fixed publishing issues", () => {
  test("deduplicated routes and sales stats hydration regression stay fixed", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    for (const [route, marker] of [
      ["/rooms/assets", "SCR-059"],
      ["/message/auto-alarm/operations", "SCR-072A"],
      ["/settings/iot/access", "SCR-083"],
      ["/locker/fixed-assets", "SCR-I005"],
      ["/sales/stats", "SCR-S004"]
    ] as const) {
      await page.goto(route);
      await expect(page.getByText(marker).first()).toBeVisible();
    }

    expect(consoleErrors.filter((text) => /Hydration failed|validateDOMNesting|server rendered text/i.test(text))).toEqual([]);
  });
});
