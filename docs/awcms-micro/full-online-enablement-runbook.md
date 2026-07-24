# Full-Online Feature Enablement Runbook (Turnstile / 2FA / SSO / Email)

Operator runbook for switching on the full-online auth-hardening + email features on a
production deployment (reference target: dinkes-prod / Coolify, `awcms-micro.ahlikoding.com`).

**Everything here is already implemented and shipped** — Cloudflare Turnstile (Issue #588),
TOTP 2FA (#589), Google OIDC login (#590), generic tenant SSO (#591), and the Mailketing email
module (#493). On a fresh production deploy they are **dormant by design**: every one is gated
behind a two-level env switch and stays off until you supply credentials. This runbook is the
_enable + configure_ procedure, not new development.

The authoritative variable list is [`18_configuration_env_reference.md`](18_configuration_env_reference.md);
this runbook is the operational sequence + how to obtain each credential.

---

## 0. Prerequisites

1. **Browser UX must be deployed first.** The backend enforces MFA and SSO, but the login page
   needs the second-step challenge UI and the TOTP enrollment page (shipped in the 2FA-browser-UX
   work) and the SSO provider picker. Do **not** enable `AUTH_MFA_ENABLED` in production before the
   MFA challenge/enrollment UI is live, or MFA users cannot complete login in a browser.
2. **A recent DB backup.** Confirm the nightly backup ran (`~/backups/awcms-micro/backup.log`) or
   take one on demand (`~/backups/awcms-micro-backup.sh`). Enabling these features changes login
   behavior for real users.
3. **Deploy mechanics.** Env changes are applied in Coolify (app `czexbe8bm3pvta9ge7g7rfqz`) and
   require a redeploy. See [`deploy-coolify.md`](deploy-coolify.md). No DB migration is involved in
   enabling any of these (all schema already applied).

## 1. The shared gate (required for the four AUTH features)

The four auth-hardening features (Turnstile §3, TOTP 2FA §4, Google login §5, generic SSO §6) do
**not** activate until **both** of these are set:

```
AUTH_ONLINE_SECURITY_ENABLED=true
AUTH_ONLINE_SECURITY_PROFILE=full_online      # boot fails if ENABLED=true and profile != full_online
```

Each auth feature then has its own `*_ENABLED` flag ANDed on top, so you can enable them one at a
time. **Email (§7) is the exception — it is NOT behind this shared gate:** it activates on
`EMAIL_ENABLED=true` alone (plus its own provider config) and runs on any deployment profile,
including offline/LAN (`src/modules/email/module.ts`: the dispatcher is "safe to schedule regardless
of deployment profile"). `scripts/validate-env.ts` (`bun run config:validate`) enforces every
"required-when-enabled" rule at boot — a flag set to `true` without its credentials fails the
container start, so validate locally first.

## 2. Encryption keys you generate (never paste secrets into chat/tickets)

MFA and SSO encrypt secrets at rest with AES-256-GCM and need a 32-byte base64 key each. Generate
them on a trusted machine and paste **only into the Coolify secret env fields**:

```sh
openssl rand -base64 32     # -> AUTH_MFA_SECRET_ENCRYPTION_KEY
openssl rand -base64 32     # -> AUTH_SSO_CREDENTIAL_ENCRYPTION_KEY
```

These are **permanent**: rotating `AUTH_MFA_SECRET_ENCRYPTION_KEY` makes every already-enrolled TOTP
secret undecryptable (users must re-enroll); rotating the SSO key invalidates stored provider client
secrets. Set once, store in your secret manager, do not rotate casually.

## 3. Cloudflare Turnstile (bot/CAPTCHA on login/register/forgot/reset)

Obtain keys: Cloudflare dashboard → **Turnstile** → add a widget for `awcms-micro.ahlikoding.com`
→ copy the **Site Key** (public) and **Secret Key** (server-side).

```
TURNSTILE_ENABLED=true
TURNSTILE_SITE_KEY=<cloudflare site key>
TURNSTILE_SECRET_KEY=<cloudflare secret key>   # secret
# TURNSTILE_VERIFY_TIMEOUT_MS=5000             # optional, default fine
```

The login/register/forgot/reset pages render the widget automatically once `isTurnstileRequired()`
is true; the server enforces `enforceTurnstileIfRequired` before any DB work.

## 4. TOTP 2FA (Google Authenticator / any RFC-6238 app)

```
AUTH_MFA_ENABLED=true
AUTH_MFA_SECRET_ENCRYPTION_KEY=<openssl rand -base64 32>   # secret, see §2
# Defaults are fine: AUTH_MFA_TOTP_ISSUER=AWCMS-Micro, PERIOD_SEC=30, DIGITS=6,
# CHALLENGE_TTL_SEC=300, RATE_LIMIT_MAX=5, RATE_LIMIT_WINDOW_SEC=300
```

After enabling, users self-enroll from their profile security section (scan QR / enter secret →
verify a code → save recovery codes). Login then pauses password-verified sessions with
`401 MFA_REQUIRED` and completes at the challenge step. 2FA is per-user opt-in unless a tenant auth
policy sets `mfa_required`.

## 5. Google OIDC login

Obtain credentials: Google Cloud Console → **APIs & Services → Credentials** → OAuth 2.0 Client ID
(Web application). Authorized redirect URI **must** be:

```
https://awcms-micro.ahlikoding.com/api/v1/auth/providers/google/callback
```

```
AUTH_GOOGLE_LOGIN_ENABLED=true
AUTH_GOOGLE_CLIENT_ID=<google client id>
AUTH_GOOGLE_CLIENT_SECRET=<google client secret>          # secret
# AUTH_GOOGLE_ALLOWED_DOMAINS=example.com,other.com        # optional: gates auto-link-by-email ONLY
# AUTH_GOOGLE_REDIRECT_PATH=/api/v1/auth/providers/google/callback   # default, override only if reverse-proxied differently
```

The "Continue with Google" button appears on the login page once `isGoogleLoginRequired()` is true.

## 6. Generic tenant SSO (OIDC identity providers other than Google)

```
AUTH_SSO_ENABLED=true
AUTH_SSO_CREDENTIAL_ENCRYPTION_KEY=<openssl rand -base64 32>   # secret, see §2
# AUTH_SSO_DISCOVERY_TIMEOUT_MS=5000, AUTH_SSO_MAX_PROVIDERS_PER_TENANT=20  # defaults fine
```

Unlike Google, providers here are configured **per tenant at runtime** (no env credentials): a
tenant admin adds an OIDC provider via `POST /api/v1/identity/sso/providers` (needs the
`identity_access.sso_providers.*` ABAC activity) with the issuer + client id/secret; the secret is
stored encrypted with the key above. Enforcement (disable password login when `sso_required`) is a
per-tenant auth policy.

## 7. Email via Mailketing

Obtain credentials: Mailketing account → API token + account id. Then:

```
EMAIL_ENABLED=true
EMAIL_PROVIDER=mailketing
EMAIL_FROM_ADDRESS=no-reply@ahlikoding.com          # a sender you control/verified in Mailketing
EMAIL_FROM_NAME=AWCMS-Micro
EMAIL_MAILKETING_ACCOUNT_ID=<mailketing account id>
EMAIL_MAILKETING_API_TOKEN=<mailketing api token>   # secret
EMAIL_MAILKETING_API_BASE_URL=https://api.mailketing.co.id
# EMAIL_SEND_TIMEOUT_MS=10000, EMAIL_SEND_MAX_RETRIES=5   # defaults fine
```

**The queue needs a worker.** Emails are enqueued into `awcms_micro_email_messages` (transactional
outbox, ADR-0006) and only sent by the dispatcher. Add a cron on the server (like the backup cron)
that runs every 1–2 minutes:

```
*/2 * * * *  cd /path/to/app && bun run email:dispatch    # or the container-exec equivalent
```

Without this cron, password-reset and announcement emails queue but never send. Health-check the
provider with `bun run email:provider:health`. Seed per-tenant default templates with
`bun run email:templates:seed-defaults`. Currently wired producers: password reset + announcements.
(Newsletter/comments email hand-off is a documented follow-up — see the email module README.)

## 8. Apply + validate

1. Set the env vars for the features you're enabling in Coolify (secrets in secret fields).
2. `bun run config:validate` against the same values locally (or in a one-shot) to catch a missing
   required var before it fails the container boot.
3. Redeploy (mint token + deploy API, see [`deploy-coolify.md`](deploy-coolify.md)).
4. Verify on the live edge:
   - `curl -s https://awcms-micro.ahlikoding.com/login | grep -o cf-turnstile` (Turnstile rendering)
   - The Google button / SSO picker appear on `/login`.
   - `/admin/security` shows each gate's enabled+configured status.
   - Log in with a MFA-enrolled user end-to-end; send a test email and watch `email:dispatch`.

## 9. Rollback

Set the offending `*_ENABLED` back to `false` (or `AUTH_ONLINE_SECURITY_ENABLED=false` to disable
all at once) and redeploy. No schema rollback needed. Enrolled MFA factors and SSO provider rows
persist and reactivate when re-enabled (as long as the encryption keys are unchanged).

## 10. Backup layer 2 (offsite, related follow-up)

Layer 1 (nightly on-box `pg_dump` to the sdb disk) is installed. For offsite DR, enable Coolify's
native scheduled backup on the `awcms-micro` Postgres resource (`clgwm77eofuyz36vfj2jnse9`) with an
S3/R2 destination (a **private** bucket + credentials, not the public media bucket). See
[`resilience-dr-verification.md`](resilience-dr-verification.md).
