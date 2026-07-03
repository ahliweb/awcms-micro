# Compatibility Matrix

This matrix compares upstream EmDash features with AWCMS-Micro usage decisions.

## Current Position

AWCMS-Micro currently adopts upstream EmDash core directly and keeps downstream behavior in isolated plugin, template, documentation, demo, and validation surfaces.

| EmDash upstream feature | AWCMS-Micro usage | Compatibility status | Risk | Action |
| --- | --- | --- | --- | --- |
| Core content modeling and runtime | Adopt directly through upstream sync | Compatible | Low | adopt |
| Built-in templates | Preserve unchanged; do not modify in place | Compatible | Low | adopt |
| Built-in plugin packages | Preserve unchanged; do not modify in place | Compatible | Low | adopt |
| Parent repository governance docs | Root-only AWCMS-Micro documentation layer | Compatible | Low | adapt |
| `templates/awcms-micro-default` | Isolated Node/SQLite reference template | Compatible | Low | adapt |
| `templates/awcms-micro-default-cloudflare` | Isolated Cloudflare reference template with plugin wiring | Compatible | Medium | adapt |
| `packages/plugins/awcms-micro-sikesra` | Isolated AWCMS-Micro governance plugin carrying SIKESRA navigation, access, audit, and ABAC-oriented workflows | Compatible | Medium | adapt |
| `packages/plugins/awcms-micro-docs` | Isolated AWCMS-Micro docs plugin providing a plugin descriptor, admin docs page, and shared public docs copy | Compatible | Low | adapt |
| `packages/plugins/awcms-micro-gallery` | Isolated AWCMS-Micro gallery plugin providing gallery settings, public list, media validation, and audit-ready hooks | Compatible | Medium | adapt |
| `packages/plugins/awcms-micro-website-social` | Isolated AWCMS-Micro website social plugin providing public social contact configuration and WhatsApp CTA management | Compatible | Low | adapt |
| Plugin-owned navigation compatibility layer | Keep navigation normalization and label resolution in plugin exports rather than a new shared core layer | Compatible | Medium | adapt |
| Supporting docs, demos, and E2E boundaries | Keep as validation and operator surfaces only | Compatible | Low | adapt |
| Downstream patch overlays | Replay narrow source-level overrides from `.awcms-patches/` after rebuild instead of preserving broad upstream-owned files | Compatible | Medium | adapt |
| Built-in Forms plugin admin usability overlay | Preserved as patch overlay `0029-forms-admin-search-pagination.patch` instead of adding the upstream-owned plugin to the protected allowlist | Compatible | Medium | adapt |
| Flue review worker dependency overlay | Preserved as patch overlay `0030-flue-review-hono.patch` instead of adding the upstream-owned worker to the protected allowlist | Compatible | Low | adapt |
| Cloudflare deployment overlays | Document as environment-specific deployment guidance | Compatible | Medium | adapt |
| Compliance and security baselines | Document as operational guidance rather than core changes | Compatible | Low | adapt |
| EmDash `0.17.2` experimental plugin registry documentation and release asset workflow | Adopt upstream docs/runtime directly; keep AWCMS-Micro plugins published and wired through isolated workspace package/template dependencies | Compatible | Medium | adopt |
| EmDash `0.17.2` plugin admin root routing fix | Adopt upstream admin routing behavior; keep SIKESRA route normalization inside the plugin boundary as downstream compatibility coverage | Compatible | Low | adopt |
| EmDash `0.17.2` SEO media URL and setup probe hardening | Adopt upstream core fixes directly through `emdash-latest` and rebuilt `awcmsmicro-dev`; no downstream override required | Compatible | Low | adopt |
| EmDash `0.17.2` Postgres schema introspection isolation | Adopt upstream database test/runtime improvements; keep SIKESRA canonical data isolated in future `sikesra_` tables | Compatible | Low | adopt |
| EmDash `0.18.0` scheduled publishing driver (`@emdash-cms/cloudflare/worker`) | Adopted; AWCMS-Micro Cloudflare template `src/worker.ts` re-exports `@emdash-cms/cloudflare/worker`; `wrangler.jsonc` includes `triggers.crons` | Compatible | Low | adopt |
| EmDash `0.18.0` D1 batch coalescing | Adopt upstream behavior directly; no template changes required | Compatible | Low | adopt |
| EmDash `0.18.0` TaxonomyTerm hydration on entries | Adopted; AWCMS-Micro templates include `terms?: Record<string, TaxonomyTerm[]>` in `emdash-env.d.ts` | Compatible | Low | adopt |
| EmDash `0.19.0` scheduled publishing heartbeat fix (`publishDueContent` sweep) | Adopted; `src/worker.ts` and `wrangler.jsonc` already correct from 0.18.0 sync; post-deploy verification tracked in issue #205 | Compatible | Low | adopt |
| EmDash `0.19.0` `getEntriesByByline()` helper | Additive; AWCMS-Micro templates do not yet use it; author archive pages planned in issue #204 | Compatible | Low | delay |
| EmDash `0.19.0` responsive srcset for media | Automatic through Astro image service; no template changes required | Compatible | Low | adopt |
| EmDash `0.19.0` admin content list filtering (author, date-range) | Adopt upstream admin behavior directly; no template changes required | Compatible | Low | adopt |
| EmDash `0.19.0` `RelationRepository` data layer | Foundation only; no field type, API, or admin UI yet; content references implementation planned in issue #202 | Compatible | Low | delay |
| EmDash `0.19.0` migration 043 (`_emdash_relations`, `_emdash_content_references`) | Already applied in production from 0.18.0 sync (was present at `ff5855ab`); confirmed in 0.19.0 release tag | Compatible | Low | adopt |
| EmDash `0.20.0` Durable Object SQLite adapter | Deferred by #222 because it is a database-backend change; AWCMS-Micro production remains D1 + R2 | Compatible | Medium | delay |
| EmDash `0.22.0` KV-backed object cache | Deferred by #222 until measured public-read pressure justifies a dedicated CACHE namespace, TTL/invalidation rules, and rollback plan | Compatible | Medium | delay |
| EmDash `0.22.0` Cloudflare media image endpoint | Present in the synchronized 0.26.0 workspace; Cloudflare template build and deploy dry-run pass | Compatible | Medium | adopt |
| EmDash `0.23.0` Hyperdrive adapter | Deferred by #222 because Hyperdrive is a Postgres/MySQL route and AWCMS-Micro ADR keeps Micro on D1 | Compatible | Medium | delay |
| EmDash `0.24.0` offset pagination | Present in the synchronized 0.26.0 workspace; template adoption for numbered archive UX remains optional | Compatible | Low | adapt |
| EmDash `0.26.0` content schedule hooks and 0.25.0 restore hook | Present in the synchronized 0.26.0 workspace; downstream plugin usage requires focused design when needed | Compatible | Medium | adapt |
| EmDash `0.26.0` Cloudflare Email Sending provider plugin | Deferred by #222 until transactional-email scope, sender domain onboarding, deliverability, consent, and binding restrictions are designed | Compatible | Medium | delay |
| EmDash `0.26.0` migrations 044-048 | Production D1 records through migration 048; schema objects and smoke checks verified in #221 | Compatible | Medium | adapt |
| EmDash `0.26.0` admin/sidebar and route-scoped CSS changes | Upstream admin files changed heavily; AWCMS protected admin overlays replay after context repair and validation passes | Compatible | Medium | adapt |
| Downstream patch overlays against EmDash `0.26.0` | Repaired or retired stale overlays; `update-awcmsmicro-dev.sh` rebuild and boundary validation pass | Compatible | Medium | adapt |
| EmDash `0.27.0` migration 049 taxonomy composite index | Present in synchronized local/dev workspaces; production verification tracked in #226 | Compatible | Medium | adapt |
| EmDash `0.27.0` deployed-site schema-evolution docs | Adopt as operator guidance for live content-model changes; keep destructive schema rehearsals backed by production D1 backups and preview environments | Compatible | Low | adopt |
| EmDash `0.27.0` Cloudflare Email descriptor fix | Runtime fix adopted through sync, but default AWCMS-Micro email binding remains deferred until sender/deliverability/consent/binding scope is designed | Compatible | Medium | delay |
| EmDash `0.27.0` D1 Sessions warning for `global_fetch_strictly_public` | Keep D1 read-replica sessions disabled by default in AWCMS-Micro templates; document as an adoption guardrail | Compatible | Medium | adapt |
| EmDash `0.27.0` semantic theme-token template architecture | Built-in template changes are adopted upstream; protected AWCMS-Micro default-template adaptation was reviewed in #227 and deferred pending a focused parity-preserving implementation issue | Compatible | Medium | delay |
| Downstream patch overlays against EmDash `0.27.0` | `update-awcmsmicro-dev.sh` replayed all 21 active overlays cleanly after the 0.27.0 refresh | Compatible | Medium | adapt |

## Usage Notes

- `adopt` means AWCMS-Micro uses upstream behavior directly.
- `adapt` means AWCMS-Micro adds isolated downstream plugins, templates, overlays, or documentation without changing EmDash core.
- `delay` means the feature should be reviewed later.
- `reject` means the feature is intentionally out of scope.
