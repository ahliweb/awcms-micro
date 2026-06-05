# Upstream Sync Status

## Source

- Upstream repository URL: `https://github.com/emdash-cms/emdash`
- Upstream branch: `main`
- Upstream commit SHA: `1986dd45427ecd59da28674affb66e892fa47307`
- Sync date: `2026-06-05T22:38:53Z`
- Operator: `unggul`
- Target folder: `emdash-latest/`
- Development workspace: `awcmsmicro-dev/`

## Status Summary

Synced to EmDash `1986dd4`. Upstream `main` moved from `a6e8a91` to `1986dd4`; `emdash-latest/` and `awcmsmicro-dev/` both refreshed successfully, downstream patch overlays replay cleanly under pnpm `11.5.1`, and the downstream workspace validates cleanly on this host.

## Key Changes in This Sync

- Upstream EmDash refreshed to `1986dd4`, including EmDash `0.17.2` package updates, experimental plugin registry documentation, plugin release asset workflow changes, admin plugin-root routing fixes, SEO root-relative media URL handling, setup probe hardening, Postgres schema introspection isolation, and changeset workflow updates
- Rebuilt `awcmsmicro-dev/` from `emdash-latest/` through the protected-path rebuild workflow
- Replayed all 20 active downstream patch overlays after the rebuild, including the pnpm `11.5.1` package-manager overlay
- Refreshed `awcmsmicro-dev/pnpm-lock.yaml` to match the rebuilt workspace under pnpm `11.5.1`
- Preserved approved AWCMS-Micro plugin, template, admin branding/navigation, changeset, workflow, protected local-state, and patch-overlay boundaries during rebuild
- Downstream sync state remains protected by the allowlist, patch overlay workflow, and validation workflow
- Dependabot alert counts were not re-queried during this local sync because GitHub access was not required for the update or validation path

## Validation Status

| Check | Status | Notes |
| --- | --- | --- |
| Upstream fetch into `emdash-latest/` | Passed | Refreshed from upstream EmDash `main` at `1986dd4` |
| Rebuild `awcmsmicro-dev/` from `emdash-latest/` | Passed | Rebuilt via `update-awcmsmicro-dev.sh`; approved AWCMS-Micro boundaries preserved; 20 downstream overlays replayed |
| Validation script execution | Passed | See `LAST_VALIDATION.md` |
| SIKESRA compatibility validation | Passed | `pnpm --filter @awcms-micro/plugin-sikesra awcms:sikesra:validate-after-emdash-sync` passed with 158 tests |
| AWCMS-Micro Node template validation | Passed | `pnpm test && pnpm build` passed sequentially after dependency relink |
| AWCMS-Micro Cloudflare template validation | Passed | `pnpm validate:cloudflare-env && pnpm test && pnpm build` passed without credentialed deployment checks |
| Cloudflare credentialed deployment readiness | Passed | Root `.env` was loaded in-shell without printing values; `bash ./scripts/validate-cloudflare-env.sh --require-credentials` passed |
| Cloudflare production packaging dry run | Passed | `pnpm exec wrangler deploy --dry-run` completed and exited without mutating Cloudflare resources |

## Notes

- `emdash-latest/` remains the clean upstream snapshot.
- `awcmsmicro-dev/` is the workspace for AWCMS-Micro-specific plugin and template additions.
- Validation passes on this host with `EMDASH_WORKERD_PLUGIN_PORT_BASE=28000` exported by `scripts/validate-awcmsmicro-dev.sh`.
- A clean dependency relink was required after rebuild because stale package-local executable links initially pointed to missing `vitest` and `astro` module paths; the source compatibility checks passed after reinstall.
- Cloudflare production deployment was not executed in this local sync pass; only credentialed validation and Wrangler dry-run packaging were performed.
- Dependabot alert counts were not re-queried in this pass; use the GitHub alert workflow only when GitHub access is explicitly needed.
- The rebuilt workspace now keeps both `awcmsmicro-dev/.changeset/` and `awcmsmicro-dev/.awcms-changesets/` across syncs.
- Any accepted downstream divergence must be logged in `DIVERGENCE_LOG.md`.
