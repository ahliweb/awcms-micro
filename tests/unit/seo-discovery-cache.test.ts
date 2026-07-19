import { describe, expect, test } from "bun:test";

import {
  buildDiscoveryCacheControl,
  buildDiscoverySignature,
  buildEtag,
  contentHash,
  ifNoneMatchSatisfied,
  isNotModified,
  toHttpDate,
  type DiscoverySignatureParts
} from "../../src/modules/seo-distribution/domain/discovery-cache";
import { parseDiscoveryLocaleParam } from "../../src/lib/seo/discovery-route";

/**
 * Issue #267 — HTTP cache validators (ETag / Last-Modified / conditional 304)
 * and the deterministic signature they derive from. Pure, no DB.
 */

const BASE: DiscoverySignatureParts = {
  kind: "sitemap-index",
  tenantId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  host: "acme.example",
  locale: "en",
  contractVersion: "1.1.0",
  configFingerprint: "cfg",
  contentFingerprint: "5|2026-07-19T10:00:00.000Z|2026-07-19T09:00:00.000Z"
};

describe("discovery signature + ETag (#267)", () => {
  test("same parts → same signature → same ETag (deterministic)", () => {
    expect(buildDiscoverySignature(BASE)).toBe(
      buildDiscoverySignature({ ...BASE })
    );
    expect(buildEtag(buildDiscoverySignature(BASE))).toBe(
      buildEtag(buildDiscoverySignature({ ...BASE }))
    );
  });

  test("ETag is a quoted strong validator", () => {
    const etag = buildEtag(buildDiscoverySignature(BASE));
    expect(etag).toMatch(/^"[0-9a-f]{32}"$/);
  });

  test("a change in ANY signal changes the ETag (event-driven invalidation)", () => {
    const base = buildEtag(buildDiscoverySignature(BASE));
    // content change (publish/update/archive/delete moves the roll-up)
    expect(
      buildEtag(
        buildDiscoverySignature({ ...BASE, contentFingerprint: "6|x|y" })
      )
    ).not.toBe(base);
    // host change (domain change)
    expect(
      buildEtag(buildDiscoverySignature({ ...BASE, host: "other.example" }))
    ).not.toBe(base);
    // locale change
    expect(
      buildEtag(buildDiscoverySignature({ ...BASE, locale: "id" }))
    ).not.toBe(base);
    // config change
    expect(
      buildEtag(buildDiscoverySignature({ ...BASE, configFingerprint: "cfg2" }))
    ).not.toBe(base);
    // contract-version change invalidates every entry
    expect(
      buildEtag(buildDiscoverySignature({ ...BASE, contractVersion: "2.0.0" }))
    ).not.toBe(base);
    // page discriminator
    expect(buildEtag(buildDiscoverySignature({ ...BASE, page: 2 }))).not.toBe(
      base
    );
  });

  test("cross-tenant/host cache keys can never collide (host is part of the signature)", () => {
    const a = buildEtag(
      buildDiscoverySignature({ ...BASE, host: "tenant-a.example" })
    );
    const b = buildEtag(
      buildDiscoverySignature({ ...BASE, host: "tenant-b.example" })
    );
    expect(a).not.toBe(b);
  });

  test("tenantId is part of the signature (same host+config+content, different tenant → different ETag)", () => {
    // Two tenants that resolve to the SAME null-host sentinel (neither has a
    // verified primary domain) and have identical config/content would otherwise
    // share a cache key; tenantId keeps them isolated.
    const a = buildEtag(
      buildDiscoverySignature({ ...BASE, tenantId: "tenant-a-id" })
    );
    const b = buildEtag(
      buildDiscoverySignature({ ...BASE, tenantId: "tenant-b-id" })
    );
    expect(a).not.toBe(b);
  });

  test("the NUL join is injective — free-text parts with spaces cannot merge across the boundary", () => {
    // `configFingerprint` embeds spaces (site name, feed title, ...). A space
    // separator would make ("a b","c") and ("a","b c") collide; NUL cannot.
    const left = buildDiscoverySignature({
      ...BASE,
      configFingerprint: "a b",
      contentFingerprint: "c"
    });
    const right = buildDiscoverySignature({
      ...BASE,
      configFingerprint: "a",
      contentFingerprint: "b c"
    });
    expect(left).not.toBe(right);
    expect(buildEtag(left)).not.toBe(buildEtag(right));
  });

  test("contentHash is stable sha256 hex", () => {
    expect(contentHash("x")).toBe(contentHash("x"));
    expect(contentHash("x")).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe("conditional requests → 304 (#267)", () => {
  const etag = '"abc123"';
  const lastModified = toHttpDate(new Date("2026-07-19T10:00:00.000Z"));

  test("If-None-Match matching the ETag is not-modified", () => {
    const headers = new Headers({ "if-none-match": etag });
    expect(isNotModified(headers, etag, lastModified)).toBe(true);
  });

  test("If-None-Match with a different tag is modified", () => {
    const headers = new Headers({ "if-none-match": '"other"' });
    expect(isNotModified(headers, etag, lastModified)).toBe(false);
  });

  test("If-None-Match * always matches", () => {
    expect(ifNoneMatchSatisfied("*", etag)).toBe(true);
  });

  test("weak validator prefix W/ is ignored in comparison", () => {
    expect(ifNoneMatchSatisfied('W/"abc123"', etag)).toBe(true);
  });

  test("If-None-Match list with our tag among others matches", () => {
    expect(ifNoneMatchSatisfied('"x", "abc123", "y"', etag)).toBe(true);
  });

  test("If-Modified-Since at/after our Last-Modified is not-modified", () => {
    const headers = new Headers({ "if-modified-since": lastModified });
    expect(isNotModified(headers, etag, lastModified)).toBe(true);
  });

  test("If-Modified-Since before our Last-Modified is modified", () => {
    const older = toHttpDate(new Date("2026-07-19T09:00:00.000Z"));
    const headers = new Headers({ "if-modified-since": older });
    expect(isNotModified(headers, etag, lastModified)).toBe(false);
  });

  test("If-None-Match takes precedence over If-Modified-Since (RFC 7232 §6)", () => {
    // INM does not match → modified, even though IMS would say not-modified.
    const headers = new Headers({
      "if-none-match": '"stale"',
      "if-modified-since": lastModified
    });
    expect(isNotModified(headers, etag, lastModified)).toBe(false);
  });

  test("no conditional headers → modified (serve 200)", () => {
    expect(isNotModified(new Headers(), etag, lastModified)).toBe(false);
  });
});

describe("cache-control + locale param (#267)", () => {
  test("Cache-Control is public with bounded max-age + swr", () => {
    expect(buildDiscoveryCacheControl(300, 300, 600)).toBe(
      "public, max-age=300, s-maxage=300, stale-while-revalidate=600"
    );
  });

  test("locale param: valid BCP-47-ish passes; anything else → null", () => {
    expect(parseDiscoveryLocaleParam("en")).toBe("en");
    expect(parseDiscoveryLocaleParam("en-US")).toBe("en-US");
    expect(parseDiscoveryLocaleParam("pt-BR")).toBe("pt-BR");
    expect(parseDiscoveryLocaleParam(null)).toBeNull();
    expect(parseDiscoveryLocaleParam("")).toBeNull();
    expect(parseDiscoveryLocaleParam("../etc")).toBeNull();
    expect(parseDiscoveryLocaleParam("en'; DROP TABLE")).toBeNull();
    expect(parseDiscoveryLocaleParam("a".repeat(40))).toBeNull();
  });
});
