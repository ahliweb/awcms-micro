/**
 * Website-platform PUBLIC-SURFACE security integration suite (Issue #273,
 * epic #261). Proves the epic's "public-input controls" + "security-header /
 * anti-enumeration" acceptance criteria as ONE integrated suite over the REAL
 * route handlers (via the harness `invoke`/`invokeRaw`) against a real
 * PostgreSQL, rather than in isolation.
 *
 * This is the INTEGRATION angle that complements the existing UNIT coverage
 * (`tests/security-headers.test.ts` asserts `buildSecurityHeaders`'s array
 * shape; the per-module `*.integration.test.ts` files assert each control from
 * inside its own module). Here every assertion runs end-to-end through a live
 * public handler + real DB so the wiring the unit suite structurally cannot see
 * is exercised: host-derived tenant resolution, the anti-enumeration generic
 * bodies actually emitted by the route, capped-body rejection, and the
 * open-redirect fail-closed path.
 *
 * Controls covered (see the per-`describe` header comments for what each
 * asserts and, where a control is NOT in-process reachable, why it is scoped):
 *   1. Security response headers on a real public route response.
 *   2. Open-redirect rejection in seo_distribution redirect resolution.
 *   3. Host-header poisoning resistance in public tenant resolution.
 *   4. Anti-enumeration generic bodies (newsletter + comments public routes).
 *   5. Oversized / malformed public input rejected with a safe generic error.
 *
 * Skipped entirely unless DATABASE_URL is set — see tests/integration/harness.ts.
 */
import { beforeAll, beforeEach, describe, expect, test } from "bun:test";

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

import { buildSecurityHeaders } from "../../src/lib/security/security-headers";
import { resetRateLimitStoreForTests } from "../../src/lib/security/rate-limit";
import { resolvePublicTenantFromRequest } from "../../src/lib/tenant/public-host-tenant-resolver";
import { resolvePublicRedirect } from "../../src/modules/seo-distribution/application/redirect-resolution-service";

import { POST as setupInitialize } from "../../src/pages/api/v1/setup/initialize";
import { POST as authLogin } from "../../src/pages/api/v1/auth/login";
import { POST as createPost } from "../../src/pages/api/v1/blog/posts/index";
import { POST as publishPost } from "../../src/pages/api/v1/blog/posts/[id]/publish";
import { GET as newsIndex } from "../../src/pages/news/index";
import { POST as newsletterSubscribe } from "../../src/pages/api/v1/newsletter/subscribe";
import {
  GET as commentsList,
  POST as commentsSubmit
} from "../../src/pages/api/v1/comments/index";

const suite = integrationEnabled ? describe : describe.skip;

const OWNER_LOGIN = "owner@example.com";
const OWNER_PASSWORD = "integration-test-owner-password";

// Directly-seeded (no-setup) tenants for the host-resolution / redirect tests.
const TENANT_A = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const TENANT_B = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";
const HOST_A = "acme.example";
const HOST_B = "beta.example";

type Bootstrap = { tenantId: string; tenantCode: string; token: string };

/**
 * Boots one tenant through the real setup wizard + login. The wizard writes the
 * tenant into `awcms_micro_setup_state.tenant_id`, so with NO `PUBLIC_*` env
 * vars set (this file's default — every `beforeEach` clears them) the public
 * host resolver's setup-state fallback (step 4) resolves this exact tenant with
 * no per-test host wiring — the same model
 * `blog-content-public-news.integration.test.ts` documents.
 */
async function bootstrap(tenantCode = "acme"): Promise<Bootstrap> {
  const login = `${tenantCode}-${OWNER_LOGIN}`;
  const setup = await invoke<{ data: { tenantId: string } }>(setupInitialize, {
    method: "POST",
    path: "/api/v1/setup/initialize",
    headers: { "content-type": "application/json" },
    body: {
      tenantName: `Tenant ${tenantCode}`,
      tenantCode,
      officeCode: "hq",
      officeName: "HQ",
      ownerLoginIdentifier: login,
      ownerPassword: OWNER_PASSWORD,
      ownerDisplayName: "Owner"
    }
  });
  expect(setup.status).toBe(200);

  const loggedIn = await invoke<{ data: { token: string } }>(authLogin, {
    method: "POST",
    path: "/api/v1/auth/login",
    headers: {
      "content-type": "application/json",
      "x-awcms-micro-tenant-id": setup.body.data.tenantId
    },
    body: { loginIdentifier: login, password: OWNER_PASSWORD },
    cookies: createCookieJar()
  });
  expect(loggedIn.status).toBe(200);

  return {
    tenantId: setup.body.data.tenantId,
    tenantCode,
    token: loggedIn.body.data.token
  };
}

function authHeaders(b: Bootstrap): Record<string, string> {
  return {
    "content-type": "application/json",
    "x-awcms-micro-tenant-id": b.tenantId,
    authorization: `Bearer ${b.token}`
  };
}

/** Creates + publishes a blog post so it is a genuine PUBLISHED+PUBLIC resource. */
async function createAndPublishPost(
  owner: Bootstrap,
  slug: string
): Promise<string> {
  const created = await invoke<{ data: { id: string } }>(createPost, {
    method: "POST",
    path: "/api/v1/blog/posts",
    headers: authHeaders(owner),
    body: {
      title: "Security Test Post",
      slug,
      contentJson: { blocks: [{ type: "paragraph", text: "Hello world" }] },
      contentText: "Hello world"
    }
  });
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

/**
 * Overrides `process.env` keys for the duration of `fn`, restoring the prior
 * value (or deleting a previously-unset key) afterwards. Public route handlers
 * and resolvers build their `PublicHostResolverConfig` from the live
 * `process.env` (`PUBLIC_TENANT_RESOLUTION_MODE`/`PUBLIC_TRUST_PROXY`), so this
 * is the only way to exercise a non-default resolution mode end-to-end.
 */
async function withEnvOverride<T>(
  overrides: Record<string, string | undefined>,
  fn: () => Promise<T>
): Promise<T> {
  const previous: Record<string, string | undefined> = {};
  for (const key of Object.keys(overrides)) {
    previous[key] = process.env[key];
    const value = overrides[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    return await fn();
  } finally {
    for (const key of Object.keys(overrides)) {
      const value = previous[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

async function seedTenant(id: string, code: string): Promise<void> {
  await getAdminSql()`
    INSERT INTO awcms_micro_tenants
      (id, tenant_code, tenant_name, legal_name, status, default_locale, default_theme)
    VALUES (${id}, ${code}, ${`${code} Name`}, ${`${code} Legal`}, 'active', 'en', 'light')
    ON CONFLICT (id) DO NOTHING
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

async function seedRule(
  tenantId: string,
  source: string,
  target: string,
  targetType: "relative_same_tenant" | "verified_external"
): Promise<void> {
  await getAdminSql()`
    INSERT INTO awcms_micro_seo_redirects
      (tenant_id, source_path, normalized_source_path, target_type, target, status_code,
       state, locale_scope, effective_from, effective_until, preserve_query)
    VALUES (
      ${tenantId}, ${source}, ${source}, ${targetType}, ${target}, 301,
      'active', null, null, null, false
    )
  `;
}

function hostReq(host: string, path = "/"): Request {
  return new Request(`http://${host}${path}`, { headers: { host } });
}

/**
 * Removes the per-request `meta.correlationId` (the ONLY field the platform
 * legitimately varies per request) so two anti-enumeration bodies can be
 * compared for byte-identity. Through the in-process harness the middleware
 * that injects `meta.correlationId` never runs, so it is normally already
 * absent — this normalizer is defense-in-depth so the comparison stays valid
 * even if a handler ever sets it directly.
 */
function stripCorrelationId(text: string): string {
  const parsed = JSON.parse(text) as { meta?: { correlationId?: unknown } };
  if (parsed.meta && "correlationId" in parsed.meta) {
    delete parsed.meta.correlationId;
  }
  return JSON.stringify(parsed);
}

suite("website-platform public-surface security (Issue #273)", () => {
  beforeAll(async () => {
    await applyMigrations();
    // Handlers run as the least-privilege awcms_micro_app role so FORCE'd RLS
    // is actually enforced, exactly as in production.
    await provisionAppRole();
  }, 60000);

  beforeEach(async () => {
    await resetDatabase();
    resetRateLimitStoreForTests();
    // Every anti-enumeration/header test relies on the no-`PUBLIC_*` setup-state
    // fallback; the host-resolution/redirect tests opt into a mode explicitly
    // via withEnvOverride. Clear any stale override defensively.
    delete process.env.PUBLIC_TENANT_RESOLUTION_MODE;
    delete process.env.PUBLIC_DEFAULT_TENANT_ID;
    delete process.env.PUBLIC_DEFAULT_TENANT_CODE;
    delete process.env.PUBLIC_TRUST_PROXY;
  }, 30000);

  // -------------------------------------------------------------------------
  // 1. Security response headers on a real public route response.
  //
  // SCOPING: `src/middleware.ts` is what actually applies these headers to
  // every response (via `applyResponseHeaders` -> `buildSecurityHeaders`), but
  // it imports the `astro:middleware` virtual module, which `bun test` cannot
  // resolve outside Astro's own build/dev pipeline — so the middleware itself
  // is not in-process invokable (its own source comment documents this). This
  // suite therefore asserts the EXACT module the middleware uses
  // (`buildSecurityHeaders`) over a REAL public-route Response object, proving
  // the header set lands cleanly on a live handler's response and coexists with
  // the headers the handler already set — the integration gap the pure-array
  // unit test cannot see. `Content-Security-Policy` is deliberately delegated
  // to Astro's own `security.csp` feature (set only in a real SSR build, and
  // only verifiable via a headless browser), so it is not asserted here.
  // -------------------------------------------------------------------------

  // NOTE: this is a COEXISTENCE / shape check, not a middleware-wiring proof —
  // it applies buildSecurityHeaders() onto the response itself, so it cannot
  // catch a regression where the middleware stops emitting them (middleware is
  // not in-process invokable). Real edge emission is browser/E2E-deferred (#296).
  test("the baseline security headers coexist cleanly on a real public route response (no content-type clobber; CSP delegated to Astro)", async () => {
    const response = await invokeRaw(newsIndex, {
      method: "GET",
      path: "/news"
    });
    // A real public SSR route Response object (200 with a tenant, 404 without —
    // either is a genuine response the middleware would decorate identically).
    const contentTypeBefore = response.response.headers.get("content-type");

    for (const [name, value] of buildSecurityHeaders({ isProduction: false })) {
      response.response.headers.set(name, value);
    }

    expect(response.response.headers.get("X-Content-Type-Options")).toBe(
      "nosniff"
    );
    expect(response.response.headers.get("X-Frame-Options")).toBe("DENY");
    expect(response.response.headers.get("Referrer-Policy")).toBe(
      "strict-origin-when-cross-origin"
    );
    expect(response.response.headers.get("Permissions-Policy")).toBe(
      "geolocation=(), camera=(), microphone=(), payment=()"
    );
    // The handler's own content-type is not clobbered by the security merge.
    expect(response.response.headers.get("content-type")).toBe(
      contentTypeBefore
    );
    // CSP is Astro's own feature, never emitted by buildSecurityHeaders.
    const built = new Map(buildSecurityHeaders({ isProduction: false }));
    expect(built.has("Content-Security-Policy")).toBe(false);
  });

  test("HSTS is gated on production and never emitted outside it", async () => {
    const dev = new Map(buildSecurityHeaders({ isProduction: false }));
    expect(dev.has("Strict-Transport-Security")).toBe(false);

    const prod = new Map(buildSecurityHeaders({ isProduction: true }));
    expect(prod.get("Strict-Transport-Security")).toBe(
      "max-age=31536000; includeSubDomains"
    );
  });

  // -------------------------------------------------------------------------
  // 2. Open-redirect rejection in seo_distribution redirect resolution.
  //
  // The resolve-time control: a stored rule whose target is an absolute URL to
  // a host the tenant does NOT own must FAIL CLOSED (passthrough, no redirect),
  // so a redirect rule can never be turned into an open redirect to an attacker
  // host. A same-tenant relative rule still resolves, proving the gate is not
  // simply refusing every rule.
  // -------------------------------------------------------------------------

  test("an external/unowned absolute redirect target is refused (fail closed)", async () => {
    await seedTenant(TENANT_A, "acme");
    await seedDomain(TENANT_A, HOST_A, true);

    await withEnvOverride(
      { PUBLIC_TENANT_RESOLUTION_MODE: "host_default" },
      async () => {
        // A verified_external target to a host this tenant does not own.
        await seedRule(
          TENANT_A,
          "/go",
          "https://attacker.evil/phish",
          "verified_external"
        );
        const evil = await resolvePublicRedirect(
          getTestSql(),
          hostReq(HOST_A, "/go"),
          { pathname: "/go", search: "", locale: "en" }
        );
        expect(evil.kind).toBe("passthrough");

        // A same-tenant relative rule still resolves — the gate refuses only
        // the unsafe target, not every rule.
        await seedRule(TENANT_A, "/old", "/new", "relative_same_tenant");
        const safe = await resolvePublicRedirect(
          getTestSql(),
          hostReq(HOST_A, "/old"),
          { pathname: "/old", search: "", locale: "en" }
        );
        expect(safe.kind).toBe("redirect");
        if (safe.kind === "redirect") {
          expect(safe.location).toBe("/new");
        }
      }
    );
  });

  // -------------------------------------------------------------------------
  // 3. Host-header poisoning resistance in public tenant resolution.
  //
  // A spoofed `Host` for a host this platform does not serve must NOT resolve
  // any tenant, and a spoofed `X-Forwarded-Host` pointing at a DIFFERENT
  // tenant's real host must be ignored unless the proxy is explicitly trusted —
  // so a poisoned header can never make a request resolve a foreign tenant.
  // -------------------------------------------------------------------------

  test("a spoofed Host for an unserved hostname resolves no tenant", async () => {
    await seedTenant(TENANT_A, "acme");
    await seedDomain(TENANT_A, HOST_A, true);

    await withEnvOverride(
      { PUBLIC_TENANT_RESOLUTION_MODE: "host_default" },
      async () => {
        const real = await resolvePublicTenantFromRequest(
          getTestSql(),
          hostReq(HOST_A),
          { mode: "host_default" }
        );
        expect(real?.tenantId).toBe(TENANT_A);

        // No env/setup-state default is configured (tenants seeded directly),
        // so an unknown/spoofed host falls all the way through to null.
        const spoofed = await resolvePublicTenantFromRequest(
          getTestSql(),
          hostReq("evil.attacker.invalid"),
          { mode: "host_default" }
        );
        expect(spoofed).toBeNull();
      }
    );
  });

  test("a spoofed X-Forwarded-Host cannot cross-resolve another tenant unless the proxy is trusted", async () => {
    await seedTenant(TENANT_A, "acme");
    await seedTenant(TENANT_B, "beta");
    await seedDomain(TENANT_A, HOST_A, true);
    await seedDomain(TENANT_B, HOST_B, true);

    const poisoned = new Request(`http://${HOST_A}/`, {
      headers: { host: HOST_A, "x-forwarded-host": HOST_B }
    });

    await withEnvOverride(
      { PUBLIC_TENANT_RESOLUTION_MODE: "host_default" },
      async () => {
        // Default (proxy NOT trusted): the forwarded header is ignored, the
        // real Host (tenant A) wins — never tenant B.
        const untrusted = await resolvePublicTenantFromRequest(
          getTestSql(),
          poisoned,
          { mode: "host_default" }
        );
        expect(untrusted?.tenantId).toBe(TENANT_A);

        // Only an explicitly-trusted proxy honors X-Forwarded-Host — proving
        // the untrusted default above is a real gate, not just a no-op.
        const trusted = await resolvePublicTenantFromRequest(
          getTestSql(),
          poisoned,
          { mode: "host_default", trustProxy: true }
        );
        expect(trusted?.tenantId).toBe(TENANT_B);
      }
    );
  });

  // -------------------------------------------------------------------------
  // 4. Anti-enumeration generic bodies (newsletter + comments public routes).
  //
  // Over the REAL public route handlers: an address/resource that genuinely
  // exists and one never seen before must return byte-identical bodies (modulo
  // the per-request meta.correlationId, normalized away), so the public surface
  // is never an existence oracle.
  // -------------------------------------------------------------------------

  test("newsletter subscribe returns a byte-identical generic body for an existing vs a never-seen address", async () => {
    await bootstrap();

    // Premise: newsletter is ENABLED for the freshly-bootstrapped tenant
    // (fetchTenantModuleEntry returns `tenantEnabled: row?.enabled ?? true`, so a
    // tenant with no module row defaults ON). If a future change made newsletter
    // default-OFF, both arms would collapse to the same constant generic body and
    // this test would pass while proving nothing — the byte-identity below is
    // only meaningful because the first call genuinely registers the address.
    // First call registers the address (now genuinely exists / pending).
    const first = await invokeRaw(newsletterSubscribe, {
      method: "POST",
      path: "/api/v1/newsletter/subscribe",
      headers: { "content-type": "application/json" },
      body: { email: "known@example.com" }
    });
    expect(first.status).toBe(200);

    // Second call for the SAME (now-existing) address.
    const existing = await invokeRaw(newsletterSubscribe, {
      method: "POST",
      path: "/api/v1/newsletter/subscribe",
      headers: { "content-type": "application/json" },
      body: { email: "known@example.com" }
    });

    // A fresh address that has never been seen.
    const neverSeen = await invokeRaw(newsletterSubscribe, {
      method: "POST",
      path: "/api/v1/newsletter/subscribe",
      headers: { "content-type": "application/json" },
      body: { email: "never-seen@example.com" }
    });

    expect(existing.status).toBe(200);
    expect(neverSeen.status).toBe(200);
    // The generic acknowledgement carries no per-address state.
    expect(JSON.parse(existing.text)).toEqual({
      success: true,
      data: { status: "accepted" },
      meta: {}
    });
    // Existing vs never-seen are indistinguishable byte-for-byte.
    expect(stripCorrelationId(existing.text)).toBe(
      stripCorrelationId(neverSeen.text)
    );
  }, 30000);

  test("comments submit returns the same neutral body whether the resource exists (held for moderation) or does not", async () => {
    const owner = await bootstrap();
    const postId = await createAndPublishPost(owner, "commentable-post");

    // Submit to a real PUBLISHED+PUBLIC resource. Default policy is
    // moderation-first, so the comment is HELD (not publicly visible) and the
    // route returns its neutral acknowledgement — never revealing acceptance.
    const held = await invokeRaw(commentsSubmit, {
      method: "POST",
      path: "/api/v1/comments",
      headers: {
        "content-type": "application/json",
        "idempotency-key": crypto.randomUUID()
      },
      body: {
        resourceType: "blog_post",
        resourceId: postId,
        locale: "en",
        body: "A perfectly ordinary held comment.",
        authorDisplayName: "Visitor",
        authorEmail: "visitor@example.com"
      }
    });
    expect(held.status).toBe(200);

    // Submit to a resource that does not exist at all — the unresolved path.
    const unresolved = await invokeRaw(commentsSubmit, {
      method: "POST",
      path: "/api/v1/comments",
      headers: {
        "content-type": "application/json",
        "idempotency-key": crypto.randomUUID()
      },
      body: {
        resourceType: "blog_post",
        resourceId: crypto.randomUUID(),
        locale: "en",
        body: "A comment on a resource that does not exist.",
        authorDisplayName: "Visitor",
        authorEmail: "visitor@example.com"
      }
    });
    expect(unresolved.status).toBe(200);

    // Held-for-moderation is byte-identical to resource-does-not-exist: no
    // oracle for whether the resource (or the accepted comment) exists.
    expect(stripCorrelationId(held.text)).toBe(
      stripCorrelationId(unresolved.text)
    );
  }, 30000);

  test("comments list returns a byte-identical neutral body for two never-seen resources", async () => {
    await bootstrap();

    const a = await invokeRaw(commentsList, {
      method: "GET",
      path: `/api/v1/comments?resourceType=blog_post&resourceId=${crypto.randomUUID()}&locale=en`
    });
    const b = await invokeRaw(commentsList, {
      method: "GET",
      path: `/api/v1/comments?resourceType=blog_post&resourceId=${crypto.randomUUID()}&locale=en`
    });

    expect(a.status).toBe(200);
    expect(b.status).toBe(200);
    expect(stripCorrelationId(a.text)).toBe(stripCorrelationId(b.text));
  }, 30000);

  // -------------------------------------------------------------------------
  // 5. Oversized / malformed public input rejected with a safe generic error.
  //
  // A body over the shared cap is rejected with a generic 413 (no stream fully
  // buffered), and a malformed/invalid body with a generic 400 — neither leaks
  // a stack trace, a file path, or the offending input back to the caller.
  // -------------------------------------------------------------------------

  test("an oversized public body is rejected with a generic 413 (no PII/stack leak)", async () => {
    await bootstrap();

    // ~200 KiB payload, above the shared default 128 KiB reader cap.
    const oversized = await invoke<{
      success: boolean;
      error: { code: string; message: string; stack?: unknown };
    }>(newsletterSubscribe, {
      method: "POST",
      path: "/api/v1/newsletter/subscribe",
      headers: { "content-type": "application/json" },
      body: { email: "x@example.com", filler: "a".repeat(200 * 1024) }
    });

    expect(oversized.status).toBe(413);
    expect(oversized.body.error.code).toBe("PAYLOAD_TOO_LARGE");
    // Generic size message only — no echoed input, no stack.
    expect(oversized.body.error.message.toLowerCase()).toContain("size");
    expect(oversized.body.error).not.toHaveProperty("stack");
    // Desync-safe: the oversized-body response asks the client to close.
    expect(oversized.response.headers.get("connection")).toBe("close");
    // The 200 KiB filler must never be reflected back to the caller.
    expect(JSON.stringify(oversized.body)).not.toContain("aaaa");
  }, 30000);

  test("a malformed / invalid public body is rejected with a generic 400 (no PII/stack leak)", async () => {
    await bootstrap();

    // A JSON array (not an object) — the handler's isRecord guard rejects it.
    const notAnObject = await invoke<{
      error: { code: string; message: string };
    }>(newsletterSubscribe, {
      method: "POST",
      path: "/api/v1/newsletter/subscribe",
      headers: { "content-type": "application/json" },
      body: [1, 2, 3]
    });
    expect(notAnObject.status).toBe(400);
    expect(notAnObject.body.error.code).toBe("VALIDATION_ERROR");
    expect(notAnObject.body.error).not.toHaveProperty("stack");

    // A well-formed object with an invalid email — the same generic 400, and
    // the offending value is never echoed back.
    const badEmail = await invoke<{ error: { code: string; message: string } }>(
      newsletterSubscribe,
      {
        method: "POST",
        path: "/api/v1/newsletter/subscribe",
        headers: { "content-type": "application/json" },
        body: { email: "definitely-not-an-email-oracle-probe" }
      }
    );
    expect(badEmail.status).toBe(400);
    expect(badEmail.body.error.code).toBe("VALIDATION_ERROR");
    expect(JSON.stringify(badEmail.body)).not.toContain(
      "definitely-not-an-email-oracle-probe"
    );
  }, 30000);
});
