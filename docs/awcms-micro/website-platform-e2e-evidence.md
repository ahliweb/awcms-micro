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
versus which are deferred to a **website / online-store pilot** or to **real
infrastructure drills** (deployment, measured RTO/RPO, Core Web Vitals on
representative volume, base-upgrade rehearsal). Those deferred parts are tracked
as separate atomic issues (see [§Deferred work](#deferred-work)); #273 remains
open until they land.

> **Positioning ([ADR-0034](../adr/0034-template-repositioning-online-store-scope-and-derived-app-deprecation.md)).** AWCMS-Micro is a **template full-online website used directly** (spectrum reaches an **online store / e-commerce**; **not in-store POS** — that is the ERP `awcms` lineage). The pilot is a generic **website / online store**, NOT `ahliweb/awpos` (a POS app, whose relation here is only historical: it was the standards source). The derived-application pathway (separate downstream app via `application-registry.ts` + compatibility manifest + `extension:check`) is **removed** ([ADR-0036](../adr/0036-remove-derived-application-pathway-align-family.md), men-supersede ADR-0034/0035) — the template is used directly.

> **Scope boundary.** No ERP/POS/vertical back-office logic is added to the base by
> this evidence work.

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

# Module-registry composition validation (base registry; ADR-0036 removed the
# derived-application `extension:check` gate):
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

| Epic DoD criterion                                                                                                                                                           | In-repo evidence                                                                                                                                                                                                                                                                                                                  | Status                                |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Every child issue completed or explicitly closed                                                                                                                             | #262–#272 merged; #273 tracked here                                                                                                                                                                                                                                                                                               | in progress                           |
| README/ADR/architecture/ERD/SOP/threat-model/governance/inventory describe full-online WEBSITE scope without ERP/offline drift                                               | `scope:consistency:check`, `config:docs:check`, ADR-0025/0027                                                                                                                                                                                                                                                                     | covered (existing)                    |
| Media-library implementation/presets/capabilities/readiness/docs consistent                                                                                                  | `media-library:consistency:check`, [`media-library-tenant-state.integration.test.ts`](../../tests/integration/media-library-tenant-state.integration.test.ts)                                                                                                                                                                     | covered (existing)                    |
| Canonical/hreflang/social/JSON-LD/sitemaps/feeds/robots/redirects for a tenant                                                                                               | [`website-platform-seo-discovery-validation.integration.test.ts`](../../tests/integration/website-platform-seo-discovery-validation.integration.test.ts) (new) + `seo-distribution-rendering`, `seo-discovery`, `seo-redirect-*`                                                                                                  | covered (new + existing)              |
| Reviewed theme/template without arbitrary code / CSP / a11y breakage                                                                                                         | [`theming-preview.e2e.ts`](../../tests/e2e/theming-preview.e2e.ts) (CSP verified browser-side), `css-value-validation` unit tests (reject-not-sanitize), non-CSP security headers in [`website-platform-public-security.integration.test.ts`](../../tests/integration/website-platform-public-security.integration.test.ts) (new) | covered (new + existing)              |
| Public search tenant/locale/publish-state safe, bounded, rebuildable, reconcilable                                                                                           | new SEO/discovery suite (search section) + `site-search*`                                                                                                                                                                                                                                                                         | covered (new + existing)              |
| Comments moderation/abuse/privacy/retention/deletion/notifications                                                                                                           | [`comments.integration.test.ts`](../../tests/integration/comments.integration.test.ts), `comments-smoke.e2e.ts`                                                                                                                                                                                                                   | covered (existing)                    |
| Newsletter consent/double-opt-in/unsubscribe/suppression/provider-neutral/reconciliation/privacy                                                                             | [`newsletter.integration.test.ts`](../../tests/integration/newsletter.integration.test.ts), `newsletter-smoke.e2e.ts`                                                                                                                                                                                                             | covered (existing)                    |
| Production media/object-storage + deployment profiles explicit/durable/recoverable/preflight-validated                                                                       | `deployment-profiles.md`, `storage-profile.ts`, `production:preflight`; **measured RTO/RPO on real infra**                                                                                                                                                                                                                        | partial → [§Deferred](#deferred-work) |
| Browser E2E, a11y, SEO/schema/feed, link, security/adversarial, perf/CWV budgets, build, `check`, readiness, backup/restore, preflight pass                                  | this matrix; **CWV + load/soak + link-check on real volume**                                                                                                                                                                                                                                                                      | partial → [§Deferred](#deferred-work) |
| Jalur aplikasi-turunan DIHAPUS ([ADR-0036](../adr/0036-remove-derived-application-pathway-align-family.md)) — template dipakai-langsung; komposisi memvalidasi registry base | fixture test-support [`example-domain-modules`](../../tests/fixtures/example-domain-modules) (`module-composition-fixture.test.ts`); seam turunan + `extension:check` tidak lagi ada                                                                                                                                              | superseded (ADR-0036)                 |
| Residual risks/limitations/ownership/follow-up documented                                                                                                                    | this document, [§Residual risks](#residual-risks-and-limitations)                                                                                                                                                                                                                                                                 | covered (this PR)                     |

## Issue #273 — acceptance-criteria coverage

| #273 acceptance criterion                                                                                                                     | In-repo evidence                                                                                                                                                                                                                                                                                                                                                                                                                                             | Status                                                                                   |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| Derived content + theme compose without editing base registry; pass compatibility checks                                                      | `modules:compose:check` + test-support fixture [`example-domain-modules`](../../tests/fixtures/example-domain-modules); derived seam + `extension:check` removed (ADR-0036)                                                                                                                                                                                                                                                                                  | superseded (ADR-0036)                                                                    |
| Tenant/domain/locale isolation proven across every public and admin capability                                                                | [`website-platform-cross-tenant-isolation.integration.test.ts`](../../tests/integration/website-platform-cross-tenant-isolation.integration.test.ts) (new) + `db-role-separation`, `public-tenant-resolution`, `tenant-domain-*`                                                                                                                                                                                                                             | covered (new + existing)                                                                 |
| SEO metadata/JSON-LD/sitemaps/feeds/robots/redirects/cache invalidation validate end-to-end                                                   | new SEO/discovery suite + `seo-distribution-*`, `seo-redirect-*`                                                                                                                                                                                                                                                                                                                                                                                             | covered (new + existing)                                                                 |
| Search indexes only published tenant/locale content; rebuild/reconcile idempotent                                                             | new SEO/discovery suite (search section) + `site-search*`                                                                                                                                                                                                                                                                                                                                                                                                    | covered (new + existing)                                                                 |
| Themes cannot execute arbitrary code, weaken CSP, or leak preview/public caches                                                               | `theming-preview.e2e` (CSP, browser) + theming domain unit tests + new public-security suite (non-CSP headers)                                                                                                                                                                                                                                                                                                                                               | covered (new + existing)                                                                 |
| Comments resist stored XSS/spam/IDOR; enforce moderation/privacy/lifecycle                                                                    | new cross-tenant suite (comments IDOR) + `comments.integration`                                                                                                                                                                                                                                                                                                                                                                                              | covered (new + existing)                                                                 |
| Newsletter consent/double-opt-in/generic responses/unsubscribe/suppression/reconciliation                                                     | new public-security suite (anti-enumeration) + `newsletter.integration`                                                                                                                                                                                                                                                                                                                                                                                      | covered (new + existing)                                                                 |
| Accessibility meets WCAG 2.2 target for critical journeys                                                                                     | [`admin-a11y-smoke.e2e.ts`](../../tests/e2e/admin-a11y-smoke.e2e.ts) + [`public-a11y-smoke.e2e.ts`](../../tests/e2e/public-a11y-smoke.e2e.ts) (axe-core over public homepage + `/newsletter/demo` + `/comments/demo`, EN/ID) + [`public-content-a11y.e2e.ts`](../../tests/e2e/public-content-a11y.e2e.ts) (axe over the rendered `/news` + `/blog/{tenantCode}` article templates, EN/ID × desktop/mobile); **pilot-site full journey + screen-reader pass** | partial (admin + public homepage/demo + content templates) → [§Deferred](#deferred-work) |
| Core Web Vitals + server/query budgets pass for representative volume                                                                         | `performance:query-plan:check`, `*-query-plan.integration`; **LCP/INP/CLS + load/soak on real volume**                                                                                                                                                                                                                                                                                                                                                       | partial → [§Deferred](#deferred-work)                                                    |
| Provider/storage/worker/DB failure scenarios degrade safely with alerts/runbooks                                                              | [`dr-drill.integration.test.ts`](../../tests/integration/dr-drill.integration.test.ts), `resilience-dr-verification.md`; **live chaos drills**                                                                                                                                                                                                                                                                                                               | partial → [§Deferred](#deferred-work)                                                    |
| Docker/Coolify deployment, backup/restore, and one base upgrade rehearsal succeed                                                             | `docker-compose.yml`, `Dockerfile.production`, `deploy-coolify.md`, [`backup-restore-drill.integration.test.ts`](../../tests/integration/backup-restore-drill.integration.test.ts); **live deploy + upgrade rehearsal**                                                                                                                                                                                                                                      | partial → [§Deferred](#deferred-work)                                                    |
| `bun run check`, PG integration, security/adversarial, browser E2E, a11y, SEO/schema, link, perf/load/soak, build, readiness, preflight green | CI runs `check` + integration + E2E; handler-level link-integrity now in CI ([`public-link-integrity.integration.test.ts`](../../tests/integration/public-link-integrity.integration.test.ts)); **full rendered-site crawl + load/soak**                                                                                                                                                                                                                     | partial → [§Deferred](#deferred-work)                                                    |
| Evidence report, residual risks, limitations, and user/admin/operator/security/deployment docs complete                                       | this document                                                                                                                                                                                                                                                                                                                                                                                                                                                | covered (this PR)                                                                        |

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
   non-CSP security headers from `buildSecurityHeaders`
   (`src/lib/security/security-headers.ts`) coexist cleanly on a real
   public-route response without clobbering the handler's own content-type (CSP
   is delegated to Astro's build/browser layer and is verified there, NOT here;
   `src/middleware.ts` imports the `astro:middleware` virtual module and is not
   in-process invokable under `bun test`), open-redirect rejection (fail-closed
   on an unowned host), host / `X-Forwarded-Host` poisoning resistance,
   anti-enumeration generic bodies (correlationId-normalized; body-identity
   only — header/timing oracles are an explicit residual, see below), and safe
   oversized/malformed-input handling.
3. **`website-platform-seo-discovery-validation.integration.test.ts`** —
   validates sitemap index/child + RSS/Atom/JSON-feed well-formedness and
   published-only membership, robots directives, canonical/hreflang/social/
   JSON-LD head output, ETag/304 conditional requests, and that site search
   returns published tenant/locale content with idempotent rebuild.

## Deferred work

The following #273 criteria require a **deployed template instance** or **real
infrastructure** and cannot be honestly proven inside this base repository in an
automated pass. Each is tracked as a separate atomic issue so #273's remaining
surface is explicit rather than silently claimed. **Operator procedure to execute
and close each of these — with exact commands and evidence to capture — is in the
[website-platform completion runbook](website-platform-completion-runbook.md).**

- **Website / online-store pilot execution & base-upgrade rehearsal** — stand up a
  generic bilingual **website (up to an online store)** directly from this template
  (per [ADR-0034](../adr/0034-template-repositioning-online-store-scope-and-derived-app-deprecation.md);
  NOT `ahliweb/awpos`/POS, NOT a separate derived app), provision tenant/domain +
  content + theme, run the full public+admin journey, and rehearse one base upgrade
  with no data loss or contract drift. (split issue: **#292**)
- **Deployment rehearsal** — Docker dev + `Dockerfile.production` + Coolify,
  internal PostgreSQL network, durable object-storage config, secrets handling,
  and Cloudflare/CDN/WAF guidance, executed end-to-end. (split issue: **#293**)
  **Partial real-infra evidence LANDED** (dinkes-prod, `awcms-micro.ahlikoding.com`,
  2026-07-22/23 — see [`deploy-coolify.md`](deploy-coolify.md)): the production
  image **builds and boots** on Coolify (build-from-GitHub, commit-SHA-tagged,
  container reports healthy) against an **internal Coolify-network PostgreSQL**
  (managed PG 18.4, pinned container IP); migrations were applied via a
  privileged one-shot with `DATABASE_URL` kept **server-side only** (the secret
  never left the box); durable **R2 object storage** is configured (bucket +
  custom domain); and the **live edge** is reachable (health `200`, TLS via
  Cloudflare). **Live-edge security verified 2026-07-24** (`curl -D` against
  `https://awcms-micro.ahlikoding.com/`): TLS = Let's Encrypt (valid → Oct 21
  2026), HTTP/2, **HSTS** `max-age=31536000; includeSubDomains`, strict **CSP**
  (`default-src 'self'`, `object-src 'none'`, `base-uri 'none'`,
  `frame-ancestors 'none'`, `script-src` hash-pinned — no `unsafe-inline`),
  **X-Frame-Options: DENY**, **X-Content-Type-Options: nosniff**,
  **Referrer-Policy** `strict-origin-when-cross-origin`, **Permissions-Policy**
  locked (geolocation/camera/microphone/payment `=()`); health/error bodies
  carry no secrets/stack. Durable **R2** confirmed configured
  (`NEWS_MEDIA_R2_ENABLED`/`_BUCKET`/`_PUBLIC_BASE_URL` all set on the running
  container). STILL PENDING for full sign-off: `production:preflight` green
  **on the target**, a **durable-storage round-trip** proven for managed media
  (upload → served-from-R2, not ephemeral container FS). **Config gap found**:
  the apex host serves only the generic fallback `robots.txt` and
  `/sitemap.xml`+feeds return `404` — tenant-by-host resolution
  (`PUBLIC_TENANT_RESOLUTION_MODE=host_default` + a verified primary domain for
  the tenant) is not mapped for `awcms-micro.ahlikoding.com`, so the SEO
  discovery surfaces are not live. Operator steps:
  [website-platform completion runbook](website-platform-completion-runbook.md).
- **Backup/restore + DR with measured RTO/RPO** — PostgreSQL and object-storage
  backup/restore evidence with measured recovery objectives on a real target,
  plus live provider-outage/worker-restart/DB-saturation/stale-projection/
  object-storage-failure/cache-invalidation drills. (split issue: **#294**)
  **Measured restore drill LANDED 2026-07-24** (the
  `deploy/backup/restore-drill.sh` shape — backup → restore into a disposable
  target → verify — run against the live dinkes-prod PG, restored into an
  ISOLATED throwaway container on the coolify network, then discarded):
  `pg_dump -Fc` **backup
  ≈1.7 s / 708 KB**; **restore ≈6.3 s**; restored row counts (1 tenant / 0
  modules / 80 migrations) **exactly match prod** — data-faithful, so **RPO = 0
  at the dump instant**. Restore-cleanliness finding: a vanilla target emits
  ~145 non-fatal owner/GRANT/policy errors for roles it lacks — restore with
  `--no-owner --no-privileges` or pre-create the app roles. **Scheduled backup —
  RESOLVED (verified live 2026-07-24)**: the original drill found Coolify had
  **0 scheduled backups** (RPO unbounded); a **nightly host cron is now installed
  and verified** — admin1 `30 2 * * * /home/admin1/backups/awcms-micro-backup.sh`
  (daily `pg_dump | gzip` → sdb1 `/var/lib/docker/awcms-micro-db-backups`,
  DB resolved by resource uuid so it survives redeploys, `gzip -t` + `>1000` byte
  integrity gate, **14-day retention**; 3 valid dumps present). **RPO now bounded
  to ≤24 h.** A Coolify-native backup was deliberately NOT added (would duplicate
  this + must not use the 57 G root disk). STILL DEFERRED: an **offsite** copy
  (layer 2 — needs a private R2 bucket), the object-storage (R2) restore drill,
  and the live chaos drills (the _shapes_ are covered by
  `dr-drill.integration.test.ts`/`backup-restore-drill.integration.test.ts`).
- **Performance/CWV budgets on representative volume** — LCP/INP/CLS field-style
  budgets, SSR/search/feed/image budgets, and load/soak runs at representative
  content/media volume. (split issue: **#295**) **Lab CWV gate LANDED**:
  `public-web-vitals.e2e.ts` measures **LCP + CLS** in real Chromium on the
  hermetic public pages (`/`, `/newsletter/demo`) against the Google "good"
  thresholds (LCP ≤ 2500 ms, CLS ≤ 0.1) — a regression gate. STILL DEFERRED:
  **INP** (interaction-driven), and **field-style LCP/INP/CLS + load/soak at
  representative content/media volume** with real network/CDN.
- **Full-journey accessibility & link checking** (**#296**) — the base-app
  in-repo portion has LANDED: `public-a11y-smoke.e2e.ts` (axe-core over public
  `/`, `/newsletter/demo`, `/comments/demo` in EN + ID, at **desktop 1280×800
  AND mobile 390×844** viewports — the device matrix catches viewport-dependent
  WCAG 2.2 rules like `target-size` and reflow that a desktop-only pass misses)
  and `public-link-integrity.integration.test.ts` (sitemap URLs, canonical,
  hreflang, robots `Sitemap:` all resolve; drafts stay out of the sitemap and
  404). **Rendered-site link crawl LANDED**: `public-link-crawl.e2e.ts` fetches
  each hermetic public entry page (`/`, `/login`, `/register`,
  `/forgot-password`, `/newsletter/demo`, `/comments/demo`), extracts every
  same-origin `<a href>` it actually renders, and asserts each resolves
  (HTTP < 400 after redirects) — the rendered-page complement to the
  handler-level sitemap/canonical/hreflang/robots graph above.
  **Content-template axe LANDED**: `public-content-a11y.e2e.ts` seeds a tenant
  with a published EN post and a published ID post (the same proven seed shape
  as `seo-discovery-smoke` — tenant + verified primary domain + setup_state
  singleton, holding the shared `setup-state-ownership` advisory lock) and runs
  axe-core (WCAG 2.2 AA, critical/serious) over BOTH the tenant-code-free
  `/news/{slug}` route AND the `/blog/{tenantCode}/{slug}` route, in **EN and
  ID** (the rendered `<html lang>` is the article's own `locale`) at **desktop
  AND mobile** — closing "axe over the rendered content-reading templates
  (`/news`, `/blog` article pages)". STILL DEFERRED: the **screen-reader** pass
  (manual), the derived-site full journey, and a rendered-content link crawl at
  representative content volume (the seeded content graph is covered at handler
  level by `public-link-integrity.integration.test.ts`).

## Residual risks and limitations

- **In-sandbox verification is partial.** The integration/E2E suites here are
  authored against the real handlers but are executed by **CI**, not locally,
  because this environment cannot reach the containerized PostgreSQL
  (host→container publishing is blocked). Treat CI green — not a local
  `bun run check` — as the proof for the integration rows above.
- **CWV/RTO/RPO — now partially MEASURED (2026-07-24).** Lab CWV (LCP/CLS) is a
  Chromium regression gate (`public-web-vitals.e2e.ts`); a measured PG
  backup/restore drill ran against live prod (backup ≈1.7 s, restore ≈6.3 s,
  data-faithful → RPO 0 at dump instant). STILL DEFERRED: field-style CWV +
  load/soak at representative volume, and object-storage DR. **Operational gap
  now RESOLVED (verified live 2026-07-24)**: prod has a **nightly host cron
  backup** (`30 2 * * *`, sdb1, 14-day retention, integrity-gated) → RPO bounded
  to ≤24 h; only an offsite (R2) copy remains — see
  [`resilience-dr-verification.md`](resilience-dr-verification.md) §RTO/RPO.
- **Pilot is a website / online store, used directly from this template** (ADR-0034)
  — NOT `ahliweb/awpos` (POS, ERP lineage) and NOT a separate derived app. No ERP/POS
  back-office logic (cashier, warehouse, tax posting) is added to this base.
- **Foundation gaps found during the pilot must become their own atomic base issues**
  — website/online-store features are admitted into this template via ADR (ADR-0025 §6),
  not bolted on ad hoc.
- **Security-test scope is deliberately narrow.** (a) The security-header check
  applies `buildSecurityHeaders` onto a real route response and asserts
  coexistence — it does not run the middleware pipeline (not in-process
  invokable) nor prove edge emission; real header/CSP emission is browser/E2E
  work (see [§Deferred](#deferred-work) #296). (b) Anti-enumeration asserts
  **body** identity only — header-level and **timing** oracles (the moderated
  comment path does more DB work than the unresolved-resource path) are not
  ruled out here. (c) The open-redirect case proves fail-closed on an _unowned_
  host; an owned-external _positive_ redirect is exercised at the module level
  (`seo-redirect-resolution`), not re-proven in this integrated suite.
