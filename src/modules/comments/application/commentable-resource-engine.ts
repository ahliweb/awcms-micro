/**
 * Commentable-resource resolution engine (Issue #271, ADR-0032 §3/§5). Reads the
 * pure-data `CommentableResourceDescriptor`s that content modules declare (via
 * `listModules()`), and confirms — with a PARAMETERIZED query whose literal
 * filter VALUES are always bound and whose IDENTIFIERS are re-validated with
 * `assertSafeIdentifier`/`assertSafeTableName` — that a given (resourceType,
 * resourceId, locale) is a PUBLISHED, PUBLIC resource of THIS tenant. A comment
 * is only ever accepted or shown against a resource that passes this gate, so a
 * draft/private/deleted/scheduled resource can never receive or expose comments
 * (the exact discipline `site_search`'s source→index boundary uses).
 *
 * This engine reaches into another module's table ONLY through that module's own
 * declared descriptor (ADR-0013 §6) — never an ad hoc cross-module schema access.
 */
import { listModules } from "../../index";
import type { CommentableResourceDescriptor } from "../../_shared/module-contract";
import {
  assertSafeIdentifier,
  assertSafeTableName,
  collectCommentableResourceDescriptors,
  resolveDescriptorColumns
} from "../domain/commentable-resource-registry";

export type ResolvedCommentableResource = {
  descriptor: CommentableResourceDescriptor;
  resourceType: string;
  resourceId: string;
  locale: string;
  url: string;
};

/** All descriptors, deterministically ordered, from the effective registry. */
export function listCommentableDescriptors(): CommentableResourceDescriptor[] {
  return collectCommentableResourceDescriptors(listModules());
}

export function findDescriptorByResourceType(
  resourceType: string
): CommentableResourceDescriptor | undefined {
  return listCommentableDescriptors().find(
    (d) => d.resourceType === resourceType
  );
}

/** Builds the resolved public URL from the descriptor's template + row values. */
function buildUrl(
  descriptor: CommentableResourceDescriptor,
  resourceId: string,
  slug: string | null
): string {
  let url = descriptor.urlTemplate;
  if (url.includes(":slug")) {
    url = url.replace(":slug", encodeURIComponent(slug ?? ""));
  }
  if (url.includes(":id")) {
    url = url.replace(":id", encodeURIComponent(resourceId));
  }
  return url;
}

/**
 * Confirms a resource is published + public for this tenant and returns its
 * resolved URL, or `null` if it does not exist / is not public. Runs inside a
 * caller-provided tenant transaction (RLS FORCE'd).
 */
export async function resolvePublishedCommentableResource(
  tx: Bun.SQL,
  tenantId: string,
  input: { resourceType: string; resourceId: string; locale: string }
): Promise<ResolvedCommentableResource | null> {
  const descriptor = findDescriptorByResourceType(input.resourceType);
  if (!descriptor) return null;

  const table = assertSafeTableName(descriptor.tableName);
  const cols = resolveDescriptorColumns(descriptor);
  const tenantCol = assertSafeIdentifier(cols.tenantColumn, "tenantColumn");
  const idCol = assertSafeIdentifier(cols.idColumn, "idColumn");
  const localeCol = assertSafeIdentifier(cols.localeColumn, "localeColumn");
  const slugCol = cols.slugColumn
    ? assertSafeIdentifier(cols.slugColumn, "slugColumn")
    : null;

  // Build the SELECT column list (slug is optional).
  const selectCols = slugCol
    ? `${idCol} AS __id, ${slugCol} AS __slug`
    : `${idCol} AS __id`;

  // Build the publication predicate. IDENTIFIERS are validated + interpolated;
  // VALUES are always bound parameters (collected in `params`, referenced as $n).
  const filter = descriptor.publicationFilter;
  const clauses: string[] = [];
  const params: unknown[] = [];
  const bind = (value: unknown): string => {
    params.push(value);
    return `$${params.length}`;
  };

  // Mandatory tenant + id + locale scoping.
  clauses.push(`${tenantCol} = ${bind(tenantId)}`);
  clauses.push(`${idCol} = ${bind(input.resourceId)}`);
  clauses.push(`${localeCol} = ${bind(input.locale)}`);

  for (const [col, value] of Object.entries(filter.equals ?? {})) {
    clauses.push(`${assertSafeIdentifier(col, "equals")} = ${bind(value)}`);
  }
  for (const col of filter.notNullColumns ?? []) {
    clauses.push(`${assertSafeIdentifier(col, "notNull")} IS NOT NULL`);
  }
  for (const col of filter.nullColumns ?? []) {
    clauses.push(`${assertSafeIdentifier(col, "null")} IS NULL`);
  }
  for (const col of filter.timeReachedColumns ?? []) {
    clauses.push(`${assertSafeIdentifier(col, "timeReached")} <= now()`);
  }

  const sqlText = `SELECT ${selectCols} FROM ${table} WHERE ${clauses.join(" AND ")} LIMIT 1`;
  const rows = (await tx.unsafe(sqlText, params)) as Array<{
    __id: string;
    __slug?: string | null;
  }>;

  const row = rows[0];
  if (!row) return null;

  return {
    descriptor,
    resourceType: descriptor.resourceType,
    resourceId: input.resourceId,
    locale: input.locale,
    url: buildUrl(descriptor, input.resourceId, row.__slug ?? null)
  };
}
