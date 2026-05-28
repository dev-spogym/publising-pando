import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { dialogs, screens } from "../app/data/registry";

const root = resolve(__dirname, "../..");
const sources = [
  "share/docs4/V1/D01-공통/공통.md",
  "share/docs4/V1/D02-회원관리/회원관리.md",
  "share/docs4/V1/D03-매출관리/매출관리.md",
  "share/docs4/V1/D04-수업관리/수업관리.md",
  "share/docs4/V1/D05-상품관리/상품관리.md",
  "share/docs4/V1/D06-시설관리/시설관리.md",
  "share/docs4/V1/D07-직원관리/직원관리.md",
  "share/docs4/V1/D08-마케팅/마케팅.md",
  "share/docs4/V1/D09-설정관리/설정관리.md",
  "share/docs4/V1/D10-본사관리/본사관리.md",
  "share/docs4/V1/D11-통합운영/통합운영.md"
];

function extractIds(kind: "SCR" | "DLG") {
  const ids = new Set<string>();
  for (const source of sources) {
    const text = readFileSync(resolve(root, source), "utf8");
    const regex = new RegExp(`^## (${kind}-\\S+)`, "gm");
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text))) ids.add(match[1]);
  }
  return [...ids].sort();
}

const expectedScreens = extractIds("SCR");
const expectedDialogs = extractIds("DLG");
const actualScreens = screens.map((screen) => screen.id).sort();
const actualDialogs = dialogs.map((dialog) => dialog.id).sort();

function diff(expected: string[], actual: string[]) {
  return {
    missing: expected.filter((id) => !actual.includes(id)),
    extra: actual.filter((id) => !expected.includes(id))
  };
}

const screenDiff = diff(expectedScreens, actualScreens);
const dialogDiff = diff(expectedDialogs, actualDialogs);
const routeIssues = screens.filter((screen) => !screen.route.startsWith("/")).map((screen) => `${screen.id}:${screen.route}`);
const unlinkedDialogs = actualDialogs.filter((id) => !screens.some((screen) => screen.dialogs.includes(id)));

const report = `# V1 D01~D11 Coverage Report\n\n- Generated: ${new Date().toISOString()}\n- 기준 문서: docs4/V1 D01~D11 화면설계 문서\n- 화면 구현: ${actualScreens.length}/${expectedScreens.length}\n- 다이얼로그 구현: ${actualDialogs.length}/${expectedDialogs.length}\n- 라우트 오류: ${routeIssues.length}\n- 화면 연결 없는 DLG: ${unlinkedDialogs.length}\n\n## Missing Screens\n${screenDiff.missing.map((id) => `- ${id}`).join("\n") || "- 없음"}\n\n## Missing Dialogs\n${dialogDiff.missing.map((id) => `- ${id}`).join("\n") || "- 없음"}\n\n## Extra Implementations\n${[...screenDiff.extra, ...dialogDiff.extra].map((id) => `- ${id}`).join("\n") || "- 없음"}\n\n## Routes\n${screens.map((screen) => `- ${screen.id} ${screen.title}: \`${screen.route}\``).join("\n")}\n`;

writeFileSync(resolve(__dirname, "../CHECKLIST.md"), report);

if (screenDiff.missing.length || dialogDiff.missing.length || routeIssues.length || unlinkedDialogs.length) {
  console.error(report);
  if (unlinkedDialogs.length) console.error("Unlinked dialogs:", unlinkedDialogs.join(", "));
  process.exit(1);
}

console.log(report);
