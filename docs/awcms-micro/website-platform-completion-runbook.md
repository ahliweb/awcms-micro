# Website-platform completion runbook — closing #293–#296 (epic #261)

> **Issue status (verified 2026-07-25).** **#273 and #292 are already CLOSED** — #273 as
> completed once its automatable surface landed, #292 because ADR-0036 cancelled its
> "derived-site pilot" premise. What is still open: **#293–#296** and the umbrella epic
> **#261**. §E below is therefore historical; §A–§D are the live procedure.
>
> **Purpose.** Issues #293–#296 (split from #273, epic #261) are the last website-platform
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
   APP_ENV=production DATABASE_URL=<url> \
     PREFLIGHT_TEST_DATABASE_URL=<DISPOSABLE-db-url> \
     bun run production:preflight -- --json-output=evidence/preflight.json
   ```

   `PREFLIGHT_TEST_DATABASE_URL` must point at a **disposable** database (a throwaway
   `postgres:18.4` container is fine), never at the target: the `test` stage runs the integration
   suite, which `TRUNCATE`s every `awcms_micro_*` table. Preflight refuses to forward the target's
   own `DATABASE_URL` to that stage — omit the variable and `test` runs unit-only and reports
   **SKIP**, which blocks go-live under `APP_ENV=production`.

   Three field gotchas, each found the hard way running this against a live target (2026-07-25):

   - **Address the disposable database by an allow-listed HOST NAME, not by IP.**
     `src/lib/resilience/target-guard.ts`'s `KNOWN_SAFE_HOSTS` is default-deny and accepts only
     `localhost` / `127.0.0.1` / `[::1]` / `postgres` / `db` / `0.0.0.0`. A container IP such as
     `10.0.1.12` is treated as production-like, so `dr-drill`/`performance-suite` refuse to run and
     the `test` stage fails with 4 failures that look like product bugs but are not. Give the
     throwaway container a network alias (`docker network connect --alias postgres …`) and use
     `postgres://…@postgres:5432/…`.
   - **`APP_URL` must be reachable FROM wherever preflight runs.** `db:pool:health` is a mandatory
     stage under `APP_ENV=production` (a SKIP blocks go-live), and it probes `APP_URL`. If you run
     preflight on the deployment host itself, the public hostname usually will **not** resolve back
     (no NAT hairpin) — point `APP_URL` at the app container's internal address
     (`http://<container-ip>:4321`) instead. Note the app listens on **4321**, not 3000.
   - **Run `bun run db:migrate` against the disposable database first.** The integration suite
     expects the schema to exist, exactly as CI does before `bun test`.

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
`tests/integration/public-link-integrity.integration.test.ts` (all from #298),
`tests/e2e/public-content-a11y.e2e.ts` (axe atas template artikel `/news` + `/blog`
yang sudah dirender, ber-seed, EN/ID × desktop/mobile — #296, menutup item axe
konten yang sebelumnya deferred), `tests/e2e/public-discovery-a11y.e2e.ts` (axe atas
halaman daftar, halaman pencarian termasuk cabang kosong/terlalu-pendek/tanpa-hasil,
dan dokumen 404 publik — EN/ID × desktop/mobile + pencarian via keyboard),
`tests/e2e/public-keyboard-journey.e2e.ts`, dan `scripts/link-check.ts`.

1. **Run the in-repo axe smokes against the rendered site** (desktop + mobile viewports):

   ```bash
   bun run test:e2e   # requires a running server + seed DB; runs the axe smokes
   ```

   The public journey is covered by four specs (`public-a11y-smoke`,
   `public-content-a11y`, `public-discovery-a11y`, `public-keyboard-journey`) in EN
   **and** ID, at desktop **and** mobile, including the empty/too-short/no-results/404
   states and direct-URL negatives. The **screen-reader** pass is the one part no tool
   automates — do it by hand (NVDA or VoiceOver) on: homepage → listing → article →
   search → 404. Capture axe JSON per page/locale; every critical journey must meet the
   declared **WCAG 2.2** target.

2. **Automated link check on the rendered site** — in-repo, no external tool to install:

   ```bash
   bun run link:check -- --url=https://<site>/ --json-output=link-check.json
   ```

   Crawls the rendered page graph from the entry URL, additionally seeded by
   `robots.txt` `Sitemap:` directives and the sitemap index/children, and verifies every
   internal anchor, `rel=canonical`, `rel=alternate hreflang`, feed autodiscovery link
   and pagination link resolves. Exit **0** = clean, **1** = broken links (listed in
   `broken[]` with the page each was found on), **2** = usage error or the entry URL
   itself is unreachable — a crawl that reached nothing is never reported as green.
   Useful flags: `--site-origin=https://<primary-domain>` when probing through a
   different address than the site's own canonical domain (staging host, internal IP
   behind the CDN, pre-cutover `localhost`), `--include-external` to also verify
   outbound links, `--max-pages=` to bound a large site. Read-only GETs only — safe
   against production. Attach `link-check.json` as the evidence artifact; zero broken
   internal/SEO/feed links.

**Acceptance (#296):**

- [ ] Critical public journeys meet WCAG 2.2 (axe, EN + ID, desktop + mobile, keyboard, screen reader).
- [ ] `bun run link:check` exits 0 on the rendered site (no broken internal/SEO/feed links).

---

## §E — #292 In-place template full-journey + one upgrade rehearsal (CLOSED — historical)

> ⛔ **#292 is CLOSED (2026-07-21).** ADR-0036 cancelled the premise outright: there are no
> derived sites in this family, the template is used directly. The bilingual full-journey
> portion is already proven in-repo by the #291 cross-feature suites. The **base-upgrade
> rehearsal** below is the one piece never proven on a live instance — if you still want it,
> raise a new focused issue for it rather than reopening #292. Kept here for traceability.

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

## §F — #261 closure (#273/#292 already closed)

- **#273** is **CLOSED** (completed 2026-07-20): its automatable surface landed and the
  infra-gated remainder was split into #293–#296. **#292** is **CLOSED** (2026-07-21, premise
  cancelled by ADR-0036). Neither needs reopening — keep linking new field evidence from
  [`website-platform-e2e-evidence.md`](website-platform-e2e-evidence.md) §Deferred work (flip each
  row from `partial` to `covered` as it lands).
- **#261** (epic) closes when **#293–#296** are all green and the evidence index below is complete.
  Wave-0 (#262/#263/#264) and all website modules are already done; the registry is 22 modules.

## Evidence conventions

- Store artifacts under `evidence/<yyyy-mm-dd>/<issue>/…` (git-ignored or an external evidence store —
  never commit secrets or large binaries).
- Prefer the **machine-readable** outputs (`dr-drill`/`performance:suite`/`preflight` JSON) as primary
  evidence; add a short human summary per issue.
- Every drill/suite records a `disclaimer`/environment note — keep it; a skipped check must never read
  as a passed one.
- Paste the evidence links into the issue, tick the acceptance boxes, and close.
