import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const pluginDir = resolve(scriptDir, "..");
const packageJson = JSON.parse(readFileSync(resolve(pluginDir, "package.json"), "utf8"));
const schemaSource = readFileSync(resolve(pluginDir, "src/db/schema.ts"), "utf8");
const schemaTablePattern = /:\s*"(sikesra_[a-z0-9_]+)"/g;
const migrationFiles = readdirSync(resolve(pluginDir, "migrations")).filter((file) =>
	file.endsWith(".sql"),
);

const requiredProtectedTables = [
	"sikesra_abac_attribute_catalog",
	"sikesra_abac_policy_rules",
	"sikesra_abac_resource_assignments",
	"sikesra_abac_subject_assignments",
	"sikesra_anak_yatim_details",
	"sikesra_audit_events",
	"sikesra_code_history",
	"sikesra_code_sequences",
	"sikesra_custom_attribute_change_events",
	"sikesra_custom_attribute_definitions",
	"sikesra_custom_attribute_values",
	"sikesra_data_subtypes",
	"sikesra_data_types",
	"sikesra_delete_approvals",
	"sikesra_delete_events",
	"sikesra_delete_requests",
	"sikesra_delete_snapshots",
	"sikesra_disabilitas_details",
	"sikesra_duplicate_candidates",
	"sikesra_duplicate_decisions",
	"sikesra_entity_people",
	"sikesra_export_jobs",
	"sikesra_field_standards",
	"sikesra_file_objects",
	"sikesra_guru_agama_details",
	"sikesra_import_batches",
	"sikesra_import_mapping_templates",
	"sikesra_import_staging_rows",
	"sikesra_lansia_terlantar_details",
	"sikesra_lembaga_keagamaan_details",
	"sikesra_lks_details",
	"sikesra_local_regions",
	"sikesra_official_regions",
	"sikesra_permission_catalog",
	"sikesra_pendidikan_keagamaan_details",
	"sikesra_person_profiles",
	"sikesra_region_aliases",
	"sikesra_regions",
	"sikesra_registry_entities",
	"sikesra_role_catalog",
	"sikesra_role_permission_assignments",
	"sikesra_rumah_ibadah_details",
	"sikesra_settings",
	"sikesra_supporting_documents",
	"sikesra_user_role_assignments",
	"sikesra_user_scope_assignments",
	"sikesra_verification_events",
	"sikesra_verification_stage_state",
].toSorted();
const d1Tables = Array.from(schemaSource.matchAll(schemaTablePattern), (match) => match[1]).toSorted();
const missingProtectedTables = requiredProtectedTables.filter((table) => !d1Tables.includes(table));
if (missingProtectedTables.length > 0) {
	console.error("SIKESRA backup inventory guard failed: missing protected tables.");
	for (const table of missingProtectedTables) console.error(`- ${table}`);
	process.exit(1);
}
const unprotectedSchemaTables = d1Tables.filter((table) => !requiredProtectedTables.includes(table));
if (unprotectedSchemaTables.length > 0) {
	console.error("SIKESRA backup inventory guard failed: schema tables missing from protected backup inventory.");
	for (const table of unprotectedSchemaTables) console.error(`- ${table}`);
	process.exit(1);
}
const storageCollections = [
	"sikesra_access_change_events",
	"sikesra_abac_change_events",
	"sikesra_registry_entities",
	"sikesra_abac_attribute_catalog",
	"sikesra_abac_policy_rules",
	"sikesra_supporting_documents",
	"sikesra_verification_stage_state",
	"sikesra_abac_resource_assignments",
	"sikesra_abac_subject_assignments",
	"sikesra_content_snapshots",
	"sikesra_settings_state",
	"sikesra_plugin_state",
	"sikesra_permission_catalog",
	"sikesra_role_catalog",
	"sikesra_role_permission_assignments",
	"sikesra_user_role_assignments",
	"sikesra_verification_events",
];

const inventory = {
	generatedAt: new Date().toISOString(),
	plugin: {
		name: packageJson.name,
		version: packageJson.version,
	},
	d1Tables,
	requiredProtectedTables,
	storageCollections,
	migrationFiles,
	notes: [
		"Record row counts per sikesra_ table before production rebuilds.",
		"Record R2 object inventory for SIKESRA document prefixes when R2 is configured.",
		"Record EmDash upstream commit/version from the parent workspace snapshot.",
	],
};

console.log(JSON.stringify(inventory, null, 2));
