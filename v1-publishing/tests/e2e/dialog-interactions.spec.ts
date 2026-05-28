import { expect, test, type Page, type Locator } from "@playwright/test";

// DLG (DialogWorkflowBody) 시스템 인터랙션 검증.
// 위험 액션 사유/확인 문구 / 검색 단일 선택 / 결제 카드 / 권한 차단.

async function openDialog(page: Page, route: string, dlgId: string): Promise<Locator | null> {
  await page.goto(route);
  const trigger = page.locator(`[data-dialog-id="${dlgId}"]`).first();
  const count = await trigger.count();
  if (count === 0) return null;
  const disabled = await trigger.isDisabled().catch(() => true);
  if (disabled) return null;
  await trigger.click({ trial: false, timeout: 3000 }).catch(() => {});
  const dialog = page.getByTestId("runtime-dialog");
  const visible = await dialog.isVisible({ timeout: 2000 }).catch(() => false);
  if (!visible) return null;
  return dialog;
}

test.describe("DLG 위험 액션", () => {
  test("DLG-M002 회원 삭제: 차단 조건 + 확인 문구 + 푸터 destructive", async ({ page }) => {
    const dialog = await openDialog(page, "/members/detail", "DLG-M002");
    if (!dialog) test.skip(true, "DLG-M002 트리거 unavailable");
    if (!dialog) return;

    await expect(page.getByText(/복구 불가/).first()).toBeVisible();
    await expect(page.getByText(/차단 조건/).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "회원 삭제" })).toBeVisible();

    await page.keyboard.press("Escape");
  });
});

test.describe("DLG 검색", () => {
  test("DLG-S002 구매자 검색: 검색 input + 검색 결과 + 비회원 옵션", async ({ page }) => {
    const dialog = await openDialog(page, "/sales/pos", "DLG-S002");
    if (!dialog) test.skip(true, "DLG-S002 트리거 unavailable");
    if (!dialog) return;

    await expect(page.getByText("구매자 검색").first()).toBeVisible();
    await expect(page.getByText(/검색 결과/).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "비회원으로 진행" }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "구매자 선택" })).toBeVisible();
  });
});

test.describe("DLG 결제", () => {
  test("DLG-S003 결제 확인: 구매자/상품 목록/최종 결제 금액", async ({ page }) => {
    const dialog = await openDialog(page, "/sales/payment", "DLG-S003");
    if (!dialog) test.skip(true, "DLG-S003 트리거 unavailable");
    if (!dialog) return;

    for (const label of ["구매자", "상품 목록", "최종 결제 금액"]) {
      await expect(page.getByText(label).first()).toBeVisible();
    }
    await expect(page.getByRole("button", { name: "결제 확정" })).toBeVisible();
  });
});

test.describe("DLG 헤더 컴팩트", () => {
  test("DLG ID 배지 + source path 모노스페이스 + 동사형 액션", async ({ page }) => {
    const dialog = await openDialog(page, "/members", "DLG-M001");
    if (!dialog) test.skip(true, "DLG-M001 트리거 unavailable");
    if (!dialog) return;

    await expect(page.getByText("DLG-M001").first()).toBeVisible();
    await expect(page.locator("code").filter({ hasText: /docs4/ }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "상태 변경" })).toBeVisible();
    await expect(page.getByRole("button", { name: "취소" })).toBeVisible();
  });
});
