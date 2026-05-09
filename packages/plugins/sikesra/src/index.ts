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
export { listEntities, getEntityDetail, createEntity, patchEntity } from "./services/entity";
export { getOfficialRegions, getLocalRegions, createLocalRegion } from "./services/region";
export { generateSikesraId, correctSikesraId } from "./services/code";
export { submitEntity, verifyEntity, getVerificationQueue } from "./services/verification";
export {
  generateUploadUrl,
  completeUpload,
  getEntityDocuments,
  getDocumentDownloadUrl,
} from "./services/document";
export { createImportBatch, parseAndStageRows, promoteImportRows } from "./services/import";
export { getReports, createExportJob, getExportJob } from "./services/export";
export { getSettings, updateSettings } from "./services/settings";
export { listEntities as repoListEntities, getEntityById, createEntity as repoCreateEntity, patchEntity as repoPatchEntity } from "./repositories/entity-repository";
export { getOfficialRegionsRepo, getLocalRegionsRepo, createLocalRegionRepo } from "./repositories/region-repository";
export { writeVerificationEvent, getVerificationEvents, transitionEntityStatus } from "./repositories/verification-repository";
export { createFileObject, linkDocumentToEntity, getEntityDocumentsRepo } from "./repositories/document-repository";
export { getSettingsRepo, updateSettingsRepo } from "./repositories/settings-repository";
export { createImportBatchRepo, getImportBatch, getStagingRows, insertStagingRow, updateStagingRow, updateBatchCounts } from "./repositories/import-repository";
export { writeAuditLog, listAuditLogs } from "./repositories/audit-repository";

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
