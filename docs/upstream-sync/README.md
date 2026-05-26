# Upstream Sync Tracking

This folder tracks how the parent repository follows upstream EmDash and how AWCMS-Micro-specific additions remain isolated from the upstream baseline.

## Purpose

- record the current upstream sync target and validation state
- document known divergence that is intentional for AWCMS-Micro
- provide a repeatable validation record after sync operations
- make operational review easier before committing or deploying changes

## Files

- `UPSTREAM_SYNC_STATUS.md`: current sync target, operator metadata, and validation status
- `LAST_UPSTREAM_FETCH.md`: exact upstream commit copied into `emdash-latest/`
- `DIVERGENCE_LOG.md`: intentional AWCMS-Micro additions or deviations from upstream EmDash
- `COMPATIBILITY_MATRIX.md`: feature-level compatibility review between upstream EmDash and AWCMS-Micro usage
- `LAST_VALIDATION.md`: latest validation run template and results

## Operating Rule

Use this folder only for parent-repository governance and sync tracking. Do not use it to justify modifying EmDash core inside `emdash-latest/`.
