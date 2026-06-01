export const SIKESRA_D1_TABLES = {
	settings: "sikesra_settings",
	dataTypes: "sikesra_data_types",
	dataSubtypes: "sikesra_data_subtypes",
	regions: "sikesra_regions",
	officialRegions: "sikesra_official_regions",
	localRegions: "sikesra_local_regions",
	regionAliases: "sikesra_region_aliases",
	registryEntities: "sikesra_registry_entities",
	personProfiles: "sikesra_person_profiles",
	entityPeople: "sikesra_entity_people",
	codeSequences: "sikesra_code_sequences",
	codeHistory: "sikesra_code_history",
	rumahIbadahDetails: "sikesra_rumah_ibadah_details",
	lembagaKeagamaanDetails: "sikesra_lembaga_keagamaan_details",
	pendidikanKeagamaanDetails: "sikesra_pendidikan_keagamaan_details",
	lksDetails: "sikesra_lks_details",
	guruAgamaDetails: "sikesra_guru_agama_details",
	anakYatimDetails: "sikesra_anak_yatim_details",
	disabilitasDetails: "sikesra_disabilitas_details",
	lansiaTerlantarDetails: "sikesra_lansia_terlantar_details",
	documents: "sikesra_supporting_documents",
	fileObjects: "sikesra_file_objects",
	verificationStageState: "sikesra_verification_stage_state",
	verificationEvents: "sikesra_verification_events",
	importBatches: "sikesra_import_batches",
	importStagingRows: "sikesra_import_staging_rows",
	importMappingTemplates: "sikesra_import_mapping_templates",
	duplicateCandidates: "sikesra_duplicate_candidates",
	duplicateDecisions: "sikesra_duplicate_decisions",
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
