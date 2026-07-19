import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

import { blogContentModule } from "../../src/modules/blog-content/module";
import { seoDistributionModule } from "../../src/modules/seo-distribution/module";
import { listBaseModules } from "../../src/modules/index";
import { CAPABILITY_CONTRACT_VERSIONS } from "../../src/modules/_shared/capability-contract-versions";

/**
 * ADR-0028 (#265 admission, #266 first runtime) — pins the parts of the
 * `seo_facts` contribution contract a typecheck cannot see: the single declared
 * provider, the aggregator's optional `consumes`, the version-registry pairing,
 * and the no-cross-import rule between the provider adapter and the aggregator.
 */
describe("seo_facts capability ownership (ADR-0028)", () => {
  test("blog_content is the single declared seo_facts provider; seo_distribution provides nothing", () => {
    expect(blogContentModule.capabilities?.provides ?? []).toContain(
      "seo_facts"
    );
    // Exactly one provider — a second would be a capability_provider_conflict.
    const providers = listBaseModules().filter((m) =>
      (m.capabilities?.provides ?? []).includes("seo_facts")
    );
    expect(providers.map((m) => m.key)).toEqual(["blog_content"]);
    expect(seoDistributionModule.capabilities?.provides ?? []).toEqual([]);
  });

  test("seo_distribution consumes seo_facts (optional, from blog_content) and media_library", () => {
    const consumes = seoDistributionModule.capabilities?.consumes ?? [];
    const seoFacts = consumes.find((c) => c.capability === "seo_facts");
    expect(seoFacts?.providedBy).toBe("blog_content");
    expect(seoFacts?.optional).toBe(true);
    const media = consumes.find((c) => c.capability === "media_library");
    expect(media?.providedBy).toBe("media_library");
    expect(media?.optional).toBe(true);
  });

  test("seo_facts is registered in CAPABILITY_CONTRACT_VERSIONS", () => {
    // 1.1.0 since Issue #267 (MINOR: optional summarize method + list order/offset
    // for bounded sitemap/feed generation — see capability-contract-versions.ts).
    expect(CAPABILITY_CONTRACT_VERSIONS.seo_facts).toBe("1.1.0");
    // Every capability blog_content/seo_distribution provides has a version.
    for (const module of [blogContentModule, seoDistributionModule]) {
      for (const provided of module.capabilities?.provides ?? []) {
        expect(CAPABILITY_CONTRACT_VERSIONS[provided]).toBeDefined();
      }
    }
  });

  test("the base registry now has 19 modules (theming registered by Issue #269 alongside seo_distribution)", () => {
    expect(listBaseModules().length).toBe(19);
    expect(listBaseModules().some((m) => m.key === "seo_distribution")).toBe(
      true
    );
    expect(listBaseModules().some((m) => m.key === "theming")).toBe(true);
  });

  test("blog_content's seo_facts adapter never imports seo_distribution", () => {
    const adapter = readFileSync(
      "src/modules/blog-content/application/seo-facts-port-adapter.ts",
      "utf8"
    );
    const imports = [
      ...adapter.matchAll(/^import[\s\S]*?from "([^"]+)";$/gm)
    ].map((match) => match[1] as string);
    expect(imports.length).toBeGreaterThan(0);
    for (const specifier of imports) {
      expect(specifier).not.toContain("seo-distribution");
    }
    // The provider depends only on the neutral port type + its own module.
    expect(imports).toContain("../../_shared/ports/seo-facts-port");
  });

  test("seo_distribution's renderer/service never imports a content module's implementation", () => {
    for (const file of [
      "src/modules/seo-distribution/domain/seo-document.ts",
      "src/modules/seo-distribution/domain/seo-head-rendering.ts",
      "src/modules/seo-distribution/application/seo-metadata-service.ts",
      "src/modules/seo-distribution/application/seo-config-directory.ts",
      "src/modules/seo-distribution/application/resolve-canonical-host.ts",
      // Issue #267 discovery surfaces — the aggregator/service/serializers stay
      // ignorant of any specific content module; providers are injected at the
      // route composition root (`src/lib/seo/discovery-providers.ts`).
      "src/modules/seo-distribution/application/seo-discovery-service.ts",
      "src/modules/seo-distribution/application/public-seo-tenant-resolution.ts",
      "src/modules/seo-distribution/domain/sitemap-serialization.ts",
      "src/modules/seo-distribution/domain/feed-serialization.ts",
      "src/modules/seo-distribution/domain/robots-serialization.ts",
      "src/modules/seo-distribution/domain/discovery-cache.ts",
      "src/modules/seo-distribution/domain/discovery-limits.ts"
    ]) {
      const source = readFileSync(file, "utf8");
      const imports = [...source.matchAll(/from "([^"]+)";$/gm)].map(
        (match) => match[1] as string
      );
      for (const specifier of imports) {
        expect(specifier).not.toContain("blog-content");
        expect(specifier).not.toContain("news-portal");
      }
    }
  });
});
