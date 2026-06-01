export interface SikesraCrudMutationMeta {
	reason?: string;
	confirmation?: string;
	requestId?: string;
}

export interface SikesraSoftDeleteRequest extends SikesraCrudMutationMeta {
	id: string;
}

export interface SikesraRestoreRequest extends SikesraCrudMutationMeta {
	id: string;
}

export interface SikesraPermanentDeleteRequest extends SikesraCrudMutationMeta {
	id?: string;
	targetTable: string;
	targetRecordId: string;
	targetType: string;
	targetSikesraId20?: string;
}

export type SikesraCrudOperationName =
	| "create"
	| "read_list"
	| "read_detail"
	| "update"
	| "soft_delete"
	| "restore"
	| "archive"
	| "permanent_delete";

export interface SikesraCrudOperationPolicy {
	operation: SikesraCrudOperationName;
	permissionSlug: string;
	allowedRoles: string[];
	requiredAbacScope: "none" | "record" | "region" | "organization";
	requiredRegionScope: boolean;
	requiredOrganizationScope: boolean;
	sensitivityRule: "public_safe" | "masked_by_default" | "restricted" | "append_first_retention_only";
	auditEventKind: string;
	requiresReason: boolean;
	requiresConfirmation: boolean;
	requiresBackupSnapshot: boolean;
	allowedWhenVerified: boolean;
	allowedWhenExported: boolean;
	allowedWhenReferencedByOtherRecords: boolean;
}

export interface SikesraCrudFeaturePolicy {
	feature: string;
	tables: string[];
	operations: SikesraCrudOperationPolicy[];
}

const CRUD_OPERATIONS: SikesraCrudOperationName[] = [
	"create",
	"read_list",
	"read_detail",
	"update",
	"soft_delete",
	"restore",
	"archive",
	"permanent_delete",
];

const MUTATING_OPERATIONS = new Set<SikesraCrudOperationName>([
	"create",
	"update",
	"soft_delete",
	"restore",
	"archive",
	"permanent_delete",
]);

function permissionFor(featurePermissionBase: string, operation: SikesraCrudOperationName) {
	if (operation === "read_list" || operation === "read_detail") return `${featurePermissionBase}.read`;
	if (operation === "archive") return "sikesra.lifecycle.archive";
	return `${featurePermissionBase}.${operation}`;
}

function createCrudFeaturePolicy(input: {
	feature: string;
	permissionBase: string;
	tables: string[];
	sensitivityRule?: SikesraCrudOperationPolicy["sensitivityRule"];
	requiredAbacScope?: SikesraCrudOperationPolicy["requiredAbacScope"];
	requiredRegionScope?: boolean;
	requiredOrganizationScope?: boolean;
}): SikesraCrudFeaturePolicy {
	return {
		feature: input.feature,
		tables: input.tables,
		operations: CRUD_OPERATIONS.map((operation) => {
			const permanentDelete = operation === "permanent_delete";
			const destructive = operation === "soft_delete" || operation === "archive" || permanentDelete;
			return {
				operation,
				permissionSlug: permissionFor(input.permissionBase, operation),
				allowedRoles: permanentDelete ? ["sikesra_super_admin"] : ["sikesra_admin", "sikesra_super_admin"],
				requiredAbacScope: input.requiredAbacScope ?? "record",
				requiredRegionScope: input.requiredRegionScope ?? false,
				requiredOrganizationScope: input.requiredOrganizationScope ?? false,
				sensitivityRule: input.sensitivityRule ?? "masked_by_default",
				auditEventKind: `crud.${operation}`,
				requiresReason: destructive || operation === "restore",
				requiresConfirmation: permanentDelete,
				requiresBackupSnapshot: permanentDelete,
				allowedWhenVerified: !destructive,
				allowedWhenExported: !destructive,
				allowedWhenReferencedByOtherRecords: !permanentDelete,
			};
		}),
	};
}

export const SIKESRA_CRUD_FEATURE_POLICIES: SikesraCrudFeaturePolicy[] = [
	createCrudFeaturePolicy({
		feature: "registry",
		permissionBase: "sikesra.registry",
		tables: ["sikesra_registry_entities"],
		requiredRegionScope: true,
	}),
	createCrudFeaturePolicy({
		feature: "person",
		permissionBase: "sikesra.person",
		tables: ["sikesra_person_profiles", "sikesra_entity_people"],
		sensitivityRule: "restricted",
		requiredRegionScope: true,
	}),
	createCrudFeaturePolicy({
		feature: "module_detail",
		permissionBase: "sikesra.module_detail",
		tables: [
			"sikesra_rumah_ibadah_details",
			"sikesra_lembaga_keagamaan_details",
			"sikesra_pendidikan_keagamaan_details",
			"sikesra_lks_details",
			"sikesra_guru_agama_details",
			"sikesra_anak_yatim_details",
			"sikesra_disabilitas_details",
			"sikesra_lansia_terlantar_details",
		],
		requiredRegionScope: true,
		requiredOrganizationScope: true,
	}),
	createCrudFeaturePolicy({
		feature: "document",
		permissionBase: "sikesra.document",
		tables: ["sikesra_supporting_documents"],
		sensitivityRule: "restricted",
	}),
	createCrudFeaturePolicy({
		feature: "file_metadata",
		permissionBase: "sikesra.file_metadata",
		tables: ["sikesra_file_objects"],
		sensitivityRule: "restricted",
	}),
	createCrudFeaturePolicy({
		feature: "import",
		permissionBase: "sikesra.import",
		tables: ["sikesra_import_batches", "sikesra_import_staging_rows", "sikesra_import_mapping_templates"],
	}),
	createCrudFeaturePolicy({
		feature: "export",
		permissionBase: "sikesra.export",
		tables: ["sikesra_export_jobs"],
		sensitivityRule: "restricted",
	}),
	createCrudFeaturePolicy({
		feature: "verification",
		permissionBase: "sikesra.verification",
		tables: ["sikesra_verification_stage_state", "sikesra_verification_events"],
	}),
	createCrudFeaturePolicy({
		feature: "settings",
		permissionBase: "sikesra.settings",
		tables: ["sikesra_settings"],
		requiredAbacScope: "none",
	}),
	createCrudFeaturePolicy({
		feature: "region",
		permissionBase: "sikesra.region",
		tables: ["sikesra_regions", "sikesra_official_regions", "sikesra_local_regions", "sikesra_region_aliases"],
	}),
	createCrudFeaturePolicy({
		feature: "data_type",
		permissionBase: "sikesra.data_type",
		tables: ["sikesra_data_types", "sikesra_data_subtypes"],
		requiredAbacScope: "none",
	}),
	createCrudFeaturePolicy({
		feature: "field_standard",
		permissionBase: "sikesra.field_standard",
		tables: ["sikesra_field_standards"],
		requiredAbacScope: "none",
	}),
	createCrudFeaturePolicy({
		feature: "custom_attribute",
		permissionBase: "sikesra.custom_attribute",
		tables: ["sikesra_custom_attribute_definitions"],
	}),
	createCrudFeaturePolicy({
		feature: "custom_attribute_value",
		permissionBase: "sikesra.custom_attribute_value",
		tables: ["sikesra_custom_attribute_values", "sikesra_custom_attribute_change_events"],
		sensitivityRule: "restricted",
	}),
	createCrudFeaturePolicy({
		feature: "rbac",
		permissionBase: "sikesra.rbac",
		tables: ["sikesra_permission_catalog", "sikesra_role_catalog", "sikesra_role_permission_assignments"],
		requiredAbacScope: "none",
	}),
	createCrudFeaturePolicy({
		feature: "abac",
		permissionBase: "sikesra.abac",
		tables: [
			"sikesra_abac_attribute_catalog",
			"sikesra_abac_subject_assignments",
			"sikesra_abac_resource_assignments",
			"sikesra_abac_policy_rules",
		],
		requiredAbacScope: "none",
	}),
	createCrudFeaturePolicy({
		feature: "user_assignment",
		permissionBase: "sikesra.user_assignment",
		tables: ["sikesra_user_role_assignments", "sikesra_user_scope_assignments"],
		requiredAbacScope: "none",
	}),
	{
		feature: "audit",
		tables: ["sikesra_audit_events"],
		operations: CRUD_OPERATIONS.map((operation) => ({
			operation,
			permissionSlug:
				operation === "permanent_delete" ? "sikesra.audit.retention_purge_execute" : "sikesra.audit.read",
			allowedRoles:
				operation === "permanent_delete" ? ["sikesra_super_admin"] : ["sikesra_auditor", "sikesra_super_admin"],
			requiredAbacScope: "none",
			requiredRegionScope: false,
			requiredOrganizationScope: false,
			sensitivityRule: "append_first_retention_only",
			auditEventKind: operation === "permanent_delete" ? "crud.retention_purge.execute" : `crud.${operation}`,
			requiresReason: MUTATING_OPERATIONS.has(operation),
			requiresConfirmation: operation === "permanent_delete",
			requiresBackupSnapshot: operation === "permanent_delete",
			allowedWhenVerified: false,
			allowedWhenExported: false,
			allowedWhenReferencedByOtherRecords: false,
		})),
	},
];
