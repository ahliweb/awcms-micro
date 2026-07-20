import { describe, expect, test } from "bun:test";

import { buildSearchCacheKey } from "../../src/modules/site-search/domain/search-cache-key";
import {
  clampMinQueryLength,
  hashSearchQuery,
  MAX_QUERY_LENGTH,
  normalizeSearchLocale,
  normalizeSearchQuery,
  stripControlCharacters
} from "../../src/modules/site-search/domain/search-query";
import {
  escapeSnippetHtml,
  renderSafeSnippet,
  SNIPPET_START_SENTINEL,
  SNIPPET_STOP_SENTINEL
} from "../../src/modules/site-search/domain/search-snippet";
import {
  DEFAULT_SITE_SEARCH_SETTINGS,
  validateSiteSearchSettings
} from "../../src/modules/site-search/domain/search-settings";
import { renderSearchPageBody } from "../../src/modules/site-search/domain/search-page-rendering";

const TAB = String.fromCharCode(9);
const NUL = String.fromCharCode(0);

describe("normalizeSearchQuery — bounds + normalization (ADR-0031 §5)", () => {
  test("empty / non-string is rejected", () => {
    expect(normalizeSearchQuery("").ok).toBe(false);
    expect(normalizeSearchQuery("   ").ok).toBe(false);
    expect(normalizeSearchQuery(null).ok).toBe(false);
    expect(normalizeSearchQuery(42 as unknown).ok).toBe(false);
  });

  test("collapses whitespace and strips control characters", () => {
    const result = normalizeSearchQuery(`  hello${TAB}${NUL}  world  `, 2);
    expect(result).toEqual({ ok: true, value: "hello world" });
  });

  test("too short vs too long", () => {
    expect(normalizeSearchQuery("a", 2)).toEqual({
      ok: false,
      reason: "too_short"
    });
    const long = "x".repeat(MAX_QUERY_LENGTH + 1);
    expect(normalizeSearchQuery(long, 2)).toEqual({
      ok: false,
      reason: "too_long"
    });
  });

  test("min query length is clamped into the safe range", () => {
    expect(clampMinQueryLength(0)).toBe(1);
    expect(clampMinQueryLength(999)).toBe(20);
    expect(clampMinQueryLength(Number.NaN)).toBe(2);
  });

  test("stripControlCharacters replaces C0/DEL with spaces", () => {
    expect(stripControlCharacters(`a${NUL}b${TAB}c`)).toBe("a b c");
  });
});

describe("normalizeSearchLocale", () => {
  test("accepts bcp-47-ish tags, lowercases, falls back", () => {
    expect(normalizeSearchLocale("EN", "id")).toBe("en");
    expect(normalizeSearchLocale("id-ID", "en")).toBe("id-id");
    expect(normalizeSearchLocale("not a locale", "en")).toBe("en");
    expect(normalizeSearchLocale(undefined, "en")).toBe("en");
  });
});

describe("snippet escaping — XSS defense (ADR-0031 §5)", () => {
  test("escapeSnippetHtml neutralizes tag-forming characters", () => {
    expect(escapeSnippetHtml("<script>alert(1)</script>")).toBe(
      "&lt;script&gt;alert(1)&lt;/script&gt;"
    );
    expect(escapeSnippetHtml(`a"b'c&d`)).toBe("a&quot;b&#39;c&amp;d");
  });

  test("renderSafeSnippet escapes content then wraps sentinels in <mark>", () => {
    const raw = `${SNIPPET_START_SENTINEL}<b>hi</b>${SNIPPET_STOP_SENTINEL}`;
    const out = renderSafeSnippet(raw);
    expect(out).toBe("<mark>&lt;b&gt;hi&lt;/b&gt;</mark>");
    // No raw content markup survives.
    expect(out).not.toContain("<b>");
  });

  test("a crafted document with a raw script tag can never emit markup", () => {
    const raw = `hello ${SNIPPET_START_SENTINEL}world${SNIPPET_STOP_SENTINEL} <img src=x onerror=alert(1)>`;
    const out = renderSafeSnippet(raw);
    expect(out).not.toContain("<img");
    expect(out).toContain("&lt;img");
    // The ONLY tags are our own marks.
    const tags = out.match(/<[^>]+>/g) ?? [];
    expect(tags.every((t) => t === "<mark>" || t === "</mark>")).toBe(true);
  });
});

describe("buildSearchCacheKey — cross-tenant/locale defense (ADR-0031 §5)", () => {
  const base = {
    tenantId: "t1",
    locale: "en",
    queryHash: "abc",
    resourceType: "all",
    cursor: "0",
    limit: 20
  };

  test("throws when a tenant/locale/query component is missing", () => {
    expect(() => buildSearchCacheKey({ ...base, tenantId: "" })).toThrow();
    expect(() => buildSearchCacheKey({ ...base, locale: "  " })).toThrow();
    expect(() => buildSearchCacheKey({ ...base, queryHash: "" })).toThrow();
  });

  test("tenant is the first component — cross-tenant collision is structurally impossible", () => {
    const a = buildSearchCacheKey({ ...base, tenantId: "tenant-a" });
    const b = buildSearchCacheKey({ ...base, tenantId: "tenant-b" });
    expect(a).not.toBe(b);
    expect(a.startsWith("sitesearch:tenant-a:")).toBe(true);
  });

  test("different locale => different key", () => {
    const en = buildSearchCacheKey({ ...base, locale: "en" });
    const id = buildSearchCacheKey({ ...base, locale: "id" });
    expect(en).not.toBe(id);
  });

  test("hashSearchQuery is deterministic and hex", () => {
    expect(hashSearchQuery("hello")).toBe(hashSearchQuery("hello"));
    expect(hashSearchQuery("hello")).toMatch(/^[a-f0-9]{64}$/);
  });
});

describe("validateSiteSearchSettings — bounds + merge (ADR-0031 §6)", () => {
  test("empty object merges to base unchanged", () => {
    const result = validateSiteSearchSettings({}, DEFAULT_SITE_SEARCH_SETTINGS);
    expect(result).toEqual({ ok: true, value: DEFAULT_SITE_SEARCH_SETTINGS });
  });

  test("out-of-range values are rejected", () => {
    expect(validateSiteSearchSettings({ resultLimit: 0 }).ok).toBe(false);
    expect(validateSiteSearchSettings({ resultLimit: 101 }).ok).toBe(false);
    expect(validateSiteSearchSettings({ minQueryLength: 99 }).ok).toBe(false);
    expect(validateSiteSearchSettings({ suggestionLimit: 0 }).ok).toBe(false);
  });

  test("enabledResourceTypes: null (all), valid identifiers, or rejected", () => {
    expect(
      (
        validateSiteSearchSettings({ enabledResourceTypes: null }) as {
          value: { enabledResourceTypes: unknown };
        }
      ).value.enabledResourceTypes
    ).toBeNull();
    const ok = validateSiteSearchSettings({
      enabledResourceTypes: ["blog_post", "blog_post", "product"]
    });
    expect(ok.ok).toBe(true);
    expect(
      (ok as { value: { enabledResourceTypes: string[] } }).value
        .enabledResourceTypes
    ).toEqual(["blog_post", "product"]);
    expect(
      validateSiteSearchSettings({ enabledResourceTypes: ["Bad Type!"] }).ok
    ).toBe(false);
    expect(
      validateSiteSearchSettings({
        enabledResourceTypes: new Array(51).fill("x")
      }).ok
    ).toBe(false);
  });

  test("type errors are rejected", () => {
    expect(validateSiteSearchSettings({ enabled: "yes" }).ok).toBe(false);
    expect(validateSiteSearchSettings({ resultLimit: 2.5 }).ok).toBe(false);
    expect(validateSiteSearchSettings("not an object").ok).toBe(false);
  });
});

describe("renderSearchPageBody — accessibility + escaping", () => {
  const labels = {
    title: "Search",
    heading: "Search",
    inputLabel: "Search query",
    placeholder: "Search…",
    button: "Search",
    enterTerm: "Enter a term.",
    tooShort: "Too short.",
    noResults: "No results.",
    resultsHeading: "Search results",
    next: "Next",
    suggestionsLabel: "Suggestions"
  };

  test("escapes a malicious query in the input value", () => {
    const html = renderSearchPageBody({
      locale: "en",
      siteName: "Site",
      query: `"><script>alert(1)</script>`,
      minQueryLength: 2,
      items: [],
      nextCursor: null,
      labels
    });
    expect(html).not.toContain("<script>alert(1)");
    expect(html).toContain("&lt;script&gt;");
    // ARIA combobox pattern present.
    expect(html).toContain('role="combobox"');
    expect(html).toContain('role="listbox"');
    expect(html).toContain('role="search"');
  });

  test("embeds a pre-escaped snippet and escapes the title/url", () => {
    const html = renderSearchPageBody({
      locale: "en",
      siteName: "Site",
      query: "hello",
      minQueryLength: 2,
      items: [
        {
          resourceType: "blog_post",
          resourceId: "1",
          url: "/news/hello",
          title: `A <b>title</b>`,
          snippet: "safe <mark>hello</mark> snippet",
          locale: "en",
          rank: 1
        }
      ],
      nextCursor: null,
      labels
    });
    expect(html).toContain("A &lt;b&gt;title&lt;/b&gt;");
    expect(html).toContain("safe <mark>hello</mark> snippet");
    expect(html).toContain('href="/news/hello"');
  });
});
