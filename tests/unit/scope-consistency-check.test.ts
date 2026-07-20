import { describe, expect, test } from "bun:test";

import {
  EXCLUDED_MODULE_KEYS,
  EXPECTED_BASE_MODULE_COUNT,
  checkAsyncApiFreeOfExcludedModules,
  checkBaseModuleCount,
  checkInventoriesFreeOfExcludedModules,
  checkModuleCountClaim,
  checkOpenApiPathsFreeOfExcludedModules,
  checkRegistryExcludesErpModules
} from "../../scripts/scope-consistency-check";

/**
 * Fixture unit tests for the pure helpers of `bun run scope:consistency:check`
 * (Issue #263, epic #261). Each helper is exercised with a synthetic GOOD input
 * (the reconciled WEBSITE registry) and a synthetic BAD input (an excluded ERP
 * module reintroduced, a nonexistent route/table reference, or a module-count
 * drift) so the gate's detection logic is proven independent of the live repo.
 */

const ACTIVE_22 = [
  "tenant_admin",
  "profile_identity",
  "identity_access",
  "logging",
  "module_management",
  "sync_storage",
  "media_library",
  "domain_event_runtime",
  "data_lifecycle",
  "reporting",
  "email",
  "form_drafts",
  "tenant_domain",
  "blog_content",
  "news_portal",
  "social_publishing",
  "visitor_analytics",
  "seo_distribution",
  "theming",
  "site_search",
  "comments",
  "newsletter"
] as const;

describe("checkRegistryExcludesErpModules — stale module names", () => {
  test("clean 22-module WEBSITE registry passes", () => {
    expect(checkRegistryExcludesErpModules([...ACTIVE_22])).toEqual([]);
  });

  test("flags a reintroduced excluded ERP module", () => {
    const problems = checkRegistryExcludesErpModules([
      ...ACTIVE_22,
      "workflow"
    ]);
    expect(problems.length).toBe(1);
    expect(problems[0]).toContain("workflow");
    expect(problems[0]).toContain("ADR-0025");
  });

  test("every excluded key is detected", () => {
    for (const excluded of EXCLUDED_MODULE_KEYS) {
      const problems = checkRegistryExcludesErpModules([
        ...ACTIVE_22,
        excluded
      ]);
      expect(problems.length).toBe(1);
      expect(problems[0]).toContain(excluded);
    }
  });

  test("does not false-positive on lookalike active keys", () => {
    // `data_lifecycle` must never trip `data_exchange`, `domain_event_runtime`
    // must never trip anything, etc.
    expect(checkRegistryExcludesErpModules([...ACTIVE_22])).toEqual([]);
  });
});

describe("checkBaseModuleCount — module-count drift", () => {
  test("exactly EXPECTED_BASE_MODULE_COUNT passes", () => {
    expect(checkBaseModuleCount(EXPECTED_BASE_MODULE_COUNT)).toEqual([]);
    expect(checkBaseModuleCount(ACTIVE_22.length)).toEqual([]);
  });

  test("flags an inflated count (excluded module re-added)", () => {
    const problems = checkBaseModuleCount(23);
    expect(problems.length).toBe(1);
    expect(problems[0]).toContain("23");
    expect(problems[0]).toContain(String(EXPECTED_BASE_MODULE_COUNT));
  });

  test("flags a deflated count (module dropped)", () => {
    expect(checkBaseModuleCount(16).length).toBe(1);
  });
});

describe("checkAsyncApiFreeOfExcludedModules — nonexistent event channels", () => {
  const goodChannels = [
    "awcms-micro.sync.push.requested",
    "awcms-micro.blog-content.post.published",
    "awcms-micro.profile-identity.profile.merged"
  ];
  const goodRefs = [
    "#/channels/awcms-micro.blog-content.post.published",
    "#/channels/awcms-micro.profile-identity.profile.merged"
  ];

  test("clean channels + operation refs pass", () => {
    expect(checkAsyncApiFreeOfExcludedModules(goodChannels, goodRefs)).toEqual(
      []
    );
  });

  test("flags an excluded-module channel key", () => {
    const problems = checkAsyncApiFreeOfExcludedModules(
      [...goodChannels, "awcms-micro.workflow.instance.started"],
      goodRefs
    );
    expect(problems.length).toBe(1);
    expect(problems[0]).toContain("awcms-micro.workflow.");
  });

  test("flags an excluded-module operation channel $ref even if the channel is gone", () => {
    const problems = checkAsyncApiFreeOfExcludedModules(goodChannels, [
      ...goodRefs,
      "#/channels/awcms-micro.organization-structure.unit.created"
    ]);
    expect(problems.length).toBe(1);
    expect(problems[0]).toContain("organization-structure");
  });

  test("does not false-positive on a similarly-named active channel", () => {
    // `sync.push` and `blog-content` contain no excluded namespace segment.
    expect(
      checkAsyncApiFreeOfExcludedModules(
        ["awcms-micro.data-lifecycle.retention.purged"],
        []
      )
    ).toEqual([]);
  });
});

describe("checkOpenApiPathsFreeOfExcludedModules — nonexistent routes", () => {
  const goodPaths = [
    "/api/v1/health",
    "/api/v1/blog/posts",
    "/api/v1/identity/business-scope/assignments",
    "/api/v1/media/objects"
  ];

  test("clean paths pass", () => {
    expect(checkOpenApiPathsFreeOfExcludedModules(goodPaths)).toEqual([]);
  });

  test("flags a workflow route", () => {
    const problems = checkOpenApiPathsFreeOfExcludedModules([
      ...goodPaths,
      "/api/v1/workflows/tasks/{id}/decisions"
    ]);
    expect(problems.length).toBe(1);
    expect(problems[0]).toContain("/workflows");
  });

  test("flags a reference-data route", () => {
    const problems = checkOpenApiPathsFreeOfExcludedModules([
      "/api/v1/reference-data/value-sets"
    ]);
    expect(problems.length).toBe(1);
    expect(problems[0]).toContain("reference-data");
  });

  test("does not false-positive on `data-lifecycle` or `business-scope`", () => {
    expect(
      checkOpenApiPathsFreeOfExcludedModules([
        "/api/v1/data-lifecycle/legal-holds/{id}/release",
        "/api/v1/identity/business-scope/assignments"
      ])
    ).toEqual([]);
  });
});

describe("checkInventoriesFreeOfExcludedModules — generated inventory drift", () => {
  test("a clean inventory passes", () => {
    const content = [
      "| `blog_content` | ... |",
      "| `data_lifecycle` | ... |",
      "| `media_library` | ... |"
    ].join("\n");
    expect(
      checkInventoriesFreeOfExcludedModules([
        { path: "docs/awcms-micro/repo-inventory.md", content }
      ])
    ).toEqual([]);
  });

  test("flags an excluded module key with its line number", () => {
    const content = [
      "| `blog_content` | ... |",
      "| `workflow` | ... |",
      "| `data_lifecycle` | ... |"
    ].join("\n");
    const problems = checkInventoriesFreeOfExcludedModules([
      { path: "docs/awcms-micro/repo-inventory.md", content }
    ]);
    expect(problems.length).toBe(1);
    expect(problems[0]).toContain("repo-inventory.md:2");
    expect(problems[0]).toContain("workflow");
  });

  test("word-boundary: `data_lifecycle` does NOT trip `data_exchange`", () => {
    const content = "| `data_lifecycle` | `domain_event_runtime` |";
    expect(
      checkInventoriesFreeOfExcludedModules([
        { path: "docs/awcms-micro/repo-inventory.md", content }
      ])
    ).toEqual([]);
  });
});

describe("checkModuleCountClaim — documented count matches registry", () => {
  test("matching count passes", () => {
    expect(checkModuleCountClaim("repo-inventory.md", 17, 17)).toEqual([]);
  });

  test("flags a stale documented count", () => {
    const problems = checkModuleCountClaim("repo-inventory.md", 23, 17);
    expect(problems.length).toBe(1);
    expect(problems[0]).toContain("23");
    expect(problems[0]).toContain("17");
  });

  test("flags a missing anchor phrase (null)", () => {
    const problems = checkModuleCountClaim("repo-inventory.md", null, 17);
    expect(problems.length).toBe(1);
    expect(problems[0]).toContain("anchor");
  });
});
