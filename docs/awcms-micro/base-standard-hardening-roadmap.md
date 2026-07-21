# Base-standard hardening roadmap (awcms-mini → awcms-micro)

Status: living document. Started 2026-07-18.

This roadmap records the outcome of a cross-repo study of the AhliWeb base
standard **awcms-mini** against **awcms-micro**, along three axes — algorithm
correctness, performance, and security. Its purpose is to bring awcms-micro's
**reusable/base layer** up to the base standard, one atomic PR at a time, per
the Definition of Done (doc 10 §Pull request checklist).

## Method

Two read-only audits were run: a catalog of awcms-mini's base-layer hardening
patterns, and a weakness map of awcms-micro's equivalent layers. Every
candidate below was then **verified against awcms-mini's actual code** before
being classed — because most raw audit findings turned out to be
characteristics **shared by both repos** (i.e. not a place where micro lags the
standard), and those are explicitly separated out so they are not mistaken for
alignment work.

## Headline finding

awcms-micro's reusable base layer is already **strong and largely at parity**
with the base standard. It already has: the single `withTenant` transaction
chokepoint (RLS `SET LOCAL` + `assertUuid`), a 3-state circuit breaker,
work-class concurrency gate with a bounded queue, keyset pagination,
single-source redaction, dual-layer request body limits with the HTTP/1.1
`Connection: close` desync fix, `FORCE ROW LEVEL SECURITY` on tenant tables,
idempotency-key race handling, TOTP replay guard (`last_used_step`), RS256 JWT
verification with no algorithm-confusion path, security response headers, and
CSPRNG bearer tokens hashed at rest.

The remaining difference between the two repos is **not** base-layer hardening
and is **not a gap to close** — it is **whole ERP-scope modules that awcms-micro
deliberately does not carry**. Per **ADR-0025**, awcms-micro is the awcms-mini
base standard **narrowed to WEBSITE scope**; the seven upstream ERP modules were
intentionally pruned, not left unfinished (see §Track C). The migration-number
gaps (048/054/060/063–076) are the honest trace of that prune.

## Track A — Confirmed base-layer deltas (micro lags the standard)

These are places where awcms-mini is genuinely more hardened. Each is an atomic
PR.

| #   | Item                                                                                        | Axis     | Status         |
| --- | ------------------------------------------------------------------------------------------- | -------- | -------------- |
| A1  | Login account-enumeration **timing** oracle — `verifyPasswordOrDummy`                       | security | ✅ Done (#248) |
| A2  | Login account-enumeration **response-body** collapse (`locked` / `password_login_disabled`) | security | ✅ Done (#251) |

### A1 — Login timing oracle ✅ (merged #248)

`POST /api/v1/auth/login` skipped the argon2id verify entirely for an unknown
`loginIdentifier` (~4 ms vs ~80 ms known → ~19x oracle). Fixed by porting the
base standard's `verifyPasswordOrDummy` (Issue #840): always pay an equivalent
argon2id verify against a process-memoized dummy hash. No API change. Pinned by
a mutation-verified unit test + an end-to-end integration timing test.

### A2 — Login response-body collapse ✅ (merged #251)

The other half of the base standard's Issue #840. awcms-micro's login used to
distinguish deny reasons **after** an identity resolves, which was an
account-enumeration oracle for an unauthenticated caller (OWASP ASVS V2.2.1 /
WSTG-IDNT-04):

- `locked` → `401 AUTH_INVALID_CREDENTIALS` but message `"Account is temporarily
locked."` — reachable in ~6 requests on a default deployment by tripping
  `AUTH_LOGIN_MAX_ATTEMPTS`, then reading the message back.
- `password_login_disabled` → `403 PASSWORD_LOGIN_DISABLED` — a **distinct
  status + code**, and (under a tenant with password login disabled) it
  fingerprints exactly the tenant's break-glass identities: `403` = "exists and
  is not break-glass", `401` = "unknown or break-glass".

The base standard collapses both into the same `401 AUTH_INVALID_CREDENTIALS
"Invalid login identifier or password."` that an unknown identifier gets.
`tenant_inactive` stays a distinct `403` because it is decided from the tenant
header alone, before any identity lookup, so it cannot enumerate.

This changed the **API contract** — the `403 PASSWORD_LOGIN_DISABLED` response
went away (it was never in OpenAPI and has no client consumer;
`error-messages.ts` retains the code as dead vocabulary so the i18n key set
stays stable), and the `tests/integration/tenant-sso-flow.integration.test.ts`
assertion was updated to require the disabled-identity denial to be
byte-identical to an unknown identifier's. Accepted tradeoff (as in the base
standard): a genuinely locked user, and a user at an SSO-required tenant, now get
the generic message with no hint about _why_. Those hints belong on channels
that cannot be probed anonymously (a verified-email notification; tenant-wide SSO
discovery on the login page) — neither exists in micro yet.

## Track B — Shared characteristics (NOT alignment deltas)

These were raised by the weakness audit but were then found to be **identical in
awcms-mini**, so they are not "bring micro up to the standard" work. They are
recorded here so they are not re-investigated as gaps. Any of them could still
be pursued as hardening that advances **both** repos, but that is a different
decision (and ideally lands in the base standard first).

- **Rate-limit `resolveClientIp` trusts the first `X-Forwarded-For` entry**
  with no trusted-proxy gate. `src/lib/security/rate-limit.ts` is byte-identical
  between the two repos.
- **Rate-limit store is an unbounded in-process `Map` with no eviction/sweep.**
  Same implementation in both; the per-instance limitation is documented in
  both.
- **Single global DB circuit breaker** shared across tenants (noisy-neighbor
  shared-fate). The base standard does this **on purpose** (failures accumulate
  across requests/tenants); caller-input errors (SQLSTATE 22/23) are correctly
  excluded in both.
- **Sync HMAC signs only `timestamp.body` over one global secret, and nodes
  auto-register `active`.** The base standard's `sync-storage` has the same
  shape. Binding tenant/node into the signed material and defaulting nodes to
  `pending` would be a hardening beyond the standard.

## Track C — ERP-scope modules: deliberately OUT of scope (not a backlog)

**These are not gaps and are not a porting backlog.** Per **ADR-0025**,
awcms-micro is the awcms-mini base standard narrowed to **website scope**. The
seven modules below are **ERP scope** and were intentionally pruned; no module
micro keeps declares a dependency or a required capability on any of them, which
is why the prune was a clean cut. Bringing any of them in would require a
**superseding ADR that widens this template's scope** (module added directly in
this repo) — not a separate derived application (the derived-application pathway
was removed by ADR-0036). ERP/POS capability belongs to the `awcms` lineage.
ADR-0016–ADR-0021 (their
upstream admission ADRs) are retained only as historical upstream references and
**do not apply in this repo**.

Also verified against micro's actual tree during this study: the domains one
might expect to be "missing" are already present and at parity —
`domain_event_runtime`, `reporting`, `media_library` (micro is ahead here),
`identity_access` (auth/RBAC/ABAC), `profile_identity`, `module_management`, and
the whole template/UI layer. See §Headline finding.

| Module (mini)             | Scope | Why excluded from micro                                   |
| ------------------------- | ----- | --------------------------------------------------------- |
| `reference_data`          | ERP   | value-set/code master data; ADR-0021 (upstream-only)      |
| `organization_structure`  | ERP   | legal entities / unit hierarchy; ADR-0016 (upstream-only) |
| `document_infrastructure` | ERP   | document registry / numbering; ADR-0017 (upstream-only)   |
| `data_exchange`           | ERP   | bulk import/export framework; ADR-0018 (upstream-only)    |
| `workflow_approval`       | ERP   | graph approval engine; upstream #747                      |
| `integration_hub`         | ERP   | webhooks + **SSRF guard**; ADR-0019 (upstream-only)       |
| `idn_admin_regions`       | ERP   | Indonesia region master data; upstream #654               |
| `erp_extension_readiness` | ERP   | ERP extension contracts; ADR-0020 (upstream-only)         |

Note on the SSRF guard: it lives in mini's `integration_hub`. Because micro has
**no user/operator-supplied outbound-URL surface**, the absence of an SSRF guard
is not a live gap — it would become relevant only if a website-scope feature
that fetches attacker-influenced URLs is ever added, at which point a scoped
guard (not the whole ERP module) is the right response.

**A reference-data foundation port was attempted during this study and
deliberately discarded** once ADR-0025 was surfaced: porting an ERP module into
the website-scope base contradicts the repo's own governance (ADR-0025, doc 21
module admission). If ERP capabilities are genuinely wanted, the correct vehicle
is a superseding ADR that widens this template's scope (module added directly in
this repo), not a separate derived application (that pathway was removed by
ADR-0036) — and such capability is really the `awcms` lineage's remit.

## Status / what's next

**Track A is complete** — both halves of the base standard's Issue #840 have
landed (A1 timing #248, A2 response-body collapse #251). There is **no known
remaining in-scope base-layer hardening delta** between micro and the standard;
micro is at parity on the website-scope reusable layer.

1. **Track B** items are hardening that would advance both repos; they should
   land in the base standard (awcms-mini) first, then be ported down — they are
   not micro-specific gaps.
2. **Track C** is out of scope for this repo by ADR-0025 — pursue only in a
   derived ERP application, or via a superseding ADR.
