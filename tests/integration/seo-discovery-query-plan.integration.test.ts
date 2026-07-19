/**
 * Issue #267 — query-plan evidence that the discovery aggregation is bounded and
 * index-backed at scale, against a REAL PostgreSQL. Seeds at scale + ANALYZE
 * BEFORE each EXPLAIN (per the known empty-table Seq-Scan flake:
 * awcms-micro-flaky-ci-tests) so the plans are a real signal, not a stats
 * artifact.
 *
 * The two paginated queries the routes rely on MUST be index-ordered (no full
 * table scan / no full sort of the whole set):
 * - the feed query (`ORDER BY published_at DESC LIMIT n`) is served by
 *   `awcms_micro_blog_posts_tenant_status_published_idx`;
 * - the sitemap listing (`ORDER BY id ASC LIMIT n OFFSET m`) is served by the
 *   primary key.
 * The summary aggregate is a single bounded pass over the tenant's published set
 * and uses an index when the tenant filter is selective.
 */
import { beforeAll, describe, expect, test } from "bun:test";

import {
  applyMigrations,
  getAdminSql,
  integrationEnabled,
  provisionAppRole,
  resetDatabase
} from "./harness";

const suite = integrationEnabled ? describe : describe.skip;

const TENANT = "11111111-2222-3333-4444-555555555555";
const NOISE_TENANT = "99999999-8888-7777-6666-555555555555";
const AUTHOR = "12121212-3434-5656-7878-909090909090";

const PREDICATE =
  "status = 'published' AND visibility = 'public' AND deleted_at IS NULL " +
  "AND published_at IS NOT NULL AND published_at <= now()";

function collectNodeTypes(plan: unknown, out: string[]): void {
  if (Array.isArray(plan)) {
    for (const item of plan) collectNodeTypes(item, out);
    return;
  }
  if (plan && typeof plan === "object") {
    const node = plan as Record<string, unknown>;
    if (typeof node["Node Type"] === "string") out.push(node["Node Type"]);
    for (const value of Object.values(node)) collectNodeTypes(value, out);
  }
}

async function explainNodeTypes(query: string): Promise<string[]> {
  const rows = (await getAdminSql().unsafe(
    `EXPLAIN (FORMAT JSON) ${query}`
  )) as { "QUERY PLAN": unknown }[];
  const out: string[] = [];
  collectNodeTypes(rows[0]!["QUERY PLAN"], out);
  return out;
}

suite("SEO discovery — query-plan evidence (Issue #267)", () => {
  beforeAll(async () => {
    await applyMigrations();
    await provisionAppRole();
    await resetDatabase();

    const sql = getAdminSql();
    await sql`
      INSERT INTO awcms_micro_tenants
        (id, tenant_code, tenant_name, legal_name, status, default_locale, default_theme)
      VALUES
        (${TENANT}, 'qp-tenant', 'QP', 'QP Legal', 'active', 'en', 'light'),
        (${NOISE_TENANT}, 'qp-noise', 'Noise', 'Noise Legal', 'active', 'en', 'light')
    `;

    // Selective target tenant (300 rows) amid a large noise tenant (8000 rows)
    // so the tenant_id filter is genuinely selective (~3.6%) and the planner
    // prefers the index over a full scan.
    await sql.unsafe(`
      INSERT INTO awcms_micro_blog_posts
        (tenant_id, author_tenant_user_id, title, slug, content_json, content_text,
         status, visibility, locale, published_at, updated_at)
      SELECT '${TENANT}', '${AUTHOR}', 'Post ' || g, 'qp-post-' || g, '{}'::jsonb, 'body',
        'published', 'public', 'en',
        now() - (g || ' minutes')::interval, now() - (g || ' minutes')::interval
      FROM generate_series(1, 300) g
    `);
    await sql.unsafe(`
      INSERT INTO awcms_micro_blog_posts
        (tenant_id, author_tenant_user_id, title, slug, content_json, content_text,
         status, visibility, locale, published_at, updated_at)
      SELECT '${NOISE_TENANT}', '${AUTHOR}', 'Noise ' || g, 'noise-' || g, '{}'::jsonb, 'body',
        'published', 'public', 'en',
        now() - (g || ' minutes')::interval, now() - (g || ' minutes')::interval
      FROM generate_series(1, 8000) g
    `);

    await sql.unsafe("ANALYZE awcms_micro_blog_posts");
  });

  test("feed query (ORDER BY published_at DESC LIMIT) is index-served — no Seq Scan", async () => {
    const nodes = await explainNodeTypes(
      `SELECT id FROM awcms_micro_blog_posts
       WHERE tenant_id = '${TENANT}' AND ${PREDICATE}
       ORDER BY published_at DESC, id DESC LIMIT 50`
    );
    expect(nodes.some((n) => n.includes("Index"))).toBe(true);
    expect(nodes).not.toContain("Seq Scan");
  });

  test("sitemap listing (ORDER BY id ASC LIMIT, shallow page) is index-backed — no cross-tenant Seq Scan", async () => {
    const nodes = await explainNodeTypes(
      `SELECT id FROM awcms_micro_blog_posts
       WHERE tenant_id = '${TENANT}' AND ${PREDICATE}
       ORDER BY id ASC LIMIT 100 OFFSET 0`
    );
    // This asserts only what OFFSET 0 can prove: the FIRST page is reached by an
    // index on the tenant's published set (Bitmap/Index Scan), not a full-table
    // Seq Scan across all tenants. It does NOT prove deep-page behavior — a large
    // OFFSET still walks and discards the skipped rows, so "bounded work per
    // request" holds for shallow pages here; deep OFFSET paging (and the keyset
    // cursor that would bound it) is a documented scale follow-up
    // (`src/modules/seo-distribution/README.md`), not something this plan asserts.
    expect(nodes.some((n) => n.includes("Index"))).toBe(true);
    expect(nodes).not.toContain("Seq Scan");
  });

  test("summary aggregate (count + max) is index-backed for the selective tenant", async () => {
    const nodes = await explainNodeTypes(
      `SELECT count(*), max(updated_at), max(published_at)
       FROM awcms_micro_blog_posts
       WHERE tenant_id = '${TENANT}' AND ${PREDICATE}`
    );
    expect(nodes.some((n) => n.includes("Index"))).toBe(true);
  });
});
