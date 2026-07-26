/**
 * Composition root for `site_search`'s registered search sources (Issue #270,
 * ADR-0031 §3). Lives in this module's `presentation/` layer (ADR-0038) because it
 * is the ONE place allowed to import `src/modules/index` (`listModules()`) and hand
 * the aggregated descriptors to the engine/services — exactly the established
 * composition-root pattern (`seo-distribution/presentation/discovery-providers.ts`
 * does the same for `seo_distribution`). The module's own `application`/`domain` code never
 * imports `listModules()`, keeping the aggregator functions pure and passing
 * `modules` as a parameter (the `reporting`/`data_lifecycle` registry convention).
 */
import { listModules } from "../../index";
import type { SearchSourceDescriptor } from "../../_shared/module-contract";
import { collectSearchSourceDescriptors } from "../domain/search-source-registry";

/** Every reviewed, registered search-source descriptor (base + any composed application module). */
export function getRegisteredSearchSources(): SearchSourceDescriptor[] {
  return collectSearchSourceDescriptors(listModules());
}
