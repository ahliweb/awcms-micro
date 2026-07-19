/**
 * Integration tests for public redirect RESOLUTION + RLS + 404 governance
 * (Issue #268) against a real PostgreSQL. These cover the security acceptance
 * criteria: server-derived host resolution, cross-tenant isolation, admin/API
 * exclusion (admin-route hijack), effective dates, chain/loop, the legacy-blog
 * auto-redirect, and privacy-minimized 404 capture.
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
  getAdminSql,
  getTestSql,
  integrationEnabled,
  provisionAppRole,
  resetDatabase
} from "./harness";

import { resolvePublicRedirect } from "../../src/modules/seo-distribution/application/redirect-resolution-service";
import {
  resolvePublicRedirectForRequest,
  recordPublicNotFound
} from "../../src/lib/seo/redirect-middleware";
import { withTenant } from "../../src/lib/database/tenant-context";
import { listNotFoundObservations } from "../../src/modules/seo-distribution/application/not-found-directory";

const TENANT_A = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const TENANT_B = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";
const HOST_A = "acme.example";
const HOST_B = "beta.example";

async function seedTenant(id: string, code: string): Promise<void> {
  await getAdminSql()`
    INSERT INTO awcms_micro_tenants
      (id, tenant_code, tenant_name, legal_name, status, default_locale, default_theme)
    VALUES (${id}, ${code}, ${`${code} Name`}, ${`${code} Legal`}, 'active', 'en', 'light')
  `;
}

async function seedDomain(
  tenantId: string,
  host: string,
  isPrimary: boolean
): Promise<void> {
  await getAdminSql()`
    INSERT INTO awcms_micro_tenant_domains
      (tenant_id, hostname, normalized_hostname, domain_type, status, is_primary)
    VALUES (${tenantId}, ${host}, ${host.toLowerCase()}, 'custom_domain', 'active', ${isPrimary})
  `;
}

type RuleSeed = {
  source: string;
  target: string;
  targetType?: "relative_same_tenant" | "verified_external";
  statusCode?: number;
  state?: string;
  localeScope?: string | null;
  effectiveFrom?: string | null;
  effectiveUntil?: string | null;
  preserveQuery?: boolean;
};

async function seedRule(tenantId: string, r: RuleSeed): Promise<void> {
  await getAdminSql()`
    INSERT INTO awcms_micro_seo_redirects
      (tenant_id, source_path, normalized_source_path, target_type, target, status_code,
       state, locale_scope, effective_from, effective_until, preserve_query)
    VALUES (
      ${tenantId}, ${r.source}, ${r.source},
      ${r.targetType ?? (r.target.startsWith("/") ? "relative_same_tenant" : "verified_external")},
      ${r.target}, ${r.statusCode ?? 301}, ${r.state ?? "active"},
      ${r.localeScope ?? null}, ${r.effectiveFrom ?? null}, ${r.effectiveUntil ?? null},
      ${r.preserveQuery ?? false}
    )
  `;
}

function req(host: string, path: string): Request {
  return new Request(`http://${host}${path}`, { headers: { host } });
}

const OPTS = (pathname: string, search = "", locale: string | null = "en") => ({
  pathname,
  search,
  locale
});

const suite = integrationEnabled ? describe : describe.skip;

suite("Redirect resolution + RLS + 404 governance (Issue #268)", () => {
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

  test("permanent + temporary redirects resolve by server-derived host", async () => {
    await seedRule(TENANT_A, {
      source: "/old",
      target: "/new",
      statusCode: 301
    });
    await seedRule(TENANT_A, {
      source: "/temp",
      target: "/t2",
      statusCode: 302
    });

    const perm = await resolvePublicRedirect(
      getTestSql(),
      req(HOST_A, "/old"),
      OPTS("/old")
    );
    expect(perm.kind).toBe("redirect");
    if (perm.kind === "redirect") {
      expect(perm.status).toBe(301);
      expect(perm.location).toBe("/new");
    }

    const temp = await resolvePublicRedirect(
      getTestSql(),
      req(HOST_A, "/temp"),
      OPTS("/temp")
    );
    expect(temp.kind === "redirect" && temp.status).toBe(302);
  });

  test("inactive, expired, and not-yet-effective rules do NOT redirect", async () => {
    await seedRule(TENANT_A, {
      source: "/inactive",
      target: "/x",
      state: "inactive"
    });
    await seedRule(TENANT_A, {
      source: "/expired",
      target: "/x",
      effectiveUntil: "2020-01-01T00:00:00Z"
    });
    await seedRule(TENANT_A, {
      source: "/future",
      target: "/x",
      effectiveFrom: "2999-01-01T00:00:00Z"
    });

    for (const p of ["/inactive", "/expired", "/future"]) {
      const r = await resolvePublicRedirect(
        getTestSql(),
        req(HOST_A, p),
        OPTS(p)
      );
      expect(r.kind).toBe("passthrough");
    }
  });

  test("chains collapse to the final destination; loops fail closed (no redirect)", async () => {
    await seedRule(TENANT_A, { source: "/a", target: "/b" });
    await seedRule(TENANT_A, { source: "/b", target: "/c" });
    const chain = await resolvePublicRedirect(
      getTestSql(),
      req(HOST_A, "/a"),
      OPTS("/a")
    );
    expect(chain.kind === "redirect" && chain.location).toBe("/c");

    await seedRule(TENANT_A, { source: "/loop1", target: "/loop2" });
    await seedRule(TENANT_A, { source: "/loop2", target: "/loop1" });
    const loop = await resolvePublicRedirect(
      getTestSql(),
      req(HOST_A, "/loop1"),
      OPTS("/loop1")
    );
    expect(loop.kind).toBe("passthrough");
  });

  test("cross-tenant: tenant A's rule never resolves on tenant B's host", async () => {
    await seedRule(TENANT_A, { source: "/only-a", target: "/new" });
    const onB = await resolvePublicRedirect(
      getTestSql(),
      req(HOST_B, "/only-a"),
      OPTS("/only-a")
    );
    expect(onB.kind).toBe("passthrough"); // resolves tenant B, finds no /only-a rule
  });

  test("locale-scoped rule beats an all-locale rule (precedence)", async () => {
    await seedRule(TENANT_A, {
      source: "/p",
      target: "/all-locales",
      localeScope: null
    });
    await seedRule(TENANT_A, {
      source: "/p",
      target: "/id-only",
      localeScope: "id"
    });

    const idReq = await resolvePublicRedirect(
      getTestSql(),
      req(HOST_A, "/p"),
      OPTS("/p", "", "id")
    );
    expect(idReq.kind === "redirect" && idReq.location).toBe("/id-only");

    const enReq = await resolvePublicRedirect(
      getTestSql(),
      req(HOST_A, "/p"),
      OPTS("/p", "", "en")
    );
    expect(enReq.kind === "redirect" && enReq.location).toBe("/all-locales");
  });

  test("query policy: preserved only when the rule opts in", async () => {
    await seedRule(TENANT_A, {
      source: "/drop",
      target: "/d",
      preserveQuery: false
    });
    await seedRule(TENANT_A, {
      source: "/keep",
      target: "/k",
      preserveQuery: true
    });

    const drop = await resolvePublicRedirect(
      getTestSql(),
      req(HOST_A, "/drop?a=1"),
      OPTS("/drop", "?a=1")
    );
    expect(drop.kind === "redirect" && drop.location).toBe("/d");

    const keep = await resolvePublicRedirect(
      getTestSql(),
      req(HOST_A, "/keep?a=1"),
      OPTS("/keep", "?a=1")
    );
    expect(keep.kind === "redirect" && keep.location).toBe("/k?a=1");
  });

  test("verified_external target to a same-tenant host redirects; a removed host fails closed", async () => {
    await seedRule(TENANT_A, {
      source: "/abs",
      target: `https://${HOST_A}/x`,
      targetType: "verified_external"
    });
    const ok = await resolvePublicRedirect(
      getTestSql(),
      req(HOST_A, "/abs"),
      OPTS("/abs")
    );
    expect(ok.kind === "redirect" && ok.location).toBe(`https://${HOST_A}/x`);

    // Rule targeting a host the tenant does not (any longer) own → fail closed.
    await seedRule(TENANT_A, {
      source: "/gone",
      target: "https://not-mine.example/x",
      targetType: "verified_external"
    });
    const gone = await resolvePublicRedirect(
      getTestSql(),
      req(HOST_A, "/gone"),
      OPTS("/gone")
    );
    expect(gone.kind).toBe("passthrough");
  });

  test("admin-route hijack: /api and /admin paths are NEVER redirected, even with a matching rule", async () => {
    // Seed rules whose source is an admin/API path (allowed by the DB shape check).
    await seedRule(TENANT_A, { source: "/api/secret", target: "/evil" });
    await seedRule(TENANT_A, { source: "/admin/x", target: "/evil" });

    const api = await resolvePublicRedirectForRequest(
      req(HOST_A, "/api/secret"),
      new URL(`http://${HOST_A}/api/secret`),
      "en"
    );
    expect(api).toBeNull(); // eligibility gate excludes /api/* before any lookup

    const admin = await resolvePublicRedirectForRequest(
      req(HOST_A, "/admin/x"),
      new URL(`http://${HOST_A}/admin/x`),
      "en"
    );
    expect(admin).toBeNull();

    // A genuine content path DOES resolve through the same lib entrypoint.
    await seedRule(TENANT_A, { source: "/content", target: "/new-content" });
    const content = await resolvePublicRedirectForRequest(
      req(HOST_A, "/content"),
      new URL(`http://${HOST_A}/content`),
      "en"
    );
    expect(content && "redirect" in content).toBe(true);
    if (content && "redirect" in content) {
      expect(content.redirect.status).toBe(301);
      expect(content.redirect.headers.get("location")).toBe("/new-content");
      expect(content.redirect.headers.get("cache-control")).toContain(
        "max-age"
      );
    }
  });

  test("legacy /blog/{tenantCode} → /news redirect fires only when the policy is enabled", async () => {
    // Policy OFF by default → no redirect.
    const off = await resolvePublicRedirect(
      getTestSql(),
      req(HOST_A, "/blog/acme/post"),
      OPTS("/blog/acme/post")
    );
    expect(off.kind).toBe("passthrough");

    // Enable the policy for tenant A.
    await getAdminSql()`
      INSERT INTO awcms_micro_seo_redirect_settings (tenant_id, legacy_blog_redirect_enabled)
      VALUES (${TENANT_A}, true)
    `;
    const on = await resolvePublicRedirect(
      getTestSql(),
      req(HOST_A, "/blog/acme/post"),
      OPTS("/blog/acme/post")
    );
    expect(on.kind).toBe("redirect");
    if (on.kind === "redirect") {
      expect(on.status).toBe(301);
      expect(on.location).toBe(`https://${HOST_A}/news/post`);
    }
  });

  test("404 governance: recordPublicNotFound stores a privacy-minimized aggregate", async () => {
    const capture = {
      tenantId: TENANT_A,
      normalizedPath: "/missing",
      locale: "en",
      domainHost: HOST_A
    };
    // Two requests with a referrer that carries a query — only the bare domain is stored.
    const requestWithRef = new Request(`http://${HOST_A}/missing`, {
      headers: { host: HOST_A, referer: "https://ref.example/page?secret=abc" }
    });
    await recordPublicNotFound(requestWithRef, capture);
    await recordPublicNotFound(requestWithRef, capture);

    const observations = await withTenant(getTestSql(), TENANT_A, (tx) =>
      listNotFoundObservations(tx, TENANT_A)
    );
    expect(observations.length).toBe(1); // aggregate upsert, not two rows
    expect(observations[0]!.normalizedPath).toBe("/missing");
    expect(observations[0]!.hitCount).toBe(2);
    expect(observations[0]!.referrerDomain).toBe("ref.example"); // bare domain, no path/query/secret
  });
});
