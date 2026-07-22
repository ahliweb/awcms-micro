/**
 * Shared, pure "gallery" media renderer (Issue #681, epic #679
 * platform-hardening). Extracted out of `blog-content/domain/
 * content-block-rendering.ts` — before this issue, `news-portal/domain/
 * homepage-section-rendering.ts`'s `gallery_block` section reused this
 * logic by importing `blog-content`'s domain module DIRECTLY (and
 * wrapping its own media ids in a synthetic `{blocks: [{type: "gallery",
 * items: [...]}]}` shape just to call `renderContentJsonToHtml`) — a
 * genuine domain-to-domain cross-module import in BOTH directions
 * (`blog-content` already imported FROM `news-portal` elsewhere, see
 * `media-library-port.ts`'s header), which is exactly the coupling this
 * issue removes. This file is neutral ground: BOTH modules call it, and
 * it imports from NEITHER of their `application`/`domain` trees.
 *
 * Whitelist-only, same "degrade, don't 500" convention every other
 * renderer in this repo follows — malformed input (wrong `mediaType`,
 * unresolved `mediaObjectId`, non-array `items`) is silently skipped,
 * never thrown. `<img>`/`<video controls>` only, everything escaped via
 * `escapeHtml` — there is no raw-HTML escape hatch here, by construction.
 *
 * `isAbsoluteHttpUrl` is intentionally a local copy of
 * `blog-content/domain/seo-validation.ts`'s function of the same name
 * (itself a fully generic http(s)-protocol check with zero
 * blog-content-specific logic) rather than an import of it — `_shared`
 * must never import FROM either module's `application`/`domain` tree,
 * only the other way around, or this file would just relocate the
 * coupling problem instead of removing it.
 */
import { escapeHtml } from "../../../lib/html/escape";
import {
  NO_RESPONSIVE_IMAGE_TRANSFORM,
  PUBLIC_CONTENT_IMG_LOADING_ATTRS,
  type ResponsiveImageTransform
} from "./responsive-image";

function isAbsoluteHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export type GalleryBlockItem = {
  mediaType: "image" | "video";
  /** Legacy/non-R2-only-mode shape — a raw absolute URL. */
  url?: string;
  /** R2-only-mode shape — a verified news media registry object id, resolved via `resolvedMediaUrls`. */
  mediaObjectId?: string;
  caption?: string;
};

/** `mediaObjectId -> public URL`, built by the caller from a real database round trip (this renderer is pure and never performs I/O itself). */
export type ResolvedGalleryMediaUrls = ReadonlyMap<string, string>;

function renderGalleryBlockItem(
  item: unknown,
  resolvedMediaUrls: ResolvedGalleryMediaUrls,
  imageTransform: ResponsiveImageTransform
): string | null {
  if (typeof item !== "object" || item === null || Array.isArray(item)) {
    return null;
  }

  const record = item as Record<string, unknown>;

  if (record.mediaType !== "image" && record.mediaType !== "video") {
    return null;
  }

  let resolvedUrl: string | null = null;

  if (typeof record.mediaObjectId === "string") {
    resolvedUrl = resolvedMediaUrls.get(record.mediaObjectId) ?? null;
  } else if (typeof record.url === "string" && isAbsoluteHttpUrl(record.url)) {
    resolvedUrl = record.url;
  }

  if (resolvedUrl === null) {
    return null;
  }

  const url = escapeHtml(resolvedUrl);
  const caption =
    typeof record.caption === "string" && record.caption.trim().length > 0
      ? `<figcaption>${escapeHtml(record.caption)}</figcaption>`
      : "";

  let media: string;
  if (record.mediaType === "image") {
    const alt = caption ? escapeHtml(record.caption as string) : "";
    // ADR-0026 step 5b — `srcset` is additive: `src` stays the original URL so
    // the image still loads with resizing disabled at the edge or on a browser
    // ignoring `srcset`. The transform returns null (no `srcset`) for every
    // ineligible URL — external `url`-based items, non-raster/`.gif`, or a
    // deployment with resizing off — so this line is identical to pre-5b output
    // in all of those cases.
    const responsive = imageTransform(resolvedUrl);
    const responsiveAttrs = responsive
      ? ` srcset="${escapeHtml(responsive.srcset)}" sizes="${escapeHtml(responsive.sizes)}"`
      : "";
    // `loading`/`decoding` are appended AFTER `src` (the `.gif`/external URL
    // still loads exactly as before) — Issue: public-surface CLS/perf pass. The
    // stylesheet's `.gallery img` reserves space via aspect-ratio + fades in.
    media = `<img src="${url}" alt="${alt}" ${PUBLIC_CONTENT_IMG_LOADING_ATTRS}${responsiveAttrs}>`;
  } else {
    media = `<video src="${url}" controls></video>`;
  }

  return `<figure>${media}${caption}</figure>`;
}

/**
 * Renders a `<div class="gallery">` from a list of gallery items, or `null` if
 * every item was malformed/unresolved (caller decides the empty-state fallback).
 *
 * `imageTransform` (ADR-0026 step 5b) is optional and defaults to
 * `NO_RESPONSIVE_IMAGE_TRANSFORM` — every pre-5b caller omits it and gets
 * byte-for-byte the same HTML. A public renderer that has resolved the media
 * config passes `buildResponsiveImageTransform(config)` to opt eligible R2 image
 * URLs into a Cloudflare `srcset`.
 */
export function renderGalleryBlockHtml(
  items: unknown,
  resolvedMediaUrls: ResolvedGalleryMediaUrls,
  imageTransform: ResponsiveImageTransform = NO_RESPONSIVE_IMAGE_TRANSFORM
): string | null {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const rendered = items
    .map((item) =>
      renderGalleryBlockItem(item, resolvedMediaUrls, imageTransform)
    )
    .filter((html): html is string => html !== null);

  if (rendered.length === 0) {
    return null;
  }

  return `<div class="gallery">${rendered.join("\n")}</div>`;
}
