import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it } from "node:test";
import * as registryModule from "../../app/data/registry";

const { dialogs, screens } = ((registryModule as { default?: typeof registryModule }).default ?? registryModule);
import { getDialogContract, getScreenContract } from "../../app/data/contracts";

const root = resolve(import.meta.dirname, "../..");
const docs = ["DELIVERY_CRITERIA.md", "HANDOFF.md", "API_CONTRACTS.md", "ROLE_POLICY.md", "SCREEN_ROUTES.md", "POLICY_PENDING.md"];
const forbiddenDevelopmentOwnershipTerms = [
  /개발 핸드오프/,
  /개발 연결/,
  /Development Handoff/,
  /backend mutation/,
  /실제 mutation/,
  /service layer/,
  /프론트 개발자/,
  /개발 service/,
  /개발 인수/,
  /개발 단계/
];

describe("Contract Test — publishing/mock contract boundary", () => {
  it("keeps required publishing contract documents present", () => {
    for (const doc of docs) assert.ok(existsSync(resolve(root, doc)), `${doc} must exist`);
  });

  it("does not describe this deliverable as API/frontend development ownership", () => {
    const files = [
      ...docs,
      "app/data/registry.ts",
      "app/data/docs4-sources.ts",
      "app/data/domains/d01v2.ts",
      "components/prototype-app.tsx",
      "scripts/generate-handoff-docs.ts"
    ];
    const violations: string[] = [];
    for (const file of files) {
      const text = readFileSync(resolve(root, file), "utf8");
      for (const pattern of forbiddenDevelopmentOwnershipTerms) {
        if (pattern.test(text)) violations.push(`${file}: ${pattern}`);
      }
    }
    assert.deepEqual(violations, []);
  });

  it("marks every screen and dialog contract as mocked, not real API", () => {
    const unmockedScreens = screens.flatMap((screen) => getScreenContract(screen).apiContracts.filter((api) => !api.mocked).map((api) => api.key));
    const unmockedDialogs = dialogs.flatMap((dialog) => (getDialogContract(dialog).submitContract.mocked ? [] : [dialog.id]));
    assert.deepEqual([...unmockedScreens, ...unmockedDialogs], []);
  });

  it("keeps action IDs unique enough for vendors to map later implementation", () => {
    const actionIds = screens.flatMap((screen) => getScreenContract(screen).actionContracts.map((action) => action.actionId));
    assert.equal(new Set(actionIds).size, actionIds.length);
  });
});
