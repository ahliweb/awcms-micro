import { describe, expect, test } from "bun:test";

import {
  AD_PLACEMENT_DEFAULT_MEDIA_TYPES,
  AD_PLACEMENT_KEYS,
  AD_PLACEMENT_PRESETS,
  AD_ROTATION_MODES,
  isAdPlacementKey,
  isAdRotationMode,
  isSafeAdLinkUrl,
  validateCreateAdPlacementInput,
  validateUpdateAdPlacementInput
} from "../../src/modules/news-portal/domain/ad-placement-policy";

const VALID_MEDIA_ID = "11111111-1111-1111-1111-111111111111";

describe("isAdPlacementKey (Issue #638)", () => {
  test("accepts every declared placement key from the issue body", () => {
    expect(AD_PLACEMENT_KEYS).toEqual([
      "header_banner",
      "below_headline",
      "homepage_middle",
      "homepage_bottom",
      "article_top",
      "article_middle",
      "article_bottom",
      "sidebar_top",
      "sidebar_middle",
      "sidebar_bottom",
      "category_archive_top",
      "search_result_top"
    ]);

    for (const key of AD_PLACEMENT_KEYS) {
      expect(isAdPlacementKey(key)).toBe(true);
    }
  });

  test("rejects unknown values", () => {
    for (const value of ["ad_slot", "not_a_placement", 123, null, undefined]) {
      expect(isAdPlacementKey(value)).toBe(false);
    }
  });
});

describe("AD_PLACEMENT_PRESETS (Issue #638)", () => {
  test("every declared placement key has a preset with recommendedSize/allowedMediaTypes/maxItems", () => {
    for (const key of AD_PLACEMENT_KEYS) {
      const preset = AD_PLACEMENT_PRESETS[key];
      expect(preset.recommendedSize.length).toBeGreaterThan(0);
      expect(preset.allowedMediaTypes.length).toBeGreaterThan(0);
      expect(preset.maxItems).toBeGreaterThan(0);
      // SVG is never an allowed media type by default (Keputusan kunci #5).
      expect(preset.allowedMediaTypes).not.toContain("image/svg+xml");
    }
  });
});

describe("isAdRotationMode (Issue #638)", () => {
  test("accepts every declared rotation mode from the issue body", () => {
    expect(AD_ROTATION_MODES).toEqual([
      "latest",
      "priority",
      "random_safe",
      "weighted"
    ]);
    for (const mode of AD_ROTATION_MODES) {
      expect(isAdRotationMode(mode)).toBe(true);
    }
  });

  test("rejects unknown values", () => {
    for (const value of ["random", "fifo", 1, null]) {
      expect(isAdRotationMode(value)).toBe(false);
    }
  });
});

describe("isSafeAdLinkUrl (Issue #638)", () => {
  test("accepts absolute http/https URLs", () => {
    expect(isSafeAdLinkUrl("https://example.com/promo")).toBe(true);
    expect(isSafeAdLinkUrl("http://example.com")).toBe(true);
  });

  test("rejects javascript:/data:/relative/malformed URLs (XSS/scheme-confusion guard)", () => {
    expect(isSafeAdLinkUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeAdLinkUrl("data:text/html,<script>alert(1)</script>")).toBe(
      false
    );
    expect(isSafeAdLinkUrl("/relative/path")).toBe(false);
    expect(isSafeAdLinkUrl("not a url")).toBe(false);
    expect(isSafeAdLinkUrl("ftp://example.com/file")).toBe(false);
  });
});

describe("validateCreateAdPlacementInput (Issue #638)", () => {
  test("accepts a minimal valid input and applies defaults", () => {
    const result = validateCreateAdPlacementInput({
      placementKey: "header_banner",
      name: "Spring Sale",
      mediaObjectId: VALID_MEDIA_ID
    });

    expect(result.valid).toBe(true);
    if (!result.valid) return;
    expect(result.value).toEqual({
      placementKey: "header_banner",
      name: "Spring Sale",
      mediaObjectId: VALID_MEDIA_ID,
      linkUrl: null,
      rotationMode: "latest",
      priority: 0,
      isActive: true,
      startsAt: null,
      endsAt: null
    });
  });

  test("rejects missing placementKey/name/mediaObjectId", () => {
    const result = validateCreateAdPlacementInput({});
    expect(result.valid).toBe(false);
    if (result.valid) return;
    const fields = result.errors.map((e) => e.field);
    expect(fields).toContain("placementKey");
    expect(fields).toContain("name");
    expect(fields).toContain("mediaObjectId");
  });

  test("rejects a name longer than 200 characters (security-auditor Low finding, PR #727)", () => {
    const result = validateCreateAdPlacementInput({
      placementKey: "header_banner",
      name: "x".repeat(201),
      mediaObjectId: VALID_MEDIA_ID
    });
    expect(result.valid).toBe(false);
    if (result.valid) return;
    expect(result.errors.some((e) => e.field === "name")).toBe(true);
  });

  test("accepts a name exactly 200 characters", () => {
    const result = validateCreateAdPlacementInput({
      placementKey: "header_banner",
      name: "x".repeat(200),
      mediaObjectId: VALID_MEDIA_ID
    });
    expect(result.valid).toBe(true);
  });

  test("rejects a local path or arbitrary shape for mediaObjectId (must be a UUID)", () => {
    const result = validateCreateAdPlacementInput({
      placementKey: "header_banner",
      name: "Spring Sale",
      mediaObjectId: "/uploads/banner.jpg"
    });
    expect(result.valid).toBe(false);
  });

  test("rejects an unsafe linkUrl", () => {
    const result = validateCreateAdPlacementInput({
      placementKey: "header_banner",
      name: "Spring Sale",
      mediaObjectId: VALID_MEDIA_ID,
      linkUrl: "javascript:alert(1)"
    });
    expect(result.valid).toBe(false);
    if (result.valid) return;
    expect(result.errors.map((e) => e.field)).toContain("linkUrl");
  });

  test("accepts a safe external linkUrl", () => {
    const result = validateCreateAdPlacementInput({
      placementKey: "header_banner",
      name: "Spring Sale",
      mediaObjectId: VALID_MEDIA_ID,
      linkUrl: "https://advertiser.example.com/landing"
    });
    expect(result.valid).toBe(true);
    if (!result.valid) return;
    expect(result.value.linkUrl).toBe("https://advertiser.example.com/landing");
  });

  test("rejects an unknown rotationMode", () => {
    const result = validateCreateAdPlacementInput({
      placementKey: "header_banner",
      name: "Spring Sale",
      mediaObjectId: VALID_MEDIA_ID,
      rotationMode: "round_robin"
    });
    expect(result.valid).toBe(false);
  });

  test("rejects a negative priority", () => {
    const result = validateCreateAdPlacementInput({
      placementKey: "header_banner",
      name: "Spring Sale",
      mediaObjectId: VALID_MEDIA_ID,
      priority: -1
    });
    expect(result.valid).toBe(false);
  });

  test("rejects endsAt <= startsAt", () => {
    const result = validateCreateAdPlacementInput({
      placementKey: "header_banner",
      name: "Spring Sale",
      mediaObjectId: VALID_MEDIA_ID,
      startsAt: "2026-02-01T00:00:00.000Z",
      endsAt: "2026-01-01T00:00:00.000Z"
    });
    expect(result.valid).toBe(false);
    if (result.valid) return;
    expect(result.errors.map((e) => e.field)).toContain("endsAt");
  });

  test("accepts a valid schedule window", () => {
    const result = validateCreateAdPlacementInput({
      placementKey: "header_banner",
      name: "Spring Sale",
      mediaObjectId: VALID_MEDIA_ID,
      startsAt: "2026-01-01T00:00:00.000Z",
      endsAt: "2026-02-01T00:00:00.000Z"
    });
    expect(result.valid).toBe(true);
  });
});

describe("validateUpdateAdPlacementInput (Issue #638)", () => {
  test("allows placementKey to change (every preset shares the same row shape)", () => {
    const result = validateUpdateAdPlacementInput({
      placementKey: "sidebar_middle"
    });
    expect(result.valid).toBe(true);
    if (!result.valid) return;
    expect(result.value.placementKey).toBe("sidebar_middle");
  });

  test("allows clearing linkUrl to null", () => {
    const result = validateUpdateAdPlacementInput({ linkUrl: null });
    expect(result.valid).toBe(true);
    if (!result.valid) return;
    expect(result.value.linkUrl).toBeNull();
  });

  test("empty body is valid (no-op update)", () => {
    const result = validateUpdateAdPlacementInput({});
    expect(result.valid).toBe(true);
    if (!result.valid) return;
    expect(result.value).toEqual({});
  });

  test("rejects an unsafe linkUrl on update", () => {
    const result = validateUpdateAdPlacementInput({
      linkUrl: "javascript:alert(1)"
    });
    expect(result.valid).toBe(false);
  });
});

/**
 * ADR-0026 step 5c. `allowedMediaTypes` was written as defense-in-depth for a
 * preset that might one day narrow its own list, and its own comment recorded
 * that it was redundant: "a verified media object's mimeType is always one of
 * these four". Step 5c made that false — a deployment opting into
 * `NEWS_MEDIA_R2_OPTIONAL_DOCUMENT_MIME_TYPES` can hold verified
 * `application/pdf` objects, and an editor can paste one's id into
 * `mediaObjectId`.
 *
 * These pin the two halves that keep a PDF out of a live ad slot. The real
 * rejection lives in `ad-placement-reference-validation.ts:66`
 * (`!preset.allowedMediaTypes.includes(media.mimeType)`), which reads the data
 * asserted here — so if a well-meaning future change "re-syncs" this list with
 * the media config, this fails rather than a PDF quietly rendering into an
 * `<img>` on a news portal.
 */
describe("ad placement media types vs the media library's wider set (ADR-0026 step 5c)", () => {
  test("no placement preset admits application/pdf — a PDF is not a banner", () => {
    for (const key of AD_PLACEMENT_KEYS) {
      expect(AD_PLACEMENT_PRESETS[key].allowedMediaTypes).not.toContain(
        "application/pdf"
      );
    }
  });

  test("every placement preset admits ONLY raster image types", () => {
    // Deliberately a positive assertion, not just "no PDF": the next
    // non-image type step 5c admits (DOCX, ...) must fail here too, without
    // anyone remembering to add it to the negative check above.
    for (const key of AD_PLACEMENT_KEYS) {
      for (const mimeType of AD_PLACEMENT_PRESETS[key].allowedMediaTypes) {
        expect(mimeType.startsWith("image/")).toBe(true);
      }
    }
  });

  test("AD_PLACEMENT_DEFAULT_MEDIA_TYPES stays the four rasters — never re-synced to the media allow-list", () => {
    expect(AD_PLACEMENT_DEFAULT_MEDIA_TYPES).toEqual([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif"
    ]);
  });
});
