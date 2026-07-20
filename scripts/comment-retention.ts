/**
 * comment-retention.ts — `bun run comments:retention`.
 *
 * Issue #271 (ADR-0032). Internal worker entrypoint mirroring
 * `scripts/form-draft-purge.ts` — not exposed over HTTP, run on a schedule. Two
 * bounded passes per active tenant:
 *
 *   1. `anonymizeAgedComments` — NULL author identity fields on comments older
 *      than the retention cutoff (retains the row + body + moderation history);
 *      SKIPPED for a tenant whose comment content descriptor is under legal hold.
 *   2. `purgeUnconfirmedReplySubscriptions` — delete double-opt-in subscriptions
 *      never confirmed within the confirmation window.
 *
 * Retention (pass 1) priority order: `--retention-days=<n>` CLI flag, then
 * `COMMENTS_RETENTION_DAYS` env var, then the module default (365 days).
 */
import { getWorkerDatabaseClient } from "../src/lib/database/client";
import { withTenant } from "../src/lib/database/tenant-context";
import { logScriptFailure } from "../src/lib/logging/error-log";
import { legalHoldGuardPortAdapter } from "../src/modules/data-lifecycle/application/legal-hold-guard-port-adapter";
import {
  anonymizeAgedComments,
  COMMENTS_DEFAULT_ANONYMIZE_DAYS,
  purgeUnconfirmedReplySubscriptions
} from "../src/modules/comments/application/comment-retention";

const MAX_PASSES_PER_TENANT = 50;

type TenantRow = { id: string };

function resolveRetentionDays(): number {
  const flag = process.argv.find((arg) => arg.startsWith("--retention-days="));
  if (flag) {
    const parsed = Number(flag.split("=")[1]);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  const envValue = process.env.COMMENTS_RETENTION_DAYS;
  if (envValue) {
    const parsed = Number(envValue);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return COMMENTS_DEFAULT_ANONYMIZE_DAYS;
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
          const result = await anonymizeAgedComments(
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
          const result = await purgeUnconfirmedReplySubscriptions(
            tx,
            tenant.id,
            {
              now
            }
          );
          totalPurged += result.purgedCount;
          if (result.purgedCount === 0) break;
        }
      });
    }

    console.log(
      `comments:retention complete — correlationId=${correlationId} ` +
        `retentionDays=${retentionDays} tenants=${tenants.length} ` +
        `anonymized=${totalAnonymized} unconfirmedPurged=${totalPurged} ` +
        `legalHoldSkipped=${heldTenants}`
    );
  } catch (error) {
    logScriptFailure("comments:retention FAILED", error);
  } finally {
    await sql.close({ timeout: 1 });
  }
}

if (import.meta.main) {
  await main();
}
