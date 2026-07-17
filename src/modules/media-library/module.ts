import { defineModule } from "../_shared/module-contract";
import { MEDIA_PERMISSION_ACTIVITY_CODE } from "./domain/media-permissions";

/**
 * ADR-0026 step 2 of 5 — this module now OWNS the tenant media registry.
 *
 * Step 1 registered it `experimental` as the declared owner while the code still
 * lived in `news_portal`. That is no longer true: the registry, its presigned
 * upload/finalize/cancel flow, MIME sniffing, object-key derivation, R2 config +
 * client, verification, and reconciliation all live here now, and the 9 media
 * permissions moved with them (`media_library.media.*`, `sql/077`). So the status
 * flips to `active` — it is describing reality, not intent.
 *
 * What deliberately did NOT move: `news-media-port-adapter.ts` stays in
 * `news_portal`, because it is not a media concern — it composes THIS module's
 * registry with `news_portal`'s own R2-only editorial policy
 * (`news-portal-tenant-state.ts`, `news-portal-preset-readiness.ts`). Moving it
 * would have made `media_library` import `news_portal`, i.e. a System Foundation
 * module depending on a domain module — the exact ADR-0013 §1 inversion this
 * extraction exists to remove. Typecheck caught that attempt immediately.
 *
 * Still open, and why this module is not yet the whole answer (ADR-0026 §Konsekuensi):
 * media remains reachable only through `news_portal`'s R2-only gate, so a brochure
 * site still has no managed media. Steps 3-4 rewire the consumers and unhook that
 * gate; step 5 adds image variants, non-image types, and an admin browser.
 * `capabilities` stays undeclared until step 3 introduces the `media_library` port
 * that supersedes `news_media` — declaring it now would assert a binding nothing
 * implements.
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
    "Tenant-scoped media object registry and upload flow, reusable by every website module (ADR-0026, System Foundation). Owns `awcms_micro_news_media_objects` (`sql/041`/`042`/`046`) — a generic registry keyed by `module_key` with `owner_resource_type`/`owner_resource_id` references, direct-to-storage presigned upload with real magic-byte MIME sniffing and server-side checksum verification, orphan lifecycle, and storage reconciliation. The table keeps its `news_media` name deliberately (ADR-0026 §3): it is referenced by three migrations and the whole application layer, and `module_key` is the real owner discriminator, so renaming would trade a cosmetic annoyance for real risk. `news_portal` retains only what is genuinely its own — the R2-only editorial policy and its port adapter composing that policy with this registry — plus homepage sections and ad placements. This module never transcodes bytes inside a DB transaction (ADR-0006), and is deliberately not a CDN, image proxy, or DAM.",
  dependencies: ["tenant_admin", "identity_access"],
  type: "system",
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
