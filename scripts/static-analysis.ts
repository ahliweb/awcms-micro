#!/usr/bin/env bun
/**
 * Runner for the QUARANTINED static-analysis toolchain (Issue #369).
 *
 * WHY A WRAPPER EXISTS AT ALL
 * ---------------------------
 * `astro check` and `typescript-eslint` both need TypeScript's *programmatic*
 * API. `typescript@7` — the native Go compiler the repository root runs — no
 * longer ships it (`exports["."]` is `./lib/version.cjs`; everything else sits
 * behind `./unstable/*`). Downgrading the root compiler would weaken the gate
 * that checks 100% of the `.ts` tree, so the TS-6-bound toolchain lives in
 * `tools/static-analysis/` with its own `node_modules`, and its binaries are
 * invoked with **cwd = repository root**. Both resolve TypeScript from their
 * own tree; the root install is never touched.
 *
 * Verify the split at any time:
 *   bun run static-analysis:versions
 *
 * WHY THE COVERAGE ASSERTIONS
 * ---------------------------
 * Every failure mode found while building this gate was SILENT, not loud:
 *  - an ESLint flat config that sets `basePath` while ESLint runs from the
 *    isolated directory lints essentially nothing and exits 0 with no output
 *    (measured here: 1 file instead of ~1372 — so "scanned > 0" alone is NOT
 *    a sufficient assertion, which is why the floor below is proportional);
 *  - errors thrown while linting a processor's virtual `<script>` blocks are
 *    swallowed by ESLint, which still exits 0;
 *  - `tsc` skips `.astro` silently because the extension is unknown.
 * This repository already paid for that class of bug twice (#359/#361 — an
 * edge-cache purge that reported success while doing nothing). So each leg
 * counts the source files that exist and fails unless the tool actually
 * looked at most of them, even when nothing else complained.
 */
import { unlink } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const TOOLS_DIR = path.join(REPO_ROOT, "tools", "static-analysis");
const BIN_DIR = path.join(TOOLS_DIR, "node_modules", ".bin");
const ESLINT_CONFIG = path.join(TOOLS_DIR, "eslint.config.mjs");

/** TypeScript major the quarantine exists to work around. */
const TARGET_TYPESCRIPT = "7.0.0";

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

async function requireBin(name: string): Promise<string> {
  const binPath = path.join(BIN_DIR, name);
  if (!(await Bun.file(binPath).exists())) {
    fail(
      `static-analysis: \`${name}\` tidak ditemukan di ${BIN_DIR}.\n` +
        `Jalankan dulu: bun install --cwd tools/static-analysis`
    );
  }
  return binPath;
}

async function readJson(file: string): Promise<Record<string, unknown>> {
  return (await Bun.file(file).json()) as Record<string, unknown>;
}

/**
 * Fraction of the source tree a gate must actually have looked at. Self
 * calibrating (the candidate count is recomputed from the working tree every
 * run), so it never goes stale as the repo grows — unlike a hardcoded floor.
 * Not 1.0 because each tool legitimately counts a slightly different set:
 * `astro check` adds `.astro/types.d.ts` and config files, ESLint adds `.mjs`.
 */
const MIN_COVERAGE_RATIO = 0.9;

/** `.ts` + `.astro` sources every gate below is expected to reach. */
function countCandidateFiles(): number {
  const patterns = [
    "src/**/*.ts",
    "scripts/**/*.ts",
    "tests/**/*.ts",
    "src/**/*.astro"
  ];
  let total = 0;
  for (const pattern of patterns) {
    total += Array.from(
      new Bun.Glob(pattern).scanSync({ cwd: REPO_ROOT, onlyFiles: true })
    ).length;
  }
  return total;
}

function assertCoverage(tool: string, scanned: number, hint: string): void {
  const candidates = countCandidateFiles();
  const floor = Math.floor(candidates * MIN_COVERAGE_RATIO);
  if (scanned >= floor) return;
  fail(
    `static-analysis: ${tool} hanya memeriksa ${scanned} berkas, padahal pohon sumber punya ${candidates} ` +
      `(minimum ${floor}). Gerbang MATI, bukan hijau.\n${hint}`
  );
}

/**
 * `astro check` — the ONLY gate that type-checks `.astro` frontmatter AND the
 * inline `<script>` browser code. `tsc --noEmit` skips `.astro` entirely.
 */
async function runAstroCheck(): Promise<never> {
  const bin = await requireBin("astro-check");

  // `astro-check` (unlike `astro check`) does not run `astro sync` itself, so
  // do it here with the ROOT toolchain: it only writes `.astro/types.d.ts` and
  // needs no TypeScript API, which keeps the generated types in step with the
  // root Astro version.
  const sync = Bun.spawnSync(["bun", "--bun", "astro", "sync"], {
    cwd: REPO_ROOT,
    stdout: "pipe",
    stderr: "pipe"
  });
  if (sync.exitCode !== 0) {
    fail(
      `static-analysis: \`astro sync\` gagal (exit ${sync.exitCode}).\n` +
        sync.stderr.toString()
    );
  }

  const proc = Bun.spawnSync([bin, "--minimumSeverity", "error"], {
    cwd: REPO_ROOT,
    stdout: "pipe",
    stderr: "pipe"
  });
  const stdout = proc.stdout.toString();
  const stderr = proc.stderr.toString();

  // `Result (1370 files):` — the count proves the checker actually walked the
  // project instead of resolving to an empty file set.
  const scanned = Number(
    /Result \((\d+) files\)/.exec(stdout + stderr)?.[1] ?? "0"
  );

  // Only errors fail the gate, but `astro check` prints every hint/warning
  // regardless of `--minimumSeverity` (~46 KB, mostly the `is:inline` hint).
  // Keep the success path quiet and dump everything when it matters.
  if (proc.exitCode !== 0) {
    process.stdout.write(stdout);
    process.stderr.write(stderr);
  }

  assertCoverage(
    "astro check",
    scanned,
    "Periksa cwd runner (harus root repo) dan instalasi tools/static-analysis."
  );
  if (proc.exitCode !== 0) process.exit(proc.exitCode ?? 1);

  console.log(`static-analysis: astro check OK — ${scanned} berkas diperiksa.`);
  process.exit(0);
}

type EslintResult = {
  filePath: string;
  messages: {
    ruleId: string | null;
    severity: number;
    line: number;
    column: number;
    message: string;
  }[];
};

/**
 * ESLint over the whole repo, from the repository root, with the quarantined
 * config. `--no-config-lookup` keeps it from picking up anything else.
 */
async function runEslint(): Promise<never> {
  const bin = await requireBin("eslint");

  // The JSON formatter emits one entry per LINTED file, so on this repo the
  // report is ~350 KB and growing. `Bun.spawnSync` TRUNCATES a pipe that big,
  // which made the gate fail on report SIZE rather than on anything in the
  // code — the parse blew up mid-token and reported "invalid JSON". Route it
  // through `-o` so the size of the report can never decide the verdict.
  const reportPath = path.join(
    os.tmpdir(),
    `awcms-micro-eslint-${process.pid}.json`
  );
  const proc = Bun.spawnSync(
    [
      bin,
      "--no-config-lookup",
      "--config",
      ESLINT_CONFIG,
      "--format",
      "json",
      "-o",
      reportPath,
      "."
    ],
    { cwd: REPO_ROOT, stdout: "pipe", stderr: "pipe" }
  );
  const stderr = proc.stderr.toString();

  let results: EslintResult[];
  try {
    results = JSON.parse(await Bun.file(reportPath).text()) as EslintResult[];
  } catch {
    process.stderr.write(proc.stdout.toString());
    process.stderr.write(stderr);
    fail(
      `static-analysis: eslint tidak mengembalikan JSON yang valid (exit ${proc.exitCode}).`
    );
  } finally {
    await unlink(reportPath).catch(() => {});
  }

  // The JSON formatter emits one entry per LINTED file, including clean ones —
  // so this is a true "scanned" count, not a "problem" count.
  assertCoverage(
    "eslint",
    results.length,
    "Penyebab paling umum: `basePath` di flat config (me-lint ~1 berkas lalu exit 0), " +
      "atau cwd runner bukan root repo."
  );

  let errors = 0;
  let warnings = 0;
  for (const result of results) {
    if (result.messages.length === 0) continue;
    console.log(path.relative(REPO_ROOT, result.filePath));
    for (const message of result.messages) {
      if (message.severity === 2) errors++;
      else warnings++;
      console.log(
        `  ${message.line}:${message.column}  ` +
          `${message.severity === 2 ? "error" : "warning"}  ` +
          `${message.message}  ${message.ruleId ?? ""}`
      );
    }
    console.log("");
  }

  if (stderr.trim().length > 0) process.stderr.write(stderr);

  if (errors > 0 || proc.exitCode !== 0) {
    console.error(
      `static-analysis: eslint FAILED — ${errors} error, ${warnings} warning (${results.length} berkas dipindai).`
    );
    process.exit(proc.exitCode === 0 ? 1 : (proc.exitCode ?? 1));
  }

  console.log(
    `static-analysis: eslint OK — ${results.length} berkas dipindai, ${warnings} warning.`
  );
  process.exit(0);
}

/**
 * Fails once the quarantine is NO LONGER NEEDED, so nobody has to remember to
 * revisit it: reads the `peerDependencies.typescript` range of the INSTALLED
 * toolchain packages and fails when any of them already accepts TypeScript 7.
 * Offline and deterministic — no network, no registry lookup.
 */
async function runQuarantineCheck(): Promise<never> {
  const packages = [
    "@astrojs/check",
    "typescript-eslint",
    "@typescript-eslint/typescript-estree"
  ];

  const stale: string[] = [];
  for (const name of packages) {
    const manifestPath = path.join(
      TOOLS_DIR,
      "node_modules",
      name,
      "package.json"
    );
    if (!(await Bun.file(manifestPath).exists())) {
      fail(
        `static-analysis: ${name} tidak terpasang di tools/static-analysis.\n` +
          `Jalankan: bun install --cwd tools/static-analysis`
      );
    }
    const manifest = await readJson(manifestPath);
    const peers = (manifest.peerDependencies ?? {}) as Record<string, string>;
    const range = peers.typescript;
    if (!range) continue;
    if (Bun.semver.satisfies(TARGET_TYPESCRIPT, range)) {
      stale.push(`${name} (peer typescript: ${range})`);
    }
  }

  if (stale.length > 0) {
    fail(
      "static-analysis: KARANTINA SUDAH TIDAK DIPERLUKAN — hapus workaround-nya.\n" +
        `Paket berikut kini menerima TypeScript ${TARGET_TYPESCRIPT}:\n` +
        stale.map((entry) => `  - ${entry}`).join("\n") +
        "\n\nLangkah: pindahkan devDependency toolchain dari tools/static-analysis/package.json\n" +
        "ke package.json root (memakai typescript root), pindahkan eslint.config.mjs ke root,\n" +
        "sederhanakan scripts/static-analysis.ts, dan perbarui doc 07 §Gerbang analisis statis."
    );
  }

  console.log(
    `static-analysis:quarantine:check OK — toolchain masih menuntut TypeScript < ${TARGET_TYPESCRIPT}, karantina tetap perlu.`
  );
  process.exit(0);
}

/** Prints the two TypeScript versions so the split is verifiable at a glance. */
async function runVersions(): Promise<never> {
  const rootManifest = path.join(
    REPO_ROOT,
    "node_modules",
    "typescript",
    "package.json"
  );
  const toolManifest = path.join(
    TOOLS_DIR,
    "node_modules",
    "typescript",
    "package.json"
  );

  for (const [label, manifestPath] of [
    ["root       (memeriksa semua .ts via tsc --noEmit)", rootManifest],
    ["quarantine (memeriksa .astro via astro check + eslint)", toolManifest]
  ] as const) {
    if (!(await Bun.file(manifestPath).exists())) {
      fail(
        `static-analysis: ${manifestPath} tidak ada — jalankan bun install dulu.`
      );
    }
    const manifest = await readJson(manifestPath);
    console.log(`typescript ${label}: ${String(manifest.version)}`);
  }
  process.exit(0);
}

const command = process.argv[2];
switch (command) {
  case "astro-check":
    await runAstroCheck();
    break;
  case "eslint":
    await runEslint();
    break;
  case "quarantine-check":
    await runQuarantineCheck();
    break;
  case "versions":
    await runVersions();
    break;
  default:
    fail(
      "Usage: bun scripts/static-analysis.ts <astro-check|eslint|quarantine-check|versions>"
    );
}
