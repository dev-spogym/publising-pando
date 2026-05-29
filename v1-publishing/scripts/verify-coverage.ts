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
    while ((match = regex.exec(text))) {
      // docs4 V1 D05는 `## DLG-Pxxx-한글이름` 형식을 사용. 코드는 단순 ID(DLG-Pxxx) 기준.
      // 한글 suffix(`-한글이름`)를 떼어내 코드 ID와 매칭한다.
      // 예: DLG-P023-시즌가격등록수정 → DLG-P023
      const raw = match[1];
      const normalized = kind === "DLG" && /^DLG-P\d+-[^\x00-\x7F]/.test(raw)
        ? raw.replace(/^(DLG-P\d+)-[^\x00-\x7F].*$/, "$1")
        : raw;
      ids.add(normalized);
    }
  }
  return [...ids].sort();
}

// v1-publishing 측 ID도 docs4 추출 측과 동일한 규칙으로 정규화한다.
// 예: v1-publishing의 `DLG-P001-상품등록모달`도 비교 시 `DLG-P001`로 압축.
function normalizeDialogId(id: string): string {
  return /^DLG-P\d+-[^\x00-\x7F]/.test(id) ? id.replace(/^(DLG-P\d+)-[^\x00-\x7F].*$/, "$1") : id;
}

const expectedScreens = extractIds("SCR");
const expectedDialogs = extractIds("DLG");
const actualScreens = screens.map((screen) => screen.id).sort();
const actualDialogs = [...new Set(dialogs.map((dialog) => normalizeDialogId(dialog.id)))].sort();

function diff(expected: string[], actual: string[]) {
  return {
    missing: expected.filter((id) => !actual.includes(id)),
    extra: actual.filter((id) => !expected.includes(id))
  };
}

const screenDiff = diff(expectedScreens, actualScreens);
const dialogDiff = diff(expectedDialogs, actualDialogs);
const routeIssues = screens.filter((screen) => !screen.route.startsWith("/")).map((screen) => `${screen.id}:${screen.route}`);
const linkedDialogIds = new Set<string>();
for (const screen of screens) {
  for (const did of screen.dialogs) linkedDialogIds.add(normalizeDialogId(did));
}
const unlinkedDialogs = actualDialogs.filter((id) => !linkedDialogIds.has(id));

const report = `# V1 D01~D11 Coverage Report\n\n- Generated: ${new Date().toISOString()}\n- 기준 문서: docs4/V1 D01~D11 화면설계 문서\n- 화면 구현: ${actualScreens.length}/${expectedScreens.length}\n- 다이얼로그 구현: ${actualDialogs.length}/${expectedDialogs.length}\n- 라우트 오류: ${routeIssues.length}\n- 화면 연결 없는 DLG: ${unlinkedDialogs.length}\n\n## Missing Screens\n${screenDiff.missing.map((id) => `- ${id}`).join("\n") || "- 없음"}\n\n## Missing Dialogs\n${dialogDiff.missing.map((id) => `- ${id}`).join("\n") || "- 없음"}\n\n## Extra Implementations\n${[...screenDiff.extra, ...dialogDiff.extra].map((id) => `- ${id}`).join("\n") || "- 없음"}\n\n## Routes\n${screens.map((screen) => `- ${screen.id} ${screen.title}: \`${screen.route}\``).join("\n")}\n`;

writeFileSync(resolve(__dirname, "../CHECKLIST.md"), report);

if (screenDiff.missing.length || dialogDiff.missing.length || routeIssues.length || unlinkedDialogs.length) {
  console.error(report);
  if (unlinkedDialogs.length) console.error("Unlinked dialogs:", unlinkedDialogs.join(", "));
  process.exit(1);
}

console.log(report);
