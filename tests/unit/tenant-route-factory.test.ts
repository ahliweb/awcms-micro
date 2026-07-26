import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test
} from "bun:test";
import type { APIContext, APIRoute, AstroCookies } from "astro";

import {
  getDatabaseCircuitBreaker,
  resetDatabaseCircuitBreakerForTests
} from "../../src/lib/database/circuit-breaker";
import { resetWorkClassGatesForTests } from "../../src/lib/database/work-class";
import { ok } from "../../src/modules/_shared/api-response";
import { defineTenantRoute } from "../../src/modules/_shared/tenant-route";

const TENANT_ID = "11111111-1111-1111-1111-111111111111";

const GUARD = {
  moduleKey: "data_lifecycle",
  activityCode: "registry",
  action: "read"
} as const;

/** `resolveAuthInputs` only ever reads `cookies.get(name)?.value`. */
const EMPTY_COOKIES = {
  get: () => undefined
} as unknown as AstroCookies;

async function call(
  route: APIRoute,
  headers: Record<string, string> = {}
): Promise<{
  status: number;
  body: { error?: { code: string } };
  response: Response;
}> {
  const url = new URL("http://unit.test/api/v1/example?runType=archive");
  const context = {
    request: new Request(url.toString(), { method: "GET", headers }),
    url,
    params: {},
    locals: {},
    cookies: EMPTY_COOKIES
  } as unknown as APIContext;

  const response = (await route(context)) as Response;
  const text = await response.text();

  return {
    status: response.status,
    body: text.length > 0 ? JSON.parse(text) : {},
    response
  };
}

function authHeaders(): Record<string, string> {
  return {
    "x-awcms-micro-tenant-id": TENANT_ID,
    authorization: "Bearer unit-test-session-token"
  };
}

/**
 * The factory calls `getDatabaseClient()` before `withTenant`, and that
 * throws without a connection string. Every assertion below stops at or
 * before the pool gate (an OPEN circuit breaker short-circuits inside
 * `withTenant` before `sql.begin`), so no connection is ever opened — but
 * the env var still has to exist. Only set when absent: a run WITH a real
 * `DATABASE_URL` (the integration configuration) must keep using it,
 * because `getNamedDatabaseClient` memoizes the client per process.
 */
const HAD_DATABASE_URL = Boolean(process.env.DATABASE_URL);

describe("defineTenantRoute (Issue #370)", () => {
  beforeAll(() => {
    if (!HAD_DATABASE_URL) {
      process.env.DATABASE_URL =
        "postgres://awcms_micro_unit_test@127.0.0.1:1/unused";
    }
  });

  afterAll(() => {
    if (!HAD_DATABASE_URL) {
      delete process.env.DATABASE_URL;
    }
    resetDatabaseCircuitBreakerForTests();
    resetWorkClassGatesForTests();
  });

  beforeEach(() => {
    resetDatabaseCircuitBreakerForTests();
    resetWorkClassGatesForTests();
  });

  test("no tenant id -> 400 TENANT_REQUIRED, handler never runs", async () => {
    let handlerRan = false;

    const route = defineTenantRoute({
      workClass: "interactive",
      authorize: GUARD,
      handler: () => {
        handlerRan = true;
        return ok({});
      }
    });

    const result = await call(route, {
      authorization: "Bearer unit-test-session-token"
    });

    expect(result.status).toBe(400);
    expect(result.body.error?.code).toBe("TENANT_REQUIRED");
    expect(handlerRan).toBe(false);
  });

  test("tenant id but no token -> 401 AUTH_REQUIRED", async () => {
    const route = defineTenantRoute({
      workClass: "interactive",
      authorize: GUARD,
      handler: () => ok({})
    });

    const result = await call(route, {
      "x-awcms-micro-tenant-id": TENANT_ID
    });

    expect(result.status).toBe(401);
    expect(result.body.error?.code).toBe("AUTH_REQUIRED");
  });

  test("prepare may short-circuit with a Response, before any database work", async () => {
    let handlerRan = false;
    let authorizeRan = false;

    const route = defineTenantRoute({
      workClass: "interactive",
      authorize: () => {
        authorizeRan = true;
        return GUARD;
      },
      prepare: () =>
        new Response(
          JSON.stringify({
            success: false,
            error: { code: "VALIDATION_ERROR" }
          }),
          { status: 400 }
        ),
      handler: () => {
        handlerRan = true;
        return ok({});
      }
    });

    const result = await call(route, authHeaders());

    expect(result.status).toBe(400);
    expect(result.body.error?.code).toBe("VALIDATION_ERROR");
    expect(authorizeRan).toBe(false);
    expect(handlerRan).toBe(false);
  });

  test("prepare runs after the auth-input guards — a malformed body cannot preempt 401", async () => {
    let prepareRan = false;

    const route = defineTenantRoute({
      workClass: "interactive",
      authorize: GUARD,
      prepare: () => {
        prepareRan = true;
        return { value: 1 };
      },
      handler: () => ok({})
    });

    const result = await call(route, {
      "x-awcms-micro-tenant-id": TENANT_ID
    });

    expect(result.status).toBe(401);
    expect(prepareRan).toBe(false);
  });

  test("what prepare returns reaches the authorize callback, and the request context comes with it", async () => {
    const seen: {
      value: { prepared: { runType: string | null }; tenantId: string } | null;
    } = { value: null };

    const route = defineTenantRoute({
      workClass: "reporting",
      // `prepare` FIRST — see `tenant-route.ts`'s note on inference order
      // when `authorize` is given in its callback form.
      prepare: ({ url }) => ({ runType: url.searchParams.get("runType") }),
      authorize: (context) => {
        seen.value = { prepared: context.prepared, tenantId: context.tenantId };
        return GUARD;
      },
      handler: () => ok({})
    });

    // Breaker open -> `withTenant` never reaches `sql.begin`, so this stops
    // at the pool gate with no connection, AFTER `authorize` has run.
    const breaker = getDatabaseCircuitBreaker();
    for (let attempt = 0; attempt < 20; attempt++) {
      breaker.recordFailure(new Date());
    }

    await call(route, authHeaders());

    expect(seen.value).toEqual({
      prepared: { runType: "archive" },
      tenantId: TENANT_ID
    });
  });

  /**
   * The #323 invariant. A route built by this factory is a `Response`
   * caller, so an unavailable pool must come back as a real 503 with
   * `Retry-After` — never as a thrown `DatabaseUnavailableError` escaping
   * into Astro's error handler (which would turn a controlled 503 into a
   * 500), and never as a non-Response value masquerading as data.
   */
  test("pool unavailable -> 503 DATABASE_BUSY Response with Retry-After, not a throw", async () => {
    const route = defineTenantRoute({
      workClass: "interactive",
      authorize: GUARD,
      handler: () => ok({})
    });

    const breaker = getDatabaseCircuitBreaker();
    for (let attempt = 0; attempt < 20; attempt++) {
      breaker.recordFailure(new Date());
    }

    const result = await call(route, authHeaders());

    expect(result.response).toBeInstanceOf(Response);
    expect(result.status).toBe(503);
    expect(result.body.error?.code).toBe("DATABASE_BUSY");
    expect(result.response.headers.get("retry-after")).toBe("30");
  });

  test("workClass is REQUIRED — omitting it is a compile error, not an implicit interactive", () => {
    // @ts-expect-error — `workClass` has no default; this is the whole point
    // of Issue #370 (221 routes were classified `interactive` by omission).
    const route = defineTenantRoute({
      authorize: GUARD,
      handler: () => ok({})
    });

    expect(typeof route).toBe("function");
  });
});
