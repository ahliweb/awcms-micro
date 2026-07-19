/**
 * Unit tests for redirect rule/settings/url-change validation + legacy-blog mapping
 * (Issue #268). Pure, no DB.
 */
import { describe, expect, test } from "bun:test";

import {
  validateRedirectInput,
  validateRedirectUpdate
} from "../../src/modules/seo-distribution/domain/redirect-rule";
import { validateRedirectSettings } from "../../src/modules/seo-distribution/domain/redirect-settings";
import { planUrlChangeRedirect } from "../../src/modules/seo-distribution/domain/url-change-plan";
import {
  buildCanonicalNewsPath,
  parseLegacyBlogPath
} from "../../src/modules/seo-distribution/domain/legacy-blog-redirect";

const CTX = { allowedHosts: ["tenant.example.com"] };

describe("validateRedirectInput", () => {
  test("accepts a valid relative rule and normalizes the source", () => {
    const r = validateRedirectInput(
      { sourcePath: "/old//page/", target: "/new" },
      CTX
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.normalizedSourcePath).toBe("/old/page");
      expect(r.value.targetType).toBe("relative_same_tenant");
      expect(r.value.statusCode).toBe(301);
      expect(r.value.state).toBe("active");
    }
  });

  test("rejects a self-redirect", () => {
    const r = validateRedirectInput({ sourcePath: "/a", target: "/a" }, CTX);
    expect(r.ok).toBe(false);
  });

  test("rejects an unsafe target (open-redirect)", () => {
    const r = validateRedirectInput(
      { sourcePath: "/a", target: "//evil.com" },
      CTX
    );
    expect(r.ok).toBe(false);
  });

  test("rejects an invalid status code", () => {
    const r = validateRedirectInput(
      { sourcePath: "/a", target: "/b", statusCode: 200 },
      CTX
    );
    expect(r.ok).toBe(false);
  });

  test("rejects effectiveUntil <= effectiveFrom", () => {
    const r = validateRedirectInput(
      {
        sourcePath: "/a",
        target: "/b",
        effectiveFrom: "2026-01-02T00:00:00Z",
        effectiveUntil: "2026-01-01T00:00:00Z"
      },
      CTX
    );
    expect(r.ok).toBe(false);
  });

  test("rejects a domain scope host the tenant does not own", () => {
    const r = validateRedirectInput(
      { sourcePath: "/a", target: "/b", domainScopeHost: "notmine.com" },
      CTX
    );
    expect(r.ok).toBe(false);
  });

  test("accepts a domain scope host the tenant owns", () => {
    const r = validateRedirectInput(
      { sourcePath: "/a", target: "/b", domainScopeHost: "tenant.example.com" },
      CTX
    );
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.domainScopeHost).toBe("tenant.example.com");
  });

  test("accepts an absolute same-tenant target as verified_external", () => {
    const r = validateRedirectInput(
      { sourcePath: "/a", target: "https://tenant.example.com/b" },
      CTX
    );
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.targetType).toBe("verified_external");
  });
});

describe("validateRedirectUpdate", () => {
  test("validates the mutable fields against the immutable source", () => {
    const r = validateRedirectUpdate(
      { target: "/b", statusCode: 302 },
      "/a",
      CTX
    );
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.statusCode).toBe(302);
  });

  test("rejects a self-redirect against the existing source", () => {
    const r = validateRedirectUpdate({ target: "/a" }, "/a", CTX);
    expect(r.ok).toBe(false);
  });
});

describe("validateRedirectSettings", () => {
  test("defaults + validation", () => {
    const r = validateRedirectSettings({
      legacyBlogRedirectEnabled: true,
      urlChangeAutoPolicy: "create"
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.legacyBlogRedirectEnabled).toBe(true);
      expect(r.value.urlChangeAutoPolicy).toBe("create");
    }
    expect(validateRedirectSettings({ urlChangeAutoPolicy: "bogus" }).ok).toBe(
      false
    );
  });
});

describe("planUrlChangeRedirect", () => {
  test("skip policy produces no rule", () => {
    const p = planUrlChangeRedirect(
      { oldPath: "/a", newPath: "/b", changeType: "slug_change" },
      "skip",
      CTX.allowedHosts
    );
    expect(p.action).toBe("skip");
  });

  test("propose policy produces an INACTIVE rule; create produces an ACTIVE one", () => {
    const propose = planUrlChangeRedirect(
      { oldPath: "/a", newPath: "/b", changeType: "slug_change" },
      "propose",
      CTX.allowedHosts
    );
    expect(propose.action).toBe("propose");
    if (propose.action === "propose") {
      expect(propose.rule.state).toBe("inactive");
      expect(propose.rule.origin).toBe("slug_change");
    }
    const create = planUrlChangeRedirect(
      { oldPath: "/a", newPath: "/b", changeType: "domain_change" },
      "create",
      CTX.allowedHosts
    );
    expect(create.action).toBe("create");
    if (create.action === "create") expect(create.rule.state).toBe("active");
  });

  test("invalid (self-redirect) old==new is rejected", () => {
    const p = planUrlChangeRedirect(
      { oldPath: "/a", newPath: "/a", changeType: "slug_change" },
      "create",
      CTX.allowedHosts
    );
    expect(p.action).toBe("invalid");
  });
});

describe("legacy-blog path mapping", () => {
  test("parses /blog/{tenantCode}[/rest]", () => {
    expect(parseLegacyBlogPath("/blog/acme")).toEqual({
      tenantCode: "acme",
      rest: ""
    });
    expect(parseLegacyBlogPath("/blog/acme/some-post")).toEqual({
      tenantCode: "acme",
      rest: "/some-post"
    });
    expect(parseLegacyBlogPath("/blog/acme/category/x")).toEqual({
      tenantCode: "acme",
      rest: "/category/x"
    });
  });

  test("returns null for non-legacy-blog paths", () => {
    expect(parseLegacyBlogPath("/blog")).toBeNull();
    expect(parseLegacyBlogPath("/blog/")).toBeNull();
    expect(parseLegacyBlogPath("/news/x")).toBeNull();
    expect(parseLegacyBlogPath("/other")).toBeNull();
  });

  test("maps to the canonical /news equivalent", () => {
    expect(buildCanonicalNewsPath("")).toBe("/news");
    expect(buildCanonicalNewsPath("/some-post")).toBe("/news/some-post");
  });
});
