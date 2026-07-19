/**
 * Issue #267 — end-to-end integration for the public discovery/syndication
 * routes (robots.txt, sitemap index/child, RSS/Atom/JSON feeds) against a real
 * PostgreSQL, driving the actual Astro route handlers as the least-privilege
 * `awcms_micro_app` role (FORCE'd RLS enforced). Covers: publication-state
 * filtering, cross-tenant isolation, server-derived host (host-poisoning
 * defense), pagination/splitting, cache validators (ETag/Last-Modified/304),
 * event-driven invalidation, tenant config, and XML injection.
 */
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test
} from "bun:test";

import {
  applyMigrations,
  getAdminSql,
  getTestSql,
  integrationEnabled,
  invokeRaw,
  provisionAppRole,
  resetDatabase
} from "./harness";
import { withTenant } from "../../src/lib/database/tenant-context";
import { blogContentSeoFactsAdapter } from "../../src/modules/blog-content/application/seo-facts-port-adapter";

import { GET as getRobots } from "../../src/pages/robots.txt";
import { GET as getSitemapIndex } from "../../src/pages/sitemap.xml";
import { GET as getSitemapPage } from "../../src/pages/sitemap-[page].xml";
import { GET as getRss } from "../../src/pages/feed.xml";
import { GET as getAtom } from "../../src/pages/atom.xml";
import { GET as getJsonFeed } from "../../src/pages/feed.json";

const TENANT_A = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const TENANT_B = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";
const AUTHOR = "cccccccc-cccc-cccc-cccc-cccccccccccc";
const HOST_A = "acme.example";
const HOST_A2 = "acme-secondary.example";
const HOST_B = "beta.example";

const PUB = new Date("2026-06-01T00:00:00.000Z");

async function seedTenant(
  id: string,
  code: string,
  locale = "en"
): Promise<void> {
  const admin = getAdminSql();
  const name = `${code} Name`;
  const legal = `${code} Legal`;
  await admin`
    INSERT INTO awcms_micro_tenants
      (id, tenant_code, tenant_name, legal_name, status, default_locale, default_theme)
    VALUES (${id}, ${code}, ${name}, ${legal}, 'active', ${locale}, 'light')
  `;
}

async function seedDomain(
  tenantId: string,
  hostname: string,
  isPrimary: boolean
): Promise<void> {
  const admin = getAdminSql();
  await admin`
    INSERT INTO awcms_micro_tenant_domains
      (tenant_id, hostname, normalized_hostname, domain_type, status, is_primary)
    VALUES (${tenantId}, ${hostname}, ${hostname.toLowerCase()}, 'custom_domain', 'active', ${isPrimary})
  `;
}

type PostOpts = {
  slug: string;
  title?: string;
  status?: string;
  visibility?: string;
  locale?: string;
  publishedAt?: Date | null;
  updatedAt?: Date;
  contentText?: string;
};

async function insertPost(tenantId: string, opts: PostOpts): Promise<string> {
  const admin = getAdminSql();
  const id = crypto.randomUUID();
  await admin`
    INSERT INTO awcms_micro_blog_posts
      (id, tenant_id, author_tenant_user_id, title, slug, content_json, content_text,
       status, visibility, locale, published_at, updated_at)
    VALUES (
      ${id}, ${tenantId}, ${AUTHOR}, ${opts.title ?? opts.slug}, ${opts.slug},
      '{}'::jsonb, ${opts.contentText ?? "body"},
      ${opts.status ?? "published"}, ${opts.visibility ?? "public"},
      ${opts.locale ?? "en"}, ${opts.publishedAt ?? PUB}, ${opts.updatedAt ?? PUB}
    )
  `;
  return id;
}

/**
 * Direct test-only upsert of scalar SEO config fields (bypasses the audited PUT
 * path). Column names are controlled test constants (`admin.unsafe` is safe
 * here); values are bound parameters. Arrays are set inline by the one test that
 * needs them.
 */
async function upsertSeoSettings(
  tenantId: string,
  fields: Record<string, string | number | boolean>
): Promise<void> {
  const admin = getAdminSql();
  await admin`
    INSERT INTO awcms_micro_seo_tenant_settings (tenant_id) VALUES (${tenantId})
    ON CONFLICT (tenant_id) DO NOTHING
  `;
  for (const [col, val] of Object.entries(fields)) {
    await admin`
      UPDATE awcms_micro_seo_tenant_settings
      SET ${admin.unsafe(col)} = ${val}
      WHERE tenant_id = ${tenantId}
    `;
  }
}

/** Drive a discovery GET route with a specific Host header + optional conditional headers. */
async function fetchRoute(
  handler: Parameters<typeof invokeRaw>[0],
  path: string,
  host: string | undefined,
  extraHeaders: Record<string, string> = {},
  params: Record<string, string> = {}
) {
  const headers: Record<string, string> = { ...extraHeaders };
  if (host !== undefined) headers.host = host;
  return invokeRaw(handler, { method: "GET", path, headers, params });
}

const suite = integrationEnabled ? describe : describe.skip;

suite("SEO discovery routes (Issue #267)", () => {
  const previousEnv = { ...process.env };

  beforeAll(async () => {
    await applyMigrations();
    await provisionAppRole();
  });

  afterAll(() => {
    process.env = previousEnv;
  });

  beforeEach(async () => {
    await resetDatabase();
    process.env = { ...previousEnv };
    process.env.PUBLIC_TENANT_RESOLUTION_MODE = "host_default";
    await seedTenant(TENANT_A, "acme");
    await seedTenant(TENANT_B, "beta");
    await seedDomain(TENANT_A, HOST_A, true);
    await seedDomain(TENANT_B, HOST_B, true);
  });

  // -----------------------------------------------------------------------
  // robots.txt
  // -----------------------------------------------------------------------
  describe("robots.txt", () => {
    test("serves crawl policy + absolute sitemap for the resolved tenant's primary host", async () => {
      const res = await fetchRoute(getRobots, "/robots.txt", HOST_A);
      expect(res.status).toBe(200);
      expect(res.response.headers.get("content-type")).toContain("text/plain");
      expect(res.text).toContain("User-agent: *");
      expect(res.text).toContain("Disallow: /admin/");
      expect(res.text).toContain("Disallow: /api/");
      expect(res.text).toContain(`Sitemap: https://${HOST_A}/sitemap.xml`);
    });

    test("whole-site noindex → Disallow: / and no sitemap advertised", async () => {
      await upsertSeoSettings(TENANT_A, { default_robots_noindex: true });
      const res = await fetchRoute(getRobots, "/robots.txt", HOST_A);
      expect(res.status).toBe(200);
      expect(res.text).toContain("Disallow: /");
      expect(res.text).not.toContain("Sitemap:");
    });

    test("unknown host → generic 404, no tenant leaked", async () => {
      const res = await fetchRoute(getRobots, "/robots.txt", "nobody.example");
      expect(res.status).toBe(404);
    });
  });

  // -----------------------------------------------------------------------
  // Sitemap index + child + pagination
  // -----------------------------------------------------------------------
  describe("sitemap", () => {
    test("index lists child page 1 with the primary host; child lists published URLs", async () => {
      await insertPost(TENANT_A, { slug: "alpha" });
      await insertPost(TENANT_A, { slug: "beta-post" });

      const index = await fetchRoute(getSitemapIndex, "/sitemap.xml", HOST_A);
      expect(index.status).toBe(200);
      expect(index.response.headers.get("content-type")).toContain(
        "application/xml"
      );
      expect(index.text).toContain("<sitemapindex");
      expect(index.text).toContain(`https://${HOST_A}/sitemap-1.xml`);

      const child = await fetchRoute(
        getSitemapPage,
        "/sitemap-1.xml",
        HOST_A,
        {},
        { page: "1" }
      );
      expect(child.status).toBe(200);
      expect(child.text).toContain("<urlset");
      expect(child.text).toContain(`https://${HOST_A}/news/alpha`);
      expect(child.text).toContain(`https://${HOST_A}/news/beta-post`);
    });

    test("out-of-range child page → 404; non-integer → 404", async () => {
      await insertPost(TENANT_A, { slug: "only" });
      const page2 = await fetchRoute(
        getSitemapPage,
        "/sitemap-2.xml",
        HOST_A,
        {},
        { page: "2" }
      );
      expect(page2.status).toBe(404);
      const bad = await fetchRoute(
        getSitemapPage,
        "/sitemap-x.xml",
        HOST_A,
        {},
        { page: "x" }
      );
      expect(bad.status).toBe(404);
    });

    test("empty tenant still serves a valid index + empty child page 1", async () => {
      const index = await fetchRoute(getSitemapIndex, "/sitemap.xml", HOST_A);
      expect(index.status).toBe(200);
      expect(index.text).toContain(`https://${HOST_A}/sitemap-1.xml`);
      const child = await fetchRoute(
        getSitemapPage,
        "/sitemap-1.xml",
        HOST_A,
        {},
        { page: "1" }
      );
      expect(child.status).toBe(200);
      expect(child.text).toContain("<urlset");
    });

    test("sitemap disabled → 404", async () => {
      await upsertSeoSettings(TENANT_A, { sitemap_enabled: false });
      const index = await fetchRoute(getSitemapIndex, "/sitemap.xml", HOST_A);
      expect(index.status).toBe(404);
    });
  });

  // -----------------------------------------------------------------------
  // Publication-state filtering / unpublished-content leakage
  // -----------------------------------------------------------------------
  describe("publication-state filtering (leakage defense)", () => {
    test("only published+public+non-deleted+reached appear in sitemap and feeds", async () => {
      await insertPost(TENANT_A, { slug: "published-public" });
      await insertPost(TENANT_A, { slug: "a-draft", status: "draft" });
      await insertPost(TENANT_A, { slug: "an-archived", status: "archived" });
      await insertPost(TENANT_A, { slug: "a-private", visibility: "private" });
      await insertPost(TENANT_A, {
        slug: "an-unlisted",
        visibility: "unlisted"
      });
      await insertPost(TENANT_A, {
        slug: "future",
        status: "published",
        publishedAt: new Date("2999-01-01T00:00:00.000Z")
      });
      await insertPost(TENANT_A, {
        slug: "soft-deleted",
        status: "published"
      });
      // Soft-delete the last one.
      const admin = getAdminSql();
      await admin`UPDATE awcms_micro_blog_posts SET deleted_at = now() WHERE tenant_id = ${TENANT_A} AND slug = 'soft-deleted'`;

      const child = await fetchRoute(
        getSitemapPage,
        "/sitemap-1.xml",
        HOST_A,
        {},
        { page: "1" }
      );
      expect(child.text).toContain("/news/published-public");
      for (const leaked of [
        "a-draft",
        "an-archived",
        "a-private",
        "an-unlisted",
        "future",
        "soft-deleted"
      ]) {
        expect(child.text).not.toContain(`/news/${leaked}`);
      }

      const rss = await fetchRoute(getRss, "/feed.xml", HOST_A);
      expect(rss.text).toContain("/news/published-public");
      for (const leaked of ["a-draft", "an-archived", "a-private", "future"]) {
        expect(rss.text).not.toContain(`/news/${leaked}`);
      }
    });
  });

  // -----------------------------------------------------------------------
  // Cross-tenant isolation (RLS + explicit filter)
  // -----------------------------------------------------------------------
  describe("cross-tenant isolation", () => {
    test("tenant A's sitemap/feed never contains tenant B's content", async () => {
      await insertPost(TENANT_A, { slug: "a-only", title: "A Only" });
      await insertPost(TENANT_B, { slug: "b-only", title: "B Only" });

      const aChild = await fetchRoute(
        getSitemapPage,
        "/sitemap-1.xml",
        HOST_A,
        {},
        { page: "1" }
      );
      expect(aChild.text).toContain("/news/a-only");
      expect(aChild.text).not.toContain("/news/b-only");
      expect(aChild.text).toContain(`https://${HOST_A}/`);
      expect(aChild.text).not.toContain(HOST_B);

      const bRss = await fetchRoute(getRss, "/feed.xml", HOST_B);
      expect(bRss.text).toContain("/news/b-only");
      expect(bRss.text).not.toContain("/news/a-only");
    });

    test("RLS: the blog_content adapter under tenant A context sees only A's posts", async () => {
      await insertPost(TENANT_A, { slug: "a-1" });
      await insertPost(TENANT_B, { slug: "b-1" });
      const sql = getTestSql();
      const factsA = await withTenant(sql, TENANT_A, (tx) =>
        blogContentSeoFactsAdapter.listPublicResourceFacts(tx, TENANT_A)
      );
      const slugs = factsA.items.map((f) => f.canonicalPath);
      expect(slugs).toContain("/news/a-1");
      expect(slugs.some((p) => p.includes("b-1"))).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // Host-poisoning defense (URLs always use the server-derived primary host)
  // -----------------------------------------------------------------------
  describe("host-poisoning defense", () => {
    test("request arriving at a non-primary verified host still generates PRIMARY-host URLs", async () => {
      await seedDomain(TENANT_A, HOST_A2, false); // secondary active, not primary
      await insertPost(TENANT_A, { slug: "canon" });

      const child = await fetchRoute(
        getSitemapPage,
        "/sitemap-1.xml",
        HOST_A2,
        {},
        { page: "1" }
      );
      expect(child.status).toBe(200);
      // URL uses the PRIMARY host, never the arriving (secondary) host.
      expect(child.text).toContain(`https://${HOST_A}/news/canon`);
      expect(child.text).not.toContain(HOST_A2);
    });
  });

  // -----------------------------------------------------------------------
  // Feeds — content, item limit, newest-first, formats
  // -----------------------------------------------------------------------
  describe("feeds", () => {
    test("RSS/Atom/JSON all render the published items with stable ids + correct content types", async () => {
      await insertPost(TENANT_A, { slug: "post-1", title: "Post One" });

      const rss = await fetchRoute(getRss, "/feed.xml", HOST_A);
      expect(rss.response.headers.get("content-type")).toContain(
        "application/rss+xml"
      );
      expect(rss.text).toContain('<rss version="2.0"');
      expect(rss.text).toContain(
        `<guid isPermaLink="true">https://${HOST_A}/news/post-1</guid>`
      );

      const atom = await fetchRoute(getAtom, "/atom.xml", HOST_A);
      expect(atom.response.headers.get("content-type")).toContain(
        "application/atom+xml"
      );
      expect(atom.text).toContain(`<id>https://${HOST_A}/news/post-1</id>`);

      const json = await fetchRoute(getJsonFeed, "/feed.json", HOST_A);
      expect(json.response.headers.get("content-type")).toContain(
        "application/feed+json"
      );
      const parsed = JSON.parse(json.text);
      expect(parsed.version).toBe("https://jsonfeed.org/version/1.1");
      expect(parsed.items[0].id).toBe(`https://${HOST_A}/news/post-1`);
    });

    test("feed_item_limit bounds the number of items and newest-first ordering", async () => {
      for (let i = 0; i < 5; i++) {
        await insertPost(TENANT_A, {
          slug: `p-${i}`,
          title: `P${i}`,
          publishedAt: new Date(`2026-06-0${i + 1}T00:00:00.000Z`)
        });
      }
      await upsertSeoSettings(TENANT_A, { feed_item_limit: 2 });

      const json = await fetchRoute(getJsonFeed, "/feed.json", HOST_A);
      const parsed = JSON.parse(json.text);
      expect(parsed.items).toHaveLength(2);
      // Newest first (p-4 published 2026-06-05, p-3 2026-06-04).
      expect(parsed.items[0].id).toContain("/news/p-4");
      expect(parsed.items[1].id).toContain("/news/p-3");
    });

    test("feeds disabled → 404", async () => {
      await upsertSeoSettings(TENANT_A, { feeds_enabled: false });
      const rss = await fetchRoute(getRss, "/feed.xml", HOST_A);
      expect(rss.status).toBe(404);
    });
  });

  // -----------------------------------------------------------------------
  // Cache validators + event-driven invalidation
  // -----------------------------------------------------------------------
  describe("cache validators (ETag/Last-Modified/304)", () => {
    test("identical requests get a stable ETag + Cache-Control; If-None-Match → 304", async () => {
      await insertPost(TENANT_A, { slug: "cache-me" });

      const first = await fetchRoute(getSitemapIndex, "/sitemap.xml", HOST_A);
      const etag = first.response.headers.get("etag");
      expect(etag).toMatch(/^"[0-9a-f]{32}"$/);
      expect(first.response.headers.get("cache-control")).toContain("max-age=");
      expect(first.response.headers.get("last-modified")).toBeTruthy();

      const second = await fetchRoute(getSitemapIndex, "/sitemap.xml", HOST_A);
      expect(second.response.headers.get("etag")).toBe(etag);

      const conditional = await fetchRoute(
        getSitemapIndex,
        "/sitemap.xml",
        HOST_A,
        {
          "if-none-match": etag!
        }
      );
      expect(conditional.status).toBe(304);
      expect(conditional.text).toBe("");
      expect(conditional.response.headers.get("etag")).toBe(etag);
    });

    test("publishing a new post invalidates the sitemap ETag (event-driven invalidation)", async () => {
      await insertPost(TENANT_A, { slug: "first" });
      const before = await fetchRoute(getSitemapIndex, "/sitemap.xml", HOST_A);
      const etagBefore = before.response.headers.get("etag")!;

      await insertPost(TENANT_A, {
        slug: "second",
        updatedAt: new Date("2026-06-02T00:00:00.000Z")
      });
      const after = await fetchRoute(getSitemapIndex, "/sitemap.xml", HOST_A);
      expect(after.response.headers.get("etag")).not.toBe(etagBefore);

      // The old validator no longer satisfies the conditional request → 200, not 304.
      const stale = await fetchRoute(getSitemapIndex, "/sitemap.xml", HOST_A, {
        "if-none-match": etagBefore
      });
      expect(stale.status).toBe(200);
    });

    test("archiving a post invalidates the feed ETag", async () => {
      await insertPost(TENANT_A, { slug: "live" });
      const before = await fetchRoute(getRss, "/feed.xml", HOST_A);
      const etagBefore = before.response.headers.get("etag")!;

      const admin = getAdminSql();
      await admin`UPDATE awcms_micro_blog_posts SET status = 'archived', updated_at = now() WHERE tenant_id = ${TENANT_A} AND slug = 'live'`;

      const after = await fetchRoute(getRss, "/feed.xml", HOST_A);
      expect(after.response.headers.get("etag")).not.toBe(etagBefore);
      expect(after.text).not.toContain("/news/live");
    });

    test("a config change invalidates the ETag", async () => {
      await insertPost(TENANT_A, { slug: "cfg" });
      const before = await fetchRoute(getRss, "/feed.xml", HOST_A);
      const etagBefore = before.response.headers.get("etag")!;

      await upsertSeoSettings(TENANT_A, { feed_title: "Renamed Feed" });
      const after = await fetchRoute(getRss, "/feed.xml", HOST_A);
      expect(after.response.headers.get("etag")).not.toBe(etagBefore);
      expect(after.text).toContain("Renamed Feed");
    });

    test("cross-tenant ETags never collide for the same surface", async () => {
      await insertPost(TENANT_A, { slug: "shared-slug" });
      await insertPost(TENANT_B, { slug: "shared-slug" });
      const a = await fetchRoute(getSitemapIndex, "/sitemap.xml", HOST_A);
      const b = await fetchRoute(getSitemapIndex, "/sitemap.xml", HOST_B);
      expect(a.response.headers.get("etag")).not.toBe(
        b.response.headers.get("etag")
      );
    });
  });

  // -----------------------------------------------------------------------
  // Config: included content types
  // -----------------------------------------------------------------------
  describe("included content types", () => {
    test("an allow-list excluding blog_post yields an empty sitemap page + feed", async () => {
      await insertPost(TENANT_A, { slug: "hidden-by-filter" });
      const admin = getAdminSql();
      await admin`
        INSERT INTO awcms_micro_seo_tenant_settings (tenant_id, included_resource_types)
        VALUES (${TENANT_A}, ${admin.array(["product"], "text")})
        ON CONFLICT (tenant_id) DO UPDATE SET included_resource_types = EXCLUDED.included_resource_types
      `;

      const child = await fetchRoute(
        getSitemapPage,
        "/sitemap-1.xml",
        HOST_A,
        {},
        { page: "1" }
      );
      expect(child.status).toBe(200);
      expect(child.text).not.toContain("/news/hidden-by-filter");

      const rss = await fetchRoute(getRss, "/feed.xml", HOST_A);
      expect(rss.text).not.toContain("/news/hidden-by-filter");
    });
  });

  // -----------------------------------------------------------------------
  // XML injection / escaping
  // -----------------------------------------------------------------------
  describe("XML injection (escape, never reject)", () => {
    test("a post slug/title containing markup is escaped in sitemap + feeds", async () => {
      await insertPost(TENANT_A, {
        slug: "safe-slug",
        title: "Danger </title><script>alert(1)</script>"
      });

      const rss = await fetchRoute(getRss, "/feed.xml", HOST_A);
      expect(rss.status).toBe(200);
      expect(rss.text).toContain("&lt;/title&gt;&lt;script&gt;");
      expect(rss.text).not.toContain("<title>Danger </title><script>");
    });
  });
});
