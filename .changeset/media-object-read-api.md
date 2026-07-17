---
"awcms-micro": minor
---

Add the media object read API — `GET /api/v1/media/objects` and `GET /api/v1/media/objects/{id}` (ADR-0026 step 5).

These are the first routes to enforce `media_library.media.read`, which has been declared and seeded since Issue #634 while nothing checked it. A tenant that already granted `read` to a role gains real read access the moment this ships — the key was a contract waiting to be implemented, not a name being coined. `tests/unit/media-permission-reachability.test.ts` failed by name when this landed, exactly as designed, and now records that 4 of 9 media permissions are reachable (`attach`, `detach`, `delete`, `restore`, `purge` remain inert, each with a working application function and no route).

- Bounded list (default 20, max 100), newest-first, soft-deleted excluded unless `includeDeleted=true`. Filters: `status`, `ownerResourceType` + `ownerResourceId` (the "which media is attached to this post?" lookup), all index-backed by `sql/041`.
- Unknown filter values are a 400, never a silently-empty list — a typo must not read as "you have no media".
- Responses omit `objectKey`/`bucketName`/`storageDriver`/`checksumSha256`: physical-storage detail no consumer needs, which would narrow the search space for anyone probing the bucket. `publicUrl` is the supported way to reach the bytes.
- Another tenant's id returns 404, not 403 — a 403 would confirm the id exists.

**Corrects ADR-0026's own evidence.** The ADR argued the registry was already generic by citing `module_key text NOT NULL DEFAULT 'news_portal'` as "a column with no reason to exist unless designed to serve multiple modules". That missed `sql/041`'s `CHECK (module_key = 'news_portal')`, which forbids every other value — and `createPendingNewsMediaObject` never sets the column, so every media object is stamped `news_portal` regardless of which module it serves. The real discriminator is `owner_resource_type`. The ADR's conclusion stands; its evidence is now accurate. `awcms-mini` carries the identical CHECK, so this is inherited upstream shape.

Consequently the list offers no `moduleKey` filter: it could only ever match one value, and an API must not document a filter that lies. A new integration test pins the constraint against real PostgreSQL and fails if a future migration relaxes it, forcing whoever does so to state the new allowed set and restore the filter.
