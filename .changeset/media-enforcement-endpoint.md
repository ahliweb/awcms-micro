---
"awcms-micro": minor
---

Add the managed-media enforcement switch: `GET`/`POST /api/v1/media/enforcement` (ADR-0026 step 5a).

Steps 3-4 made a brochure site (`blog_content` + `tenant_domain`, no news portal) able to have managed media architecturally, but left the flag writable only by `news_portal`'s R2-only preset — the operator had the capability and no button. This is the button, and it pays off the debt those steps recorded.

- **`POST /api/v1/media/enforcement`** turns enforcement on for the caller's tenant, gated by the new `media_library.enforcement.enable` permission (`sql/079`) and a deployment-readiness check. Rejects `409 MANAGED_MEDIA_NOT_READY` (not 400) when the deployment's media storage is not configured — the request is fine; the deployment is what must change. Idempotent, no `Idempotency-Key` needed.
- **`GET /api/v1/media/enforcement`** reports whether enforcement is active and, when it cannot be enabled, why — naming environment variables, never their values. Gated by `media_library.enforcement.read`.
- **`enforcement` is a separate activity code from `media`**, deliberately: `media.*` governs individual objects, `enforcement.*` governs a tenant-wide content policy. Folding it into `media.create` would hand the policy switch to every editor who uploads images.

**Enforcement is one-way and must stay one-way.** There is no `disable` action, no "unmark" function, and no code path that deletes from `awcms_micro_media_library_tenant_state`. This is a security property, not an unfinished API: `sql/043`'s header records that the earlier design was confirmed exploitable end-to-end precisely because a tenant could clear its own marker and silently switch off all of its media validation. Four independent guards pin this, verified to fail when a disable path is re-introduced. A deployment that must roll back changes its `NEWS_MEDIA_R2_*` config — an operator act outside the tenant's reach.

Existing tenants do not retroactively gain the new permissions (the standard limitation of every permission-seed migration here); only tenants created after `sql/079` runs get them via setup.
