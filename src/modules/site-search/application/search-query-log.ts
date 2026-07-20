/**
 * Opt-in, minimized query logging for `site_search` (Issue #270, ADR-0031 §6 —
 * privacy-first). ONLY written when the tenant's `analytics_enabled` config is
 * on, and it stores ONLY a sha256 of the normalized query (never the raw query),
 * its length, the locale, and the result count — so no PII / sensitive parameter
 * can leak, and the follow-on retention purge (data_lifecycle) keeps it bounded.
 */
export async function recordSearchQuery(
  tx: Bun.SQL,
  tenantId: string,
  input: {
    queryHash: string;
    queryLength: number;
    locale: string;
    resultCount: number;
  }
): Promise<void> {
  await tx`
    INSERT INTO awcms_micro_site_search_query_log
      (tenant_id, query_hash, query_length, locale, result_count)
    VALUES (${tenantId}, ${input.queryHash}, ${input.queryLength},
            ${input.locale}, ${input.resultCount})
  `;
}
