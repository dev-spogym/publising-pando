/**
 * admin-pando 톤 이식 후 핵심 화면 스크린샷 8장 생성
 * 출력: .omx/plans/screenshots/rework-<SCR>.png
 */
import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = ".omx/plans/screenshots";

const TARGETS: { id: string; route: string }[] = [
  { id: "SCR-100", route: "/login" },
  { id: "SCR-M001", route: "/members" },
  { id: "SCR-M004", route: "/members/detail" },
  { id: "SCR-S001", route: "/sales" },
  { id: "SCR-S002", route: "/sales/pos" },
  { id: "SCR-C001", route: "/classes/calendar" },
  { id: "SCR-094", route: "/hq/kpi" },
  { id: "SCR-DLG", route: "/dialogs" },
];

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  for (const { id, route } of TARGETS) {
    const url = `${BASE}${route}`;
    process.stdout.write(`- ${id} ${url} ... `);
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 20_000 });
      await page.waitForTimeout(450);
      const file = path.join(OUT, `rework-${id}.png`);
      await page.screenshot({ path: file, fullPage: false });
      console.log("OK");
    } catch (e: any) {
      console.log("FAIL", e?.message ?? e);
    }
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
