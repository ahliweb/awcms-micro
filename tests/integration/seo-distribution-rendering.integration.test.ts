/**
 * Integration tests for the central SEO renderer (Issue #266, ADR-0028) against
 * a real PostgreSQL — the full contribution-contract path:
 *
 *   blog_content `SeoFactsSource` adapter  ->  seo_distribution renderer
 *
 * exercised as the least-privilege app role inside a tenant transaction, so RLS
 * is genuinely enforced. Guards the four things the unit suite structurally
 * cannot: (1) the canonical host is server-derived from `tenant_domain`, never a
 * request header; (2) unpublished content never renders; (3) JSON-LD is escaped
 * end-to-end from a real DB row; (4) tenant A's resource cannot render under
 * tenant B.
 *
 * Skipped unless DATABASE_URL is set (see tests/integration/harness.ts).
 */
import {
  afterEach,
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
  invoke,
  provisionAppRole,
  resetDatabase
} from "./harness";

import { POST as setupInitialize } from "../../src/pages/api/v1/setup/initialize";
import { withTenant } from "../../src/lib/database/tenant-context";
import {
  BLOG_POST_SEO_RESOURCE_TYPE,
  blogContentSeoFactsAdapter
} from "../../src/modules/blog-content/application/seo-facts-port-adapter";
import { mediaLibraryPortAdapter } from "../../src/modules/media-library/application/media-library-port-adapter";
import { renderResourceSeoHead } from "../../src/modules/seo-distribution/application/seo-metadata-service";

const OWNER_LOGIN = "owner@example.com";
const OWNER_PASSWORD = "integration-test-owner-password";

async function bootstrapTenant(
  tenantCode: string,
  tenantName: string
): Promise<string> {
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
  return setup.body.data.tenantId;
}

/** Seed a bare, active tenant row directly (privileged role) — the one-time setup wizard runs only once per reset. */
async function seedBareTenant(
  tenantCode: string,
  tenantName: string
): Promise<string> {
  const id = crypto.randomUUID();
  await getAdminSql()`
    INSERT INTO awcms_micro_tenants (id, tenant_code, tenant_name, status)
    VALUES (${id}, ${tenantCode}, ${tenantName}, 'active')
  `;
  return id;
}

/** Seed a primary, verified domain for a tenant via the privileged role (bypasses RLS). */
async function seedPrimaryDomain(
  tenantId: string,
  host: string
): Promise<void> {
  await getAdminSql()`
    INSERT INTO awcms_micro_tenant_domains
      (tenant_id, hostname, normalized_hostname, domain_type, route_mode, status, is_primary)
    VALUES (${tenantId}, ${host}, ${host}, 'custom_domain', 'canonical', 'active', true)
  `;
}

type SeedPostOptions = {
  slug?: string;
  title?: string;
  status?: string;
  visibility?: string;
  publishedAt?: string | null;
};

/** Seed a blog post directly (privileged role) and return its id. */
async function seedPost(
  tenantId: string,
  options: SeedPostOptions = {}
): Promise<string> {
  const rows = (await getAdminSql()`
    INSERT INTO awcms_micro_blog_posts
      (tenant_id, author_tenant_user_id, title, slug, content_json, content_text,
       status, visibility, locale, published_at)
    VALUES (
      ${tenantId}, ${crypto.randomUUID()}, ${options.title ?? "Hello World"},
      ${options.slug ?? `post-${crypto.randomUUID()}`},
      ${JSON.stringify({ blocks: [] })}::jsonb, 'Hello world body',
      ${options.status ?? "published"}, ${options.visibility ?? "public"}, 'en',
      ${options.publishedAt === undefined ? "2026-01-01T00:00:00.000Z" : options.publishedAt}
    )
    RETURNING id
  `) as { id: string }[];
  return rows[0]!.id;
}

const integrationDescribe = integrationEnabled ? describe : describe.skip;

integrationDescribe("SEO renderer (integration)", () => {
  beforeAll(async () => {
    await applyMigrations();
    await provisionAppRole();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  afterEach(async () => {
    await resetDatabase();
  });

  test("canonical URL uses the tenant's verified primary domain (server-derived, not a request header)", async () => {
    const tenantId = await bootstrapTenant("acme", "Acme");
    await seedPrimaryDomain(tenantId, "brand.example");
    const postId = await seedPost(tenantId, { slug: "launch-day" });

    const result = await withTenant(getTestSql(), tenantId, (tx) =>
      renderResourceSeoHead(tx, {
        tenantId,
        tenantDisplayName: "Acme",
        resourceType: BLOG_POST_SEO_RESOURCE_TYPE,
        resourceId: postId,
        factsSource: blogContentSeoFactsAdapter,
        mediaLibrary: mediaLibraryPortAdapter
      })
    );

    expect(result.renderable).toBe(true);
    if (!result.renderable) return;
    expect(result.primaryHost).toBe("brand.example");
    expect(result.document.canonicalUrl).toBe(
      "https://brand.example/news/launch-day"
    );
    expect(result.headHtml).toContain(
      '<link rel="canonical" href="https://brand.example/news/launch-day" />'
    );
    expect(result.headHtml).toContain(
      '<meta name="robots" content="index,follow" />'
    );
    // The cache key is tenant-first and carries the server-derived host.
    expect(result.cacheKey.startsWith("seo:")).toBe(true);
    expect(result.cacheKey).toContain(encodeURIComponent(tenantId));
    expect(result.cacheKey).toContain("brand.example");
  });

  test("degrades to a relative canonical when the tenant has no primary domain (no invented host)", async () => {
    const tenantId = await bootstrapTenant("nodomain", "No Domain Co");
    const postId = await seedPost(tenantId, { slug: "about" });

    const result = await withTenant(getTestSql(), tenantId, (tx) =>
      renderResourceSeoHead(tx, {
        tenantId,
        tenantDisplayName: "No Domain Co",
        resourceType: BLOG_POST_SEO_RESOURCE_TYPE,
        resourceId: postId,
        factsSource: blogContentSeoFactsAdapter,
        mediaLibrary: null
      })
    );

    expect(result.renderable).toBe(true);
    if (!result.renderable) return;
    expect(result.primaryHost).toBeNull();
    expect(result.document.canonicalUrl).toBe("/news/about");
  });

  test.each([
    ["draft", { status: "draft" }],
    ["archived", { status: "archived" }],
    [
      "private (published+private)",
      { status: "published", visibility: "private" }
    ],
    [
      "future-scheduled published",
      { status: "published", publishedAt: "2999-01-01T00:00:00.000Z" }
    ]
  ])("unpublished content does not render: %s", async (_label, patch) => {
    const tenantId = await bootstrapTenant("acme", "Acme");
    await seedPrimaryDomain(tenantId, "acme.example");
    const postId = await seedPost(tenantId, patch);

    const result = await withTenant(getTestSql(), tenantId, (tx) =>
      renderResourceSeoHead(tx, {
        tenantId,
        tenantDisplayName: "Acme",
        resourceType: BLOG_POST_SEO_RESOURCE_TYPE,
        resourceId: postId,
        factsSource: blogContentSeoFactsAdapter,
        mediaLibrary: null
      })
    );

    expect(result.renderable).toBe(false);
  });

  test("an unlisted post renders but is noindex and carries no structured data", async () => {
    const tenantId = await bootstrapTenant("acme", "Acme");
    await seedPrimaryDomain(tenantId, "acme.example");
    const postId = await seedPost(tenantId, {
      visibility: "unlisted",
      slug: "hidden"
    });

    const result = await withTenant(getTestSql(), tenantId, (tx) =>
      renderResourceSeoHead(tx, {
        tenantId,
        tenantDisplayName: "Acme",
        resourceType: BLOG_POST_SEO_RESOURCE_TYPE,
        resourceId: postId,
        factsSource: blogContentSeoFactsAdapter,
        mediaLibrary: null
      })
    );

    expect(result.renderable).toBe(true);
    if (!result.renderable) return;
    expect(result.document.robots).toBe("noindex,follow");
    expect(result.document.jsonLd).toEqual([]);
    expect(result.headHtml).not.toContain("application/ld+json");
  });

  test("JSON-LD is escaped end-to-end from a real DB row (no raw markup breakout)", async () => {
    const tenantId = await bootstrapTenant("acme", "Acme");
    await seedPrimaryDomain(tenantId, "acme.example");
    const postId = await seedPost(tenantId, {
      title: 'Big <Sale> & "Deals"',
      slug: "sale"
    });

    const result = await withTenant(getTestSql(), tenantId, (tx) =>
      renderResourceSeoHead(tx, {
        tenantId,
        tenantDisplayName: "Acme",
        resourceType: BLOG_POST_SEO_RESOURCE_TYPE,
        resourceId: postId,
        factsSource: blogContentSeoFactsAdapter,
        mediaLibrary: null
      })
    );

    expect(result.renderable).toBe(true);
    if (!result.renderable) return;

    const scriptBodies = result.headHtml
      .split('<script type="application/ld+json">')
      .slice(1)
      .map((chunk) => chunk.split("</script>")[0]!)
      .join("\n");
    expect(scriptBodies).toContain('"@type":"Article"');
    expect(scriptBodies).not.toContain("<Sale>");
    expect(scriptBodies).toContain("\\u003cSale\\u003e");
    expect(scriptBodies).toContain("\\u0026");
  });

  test("tenant A's post cannot be rendered under tenant B (RLS cross-tenant)", async () => {
    const tenantA = await bootstrapTenant("acme", "Acme");
    // A second tenant is seeded directly — the one-time setup wizard runs only
    // once per reset, and this tenant needs only to exist for withTenant/RLS.
    const tenantB = await seedBareTenant("globex", "Globex");
    await seedPrimaryDomain(tenantA, "acme.example");
    await seedPrimaryDomain(tenantB, "globex.example");
    const postA = await seedPost(tenantA, { slug: "secret-a" });

    // Rendering the same post id under tenant B's context resolves NO facts —
    // the adapter's `WHERE tenant_id = B AND id = <A's post>` matches nothing,
    // and RLS FORCE would exclude it even without the explicit filter.
    const underB = await withTenant(getTestSql(), tenantB, (tx) =>
      renderResourceSeoHead(tx, {
        tenantId: tenantB,
        tenantDisplayName: "Globex",
        resourceType: BLOG_POST_SEO_RESOURCE_TYPE,
        resourceId: postA,
        factsSource: blogContentSeoFactsAdapter,
        mediaLibrary: null
      })
    );
    expect(underB.renderable).toBe(false);

    // ...but renders correctly under its own tenant, with tenant A's host.
    const underA = await withTenant(getTestSql(), tenantA, (tx) =>
      renderResourceSeoHead(tx, {
        tenantId: tenantA,
        tenantDisplayName: "Acme",
        resourceType: BLOG_POST_SEO_RESOURCE_TYPE,
        resourceId: postA,
        factsSource: blogContentSeoFactsAdapter,
        mediaLibrary: null
      })
    );
    expect(underA.renderable).toBe(true);
    if (!underA.renderable) return;
    expect(underA.document.canonicalUrl).toBe(
      "https://acme.example/news/secret-a"
    );
  });
});
