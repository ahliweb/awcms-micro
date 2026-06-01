export const SIKESRA_D1_TABLES = {
	settings: "sikesra_settings",
	dataTypes: "sikesra_data_types",
	regions: "sikesra_regions",
	registryEntities: "sikesra_registry_entities",
	personProfiles: "sikesra_person_profiles",
	documents: "sikesra_supporting_documents",
	fileObjects: "sikesra_file_objects",
	verificationStageState: "sikesra_verification_stage_state",
	verificationEvents: "sikesra_verification_events",
	importBatches: "sikesra_import_batches",
	importStagingRows: "sikesra_import_staging_rows",
	importMappingTemplates: "sikesra_import_mapping_templates",
	permissions: "sikesra_permission_catalog",
	roles: "sikesra_role_catalog",
	rolePermissions: "sikesra_role_permission_assignments",
	userRoles: "sikesra_user_role_assignments",
	userScopes: "sikesra_user_scope_assignments",
	abacAttributes: "sikesra_abac_attribute_catalog",
	abacSubjects: "sikesra_abac_subject_assignments",
	abacResources: "sikesra_abac_resource_assignments",
	abacPolicies: "sikesra_abac_policy_rules",
	auditEvents: "sikesra_audit_events",
	exportJobs: "sikesra_export_jobs",
} as const;

export type SikesraD1TableName = (typeof SIKESRA_D1_TABLES)[keyof typeof SIKESRA_D1_TABLES];

export function assertSikesraTableName(table: string): asserts table is SikesraD1TableName {
	if (!table.startsWith("sikesra_")) {
		throw new Error(`SIKESRA repository table must use sikesra_ prefix: ${table}`);
	}
}
