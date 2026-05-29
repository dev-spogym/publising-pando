import { expect, test, type Locator, type Page } from "@playwright/test";

async function assumeOwnerRole(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem("pando-role", "OWNER");
    window.localStorage.setItem("pando-branch", "강남점");
  });
}

async function gotoScreen(page: Page, route: string, screenId: string) {
  await page.goto(route);
  await expect(page).toHaveURL(new RegExp(`${route.replace(/\/$/, "")}/?$`));
  await expect(page.getByText(screenId, { exact: true }).first()).toBeVisible();
}

async function expectRuntimeDialog(
  page: Page,
  dialogId: string,
): Promise<Locator> {
  const dialog = page.getByTestId("runtime-dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText(dialogId);
  return dialog;
}

async function confirmRuntimeDialog(page: Page, actionName: RegExp | string) {
  await page
    .getByTestId("runtime-dialog")
    .getByRole("button", { name: actionName })
    .click();
  await expect(page.getByTestId("runtime-dialog")).toBeHidden();
}

async function expectMockActionPanel(page: Page, screenId: string, route: string) {
  await expect(page.getByTestId("mock-action-panel")).toHaveCount(0);
  await expect(page.getByText(screenId, { exact: true }).first()).toBeVisible();
  await expect(page.locator("body")).toContainText(route);
  return page.locator("main");
}

async function closeMockActionPanel(page: Page) {
  await expect(page.getByTestId("mock-action-panel")).toHaveCount(0);
}

test.beforeEach(async ({ page }) => {
  await assumeOwnerRole(page);
});

test.describe("D04 수업/캘린더 고급 운영 플로우", () => {
  test("SCR-C001 calendar changes visible state, opens DLG-C002, and records the route-bound result", async ({
    page,
  }) => {
    await gotoScreen(page, "/classes/c001", "SCR-C001");

    await expect(page.getByRole("heading", { name: "수업/캘린더" })).toBeVisible();
    await expect(page.getByText(/미승인 일정\s*5건/)).toBeVisible();
    await expect(page.getByText("5월 29일 금")).toBeVisible();
    await expect(page.getByText("조회 일정 1건")).toBeVisible();

    await page.getByRole("button", { name: "수업 관리 760" }).click();
    await expect(page.getByText("수업 관리 (목록)")).toBeVisible();
    await expect(page.getByRole("row", { name: /PT 김민준.*박트레이너/ })).toBeVisible();

    await page.getByRole("button", { name: "일정표" }).click();
    await page
      .locator("aside")
      .getByRole("button", { name: /필라테스 그룹.*정GX.*GX/ })
      .click();
    const dialog = await expectRuntimeDialog(page, "DLG-C002");
    await expect(dialog).toContainText("일정 상세");
    await expect(dialog).toContainText("예약 회원 목록");

    await confirmRuntimeDialog(page, "확인");
    await expect(page.getByText("일정 상세 처리 완료")).toBeVisible();
    const panel = await expectMockActionPanel(page, "SCR-C001", "/classes/c001");
    await expect(panel).toContainText("수업 캘린더");
  });

  test("SCR-C003 bulk schedule applies local filter state before confirming DLG-C008", async ({
    page,
  }) => {
    await gotoScreen(page, "/class-schedule", "SCR-C003");

    await expect(page.getByText("시간표 일괄 등록 작업대")).toBeVisible();
    await page.getByRole("button", { name: /충돌 발견 3건/ }).click();
    await expect(
      page.getByText("충돌 발견 지표 기준으로 시간표 일괄 등록 목록을 재검토합니다."),
    ).toBeVisible();
    await page.getByRole("button", { name: /Step 4.*DLG-C008/ }).click();
    await expect(page.getByText(/Step 4: DLG-C008에서 생성 범위 확정/)).toBeVisible();
    await page.getByLabel("권한·충돌·차감·알림 정책 확인").check();

    await page.locator('[data-dialog-id="DLG-C008"]').first().click();
    const dialog = await expectRuntimeDialog(page, "DLG-C008");
    await expect(dialog).toContainText("일괄 생성 확인");
    await expect(dialog).toContainText("대상 총계");
    await expect(dialog).toContainText("처리 가능");
    await dialog.getByRole("button", { name: /충돌·제외/ }).click();
    await expect(dialog).toContainText("충돌·제외 12건 사유");

    await confirmRuntimeDialog(page, "일괄 실행");
    await expect(page.getByText("일괄 생성 확인 처리 완료")).toBeVisible();
    await expectMockActionPanel(page, "SCR-C003", "/class-schedule");
  });

  test("SCR-C004 template registration opens DLG-C009 and persists a screen-scoped result", async ({
    page,
  }) => {
    await gotoScreen(page, "/class-templates", "SCR-C004");

    await expect(page.getByText("그룹 수업 템플릿 작업대")).toBeVisible();
    await page.getByRole("button", { name: "비활성 포함 보기" }).click();
    await expect(page.getByText("비활성 포함 보기 탭 기준으로 상태를 전환했습니다.")).toBeVisible();
    await page.getByRole("row", { name: /스피닝.*OFF/ }).click();
    await expect(page.getByText(/스피닝 행을 선택했습니다/)).toBeVisible();

    await page.locator('[data-dialog-id="DLG-C009"]').first().click();
    const dialog = await expectRuntimeDialog(page, "DLG-C009");
    await expect(dialog).toContainText("템플릿 등록/수정");
    await expect(dialog).toContainText("기본 정원");
    await dialog.locator("input").first().fill("토요일 체형교정 GX");

    await confirmRuntimeDialog(page, "등록");
    await expect(page.getByText("템플릿 등록/수정 처리 완료")).toBeVisible();
    await expectMockActionPanel(page, "SCR-C004", "/class-templates");
  });

  test("SCR-C006 and SCR-C009 queue panels expose DLG handoffs instead of toast-only actions", async ({
    page,
  }) => {
    await gotoScreen(page, "/instructor-status", "SCR-C006");
    await expect(page.getByText("강사 근무 현황 작업대")).toBeVisible();
    await page.getByRole("row", { name: /박트레이너.*24건/ }).click();
    await expect(page.getByText(/박트레이너 행을 선택했습니다/)).toBeVisible();
    await page.locator('[data-dialog-id="DLG-C010"]').first().click();
    let dialog = await expectRuntimeDialog(page, "DLG-C010");
    await expect(dialog).toContainText("담당 수업 목록");
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("runtime-dialog")).toBeHidden();

    await gotoScreen(page, "/schedule-requests", "SCR-C009");
    await page.locator('[data-dialog-id="DLG-C016"]').first().click();
    dialog = await expectRuntimeDialog(page, "DLG-C016");
    await expect(dialog).toContainText("대안 일정 제시");
    await expect(dialog).toContainText("대안 일정 목록");
    await confirmRuntimeDialog(page, "확인");
    await expectMockActionPanel(page, "SCR-C009", "/schedule-requests");
  });

  test("SCR-C007 and SCR-C008 operational dialogs verify count adjustment and penalty policy state", async ({
    page,
  }) => {
    await gotoScreen(page, "/lesson-counts", "SCR-C007");
    await page.locator('[data-dialog-id="DLG-C012"]').first().click();
    let dialog = await expectRuntimeDialog(page, "DLG-C012");
    await expect(dialog).toContainText("조정 후 예상 잔여 횟수");
    await confirmRuntimeDialog(page, "확인");
    await expectMockActionPanel(page, "SCR-C007", "/lesson-counts");
    await closeMockActionPanel(page);

    await gotoScreen(page, "/penalties", "SCR-C008");
    await page.locator('[data-dialog-id="DLG-C015"]').first().click();
    dialog = await expectRuntimeDialog(page, "DLG-C015");
    await expect(dialog).toContainText("노쇼 자동 페널티 규칙");
    await expect(dialog).toContainText("처리 후 화면 반영");
    await confirmRuntimeDialog(page, "확인");
    await expectMockActionPanel(page, "SCR-C008", "/penalties");
  });

  test("SCR-C011 and SCR-C014 attendance flows keep evidence in dialogs, tables, and local panels", async ({
    page,
  }) => {
    await gotoScreen(page, "/valid-lessons", "SCR-C011");
    await page.locator('[data-dialog-id="DLG-C006"]').first().click();
    const dialog = await expectRuntimeDialog(page, "DLG-C006");
    await expect(dialog).toContainText("서명 패드");
    await expect(dialog).toContainText("회원앱 Push 요청 버튼");
    await confirmRuntimeDialog(page, "확인");
    await expectMockActionPanel(page, "SCR-C011", "/valid-lessons");
    await closeMockActionPanel(page);

    await gotoScreen(page, "/attendance/lesson-completion", "SCR-C014");
    await expect(page.getByRole("row", { name: /PT 정하준.*1\(Push 가능\)/ })).toBeVisible();
    await page.getByRole("row", { name: /필라테스 그룹.*정GX/ }).getByRole("button", { name: "처리" }).click();
    await expect(page.getByText("필라테스 그룹 출석 처리")).toBeVisible();
    const panel = await expectMockActionPanel(
      page,
      "SCR-C014",
      "/attendance/lesson-completion",
    );
    await expect(panel).toContainText("수업 출석/완료 확인");
  });

  test("SCR-C016 reservation list validates row actions and route-scoped local output", async ({
    page,
  }) => {
    await gotoScreen(page, "/class-reservations", "SCR-C016");

    await expect(page.getByRole("row", { name: /김민준.*010-1234-5678/ })).toBeVisible();
    await page.getByRole("button", { name: "상태(전체/예약완료/출석완료/취소/노쇼/대기)" }).click();
    const panel = await expectMockActionPanel(page, "SCR-C016", "/class-reservations");
    await expect(panel).toContainText("예약 목록");
    await closeMockActionPanel(page);

    await page.getByRole("row", { name: /김민준.*010-1234-5678/ }).click();
    await expect(page.getByTestId("scr-c016-row-detail-panel")).toContainText("PT 박트레이너");
    await expect(page.getByTestId("scr-c016-row-detail-panel")).toContainText("회원 상세 이동 · 출석 확정");
  });

  test("SCR-C001~C016 D04 routes render the expected screen contracts", async ({
    page,
  }) => {
    const routes: Array<[string, string]> = [
      ["/classes/c001", "SCR-C001"],
      ["/lessons", "SCR-C002"],
      ["/class-schedule", "SCR-C003"],
      ["/class-templates", "SCR-C004"],
      ["/classes/c005", "SCR-C005"],
      ["/instructor-status", "SCR-C006"],
      ["/lesson-counts", "SCR-C007"],
      ["/penalties", "SCR-C008"],
      ["/schedule-requests", "SCR-C009"],
      ["/exercise-programs", "SCR-C010"],
      ["/valid-lessons", "SCR-C011"],
      ["/class-waitlist", "SCR-C012"],
      ["/class-feedback", "SCR-C013"],
      ["/attendance/lesson-completion", "SCR-C014"],
      ["/class-recording", "SCR-C015"],
      ["/class-reservations", "SCR-C016"],
    ];

    for (const [route, screenId] of routes) {
      await gotoScreen(page, route, screenId);
      await expect(page.getByText("D04", { exact: true }).first()).toBeVisible();
    }
  });
});
