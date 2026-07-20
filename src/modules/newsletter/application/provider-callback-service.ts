/**
 * Provider callback ingestion (Issue #272, ADR-0033). A verified provider
 * delivery/bounce/complaint/failed callback is recorded in the append-only
 * `awcms_micro_newsletter_provider_events` ledger (replay-safe via the UNIQUE
 * `dedupe_key`) and, for a bounce/complaint, applied as a suppression against the
 * matching subscriber. Signature + replay verification happens in the ROUTE
 * BEFORE this is called (`domain/provider-callback-verify.ts`); this layer trusts
 * only a pre-verified, hashed input and never sees a raw address.
 */
import { applyProviderSuppression } from "./subscriber-service";

export type ProviderCallbackInput = {
  provider: string;
  eventType: "delivered" | "bounce" | "complaint" | "failed";
  dedupeKey: string;
  signatureVerified: boolean;
  /** sha256 hash of the provider-supplied recipient address — NEVER a raw address. */
  emailHash: string | null;
  payloadDigest: string | null;
  correlationId?: string | null;
};

export type ProviderCallbackResult = {
  recorded: boolean;
  /** True when this dedupe_key was already seen (idempotent replay). */
  replay: boolean;
};

export async function recordProviderCallback(
  tx: Bun.SQL,
  tenantId: string,
  input: ProviderCallbackInput
): Promise<ProviderCallbackResult> {
  const inserted = (await tx`
    INSERT INTO awcms_micro_newsletter_provider_events
      (tenant_id, provider, event_type, dedupe_key, signature_verified,
       subscriber_email_hash, payload_digest)
    VALUES (${tenantId}, ${input.provider}, ${input.eventType}, ${input.dedupeKey},
            ${input.signatureVerified}, ${input.emailHash}, ${input.payloadDigest})
    ON CONFLICT (tenant_id, dedupe_key) DO NOTHING
    RETURNING id
  `) as { id: string }[];

  if (!inserted[0]) {
    // Replay: this callback was already ingested. Idempotent no-op.
    return { recorded: false, replay: true };
  }

  if (
    (input.eventType === "bounce" || input.eventType === "complaint") &&
    input.emailHash
  ) {
    await applyProviderSuppression(tx, tenantId, {
      emailHash: input.emailHash,
      reason: input.eventType,
      provider: input.provider,
      correlationId: input.correlationId ?? null
    });
  }

  return { recorded: true, replay: false };
}
