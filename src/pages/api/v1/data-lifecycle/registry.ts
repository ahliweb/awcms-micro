import { ok } from "../../../../modules/_shared/api-response";
import { defineTenantRoute } from "../../../../modules/_shared/tenant-route";
import { listModules } from "../../../../modules";
import { collectHighVolumeTableDescriptors } from "../../../../modules/data-lifecycle/domain/lifecycle-registry";

/**
 * `GET /api/v1/data-lifecycle/registry` (Issue #745) — every registered
 * `HighVolumeTableDescriptor` (code-declared metadata only: table/owner/
 * scope/cursor/retention bounds/partition/archive/deletion/legal-hold/
 * index/batch-limit facts — NEVER row contents, never a live count).
 * Auth/ABAC still applies (same reasoning `GET /api/v1/modules` already
 * established for other code-derived, non-tenant-scoped registries):
 * role/permission grants themselves are tenant-scoped even though this
 * response body is identical for every tenant.
 *
 * `workClass: "interactive"` (Issue #370) — an admin-screen read whose only
 * database work is the guard chain itself. This RE-AFFIRMS the class the
 * route already ran under, so migrating to `defineTenantRoute` flips the
 * work-class registry's `source` (`"default"` → `"explicit"`) and changes
 * nothing at runtime; re-tiering a route is a separate, reviewable decision.
 */
export const GET = defineTenantRoute({
  workClass: "interactive",
  authorize: {
    moduleKey: "data_lifecycle",
    activityCode: "registry",
    action: "read"
  },
  handler: () =>
    ok({ descriptors: collectHighVolumeTableDescriptors(listModules()) })
});
