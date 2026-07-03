# Upstream Sync Status

## Source

- Upstream repository URL: `https://github.com/emdash-cms/emdash`
- Upstream branch: `main`
- Upstream commit SHA: `932f4ba3adef8be21abc39b4cc7612609895e88c`
- Sync date: `2026-07-02T22:13:04Z`
- Operator: `unggul`
- Target folder: `emdash-latest/`
- Development workspace: `awcmsmicro-dev/`

## Status Summary

`emdash-latest/` was refreshed from upstream EmDash `main` at `932f4ba3adef8be21abc39b4cc7612609895e88c` after confirming the parent repository `main` branch was current with GitHub and backing up production D1 to `r2://awcms-micro-backups/backups/db/backup-20260703-051234.sql.enc`.

`awcmsmicro-dev/` has been rebuilt from the refreshed upstream snapshot with approved AWCMS-Micro protected paths restored and all 21 active downstream patch overlays replayed successfully.

EmDash 0.27.0 introduces migration `049_taxonomies_name_locale_index`; production verification is complete and recorded in issue #226 and `EMDASH_0_27_D1_MIGRATION_VERIFICATION.md`. Upstream also adds a deployed-site schema-evolution guide, improves the Cloudflare Email provider descriptor, documents D1 session incompatibility with `global_fetch_strictly_public`, and moves built-in templates toward semantic theme tokens. AWCMS-Micro adoption/deferral decisions are recorded in `EMDASH_0_27_CLOUDFLARE_AND_TEMPLATE_DECISIONS.md`; protected default-template token adoption was reviewed and deferred in issue #227.

## Key Changes in This Sync

- **EmDash 0.27.0 core/runtime**:
  - admin branding falls back to the Site Title when no build-time `admin.siteName` is configured;
  - published slug changes made through the draft/revision publish path now create 301 auto-redirects;
  - `emdash seed --no-content` and setup `?content=0` skip sample bylines and taxonomy terms;
  - first-party packages are excluded from the workerd dependency optimizer for more stable Cloudflare dev/setup/content paths.
- **D1 migration 049**:
  - creates `idx_taxonomies_name_locale` on `taxonomies(name, locale)`;
  - drops the superseded `idx_taxonomies_name`;
  - keeps `idx_taxonomies_locale` for locale-only lookups.
- **Cloudflare changes**:
  - `cloudflareEmail()` now returns a bundlable plugin descriptor;
  - D1 read-replica sessions remain disabled by default for AWCMS-Micro templates, especially where `global_fetch_strictly_public` may be required.
- **Docs and template architecture**:
  - upstream adds deployed-site schema-evolution docs;
  - built-in blog/marketing/portfolio templates adopt semantic `tokens.css` styling;
  - AWCMS-Micro default templates keep their protected CMS-sourced public architecture; #227 records the defer decision for semantic token adoption.
- **Patch overlay replay**:
  - existing AWCMS-Micro overlays replay cleanly after the 0.27.0 rebuild.

## Validation Status

| Check | Status | Notes |
| --- | --- | --- |
| GitHub current-state check | Passed | Local `main` equals `origin/main` at `faca0ffa69ed7bfcbb7264b6d890aba2258a6364` before sync |
| Production D1 backup | Passed | `r2://awcms-micro-backups/backups/db/backup-20260703-051234.sql.enc` |
| Upstream analysis | Passed | Compared `90ffe40a` to `932f4ba3`; latest released tag in the delta is `emdash@0.27.0` |
| Issue closure | Passed | #226 closed after D1 migration 049 verification; #227 closed after documenting semantic token defer decision |
| Upstream fetch into `emdash-latest/` | Passed | `bash scripts/update-emdash-latest.sh continuation` refreshed to `932f4ba3` |
| Rebuild `awcmsmicro-dev/` from `emdash-latest/` | Passed | `bash scripts/update-awcmsmicro-dev.sh continuation`; 21 patch overlays replayed |
| Boundary validation | Passed | `bash scripts/validate-awcmsmicro-boundaries.sh` passed after root versioning |
| Full workspace validation | Passed | `bash scripts/validate-awcmsmicro-dev.sh` passed; see `LAST_VALIDATION.md` |
| Cloudflare deploy dry-run | Passed | `pnpm --dir awcmsmicro-dev/templates/awcms-micro-default-cloudflare build` and `wrangler deploy --dry-run` passed |
| Production deployment | Passed | Worker version `d369494d-96b1-4ba1-8af6-6056e79c94c6`, deployment created 2026-07-02T22:23:14.118Z |
| Production D1 migration 049 verification | Passed | `_emdash_migrations` contains `049_taxonomies_name_locale_index`; `idx_taxonomies_name_locale` and `idx_taxonomies_locale` exist; `idx_taxonomies_name` is absent |
| Cloudflare post-deploy smoke checks | Passed | Public/API routes returned 200; scheduled publishing test row published at `2026-07-02T22:29:28Z`; temporary rows and revision were cleaned up |

## Notes

- `emdash-latest/` is the upstream reference snapshot.
- `awcmsmicro-dev/` is the workspace for AWCMS-Micro-specific plugin and template additions.
- Optional Cloudflare Email binding adoption remains deferred until a focused email issue defines sender, deliverability, consent, and binding rules.
- D1 read-replica sessions remain disabled by default for AWCMS-Micro templates.
- The current production Worker version is `d369494d-96b1-4ba1-8af6-6056e79c94c6`; the previous 0.26.0 reference was `5be81778-b5ba-45e5-aa1c-164655845a5d`.
