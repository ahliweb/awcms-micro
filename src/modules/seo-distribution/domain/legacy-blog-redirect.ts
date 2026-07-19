/**
 * Legacy `/blog/{tenantCode}` → canonical `/news` path mapping (Issue #268,
 * ADR-0010 deferral). ADR-0010 §Alternatif explicitly DEFERRED this auto-redirect
 * to "a follow-up issue" — now #268's territory. The `/news` routes (Issue #560)
 * are the tenant-code-free counterpart of `/blog/{tenantCode}` (Issue #540): the
 * subtree mirrors 1:1 minus the `/{tenantCode}` segment, so mapping is a pure
 * prefix rewrite. This module only computes the target PATH; the resolution
 * service resolves the tenant by code, derives the primary host server-side, builds
 * the absolute URL, and validates it through the frozen open-redirect guard.
 *
 * This is NOT a tenant-authored rule and NOT a pattern engine — it is one fixed,
 * bounded structural rewrite of a known legacy route family, gated by an explicit
 * per-tenant policy (`legacy_blog_redirect_enabled`) and the existence of a
 * verified primary host.
 */

/** A tenant-code is a bounded slug (mirrors `resolvePublicTenantByCode`'s own input expectations). */
const TENANT_CODE_MAX_LENGTH = 128;

export type LegacyBlogPath = {
  tenantCode: string;
  /** Path after `/blog/{tenantCode}` — `""` for the index, else a leading-`/` remainder. */
  rest: string;
};

/**
 * Parse a `/blog/{tenantCode}` request path into its tenant code + remainder, or
 * `null` when the path is not under a concrete `/blog/{tenantCode}` (e.g. `/blog`,
 * `/blog/`, or anything else). No regex backtracking — plain segment splitting.
 */
export function parseLegacyBlogPath(pathname: string): LegacyBlogPath | null {
  if (typeof pathname !== "string" || !pathname.startsWith("/blog/")) {
    return null;
  }

  const afterPrefix = pathname.slice("/blog/".length); // "{tenantCode}[/rest]"
  if (afterPrefix.length === 0) return null;

  const slashIndex = afterPrefix.indexOf("/");
  const tenantCode =
    slashIndex === -1 ? afterPrefix : afterPrefix.slice(0, slashIndex);
  const rest = slashIndex === -1 ? "" : afterPrefix.slice(slashIndex);

  if (tenantCode.length === 0 || tenantCode.length > TENANT_CODE_MAX_LENGTH) {
    return null;
  }

  return { tenantCode, rest };
}

/**
 * Build the canonical `/news...` PATH equivalent of a parsed legacy blog path.
 * `/blog/{tenantCode}` → `/news`; `/blog/{tenantCode}/foo` → `/news/foo`.
 */
export function buildCanonicalNewsPath(rest: string): string {
  return rest.length === 0 ? "/news" : `/news${rest}`;
}
