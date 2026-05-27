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

### DR-007: Plugin Placement, Sidebar Grouping, and i18n Rules

- Decision: place active plugin sidebars directly below Dashboard, grouped individually, and require full English default and Indonesian translation capability
- Why: visual isolation and premium localized user experience for plugins, avoiding layout clutter in admin navigation
- See: `docs/implementation-instructions.md`, `AGENTS.md`

## How To Extend

When a new repository-shaping decision is introduced:

1. add a short record here
2. update the deeper supporting document
3. update `DIVERGENCE_LOG.md` if the decision creates or retires a meaningful downstream divergence
