import type { ModuleDescriptor } from "./_shared/module-contract";
import { applicationModuleRegistry } from "./application-registry";
import { mergeModuleRegistries } from "./module-management/domain/module-composition";
import { blogContentModule } from "./blog-content/module";
import { dataLifecycleModule } from "./data-lifecycle/module";
import { domainEventRuntimeModule } from "./domain-event-runtime/module";
import { emailModule } from "./email/module";
import { formDraftsModule } from "./form-drafts/module";
import { identityAccessModule } from "./identity-access/module";
import { loggingModule } from "./logging/module";
import { mediaLibraryModule } from "./media-library/module";
import { moduleManagementModule } from "./module-management/module";
import { newsPortalModule } from "./news-portal/module";
import { profileIdentityModule } from "./profile-identity/module";
import { reportingModule } from "./reporting/module";
import { seoDistributionModule } from "./seo-distribution/module";
import { socialPublishingModule } from "./social-publishing/module";
import { syncStorageModule } from "./sync-storage/module";
import { tenantAdminModule } from "./tenant-admin/module";
import { tenantDomainModule } from "./tenant-domain/module";
import { themingModule } from "./theming/module";
import { visitorAnalyticsModule } from "./visitor-analytics/module";

/**
 * The reviewed BASE registry. Every module below is reviewed, in-repo code;
 * nothing here is conditional on a derived repository's own contribution.
 *
 * AWCMS-Micro's registry is the upstream AWCMS-Mini standard narrowed to
 * WEBSITE scope (ADR-0025). Mini's ERP-scope modules — `workflow`,
 * `organization_structure`, `document_infrastructure`, `data_exchange`,
 * `integration_hub`, `reference_data`, `idn_admin_regions` — are
 * deliberately NOT ported: no module kept here declares a dependency or a
 * REQUIRED capability on any of them, which is why the prune was a clean
 * cut rather than a rewrite. A derived application that needs one adds it
 * through `application-registry.ts`, never by editing this file.
 *
 * Order is dependency-friendly but NOT dependency-significant: the DAG is
 * validated by `bun run modules:dag:check`, not by array position.
 */
const baseModules: ModuleDescriptor[] = [
  // Foundation — every website module below rests on these.
  tenantAdminModule,
  profileIdentityModule,
  identityAccessModule,
  loggingModule,
  moduleManagementModule,
  // Platform services shared by the website modules.
  syncStorageModule,
  // `active` System Foundation module (ADR-0026, all stages complete). It OWNS
  // the tenant media registry (`awcms_micro_news_media_objects`) and the
  // `media_library` capability every website module consumes — the presigned
  // upload/finalize/cancel flow, MIME sniffing, R2 config/client, verification,
  // orphan lifecycle, reconciliation job, managed-media enforcement, and the
  // `/admin/media` browser. It is a fully implemented registry, not a stub and
  // not a second media system beside `news_portal`'s: the extraction inverted
  // ownership so a brochure site gets managed media without switching on a news
  // portal. See its module.ts/README and ADR-0026 for the full staged history.
  mediaLibraryModule,
  domainEventRuntimeModule,
  dataLifecycleModule,
  reportingModule,
  emailModule,
  formDraftsModule,
  // Website scope proper — the reason this repo exists.
  tenantDomainModule,
  blogContentModule,
  newsPortalModule,
  socialPublishingModule,
  visitorAnalyticsModule,
  // `active` Official Optional Module (ADR-0028, admitted #265, first runtime
  // code #266). CONSUMER/aggregator of the `seo_facts` contribution contract —
  // the central canonical/hreflang/OG/Twitter/JSON-LD renderer for public
  // pages. Its `capabilities.consumes` point INWARD (it depends on no domain
  // module; nothing depends on it), so the DAG is unchanged. This is the entry
  // ADR-0028 deferred out of the admission PR: it lands with real code, which is
  // why registering it here bumps the base count 17 → 18 (and
  // `EXPECTED_BASE_MODULE_COUNT` in scripts/scope-consistency-check.ts).
  seoDistributionModule,
  // `active` Official Optional Module (ADR-0029, admitted AND implemented #269).
  // Tenant-selectable presentation via trusted BUILD-TIME theme descriptors +
  // DATA-only tenant config (validated design tokens/slots/media). A CONSUMER
  // leaf: it consumes `media_library` (optional) and provides nothing, so the
  // DAG is unchanged and nothing depends on it. Unlike seo_distribution, admission
  // + runtime land together (no latent cross-module behavior to consolidate), so
  // registering it here bumps the base count 18 → 19 (and
  // `EXPECTED_BASE_MODULE_COUNT` in scripts/scope-consistency-check.ts).
  themingModule
];

/** Base-only registry, regardless of any application registry — Issue #740's composition API. */
export function listBaseModules(): readonly ModuleDescriptor[] {
  return baseModules;
}

/**
 * Final, effective registry — `baseModules` merged with an optional
 * build-time application registry (`./application-registry.ts`, Issue
 * #740). Merge only, never validated here: `index.ts` stays pure data,
 * exactly like before this issue (`listModules()` used to be `return
 * modules` with zero validation) — the composed registry's VALIDITY is a
 * separate, explicit check (`bun run modules:compose:check`,
 * `bun run modules:dag:check`, tests), never something module load itself
 * throws on. In this base repository, `applicationModuleRegistry` is
 * always `undefined`, so `modules` below is a byte-identical pass-through
 * of `baseModules` — the exact same effective registry as before this
 * change.
 */
export const modules: ModuleDescriptor[] = [
  ...mergeModuleRegistries(baseModules, applicationModuleRegistry)
];

export function getModuleByKey(
  moduleKey: string
): ModuleDescriptor | undefined {
  return modules.find((module) => module.key === moduleKey);
}

export function listModules(): readonly ModuleDescriptor[] {
  return modules;
}
