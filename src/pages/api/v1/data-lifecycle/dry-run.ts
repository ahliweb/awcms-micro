import { fail, ok } from "../../../../modules/_shared/api-response";
import { defineTenantRoute } from "../../../../modules/_shared/tenant-route";
import { listModules } from "../../../../modules";
import { collectHighVolumeTableDescriptors } from "../../../../modules/data-lifecycle/domain/lifecycle-registry";
import { planLifecycleDryRun } from "../../../../modules/data-lifecycle/application/dry-run-planner";
import { fetchActiveLegalHoldsForPlanning } from "../../../../modules/data-lifecycle/application/legal-hold-service";

type DryRunBody = {
  descriptorKey?: unknown;
  retentionDaysOverride?: unknown;
};

/**
 * `POST /api/v1/data-lifecycle/dry-run` (Issue #745) — on-demand,
 * read-only dry-run lifecycle plan for ONE descriptor. Deliberately POST
 * (a request body is required to name the target descriptor) but
 * genuinely zero-mutation — no `Idempotency-Key` is required (issue
 * #745 acceptance criterion: "dry-run performs no mutation") and, unlike
 * the scheduled job's own dry-run mode, this on-demand endpoint does NOT
 * persist a row to `awcms_micro_data_lifecycle_runs` either — it is a
 * pure computation with no side effect at all, safe to call repeatedly
 * with no idempotency concern by construction.
 *
 * `workClass: "interactive"` (Issue #370) — the planner's counting queries
 * are bounded by the descriptor's own batch limit and this is driven from
 * an admin screen that waits for the answer. Re-affirms the class it
 * already ran under; no runtime change. (The SCHEDULED lifecycle job that
 * runs the same planner unattended is separately classified in
 * `JOB_WORK_CLASS_REGISTRY` and is unaffected by this.)
 *
 * Body parsing and descriptor lookup stay in `prepare`, i.e. still BEFORE
 * any database work — a malformed body must not cost a pooled connection,
 * exactly as in the hand-written version this replaces.
 */
export const POST = defineTenantRoute({
  workClass: "interactive",
  authorize: {
    moduleKey: "data_lifecycle",
    activityCode: "plan",
    action: "analyze"
  },
  prepare: async ({ request }) => {
    let body: DryRunBody;
    try {
      body = (await request.json()) as DryRunBody;
    } catch {
      return fail(400, "VALIDATION_ERROR", "Request body must be valid JSON.");
    }

    if (
      typeof body.descriptorKey !== "string" ||
      body.descriptorKey.length === 0
    ) {
      return fail(400, "VALIDATION_ERROR", "descriptorKey is required.");
    }

    const descriptor = collectHighVolumeTableDescriptors(listModules()).find(
      (candidate) => candidate.key === body.descriptorKey
    );

    if (!descriptor) {
      return fail(
        404,
        "NOT_FOUND",
        `Unknown descriptor key: "${body.descriptorKey}".`
      );
    }
    if (descriptor.scope !== "tenant") {
      return fail(
        400,
        "VALIDATION_ERROR",
        `Descriptor "${descriptor.key}" has scope "global" — on-demand dry-run is only supported for scope: "tenant" descriptors today.`
      );
    }

    return {
      descriptor,
      retentionDaysOverride:
        typeof body.retentionDaysOverride === "number"
          ? body.retentionDaysOverride
          : undefined
    };
  },
  handler: async ({ tx, tenantId, now, prepared }) => {
    // Sequential, never `Promise.all` — one `tx` is one connection (#324).
    const activeHolds = await fetchActiveLegalHoldsForPlanning(tx, tenantId);
    const result = await planLifecycleDryRun(
      tx,
      prepared.descriptor,
      tenantId,
      activeHolds,
      now,
      prepared.retentionDaysOverride
    );

    return ok({ plan: result });
  }
});
