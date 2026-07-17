import { defineModule } from "../_shared/module-contract";

export const newsPortalModule = defineModule({
  key: "news_portal",
  name: "News Portal",
  version: "0.4.0",
  status: "active",
  description:
    "Editorial + media layer conceptually on top of blog_content/tenant_domain/visitor_analytics for a full-online, R2-only public news portal (epic `news_portal` #631-#642/#649). Issue #632 added ONLY the tenant module preset `news_portal_full_online_r2` (`module-management/domain/module-presets.ts`) and its activation readiness gate (`domain/news-portal-preset-readiness.ts`, `domain/news-media-r2-config.ts`, `application/apply-news-portal-preset.ts`). Issue #633 added the tenant-scoped R2-only media object registry (schema + domain/application helpers), permission constants only (not yet wired into this descriptor). Issue #634 adds the direct-to-R2 presigned upload flow — `POST /api/v1/media/news-images/upload-sessions` (create), `.../{id}/finalize` (real R2 `GET` + magic-byte MIME sniffing + server-side SHA-256 checksum, NOT `HEAD`-only — see `news-media-r2-verification.ts`), `.../{id}/cancel` — and is the first issue with a real HTTP surface, so `permissions`/`api` are now declared below (matching `MEDIA_PERMISSIONS`, `news-media-permissions.ts`, exactly — see that file's own header for why #634 must reuse those constants rather than invent `media_objects.news_images.*` names from the issue's own body text). Issue #637 (this update) adds the editorial homepage section composer — `POST/GET /api/v1/news-portal/homepage-sections`, `PATCH/DELETE .../{id}` (`homepage_sections` activityCode, `read`/`configure` actions, same action pair `blog_content`'s ads/menus/widgets already use) plus a public composer (`homepage-section-composer.ts`) consumed by `/news/index.ts`, and its own admin UI page (`admin/news-portal/homepage-sections.astro`) — the first navigation-worthy admin screen this module ships, so `navigation` is now declared below too (one entry, same single-top-level-page-then-sub-navigation-inside-the-page convention `blog_content`'s single `/admin/blog` entry uses, even though this module only has one admin page so far). `settings`/`jobs`/`health` remain deliberately undeclared — no per-tenant setting, background job, or health check exists yet for this module specifically (same convention `visitor_analytics`, Issue #617, used before its own features landed). `dependencies` deliberately does NOT list blog_content/tenant_domain/visitor_analytics despite the prose relationship above: this module has zero functional code importing/calling into any of them yet, and `blog_content`/`tenant_domain` themselves only depend on foundation modules (never on each other) for the exact same reason (see their own module.ts) — declaring a hard dependency here would make the reverse-dependency guard (`evaluateModuleDisable`'s MODULE_REVERSE_DEPENDENCY_ACTIVE) block disabling blog_content/tenant_domain/visitor_analytics for EVERY tenant (news_portal is enabled by default like every module), which broke existing integration tests when first tried (see git history/PR discussion) and is not something #632's own scope justifies. The preset's own `enabledModuleKeys` ordering (`module-management/domain/module-presets.ts`'s `planEnableOrder`) is what sequences enabling blog_content/tenant_domain/visitor_analytics before news_portal WITHIN one preset application — a permanent hard dependency is not needed for that. Issue #681 (epic #679, platform-hardening) removed the direct `blog-content`/`news-portal` application-layer cross-imports this description used to note here (`homepage-section-composer.ts`/`homepage-section-reference-validation.ts` importing `blog-content` directly, and `blog-content`'s `news-media-reference-gate.ts` importing this module directly) — both directions now go through `_shared/ports/` capability interfaces, declared below and wired at the composition root (route handlers), never a raw cross-module import inside either module's `application`/`domain` tree. See `capabilities` below and `.claude/skills/awcms-micro-news-portal/SKILL.md`'s §681 section. Issue #638 (this update) adds R2-only advertisement placement presets — `POST/GET /api/v1/news-portal/ad-placements`, `PATCH/DELETE .../{id}` (`ad_placements` activityCode, `read`/`configure` actions, same action pair `homepage_sections` already uses) plus an admin UI page (`admin/news-portal/ad-placements.astro`, second navigation entry). Deliberately a NEW table (`awcms_micro_news_portal_ad_placements`, migration 048), not an extension of `blog_content`'s existing free-URL `awcms_micro_blog_ads` — every row here references a verified R2 media object by a real foreign key (`media_object_id`), so R2-only-ness holds by construction with no runtime mode gate needed, entirely within this module's own code (no new cross-module port required).",
  dependencies: ["tenant_admin", "identity_access"],
  type: "domain",
  // ADR-0026 steps 3-4 — this module no longer PROVIDES anything. It used to
  // provide `news_media` (retired), but only because the media registry happened
  // to be born inside it; two of that port's three methods were pure registry
  // reads, and the third (`isFullOnlineR2ModeActiveForTenant`) leaked this
  // module's editorial policy into a contract every website module had to
  // consume. `media_library` now provides `media_library`
  // (`_shared/ports/media-library-port.ts`), and this module is a CONSUMER of it
  // like everyone else — homepage sections and ad placements resolve media
  // through the port rather than owning it.
  //
  // Neither consumed capability is optional. `public_content`: every homepage
  // section type is fundamentally built on `blog_content` data. `media_library`:
  // ad placements reference a verified media object by real foreign key
  // (`media_object_id`, migration 048), so this module cannot render without it.
  // Contrast `blog_content`/`social_publishing`, which mark it optional because
  // their media handling safely no-ops when enforcement isn't active.
  capabilities: {
    consumes: [
      { capability: "public_content", providedBy: "blog_content" },
      { capability: "media_library", providedBy: "media_library" }
    ]
  },
  // ADR-0026 step 2: `basePath` moved to `media_library` along with the media
  // registry and its presigned-upload routes. What remains here
  // (`/api/v1/news-portal/homepage-sections`, `/ad-placements`) is genuinely
  // this module's own, so this module keeps declaring an api surface for it.
  api: {
    openApiPath: "openapi/awcms-micro-public-api.openapi.yaml",
    basePath: "/api/v1/news-portal"
  },
  navigation: [
    {
      labelKey: "admin.layout.nav_news_portal_homepage_sections",
      path: "/admin/news-portal/homepage-sections",
      order: 80,
      requiredPermission: "news_portal.homepage_sections.read"
    },
    {
      labelKey: "admin.layout.nav_news_portal_ad_placements",
      path: "/admin/news-portal/ad-placements",
      order: 81,
      requiredPermission: "news_portal.ad_placements.read"
    }
  ],
  permissions: [
    {
      activityCode: "homepage_sections",
      action: "read",
      description: "Read editorial homepage section configuration"
    },
    {
      activityCode: "homepage_sections",
      action: "configure",
      description:
        "Create, update, reorder, enable/disable, or delete editorial homepage sections"
    },
    {
      activityCode: "ad_placements",
      action: "read",
      description: "Read news portal advertisement placement configuration"
    },
    {
      activityCode: "ad_placements",
      action: "configure",
      description:
        "Create, update, enable/disable, or delete news portal advertisement placements"
    }
  ],

  // Issue #690 (epic #679, platform-hardening): the first background job
  // this module declares (`settings`/`health` remain undeclared — still no
  // per-tenant setting or health check for this module specifically).
  jobs: [
    {
      command: "bun run news-media:reconcile",
      purpose:
        "Reconcile awcms_micro_news_media_objects metadata against the real R2 bucket contents; clean up expired pending uploads and grace-period-expired orphans in bounded, race-safe batches (dry-run supported).",
      recommendedSchedule: "Daily via cron/systemd timer.",
      environmentNotes:
        'No-op when NEWS_MEDIA_R2_ENABLED is not "true". Requires real network egress to the Cloudflare R2 API in addition to PostgreSQL — not a pure database operation.',
      safeInOfflineLan: false
    }
  ]
});
