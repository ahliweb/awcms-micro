/**
 * Issue #372 — `/admin/tenant/domains`' client-side hostname shape check and
 * its optional-field normalizer, now importable from
 * `modules/tenant-domain/presentation/tenant-domains-admin-client.ts`.
 *
 * `looksLikeValidHostname` is the page's only real client-side rejection
 * branch: every value it rejects never reaches the API at all. It mirrors
 * (never replaces) `normalizePublicHost()`'s shape rules — the API's
 * `validateCreateTenantDomainInput` remains the enforcement boundary — but
 * while it lived inside a `.astro` `<script>` nothing verified that the
 * mirror still matched, so a drifted rule would have shown up only as a
 * domain an admin could not add and no explanation why.
 */
import { describe, expect, test } from "bun:test";

import {
  looksLikeValidHostname,
  optionalTrimmed
} from "../../src/modules/tenant-domain/presentation/tenant-domains-admin-client";
import { selectedStatusValue } from "../../src/modules/tenant-domain/presentation/tenant-domains-page-data";

describe("looksLikeValidHostname — accepted (Issue #372)", () => {
  test("plain and multi-label hostnames", () => {
    expect(looksLikeValidHostname("example.com")).toBe(true);
    expect(looksLikeValidHostname("news.example.co.id")).toBe(true);
    expect(looksLikeValidHostname("a.b")).toBe(true);
  });

  test("digits and inner hyphens are legal label characters", () => {
    expect(looksLikeValidHostname("my-tenant-01.example.com")).toBe(true);
    expect(looksLikeValidHostname("123.example.com")).toBe(true);
  });

  test("surrounding whitespace and upper case are normalized, not rejected", () => {
    expect(looksLikeValidHostname("  Example.COM  ")).toBe(true);
  });

  test("a single-label host (LAN/dev style) is allowed", () => {
    expect(looksLikeValidHostname("localhost")).toBe(true);
  });
});

describe("looksLikeValidHostname — rejected (Issue #372)", () => {
  test("empty or whitespace-only input", () => {
    expect(looksLikeValidHostname("")).toBe(false);
    expect(looksLikeValidHostname("   ")).toBe(false);
  });

  test("a port is not part of a hostname", () => {
    expect(looksLikeValidHostname("example.com:8080")).toBe(false);
  });

  test("a URL rather than a hostname", () => {
    expect(looksLikeValidHostname("https://example.com")).toBe(false);
    expect(looksLikeValidHostname("example.com/news")).toBe(false);
  });

  test("leading, trailing, or doubled dots", () => {
    expect(looksLikeValidHostname(".example.com")).toBe(false);
    expect(looksLikeValidHostname("example.com.")).toBe(false);
    expect(looksLikeValidHostname("example..com")).toBe(false);
  });

  test("underscores (legal in DNS, not in a public hostname)", () => {
    expect(looksLikeValidHostname("my_tenant.example.com")).toBe(false);
  });

  test("inner whitespace", () => {
    expect(looksLikeValidHostname("exa mple.com")).toBe(false);
    expect(looksLikeValidHostname("example.com\tfoo")).toBe(false);
  });

  test("a label starting or ending with a hyphen", () => {
    expect(looksLikeValidHostname("-example.com")).toBe(false);
    expect(looksLikeValidHostname("example-.com")).toBe(false);
  });

  test("a label longer than 63 characters", () => {
    expect(looksLikeValidHostname(`${"a".repeat(64)}.com`)).toBe(false);
    expect(looksLikeValidHostname(`${"a".repeat(63)}.com`)).toBe(true);
  });

  test("an overall length above 253 characters", () => {
    const tooLong = `${Array.from({ length: 26 }, () => "a".repeat(9)).join(
      "."
    )}.com`;

    expect(tooLong.length).toBeGreaterThan(253);
    expect(looksLikeValidHostname(tooLong)).toBe(false);
  });

  test("non-ASCII characters (a punycode host must be entered encoded)", () => {
    expect(looksLikeValidHostname("münchen.example")).toBe(false);
  });
});

describe("optionalTrimmed (Issue #372)", () => {
  test("an untouched or blank field becomes null, never an empty string", () => {
    expect(optionalTrimmed(null)).toBeNull();
    expect(optionalTrimmed("")).toBeNull();
    expect(optionalTrimmed("   ")).toBeNull();
  });

  test("a real value is trimmed and kept", () => {
    expect(optionalTrimmed("  _acme-challenge  ")).toBe("_acme-challenge");
  });
});

describe("selectedStatusValue (Issue #372)", () => {
  test("a status the admin may transition to starts selected", () => {
    // `TENANT_DOMAIN_UPDATABLE_STATUSES` = pending_verification | suspended
    // | failed. `active` is deliberately NOT in it: a domain becomes active
    // by passing verification, never by an admin picking it from this list.
    expect(selectedStatusValue("pending_verification")).toBe(
      "pending_verification"
    );
    expect(selectedStatusValue("suspended")).toBe("suspended");
    expect(selectedStatusValue("failed")).toBe("failed");
  });

  test("a status outside the updatable set falls back to 'no change'", () => {
    expect(selectedStatusValue("active")).toBe("");
    expect(selectedStatusValue("whatever-new-enum-value")).toBe("");
  });
});
