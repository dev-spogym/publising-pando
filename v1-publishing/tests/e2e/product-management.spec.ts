import { expect, test } from "@playwright/test";

test.describe("SCR-P001 상품 관리 master-detail UX", () => {
  test("상품 행 클릭 시 admin-pando식 우측 SCR-P003 상세/수정 패널이 열린다", async ({ page }) => {
    await page.goto("/products/p001");
    await expect(page.getByText("SCR-P001").first()).toBeVisible();
    await expect(page.getByText("행 클릭 → SCR-P003 우측 상세/수정 패널")).toBeVisible();
    await expect(page.getByText("월").first()).toBeVisible();

    await page.getByText(/PT 20회권/).first().click();

    await expect(page.getByText("상품수정").first()).toBeVisible();
    await expect(page.getByText("SCR-P003").first()).toBeVisible();
    await expect(page.getByText(/docs4\/V1 SCR-P003 \+ docs4\/V2 PRD-EXT-01\/02/).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "가격 이력" })).toBeVisible();
  });

  test("상품 등록은 별도 라우트 이동 없이 동일 우측 패널의 신규 상태로 열린다", async ({ page }) => {
    await page.goto("/products/p001");
    await page.getByRole("button", { name: "+ 상품 등록" }).click();

    await expect(page.getByText("상품등록").first()).toBeVisible();
    await expect(page.getByPlaceholder("상품명을 입력하세요")).toBeVisible();
    await expect(page).toHaveURL(/\/products\/p001\/?$/);
  });
  test("검색 필터와 미저장 닫기 확인이 실제 운영 흐름처럼 동작한다", async ({ page }) => {
    await page.goto("/products/p001");

    await page.getByPlaceholder("상품명 검색").fill("GX");
    await expect(page.getByText("표시 1개 / 샘플 4개 · 문서 기준 31개")).toBeVisible();
    await expect(page.getByText(/GX 요가/).first()).toBeVisible();
    await expect(page.getByText(/PT 20회권/)).not.toBeVisible();

    await page.getByText(/GX 요가/).first().click();
    await page.getByPlaceholder("상품명을 입력하세요").fill("GX 요가 테스트");
    await expect(page.getByText("미저장")).toBeVisible();
    await page.getByLabel("닫기").click();

    await expect(page.getByRole("dialog", { name: "작업 취소 확인" })).toBeVisible();
    await page.getByRole("button", { name: "계속 수정" }).click();
    await expect(page.getByText("상품수정").first()).toBeVisible();

    await page.getByLabel("닫기").click();
    await page.getByRole("button", { name: "변경 폐기" }).click();
    await expect(page.getByText("상품수정")).not.toBeVisible();
  });
});
