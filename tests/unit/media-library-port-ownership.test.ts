import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";

import { mediaLibraryModule } from "../../src/modules/media-library/module";
import { blogContentModule } from "../../src/modules/blog-content/module";
import { newsPortalModule } from "../../src/modules/news-portal/module";
import { socialPublishingModule } from "../../src/modules/social-publishing/module";
import { CAPABILITY_CONTRACT_VERSIONS } from "../../src/modules/_shared/capability-contract-versions";

/**
 * ADR-0026 steps 3-4 inverted media ownership: `media_library` provides the
 * media capability, and `news_portal` — which used to provide it only because
 * the registry was born inside it — is now just another consumer.
 *
 * These tests pin the parts a typecheck cannot see. A capability name is a
 * string and an import is a path, so nothing but an assertion stops either
 * drifting back. The one that matters most is
 * `media-library-port-adapter.ts` never importing `news_portal`: that single
 * edge is what the whole extraction exists to remove, and re-adding it would
 * compile perfectly.
 */
describe("media capability ownership (ADR-0026 steps 3-4)", () => {
  test("media_library provides `media_library`; news_portal provides nothing", () => {
    expect(mediaLibraryModule.capabilities?.provides).toEqual([
      "media_library"
    ]);
    expect(newsPortalModule.capabilities?.provides ?? []).toEqual([]);
  });

  test("the retired `news_media` capability is gone from the version registry, and nobody declares it", () => {
    expect(CAPABILITY_CONTRACT_VERSIONS.news_media).toBeUndefined();
    expect(CAPABILITY_CONTRACT_VERSIONS.media_library).toBe("1.0.0");

    for (const module of [
      mediaLibraryModule,
      blogContentModule,
      newsPortalModule,
      socialPublishingModule
    ]) {
      expect(module.capabilities?.provides ?? []).not.toContain("news_media");
      for (const consumed of module.capabilities?.consumes ?? []) {
        expect(consumed.capability).not.toBe("news_media");
      }
    }
  });

  test("every declared consumer of `media_library` names media_library as the provider — never news_portal", () => {
    const consumers = [
      blogContentModule,
      newsPortalModule,
      socialPublishingModule
    ];

    for (const module of consumers) {
      const entry = (module.capabilities?.consumes ?? []).find(
        (c) => c.capability === "media_library"
      );

      expect(entry).toBeDefined();
      expect(entry?.providedBy).toBe("media_library");
    }
  });

  test("every capability any module declares is registered in CAPABILITY_CONTRACT_VERSIONS", () => {
    // Catches the half of a capability rename that is easy to forget: adding the
    // `provides` string without its version entry (or vice versa). ADR-0015
    // requires both, and a derived repository pinned to a missing key gets a
    // confusing resolution failure rather than a clear one.
    for (const module of [
      mediaLibraryModule,
      blogContentModule,
      newsPortalModule,
      socialPublishingModule
    ]) {
      for (const provided of module.capabilities?.provides ?? []) {
        expect(CAPABILITY_CONTRACT_VERSIONS[provided]).toBeDefined();
      }
    }
  });

  test("the media_library port adapter never imports news_portal — the ADR-0013 §1 inversion this extraction removes", () => {
    // The load-bearing assertion. `tests/unit/module-boundary.test.ts` only
    // scans the `blog_content` ↔ `news_portal` pair (deliberately — that pair is
    // what once grew a cycle), so it cannot see this edge at all. Without this
    // test, "fixing" a future import error by reaching into news-portal-tenant-state
    // would typecheck, pass every other gate, and silently re-invert the graph.
    const adapter = readFileSync(
      "src/modules/media-library/application/media-library-port-adapter.ts",
      "utf8"
    );

    const imports = [
      ...adapter.matchAll(/^import[\s\S]*?from "([^"]+)";$/gm)
    ].map((match) => match[1] as string);

    expect(imports.length).toBeGreaterThan(0);

    for (const specifier of imports) {
      expect(specifier).not.toContain("news-portal");
      expect(specifier).not.toContain("blog-content");
      expect(specifier).not.toContain("social-publishing");
    }
  });

  test("the deleted news_media port and its adapter stay deleted", () => {
    // Both files were the capability's old home. A revert or a bad merge that
    // restores either would leave two competing media ports compiling side by
    // side, and route composition roots would silently split between them.
    for (const path of [
      "src/modules/_shared/ports/news-media-port.ts",
      "src/modules/news-portal/application/news-media-port-adapter.ts"
    ]) {
      expect(existsSync(path)).toBe(false);
    }
  });
});
