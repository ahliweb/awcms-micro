# Website-platform completion runbook — closing #273 / #292–#296

> **Purpose.** Issues #292–#296 (split from #273, epic #261) are the last website-platform
> evidence items. Their acceptance criteria need a **live deployment target** (Docker/Coolify,
> durable object storage, a running rendered site, measured RTO/RPO, load/soak at volume) — work
> the repo/CI sandbox cannot execute. **Everything automatable already landed** (cross-feature
> suites #291; a11y + link-integrity smoke #298; DR/perf _shape_ via `resilience:dr-drill` /
> `performance:suite` / query-plan gates). This runbook is the **operator procedure** to run the
> remaining field/infra proofs on your own target and attach reproducible evidence, so each issue
> can be checked off and closed.
>
> **Positioning ([ADR-0034](../adr/0034-template-repositioning-online-store-scope-and-derived-app-deprecation.md)).**
> The "pilot" is a **deployed instance of this template used directly** (a generic website / online
> store) — **not** a separate derived repo and **not** `ahliweb/awpos`. The derived-application
> pathway is optional-legacy; do not build a separate downstream app to satisfy these.

## How to use

Each section = one issue. Run the commands against your targets, capture the named evidence
artifacts, tick the acceptance boxes, then paste the evidence links into the issue and close it.
Keep every artifact under a dated evidence folder (see [§Evidence conventions](#evidence-conventions)).

## Prerequisites (once)

| Need                                       | Detail                                                                                                                                                                                                                                    |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Staging target**                         | A non-production instance reachable over TLS. Everything is rehearsed here **first** (`APP_ENV=staging`).                                                                                                                                 |
| **Production target**                      | The real instance, only after staging is green (`APP_ENV=production`).                                                                                                                                                                    |
| **Version-matched `pg_dump`/`pg_restore`** | Same major as the server Postgres — the `backup-restore-drill` and preflight backup **skip (not fail)** without it. Verify: `pg_dump --version`.                                                                                          |
| **Durable object storage**                 | R2 (or S3-compatible) bucket + credentials for managed media — **not** ephemeral container FS. See [`deployment-profiles.md`](deployment-profiles.md) §News portal R2 and [`deploy-coolify.md`](deploy-coolify.md) §Environment variable. |
| **HTTP load tool**                         | `k6` (recommended) or `autocannon` — for #295 load/soak at the HTTP edge (the in-repo `performance:suite` proves server/query/soak budgets in-process; it does **not** drive the public HTTP edge or browser CWV).                        |
| **Browser CWV tool**                       | Lighthouse CI (`@lhci/cli`) or WebPageTest — for #295 LCP/INP/CLS on the rendered site (server-side perf-suite does not measure browser vitals — see `performance-suite.md` §Known limitations).                                          |
| **Link crawler**                           | `lychee` or `linkinator` — for #296 link checking on the **rendered** site (in-repo `public-link-integrity` checks internal SEO/feed links from the DB/build, not a live crawl).                                                          |
| **Secrets discipline**                     | Provide all secrets via env/secret store; confirm none land in repo/logs/audit/responses (`bun run security:readiness`, `bun run config:validate`).                                                                                       |

Baseline (must be green before starting): `bun run check`, and with a DB:
`DATABASE_URL=… bun run db:migrate && DATABASE_URL=… bun test tests/integration`.

---

## §A — #293 Deployment rehearsal (Docker / Coolify / object-storage / CDN)

Reference: [`deploy-coolify.md`](deploy-coolify.md), [`deployment-profiles.md`](deployment-profiles.md),
[`production-preflight-runbook.md`](production-preflight-runbook.md).

1. **Build the production image** and boot it locally to smoke it:
   ```bash
   docker build -f Dockerfile.production -t awcms-micro:rehearsal .
   docker run --rm -e APP_ENV=staging -e DATABASE_URL=<staging-url> -p 3000:3000 awcms-micro:rehearsal
   ```
   → capture `docker-build.log` + a boot log showing a clean start + `/health` 200.
2. **Deploy to Coolify** per `deploy-coolify.md` (Pola 1 build-from-repo _or_ Pola 2 pull-from-registry),
   with the internal PostgreSQL network and the durable object-storage env vars set. Run the one-shot
   migration (`bun run db:migrate` pointed at the Coolify DB host).
3. **Configure durable object storage** (R2/S3) and upload one managed media asset through the app;
   confirm it is served from object storage, **not** the container FS (restart the container and
   re-fetch the asset — it must survive).
4. **Preflight on the target** (read-only) — write the machine-readable report with `--json-output`
   (stdout is human-readable progress, not the report):
   ```bash
   APP_ENV=production DATABASE_URL=<url> bun run production:preflight -- \
     --json-output=evidence/preflight.json
   ```
5. **Edge/TLS/CDN**: put Cloudflare/CDN/WAF in front per `deploy-coolify.md`; verify TLS + security
   headers/CSP with `curl -I https://<site>` and confirm no secrets in headers/logs.

**Acceptance (#293):**

- [ ] `Dockerfile.production` image builds and boots with the full-online profile; `production:preflight` green on target.
- [ ] Managed media proven on **durable** object storage (survives container restart).
- [ ] No secrets in repo/logs/audit/responses; TLS + security headers/CSP verified on the live edge.

---

## §B — #294 Backup/restore + DR with measured RTO/RPO + chaos drills

Reference: [`resilience-dr-verification.md`](resilience-dr-verification.md),
[`production-preflight-runbook.md`](production-preflight-runbook.md) §Stage 2.

1. **Full DR drill on staging** (real backup → real restore → RLS/schema verification via
   `deploy/backup/restore-drill.sh`):
   ```bash
   bun run resilience:dr-drill -- --confirm-non-production=staging --full \
     --json-output=evidence/dr-drill-staging.json
   ```
   Use `--json-output=<path>` (NOT a `>` stdout redirect — stdout is human-readable progress; the
   machine-readable report is written by the flag). The `full` tier requires a version-matched
   `pg_dump`/`pg_restore` (else `backup-restore-drill` is skipped, not failed). The JSON records
   RTO/RPO + retry/idempotency evidence.
2. **Production backup evidence + restore rehearsal** per preflight Stage 2: take a real backup,
   verify it with `pg_restore --list`, and restore it into a disposable database to **measure**
   restore wall-clock (RTO) and the backup age/lag (RPO). Record both numbers.
3. **Failure drills** (each must degrade safely, alert, and match the runbook): provider outage,
   worker restart (`SIGTERM` → advisory lock not stuck), DB saturation (work-class gate),
   stale projection/index reconcile, object-storage outage (outbox + circuit breaker), cache
   invalidation. The `safe`-tier scenarios run in-process; run them and capture output:
   ```bash
   bun run resilience:dr-drill -- --confirm-non-production=staging \
     --json-output=evidence/dr-drill-safe.json
   ```
   For the object-storage and stale-index drills against real infra, follow the scenario catalog
   in `resilience-dr-verification.md` §Scenario catalog and record alerts + recovery.

**Acceptance (#294):**

- [ ] Restore rehearsal succeeds; **RTO/RPO measured and documented** (numbers, not "shape").
- [ ] Each failure drill degrades safely (no data loss, generic errors, provider calls stay outside the source DB tx); runbook updated with any discrepancy found.

---

## §C — #295 Performance/CWV budgets + load/soak at representative volume

Reference: [`performance-suite.md`](performance-suite.md).

1. **Seed representative volume** and run the full server-side suite + query-plan gate:
   ```bash
   bun run performance:suite -- --confirm-non-production=staging --full \
     --json-output=evidence/perf-suite-staging.json
   bun run performance:query-plan:check -- --confirm-non-production=staging \
     | tee evidence/query-plan-check.log
   ```
   Use `--json-output=<path>` for the suite report (stdout is human-readable). `--full` enables the
   `soak-stability` scenario (long-run memory stability). The report (SSR/DB/search/sitemap/feed
   budgets + soak result) carries its own `disclaimer` (numbers are hardware-relative — never a
   universal guarantee). `performance:query-plan:check` reports to console and exits non-zero on a
   budget breach — `tee` its output for the evidence trail.
2. **HTTP load + soak at the edge** with `k6`/`autocannon` against the deployed site (public pages,
   search, sitemap/feed, cached vs uncached). Record throughput, p95/p99 latency, error rate, and a
   soak run (≥30 min) showing no leak/regression + cache hit behavior.
3. **Core Web Vitals** with Lighthouse CI against representative rendered pages (home, blog/news
   list + detail, storefront/catalog if present):
   ```bash
   npx @lhci/cli autorun --collect.url=https://<site>/ --collect.url=https://<site>/blog
   ```
   Record **LCP / INP / CLS** against the declared budgets.

**Acceptance (#295):**

- [ ] Core Web Vitals within budget at representative content/media volume (LCP/INP/CLS captured).
- [ ] Server/query/search/feed budgets pass under load; soak shows no leak/regression; cache behavior measured.

---

## §D — #296 Full-journey accessibility (axe EN/ID) + automated link checking

Reference: `tests/e2e/public-a11y-smoke.e2e.ts`, `tests/e2e/admin-a11y-smoke.e2e.ts`,
`tests/integration/public-link-integrity.integration.test.ts` (all from #298).

1. **Run the in-repo axe smoke against the rendered site** (desktop + mobile viewports):
   ```bash
   bun run test:e2e   # requires a running server + seed DB; runs the axe smokes
   ```
   Extend coverage to the **full public journey** in EN **and** ID (loading/empty/error/stale
   states, direct-URL negatives) and add **keyboard + screen-reader** passes on the critical paths.
   Capture axe JSON per page/locale; every critical journey must meet the declared **WCAG 2.2** target.
2. **Automated link check on the rendered site** (a live crawl, complementary to the in-repo
   internal-link integrity test):
   ```bash
   lychee --no-progress https://<site> https://<site>/sitemap.xml
   ```
   Capture the report; zero broken internal/SEO/feed links.

**Acceptance (#296):**

- [ ] Critical public journeys meet WCAG 2.2 (axe, EN + ID, desktop + mobile, keyboard, screen reader).
- [ ] Link check green (no broken internal/SEO/feed links) on the rendered site.

---

## §E — #292 In-place template full-journey + one upgrade rehearsal (reframed by ADR-0034)

The original "external derived pilot in `ahliweb/awpos`" is superseded (ADR-0034 §3/§5). What remains:

1. **Full bilingual (EN/ID) public + admin journey** on the deployed template instance:
   provision tenant + verified primary/alternate domains → durable storage/media → select/preview/
   publish a trusted theme → publish translated page/blog/news → verify canonical/hreflang/social/
   JSON-LD → robots/sitemap index+children/RSS-Atom-JSON feed/ETag-304/invalidation → change a slug,
   verify 301 redirect + 404 governance → site search index/rebuild/reconcile/query → submit/moderate/
   publish/report/delete a comment → subscribe/confirm/receive (fake provider)/unsubscribe + verify
   suppression → inspect audit/metrics/jobs/lifecycle/readiness/reporting. The automatable portion is
   already proven in-repo by the #291 cross-feature suites — this step re-runs it against the live instance.
2. **One base-upgrade rehearsal** (template-instance upgrade): from the deployed instance, upgrade to
   a newer AWCMS-Micro release following [`production-preflight-runbook.md`](production-preflight-runbook.md)
   Stage 1→4 (rehearse on staging, backup evidence, read-only preflight, apply) and confirm **no data
   loss or contract drift** (`bun run api:spec:check` version + migrations applied cleanly).

**Acceptance (#292):**

- [ ] Full bilingual journey succeeds against the deployed instance (no base edits — it _is_ the base, used directly).
- [ ] One upgrade rehearsal succeeds without data loss or contract drift.
- [ ] Any generic foundation gap found becomes its own atomic BASE issue (never backported as vertical logic).

---

## §F — #273 and #261 closure

- **#273** closes when #292–#296 are all green and their evidence is linked from
  [`website-platform-e2e-evidence.md`](website-platform-e2e-evidence.md) §Deferred work (flip each row
  from `partial` to `covered`).
- **#261** (epic) closes when #273 closes and the evidence index below is complete. Wave-0
  (#262/#263/#264) and all website modules are already done; the registry is 22 modules.

## Evidence conventions

- Store artifacts under `evidence/<yyyy-mm-dd>/<issue>/…` (git-ignored or an external evidence store —
  never commit secrets or large binaries).
- Prefer the **machine-readable** outputs (`dr-drill`/`performance:suite`/`preflight` JSON) as primary
  evidence; add a short human summary per issue.
- Every drill/suite records a `disclaimer`/environment note — keep it; a skipped check must never read
  as a passed one.
- Paste the evidence links into the issue, tick the acceptance boxes, and close.
