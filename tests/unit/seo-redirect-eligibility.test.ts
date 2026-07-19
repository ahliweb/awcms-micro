/**
 * Unit tests for `isRedirectEligiblePath` (Issue #268) — the admin-route-hijack
 * defense. A tenant redirect must NEVER intercept admin/API/auth/static/system
 * paths. Pure, no DB.
 */
import { describe, expect, test } from "bun:test";

import { isRedirectEligiblePath } from "../../src/modules/seo-distribution/domain/redirect-eligibility";

describe("isRedirectEligiblePath — excluded families (never redirected)", () => {
  test("API paths are never eligible", () => {
    expect(isRedirectEligiblePath("/api/v1/seo/redirects")).toBe(false);
    expect(isRedirectEligiblePath("/api/")).toBe(false);
    expect(isRedirectEligiblePath("/api/v1/auth/login")).toBe(false);
  });

  test("admin paths are never eligible (incl. case variants)", () => {
    expect(isRedirectEligiblePath("/admin")).toBe(false);
    expect(isRedirectEligiblePath("/admin/dashboard")).toBe(false);
    expect(isRedirectEligiblePath("/Admin/secret")).toBe(false);
    expect(isRedirectEligiblePath("/ADMIN")).toBe(false);
  });

  test("auth paths are never eligible", () => {
    expect(isRedirectEligiblePath("/login")).toBe(false);
    expect(isRedirectEligiblePath("/logout")).toBe(false);
    expect(isRedirectEligiblePath("/auth/callback")).toBe(false);
    expect(isRedirectEligiblePath("/setup")).toBe(false);
  });

  test("framework internal + static assets are never eligible", () => {
    expect(isRedirectEligiblePath("/_astro/app.js")).toBe(false);
    expect(isRedirectEligiblePath("/_actions/x")).toBe(false);
    expect(isRedirectEligiblePath("/_image")).toBe(false);
    expect(isRedirectEligiblePath("/favicon.ico")).toBe(false);
    expect(isRedirectEligiblePath("/styles/app.css")).toBe(false);
    expect(isRedirectEligiblePath("/logo.png")).toBe(false);
    expect(isRedirectEligiblePath("/.well-known/acme")).toBe(false);
  });

  test("system + SEO discovery routes are never eligible", () => {
    expect(isRedirectEligiblePath("/health")).toBe(false);
    expect(isRedirectEligiblePath("/robots.txt")).toBe(false);
    expect(isRedirectEligiblePath("/sitemap.xml")).toBe(false);
    expect(isRedirectEligiblePath("/sitemap-2.xml")).toBe(false);
    expect(isRedirectEligiblePath("/feed.xml")).toBe(false);
    expect(isRedirectEligiblePath("/atom.xml")).toBe(false);
    expect(isRedirectEligiblePath("/feed.json")).toBe(false);
  });

  test("malformed / control-char paths fail safe (not eligible)", () => {
    expect(isRedirectEligiblePath("relative")).toBe(false);
    expect(isRedirectEligiblePath("")).toBe(false);
    expect(isRedirectEligiblePath("/a\r\nb")).toBe(false);
  });
});

describe("isRedirectEligiblePath — eligible content paths", () => {
  test("ordinary content paths are eligible", () => {
    expect(isRedirectEligiblePath("/")).toBe(true);
    expect(isRedirectEligiblePath("/old-page")).toBe(true);
    expect(isRedirectEligiblePath("/news/some-article")).toBe(true);
    expect(isRedirectEligiblePath("/products/widget")).toBe(true);
    // A content path that merely STARTS with an excluded word but is not that segment.
    expect(isRedirectEligiblePath("/administration-guide")).toBe(true);
    expect(isRedirectEligiblePath("/api-docs")).toBe(true);
  });
});
