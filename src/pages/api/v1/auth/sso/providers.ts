import type { APIRoute } from "astro";
import { ok, fail } from "../../../../../modules/_shared/api-response";
import { getDatabaseClient } from "../../../../../lib/database/client";
import { withTenant } from "../../../../../lib/database/tenant-context";
import { TENANT_COOKIE_NAME } from "../../../../../lib/auth/ssr-session";
import {
  checkRateLimit,
  resolveClientIp
} from "../../../../../lib/security/rate-limit";
import { isSsoRequired } from "../../../../../lib/auth/sso-config";
import { listEnabledAuthProvidersForLogin } from "../../../../../modules/identity-access/application/auth-provider-directory";

const RATE_LIMIT_MAX_ATTEMPTS = Number(
  process.env.AUTH_LOGIN_RATE_LIMIT_MAX ?? 20
);
const RATE_LIMIT_WINDOW_SEC = Number(
  process.env.AUTH_LOGIN_RATE_LIMIT_WINDOW_SEC ?? 60
);

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * `GET /api/v1/auth/sso/providers?tenantId=<id>` (Issue #591 follow-up) — the
 * login page's SSO provider discovery. Companion to
 * `[providerKey]/start.ts`: `start` redirects to ONE provider's authorization
 * endpoint; this lists which providers a tenant's users may start with, so the
 * login page can render a button per provider. Unauthenticated by design (the
 * login page has no session yet), tenant resolved from the
 * `X-AWCMS-Micro-Tenant-ID` header / tenant cookie / `?tenantId=` query param
 * fallback exactly like `start.ts` (a plain browser fetch pre-login carries no
 * tenant cookie).
 *
 * ## Anti-enumeration guarantee (the whole reason this file is careful)
 * The response is INDISTINGUISHABLE between (a) an unknown/nonexistent tenant,
 * (b) an inactive/suspended tenant, and (c) a valid active tenant that has no
 * enabled providers — ALL return `ok({ providers: [] })`. Only a valid active
 * tenant WITH at least one enabled provider returns a non-empty list. This is
 * enforced by running ONE uniform code path for every valid-UUID tenant id:
 * `listEnabledAuthProvidersForLogin` is a single query whose RLS scoping +
 * `EXISTS (... status = 'active')` guard collapse the unknown/inactive/empty
 * cases to the same empty set (see that function's comment) — there is no
 * per-outcome branch or early return that could create a tenant-existence or
 * status timing/shape oracle. The three early returns that DO exist are all
 * tenant-INDEPENDENT: the deployment-wide `isSsoRequired()` gate (identical for
 * every tenant on this deployment, so it discloses nothing about any tenant), a
 * missing tenant id (no tenant to probe at all), and a non-UUID-shaped tenant
 * id (can never name a real tenant, so it can't distinguish one real tenant
 * from another). No latency padding is needed because none of those early-outs
 * separates one real tenant id from another — only the single uniform query
 * ever touches per-tenant data.
 *
 * ## Rate limit (read `start.ts` + `generic-oidc-client.ts` before changing)
 * A SINGLE per-source+tenant limit (`${clientIp}:${tenantId}`), the same shape
 * `start.ts` uses. Deliberately NO shared/aggregate limit keyed by anything
 * global: a shared budget across all sources is itself a privilege-free DoS
 * against every legitimate user of a tenant's SSO login (a handful of source
 * IPs could exhaust it and lock everyone out) — the full rationale is in
 * `start.ts`'s and `generic-oidc-client.ts`'s top comments.
 *
 * Never leaks provider internals: only `{ providerKey, displayName }` per
 * enabled provider, never `issuerUrl`/`clientId`/`clientSecret`/`providerType`.
 */
export const GET: APIRoute = async ({
  request,
  cookies,
  url,
  clientAddress
}) => {
  // Deployment-wide gate — the SAME answer for every tenant on this deployment,
  // so returning early here discloses nothing tenant-specific. No DB touched.
  if (!isSsoRequired()) {
    return ok({ providers: [] });
  }

  const tenantId =
    request.headers.get("x-awcms-micro-tenant-id") ??
    cookies.get(TENANT_COOKIE_NAME)?.value ??
    url.searchParams.get("tenantId") ??
    null;

  // A missing or non-UUID tenant id can never name a real tenant, so returning
  // the same empty list here can't distinguish one real tenant from another —
  // it stays within the anti-enumeration guarantee. A non-UUID would also throw
  // in `withTenant`'s `assertUuid`; returning empty avoids surfacing that.
  if (!tenantId || !UUID_PATTERN.test(tenantId)) {
    return ok({ providers: [] });
  }

  const clientIp = resolveClientIp(request, clientAddress);
  const rateLimit = checkRateLimit(
    `${clientIp}:${tenantId}:sso-providers-list`,
    {
      maxAttempts: RATE_LIMIT_MAX_ATTEMPTS,
      windowMs: RATE_LIMIT_WINDOW_SEC * 1000
    }
  );

  if (!rateLimit.allowed) {
    return fail(
      429,
      "RATE_LIMITED",
      "Too many requests from this source. Try again later.",
      {},
      undefined,
      { "retry-after": String(rateLimit.retryAfterSec) }
    );
  }

  const sql = getDatabaseClient();

  // Single uniform path for every valid-UUID tenant id. On pool saturation
  // `withTenant` returns its own `503 DATABASE_BUSY` Response (default
  // `unavailableBehavior`), same as `start.ts`; that is a deployment-wide
  // availability signal, not a per-tenant oracle.
  return withTenant(sql, tenantId, async (tx) => {
    const providers = await listEnabledAuthProvidersForLogin(tx, tenantId);

    return ok({ providers });
  });
};
