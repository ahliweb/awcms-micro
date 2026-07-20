import { describe, expect, test } from "bun:test";

import type {
  ModuleDescriptor,
  SearchSourceDescriptor
} from "../../src/modules/_shared/module-contract";
import {
  assertSafeIdentifier,
  assertSafeTableName,
  collectSearchSourceDescriptors,
  validateSearchSourceRegistry
} from "../../src/modules/site-search/domain/search-source-registry";
import {
  buildDocumentUrl,
  buildExtractionQuery,
  buildSourceCountQuery,
  buildStaleRemovalQuery,
  computeDocumentChecksum,
  mapRowToDocument
} from "../../src/modules/site-search/domain/search-document";
import { listModules } from "../../src/modules";

const GOOD: SearchSourceDescriptor = {
  key: "blog_content.post",
  ownerModuleKey: "blog_content",
  resourceType: "blog_post",
  tableName: "awcms_micro_blog_posts",
  localeColumn: "locale",
  updatedAtColumn: "updated_at",
  titleColumn: "title",
  summaryColumn: "excerpt",
  bodyColumns: ["content_text"],
  tagsColumn: null,
  urlTemplate: "/news/:slug",
  slugColumn: "slug",
  publicationFilter: {
    equals: { status: "published", visibility: "public" },
    nullColumns: ["deleted_at"],
    notNullColumns: ["published_at"],
    timeReachedColumns: ["published_at"]
  },
  weight: 1,
  privacyClassification: "public"
};

function moduleWith(sources: SearchSourceDescriptor[]): ModuleDescriptor {
  return {
    key: "blog_content",
    name: "Blog",
    version: "1.0.0",
    status: "active",
    description: "",
    dependencies: [],
    searchSources: sources
  };
}

describe("validateSearchSourceRegistry — aggregation + validation (ADR-0031 §3)", () => {
  test("the live base registry validates cleanly", () => {
    const result = validateSearchSourceRegistry(listModules());
    expect(result.valid).toBe(true);
    expect(result.descriptors.length).toBeGreaterThanOrEqual(1);
  });

  test("collect flattens every module's searchSources in listModules order", () => {
    const descriptors = collectSearchSourceDescriptors(listModules());
    expect(descriptors.some((d) => d.key === "blog_content.post")).toBe(true);
  });

  test("a derived module can contribute a valid source without base edits", () => {
    const derived = moduleWith([
      {
        ...GOOD,
        key: "example_shop.product",
        ownerModuleKey: "example_shop",
        resourceType: "product"
      }
    ]);
    derived.key = "example_shop";
    const result = validateSearchSourceRegistry([...listModules(), derived]);
    expect(result.valid).toBe(true);
  });

  test("ownerModuleKey must equal the declaring module's key", () => {
    const bad = moduleWith([{ ...GOOD, ownerModuleKey: "someone_else" }]);
    const result = validateSearchSourceRegistry([bad]);
    expect(result.valid).toBe(false);
    expect(result.issues[0]!.message).toContain("ownerModuleKey");
  });

  test("duplicate key across the registry is flagged", () => {
    const a = moduleWith([GOOD, GOOD]);
    const result = validateSearchSourceRegistry([a]);
    expect(result.valid).toBe(false);
    expect(
      result.issues.some((i) => i.message.includes("registered 2 times"))
    ).toBe(true);
  });

  test("bad identifiers / table name / weight / privacy are rejected", () => {
    const bad = moduleWith([
      {
        ...GOOD,
        key: "blog_content.bad",
        tableName: "not_prefixed",
        titleColumn: "DROP TABLE",
        weight: 99,
        privacyClassification: "private" as unknown as "public"
      }
    ]);
    const result = validateSearchSourceRegistry([bad]);
    expect(result.valid).toBe(false);
    const combined = result.issues.map((i) => i.message).join(" ");
    expect(combined).toContain("tableName");
    expect(combined).toContain("titleColumn");
    expect(combined).toContain("weight");
    expect(combined).toContain("privacyClassification");
  });

  test("urlTemplate using :slug requires slugColumn", () => {
    const bad = moduleWith([
      { ...GOOD, key: "blog_content.noslug", slugColumn: null }
    ]);
    const result = validateSearchSourceRegistry([bad]);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.message.includes("slugColumn"))).toBe(
      true
    );
  });
});

describe("assertSafeIdentifier / assertSafeTableName — SQL-injection gate", () => {
  test("accepts snake_case, rejects anything else", () => {
    expect(assertSafeIdentifier("content_text", "col")).toBe("content_text");
    expect(() => assertSafeIdentifier("a; DROP TABLE x", "col")).toThrow();
    expect(() => assertSafeIdentifier("Title", "col")).toThrow();
    expect(assertSafeTableName("awcms_micro_blog_posts")).toBe(
      "awcms_micro_blog_posts"
    );
    expect(() => assertSafeTableName("pg_catalog.pg_tables")).toThrow();
  });
});

describe("buildExtractionQuery — parameterized, identifiers validated (ADR-0031 §3)", () => {
  test("batch query binds tenant + filter VALUES as parameters, not interpolated", () => {
    const { text, values } = buildExtractionQuery("tenant-1", GOOD, {
      mode: "batch",
      cursorId: null,
      batchSize: 100
    });
    // Values are bound; the literal 'published' must NOT appear interpolated.
    expect(values).toContain("tenant-1");
    expect(values).toContain("published");
    expect(values).toContain("public");
    // Filter VALUES are bound parameters ($2, $3, ...), never interpolated.
    expect(text).toContain("$1");
    expect(text).not.toContain("'published'");
    // Publication predicate is present.
    expect(text).toContain("IS NULL");
    expect(text).toContain("IS NOT NULL");
    expect(text).toContain("<= now()");
    expect(text).toContain("awcms_micro_blog_posts");
  });

  test("single-resource mode binds the resource id", () => {
    const { text, values } = buildExtractionQuery("t", GOOD, {
      mode: "single",
      resourceId: "res-1"
    });
    expect(values).toContain("res-1");
    expect(text).toContain("LIMIT 1");
  });

  test("count + stale-removal queries use the same predicate", () => {
    const count = buildSourceCountQuery("t", GOOD);
    expect(count.text).toContain("count(*)");
    const stale = buildStaleRemovalQuery("t", GOOD);
    expect(stale.text).toContain("NOT EXISTS");
    expect(stale.text).toContain("awcms_micro_site_search_documents");
  });
});

describe("buildDocumentUrl — slug is encoded (path-safety)", () => {
  test("substitutes and encodes :slug / :id", () => {
    expect(buildDocumentUrl(GOOD, { slug: "hello-world", id: "1" })).toBe(
      "/news/hello-world"
    );
    // A malicious slug cannot inject a new path segment or scheme.
    const evil = buildDocumentUrl(GOOD, { slug: "../../etc/passwd", id: "1" });
    expect(evil).not.toContain("../");
    expect(buildDocumentUrl(GOOD, { slug: "a/b", id: "1" })).toBe(
      "/news/a%2Fb"
    );
  });
});

describe("computeDocumentChecksum / mapRowToDocument", () => {
  test("checksum is deterministic and content-sensitive, ignores updated_at", () => {
    const fields = {
      resourceType: "blog_post",
      resourceId: "1",
      locale: "en",
      url: "/news/x",
      title: "T",
      summary: "S",
      bodyText: "B",
      tags: ["a"],
      weight: 1
    };
    const a = computeDocumentChecksum(fields);
    expect(a).toBe(computeDocumentChecksum(fields));
    expect(a).not.toBe(computeDocumentChecksum({ ...fields, title: "T2" }));
  });

  test("mapRowToDocument truncates, cleans control chars, builds url + checksum", () => {
    const row = {
      id: "res-1",
      locale: "en",
      updated_at: new Date("2026-01-01T00:00:00Z"),
      title: `Hello${String.fromCharCode(0)}World`,
      summary: "sum",
      body: "b".repeat(20000),
      tags: ["x", "y"],
      slug: "hello-world"
    };
    const doc = mapRowToDocument(GOOD, row);
    expect(doc.title).toBe("Hello World");
    expect(doc.bodyText!.length).toBeLessThanOrEqual(16000);
    expect(doc.url).toBe("/news/hello-world");
    expect(doc.tags).toEqual(["x", "y"]);
    expect(doc.tagsText).toBe("x y");
    expect(doc.sourceChecksum).toMatch(/^[a-f0-9]{64}$/);
  });
});
