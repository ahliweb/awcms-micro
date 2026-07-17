import type { APIRoute } from "astro";

import {
  fail,
  jsonResponse,
  ok
} from "../../../../../../modules/_shared/api-response";
import { getDatabaseClient } from "../../../../../../lib/database/client";
import { withTenant } from "../../../../../../lib/database/tenant-context";
import {
  authorizeInTransaction,
  resolveAuthInputs
} from "../../../../../../modules/identity-access/application/access-guard";
import { hashSessionToken } from "../../../../../../lib/auth/session-token";
import {
  bodyTooLargeResponse,
  readJsonBody
} from "../../../../../../lib/security/request-body-limit";
import {
  computeRequestHash,
  findIdempotencyRecord,
  saveIdempotencyRecord
} from "../../../../../../modules/_shared/idempotency";
import {
  attachNewsMediaObject,
  isNewsMediaOwnerResourceType,
  NEWS_MEDIA_OWNER_RESOURCE_TYPES
} from "../../../../../../modules/media-library/application/media-object-directory";
import { explainMediaLifecycleFailure } from "../../../../../../modules/media-library/application/media-object-lifecycle-failure";
import { toResponse } from "../index";

/**
 * `POST /api/v1/media/objects/{id}/attach` (ADR-0026 step 5) — binds a verified
 * media object to an owning resource (`verified -> attached`).
 *
 * First route to enforce `media_library.media.attach`, seeded since Issue #634
 * with nothing checking it. The application function it calls
 * (`attachNewsMediaObject`) has existed since #633 — only the route was missing.
 *
 * State transition, so `Idempotency-Key` is required, matching every other
 * status transition in this repo (`blog/posts/{id}/publish`, `/archive`,
 * `/restore`). Replaying the same key returns the original response rather than
 * re-attaching.
 */

const ATTACH_GUARD = {
  moduleKey: "media_library",
  activityCode: "media",
  action: "attach" as const
};

const IDEMPOTENCY_SCOPE = "media_object_attach";

export const POST: APIRoute = async ({ request, params, cookies }) => {
  const { tenantId, token } = resolveAuthInputs(request, cookies);
  const objectId = params.id;

  if (!tenantId) {
    return fail(400, "TENANT_REQUIRED", "Tenant header is required.");
  }

  if (!objectId) {
    return fail(400, "VALIDATION_ERROR", "Media object id is required.");
  }

  if (!token) {
    return fail(401, "AUTH_REQUIRED", "Authentication required.");
  }

  const idempotencyKey = request.headers.get("idempotency-key");

  if (!idempotencyKey) {
    return fail(
      400,
      "IDEMPOTENCY_REQUIRED",
      "Idempotency-Key header is required."
    );
  }

  const bodyRead = await readJsonBody(request);

  if (bodyRead.tooLarge) {
    return bodyTooLargeResponse(bodyRead.limitBytes);
  }

  const body = (bodyRead.value ?? {}) as Record<string, unknown>;
  const ownerResourceType = body.ownerResourceType;
  const ownerResourceId = body.ownerResourceId;

  if (
    typeof ownerResourceType !== "string" ||
    !isNewsMediaOwnerResourceType(ownerResourceType)
  ) {
    return fail(
      400,
      "VALIDATION_ERROR",
      `ownerResourceType must be one of ${NEWS_MEDIA_OWNER_RESOURCE_TYPES.join(", ")}.`
    );
  }

  if (typeof ownerResourceId !== "string" || ownerResourceId.trim() === "") {
    return fail(400, "VALIDATION_ERROR", "ownerResourceId is required.");
  }

  // The owning resource's own existence is deliberately NOT checked here. This
  // module must never read another module's tables (ADR-0013 §6) — the
  // composition root that knows the post/page is real is the one calling this.
  // `owner_resource_id` is intentionally a plain column, not a foreign key, for
  // the same reason: it points into whichever module owns the resource.
  const requestHash = computeRequestHash({
    objectId,
    action: "attach",
    ownerResourceType,
    ownerResourceId
  });
  const sql = getDatabaseClient();
  const tokenHash = hashSessionToken(token);
  const now = new Date();

  return withTenant(sql, tenantId, async (tx) => {
    const auth = await authorizeInTransaction(
      tx,
      tenantId,
      tokenHash,
      now,
      ATTACH_GUARD
    );

    if (!auth.allowed) {
      return auth.denied;
    }

    const existingIdempotency = await findIdempotencyRecord(
      tx,
      tenantId,
      IDEMPOTENCY_SCOPE,
      idempotencyKey
    );

    if (existingIdempotency) {
      if (existingIdempotency.requestHash !== requestHash) {
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

    const attached = await attachNewsMediaObject(
      tx,
      tenantId,
      auth.context.tenantUserId,
      objectId,
      { ownerResourceType, ownerResourceId }
    );

    if (!attached) {
      const failure = await explainMediaLifecycleFailure(
        tx,
        tenantId,
        objectId,
        "a verified, not-yet-attached media object"
      );
      return fail(failure.status, failure.code, failure.message);
    }

    const successResponse = ok({ object: toResponse(attached) });
    const successBody = await successResponse.clone().json();

    await saveIdempotencyRecord(
      tx,
      tenantId,
      IDEMPOTENCY_SCOPE,
      idempotencyKey,
      requestHash,
      200,
      successBody
    );

    return successResponse;
  });
};
