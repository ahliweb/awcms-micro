# Synchronization Workflow

## Goal

Keep AWCMS-Micro aligned with the latest EmDash source while preserving a clear separation between:

- the upstream reference tree in `emdash-latest/`
- the AWCMS-Micro development workspace in `awcmsmicro-dev/`

## Refresh EmDash Baseline

Run:

```bash
bash scripts/update-emdash-latest.sh
```

This replaces `emdash-latest/` with a fresh copy of the latest upstream `emdash-cms/emdash` repository.

## Rebuild AWCMS-Micro Development Tree

Run:

```bash
bash scripts/update-awcmsmicro-dev.sh
```

This replaces `awcmsmicro-dev/` with a fresh working copy from `emdash-latest/`.

## Recommended Flow

1. Refresh `emdash-latest/`
2. Rebuild `awcmsmicro-dev/`
3. Make AWCMS-Micro-specific implementation changes only in `awcmsmicro-dev/`
4. Update root docs if the structure or workflow changes
