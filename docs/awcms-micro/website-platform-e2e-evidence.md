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

# Query/plan performance budgets + production preflight. PREFLIGHT_TEST_DATABASE_URL
# must be a DISPOSABLE database: preflight's `test` stage runs the integration
# suite, which TRUNCATEs every awcms_micro_* table, so the deployment target's
# own DATABASE_URL is never forwarded to it (omit it and `test` runs unit-only
# and reports SKIP, which blocks go-live under APP_ENV=production):
bun run performance:query-plan:check
PREFLIGHT_TEST_DATABASE_URL=<disposable-db-url> bun run production:preflight
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
  container). **SEO-discovery config gap — RESOLVED (re-verified live
  2026-07-25)**: the earlier finding (apex host served only the generic
  fallback `robots.txt`; `/sitemap.xml` + feeds `404`) no longer reproduces.
  Tenant-by-host resolution now maps `awcms-micro.ahlikoding.com`:
  `robots.txt` is tenant-specific and advertises
  `Sitemap: https://awcms-micro.ahlikoding.com/sitemap.xml`; `/sitemap.xml`
  returns `200` with a `<sitemapindex>` pointing at `/sitemap-1.xml`; and
  `/feed.xml`, `/atom.xml`, `/feed.json` all return `200` resolved to the
  tenant ("Default Tenant"). The child `<urlset>` is empty only because the
  prod tenant has no published content yet — a content state, not a routing
  fault. **Durable-media round-trip — PROVEN (measured live 2026-07-25)**: an
  object was written to the R2 media bucket through the app's own
  `Bun.S3Client` configuration (the same client
  `media-r2-client.ts` builds), fetched over the tenant's public media domain
  `https://awcms-micro-r2.ahlikoding.com` (**HTTP/2 200**, `server: cloudflare`,
  stable `etag`), then the **application container was restarted**
  (`docker restart`, app back to `healthy`) and the object **re-fetched
  successfully — byte-identical, HTTP 200**. The container additionally has **no
  local media directory at all** (`/app/public/uploads`, `/app/uploads`,
  `/app/media` all absent), so managed media cannot be sitting on ephemeral
  container FS. The probe object was deleted afterwards (verified
  `exists=false`). **The authenticated app-level leg is now ALSO proven
  (2026-07-25)** — the gap this entry previously recorded is closed. Driven end
  to end against the live tenant through the real API, as an authenticated
  admin:

  1. `POST /api/v1/auth/login` (with `x-awcms-micro-tenant-id`) → session +
     tenant cookies;
  2. `POST /api/v1/media/news-images/upload-sessions` → `pending_upload` row
     plus a server-generated, **tenant-scoped** object key
     (`news-media/<tenantId>/2026/07/<uuid>.png`) and a short-lived presigned
     `PUT`;
  3. the presigned `PUT` itself → **HTTP 200**;
  4. `POST …/upload-sessions/{id}/finalize` with an `Idempotency-Key` →
     **HTTP 200, `status=verified`**, i.e. the server's own R2 `GET` +
     magic-byte MIME sniff + SHA-256 all passed.

  The finalize response's server-computed checksum
  (`ebf4f635…22ee9d2a`) is **byte-identical to the local file's `sha256sum`**,
  and the object is then served from the tenant's public media domain
  (`HTTP/2 200`, `content-type: image/png`, `content-length: 67`,
  `server: cloudflare`). So the media path is proven from the authenticated API
  call through to public delivery, not merely at the storage layer. The asset
  was then re-fetched **after a full Coolify rebuild + container replacement**
  (image `78910fe6` → `1c539bf1`) and came back **byte-identical**, which is a
  strictly stronger durability proof than the earlier restart-only check. The
  probe asset was removed afterwards (see §Residual risks for the R2-orphan
  caveat that removal surfaced). Two guardrails were observed working in
  passing: Astro's CSRF check rejected a `DELETE` that looked like a
  cross-site form submission, and `purge` refused with `INVALID_MEDIA_STATUS`
  until the object had actually been soft-deleted first.
  **`production:preflight` GREEN ON THE TARGET (2026-07-25) — `GO-LIVE
DIIZINKAN`, 10 of 10 stages PASS.** Run from a throwaway `oven/bun:1.3.14`
  container on the deployment host at merged `main`, with the target's own
  environment, `APP_ENV=production`, `APP_URL` pointed at the app container's
  internal address, and a **disposable** `postgres:18.4` for
  `PREFLIGHT_TEST_DATABASE_URL`. The target database was only ever **read**:

  | Stage                   | Result                                              |
  | ----------------------- | --------------------------------------------------- |
  | `config:validate`       | PASS                                                |
  | `security:readiness`    | **PASS** (was FAIL — fixed, see §Residual risks)    |
  | `database:capacity`     | PASS                                                |
  | `db:connectivity`       | PASS                                                |
  | `api:spec:check`        | PASS                                                |
  | `modules:compose:check` | PASS                                                |
  | `test`                  | **PASS** (4719 tests, ≈936 s — see §Residual risks) |
  | `build`                 | PASS                                                |
  | `db:pool:health`        | **PASS** (`status="healthy"`)                       |
  | `migration:plan`        | PASS — **0 pending, 80 already applied**            |

  Machine-readable report: `go: true`, `failedStages: []`, `blockingSkips: []`.
  `migration:plan` reporting **0 pending** is itself useful evidence: the live
  schema is exactly in step with `main`. Reaching this verdict took **three
  product fixes**, each invisible from inside CI and each found only by pointing
  the gate at a real deployment — see §Residual risks. The three _environment_
  gotchas that additionally made earlier attempts fail for non-product reasons
  (allow-listed host name for the disposable DB, an `APP_URL` reachable from the
  deployment host, `db:migrate` first) are written up in the
  [completion runbook §A](website-platform-completion-runbook.md).
  STILL PENDING for full sign-off: only the app-level media upload leg above.
  Operator steps:
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
  this + must not use the 57 G root disk). **Offsite (layer 2) — DONE (verified
  live 2026-07-24)**: the nightly script now also client-side **encrypts** each
  dump (`openssl aes-256-cbc/pbkdf2`, passphrase chmod 600 on prod, never in the
  bucket) and pushes it to the private Cloudflare R2 bucket `awcms-micro-backups`
  under `nightly/*.sql.gz.enc` (throwaway `rclone` container; 30-day offsite
  retention scoped to `nightly/` only — the bucket's unrelated historical
  `backups/db/*.enc` is untouched). Restore-proven end-to-end (R2 → decrypt →
  `gunzip -t` = valid PG dump); see
  [`resilience-dr-verification.md`](resilience-dr-verification.md) §RTO/RPO. STILL
  DEFERRED: the object-storage (R2) **restore** drill and the live chaos drills
  (the _shapes_ are covered by
  `dr-drill.integration.test.ts`/`backup-restore-drill.integration.test.ts`).
- **Performance/CWV budgets on representative volume** — LCP/INP/CLS field-style
  budgets, SSR/search/feed/image budgets, and load/soak runs at representative
  content/media volume. (split issue: **#295**) **Lab CWV gate LANDED**:
  `public-web-vitals.e2e.ts` measures **LCP + CLS + INP** in real Chromium on
  the hermetic public pages (`/`, `/newsletter/demo`) against the Google "good"
  thresholds (LCP ≤ 2500 ms, CLS ≤ 0.1, INP ≤ 200 ms) — a regression gate.
  **INP LANDED**: the spec now DRIVES the interactions it measures (three
  `Tab` presses + a click on the first heading — non-navigating, non-
  submitting) and reads the worst `event`-timing entry carrying an
  `interactionId`. Because the Event Timing spec clamps `durationThreshold` to
  a minimum of 16 ms, a sub-16 ms interaction produces no entry at all; the
  spec therefore also counts dispatched `pointerdown`/`keydown` events with a
  plain listener (no such floor) and asserts that count is `> 0`, so an
  `inp: 0` reading can never be confused with "no interaction ever reached the
  page". Measured on the dev server 2026-07-25: `/` → LCP 44 ms, CLS 0,
  **INP 24 ms**, 4 interactions; `/newsletter/demo` → LCP 48 ms, CLS 0,
  **INP 24 ms**, 4 interactions. **Also measured over the real network/CDN
  against the deployed instance** `https://awcms-micro.ahlikoding.com`
  (2026-07-25, through Cloudflare), with the gate run unmodified against the
  live edge: `/` → LCP **652 ms**, CLS **0**, INP **0**, 4 interactions;
  `/newsletter/demo` → LCP **140 ms**, CLS **0**, INP **40 ms**, 4
  interactions — all comfortably inside budget. The `/` reading is exactly the
  case the two-counter design exists for: `inp: 0` alongside `interactions: 4`
  proves every interaction finished under Event Timing's 16 ms floor, rather
  than that nothing ever reached the page. STILL DEFERRED: **load/soak at
  representative content/media volume** — the live tenant has no published
  content yet, so these numbers characterise the site shell, not a
  content-heavy site.
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
  (`/news`, `/blog` article pages)". **Executed against the DEPLOYED INSTANCE
  (2026-07-25)**: `public-a11y-smoke.e2e.ts` + `public-link-crawl.e2e.ts` were
  run unmodified with `E2E_BASE_URL=https://awcms-micro.ahlikoding.com` —
  **11/11 passed** (axe EN + ID × desktop + mobile over the live homepage,
  `/newsletter/demo` and `/comments/demo`; live rendered-link crawl green). Both
  specs are pure Playwright with no database import, so this was read-only
  traffic against production. This closes the "deployed-instance journey" half
  of the criterion for the surfaces the live tenant currently renders. STILL
  DEFERRED: the **screen-reader** pass (manual), the deployed-instance
  **content-template** journey (the live tenant has no published content yet,
  so `/news`/`/blog` render nothing there — covered hermetically by
  `public-content-a11y.e2e.ts`), and a rendered-content link crawl at
  representative content volume (the seeded content graph is covered at handler
  level by `public-link-integrity.integration.test.ts`).

## Residual risks and limitations

- **`production:preflight` used to be unsafe to run against its own target
  (found + FIXED 2026-07-25, while executing #293's "preflight green on
  target" step).** Every preflight stage is documented as read-only, but the
  `test` stage spawned `bun test` with the ambient environment inherited — so
  the documented invocation
  `APP_ENV=production DATABASE_URL=<target> bun run production:preflight`
  handed the target's DSN to the integration suite. That suite (113 files)
  calls `resetDatabase()` — `TRUNCATE` over every `awcms_micro_*` table — and
  `provisionAppRole()`/`provisionWorkerRole()`/`provisionSetupRole()`, which
  `ALTER ROLE ... WITH LOGIN PASSWORD '<fixture literal committed in this
repo>'`. Following the runbook would therefore have **wiped the deployment
  target and activated three least-privilege login roles on it with
  publicly-known passwords**, from a script whose contract is "non-destructive
  by default". Fixed by `planTestStage` in
  [`scripts/production-preflight.ts`](../../scripts/production-preflight.ts):
  the target's `DATABASE_URL` is never forwarded to `bun test`; the operator
  opts into real integration coverage via a **disposable**
  `PREFLIGHT_TEST_DATABASE_URL` (a DSN identical to the target is refused);
  absent that, the stage runs unit-only and reports **SKIP**, which is a
  blocking skip under `APP_ENV=production` rather than a green it did not
  earn. This is why no "preflight green on target" evidence exists for #293
  prior to this date — the step could not be executed safely.
- **`security:readiness` could never go green either (found + FIXED
  2026-07-25, same #293 step).** With the preflight now safe to run, the first
  real execution against the live target surfaced a second structural blocker:
  the `No hardcoded secret` check — severity **critical**, so a go-live
  blocker — reported **11 findings, 10 of them false**. The heuristic flags any
  line whose variable name contains `password`/`secret`/`api_key`/`token` and
  whose value is a quoted literal, which caught four TypeScript **string-literal
  union type aliases** (`PasswordResetDenyReason`, `NewsletterTokenPurpose`,
  `ThemeTokenKind`, `secretSource`), two **doc comments** that _describe_
  credential shapes (`redaction.ts`, `preview-token.ts`), two **interpolated
  template literals** computed at runtime (`appAccessToken`, `tokenCssHref`),
  Google's **published OIDC endpoint URL**, and a circuit-breaker registry key.
  Because these are permanent properties of the source, `production:preflight`
  was structurally incapable of reporting `GO-LIVE DIIZINKAN` on **any** target.
  Fixed in `scripts/security-readiness.ts` by four **structural** exclusions
  (comment lines, type-only declarations, interpolated templates, URL values) —
  shapes that cannot hold a secret — plus a small, explicitly justified
  `SECRET_SCAN_ACKNOWLEDGED` list so remaining cases stay visible in review
  rather than dissolving into a regex. The scan now passes cleanly over 910
  tracked files.
- **The 11th finding was REAL, and is a live production gap (#293).**
  `COMMENTS_TIMING_SECRET` is **unset on the deployment target**, so
  `src/modules/comments/domain/timing-token.ts` signs public comment
  submit-timing tokens with `DEV_FALLBACK_SECRET` — a fixed literal committed
  in this repository. Anyone can therefore mint a valid timing token and walk
  past the submit-timing floor in `anti-abuse.ts`. Severity is **warning, not
  critical**: the token gates a soft anti-abuse heuristic and never
  authorization, so the cost is one spam signal, not access. Surfaced by a new
  dedicated check (`checkCommentsTimingSecretConfigured`) that measures the
  per-deployment condition — "is a real key configured on THIS target?" —
  instead of flagging a literal whose presence is intentional and permanent.
  **RESOLVED on the target 2026-07-25**: a 64-character base64url value was
  generated on the deployment host (`openssl rand -base64 48`, never leaving
  the box), stored as a Coolify application env var, and applied by a redeploy;
  the running container now reports it set (length 64), so
  `checkCommentsTimingSecretConfigured` passes.
- **Purging managed media does NOT remove the R2 object, and no reconcile job
  is scheduled on the target (found 2026-07-25).** This is not a code defect —
  `purgeNewsMediaObject` deliberately hard-deletes only the metadata row,
  because ADR-0006 forbids provider calls inside a DB transaction, and
  `media-reconciliation-categorization.ts` documents the resulting
  `orphanInR2` category as "a known, accepted gap this job [cleans up]" after
  `NEWS_MEDIA_R2_ORPHAN_GRACE_DAYS`. The gap is **operational**: the deployment
  target runs exactly two cron entries (the nightly backup and the weekly
  restore drill) and **no media-reconciliation schedule at all**, so the sweep
  that the design relies on never executes. Purged media therefore stays
  readable at its public URL indefinitely, even though its metadata row is
  gone — verified live: after `DELETE` + `purge` both returned `200`, the
  object still served `HTTP/2 200` with `cf-cache-status: DYNAMIC` (so not a
  CDN artifact). The probe object was removed by hand.
  **RESOLVED on the target 2026-07-25**: a daily reconcile job is now scheduled
  (`45 3 * * * /home/admin1/jobs/awcms-micro-media-reconcile.sh`, after the
  02:30 backup), verified running for real (`tenants=1`, not skipped). Two
  things had to be fixed along the way, both now written up in
  [`deploy-coolify.md`](deploy-coolify.md) §Job terjadwal:
  - **The documented scheduling pattern could never have worked.** Both
    `deploy-coolify.md` and `deployment-profiles.md` prescribed
    `docker exec <container-app> bun run <job>`, but the `Dockerfile.production`
    image ships `dist/` + `package.json` + `node_modules` and **no `scripts/`**
    — the same constraint the docs already recorded for migrations, never
    carried over to jobs. Verified on the running container:
    `docker exec <app> bun run email:dispatch` →
    `Module not found "scripts/email-dispatch.ts"`. This affected **every**
    scheduled job (`email:dispatch`, `sync:objects:dispatch`,
    `logs:audit:purge`, `form-drafts:purge`, `news-media:reconcile`), so any
    cron built from those docs would have failed on every run — silently, if it
    did not check exit codes. Jobs now run from a persistent source checkout via
    a throwaway `oven/bun` container.
  - **A silent-skip trap in the env plumbing.** Filtering the app's environment
    with `grep -E "^(DATABASE_URL|NEWS_MEDIA_R2_|APP_ENV)="` requires `=`
    immediately after `NEWS_MEDIA_R2_`, so it drops **every** `NEWS_MEDIA_R2_*`
    variable. The job then reports `skipped — NEWS_MEDIA_R2_ENABLED is not
"true"` and **exits 0**: a nightly cron that looks green while sweeping
    nothing — precisely the failure mode that let this gap go unnoticed in the
    first place. The installed script uses
    `"^(DATABASE_URL|APP_ENV|LOG_LEVEL)=|^NEWS_MEDIA_R2_"` and now treats a
    `skipped` result as **FAIL**.
- **One integration file hard-failed when the PostgreSQL client was absent
  (found + FIXED 2026-07-25, same #293 step).** With the first two blockers
  cleared, the `test` stage reported **4718 pass / 1 fail** on the target, and
  the single failure was `Executable not found in $PATH: "psql"`.
  `backup-restore-drill.integration.test.ts` probes `psql`/`pg_dump` at
  module-load time and is explicitly designed to **skip** when the client is
  unusable ("this is an environment constraint, not a code defect") — but
  `Bun.spawnSync` **throws** `ENOENT` when the binary is absent entirely rather
  than returning a failed result, so version _mismatch_ was handled while
  version _absence_ escaped as an unhandled error and took the whole file down.
  That is precisely the environment a preflight runs in: a minimal runtime
  container with Bun and no PostgreSQL client binaries. Fixed by routing both
  probes through a non-throwing helper — restoring parity with the runtime
  counterpart (`src/lib/resilience/scenarios/backup-restore-drill.ts`), which
  already guarded the identical call with its own `trySpawnSync`. Verified with
  a `PATH` stripped of the pg binaries: **1 fail + 1 error → 8 skip / 0 fail**.
- **All three preflight blockers above were invisible from inside CI.** CI runs
  the suite against a purpose-built Postgres service, on `localhost`, with the
  client binaries installed, and never sets `APP_ENV=production` — so none of
  the three could surface there. They are recorded together because the pattern
  matters more than any one bug: a go-live gate that has only ever been run in
  CI has not been shown to work on a deployment target, and this one turned out
  to be unrunnable, unsatisfiable, and then still red, in that order.
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
  to ≤24 h, **plus an encrypted offsite copy to Cloudflare R2**
  (`awcms-micro-backups/nightly/*.sql.gz.enc`, restore-proven) — see
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
