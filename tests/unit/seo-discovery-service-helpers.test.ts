import { describe, expect, test } from "bun:test";

import {
  absoluteUrl,
  computeLastModified,
  configFingerprint,
  contentFingerprintOf
} from "../../src/modules/seo-distribution/application/seo-discovery-service";
import { EMPTY_SEO_TENANT_SETTINGS } from "../../src/modules/seo-distribution/domain/seo-config";

/**
 * Issue #267 — the pure helpers of the discovery service (the aggregation itself
 * is integration-tested against a real DB). No DB here.
 */
describe("absoluteUrl (#267)", () => {
  test("with a host → absolute https URL", () => {
    expect(absoluteUrl("acme.example", "/news/hello")).toBe(
      "https://acme.example/news/hello"
    );
  });
  test("without a host → relative path (never invents a host)", () => {
    expect(absoluteUrl(null, "/news/hello")).toBe("/news/hello");
  });
});

describe("configFingerprint (#267)", () => {
  test("identical settings → identical fingerprint", () => {
    expect(configFingerprint(EMPTY_SEO_TENANT_SETTINGS)).toBe(
      configFingerprint({ ...EMPTY_SEO_TENANT_SETTINGS })
    );
  });

  test("any discovery-affecting field change → different fingerprint", () => {
    const base = configFingerprint(EMPTY_SEO_TENANT_SETTINGS);
    expect(
      configFingerprint({ ...EMPTY_SEO_TENANT_SETTINGS, feedTitle: "X" })
    ).not.toBe(base);
    expect(
      configFingerprint({ ...EMPTY_SEO_TENANT_SETTINGS, feedItemLimit: 10 })
    ).not.toBe(base);
    expect(
      configFingerprint({ ...EMPTY_SEO_TENANT_SETTINGS, sitemapEnabled: false })
    ).not.toBe(base);
    expect(
      configFingerprint({ ...EMPTY_SEO_TENANT_SETTINGS, feedsEnabled: false })
    ).not.toBe(base);
    expect(
      configFingerprint({
        ...EMPTY_SEO_TENANT_SETTINGS,
        defaultRobotsNoindex: true
      })
    ).not.toBe(base);
    expect(
      configFingerprint({
        ...EMPTY_SEO_TENANT_SETTINGS,
        includedResourceTypes: ["blog_post"]
      })
    ).not.toBe(base);
  });
});

describe("contentFingerprintOf (#267)", () => {
  test("encodes count + latest timestamps", () => {
    expect(
      contentFingerprintOf({
        count: 5,
        latestLastmod: "2026-07-19T10:00:00.000Z",
        latestPublishedAt: "2026-07-19T09:00:00.000Z"
      })
    ).toBe("5|2026-07-19T10:00:00.000Z|2026-07-19T09:00:00.000Z");
  });

  test("a count change or a timestamp change changes the fingerprint (invalidation signal)", () => {
    const base = contentFingerprintOf({
      count: 5,
      latestLastmod: "a",
      latestPublishedAt: "b"
    });
    expect(
      contentFingerprintOf({
        count: 6,
        latestLastmod: "a",
        latestPublishedAt: "b"
      })
    ).not.toBe(base);
    expect(
      contentFingerprintOf({
        count: 5,
        latestLastmod: "z",
        latestPublishedAt: "b"
      })
    ).not.toBe(base);
  });
});

describe("computeLastModified (#267)", () => {
  test("both null → epoch floor (stable; ETag remains the primary validator)", () => {
    expect(computeLastModified(null, null).getTime()).toBe(0);
  });
  test("content only", () => {
    expect(
      computeLastModified("2026-07-19T10:00:00.000Z", null).toISOString()
    ).toBe("2026-07-19T10:00:00.000Z");
  });
  test("config only", () => {
    const d = new Date("2026-07-19T08:00:00.000Z");
    expect(computeLastModified(null, d).getTime()).toBe(d.getTime());
  });
  test("both → the later of the two", () => {
    const content = "2026-07-19T10:00:00.000Z";
    const config = new Date("2026-07-19T08:00:00.000Z");
    expect(computeLastModified(content, config).toISOString()).toBe(content);
  });
});
