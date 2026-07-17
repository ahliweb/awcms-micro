import { describe, expect, test } from "bun:test";

import {
  NEWS_MEDIA_R2_DEFAULT_ALLOWED_MIME_TYPES,
  NEWS_MEDIA_R2_DISALLOWED_MIME_TYPE_DEFAULT,
  NEWS_MEDIA_R2_KNOWN_MIME_TYPES,
  NEWS_MEDIA_R2_OPTIONAL_DOCUMENT_MIME_TYPES
} from "../../src/modules/media-library/domain/media-r2-config";
import { deriveExtensionFromMimeType } from "../../src/modules/media-library/domain/media-object-key";
import { sniffNewsMediaMimeType } from "../../src/modules/media-library/domain/media-mime-sniffer";
import { decideNewsMediaFinalizeOutcome } from "../../src/modules/media-library/domain/media-finalize-decision";

/**
 * ADR-0026 step 5c pins the relationship between three sets that were identical
 * until it landed, and are now deliberately different:
 *
 *   * SNIFFABLE — what `media-mime-sniffer.ts` recognizes from magic bytes.
 *   * ALLOWED-BY-DEFAULT — what a deployment accepts with no config.
 *   * KNOWN — what an operator may legitimately list in
 *     `NEWS_MEDIA_R2_ALLOWED_MIME_TYPES` without `config:validate` erroring.
 *
 * Conflating any two of them is a real security error in either direction, and
 * both directions are silent:
 *
 *   * Sniffable ⊇ allowed is what makes an allow-list entry mean anything. An
 *     allowed type with no signature is a no-op that rejects every upload —
 *     which is precisely what `image/svg+xml` is, and must remain.
 *   * Allowed ⊉ sniffable is what stops recognizing a type from silently
 *     shipping it to every deployment on upgrade. PDF is recognized; nobody who
 *     did not ask for it starts accepting one.
 */
describe("recognized vs allowed vs known (ADR-0026 step 5c)", () => {
  const PDF = "application/pdf";
  const pdfBytes = new TextEncoder().encode("%PDF-1.7\n");

  test("PDF is recognized by the sniffer", () => {
    expect(sniffNewsMediaMimeType(pdfBytes)).toBe(PDF);
  });

  test("PDF is NOT allowed by default — recognizing a type never ships it", () => {
    expect(NEWS_MEDIA_R2_DEFAULT_ALLOWED_MIME_TYPES).not.toContain(PDF);
    expect([...NEWS_MEDIA_R2_DEFAULT_ALLOWED_MIME_TYPES]).toEqual([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif"
    ]);
  });

  test("PDF IS known, so an operator can opt in without config:validate erroring", () => {
    expect(NEWS_MEDIA_R2_KNOWN_MIME_TYPES).toContain(PDF);
    expect(NEWS_MEDIA_R2_OPTIONAL_DOCUMENT_MIME_TYPES).toContain(PDF);
  });

  test("a default deployment REJECTS a genuine PDF as mime_not_allowed, not mime_not_recognized", () => {
    // The distinction is the whole design: the bytes are provably a PDF, and it
    // is refused on policy. If this ever reported `mime_not_recognized`, the
    // sniffer signature would have been lost while the config still looked
    // correct.
    const decision = decideNewsMediaFinalizeOutcome({
      claimedMimeType: PDF,
      allowedMimeTypes: [...NEWS_MEDIA_R2_DEFAULT_ALLOWED_MIME_TYPES],
      sniffedMimeType: PDF,
      claimedChecksumSha256: null,
      computedChecksumSha256: "abc"
    });

    expect(decision).toEqual({ accepted: false, reason: "mime_not_allowed" });
  });

  test("a deployment that opts in ACCEPTS a genuine PDF", () => {
    const decision = decideNewsMediaFinalizeOutcome({
      claimedMimeType: PDF,
      allowedMimeTypes: [
        ...NEWS_MEDIA_R2_DEFAULT_ALLOWED_MIME_TYPES,
        ...NEWS_MEDIA_R2_OPTIONAL_DOCUMENT_MIME_TYPES
      ],
      sniffedMimeType: PDF,
      claimedChecksumSha256: null,
      computedChecksumSha256: "abc"
    });

    expect(decision).toEqual({ accepted: true });
  });

  test("opting in does NOT weaken sniffing — HTML claiming to be a PDF is still rejected", () => {
    const html = new TextEncoder().encode("<html><script>alert(1)</script>");

    const decision = decideNewsMediaFinalizeOutcome({
      claimedMimeType: PDF,
      allowedMimeTypes: [
        ...NEWS_MEDIA_R2_DEFAULT_ALLOWED_MIME_TYPES,
        ...NEWS_MEDIA_R2_OPTIONAL_DOCUMENT_MIME_TYPES
      ],
      sniffedMimeType: sniffNewsMediaMimeType(html),
      claimedChecksumSha256: null,
      computedChecksumSha256: "abc"
    });

    expect(decision).toEqual({
      accepted: false,
      reason: "mime_not_recognized"
    });
  });

  test("every KNOWN type is sniffable EXCEPT svg — the documented, deliberate exception", () => {
    // SVG is known because a real override path exists for it
    // (`checkNewsMediaR2SvgNotAllowed`), not because an SVG could ever be
    // stored. Allow-listing it stays a no-op that rejects every SVG upload.
    // This test exists so that stays a decision rather than drifting into an
    // accident in either direction.
    const svg = new TextEncoder().encode("<svg xmlns='...'></svg>");
    expect(sniffNewsMediaMimeType(svg)).toBeUndefined();
    expect(NEWS_MEDIA_R2_KNOWN_MIME_TYPES).toContain(
      NEWS_MEDIA_R2_DISALLOWED_MIME_TYPE_DEFAULT
    );

    const sniffableKnownTypes = NEWS_MEDIA_R2_KNOWN_MIME_TYPES.filter(
      (type) => type !== NEWS_MEDIA_R2_DISALLOWED_MIME_TYPE_DEFAULT
    );
    expect(sniffableKnownTypes).toEqual([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf"
    ]);
  });

  test("every KNOWN type an operator may opt into has a reviewed object-key extension", () => {
    // A type that is allowed but has no extension mapping throws
    // `UnsupportedNewsMediaMimeTypeError` at upload-session creation — the
    // operator would have opted into a type that 500s rather than uploads. SVG
    // is excluded here for the same reason it has no signature: it can never
    // reach key derivation.
    for (const mimeType of NEWS_MEDIA_R2_KNOWN_MIME_TYPES) {
      if (mimeType === NEWS_MEDIA_R2_DISALLOWED_MIME_TYPE_DEFAULT) continue;
      expect(deriveExtensionFromMimeType(mimeType)).toBeTruthy();
    }

    expect(deriveExtensionFromMimeType(PDF)).toBe("pdf");
  });
});
