import type { APIRoute } from "astro";

import { fail, ok } from "../../../../../modules/_shared/api-response";
import { getDatabaseClient } from "../../../../../lib/database/client";
import { withTenant } from "../../../../../lib/database/tenant-context";
import {
  authorizeInTransaction,
  resolveAuthInputs
} from "../../../../../modules/identity-access/application/access-guard";
import { hashSessionToken } from "../../../../../lib/auth/session-token";
import {
  bodyTooLargeResponse,
  readJsonBody
} from "../../../../../lib/security/request-body-limit";
import {
  fetchNewsMediaObjectById,
  softDeleteNewsMediaObject
} from "../../../../../modules/media-library/application/media-object-directory";
import { explainMediaLifecycleFailure } from "../../../../../modules/media-library/application/media-object-lifecycle-failure";
import { toResponse } from "./index";

/**
 * `GET /api/v1/media/objects/{id}` — one media object's metadata.
 *
 * Same `media_library.media.read` guard, and the same reachability note as
 * `index.ts`: this key was seeded-but-inert until ADR-0026 step 5.
 *
 * `includeDeleted=true` is supported here (it is not a separate permission) so a
 * caller holding `read` can inspect a soft-deleted object — which is what any
 * "restore this?" confirmation flow needs before calling
 * `POST /{id}/restore`. Soft-deleted rows are excluded by default so the common
 * case cannot accidentally surface a deleted object as if it were live.
 */

const READ_GUARD = {
  moduleKey: "media_library",
  activityCode: "media",
  action: "read" as const
};

const DELETE_GUARD = {
  moduleKey: "media_library",
  activityCode: "media",
  action: "delete" as const
};

export const GET: APIRoute = async ({ request, cookies, params, url }) => {
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

  const sql = getDatabaseClient();
  const tokenHash = hashSessionToken(token);
  const now = new Date();

  return withTenant<Response>(sql, tenantId, async (tx) => {
    const auth = await authorizeInTransaction(
      tx,
      tenantId,
      tokenHash,
      now,
      READ_GUARD
    );

    if (!auth.allowed) {
      return auth.denied;
    }

    const object = await fetchNewsMediaObjectById(tx, tenantId, objectId, {
      includeDeleted: url.searchParams.get("includeDeleted") === "true"
    });

    // `fetchNewsMediaObjectById` is tenant-scoped by its own `tenantId`
    // parameter, so another tenant's id resolves to `null` here and returns the
    // same 404 a nonexistent id does — never a 403, which would confirm the id
    // exists somewhere.
    if (!object) {
      return fail(404, "NOT_FOUND", "Media object not found.");
    }

    return ok({ object: toResponse(object) });
  });
};

/**
 * `DELETE /api/v1/media/objects/{id}` (ADR-0026 step 5) — soft delete.
 *
 * First route to enforce `media_library.media.delete`. `reason` is required,
 * matching `DELETE /api/v1/blog/posts/{id}` / `/profiles/{id}` /
 * `/email/templates/{id}`: a soft delete is reversible but still removes an
 * image from live content, so the audit trail must record why. No
 * `Idempotency-Key` — same as every other soft-delete route here; the operation
 * is naturally idempotent (a second call finds nothing undeleted and 409s).
 *
 * Deliberately does NOT detach first. A soft-deleted object keeps its
 * `owner_resource_type`/`owner_resource_id`, which is what lets
 * `POST /{id}/restore` genuinely undo the delete rather than half-undo it into a
 * detached state. The consequence is that content can hold a reference to a
 * soft-deleted object — and that is exactly what the media reference gate
 * (`blog_content`'s `news-media-reference-gate.ts`) catches, because
 * `isNewsMediaObjectSafeForPublicReference` excludes deleted objects.
 */
export const DELETE: APIRoute = async ({ request, cookies, params }) => {
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

  const bodyRead = await readJsonBody(request);

  if (bodyRead.tooLarge) {
    return bodyTooLargeResponse(bodyRead.limitBytes);
  }

  const body = (bodyRead.value ?? {}) as Record<string, unknown>;
  const reason = body.reason;

  if (typeof reason !== "string" || reason.trim() === "") {
    return fail(400, "VALIDATION_ERROR", "reason is required.");
  }

  const sql = getDatabaseClient();
  const tokenHash = hashSessionToken(token);
  const now = new Date();

  return withTenant<Response>(sql, tenantId, async (tx) => {
    const auth = await authorizeInTransaction(
      tx,
      tenantId,
      tokenHash,
      now,
      DELETE_GUARD
    );

    if (!auth.allowed) {
      return auth.denied;
    }

    const deleted = await softDeleteNewsMediaObject(
      tx,
      tenantId,
      auth.context.tenantUserId,
      objectId,
      reason.trim()
    );

    if (!deleted) {
      const failure = await explainMediaLifecycleFailure(
        tx,
        tenantId,
        objectId,
        "a media object that is not already deleted"
      );
      return fail(failure.status, failure.code, failure.message);
    }

    return ok({ deleted: true, id: objectId });
  });
};
