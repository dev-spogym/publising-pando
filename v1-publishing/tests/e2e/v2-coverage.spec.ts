import { expect, test } from "@playwright/test";
import { screens } from "../../app/data/registry";

const V2_ONLY_SCR_IDS = [
  "SCR-C010", "SCR-C012", "SCR-C015",
  "SCR-P005", "SCR-P006", "SCR-P007", "SCR-P008",
  "SCR-051", "SCR-052", "SCR-053", "SCR-054", "SCR-055",
  "SCR-056", "SCR-057", "SCR-058", "SCR-059",
  "SCR-077",
  "SCR-085", "SCR-088",
  "SCR-090", "SCR-091", "SCR-096",
  "SCR-H1002", "SCR-H1003", "SCR-H1005",
] as const;

test("모든 V2 신규 SCR이 registry에 등록되어 있다", async () => {
  for (const id of V2_ONLY_SCR_IDS) {
    const screen = screens.find((s) => s.id === id);
    expect(screen, `${id} not found in registry`).toBeTruthy();
  }
  expect(V2_ONLY_SCR_IDS.length).toBeGreaterThanOrEqual(25);
});

test("모든 V2 신규 SCR 라우트가 200/308 응답하고 SCR ID가 렌더된다", async ({ page }) => {
  for (const id of V2_ONLY_SCR_IDS) {
    const screen = screens.find((s) => s.id === id);
    expect(screen, `${id} registry`).toBeTruthy();
    const response = await page.goto(screen!.route);
    expect(response?.status(), `${id} status`).toBeLessThan(400);
    await expect(page.getByText(id).first()).toBeVisible();
  }
});
