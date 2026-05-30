# Decision Records

## Purpose

This file is a lightweight index of major AWCMS-Micro repository decisions.

Use it as the shortest entry point when you need to understand why the repository is structured the way it is before reading the full supporting documents.

## Current Decisions

### DR-001: Upstream EmDash Remains The Core Source

- Decision: keep `emdash-latest/` as the upstream-faithful EmDash snapshot and avoid placing AWCMS-Micro product logic there
- Why: preserve clean upstream comparison and low-friction synchronization
- See: `docs/repository-structure.md`, `docs/synchronization-workflow.md`

### DR-002: AWCMS-Micro Product Work Is Plugin-And-Template-Only

- Decision: implement new AWCMS-Micro behavior only through plugin and template boundaries
- Why: avoid creating a second shared core layer parallel to EmDash
- See: `docs/implementation-instructions.md`, `docs/awcms-micro-implementation-boundaries.md`

### DR-003: Root Docs And Scripts Are Governance Surfaces

- Decision: keep root docs and scripts focused on sync workflow, validation, deployment, and governance
- Why: separate maintenance operations from product runtime behavior
- See: `README.md`, `docs/operator-workflow.md`

### DR-004: Promotion To An Independent Repository Is Explicitly Prepared

- Decision: keep sync-safe product-facing README and promotion artifacts at the parent-repository level
- Why: `awcmsmicro-dev/README.md` is rebuilt from upstream and is not the right place for persistent downstream product identity work
- See: `docs/awcms-micro-product-readme-final.md`, `docs/awcms-micro-repository-promotion-checklist.md`, `docs/awcms-micro-release-readiness-checklist.md`

### DR-005: Divergence Must Be Logged And Reviewable

- Decision: maintain compatibility and divergence tracking as explicit governance artifacts
- Why: make downstream changes auditable and easier to review during future syncs
- See: `docs/upstream-sync/DIVERGENCE_LOG.md`, `docs/upstream-sync/COMPATIBILITY_MATRIX.md`

### DR-006: AWCMS-Micro Uses Its Own Downstream Versioning Flow

- Decision: keep AWCMS-Micro plugin and template versioning separate from upstream EmDash Changesets
- Why: downstream AWCMS release cadence and package set differ from the upstream monorepo release set
- See: `docs/awcms-micro-versioning.md`, `docs/awcms-micro-versioning-rollout-summary.md`

### DR-011: Workspace Package Releases Stay On Changesets

- Decision: keep published workspace packages like `@emdash-cms/admin` on the standard `awcmsmicro-dev/.changeset/` flow, separate from downstream `@awcms-micro/*` release notes
- Why: avoid mixing upstream package release metadata with AWCMS-Micro-specific release boundaries
- See: `docs/awcms-micro-versioning.md`, `docs/awcms-micro-root-versioning.md`

### DR-007: Root Changelog Carries The Workspace Snapshot

- Decision: keep the parent repository root changelog as the authoritative workspace snapshot for the current EmDash SHA and the latest version/changelog entry of every plugin and template in `awcmsmicro-dev/`
- Why: make the current maintenance state visible in one place without modifying `emdash-latest/`
- See: `README.md`, `CHANGELOG.md`, `docs/awcms-micro-root-versioning.md`

### DR-008: Plugin Placement, Sidebar Grouping, and i18n Rules

- Decision: place active plugin sidebars directly below Dashboard, grouped individually, and require full English default and Indonesian translation capability
- Why: visual isolation and premium localized user experience for plugins, avoiding layout clutter in admin navigation
- See: `docs/implementation-instructions.md`, `AGENTS.md`, `docs/upstream-sync/UPSTREAM_PR_PLAN_ADMIN_SIDEBAR_ORDERING.md`

### DR-009: Core Performance Bottlenecks Must Be Escalated Upstream

- Decision: when AWCMS-Micro public performance hotspots remain in upstream-owned EmDash core paths after downstream template cleanup, document and escalate them upstream instead of patching core locally
- Why: preserve the plugin-and-template-only downstream model and keep performance fixes reviewable in the canonical EmDash codebase
- See: `docs/upstream-sync/ISSUE_CLASSIFICATION_DOWNSTREAM_VS_UPSTREAM.md`, `docs/awcms-micro-implementation-boundaries.md`

### DR-010: Plugin-First Admin Navigation Is A Downstream Adaptation

- Decision: render plugin admin groups directly below Dashboard in `awcmsmicro-dev/`, keep each plugin in its own collapsible group, and reuse the same ordering in the command palette
- Why: keep AWCMS-Micro plugin navigation clear and consistent while staying inside downstream admin-shell boundaries
- See: `AGENTS.md`, `docs/implementation-instructions.md`, `docs/upstream-sync/UPSTREAM_PR_PLAN_ADMIN_SIDEBAR_ORDERING.md`

### DR-012: Fresh-Clone Sync Requires Explicit Local Bootstrap Choices

- Decision: distinguish `continuation` and `fresh-clone` update modes, and require fresh-clone runs to capture local bootstrap choices such as template name, built-in plugin usage, and local `.env`-based GitHub/Cloudflare config before sync proceeds
- Why: prevent a new clone from silently inheriting the wrong deployment, naming, or service configuration and keep operator choices outside git
- See: `docs/operator-workflow.md`, `docs/synchronization-workflow.md`, `scripts/sync-preflight-checklist.sh`

## How To Extend

When a new repository-shaping decision is introduced:

1. add a short record here
2. update the deeper supporting document
3. update `DIVERGENCE_LOG.md` if the decision creates or retires a meaningful downstream divergence
