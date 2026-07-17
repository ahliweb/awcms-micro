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
 * `markManagedMediaEnforced` must only ever be called from a sanctioned entry
 * point. There are exactly two, and both gate on readiness first:
 *
 *   1. `news_portal`'s `apply-news-portal-preset.ts` — the R2-only preset, which
 *      implies enforcement.
 *   2. `media_library`'s own `enable-managed-media-enforcement.ts` (ADR-0026
 *      step 5a) — the direct switch, exposed as `POST /api/v1/media/enforcement`
 *      for tenants with no news portal.
 *
 * There is deliberately no "unmark"/"clear" function, no `enforcement.disable`
 * permission, and no code path anywhere that DELETEs from this table. A tenant
 * able to clear this flag could switch off its own media validation, which is
 * precisely the exploit sql/043's header documents as confirmed-exploitable in
 * review. Enforcement is one-way BY CONSTRUCTION — that is the security
 * property, not an unfinished API. Do not add the symmetric operation.
 *
 * (2) means an HTTP route can now cause a write here, which sql/078's header
 * predates. That header's actual claim — no GENERIC write endpoint, nothing a
 * tenant can reach through an unrelated permission — still holds: the route is
 * dedicated, gated by its own dedicated permission, and can only ever turn
 * enforcement ON. See `sql/079`'s header for the full reconciliation.
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
