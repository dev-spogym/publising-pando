import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as registryModule from "../../app/data/registry";
import * as contractsModule from "../../app/data/contracts";

const { dialogs, screens } = ((registryModule as { default?: typeof registryModule }).default ?? registryModule);
const { getActionContract, getDialogContract, getHandoffStatus, getScreenContract } = ((contractsModule as { default?: typeof contractsModule }).default ?? contractsModule);

describe("Unit Test — publishing contract helpers", () => {
  it("classifies handoff status by policy/domain without touching real APIs", () => {
    const commonScreen = screens.find((screen) => screen.domain === "D01" && !screen.policyPending)!;
    const laterDomainScreen = screens.find((screen) => screen.domain === "D04" && !screen.policyPending)!;

    assert.equal(getHandoffStatus(commonScreen), "production-ready");
    assert.equal(getHandoffStatus(laterDomainScreen), "template-ready");
    assert.equal(getHandoffStatus({ ...commonScreen, policyPending: true }), "policy-pending");
  });

  it("creates action contracts with permission gating and mock behavior", () => {
    const screen = screens.find((item) => item.primaryActions.some((action) => action.permission))!;
    const action = screen.primaryActions.find((item) => item.permission)!;
    const contract = getActionContract(screen, action, 0);

    assert.match(contract.actionId, new RegExp(`^${screen.id}\\.`));
    assert.equal(contract.requiredPermission, action.permission);
    assert.ok(contract.allowedRoles.length > 0);
    assert.match(contract.blockedReason, new RegExp(action.permission!));
    assert.ok(["open-dialog", "toast", "local-state"].includes(contract.mockBehavior));
  });

  it("creates screen contracts that are explicitly mocked", () => {
    const screen = screens.find((item) => item.id === "SCR-M004") ?? screens[0];
    const contract = getScreenContract(screen);

    assert.ok(contract.stateMatrix.includes("mock success toast"));
    assert.ok(contract.apiContracts.length >= 1);
    assert.ok(contract.apiContracts.every((api) => api.mocked === true));
    assert.ok(contract.apiContracts.every((api) => api.endpoint.startsWith("/api/admin")));
    assert.ok(contract.developerNotes.some((note) => note.includes("mock toast/local state")));
  });

  it("creates dialog submit contracts with destructive method only for destructive DLG", () => {
    const destructive = dialogs.find((dialog) => dialog.destructive)!;
    const normal = dialogs.find((dialog) => !dialog.destructive)!;

    assert.equal(getDialogContract(destructive).submitContract.method, "DELETE");
    assert.equal(getDialogContract(normal).submitContract.method, "POST");
    assert.equal(getDialogContract(normal).submitContract.mocked, true);
  });
});
