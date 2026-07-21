import { defaultBusinessScopeHierarchyPortAdapter } from "../../../../../modules/identity-access/application/business-scope-hierarchy-port-adapter";
import type { BusinessScopeHierarchyPort } from "../../../../../modules/_shared/ports/business-scope-hierarchy-port";

/**
 * The REAL `BusinessScopeHierarchyPort` composition (Issue #786, follow-up
 * to #746/#749; factored out of `assignments/index.ts` by Issue #802 so
 * `assignments/[id]/revoke.ts` can share the exact same composition root
 * instead of duplicating it). `identity_access`'s own `application`/`domain`
 * tree never imports a hierarchy-providing module — that would be a
 * Core-depends-on-Optional violation, ADR-0013 §1 — so only a route (a real
 * composition root, this file's callers) may decide which adapter to wire in.
 *
 * AWCMS-Micro registers NO hierarchy provider. `organization_structure` is an
 * ERP-scope module this website-scope repo deliberately does not port (ADR-0025
 * §"Modul yang tidak diport"), so the composition resolves to identity-access's
 * own FLAT adapter: every business scope is a leaf. That is the correct model
 * for a website tenant, whose scopes are sites/sections rather than a
 * legal-entity tree.
 *
 * This function is kept — rather than inlining the flat adapter at both call
 * sites — precisely BECAUSE it is the sanctioned seam. A real hierarchy module
 * added directly to `src/modules/` (ADR-0036) that provides the
 * `business_scope_hierarchy` capability adds its adapter HERE (tried first,
 * falling through to the flat adapter for any scope type it does not own, which
 * is safe because a non-owning adapter returns `resolved: false`) and touches
 * nothing else.
 */
export function buildBusinessScopeHierarchyPort(): BusinessScopeHierarchyPort {
  return {
    async resolveScope(tx, tenantId, scopeType, scopeId) {
      return defaultBusinessScopeHierarchyPortAdapter.resolveScope(
        tx,
        tenantId,
        scopeType,
        scopeId
      );
    }
  };
}
