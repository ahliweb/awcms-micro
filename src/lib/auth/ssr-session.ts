import type { AstroCookies } from "astro";

import { getDatabaseClient } from "../database/client";
import { withTenant } from "../database/tenant-context";
import { hashSessionToken } from "./session-token";
import {
  fetchGrantedPermissionKeys,
  resolveTenantContext
} from "../../modules/identity-access/application/auth-context";

/**
 * Cookie names shared by the SSR admin shell (Issue 8.1) and the additive
 * cookie-set/cookie-clear logic in `POST /auth/login` and `POST /auth/logout`
 * (`src/pages/api/v1/auth/login.ts`, `logout.ts`). Both cookies are httpOnly
 * + SameSite=Lax so the raw session token is never readable from
 * client-side JavaScript (doc 15 §Autentikasi dan sesi).
 */
export const SESSION_COOKIE_NAME = "awcms_micro_session";
export const TENANT_COOKIE_NAME = "awcms_micro_tenant_id";

export type SsrContext = {
  tenantId: string;
  tenantUserId: string;
  identityId: string;
  roles: string[];
  permissions: Set<string>;
  /**
   * Tenant's `default_locale` (Issue #433 — i18n), fetched here so
   * `src/middleware.ts` can resolve the final locale (cookie -> tenant
   * default -> `en`) *before* any `/admin/*` page or `AdminLayout.astro`
   * renders — resolving it later, inside the layout, is too late: a page's
   * own frontmatter (and its own `t()` calls) runs before the layout
   * component it's nested in, so only middleware can make this available in
   * time. `null` if the tenant row is somehow missing.
   */
  tenantDefaultLocale: string | null;
};

/**
 * Resolve the authenticated tenant/session context for an SSR page render
 * from the two auth cookies, mirroring exactly what `POST /access/evaluate`
 * does for bearer-token requests (`resolveTenantContext` +
 * `fetchGrantedPermissionKeys` from
 * `src/modules/identity-access/application/auth-context.ts`).
 *
 * Returns `null` — never throws — whenever the cookies are missing, the
 * session is invalid/expired/revoked, the tenant-user membership is gone,
 * or the tenant id cookie is malformed. Callers (e.g. `AdminLayout.astro`)
 * treat `null` as "redirect to /login"; we never leak DB/validation errors
 * to the caller here (doc 10 §Guardrail keamanan — no stack traces).
 *
 * Returns a `Response` (never a context) in exactly one case: the shared
 * `withTenant` pool gate returned its 503 `DATABASE_BUSY` fallback because the
 * DB pool is saturated or the circuit breaker is open (`tenant-context.ts`).
 * That fallback is a `Response` cast to the generic `T` — fine for the API
 * routes that return it directly, but for SSR context resolution it must NOT
 * masquerade as a session (its `permissions` would be `undefined`, crashing
 * every admin page's `context.permissions.has(...)`). The middleware serves
 * this Response as-is (its `Retry-After` is already set) instead of a bogus
 * `/login` bounce — the session may be perfectly valid, the DB is just busy.
 */
export async function resolveSsrContext(
  cookies: AstroCookies,
  now: Date
): Promise<SsrContext | Response | null> {
  const tenantId = cookies.get(TENANT_COOKIE_NAME)?.value ?? null;
  const sessionToken = cookies.get(SESSION_COOKIE_NAME)?.value ?? null;

  if (!tenantId || !sessionToken) {
    return null;
  }

  try {
    const sql = getDatabaseClient();
    const tokenHash = hashSessionToken(sessionToken);

    const resolved = await withTenant(sql, tenantId, async (tx) => {
      const context = await resolveTenantContext(tx, tenantId, tokenHash, now);

      if (!context) {
        return null;
      }

      const permissions = await fetchGrantedPermissionKeys(
        tx,
        tenantId,
        context.tenantUserId
      );

      const localeRows = await tx`
        SELECT default_locale FROM awcms_micro_tenants WHERE id = ${tenantId}
      `;
      const tenantDefaultLocale =
        (localeRows[0]?.default_locale as string | undefined) ?? null;

      return {
        tenantId: context.tenantId,
        tenantUserId: context.tenantUserId,
        identityId: context.identityId,
        roles: context.roles,
        permissions,
        tenantDefaultLocale
      };
    });

    // `withTenant` returns a 503 `Response` (its generic fallback) when the DB
    // pool is saturated or the circuit breaker is open — hand that back to the
    // middleware verbatim rather than treating it as a resolved session.
    return resolved;
  } catch {
    return null;
  }
}
