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

The real distance between the two repos is **not** base-layer hardening — it is
**whole modules**: awcms-mini has completed the platform-evolution epic (#738,
Waves 1–3) that awcms-micro has not (see §Module-parity program).

## Track A — Confirmed base-layer deltas (micro lags the standard)

These are places where awcms-mini is genuinely more hardened. Each is an atomic
PR.

| #   | Item                                                                                        | Axis     | Status                                        |
| --- | ------------------------------------------------------------------------------------------- | -------- | --------------------------------------------- |
| A1  | Login account-enumeration **timing** oracle — `verifyPasswordOrDummy`                       | security | ✅ Done (#248)                                |
| A2  | Login account-enumeration **response-body** collapse (`locked` / `password_login_disabled`) | security | Proposed — contract-affecting, needs sign-off |

### A1 — Login timing oracle ✅ (merged #248)

`POST /api/v1/auth/login` skipped the argon2id verify entirely for an unknown
`loginIdentifier` (~4 ms vs ~80 ms known → ~19x oracle). Fixed by porting the
base standard's `verifyPasswordOrDummy` (Issue #840): always pay an equivalent
argon2id verify against a process-memoized dummy hash. No API change. Pinned by
a mutation-verified unit test + an end-to-end integration timing test.

### A2 — Login response-body collapse (proposed)

The other half of the base standard's Issue #840. Today awcms-micro's login
still distinguishes deny reasons **after** an identity resolves, which is an
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

**Why this needs sign-off (unlike A1):** it changes the **API contract** — the
`403 PASSWORD_LOGIN_DISABLED` response goes away, and an
`tests/integration/tenant-sso-flow.integration.test.ts` assertion + the
`src/lib/i18n/error-messages.ts` catalog entry change with it. The base standard
accepted the tradeoff deliberately: a genuinely locked user, and a user at an
SSO-required tenant, now get the generic message with no hint about _why_. Those
hints belong on channels that cannot be probed anonymously (a verified-email
notification; tenant-wide SSO discovery on the login page) — neither exists in
micro yet. Confirm this tradeoff is acceptable before implementing.

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

## Track C — Module-parity program (the real distance)

awcms-mini has 11 skills/modules that awcms-micro does not, almost all from the
platform-evolution epic (#738). Porting these is a **multi-PR program per
module**, not base-layer hardening. Listed for planning only; none is in scope
until explicitly chosen.

| Module (mini)             | Wave / origin | Note                                                                        |
| ------------------------- | ------------- | --------------------------------------------------------------------------- |
| `domain-event-runtime`    | #738 W1       | event dispatcher/ordering/retry/dead-letter                                 |
| `organization-structure`  | #738 W2       | effective-dated unit hierarchy                                              |
| `workflow-approval`       | #738 W2       | graph-based managed approval engine                                         |
| `integration-hub`         | #738 W3       | inbound webhooks, outbound subscriptions, **SSRF guard**, replay protection |
| `document-infrastructure` | #738 W3       | document management + resource relations                                    |
| `data-exchange`           | #738 W3       | import/export adapters via capability port                                  |
| `reference-data`          | #738 W3       | contributed value sets                                                      |
| `reporting`               | 9.1 + #753    | projections/exports                                                         |
| `idn-admin-regions`       | #654          | Indonesia administrative-region master data                                 |
| `erp-extension-readiness` | —             | ERP extension contracts (read/consume)                                      |
| `legacy-migration`        | —             | **read-only**; deliberately descoped from the base — do not implement here  |

The most security-relevant of these is `integration-hub`: it is where the base
standard's SSRF guard lives (literal + DNS-resolved IP classification, IPv6
embedded-IPv4 forms, redirect re-validation). awcms-micro has no user/operator
-supplied outbound-URL surface today, so the absence of an SSRF guard is not a
live gap — it becomes one only if/when an inbound-webhook or outbound
-subscription surface is added.

## Suggested order

1. **A2** (finish the #840 port) — once the contract tradeoff is signed off.
2. Then, if desired, pick from **Track C** one module at a time (each a
   sequenced sub-program), or pursue **Track B** items as base-standard-first
   hardening.
