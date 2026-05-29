import { expect, test, type Locator, type Page } from "@playwright/test";

const memberNames = {
  active: "김민준",
  imminent: "박서연",
  holding: "정하준",
  expired: "오지우",
};

async function gotoMembers(page: Page) {
  await page.goto("/members");
  await expect(page.getByText("SCR-M001", { exact: true }).first()).toBeVisible();
}

function memberListTable(page: Page): Locator {
  return page.locator("table").filter({ hasText: "회원명" }).first();
}

function memberRow(page: Page, name: string): Locator {
  return memberListTable(page).getByRole("row", { name: new RegExp(name) });
}

function quickMemberPanel(page: Page): Locator {
  return page.locator("aside").filter({ hasText: "Quick Member View" }).first();
}

async function expectQuickPanelFor(page: Page, name: string, phone: string) {
  const panel = quickMemberPanel(page);
  await expect(panel).toBeVisible();
  await expect(panel.getByRole("heading", { name })).toBeVisible();
  await expect(panel).toContainText(phone);
}

async function chooseSelectOptionNearLabel(page: Page, label: RegExp | string, optionName: RegExp | string) {
  const labelLocator = page.getByText(label).first();
  const filterGroup = labelLocator.locator("xpath=ancestor::*[self::div or self::label][1]");
  await filterGroup.getByRole("combobox").click();
  await page.getByRole("option", { name: optionName }).click();
}

async function openRuntimeDialog(page: Page, triggerName: RegExp | string) {
  await page.getByRole("button", { name: triggerName }).first().click();
  const dialog = page.getByTestId("runtime-dialog");
  await expect(dialog).toBeVisible();
  return dialog;
}

test.describe("회원 목록 상세 사이드패널", () => {
  test("row click changes the quick detail side panel to the clicked member", async ({ page }) => {
    await gotoMembers(page);

    await expectQuickPanelFor(page, memberNames.active, "010-1234-5678");

    await memberRow(page, memberNames.imminent).click();
    await expectQuickPanelFor(page, memberNames.imminent, "010-2222-8899");
    await expect(quickMemberPanel(page)).toContainText("회원권 3개월 · D-3");

    await memberRow(page, memberNames.holding).click();
    await expectQuickPanelFor(page, memberNames.holding, "010-7755-4300");
    await expect(quickMemberPanel(page)).toContainText("수강권 홀딩 · 12일");
  });

  test("panel close removes the quick detail side panel from the page", async ({ page }) => {
    await gotoMembers(page);

    const panel = quickMemberPanel(page);
    await expect(panel).toBeVisible();
    await panel.getByRole("button", { name: /^닫기$/ }).click();

    await expect(quickMemberPanel(page)).toBeHidden();
  });
});

test.describe("회원 목록 필터", () => {
  test("status tab filters the table down to matching member statuses", async ({ page }) => {
    await gotoMembers(page);

    await page.getByRole("button", { name: /^만료\s*1$/ }).click();
    await expect(memberRow(page, memberNames.expired)).toBeVisible();
    await expect(memberRow(page, memberNames.active)).toHaveCount(0);
    await expect(memberRow(page, memberNames.imminent)).toHaveCount(0);
    await expect(memberRow(page, memberNames.holding)).toHaveCount(0);

    await page.getByRole("button", { name: /^홀딩\s*1$/ }).click();
    await expect(memberRow(page, memberNames.holding)).toBeVisible();
    await expect(memberRow(page, memberNames.expired)).toHaveCount(0);
  });

  test("interest-only filter keeps only favorite members and reset restores the full list", async ({ page }) => {
    await gotoMembers(page);

    await page.getByLabel(/관심회원만/).check();
    await expect(page.getByLabel(/관심회원만/)).toBeChecked();
    await expect(memberRow(page, memberNames.active)).toBeVisible();
    await expect(memberRow(page, memberNames.imminent)).toBeVisible();
    await expect(memberRow(page, memberNames.holding)).toHaveCount(0);

    await page.getByRole("button", { name: /^초기화$/ }).click();
    await expect(memberRow(page, memberNames.holding)).toBeVisible();
    await expect(memberRow(page, memberNames.expired)).toBeVisible();
  });

  test("long no-visit filter narrows rows to members whose last visit exceeds the threshold", async ({ page }) => {
    await gotoMembers(page);

    await chooseSelectOptionNearLabel(page, /^미방문$/, /^30일 초과$/);
    await expect(memberRow(page, memberNames.holding)).toBeVisible();
    await expect(memberRow(page, memberNames.expired)).toBeVisible();
    await expect(memberRow(page, memberNames.active)).toHaveCount(0);
    await expect(memberRow(page, memberNames.imminent)).toHaveCount(0);
  });

  test("daily focus shortcuts drive the same filter state as the dedicated controls", async ({ page }) => {
    await gotoMembers(page);

    await page.getByRole("button", { name: /관심회원 보기/ }).click();
    await expect(page.getByLabel(/관심회원만/)).toBeChecked();

    await page.getByRole("button", { name: /이탈 위험 보기/ }).click();
    await expect(page.getByRole("button", { name: /^전체\s*\d+$/ })).toHaveClass(/text-primary/);
    await expect(page.getByRole("combobox").filter({ hasText: "14일 초과" }).first()).toBeVisible();
  });
});

test.describe("회원 상세/등록/수정/결제/메시지/DLG 브라우저 플로우", () => {
  test("quick panel actions navigate to detail and payment screens", async ({ page }) => {
    await gotoMembers(page);

    const panel = quickMemberPanel(page);
    await panel.getByRole("link", { name: /^상세 보기$/ }).click();
    await expect(page).toHaveURL(/\/members\/detail\/?(\?.*)?$/);
    await expect(page.getByTestId("member-detail-screen")).toBeVisible();
    await expect(page.getByText("Operation Cockpit").first()).toBeVisible();

    await page.goto("/members");
    await quickMemberPanel(page).getByRole("link", { name: /^상품구매$/ }).click();
    await expect(page).toHaveURL(/\/sales\/payment\/?(\?.*)?$/);
    await expect(page.getByText("구매자 · 상품 · 수납 · 완료").first()).toBeVisible();
  });

  test("member detail exposes edit, payment, message, tab and DLG interactions", async ({ page }) => {
    await page.goto("/members/detail");
    await expect(page.getByTestId("member-detail-screen")).toBeVisible();

    await page.getByRole("tab", { name: /결제내역/ }).click();
    await expect(page.getByText("결제내역 상세").first()).toBeVisible();

    const holdingDialog = await openRuntimeDialog(page, /홀딩 처리/);
    await expect(holdingDialog).toContainText("DLG-M003");
    await expect(holdingDialog.getByRole("button", { name: /홀딩 등록/ })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(holdingDialog).toBeHidden();

    await page.getByTestId("member-detail-screen").getByRole("link", { name: /수정/ }).first().click();
    await expect(page).toHaveURL(/\/members\/edit\/?(\?.*)?$/);
    await expect(page.getByText(/Step 1 \/ 2/).first()).toBeVisible();
  });

  test("member registration advances only after required fields and reaches payment", async ({ page }) => {
    await page.goto("/members/new");
    await expect(page.getByText("SCR-M002", { exact: true }).first()).toBeVisible();

    const next = page.getByRole("button", { name: /^다음$/ });
    await expect(next).toBeDisabled();

    await page.getByPlaceholder("홍길동").fill("테스터");
    await page.getByPlaceholder("010-0000-0000").fill("010-9999-8888");
    await page.getByRole("button", { name: /^중복 확인$/ }).click();
    await expect(page.getByTestId("runtime-dialog")).toContainText("DLG-M006");
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("runtime-dialog")).toBeHidden();
    await expect(next).toBeEnabled();
    await next.click();

    await expect(page.getByText("3. 추가 정보").first()).toBeVisible();
    await page.getByRole("link", { name: /^결제 진행$/ }).click();
    await expect(page).toHaveURL(/\/sales\/payment\/?(\?.*)?$/);
  });

  test("member edit walks both steps, validates memo counter, and saves", async ({ page }) => {
    await page.goto("/members/edit");
    await expect(page.getByText("SCR-M003", { exact: true }).first()).toBeVisible();

    await page.getByRole("button", { name: /^다음$/ }).click();
    await expect(page.getByPlaceholder("이메일")).toHaveValue("minjun@example.com");

    const memo = page.locator("textarea").first();
    await memo.fill("장기 미방문 리텐션 상담 완료");
    await expect(page.getByText(/\d+ \/ 500/).first()).toBeVisible();
    await page.getByRole("button", { name: /^저장$/ }).click();
    await expect(page.getByText(/회원 정보가 수정되었습니다/).first()).toBeVisible();
  });

  test("payment requires receipt attachment, completes registration, and exposes DLG-S003 confirmation", async ({ page }) => {
    await page.goto("/sales/payment");
    await expect(page.getByText("SCR-S003", { exact: true }).first()).toBeVisible();

    const submit = page.getByRole("button", { name: /결제 등록/ });
    await expect(submit).toBeDisabled();

    await expect(page.locator('[data-dialog-id="DLG-S003"]').last()).toBeDisabled();
    await expect(page.getByText("최종 결제 금액").first()).toBeVisible();

    const duplicateDialog = await openRuntimeDialog(page, /^중복 결제 경고$/);
    await expect(duplicateDialog).toContainText("DLG-S004");
    await expect(duplicateDialog).toContainText("동일 회원·동일 상품 단기간 중복 결제 감지");
    await page.keyboard.press("Escape");
    await expect(duplicateDialog).toBeHidden();

    await page.getByRole("button", { name: /^파일 첨부$/ }).click();
    await expect(page.getByText("첨부 완료").first()).toBeVisible({ timeout: 2000 });
    await expect(submit).toBeEnabled();
    await submit.click();
    await expect(page.getByRole("heading", { name: "결제 등록 완료", exact: true })).toBeVisible();
    await expect(page.getByText("결제완료 상태 + 회원권/수강권 구매 완료")).toBeVisible();
  });

  test("message compose validates required fields, previews content, and adds a browser-visible send row", async ({ page }) => {
    await page.goto("/message");
    await expect(page.getByText("SCR-071", { exact: true }).first()).toBeVisible();

    await page.getByRole("button", { name: /새 메시지 발송/ }).first().click();
    await expect(page.getByText("새 메시지 발송").last()).toBeVisible();

    await page.getByRole("button", { name: /발송하기/ }).click();
    await expect(page.getByText(/제목은 3자 이상 입력해주세요/).first()).toBeVisible();

    await page.getByPlaceholder("메시지 제목").fill("재등록 안내");
    await page.getByPlaceholder(/Push 메시지 내용/).fill("이번 주 재등록 상담 가능 시간을 확인해주세요.");
    await page.getByRole("button", { name: /^미리보기$/ }).click();
    await expect(page.locator(".border-dashed").filter({ hasText: "이번 주 재등록 상담 가능 시간을 확인해주세요." })).toBeVisible();

    await page.getByRole("button", { name: /발송하기/ }).click();
    const sentRow = page.getByRole("row", { name: /방금 전.*재등록 안내/ });
    await expect(sentRow).toBeVisible();
    await expect(sentRow).toContainText("발송중");
  });

  test("list-level DLG interactions open status-change and transfer dialogs", async ({ page }) => {
    await gotoMembers(page);

    await page.getByRole("button", { name: /선택 회원 상태 변경/ }).click();
    const dialog = page.getByTestId("runtime-dialog");
    await expect(dialog).toContainText("DLG-M001");
    await expect(dialog).toContainText("변경할 상태");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    await memberRow(page, memberNames.active).getByRole("link", { name: /^이관$/ }).click();
    await expect(page).toHaveURL(/\/members\/transfer\/?\?memberId=10291/);
    await expect(page.getByText("SCR-M005", { exact: true }).first()).toBeVisible();
  });
});
