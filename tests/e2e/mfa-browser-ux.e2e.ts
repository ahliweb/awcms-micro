/**
 * E2E spec (Playwright + Bun, skill `awcms-micro-browser-test`) — browser UX
 * for the shipped TOTP 2FA backend (epic full-online auth hardening
 * #587-#593). Proves the two gaps this change closes:
 *
 *  1. The login page carries the second-step MFA challenge panel and drives it
 *     correctly when the login POST answers `401 MFA_REQUIRED` — reveal the
 *     challenge, hide the password form, toggle recovery mode, and forward the
 *     challenge token + code to `POST /api/v1/auth/mfa/totp/verify`.
 *  2. The self-service enrollment page (`/admin/profile/security`) renders its
 *     server-side GATED states (here: the informational "not available" state
 *     that every deployment without 2FA active shows), and the profile page
 *     omits the 2FA link in that state.
 *
 * The MFA_REQUIRED flow is exercised with Playwright's `page.route` request
 * interception rather than a real MFA factor + a server running with the
 * feature gate on: `isMfaRequired()` (= `isFullOnlineSecurityActive()` ∧
 * `AUTH_MFA_ENABLED`) is FALSE on both CI e2e-smoke server phases (Phase 2
 * enables the #587 gate but never `AUTH_MFA_ENABLED`), so the server never
 * emits `MFA_REQUIRED` organically here — this spec therefore mocks that one
 * server response to prove the CLIENT wiring, which is exactly the gap that
 * was missing. The QR generator's own correctness is covered separately and
 * cheaply by `tests/unit/qr-code.test.ts`.
 *
 * Uses the real `/login` form + browser navigation (never Playwright's
 * `page.request`/APIRequestContext fixture — see
 * `admin-security-disabled.e2e.ts`'s header for the Set-Cookie/URL crash that
 * rules it out under bun). The enrollment-gating test seeds an isolated
 * owner/tenant via `helpers/seed-owner-tenant.ts`, same as the admin-security
 * specs.
 *
 * Requires the dev/preview server under `E2E_BASE_URL` (default
 * `http://localhost:4321`) running against a Postgres DB; the enrollment test
 * additionally needs `E2E_SEED_DATABASE_URL` (privileged role) and skips
 * without it.
 *
 * Run: `bun run test:e2e tests/e2e/mfa-browser-ux.e2e.ts`.
 */
import { test, expect } from "@playwright/test";

import { seedOwnerTenant } from "./helpers/seed-owner-tenant";

function mfaRequiredBody(): string {
  return JSON.stringify({
    success: false,
    error: {
      code: "MFA_REQUIRED",
      message: "Multi-factor authentication is required to complete sign-in.",
      details: {
        mfaChallengeToken: "e2e-challenge-token",
        expiresAt: new Date(Date.now() + 300_000).toISOString()
      }
    },
    meta: {}
  });
}

function sessionOkBody(): string {
  return JSON.stringify({
    success: true,
    data: {
      token: "e2e-session-token",
      expiresAt: new Date(Date.now() + 7_200_000).toISOString()
    },
    meta: {}
  });
}

test.describe("2FA browser UX (login challenge + enrollment gating)", () => {
  test("login page ships the MFA challenge panel present-but-inert", async ({
    page
  }) => {
    await page.goto("/login");

    await expect(page.locator("#login-form")).toBeVisible();
    const challenge = page.locator("#mfa-challenge");
    await expect(challenge).toHaveCount(1);
    // Present in the DOM but hidden — harmless on deployments without 2FA.
    await expect(challenge).toBeHidden();
  });

  test("reveals and drives the challenge step on a 401 MFA_REQUIRED response", async ({
    page
  }) => {
    const verifyRequests: Array<{ mfaChallengeToken?: string; code?: string }> =
      [];

    await page.route("**/api/v1/auth/login", (route) =>
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: mfaRequiredBody()
      })
    );
    await page.route("**/api/v1/auth/mfa/totp/verify", (route) => {
      verifyRequests.push(
        route.request().postDataJSON() as {
          mfaChallengeToken?: string;
          code?: string;
        }
      );
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: sessionOkBody()
      });
    });

    await page.goto("/login");
    await page
      .locator("#tenant-id")
      .fill("00000000-0000-0000-0000-000000000000");
    await page.locator("#login-identifier").fill("user@example.com");
    await page.locator("#password").fill("correct horse battery staple");
    await page.locator("#login-submit").click();

    // The password form yields to the challenge — no generic error banner.
    await expect(page.locator("#mfa-challenge")).toBeVisible();
    await expect(page.locator("#login-form")).toBeHidden();
    await expect(page.locator("#login-error")).toBeHidden();
    // Focus is moved to the code field for keyboard/AT users.
    await expect(page.locator("#mfa-code")).toBeFocused();

    // The recovery toggle relaxes the input constraints (6-8 digit code → a
    // ~9-char recovery code) and back.
    await expect(page.locator("#mfa-code")).toHaveAttribute("maxlength", "8");
    await page.locator("#mfa-use-recovery").click();
    await expect(page.locator("#mfa-code")).toHaveAttribute("maxlength", "9");
    await page.locator("#mfa-use-recovery").click();
    await expect(page.locator("#mfa-code")).toHaveAttribute("maxlength", "8");

    // Submitting forwards the server-issued challenge token + entered code to
    // the verify endpoint.
    await page.locator("#mfa-code").fill("123456");
    await page.locator("#mfa-submit").click();

    await expect
      .poll(() => verifyRequests[0]?.mfaChallengeToken)
      .toBe("e2e-challenge-token");
    expect(verifyRequests[0]?.code).toBe("123456");
  });

  test("enrollment page renders only the informational state when 2FA is inactive", async ({
    page
  }) => {
    const seedDatabaseUrl = process.env.E2E_SEED_DATABASE_URL;
    test.skip(
      !seedDatabaseUrl,
      "E2E_SEED_DATABASE_URL not set — see this file's own header comment."
    );

    const owner = await seedOwnerTenant(
      seedDatabaseUrl!,
      `e2e-2fa-${crypto.randomUUID().slice(0, 8)}`
    );

    await page.goto("/login");
    await page.locator("#tenant-id").fill(owner.tenantId);
    await page.locator("#login-identifier").fill(owner.loginIdentifier);
    await page.locator("#password").fill(owner.password);
    await page.locator("#login-submit").click();
    await page.waitForURL("**/admin");

    // The profile page hides the 2FA link when the feature is inactive.
    await page.goto("/admin/profile");
    await expect(page.locator('a[href="/admin/profile/security"]')).toHaveCount(
      0
    );

    // The enrollment page itself renders ONLY the informational notice — the
    // interactive enroll/manage sections must be absent from the DOM (proving
    // the server-side gate, not a CSS hide).
    await page.goto("/admin/profile/security");
    const info = page.locator('.state-notice[data-kind="info"]');
    await expect(info).toBeVisible();
    await expect(info).toHaveAttribute("role", "status");
    await expect(page.locator("#enroll-section")).toHaveCount(0);
    await expect(page.locator("#manage-section")).toHaveCount(0);
    await expect(page.locator("#mfa-enable-button")).toHaveCount(0);
  });
});
