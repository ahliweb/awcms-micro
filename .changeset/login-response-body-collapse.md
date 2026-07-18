---
"awcms-micro": patch
---

Collapse the login account-enumeration response-body oracle on `POST /api/v1/auth/login` (the response-body half of the awcms-mini base standard's Issue #840; the timing half shipped separately).

The handler distinguished deny reasons that are only reachable **after** an identity resolves, which enumerates accounts for an unauthenticated caller (OWASP ASVS V2.2.1 / WSTG-IDNT-04):

- `locked` returned `401 AUTH_INVALID_CREDENTIALS` with the message `"Account is temporarily locked."` — reachable in ~6 requests on a default deployment by tripping `AUTH_LOGIN_MAX_ATTEMPTS`, then reading the message back.
- `password_login_disabled` returned a distinct `403 PASSWORD_LOGIN_DISABLED`, which under a tenant with password login disabled fingerprinted exactly the tenant's break-glass identities (`403` = "exists and not break-glass", `401` = "unknown or break-glass").

Both now collapse into the same `401 AUTH_INVALID_CREDENTIALS "Invalid login identifier or password."` an unknown identifier already gets. `tenant_inactive` stays a distinct `403 ACCESS_DENIED` because it is decided from the tenant header alone, before any identity lookup, so it cannot enumerate.

Behavior change: the `403 PASSWORD_LOGIN_DISABLED` login response is gone (it was never in OpenAPI and has no client consumer). Its `error-messages.ts` catalog entry is retained as vocabulary with a comment — do not wire a UI branch to it. Accepted tradeoff (same as the base standard): a locked user, and a user at an SSO-required tenant, now get the generic message with no hint why; those hints belong on channels that cannot be probed anonymously. `tests/integration/tenant-sso-flow.integration.test.ts` now asserts the disabled-identity denial is byte-identical to an unknown identifier's, and that the break-glass owner can still log in — the collapse hides the reason without disabling the escape hatch.
