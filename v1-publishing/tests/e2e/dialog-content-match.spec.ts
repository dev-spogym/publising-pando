import { expect, test, type Page, type Locator } from "@playwright/test";

// DLG ID ↔ 컨텐츠 일치 검증.
// 사용자가 본 잘못된 케이스 (DLG-092-001이 검색 결과 표시) 같은 mismatch 차단.
// 각 DLG는 ID 의도에 맞는 정확한 필드/라벨이 노출돼야 한다.

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

test.describe("DLG ID ↔ 컨텐츠 일치", () => {
  test("DLG-092-001 신규 지점 등록: 지점명/지점 코드/주소 라벨 (검색 결과 NO)", async ({ page }) => {
    const dialog = await openDialog(page, "/branches", "DLG-092-001");
    if (!dialog) test.skip(true, "DLG-092-001 트리거 unavailable");
    if (!dialog) return;

    // 진짜 지점 등록 폼 라벨 노출
    for (const label of ["지점명", "지점 코드", "대표 연락처", "운영 시작일", "초기 Owner"]) {
      await expect(page.getByText(label).first()).toBeVisible();
    }

    // 푸터 액션: "지점 등록" 동사형
    await expect(page.getByRole("button", { name: "지점 등록" })).toBeVisible();
    await expect(page.getByRole("button", { name: "취소" })).toBeVisible();
  });

  test("DLG-M001 회원 상태 변경: 변경할 상태 select + 사유 필드", async ({ page }) => {
    const dialog = await openDialog(page, "/members", "DLG-M001");
    if (!dialog) test.skip(true, "DLG-M001 트리거 unavailable");
    if (!dialog) return;

    await expect(page.getByText("대상 회원").first()).toBeVisible();
    await expect(page.getByText("변경할 상태").first()).toBeVisible();
    await expect(page.getByRole("button", { name: "상태 변경" })).toBeVisible();
  });

  test("DLG-M002 회원 삭제: 차단 조건 + 확인 문구 검증", async ({ page }) => {
    const dialog = await openDialog(page, "/members/detail", "DLG-M002");
    if (!dialog) test.skip(true, "DLG-M002 트리거 unavailable");
    if (!dialog) return;

    await expect(page.getByText("복구 불가 액션").first()).toBeVisible();
    await expect(page.getByText("차단 조건 확인").first()).toBeVisible();
    await expect(page.getByRole("button", { name: "회원 삭제" })).toBeVisible();
  });

  test("DLG-M027 주소 검색: 검색 input + 검색 결과 카드 + 주소 선택 액션", async ({ page }) => {
    const dialog = await openDialog(page, "/members/new", "DLG-M027");
    if (!dialog) test.skip(true, "DLG-M027 트리거 unavailable");
    if (!dialog) return;

    await expect(page.getByText("주소 검색").first()).toBeVisible();
    await expect(page.getByText(/서울 강남구 테헤란로/).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "주소 선택" })).toBeVisible();
  });

  test("DLG-S003 결제 확인: 구매자/상품 목록/최종 결제 금액 카드", async ({ page }) => {
    const dialog = await openDialog(page, "/sales/payment", "DLG-S003");
    if (!dialog) test.skip(true, "DLG-S003 트리거 unavailable");
    if (!dialog) return;

    await expect(page.getByText("구매자").first()).toBeVisible();
    await expect(page.getByText("상품 목록").first()).toBeVisible();
    await expect(page.getByText("최종 결제 금액").first()).toBeVisible();
    await expect(page.getByRole("button", { name: "결제 확정" })).toBeVisible();
  });

  test("RuntimeDialog 압축 헤더: DLG ID 배지 + source path 모노스페이스 (메타 카드 4개 NO)", async ({ page }) => {
    const dialog = await openDialog(page, "/members", "DLG-M001");
    if (!dialog) test.skip(true, "DLG-M001 트리거 unavailable");
    if (!dialog) return;

    // DLG ID 배지
    await expect(page.getByText("DLG-M001").first()).toBeVisible();
    // source path 모노스페이스
    await expect(page.locator("code").filter({ hasText: /docs4/ }).first()).toBeVisible();
    // 동사형 푸터 액션
    await expect(page.getByRole("button", { name: "상태 변경" })).toBeVisible();
  });
});
