---
"awcms-micro": patch
---

Add the missing browser UI for the already-shipped TOTP 2FA backend (epic full-online auth hardening #587-#593). No backend, migration, API, or event change — this is UI + tests + i18n + docs only; it reuses the existing `/api/v1/auth/mfa/*` endpoints, application seam, and migration 034 as-is.

**Gap 1 — self-service enrollment/management** — new `src/pages/admin/profile/security.astro` (`/admin/profile/security`), linked from `/admin/profile` only when `isMfaRequired()` (= full-online gate ∧ `AUTH_MFA_ENABLED`) is active. Not enrolled: **Enable 2FA** → `enroll/start` → shows a scannable QR **plus** the manual setup key (copy-to-clipboard) → enter code → `enroll/verify` → one-time recovery codes (copy/download, must-save warning). Enrolled: **Disable 2FA** and **Regenerate recovery codes**. Server-side gated (informational "not available" state on every offline/LAN/local deployment); no new env var.

**Gap 2 — login MFA challenge step** — `src/pages/login.astro`'s client script now handles the `401 MFA_REQUIRED` login response: it captures `mfaChallengeToken`, hides the password form, and reveals a second-step panel (`#mfa-challenge`/`#mfa-code`/`#mfa-submit`/`#mfa-error`/`#mfa-use-recovery`) with a 6-digit code input and a "use a recovery code instead" toggle, then completes login via `POST /auth/mfa/totp/verify`. The existing login DOM contract is unchanged; the panel is inert when the server never returns `MFA_REQUIRED`.

**CSP-safe QR** — new vendored, dependency-free QR generator `src/lib/ui/qr-code.ts` (byte-mode, auto version/mask; adapted from Project Nayuki's public-domain library) rendered as inline SVG — no external QR library, no remote image, no `data:` image — so the strict Content-Security-Policy is never engaged.

Adds `tests/unit/qr-code.test.ts` (structural + BCH-format-info validity of the generated symbol), `tests/e2e/mfa-browser-ux.e2e.ts` (login challenge reveal/recovery-toggle/verify wiring via request interception + enrollment gated state), en/id i18n catalogs, and the 2FA user flow in doc 08 + the identity-access README.
