/**
 * newsletter-dispatch.ts — `bun run newsletter:dispatch`.
 *
 * Issue #272 (ADR-0033). Internal worker entrypoint — not exposed over HTTP, run
 * on a schedule. For every active tenant, processes the queued per-recipient
 * `delivery_attempts` of each `dispatching` campaign/digest in bounded, resumable
 * batches (re-checking suppression + subscriber state at attempt time), then runs
 * a reconciliation pass that completes a campaign once no queued rows remain.
 *
 * Provider-neutral + ADR-0006: a `sent` attempt represents hand-off to the email
 * outbox — the actual provider send is a documented follow-up consumer OUTSIDE any
 * DB transaction. This job NEVER calls a provider inside a transaction and NEVER
 * appends domain events (the worker role has only SELECT on the outbox table).
 */
import { getWorkerDatabaseClient } from "../src/lib/database/client";
import { withTenant } from "../src/lib/database/tenant-context";
import { logScriptFailure } from "../src/lib/logging/error-log";
import { processDispatchBatch } from "../src/modules/newsletter/application/delivery-engine";
import { runReconciliation } from "../src/modules/newsletter/application/campaign-service";

const MAX_PASSES_PER_CAMPAIGN = 200;

type TenantRow = { id: string };
type CampaignRow = { id: string };

async function main() {
  const sql = getWorkerDatabaseClient();
  const correlationId = crypto.randomUUID();

  try {
    const tenants = (await sql`
      SELECT id FROM awcms_micro_tenants WHERE status = 'active'
    `) as TenantRow[];

    let totalSent = 0;
    let totalSuppressed = 0;
    let campaignsCompleted = 0;

    for (const tenant of tenants) {
      await withTenant(sql, tenant.id, async (tx) => {
        const campaigns = (await tx`
          SELECT id FROM awcms_micro_newsletter_campaigns
          WHERE tenant_id = ${tenant.id} AND status = 'dispatching'
        `) as CampaignRow[];

        for (const campaign of campaigns) {
          for (let pass = 0; pass < MAX_PASSES_PER_CAMPAIGN; pass += 1) {
            const result = await processDispatchBatch(
              tx,
              tenant.id,
              campaign.id
            );
            totalSent += result.sent;
            totalSuppressed += result.suppressed;
            if (result.processed === 0) break;
          }
          const recon = await runReconciliation(tx, tenant.id, campaign.id);
          if (recon.discrepancyCount === 0) campaignsCompleted += 1;
        }
      });
    }

    console.log(
      `newsletter:dispatch complete — correlationId=${correlationId} ` +
        `tenants=${tenants.length} sent=${totalSent} suppressed=${totalSuppressed} ` +
        `campaignsCompleted=${campaignsCompleted}`
    );
  } catch (error) {
    logScriptFailure("newsletter:dispatch FAILED", error);
  } finally {
    await sql.close({ timeout: 1 });
  }
}

if (import.meta.main) {
  await main();
}
