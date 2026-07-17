---
"awcms-micro": minor
---

Add the media library admin browser at `/admin/media` (ADR-0026 step 5d) — the first UI for the media registry `media_library` owns, and this module's first `navigation` entry (gated on `media_library.media.read`, order 45).

Lists every media object with its thumbnail, status, dimensions and — the point of the screen — its id, which `admin/news-portal/ad-placements.astro` previously required an editor to type as a UUID with no way to find it short of a database query. Filters by status/owner type/include-deleted, mirroring `GET /api/v1/media/objects`'s own defaults. Lifecycle actions (attach/detach/delete/restore/purge) call the real guarded endpoints with a fresh `Idempotency-Key` per attempt rather than reimplementing their rules in page frontmatter; a button renders only when the permission is held and the status admits the transition, which is UX courtesy on top of the server's enforcement, never instead of it.

Also maps two error codes that were never translated: `NOT_FOUND` (used by 17 routes, 16 of which predate the media work — all of them previously fell through to an English-only raw message) and `INVALID_MEDIA_STATUS`. Unifying `NOT_FOUND` with the canonical `RESOURCE_NOT_FOUND` is deliberately left out — that changes 17 endpoints' response bodies and needs its own PR and OpenAPI diff.
