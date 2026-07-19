# SEO Distribution — Redirect Governance, URL-Change Capture & 404 Governance (Issue #268)

The third and final Wave-1 runtime slice of `seo_distribution` (ADR-0028, epic
#261): controlled, tenant-contained redirect management, URL-change capture into
audited redirect proposals, bounded chain/loop prevention, the ADR-0010-deferred
`/blog/{tenantCode}` → `/news` auto-redirect, and privacy-minimized 404
governance. **Security is the primary design constraint** — redirects are the most
abuse-prone SEO surface (open-redirect / CRLF / ReDoS / admin-route hijack /
cross-tenant confusion).

Related: [SEO metadata rendering (#266)](../../src/modules/seo-distribution/README.md) ·
[SEO discovery/feeds (#267)](seo-distribution-discovery.md) · module code
`src/modules/seo-distribution/`.

## 1. What is (and is NOT) supported

| Supported (#268)                                                       | Deferred / out of scope                                        |
| ---------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Exact-path** redirect rules, tenant-scoped, RLS FORCE'd              | **Prefix / pattern / regex** rules — need an ADR (see §9)      |
| Relative same-tenant targets + absolute URLs to the tenant's own hosts | Arbitrary external / cross-tenant / off-platform targets       |
| 301 / 308 (permanent) + 302 / 307 (temporary), per documented policy   | Tenant-authored executable rewrite logic                       |
| Optional locale / domain scope, effective dates, soft delete/restore   | Reverse-proxy routing, DNS, URL shortening, affiliate tracking |
| Bounded chain collapse + loop rejection (no DB recursion)              | Redirecting admin / API / auth flows through tenant rules      |
| URL-change capture (slug/domain/locale) → proposal or rule             |                                                                |
| Legacy `/blog/{tenantCode}` → `/news` auto-redirect (policy-gated)     |                                                                |
| Privacy-minimized, retention-bound 404 governance                      |                                                                |

## 2. Path normalization specification

Every path — a rule's source, a rule's relative target, and the incoming request
path — is normalized by the SAME pure function `domain/redirect-path.ts`
`normalizeRedirectPath`, so a rule and a request match only when they truly denote
the same path. This is the CRLF / traversal / Unicode-confusion / protocol-relative
defense.

Normalization steps (deterministic, no pattern engine → no ReDoS):

1. Reject empty, over-length (> 2048), or non-string input.
2. **Reject** any C0 control (U+0000–U+001F), DEL (U+007F), or whitespace
   (CRLF/header-injection defense).
3. **Reject** malformed Unicode (lone surrogates); NFC-normalize the rest.
4. **Reject** any backslash (slash-confusion vector) and protocol-relative `//…`.
5. Require a leading `/`; parse against a synthetic unresolvable base and confirm
   the resolved origin did not escape (closes `//evil.com` / `/\evil.com`).
6. Resolve dot-segments (`.`/`..`, clamped at root — cannot escape origin),
   collapse duplicate slashes, uppercase percent-encoding, strip a trailing slash
   (except root). Query is dropped for a source/match key; kept for a relative
   target.

Matching is **case-sensitive** after normalization (`/About` ≠ `/about`).

## 3. Target validation — the frozen open-redirect guard

`#268 does NOT reinvent redirect-target safety.` Every target is routed through the
FROZEN guards in `src/modules/_shared/ports/seo-facts-port.ts`
(`classifyRedirectTarget` / `assertSafeRedirectTarget`, HIGH-1-hardened in #265) —
the single open-redirect / cross-tenant control. Only a `same_tenant_internal`
classification is ever emitted:

- `relative_same_tenant` — a relative same-origin path.
- `verified_external` — an absolute `http(s)` URL whose host is one of the tenant's
  **verified** registered domains (`awcms_micro_tenant_domains`, server-derived,
  never a raw `Host`).

`//evil.com`, `/\evil.com`, `javascript:`, `data:`, `mailto:`, a cross-tenant host,
and every C0/DEL-control bypass are **rejected**. Targets are re-validated **at
resolve time** against the tenant's CURRENT hosts, so a `verified_external` target
to a domain the tenant has since removed **fails closed** (no redirect), never open.

## 4. Resolution order & precedence

Redirects resolve in `src/middleware.ts`, in the non-`/admin` branch, **AFTER**
verified tenant/domain + locale normalization and **BEFORE** public content route
resolution (`next()`):

1. **Eligibility gate** (`domain/redirect-eligibility.ts`, `isRedirectEligiblePath`)
   — the admin-route-hijack defense. A tenant redirect can **never** intercept
   `/api/*`, `/admin*`, auth (`/login`, `/logout`, `/setup`, `/auth*`),
   framework-internal (`/_*`), static assets, or system routes (`/health`,
   `/robots.txt`, `/sitemap*`, `/feed*`, `/atom.xml`, `/.well-known/*`). Deny-list,
   fail-safe. The gate **percent-decodes** the path before matching (A-L2), so an
   encoded reserved path (`/%61pi/…` → `/api/…`, `/api%2fv1/…` → `/api/v1/…`) cannot
   slip past. The SAME gate is ALSO enforced at **write time** on the rule's
   normalized source (A-L1) — an ineligible source can never be stored via create,
   bulk import, or URL-change capture — so a reserved path is excluded twice (write
   and resolve), by design.
2. **Legacy `/blog/{tenantCode}` → `/news`** — resolves the tenant by the PATH code
   and, only if `legacy_blog_redirect_enabled` and a verified primary host exist,
   301-redirects to the canonical `/news…` on that host.
3. **Tenant-authored exact-path rules** — resolves the tenant by the server-derived
   HOST, then walks a bounded chain.

When multiple active rules match one path, the most specific scope wins:
`domain-scoped` > `locale-scoped` > all-scopes, then oldest (`created_at ASC`).

Any redirect-subsystem error degrades to "no redirect" (fail open to normal
content serving) — a redirect fault never takes down public pages.

## 5. Status-code policy

| Code | Meaning            | Cache-Control emitted  | Use                                 |
| ---- | ------------------ | ---------------------- | ----------------------------------- |
| 301  | Moved Permanently  | `public, max-age=3600` | Permanent slug/URL change (default) |
| 308  | Permanent Redirect | `public, max-age=3600` | Permanent, method-preserving        |
| 302  | Found              | `no-store`             | Temporary redirect                  |
| 307  | Temporary Redirect | `no-store`             | Temporary, method-preserving        |

A **chain** is collapsed to a single redirect to the final destination. The emitted
code is permanent **only if every hop is permanent**; otherwise it is downgraded to
temporary (so a client never permanently caches a destination that passed through a
temporary hop).

## 6. Chain / loop / conflict prevention

- **Bounded, non-recursive** (`domain/redirect-chain.ts`): at most
  `MAX_REDIRECT_HOPS` (5) indexed point-lookups per request — never a recursive SQL
  CTE.
- **Self-redirect** and **loops** → fail closed (no redirect), logged for operator
  remediation, never bounced.
- **`verified_external` same-host loops** (A-M1): a `verified_external` target is an
  absolute URL on one of the tenant's OWN verified hosts, so it is NOT a clean
  terminal — its `pathname` is folded back into the identical self-redirect /
  visited-set detection used for relative hops. `/a → https://<own-host>/a` (single
  rule) and `/a → …/b`, `/b → …/a` (two rules) are therefore rejected at WRITE time
  and terminate (passthrough) at resolve, exactly like their relative equivalents. A
  target to a host NOT currently among the tenant's verified hosts stays terminal and
  the resolve-time frozen-guard re-validation fails it closed.
- **Chains beyond the cap** → fail closed.
- **Source conflict**: at most one live (non-deleted, non-archived) rule per
  `(tenant, normalized source, locale scope, domain scope)` — enforced by a partial
  unique index AND explained at create/validate time.
- Create / update / import / URL-change capture all run the SAME pre-write safety
  gate (`application/redirect-safety.ts`): conflict + loop + chain preview
  **overlaid** on the tenant's existing rules.
- **Intra-batch loops** (bulk import, R-M1): the chain preview overlays the
  already-accepted sibling items of the SAME import (not just persisted rules), so
  `[{/a→/b},{/b→/a}]` is reported as a loop in dry-run and rejected all-or-nothing on
  real import — neither item is ever created.
- **Write-time preview scope** (R-M2, defense-in-depth): the pre-write chain preview
  resolves every hop under the PROPOSED rule's own `(locale, host)` scope — the only
  scope under which the proposed rule can itself participate in a chain. A loop that
  closes solely under a DIFFERENT scope (which the proposed rule can never match) is
  not previewed at write time; it is caught at RESOLVE time, where every emitted
  target is re-validated and any loop fails CLOSED. A chain resolves under one fixed
  request scope, so resolving each hop under a distinct scope is not meaningful — this
  is an intentional design point, not a gap.

### Performance follow-up (R-M3, tracked)

`resolvePublicRedirectForRequest` (`src/lib/seo/redirect-middleware.ts`) runs a full
`withTenant` transaction (module-enabled + verified-hosts + primary-host + a chain
point lookup) on **every** eligible public request, even for tenants with zero active
rules. A "does this tenant have any live rule?" short-circuit is **deliberately
deferred** (see the `// TODO(perf #268-followup)` note): it is not correctness-safe in
this PR because the legacy `/blog/{tenantCode}` → `/news` auto-redirect fires from
`awcms_micro_seo_redirect_settings` (not from a redirect-rule row), and the passthrough
branch still needs the server-derived host to attribute a 404 observation. Correctness
(never miss a live rule, never serve a deleted one) takes priority over the
optimization; a safe, invalidation-aware short-circuit is left as a follow-up.

## 7. Query-string policy

Query params are **DROPPED by default**. A rule may opt into `preserveQuery`, in
which case the incoming query is appended **only** to a `relative_same_tenant`
target that carries no query of its own. Absolute (`verified_external`) targets
never receive the incoming query.

## 8. Admin API

All under `/api/v1/seo/redirects/*` and `/api/v1/seo/not-found/*` (monolithic
OpenAPI, `openapi/modules/seo-distribution.openapi.yaml`). ABAC-gated,
tenant-scoped, audited; high-risk mutations require an `Idempotency-Key`.

| Method + path                                    | Permission                          |
| ------------------------------------------------ | ----------------------------------- |
| `GET /seo/redirects`                             | `redirect.read`                     |
| `POST /seo/redirects`                            | `redirect.create` (idempotent)      |
| `POST /seo/redirects/validate` (dry run + chain) | `redirect.read`                     |
| `POST /seo/redirects/import` (`dryRun`)          | `redirect.create` (idempotent)      |
| `POST /seo/redirects/capture-url-change`         | `redirect.create` (idempotent)      |
| `GET`/`PUT /seo/redirects/settings`              | `redirect.read` / `.update`         |
| `GET`/`PUT`/`DELETE /seo/redirects/{id}`         | `redirect.read`/`.update`/`.delete` |
| `POST /seo/redirects/{id}/lifecycle`             | `.update` (purge → `.delete`)       |
| `GET /seo/not-found`                             | `not_found.read`                    |
| `POST`/`DELETE /seo/not-found/{id}`              | `not_found.update`                  |

Permissions are seeded by migration 084 for tenants created **after** it runs
(same limitation as every prior permission seed); backfilling existing tenants is a
separate operator action.

### Migration / import SOP

1. Export or author a list of `{ sourcePath, target, statusCode?, … }` objects.
2. `POST /seo/redirects/import` with `dryRun: true` → review the per-item report
   (each item validated + conflict/loop/chain-checked, intra-batch duplicates
   flagged) writing nothing.
3. Re-`POST` with `dryRun: false` and an `Idempotency-Key`. Import is
   **all-or-nothing**: if any item is invalid/unsafe, nothing is written.
4. Cap: 200 items per request.

## 9. Deferred: prefix / pattern rules (needs an ADR)

Prefix and pattern (regex) rules are **explicitly deferred** to a future ADR. They
would introduce a pattern engine (a ReDoS surface) and a far larger hijack surface;
`#268` accepts EXACT-PATH rules only, which sidesteps ReDoS entirely (the redirect
tables cannot store a pattern). A future ADR must specify a bounded, non-backtracking
implementation (e.g. anchored prefix trie, no tenant-authored regex) before this is
implemented.

## 10. 404 governance — privacy & retention matrix

`awcms_micro_seo_not_found_observations` records broken-link signal for operator
remediation, minimized by construction.

| Field     | Stored                                             | NOT stored                                |
| --------- | -------------------------------------------------- | ----------------------------------------- |
| Path      | sanitized + normalized path, **query dropped**     | full URL, query string, tokens, secrets   |
| Referrer  | bare referrer **domain** only                      | full referrer URL / path / query          |
| Shape     | **aggregate** (one row per distinct tuple)         | one row per hit (a bot probing = one row) |
| Retention | `data_lifecycle` registry, default **30d** (7–365) | indefinite retention                      |

Reuses `visitor-analytics`'s `sanitizePath` / `extractReferrerDomain`. Bounded
retention is enforced by the generic `data_lifecycle` purge engine
(`seo_distribution.not_found_observations`, `analytics_telemetry`, hard-delete).

## 11. Cache / CDN guidance

- Permanent redirects (301/308) are `public, max-age=3600` — a CDN/browser may
  cache them, so `hit_count` is a **lower bound** (origin may not see every hit).
- Temporary redirects (302/307) are `no-store` — never cached.
- If you front the app with a CDN, purge cached redirects after changing a rule, or
  rely on the 1-hour `max-age` to expire.

## 12. Threat model (what each control defends)

| Threat                        | Control                                                              |
| ----------------------------- | -------------------------------------------------------------------- |
| Open redirect                 | frozen `assertSafeRedirectTarget` on write AND every resolve (§3)    |
| CRLF / header injection       | `normalizeRedirectPath` rejects C0/DEL/whitespace (§2)               |
| Path traversal                | dot-segments resolved + clamped at origin (§2)                       |
| Unicode confusion             | NFC + lone-surrogate rejection (§2)                                  |
| ReDoS                         | exact-path only, no pattern engine (§1, §9)                          |
| Admin-route hijack            | `isRedirectEligiblePath` deny-list, checked before any lookup (§4.1) |
| Cross-tenant confusion        | RLS FORCE + server-derived tenant/host + tenant-first everything     |
| Host poisoning                | host derived from `tenant_domain`, never a raw `Host`                |
| Redirect loop / amplification | bounded non-recursive chain, fail-closed (§6)                        |
| 404 data leakage              | sanitized path + bare referrer domain + retention (§10)              |
