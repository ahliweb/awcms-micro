export type {
	SikesraAdminApiPath,
	SikesraAdminApiRequest,
	SikesraAdminUserHeaderSource,
} from "./client.js";
export {
	SIKESRA_ADMIN_API_PATHS,
	createSikesraAdminApiHeaders,
	createSikesraAdminApiUrl,
	postSikesraPlugin,
	SIKESRA_READ_ONLY_ADMIN_API_PATHS,
	SIKESRA_PLUGIN_API_BASE,
} from "./client.js";

export const SIKESRA_TYPED_ADMIN_API_WRAPPER_PATHS = [
	"overview/summary",
	"public/status",
	"registry/list",
	"registry/save",
	"registry/sikesra-id/correct",
	"registry/archive/list",
	"registry/soft-delete",
	"registry/restore",
	"documents/list",
	"documents/save",
	"documents/access",
	"import/create",
	"import/promote",
	"import/list",
	"import/staging/list",
	"duplicates/decide",
	"exports/create",
	"exports/list",
	"custom-attributes/definitions/list",
	"custom-attributes/definitions/save",
	"custom-attributes/values/list",
	"custom-attributes/values/save",
	"crud/permanent-delete/request",
	"crud/permanent-delete/requests/list",
	"crud/permanent-delete/approve",
	"crud/permanent-delete/execute",
	"verification/list",
	"verification/advance",
	"verification/reject",
	"settings/get",
	"settings/save",
	"regions/get",
	"regions/save",
	"local-regions/get",
	"local-regions/save",
	"data-types/get",
	"data-types/save",
	"audit/list",
	"access/permissions/list",
	"access/permissions/save",
	"access/roles/list",
	"access/roles/save",
	"access/users/list",
	"access/users/save",
	"access/scopes/list",
	"access/scopes/save",
	"access/matrix/get",
	"access/matrix/save",
	"access/preview",
	"access/health",
	"abac/attributes/list",
	"abac/attributes/save",
	"abac/subjects/list",
	"abac/subjects/save",
	"abac/resources/list",
	"abac/resources/save",
	"abac/policies/list",
	"abac/policies/save",
	"abac/preview",
	"abac/enforce-demo",
	"abac/health",
	"dashboard/summary",
] as const;

export {
	getAbacHealth,
	listAbacAttributes,
	listAbacPolicies,
	listAbacResources,
	listAbacSubjects,
	previewAbac,
	runAbacEnforceDemo,
	saveAbacAttribute,
	saveAbacPolicy,
	saveAbacResource,
	saveAbacSubject,
} from "./abac-api.js";
export {
	getAccessHealth,
	getAccessMatrix,
	listPermissions,
	listRoles,
	listScopes,
	listUsers,
	previewAccess,
	saveAccessMatrix,
	savePermission,
	saveRole,
	saveScope,
	saveUserRoles,
} from "./access-api.js";
export { listAuditEvents } from "./audit-api.js";
export type { SikesraCrudApiContract } from "./crud-api.js";
export {
	approvePermanentDelete,
	executePermanentDelete,
	listPermanentDeleteRequests,
	requestPermanentDelete,
} from "./crud-api.js";
export type { SikesraCustomAttributesApiContract } from "./custom-attributes-api.js";
export {
	listCustomAttributeDefinitions,
	listCustomAttributeValues,
	saveCustomAttributeDefinition,
	saveCustomAttributeValue,
} from "./custom-attributes-api.js";
export { getDataTypes, saveDataTypes } from "./data-types-api.js";
export { accessDocument, listDocuments, saveDocument } from "./documents-api.js";
export { decideDuplicate } from "./duplicates-api.js";
export { createExportJob, listExportJobs } from "./export-api.js";
export type { SikesraExportApiContract } from "./export-api.js";
export {
	createImportBatch,
	promoteImportRows,
	listImportBatches,
	listImportStagingRows,
} from "./import-api.js";
export { getDashboardSummary, getOverviewSummary, getPublicStatus } from "./overview-api.js";
export {
	correctRegistrySikesraId,
	listRegistry,
	listRegistryArchive,
	restoreRegistry,
	saveRegistry,
	softDeleteRegistry,
} from "./registry-api.js";
export { getLocalRegions, getRegions, saveLocalRegions, saveRegions } from "./regions-api.js";
export { getSettings, saveSettings } from "./settings-api.js";
export { advanceVerification, listVerification, rejectVerification } from "./verification-api.js";
