import { expect, test } from "@playwright/test";

test.describe("publishing review mode", () => {
  test("토글 클릭 시 aria-pressed가 양방향 전환된다", async ({ page }) => {
    await page.goto("/members");
    const toggle = page.getByRole("button", { name: "문서 검수 모드" });
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
  });

  test("토글 상태가 localStorage에 저장된다", async ({ page }) => {
    await page.goto("/members");
    const toggle = page.getByRole("button", { name: "문서 검수 모드" });
    await toggle.click();
    const stored = await page.evaluate(() => localStorage.getItem("pando-publishing-review-mode"));
    expect(stored).toBe("1");
  });

  test("토글 상태는 페이지 이동 후에도 유지된다", async ({ page }) => {
    await page.goto("/members");
    await page.getByRole("button", { name: "문서 검수 모드" }).click();
    await page.goto("/sales");
    const toggle = page.getByRole("button", { name: "문서 검수 모드" });
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("V1+V2 source display", () => {
  test("V1+V2 공통 화면(SCR-M001 회원 목록)은 DeliveryHeader에 V1+V2 배지 표시", async ({ page }) => {
    await page.goto("/members");
    await expect(page.getByText(/V1\+V2|V1.*V2/).first()).toBeVisible();
  });

  test("V2 only 화면(SCR-085 공지사항 관리)은 V2 단독 배지 표시", async ({ page }) => {
    await page.goto("/notices");
    await expect(page.getByText("V2").first()).toBeVisible();
  });

  test("V1 only 화면(SCR-M008 가족 회원)은 V1 단독 배지 표시", async ({ page }) => {
    await page.goto("/members/family");
    await expect(page.getByText("V1").first()).toBeVisible();
  });
});
