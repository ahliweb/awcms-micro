---
"awcms-micro": minor
---

Add responsive image `srcset` to public content rendering (ADR-0026 step 5b) — the last item on the media-library admission roadmap, and a standalone feature rather than debt repayment.

The `srcset` is computed **purely at render time** through Cloudflare's on-the-fly image resizing (`/cdn-cgi/image/...`): no transcoder library, no stored variant objects, no async job, no new table. ADR-0026 §4/§5 originally sketched variants as a CLAIM/UPLOAD/FINALIZE job; step 5b deliberately takes the other road, recorded in the ADR. The trade — leaning on one provider's edge feature — is stated openly and made opt-in.

The builder lives in `_shared/rendering/responsive-image.ts` (neutral ground, no I/O, imports neither module's `application`/`domain` tree) so both `blog_content` and `news_portal` public rendering call it without re-coupling — the same rule `gallery-block-renderer.ts` follows. `media-library/application/media-responsive-image.ts` is the single place that resolves the env config into the transform, so no public route re-derives when resizing is on.

Eligibility is strict, because `/cdn-cgi/image/` is served by the zone transforming a source on the same zone: a URL is rewritten **only** when its origin matches the configured public base URL exactly (an external/legacy gallery `url` is left untouched) and its path ends in a resizable raster extension (`.jpg/.jpeg/.png/.webp`). `.gif` is excluded so an animated GIF is never silently de-animated to one frame; `.pdf`/`.svg` are not images. `fit=scale-down` never upscales a genuinely small original.

Opt-in via `NEWS_MEDIA_R2_IMAGE_RESIZING_ENABLED` (default `false`), and the flag alone is not enough — it only works when `NEWS_MEDIA_R2_PUBLIC_BASE_URL` is a real custom domain on a Cloudflare zone with Image Resizing turned on. `security:readiness` gains `checkNewsMediaR2ImageResizingSafe` (warning) that flags the flag-on-but-base-URL-unsuitable combination before go-live, and — since it cannot read the zone's dashboard toggle — keeps a confirm-this reminder on the board even when the base URL is fine.

`srcset` is purely additive: `src` stays the original URL, so with resizing off (or a browser ignoring `srcset`) every call site renders byte-for-byte its pre-5b HTML. The `imageTransform` argument on `renderContentJsonToHtml`/`renderGalleryBlockHtml` defaults to a no-op, so every existing caller is unchanged.
