import { describe, expect, test } from "bun:test";

import { mediaLibraryModule } from "../../src/modules/media-library/module";
import {
  MEDIA_PERMISSION_ACTIVITY_CODE,
  MEDIA_PERMISSIONS
} from "../../src/modules/media-library/domain/media-permissions";

/**
 * ADR-0026 step 2 moved the media registry — and its 9 permissions — out of
 * `news_portal` and into this module. These tests pin the half of that move a
 * typecheck cannot see: a permission KEY is a string, so nothing but an
 * assertion stops it drifting back, being duplicated, or being invented.
 *
 * The mirror-image assertion ("news_portal declares NO media permission") lives
 * in `news-portal-module.test.ts`. Both halves are needed: a stray media
 * permission left behind on `news_portal` would still satisfy the parity check
 * here and still be wrong.
 */
describe("media_library module descriptor (ADR-0026 step 2)", () => {
  test("is active and owns the media registry — no longer the experimental placeholder step 1 registered", () => {
    expect(mediaLibraryModule.key).toBe("media_library");
    expect(mediaLibraryModule.status).toBe("active");
    expect(mediaLibraryModule.type).toBe("system");
  });

  test("never depends on the modules that consume it — the inversion ADR-0026 exists to make", () => {
    // A System Foundation module depending on a domain module is the ADR-0013 §1
    // violation this extraction removes. If someone "fixes" a future import error
    // by adding one of these, this fails instead of quietly re-inverting the graph.
    for (const consumer of [
      "news_portal",
      "blog_content",
      "social_publishing"
    ]) {
      expect(mediaLibraryModule.dependencies).not.toContain(consumer);
    }
    expect(mediaLibraryModule.dependencies).toEqual([
      "tenant_admin",
      "identity_access"
    ]);
  });

  test("owns the media upload basePath that moved off news_portal", () => {
    expect(mediaLibraryModule.api).toEqual({
      openApiPath: "openapi/awcms-micro-public-api.openapi.yaml",
      basePath: "/api/v1/media/news-images"
    });
  });

  test("every declared `media` permission reproduces exactly one MEDIA_PERMISSIONS constant — no invented, duplicated, or orphaned key", () => {
    const permissions = (mediaLibraryModule.permissions ?? []).filter(
      (p) => p.activityCode === MEDIA_PERMISSION_ACTIVITY_CODE
    );
    const expectedKeys = new Set(Object.values(MEDIA_PERMISSIONS));

    expect(permissions.length).toBe(expectedKeys.size);

    const declaredKeys = permissions.map(
      (p) => `media_library.${p.activityCode}.${p.action}`
    );

    expect(new Set(declaredKeys)).toEqual(expectedKeys);
    expect(declaredKeys.length).toBe(new Set(declaredKeys).size);

    for (const permission of permissions) {
      expect(permission.description.length).toBeGreaterThan(0);
    }
  });

  test("every MEDIA_PERMISSIONS constant is keyed to media_library, not its former news_portal owner", () => {
    for (const key of Object.values(MEDIA_PERMISSIONS)) {
      expect(key.startsWith("media_library.")).toBe(true);
      expect(key.startsWith("news_portal.")).toBe(false);
    }
  });

  /**
   * ADR-0026 step 5d. A `labelKey` is a string and a `requiredPermission` is a
   * string, so nothing but an assertion stops either from pointing at something
   * that does not exist — and neither failure is loud. A `labelKey` with no
   * catalog entry renders the raw key as the menu label (`translate.ts` returns
   * the key on a miss); a `requiredPermission` naming a permission this module
   * never declares can never be granted, so the entry silently vanishes for
   * everyone and the page looks broken rather than forbidden.
   */
  describe("navigation (step 5d — the module's first admin screen)", () => {
    test("declares exactly the one media browser entry, gated on a permission this module actually declares", () => {
      expect(mediaLibraryModule.navigation).toHaveLength(1);

      const entry = mediaLibraryModule.navigation![0]!;
      expect(entry.path).toBe("/admin/media");
      expect(entry.requiredPermission).toBe(MEDIA_PERMISSIONS.read);

      const declaredKeys = new Set(
        (mediaLibraryModule.permissions ?? []).map(
          (p) => `${mediaLibraryModule.key}.${p.activityCode}.${p.action}`
        )
      );
      expect(declaredKeys.has(entry.requiredPermission!)).toBe(true);
    });

    test("the nav label has a real entry in BOTH runtime catalogs — not just the English one", async () => {
      // id.po missing the key would fall back to English rather than fail
      // (`translate.ts`'s locale -> DEFAULT_LOCALE fallback), which is exactly
      // the silent, permanent gap `i18n:parity:check` exists for. That gate
      // proves en/id/pot agree on the key SET; this proves this specific key is
      // in the set at all, which a parity check passing on two empty catalogs
      // would not.
      const entry = mediaLibraryModule.navigation![0]!;

      for (const catalog of ["i18n/en.po", "i18n/id.po"]) {
        const content = await Bun.file(catalog).text();
        expect(content).toContain(`msgid "${entry.labelKey}"`);
      }
    });
  });
});
