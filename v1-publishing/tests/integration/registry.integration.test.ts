import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as registryModule from "../../app/data/registry";

const { dialogs, screens } = ((registryModule as { default?: typeof registryModule }).default ?? registryModule);
import { getDialogContract, getScreenContract } from "../../app/data/contracts";

describe("Integration Test — registry, routes, dialogs, contracts", () => {
  it("keeps every screen on a unique routable URL", () => {
    const byRoute = new Map<string, string[]>();
    for (const screen of screens) {
      assert.ok(screen.route.startsWith("/"), `${screen.id} route must start with /`);
      byRoute.set(screen.route, [...(byRoute.get(screen.route) ?? []), screen.id]);
    }
    const duplicates = [...byRoute.entries()].filter(([, ids]) => ids.length > 1);
    assert.deepEqual(duplicates, []);
  });

  it("connects every DLG definition to at least one screen", () => {
    const connectedDialogIds = new Set(screens.flatMap((screen) => screen.dialogs));
    const missing = dialogs.filter((dialog) => !connectedDialogIds.has(dialog.id)).map((dialog) => dialog.id);
    assert.deepEqual(missing, []);
  });

  it("keeps screen action dialog references valid", () => {
    const dialogIds = new Set(dialogs.map((dialog) => dialog.id));
    const invalidRefs = screens.flatMap((screen) =>
      screen.primaryActions
        .filter((action) => action.dialogId && !dialogIds.has(action.dialogId))
        .map((action) => `${screen.id}:${action.label}->${action.dialogId}`)
    );
    assert.deepEqual(invalidRefs, []);
  });

  it("generates usable contracts for the full screen/dialog registry", () => {
    for (const screen of screens) {
      const contract = getScreenContract(screen);
      assert.ok(contract.stateMatrix.length >= 5, `${screen.id} state matrix`);
      assert.ok(contract.apiContracts.length >= 1, `${screen.id} api contracts`);
    }
    for (const dialog of dialogs) {
      const contract = getDialogContract(dialog);
      assert.ok(contract.submitContract.endpoint, `${dialog.id} endpoint`);
      assert.ok(contract.stateMatrix.includes("closed"), `${dialog.id} closed state`);
    }
  });
});
