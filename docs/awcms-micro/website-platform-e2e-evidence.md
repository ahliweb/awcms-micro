# Website Platform End-to-End Evidence Matrix (Issue #273)

Parent epic: **#261**. Depends on: #262–#272 (all shipped/merged).

## Purpose

Issue #273 asks for reproducible evidence that the AWCMS-Micro public website
platform (SEO/distribution, theming, search, comments, newsletter, deployment,
restore, upgrade) works **together** on a real derived tenant site, without
editing the base registry or bypassing security/accessibility/SEO/performance/
recovery controls.

This document is the **evidence report**: it maps every epic (#261) and #273
acceptance criterion to the concrete in-repo test/command/artifact that proves
it, and it states **honestly** which criteria are proven in this base repository
versus which are deferred to the **external derived-site pilot** (`ahliweb/awpos`,
see [`derived-app-pilot-plan.md`](derived-app-pilot-plan.md)) or to **real
infrastructure drills** (deployment, measured RTO/RPO, Core Web Vitals on
representative volume, base-upgrade rehearsal). Those deferred parts are tracked
as separate atomic issues (see [§Deferred work](#deferred-work)); #273 remains
open until they land.

> **Scope boundary.** No ERP/POS/vertical business logic is added to the base by
> this evidence work. The derived pilot composes through the existing
> `src/modules/application-registry.ts` + compatibility-manifest contracts only.

## How to reproduce

The bulk of this evidence runs from the repository-required Bun + PostgreSQL
environment:

```bash
# Full gate (lint + docs + contracts + typecheck + unit + build):
bun run check

# PostgreSQL integration suite (needs DATABASE_URL + applied migrations):
DATABASE_URL=postgres://…  bun run db:migrate
DATABASE_URL=postgres://…  bun test tests/integration

# Browser E2E smoke (needs a running server + seed DB):
bun run test:e2e

# Derived-application composition + compatibility proof (no base edits):
bun run extension:check
bun run modules:compose:check
bun run modules:composition:inventory:check

# Query/plan performance budgets + production preflight:
bun run performance:query-plan:check
bun run production:preflight
```

The integration suite is **gated on `DATABASE_URL`** (`integrationEnabled` in
[`tests/integration/harness.ts`](../../tests/integration/harness.ts)) and route
handlers run as the least-privilege `awcms_micro_app` role so `FORCE`d RLS is
actually exercised — a green `bun run check` **without** a database silently
skips it, so the matrix below is only fully proven in CI.

## Epic #261 — Definition of Done coverage

| Epic DoD criterion                                                                                                                          | In-repo evidence                                                                                                                                                                                                                                                   | Status                                |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| Every child issue completed or explicitly closed                                                                                            | #262–#272 merged; #273 tracked here                                                                                                                                                                                                                                | in progress                           |
| README/ADR/architecture/ERD/SOP/threat-model/governance/inventory describe full-online WEBSITE scope without ERP/offline drift              | `scope:consistency:check`, `config:docs:check`, ADR-0025/0027                                                                                                                                                                                                      | covered (existing)                    |
| Media-library implementation/presets/capabilities/readiness/docs consistent                                                                 | `media-library:consistency:check`, [`media-library-tenant-state.integration.test.ts`](../../tests/integration/media-library-tenant-state.integration.test.ts)                                                                                                      | covered (existing)                    |
| Canonical/hreflang/social/JSON-LD/sitemaps/feeds/robots/redirects for a tenant                                                              | [`website-platform-seo-discovery-validation.integration.test.ts`](../../tests/integration/website-platform-seo-discovery-validation.integration.test.ts) (new) + `seo-distribution-rendering`, `seo-discovery`, `seo-redirect-*`                                   | covered (new + existing)              |
| Reviewed theme/template without arbitrary code / CSP / a11y breakage                                                                        | [`theming-preview.e2e.ts`](../../tests/e2e/theming-preview.e2e.ts), `css-value-validation` unit tests, CSP asserts in [`website-platform-public-security.integration.test.ts`](../../tests/integration/website-platform-public-security.integration.test.ts) (new) | covered (new + existing)              |
| Public search tenant/locale/publish-state safe, bounded, rebuildable, reconcilable                                                          | new SEO/discovery suite (search section) + `site-search*`                                                                                                                                                                                                          | covered (new + existing)              |
| Comments moderation/abuse/privacy/retention/deletion/notifications                                                                          | [`comments.integration.test.ts`](../../tests/integration/comments.integration.test.ts), `comments-smoke.e2e.ts`                                                                                                                                                    | covered (existing)                    |
| Newsletter consent/double-opt-in/unsubscribe/suppression/provider-neutral/reconciliation/privacy                                            | [`newsletter.integration.test.ts`](../../tests/integration/newsletter.integration.test.ts), `newsletter-smoke.e2e.ts`                                                                                                                                              | covered (existing)                    |
| Production media/object-storage + deployment profiles explicit/durable/recoverable/preflight-validated                                      | `deployment-profiles.md`, `storage-profile.ts`, `production:preflight`; **measured RTO/RPO on real infra**                                                                                                                                                         | partial → [§Deferred](#deferred-work) |
| Browser E2E, a11y, SEO/schema/feed, link, security/adversarial, perf/CWV budgets, build, `check`, readiness, backup/restore, preflight pass | this matrix; **CWV + load/soak + link-check on real volume**                                                                                                                                                                                                       | partial → [§Deferred](#deferred-work) |
| Derived bilingual pilot proves composition + one base upgrade without base edits or data loss                                               | fixtures [`derived-application-example`](../../tests/fixtures/derived-application-example) + [`derived-theme-example`](../../tests/fixtures/derived-theme-example) + `extension:check`; **live pilot execution + upgrade rehearsal**                               | partial → [§Deferred](#deferred-work) |
| Residual risks/limitations/ownership/follow-up documented                                                                                   | this document, [§Residual risks](#residual-risks-and-limitations)                                                                                                                                                                                                  | covered (this PR)                     |

## Issue #273 — acceptance-criteria coverage

| #273 acceptance criterion                                                                                                                     | In-repo evidence                                                                                                                                                                                                                 | Status                                |
| --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Derived content + theme compose without editing base registry; pass compatibility checks                                                      | `extension:check`, `modules:compose:check`, derived fixtures                                                                                                                                                                     | covered (existing)                    |
| Tenant/domain/locale isolation proven across every public and admin capability                                                                | [`website-platform-cross-tenant-isolation.integration.test.ts`](../../tests/integration/website-platform-cross-tenant-isolation.integration.test.ts) (new) + `db-role-separation`, `public-tenant-resolution`, `tenant-domain-*` | covered (new + existing)              |
| SEO metadata/JSON-LD/sitemaps/feeds/robots/redirects/cache invalidation validate end-to-end                                                   | new SEO/discovery suite + `seo-distribution-*`, `seo-redirect-*`                                                                                                                                                                 | covered (new + existing)              |
| Search indexes only published tenant/locale content; rebuild/reconcile idempotent                                                             | new SEO/discovery suite (search section) + `site-search*`                                                                                                                                                                        | covered (new + existing)              |
| Themes cannot execute arbitrary code, weaken CSP, or leak preview/public caches                                                               | new public-security suite (CSP) + `theming-preview.e2e` + theming domain unit tests                                                                                                                                              | covered (new + existing)              |
| Comments resist stored XSS/spam/IDOR; enforce moderation/privacy/lifecycle                                                                    | new cross-tenant suite (comments IDOR) + `comments.integration`                                                                                                                                                                  | covered (new + existing)              |
| Newsletter consent/double-opt-in/generic responses/unsubscribe/suppression/reconciliation                                                     | new public-security suite (anti-enumeration) + `newsletter.integration`                                                                                                                                                          | covered (new + existing)              |
| Accessibility meets WCAG 2.2 target for critical journeys                                                                                     | [`admin-a11y-smoke.e2e.ts`](../../tests/e2e/admin-a11y-smoke.e2e.ts) (axe-core); **public-journey axe EN/ID desktop/mobile**                                                                                                     | partial → [§Deferred](#deferred-work) |
| Core Web Vitals + server/query budgets pass for representative volume                                                                         | `performance:query-plan:check`, `*-query-plan.integration`; **LCP/INP/CLS + load/soak on real volume**                                                                                                                           | partial → [§Deferred](#deferred-work) |
| Provider/storage/worker/DB failure scenarios degrade safely with alerts/runbooks                                                              | [`dr-drill.integration.test.ts`](../../tests/integration/dr-drill.integration.test.ts), `resilience-dr-verification.md`; **live chaos drills**                                                                                   | partial → [§Deferred](#deferred-work) |
| Docker/Coolify deployment, backup/restore, and one base upgrade rehearsal succeed                                                             | `docker-compose.yml`, `Dockerfile.production`, `deploy-coolify.md`, [`backup-restore-drill.integration.test.ts`](../../tests/integration/backup-restore-drill.integration.test.ts); **live deploy + upgrade rehearsal**          | partial → [§Deferred](#deferred-work) |
| `bun run check`, PG integration, security/adversarial, browser E2E, a11y, SEO/schema, link, perf/load/soak, build, readiness, preflight green | CI runs `check` + integration + E2E; **link-check + load/soak**                                                                                                                                                                  | partial → [§Deferred](#deferred-work) |
| Evidence report, residual risks, limitations, and user/admin/operator/security/deployment docs complete                                       | this document                                                                                                                                                                                                                    | covered (this PR)                     |

## New suites added in this PR

Three integrated, cross-feature integration suites close the "proven together"
gap that per-module tests structurally cannot (each per-module suite only sees
its own module):

1. **`website-platform-cross-tenant-isolation.integration.test.ts`** — seeds two
   tenants + a second locale and proves, through the real handlers, that tenant
   B's data never leaks into tenant A responses across public SSR/API/search/
   redirect/feed/comments/newsletter surfaces, plus an admin/API RLS-FORCE
   cross-tenant negative.
2. **`website-platform-public-security.integration.test.ts`** — asserts the
   security headers/CSP actually set by `src/middleware.ts` +
   `src/lib/security/security-headers.ts` on public routes, open-redirect
   rejection, host-header poisoning resistance, anti-enumeration generic bodies
   (correlationId-normalized), and safe oversized/malformed-input handling.
3. **`website-platform-seo-discovery-validation.integration.test.ts`** —
   validates sitemap index/child + RSS/Atom/JSON-feed well-formedness and
   published-only membership, robots directives, canonical/hreflang/social/
   JSON-LD head output, ETag/304 conditional requests, and that site search
   returns published tenant/locale content with idempotent rebuild.

## Deferred work

The following #273 criteria require the **external derived-site pilot** or **real
infrastructure** and cannot be honestly proven inside this base repository in an
automated pass. Each is tracked as a separate atomic issue so #273's remaining
surface is explicit rather than silently claimed:

- **Derived-site pilot execution & base-upgrade rehearsal** — provision the
  `ahliweb/awpos` pilot tenant/domain, compose a derived content-type + trusted
  theme, run the full public+admin journey, and rehearse one AWCMS-Micro base
  upgrade with no data loss or contract drift. (split issue: _to be created_)
- **Deployment rehearsal** — Docker dev + `Dockerfile.production` + Coolify,
  internal PostgreSQL network, durable object-storage config, secrets handling,
  and Cloudflare/CDN/WAF guidance, executed end-to-end. (split issue: _to be created_)
- **Backup/restore + DR with measured RTO/RPO** — PostgreSQL and object-storage
  backup/restore evidence with measured recovery objectives on a real target,
  plus live provider-outage/worker-restart/DB-saturation/stale-projection/
  object-storage-failure/cache-invalidation drills. (split issue: _to be created_)
- **Performance/CWV budgets on representative volume** — LCP/INP/CLS field-style
  budgets, SSR/search/feed/image budgets, and load/soak runs at representative
  content/media volume. (split issue: _to be created_)
- **Full-journey accessibility & link checking** — axe-core across public EN/ID
  desktop/mobile keyboard/screen-reader journeys and automated link checking on
  the rendered pilot site. (split issue: _to be created_)

## Residual risks and limitations

- **In-sandbox verification is partial.** The integration/E2E suites here are
  authored against the real handlers but are executed by **CI**, not locally,
  because this environment cannot reach the containerized PostgreSQL
  (host→container publishing is blocked). Treat CI green — not a local
  `bun run check` — as the proof for the integration rows above.
- **CWV/RTO/RPO are unmeasured in-repo.** Query/plan budgets and DR _shape_ are
  covered; the _measured_ numbers on production-like infrastructure are deferred.
- **Pilot lives in a separate repository.** Per the epic's non-negotiable
  boundaries, derived business logic must not move into this base; the pilot and
  its upgrade rehearsal are proven in `ahliweb/awpos`, referenced here only.
- **Generic foundation gaps found during the pilot must become their own atomic
  base issues** — they must not be silently backported as derived logic.
