/**
 * Integration tests for admin-approval-gated self-registration (Issue:
 * self-registration). Exercises the real handlers against a real PostgreSQL:
 * the feature flag gate, the register -> pending -> approve -> login-works
 * cycle (a pending request is NOT login-eligible), account-enumeration-safe
 * responses, and reject.
 *
 * Skipped unless DATABASE_URL is set (see tests/integration/harness.ts).
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
import { POST as authRegister } from "../../src/pages/api/v1/auth/register";
import { GET as listRegistrations } from "../../src/pages/api/v1/registration-requests/index";
import { POST as approveRegistration } from "../../src/pages/api/v1/registration-requests/[id]/approve";
import { POST as rejectRegistration } from "../../src/pages/api/v1/registration-requests/[id]/reject";
import { resetRateLimitStoreForTests } from "../../src/lib/security/rate-limit";

const OWNER_LOGIN = "owner@example.com";
const OWNER_PASSWORD = "integration-test-owner-password";
const APPLICANT = {
  displayName: "New User",
  loginIdentifier: "newuser@example.com",
  password: "a-strong-passphrase"
};

type Bootstrap = { tenantId: string; token: string; loginIdentifier: string };

async function bootstrap(): Promise<Bootstrap> {
  const loginIdentifier = OWNER_LOGIN;
  const setup = await invoke<{ data: { tenantId: string } }>(setupInitialize, {
    method: "POST",
    path: "/api/v1/setup/initialize",
    headers: { "content-type": "application/json" },
    body: {
      tenantName: "Acme",
      tenantCode: "acme",
      officeCode: "hq",
      officeName: "HQ",
      ownerLoginIdentifier: loginIdentifier,
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
    body: { loginIdentifier, password: OWNER_PASSWORD },
    cookies: createCookieJar()
  });
  expect(login.status).toBe(200);

  return {
    tenantId: setup.body.data.tenantId,
    token: login.body.data.token,
    loginIdentifier
  };
}

function tenantHeaders(tenantId: string): Record<string, string> {
  return {
    "content-type": "application/json",
    "x-awcms-micro-tenant-id": tenantId
  };
}

function adminHeaders(tenantId: string, token: string): Record<string, string> {
  return {
    "content-type": "application/json",
    "x-awcms-micro-tenant-id": tenantId,
    authorization: `Bearer ${token}`
  };
}

async function listPending(b: Bootstrap) {
  return invoke<{
    data: { requests: Array<{ id: string; loginIdentifier: string }> };
  }>(listRegistrations, {
    method: "GET",
    path: "/api/v1/registration-requests",
    headers: adminHeaders(b.tenantId, b.token)
  });
}

async function tryLogin(
  tenantId: string,
  loginIdentifier: string,
  password: string
) {
  return invoke(authLogin, {
    method: "POST",
    path: "/api/v1/auth/login",
    headers: tenantHeaders(tenantId),
    body: { loginIdentifier, password },
    cookies: createCookieJar()
  });
}

const suite = integrationEnabled ? describe : describe.skip;

suite("self-registration flow", () => {
  beforeAll(async () => {
    await applyMigrations();
    await provisionAppRole();
  });

  beforeEach(async () => {
    await resetDatabase();
    resetRateLimitStoreForTests();
    process.env.AUTH_SELF_REGISTRATION_ENABLED = "true";
  });

  test("register is 404 when the feature is disabled", async () => {
    delete process.env.AUTH_SELF_REGISTRATION_ENABLED;
    const owner = await bootstrap();
    const res = await invoke(authRegister, {
      method: "POST",
      path: "/api/v1/auth/register",
      headers: tenantHeaders(owner.tenantId),
      body: APPLICANT
    });
    expect(res.status).toBe(404);
  });

  test("register -> pending (login blocked) -> approve -> login works", async () => {
    const owner = await bootstrap();

    const reg = await invoke<{ data: { requested: boolean } }>(authRegister, {
      method: "POST",
      path: "/api/v1/auth/register",
      headers: tenantHeaders(owner.tenantId),
      body: APPLICANT
    });
    expect(reg.status).toBe(200);
    expect(reg.body.data.requested).toBe(true);

    // A pending request is NOT a login-eligible identity yet.
    const blocked = await tryLogin(
      owner.tenantId,
      APPLICANT.loginIdentifier,
      APPLICANT.password
    );
    expect(blocked.status).toBe(401);

    const list = await listPending(owner);
    expect(list.status).toBe(200);
    expect(list.body.data.requests.length).toBe(1);
    expect(list.body.data.requests[0]!.loginIdentifier).toBe(
      APPLICANT.loginIdentifier
    );
    const requestId = list.body.data.requests[0]!.id;

    const approved = await invoke<{ data: { approved: boolean } }>(
      approveRegistration,
      {
        method: "POST",
        path: `/api/v1/registration-requests/${requestId}/approve`,
        params: { id: requestId },
        headers: adminHeaders(owner.tenantId, owner.token),
        body: {}
      }
    );
    expect(approved.status).toBe(200);
    expect(approved.body.data.approved).toBe(true);

    // Now the user can log in.
    const ok = await tryLogin(
      owner.tenantId,
      APPLICANT.loginIdentifier,
      APPLICANT.password
    );
    expect(ok.status).toBe(200);

    // The queue is now empty.
    const after = await listPending(owner);
    expect(after.body.data.requests.length).toBe(0);
  });

  test("anti-enumeration: registering an existing identifier returns the same generic 200 and creates no request", async () => {
    const owner = await bootstrap();

    const res = await invoke<{ data: { requested: boolean } }>(authRegister, {
      method: "POST",
      path: "/api/v1/auth/register",
      headers: tenantHeaders(owner.tenantId),
      body: {
        displayName: "Impersonator",
        loginIdentifier: owner.loginIdentifier,
        password: "another-strong-passphrase"
      }
    });
    expect(res.status).toBe(200);
    expect(res.body.data.requested).toBe(true);

    // No pending request was actually created for the existing account.
    const list = await listPending(owner);
    expect(list.body.data.requests.length).toBe(0);
  });

  test("reject clears the queue and keeps login blocked", async () => {
    const owner = await bootstrap();

    await invoke(authRegister, {
      method: "POST",
      path: "/api/v1/auth/register",
      headers: tenantHeaders(owner.tenantId),
      body: APPLICANT
    });

    const list = await listPending(owner);
    const requestId = list.body.data.requests[0]!.id;

    const rejected = await invoke<{ data: { rejected: boolean } }>(
      rejectRegistration,
      {
        method: "POST",
        path: `/api/v1/registration-requests/${requestId}/reject`,
        params: { id: requestId },
        headers: adminHeaders(owner.tenantId, owner.token)
      }
    );
    expect(rejected.status).toBe(200);
    expect(rejected.body.data.rejected).toBe(true);

    const after = await listPending(owner);
    expect(after.body.data.requests.length).toBe(0);

    const blocked = await tryLogin(
      owner.tenantId,
      APPLICANT.loginIdentifier,
      APPLICANT.password
    );
    expect(blocked.status).toBe(401);
  });
});
