import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it } from "node:test";
import * as registryModule from "../../app/data/registry";

const { dialogs, screens } = ((registryModule as { default?: typeof registryModule }).default ?? registryModule);

function manifest() {
  const domains = [...new Set(screens.map((screen) => screen.domain))].sort();
  return {
    counts: { screens: screens.length, dialogs: dialogs.length, domains: domains.length },
    domains: Object.fromEntries(domains.map((domain) => [domain, screens.filter((screen) => screen.domain === domain).length])),
    screens: screens.map((screen) => ({ id: screen.id, domain: screen.domain, route: screen.route, dialogs: screen.dialogs.length, actions: screen.primaryActions.length })),
    dialogs: dialogs.map((dialog) => ({ id: dialog.id, domain: dialog.domain, destructive: Boolean(dialog.destructive), components: dialog.components.length }))
  };
}

describe("Snapshot Test — publishing manifest", () => {
  it("matches the approved screen/dialog manifest snapshot", () => {
    const snapshotPath = resolve(import.meta.dirname, "../snapshots/publishing-manifest.json");
    const expected = JSON.parse(readFileSync(snapshotPath, "utf8"));
    assert.deepEqual(manifest(), expected);
  });
});
