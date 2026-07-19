/**
 * Public theme token stylesheet composition root (Issue #269, ADR-0029 §7). Lives
 * in `src/lib` because it wires the neutral public-tenant resolver + the
 * `module_management` enablement gate into `theming`'s render resolver (never a
 * cross-module import inside the module's own application/domain).
 *
 * `GET /theming/tokens.css` — resolves the request's tenant FROM HOST (never a
 * raw `Host` for anything but the DB-backed lookup), then serves that tenant's
 * ACTIVE published theme tokens as `text/css`. It ALWAYS returns a valid 200:
 * an unresolved tenant, a tenant with `theming` disabled, and a tenant with no
 * active theme all serve the DEFAULT theme's tokens — so there is NO
 * "does this host map to a tenant" enumeration/timing oracle (the response is
 * always a stylesheet; only the token values a tenant chose to publish differ).
 *
 * The stylesheet is same-origin, so it is served under the app's existing CSP
 * `style-src 'self'` without any inline `<style>` — the whole reason token values
 * ship as an external stylesheet (ADR-0029 §7: never weaken CSP).
 */
import { getDatabaseClient } from "../database/client";
import { withTenant } from "../database/tenant-context";
import {
  resolvePublicTenantFromRequest,
  type PublicHostResolverConfig
} from "../tenant/public-host-tenant-resolver";
import { fetchTenantModuleEntry } from "../../modules/module-management/application/tenant-module-lifecycle";
import { THEMING_MODULE_KEY } from "../../modules/theming/domain/theme-permissions";
import {
  defaultThemeCss,
  resolveActiveThemeCssForTenant,
  type ResolvedThemeCss
} from "../../modules/theming/application/theme-render-resolver";

/** Build the host-resolver config from the documented env vars (same shape as the SEO/news routes). */
export function buildThemingHostResolverConfigFromEnv(
  env: NodeJS.ProcessEnv = process.env
): PublicHostResolverConfig {
  return {
    mode: env.PUBLIC_TENANT_RESOLUTION_MODE,
    trustProxy: env.PUBLIC_TRUST_PROXY === "true"
  };
}

/** ETag from a render fingerprint (strong validator). */
function etagFor(css: ResolvedThemeCss): string {
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(css.fingerprint);
  return `"${hasher.digest("hex").slice(0, 32)}"`;
}

function cssResponse(css: ResolvedThemeCss, status = 200): Response {
  return new Response(css.css, {
    status,
    headers: {
      "content-type": "text/css; charset=utf-8",
      etag: etagFor(css),
      // Public, tenant-first (host determines tenant), safe to cache/CDN.
      "cache-control":
        "public, max-age=300, s-maxage=300, stale-while-revalidate=600"
    }
  });
}

function notModified(css: ResolvedThemeCss): Response {
  return new Response(null, {
    status: 304,
    headers: {
      etag: etagFor(css),
      "cache-control":
        "public, max-age=300, s-maxage=300, stale-while-revalidate=600"
    }
  });
}

/** Serve the active theme tokens CSS for the request's resolved tenant (always 200/304). */
export async function serveActiveThemeTokensCss(
  request: Request,
  env: NodeJS.ProcessEnv = process.env
): Promise<Response> {
  const sql = getDatabaseClient();
  const config = buildThemingHostResolverConfigFromEnv(env);
  const tenant = await resolvePublicTenantFromRequest(sql, request, config);

  let resolved: ResolvedThemeCss;
  if (!tenant) {
    resolved = defaultThemeCss();
  } else {
    resolved = await withTenant(sql, tenant.tenantId, async (tx) => {
      const entry = await fetchTenantModuleEntry(
        tx,
        tenant.tenantId,
        THEMING_MODULE_KEY
      );
      if (!(entry?.tenantEnabled ?? false)) return defaultThemeCss();
      return resolveActiveThemeCssForTenant(tx, tenant.tenantId);
    });
  }

  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch && ifNoneMatch === etagFor(resolved)) {
    return notModified(resolved);
  }
  return cssResponse(resolved);
}
