/**
 * Minimal TEST-SUPPORT example domain module — sibling of `example_crm`. NOT
 * part of the base registry (see that module's own header comment for the full
 * rationale).
 *
 * Declares a lifecycle dependency on `example_crm` — a domain-module-to-
 * domain-module edge — to prove the composition engine's reused
 * `validateModuleDependencyGraph` walks the whole registry graph, not just
 * edges onto base modules. Consumes `example_crm`'s `example_crm_directory`
 * capability as a REQUIRED (not `optional: true`) binding, to prove
 * `capability_provider_missing` resolves correctly (no issue) when the provider
 * is present in the same registry.
 */
import { defineModule } from "../../../../../src/modules/_shared/module-contract";

export const exampleLoyaltyModule = defineModule({
  key: "example_loyalty",
  name: "Example Loyalty (fixture)",
  version: "0.1.0",
  status: "experimental",
  description:
    "Minimal in-repo test-support domain module — illustrates a loyalty-points feature that reads the sibling example_crm fixture module's contact directory capability. Never registered in the base repository.",
  dependencies: ["tenant_admin", "identity_access", "example_crm"],
  type: "domain",
  capabilities: {
    consumes: [
      { capability: "example_crm_directory", providedBy: "example_crm" }
    ]
  },
  permissions: [
    {
      activityCode: "points",
      action: "read",
      description: "Read example loyalty point balances (fixture)"
    }
  ]
});
