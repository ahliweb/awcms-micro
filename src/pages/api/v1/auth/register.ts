import type { APIRoute } from "astro";

import { fail, ok } from "../../../../modules/_shared/api-response";
import { getDatabaseClient } from "../../../../lib/database/client";
import { withTenant } from "../../../../lib/database/tenant-context";
import {
  checkRateLimit,
  resolveClientIp
} from "../../../../lib/security/rate-limit";
import {
  bodyTooLargeResponse,
  readJsonBody
} from "../../../../lib/security/request-body-limit";
import { enforceTurnstileIfRequired } from "../../../../lib/security/turnstile";
import { hashPassword } from "../../../../lib/auth/password";
import { isSelfRegistrationEnabled } from "../../../../lib/auth/self-registration-config";
import { recordAuditEvent } from "../../../../modules/logging/application/audit-log";
import { submitRegistrationRequest } from "../../../../modules/identity-access/application/self-registration";
import { validateRegistrationInput } from "../../../../modules/identity-access/domain/self-registration-validation";

const RATE_LIMIT_MAX_ATTEMPTS = Number(
  process.env.AUTH_SELF_REGISTRATION_RATE_LIMIT_MAX ?? 5
);
const RATE_LIMIT_WINDOW_SEC = Number(
  process.env.AUTH_SELF_REGISTRATION_RATE_LIMIT_WINDOW_SEC ?? 900
);

const GENERIC_MESSAGE =
  "If the details are valid, your registration request has been submitted and is awaiting admin approval.";

/**
 * `POST /api/v1/auth/register` (Issue: self-registration). Public,
 * unauthenticated. Creates an admin-approval-gated PENDING request — never a
 * login-eligible identity (see `application/self-registration.ts`).
 *
 * Off unless `AUTH_SELF_REGISTRATION_ENABLED=true`: when disabled the route
 * 404s so the feature is genuinely absent, not merely hidden.
 *
 * Account-enumeration-safe by construction (mirrors `password/forgot.ts`):
 * the exact same generic 200 is returned whether the identifier was fresh,
 * already registered, or already pending. The audit event records the real
 * reason (internal-only surface). Security controls mirror the other public
 * auth endpoints: rate-limit → body-limit → validation → Turnstile → single
 * tenant-scoped transaction. `roleIds`/privilege input is NOT accepted.
 */
export const POST: APIRoute = async ({ request, clientAddress, locals }) => {
  if (!isSelfRegistrationEnabled()) {
    return fail(404, "NOT_FOUND", "Self-registration is not enabled.");
  }

  const tenantId = request.headers.get("x-awcms-micro-tenant-id");

  if (!tenantId) {
    return fail(400, "TENANT_REQUIRED", "Tenant header is required.");
  }

  // Rate limit before touching the database (public + unauthenticated +
  // triggers an argon2 hash and a DB write) — cheapest rejection first.
  const clientIp = resolveClientIp(request, clientAddress);
  const rateLimit = checkRateLimit(`${clientIp}:${tenantId}:register`, {
    maxAttempts: RATE_LIMIT_MAX_ATTEMPTS,
    windowMs: RATE_LIMIT_WINDOW_SEC * 1000
  });

  if (!rateLimit.allowed) {
    return fail(
      429,
      "RATE_LIMITED",
      "Too many registration attempts from this source. Try again later.",
      {},
      undefined,
      { "retry-after": String(rateLimit.retryAfterSec) }
    );
  }

  const bodyRead = await readJsonBody(request);

  if (bodyRead.tooLarge) {
    return bodyTooLargeResponse(bodyRead.limitBytes);
  }

  const rawBody = bodyRead.value;
  const validation = validateRegistrationInput(rawBody);

  if (!validation.valid) {
    return fail(
      400,
      "VALIDATION_ERROR",
      "Registration details are invalid.",
      {},
      validation.errors
    );
  }

  const turnstileResult = await enforceTurnstileIfRequired(
    (rawBody as Record<string, unknown> | null)?.turnstileToken,
    clientIp
  );

  if (!turnstileResult.ok) {
    return fail(
      400,
      turnstileResult.code,
      turnstileResult.code === "TURNSTILE_REQUIRED"
        ? "Turnstile verification token is required."
        : "Turnstile verification failed."
    );
  }

  // Argon2 hashing is CPU-bound — do it BEFORE opening the transaction so it
  // never holds a DB connection (same as `users/index.ts`). We always hash,
  // even when the request will be a no-op (existing/pending), so the response
  // timing does not reveal whether the identifier was already taken.
  const passwordHash = await hashPassword(validation.value.password);

  const sql = getDatabaseClient();
  const correlationId = locals.correlationId;

  return withTenant(sql, tenantId, async (tx) => {
    const result = await submitRegistrationRequest(
      tx,
      tenantId,
      {
        loginIdentifier: validation.value.loginIdentifier,
        displayName: validation.value.displayName
      },
      passwordHash
    );

    await recordAuditEvent(tx, {
      tenantId,
      // No actorTenantUserId — self-service, unauthenticated.
      moduleKey: "identity_access",
      action: "user_registration_requested",
      resourceType: "registration_request",
      severity: "info",
      message: result.created
        ? "Self-registration request recorded (pending approval)."
        : `Self-registration request ignored (${result.reason}).`,
      // loginIdentifier is redacted by recordAuditEvent; the reason/created
      // flags are safe internal signal for spam/enumeration monitoring.
      attributes: {
        loginIdentifier: validation.value.loginIdentifier,
        created: result.created,
        reason: result.reason
      },
      correlationId
    });

    return ok({ requested: true, message: GENERIC_MESSAGE });
  });
};
