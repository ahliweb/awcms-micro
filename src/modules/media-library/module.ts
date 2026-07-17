import { defineModule } from "../_shared/module-contract";
import { MEDIA_PERMISSION_ACTIVITY_CODE } from "./domain/media-permissions";

/**
 * ADR-0026 steps 2-4 of 5 — this module OWNS the tenant media registry AND the
 * capability every website module consumes to use it.
 *
 * Step 2 moved the registry here: the presigned upload/finalize/cancel flow, MIME
 * sniffing, object-key derivation, R2 config + client, verification, and
 * reconciliation, plus the 9 media permissions (`media_library.media.*`, sql/077).
 *
 * Steps 3-4 finished the inversion. `news_portal` no longer provides `news_media`
 * — that capability is retired, and `media_library` is `media-library-port.ts`'s
 * sole provider (`application/media-library-port-adapter.ts`, which imports only
 * this module). Step 2 had deliberately left the old adapter in `news_portal`
 * because it read that module's R2-only editorial state; steps 3 and 4 turned out
 * to be one job, because that coupling lived in the PORT CONTRACT itself
 * (`isFullOnlineR2ModeActiveForTenant`), so renaming the port without splitting
 * the contract would have inverted nothing.
 *
 * The split: "must this tenant's media references be registry-backed?" is a MEDIA
 * question, answered here from this module's own deployment readiness
 * (`domain/managed-media-readiness.ts`) and its own per-tenant flag
 * (`application/media-library-tenant-state.ts`, sql/078). `news_portal`'s R2-only
 * preset is now one WRITER of that flag rather than its owner — which is what
 * lets a brochure site have managed media without switching on a news portal, the
 * product gap ADR-0026 was actually written to close.
 *
 * `dependencies` excludes `news_portal`/`blog_content` permanently, not
 * incidentally: media must never depend on its own consumers.
 */
export const mediaLibraryModule = defineModule({
  key: "media_library",
  name: "Media Library",
  version: "0.2.0",
  status: "active",
  description:
    "Tenant-scoped media object registry and upload flow, reusable by every website module (ADR-0026, System Foundation). Owns `awcms_micro_news_media_objects` (`sql/041`/`042`/`046`) — a generic registry keyed by `module_key` with `owner_resource_type`/`owner_resource_id` references, direct-to-storage presigned upload with real magic-byte MIME sniffing and server-side checksum verification, orphan lifecycle, and storage reconciliation. The table keeps its `news_media` name deliberately (ADR-0026 §3): it is referenced by three migrations and the whole application layer, and `module_key` is the real owner discriminator, so renaming would trade a cosmetic annoyance for real risk. Provides the `media_library` capability (`_shared/ports/media-library-port.ts`) consumed by `blog_content`, `news_portal`, and `social_publishing`: media reference safety, resolution, and whether managed-media enforcement is active for a tenant (this module's own readiness plus its own per-tenant flag, `sql/078`) — so a brochure site gets managed media without a news portal. `news_portal` retains only what is genuinely its own: the R2-only editorial preset, homepage sections, and ad placements. This module never transcodes bytes inside a DB transaction (ADR-0006), and is deliberately not a CDN, image proxy, or DAM.",
  dependencies: ["tenant_admin", "identity_access"],
  type: "system",
  // ADR-0026 steps 3-4 — sole provider of the `media_library` capability
  // (`_shared/ports/media-library-port.ts`, implemented by
  // `application/media-library-port-adapter.ts`, wired at each route's
  // composition root). Consumed by `blog_content` and `social_publishing`
  // (optional — their media handling no-ops when enforcement is off) and by
  // `news_portal` (required — its ad placements hold a real FK to a media
  // object).
  //
  // `consumes` stays empty and must remain so: this module answers media
  // questions from its own registry, its own readiness, and its own per-tenant
  // flag. A System Foundation module consuming a domain capability would be the
  // ADR-0013 §1 inversion this extraction exists to remove.
  capabilities: {
    provides: ["media_library"]
  },
  api: {
    openApiPath: "openapi/awcms-micro-public-api.openapi.yaml",
    basePath: "/api/v1/media/news-images"
  },
  permissions: [
    {
      activityCode: MEDIA_PERMISSION_ACTIVITY_CODE,
      action: "create",
      description:
        "Create a pending media object / start a presigned upload session"
    },
    {
      activityCode: MEDIA_PERMISSION_ACTIVITY_CODE,
      action: "read",
      description: "Read media object metadata"
    },
    {
      activityCode: MEDIA_PERMISSION_ACTIVITY_CODE,
      action: "verify",
      description: "Finalize/verify an uploaded media object"
    },
    {
      activityCode: MEDIA_PERMISSION_ACTIVITY_CODE,
      action: "attach",
      description: "Attach a verified media object to an owning resource"
    },
    {
      activityCode: MEDIA_PERMISSION_ACTIVITY_CODE,
      action: "detach",
      description: "Detach a media object from its owning resource"
    },
    {
      activityCode: MEDIA_PERMISSION_ACTIVITY_CODE,
      action: "delete",
      description: "Soft delete media object metadata"
    },
    {
      activityCode: MEDIA_PERMISSION_ACTIVITY_CODE,
      action: "restore",
      description: "Restore a soft-deleted media object"
    },
    {
      activityCode: MEDIA_PERMISSION_ACTIVITY_CODE,
      action: "purge",
      description: "Hard purge an already soft-deleted media object"
    },
    {
      activityCode: MEDIA_PERMISSION_ACTIVITY_CODE,
      action: "cancel",
      description: "Cancel one's own not-yet-uploaded media upload session"
    }
  ]
});
