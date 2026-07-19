# SEO Distribution — Public Discovery & Syndication (Issue #267)

Operator + integrator reference for the `seo_distribution` module's public
discovery/syndication surfaces: `robots.txt`, sitemap index + child sitemaps, and
RSS/Atom/JSON feeds. Scope decisions live in ADR-0028; module internals in
`src/modules/seo-distribution/README.md`.

## Endpoints

All are **public, unauthenticated Astro routes** (XML/text/JSON, not `/api/v1`
JSON operations — the same category as the `/news` HTML pages). Each resolves the
tenant from the request host (server-controlled) and is gated on the tenant
having `seo_distribution` enabled; any non-serving case returns a single generic,
latency-normalized `404` that leaks nothing about tenant existence.

| Route              | Media type              | Purpose                                                               |
| ------------------ | ----------------------- | --------------------------------------------------------------------- |
| `/robots.txt`      | `text/plain`            | Crawl policy; advertises the sitemap; honors the site-noindex switch. |
| `/sitemap.xml`     | `application/xml`       | Sitemap **index** listing `/sitemap-{n}.xml` children.                |
| `/sitemap-{n}.xml` | `application/xml`       | One bounded child sitemap page (`<urlset>`).                          |
| `/feed.xml`        | `application/rss+xml`   | RSS 2.0 feed of the latest items. `?locale=` narrows.                 |
| `/atom.xml`        | `application/atom+xml`  | Atom 1.0 feed. `?locale=` narrows.                                    |
| `/feed.json`       | `application/feed+json` | JSON Feed 1.1. `?locale=` narrows.                                    |

**Inclusion rule:** only published, public, non-deleted, non-`noindex`, canonical
resources whose `published_at` has been reached appear — enforced by the frozen
`isPubliclyIndexable` guard on every fact, on top of the provider's own
eligibility predicate. Drafts, scheduled-future, archived, deleted, private,
unlisted, and admin/API/private-media never appear.

**Host:** absolute URLs (`https://{host}/...`) use the tenant's verified
**primary** domain (`awcms_micro_tenant_domains`, `is_primary=true`,
`status='active'`). The arriving request host is never used for URL generation.
When a tenant has no verified primary domain, output degrades to relative paths
(offline-lan safe — no invented host) and `robots.txt` omits the `Sitemap:` line.

## Feed / discovery configuration

Per-tenant, on `awcms_micro_seo_tenant_settings` (extended by migration
`082`), read/written through the existing `GET`/`PUT /api/v1/seo/config`
(ABAC `seo_distribution.config.{read,update}`; `PUT` is idempotent + audited). No
new permission — the public routes are unauthenticated, and feed config is part
of the same `config` activity.

| Field                   | Bounds / default                    | Effect                                                                 |
| ----------------------- | ----------------------------------- | ---------------------------------------------------------------------- |
| `feedTitle`             | ≤200 chars, null → site/tenant name | Feed channel title.                                                    |
| `feedDescription`       | ≤500 chars, null → generic default  | Feed channel description.                                              |
| `feedLogoMediaId`       | UUID or null                        | Feed logo/icon; resolved same-tenant/verified via media.               |
| `feedItemLimit`         | 1–200, default 50                   | Max items per feed (only ever smaller than the code ceiling).          |
| `includedResourceTypes` | ≤50 slugs, null → all               | Allow-list of content types in sitemap/feeds.                          |
| `sitemapEnabled`        | boolean, default true               | Serve + advertise the sitemap.                                         |
| `feedsEnabled`          | boolean, default true               | Serve the feeds.                                                       |
| `defaultRobotsNoindex`  | boolean, default false              | Whole-site noindex → `robots.txt` `Disallow: /`, all surfaces degrade. |

Robots directives are intentionally **not** free-text tenant input (no
line-injection surface on the operator's shared robots.txt) — structured toggles
only.

## Caching & CDN behavior

The routes emit HTTP cache validators; there is **no server-side content store**.

- **ETag** — a strong validator `hash(signature)` where the signature is
  `kind + host + locale + contractVersion + configFingerprint + contentRoll-up`
  (`count | latestLastmod | latestPublishedAt`). The same ETag is used for the
  `200` header and the `304` comparison.
- **Last-Modified** — the later of the latest contributing `updated_at` and the
  config `updated_at` (epoch floor when both absent).
- **Conditional requests** — `If-None-Match` (takes precedence) and
  `If-Modified-Since` → `304 Not Modified` with the validators and Cache-Control,
  empty body.
- **Cache-Control** — `public, max-age=300, s-maxage=300,
stale-while-revalidate=600` (see `domain/discovery-limits.ts`).
- **CDN/edge** — a shared cache MAY cache on the URL; because the ETag/host are
  tenant/domain-specific, a shared cache entry can never cross tenants. The opt-in
  CDN/edge integration ADR-0028 §7 describes (locking on the same
  tenant/host/locale tuple) is a follow-up and must not degrade the offline-lan
  profile when off.

### Event-driven invalidation

Because the validators derive from live content/domain/config state, any of the
following changes the ETag/Last-Modified, so a cached copy revalidates (a `200`
with fresh content instead of a `304`) on its next conditional request:

- a post is published, updated, archived, soft-deleted, or restored (moves the
  content roll-up — every content mutation bumps `updated_at`);
- the tenant's primary domain changes (host component);
- a locale route changes (locale component);
- any feed/sitemap/robots config is edited (config fingerprint).

No manual purge is required for correctness. If a CDN is in front, its own TTL
(`s-maxage`) bounds how long a stale copy may serve before revalidation.

## Derived-module contribution

Discovery is generic: a resource's `resourceType` is opaque. A derived
application adds its own content type to sitemap/feeds by shipping a
`SeoFactsSource` adapter (`<module>/application/seo-facts-port-adapter.ts`) and
wiring it at the discovery composition root — WITHOUT declaring a second
`provides: ["seo_facts"]` (that is a `capability_provider_conflict`;
`blog_content` remains the single declared base provider). Implement the optional
`summarizePublicResourceFacts` (a single `count` + `max(updated_at)` +
`max(published_at)` aggregate over the same eligibility predicate as
`listPublicResourceFacts`) so the sitemap index sizes correctly and cache
validators stay cheap; a provider that omits it still works via a bounded listing
fallback. Support `order: "published_desc"` for feeds and `offset` for
deterministic child-sitemap paging.

## Operational diagnostics (runbook)

Diagnostics never expose private content — every check below observes only public
output or aggregate counts.

- **Is discovery serving?** `curl -sI https://{primary-host}/sitemap.xml` — a
  `200` with an `ETag` and `Cache-Control` means the tenant resolves, the module
  is enabled, and sitemaps are on. A `404` means one of: host not verified/primary,
  `seo_distribution` disabled, or `sitemap_enabled=false` (indistinguishable by
  design — check config + `awcms_micro_tenant_domains` directly as an operator).
- **Is caching working?** Re-request with `-H "If-None-Match: <etag>"` — expect
  `304`. After publishing a post, the ETag must change (the invalidation proof).
- **Sitemap size / splitting.** The index lists `ceil(count / SITEMAP_URLS_PER_PAGE)`
  children (≥1, capped at `SITEMAP_MAX_CHILD_PAGES`). A tenant beyond the ceiling
  has its sitemap truncated — surface it via the published-post count.
- **Rebuild.** There is nothing to rebuild — output is computed live per request
  (bounded) and cached only via HTTP validators. "Invalidation" is automatic (see
  above); to force a CDN refresh, purge the CDN by URL.
- **Empty tenant.** A tenant with no published content still serves a valid empty
  sitemap index + `/sitemap-1.xml`, and empty (but valid) feeds — never an error.

## Threat model (surface-specific, extends ADR-0028)

| Threat                         | Control                                                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Host-header poisoning          | URLs use the server-derived verified primary domain, never the request host; unverified hosts → 404.                           |
| XML/markup injection           | All sitemap/feed text/URL values XML-escaped (escape-never-reject); JSON feed uses `content_text` only.                        |
| Unpublished-content leakage    | `isPubliclyIndexable` gates every fact; drafts/scheduled/archived/deleted/private/unlisted never emitted.                      |
| Cache poisoning / cross-tenant | Cache signature is tenant/host/locale-first; a hit can never cross tenants or reflect a stale draft/delete.                    |
| Sitemap amplification          | Hard `SITEMAP_URLS_PER_PAGE` × `SITEMAP_MAX_CHILD_PAGES` ceiling; feeds capped at `feed_item_limit` (≤200).                    |
| Existence oracle               | Unknown host / disabled module / disabled surface all return the same generic 404, latency-normalized.                         |
| Anonymous abuse                | Responses are bounded + cacheable (short `max-age` + `stale-while-revalidate`); front with a rate limiter / CDN in production. |
