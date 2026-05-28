# Repository Assessment

## Scope

This assessment summarizes the current state of the parent maintenance repository and gives prioritized recommendations for AWCMS-Micro development and documentation.

## Current State

The repository already follows the correct high-level model:

- `emdash-latest/` is the clean upstream EmDash reference snapshot.
- `awcmsmicro-dev/` is the rebuildable AWCMS-Micro working tree.
- root `docs/` and `scripts/` act as the governance and synchronization layer.
- root `CHANGELOG.md` and `VERSION` capture the current maintenance release state plus the workspace snapshot for every plugin and template in `awcmsmicro-dev/`.
- AWCMS-Micro-owned work is mostly isolated into preserved boundaries rather than mixed into upstream EmDash core.

This is a strong foundation for keeping `awcms-micro` aligned with EmDash while still allowing project-specific example work.

## Main Findings

### 1. Direction Is Sound, but Guardrails Needed Tightening

The repository intent is already clear: adopt EmDash fully and avoid maintaining a fork of EmDash core.

The main operational risk was consistency:

- a preserved path existed in the allowlist but was not validated by the boundary checker
- the human-readable allowlist documentation had drifted from the real allowlist
- protected-path rebuild backup could carry transient local artifacts across sync operations

### 2. AWCMS-Micro Needs A Stronger Product Rule

The clearest maintainable rule for this repository is:

- new AWCMS-Micro product behavior should be implemented as plugins
- public site behavior and example delivery should be implemented as templates

Supporting layers can still exist in docs, demos, E2E coverage, and workflow files, but new product capability should not grow through a parallel shared core fork.

### 3. Documentation Is Good At Governance, Lighter On Product Identity

The root docs explain the maintenance workflow well, but they still need stronger product-facing guidance around:

- what AWCMS-Micro is trying to standardize beyond upstream EmDash
- where future work belongs by default
- what is transitional versus strategic

The root versioning docs now address the current workspace snapshot explicitly, so the remaining gap is mostly product-facing guidance rather than maintenance-state visibility.

## Development Recommendations

### Priority 1

- Keep all new AWCMS-Micro behavior in plugin and template boundaries.
- Treat root scripts and root docs as workflow support, not product surfaces.
- Avoid introducing new shared AWCMS-Micro core layers unless the repository rules are intentionally revised.

### Priority 2

- Keep example plugins small, explicit, and independently reusable.
- Keep templates focused on delivery, presentation, seed data, and integration wiring.
- When a plugin and template share a convention, document that convention first before creating new code abstractions.

### Priority 3

- Continue removing any future drift back toward shared non-plugin, non-template product layers.
- When a utility is still needed, keep it plugin-owned or template-owned and document the ownership boundary clearly.

## Documentation Recommendations

### Priority 1

- Keep the root docs explicit that AWCMS-Micro development is plugin-and-template-only.
- Keep the allowlist documentation synchronized with `scripts/awcmsmicro-dev-protected-paths.txt`.
- Record transitional preserved paths clearly so they are not mistaken for approved growth areas.

### Priority 2

- Expand compatibility tracking to mention the major AWCMS-Micro overlays individually, especially templates, plugins, deployment overlays, and navigation standards.
- Expand divergence tracking so it stays a decision log, not only a history list.

### Priority 3

- Strengthen deployment and security docs from overview text into operator runbooks and control matrices.
- Add product-facing documentation in the eventual independent `awcms-micro` repository so users do not experience it as an unmodified EmDash checkout.

## Recommended Ongoing Workflow

1. Refresh `emdash-latest/` from upstream EmDash.
2. Rebuild `awcmsmicro-dev/` from `emdash-latest/`.
3. Validate the workspace.
4. Implement AWCMS-Micro work only through approved plugin and template boundaries.
5. Update root governance docs whenever boundaries or workflow rules change.

## Decision Summary

The repository should continue evolving as:

- upstream EmDash snapshot plus sync workflow at the root
- AWCMS-Micro example plugins
- AWCMS-Micro example templates
- supporting docs, demos, validation, and deployment guidance

It should not evolve into a second core implementation layer parallel to EmDash.
