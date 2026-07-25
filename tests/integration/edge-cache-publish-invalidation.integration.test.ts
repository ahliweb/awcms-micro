/**
 * Publishing an article really empties the cache — end to end, through the
 * real route handler, a real PostgreSQL, and a real Varnish (Issue #359,
 * follow-up to #361's post-mortem).
 *
 * This is the seam the original defect lived in and the one nothing else
 * covers. The transport suite (`edge-cache-varnish.integration.test.ts`)
 * proves `purgeEdgeCache()` empties a real cache; the unit suite proves the
 * routes call the wrapper. Neither proves the two are connected: hostname
 * resolution from `awcms_micro_tenant_domains` sits between them, and a
 * tenant whose domains do not resolve invalidates nothing while every
 * component test stays green.
 *
 * On staging this only ever surfaced by publishing a real article and
 * watching the next request. That is exactly what runs below.
 *
 * Needs BOTH a database and Docker; see `varnish-fixture.ts` for how the
 * "cannot run" case is kept loud in CI rather than silently skipped.
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
  integrationEnabled,
  invoke,
  provisionAppRole,
  resetDatabase
} from "./harness";
import {
  dockerAvailable,
  startVarnish,
  type VarnishFixture
} from "./varnish-fixture";

import { resetEdgeCacheConfigForTests } from "../../src/lib/cache/edge-cache-config";
import { POST as setupInitialize } from "../../src/pages/api/v1/setup/initialize";
import { POST as authLogin } from "../../src/pages/api/v1/auth/login";
import { POST as createPost } from "../../src/pages/api/v1/blog/posts/index";
import { POST as publishPost } from "../../src/pages/api/v1/blog/posts/[id]/publish";
import { POST as archivePost } from "../../src/pages/api/v1/blog/posts/[id]/archive";

const PUBLIC_HOST = "publish-invalidation.awcms-micro.test";
const OWNER_LOGIN = "owner@publish-invalidation.test";
const OWNER_PASSWORD = "integration-test-owner-password";

const enabled = integrationEnabled && dockerAvailable;

let varnish: VarnishFixture | undefined;

beforeAll(async () => {
  if (!enabled) {
    return;
  }

  await applyMigrations();
  await provisionAppRole();

  varnish = await startVarnish();

  // The route handlers read the memoized config, so the environment has to
  // be in place before the first read — and reset afterwards so a stale
  // memo from another suite cannot decide this one's behaviour.
  process.env.EDGE_CACHE_ENABLED = "true";
  process.env.EDGE_CACHE_PURGE_URL = varnish.purgeUrl;
  process.env.EDGE_CACHE_PURGE_TOKEN = varnish.purgeToken;
  resetEdgeCacheConfigForTests();
}, 180_000);

afterAll(async () => {
  await varnish?.stop();

  delete process.env.EDGE_CACHE_ENABLED;
  delete process.env.EDGE_CACHE_PURGE_URL;
  delete process.env.EDGE_CACHE_PURGE_TOKEN;
  resetEdgeCacheConfigForTests();
});

beforeEach(async () => {
  if (!enabled) {
    return;
  }

  await resetDatabase();
});

type Bootstrap = { tenantId: string; token: string };

async function bootstrap(tenantCode = "publisher"): Promise<Bootstrap> {
  const setup = await invoke<{ data: { tenantId: string } }>(setupInitialize, {
    method: "POST",
    path: "/api/v1/setup/initialize",
    headers: { "content-type": "application/json" },
    body: {
      tenantName: "Publisher",
      tenantCode,
      officeCode: "hq",
      officeName: "HQ",
      ownerLoginIdentifier: OWNER_LOGIN,
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
    body: { loginIdentifier: OWNER_LOGIN, password: OWNER_PASSWORD },
    cookies: createCookieJar()
  });
  expect(login.status).toBe(200);

  return { tenantId: setup.body.data.tenantId, token: login.body.data.token };
}

function authHeaders(session: Bootstrap): Record<string, string> {
  return {
    "content-type": "application/json",
    "x-awcms-micro-tenant-id": session.tenantId,
    authorization: `Bearer ${session.token}`
  };
}

/**
 * The public hostname the cache keys on. `status = 'active'` is the same
 * condition the public host resolver requires, and the same one
 * `resolveTenantHostnames()` filters by — a hostname that cannot serve the
 * tenant must not be purged for it either.
 */
async function mapPublicHost(
  tenantId: string,
  hostname: string,
  status = "active",
  // Only one row per tenant may be primary; an alias is an ordinary active
  // hostname and must still be invalidated.
  isPrimary = true
): Promise<void> {
  const admin = getAdminSql();

  await admin.begin(async (tx) => {
    await tx.unsafe(`SET LOCAL app.current_tenant_id = '${tenantId}'`);
    await tx`
      INSERT INTO awcms_micro_tenant_domains
        (tenant_id, hostname, normalized_hostname, domain_type, status, is_primary)
      VALUES (${tenantId}, ${hostname}, ${hostname}, 'custom_domain', ${status}, ${isPrimary})
    `;
  });
}

async function createDraft(session: Bootstrap, slug: string): Promise<string> {
  const created = await invoke<{ data: { id: string } }>(createPost, {
    method: "POST",
    path: "/api/v1/blog/posts",
    headers: authHeaders(session),
    body: {
      title: "Edge cache invalidation",
      slug,
      contentJson: { type: "doc", content: [] },
      contentText: "Body.",
      locale: "id",
      visibility: "public"
    }
  });
  expect(created.status).toBe(200);

  return created.body.data.id;
}

/**
 * A neighbouring tenant that owns a public hostname. `POST /setup/initialize`
 * is a once-per-database singleton, so a second tenant is seeded directly —
 * the same constraint (and workaround) the other blog-content integration
 * suites document. It never logs in here: all this test needs is a second
 * cache tenancy that must survive the first tenant's publication.
 */
async function seedNeighbourTenant(): Promise<string> {
  const tenantId = crypto.randomUUID();

  await getAdminSql()`
    INSERT INTO awcms_micro_tenants (id, tenant_code, tenant_name)
    VALUES (${tenantId}, 'neighbour', 'Neighbour')
  `;

  return tenantId;
}

/**
 * A path no other test in this file has used.
 *
 * The database is reset between tests but the CACHE is not — it is one
 * long-lived container, exactly like a deployed one. Sharing a path would
 * let an object stored by an earlier test satisfy a later test's "warm"
 * step, so the later test would assert against state it did not create.
 */
let probeSequence = 0;

function nextProbePath(): string {
  probeSequence += 1;

  return `/cache-probe-${probeSequence}`;
}

/** Fills the cache for a host and asserts it is genuinely serving from it. */
async function warmCache(path: string, host = PUBLIC_HOST): Promise<void> {
  if (!varnish) {
    throw new Error("varnish fixture not started");
  }

  expect((await varnish.fetchThroughCache(host, path)).cache).toBe("MISS");
  expect((await varnish.fetchThroughCache(host, path)).cache).toBe("HIT");
}

function cacheState(path: string, host = PUBLIC_HOST) {
  if (!varnish) {
    throw new Error("varnish fixture not started");
  }

  return varnish.fetchThroughCache(host, path).then((probe) => probe.cache);
}

describe.skipIf(!enabled)("publishing empties the public cache", () => {
  test("a published article makes the next reader miss the cache", async () => {
    const session = await bootstrap();
    await mapPublicHost(session.tenantId, PUBLIC_HOST);

    const postId = await createDraft(session, "edge-cache-publish");
    const path = nextProbePath();

    await warmCache(path);

    const published = await invoke(publishPost, {
      method: "POST",
      path: `/api/v1/blog/posts/${postId}/publish`,
      headers: { ...authHeaders(session), "idempotency-key": `pub-${postId}` },
      params: { id: postId },
      body: {}
    });
    expect(published.status).toBe(200);

    // The whole chain in one assertion: route handler -> hostname lookup
    // under RLS -> purge -> a real cache that really dropped the object.
    expect(await cacheState(path)).toBe("MISS");
    expect(await cacheState(path)).toBe("HIT");
  }, 60_000);

  test("archiving invalidates too — every wired lifecycle transition does", async () => {
    const session = await bootstrap();
    await mapPublicHost(session.tenantId, PUBLIC_HOST);

    const postId = await createDraft(session, "edge-cache-archive");

    await invoke(publishPost, {
      method: "POST",
      path: `/api/v1/blog/posts/${postId}/publish`,
      headers: { ...authHeaders(session), "idempotency-key": `pub-${postId}` },
      params: { id: postId },
      body: {}
    });

    const path = nextProbePath();
    await warmCache(path);

    const archived = await invoke(archivePost, {
      method: "POST",
      path: `/api/v1/blog/posts/${postId}/archive`,
      headers: { ...authHeaders(session), "idempotency-key": `arc-${postId}` },
      params: { id: postId },
      body: {}
    });
    expect(archived.status).toBe(200);

    expect(await cacheState(path)).toBe("MISS");
  }, 60_000);

  test("every active hostname of the tenant is invalidated, not just the primary", async () => {
    const secondHost = "alias.awcms-micro.test";

    const session = await bootstrap();
    await mapPublicHost(session.tenantId, PUBLIC_HOST);
    await mapPublicHost(session.tenantId, secondHost, "active", false);

    const postId = await createDraft(session, "edge-cache-two-hosts");

    const path = nextProbePath();
    await warmCache(path, PUBLIC_HOST);
    await warmCache(path, secondHost);

    await invoke(publishPost, {
      method: "POST",
      path: `/api/v1/blog/posts/${postId}/publish`,
      headers: { ...authHeaders(session), "idempotency-key": `pub-${postId}` },
      params: { id: postId },
      body: {}
    });

    expect(await cacheState(path, PUBLIC_HOST)).toBe("MISS");
    expect(await cacheState(path, secondHost)).toBe("MISS");
  }, 60_000);

  test("a failed publish leaves the cache alone", async () => {
    const session = await bootstrap();
    await mapPublicHost(session.tenantId, PUBLIC_HOST);

    const path = nextProbePath();
    await warmCache(path);

    const missing = "00000000-0000-4000-8000-000000000000";
    const failed = await invoke(publishPost, {
      method: "POST",
      path: `/api/v1/blog/posts/${missing}/publish`,
      headers: { ...authHeaders(session), "idempotency-key": `pub-${missing}` },
      params: { id: missing },
      body: {}
    });
    expect(failed.status).toBeGreaterThanOrEqual(400);

    // Nothing public changed, so flushing would be pure waste — and a cheap
    // way for an unauthorized caller to cost a site its cache.
    expect(await cacheState(path)).toBe("HIT");
  }, 60_000);

  test("a hostname that is not active is never purged for the tenant", async () => {
    const session = await bootstrap();
    await mapPublicHost(session.tenantId, PUBLIC_HOST, "pending_verification");

    const postId = await createDraft(session, "edge-cache-inactive-host");
    const path = nextProbePath();

    await warmCache(path);

    await invoke(publishPost, {
      method: "POST",
      path: `/api/v1/blog/posts/${postId}/publish`,
      headers: { ...authHeaders(session), "idempotency-key": `pub-${postId}` },
      params: { id: postId },
      body: {}
    });

    // The hostname cannot serve this tenant, so purging it would reach
    // across a boundary the resolver deliberately enforces.
    expect(await cacheState(path)).toBe("HIT");
  }, 60_000);

  test("one tenant's publication cannot empty another tenant's cache", async () => {
    const otherHost = "other-tenant.awcms-micro.test";

    const session = await bootstrap();
    await mapPublicHost(session.tenantId, PUBLIC_HOST);

    const neighbourTenantId = await seedNeighbourTenant();
    await mapPublicHost(neighbourTenantId, otherHost);

    const postId = await createDraft(session, "edge-cache-tenant-boundary");

    const path = nextProbePath();
    await warmCache(path, PUBLIC_HOST);
    await warmCache(path, otherHost);

    await invoke(publishPost, {
      method: "POST",
      path: `/api/v1/blog/posts/${postId}/publish`,
      headers: { ...authHeaders(session), "idempotency-key": `pub-${postId}` },
      params: { id: postId },
      body: {}
    });

    expect(await cacheState(path, PUBLIC_HOST)).toBe("MISS");
    expect(await cacheState(path, otherHost)).toBe("HIT");
  }, 60_000);
});
