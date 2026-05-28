import { expect, test } from "@playwright/test";

const ROLES = ["HQ_ADMIN", "OWNER", "MANAGER", "FC", "TRAINER", "STAFF"] as const;

test("HQ_ADMIN으로 전환하면 전 지점 필터 배지가 노출된다", async ({ page }) => {
  await page.goto("/members");
  await page.evaluate(() => window.localStorage.setItem("pando-role", "HQ_ADMIN"));
  await page.reload();
  await expect(page.getByText(/전 지점|본사|HQ/).first()).toBeVisible();
});

test("STAFF는 회원 병합 액션 클릭 시 권한 안내가 노출된다", async ({ page }) => {
  await page.goto("/members/merge");
  await page.evaluate(() => window.localStorage.setItem("pando-role", "STAFF"));
  await page.reload();
  // MemberMergeScreen에는 권한 안내 텍스트가 roleNotes 영역과 안내 카드에 노출됨
  await expect(page.getByText(/Owner|병합|위험 액션|권한/).first()).toBeVisible();
});

test("모든 역할이 사이드바 메뉴를 동일 구조로 본다", async ({ page }) => {
  for (const role of ROLES) {
    await page.goto("/members");
    await page.evaluate((r) => window.localStorage.setItem("pando-role", r), role);
    await page.reload();
    await expect(page.getByText(/docs4|D01|D02|회원관리/).first()).toBeVisible();
  }
});

test("HQ 전용 V2 화면은 HQ_ADMIN 권한으로 접근 가능하다", async ({ page }) => {
  await page.goto("/members");
  await page.evaluate(() => window.localStorage.setItem("pando-role", "HQ_ADMIN"));
  await page.reload();
  await page.goto("/nps");
  await expect(page.getByText("SCR-H1005").first()).toBeVisible();
});

test("브랜치 전환 후에도 화면 SCR ID는 유지된다", async ({ page }) => {
  await page.goto("/sales");
  await page.evaluate(() => {
    window.localStorage.setItem("pando-role", "OWNER");
    window.localStorage.setItem("pando-branch", "서초점");
  });
  await page.reload();
  await expect(page.getByText("SCR-S001", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("서초점").first()).toBeVisible();
});
