/**
 * Sanctioned entry point for turning managed-media enforcement ON for a tenant
 * (ADR-0026 step 5a). Wraps `markManagedMediaEnforced` with the readiness gate
 * its activation requires, plus the audit trail that makes "why is this tenant
 * enforcing" answerable from the log alone.
 *
 * This is the piece ADR-0026 steps 3-4 explicitly left as debt: those steps made
 * a brochure site able to have managed media *architecturally*, but the flag
 * (`sql/078`) was only ever written by `news_portal`'s R2-only preset — so an
 * operator with no news portal had the capability and no button. This is the
 * button.
 *
 * ## Enforcement is ONE-WAY, by construction — do not "complete the API"
 *
 * There is no `disableManagedMediaEnforcement` here, no "unmark" function in
 * `media-library-tenant-state.ts`, no `enforcement.disable` permission, and no
 * code path anywhere that DELETEs from `awcms_micro_media_library_tenant_state`.
 * This is not an oversight and it is not symmetry waiting to be tidied up.
 *
 * `sql/043`'s header records that the earlier `awcms_micro_module_settings`
 * approach was found **exploitable end-to-end in a security re-audit**: a tenant
 * holding a generic, unrelated permission could clear the marker and silently
 * switch off ALL of its own media reference validation. The fix was structural —
 * make the "off" transition not exist. Adding a disable path here re-introduces
 * that exploit with a friendlier name.
 *
 * A deployment that genuinely must roll enforcement back does so by changing
 * `NEWS_MEDIA_R2_ENABLED`/the R2 config — a deliberate, auditable operator act
 * outside the tenant's reach, which `evaluateManagedMediaReadiness` already
 * treats as fail-closed. That is the intended escape hatch.
 *
 * ## Why the readiness gate is here and not only in the route
 *
 * Same reasoning as `news_portal`'s `apply-news-portal-preset.ts`: the gate must
 * sit at the sanctioned entry point, not at one caller, so a future second
 * caller (a setup wizard step, a CLI) cannot bypass it by simply not knowing
 * about it. Enforcing registry-backed references on a deployment whose media
 * storage is not configured would make content unwritable rather than safer.
 */
import { recordAuditEvent } from "../../logging/application/audit-log";
import {
  evaluateManagedMediaReadiness,
  type ManagedMediaReadinessReason
} from "../domain/managed-media-readiness";
import {
  isManagedMediaEnforcedForTenant,
  markManagedMediaEnforced
} from "./media-library-tenant-state";

export type EnableManagedMediaEnforcementResult =
  | {
      outcome: "enabled";
      enforcedAt: Date;
      /** `true` when the tenant was already enforcing — the call is an idempotent no-change, still audited. */
      alreadyEnforced: boolean;
    }
  | {
      outcome: "rejected";
      code: "MANAGED_MEDIA_NOT_READY";
      reasons: ManagedMediaReadinessReason[];
      detail: string[];
    };

export async function enableManagedMediaEnforcement(
  tx: Bun.SQL,
  tenantId: string,
  actorTenantUserId: string,
  env: NodeJS.ProcessEnv = process.env,
  correlationId?: string | null,
  now: Date = new Date()
): Promise<EnableManagedMediaEnforcementResult> {
  const readiness = evaluateManagedMediaReadiness(env);

  if (!readiness.ready) {
    await recordAuditEvent(tx, {
      tenantId,
      actorTenantUserId,
      moduleKey: "media_library",
      action: "media_enforcement_activation_rejected",
      resourceType: "tenant_media_enforcement",
      resourceId: tenantId,
      severity: "warning",
      message: `Managed-media enforcement activation blocked: ${readiness.reasons.join(", ")}.`,
      attributes: { reasons: readiness.reasons, detail: readiness.detail },
      correlationId: correlationId ?? undefined
    });

    return {
      outcome: "rejected",
      code: "MANAGED_MEDIA_NOT_READY",
      reasons: readiness.reasons,
      detail: readiness.detail
    };
  }

  const alreadyEnforced = await isManagedMediaEnforcedForTenant(tx, tenantId);

  // Set unconditionally, including on re-activation: the timestamp then always
  // reflects the most recent confirmed-ready activation, matching what
  // `markFullOnlineR2ModeApplied` does for `news_portal`'s own marker.
  await markManagedMediaEnforced(tx, tenantId, now);

  await recordAuditEvent(tx, {
    tenantId,
    actorTenantUserId,
    moduleKey: "media_library",
    action: alreadyEnforced
      ? "media_enforcement_reaffirmed"
      : "media_enforcement_enabled",
    resourceType: "tenant_media_enforcement",
    resourceId: tenantId,
    severity: "info",
    message: alreadyEnforced
      ? "Managed-media enforcement re-affirmed (already active; readiness gate passed again)."
      : "Managed-media enforcement enabled (readiness gate passed). Content media references must now resolve to verified registry objects.",
    attributes: { alreadyEnforced },
    correlationId: correlationId ?? undefined
  });

  return { outcome: "enabled", enforcedAt: now, alreadyEnforced };
}
