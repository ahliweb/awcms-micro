/**
 * Tamper-proof per-tenant "managed media enforcement is on" signal (ADR-0026
 * step 3+4, migration `078_awcms_micro_media_library_tenant_state_schema.sql`).
 * See that migration's header for why this is a dedicated table rather than
 * `awcms_micro_tenant_modules`/`awcms_micro_module_settings` — both were tried
 * for the equivalent `news_portal` signal (sql/043) and both failed, one
 * silently useless, one silently exploitable.
 *
 * This is the media half of what used to be `news_portal`'s
 * `isFullOnlineR2ModeActiveForTenant`. It answers only "does THIS TENANT want
 * media references to be registry-backed" — never "is the deployment's R2
 * configured" (that is `domain/managed-media-readiness.ts`, pure) and never "is
 * the news portal on" (that is `news_portal`'s own business, and the whole point
 * of ADR-0026 is that media must not have to ask).
 *
 * `markManagedMediaEnforced` must only ever be called from a sanctioned preset
 * entry point (today: `news_portal`'s `apply-news-portal-preset.ts`). There is
 * deliberately no "unmark"/"clear" function and no HTTP route writes this table:
 * a tenant able to clear this flag could switch off its own media validation,
 * which is precisely the exploit sql/043's header documents.
 */

export async function markManagedMediaEnforced(
  tx: Bun.SQL,
  tenantId: string,
  enforcedAt: Date = new Date()
): Promise<void> {
  await tx`
    INSERT INTO awcms_micro_media_library_tenant_state
      (tenant_id, managed_media_enforced_at, updated_at)
    VALUES (${tenantId}, ${enforcedAt}, now())
    ON CONFLICT (tenant_id) DO UPDATE SET
      managed_media_enforced_at = ${enforcedAt},
      updated_at = now()
  `;
}

/**
 * `true` only if this tenant has a row here at all — a tenant that never had
 * `markManagedMediaEnforced` called for it (the overwhelming majority) has no
 * row, fail-closed by construction.
 */
export async function isManagedMediaEnforcedForTenant(
  tx: Bun.SQL,
  tenantId: string
): Promise<boolean> {
  const rows = (await tx`
    SELECT tenant_id FROM awcms_micro_media_library_tenant_state
    WHERE tenant_id = ${tenantId}
  `) as { tenant_id: string }[];

  return rows.length > 0;
}
