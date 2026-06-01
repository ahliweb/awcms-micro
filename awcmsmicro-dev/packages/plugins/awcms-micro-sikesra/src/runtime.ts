import type {
	FieldWidgetConfig,
	PluginContext,
	PluginRoute as NativePluginRoute,
	PluginStorageConfig,
	PortableTextBlockConfig,
} from "emdash";
import type { SandboxedPlugin, SandboxedRequest, SandboxedRouteContext } from "emdash/plugin";

import {
	SIKESRA_REFERENCE_FIXTURES,
	type SikesraReferenceRegistryEntity,
	type SikesraReferenceSupportingDocument,
	type SikesraUserLevel,
	type SikesraReferenceVerificationEvent,
	type SikesraSensitivity,
} from "./fixtures.js";
import { adaptToEmdashPages, type AwcmsModuleManifest } from "./navigation.js";

export interface AdministrativeRegion {
	code: string;
	name: string;
}

export interface AdministrativeDistrict extends AdministrativeRegion {
	villages: AdministrativeRegion[];
}

export interface AdministrativeRegency extends AdministrativeRegion {
	districts: AdministrativeDistrict[];
}

export interface AdministrativeProvince extends AdministrativeRegion {
	regencies: AdministrativeRegency[];
}

export const DEFAULT_REGION_TREE: AdministrativeProvince[] = [
	{
		code: "62",
		name: "Kalimantan Tengah",
		regencies: [
			{
				code: "6201",
				name: "Kotawaringin Barat",
				districts: [
					{
						code: "620101",
						name: "Arut Selatan",
						villages: [
							{ code: "6201010001", name: "Kelurahan Baru" },
							{ code: "6201010002", name: "Kelurahan Madurejo" },
							{ code: "6201010003", name: "Kelurahan Mendawai" },
							{ code: "6201010004", name: "Kelurahan Mendawai Seberang" },
							{ code: "6201010005", name: "Kelurahan Raja" },
							{ code: "6201010006", name: "Kelurahan Raja Seberang" },
							{ code: "6201010007", name: "Kelurahan Sidorejo" },
							{ code: "6201010008", name: "Kenambui" },
							{ code: "6201010009", name: "Kumpai Batu Atas" },
							{ code: "6201010010", name: "Kumpai Batu Bawah" },
							{ code: "6201010011", name: "Medang Sari" },
							{ code: "6201010012", name: "Natai Baru" },
							{ code: "6201010013", name: "Natai Raya" },
							{ code: "6201010014", name: "Pasir Panjang" },
							{ code: "6201010015", name: "Rangda" },
							{ code: "6201010016", name: "Runtu" },
							{ code: "6201010017", name: "Sulung" },
							{ code: "6201010018", name: "Tanjung Putri" },
							{ code: "6201010019", name: "Tanjung Terantang" },
							{ code: "6201010020", name: "Umpang" },
						],
					},
					{
						code: "620102",
						name: "Arut Utara",
						villages: [
							{ code: "6201020001", name: "Kelurahan Pangkut" },
							{ code: "6201020002", name: "Gandis" },
							{ code: "6201020003", name: "Kerabu" },
							{ code: "6201020004", name: "Nanga Mua" },
							{ code: "6201020005", name: "Panahan" },
							{ code: "6201020006", name: "Pandan" },
							{ code: "6201020007", name: "Penyombaan" },
							{ code: "6201020008", name: "Riam" },
							{ code: "6201020009", name: "Sambi" },
							{ code: "6201020010", name: "Sukarami" },
							{ code: "6201020011", name: "Sungai Dau" },
						],
					},
					{
						code: "620103",
						name: "Kotawaringin Lama",
						villages: [
							{ code: "6201030001", name: "Kelurahan Kotawaringin Hilir" },
							{ code: "6201030002", name: "Kelurahan Kotawaringin Hulu" },
							{ code: "6201030003", name: "Babual Baboti" },
							{ code: "6201030004", name: "Dawak" },
							{ code: "6201030005", name: "Ipuh Bangun Jaya" },
							{ code: "6201030006", name: "Kinjil" },
							{ code: "6201030007", name: "Kondang" },
							{ code: "6201030008", name: "Lalang" },
							{ code: "6201030009", name: "Palih Baru" },
							{ code: "6201030010", name: "Riam Durian" },
							{ code: "6201030011", name: "Rungun" },
							{ code: "6201030012", name: "Suka Mulya" },
							{ code: "6201030013", name: "Sakabulin" },
							{ code: "6201030014", name: "Sukajaya" },
							{ code: "6201030015", name: "Suka Makmur" },
							{ code: "6201030016", name: "Sumber Mukti" },
							{ code: "6201030017", name: "Tempayung" },
						],
					},
					{
						code: "620104",
						name: "Kumai",
						villages: [
							{ code: "6201040001", name: "Kelurahan Candi" },
							{ code: "6201040002", name: "Kelurahan Kumai Hilir" },
							{ code: "6201040003", name: "Kelurahan Kumai Hulu" },
							{ code: "6201040004", name: "Batu Belaman" },
							{ code: "6201040005", name: "Bumi Harjo" },
							{ code: "6201040006", name: "Keraya" },
							{ code: "6201040007", name: "Kubu" },
							{ code: "6201040008", name: "Pangkalan Satu" },
							{ code: "6201040009", name: "Sabuai" },
							{ code: "6201040010", name: "Sebuai Timur" },
							{ code: "6201040011", name: "Sungai Bakau" },
							{ code: "6201040012", name: "Sungai Bedaun" },
							{ code: "6201040013", name: "Sungai Cabang" },
							{ code: "6201040014", name: "Sungai Kapitan" },
							{ code: "6201040015", name: "Sungai Sekonyer" },
							{ code: "6201040016", name: "Sungai Tendang" },
							{ code: "6201040017", name: "Teluk Bogam" },
							{ code: "6201040018", name: "Teluk Pulai" },
						],
					},
					{
						code: "620105",
						name: "Pangkalan Banteng",
						villages: [
							{ code: "6201050001", name: "Amin Jaya" },
							{ code: "6201050002", name: "Arga Mulya" },
							{ code: "6201050003", name: "Berambai Makmur" },
							{ code: "6201050004", name: "Karang Mulya" },
							{ code: "6201050005", name: "Karang Sari" },
							{ code: "6201050006", name: "Kebon Agung" },
							{ code: "6201050007", name: "Marga Mulya" },
							{ code: "6201050008", name: "Mulya Jadi" },
							{ code: "6201050009", name: "Natai Kerbau" },
							{ code: "6201050010", name: "Pangkalan Banteng" },
							{ code: "6201050011", name: "Sido Mulyo" },
							{ code: "6201050012", name: "Simpang Berambai" },
							{ code: "6201050013", name: "Sungai Bengkuang" },
							{ code: "6201050014", name: "Sungai Hijau" },
							{ code: "6201050015", name: "Sungai Kuning" },
							{ code: "6201050016", name: "Sungai Pakit" },
							{ code: "6201050017", name: "Sungai Pulau" },
						],
					},
					{
						code: "620106",
						name: "Pangkalan Lada",
						villages: [
							{ code: "6201060001", name: "Kadipi Atas" },
							{ code: "6201060002", name: "Lada Mandala Jaya" },
							{ code: "6201060003", name: "Makarti Jaya" },
							{ code: "6201060004", name: "Pandu Sanjaya" },
							{ code: "6201060005", name: "Pangkalan Dewa" },
							{ code: "6201060006", name: "Pangkalan Durin" },
							{ code: "6201060007", name: "Pangkalan Tiga" },
							{ code: "6201060008", name: "Purbasari" },
							{ code: "6201060009", name: "Sumber Agung" },
							{ code: "6201060010", name: "Sungai Rangit Jaya" },
							{ code: "6201060011", name: "Terantang" },
						],
					},
				],
			},
		],
	},
];

export interface SikesraSubType {
	code: string;
	label: string;
}

export interface SikesraParentType {
	id: string;
	code: string;
	label: string;
	subTypes: SikesraSubType[];
}

export const DEFAULT_DATA_TYPES: SikesraParentType[] = [
	{
		id: "rumah_ibadah",
		code: "01",
		label: "Rumah Ibadah",
		subTypes: [
			{ code: "01", label: "Masjid" },
			{ code: "02", label: "Gereja Protestan" },
			{ code: "03", label: "Gereja Katolik" },
			{ code: "04", label: "Pura" },
			{ code: "05", label: "Wihara" },
			{ code: "06", label: "Klenteng" },
			{ code: "99", label: "Lainnya" },
		],
	},
	{
		id: "lembaga_keagamaan",
		code: "02",
		label: "Lembaga Keagamaan",
		subTypes: [
			{ code: "01", label: "MUI (Majelis Ulama Indonesia)" },
			{ code: "02", label: "DMI (Dewan Masjid Indonesia)" },
			{ code: "03", label: "LPTQ" },
			{ code: "04", label: "FKUB" },
			{ code: "99", label: "Lainnya" },
		],
	},
	{
		id: "pendidikan_keagamaan",
		code: "03",
		label: "Pendidikan Keagamaan",
		subTypes: [
			{ code: "01", label: "Pesantren" },
			{ code: "02", label: "Madrasah" },
			{ code: "03", label: "TPQ" },
			{ code: "04", label: "Sekolah Minggu" },
			{ code: "99", label: "Lainnya" },
		],
	},
	{
		id: "lks",
		code: "04",
		label: "Lembaga Kesejahteraan Sosial",
		subTypes: [
			{ code: "01", label: "Panti Asuhan" },
			{ code: "02", label: "Panti Jompo" },
			{ code: "03", label: "Rehabilitasi Sosial" },
			{ code: "99", label: "Lainnya" },
		],
	},
	{
		id: "guru_agama",
		code: "05",
		label: "Guru Agama",
		subTypes: [
			{ code: "01", label: "Guru Agama Islam" },
			{ code: "02", label: "Guru Agama Kristen" },
			{ code: "03", label: "Guru Agama Katolik" },
			{ code: "04", label: "Guru Agama Hindu" },
			{ code: "05", label: "Guru Agama Buddha" },
			{ code: "06", label: "Guru Agama Khonghucu" },
		],
	},
	{
		id: "anak_yatim",
		code: "06",
		label: "Anak Yatim",
		subTypes: [
			{ code: "01", label: "Yatim Piatu (Balita)" },
			{ code: "02", label: "Yatim Piatu (Anak Sekolah)" },
			{ code: "03", label: "Yatim Piatu (Remaja)" },
			{ code: "99", label: "Lainnya" },
		],
	},
	{
		id: "disabilitas",
		code: "07",
		label: "Disabilitas",
		subTypes: [
			{ code: "01", label: "Tuna Netra" },
			{ code: "02", label: "Tuna Rungu / Wicara" },
			{ code: "03", label: "Tuna Daksa" },
			{ code: "04", label: "Tuna Grahita" },
			{ code: "99", label: "Lainnya" },
		],
	},
	{
		id: "lansia_terlantar",
		code: "08",
		label: "Lansia Terlantar",
		subTypes: [
			{ code: "01", label: "Lansia Terlantar Mandiri" },
			{ code: "02", label: "Lansia Terlantar Bedridden" },
			{ code: "99", label: "Lainnya" },
		],
	},
];

export const AWCMS_SIKESRA_PLUGIN_ID = "awcms-micro-sikesra";
const AWCMS_SIKESRA_LEGACY_PLUGIN_ID = "awcms-micro-example";

export const AWCMS_SIKESRA_CAPABILITIES = [
	"content:read",
	"content:write",
	"media:read",
	"media:write",
] as const;

export const AWCMS_SIKESRA_ALLOWED_HOSTS: string[] = [];

export const AWCMS_SIKESRA_STORAGE = {
	sikesra_access_change_events: {
		indexes: ["timestamp", "kind", "scope", ["scope", "timestamp"]],
	},
	sikesra_abac_change_events: {
		indexes: ["timestamp", "kind", "scope", ["scope", "timestamp"]],
	},
	sikesra_registry_entities: {
		indexes: ["code", "entityType", "sensitivity", ["entityType", "sensitivity"]],
	},
	sikesra_abac_attribute_catalog: {
		indexes: ["key", "targetType", "updatedAt", ["targetType", "updatedAt"]],
	},
	sikesra_abac_policy_rules: {
		indexes: ["id", "effect", "updatedAt", ["effect", "updatedAt"]],
	},
	sikesra_supporting_documents: {
		indexes: [
			"registryEntityId",
			"documentType",
			"sensitivity",
			["registryEntityId", "sensitivity"],
		],
	},
	sikesra_verification_stage_state: {
		indexes: ["registryEntityId", "stage", "updatedAt", ["registryEntityId", "updatedAt"]],
	},
	sikesra_abac_resource_assignments: {
		indexes: ["resourceId", "updatedAt"],
	},
	sikesra_abac_subject_assignments: {
		indexes: ["subjectId", "updatedAt"],
	},
	sikesra_content_snapshots: {
		indexes: [
			"collection",
			"contentId",
			"timestamp",
			["collection", "timestamp"],
			["contentId", "timestamp"],
		],
	},
	sikesra_settings_state: {
		indexes: ["key", "updatedAt"],
	},
	sikesra_plugin_state: {
		indexes: ["key", "updatedAt"],
	},
	sikesra_permission_catalog: {
		indexes: ["slug", "scope", "updatedAt", ["scope", "updatedAt"]],
	},
	sikesra_role_catalog: {
		indexes: ["slug", "updatedAt"],
	},
	sikesra_role_permission_assignments: {
		indexes: ["roleSlug", "updatedAt"],
	},
	sikesra_user_role_assignments: {
		indexes: ["userId", "updatedAt"],
	},
	sikesra_verification_events: {
		indexes: ["registryEntityId", "stage", "createdAt", ["registryEntityId", "createdAt"]],
	},
} satisfies PluginStorageConfig;

export const AWCMS_SIKESRA_DESCRIPTOR_STORAGE = AWCMS_SIKESRA_STORAGE;

export const AWCMS_SIKESRA_D1_TABLE_NAMES = [
	"sikesra_settings",
	"sikesra_data_types",
	"sikesra_data_subtypes",
	"sikesra_field_standards",
	"sikesra_regions",
	"sikesra_official_regions",
	"sikesra_local_regions",
	"sikesra_region_aliases",
	"sikesra_registry_entities",
	"sikesra_person_profiles",
	"sikesra_entity_people",
	"sikesra_code_sequences",
	"sikesra_code_history",
	"sikesra_rumah_ibadah_details",
	"sikesra_lembaga_keagamaan_details",
	"sikesra_pendidikan_keagamaan_details",
	"sikesra_lks_details",
	"sikesra_guru_agama_details",
	"sikesra_anak_yatim_details",
	"sikesra_disabilitas_details",
	"sikesra_lansia_terlantar_details",
	"sikesra_file_objects",
	"sikesra_supporting_documents",
	"sikesra_verification_stage_state",
	"sikesra_verification_events",
	"sikesra_import_batches",
	"sikesra_import_staging_rows",
	"sikesra_import_mapping_templates",
	"sikesra_duplicate_candidates",
	"sikesra_duplicate_decisions",
	"sikesra_export_jobs",
	"sikesra_audit_events",
	"sikesra_permission_catalog",
	"sikesra_role_catalog",
	"sikesra_role_permission_assignments",
	"sikesra_user_role_assignments",
	"sikesra_user_scope_assignments",
	"sikesra_abac_attribute_catalog",
	"sikesra_abac_subject_assignments",
	"sikesra_abac_resource_assignments",
	"sikesra_abac_policy_rules",
	"sikesra_custom_attribute_definitions",
	"sikesra_custom_attribute_values",
	"sikesra_custom_attribute_change_events",
	"sikesra_delete_requests",
	"sikesra_delete_approvals",
	"sikesra_delete_snapshots",
	"sikesra_delete_events",
] as const;

const AWCMS_SIKESRA_AUDIT_TABLE = "sikesra_audit_events";
const AWCMS_SIKESRA_SETTINGS_TABLE = "sikesra_settings";
const AWCMS_SIKESRA_DATA_TYPES_TABLE = "sikesra_data_types";
const AWCMS_SIKESRA_DATA_SUBTYPES_TABLE = "sikesra_data_subtypes";
const AWCMS_SIKESRA_OFFICIAL_REGIONS_TABLE = "sikesra_official_regions";
const AWCMS_SIKESRA_LOCAL_REGIONS_TABLE = "sikesra_local_regions";
const AWCMS_SIKESRA_REGISTRY_ENTITIES_TABLE = "sikesra_registry_entities";
const AWCMS_SIKESRA_CODE_SEQUENCES_TABLE = "sikesra_code_sequences";
const AWCMS_SIKESRA_CODE_HISTORY_TABLE = "sikesra_code_history";
const AWCMS_SIKESRA_FILE_OBJECTS_TABLE = "sikesra_file_objects";
const AWCMS_SIKESRA_SUPPORTING_DOCUMENTS_TABLE = "sikesra_supporting_documents";
const AWCMS_SIKESRA_IMPORT_BATCHES_TABLE = "sikesra_import_batches";
const AWCMS_SIKESRA_IMPORT_STAGING_ROWS_TABLE = "sikesra_import_staging_rows";
const AWCMS_SIKESRA_IMPORT_MAPPING_TEMPLATES_TABLE = "sikesra_import_mapping_templates";
const AWCMS_SIKESRA_DUPLICATE_CANDIDATES_TABLE = "sikesra_duplicate_candidates";
const AWCMS_SIKESRA_DUPLICATE_DECISIONS_TABLE = "sikesra_duplicate_decisions";
const AWCMS_SIKESRA_EXPORT_JOBS_TABLE = "sikesra_export_jobs";
const AWCMS_SIKESRA_CUSTOM_ATTRIBUTE_DEFINITIONS_TABLE = "sikesra_custom_attribute_definitions";
const AWCMS_SIKESRA_CUSTOM_ATTRIBUTE_VALUES_TABLE = "sikesra_custom_attribute_values";
const AWCMS_SIKESRA_CUSTOM_ATTRIBUTE_CHANGE_EVENTS_TABLE = "sikesra_custom_attribute_change_events";
const AWCMS_SIKESRA_DELETE_REQUESTS_TABLE = "sikesra_delete_requests";
const AWCMS_SIKESRA_DELETE_APPROVALS_TABLE = "sikesra_delete_approvals";
const AWCMS_SIKESRA_DELETE_SNAPSHOTS_TABLE = "sikesra_delete_snapshots";
const AWCMS_SIKESRA_DELETE_EVENTS_TABLE = "sikesra_delete_events";
const AWCMS_SIKESRA_VERIFICATION_STAGE_STATE_TABLE = "sikesra_verification_stage_state";
const AWCMS_SIKESRA_VERIFICATION_EVENTS_TABLE = "sikesra_verification_events";
const AWCMS_SIKESRA_DOCUMENT_CLASSIFICATIONS = [
	"public_safe",
	"internal",
	"restricted",
] as const;
const AWCMS_SIKESRA_DOCUMENT_CONTENT_TYPES = [
	"application/pdf",
	"image/jpeg",
	"image/png",
] as const;
const AWCMS_SIKESRA_DOCUMENT_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const AWCMS_SIKESRA_MODULE_DETAIL_TABLES: Record<string, string> = {
	rumah_ibadah: "sikesra_rumah_ibadah_details",
	lembaga_keagamaan: "sikesra_lembaga_keagamaan_details",
	pendidikan_keagamaan: "sikesra_pendidikan_keagamaan_details",
	lks: "sikesra_lks_details",
	guru_agama: "sikesra_guru_agama_details",
	anak_yatim: "sikesra_anak_yatim_details",
	disabilitas: "sikesra_disabilitas_details",
	lansia_terlantar: "sikesra_lansia_terlantar_details",
};
const AWCMS_SIKESRA_DEFAULT_TENANT_ID = "t-local-dev";
const AWCMS_SIKESRA_DEFAULT_SITE_ID = "default";

const AWCMS_SIKESRA_LEGACY_STORAGE_COLLECTIONS = [
	{ from: "auditEvents", to: "sikesra_audit_events" },
	{ from: "accessChangeEvents", to: "sikesra_access_change_events" },
	{ from: "abacChangeEvents", to: "sikesra_abac_change_events" },
	{ from: "registryEntities", to: "sikesra_registry_entities" },
	{ from: "settingsState", to: "sikesra_settings_state" },
	{ from: "pluginState", to: "sikesra_plugin_state" },
	{ from: "verificationStageState", to: "sikesra_verification_stage_state" },
	{ from: "abacAttributeCatalog", to: "sikesra_abac_attribute_catalog" },
	{ from: "abacPolicyRules", to: "sikesra_abac_policy_rules" },
	{ from: "abacResourceAssignments", to: "sikesra_abac_resource_assignments" },
	{ from: "abacSubjectAssignments", to: "sikesra_abac_subject_assignments" },
	{ from: "contentSnapshots", to: "sikesra_content_snapshots" },
	{ from: "permissionCatalog", to: "sikesra_permission_catalog" },
	{ from: "roleCatalog", to: "sikesra_role_catalog" },
	{ from: "rolePermissionAssignments", to: "sikesra_role_permission_assignments" },
	{ from: "userRoleAssignments", to: "sikesra_user_role_assignments" },
	{ from: "supportingDocuments", to: "sikesra_supporting_documents" },
	{ from: "verificationEvents", to: "sikesra_verification_events" },
] as const;

interface PluginStorageRow {
	id: string;
	data: string;
	created_at?: string | null;
	updated_at?: string | null;
}

interface SikesraAuditEventRow {
	tenant_id?: string;
	site_id?: string;
	id: string;
	timestamp: string;
	kind: string;
	scope: string;
	actor?: string;
	actor_user_id?: string | null;
	actor_name?: string | null;
	summary: string;
	metadata?: string;
	metadata_json?: string;
	request_id?: string | null;
	ip_hash?: string | null;
	user_agent_hash?: string | null;
	created_at?: string | null;
}

function toTimestamp(value: string | null | undefined): number {
	if (!value) return -1;
	const parsed = Date.parse(value);
	return Number.isNaN(parsed) ? -1 : parsed;
}

function isLegacyRowNewer(
	legacy: PluginStorageRow,
	current: { created_at?: string | null; updated_at?: string | null } | undefined,
): boolean {
	if (!current) return true;
	const legacyUpdated = toTimestamp(legacy.updated_at ?? legacy.created_at ?? null);
	const currentUpdated = toTimestamp(current.updated_at ?? current.created_at ?? null);
	return legacyUpdated > currentUpdated;
}

async function ensureAuditEventTable(db: any) {
	await db.schema
		.createTable(AWCMS_SIKESRA_AUDIT_TABLE)
		.ifNotExists()
		.addColumn("tenant_id", "text", (column: any) => column.notNull())
		.addColumn("site_id", "text", (column: any) => column.notNull())
		.addColumn("id", "text", (column: any) => column.notNull())
		.addColumn("timestamp", "text", (column: any) => column.notNull())
		.addColumn("kind", "text", (column: any) => column.notNull())
		.addColumn("scope", "text", (column: any) => column.notNull())
		.addColumn("actor_user_id", "text")
		.addColumn("actor_name", "text")
		.addColumn("summary", "text", (column: any) => column.notNull())
		.addColumn("metadata_json", "text", (column: any) => column.notNull())
		.addColumn("redaction_policy", "text", (column: any) => column.notNull())
		.addColumn("request_id", "text")
		.addColumn("ip_hash", "text")
		.addColumn("user_agent_hash", "text")
		.addColumn("created_at", "text", (column: any) => column.notNull())
		.execute();
}

async function migrateLegacyStorageCollections(ctx: PluginContext) {
	const db = (ctx as PluginContext & { db?: unknown }).db as any;

	if (!db) return;

	await ensureAuditEventTable(db);

	let migratedRows = 0;
	for (const { from, to } of AWCMS_SIKESRA_LEGACY_STORAGE_COLLECTIONS) {
		const legacyRows = (await db
			.selectFrom("_plugin_storage")
			.select(["id", "data", "created_at", "updated_at"])
			.where("plugin_id", "=", AWCMS_SIKESRA_LEGACY_PLUGIN_ID)
			.where("collection", "=", from)
			.execute()) as PluginStorageRow[];

		if (legacyRows.length === 0) continue;

		const currentRows =
			to === AWCMS_SIKESRA_AUDIT_TABLE
				? ((await db
						.selectFrom(to)
						.select([
							"id",
							"timestamp",
							"kind",
							"scope",
							"actor_user_id",
							"actor_name",
							"summary",
							"metadata_json",
							"created_at",
						])
						.execute()) as SikesraAuditEventRow[])
				: ((await db
						.selectFrom("_plugin_storage")
						.select(["id", "data", "created_at", "updated_at"])
						.where("plugin_id", "=", AWCMS_SIKESRA_PLUGIN_ID)
						.where("collection", "=", to)
						.execute()) as PluginStorageRow[]);
		const currentById = new Map(currentRows.map((row) => [row.id, row]));

		for (const row of legacyRows) {
			if (!isLegacyRowNewer(row, currentById.get(row.id))) continue;
			if (to === AWCMS_SIKESRA_AUDIT_TABLE) {
				const parsed = JSON.parse(row.data) as Partial<SikesraAuditEventRow>;
				const timestamp = parsed.timestamp ?? row.updated_at ?? row.created_at ?? new Date().toISOString();
				const actorName = parsed.actor_name ?? parsed.actor ?? "system";
				const metadata = redactAuditMetadata(
					parsed.metadata_json ? JSON.parse(parsed.metadata_json) : (parsed as any).metadata ?? {},
				) as Record<string, unknown>;
				await db
					.insertInto(to)
					.values({
						tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
						site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
						id: row.id,
						timestamp,
						kind: parsed.kind ?? "legacy.audit",
						scope: parsed.scope ?? "lifecycle",
						actor_user_id: parsed.actor_user_id ?? null,
						actor_name: actorName,
						summary: parsed.summary ?? "Migrated audit row",
						metadata_json: JSON.stringify(metadata),
						redaction_policy: "sikesra_default_redacted",
						request_id: null,
						ip_hash: null,
						user_agent_hash: null,
						created_at: row.created_at ?? row.updated_at ?? new Date().toISOString(),
					})
					.onConflict((oc: any) =>
						oc.columns(["tenant_id", "site_id", "id"]).doUpdateSet({
							timestamp,
							kind: parsed.kind ?? "legacy.audit",
							scope: parsed.scope ?? "lifecycle",
							actor_user_id: parsed.actor_user_id ?? null,
							actor_name: actorName,
							summary: parsed.summary ?? "Migrated audit row",
							metadata_json: JSON.stringify(metadata),
							redaction_policy: "sikesra_default_redacted",
						}),
					)
					.execute();
			} else {
				await db
					.insertInto("_plugin_storage")
					.values({
						plugin_id: AWCMS_SIKESRA_PLUGIN_ID,
						collection: to,
						id: row.id,
						data: row.data,
						created_at: row.created_at ?? row.updated_at ?? new Date().toISOString(),
						updated_at: row.updated_at ?? row.created_at ?? new Date().toISOString(),
					})
					.onConflict((oc: any) =>
						oc.columns(["plugin_id", "collection", "id"]).doUpdateSet({
							data: row.data,
							updated_at: row.updated_at ?? row.created_at ?? new Date().toISOString(),
						}),
					)
					.execute();
			}
			migratedRows += 1;
		}

		await db
			.deleteFrom("_plugin_storage")
			.where("plugin_id", "=", AWCMS_SIKESRA_PLUGIN_ID)
			.where("collection", "=", from)
			.execute();

		if (to === AWCMS_SIKESRA_AUDIT_TABLE) {
			await db
				.deleteFrom("_plugin_storage")
				.where("plugin_id", "=", AWCMS_SIKESRA_LEGACY_PLUGIN_ID)
				.where("collection", "=", from)
				.execute();
		}
	}

	if (migratedRows > 0) {
		ctx.log.info(`[${AWCMS_SIKESRA_PLUGIN_ID}] migrated legacy storage collections`, {
			migratedRows,
		});
	}
}

export const AWCMS_SIKESRA_MANIFEST: AwcmsModuleManifest = {
	id: "awcms-micro-sikesra",
	name: "AWCMS-Micro SIKESRA Plugin",
	version: "0.1.1",
	description:
		"SIKESRA welfare and social-religious registry plugin for AWCMS-Micro projects.",
	navigation: {
		groups: [
			{
				id: "dashboard-group",
				labelKey: "awcms.nav.group.dashboard",
				fallbackLabel: "Dashboard",
				icon: "chart",
				sortOrder: 10,
				sidebarPlacement: "after-dashboard",
				sidebarPriority: 10,
				items: [
					{
						id: "overview",
						labelKey: "awcms.nav.overview",
						fallbackLabel: "Overview",
						path: "/overview",
						icon: "chart",
						sortOrder: 10,
						permission: "awcms:sikesra:dashboard:read",
					},
				],
			},
			{
				id: "content-group",
				labelKey: "awcms.nav.group.content",
				fallbackLabel: "Content",
				icon: "file",
				sortOrder: 20,
				sidebarPlacement: "before-emdash-default",
				sidebarPriority: 20,
				items: [
					{
						id: "pages",
						labelKey: "awcms.nav.pages",
						fallbackLabel: "Pages",
						path: "/registry",
						icon: "grid",
						sortOrder: 10,
						permission: "awcms:sikesra:dashboard:read",
					},
					{
						id: "documents",
						labelKey: "awcms.nav.documents",
						fallbackLabel: "Documents",
						path: "/documents",
						icon: "file",
						sortOrder: 20,
						permission: "awcms:sikesra:dashboard:read",
					},
					{
						id: "import",
						labelKey: "awcms.nav.import",
						fallbackLabel: "Import Excel",
						path: "/import",
						icon: "arrow-up-from-bracket",
						sortOrder: 30,
						permission: "awcms:sikesra:dashboard:read",
					},
				],
			},
			{
				id: "governance-group",
				labelKey: "awcms.nav.group.governance",
				fallbackLabel: "Governance",
				icon: "shield",
				sortOrder: 30,
				sidebarPlacement: "before-emdash-default",
				sidebarPriority: 30,
				items: [
					{
						id: "verification",
						labelKey: "awcms.nav.verification",
						fallbackLabel: "Verification",
						path: "/verification",
						icon: "check",
						sortOrder: 10,
						permission: "awcms:sikesra:audit:read",
					},
					{
						id: "audit-log",
						labelKey: "awcms.nav.audit",
						fallbackLabel: "Audit Log",
						path: "/audit",
						icon: "list",
						sortOrder: 20,
						permission: "awcms:sikesra:audit:read",
					},
					{
						id: "reports",
						labelKey: "awcms.nav.reports",
						fallbackLabel: "Reports",
						path: "/reports",
						icon: "chart",
						sortOrder: 30,
						permission: "awcms:sikesra:audit:read",
					},
				],
			},
			{
				id: "settings-group",
				labelKey: "awcms.nav.group.settings",
				fallbackLabel: "Settings",
				icon: "gear",
				sortOrder: 40,
				sidebarPlacement: "before-emdash-default",
				sidebarPriority: 40,
				items: [
					{
						id: "access-control",
						labelKey: "awcms.nav.access",
						fallbackLabel: "Access Control",
						path: "/access/permissions",
						icon: "lock",
						sortOrder: 10,
						permission: "awcms:sikesra:settings:read",
						children: [
							{
								id: "permissions",
								labelKey: "awcms.nav.permissions",
								fallbackLabel: "Permissions",
								path: "/access/permissions",
								sortOrder: 10,
								permission: "awcms:sikesra:permissions:read",
							},
							{
								id: "roles",
								labelKey: "awcms.nav.roles",
								fallbackLabel: "Roles",
								path: "/access/roles",
								sortOrder: 20,
								permission: "awcms:sikesra:roles:read",
							},
							{
								id: "matrix",
								labelKey: "awcms.nav.matrix",
								fallbackLabel: "Role Matrix",
								path: "/access/matrix",
								sortOrder: 30,
								permission: "awcms:sikesra:permissions:read",
							},
							{
								id: "access-preview",
								labelKey: "awcms.nav.accessPreview",
								fallbackLabel: "Access Preview",
								path: "/access/preview",
								sortOrder: 40,
								permission: "awcms:sikesra:preview:read",
							},
						],
					},
					{
						id: "abac",
						labelKey: "awcms.nav.abac",
						fallbackLabel: "ABAC",
						path: "/abac/attributes",
						icon: "sliders",
						sortOrder: 20,
						permission: "awcms:sikesra:settings:read",
						children: [
							{
								id: "abac-attributes",
								labelKey: "awcms.nav.abacAttributes",
								fallbackLabel: "Attributes",
								path: "/abac/attributes",
								sortOrder: 10,
								permission: "awcms:sikesra:abac:read",
							},
							{
								id: "abac-policies",
								labelKey: "awcms.nav.abacPolicies",
								fallbackLabel: "Policies",
								path: "/abac/policies",
								sortOrder: 20,
								permission: "awcms:sikesra:abac:read",
							},
							{
								id: "abac-preview",
								labelKey: "awcms.nav.abacPreview",
								fallbackLabel: "ABAC Preview",
								path: "/abac/preview",
								sortOrder: 30,
								permission: "awcms:sikesra:abac:read",
							},
						],
					},
					{
						id: "regions",
						labelKey: "awcms.nav.regions",
						fallbackLabel: "Official Regions",
						path: "/regions",
						icon: "globe",
						sortOrder: 30,
						permission: "awcms:sikesra:settings:read",
					},
					{
						id: "data-types",
						labelKey: "awcms.nav.dataTypes",
						fallbackLabel: "Sikesra Data Types",
						path: "/data-types",
						icon: "list",
						sortOrder: 40,
						permission: "awcms:sikesra:settings:read",
					},
				],
			},
		],
	},
	i18n: {
		defaultLocale: "en",
		supportedLocales: ["en", "id"],
		messages: {
			en: {
				"awcms.nav.group.dashboard": "Dashboard",
				"awcms.nav.group.content": "Content",
				"awcms.nav.group.governance": "Governance",
				"awcms.nav.group.settings": "Settings",
				"awcms.nav.overview": "Overview",
				"awcms.nav.pages": "Pages",
				"awcms.nav.documents": "Documents",
				"awcms.nav.import": "Import Excel",
				"awcms.nav.verification": "Verification",
				"awcms.nav.audit": "Audit Log",
				"awcms.nav.reports": "Reports",
				"awcms.nav.access": "Access Control",
				"awcms.nav.regions": "Official Regions",
				"awcms.nav.dataTypes": "Sikesra Data Types",
				"awcms.nav.permissions": "Permissions",
				"awcms.nav.roles": "Roles",
				"awcms.nav.matrix": "Role Matrix",
				"awcms.nav.accessPreview": "Access Preview",
				"awcms.nav.abac": "ABAC",
				"awcms.nav.abacAttributes": "Attributes",
				"awcms.nav.abacPolicies": "Policies",
				"awcms.nav.abacPreview": "ABAC Preview",
				"awcms.meta.widget.governanceStatus": "Governance Status",
				"awcms.meta.widget.accessRightsHealth": "Access Rights Health",
				"awcms.meta.widget.abacPolicyStatus": "ABAC Policy Status",
				"awcms.meta.settings.publicStatusLabel": "Public Status Label",
				"awcms.meta.settings.publicStatusLabelDesc":
					"Shown by the plugin's public-safe status route.",
				"awcms.meta.settings.auditRetentionDays": "Audit Retention Days",
				"awcms.meta.settings.auditRetentionDaysDesc": "Used by the demo cron cleanup summary.",
				"awcms.meta.settings.governanceMode": "Governance Mode",
				"awcms.meta.settings.observe": "Observe",
				"awcms.meta.settings.review": "Review",
				"awcms.meta.settings.enforceDemo": "Enforce Demo",
				"awcms.meta.settings.metadataCanonicalBase": "Metadata Canonical Base",
				"awcms.meta.settings.metadataCanonicalBaseDesc":
					"Optional override for page metadata contributions.",
				"awcms.meta.settings.smallCellThreshold": "Small Cell Suppression Threshold",
				"awcms.meta.settings.smallCellThresholdDesc":
					"Safety threshold below which counts are suppressed to protect privacy.",
				"awcms.meta.settings.sikesraPublicEnabled": "SIKESRA Public API Enabled",
				"awcms.meta.settings.sikesraPublicEnabledDesc":
					"Enable or disable public aggregate access to SIKESRA stats.",
				"awcms.meta.block.accessNote": "AWCMS Access Note",
				"awcms.meta.block.accessNoteDesc":
					"Portable Text note block for access and governance guidance.",
				"awcms.meta.block.category": "AWCMS Micro",
				"awcms.meta.field.statusBadge": "Status badge",
				"awcms.meta.permission.readPublicContent": "Read Public Content",
				"awcms.meta.permission.readPublicContentDesc":
					"Allows reading public-facing content surfaces.",
				"awcms.meta.permission.reviewAndPublish": "Review And Publish",
				"awcms.meta.permission.reviewAndPublishDesc":
					"Allows review workflows to approve and publish content.",
				"awcms.meta.permission.readAuditEvents": "Read Audit Events",
				"awcms.meta.permission.readAuditEventsDesc":
					"Allows operators to inspect governance and access audit events.",
				"awcms.meta.role.siteEditor": "Site Editor",
				"awcms.meta.role.siteEditorDesc": "Editor role for content operations.",
				"awcms.meta.role.governanceReviewer": "Governance Reviewer",
				"awcms.meta.role.governanceReviewerDesc":
					"Reviewer role for governance and publishing approval.",
				"awcms.meta.abac.tenantId": "Tenant ID",
				"awcms.meta.abac.tenantIdDesc": "Tenant identifier for the acting subject.",
				"awcms.meta.abac.siteId": "Site ID",
				"awcms.meta.abac.siteIdDesc": "Site identifier for the acting subject.",
				"awcms.meta.abac.moduleId": "Module ID",
				"awcms.meta.abac.moduleIdDesc": "Module identifier for the resource.",
				"awcms.meta.abac.resourceType": "Resource Type",
				"awcms.meta.abac.resourceTypeDesc": "Resource type used in ABAC evaluation.",
				"awcms.meta.abac.resourceStatus": "Resource Status",
				"awcms.meta.abac.resourceStatusDesc": "Workflow status of the resource.",
				"awcms.meta.abac.resourceSensitivity": "Resource Sensitivity",
				"awcms.meta.abac.resourceSensitivityDesc": "Sensitivity classification for the resource.",
				"awcms.meta.abac.ownerUserId": "Owner User ID",
				"awcms.meta.abac.ownerUserIdDesc": "Owning user of the resource.",
				"awcms.meta.abac.regionScope": "Region Scope",
				"awcms.meta.abac.regionScopeDesc": "Region scope for the decision context.",
				"awcms.meta.abac.action": "Action",
				"awcms.meta.abac.actionDesc": "Action under evaluation.",
				"awcms.meta.abac.policy.allowPublishedReads":
					"Allow published content reads for the same tenant",
				"awcms.meta.abac.policy.denyRestrictedGovernance":
					"Explicitly deny publishing restricted governance resources",
			},
			id: {
				"awcms.nav.group.dashboard": "Dasbor",
				"awcms.nav.group.content": "Konten",
				"awcms.nav.group.governance": "Tata Kelola",
				"awcms.nav.group.settings": "Pengaturan",
				"awcms.nav.overview": "Ikhtisar",
				"awcms.nav.pages": "Halaman",
				"awcms.nav.documents": "Dokumen",
				"awcms.nav.import": "Impor Excel",
				"awcms.nav.verification": "Verifikasi",
				"awcms.nav.audit": "Log Audit",
				"awcms.nav.reports": "Laporan",
				"awcms.nav.access": "Kontrol Akses",
				"awcms.nav.regions": "Wilayah Resmi",
				"awcms.nav.dataTypes": "Jenis Data Sikesra",
				"awcms.nav.permissions": "Izin",
				"awcms.nav.roles": "Peran",
				"awcms.nav.matrix": "Matriks Peran",
				"awcms.nav.accessPreview": "Pratinjau Akses",
				"awcms.nav.abac": "ABAC",
				"awcms.nav.abacAttributes": "Atribut",
				"awcms.nav.abacPolicies": "Kebijakan",
				"awcms.nav.abacPreview": "Pratinjau ABAC",
				"awcms.meta.widget.governanceStatus": "Status Tata Kelola",
				"awcms.meta.widget.accessRightsHealth": "Kesehatan Hak Akses",
				"awcms.meta.widget.abacPolicyStatus": "Status Kebijakan ABAC",
				"awcms.meta.settings.publicStatusLabel": "Label Status Publik",
				"awcms.meta.settings.publicStatusLabelDesc":
					"Ditampilkan oleh route status aman-publik plugin.",
				"awcms.meta.settings.auditRetentionDays": "Hari Retensi Audit",
				"awcms.meta.settings.auditRetentionDaysDesc":
					"Digunakan oleh ringkasan pembersihan cron demo.",
				"awcms.meta.settings.governanceMode": "Mode Tata Kelola",
				"awcms.meta.settings.observe": "Observasi",
				"awcms.meta.settings.review": "Tinjau",
				"awcms.meta.settings.enforceDemo": "Terapkan Demo",
				"awcms.meta.settings.metadataCanonicalBase": "Basis Canonical Metadata",
				"awcms.meta.settings.metadataCanonicalBaseDesc":
					"Override opsional untuk kontribusi metadata halaman.",
				"awcms.meta.settings.smallCellThreshold": "Batas Supresi Sel Kecil",
				"awcms.meta.settings.smallCellThresholdDesc":
					"Batas keamanan minimum agar jumlah tidak disembunyikan untuk melindungi privasi.",
				"awcms.meta.settings.sikesraPublicEnabled": "API Publik SIKESRA Aktif",
				"awcms.meta.settings.sikesraPublicEnabledDesc":
					"Aktifkan atau nonaktifkan akses agregat publik ke statistik SIKESRA.",
				"awcms.meta.block.accessNote": "Catatan Akses AWCMS",
				"awcms.meta.block.accessNoteDesc":
					"Blok catatan Portable Text untuk panduan akses dan tata kelola.",
				"awcms.meta.block.category": "AWCMS Micro",
				"awcms.meta.field.statusBadge": "Lencana status",
				"awcms.meta.permission.readPublicContent": "Baca Konten Publik",
				"awcms.meta.permission.readPublicContentDesc":
					"Memungkinkan membaca surface konten publik.",
				"awcms.meta.permission.reviewAndPublish": "Tinjau dan Publikasikan",
				"awcms.meta.permission.reviewAndPublishDesc":
					"Memungkinkan alur kerja review untuk menyetujui dan mempublikasikan konten.",
				"awcms.meta.permission.readAuditEvents": "Baca Event Audit",
				"awcms.meta.permission.readAuditEventsDesc":
					"Memungkinkan operator memeriksa event audit tata kelola dan akses.",
				"awcms.meta.role.siteEditor": "Editor Situs",
				"awcms.meta.role.siteEditorDesc": "Peran editor untuk operasi konten.",
				"awcms.meta.role.governanceReviewer": "Reviewer Tata Kelola",
				"awcms.meta.role.governanceReviewerDesc":
					"Peran reviewer untuk tata kelola dan persetujuan publikasi.",
				"awcms.meta.abac.tenantId": "ID Tenant",
				"awcms.meta.abac.tenantIdDesc": "Pengenal tenant untuk subjek yang bertindak.",
				"awcms.meta.abac.siteId": "ID Situs",
				"awcms.meta.abac.siteIdDesc": "Pengenal situs untuk subjek yang bertindak.",
				"awcms.meta.abac.moduleId": "ID Modul",
				"awcms.meta.abac.moduleIdDesc": "Pengenal modul untuk sumber daya.",
				"awcms.meta.abac.resourceType": "Tipe Sumber Daya",
				"awcms.meta.abac.resourceTypeDesc": "Tipe sumber daya yang digunakan dalam evaluasi ABAC.",
				"awcms.meta.abac.resourceStatus": "Status Sumber Daya",
				"awcms.meta.abac.resourceStatusDesc": "Status alur kerja dari sumber daya.",
				"awcms.meta.abac.resourceSensitivity": "Sensitivitas Sumber Daya",
				"awcms.meta.abac.resourceSensitivityDesc": "Klasifikasi sensitivitas untuk sumber daya.",
				"awcms.meta.abac.ownerUserId": "ID Pengguna Pemilik",
				"awcms.meta.abac.ownerUserIdDesc": "Pengguna pemilik dari sumber daya.",
				"awcms.meta.abac.regionScope": "Cakupan Wilayah",
				"awcms.meta.abac.regionScopeDesc": "Cakupan wilayah untuk konteks keputusan.",
				"awcms.meta.abac.action": "Aksi",
				"awcms.meta.abac.actionDesc": "Aksi yang sedang dievaluasi.",
				"awcms.meta.abac.policy.allowPublishedReads":
					"Izinkan pembacaan konten terpublikasi untuk tenant yang sama",
				"awcms.meta.abac.policy.denyRestrictedGovernance":
					"Tolak secara eksplisit publikasi sumber daya tata kelola yang dibatasi",
			},
		},
	},
};

export const AWCMS_SIKESRA_ADMIN_PAGES = adaptToEmdashPages(AWCMS_SIKESRA_MANIFEST);

export const AWCMS_SIKESRA_ADMIN_WIDGETS = [
	{
		id: "governance-status",
		title: "Governance Status",
		titleKey: "awcms.meta.widget.governanceStatus",
		size: "half" as const,
	},
	{
		id: "access-rights-health",
		title: "Access Rights Health",
		titleKey: "awcms.meta.widget.accessRightsHealth",
		size: "half" as const,
	},
	{
		id: "abac-policy-status",
		title: "ABAC Policy Status",
		titleKey: "awcms.meta.widget.abacPolicyStatus",
		size: "half" as const,
	},
];

export const AWCMS_SIKESRA_SETTINGS_SCHEMA = {
	publicStatusLabel: {
		type: "string" as const,
		label: "Public Status Label",
		labelKey: "awcms.meta.settings.publicStatusLabel",
		description: "Shown by the plugin's public-safe status route.",
		descriptionKey: "awcms.meta.settings.publicStatusLabelDesc",
		default: "healthy",
	},
	auditRetentionDays: {
		type: "number" as const,
		label: "Audit Retention Days",
		labelKey: "awcms.meta.settings.auditRetentionDays",
		description: "Used by the demo cron cleanup summary.",
		descriptionKey: "awcms.meta.settings.auditRetentionDaysDesc",
		default: 30,
		min: 1,
	},
	governanceMode: {
		type: "select" as const,
		label: "Governance Mode",
		labelKey: "awcms.meta.settings.governanceMode",
		options: [
			{ value: "observe", label: "Observe", labelKey: "awcms.meta.settings.observe" },
			{ value: "review", label: "Review", labelKey: "awcms.meta.settings.review" },
			{ value: "enforce-demo", label: "Enforce Demo", labelKey: "awcms.meta.settings.enforceDemo" },
		],
		default: "review",
	},
	metadataCanonicalBase: {
		type: "url" as const,
		label: "Metadata Canonical Base",
		labelKey: "awcms.meta.settings.metadataCanonicalBase",
		description: "Optional override for page metadata contributions.",
		descriptionKey: "awcms.meta.settings.metadataCanonicalBaseDesc",
		placeholder: "https://example.awcms-micro.local",
	},
	smallCellThreshold: {
		type: "number" as const,
		label: "Small Cell Suppression Threshold",
		labelKey: "awcms.meta.settings.smallCellThreshold",
		description: "Safety threshold below which counts are suppressed to protect privacy.",
		descriptionKey: "awcms.meta.settings.smallCellThresholdDesc",
		default: 3,
		min: 1,
	},
	sikesraPublicEnabled: {
		type: "boolean" as const,
		label: "SIKESRA Public API Enabled",
		labelKey: "awcms.meta.settings.sikesraPublicEnabled",
		description: "Enable or disable public aggregate access to SIKESRA stats.",
		descriptionKey: "awcms.meta.settings.sikesraPublicEnabledDesc",
		default: true,
	},
};

export const AWCMS_SIKESRA_PORTABLE_TEXT_BLOCKS: PortableTextBlockConfig[] = [
	{
		type: "awcms-access-note",
		label: "AWCMS Access Note",
		icon: "info",
		description: "Portable Text note block for access and governance guidance.",
		category: "AWCMS Micro",
	},
];

export const AWCMS_SIKESRA_FIELD_WIDGETS: FieldWidgetConfig[] = [
	{
		name: "status-badge",
		label: "Status badge",
		fieldTypes: ["string"],
	},
];

export interface ExampleAuditEvent {
	id: string;
	timestamp: string;
	kind: string;
	scope: string;
	actor: string;
	summary: string;
	metadata: Record<string, unknown>;
	userId?: string;
	userName?: string;
}

export interface ExampleSettings {
	publicStatusLabel: string;
	auditRetentionDays: number;
	governanceMode: string;
	metadataCanonicalBase: string;
	smallCellThreshold: number;
	sikesraPublicEnabled: boolean;
}

interface StoredSettingRecord {
	key: string;
	value: string | number | boolean;
	updatedAt: string;
}

interface StoredStateRecord {
	key: string;
	value: string | number | boolean | null;
	updatedAt: string;
}

interface StoredVerificationStageRecord {
	registryEntityId: string;
	stage: VerificationStage;
	updatedAt: string;
}

export interface AccessPermission {
	slug: string;
	label: string;
	labelKey?: string;
	description: string;
	descriptionKey?: string;
	scope: string;
	updatedAt: string;
}

export interface AccessRole {
	slug: string;
	label: string;
	labelKey?: string;
	description: string;
	descriptionKey?: string;
	updatedAt: string;
}

export interface RolePermissionAssignment {
	roleSlug: string;
	permissions: string[];
	updatedAt: string;
}

export interface UserRoleAssignment {
	userId: string;
	roles: string[];
	updatedAt: string;
}

export interface AbacAttributeDefinition {
	key: string;
	label: string;
	labelKey?: string;
	targetType: "subject" | "resource" | "context";
	description: string;
	descriptionKey?: string;
	updatedAt: string;
}

export interface AbacSubjectAssignment {
	subjectId: string;
	attributes: Record<string, string>;
	updatedAt: string;
}

export interface AbacResourceAssignment {
	resourceId: string;
	attributes: Record<string, string>;
	updatedAt: string;
}

export interface AbacPolicyRule {
	id: string;
	label: string;
	labelKey?: string;
	effect: "allow" | "deny";
	actions: string[];
	requiredSubject: Record<string, string>;
	requiredResource: Record<string, string>;
	requiredContext: Record<string, string>;
	updatedAt: string;
}

const DEFAULT_SIKESRA_CRUD_PERMISSION_SLUGS = [
	"sikesra.registry.soft_delete",
	"sikesra.registry.restore",
	"sikesra.registry.permanent_delete",
	"sikesra.person.create",
	"sikesra.person.read",
	"sikesra.person.read_sensitive",
	"sikesra.person.update",
	"sikesra.person.soft_delete",
	"sikesra.person.restore",
	"sikesra.person.permanent_delete",
	"sikesra.module_detail.create",
	"sikesra.module_detail.read",
	"sikesra.module_detail.update",
	"sikesra.module_detail.soft_delete",
	"sikesra.module_detail.restore",
	"sikesra.module_detail.permanent_delete",
	"sikesra.document.create",
	"sikesra.document.update",
	"sikesra.document.soft_delete",
	"sikesra.document.restore",
	"sikesra.document.permanent_delete",
	"sikesra.file_metadata.read",
	"sikesra.file_metadata.create",
	"sikesra.file_metadata.update",
	"sikesra.file_metadata.soft_delete",
	"sikesra.file_metadata.restore",
	"sikesra.file_metadata.permanent_delete",
	"sikesra.import.read",
	"sikesra.import.update",
	"sikesra.import.soft_delete",
	"sikesra.import.restore",
	"sikesra.import.permanent_delete",
	"sikesra.export.read",
	"sikesra.export.update",
	"sikesra.export.cancel",
	"sikesra.export.soft_delete",
	"sikesra.export.restore",
	"sikesra.export.permanent_delete",
	"sikesra.report.configure",
	"sikesra.verification.create",
	"sikesra.verification.update",
	"sikesra.verification.soft_delete",
	"sikesra.verification.restore",
	"sikesra.verification.permanent_delete",
	"sikesra.settings.create",
	"sikesra.settings.soft_delete",
	"sikesra.settings.restore",
	"sikesra.settings.permanent_delete",
	"sikesra.region.create",
	"sikesra.region.read",
	"sikesra.region.update",
	"sikesra.region.soft_delete",
	"sikesra.region.restore",
	"sikesra.region.permanent_delete",
	"sikesra.data_type.create",
	"sikesra.data_type.read",
	"sikesra.data_type.update",
	"sikesra.data_type.soft_delete",
	"sikesra.data_type.restore",
	"sikesra.data_type.permanent_delete",
	"sikesra.field_standard.create",
	"sikesra.field_standard.read",
	"sikesra.field_standard.update",
	"sikesra.field_standard.soft_delete",
	"sikesra.field_standard.restore",
	"sikesra.field_standard.permanent_delete",
	"sikesra.custom_attribute.soft_delete",
	"sikesra.custom_attribute.restore",
	"sikesra.custom_attribute.permanent_delete",
	"sikesra.custom_attribute_value.create",
	"sikesra.custom_attribute_value.read",
	"sikesra.custom_attribute_value.update",
	"sikesra.custom_attribute_value.soft_delete",
	"sikesra.custom_attribute_value.restore",
	"sikesra.custom_attribute_value.permanent_delete",
	"sikesra.rbac.create",
	"sikesra.rbac.read",
	"sikesra.rbac.update",
	"sikesra.rbac.soft_delete",
	"sikesra.rbac.restore",
	"sikesra.rbac.permanent_delete",
	"sikesra.abac.create",
	"sikesra.abac.read",
	"sikesra.abac.update",
	"sikesra.abac.soft_delete",
	"sikesra.abac.restore",
	"sikesra.abac.permanent_delete",
	"sikesra.user_assignment.create",
	"sikesra.user_assignment.read",
	"sikesra.user_assignment.update",
	"sikesra.user_assignment.soft_delete",
	"sikesra.user_assignment.restore",
	"sikesra.user_assignment.permanent_delete",
	"sikesra.audit.export",
	"sikesra.audit.retention_purge_request",
	"sikesra.audit.retention_purge_approve",
	"sikesra.audit.retention_purge_execute",
] as const;

const DEFAULT_ACCESS_PERMISSIONS: AccessPermission[] = [
	{
		slug: "content.read.public",
		label: "Read Public Content",
		labelKey: "awcms.meta.permission.readPublicContent",
		description: "Allows reading public-facing content surfaces.",
		descriptionKey: "awcms.meta.permission.readPublicContentDesc",
		scope: "content",
		updatedAt: "",
	},
	{
		slug: "content.review.publish",
		label: "Review And Publish",
		labelKey: "awcms.meta.permission.reviewAndPublish",
		description: "Allows review workflows to approve and publish content.",
		descriptionKey: "awcms.meta.permission.reviewAndPublishDesc",
		scope: "workflow",
		updatedAt: "",
	},
	{
		slug: "audit.read.events",
		label: "Read Audit Events",
		labelKey: "awcms.meta.permission.readAuditEvents",
		description: "Allows operators to inspect governance and access audit events.",
		descriptionKey: "awcms.meta.permission.readAuditEventsDesc",
		scope: "audit",
		updatedAt: "",
	},
	...[
		"sikesra.dashboard.read",
		"sikesra.registry.read",
		"sikesra.registry.create",
		"sikesra.registry.update",
		"sikesra.registry.delete_soft",
		"sikesra.registry.read_sensitive",
		"sikesra.document.read",
		"sikesra.document.upload",
		"sikesra.document.read_restricted",
		"sikesra.import.create",
		"sikesra.import.validate",
		"sikesra.import.promote",
		"sikesra.verification.read",
		"sikesra.verification.approve",
		"sikesra.verification.reject",
		"sikesra.report.read",
		"sikesra.export.create",
		"sikesra.export.restricted",
		"sikesra.audit.read",
		"sikesra.settings.read",
		"sikesra.settings.update",
		"sikesra.rbac.manage",
		"sikesra.abac.manage",
		"sikesra.lifecycle.create",
		"sikesra.lifecycle.read_list",
		"sikesra.lifecycle.read_detail",
		"sikesra.lifecycle.update",
		"sikesra.lifecycle.soft_delete",
		"sikesra.lifecycle.restore",
		"sikesra.lifecycle.archive",
		"sikesra.lifecycle.permanent_delete",
		"sikesra.custom_attribute.read",
		"sikesra.custom_attribute.create",
		"sikesra.custom_attribute.update",
		"sikesra.custom_attribute.delete_soft",
		"sikesra.custom_attribute.manage_system",
		"sikesra.custom_attribute.read_sensitive",
		"sikesra.custom_attribute.export",
		"sikesra.custom_attribute.import",
		"sikesra.permanent_delete.request",
		"sikesra.permanent_delete.approve",
		"sikesra.permanent_delete.review",
		"sikesra.permanent_delete.cancel",
		"sikesra.permanent_delete.execute",
		...DEFAULT_SIKESRA_CRUD_PERMISSION_SLUGS,
	].map((slug) => ({
		slug,
		label: slug,
		description: `Allows ${slug}.`,
		scope: slug.split(".")[1] ?? "sikesra",
		updatedAt: "",
	})),
];

const DEFAULT_ACCESS_ROLES: AccessRole[] = [
	{
		slug: "site-editor",
		label: "Site Editor",
		labelKey: "awcms.meta.role.siteEditor",
		description: "Editor role for content operations.",
		descriptionKey: "awcms.meta.role.siteEditorDesc",
		updatedAt: "",
	},
	{
		slug: "governance-reviewer",
		label: "Governance Reviewer",
		labelKey: "awcms.meta.role.governanceReviewer",
		description: "Reviewer role for governance and publishing approval.",
		descriptionKey: "awcms.meta.role.governanceReviewerDesc",
		updatedAt: "",
	},
	{
		slug: "verifier-desa-kelurahan",
		label: "Verifier Desa/Kelurahan",
		description: "Initial verifier role for village and subdistrict submissions.",
		updatedAt: "",
	},
	{
		slug: "verifier-kecamatan",
		label: "Verifier Kecamatan",
		description: "District-level verifier role for SIKESRA escalation.",
		updatedAt: "",
	},
	{
		slug: "verifier-sopd",
		label: "Verifier SOPD",
		description: "Related SOPD verifier role for SIKESRA review.",
		updatedAt: "",
	},
	{
		slug: "verifier-kabupaten",
		label: "Verifier Kabupaten",
		description: "Regency-level verifier role for final regional approval.",
		updatedAt: "",
	},
	{
		slug: "admin-sikesra",
		label: "Admin SIKESRA",
		description: "Administrative override role for SIKESRA verification and publication.",
		updatedAt: "",
	},
	...[
		"sikesra_admin",
		"sikesra_operator_kabupaten",
		"sikesra_verifikator_kabupaten",
		"sikesra_verifikator_sopd",
		"sikesra_verifikator_kecamatan",
		"sikesra_verifikator_desa_kelurahan",
		"sikesra_operator_desa_kelurahan",
		"sikesra_viewer_laporan",
		"sikesra_viewer_publikasi",
		"sikesra_auditor",
		"sikesra_super_admin",
	].map((slug) => ({
		slug,
		label: slug
			.split("_")
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join(" "),
		description: `SIKESRA operational role: ${slug}.`,
		updatedAt: "",
	})),
];

const SIKESRA_VERIFICATION_ROUTE_PERMISSIONS = [
	"sikesra.verification.read",
	"sikesra.verification.approve",
	"sikesra.verification.reject",
] as const;

const DEFAULT_ROLE_ASSIGNMENTS: RolePermissionAssignment[] = [
	{
		roleSlug: "site-editor",
		permissions: ["content.read.public", "audit.read.events"],
		updatedAt: "",
	},
	{
		roleSlug: "governance-reviewer",
		permissions: ["content.read.public", "content.review.publish", "audit.read.events"],
		updatedAt: "",
	},
	{
		roleSlug: "verifier-desa-kelurahan",
		permissions: ["content.read.public", "content.review.publish", "audit.read.events", ...SIKESRA_VERIFICATION_ROUTE_PERMISSIONS],
		updatedAt: "",
	},
	{
		roleSlug: "verifier-kecamatan",
		permissions: ["content.read.public", "content.review.publish", "audit.read.events", ...SIKESRA_VERIFICATION_ROUTE_PERMISSIONS],
		updatedAt: "",
	},
	{
		roleSlug: "verifier-sopd",
		permissions: ["content.read.public", "content.review.publish", "audit.read.events", ...SIKESRA_VERIFICATION_ROUTE_PERMISSIONS],
		updatedAt: "",
	},
	{
		roleSlug: "verifier-kabupaten",
		permissions: ["content.read.public", "content.review.publish", "audit.read.events", ...SIKESRA_VERIFICATION_ROUTE_PERMISSIONS],
		updatedAt: "",
	},
	{
		roleSlug: "admin-sikesra",
		permissions: ["content.read.public", "content.review.publish", "audit.read.events", ...SIKESRA_VERIFICATION_ROUTE_PERMISSIONS],
		updatedAt: "",
	},
	{
		roleSlug: "sikesra_admin",
		permissions: DEFAULT_ACCESS_PERMISSIONS.filter(
			(permission) =>
				permission.slug.startsWith("sikesra.") &&
				!permission.slug.startsWith("sikesra.permanent_delete.") &&
				!permission.slug.endsWith(".permanent_delete") &&
				!permission.slug.startsWith("sikesra.audit.retention_purge_"),
		).map((permission) => permission.slug),
		updatedAt: "",
	},
	{
		roleSlug: "sikesra_auditor",
		permissions: ["sikesra.audit.read", "sikesra.report.read"],
		updatedAt: "",
	},
	{
		roleSlug: "sikesra_super_admin",
		permissions: [
			"sikesra.lifecycle.permanent_delete",
			"sikesra.permanent_delete.request",
			"sikesra.permanent_delete.approve",
			"sikesra.permanent_delete.review",
			"sikesra.permanent_delete.cancel",
			"sikesra.permanent_delete.execute",
			"sikesra.audit.retention_purge_request",
			"sikesra.audit.retention_purge_approve",
			"sikesra.audit.retention_purge_execute",
		],
		updatedAt: "",
	},
];

const DEFAULT_USER_ROLE_ASSIGNMENTS: UserRoleAssignment[] = [
	{
		userId: "user-demo-editor",
		roles: ["site-editor"],
		updatedAt: "",
	},
	{
		userId: "user-demo-reviewer",
		roles: ["governance-reviewer"],
		updatedAt: "",
	},
	{
		userId: "user-demo-village",
		roles: ["verifier-desa-kelurahan"],
		updatedAt: "",
	},
	{
		userId: "user-demo-district",
		roles: ["verifier-kecamatan"],
		updatedAt: "",
	},
	{
		userId: "user-demo-sopd",
		roles: ["verifier-sopd"],
		updatedAt: "",
	},
	{
		userId: "user-demo-regency",
		roles: ["verifier-kabupaten"],
		updatedAt: "",
	},
	{
		userId: "user-demo-sikesra-admin",
		roles: ["admin-sikesra", "sikesra_admin"],
		updatedAt: "",
	},
];

const DEFAULT_ABAC_ATTRIBUTES: AbacAttributeDefinition[] = [
	{
		key: "tenant_id",
		label: "Tenant ID",
		labelKey: "awcms.meta.abac.tenantId",
		targetType: "subject",
		description: "Tenant identifier for the acting subject.",
		descriptionKey: "awcms.meta.abac.tenantIdDesc",
		updatedAt: "",
	},
	{
		key: "site_id",
		label: "Site ID",
		labelKey: "awcms.meta.abac.siteId",
		targetType: "subject",
		description: "Site identifier for the acting subject.",
		descriptionKey: "awcms.meta.abac.siteIdDesc",
		updatedAt: "",
	},
	{
		key: "module_id",
		label: "Module ID",
		labelKey: "awcms.meta.abac.moduleId",
		targetType: "resource",
		description: "Module identifier for the resource.",
		descriptionKey: "awcms.meta.abac.moduleIdDesc",
		updatedAt: "",
	},
	{
		key: "resource_type",
		label: "Resource Type",
		labelKey: "awcms.meta.abac.resourceType",
		targetType: "resource",
		description: "Resource type used in ABAC evaluation.",
		descriptionKey: "awcms.meta.abac.resourceTypeDesc",
		updatedAt: "",
	},
	{
		key: "resource_status",
		label: "Resource Status",
		labelKey: "awcms.meta.abac.resourceStatus",
		targetType: "resource",
		description: "Workflow status of the resource.",
		descriptionKey: "awcms.meta.abac.resourceStatusDesc",
		updatedAt: "",
	},
	{
		key: "resource_sensitivity",
		label: "Resource Sensitivity",
		labelKey: "awcms.meta.abac.resourceSensitivity",
		targetType: "resource",
		description: "Sensitivity classification for the resource.",
		descriptionKey: "awcms.meta.abac.resourceSensitivityDesc",
		updatedAt: "",
	},
	{
		key: "owner_user_id",
		label: "Owner User ID",
		labelKey: "awcms.meta.abac.ownerUserId",
		targetType: "resource",
		description: "Owning user of the resource.",
		descriptionKey: "awcms.meta.abac.ownerUserIdDesc",
		updatedAt: "",
	},
	{
		key: "region_scope",
		label: "Region Scope",
		labelKey: "awcms.meta.abac.regionScope",
		targetType: "context",
		description: "Region scope for the decision context.",
		descriptionKey: "awcms.meta.abac.regionScopeDesc",
		updatedAt: "",
	},
	{
		key: "action",
		label: "Action",
		labelKey: "awcms.meta.abac.action",
		targetType: "context",
		description: "Action under evaluation.",
		descriptionKey: "awcms.meta.abac.actionDesc",
		updatedAt: "",
	},
];

const DEFAULT_ABAC_SUBJECTS: AbacSubjectAssignment[] = [
	{
		subjectId: "user-demo-editor",
		attributes: { tenant_id: "tenant-a", site_id: "site-main", region_scope: "id-jakarta" },
		updatedAt: "",
	},
	{
		subjectId: "user-demo-reviewer",
		attributes: { tenant_id: "tenant-a", site_id: "site-main", region_scope: "id-jakarta" },
		updatedAt: "",
	},
	{
		subjectId: "user-demo-village",
		attributes: { tenant_id: "tenant-a", site_id: "site-main", region_scope: "3171010002" },
		updatedAt: "",
	},
	{
		subjectId: "user-demo-district",
		attributes: { tenant_id: "tenant-a", site_id: "site-main", region_scope: "3171010" },
		updatedAt: "",
	},
	{
		subjectId: "user-demo-sopd",
		attributes: { tenant_id: "tenant-a", site_id: "site-main", region_scope: "3171" },
		updatedAt: "",
	},
	{
		subjectId: "user-demo-regency",
		attributes: { tenant_id: "tenant-a", site_id: "site-main", region_scope: "3171" },
		updatedAt: "",
	},
	{
		subjectId: "user-demo-sikesra-admin",
		attributes: { tenant_id: "tenant-a", site_id: "site-main", region_scope: "all" },
		updatedAt: "",
	},
];

const DEFAULT_ABAC_RESOURCES: AbacResourceAssignment[] = [
	{
		resourceId: "resource-public-post",
		attributes: {
			module_id: "content",
			resource_type: "post",
			resource_status: "published",
			resource_sensitivity: "public",
			owner_user_id: "user-demo-editor",
		},
		updatedAt: "",
	},
	{
		resourceId: "resource-sensitive-policy",
		attributes: {
			module_id: "governance",
			resource_type: "policy",
			resource_status: "review",
			resource_sensitivity: "restricted",
			owner_user_id: "user-demo-reviewer",
		},
		updatedAt: "",
	},
];

const DEFAULT_ABAC_POLICIES: AbacPolicyRule[] = [
	{
		id: "allow-published-content-read",
		label: "Allow published content reads for the same tenant",
		labelKey: "awcms.meta.abac.policy.allowPublishedReads",
		effect: "allow",
		actions: ["content.read"],
		requiredSubject: { tenant_id: "tenant-a" },
		requiredResource: { resource_status: "published", resource_sensitivity: "public" },
		requiredContext: { region_scope: "id-jakarta" },
		updatedAt: "",
	},
	{
		id: "deny-sensitive-publish-outside-governance",
		label: "Explicitly deny publishing restricted governance resources",
		labelKey: "awcms.meta.abac.policy.denyRestrictedGovernance",
		effect: "deny",
		actions: ["content.publish_sensitive"],
		requiredSubject: { tenant_id: "tenant-a" },
		requiredResource: { resource_sensitivity: "restricted", module_id: "governance" },
		requiredContext: {},
		updatedAt: "",
	},
	{
		id: "allow-sikesra-document-read",
		label: "Allow SIKESRA document reads for same tenant subjects",
		effect: "allow",
		actions: ["sikesra.document.read"],
		requiredSubject: { tenant_id: "tenant-a", site_id: "site-main" },
		requiredResource: { module_id: "sikesra", resource_type: "document" },
		requiredContext: {},
		updatedAt: "",
	},
	{
		id: "allow-sikesra-document-read-restricted-admin",
		label: "Allow restricted SIKESRA document reads for all-region subjects",
		effect: "allow",
		actions: ["sikesra.document.read_restricted"],
		requiredSubject: { tenant_id: "tenant-a", site_id: "site-main", region_scope: "all" },
		requiredResource: { module_id: "sikesra", resource_type: "document" },
		requiredContext: {},
		updatedAt: "",
	},
];

const DEFAULT_SETTINGS: ExampleSettings = {
	publicStatusLabel: "healthy",
	auditRetentionDays: 30,
	governanceMode: "review",
	metadataCanonicalBase: "",
	smallCellThreshold: 3,
	sikesraPublicEnabled: true,
};

const ALLOWED_GOVERNANCE_MODES = new Set(["observe", "review", "enforceDemo"]);
const ALLOWED_ABAC_TARGET_TYPES = new Set(["subject", "resource", "context"]);
const ALLOWED_ABAC_POLICY_EFFECTS = new Set(["allow", "deny"]);
const ABAC_ATTRIBUTE_KEY_PATTERN = /^[a-z][a-z0-9_]*$/;
const ABAC_POLICY_ID_PATTERN = /^[a-z][a-z0-9_-]*$/;

type SharedRouteHandler = (routeCtx: SandboxedRouteContext, ctx: PluginContext) => Promise<unknown>;

type VerificationStage =
	| "draft"
	| "submitted_village"
	| "verified_village"
	| "submitted_district"
	| "verified_district"
	| "submitted_sopd"
	| "verified_sopd"
	| "submitted_regency"
	| "active_verified";

type VerificationLevel = "desa_kelurahan" | "kecamatan" | "sopd" | "kabupaten_admin" | "tampil";

type VerificationUserLevel = SikesraUserLevel;

interface VerificationListItem {
	id: string;
	registryEntityId: string;
	code: string;
	label: string;
	entityType: string;
	sensitivity: string;
	region: {
		provinceCode: string;
		regencyCode: string;
		districtCode: string;
		villageCode: string;
	};
	verificationStage: VerificationStage;
	inputLevel: VerificationUserLevel;
	currentLevel: VerificationLevel;
	nextStage: VerificationStage | null;
	nextLevel: VerificationLevel | null;
	canAdvance: boolean;
	supportingDocumentIds: string[];
	publicSummary: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(value: unknown, key: string): string | undefined {
	if (!isRecord(value)) return undefined;
	const candidate = value[key];
	return typeof candidate === "string" ? candidate : undefined;
}

function getNumber(value: unknown, key: string): number | undefined {
	if (!isRecord(value)) return undefined;
	const candidate = value[key];
	return typeof candidate === "number" && Number.isFinite(candidate) ? candidate : undefined;
}

function getBoolean(value: unknown, key: string): boolean | undefined {
	if (!isRecord(value)) return undefined;
	const candidate = value[key];
	return typeof candidate === "boolean" ? candidate : undefined;
}

function actorFromRoute(ctx: any): string {
	const ip = ctx.requestMeta?.ip;
	return typeof ip === "string" && ip ? `request:${ip}` : "request:unknown";
}

function actorFromContent(content: Record<string, unknown>): string {
	const actor = content.authorId ?? content.author_id ?? content.updatedBy ?? content.updated_by;
	return typeof actor === "string" && actor ? actor : "system";
}

const VERIFICATION_STAGE_FLOW: VerificationStage[] = [
	"draft",
	"submitted_village",
	"verified_village",
	"submitted_district",
	"verified_district",
	"submitted_sopd",
	"verified_sopd",
	"submitted_regency",
	"active_verified",
];

const VERIFICATION_STATE_KEY = "state:sikesraVerificationStages";

function getNextVerificationStage(stage: VerificationStage): VerificationStage | null {
	const index = VERIFICATION_STAGE_FLOW.indexOf(stage);
	return index >= 0 && index < VERIFICATION_STAGE_FLOW.length - 1
		? (VERIFICATION_STAGE_FLOW[index + 1] ?? null)
		: null;
}

function getVerificationLevel(stage: VerificationStage): VerificationLevel {
	if (stage === "draft" || stage === "submitted_village") return "desa_kelurahan";
	if (stage === "verified_village" || stage === "submitted_district") return "kecamatan";
	if (stage === "verified_district" || stage === "submitted_sopd") return "sopd";
	if (stage === "verified_sopd" || stage === "submitted_regency") return "kabupaten_admin";
	return "tampil";
}

function getAllowedVerifierLevels(level: VerificationLevel): VerificationUserLevel[] {
	if (level === "desa_kelurahan") return ["desa_kelurahan"];
	if (level === "kecamatan") return ["kecamatan"];
	if (level === "sopd") return ["sopd"];
	if (level === "kabupaten_admin") return ["kabupaten", "admin_sikesra"];
	return [];
}

function getRevisionTargetStage(stage: VerificationStage): VerificationStage {
	if (stage === "draft" || stage === "submitted_village" || stage === "verified_village")
		return "submitted_village";
	if (stage === "submitted_district" || stage === "verified_district") return "submitted_village";
	if (stage === "submitted_sopd" || stage === "verified_sopd") return "submitted_district";
	if (stage === "submitted_regency" || stage === "active_verified") return "submitted_sopd";
	return "submitted_village";
}

function inferVerifierLevel(actor: string): VerificationUserLevel | null {
	if (actor.includes("village")) return "desa_kelurahan";
	if (actor.includes("district")) return "kecamatan";
	if (actor.includes("sopd")) return "sopd";
	if (actor.includes("regency")) return "kabupaten";
	if (actor.includes("sikesra-admin") || actor.includes("sikesra_admin")) return "admin_sikesra";
	return null;
}

function mapRoleSlugToVerifierLevel(roleSlug: string): VerificationUserLevel | null {
	if (roleSlug === "verifier-desa-kelurahan") return "desa_kelurahan";
	if (roleSlug === "verifier-kecamatan") return "kecamatan";
	if (roleSlug === "verifier-sopd") return "sopd";
	if (roleSlug === "verifier-kabupaten") return "kabupaten";
	if (roleSlug === "admin-sikesra") return "admin_sikesra";
	return null;
}

function allowClientUserHeadersInDev() {
	return (import.meta as unknown as { env?: { PROD?: boolean } }).env?.PROD !== true;
}

function getRequestUserId(ctx: PluginContext) {
	if (!allowClientUserHeadersInDev()) return null;
	const req = (ctx as any).request as Request | undefined;
	return req?.headers.get("X-Sikesra-User-Id") ?? null;
}

async function getCurrentVerifierLevels(ctx: PluginContext): Promise<VerificationUserLevel[]> {
	const userId = getRequestUserId(ctx);
	if (!userId) return [];
	const assignment = (await ctx.storage.sikesra_user_role_assignments!.get(
		userId,
	)) as UserRoleAssignment | null;
	if (!assignment) return [];
	return assignment.roles
		.map((roleSlug) => mapRoleSlugToVerifierLevel(roleSlug))
		.filter((level): level is VerificationUserLevel => level !== null);
}

async function getCurrentVerifierRegionScope(ctx: PluginContext) {
	const userId = getRequestUserId(ctx);
	if (!userId) return null;
	const subject = (await ctx.storage.sikesra_abac_subject_assignments!.get(
		userId,
	)) as AbacSubjectAssignment | null;
	return subject?.attributes.region_scope ?? null;
}

async function getCurrentVerifierScopeMetadata(ctx: PluginContext) {
	const userId = getRequestUserId(ctx);
	if (!userId) return { verifierRegionScope: undefined, verifierOrgScope: undefined };
	const subject = (await ctx.storage.sikesra_abac_subject_assignments!.get(
		userId,
	)) as AbacSubjectAssignment | null;
	return {
		verifierRegionScope: subject?.attributes.region_scope,
		verifierOrgScope: subject?.attributes.site_id,
	};
}

function filterVerificationItemsForLevels(
	items: VerificationListItem[],
	levels: VerificationUserLevel[],
) {
	if (levels.length === 0 || levels.includes("admin_sikesra")) return items;
	return items.filter((item) =>
		getAllowedVerifierLevels(item.currentLevel).some((level) => levels.includes(level)),
	);
}

function filterVerificationItemsForRegionScope(
	items: VerificationListItem[],
	levels: VerificationUserLevel[],
	regionScope: string | null,
) {
	if (!regionScope || regionScope === "all" || levels.includes("admin_sikesra")) return items;
	return items.filter((item) => {
		if (levels.includes("desa_kelurahan")) return item.region.villageCode === regionScope;
		if (levels.includes("kecamatan")) return item.region.districtCode === regionScope;
		if (levels.includes("sopd") || levels.includes("kabupaten"))
			return item.region.regencyCode === regionScope;
		return true;
	});
}

async function getRegistryEntities(ctx: PluginContext): Promise<SikesraReferenceRegistryEntity[]> {
	const d1Entities = await getD1RegistryEntities(ctx);
	const legacy =
		(await ctx.kv.get<SikesraReferenceRegistryEntity[]>("custom:registryEntities")) ?? [];
	if (legacy.length > 0) {
		for (const entity of legacy) await saveRegistryEntity(ctx, entity);
		await ctx.kv.delete("custom:registryEntities");
	}
	if (d1Entities.length > 0 || legacy.length > 0) {
		return mergeById(SIKESRA_REFERENCE_FIXTURES.registryEntities, d1Entities, legacy);
	}

	const stored = await listStorageValues<SikesraReferenceRegistryEntity>(
		ctx.storage.sikesra_registry_entities!,
	);
	return mergeById(SIKESRA_REFERENCE_FIXTURES.registryEntities, legacy, stored);
}

async function saveRegistryEntity(ctx: PluginContext, entity: SikesraReferenceRegistryEntity) {
	if (await persistD1RegistryEntity(ctx, entity)) return;

	const custom =
		(await ctx.kv.get<SikesraReferenceRegistryEntity[]>("custom:registryEntities")) ?? [];
	const next = [...custom.filter((item) => item.id !== entity.id), entity];
	await ctx.kv.set("custom:registryEntities", next);
	await ctx.storage.sikesra_registry_entities!.put(entity.id, entity);
}

async function getD1RegistryEntities(
	ctx: PluginContext,
	options: { includeDeleted?: boolean } = {},
): Promise<Array<SikesraReferenceRegistryEntity & { deletedAt?: string | null }>> {
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.selectFrom) return [];

	let query = db
		.selectFrom(AWCMS_SIKESRA_REGISTRY_ENTITIES_TABLE)
		.select([
			"id",
			"sikesra_id_20",
			"code",
			"label",
			"entity_type",
			"subtype_code",
			"sensitivity",
			"province_code",
			"regency_code",
			"district_code",
			"village_code",
			"verification_stage",
			"input_level",
			"public_summary",
			"deleted_at",
		])
		.where("tenant_id", "=", AWCMS_SIKESRA_DEFAULT_TENANT_ID)
		.where("site_id", "=", AWCMS_SIKESRA_DEFAULT_SITE_ID);
	if (!options.includeDeleted) query = query.where("deleted_at", "is", null);
	const rows = (await query.execute()) as Array<{
		id: string;
		sikesra_id_20?: string | null;
		code: string;
		label: string;
		entity_type: string;
		sensitivity: SikesraSensitivity;
		province_code?: string | null;
		regency_code?: string | null;
		district_code?: string | null;
		village_code?: string | null;
		verification_stage: SikesraReferenceRegistryEntity["verificationStage"];
		input_level?: VerificationUserLevel | null;
		public_summary?: string | null;
		deleted_at?: string | null;
	}>;

	return rows.map((row) => ({
		id: row.id,
		sikesraId20: (row as any).sikesra_id_20 ?? undefined,
		code: row.code,
		label: row.label,
		entityType: row.entity_type,
		sensitivity: row.sensitivity,
		region: {
			provinceCode: row.province_code ?? "",
			regencyCode: row.regency_code ?? "",
			districtCode: row.district_code ?? "",
			villageCode: row.village_code ?? "",
		},
		verificationStage: row.verification_stage,
		inputLevel: row.input_level ?? "desa_kelurahan",
		supportingDocumentIds: [],
		publicSummary: row.public_summary ?? "",
		deletedAt: row.deleted_at ?? null,
	}));
}

async function updateD1RegistryEntityDeletedAt(
	ctx: PluginContext,
	input: { id: string; deletedAt: string | null; actor: string | null },
) {
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.insertInto) return false;
	const existing = (await getD1RegistryEntities(ctx, { includeDeleted: true })).find(
		(entity) => entity.id === input.id,
	);
	if (!existing) return false;
	const now = toIsoNow();
	await db
		.insertInto(AWCMS_SIKESRA_REGISTRY_ENTITIES_TABLE)
		.values({
			tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
			site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
			id: existing.id,
			sikesra_id_20: existing.sikesraId20 ?? null,
			code: existing.code,
			label: existing.label,
			entity_type: existing.entityType,
			subtype_code: null,
			sensitivity: existing.sensitivity,
			province_code: existing.region.provinceCode || null,
			regency_code: existing.region.regencyCode || null,
			district_code: existing.region.districtCode || null,
			village_code: existing.region.villageCode || null,
			verification_stage: existing.verificationStage,
			input_level: existing.inputLevel,
			public_summary: existing.publicSummary,
			created_at: now,
			updated_at: now,
			deleted_at: input.deletedAt,
			created_by: null,
			updated_by: input.actor,
		})
		.onConflict((oc: any) =>
			oc.columns(["tenant_id", "site_id", "id"]).doUpdateSet({
				updated_at: now,
				deleted_at: input.deletedAt,
				updated_by: input.actor,
			}),
		)
		.execute();
	return true;
}

async function persistD1RegistryEntity(ctx: PluginContext, entity: SikesraReferenceRegistryEntity) {
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.insertInto) return false;

	const now = toIsoNow();
	await db
		.insertInto(AWCMS_SIKESRA_REGISTRY_ENTITIES_TABLE)
		.values({
			tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
			site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
			id: entity.id,
			sikesra_id_20: entity.sikesraId20 ?? null,
			code: entity.code,
			label: entity.label,
			entity_type: entity.entityType,
			subtype_code: null,
			sensitivity: entity.sensitivity,
			province_code: entity.region.provinceCode || null,
			regency_code: entity.region.regencyCode || null,
			district_code: entity.region.districtCode || null,
			village_code: entity.region.villageCode || null,
			verification_stage: entity.verificationStage,
			input_level: entity.inputLevel,
			public_summary: entity.publicSummary,
			created_at: now,
			updated_at: now,
			deleted_at: null,
			created_by: null,
			updated_by: null,
		})
		.onConflict((oc: any) =>
			oc.columns(["tenant_id", "site_id", "id"]).doUpdateSet({
				sikesra_id_20: entity.sikesraId20 ?? null,
				code: entity.code,
				label: entity.label,
				entity_type: entity.entityType,
				sensitivity: entity.sensitivity,
				province_code: entity.region.provinceCode || null,
				regency_code: entity.region.regencyCode || null,
				district_code: entity.region.districtCode || null,
				village_code: entity.region.villageCode || null,
				verification_stage: entity.verificationStage,
				input_level: entity.inputLevel,
				public_summary: entity.publicSummary,
				updated_at: now,
				deleted_at: null,
				updated_by: null,
			}),
		)
		.execute();

	const detailTable = AWCMS_SIKESRA_MODULE_DETAIL_TABLES[entity.entityType];
	if (detailTable) {
		const detailRow: Record<string, unknown> = {
			tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
			site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
			registry_entity_id: entity.id,
			detail_json: JSON.stringify({
				code: entity.code,
				label: entity.label,
				entityType: entity.entityType,
				sensitivity: entity.sensitivity,
				region: entity.region,
				publicSummary: entity.publicSummary,
			}),
			field_standard_version: "draft",
			created_at: now,
			updated_at: now,
			deleted_at: null,
			created_by: null,
			updated_by: null,
		};
		if (["guru_agama", "anak_yatim", "disabilitas", "lansia_terlantar"].includes(entity.entityType)) {
			detailRow.person_profile_id = null;
		}

		await db
			.insertInto(detailTable)
			.values(detailRow)
			.onConflict((oc: any) =>
				oc.columns(["tenant_id", "site_id", "registry_entity_id"]).doUpdateSet({
					detail_json: detailRow.detail_json,
					field_standard_version: "draft",
					updated_at: now,
					deleted_at: null,
					updated_by: null,
				}),
			)
			.execute();
	}

	return true;
}

async function generateD1SikesraId20(
	ctx: PluginContext,
	params: { registryEntityId: string; villageCode: string; typeCode: string; subtypeCode: string; actor?: string },
) {
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.selectFrom || !db?.insertInto) return null;
	if (!/^\d{10}$/.test(params.villageCode)) return null;
	if (!/^\d{2}$/.test(params.typeCode)) return null;
	if (!/^\d{2}$/.test(params.subtypeCode)) return null;

	const sequenceKey = `${params.villageCode}:${params.typeCode}:${params.subtypeCode}`;
	const rows = (await db
		.selectFrom(AWCMS_SIKESRA_CODE_SEQUENCES_TABLE)
		.select(["sequence_key", "last_value"])
		.where("tenant_id", "=", AWCMS_SIKESRA_DEFAULT_TENANT_ID)
		.where("site_id", "=", AWCMS_SIKESRA_DEFAULT_SITE_ID)
		.where("sequence_key", "=", sequenceKey)
		.execute()) as Array<{ sequence_key: string; last_value: number | string }>;
	const nextValue = Number(rows[0]?.last_value ?? 0) + 1;
	const now = toIsoNow();
	const sikesraId20 = `${params.villageCode}${params.typeCode}${params.subtypeCode}${String(nextValue).padStart(6, "0")}`;

	await db
		.insertInto(AWCMS_SIKESRA_CODE_SEQUENCES_TABLE)
		.values({
			tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
			site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
			sequence_key: sequenceKey,
			last_value: nextValue,
			created_at: now,
			updated_at: now,
			deleted_at: null,
			created_by: params.actor ?? null,
			updated_by: params.actor ?? null,
		})
		.onConflict((oc: any) =>
			oc.columns(["tenant_id", "site_id", "sequence_key"]).doUpdateSet({
				last_value: nextValue,
				updated_at: now,
				deleted_at: null,
				updated_by: params.actor ?? null,
			}),
		)
		.execute();

	await db
		.insertInto(AWCMS_SIKESRA_CODE_HISTORY_TABLE)
		.values({
			tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
			site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
			id: `${params.registryEntityId}:${sikesraId20}`,
			registry_entity_id: params.registryEntityId,
			sikesra_id_20: sikesraId20,
			sequence_key: sequenceKey,
			issued_at: now,
			issued_by: params.actor ?? null,
			created_at: now,
			updated_at: now,
			deleted_at: null,
			created_by: params.actor ?? null,
			updated_by: params.actor ?? null,
		})
		.execute();

	return sikesraId20;
}

async function getSupportingDocuments(
	ctx: PluginContext,
): Promise<SikesraReferenceSupportingDocument[]> {
	const d1Documents = await getD1SupportingDocuments(ctx);
	const legacy =
		(await ctx.kv.get<SikesraReferenceSupportingDocument[]>("custom:supportingDocuments")) ?? [];
	if (legacy.length > 0) {
		for (const doc of legacy) await saveSupportingDocument(ctx, doc);
		await ctx.kv.delete("custom:supportingDocuments");
	}
	if (d1Documents.length > 0 || legacy.length > 0) {
		return mergeById(SIKESRA_REFERENCE_FIXTURES.supportingDocuments, d1Documents, legacy);
	}

	const stored = await listStorageValues<SikesraReferenceSupportingDocument>(
		ctx.storage.sikesra_supporting_documents!,
	);
	return mergeById(SIKESRA_REFERENCE_FIXTURES.supportingDocuments, legacy, stored);
}

async function saveSupportingDocument(ctx: PluginContext, doc: SikesraReferenceSupportingDocument) {
	if (await persistD1SupportingDocument(ctx, doc)) return;

	const custom =
		(await ctx.kv.get<SikesraReferenceSupportingDocument[]>("custom:supportingDocuments")) ?? [];
	const next = [...custom.filter((item) => item.id !== doc.id), doc];
	await ctx.kv.set("custom:supportingDocuments", next);
	await ctx.storage.sikesra_supporting_documents!.put(doc.id, doc);
}

async function getD1SupportingDocuments(
	ctx: PluginContext,
): Promise<SikesraReferenceSupportingDocument[]> {
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.selectFrom) return [];

	const rows = (await db
		.selectFrom(AWCMS_SIKESRA_SUPPORTING_DOCUMENTS_TABLE)
		.select([
			"id",
			"registry_entity_id",
			"file_object_id",
			"document_type",
			"title",
			"classification",
			"validation_status",
			"issued_at",
			"created_by",
		])
		.where("tenant_id", "=", AWCMS_SIKESRA_DEFAULT_TENANT_ID)
		.where("site_id", "=", AWCMS_SIKESRA_DEFAULT_SITE_ID)
		.where("deleted_at", "is", null)
		.orderBy("created_at", "desc")
		.execute()) as Array<{
		id: string;
		registry_entity_id: string;
		file_object_id?: string | null;
		document_type: string;
		title: string;
		classification: SikesraSensitivity;
		validation_status?: SikesraReferenceSupportingDocument["validationStatus"] | null;
		issued_at?: string | null;
		created_by?: string | null;
	}>;

	return Promise.all(
		rows.map(async (row) => {
			const fileObject = row.file_object_id
				? await getD1FileObject(ctx, row.file_object_id)
				: null;
			return {
				id: row.id,
				registryEntityId: row.registry_entity_id,
				fileObjectId: row.file_object_id ?? undefined,
				documentType: row.document_type,
				title: row.title,
				sensitivity: row.classification,
				contentType: fileObject?.content_type,
				fileSizeBytes: fileObject?.file_size_bytes,
				checksumSha256: fileObject?.checksum_sha256 ?? undefined,
				originalFilename: fileObject?.original_filename,
				safeFilename: fileObject?.safe_filename,
				validationStatus: row.validation_status ?? "pending",
				issuedAt: row.issued_at ?? "",
				verifiedBy: row.created_by ?? "system",
			};
		}),
	);
}

async function getD1FileObject(ctx: PluginContext, id: string) {
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.selectFrom) return null;

	const rows = (await db
		.selectFrom(AWCMS_SIKESRA_FILE_OBJECTS_TABLE)
		.select([
			"id",
			"original_filename",
			"safe_filename",
			"content_type",
			"file_size_bytes",
			"checksum_sha256",
		])
		.where("tenant_id", "=", AWCMS_SIKESRA_DEFAULT_TENANT_ID)
		.where("site_id", "=", AWCMS_SIKESRA_DEFAULT_SITE_ID)
		.where("id", "=", id)
		.where("deleted_at", "is", null)
		.limit(1)
		.execute()) as Array<{
		id: string;
		original_filename: string;
		safe_filename: string;
		content_type: string;
		file_size_bytes: number;
		checksum_sha256?: string | null;
	}>;

	return rows[0] ?? null;
}

function validateSupportingDocumentInput(doc: SikesraReferenceSupportingDocument) {
	const invalidFields: string[] = [];
	if (!doc.registryEntityId) invalidFields.push("registryEntityId");
	if (!doc.title) invalidFields.push("title");
	if (!doc.documentType) invalidFields.push("documentType");
	if (!AWCMS_SIKESRA_DOCUMENT_CLASSIFICATIONS.includes(doc.sensitivity as any)) {
		invalidFields.push("classification");
	}
	if (
		doc.contentType &&
		!AWCMS_SIKESRA_DOCUMENT_CONTENT_TYPES.includes(doc.contentType as any)
	) {
		invalidFields.push("contentType");
	}
	if (
		doc.fileSizeBytes != null &&
		(!Number.isInteger(doc.fileSizeBytes) ||
			doc.fileSizeBytes < 0 ||
			doc.fileSizeBytes > AWCMS_SIKESRA_DOCUMENT_MAX_FILE_SIZE_BYTES)
	) {
		invalidFields.push("fileSizeBytes");
	}
	if (doc.checksumSha256 && !/^[a-f0-9]{64}$/i.test(doc.checksumSha256)) {
		invalidFields.push("checksumSha256");
	}
	return invalidFields;
}

function createValidationError(fields: string[]) {
	return {
		success: false,
		error: {
			code: "VALIDATION_ERROR",
			message: `Invalid document metadata: ${fields.join(", ")}`,
			details: { fields },
		},
	};
}

async function persistD1SupportingDocument(ctx: PluginContext, doc: SikesraReferenceSupportingDocument) {
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.insertInto) return false;

	const now = doc.issuedAt || toIsoNow();
	const fileObjectId = doc.fileObjectId ?? `${doc.id}:file`;
	const safeFilename = doc.safeFilename ?? `${doc.id}.metadata`;
	const validationStatus = doc.validationStatus ?? "pending";
	await db
		.insertInto(AWCMS_SIKESRA_FILE_OBJECTS_TABLE)
		.values({
			tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
			site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
			id: fileObjectId,
			storage_provider: "r2",
			storage_bucket: null,
			storage_key: `tenants/${AWCMS_SIKESRA_DEFAULT_TENANT_ID}/sites/${AWCMS_SIKESRA_DEFAULT_SITE_ID}/modules/sikesra/${doc.sensitivity}/${now.slice(0, 4)}/${now.slice(5, 7)}/${safeFilename}`,
			original_filename: doc.originalFilename ?? doc.title,
			safe_filename: safeFilename,
			content_type: doc.contentType ?? "application/pdf",
			file_extension: safeFilename.includes(".") ? safeFilename.split(".").pop() : null,
			file_size_bytes: doc.fileSizeBytes ?? 0,
			checksum_sha256: doc.checksumSha256 ?? null,
			classification: doc.sensitivity,
			validation_status: validationStatus,
			validation_notes: null,
			created_at: now,
			updated_at: now,
			deleted_at: null,
			created_by: doc.verifiedBy,
			updated_by: doc.verifiedBy,
		})
		.onConflict((oc: any) =>
			oc.columns(["tenant_id", "site_id", "id"]).doUpdateSet({
				classification: doc.sensitivity,
				validation_status: validationStatus,
				updated_at: now,
				deleted_at: null,
				updated_by: doc.verifiedBy,
			}),
		)
		.execute();

	await db
		.insertInto(AWCMS_SIKESRA_SUPPORTING_DOCUMENTS_TABLE)
		.values({
			tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
			site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
			id: doc.id,
			registry_entity_id: doc.registryEntityId,
			file_object_id: fileObjectId,
			document_type: doc.documentType,
			title: doc.title,
			classification: doc.sensitivity,
			validation_status: validationStatus,
			verification_stage: "draft",
			issuer: null,
			issued_at: doc.issuedAt,
			expires_at: null,
			access_policy: "rbac_abac_required",
			metadata_json: "{}",
			created_at: now,
			updated_at: now,
			deleted_at: null,
			created_by: doc.verifiedBy,
			updated_by: doc.verifiedBy,
		})
		.onConflict((oc: any) =>
			oc.columns(["tenant_id", "site_id", "id"]).doUpdateSet({
				registry_entity_id: doc.registryEntityId,
				file_object_id: fileObjectId,
				document_type: doc.documentType,
				title: doc.title,
				classification: doc.sensitivity,
				issued_at: doc.issuedAt,
				updated_at: now,
				deleted_at: null,
				updated_by: doc.verifiedBy,
			}),
		)
		.execute();

	return true;
}

async function findSupportingDocument(ctx: PluginContext, id: string) {
	const docs = await getSupportingDocuments(ctx);
	return docs.find((doc) => doc.id === id) ?? null;
}

async function ensureDocumentAbacResource(ctx: PluginContext, doc: SikesraReferenceSupportingDocument) {
	await ensureAbacCatalogSeeded(ctx);
	const assignment = touchUpdatedAt<AbacResourceAssignment>({
		resourceId: doc.id,
		attributes: {
			module_id: "sikesra",
			resource_type: "document",
			resource_status: doc.validationStatus ?? "pending",
			resource_sensitivity: doc.sensitivity,
			owner_user_id: doc.verifiedBy,
		},
		updatedAt: "",
	});
	await ctx.storage.sikesra_abac_resource_assignments!.put(doc.id, assignment);
	return assignment;
}

function toSafeDocumentAccessResponse(doc: SikesraReferenceSupportingDocument) {
	return {
		id: doc.id,
		registryEntityId: doc.registryEntityId,
		documentType: doc.documentType,
		title: doc.title,
		classification: doc.sensitivity,
		validationStatus: doc.validationStatus ?? "pending",
		fileObjectId: doc.fileObjectId,
		contentType: doc.contentType,
		fileSizeBytes: doc.fileSizeBytes,
		checksumSha256: doc.checksumSha256,
	};
}

async function listVerificationEvents(
	ctx: PluginContext,
): Promise<SikesraReferenceVerificationEvent[]> {
	const d1Events = await getD1VerificationEvents(ctx);
	if (d1Events.length > 0) return d1Events;

	return listStorageValues<SikesraReferenceVerificationEvent>(
		ctx.storage.sikesra_verification_events!,
	);
}

async function appendVerificationEvent(
	ctx: PluginContext,
	event: SikesraReferenceVerificationEvent,
) {
	if (await persistD1VerificationEvent(ctx, event)) {
		await persistStateValue(ctx, "state:lastVerificationEventId", event.id);
		return event;
	}

	await ctx.storage.sikesra_verification_events!.put(event.id, event);
	await persistStateValue(ctx, "state:lastVerificationEventId", event.id);
	return event;
}

async function getD1VerificationEvents(ctx: PluginContext): Promise<SikesraReferenceVerificationEvent[]> {
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.selectFrom) return [];

	const rows = (await db
		.selectFrom(AWCMS_SIKESRA_VERIFICATION_EVENTS_TABLE)
		.select([
			"id",
			"registry_entity_id",
			"from_stage",
			"to_stage",
			"verifier_level",
			"verifier_user_id",
			"decision",
			"notes",
			"region_scope_code",
			"created_at",
		])
		.where("tenant_id", "=", AWCMS_SIKESRA_DEFAULT_TENANT_ID)
		.where("site_id", "=", AWCMS_SIKESRA_DEFAULT_SITE_ID)
		.where("deleted_at", "is", null)
		.orderBy("created_at", "desc")
		.execute()) as Array<{
		id: string;
		registry_entity_id: string;
		from_stage?: VerificationStage | null;
		to_stage: VerificationStage;
		verifier_level: VerificationUserLevel;
		verifier_user_id?: string | null;
		decision: SikesraReferenceVerificationEvent["result"];
		notes?: string | null;
		region_scope_code?: string | null;
		created_at: string;
	}>;

	return rows.map((row) => ({
		id: row.id,
		registryEntityId: row.registry_entity_id,
		stage: row.to_stage,
		actor: row.verifier_user_id ?? "system",
		verifierLevel: row.verifier_level,
		verifierRegionScope: row.region_scope_code ?? undefined,
		result: row.decision,
		notes: row.notes ?? "",
		createdAt: row.created_at,
	}));
}

async function persistD1VerificationEvent(ctx: PluginContext, event: SikesraReferenceVerificationEvent) {
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.insertInto) return false;

	const currentState = await getVerificationStageState(ctx);
	const now = event.createdAt || toIsoNow();
	await db
		.insertInto(AWCMS_SIKESRA_VERIFICATION_EVENTS_TABLE)
		.values({
			tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
			site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
			id: event.id,
			registry_entity_id: event.registryEntityId,
			from_stage: currentState[event.registryEntityId] ?? null,
			to_stage: event.stage,
			verifier_level: event.verifierLevel ?? event.inputLevel ?? "admin_sikesra",
			verifier_user_id: event.actor,
			decision: event.result,
			reason: event.result,
			notes: event.notes,
			region_scope_code: event.verifierRegionScope ?? null,
			audit_event_id: null,
			created_at: now,
			updated_at: now,
			deleted_at: null,
			created_by: event.actor,
			updated_by: event.actor,
		})
		.execute();

	return true;
}

async function getVerificationStageState(
	ctx: PluginContext,
): Promise<Record<string, VerificationStage>> {
	const entities = await getRegistryEntities(ctx);
	const defaultState = Object.fromEntries(
		entities.map((entity) => [entity.id, entity.verificationStage]),
	) as Record<string, VerificationStage>;
	const d1State = await getD1VerificationStageState(ctx);
	if (Object.keys(d1State).length > 0) return { ...defaultState, ...d1State };

	const storedRecords = await listStorageValues<StoredVerificationStageRecord>(
		ctx.storage.sikesra_verification_stage_state!,
	);
	if (storedRecords.length > 0) {
		return {
			...defaultState,
			...Object.fromEntries(storedRecords.map((record) => [record.registryEntityId, record.stage])),
		};
	}
	const stored = await ctx.kv.get<Record<string, VerificationStage>>(VERIFICATION_STATE_KEY);
	if (stored && typeof stored === "object") {
		for (const [registryEntityId, stage] of Object.entries(stored)) {
			await ctx.storage.sikesra_verification_stage_state!.put(registryEntityId, {
				registryEntityId,
				stage,
				updatedAt: toIsoNow(),
			});
		}
		await ctx.kv.delete(VERIFICATION_STATE_KEY);
		return { ...defaultState, ...stored };
	}
	return defaultState;
}

async function getD1VerificationStageState(ctx: PluginContext) {
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.selectFrom) return {} as Record<string, VerificationStage>;

	const rows = (await db
		.selectFrom(AWCMS_SIKESRA_VERIFICATION_STAGE_STATE_TABLE)
		.select(["registry_entity_id", "stage"])
		.where("tenant_id", "=", AWCMS_SIKESRA_DEFAULT_TENANT_ID)
		.where("site_id", "=", AWCMS_SIKESRA_DEFAULT_SITE_ID)
		.where("status", "=", "pending")
		.execute()) as Array<{ registry_entity_id: string; stage: VerificationStage }>;

	return Object.fromEntries(rows.map((row) => [row.registry_entity_id, row.stage])) as Record<
		string,
		VerificationStage
	>;
}

async function setVerificationStageState(
	ctx: PluginContext,
	state: Record<string, VerificationStage>,
) {
	const wroteD1 = await persistD1VerificationStageState(ctx, state);
	if (wroteD1) return;

	for (const [registryEntityId, stage] of Object.entries(state)) {
		await ctx.storage.sikesra_verification_stage_state!.put(registryEntityId, {
			registryEntityId,
			stage,
			updatedAt: toIsoNow(),
		});
	}
	await ctx.kv.set(VERIFICATION_STATE_KEY, state);
}

async function persistD1VerificationStageState(ctx: PluginContext, state: Record<string, VerificationStage>) {
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.insertInto) return false;

	const now = toIsoNow();
	for (const [registryEntityId, stage] of Object.entries(state)) {
		const nextStage = getNextVerificationStage(stage);
		await db
			.insertInto(AWCMS_SIKESRA_VERIFICATION_STAGE_STATE_TABLE)
			.values({
				tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
				site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
				registry_entity_id: registryEntityId,
				stage,
				current_level: getVerificationLevel(stage),
				next_level: nextStage ? getVerificationLevel(nextStage) : null,
				status: "pending",
				created_at: now,
				updated_at: now,
				deleted_at: null,
			})
			.onConflict((oc: any) =>
				oc.columns(["tenant_id", "site_id", "registry_entity_id"]).doUpdateSet({
					stage,
					current_level: getVerificationLevel(stage),
					next_level: nextStage ? getVerificationLevel(nextStage) : null,
					status: "pending",
					updated_at: now,
					deleted_at: null,
				}),
			)
			.execute();
	}

	return true;
}

async function migrateRuntimeStateToD1(ctx: PluginContext) {
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.insertInto) return;

	let migrated = 0;
	const storedSettings = await listStorageValues<StoredSettingRecord>(ctx.storage.sikesra_settings_state!);
	if (storedSettings.length > 0) {
		if (await persistD1Settings(ctx, storedSettings, toIsoNow())) migrated += storedSettings.length;
	}

	const customDataTypes = await ctx.kv.get<unknown>("custom:data-types");
	if (customDataTypes && (await persistD1DataTypes(ctx, customDataTypes))) migrated += 1;

	const customRegions = await ctx.kv.get<unknown>("custom:regions");
	if (customRegions && (await persistD1RegionTree(ctx, customRegions, "official"))) migrated += 1;

	const customLocalRegions = await ctx.kv.get<unknown>("custom:local-regions");
	if (customLocalRegions && (await persistD1RegionTree(ctx, customLocalRegions, "local"))) migrated += 1;

	const storedVerificationRows = await listStorageValues<StoredVerificationStageRecord>(
		ctx.storage.sikesra_verification_stage_state!,
	);
	if (storedVerificationRows.length > 0) {
		const state = Object.fromEntries(
			storedVerificationRows.map((row) => [row.registryEntityId, row.stage]),
		) as Record<string, VerificationStage>;
		if (await persistD1VerificationStageState(ctx, state)) migrated += storedVerificationRows.length;
	}

	const legacyVerificationState = await ctx.kv.get<Record<string, VerificationStage>>(VERIFICATION_STATE_KEY);
	if (legacyVerificationState && (await persistD1VerificationStageState(ctx, legacyVerificationState))) {
		migrated += Object.keys(legacyVerificationState).length;
		await ctx.kv.delete(VERIFICATION_STATE_KEY);
	}

	if (migrated > 0) {
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: "runtime-state.d1-migration",
				scope: "migration",
				actor: "system",
				summary: "Migrated SIKESRA runtime state to dedicated D1 tables",
				metadata: { migrated },
			}),
		);
	}
}

async function listVerificationItems(ctx: PluginContext): Promise<VerificationListItem[]> {
	const state = await getVerificationStageState(ctx);
	const entities = await getRegistryEntities(ctx);
	return entities.map((entity) => {
		const verificationStage = state[entity.id] ?? entity.verificationStage;
		const nextStage = getNextVerificationStage(verificationStage);
		return {
			id: entity.id,
			registryEntityId: entity.id,
			code: entity.code,
			label: entity.label,
			entityType: entity.entityType,
			sensitivity: entity.sensitivity,
			region: entity.region,
			verificationStage,
			inputLevel: entity.inputLevel,
			currentLevel: getVerificationLevel(verificationStage),
			nextStage,
			nextLevel: nextStage ? getVerificationLevel(nextStage) : null,
			canAdvance: verificationStage !== "active_verified",
			supportingDocumentIds: entity.supportingDocumentIds,
			publicSummary: entity.publicSummary,
		};
	});
}

function toIsoNow() {
	return new Date().toISOString();
}

async function listStorageValues<T>(collection: {
	query: (options?: any) => Promise<{ items: Array<{ id: string; data: unknown }> }>;
}) {
	const result = await collection.query({ limit: 200 });
	return result.items.map((item) => item.data as T);
}

async function getStoredSettings(ctx: PluginContext) {
	const d1Settings = await getD1Settings(ctx);
	if (d1Settings.size > 0) return d1Settings;

	const records = await listStorageValues<StoredSettingRecord>(ctx.storage.sikesra_settings_state!);
	const map = new Map<string, StoredSettingRecord>();
	for (const record of records) map.set(record.key, record);
	return map;
}

async function getD1Settings(ctx: PluginContext) {
	const map = new Map<string, StoredSettingRecord>();
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.selectFrom) return map;

	const rows = (await db
		.selectFrom(AWCMS_SIKESRA_SETTINGS_TABLE)
		.select(["key", "value_json", "updated_at"])
		.where("tenant_id", "=", AWCMS_SIKESRA_DEFAULT_TENANT_ID)
		.where("site_id", "=", AWCMS_SIKESRA_DEFAULT_SITE_ID)
		.execute()) as Array<{ key: string; value_json: string; updated_at?: string | null }>;

	for (const row of rows) {
		map.set(row.key, {
			key: row.key,
			value: JSON.parse(row.value_json) as StoredSettingRecord["value"],
			updatedAt: row.updated_at ?? toIsoNow(),
		});
	}

	return map;
}

async function getStoredState(ctx: PluginContext) {
	const records = await listStorageValues<StoredStateRecord>(ctx.storage.sikesra_plugin_state!);
	const map = new Map<string, StoredStateRecord>();
	for (const record of records) map.set(record.key, record);
	return map;
}

async function persistSettings(ctx: PluginContext, next: ExampleSettings) {
	const now = toIsoNow();
	const records: StoredSettingRecord[] = [
		{ key: "publicStatusLabel", value: next.publicStatusLabel, updatedAt: now },
		{ key: "auditRetentionDays", value: next.auditRetentionDays, updatedAt: now },
		{ key: "governanceMode", value: next.governanceMode, updatedAt: now },
		{ key: "metadataCanonicalBase", value: next.metadataCanonicalBase, updatedAt: now },
		{ key: "smallCellThreshold", value: next.smallCellThreshold, updatedAt: now },
		{ key: "sikesraPublicEnabled", value: next.sikesraPublicEnabled, updatedAt: now },
	];

	const wroteD1 = await persistD1Settings(ctx, records, now);
	if (wroteD1) return;

	for (const record of records) {
		await ctx.storage.sikesra_settings_state!.put(record.key, record);
	}
}

async function persistD1Settings(ctx: PluginContext, records: StoredSettingRecord[], now: string) {
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.insertInto) return false;

	for (const record of records) {
		await db
			.insertInto(AWCMS_SIKESRA_SETTINGS_TABLE)
			.values({
				tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
				site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
				key: record.key,
				value_json: JSON.stringify(record.value),
				created_at: now,
				updated_at: now,
				deleted_at: null,
			})
			.onConflict((oc: any) =>
				oc.columns(["tenant_id", "site_id", "key"]).doUpdateSet({
					value_json: JSON.stringify(record.value),
					updated_at: now,
					deleted_at: null,
				}),
			)
			.execute();
	}

	return true;
}

async function persistStateValue(
	ctx: PluginContext,
	key: string,
	value: StoredStateRecord["value"],
) {
	const record: StoredStateRecord = { key, value, updatedAt: toIsoNow() };
	await ctx.storage.sikesra_plugin_state!.put(key, record);
}

async function readStateValue<T extends StoredStateRecord["value"]>(
	ctx: PluginContext,
	key: string,
	fallback: T,
): Promise<T> {
	const stored = await getStoredState(ctx);
	const record = stored.get(key);
	return (record?.value as T | undefined) ?? fallback;
}

function mergeById<T extends { id: string }>(...groups: T[][]): T[] {
	const merged = new Map<string, T>();
	for (const group of groups) {
		for (const item of group) merged.set(item.id, item);
	}
	return [...merged.values()];
}

async function getSettings(ctx: PluginContext): Promise<ExampleSettings> {
	const storedSettings = await getStoredSettings(ctx);

	return {
		publicStatusLabel:
			typeof storedSettings.get("publicStatusLabel")?.value === "string"
				? (storedSettings.get("publicStatusLabel")!.value as string)
				: DEFAULT_SETTINGS.publicStatusLabel,
		auditRetentionDays:
			typeof storedSettings.get("auditRetentionDays")?.value === "number"
				? (storedSettings.get("auditRetentionDays")!.value as number)
				: DEFAULT_SETTINGS.auditRetentionDays,
		governanceMode:
			typeof storedSettings.get("governanceMode")?.value === "string"
				? (storedSettings.get("governanceMode")!.value as string)
				: DEFAULT_SETTINGS.governanceMode,
		metadataCanonicalBase:
			typeof storedSettings.get("metadataCanonicalBase")?.value === "string"
				? (storedSettings.get("metadataCanonicalBase")!.value as string)
				: DEFAULT_SETTINGS.metadataCanonicalBase,
		smallCellThreshold:
			typeof storedSettings.get("smallCellThreshold")?.value === "number"
				? (storedSettings.get("smallCellThreshold")!.value as number)
				: DEFAULT_SETTINGS.smallCellThreshold,
		sikesraPublicEnabled:
			typeof storedSettings.get("sikesraPublicEnabled")?.value === "boolean"
				? (storedSettings.get("sikesraPublicEnabled")!.value as boolean)
				: DEFAULT_SETTINGS.sikesraPublicEnabled,
	};
}

async function setSettings(ctx: PluginContext, input: unknown) {
	const current = await getSettings(ctx);
	const next: ExampleSettings = {
		publicStatusLabel: getString(input, "publicStatusLabel") ?? current.publicStatusLabel,
		auditRetentionDays: getNumber(input, "auditRetentionDays") ?? current.auditRetentionDays,
		governanceMode: getString(input, "governanceMode") ?? current.governanceMode,
		metadataCanonicalBase:
			getString(input, "metadataCanonicalBase") ?? current.metadataCanonicalBase,
		smallCellThreshold: getNumber(input, "smallCellThreshold") ?? current.smallCellThreshold,
		sikesraPublicEnabled: getBoolean(input, "sikesraPublicEnabled") ?? current.sikesraPublicEnabled,
	};

	await persistSettings(ctx, next);

	return next;
}

async function incrementCounter(ctx: PluginContext, key: string) {
	const current = await readStateValue(ctx, key, 0);
	const next = current + 1;
	await persistStateValue(ctx, key, next);
	return next;
}

export function createAuditRecord(
	input: Omit<ExampleAuditEvent, "id" | "timestamp">,
): ExampleAuditEvent {
	const timestamp = toIsoNow();
	return {
		id: `${timestamp}:${input.kind}:${Math.random().toString(36).slice(2, 8)}`,
		timestamp,
		kind: input.kind,
		scope: input.scope,
		actor: input.actor,
		summary: input.summary,
		metadata: redactAuditMetadata(input.metadata) as Record<string, unknown>,
	};
}

async function appendAuditEvent(ctx: PluginContext, record: ExampleAuditEvent) {
	const req = (ctx as any).request as Request | undefined;
	if (req && allowClientUserHeadersInDev()) {
		const userId = req.headers.get("X-Sikesra-User-Id");
		const userName = req.headers.get("X-Sikesra-User-Name");
		if (userId) record.userId = userId;
		if (userName) record.userName = userName;
	}
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db) return record;

	await ensureAuditEventTable(db);
	const timestamp = toIsoNow();
	const metadata = redactAuditMetadata(record.metadata ?? {}) as Record<string, unknown>;
	record.metadata = metadata;

	await db
		.insertInto(AWCMS_SIKESRA_AUDIT_TABLE)
		.values({
			tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
			site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
			id: record.id,
			timestamp,
			kind: record.kind,
			scope: record.scope,
			actor_user_id: record.userId ?? null,
			actor_name: record.userName ?? record.actor,
			summary: record.summary,
			metadata_json: JSON.stringify(metadata),
			redaction_policy: "sikesra_default_redacted",
			request_id: null,
			ip_hash: null,
			user_agent_hash: null,
			created_at: timestamp,
		})
		.execute();
	await persistStateValue(ctx, "state:lastAuditEventId", record.id);
	await incrementCounter(ctx, "state:auditCount");
	ctx.log.info(`[${AWCMS_SIKESRA_PLUGIN_ID}] ${record.summary}`, metadata);
	return record;
}

async function listAuditEvents(ctx: PluginContext, limit = 20, _cursor?: string) {
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db) {
		return {
			items: [] as ExampleAuditEvent[],
			cursor: undefined as string | undefined,
			hasMore: false,
		};
	}

	await ensureAuditEventTable(db);
	const rows = (await db
		.selectFrom(AWCMS_SIKESRA_AUDIT_TABLE)
		.select([
			"tenant_id",
			"site_id",
			"id",
			"timestamp",
			"kind",
			"scope",
			"actor_user_id",
			"actor_name",
			"summary",
			"metadata_json",
			"request_id",
			"ip_hash",
			"user_agent_hash",
			"created_at",
		])
		.orderBy("timestamp", "desc")
		.orderBy("id", "desc")
		.limit(limit)
		.execute()) as SikesraAuditEventRow[];

	return {
		items: rows.map((item) => ({
			id: item.id,
			timestamp: item.timestamp,
			kind: item.kind,
			scope: item.scope,
			actor: item.actor_name ?? item.actor ?? "system",
			summary: item.summary,
			metadata: JSON.parse(item.metadata_json ?? item.metadata ?? "{}") as Record<string, unknown>,
			userId: item.actor_user_id ?? undefined,
			userName: item.actor_name ?? undefined,
		})),
		cursor: undefined,
		hasMore: false,
	};
}

async function summarizePluginState(ctx: PluginContext) {
	const settings = await getSettings(ctx);
	const auditCount = await readStateValue(ctx, "state:auditCount", 0);
	const lifecycleCount = await readStateValue(ctx, "state:lifecycleCount", 0);
	const publicHits = await readStateValue(ctx, "state:publicStatusHits", 0);
	const lastCronAt = await readStateValue(ctx, "state:lastCronAt", null);
	const lastLifecycle = await readStateValue(ctx, "state:lastLifecycle", null);
	const recent = await listAuditEvents(ctx, 5);

	return {
		plugin: { id: AWCMS_SIKESRA_PLUGIN_ID },
		settings,
		counters: {
			auditCount,
			lifecycleCount,
			publicHits,
		},
		lastCronAt,
		lastLifecycle,
		recentEvents: recent.items,
	};
}

async function writeSnapshot(
	ctx: PluginContext,
	collection: string,
	content: Record<string, unknown>,
) {
	const contentId = typeof content.id === "string" ? content.id : "unknown";
	const snapshotId = `${collection}:${contentId}:${Date.now()}`;
	await ctx.storage.sikesra_content_snapshots!.put(snapshotId, {
		collection,
		contentId,
		timestamp: toIsoNow(),
		slug: typeof content.slug === "string" ? content.slug : null,
		status: typeof content.status === "string" ? content.status : null,
	});
	return snapshotId;
}

async function appendAccessChangeEvent(ctx: PluginContext, record: ExampleAuditEvent) {
	await ctx.storage.sikesra_access_change_events!.put(record.id, record);
	await incrementCounter(ctx, "state:accessChangeCount");
	return record;
}

function touchUpdatedAt<T extends { updatedAt: string }>(value: T): T {
	return { ...value, updatedAt: toIsoNow() };
}

const AUDIT_REDACTED_VALUE = "[REDACTED]";
const AUDIT_SENSITIVE_KEY_PATTERN =
	/(nik|kia|nomor_kk|no_kk|phone|telepon|email|alamat|ktp|domisili|latitude|longitude|coordinate|storage_key|checksum|file_name|mime_type|raw_document|document_metadata)/i;

function redactAuditMetadata(value: unknown): unknown {
	if (Array.isArray(value)) return value.map((item) => redactAuditMetadata(item));
	if (!isRecord(value)) return value;

	return Object.fromEntries(
		Object.entries(value).map(([key, entry]) => [
			key,
			AUDIT_SENSITIVE_KEY_PATTERN.test(key) ? AUDIT_REDACTED_VALUE : redactAuditMetadata(entry),
		]),
	);
}

async function ensureAccessCatalogSeeded(ctx: PluginContext) {
	const existingPermissions = await ctx.storage.sikesra_permission_catalog!.count();
	if (existingPermissions === 0) {
		for (const item of DEFAULT_ACCESS_PERMISSIONS) {
			await ctx.storage.sikesra_permission_catalog!.put(item.slug, touchUpdatedAt(item));
		}
	}

	const existingRoles = await ctx.storage.sikesra_role_catalog!.count();
	if (existingRoles === 0) {
		for (const item of DEFAULT_ACCESS_ROLES) {
			await ctx.storage.sikesra_role_catalog!.put(item.slug, touchUpdatedAt(item));
		}
	}

	const existingRoleAssignments = await ctx.storage.sikesra_role_permission_assignments!.count();
	if (existingRoleAssignments === 0) {
		for (const item of DEFAULT_ROLE_ASSIGNMENTS) {
			await ctx.storage.sikesra_role_permission_assignments!.put(
				item.roleSlug,
				touchUpdatedAt(item),
			);
		}
	}

	const existingUserAssignments = await ctx.storage.sikesra_user_role_assignments!.count();
	if (existingUserAssignments === 0) {
		for (const item of DEFAULT_USER_ROLE_ASSIGNMENTS) {
			await ctx.storage.sikesra_user_role_assignments!.put(item.userId, touchUpdatedAt(item));
		}
		await persistStateValue(
			ctx,
			"state:lastPreviewUserId",
			DEFAULT_USER_ROLE_ASSIGNMENTS[0]?.userId ?? "",
		);
	}
}

async function ensureAbacCatalogSeeded(ctx: PluginContext) {
	const existingAttributes = await ctx.storage.sikesra_abac_attribute_catalog!.count();
	if (existingAttributes === 0) {
		for (const item of DEFAULT_ABAC_ATTRIBUTES) {
			await ctx.storage.sikesra_abac_attribute_catalog!.put(item.key, touchUpdatedAt(item));
		}
	}

	const existingSubjects = await ctx.storage.sikesra_abac_subject_assignments!.count();
	if (existingSubjects === 0) {
		for (const item of DEFAULT_ABAC_SUBJECTS) {
			await ctx.storage.sikesra_abac_subject_assignments!.put(item.subjectId, touchUpdatedAt(item));
		}
	}

	const existingResources = await ctx.storage.sikesra_abac_resource_assignments!.count();
	if (existingResources === 0) {
		for (const item of DEFAULT_ABAC_RESOURCES) {
			await ctx.storage.sikesra_abac_resource_assignments!.put(
				item.resourceId,
				touchUpdatedAt(item),
			);
		}
	}

	const existingPolicies = await ctx.storage.sikesra_abac_policy_rules!.count();
	if (existingPolicies === 0) {
		for (const item of DEFAULT_ABAC_POLICIES) {
			await ctx.storage.sikesra_abac_policy_rules!.put(item.id, touchUpdatedAt(item));
		}
	}

	await persistStateValue(
		ctx,
		"state:lastAbacPreviewSubjectId",
		DEFAULT_ABAC_SUBJECTS[0]?.subjectId ?? "",
	);
	await persistStateValue(
		ctx,
		"state:lastAbacPreviewResourceId",
		DEFAULT_ABAC_RESOURCES[0]?.resourceId ?? "",
	);
}

async function listCollectionValues<T>(
	collection: {
		query: (options?: any) => Promise<{ items: Array<{ id: string; data: unknown }> }>;
	},
	orderByField: string = "updatedAt",
): Promise<T[]> {
	const result = await collection.query({ orderBy: { [orderByField]: "desc" }, limit: 200 });
	return result.items.map((item) => item.data as T);
}

async function listPermissions(ctx: PluginContext) {
	return listCollectionValues<AccessPermission>(ctx.storage.sikesra_permission_catalog!);
}

async function listRoles(ctx: PluginContext) {
	return listCollectionValues<AccessRole>(ctx.storage.sikesra_role_catalog!);
}

async function listRoleAssignments(ctx: PluginContext) {
	return listCollectionValues<RolePermissionAssignment>(
		ctx.storage.sikesra_role_permission_assignments!,
	);
}

async function listUserRoleAssignments(ctx: PluginContext) {
	return listCollectionValues<UserRoleAssignment>(ctx.storage.sikesra_user_role_assignments!);
}

async function listAbacAttributes(ctx: PluginContext) {
	return listCollectionValues<AbacAttributeDefinition>(ctx.storage.sikesra_abac_attribute_catalog!);
}

async function listAbacPolicies(ctx: PluginContext) {
	return listCollectionValues<AbacPolicyRule>(ctx.storage.sikesra_abac_policy_rules!);
}

async function listAbacSubjects(ctx: PluginContext) {
	return listCollectionValues<AbacSubjectAssignment>(ctx.storage.sikesra_abac_subject_assignments!);
}

async function listAbacResources(ctx: PluginContext) {
	return listCollectionValues<AbacResourceAssignment>(
		ctx.storage.sikesra_abac_resource_assignments!,
	);
}

function getStringArray(value: unknown, key: string) {
	if (!isRecord(value)) return [];
	const candidate = value[key];
	if (!Array.isArray(candidate)) return [];
	return candidate.filter((item): item is string => typeof item === "string" && item.length > 0);
}

function getStringRecord(value: unknown, key: string): Record<string, string> {
	if (!isRecord(value)) return {};
	const candidate = value[key];
	if (!isRecord(candidate)) return {};
	const result: Record<string, string> = {};
	for (const [entryKey, entryValue] of Object.entries(candidate)) {
		if (typeof entryValue === "string" && entryValue.length > 0) result[entryKey] = entryValue;
	}
	return result;
}

async function summarizeAccessRights(ctx: PluginContext) {
	await ensureAccessCatalogSeeded(ctx);
	const permissions = await listPermissions(ctx);
	const roles = await listRoles(ctx);
	const roleAssignments = await listRoleAssignments(ctx);
	const userAssignments = await listUserRoleAssignments(ctx);
	const changeEvents = await listCollectionValues<ExampleAuditEvent>(
		ctx.storage.sikesra_access_change_events!,
		"timestamp",
	);

	const rolesWithoutPermissions = roles
		.filter(
			(role) =>
				!roleAssignments.some(
					(assignment) => assignment.roleSlug === role.slug && assignment.permissions.length > 0,
				),
		)
		.map((role) => role.slug);

	const usersWithoutRoles = userAssignments
		.filter((assignment) => assignment.roles.length === 0)
		.map((assignment) => assignment.userId);

	return {
		permissions,
		roles,
		roleAssignments,
		userAssignments,
		changeEvents,
		health: {
			permissionCount: permissions.length,
			roleCount: roles.length,
			assignmentCount: roleAssignments.length,
			userAssignmentCount: userAssignments.length,
			rolesWithoutPermissions,
			usersWithoutRoles,
		},
	};
}

function collectMissingAttributes(
	required: Record<string, string>,
	available: Record<string, string>,
) {
	return Object.entries(required)
		.filter(([key]) => available[key] === undefined)
		.map(([key]) => key);
}

function allAttributesMatch(required: Record<string, string>, available: Record<string, string>) {
	return Object.entries(required).every(([key, value]) => available[key] === value);
}

async function summarizeAbac(ctx: PluginContext) {
	await ensureAbacCatalogSeeded(ctx);
	const attributes = await listAbacAttributes(ctx);
	const policies = await listAbacPolicies(ctx);
	const subjects = await listAbacSubjects(ctx);
	const resources = await listAbacResources(ctx);
	const events = await listCollectionValues<ExampleAuditEvent>(
		ctx.storage.sikesra_abac_change_events!,
		"timestamp",
	);

	return {
		attributes,
		policies,
		subjects,
		resources,
		events,
		health: {
			attributeCount: attributes.length,
			policyCount: policies.length,
			subjectCount: subjects.length,
			resourceCount: resources.length,
			explicitDenyCount: policies.filter((policy) => policy.effect === "deny").length,
		},
	};
}

async function appendAbacChangeEvent(ctx: PluginContext, record: ExampleAuditEvent) {
	await ctx.storage.sikesra_abac_change_events!.put(record.id, record);
	await incrementCounter(ctx, "state:abacChangeCount");
	return record;
}

async function evaluateAbacDecision(ctx: PluginContext, input: unknown) {
	await ensureAbacCatalogSeeded(ctx);
	const subjectId = getString(input, "subjectId") ?? "";
	const resourceId = getString(input, "resourceId") ?? "";
	const action = getString(input, "action") ?? "";
	const contextAttributes = getStringRecord(input, "contextAttributes");

	if (!subjectId || !resourceId || !action) {
		return {
			allowed: false,
			reason: "Missing required ABAC input",
			matchedPolicyIds: [],
			effect: "deny",
			missingAttributes: [
				...(subjectId ? [] : ["subjectId"]),
				...(resourceId ? [] : ["resourceId"]),
				...(action ? [] : ["action"]),
			],
		};
	}

	const subject = (await ctx.storage.sikesra_abac_subject_assignments!.get(
		subjectId,
	)) as AbacSubjectAssignment | null;
	const resource = (await ctx.storage.sikesra_abac_resource_assignments!.get(
		resourceId,
	)) as AbacResourceAssignment | null;

	if (!subject || !resource) {
		return {
			allowed: false,
			reason: !subject
				? `No subject assignment found for ${subjectId}`
				: `No resource assignment found for ${resourceId}`,
			matchedPolicyIds: [],
			effect: "deny",
			missingAttributes: [],
		};
	}

	const policies = await listAbacPolicies(ctx);
	const relevantPolicies = policies.filter((policy) => policy.actions.includes(action));
	let missingAttributes: string[] = [];
	const matchedAllowPolicies: string[] = [];
	const matchedDenyPolicies: string[] = [];

	for (const policy of relevantPolicies) {
		const missing = [
			...collectMissingAttributes(policy.requiredSubject, subject.attributes),
			...collectMissingAttributes(policy.requiredResource, resource.attributes),
			...collectMissingAttributes(policy.requiredContext, contextAttributes),
		];
		if (missing.length > 0) {
			missingAttributes = [...new Set([...missingAttributes, ...missing])];
			continue;
		}

		const subjectMatch = allAttributesMatch(policy.requiredSubject, subject.attributes);
		const resourceMatch = allAttributesMatch(policy.requiredResource, resource.attributes);
		const contextMatch = allAttributesMatch(policy.requiredContext, contextAttributes);

		if (!(subjectMatch && resourceMatch && contextMatch)) continue;

		if (policy.effect === "deny") matchedDenyPolicies.push(policy.id);
		else matchedAllowPolicies.push(policy.id);
	}

	if (matchedDenyPolicies.length > 0) {
		return {
			allowed: false,
			reason: `Explicit deny from policy ${matchedDenyPolicies.join(", ")}`,
			matchedPolicyIds: matchedDenyPolicies,
			effect: "deny",
			missingAttributes,
		};
	}

	if (matchedAllowPolicies.length > 0) {
		return {
			allowed: true,
			reason: `Allowed by policy ${matchedAllowPolicies.join(", ")}`,
			matchedPolicyIds: matchedAllowPolicies,
			effect: "allow",
			missingAttributes,
		};
	}

	return {
		allowed: false,
		reason:
			missingAttributes.length > 0
				? `Missing required attributes: ${missingAttributes.join(", ")}`
				: `No matching allow policy for action ${action}`,
		matchedPolicyIds: [],
		effect: "deny",
		missingAttributes,
	};
}

async function previewAccess(ctx: PluginContext, input: unknown) {
	await ensureAccessCatalogSeeded(ctx);
	const userId = getString(input, "userId") ?? "";
	const permissionSlug = getString(input, "permissionSlug") ?? "";
	const reasonPrefix = !userId || !permissionSlug ? "Missing required preview input" : null;

	if (reasonPrefix) {
		return {
			allowed: false,
			reason: reasonPrefix,
			matchedRoles: [],
			effectivePermissions: [],
		};
	}

	const userAssignment = (await ctx.storage.sikesra_user_role_assignments!.get(
		userId,
	)) as UserRoleAssignment | null;
	if (!userAssignment || userAssignment.roles.length === 0) {
		return {
			allowed: false,
			reason: `No role assignment found for ${userId}`,
			matchedRoles: [],
			effectivePermissions: [],
		};
	}

	const assignments = await Promise.all(
		userAssignment.roles.map(
			async (roleSlug) =>
				((await ctx.storage.sikesra_role_permission_assignments!.get(
					roleSlug,
				)) as RolePermissionAssignment | null) ?? {
					roleSlug,
					permissions: [],
					updatedAt: "",
				},
		),
	);

	const effectivePermissions = [
		...new Set(assignments.flatMap((assignment) => assignment.permissions)),
	].toSorted();
	const matchedRoles = assignments
		.filter((assignment) => assignment.permissions.includes(permissionSlug))
		.map((assignment) => assignment.roleSlug);
	const allowed = matchedRoles.length > 0;

	return {
		allowed,
		reason: allowed
			? `Permission ${permissionSlug} granted by role ${matchedRoles.join(", ")}`
			: `Permission ${permissionSlug} not granted to ${userId}`,
		matchedRoles,
		effectivePermissions,
	};
}

async function requireRoutePermission(ctx: PluginContext, permissionSlug: string) {
	const userId = getRequestUserId(ctx);
	if (!userId) {
		return {
			allowed: false,
			error: { code: "UNAUTHENTICATED", message: "Trusted EmDash user identity is required." },
		};
	}

	const decision = await previewAccess(ctx, { userId, permissionSlug });
	if (decision.allowed) return { allowed: true };

	return {
		allowed: false,
		error: { code: "FORBIDDEN", message: decision.reason },
	};
}

const publicStatusRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	await incrementCounter(ctx, "state:publicStatusHits");
	const settings = await getSettings(ctx);

	if (!settings.sikesraPublicEnabled) {
		return {
			plugin: { id: AWCMS_SIKESRA_PLUGIN_ID, visibility: "public-safe" },
			status: settings.publicStatusLabel,
			governanceMode: settings.governanceMode,
			publicAggregate: {
				categories: [],
				caveat: "SIKESRA Public API is disabled.",
			},
		};
	}

	const state = await getVerificationStageState(ctx);

	const dataTypes =
		(await ctx.kv.get<SikesraParentType[]>("custom:data-types")) ?? DEFAULT_DATA_TYPES;
	const moduleTypes = dataTypes.map((t) => ({ code: t.id, label: t.label }));

	const smallCellThreshold = settings.smallCellThreshold;

	const entitiesList = await getRegistryEntities(ctx);

	const categories = moduleTypes.map((mod) => {
		const entities = entitiesList.filter((e) => e.entityType === mod.code);
		const eligibleEntities = entities.filter(
			(e) => e.sensitivity === "public_safe" || e.sensitivity === "internal",
		);
		const total = eligibleEntities.length;
		const verified = eligibleEntities.filter(
			(e) => (state[e.id] ?? e.verificationStage) === "active_verified",
		).length;
		const suppressed = total < smallCellThreshold;

		return {
			code: mod.code,
			label: mod.label,
			total: suppressed ? 0 : total,
			verified: suppressed ? 0 : verified,
			suppressed,
			suppressionReason: suppressed
				? `Count is below the configured small-cell threshold of ${smallCellThreshold}.`
				: null,
		};
	});

	return {
		plugin: { id: AWCMS_SIKESRA_PLUGIN_ID, visibility: "public-safe" },
		status: settings.publicStatusLabel,
		governanceMode: settings.governanceMode,
		publicAggregate: {
			categories,
			caveat:
				"Public aggregate only exposes coarse counts and suppresses sensitive details when counts are suppressed.",
		},
	};
};

const registryListRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.registry.read");
	if (!permission.allowed) return { success: false, error: permission.error };
	const entities = await getRegistryEntities(ctx);
	return { items: entities };
};

const registryArchiveListRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.registry.read");
	if (!permission.allowed) return { success: false, error: permission.error };
	const entities = (await getD1RegistryEntities(ctx, { includeDeleted: true })).filter(
		(entity) => entity.deletedAt,
	);
	return { items: entities };
};

const registrySaveRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.registry.create");
	if (!permission.allowed) return { success: false, error: permission.error };
	const input = routeCtx.input;
	if (!isRecord(input)) {
		throw new Error("Invalid input format");
	}
	const id = getString(input, "id") ?? `registry-entity-${Math.random().toString(36).slice(2, 10)}`;
	const sikesraId20 =
		getString(input, "sikesraId20") ??
		(await generateD1SikesraId20(ctx, {
			registryEntityId: id,
			villageCode: getString(input, "villageCode") ?? "",
			typeCode: getString(input, "typeCode") ?? "",
			subtypeCode: getString(input, "subtypeCode") ?? "",
			actor: actorFromRoute(ctx),
		}));
	const newEntity: SikesraReferenceRegistryEntity = {
		id,
		sikesraId20: sikesraId20 ?? undefined,
		code: getString(input, "code") ?? "",
		label: getString(input, "label") ?? "Untitled Registry Entity",
		entityType: getString(input, "entityType") ?? "rumah_ibadah",
		sensitivity: (getString(input, "sensitivity") as SikesraSensitivity) ?? "public_safe",
		region: {
			provinceCode: getString(input, "provinceCode") ?? "",
			regencyCode: getString(input, "regencyCode") ?? "",
			districtCode: getString(input, "districtCode") ?? "",
			villageCode: getString(input, "villageCode") ?? "",
		},
		verificationStage: "submitted_village",
		inputLevel:
			(getString(input, "inputLevel") as VerificationUserLevel | undefined) ?? "desa_kelurahan",
		supportingDocumentIds: [],
		publicSummary: getString(input, "publicSummary") ?? "",
	};

	await saveRegistryEntity(ctx, newEntity);

	await appendAuditEvent(
		ctx,
		createAuditRecord({
			kind: "registry.entity.create",
			scope: "registry",
			actor: actorFromRoute(ctx),
			summary: `Created SIKESRA registry entity ${newEntity.code} - ${newEntity.label}`,
			metadata: newEntity as unknown as Record<string, unknown>,
		}),
	);

	return { success: true, item: newEntity };
};

const registrySoftDeleteRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.registry.soft_delete");
	if (!permission.allowed) return { success: false, error: permission.error };
	const input = routeCtx.input;
	if (!isRecord(input)) throw new Error("Invalid input format");
	const id = getString(input, "id") ?? "";
	const reason = getString(input, "reason")?.trim() ?? "";
	if (!id || !reason) return createValidationError([...(id ? [] : ["id"]), ...(reason ? [] : ["reason"])]);
	const actor = getRequestUserId(ctx) ?? actorFromRoute(ctx);
	const deleted = await updateD1RegistryEntityDeletedAt(ctx, { id, deletedAt: toIsoNow(), actor });
	if (!deleted) return { success: false, error: { code: "NOT_FOUND", message: "Registry entity was not found." } };
	await appendAuditEvent(ctx, createAuditRecord({ kind: "crud.soft_delete", scope: "registry", actor, summary: `Soft deleted SIKESRA registry entity ${id}`, metadata: { id, reason } }));
	return { success: true, item: { id, deleted: true } };
};

const registryRestoreRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.registry.restore");
	if (!permission.allowed) return { success: false, error: permission.error };
	const input = routeCtx.input;
	if (!isRecord(input)) throw new Error("Invalid input format");
	const id = getString(input, "id") ?? "";
	const reason = getString(input, "reason")?.trim() ?? "";
	if (!id || !reason) return createValidationError([...(id ? [] : ["id"]), ...(reason ? [] : ["reason"])]);
	const actor = getRequestUserId(ctx) ?? actorFromRoute(ctx);
	const restored = await updateD1RegistryEntityDeletedAt(ctx, { id, deletedAt: null, actor });
	if (!restored) return { success: false, error: { code: "NOT_FOUND", message: "Registry entity was not found." } };
	await appendAuditEvent(ctx, createAuditRecord({ kind: "crud.restore", scope: "registry", actor, summary: `Restored SIKESRA registry entity ${id}`, metadata: { id, reason } }));
	return { success: true, item: { id, restored: true } };
};

const documentsListRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.document.read");
	if (!permission.allowed) return { success: false, error: permission.error };
	const docs = await getSupportingDocuments(ctx);
	return { items: docs };
};

const documentsSaveRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.document.upload");
	if (!permission.allowed) return { success: false, error: permission.error };
	const input = routeCtx.input;
	if (!isRecord(input)) {
		throw new Error("Invalid input format");
	}
	const sensitivity =
		(getString(input, "sensitivity") as SikesraSensitivity | undefined) ??
		(getString(input, "classification") as SikesraSensitivity | undefined) ??
		"public_safe";
	const newDoc: SikesraReferenceSupportingDocument = {
		id: getString(input, "id") ?? `doc-${Math.random().toString(36).slice(2, 10)}`,
		registryEntityId: getString(input, "registryEntityId") ?? "",
		documentType: getString(input, "documentType") ?? "surat_keterangan",
		title: getString(input, "title") ?? "Untitled Document",
		sensitivity,
		fileObjectId: getString(input, "fileObjectId"),
		contentType: getString(input, "contentType"),
		fileSizeBytes: getNumber(input, "fileSizeBytes"),
		checksumSha256: getString(input, "checksumSha256"),
		originalFilename: getString(input, "originalFilename"),
		safeFilename: getString(input, "safeFilename"),
		issuedAt: toIsoNow(),
		verifiedBy: actorFromRoute(ctx),
	};
	const invalidFields = validateSupportingDocumentInput(newDoc);
	if (invalidFields.length > 0) return createValidationError(invalidFields);

	await saveSupportingDocument(ctx, newDoc);

	await appendAuditEvent(
		ctx,
		createAuditRecord({
			kind: "document.create",
			scope: "documents",
			actor: actorFromRoute(ctx),
			summary: `Uploaded document ${newDoc.title} classification ${newDoc.sensitivity}`,
			metadata: newDoc as unknown as Record<string, unknown>,
		}),
	);

	return { success: true, item: newDoc };
};

const documentsAccessRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const input = routeCtx.input;
	if (!isRecord(input)) throw new Error("Invalid input format");
	const id = getString(input, "id") ?? "";
	if (!id) return createValidationError(["id"]);

	const doc = await findSupportingDocument(ctx, id);
	if (!doc) {
		return { success: false, error: { code: "NOT_FOUND", message: "Document not found." } };
	}

	const permissionSlug =
		doc.sensitivity === "public_safe" ? "sikesra.document.read" : "sikesra.document.read_restricted";
	const permission = await requireRoutePermission(ctx, permissionSlug);
	if (!permission.allowed) return { success: false, error: permission.error };

	await ensureDocumentAbacResource(ctx, doc);
	const userId = getRequestUserId(ctx) ?? "";
	const abac = await evaluateAbacDecision(ctx, {
		subjectId: userId,
		resourceId: doc.id,
		action: permissionSlug,
		contextAttributes: {},
	});
	if (!abac.allowed) {
		return { success: false, error: { code: "FORBIDDEN", message: abac.reason } };
	}

	if (doc.sensitivity !== "public_safe") {
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: "document.access.restricted",
				scope: "documents",
				actor: userId,
				summary: `Restricted document metadata accessed: ${doc.id}`,
				metadata: {
					documentId: doc.id,
					registryEntityId: doc.registryEntityId,
					classification: doc.sensitivity,
					matchedPolicyIds: abac.matchedPolicyIds,
				},
			}),
		);
	}

	return { success: true, item: toSafeDocumentAccessResponse(doc), access: { abac } };
};

const IMPORT_REQUIRED_FIELDS = [
	"code",
	"label",
	"entityType",
	"provinceCode",
	"regencyCode",
	"districtCode",
	"villageCode",
];

type ImportValidationIssue = { row: number; fields: string[] };
type StagedImportRow = {
	id: string;
	batchId: string;
	rowNumber: number;
	entityType: string;
	subtypeCode?: string;
	rawRow: Record<string, unknown>;
	mappedRow: Record<string, unknown>;
	validationStatus: "valid" | "invalid";
	validationErrors: string[];
	duplicateStatus: "unchecked" | "duplicate_risk" | "cleared";
	promotionStatus: "not_promoted" | "promoted";
	promotedRegistryEntityId?: string;
};

async function persistD1DuplicateCandidate(
	ctx: PluginContext,
	params: {
		id: string;
		sourceType: string;
		sourceId: string;
		candidateType: string;
		candidateId: string;
		entityType?: string;
		score: number;
		riskLevel: "medium" | "high";
		reasons: string[];
	},
) {
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.insertInto) return false;
	const now = toIsoNow();
	await db
		.insertInto(AWCMS_SIKESRA_DUPLICATE_CANDIDATES_TABLE)
		.values({
			tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
			site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
			id: params.id,
			source_type: params.sourceType,
			source_id: params.sourceId,
			candidate_type: params.candidateType,
			candidate_id: params.candidateId,
			entity_type: params.entityType ?? null,
			score: params.score,
			risk_level: params.riskLevel,
			reason_json: JSON.stringify(params.reasons),
			status: "open",
			created_at: now,
			updated_at: now,
			deleted_at: null,
			created_by: actorFromRoute(ctx),
			updated_by: actorFromRoute(ctx),
		})
		.onConflict((oc: any) =>
			oc.columns(["tenant_id", "site_id", "id"]).doUpdateSet({
				score: params.score,
				risk_level: params.riskLevel,
				reason_json: JSON.stringify(params.reasons),
				status: "open",
				updated_at: now,
				deleted_at: null,
				updated_by: actorFromRoute(ctx),
			}),
		)
		.execute();
	return true;
}

function validateImportRows(rows: unknown[]): ImportValidationIssue[] {
	return rows.flatMap((row, index) => {
		if (!isRecord(row)) return [{ row: index + 1, fields: ["row"] }];
		const fields = IMPORT_REQUIRED_FIELDS.filter((field) => !getString(row, field)?.trim());
		return fields.length > 0 ? [{ row: index + 1, fields }] : [];
	});
}

async function createD1ImportBatch(ctx: PluginContext, input: unknown) {
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.insertInto || !isRecord(input) || !Array.isArray(input.rows)) return null;
	const rows = input.rows;
	const now = toIsoNow();
	const batchId = getString(input, "batchId") ?? `import-batch-${Math.random().toString(36).slice(2, 10)}`;
	const firstRow = rows.find((row): row is Record<string, unknown> => isRecord(row));
	const entityType = getString(input, "entityType") ?? getString(firstRow, "entityType") ?? "unknown";
	const subtypeCode = getString(input, "subtypeCode") ?? getString(firstRow, "subtypeCode");
	const mappingTemplateId =
		getString(input, "mappingTemplateId") ?? `${batchId}:mapping-template`;
	const invalidRows = validateImportRows(rows);
	const invalidRowNumbers = new Set(invalidRows.map((row) => row.row));
	const actor = actorFromRoute(ctx);
	const seenCodes = new Map<string, number>();
	let duplicateRiskRows = 0;

	await db
		.insertInto(AWCMS_SIKESRA_IMPORT_MAPPING_TEMPLATES_TABLE)
		.values({
			tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
			site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
			id: mappingTemplateId,
			name: getString(input, "mappingTemplateName") ?? `Mapping for ${batchId}`,
			entity_type: entityType,
			subtype_code: subtypeCode ?? null,
			file_format: getString(input, "fileFormat") ?? "xlsx",
			mapping_json: JSON.stringify(isRecord(input.mapping) ? input.mapping : {}),
			status: "active",
			created_at: now,
			updated_at: now,
			deleted_at: null,
			created_by: actor,
			updated_by: actor,
		})
		.onConflict((oc: any) =>
			oc.columns(["tenant_id", "site_id", "id"]).doUpdateSet({
				mapping_json: JSON.stringify(isRecord(input.mapping) ? input.mapping : {}),
				updated_at: now,
				deleted_at: null,
				updated_by: actor,
			}),
		)
		.execute();

	await db
		.insertInto(AWCMS_SIKESRA_IMPORT_BATCHES_TABLE)
		.values({
			tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
			site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
			id: batchId,
			mapping_template_id: mappingTemplateId,
			entity_type: entityType,
			subtype_code: subtypeCode ?? null,
			file_object_id: getString(input, "fileObjectId") ?? null,
			status: invalidRows.length > 0 ? "validation_failed" : "validated",
			total_rows: rows.length,
			valid_rows: rows.length - invalidRows.length,
			invalid_rows: invalidRows.length,
			duplicate_risk_rows: 0,
			promoted_rows: 0,
			source_filename: getString(input, "sourceFilename") ?? null,
			error_summary_json: JSON.stringify({ invalidRows }),
			created_at: now,
			updated_at: now,
			deleted_at: null,
			created_by: actor,
			updated_by: actor,
		})
		.onConflict((oc: any) =>
			oc.columns(["tenant_id", "site_id", "id"]).doUpdateSet({
				status: invalidRows.length > 0 ? "validation_failed" : "validated",
				total_rows: rows.length,
				valid_rows: rows.length - invalidRows.length,
				invalid_rows: invalidRows.length,
				error_summary_json: JSON.stringify({ invalidRows }),
				updated_at: now,
				deleted_at: null,
				updated_by: actor,
			}),
		)
		.execute();

	for (const [index, row] of rows.entries()) {
		const rowNumber = index + 1;
		const rawRow = isRecord(row) ? row : { value: row };
		const rowEntityType = getString(rawRow, "entityType") ?? entityType;
		const rowSubtypeCode = getString(rawRow, "subtypeCode") ?? subtypeCode;
		const rowIssues = invalidRows.find((issue) => issue.row === rowNumber)?.fields ?? [];
		const code = getString(rawRow, "code");
		const duplicateRowNumber = code ? seenCodes.get(code) : undefined;
		const duplicateStatus = duplicateRowNumber ? "duplicate_risk" : "unchecked";
		if (code) seenCodes.set(code, rowNumber);
		if (duplicateRowNumber) {
			duplicateRiskRows++;
			await persistD1DuplicateCandidate(ctx, {
				id: `${batchId}:row:${rowNumber}:duplicate-code`,
				sourceType: "import_row",
				sourceId: `${batchId}:row:${rowNumber}`,
				candidateType: "import_row",
				candidateId: `${batchId}:row:${duplicateRowNumber}`,
				entityType: rowEntityType,
				score: 1,
				riskLevel: "high",
				reasons: [`Duplicate import code ${code} also appears on row ${duplicateRowNumber}`],
			});
		}
		await db
			.insertInto(AWCMS_SIKESRA_IMPORT_STAGING_ROWS_TABLE)
			.values({
				tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
				site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
				id: `${batchId}:row:${rowNumber}`,
				batch_id: batchId,
				row_number: rowNumber,
				entity_type: rowEntityType,
				subtype_code: rowSubtypeCode ?? null,
				raw_row_json: JSON.stringify(rawRow),
				mapped_row_json: JSON.stringify(rawRow),
				validation_status: invalidRowNumbers.has(rowNumber) ? "invalid" : "valid",
				validation_errors_json: JSON.stringify(rowIssues),
				duplicate_status: duplicateStatus,
				promotion_status: "not_promoted",
				promoted_registry_entity_id: null,
				created_at: now,
				updated_at: now,
				deleted_at: null,
				created_by: actor,
				updated_by: actor,
			})
			.onConflict((oc: any) =>
				oc.columns(["tenant_id", "site_id", "id"]).doUpdateSet({
					mapped_row_json: JSON.stringify(rawRow),
					validation_status: invalidRowNumbers.has(rowNumber) ? "invalid" : "valid",
					validation_errors_json: JSON.stringify(rowIssues),
					duplicate_status: duplicateStatus,
					promotion_status: "not_promoted",
					updated_at: now,
					deleted_at: null,
					updated_by: actor,
				}),
			)
			.execute();
	}

	if (duplicateRiskRows > 0) {
		await db
			.insertInto(AWCMS_SIKESRA_IMPORT_BATCHES_TABLE)
			.values({
				tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
				site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
				id: batchId,
				mapping_template_id: mappingTemplateId,
				entity_type: entityType,
				subtype_code: subtypeCode ?? null,
				file_object_id: getString(input, "fileObjectId") ?? null,
				status: "duplicate_review",
				total_rows: rows.length,
				valid_rows: rows.length - invalidRows.length,
				invalid_rows: invalidRows.length,
				duplicate_risk_rows: duplicateRiskRows,
				promoted_rows: 0,
				source_filename: getString(input, "sourceFilename") ?? null,
				error_summary_json: JSON.stringify({ invalidRows }),
				created_at: now,
				updated_at: now,
				deleted_at: null,
				created_by: actor,
				updated_by: actor,
			})
			.onConflict((oc: any) =>
				oc.columns(["tenant_id", "site_id", "id"]).doUpdateSet({
					status: "duplicate_review",
					duplicate_risk_rows: duplicateRiskRows,
					updated_at: now,
					updated_by: actor,
				}),
			)
			.execute();
	}

	return { batchId, mappingTemplateId, totalRows: rows.length, invalidRows, duplicateRiskRows };
}

async function getD1ImportStagingRows(ctx: PluginContext, batchId: string): Promise<StagedImportRow[]> {
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.selectFrom) return [] as StagedImportRow[];
	const rows = (await db
		.selectFrom(AWCMS_SIKESRA_IMPORT_STAGING_ROWS_TABLE)
		.select([
			"id",
			"batch_id",
			"row_number",
			"entity_type",
			"subtype_code",
			"raw_row_json",
			"mapped_row_json",
			"validation_status",
			"validation_errors_json",
			"duplicate_status",
			"promotion_status",
			"promoted_registry_entity_id",
		])
		.where("tenant_id", "=", AWCMS_SIKESRA_DEFAULT_TENANT_ID)
		.where("site_id", "=", AWCMS_SIKESRA_DEFAULT_SITE_ID)
		.where("batch_id", "=", batchId)
		.where("deleted_at", "is", null)
		.orderBy("row_number", "asc")
		.execute()) as Array<Record<string, unknown>>;

	return rows.map((row): StagedImportRow => ({
		id: String(row.id),
		batchId: String(row.batch_id),
		rowNumber: Number(row.row_number),
		entityType: String(row.entity_type),
		subtypeCode: typeof row.subtype_code === "string" ? row.subtype_code : undefined,
		rawRow: JSON.parse(String(row.raw_row_json ?? "{}")),
		mappedRow: JSON.parse(String(row.mapped_row_json ?? "{}")),
		validationStatus: row.validation_status === "valid" ? "valid" : "invalid",
		validationErrors: JSON.parse(String(row.validation_errors_json ?? "[]")),
		duplicateStatus:
			row.duplicate_status === "duplicate_risk" || row.duplicate_status === "cleared"
				? row.duplicate_status
				: "unchecked",
		promotionStatus: row.promotion_status === "promoted" ? "promoted" : "not_promoted",
		promotedRegistryEntityId:
			typeof row.promoted_registry_entity_id === "string"
				? row.promoted_registry_entity_id
				: undefined,
	}));
}

async function markD1ImportRowPromoted(ctx: PluginContext, row: StagedImportRow, registryEntityId: string) {
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.insertInto) return;
	const now = toIsoNow();
	await db
		.insertInto(AWCMS_SIKESRA_IMPORT_STAGING_ROWS_TABLE)
		.values({
			tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
			site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
			id: row.id,
			batch_id: row.batchId,
			row_number: row.rowNumber,
			entity_type: row.entityType,
			subtype_code: row.subtypeCode ?? null,
			raw_row_json: JSON.stringify(row.rawRow),
			mapped_row_json: JSON.stringify(row.mappedRow),
			validation_status: row.validationStatus,
			validation_errors_json: JSON.stringify(row.validationErrors),
			duplicate_status: row.duplicateStatus,
			promotion_status: "promoted",
			promoted_registry_entity_id: registryEntityId,
			created_at: now,
			updated_at: now,
			deleted_at: null,
			created_by: actorFromRoute(ctx),
			updated_by: actorFromRoute(ctx),
		})
		.onConflict((oc: any) =>
			oc.columns(["tenant_id", "site_id", "id"]).doUpdateSet({
				promotion_status: "promoted",
				promoted_registry_entity_id: registryEntityId,
				updated_at: now,
				updated_by: actorFromRoute(ctx),
			}),
		)
		.execute();
}

const importCreateRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.import.create");
	if (!permission.allowed) return { success: false, error: permission.error };
	const result = await createD1ImportBatch(ctx, routeCtx.input);
	if (!result) return { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid import rows." } };

	await appendAuditEvent(
		ctx,
		createAuditRecord({
			kind: "registry.import.create",
			scope: "registry",
			actor: actorFromRoute(ctx),
			summary: `Created SIKESRA import batch ${result.batchId}`,
			metadata: { batchId: result.batchId, totalRows: result.totalRows, invalidRows: result.invalidRows },
		}),
	);

	return { success: true, ...result };
};

const importPromoteRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.import.promote");
	if (!permission.allowed) return { success: false, error: permission.error };
	const input = routeCtx.input;
	if (!isRecord(input)) {
		throw new Error("Invalid input format");
	}
	let batchId = getString(input, "batchId");
	if (!batchId && Array.isArray(input.rows)) {
		const created = await createD1ImportBatch(ctx, input);
		batchId = created?.batchId;
	}
	if (!batchId) return { success: false, error: { code: "VALIDATION_ERROR", message: "Import batch is required before promotion." } };

	const stagedRows = await getD1ImportStagingRows(ctx, batchId);
	const invalidRows = stagedRows
		.filter((row) => row.validationStatus !== "valid")
		.map((row) => ({ row: row.rowNumber, fields: row.validationErrors }));
	if (invalidRows.length > 0) {
		return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: "Import promotion is blocked while staged rows have validation errors.",
				details: { invalidRows },
			},
		};
	}
	const duplicateRiskRows = stagedRows
		.filter((row) => row.duplicateStatus === "duplicate_risk")
		.map((row) => row.rowNumber);
	if (duplicateRiskRows.length > 0) {
		return {
			success: false,
			error: {
				code: "DUPLICATE_REVIEW_REQUIRED",
				message: "Duplicate-risk rows require a decision before promotion.",
				details: { duplicateRiskRows },
			},
		};
	}

	let count = 0;
	for (const stagedRow of stagedRows.filter((row) => row.promotionStatus !== "promoted")) {
		const row = stagedRow.mappedRow;
		const newEntity: SikesraReferenceRegistryEntity = {
			id: getString(row, "id") ?? `registry-entity-${Math.random().toString(36).slice(2, 10)}`,
			code: getString(row, "code")!,
			label: getString(row, "label")!,
			entityType: getString(row, "entityType")!,
			sensitivity:
				(getString(row, "sensitivity") as SikesraSensitivity | undefined) ?? "public_safe",
			region: {
				provinceCode: getString(row, "provinceCode")!,
				regencyCode: getString(row, "regencyCode")!,
				districtCode: getString(row, "districtCode")!,
				villageCode: getString(row, "villageCode")!,
			},
			verificationStage: "submitted_village",
			inputLevel:
				(getString(row, "inputLevel") as VerificationUserLevel | undefined) ?? "desa_kelurahan",
			supportingDocumentIds: [],
			publicSummary: getString(row, "publicSummary") ?? "",
		};
		await saveRegistryEntity(ctx, newEntity);
		await markD1ImportRowPromoted(ctx, stagedRow, newEntity.id);
		count++;
	}

	await appendAuditEvent(
		ctx,
		createAuditRecord({
			kind: "registry.import.promote",
			scope: "registry",
			actor: actorFromRoute(ctx),
			summary: `Promoted ${count} staged rows from Excel import to SIKESRA Registry`,
			metadata: { batchId, count },
		}),
	);

	return { success: true, batchId, count };
};

const duplicateDecisionRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.registry.update");
	if (!permission.allowed) return { success: false, error: permission.error };
	const input = routeCtx.input;
	if (!isRecord(input)) throw new Error("Invalid input format");
	const candidateId = getString(input, "candidateId") ?? "";
	const decision = getString(input, "decision") ?? "";
	const reason = getString(input, "reason") ?? "";
	if (!candidateId || !decision || !reason.trim()) {
		return createValidationError([
			...(candidateId ? [] : ["candidateId"]),
			...(decision ? [] : ["decision"]),
			...(reason.trim() ? [] : ["reason"]),
		]);
	}

	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.insertInto) {
		return { success: false, error: { code: "STORAGE_UNAVAILABLE", message: "D1 is required for duplicate decisions." } };
	}
	const now = toIsoNow();
	const actor = getRequestUserId(ctx) ?? actorFromRoute(ctx);
	const id = getString(input, "id") ?? `${candidateId}:decision:${Date.now()}`;
	const audit = createAuditRecord({
		kind: "duplicate.decision",
		scope: "duplicates",
		actor,
		summary: `Recorded duplicate decision ${decision} for ${candidateId}`,
		metadata: { candidateId, decision, reason },
	});
	await appendAuditEvent(ctx, audit);

	await db
		.insertInto(AWCMS_SIKESRA_DUPLICATE_DECISIONS_TABLE)
		.values({
			tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
			site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
			id,
			candidate_id: candidateId,
			decision,
			reason,
			decided_by: actor,
			decided_at: now,
			audit_event_id: audit.id,
			created_at: now,
			updated_at: now,
			deleted_at: null,
			created_by: actor,
			updated_by: actor,
		})
		.execute();

	return { success: true, item: { id, candidateId, decision, reason, decidedBy: actor, decidedAt: now } };
};

const EXPORT_SENSITIVE_FIELD_PATTERN =
	/(nik|kia|nomor_kk|no_kk|phone|telepon|email|alamat|ktp|domisili|latitude|longitude|coordinate|storage|checksum|document|file)/i;

function sanitizeExportFields(fields: string[], sensitivityLevel: string) {
	const uniqueFields = [...new Set(fields.map((field) => field.trim()).filter(Boolean))];
	if (sensitivityLevel === "public_safe") {
		return {
			allowedFields: uniqueFields.filter((field) => !EXPORT_SENSITIVE_FIELD_PATTERN.test(field)),
			excludedFields: uniqueFields.filter((field) => EXPORT_SENSITIVE_FIELD_PATTERN.test(field)),
		};
	}
	return { allowedFields: uniqueFields, excludedFields: [] as string[] };
}

async function persistD1ExportJob(
	ctx: PluginContext,
	params: {
		id: string;
		actorUserId: string | null;
		actorName: string | null;
		exportType: string;
		entityType: string | null;
		requestedFields: string[];
		filters: Record<string, unknown>;
		sensitivityLevel: string;
		reason: string | null;
		status: string;
		resultSummary: Record<string, unknown>;
	},
) {
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.insertInto) return false;
	const now = toIsoNow();
	await db
		.insertInto(AWCMS_SIKESRA_EXPORT_JOBS_TABLE)
		.values({
			tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
			site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
			id: params.id,
			actor_user_id: params.actorUserId,
			actor_name: params.actorName,
			export_type: params.exportType,
			entity_type: params.entityType,
			requested_fields_json: JSON.stringify(params.requestedFields),
			filters_json: JSON.stringify(params.filters),
			sensitivity_level: params.sensitivityLevel,
			reason: params.reason,
			status: params.status,
			file_object_id: null,
			result_summary_json: JSON.stringify(params.resultSummary),
			error_message: null,
			requested_at: now,
			completed_at: params.status === "completed" ? now : null,
			created_at: now,
			updated_at: now,
			deleted_at: null,
			created_by: params.actorUserId,
			updated_by: params.actorUserId,
		})
		.execute();
	return true;
}

async function listD1ExportJobs(ctx: PluginContext) {
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.selectFrom) return [];
	const rows = (await db
		.selectFrom(AWCMS_SIKESRA_EXPORT_JOBS_TABLE)
		.select([
			"id",
			"actor_user_id",
			"export_type",
			"requested_fields_json",
			"sensitivity_level",
			"reason",
			"status",
			"result_summary_json",
			"requested_at",
			"completed_at",
		])
		.where("tenant_id", "=", AWCMS_SIKESRA_DEFAULT_TENANT_ID)
		.where("site_id", "=", AWCMS_SIKESRA_DEFAULT_SITE_ID)
		.where("deleted_at", "is", null)
		.orderBy("requested_at", "desc")
		.execute()) as Array<Record<string, unknown>>;

	return rows.map((row) => ({
		id: String(row.id),
		actorUserId: typeof row.actor_user_id === "string" ? row.actor_user_id : undefined,
		exportType: String(row.export_type),
		requestedFields: JSON.parse(String(row.requested_fields_json ?? "[]")),
		sensitivityLevel: String(row.sensitivity_level),
		reason: typeof row.reason === "string" ? row.reason : undefined,
		status: String(row.status),
		resultSummary: JSON.parse(String(row.result_summary_json ?? "{}")),
		requestedAt: String(row.requested_at),
		completedAt: typeof row.completed_at === "string" ? row.completed_at : undefined,
	}));
}

const exportsCreateRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const createPermission = await requireRoutePermission(ctx, "sikesra.export.create");
	if (!createPermission.allowed) return { success: false, error: createPermission.error };
	const input = routeCtx.input;
	if (!isRecord(input)) throw new Error("Invalid input format");
	const requestedFields = Array.isArray(input.requestedFields)
		? input.requestedFields.filter((field): field is string => typeof field === "string")
		: [];
	const sensitivityLevel = getString(input, "sensitivityLevel") ?? "public_safe";
	const reason = getString(input, "reason")?.trim() ?? "";
	if (requestedFields.length === 0) return createValidationError(["requestedFields"]);
	if (sensitivityLevel !== "public_safe" && !reason) return createValidationError(["reason"]);

	if (sensitivityLevel !== "public_safe") {
		const restrictedPermission = await requireRoutePermission(ctx, "sikesra.export.restricted");
		if (!restrictedPermission.allowed) return { success: false, error: restrictedPermission.error };
	}

	const actorUserId = getRequestUserId(ctx);
	const req = (ctx as any).request as Request | undefined;
	const actorName = req?.headers.get("X-Sikesra-User-Name") ?? actorUserId;
	const id = getString(input, "id") ?? `export-${Math.random().toString(36).slice(2, 10)}`;
	const exportType = getString(input, "exportType") ?? "report";
	const filters = isRecord(input.filters) ? input.filters : {};
	const sanitized = sanitizeExportFields(requestedFields, sensitivityLevel);
	const resultSummary = {
		allowedFields: sanitized.allowedFields,
		excludedFields: sanitized.excludedFields,
		maskingPolicy: sensitivityLevel === "public_safe" ? "exclude_sensitive_fields" : "restricted_permission_required",
	};

	await persistD1ExportJob(ctx, {
		id,
		actorUserId,
		actorName,
		exportType,
		entityType: getString(input, "entityType") ?? null,
		requestedFields,
		filters,
		sensitivityLevel,
		reason: reason || null,
		status: "completed",
		resultSummary,
	});
	await appendAuditEvent(
		ctx,
		createAuditRecord({
			kind: "export.create",
			scope: "exports",
			actor: actorUserId ?? actorFromRoute(ctx),
			summary: `Created SIKESRA export job ${id}`,
			metadata: { id, exportType, sensitivityLevel, requestedFields, resultSummary },
		}),
	);

	return { success: true, item: { id, exportType, sensitivityLevel, status: "completed", resultSummary } };
};

const exportsListRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.report.read");
	if (!permission.allowed) return { success: false, error: permission.error };
	return { items: await listD1ExportJobs(ctx) };
};

const CUSTOM_ATTRIBUTE_SCOPE_TYPES = [
	"global",
	"entity_type",
	"subtype",
	"registry_entity",
	"sikesra_id_20",
	"region_scope",
	"organization_scope",
	"program_scope",
] as const;
const CUSTOM_ATTRIBUTE_DATA_TYPES = [
	"string",
	"number",
	"boolean",
	"date",
	"datetime",
	"enum",
	"multi_enum",
	"json",
	"text",
	"url",
	"email",
	"phone",
	"region_code",
	"file_reference",
] as const;
const CUSTOM_ATTRIBUTE_DATA_CLASSES = [
	"non_personal",
	"personal",
	"sensitive_personal",
	"restricted",
] as const;
const CUSTOM_ATTRIBUTE_PROTECTED_KEYS = new Set([
	"id",
	"tenant_id",
	"site_id",
	"sikesra_id_20",
	"verification_stage",
	"created_at",
	"updated_at",
]);

function getBooleanFromInput(value: unknown, key: string, fallback = false) {
	return getBoolean(value, key) ?? fallback;
}

function normalizeCustomAttributeValue(value: unknown) {
	if (typeof value === "string") return { valueText: value, valueDisplay: value };
	if (typeof value === "number") return { valueNumber: value, valueDisplay: String(value) };
	if (typeof value === "boolean") return { valueBoolean: value, valueDisplay: value ? "true" : "false" };
	return { valueJson: value, valueDisplay: value == null ? "" : JSON.stringify(value) };
}

async function appendCustomAttributeChangeEvent(
	ctx: PluginContext,
	params: { eventType: string; definitionId?: string; valueId?: string; summary: string; metadata: Record<string, unknown> },
) {
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.insertInto) return;
	const now = toIsoNow();
	const actor = getRequestUserId(ctx) ?? actorFromRoute(ctx);
	await db
		.insertInto(AWCMS_SIKESRA_CUSTOM_ATTRIBUTE_CHANGE_EVENTS_TABLE)
		.values({
			tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
			site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
			id: `${now}:${params.eventType}:${Math.random().toString(36).slice(2, 8)}`,
			event_type: params.eventType,
			definition_id: params.definitionId ?? null,
			value_id: params.valueId ?? null,
			actor_user_id: actor,
			summary: params.summary,
			metadata_json: JSON.stringify(redactAuditMetadata(params.metadata)),
			created_at: now,
			updated_at: now,
			deleted_at: null,
			created_by: actor,
			updated_by: actor,
		})
		.execute();
}

async function listD1CustomAttributeDefinitions(ctx: PluginContext) {
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.selectFrom) return [];
	const rows = (await db
		.selectFrom(AWCMS_SIKESRA_CUSTOM_ATTRIBUTE_DEFINITIONS_TABLE)
		.select([
			"id",
			"attribute_key",
			"label",
			"scope_type",
			"scope_value",
			"entity_type",
			"subtype_code",
			"target_registry_entity_id",
			"target_sikesra_id_20",
			"data_class",
			"data_type",
			"public_safe",
			"mask_by_default",
			"is_active",
		])
		.where("tenant_id", "=", AWCMS_SIKESRA_DEFAULT_TENANT_ID)
		.where("site_id", "=", AWCMS_SIKESRA_DEFAULT_SITE_ID)
		.where("deleted_at", "is", null)
		.execute()) as Array<Record<string, unknown>>;
	return rows.map((row) => ({
		id: String(row.id),
		key: String(row.attribute_key),
		label: String(row.label),
		scope: String(row.scope_type),
		scopeValue: typeof row.scope_value === "string" ? row.scope_value : undefined,
		entityType: typeof row.entity_type === "string" ? row.entity_type : undefined,
		subtypeCode: typeof row.subtype_code === "string" ? row.subtype_code : undefined,
		targetRegistryEntityId: typeof row.target_registry_entity_id === "string" ? row.target_registry_entity_id : undefined,
		targetSikesraId20: typeof row.target_sikesra_id_20 === "string" ? row.target_sikesra_id_20 : undefined,
		dataClass: String(row.data_class),
		dataType: String(row.data_type),
		publicSafe: row.public_safe === 1,
		maskByDefault: row.mask_by_default !== 0,
		isActive: row.is_active !== 0,
	}));
}

const customAttributeDefinitionsListRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.custom_attribute.read");
	if (!permission.allowed) return { success: false, error: permission.error };
	return { items: await listD1CustomAttributeDefinitions(ctx) };
};

const customAttributeDefinitionsSaveRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const input = routeCtx.input;
	if (!isRecord(input)) throw new Error("Invalid input format");
	const permission = await requireRoutePermission(ctx, getString(input, "id") ? "sikesra.custom_attribute.update" : "sikesra.custom_attribute.create");
	if (!permission.allowed) return { success: false, error: permission.error };
	const key = getString(input, "key") ?? getString(input, "attributeKey") ?? "";
	const scope = getString(input, "scope") ?? getString(input, "scopeType") ?? "global";
	const dataClass = getString(input, "dataClass") ?? "non_personal";
	const dataType = getString(input, "dataType") ?? "string";
	const invalidFields = [
		...(key && !CUSTOM_ATTRIBUTE_PROTECTED_KEYS.has(key) ? [] : ["key"]),
		...(CUSTOM_ATTRIBUTE_SCOPE_TYPES.includes(scope as any) ? [] : ["scope"]),
		...(CUSTOM_ATTRIBUTE_DATA_CLASSES.includes(dataClass as any) ? [] : ["dataClass"]),
		...(CUSTOM_ATTRIBUTE_DATA_TYPES.includes(dataType as any) ? [] : ["dataType"]),
		...(getBooleanFromInput(input, "publicSafe") && dataClass !== "non_personal" ? ["publicSafe"] : []),
	];
	if (invalidFields.length > 0) return createValidationError(invalidFields);

	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.insertInto) return { success: false, error: { code: "STORAGE_UNAVAILABLE", message: "D1 is required for custom attributes." } };
	const now = toIsoNow();
	const actor = getRequestUserId(ctx) ?? actorFromRoute(ctx);
	const id = getString(input, "id") ?? `custom-attribute-${Math.random().toString(36).slice(2, 10)}`;
	await db
		.insertInto(AWCMS_SIKESRA_CUSTOM_ATTRIBUTE_DEFINITIONS_TABLE)
		.values({
			tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
			site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
			id,
			attribute_key: key,
			label: getString(input, "label") ?? key,
			description: getString(input, "description") ?? null,
			scope_type: scope,
			scope_value: getString(input, "scopeValue") ?? null,
			entity_type: getString(input, "entityType") ?? null,
			subtype_code: getString(input, "subtypeCode") ?? null,
			target_registry_entity_id: getString(input, "targetRegistryEntityId") ?? null,
			target_sikesra_id_20: getString(input, "targetSikesraId20") ?? null,
			field_group: getString(input, "fieldGroup") ?? null,
			data_class: dataClass,
			data_type: dataType,
			required: getBooleanFromInput(input, "required") ? 1 : 0,
			default_value_json: JSON.stringify(input.defaultValue ?? null),
			enum_values_json: JSON.stringify(Array.isArray(input.enumValues) ? input.enumValues : []),
			validation_rules_json: JSON.stringify(isRecord(input.validationRules) ? input.validationRules : {}),
			placeholder: getString(input, "placeholder") ?? null,
			help_text: getString(input, "helpText") ?? null,
			sort_order: getNumber(input, "sortOrder") ?? 0,
			is_active: getBooleanFromInput(input, "isActive", true) ? 1 : 0,
			is_system: getBooleanFromInput(input, "isSystem") ? 1 : 0,
			is_searchable: getBooleanFromInput(input, "isSearchable") ? 1 : 0,
			is_filterable: getBooleanFromInput(input, "isFilterable") ? 1 : 0,
			is_importable: getBooleanFromInput(input, "isImportable") ? 1 : 0,
			is_exportable: getBooleanFromInput(input, "isExportable") ? 1 : 0,
			public_safe: getBooleanFromInput(input, "publicSafe") ? 1 : 0,
			mask_by_default: getBooleanFromInput(input, "maskByDefault", dataClass !== "non_personal") ? 1 : 0,
			valid_from: getString(input, "validFrom") ?? null,
			valid_until: getString(input, "validUntil") ?? null,
			created_at: now,
			updated_at: now,
			deleted_at: null,
			created_by: actor,
			updated_by: actor,
		})
		.onConflict((oc: any) =>
			oc.columns(["tenant_id", "site_id", "id"]).doUpdateSet({ label: getString(input, "label") ?? key, updated_at: now, updated_by: actor }),
		)
		.execute();
	await appendCustomAttributeChangeEvent(ctx, {
		eventType: getString(input, "id") ? "custom_attribute.definition.update" : "custom_attribute.definition.create",
		definitionId: id,
		summary: `Saved custom attribute definition ${key}`,
		metadata: { id, key, scope, dataClass, dataType },
	});
	await appendAuditEvent(ctx, createAuditRecord({ kind: "custom_attribute.definition.save", scope: "custom_attributes", actor, summary: `Saved custom attribute definition ${key}`, metadata: { id, key, dataClass } }));
	return { success: true, item: { id, key, label: getString(input, "label") ?? key, scope, dataClass, dataType } };
};

const customAttributeValuesSaveRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const input = routeCtx.input;
	if (!isRecord(input)) throw new Error("Invalid input format");
	const permission = await requireRoutePermission(ctx, "sikesra.custom_attribute.update");
	if (!permission.allowed) return { success: false, error: permission.error };
	const definitionId = getString(input, "definitionId") ?? "";
	const registryEntityId = getString(input, "registryEntityId") ?? getString(input, "ownerId") ?? "";
	if (!definitionId || !registryEntityId) return createValidationError([...(definitionId ? [] : ["definitionId"]), ...(registryEntityId ? [] : ["registryEntityId"])]);
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.insertInto) return { success: false, error: { code: "STORAGE_UNAVAILABLE", message: "D1 is required for custom attributes." } };
	const definitions = await listD1CustomAttributeDefinitions(ctx);
	const definition = definitions.find((item) => item.id === definitionId);
	const normalized = normalizeCustomAttributeValue(input.value);
	const now = toIsoNow();
	const actor = getRequestUserId(ctx) ?? actorFromRoute(ctx);
	const id = getString(input, "id") ?? `${registryEntityId}:${definitionId}`;
	await db
		.insertInto(AWCMS_SIKESRA_CUSTOM_ATTRIBUTE_VALUES_TABLE)
		.values({
			tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
			site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
			id,
			attribute_definition_id: definitionId,
			registry_entity_id: registryEntityId,
			sikesra_id_20: getString(input, "sikesraId20") ?? null,
			value_text: normalized.valueText ?? null,
			value_number: normalized.valueNumber ?? null,
			value_boolean: normalized.valueBoolean == null ? null : normalized.valueBoolean ? 1 : 0,
			value_date: getString(input, "valueDate") ?? null,
			value_datetime: getString(input, "valueDatetime") ?? null,
			value_json: normalized.valueJson === undefined ? null : JSON.stringify(normalized.valueJson),
			value_hash: null,
			value_display: normalized.valueDisplay,
			sensitivity: definition?.dataClass ?? "sensitive_personal",
			is_current: 1,
			version: 1,
			source: getString(input, "source") ?? "manual",
			verification_stage: getString(input, "verificationStage") ?? null,
			verified_at: null,
			verified_by: null,
			created_at: now,
			updated_at: now,
			deleted_at: null,
			created_by: actor,
			updated_by: actor,
		})
		.onConflict((oc: any) => oc.columns(["tenant_id", "site_id", "id"]).doUpdateSet({ value_display: normalized.valueDisplay, updated_at: now, updated_by: actor }))
		.execute();
	await appendCustomAttributeChangeEvent(ctx, { eventType: "custom_attribute.value.update", definitionId, valueId: id, summary: `Saved custom attribute value ${id}`, metadata: { id, definitionId, registryEntityId, value: input.value } });
	await appendAuditEvent(ctx, createAuditRecord({ kind: "custom_attribute.value.save", scope: "custom_attributes", actor, summary: `Saved custom attribute value ${id}`, metadata: { id, definitionId, registryEntityId, value: input.value } }));
	return { success: true, item: { id, definitionId, registryEntityId, valueDisplay: normalized.valueDisplay } };
};

const customAttributeValuesListRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.custom_attribute.read");
	if (!permission.allowed) return { success: false, error: permission.error };
	const sensitivePermission = await requireRoutePermission(ctx, "sikesra.custom_attribute.read_sensitive");
	const canReadSensitive = sensitivePermission.allowed;
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.selectFrom) return { items: [] };
	const definitions = await listD1CustomAttributeDefinitions(ctx);
	const definitionById = new Map(definitions.map((definition) => [definition.id, definition]));
	const rows = (await db
		.selectFrom(AWCMS_SIKESRA_CUSTOM_ATTRIBUTE_VALUES_TABLE)
		.select([
			"id",
			"attribute_definition_id",
			"registry_entity_id",
			"sikesra_id_20",
			"value_display",
			"sensitivity",
			"is_current",
		])
		.where("tenant_id", "=", AWCMS_SIKESRA_DEFAULT_TENANT_ID)
		.where("site_id", "=", AWCMS_SIKESRA_DEFAULT_SITE_ID)
		.where("deleted_at", "is", null)
		.execute()) as Array<Record<string, unknown>>;
	return {
		items: rows.map((row) => {
			const definition = definitionById.get(String(row.attribute_definition_id));
			const masked = !canReadSensitive && (definition?.maskByDefault || row.sensitivity !== "non_personal");
			return {
				id: String(row.id),
				definitionId: String(row.attribute_definition_id),
				registryEntityId: typeof row.registry_entity_id === "string" ? row.registry_entity_id : undefined,
				sikesraId20: typeof row.sikesra_id_20 === "string" ? row.sikesra_id_20 : undefined,
				valueDisplay: masked ? AUDIT_REDACTED_VALUE : String(row.value_display ?? ""),
				sensitivity: String(row.sensitivity),
				masked,
			};
		}),
	};
};

const SIKESRA_OWNED_DELETE_TABLES = new Set(AWCMS_SIKESRA_D1_TABLE_NAMES);

const permanentDeleteRequestRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const input = routeCtx.input;
	if (!isRecord(input)) throw new Error("Invalid input format");
	const targetTable = getString(input, "targetTable") ?? "";
	const targetRecordId = getString(input, "targetRecordId") ?? "";
	const targetType = getString(input, "targetType") ?? "registry_entity";
	const reason = getString(input, "reason")?.trim() ?? "";
	const confirmation = getString(input, "confirmation") ?? "";
	const invalidFields = [
		...(SIKESRA_OWNED_DELETE_TABLES.has(targetTable as any) ? [] : ["targetTable"]),
		...(targetRecordId ? [] : ["targetRecordId"]),
		...(reason ? [] : ["reason"]),
		...(confirmation === "PERMANENT DELETE" ? [] : ["confirmation"]),
	];
	if (targetTable.startsWith("_emdash") || targetTable.includes("user")) invalidFields.push("targetTable");
	if (invalidFields.length > 0) return createValidationError([...new Set(invalidFields)]);

	const permission = await requireRoutePermission(ctx, "sikesra.permanent_delete.execute");
	if (!permission.allowed) return { success: false, error: permission.error };

	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.insertInto) return { success: false, error: { code: "STORAGE_UNAVAILABLE", message: "D1 is required for delete governance." } };
	const now = toIsoNow();
	const actor = getRequestUserId(ctx) ?? actorFromRoute(ctx);
	const id = getString(input, "id") ?? `delete-request-${Math.random().toString(36).slice(2, 10)}`;
	const snapshotId = `${id}:snapshot`;
	await db
		.insertInto(AWCMS_SIKESRA_DELETE_REQUESTS_TABLE)
		.values({
			tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
			site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
			id,
			target_table: targetTable,
			target_record_id: targetRecordId,
			target_sikesra_id_20: getString(input, "targetSikesraId20") ?? null,
			target_type: targetType,
			operation_type: "permanent_delete",
			reason,
			risk_level: "high",
			requested_by: actor,
			requested_at: now,
			status: "requested",
			expires_at: null,
			created_at: now,
			updated_at: now,
			deleted_at: null,
			created_by: actor,
			updated_by: actor,
		})
		.execute();
	const snapshot = { targetTable, targetRecordId, targetType, capturedAt: now, pendingIntegrityCheck: true };
	await db
		.insertInto(AWCMS_SIKESRA_DELETE_SNAPSHOTS_TABLE)
		.values({
			tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
			site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
			id: snapshotId,
			delete_request_id: id,
			target_table: targetTable,
			target_record_id: targetRecordId,
			snapshot_json: JSON.stringify(snapshot),
			related_records_json: "[]",
			checksum: null,
			created_by: actor,
			created_at: now,
			updated_at: now,
			deleted_at: null,
		})
		.execute();
	await db
		.insertInto(AWCMS_SIKESRA_DELETE_EVENTS_TABLE)
		.values({
			tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
			site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
			id: `${id}:requested`,
			delete_request_id: id,
			event_kind: "crud.permanent_delete.request",
			actor_user_id: actor,
			summary: `Permanent delete requested for ${targetTable}/${targetRecordId}`,
			metadata_json: JSON.stringify({ targetTable, targetRecordId, reason }),
			created_at: now,
			updated_at: now,
			deleted_at: null,
			created_by: actor,
			updated_by: actor,
		})
		.execute();
	await appendAuditEvent(ctx, createAuditRecord({ kind: "crud.permanent_delete.request", scope: "crud", actor, summary: `Permanent delete requested for ${targetTable}/${targetRecordId}`, metadata: { id, targetTable, targetRecordId, reason } }));
	return { success: true, item: { id, snapshotId, targetTable, targetRecordId, status: "requested" } };
};

const permanentDeleteRequestsListRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.permanent_delete.review");
	if (!permission.allowed) return { success: false, error: permission.error };
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.selectFrom) return { items: [] };
	const rows = (await db
		.selectFrom(AWCMS_SIKESRA_DELETE_REQUESTS_TABLE)
		.select([
			"id",
			"target_table",
			"target_record_id",
			"target_sikesra_id_20",
			"target_type",
			"operation_type",
			"reason",
			"risk_level",
			"requested_by",
			"requested_at",
			"status",
		])
		.where("tenant_id", "=", AWCMS_SIKESRA_DEFAULT_TENANT_ID)
		.where("site_id", "=", AWCMS_SIKESRA_DEFAULT_SITE_ID)
		.where("deleted_at", "is", null)
		.orderBy("requested_at", "desc")
		.execute()) as Array<Record<string, unknown>>;
	return {
		items: rows.map((row) => ({
			id: String(row.id),
			targetTable: String(row.target_table),
			targetRecordId: String(row.target_record_id),
			targetSikesraId20: typeof row.target_sikesra_id_20 === "string" ? row.target_sikesra_id_20 : undefined,
			targetType: String(row.target_type),
			operationType: String(row.operation_type),
			reason: String(row.reason),
			riskLevel: String(row.risk_level),
			requestedBy: String(row.requested_by),
			requestedAt: String(row.requested_at),
			status: String(row.status),
		})),
	};
};

const permanentDeleteApproveRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.permanent_delete.approve");
	if (!permission.allowed) return { success: false, error: permission.error };
	const input = routeCtx.input;
	if (!isRecord(input)) throw new Error("Invalid input format");
	const deleteRequestId = getString(input, "deleteRequestId") ?? "";
	const decision = getString(input, "decision") ?? "approved";
	const notes = getString(input, "notes") ?? "";
	const invalidFields = [
		...(deleteRequestId ? [] : ["deleteRequestId"]),
		...(["approved", "rejected"].includes(decision) ? [] : ["decision"]),
		...(decision === "rejected" && !notes.trim() ? ["notes"] : []),
	];
	if (invalidFields.length > 0) return createValidationError(invalidFields);
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.insertInto || !db?.selectFrom) return { success: false, error: { code: "STORAGE_UNAVAILABLE", message: "D1 is required for delete governance." } };
	const requestRows = (await db
		.selectFrom(AWCMS_SIKESRA_DELETE_REQUESTS_TABLE)
		.select(["id", "target_table", "target_record_id", "target_type", "reason", "risk_level", "requested_by", "requested_at", "status"])
		.where("tenant_id", "=", AWCMS_SIKESRA_DEFAULT_TENANT_ID)
		.where("site_id", "=", AWCMS_SIKESRA_DEFAULT_SITE_ID)
		.where("id", "=", deleteRequestId)
		.execute()) as Array<Record<string, unknown>>;
	const requestRow = requestRows[0];
	if (!requestRow) return { success: false, error: { code: "NOT_FOUND", message: "Delete request was not found." } };
	const now = toIsoNow();
	const actor = getRequestUserId(ctx) ?? actorFromRoute(ctx);
	const approvalId = getString(input, "id") ?? `${deleteRequestId}:approval:${decision}`;
	await db
		.insertInto(AWCMS_SIKESRA_DELETE_APPROVALS_TABLE)
		.values({
			tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
			site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
			id: approvalId,
			delete_request_id: deleteRequestId,
			approval_level: "super_admin",
			approved_by: actor,
			approved_at: now,
			decision,
			notes,
			created_at: now,
			updated_at: now,
			deleted_at: null,
			created_by: actor,
			updated_by: actor,
		})
		.execute();
	await db
		.insertInto(AWCMS_SIKESRA_DELETE_REQUESTS_TABLE)
		.values({
			...requestRow,
			tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
			site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
			id: deleteRequestId,
			status: decision,
			updated_at: now,
			updated_by: actor,
		})
		.onConflict((oc: any) =>
			oc.columns(["tenant_id", "site_id", "id"]).doUpdateSet({
				status: decision,
				updated_at: now,
				updated_by: actor,
			}),
		)
		.execute();
	await db
		.insertInto(AWCMS_SIKESRA_DELETE_EVENTS_TABLE)
		.values({
			tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
			site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
			id: `${approvalId}:event`,
			delete_request_id: deleteRequestId,
			event_kind: decision === "approved" ? "crud.permanent_delete.approve" : "crud.permanent_delete.reject",
			actor_user_id: actor,
			summary: `Permanent delete request ${deleteRequestId} ${decision}`,
			metadata_json: JSON.stringify({ deleteRequestId, decision, notes }),
			created_at: now,
			updated_at: now,
			deleted_at: null,
			created_by: actor,
			updated_by: actor,
		})
		.execute();
	await appendAuditEvent(ctx, createAuditRecord({ kind: decision === "approved" ? "crud.permanent_delete.approve" : "crud.permanent_delete.reject", scope: "crud", actor, summary: `Permanent delete request ${deleteRequestId} ${decision}`, metadata: { deleteRequestId, decision, notes } }));
	return { success: true, item: { id: approvalId, deleteRequestId, decision } };
};

const permanentDeleteExecuteRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.permanent_delete.execute");
	if (!permission.allowed) return { success: false, error: permission.error };
	const input = routeCtx.input;
	if (!isRecord(input)) throw new Error("Invalid input format");
	const deleteRequestId = getString(input, "deleteRequestId") ?? "";
	const confirmation = getString(input, "confirmation") ?? "";
	if (!deleteRequestId || confirmation !== "PERMANENT DELETE") {
		return createValidationError([
			...(deleteRequestId ? [] : ["deleteRequestId"]),
			...(confirmation === "PERMANENT DELETE" ? [] : ["confirmation"]),
		]);
	}
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.selectFrom || !db?.insertInto) return { success: false, error: { code: "STORAGE_UNAVAILABLE", message: "D1 is required for delete governance." } };
	const requestRows = (await db
		.selectFrom(AWCMS_SIKESRA_DELETE_REQUESTS_TABLE)
		.select(["id", "target_table", "target_record_id", "target_type", "status"])
		.where("tenant_id", "=", AWCMS_SIKESRA_DEFAULT_TENANT_ID)
		.where("site_id", "=", AWCMS_SIKESRA_DEFAULT_SITE_ID)
		.where("id", "=", deleteRequestId)
		.execute()) as Array<Record<string, unknown>>;
	const requestRow = requestRows[0];
	if (!requestRow) return { success: false, error: { code: "NOT_FOUND", message: "Delete request was not found." } };
	if (requestRow.status !== "approved") return { success: false, error: { code: "DELETE_NOT_APPROVED", message: "Permanent delete request must be approved before execution." } };
	const targetTable = String(requestRow.target_table ?? "");
	const targetRecordId = String(requestRow.target_record_id ?? "");
	const blockedFields = [
		...(SIKESRA_OWNED_DELETE_TABLES.has(targetTable as any) ? [] : ["targetTable"]),
		...(targetTable.startsWith("_emdash") || targetTable.includes("user") ? ["targetTable"] : []),
	];
	if (blockedFields.length > 0) return createValidationError([...new Set(blockedFields)]);
	if (targetTable === AWCMS_SIKESRA_AUDIT_TABLE) {
		return { success: false, error: { code: "AUDIT_RETENTION_PURGE_REQUIRED", message: "Audit events require the retention purge workflow, not ordinary permanent delete." } };
	}
	const blockingReferences: string[] = [];
	if (targetTable === AWCMS_SIKESRA_REGISTRY_ENTITIES_TABLE) {
		const documents = (await db
			.selectFrom(AWCMS_SIKESRA_SUPPORTING_DOCUMENTS_TABLE)
			.select(["id"])
			.where("tenant_id", "=", AWCMS_SIKESRA_DEFAULT_TENANT_ID)
			.where("site_id", "=", AWCMS_SIKESRA_DEFAULT_SITE_ID)
			.where("registry_entity_id", "=", targetRecordId)
			.execute()) as Array<Record<string, unknown>>;
		const verificationEvents = (await db
			.selectFrom(AWCMS_SIKESRA_VERIFICATION_EVENTS_TABLE)
			.select(["id"])
			.where("tenant_id", "=", AWCMS_SIKESRA_DEFAULT_TENANT_ID)
			.where("site_id", "=", AWCMS_SIKESRA_DEFAULT_SITE_ID)
			.where("registry_entity_id", "=", targetRecordId)
			.execute()) as Array<Record<string, unknown>>;
		if (documents.length > 0) blockingReferences.push("supporting_documents");
		if (verificationEvents.length > 0) blockingReferences.push("verification_events");
	}
	if (blockingReferences.length > 0) {
		const now = toIsoNow();
		const actor = getRequestUserId(ctx) ?? actorFromRoute(ctx);
		await db
			.insertInto(AWCMS_SIKESRA_DELETE_EVENTS_TABLE)
			.values({
				tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
				site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
				id: `${deleteRequestId}:blocked:${blockingReferences.join("-")}`,
				delete_request_id: deleteRequestId,
				event_kind: "crud.permanent_delete.blocked",
				actor_user_id: actor,
				summary: `Permanent delete blocked for ${targetTable}/${targetRecordId}`,
				metadata_json: JSON.stringify({ targetTable, targetRecordId, blockingReferences }),
				created_at: now,
				updated_at: now,
				deleted_at: null,
				created_by: actor,
				updated_by: actor,
			})
			.execute();
		await appendAuditEvent(ctx, createAuditRecord({ kind: "crud.permanent_delete.blocked", scope: "crud", actor, summary: `Permanent delete blocked for ${targetTable}/${targetRecordId}`, metadata: { deleteRequestId, targetTable, targetRecordId, blockingReferences } }));
		return { success: false, error: { code: "DELETE_BLOCKED_REFERENCES", message: "Permanent delete is blocked by protected references.", details: { references: blockingReferences } } };
	}
	const now = toIsoNow();
	const actor = getRequestUserId(ctx) ?? actorFromRoute(ctx);
	if (!db?.deleteFrom) return { success: false, error: { code: "STORAGE_UNAVAILABLE", message: "D1 delete support is required for permanent delete execution." } };
	await db
		.deleteFrom(targetTable)
		.where("tenant_id", "=", AWCMS_SIKESRA_DEFAULT_TENANT_ID)
		.where("site_id", "=", AWCMS_SIKESRA_DEFAULT_SITE_ID)
		.where("id", "=", targetRecordId)
		.execute();
	await db
		.insertInto(AWCMS_SIKESRA_DELETE_REQUESTS_TABLE)
		.values({
			...requestRow,
			tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
			site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
			id: deleteRequestId,
			status: "executed",
			updated_at: now,
			updated_by: actor,
		})
		.onConflict((oc: any) =>
			oc.columns(["tenant_id", "site_id", "id"]).doUpdateSet({
				status: "executed",
				updated_at: now,
				updated_by: actor,
			}),
		)
		.execute();
	await db
		.insertInto(AWCMS_SIKESRA_DELETE_EVENTS_TABLE)
		.values({
			tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
			site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
			id: `${deleteRequestId}:executed`,
			delete_request_id: deleteRequestId,
			event_kind: "crud.permanent_delete.execute",
			actor_user_id: actor,
			summary: `Permanent delete executed for ${targetTable}/${targetRecordId}`,
			metadata_json: JSON.stringify({ targetTable, targetRecordId }),
			created_at: now,
			updated_at: now,
			deleted_at: null,
			created_by: actor,
			updated_by: actor,
		})
		.execute();
	await appendAuditEvent(ctx, createAuditRecord({ kind: "crud.permanent_delete.execute", scope: "crud", actor, summary: `Permanent delete executed for ${targetTable}/${targetRecordId}`, metadata: { deleteRequestId, targetTable, targetRecordId } }));
	return { success: true, item: { deleteRequestId, targetTable, targetRecordId, status: "executed" } };
};

const settingsGetRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.settings.read");
	if (!permission.allowed) return { success: false, error: permission.error };
	return getSettings(ctx);
};

const settingsSaveRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.settings.update");
	if (!permission.allowed) return { success: false, error: permission.error };
	const publicStatusLabel = getString(routeCtx.input, "publicStatusLabel");
	if (publicStatusLabel !== undefined && !publicStatusLabel.trim()) {
		return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: "Public status label must not be empty.",
			},
		};
	}
	const metadataCanonicalBase = getString(routeCtx.input, "metadataCanonicalBase");
	if (metadataCanonicalBase?.trim()) {
		try {
			const parsed = new URL(metadataCanonicalBase);
			if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
				throw new Error("Unsupported canonical URL protocol");
			}
		} catch {
			return {
				success: false,
				error: {
					code: "VALIDATION_ERROR",
					message: "Metadata canonical base must be an HTTP or HTTPS URL.",
				},
			};
		}
	}
	const auditRetentionDays = getNumber(routeCtx.input, "auditRetentionDays");
	if (auditRetentionDays !== undefined && auditRetentionDays < 1) {
		return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: "Audit retention days must be at least 1.",
			},
		};
	}
	const governanceMode = getString(routeCtx.input, "governanceMode");
	if (governanceMode !== undefined && !ALLOWED_GOVERNANCE_MODES.has(governanceMode)) {
		return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: "Governance mode must be observe, review, or enforceDemo.",
			},
		};
	}
	const smallCellThreshold = getNumber(routeCtx.input, "smallCellThreshold");
	if (smallCellThreshold !== undefined && smallCellThreshold < 1) {
		return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: "Small-cell suppression threshold must be at least 1.",
			},
		};
	}
	const next = await setSettings(ctx, routeCtx.input);
	await appendAuditEvent(
		ctx,
		createAuditRecord({
			kind: "settings.update",
			scope: "settings",
			actor: actorFromRoute(ctx),
			summary: "Updated AWCMS-Micro SIKESRA plugin settings",
			metadata: { ...next },
		}),
	);
	return { success: true, settings: next };
};

const auditListRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const access = await requireRoutePermission(ctx, "sikesra.audit.read");
	if (!access.allowed) return { success: false, error: access.error };

	const limit = Math.min(getNumber(routeCtx.input, "limit") ?? 20, 50);
	const cursor = getString(routeCtx.input, "cursor");
	return listAuditEvents(ctx, limit, cursor);
};

const overviewSummaryRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.dashboard.read");
	if (!permission.allowed) return { success: false, error: permission.error };
	const summary = await summarizePluginState(ctx);
	const access = await summarizeAccessRights(ctx);
	return {
		...summary,
		accessRights: access.health,
	};
};

const verificationListRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.verification.read");
	if (!permission.allowed) return { success: false, error: permission.error };
	await ensureAccessCatalogSeeded(ctx);
	await ensureAbacCatalogSeeded(ctx);
	const currentVerifierLevels = await getCurrentVerifierLevels(ctx);
	const regionScope = await getCurrentVerifierRegionScope(ctx);
	const items = await listVerificationItems(ctx);
	return {
		items: filterVerificationItemsForRegionScope(
			filterVerificationItemsForLevels(items, currentVerifierLevels),
			currentVerifierLevels,
			regionScope,
		),
		events: await listVerificationEvents(ctx),
		currentVerifierLevels,
	};
};

const verificationAdvanceRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.verification.approve");
	if (!permission.allowed) return { success: false, error: permission.error };
	const registryEntityId = getString(routeCtx.input, "registryEntityId") ?? "";
	const actor = getString(routeCtx.input, "actor") ?? actorFromRoute(ctx);
	const verifierLevel =
		(getString(routeCtx.input, "verifierLevel") as VerificationUserLevel | undefined) ??
		inferVerifierLevel(actor);
	const notes =
		getString(routeCtx.input, "notes") ?? "Advanced verification stage from the admin reference UI";
	const items = await listVerificationItems(ctx);
	const item = items.find((entry) => entry.registryEntityId === registryEntityId);

	if (!item) {
		return {
			success: false,
			error: { code: "NOT_FOUND", message: `Unknown verification entity ${registryEntityId}` },
		};
	}

	if (!item.nextStage) {
		return {
			success: false,
			error: {
				code: "INVALID_STATE",
				message: `Registry entity ${registryEntityId} is already at the final verification stage`,
			},
		};
	}
	if (!verifierLevel) {
		return {
			success: false,
			error: {
				code: "INVALID_LEVEL",
				message: `Verification level is required for ${registryEntityId}`,
			},
		};
	}
	const allowedVerifierLevels = getAllowedVerifierLevels(item.currentLevel);
	if (!allowedVerifierLevels.includes(verifierLevel)) {
		return {
			success: false,
			error: {
				code: "INVALID_LEVEL",
				message: `Verification for ${registryEntityId} must be handled by ${allowedVerifierLevels.join(", ")}`,
			},
		};
	}
	const nextStage = item.nextStage;
	const { verifierRegionScope, verifierOrgScope } = await getCurrentVerifierScopeMetadata(ctx);

	const nextState = await getVerificationStageState(ctx);
	nextState[registryEntityId] = item.nextStage;
	await setVerificationStageState(ctx, nextState);

	const event = await appendAuditEvent(
		ctx,
		createAuditRecord({
			kind: "verification.stage.advance",
			scope: "verification",
			actor,
			summary: `Advanced verification for ${item.code} to ${item.nextStage}`,
			metadata: {
				registryEntityId,
				code: item.code,
				from: item.verificationStage,
				to: item.nextStage,
				notes,
			},
		}),
	);
	const verificationEvent = await appendVerificationEvent(ctx, {
		id: `${toIsoNow()}:${registryEntityId}:${nextStage}`,
		registryEntityId,
		stage: nextStage,
		actor,
		inputLevel: item.inputLevel,
		verifierLevel,
		verifierRegionScope,
		verifierOrgScope,
		result: "approved",
		notes,
		createdAt: toIsoNow(),
	});

	return {
		success: true,
		item: {
			...item,
			verificationStage: nextStage,
			nextStage: getNextVerificationStage(nextStage),
			canAdvance: item.nextStage !== "active_verified",
		},
		items: await listVerificationItems(ctx),
		events: await listVerificationEvents(ctx),
		event,
		verificationEvent,
	};
};

const verificationRejectRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.verification.reject");
	if (!permission.allowed) return { success: false, error: permission.error };
	const registryEntityId = getString(routeCtx.input, "registryEntityId") ?? "";
	const actor = getString(routeCtx.input, "actor") ?? actorFromRoute(ctx);
	const verifierLevel =
		(getString(routeCtx.input, "verifierLevel") as VerificationUserLevel | undefined) ??
		inferVerifierLevel(actor);
	const notes = getString(routeCtx.input, "notes")?.trim() ?? "";
	const items = await listVerificationItems(ctx);
	const item = items.find((entry) => entry.registryEntityId === registryEntityId);

	if (!item) {
		return {
			success: false,
			error: { code: "NOT_FOUND", message: `Unknown verification entity ${registryEntityId}` },
		};
	}
	if (!verifierLevel) {
		return {
			success: false,
			error: {
				code: "INVALID_LEVEL",
				message: `Verification level is required for ${registryEntityId}`,
			},
		};
	}
	if (!notes) {
		return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: "Reason notes are required before returning verification for revision.",
			},
		};
	}
	const allowedVerifierLevels = getAllowedVerifierLevels(item.currentLevel);
	if (!allowedVerifierLevels.includes(verifierLevel)) {
		return {
			success: false,
			error: {
				code: "INVALID_LEVEL",
				message: `Verification for ${registryEntityId} must be handled by ${allowedVerifierLevels.join(", ")}`,
			},
		};
	}

	const targetStage = getRevisionTargetStage(item.verificationStage);
	const { verifierRegionScope, verifierOrgScope } = await getCurrentVerifierScopeMetadata(ctx);
	const nextState = await getVerificationStageState(ctx);
	nextState[registryEntityId] = targetStage;
	await setVerificationStageState(ctx, nextState);

	const event = await appendAuditEvent(
		ctx,
		createAuditRecord({
			kind: "verification.stage.reject",
			scope: "verification",
			actor,
			summary: `Returned verification for ${item.code} to ${targetStage}`,
			metadata: {
				registryEntityId,
				code: item.code,
				from: item.verificationStage,
				to: targetStage,
				notes,
				verifierLevel,
			},
		}),
	);
	const verificationEvent = await appendVerificationEvent(ctx, {
		id: `${toIsoNow()}:${registryEntityId}:${targetStage}:needs-review`,
		registryEntityId,
		stage: targetStage,
		actor,
		inputLevel: item.inputLevel,
		verifierLevel,
		verifierRegionScope,
		verifierOrgScope,
		result: "needs_review",
		notes,
		createdAt: toIsoNow(),
	});

	const updatedItems = await listVerificationItems(ctx);
	const updatedItem =
		updatedItems.find((entry) => entry.registryEntityId === registryEntityId) ?? item;
	return {
		success: true,
		item: updatedItem,
		items: updatedItems,
		events: await listVerificationEvents(ctx),
		event,
		verificationEvent,
	};
};

const touchStateRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const note = getString(routeCtx.input, "note") ?? "manual-touch";
	const actor = actorFromRoute(ctx);
	await persistStateValue(ctx, "state:lastManualTouch", toIsoNow());
	const counter = await incrementCounter(ctx, "state:manualTouches");
	const event = await appendAuditEvent(
		ctx,
		createAuditRecord({
			kind: "state.touch",
			scope: "state",
			actor,
			summary: `Touched plugin state: ${note}`,
			metadata: { note, counter },
		}),
	);
	return { success: true, counter, event };
};

const accessPermissionsListRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.rbac.manage");
	if (!permission.allowed) return { success: false, error: permission.error };
	await ensureAccessCatalogSeeded(ctx);
	return { items: await listPermissions(ctx) };
};

const accessPermissionsSaveRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const routePermission = await requireRoutePermission(ctx, "sikesra.rbac.manage");
	if (!routePermission.allowed) return { success: false, error: routePermission.error };
	await ensureAccessCatalogSeeded(ctx);
	const slug = getString(routeCtx.input, "slug") ?? "";
	const label = getString(routeCtx.input, "label") ?? slug;
	const description = getString(routeCtx.input, "description") ?? "";
	const scope = getString(routeCtx.input, "scope") ?? "general";
	const permission = touchUpdatedAt<AccessPermission>({
		slug,
		label,
		description,
		scope,
		updatedAt: "",
	});
	await ctx.storage.sikesra_permission_catalog!.put(slug, permission);
	const event = createAuditRecord({
		kind: "access.permission.save",
		scope: "access-rights",
		actor: actorFromRoute(ctx),
		summary: `Saved permission ${slug}`,
		metadata: { ...permission },
	});
	await appendAccessChangeEvent(ctx, event);
	await appendAuditEvent(ctx, event);
	return { success: true, item: permission };
};

const accessRolesListRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.rbac.manage");
	if (!permission.allowed) return { success: false, error: permission.error };
	await ensureAccessCatalogSeeded(ctx);
	return {
		roles: await listRoles(ctx),
		userAssignments: await listUserRoleAssignments(ctx),
	};
};

const accessRolesSaveRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.rbac.manage");
	if (!permission.allowed) return { success: false, error: permission.error };
	await ensureAccessCatalogSeeded(ctx);
	const slug = getString(routeCtx.input, "slug") ?? "";
	const label = getString(routeCtx.input, "label") ?? slug;
	const description = getString(routeCtx.input, "description") ?? "";
	const role = touchUpdatedAt<AccessRole>({ slug, label, description, updatedAt: "" });
	await ctx.storage.sikesra_role_catalog!.put(slug, role);
	const event = createAuditRecord({
		kind: "access.role.save",
		scope: "access-rights",
		actor: actorFromRoute(ctx),
		summary: `Saved role ${slug}`,
		metadata: { ...role },
	});
	await appendAccessChangeEvent(ctx, event);
	await appendAuditEvent(ctx, event);
	return { success: true, item: role };
};

const accessUserAssignmentsSaveRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.rbac.manage");
	if (!permission.allowed) return { success: false, error: permission.error };
	await ensureAccessCatalogSeeded(ctx);
	const userId = getString(routeCtx.input, "userId")?.trim() ?? "";
	const roles = getStringArray(routeCtx.input, "roles");
	if (!userId || roles.length === 0) {
		return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: "EmDash user reference and at least one SIKESRA role are required.",
			},
		};
	}
	const assignment = touchUpdatedAt<UserRoleAssignment>({ userId, roles, updatedAt: "" });
	await ctx.storage.sikesra_user_role_assignments!.put(userId, assignment);
	await persistStateValue(ctx, "state:lastPreviewUserId", userId);
	const event = createAuditRecord({
		kind: "access.user-assignment.save",
		scope: "access-rights",
		actor: actorFromRoute(ctx),
		summary: `Saved user role assignment for ${userId}`,
		metadata: { ...assignment },
	});
	await appendAccessChangeEvent(ctx, event);
	await appendAuditEvent(ctx, event);
	return { success: true, item: assignment };
};

const accessMatrixGetRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.rbac.manage");
	if (!permission.allowed) return { success: false, error: permission.error };
	const access = await summarizeAccessRights(ctx);
	return {
		permissions: access.permissions,
		roles: access.roles,
		assignments: access.roleAssignments,
	};
};

const accessMatrixSaveRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.rbac.manage");
	if (!permission.allowed) return { success: false, error: permission.error };
	await ensureAccessCatalogSeeded(ctx);
	const roleSlug = getString(routeCtx.input, "roleSlug")?.trim() ?? "";
	const permissions = getStringArray(routeCtx.input, "permissions");
	if (!roleSlug || permissions.length === 0) {
		return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: "Role slug and at least one permission are required for the role matrix.",
			},
		};
	}
	const assignment = touchUpdatedAt<RolePermissionAssignment>({
		roleSlug,
		permissions,
		updatedAt: "",
	});
	await ctx.storage.sikesra_role_permission_assignments!.put(roleSlug, assignment);
	const event = createAuditRecord({
		kind: "access.matrix.save",
		scope: "access-rights",
		actor: actorFromRoute(ctx),
		summary: `Saved role-permission matrix for ${roleSlug}`,
		metadata: { ...assignment },
	});
	await appendAccessChangeEvent(ctx, event);
	await appendAuditEvent(ctx, event);
	return { success: true, item: assignment };
};

const accessPreviewRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.rbac.manage");
	if (!permission.allowed) return { success: false, error: permission.error };
	const preview = await previewAccess(ctx, routeCtx.input);
	return preview;
};

const accessHealthRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.rbac.manage");
	if (!permission.allowed) return { success: false, error: permission.error };
	const access = await summarizeAccessRights(ctx);
	return access.health;
};

const abacAttributesListRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.abac.manage");
	if (!permission.allowed) return { success: false, error: permission.error };
	const abac = await summarizeAbac(ctx);
	return { items: abac.attributes };
};

const abacAttributesSaveRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.abac.manage");
	if (!permission.allowed) return { success: false, error: permission.error };
	await ensureAbacCatalogSeeded(ctx);
	const key = getString(routeCtx.input, "key")?.trim() ?? "";
	if (!ABAC_ATTRIBUTE_KEY_PATTERN.test(key)) {
		return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: "ABAC attribute key must use lowercase snake_case and start with a letter.",
			},
		};
	}
	const label = getString(routeCtx.input, "label") ?? key;
	const targetType =
		(getString(routeCtx.input, "targetType") as
			| AbacAttributeDefinition["targetType"]
			| undefined) ?? "context";
	if (!ALLOWED_ABAC_TARGET_TYPES.has(targetType)) {
		return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: "ABAC attribute target type must be subject, resource, or context.",
			},
		};
	}
	const description = getString(routeCtx.input, "description") ?? "";
	const item = touchUpdatedAt<AbacAttributeDefinition>({
		key,
		label,
		targetType,
		description,
		updatedAt: "",
	});
	await ctx.storage.sikesra_abac_attribute_catalog!.put(key, item);
	const event = createAuditRecord({
		kind: "abac.attribute.save",
		scope: "abac",
		actor: actorFromRoute(ctx),
		summary: `Saved ABAC attribute ${key}`,
		metadata: { ...item },
	});
	await appendAbacChangeEvent(ctx, event);
	await appendAuditEvent(ctx, event);
	return { success: true, item };
};

const abacSubjectsListRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.abac.manage");
	if (!permission.allowed) return { success: false, error: permission.error };
	const abac = await summarizeAbac(ctx);
	return { items: abac.subjects };
};

const abacSubjectsSaveRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.abac.manage");
	if (!permission.allowed) return { success: false, error: permission.error };
	await ensureAbacCatalogSeeded(ctx);
	const subjectId = getString(routeCtx.input, "subjectId") ?? "";
	const attributes = getStringRecord(routeCtx.input, "attributes");
	const item = touchUpdatedAt<AbacSubjectAssignment>({ subjectId, attributes, updatedAt: "" });
	await ctx.storage.sikesra_abac_subject_assignments!.put(subjectId, item);
	const event = createAuditRecord({
		kind: "abac.subject.save",
		scope: "abac",
		actor: actorFromRoute(ctx),
		summary: `Saved ABAC subject assignment for ${subjectId}`,
		metadata: { ...item },
	});
	await appendAbacChangeEvent(ctx, event);
	await appendAuditEvent(ctx, event);
	return { success: true, item };
};

const abacResourcesListRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.abac.manage");
	if (!permission.allowed) return { success: false, error: permission.error };
	const abac = await summarizeAbac(ctx);
	return { items: abac.resources };
};

const abacResourcesSaveRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.abac.manage");
	if (!permission.allowed) return { success: false, error: permission.error };
	await ensureAbacCatalogSeeded(ctx);
	const resourceId = getString(routeCtx.input, "resourceId") ?? "";
	const attributes = getStringRecord(routeCtx.input, "attributes");
	const item = touchUpdatedAt<AbacResourceAssignment>({ resourceId, attributes, updatedAt: "" });
	await ctx.storage.sikesra_abac_resource_assignments!.put(resourceId, item);
	const event = createAuditRecord({
		kind: "abac.resource.save",
		scope: "abac",
		actor: actorFromRoute(ctx),
		summary: `Saved ABAC resource assignment for ${resourceId}`,
		metadata: { ...item },
	});
	await appendAbacChangeEvent(ctx, event);
	await appendAuditEvent(ctx, event);
	return { success: true, item };
};

const abacPoliciesListRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.abac.manage");
	if (!permission.allowed) return { success: false, error: permission.error };
	const abac = await summarizeAbac(ctx);
	return { items: abac.policies };
};

const abacPoliciesSaveRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.abac.manage");
	if (!permission.allowed) return { success: false, error: permission.error };
	await ensureAbacCatalogSeeded(ctx);
	const id = getString(routeCtx.input, "id")?.trim() ?? "";
	if (!ABAC_POLICY_ID_PATTERN.test(id)) {
		return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: "ABAC policy ID must use a lowercase slug and start with a letter.",
			},
		};
	}
	const label = getString(routeCtx.input, "label") ?? id;
	const effect =
		(getString(routeCtx.input, "effect") as AbacPolicyRule["effect"] | undefined) ?? "allow";
	const actions = getStringArray(routeCtx.input, "actions");
	if (!ALLOWED_ABAC_POLICY_EFFECTS.has(effect)) {
		return {
			success: false,
			error: { code: "VALIDATION_ERROR", message: "ABAC policy effect must be allow or deny." },
		};
	}
	if (actions.length === 0) {
		return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: "ABAC policy must include at least one action.",
			},
		};
	}
	const requiredSubject = getStringRecord(routeCtx.input, "requiredSubject");
	const requiredResource = getStringRecord(routeCtx.input, "requiredResource");
	const requiredContext = getStringRecord(routeCtx.input, "requiredContext");
	const item = touchUpdatedAt<AbacPolicyRule>({
		id,
		label,
		effect,
		actions,
		requiredSubject,
		requiredResource,
		requiredContext,
		updatedAt: "",
	});
	await ctx.storage.sikesra_abac_policy_rules!.put(id, item);
	const event = createAuditRecord({
		kind: "abac.policy.save",
		scope: "abac",
		actor: actorFromRoute(ctx),
		summary: `Saved ABAC policy ${id}`,
		metadata: { ...item },
	});
	await appendAbacChangeEvent(ctx, event);
	await appendAuditEvent(ctx, event);
	return { success: true, item };
};

const abacPreviewRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.abac.manage");
	if (!permission.allowed) return { success: false, error: permission.error };
	return evaluateAbacDecision(ctx, routeCtx.input);
};

const abacEnforceDemoRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.abac.manage");
	if (!permission.allowed) return { success: false, error: permission.error };
	const decision = await evaluateAbacDecision(ctx, routeCtx.input);
	const contextAttributes = getStringRecord(routeCtx.input, "contextAttributes");
	const sensitive = (
		contextAttributes.action ??
		getString(routeCtx.input, "action") ??
		""
	).includes("sensitive");
	if (sensitive) {
		const event = createAuditRecord({
			kind: "abac.decision.audit",
			scope: "abac",
			actor: actorFromRoute(ctx),
			summary: `Audited ABAC decision for sensitive action ${contextAttributes.action ?? getString(routeCtx.input, "action") ?? "unknown"}`,
			metadata: decision as unknown as Record<string, unknown>,
		});
		await appendAbacChangeEvent(ctx, event);
		await appendAuditEvent(ctx, event);
	}
	return decision;
};

const abacHealthRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.abac.manage");
	if (!permission.allowed) return { success: false, error: permission.error };
	const abac = await summarizeAbac(ctx);
	return abac.health;
};

const regionsGetRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.region.read");
	if (!permission.allowed) return { success: false, error: permission.error };
	const regions =
		(await getD1RegionTree(ctx, "official")) ??
		(await ctx.kv.get<unknown>("custom:regions")) ??
		DEFAULT_REGION_TREE;
	return regions;
};

const regionsSaveRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.region.update");
	if (!permission.allowed) return { success: false, error: permission.error };
	const input = routeCtx.input;
	const wroteD1 = await persistD1RegionTree(ctx, input, "official");
	if (!wroteD1) await ctx.kv.set("custom:regions", input);
	const event = createAuditRecord({
		kind: "settings.regions.update",
		scope: "settings",
		actor: actorFromRoute(ctx),
		summary: "Updated official administrative regions list",
		metadata: { updatedCount: Array.isArray(input) ? input.length : 0 },
	});
	await appendAuditEvent(ctx, event);
	return { success: true, item: input };
};

const localRegionsGetRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.region.read");
	if (!permission.allowed) return { success: false, error: permission.error };
	return (await getD1RegionTree(ctx, "local")) ?? (await ctx.kv.get<unknown>("custom:local-regions")) ?? [];
};

const localRegionsSaveRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.region.update");
	if (!permission.allowed) return { success: false, error: permission.error };
	const input = routeCtx.input;
	const wroteD1 = await persistD1RegionTree(ctx, input, "local");
	if (!wroteD1) await ctx.kv.set("custom:local-regions", input);
	const event = createAuditRecord({
		kind: "settings.local-regions.update",
		scope: "settings",
		actor: actorFromRoute(ctx),
		summary: "Updated local administrative regions list",
		metadata: { updatedCount: Array.isArray(input) ? input.length : 0 },
	});
	await appendAuditEvent(ctx, event);
	return { success: true, item: input };
};

type D1RegionRow = {
	code: string;
	parent_code?: string | null;
	level: string;
	name: string;
};

async function getD1RegionTree(
	ctx: PluginContext,
	source: "official" | "local",
): Promise<AdministrativeProvince[] | null> {
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.selectFrom) return null;
	const table = source === "official" ? AWCMS_SIKESRA_OFFICIAL_REGIONS_TABLE : AWCMS_SIKESRA_LOCAL_REGIONS_TABLE;

	const rows = (await db
		.selectFrom(table)
		.select(["code", "parent_code", "level", "name"])
		.where("tenant_id", "=", AWCMS_SIKESRA_DEFAULT_TENANT_ID)
		.where("site_id", "=", AWCMS_SIKESRA_DEFAULT_SITE_ID)
		.where("status", "=", "active")
		.execute()) as D1RegionRow[];

	if (rows.length === 0) return null;

	const byParent = new Map<string, D1RegionRow[]>();
	for (const row of rows) {
		const parent = row.parent_code ?? "";
		byParent.set(parent, [...(byParent.get(parent) ?? []), row]);
	}

	return (byParent.get("") ?? [])
		.filter((row) => row.level === "province")
		.map((province) => ({
			code: province.code,
			name: province.name,
			regencies: (byParent.get(province.code) ?? [])
				.filter((row) => row.level === "regency")
				.map((regency) => ({
					code: regency.code,
					name: regency.name,
					districts: (byParent.get(regency.code) ?? [])
						.filter((row) => row.level === "district")
						.map((district) => ({
							code: district.code,
							name: district.name,
							villages: (byParent.get(district.code) ?? [])
								.filter((row) => row.level === "village")
								.map((village) => ({ code: village.code, name: village.name })),
						})),
				})),
		}));
}

async function persistD1RegionTree(ctx: PluginContext, input: unknown, source: "official" | "local") {
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.insertInto || !Array.isArray(input)) return false;
	const table = source === "official" ? AWCMS_SIKESRA_OFFICIAL_REGIONS_TABLE : AWCMS_SIKESRA_LOCAL_REGIONS_TABLE;

	const now = toIsoNow();
	const rows: Array<{ code: string; parentCode: string | null; level: string; name: string }> = [];
	for (const province of input as AdministrativeProvince[]) {
		rows.push({ code: province.code, parentCode: null, level: "province", name: province.name });
		for (const regency of province.regencies ?? []) {
			rows.push({ code: regency.code, parentCode: province.code, level: "regency", name: regency.name });
			for (const district of regency.districts ?? []) {
				rows.push({ code: district.code, parentCode: regency.code, level: "district", name: district.name });
				for (const village of district.villages ?? []) {
					rows.push({ code: village.code, parentCode: district.code, level: "village", name: village.name });
				}
			}
		}
	}

	for (const row of rows) {
		const sourceColumn = source === "official" ? { official_source: "operator_import" } : { local_type: "operator_defined" };
		await db
			.insertInto(table)
			.values({
				tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
				site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
				code: row.code,
				parent_code: row.parentCode,
				level: row.level,
				name: row.name,
				...sourceColumn,
				status: "active",
				created_at: now,
				updated_at: now,
				deleted_at: null,
			})
			.onConflict((oc: any) =>
				oc.columns(["tenant_id", "site_id", "code"]).doUpdateSet({
					parent_code: row.parentCode,
					level: row.level,
					name: row.name,
					...sourceColumn,
					status: "active",
					updated_at: now,
					deleted_at: null,
				}),
			)
			.execute();
	}

	return true;
}

const dataTypesGetRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.data_type.read");
	if (!permission.allowed) return { success: false, error: permission.error };
	const dataTypes =
		(await getD1DataTypes(ctx)) ??
		(await ctx.kv.get<unknown>("custom:data-types")) ??
		DEFAULT_DATA_TYPES;
	return dataTypes;
};

const dataTypesSaveRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const permission = await requireRoutePermission(ctx, "sikesra.data_type.update");
	if (!permission.allowed) return { success: false, error: permission.error };
	const input = routeCtx.input;
	const wroteD1 = await persistD1DataTypes(ctx, input);
	if (!wroteD1) await ctx.kv.set("custom:data-types", input);
	const event = createAuditRecord({
		kind: "settings.data-types.update",
		scope: "settings",
		actor: actorFromRoute(ctx),
		summary: "Updated Sikesra data types and sub classifications",
		metadata: { updatedCount: Array.isArray(input) ? input.length : 0 },
	});
	await appendAuditEvent(ctx, event);
	return { success: true, item: input };
};

async function getD1DataTypes(ctx: PluginContext): Promise<SikesraParentType[] | null> {
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.selectFrom) return null;

	const typeRows = (await db
		.selectFrom(AWCMS_SIKESRA_DATA_TYPES_TABLE)
		.select(["id", "code", "label"])
		.where("tenant_id", "=", AWCMS_SIKESRA_DEFAULT_TENANT_ID)
		.where("site_id", "=", AWCMS_SIKESRA_DEFAULT_SITE_ID)
		.where("status", "=", "active")
		.execute()) as Array<{ id: string; code: string; label: string }>;

	if (typeRows.length === 0) return null;

	const subtypeRows = (await db
		.selectFrom(AWCMS_SIKESRA_DATA_SUBTYPES_TABLE)
		.select(["data_type_id", "code", "label"])
		.where("tenant_id", "=", AWCMS_SIKESRA_DEFAULT_TENANT_ID)
		.where("site_id", "=", AWCMS_SIKESRA_DEFAULT_SITE_ID)
		.where("status", "=", "active")
		.execute()) as Array<{ data_type_id: string; code: string; label: string }>;

	return typeRows.map((type) => ({
		id: type.id,
		code: type.code,
		label: type.label,
		subTypes: subtypeRows
			.filter((subtype) => subtype.data_type_id === type.id)
			.map((subtype) => ({ code: subtype.code, label: subtype.label })),
	}));
}

async function persistD1DataTypes(ctx: PluginContext, input: unknown) {
	const db = (ctx as PluginContext & { db?: unknown }).db as any;
	if (!db?.insertInto || !Array.isArray(input)) return false;

	const now = toIsoNow();
	for (const item of input as SikesraParentType[]) {
		await db
			.insertInto(AWCMS_SIKESRA_DATA_TYPES_TABLE)
			.values({
				tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
				site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
				id: item.id,
				code: item.code,
				label: item.label,
				status: "active",
				created_at: now,
				updated_at: now,
				deleted_at: null,
			})
			.onConflict((oc: any) =>
				oc.columns(["tenant_id", "site_id", "id"]).doUpdateSet({
					code: item.code,
					label: item.label,
					status: "active",
					updated_at: now,
					deleted_at: null,
				}),
			)
			.execute();

		for (const subtype of item.subTypes) {
			await db
				.insertInto(AWCMS_SIKESRA_DATA_SUBTYPES_TABLE)
				.values({
					tenant_id: AWCMS_SIKESRA_DEFAULT_TENANT_ID,
					site_id: AWCMS_SIKESRA_DEFAULT_SITE_ID,
					data_type_id: item.id,
					code: subtype.code,
					label: subtype.label,
					status: "active",
					created_at: now,
					updated_at: now,
					deleted_at: null,
				})
				.onConflict((oc: any) =>
					oc.columns(["tenant_id", "site_id", "data_type_id", "code"]).doUpdateSet({
						label: subtype.label,
						status: "active",
						updated_at: now,
						deleted_at: null,
					}),
				)
				.execute();
		}
	}

	return true;
}

const sharedRouteEntries: Record<string, { public?: boolean; handler: SharedRouteHandler }> = {
	"public/status": { public: true, handler: publicStatusRoute },
	"registry/list": { handler: registryListRoute },
	"registry/save": { handler: registrySaveRoute },
	"registry/archive/list": { handler: registryArchiveListRoute },
	"registry/soft-delete": { handler: registrySoftDeleteRoute },
	"registry/restore": { handler: registryRestoreRoute },
	"documents/list": { handler: documentsListRoute },
	"documents/save": { handler: documentsSaveRoute },
	"documents/access": { handler: documentsAccessRoute },
	"import/create": { handler: importCreateRoute },
	"import/promote": { handler: importPromoteRoute },
	"duplicates/decide": { handler: duplicateDecisionRoute },
	"exports/create": { handler: exportsCreateRoute },
	"exports/list": { handler: exportsListRoute },
	"custom-attributes/definitions/list": { handler: customAttributeDefinitionsListRoute },
	"custom-attributes/definitions/save": { handler: customAttributeDefinitionsSaveRoute },
	"custom-attributes/values/list": { handler: customAttributeValuesListRoute },
	"custom-attributes/values/save": { handler: customAttributeValuesSaveRoute },
	"crud/permanent-delete/request": { handler: permanentDeleteRequestRoute },
	"crud/permanent-delete/requests/list": { handler: permanentDeleteRequestsListRoute },
	"crud/permanent-delete/approve": { handler: permanentDeleteApproveRoute },
	"crud/permanent-delete/execute": { handler: permanentDeleteExecuteRoute },
	"dashboard/summary": { handler: overviewSummaryRoute },
	"overview/summary": { handler: overviewSummaryRoute },
	"verification/list": { handler: verificationListRoute },
	"verification/advance": { handler: verificationAdvanceRoute },
	"verification/reject": { handler: verificationRejectRoute },
	"settings/get": { handler: settingsGetRoute },
	"settings/save": { handler: settingsSaveRoute },
	"regions/get": { handler: regionsGetRoute },
	"regions/save": { handler: regionsSaveRoute },
	"local-regions/get": { handler: localRegionsGetRoute },
	"local-regions/save": { handler: localRegionsSaveRoute },
	"data-types/get": { handler: dataTypesGetRoute },
	"data-types/save": { handler: dataTypesSaveRoute },
	"audit/list": { handler: auditListRoute },
	"state/touch": { handler: touchStateRoute },
	"access/permissions/list": { handler: accessPermissionsListRoute },
	"access/permissions/save": { handler: accessPermissionsSaveRoute },
	"access/roles/list": { handler: accessRolesListRoute },
	"access/roles/save": { handler: accessRolesSaveRoute },
	"access/users/save": { handler: accessUserAssignmentsSaveRoute },
	"access/matrix/get": { handler: accessMatrixGetRoute },
	"access/matrix/save": { handler: accessMatrixSaveRoute },
	"access/preview": { handler: accessPreviewRoute },
	"access/health": { handler: accessHealthRoute },
	"abac/attributes/list": { handler: abacAttributesListRoute },
	"abac/attributes/save": { handler: abacAttributesSaveRoute },
	"abac/subjects/list": { handler: abacSubjectsListRoute },
	"abac/subjects/save": { handler: abacSubjectsSaveRoute },
	"abac/resources/list": { handler: abacResourcesListRoute },
	"abac/resources/save": { handler: abacResourcesSaveRoute },
	"abac/policies/list": { handler: abacPoliciesListRoute },
	"abac/policies/save": { handler: abacPoliciesSaveRoute },
	"abac/preview": { handler: abacPreviewRoute },
	"abac/enforce-demo": { handler: abacEnforceDemoRoute },
	"abac/health": { handler: abacHealthRoute },
};

export function createSandboxRoutes() {
	return sharedRouteEntries;
}

export function createNativeRoutes() {
	const routes: Record<string, NativePluginRoute> = {};
	for (const [path, entry] of Object.entries(sharedRouteEntries)) {
		routes[path] = {
			public: entry.public,
			handler: async (ctx) =>
				entry.handler(
					{
						input: ctx.input,
						request: toSandboxRequest(ctx.request),
						requestMeta: ctx.requestMeta,
					},
					ctx,
				),
		};
	}
	return routes;
}

function toSandboxRequest(request: Request): SandboxedRequest {
	const headers: Record<string, string> = {};
	request.headers.forEach((value, key) => {
		headers[key] = value;
	});
	return {
		url: request.url,
		method: request.method,
		headers,
	};
}

const sharedHooks: SandboxedPlugin["hooks"] = {
	"plugin:install": async (_event, ctx) => {
		await migrateLegacyStorageCollections(ctx);
		await migrateRuntimeStateToD1(ctx);
		await ensureAccessCatalogSeeded(ctx);
		await ensureAbacCatalogSeeded(ctx);
		await persistStateValue(ctx, "state:lastLifecycle", "plugin:install");
		await incrementCounter(ctx, "state:lifecycleCount");
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: "plugin.install",
				scope: "lifecycle",
				actor: "system",
				summary: "Installed the AWCMS-Micro SIKESRA plugin",
				metadata: {},
			}),
		);
	},
	"plugin:activate": async (_event, ctx) => {
		await migrateLegacyStorageCollections(ctx);
		await migrateRuntimeStateToD1(ctx);
		await ensureAccessCatalogSeeded(ctx);
		await ensureAbacCatalogSeeded(ctx);
		await persistStateValue(ctx, "state:lastLifecycle", "plugin:activate");
		await incrementCounter(ctx, "state:lifecycleCount");
		if (ctx.cron) {
			await ctx.cron.schedule("governance-summary", { schedule: "0 * * * *" });
		}
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: "plugin.activate",
				scope: "lifecycle",
				actor: "system",
				summary: "Activated the AWCMS-Micro SIKESRA plugin",
				metadata: { cron: !!ctx.cron },
			}),
		);
	},
	"plugin:deactivate": async (_event, ctx) => {
		await persistStateValue(ctx, "state:lastLifecycle", "plugin:deactivate");
		await incrementCounter(ctx, "state:lifecycleCount");
		if (ctx.cron) {
			await ctx.cron.cancel("governance-summary").catch(() => {});
		}
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: "plugin.deactivate",
				scope: "lifecycle",
				actor: "system",
				summary: "Deactivated the AWCMS-Micro SIKESRA plugin",
				metadata: {},
			}),
		);
	},
	"plugin:uninstall": async (event, ctx) => {
		await persistStateValue(ctx, "state:lastLifecycle", "plugin:uninstall");
		await incrementCounter(ctx, "state:lifecycleCount");
		if (ctx.cron) {
			await ctx.cron.cancel("governance-summary").catch(() => {});
		}
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: "plugin.uninstall",
				scope: "lifecycle",
				actor: "system",
				summary: "Uninstalled the AWCMS-Micro SIKESRA plugin",
				metadata: { deleteData: event.deleteData },
			}),
		);
	},
	"content:beforeSave": async (event, ctx) => {
		await writeSnapshot(ctx, event.collection, event.content);
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: event.isNew ? "content.prepare-create" : "content.prepare-update",
				scope: "content",
				actor: actorFromContent(event.content),
				summary: `Prepared ${event.collection} content for save`,
				metadata: {
					collection: event.collection,
					isNew: event.isNew,
					slug: typeof event.content.slug === "string" ? event.content.slug : null,
				},
			}),
		);
		return event.content;
	},
	"content:afterSave": async (event, ctx) => {
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: event.isNew ? "content.created" : "content.saved",
				scope: "content",
				actor: actorFromContent(event.content),
				summary: `Saved ${event.collection} content`,
				metadata: { collection: event.collection, isNew: event.isNew },
			}),
		);
	},
	"content:beforeDelete": async (event, ctx) => {
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: "content.prepare-delete",
				scope: "content",
				actor: "system",
				summary: `Prepared ${event.collection}/${event.id} for delete`,
				metadata: { collection: event.collection, id: event.id, permanent: event.permanent },
			}),
		);
		return true;
	},
	"content:afterDelete": async (event, ctx) => {
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: "content.deleted",
				scope: "content",
				actor: "system",
				summary: `Deleted ${event.collection}/${event.id}`,
				metadata: { collection: event.collection, id: event.id, permanent: event.permanent },
			}),
		);
	},
	"content:afterPublish": async (event, ctx) => {
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: "content.published",
				scope: "content",
				actor: actorFromContent(event.content),
				summary: `Published ${event.collection} content`,
				metadata: { collection: event.collection },
			}),
		);
	},
	"content:afterUnpublish": async (event, ctx) => {
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: "content.unpublished",
				scope: "content",
				actor: actorFromContent(event.content),
				summary: `Unpublished ${event.collection} content`,
				metadata: { collection: event.collection },
			}),
		);
	},
	"media:beforeUpload": async (event, ctx) => {
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: "media.prepare-upload",
				scope: "media",
				actor: "system",
				summary: `Prepared media upload for ${event.file.name}`,
				metadata: event.file,
			}),
		);
		return event.file;
	},
	"media:afterUpload": async (event, ctx) => {
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: "media.uploaded",
				scope: "media",
				actor: "system",
				summary: `Uploaded media ${event.media.id}`,
				metadata: { id: event.media.id, mimeType: event.media.mimeType },
			}),
		);
	},
	cron: async (event, ctx) => {
		if (event.name !== "governance-summary") return;
		await persistStateValue(ctx, "state:lastCronAt", toIsoNow());
		const settings = await getSettings(ctx);
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: "cron.summary",
				scope: "cron",
				actor: "system",
				summary: "Ran governance summary cron",
				metadata: { retentionDays: settings.auditRetentionDays },
			}),
		);
	},
	"page:metadata": async (event, ctx) => {
		const settings = await getSettings(ctx);
		const href = settings.metadataCanonicalBase || event.page.canonical || event.page.url;
		return [
			{
				kind: "meta" as const,
				name: "awcms-micro:governance-mode",
				content: settings.governanceMode,
			},
			{ kind: "link" as const, rel: "canonical" as const, href, key: "awcms-micro-canonical" },
		];
	},
};

export function createSharedHooks() {
	return sharedHooks;
}
