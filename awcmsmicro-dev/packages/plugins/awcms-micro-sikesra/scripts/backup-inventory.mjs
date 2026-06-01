import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const pluginDir = resolve(scriptDir, "..");
const packageJson = JSON.parse(readFileSync(resolve(pluginDir, "package.json"), "utf8"));

const d1Tables = [
	"sikesra_settings",
	"sikesra_data_types",
	"sikesra_regions",
	"sikesra_registry_entities",
	"sikesra_person_profiles",
	"sikesra_supporting_documents",
	"sikesra_verification_events",
	"sikesra_import_batches",
	"sikesra_import_rows",
	"sikesra_export_jobs",
	"sikesra_audit_events",
	"sikesra_user_role_assignments",
	"sikesra_abac_policy_rules",
	"sikesra_custom_attribute_definitions",
	"sikesra_custom_attribute_values",
	"sikesra_delete_requests",
];
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
	storageCollections,
	notes: [
		"Record row counts per sikesra_ table before production rebuilds.",
		"Record R2 object inventory for SIKESRA document prefixes when R2 is configured.",
		"Record EmDash upstream commit/version from the parent workspace snapshot.",
	],
};

console.log(JSON.stringify(inventory, null, 2));
