import { describe, expect, test } from "bun:test";

import { bracketChangelogHeadings } from "../../scripts/changelog-heading-brackets";

describe("bracketChangelogHeadings", () => {
  test("wraps a bare version heading in brackets", () => {
    const input = "# Changelog\n\n## 0.3.0\n\n### Minor Changes\n";

    expect(bracketChangelogHeadings(input)).toBe(
      "# Changelog\n\n## [0.3.0]\n\n### Minor Changes\n"
    );
  });

  test("preserves trailing text after the version", () => {
    const input = "## 0.2.0 — belum dirilis\n";

    expect(bracketChangelogHeadings(input)).toBe(
      "## [0.2.0] — belum dirilis\n"
    );
  });

  test("is idempotent on an already-bracketed heading", () => {
    const input = "## [0.24.0] - 2026-07-12\n";

    expect(bracketChangelogHeadings(input)).toBe(input);
  });

  test("leaves non-version ## headings untouched", () => {
    const input = "## Riwayat versi sebelum 0.2.0\n\n### Minor Changes\n";

    expect(bracketChangelogHeadings(input)).toBe(input);
  });

  test("handles a pre-release version suffix", () => {
    const input = "## 1.0.0-rc.1\n";

    expect(bracketChangelogHeadings(input)).toBe("## [1.0.0-rc.1]\n");
  });
});
