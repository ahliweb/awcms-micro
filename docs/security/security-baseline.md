# Security Baseline

## Scope

This baseline covers the AWCMS-Micro parent maintenance repository and the example plugin/template development model it governs.

## Security Model Summary

AWCMS-Micro should inherit EmDash security mechanisms where available and layer additional operational controls through plugin, template, deployment, and workflow boundaries rather than by forking EmDash core.

## Baseline Controls

- role-based access control for current operational roles
- ABAC-readiness for future tenant and contextual policy checks
- least-privilege defaults for operators and integrations
- secure secret management outside source control
- input validation and output escaping at all trust boundaries
- audit logging for sensitive actions
- soft delete and recovery-aware data handling where applicable

## Control Matrix

| Control area | Current baseline | Implementation surface | Status | Priority |
| --- | --- | --- | --- | --- |
| Upstream/core isolation | Keep EmDash core upstream-owned and avoid local core forks | root docs, sync scripts, boundary rules | Active | High |
| Product extension boundary | Implement AWCMS-Micro behavior through plugins and templates | `awcmsmicro-dev/packages/plugins/*`, `awcmsmicro-dev/templates/*` | Active | High |
| Secret management | Keep secrets out of tracked files and committed docs | `.gitignore`, validation scripts, operator process | Active | High |
| Deployment least privilege | Use dedicated deployment tokens and scoped bindings | Cloudflare deployment workflow and template config | Active | High |
| Route/path safety | Reject external URLs and traversal in plugin-local nav helpers | plugin-owned navigation utilities | Active | Medium |
| Authorization model | Keep privileged behavior behind plugin-owned permissions and inherited EmDash auth | EmDash auth + plugin routes | Active | High |
| Auditability | Record sensitive governance-style changes in plugin-owned storage/logs where appropriate | `awcms-micro-example` plugin | Active | Medium |
| Media and storage isolation | Keep media in configured object storage and avoid checked-in assets/secrets | Cloudflare template + R2 model | Active | Medium |
| Recovery readiness | Maintain backup and rollback guidance for env, DB, and deploys | root backup scripts + deployment docs | Active | Medium |
| Transitional path retirement | Shrink preserved non-plugin/template paths over time | `packages/awcms` transition plan | In progress | Medium |

## Operational Requirements

1. Do not commit secrets, tokens, private keys, `.dev.vars`, or live Cloudflare identifiers unless they are intentionally public and approved.
2. Keep new AWCMS-Micro feature work inside plugin and template boundaries.
3. Treat root scripts and docs as governance surfaces, not runtime product surfaces.
4. Validate boundaries after changing allowlists, sync rules, or protected paths.
5. Review deployment bindings and plugin capabilities whenever new functionality is introduced.

## Repository-Level Controls

- protected-path allowlist for `awcmsmicro-dev` rebuilds
- tracked-file secret-path detection in `scripts/validate-awcmsmicro-boundaries.sh`
- root documentation requiring upstream/core separation
- deployment guidance requiring placeholder-only committed configuration

## Plugin And Template Controls

- plugin routes should expose only the minimum required public endpoints
- plugin-owned admin navigation must stay inside the plugin namespace
- template deployments should consume plugin exports rather than duplicating privileged logic in root layers
- plugin and template docs should describe any sensitive integration points explicitly

## Review Checklist

When reviewing a new AWCMS-Micro change, confirm:

- does it stay out of EmDash core?
- is it implemented in a plugin or template boundary?
- does it introduce new secrets, bindings, or privileged routes?
- does it widen public attack surface?
- does it need new rollback, backup, or smoke-test instructions?

## Implementation Approach

The preferred approach is to keep security-sensitive behavior explicit, reviewable, and confined to sync-safe plugin and template boundaries while inheriting stable security behavior from upstream EmDash wherever possible.
