import { expect, test } from "@playwright/test";
import { dialogs, screens } from "../../app/data/registry";

test("login supports role selection and navigates to member list", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByText("SCR-100")).toBeVisible();
  await expect(page.getByText("Pando CRM Admin V1")).toBeVisible();
  await page.getByRole("button", { name: "로그인" }).click();
  await expect(page).toHaveURL(/\/members\/?$/);
  await expect(page.getByText("SCR-M001", { exact: true }).first()).toBeVisible();
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
  await page.getByRole("button", { name: /회원 병합 확인/ }).first().click();
  await expect(page.getByText(/권한으로는 실행할 수 없습니다/)).toBeVisible();
});

test("publishing controls provide mock feedback for filters, rows, metrics, and handoff contracts", async ({ page }) => {
  await page.goto("/members");
  await expect(page.getByText("개발 핸드오프 계약")).toBeVisible();
  await expect(page.getByText(/GET \/api\/admin\/members/)).toBeVisible();

  await page.getByRole("button", { name: /활성 회원/ }).click();
  await expect(page.getByText(/활성 회원 지표 필터 mock 적용/)).toBeVisible();

  await page.getByRole("button", { name: "활성", exact: true }).click();
  await expect(page.getByText(/활성 필터 chip mock 적용/)).toBeVisible();

  await page.getByPlaceholder("이름·연락처·상품명 통합 검색").fill("박서연");
  await expect(page.getByText("박서연")).toBeVisible();
  await page.getByRole("button", { name: "선택", exact: true }).click();
  await expect(page.getByRole("button", { name: "선택됨", exact: true })).toBeVisible();
  await expect(page.getByText(/선택 1/)).toBeVisible();
  await page.getByRole("button", { name: "선택 작업" }).click();
  await expect(page.getByText(/1개 행으로 일괄 작업 bar mock 표시/)).toBeVisible();
  await page.getByRole("button", { name: "전체 해제" }).click();
  await expect(page.getByText(/필터와 선택 행을 초기화했습니다/)).toBeVisible();
});

test("dialog form edits surface dirty close and submit contract feedback", async ({ page }) => {
  await page.goto("/members");
  await page.locator('[data-dialog-id="DLG-M001"]').first().click();
  await expect(page.getByText(/Contract: POST \/api\/admin\/members\/dialogs\/m001/)).toBeVisible();
  await page.locator("textarea").first().fill("검수용 변경");
  await expect(page.getByText(/상태 dirty/)).toBeVisible();
  await page.getByRole("button", { name: "닫기" }).click();
  await expect(page.getByText(/입력 변경사항을 저장하지 않고 닫았습니다/)).toBeVisible();
});


test("persisted role preferences hydrate without client/server mismatch", async ({ page }) => {
  const hydrationErrors: string[] = [];
  page.on("pageerror", (error) => {
    if (/Hydration failed|server rendered text didn't match/i.test(error.message)) hydrationErrors.push(error.message);
  });
  page.on("console", (message) => {
    if (message.type() === "error" && /Hydration failed|server rendered text didn't match/i.test(message.text())) hydrationErrors.push(message.text());
  });

  await page.goto("/members");
  await page.evaluate(() => {
    window.localStorage.setItem("pando-role", "HQ_ADMIN");
    window.localStorage.setItem("pando-branch", "본사 통합");
  });
  await page.reload();

  await expect(page.getByText("본사 관리자").first()).toBeVisible();
  expect(hydrationErrors).toEqual([]);
});

test("D04-D11 routes use domain-specific publishing layouts", async ({ page }) => {
  const expectations = [
    ["/classes/c001", "캘린더·예약·출석 운영 보드"],
    ["/products/p001", "상품·가격·할인 정책 콘솔"],
    ["/facilities/050", "락커·고장·배정 현황 맵"],
    ["/staff", "직원·근태·급여 운영 워크스페이스"],
    ["/leads", "리드·메시지·쿠폰·캠페인 센터"],
    ["/settings", "센터 정책·권한·자동화 설정"],
    ["/branches", "지점 성과·KPI·감사 로그 대시보드"],
    ["/attendance", "출석·락커·건강 연동 통합 관제"]
  ] as const;

  for (const [route, heading] of expectations) {
    await page.goto(route);
    await expect(page.getByText(heading)).toBeVisible();
    await expect(page.getByText("프론트 상태 명세")).toBeVisible();
  }
});
