import type { APIRoute } from "astro";

import { fail, ok } from "../../../../../modules/_shared/api-response";
import { getDatabaseClient } from "../../../../../lib/database/client";
import { withTenant } from "../../../../../lib/database/tenant-context";
import {
  authorizeInTransaction,
  resolveAuthInputs
} from "../../../../../modules/identity-access/application/access-guard";
import { hashSessionToken } from "../../../../../lib/auth/session-token";
import { fetchNewsMediaObjectById } from "../../../../../modules/media-library/application/media-object-directory";
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
