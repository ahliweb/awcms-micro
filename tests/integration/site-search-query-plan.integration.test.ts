import { beforeAll, describe, expect, test } from "bun:test";

import {
  applyMigrations,
  getAdminSql,
  integrationEnabled,
  provisionAppRole,
  resetDatabase
} from "./harness";

/**
 * Query-plan budget for `site_search` (Issue #270, ADR-0031). Mirrors
 * `seo-discovery-query-plan.integration.test.ts`: seeds a large fixture (300
 * selective target rows amid 8000 noise rows) and ANALYZEs IMMEDIATELY before
 * EXPLAIN, so the known empty-table `Seq Scan` flake ([[awcms-micro-flaky-ci-tests]])
 * cannot occur. Asserts the FTS search path uses the GIN index and the trigram
 * suggestion path uses the `gin_trgm_ops` index — never a `Seq Scan`.
 *
 * EXPLAIN runs on `getAdminSql()` (superuser bypasses RLS) with a literal
 * tenant_id, so the planner sees the seeded rows (an RLS-empty view would
 * trivially yield a Seq Scan).
 */
const suite = integrationEnabled ? describe : describe.skip;

const TENANT = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";

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

suite("site_search query-plan budgets (Issue #270)", () => {
  beforeAll(async () => {
    await applyMigrations();
    await provisionAppRole();
    await resetDatabase();
    const sql = getAdminSql();
    await sql`
      INSERT INTO awcms_micro_tenants
        (id, tenant_code, tenant_name, legal_name, status, default_locale, default_theme)
      VALUES (${TENANT}, 'qp-search', 'QP', 'QP', 'active', 'en', 'light')
      ON CONFLICT (id) DO NOTHING
    `;
    // 250 selective target docs (unique term `zzqptarget`) amid 20000 noise docs.
    // Bodies are padded to ~1.5 KB (representative of real posts) so the table
    // spans many heap pages and a Seq Scan is genuinely expensive — the planner
    // then prefers the GIN / trigram index, which is exactly the "representative
    // tenant" scale the budget is about (issue #270 acceptance criterion).
    await sql.unsafe(`
      INSERT INTO awcms_micro_site_search_documents
        (tenant_id, source_key, resource_type, resource_id, locale, url, title,
         summary, body_text, source_updated_at, source_checksum)
      SELECT '${TENANT}', 'blog_content.post', 'blog_post', 'target-' || g, 'en',
        '/news/target-' || g, 'Zzqptarget headline ' || g, 'summary text',
        repeat('filler prose paragraph ', 60) || ' zzqptarget keyword ' || g,
        now(), md5(g::text)
      FROM generate_series(1, 250) g
    `);
    await sql.unsafe(`
      INSERT INTO awcms_micro_site_search_documents
        (tenant_id, source_key, resource_type, resource_id, locale, url, title,
         summary, body_text, source_updated_at, source_checksum)
      SELECT '${TENANT}', 'blog_content.post', 'blog_post', 'noise-' || g, 'en',
        '/news/noise-' || g, 'Common noise headline ' || g, 'summary text',
        repeat('ordinary lorem ipsum body ', 60) || ' ' || g,
        now(), md5(('n' || g))
      FROM generate_series(1, 20000) g
    `);
    await sql.unsafe("ANALYZE awcms_micro_site_search_documents");
    // Seeding 20,250 padded documents + migrations + ANALYZE is a heavy one-time
    // setup that exceeds Bun's default 5000ms hook ceiling under CI load; give
    // it explicit headroom so the representative-scale budget can run.
  }, 60000);

  test("FTS search is GIN-index-backed (no Seq Scan)", async () => {
    const nodes = await explainNodeTypes(`
      SELECT resource_id, url, title,
        ts_rank(search_vector, websearch_to_tsquery('simple', 'zzqptarget')) AS rank
      FROM awcms_micro_site_search_documents
      WHERE tenant_id = '${TENANT}'
        AND locale = 'en'
        AND search_vector @@ websearch_to_tsquery('simple', 'zzqptarget')
      ORDER BY rank DESC
      LIMIT 20
    `);
    expect(nodes.some((n) => n.includes("Index"))).toBe(true);
    expect(nodes).not.toContain("Seq Scan");
  });

  test("trigram suggestion is index-backed (no Seq Scan)", async () => {
    const nodes = await explainNodeTypes(`
      SELECT resource_id, url, title
      FROM awcms_micro_site_search_documents
      WHERE tenant_id = '${TENANT}'
        AND locale = 'en'
        AND title ILIKE '%zzqptarget%'
      ORDER BY similarity(title, 'zzqptarget') DESC, title ASC
      LIMIT 8
    `);
    expect(nodes.some((n) => n.includes("Index") || n.includes("Bitmap"))).toBe(
      true
    );
    expect(nodes).not.toContain("Seq Scan");
  });
});
