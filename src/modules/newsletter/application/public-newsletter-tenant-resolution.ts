/**
 * Public tenant resolution + module-enablement gate for the public newsletter
 * surfaces (subscribe/confirm/preferences/unsubscribe/resubscribe/provider-
 * callback) — Issue #272, ADR-0033 §5. Mirrors `comments`'s `withCommentsTenant`
 * exactly: resolve the tenant from the request host (`resolvePublicTenantFromRequest`),
 * then confirm `newsletter` is enabled for that tenant before running the handler.
 * Every non-resolving/disabled case collapses to the SAME generic `null` (mapped
 * to an ANTI-ENUMERATION generic response by the caller — never leak WHY), with a
 * timing pad against a side-channel.
 */
import { withTenant } from "../../../lib/database/tenant-context";
import {
  resolvePublicTenantFromRequest,
  type PublicHostResolverConfig,
  type PublicTenantResolution
} from "../../../lib/tenant/public-host-tenant-resolver";
import { fetchTenantModuleEntry } from "../../module-management/application/tenant-module-lifecycle";
import { NEWSLETTER_MODULE_KEY } from "../domain/newsletter-permissions";

export type NewsletterTenantHandler<T> = (
  tx: Bun.TransactionSQL,
  tenant: PublicTenantResolution
) => Promise<T>;

const TIMING_PAD_TENANT_ID = "00000000-0000-0000-0000-000000000000";

export function buildPublicHostResolverConfigFromEnv(
  env: NodeJS.ProcessEnv = process.env
): PublicHostResolverConfig {
  return {
    mode: env.PUBLIC_TENANT_RESOLUTION_MODE,
    trustProxy: env.PUBLIC_TRUST_PROXY === "true"
  };
}

async function checkNewsletterGate(
  tx: Bun.TransactionSQL,
  tenantId: string
): Promise<boolean> {
  const entry = await fetchTenantModuleEntry(
    tx,
    tenantId,
    NEWSLETTER_MODULE_KEY
  );
  // Fail-closed: a missing entry is disabled.
  return entry?.tenantEnabled ?? false;
}

export async function padUnresolvedNewsletterTenantLatency(
  sql: Bun.SQL,
  _env: NodeJS.ProcessEnv = process.env
): Promise<void> {
  await withTenant(sql, TIMING_PAD_TENANT_ID, async (tx) => {
    await checkNewsletterGate(tx, TIMING_PAD_TENANT_ID);
  });
}

/**
 * Resolve the public tenant for a newsletter request and, only if resolved +
 * enabled, open a tenant-scoped transaction and run `handler`. Returns `null` for
 * every non-resolving/disabled case (caller maps that to the generic response).
 */
export async function withNewsletterTenant<T>(
  sql: Bun.SQL,
  request: Request,
  handler: NewsletterTenantHandler<T>,
  env: NodeJS.ProcessEnv = process.env
): Promise<T | null> {
  const config = buildPublicHostResolverConfigFromEnv(env);
  const tenant = await resolvePublicTenantFromRequest(sql, request, config);

  if (!tenant) {
    await padUnresolvedNewsletterTenantLatency(sql, env);
    return null;
  }

  return withTenant(sql, tenant.tenantId, async (tx) => {
    const enabled = await checkNewsletterGate(tx, tenant.tenantId);
    if (!enabled) return null;
    return handler(tx, tenant);
  });
}
