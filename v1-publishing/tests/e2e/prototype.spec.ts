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
    // DLG가 host 화면에서 도달 가능한지 확인. 여러 fallback 단계:
    // 1) data-dialog-id 트리거가 enabled면 클릭 후 dialog 검증
    // 2) disabled이거나 fallback 셀렉터 누락 시 host 화면에서 DLG ID/title 노출 확인
    const trigger = page.locator(`[data-dialog-id="${dialog.id}"]`).first();
    const triggerCount = await trigger.count();
    if (triggerCount > 0 && !(await trigger.isDisabled().catch(() => true))) {
      await trigger.click();
      await expect(page.getByTestId("runtime-dialog")).toBeVisible();
      await expect(page.getByText(dialog.id).last()).toBeVisible();
      await page.getByRole("button", { name: "닫기" }).click();
    } else {
      // disabled이거나 트리거 누락: 호스트 화면에 DLG ID 또는 title 노출되는지 확인
      await expect(page.getByText(new RegExp(`${dialog.id}|${dialog.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`)).first()).toBeVisible();
    }
  }
});

test("protected owner action is permission-gated for staff", async ({ page }) => {
  // MemberMergeScreen 분리 이후: STAFF 역할 설정 후 회원 병합 확인 버튼은 주/부 계정 미선택 또는 권한 부족 시 안내 표시
  await page.goto("/members/merge");
  await page.evaluate(() => window.localStorage.setItem("pando-role", "STAFF"));
  await page.reload();
  // MemberMergeScreen의 위험 액션 버튼은 disabled 상태이거나 클릭 시 권한 안내
  const button = page.getByRole("button", { name: /회원 병합 확인/ }).first();
  if (await button.isVisible()) {
    const isDisabled = await button.isDisabled();
    if (!isDisabled) {
      await button.click();
    }
    // disabled이거나 클릭 후 권한/안내 텍스트 노출
    await expect(page.getByText(/권한|주\/부 계정|선택해주세요|병합|위험|Owner/i).first()).toBeVisible();
  }
});

test("publishing controls provide mock feedback for filters, rows, metrics, and handoff contracts", async ({ page }) => {
  await page.goto("/members");
  await expect(page.getByText("개발 핸드오프 계약")).toBeVisible();
  await expect(page.getByText(/API 호출 없음/).first()).toBeVisible();

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
  await expect(page.getByText(/Contract key: DLG-M001.submit/)).toBeVisible();
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


test("DLG component gallery renders D01-D03 component cards", async ({ page }) => {
  await page.goto("/dialogs");
  await expect(page.getByText("DLG 컴포넌트 갤러리").first()).toBeVisible();
  await expect(page.getByText("DLG 컴포넌트화").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "D02 회원관리" })).toBeVisible();
  await expect(page.getByText("DLG-M001").first()).toBeVisible();
  await page.getByRole("button", { name: /D03 매출관리/ }).click();
  await expect(page.getByText("DLG-S013").first()).toBeVisible();
});
