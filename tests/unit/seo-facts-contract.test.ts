import { describe, expect, test } from "bun:test";

import {
  assertControlledJsonLd,
  assertSafeRedirectTarget,
  buildSeoCacheKey,
  classifyRedirectTarget,
  escapeJsonLdText,
  isPubliclyIndexable,
  isPubliclyResolvable,
  JSON_LD_ALLOWED_TYPES,
  renderControlledJsonLd,
  type JsonLdNode,
  type SeoFactsSource,
  type SeoResourceFacts,
  type SeoResourceFactsPage,
  type SeoVisibility
} from "../../src/modules/_shared/ports/seo-facts-port";

/**
 * ADR-0028 contract fixtures. This suite pins the `seo_distribution`
 * contribution contract (`SeoFactsSource`) and its pure invariants BEFORE any
 * runtime SEO code exists (#266-#268). It imports ONLY the neutral-ground port
 * — never a module's internals — proving base AND derived content types
 * contribute through the same contract without importing module internals
 * (issue #265 acceptance: "Contribution contracts support base and derived
 * content types without importing module internals").
 */

const NOW = "2026-07-19T00:00:00.000Z";

/** A base article's SEO facts (the `blog_content` `blog_post` shape). */
const baseArticleFacts: SeoResourceFacts = {
  resourceType: "blog_post",
  resourceId: "11111111-1111-4111-8111-111111111111",
  visibility: { state: "published", noindex: false, scheduledPublishAt: null },
  canonicalPath: "/blog/hello-world",
  localeAlternates: [
    { locale: "en", path: "/blog/hello-world" },
    { locale: "id", path: "/id/blog/halo-dunia" },
    { locale: "x-default", path: "/blog/hello-world" }
  ],
  metadata: {
    title: "Hello World",
    description: "The first post.",
    robots: "index,follow"
  },
  openGraph: {
    title: "Hello World",
    description: "The first post.",
    imageMediaId: "22222222-2222-4222-8222-222222222222",
    type: "article"
  },
  jsonLd: [
    {
      "@type": "BlogPosting",
      headline: "Hello World",
      author: { "@type": "Person", name: "Editor" }
    }
  ],
  sitemap: {
    lastmod: "2026-07-18T10:00:00.000Z",
    changefreq: "weekly",
    priority: 0.7
  },
  feed: { publishedAt: "2026-07-18T10:00:00.000Z", updatedAt: null }
};

/** A base page's SEO facts (the `blog_content` `blog_page` shape) — not a feed item. */
const basePageFacts: SeoResourceFacts = {
  resourceType: "blog_page",
  resourceId: "33333333-3333-4333-8333-333333333333",
  visibility: { state: "published", noindex: false, scheduledPublishAt: null },
  canonicalPath: "/about",
  localeAlternates: [{ locale: "en", path: "/about" }],
  metadata: { title: "About", description: null, robots: "index,follow" },
  openGraph: {
    title: "About",
    description: null,
    imageMediaId: null,
    type: "website"
  },
  jsonLd: [{ "@type": "WebPage", name: "About" }],
  sitemap: { lastmod: null },
  feed: null
};

/**
 * A DUMMY DERIVED content type (`product`) — as a derived application (e.g.
 * AWPOS on top of the base) would contribute it. It flows through the identical
 * `SeoResourceFacts` shape with an opaque `resourceType` the base never knows.
 */
const derivedProductFacts: SeoResourceFacts = {
  resourceType: "product",
  resourceId: "44444444-4444-4444-8444-444444444444",
  visibility: { state: "published", noindex: false, scheduledPublishAt: null },
  canonicalPath: "/shop/widget",
  localeAlternates: [{ locale: "en", path: "/shop/widget" }],
  metadata: {
    title: "Widget",
    description: "A widget.",
    robots: "index,follow"
  },
  openGraph: {
    title: "Widget",
    description: "A widget.",
    imageMediaId: "55555555-5555-4555-8555-555555555555",
    type: "product"
  },
  jsonLd: [{ "@type": "WebPage", name: "Widget" }],
  sitemap: { lastmod: "2026-07-17T00:00:00.000Z" },
  feed: null
};

/**
 * A stand-in provider adapter. A real one lives in the owning content module
 * (`<module>/application/seo-facts-port-adapter.ts`, #266); this one proves the
 * PORT is implementable purely against its own types, importing nothing from
 * any module. `_tx`/`_tenantId` mirror the real signature without a DB.
 */
function makeFixtureSource(facts: readonly SeoResourceFacts[]): SeoFactsSource {
  return {
    async listPublicResourceFacts(): Promise<SeoResourceFactsPage> {
      const items = facts.filter((f) => isPubliclyIndexable(f.visibility, NOW));
      return { items, nextCursor: null };
    },
    async resolveResourceFacts(_tx, _tenantId, resourceType, resourceId) {
      return (
        facts.find(
          (f) => f.resourceType === resourceType && f.resourceId === resourceId
        ) ?? null
      );
    }
  };
}

describe("SeoFactsSource contribution contract (ADR-0028)", () => {
  test("base article, base page, and a derived content type all satisfy the same shape", () => {
    for (const facts of [
      baseArticleFacts,
      basePageFacts,
      derivedProductFacts
    ]) {
      expect(typeof facts.resourceType).toBe("string");
      expect(facts.canonicalPath.startsWith("/")).toBe(true);
      // No fact ever carries a host — canonical/alternates are paths only
      // (ADR-0028 §5, host-header-poisoning defense).
      expect(facts.canonicalPath).not.toContain("://");
      for (const alt of facts.localeAlternates) {
        expect(alt.path.startsWith("/")).toBe(true);
        expect(alt.path).not.toContain("://");
      }
      // OG image is a media id, never a raw URL.
      if (facts.openGraph.imageMediaId !== null) {
        expect(facts.openGraph.imageMediaId).not.toContain("://");
      }
    }
  });

  test("a fixture provider implements the port without importing any module", async () => {
    const source = makeFixtureSource([
      baseArticleFacts,
      basePageFacts,
      derivedProductFacts
    ]);
    const page = await source.listPublicResourceFacts(
      undefined as unknown as Bun.SQL,
      "tenant-1"
    );
    expect(page.items.map((f) => f.resourceType).sort()).toEqual([
      "blog_page",
      "blog_post",
      "product"
    ]);
    const resolved = await source.resolveResourceFacts(
      undefined as unknown as Bun.SQL,
      "tenant-1",
      "product",
      derivedProductFacts.resourceId
    );
    expect(resolved?.resourceType).toBe("product");
  });
});

describe("publication-state visibility invariants (ADR-0028 §6)", () => {
  const cases: {
    label: string;
    visibility: SeoVisibility;
    resolvable: boolean;
    indexable: boolean;
  }[] = [
    {
      label: "published",
      visibility: {
        state: "published",
        noindex: false,
        scheduledPublishAt: null
      },
      resolvable: true,
      indexable: true
    },
    {
      label: "published+noindex",
      visibility: {
        state: "published",
        noindex: true,
        scheduledPublishAt: null
      },
      resolvable: true,
      indexable: false
    },
    {
      label: "draft",
      visibility: { state: "draft", noindex: false, scheduledPublishAt: null },
      resolvable: false,
      indexable: false
    },
    {
      label: "unpublished",
      visibility: {
        state: "unpublished",
        noindex: false,
        scheduledPublishAt: null
      },
      resolvable: false,
      indexable: false
    },
    {
      label: "private",
      visibility: {
        state: "private",
        noindex: false,
        scheduledPublishAt: null
      },
      resolvable: false,
      indexable: false
    },
    {
      label: "archived",
      visibility: {
        state: "archived",
        noindex: false,
        scheduledPublishAt: null
      },
      resolvable: false,
      indexable: false
    },
    {
      label: "deleted",
      visibility: {
        state: "deleted",
        noindex: false,
        scheduledPublishAt: null
      },
      resolvable: false,
      indexable: false
    },
    {
      label: "scheduled(future)",
      visibility: {
        state: "scheduled",
        noindex: false,
        scheduledPublishAt: "2999-01-01T00:00:00.000Z"
      },
      resolvable: false,
      indexable: false
    },
    {
      label: "scheduled(past)",
      visibility: {
        state: "scheduled",
        noindex: false,
        scheduledPublishAt: "2000-01-01T00:00:00.000Z"
      },
      resolvable: true,
      indexable: true
    }
  ];

  for (const c of cases) {
    test(`${c.label}: resolvable=${c.resolvable}, indexable=${c.indexable}`, () => {
      expect(isPubliclyResolvable(c.visibility, NOW)).toBe(c.resolvable);
      expect(isPubliclyIndexable(c.visibility, NOW)).toBe(c.indexable);
    });
  }

  test("indexable is strictly stronger than resolvable (nothing indexable is unresolvable)", () => {
    for (const c of cases) {
      if (isPubliclyIndexable(c.visibility, NOW)) {
        expect(isPubliclyResolvable(c.visibility, NOW)).toBe(true);
      }
    }
  });

  test("LOW-2: an out-of-union state fails closed (not resolvable, not indexable)", () => {
    const rogue = {
      state: "totally_unknown_state",
      noindex: false,
      scheduledPublishAt: null
    } as unknown as SeoVisibility;
    expect(isPubliclyResolvable(rogue, NOW)).toBe(false);
    expect(isPubliclyIndexable(rogue, NOW)).toBe(false);
  });
});

describe("cache key isolation invariants (ADR-0028 §7)", () => {
  const base = {
    tenantId: "tenant-a",
    host: "www.example.com",
    locale: "en",
    resourceType: "blog_post",
    resourceId: "abc",
    contractVersion: "1.0.0"
  };

  test("key includes tenant, host, and locale", () => {
    const key = buildSeoCacheKey(base);
    expect(key).toContain(encodeURIComponent("tenant-a"));
    expect(key).toContain(encodeURIComponent("www.example.com"));
    expect(key).toContain("en");
  });

  test("different tenants never share a key; different hosts/locales never share a key", () => {
    const key = buildSeoCacheKey(base);
    expect(buildSeoCacheKey({ ...base, tenantId: "tenant-b" })).not.toBe(key);
    expect(buildSeoCacheKey({ ...base, host: "other.example.com" })).not.toBe(
      key
    );
    expect(buildSeoCacheKey({ ...base, locale: "id" })).not.toBe(key);
  });

  test("host is case-normalized so casing cannot fork the cache", () => {
    expect(buildSeoCacheKey({ ...base, host: "WWW.EXAMPLE.COM" })).toBe(
      buildSeoCacheKey(base)
    );
  });

  for (const field of ["tenantId", "host", "locale"] as const) {
    test(`throws when ${field} is empty`, () => {
      expect(() => buildSeoCacheKey({ ...base, [field]: "" })).toThrow();
      expect(() => buildSeoCacheKey({ ...base, [field]: "   " })).toThrow();
    });
  }

  test("LOW-1: contractVersion is encoded so a `:` cannot shift components", () => {
    // "1:0" must not collide with a version "1" pushing "0" into the next slot.
    const withColonVersion = buildSeoCacheKey({
      ...base,
      contractVersion: "1:0"
    });
    const collidingAttempt = buildSeoCacheKey({
      ...base,
      contractVersion: "1",
      tenantId: `0${base.tenantId}` // naive concat if ":" were raw
    });
    expect(withColonVersion).not.toBe(collidingAttempt);
    expect(withColonVersion).toContain(encodeURIComponent("1:0"));
    // The raw separator must not appear inside the encoded version component.
    expect(withColonVersion.split(":")).toHaveLength(7);
  });
});

describe("redirect target safety (ADR-0028 §8, open-redirect defense)", () => {
  const allowed = ["www.example.com", "example.com"];

  test("same-origin relative paths are internal", () => {
    expect(classifyRedirectTarget("/new-path", allowed)).toBe(
      "same_tenant_internal"
    );
    expect(classifyRedirectTarget("/a/b?c=d#e", allowed)).toBe(
      "same_tenant_internal"
    );
  });

  test("absolute URLs to a registered host are internal", () => {
    expect(classifyRedirectTarget("https://www.example.com/x", allowed)).toBe(
      "same_tenant_internal"
    );
    expect(classifyRedirectTarget("http://example.com/x", allowed)).toBe(
      "same_tenant_internal"
    );
  });

  test("absolute URLs to any other host are external", () => {
    expect(classifyRedirectTarget("https://evil.com/x", allowed)).toBe(
      "cross_host_external"
    );
    expect(
      classifyRedirectTarget("https://www.example.com.evil.com/x", allowed)
    ).toBe("cross_host_external");
  });

  test("protocol-relative, backslash, credential, and non-http tricks are invalid", () => {
    for (const bad of [
      "//evil.com",
      "/\\evil.com",
      "\\/evil.com",
      // Credential (userinfo) trick — the real host is evil.com, so it must
      // classify cross_host_external, never same_tenant_internal (NIT-2).
      "https://www.example.com@evil.com",
      "javascript:alert(1)",
      "data:text/html,<script>",
      "mailto:a@b.com",
      "",
      "   "
    ]) {
      expect(classifyRedirectTarget(bad, allowed)).not.toBe(
        "same_tenant_internal"
      );
    }
    // The credential trick specifically resolves to the external host.
    expect(
      classifyRedirectTarget("https://www.example.com@evil.com", allowed)
    ).toBe("cross_host_external");
  });

  test("HIGH-1: control-character (TAB/LF/CR) bypass vectors are rejected, not internal", () => {
    // The WHATWG URL parser and browsers STRIP tab/newline/CR, so a naive
    // startsWith("/") check would resolve these to //evil.com and wrongly call
    // them same_tenant_internal. They MUST classify as invalid (verified
    // open-redirect bypass, security-auditor HIGH-1).
    const vectors = [
      "/\t/evil.com",
      "/\n/evil.com",
      "/\r/evil.com",
      "/\t\\evil.com",
      "/ev\til.com",
      "\thttps://evil.com"
    ];
    for (const bad of vectors) {
      expect(classifyRedirectTarget(bad, allowed)).toBe("invalid");
      expect(classifyRedirectTarget(bad, allowed)).not.toBe(
        "same_tenant_internal"
      );
      expect(() => assertSafeRedirectTarget(bad, allowed)).toThrow();
    }
  });

  test("assertSafeRedirectTarget throws for anything not same-tenant-internal", () => {
    expect(() => assertSafeRedirectTarget("/ok", allowed)).not.toThrow();
    expect(() =>
      assertSafeRedirectTarget("https://evil.com", allowed)
    ).toThrow();
    expect(() => assertSafeRedirectTarget("//evil.com", allowed)).toThrow();
    expect(() =>
      assertSafeRedirectTarget("https://www.example.com@evil.com", allowed)
    ).toThrow();
  });
});

describe("JSON-LD injection defense (ADR-0028 threat model)", () => {
  test("every allowed type is a controlled schema type", () => {
    expect(JSON_LD_ALLOWED_TYPES.has("Article")).toBe(true);
    expect(JSON_LD_ALLOWED_TYPES.has("WebPage")).toBe(true);
  });

  test("controlled JSON-LD from the fixtures passes", () => {
    for (const facts of [
      baseArticleFacts,
      basePageFacts,
      derivedProductFacts
    ]) {
      for (const node of facts.jsonLd) {
        expect(() => assertControlledJsonLd(node)).not.toThrow();
      }
    }
  });

  test("a disallowed @type is rejected (even nested)", () => {
    const bad = {
      "@type": "WebPage",
      author: { "@type": "EvilType", name: "x" }
    } as unknown as JsonLdNode;
    expect(() => assertControlledJsonLd(bad)).toThrow();
  });

  test("a </script> in a string VALUE is escaped, not rejected (no self-DoS on legitimate content)", () => {
    // A value can carry any text — even a literal `</script>` (e.g. a real post
    // title). Structural validation must NOT throw on value content; escaping
    // (renderControlledJsonLd) neutralizes it. Rejecting here would fail the
    // whole head render on legitimate tenant text.
    const node: JsonLdNode = {
      "@type": "Article",
      headline: "</script><script>alert(1)</script>"
    };
    expect(() => assertControlledJsonLd(node)).not.toThrow();

    const rendered = renderControlledJsonLd(node);
    // Output is safe: no raw `<`/`>`, no raw `</script`, and the escaped form is
    // present instead — yet it round-trips back to the original content.
    expect(rendered).not.toContain("<");
    expect(rendered).not.toContain(">");
    expect(rendered.toLowerCase()).not.toContain("</script");
    expect(rendered).toContain("\\u003c/script\\u003e");
    expect((JSON.parse(rendered) as { headline: string }).headline).toBe(
      "</script><script>alert(1)</script>"
    );
  });

  test("escapeJsonLdText neutralizes the script-break characters", () => {
    const escaped = escapeJsonLdText("</script> & <b>");
    expect(escaped).not.toContain("<");
    expect(escaped).not.toContain(">");
    expect(escaped).not.toContain("&");
    expect(escaped).toContain("\\u003c");
  });

  test("MEDIUM-1: a malicious object KEY is rejected (keys break out like values)", () => {
    const bad = {
      "@type": "WebPage",
      "</script><script>alert(1)</script>": "x"
    } as unknown as JsonLdNode;
    expect(() => assertControlledJsonLd(bad)).toThrow();
    expect(() => renderControlledJsonLd(bad)).toThrow();

    // Nested malicious key too.
    const badNested = {
      "@type": "WebPage",
      author: {
        "@type": "Person",
        "<img src=x onerror=alert(1)>": "y"
      }
    } as unknown as JsonLdNode;
    expect(() => assertControlledJsonLd(badNested)).toThrow();
  });

  test("MEDIUM-1: renderControlledJsonLd output never contains raw < > &, covering keys and values", () => {
    // A benign node whose VALUE contains HTML-sensitive characters (not a
    // </script> breakout, so it renders rather than throwing) — the render must
    // escape them across the whole serialized string.
    const node: JsonLdNode = {
      "@type": "Article",
      headline: "A < B & C > D",
      author: { "@type": "Person", name: "Ann & Bob" }
    };
    const rendered = renderControlledJsonLd(node);
    expect(rendered).not.toContain("<");
    expect(rendered).not.toContain(">");
    expect(rendered).not.toContain("&");
    expect(rendered).toContain("\\u003c");
    expect(rendered).toContain("\\u0026");
    // Still valid JSON that round-trips to the original content.
    const parsed = JSON.parse(rendered) as Record<string, unknown>;
    expect(parsed["@type"]).toBe("Article");
    expect(parsed.headline).toBe("A < B & C > D");
  });

  test("MEDIUM-1: renderControlledJsonLd validates @type before serializing", () => {
    const bad = {
      "@type": "EvilType",
      name: "x"
    } as unknown as JsonLdNode;
    expect(() => renderControlledJsonLd(bad)).toThrow();
  });
});
