/**
 * Issue #268 — query-plan evidence that the redirect RESOLVE lookup is
 * index-backed at high rule counts, against a REAL PostgreSQL. Seeds at scale +
 * ANALYZE before EXPLAIN (per the known empty-table Seq-Scan flake:
 * awcms-micro-flaky-ci-tests) so the plan is a real signal.
 *
 * The resolve lookup (`findActiveRedirectByPath`) filters by
 * `(tenant_id, normalized_source_path)` on active, non-deleted rules — served by
 * the partial index `awcms_micro_seo_redirects_resolve_idx`. It MUST be index-
 * served, never a full-table Seq Scan across all tenants' rules.
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

const TENANT = "11111111-2222-3333-4444-666666666666";
const NOISE_TENANT = "99999999-8888-7777-6666-666666666666";

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

suite("Redirect resolve — query-plan evidence (Issue #268)", () => {
  beforeAll(async () => {
    await applyMigrations();
    await provisionAppRole();
    await resetDatabase();

    const sql = getAdminSql();
    await sql`
      INSERT INTO awcms_micro_tenants
        (id, tenant_code, tenant_name, legal_name, status, default_locale, default_theme)
      VALUES
        (${TENANT}, 'rd-tenant', 'RD', 'RD Legal', 'active', 'en', 'light'),
        (${NOISE_TENANT}, 'rd-noise', 'Noise', 'Noise Legal', 'active', 'en', 'light')
    `;

    // 300 rules for the target tenant amid 8000 noise rules so the tenant filter
    // is selective (~3.6%) and the planner prefers the partial resolve index.
    await sql.unsafe(`
      INSERT INTO awcms_micro_seo_redirects
        (tenant_id, source_path, normalized_source_path, target_type, target, status_code, state)
      SELECT '${TENANT}', '/rd-src-' || g, '/rd-src-' || g, 'relative_same_tenant', '/rd-dst-' || g, 301, 'active'
      FROM generate_series(1, 300) g
    `);
    await sql.unsafe(`
      INSERT INTO awcms_micro_seo_redirects
        (tenant_id, source_path, normalized_source_path, target_type, target, status_code, state)
      SELECT '${NOISE_TENANT}', '/noise-src-' || g, '/noise-src-' || g, 'relative_same_tenant', '/noise-dst-' || g, 301, 'active'
      FROM generate_series(1, 8000) g
    `);

    await sql.unsafe("ANALYZE awcms_micro_seo_redirects");
  });

  test("resolve lookup (tenant_id + normalized_source_path equality) is index-served — no Seq Scan", async () => {
    const nodes = await explainNodeTypes(
      `SELECT id, target FROM awcms_micro_seo_redirects
       WHERE tenant_id = '${TENANT}' AND normalized_source_path = '/rd-src-150'
         AND state = 'active' AND deleted_at IS NULL
         AND (effective_from IS NULL OR effective_from <= now())
         AND (effective_until IS NULL OR effective_until > now())
       ORDER BY (domain_scope_host IS NOT NULL) DESC, (locale_scope IS NOT NULL) DESC, created_at ASC
       LIMIT 1`
    );
    expect(nodes.some((n) => n.includes("Index"))).toBe(true);
    expect(nodes).not.toContain("Seq Scan");
  });
});
