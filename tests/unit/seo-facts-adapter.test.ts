import { describe, expect, test } from "bun:test";

import {
  isPubliclyIndexable,
  isPubliclyResolvable
} from "../../src/modules/_shared/ports/seo-facts-port";
import { deriveVisibility } from "../../src/modules/blog-content/application/seo-facts-port-adapter";

const NOW = "2026-07-19T12:00:00.000Z";
const PAST = new Date("2026-01-01T00:00:00.000Z");
const FUTURE = new Date("2999-01-01T00:00:00.000Z");

type Row = Parameters<typeof deriveVisibility>[0];

function makeRow(overrides: Partial<Row> = {}): Row {
  return {
    id: "post-1",
    title: "T",
    slug: "t",
    excerpt: null,
    seo_title: null,
    meta_description: null,
    locale: "en",
    status: "published",
    visibility: "public",
    featured_media_id: null,
    seo_image_media_id: null,
    published_at: PAST,
    scheduled_at: null,
    updated_at: PAST,
    deleted_at: null,
    ...overrides
  } as Row;
}

describe("deriveVisibility (blog_content seo_facts adapter) — fail-closed", () => {
  test("published + public → resolvable AND indexable", () => {
    const v = deriveVisibility(makeRow());
    expect(isPubliclyResolvable(v, NOW)).toBe(true);
    expect(isPubliclyIndexable(v, NOW)).toBe(true);
  });

  test("published + unlisted → resolvable but NOT indexable", () => {
    const v = deriveVisibility(makeRow({ visibility: "unlisted" }));
    expect(isPubliclyResolvable(v, NOW)).toBe(true);
    expect(isPubliclyIndexable(v, NOW)).toBe(false);
  });

  test("published + private → neither resolvable nor indexable", () => {
    const v = deriveVisibility(makeRow({ visibility: "private" }));
    expect(v.state).toBe("private");
    expect(isPubliclyResolvable(v, NOW)).toBe(false);
    expect(isPubliclyIndexable(v, NOW)).toBe(false);
  });

  test("FAIL-CLOSED: an unrecognized visibility is treated as private (never public/indexable)", () => {
    // Past the DB CHECK constraint (a value cast around the type system). The
    // old `else`-returns-published branch would have treated this as public.
    const v = deriveVisibility(
      makeRow({ visibility: "totally_unknown" as Row["visibility"] })
    );
    expect(v.state).toBe("private");
    expect(v.noindex).toBe(true);
    expect(isPubliclyResolvable(v, NOW)).toBe(false);
    expect(isPubliclyIndexable(v, NOW)).toBe(false);
  });

  test("FAIL-CLOSED: an unrecognized status is treated as unpublished (never public)", () => {
    const v = deriveVisibility(
      makeRow({ status: "some_new_status" as Row["status"] })
    );
    expect(v.state).toBe("unpublished");
    expect(isPubliclyResolvable(v, NOW)).toBe(false);
    expect(isPubliclyIndexable(v, NOW)).toBe(false);
  });

  test("published but future published_at → reported as scheduled (kept private until its time)", () => {
    const v = deriveVisibility(makeRow({ published_at: FUTURE }));
    expect(v.state).toBe("scheduled");
    expect(isPubliclyResolvable(v, NOW)).toBe(false);
  });

  test("draft / review / archived / soft-deleted are never publicly resolvable", () => {
    for (const patch of [
      { status: "draft" },
      { status: "review" },
      { status: "archived" },
      { deleted_at: PAST }
    ] as Partial<Row>[]) {
      const v = deriveVisibility(makeRow(patch));
      expect(isPubliclyResolvable(v, NOW)).toBe(false);
    }
  });
});
