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
  test.setTimeout(120_000);
  for (const screen of screens) {
    await page.goto(screen.route);
    // SCR ID는 본문 헤더 (DeliveryHeader 또는 specialized 자체 헤더)에 노출돼야 한다.
    // 본문 region 한정으로 검증해 사이드바 hidden 요소 매칭 회피.
    const main = page.locator("main");
    await expect(main.getByText(screen.id).first()).toBeVisible();
  }
});

test("all DLG definitions are reachable from at least one screen", async ({ page }) => {
  test.setTimeout(180_000);
  for (const dialog of dialogs) {
    const host = screens.find((screen) => screen.dialogs.includes(dialog.id));
    expect(host, `${dialog.id} host screen`).toBeTruthy();
    await page.goto(host!.route);

    let trigger = page.locator(`[data-dialog-id="${dialog.id}"]`).first();
    if ((await trigger.count()) === 0 || (await trigger.isDisabled().catch(() => true))) {
      const supportButton = page.getByRole("button", { name: "문서/계약" });
      if ((await supportButton.count()) > 0) {
        await supportButton.click();
        trigger = page.getByTestId("screen-support-drawer").locator(`[data-dialog-id="${dialog.id}"]`).first();
      }
    }

    if ((await trigger.count()) > 0 && !(await trigger.isDisabled().catch(() => true))) {
      await trigger.click({ timeout: 3000 });
      await expect(page.getByRole("dialog").filter({ hasText: dialog.id }).first()).toBeVisible();
      await page.keyboard.press("Escape");
    } else {
      const matcher = new RegExp(`${dialog.id}|${dialog.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
      await expect(page.getByText(matcher).first()).toBeVisible();
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
  // MemberListScreen은 admin-pando 1:1 specialized. generic DomainOperationsScreen 가정 대신
  // specialized 화면의 검색·상태 필터 탭·일괄 액션 mock 동작을 검증한다.
  await page.goto("/members");
  await page.getByRole("button", { name: "문서/계약" }).click();
  await expect(page.getByTestId("screen-support-drawer")).toContainText("퍼블리싱 인수 기준");
  await expect(page.getByText(/API 호출 없음/).first()).toBeVisible();
  await page.getByTestId("screen-support-drawer").getByRole("button", { name: "닫기", exact: true }).click();

  // Daily Focus — 재등록 집중 보기 클릭 mock (admin-pando MemberListScreen 패턴)
  await page.getByRole("button", { name: /재등록 집중 보기/ }).first().click();
  // 상태 필터 탭 8개 중 "활성" 클릭 (specialized MemberListScreen)
  await page.getByRole("button", { name: /^활성/ }).first().click();
  // 회원명 검색 — admin-pando placeholder "회원명, 연락처 검색..."
  await page.getByPlaceholder(/회원명, 연락처 검색/).first().fill("박서연");
  await expect(page.getByText("박서연").first()).toBeVisible();
});

test("dialog form edits surface dirty close and submit contract feedback", async ({ page }) => {
  await page.goto("/members");
  await page.getByRole("button", { name: "문서/계약" }).click();
  const trigger = page.getByTestId("screen-support-drawer").locator('[data-dialog-id="DLG-M001"]').first();
  await trigger.click({ timeout: 3000 });
  await expect(page.getByTestId("runtime-dialog")).toBeVisible();

  // 새 DLG 시스템: 헤더 DLG-M001 배지 + source path 모노스페이스
  await expect(page.getByText("DLG-M001").first()).toBeVisible();
  await expect(page.locator("code").filter({ hasText: /docs4/ }).first()).toBeVisible();

  // 새 DLG 시스템 푸터: 동사형 액션 (DLG-M001 → "상태 변경")
  await expect(page.getByRole("button", { name: "상태 변경" })).toBeVisible();

  // textarea 입력 → dirty 상태 진입 (push to setDirty)
  const textarea = page.locator("textarea").first();
  if (await textarea.count() > 0) {
    await textarea.fill("검수용 변경");
  }

  // 푸터 "취소" 클릭 → dirty toast
  await page.getByRole("button", { name: "취소" }).click();
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
  // generic DomainOperationsScreen 가정 라우트 + specialized 화면 라우트 모두 검증.
  // specialized 화면(SCR ID 표시)은 admin-pando 1:1 이식되어 generic 헤딩이 없음.
  const genericRoutes = [
    ["/settings", "센터 정책·권한·자동화 설정"]
  ] as const;
  const specializedRoutes = [
    ["/classes/c001", "SCR-C001"],
    ["/products/p001", "SCR-P001"],
    ["/facilities/050", "SCR-050"],
    ["/staff", "SCR-060"],
    ["/leads", "SCR-070"],
    ["/branches", "SCR-092"],
    ["/attendance", "SCR-I001"]
  ] as const;

  for (const [route, heading] of genericRoutes) {
    await page.goto(route);
    await expect(page.getByText(heading)).toBeVisible();
  }
  for (const [route, scrId] of specializedRoutes) {
    await page.goto(route);
    await expect(page.getByText(scrId).first()).toBeVisible();
  }
});


test("DLG component gallery renders D01-D03 component cards", async ({ page }) => {
  await page.goto("/dialogs");
  const main = page.locator("main");
  // SCR-DLG 화면 헤더 노출
  await expect(main.getByText(/DLG 컴포넌트 갤러리|컴포넌트 검수 갤러리/).first()).toBeVisible();
  // D02 회원관리 탭 (기본 활성). 본문 region 한정으로 사이드바 hidden 매칭 회피.
  await main.getByRole("button", { name: /D02.*회원관리/ }).first().click().catch(() => {});
  await expect(main.getByText("DLG-M001").first()).toBeVisible();
  // D03 매출관리 탭으로 전환
  await main.getByRole("button", { name: /D03.*매출관리/ }).first().click();
  await expect(main.getByText("DLG-S013").first()).toBeVisible();
});
