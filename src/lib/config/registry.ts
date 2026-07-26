/**
 * Typed configuration registry (Issue #689, epic #679 platform-hardening —
 * "add typed configuration schema and remove dead environment variables").
 *
 * Single source of truth for every environment variable this application
 * reads (or historically claimed to read) — one entry per variable, with
 * enough metadata to drive three things that used to drift independently:
 *
 * 1. `.env.example` (this repo's actual example file).
 * 2. `docs/awcms-micro/18_configuration_env_reference.md` (the prose
 *    reference tables).
 * 3. `scripts/validate-env.ts` (`bun run config:validate`'s boot-time
 *    checks).
 *
 * `scripts/config-docs-check.ts` (`bun run config:docs:check`) fails CI
 * when any of the three above disagrees with this registry (modulo the
 * explicit exemption lists below) — see that script's header comment for
 * the exact three-way comparison algorithm.
 *
 * ## Design notes (deliberately additive, see Issue #689's "blast radius
 * tinggi" warning)
 *
 * - This file is **pure metadata** — it imports nothing from
 *   `scripts/validate-env.ts` or any `src/modules/*` config helper, and
 *   nothing in this repo imports actual validation *logic* from here. The
 *   ~30 `checkXxxConfig` functions already in `scripts/validate-env.ts`
 *   remain the executable, unit-tested source of truth for boot-time
 *   pass/fail behavior — this registry additionally documents which
 *   function governs which variable (`validatorGroup`, a human-readable
 *   name, not a callable reference) so the mapping is discoverable and
 *   testable without a risky circular-import refactor of already-working
 *   validation code.
 * - `required` reflects **today's actual `scripts/validate-env.ts`
 *   enforcement** (`"required"` = boot fails if empty; `"conditional"` =
 *   boot fails only when some other flag/mode is active; `"optional"` =
 *   never enforced). Deliberately NOT a 4th `"deprecated"` bucket like the
 *   issue's illustrative sketch — `deprecated` below is an ORTHOGONAL flag
 *   that can attach to a `"required"` entry. Two variables in this
 *   registry (`AUTH_JWT_SECRET`, `APP_TIMEZONE`) are simultaneously
 *   `required: "required"` (boot still fails without them, unchanged, for
 *   backward compatibility with every existing deployment's `.env`) AND
 *   `deprecated` (verified dead — see each entry's `migrationGuidance`). A
 *   single `required`-doubles-as-`deprecated` union could not express
 *   "still enforced today, but going away" without contradiction, so this
 *   registry splits the two concerns. Documented as a deliberate deviation
 *   from the issue's suggested shape in the Issue #689 implementation
 *   report.
 * - Marking something `deprecated` here never by itself changes
 *   `scripts/validate-env.ts`'s pass/fail behavior — see each entry's
 *   `migrationGuidance` for what, if anything, changed operationally
 *   (usually: nothing yet, a future major version removes the variable
 *   entirely per `removalVersion`).
 */

export type ConfigVarType =
  "string" | "boolean" | "integer" | "url" | "enum" | "path" | "csv" | "uuid";

/** Reflects current `scripts/validate-env.ts` boot-time enforcement — see file header. */
export type ConfigVarRequirement = "required" | "optional" | "conditional";

export type ConfigVarSensitivity = "secret" | "non-secret";

/**
 * Config-var *applicability* labels — which deployment scenarios a variable
 * is relevant to. NOT the same axis as the base's canonical OPERATING
 * profiles (`development`/`full_online_single_host`/`full_online_production`,
 * ADR-0027 + `src/lib/deployment/storage-profile.ts`), which are derived from
 * `APP_ENV` at runtime, not encoded here.
 *
 * `offline-lan` is retained as an applicability label for vars a DERIVED
 * application running LAN-first (e.g. a POS that adds its own offline
 * modules) would still need — mirroring the `offline-lan` capability label
 * in `ModuleDeploymentProfile`/`ExtensionManifestDeploymentProfile`. It is
 * NOT a supported operating mode of this full-online website base (ADR-0025
 * §2, ADR-0027 §Hubungan dengan label `offline-lan`).
 */
export type DeploymentProfile =
  "development" | "staging" | "production" | "offline-lan";

export type ConfigVarDeprecation = {
  /** Version this deprecation notice first shipped in (this issue). */
  since: string;
  /** Target version the variable is planned to be removed in — never the same release as `since` (compatibility window). */
  removalVersion: string;
  /** What an operator should do: what replaces it, or why it's safe to stop setting it. */
  guidance: string;
};

export type ConfigVarEntry = {
  name: string;
  type: ConfigVarType;
  required: ConfigVarRequirement;
  /** Module key (see AGENTS.md §Peta modul) or `"deployment"` for infra-only vars consumed by shell scripts/docker-compose, never by TypeScript. */
  ownerModule: string;
  sensitivity: ConfigVarSensitivity;
  profiles: readonly DeploymentProfile[];
  default?: string;
  description: string;
  /** Name of the `scripts/validate-env.ts` function that enforces this var, or `undefined` if nothing validates it (never read, or read without a shape check). */
  validatorGroup?: string;
  deprecated?: ConfigVarDeprecation;
};

const ALL_PROFILES: readonly DeploymentProfile[] = [
  "development",
  "staging",
  "production",
  "offline-lan"
];

const ONLINE_PROFILES: readonly DeploymentProfile[] = ["staging", "production"];

/**
 * Every environment variable this repository's application code (or its
 * deployment tooling) reads, is documented as reading, or historically
 * claimed to read. One entry per variable — see file header for field
 * semantics.
 */
export const CONFIG_REGISTRY: readonly ConfigVarEntry[] = [
  // ---------------------------------------------------------------------
  // Inti aplikasi
  // ---------------------------------------------------------------------
  {
    name: "APP_ENV",
    type: "enum",
    required: "required",
    ownerModule: "foundation",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "development",
    description:
      "Deployment environment (development/staging/production) — read directly by scripts/production-preflight.ts and src/middleware.ts (cookie-secure gating), and validated against KNOWN_APP_ENV_VALUES.",
    validatorGroup: "checkRequiredVars + checkAppEnvValue"
  },
  {
    name: "APP_URL",
    type: "url",
    required: "required",
    ownerModule: "foundation",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "http://localhost:4321",
    description:
      "Base URL of the application — read by src/pages/api/v1/auth/password/forgot.ts to build the password-reset link.",
    validatorGroup: "checkRequiredVars"
  },
  {
    name: "APP_TIMEZONE",
    type: "string",
    required: "required",
    ownerModule: "foundation",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "Asia/Jakarta",
    description:
      "Documented as the application-wide default timezone, and still enforced non-empty at boot for backward compatibility.",
    validatorGroup: "checkRequiredVars",
    deprecated: {
      since: "0.24.0",
      removalVersion: "1.0.0",
      guidance:
        'Verified dead (Issue #689): no code reads process.env.APP_TIMEZONE. src/lib/i18n/format.ts hardcodes `const TIMEZONE = "Asia/Jakarta"` for all date/time formatting, and per-tenant timezone comes from `awcms_micro_tenant_settings.timezone` (DB, default "Asia/Jakarta" — src/modules/tenant-admin/application/tenant-settings-directory.ts), configurable per tenant via PATCH /api/v1/settings. This env var has zero runtime effect. Still required at boot for this release only to avoid a same-release behavior change for existing .env files; a future major version will drop the boot-time requirement and then the variable itself. Operators: use the tenant Settings screen (/admin/settings) to change a tenant\'s effective timezone, not this env var.'
    }
  },
  {
    name: "APP_DEFAULT_LOCALE",
    type: "enum",
    required: "optional",
    ownerModule: "foundation",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "id",
    description:
      "Documented as the default locale — not read by any request-time code path.",
    deprecated: {
      since: "0.24.0",
      removalVersion: "1.0.0",
      guidance:
        'Verified dead (Issue #689): `grep -rln "APP_DEFAULT_LOCALE" src scripts` returns no matches. The real source of truth is src/lib/i18n/locale.ts\'s hardcoded `DEFAULT_LOCALE: SupportedLocale = "en"`, used as the final fallback in the chain cookie locale -> tenant `awcms_micro_tenants.default_locale` (DB) -> `DEFAULT_LOCALE` (`resolveLocale`, doc 18 §Presedensi). This is the exact `id` (doc/.env.example) vs `en` (runtime) mismatch called out in Issue #689\'s evidence. Operators: set a tenant\'s default locale via the tenant record / Setup Wizard (DB `default_locale` column), not this env var. Do not rely on this variable to change the platform-wide fallback locale — it never has.'
    }
  },
  {
    name: "LOG_LEVEL",
    type: "enum",
    required: "optional",
    ownerModule: "observability-logging",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "info",
    description: "debug/info/warn/error — read by src/lib/logging/logger.ts."
  },
  {
    name: "AUDIT_LOG_RETENTION_DAYS",
    type: "integer",
    required: "optional",
    ownerModule: "observability-logging",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "730",
    description:
      "Retention (days) for awcms_micro_audit_events, consumed by `bun run logs:audit:purge` (scripts/audit-log-purge.ts); `--retention-days=<n>` CLI flag overrides it."
  },
  {
    name: "FORM_DRAFT_RETENTION_DAYS",
    type: "integer",
    required: "optional",
    ownerModule: "form-drafts",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "30",
    description:
      "Retention (days) for awcms_micro_form_drafts in expired/abandoned status, consumed by `bun run form-drafts:purge` (scripts/form-draft-purge.ts); `--retention-days=<n>` CLI flag takes precedence, then this var, then the code default FORM_DRAFT_DEFAULT_RETENTION_DAYS (30)."
  },

  // ---------------------------------------------------------------------
  // Database & pool
  // ---------------------------------------------------------------------
  {
    name: "DATABASE_URL",
    type: "url",
    required: "required",
    ownerModule: "database-connectivity",
    sensitivity: "secret",
    profiles: ALL_PROFILES,
    description:
      "PostgreSQL connection string for the least-privilege `awcms_micro_app` runtime role. A privileged/superuser URL is used ad hoc (override on the command line) for `bun run db:migrate` only.",
    validatorGroup: "checkRequiredVars"
  },
  {
    name: "BOOTSTRAP_OWNER_PASSWORD",
    type: "string",
    required: "conditional",
    ownerModule: "tenant-admin",
    sensitivity: "secret",
    profiles: ALL_PROFILES,
    description:
      "Owner password used by `bun run bootstrap:default-tenant` (min 8 chars, same as the setup wizard). Read ONLY from the environment — never a CLI flag, which would expose it in the process list. Unused at runtime.",
    validatorGroup: undefined
  },
  {
    name: "AWCMS_MICRO_APP_DB_PASSWORD",
    type: "string",
    required: "optional",
    ownerModule: "deployment",
    sensitivity: "secret",
    profiles: ["staging", "production", "offline-lan"],
    default: "awcms_micro_app_password",
    description:
      "Password used by deploy/postgres/10-create-app-role.sh and docker-compose.yml to create/connect the `awcms_micro_app` role at container init — must match the password embedded in DATABASE_URL. Not read by any TypeScript code (shell/compose only)."
  },
  {
    name: "DATABASE_POOL_MAX",
    type: "integer",
    required: "optional",
    ownerModule: "database-connectivity",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "20",
    description: "Max pool connections — src/lib/database/client.ts."
  },
  {
    name: "DATABASE_STATEMENT_TIMEOUT_MS",
    type: "integer",
    required: "optional",
    ownerModule: "database-connectivity",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "15000",
    description:
      "Per-connection statement_timeout GUC — src/lib/database/client.ts."
  },
  {
    name: "DATABASE_IDLE_IN_TXN_TIMEOUT_MS",
    type: "integer",
    required: "optional",
    ownerModule: "database-connectivity",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "30000",
    description:
      "Per-connection idle_in_transaction_session_timeout GUC — Postgres reaps sessions stuck 'idle in transaction' this long; defense-in-depth against a transaction leak permanently saturating the pool (statement_timeout can't reap idle-in-txn). 0 disables. src/lib/database/client.ts."
  },
  {
    name: "DATABASE_PGBOUNCER",
    type: "boolean",
    required: "optional",
    ownerModule: "database-connectivity",
    sensitivity: "non-secret",
    profiles: ["staging", "production"],
    default: "false",
    description:
      "Disables Bun.SQL automatic prepared statements when running behind PgBouncer transaction mode — src/lib/database/client.ts."
  },
  {
    name: "WORKER_DATABASE_URL",
    type: "url",
    required: "optional",
    ownerModule: "database-connectivity",
    sensitivity: "secret",
    profiles: ["staging", "production"],
    description:
      "Connection string for the least-privilege `awcms_micro_worker` role (Issue #683) used by the 9 unattended background scripts (count corrected by Issue #743). Falls back to DATABASE_URL (src/lib/database/client.ts's getWorkerDatabaseClient) when unset."
  },
  {
    name: "SETUP_DATABASE_URL",
    type: "url",
    required: "optional",
    ownerModule: "database-connectivity",
    sensitivity: "secret",
    profiles: ["staging", "production"],
    description:
      "Connection string for the least-privilege `awcms_micro_setup` role (Issue #683) used only by POST /api/v1/setup/initialize. Falls back to DATABASE_URL (src/lib/database/client.ts's getSetupDatabaseClient) when unset."
  },
  {
    name: "AWCMS_MICRO_WORKER_DB_PASSWORD",
    type: "string",
    required: "optional",
    ownerModule: "deployment",
    sensitivity: "secret",
    profiles: ["staging", "production"],
    description:
      "Password used by deploy/postgres/11-create-worker-setup-roles.sh/docker-compose.yml to activate LOGIN on the optional `awcms_micro_worker` role. Not read by TypeScript code."
  },
  {
    name: "AWCMS_MICRO_SETUP_DB_PASSWORD",
    type: "string",
    required: "optional",
    ownerModule: "deployment",
    sensitivity: "secret",
    profiles: ["staging", "production"],
    description:
      "Password used by deploy/postgres/11-create-worker-setup-roles.sh/docker-compose.yml to activate LOGIN on the optional `awcms_micro_setup` role. Not read by TypeScript code."
  },

  // ---------------------------------------------------------------------
  // Database capacity model (Issue #743, epic #738 platform-evolution).
  // ADDITIVE block — every entry below is optional with a conservative
  // default matching the existing single-instance offline/LAN profile (see
  // src/lib/database/capacity-config.ts's DEFAULT_* constants, the single
  // source of truth these defaults must stay in sync with). Keep this block
  // append-only/self-contained: a sibling issue in the same platform-
  // evolution epic (#745, data-lifecycle) may also add entries to this
  // file — resolve any merge conflict by keeping BOTH sides' additions,
  // never picking one over the other.
  // ---------------------------------------------------------------------
  {
    name: "DATABASE_POOL_MAX_WORKER",
    type: "integer",
    required: "optional",
    ownerModule: "database-connectivity",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    description:
      "Overrides the `awcms_micro_worker` pool's max connections independently of DATABASE_POOL_MAX — src/lib/database/client.ts's resolvePoolMaxForKind. Falls back to DATABASE_POOL_MAX when unset (pre-#743 behavior)."
  },
  {
    name: "DATABASE_POOL_MAX_SETUP",
    type: "integer",
    required: "optional",
    ownerModule: "database-connectivity",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    description:
      "Overrides the `awcms_micro_setup` pool's max connections independently of DATABASE_POOL_MAX — src/lib/database/client.ts's resolvePoolMaxForKind. Falls back to DATABASE_POOL_MAX when unset (pre-#743 behavior)."
  },
  {
    name: "DATABASE_WORK_CLASS_QUEUE_MULTIPLIER",
    type: "integer",
    required: "optional",
    ownerModule: "database-connectivity",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "4",
    description:
      "Bounded FIFO queue depth per work class = its concurrency max x this multiplier (clamped to [1, 20]) — src/lib/database/work-class.ts. Once a class's queue is at that cap, a new caller is rejected immediately (WorkClassQueueFullError, 503 + Retry-After) instead of queueing further."
  },
  {
    name: "DATABASE_CAPACITY_APP_INSTANCES_MIN",
    type: "integer",
    required: "optional",
    ownerModule: "database-connectivity",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "1",
    description:
      "Minimum expected concurrently-running web/SSR (`app`) instances — src/lib/database/capacity-config.ts, used by `database:capacity:check`/production-preflight's capacity stage."
  },
  {
    name: "DATABASE_CAPACITY_APP_INSTANCES_EXPECTED",
    type: "integer",
    required: "optional",
    ownerModule: "database-connectivity",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "1",
    description:
      "Steady-state expected concurrently-running `app` instances — src/lib/database/capacity-config.ts."
  },
  {
    name: "DATABASE_CAPACITY_APP_INSTANCES_MAX",
    type: "integer",
    required: "optional",
    ownerModule: "database-connectivity",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "1",
    description:
      "Configured horizontal ceiling on concurrently-running `app` instances — the number production:preflight's database:capacity stage validates `sum(instance_count x pool_max) + reserved_headroom <= approved capacity` against."
  },
  {
    name: "DATABASE_CAPACITY_WORKER_INSTANCES_MIN",
    type: "integer",
    required: "optional",
    ownerModule: "database-connectivity",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "0",
    description:
      "Minimum expected concurrently-running `worker` processes (the 9 scripts calling getWorkerDatabaseClient) — src/lib/database/capacity-config.ts. Default 0: worker scripts are periodic CLI invocations, not always-running daemons."
  },
  {
    name: "DATABASE_CAPACITY_WORKER_INSTANCES_EXPECTED",
    type: "integer",
    required: "optional",
    ownerModule: "database-connectivity",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "1",
    description:
      "Steady-state expected concurrently-running `worker` processes — src/lib/database/capacity-config.ts."
  },
  {
    name: "DATABASE_CAPACITY_WORKER_INSTANCES_MAX",
    type: "integer",
    required: "optional",
    ownerModule: "database-connectivity",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "1",
    description:
      "Configured horizontal ceiling on concurrently-running `worker` processes (e.g. multiple cron/scheduler hosts) — src/lib/database/capacity-config.ts."
  },
  {
    name: "DATABASE_CAPACITY_SETUP_INSTANCES_MIN",
    type: "integer",
    required: "optional",
    ownerModule: "database-connectivity",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "0",
    description:
      "Minimum expected concurrent `POST /api/v1/setup/initialize` callers — src/lib/database/capacity-config.ts. Default 0: the setup wizard is not steady-state traffic."
  },
  {
    name: "DATABASE_CAPACITY_SETUP_INSTANCES_EXPECTED",
    type: "integer",
    required: "optional",
    ownerModule: "database-connectivity",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "0",
    description:
      "Steady-state expected concurrent setup-wizard callers — src/lib/database/capacity-config.ts."
  },
  {
    name: "DATABASE_CAPACITY_SETUP_INSTANCES_MAX",
    type: "integer",
    required: "optional",
    ownerModule: "database-connectivity",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "1",
    description:
      "Configured ceiling on concurrent setup-wizard callers — src/lib/database/capacity-config.ts."
  },
  {
    name: "DATABASE_CAPACITY_PGBOUNCER_MAX_CLIENT_CONN",
    type: "integer",
    required: "optional",
    ownerModule: "database-connectivity",
    sensitivity: "non-secret",
    profiles: ["staging", "production"],
    default: "200",
    description:
      "Expected `pgbouncer.ini` max_client_conn — src/lib/database/capacity-config.ts's app-side capacity check when DATABASE_PGBOUNCER=true. Must match the operator's real pgbouncer.ini (deploy/pgbouncer/pgbouncer.ini.example) for the preflight capacity check to be meaningful; only read when DATABASE_PGBOUNCER=true."
  },
  {
    name: "DATABASE_CAPACITY_PGBOUNCER_DEFAULT_POOL_SIZE",
    type: "integer",
    required: "optional",
    ownerModule: "database-connectivity",
    sensitivity: "non-secret",
    profiles: ["staging", "production"],
    default: "20",
    description:
      "Expected `pgbouncer.ini` default_pool_size — src/lib/database/capacity-config.ts's server-side (PgBouncer-to-PostgreSQL) capacity check when DATABASE_PGBOUNCER=true."
  },
  {
    name: "DATABASE_CAPACITY_APPROVED_CONNECTIONS",
    type: "integer",
    required: "optional",
    ownerModule: "database-connectivity",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "100",
    description:
      "Approved PostgreSQL (or PgBouncer-fronted PostgreSQL) connection budget for this deployment — src/lib/database/capacity-config.ts. Defaults to PostgreSQL's own documented default max_connections (100); operators on a hosted/managed Postgres with a different approved budget MUST set this to the real approved number."
  },
  {
    name: "DATABASE_CAPACITY_RESERVED_ADMIN_CONNECTIONS",
    type: "integer",
    required: "optional",
    ownerModule: "database-connectivity",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "5",
    description:
      "Connections reserved for admin/migration/backup-restore recovery, carved out of DATABASE_CAPACITY_APPROVED_CONNECTIONS and NEVER available to app/worker/setup runtime pool sizing — src/lib/database/capacity-config.ts. `bun run db:migrate` and deploy/backup/*.sh connect ad hoc against this headroom, not a named pool."
  },

  // ---------------------------------------------------------------------
  // Auth & keamanan (core)
  // ---------------------------------------------------------------------
  {
    name: "AUTH_JWT_SECRET",
    type: "string",
    required: "required",
    ownerModule: "identity-access",
    sensitivity: "secret",
    profiles: ALL_PROFILES,
    default: "change-me-in-production",
    description:
      "Documented as the session-token signing secret, still enforced non-empty at boot for backward compatibility.",
    validatorGroup: "checkRequiredVars",
    deprecated: {
      since: "0.24.0",
      removalVersion: "1.0.0",
      guidance:
        "Verified dead (Issue #689, matches the issue's own evidence): sessions are OPAQUE tokens, not JWT — src/modules/identity-access/README.md states `awcms_micro_sessions` stores only `token_hash` (raw token sent once at login). `grep -rn AUTH_JWT_SECRET src` outside scripts/validate-env.ts/tests finds zero consumers; the only real JWT verification in this repo (src/lib/auth/jwt-verify.ts, RS256 for Google/generic-OIDC ID tokens) verifies signatures against provider-published JWKS via WebCrypto — it never signs anything with this secret, and never reads it. This env var has zero runtime effect. Still required at boot for this release only to avoid a same-release behavior change; a future major version drops the boot-time requirement and then the variable itself. Nothing to migrate to — session tokens are generated with cryptographically random bytes, not derived from a shared secret."
    }
  },
  {
    name: "AUTH_SESSION_TTL_MIN",
    type: "integer",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "120",
    description: "Session lifetime (minutes) — auth/login.ts and friends."
  },
  {
    name: "AUTH_COOKIE_SECURE",
    type: "boolean",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "true",
    description:
      "Session cookie Secure flag — src/middleware.ts and every login/session-issuing route."
  },
  {
    name: "AUTH_LOGIN_MAX_ATTEMPTS",
    type: "integer",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "5",
    description: "Per-identity login lockout threshold — auth/login.ts."
  },
  {
    name: "AUTH_LOGIN_TENANT_PICKER",
    type: "boolean",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "false",
    description:
      "Render /login's tenant field as a dropdown of active tenant names instead of a manual tenant-id text input. Off by default — enabling it exposes the full active-tenant list pre-auth (tenant enumeration), acceptable for single/few-tenant deployments, an info-disclosure for multi-tenant ones — login.astro."
  },
  {
    name: "AUTH_LOGIN_RATE_LIMIT_MAX",
    type: "integer",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "20",
    description:
      "Source+tenant volumetric rate limit for POST /auth/login (Issue #437)."
  },
  {
    name: "AUTH_LOGIN_RATE_LIMIT_WINDOW_SEC",
    type: "integer",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "60",
    description: "Window (seconds) for AUTH_LOGIN_RATE_LIMIT_MAX."
  },
  {
    name: "AUTH_PASSWORD_RESET_TOKEN_TTL_MIN",
    type: "integer",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "30",
    description:
      "Password-reset token lifetime (minutes) — auth/password/forgot.ts (Issue #496)."
  },
  {
    name: "AUTH_PASSWORD_RESET_RATE_LIMIT_MAX",
    type: "integer",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "5",
    description: "Rate limit for forgot/reset password per source+tenant."
  },
  {
    name: "AUTH_PASSWORD_RESET_RATE_LIMIT_WINDOW_SEC",
    type: "integer",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "900",
    description: "Window (seconds) for AUTH_PASSWORD_RESET_RATE_LIMIT_MAX."
  },
  {
    name: "AUTH_SELF_REGISTRATION_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "false",
    description:
      "Enable the public /register page + POST /auth/register endpoint. Off by default — self-registered accounts are created as PENDING requests that an admin must approve before they can log in (never active on their own); enabling it opens a public account-request/spam surface an operator accepts per deployment — self-registration-config.ts."
  },
  {
    name: "AUTH_SELF_REGISTRATION_RATE_LIMIT_MAX",
    type: "integer",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "5",
    description: "Rate limit for POST /auth/register per source+tenant."
  },
  {
    name: "AUTH_SELF_REGISTRATION_RATE_LIMIT_WINDOW_SEC",
    type: "integer",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "900",
    description: "Window (seconds) for AUTH_SELF_REGISTRATION_RATE_LIMIT_MAX."
  },

  // ---------------------------------------------------------------------
  // Full-online auth security hardening (Issue #587-#593)
  // ---------------------------------------------------------------------
  {
    name: "AUTH_ONLINE_SECURITY_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "false",
    description:
      "Shared gate for Turnstile/MFA/Google login/SSO (Issue #587) — src/lib/auth/online-security-config.ts.",
    validatorGroup: "checkOnlineAuthSecurityConfig"
  },
  {
    name: "AUTH_ONLINE_SECURITY_PROFILE",
    type: "enum",
    required: "conditional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "disabled",
    description:
      'Must be exactly "full_online" when AUTH_ONLINE_SECURITY_ENABLED=true.',
    validatorGroup: "checkOnlineAuthSecurityConfig"
  },
  {
    name: "TURNSTILE_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "false",
    description:
      "Cloudflare Turnstile bot protection (Issue #588) — src/lib/security/turnstile.ts, src/pages/login.astro.",
    validatorGroup: "checkTurnstileConfig"
  },
  {
    name: "TURNSTILE_SITE_KEY",
    type: "string",
    required: "conditional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    description:
      "Public Turnstile site key, rendered in the login widget (src/pages/login.astro) — required when TURNSTILE_ENABLED=true.",
    validatorGroup: "checkTurnstileConfig"
  },
  {
    name: "TURNSTILE_SECRET_KEY",
    type: "string",
    required: "conditional",
    ownerModule: "identity-access",
    sensitivity: "secret",
    profiles: ONLINE_PROFILES,
    description:
      "Server-side Turnstile verification secret — required when TURNSTILE_ENABLED=true.",
    validatorGroup: "checkTurnstileConfig"
  },
  {
    name: "TURNSTILE_VERIFY_TIMEOUT_MS",
    type: "integer",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "5000",
    description: "Timeout (ms) for the Cloudflare siteverify call."
  },
  {
    name: "AUTH_MFA_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "false",
    description: "MFA/TOTP login challenge (Issue #589).",
    validatorGroup: "checkMfaConfig"
  },
  {
    name: "AUTH_MFA_SECRET_ENCRYPTION_KEY",
    type: "string",
    required: "conditional",
    ownerModule: "identity-access",
    sensitivity: "secret",
    profiles: ONLINE_PROFILES,
    description:
      "Base64-encoded 32-byte AES-256-GCM key encrypting TOTP secrets at rest — required when AUTH_MFA_ENABLED=true.",
    validatorGroup: "checkMfaConfig"
  },
  {
    name: "AUTH_MFA_TOTP_ISSUER",
    type: "string",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "AWCMS-Micro",
    description: "Issuer name shown in the authenticator app."
  },
  {
    name: "AUTH_MFA_TOTP_PERIOD_SEC",
    type: "integer",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "30",
    description: "TOTP time-step length (seconds)."
  },
  {
    name: "AUTH_MFA_TOTP_DIGITS",
    type: "integer",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "6",
    description: "TOTP code digit count (6 or 8)."
  },
  {
    name: "AUTH_MFA_CHALLENGE_TTL_SEC",
    type: "integer",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "300",
    description: "MFA login challenge lifetime (seconds)."
  },
  {
    name: "AUTH_MFA_RATE_LIMIT_MAX",
    type: "integer",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "5",
    description: "Rate limit for POST /auth/mfa/totp/verify per source+tenant."
  },
  {
    name: "AUTH_MFA_RATE_LIMIT_WINDOW_SEC",
    type: "integer",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "300",
    description: "Window (seconds) for AUTH_MFA_RATE_LIMIT_MAX."
  },
  {
    name: "AUTH_GOOGLE_LOGIN_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "false",
    description: "Google OIDC login (Issue #590).",
    validatorGroup: "checkGoogleOidcConfig"
  },
  {
    name: "AUTH_GOOGLE_CLIENT_ID",
    type: "string",
    required: "conditional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    description:
      "Google OAuth client ID — required when AUTH_GOOGLE_LOGIN_ENABLED=true.",
    validatorGroup: "checkGoogleOidcConfig"
  },
  {
    name: "AUTH_GOOGLE_CLIENT_SECRET",
    type: "string",
    required: "conditional",
    ownerModule: "identity-access",
    sensitivity: "secret",
    profiles: ONLINE_PROFILES,
    description:
      "Google OAuth client secret — required when AUTH_GOOGLE_LOGIN_ENABLED=true.",
    validatorGroup: "checkGoogleOidcConfig"
  },
  {
    name: "AUTH_GOOGLE_ALLOWED_DOMAINS",
    type: "csv",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    description:
      "Comma-separated email domains allowed to auto-link by email; empty = auto-link always denied (fail-closed)."
  },
  {
    name: "AUTH_GOOGLE_REDIRECT_PATH",
    type: "path",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "/api/v1/auth/providers/google/callback",
    description: "OAuth callback path under APP_URL."
  },
  {
    name: "AUTH_SSO_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "false",
    description: "Generic tenant OIDC SSO (Issue #591).",
    validatorGroup: "checkSsoConfig"
  },
  {
    name: "AUTH_SSO_CREDENTIAL_ENCRYPTION_KEY",
    type: "string",
    required: "conditional",
    ownerModule: "identity-access",
    sensitivity: "secret",
    profiles: ONLINE_PROFILES,
    description:
      "Base64-encoded 32-byte AES-256-GCM key encrypting tenant SSO provider client secrets at rest — required when AUTH_SSO_ENABLED=true; must differ from AUTH_MFA_SECRET_ENCRYPTION_KEY.",
    validatorGroup: "checkSsoConfig"
  },
  {
    name: "AUTH_URL_PARAM_ENCRYPTION_KEY",
    type: "string",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "secret",
    profiles: ALL_PROFILES,
    description:
      "Base64-encoded 32-byte AES-256-GCM key that seals sensitive auth URL query params (e.g. the password-reset link's token+tenant) into one opaque token. Optional hardening — when unset those links fall back to plain params (the underlying token is already cryptographically random); when set the params are encrypted + tamper-evident. NOT applied to public SEO URLs — secure-url-params.ts."
  },
  {
    name: "AUTH_SSO_DISCOVERY_TIMEOUT_MS",
    type: "integer",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "5000",
    description: "Timeout (ms) for OIDC discovery/JWKS/token-exchange calls."
  },
  {
    name: "AUTH_SSO_MAX_PROVIDERS_PER_TENANT",
    type: "integer",
    required: "optional",
    ownerModule: "identity-access",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "20",
    description:
      "Caps active SSO provider rows per tenant (Issue #612), bounding per-tenant probing budget."
  },

  // ---------------------------------------------------------------------
  // Sync & node
  // ---------------------------------------------------------------------
  {
    name: "AWCMS_MICRO_NODE_ID",
    type: "string",
    required: "optional",
    ownerModule: "sync-storage",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "local-dev-node",
    description:
      'Documented as "node identity" — not read by any application code.',
    deprecated: {
      since: "0.24.0",
      removalVersion: "1.0.0",
      guidance:
        'Verified dead (Issue #689): `grep -rn AWCMS_MICRO_NODE_ID` across src/scripts finds zero consumers. Node identity is resolved from the database (`awcms_micro_sync_nodes`, node_code header/registration), not from this env var — see src/modules/sync-storage/application/sync-auth.ts\'s resolveOrRegisterSyncNode. Was already never enforced required by scripts/validate-env.ts (documented as "Wajib" in doc 18 but absent from REQUIRED_NON_EMPTY_VARS), so removing it changes nothing operationally. Operators: nothing to migrate — remove this line from .env whenever convenient.'
    }
  },
  {
    name: "AWCMS_MICRO_SYNC_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "sync-storage",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "false",
    description:
      "Enables hybrid sync — src/modules/sync-storage/application/sync-auth.ts.",
    validatorGroup: "checkSyncConfig"
  },
  {
    name: "AWCMS_MICRO_SYNC_HMAC_SECRET",
    type: "string",
    required: "conditional",
    ownerModule: "sync-storage",
    sensitivity: "secret",
    profiles: ALL_PROFILES,
    default: "change-me",
    description:
      "HMAC signing secret for sync requests — required (and must differ from the documented placeholder) when AWCMS_MICRO_SYNC_ENABLED=true.",
    validatorGroup: "checkSyncConfig"
  },
  {
    name: "AWCMS_MICRO_SYNC_MAX_SKEW_SEC",
    type: "integer",
    required: "optional",
    ownerModule: "sync-storage",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "300",
    description: "Anti-replay clock-skew tolerance (seconds)."
  },

  // ---------------------------------------------------------------------
  // Storage
  // ---------------------------------------------------------------------
  {
    name: "STORAGE_DRIVER",
    type: "enum",
    required: "optional",
    ownerModule: "sync-storage",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "local",
    description:
      "Documented as local/r2 storage driver selector — not actually branched on anywhere.",
    deprecated: {
      since: "0.24.0",
      removalVersion: "1.0.0",
      guidance:
        "Verified dead (Issue #689): `grep -rn STORAGE_DRIVER src scripts` only finds comments referencing the name, never `process.env.STORAGE_DRIVER`. The actual switch between local-only and R2 upload behavior is R2_ENABLED (src/modules/sync-storage/infrastructure/object-storage-uploader.ts's resolveObjectUploader, keyed off the object-sync queue row's own requires_upload flag, itself set from R2_ENABLED at enqueue time — src/pages/api/v1/sync/objects/index.ts). Operators: use R2_ENABLED=true/false; this variable has no effect regardless of its value."
    }
  },
  {
    name: "LOCAL_STORAGE_PATH",
    type: "path",
    required: "optional",
    ownerModule: "sync-storage",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "./storage",
    description: "Documented as the local file storage path — never read.",
    deprecated: {
      since: "0.24.0",
      removalVersion: "1.0.0",
      guidance:
        "Verified dead (Issue #689): `grep -rn LOCAL_STORAGE_PATH src scripts` finds zero reads (only comments/test fixtures asserting the news-portal R2-only preset never references it). No code path writes to this path today. Operators: nothing to migrate — remove this line from .env whenever convenient."
    }
  },
  {
    name: "OBJECT_SYNC_UPLOAD_TIMEOUT_MS",
    type: "integer",
    required: "optional",
    ownerModule: "sync-storage",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "10000",
    description:
      "Per-attempt timeout (ms) for the object-sync dispatcher (Issue #436)."
  },
  {
    name: "AWCMS_MICRO_R2_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "sync-storage",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "false",
    description:
      "Enables Cloudflare R2 for the sync object queue. Renamed from the legacy `R2_ENABLED` (still read as a fallback during the migration window — object-storage-uploader.ts / sync/objects). Prefix unified under `awcms-micro`.",
    validatorGroup: "checkR2Config"
  },
  {
    name: "AWCMS_MICRO_R2_ACCOUNT_ID",
    type: "string",
    required: "conditional",
    ownerModule: "sync-storage",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    description:
      "Cloudflare R2 account id — required when AWCMS_MICRO_R2_ENABLED=true. An account identifier, not a credential by itself (AWCMS_MICRO_R2_ACCESS_KEY_ID/AWCMS_MICRO_R2_SECRET_ACCESS_KEY are the actual secrets). Renamed from legacy `R2_ACCOUNT_ID` (read as fallback during migration).",
    validatorGroup: "checkR2Config"
  },
  {
    name: "AWCMS_MICRO_R2_ACCESS_KEY_ID",
    type: "string",
    required: "conditional",
    ownerModule: "sync-storage",
    sensitivity: "secret",
    profiles: ALL_PROFILES,
    description:
      "R2 credential — required when AWCMS_MICRO_R2_ENABLED=true. Renamed from legacy `R2_ACCESS_KEY_ID` (read as fallback during migration).",
    validatorGroup: "checkR2Config"
  },
  {
    name: "AWCMS_MICRO_R2_SECRET_ACCESS_KEY",
    type: "string",
    required: "conditional",
    ownerModule: "sync-storage",
    sensitivity: "secret",
    profiles: ALL_PROFILES,
    description:
      "R2 credential — required when AWCMS_MICRO_R2_ENABLED=true. Renamed from legacy `R2_SECRET_ACCESS_KEY` (read as fallback during migration).",
    validatorGroup: "checkR2Config"
  },
  {
    name: "AWCMS_MICRO_R2_BUCKET",
    type: "string",
    required: "conditional",
    ownerModule: "sync-storage",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    description:
      "R2 bucket name (private object queue) — required when AWCMS_MICRO_R2_ENABLED=true; must differ from NEWS_MEDIA_R2_BUCKET. Convention: prefix `awcms-micro-` (e.g. `awcms-micro-objects`). Renamed from legacy `R2_BUCKET` (read as fallback during migration).",
    validatorGroup: "checkR2Config"
  },

  // ---------------------------------------------------------------------
  // Email (base — Issue #493-#495)
  // ---------------------------------------------------------------------
  {
    name: "EMAIL_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "email",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "false",
    description: "Master switch for the generic email module.",
    validatorGroup: "checkEmailConfig"
  },
  {
    name: "EMAIL_PROVIDER",
    type: "enum",
    required: "conditional",
    ownerModule: "email",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    description: '"mailketing" or "log" — required when EMAIL_ENABLED=true.',
    validatorGroup: "checkEmailConfig"
  },
  {
    name: "EMAIL_FROM_ADDRESS",
    type: "string",
    required: "conditional",
    ownerModule: "email",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    description: "Default sender address — required when EMAIL_ENABLED=true.",
    validatorGroup: "checkEmailConfig"
  },
  {
    name: "EMAIL_FROM_NAME",
    type: "string",
    required: "optional",
    ownerModule: "email",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "AWCMS-Micro",
    description: "Default sender display name."
  },
  {
    name: "EMAIL_SEND_TIMEOUT_MS",
    type: "integer",
    required: "optional",
    ownerModule: "email",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "10000",
    description: "Timeout (ms) for one send attempt (dispatcher)."
  },
  {
    name: "EMAIL_SEND_MAX_RETRIES",
    type: "integer",
    required: "optional",
    ownerModule: "email",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "5",
    description: "Retry budget before marking an email `failed`."
  },
  {
    name: "EMAIL_MAILKETING_ACCOUNT_ID",
    type: "string",
    required: "conditional",
    ownerModule: "email",
    sensitivity: "secret",
    profiles: ALL_PROFILES,
    description:
      "Mailketing account id — required when EMAIL_PROVIDER=mailketing.",
    validatorGroup: "checkEmailConfig"
  },
  {
    name: "EMAIL_MAILKETING_API_TOKEN",
    type: "string",
    required: "conditional",
    ownerModule: "email",
    sensitivity: "secret",
    profiles: ALL_PROFILES,
    description:
      "Mailketing API token — required when EMAIL_PROVIDER=mailketing.",
    validatorGroup: "checkEmailConfig"
  },
  {
    name: "EMAIL_MAILKETING_API_BASE_URL",
    type: "url",
    required: "conditional",
    ownerModule: "email",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    description:
      "Mailketing API base URL — required when EMAIL_PROVIDER=mailketing.",
    validatorGroup: "checkEmailConfig"
  },

  // ---------------------------------------------------------------------
  // Public tenant routing (Issue #556, epic #555)
  // ---------------------------------------------------------------------
  {
    name: "PUBLIC_TENANT_RESOLUTION_MODE",
    type: "enum",
    required: "optional",
    ownerModule: "tenant-domain",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    description:
      "host_default/env_default/setup_default/tenant_code_legacy — unset keeps the legacy /blog/{tenantCode} behavior (offline/LAN default).",
    validatorGroup: "checkPublicRoutingConfig"
  },
  {
    name: "PUBLIC_DEFAULT_TENANT_ID",
    type: "uuid",
    required: "conditional",
    ownerModule: "tenant-domain",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    description:
      "Default tenant UUID for mode=env_default (one of ID/CODE required)."
  },
  {
    name: "PUBLIC_DEFAULT_TENANT_CODE",
    type: "string",
    required: "conditional",
    ownerModule: "tenant-domain",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    description:
      "Default tenant code for mode=env_default (one of ID/CODE required)."
  },
  {
    name: "PUBLIC_CANONICAL_BASE_PATH",
    type: "path",
    required: "optional",
    ownerModule: "tenant-domain",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "/news",
    description:
      "Public base path for /news — must be an absolute path when set.",
    validatorGroup: "checkPublicRoutingConfig"
  },
  {
    name: "PUBLIC_TRUST_PROXY",
    type: "boolean",
    required: "optional",
    ownerModule: "tenant-domain",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "false",
    description:
      "Trust X-Forwarded-Host — only safe true behind a trusted reverse proxy that overwrites the header."
  },
  {
    name: "PUBLIC_PLATFORM_ROOT_DOMAIN",
    type: "string",
    required: "conditional",
    ownerModule: "tenant-domain",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    description:
      "Root domain for the host-based resolver — required when mode=host_default.",
    validatorGroup: "checkPublicRoutingConfig"
  },

  // ---------------------------------------------------------------------
  // Cloudflare DNS adapter (Issue #567)
  // ---------------------------------------------------------------------
  {
    name: "TENANT_DOMAIN_DNS_PROVIDER",
    type: "enum",
    required: "optional",
    ownerModule: "tenant-domain",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "manual",
    description: "manual (default) or cloudflare.",
    validatorGroup: "checkTenantDomainDnsConfig"
  },
  {
    name: "TENANT_DOMAIN_PLATFORM_ROOT_DOMAIN",
    type: "string",
    required: "conditional",
    ownerModule: "tenant-domain",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    description:
      "Root domain the Cloudflare adapter may manage records under — required when TENANT_DOMAIN_DNS_PROVIDER=cloudflare. Deliberately separate from PUBLIC_PLATFORM_ROOT_DOMAIN (see doc 18).",
    validatorGroup: "checkTenantDomainDnsConfig"
  },
  {
    name: "TENANT_DOMAIN_CLOUDFLARE_ZONE_ID",
    type: "string",
    required: "conditional",
    ownerModule: "tenant-domain",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    description: "Cloudflare zone id — required when provider=cloudflare.",
    validatorGroup: "checkTenantDomainDnsConfig"
  },
  {
    name: "TENANT_DOMAIN_CLOUDFLARE_API_TOKEN",
    type: "string",
    required: "conditional",
    ownerModule: "tenant-domain",
    sensitivity: "secret",
    profiles: ONLINE_PROFILES,
    description: "Cloudflare API token — required when provider=cloudflare.",
    validatorGroup: "checkTenantDomainDnsConfig"
  },
  {
    name: "TENANT_DOMAIN_CLOUDFLARE_TIMEOUT_MS",
    type: "integer",
    required: "optional",
    ownerModule: "tenant-domain",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "8000",
    description: "Per-call timeout (ms) for the Cloudflare adapter."
  },

  // ---------------------------------------------------------------------
  // Visitor analytics (Issue #617-#624)
  // ---------------------------------------------------------------------
  {
    name: "VISITOR_ANALYTICS_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "visitor-analytics",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "false",
    description:
      "Master switch for visitor telemetry collection. Default-off since Issue #624 (2026-07-11 audit) — new installs collect nothing until explicitly enabled."
  },
  {
    name: "VISITOR_ANALYTICS_MODE",
    type: "enum",
    required: "optional",
    ownerModule: "visitor-analytics",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "basic",
    description: "basic/detailed.",
    validatorGroup: "checkVisitorAnalyticsConfig"
  },
  {
    name: "VISITOR_ANALYTICS_COLLECT_ADMIN",
    type: "boolean",
    required: "optional",
    ownerModule: "visitor-analytics",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "true",
    description: "Collect telemetry on /admin/* routes."
  },
  {
    name: "VISITOR_ANALYTICS_COLLECT_PUBLIC",
    type: "boolean",
    required: "optional",
    ownerModule: "visitor-analytics",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "true",
    description: "Collect telemetry on public routes."
  },
  {
    name: "VISITOR_ANALYTICS_COLLECT_API",
    type: "boolean",
    required: "optional",
    ownerModule: "visitor-analytics",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "false",
    description: "Collect telemetry on /api/v1/* calls."
  },
  {
    name: "VISITOR_ANALYTICS_DETAILED_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "visitor-analytics",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "false",
    description: "Reserve for detailed-mode session/event granularity."
  },
  {
    name: "VISITOR_ANALYTICS_RAW_IP_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "visitor-analytics",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "false",
    description: "Store raw IP addresses — default off (privacy-first)."
  },
  {
    name: "VISITOR_ANALYTICS_RAW_USER_AGENT_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "visitor-analytics",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "false",
    description:
      "Reserved — no raw user-agent column exists yet (migration 039 only stores a hash); currently a no-op."
  },
  {
    name: "VISITOR_ANALYTICS_GEO_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "visitor-analytics",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "false",
    description: "Enable geolocation enrichment (Issue #623)."
  },
  {
    name: "VISITOR_ANALYTICS_TRUST_PROXY",
    type: "boolean",
    required: "optional",
    ownerModule: "visitor-analytics",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "false",
    description:
      "Trust X-Forwarded-For — only safe true behind a trusted reverse proxy."
  },
  {
    name: "VISITOR_ANALYTICS_TRUST_CLOUDFLARE",
    type: "boolean",
    required: "optional",
    ownerModule: "visitor-analytics",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "false",
    description:
      "Trust CF-Connecting-IP/CF-IPCountry — only safe true when the origin is firewalled to Cloudflare's edge only."
  },
  {
    name: "VISITOR_ANALYTICS_ONLINE_WINDOW_SECONDS",
    type: "integer",
    required: "optional",
    ownerModule: "visitor-analytics",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "300",
    description: '"Online now" window.',
    validatorGroup: "checkVisitorAnalyticsConfig"
  },
  {
    name: "VISITOR_ANALYTICS_EVENT_RETENTION_DAYS",
    type: "integer",
    required: "optional",
    ownerModule: "visitor-analytics",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "90",
    description: "Event retention (days).",
    validatorGroup: "checkVisitorAnalyticsConfig"
  },
  {
    name: "VISITOR_ANALYTICS_RAW_DETAIL_RETENTION_DAYS",
    type: "integer",
    required: "optional",
    ownerModule: "visitor-analytics",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "30",
    description: "Raw detail retention (days).",
    validatorGroup: "checkVisitorAnalyticsConfig"
  },
  {
    name: "VISITOR_ANALYTICS_ROLLUP_RETENTION_DAYS",
    type: "integer",
    required: "optional",
    ownerModule: "visitor-analytics",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "730",
    description: "Rollup aggregate retention (days).",
    validatorGroup: "checkVisitorAnalyticsConfig"
  },
  {
    name: "VISITOR_ANALYTICS_HASH_SALT",
    type: "string",
    required: "optional",
    ownerModule: "visitor-analytics",
    sensitivity: "secret",
    profiles: ALL_PROFILES,
    default: "",
    description: "Salt for pseudonymous visitor fingerprinting (Issue #619)."
  },
  {
    name: "VISITOR_ANALYTICS_VISITOR_KEY_COOKIE_TTL_DAYS",
    type: "integer",
    required: "optional",
    ownerModule: "visitor-analytics",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "30",
    description:
      "Anonymous visitor-key cookie lifetime (days). Issue #624 audit addendum — replaces a previous hardcoded ~2-year lifetime with a short, configurable one.",
    validatorGroup: "checkVisitorAnalyticsConfig"
  },

  // ---------------------------------------------------------------------
  // News portal — full-online R2-only preset (Issue #632)
  // ---------------------------------------------------------------------
  {
    name: "NEWS_PORTAL_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "news-portal",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "false",
    description: "Master switch for the news_portal_full_online_r2 preset."
  },
  {
    name: "NEWS_PORTAL_PROFILE",
    type: "enum",
    required: "conditional",
    ownerModule: "news-portal",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    description: 'Must be "full_online_r2" when NEWS_PORTAL_ENABLED=true.',
    validatorGroup: "checkNewsPortalProfileConfig"
  },
  {
    name: "NEWS_MEDIA_R2_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "news-portal",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "false",
    description: "Master switch for R2-only news media storage.",
    validatorGroup: "checkNewsMediaR2Config"
  },
  {
    name: "NEWS_MEDIA_R2_ACCOUNT_ID",
    type: "string",
    required: "conditional",
    ownerModule: "news-portal",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    description:
      "May equal R2_ACCOUNT_ID (same Cloudflare account) or differ — required when NEWS_MEDIA_R2_ENABLED=true.",
    validatorGroup: "checkNewsMediaR2Config"
  },
  {
    name: "NEWS_MEDIA_R2_ACCESS_KEY_ID",
    type: "string",
    required: "conditional",
    ownerModule: "news-portal",
    sensitivity: "secret",
    profiles: ONLINE_PROFILES,
    description:
      "Must differ from R2_ACCESS_KEY_ID — enforced by config:validate/security:readiness.",
    validatorGroup:
      "checkNewsMediaR2Config + checkNewsMediaR2SeparationFromSyncR2"
  },
  {
    name: "NEWS_MEDIA_R2_SECRET_ACCESS_KEY",
    type: "string",
    required: "conditional",
    ownerModule: "news-portal",
    sensitivity: "secret",
    profiles: ONLINE_PROFILES,
    description:
      "Must differ from R2_SECRET_ACCESS_KEY — enforced by config:validate/security:readiness.",
    validatorGroup:
      "checkNewsMediaR2Config + checkNewsMediaR2SeparationFromSyncR2"
  },
  {
    name: "NEWS_MEDIA_R2_BUCKET",
    type: "string",
    required: "conditional",
    ownerModule: "news-portal",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    description:
      "Must differ from R2_BUCKET — enforced by config:validate/security:readiness.",
    validatorGroup:
      "checkNewsMediaR2Config + checkNewsMediaR2SeparationFromSyncR2"
  },
  {
    name: "NEWS_MEDIA_R2_PUBLIC_BASE_URL",
    type: "url",
    required: "conditional",
    ownerModule: "news-portal",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    description:
      "Absolute HTTPS custom domain — required when NEWS_MEDIA_R2_ENABLED=true; must not be *.r2.dev/localhost/127.0.0.1 when APP_ENV=production (Issue #635).",
    validatorGroup: "checkNewsMediaR2Config"
  },
  {
    name: "NEWS_MEDIA_R2_PRESIGNED_UPLOAD_TTL_SECONDS",
    type: "integer",
    required: "optional",
    ownerModule: "news-portal",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "300",
    description:
      "Presigned PUT upload TTL — maximum 3600 seconds (Issue #635).",
    validatorGroup: "checkNewsMediaR2PresignedTtlUpperBound"
  },
  {
    name: "NEWS_MEDIA_R2_MAX_UPLOAD_BYTES",
    type: "integer",
    required: "optional",
    ownerModule: "news-portal",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "10485760",
    description: "Per-file upload size limit (bytes)."
  },
  {
    name: "NEWS_MEDIA_R2_ALLOWED_MIME_TYPES",
    type: "csv",
    required: "optional",
    ownerModule: "news-portal",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "image/jpeg,image/png,image/webp,image/gif",
    description:
      "MIME allow-list — every entry must be a type the sniffer can recognize (Issue #635).",
    validatorGroup: "checkNewsMediaR2AllowedMimeTypesKnown"
  },
  {
    name: "NEWS_MEDIA_R2_PENDING_TTL_MINUTES",
    type: "integer",
    required: "optional",
    ownerModule: "news-portal",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "60",
    description:
      "Age threshold for stale pending_upload objects, reported by security:readiness."
  },
  {
    name: "NEWS_MEDIA_R2_ORPHAN_GRACE_DAYS",
    type: "integer",
    required: "optional",
    ownerModule: "news-portal",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "30",
    description:
      "Grace period (days) before bun run news-media:reconcile (Issue #690) physically deletes a grace-period-expired orphaned media object's R2 object + soft-deletes its metadata row. Minimum 30 days (r2-backup-lifecycle.md §3), enforced by config:validate."
  },
  {
    name: "NEWS_MEDIA_R2_IMAGE_RESIZING_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "news-portal",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "false",
    description:
      "Opt-in: emit responsive srcset URLs via Cloudflare on-the-fly image resizing (/cdn-cgi/image/...), ADR-0026 step 5b. Only works when NEWS_MEDIA_R2_PUBLIC_BASE_URL is a real custom domain on the Cloudflare zone with Image Resizing enabled; security:readiness (checkNewsMediaR2ImageResizingSafe) warns when the base URL cannot serve it."
  },

  // ---------------------------------------------------------------------
  // News portal — public social share buttons (Issue #642)
  // ---------------------------------------------------------------------
  {
    name: "NEWS_SHARE_BUTTONS_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "news-portal",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "true",
    description:
      "Master switch for the public share widget (native share/copy-link/WhatsApp/Telegram/Facebook/LinkedIn/X/email) on /news and /blog/{tenantCode} article pages — src/modules/blog-content/domain/social-share-links.ts."
  },
  {
    name: "NEWS_SHARE_NATIVE_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "news-portal",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "true",
    description:
      "Renders the native Web Share API button (navigator.share, revealed by public/js/news-share.js only in a secure context when supported)."
  },
  {
    name: "NEWS_SHARE_WHATSAPP_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "news-portal",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "true",
    description: "Renders the WhatsApp (wa.me) share link."
  },
  {
    name: "NEWS_SHARE_TELEGRAM_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "news-portal",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "true",
    description: "Renders the Telegram (t.me/share) share link."
  },
  {
    name: "NEWS_SHARE_FACEBOOK_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "news-portal",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "true",
    description: "Renders the Facebook Share Dialog link."
  },
  {
    name: "NEWS_SHARE_LINKEDIN_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "news-portal",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "true",
    description: "Renders the LinkedIn share-offsite link."
  },
  {
    name: "NEWS_SHARE_X_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "news-portal",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "true",
    description: "Renders the X/Twitter intent/tweet share link."
  },
  {
    name: "NEWS_SHARE_EMAIL_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "news-portal",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "true",
    description: "Renders the mailto: email share link."
  },
  {
    name: "NEWS_SHARE_INSTAGRAM_NATIVE_ONLY",
    type: "boolean",
    required: "optional",
    ownerModule: "news-portal",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "true",
    description:
      "There is no supported Instagram web-share intent URL, so this never renders a dedicated Instagram button — it only toggles a short text note clarifying that Instagram sharing goes through native share (when NEWS_SHARE_NATIVE_ENABLED=true) or copy-link, never a fake Instagram URL."
  },

  // ---------------------------------------------------------------------
  // Social publishing — provider-neutral auto-posting outbox foundation
  // (Issue #643, epic `social_publishing` #643-#647)
  // ---------------------------------------------------------------------
  {
    name: "SOCIAL_PUBLISHING_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "social-publishing",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "false",
    description:
      "Full-online-only master switch for the social publishing outbox/dispatcher (Issue #643) — src/modules/social-publishing/domain/social-publishing-config.ts.",
    validatorGroup: "checkSocialPublishingProfileConfig"
  },
  {
    name: "SOCIAL_PUBLISHING_PROFILE",
    type: "enum",
    required: "conditional",
    ownerModule: "social-publishing",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "disabled",
    description:
      'Must be exactly "full_online" when SOCIAL_PUBLISHING_ENABLED=true.',
    validatorGroup: "checkSocialPublishingProfileConfig"
  },

  // ---------------------------------------------------------------------
  // Social publishing — Meta (Facebook Page + Instagram Business) adapter
  // (Issue #644, epic `social_publishing` #643-#647)
  // ---------------------------------------------------------------------
  {
    name: "META_PROVIDER_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "social-publishing",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "false",
    description:
      "Adapter-level switch for the Meta (Facebook Page + Instagram Business) provider — independent of SOCIAL_PUBLISHING_ENABLED (a deployment can run social publishing with only a different provider configured). src/modules/social-publishing/domain/meta-provider-config.ts.",
    validatorGroup: "checkMetaSocialPublishingProviderConfig"
  },
  {
    name: "META_APP_ID",
    type: "string",
    required: "conditional",
    ownerModule: "social-publishing",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    description:
      "Meta App ID (developers.facebook.com) — required when META_PROVIDER_ENABLED=true. Not a credential by itself (public, used in appAccessToken construction alongside the app secret).",
    validatorGroup: "checkMetaSocialPublishingProviderConfig"
  },
  {
    name: "META_APP_SECRET_REFERENCE",
    type: "string",
    required: "conditional",
    ownerModule: "social-publishing",
    sensitivity: "secret",
    profiles: ONLINE_PROFILES,
    description:
      "Opaque reference into external secret storage for the Meta App Secret — required when META_PROVIDER_ENABLED=true. NEVER the raw app secret (rejected by checkMetaSocialPublishingProviderConfig if it looks like one — reuses social-account-validation.ts's looksLikeRawSecretToken, the same heuristic that protects awcms_micro_social_accounts.token_reference). Resolved to a real value the same way an account's token_reference is (meta-token-reference-resolver.ts) — only the \"env:VAR_NAME\" scheme is concretely supported today (no real secret-manager integration in this repo yet).",
    validatorGroup: "checkMetaSocialPublishingProviderConfig"
  },
  {
    name: "META_GRAPH_API_VERSION",
    type: "string",
    required: "conditional",
    ownerModule: "social-publishing",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "v21.0",
    description:
      "Graph API version this adapter targets (e.g. \"v21.0\") — required when META_PROVIDER_ENABLED=true. Operator responsibility to keep current with Meta's own deprecation schedule; only shape-validated here (^v\\d{1,2}\\.\\d{1,2}$), never checked against Meta's actually-supported versions.",
    validatorGroup: "checkMetaSocialPublishingProviderConfig"
  },
  {
    name: "META_OAUTH_REDIRECT_URI",
    type: "url",
    required: "conditional",
    ownerModule: "social-publishing",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    description:
      "Absolute HTTPS OAuth redirect URI registered in the Meta App dashboard — required when META_PROVIDER_ENABLED=true. Documented for app-review/Meta-dashboard configuration purposes; this issue ships no live OAuth authorization-code exchange route (accounts are connected via the existing generic POST /api/v1/social-publishing/accounts admin form, same as every other provider in this foundation) — see docs/awcms-micro/18_configuration_env_reference.md's Social publishing section.",
    validatorGroup: "checkMetaSocialPublishingProviderConfig"
  },
  {
    name: "META_REQUIRED_SCOPES",
    type: "csv",
    required: "conditional",
    ownerModule: "social-publishing",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default:
      "pages_manage_posts,pages_read_engagement,instagram_content_publish",
    description:
      "Comma-separated least-privilege Meta permission scopes this deployment requires a connected account's token to carry — required when META_PROVIDER_ENABLED=true. Enforced two ways: checkMetaSocialPublishingProviderConfig validates the list is non-empty/well-formed at boot, and the live 'verify connection' admin action (POST /api/v1/social-publishing/accounts/{id}/verify) compares this list against Meta's own debug_token response for a specific connected account.",
    validatorGroup: "checkMetaSocialPublishingProviderConfig"
  },

  // ---------------------------------------------------------------------
  // Social publishing — LinkedIn organization-page adapter (Issue #645,
  // epic `social_publishing` #643-#647). Independent of
  // SOCIAL_PUBLISHING_ENABLED/_PROFILE above — a deployment can run the
  // outbox without ever enabling LinkedIn specifically.
  // ---------------------------------------------------------------------
  {
    name: "LINKEDIN_PROVIDER_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "social-publishing",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "false",
    description:
      "Registers the LinkedIn organization-page provider adapter (Issue #645) into social-provider-registry.ts. No LinkedIn HTTP call happens when false.",
    validatorGroup: "checkLinkedInProviderConfig"
  },
  {
    name: "LINKEDIN_CLIENT_ID",
    type: "string",
    required: "conditional",
    ownerModule: "social-publishing",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    description:
      "LinkedIn App client ID — required when LINKEDIN_PROVIDER_ENABLED=true. Describes the LinkedIn App an operator registers in LinkedIn's Developer portal; this app does not implement an interactive OAuth redirect flow itself (see linkedin-provider-config.ts).",
    validatorGroup: "checkLinkedInProviderConfig"
  },
  {
    name: "LINKEDIN_CLIENT_SECRET_REFERENCE",
    type: "string",
    required: "conditional",
    ownerModule: "social-publishing",
    sensitivity: "secret",
    profiles: ONLINE_PROFILES,
    description:
      'A REFERENCE into external secret storage (e.g. "env:LINKEDIN_CLIENT_SECRET_ACTUAL"), never the raw client secret — rejected at readiness time if it looks like a raw secret/JWT (reuses social-account-validation.ts\'s looksLikeRawSecretToken). Required when LINKEDIN_PROVIDER_ENABLED=true.',
    validatorGroup: "checkLinkedInProviderConfig"
  },
  {
    name: "LINKEDIN_API_VERSION",
    type: "string",
    required: "conditional",
    ownerModule: "social-publishing",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    description:
      'LinkedIn versioned-API release string ("YYYYMM", e.g. "202506"), sent as the LinkedIn-Version header on every request. Required when LINKEDIN_PROVIDER_ENABLED=true.',
    validatorGroup: "checkLinkedInProviderConfig"
  },
  {
    name: "LINKEDIN_OAUTH_REDIRECT_URI",
    type: "string",
    required: "conditional",
    ownerModule: "social-publishing",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    description:
      "Redirect URI registered on the LinkedIn App — required for LinkedIn's own app-review/allow-list, even though this codebase does not implement the interactive authorize/callback flow itself. Required when LINKEDIN_PROVIDER_ENABLED=true.",
    validatorGroup: "checkLinkedInProviderConfig"
  },
  {
    name: "LINKEDIN_REQUIRED_SCOPES",
    type: "csv",
    required: "conditional",
    ownerModule: "social-publishing",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    description:
      "Comma-separated OAuth scopes a connected account must hold (e.g. \"w_organization_social,r_organization_social,rw_organization_admin\") — checked by the adapter's verifyCredentials against each account's stored scopes. Required when LINKEDIN_PROVIDER_ENABLED=true.",
    validatorGroup: "checkLinkedInProviderConfig"
  },

  // ---------------------------------------------------------------------
  // Social publishing — Telegram channel adapter (Issue #646)
  // ---------------------------------------------------------------------
  {
    name: "TELEGRAM_PROVIDER_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "social-publishing",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "false",
    description:
      "Provider-specific gate for the Telegram channel adapter, layered on top of SOCIAL_PUBLISHING_ENABLED/_PROFILE — src/modules/social-publishing/domain/telegram-config.ts.",
    validatorGroup: "checkTelegramProviderConfig"
  },
  {
    name: "TELEGRAM_BOT_TOKEN_SECRET_REFERENCE",
    type: "string",
    required: "conditional",
    ownerModule: "social-publishing",
    sensitivity: "secret",
    profiles: ONLINE_PROFILES,
    description:
      "Opaque reference into secret storage (e.g. env:MY_BOT_TOKEN_VAR) for this deployment's Telegram bot token — required when TELEGRAM_PROVIDER_ENABLED=true. Rejected at boot if it looks like a raw bot token (reuses social-account-validation.ts's looksLikeRawSecretToken). Kept primarily as a deployment-readiness signal; the adapter resolves the real token per-connected-account from that account's own token_reference using the same env: indirection.",
    validatorGroup: "checkTelegramProviderConfig"
  },
  {
    name: "TELEGRAM_DEFAULT_PARSE_MODE",
    type: "enum",
    required: "optional",
    ownerModule: "social-publishing",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    description:
      'Unset (default, plain text — safe, no formatting injection surface) or exactly "MarkdownV2"/"HTML" to opt into Telegram formatting. Every interpolated field is escaped per the active mode before being sent (telegram-message-formatting.ts). Legacy "Markdown" is deliberately not supported.',
    validatorGroup: "checkTelegramProviderConfig"
  },
  {
    name: "TELEGRAM_REQUEST_TIMEOUT_MS",
    type: "integer",
    required: "optional",
    ownerModule: "social-publishing",
    sensitivity: "non-secret",
    profiles: ONLINE_PROFILES,
    default: "10000",
    description:
      "Timeout (ms) for one Telegram Bot API request (publish or verify).",
    validatorGroup: "checkTelegramProviderConfig"
  },

  // ---------------------------------------------------------------------
  // Blog content — automatic internal tag linking (Issue #641)
  // ---------------------------------------------------------------------
  {
    name: "BLOG_AUTO_INTERNAL_TAG_LINKS_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "blog-content",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "true",
    description:
      "Deployment-wide kill switch for automatic internal tag linking — when false, no tenant can enable it regardless of its own per-tenant override.",
    validatorGroup: "checkBlogAutoInternalTagLinksConfig"
  },
  {
    name: "BLOG_AUTO_INTERNAL_TAG_LINKS_MAX_PER_POST",
    type: "integer",
    required: "optional",
    ownerModule: "blog-content",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "10",
    description:
      "Maximum total automatic internal tag links inserted per post (1-100).",
    validatorGroup: "checkBlogAutoInternalTagLinksConfig"
  },
  {
    name: "BLOG_AUTO_INTERNAL_TAG_LINKS_MAX_PER_TAG",
    type: "integer",
    required: "optional",
    ownerModule: "blog-content",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "1",
    description:
      "Maximum automatic links to the same tag within one post (1-20). Effectively capped at 1 when BLOG_AUTO_INTERNAL_TAG_LINKS_LINK_FIRST_OCCURRENCE_ONLY=true.",
    validatorGroup: "checkBlogAutoInternalTagLinksConfig"
  },
  {
    name: "BLOG_AUTO_INTERNAL_TAG_LINKS_MIN_TERM_LENGTH",
    type: "integer",
    required: "optional",
    ownerModule: "blog-content",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "3",
    description:
      "Tag names shorter than this (1-100 characters) are never auto-linked, to avoid noisy links on very short/common words.",
    validatorGroup: "checkBlogAutoInternalTagLinksConfig"
  },
  {
    name: "BLOG_AUTO_INTERNAL_TAG_LINKS_LINK_FIRST_OCCURRENCE_ONLY",
    type: "boolean",
    required: "optional",
    ownerModule: "blog-content",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "true",
    description:
      "When true, only the first occurrence of each matched tag in a post is linked (equivalent to capping BLOG_AUTO_INTERNAL_TAG_LINKS_MAX_PER_TAG at 1)."
  },
  {
    name: "BLOG_AUTO_INTERNAL_TAG_LINKS_EXCLUDE_HEADINGS",
    type: "boolean",
    required: "optional",
    ownerModule: "blog-content",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "true",
    description:
      "When true, text inside h1-h6 heading elements is never auto-linked (in addition to existing anchors, scripts, code/pre blocks, and figure captions, which are never linked regardless of this setting)."
  },
  // ---------------------------------------------------------------------
  // Data lifecycle (Issue #745, epic #738 platform-evolution)
  // ---------------------------------------------------------------------
  {
    name: "DATA_LIFECYCLE_ARCHIVE_ROOT_PATH",
    type: "path",
    required: "optional",
    ownerModule: "data-lifecycle",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "./var/data-lifecycle-archive",
    description:
      "Filesystem root the local/offline archive adapter (src/modules/data-lifecycle/infrastructure/local-archive-adapter.ts) writes archive artifacts under, one subdirectory per (tenantId, ownerModuleKey, tableShortName). The only new env var this issue adds — retention days/batch limits are already owned by each HighVolumeTableDescriptor in code (or, for a delegated adopter, by that module's own existing retention env var), never re-declared here."
  },
  // ---------------------------------------------------------------------
  // Reporting projections/scheduled exports (Issue #753, epic #738
  // platform-evolution)
  // ---------------------------------------------------------------------
  {
    name: "REPORTING_EXPORT_ROOT_PATH",
    type: "path",
    required: "optional",
    ownerModule: "reporting",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "./var/reporting-exports",
    description:
      "Filesystem root the local/offline export adapter (src/modules/reporting/infrastructure/local-export-adapter.ts) writes scheduled/manual projection export artifacts under, one subdirectory per (tenantId, projectionKey). Same local-first posture as DATA_LIFECYCLE_ARCHIVE_ROOT_PATH — no external object storage dependency."
  },
  {
    name: "REPORTING_EXPORT_RETENTION_DAYS",
    type: "integer",
    required: "optional",
    ownerModule: "reporting",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "7",
    description:
      "How many days a generated export artifact (and its awcms_micro_reporting_export_runs manifest row's expires_at) remains downloadable before GET /api/v1/reports/exports/{id}/download starts refusing it with 410 Gone."
  },
  // ---------------------------------------------------------------------
  // Comments (Issue #271, ADR-0032)
  // ---------------------------------------------------------------------
  {
    name: "COMMENTS_TIMING_SECRET",
    type: "string",
    required: "optional",
    ownerModule: "comments",
    sensitivity: "secret",
    profiles: ALL_PROFILES,
    description:
      "HMAC key signing the public comment form's submit-timing token (src/modules/comments/domain/timing-token.ts). Unset falls back to a fixed development literal, so an unconfigured deployment lets anyone mint a valid token and walk past the anti-abuse timing floor — a soft anti-abuse heuristic only, never authorization. `bun run security:readiness`'s `checkCommentsTimingSecretConfigured` reports a WARNING when APP_ENV=production and this is unset (Issue #293)."
  },
  {
    name: "COMMENTS_SUBSCRIBER_ENCRYPTION_KEY",
    type: "string",
    required: "optional",
    ownerModule: "comments",
    sensitivity: "secret",
    profiles: ALL_PROFILES,
    description:
      'Base64-encoded 32-byte AES-256-GCM key encrypting reply-notification subscriber addresses at rest (awcms_micro_comments_reply_subscriptions.subscriber_email_encrypted). Deliberately SEPARATE from every other key so its blast radius stays one column. Unset (or wrong length) = fail-closed: the row stores an unresolvable marker and reply-notify degrades to "cannot notify" (ADR-0006 provider-optional), never a plaintext leak.'
  },
  {
    name: "COMMENTS_RETENTION_DAYS",
    type: "integer",
    required: "optional",
    ownerModule: "comments",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "365",
    description:
      "Age (days) at which `bun run comments:retention` anonymizes commenter PII. Priority: --retention-days=<n> flag, then this var, then the module default (COMMENTS_DEFAULT_ANONYMIZE_DAYS = 365). Anonymization is SKIPPED for a tenant under an active data_lifecycle legal hold."
  },
  // ---------------------------------------------------------------------
  // Newsletter (Issue #272, ADR-0033)
  // ---------------------------------------------------------------------
  {
    name: "NEWSLETTER_SUBSCRIBER_ENCRYPTION_KEY",
    type: "string",
    required: "optional",
    ownerModule: "newsletter",
    sensitivity: "secret",
    profiles: ALL_PROFILES,
    description:
      'Base64-encoded 32-byte AES-256-GCM key encrypting newsletter subscriber addresses at rest (awcms_micro_newsletter_subscribers.email_encrypted). Same shape and fail-closed posture as COMMENTS_SUBSCRIBER_ENCRYPTION_KEY, deliberately a DIFFERENT key: unset means delivery degrades to "cannot send", never a plaintext address.'
  },
  {
    name: "NEWSLETTER_PROVIDER_WEBHOOK_SECRET",
    type: "string",
    required: "optional",
    ownerModule: "newsletter",
    sensitivity: "secret",
    profiles: ALL_PROFILES,
    description:
      "HMAC-SHA256 key verifying inbound provider delivery/bounce/complaint callbacks (src/modules/newsletter/domain/provider-callback-verify.ts). Verification FAILS CLOSED when unset, so an unconfigured deployment never trusts an unsigned callback; browser redirects are never trusted regardless."
  },
  {
    name: "NEWSLETTER_RETENTION_DAYS",
    type: "integer",
    required: "optional",
    ownerModule: "newsletter",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "365",
    description:
      "Age (days) at which `bun run newsletter:retention` anonymizes unsubscribed/bounced subscriber PII. Priority: --retention-days=<n> flag, then this var, then the module default (NEWSLETTER_DEFAULT_ANONYMIZE_DAYS = 365). Skipped for a tenant under an active legal hold."
  },
  // ---------------------------------------------------------------------
  // Site search (Issue #270, ADR-0031)
  // ---------------------------------------------------------------------
  {
    name: "SITE_SEARCH_RATE_LIMIT_MAX",
    type: "integer",
    required: "optional",
    ownerModule: "site-search",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "60",
    description:
      "Per-IP request ceiling for the public GET /api/v1/site-search/query endpoint within SITE_SEARCH_RATE_LIMIT_WINDOW_SEC."
  },
  {
    name: "SITE_SEARCH_RATE_LIMIT_WINDOW_SEC",
    type: "integer",
    required: "optional",
    ownerModule: "site-search",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "60",
    description:
      "Rate-limit window (seconds) for GET /api/v1/site-search/query."
  },
  {
    name: "SITE_SEARCH_SUGGEST_RATE_LIMIT_MAX",
    type: "integer",
    required: "optional",
    ownerModule: "site-search",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "120",
    description:
      "Per-IP request ceiling for the public GET /api/v1/site-search/suggest endpoint (higher than the query ceiling: suggest fires per keystroke)."
  },
  {
    name: "SITE_SEARCH_SUGGEST_RATE_LIMIT_WINDOW_SEC",
    type: "integer",
    required: "optional",
    ownerModule: "site-search",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "60",
    description:
      "Rate-limit window (seconds) for GET /api/v1/site-search/suggest."
  },
  // ---------------------------------------------------------------------
  // Redis (opsional, Issue #285 — readiness scaffolding: `src/lib/redis/*`
  // + `bun run redis:health`; no application path depends on Redis, see
  // `docs/awcms-micro/redis-readiness.md`)
  // ---------------------------------------------------------------------
  {
    name: "REDIS_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "deployment",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "false",
    description:
      "Master switch for the optional Redis cache/health scaffolding. Without it the application never opens a Redis connection; nothing in the request path degrades when it stays off (fail-open by design)."
  },
  {
    name: "REDIS_URL",
    type: "url",
    required: "conditional",
    ownerModule: "deployment",
    sensitivity: "secret",
    profiles: ALL_PROFILES,
    description:
      "Connection URL, required when REDIS_ENABLED=true. Accepts redis://, rediss://, redis+tls://, redis+unix://, redis+tls+unix://. SECRET — may embed username/password, so it never belongs in an issue, log, or screenshot."
  },
  {
    name: "REDIS_KEY_PREFIX",
    type: "string",
    required: "optional",
    ownerModule: "deployment",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "awcms-micro",
    description:
      "Namespace prefix for every key this application writes (2-64 chars: letters, digits, `.`, `_`, `-`), so one Redis instance can host several deployments without collision."
  },
  {
    name: "REDIS_CONNECTION_TIMEOUT_MS",
    type: "integer",
    required: "optional",
    ownerModule: "deployment",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "2000",
    description:
      "Connection establishment timeout (100-30000 ms). An out-of-range or non-integer value falls back to the default rather than failing boot."
  },
  {
    name: "REDIS_COMMAND_TIMEOUT_MS",
    type: "integer",
    required: "optional",
    ownerModule: "deployment",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "1000",
    description:
      "Per-command timeout (50-30000 ms) — the ceiling on how long a cache read may delay a request before the caller falls back to the database."
  },
  {
    name: "REDIS_MAX_RETRIES",
    type: "integer",
    required: "optional",
    ownerModule: "deployment",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "3",
    description: "Reconnect attempts before the client gives up (0-20)."
  },
  {
    name: "REDIS_CACHE_DEFAULT_TTL_SEC",
    type: "integer",
    required: "optional",
    ownerModule: "deployment",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "300",
    description:
      "Default TTL (1-86400 s) applied to a cache entry written without an explicit TTL."
  },
  // ---------------------------------------------------------------------
  // Edge cache (opsional, Issue #353 / ADR-0037)
  // ---------------------------------------------------------------------
  {
    name: "EDGE_CACHE_ENABLED",
    type: "boolean",
    required: "optional",
    ownerModule: "deployment",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "false",
    description:
      "Master switch for the optional HTTP surrogate cache in front of the application (Varnish is the reference implementation). While false the middleware adds no cache headers at all, so this is a true no-op boundary rather than a behaviour change on every route."
  },
  {
    name: "EDGE_CACHE_DEFAULT_TTL_SECONDS",
    type: "integer",
    required: "optional",
    ownerModule: "deployment",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "60",
    description:
      "Baseline `Surrogate-Control: max-age` (1-86400 s) for a cacheable public response. This is the freshness contract: without an explicit purge, an edit becomes visible to anonymous readers within this many seconds."
  },
  {
    name: "EDGE_CACHE_BOOST_TTL_SECONDS",
    type: "integer",
    required: "optional",
    ownerModule: "deployment",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "300",
    description:
      "Surrogate TTL (1-86400 s) used while automatic escalation is active. A value below EDGE_CACHE_DEFAULT_TTL_SECONDS is clamped up to it, because a shorter boost would weaken caching exactly when the database is under pressure."
  },
  {
    name: "EDGE_CACHE_BROWSER_TTL_SECONDS",
    type: "integer",
    required: "optional",
    ownerModule: "deployment",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "0",
    description:
      "Client-facing `Cache-Control: max-age` (0-86400 s). The default 0 emits `public, max-age=0, must-revalidate`, so browsers keep revalidating (a purge takes effect for them immediately) while the shared cache absorbs the repeat load."
  },
  {
    name: "EDGE_CACHE_STALE_WHILE_REVALIDATE_SECONDS",
    type: "integer",
    required: "optional",
    ownerModule: "deployment",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "60",
    description:
      "How long (0-86400 s) a shared cache may serve a stale entry while it refreshes in the background. 0 omits the directive."
  },
  {
    name: "EDGE_CACHE_STALE_IF_ERROR_SECONDS",
    type: "integer",
    required: "optional",
    ownerModule: "deployment",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "600",
    description:
      "How long (0-604800 s) a shared cache may serve a stale entry while the origin is failing — mapped to Varnish grace. This is what turns a database outage into slightly stale pages instead of 503s; `bun run edge-cache:health` warns when it is 0."
  },
  {
    name: "EDGE_CACHE_AUTO_ESCALATION",
    type: "boolean",
    required: "optional",
    ownerModule: "deployment",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "true",
    description:
      "Whether the application raises the surrogate TTL by itself when it measures database pressure (work-class saturation or a non-closed circuit breaker). False pins every cacheable response to the baseline TTL."
  },
  {
    name: "EDGE_CACHE_PRESSURE_THRESHOLD_PERCENT",
    type: "integer",
    required: "optional",
    ownerModule: "deployment",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    default: "70",
    description:
      "Foreground work-class utilization (10-100 %) at or above which automatic escalation engages. Release uses a 20-point hysteresis band plus a 30 s minimum hold, so the mode cannot oscillate request-to-request."
  },
  {
    name: "EDGE_CACHE_PURGE_URL",
    type: "url",
    required: "optional",
    ownerModule: "deployment",
    sensitivity: "non-secret",
    profiles: ALL_PROFILES,
    description:
      "Base URL of the cache's invalidation endpoint, e.g. `http://varnish:8080`. Unset disables explicit invalidation entirely; staleness is then bounded only by the TTLs above. An internal service address, not a credential."
  },
  {
    name: "EDGE_CACHE_PURGE_TOKEN",
    type: "string",
    required: "optional",
    ownerModule: "deployment",
    sensitivity: "secret",
    profiles: ALL_PROFILES,
    description:
      "Shared secret the cache requires on an invalidation request (`POST /__awcms-edge-cache/ban`), alongside its own private-network ACL. SECRET — never in an issue, log, or screenshot. Empty on either side disables invalidation rather than accepting an unauthenticated purge."
  },
  // ---------------------------------------------------------------------
  // Preflight tooling (Issue #293)
  // ---------------------------------------------------------------------
  {
    name: "PREFLIGHT_TEST_DATABASE_URL",
    type: "url",
    required: "optional",
    ownerModule: "deployment",
    sensitivity: "secret",
    profiles: ALL_PROFILES,
    description:
      "DISPOSABLE database DSN that `bun run production:preflight`'s `test` stage runs the integration suite against. The deployment target's DATABASE_URL is NEVER forwarded to that stage (the suite TRUNCATEs every awcms_micro_* table and activates three login roles with publicly-known passwords). Unset — or set to the same DSN as the target — makes the stage run unit-only and report SKIPPED, which blocks go-live under APP_ENV=production. Operator/CI tooling only; the application never reads it."
  }
];

/** Explicit exemptions from `bun run config:docs:check`'s three-way parity gate (Issue #689 acceptance criteria: "every runtime env read registered or explicitly exempted"). */
export type ConfigExemption = {
  name: string;
  reason: string;
};

export const CONFIG_EXEMPTIONS: readonly ConfigExemption[] = [
  {
    name: "NODE_ENV",
    reason:
      "Platform-level Node.js/Bun convention, not read anywhere in this repo's application code (grep confirms zero matches) — not application-specific configuration."
  },
  {
    name: "PORT",
    reason:
      "Consumed internally by the @astrojs/node standalone adapter's own server bootstrap, not read by this repo's application code directly — platform-level, not application-specific configuration."
  },
  {
    name: "STARSENDER_ENABLED",
    reason:
      "Illustrative example content in doc 18 §Provider CRM for a retail/POS derived application (WhatsApp receipt) — not read anywhere in this base repo's code, not part of .env.example. Derived apps (e.g. AWPOS) add their own registry entry for it."
  },
  {
    name: "STARSENDER_API_KEY",
    reason: "Same as STARSENDER_ENABLED above."
  },
  {
    name: "MAILKETING_ENABLED",
    reason:
      "Illustrative example content in doc 18 §Provider CRM for a retail/POS derived application (\"email receipt\", historical issue #390, closed not planned) — deliberately distinct from this base's real EMAIL_ENABLED (generic email module, Issue #493). Not read anywhere in this base repo's code."
  },
  {
    name: "MAILKETING_API_TOKEN",
    reason: "Same as MAILKETING_ENABLED above."
  },
  {
    name: "AI_ANALYST_ENABLED",
    reason:
      "Illustrative example content in doc 18 §AI analyst for a derived application — not read anywhere in this base repo's code."
  },
  {
    name: "AI_PROVIDER_API_KEY",
    reason: "Same as AI_ANALYST_ENABLED above."
  },
  {
    name: "AI_MODEL",
    reason: "Same as AI_ANALYST_ENABLED above."
  },
  {
    name: "PATH",
    reason:
      "Platform-level shell variable, read only to locate the PostgreSQL client binaries the backup/restore drill shells out to (src/lib/resilience/scenarios/backup-restore-drill.ts) — never application configuration, never set by an operator for this repo's sake."
  },
  {
    name: "CHANGESET_POLICY_BASE_REF",
    reason:
      "CI-only input to scripts/changeset-policy-check.ts (which git ref to diff the changeset policy against). Repository tooling, never read by the application or set on a deployment target."
  },
  {
    name: "RELEASE_TAG_REF",
    reason:
      "CI-only input to scripts/release-verify.ts (the tag ref being released). Repository tooling, never read by the application or set on a deployment target."
  },
  {
    name: "REDIS_PASSWORD",
    reason:
      "Redis SERVER/Compose-overlay configuration (docs/awcms-micro/redis-readiness.md §Overlay), consumed by the Redis container itself — this repo's code only ever reads REDIS_URL, which carries the credential when one is set."
  },
  {
    name: "REDIS_MAXMEMORY",
    reason:
      "Redis server memory ceiling — same container-level scope as REDIS_PASSWORD above."
  },
  {
    name: "REDIS_MAXMEMORY_POLICY",
    reason:
      "Redis server eviction policy (kept at noeviction so a full instance fails visibly) — same container-level scope as REDIS_PASSWORD above."
  }
];

export function findConfigVarEntry(name: string): ConfigVarEntry | undefined {
  return CONFIG_REGISTRY.find((entry) => entry.name === name);
}

export function listSecretConfigVarNames(): readonly string[] {
  return CONFIG_REGISTRY.filter((entry) => entry.sensitivity === "secret").map(
    (entry) => entry.name
  );
}

export function listDeprecatedConfigVarEntries(): readonly ConfigVarEntry[] {
  return CONFIG_REGISTRY.filter((entry) => entry.deprecated !== undefined);
}
