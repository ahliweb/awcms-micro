/**
 * Unit tests for redirect-target validation (Issue #268) — the open-redirect /
 * cross-tenant control, delegating to the frozen `classifyRedirectTarget` guard.
 * Pure, no DB.
 */
import { describe, expect, test } from "bun:test";

import { validateRedirectTarget } from "../../src/modules/seo-distribution/domain/redirect-target";

const HOSTS = ["tenant.example.com", "www.tenant.example.com"];

describe("validateRedirectTarget — accepted (same-tenant-internal only)", () => {
  test("relative same-origin path", () => {
    const r = validateRedirectTarget("/new-page", HOSTS);
    expect(r.ok && r.targetType).toBe("relative_same_tenant");
    expect(r.ok && r.target).toBe("/new-page");
  });

  test("relative path is normalized (dot-segments, dup slashes)", () => {
    const r = validateRedirectTarget("/a/../b//c", HOSTS);
    expect(r.ok && r.target).toBe("/b/c");
  });

  test("absolute URL to one of the tenant's verified hosts", () => {
    const r = validateRedirectTarget("https://tenant.example.com/x", HOSTS);
    expect(r.ok && r.targetType).toBe("verified_external");
  });
});

describe("validateRedirectTarget — rejected (open-redirect / cross-tenant vectors)", () => {
  test("cross-host absolute URL", () => {
    const r = validateRedirectTarget("https://evil.com/x", HOSTS);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.classification).toBe("cross_host_external");
  });

  test("protocol-relative", () => {
    expect(validateRedirectTarget("//evil.com", HOSTS).ok).toBe(false);
  });

  test("javascript: and data: schemes", () => {
    expect(validateRedirectTarget("javascript:alert(1)", HOSTS).ok).toBe(false);
    expect(validateRedirectTarget("data:text/html,<script>", HOSTS).ok).toBe(
      false
    );
  });

  test("backslash and CRLF confusion", () => {
    expect(validateRedirectTarget("/\\evil.com", HOSTS).ok).toBe(false);
    expect(validateRedirectTarget("/a\r\nLocation: x", HOSTS).ok).toBe(false);
  });

  test("credential trick host is cross-host, not internal", () => {
    const r = validateRedirectTarget(
      "https://tenant.example.com@evil.com/x",
      HOSTS
    );
    expect(r.ok).toBe(false);
  });

  test("empty / non-string", () => {
    expect(validateRedirectTarget("", HOSTS).ok).toBe(false);
    expect(validateRedirectTarget(123 as unknown as string, HOSTS).ok).toBe(
      false
    );
  });
});
