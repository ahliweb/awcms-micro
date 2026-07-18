---
"awcms-micro": patch
---

Fix `release.yml`'s GitHub Release title to match the format used by `awcms` and `awcms-mini`: bare `${{ github.ref_name }}` (e.g. `v0.2.0`), not product-name-prefixed `"awcms-micro ${{ github.ref_name }}"`.

Everything else in the tag/release pipeline was already consistent with both sibling repos: the `v*.*.*` tag trigger, `scripts/release-verify.ts`'s `v`-prefix-stripping tag↔`package.json` version comparison, `.changeset/config.json`'s `privatePackages.tag: true` (which makes `bun run changeset:tag` emit `vX.Y.Z` tags, not the Changesets-default `<name>@<version>`), and the product-prefixed release asset filenames (`awcms-micro-X.Y.Z-source.tar.gz`, matching the equivalent `awcms-mini-X.Y.Z-...`/`awcms-X.Y.Z-...` pattern in the other two repos). The release title was the one line still carrying the product-name prefix both siblings dropped.

No change to the CHANGELOG.md entry-header format (`## [X.Y.Z] — status`, Keep a Changelog style) — that's an explicit, documented choice in doc 09, unlike the release title, which had no stated rationale for diverging from the shared family convention.
