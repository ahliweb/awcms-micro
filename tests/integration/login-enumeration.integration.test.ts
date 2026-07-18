/**
 * `POST /api/v1/auth/login` must not answer an unknown `loginIdentifier`
 * measurably faster than a known one, or an unauthenticated caller can
 * enumerate accounts in a single request (OWASP ASVS V2.2.1 / WSTG-IDNT-04).
 *
 * Ported from the awcms-mini base standard (Issue #840). Before the fix, an
 * unknown identifier skipped `verifyPassword` entirely and answered in ~4 ms
 * against ~80 ms for a known one — a ~19x timing oracle that needs no lockout
 * to trip and works on default configuration. `verifyPasswordOrDummy` closes
 * it by always paying the argon2id verify; this test pins that end-to-end.
 *
 * Scope note: this pins the TIMING property only, which is what the
 * `verifyPasswordOrDummy` change addresses. Collapsing the response BODIES of
 * the locked / password-login-disabled branches (the other half of the base
 * standard's Issue #840) is tracked separately in the hardening roadmap.
 *
 * Skipped entirely unless DATABASE_URL is set — see tests/integration/harness.ts.
 */
import { beforeAll, beforeEach, describe, expect, test } from "bun:test";

import {
  applyMigrations,
  createCookieJar,
  integrationEnabled,
  invoke,
  provisionAppRole,
  resetDatabase
} from "./harness";

import { POST as setupInitialize } from "../../src/pages/api/v1/setup/initialize";
import { POST as authLogin } from "../../src/pages/api/v1/auth/login";
import { resetRateLimitStoreForTests } from "../../src/lib/security/rate-limit";

const OWNER_LOGIN = "enum-owner@example.com";
const OWNER_PASSWORD = "integration-test-owner-password";

type LoginAnswer = {
  status: number;
  code: string;
  elapsedMs: number;
};

async function bootstrapTenant(
  tenantCode: string
): Promise<{ tenantId: string }> {
  const setup = await invoke<{ data: { tenantId: string } }>(setupInitialize, {
    method: "POST",
    path: "/api/v1/setup/initialize",
    headers: { "content-type": "application/json" },
    body: {
      tenantName: `Tenant ${tenantCode}`,
      tenantCode,
      officeCode: "hq",
      officeName: "Head Office",
      ownerLoginIdentifier: OWNER_LOGIN,
      ownerPassword: OWNER_PASSWORD,
      ownerDisplayName: "Owner"
    }
  });
  expect(setup.status).toBe(200);

  return { tenantId: setup.body.data.tenantId };
}

/**
 * Resets the volumetric limiter before every attempt: this test deliberately
 * spends more than `AUTH_LOGIN_RATE_LIMIT_MAX` (default 20) attempts from one
 * source, and a 429 short-circuits before the code under test — it would mask
 * the very difference being asserted by making both sides look identical for
 * the wrong reason.
 */
async function attemptLogin(
  tenantId: string,
  loginIdentifier: string,
  password: string
): Promise<LoginAnswer> {
  resetRateLimitStoreForTests();

  const startedAt = performance.now();
  const response = await invoke<{
    error?: { code: string };
    data?: { token: string };
  }>(authLogin, {
    method: "POST",
    path: "/api/v1/auth/login",
    headers: {
      "content-type": "application/json",
      "x-awcms-micro-tenant-id": tenantId
    },
    body: { loginIdentifier, password },
    cookies: createCookieJar(),
    locals: {}
  });
  const elapsedMs = performance.now() - startedAt;

  return {
    status: response.status,
    code: response.body.error?.code ?? "OK",
    elapsedMs
  };
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);

  return sorted[Math.floor(sorted.length / 2)]!;
}

const suite = integrationEnabled ? describe : describe.skip;

suite("login account-enumeration resistance (timing)", () => {
  beforeAll(async () => {
    await applyMigrations();
    await provisionAppRole();
  });

  beforeEach(async () => {
    await resetDatabase();
    resetRateLimitStoreForTests();
  });

  test("a wrong password and an unknown identifier both fail, a correct one succeeds", async () => {
    const { tenantId } = await bootstrapTenant("enum-correctness");

    const correct = await attemptLogin(tenantId, OWNER_LOGIN, OWNER_PASSWORD);
    expect(correct.status).toBe(200);

    const wrong = await attemptLogin(tenantId, OWNER_LOGIN, "wrong-password");
    expect(wrong.status).toBe(401);

    const unknown = await attemptLogin(
      tenantId,
      "ghost@example.com",
      "wrong-password"
    );
    // The unknown identifier answers exactly like a known one with a wrong
    // password — no distinguishing status/code.
    expect(unknown.status).toBe(wrong.status);
    expect(unknown.code).toBe(wrong.code);
  });

  test("an unknown identifier costs the same password-verification work as a known one", async () => {
    const { tenantId } = await bootstrapTenant("enum-timing");

    // Warm up: JIT, the connection pool, and (the point of this test) the
    // memoized dummy hash, whose one-time computation would otherwise land
    // inside the first measured unknown-identifier sample.
    await attemptLogin(tenantId, OWNER_LOGIN, "warmup");
    await attemptLogin(tenantId, "warmup@example.com", "warmup");

    const knownTimes: number[] = [];
    const unknownTimes: number[] = [];

    // Interleaved rather than run in two blocks, so any drift in machine load
    // hits both samples equally instead of biasing whichever ran second.
    for (let round = 0; round < 8; round += 1) {
      knownTimes.push(
        (await attemptLogin(tenantId, OWNER_LOGIN, `wrong-${round}`)).elapsedMs
      );
      unknownTimes.push(
        (
          await attemptLogin(
            tenantId,
            `ghost-${round}@example.com`,
            `wrong-${round}`
          )
        ).elapsedMs
      );
    }

    const knownMedian = median(knownTimes);
    const unknownMedian = median(unknownTimes);

    // Medians, not means: one GC pause or DB hiccup must not decide a security
    // assertion. Coarse shape check, not a constant-time proof. On the base
    // standard's harness the ratio moved from 0.052 (4.13 ms unknown vs
    // 80.13 ms known) before the fix to 1.002 after. 0.5 sits an order of
    // magnitude clear of the broken value while leaving headroom under the
    // fixed one, so it fails loudly if argon2id is ever skipped again for
    // unknown identifiers without flaking on ordinary jitter.
    expect(unknownMedian / knownMedian).toBeGreaterThan(0.5);

    // Guards the assertion above from passing vacuously if BOTH paths somehow
    // became trivially fast: a real argon2id verify cannot complete in under a
    // millisecond.
    expect(unknownMedian).toBeGreaterThan(1);
    expect(knownMedian).toBeGreaterThan(1);
  }, 120_000);
});
