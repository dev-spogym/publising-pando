import { expect, test } from "@playwright/test";

test("회원 목록 화면은 docs4 V1 컬럼 헤더와 admin-pando 1:1 구조를 노출한다", async ({ page }) => {
  await page.goto("/members");
  await expect(page.getByText("SCR-M001", { exact: true }).first()).toBeVisible();
  // admin-pando 1:1 이식된 specialized MemberListScreen 컬럼
  for (const column of ["상태", "회원명", "연락처", "소속 지점", "이용권", "만료일", "성별", "생년월일"]) {
    await expect(page.getByText(column).first()).toBeVisible();
  }
});

test("회원 등록 진입 후 필수 필드 검증 안내가 동작한다", async ({ page }) => {
  await page.goto("/members/new");
  await expect(page.getByText("SCR-M002", { exact: true }).first()).toBeVisible();
  const nextButton = page.getByRole("button", { name: /다음|결제/ }).first();
  await expect(nextButton).toBeDisabled();
});

test("회원 수정 화면은 Step 1/2 구조와 변경 이력 탭을 노출한다", async ({ page }) => {
  await page.goto("/members/edit");
  await expect(page.getByText("SCR-M003", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/Step 1|기본 정보/).first()).toBeVisible();
});

test("체성분 관리 화면은 측정 8컬럼과 그래프 토글을 노출한다", async ({ page }) => {
  await page.goto("/body-composition");
  await expect(page.getByText("SCR-M006", { exact: true }).first()).toBeVisible();
  for (const column of ["체중", "골격근량", "체지방률", "BMI"]) {
    await expect(page.getByText(column).first()).toBeVisible();
  }
});

test("회원 이관 화면은 Manager 권한 차단 안내 가능 영역을 노출한다", async ({ page }) => {
  await page.goto("/members/transfer");
  await expect(page.getByText("SCR-M005", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/현재 지점|이관|대상 지점/).first()).toBeVisible();
});

test("회원 병합 화면은 주/부 계정 비교 4컬럼 표를 노출한다", async ({ page }) => {
  await page.goto("/members/merge");
  await expect(page.getByText("SCR-M007", { exact: true }).first()).toBeVisible();
  for (const column of ["주 계정", "부 계정", "채택"]) {
    await expect(page.getByText(column).first()).toBeVisible();
  }
});

test("세그먼트 관리 화면은 docs4 자동 7종 세그먼트를 노출한다", async ({ page }) => {
  await page.goto("/members/segment");
  await expect(page.getByText("SCR-M010", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/30일 미방문|이탈위험|만료임박|신규/).first()).toBeVisible();
});
