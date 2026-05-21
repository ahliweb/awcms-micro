# Synchronization Workflow

## Goal

Keep AWCMS-Micro aligned with the latest EmDash source while preserving a strict separation between:

- the upstream reference tree in `emdash-latest/`
- the AWCMS-Micro development workspace in `awcmsmicro-dev/`

## Standard Sequence

1. Analyze upstream EmDash changes.
2. Refresh `emdash-latest/` from upstream.
3. Rebuild `awcmsmicro-dev/` from `emdash-latest/`.
4. Validate `awcmsmicro-dev/` with `bash scripts/validate-awcmsmicro-dev.sh`.
5. Re-apply or continue AWCMS-Micro-specific implementation work only inside `awcmsmicro-dev/`.
6. Update root documentation if process, structure, or rules changed.

## Refresh `emdash-latest/`

Run:

```bash
bash scripts/update-emdash-latest.sh
```

Result:

- clones the latest `https://github.com/emdash-cms/emdash`
- replaces the contents of `emdash-latest/`
- excludes upstream `.git` metadata from the copied tree

## Rebuild `awcmsmicro-dev/`

Run:

```bash
bash scripts/update-awcmsmicro-dev.sh
```

Result:

- copies the current `emdash-latest/` tree into `awcmsmicro-dev/`
- removes stale files in `awcmsmicro-dev/` that no longer exist in `emdash-latest/`
- excludes transient local build artifacts such as `node_modules/`, `dist/`, `.astro/`, and `.wrangler/`

## Validate `awcmsmicro-dev/`

Run:

```bash
bash scripts/validate-awcmsmicro-dev.sh
```

Result:

- runs install, typecheck, lint, test, and build commands when `pnpm` is available
- writes the latest validation record to `docs/upstream-sync/LAST_VALIDATION.md`
- fails clearly when dependency install, tests, or validation steps fail

## Combined Sync Workflow

Run:

```bash
bash scripts/sync-and-validate-awcmsmicro-dev.sh
```

This wrapper refreshes `emdash-latest/`, rebuilds `awcmsmicro-dev/`, runs validation, and updates `docs/upstream-sync/UPSTREAM_SYNC_STATUS.md`.

## Operating Rules

- Treat `emdash-latest/` as disposable and reproducible from upstream.
- Treat `awcmsmicro-dev/` as the only place for AWCMS-Micro implementation work inside this parent repository.
- Keep changes atomic so upstream sync and downstream adaptation can be reviewed separately.
- When a sync or adaptation effort is too large, split it into smaller GitHub issues.

## Language Rule During Synchronization

- Keep root-level workflow and governance documentation in English (US).
- Do not rewrite `emdash-latest/` content to normalize spelling, because it must remain faithful to upstream EmDash.
- Allow `awcmsmicro-dev/` to inherit upstream wording when it is rebuilt from `emdash-latest/`.
