/**
 * Issue #296 (epic #261, website-platform) — AUTOMATED LINK-INTEGRITY check
 * over the REAL public handlers, driven through the integration harness
 * (`invoke`/`invokeRaw`) against a live PostgreSQL as the least-privilege
 * `awcms_micro_app` role (FORCE'd RLS enforced). It complements the sibling
 * SEO/discovery suites (which assert output SHAPE) by proving the platform
 * advertises no broken links:
 *
 *   1. The sitemap is FOLLOWED end-to-end: index -> child sitemap(s) ->
 *      every content `<loc>` URL is invoked against its real handler and must
 *      return HTTP 200 (never 404/500). This proves the sitemap advertises
 *      only resolvable URLs, and that both EN and ID published posts appear.
 *   2. A rendered public `/news/{slug}` page's `<head>` is parsed and its
 *      `<link rel="canonical">` is followed and must resolve (200) — no
 *      broken canonical.
 *   3. The central SEO head renderer (`renderResourceSeoHead`) — the path that
 *      actually emits `<link rel="alternate" hreflang=...>` alternates — is
 *      driven, and its canonical + every same-origin hreflang alternate is
 *      followed and must resolve (200) — no broken hreflang.
 *   4. `robots.txt`'s advertised `Sitemap:` URL is followed and must resolve
 *      (200) — the discovery entrypoint is not a dangling link.
 *   5. A known DRAFT (unpublished) slug is asserted absent from the sitemap
 *      AND its direct `/news/{slug}` URL 404s — no dangling links to
 *      unpublished content.
 *
 * Seeds ONE tenant via the real setup wizard (bare tenants do NOT pass the
 * `/news` blog_content gate, so positive public renders MUST bootstrap through
 * the wizard — see tests/integration/harness.ts + skill `awcms-micro-testing`),
 * plus a verified PRIMARY domain and `PUBLIC_TENANT_RESOLUTION_MODE=host_default`
 * so the discovery routes derive a real host and the child `<loc>`s carry it.
 *
 * NOTE on link classes deliberately NOT followed from the rendered page head:
 * the `/news/{slug}` page shell (`public-page-rendering.ts`) emits a canonical
 * `<link>` but NO `<link rel="alternate" hreflang>` and NO RSS/Atom/feed
 * autodiscovery `<link>` in its head — so hreflang integrity is validated via
 * the central renderer (case 3, which does emit them) and feed/sitemap
 * discoverability via robots.txt (case 4). External (cross-origin) links are
 * never followed.
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
import { resetRateLimitStoreForTests } from "../../src/lib/security/rate-limit";
import { withTenant } from "../../src/lib/database/tenant-context";

// Real public discovery + content route handlers.
import { GET as getSitemapIndex } from "../../src/pages/sitemap.xml";
import { GET as getSitemapPage } from "../../src/pages/sitemap-[page].xml";
import { GET as getRobots } from "../../src/pages/robots.txt";
import { GET as getNewsDetail } from "../../src/pages/news/[slug]";

// Real setup/auth/blog-post API handlers (bootstrap + publish content).
import { POST as setupInitialize } from "../../src/pages/api/v1/setup/initialize";
import { POST as authLogin } from "../../src/pages/api/v1/auth/login";
import { POST as createPost } from "../../src/pages/api/v1/blog/posts/index";
import { POST as publishPost } from "../../src/pages/api/v1/blog/posts/[id]/publish";

// Real central SEO renderer + blog_content contribution adapter (hreflang path).
import {
  BLOG_POST_SEO_RESOURCE_TYPE,
  blogContentSeoFactsAdapter
} from "../../src/modules/blog-content/application/seo-facts-port-adapter";
import { renderResourceSeoHead } from "../../src/modules/seo-distribution/application/seo-metadata-service";

const suite = integrationEnabled ? describe : describe.skip;

const PRIMARY_HOST = "linkcheck.example";
const OWNER_LOGIN = "owner@example.com";
const OWNER_PASSWORD = "integration-test-owner-password";
const TENANT_NAME = "Linkcheck Co";

type Bootstrap = {
  tenantId: string;
  token: string;
  loginIdentifier: string;
};

type Post = { id: string; slug: string; locale: string };

// ---------------------------------------------------------------------------
// Seeding helpers (setup wizard for a gate-passing tenant; admin role only for
// the primary domain, which the wizard does not create).
// ---------------------------------------------------------------------------

async function bootstrapTenant(): Promise<Bootstrap> {
  const loginIdentifier = `linkcheck-${OWNER_LOGIN}`;
  const setup = await invoke<{ data: { tenantId: string } }>(setupInitialize, {
    method: "POST",
    path: "/api/v1/setup/initialize",
    headers: { "content-type": "application/json" },
    body: {
      tenantName: TENANT_NAME,
      tenantCode: "linkcheck",
      officeCode: "hq",
      officeName: "HQ",
      ownerLoginIdentifier: loginIdentifier,
      ownerPassword: OWNER_PASSWORD,
      ownerDisplayName: "Owner"
    }
  });
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

  return { tenantId, token: login.body.data.token, loginIdentifier };
}

function authHeaders(b: Bootstrap): Record<string, string> {
  return {
    "content-type": "application/json",
    "x-awcms-micro-tenant-id": b.tenantId,
    authorization: `Bearer ${b.token}`
  };
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

async function createDraftPost(
  b: Bootstrap,
  slug: string,
  title: string,
  locale: string
): Promise<Post> {
  const created = await invoke<{ data: { id: string; slug: string } }>(
    createPost,
    {
      method: "POST",
      path: "/api/v1/blog/posts",
      headers: authHeaders(b),
      body: {
        title,
        slug,
        excerpt: `${title} excerpt`,
        contentJson: { blocks: [{ type: "paragraph", text: "Body text" }] },
        contentText: "Body text",
        locale
      }
    }
  );
  expect(created.status).toBe(200);
  return { id: created.body.data.id, slug: created.body.data.slug, locale };
}

async function createAndPublishPost(
  b: Bootstrap,
  slug: string,
  title: string,
  locale: string
): Promise<Post> {
  const draft = await createDraftPost(b, slug, title, locale);
  const published = await invoke(publishPost, {
    method: "POST",
    path: `/api/v1/blog/posts/${draft.id}/publish`,
    headers: { ...authHeaders(b), "idempotency-key": crypto.randomUUID() },
    params: { id: draft.id }
  });
  expect(published.status).toBe(200);
  return draft;
}

// ---------------------------------------------------------------------------
// Dependency-free XML/HTML extraction (Bun's test runtime has no DOMParser —
// the sibling SEO suites extract with plain string/regex ops; this mirrors
// that). Only used to READ handler output, never to sanitize anything.
// ---------------------------------------------------------------------------

function decodeXmlEntities(value: string): string {
  // `&amp;` MUST be decoded LAST: decoding it first would let a literal
  // `&amp;lt;` collapse to `<` (double-unescaping, CodeQL js/double-escaping).
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

/** Every `<loc>...</loc>` URL in a sitemap document, entity-decoded + trimmed. */
function extractLocs(xml: string): string[] {
  const re = /<loc>([^<]*)<\/loc>/g;
  const out: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(xml)) !== null) {
    out.push(decodeXmlEntities(match[1]!.trim()));
  }
  return out;
}

type HeadLink = {
  rel: string | null;
  href: string | null;
  hreflang: string | null;
  type: string | null;
};

function getAttr(tag: string, name: string): string | null {
  const match = new RegExp(`\\b${name}="([^"]*)"`).exec(tag);
  return match ? decodeXmlEntities(match[1]!) : null;
}

/** Every `<link ...>` tag in the (head of the) rendered document. */
function extractHeadLinks(html: string): HeadLink[] {
  const headEnd = html.indexOf("</head>");
  const scope = headEnd === -1 ? html : html.slice(0, headEnd);
  const re = /<link\b[^>]*>/g;
  const out: HeadLink[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(scope)) !== null) {
    const tag = match[0];
    out.push({
      rel: getAttr(tag, "rel"),
      href: getAttr(tag, "href"),
      hreflang: getAttr(tag, "hreflang"),
      type: getAttr(tag, "type")
    });
  }
  return out;
}

/**
 * Follow one same-origin `/news/{slug}` URL through the real handler. The host
 * header is taken from the URL itself: a URL on `PRIMARY_HOST` resolves via the
 * host->domain mapping (host_default step 1); a URL on the harness origin
 * (`integration.test`, as the page shell's canonical emits via `url.origin`)
 * falls back to the setup_state default tenant — both reach the one seeded
 * tenant. Returns the HTTP status so callers can assert 200.
 */
async function followNewsUrl(rawUrl: string): Promise<number> {
  const url = new URL(rawUrl);
  const slug = url.pathname.split("/").filter(Boolean).pop() ?? "";
  const res = await invokeRaw(getNewsDetail, {
    method: "GET",
    path: url.pathname,
    headers: { host: url.hostname },
    params: { slug }
  });
  return res.status;
}

suite("public link integrity (Issue #296)", () => {
  const previousEnv = { ...process.env };

  let ctx: Bootstrap;
  let published: Post[];
  const draftSlug = "en-draft-hidden";

  beforeAll(async () => {
    await applyMigrations();
    await provisionAppRole();

    // Single seed for the whole (read-only) suite: reset once, bootstrap via
    // the wizard, attach a verified primary domain, publish EN+ID content, and
    // leave one unpublished draft. `host_default` lets the discovery routes
    // derive PRIMARY_HOST for the child `<loc>`s.
    await resetDatabase();
    process.env = { ...previousEnv };
    process.env.PUBLIC_TENANT_RESOLUTION_MODE = "host_default";

    ctx = await bootstrapTenant();
    await seedPrimaryDomain(ctx.tenantId, PRIMARY_HOST);

    published = [
      await createAndPublishPost(ctx, "en-launch", "EN Launch", "en"),
      await createAndPublishPost(ctx, "en-update", "EN Update", "en"),
      await createAndPublishPost(ctx, "id-peluncuran", "ID Peluncuran", "id")
    ];
    await createDraftPost(ctx, draftSlug, "Hidden Draft", "en");
  });

  afterAll(() => {
    process.env = previousEnv;
  });

  beforeEach(() => {
    // Shared in-process rate-limit bucket + host_default reasserted, in case an
    // earlier suite drove a rate-limited route or mutated the env.
    resetRateLimitStoreForTests();
    process.env.PUBLIC_TENANT_RESOLUTION_MODE = "host_default";
  });

  /** Walk sitemap index -> child sitemap(s) and return every content `<loc>`. */
  async function collectSitemapContentLocs(): Promise<string[]> {
    const index = await invokeRaw(getSitemapIndex, {
      method: "GET",
      path: "/sitemap.xml",
      headers: { host: PRIMARY_HOST }
    });
    expect(index.status).toBe(200);

    const childLocs = extractLocs(index.text);
    expect(childLocs.length).toBeGreaterThanOrEqual(1);

    const contentLocs: string[] = [];
    for (const childUrl of childLocs) {
      const url = new URL(childUrl);
      expect(url.hostname).toBe(PRIMARY_HOST);
      const pageMatch = /sitemap-(\d+)\.xml$/.exec(url.pathname);
      expect(pageMatch).not.toBeNull();

      const child = await invokeRaw(getSitemapPage, {
        method: "GET",
        path: url.pathname,
        headers: { host: PRIMARY_HOST },
        params: { page: pageMatch![1]! }
      });
      expect(child.status).toBe(200);
      contentLocs.push(...extractLocs(child.text));
    }
    return contentLocs;
  }

  test("every sitemap URL (index -> child -> content) resolves to 200; EN+ID posts are advertised", async () => {
    const contentLocs = await collectSitemapContentLocs();

    const newsLocs = contentLocs.filter((u) => {
      const url = new URL(u);
      return url.hostname === PRIMARY_HOST && url.pathname.startsWith("/news/");
    });
    // At least the three published (EN, EN, ID) posts.
    expect(newsLocs.length).toBeGreaterThanOrEqual(3);

    // Every advertised content URL must resolve — no dangling sitemap entry.
    for (const loc of newsLocs) {
      const status = await followNewsUrl(loc);
      expect(status).toBe(200);
    }

    // Both locales' published slugs are actually present.
    for (const post of published) {
      expect(
        newsLocs.some((u) => new URL(u).pathname === `/news/${post.slug}`)
      ).toBe(true);
    }
  });

  test("draft/unpublished content is absent from the sitemap AND 404s on direct access", async () => {
    const contentLocs = await collectSitemapContentLocs();

    expect(contentLocs.some((u) => u.includes(draftSlug))).toBe(false);

    const direct = await invokeRaw(getNewsDetail, {
      method: "GET",
      path: `/news/${draftSlug}`,
      headers: { host: PRIMARY_HOST },
      params: { slug: draftSlug }
    });
    expect(direct.status).toBe(404);
  });

  test("rendered /news/{slug} head: the canonical link resolves (no broken canonical)", async () => {
    const post = published[0]!;
    const page = await invokeRaw(getNewsDetail, {
      method: "GET",
      path: `/news/${post.slug}`,
      headers: { host: PRIMARY_HOST },
      params: { slug: post.slug }
    });
    expect(page.status).toBe(200);
    expect(page.response.headers.get("content-type")).toContain("text/html");

    const links = extractHeadLinks(page.text);
    const canonical = links.find((l) => l.rel === "canonical");
    expect(canonical?.href).toBeTruthy();

    // Follow the canonical (same-origin) — it must resolve.
    const status = await followNewsUrl(canonical!.href!);
    expect(status).toBe(200);
  });

  test("central SEO head: canonical + every hreflang alternate resolve (no broken hreflang)", async () => {
    const post = published[0]!;
    const result = await withTenant(getTestSql(), ctx.tenantId, (tx) =>
      renderResourceSeoHead(tx, {
        tenantId: ctx.tenantId,
        tenantDisplayName: TENANT_NAME,
        resourceType: BLOG_POST_SEO_RESOURCE_TYPE,
        resourceId: post.id,
        factsSource: blogContentSeoFactsAdapter,
        mediaLibrary: null
      })
    );

    expect(result.renderable).toBe(true);
    if (!result.renderable) return;

    const links = extractHeadLinks(result.headHtml);
    const canonical = links.find((l) => l.rel === "canonical");
    expect(canonical?.href).toContain(`https://${PRIMARY_HOST}/news/`);

    const alternates = links.filter(
      (l) => l.rel === "alternate" && l.hreflang && l.href
    );
    expect(alternates.length).toBeGreaterThanOrEqual(1);

    // Canonical + each same-origin hreflang target must resolve (no broken
    // alternate); any (defensively) cross-origin alternate is skipped.
    const toFollow = [canonical!.href!, ...alternates.map((a) => a.href!)];
    for (const href of toFollow) {
      if (new URL(href).hostname !== PRIMARY_HOST) continue;
      const status = await followNewsUrl(href);
      expect(status).toBe(200);
    }
  });

  test("robots.txt advertises a Sitemap URL that resolves (200)", async () => {
    const robots = await invokeRaw(getRobots, {
      method: "GET",
      path: "/robots.txt",
      headers: { host: PRIMARY_HOST }
    });
    expect(robots.status).toBe(200);

    const match = /Sitemap:\s*(\S+)/.exec(robots.text);
    expect(match).not.toBeNull();
    const sitemapUrl = new URL(match![1]!);
    expect(sitemapUrl.hostname).toBe(PRIMARY_HOST);

    const followed = await invokeRaw(getSitemapIndex, {
      method: "GET",
      path: sitemapUrl.pathname,
      headers: { host: PRIMARY_HOST }
    });
    expect(followed.status).toBe(200);
  });
});
