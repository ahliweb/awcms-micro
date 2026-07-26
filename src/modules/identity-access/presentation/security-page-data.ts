/**
 * SSR page model for the full-online auth security admin screen
 * (`/admin/security`, Issue #592, epic #587-#593) — presentation layer per
 * ADR-0038, extracted from that page's frontmatter by Issue #372.
 *
 * The page adds no enforcement of its own; it renders what #587-#591
 * already built. Two independent gates decide what it may show:
 *
 * 1. **Deployment gate** (`resolveAuthSecurityStatusSummary`, #587) — when
 *    inactive (every local/offline/LAN deployment, the default) the page
 *    renders ONLY an informational notice: no Turnstile/MFA/Google/SSO
 *    status, no forms, and no database read at all. Decided here,
 *    server-side, never hidden with CSS (issue guardrail: "No
 *    Cloudflare/Google/OIDC call is triggered merely by rendering admin UI
 *    on local/offline/LAN").
 * 2. **ABAC permission** (`identity_access.sso_policy.*`/`sso_providers.*`,
 *    migration 037) — gate active but neither permission held renders an
 *    access-denied notice; each section additionally checks its own
 *    specific permission.
 *
 * SSR reads the #591 application-layer functions directly inside one
 * `withTenant` transaction rather than round-tripping through this app's own
 * HTTP API. Mutations go through the real `PATCH /api/v1/identity/sso/policy`
 * and `POST|PATCH|DELETE /api/v1/identity/sso/providers[/{id}]` endpoints
 * from the browser, so each still runs the endpoint's own ABAC + break-glass
 * + audit logic — this path never writes.
 *
 * The three reads inside the transaction are sequential `await`s on ONE
 * connection, never `Promise.all`: concurrent queries on a single `tx`
 * desync the connection and leak a pool slot (doc 16 §withTenant, incident
 * PR #324).
 */
import { getDatabaseClient } from "../../../lib/database/client";
import { withTenant } from "../../../lib/database/tenant-context";
import { logAdminPageError } from "../../../lib/logging/error-log";
import { buildClientErrorMessages } from "../../../lib/i18n/error-messages";
import type { Translator } from "../../../lib/i18n/translate";
import type { SsrContext } from "../../../lib/auth/ssr-session";
import { resolveAuthSecurityStatusSummary } from "../../../lib/auth/auth-security-status";
import { permissionKey } from "../domain/access-control";
import {
  getTenantAuthPolicy,
  type TenantAuthPolicyView
} from "../application/tenant-auth-policy";
import {
  listAuthProviders,
  type AuthProviderView
} from "../application/auth-provider-directory";
import { fetchTenantUsersWithRoles } from "../application/user-directory";
import type { SecurityStrings } from "./security-admin-client";

export interface SecurityPageModel {
  statusSummary: ReturnType<typeof resolveAuthSecurityStatusSummary>;
  canReadPolicy: boolean;
  canUpdatePolicy: boolean;
  canReadProviders: boolean;
  canCreateProviders: boolean;
  canUpdateProviders: boolean;
  canDeleteProviders: boolean;
  canReadUsers: boolean;
  canReadAnything: boolean;
  policy: TenantAuthPolicyView | null;
  providers: AuthProviderView[];
  /** Break-glass picker options, already filtered to eligible identities. */
  breakGlassCandidates: Awaited<ReturnType<typeof fetchTenantUsersWithRoles>>;
  loadError: boolean;
}

export async function loadSecurityPageModel(
  context: SsrContext,
  options: { correlationId?: string } = {}
): Promise<SecurityPageModel> {
  const can = (resource: string, activity: string): boolean =>
    context.permissions.has(
      permissionKey("identity_access", resource, activity)
    );

  const statusSummary = resolveAuthSecurityStatusSummary();
  const canReadPolicy = can("sso_policy", "read");
  const canReadProviders = can("sso_providers", "read");
  const canReadUsers = can("user_management", "read");
  const canReadAnything = canReadPolicy || canReadProviders;

  let policy: TenantAuthPolicyView | null = null;
  let providers: AuthProviderView[] = [];
  let breakGlassCandidates: Awaited<
    ReturnType<typeof fetchTenantUsersWithRoles>
  > = [];
  let loadError = false;

  if (statusSummary.gateActive && canReadAnything) {
    try {
      // The callback RETURNS its three values rather than assigning to the
      // outer `let`s: while this lived in the `.astro` frontmatter, the
      // closure-assignment form narrowed `policy` to `never` for every
      // template reference (`astro check` reported seven such errors on this
      // file). Returning them keeps the real types.
      const loaded = await withTenant(
        getDatabaseClient(),
        context.tenantId,
        async (tx) => {
          const loadedPolicy = canReadPolicy
            ? await getTenantAuthPolicy(tx, context.tenantId)
            : null;
          const loadedProviders = canReadProviders
            ? await listAuthProviders(tx, context.tenantId)
            : [];
          // Issue #605: only offer identities that could actually still
          // pass `countEligibleBreakGlassIdentities`'s eligibility check
          // (`saveTenantAuthPolicy`) — the directory query lists every
          // tenant user (needed elsewhere), but selecting an
          // inactive/suspended one here would be a doomed choice the
          // server rejects only after submit.
          const allTenantUsers =
            canReadPolicy && canReadUsers
              ? await fetchTenantUsersWithRoles(tx, context.tenantId)
              : [];

          return {
            policy: loadedPolicy,
            providers: loadedProviders,
            breakGlassCandidates: allTenantUsers.filter(
              (user) =>
                user.status === "active" && user.identityStatus === "active"
            )
          };
        },
        { unavailableBehavior: "throw" }
      );

      policy = loaded.policy;
      providers = loaded.providers;
      breakGlassCandidates = loaded.breakGlassCandidates;
    } catch (error) {
      logAdminPageError(
        "admin/security.astro: failed to load security data",
        error,
        { correlationId: options.correlationId }
      );
      loadError = true;
    }
  }

  return {
    statusSummary,
    canReadPolicy,
    canUpdatePolicy: can("sso_policy", "update"),
    canReadProviders,
    canCreateProviders: can("sso_providers", "create"),
    canUpdateProviders: can("sso_providers", "update"),
    canDeleteProviders: can("sso_providers", "delete"),
    canReadUsers,
    canReadAnything,
    policy,
    providers,
    breakGlassCandidates,
    loadError
  };
}

/** Break-glass owner picker rows for `<CheckboxGroup items={...}>`. */
export function buildBreakGlassItems(
  candidates: {
    identityId: string;
    displayName: string;
    loginIdentifier: string;
  }[],
  selectedIdentityIds: readonly string[]
): { value: string; label: string; checked: boolean }[] {
  return candidates.map((user) => ({
    value: user.identityId,
    label: `${user.displayName} (${user.loginIdentifier})`,
    checked: selectedIdentityIds.includes(user.identityId)
  }));
}

/**
 * The four feature rows of the status list. Each renders the identical
 * `"<enabled|disabled> · <configured|not configured>"` sentence, so they are
 * built as data instead of four hand-repeated `<dt>/<dd>` pairs. The gate
 * and profile rows stay in the template: they render markup (a status pill
 * and a `<code>`), not a sentence.
 */
export function buildSecurityStatusRows(
  t: Translator,
  summary: ReturnType<typeof resolveAuthSecurityStatusSummary>
): { label: string; value: string }[] {
  const featureLabel = buildFeatureStatusLabel(t);
  const configured = buildConfiguredLabel(t);
  const row = (
    label: string,
    feature: { enabled: boolean; configured: boolean }
  ): { label: string; value: string } => ({
    label,
    value: `${featureLabel(feature.enabled)} · ${configured(feature.configured)}`
  });

  return [
    row(t("admin.security.turnstile_label"), summary.turnstile),
    row(t("admin.security.mfa_label"), summary.mfa),
    row(t("admin.security.google_login_label"), summary.googleLogin),
    row(t("admin.security.sso_label"), summary.sso)
  ];
}

export function buildFeatureStatusLabel(
  t: Translator
): (enabled: boolean) => string {
  const enabledLabel = t("admin.security.feature_status_enabled");
  const disabledLabel = t("admin.security.feature_status_disabled");
  return (enabled) => (enabled ? enabledLabel : disabledLabel);
}

export function buildConfiguredLabel(
  t: Translator
): (configured: boolean) => string {
  const configuredLabel = t("admin.security.feature_configured");
  const notConfiguredLabel = t("admin.security.feature_not_configured");
  return (configured) => (configured ? configuredLabel : notConfiguredLabel);
}

/** See `access-users-page-data.ts` for why the strings blob is typed by the
 *  client module's own interface. */
export function buildSecurityClientStrings(t: Translator): SecurityStrings {
  return {
    policySaveSuccess: t("admin.security.policy_save_success"),
    createProviderSuccess: t("admin.security.create_provider_success"),
    updateProviderSuccess: t("admin.security.update_provider_success"),
    deleteProviderSuccess: t("admin.security.delete_provider_success"),
    deleteProviderPrompt: t("admin.security.delete_provider_prompt"),
    breakGlassClientWarning: t("admin.security.break_glass_client_warning"),
    invalidSecretChoice: t("admin.security.invalid_secret_choice"),
    invalidCreateSecretChoice: t("admin.security.invalid_create_secret_choice"),
    networkError: t("common.network_error"),
    pleaseWait: t("common.please_wait"),
    errorMessages: buildClientErrorMessages(t)
  };
}
