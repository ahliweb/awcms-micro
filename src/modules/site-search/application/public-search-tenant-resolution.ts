/**
 * Public tenant resolution + module-enablement gate for the public search
 * surfaces (`/search` page, `/api/v1/site-search/query`, `/suggest`) — Issue
 * #270, ADR-0031 §5. Mirrors `blog_content`'s `withNewsTenant` exactly: resolve
 * the tenant from the request host (`resolvePublicTenantFromRequest`), then
 * confirm `site_search` is enabled for that tenant before running the handler.
 * Every non-resolving case collapses to the same generic `null` (mapped to a 404
 * / empty response by the caller — never leak WHY), cost-normalized against a
 * timing side-channel via `padUnresolvedSearchTenantLatency`.
 */
import { withTenant } from "../../../lib/database/tenant-context";
import {
  resolvePublicTenantFromRequest,
  type PublicHostResolverConfig,
  type PublicTenantResolution
} from "../../../lib/tenant/public-host-tenant-resolver";
import { fetchTenantModuleEntry } from "../../module-management/application/tenant-module-lifecycle";
import type { SiteSearchSettings } from "../domain/search-settings";
import { SITE_SEARCH_MODULE_KEY } from "../domain/site-search-permissions";
import { fetchSiteSearchSettings } from "./search-settings-directory";

export type SiteSearchTenantHandler<T> = (
  tx: Bun.TransactionSQL,
  tenant: PublicTenantResolution,
  settings: SiteSearchSettings
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

async function checkSiteSearchGate(
  tx: Bun.TransactionSQL,
  tenantId: string
): Promise<{ enabled: boolean; settings: SiteSearchSettings }> {
  const entry = await fetchTenantModuleEntry(
    tx,
    tenantId,
    SITE_SEARCH_MODULE_KEY
  );
  const settings = await fetchSiteSearchSettings(tx, tenantId);
  return {
    // Fail-closed: a missing entry is treated as disabled. Also honor the
    // tenant's own `enabled` search config switch.
    enabled: (entry?.tenantEnabled ?? false) && settings.enabled,
    settings
  };
}

/**
 * Pad the "tenant did not resolve" path with the same round-trip shape the
 * "resolved but disabled" path pays — the timing side-channel parity fix (mirrors
 * `withNewsTenant`'s `padUnresolvedTenantLatency`).
 */
export async function padUnresolvedSearchTenantLatency(
  sql: Bun.SQL,
  env: NodeJS.ProcessEnv = process.env
): Promise<void> {
  await withTenant(sql, TIMING_PAD_TENANT_ID, async (tx) => {
    await checkSiteSearchGate(tx, TIMING_PAD_TENANT_ID);
  });
}

/**
 * Resolve the public tenant for a search request and, only if resolved + enabled,
 * open a tenant-scoped transaction and run `handler` with the tenant's search
 * settings. Returns `null` for every non-resolving/disabled case.
 */
export async function withSiteSearchTenant<T>(
  sql: Bun.SQL,
  request: Request,
  handler: SiteSearchTenantHandler<T>,
  env: NodeJS.ProcessEnv = process.env
): Promise<T | null> {
  const config = buildPublicHostResolverConfigFromEnv(env);
  const tenant = await resolvePublicTenantFromRequest(sql, request, config);

  if (!tenant) {
    await padUnresolvedSearchTenantLatency(sql, env);
    return null;
  }

  return withTenant(sql, tenant.tenantId, async (tx) => {
    const { enabled, settings } = await checkSiteSearchGate(
      tx,
      tenant.tenantId
    );
    if (!enabled) return null;
    return handler(tx, tenant, settings);
  });
}
