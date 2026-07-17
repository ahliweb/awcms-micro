---
"awcms-micro": patch
---

Record that 6 of the 9 declared `media_library.media.*` permissions are seeded but unreachable, and pin the fact with a test.

`module.ts` declares 9 media permissions and `sql/042`/`sql/077` seed all of them, but only `create`, `verify`, and `cancel` have a guard. `read`, `attach`, `detach`, `delete`, `restore`, and `purge` are grantable authority that confers nothing — no endpoint exists. This is exactly what `media-permissions.ts`'s original header warned against ("a permission that 'exists' but is unreachable") before Issue #634 declared the full set while shipping only the upload flow.

Documentation and a test only — no behaviour change. It matters because the inert grants become meaningful the moment ADR-0026 step 5's media object API lands: a tenant that granted `media_library.media.purge` today would silently gain real purge authority then. That step must treat these keys as a contract it is implementing, not as free naming.

`tests/unit/media-permission-reachability.test.ts` makes this mechanical: adding a route that guards `media.read` fails the test by name, forcing whoever lands it to update the list and read the header. It scans all of `src/` rather than just `src/pages/` — `verify`'s guard lives in the application layer while its route delegates, and an audit that only looked at route files reported it as unenforced, a false finding this scope prevents repeating.

Also corrects this session's own earlier revision of that header, which claimed all 9 were enforced.
