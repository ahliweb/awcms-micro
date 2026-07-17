---
"awcms-micro": minor
---

Invert media capability ownership: `media_library` now provides the media port, and a site can have managed media without a news portal (ADR-0026 steps 3-4).

The `news_media` capability is **retired**. `media_library` provides `media_library` (`_shared/ports/media-library-port.ts`) instead, and `news_portal` — which only ever provided the old one because the media registry happened to be born inside it — is now a consumer like `blog_content` and `social_publishing`.

Steps 3 and 4 were planned separately but landed as one, because the coupling lived in the port CONTRACT rather than the adapter: `NewsMediaPort.isFullOnlineR2ModeActiveForTenant` asked a `news_portal` editorial question, so renaming the port without splitting the contract would have inverted nothing.

- **Closes the product gap.** "Must this tenant's media references be registry-backed?" is now a media question, answered from `media_library`'s own readiness (`domain/managed-media-readiness.ts`) and its own per-tenant flag (`sql/078`). `news_portal`'s R2-only preset is one WRITER of that flag, not its owner — so a brochure site (`blog_content` + `tenant_domain`, no news portal) can have managed media, which was previously unreachable by construction.
- **No enforcement is lost on deploy.** `sql/078` backfills from `awcms_micro_news_portal_tenant_state`, so every tenant that applied the R2-only preset keeps enforcement, with its original timestamp. Without the backfill this refactor would have silently switched media validation OFF for exactly the tenants who opted into it.
- **Breaking for derived repositories** pinning the `news_media` capability: it is removed from `CAPABILITY_CONTRACT_VERSIONS` rather than MAJOR-bumped, so a stale pin fails to resolve outright instead of binding to a port that no longer asks what it asked.

Still open (step 5): no `media_library`-owned preset/endpoint exists to turn the flag on, so a brochure site's operator has no button yet. That must not be solved via `awcms_micro_module_settings` — it is tenant-writable through a generic endpoint, which would let a tenant disable its own media validation.
