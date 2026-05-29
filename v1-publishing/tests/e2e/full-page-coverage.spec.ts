import { expect, test } from "@playwright/test";
import { screens } from "../../app/data/registry";

test.describe("전체 페이지 전수 검수", () => {
  test("118개 화면이 각자 고유 route에서 열리고 문서/계약 사이드바가 docs4 기준으로 열린다", async ({ page }) => {
    test.setTimeout(180_000);
    const routeMap = new Map<string, string[]>();
    for (const screen of screens) {
      routeMap.set(screen.route, [...(routeMap.get(screen.route) ?? []), screen.id]);
    }
    const duplicatedRoutes = [...routeMap.entries()].filter(([, ids]) => ids.length > 1);
    expect(duplicatedRoutes, `duplicate routes: ${JSON.stringify(duplicatedRoutes)}`).toHaveLength(0);

    for (const screen of screens) {
      await page.goto(screen.route);
      await expect(page.getByText(screen.id).first(), `${screen.id} marker`).toBeVisible();

      if (screen.id === "SCR-100") continue;

      await page.getByRole("button", { name: "문서/계약" }).click();
      const drawer = page.getByTestId("screen-support-drawer");
      await expect(drawer, `${screen.id} support drawer`).toBeVisible();
      await expect(drawer.getByText("docs4 V1/V2 출처"), `${screen.id} docs4 source`).toBeVisible();
      await expect(drawer.getByText("화면 구현 기준"), `${screen.id} implementation criteria`).toBeVisible();
      await expect(drawer, `${screen.id} handoff`).toContainText("화면 인수 기준");
      await expect(drawer.getByText("검수 기준"), `${screen.id} review criteria`).toBeVisible();
      await drawer.getByRole("button", { name: "닫기", exact: true }).click();
      await expect(drawer, `${screen.id} support drawer close`).not.toBeVisible();
    }
  });
});
