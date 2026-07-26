import { fail, ok } from "../../../../modules/_shared/api-response";
import { defineTenantRoute } from "../../../../modules/_shared/tenant-route";
import { listLifecycleRuns } from "../../../../modules/data-lifecycle/application/run-record-store";

type RunType = "dry_run" | "archive" | "purge";

/**
 * `GET /api/v1/data-lifecycle/runs` (Issue #745) — lifecycle run history
 * (dry-run/archive/purge outcomes) for the caller's tenant, categorized
 * aggregate counts only — never row contents or PII.
 *
 * `workClass: "interactive"` (Issue #370) — a bounded, indexed history read
 * behind an admin screen; re-affirms the class it already ran under (see
 * `registry.ts`), so nothing changes at runtime.
 */
export const GET = defineTenantRoute({
  workClass: "interactive",
  authorize: {
    moduleKey: "data_lifecycle",
    activityCode: "runs",
    action: "read"
  },
  prepare: ({ url }) => {
    const runTypeParam = url.searchParams.get("runType");

    if (
      runTypeParam &&
      runTypeParam !== "dry_run" &&
      runTypeParam !== "archive" &&
      runTypeParam !== "purge"
    ) {
      return fail(
        400,
        "VALIDATION_ERROR",
        'runType must be "dry_run", "archive", or "purge".'
      );
    }

    return {
      descriptorKey: url.searchParams.get("descriptorKey") ?? undefined,
      runType: (runTypeParam as RunType | null) ?? undefined
    };
  },
  handler: async ({ tx, tenantId, prepared }) =>
    ok({ runs: await listLifecycleRuns(tx, tenantId, prepared) })
});
