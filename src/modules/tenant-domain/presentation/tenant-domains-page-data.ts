/**
 * SSR page model for the tenant-domain admin screen
 * (`/admin/tenant/domains`) — presentation layer per ADR-0038, extracted
 * from that page's frontmatter by Issue #372.
 *
 * Path/permission match the descriptor declared by Issue #558
 * (`src/modules/tenant-domain/module.ts`'s `navigation` entry):
 * `/admin/tenant/domains`, gated on `tenant_domain.domains.read`.
 *
 * The SSR read is a direct, read-only DB call (`listTenantDomains` via
 * `withTenant`) — the same convention `admin/blog/*` uses for its initial
 * render. **Every mutation** (create/update/verify/set-primary/delete) goes
 * through the already-guarded/audited `/api/v1/tenant/domains/**` endpoints
 * from the browser; this path never writes. That split is a binding
 * acceptance criterion of Issue #563: no privileged SSR shortcut for any
 * mutation.
 *
 * `listTenantDomains` returns at most `TENANT_DOMAIN_LIST_LIMIT` (100)
 * newest-first rows; this screen adds no cursor pagination on top (a tenant
 * with over 100 domain mappings is not an expected shape today).
 *
 * `unavailableBehavior: "throw"` was ADDED during the extraction (Issue
 * #372): this is a non-`Response` caller, so `withTenant`'s 503 `Response`
 * fallback would otherwise have been assigned to `domains` and rendered as
 * a row list under pool saturation — exactly the leak PR #323 fixed
 * elsewhere (doc 16 §withTenant). It now surfaces as the page's normal
 * `loadError` branch instead.
 */
import { getDatabaseClient } from "../../../lib/database/client";
import { withTenant } from "../../../lib/database/tenant-context";
import { logAdminPageError } from "../../../lib/logging/error-log";
import { buildClientErrorMessages } from "../../../lib/i18n/error-messages";
import type { Translator } from "../../../lib/i18n/translate";
import type { SsrContext } from "../../../lib/auth/ssr-session";
import { permissionKey } from "../../identity-access/domain/access-control";
import { listTenantDomains } from "../application/tenant-domain-directory";
import {
  TENANT_DOMAIN_ROUTE_MODES,
  TENANT_DOMAIN_TYPES,
  TENANT_DOMAIN_UPDATABLE_STATUSES,
  TENANT_DOMAIN_VERIFICATION_METHODS
} from "../domain/tenant-domain-validation";
import type { TenantDomainStrings } from "./tenant-domains-admin-client";

export interface TenantDomainsPageModel {
  canRead: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canVerify: boolean;
  canSetPrimary: boolean;
  domains: Awaited<ReturnType<typeof listTenantDomains>>;
  loadError: boolean;
}

export async function loadTenantDomainsPageModel(
  context: SsrContext,
  options: { correlationId?: string } = {}
): Promise<TenantDomainsPageModel> {
  const can = (activity: string): boolean =>
    context.permissions.has(
      permissionKey("tenant_domain", "domains", activity)
    );

  const canRead = can("read");
  let domains: Awaited<ReturnType<typeof listTenantDomains>> = [];
  let loadError = false;

  if (canRead) {
    try {
      domains = await withTenant(
        getDatabaseClient(),
        context.tenantId,
        (tx) => listTenantDomains(tx, context.tenantId),
        { unavailableBehavior: "throw" }
      );
    } catch (error) {
      logAdminPageError(
        "admin/tenant/domains.astro: failed to load tenant domains",
        error,
        { correlationId: options.correlationId }
      );
      loadError = true;
    }
  }

  return {
    canRead,
    canCreate: can("create"),
    canUpdate: can("update"),
    canDelete: can("delete"),
    canVerify: can("verify"),
    canSetPrimary: can("set_primary"),
    domains,
    loadError
  };
}

/**
 * Maps the DB status enum (`pending_verification | active | suspended |
 * failed`, migration 031) to `StatusBadge`'s variant vocabulary.
 */
export function statusBadgeVariant(
  status: string
): "success" | "warning" | "danger" | "neutral" {
  switch (status) {
    case "active":
      return "success";
    case "pending_verification":
      return "warning";
    case "suspended":
    case "failed":
      return "danger";
    default:
      return "neutral";
  }
}

/** The preview link only makes sense for the primary active domain —
 *  `is_primary` is "where canonical URLs point" (migration 031). */
export function canPreviewNewsLink(domain: {
  status: string;
  isPrimary: boolean;
}): boolean {
  return domain.status === "active" && domain.isPrimary;
}

export function canVerifyDomain(domain: { status: string }): boolean {
  return domain.status === "pending_verification" || domain.status === "failed";
}

export function canSetPrimaryDomain(domain: {
  status: string;
  isPrimary: boolean;
}): boolean {
  return domain.status === "active" && !domain.isPrimary;
}

export function hasVerificationRecord(domain: {
  verificationMethod: string | null;
}): boolean {
  return (
    domain.verificationMethod === "dns_txt" ||
    domain.verificationMethod === "dns_cname"
  );
}

export interface DomainSelectOption {
  value: string;
  label: string;
}

export function buildDomainTypeOptions(t: Translator): DomainSelectOption[] {
  return TENANT_DOMAIN_TYPES.map((value) => ({
    value,
    label: t(`admin.tenant_domain.domain_type.${value}`)
  }));
}

export function buildRouteModeOptions(t: Translator): DomainSelectOption[] {
  return TENANT_DOMAIN_ROUTE_MODES.map((value) => ({
    value,
    label: t(`admin.tenant_domain.route_mode.${value}`)
  }));
}

/**
 * The status `<select>` always renders (Issue #563 post-review fix) with a
 * leading "no change" option whose value is the empty string — the client
 * only sends `status` when a real value was picked, so leaving it alone
 * never re-submits the current status as an explicit transition.
 */
export function buildDomainStatusOptions(t: Translator): DomainSelectOption[] {
  return [
    { value: "", label: t("admin.tenant_domain.field_status_no_change") },
    ...TENANT_DOMAIN_UPDATABLE_STATUSES.map((value) => ({
      value,
      label: t(`admin.tenant_domain.status.${value}`)
    }))
  ];
}

/**
 * Which status option starts selected in the edit form: the row's own
 * status when it is one an admin may transition to, otherwise the "no
 * change" option — a status outside `TENANT_DOMAIN_UPDATABLE_STATUSES`
 * (e.g. `pending_verification`) is not a value this form may submit.
 */
export function selectedStatusValue(status: string): string {
  return TENANT_DOMAIN_UPDATABLE_STATUSES.includes(
    status as (typeof TENANT_DOMAIN_UPDATABLE_STATUSES)[number]
  )
    ? status
    : "";
}

export function buildVerificationMethodOptions(
  t: Translator
): DomainSelectOption[] {
  return [
    {
      value: "",
      label: t("admin.tenant_domain.field_verification_method_none_option")
    },
    ...TENANT_DOMAIN_VERIFICATION_METHODS.map((value) => ({
      value,
      label: t(`admin.tenant_domain.verification_method.${value}`)
    }))
  ];
}

/** See `access-users-page-data.ts` for why the strings blob is typed by the
 *  client module's own interface. */
export function buildTenantDomainClientStrings(
  t: Translator
): TenantDomainStrings {
  return {
    createSuccess: t("admin.tenant_domain.create_success"),
    updateSuccess: t("admin.tenant_domain.update_success"),
    deleteSuccess: t("admin.tenant_domain.delete_success"),
    verifySuccess: t("admin.tenant_domain.verify_success"),
    setPrimarySuccess: t("admin.tenant_domain.set_primary_success"),
    deleteReasonPrompt: t("admin.tenant_domain.delete_reason_prompt"),
    deleteConfirm: t("admin.tenant_domain.delete_confirm"),
    deleteConfirmTitle: t("admin.tenant_domain.delete_confirm_title"),
    verifyConfirm: t("admin.tenant_domain.verify_confirm"),
    verifyConfirmTitle: t("admin.tenant_domain.verify_confirm_title"),
    setPrimaryConfirm: t("admin.tenant_domain.set_primary_confirm"),
    setPrimaryConfirmTitle: t("admin.tenant_domain.set_primary_confirm_title"),
    invalidHostname: t("admin.tenant_domain.invalid_hostname"),
    copySuccess: t("admin.tenant_domain.copy_success"),
    copyError: t("admin.tenant_domain.copy_error"),
    confirmButton: t("common.confirm_button"),
    cancelButton: t("common.cancel_button"),
    reasonRequiredError: t("common.reason_required_error"),
    networkError: t("common.network_error"),
    pleaseWait: t("common.please_wait"),
    errorMessages: buildClientErrorMessages(t)
  };
}
