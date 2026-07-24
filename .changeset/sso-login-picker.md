---
"awcms-micro": patch
---

Add the login-page provider picker for the generic tenant OIDC SSO backend (Issue #591) — closes the discovery gap where per-tenant providers configured via `awcms_micro_auth_providers` had no way to start a login from `/login`.

- **New public endpoint `GET /api/v1/auth/sso/providers?tenantId=<id>`** — lists a tenant's ENABLED SSO providers for the login page, returning ONLY `{ providerKey, displayName }` (never issuer/client id/secret/provider-type). Tenant resolved from the `X-AWCMS-Micro-Tenant-ID` header / tenant cookie / `?tenantId=` query fallback, exactly like `/auth/sso/{providerKey}/start`. Single per-source+tenant rate limit (no shared/aggregate limit — same privilege-free-DoS reasoning as `start.ts`).
- **Anti-enumeration:** an unknown tenant, an inactive/suspended tenant (even one that still has an enabled provider row), and an active tenant with no enabled providers ALL return the same empty `{ providers: [] }` via one uniform query (RLS scoping + an `EXISTS (... status = 'active')` guard); only an active tenant WITH enabled providers returns a non-empty list. When the deployment gate `isSsoRequired()` is off, it returns empty without touching the database.
- **Login-page picker** (`src/pages/login.astro`) — when `isSsoRequired()` is true, fetches the tenant's providers (debounced on the tenant field, not per keystroke) and renders one `.sso-provider-button` per provider inside `#sso-providers`, each navigating to `/api/v1/auth/sso/{providerKey}/start?tenantId=<id>`. Empty/errored → renders nothing (no "tenant not found" leak). Server-gated (inert when SSO is off), reuses the `.auth-google` secondary-button vocabulary.

New i18n key `auth.login.sso_group_label` (en/id). No migration, no module-count change, no new module.
