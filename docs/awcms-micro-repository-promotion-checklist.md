# AWCMS-Micro Repository Promotion Checklist

## Purpose

This checklist describes how to promote the maintained AWCMS-Micro workspace into an independent `awcms-micro` repository state without losing the sync discipline established in the parent repository.

## Preconditions

Before promotion, confirm all of the following:

1. `awcmsmicro-dev/` has been rebuilt from the intended `emdash-latest/` snapshot.
2. Boundary validation passes.
3. Plugin and template changes needed for the release are complete.
4. No required AWCMS-Micro behavior still depends on a retired shared core layer.
5. Product-facing documentation has been reviewed.

## Promotion Inputs

Use these source materials during promotion:

- `docs/awcms-micro-product-readme-final.md`
- `docs/deployment/cloudflare.md`
- `docs/security/security-baseline.md`
- `docs/upstream-sync/COMPATIBILITY_MATRIX.md`
- plugin and template READMEs under `awcmsmicro-dev/`

## Repository Promotion Steps

1. Rebuild `awcmsmicro-dev/` from the desired `emdash-latest/` snapshot.
2. Validate the workspace.
3. Replace the upstream-style repository README in the independent repo with the content from `docs/awcms-micro-product-readme-final.md`.
4. Keep product development surfaces limited to:
   - `packages/plugins/`
   - `templates/`
5. Carry over only the AWCMS-Micro-owned docs that are relevant to the independent repository.
6. Review package names, local path examples, and README examples for product-consistent naming.
7. Confirm no references remain to retired boundaries or parent-only maintenance paths.
8. Re-run project validation inside the independent repository.

## Documentation Promotion Checklist

- README is product-facing rather than maintenance-facing.
- Plugin docs use the current `awcms-micro-*` naming style.
- Deployment docs point to the active template surfaces.
- Security docs describe the plugin-and-template-only model clearly.
- Compatibility notes describe AWCMS-Micro overlays individually.

## Cleanup Checklist

Before finalizing promotion:

- remove parent-repository-only references that do not belong in the independent repo
- remove any obsolete transitional notes
- confirm the independent repository does not present itself as an upstream EmDash mirror
- confirm the independent repository does not describe retired shared core layers

## Verification Checklist

Run the closest applicable checks for the promoted state:

1. boundary or structural validation that still applies in the independent repo
2. plugin package typecheck and tests
3. template typecheck for the target deployment surface
4. deployment smoke checks for the selected environment

## Exit Criteria

Promotion is considered complete when:

- the repository presents itself clearly as AWCMS-Micro
- product behavior lives in plugin and template boundaries
- required docs are product-facing and current
- validation passes for the intended deployment surface
