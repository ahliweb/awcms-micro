/**
 * scope-consistency-check.ts — `bun run scope:consistency:check`.
 *
 * A read-only consistency gate (Issue #263, epic #261) that fails `bun run
 * check` on the specific source-of-truth drift ADR-0025 keeps re-introducing:
 * an active implementation inventory (module registry, AsyncAPI event
 * channels, OpenAPI paths, generated repo/module inventories) that reintroduces
 * one of the SEVEN ERP-scope modules AWCMS-Micro deliberately does NOT port, or
 * an active doc/inventory that claims a module count other than the real
 * WEBSITE-scoped registry.
 *
 * AWCMS-Micro is the awcms-mini standard narrowed to WEBSITE scope (ADR-0025).
 * The 17-module registry is the source of truth; the seven modules below are
 * excluded BY DECISION (ADR-0025 §Konsekuensi), not backlog. A derived ERP app
 * adds one via `src/modules/application-registry.ts` (ADR-0014), never by
 * editing the base registry — so an excluded module reappearing in the base
 * registry, the base API/event contracts, or the generated base inventories is
 * always a regression this gate catches.
 *
 * This is the finer-grained complement to the existing structural gates
 * (`repo:inventory:check`, `modules:composition:inventory:check`,
 * `api:spec:check`): those prove the generated artifacts match the live
 * descriptors, but none of them asserts the EXCLUSION invariant or the
 * module-count anchor — an ERP module re-added to the registry would keep every
 * one of them internally consistent while silently breaking ADR-0025.
 *
 * The helper functions are pure and unit-tested with synthetic good/bad inputs
 * (`tests/unit/scope-consistency-check.test.ts`); the runner wires them to the
 * live registry, the bundled OpenAPI/AsyncAPI contracts, and the generated
 * inventories.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

import { parse } from "yaml";

/**
 * The seven ERP-scope modules deliberately NOT ported to AWCMS-Micro
 * (ADR-0025 §"Modul yang tidak diport"). Underscore `key` form — as they would
 * appear in `src/modules/index.ts`, `module.ts` descriptors, and the generated
 * inventories.
 */
export const EXCLUDED_MODULE_KEYS = [
  "workflow",
  "workflow_approval",
  "organization_structure",
  "document_infrastructure",
  "data_exchange",
  "integration_hub",
  "reference_data",
  "idn_admin_regions"
] as const;

/**
 * The hyphenated namespace form of each excluded module, as it would appear in
 * an AsyncAPI channel key (`awcms-micro.<ns>.…`), an OpenAPI path segment
 * (`/<ns>/…`), or an inventory route/table reference. `workflow` is listed as
 * both `workflow` and `workflows` because a route is conventionally pluralized.
 */
export const EXCLUDED_MODULE_NAMESPACES = [
  "workflow",
  "workflows",
  "workflow-approval",
  "organization-structure",
  "document-infrastructure",
  "data-exchange",
  "integration-hub",
  "reference-data",
  "idn-admin-regions"
] as const;

/**
 * The size of the real WEBSITE-scoped base registry. A hard anchor: a derived
 * ERP app composes extra modules through `application-registry.ts` at build
 * time (which this gate does not run against), so in THIS base repository the
 * count is exactly 17. Adding a genuinely new base module is a conscious event
 * that must bump this constant in the same PR — that is the "module-count
 * drift" guard, not an accident waiting to happen.
 */
export const EXPECTED_BASE_MODULE_COUNT = 17;

/** Generated inventories that must never name an excluded module. */
export const INVENTORY_FILES = [
  "docs/awcms-micro/repo-inventory.md",
  "docs/awcms-micro/module-composition-inventory.json"
] as const;

export const OPENAPI_PATH = "openapi/awcms-micro-public-api.openapi.yaml";
export const ASYNCAPI_PATH = "asyncapi/awcms-micro-domain-events.asyncapi.yaml";

/**
 * Escape a token for use inside a `\b…\b` word-boundary RegExp. Excluded keys
 * contain only `[a-z_]`, but hyphenated namespaces need the `-` handled.
 */
function boundaryPattern(token: string): RegExp {
  const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // `_` and `-` are not RegExp `\b` boundaries against a leading/trailing
  // alnum, so anchor on a non-key character (start/end, whitespace, quote,
  // slash, dot, pipe, backtick) instead of relying on `\b` alone.
  return new RegExp(`(^|[^a-z0-9_-])${escaped}([^a-z0-9_-]|$)`, "i");
}

/**
 * (1) The live base registry must contain NONE of the excluded ERP modules.
 * `moduleKeys` is `listModules().map(m => m.key)`.
 */
export function checkRegistryExcludesErpModules(
  moduleKeys: readonly string[]
): string[] {
  const present = new Set(moduleKeys);
  const problems: string[] = [];
  for (const excluded of EXCLUDED_MODULE_KEYS) {
    if (present.has(excluded)) {
      problems.push(
        `Module registry contains excluded ERP module "${excluded}" — AWCMS-Micro is WEBSITE scope (ADR-0025); a derived ERP app adds it via src/modules/application-registry.ts, never the base registry.`
      );
    }
  }
  return problems;
}

/**
 * (2) The live base registry must have exactly `EXPECTED_BASE_MODULE_COUNT`
 * modules — the module-count drift anchor.
 */
export function checkBaseModuleCount(
  actualCount: number,
  expected: number = EXPECTED_BASE_MODULE_COUNT
): string[] {
  if (actualCount !== expected) {
    return [
      `Base registry has ${actualCount} modules, expected ${expected}. If this is an intentional new WEBSITE module, bump EXPECTED_BASE_MODULE_COUNT in scripts/scope-consistency-check.ts in the same PR; if a module was removed or an excluded ERP module re-added, revert it (ADR-0025).`
    ];
  }
  return [];
}

/**
 * (3) No AsyncAPI channel key, and no operation's channel `$ref`, may live under
 * an excluded module's namespace (`awcms-micro.<excluded-ns>.…`). Takes the
 * already-extracted channel keys + operation channel refs so the check is pure.
 */
export function checkAsyncApiFreeOfExcludedModules(
  channelKeys: readonly string[],
  operationChannelRefs: readonly string[]
): string[] {
  const problems: string[] = [];
  const namespaced = EXCLUDED_MODULE_NAMESPACES.map(
    (ns) => `awcms-micro.${ns}.`
  );
  const scan = (value: string, kind: string): void => {
    for (const prefix of namespaced) {
      if (value.includes(prefix)) {
        problems.push(
          `AsyncAPI ${kind} "${value}" references excluded ERP module namespace "${prefix}" — that module is not ported (ADR-0025); remove its channels/operations.`
        );
      }
    }
  };
  for (const key of channelKeys) scan(key, "channel");
  for (const ref of operationChannelRefs) scan(ref, "operation channel $ref");
  return problems;
}

/**
 * (4) No OpenAPI path may live under an excluded module's route segment
 * (`/<excluded-ns>/…` or exactly `/<excluded-ns>`). Takes the extracted path
 * keys so the check is pure. Path-only by design: an excluded module's name
 * appearing in an error-code enum or a schema description is a generic-standard
 * seam, not an implemented endpoint, and is deliberately NOT flagged.
 */
export function checkOpenApiPathsFreeOfExcludedModules(
  pathKeys: readonly string[]
): string[] {
  const problems: string[] = [];
  for (const pathKey of pathKeys) {
    const segments = pathKey.split("/").filter(Boolean);
    for (const ns of EXCLUDED_MODULE_NAMESPACES) {
      if (segments.includes(ns)) {
        problems.push(
          `OpenAPI path "${pathKey}" is under excluded ERP module route "/${ns}" — that module is not ported (ADR-0025); remove its endpoints.`
        );
      }
    }
  }
  return problems;
}

/**
 * (5) Generated inventories must not name any excluded ERP module `key`. These
 * files are derived from the registry, so a hit here means the registry drifted
 * OR the generator changed — either way, a real regression. Matched on
 * word-boundary so `data_lifecycle` never trips `data_exchange` etc.
 */
export function checkInventoriesFreeOfExcludedModules(
  files: readonly { path: string; content: string }[]
): string[] {
  const problems: string[] = [];
  for (const file of files) {
    for (const excluded of EXCLUDED_MODULE_KEYS) {
      const pattern = boundaryPattern(excluded);
      file.content.split("\n").forEach((line, index) => {
        if (pattern.test(line)) {
          problems.push(
            `${file.path}:${index + 1} names excluded ERP module "${excluded}" — generated inventories describe only the 17-module WEBSITE registry (ADR-0025). Regenerate after removing the drift.`
          );
        }
      });
    }
  }
  return problems;
}

/**
 * (6) A module-count claim parsed from an active/generated artifact must equal
 * the live registry size. `actual` is `null` when the anchor phrase was not
 * found at all (also a failure — the anchor must exist so the claim stays
 * checkable).
 */
export function checkModuleCountClaim(
  fileLabel: string,
  actual: number | null,
  expected: number
): string[] {
  if (actual === null) {
    return [
      `${fileLabel}: could not find the module-count anchor phrase — it must state the registered-module count so this gate can verify it stays at ${expected} (ADR-0025).`
    ];
  }
  if (actual !== expected) {
    return [
      `${fileLabel}: claims ${actual} registered modules, but the live registry has ${expected} (ADR-0025). Reconcile the doc/inventory to the real WEBSITE-scoped registry.`
    ];
  }
  return [];
}

type AnyRecord = Record<string, unknown>;

function extractAsyncApi(doc: unknown): {
  channelKeys: string[];
  operationChannelRefs: string[];
} {
  const root = (doc ?? {}) as AnyRecord;
  const channels = (root.channels ?? {}) as AnyRecord;
  const operations = (root.operations ?? {}) as AnyRecord;
  const channelKeys = Object.keys(channels);
  const operationChannelRefs: string[] = [];
  for (const op of Object.values(operations)) {
    const channel = (op as AnyRecord)?.channel as AnyRecord | undefined;
    const ref = channel?.$ref;
    if (typeof ref === "string") operationChannelRefs.push(ref);
  }
  return { channelKeys, operationChannelRefs };
}

export async function runScopeConsistencyCheck(
  rootDir = process.cwd()
): Promise<string[]> {
  const { listModules } = await import("../src/modules/index");
  const moduleKeys = listModules().map((m) => m.key);

  const readText = (rel: string): Promise<string> =>
    readFile(path.join(rootDir, rel), "utf8");

  const [openApiSrc, asyncApiSrc, inventoryFiles] = await Promise.all([
    readText(OPENAPI_PATH),
    readText(ASYNCAPI_PATH),
    Promise.all(
      INVENTORY_FILES.map(async (rel) => ({
        path: rel,
        content: await readText(rel)
      }))
    )
  ]);

  const openApi = (parse(openApiSrc) ?? {}) as AnyRecord;
  const openApiPaths = Object.keys((openApi.paths ?? {}) as AnyRecord);
  const { channelKeys, operationChannelRefs } = extractAsyncApi(
    parse(asyncApiSrc)
  );

  // Module-count anchors parsed from generated artifacts (stable phrasings).
  const repoInventory = inventoryFiles.find((f) =>
    f.path.endsWith("repo-inventory.md")
  );
  const repoInvMatch = repoInventory?.content.match(
    /(\d+) modules registered in/
  );
  const repoInvCount = repoInvMatch ? Number(repoInvMatch[1]) : null;

  const composition = inventoryFiles.find((f) => f.path.endsWith(".json"));
  let compositionCount: number | null = null;
  if (composition) {
    try {
      const parsed = JSON.parse(composition.content) as {
        totalModuleCount?: number;
      };
      compositionCount =
        typeof parsed.totalModuleCount === "number"
          ? parsed.totalModuleCount
          : null;
    } catch {
      compositionCount = null;
    }
  }

  return [
    ...checkRegistryExcludesErpModules(moduleKeys),
    ...checkBaseModuleCount(moduleKeys.length),
    ...checkAsyncApiFreeOfExcludedModules(channelKeys, operationChannelRefs),
    ...checkOpenApiPathsFreeOfExcludedModules(openApiPaths),
    ...checkInventoriesFreeOfExcludedModules(inventoryFiles),
    ...checkModuleCountClaim(
      "docs/awcms-micro/repo-inventory.md",
      repoInvCount,
      moduleKeys.length
    ),
    ...checkModuleCountClaim(
      "docs/awcms-micro/module-composition-inventory.json (totalModuleCount)",
      compositionCount,
      moduleKeys.length
    )
  ];
}

if (import.meta.main) {
  const problems = await runScopeConsistencyCheck();

  if (problems.length > 0) {
    for (const problem of problems) {
      console.error(problem);
    }
    console.error(
      `\nscope:consistency:check GAGAL — ${problems.length} temuan (ADR-0025 WEBSITE scope).`
    );
    process.exitCode = 1;
  } else {
    console.log(
      "scope:consistency:check OK — registry, contracts, and inventories describe only the 17-module WEBSITE registry; no excluded ERP module reintroduced."
    );
  }
}
