/**
 * Permission KEY CONSTANTS for the R2-only news media registry (Issue #633).
 * These are documentation/constants ONLY — this file does not touch
 * `module.ts`'s `permissions` array and does not insert any row into
 * `awcms_micro_permissions`.
 *
 * Why not wired up yet: `news_portal`'s own `module.ts` deliberately leaves
 * `permissions`/`navigation`/`api`/`settings`/`jobs`/`health` undeclared
 * until the corresponding feature is real (same convention `visitor_analytics`
 * used, Issue #617; see `module.ts`'s own descriptor comment). Issue #633
 * adds domain/application helpers only — no HTTP endpoint exists yet to
 * enforce these permissions, so declaring them in the module descriptor now
 * would sync permission rows into `awcms_micro_permissions` with nothing
 * that ever checks them, which is misleading (a permission that "exists"
 * but is unreachable). Issue #634 (direct-to-R2 presigned upload flow) is
 * expected to be the first issue that adds real endpoints — it MUST reuse
 * these exact string constants (not invent new ones) when declaring
 * `module.ts`'s `permissions` array and calling `authorizeInTransaction`
 * (skill `awcms-micro-abac-guard`).
 *
 * `activityCode` follows this module's own resource shape (`media`, plural
 * dropped to match e.g. `blog_content`'s `posts`/`pages` activity codes),
 * `action` follows the same verb set already used elsewhere in this repo for
 * a soft-deletable resource with an attach/detach lifecycle
 * (`blog_content`'s `posts.create`/`.update`/`.delete`/`.restore`/`.purge`).
 */
export const MEDIA_PERMISSION_ACTIVITY_CODE = "media";

export const MEDIA_PERMISSIONS = {
  /** Create a pending media object metadata record (also gates starting a presigned upload session, Issue #634). */
  create: "media_library.media.create",
  /** Read media object metadata (list/detail). */
  read: "media_library.media.read",
  /** Mark an uploaded object verified (MIME/checksum/dimension check passed) — also gates the finalize endpoint, Issue #634. */
  verify: "media_library.media.verify",
  /** Attach a verified media object to an owning blog/news resource. */
  attach: "media_library.media.attach",
  /** Detach a media object from its current owning resource. */
  detach: "media_library.media.detach",
  /** Soft delete media object metadata. */
  delete: "media_library.media.delete",
  /** Restore a soft-deleted media object. */
  restore: "media_library.media.restore",
  /** Hard purge an already soft-deleted media object. */
  purge: "media_library.media.purge",
  /**
   * Abort one's own not-yet-uploaded upload session (Issue #634). New in
   * this issue — #633's original set (create/read/verify/attach/detach/
   * delete/restore/purge) had no "cancel" concept yet because no upload
   * session existed. Reuses the existing `AccessAction` union member
   * `"cancel"` (`identity-access/domain/access-control.ts`, already used by
   * sync/POS cancel flows) — a distinct permission from `delete` because
   * cancelling a `pending_upload` session (nothing was ever verified/
   * attached) is a materially lower-risk action than soft-deleting a real,
   * previously-verified media object.
   */
  cancel: "media_library.media.cancel"
} as const;

export type NewsMediaPermissionKey = keyof typeof MEDIA_PERMISSIONS;
export type NewsMediaPermissionValue =
  (typeof MEDIA_PERMISSIONS)[NewsMediaPermissionKey];
