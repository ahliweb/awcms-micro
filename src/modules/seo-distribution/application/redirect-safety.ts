/**
 * Create/update-time redirect safety checks (Issue #268, ADR-0028 §8) — the
 * "reject conflicts, loops, and excessive chains BEFORE they are stored" control.
 * Combines a source+scope conflict check with a bounded, non-recursive chain
 * preview that OVERLAYS the proposed rule on top of the tenant's existing active
 * rules and confirms it does not create a loop or a chain longer than the hop cap.
 *
 * Reused by create, bulk import, URL-change capture, and the `validate`/chain-
 * preview endpoint, so every write path applies the identical safety gate.
 */
import {
  resolveRedirectChain,
  type RedirectChainLookup,
  type RedirectChainOutcome,
  type RedirectHopRule
} from "../domain/redirect-chain";
import type { RedirectRuleInput } from "../domain/redirect-rule";
import {
  findActiveRedirectByPath,
  findConflictingRedirect,
  type RedirectRecord
} from "./redirect-directory";

/** Build a chain lookup that overlays the proposed rule at its own source path. */
function makeOverlayLookup(
  tx: Bun.SQL,
  tenantId: string,
  input: Pick<
    RedirectRuleInput,
    | "normalizedSourcePath"
    | "targetType"
    | "target"
    | "statusCode"
    | "preserveQuery"
    | "localeScope"
    | "domainScopeHost"
  >,
  now: Date
): RedirectChainLookup {
  const overlay: RedirectHopRule = {
    id: "__proposed__",
    targetType: input.targetType,
    target: input.target,
    statusCode: input.statusCode,
    preserveQuery: input.preserveQuery
  };

  return async (pathKey) => {
    if (pathKey === input.normalizedSourcePath) return overlay;
    const existing = await findActiveRedirectByPath(tx, tenantId, pathKey, {
      locale: input.localeScope,
      host: input.domainScopeHost,
      now
    });
    return existing
      ? {
          id: existing.id,
          targetType: existing.targetType,
          target: existing.target,
          statusCode: existing.statusCode,
          preserveQuery: existing.preserveQuery
        }
      : null;
  };
}

/** Preview the chain the proposed rule would produce (overlaid on existing rules). */
export async function previewRedirectChainForInput(
  tx: Bun.SQL,
  tenantId: string,
  input: RedirectRuleInput,
  now: Date
): Promise<RedirectChainOutcome> {
  return resolveRedirectChain(
    input.normalizedSourcePath,
    makeOverlayLookup(tx, tenantId, input, now)
  );
}

export type RedirectSafetyResult =
  | { ok: true; chain: RedirectChainOutcome }
  | {
      ok: false;
      code: "SOURCE_CONFLICT" | "REDIRECT_LOOP" | "REDIRECT_CHAIN_TOO_LONG";
      message: string;
      conflict?: RedirectRecord;
      chain?: RedirectChainOutcome;
    };

/**
 * Full pre-write safety gate: reject if the source+scope already has a live rule
 * (conflict), or if the proposed rule would create a loop / an over-long chain.
 * `excludeId` skips a conflict against the rule being updated in place.
 */
export async function checkRedirectSafety(
  tx: Bun.SQL,
  tenantId: string,
  input: RedirectRuleInput,
  now: Date,
  excludeId?: string
): Promise<RedirectSafetyResult> {
  const conflict = await findConflictingRedirect(
    tx,
    tenantId,
    input.normalizedSourcePath,
    input.localeScope,
    input.domainScopeHost,
    excludeId
  );

  if (conflict) {
    return {
      ok: false,
      code: "SOURCE_CONFLICT",
      message:
        "Another live rule already governs this source path and scope. Archive or delete it first.",
      conflict
    };
  }

  const chain = await previewRedirectChainForInput(tx, tenantId, input, now);

  if (chain.outcome === "loop") {
    return {
      ok: false,
      code: "REDIRECT_LOOP",
      message: "This rule would create a redirect loop.",
      chain
    };
  }

  if (chain.outcome === "chain_too_long") {
    return {
      ok: false,
      code: "REDIRECT_CHAIN_TOO_LONG",
      message:
        "This rule would create a redirect chain beyond the allowed length.",
      chain
    };
  }

  return { ok: true, chain };
}
