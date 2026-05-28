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
- `awcms-micro-prd.md`: detailed PRD for the future independent `awcms-micro` repository, including architecture, schema, and Mermaid diagrams
- `awcms-micro-repository-promotion-checklist.md`: repository promotion steps and verification checklist for the independent `awcms-micro` repository
- `awcms-micro-release-readiness-checklist.md`: release-readiness checks for promoting `awcmsmicro-dev/` into an independent repository state
- `awcms-micro-root-versioning.md`: root-level AWCMS maintenance versioning and changelog flow, including the workspace snapshot for every plugin and template in `awcmsmicro-dev/`
- `awcms-micro-versioning.md`: AWCMS-Micro-only automatic versioning and changelog flow for plugins and templates
- `awcms-micro-versioning-rollout-summary.md`: concise summary of the AWCMS-Micro versioning automation rollout and local proof runs
- `awcms-micro-licensing.md`: root MIT license plus package-level AW Non-Commercial License guidance
- `awcms-micro-d1-mirror-sync.md`: limited two-way D1 mirror workflow for DBeaver on a local SQLite file
- `operator-workflow.md`: concise end-to-end operator workflow for sync, validation, and promotion
- `backup/gitlab-mirror-setup.md`: GitLab PAT-based mirror setup and recovery notes
- `security/backup-restore.md`: backup and restore baseline expectations
- `awcmsmicro-dev-protected-paths.md`: exact allowlist consumed during `awcmsmicro-dev` rebuilds
- `nested-navigation-public-and-plugin-header.md`: nested public menu and plugin header submenu guidance; see the separate upstream-sync sidebar-ordering note for plugin-first admin navigation
- `upstream-sync/README.md`: upstream sync status, divergence tracking, and validation records
- `upstream-sync/LAST_UPSTREAM_FETCH.md`: exact upstream revision copied into `emdash-latest/`
- `upstream-sync/ISSUE_CLASSIFICATION_DOWNSTREAM_VS_UPSTREAM.md`: triage guide for deciding whether a discovered issue belongs in downstream boundaries or upstream EmDash core
- `upstream-sync/UPSTREAM_PR_PLAN_ADMIN_SIDEBAR_ORDERING.md`: narrow upstream PR plan for global admin sidebar ordering support
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
10. Read `awcms-micro-prd.md` before changing product requirements, architecture, database, or user-flow assumptions.
11. Read `awcms-micro-repository-promotion-checklist.md` before promoting the maintained workspace into an independent repository state.
12. Read `awcms-micro-release-readiness-checklist.md` before declaring the maintained workspace promotion-ready.
13. Read `awcms-micro-root-versioning.md` before updating the workspace snapshot or the root maintenance changelog.
14. Read `awcms-micro-versioning.md` before preparing AWCMS-Micro plugin or template releases.
15. Read `awcms-micro-versioning-rollout-summary.md` to review the implemented AWCMS versioning rollout and proof runs.
16. Read `awcms-micro-licensing.md` before changing package or manifest license metadata.
17. Read `awcms-micro-d1-mirror-sync.md` before connecting DBeaver to the local mirror or syncing D1 changes.
18. Read `operator-workflow.md` for the shortest end-to-end maintenance and promotion path.
19. Read `backup/gitlab-mirror-setup.md` and `security/backup-restore.md` before changing backup, mirror, or recovery flows.
20. Read `nested-navigation-public-and-plugin-header.md` before implementing public dropdown menus or plugin-owned header navigation.
21. Read `upstream-sync/README.md` before reviewing sync state or divergence.
22. Read `upstream-sync/ISSUE_CLASSIFICATION_DOWNSTREAM_VS_UPSTREAM.md` before triaging whether a defect should be fixed downstream or escalated upstream.
23. Read `upstream-sync/UPSTREAM_PR_PLAN_ADMIN_SIDEBAR_ORDERING.md` before preparing upstream admin-sidebar ordering work.
24. Read `deployment/cloudflare.md` and `security/security-baseline.md` before infrastructure or governance changes.

## Language Policy

English (US) is the official language for this root documentation set.

Exception:

- content preserved from upstream EmDash may retain upstream wording and spelling
