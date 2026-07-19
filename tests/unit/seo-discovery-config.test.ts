import { describe, expect, test } from "bun:test";

import {
  EMPTY_SEO_TENANT_SETTINGS,
  FEED_ITEM_LIMIT_DEFAULT,
  validateSeoTenantSettings
} from "../../src/modules/seo-distribution/domain/seo-config";

/**
 * Issue #267 — validation + defaults for the NEW feed/sitemap/robots config
 * fields on `awcms_micro_seo_tenant_settings` (sql/082). Pure, no DB.
 */
describe("seo config feed fields — defaults (#267)", () => {
  test("EMPTY defaults: feeds/sitemap on, limit default, no include filter", () => {
    expect(EMPTY_SEO_TENANT_SETTINGS.feedTitle).toBeNull();
    expect(EMPTY_SEO_TENANT_SETTINGS.feedDescription).toBeNull();
    expect(EMPTY_SEO_TENANT_SETTINGS.feedLogoMediaId).toBeNull();
    expect(EMPTY_SEO_TENANT_SETTINGS.feedItemLimit).toBe(
      FEED_ITEM_LIMIT_DEFAULT
    );
    expect(EMPTY_SEO_TENANT_SETTINGS.includedResourceTypes).toBeNull();
    expect(EMPTY_SEO_TENANT_SETTINGS.sitemapEnabled).toBe(true);
    expect(EMPTY_SEO_TENANT_SETTINGS.feedsEnabled).toBe(true);
  });
});

describe("validateSeoTenantSettings — feed fields (#267)", () => {
  test("valid feed config round-trips", () => {
    const result = validateSeoTenantSettings({
      feedTitle: "  My Feed  ",
      feedDescription: "About",
      feedLogoMediaId: "11111111-1111-1111-1111-111111111111",
      feedItemLimit: 25,
      includedResourceTypes: ["blog_post", "product"],
      sitemapEnabled: false,
      feedsEnabled: true
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.feedTitle).toBe("My Feed");
    expect(result.value.feedItemLimit).toBe(25);
    expect(result.value.includedResourceTypes).toEqual([
      "blog_post",
      "product"
    ]);
    expect(result.value.sitemapEnabled).toBe(false);
    expect(result.value.feedsEnabled).toBe(true);
  });

  test("omitted booleans default on (sitemap/feeds enabled), limit defaults to 50", () => {
    const result = validateSeoTenantSettings({});
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.sitemapEnabled).toBe(true);
    expect(result.value.feedsEnabled).toBe(true);
    expect(result.value.feedItemLimit).toBe(50);
    expect(result.value.includedResourceTypes).toBeNull();
  });

  test("feedItemLimit out of range is rejected", () => {
    for (const bad of [0, -5, 201, 1000]) {
      const result = validateSeoTenantSettings({ feedItemLimit: bad });
      expect(result.ok).toBe(false);
      if (result.ok) continue;
      expect(result.errors[0]?.field).toBe("feedItemLimit");
    }
  });

  test("feedItemLimit non-integer is rejected", () => {
    const result = validateSeoTenantSettings({ feedItemLimit: 12.5 });
    expect(result.ok).toBe(false);
  });

  test("feedTitle over 200 chars is rejected", () => {
    const result = validateSeoTenantSettings({ feedTitle: "x".repeat(201) });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors[0]?.field).toBe("feedTitle");
  });

  test("feedLogoMediaId must be a UUID", () => {
    const result = validateSeoTenantSettings({ feedLogoMediaId: "not-a-uuid" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors[0]?.field).toBe("feedLogoMediaId");
  });

  test("empty includedResourceTypes collapses to null (all types), not an empty sitemap", () => {
    const result = validateSeoTenantSettings({ includedResourceTypes: [] });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.includedResourceTypes).toBeNull();
  });

  test("includedResourceTypes rejects non-slug entries and over-length lists", () => {
    expect(
      validateSeoTenantSettings({ includedResourceTypes: ["Bad Type"] }).ok
    ).toBe(false);
    expect(
      validateSeoTenantSettings({ includedResourceTypes: ["ok", "</x>"] }).ok
    ).toBe(false);
    expect(
      validateSeoTenantSettings({
        includedResourceTypes: Array.from({ length: 51 }, (_, i) => `t${i}`)
      }).ok
    ).toBe(false);
  });

  test("includedResourceTypes must be an array", () => {
    const result = validateSeoTenantSettings({
      includedResourceTypes: "blog_post"
    });
    expect(result.ok).toBe(false);
  });

  test("non-boolean sitemapEnabled/feedsEnabled rejected", () => {
    expect(validateSeoTenantSettings({ sitemapEnabled: "yes" }).ok).toBe(false);
    expect(validateSeoTenantSettings({ feedsEnabled: 1 }).ok).toBe(false);
  });

  test("duplicate include entries are de-duplicated", () => {
    const result = validateSeoTenantSettings({
      includedResourceTypes: ["blog_post", "blog_post", "product"]
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.includedResourceTypes).toEqual([
      "blog_post",
      "product"
    ]);
  });
});
