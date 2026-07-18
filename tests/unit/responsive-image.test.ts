import { describe, expect, test } from "bun:test";

import {
  buildCloudflareImageSrcset,
  buildResponsiveImageTransform,
  DEFAULT_RESPONSIVE_IMAGE_SIZES,
  NO_RESPONSIVE_IMAGE_TRANSFORM,
  RESPONSIVE_IMAGE_WIDTHS,
  type CloudflareImageResizingConfig
} from "../../src/modules/_shared/rendering/responsive-image";

const BASE = "https://media.example.test";
const enabled: CloudflareImageResizingConfig = {
  enabled: true,
  publicBaseUrl: BASE
};

describe("buildCloudflareImageSrcset (ADR-0026 step 5b)", () => {
  test("builds a /cdn-cgi/image srcset for every ladder width, newest edge format", () => {
    const result = buildCloudflareImageSrcset(
      `${BASE}/news-media/t/2026/03/photo.jpg`,
      enabled
    );
    expect(result).not.toBeNull();

    const entries = result!.srcset.split(", ");
    expect(entries).toHaveLength(RESPONSIVE_IMAGE_WIDTHS.length);

    // Each entry: the zone origin + /cdn-cgi/image/<opts>/<sourcePathNoLeadingSlash> <w>w
    expect(entries[0]).toBe(
      `${BASE}/cdn-cgi/image/width=320,format=auto,fit=scale-down/news-media/t/2026/03/photo.jpg 320w`
    );
    expect(entries.at(-1)).toBe(
      `${BASE}/cdn-cgi/image/width=1920,format=auto,fit=scale-down/news-media/t/2026/03/photo.jpg 1920w`
    );
    expect(result!.sizes).toBe(DEFAULT_RESPONSIVE_IMAGE_SIZES);
  });

  test("returns null when resizing is disabled — the default, pre-5b behavior", () => {
    expect(
      buildCloudflareImageSrcset(`${BASE}/news-media/t/x.jpg`, {
        enabled: false,
        publicBaseUrl: BASE
      })
    ).toBeNull();
  });

  test("leaves an external/legacy URL untouched — never points the zone resizer at a foreign host", () => {
    // A gallery `url`-based item can be any absolute http(s) URL. Rewriting it
    // to /cdn-cgi/image on OUR zone would ask Cloudflare to fetch a foreign
    // origin under our domain — refused by the same-origin gate.
    expect(
      buildCloudflareImageSrcset("https://evil.example/photo.jpg", enabled)
    ).toBeNull();
  });

  test("excludes .gif — Cloudflare resizing would de-animate it to one frame", () => {
    expect(
      buildCloudflareImageSrcset(`${BASE}/news-media/t/anim.gif`, enabled)
    ).toBeNull();
  });

  test("excludes non-image extensions a media library can now hold (.pdf, .svg)", () => {
    // Step 5c made application/pdf storable; it is not an image and must never
    // get an <img> srcset. SVG can never be stored, but the guard is explicit
    // regardless.
    expect(
      buildCloudflareImageSrcset(`${BASE}/news-media/t/doc.pdf`, enabled)
    ).toBeNull();
    expect(
      buildCloudflareImageSrcset(`${BASE}/news-media/t/vector.svg`, enabled)
    ).toBeNull();
  });

  test("accepts every default-raster extension, case-insensitively", () => {
    for (const ext of ["jpg", "jpeg", "png", "webp", "JPG", "PNG"]) {
      expect(
        buildCloudflareImageSrcset(`${BASE}/news-media/t/img.${ext}`, enabled)
      ).not.toBeNull();
    }
  });

  test("preserves a query string in the transformed source path", () => {
    const result = buildCloudflareImageSrcset(
      `${BASE}/news-media/t/photo.jpg?v=2`,
      enabled
    );
    expect(result!.srcset).toContain("news-media/t/photo.jpg?v=2 320w");
  });

  test("a malformed URL is simply ineligible, never throws", () => {
    expect(buildCloudflareImageSrcset("not a url", enabled)).toBeNull();
    expect(
      buildCloudflareImageSrcset(`${BASE}/x.jpg`, {
        enabled: true,
        publicBaseUrl: "not a url"
      })
    ).toBeNull();
  });

  test("respects a caller-supplied width ladder and sizes", () => {
    const result = buildCloudflareImageSrcset(`${BASE}/news-media/t/p.png`, {
      ...enabled,
      widths: [100, 200],
      sizes: "50vw"
    });
    expect(result!.srcset.split(", ")).toHaveLength(2);
    expect(result!.sizes).toBe("50vw");
  });
});

describe("buildResponsiveImageTransform", () => {
  test("returns the no-op transform when disabled — same reference, so callers can compare", () => {
    expect(
      buildResponsiveImageTransform({ enabled: false, publicBaseUrl: BASE })
    ).toBe(NO_RESPONSIVE_IMAGE_TRANSFORM);
  });

  test("returns a working transform when enabled", () => {
    const transform = buildResponsiveImageTransform(enabled);
    expect(transform(`${BASE}/news-media/t/p.jpg`)).not.toBeNull();
    expect(transform("https://other.example/p.jpg")).toBeNull();
  });
});
