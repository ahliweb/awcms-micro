/**
 * validate-module-graph.ts — `bun run modules:dag:check`.
 *
 * Issue #680 (epic #679, platform-hardening). Registry-wide dependency-DAG
 * gate: fails loud if any registered module descriptor introduces a
 * self-dependency, a duplicate dependency, a missing dependency key, or a
 * cycle (direct or indirect) — see
 * `src/modules/module-management/domain/module-dependency-graph.ts`'s own
 * header comment for why this is a DIFFERENT check from
 * `domain/tenant-module-lifecycle.ts`'s `hasDependencyCycle` (that one only
 * ever validates a single module at enable-time; this walks the WHOLE
 * registry). No I/O, no network, no database — pure code-registry
 * (`listModules()`) validation, safe to run on every CI build and before
 * every `bun run modules:sync`.
 *
 * Issue #371 (ADR-0038) adds a SECOND, complementary gate to the same script:
 * the module boundary is only real if nothing outside `src/modules` can hold a
 * module's code. `src/lib/` used to grow a shadow module system — five
 * namespaces (`comments`, `newsletter`, `theming`, `seo`, `search`) carrying
 * module-owned code that no gate could see, one of them imported UPWARD by the
 * very module whose name it wore. So this script now also reads the directory
 * listing of `src/lib/` (the ONLY I/O in here, a single `readdir` on a source
 * tree that is always present) and fails when a namespace there collides with a
 * `moduleKey` — either literally, or through a recorded domain alias. See
 * ADR-0038 for the `src/lib` definition this enforces.
 */
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { listModules } from "../src/modules";
import {
  formatModuleDependencyGraphIssue,
  validateModuleDependencyGraph
} from "../src/modules/module-management/domain/module-dependency-graph";

/**
 * `src/lib/` namespaces that are module-owned even though their name is not
 * literally a `moduleKey` — the historical shape Issue #371 found (`src/lib/seo`
 * held `seo_distribution`'s route composition roots; `src/lib/search` held
 * `site_search`'s source registry). Without these the gate would only catch the
 * three exact-name cases and the two aliased ones could silently come back.
 * Adding an entry is cheap; removing one needs an ADR.
 */
export const MODULE_OWNED_LIB_NAMESPACE_ALIASES: Readonly<
  Record<string, string>
> = {
  seo: "seo_distribution",
  search: "site_search"
};

/**
 * The deliberate, ADR-recorded name collisions that STAY in `src/lib/`.
 *
 * Only one exists: `src/lib/logging/` is the structured-logger primitive
 * (`logger.ts`, `error-sanitizer.ts`, `correlation-response.ts`) — database-free,
 * imported by ~139 files across every module and by `src/middleware.ts` itself,
 * so it is shared infrastructure in the same category as `database/` and `auth/`.
 * The `logging` MODULE owns the audit trail (`awcms_micro_audit_events`), which
 * is a different thing that happens to share a word. This was already documented
 * in `src/modules/logging/README.md` §"Bukan bagian modul ini" long before this
 * gate existed; the gate records it rather than pretending it isn't a collision.
 * A new entry here requires an ADR — that is the whole point of listing it.
 */
export const INFRASTRUCTURE_NAMESPACE_EXEMPTIONS: Readonly<
  Record<string, string>
> = {
  logging:
    "structured-logger primitive (logger/sanitizer/correlation), database-free and imported repo-wide; " +
    "the `logging` module owns the audit trail instead — ADR-0038 §5, src/modules/logging/README.md"
};

/** One `src/lib/<namespace>/` that carries (or shadows) a module's name. */
export interface LibNamespaceCollision {
  /** The offending directory name under `src/lib/`, verbatim. */
  readonly namespace: string;
  /** The `moduleKey` it collides with. */
  readonly moduleKey: string;
  /** `exact` = the directory name IS the module key; `alias` = a recorded domain alias. */
  readonly kind: "exact" | "alias";
}

/** Directory names and module keys are compared in one normalized form (`theme-preview` and `theme_preview` are the same name). */
function normalizeNamespace(name: string): string {
  return name.toLowerCase().replaceAll("-", "_");
}

/**
 * Pure collision detection — no filesystem access, so a test can inject a
 * violating namespace list and observe the gate actually rejecting it.
 */
export function findLibNamespaceCollisions(
  namespaces: readonly string[],
  moduleKeys: readonly string[],
  exemptions: Readonly<
    Record<string, string>
  > = INFRASTRUCTURE_NAMESPACE_EXEMPTIONS
): LibNamespaceCollision[] {
  const keys = new Set(moduleKeys.map(normalizeNamespace));
  const collisions: LibNamespaceCollision[] = [];

  for (const namespace of namespaces) {
    const normalized = normalizeNamespace(namespace);
    if (Object.hasOwn(exemptions, normalized)) continue;

    if (keys.has(normalized)) {
      collisions.push({ namespace, moduleKey: normalized, kind: "exact" });
      continue;
    }

    // `Object.hasOwn` + explicit read, not a bare index: a directory named
    // `constructor` or `toString` would otherwise hit Object.prototype and be
    // silently treated as exempt (or crash the gate).
    const aliasOwner = Object.hasOwn(
      MODULE_OWNED_LIB_NAMESPACE_ALIASES,
      normalized
    )
      ? MODULE_OWNED_LIB_NAMESPACE_ALIASES[normalized]
      : undefined;
    if (aliasOwner !== undefined && keys.has(normalizeNamespace(aliasOwner))) {
      collisions.push({ namespace, moduleKey: aliasOwner, kind: "alias" });
    }
  }

  return collisions;
}

/** Immediate subdirectories of `libRoot` (the `src/lib/<namespace>/` list). Missing root = no namespaces. */
export function readLibNamespaces(libRoot: string): string[] {
  let entries;
  try {
    entries = readdirSync(libRoot, { withFileTypes: true });
  } catch (error) {
    // NOT `return []` — an unreadable `src/lib` would make the collision check
    // pass with nothing scanned, the same dead-but-green shape this repo keeps
    // paying for (#359/#361). `src/lib` always exists in this repository, so a
    // read failure is a broken run, not an empty result.
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(
      `validate-module-graph: tidak bisa membaca ${libRoot} (${detail}). ` +
        "Gerbang tabrakan namespace src/lib TIDAK dijalankan."
    );
  }
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export function formatLibNamespaceCollision(
  collision: LibNamespaceCollision
): string {
  const reason =
    collision.kind === "exact"
      ? `its name IS the module key \`${collision.moduleKey}\``
      : `it is the recorded domain alias of module \`${collision.moduleKey}\``;
  return (
    `src/lib/${collision.namespace}/ collides with a registered module — ${reason}. ` +
    `Move that code to src/modules/${collision.moduleKey.replaceAll("_", "-")}/presentation/ ` +
    `(ADR-0038: src/lib holds technical infrastructure only, never a domain-named namespace).`
  );
}

const DEFAULT_LIB_ROOT = resolve(import.meta.dir, "../src/lib");

/** Returns `true` when both gates pass. `libRoot` is a parameter so tests can point it at a fixture tree. */
export function main(libRoot: string = DEFAULT_LIB_ROOT): boolean {
  const modules = listModules();
  const graph = validateModuleDependencyGraph(modules);
  const collisions = findLibNamespaceCollisions(
    readLibNamespaces(libRoot),
    modules.map((module) => module.key)
  );

  if (graph.valid && collisions.length === 0) {
    console.log(
      `modules:dag:check OK — ${modules.length} registered modules form a valid DAG; ` +
        `no src/lib namespace collides with a module key.`
    );
    return true;
  }

  console.error("modules:dag:check FAILED —");
  if (!graph.valid) {
    for (const issue of graph.issues) {
      console.error(`  ${formatModuleDependencyGraphIssue(issue)}`);
    }
  }
  for (const collision of collisions) {
    console.error(`  ${formatLibNamespaceCollision(collision)}`);
  }
  process.exitCode = 1;
  return false;
}

if (import.meta.main) {
  main();
}
