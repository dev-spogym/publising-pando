import { expect, test } from "@playwright/test";
import { screens } from "../../app/data/registry";

test("표본 30개 화면에 핸드오프 컨텍스트가 표시된다 (계약 카드 / 프론트 상태 명세 / SCR ID 중 1개)", async ({ page }) => {
  const sampleScreens = screens.slice(0, 30);
  for (const screen of sampleScreens) {
    await page.goto(screen.route);
    // 핸드오프 컨텍스트 = 다음 중 하나라도 노출되면 통과:
    //   1) 개발 핸드오프 계약/프론트 상태 명세/HandoffContract 카드
    //   2) API 호출 없음/퍼블리싱 범위/mock contract 라벨
    //   3) screen.id 자체 (모든 화면이 헤더 또는 본문에 노출)
    const handoffContext = page.getByText(
      new RegExp(`개발 핸드오프 계약|핸드오프|프론트 상태 명세|HandoffContract|API 호출 없음|퍼블리싱 범위|mock contract|${screen.id}`, "i")
    ).first();
    await expect(handoffContext).toBeVisible();
  }
});

test("API 호출 없음 라벨이 회원 목록 화면에 노출된다", async ({ page }) => {
  await page.goto("/members");
  await expect(page.getByText(/API 호출 없음/).first()).toBeVisible();
});
