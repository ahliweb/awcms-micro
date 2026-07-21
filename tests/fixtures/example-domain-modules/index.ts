/**
 * In-repo TEST-SUPPORT example domain modules.
 *
 * A small, self-contained set of illustrative DOMAIN modules used ONLY by tests
 * to exercise the base module-registry composition engine against realistic
 * module metadata (a lifecycle dependency edge, a provided/consumed capability
 * pair, permissions/navigation/jobs) — the same shape a new website/domain
 * module added directly to `src/modules/` would produce.
 *
 * These modules are NEVER registered in the real base registry
 * (`src/modules/index.ts`) — they are imported only by
 * `tests/unit/module-composition-fixture.test.ts`, which composes them WITH
 * `listBaseModules()` to prove every composition check runs on a domain module.
 * ADR-0036 removed the derived-application pathway; this fixture is the
 * test-support successor to the former `derived-application-example`.
 */
import type { ModuleDescriptor } from "../../../src/modules/_shared/module-contract";
import { exampleCrmModule } from "./modules/example-crm/module";
import { exampleLoyaltyModule } from "./modules/example-loyalty/module";

/** The example domain modules a test composes with `listBaseModules()`. */
export const exampleDomainModules: readonly ModuleDescriptor[] = [
  exampleCrmModule,
  exampleLoyaltyModule
];
