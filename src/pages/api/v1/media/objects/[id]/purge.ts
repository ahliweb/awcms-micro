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
import { purgeNewsMediaObject } from "../../../../../../modules/media-library/application/media-object-directory";
import { explainMediaLifecycleFailure } from "../../../../../../modules/media-library/application/media-object-lifecycle-failure";

/**
 * `POST /api/v1/media/objects/{id}/purge` (ADR-0026 step 5) — irreversibly
 * removes an ALREADY soft-deleted media object's metadata row.
 *
 * First route to enforce `media_library.media.purge`. Requires the object to be
 * soft-deleted first: purge is not a shortcut for delete, and a two-step
 * delete-then-purge is what makes an accidental irreversible removal require two
 * deliberate acts with two distinct permissions. `Idempotency-Key` required —
 * same as `blog/posts/{id}/purge` and `analytics/retention/purge`.
 *
 * ## This does NOT delete the R2 object, and that is by design
 *
 * `purgeNewsMediaObject` drops the metadata row only. The bytes stay in the
 * bucket until `scripts/news-media-r2-reconcile.ts` sweeps them as an
 * "orphan-in-R2" (a bucket object with no matching row) once older than
 * `NEWS_MEDIA_R2_ORPHAN_GRACE_DAYS`. See
 * `domain/media-reconciliation-categorization.ts`, which documents that category
 * as existing precisely for this: "a known, accepted gap this job closes
 * asynchronously rather than by changing that endpoint".
 *
 * That is not laziness — it is ADR-0006. Deleting from R2 is a provider call and
 * must never happen inside a DB transaction; doing it here would either hold a
 * transaction open across a network round trip or leave the row and the object
 * inconsistent if the call failed after commit. The async sweep is the design
 * this repo already chose, and this route deliberately does not relitigate it.
 *
 * The consequence worth knowing: the object remains publicly reachable at its
 * `publicUrl` until the sweep runs. A caller purging for content reasons is
 * fine; a caller purging to make something unreachable RIGHT NOW is not served
 * by this endpoint, and should not be told otherwise.
 */

const PURGE_GUARD = {
  moduleKey: "media_library",
  activityCode: "media",
  action: "purge" as const
};

const IDEMPOTENCY_SCOPE = "media_object_purge";

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

  const requestHash = computeRequestHash({ objectId, action: "purge" });
  const sql = getDatabaseClient();
  const tokenHash = hashSessionToken(token);
  const now = new Date();

  return withTenant(sql, tenantId, async (tx) => {
    const auth = await authorizeInTransaction(
      tx,
      tenantId,
      tokenHash,
      now,
      PURGE_GUARD
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

    const purged = await purgeNewsMediaObject(
      tx,
      tenantId,
      auth.context.tenantUserId,
      objectId
    );

    if (!purged) {
      const failure = await explainMediaLifecycleFailure(
        tx,
        tenantId,
        objectId,
        "a soft-deleted media object (purge never skips the soft-delete step)"
      );
      return fail(failure.status, failure.code, failure.message);
    }

    const successResponse = ok({ purged: true, id: objectId });
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
