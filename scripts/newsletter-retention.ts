/**
 * newsletter-retention.ts — `bun run newsletter:retention`.
 *
 * Issue #272 (ADR-0033). Internal worker entrypoint mirroring
 * `scripts/comment-retention.ts` — not exposed over HTTP, run on a schedule. Two
 * bounded passes per active tenant:
 *
 *   1. `anonymizeAgedSubscribers` — NULL the recoverable address of aged
 *      unsubscribed/suppressed subscribers (retains the row + append-only consent/
 *      state history); SKIPPED for a tenant whose subscribers descriptor is under
 *      an active legal hold.
 *   2. `purgeExpiredTokens` — hard-delete expired/consumed double-opt-in tokens.
 *
 * Retention (pass 1) priority order: `--retention-days=<n>` CLI flag, then
 * `NEWSLETTER_RETENTION_DAYS` env var, then the module default (365 days).
 */
import { getWorkerDatabaseClient } from "../src/lib/database/client";
import { withTenant } from "../src/lib/database/tenant-context";
import { logScriptFailure } from "../src/lib/logging/error-log";
import { legalHoldGuardPortAdapter } from "../src/modules/data-lifecycle/application/legal-hold-guard-port-adapter";
import {
  anonymizeAgedSubscribers,
  NEWSLETTER_DEFAULT_ANONYMIZE_DAYS,
  purgeExpiredTokens
} from "../src/modules/newsletter/application/subscriber-retention";

const MAX_PASSES_PER_TENANT = 50;

type TenantRow = { id: string };

function resolveRetentionDays(): number {
  const flag = process.argv.find((arg) => arg.startsWith("--retention-days="));
  if (flag) {
    const parsed = Number(flag.split("=")[1]);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  const envValue = process.env.NEWSLETTER_RETENTION_DAYS;
  if (envValue) {
    const parsed = Number(envValue);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return NEWSLETTER_DEFAULT_ANONYMIZE_DAYS;
}

async function main() {
  const sql = getWorkerDatabaseClient();
  const correlationId = crypto.randomUUID();
  const retentionDays = resolveRetentionDays();

  try {
    const tenants = (await sql`
      SELECT id FROM awcms_micro_tenants WHERE status = 'active'
    `) as TenantRow[];

    const now = new Date();
    let totalAnonymized = 0;
    let totalPurged = 0;
    let heldTenants = 0;

    for (const tenant of tenants) {
      await withTenant(sql, tenant.id, async (tx) => {
        for (let pass = 0; pass < MAX_PASSES_PER_TENANT; pass += 1) {
          const result = await anonymizeAgedSubscribers(
            tx,
            tenant.id,
            legalHoldGuardPortAdapter,
            { retentionDays, now }
          );
          if (result.skippedForLegalHold) {
            heldTenants += 1;
            break;
          }
          totalAnonymized += result.anonymizedCount;
          if (result.anonymizedCount === 0) break;
        }

        for (let pass = 0; pass < MAX_PASSES_PER_TENANT; pass += 1) {
          const result = await purgeExpiredTokens(tx, tenant.id, { now });
          totalPurged += result.purgedCount;
          if (result.purgedCount === 0) break;
        }
      });
    }

    console.log(
      `newsletter:retention complete — correlationId=${correlationId} ` +
        `retentionDays=${retentionDays} tenants=${tenants.length} ` +
        `anonymized=${totalAnonymized} tokensPurged=${totalPurged} ` +
        `legalHoldSkipped=${heldTenants}`
    );
  } catch (error) {
    logScriptFailure("newsletter:retention FAILED", error);
  } finally {
    await sql.close({ timeout: 1 });
  }
}

if (import.meta.main) {
  await main();
}
