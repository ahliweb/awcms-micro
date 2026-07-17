/**
 * Permission KEY CONSTANTS for the media registry (Issue #633).
 *
 * All 9 are declared in `module.ts`'s `permissions` array and seeded into
 * `awcms_micro_permissions` (`sql/042`, ownership moved to `media_library` by
 * `sql/077` when ADR-0026 step 2 extracted this module).
 *
 * ## All 9 are reachable — the seeded-but-inert gap is closed (ADR-0026 step 5)
 *
 * Every key below is enforced by a route via `authorizeInTransaction` (skill
 * `awcms-micro-abac-guard`): `create` (upload-sessions), `verify` (finalize —
 * its guard lives in `application/media-finalize-upload-session.ts`, not the
 * route file, which delegates to it), `cancel`, `read` (`GET /api/v1/media/objects`
 * + `/{id}`), and `attach`/`detach`/`delete`/`restore`/`purge` (the lifecycle
 * API).
 *
 * It was not always so, and the history is the point. Issue #633 built the whole
 * application directory; Issue #634 declared all 9 permissions while wiring only
 * the upload flow. That left 6 of them grantable authority that conferred
 * nothing — a tenant could grant `media_library.media.purge` for no effect — sitting
 * on top of working code, which is exactly what this file's ORIGINAL header
 * warned against before the descriptor declared them:
 *
 * > declaring them in the module descriptor now would sync permission rows into
 * > `awcms_micro_permissions` with nothing that ever checks them, which is
 * > misleading (a permission that "exists" but is unreachable)
 *
 * `awcms-mini` still has the identical 9-declared/3-enforced shape, so this was
 * inherited upstream, not invented here.
 *
 * `tests/unit/media-permission-reachability.test.ts` is what closed it: it made
 * the gap a fact the suite knew, and failed by name as each route landed. Keep
 * it that way — declare a permission in the same change that routes it, or the
 * test will ask you why not.
 *
 * This file remains the single source for the key strings: `module.ts`, the
 * guards, and `tests/modules/media-library-module.test.ts`'s parity assertion
 * all derive from it, so a key can never drift between the descriptor and the
 * code that checks it. Anything needing a media permission MUST reuse these
 * constants rather than re-typing the string.
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

/**
 * Managed-media ENFORCEMENT permissions (ADR-0026 step 5a, `sql/079`) — a
 * separate activity code from `media` above, deliberately.
 *
 * `media.*` governs individual media OBJECTS (upload this file, delete that
 * row). `enforcement.*` governs a tenant-wide POLICY: whether content may
 * reference media by raw URL at all. Those are different blast radii, so they
 * must be separately grantable — an editor who uploads images all day has no
 * business flipping the tenant's content-validation policy, and folding this
 * into `media.create` would have granted exactly that to every such editor.
 *
 * There is deliberately **no `disable` action, and there never may be.** See
 * `application/enable-managed-media-enforcement.ts` for the full reasoning: a
 * tenant able to turn its own media validation OFF is precisely the exploit
 * `sql/043`'s header documents as confirmed-exploitable in review. Enforcement
 * is one-way by construction, not by permission configuration — an operator who
 * genuinely must roll it back does so through a deployment-level change, which
 * is an auditable, deliberate act rather than a self-service button.
 */
export const MEDIA_ENFORCEMENT_PERMISSION_ACTIVITY_CODE = "enforcement";

export const MEDIA_ENFORCEMENT_PERMISSIONS = {
  /** Read whether managed-media enforcement is active for this tenant, and why it can/cannot be enabled. */
  read: "media_library.enforcement.read",
  /** Turn managed-media enforcement ON for this tenant. One-way — see above. */
  enable: "media_library.enforcement.enable"
} as const;

export type MediaEnforcementPermissionKey =
  keyof typeof MEDIA_ENFORCEMENT_PERMISSIONS;
export type MediaEnforcementPermissionValue =
  (typeof MEDIA_ENFORCEMENT_PERMISSIONS)[MediaEnforcementPermissionKey];
