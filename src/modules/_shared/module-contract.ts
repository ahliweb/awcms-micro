/**
 * Module descriptor contract (Issue #511, epic #492/#510). Extended for
 * Module Management: richer trusted metadata about each module, while
 * every addition here is optional so the existing 9 registered modules'
 * descriptors (which only set the original fields) remain valid without
 * any change.
 *
 * Everything in a `ModuleDescriptor` is **trusted code-only metadata** —
 * written by the module's own `module.ts`, checked in to the repo, never
 * user/tenant-controlled. It must never carry a runtime secret, token,
 * password, or provider credential (those live in `process.env` only,
 * doc 18) — this is descriptive/declarative metadata, not configuration
 * *values*.
 */

/** Broad category a module falls into — descriptive only, not itself an authorization or enable/disable mechanism. */
export type ModuleType =
  "base" | "system" | "domain" | "integration" | "derived";

/**
 * `disabled` here means globally disabled by code/deployment (the module
 * is registered but inert everywhere) — **not** a per-tenant toggle.
 * Tenant-level enable/disable is database state
 * (`awcms_micro_tenant_modules`, Issue #512/#515), tracked independently of
 * this descriptor-level status.
 */
export type ModuleLifecycleStatus =
  "active" | "experimental" | "deprecated" | "maintenance" | "disabled";

export type ModuleApiContract = {
  openApiPath: string;
  basePath: string;
};

export type ModuleEventContract = {
  asyncApiPath?: string;
  publishes?: string[];
  subscribes?: string[];
};

/** One permission this module declares to the catalog — `module_key` is the descriptor's own `key`, never repeated here. Consumed by Issue #517's sync/status comparison against `awcms_micro_permissions`. */
export type ModulePermissionDescriptor = {
  activityCode: string;
  action: string;
  description: string;
};

/** One admin navigation entry this module wants rendered — consumed by Issue #518's navigation registry/sidebar. `requiredPermission` is checked in addition to (not instead of) the target page/API's own server-side guard. */
export type ModuleNavigationEntry = {
  labelKey: string;
  path: string;
  icon?: string;
  order?: number;
  group?: string;
  requiredPermission?: string;
};

/** Non-secret settings shape/defaults only — consumed by Issue #516. Never put a secret-shaped default here; real secrets stay in env/secret manager. */
export type ModuleSettingsContract = {
  schemaVersion?: number;
  defaults?: Record<string, unknown>;
};

/** One operational command this module ships — consumed by Issue #519's job registry (documentation only, never an execute-from-UI action). */
export type ModuleJobDescriptor = {
  command: string;
  purpose: string;
  recommendedSchedule?: string;
  environmentNotes?: string;
  safeInOfflineLan?: boolean;
};

/** Capability flags only — the real check logic (DB reachable, provider configured, etc.) is implemented in Issue #520, this just declares that the module has one. */
export type ModuleHealthContract = {
  hasHealthCheck?: boolean;
  hasReadinessCheck?: boolean;
};

/**
 * High-volume table lifecycle descriptor (Issue #745, epic #738
 * platform-evolution Wave 1 — the `data_lifecycle` System Foundation
 * module, ADR-0013 §1/§6). A module that owns a table expected to grow
 * large (audit/analytics/outbox/queue-shaped data) contributes ONE of
 * these per table in its OWN `module.ts`'s `dataLifecycle` array — the
 * same "module declares its own descriptor, a central engine reads
 * `listModules()`" shape `permissions`/`navigation`/`jobs` above already
 * use. `data_lifecycle`'s registry/engine
 * (`src/modules/data-lifecycle/`) never reads another module's schema
 * without one of these present — ADR-0013 §6's "operates through the
 * contract declared by the owning module, never accessing another
 * module's schema without that contract" IS this type.
 *
 * This is TRUSTED CODE-ONLY METADATA (same rule as every descriptor type
 * above) — an immutable fact declared by the owning module's source,
 * never tenant/request-controlled, and never itself duplicated into a
 * mutable settings table (issue #745 scope: "do not duplicate immutable
 * descriptor facts in mutable settings" — the few genuine runtime/tenant
 * overrides this system needs, e.g. legal holds, live in their own
 * dedicated tables, never here).
 */
export type LifecycleTableScope = "tenant" | "global";

/** Broad retention rationale bucket — used for readiness/compliance-mapping grouping, not itself a legal category (doc `data-lifecycle.md` §Pemetaan kepatuhan maps these practically, without asserting one universal legal retention period). */
export type LifecycleRetentionClass =
  | "audit_security"
  | "analytics_telemetry"
  | "operational_queue"
  | "financial_tax"
  | "communication_log"
  | "system_event";

/**
 * `"delegated"` — the owning module already has its own hand-rolled
 * purge/retention function and/or scheduled job (e.g.
 * `purgeExpiredAuditEvents`); `data_lifecycle`'s engine may read this
 * table for dry-run counts (read-only, safe) but NEVER mutates it —
 * real archive/purge stays owned by the existing mechanism, satisfying
 * "integrated or explicitly documented as compatible adopters rather
 * than duplicated" (issue #745 acceptance criteria) and the out-of-scope
 * guardrail "bypassing module ownership to purge another module's table
 * directly".
 * `"generic"` — the owning module has NO existing purge mechanism and
 * explicitly opts the table into `data_lifecycle`'s generic bounded
 * archive/purge execution (table name, tenant column, cursor column,
 * batch limit — all declared right here, by the owner, so this is never
 * an unsanctioned cross-module schema access).
 */
export type LifecycleExecutionMode = "delegated" | "generic";

export type LifecycleArchivePortKind =
  "local_offline" | "external_object_storage" | "none";

export type LifecycleArchiveFormat = "jsonl" | "csv";

export type LifecycleDeletionMode =
  "hard_delete" | "anonymize" | "status_transition_then_purge";

export type LifecyclePartitionPolicy = {
  eligible: boolean;
  granularity?: "daily" | "monthly" | "yearly";
  /** Required either way — "automate only where PostgreSQL safety can be proven" (issue #745 scope) means "not eligible" needs as much of a stated reason as "eligible". */
  rationale: string;
};

export type LifecycleArchivePolicy = {
  archivable: boolean;
  format?: LifecycleArchiveFormat;
  port?: LifecycleArchivePortKind;
  rationale: string;
};

export type LifecycleDeletionPolicy = {
  mode: LifecycleDeletionMode;
  rationale: string;
};

export type LifecycleLegalHoldPolicy = {
  /**
   * DOCUMENTATION/GUIDANCE ONLY — whether this class of data plausibly
   * warrants a legal hold at all, for an operator deciding whether to
   * bother creating one. Deliberately NOT consulted by the runtime
   * engine (`data-lifecycle/domain/legal-hold.ts`'s
   * `evaluateLegalHoldForDescriptor`) to decide whether an ACTUAL hold
   * record applies — a hold record (a human, permission-gated, audited
   * action) targeting this descriptor's `key`, or a tenant-wide hold
   * (`descriptorKey: null`), always applies regardless of what this flag
   * says. Letting `applicable: false` suppress enforcement would let an
   * owning module silently defeat legal hold coverage for its own table
   * by declaring it "not applicable" — exactly the bypass issue #745
   * forbids ("cannot be silently bypassed by tenant policy", which
   * applies with equal force to a module's own descriptor).
   */
  applicable: boolean;
  /**
   * A literal, not a free-choice enum value, when `applicable` is `true`
   * — "legal hold overrides ordinary retention/purge" (issue #745
   * critical requirement) can never be declared away per-descriptor by
   * an owning module picking a different precedence value. When
   * `applicable` is `false`, precedence is moot (`"not_applicable"`).
   */
  precedence: "overrides_retention" | "not_applicable";
};

export type LifecycleIndexRequirement = {
  columns: readonly string[];
  purpose: string;
};

/** Documents an EXISTING hand-rolled purge mechanism this descriptor adopts rather than duplicates — required when `executionMode: "delegated"`. */
export type LifecycleExistingAdopter = {
  jobCommand?: string;
  purgeFunctionRef: string;
  description: string;
};

export type HighVolumeTableDescriptor = {
  /** Stable, unique across the whole registry, e.g. `"logging.audit_events"`. */
  key: string;
  tableName: string;
  /** Must equal the declaring module's own `key` — validated by the registry gate, not by the type system (see `data-lifecycle/domain/lifecycle-registry.ts`). */
  ownerModuleKey: string;
  scope: LifecycleTableScope;
  cursorColumn: string;
  /** Defaults to `"tenant_id"` when `scope === "tenant"`. */
  tenantColumn?: string;
  retentionClass: LifecycleRetentionClass;
  retentionMinDays: number;
  retentionMaxDays: number;
  defaultRetentionDays: number;
  partition: LifecyclePartitionPolicy;
  archive: LifecycleArchivePolicy;
  deletion: LifecycleDeletionPolicy;
  legalHold: LifecycleLegalHoldPolicy;
  requiredIndexes: readonly LifecycleIndexRequirement[];
  batchLimit: number;
  backupRestoreNotes: string;
  executionMode: LifecycleExecutionMode;
  existingAdopter?: LifecycleExistingAdopter;
};

/**
 * Deployment profile names (Issue #740, epic #738 `platform-evolution`).
 * Same four values as `src/lib/config/registry.ts`'s own `DeploymentProfile`
 * — redeclared here rather than imported, to keep this contract file
 * dependency-free (it has always had zero imports; every module.ts across
 * every module transitively depends on this file). Keep both
 * lists in sync if `docs/awcms-micro/deployment-profiles.md` ever adds a
 * profile — `src/modules/module-management/domain/module-composition.ts`
 * cross-checks values structurally (plain string comparison), not by
 * nominal type identity, so this is a documentation obligation, not a
 * compile-time-enforced one.
 */
export type ModuleDeploymentProfile =
  "development" | "staging" | "production" | "offline-lan";

/** Compatibility metadata used by Issue #515's dependency-graph validation to report version incompatibility when present — absence means "no constraint declared", not "incompatible". */
export type ModuleCompatibilityContract = {
  minAppVersion?: string;
  /**
   * Deployment profiles (`docs/awcms-micro/deployment-profiles.md`) this
   * module — base or contributed application module — is declared
   * compatible with (Issue #740). Absence means "no constraint declared",
   * same convention `minAppVersion`'s absence already uses — compatible
   * with every profile. Build-time composition
   * (`module-management/domain/module-composition.ts`) reports a
   * `deployment_profile_incompatible` issue when a module claims a profile
   * one of its own `dependencies` does not support.
   */
  deploymentProfiles?: readonly ModuleDeploymentProfile[];
};

/**
 * One capability this module's application/domain code consumes from
 * ANOTHER module, via a port (Issue #681, epic #679 platform-hardening) —
 * `_shared/ports/*.ts` defines the actual TypeScript interface;
 * `providedBy` names the module whose adapter (`<module>/application/
 * *-port-adapter.ts`) implements it, wired at the composition root (route
 * handlers), never a direct cross-module import inside `application`/
 * `domain`. Deliberately separate from `dependencies` above, which governs
 * enable/disable LIFECYCLE ORDERING only and is checked by
 * `domain/tenant-module-lifecycle.ts` — `capabilities` is documentation of
 * a SOURCE-LEVEL relationship (enforced by the structural boundary test,
 * `tests/unit/module-boundary.test.ts`), not a lifecycle constraint; a
 * module can consume another's capability while still declaring `[]`
 * `dependencies` on it (exactly the case for `blog_content`/`news_portal`
 * — see both modules' own `module.ts` for why a hard `dependencies` edge
 * between them was rejected back in Issue #632).
 *
 * `optional: true` means the CONSUMING module's own feature degrades
 * safely (documented per call site) when the capability resolves to "not
 * applicable" for a given tenant/request — not "the code can run without
 * the other module's source present" (this is a monolith; all modules'
 * code always ships together, only per-tenant DB-backed enable state
 * varies).
 */
export type ModuleCapabilityDependency = {
  capability: string;
  providedBy: string;
  optional?: boolean;
};

export type ModuleCapabilityContract = {
  /** Capability names THIS module provides an adapter for (matches a port defined in `_shared/ports/`), for other modules to declare in their own `consumes`. */
  provides?: string[];
  consumes?: ModuleCapabilityDependency[];
};

export type ModuleDescriptor = {
  key: string;
  name: string;
  version: string;
  status: ModuleLifecycleStatus;
  description: string;
  dependencies: string[];
  api?: ModuleApiContract;
  events?: ModuleEventContract;
  type?: ModuleType;
  isCore?: boolean;
  permissions?: ModulePermissionDescriptor[];
  navigation?: ModuleNavigationEntry[];
  settings?: ModuleSettingsContract;
  jobs?: ModuleJobDescriptor[];
  health?: ModuleHealthContract;
  compatibility?: ModuleCompatibilityContract;
  capabilities?: ModuleCapabilityContract;
  maintainers?: string[];
  /** High-volume table lifecycle descriptors this module owns (Issue #745) — see `HighVolumeTableDescriptor`'s own doc comment above. */
  dataLifecycle?: HighVolumeTableDescriptor[];
  /** Segregation-of-duties conflict rules this module owns (Issue #746) — see `SoDRuleDescriptor`'s own doc comment above. */
  sodRules?: SoDRuleDescriptor[];
  /** Staged import/export exchange descriptors this module owns (Issue #752) — see `ExchangeDescriptor`'s own doc comment below. */
  dataExchange?: ExchangeDescriptor[];
  /** Reference-data value sets/codes this module contributes (Issue #750) — see `ReferenceDataModuleContract`'s own doc comment below. */
  referenceData?: ReferenceDataModuleContract;
  /** Read-model projection descriptors this module owns (Issue #753) — see `ProjectionDescriptor`'s own doc comment below (declared after this type since it's mutually referenced only by name, TypeScript type declarations are not order-sensitive). */
  reportingProjections?: ProjectionDescriptor[];
  /** Public search-source descriptors this module contributes to `site_search` (Issue #270, ADR-0031) — see `SearchSourceDescriptor`'s own doc comment below. */
  searchSources?: SearchSourceDescriptor[];
  /** Public commentable-resource descriptors this module contributes to `comments` (Issue #271, ADR-0032) — see `CommentableResourceDescriptor`'s own doc comment below. */
  commentableResources?: CommentableResourceDescriptor[];
  /** Public newsletter content-source descriptors this module contributes to `newsletter` (Issue #272, ADR-0033) — see `NewsletterContentSourceDescriptor`'s own doc comment below. */
  newsletterContentSources?: NewsletterContentSourceDescriptor[];
};

/**
 * A declarative, pure-data public newsletter content-source descriptor a content
 * module contributes to `newsletter` (Issue #272, epic #261, ADR-0033). Exactly
 * the same "module declares its own descriptor array, a central engine reads
 * `listModules()`" shape `searchSources`/`commentableResources`/`dataLifecycle`
 * above already use — `newsletter`'s `domain/content-source-registry.ts` is the
 * aggregator/validator, mirroring `comments/domain/commentable-resource-registry.ts`
 * exactly.
 *
 * ## Why a descriptor-list, not a capability `provides` (ADR-0033 §3)
 *
 * Many content modules may want to seed newsletter notifications/digests.
 * Modeling `newsletter_content_source` as a capability `provides` would immediately
 * trip `module-composition.ts`'s `capability_provider_conflict` (>1 declared
 * provider of the same capability string). A descriptor-list riding `listModules()`
 * lets a module admit a reviewed content source by declaring it in its own
 * `module.ts` WITHOUT writing to `newsletter`'s tables (same data-only seam as
 * `searchSources`).
 *
 * ## Pure DATA, not an executable extractor (issue #272 security requirement)
 *
 * This descriptor carries NO function reference — only reviewed, code-only
 * column/table NAMES, a declarative `publicationFilter`, and a declarative
 * `publishEventType` STRING (never an executable). `newsletter`'s engine builds a
 * PARAMETERIZED publication/candidate query from it: literal filter VALUES are
 * always bound parameters; only the IDENTIFIERS (table/column names) are
 * interpolated, and they are re-validated with the sanctioned `assertSafeIdentifier`
 * pattern before interpolation — the same discipline `comments`/`site_search` use.
 * A content row must be PUBLISHED & PUBLIC (per `publicationFilter`) before it is
 * ever selected as a digest candidate; there is no place for a tenant to inject SQL.
 *
 * TRUSTED CODE-ONLY METADATA (same rule as every descriptor type above) —
 * declared by the owning module's source, never tenant/request-controlled.
 */
export type NewsletterContentSourcePublicationFilter = {
  /** Column = literal-value equality checks, e.g. `{ status: "published", visibility: "public" }`. VALUES are bound parameters, KEYS are validated identifiers. All must hold (AND). */
  equals?: Readonly<Record<string, string>>;
  /** Columns that must be `IS NOT NULL` for a row to be public (e.g. `published_at`). */
  notNullColumns?: readonly string[];
  /** Columns that must be `IS NULL` for a row to be public — the soft-delete gate (e.g. `deleted_at`). */
  nullColumns?: readonly string[];
  /** Columns whose value must be `<= now()` for a row to be public — the schedule gate (e.g. `published_at`). */
  timeReachedColumns?: readonly string[];
};

export type NewsletterContentSourceDescriptor = {
  /** Stable, unique across the whole registry, `"<module_key>.<short>"` (e.g. `"blog_content.post"`). */
  key: string;
  /** Must equal the declaring module's own `key` — validated by the registry gate (`newsletter/domain/content-source-registry.ts`), not the type system. */
  ownerModuleKey: string;
  /** Opaque content-type discriminator, e.g. `"blog_post"`. Never interpreted structurally by `newsletter`. */
  resourceType: string;
  /** Source table the engine reads to confirm a row is published/public (must start with `awcms_micro_`). */
  tableName: string;
  /** Defaults to `"tenant_id"`. */
  tenantColumn?: string;
  /** Defaults to `"id"` — the resource primary key. */
  idColumn?: string;
  /** Column carrying the BCP-47 locale of each row. */
  localeColumn: string;
  /** Column supplying `:slug` in `urlTemplate`; `null`/omit when the template uses only `:id`. */
  slugColumn?: string | null;
  /** Column mapped to a notification/digest subject candidate. */
  titleColumn: string;
  /** Column carrying the publish `timestamptz` — the cursor column for digest candidate selection. */
  publishedAtColumn: string;
  /** Public URL template with `:slug` / `:id` placeholders resolved from `slugColumn` / `idColumn` (e.g. `"/news/:slug"`). */
  urlTemplate: string;
  /** Declarative publication predicate enforced at the content-source boundary — the draft/private/deleted-leakage defense (ADR-0033 §5). */
  publicationFilter: NewsletterContentSourcePublicationFilter;
  /** Declarative domain-event TYPE string the owning module emits on publish that seeds a notification/digest candidate (e.g. `"awcms-micro.blog-content.post.published"`). NO executable — a label the newsletter consumer subscribes to out-of-band. */
  publishEventType: string;
  /** Whether rows from this source are eligible to appear in an automated digest. */
  digestEligible: boolean;
  /** Suggested default topic slug a fresh digest for this source type uses (the tenant's topics may override). */
  defaultTopicKey?: string;
};

/**
 * A declarative, pure-data public commentable-resource descriptor a content
 * module contributes to `comments` (Issue #271, epic #261, ADR-0032). Exactly the
 * same "module declares its own descriptor array, a central engine reads
 * `listModules()`" shape `searchSources`/`dataLifecycle`/`reportingProjections`
 * above already use — `comments`'s `domain/commentable-resource-registry.ts` is
 * the aggregator/validator, mirroring `site-search/domain/search-source-registry.ts`
 * exactly.
 *
 * ## Why a descriptor-list, not a capability `provides` (ADR-0032 §3)
 *
 * Many content modules may want to accept comments. Modeling `commentable_resource`
 * as a capability `provides` would immediately trip `module-composition.ts`'s
 * `capability_provider_conflict` (>1 declared provider of the same capability
 * string). A descriptor-list riding `listModules()` lets a module admit a
 * reviewed commentable type by declaring it in its own `module.ts` WITHOUT
 * writing to `comments`'s tables (same data-only seam as `searchSources`).
 *
 * ## Pure DATA, not an executable extractor (issue #271 security requirement)
 *
 * This descriptor carries NO function reference — only reviewed, code-only
 * column/table NAMES and a declarative `publicationFilter`. `comments`'s engine
 * builds a PARAMETERIZED existence/publication query from it: literal filter
 * VALUES are always bound parameters; only the IDENTIFIERS (table/column names)
 * are interpolated, and they are re-validated with the sanctioned
 * `assertSafeIdentifier` pattern before interpolation — the same discipline
 * `site_search` and `data_lifecycle`'s `generic` executionMode use. A resource
 * must be PUBLISHED & PUBLIC (per `publicationFilter`) before a comment on it is
 * ever accepted or shown; there is no place for a tenant to inject SQL.
 *
 * TRUSTED CODE-ONLY METADATA (same rule as every descriptor type above) —
 * declared by the owning module's source, never tenant/request-controlled.
 */
export type CommentableResourcePublicationFilter = {
  /** Column = literal-value equality checks, e.g. `{ status: "published", visibility: "public" }`. VALUES are bound parameters, KEYS are validated identifiers. All must hold (AND). */
  equals?: Readonly<Record<string, string>>;
  /** Columns that must be `IS NOT NULL` for a row to be public (e.g. `published_at`). */
  notNullColumns?: readonly string[];
  /** Columns that must be `IS NULL` for a row to be public — the soft-delete gate (e.g. `deleted_at`). */
  nullColumns?: readonly string[];
  /** Columns whose value must be `<= now()` for a row to be public — the schedule gate (e.g. `published_at`). */
  timeReachedColumns?: readonly string[];
};

/**
 * The default comment policy a resource type opens its thread with, until the
 * tenant overrides it. Same four modes as `awcms_micro_comments_settings.
 * default_policy_mode` / the `comment-policy.ts` state machine.
 */
export type CommentableResourceDefaultPolicy =
  | "disabled"
  | "authenticated-only"
  | "moderated-anonymous"
  | "moderated-registered";

export type CommentableResourceDescriptor = {
  /** Stable, unique across the whole registry, `"<module_key>.<short>"` (e.g. `"blog_content.post"`). */
  key: string;
  /** Must equal the declaring module's own `key` — validated by the registry gate (`comments/domain/commentable-resource-registry.ts`), not the type system. */
  ownerModuleKey: string;
  /** Opaque content-type discriminator, e.g. `"blog_post"`. Stored on each thread; never interpreted structurally by `comments`. */
  resourceType: string;
  /** Source table the engine reads to confirm a resource is published/public (must start with `awcms_micro_`). */
  tableName: string;
  /** Defaults to `"tenant_id"`. */
  tenantColumn?: string;
  /** Defaults to `"id"` — the resource primary key. */
  idColumn?: string;
  /** Column carrying the BCP-47 locale of each row — every thread is locale-scoped. */
  localeColumn: string;
  /** Column supplying `:slug` in `urlTemplate`; `null`/omit when the template uses only `:id`. */
  slugColumn?: string | null;
  /** Public URL template with `:slug` / `:id` placeholders resolved from `slugColumn` / `idColumn` (e.g. `"/news/:slug"`). */
  urlTemplate: string;
  /** Declarative publication predicate enforced at the resource->thread boundary — the draft/private/deleted-leakage defense (ADR-0032 §5). */
  publicationFilter: CommentableResourcePublicationFilter;
  /** Default policy mode a fresh thread for this resource type opens with (the tenant's settings may override per-tenant). */
  defaultPolicy: CommentableResourceDefaultPolicy;
};

/**
 * A declarative, pure-data public search-source descriptor a content module
 * contributes to `site_search` (Issue #270, epic #261, ADR-0031). Same "module
 * declares its own descriptor array, a central engine reads `listModules()`"
 * shape `dataLifecycle`/`sodRules`/`reportingProjections` above already use —
 * `site_search`'s `domain/search-source-registry.ts` is the aggregator/validator,
 * mirroring `reporting/domain/projection-registry.ts` exactly.
 *
 * ## Why a descriptor-list, not a capability `provides` (ADR-0031 §3)
 *
 * Search wants MANY content modules to contribute sources. Modeling `search_source`
 * as a capability `provides` would immediately trip `module-composition.ts`'s
 * `capability_provider_conflict` (>1 declared provider of the same capability
 * string). A descriptor-list riding `listModules()` lets a module contribute a
 * reviewed source by declaring it in its own `module.ts` WITHOUT writing to
 * `site_search`'s index tables (issue #270 acceptance criterion).
 *
 * ## Pure DATA, not an executable extractor (issue #270 security requirement)
 *
 * "Search source descriptors are reviewed build-time code; tenants cannot define
 * arbitrary SQL or executable extractors." So this descriptor carries NO function
 * reference — only reviewed, code-only column/table NAMES and a declarative
 * `publicationFilter`. `site_search`'s generic engine builds a PARAMETERIZED
 * extraction query from it: literal filter VALUES are always bound parameters;
 * only the IDENTIFIERS (table/column names) are interpolated, and they are
 * re-validated with a strict identifier pattern before interpolation — the exact
 * same sanctioned pattern `data_lifecycle`'s `generic` executionMode uses
 * (`assertSafeIdentifier` + `tableName`/`cursorColumn` interpolation). There is
 * no place for a tenant to inject SQL.
 *
 * TRUSTED CODE-ONLY METADATA (same rule as every descriptor type above) —
 * declared by the owning module's source, never tenant/request-controlled.
 */
export type SearchSourcePublicationFilter = {
  /**
   * Column = literal-value equality checks, e.g. `{ status: "published",
   * visibility: "public" }`. The VALUES are bound parameters (never
   * interpolated), the KEYS are validated identifiers. All must hold (AND).
   */
  equals?: Readonly<Record<string, string>>;
  /** Columns that must be `IS NOT NULL` for a row to be public (e.g. `published_at`). */
  notNullColumns?: readonly string[];
  /** Columns that must be `IS NULL` for a row to be public — the soft-delete gate (e.g. `deleted_at`). */
  nullColumns?: readonly string[];
  /** Columns whose value must be `<= now()` for a row to be public — the schedule gate (e.g. `published_at`). */
  timeReachedColumns?: readonly string[];
};

export type SearchSourceDescriptor = {
  /** Stable, unique across the whole registry, `"<module_key>.<short>"` (e.g. `"blog_content.post"`). */
  key: string;
  /** Must equal the declaring module's own `key` — validated by the registry gate (`site-search/domain/search-source-registry.ts`), not the type system. */
  ownerModuleKey: string;
  /** Opaque content-type discriminator, e.g. `"blog_post"` / `"blog_page"` / a derived app's `"product"`. Stored on each index document and used for admitted-type filtering; never interpreted structurally by `site_search`. */
  resourceType: string;
  /** Source table the generic engine reads (must start with `awcms_micro_`). */
  tableName: string;
  /** Defaults to `"tenant_id"`. */
  tenantColumn?: string;
  /** Defaults to `"id"` — the resource primary key stored as the index document's `resource_id`. */
  idColumn?: string;
  /** Column carrying the BCP-47 locale of each row — every index document is locale-scoped. */
  localeColumn: string;
  /** Column carrying the row's last-modified `timestamptz` — the reconciliation staleness/`source_updated_at` signal. */
  updatedAtColumn: string;
  /** Column mapped to the index document's weighted `title` (tsvector weight A). */
  titleColumn: string;
  /** Column mapped to the index document's `summary` (tsvector weight B); `null`/omit when the source has none. */
  summaryColumn?: string | null;
  /** Columns concatenated into the index document's `body_text` (tsvector weight D + snippet source). */
  bodyColumns: readonly string[];
  /** `text[]` column mapped to the index document's `tags` (tsvector weight C); `null`/omit when the source has none. */
  tagsColumn?: string | null;
  /** Public URL template with `:slug` / `:id` placeholders resolved from `slugColumn` / `idColumn` at index time (e.g. `"/news/:slug"`). */
  urlTemplate: string;
  /** Column supplying `:slug` in `urlTemplate`; `null`/omit when the template uses only `:id`. */
  slugColumn?: string | null;
  /** Declarative publication predicate enforced at the source→index boundary — the draft/private/deleted-leakage defense (ADR-0031 §5). */
  publicationFilter: SearchSourcePublicationFilter;
  /** Relevance multiplier applied to `ts_rank` at query time — lets a source rank above/below another (`0 < weight <= 10`). */
  weight: number;
  /** Privacy classification — ONLY `"public"` content is admitted to the index (issue #270 out-of-scope: never index private/admin business data). */
  privacyClassification: "public";
};

/**
 * Segregation-of-duties conflict rule descriptor (Issue #746, epic #738
 * platform-evolution Wave 2, ADR-0013 §4). Same "module declares its own
 * descriptor, a central engine reads `listModules()`" shape `permissions`/
 * `dataLifecycle` above already use — `identity_access`'s
 * `domain/sod-rule-registry.ts` is the aggregator/validator, mirroring
 * `data-lifecycle/domain/lifecycle-registry.ts` exactly. A module
 * contributes ONE of these per real SoD policy it wants enforced (maker/
 * checker, requester/approver, posting/period-control, ...) — the base
 * never hardcodes a domain-specific rule itself (issue #746 out-of-scope:
 * "Implementing domain-specific finance/procurement/payroll/approval rules
 * in the base"); every entry here is a GENERIC conflicting-permission-pair
 * declaration, never a business rule about what those permissions actually
 * do.
 *
 * TRUSTED CODE-ONLY METADATA (same rule as every descriptor type above) —
 * declared by the owning module's source, never tenant/request-controlled.
 */
export type SoDRuleScopeApplicability =
  "any" | "same_scope_only" | "global_within_tenant";

export type SoDRuleSeverity = "low" | "medium" | "high" | "critical";

export type SoDRuleExceptionPolicy = {
  allowed: boolean;
  /** Required when `allowed` is `true` — the permission key a different tenant user must hold to approve an exception to THIS rule (never the same permission the rule itself conflicts over). */
  requiresApprovalPermission?: string;
  /** Required only when `allowed` is `true` — an exception must always have a bounded lifetime (issue #746: "exceptions MUST have an end date — no indefinite override"); moot (must be absent) when `allowed` is `false`. */
  maxDurationDays?: number;
};

export type SoDRuleDescriptor = {
  /** Stable, unique across the whole registry, e.g. `"data_lifecycle.legal_hold_maker_checker"`. */
  ruleKey: string;
  /** Must equal the declaring module's own `key` — validated by the registry gate, not the type system (see `identity-access/domain/sod-rule-registry.ts`). */
  ownerModuleKey: string;
  description: string;
  /** At least 2 `module.activity.action` permission keys (the `permissionKey()` format, `identity-access/domain/access-control.ts`) that must never all be held/exercised by the same subject for the same scope (or anywhere in the tenant, per `scopeApplicability`) without an approved exception. */
  conflictingPermissionKeys: string[];
  /**
   * `"global_within_tenant"` — the conflict applies even without any shared
   * business scope (holding both permissions anywhere in the tenant is
   * itself the conflict). `"same_scope_only"` — the conflict only applies
   * when both permissions would apply to the SAME `scopeType`+`scopeId`.
   * `"any"` is reserved for a future rule kind that is scope-agnostic by
   * design (neither global nor scope-matched) — no rule in this repo uses
   * it yet.
   */
  scopeApplicability: SoDRuleScopeApplicability;
  severity: SoDRuleSeverity;
  exceptionPolicy: SoDRuleExceptionPolicy;
};

/**
 * Staged import/export exchange descriptor (Issue #752, epic #738
 * platform-evolution Wave 3, ADR-0017). Same "module declares its own
 * descriptor, a central engine reads `listModules()`" shape `dataLifecycle`/
 * `sodRules` above already use — `data_exchange`'s `domain/exchange-
 * registry.ts` is the aggregator/validator, mirroring `data-lifecycle/
 * domain/lifecycle-registry.ts` exactly. A module contributes ONE of these
 * per import OR export contract it wants staged/committed through the
 * generic `data_exchange` engine — the base never hardcodes a domain-
 * specific schema itself (this repo's own `data_exchange` module ships
 * exactly one self-contained reference descriptor pair, `reference_items`,
 * to prove the mechanism end-to-end — see that module's README).
 *
 * TRUSTED CODE-ONLY METADATA (same rule as every descriptor type above) —
 * declared by the owning module's source, never tenant/request-controlled.
 * Deliberately carries NO function/adapter reference (a descriptor is pure
 * data, importable from any module.ts without creating a cross-module
 * source dependency) — `adapterRegistryKey` is a plain string the owning
 * module's REAL adapter implementation (a `DataExchangeAdapterPort`,
 * `_shared/ports/data-exchange-adapter-port.ts`) registers itself under, in
 * `data_exchange/infrastructure/exchange-adapter-registry.ts` (a static,
 * reviewed-source-code registry — same shape as `domain-event-runtime/
 * infrastructure/consumer-registry.ts`'s `DOMAIN_EVENT_CONSUMERS`).
 */
export type ExchangeDirection = "import" | "export" | "both";

export type ExchangeFormat = "csv" | "json";

export type ExchangeSensitiveFieldPolicy = {
  /** Field names (as they appear in the parsed row, not a column name) that must never appear unmasked in a preview/error artifact without the caller holding the descriptor's `rawValuePermission`. */
  fieldNames: readonly string[];
  /** Permission key (module.activity.action format) required to view unmasked values for the fields above — required when `fieldNames` is non-empty. */
  rawValuePermission?: string;
};

export type ExchangeLimits = {
  /** Hard cap on the staged file's byte size — must not exceed the HTTP-layer tier this descriptor's intake endpoint uses (`src/lib/security/request-body-limit.ts`'s `large` tier, 5 MiB, as of this issue). */
  maxFileBytes: number;
  maxRowCount: number;
  maxFieldsPerRow: number;
};

export type ExchangeDescriptor = {
  /** Stable, unique across the whole registry, e.g. `"data_exchange.reference_items"`. */
  key: string;
  /** Must equal the declaring module's own `key` — validated by the registry gate, not the type system (see `data-exchange/domain/exchange-registry.ts`). */
  ownerModuleKey: string;
  direction: ExchangeDirection;
  formats: readonly ExchangeFormat[];
  /** Versioned schema identifier the owning module's adapter validates against — bumped by the owning module whenever its field shape changes (independent of `MODULE_CONTRACT_VERSION`). */
  schemaVersion: string;
  limits: ExchangeLimits;
  /** The `infrastructure/exchange-adapter-registry.ts` lookup key for this descriptor's REAL `DataExchangeAdapterPort` implementation — never a function reference (see this type's own header). */
  adapterRegistryKey: string;
  /** Permission key (module.activity.action) required to stage/preview/commit against this descriptor, beyond the generic `data_exchange.imports.*`/`data_exchange.exports.*` gate — e.g. an owning module may require its OWN write permission (`reference_data.items.create`) in addition. `undefined` means no additional permission beyond the generic gate. */
  requiredPermission?: string;
  sensitiveFields?: ExchangeSensitiveFieldPolicy;
  description: string;
};

/**
 * One localized label/description for a `ReferenceCodeContribution` (Issue
 * #750, epic #738 platform-evolution Wave 3, ADR-0021). At least an `"en"`
 * entry is required — same "default en, min en+id" catalog convention
 * every UI string in this repo already follows (skill
 * `awcms-micro-i18n`), applied here to CONTENT rather than UI chrome.
 */
export type ReferenceCodeLabelContribution = {
  locale: string;
  label: string;
  description?: string;
};

/**
 * One code within a `ReferenceValueSetContribution` a module declares
 * statically in its own `module.ts` (Issue #750). Pure, trusted,
 * code-only data — same rule as every descriptor type in this file: never
 * tenant/request-controlled, never a secret/executable expression.
 * Aggregated + validated by `reference_data/domain/contribution-
 * registry.ts` and written to `awcms_micro_reference_codes` (`provenance:
 * "module"`, `managed_by_descriptor: true`) ONLY by `reference_data`'s own
 * `application/contribution-sync.ts` — the declaring module never writes
 * to that table itself (ADR-0013 §6 no-shared-table-write).
 */
export type ReferenceCodeContribution = {
  code: string;
  labels: ReferenceCodeLabelContribution[];
  sortOrder?: number;
  metadata?: Record<string, unknown>;
};

/**
 * One value set a module contributes statically (Issue #750). `key` must
 * be globally unique across every module's contributions (validated by
 * `contribution-registry.ts`, which also rejects a `key` colliding with an
 * existing `platform_curated` value set created via the API). The
 * declaring module IS the `owner_module` — never trusted from anywhere
 * else, always derived from the descriptor's own `key` at sync time.
 */
export type ReferenceValueSetContribution = {
  key: string;
  name: string;
  description: string;
  overridePolicy:
    "none" | "tenant_extend" | "tenant_override" | "tenant_extend_and_override";
  codes: ReferenceCodeContribution[];
};

/**
 * A module's declared reference-data contribution (Issue #750, epic #738
 * platform-evolution Wave 3, ADR-0021 §5) — the mechanism "module-
 * contributed catalogs compose without direct source import or direct
 * table writes" (issue #750 acceptance criterion) actually is: a module
 * declares its OWN value sets/codes as plain data here, and
 * `reference_data`'s own `application/contribution-sync.ts` (invoked
 * explicitly via `bun run reference-data:contributions:sync`, never
 * automatically from another module's code) reads `listModules()` and
 * upserts them into ITS OWN tables — the declaring module never imports
 * `reference_data`'s tables or application code, and `reference_data`
 * never imports the declaring module's code, only its own descriptor's
 * plain data (same "module declares its own descriptor, a central
 * aggregator reads `listModules()`" shape `dataLifecycle`/`sodRules`
 * above already use).
 */
export type ReferenceDataModuleContract = {
  contributesValueSets: ReferenceValueSetContribution[];
};

/**
 * Module-contributed read-model projection descriptor (Issue #753, epic
 * #738 `platform-evolution` Wave 3). Same "module declares its own array,
 * a central aggregator (`reporting/domain/projection-registry.ts`) reads
 * `listModules()`" shape `dataLifecycle`/`sodRules` above already use — a
 * module that wants a derived, incrementally-maintained read model instead
 * of repeated live aggregation contributes ONE of these per projection in
 * its OWN `module.ts`'s `reportingProjections` array. `reporting`'s engine
 * never writes another module's transactional tables (it reads via a
 * bounded cursor re-scan of a column the owning module already declared
 * here, or via a `domain_event_runtime` consumer it registers itself) and
 * only ever writes ITS OWN projection tables
 * (`awcms_micro_reporting_projection_*`).
 *
 * TRUSTED CODE-ONLY METADATA (same rule as every descriptor type above) —
 * declared by the owning module's source, never tenant/request-controlled.
 */
export type ProjectionScope = "tenant" | "global";

/** One event type/version this projection's steady-state updates consume via a `domain_event_runtime` consumer (Issue #742) — see `reporting`'s own `module.ts` for the registered example and `domain-event-runtime/infrastructure/consumer-registry.ts` for where the actual consumer entry lives (the cross-module wiring point). `eventVersion` is a STRING (e.g. `"1.0"`), matching `domain-event-runtime/domain/consumer-types.ts`'s own `DomainEventConsumerDefinition.eventVersions`/`DomainEventEnvelope.eventVersion` — never a number. */
export type ProjectionEventSource = {
  eventType: string;
  eventVersion: string;
};

/** One rule evaluated against a fetched batch row (Issue #753's incremental cursor engine, `reporting/application/projection-incremental-worker.ts`) — `matchColumn`/`matchValue` are optional (omit both to count every row in the batch); when present, both are required together. */
export type ProjectionCursorMetricRule = {
  metricKey: string;
  effect: "increment" | "decrement";
  matchColumn?: string;
  matchValue?: string;
};

/**
 * One bounded, cursor-ordered re-scan of a single source table — the ONLY
 * mechanism this system uses to either (a) poll-update a `cursor_table`
 * strategy projection's steady state, or (b) recompute ANY projection
 * (including a `domain_event` strategy one) from scratch during a rebuild.
 * `cursorColumn` must be a monotonically-increasing, insert-time-only
 * column (e.g. `created_at`) on an effectively append-only table/stream —
 * a column that can move backward on UPDATE (or a soft-delete-then-restore
 * table) is not safe here; see `reporting/README.md` §Projections for the
 * append-only-source rule this repo's own registered descriptors follow.
 */
export type ProjectionCursorStream = {
  /** Unique within the descriptor — keys this stream's own cursor row. */
  streamKey: string;
  /** Must start with `awcms_micro_` (same convention/validation `data_lifecycle`'s `HighVolumeTableDescriptor.tableName` already enforces). */
  tableName: string;
  /** Defaults to `"tenant_id"`. */
  tenantColumn?: string;
  cursorColumn: string;
  metrics: readonly ProjectionCursorMetricRule[];
};

export type ProjectionSourceContract =
  | { strategy: "cursor_table"; streams: readonly ProjectionCursorStream[] }
  | {
      strategy: "domain_event";
      events: readonly ProjectionEventSource[];
      /** Must match the `DomainEventConsumerDefinition.name` registered for this projection in `domain-event-runtime/infrastructure/consumer-registry.ts` — cross-checked at runtime by that registry's own tests, not by this repo's static registry validator (which has no visibility into the OTHER module's registry). */
      consumerName: string;
    };

export type ProjectionFreshnessPolicy = {
  /** Below this age since the last successful update, the projection reports `"current"`. */
  targetSeconds: number;
  /** At or above this age, the projection reports `"stale"` (between `targetSeconds` and this, it reports `"delayed"`). Must be `>= targetSeconds`. */
  staleAfterSeconds: number;
  /** Consecutive update failures at or above this count report `"failed"` regardless of age (Issue #753: "a projection-update job silently fail/skip a tenant must reflect stale/failed, never falsely fresh"). */
  errorAfterConsecutiveFailures: number;
};

export type ProjectionDescriptor = {
  /** Stable, unique across the whole registry, `"<ownerModuleKey>.<name>"`. */
  key: string;
  version: number;
  /** Must equal the declaring module's own `key` — validated by the registry gate, not the type system (see `reporting/domain/projection-registry.ts`). */
  ownerModuleKey: string;
  scope: ProjectionScope;
  description: string;
  /** How this projection's STEADY-STATE (ongoing, incremental) updates arrive. */
  source: ProjectionSourceContract;
  /** How a REBUILD recomputes this projection from scratch — ALWAYS a bounded cursor re-scan of the authoritative source table(s), even for a `domain_event`-strategy projection (rebuild reads the event outbox table directly rather than re-triggering delivery, so it never depends on `domain_event_runtime` replaying anything). See `reporting/application/projection-rebuild.ts`. */
  rebuildSource: { streams: readonly ProjectionCursorStream[] };
  /** `metricKey` (from `source`/`rebuildSource`'s own rules) -> human-readable label. */
  metricLabels: Readonly<Record<string, string>>;
  /** `module.activity.action` permission key (`identity-access/domain/access-control.ts`'s `permissionKey()` format) required to READ this projection's snapshot/freshness/reconciliation. Rebuild/export use their own separate permissions (not declared here — see `reporting`'s own permission catalog). */
  requiredPermission: string;
  freshness: ProjectionFreshnessPolicy;
  /** API path a client can follow to see the live, fully-reauthorized source view this projection summarizes — MUST be an endpoint that independently re-checks RBAC/ABAC at request time (every existing `/api/v1/reports/*` route already does), never a shortcut that trusts the projection's own permission check. */
  drillDownPath?: string;
  /** Free-text reference to a `data_lifecycle` `HighVolumeTableDescriptor.key` if this projection's own tables are (or should become) separately registered there, or a short rationale if not — documentation only, `reporting`'s projection tables are not auto-enrolled. */
  retentionClass: string;
  /** Bounded per-pass row limit for both incremental and rebuild cursor scans — same purpose as `HighVolumeTableDescriptor.batchLimit`. */
  batchLimit: number;
};

export function defineModule(descriptor: ModuleDescriptor): ModuleDescriptor {
  return descriptor;
}

/**
 * SemVer of the `ModuleDescriptor` TYPE SHAPE itself — independent of
 * `package.json` (release version) and the OpenAPI/AsyncAPI `info.version`
 * (REST/event contract version), same "three independent versioning schemes"
 * precedent ADR-0008 already establishes for those two. This is the fourth:
 * the module descriptor *contract* (this file's own exported types), so a
 * consumer can declare which shape of this file it was written against.
 *
 * Bump policy (mirrors ADR-0008 §2's contract bump rules exactly):
 * - **MAJOR** — a field/type is removed or renamed, or an existing optional
 *   field becomes required (an existing `module.ts` could stop compiling or
 *   change meaning).
 * - **MINOR** — a new optional field is added.
 * - **PATCH** — documentation-only clarification, no shape change.
 *
 * `1.2.0` (Issue #753) — added the optional `ModuleDescriptor.
 * reportingProjections` field plus the new `ProjectionDescriptor` family
 * of exported types (MINOR: purely additive).
 *
 * `1.3.0` (Issue #270, ADR-0031) — added the optional `ModuleDescriptor.
 * searchSources` field plus the new `SearchSourceDescriptor` /
 * `SearchSourcePublicationFilter` exported types (MINOR: purely additive).
 *
 * `1.4.0` (Issue #271, ADR-0032) — added the optional `ModuleDescriptor.
 * commentableResources` field plus the new `CommentableResourceDescriptor` /
 * `CommentableResourcePublicationFilter` / `CommentableResourceDefaultPolicy`
 * exported types (MINOR: purely additive).
 *
 * `1.5.0` (Issue #272, ADR-0033) — added the optional `ModuleDescriptor.
 * newsletterContentSources` field plus the new `NewsletterContentSourceDescriptor`
 * / `NewsletterContentSourcePublicationFilter` exported types (MINOR: purely
 * additive).
 *
 * `2.0.0` (ADR-0036 — derived-application pathway removal) — REMOVED the
 * `ApplicationModuleRegistry` and `ModuleMigrationNamespace` composition types
 * (MAJOR: exported types removed). The derived-application seam
 * (`src/modules/application-registry.ts` + `theming/application-theme-registry.ts`,
 * migration namespace 900-999, `extension:check` + the compatibility manifest
 * mechanism) is deleted; awcms-micro is a template used directly. No
 * `ModuleDescriptor` field changed — every base `module.ts` stays valid
 * unchanged.
 */
export const MODULE_CONTRACT_VERSION = "2.0.0";
