import { describe, expect, test } from "bun:test";

import { renderRobotsTxt } from "../../src/modules/seo-distribution/domain/robots-serialization";
import {
  renderSitemapIndex,
  renderUrlset,
  sitemapPageCount,
  type SitemapUrlEntry
} from "../../src/modules/seo-distribution/domain/sitemap-serialization";
import {
  renderAtom,
  renderJsonFeed,
  renderRss,
  type FeedChannel,
  type FeedItem
} from "../../src/modules/seo-distribution/domain/feed-serialization";
import {
  SITEMAP_MAX_CHILD_PAGES,
  SITEMAP_URLS_PER_PAGE
} from "../../src/modules/seo-distribution/domain/discovery-limits";

/**
 * Issue #267 — protocol serialization + escaping + pagination for the public
 * discovery surfaces. Pure, no DB. Proves the escape-never-reject discipline
 * inherited from the frozen seo_facts guards: tenant markup in a value is
 * neutralized (escaped), never rejected, and never terminates an element.
 */

const CHANNEL: FeedChannel = {
  title: "Acme News",
  description: "Latest from Acme",
  siteUrl: "https://acme.example/",
  feedUrl: "https://acme.example/feed.xml",
  language: "en",
  updated: "2026-07-19T10:00:00.000Z",
  logoUrl: "https://cdn.example/logo.png"
};

function item(overrides: Partial<FeedItem> = {}): FeedItem {
  return {
    id: "https://acme.example/news/hello",
    url: "https://acme.example/news/hello",
    title: "Hello World",
    summary: "A summary",
    contentText: "Body text",
    publishedAt: "2026-07-19T09:00:00.000Z",
    updatedAt: "2026-07-19T09:30:00.000Z",
    imageUrl: null,
    imageMimeType: null,
    imageLength: null,
    ...overrides
  };
}

describe("sitemap serialization (#267)", () => {
  test("sitemapPageCount is ceil(count/perPage), floored at 1, capped at the amplification ceiling", () => {
    expect(sitemapPageCount(0)).toBe(1);
    expect(sitemapPageCount(1)).toBe(1);
    expect(sitemapPageCount(SITEMAP_URLS_PER_PAGE)).toBe(1);
    expect(sitemapPageCount(SITEMAP_URLS_PER_PAGE + 1)).toBe(2);
    expect(sitemapPageCount(SITEMAP_URLS_PER_PAGE * 3)).toBe(3);
    // Runaway tenant is capped, never unbounded.
    expect(sitemapPageCount(SITEMAP_URLS_PER_PAGE * 10_000_000)).toBe(
      SITEMAP_MAX_CHILD_PAGES
    );
  });

  test("index lists child sitemaps with loc + lastmod", () => {
    const xml = renderSitemapIndex([
      {
        loc: "https://acme.example/sitemap-1.xml",
        lastmod: "2026-07-19T10:00:00.000Z"
      },
      { loc: "https://acme.example/sitemap-2.xml", lastmod: null }
    ]);
    expect(xml).toContain(
      '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    );
    expect(xml).toContain("<loc>https://acme.example/sitemap-1.xml</loc>");
    expect(xml).toContain("<lastmod>2026-07-19T10:00:00.000Z</lastmod>");
    // Second child has no lastmod element.
    expect(xml).toContain("<loc>https://acme.example/sitemap-2.xml</loc>");
  });

  test("urlset renders loc/lastmod/changefreq/priority + hreflang alternates + images", () => {
    const url: SitemapUrlEntry = {
      loc: "https://acme.example/news/hello",
      lastmod: "2026-07-19T09:30:00.000Z",
      changefreq: "weekly",
      priority: 0.7,
      alternates: [
        { hreflang: "en", href: "https://acme.example/news/hello" },
        { hreflang: "id", href: "https://acme.example/id/news/halo" },
        { hreflang: "x-default", href: "https://acme.example/news/hello" }
      ],
      images: ["https://cdn.example/a.jpg"]
    };
    const xml = renderUrlset([url]);
    expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
    expect(xml).toContain(
      'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'
    );
    expect(xml).toContain("<loc>https://acme.example/news/hello</loc>");
    expect(xml).toContain("<changefreq>weekly</changefreq>");
    expect(xml).toContain("<priority>0.7</priority>");
    expect(xml).toContain(
      '<xhtml:link rel="alternate" hreflang="id" href="https://acme.example/id/news/halo" />'
    );
    expect(xml).toContain(
      "<image:image><image:loc>https://cdn.example/a.jpg</image:loc></image:image>"
    );
  });

  test("a slug containing markup is XML-ESCAPED, not rejected (escape-never-reject)", () => {
    const xml = renderUrlset([
      {
        loc: "https://acme.example/news/</loc><script>alert(1)</script>",
        lastmod: null,
        alternates: [],
        images: []
      }
    ]);
    // The raw </loc> never appears un-escaped inside the value; & < > are escaped.
    expect(xml).toContain("&lt;/loc&gt;&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(xml).not.toContain("/news/</loc><script>");
  });
});

describe("RSS 2.0 serialization (#267)", () => {
  test("channel + item with stable permalink guid + RFC-822 pubDate + enclosure", () => {
    const xml = renderRss(CHANNEL, [
      item({
        imageUrl: "https://cdn.example/a.jpg",
        imageMimeType: "image/jpeg",
        imageLength: 2048
      })
    ]);
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain("<title>Acme News</title>");
    expect(xml).toContain(
      '<atom:link href="https://acme.example/feed.xml" rel="self" type="application/rss+xml" />'
    );
    expect(xml).toContain(
      '<guid isPermaLink="true">https://acme.example/news/hello</guid>'
    );
    expect(xml).toContain("<pubDate>Sun, 19 Jul 2026 09:00:00 GMT</pubDate>");
    expect(xml).toContain(
      '<enclosure url="https://cdn.example/a.jpg" length="2048" type="image/jpeg" />'
    );
  });

  test("item title with markup is escaped", () => {
    const xml = renderRss(CHANNEL, [
      item({ title: "Bad </title><script>x</script>" })
    ]);
    expect(xml).toContain("Bad &lt;/title&gt;&lt;script&gt;x&lt;/script&gt;");
    expect(xml).not.toContain("<title>Bad </title><script>");
  });
});

describe("Atom serialization (#267)", () => {
  test("feed + entry with id/published/updated + self link", () => {
    const xml = renderAtom(CHANNEL, [item()]);
    expect(xml).toContain(
      '<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">'
    );
    expect(xml).toContain(
      '<link href="https://acme.example/feed.xml" rel="self" type="application/atom+xml" />'
    );
    expect(xml).toContain("<id>https://acme.example/news/hello</id>");
    expect(xml).toContain("<published>2026-07-19T09:00:00.000Z</published>");
    expect(xml).toContain("<updated>2026-07-19T09:30:00.000Z</updated>");
    expect(xml).toContain("<icon>https://cdn.example/logo.png</icon>");
  });

  test("entry updated falls back to published when null", () => {
    const xml = renderAtom(CHANNEL, [item({ updatedAt: null })]);
    expect(xml).toContain("<updated>2026-07-19T09:00:00.000Z</updated>");
  });
});

describe("JSON Feed 1.1 serialization (#267 — retained by ADR-0028 §4)", () => {
  test("valid JSON Feed 1.1 with items, content_text, attachments, icon", () => {
    const json = renderJsonFeed(CHANNEL, [
      item({
        imageUrl: "https://cdn.example/a.jpg",
        imageMimeType: "image/jpeg",
        imageLength: 2048
      })
    ]);
    const parsed = JSON.parse(json);
    expect(parsed.version).toBe("https://jsonfeed.org/version/1.1");
    expect(parsed.title).toBe("Acme News");
    expect(parsed.home_page_url).toBe("https://acme.example/");
    expect(parsed.feed_url).toBe("https://acme.example/feed.xml");
    expect(parsed.icon).toBe("https://cdn.example/logo.png");
    expect(parsed.items).toHaveLength(1);
    expect(parsed.items[0].id).toBe("https://acme.example/news/hello");
    expect(parsed.items[0].content_text).toBe("Body text");
    expect(parsed.items[0].date_published).toBe("2026-07-19T09:00:00.000Z");
    expect(parsed.items[0].image).toBe("https://cdn.example/a.jpg");
    expect(parsed.items[0].attachments[0]).toEqual({
      url: "https://cdn.example/a.jpg",
      mime_type: "image/jpeg",
      size_in_bytes: 2048
    });
  });

  test("markup in a value stays inert JSON string content (no HTML break-out) and round-trips", () => {
    const json = renderJsonFeed(CHANNEL, [
      item({ title: "</script><b>x</b>" })
    ]);
    const parsed = JSON.parse(json);
    expect(parsed.items[0].title).toBe("</script><b>x</b>");
  });
});

describe("robots.txt serialization (#267)", () => {
  test("normal: disallows admin/api, advertises absolute sitemap", () => {
    const body = renderRobotsTxt({
      primaryHost: "acme.example",
      siteNoindex: false,
      sitemapEnabled: true
    });
    expect(body).toContain("User-agent: *");
    expect(body).toContain("Disallow: /admin/");
    expect(body).toContain("Disallow: /api/");
    expect(body).toContain("Sitemap: https://acme.example/sitemap.xml");
  });

  test("noindex: disallow all, no sitemap advertised", () => {
    const body = renderRobotsTxt({
      primaryHost: "acme.example",
      siteNoindex: true,
      sitemapEnabled: true
    });
    expect(body).toContain("Disallow: /");
    expect(body).not.toContain("Sitemap:");
    expect(body).not.toContain("Disallow: /admin/");
  });

  test("no primary host: omit the Sitemap line (never invent a host)", () => {
    const body = renderRobotsTxt({
      primaryHost: null,
      siteNoindex: false,
      sitemapEnabled: true
    });
    expect(body).not.toContain("Sitemap:");
    expect(body).toContain("Disallow: /admin/");
  });

  test("sitemap disabled: no Sitemap line even with a host", () => {
    const body = renderRobotsTxt({
      primaryHost: "acme.example",
      siteNoindex: false,
      sitemapEnabled: false
    });
    expect(body).not.toContain("Sitemap:");
  });
});
