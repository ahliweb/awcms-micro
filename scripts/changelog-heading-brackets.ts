/**
 * changelog-heading-brackets.ts — chained onto `bun run changeset:version`.
 *
 * `changeset version`'s own changelog-writing step always emits a bare
 * `## X.Y.Z` version heading — that's hardcoded in `@changesets/cli`
 * itself, not something the `changelog` entry in `.changeset/config.json`
 * can affect (that config only shapes each entry's bullet body, not the
 * heading). This repo's own `scripts/release-verify.ts` and documented
 * convention (doc 09 §Versioning: "CHANGELOG.md mengikuti format Keep a
 * Changelog") require the bracketed `## [X.Y.Z]` form instead. Without
 * this step, every `changeset:version` run produces a CHANGELOG.md that
 * `release:verify` rejects at tag-push time (found the hard way on the
 * v0.3.0 tag, the first real release ever attempted for this repo — see
 * release-process.md's rollback guidance for why that tag was left in
 * place rather than deleted).
 *
 * Idempotent: an already-bracketed heading (or any `##` line that isn't a
 * bare semver heading, e.g. "## Riwayat versi sebelum 0.2.0") passes
 * through unchanged.
 */
import { readFileSync, writeFileSync } from "node:fs";

const CHANGELOG_PATH = "CHANGELOG.md";
const BARE_VERSION_HEADING = /^## (\d+\.\d+\.\d+(?:-[0-9A-Za-z.]+)?)(\s.*)?$/;

export function bracketChangelogHeadings(content: string): string {
  return content
    .split("\n")
    .map((line) => {
      const match = BARE_VERSION_HEADING.exec(line);
      if (!match) {
        return line;
      }
      const [, version, rest = ""] = match;
      return `## [${version}]${rest}`;
    })
    .join("\n");
}

if (import.meta.main) {
  const original = readFileSync(CHANGELOG_PATH, "utf8");
  writeFileSync(CHANGELOG_PATH, bracketChangelogHeadings(original));
}
