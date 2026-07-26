/**
 * `modules:dag:check`'s second gate (Issue #371, ADR-0038): no `src/lib/<x>/`
 * namespace may collide with a registered `moduleKey`.
 *
 * The point of these tests is NOT "the repo is currently clean" — a gate that
 * has only ever been observed passing is a gate nobody has proven works. Every
 * violating shape is therefore INJECTED here (as a namespace list, and as a real
 * fixture directory tree fed to the script's own `main()`), and asserted to make
 * the gate reject it and set a non-zero exit code.
 */
import { afterEach, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { listModules } from "../../src/modules";
import {
  findLibNamespaceCollisions,
  formatLibNamespaceCollision,
  INFRASTRUCTURE_NAMESPACE_EXEMPTIONS,
  main,
  MODULE_OWNED_LIB_NAMESPACE_ALIASES,
  readLibNamespaces
} from "../../scripts/validate-module-graph";

const MODULE_KEYS = listModules().map((module) => module.key);

/** Builds a throwaway `src/lib`-shaped tree with the given namespaces. */
function makeLibFixture(namespaces: readonly string[]): string {
  const root = mkdtempSync(join(tmpdir(), "awcms-micro-lib-gate-"));
  for (const namespace of namespaces) {
    mkdirSync(join(root, namespace), { recursive: true });
  }
  return root;
}

const fixtures: string[] = [];

function fixture(namespaces: readonly string[]): string {
  const root = makeLibFixture(namespaces);
  fixtures.push(root);
  return root;
}

afterEach(() => {
  for (const root of fixtures.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("src/lib namespace ownership gate — injected violations", () => {
  test("rejects a namespace whose name IS a module key", () => {
    const collisions = findLibNamespaceCollisions(["comments"], MODULE_KEYS);

    expect(collisions).toHaveLength(1);
    expect(collisions[0]).toEqual({
      namespace: "comments",
      moduleKey: "comments",
      kind: "exact"
    });
  });

  test("rejects the recorded domain aliases (`seo`, `search`) that are not literal module keys", () => {
    const collisions = findLibNamespaceCollisions(
      ["seo", "search"],
      MODULE_KEYS
    );

    expect(
      collisions.map((collision) => [collision.namespace, collision.moduleKey])
    ).toEqual([
      ["seo", "seo_distribution"],
      ["search", "site_search"]
    ]);
    expect(collisions.every((collision) => collision.kind === "alias")).toBe(
      true
    );
  });

  test("rejects every one of the five namespaces Issue #371 actually found", () => {
    const offenders = ["comments", "newsletter", "theming", "seo", "search"];

    const collisions = findLibNamespaceCollisions(offenders, MODULE_KEYS);

    expect(collisions.map((collision) => collision.namespace).sort()).toEqual(
      [...offenders].sort()
    );
  });

  test("normalizes kebab-case directory names against snake_case module keys", () => {
    const collisions = findLibNamespaceCollisions(
      ["seo-distribution", "site-search"],
      MODULE_KEYS
    );

    expect(collisions.map((collision) => collision.moduleKey)).toEqual([
      "seo_distribution",
      "site_search"
    ]);
  });

  test("the failure message names the module and the presentation destination", () => {
    const [collision] = findLibNamespaceCollisions(["seo"], MODULE_KEYS);

    const message = formatLibNamespaceCollision(collision!);

    expect(message).toContain("src/lib/seo/");
    expect(message).toContain("src/modules/seo-distribution/presentation/");
    expect(message).toContain("ADR-0038");
  });

  test("leaves genuine technical-infrastructure namespaces alone", () => {
    const infrastructure = [
      "auth",
      "cache",
      "config",
      "database",
      "deployment",
      "html",
      "i18n",
      "integration",
      "jobs",
      "observability",
      "performance",
      "redis",
      "resilience",
      "security",
      "semver",
      "tenant",
      "ui"
    ];

    expect(findLibNamespaceCollisions(infrastructure, MODULE_KEYS)).toEqual([]);
  });
});

describe("src/lib namespace ownership gate — the documented exemption", () => {
  test("`logging` is suppressed by the exemption table, not by a detection blind spot", () => {
    // With the exemption in force: clean.
    expect(findLibNamespaceCollisions(["logging"], MODULE_KEYS)).toEqual([]);

    // With an empty exemption table the SAME input is a collision — proof that
    // detection sees it and the exemption is what makes the call.
    expect(findLibNamespaceCollisions(["logging"], MODULE_KEYS, {})).toEqual([
      { namespace: "logging", moduleKey: "logging", kind: "exact" }
    ]);
  });

  test("the exemption table stays a one-entry, ADR-justified list", () => {
    expect(Object.keys(INFRASTRUCTURE_NAMESPACE_EXEMPTIONS)).toEqual([
      "logging"
    ]);
    expect(INFRASTRUCTURE_NAMESPACE_EXEMPTIONS.logging).toContain("ADR-0038");
  });

  test("every alias resolves to a module that actually exists", () => {
    for (const owner of Object.values(MODULE_OWNED_LIB_NAMESPACE_ALIASES)) {
      expect(MODULE_KEYS).toContain(owner);
    }
  });
});

describe("src/lib namespace ownership gate — the real CLI entry point", () => {
  const previousExitCode = process.exitCode;

  afterEach(() => {
    process.exitCode = previousExitCode;
  });

  test("main() FAILS (returns false, sets exit code 1) on an injected violating tree", () => {
    const root = fixture(["database", "auth", "comments"]);
    const errors: string[] = [];
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      errors.push(args.map(String).join(" "));
    };

    let ok: boolean;
    try {
      ok = main(root);
    } finally {
      console.error = originalError;
    }

    expect(ok).toBe(false);
    expect(process.exitCode).toBe(1);
    expect(errors[0]).toContain("modules:dag:check FAILED");
    expect(errors.join("\n")).toContain("src/lib/comments/");
  });

  test("main() PASSES on an infrastructure-only tree", () => {
    const root = fixture(["database", "auth", "logging", "security"]);

    expect(main(root)).toBe(true);
  });

  test("main() PASSES on the real src/lib tree (post-#371)", () => {
    expect(main()).toBe(true);
  });

  test("readLibNamespaces lists only directories", () => {
    const root = fixture(["auth", "database"]);

    expect(readLibNamespaces(root)).toEqual(["auth", "database"]);
  });

  test("an unreadable root THROWS instead of reporting an empty tree", () => {
    // Review round on PR #374: returning `[]` here made the collision check
    // pass having scanned nothing — the dead-but-green gate this repo has
    // already paid for twice (#359/#361). `src/lib` always exists, so a read
    // failure is a broken run, not "no namespaces".
    expect(() =>
      readLibNamespaces(join(fixture([]), "does-not-exist"))
    ).toThrow(/TIDAK dijalankan/);
  });

  test("the real src/lib no longer contains any of the five moved namespaces", () => {
    const namespaces = readLibNamespaces(
      join(import.meta.dir, "../../src/lib")
    );

    for (const moved of [
      "comments",
      "newsletter",
      "theming",
      "seo",
      "search"
    ]) {
      expect(namespaces).not.toContain(moved);
    }
    // Issue #371 also removed two dead `.gitkeep`-only scaffolds.
    expect(namespaces).not.toContain("files");
    expect(namespaces).not.toContain("errors");
  });
});
