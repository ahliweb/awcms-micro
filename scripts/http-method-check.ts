#!/usr/bin/env bun
/**
 * `bun run http:methods:check` — every literal HTTP method in this repo must
 * be an exact-uppercase standard verb.
 *
 * ## Why a gate for something this small
 *
 * Bun's `fetch` sends `GET` for any method string that is not an exact-case
 * match of its internal verb table (upstream: oven-sh/bun#33469, still open;
 * see also #6021 and #21566). Measured on Bun 1.3.14:
 *
 * ```
 * DELETE -> DELETE      Delete -> GET      delete -> DELETE
 * PATCH  -> PATCH       Patch  -> GET      BAN    -> GET
 * ```
 *
 * The failure is silent and inverted in severity: a request meant to MUTATE
 * is sent as a READ, the server answers 200 to the read, and the caller
 * reads that 200 as success. That is exactly how edge-cache invalidation
 * (Issue #359/#361) was dead for two releases while every gate reported
 * health.
 *
 * The first version of this repo's response was "no gate needed — after
 * #361 no non-standard verb remains". Then `Post`/`Delete`/`Patch` turned
 * out to be affected too, and those are not exotic: they are an ordinary
 * capitalization slip that reviewers read straight past. A grep-shaped
 * check is worth it for a defect class whose symptom is silence.
 *
 * Deliberately literal-only. A computed method (`method: verb`) cannot be
 * checked statically, and pretending otherwise would be worse than being
 * clear about the boundary — anything dynamic still needs a real
 * integration test, which is what `tests/integration/edge-cache-*` are.
 */
import { readdir } from "node:fs/promises";
import path from "node:path";

const SCANNED_ROOTS = ["src", "scripts", "tests"];
const SCANNED_EXTENSIONS = new Set([".ts", ".tsx", ".mjs", ".astro"]);

/**
 * The verbs this repo actually speaks. Not "every verb Bun knows": a method
 * outside this list is either a typo or a deliberate protocol extension,
 * and the second one deserves a conversation (plus an integration test that
 * proves it survives the client) rather than a silent pass.
 */
const ALLOWED_METHODS = new Set([
  "GET",
  "HEAD",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS"
]);

/** `method: "..."` in an object literal — request init, mock fetch, CLI arg. */
const METHOD_LITERAL = /\bmethod:\s*"([^"]*)"/g;

type Finding = {
  file: string;
  line: number;
  method: string;
  reason: string;
};

async function* walk(directory: string): AsyncGenerator<string> {
  let entries;

  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const full = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) {
        continue;
      }

      yield* walk(full);
      continue;
    }

    if (SCANNED_EXTENSIONS.has(path.extname(entry.name))) {
      yield full;
    }
  }
}

const findings: Finding[] = [];

for (const root of SCANNED_ROOTS) {
  for await (const file of walk(root)) {
    const contents = await Bun.file(file).text();
    const lines = contents.split("\n");

    lines.forEach((line, index) => {
      // Comment lines are documentation, and documentation legitimately
      // quotes the wrong forms in order to warn about them — this file's own
      // docblock does. A heuristic, and a deliberate one: the cost of
      // missing a method hidden in a comment is zero.
      const trimmed = line.trimStart();

      if (
        trimmed.startsWith("*") ||
        trimmed.startsWith("//") ||
        trimmed.startsWith("/*")
      ) {
        return;
      }

      METHOD_LITERAL.lastIndex = 0;

      let match = METHOD_LITERAL.exec(line);

      while (match !== null) {
        const method = match[1] ?? "";

        if (!ALLOWED_METHODS.has(method)) {
          findings.push({
            file,
            line: index + 1,
            method,
            reason: ALLOWED_METHODS.has(method.toUpperCase())
              ? `not exact-uppercase — Bun's fetch sends this as GET (oven-sh/bun#33469); write "${method.toUpperCase()}"`
              : "not a standard verb this repo speaks — a custom method does not survive Bun's fetch"
          });
        }

        match = METHOD_LITERAL.exec(line);
      }
    });
  }
}

if (findings.length === 0) {
  console.log(
    "http:methods:check OK — every literal HTTP method is an exact-uppercase standard verb."
  );
  process.exit(0);
}

for (const finding of findings) {
  console.error(
    `${finding.file}:${finding.line} — "${finding.method}": ${finding.reason}`
  );
}

console.error(
  `\nhttp:methods:check GAGAL — ${findings.length} temuan.\n` +
    "Bun's fetch silently substitutes GET for any method that is not an exact-case\n" +
    "match of its verb table, so a mutation is sent as a read and its 200 reads as\n" +
    "success. See scripts/http-method-check.ts for the measured behaviour."
);

process.exit(1);
