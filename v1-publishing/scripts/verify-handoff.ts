import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { dialogs, screens } from "../app/data/registry";
import { getDialogContract, getScreenContract } from "../app/data/contracts";

const requiredDocs = ["DELIVERY_CRITERIA.md", "HANDOFF.md", "API_CONTRACTS.md", "ROLE_POLICY.md", "SCREEN_ROUTES.md", "POLICY_PENDING.md"];
const missingDocs = requiredDocs.filter((file) => !existsSync(resolve(__dirname, `../${file}`)));
const screenIssues = screens.flatMap((screen) => {
  const contract = getScreenContract(screen);
  const issues: string[] = [];
  if (!contract.apiContracts.length) issues.push(`${screen.id}: missing apiContracts`);
  if (!contract.stateMatrix.length) issues.push(`${screen.id}: missing stateMatrix`);
  if (screen.primaryActions.length && !contract.actionContracts.length) issues.push(`${screen.id}: missing actionContracts`);
  return issues;
});
const dialogIssues = dialogs.flatMap((dialog) => {
  const contract = getDialogContract(dialog);
  const issues: string[] = [];
  if (!contract.fields.length) issues.push(`${dialog.id}: missing fields`);
  if (!contract.submitContract.endpoint) issues.push(`${dialog.id}: missing endpoint`);
  return issues;
});
const apiDoc = existsSync(resolve(__dirname, "../API_CONTRACTS.md")) ? readFileSync(resolve(__dirname, "../API_CONTRACTS.md"), "utf8") : "";
const undocumentedScreens = screens.filter((screen) => !apiDoc.includes(screen.id)).map((screen) => screen.id);
const undocumentedDialogs = dialogs.filter((dialog) => !apiDoc.includes(dialog.id)).map((dialog) => dialog.id);

if (missingDocs.length || screenIssues.length || dialogIssues.length || undocumentedScreens.length || undocumentedDialogs.length) {
  console.error(JSON.stringify({ missingDocs, screenIssues, dialogIssues, undocumentedScreens, undocumentedDialogs }, null, 2));
  process.exit(1);
}

console.log(`Handoff verification passed: ${screens.length} screens, ${dialogs.length} dialogs, ${requiredDocs.length} docs.`);
