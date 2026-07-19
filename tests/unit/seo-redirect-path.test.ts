/**
 * Unit tests for redirect-path normalization (Issue #268) — the CRLF / traversal /
 * Unicode-confusion / protocol-relative defense. Pure, no DB.
 */
import { describe, expect, test } from "bun:test";

import {
  normalizeRedirectPath,
  redirectPathKey
} from "../../src/modules/seo-distribution/domain/redirect-path";

describe("normalizeRedirectPath — canonicalization", () => {
  test("resolves dot-segments and clamps traversal at root", () => {
    expect(normalizeRedirectPath("/a/./b")).toEqual({ ok: true, path: "/a/b" });
    expect(normalizeRedirectPath("/a/b/../c")).toEqual({
      ok: true,
      path: "/a/c"
    });
    // `..` can never escape the origin — clamped at root.
    expect(normalizeRedirectPath("/../../../etc/passwd")).toEqual({
      ok: true,
      path: "/etc/passwd"
    });
  });

  test("collapses duplicate slashes and strips a trailing slash (except root)", () => {
    expect(normalizeRedirectPath("/a//b///c")).toEqual({
      ok: true,
      path: "/a/b/c"
    });
    expect(normalizeRedirectPath("/a/b/")).toEqual({ ok: true, path: "/a/b" });
    expect(normalizeRedirectPath("/")).toEqual({ ok: true, path: "/" });
  });

  test("uppercases percent-encoding and is deterministic (same input -> same output)", () => {
    const a = normalizeRedirectPath("/caf%c3%a9");
    const b = normalizeRedirectPath("/caf%C3%A9");
    expect(a.ok && b.ok && a.path === b.path).toBe(true);
  });

  test("drops query by default, keeps it with keepQuery", () => {
    expect(normalizeRedirectPath("/a?x=1")).toEqual({ ok: true, path: "/a" });
    const kept = normalizeRedirectPath("/a?x=1", { keepQuery: true });
    expect(kept.ok && kept.path).toBe("/a?x=1");
  });
});

describe("normalizeRedirectPath — security rejections", () => {
  test("rejects CRLF / control characters (header-injection defense)", () => {
    expect(normalizeRedirectPath("/a\r\n/evil").ok).toBe(false);
    expect(normalizeRedirectPath("/a\nSet-Cookie: x").ok).toBe(false);
    expect(normalizeRedirectPath("/a\tb").ok).toBe(false);
    expect(normalizeRedirectPath("/a\u0000b").ok).toBe(false);
    expect(normalizeRedirectPath("/a\u007fb").ok).toBe(false);
    expect(normalizeRedirectPath("/a b").ok).toBe(false); // raw space
  });

  test("rejects protocol-relative and backslash confusion (open-redirect vectors)", () => {
    expect(normalizeRedirectPath("//evil.com").ok).toBe(false);
    expect(normalizeRedirectPath("/\\evil.com").ok).toBe(false);
    expect(normalizeRedirectPath("\\/evil.com").ok).toBe(false);
    expect(normalizeRedirectPath("/a\\b").ok).toBe(false);
  });

  test("rejects the TAB-strip bypass (/\\t/evil.com would collapse to //evil.com)", () => {
    expect(normalizeRedirectPath("/\t/evil.com").ok).toBe(false);
  });

  test("rejects non-path-absolute and absolute-scheme inputs", () => {
    expect(normalizeRedirectPath("relative").ok).toBe(false);
    expect(normalizeRedirectPath("https://evil.com/x").ok).toBe(false);
    expect(normalizeRedirectPath("javascript:alert(1)").ok).toBe(false);
    expect(normalizeRedirectPath("").ok).toBe(false);
    expect(normalizeRedirectPath("   ").ok).toBe(false);
  });

  test("rejects malformed Unicode (lone surrogate)", () => {
    expect(normalizeRedirectPath("/a\ud800b").ok).toBe(false);
  });

  test("rejects an over-long path", () => {
    expect(normalizeRedirectPath(`/${"a".repeat(3000)}`).ok).toBe(false);
  });

  test("a literal /http://evil.com is a same-origin path, not an open redirect", () => {
    // Starts with `/` so it is a path segment, not an absolute URL; the duplicate
    // slash is collapsed and it stays same-origin (never reaches host evil.com).
    expect(normalizeRedirectPath("/http://evil.com")).toEqual({
      ok: true,
      path: "/http:/evil.com"
    });
  });
});

describe("redirectPathKey", () => {
  test("strips the query portion", () => {
    expect(redirectPathKey("/a?x=1")).toBe("/a");
    expect(redirectPathKey("/a")).toBe("/a");
  });
});
