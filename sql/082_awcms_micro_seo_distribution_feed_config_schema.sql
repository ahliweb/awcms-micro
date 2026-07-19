-- Issue #267 (epic #261 Wave 1, ADR-0028 §4/§9) — the second runtime slice of
-- `seo_distribution`: tenant-aware sitemap index + bounded child sitemaps,
-- robots.txt, and RSS/Atom/JSON feeds. Those public discovery/syndication
-- surfaces need a small amount of tenant CONFIGURATION beyond the site-identity
-- defaults migration 080 already added — the feed's own title/description/logo,
-- an item limit, an optional content-type allow-list, and per-surface enable
-- switches. ADR-0028 §9 ("Add tenant configuration for feed title/description/
-- logo, included content types, item limit, and robots directives within safe
-- bounds") calls for exactly this, so the `bila perlu` condition is met.
--
-- ## Why EXTEND migration 080's table rather than add a new one
--
-- This is the same one-row-per-tenant, upsert-shaped SEO config
-- (`awcms_micro_seo_tenant_settings`) — feed identity is SEO config, not a new
-- entity with its own lifecycle. Adding columns keeps a single tenant-scoped
-- config row (one RLS policy, one upsert path in
-- `seo-config-directory.ts`) instead of a second table joined on tenant_id for
-- no benefit. AGENTS.md rule: schema change = a NEW sequential migration; the
-- shipped migration 080 is never edited.
--
-- Tenant isolation is UNCHANGED and inherited: `awcms_micro_seo_tenant_settings`
-- is already ENABLE + FORCE ROW LEVEL SECURITY with the
-- `tenant_isolation` policy keyed on `app.current_tenant_id` (migration 080), so
-- every new column is reachable only within the owning tenant's transaction, and
-- the discovery routes' cache key is tenant-first (`buildSeoCacheKey`) — one
-- tenant's feed config can never shape another tenant's output.
--
-- ## Bounds are the abuse control (ADR-0028 §9 "sitemap amplification")
--
-- Every free-text field is length-capped and `feed_item_limit` is range-checked
-- at the DB level as a defense-in-depth floor UNDER the application validation
-- (`domain/seo-config.ts`). A tenant cannot store a 10 MB feed title that would
-- bloat every rendered feed, nor a 5-million item limit that would defeat the
-- feed's whole point of being bounded. The protocol ceilings the ROUTES enforce
-- (50k URLs / 50 MB per sitemap file) are separate, hard, non-configurable caps
-- in code; `feed_item_limit` only ever makes a feed SMALLER, never larger than
-- the code ceiling.
--
-- ## `feed_logo_media_id` is NOT a foreign key — same reasoning as migration 080
--
-- Like `default_social_media_id`/`organization_logo_media_id`, the feed logo
-- references a `media_library` object but is stored as a bare `uuid` with NO
-- cross-module FK (ADR-0013 §6 no-cross-module coupling): a raw id is never
-- trusted; the renderer resolves it through `MediaLibraryPort` (same-tenant,
-- verified) at render time and simply drops an id that does not resolve.
--
-- ## `included_resource_types` is an OPTIONAL allow-list, NULL = all
--
-- The `seo_facts` aggregator is generic — `resourceType` is opaque (`blog_post`
-- today, a derived app's `product`/… tomorrow). A tenant may narrow which
-- content types appear in its sitemap/feeds; NULL (the default) means "every
-- eligible type", so existing tenants keep their current behavior with no
-- backfill. Cardinality is capped so the array itself cannot grow unbounded;
-- element shape/length is validated in the application layer.

ALTER TABLE awcms_micro_seo_tenant_settings
  ADD COLUMN IF NOT EXISTS feed_title text,
  ADD COLUMN IF NOT EXISTS feed_description text,
  ADD COLUMN IF NOT EXISTS feed_logo_media_id uuid,
  ADD COLUMN IF NOT EXISTS feed_item_limit integer NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS included_resource_types text[],
  ADD COLUMN IF NOT EXISTS sitemap_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS feeds_enabled boolean NOT NULL DEFAULT true;

ALTER TABLE awcms_micro_seo_tenant_settings
  ADD CONSTRAINT awcms_micro_seo_tenant_settings_feed_title_len
    CHECK (feed_title IS NULL OR char_length(feed_title) <= 200);

ALTER TABLE awcms_micro_seo_tenant_settings
  ADD CONSTRAINT awcms_micro_seo_tenant_settings_feed_description_len
    CHECK (feed_description IS NULL OR char_length(feed_description) <= 500);

-- Range floor: 1..200 items. The application default is 50 (same as the legacy
-- `/news/feed.xml` `FEED_ITEM_LIMIT`); the ceiling of 200 keeps every feed
-- bounded and small regardless of tenant input.
ALTER TABLE awcms_micro_seo_tenant_settings
  ADD CONSTRAINT awcms_micro_seo_tenant_settings_feed_item_limit_range
    CHECK (feed_item_limit BETWEEN 1 AND 200);

-- Cardinality cap on the optional content-type allow-list — NULL (all types)
-- or a bounded list. Per-element length/shape is enforced in the app layer.
ALTER TABLE awcms_micro_seo_tenant_settings
  ADD CONSTRAINT awcms_micro_seo_tenant_settings_included_types_bounded
    CHECK (
      included_resource_types IS NULL
      OR array_length(included_resource_types, 1) <= 50
    );
