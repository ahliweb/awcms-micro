# AWCMS-Micro Protected Path Allowlist

## Goal

Define the exact allowlist consumed by `bash scripts/update-awcmsmicro-dev.sh`.

Use `docs/awcms-micro-implementation-boundaries.md` for the full governance rules, upstream-only constraints, and rollback guidance.

## Approved Paths

These paths are relative to `awcmsmicro-dev/`:

- `templates/awcms-micro-default`
- `templates/awcms-micro-default-cloudflare`
- `packages/plugins/awcms-micro-example`
- `packages/plugins/awcms-micro-gallery`
- `demos/awcms-micro-cloudflare`
- `docs/awcms-micro`
- `docs/gallery`
- `e2e/awcms-micro`
- `.github/workflows`
- `.github/dependabot.yml`

## How Rebuild Preservation Works

`scripts/update-awcmsmicro-dev.sh` reads `scripts/awcmsmicro-dev-protected-paths.txt` before rebuilding `awcmsmicro-dev/` from `emdash-latest/`.

For each approved path, the script:

1. copies the current AWCMS-Micro path to a temporary backup if it exists
2. runs the upstream `rsync --delete` rebuild
3. restores only the approved backed-up paths into `awcmsmicro-dev/`

This keeps `emdash-latest/` disposable and upstream-faithful while preserving explicitly approved AWCMS-Micro implementation boundaries.

## Rules

- Add new protected paths only when they are AWCMS-Micro-owned implementation areas.
- New product behavior belongs in plugin or template boundaries, not a new shared core layer.
- Do not use this list to preserve arbitrary upstream overrides.
- Keep the protected-path list synchronized with the root workflow docs when it changes.
- Do not store secrets or Cloudflare credentials anywhere under these protected paths.
