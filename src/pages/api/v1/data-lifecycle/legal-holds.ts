import {
  fail,
  jsonResponse,
  ok
} from "../../../../modules/_shared/api-response";
import { defineTenantRoute } from "../../../../modules/_shared/tenant-route";
import {
  computeRequestHash,
  findIdempotencyRecord,
  saveIdempotencyRecord
} from "../../../../modules/_shared/idempotency";
import {
  createLegalHold,
  listLegalHolds
} from "../../../../modules/data-lifecycle/application/legal-hold-service";

const IDEMPOTENCY_SCOPE = "data_lifecycle_legal_hold_create";

/**
 * `GET /api/v1/data-lifecycle/legal-holds` (Issue #745) — list legal holds
 * for the caller's tenant, optionally filtered by `status`/`descriptorKey`.
 *
 * `workClass: "interactive"` (Issue #370) — admin-screen read; re-affirms
 * the class it already ran under, no runtime change.
 */
export const GET = defineTenantRoute({
  workClass: "interactive",
  authorize: {
    moduleKey: "data_lifecycle",
    activityCode: "legal_hold",
    action: "read"
  },
  prepare: ({ url }) => {
    const statusParam = url.searchParams.get("status");

    if (statusParam && statusParam !== "active" && statusParam !== "released") {
      return fail(
        400,
        "VALIDATION_ERROR",
        'status must be "active" or "released".'
      );
    }

    return {
      status: (statusParam as "active" | "released" | null) ?? undefined,
      descriptorKey: url.searchParams.get("descriptorKey") ?? undefined
    };
  },
  handler: async ({ tx, tenantId, prepared }) =>
    ok({ legalHolds: await listLegalHolds(tx, tenantId, prepared) })
});

type CreateLegalHoldBody = {
  descriptorKey?: string | null;
  scopeDescription?: unknown;
  reason?: unknown;
  authorityReference?: unknown;
  endsAt?: unknown;
};

/**
 * `POST /api/v1/data-lifecycle/legal-holds` (Issue #745) — create a legal
 * hold. High-risk mutation: requires `Idempotency-Key`, permission-gated
 * (`data_lifecycle.legal_hold.create`), reason-required, audited `critical`.
 *
 * `workClass: "interactive"` (Issue #370) — a short, user-initiated write
 * from an admin screen. NOT `critical_transaction`: that class is the wider
 * budget reserved for the posting path, and moving this route into it would
 * be a real behaviour change, not a transcription of the status quo. It
 * re-affirms the class the route already ran under.
 */
export const POST = defineTenantRoute({
  workClass: "interactive",
  authorize: {
    moduleKey: "data_lifecycle",
    activityCode: "legal_hold",
    action: "create"
  },
  prepare: async ({ request }) => {
    const idempotencyKey = request.headers.get("idempotency-key");
    if (!idempotencyKey) {
      return fail(
        400,
        "IDEMPOTENCY_REQUIRED",
        "Idempotency-Key header is required."
      );
    }

    let body: CreateLegalHoldBody;
    try {
      body = (await request.json()) as CreateLegalHoldBody;
    } catch {
      return fail(400, "VALIDATION_ERROR", "Request body must be valid JSON.");
    }

    return {
      idempotencyKey,
      // Hash of the RAW parsed body, exactly as before — the replay/conflict
      // identity must not silently change shape under this refactor.
      requestHash: computeRequestHash(body),
      input: {
        descriptorKey:
          typeof body.descriptorKey === "string" ? body.descriptorKey : null,
        scopeDescription:
          typeof body.scopeDescription === "string"
            ? body.scopeDescription
            : "",
        reason: typeof body.reason === "string" ? body.reason : "",
        authorityReference:
          typeof body.authorityReference === "string"
            ? body.authorityReference
            : "",
        endsAt:
          typeof body.endsAt === "string" && body.endsAt.length > 0
            ? new Date(body.endsAt)
            : null
      }
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

    const result = await createLegalHold(
      tx,
      tenantId,
      auth.context.tenantUserId,
      prepared.input,
      locals.correlationId
    );

    if (!result.ok) {
      return fail(
        400,
        "VALIDATION_ERROR",
        result.errors
          .map((error) => `${error.field}: ${error.message}`)
          .join("; ")
      );
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
