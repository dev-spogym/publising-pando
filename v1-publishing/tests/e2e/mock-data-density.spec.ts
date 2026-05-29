import { expect, test } from "@playwright/test";

test("SCR-092 지점 관리는 운영 가능한 밀도의 mock 지점 원장을 보여준다", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/branches");

  const main = page.locator("main");
  await expect(main.getByText("SCR-092").first()).toBeVisible();
  await expect(main.getByText("10").first()).toBeVisible();

  for (const branchName of ["강남점", "광화문 본점", "판교점", "여의도점", "송도점", "부산 센텀점"]) {
    await expect(main.getByText(branchName).first()).toBeVisible();
  }

  await expect(main.locator("tbody tr")).toHaveCount(10);
  await expect(main.getByText(/운영 중|오픈 예정|임시휴업/).first()).toBeVisible();
});

test("상단 전역 지점 선택은 외곽 컨트롤 하나로만 보인다", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/branches");

  const wrapper = page.getByTestId("global-branch-selector");
  const trigger = page.getByTestId("global-branch-trigger");
  await expect(wrapper).toBeVisible();
  await expect(trigger).toBeVisible();
  await expect(page.locator("aside").getByText("광화문 본점", { exact: true })).toHaveCount(0);
  await expect(page.locator("aside").getByText("지점 기준은 상단 전역 선택에서만 변경됩니다.")).toBeVisible();
  const triggerChrome = await trigger.evaluate((element) => {
    const style = window.getComputedStyle(element);
    return {
      borderTopWidth: style.borderTopWidth,
      borderRightWidth: style.borderRightWidth,
      borderBottomWidth: style.borderBottomWidth,
      borderLeftWidth: style.borderLeftWidth,
      backgroundColor: style.backgroundColor,
    };
  });
  expect(triggerChrome).toEqual({
    borderTopWidth: "0px",
    borderRightWidth: "0px",
    borderBottomWidth: "0px",
    borderLeftWidth: "0px",
    backgroundColor: "rgba(0, 0, 0, 0)",
  });

  await trigger.click();
  await expect(page.getByRole("option", { name: "광화문 본점" })).toBeVisible();
  await expect(page.getByRole("option", { name: "부산 센텀점" })).toBeVisible();
});

test("문서 row가 부족한 D10/D11 generic 화면도 8개 mock 행으로 채워진다", async ({ page }) => {
  for (const route of ["/audit-log", "/reports", "/locker/fixed-assets"]) {
    await page.goto(route);
    await expect(page.locator("main").locator("tbody tr").first()).toBeVisible();
    await expect(page.locator("main").locator("tbody tr")).toHaveCount(8);
    await expect(page.locator("main").getByText(/정상|확인 필요|승인대기|보류|운영 중/).first()).toBeVisible();
  }
});
