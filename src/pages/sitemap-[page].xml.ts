import type { APIRoute } from "astro";

import {
  notFoundXmlResponse,
  serverErrorXmlResponse
} from "../lib/html/error-responses";
import { serveDiscovery } from "../lib/seo/discovery-route";
import { buildSitemapPagePayload } from "../modules/seo-distribution/application/seo-discovery-service";

/**
 * `GET /sitemap-{page}.xml` (Issue #267, ADR-0028 §4) — one bounded child sitemap
 * (`<urlset>`), page `N` = the `[(N-1)*perPage, N*perPage)` window of the tenant's
 * public, indexable, canonical URLs in a stable order. Includes reciprocal
 * `hreflang` alternates (for genuinely multi-locale resources) + published image
 * refs resolved same-tenant/verified. A non-integer, out-of-range, or
 * disabled-sitemap request 404s (generic XML). Every URL passes the frozen
 * `isPubliclyIndexable` guard, so nothing draft/private/deleted/noindex leaks.
 */
export const GET: APIRoute = ({ request, params }) => {
  const page = Number(params.page);
  return serveDiscovery(
    request,
    "seo_discovery.sitemap_page.failed",
    (ctx) => buildSitemapPagePayload(ctx, page),
    { notFound: notFoundXmlResponse, serverError: serverErrorXmlResponse }
  );
};
