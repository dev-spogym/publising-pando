import { chromium, type Browser } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { dialogs, screens, type DialogDefinition, type ScreenDefinition } from "../app/data/registry";

const baseURL = process.env.VISUAL_AUDIT_BASE_URL ?? "http://127.0.0.1:3100";
const outDir = process.env.VISUAL_AUDIT_OUT ?? "test-results/visual-audit";
const viewport = { width: 1440, height: 1000 };

type AuditIssue = {
  type: "console" | "pageerror" | "http" | "overflow" | "missing-marker" | "dialog-open";
  target: string;
  detail: string;
};

type ScreenAudit = {
  id: string;
  route: string;
  domain: string;
  title: string;
  screenshot: string;
  scrollWidth: number;
  clientWidth: number;
  issues: AuditIssue[];
};

type DialogAudit = {
  id: string;
  route: string;
  title: string;
  domain: string;
  screenshot?: string;
  issues: AuditIssue[];
};

function slug(input: string) {
  return input.replace(/^\//, "").replace(/[^a-zA-Z0-9가-힣_-]+/g, "-") || "root";
}

async function prepare() {
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(path.join(outDir, "screens"), { recursive: true });
  await fs.mkdir(path.join(outDir, "dialogs"), { recursive: true });
}

async function newPage(browser: Browser, issues: AuditIssue[], target: string) {
  const page = await browser.newPage({ viewport });
  page.on("console", (msg) => {
    if (["error", "warning"].includes(msg.type())) issues.push({ type: "console", target, detail: `${msg.type()}: ${msg.text()}` });
  });
  page.on("pageerror", (error) => issues.push({ type: "pageerror", target, detail: error.message }));
  page.on("response", (response) => {
    if (response.status() >= 400) issues.push({ type: "http", target, detail: `${response.status()} ${response.url()}` });
  });
  return page;
}

async function auditScreen(browser: Browser, screen: ScreenDefinition): Promise<ScreenAudit> {
  const target = `${screen.id} ${screen.route}`;
  const issues: AuditIssue[] = [];
  const page = await newPage(browser, issues, target);
  await page.goto(`${baseURL}${screen.route}`, { waitUntil: "networkidle" });
  await page.locator("body").waitFor({ state: "visible" });
  const metrics = await page.evaluate((expectedId) => {
    const doc = document.documentElement;
    const bodyText = document.body.innerText;
    const clipped = Array.from(document.querySelectorAll("button,a,input,textarea,select,[role='dialog'],table")).flatMap((element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      if (rect.width === 0 || rect.height === 0 || style.visibility === "hidden" || style.display === "none") return [];
      const scrollContainer = element.closest(".overflow-x-auto, [data-allow-horizontal-scroll='true']");
      const insideExpectedHorizontalScroll = Boolean(scrollContainer);
      const overflow = !insideExpectedHorizontalScroll && (rect.left < -2 || rect.right > window.innerWidth + 2);
      return overflow ? [`${element.tagName.toLowerCase()} ${Math.round(rect.left)}..${Math.round(rect.right)}`] : [];
    }).slice(0, 8);
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      hasExpectedId: bodyText.includes(expectedId),
      clipped
    };
  }, screen.id);
  if (metrics.scrollWidth > metrics.clientWidth + 3 || metrics.clipped.length) {
    issues.push({ type: "overflow", target, detail: `scrollWidth=${metrics.scrollWidth}, clientWidth=${metrics.clientWidth}, clipped=${metrics.clipped.join(" | ")}` });
  }
  if (!metrics.hasExpectedId) issues.push({ type: "missing-marker", target, detail: `${screen.id} marker not visible` });
  const screenshot = path.join("screens", `${screen.domain}-${screen.id}-${slug(screen.route)}.png`);
  await page.screenshot({ path: path.join(outDir, screenshot), fullPage: true });
  await page.close();
  return { id: screen.id, route: screen.route, domain: screen.domain, title: screen.title, screenshot, scrollWidth: metrics.scrollWidth, clientWidth: metrics.clientWidth, issues };
}

function routeForDialog(dialog: DialogDefinition) {
  return screens.find((screen) => screen.dialogs.includes(dialog.id))?.route ?? "/dialogs";
}

async function auditDialog(browser: Browser, dialog: DialogDefinition): Promise<DialogAudit> {
  const route = routeForDialog(dialog);
  const target = `${dialog.id} ${route}`;
  const issues: AuditIssue[] = [];
  const page = await newPage(browser, issues, target);
  await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle" });
  let trigger = page.locator(`[data-dialog-id="${dialog.id}"]`).first();
  try {
    if ((await trigger.count()) === 0 || !(await trigger.isEnabled().catch(() => false))) {
      const supportButton = page.getByRole("button", { name: "문서/계약" });
      if ((await supportButton.count()) > 0) {
        await supportButton.click();
        trigger = page.getByTestId("screen-support-drawer").locator(`[data-dialog-id="${dialog.id}"]`).first();
      }
    }
    if ((await trigger.count()) === 0) {
      issues.push({ type: "dialog-open", target, detail: "no data-dialog-id trigger on route or support drawer" });
      await page.screenshot({ path: path.join(outDir, "dialogs", `${dialog.domain}-${dialog.id}-FAILED.png`), fullPage: true });
      await page.close();
      return { id: dialog.id, route, title: dialog.title, domain: dialog.domain, issues };
    }
    await trigger.waitFor({ state: "visible", timeout: 1500 });
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    const modal = page.getByRole("dialog");
    await modal.waitFor({ state: "visible", timeout: 2000 });
    const text = await modal.innerText();
    if (!text.includes(dialog.id) || !text.includes(dialog.title)) {
      issues.push({ type: "missing-marker", target, detail: `dialog title/id not visible in modal` });
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 3);
    if (overflow) issues.push({ type: "overflow", target, detail: "horizontal overflow while dialog open" });
    const screenshot = path.join("dialogs", `${dialog.domain}-${dialog.id}.png`);
    await modal.screenshot({ path: path.join(outDir, screenshot) });
    await page.close();
    return { id: dialog.id, route, title: dialog.title, domain: dialog.domain, screenshot, issues };
  } catch (error) {
    issues.push({ type: "dialog-open", target, detail: error instanceof Error ? error.message : String(error) });
    await page.screenshot({ path: path.join(outDir, "dialogs", `${dialog.domain}-${dialog.id}-FAILED.png`), fullPage: true });
    await page.close();
    return { id: dialog.id, route, title: dialog.title, domain: dialog.domain, issues };
  }
}

async function main() {
  await prepare();
  const browser = await chromium.launch();
  const screenAudits: ScreenAudit[] = [];
  for (const screen of screens) screenAudits.push(await auditScreen(browser, screen));

  const dialogAudits: DialogAudit[] = [];
  for (const dialog of dialogs) dialogAudits.push(await auditDialog(browser, dialog));
  await browser.close();

  const issues = [...screenAudits.flatMap((item) => item.issues), ...dialogAudits.flatMap((item) => item.issues)];
  const report = { baseURL, generatedAt: new Date().toISOString(), viewport, counts: { screens: screenAudits.length, dialogs: dialogAudits.length, issues: issues.length }, screenAudits, dialogAudits, issues };
  await fs.writeFile(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
  await fs.writeFile(path.join(outDir, "summary.txt"), `screens=${screenAudits.length}\ndialogs=${dialogAudits.length}\nissues=${issues.length}\n` + issues.map((issue) => `[${issue.type}] ${issue.target}: ${issue.detail}`).join("\n"));
  console.log(`Visual audit complete: screens=${screenAudits.length}, dialogs=${dialogAudits.length}, issues=${issues.length}`);
  if (issues.length) {
    console.error(issues.slice(0, 30).map((issue) => `[${issue.type}] ${issue.target}: ${issue.detail}`).join("\n"));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
