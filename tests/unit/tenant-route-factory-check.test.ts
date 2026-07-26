import { describe, expect, test } from "bun:test";

import {
  callsWithTenantDirectly,
  evaluateTenantRouteMigration
} from "../../scripts/tenant-route-factory-check";

describe("api:tenant-route:check (Issue #370)", () => {
  test("a call written as withTenant<T>( counts — same false negative PR #770 found in the work-class scanner", () => {
    expect(
      callsWithTenantDirectly(
        "const result = await withTenant<CreateTxResult>(sql, tenantId, fn);"
      )
    ).toBe(true);
  });

  test("a comment naming withTenant( does not count", () => {
    expect(
      callsWithTenantDirectly(
        " * The factory calls withTenant(...) on the route's behalf.\n// see withTenant(sql)\nexport const GET = defineTenantRoute({});"
      )
    ).toBe(false);
  });

  test("a route using the factory does not count", () => {
    expect(
      callsWithTenantDirectly(
        'export const GET = defineTenantRoute({ workClass: "interactive" });'
      )
    ).toBe(false);
  });

  test("a NEW route calling withTenant directly is reported — new routes may not be allowlisted", () => {
    const result = evaluateTenantRouteMigration(
      [
        {
          path: "src/pages/api/v1/brand-new/thing.ts",
          content: "return withTenant(sql, tenantId, fn);"
        }
      ],
      ["src/pages/api/v1/legacy/other.ts"]
    );

    expect(result.unlisted).toEqual(["src/pages/api/v1/brand-new/thing.ts"]);
  });

  test("an allowlist entry that was migrated (or deleted) is reported stale — the list may only shrink", () => {
    const result = evaluateTenantRouteMigration(
      [
        {
          path: "src/pages/api/v1/legacy/other.ts",
          content:
            'export const GET = defineTenantRoute({ workClass: "interactive" });'
        }
      ],
      ["src/pages/api/v1/legacy/other.ts", "src/pages/api/v1/legacy/gone.ts"]
    );

    expect(result.unlisted).toEqual([]);
    expect(result.stale).toEqual([
      "src/pages/api/v1/legacy/other.ts",
      "src/pages/api/v1/legacy/gone.ts"
    ]);
  });

  test("an allowlisted route that still calls withTenant directly is neither unlisted nor stale", () => {
    const result = evaluateTenantRouteMigration(
      [
        {
          path: "src/pages/api/v1/legacy/other.ts",
          content: "return withTenant(sql, tenantId, fn);"
        }
      ],
      ["src/pages/api/v1/legacy/other.ts"]
    );

    expect(result).toEqual({ unlisted: [], stale: [] });
  });
});
