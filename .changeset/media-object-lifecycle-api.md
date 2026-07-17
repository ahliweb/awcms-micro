---
"awcms-micro": minor
---

Add the media object lifecycle API — attach, detach, soft delete, restore, purge (ADR-0026 step 5). **All 9 media permissions are now reachable; the seeded-but-inert gap is closed.**

`attach`, `detach`, `delete`, `restore`, and `purge` were declared and seeded by Issue #634 with working application functions behind them (Issue #633 built the whole directory) and no route, so granting one conferred nothing. They confer real authority now — a tenant that already granted `media_library.media.purge` gains real purge access with this release.

- `POST /{id}/attach` — `verified -> attached`. Does not check the owning resource exists: `media_library` never reads another module's tables (ADR-0013 §6), and `ownerResourceId` is deliberately not a foreign key for the same reason.
- `POST /{id}/detach` — `attached -> verified`. Its own permission, separate from `attach`: detaching strips an image from live content, so a role may add media without being allowed to remove it from a published article.
- `DELETE /{id}` — soft delete, `reason` required (same convention as `DELETE /api/v1/blog/posts/{id}`). Deliberately does not detach first, so the owner reference survives and restore genuinely undoes the delete.
- `POST /{id}/restore` — undoes a soft delete into the object's prior state.
- `POST /{id}/purge` — irreversible, and requires a prior soft delete. Purge is not a shortcut for delete: two deliberate acts under two distinct permissions before anything becomes irreversible.

**Purge does not delete the stored object, and cannot.** It drops the metadata row; the bytes are swept asynchronously by `news-media:r2:reconcile` once older than the orphan grace period. Deleting from R2 is a provider call and must never happen inside a DB transaction (ADR-0006) — the async sweep is the design this repo already chose, documented in `media-reconciliation-categorization.ts`. The object stays publicly reachable at its `publicUrl` until then; the OpenAPI says so plainly rather than implying otherwise.

Wrong-state transitions return **409 naming the object's actual state, never 404** — telling a caller their object "does not exist" when it is merely already attached sends them looking in the wrong place. All mutating routes require `Idempotency-Key`.

`AccessAction` gains `attach`/`detach`, following this repo's established "seed the permission first, add the action when a real endpoint needs it" pattern (`verify`, `set_primary`, `preview`). Neither is high-risk: each is reversible by its counterpart and touches no credential-bearing state.
