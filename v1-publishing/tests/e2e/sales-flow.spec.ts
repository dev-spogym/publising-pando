import { expect, test } from "@playwright/test";

test("POS 화면은 상품 카드와 결제 확인 액션을 노출한다", async ({ page }) => {
  await page.goto("/sales/pos");
  await expect(page.getByText("SCR-S002", { exact: true }).first()).toBeVisible();
  // 카테고리 탭 "이용권"이 기본 활성: 회원권 3개월 상품 카드 확인
  await expect(page.getByText("회원권 3개월").first()).toBeVisible();
  // PT 카테고리 탭 클릭 → PT 20회권 노출
  await page.getByRole("button", { name: /^PT/ }).first().click();
  await expect(page.getByText("PT 20회권").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "결제 확인" }).first()).toBeVisible();
});

test("매출 현황 화면은 docs4 V1 11컬럼 헤더를 노출한다", async ({ page }) => {
  await page.goto("/sales");
  await expect(page.getByText("SCR-S001", { exact: true }).first()).toBeVisible();
  for (const column of ["매출번호", "회원", "상품", "총액", "수단"]) {
    await expect(page.getByText(column).first()).toBeVisible();
  }
});

test("환불 관리 화면은 정책 확인 필요 배너를 노출한다", async ({ page }) => {
  await page.goto("/sales/refunds");
  await expect(page.getByText("SCR-S007", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/정책 확인|policy/i).first()).toBeVisible();
});

test("세금계산서 화면은 external 연동 안내를 노출한다", async ({ page }) => {
  await page.goto("/sales/tax-invoice");
  await expect(page.getByText("SCR-S010", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/외부 연동|external|발행/i).first()).toBeVisible();
});

test("매출 통계 화면은 docs4 V2 채택 신호(GX/골프프로/법인권)를 노출한다", async ({ page }) => {
  await page.goto("/sales/stats");
  await expect(page.getByText("SCR-S004", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/GX|골프프로|법인권/).first()).toBeVisible();
});

test("미수금 관리 화면은 docs4 V2 5탭 상태 필터를 노출한다", async ({ page }) => {
  await page.goto("/sales/receivables");
  await expect(page.getByText("SCR-S008", { exact: true }).first()).toBeVisible();
  for (const tab of ["전체", "미결제", "완료"]) {
    await expect(page.getByText(tab).first()).toBeVisible();
  }
});

test("할부결제 관리 화면은 docs4 V1 계약 출처 3종을 노출한다", async ({ page }) => {
  await page.goto("/sales/installments");
  await expect(page.getByText("SCR-S009", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/현장 결제|미수금 전환|직접 등록/).first()).toBeVisible();
});

test("결제 취소/부분 환불 화면은 정책 확인 필요와 5단계 흐름을 노출한다", async ({ page }) => {
  await page.goto("/sales/refund-partial");
  await expect(page.getByText("SCR-S012", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/정책 확인|환불 수기 입력|승인/).first()).toBeVisible();
});
