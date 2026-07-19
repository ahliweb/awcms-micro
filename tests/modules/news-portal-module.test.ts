import { describe, expect, test } from "bun:test";

import { getModuleByKey, listModules } from "../../src/modules";
import { newsPortalModule } from "../../src/modules/news-portal/module";

describe("news_portal module descriptor (Issue #632, extended #634)", () => {
  test("listModules() includes news_portal", () => {
    expect(listModules().some((m) => m.key === "news_portal")).toBe(true);
    expect(getModuleByKey("news_portal")).toBe(newsPortalModule);
  });

  test("descriptor shape matches Issue #632's scope", () => {
    expect(newsPortalModule.key).toBe("news_portal");
    expect(newsPortalModule.status).toBe("active");
    expect(newsPortalModule.type).toBe("domain");
    // Deliberately NOT blog_content/tenant_domain/visitor_analytics — see
    // module.ts's own comment: a hard dependency would block disabling
    // those modules for every tenant (news_portal is enabled by default),
    // which broke existing integration tests when first tried. The
    // relationship is prose-only + enforced by preset-application
    // ordering, not the module dependency graph.
    expect(newsPortalModule.dependencies).toEqual([
      "tenant_admin",
      "identity_access"
    ]);
  });

  test("Issue #634 declares permissions + api now that a real HTTP surface exists; Issue #637 adds navigation (one admin page); settings/jobs/health remain undeclared (the news-media:reconcile job moved to media_library, ADR-0026/Issue #264)", () => {
    // settings/jobs/health have no real feature backing them for this module
    // specifically (no per-tenant setting, no health check) — same "only claim
    // a capability once it genuinely exists" convention visitor_analytics
    // established (Issue #617). The `news-media:reconcile` job Issue #690 first
    // declared here was MOVED to `media_library` (ADR-0026 / Issue #264): it
    // reconciles the media registry `media_library` now owns, through that
    // module's own code. The mirror-image assertion ("media_library declares the
    // reconcile job") lives in `media-library-module.test.ts`.
    expect(newsPortalModule.settings).toBeUndefined();
    expect(newsPortalModule.health).toBeUndefined();
    expect(newsPortalModule.jobs).toBeUndefined();

    // ADR-0026 step 2: the media basePath moved to `media_library` with the
    // registry. What remains is genuinely this module's own surface.
    expect(newsPortalModule.api).toEqual({
      openApiPath: "openapi/awcms-micro-public-api.openapi.yaml",
      basePath: "/api/v1/news-portal"
    });

    expect(newsPortalModule.navigation).toEqual([
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
    ]);

    expect(newsPortalModule.permissions).toBeDefined();
  });

  // ADR-0026 step 2 — this module must no longer declare ANY media permission:
  // they moved to `media_library` (sql/077). The parity test that used to live
  // here now lives in tests/modules/media-library-module.test.ts, against the new
  // owner. Asserting the absence here is the half that catches a regression the
  // new test cannot see — a stray media permission left behind on news_portal
  // would satisfy the new module's parity check and still be wrong.
  test("declares no `media` activityCode permission — media ownership moved to media_library (ADR-0026 step 2)", () => {
    const mediaPermissions = (newsPortalModule.permissions ?? []).filter(
      (p) => p.activityCode === "media"
    );

    expect(mediaPermissions).toEqual([]);
  });

  test("Issue #637 declares exactly the homepage_sections read/configure permission pair", () => {
    const permissions = (newsPortalModule.permissions ?? []).filter(
      (p) => p.activityCode === "homepage_sections"
    );

    expect(permissions.map((p) => p.action).sort()).toEqual([
      "configure",
      "read"
    ]);

    for (const permission of permissions) {
      expect(permission.description.length).toBeGreaterThan(0);
    }
  });

  test("Issue #638 declares exactly the ad_placements read/configure permission pair", () => {
    const permissions = (newsPortalModule.permissions ?? []).filter(
      (p) => p.activityCode === "ad_placements"
    );

    expect(permissions.map((p) => p.action).sort()).toEqual([
      "configure",
      "read"
    ]);

    for (const permission of permissions) {
      expect(permission.description.length).toBeGreaterThan(0);
    }
  });

  test("descriptor never declares a secret, token, or provider credential", () => {
    const serialized = JSON.stringify(newsPortalModule).toLowerCase();

    for (const forbidden of [
      "password",
      "secret",
      "credential",
      "apikey",
      "api_key"
    ]) {
      expect(serialized).not.toContain(forbidden);
    }
  });
});
