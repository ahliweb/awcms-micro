/**
 * Pure responsive-image `srcset` builder (ADR-0026 step 5b). Neutral ground,
 * same rules as `gallery-block-renderer.ts`: it imports from NEITHER module's
 * `application`/`domain` tree and performs no I/O, so both `blog_content` and
 * `news_portal` public rendering can call it without re-coupling.
 *
 * ## What this does, and the one it deliberately does NOT
 *
 * ADR-0026 §4/§5 originally sketched image variants as an ASYNC job that
 * transcodes derivative objects and stores them in R2 (the CLAIM/UPLOAD/FINALIZE
 * shape `sync_storage` uses). Step 5b takes the other road, on an explicit
 * decision recorded in the ADR: Cloudflare's on-the-fly image resizing
 * (`/cdn-cgi/image/...`). No transcoder library, no stored variant objects, no
 * job, no new table — the `srcset` URLs are computed purely at render time and
 * Cloudflare's edge produces the bytes on first request.
 *
 * The trade the ADR names openly: this leans on one provider's edge feature
 * (§5's "jangan kunci satu provider" is knowingly bent here), and it only works
 * when `NEWS_MEDIA_R2_PUBLIC_BASE_URL` is a real custom domain on the Cloudflare
 * zone with Image Resizing enabled. That is why it is opt-in
 * (`imageResizingEnabled`) and why `security:readiness` warns when the flag is
 * on but the base URL cannot support it.
 *
 * ## Why the eligibility rules are strict
 *
 * `/cdn-cgi/image/` is served by the ZONE, transforming a source that lives on
 * the same zone. Rewriting a URL that points somewhere else would either 404 or,
 * worse, ask Cloudflare to fetch and re-serve a foreign origin under this zone.
 * So a URL is rewritten ONLY when:
 *
 *   * its origin matches the configured public base URL's origin exactly — a
 *     legacy/external gallery `url` (an arbitrary http(s) address) is left
 *     untouched, no `srcset`; and
 *   * its path ends in a resizable raster extension. The object-key scheme
 *     (`media-object-key.ts`) derives the extension from the server-validated
 *     MIME type, so the extension is trustworthy here. `.gif` is excluded on
 *     purpose: Cloudflare resizing returns a single frame, which would silently
 *     de-animate an animated GIF. `.pdf`/`.svg` are not images and never match.
 *
 * `fit=scale-down` is the other safety choice: it lets Cloudflare shrink but
 * never enlarge, so a genuinely small original is never upscaled into a blurry
 * larger "variant". A `srcset` width above the original's real width therefore
 * just re-serves the original — harmless, and the renderer has no way to know
 * the real width, so this is the correct default rather than a guess.
 */

const RESIZABLE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);

/**
 * The responsive width ladder emitted in `srcset`, ascending. Fixed rather than
 * configurable: these are standard breakpoints, and `fit=scale-down` makes an
 * over-large entry a no-op, so there is nothing an operator needs to tune here.
 */
export const RESPONSIVE_IMAGE_WIDTHS: readonly number[] = [
  320, 640, 960, 1280, 1920
];

/**
 * The `sizes` attribute paired with the ladder above. A conservative default
 * that tells the browser the image is roughly full-width on small screens and
 * capped near the main content column on larger ones. Not per-placement — a
 * gallery image and a hero image would ideally differ, but a single sane default
 * beats none, and a caller that knows better can pass its own.
 */
export const DEFAULT_RESPONSIVE_IMAGE_SIZES = "(max-width: 768px) 100vw, 768px";

export type CloudflareImageResizingConfig = {
  /** `NewsMediaR2Config.imageResizingEnabled`. */
  enabled: boolean;
  /** `NewsMediaR2Config.publicBaseUrl` — the trusted Cloudflare-zone origin. */
  publicBaseUrl: string;
  /** Overrides `RESPONSIVE_IMAGE_WIDTHS` when a caller has a reason to. */
  widths?: readonly number[];
  /** Overrides `DEFAULT_RESPONSIVE_IMAGE_SIZES`. */
  sizes?: string;
};

export type ResponsiveImageAttrs = {
  /** Ready for a `srcset="..."` attribute (unescaped — the caller escapes). */
  srcset: string;
  /** Ready for a `sizes="..."` attribute. */
  sizes: string;
};

/** The transform a renderer applies to an image URL; `null` = leave it as a plain `src` with no `srcset`. */
export type ResponsiveImageTransform = (
  url: string
) => ResponsiveImageAttrs | null;

/** A transform that never adds `srcset` — the identity behavior every pre-5b call site keeps. */
export const NO_RESPONSIVE_IMAGE_TRANSFORM: ResponsiveImageTransform = () =>
  null;

function extensionOf(pathname: string): string | null {
  const lastDot = pathname.lastIndexOf(".");
  if (lastDot === -1 || lastDot === pathname.length - 1) return null;
  return pathname.slice(lastDot + 1).toLowerCase();
}

/**
 * Builds the `/cdn-cgi/image/` `srcset` for one URL, or `null` when the URL is
 * not eligible (see the header's rules). Never throws — a malformed URL is
 * simply ineligible.
 */
export function buildCloudflareImageSrcset(
  url: string,
  config: CloudflareImageResizingConfig
): ResponsiveImageAttrs | null {
  if (!config.enabled) return null;

  let source: URL;
  let base: URL;
  try {
    source = new URL(url);
    base = new URL(config.publicBaseUrl);
  } catch {
    return null;
  }

  // Same origin only — never point the zone's resizer at a foreign host.
  if (source.origin !== base.origin) return null;

  const extension = extensionOf(source.pathname);
  if (extension === null || !RESIZABLE_EXTENSIONS.has(extension)) return null;

  const widths = config.widths ?? RESPONSIVE_IMAGE_WIDTHS;
  // The source path Cloudflare should transform, relative to the zone root —
  // everything after the origin, minus the leading slash so it slots cleanly
  // behind the `/cdn-cgi/image/<options>/` prefix.
  const sourcePath = `${source.pathname}${source.search}`.replace(/^\//, "");

  const srcset = widths
    .map((width) => {
      const options = `width=${width},format=auto,fit=scale-down`;
      return `${base.origin}/cdn-cgi/image/${options}/${sourcePath} ${width}w`;
    })
    .join(", ");

  return { srcset, sizes: config.sizes ?? DEFAULT_RESPONSIVE_IMAGE_SIZES };
}

/**
 * Builds the `ResponsiveImageTransform` a pure renderer applies per image. The
 * application layer resolves `config` from env once and passes the closure down;
 * `_shared` never reads env itself. Returns `NO_RESPONSIVE_IMAGE_TRANSFORM` when
 * disabled so callers can pass the result unconditionally.
 */
export function buildResponsiveImageTransform(
  config: CloudflareImageResizingConfig
): ResponsiveImageTransform {
  if (!config.enabled) return NO_RESPONSIVE_IMAGE_TRANSFORM;
  return (url) => buildCloudflareImageSrcset(url, config);
}
