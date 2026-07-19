/**
 * SEO metadata orchestrator (Issue #266, ADR-0028) — the composition point the
 * frozen `SeoFactsSource` contract was designed for. Given a tenant, a resource
 * identity, and the two ports injected by the route (the content module's
 * `SeoFactsSource` adapter as PROVIDER, `MediaLibraryPort` for OG image
 * resolution), it produces the rendered `<head>` for that resource — or signals
 * "not renderable" so the route returns its usual 404/deny.
 *
 * Everything host/visibility/injection-sensitive is delegated, never re-derived:
 * - HOST comes from `resolveTenantPrimaryHost` (server-derived, `tenant_domain`)
 *   — this service never reads a request header.
 * - VISIBILITY / robots / structured-data gating comes from `buildSeoDocument`,
 *   which uses the port's frozen `isPubliclyResolvable`/`isPubliclyIndexable`.
 * - OG/Twitter/Organization images are resolved through `MediaLibraryPort`
 *   (same-tenant, verified) — a raw media id is never trusted, and an id that
 *   does not resolve is simply dropped.
 * - CACHE KEY comes from the port's `buildSeoCacheKey`, which refuses to build a
 *   key without tenant+host+locale (cache-poisoning / cross-tenant defense).
 *
 * NO cross-module import: the `SeoFactsSource` and `MediaLibraryPort` are plain
 * parameters, wired at the route composition root — same rule every other
 * ports-and-adapters seam in this repo follows.
 */
import {
  buildSeoCacheKey,
  type SeoFactsSource
} from "../../_shared/ports/seo-facts-port";
import type { MediaLibraryPort } from "../../_shared/ports/media-library-port";
import {
  buildSeoDocument,
  SEO_RENDER_CONTRACT_VERSION,
  type ResolvedSeoImage,
  type SeoDocument,
  type SeoRenderContext
} from "../domain/seo-document";
import { renderSeoHeadTags } from "../domain/seo-head-rendering";
import type { SeoTenantSettings } from "../domain/seo-config";
import { fetchSeoTenantSettings } from "./seo-config-directory";
import { resolveTenantPrimaryHost } from "./resolve-canonical-host";

export type SeoResourceRenderInput = {
  tenantId: string;
  /** `awcms_micro_tenants.tenant_name` — the `og:site_name` fallback. */
  tenantDisplayName: string;
  resourceType: string;
  resourceId: string;
  /** Injected content-module adapter (PROVIDER of `seo_facts`). */
  factsSource: SeoFactsSource;
  /** Injected `media_library` adapter; `null` disables image resolution (renders text-only cards). */
  mediaLibrary: MediaLibraryPort | null;
  /** Defaults to `new Date()` — injectable for deterministic tests. */
  now?: Date;
};

export type SeoResourceRenderResult =
  | { renderable: false }
  | {
      renderable: true;
      document: SeoDocument;
      headHtml: string;
      cacheKey: string;
      primaryHost: string | null;
    };

async function resolveImages(
  tx: Bun.SQL,
  tenantId: string,
  mediaLibrary: MediaLibraryPort | null,
  socialMediaId: string | null,
  organizationLogoMediaId: string | null
): Promise<{
  social: ResolvedSeoImage | null;
  organizationLogoUrl: string | null;
}> {
  const ids = [socialMediaId, organizationLogoMediaId].filter(
    (id): id is string => id !== null
  );

  if (mediaLibrary === null || ids.length === 0) {
    return { social: null, organizationLogoUrl: null };
  }

  const resolved = await mediaLibrary.resolveMediaReferences(tx, tenantId, ids);

  const social =
    socialMediaId !== null && resolved.has(socialMediaId)
      ? ((): ResolvedSeoImage => {
          const dto = resolved.get(socialMediaId)!;
          return {
            url: dto.publicUrl,
            alt: dto.altText,
            mimeType: dto.mimeType,
            width: dto.width,
            height: dto.height
          };
        })()
      : null;

  const organizationLogoUrl =
    organizationLogoMediaId !== null && resolved.has(organizationLogoMediaId)
      ? resolved.get(organizationLogoMediaId)!.publicUrl
      : null;

  return { social, organizationLogoUrl };
}

/**
 * Resolve + render one resource's SEO head. The caller (an Astro route) runs
 * this inside its own tenant transaction and embeds `headHtml` in its document
 * shell when `renderable` is `true`; a `false` result means the resource is not
 * publicly resolvable and the route returns its normal 404/deny.
 */
export async function renderResourceSeoHead(
  tx: Bun.SQL,
  input: SeoResourceRenderInput
): Promise<SeoResourceRenderResult> {
  const now = input.now ?? new Date();
  const nowIso = now.toISOString();

  const facts = await input.factsSource.resolveResourceFacts(
    tx,
    input.tenantId,
    input.resourceType,
    input.resourceId
  );

  if (facts === null) {
    return { renderable: false };
  }

  const [primaryHost, settings] = await Promise.all([
    resolveTenantPrimaryHost(tx, input.tenantId),
    fetchSeoTenantSettings(tx, input.tenantId)
  ]);

  const effectiveSocialId =
    facts.openGraph.imageMediaId ?? settings.defaultSocialMediaId;

  const { social, organizationLogoUrl } = await resolveImages(
    tx,
    input.tenantId,
    input.mediaLibrary,
    effectiveSocialId,
    settings.organizationLogoMediaId
  );

  const context: SeoRenderContext = {
    primaryHost,
    tenantDisplayName: input.tenantDisplayName,
    settings,
    resolvedImage: social,
    nowIso
  };

  const result = buildSeoDocument(facts, context, organizationLogoUrl);

  if (!result.renderable) {
    return { renderable: false };
  }

  // Cache key: tenant-first, host + locale mandatory (the guard throws
  // otherwise). When there is no primary host, use a stable, non-host sentinel
  // so a cache entry still keys correctly per tenant/locale/resource without
  // ever borrowing the request host.
  const cacheKey = buildSeoCacheKey({
    tenantId: input.tenantId,
    host: primaryHost ?? "no-primary-domain.invalid",
    locale:
      result.document.locale || facts.localeAlternates[0]?.locale || "und",
    resourceType: input.resourceType,
    resourceId: input.resourceId,
    contractVersion: SEO_RENDER_CONTRACT_VERSION
  });

  return {
    renderable: true,
    document: result.document,
    headHtml: renderSeoHeadTags(result.document),
    cacheKey,
    primaryHost
  };
}

export type { SeoTenantSettings };
