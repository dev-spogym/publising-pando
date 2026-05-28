import { expect, test } from "@playwright/test";
import { dialogs, screens } from "../../app/data/registry";

test("login supports role selection and navigates to member list", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByText("SCR-100")).toBeVisible();
  await expect(page.getByText("Pando CRM Admin V1")).toBeVisible();
  await page.getByRole("button", { name: "로그인" }).click();
  await expect(page).toHaveURL(/\/members\/?$/);
  await expect(page.getByText("SCR-M001")).toBeVisible();
});

test("all V1 D01-D11 SCR routes render their document id", async ({ page }) => {
  for (const screen of screens) {
    await page.goto(screen.route);
    await expect(page.getByText(screen.id).first()).toBeVisible();
    await expect(page.getByText(screen.title).first()).toBeVisible();
  }
});

test("all DLG definitions are reachable from at least one screen", async ({ page }) => {
  for (const dialog of dialogs) {
    const host = screens.find((screen) => screen.dialogs.includes(dialog.id));
    expect(host, `${dialog.id} host screen`).toBeTruthy();
    await page.goto(host!.route);
    await page.locator(`[data-dialog-id="${dialog.id}"]`).first().click();
    await expect(page.getByTestId("runtime-dialog")).toBeVisible();
    await expect(page.getByText(dialog.id).last()).toBeVisible();
    await page.getByRole("button", { name: "닫기" }).click();
  }
});

test("protected owner action is permission-gated for staff", async ({ page }) => {
  await page.goto("/members/merge");
  await page.getByRole("combobox").nth(1).click();
  await page.getByRole("option", { name: "일반 직원" }).click();
  await expect(page.getByRole("button", { name: /회원 병합 확인/ }).first()).toBeDisabled();
});
