import { describe, expect, test } from "bun:test";

import {
  checkCapabilityRegistry,
  checkMediaLibraryStatusFacts,
  checkNoConsumerConsumesRetiredCapability,
  checkPresetMediaInvariant,
  checkReconcileJobOwnership,
  checkSourceCommentsNoPlaceholder,
  runMediaLibraryConsistencyCheck
} from "../../scripts/media-library-consistency-check";
import type { ModuleDescriptor } from "../../src/modules/_shared/module-contract";
import type { ModulePresetDefinition } from "../../src/modules/module-management/domain/module-presets";

function descriptor(
  overrides: Partial<ModuleDescriptor> = {}
): ModuleDescriptor {
  return {
    key: "media_library",
    name: "Media Library",
    version: "0.2.0",
    status: "active",
    description: "Media.",
    dependencies: [],
    type: "system",
    capabilities: { provides: ["media_library"] },
    ...overrides
  };
}

function preset(
  overrides: Partial<ModulePresetDefinition> = {}
): ModulePresetDefinition {
  return {
    name: "online_website",
    label: "Online website",
    description: "test",
    enabledModuleKeys: [],
    ...overrides
  };
}

describe("checkMediaLibraryStatusFacts", () => {
  test("passes for an active, system-type, media_library-providing descriptor", () => {
    expect(checkMediaLibraryStatusFacts([descriptor()])).toEqual([]);
  });

  test("flags a missing media_library module", () => {
    const problems = checkMediaLibraryStatusFacts([
      descriptor({ key: "blog_content", capabilities: undefined })
    ]);
    expect(problems.length).toBe(1);
    expect(problems[0]).toContain("not registered");
  });

  test("flags a non-active status (the step-1 experimental placeholder regression)", () => {
    const problems = checkMediaLibraryStatusFacts([
      descriptor({ status: "experimental" })
    ]);
    expect(problems.some((p) => p.includes('status is "experimental"'))).toBe(
      true
    );
  });

  test("flags a descriptor that no longer provides the media_library capability", () => {
    const problems = checkMediaLibraryStatusFacts([
      descriptor({ capabilities: { provides: [] } })
    ]);
    expect(problems.some((p) => p.includes("does not provide"))).toBe(true);
  });
});

describe("checkCapabilityRegistry", () => {
  test("passes when media_library is present and news_media is absent", () => {
    expect(
      checkCapabilityRegistry({
        media_library: "1.0.0",
        public_content: "1.0.0"
      })
    ).toEqual([]);
  });

  test("flags a still-present retired news_media key", () => {
    const problems = checkCapabilityRegistry({
      media_library: "1.0.0",
      news_media: "1.0.0"
    });
    expect(problems.some((p) => p.includes("news_media"))).toBe(true);
  });

  test("flags a missing media_library key", () => {
    const problems = checkCapabilityRegistry({ public_content: "1.0.0" });
    expect(problems.some((p) => p.includes("missing"))).toBe(true);
  });
});

describe("checkNoConsumerConsumesRetiredCapability", () => {
  test("passes when consumers only consume media_library", () => {
    const consumer = descriptor({
      key: "blog_content",
      capabilities: {
        consumes: [{ capability: "media_library", providedBy: "media_library" }]
      }
    });
    expect(checkNoConsumerConsumesRetiredCapability([consumer])).toEqual([]);
  });

  test("flags a consumer still bound to the retired news_media capability", () => {
    const consumer = descriptor({
      key: "social_publishing",
      capabilities: {
        consumes: [{ capability: "news_media", providedBy: "news_portal" }]
      }
    });
    const problems = checkNoConsumerConsumesRetiredCapability([consumer]);
    expect(problems.length).toBe(1);
    expect(problems[0]).toContain("social_publishing");
  });
});

describe("checkPresetMediaInvariant", () => {
  test("passes when a blog_content preset also enables media_library", () => {
    expect(
      checkPresetMediaInvariant([
        preset({ enabledModuleKeys: ["blog_content", "media_library"] })
      ])
    ).toEqual([]);
  });

  test("flags a preset that enables a media consumer but not media_library", () => {
    const problems = checkPresetMediaInvariant([
      preset({ name: "online_website", enabledModuleKeys: ["blog_content"] })
    ]);
    expect(problems.length).toBe(1);
    expect(problems[0]).toContain("online_website");
  });

  test("does not require media_library for a preset with no media consumer", () => {
    expect(
      checkPresetMediaInvariant([
        preset({ name: "saas_online", enabledModuleKeys: ["tenant_domain"] })
      ])
    ).toEqual([]);
  });
});

describe("checkReconcileJobOwnership", () => {
  const reconcileJob = {
    command: "bun run news-media:reconcile",
    purpose: "p",
    recommendedSchedule: "s",
    environmentNotes: "e",
    safeInOfflineLan: false
  };

  test("passes when media_library owns the reconcile job and news_portal does not", () => {
    const registry = [
      descriptor({ key: "media_library", jobs: [reconcileJob] }),
      descriptor({ key: "news_portal", jobs: undefined })
    ];
    expect(checkReconcileJobOwnership(registry)).toEqual([]);
  });

  test("flags the job still declared on news_portal", () => {
    const registry = [
      descriptor({ key: "media_library", jobs: [reconcileJob] }),
      descriptor({ key: "news_portal", jobs: [reconcileJob] })
    ];
    const problems = checkReconcileJobOwnership(registry);
    expect(problems.some((p) => p.includes("news_portal still declares"))).toBe(
      true
    );
  });

  test("flags media_library not declaring the reconcile job it owns", () => {
    const registry = [
      descriptor({ key: "media_library", jobs: undefined }),
      descriptor({ key: "news_portal", jobs: undefined })
    ];
    const problems = checkReconcileJobOwnership(registry);
    expect(
      problems.some((p) => p.includes("media_library does not declare"))
    ).toBe(true);
  });
});

describe("checkSourceCommentsNoPlaceholder", () => {
  test("passes for prose describing media_library affirmatively", () => {
    expect(
      checkSourceCommentsNoPlaceholder([
        { path: "x.ts", content: "media_library owns the registry" }
      ])
    ).toEqual([]);
  });

  test("flags a stale 'owns no code yet' comment", () => {
    const problems = checkSourceCommentsNoPlaceholder([
      { path: "x.ts", content: "registered experimental, owns no code yet" }
    ]);
    expect(problems.length).toBeGreaterThan(0);
    expect(problems.some((p) => p.includes("experimental"))).toBe(true);
    expect(problems.some((p) => p.includes("owns no code"))).toBe(true);
  });
});

describe("runMediaLibraryConsistencyCheck (against the live repo)", () => {
  test("the real repository is consistent — this gate is green on main", async () => {
    const problems = await runMediaLibraryConsistencyCheck();
    expect(problems).toEqual([]);
  });
});
