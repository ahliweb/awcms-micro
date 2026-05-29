# Upstream Sync Status

## Source

- Upstream repository URL: `https://github.com/emdash-cms/emdash`
- Upstream branch: `main`
- Upstream commit SHA: `19c580240158747733b30c5f04a45bdf4df73518`
- Sync date: `2026-05-29T08:20:23Z`
- Operator: `unggul`
- Target folder: `emdash-latest/`
- Development workspace: `awcmsmicro-dev/`

## Status Summary

Synced to EmDash `19c58024`. `emdash-latest/` and `awcmsmicro-dev/` both refreshed successfully, the downstream workspace validates cleanly on this host, and the rebuild allowlist now preserves `awcmsmicro-dev/.changeset/` so workspace package-release metadata survives future upstream rebuilds.

## Key Changes in This Sync

- `fix(triage): use CLOUDFLARE_API_KEY (not _TOKEN) for the AI Gateway` in the upstream triage workflow
- `fix(triage): run flue from repo root, not .flue/, so --root resolves correctly`
- Downstream sync fix: preserve `awcmsmicro-dev/.changeset/` in the protected rebuild allowlist and root boundary documentation

## Validation Status

| Check | Status | Notes |
| --- | --- | --- |
| Upstream fetch into `emdash-latest/` | Passed | Refreshed from upstream EmDash `main` |
| Rebuild `awcmsmicro-dev/` from `emdash-latest/` | Passed | Rebuilt via `update-awcmsmicro-dev.sh`; approved AWCMS-Micro boundaries preserved |
| Validation script execution | Passed | See `LAST_VALIDATION.md` |

## Notes

- `emdash-latest/` remains the clean upstream snapshot.
- `awcmsmicro-dev/` is the workspace for AWCMS-Micro-specific plugin and template additions.
- Validation passes on this host with `EMDASH_WORKERD_PLUGIN_PORT_BASE=28000` exported by `scripts/validate-awcmsmicro-dev.sh`.
- The rebuilt workspace now keeps both `awcmsmicro-dev/.changeset/` and `awcmsmicro-dev/.awcms-changesets/` across syncs.
- Any accepted downstream divergence must be logged in `DIVERGENCE_LOG.md`.
