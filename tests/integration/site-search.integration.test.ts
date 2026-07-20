import { beforeAll, beforeEach, describe, expect, test } from "bun:test";

import { withTenant } from "../../src/lib/database/tenant-context";
import { getRegisteredSearchSources } from "../../src/lib/search/search-sources";
import {
  reconcileTenantSearchIndex,
  rebuildTenantSearchIndex,
  reindexSearchResource
} from "../../src/modules/site-search/application/search-index-engine";
import {
  searchSiteContent,
  suggestSiteContent
} from "../../src/modules/site-search/application/search-service";
import {
  applyMigrations,
  getAdminSql,
  getTestSql,
  getWorkerTestSql,
  integrationEnabled,
  provisionAppRole,
  provisionWorkerRole,
  resetDatabase
} from "./harness";

const suite = integrationEnabled ? describe : describe.skip;

const TENANT_A = "11111111-1111-1111-1111-111111111111";
const TENANT_B = "22222222-2222-2222-2222-222222222222";
const AUTHOR = "33333333-3333-3333-3333-333333333333";

const SOURCES = getRegisteredSearchSources();

async function seedTenant(id: string, code: string): Promise<void> {
  const admin = getAdminSql();
  await admin`
    INSERT INTO awcms_micro_tenants
      (id, tenant_code, tenant_name, legal_name, status, default_locale, default_theme)
    VALUES (${id}, ${code}, ${code + " Name"}, ${code + " Legal"}, 'active', 'en', 'light')
    ON CONFLICT (id) DO NOTHING
  `;
}

type PostSeed = {
  title: string;
  body: string;
  slug: string;
  status?: string;
  visibility?: string;
  locale?: string;
  publishedAt?: Date | null;
  deletedAt?: Date | null;
};

async function insertPost(tenantId: string, seed: PostSeed): Promise<string> {
  const admin = getAdminSql();
  const id = crypto.randomUUID();
  await admin`
    INSERT INTO awcms_micro_blog_posts
      (id, tenant_id, author_tenant_user_id, title, slug, content_json, content_text,
       status, visibility, locale, published_at, deleted_at, created_at, updated_at)
    VALUES (
      ${id}, ${tenantId}, ${AUTHOR}, ${seed.title}, ${seed.slug}, '{}'::jsonb, ${seed.body},
      ${seed.status ?? "published"}, ${seed.visibility ?? "public"}, ${seed.locale ?? "en"},
      ${seed.publishedAt === undefined ? new Date("2026-01-01T00:00:00Z") : seed.publishedAt},
      ${seed.deletedAt ?? null}, now(), now()
    )
  `;
  return id;
}

async function docCount(tenantId: string): Promise<number> {
  return withTenant(getTestSql(), tenantId, async (tx) => {
    const rows = (await tx`
      SELECT count(*)::int AS count FROM awcms_micro_site_search_documents
    `) as { count: number }[];
    return rows[0]!.count;
  });
}

suite("site_search integration (ADR-0031)", () => {
  beforeAll(async () => {
    await applyMigrations();
    await provisionAppRole();
    await provisionWorkerRole();
  });

  beforeEach(async () => {
    await resetDatabase();
    await seedTenant(TENANT_A, "tenant-a");
    await seedTenant(TENANT_B, "tenant-b");
  });

  test("reconcile indexes ONLY published-public posts (publication filter at source boundary)", async () => {
    await insertPost(TENANT_A, {
      title: "Alpha bright fox",
      body: "the quick brown fox",
      slug: "alpha"
    });
    await insertPost(TENANT_A, {
      title: "Draft hidden",
      body: "secret draft body",
      slug: "draft",
      status: "draft"
    });
    await insertPost(TENANT_A, {
      title: "Private one",
      body: "private body",
      slug: "priv",
      visibility: "private"
    });
    await insertPost(TENANT_A, {
      title: "Deleted one",
      body: "deleted body",
      slug: "del",
      deletedAt: new Date()
    });
    await insertPost(TENANT_A, {
      title: "Future one",
      body: "future body",
      slug: "fut",
      publishedAt: new Date(Date.now() + 86400000)
    });

    await withTenant(getTestSql(), TENANT_A, (tx) =>
      reconcileTenantSearchIndex(tx, TENANT_A, SOURCES)
    );

    expect(await docCount(TENANT_A)).toBe(1);
    const result = await withTenant(getTestSql(), TENANT_A, (tx) =>
      searchSiteContent(tx, TENANT_A, { query: "fox", locale: "en", limit: 20 })
    );
    expect(result.items).toHaveLength(1);
    expect(result.items[0]!.title).toBe("Alpha bright fox");
    expect(result.items[0]!.url).toBe("/news/alpha");
  });

  test("archive/unpublish/delete + reconcile removes with NO stale leakage", async () => {
    const id = await insertPost(TENANT_A, {
      title: "Removable panther",
      body: "panther body",
      slug: "rem"
    });
    await withTenant(getTestSql(), TENANT_A, (tx) =>
      reconcileTenantSearchIndex(tx, TENANT_A, SOURCES)
    );
    expect(await docCount(TENANT_A)).toBe(1);

    // Unpublish it (status -> draft) at the source.
    await getAdminSql()`UPDATE awcms_micro_blog_posts SET status = 'draft', updated_at = now() WHERE id = ${id}`;
    await withTenant(getTestSql(), TENANT_A, (tx) =>
      reconcileTenantSearchIndex(tx, TENANT_A, SOURCES)
    );
    expect(await docCount(TENANT_A)).toBe(0);

    const result = await withTenant(getTestSql(), TENANT_A, (tx) =>
      searchSiteContent(tx, TENANT_A, {
        query: "panther",
        locale: "en",
        limit: 20
      })
    );
    expect(result.items).toHaveLength(0);
  });

  test("reindexSearchResource: publish indexes one; unpublish removes it", async () => {
    const id = await insertPost(TENANT_A, {
      title: "Single lynx",
      body: "lynx body",
      slug: "lynx"
    });
    const first = await withTenant(getTestSql(), TENANT_A, (tx) =>
      reindexSearchResource(tx, TENANT_A, SOURCES[0]!, id)
    );
    expect(first).toBe("indexed");
    expect(await docCount(TENANT_A)).toBe(1);

    await getAdminSql()`UPDATE awcms_micro_blog_posts SET status = 'archived', updated_at = now() WHERE id = ${id}`;
    const second = await withTenant(getTestSql(), TENANT_A, (tx) =>
      reindexSearchResource(tx, TENANT_A, SOURCES[0]!, id)
    );
    expect(second).toBe("removed");
    expect(await docCount(TENANT_A)).toBe(0);
  });

  test("rebuild is idempotent + reconcile matches source counts/checksums", async () => {
    for (let i = 0; i < 5; i += 1) {
      await insertPost(TENANT_A, {
        title: `Post ${i} otter`,
        body: `body ${i}`,
        slug: `p-${i}`
      });
    }
    const r1 = await withTenant(getTestSql(), TENANT_A, (tx) =>
      rebuildTenantSearchIndex(tx, TENANT_A, SOURCES)
    );
    expect(r1.status).toBe("succeeded");
    expect(r1.results[0]!.sourceCount).toBe(5);
    const countAfterFirst = await docCount(TENANT_A);
    expect(countAfterFirst).toBe(5);

    // Rebuild again — end state identical (idempotent).
    const r2 = await withTenant(getTestSql(), TENANT_A, (tx) =>
      rebuildTenantSearchIndex(tx, TENANT_A, SOURCES)
    );
    expect(await docCount(TENANT_A)).toBe(5);

    // Reconcile a THIRD time with no source change — every doc unchanged (checksum skip).
    const r3 = await withTenant(getTestSql(), TENANT_A, (tx) =>
      reconcileTenantSearchIndex(tx, TENANT_A, SOURCES)
    );
    expect(r3.results[0]!.unchanged).toBe(5);
    expect(r3.results[0]!.added).toBe(0);
    expect(r3.results[0]!.updated).toBe(0);
    expect(r3.results[0]!.removed).toBe(0);
  });

  test("cross-tenant isolation: tenant A search never returns tenant B content (RLS + predicate)", async () => {
    await insertPost(TENANT_A, {
      title: "Shared keyword aardvark",
      body: "a body",
      slug: "a"
    });
    await insertPost(TENANT_B, {
      title: "Shared keyword aardvark",
      body: "b body",
      slug: "b"
    });
    await withTenant(getTestSql(), TENANT_A, (tx) =>
      reconcileTenantSearchIndex(tx, TENANT_A, SOURCES)
    );
    await withTenant(getTestSql(), TENANT_B, (tx) =>
      reconcileTenantSearchIndex(tx, TENANT_B, SOURCES)
    );

    const aResult = await withTenant(getTestSql(), TENANT_A, (tx) =>
      searchSiteContent(tx, TENANT_A, {
        query: "aardvark",
        locale: "en",
        limit: 20
      })
    );
    expect(aResult.items).toHaveLength(1);
    expect(aResult.items[0]!.url).toBe("/news/a");

    // RLS also blocks a raw cross-tenant read of the index table.
    const leaked = await withTenant(getTestSql(), TENANT_A, async (tx) => {
      const rows =
        (await tx`SELECT count(*)::int AS c FROM awcms_micro_site_search_documents`) as {
          c: number;
        }[];
      return rows[0]!.c;
    });
    expect(leaked).toBe(1);
  });

  test("cross-locale isolation: an EN query never returns an ID-locale document", async () => {
    await insertPost(TENANT_A, {
      title: "Kucing lucu",
      body: "kucing body",
      slug: "id-cat",
      locale: "id"
    });
    await insertPost(TENANT_A, {
      title: "Funny cat",
      body: "cat body",
      slug: "en-cat",
      locale: "en"
    });
    await withTenant(getTestSql(), TENANT_A, (tx) =>
      reconcileTenantSearchIndex(tx, TENANT_A, SOURCES)
    );

    const enResult = await withTenant(getTestSql(), TENANT_A, (tx) =>
      searchSiteContent(tx, TENANT_A, {
        query: "kucing",
        locale: "en",
        limit: 20
      })
    );
    expect(enResult.items).toHaveLength(0);
    const idResult = await withTenant(getTestSql(), TENANT_A, (tx) =>
      searchSiteContent(tx, TENANT_A, {
        query: "kucing",
        locale: "id",
        limit: 20
      })
    );
    expect(idResult.items).toHaveLength(1);
  });

  test("XSS: a post whose body contains a script tag yields an ESCAPED snippet", async () => {
    await insertPost(TENANT_A, {
      title: "Injection test wolverine",
      body: "hello <script>alert(document.cookie)</script> wolverine world",
      slug: "xss"
    });
    await withTenant(getTestSql(), TENANT_A, (tx) =>
      reconcileTenantSearchIndex(tx, TENANT_A, SOURCES)
    );
    const result = await withTenant(getTestSql(), TENANT_A, (tx) =>
      searchSiteContent(tx, TENANT_A, {
        query: "wolverine",
        locale: "en",
        limit: 20
      })
    );
    expect(result.items).toHaveLength(1);
    const snippet = result.items[0]!.snippet;
    // The served snippet contains NO raw unsafe markup — whether ts_headline's
    // parser stripped the tag tokens or `renderSafeSnippet` escaped them, the
    // ONLY tags that can appear are our own <mark>/</mark>.
    expect(snippet).not.toContain("<script");
    const tags = snippet.match(/<[^>]+>/g) ?? [];
    expect(tags.every((t) => t === "<mark>" || t === "</mark>")).toBe(true);
  });

  test("SQL injection: a malicious query string is safely parameterized (no error, no leak)", async () => {
    await insertPost(TENANT_A, {
      title: "Benign gopher",
      body: "gopher body",
      slug: "g"
    });
    await withTenant(getTestSql(), TENANT_A, (tx) =>
      reconcileTenantSearchIndex(tx, TENANT_A, SOURCES)
    );
    const result = await withTenant(getTestSql(), TENANT_A, (tx) =>
      searchSiteContent(tx, TENANT_A, {
        query: "gopher'; DROP TABLE awcms_micro_site_search_documents; --",
        locale: "en",
        limit: 20
      })
    );
    // The table still exists and the query ran as a bound parameter.
    expect(await docCount(TENANT_A)).toBe(1);
    expect(Array.isArray(result.items)).toBe(true);
  });

  test("suggest returns trigram title matches, tenant-scoped", async () => {
    await insertPost(TENANT_A, {
      title: "Chameleon guide",
      body: "guide body",
      slug: "cham"
    });
    await insertPost(TENANT_B, {
      title: "Chameleon secret",
      body: "secret",
      slug: "cham-b"
    });
    await withTenant(getTestSql(), TENANT_A, (tx) =>
      reconcileTenantSearchIndex(tx, TENANT_A, SOURCES)
    );
    await withTenant(getTestSql(), TENANT_B, (tx) =>
      reconcileTenantSearchIndex(tx, TENANT_B, SOURCES)
    );

    const suggestions = await withTenant(getTestSql(), TENANT_A, (tx) =>
      suggestSiteContent(tx, TENANT_A, {
        query: "chamele",
        locale: "en",
        limit: 8
      })
    );
    expect(suggestions.length).toBeGreaterThanOrEqual(1);
    expect(suggestions.every((s) => s.title.includes("Chameleon"))).toBe(true);
    expect(suggestions.some((s) => s.title === "Chameleon secret")).toBe(false);
  });

  test("admitted-type filter: enabledResourceTypes restricts results (array bind path)", async () => {
    await insertPost(TENANT_A, {
      title: "Typed capybara",
      body: "capybara body",
      slug: "cap"
    });
    await withTenant(getTestSql(), TENANT_A, (tx) =>
      reconcileTenantSearchIndex(tx, TENANT_A, SOURCES)
    );

    const included = await withTenant(getTestSql(), TENANT_A, (tx) =>
      searchSiteContent(tx, TENANT_A, {
        query: "capybara",
        locale: "en",
        enabledResourceTypes: ["blog_post"],
        limit: 20
      })
    );
    expect(included.items).toHaveLength(1);

    const excluded = await withTenant(getTestSql(), TENANT_A, (tx) =>
      searchSiteContent(tx, TENANT_A, {
        query: "capybara",
        locale: "en",
        enabledResourceTypes: ["some_other_type"],
        limit: 20
      })
    );
    expect(excluded.items).toHaveLength(0);
  });

  test("least-privilege worker role can run reconcile (indexing/rebuild)", async () => {
    await insertPost(TENANT_A, {
      title: "Worker meerkat",
      body: "meerkat body",
      slug: "mk"
    });
    const workerSql = getWorkerTestSql();
    const result = await withTenant(workerSql, TENANT_A, (tx) =>
      reconcileTenantSearchIndex(tx, TENANT_A, SOURCES, {
        trigger: "scheduled"
      })
    );
    expect(result.status).toBe("succeeded");
    expect(result.totalIndexed).toBe(1);
    expect(await docCount(TENANT_A)).toBe(1);
  });
});
