# seo_distribution

Official Optional Module (ADR-0028, admitted by Issue #265). **This module is the
CONSUMER/aggregator of SEO facts, not a provider** — content modules provide
`seo_facts`; `seo_distribution` composes them into public metadata. Nothing in
the base registry depends on it, and its lifecycle `dependencies` are only the
two Core modules (`tenant_admin`, `identity_access`), so the module DAG is
untouched.

Issue #266 (epic #261 Wave 1) landed the **first runtime code**: the central
metadata renderer plus its tenant-config surface. Sitemap/robots.txt/feeds
(#267) and redirects/URL-change/404 (#268) are separate runtime PRs in this same
module and are **not** implemented yet.

## What #266 ships

### The central renderer (the reason the module exists)

`domain/seo-document.ts` + `domain/seo-head-rendering.ts` turn one resource's
`SeoResourceFacts` (the frozen `_shared/ports/seo-facts-port.ts` contract) plus
the tenant's SEO defaults plus the server-derived primary host into a single,
deterministic `<head>`:

- **canonical URL** — `https://{primary-host}{path}`, host **always** from the
  tenant's verified primary domain (`tenant_domain`), never a request header;
  degrades to a relative canonical when there is no primary domain (offline-lan
  safe, no invented host);
- **hreflang alternates** (+ `x-default`) — only reciprocal, published locales
  (the provider excludes non-existent translations);
- **title / description / robots** — resource facts win over tenant defaults;
- **Open Graph + Twitter card** — `og:url` = canonical; `og:image`/`twitter:image`
  resolved through `media_library` (same-tenant, verified), never a raw URL;
- **controlled JSON-LD** — `WebSite`/`Organization` (from tenant config) +
  provider `Article` nodes, emitted **only** through the port's
  `renderControlledJsonLd` guard (injection blocked by a closed `@type`/key
  schema, not ad-hoc sanitization), and **only** for indexable resources.

`application/seo-metadata-service.ts` is the composition point: it injects the
content module's `SeoFactsSource` adapter (provider) and `MediaLibraryPort`,
resolves the host (`application/resolve-canonical-host.ts`) and tenant defaults,
and returns the rendered head plus a tenant-first cache key
(`buildSeoCacheKey`). It imports no content module — the ports are plain
parameters wired at the route composition root.

### Publication-state handling

Every visibility decision delegates to the frozen guards
`isPubliclyResolvable` / `isPubliclyIndexable`. A resource the provider reports
as draft / scheduled-future / archived / deleted / private / unpublished is
**not renderable** (the route returns its usual 404/deny); a resolvable but
`noindex` (or tenant-wide `noindex`) resource renders with `robots: noindex` and
carries **no** structured data. There is no code path that emits an unpublished
resource to public output.

### Tenant SEO defaults + admin API

`awcms_micro_seo_tenant_settings` (sql/080, RLS FORCE'd, one row per tenant)
holds site identity, default social/Organization images, Twitter/X handle, and a
tenant-wide `noindex` switch. `GET`/`PUT /api/v1/seo/config`
(`src/pages/api/v1/seo/config.ts`) reads/updates it:

- ABAC-gated (`seo_distribution.config.read` / `.update`, sql/081);
- `PUT` is high-risk — requires an `Idempotency-Key` and records an audit event
  on every write (`application/seo-config-directory.ts`);
- tenant-scoped (`withTenant` + RLS) — tenant A can never read or change tenant
  B's config.

## Security posture (ADR-0028 threat model)

| Threat                         | Control                                                                                                                                                         |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Host-header poisoning          | Canonical/OG/hreflang host is server-derived from `tenant_domain` (`resolve-canonical-host.ts`); the renderer never reads `Host`/`X-Forwarded-Host`.            |
| JSON-LD injection              | Only `renderControlledJsonLd` emits JSON-LD (validates the controlled `@type`/key schema AND escapes `<>&`/U+2028/U+2029). No hand-serialized JSON-LD anywhere. |
| Unpublished-content leakage    | `isPubliclyResolvable`/`isPubliclyIndexable` gate every emission; structured data only for indexable resources.                                                 |
| Cache poisoning / cross-tenant | Cache key is tenant-first via `buildSeoCacheKey` (throws without tenant+host+locale). Config table is RLS FORCE'd.                                              |
| Metadata bounds                | Config lengths bounded in `domain/seo-config.ts` and by CHECK constraints in sql/080.                                                                           |

## Contribution contract (`seo_facts`)

`blog_content` is the base's single declared `seo_facts` provider
(`blog-content/application/seo-facts-port-adapter.ts`) — it owns the public
post/page resources SEO renders. A derived application's own content type flows
through the identical contract by shipping its own
`<module>/application/seo-facts-port-adapter.ts`; `seo_distribution` never learns
that type exists. Only one module may declare `provides: ["seo_facts"]` at a time
(`module-composition.ts`'s `capability_provider_conflict`).
