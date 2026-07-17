/**
 * MIME sniffing from magic bytes (Issue #634, epic `news_portal`). Pure — no
 * network/DB access, takes only the bytes already read from R2 by the
 * caller (`application/news-media-r2-verification.ts`).
 *
 * ## Why allow-list sniffing, not a generic magic-byte detector
 *
 * `full-online-r2-architecture.md` §9 and the security-auditor finding on
 * Issue #631 (the finding this whole issue exists to close) require the
 * `confirm`/finalize step to run MIME sniffing against the object's actual
 * bytes rather than trust `Content-Type`, the file extension, or the
 * client's claimed `mimeType` — none of those are proof of what the bytes
 * actually are. This module only tries to POSITIVELY recognize a small,
 * explicit set of signatures. Anything else — including a `.jpg`-named/labeled
 * file that is actually HTML/JS (the exact exploit scenario the security audit
 * called out) — returns `undefined` ("not a recognized signature"), which
 * `media-finalize-decision.ts` always treats as a hard reject. This is
 * deliberately allow-list-only (not a blocklist trying to enumerate every
 * dangerous format) — a payload sniffing to `undefined` is rejected
 * regardless of what it actually is.
 *
 * ## Recognized ≠ allowed (ADR-0026 step 5c)
 *
 * Until step 5c these were the same set, and this header said so: the four
 * raster types were exactly what `media-r2-config.ts` allows by default. That
 * is no longer true, and conflating the two would now be a real error.
 *
 *   * RECOGNIZED here: JPEG, PNG, WebP, GIF, PDF.
 *   * ALLOWED by default (`NEWS_MEDIA_R2_DEFAULT_ALLOWED_MIME_TYPES`): the four
 *     rasters only. PDF requires an operator opt-in.
 *
 * The two gates are independent and BOTH must pass — `decideNewsMediaFinalizeOutcome`
 * rejects an unrecognized signature (`mime_not_recognized`) and, separately, a
 * recognized signature that the deployment does not allow (`mime_not_allowed`).
 * Recognizing a type is what makes allowing it POSSIBLE, never automatic.
 *
 * The inverse matters just as much and is why `image/svg+xml` has no signature
 * here: an allow-list entry with no matching signature is a no-op that rejects
 * every upload, because sniffing decides. Adding a type to the config without
 * adding it here accomplishes nothing at all.
 */

export type SniffedNewsMediaMimeType =
  "image/jpeg" | "image/png" | "image/webp" | "image/gif" | "application/pdf";

const JPEG_MAGIC = [0xff, 0xd8, 0xff];
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const GIF_MAGIC_PREFIX = [0x47, 0x49, 0x46, 0x38]; // "GIF8"
const GIF_VERSION_A = 0x61; // "a" — closes "87a"/"89a"
const RIFF_MAGIC = [0x52, 0x49, 0x46, 0x46]; // "RIFF"
const WEBP_MAGIC = [0x57, 0x45, 0x42, 0x50]; // "WEBP", at byte offset 8
const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46, 0x2d]; // "%PDF-"

function matchesAt(
  bytes: Uint8Array,
  offset: number,
  signature: number[]
): boolean {
  if (bytes.length < offset + signature.length) return false;

  for (let i = 0; i < signature.length; i += 1) {
    if (bytes[offset + i] !== signature[i]) return false;
  }

  return true;
}

/**
 * Returns the recognized mime type for `bytes`, or `undefined` when the
 * content does not match any allow-listed image signature. Never throws.
 */
export function sniffNewsMediaMimeType(
  bytes: Uint8Array
): SniffedNewsMediaMimeType | undefined {
  if (matchesAt(bytes, 0, JPEG_MAGIC)) {
    return "image/jpeg";
  }

  if (matchesAt(bytes, 0, PNG_MAGIC)) {
    return "image/png";
  }

  if (
    matchesAt(bytes, 0, GIF_MAGIC_PREFIX) &&
    (bytes[4] === 0x37 || bytes[4] === 0x39) &&
    bytes[5] === GIF_VERSION_A
  ) {
    return "image/gif";
  }

  if (matchesAt(bytes, 0, RIFF_MAGIC) && matchesAt(bytes, 8, WEBP_MAGIC)) {
    return "image/webp";
  }

  // ADR-0026 step 5c — the first non-image signature, and the first that is a
  // DOCUMENT rather than an inert raster. Recognizing it here does not allow it:
  // `application/pdf` stays out of the default allow-list, so finalize still
  // rejects a PDF as `mime_not_allowed` until an operator opts in. This function
  // answers "what are these bytes", never "may they be stored".
  //
  // `%PDF-` and not `%PDF`: the hyphen is part of the header every PDF spec
  // since 1.0 requires (`%PDF-1.7`, `%PDF-2.0`), and matching without it would
  // accept a file starting with the literal text "%PDF" and nothing else.
  //
  // The version digits after the hyphen are deliberately NOT checked. This
  // function's contract is signature recognition, not validity — a
  // truncated/corrupt PDF is still a PDF, and rejecting it belongs to whatever
  // renders it, not to a MIME sniff. Nor does matching here assert the PDF is
  // safe: a real PDF can carry JavaScript. That is why it is opt-in, and why
  // `media-r2-config.ts` documents what an operator is accepting.
  if (matchesAt(bytes, 0, PDF_MAGIC)) {
    return "application/pdf";
  }

  return undefined;
}
