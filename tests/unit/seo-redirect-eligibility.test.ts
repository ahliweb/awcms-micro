/**
 * Unit tests for `isRedirectEligiblePath` (Issue #268) — the admin-route-hijack
 * defense. A tenant redirect must NEVER intercept admin/API/auth/static/system
 * paths. Pure, no DB.
 */
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

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

describe("isRedirectEligiblePath — encoded reserved paths (A-L2, decode-then-check)", () => {
  test("percent-encoded reserved paths are decoded then excluded", () => {
    expect(isRedirectEligiblePath("/%61pi/v1/foo")).toBe(false); // %61 -> a -> /api/...
    expect(isRedirectEligiblePath("/api%2fv1/foo")).toBe(false); // %2f -> / -> /api/v1/...
    expect(isRedirectEligiblePath("/API%2Fv1/foo")).toBe(false); // uppercase variant
    expect(isRedirectEligiblePath("/%61dmin/x")).toBe(false); // -> /admin/x
    expect(isRedirectEligiblePath("/%2e%2e")).toBe(true); // /.. is not an excluded family (normalization clamps it)
  });

  test("an encoded control character fails safe (not eligible)", () => {
    expect(isRedirectEligiblePath("/foo%0abar")).toBe(false); // %0a -> newline
    expect(isRedirectEligiblePath("/foo%00bar")).toBe(false); // %00 -> NUL
  });

  test("malformed percent-encoding fails safe (not eligible)", () => {
    expect(isRedirectEligiblePath("/%zz")).toBe(false);
    expect(isRedirectEligiblePath("/%")).toBe(false);
  });

  test("a legitimate encoded content path stays eligible", () => {
    expect(isRedirectEligiblePath("/caf%C3%A9")).toBe(true); // café
    expect(isRedirectEligiblePath("/news/%E2%9C%93")).toBe(true); // ✓
  });
});

describe("isRedirectEligiblePath — N1 admin-hijack invariant vs the real public route inventory", () => {
  // Sensitive top-level route segments (auth/system/discovery) that must NEVER be
  // hijackable by a tenant redirect. Directory segments are probed with a child
  // path; leaf-file routes are probed at their own path. If a FUTURE public route
  // with one of these names is added under src/pages/ without also excluding it in
  // the deny-list (e.g. a `register.astro`), the inventory test below fails.
  const SENSITIVE_SEGMENTS = new Set([
    "admin",
    "api",
    "login",
    "logout",
    "register",
    "signup",
    "signin",
    "sign-in",
    "sign-up",
    "auth",
    "setup",
    "sso",
    "oauth",
    "mfa",
    "reset-password",
    "forgot-password",
    "verify-email",
    "account",
    "health",
    "robots.txt",
    "sitemap.xml",
    "atom.xml",
    "feed.xml",
    "feed.json",
    ".well-known",
    "_astro",
    "_actions",
    "_image"
  ]);

  test("every sensitive route FAMILY is excluded (static invariant)", () => {
    const mustExclude = [
      "/admin",
      "/admin/x",
      "/api/v1/x",
      "/login",
      "/logout",
      "/setup",
      "/auth/callback",
      "/_astro/x.js",
      "/_actions/y",
      "/.well-known/acme-challenge/z",
      "/health",
      "/robots.txt",
      "/sitemap.xml",
      "/sitemap-2.xml",
      "/feed.xml",
      "/atom.xml",
      "/feed.json",
      "/logo.png",
      "/app.css",
      "/x.js",
      "/favicon.ico"
    ];
    for (const p of mustExclude) {
      expect(isRedirectEligiblePath(p)).toBe(false);
    }
  });

  test("no sensitive public route present under src/pages is redirect-eligible", () => {
    const pagesDir = fileURLToPath(new URL("../../src/pages", import.meta.url));
    const entries = readdirSync(pagesDir, { withFileTypes: true });

    let covered = 0;
    for (const entry of entries) {
      const isDir = entry.isDirectory();
      const base = isDir
        ? entry.name
        : entry.name.replace(/\.(ts|js|mjs|astro)$/, "");
      // Skip dynamic (bracketed) routes — their concrete path varies.
      if (base.includes("[")) continue;

      const seg = base.toLowerCase();
      if (!SENSITIVE_SEGMENTS.has(seg)) continue;

      // A sensitive directory family (e.g. /api, /admin) must exclude ANY child
      // path; a sensitive leaf route (e.g. /login, /robots.txt) must exclude its
      // own path.
      const probe = isDir ? `/${seg}/probe-child` : `/${seg}`;
      expect(isRedirectEligiblePath(probe)).toBe(false);
      covered += 1;
    }

    // Sanity: the scan actually matched real sensitive routes (admin/, api/, login,
    // robots.txt, feeds, sitemap) — so this guard is genuinely wired to the tree.
    expect(covered).toBeGreaterThan(3);
  });
});
