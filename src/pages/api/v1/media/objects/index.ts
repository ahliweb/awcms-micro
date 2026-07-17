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
  isNewsMediaObjectStatus,
  isNewsMediaOwnerResourceType,
  listNewsMediaObjects,
  NEWS_MEDIA_OBJECT_STATUSES,
  NEWS_MEDIA_OWNER_RESOURCE_TYPES,
  type NewsMediaObjectStatus,
  type NewsMediaOwnerResourceType,
  type NewsMediaObjectView
} from "../../../../../modules/media-library/application/media-object-directory";

/**
 * `GET /api/v1/media/objects` — list this tenant's media objects, newest first.
 *
 * ## Why this route exists (ADR-0026 step 5)
 *
 * `media_library.media.read` has been declared in `module.ts` and seeded into
 * `awcms_micro_permissions` since Issue #634, but nothing ever checked it: the
 * only media routes were the upload flow, so `read` was grantable authority that
 * conferred nothing (see `domain/media-permissions.ts`'s header, and
 * `tests/unit/media-permission-reachability.test.ts`, which pins exactly which
 * keys are reachable). This route is the first thing to enforce it, which means
 * `read` grants that already exist in a tenant's roles start meaning something
 * the moment this ships — the key is a contract being implemented here, not a
 * name being coined.
 *
 * The application layer this delegates to (`listNewsMediaObjects`) is likewise
 * not new work: Issue #633 built the whole directory (fetch/attach/detach/
 * soft-delete/restore/purge) and Issue #634 wired only the upload flow to HTTP.
 *
 * `awcms-mini` has no counterpart to copy — it has the identical
 * 9-declared/3-enforced media gap. The shape here follows this repo's own
 * bounded-list convention (`blog-post-directory.ts`, `party-directory.ts`)
 * rather than mini's `document-infrastructure` list, which caps at a hard 200
 * with no caller-supplied limit.
 */

const READ_GUARD = {
  moduleKey: "media_library",
  activityCode: "media",
  action: "read" as const
};

type TxResult =
  | { kind: "response"; response: Response }
  | { kind: "ok"; objects: NewsMediaObjectView[] };

export const GET: APIRoute = async ({ request, cookies, url }) => {
  const { tenantId, token } = resolveAuthInputs(request, cookies);

  if (!tenantId) {
    return fail(400, "TENANT_REQUIRED", "Tenant header is required.");
  }

  if (!token) {
    return fail(401, "AUTH_REQUIRED", "Authentication required.");
  }

  // Validate every filter BEFORE authorizing/opening a transaction. An unknown
  // status would otherwise be silently coerced to "matches nothing" and return
  // an empty list, which reads to a caller as "you have no media" rather than
  // "you sent a typo".
  const statusParam = url.searchParams.get("status");
  let status: NewsMediaObjectStatus | undefined;

  if (statusParam !== null) {
    if (!isNewsMediaObjectStatus(statusParam)) {
      return fail(
        400,
        "VALIDATION_ERROR",
        `status must be one of ${NEWS_MEDIA_OBJECT_STATUSES.join(", ")}.`
      );
    }
    status = statusParam;
  }

  const ownerTypeParam = url.searchParams.get("ownerResourceType");
  let ownerResourceType: NewsMediaOwnerResourceType | undefined;

  if (ownerTypeParam !== null) {
    if (!isNewsMediaOwnerResourceType(ownerTypeParam)) {
      return fail(
        400,
        "VALIDATION_ERROR",
        `ownerResourceType must be one of ${NEWS_MEDIA_OWNER_RESOURCE_TYPES.join(", ")}.`
      );
    }
    ownerResourceType = ownerTypeParam;
  }

  const limitParam = url.searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : undefined;

  if (
    limitParam !== null &&
    (!Number.isFinite(limit) || (limit as number) < 1)
  ) {
    return fail(400, "VALIDATION_ERROR", "limit must be a positive number.");
  }

  const sql = getDatabaseClient();
  const tokenHash = hashSessionToken(token);
  const now = new Date();

  const result = await withTenant<TxResult>(sql, tenantId, async (tx) => {
    const auth = await authorizeInTransaction(
      tx,
      tenantId,
      tokenHash,
      now,
      READ_GUARD
    );

    if (!auth.allowed) {
      return { kind: "response", response: auth.denied };
    }

    const objects = await listNewsMediaObjects(tx, tenantId, {
      status,
      ownerResourceType,
      ownerResourceId: url.searchParams.get("ownerResourceId") ?? undefined,
      includeDeleted: url.searchParams.get("includeDeleted") === "true",
      limit
    });

    return { kind: "ok", objects };
  });

  if (result.kind === "response") {
    return result.response;
  }

  return ok({ objects: result.objects.map(toResponse) });
};

/**
 * Deliberately omits `bucketName`/`objectKey`/`storageDriver` and every
 * `checksumSha256` byte: those describe where the object physically lives in R2,
 * which is infrastructure detail no API consumer needs and which narrows the
 * search space for anyone probing the bucket. `publicUrl` is the supported way
 * to reach the bytes. Timestamps are ISO strings — `Date` would serialize
 * inconsistently across the two routes.
 */
export function toResponse(object: NewsMediaObjectView) {
  return {
    id: object.id,
    moduleKey: object.moduleKey,
    ownerResourceType: object.ownerResourceType,
    ownerResourceId: object.ownerResourceId,
    originalFilename: object.originalFilename,
    publicUrl: object.publicUrl,
    mimeType: object.mimeType,
    sizeBytes: object.sizeBytes,
    width: object.width,
    height: object.height,
    altText: object.altText,
    caption: object.caption,
    status: object.status,
    createdAt: object.createdAt.toISOString(),
    updatedAt: object.updatedAt.toISOString(),
    deletedAt: object.deletedAt ? object.deletedAt.toISOString() : null,
    deleteReason: object.deleteReason,
    restoredAt: object.restoredAt ? object.restoredAt.toISOString() : null
  };
}
