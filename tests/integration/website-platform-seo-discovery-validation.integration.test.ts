/**
 * Issue #273 (epic #261, website-platform) — an INTEGRATED validation suite over
 * the platform's SEO/distribution/discovery OUTPUT SHAPE, driving the real Astro
 * route handlers (`invokeRaw`), the real central SEO renderer
 * (`renderResourceSeoHead`), and the real site_search engine against a live
 * PostgreSQL as the least-privilege `awcms_micro_app` role (FORCE'd RLS enforced).
 *
 * The sibling SEO integration tests each own a single surface's behaviour
 * (rendering, discovery routing, redirects, search). This suite deliberately
 * complements — not duplicates — them by asserting the acceptance-criteria
 * *validity* the issue calls out: that every emitted artifact is WELL-FORMED and
 * carries only published tenant/locale content, end-to-end:
 *
 *   1. Sitemap index + child are well-formed XML (balanced-tag parse) with the
 *      expected sitemapindex/urlset roots and only published/public URLs.
 *   2. RSS + Atom are well-formed XML; JSON Feed is valid JSON — all carrying
 *      only published tenant/locale items.
 *   3. robots.txt is served text/plain with the expected directives.
 *   4. A rendered public page head carries canonical + hreflang + Open Graph +
 *      JSON-LD with correct values; the JSON-LD block PARSES as valid JSON and
 *      exposes an @context/@type.
 *   5. ETag / 304 conditional-request behaviour on a cacheable distribution
 *      endpoint.
 *   6. site_search returns ONLY published content for the right tenant+locale,
 *      and a rebuild/reindex followed by the same query is IDEMPOTENT (identical
 *      result set); draft/unpublished content is absent.
 *
 * Skipped unless DATABASE_URL is set (see tests/integration/harness.ts).
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
  createCookieJar,
  getAdminSql,
  getTestSql,
  integrationEnabled,
  invoke,
  invokeRaw,
  provisionAppRole,
  resetDatabase
} from "./harness";
import { withTenant } from "../../src/lib/database/tenant-context";

// Real public discovery/distribution route handlers.
import { GET as getRobots } from "../../src/pages/robots.txt";
import { GET as getSitemapIndex } from "../../src/pages/sitemap.xml";
import { GET as getSitemapPage } from "../../src/pages/sitemap-[page].xml";
import { GET as getRss } from "../../src/pages/feed.xml";
import { GET as getAtom } from "../../src/pages/atom.xml";
import { GET as getJsonFeed } from "../../src/pages/feed.json";
import { GET as getNewsDetail } from "../../src/pages/news/[slug]";

// Real central SEO renderer + blog_content contribution adapter.
import {
  BLOG_POST_SEO_RESOURCE_TYPE,
  blogContentSeoFactsAdapter
} from "../../src/modules/blog-content/application/seo-facts-port-adapter";
import { renderResourceSeoHead } from "../../src/modules/seo-distribution/application/seo-metadata-service";

// Real setup/auth/blog-post API handlers (for the end-to-end public-page path).
import { POST as setupInitialize } from "../../src/pages/api/v1/setup/initialize";
import { POST as authLogin } from "../../src/pages/api/v1/auth/login";
import { POST as createPost } from "../../src/pages/api/v1/blog/posts/index";
import { POST as publishPost } from "../../src/pages/api/v1/blog/posts/[id]/publish";

// Real site_search engine + service.
import { getRegisteredSearchSources } from "../../src/lib/search/search-sources";
import {
  rebuildTenantSearchIndex,
  reconcileTenantSearchIndex
} from "../../src/modules/site-search/application/search-index-engine";
import { searchSiteContent } from "../../src/modules/site-search/application/search-service";

const suite = integrationEnabled ? describe : describe.skip;

const TENANT_A = "a1111111-1111-1111-1111-111111111111";
const TENANT_B = "b2222222-2222-2222-2222-222222222222";
const AUTHOR = "c3333333-3333-3333-3333-333333333333";
const HOST_A = "acme.example";
const HOST_B = "beta.example";
const PUB = new Date("2026-06-01T00:00:00.000Z");

const SEARCH_SOURCES = getRegisteredSearchSources();

const OWNER_LOGIN = "owner@example.com";
const OWNER_PASSWORD = "integration-test-owner-password";

// ---------------------------------------------------------------------------
// Fixture seeding (privileged role — bypasses RLS to plant cross-tenant data).
// ---------------------------------------------------------------------------

async function seedTenant(
  id: string,
  code: string,
  locale = "en"
): Promise<void> {
  await getAdminSql()`
    INSERT INTO awcms_micro_tenants
      (id, tenant_code, tenant_name, legal_name, status, default_locale, default_theme)
    VALUES (${id}, ${code}, ${code + " Name"}, ${code + " Legal"}, 'active', ${locale}, 'light')
    ON CONFLICT (id) DO NOTHING
  `;
}

async function seedPrimaryDomain(
  tenantId: string,
  host: string
): Promise<void> {
  await getAdminSql()`
    INSERT INTO awcms_micro_tenant_domains
      (tenant_id, hostname, normalized_hostname, domain_type, status, is_primary)
    VALUES (${tenantId}, ${host}, ${host.toLowerCase()}, 'custom_domain', 'active', true)
  `;
}

type PostSeed = {
  slug: string;
  title?: string;
  body?: string;
  status?: string;
  visibility?: string;
  locale?: string;
  publishedAt?: Date | null;
  updatedAt?: Date;
  deletedAt?: Date | null;
};

async function insertPost(tenantId: string, seed: PostSeed): Promise<string> {
  const id = crypto.randomUUID();
  await getAdminSql()`
    INSERT INTO awcms_micro_blog_posts
      (id, tenant_id, author_tenant_user_id, title, slug, content_json, content_text,
       status, visibility, locale, published_at, updated_at, deleted_at)
    VALUES (
      ${id}, ${tenantId}, ${AUTHOR}, ${seed.title ?? seed.slug}, ${seed.slug},
      '{}'::jsonb, ${seed.body ?? "body text"},
      ${seed.status ?? "published"}, ${seed.visibility ?? "public"}, ${seed.locale ?? "en"},
      ${seed.publishedAt === undefined ? PUB : seed.publishedAt},
      ${seed.updatedAt ?? PUB}, ${seed.deletedAt ?? null}
    )
  `;
  return id;
}

/** Drive a discovery GET route with a Host header + optional conditional headers. */
function fetchRoute(
  handler: Parameters<typeof invokeRaw>[0],
  path: string,
  host: string,
  extraHeaders: Record<string, string> = {},
  params: Record<string, string> = {}
) {
  return invokeRaw(handler, {
    method: "GET",
    path,
    headers: { host, ...extraHeaders },
    params
  });
}

// ---------------------------------------------------------------------------
// Lightweight XML well-formedness check.
//
// Bun's test runtime has no DOMParser; the sibling SEO tests assert with
// `.toContain(...)` only. This adds a genuine (but dependency-free)
// well-formedness gate: after stripping the XML declaration, comments, and
// CDATA, every element open tag must be matched by a close tag in LIFO order
// (self-closing tags don't push), the stack must empty, and the first opened
// element must be the expected root. This catches truncated/unbalanced output
// that a bare substring check would miss.
// ---------------------------------------------------------------------------

function assertWellFormedXml(xml: string, expectedRoot: string): void {
  expect(xml.startsWith("<?xml")).toBe(true);

  const stripped = xml
    .replace(/<\?[\s\S]*?\?>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, "");

  const stack: string[] = [];
  let firstOpen: string | null = null;
  const tagRe = /<(\/?)([A-Za-z][\w:.-]*)(?:\s[^>]*?)?(\/?)>/g;

  let match: RegExpExecArray | null;
  while ((match = tagRe.exec(stripped)) !== null) {
    const isClose = match[1] === "/";
    const name = match[2]!;
    const selfClose = match[3] === "/";
    if (isClose) {
      expect(stack.pop()).toBe(name);
    } else {
      if (firstOpen === null) firstOpen = name;
      if (!selfClose) stack.push(name);
    }
  }

  expect(stack).toHaveLength(0);
  expect(firstOpen).toBe(expectedRoot);
}

/** Extract the raw body of every `<script type="application/ld+json">` block. */
function extractJsonLdBodies(html: string): string[] {
  return html
    .split('<script type="application/ld+json">')
    .slice(1)
    .map((chunk) => chunk.split("</script>")[0]!);
}

suite("website-platform SEO/discovery output validation (Issue #273)", () => {
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
  });

  // -------------------------------------------------------------------------
  // Distribution + discovery routes — XML/JSON well-formedness, published-only,
  // robots directives, ETag/304.
  // -------------------------------------------------------------------------
  describe("distribution + discovery routes", () => {
    beforeEach(async () => {
      process.env.PUBLIC_TENANT_RESOLUTION_MODE = "host_default";
      await seedTenant(TENANT_A, "acme");
      await seedTenant(TENANT_B, "beta");
      await seedPrimaryDomain(TENANT_A, HOST_A);
      await seedPrimaryDomain(TENANT_B, HOST_B);
    });

    test("sitemap index + child are well-formed XML with the expected roots; only published/public URLs appear", async () => {
      await insertPost(TENANT_A, { slug: "published-public" });
      await insertPost(TENANT_A, { slug: "a-draft", status: "draft" });
      await insertPost(TENANT_A, { slug: "an-archived", status: "archived" });
      await insertPost(TENANT_A, { slug: "a-private", visibility: "private" });
      await insertPost(TENANT_A, {
        slug: "future",
        publishedAt: new Date("2999-01-01T00:00:00.000Z")
      });

      const index = await fetchRoute(getSitemapIndex, "/sitemap.xml", HOST_A);
      expect(index.status).toBe(200);
      expect(index.response.headers.get("content-type")).toContain(
        "application/xml"
      );
      assertWellFormedXml(index.text, "sitemapindex");
      expect(index.text).toContain(`https://${HOST_A}/sitemap-1.xml`);

      const child = await fetchRoute(
        getSitemapPage,
        "/sitemap-1.xml",
        HOST_A,
        {},
        { page: "1" }
      );
      expect(child.status).toBe(200);
      assertWellFormedXml(child.text, "urlset");
      expect(child.text).toContain(`https://${HOST_A}/news/published-public`);
      for (const leaked of ["a-draft", "an-archived", "a-private", "future"]) {
        expect(child.text).not.toContain(`/news/${leaked}`);
      }
      // Cross-tenant: never the other tenant's host.
      expect(child.text).not.toContain(HOST_B);
    });

    test("RSS + Atom are well-formed XML and JSON Feed is valid JSON; all carry only published tenant items", async () => {
      await insertPost(TENANT_A, { slug: "live-post", title: "Live Post" });
      await insertPost(TENANT_A, { slug: "draft-post", status: "draft" });
      await insertPost(TENANT_B, { slug: "other-tenant" });

      const rss = await fetchRoute(getRss, "/feed.xml", HOST_A);
      expect(rss.status).toBe(200);
      expect(rss.response.headers.get("content-type")).toContain(
        "application/rss+xml"
      );
      assertWellFormedXml(rss.text, "rss");
      expect(rss.text).toContain(`https://${HOST_A}/news/live-post`);
      expect(rss.text).not.toContain("/news/draft-post");
      expect(rss.text).not.toContain("/news/other-tenant");

      const atom = await fetchRoute(getAtom, "/atom.xml", HOST_A);
      expect(atom.status).toBe(200);
      expect(atom.response.headers.get("content-type")).toContain(
        "application/atom+xml"
      );
      assertWellFormedXml(atom.text, "feed");
      expect(atom.text).toContain(`https://${HOST_A}/news/live-post`);
      expect(atom.text).not.toContain("/news/draft-post");

      const json = await fetchRoute(getJsonFeed, "/feed.json", HOST_A);
      expect(json.status).toBe(200);
      expect(json.response.headers.get("content-type")).toContain(
        "application/feed+json"
      );
      const parsed = JSON.parse(json.text) as {
        version: string;
        items: { id: string }[];
      };
      expect(parsed.version).toBe("https://jsonfeed.org/version/1.1");
      expect(parsed.items).toHaveLength(1);
      expect(parsed.items[0]!.id).toBe(`https://${HOST_A}/news/live-post`);
    });

    test("robots.txt is served text/plain with the expected crawl directives + absolute sitemap", async () => {
      const res = await fetchRoute(getRobots, "/robots.txt", HOST_A);
      expect(res.status).toBe(200);
      expect(res.response.headers.get("content-type")).toContain("text/plain");
      expect(res.text).toContain("User-agent: *");
      expect(res.text).toContain("Disallow: /admin/");
      expect(res.text).toContain("Disallow: /api/");
      expect(res.text).toContain(`Sitemap: https://${HOST_A}/sitemap.xml`);
    });

    test("ETag/304: a cacheable distribution endpoint returns a stable ETag and honours If-None-Match", async () => {
      await insertPost(TENANT_A, { slug: "cache-me" });

      const first = await fetchRoute(getSitemapIndex, "/sitemap.xml", HOST_A);
      expect(first.status).toBe(200);
      const etag = first.response.headers.get("etag");
      expect(etag).toBeTruthy();
      expect(first.response.headers.get("cache-control")).toContain("max-age=");

      // Identical request → identical validator.
      const second = await fetchRoute(getSitemapIndex, "/sitemap.xml", HOST_A);
      expect(second.response.headers.get("etag")).toBe(etag);

      // Conditional request with the matching validator → 304, empty body.
      const conditional = await fetchRoute(
        getSitemapIndex,
        "/sitemap.xml",
        HOST_A,
        { "if-none-match": etag! }
      );
      expect(conditional.status).toBe(304);
      expect(conditional.text).toBe("");
    });
  });

  // -------------------------------------------------------------------------
  // Rendered public page head — canonical, hreflang, Open Graph, JSON-LD.
  // -------------------------------------------------------------------------
  describe("rendered public page head", () => {
    test("central renderer emits canonical + hreflang + Open Graph with correct values; JSON-LD parses as valid JSON with an @type", async () => {
      await seedTenant(TENANT_A, "acme");
      await seedPrimaryDomain(TENANT_A, HOST_A);
      const postId = await insertPost(TENANT_A, {
        slug: "launch-day",
        title: "Launch Day"
      });

      const result = await withTenant(getTestSql(), TENANT_A, (tx) =>
        renderResourceSeoHead(tx, {
          tenantId: TENANT_A,
          tenantDisplayName: "Acme Name",
          resourceType: BLOG_POST_SEO_RESOURCE_TYPE,
          resourceId: postId,
          factsSource: blogContentSeoFactsAdapter,
          mediaLibrary: null
        })
      );

      expect(result.renderable).toBe(true);
      if (!result.renderable) return;

      const canonical = `https://${HOST_A}/news/launch-day`;

      // Canonical.
      expect(result.document.canonicalUrl).toBe(canonical);
      expect(result.headHtml).toContain(
        `<link rel="canonical" href="${canonical}" />`
      );

      // hreflang alternates — the resource's own locale + x-default.
      expect(result.headHtml).toContain(
        `<link rel="alternate" hreflang="en" href="${canonical}" />`
      );
      expect(result.headHtml).toContain(
        `<link rel="alternate" hreflang="x-default" href="${canonical}" />`
      );

      // Open Graph — title + canonical url.
      expect(result.headHtml).toContain(
        '<meta property="og:title" content="Launch Day" />'
      );
      expect(result.headHtml).toContain(
        `<meta property="og:url" content="${canonical}" />`
      );

      // Indexable → index,follow.
      expect(result.headHtml).toContain(
        '<meta name="robots" content="index,follow" />'
      );

      // JSON-LD parses as valid JSON with an @type (schema.org node).
      const bodies = extractJsonLdBodies(result.headHtml);
      expect(bodies.length).toBeGreaterThanOrEqual(1);
      const parsedNodes = bodies.map(
        (body) => JSON.parse(body) as Record<string, unknown>
      );
      expect(
        parsedNodes.every((node) => typeof node["@type"] === "string")
      ).toBe(true);
      // The resource node is an Article (blog_content provider).
      expect(parsedNodes.some((node) => node["@type"] === "Article")).toBe(
        true
      );
    });

    test("end-to-end public /news/{slug} head carries schema.org JSON-LD that parses as valid JSON with @context + @type", async () => {
      // A single-tenant bootstrap via the real setup wizard, so `/news/{slug}`
      // resolves without a host header (mirrors the news_portal social-preview
      // integration test).
      const loginIdentifier = `acme-${OWNER_LOGIN}`;
      const setup = await invoke<{ data: { tenantId: string } }>(
        setupInitialize,
        {
          method: "POST",
          path: "/api/v1/setup/initialize",
          headers: { "content-type": "application/json" },
          body: {
            tenantName: "Acme",
            tenantCode: "acme",
            officeCode: "hq",
            officeName: "HQ",
            ownerLoginIdentifier: loginIdentifier,
            ownerPassword: OWNER_PASSWORD,
            ownerDisplayName: "Owner"
          }
        }
      );
      expect(setup.status).toBe(200);
      const tenantId = setup.body.data.tenantId;

      const login = await invoke<{ data: { token: string } }>(authLogin, {
        method: "POST",
        path: "/api/v1/auth/login",
        headers: {
          "content-type": "application/json",
          "x-awcms-micro-tenant-id": tenantId
        },
        body: { loginIdentifier, password: OWNER_PASSWORD },
        cookies: createCookieJar()
      });
      expect(login.status).toBe(200);
      const authHeaders = {
        "content-type": "application/json",
        "x-awcms-micro-tenant-id": tenantId,
        authorization: `Bearer ${login.body.data.token}`
      };

      const slug = `hello-news-${Math.random().toString(36).slice(2, 8)}`;
      const created = await invoke<{ data: { id: string; slug: string } }>(
        createPost,
        {
          method: "POST",
          path: "/api/v1/blog/posts",
          headers: authHeaders,
          body: {
            title: "Hello News",
            slug,
            excerpt: "An excerpt",
            contentJson: { blocks: [{ type: "paragraph", text: "Body text" }] },
            contentText: "Body text",
            locale: "en"
          }
        }
      );
      expect(created.status).toBe(200);

      const published = await invoke(publishPost, {
        method: "POST",
        path: `/api/v1/blog/posts/${created.body.data.id}/publish`,
        headers: { ...authHeaders, "idempotency-key": crypto.randomUUID() },
        params: { id: created.body.data.id }
      });
      expect(published.status).toBe(200);

      const page = await invokeRaw(getNewsDetail, {
        method: "GET",
        path: `/news/${created.body.data.slug}`,
        params: { slug: created.body.data.slug }
      });
      expect(page.status).toBe(200);
      expect(page.response.headers.get("content-type")).toContain("text/html");

      // Canonical + Open Graph present in the rendered head.
      expect(page.text).toContain('<link rel="canonical"');
      expect(page.text).toContain('<meta property="og:title"');
      expect(page.text).toContain('<meta property="og:url"');

      // JSON-LD parses as valid JSON with a schema.org @context + @type.
      const bodies = extractJsonLdBodies(page.text);
      expect(bodies.length).toBeGreaterThanOrEqual(1);
      const node = JSON.parse(bodies[0]!) as Record<string, unknown>;
      expect(node["@context"]).toBe("https://schema.org");
      expect(typeof node["@type"]).toBe("string");
      expect(node["@type"]).toBe("NewsArticle");
    });
  });

  // -------------------------------------------------------------------------
  // site_search — published-only, tenant+locale-scoped, idempotent rebuild.
  // -------------------------------------------------------------------------
  describe("site_search publication + idempotency", () => {
    beforeEach(async () => {
      await seedTenant(TENANT_A, "acme");
      await seedTenant(TENANT_B, "beta");
    });

    test("search returns ONLY published content for the right tenant+locale; drafts/private/other-tenant/other-locale absent", async () => {
      await insertPost(TENANT_A, {
        slug: "en-hit",
        title: "Published aardvark",
        body: "the published aardvark body",
        locale: "en"
      });
      await insertPost(TENANT_A, {
        slug: "draft-hit",
        title: "Draft aardvark",
        body: "draft aardvark body",
        status: "draft"
      });
      await insertPost(TENANT_A, {
        slug: "private-hit",
        title: "Private aardvark",
        body: "private aardvark body",
        visibility: "private"
      });
      await insertPost(TENANT_A, {
        slug: "id-hit",
        title: "Aardvark dalam bahasa",
        body: "aardvark badan konten",
        locale: "id"
      });
      await insertPost(TENANT_B, {
        slug: "b-hit",
        title: "Other tenant aardvark",
        body: "other tenant aardvark body"
      });

      await withTenant(getTestSql(), TENANT_A, (tx) =>
        reconcileTenantSearchIndex(tx, TENANT_A, SEARCH_SOURCES)
      );
      await withTenant(getTestSql(), TENANT_B, (tx) =>
        reconcileTenantSearchIndex(tx, TENANT_B, SEARCH_SOURCES)
      );

      const enResult = await withTenant(getTestSql(), TENANT_A, (tx) =>
        searchSiteContent(tx, TENANT_A, {
          query: "aardvark",
          locale: "en",
          limit: 20
        })
      );

      // Only the single published, public, EN-locale, tenant-A post.
      expect(enResult.items).toHaveLength(1);
      expect(enResult.items[0]!.url).toBe("/news/en-hit");
      expect(enResult.items[0]!.title).toBe("Published aardvark");
    });

    test("rebuild then the same query is idempotent (identical result set); a second reconcile reports no drift", async () => {
      for (let i = 0; i < 4; i += 1) {
        await insertPost(TENANT_A, {
          slug: `otter-${i}`,
          title: `Otter number ${i}`,
          body: `otter body ${i}`
        });
      }

      const runQuery = () =>
        withTenant(getTestSql(), TENANT_A, (tx) =>
          searchSiteContent(tx, TENANT_A, {
            query: "otter",
            locale: "en",
            limit: 20
          })
        );

      const firstRebuild = await withTenant(getTestSql(), TENANT_A, (tx) =>
        rebuildTenantSearchIndex(tx, TENANT_A, SEARCH_SOURCES)
      );
      expect(firstRebuild.status).toBe("succeeded");
      const resultA = await runQuery();
      expect(resultA.items).toHaveLength(4);

      // Rebuild again with no source change — the query is idempotent.
      const secondRebuild = await withTenant(getTestSql(), TENANT_A, (tx) =>
        rebuildTenantSearchIndex(tx, TENANT_A, SEARCH_SOURCES)
      );
      expect(secondRebuild.status).toBe("succeeded");
      const resultB = await runQuery();

      const urlsA = resultA.items.map((item) => item.url).sort();
      const urlsB = resultB.items.map((item) => item.url).sort();
      expect(urlsB).toEqual(urlsA);

      // A no-op reconcile after the rebuild reports every doc unchanged.
      const reconcile = await withTenant(getTestSql(), TENANT_A, (tx) =>
        reconcileTenantSearchIndex(tx, TENANT_A, SEARCH_SOURCES)
      );
      expect(reconcile.results[0]!.unchanged).toBe(4);
      expect(reconcile.results[0]!.added).toBe(0);
      expect(reconcile.results[0]!.updated).toBe(0);
      expect(reconcile.results[0]!.removed).toBe(0);
    });

    test("unpublishing at the source + reconcile drops the doc with no stale leakage in the same query", async () => {
      const id = await insertPost(TENANT_A, {
        slug: "removable",
        title: "Removable panther",
        body: "panther body"
      });
      await withTenant(getTestSql(), TENANT_A, (tx) =>
        reconcileTenantSearchIndex(tx, TENANT_A, SEARCH_SOURCES)
      );

      const before = await withTenant(getTestSql(), TENANT_A, (tx) =>
        searchSiteContent(tx, TENANT_A, {
          query: "panther",
          locale: "en",
          limit: 20
        })
      );
      expect(before.items).toHaveLength(1);

      await getAdminSql()`
        UPDATE awcms_micro_blog_posts SET status = 'draft', updated_at = now() WHERE id = ${id}
      `;
      await withTenant(getTestSql(), TENANT_A, (tx) =>
        reconcileTenantSearchIndex(tx, TENANT_A, SEARCH_SOURCES)
      );

      const after = await withTenant(getTestSql(), TENANT_A, (tx) =>
        searchSiteContent(tx, TENANT_A, {
          query: "panther",
          locale: "en",
          limit: 20
        })
      );
      expect(after.items).toHaveLength(0);
    });
  });
});
