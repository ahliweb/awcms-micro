import type { APIRoute } from "astro";
import { fail, ok } from "../../../../../../modules/_shared/api-response";
import { getDatabaseClient } from "../../../../../../lib/database/client";
import { withTenant } from "../../../../../../lib/database/tenant-context";
import { hashSessionToken } from "../../../../../../lib/auth/session-token";
import {
  SESSION_COOKIE_NAME,
  TENANT_COOKIE_NAME
} from "../../../../../../lib/auth/ssr-session";
import {
  extractBearerToken,
  resolveActiveSession
} from "../../../../../../modules/identity-access/application/session-lookup";
import { isMfaRequired } from "../../../../../../lib/auth/mfa-config";
import {
  disableMfa,
  verifyMfaStepUp
} from "../../../../../../modules/identity-access/application/mfa";
import {
  checkRateLimit,
  resolveClientIp
} from "../../../../../../lib/security/rate-limit";
import {
  mfaStepUpMessage,
  mfaStepUpStatus
} from "../../../../../../lib/auth/mfa-step-up-response";
import { recordAuditEvent } from "../../../../../../modules/logging/application/audit-log";

const RATE_LIMIT_MAX_ATTEMPTS = Number(
  process.env.AUTH_MFA_RATE_LIMIT_MAX ?? 5
);
const RATE_LIMIT_WINDOW_SEC = Number(
  process.env.AUTH_MFA_RATE_LIMIT_WINDOW_SEC ?? 300
);

type DisableBody = { code?: unknown; password?: unknown };

/**
 * `POST /api/v1/auth/mfa/totp/disable` (Issue #589; step-up added by Issue
 * #329) — high-risk, self-service action: authenticated identity turns off
 * its own MFA. A valid session alone is NOT sufficient (a hijacked session
 * could otherwise disable the victim's second factor) — the caller must also
 * prove fresh possession with the current TOTP `code` OR the account
 * `password` (`verifyMfaStepUp`). Rate-limited per source+tenant and audited.
 */
export const POST: APIRoute = async ({
  request,
  cookies,
  clientAddress,
  locals
}) => {
  if (!isMfaRequired()) {
    return fail(
      403,
      "MFA_DISABLED",
      "Multi-factor authentication is not enabled for this deployment."
    );
  }

  const tenantId =
    request.headers.get("x-awcms-micro-tenant-id") ??
    cookies.get(TENANT_COOKIE_NAME)?.value ??
    null;

  if (!tenantId) {
    return fail(400, "TENANT_REQUIRED", "Tenant header is required.");
  }

  const token =
    extractBearerToken(request.headers.get("authorization")) ??
    cookies.get(SESSION_COOKIE_NAME)?.value ??
    null;

  if (!token) {
    return fail(401, "AUTH_REQUIRED", "Authentication required.");
  }

  const clientIp = resolveClientIp(request, clientAddress);
  const rateLimit = checkRateLimit(`${clientIp}:${tenantId}:mfa-disable`, {
    maxAttempts: RATE_LIMIT_MAX_ATTEMPTS,
    windowMs: RATE_LIMIT_WINDOW_SEC * 1000
  });

  if (!rateLimit.allowed) {
    return fail(
      429,
      "RATE_LIMITED",
      "Too many attempts from this source. Try again later.",
      {},
      undefined,
      { "retry-after": String(rateLimit.retryAfterSec) }
    );
  }

  const body = (await request.json().catch(() => null)) as DisableBody | null;
  const proof = {
    code: typeof body?.code === "string" ? body.code : undefined,
    password: typeof body?.password === "string" ? body.password : undefined
  };

  const sql = getDatabaseClient();
  const tokenHash = hashSessionToken(token);
  const now = new Date();

  return withTenant(sql, tenantId, async (tx) => {
    const session = await resolveActiveSession(tx, tenantId, tokenHash, now);

    if (!session) {
      return fail(401, "AUTH_REQUIRED", "Session is invalid or expired.");
    }

    const stepUp = await verifyMfaStepUp(
      tx,
      tenantId,
      session.identity_id,
      proof,
      process.env,
      now
    );

    if (!stepUp.ok) {
      return fail(
        mfaStepUpStatus(stepUp.code),
        stepUp.code,
        mfaStepUpMessage(stepUp.code)
      );
    }

    const result = await disableMfa(tx, tenantId, session.identity_id, now);

    if (!result.ok) {
      return fail(
        409,
        result.code,
        "Multi-factor authentication is not currently active for this account."
      );
    }

    await recordAuditEvent(tx, {
      tenantId,
      moduleKey: "identity_access",
      action: "mfa_disabled",
      resourceType: "identity",
      resourceId: session.identity_id,
      severity: "warning",
      message: "Multi-factor authentication disabled.",
      correlationId: locals.correlationId
    });

    return ok({ disabled: true });
  });
};
