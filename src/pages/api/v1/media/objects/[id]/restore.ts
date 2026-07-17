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
  computeRequestHash,
  findIdempotencyRecord,
  saveIdempotencyRecord
} from "../../../../../../modules/_shared/idempotency";
import { restoreNewsMediaObject } from "../../../../../../modules/media-library/application/media-object-directory";
import { explainMediaLifecycleFailure } from "../../../../../../modules/media-library/application/media-object-lifecycle-failure";
import { toResponse } from "../index";

/**
 * `POST /api/v1/media/objects/{id}/restore` (ADR-0026 step 5) — undoes a soft
 * delete, returning the object to whatever status it held before.
 *
 * First route to enforce `media_library.media.restore`. High-risk mutation
 * (it puts an image back into reach of public content), so `Idempotency-Key` is
 * required — same as `blog/posts/{id}/restore`.
 *
 * A restored object keeps its pre-delete status. If it was `attached`, it is
 * attached again the moment this returns: soft delete never cleared
 * `owner_resource_type`/`owner_resource_id`, so restoring genuinely undoes the
 * delete rather than half-undoing it into a detached state.
 */

const RESTORE_GUARD = {
  moduleKey: "media_library",
  activityCode: "media",
  action: "restore" as const
};

const IDEMPOTENCY_SCOPE = "media_object_restore";

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

  const requestHash = computeRequestHash({ objectId, action: "restore" });
  const sql = getDatabaseClient();
  const tokenHash = hashSessionToken(token);
  const now = new Date();

  return withTenant(sql, tenantId, async (tx) => {
    const auth = await authorizeInTransaction(
      tx,
      tenantId,
      tokenHash,
      now,
      RESTORE_GUARD
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

    const restored = await restoreNewsMediaObject(
      tx,
      tenantId,
      auth.context.tenantUserId,
      objectId
    );

    if (!restored) {
      const failure = await explainMediaLifecycleFailure(
        tx,
        tenantId,
        objectId,
        "a soft-deleted media object"
      );
      return fail(failure.status, failure.code, failure.message);
    }

    const successResponse = ok({ object: toResponse(restored) });
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
