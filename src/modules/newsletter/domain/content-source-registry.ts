/**
 * Module-contributed newsletter content-source registry validation (Issue #272,
 * ADR-0033 §3). Pure code-registry validation — no I/O, no database, no network —
 * the same shape as `comments/domain/commentable-resource-registry.ts` and
 * `site-search/domain/search-source-registry.ts`. Every
 * `NewsletterContentSourceDescriptor` is declared by its OWNING module's own
 * `module.ts` (`ModuleDescriptor.newsletterContentSources`); this file only
 * AGGREGATES (`collectNewsletterContentSourceDescriptors`) and VALIDATES what
 * modules already declared. It never invents a descriptor and never reaches into
 * another module's schema.
 *
 * The strict IDENTIFIER validation here is load-bearing: `newsletter`'s engine
 * interpolates a descriptor's table/column NAMES into a publication-check SQL
 * (values are always bound parameters), so an invalid identifier must fail the
 * registry gate before any SQL is built — the exact discipline `comments`'s
 * `assertSafeIdentifier` uses.
 */
import type {
  ModuleDescriptor,
  NewsletterContentSourceDescriptor
} from "../../_shared/module-contract";

export const NEWSLETTER_CONTENT_SOURCE_CONTRACT_VERSION = "1.0.0";

const DESCRIPTOR_KEY_PATTERN = /^[a-z][a-z0-9_]*\.[a-z][a-z0-9_]*$/;
const TABLE_NAME_PATTERN = /^awcms_micro_[a-z][a-z0-9_]*$/;
const COLUMN_NAME_PATTERN = /^[a-z][a-z0-9_]*$/;
const RESOURCE_TYPE_PATTERN = /^[a-z][a-z0-9_]{0,63}$/;
const URL_TEMPLATE_PATTERN = /^\/[A-Za-z0-9\-._~/:]*$/;
const EVENT_TYPE_PATTERN = /^[a-z0-9][a-z0-9.-]{0,127}$/;

export type NewsletterContentSourceRegistryIssue = {
  descriptorKey: string;
  message: string;
};

export function formatNewsletterContentSourceRegistryIssue(
  issue: NewsletterContentSourceRegistryIssue
): string {
  return `[${issue.descriptorKey}] ${issue.message}`;
}

/** A safe SQL identifier — snake_case, letter-first. Throws otherwise. Called immediately before interpolating any descriptor-declared column name into SQL. */
export function assertSafeIdentifier(name: string, role: string): string {
  if (typeof name !== "string" || !COLUMN_NAME_PATTERN.test(name)) {
    throw new Error(
      `newsletter: unsafe ${role} identifier ${JSON.stringify(name)} — must be snake_case (^[a-z][a-z0-9_]*$).`
    );
  }
  return name;
}

/** A safe table name — must start with `awcms_micro_`. Throws otherwise. */
export function assertSafeTableName(name: string): string {
  if (typeof name !== "string" || !TABLE_NAME_PATTERN.test(name)) {
    throw new Error(
      `newsletter: unsafe table name ${JSON.stringify(name)} — must match ^awcms_micro_[a-z][a-z0-9_]*$.`
    );
  }
  return name;
}

/** Flattens every registered module's own `newsletterContentSources` array into one list. Order follows `listModules()`, deterministic. */
export function collectNewsletterContentSourceDescriptors(
  modules: readonly ModuleDescriptor[]
): NewsletterContentSourceDescriptor[] {
  return modules.flatMap((module) => module.newsletterContentSources ?? []);
}

function checkColumn(
  push: (message: string) => void,
  value: string | undefined | null,
  label: string,
  required: boolean
): void {
  if (value === undefined || value === null) {
    if (required) push(`${label} is required.`);
    return;
  }
  if (!COLUMN_NAME_PATTERN.test(value)) {
    push(
      `${label} must be a valid column name (got ${JSON.stringify(value)}).`
    );
  }
}

function validateSingleDescriptor(
  ownerModule: ModuleDescriptor,
  descriptor: NewsletterContentSourceDescriptor
): NewsletterContentSourceRegistryIssue[] {
  const issues: NewsletterContentSourceRegistryIssue[] = [];
  const push = (message: string) =>
    issues.push({ descriptorKey: descriptor.key || "(missing key)", message });

  if (!descriptor.key || !DESCRIPTOR_KEY_PATTERN.test(descriptor.key)) {
    push(
      `key must be non-empty and match "<module_key>.<name>" (got ${JSON.stringify(descriptor.key)}).`
    );
  }

  if (descriptor.ownerModuleKey !== ownerModule.key) {
    push(
      `ownerModuleKey (${JSON.stringify(descriptor.ownerModuleKey)}) must equal the declaring module's own key (${JSON.stringify(ownerModule.key)}) — a module must not declare a content source it claims another module owns.`
    );
  }

  if (
    !descriptor.resourceType ||
    !RESOURCE_TYPE_PATTERN.test(descriptor.resourceType)
  ) {
    push(
      `resourceType must be a snake_case identifier (got ${JSON.stringify(descriptor.resourceType)}).`
    );
  }

  if (!descriptor.tableName || !TABLE_NAME_PATTERN.test(descriptor.tableName)) {
    push(
      `tableName must start with "awcms_micro_" and be snake_case (got ${JSON.stringify(descriptor.tableName)}).`
    );
  }

  checkColumn(
    push,
    descriptor.tenantColumn ?? "tenant_id",
    "tenantColumn",
    true
  );
  checkColumn(push, descriptor.idColumn ?? "id", "idColumn", true);
  checkColumn(push, descriptor.localeColumn, "localeColumn", true);
  checkColumn(push, descriptor.slugColumn, "slugColumn", false);
  checkColumn(push, descriptor.titleColumn, "titleColumn", true);
  checkColumn(push, descriptor.publishedAtColumn, "publishedAtColumn", true);

  if (
    !descriptor.urlTemplate ||
    !URL_TEMPLATE_PATTERN.test(descriptor.urlTemplate)
  ) {
    push(
      `urlTemplate must be an absolute path with only :slug/:id placeholders (got ${JSON.stringify(descriptor.urlTemplate)}).`
    );
  } else if (
    descriptor.urlTemplate.includes(":slug") &&
    !descriptor.slugColumn
  ) {
    push("urlTemplate uses :slug but slugColumn is not declared.");
  }

  if (
    !descriptor.publishEventType ||
    !EVENT_TYPE_PATTERN.test(descriptor.publishEventType)
  ) {
    push(
      `publishEventType must be a dotted event-type label (got ${JSON.stringify(descriptor.publishEventType)}).`
    );
  }

  if (typeof descriptor.digestEligible !== "boolean") {
    push("digestEligible must be a boolean.");
  }

  const filter = descriptor.publicationFilter;
  if (!filter || typeof filter !== "object") {
    push("publicationFilter is required.");
  } else {
    for (const key of Object.keys(filter.equals ?? {})) {
      checkColumn(push, key, `publicationFilter.equals["${key}"]`, true);
    }
    for (const [label, cols] of [
      ["notNullColumns", filter.notNullColumns],
      ["nullColumns", filter.nullColumns],
      ["timeReachedColumns", filter.timeReachedColumns]
    ] as const) {
      (cols ?? []).forEach((col, index) =>
        checkColumn(push, col, `publicationFilter.${label}[${index}]`, true)
      );
    }
  }

  return issues;
}

export type NewsletterContentSourceRegistryValidationResult = {
  valid: boolean;
  issues: NewsletterContentSourceRegistryIssue[];
  descriptors: readonly NewsletterContentSourceDescriptor[];
};

/**
 * Validates the WHOLE registry (every module's contributed descriptors):
 * per-descriptor structural validity plus cross-descriptor invariants (unique
 * `key`, unique `(tableName, resourceType)`).
 */
export function validateNewsletterContentSourceRegistry(
  modules: readonly ModuleDescriptor[]
): NewsletterContentSourceRegistryValidationResult {
  const issues: NewsletterContentSourceRegistryIssue[] = [];
  const allDescriptors: NewsletterContentSourceDescriptor[] = [];
  const seenKeys = new Map<string, number>();
  const seenTableType = new Map<string, number>();

  for (const module of modules) {
    for (const descriptor of module.newsletterContentSources ?? []) {
      allDescriptors.push(descriptor);
      issues.push(...validateSingleDescriptor(module, descriptor));
      seenKeys.set(descriptor.key, (seenKeys.get(descriptor.key) ?? 0) + 1);
      const tt = `${descriptor.tableName}|${descriptor.resourceType}`;
      seenTableType.set(tt, (seenTableType.get(tt) ?? 0) + 1);
    }
  }

  for (const [key, count] of seenKeys) {
    if (count > 1) {
      issues.push({
        descriptorKey: key,
        message: `key is registered ${count} times — newsletter content-source keys must be unique across the whole registry.`
      });
    }
  }

  for (const [tt, count] of seenTableType) {
    if (count > 1) {
      issues.push({
        descriptorKey: tt,
        message: `(tableName, resourceType) "${tt}" is declared ${count} times — two sources reading the same table as the same resource type would collide.`
      });
    }
  }

  return { valid: issues.length === 0, issues, descriptors: allDescriptors };
}

/** Resolves a descriptor's effective column names with defaults applied. */
export function resolveDescriptorColumns(
  descriptor: NewsletterContentSourceDescriptor
): {
  tenantColumn: string;
  idColumn: string;
  localeColumn: string;
  slugColumn: string | null;
  titleColumn: string;
  publishedAtColumn: string;
} {
  return {
    tenantColumn: descriptor.tenantColumn ?? "tenant_id",
    idColumn: descriptor.idColumn ?? "id",
    localeColumn: descriptor.localeColumn,
    slugColumn: descriptor.slugColumn ?? null,
    titleColumn: descriptor.titleColumn,
    publishedAtColumn: descriptor.publishedAtColumn
  };
}
