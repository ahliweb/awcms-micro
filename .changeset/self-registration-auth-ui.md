---
"awcms-micro": minor
---

Modernize the pre-auth screens and add admin-approval-gated self-registration.

**Shared auth surface** — new `src/styles/auth.css` (token-driven, mobile-first, transform-only card entrance so an axe contrast scan never catches text mid-animation) shared by every pre-auth screen. Login is redesigned onto it (brand mark, subtitle, password show/hide toggle, footer, secondary links) keeping its stable DOM contract, tenant picker, Turnstile, Google OIDC, and theme-init.

**Password reset UI** — the previously headless `POST /auth/password/{forgot,reset}` endpoints now have real pages: `/forgot-password` (generic, anti-enumeration notice) and `/reset-password` (token + confirm-password, generic failure). The reset link now also carries the tenant so the tenant-scoped endpoint works from an email link.

**Self-registration (opt-in, `AUTH_SELF_REGISTRATION_ENABLED`)** — public `/register` submits an **admin-approval-gated** request: it lands in the new `awcms_micro_registration_requests` table as `pending` and is **never a login-eligible identity** until an admin approves it from `/admin/registrations` (which materializes an active profile/identity/tenant_user, optionally assigning a role). `POST /api/v1/auth/register` mirrors the password-reset security posture (rate-limit, Turnstile, anti-enumeration generic response, audit records the real outcome internally, no privilege input accepted); admin `GET/approve/reject` endpoints are ABAC-guarded (`user_management.read`/`create`/`update`). Migration `093`, RLS + FORCE RLS.

**Sensitive auth URL encryption (opt-in, `AUTH_URL_PARAM_ENCRYPTION_KEY`)** — new `secure-url-params.ts` (AES-256-GCM, random IV, tamper-evident) seals the reset link's `token`+`tenant` into one opaque `?p=` param when the key is set; falls back to plain params otherwise (the token is already cryptographically random). Deliberately not applied to public SEO URLs.

OpenAPI, env reference (doc 18), api-reference, repo-inventory, work-class registry, and en/id i18n catalogs updated.
