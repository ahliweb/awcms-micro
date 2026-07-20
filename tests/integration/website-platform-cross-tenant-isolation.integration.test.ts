/**
 * Website-platform cross-tenant + locale ISOLATION proof (Issue #273, epic
 * #261). The other integration suites in this repo each prove isolation for a
 * SINGLE module in depth; this suite is the integrated counterpart the #273
 * acceptance criterion asks for — "Tenant/domain/locale isolation is proven
 * across every public and admin capability" — exercised across as many of the
 * shipped public/admin surfaces as exist, in ONE cohesive place, so a
 * regression that lets tenant B's content bleed into tenant A on ANY surface
 * fails here even if the per-module suite still passes.
 *
 * Surfaces covered (breadth over depth):
 *   1. blog_content public routes (/blog/[tenantCode]) + the authenticated
 *      admin list API — tenant A's post never surfaces under tenant B, and a
 *      tenant-A admin token cannot read tenant-B rows (RLS FORCE).
 *   2. site_search — an A-scoped query never returns B's document, and an
 *      EN query never returns an ID-locale document (locale scoping).
 *   3. seo_distribution — a redirect rule and a sitemap child page resolve by
 *      SERVER-DERIVED host only; A's rule/URLs never appear on B's host.
 *   4. comments public read — tenant B cannot see tenant A's approved comment.
 *   5. newsletter public subscribe — the anti-enumeration generic body is
 *      returned regardless of host, and a subscriber written under A is
 *      invisible under B (RLS FORCE).
 *
 * Every surface is driven through the REAL route handler or the REAL
 * application service as the least-privilege `awcms_micro_app` role inside a
 * tenant transaction, so FORCE'd RLS is genuinely enforced (a superuser would
 * bypass it). Seeding that must bypass RLS uses the privileged `getAdminSql()`.
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
import { resetRateLimitStoreForTests } from "../../src/lib/security/rate-limit";

// --- site_search ----------------------------------------------------------
import { getRegisteredSearchSources } from "../../src/lib/search/search-sources";
import { reconcileTenantSearchIndex } from "../../src/modules/site-search/application/search-index-engine";
import { searchSiteContent } from "../../src/modules/site-search/application/search-service";

// --- comments -------------------------------------------------------------
import { resolvePublishedCommentableResource } from "../../src/modules/comments/application/commentable-resource-engine";
import {
  listApprovedComments,
  submitComment
} from "../../src/modules/comments/application/comment-service";
import { moderateComment } from "../../src/modules/comments/application/comment-moderation";
import { getOrCreateThread } from "../../src/modules/comments/application/comment-thread-directory";
import { DEFAULT_COMMENT_SETTINGS } from "../../src/modules/comments/domain/comment-settings";

// --- newsletter -----------------------------------------------------------
import { subscribeToNewsletter } from "../../src/modules/newsletter/application/subscriber-service";
import { deriveSubscriberEmailParts } from "../../src/modules/newsletter/domain/subscriber-identity";
import { POST as newsletterSubscribe } from "../../src/pages/api/v1/newsletter/subscribe";

// --- seo_distribution -----------------------------------------------------
import { resolvePublicRedirect } from "../../src/modules/seo-distribution/application/redirect-resolution-service";
import { GET as getSitemapPage } from "../../src/pages/sitemap-[page].xml";

// --- blog_content (admin API + public routes) -----------------------------
import { POST as setupInitialize } from "../../src/pages/api/v1/setup/initialize";
import { POST as authLogin } from "../../src/pages/api/v1/auth/login";
import {
  GET as listPosts,
  POST as createPost
} from "../../src/pages/api/v1/blog/posts/index";
import { POST as publishPost } from "../../src/pages/api/v1/blog/posts/[id]/publish";
import { GET as publicIndex } from "../../src/pages/blog/[tenantCode]/index";
import { GET as publicDetail } from "../../src/pages/blog/[tenantCode]/[slug]";

const suite = integrationEnabled ? describe : describe.skip;

// Two fixed tenants for the service/host-level surfaces (each test resets the
// DB, so reuse across tests is safe). The blog admin test bootstraps its OWN
// tenant via the setup wizard instead (it needs an owner session + token).
const TENANT_A = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const TENANT_B = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";
const AUTHOR = "cccccccc-cccc-cccc-cccc-cccccccccccc";
const MODERATOR = "dddddddd-dddd-dddd-dddd-dddddddddddd";
const HOST_A = "acme.example";
const HOST_B = "beta.example";

const OWNER_LOGIN = "owner@example.com";
const OWNER_PASSWORD = "integration-test-owner-password";

const SEARCH_SOURCES = getRegisteredSearchSources();

const COMMENT_SETTINGS = {
  ...DEFAULT_COMMENT_SETTINGS,
  minSubmitSeconds: 0,
  blockedTerms: []
};

async function seedTenant(id: string, code: string): Promise<void> {
  await getAdminSql()`
    INSERT INTO awcms_micro_tenants
      (id, tenant_code, tenant_name, legal_name, status, default_locale, default_theme)
    VALUES (${id}, ${code}, ${`${code} Name`}, ${`${code} Legal`}, 'active', 'en', 'light')
    ON CONFLICT (id) DO NOTHING
  `;
}

/** Seed a bare, active second tenant directly (privileged role) — the setup
 * wizard is a once-per-database singleton, so a second tenant a test also
 * needs must be seeded this way. Returns { tenantId, tenantCode }. */
async function seedActiveTenant(
  code: string,
  name: string
): Promise<{ tenantId: string; tenantCode: string }> {
  const tenantId = crypto.randomUUID();
  await getAdminSql()`
    INSERT INTO awcms_micro_tenants (id, tenant_code, tenant_name, status)
    VALUES (${tenantId}, ${code}, ${name}, 'active')
  `;
  return { tenantId, tenantCode: code };
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
  deletedAt?: Date | null;
};

/** Seed a blog post directly (privileged role) and return its id. */
async function seedPost(tenantId: string, seed: PostSeed): Promise<string> {
  const id = crypto.randomUUID();
  await getAdminSql()`
    INSERT INTO awcms_micro_blog_posts
      (id, tenant_id, author_tenant_user_id, title, slug, content_json, content_text,
       status, visibility, locale, published_at, deleted_at, created_at, updated_at)
    VALUES (
      ${id}, ${tenantId}, ${AUTHOR}, ${seed.title ?? `Post ${seed.slug}`}, ${seed.slug},
      '{}'::jsonb, ${seed.body ?? "body"}, ${seed.status ?? "published"},
      ${seed.visibility ?? "public"}, ${seed.locale ?? "en"},
      ${seed.publishedAt === undefined ? new Date("2026-01-01T00:00:00Z") : seed.publishedAt},
      ${seed.deletedAt ?? null}, now(), now()
    )
  `;
  return id;
}

function redirectOpts(pathname: string): {
  pathname: string;
  search: string;
  locale: string | null;
} {
  return { pathname, search: "", locale: "en" };
}

function hostRequest(host: string, path: string): Request {
  return new Request(`http://${host}${path}`, { headers: { host } });
}

// ---------------------------------------------------------------------------
// The blog admin/public surface needs a real owner session; bootstrap it via
// the setup wizard + login exactly like blog-content-public-routes does.
// ---------------------------------------------------------------------------

type Bootstrap = { tenantId: string; tenantCode: string; token: string };

async function bootstrapTenantWithOwner(
  tenantCode: string,
  tenantName: string
): Promise<Bootstrap> {
  const setup = await invoke<{ data: { tenantId: string } }>(setupInitialize, {
    method: "POST",
    path: "/api/v1/setup/initialize",
    headers: { "content-type": "application/json" },
    body: {
      tenantName,
      tenantCode,
      officeCode: "hq",
      officeName: "HQ",
      ownerLoginIdentifier: `${tenantCode}-${OWNER_LOGIN}`,
      ownerPassword: OWNER_PASSWORD,
      ownerDisplayName: "Owner"
    }
  });
  expect(setup.status).toBe(200);

  const login = await invoke<{ data: { token: string } }>(authLogin, {
    method: "POST",
    path: "/api/v1/auth/login",
    headers: {
      "content-type": "application/json",
      "x-awcms-micro-tenant-id": setup.body.data.tenantId
    },
    body: {
      loginIdentifier: `${tenantCode}-${OWNER_LOGIN}`,
      password: OWNER_PASSWORD
    },
    cookies: createCookieJar()
  });
  expect(login.status).toBe(200);

  return {
    tenantId: setup.body.data.tenantId,
    tenantCode,
    token: login.body.data.token
  };
}

function authHeaders(b: Bootstrap): Record<string, string> {
  return {
    "content-type": "application/json",
    "x-awcms-micro-tenant-id": b.tenantId,
    authorization: `Bearer ${b.token}`
  };
}

async function createAndPublishPost(
  owner: Bootstrap,
  slug: string
): Promise<string> {
  const created = await invoke<{ data: { id: string; slug: string } }>(
    createPost,
    {
      method: "POST",
      path: "/api/v1/blog/posts",
      headers: authHeaders(owner),
      body: {
        title: "Isolation Post",
        slug,
        contentJson: { blocks: [{ type: "paragraph", text: "Hello world" }] },
        contentText: "Hello world"
      }
    }
  );
  expect(created.status).toBe(200);
  const postId = created.body.data.id;

  const published = await invoke(publishPost, {
    method: "POST",
    path: `/api/v1/blog/posts/${postId}/publish`,
    headers: { ...authHeaders(owner), "idempotency-key": crypto.randomUUID() },
    params: { id: postId }
  });
  expect(published.status).toBe(200);
  return postId;
}

suite("website-platform cross-tenant + locale isolation (Issue #273)", () => {
  const previousEnv = { ...process.env };

  beforeAll(async () => {
    await applyMigrations();
    await provisionAppRole();
  }, 60000);

  afterAll(() => {
    process.env = previousEnv;
  });

  beforeEach(async () => {
    await resetDatabase();
    // Test 5 hits the real POST /newsletter/subscribe, which rate-limits on
    // `newsletter:subscribe:${clientIp}` — and the harness `resolveClientIp`
    // returns the fixed "unknown" placeholder, so that bucket is SHARED across
    // every in-process subscribe call in the whole `bun test` run (1-hour fixed
    // window). Reset it here (mirrors the public-security suite) so the asserted
    // 200 can't flake to 429 behind an earlier suite that drove the route.
    resetRateLimitStoreForTests();
    process.env = { ...previousEnv };
    // Host-based public tenant resolution (seo redirect/sitemap/news) only runs
    // in host_default mode; the fixed-tenant service surfaces don't need it.
    process.env.PUBLIC_TENANT_RESOLUTION_MODE = "host_default";
  }, 30000);

  // -----------------------------------------------------------------------
  // 1. blog_content — public routes AND the authenticated admin list API.
  // -----------------------------------------------------------------------
  test("blog_content: tenant A's post never surfaces under tenant B (public), and a tenant-A admin token cannot read tenant-B rows (admin API, RLS FORCE)", async () => {
    // Tenant A is bootstrapped so it has an owner session + a real published
    // post via the admin API. Tenant B is a bare active tenant with a post
    // seeded directly (it needs no session for these assertions).
    const ownerA = await bootstrapTenantWithOwner("iso-tenant-a", "Iso A");
    await createAndPublishPost(ownerA, "tenant-a-secret");

    const tenantB = await seedActiveTenant("iso-tenant-b", "Iso B");
    await seedPost(tenantB.tenantId, { slug: "tenant-b-secret" });

    // PUBLIC positive: A's own post resolves under A's tenant-code routes.
    const detailA = await invokeRaw(publicDetail, {
      method: "GET",
      path: `/blog/${ownerA.tenantCode}/tenant-a-secret`,
      params: { tenantCode: ownerA.tenantCode, slug: "tenant-a-secret" }
    });
    expect(detailA.status).toBe(200);
    expect(detailA.text).toContain("Hello world");

    // PUBLIC negative: A's post is unreachable under B's tenant code — neither
    // by direct detail link nor on B's index.
    const detailUnderB = await invokeRaw(publicDetail, {
      method: "GET",
      path: `/blog/${tenantB.tenantCode}/tenant-a-secret`,
      params: { tenantCode: tenantB.tenantCode, slug: "tenant-a-secret" }
    });
    expect(detailUnderB.status).toBe(404);

    const indexUnderB = await invokeRaw(publicIndex, {
      method: "GET",
      path: `/blog/${tenantB.tenantCode}`,
      params: { tenantCode: tenantB.tenantCode }
    });
    expect(indexUnderB.text).not.toContain("tenant-a-secret");

    // ADMIN negative (RLS FORCE): tenant A's authenticated admin list returns
    // ONLY A's rows — tenant B's directly-seeded post is invisible.
    const adminList = await invoke<{ data: { posts: { slug: string }[] } }>(
      listPosts,
      {
        method: "GET",
        path: "/api/v1/blog/posts",
        headers: authHeaders(ownerA)
      }
    );
    expect(adminList.status).toBe(200);
    const slugs = adminList.body.data.posts.map((p) => p.slug);
    expect(slugs).toContain("tenant-a-secret");
    expect(slugs).not.toContain("tenant-b-secret");

    // Raw RLS FORCE proof: in a tenant-A transaction, B's post row is not even
    // countable — the least-privilege app role cannot see across tenants.
    const bRowsVisibleToA = await withTenant(
      getTestSql(),
      ownerA.tenantId,
      async (tx) => {
        const rows = (await tx`
          SELECT count(*)::int AS count FROM awcms_micro_blog_posts
          WHERE slug = 'tenant-b-secret'
        `) as { count: number }[];
        return rows[0]!.count;
      }
    );
    expect(bRowsVisibleToA).toBe(0);
  }, 30000);

  // -----------------------------------------------------------------------
  // 2. site_search — cross-tenant AND cross-locale scoping.
  // -----------------------------------------------------------------------
  test("site_search: an A-scoped query never returns tenant B's document, and an EN query never returns an ID-locale document", async () => {
    await seedTenant(TENANT_A, "search-a");
    await seedTenant(TENANT_B, "search-b");

    // Same keyword in BOTH tenants — isolation must come from scope, not from
    // the keyword being unique.
    await seedPost(TENANT_A, {
      slug: "a",
      title: "Shared aardvark",
      body: "a"
    });
    await seedPost(TENANT_B, {
      slug: "b",
      title: "Shared aardvark",
      body: "b"
    });
    // A second, ID-locale document in tenant A, to prove locale scoping.
    await seedPost(TENANT_A, {
      slug: "a-id",
      title: "Kucing lucu",
      body: "kucing",
      locale: "id"
    });

    await withTenant(getTestSql(), TENANT_A, (tx) =>
      reconcileTenantSearchIndex(tx, TENANT_A, SEARCH_SOURCES)
    );
    await withTenant(getTestSql(), TENANT_B, (tx) =>
      reconcileTenantSearchIndex(tx, TENANT_B, SEARCH_SOURCES)
    );

    // Cross-tenant: tenant A's search resolves ONLY A's document.
    const aResult = await withTenant(getTestSql(), TENANT_A, (tx) =>
      searchSiteContent(tx, TENANT_A, {
        query: "aardvark",
        locale: "en",
        limit: 20
      })
    );
    expect(aResult.items).toHaveLength(1);
    expect(aResult.items[0]!.url).toBe("/news/a");

    // RLS also blocks a raw cross-tenant read of the index table itself.
    const aIndexRows = await withTenant(getTestSql(), TENANT_A, async (tx) => {
      const rows = (await tx`
        SELECT count(*)::int AS count FROM awcms_micro_site_search_documents
      `) as { count: number }[];
      return rows[0]!.count;
    });
    expect(aIndexRows).toBe(2); // A's EN + ID docs only, never B's.

    // Cross-locale: an EN query never returns the ID-locale document, and the
    // matching ID query does.
    const enForId = await withTenant(getTestSql(), TENANT_A, (tx) =>
      searchSiteContent(tx, TENANT_A, {
        query: "kucing",
        locale: "en",
        limit: 20
      })
    );
    expect(enForId.items).toHaveLength(0);
    const idForId = await withTenant(getTestSql(), TENANT_A, (tx) =>
      searchSiteContent(tx, TENANT_A, {
        query: "kucing",
        locale: "id",
        limit: 20
      })
    );
    expect(idForId.items).toHaveLength(1);
    expect(idForId.items[0]!.url).toBe("/news/a-id");
  }, 30000);

  // -----------------------------------------------------------------------
  // 3. seo_distribution — redirect + sitemap resolve by SERVER-DERIVED host.
  // -----------------------------------------------------------------------
  test("seo_distribution: a redirect rule and sitemap URLs resolve by server-derived host only — A's never appear on B's host", async () => {
    await seedTenant(TENANT_A, "seo-a");
    await seedTenant(TENANT_B, "seo-b");
    await seedPrimaryDomain(TENANT_A, HOST_A);
    await seedPrimaryDomain(TENANT_B, HOST_B);

    // A redirect rule owned by tenant A.
    await getAdminSql()`
      INSERT INTO awcms_micro_seo_redirects
        (tenant_id, source_path, normalized_source_path, target_type, target,
         status_code, state, preserve_query)
      VALUES (${TENANT_A}, '/old', '/old', 'relative_same_tenant', '/new', 301, 'active', false)
    `;

    // On A's host the rule redirects; on B's host the SAME source path is a
    // passthrough (B has no such rule — cross-tenant isolation by host).
    const onHostA = await resolvePublicRedirect(
      getTestSql(),
      hostRequest(HOST_A, "/old"),
      redirectOpts("/old")
    );
    expect(onHostA.kind).toBe("redirect");
    if (onHostA.kind === "redirect") {
      expect(onHostA.status).toBe(301);
      expect(onHostA.location).toBe("/new");
    }

    const onHostB = await resolvePublicRedirect(
      getTestSql(),
      hostRequest(HOST_B, "/old"),
      redirectOpts("/old")
    );
    expect(onHostB.kind).toBe("passthrough");

    // Sitemap child pages are host-resolved too: A's host lists ONLY A's post
    // URL, and never B's — and vice-versa.
    await seedPost(TENANT_A, { slug: "alpha" });
    await seedPost(TENANT_B, { slug: "beta-post" });

    const sitemapA = await invokeRaw(getSitemapPage, {
      method: "GET",
      path: "/sitemap-1.xml",
      headers: { host: HOST_A },
      params: { page: "1" }
    });
    expect(sitemapA.status).toBe(200);
    expect(sitemapA.text).toContain(`https://${HOST_A}/news/alpha`);
    expect(sitemapA.text).not.toContain("beta-post");

    const sitemapB = await invokeRaw(getSitemapPage, {
      method: "GET",
      path: "/sitemap-1.xml",
      headers: { host: HOST_B },
      params: { page: "1" }
    });
    expect(sitemapB.status).toBe(200);
    expect(sitemapB.text).toContain(`https://${HOST_B}/news/beta-post`);
    expect(sitemapB.text).not.toContain("news/alpha");
  }, 30000);

  // -----------------------------------------------------------------------
  // 4. comments public read — tenant B cannot see tenant A's approved comment.
  // -----------------------------------------------------------------------
  test("comments: tenant B cannot see tenant A's approved comment (public read, RLS)", async () => {
    await seedTenant(TENANT_A, "comments-a");
    await seedTenant(TENANT_B, "comments-b");
    const postA = await seedPost(TENANT_A, { slug: "commentable" });

    // Submit + approve one comment under tenant A.
    const commentId = await withTenant(getTestSql(), TENANT_A, async (tx) => {
      const resolved = await resolvePublishedCommentableResource(tx, TENANT_A, {
        resourceType: "blog_post",
        resourceId: postA,
        locale: "en"
      });
      expect(resolved).not.toBeNull();
      const thread = await getOrCreateThread(
        tx,
        TENANT_A,
        resolved!,
        COMMENT_SETTINGS
      );
      const result = await submitComment(
        tx,
        TENANT_A,
        resolved!,
        thread,
        COMMENT_SETTINGS,
        {
          body: "Tenant A only comment",
          parentId: null,
          authorKind: "anonymous",
          authorUserId: null,
          authorDisplayName: "Visitor",
          authorEmail: "visitor@example.com",
          honeypot: "",
          elapsedMs: 10000,
          ipHash: "iphash",
          userAgentHash: "uahash"
        }
      );
      return result.accepted ? result.commentId : null;
    });
    expect(commentId).not.toBeNull();

    await withTenant(getTestSql(), TENANT_A, (tx) =>
      moderateComment(
        tx,
        TENANT_A,
        commentId!,
        "approve",
        { reasonCode: null, actorUserId: MODERATOR, note: null },
        async () => {}
      )
    );

    // Public read under tenant A sees the approved comment.
    const visibleToA = await withTenant(getTestSql(), TENANT_A, async (tx) => {
      const resolved = await resolvePublishedCommentableResource(tx, TENANT_A, {
        resourceType: "blog_post",
        resourceId: postA,
        locale: "en"
      });
      const thread = await getOrCreateThread(
        tx,
        TENANT_A,
        resolved!,
        COMMENT_SETTINGS
      );
      return (await listApprovedComments(tx, TENANT_A, thread.id, {})).items
        .length;
    });
    expect(visibleToA).toBe(1);

    // Under tenant B's context the comment row is invisible (RLS FORCE).
    const visibleToB = await withTenant(getTestSql(), TENANT_B, async (tx) => {
      const rows = (await tx`
        SELECT count(*)::int AS count FROM awcms_micro_comments_comments
      `) as { count: number }[];
      return rows[0]!.count;
    });
    expect(visibleToB).toBe(0);
  }, 30000);

  // -----------------------------------------------------------------------
  // 5. newsletter public subscribe — generic body + cross-tenant RLS.
  // -----------------------------------------------------------------------
  test("newsletter: the public subscribe route always returns the generic body, and a subscriber written under A is invisible under B (RLS FORCE)", async () => {
    await seedTenant(TENANT_A, "news-a");
    await seedTenant(TENANT_B, "news-b");

    // Anti-enumeration: the public subscribe route returns the SAME generic
    // body even when the host resolves to no tenant at all (existence /
    // tenant-membership are never revealed).
    const generic = await invoke<{ data: { status: string } }>(
      newsletterSubscribe,
      {
        method: "POST",
        path: "/api/v1/newsletter/subscribe",
        headers: {
          "content-type": "application/json",
          host: "no-such-host.example"
        },
        body: { email: "someone@example.com" }
      }
    );
    expect(generic.status).toBe(200);
    expect(generic.body.data.status).toBe("accepted");

    // Row isolation: subscribe an address under tenant A via the service, then
    // prove the same address's hash is not visible under tenant B.
    const email = "shared@example.com";
    const parts = deriveSubscriberEmailParts(email);
    await withTenant(getTestSql(), TENANT_A, (tx) =>
      subscribeToNewsletter(tx, TENANT_A, {
        rawEmail: email,
        locale: "en",
        topicIds: null,
        source: "test",
        policyVersion: "v1",
        ipHash: null,
        uaHash: null,
        correlationId: null
      })
    );

    const seenByA = await withTenant(getTestSql(), TENANT_A, async (tx) => {
      const rows = (await tx`
        SELECT count(*)::int AS count FROM awcms_micro_newsletter_subscribers
        WHERE email_hash = ${parts.hash}
      `) as { count: number }[];
      return rows[0]!.count;
    });
    expect(seenByA).toBe(1);

    const seenByB = await withTenant(getTestSql(), TENANT_B, async (tx) => {
      const rows = (await tx`
        SELECT count(*)::int AS count FROM awcms_micro_newsletter_subscribers
        WHERE email_hash = ${parts.hash}
      `) as { count: number }[];
      return rows[0]!.count;
    });
    expect(seenByB).toBe(0);
  }, 30000);
});
