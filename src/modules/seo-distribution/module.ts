import { defineModule } from "../_shared/module-contract";
import {
  SEO_CONFIG_ACTIVITY_CODE,
  SEO_MODULE_KEY,
  SEO_NOT_FOUND_ACTIVITY_CODE,
  SEO_REDIRECT_ACTIVITY_CODE
} from "./domain/seo-permissions";

/** data_lifecycle registry key for the privacy-minimized 404 governance table (Issue #268). */
export const SEO_NOT_FOUND_LIFECYCLE_KEY =
  "seo_distribution.not_found_observations";

/**
 * `seo_distribution` — Official Optional Module admitted by ADR-0028 (Issue
 * #265), first runtime code landed by Issue #266 (epic #261 Wave 1). This is the
 * descriptor ADR-0028 §"Keputusan pendaftaran descriptor" deliberately deferred
 * out of the admission PR: it registers here, in the SAME PR that ships real
 * runtime code, bumping the base registry 17 → 18 (`EXPECTED_BASE_MODULE_COUNT`
 * in `scripts/scope-consistency-check.ts`, regenerated inventories) rather than
 * when the ADR was merely Accepted.
 *
 * ## What this module OWNS (the code this descriptor affirmatively describes)
 *
 * The central, tenant/domain/locale-aware SEO metadata renderer for public
 * pages: canonical URL + reciprocal `hreflang` alternates (+ `x-default`),
 * title/description/robots meta, Open Graph + Twitter card, and controlled
 * schema.org JSON-LD — all built once, in `domain/seo-document.ts` +
 * `domain/seo-head-rendering.ts`, from a content module's `SeoResourceFacts`
 * (the frozen `SeoFactsSource` contribution contract) plus this module's own
 * per-tenant SEO defaults (`awcms_micro_seo_tenant_settings`, sql/080) plus the
 * tenant's server-derived primary host (`tenant_domain`). It replaces the ad-hoc
 * per-route metadata derivation ADR-0028 §Konteks names as the drift risk.
 *
 * ## Direction of the arrow (ADR-0028 §2) — this module DEPENDS on nothing but Core
 *
 * `seo_distribution` is the CONSUMER/aggregator: content modules PROVIDE
 * `seo_facts`; this module discovers their adapters at the route composition
 * root and injects them. So `consumes` names `seo_facts` (from `blog_content`,
 * the module that owns the public content resources SEO renders) and
 * `media_library` (OG/Twitter/Organization image resolution) — both
 * `optional: true`, degrading safely when a tenant hasn't enabled them. NO
 * existing module is made to depend on `seo_distribution`, and its lifecycle
 * `dependencies` are ONLY the two Core modules (ADR-0028 §1), keeping the DAG
 * intact (`capabilities.consumes` is not a lifecycle edge — `module-contract.ts`).
 *
 * Base + derived content types flow through the SAME contract: a derived app's
 * own content type (`resourceType: "product"`, ...) is rendered by this module
 * without it ever knowing that type exists — the aggregator stays ignorant of
 * any specific content module (ADR-0028 §3).
 *
 * ## Landed in #267 (this module's second runtime slice)
 *
 * The public discovery/syndication surfaces — `/robots.txt`, the sitemap index +
 * bounded child sitemaps (`/sitemap.xml`, `/sitemap-{n}.xml`), and RSS/Atom/JSON
 * feeds (`/feed.xml`, `/atom.xml`, `/feed.json`) — served as public Astro
 * XML/text routes (NOT OpenAPI, like `/news`), aggregating the SAME frozen
 * `seo_facts` contract, host server-derived from `tenant_domain`, with HTTP cache
 * validators (ETag/Last-Modified/304) and per-tenant feed config on
 * `awcms_micro_seo_tenant_settings` (sql/082). No new permission is seeded:
 * these routes are unauthenticated by design (nothing to gate — the ADR-0028 §9
 * `sitemap.read` note assumed an authenticated surface that does not exist), and
 * the feed config is part of the existing `config` activity.
 *
 * ## Landed in #268 (this module's third and final Wave-1 runtime slice)
 *
 * Controlled, tenant-contained redirect management + broken-link governance:
 * exact-path redirect rules (`awcms_micro_seo_redirects`, sql/083, RLS FORCE'd),
 * resolved in `src/middleware.ts` AFTER tenant/domain + locale normalization and
 * BEFORE public content routing, EXCLUDING admin/API/auth/static/system paths
 * (`domain/redirect-eligibility.ts`, the admin-route-hijack defense); the ADR-0010
 * legacy `/blog/{tenantCode}` → `/news` auto-redirect (policy-gated on
 * `awcms_micro_seo_redirect_settings`); URL-change capture into audited redirect
 * proposals; privacy-minimized 404 governance (`awcms_micro_seo_not_found_observations`,
 * aggregate + retention-bound); and the admin API under `/api/v1/seo/redirects/*` +
 * `/api/v1/seo/not-found/*`. EVERY redirect target flows through the frozen
 * `assertSafeRedirectTarget` open-redirect guard; normalization
 * (`domain/redirect-path.ts`) rejects CRLF/traversal/Unicode-confusion/protocol-
 * relative; chains are bounded + non-recursive (`domain/redirect-chain.ts`, no
 * pattern engine → no ReDoS). Pattern/prefix rules are DEFERRED to a future ADR.
 *
 * ## Deliberately NOT here yet
 *
 * `navigation` is still undeclared: the redirect/404 ADMIN API exists, not an admin
 * screen — the preview/dashboard UI is a documented follow-up (same posture as the
 * config API in #266). `events` stays undeclared: URL-change capture is an audited
 * synchronous hook (like blog_content's slug-change log line), not yet a published
 * domain event through `domain-event-runtime`. `jobs` remains undeclared: redirect
 * resolution is live per request (bounded); 404 retention rides the generic
 * data_lifecycle purge engine (declared below), not a module-owned job.
 */
export const seoDistributionModule = defineModule({
  key: SEO_MODULE_KEY,
  name: "SEO & Distribution",
  version: "0.3.0",
  status: "active",
  description:
    "Central tenant/domain/locale-aware SEO metadata renderer for public pages (ADR-0028, Official Optional Module). Owns `awcms_micro_seo_tenant_settings` (sql/080 — per-tenant SEO defaults: site identity, default social image, Twitter handle, Organization identity, and a tenant-wide noindex switch, RLS FORCE'd) and the central document builder/renderer (`domain/seo-document.ts` + `domain/seo-head-rendering.ts`) that emits canonical URL, reciprocal hreflang alternates + x-default, title/description/robots meta, Open Graph + Twitter card, and controlled schema.org JSON-LD. It is the CONSUMER/aggregator of the frozen `seo_facts` contribution contract (`_shared/ports/seo-facts-port.ts`): content modules (`blog_content`, and any derived content type) PROVIDE `SeoResourceFacts`; this module discovers their adapters at the route composition root and never imports a content module's internals. The canonical host is server-derived from the tenant's verified primary domain (`tenant_domain`), NEVER a request header (host-header-poisoning defense); OG/Organization images resolve through `media_library` (same-tenant, verified); JSON-LD is emitted only through the port's `renderControlledJsonLd` guard (injection blocked by a controlled `@type`/key schema, not ad-hoc sanitization); publication state is honored via the port's `isPubliclyResolvable`/`isPubliclyIndexable` (draft/scheduled/archived/deleted/private/unpublished/noindex never reach public output); and the render cache key is tenant-first (`buildSeoCacheKey`). Issue #267 adds the public discovery/syndication surfaces — robots.txt, the sitemap index + bounded child sitemaps, and RSS/Atom/JSON feeds — as public Astro XML/text routes aggregating the same `seo_facts` contract, with tenant/domain/locale-specific ETag/Last-Modified caching and per-tenant feed config (sql/082). Issue #268 ships controlled, tenant-contained redirect governance: exact-path redirect rules (sql/083, RLS FORCE'd) resolved in `src/middleware.ts` before public content routing and EXCLUDING admin/API/auth/static/system paths (`domain/redirect-eligibility.ts`, enforced at BOTH resolve and write time), the policy-gated legacy `/blog/{tenantCode}` → `/news` auto-redirect, audited URL-change capture, bounded non-recursive chain/loop prevention (every `verified_external` target on the tenant's own hosts is folded back into loop detection), privacy-minimized 404 governance (sql/083), and the admin API under `/api/v1/seo/redirects/*` + `/api/v1/seo/not-found/*` — every target still routed through the frozen `assertSafeRedirectTarget` open-redirect guard.",
  dependencies: ["tenant_admin", "identity_access"],
  type: "domain",
  capabilities: {
    consumes: [
      // `seo_facts` — the contribution contract this module aggregates. Provided
      // by `blog_content` (which owns the public post/page resources SEO
      // renders; the `/news` and `/blog/{tenantCode}` routes are both its code).
      // Optional: a tenant with no content module enabled simply contributes no
      // resource facts, and the renderer degrades (no page to render).
      { capability: "seo_facts", providedBy: "blog_content", optional: true },
      // `media_library` — OG/Twitter/Organization image resolution
      // (same-tenant, verified). Optional: absent → text-only social cards.
      {
        capability: "media_library",
        providedBy: "media_library",
        optional: true
      }
    ]
  },
  api: {
    openApiPath: "openapi/awcms-micro-public-api.openapi.yaml",
    basePath: "/api/v1/seo"
  },
  permissions: [
    {
      activityCode: SEO_CONFIG_ACTIVITY_CODE,
      action: "read",
      description:
        "Read this tenant's SEO defaults (site identity, default social image, robots policy)"
    },
    {
      activityCode: SEO_CONFIG_ACTIVITY_CODE,
      action: "update",
      description:
        "Update this tenant's SEO defaults — changes the public metadata/indexability surface (high-risk, audited)"
    },
    {
      activityCode: SEO_REDIRECT_ACTIVITY_CODE,
      action: "read",
      description:
        "List/search redirect rules, preview redirect chains, and explain conflicts (404 governance data requires not_found.read)"
    },
    {
      activityCode: SEO_REDIRECT_ACTIVITY_CODE,
      action: "create",
      description:
        "Create redirect rules, bulk-import, and capture URL changes into rules (high-risk, idempotency-keyed, audited)"
    },
    {
      activityCode: SEO_REDIRECT_ACTIVITY_CODE,
      action: "update",
      description:
        "Edit/activate/deactivate/archive redirect rules and change per-tenant redirect policy (high-risk, audited)"
    },
    {
      activityCode: SEO_REDIRECT_ACTIVITY_CODE,
      action: "delete",
      description: "Soft-delete, restore, or purge redirect rules (audited)"
    },
    {
      activityCode: SEO_NOT_FOUND_ACTIVITY_CODE,
      action: "read",
      description:
        "Read the privacy-minimized 404/broken-link governance dashboard"
    },
    {
      activityCode: SEO_NOT_FOUND_ACTIVITY_CODE,
      action: "update",
      description:
        "Resolve, dismiss, or attach a suggested redirect to a 404 observation (audited)"
    }
  ],
  dataLifecycle: [
    {
      key: SEO_NOT_FOUND_LIFECYCLE_KEY,
      tableName: "awcms_micro_seo_not_found_observations",
      ownerModuleKey: SEO_MODULE_KEY,
      scope: "tenant",
      cursorColumn: "last_seen_at",
      retentionClass: "analytics_telemetry",
      retentionMinDays: 7,
      retentionMaxDays: 365,
      defaultRetentionDays: 30,
      partition: {
        eligible: false,
        rationale:
          "Aggregate table (one upsert row per distinct tenant+path+referrer+locale+host, not one row per hit), so cardinality is bounded by distinct 404 paths, not by traffic — the volume that would justify range-partitioning is already collapsed by the upsert. A short retention window (30d default) plus the tenant+last_seen_at index keeps the age-based purge cheap without partitioning."
      },
      archive: {
        archivable: false,
        rationale:
          "Privacy-first, minimized telemetry (sanitized path + bare referrer domain only, never full URLs/queries/secrets). Retaining it longer via an archive would work against the module's own privacy posture (same reasoning as visitor_analytics.visit_events); it is simply purged when stale."
      },
      deletion: {
        mode: "hard_delete",
        rationale:
          "A straight age-based DELETE of stale observations — there is no soft-delete lifecycle for 404 telemetry, and nothing references these rows once purged."
      },
      legalHold: {
        applicable: false,
        precedence: "not_applicable"
      },
      requiredIndexes: [
        {
          columns: ["tenant_id", "last_seen_at"],
          purpose:
            "awcms_micro_seo_not_found_tenant_last_seen_idx (sql/083) — the exact (tenant, cursor) composite the generic purge engine filters + orders by for its bounded age-based DELETE."
        }
      ],
      batchLimit: 5000,
      backupRestoreNotes:
        "No special backup/restore implications: derived, purgeable, privacy-minimized telemetry. A restore that omits this table loses only historical 404 aggregates (regenerated from live traffic), never any source-of-truth data.",
      executionMode: "generic"
    }
  ]
});
