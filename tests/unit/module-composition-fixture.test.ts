/**
 * Composition proof: the LIVE base registry (`listBaseModules()`) combined with
 * the in-repo example DOMAIN modules
 * (`tests/fixtures/example-domain-modules/`, see its own header for what it
 * illustrates) validates cleanly — proving the composition rule engine accepts
 * domain modules added to the registry (the same shape as adding them directly
 * to `src/modules/`), with their dependencies satisfied by real base modules.
 * No database, no network — composition is a pure, synchronous, in-memory
 * operation, so this test always runs (never silently skipped without
 * `DATABASE_URL`, unlike this repo's `*.integration.test.ts` suite).
 *
 * ADR-0036 removed the derived-application pathway; this test is the
 * test-support successor to the former `derived-application-example` composition
 * proof. It still proves:
 * - the example DOMAIN modules live entirely under `tests/fixtures/`;
 *   `src/modules/index.ts` is never imported or mutated by this file, and the
 *   base registry never registers them.
 * - the composed registry compiles (TypeScript required valid syntax/types to
 *   get here) and independently passes the same whole-registry DAG check
 *   `bun run modules:dag:check` runs.
 * - repository inventory supports base-only and composed modes without touching
 *   the committed `docs/awcms-micro/repo-inventory.md`.
 */
import { describe, expect, test } from "bun:test";

import { listBaseModules, listModules } from "../../src/modules";
import { buildRepoInventoryMarkdown } from "../../scripts/repo-inventory-generate";
import {
  buildComposedModuleInventory,
  composeModuleRegistry
} from "../../src/modules/module-management/domain/module-composition";
import { validateModuleDependencyGraph } from "../../src/modules/module-management/domain/module-dependency-graph";
import { planModuleSync } from "../../src/modules/module-management/domain/descriptor-diff";
import { exampleDomainModules } from "../fixtures/example-domain-modules";

const composed = () => [...listBaseModules(), ...exampleDomainModules];

describe("base registry + example domain modules compose cleanly", () => {
  test("composition succeeds and includes both example modules", () => {
    const result = composeModuleRegistry(composed());

    expect(result.valid).toBe(true);
    if (result.valid) {
      const keys = result.registry.map((m) => m.key);
      expect(keys).toContain("example_crm");
      expect(keys).toContain("example_loyalty");
      expect(keys.length).toBe(listBaseModules().length + 2);
    }
  });

  test("the composed registry independently passes the same whole-registry DAG check `bun run modules:dag:check` runs", () => {
    const result = composeModuleRegistry(composed());
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(validateModuleDependencyGraph(result.registry)).toEqual({
        valid: true
      });
    }
  });

  test("example_loyalty's domain-to-domain lifecycle dependency on example_crm resolves inside the composed graph", () => {
    const result = composeModuleRegistry(composed());
    expect(result.valid).toBe(true);
    if (result.valid) {
      const loyalty = result.registry.find((m) => m.key === "example_loyalty");
      expect(loyalty?.dependencies).toContain("example_crm");
    }
  });

  test("the base repository's own listModules() is completely unaffected — the example modules live only in the test fixture", () => {
    const keys = listModules().map((m) => m.key);
    expect(keys).not.toContain("example_crm");
    expect(keys).not.toContain("example_loyalty");
    expect(listModules()).toEqual(listBaseModules());
  });

  test("buildComposedModuleInventory produces a deterministic snapshot that reflects both example modules' permissions/navigation/jobs/capabilities", () => {
    const inventory = buildComposedModuleInventory(composed());

    expect(inventory.valid).toBe(true);
    expect(inventory.moduleCount).toBe(listBaseModules().length + 2);

    const crm = inventory.modules.find((m) => m.key === "example_crm");
    expect(crm).toBeDefined();
    expect(crm?.type).toBe("domain");
    expect(crm?.capabilitiesProvided).toEqual(["example_crm_directory"]);
    expect(crm?.permissionCount).toBe(1);
    expect(crm?.navigationCount).toBe(1);
    expect(crm?.jobCount).toBe(1);
    expect(crm?.deploymentProfiles).toEqual(["development", "offline-lan"]);

    const loyalty = inventory.modules.find((m) => m.key === "example_loyalty");
    expect(loyalty?.capabilitiesConsumed).toEqual([
      {
        capability: "example_crm_directory",
        providedBy: "example_crm",
        optional: false
      }
    ]);
  });

  test("repository inventory generation (base-only mode) does not include the example modules", async () => {
    const markdown = await buildRepoInventoryMarkdown();
    expect(markdown).not.toContain("example_crm");
    expect(markdown).not.toContain("example_loyalty");
  });

  test("repository inventory generation (composed mode) succeeds and includes the example modules, without touching the committed doc", async () => {
    const result = composeModuleRegistry(composed());
    expect(result.valid).toBe(true);
    if (!result.valid) return;

    const markdown = await buildRepoInventoryMarkdown(
      process.cwd(),
      result.registry
    );
    expect(markdown).toContain("`example_crm`");
    expect(markdown).toContain("`example_loyalty`");
    // Every base module key is still present too — composed mode is additive,
    // never a replacement of the base inventory.
    for (const module of listBaseModules()) {
      expect(markdown).toContain(`\`${module.key}\``);
    }
  });

  test("module-management's descriptor-sync planning (planModuleSync) consumes the composed registry, creating an entry for every module", () => {
    const result = composeModuleRegistry(composed());
    expect(result.valid).toBe(true);
    if (!result.valid) return;

    // Empty `existingRows` — same as a freshly-migrated instance that has never
    // run `bun run modules:sync` yet (`module-management/README.md`'s own
    // documented "sync first" scenario).
    const plan = planModuleSync(result.registry, []);

    expect(plan.entries.length).toBe(result.registry.length);
    expect(plan.entries.every((e) => e.action === "create")).toBe(true);
    expect(plan.entries.map((e) => e.moduleKey)).toContain("example_crm");
    expect(plan.entries.map((e) => e.moduleKey)).toContain("example_loyalty");
    expect(plan.orphanedModuleKeys).toEqual([]);
  });
});
