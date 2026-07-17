import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Every `bun run <script>` a GitHub workflow invokes must resolve to a real
 * `package.json` script.
 *
 * Why this test exists: the first CI run on this repository failed on
 * `bun run reference-data:contributions:check` — a gate ADR-0025 §3 removed
 * along with the unported `reference_data` module. `bun run check` was green
 * locally the whole time, because the aggregate chain in package.json had
 * dropped the gate cleanly. `.github/workflows/ci.yml` lists its steps
 * INDIVIDUALLY rather than just calling `bun run check`, on purpose (see that
 * file's own comments: CI must never silently run a subset of `check`). The
 * price of that decoupling is that a pruned gate must be deleted in BOTH
 * places, and nothing enforced the second one — so the drift was invisible
 * until a real push burned a CI run to find it.
 *
 * ADR-0025 §5 already makes the rule binding ("the prune must reach every
 * generated artifact and CI gate"). This test is what makes it mechanical
 * instead of a thing a reviewer has to remember, which is the same reason
 * `modules:dag:check` exists rather than a paragraph asking people not to
 * create cycles.
 *
 * Deliberately parses text rather than YAML: the assertion is about which
 * script names appear anywhere in a workflow, so a regex over the raw file
 * catches them regardless of whether they sit in `run:`, a composite step, or
 * a multi-line `|` block. A YAML parse would have to know every shape.
 */

const WORKFLOWS_DIR = ".github/workflows";

/** `bun run foo:bar` / `bun run foo` — the trailing group is the script name. */
const BUN_RUN_PATTERN = /bun run ([a-z0-9][a-z0-9:_-]*)/g;

function readPackageScripts(): Set<string> {
  const pkg = JSON.parse(readFileSync("package.json", "utf8")) as {
    scripts?: Record<string, string>;
  };
  return new Set(Object.keys(pkg.scripts ?? {}));
}

function listWorkflowFiles(): string[] {
  return readdirSync(WORKFLOWS_DIR)
    .filter((name) => name.endsWith(".yml") || name.endsWith(".yaml"))
    .sort();
}

describe("workflow <-> package.json script parity", () => {
  const scripts = readPackageScripts();
  const workflows = listWorkflowFiles();

  test("the workflow directory is actually being scanned", () => {
    // Guards against this whole suite silently passing on an empty set — the
    // exact failure mode that let `check:docs` look green while it scanned
    // nothing (it discovers files via `git ls-files`, so an untracked tree
    // meant an empty scan).
    expect(workflows.length).toBeGreaterThan(0);
    expect(scripts.size).toBeGreaterThan(0);
  });

  for (const workflow of listWorkflowFiles()) {
    test(`${workflow} only invokes scripts that exist in package.json`, () => {
      const content = readFileSync(join(WORKFLOWS_DIR, workflow), "utf8");
      const invoked = [...content.matchAll(BUN_RUN_PATTERN)].map(
        (match) => match[1] as string
      );

      const missing = [...new Set(invoked)]
        .filter((name) => !scripts.has(name))
        .sort();

      expect(missing).toEqual([]);
    });
  }
});
