# Documentation Index

This folder contains the root-level technical documentation for the AWCMS-Micro parent repository.

## Documents

- `repository-structure.md`: root folder contract, responsibilities, and boundaries
- `synchronization-workflow.md`: operational workflow for updating `emdash-latest/` and rebuilding `awcmsmicro-dev/`
- `implementation-instructions.md`: implementation mandate, constraints, and task-splitting guidance
- `awcms-micro-implementation-boundaries.md`: approved AWCMS-Micro implementation boundaries and preservation rules
- `repository-assessment.md`: current repository assessment and prioritized development/documentation recommendations
- `decision-records.md`: lightweight index of major AWCMS-Micro repository decisions
- `awcms-micro-product-readme-draft.md`: sync-safe draft README for the future independent `awcms-micro` repository
- `awcms-micro-product-readme-final.md`: final product-facing README source for the independent `awcms-micro` repository
- `awcms-micro-repository-promotion-checklist.md`: repository promotion steps and verification checklist for the independent `awcms-micro` repository
- `awcms-micro-release-readiness-checklist.md`: release-readiness checks for promoting `awcmsmicro-dev/` into an independent repository state
- `operator-workflow.md`: concise end-to-end operator workflow for sync, validation, and promotion
- `awcmsmicro-dev-protected-paths.md`: exact allowlist consumed during `awcmsmicro-dev` rebuilds
- `nested-navigation-public-and-plugin-header.md`: nested public menu and plugin header submenu guidance without changing the EmDash admin sidebar
- `upstream-sync/README.md`: upstream sync status, divergence tracking, and validation records
- `upstream-sync/LAST_UPSTREAM_FETCH.md`: exact upstream revision copied into `emdash-latest/`
- `deployment/cloudflare.md`: Cloudflare deployment guidance and related infrastructure notes
- `security/security-baseline.md`: security, privacy, ISO, and Indonesia compliance baseline documentation

## Reading Order

1. Read `repository-structure.md` to understand the parent repository layout.
2. Read `synchronization-workflow.md` before refreshing either working tree.
3. Read `awcms-micro-implementation-boundaries.md` before changing AWCMS-Micro custom boundaries.
4. Read `awcmsmicro-dev-protected-paths.md` before changing the sync-safe allowlist.
5. Read `implementation-instructions.md` before making AWCMS-Micro-specific changes.
6. Read `repository-assessment.md` before planning new AWCMS-Micro development or documentation work.
7. Read `decision-records.md` before changing a repository-shaping rule or boundary model.
8. Read `awcms-micro-product-readme-draft.md` before preparing product-facing repository onboarding content.
9. Read `awcms-micro-product-readme-final.md` before replacing the independent repository README.
10. Read `awcms-micro-repository-promotion-checklist.md` before promoting the maintained workspace into an independent repository state.
11. Read `awcms-micro-release-readiness-checklist.md` before declaring the maintained workspace promotion-ready.
12. Read `operator-workflow.md` for the shortest end-to-end maintenance and promotion path.
13. Read `nested-navigation-public-and-plugin-header.md` before implementing public dropdown menus or plugin-owned header navigation.
14. Read `upstream-sync/README.md` before reviewing sync state or divergence.
15. Read `deployment/cloudflare.md` and `security/security-baseline.md` before infrastructure or governance changes.

## Language Policy

English (US) is the official language for this root documentation set.

Exception:

- content preserved from upstream EmDash may retain upstream wording and spelling
