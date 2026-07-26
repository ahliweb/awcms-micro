/**
 * SSR page model for the Access & Users admin screen (`/admin/access-users`).
 *
 * Presentation layer per ADR-0038: this is the composition root of one HTTP
 * surface — it wires this module's own application layer
 * (`user-directory.ts`) to the `src/lib` database/tenant primitives and
 * hands the `.astro` file a plain, already-decided view model. It exists so
 * the page file is markup, not a data-access script; extracted from
 * `src/pages/admin/access-users.astro`'s frontmatter unchanged (Issue #372).
 *
 * Permission-gated per section, matching each endpoint's own guard exactly
 * (defense-in-depth: hiding a control is a UX nicety, the real enforcement
 * is server-side in the ABAC-guarded `/api/v1/*` routes every mutation on
 * that page calls):
 *   - identity_access.user_management.read     -> Users table
 *   - identity_access.user_management.create   -> "add user" form
 *   - identity_access.user_management.update   -> rename / activate-deactivate
 *   - identity_access.access_control.read      -> Roles table
 *   - identity_access.access_control.configure -> create/edit/delete role
 *   - identity_access.access_control.assign    -> assign/unassign role chips
 *
 * SSR reads go through the same application-layer functions the JSON
 * endpoints use rather than round-tripping through this app's own HTTP API
 * (`admin/index.astro`'s pattern). `unavailableBehavior: "throw"` is
 * mandatory here: this is a non-`Response` caller, and `withTenant`'s 503
 * `Response` fallback must never leak into an SSR value (doc 16 §withTenant,
 * incident PR #323).
 */
import { buildClientErrorMessages } from "../../../lib/i18n/error-messages";
import type { Translator } from "../../../lib/i18n/translate";
import { getDatabaseClient } from "../../../lib/database/client";
import { withTenant } from "../../../lib/database/tenant-context";
import { logAdminPageError } from "../../../lib/logging/error-log";
import type { SsrContext } from "../../../lib/auth/ssr-session";
import { permissionKey } from "../domain/access-control";
import {
  fetchPermissionCatalog,
  fetchRolesWithPermissions,
  fetchTenantUsersWithRoles,
  type PermissionCatalogEntry
} from "../application/user-directory";
import type { AccessUsersStrings } from "./access-users-admin-client";

/** Structural mirror of `CheckboxGroup.astro`'s `CheckboxGroupSection`.
 *  Declared here rather than imported so this module stays a plain `.ts`
 *  file `tsc` can check — `.astro` files export no types it can read. */
export interface PermissionCheckboxSection {
  title: string;
  items: { value: string; label: string; checked: boolean }[];
}

/**
 * Turns the module-grouped permission catalog into the exact rows
 * `<CheckboxGroup groups={...}>` renders, with the role's current selection
 * pre-checked. Doing it here keeps the page's two permission pickers to one
 * line of data each instead of a nested `.map()` inside the template.
 */
export function buildPermissionCheckboxSections(
  permissionGroups: Map<string, PermissionCatalogEntry[]>,
  selectedPermissionIds: readonly string[] = []
): PermissionCheckboxSection[] {
  return [...permissionGroups.entries()].map(([moduleKey, permissions]) => ({
    title: moduleKey,
    items: permissions.map((permission) => ({
      value: permission.permissionId,
      label: `${permission.activityCode}.${permission.action}`,
      checked: selectedPermissionIds.includes(permission.permissionId)
    }))
  }));
}

/**
 * i18n (Issue #433): the client script can't read the `.po` catalog itself
 * (server-side only, via `Bun.file`), so the translated strings and the
 * error-code map it needs are injected as a `<script type="application/json">`
 * blob (`ClientJsonData.astro`) and read back by `readClientStrings()`.
 *
 * Typed as the client module's own `AccessUsersStrings`, so `tsc` now fails
 * if this blob and the browser code that consumes it ever drift apart — the
 * exact class of bug that was unrepresentable while both halves lived in
 * `.astro` files (Issue #372).
 */
export function buildAccessUsersClientStrings(
  t: Translator
): AccessUsersStrings {
  return {
    createUserSuccess: t("admin.access_users.create_user_success"),
    createRoleSuccess: t("admin.access_users.create_role_success"),
    updateRoleSuccess: t("admin.access_users.update_role_success"),
    deleteRoleSuccess: t("admin.access_users.delete_role_success"),
    updateStatusSuccess: t("admin.access_users.update_status_success"),
    assignRoleSuccess: t("admin.access_users.assign_role_success"),
    unassignRoleSuccess: t("admin.access_users.unassign_role_success"),
    deleteRolePrompt: t("admin.access_users.delete_role_prompt"),
    deleteRoleConfirmTitle: t("admin.access_users.delete_role_confirm_title"),
    deleteRoleConfirmBody: t("admin.access_users.delete_role_confirm_body"),
    confirmButton: t("common.confirm_button"),
    cancelButton: t("common.cancel_button"),
    reasonRequiredError: t("common.reason_required_error"),
    networkError: t("common.network_error"),
    pleaseWait: t("common.please_wait"),
    errorMessages: buildClientErrorMessages(t)
  };
}

export interface AccessUsersPageData {
  users: Awaited<ReturnType<typeof fetchTenantUsersWithRoles>>;
  roles: Awaited<ReturnType<typeof fetchRolesWithPermissions>>;
  permissions: PermissionCatalogEntry[];
}

export interface AccessUsersPageModel {
  canReadUsers: boolean;
  canCreateUsers: boolean;
  canUpdateUsers: boolean;
  canReadRoles: boolean;
  canConfigureRoles: boolean;
  canAssign: boolean;
  hasAnyAccess: boolean;
  /** `null` when the caller may see nothing, or when the load failed. */
  data: AccessUsersPageData | null;
  /**
   * Issue #434 (UX/UI audit): the doc 14 §State pattern wajib requires an
   * explicit Error branch ("Loading -> Error: gagal"). `loadError`
   * distinguishes "you can't see this" (permission) from "we couldn't load
   * it right now" (transient failure); see `StateNotice.astro`.
   */
  loadError: boolean;
  /** Permission catalog grouped by `moduleKey` for a readable checkbox layout. */
  permissionGroups: Map<string, PermissionCatalogEntry[]>;
}

export async function loadAccessUsersPageModel(
  context: SsrContext,
  options: { correlationId?: string } = {}
): Promise<AccessUsersPageModel> {
  const canReadUsers = context.permissions.has(
    permissionKey("identity_access", "user_management", "read")
  );
  const canCreateUsers = context.permissions.has(
    permissionKey("identity_access", "user_management", "create")
  );
  const canUpdateUsers = context.permissions.has(
    permissionKey("identity_access", "user_management", "update")
  );
  const canReadRoles = context.permissions.has(
    permissionKey("identity_access", "access_control", "read")
  );
  const canConfigureRoles = context.permissions.has(
    permissionKey("identity_access", "access_control", "configure")
  );
  const canAssign = context.permissions.has(
    permissionKey("identity_access", "access_control", "assign")
  );
  const hasAnyAccess = canReadUsers || canReadRoles;

  let data: AccessUsersPageData | null = null;
  let loadError = false;

  if (hasAnyAccess) {
    try {
      data = await withTenant(
        getDatabaseClient(),
        context.tenantId,
        async (tx) => ({
          users: canReadUsers
            ? await fetchTenantUsersWithRoles(tx, context.tenantId)
            : [],
          roles: canReadRoles
            ? await fetchRolesWithPermissions(tx, context.tenantId)
            : [],
          permissions: canReadRoles ? await fetchPermissionCatalog(tx) : []
        }),
        { unavailableBehavior: "throw" }
      );
    } catch (error) {
      logAdminPageError(
        "admin/access-users.astro: failed to load data",
        error,
        {
          correlationId: options.correlationId
        }
      );
      loadError = true;
    }
  }

  const permissionGroups = new Map<string, PermissionCatalogEntry[]>();
  if (data) {
    for (const permission of data.permissions) {
      const list = permissionGroups.get(permission.moduleKey) ?? [];
      list.push(permission);
      permissionGroups.set(permission.moduleKey, list);
    }
  }

  return {
    canReadUsers,
    canCreateUsers,
    canUpdateUsers,
    canReadRoles,
    canConfigureRoles,
    canAssign,
    hasAnyAccess,
    data,
    loadError,
    permissionGroups
  };
}
