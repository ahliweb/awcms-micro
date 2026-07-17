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
import { detachNewsMediaObject } from "../../../../../../modules/media-library/application/media-object-directory";
import { explainMediaLifecycleFailure } from "../../../../../../modules/media-library/application/media-object-lifecycle-failure";
import { toResponse } from "../index";

/**
 * `POST /api/v1/media/objects/{id}/detach` (ADR-0026 step 5) — releases a media
 * object from its owning resource (`attached -> verified`).
 *
 * First route to enforce `media_library.media.detach`. Separate permission from
 * `attach` on purpose (the split predates this route, Issue #633): detaching is
 * what strips an image from live content, so a role may be allowed to attach
 * media without being allowed to remove it from a published article.
 *
 * A detached object becomes `verified`, NOT `orphaned` — the reconciliation job
 * (`media-reconciliation.ts`) decides orphanhood on its own schedule. Nothing
 * here deletes the R2 object; a detached object is reusable.
 */

const DETACH_GUARD = {
  moduleKey: "media_library",
  activityCode: "media",
  action: "detach" as const
};

const IDEMPOTENCY_SCOPE = "media_object_detach";

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

  const requestHash = computeRequestHash({ objectId, action: "detach" });
  const sql = getDatabaseClient();
  const tokenHash = hashSessionToken(token);
  const now = new Date();

  return withTenant(sql, tenantId, async (tx) => {
    const auth = await authorizeInTransaction(
      tx,
      tenantId,
      tokenHash,
      now,
      DETACH_GUARD
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

    const detached = await detachNewsMediaObject(
      tx,
      tenantId,
      auth.context.tenantUserId,
      objectId
    );

    if (!detached) {
      const failure = await explainMediaLifecycleFailure(
        tx,
        tenantId,
        objectId,
        "an attached media object"
      );
      return fail(failure.status, failure.code, failure.message);
    }

    const successResponse = ok({ object: toResponse(detached) });
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
