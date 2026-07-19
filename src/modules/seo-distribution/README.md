# seo_distribution

Official Optional Module (ADR-0028, admitted by Issue #265). **This module is the
CONSUMER/aggregator of SEO facts, not a provider** — content modules provide
`seo_facts`; `seo_distribution` composes them into public metadata. Nothing in
the base registry depends on it, and its lifecycle `dependencies` are only the
two Core modules (`tenant_admin`, `identity_access`), so the module DAG is
untouched.

Issue #266 (epic #261 Wave 1) landed the **first runtime code**: the central
metadata renderer plus its tenant-config surface. Issue #267 added the public
**discovery/syndication surfaces** — robots.txt, sitemap index + bounded child
sitemaps, and RSS/Atom/JSON feeds. Redirects/URL-change/404 (#268) remain a
separate runtime PR in this same module and are **not** implemented yet.

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

## What #267 ships — public discovery / syndication

Public Astro XML/text routes (NOT OpenAPI — like `/news`), unauthenticated by
design, aggregating the SAME `seo_facts` contract:

| Route              | Content       | Notes                                                                                                                                |
| ------------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `/robots.txt`      | `text/plain`  | Disallows `/admin/` + `/api/`; advertises the absolute sitemap; `Disallow: /` when the tenant-wide `noindex` is on.                  |
| `/sitemap.xml`     | sitemap index | Sizes itself from a bounded `summarize` roll-up; lists `/sitemap-{n}.xml` children (always ≥1, capped at the amplification ceiling). |
| `/sitemap-{n}.xml` | `<urlset>`    | One bounded page (`[(n-1)·perPage, n·perPage)` of the stable order) with reciprocal `hreflang` + published image refs.               |
| `/feed.xml`        | RSS 2.0       | Latest `feed_item_limit` (≤200) items, newest-first, stable permalink GUIDs, enclosure images. `?locale=` narrows.                   |
| `/atom.xml`        | Atom 1.0      | Same item set; Atom `<id>`/`<published>`/`<updated>`.                                                                                |
| `/feed.json`       | JSON Feed 1.1 | Same item set; `content_text` only (never tenant HTML).                                                                              |

- **Tenant/host** resolved by `withSeoPublicTenant` (server-controlled host, gate
  on `seo_distribution` enabled); every non-serving outcome is one generic,
  latency-normalized 404.
- **Host is server-derived** from the tenant's verified **primary** domain — the
  arriving request host is NEVER used for URL generation (host-poisoning defense).
  When a tenant has **no** active primary domain, sitemap index/child + all feeds
  **404** (their `<loc>`/`<id>`/`<guid>` MUST be absolute — a relative-URL document
  is invalid), while `/robots.txt` still serves 200 and simply omits its `Sitemap:`
  line. This refines ADR-0028 §5.4's "degrade to a relative canonical" — safe for
  an in-page canonical, but not for a machine-consumed sitemap/feed.
- **Bounded**: the sitemap index sizes from a single `summarize` aggregate; each
  child page is one bounded window; feeds are capped by `feed_item_limit`. No
  request enumerates all tenant content. Hard ceilings in `domain/discovery-limits.ts`.
- **Caching** (`domain/discovery-cache.ts`): a deterministic signature over
  `kind + tenantId + host + locale + contractVersion + configFingerprint +
contentRoll-up` (NUL-joined so the free-text parts cannot merge across their
  boundary; `tenantId` isolates tenants that share the null-host sentinel)
  yields a strong `ETag` + `Last-Modified`; `If-None-Match`/`If-Modified-Since` →
  304; `Cache-Control: public, max-age, s-maxage, stale-while-revalidate`. Because
  the validators derive from content/domain/config state, any
  publish/update/archive/delete/domain/locale/config change invalidates the
  affected output (event-driven invalidation via content-derived validators — no
  server-side content store; the CDN/edge integration ADR-0028 §7 calls opt-in /
  full-online-only is out of scope here).
- **Feed config** (`awcms_micro_seo_tenant_settings`, extended by **sql/082**):
  `feed_title`/`feed_description`/`feed_logo_media_id`/`feed_item_limit`
  (1–200)/`included_resource_types` (allow-list, null=all)/`sitemap_enabled`/
  `feeds_enabled`, all within safe bounds (CHECK constraints + app validation).
  Managed through the same `GET`/`PUT /api/v1/seo/config` (existing `config`
  activity — no new permission; the public routes are unauthenticated).
- **Composition root**: `src/lib/seo/discovery-providers.ts` wires the enabled
  `seo_facts` providers + media port; `src/lib/seo/discovery-route.ts` runs the
  pipeline. The module's own `application`/`domain` import no content module.

## Security posture (ADR-0028 threat model)

| Threat                         | Control                                                                                                                                                                          |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Host-header poisoning          | Canonical/OG/hreflang host is server-derived from `tenant_domain` (`resolve-canonical-host.ts`); the renderer never reads `Host`/`X-Forwarded-Host`.                             |
| JSON-LD injection              | Only `renderControlledJsonLd` emits JSON-LD (validates the controlled `@type`/key schema AND escapes `<>&`/U+2028/U+2029). No hand-serialized JSON-LD anywhere.                  |
| Unpublished-content leakage    | `isPubliclyResolvable`/`isPubliclyIndexable` gate every emission; structured data only for indexable resources.                                                                  |
| Cache poisoning / cross-tenant | Cache key is tenant-first via `buildSeoCacheKey` (throws without tenant+host+locale). Config table is RLS FORCE'd.                                                               |
| Metadata bounds                | Config lengths bounded in `domain/seo-config.ts` and by CHECK constraints in sql/080 + sql/082 (feed limit 1–200, include-list ≤50).                                             |
| Sitemap amplification (#267)   | Hard ceilings (`discovery-limits.ts`): `SITEMAP_URLS_PER_PAGE` + `SITEMAP_MAX_CHILD_PAGES`; feed items capped by `feed_item_limit` (≤200). No unbounded per-request scan.        |
| XML injection (#267)           | All sitemap/feed text/URL values XML-escaped (escape-never-reject, inherited from the frozen guards); JSON feed uses `content_text` (never tenant HTML).                         |
| Cache poisoning (#267)         | The discovery cache signature is tenant/host/locale-first; a cache hit can never cross tenants or reflect a stale draft/deleted resource (validators re-derive from live state). |

## Contribution contract (`seo_facts`)

`blog_content` is the base's single declared `seo_facts` provider
(`blog-content/application/seo-facts-port-adapter.ts`) — it owns the public
post/page resources SEO renders. A derived application's own content type flows
through the identical contract by shipping its own
`<module>/application/seo-facts-port-adapter.ts`; `seo_distribution` never learns
that type exists. Only one module may declare `provides: ["seo_facts"]` at a time
(`module-composition.ts`'s `capability_provider_conflict`).

## Documented follow-ups (out of #266/#267 scope)

- **Resource-type coverage.** The `blog_content` adapter maps the `blog_post`
  resource type only. The homepage/website identity, a generic `blog_page`, and
  `BreadcrumbList` facts are NOT yet produced by a provider — the renderer +
  discovery aggregator support them (the contract is generic), but no adapter
  emits them yet. A follow-up (tracked against ADR-0028's consequences).
- **Per-item feed author + full content.** The Atom feed carries a MANDATORY
  feed-level `<author>` (named for the publication — RFC 4287 §4.1.1), but per-ENTRY
  author and full-body `content_html` are not in `SeoResourceFacts` yet (feeds use
  the summary as `content_text`). Enriching them to a per-item author needs a
  facts-contract extension — a follow-up.
- **Deep-page sitemap keyset.** Child sitemap pages use `OFFSET` over the tenant's
  bounded published set (index-backed; query-plan proven for the FIRST page —
  `OFFSET 0` — only). A large `OFFSET` still walks and discards the skipped rows,
  so deep pages on huge tenants would benefit from a keyset cursor / precomputed
  projection — a scale follow-up, only if a query-plan test proves it needed
  (ADR-0028 §7).
- **Sitemap index page-count vs. child filter.** The index sizes its child-page
  count from the cheap `summarize` roll-up (total published facts), but each child
  page additionally filters by `isPubliclyIndexable` + `included_resource_types` +
  "has a `sitemap` block". So the advertised page count can slightly OVER-count
  (a trailing child page may render fewer/zero `<url>`s). This is protocol-valid
  (an empty `<urlset>` is well-formed and crawlers tolerate a listed-but-empty
  child) and stays within the amplification ceiling; tightening the count to the
  post-filter total is a follow-up (needs a filtered `summarize`).
- **CDN/edge cache.** #267 ships HTTP-level validators only. The opt-in,
  full-online-only CDN/edge integration ADR-0028 §7 describes (locking on the
  same tenant/host/locale key) is out of scope and must not degrade the
  offline-lan profile when off.
- **Permission backfill.** `sql/081` seeds `seo_distribution.config.{read,update}`
  into the global catalog, so only tenants created AFTER that migration get them.
  Existing tenants' `owner` role is not retroactively granted them — a functional
  (not security) release step. `sql/082` adds NO new permission (feed config is
  part of the existing `config` activity; the public routes are unauthenticated).

## Redirect governance, URL-change capture & 404 governance (Issue #268)

The third Wave-1 runtime slice. Controlled, tenant-contained EXACT-PATH redirects,
resolved in `src/middleware.ts` after tenant/domain + locale normalization and
before public content routing, EXCLUDING admin/API/auth/static/system paths. Full
spec + operator guide + privacy/retention matrix + threat model:
[`docs/awcms-micro/seo-distribution-redirects.md`](../../../docs/awcms-micro/seo-distribution-redirects.md).

Key files: `domain/redirect-{path,eligibility,target,rule,chain,query-policy,settings}.ts`,
`domain/{url-change-plan,legacy-blog-redirect}.ts`,
`application/{redirect-directory,redirect-resolution-service,redirect-safety,redirect-settings-directory,not-found-directory,url-change-capture,tenant-allowed-hosts}.ts`,
composition root `src/lib/seo/redirect-middleware.ts`, routes under
`src/pages/api/v1/seo/{redirects,not-found}/*`, migrations `sql/083` (schema +
worker GRANT) / `sql/084` (permissions).

Security invariants: every target flows through the frozen
`assertSafeRedirectTarget` guard (on write AND every resolve); normalization
rejects CRLF/traversal/Unicode-confusion/protocol-relative; chains are bounded +
non-recursive (no pattern engine → no ReDoS); the eligibility deny-list is the
admin-route-hijack defense; server-derived tenant/host only; RLS FORCE on all three
new tables.

**Documented follow-ups (NOT in #268):**

- **Prefix / pattern (regex) rules** are deferred to a future ADR — they need a
  pattern engine (ReDoS surface) and a bounded, non-backtracking design. #268 is
  exact-path only. See the spec doc §9.
- **Admin UI screen** (redirect list/editor + 404 dashboard) is a follow-up; #268
  ships the API + governance, not a rendered screen (same posture as the #266
  config API). `navigation` stays undeclared.
- **True domain event** for URL-change capture (through `domain-event-runtime`) is
  a follow-up; today capture is an audited synchronous hook (like blog_content's
  slug-change log line), so `events` stays undeclared.
- **blog_content slug-change auto-wiring**: `POST /seo/redirects/capture-url-change`
  is the seam a content module / operator / automation drives; wiring blog_content's
  post PATCH to call it automatically is a follow-up (kept out to keep this PR
  atomic — not editing blog_content's heavily-tested route).
- **Hit-count under CDN**: a CDN-cached 301 makes `hit_count` a lower bound (spec
  doc §11).
- **Permission backfill** for existing tenants (migration 084 seeds the catalog for
  new tenants only — a functional, not security, release step).
