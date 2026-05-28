import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { dialogs, roles, screens } from "../app/data/registry";
import { getDialogContract, getHandoffStatus, getScreenContract } from "../app/data/contracts";

const out = (file: string, body: string) => writeFileSync(resolve(__dirname, `../${file}`), body);
const now = new Date().toISOString();

out("DELIVERY_CRITERIA.md", `# V1 Publishing Delivery Criteria\n\nGenerated: ${now}\n\n## 퍼블리싱 정의\n- 모든 버튼/탭/필터/모달/폼은 클릭 가능해야 한다.\n- 실제 API/DB/결제/알림 발송은 제외하지만, 화면 안에서는 mock state, toast, validation, disabled reason, policy notice로 피드백을 제공해야 한다.\n- 개발사는 본 산출물의 contract 문서를 기준으로 API와 비즈니스 로직을 연결한다.\n\n## Done 기준\n1. SCR/DLG 문서 커버리지 100%.\n2. 화면별 route/query/table/form/action contract 존재.\n3. 역할별 권한 차등과 blocked reason 존재.\n4. 핵심 업무 플로우 E2E 통과.\n5. policy/external integration pending 항목은 임의 구현하지 않고 명시.\n`);

out("SCREEN_ROUTES.md", `# V1 Screen Routes\n\nGenerated: ${now}\n\n| ID | 화면 | Domain | Route | Handoff | DLG | Source |\n|---|---|---|---|---|---:|---|\n${screens.map((screen) => `| ${screen.id} | ${screen.title} | ${screen.domain} | \`${screen.route}\` | ${getHandoffStatus(screen)} | ${screen.dialogs.length} | ${screen.source} |`).join("\n")}\n`);

out("ROLE_POLICY.md", `# V1 Role Policy\n\nGenerated: ${now}\n\n## Roles\n| Role | Label | Scope | Permissions |\n|---|---|---|---|\n${roles.map((role) => `| ${role.id} | ${role.label} | ${role.branchScope} | ${role.permissions.join(", ") || "조회 중심"} |`).join("\n")}\n\n## Action Matrix\n| Screen | Action | Permission | Allowed Roles | Audit | Blocked Reason |\n|---|---|---|---|---|---|\n${screens.flatMap((screen) => getScreenContract(screen).actionContracts.map((action) => `| ${screen.id} | ${action.label} | ${action.requiredPermission ?? "none"} | ${action.allowedRoles.join(", ")} | ${action.auditRequired ? "Y" : "N"} | ${action.blockedReason} |`)).join("\n")}\n`);

out("API_CONTRACTS.md", `# V1 API Contracts for Development Handoff\n\nGenerated: ${now}\n\n> 실제 API는 구현하지 않습니다. 아래 endpoint/request/response는 개발 연결용 mock contract입니다.\n\n## Screen Contracts\n${screens.map((screen) => {
  const contract = getScreenContract(screen);
  return `### ${screen.id} ${screen.title}\n- Route: \`${screen.route}\`\n- Handoff: ${contract.handoffStatus}\n- Query Params: ${contract.queryParams.map((field) => `\`${field.name}\``).join(", ") || "none"}\n- States: ${contract.stateMatrix.join(", ")}\n\n| Key | Method | Endpoint | Purpose | Response |\n|---|---|---|---|---|\n${contract.apiContracts.map((api) => `| ${api.key} | ${api.method} | \`${api.endpoint}\` | ${api.purpose} | \`${api.responseShape}\` |`).join("\n")}\n`;
}).join("\n")}\n\n## Dialog Submit Contracts\n${dialogs.map((dialog) => {
  const contract = getDialogContract(dialog);
  return `### ${dialog.id} ${dialog.title}\n- Handoff: ${contract.handoffStatus}\n- Endpoint: \`${contract.submitContract.endpoint}\`\n- Request: \`${contract.submitContract.requestShape}\`\n- States: ${contract.stateMatrix.join(", ")}\n`;
}).join("\n")}\n`);

out("POLICY_PENDING.md", `# V1 Policy / External Integration Pending\n\nGenerated: ${now}\n\n## Screens\n| ID | Title | Status | Source |\n|---|---|---|---|\n${screens.filter((screen) => getHandoffStatus(screen) !== "production-ready").map((screen) => `| ${screen.id} | ${screen.title} | ${getHandoffStatus(screen)} | ${screen.source} |`).join("\n") || "| - | - | - | - |"}\n\n## Dialogs\n| ID | Title | Status | Source |\n|---|---|---|---|\n${dialogs.filter((dialog) => getHandoffStatus(dialog) !== "production-ready").map((dialog) => `| ${dialog.id} | ${dialog.title} | ${getHandoffStatus(dialog)} | ${dialog.source} |`).join("\n") || "| - | - | - | - |"}\n`);

out("HANDOFF.md", `# V1 Publishing Handoff\n\nGenerated: ${now}\n\n## 실행\n\n\`\`\`bash\nnpm install\nnpm run dev\n# or\nnpm run build && npm run preview\n\`\`\`\n\n## 검증\n\n\`\`\`bash\nnpm run verify:coverage\nnpm run verify:handoff\nnpm run lint\nnpm run typecheck\nnpm run build\nnpm run test:e2e\n\`\`\`\n\n## 구조\n- \`app/data/registry.ts\`: D01~D03 핵심 수작업 화면/권한/모달 데이터.\n- \`app/data/v1-extra.ts\`: D04~D11 및 잔여 V1 화면/모달 데이터.\n- \`app/data/contracts.ts\`: 개발 연결용 API/form/action/state contract 생성.\n- \`components/prototype-app.tsx\`: 현재 퍼블리싱 shell + mock interaction.\n- \`scripts/verify-coverage.ts\`: docs4/V1 SCR/DLG 커버리지 검증.\n- \`scripts/verify-handoff.ts\`: 납품 contract/doc 검증.\n\n## 개발 연결 규칙\n1. UI 이벤트는 \`actionId\` 기준으로 backend mutation에 연결한다.\n2. \`policy-pending\`, \`external-integration-pending\`은 임의 구현하지 말고 정책 확정 후 API contract를 갱신한다.\n3. 권한 차단은 버튼 제거보다 disabled reason 또는 권한 안내를 우선한다.\n4. 퍼블리싱 mock toast는 실제 mutation success/error toast로 치환한다.\n`);

console.log(`Generated handoff docs for ${screens.length} screens and ${dialogs.length} dialogs.`);
