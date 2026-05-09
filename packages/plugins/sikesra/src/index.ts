import { definePlugin } from "emdash";
import type { PluginDescriptor } from "emdash";
export { fail, ok } from "./api/envelope";
export { getOrCreateRequestId } from "./api/request-id";
export { buildTrustedRequestContext } from "./security/request-context";
export { SIKESRA_PERMISSIONS, SIKESRA_PERMISSION_LIST } from "./security/permissions";
export {
  maskNikKia,
  maskNikKiaHash,
  maskPhone,
  maskProtectedName,
  maskEmail,
  maskAddress,
  maskDisabilityDetails,
  maskDesilLevel,
  maskR2Key,
  maskDocumentMetadata,
  maskAuditBeforeAfter,
  maskGuardianDetails,
} from "./security/masking";
export { writeAuditEvent, AUDIT_ACTIONS, isHighRiskAction } from "./services/audit";
export { evaluateAbac, buildAbacSubject } from "./security/abac";
export {
  getPublicMetadata,
  getPublicFilters,
  getPublicSummary,
  applySmallCellSuppression,
} from "./services/public";
export { getAdminDashboard } from "./services/dashboard";

export interface SikesraPluginOptions {
  enabled?: boolean;
}

export function sikesraPlugin(options: SikesraPluginOptions = {}): PluginDescriptor {
  return {
    id: "sikesra",
    version: "0.1.0",
    format: "native",
    entrypoint: "@ahliweb/plugin-sikesra",
    options,
    adminPages: [
      {
        path: "/",
        label: "SIKESRA",
      },
    ],
  };
}

export function createPlugin(_options: SikesraPluginOptions = {}) {
  return definePlugin({
    id: "sikesra",
    version: "0.1.0",
    routes: {},
    hooks: {},
  });
}

export default createPlugin;
