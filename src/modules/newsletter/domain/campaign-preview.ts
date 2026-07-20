/**
 * Campaign/digest safe preview rendering (Issue #272, ADR-0033 — SECURITY SPINE).
 * Pure domain — no I/O. Same "escape EVERYTHING, then allow only a fixed set of
 * safe constructs" discipline as `comments/domain/comment-sanitization.ts`'s
 * `renderCommentHtml`: the raw `body_html_source` an admin composes is NEVER
 * emitted as stored HTML. Instead the preview escapes every character, then
 * re-introduces ONLY: paragraph breaks (blank line -> new paragraph), single line
 * breaks (`<br>`), and autolinked bare http(s) URLs (`rel="nofollow noopener
 * noreferrer"`). `javascript:`/`data:`/`vbscript:` and control chars can never
 * become a live link, and no script/style/iframe/on* attribute can survive.
 */

// Strip C0/C1 control characters except tab (U+0009) and newline (U+000A); \r is
// normalized to \n separately below. Unicode escapes only — no raw control byte
// ever appears in source (the NUL/control-byte discipline).
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g;
const EXCESS_BLANK_LINES = /\n{3,}/g;
const URL_PATTERN = /\bhttps?:\/\/[^\s<>"']+/gi;

/** Escapes the five HTML-significant characters. The ONLY escaping primitive. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** A URL is safe to emit as a live link ONLY if it parses as an absolute http(s) URL. */
export function isSafeLinkUrl(candidate: string): boolean {
  try {
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function renderLine(line: string): string {
  let out = "";
  let lastIndex = 0;
  URL_PATTERN.lastIndex = 0;
  for (const match of line.matchAll(URL_PATTERN)) {
    const url = match[0];
    const start = match.index ?? 0;
    out += escapeHtml(line.slice(lastIndex, start));
    if (isSafeLinkUrl(url)) {
      const safeUrl = escapeHtml(url);
      out += `<a href="${safeUrl}" rel="nofollow noopener noreferrer" target="_blank">${safeUrl}</a>`;
    } else {
      out += escapeHtml(url);
    }
    lastIndex = start + url.length;
  }
  out += escapeHtml(line.slice(lastIndex));
  return out;
}

/**
 * Render an admin-composed campaign source string to SAFE preview HTML. Blank
 * lines separate `<p>` paragraphs; single newlines become `<br>`; bare http(s)
 * URLs autolink. The result is safe to inject as innerHTML because the only tags
 * it can contain are the fixed `<p>`/`<br>`/`<a>` this function itself emits.
 */
export function renderCampaignPreview(source: unknown): string {
  if (typeof source !== "string") return "";
  const cleaned = source
    .replace(CONTROL_CHARS, "")
    .replace(/\r\n?/g, "\n")
    .replace(EXCESS_BLANK_LINES, "\n\n")
    .trim();
  if (cleaned.length === 0) return "";

  const paragraphs = cleaned.split("\n\n");
  return paragraphs
    .map((para) => {
      const lines = para.split("\n").map(renderLine).join("<br>");
      return `<p>${lines}</p>`;
    })
    .join("\n");
}
