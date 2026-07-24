---
"awcms-micro": minor
---

Require step-up re-authentication to disable 2FA or regenerate recovery codes (Issue #329).

`POST /api/v1/auth/mfa/totp/disable` and `POST /api/v1/auth/mfa/recovery-codes/regenerate` previously authenticated on the session cookie alone, so a hijacked authenticated session could silently turn off a victim's second factor or invalidate its recovery codes (a documented #589-review defense-in-depth gap). Both now require a fresh proof of possession — the current TOTP `code` OR the account `password` — verified by `verifyMfaStepUp`. The TOTP path advances `last_used_step` with the same atomic compare-and-swap the login challenge uses (a step-up code is single-use, never replayable); the password path re-verifies via the timing-equalized `verifyPasswordOrDummy`. Both endpoints are now also rate-limited per source+tenant (`AUTH_MFA_RATE_LIMIT_MAX`/`_WINDOW_SEC`) and return `MFA_STEP_UP_REQUIRED` (no proof) / `MFA_STEP_UP_INVALID` (wrong proof). The self-service 2FA page (`/admin/profile/security`) now prompts for the current authenticator code before either action.

**Contract change:** these two endpoints now require a request body carrying the step-up proof; a session-only call returns `401 MFA_STEP_UP_REQUIRED`. Existing behavior is otherwise unchanged, and every non-full-online deployment (the default) is unaffected because the MFA feature gate stays off.
