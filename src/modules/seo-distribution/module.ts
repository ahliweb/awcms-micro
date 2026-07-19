import { defineModule } from "../_shared/module-contract";
import {
  SEO_CONFIG_ACTIVITY_CODE,
  SEO_MODULE_KEY
} from "./domain/seo-permissions";

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
 * ## Deliberately NOT here yet
 *
 * Sitemap/robots.txt/feeds (#267) and redirect/URL-change/404 (#268) are
 * separate runtime PRs in this same module — so `jobs`, `events`, the
 * `redirects.*`/`sitemap.read` permissions, and the redirect
 * `dataLifecycle`/`HighVolumeTableDescriptor` are not declared until their code
 * lands (the same "declare a descriptor field when the code exists, not before"
 * convention every module here follows). `navigation` is likewise undeclared:
 * #266 ships the config ADMIN API (`/api/v1/seo/config`), not an admin screen —
 * the preview UI is a follow-up.
 */
export const seoDistributionModule = defineModule({
  key: SEO_MODULE_KEY,
  name: "SEO & Distribution",
  version: "0.1.0",
  status: "active",
  description:
    "Central tenant/domain/locale-aware SEO metadata renderer for public pages (ADR-0028, Official Optional Module). Owns `awcms_micro_seo_tenant_settings` (sql/080 — per-tenant SEO defaults: site identity, default social image, Twitter handle, Organization identity, and a tenant-wide noindex switch, RLS FORCE'd) and the central document builder/renderer (`domain/seo-document.ts` + `domain/seo-head-rendering.ts`) that emits canonical URL, reciprocal hreflang alternates + x-default, title/description/robots meta, Open Graph + Twitter card, and controlled schema.org JSON-LD. It is the CONSUMER/aggregator of the frozen `seo_facts` contribution contract (`_shared/ports/seo-facts-port.ts`): content modules (`blog_content`, and any derived content type) PROVIDE `SeoResourceFacts`; this module discovers their adapters at the route composition root and never imports a content module's internals. The canonical host is server-derived from the tenant's verified primary domain (`tenant_domain`), NEVER a request header (host-header-poisoning defense); OG/Organization images resolve through `media_library` (same-tenant, verified); JSON-LD is emitted only through the port's `renderControlledJsonLd` guard (injection blocked by a controlled `@type`/key schema, not ad-hoc sanitization); publication state is honored via the port's `isPubliclyResolvable`/`isPubliclyIndexable` (draft/scheduled/archived/deleted/private/unpublished/noindex never reach public output); and the render cache key is tenant-first (`buildSeoCacheKey`). Sitemap/feeds (#267) and redirects/URL-change/404 (#268) are separate runtime PRs in this same module and are deliberately not implemented here.",
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
    }
  ]
});
