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

test("운영 lane/필터/상세 버튼은 toast-only가 아니라 화면 상태와 사이드패널로 연결된다", async ({ page }) => {
  await page.goto("/branches");
  const main = page.locator("main");

  await main.getByRole("button", { name: /^감사 로그/ }).first().click();
  await expect(page.getByTestId("scr-092-row-detail-panel")).toBeVisible();
  await expect(page.getByTestId("scr-092-row-detail-panel")).toContainText("감사 로그 운영 lane");
  await expect(page.getByText("감사 로그 운영 lane 선택")).toHaveCount(0);
  await page.getByTestId("scr-092-row-detail-panel").getByRole("button", { name: "닫기" }).last().click();

  await main.getByRole("button", { name: "권역" }).click();
  await expect(main.getByTestId("scr-092-active-state")).toContainText("권역");
  await expect(page.getByTestId("scr-092-row-detail-panel")).toContainText("권역 필터");
  await page.getByTestId("scr-092-row-detail-panel").getByRole("button", { name: "닫기" }).last().click();

  await main.getByRole("button", { name: "상세" }).first().click();
  await expect(page.getByTestId("scr-092-row-detail-panel")).toContainText("개발 연결점");
});

test("공통 mock 알림 액션도 toast-only가 아니라 핸드오프 사이드패널로 남는다", async ({ page }) => {
  await page.goto("/members/grade");
  const main = page.locator("main");

  await main.getByRole("button", { name: "등급", exact: true }).click();
  await expect(page.getByTestId("mock-action-panel")).toBeVisible();
  await expect(page.getByTestId("mock-action-panel")).toContainText("화면 연결 결과");
  await expect(page.getByTestId("mock-action-panel")).toContainText("등급 관리");
  await expect(page.getByTestId("mock-action-panel")).toContainText("개발 연결점");
});

test("사이드바는 admin-pando식 운영 메뉴와 docs4 사이트맵 모드를 전환한다", async ({ page }) => {
  await page.goto("/members");
  const sidebar = page.locator("aside").first();

  await expect(sidebar.getByTestId("sidebar-mode-ops")).toBeVisible();
  await expect(sidebar.getByText("운영 플로우")).toBeVisible();
  await expect(sidebar.getByText("상담→등록→결제")).toBeVisible();
  await expect(sidebar.getByRole("button", { name: /회원/ })).toBeVisible();
  await expect(sidebar.getByRole("link", { name: /회원 목록/ })).toBeVisible();

  await sidebar.getByTestId("sidebar-mode-sitemap").click();
  await expect(sidebar.getByText("회원관리")).toBeVisible();
  await expect(sidebar.getByText("매출관리")).toBeVisible();
  await expect(sidebar.getByRole("link", { name: /회원 목록/ })).toBeVisible();

  await sidebar.getByTestId("sidebar-mode-ops").click();
  await expect(sidebar.getByText("운영 플로우")).toBeVisible();
  await expect(sidebar.getByText("회원관리")).toHaveCount(0);
});
