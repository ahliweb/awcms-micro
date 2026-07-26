import {
  fail,
  jsonResponse,
  ok
} from "../../../../../../modules/_shared/api-response";
import { defineTenantRoute } from "../../../../../../modules/_shared/tenant-route";
import {
  computeRequestHash,
  findIdempotencyRecord,
  saveIdempotencyRecord
} from "../../../../../../modules/_shared/idempotency";
import { releaseLegalHold } from "../../../../../../modules/data-lifecycle/application/legal-hold-service";

const IDEMPOTENCY_SCOPE = "data_lifecycle_legal_hold_release";

type ReleaseLegalHoldBody = {
  releaseReason?: unknown;
};

/**
 * `POST /api/v1/data-lifecycle/legal-holds/{id}/release` (Issue #745) —
 * end an active legal hold. Deliberately a DISTINCT permission
 * (`data_lifecycle.legal_hold.release`) from `.create` — "default-deny
 * release" (issue #745): holding `create` does not imply the ability to
 * `release`. High-risk mutation: requires `Idempotency-Key`,
 * reason-required, audited `critical`.
 *
 * `workClass: "interactive"` (Issue #370) — same reasoning as the create
 * route in `../../legal-holds.ts`; re-affirms the existing class.
 *
 * The `params.id` guard moved from "before the tenant/token checks" into
 * `prepare` (i.e. after them). The only input that could tell the two
 * orderings apart is a request with NO route parameter at all, which Astro
 * cannot produce for a `[id]` route — the guard is defense in depth against
 * a direct programmatic call, and it still fires.
 */
export const POST = defineTenantRoute({
  workClass: "interactive",
  authorize: {
    moduleKey: "data_lifecycle",
    activityCode: "legal_hold",
    action: "release"
  },
  prepare: async ({ request, params }) => {
    const holdId = params.id;
    if (!holdId) {
      return fail(400, "VALIDATION_ERROR", "Legal hold id is required.");
    }

    const idempotencyKey = request.headers.get("idempotency-key");
    if (!idempotencyKey) {
      return fail(
        400,
        "IDEMPOTENCY_REQUIRED",
        "Idempotency-Key header is required."
      );
    }

    let body: ReleaseLegalHoldBody;
    try {
      body = (await request.json()) as ReleaseLegalHoldBody;
    } catch {
      return fail(400, "VALIDATION_ERROR", "Request body must be valid JSON.");
    }

    return {
      holdId,
      idempotencyKey,
      // Same hash inputs as before the refactor — replay identity is stable.
      requestHash: computeRequestHash({
        ...body,
        id: holdId,
        action: "release"
      }),
      releaseReason:
        typeof body.releaseReason === "string" ? body.releaseReason : ""
    };
  },
  handler: async ({ tx, tenantId, locals, auth, prepared }) => {
    // Sequential `await`s on one `tx` — never `Promise.all` (#324).
    const existingIdempotency = await findIdempotencyRecord(
      tx,
      tenantId,
      IDEMPOTENCY_SCOPE,
      prepared.idempotencyKey
    );

    if (existingIdempotency) {
      if (existingIdempotency.requestHash !== prepared.requestHash) {
        return fail(
          409,
          "IDEMPOTENCY_CONFLICT",
          "Idempotency-Key was already used with a different request."
        );
      }
      return jsonResponse(existingIdempotency.responseBody, {
        status: existingIdempotency.responseStatus
      });
    }

    const result = await releaseLegalHold(
      tx,
      tenantId,
      auth.context.tenantUserId,
      prepared.holdId,
      { releaseReason: prepared.releaseReason },
      locals.correlationId
    );

    if (!result.ok) {
      if (result.reason === "validation") {
        return fail(
          400,
          "VALIDATION_ERROR",
          result.errors
            .map((error) => `${error.field}: ${error.message}`)
            .join("; ")
        );
      }
      if (result.reason === "not_found") {
        return fail(404, "NOT_FOUND", "Legal hold not found.");
      }
      return fail(409, "ALREADY_RELEASED", "Legal hold is already released.");
    }

    const successResponse = ok({ legalHold: result.hold });
    const successBody = await successResponse.clone().json();

    await saveIdempotencyRecord(
      tx,
      tenantId,
      IDEMPOTENCY_SCOPE,
      prepared.idempotencyKey,
      prepared.requestHash,
      200,
      successBody
    );

    return successResponse;
  }
});
