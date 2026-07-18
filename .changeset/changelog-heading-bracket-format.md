---
"awcms-micro": patch
---

Fix `bun run changeset:version` to always produce a bracketed `## [X.Y.Z]` CHANGELOG heading, matching this repo's documented Keep a Changelog convention and `scripts/release-verify.ts`'s enforcement of it.

`@changesets/cli` itself always writes a bare `## X.Y.Z` heading — the `changelog` entry in `.changeset/config.json` only shapes each entry's bullet body, not the heading, and nothing in this repo customized it. `release:verify` (correctly) rejects a bare heading, so the very first real tag-push release attempted for this repo (`v0.3.0`) failed at `release.yml`'s `validate` job before any image, SBOM, or GitHub Release was built — nothing was published, so per `release-process.md`'s rollback guidance the `v0.3.0` tag is left in place and this fix ships as a later patch release instead of retagging.

`changeset:version` now chains a new idempotent post-processing step (`scripts/changelog-heading-brackets.ts`) that brackets any bare version heading in `CHANGELOG.md`, including the pre-existing `## 0.3.0` entry from the failed release — so every future `changeset:version` run produces a `release:verify`-passing CHANGELOG automatically, instead of relying on a human remembering an extra manual step.
