import { describe, expect, test } from "bun:test";

import type {
  SeoResourceFacts,
  SeoVisibility
} from "../../src/modules/_shared/ports/seo-facts-port";
import { CAPABILITY_CONTRACT_VERSIONS } from "../../src/modules/_shared/capability-contract-versions";
import {
  buildSeoDocument,
  SEO_RENDER_CONTRACT_VERSION,
  type SeoRenderContext
} from "../../src/modules/seo-distribution/domain/seo-document";
import { renderSeoHeadTags } from "../../src/modules/seo-distribution/domain/seo-head-rendering";
import {
  EMPTY_SEO_TENANT_SETTINGS,
  validateSeoTenantSettings,
  type SeoTenantSettings
} from "../../src/modules/seo-distribution/domain/seo-config";

const NOW = "2026-07-19T12:00:00.000Z";

function publishedVisibility(
  overrides: Partial<SeoVisibility> = {}
): SeoVisibility {
  return {
    state: "published",
    noindex: false,
    scheduledPublishAt: null,
    ...overrides
  };
}

function makeFacts(
  overrides: Partial<SeoResourceFacts> = {}
): SeoResourceFacts {
  return {
    resourceType: "blog_post",
    resourceId: "post-1",
    visibility: publishedVisibility(),
    canonicalPath: "/news/hello-world",
    localeAlternates: [{ locale: "en", path: "/news/hello-world" }],
    metadata: {
      title: "Hello World",
      description: "A first post.",
      robots: "index,follow"
    },
    openGraph: {
      title: "Hello World",
      description: "A first post.",
      imageMediaId: null,
      type: "article"
    },
    jsonLd: [{ "@type": "Article", headline: "Hello World", inLanguage: "en" }],
    sitemap: { lastmod: NOW, changefreq: "weekly" },
    feed: { publishedAt: NOW, updatedAt: NOW },
    ...overrides
  };
}

function makeContext(
  overrides: Partial<SeoRenderContext> = {},
  settings: Partial<SeoTenantSettings> = {}
): SeoRenderContext {
  return {
    primaryHost: "acme.example",
    tenantDisplayName: "Acme",
    settings: { ...EMPTY_SEO_TENANT_SETTINGS, ...settings },
    resolvedImage: null,
    nowIso: NOW,
    ...overrides
  };
}

describe("SEO contract version", () => {
  test("the render contract version matches the seo_facts capability version", () => {
    expect(CAPABILITY_CONTRACT_VERSIONS.seo_facts).toBe(
      SEO_RENDER_CONTRACT_VERSION
    );
  });
});

describe("buildSeoDocument — publication state (frozen guards)", () => {
  test.each([
    ["draft", { state: "draft" as const }],
    ["archived", { state: "archived" as const }],
    ["deleted", { state: "deleted" as const }],
    ["private", { state: "private" as const }],
    ["unpublished", { state: "unpublished" as const }]
  ])("%s resource is not renderable", (_label, patch) => {
    const facts = makeFacts({
      visibility: publishedVisibility({ ...patch, noindex: true })
    });
    expect(buildSeoDocument(facts, makeContext()).renderable).toBe(false);
  });

  test("a future-scheduled resource is not renderable until its time", () => {
    const facts = makeFacts({
      visibility: {
        state: "scheduled",
        noindex: true,
        scheduledPublishAt: "2999-01-01T00:00:00.000Z"
      }
    });
    expect(buildSeoDocument(facts, makeContext()).renderable).toBe(false);
  });

  test("a scheduled resource whose time has passed IS renderable", () => {
    const facts = makeFacts({
      visibility: {
        state: "scheduled",
        noindex: false,
        scheduledPublishAt: "2000-01-01T00:00:00.000Z"
      }
    });
    expect(buildSeoDocument(facts, makeContext()).renderable).toBe(true);
  });
});

describe("buildSeoDocument — canonical host is server-derived", () => {
  test("absolute canonical uses the passed-in primary host, never a request header", () => {
    const result = buildSeoDocument(
      makeFacts(),
      makeContext({ primaryHost: "brand.example" })
    );
    expect(result.renderable).toBe(true);
    if (!result.renderable) return;
    expect(result.document.canonicalUrl).toBe(
      "https://brand.example/news/hello-world"
    );
    expect(result.document.openGraph.url).toBe(
      "https://brand.example/news/hello-world"
    );
  });

  test("degrades to a relative canonical when there is no primary host (no invented host)", () => {
    const result = buildSeoDocument(
      makeFacts(),
      makeContext({ primaryHost: null })
    );
    expect(result.renderable).toBe(true);
    if (!result.renderable) return;
    expect(result.document.canonicalUrl).toBe("/news/hello-world");
  });
});

describe("buildSeoDocument — hreflang reciprocity + x-default", () => {
  test("alternates map to absolute hrefs and always append x-default = canonical", () => {
    const facts = makeFacts({
      canonicalPath: "/news/hello",
      localeAlternates: [
        { locale: "en", path: "/news/hello" },
        { locale: "id", path: "/berita/halo" }
      ]
    });
    const result = buildSeoDocument(facts, makeContext());
    expect(result.renderable).toBe(true);
    if (!result.renderable) return;
    expect(result.document.localeAlternates).toEqual([
      { hreflang: "en", href: "https://acme.example/news/hello" },
      { hreflang: "id", href: "https://acme.example/berita/halo" },
      { hreflang: "x-default", href: "https://acme.example/news/hello" }
    ]);
  });
});

describe("buildSeoDocument — robots precedence", () => {
  test("indexable published resource keeps index,follow", () => {
    const result = buildSeoDocument(makeFacts(), makeContext());
    if (!result.renderable) throw new Error("expected renderable");
    expect(result.document.robots).toBe("index,follow");
  });

  test("noindex visibility forces noindex even if the resource says index", () => {
    const facts = makeFacts({
      visibility: publishedVisibility({ noindex: true }),
      metadata: {
        title: "Hi",
        description: null,
        robots: "index,follow"
      }
    });
    const result = buildSeoDocument(facts, makeContext());
    if (!result.renderable) throw new Error("expected renderable");
    expect(result.document.robots).toBe("noindex,follow");
  });

  test("tenant-wide defaultRobotsNoindex forces noindex on an otherwise-indexable resource", () => {
    const result = buildSeoDocument(
      makeFacts(),
      makeContext({}, { defaultRobotsNoindex: true })
    );
    if (!result.renderable) throw new Error("expected renderable");
    expect(result.document.robots).toBe("noindex,follow");
    // ...and structured data is withheld for a non-indexable page.
    expect(result.document.jsonLd).toEqual([]);
  });
});

describe("buildSeoDocument — description precedence + site identity", () => {
  test("resource description wins; tenant default only fills the gap", () => {
    const withDesc = buildSeoDocument(makeFacts(), makeContext());
    if (!withDesc.renderable) throw new Error("expected renderable");
    expect(withDesc.document.description).toBe("A first post.");

    const noDesc = buildSeoDocument(
      makeFacts({
        metadata: { title: "T", description: null, robots: "index,follow" },
        openGraph: {
          title: "T",
          description: null,
          imageMediaId: null,
          type: "article"
        }
      }),
      makeContext({}, { defaultMetaDescription: "Tenant fallback." })
    );
    if (!noDesc.renderable) throw new Error("expected renderable");
    expect(noDesc.document.description).toBe("Tenant fallback.");
  });

  test("og:site_name uses the tenant settings site name over the display name", () => {
    const result = buildSeoDocument(
      makeFacts(),
      makeContext({}, { siteName: "Acme Media" })
    );
    if (!result.renderable) throw new Error("expected renderable");
    expect(result.document.openGraph.siteName).toBe("Acme Media");
  });

  test("indexable resource gets a WebSite node; Organization node only when configured", () => {
    const plain = buildSeoDocument(makeFacts(), makeContext());
    if (!plain.renderable) throw new Error("expected renderable");
    const plainTypes = plain.document.jsonLd.map((n) => n["@type"]);
    expect(plainTypes).toContain("WebSite");
    expect(plainTypes).toContain("Article");
    expect(plainTypes).not.toContain("Organization");

    const withOrg = buildSeoDocument(
      makeFacts(),
      makeContext({}, { organizationName: "Acme Inc" })
    );
    if (!withOrg.renderable) throw new Error("expected renderable");
    expect(withOrg.document.jsonLd.map((n) => n["@type"])).toContain(
      "Organization"
    );
  });
});

describe("renderSeoHeadTags — escaping and JSON-LD safety", () => {
  test("emits canonical, robots, hreflang, OG, twitter, and ld+json", () => {
    const result = buildSeoDocument(makeFacts(), makeContext());
    if (!result.renderable) throw new Error("expected renderable");
    const html = renderSeoHeadTags(result.document);

    expect(html).toContain(
      '<link rel="canonical" href="https://acme.example/news/hello-world" />'
    );
    expect(html).toContain('<meta name="robots" content="index,follow" />');
    expect(html).toContain(
      '<link rel="alternate" hreflang="x-default" href="https://acme.example/news/hello-world" />'
    );
    expect(html).toContain('<meta property="og:type" content="article" />');
    expect(html).toContain('<meta name="twitter:card" content="summary" />');
    expect(html).toContain('<script type="application/ld+json">');
  });

  test("text values are HTML-escaped; JSON-LD is escaped so it cannot break out of <script>", () => {
    const facts = makeFacts({
      metadata: {
        title: "<b>Sale</b> & Co",
        description: "cheap <deals>",
        robots: "index,follow"
      },
      openGraph: {
        title: "<b>Sale</b> & Co",
        description: "cheap <deals>",
        imageMediaId: null,
        type: "article"
      },
      jsonLd: [
        { "@type": "Article", headline: "<b>Sale</b> & Co", inLanguage: "en" }
      ]
    });
    const result = buildSeoDocument(facts, makeContext());
    if (!result.renderable) throw new Error("expected renderable");
    const html = renderSeoHeadTags(result.document);

    // Title escaped in the meta layer.
    expect(html).toContain("<title>&lt;b&gt;Sale&lt;/b&gt; &amp; Co</title>");
    // The Article headline's markup must never appear raw anywhere in the head —
    // the port's renderControlledJsonLd escaped `<`/`>`/`&` to \uXXXX so a value
    // can never terminate the <script> element. Concatenate every ld+json script
    // body and assert the escaped forms, not the raw ones.
    const scriptBodies = html
      .split('<script type="application/ld+json">')
      .slice(1)
      .map((chunk) => chunk.split("</script>")[0]!)
      .join("\n");
    expect(scriptBodies).toContain('"@type":"Article"');
    expect(scriptBodies).not.toContain("<b>Sale");
    expect(scriptBodies).toContain("\\u003cb\\u003eSale");
    expect(scriptBodies).toContain("\\u0026 Co");
  });

  test("a value containing a literal </script sequence fails closed (throws) rather than rendering", () => {
    // The frozen guard rejects a raw </script in a JSON-LD value; the renderer
    // inherits that fail-closed behavior (the route turns it into a 500, never a
    // poisoned page).
    const facts = makeFacts({
      jsonLd: [
        {
          "@type": "Article",
          headline: "x</script><script>alert(1)</script>",
          inLanguage: "en"
        }
      ]
    });
    const result = buildSeoDocument(facts, makeContext());
    if (!result.renderable) throw new Error("expected renderable");
    expect(() => renderSeoHeadTags(result.document)).toThrow();
  });
});

describe("validateSeoTenantSettings", () => {
  test("accepts a well-formed body and trims/nulls empty strings", () => {
    const result = validateSeoTenantSettings({
      siteName: "  Acme  ",
      defaultMetaDescription: "",
      twitterSiteHandle: "@acme",
      defaultRobotsNoindex: true,
      unknownKey: "ignored"
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.siteName).toBe("Acme");
    expect(result.value.defaultMetaDescription).toBeNull();
    expect(result.value.twitterSiteHandle).toBe("@acme");
    expect(result.value.defaultRobotsNoindex).toBe(true);
  });

  test("rejects an over-length site name", () => {
    const result = validateSeoTenantSettings({ siteName: "x".repeat(201) });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors[0]?.field).toBe("siteName");
  });

  test("rejects a non-UUID media id", () => {
    const result = validateSeoTenantSettings({
      defaultSocialMediaId: "not-a-uuid"
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors[0]?.field).toBe("defaultSocialMediaId");
  });

  test("rejects a non-boolean defaultRobotsNoindex", () => {
    const result = validateSeoTenantSettings({ defaultRobotsNoindex: "yes" });
    expect(result.ok).toBe(false);
  });

  test("rejects a non-object body", () => {
    expect(validateSeoTenantSettings(null).ok).toBe(false);
    expect(validateSeoTenantSettings([]).ok).toBe(false);
  });
});
