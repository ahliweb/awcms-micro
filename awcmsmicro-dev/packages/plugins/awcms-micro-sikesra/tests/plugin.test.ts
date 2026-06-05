import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it, vi } from "vitest";

import packageJson from "../package.json" with { type: "json" };
import {
	AWCMS_SIKESRA_DASHBOARD_MODULE_CARDS,
	AWCMS_SIKESRA_PLUGIN_HEADER_MENU,
	createSikesraImportPreviewCreatePayload,
	createSikesraImportPreviewPromotePayload,
	filterPluginHeaderMenu,
	normalizeAccessHealthResponse,
	normalizeSummaryResponse,
	pages as sikesraAdminPages,
} from "../src/admin.js";
import {
	SIKESRA_ADMIN_API_PATHS,
	SIKESRA_READ_ONLY_ADMIN_API_PATHS,
	createSikesraAdminApiHeaders,
	createSikesraAdminApiUrl,
	getSikesraAdminApiMethod,
} from "../src/admin/api/client.js";
import { SIKESRA_TYPED_ADMIN_API_WRAPPER_PATHS } from "../src/admin/api/index.js";
import {
	isSikesraAdminHref,
	createSikesraEmptyState,
	createSikesraMaskedValueState,
	getSikesraCrudActionState,
	getSikesraPageState,
	getSikesraStatusTone,
	SIKESRA_ACCESS_ASSIGNMENT_STEPS,
	SIKESRA_ACCESSIBILITY_CHECKLIST,
	SIKESRA_CUSTOM_ATTRIBUTE_BUILDER_SECTIONS,
	SIKESRA_CRUD_ACTIONS,
	SIKESRA_GOVERNANCE_REVIEW_STEPS,
	SIKESRA_IMPORT_WORKFLOW_STEPS,
	SIKESRA_ADMIN_ROUTE_BASE,
	SIKESRA_OPERATOR_WORKFLOW_STEPS,
	SIKESRA_OVERVIEW_KPIS,
	SIKESRA_OVERVIEW_SECTIONS,
	SIKESRA_OVERVIEW_SHORTCUTS,
	SIKESRA_PAGE_ANATOMY,
	SIKESRA_PAGE_PATTERN_CONTRACTS,
	SIKESRA_REGISTRY_WIZARD_STEPS,
	SIKESRA_REQUIRED_ADMIN_COMPONENTS,
	SIKESRA_REQUIRED_ADMIN_PAGE_PATHS,
	SIKESRA_STANDARD_EMPTY_STATES,
	SIKESRA_STATUS_BADGES,
	SIKESRA_VERIFICATION_QUEUE_TABS,
	toSikesraAdminHref,
} from "../src/admin/ui-standards.js";
import { SIKESRA_CRUD_FEATURE_POLICIES } from "../src/contracts/index.js";
import {
	SIKESRA_REFERENCE_FIXTURES,
	maskSensitive,
	maskSensitiveBySensitivity,
} from "../src/fixtures.js";
import { awcmsMicroExamplePlugin, awcmsMicroSikesraPlugin } from "../src/index.js";
import {
	AWCMS_SIKESRA_CRUD_PERMISSION_LIST,
	AWCMS_SIKESRA_PERMISSION_LIST,
} from "../src/permissions.js";
import {
	AWCMS_SIKESRA_ADMIN_PAGES,
	AWCMS_SIKESRA_ADMIN_WIDGETS,
	AWCMS_SIKESRA_CAPABILITIES,
	AWCMS_SIKESRA_DESCRIPTOR_STORAGE,
	AWCMS_SIKESRA_D1_TABLE_NAMES,
	AWCMS_SIKESRA_FIELD_WIDGETS,
	AWCMS_SIKESRA_PLUGIN_ID,
	AWCMS_SIKESRA_PORTABLE_TEXT_BLOCKS,
	AWCMS_SIKESRA_STORAGE,
	DEFAULT_REGION_TREE,
	DEFAULT_DATA_TYPES,
	createAuditRecord,
	createNativeRoutes,
	createSharedHooks,
} from "../src/runtime.js";
import sandboxPlugin from "../src/sandbox.js";

function parseJsoncObject<T>(source: string): T {
	let output = "";
	let index = 0;
	let inString = false;
	let escaped = false;
	let quote = "";

	while (index < source.length) {
		const char = source[index];
		const next = source[index + 1];

		if (inString) {
			output += char;
			if (escaped) {
				escaped = false;
			} else if (char === "\\") {
				escaped = true;
			} else if (char === quote) {
				inString = false;
				quote = "";
			}
			index += 1;
			continue;
		}

		if (char === '"' || char === "'") {
			inString = true;
			quote = char;
			output += char;
			index += 1;
			continue;
		}

		if (char === "/" && next === "/") {
			index += 2;
			while (index < source.length && source[index] !== "\n") {
				index += 1;
			}
			continue;
		}

		if (char === "/" && next === "*") {
			index += 2;
			while (index < source.length && !(source[index] === "*" && source[index + 1] === "/")) {
				index += 1;
			}
			index += 2;
			continue;
		}

		output += char;
		index += 1;
	}

	return JSON.parse(output.replace(/,\s*([}\]])/g, "$1")) as T;
}

function createAdminRequest() {
	return new Request("https://example.test", {
		headers: { "X-Sikesra-User-Id": "user-demo-sikesra-admin" },
	});
}

function createMockContext() {
	const kvData = new Map<string, unknown>();
	const collections = {
		auditEvents: new Map<string, unknown>(),
		accessChangeEvents: new Map<string, unknown>(),
		abacChangeEvents: new Map<string, unknown>(),
		registryEntities: new Map<string, unknown>(),
		settingsState: new Map<string, unknown>(),
		pluginState: new Map<string, unknown>(),
		verificationStageState: new Map<string, unknown>(),
		abacAttributeCatalog: new Map<string, unknown>(),
		abacPolicyRules: new Map<string, unknown>(),
		abacResourceAssignments: new Map<string, unknown>(),
		abacSubjectAssignments: new Map<string, unknown>(),
		contentSnapshots: new Map<string, unknown>(),
		permissionCatalog: new Map<string, unknown>(),
		roleCatalog: new Map<string, unknown>(),
		rolePermissionAssignments: new Map<string, unknown>(),
		userRoleAssignments: new Map<string, unknown>(),
		userScopeAssignments: new Map<string, unknown>(),
		supportingDocuments: new Map<string, unknown>(),
		verificationEvents: new Map<string, unknown>(),
	};
	const auditTableRows: Array<Record<string, unknown>> = [];
	const registryEntityTableRows: Array<Record<string, unknown>> = [];
	const codeSequenceTableRows: Array<Record<string, unknown>> = [];
	const codeHistoryTableRows: Array<Record<string, unknown>> = [];
	const moduleDetailTableRows: Record<string, Array<Record<string, unknown>>> = {
		sikesra_rumah_ibadah_details: [],
		sikesra_lembaga_keagamaan_details: [],
		sikesra_pendidikan_keagamaan_details: [],
		sikesra_lks_details: [],
		sikesra_guru_agama_details: [],
		sikesra_anak_yatim_details: [],
		sikesra_disabilitas_details: [],
		sikesra_lansia_terlantar_details: [],
	};
	const settingsTableRows: Array<Record<string, unknown>> = [];
	const dataTypeTableRows: Array<Record<string, unknown>> = [];
	const dataSubtypeTableRows: Array<Record<string, unknown>> = [];
	const officialRegionTableRows: Array<Record<string, unknown>> = [];
	const localRegionTableRows: Array<Record<string, unknown>> = [];
	const fileObjectTableRows: Array<Record<string, unknown>> = [];
	const supportingDocumentTableRows: Array<Record<string, unknown>> = [];
	const importBatchTableRows: Array<Record<string, unknown>> = [];
	const importStagingRowTableRows: Array<Record<string, unknown>> = [];
	const importMappingTemplateTableRows: Array<Record<string, unknown>> = [];
	const duplicateCandidateTableRows: Array<Record<string, unknown>> = [];
	const duplicateDecisionTableRows: Array<Record<string, unknown>> = [];
	const exportJobTableRows: Array<Record<string, unknown>> = [];
	const permissionCatalogTableRows: Array<Record<string, unknown>> = [];
	const roleCatalogTableRows: Array<Record<string, unknown>> = [];
	const abacAttributeCatalogTableRows: Array<Record<string, unknown>> = [];
	const customAttributeDefinitionTableRows: Array<Record<string, unknown>> = [];
	const customAttributeValueTableRows: Array<Record<string, unknown>> = [];
	const customAttributeChangeEventTableRows: Array<Record<string, unknown>> = [];
	const rolePermissionAssignmentTableRows: Array<Record<string, unknown>> = [];
	const userRoleAssignmentTableRows: Array<Record<string, unknown>> = [];
	const userScopeAssignmentTableRows: Array<Record<string, unknown>> = [];
	const abacSubjectAssignmentTableRows: Array<Record<string, unknown>> = [];
	const abacResourceAssignmentTableRows: Array<Record<string, unknown>> = [];
	const abacPolicyRuleTableRows: Array<Record<string, unknown>> = [];
	const deleteRequestTableRows: Array<Record<string, unknown>> = [];
	const deleteApprovalTableRows: Array<Record<string, unknown>> = [];
	const deleteSnapshotTableRows: Array<Record<string, unknown>> = [];
	const deleteEventTableRows: Array<Record<string, unknown>> = [];
	const verificationStageTableRows: Array<Record<string, unknown>> = [];
	const verificationEventTableRows: Array<Record<string, unknown>> = [];
	const storageByCollectionName: Record<string, Map<string, unknown>> = {
		sikesra_audit_events: collections.auditEvents,
		sikesra_access_change_events: collections.accessChangeEvents,
		sikesra_abac_change_events: collections.abacChangeEvents,
		sikesra_registry_entities: collections.registryEntities,
		sikesra_settings_state: collections.settingsState,
		sikesra_plugin_state: collections.pluginState,
		sikesra_verification_stage_state: collections.verificationStageState,
		sikesra_abac_attribute_catalog: collections.abacAttributeCatalog,
		sikesra_abac_policy_rules: collections.abacPolicyRules,
		sikesra_abac_resource_assignments: collections.abacResourceAssignments,
		sikesra_abac_subject_assignments: collections.abacSubjectAssignments,
		sikesra_content_snapshots: collections.contentSnapshots,
		sikesra_permission_catalog: collections.permissionCatalog,
		sikesra_role_catalog: collections.roleCatalog,
		sikesra_role_permission_assignments: collections.rolePermissionAssignments,
		sikesra_user_role_assignments: collections.userRoleAssignments,
		sikesra_user_scope_assignments: collections.userScopeAssignments,
		sikesra_supporting_documents: collections.supportingDocuments,
		sikesra_verification_events: collections.verificationEvents,
	};
	type DbRow = {
		plugin_id: string;
		collection: string;
		id: string;
		data: string;
		created_at: string;
		updated_at: string;
	};
	const dbRows: DbRow[] = [];
	function textValue(value: unknown, fallback = ""): string {
		if (typeof value === "string") return value;
		if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
			return `${value}`;
		}
		return fallback;
	}

	function jsonTextValue(value: unknown, fallback = "{}"): string {
		if (typeof value === "string") return value;
		if (value == null) return fallback;
		try {
			return JSON.stringify(value);
		} catch {
			return fallback;
		}
	}

	const syncCollectionMap = (row: DbRow) => {
		const target = storageByCollectionName[row.collection];
		if (!target) return;
		target.set(row.id, JSON.parse(row.data));
	};
	const unsyncCollectionMap = (row: DbRow) => {
		const target = storageByCollectionName[row.collection];
		if (!target) return;
		target.delete(row.id);
	};
	const cloneRow = (row: DbRow) => ({ ...row });
	const auditRowToData = (row: Record<string, unknown>) => ({
		id: row.id,
		timestamp: row.timestamp,
		kind: row.kind,
		scope: row.scope,
		actor: row.actor_name ?? row.actor,
		summary: row.summary,
		metadata: JSON.parse(jsonTextValue(row.metadata_json ?? row.metadata)),
		userId: row.actor_user_id ?? row.user_id ?? undefined,
		userName: row.actor_name ?? row.user_name ?? undefined,
	});
	const schemaBuilder = {
		ifNotExists() {
			return schemaBuilder;
		},
		addColumn() {
			return schemaBuilder;
		},
		execute: vi.fn(async () => undefined),
	};
	const queryRows = (filters: Record<string, string>) =>
		dbRows
			.filter((row) => {
				for (const [key, value] of Object.entries(filters)) {
					if ((row as Record<string, string>)[key] !== value) return false;
				}
				return true;
			})
			.map(cloneRow);
	const seedDbRow = (row: DbRow) => {
		dbRows.push(row);
		syncCollectionMap(row);
	};
	const isModuleDetailTable = (table: string) => Object.hasOwn(moduleDetailTableRows, table);
	const upsertSettingsRow = (settingsRow: Record<string, unknown>) => {
		const index = settingsTableRows.findIndex(
			(existing) =>
				existing.tenant_id === settingsRow.tenant_id &&
				existing.site_id === settingsRow.site_id &&
				existing.key === settingsRow.key,
		);
		if (index >= 0) settingsTableRows[index] = settingsRow;
		else settingsTableRows.push(settingsRow);
	};
	const upsertD1CatalogRow = (
		rows: Array<Record<string, unknown>>,
		keys: string[],
		row: Record<string, unknown>,
	) => {
		const index = rows.findIndex((existing) => keys.every((key) => existing[key] === row[key]));
		if (index >= 0) rows[index] = row;
		else rows.push(row);
	};
	const db = {
		schema: {
			createTable: vi.fn(() => schemaBuilder),
		},
		selectFrom(_table: string) {
			const filters: Record<string, string> = {};
			const query = {
				select(_columns: string[]) {
					return query;
				},
				orderBy() {
					return query;
				},
				limit() {
					return query;
				},
				where(column: string, _op: string, value: string) {
					filters[column] = value;
					return query;
				},
				async execute() {
					if (_table === "sikesra_audit_events") {
						return auditTableRows
							.filter((row) => {
								for (const [key, value] of Object.entries(filters)) {
									if ((row as Record<string, string>)[key] !== value) return false;
								}
								return true;
							})
							.map((row) => ({ ...row }));
					}
					if (_table === "sikesra_settings") {
						return settingsTableRows
							.filter((row) => {
								for (const [key, value] of Object.entries(filters)) {
									if ((row as Record<string, string>)[key] !== value) return false;
								}
								return true;
							})
							.map((row) => ({ ...row }));
					}
					if (_table === "sikesra_registry_entities") {
						return registryEntityTableRows
							.filter((row) => {
								for (const [key, value] of Object.entries(filters)) {
									if ((row as Record<string, unknown>)[key] !== value) return false;
								}
								return true;
							})
							.map((row) => ({ ...row }));
					}
					if (_table === "sikesra_code_sequences") {
						return codeSequenceTableRows
							.filter((row) => {
								for (const [key, value] of Object.entries(filters)) {
									if ((row as Record<string, unknown>)[key] !== value) return false;
								}
								return true;
							})
							.map((row) => ({ ...row }));
					}
					if (isModuleDetailTable(_table)) {
						return moduleDetailTableRows[_table]!.filter((row) => {
							for (const [key, value] of Object.entries(filters)) {
								if ((row as Record<string, unknown>)[key] !== value) return false;
							}
							return true;
						}).map((row) => ({ ...row }));
					}
					if (_table === "sikesra_data_types") {
						return dataTypeTableRows
							.filter((row) => {
								for (const [key, value] of Object.entries(filters)) {
									if ((row as Record<string, string>)[key] !== value) return false;
								}
								return true;
							})
							.map((row) => ({ ...row }));
					}
					if (_table === "sikesra_data_subtypes") {
						return dataSubtypeTableRows
							.filter((row) => {
								for (const [key, value] of Object.entries(filters)) {
									if ((row as Record<string, string>)[key] !== value) return false;
								}
								return true;
							})
							.map((row) => ({ ...row }));
					}
					if (_table === "sikesra_official_regions") {
						return officialRegionTableRows
							.filter((row) => {
								for (const [key, value] of Object.entries(filters)) {
									if ((row as Record<string, string>)[key] !== value) return false;
								}
								return true;
							})
							.map((row) => ({ ...row }));
					}
					if (_table === "sikesra_local_regions") {
						return localRegionTableRows
							.filter((row) => {
								for (const [key, value] of Object.entries(filters)) {
									if ((row as Record<string, string>)[key] !== value) return false;
								}
								return true;
							})
							.map((row) => ({ ...row }));
					}
					if (_table === "sikesra_supporting_documents") {
						return supportingDocumentTableRows
							.filter((row) => {
								for (const [key, value] of Object.entries(filters)) {
									if ((row as Record<string, unknown>)[key] !== value) return false;
								}
								return true;
							})
							.map((row) => ({ ...row }));
					}
					if (_table === "sikesra_file_objects") {
						return fileObjectTableRows
							.filter((row) => {
								for (const [key, value] of Object.entries(filters)) {
									if ((row as Record<string, unknown>)[key] !== value) return false;
								}
								return true;
							})
							.map((row) => ({ ...row }));
					}
					if (_table === "sikesra_import_staging_rows") {
						return importStagingRowTableRows
							.filter((row) => {
								for (const [key, value] of Object.entries(filters)) {
									if ((row as Record<string, unknown>)[key] !== value) return false;
								}
								return true;
							})
							.map((row) => ({ ...row }));
					}
					if (_table === "sikesra_export_jobs") {
						return exportJobTableRows
							.filter((row) => {
								for (const [key, value] of Object.entries(filters)) {
									if ((row as Record<string, unknown>)[key] !== value) return false;
								}
								return true;
							})
							.map((row) => ({ ...row }));
					}
					if (_table === "sikesra_custom_attribute_definitions") {
						return customAttributeDefinitionTableRows
							.filter((row) => {
								for (const [key, value] of Object.entries(filters)) {
									if ((row as Record<string, unknown>)[key] !== value) return false;
								}
								return true;
							})
							.map((row) => ({ ...row }));
					}
					if (_table === "sikesra_custom_attribute_values") {
						return customAttributeValueTableRows
							.filter((row) => {
								for (const [key, value] of Object.entries(filters)) {
									if ((row as Record<string, unknown>)[key] !== value) return false;
								}
								return true;
							})
							.map((row) => ({ ...row }));
					}
					if (_table === "sikesra_delete_requests") {
						return deleteRequestTableRows
							.filter((row) => {
								for (const [key, value] of Object.entries(filters)) {
									if ((row as Record<string, unknown>)[key] !== value) return false;
								}
								return true;
							})
							.map((row) => ({ ...row }));
					}
					if (_table === "sikesra_role_permission_assignments") {
						return rolePermissionAssignmentTableRows
							.filter((row) => {
								for (const [key, value] of Object.entries(filters)) {
									if ((row as Record<string, unknown>)[key] !== value) return false;
								}
								return true;
							})
							.map((row) => ({ ...row }));
					}
					if (_table === "sikesra_user_role_assignments") {
						return userRoleAssignmentTableRows
							.filter((row) => {
								for (const [key, value] of Object.entries(filters)) {
									if ((row as Record<string, unknown>)[key] !== value) return false;
								}
								return true;
							})
							.map((row) => ({ ...row }));
					}
					if (_table === "sikesra_user_scope_assignments") {
						return userScopeAssignmentTableRows
							.filter((row) => {
								for (const [key, value] of Object.entries(filters)) {
									if ((row as Record<string, unknown>)[key] !== value) return false;
								}
								return true;
							})
							.map((row) => ({ ...row }));
					}
					if (_table === "sikesra_abac_subject_assignments") {
						return abacSubjectAssignmentTableRows
							.filter((row) => {
								for (const [key, value] of Object.entries(filters)) {
									if ((row as Record<string, unknown>)[key] !== value) return false;
								}
								return true;
							})
							.map((row) => ({ ...row }));
					}
					if (_table === "sikesra_abac_resource_assignments") {
						return abacResourceAssignmentTableRows
							.filter((row) => {
								for (const [key, value] of Object.entries(filters)) {
									if ((row as Record<string, unknown>)[key] !== value) return false;
								}
								return true;
							})
							.map((row) => ({ ...row }));
					}
					if (_table === "sikesra_abac_policy_rules") {
						return abacPolicyRuleTableRows
							.filter((row) => {
								for (const [key, value] of Object.entries(filters)) {
									if ((row as Record<string, unknown>)[key] !== value) return false;
								}
								return true;
							})
							.map((row) => ({ ...row }));
					}
					if (_table === "sikesra_verification_stage_state") {
						return verificationStageTableRows
							.filter((row) => {
								for (const [key, value] of Object.entries(filters)) {
									if ((row as Record<string, string>)[key] !== value) return false;
								}
								return true;
							})
							.map((row) => ({ ...row }));
					}
					if (_table === "sikesra_verification_events") {
						return verificationEventTableRows
							.filter((row) => {
								for (const [key, value] of Object.entries(filters)) {
									if ((row as Record<string, unknown>)[key] !== value) return false;
								}
								return true;
							})
							.map((row) => ({ ...row }));
					}
					return queryRows(filters);
				},
			};
			return query;
		},
		insertInto(_table: string) {
			let row: DbRow | Record<string, unknown> | null = null;
			return {
				values(nextRow: Record<string, unknown>) {
					if (_table === "sikesra_audit_events") {
						row = {
							tenant_id: textValue(nextRow.tenant_id),
							site_id: textValue(nextRow.site_id),
							id: textValue(nextRow.id),
							timestamp: textValue(nextRow.timestamp),
							kind: textValue(nextRow.kind),
							scope: textValue(nextRow.scope),
							actor_user_id: nextRow.actor_user_id ?? null,
							actor_name: nextRow.actor_name ?? null,
							summary: textValue(nextRow.summary),
							metadata_json: jsonTextValue(nextRow.metadata_json),
							redaction_policy: textValue(nextRow.redaction_policy),
							request_id: nextRow.request_id ?? null,
							ip_hash: nextRow.ip_hash ?? null,
							user_agent_hash: nextRow.user_agent_hash ?? null,
							created_at: textValue(nextRow.created_at),
						};
					} else if (_table === "sikesra_registry_entities") {
						row = {
							tenant_id: textValue(nextRow.tenant_id),
							site_id: textValue(nextRow.site_id),
							id: textValue(nextRow.id),
							sikesra_id_20: nextRow.sikesra_id_20 ?? null,
							code: textValue(nextRow.code),
							label: textValue(nextRow.label),
							entity_type: textValue(nextRow.entity_type),
							subtype_code: nextRow.subtype_code ?? null,
							sensitivity: textValue(nextRow.sensitivity),
							province_code: nextRow.province_code ?? null,
							regency_code: nextRow.regency_code ?? null,
							district_code: nextRow.district_code ?? null,
							village_code: nextRow.village_code ?? null,
							verification_stage: textValue(nextRow.verification_stage),
							input_level: nextRow.input_level ?? null,
							public_summary: nextRow.public_summary ?? null,
							created_at: textValue(nextRow.created_at),
							updated_at: textValue(nextRow.updated_at),
							deleted_at: nextRow.deleted_at ?? null,
							created_by: nextRow.created_by ?? null,
							updated_by: nextRow.updated_by ?? null,
						};
					} else if (_table === "sikesra_code_sequences") {
						row = {
							tenant_id: textValue(nextRow.tenant_id),
							site_id: textValue(nextRow.site_id),
							sequence_key: textValue(nextRow.sequence_key),
							last_value: Number(nextRow.last_value ?? 0),
							created_at: textValue(nextRow.created_at),
							updated_at: textValue(nextRow.updated_at),
							deleted_at: nextRow.deleted_at ?? null,
							created_by: nextRow.created_by ?? null,
							updated_by: nextRow.updated_by ?? null,
						};
					} else if (_table === "sikesra_code_history") {
						row = {
							tenant_id: textValue(nextRow.tenant_id),
							site_id: textValue(nextRow.site_id),
							id: textValue(nextRow.id),
							registry_entity_id: textValue(nextRow.registry_entity_id),
							sikesra_id_20: textValue(nextRow.sikesra_id_20),
							sequence_key: textValue(nextRow.sequence_key),
							event_type: textValue(nextRow.event_type ?? "issued"),
							previous_sikesra_id_20: nextRow.previous_sikesra_id_20 ?? null,
							correction_reason: nextRow.correction_reason ?? null,
							issued_at: textValue(nextRow.issued_at),
							issued_by: nextRow.issued_by ?? null,
							created_at: textValue(nextRow.created_at),
							updated_at: textValue(nextRow.updated_at),
							deleted_at: nextRow.deleted_at ?? null,
							created_by: nextRow.created_by ?? null,
							updated_by: nextRow.updated_by ?? null,
						};
					} else if (isModuleDetailTable(_table)) {
						row = {
							tenant_id: textValue(nextRow.tenant_id),
							site_id: textValue(nextRow.site_id),
							registry_entity_id: textValue(nextRow.registry_entity_id),
							person_profile_id: nextRow.person_profile_id ?? null,
							detail_json: textValue(nextRow.detail_json),
							field_standard_version: textValue(nextRow.field_standard_version),
							created_at: textValue(nextRow.created_at),
							updated_at: textValue(nextRow.updated_at),
							deleted_at: nextRow.deleted_at ?? null,
							created_by: nextRow.created_by ?? null,
							updated_by: nextRow.updated_by ?? null,
						};
					} else if (_table === "sikesra_settings") {
						row = {
							tenant_id: textValue(nextRow.tenant_id),
							site_id: textValue(nextRow.site_id),
							key: textValue(nextRow.key),
							value_json: textValue(nextRow.value_json),
							created_at: textValue(nextRow.created_at),
							updated_at: textValue(nextRow.updated_at),
							deleted_at: nextRow.deleted_at ?? null,
						};
					} else if (_table === "sikesra_data_types") {
						row = {
							tenant_id: textValue(nextRow.tenant_id),
							site_id: textValue(nextRow.site_id),
							id: textValue(nextRow.id),
							code: textValue(nextRow.code),
							label: textValue(nextRow.label),
							status: textValue(nextRow.status),
							created_at: textValue(nextRow.created_at),
							updated_at: textValue(nextRow.updated_at),
							deleted_at: nextRow.deleted_at ?? null,
						};
					} else if (_table === "sikesra_data_subtypes") {
						row = {
							tenant_id: textValue(nextRow.tenant_id),
							site_id: textValue(nextRow.site_id),
							data_type_id: textValue(nextRow.data_type_id),
							code: textValue(nextRow.code),
							label: textValue(nextRow.label),
							status: textValue(nextRow.status),
							created_at: textValue(nextRow.created_at),
							updated_at: textValue(nextRow.updated_at),
							deleted_at: nextRow.deleted_at ?? null,
						};
					} else if (_table === "sikesra_official_regions") {
						row = {
							tenant_id: textValue(nextRow.tenant_id),
							site_id: textValue(nextRow.site_id),
							code: textValue(nextRow.code),
							parent_code: nextRow.parent_code ?? null,
							level: textValue(nextRow.level),
							name: textValue(nextRow.name),
							official_source: textValue(nextRow.official_source),
							status: textValue(nextRow.status),
							created_at: textValue(nextRow.created_at),
							updated_at: textValue(nextRow.updated_at),
							deleted_at: nextRow.deleted_at ?? null,
						};
					} else if (_table === "sikesra_local_regions") {
						row = {
							tenant_id: textValue(nextRow.tenant_id),
							site_id: textValue(nextRow.site_id),
							code: textValue(nextRow.code),
							parent_code: nextRow.parent_code ?? null,
							level: textValue(nextRow.level),
							name: textValue(nextRow.name),
							local_type: textValue(nextRow.local_type),
							status: textValue(nextRow.status),
							created_at: textValue(nextRow.created_at),
							updated_at: textValue(nextRow.updated_at),
							deleted_at: nextRow.deleted_at ?? null,
						};
					} else if (_table === "sikesra_file_objects") {
						row = {
							tenant_id: textValue(nextRow.tenant_id),
							site_id: textValue(nextRow.site_id),
							id: textValue(nextRow.id),
							storage_provider: textValue(nextRow.storage_provider),
							storage_bucket: nextRow.storage_bucket ?? null,
							storage_key: textValue(nextRow.storage_key),
							original_filename: textValue(nextRow.original_filename),
							safe_filename: textValue(nextRow.safe_filename),
							content_type: textValue(nextRow.content_type),
							file_extension: nextRow.file_extension ?? null,
							file_size_bytes: Number(nextRow.file_size_bytes ?? 0),
							checksum_sha256: nextRow.checksum_sha256 ?? null,
							classification: textValue(nextRow.classification),
							validation_status: textValue(nextRow.validation_status),
							validation_notes: nextRow.validation_notes ?? null,
							created_at: textValue(nextRow.created_at),
							updated_at: textValue(nextRow.updated_at),
							deleted_at: nextRow.deleted_at ?? null,
							created_by: nextRow.created_by ?? null,
							updated_by: nextRow.updated_by ?? null,
						};
					} else if (_table === "sikesra_supporting_documents") {
						row = {
							tenant_id: textValue(nextRow.tenant_id),
							site_id: textValue(nextRow.site_id),
							id: textValue(nextRow.id),
							registry_entity_id: textValue(nextRow.registry_entity_id),
							file_object_id: textValue(nextRow.file_object_id),
							document_type: textValue(nextRow.document_type),
							title: textValue(nextRow.title),
							classification: textValue(nextRow.classification),
							validation_status: textValue(nextRow.validation_status),
							verification_stage: textValue(nextRow.verification_stage),
							issuer: nextRow.issuer ?? null,
							issued_at: nextRow.issued_at ?? null,
							expires_at: nextRow.expires_at ?? null,
							access_policy: textValue(nextRow.access_policy),
							metadata_json: textValue(nextRow.metadata_json),
							created_at: textValue(nextRow.created_at),
							updated_at: textValue(nextRow.updated_at),
							deleted_at: nextRow.deleted_at ?? null,
							created_by: nextRow.created_by ?? null,
							updated_by: nextRow.updated_by ?? null,
						};
					} else if (_table === "sikesra_import_mapping_templates") {
						row = {
							tenant_id: textValue(nextRow.tenant_id),
							site_id: textValue(nextRow.site_id),
							id: textValue(nextRow.id),
							name: textValue(nextRow.name),
							entity_type: textValue(nextRow.entity_type),
							subtype_code: nextRow.subtype_code ?? null,
							file_format: textValue(nextRow.file_format),
							mapping_json: textValue(nextRow.mapping_json),
							status: textValue(nextRow.status),
							created_at: textValue(nextRow.created_at),
							updated_at: textValue(nextRow.updated_at),
							deleted_at: nextRow.deleted_at ?? null,
							created_by: nextRow.created_by ?? null,
							updated_by: nextRow.updated_by ?? null,
						};
					} else if (_table === "sikesra_import_batches") {
						row = {
							tenant_id: textValue(nextRow.tenant_id),
							site_id: textValue(nextRow.site_id),
							id: textValue(nextRow.id),
							mapping_template_id: nextRow.mapping_template_id ?? null,
							entity_type: textValue(nextRow.entity_type),
							subtype_code: nextRow.subtype_code ?? null,
							file_object_id: nextRow.file_object_id ?? null,
							status: textValue(nextRow.status),
							total_rows: Number(nextRow.total_rows ?? 0),
							valid_rows: Number(nextRow.valid_rows ?? 0),
							invalid_rows: Number(nextRow.invalid_rows ?? 0),
							duplicate_risk_rows: Number(nextRow.duplicate_risk_rows ?? 0),
							promoted_rows: Number(nextRow.promoted_rows ?? 0),
							source_filename: nextRow.source_filename ?? null,
							error_summary_json: textValue(nextRow.error_summary_json),
							created_at: textValue(nextRow.created_at),
							updated_at: textValue(nextRow.updated_at),
							deleted_at: nextRow.deleted_at ?? null,
							created_by: nextRow.created_by ?? null,
							updated_by: nextRow.updated_by ?? null,
						};
					} else if (_table === "sikesra_import_staging_rows") {
						row = {
							tenant_id: textValue(nextRow.tenant_id),
							site_id: textValue(nextRow.site_id),
							id: textValue(nextRow.id),
							batch_id: textValue(nextRow.batch_id),
							row_number: Number(nextRow.row_number ?? 0),
							entity_type: textValue(nextRow.entity_type),
							subtype_code: nextRow.subtype_code ?? null,
							raw_row_json: textValue(nextRow.raw_row_json),
							mapped_row_json: textValue(nextRow.mapped_row_json),
							validation_status: textValue(nextRow.validation_status),
							validation_errors_json: textValue(nextRow.validation_errors_json),
							duplicate_status: textValue(nextRow.duplicate_status),
							promotion_status: textValue(nextRow.promotion_status),
							promoted_registry_entity_id: nextRow.promoted_registry_entity_id ?? null,
							created_at: textValue(nextRow.created_at),
							updated_at: textValue(nextRow.updated_at),
							deleted_at: nextRow.deleted_at ?? null,
							created_by: nextRow.created_by ?? null,
							updated_by: nextRow.updated_by ?? null,
						};
					} else if (_table === "sikesra_duplicate_candidates") {
						row = {
							tenant_id: textValue(nextRow.tenant_id),
							site_id: textValue(nextRow.site_id),
							id: textValue(nextRow.id),
							source_type: textValue(nextRow.source_type),
							source_id: textValue(nextRow.source_id),
							candidate_type: textValue(nextRow.candidate_type),
							candidate_id: textValue(nextRow.candidate_id),
							entity_type: nextRow.entity_type ?? null,
							score: Number(nextRow.score ?? 0),
							risk_level: textValue(nextRow.risk_level),
							reason_json: textValue(nextRow.reason_json),
							status: textValue(nextRow.status),
							created_at: textValue(nextRow.created_at),
							updated_at: textValue(nextRow.updated_at),
							deleted_at: nextRow.deleted_at ?? null,
							created_by: nextRow.created_by ?? null,
							updated_by: nextRow.updated_by ?? null,
						};
					} else if (_table === "sikesra_duplicate_decisions") {
						row = {
							tenant_id: textValue(nextRow.tenant_id),
							site_id: textValue(nextRow.site_id),
							id: textValue(nextRow.id),
							candidate_id: textValue(nextRow.candidate_id),
							decision: textValue(nextRow.decision),
							reason: textValue(nextRow.reason),
							decided_by: nextRow.decided_by ?? null,
							decided_at: textValue(nextRow.decided_at),
							audit_event_id: nextRow.audit_event_id ?? null,
							created_at: textValue(nextRow.created_at),
							updated_at: textValue(nextRow.updated_at),
							deleted_at: nextRow.deleted_at ?? null,
							created_by: nextRow.created_by ?? null,
							updated_by: nextRow.updated_by ?? null,
						};
					} else if (_table === "sikesra_export_jobs") {
						row = {
							tenant_id: textValue(nextRow.tenant_id),
							site_id: textValue(nextRow.site_id),
							id: textValue(nextRow.id),
							actor_user_id: nextRow.actor_user_id ?? null,
							actor_name: nextRow.actor_name ?? null,
							export_type: textValue(nextRow.export_type),
							entity_type: nextRow.entity_type ?? null,
							requested_fields_json: textValue(nextRow.requested_fields_json),
							filters_json: textValue(nextRow.filters_json),
							sensitivity_level: textValue(nextRow.sensitivity_level),
							reason: nextRow.reason ?? null,
							status: textValue(nextRow.status),
							file_object_id: nextRow.file_object_id ?? null,
							result_summary_json: textValue(nextRow.result_summary_json),
							error_message: nextRow.error_message ?? null,
							requested_at: textValue(nextRow.requested_at),
							completed_at: nextRow.completed_at ?? null,
							created_at: textValue(nextRow.created_at),
							updated_at: textValue(nextRow.updated_at),
							deleted_at: nextRow.deleted_at ?? null,
							created_by: nextRow.created_by ?? null,
							updated_by: nextRow.updated_by ?? null,
						};
					} else if (_table === "sikesra_permission_catalog") {
						row = { ...nextRow };
					} else if (_table === "sikesra_role_catalog") {
						row = { ...nextRow };
					} else if (_table === "sikesra_abac_attribute_catalog") {
						row = { ...nextRow };
					} else if (_table === "sikesra_custom_attribute_definitions") {
						row = { ...nextRow };
					} else if (_table === "sikesra_custom_attribute_values") {
						row = { ...nextRow };
					} else if (_table === "sikesra_custom_attribute_change_events") {
						row = { ...nextRow };
					} else if (_table === "sikesra_role_permission_assignments") {
						row = { ...nextRow };
					} else if (_table === "sikesra_user_role_assignments") {
						row = { ...nextRow };
					} else if (_table === "sikesra_user_scope_assignments") {
						row = { ...nextRow };
					} else if (_table === "sikesra_abac_subject_assignments") {
						row = { ...nextRow };
					} else if (_table === "sikesra_abac_resource_assignments") {
						row = { ...nextRow };
					} else if (_table === "sikesra_abac_policy_rules") {
						row = { ...nextRow };
					} else if (_table === "sikesra_delete_requests") {
						row = { ...nextRow };
					} else if (_table === "sikesra_delete_approvals") {
						row = { ...nextRow };
					} else if (_table === "sikesra_delete_snapshots") {
						row = { ...nextRow };
					} else if (_table === "sikesra_delete_events") {
						row = { ...nextRow };
					} else if (_table === "sikesra_verification_stage_state") {
						row = {
							tenant_id: textValue(nextRow.tenant_id),
							site_id: textValue(nextRow.site_id),
							registry_entity_id: textValue(nextRow.registry_entity_id),
							stage: textValue(nextRow.stage),
							current_level: textValue(nextRow.current_level),
							next_level: nextRow.next_level ?? null,
							status: textValue(nextRow.status),
							created_at: textValue(nextRow.created_at),
							updated_at: textValue(nextRow.updated_at),
							deleted_at: nextRow.deleted_at ?? null,
						};
					} else if (_table === "sikesra_verification_events") {
						row = {
							tenant_id: textValue(nextRow.tenant_id),
							site_id: textValue(nextRow.site_id),
							id: textValue(nextRow.id),
							registry_entity_id: textValue(nextRow.registry_entity_id),
							from_stage: nextRow.from_stage ?? null,
							to_stage: textValue(nextRow.to_stage),
							verifier_level: textValue(nextRow.verifier_level),
							verifier_user_id: nextRow.verifier_user_id ?? null,
							decision: textValue(nextRow.decision),
							reason: nextRow.reason ?? null,
							notes: nextRow.notes ?? null,
							region_scope_code: nextRow.region_scope_code ?? null,
							audit_event_id: nextRow.audit_event_id ?? null,
							created_at: textValue(nextRow.created_at),
							updated_at: textValue(nextRow.updated_at),
							deleted_at: nextRow.deleted_at ?? null,
							created_by: nextRow.created_by ?? null,
							updated_by: nextRow.updated_by ?? null,
						};
					} else {
						row = {
							plugin_id: textValue(nextRow.plugin_id),
							collection: textValue(nextRow.collection),
							id: textValue(nextRow.id),
							data: jsonTextValue(nextRow.data),
							created_at: textValue(nextRow.created_at),
							updated_at: textValue(nextRow.updated_at),
						};
					}
					const operation = {
						onConflict(_handler: unknown) {
							const statement = {
								async execute() {
									if (!row) return;
									if (_table === "sikesra_audit_events") {
										const auditRow = row as Record<string, unknown>;
										const index = auditTableRows.findIndex(
											(existing) => existing.id === auditRow.id,
										);
										if (index >= 0) {
											auditTableRows[index] = auditRow;
										} else {
											auditTableRows.push(auditRow);
										}
										collections.auditEvents.set(String(auditRow.id), auditRowToData(auditRow));
										return;
									}
									if (_table === "sikesra_settings") {
										upsertSettingsRow(row as Record<string, unknown>);
										return;
									}
									if (_table === "sikesra_registry_entities") {
										upsertD1CatalogRow(
											registryEntityTableRows,
											["tenant_id", "site_id", "id"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_code_sequences") {
										upsertD1CatalogRow(
											codeSequenceTableRows,
											["tenant_id", "site_id", "sequence_key"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_code_history") {
										upsertD1CatalogRow(
											codeHistoryTableRows,
											["tenant_id", "site_id", "id"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (isModuleDetailTable(_table)) {
										upsertD1CatalogRow(
											moduleDetailTableRows[_table]!,
											["tenant_id", "site_id", "registry_entity_id"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_data_types") {
										upsertD1CatalogRow(
											dataTypeTableRows,
											["tenant_id", "site_id", "id"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_data_subtypes") {
										upsertD1CatalogRow(
											dataSubtypeTableRows,
											["tenant_id", "site_id", "data_type_id", "code"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_official_regions") {
										upsertD1CatalogRow(
											officialRegionTableRows,
											["tenant_id", "site_id", "code"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_local_regions") {
										upsertD1CatalogRow(
											localRegionTableRows,
											["tenant_id", "site_id", "code"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_file_objects") {
										upsertD1CatalogRow(
											fileObjectTableRows,
											["tenant_id", "site_id", "id"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_supporting_documents") {
										upsertD1CatalogRow(
											supportingDocumentTableRows,
											["tenant_id", "site_id", "id"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_import_mapping_templates") {
										upsertD1CatalogRow(
											importMappingTemplateTableRows,
											["tenant_id", "site_id", "id"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_import_batches") {
										upsertD1CatalogRow(
											importBatchTableRows,
											["tenant_id", "site_id", "id"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_import_staging_rows") {
										upsertD1CatalogRow(
											importStagingRowTableRows,
											["tenant_id", "site_id", "id"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_duplicate_candidates") {
										upsertD1CatalogRow(
											duplicateCandidateTableRows,
											["tenant_id", "site_id", "id"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_duplicate_decisions") {
										upsertD1CatalogRow(
											duplicateDecisionTableRows,
											["tenant_id", "site_id", "id"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_export_jobs") {
										upsertD1CatalogRow(
											exportJobTableRows,
											["tenant_id", "site_id", "id"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_permission_catalog") {
										upsertD1CatalogRow(
											permissionCatalogTableRows,
											["tenant_id", "site_id", "slug"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_role_catalog") {
										upsertD1CatalogRow(
											roleCatalogTableRows,
											["tenant_id", "site_id", "slug"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_abac_attribute_catalog") {
										upsertD1CatalogRow(
											abacAttributeCatalogTableRows,
											["tenant_id", "site_id", "key", "target_type"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_custom_attribute_definitions") {
										upsertD1CatalogRow(
											customAttributeDefinitionTableRows,
											["tenant_id", "site_id", "id"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_custom_attribute_values") {
										upsertD1CatalogRow(
											customAttributeValueTableRows,
											["tenant_id", "site_id", "id"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_custom_attribute_change_events") {
										upsertD1CatalogRow(
											customAttributeChangeEventTableRows,
											["tenant_id", "site_id", "id"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_role_permission_assignments") {
										upsertD1CatalogRow(
											rolePermissionAssignmentTableRows,
											["tenant_id", "site_id", "role_slug", "permission_slug"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_user_role_assignments") {
										upsertD1CatalogRow(
											userRoleAssignmentTableRows,
											["tenant_id", "site_id", "id"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_user_scope_assignments") {
										upsertD1CatalogRow(
											userScopeAssignmentTableRows,
											["tenant_id", "site_id", "id"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_abac_subject_assignments") {
										upsertD1CatalogRow(
											abacSubjectAssignmentTableRows,
											["tenant_id", "site_id", "id"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_abac_resource_assignments") {
										upsertD1CatalogRow(
											abacResourceAssignmentTableRows,
											["tenant_id", "site_id", "id"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_abac_policy_rules") {
										upsertD1CatalogRow(
											abacPolicyRuleTableRows,
											["tenant_id", "site_id", "id"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_delete_requests") {
										upsertD1CatalogRow(
											deleteRequestTableRows,
											["tenant_id", "site_id", "id"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_delete_approvals") {
										upsertD1CatalogRow(
											deleteApprovalTableRows,
											["tenant_id", "site_id", "id"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_delete_snapshots") {
										upsertD1CatalogRow(
											deleteSnapshotTableRows,
											["tenant_id", "site_id", "id"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_delete_events") {
										upsertD1CatalogRow(
											deleteEventTableRows,
											["tenant_id", "site_id", "id"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_verification_stage_state") {
										upsertD1CatalogRow(
											verificationStageTableRows,
											["tenant_id", "site_id", "registry_entity_id"],
											row as Record<string, unknown>,
										);
										return;
									}
									if (_table === "sikesra_verification_events") {
										upsertD1CatalogRow(
											verificationEventTableRows,
											["tenant_id", "site_id", "id"],
											row as Record<string, unknown>,
										);
										return;
									}
									const storedRow = row as DbRow;
									const index = dbRows.findIndex(
										(existing) =>
											existing.plugin_id === storedRow.plugin_id &&
											existing.collection === storedRow.collection &&
											existing.id === storedRow.id,
									);
									if (index >= 0) {
										unsyncCollectionMap(dbRows[index]!);
										dbRows[index] = storedRow;
									} else {
										dbRows.push(storedRow);
									}
									syncCollectionMap(storedRow);
								},
							};
							return statement;
						},
						execute: async () => {
							if (!row) return;
							if (_table === "sikesra_audit_events") {
								const auditRow = row as Record<string, unknown>;
								const index = auditTableRows.findIndex((existing) => existing.id === auditRow.id);
								if (index >= 0) {
									auditTableRows[index] = auditRow;
								} else {
									auditTableRows.push(auditRow);
								}
								collections.auditEvents.set(String(auditRow.id), auditRowToData(auditRow));
								return;
							}
							if (_table === "sikesra_settings") {
								upsertSettingsRow(row as Record<string, unknown>);
								return;
							}
							if (_table === "sikesra_registry_entities") {
								upsertD1CatalogRow(
									registryEntityTableRows,
									["tenant_id", "site_id", "id"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_code_sequences") {
								upsertD1CatalogRow(
									codeSequenceTableRows,
									["tenant_id", "site_id", "sequence_key"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_code_history") {
								upsertD1CatalogRow(
									codeHistoryTableRows,
									["tenant_id", "site_id", "id"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (isModuleDetailTable(_table)) {
								upsertD1CatalogRow(
									moduleDetailTableRows[_table]!,
									["tenant_id", "site_id", "registry_entity_id"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_data_types") {
								upsertD1CatalogRow(
									dataTypeTableRows,
									["tenant_id", "site_id", "id"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_data_subtypes") {
								upsertD1CatalogRow(
									dataSubtypeTableRows,
									["tenant_id", "site_id", "data_type_id", "code"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_official_regions") {
								upsertD1CatalogRow(
									officialRegionTableRows,
									["tenant_id", "site_id", "code"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_local_regions") {
								upsertD1CatalogRow(
									localRegionTableRows,
									["tenant_id", "site_id", "code"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_file_objects") {
								upsertD1CatalogRow(
									fileObjectTableRows,
									["tenant_id", "site_id", "id"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_supporting_documents") {
								upsertD1CatalogRow(
									supportingDocumentTableRows,
									["tenant_id", "site_id", "id"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_import_mapping_templates") {
								upsertD1CatalogRow(
									importMappingTemplateTableRows,
									["tenant_id", "site_id", "id"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_import_batches") {
								upsertD1CatalogRow(
									importBatchTableRows,
									["tenant_id", "site_id", "id"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_import_staging_rows") {
								upsertD1CatalogRow(
									importStagingRowTableRows,
									["tenant_id", "site_id", "id"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_duplicate_candidates") {
								upsertD1CatalogRow(
									duplicateCandidateTableRows,
									["tenant_id", "site_id", "id"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_duplicate_decisions") {
								upsertD1CatalogRow(
									duplicateDecisionTableRows,
									["tenant_id", "site_id", "id"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_export_jobs") {
								upsertD1CatalogRow(
									exportJobTableRows,
									["tenant_id", "site_id", "id"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_permission_catalog") {
								upsertD1CatalogRow(
									permissionCatalogTableRows,
									["tenant_id", "site_id", "slug"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_role_catalog") {
								upsertD1CatalogRow(
									roleCatalogTableRows,
									["tenant_id", "site_id", "slug"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_abac_attribute_catalog") {
								upsertD1CatalogRow(
									abacAttributeCatalogTableRows,
									["tenant_id", "site_id", "key", "target_type"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_custom_attribute_definitions") {
								upsertD1CatalogRow(
									customAttributeDefinitionTableRows,
									["tenant_id", "site_id", "id"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_custom_attribute_values") {
								upsertD1CatalogRow(
									customAttributeValueTableRows,
									["tenant_id", "site_id", "id"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_custom_attribute_change_events") {
								upsertD1CatalogRow(
									customAttributeChangeEventTableRows,
									["tenant_id", "site_id", "id"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_role_permission_assignments") {
								upsertD1CatalogRow(
									rolePermissionAssignmentTableRows,
									["tenant_id", "site_id", "role_slug", "permission_slug"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_user_role_assignments") {
								upsertD1CatalogRow(
									userRoleAssignmentTableRows,
									["tenant_id", "site_id", "id"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_user_scope_assignments") {
								upsertD1CatalogRow(
									userScopeAssignmentTableRows,
									["tenant_id", "site_id", "id"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_abac_subject_assignments") {
								upsertD1CatalogRow(
									abacSubjectAssignmentTableRows,
									["tenant_id", "site_id", "id"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_abac_resource_assignments") {
								upsertD1CatalogRow(
									abacResourceAssignmentTableRows,
									["tenant_id", "site_id", "id"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_abac_policy_rules") {
								upsertD1CatalogRow(
									abacPolicyRuleTableRows,
									["tenant_id", "site_id", "id"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_delete_requests") {
								upsertD1CatalogRow(
									deleteRequestTableRows,
									["tenant_id", "site_id", "id"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_delete_approvals") {
								upsertD1CatalogRow(
									deleteApprovalTableRows,
									["tenant_id", "site_id", "id"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_delete_snapshots") {
								upsertD1CatalogRow(
									deleteSnapshotTableRows,
									["tenant_id", "site_id", "id"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_delete_events") {
								upsertD1CatalogRow(
									deleteEventTableRows,
									["tenant_id", "site_id", "id"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_verification_stage_state") {
								upsertD1CatalogRow(
									verificationStageTableRows,
									["tenant_id", "site_id", "registry_entity_id"],
									row as Record<string, unknown>,
								);
								return;
							}
							if (_table === "sikesra_verification_events") {
								upsertD1CatalogRow(
									verificationEventTableRows,
									["tenant_id", "site_id", "id"],
									row as Record<string, unknown>,
								);
								return;
							}
							const storedRow = row as DbRow;
							const index = dbRows.findIndex(
								(existing) =>
									existing.plugin_id === storedRow.plugin_id &&
									existing.collection === storedRow.collection &&
									existing.id === storedRow.id,
							);
							if (index >= 0) {
								unsyncCollectionMap(dbRows[index]!);
								dbRows[index] = storedRow;
							} else {
								dbRows.push(storedRow);
							}
							syncCollectionMap(storedRow);
						},
					};
					return operation;
				},
			};
		},
		deleteFrom(_table: string) {
			const filters: Record<string, string> = {};
			const query = {
				where(column: string, _op: string, value: string) {
					filters[column] = value;
					return query;
				},
				async execute() {
					if (_table === "sikesra_registry_entities") {
						for (let index = registryEntityTableRows.length - 1; index >= 0; index -= 1) {
							const row = registryEntityTableRows[index]!;
							let matches = true;
							for (const [key, value] of Object.entries(filters)) {
								if ((row as Record<string, string>)[key] !== value) {
									matches = false;
									break;
								}
							}
							if (!matches) continue;
							registryEntityTableRows.splice(index, 1);
						}
						return;
					}
					if (_table === "sikesra_audit_events") {
						for (let index = auditTableRows.length - 1; index >= 0; index -= 1) {
							const row = auditTableRows[index]!;
							let matches = true;
							for (const [key, value] of Object.entries(filters)) {
								if ((row as Record<string, string>)[key] !== value) {
									matches = false;
									break;
								}
							}
							if (!matches) continue;
							collections.auditEvents.delete(String(row.id));
							auditTableRows.splice(index, 1);
						}
						return;
					}
					if (_table === "sikesra_user_role_assignments") {
						for (let index = userRoleAssignmentTableRows.length - 1; index >= 0; index -= 1) {
							const row = userRoleAssignmentTableRows[index]!;
							let matches = true;
							for (const [key, value] of Object.entries(filters)) {
								if ((row as Record<string, string>)[key] !== value) {
									matches = false;
									break;
								}
							}
							if (!matches) continue;
							collections.userRoleAssignments.delete(
								String(row.emdash_user_id ?? row.user_id ?? row.id),
							);
							userRoleAssignmentTableRows.splice(index, 1);
						}
						return;
					}
					if (_table === "sikesra_user_scope_assignments") {
						for (let index = userScopeAssignmentTableRows.length - 1; index >= 0; index -= 1) {
							const row = userScopeAssignmentTableRows[index]!;
							let matches = true;
							for (const [key, value] of Object.entries(filters)) {
								if ((row as Record<string, string>)[key] !== value) {
									matches = false;
									break;
								}
							}
							if (!matches) continue;
							collections.userScopeAssignments.delete(String(row.id));
							userScopeAssignmentTableRows.splice(index, 1);
						}
						return;
					}
					for (let index = dbRows.length - 1; index >= 0; index -= 1) {
						const row = dbRows[index]!;
						let matches = true;
						for (const [key, value] of Object.entries(filters)) {
							if ((row as Record<string, string>)[key] !== value) {
								matches = false;
								break;
							}
						}
						if (!matches) continue;
						unsyncCollectionMap(row);
						dbRows.splice(index, 1);
					}
				},
			};
			return query;
		},
	};
	const cron = {
		schedule: vi.fn(async () => {}),
		cancel: vi.fn(async () => {}),
	};
	const emdashUsers = [
		{
			id: "user-demo-sikesra-admin",
			email: "admin@example.test",
			name: "SIKESRA Admin",
			role: 3,
			createdAt: "2026-01-01T00:00:00.000Z",
		},
		{
			id: "user-demo-doc-reviewer",
			email: "reviewer@example.test",
			name: "Document Reviewer",
			role: 2,
			createdAt: "2026-01-02T00:00:00.000Z",
		},
	];

	const createCollection = (store: Map<string, unknown>) => ({
		put: vi.fn(async (id: string, value: unknown) => {
			store.set(id, value);
		}),
		get: vi.fn(async (id: string) => (store.has(id) ? store.get(id) : null)),
		delete: vi.fn(async (id: string) => store.delete(id)),
		count: vi.fn(async () => store.size),
		query: vi.fn(async () => ({
			items: Array.from(store.entries(), ([id, data]) => ({ id, data })),
			cursor: undefined,
			hasMore: false,
		})),
	});

	return {
		ctx: {
			plugin: { id: AWCMS_SIKESRA_PLUGIN_ID, version: "0.0.1" },
			request: new Request("https://example.test"),
			requestMeta: { ip: "127.0.0.1" },
			input: {},
			db,
			cron,
			users: {
				get: vi.fn(async (id: string) => emdashUsers.find((user) => user.id === id) ?? null),
				getByEmail: vi.fn(
					async (email: string) => emdashUsers.find((user) => user.email === email) ?? null,
				),
				list: vi.fn(async () => ({ items: emdashUsers, nextCursor: undefined })),
			},
			log: {
				info: vi.fn(),
				warn: vi.fn(),
				error: vi.fn(),
				debug: vi.fn(),
			},
			kv: {
				get: vi.fn(async (key: string) => (kvData.has(key) ? kvData.get(key) : null)),
				set: vi.fn(async (key: string, value: unknown) => {
					kvData.set(key, value);
				}),
				delete: vi.fn(async (key: string) => kvData.delete(key)),
				list: vi.fn(async (prefix?: string) =>
					[...kvData.entries()]
						.filter(([key]) => !prefix || key.startsWith(prefix))
						.map(([key, value]) => ({ key, value })),
				),
			},
			storage: {
				sikesra_audit_events: createCollection(collections.auditEvents),
				sikesra_access_change_events: createCollection(collections.accessChangeEvents),
				sikesra_abac_change_events: createCollection(collections.abacChangeEvents),
				sikesra_registry_entities: createCollection(collections.registryEntities),
				sikesra_settings_state: createCollection(collections.settingsState),
				sikesra_plugin_state: createCollection(collections.pluginState),
				sikesra_verification_stage_state: createCollection(collections.verificationStageState),
				sikesra_abac_attribute_catalog: createCollection(collections.abacAttributeCatalog),
				sikesra_abac_policy_rules: createCollection(collections.abacPolicyRules),
				sikesra_abac_resource_assignments: createCollection(collections.abacResourceAssignments),
				sikesra_abac_subject_assignments: createCollection(collections.abacSubjectAssignments),
				sikesra_content_snapshots: createCollection(collections.contentSnapshots),
				sikesra_permission_catalog: createCollection(collections.permissionCatalog),
				sikesra_role_catalog: createCollection(collections.roleCatalog),
				sikesra_role_permission_assignments: createCollection(
					collections.rolePermissionAssignments,
				),
				sikesra_user_role_assignments: createCollection(collections.userRoleAssignments),
				sikesra_user_scope_assignments: createCollection(collections.userScopeAssignments),
				sikesra_supporting_documents: createCollection(collections.supportingDocuments),
				sikesra_verification_events: createCollection(collections.verificationEvents),
			},
		},
		collections,
		db,
		dbRows,
		auditTableRows,
		registryEntityTableRows,
		codeSequenceTableRows,
		codeHistoryTableRows,
		moduleDetailTableRows,
		settingsTableRows,
		dataTypeTableRows,
		dataSubtypeTableRows,
		officialRegionTableRows,
		localRegionTableRows,
		fileObjectTableRows,
		supportingDocumentTableRows,
		importBatchTableRows,
		importStagingRowTableRows,
		importMappingTemplateTableRows,
		duplicateCandidateTableRows,
		duplicateDecisionTableRows,
		exportJobTableRows,
		permissionCatalogTableRows,
		roleCatalogTableRows,
		abacAttributeCatalogTableRows,
		customAttributeDefinitionTableRows,
		customAttributeValueTableRows,
		customAttributeChangeEventTableRows,
		rolePermissionAssignmentTableRows,
		userRoleAssignmentTableRows,
		userScopeAssignmentTableRows,
		abacSubjectAssignmentTableRows,
		abacResourceAssignmentTableRows,
		abacPolicyRuleTableRows,
		deleteRequestTableRows,
		deleteApprovalTableRows,
		deleteSnapshotTableRows,
		deleteEventTableRows,
		verificationStageTableRows,
		verificationEventTableRows,
		seedDbRow,
		kvData,
		cron,
	};
}

function collectDefaultRegionCodes() {
	const codes = new Set<string>();
	for (const province of DEFAULT_REGION_TREE) {
		codes.add(province.code);
		for (const regency of province.regencies) {
			codes.add(regency.code);
			for (const district of regency.districts) {
				codes.add(district.code);
				for (const village of district.villages) {
					codes.add(village.code);
				}
			}
		}
	}
	return codes;
}

describe("awcms micro sikesra plugin", () => {
	it("builds a descriptor without touching EmDash core", () => {
		const descriptor = awcmsMicroSikesraPlugin();
		const storage = descriptor.storage ?? {};

		expect(descriptor.id).toBe("awcms-micro-sikesra");
		expect(descriptor.adminEntry).toBe("@awcms-micro/plugin-sikesra/admin");
		expect(descriptor.capabilities).toEqual([...AWCMS_SIKESRA_CAPABILITIES]);
		expect(descriptor.storage).toEqual(AWCMS_SIKESRA_DESCRIPTOR_STORAGE);
		expect(awcmsMicroExamplePlugin()).toEqual(descriptor);
		expect(descriptor.entrypoint).toBe("@awcms-micro/plugin-sikesra");
		expect(Object.keys(storage)).toEqual(
			expect.arrayContaining([
				"sikesra_access_change_events",
				"sikesra_abac_change_events",
				"sikesra_registry_entities",
				"sikesra_settings_state",
				"sikesra_plugin_state",
				"sikesra_verification_stage_state",
				"sikesra_abac_attribute_catalog",
				"sikesra_abac_policy_rules",
				"sikesra_abac_resource_assignments",
				"sikesra_abac_subject_assignments",
				"sikesra_content_snapshots",
				"sikesra_permission_catalog",
				"sikesra_role_catalog",
				"sikesra_role_permission_assignments",
				"sikesra_user_role_assignments",
				"sikesra_supporting_documents",
				"sikesra_verification_events",
			]),
		);
		expect(Object.keys(storage).every((key) => key.startsWith("sikesra_"))).toBe(true);
		expect(AWCMS_SIKESRA_D1_TABLE_NAMES.every((table) => table.startsWith("sikesra_"))).toBe(true);
		expect(AWCMS_SIKESRA_D1_TABLE_NAMES).toEqual(
			expect.arrayContaining([
				"sikesra_registry_entities",
				"sikesra_supporting_documents",
				"sikesra_verification_events",
				"sikesra_audit_events",
				"sikesra_import_batches",
				"sikesra_export_jobs",
			]),
		);
		expect(AWCMS_SIKESRA_STORAGE.sikesra_access_change_events.indexes).toEqual([
			"timestamp",
			"kind",
			"scope",
			["scope", "timestamp"],
		]);
		expect(AWCMS_SIKESRA_STORAGE.sikesra_abac_change_events.indexes).toEqual([
			"timestamp",
			"kind",
			"scope",
			["scope", "timestamp"],
		]);
		expect(AWCMS_SIKESRA_STORAGE.sikesra_content_snapshots.indexes).toContainEqual([
			"contentId",
			"timestamp",
		]);
		expect(descriptor.adminPages).toEqual(AWCMS_SIKESRA_ADMIN_PAGES);
		expect(descriptor.adminWidgets).toEqual(AWCMS_SIKESRA_ADMIN_WIDGETS);
	});

	it("exposes the expected permission namespace", () => {
		expect(AWCMS_SIKESRA_PERMISSION_LIST).toContain("awcms:sikesra:dashboard:read");
		expect(AWCMS_SIKESRA_PERMISSION_LIST).toContain("awcms:sikesra:audit:read");
		expect(AWCMS_SIKESRA_PERMISSION_LIST).toContain("awcms:sikesra:permissions:write");
		expect(AWCMS_SIKESRA_PERMISSION_LIST).toContain("sikesra.registry.read");
		expect(AWCMS_SIKESRA_PERMISSION_LIST).toContain("sikesra.verification.approve");
		expect(AWCMS_SIKESRA_PERMISSION_LIST).toContain("sikesra.rbac.manage");
		expect(AWCMS_SIKESRA_PERMISSION_LIST).toContain("sikesra.lifecycle.create");
		expect(AWCMS_SIKESRA_PERMISSION_LIST).toContain("sikesra.lifecycle.read_list");
		expect(AWCMS_SIKESRA_PERMISSION_LIST).toContain("sikesra.lifecycle.read_detail");
		expect(AWCMS_SIKESRA_PERMISSION_LIST).toContain("sikesra.lifecycle.update");
		expect(AWCMS_SIKESRA_PERMISSION_LIST).toContain("sikesra.lifecycle.soft_delete");
		expect(AWCMS_SIKESRA_PERMISSION_LIST).toContain("sikesra.lifecycle.restore");
		expect(AWCMS_SIKESRA_PERMISSION_LIST).toContain("sikesra.lifecycle.archive");
		expect(AWCMS_SIKESRA_PERMISSION_LIST).toContain("sikesra.lifecycle.permanent_delete");
		for (const permission of AWCMS_SIKESRA_CRUD_PERMISSION_LIST) {
			expect(AWCMS_SIKESRA_PERMISSION_LIST).toContain(permission);
		}
	});

	it("declares issue #139 CRUD governance policies for every feature group", () => {
		const expectedOperations = [
			"create",
			"read_list",
			"read_detail",
			"update",
			"soft_delete",
			"restore",
			"archive",
			"permanent_delete",
		];
		expect(SIKESRA_CRUD_FEATURE_POLICIES.map((policy) => policy.feature)).toEqual(
			expect.arrayContaining([
				"registry",
				"person",
				"module_detail",
				"document",
				"file_metadata",
				"import",
				"export",
				"verification",
				"settings",
				"region",
				"data_type",
				"field_standard",
				"custom_attribute",
				"custom_attribute_value",
				"rbac",
				"abac",
				"user_assignment",
				"audit",
			]),
		);
		for (const policy of SIKESRA_CRUD_FEATURE_POLICIES) {
			expect(policy.tables.every((table) => table.startsWith("sikesra_"))).toBe(true);
			expect(policy.operations.map((operation) => operation.operation)).toEqual(expectedOperations);
			for (const operation of policy.operations) {
				expect(operation.permissionSlug.startsWith("sikesra.")).toBe(true);
				expect(AWCMS_SIKESRA_PERMISSION_LIST).toContain(operation.permissionSlug);
				expect(operation.auditEventKind).toMatch(/^crud\./);
			}
			const permanentDelete = policy.operations.find(
				(operation) => operation.operation === "permanent_delete",
			)!;
			expect(permanentDelete.allowedRoles).toEqual(["sikesra_super_admin"]);
			expect(permanentDelete.requiresReason).toBe(true);
			expect(permanentDelete.requiresConfirmation).toBe(true);
			expect(permanentDelete.requiresBackupSnapshot).toBe(true);
			expect(permanentDelete.allowedWhenReferencedByOtherRecords).toBe(false);
		}
	});

	it("creates structured audit records", () => {
		const record = createAuditRecord({
			kind: "settings.update",
			scope: "settings",
			actor: "system",
			summary: "Updated settings",
			metadata: { governanceMode: "review" },
		});

		expect(record.kind).toBe("settings.update");
		expect(record.scope).toBe("settings");
		expect(record.actor).toBe("system");
		expect(record.summary).toBe("Updated settings");
	});

	it("redacts sensitive audit metadata values", () => {
		const record = createAuditRecord({
			kind: "registry.entity.create",
			scope: "registry",
			actor: "system",
			summary: "Created sensitive entity",
			metadata: {
				label: "Safe label",
				nik: "3201010101010001",
				alamat_ktp_detail: "Jl. Rahasia 1",
				documentMetadata: {
					storage_key: "private/raw.pdf",
					checksum: "sha256-secret",
				},
			},
		});

		expect(record.metadata).toMatchObject({
			label: "Safe label",
			nik: "[REDACTED]",
			alamat_ktp_detail: "[REDACTED]",
			documentMetadata: {
				storage_key: "[REDACTED]",
				checksum: "[REDACTED]",
			},
		});
		expect(JSON.stringify(record.metadata)).not.toContain("3201010101010001");
		expect(JSON.stringify(record.metadata)).not.toContain("private/raw.pdf");
	});

	it("stamps audit events with request user headers", async () => {
		const { ctx, collections, settingsTableRows: _settingsTableRows } = createMockContext();
		const routes = createNativeRoutes();
		const request = new Request("https://example.test", {
			headers: {
				"X-Sikesra-User-Id": "user-123",
				"X-Sikesra-User-Name": "Ada Lovelace",
			},
		});

		await routes["state/touch"]!.handler({
			...ctx,
			request,
			input: { note: "stamp check" },
		} as any);

		const stored = [...collections.auditEvents.values()].find(
			(item: any) => item.kind === "state.touch",
		) as any;
		expect(stored).toMatchObject({ userId: "user-123", userName: "Ada Lovelace" });
	});

	it("requires SIKESRA audit permission for audit list", async () => {
		const { ctx } = createMockContext();
		const routes = createNativeRoutes();

		const denied = (await routes["audit/list"]!.handler({
			...ctx,
			input: {},
		} as any)) as any;
		expect(denied).toMatchObject({
			success: false,
			error: { code: "UNAUTHENTICATED" },
		});

		const allowed = (await routes["audit/list"]!.handler({
			...ctx,
			request: new Request("https://example.test", {
				headers: { "X-Sikesra-User-Id": "user-demo-sikesra-admin" },
			}),
			input: {},
		} as any)) as any;
		expect(allowed.items).toBeDefined();
	});

	it("declares admin pages, widgets, blocks, and field widgets", () => {
		expect(AWCMS_SIKESRA_ADMIN_PAGES).toHaveLength(24);
		expect(AWCMS_SIKESRA_ADMIN_WIDGETS[0]?.id).toBe("governance-status");
		expect(AWCMS_SIKESRA_ADMIN_WIDGETS[1]?.id).toBe("access-rights-health");
		expect(AWCMS_SIKESRA_ADMIN_WIDGETS[2]?.id).toBe("abac-policy-status");
		expect(AWCMS_SIKESRA_PORTABLE_TEXT_BLOCKS[0]?.type).toBe("awcms-access-note");
		expect(AWCMS_SIKESRA_FIELD_WIDGETS[0]?.name).toBe("status-badge");
		expect(AWCMS_SIKESRA_ADMIN_PAGES.map((page) => page.path).toSorted()).toEqual(
			[
				"/abac/attributes",
				"/abac/policies",
				"/abac/preview",
				"/access/matrix",
				"/access/permissions",
				"/access/preview",
				"/access/roles",
				"/access/scopes",
				"/access/users",
				"/archives",
				"/audit",
				"/custom-attributes/definitions",
				"/custom-attributes/values",
				"/data-types",
				"/delete-requests",
				"/documents",
				"/field-standards",
				"/import",
				"/overview",
				"/regions",
				"/registry",
				"/reports",
				"/settings",
				"/verification",
			].toSorted(),
		);
	});

	it("normalizes partial admin summary responses before rendering counters", () => {
		const summary = normalizeSummaryResponse({ settings: {} });

		expect(summary?.counters).toEqual({
			auditCount: 0,
			lifecycleCount: 0,
			publicHits: 0,
		});
		expect(summary?.settings).toMatchObject({
			publicStatusLabel: "healthy",
			auditRetentionDays: 30,
			governanceMode: "review",
		});
		expect(summary?.recentEvents).toEqual([]);
	});

	it("normalizes partial access health responses before rendering gap counts", () => {
		const health = normalizeAccessHealthResponse({
			permissionCount: 2,
			roleCount: 1,
			assignmentCount: 0,
			userAssignmentCount: 0,
		} as Parameters<typeof normalizeAccessHealthResponse>[0]);

		expect(health.rolesWithoutPermissions).toEqual([]);
		expect(health.usersWithoutRoles).toEqual([]);
	});

	it("declares dashboard module cards and a filtered header menu model", () => {
		expect(AWCMS_SIKESRA_DASHBOARD_MODULE_CARDS).toHaveLength(8);
		expect(AWCMS_SIKESRA_DASHBOARD_MODULE_CARDS.map((card) => card.id)).toEqual(
			DEFAULT_DATA_TYPES.map((type) => type.id),
		);
		expect(AWCMS_SIKESRA_DASHBOARD_MODULE_CARDS.map((card) => card.href)).toEqual([
			"/_emdash/admin/plugins/awcms-micro-sikesra/registry",
			"/_emdash/admin/plugins/awcms-micro-sikesra/registry",
			"/_emdash/admin/plugins/awcms-micro-sikesra/verification",
			"/_emdash/admin/plugins/awcms-micro-sikesra/reports",
			"/_emdash/admin/plugins/awcms-micro-sikesra/access/roles",
			"/_emdash/admin/plugins/awcms-micro-sikesra/audit",
			"/_emdash/admin/plugins/awcms-micro-sikesra/abac/preview",
			"/_emdash/admin/plugins/awcms-micro-sikesra/documents",
		]);
		expect(
			AWCMS_SIKESRA_DASHBOARD_MODULE_CARDS.every((card) =>
				card.href.startsWith("/_emdash/admin/plugins/awcms-micro-sikesra/"),
			),
		).toBe(true);
		expect(AWCMS_SIKESRA_PLUGIN_HEADER_MENU.map((item) => item.label)).toEqual([
			"Overview",
			"Data Entry",
			"Verification",
			"Reports",
			"Settings",
		]);

		const filtered = filterPluginHeaderMenu(
			[
				{
					id: "parent",
					label: "Parent",
					href: "/parent",
					permission: undefined,
					children: [
						{
							id: "read-child",
							label: "Read child",
							href: "/parent/read",
							permission: "awcms:sikesra:parent:read",
						},
						{
							id: "write-child",
							label: "Write child",
							href: "/parent/write",
							permission: "awcms:sikesra:parent:write",
						},
					],
				},
				{
					id: "blocked",
					label: "Blocked",
					href: "/blocked",
					permission: "awcms:sikesra:blocked:write",
					children: [
						{
							id: "blocked-child",
							label: "Blocked child",
							href: "/blocked/child",
							permission: "awcms:sikesra:blocked:write",
						},
					],
				},
			] as any,
			(permission) => !permission || permission === "awcms:sikesra:parent:read",
		);

		expect(filtered).toHaveLength(1);
		expect(filtered[0]?.children).toHaveLength(1);
		expect(filtered[0]?.children?.[0]?.label).toBe("Read child");
	});

	it("ships deterministic SIKESRA reference fixtures", () => {
		expect(SIKESRA_REFERENCE_FIXTURES.registryEntities).toHaveLength(3);
		expect(SIKESRA_REFERENCE_FIXTURES.supportingDocuments).toHaveLength(4);
		expect(SIKESRA_REFERENCE_FIXTURES.verificationEvents).toHaveLength(3);
		expect(SIKESRA_REFERENCE_FIXTURES.publicAggregate.caveat).toContain("coarse counts");
		expect(SIKESRA_REFERENCE_FIXTURES.registryEntities[0]?.verificationStage).toBe(
			"active_verified",
		);
		expect(SIKESRA_REFERENCE_FIXTURES.registryEntities[2]?.sensitivity).toBe("highly_restricted");
		expect(
			SIKESRA_REFERENCE_FIXTURES.publicAggregate.categories.some((item) => item.suppressed),
		).toBe(true);
		expect(SIKESRA_REFERENCE_FIXTURES.abacPolicies[0]?.effect).toBe("deny");
	});

	it("keeps SIKESRA reference fixture regions aligned with the default region tree", () => {
		const defaultRegionCodes = collectDefaultRegionCodes();

		for (const entity of SIKESRA_REFERENCE_FIXTURES.registryEntities) {
			expect(defaultRegionCodes.has(entity.region.provinceCode)).toBe(true);
			expect(defaultRegionCodes.has(entity.region.regencyCode)).toBe(true);
			expect(defaultRegionCodes.has(entity.region.districtCode)).toBe(true);
			expect(defaultRegionCodes.has(entity.region.villageCode)).toBe(true);
		}

		for (const event of SIKESRA_REFERENCE_FIXTURES.verificationEvents) {
			if (event.verifierRegionScope) {
				expect(defaultRegionCodes.has(event.verifierRegionScope)).toBe(true);
			}
		}
	});

	it("masks sensitive values when access is denied", () => {
		expect(maskSensitive("0912345678", true)).toBe("0912345678");
		expect(maskSensitive("0912345678", false)).toBe("••••••");
		expect(maskSensitive(undefined, false)).toBeNull();
	});

	it("defaults non-public SIKESRA records to masked output", () => {
		for (const doc of SIKESRA_REFERENCE_FIXTURES.supportingDocuments) {
			const expected = doc.sensitivity === "public_safe" ? doc.registryEntityId : "••••••";

			expect(maskSensitiveBySensitivity(doc.registryEntityId, doc.sensitivity)).toBe(expected);
		}

		expect(maskSensitiveBySensitivity("registry-entity-guru-agama-01", "restricted", true)).toBe(
			"registry-entity-guru-agama-01",
		);
	});

	it("exposes public and protected routes", async () => {
		const { ctx, collections, settingsTableRows } = createMockContext();
		const routes = createNativeRoutes();
		const adminRequest = createAdminRequest();

		await routes["settings/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				publicStatusLabel: "green",
				auditRetentionDays: 14,
				governanceMode: "observe",
				metadataCanonicalBase: "https://example.test",
			},
		} as any);

		const publicResult = (await routes["public/status"]!.handler({
			...ctx,
			input: {},
		} as any)) as any;
		expect(Object.keys(publicResult).toSorted()).toEqual([
			"governanceMode",
			"plugin",
			"publicAggregate",
			"status",
		]);
		expect(publicResult.status).toBe("green");
		expect(publicResult.plugin.visibility).toBe("public-safe");
		expect(publicResult.publicAggregate.categories[0]).toMatchObject({
			total: 0,
			verified: 0,
			suppressed: true,
			suppressionReason: "Count is below the configured small-cell threshold of 3.",
		});
		expect(JSON.stringify(publicResult)).not.toContain("registry-entity-");
		expect(publicResult).not.toHaveProperty("storageKey");
		expect(publicResult).not.toHaveProperty("userId");
		expect(settingsTableRows).toHaveLength(6);
		expect(collections.settingsState.size).toBe(0);
		expect(collections.pluginState.size).toBeGreaterThan(0);
		expect(collections.pluginState.get("state:publicStatusHits")).toMatchObject({
			key: "state:publicStatusHits",
			value: 1,
		});
		expect(settingsTableRows.find((row) => row.key === "governanceMode")).toMatchObject({
			key: "governanceMode",
			value_json: '"observe"',
		});
		expect(collections.auditEvents.size).toBeGreaterThan(0);
	});

	it("keeps the public status route available when the D1 verification stage table is unavailable", async () => {
		const { ctx, db } = createMockContext();
		const originalSelectFrom = db.selectFrom.bind(db);
		db.selectFrom = ((table: string) => {
			if (table !== "sikesra_verification_stage_state") return originalSelectFrom(table);
			const query = {
				select() {
					return query;
				},
				where() {
					return query;
				},
				async execute() {
					throw new Error("no such table: sikesra_verification_stage_state");
				},
			};
			return query;
		}) as typeof db.selectFrom;

		const result = (await createNativeRoutes()["public/status"]!.handler({
			...ctx,
			input: {},
		} as any)) as any;

		expect(result.plugin).toMatchObject({ id: "awcms-micro-sikesra", visibility: "public-safe" });
		expect(result.publicAggregate.categories.length).toBeGreaterThan(0);
	});

	it("keeps the public status route available when fallback plugin storage is unavailable", async () => {
		const { ctx } = createMockContext();
		ctx.storage.sikesra_plugin_state!.query = vi.fn(async () => {
			throw new Error("no such table: _emdash_plugin_storage");
		});
		ctx.storage.sikesra_plugin_state!.put = vi.fn(async () => {
			throw new Error("no such table: _emdash_plugin_storage");
		});
		ctx.storage.sikesra_registry_entities!.query = vi.fn(async () => {
			throw new Error("no such table: _emdash_plugin_storage");
		});

		const result = (await createNativeRoutes()["public/status"]!.handler({
			...ctx,
			input: {},
		} as any)) as any;

		expect(result.plugin).toMatchObject({ id: "awcms-micro-sikesra", visibility: "public-safe" });
		expect(result.publicAggregate.categories.length).toBeGreaterThan(0);
	});

	it("returns a public-safe status fallback for production schema drift errors", async () => {
		const { ctx } = createMockContext();
		ctx.kv.get = vi.fn(async () => {
			throw new Error("D1_ERROR: no such column: tenant_id");
		});

		const result = (await createNativeRoutes()["public/status"]!.handler({
			...ctx,
			input: {},
		} as any)) as any;

		expect(result).toMatchObject({
			plugin: { id: "awcms-micro-sikesra", visibility: "public-safe" },
			status: "healthy",
			governanceMode: "review",
		});
		expect(result.publicAggregate.categories).toEqual([]);
		expect(JSON.stringify(result)).not.toContain("registry-entity-");
	});

	it("returns a public-safe status fallback for unexpected public route errors", async () => {
		const { ctx } = createMockContext();
		ctx.kv.get = vi.fn(async () => {
			throw new TypeError("unexpected production route failure");
		});

		const result = (await createNativeRoutes()["public/status"]!.handler({
			...ctx,
			input: {},
		} as any)) as any;

		expect(result.plugin).toMatchObject({ id: "awcms-micro-sikesra", visibility: "public-safe" });
		expect(result.publicAggregate.categories).toEqual([]);
		expect(JSON.stringify(result)).not.toContain("unexpected production route failure");
	});

	it("does not fail lifecycle hooks when the production audit table has a legacy schema", async () => {
		const { ctx, db } = createMockContext();
		const originalInsertInto = db.insertInto.bind(db);
		db.insertInto = ((table: string) => {
			if (table !== "sikesra_audit_events") return originalInsertInto(table);
			return {
				values() {
					return {
						async execute() {
							throw new Error("D1_ERROR: no such column: tenant_id");
						},
					};
				},
			};
		}) as typeof db.insertInto;

		const hooks = createSharedHooks();
		const activateHook =
			typeof hooks?.["plugin:activate"] === "function"
				? hooks["plugin:activate"]
				: hooks?.["plugin:activate"]?.handler;
		await expect(activateHook?.({} as any, ctx as any)).resolves.toBeUndefined();
	});

	it("reads and writes SIKESRA data types through dedicated D1 catalog tables", async () => {
		const { ctx, dataTypeTableRows, dataSubtypeTableRows, kvData } = createMockContext();
		const routes = createNativeRoutes();
		const adminRequest = createAdminRequest();
		const nextDataTypes = [
			{
				id: "rumah_ibadah",
				code: "01",
				label: "Rumah Ibadah",
				subTypes: [{ code: "01", label: "Masjid" }],
			},
		];

		await routes["data-types/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: nextDataTypes,
		} as any);
		const result = await routes["data-types/get"]!.handler({
			...ctx,
			request: adminRequest,
			input: {},
		} as any);

		expect(result).toEqual(nextDataTypes);
		expect(dataTypeTableRows).toHaveLength(1);
		expect(dataSubtypeTableRows).toHaveLength(1);
		expect(dataTypeTableRows[0]).toMatchObject({
			tenant_id: "t-local-dev",
			site_id: "default",
			id: "rumah_ibadah",
			code: "01",
			label: "Rumah Ibadah",
			status: "active",
		});
		expect(dataSubtypeTableRows[0]).toMatchObject({
			data_type_id: "rumah_ibadah",
			code: "01",
			label: "Masjid",
			status: "active",
		});
		expect(kvData.has("custom:data-types")).toBe(false);
	});

	it("reads and writes official regions through dedicated D1 region tables", async () => {
		const { ctx, officialRegionTableRows, kvData } = createMockContext();
		const routes = createNativeRoutes();
		const adminRequest = createAdminRequest();
		const nextRegions = [
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
								villages: [{ code: "6201010001", name: "Kelurahan Baru" }],
							},
						],
					},
				],
			},
		];

		await routes["regions/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: nextRegions,
		} as any);
		const result = await routes["regions/get"]!.handler({
			...ctx,
			request: adminRequest,
			input: {},
		} as any);

		expect(result).toEqual(nextRegions);
		expect(officialRegionTableRows).toHaveLength(4);
		expect(officialRegionTableRows.map((row) => row.level)).toEqual([
			"province",
			"regency",
			"district",
			"village",
		]);
		expect(officialRegionTableRows[1]).toMatchObject({ code: "6201", parent_code: "62" });
		expect(kvData.has("custom:regions")).toBe(false);
	});

	it("reads and writes local regions through dedicated D1 region tables", async () => {
		const { ctx, localRegionTableRows, kvData } = createMockContext();
		const routes = createNativeRoutes();
		const adminRequest = createAdminRequest();
		const nextRegions = [
			{
				code: "local-rt-001",
				name: "RW 01 Local Service Area",
				regencies: [],
			},
		];

		await routes["local-regions/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: nextRegions,
		} as any);
		const result = await routes["local-regions/get"]!.handler({
			...ctx,
			request: adminRequest,
			input: {},
		} as any);

		expect(result).toEqual(nextRegions);
		expect(localRegionTableRows).toHaveLength(1);
		expect(localRegionTableRows[0]).toMatchObject({
			code: "local-rt-001",
			level: "province",
			local_type: "operator_defined",
			status: "active",
		});
		expect(kvData.has("custom:local-regions")).toBe(false);
	});

	it("fails closed instead of writing settings to plugin storage when production D1 is missing", async () => {
		(globalThis as { __AWCMS_SIKESRA_RUNTIME_MODE__?: string }).__AWCMS_SIKESRA_RUNTIME_MODE__ =
			"production";
		try {
			const { ctx, collections } = createMockContext();
			const routes = createNativeRoutes();
			(ctx as any).user = { id: "user-demo-sikesra-admin" };
			delete (ctx as any).db;

			await expect(
				routes["settings/save"]!.handler({
					...ctx,
					request: createAdminRequest(),
					input: { publicStatusLabel: "green" },
				} as any),
			).rejects.toThrow("canonical settings runtime state");

			expect(collections.settingsState.size).toBe(0);
		} finally {
			delete (globalThis as { __AWCMS_SIKESRA_RUNTIME_MODE__?: string })
				.__AWCMS_SIKESRA_RUNTIME_MODE__;
		}
	});

	it("fails closed instead of writing region and data type catalogs to KV when production D1 is missing", async () => {
		(globalThis as { __AWCMS_SIKESRA_RUNTIME_MODE__?: string }).__AWCMS_SIKESRA_RUNTIME_MODE__ =
			"production";
		try {
			const { ctx, kvData } = createMockContext();
			const routes = createNativeRoutes();
			(ctx as any).user = { id: "user-demo-sikesra-admin" };
			delete (ctx as any).db;

			await expect(
				routes["regions/save"]!.handler({
					...ctx,
					request: createAdminRequest(),
					input: [{ code: "62", name: "Kalimantan Tengah", regencies: [] }],
				} as any),
			).rejects.toThrow("canonical official regions runtime state");
			await expect(
				routes["local-regions/save"]!.handler({
					...ctx,
					request: createAdminRequest(),
					input: [{ code: "local-rt-001", name: "RW 01", regencies: [] }],
				} as any),
			).rejects.toThrow("canonical local regions runtime state");
			await expect(
				routes["data-types/save"]!.handler({
					...ctx,
					request: createAdminRequest(),
					input: [{ id: "rumah_ibadah", code: "01", label: "Rumah Ibadah", subTypes: [] }],
				} as any),
			).rejects.toThrow("canonical data types runtime state");

			expect(kvData.has("custom:regions")).toBe(false);
			expect(kvData.has("custom:local-regions")).toBe(false);
			expect(kvData.has("custom:data-types")).toBe(false);
		} finally {
			delete (globalThis as { __AWCMS_SIKESRA_RUNTIME_MODE__?: string })
				.__AWCMS_SIKESRA_RUNTIME_MODE__;
		}
	});

	it("registers required SIKESRA plugin routes", () => {
		const routes = createNativeRoutes();

		expect(Object.keys(routes)).toEqual(
			expect.arrayContaining([
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
				"dashboard/summary",
				"overview/summary",
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
				"access/roles/list",
				"access/scopes/list",
				"access/matrix/get",
				"access/preview",
				"abac/attributes/list",
				"abac/policies/list",
				"abac/preview",
			]),
		);
	});

	it("denies protected admin routes without trusted user identity", async () => {
		const { ctx } = createMockContext();
		const routes = createNativeRoutes();

		for (const key of [
			"overview/summary",
			"registry/list",
			"registry/save",
			"documents/list",
			"documents/save",
			"settings/get",
			"settings/save",
			"overview/summary",
			"regions/get",
			"regions/save",
			"local-regions/get",
			"local-regions/save",
			"data-types/get",
			"data-types/save",
			"verification/list",
			"verification/advance",
			"verification/reject",
			"import/create",
			"import/promote",
			"duplicates/decide",
			"exports/create",
			"exports/list",
			"custom-attributes/definitions/list",
			"custom-attributes/definitions/save",
			"custom-attributes/values/list",
			"custom-attributes/values/save",
			"access/permissions/list",
			"access/scopes/list",
			"access/scopes/save",
			"access/preview",
			"abac/attributes/list",
			"abac/preview",
		] as const) {
			const result = (await routes[key]!.handler({ ...ctx, input: {} } as any)) as any;
			expect(result.success, key).toBe(false);
			expect(result.error.code, key).toBe("UNAUTHENTICATED");
		}
	});

	it("prefers trusted EmDash route context identity over spoofed SIKESRA headers", async () => {
		const { ctx } = createMockContext();
		const routes = createNativeRoutes();
		const spoofedAdminRequest = new Request("https://example.test", {
			headers: { "X-Sikesra-User-Id": "user-demo-sikesra-admin" },
		});

		const denied = (await routes["registry/list"]!.handler({
			...ctx,
			request: spoofedAdminRequest,
			user: { id: "user-demo-editor", email: "editor@example.test", name: "Editor", role: 40 },
			input: {},
		} as any)) as any;
		expect(denied.success).toBe(false);
		expect(denied.error.code).toBe("FORBIDDEN");

		const allowed = (await routes["registry/list"]!.handler({
			...ctx,
			request: new Request("https://example.test", {
				headers: { "X-Sikesra-User-Id": "user-demo-editor" },
			}),
			user: {
				id: "user-demo-sikesra-admin",
				email: "admin@example.test",
				name: "SIKESRA Admin",
				role: 50,
			},
			input: {},
		} as any)) as any;
		expect(allowed.items).toBeDefined();
	});

	it("bootstraps trusted EmDash admins into SIKESRA admin access when no assignment exists", async () => {
		const { ctx } = createMockContext();
		const routes = createNativeRoutes();
		const adminCtx = {
			...ctx,
			request: new Request("https://example.test"),
			user: {
				id: "emdash-production-admin",
				email: "admin@example.test",
				name: "Production Admin",
				role: 50,
			},
			input: {},
		} as any;

		const registry = (await routes["registry/list"]!.handler(adminCtx)) as any;
		const deleteRequests = (await routes["crud/permanent-delete/requests/list"]!.handler(
			adminCtx,
		)) as any;

		expect(registry.items).toBeDefined();
		expect(deleteRequests.items).toBeDefined();
	});

	it("merges required bootstrap roles for trusted EmDash admins with partial SIKESRA assignments", async () => {
		const { ctx, collections } = createMockContext();
		const routes = createNativeRoutes();
		collections.userRoleAssignments.set("emdash-production-admin", {
			userId: "emdash-production-admin",
			roles: ["sikesra_super_admin"],
			isActive: true,
			updatedAt: "2026-01-01T00:00:00.000Z",
		});
		const adminCtx = {
			...ctx,
			request: new Request("https://example.test"),
			user: {
				id: "emdash-production-admin",
				email: "admin@example.test",
				name: "Production Admin",
				role: 50,
			},
			input: {},
		} as any;

		const accessRoles = (await routes["access/roles/list"]!.handler(adminCtx)) as any;
		const abacPolicies = (await routes["abac/policies/list"]!.handler(adminCtx)) as any;
		const assignment = collections.userRoleAssignments.get("emdash-production-admin") as any;

		expect(accessRoles.roles).toBeDefined();
		expect(abacPolicies.items).toBeDefined();
		expect(assignment.roles).toEqual(
			expect.arrayContaining(["admin-sikesra", "sikesra_admin", "sikesra_super_admin"]),
		);
	});

	it("keeps trusted-admin read routes available when plugin storage collections are unavailable", async () => {
		const { ctx } = createMockContext();
		const routes = createNativeRoutes();
		const adminCtx = {
			...ctx,
			storage: {},
			request: createAdminRequest(),
			user: {
				id: "production-admin",
				email: "admin@example.test",
				name: "Production Admin",
				role: 50,
			},
			input: {},
		} as any;

		for (const key of [
			"overview/summary",
			"registry/list",
			"registry/archive/list",
			"custom-attributes/definitions/list",
			"custom-attributes/values/list",
			"crud/permanent-delete/requests/list",
			"audit/list",
			"access/permissions/list",
			"access/users/list",
			"access/roles/list",
			"access/matrix/get",
			"access/scopes/list",
			"access/preview",
			"abac/attributes/list",
			"abac/policies/list",
			"abac/preview",
			"regions/get",
			"local-regions/get",
			"data-types/get",
		] as const) {
			const result = (await routes[key]!.handler(adminCtx)) as any;
			expect(result.success, key).not.toBe(false);
		}
	});

	it("uses GET for SIKESRA admin read APIs so read pages do not require plugin manage permission", () => {
		expect(new Set(SIKESRA_ADMIN_API_PATHS).size).toBe(SIKESRA_ADMIN_API_PATHS.length);
		expect(new Set(SIKESRA_TYPED_ADMIN_API_WRAPPER_PATHS).size).toBe(
			SIKESRA_TYPED_ADMIN_API_WRAPPER_PATHS.length,
		);
		expect(SIKESRA_TYPED_ADMIN_API_WRAPPER_PATHS).toEqual(SIKESRA_ADMIN_API_PATHS);
		expect(new Set(SIKESRA_READ_ONLY_ADMIN_API_PATHS).size).toBe(
			SIKESRA_READ_ONLY_ADMIN_API_PATHS.length,
		);
		const clientPathSet = new Set<string>(SIKESRA_ADMIN_API_PATHS);
		for (const key of SIKESRA_READ_ONLY_ADMIN_API_PATHS) {
			expect(clientPathSet.has(key), `${key} missing from admin API path list`).toBe(true);
		}
		const runtimeRoutes = createNativeRoutes();
		for (const key of SIKESRA_ADMIN_API_PATHS) {
			expect(runtimeRoutes[key], `${key} missing from runtime plugin routes`).toBeDefined();
		}

		for (const key of [
			"registry/list",
			"registry/archive/list",
			"custom-attributes/definitions/list",
			"custom-attributes/values/list",
			"crud/permanent-delete/requests/list",
			"audit/list",
			"access/permissions/list",
			"access/users/list",
			"access/roles/list",
			"access/matrix/get",
			"access/scopes/list",
			"abac/attributes/list",
			"abac/subjects/list",
			"abac/resources/list",
			"abac/policies/list",
			"regions/get",
			"local-regions/get",
			"data-types/get",
		] as const) {
			expect(getSikesraAdminApiMethod(key), key).toBe("GET");
		}

		expect(createSikesraAdminApiHeaders(null)["X-EmDash-Request"]).toBe("1");
		expect(
			createSikesraAdminApiHeaders({ id: "user-demo-sikesra-admin", name: "Admin" })[
				"X-Sikesra-User-Id"
			],
		).toBe("user-demo-sikesra-admin");
		expect(createSikesraAdminApiUrl("audit/list", "GET", { limit: 10, cursor: "next" })).toBe(
			"/_emdash/api/plugins/awcms-micro-sikesra/audit/list?limit=10&cursor=next",
		);
		expect(
			createSikesraAdminApiUrl("access/users/list", "GET", {
				roles: ["sikesra_admin", "sikesra_auditor"],
				includeInactive: true,
			}),
		).toBe(
			"/_emdash/api/plugins/awcms-micro-sikesra/access/users/list?roles=sikesra_admin&roles=sikesra_auditor&includeInactive=true",
		);

		for (const key of [
			"registry/save",
			"custom-attributes/definitions/save",
			"custom-attributes/values/save",
			"access/users/save",
			"abac/preview",
		] as const) {
			expect(getSikesraAdminApiMethod(key), key).toBe("POST");
		}
		expect(createSikesraAdminApiUrl("registry/save", "POST", { id: "registry-1" })).toBe(
			"/_emdash/api/plugins/awcms-micro-sikesra/registry/save",
		);
	});

	it("uses typed admin API wrappers for migrated admin write calls", () => {
		const adminSource = readFileSync(resolve(import.meta.dirname, "../src/admin.tsx"), "utf8");

		expect(adminSource).toContain("saveCustomAttributeDefinition(");
		expect(adminSource).toContain("saveCustomAttributeValue(");
		expect(adminSource).toContain("saveSikesraSettings(");
		expect(adminSource).toContain("saveRegions(");
		expect(adminSource).toContain("saveDataTypes(");
		expect(adminSource).toContain("requestPermanentDelete(");
		expect(adminSource).toContain("approvePermanentDelete(");
		expect(adminSource).toContain("executePermanentDelete(");
		expect(adminSource).toContain("restoreRegistry(");
		expect(adminSource).toContain("saveAccessPermission(");
		expect(adminSource).toContain("saveAccessRole(");
		expect(adminSource).toContain("saveAccessScope(");
		expect(adminSource).toContain("saveAccessMatrix(");
		expect(adminSource).toContain("saveUserRoles(");
		expect(adminSource).toContain("emdashUserId: userState.userId");
		expect(adminSource).toContain("saveAbacAttribute(");
		expect(adminSource).toContain("saveAbacSubject(");
		expect(adminSource).toContain("saveAbacResource(");
		expect(adminSource).toContain("saveAbacPolicy(");
		expect(adminSource).toContain("saveDocument(");
		expect(adminSource).toContain("classification: uploadState.sensitivity");
		expect(adminSource).toContain("classification: doc.sensitivity");
		expect(adminSource).toContain(
			"Type PERMANENT DELETE before executing the permanent delete request.",
		);
		expect(adminSource).not.toContain('postPlugin("custom-attributes/definitions/save"');
		expect(adminSource).not.toContain('postPlugin("custom-attributes/values/save"');
		expect(adminSource).not.toContain('postPlugin("settings/save"');
		expect(adminSource).not.toContain('postPlugin("regions/save"');
		expect(adminSource).not.toContain('postPlugin("data-types/save"');
		expect(adminSource).not.toContain('postPlugin("crud/permanent-delete/request"');
		expect(adminSource).not.toContain('postPlugin("crud/permanent-delete/approve"');
		expect(adminSource).not.toContain('postPlugin("crud/permanent-delete/execute"');
		expect(adminSource).not.toContain('postPlugin("registry/restore"');
		expect(adminSource).not.toContain('postPlugin("access/permissions/save"');
		expect(adminSource).not.toContain('postPlugin("access/roles/save"');
		expect(adminSource).not.toContain('postPlugin("access/users/save"');
		expect(adminSource).not.toContain('postPlugin("access/scopes/save"');
		expect(adminSource).not.toContain('postPlugin("access/matrix/save"');
		expect(adminSource).not.toContain('postPlugin("abac/attributes/save"');
		expect(adminSource).not.toContain('postPlugin("abac/subjects/save"');
		expect(adminSource).not.toContain('postPlugin("abac/resources/save"');
		expect(adminSource).not.toContain('postPlugin("abac/policies/save"');
		expect(adminSource).not.toContain('postPlugin("documents/save"');
	});

	it("declares issue #142 admin UI/UX route and interaction standards", () => {
		expect(SIKESRA_ADMIN_ROUTE_BASE).toBe("/_emdash/admin/plugins/awcms-micro-sikesra");
		expect(toSikesraAdminHref("registry")).toBe(
			"/_emdash/admin/plugins/awcms-micro-sikesra/registry",
		);
		expect(toSikesraAdminHref("/verification")).toBe(
			"/_emdash/admin/plugins/awcms-micro-sikesra/verification",
		);
		expect(
			AWCMS_SIKESRA_DASHBOARD_MODULE_CARDS.every((card) => isSikesraAdminHref(card.href)),
		).toBe(true);
		expect(SIKESRA_OPERATOR_WORKFLOW_STEPS).toEqual([
			"Configure",
			"Input or Import",
			"Validate",
			"Verify",
			"Publish Aggregate",
			"Report or Export",
			"Audit or Govern",
		]);
		expect(SIKESRA_OVERVIEW_SECTIONS).toEqual([
			"System readiness banner",
			"Operational KPIs",
			"Workflow shortcuts",
			"Eight module cards",
			"Public aggregate preview",
		]);
		expect(SIKESRA_OVERVIEW_KPIS).toEqual(
			expect.arrayContaining([
				"Total records",
				"Pending verification",
				"Incomplete documents",
				"Restricted export requests",
				"Audit events requiring review",
			]),
		);
		expect(SIKESRA_OVERVIEW_SHORTCUTS.every((shortcut) => isSikesraAdminHref(shortcut.href))).toBe(
			true,
		);
		expect(SIKESRA_OVERVIEW_SHORTCUTS.map((shortcut) => shortcut.permissionSlug)).toEqual(
			expect.arrayContaining([
				"sikesra.registry.create",
				"sikesra.import.create",
				"sikesra.audit.read",
			]),
		);
		expect(SIKESRA_PAGE_ANATOMY).toContain("Empty, loading, and error states");
		expect(SIKESRA_STATUS_BADGES).toEqual(
			expect.arrayContaining(["Public Safe", "Sensitive", "Restricted", "Orphaned User"]),
		);
		expect(SIKESRA_STANDARD_EMPTY_STATES).toContain("No import batch");
		expect(SIKESRA_REQUIRED_ADMIN_PAGE_PATHS).toEqual(
			expect.arrayContaining([
				"/overview",
				"/registry",
				"/registry/new",
				"/registry/:id",
				"/custom-attributes/definitions",
				"/custom-attributes/values",
				"/delete-requests",
				"/archives",
			]),
		);
		expect(SIKESRA_REQUIRED_ADMIN_PAGE_PATHS.every((path) => path.startsWith("/"))).toBe(true);
		expect(SIKESRA_REQUIRED_ADMIN_COMPONENTS).toEqual(
			expect.arrayContaining([
				"SikesraPageHeader",
				"SikesraStepper",
				"SikesraMaskedValue",
				"SikesraRevealButton",
				"SikesraConfirmDialog",
				"SikesraAbacDecisionPanel",
			]),
		);
	});

	it("standardizes issue #142 status, masking, empty, and page states", () => {
		expect(getSikesraStatusTone("Verified")).toBe("success");
		expect(getSikesraStatusTone("Restricted")).toBe("restricted");
		expect(getSikesraStatusTone("Unknown Status")).toBe("neutral");

		expect(createSikesraMaskedValueState("secret", { sensitive: true })).toEqual({
			displayValue: "[REDACTED]",
			masked: true,
			revealAllowed: false,
			reason: "Sensitive value is masked until reveal permission is granted.",
		});
		expect(
			createSikesraMaskedValueState("secret", { sensitive: true, revealAllowed: true }),
		).toMatchObject({ displayValue: "secret", masked: false, revealAllowed: true });

		expect(
			createSikesraEmptyState("No import batch", "Upload a CSV or XLSX file to begin.", {
				recommendedAction: "Start import",
				permissionRequired: "sikesra.import.create",
			}),
		).toEqual({
			title: "No import batch",
			description: "Upload a CSV or XLSX file to begin.",
			recommendedAction: "Start import",
			permissionRequired: "sikesra.import.create",
		});

		expect(getSikesraPageState({ loading: true })).toBe("loading");
		expect(getSikesraPageState({ permissionDenied: true })).toBe("permission_denied");
		expect(getSikesraPageState({ error: new Error("failed") })).toBe("error");
		expect(getSikesraPageState({ itemCount: 0 })).toBe("empty");
		expect(getSikesraPageState({ itemCount: 1 })).toBe("ready");
	});

	it("standardizes permission-aware issue #142 CRUD action states", () => {
		expect(SIKESRA_CRUD_ACTIONS.map((action) => action.kind)).toEqual([
			"create",
			"edit",
			"soft_delete",
			"restore",
			"archive",
			"permanent_delete",
		]);
		expect(getSikesraCrudActionState({ action: "soft_delete", permissions: [] })).toEqual({
			visible: true,
			enabled: false,
			reason: "Missing permission sikesra.registry.soft_delete.",
		});
		expect(
			getSikesraCrudActionState({
				action: "restore",
				permissions: ["sikesra.registry.restore"],
				archived: false,
			}),
		).toEqual({
			visible: false,
			enabled: false,
			reason: "Restore is shown only for archived records.",
		});
		expect(
			getSikesraCrudActionState({
				action: "restore",
				permissions: ["sikesra.registry.restore"],
				archived: true,
			}),
		).toEqual({ visible: true, enabled: true, reason: "Action allowed." });
		expect(
			getSikesraCrudActionState({
				action: "permanent_delete",
				permissions: ["sikesra.permanent_delete.execute"],
				superAdmin: false,
			}),
		).toEqual({
			visible: false,
			enabled: false,
			reason: "Permanent delete is hidden unless highest-admin workflow is active.",
		});
		expect(
			getSikesraCrudActionState({
				action: "permanent_delete",
				permissions: ["sikesra.permanent_delete.execute"],
				superAdmin: true,
				abacAllowed: false,
			}),
		).toEqual({ visible: true, enabled: false, reason: "ABAC scope does not allow this action." });
	});

	it("standardizes issue #142 operator workflow models", () => {
		expect(SIKESRA_REGISTRY_WIZARD_STEPS.map((step) => step.id)).toEqual([
			"module",
			"region",
			"identity",
			"details",
			"addresses",
			"custom-attributes",
			"documents",
			"review",
		]);
		expect(
			SIKESRA_REGISTRY_WIZARD_STEPS.find((step) => step.id === "addresses")?.privacyCheck,
		).toBe(true);
		expect(
			SIKESRA_REGISTRY_WIZARD_STEPS.find((step) => step.id === "documents")?.permissionSlug,
		).toBe("sikesra.document.upload");

		expect(SIKESRA_IMPORT_WORKFLOW_STEPS.map((step) => step.id)).toEqual([
			"upload",
			"preview",
			"map",
			"validate",
			"duplicate-review",
			"promote",
			"summary",
		]);
		expect(
			SIKESRA_IMPORT_WORKFLOW_STEPS.find((step) => step.id === "duplicate-review")?.requiresReason,
		).toBe(true);
		expect(
			SIKESRA_IMPORT_WORKFLOW_STEPS.find((step) => step.id === "promote")?.permissionSlug,
		).toBe("sikesra.import.promote");

		expect(SIKESRA_VERIFICATION_QUEUE_TABS.map((tab) => tab.id)).toEqual([
			"desa_kelurahan",
			"kecamatan",
			"sopd",
			"kabupaten_admin",
		]);
		expect(
			SIKESRA_VERIFICATION_QUEUE_TABS.every(
				(tab) => tab.permissionSlug === "sikesra.verification.read",
			),
		).toBe(true);

		expect(SIKESRA_ACCESS_ASSIGNMENT_STEPS.map((step) => step.id)).toEqual([
			"select-user",
			"assign-role",
			"assign-region-scope",
			"assign-organization-scope",
			"preview",
		]);
		expect(
			SIKESRA_ACCESS_ASSIGNMENT_STEPS.every(
				(step) => step.permissionSlug === "sikesra.rbac.manage",
			),
		).toBe(true);

		expect(SIKESRA_CUSTOM_ATTRIBUTE_BUILDER_SECTIONS.map((step) => step.id)).toEqual([
			"scope",
			"field",
			"privacy",
			"preview",
			"save",
		]);
		expect(
			SIKESRA_CUSTOM_ATTRIBUTE_BUILDER_SECTIONS.find((step) => step.id === "privacy")?.privacyCheck,
		).toBe(true);

		expect(SIKESRA_GOVERNANCE_REVIEW_STEPS.map((step) => step.id)).toEqual([
			"request",
			"snapshot",
			"approve",
			"execute",
		]);
		expect(
			SIKESRA_GOVERNANCE_REVIEW_STEPS.every((step) => step.requiresAudit || step.privacyCheck),
		).toBe(true);
		expect(SIKESRA_ACCESSIBILITY_CHECKLIST).toEqual(
			expect.arrayContaining([
				"Keyboard navigation works for tables, steppers, dialogs, drawers, and menus.",
				"Status is communicated with text, not color alone.",
			]),
		);
	});

	it("standardizes issue #142 page pattern contracts", () => {
		expect(SIKESRA_PAGE_PATTERN_CONTRACTS.map((contract) => contract.path).toSorted()).toEqual(
			[...SIKESRA_REQUIRED_ADMIN_PAGE_PATHS].toSorted(),
		);
		expect(Object.keys(sikesraAdminPages ?? {}).toSorted()).toEqual(
			["/", ...SIKESRA_REQUIRED_ADMIN_PAGE_PATHS].toSorted(),
		);
		expect(AWCMS_SIKESRA_ADMIN_PAGES.map((page) => page.path)).toEqual(
			expect.arrayContaining([
				"/field-standards",
				"/custom-attributes/definitions",
				"/custom-attributes/values",
				"/access/users",
				"/access/scopes",
				"/delete-requests",
				"/archives",
				"/settings",
			]),
		);
		for (const contract of SIKESRA_PAGE_PATTERN_CONTRACTS) {
			expect(contract.title, `${contract.path} title`).toBeTruthy();
			expect(contract.purpose, `${contract.path} purpose`).toBeTruthy();
			expect(contract.anatomy, `${contract.path} anatomy`).toEqual([...SIKESRA_PAGE_ANATOMY]);
			expect(SIKESRA_STANDARD_EMPTY_STATES).toContain(contract.emptyState);
		}
		expect(
			SIKESRA_PAGE_PATTERN_CONTRACTS.find((contract) => contract.path === "/registry/new"),
		).toMatchObject({
			workflowModel: "registry-wizard",
			requiresPrivacyIndicators: true,
		});
		expect(
			SIKESRA_PAGE_PATTERN_CONTRACTS.find((contract) => contract.path === "/import"),
		).toMatchObject({
			workflowModel: "import",
			requiresReasonFlow: true,
		});
		expect(
			SIKESRA_PAGE_PATTERN_CONTRACTS.find((contract) => contract.path === "/verification"),
		).toMatchObject({
			workflowModel: "verification",
			requiresReasonFlow: true,
		});
		expect(
			SIKESRA_PAGE_PATTERN_CONTRACTS.find((contract) => contract.path === "/access/users"),
		).toMatchObject({
			workflowModel: "access",
			primaryPermissionSlug: "sikesra.rbac.manage",
		});
		expect(
			SIKESRA_PAGE_PATTERN_CONTRACTS.find(
				(contract) => contract.path === "/custom-attributes/definitions",
			),
		).toMatchObject({
			workflowModel: "custom-attributes",
			requiresPrivacyIndicators: true,
		});
		expect(
			SIKESRA_PAGE_PATTERN_CONTRACTS.find((contract) => contract.path === "/delete-requests"),
		).toMatchObject({
			workflowModel: "governance",
			requiresReasonFlow: true,
		});
	});

	it("rejects unsafe public aggregate suppression settings", async () => {
		const {
			ctx,
			collections,
			verificationStageTableRows: _verificationStageTableRows,
			verificationEventTableRows: _verificationEventTableRows,
		} =
			createMockContext();
		const routes = createNativeRoutes();
		const adminRequest = createAdminRequest();

		const result = (await routes["settings/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: { smallCellThreshold: 0 },
		} as any)) as any;

		expect(result.success).toBe(false);
		expect(result.error.code).toBe("VALIDATION_ERROR");
		expect(result.error.message).toContain("Small-cell suppression threshold");
		expect(collections.settingsState.has("smallCellThreshold")).toBe(false);
		expect(collections.auditEvents.size).toBe(0);
	});

	it("rejects unsafe governance settings", async () => {
		const {
			ctx,
			collections,
			verificationStageTableRows: _verificationStageTableRows,
			verificationEventTableRows: _verificationEventTableRows,
		} =
			createMockContext();
		const routes = createNativeRoutes();
		const adminRequest = createAdminRequest();

		const invalidRetention = (await routes["settings/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: { auditRetentionDays: 0 },
		} as any)) as any;
		const invalidMode = (await routes["settings/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: { governanceMode: "deleteEverything" },
		} as any)) as any;

		expect(invalidRetention.success).toBe(false);
		expect(invalidRetention.error.message).toContain("Audit retention days");
		expect(invalidMode.success).toBe(false);
		expect(invalidMode.error.message).toContain("Governance mode");
		expect(collections.settingsState.size).toBe(0);
		expect(collections.auditEvents.size).toBe(0);
	});

	it("rejects unsafe public settings", async () => {
		const {
			ctx,
			collections,
			importBatchTableRows: _importBatchTableRows,
			importStagingRowTableRows: _importStagingRowTableRows,
		} =
			createMockContext();
		const routes = createNativeRoutes();
		const adminRequest = createAdminRequest();

		const emptyStatus = (await routes["settings/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: { publicStatusLabel: " " },
		} as any)) as any;
		const unsafeCanonical = (await routes["settings/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: { metadataCanonicalBase: "javascript:alert(1)" },
		} as any)) as any;

		expect(emptyStatus.success).toBe(false);
		expect(emptyStatus.error.message).toContain("Public status label");
		expect(unsafeCanonical.success).toBe(false);
		expect(unsafeCanonical.error.message).toContain("HTTP or HTTPS URL");
		expect(collections.settingsState.size).toBe(0);
		expect(collections.auditEvents.size).toBe(0);
	});

	it("advances one verification stage and persists the new state", async () => {
		const { ctx, collections, verificationStageTableRows, verificationEventTableRows } =
			createMockContext();
		const routes = createNativeRoutes();
		const sopdRequest = new Request("https://example.test", {
			headers: { "X-Sikesra-User-Id": "user-demo-sopd" },
		});

		const before = (await routes["verification/list"]!.handler({
			...ctx,
			request: sopdRequest,
			input: {},
		} as any)) as any;
		expect(
			before.items.find((item: any) => item.registryEntityId === "registry-entity-guru-agama-01")
				?.verificationStage,
		).toBe("submitted_sopd");
		expect(before.currentVerifierLevels).toContain("sopd");
		expect(before.items).toHaveLength(1);

		const result = (await routes["verification/advance"]!.handler({
			...ctx,
			request: sopdRequest,
			input: {
				registryEntityId: "registry-entity-guru-agama-01",
				actor: "sopd-officer",
				verifierLevel: "sopd",
				notes: "Promoted from district review",
			},
		} as any)) as any;

		expect(result.success).toBe(true);
		expect(result.item.verificationStage).toBe("verified_sopd");
		expect(result.item.currentLevel).toBe("sopd");
		expect(result.item.nextStage).toBe("submitted_regency");
		expect(result.item.nextLevel).toBe("kabupaten_admin");
		expect(result.item.inputLevel).toBe("kecamatan");
		expect(result.event.kind).toBe("verification.stage.advance");
		expect(result.verificationEvent.stage).toBe("verified_sopd");
		expect(result.verificationEvent.inputLevel).toBe("kecamatan");
		expect(result.verificationEvent.verifierLevel).toBe("sopd");
		expect(result.verificationEvent.verifierRegionScope).toBe("6201");
		expect(result.verificationEvent.verifierOrgScope).toBe("site-main");

		const after = (await routes["verification/list"]!.handler({
			...ctx,
			request: createAdminRequest(),
			input: {},
		} as any)) as any;
		const afterItem = after.items.find(
			(item: any) => item.registryEntityId === "registry-entity-guru-agama-01",
		);
		expect(afterItem?.verificationStage).toBe("verified_sopd");
		expect(afterItem?.currentLevel).toBe("kabupaten_admin");
		expect(afterItem?.nextLevel).toBe("kabupaten_admin");
		expect(after.events).toHaveLength(1);
		expect(collections.auditEvents.size).toBeGreaterThan(0);
		expect(collections.verificationEvents.size).toBe(0);
		expect(verificationEventTableRows).toContainEqual(
			expect.objectContaining({
				registry_entity_id: "registry-entity-guru-agama-01",
				to_stage: "verified_sopd",
				decision: "approved",
				verifier_level: "sopd",
				region_scope_code: "6201",
			}),
		);
		expect(
			verificationStageTableRows.find(
				(row) => row.registry_entity_id === "registry-entity-guru-agama-01",
			),
		).toMatchObject({
			registry_entity_id: "registry-entity-guru-agama-01",
			stage: "verified_sopd",
			current_level: "kabupaten_admin",
			next_level: "kabupaten_admin",
		});
		expect(collections.verificationStageState.size).toBe(0);
		expect(collections.pluginState.get("state:lastVerificationEventId")).toMatchObject({
			key: "state:lastVerificationEventId",
			value: expect.stringContaining("registry-entity-guru-agama-01"),
		});
	});

	it("fails closed instead of writing verification stage state to plugin storage when production D1 is missing", async () => {
		(globalThis as { __AWCMS_SIKESRA_RUNTIME_MODE__?: string }).__AWCMS_SIKESRA_RUNTIME_MODE__ =
			"production";
		try {
			const { ctx, collections, kvData, verificationStageTableRows } = createMockContext();
			const routes = createNativeRoutes();
			(ctx as any).user = { id: "user-demo-sopd" };
			delete (ctx as any).db;

			await expect(
				routes["verification/advance"]!.handler({
					...ctx,
					request: new Request("https://example.test", {
						headers: { "X-Sikesra-User-Id": "user-demo-sopd" },
					}),
					input: {
						registryEntityId: "registry-entity-guru-agama-01",
						actor: "sopd-officer",
						verifierLevel: "sopd",
					},
				} as any),
			).rejects.toThrow("canonical verification stage runtime state");

			expect(collections.verificationStageState.size).toBe(0);
			expect(kvData.has("state:sikesraVerificationStages")).toBe(false);
			expect(verificationStageTableRows).toHaveLength(0);
		} finally {
			delete (globalThis as { __AWCMS_SIKESRA_RUNTIME_MODE__?: string })
				.__AWCMS_SIKESRA_RUNTIME_MODE__;
		}
	});

	it("rejects verification advances from the wrong user level", async () => {
		const { ctx, kvData } = createMockContext();
		kvData.set("state:sikesraVerificationStages", {
			"registry-entity-guru-agama-01": "submitted_village",
		});
		const routes = createNativeRoutes();
		const districtRequest = new Request("https://example.test", {
			headers: { "X-Sikesra-User-Id": "user-demo-district" },
		});

		const result = (await routes["verification/advance"]!.handler({
			...ctx,
			request: districtRequest,
			input: {
				registryEntityId: "registry-entity-guru-agama-01",
				actor: "district-officer",
				verifierLevel: "kecamatan",
				notes: "Attempted from wrong level",
			},
		} as any)) as any;

		expect(result.success).toBe(false);
		expect(result.error.code).toBe("INVALID_LEVEL");
	});

	it("lets admin sikesra see the full verification queue", async () => {
		const { ctx } = createMockContext();
		const routes = createNativeRoutes();

		const result = (await routes["verification/list"]!.handler({
			...ctx,
			request: new Request("https://example.test", {
				headers: { "X-Sikesra-User-Id": "user-demo-sikesra-admin" },
			}),
			input: {},
		} as any)) as any;

		expect(result.currentVerifierLevels).toContain("admin_sikesra");
		expect(result.items.length).toBeGreaterThan(1);
	});

	it("filters the verification queue by regional scope for SOPD verifiers", async () => {
		const { ctx, collections } = createMockContext();
		collections.registryEntities.set("registry-entity-outside-scope", {
			id: "registry-entity-outside-scope",
			code: "OS-001",
			label: "Outside Scope Entity",
			entityType: "guru_agama",
			sensitivity: "restricted",
			region: {
				provinceCode: "32",
				regencyCode: "3273",
				districtCode: "3273010",
				villageCode: "3273010001",
			},
			verificationStage: "submitted_sopd",
			inputLevel: "kecamatan",
			supportingDocumentIds: [],
			publicSummary: "Should be hidden from Jakarta SOPD verifier.",
		});
		const routes = createNativeRoutes();

		const result = (await routes["verification/list"]!.handler({
			...ctx,
			request: new Request("https://example.test", {
				headers: { "X-Sikesra-User-Id": "user-demo-sopd" },
			}),
			input: {},
		} as any)) as any;

		expect(result.currentVerifierLevels).toContain("sopd");
		expect(result.items).toHaveLength(1);
		expect(result.items[0]?.registryEntityId).toBe("registry-entity-guru-agama-01");
	});

	it("denies out-of-region verification mutations", async () => {
		const { ctx, collections, verificationStageTableRows, verificationEventTableRows } =
			createMockContext();
		collections.registryEntities.set("registry-entity-outside-scope", {
			id: "registry-entity-outside-scope",
			code: "OS-001",
			label: "Outside Scope Entity",
			entityType: "guru_agama",
			sensitivity: "restricted",
			region: {
				provinceCode: "32",
				regencyCode: "3273",
				districtCode: "3273010",
				villageCode: "3273010001",
			},
			verificationStage: "submitted_sopd",
			inputLevel: "kecamatan",
			supportingDocumentIds: [],
			publicSummary: "Should not be mutable by Jakarta SOPD verifier.",
		});
		const routes = createNativeRoutes();
		const sopdRequest = new Request("https://example.test", {
			headers: { "X-Sikesra-User-Id": "user-demo-sopd" },
		});

		const advance = (await routes["verification/advance"]!.handler({
			...ctx,
			request: sopdRequest,
			input: {
				registryEntityId: "registry-entity-outside-scope",
				verifierLevel: "sopd",
				notes: "Attempted out-of-region advance",
			},
		} as any)) as any;
		const reject = (await routes["verification/reject"]!.handler({
			...ctx,
			request: sopdRequest,
			input: {
				registryEntityId: "registry-entity-outside-scope",
				verifierLevel: "sopd",
				notes: "Attempted out-of-region rejection",
			},
		} as any)) as any;

		expect(advance).toMatchObject({ success: false, error: { code: "FORBIDDEN" } });
		expect(reject).toMatchObject({ success: false, error: { code: "FORBIDDEN" } });
		expect(verificationStageTableRows).toHaveLength(0);
		expect(verificationEventTableRows).toHaveLength(0);
	});

	it("returns verification to the previous review level on needs revision", async () => {
		const { ctx, verificationStageTableRows, verificationEventTableRows } = createMockContext();
		const routes = createNativeRoutes();
		const sopdRequest = new Request("https://example.test", {
			headers: { "X-Sikesra-User-Id": "user-demo-sopd" },
		});

		const result = (await routes["verification/reject"]!.handler({
			...ctx,
			request: sopdRequest,
			input: {
				registryEntityId: "registry-entity-guru-agama-01",
				actor: "sopd-officer",
				verifierLevel: "sopd",
				notes: "Returned to district for correction",
			},
		} as any)) as any;

		expect(result.success).toBe(true);
		expect(result.item.verificationStage).toBe("submitted_district");
		expect(result.event.kind).toBe("verification.stage.reject");
		expect(result.verificationEvent.result).toBe("needs_review");
		expect(verificationEventTableRows).toContainEqual(
			expect.objectContaining({
				registry_entity_id: "registry-entity-guru-agama-01",
				to_stage: "submitted_district",
				decision: "needs_review",
				verifier_level: "sopd",
			}),
		);
		expect(
			verificationStageTableRows.find(
				(row) => row.registry_entity_id === "registry-entity-guru-agama-01",
			),
		).toMatchObject({
			registry_entity_id: "registry-entity-guru-agama-01",
			stage: "submitted_district",
		});
	});

	it("requires reason notes when returning verification for revision", async () => {
		const { ctx, collections } = createMockContext();
		const routes = createNativeRoutes();
		const sopdRequest = new Request("https://example.test", {
			headers: { "X-Sikesra-User-Id": "user-demo-sopd" },
		});

		const result = (await routes["verification/reject"]!.handler({
			...ctx,
			request: sopdRequest,
			input: {
				registryEntityId: "registry-entity-guru-agama-01",
				actor: "sopd-officer",
				verifierLevel: "sopd",
				notes: "  ",
			},
		} as any)) as any;

		expect(result.success).toBe(false);
		expect(result.error.code).toBe("VALIDATION_ERROR");
		expect(result.error.message).toContain("Reason notes are required");
		expect(collections.verificationStageState.has("registry-entity-guru-agama-01")).toBe(false);
	});

	it("records manual touch state in plugin storage", async () => {
		const { ctx, collections } = createMockContext();
		const routes = createNativeRoutes();

		const result = (await routes["state/touch"]!.handler({
			...ctx,
			input: { note: "manual review" },
		} as any)) as any;

		expect(result.success).toBe(true);
		expect(result.counter).toBe(1);
		expect(collections.pluginState.get("state:lastManualTouch")).toMatchObject({
			key: "state:lastManualTouch",
		});
		expect(collections.pluginState.get("state:manualTouches")).toMatchObject({
			key: "state:manualTouches",
			value: 1,
		});
	});

	it("migrates legacy verification state blobs into plugin storage on read", async () => {
		const { ctx, collections, kvData } = createMockContext();
		kvData.set("state:sikesraVerificationStages", {
			"registry-entity-guru-agama-01": "submitted_regency",
		});
		const routes = createNativeRoutes();
		const adminRequest = createAdminRequest();

		const result = (await routes["verification/list"]!.handler({
			...ctx,
			request: adminRequest,
			input: {},
		} as any)) as any;

		expect(
			result.items.find((item: any) => item.registryEntityId === "registry-entity-guru-agama-01")
				?.verificationStage,
		).toBe("submitted_regency");
		expect(kvData.has("state:sikesraVerificationStages")).toBe(false);
		expect(collections.verificationStageState.get("registry-entity-guru-agama-01")).toMatchObject({
			registryEntityId: "registry-entity-guru-agama-01",
			stage: "submitted_regency",
		});
	});

	it("persists registry records in D1 and document records in plugin storage", async () => {
		const {
			ctx,
			collections,
			registryEntityTableRows,
			moduleDetailTableRows,
			fileObjectTableRows,
			supportingDocumentTableRows,
		} = createMockContext();
		const routes = createNativeRoutes();
		const adminRequest = createAdminRequest();

		await routes["registry/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				id: "registry-entity-custom-01",
				code: "CU-001",
				label: "Custom Registry Entity",
				entityType: "rumah_ibadah",
				sensitivity: "public_safe",
				provinceCode: "62",
				regencyCode: "6201",
				districtCode: "620101",
				villageCode: "6201010001",
				publicSummary: "Custom summary",
				inputLevel: "admin_sikesra",
			},
		} as any);

		await routes["documents/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				id: "doc-custom-01",
				registryEntityId: "registry-entity-custom-01",
				documentType: "surat_keterangan",
				title: "Custom Document",
				sensitivity: "internal",
			},
		} as any);

		const registry = (await routes["registry/list"]!.handler({
			...ctx,
			request: adminRequest,
			input: {},
		} as any)) as any;
		const documents = (await routes["documents/list"]!.handler({
			...ctx,
			request: adminRequest,
			input: {},
		} as any)) as any;

		expect(registry.items.some((item: any) => item.id === "registry-entity-custom-01")).toBe(true);
		expect(
			registry.items.find((item: any) => item.id === "registry-entity-custom-01")
				?.verificationStage,
		).toBe("submitted_village");
		expect(
			registry.items.find((item: any) => item.id === "registry-entity-custom-01")?.inputLevel,
		).toBe("admin_sikesra");
		expect(documents.items.some((item: any) => item.id === "doc-custom-01")).toBe(true);
		expect(registryEntityTableRows).toContainEqual(
			expect.objectContaining({
				id: "registry-entity-custom-01",
				code: "CU-001",
				entity_type: "rumah_ibadah",
				verification_stage: "submitted_village",
			}),
		);
		expect(moduleDetailTableRows.sikesra_rumah_ibadah_details).toContainEqual(
			expect.objectContaining({
				registry_entity_id: "registry-entity-custom-01",
				field_standard_version: "draft",
			}),
		);
		expect(
			JSON.parse(String(moduleDetailTableRows.sikesra_rumah_ibadah_details![0]?.detail_json)),
		).toMatchObject({ code: "CU-001", entityType: "rumah_ibadah" });
		expect(collections.registryEntities.size).toBe(0);
		expect(collections.supportingDocuments.size).toBe(0);
		expect(supportingDocumentTableRows).toContainEqual(
			expect.objectContaining({
				id: "doc-custom-01",
				registry_entity_id: "registry-entity-custom-01",
				document_type: "surat_keterangan",
				classification: "internal",
			}),
		);
		expect(fileObjectTableRows).toContainEqual(
			expect.objectContaining({
				id: "doc-custom-01:file",
				classification: "internal",
			}),
		);
	});

	it("requires a reason before overriding medium-risk registry duplicates", async () => {
		const { ctx, registryEntityTableRows, duplicateCandidateTableRows, auditTableRows } =
			createMockContext();
		const routes = createNativeRoutes();
		const adminRequest = createAdminRequest();

		await routes["registry/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				id: "registry-dup-medium-01",
				code: "DUP-MED-001",
				label: "Medium Duplicate One",
				entityType: "rumah_ibadah",
				provinceCode: "62",
				regencyCode: "6201",
				districtCode: "620101",
				villageCode: "6201010001",
			},
		} as any);

		const missingReason = (await routes["registry/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				id: "registry-dup-medium-02",
				code: "DUP-MED-001",
				label: "Medium Duplicate Two",
				entityType: "rumah_ibadah",
				provinceCode: "62",
				regencyCode: "6201",
				districtCode: "620101",
				villageCode: "6201010001",
			},
		} as any)) as any;

		expect(missingReason.success).toBe(false);
		expect(missingReason.error.details.fields).toEqual(["duplicateOverrideReason"]);
		expect(duplicateCandidateTableRows).toContainEqual(
			expect.objectContaining({
				source_id: "registry-dup-medium-02",
				candidate_id: "registry-dup-medium-01",
				risk_level: "medium",
			}),
		);

		const overridden = (await routes["registry/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				id: "registry-dup-medium-02",
				code: "DUP-MED-001",
				label: "Medium Duplicate Two",
				entityType: "rumah_ibadah",
				provinceCode: "62",
				regencyCode: "6201",
				districtCode: "620101",
				villageCode: "6201010001",
				duplicateOverrideReason: "Separate institution with reused local code.",
			},
		} as any)) as any;

		expect(overridden.success).toBe(true);
		expect(registryEntityTableRows).toContainEqual(
			expect.objectContaining({ id: "registry-dup-medium-02" }),
		);
		expect(auditTableRows).toContainEqual(expect.objectContaining({ kind: "duplicate.override" }));
	});

	it("soft deletes, archives, and restores registry entities through CRUD governance", async () => {
		const { ctx, registryEntityTableRows, auditTableRows } = createMockContext();
		const routes = createNativeRoutes();
		const hooks = createSharedHooks();
		const activate =
			typeof hooks?.["plugin:activate"] === "function"
				? hooks["plugin:activate"]
				: hooks?.["plugin:activate"]?.handler;
		await activate!({} as any, ctx as any);
		const adminRequest = createAdminRequest();

		await routes["registry/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				id: "registry-entity-crud-01",
				code: "CRUD-001",
				label: "CRUD Registry Entity",
				entityType: "rumah_ibadah",
				sensitivity: "public_safe",
				provinceCode: "62",
				regencyCode: "6201",
				districtCode: "620101",
				villageCode: "6201010001",
				publicSummary: "CRUD summary",
			},
		} as any);

		const softDeleted = (await routes["registry/soft-delete"]!.handler({
			...ctx,
			request: adminRequest,
			input: { id: "registry-entity-crud-01", reason: "Duplicate training data" },
		} as any)) as any;
		expect(softDeleted.success).toBe(true);
		expect(
			registryEntityTableRows.find((row) => row.id === "registry-entity-crud-01")?.deleted_at,
		).toBeTruthy();

		const activeAfterDelete = (await routes["registry/list"]!.handler({
			...ctx,
			request: adminRequest,
			input: {},
		} as any)) as any;
		expect(activeAfterDelete.items.some((item: any) => item.id === "registry-entity-crud-01")).toBe(
			false,
		);

		const archive = (await routes["registry/archive/list"]!.handler({
			...ctx,
			request: adminRequest,
			input: {},
		} as any)) as any;
		expect(archive.items).toContainEqual(
			expect.objectContaining({ id: "registry-entity-crud-01" }),
		);

		const restored = (await routes["registry/restore"]!.handler({
			...ctx,
			request: adminRequest,
			input: { id: "registry-entity-crud-01", reason: "Restored after review" },
		} as any)) as any;
		expect(restored.success).toBe(true);
		expect(
			registryEntityTableRows.find((row) => row.id === "registry-entity-crud-01")?.deleted_at,
		).toBeNull();

		const activeAfterRestore = (await routes["registry/list"]!.handler({
			...ctx,
			request: adminRequest,
			input: {},
		} as any)) as any;
		expect(activeAfterRestore.items).toContainEqual(
			expect.objectContaining({ id: "registry-entity-crud-01" }),
		);
		expect(auditTableRows).toContainEqual(expect.objectContaining({ kind: "crud.soft_delete" }));
		expect(auditTableRows).toContainEqual(expect.objectContaining({ kind: "crud.restore" }));
	});

	it("validates document metadata before D1 persistence", async () => {
		const { ctx, fileObjectTableRows, supportingDocumentTableRows } = createMockContext();
		const routes = createNativeRoutes();

		const result = (await routes["documents/save"]!.handler({
			...ctx,
			request: createAdminRequest(),
			input: {
				id: "doc-invalid-01",
				registryEntityId: "registry-entity-custom-01",
				documentType: "surat_keterangan",
				title: "Invalid Document",
				classification: "secret",
				contentType: "application/x-msdownload",
				fileSizeBytes: 99 * 1024 * 1024,
				checksumSha256: "not-a-checksum",
				safeFilename: "../secret.pdf",
			},
		} as any)) as any;

		expect(result.success).toBe(false);
		expect(result.error.code).toBe("VALIDATION_ERROR");
		expect(result.error.details.fields).toEqual([
			"classification",
			"contentType",
			"fileSizeBytes",
			"checksumSha256",
			"safeFilename",
		]);
		expect(fileObjectTableRows).toHaveLength(0);
		expect(supportingDocumentTableRows).toHaveLength(0);
	});

	it("blocks high-risk duplicate document checksums before D1 persistence", async () => {
		const { ctx, duplicateCandidateTableRows, supportingDocumentTableRows } = createMockContext();
		const routes = createNativeRoutes();
		const adminRequest = createAdminRequest();
		const checksum = "b".repeat(64);

		await routes["documents/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				id: "doc-duplicate-source",
				registryEntityId: "registry-entity-custom-01",
				documentType: "surat_keterangan",
				title: "Source Document",
				classification: "restricted",
				contentType: "application/pdf",
				fileSizeBytes: 2048,
				checksumSha256: checksum,
				safeFilename: "source.pdf",
			},
		} as any);

		const duplicate = (await routes["documents/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				id: "doc-duplicate-target",
				registryEntityId: "registry-entity-custom-01",
				documentType: "surat_keterangan",
				title: "Duplicate Document",
				classification: "restricted",
				contentType: "application/pdf",
				fileSizeBytes: 2048,
				checksumSha256: checksum,
				safeFilename: "target.pdf",
			},
		} as any)) as any;

		expect(duplicate.success).toBe(false);
		expect(duplicate.error.code).toBe("DUPLICATE_REVIEW_REQUIRED");
		expect(duplicateCandidateTableRows).toContainEqual(
			expect.objectContaining({
				source_id: "doc-duplicate-target",
				candidate_id: "doc-duplicate-source",
				risk_level: "high",
			}),
		);
		expect(supportingDocumentTableRows).not.toContainEqual(
			expect.objectContaining({ id: "doc-duplicate-target" }),
		);
	});

	it("requires RBAC and ABAC before exposing restricted document metadata", async () => {
		const { ctx, auditTableRows, fileObjectTableRows } = createMockContext();
		const routes = createNativeRoutes();
		const adminRequest = createAdminRequest();
		const editorRequest = new Request("https://example.test", {
			headers: { "X-Sikesra-User-Id": "user-demo-editor" },
		});

		await routes["documents/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				id: "doc-restricted-01",
				registryEntityId: "registry-entity-custom-01",
				documentType: "surat_keterangan",
				title: "Restricted Document",
				classification: "restricted",
				contentType: "application/pdf",
				fileSizeBytes: 2048,
				checksumSha256: "a".repeat(64),
				originalFilename: "secret.pdf",
				safeFilename: "secret.pdf",
			},
		} as any);

		const denied = (await routes["documents/access"]!.handler({
			...ctx,
			request: editorRequest,
			input: { id: "doc-restricted-01" },
		} as any)) as any;
		expect(denied.success).toBe(false);
		expect(denied.error.code).toBe("FORBIDDEN");

		const allowed = (await routes["documents/access"]!.handler({
			...ctx,
			request: adminRequest,
			input: { id: "doc-restricted-01" },
		} as any)) as any;

		expect(allowed.success).toBe(true);
		expect(allowed.item).toMatchObject({
			id: "doc-restricted-01",
			classification: "restricted",
			contentType: "application/pdf",
			fileSizeBytes: 2048,
			checksumSha256: "a".repeat(64),
		});
		expect(allowed.item.storageKey).toBeUndefined();
		expect(fileObjectTableRows).toContainEqual(
			expect.objectContaining({
				id: "doc-restricted-01:file",
				storage_key: expect.stringMatching(
					/^tenants\/t-local-dev\/sites\/default\/modules\/sikesra\/restricted\/\d{4}\/\d{2}\/secret\.pdf$/,
				),
			}),
		);
		expect(allowed.access.abac.allowed).toBe(true);
		expect(auditTableRows).toContainEqual(
			expect.objectContaining({
				kind: "document.access.restricted",
				actor_user_id: "user-demo-sikesra-admin",
			}),
		);
	});

	it.each([
		["rumah_ibadah", "sikesra_rumah_ibadah_details"],
		["lembaga_keagamaan", "sikesra_lembaga_keagamaan_details"],
		["pendidikan_keagamaan", "sikesra_pendidikan_keagamaan_details"],
		["lks", "sikesra_lks_details"],
		["guru_agama", "sikesra_guru_agama_details"],
		["anak_yatim", "sikesra_anak_yatim_details"],
		["disabilitas", "sikesra_disabilitas_details"],
		["lansia_terlantar", "sikesra_lansia_terlantar_details"],
	])("stores %s registry details in the module D1 table", async (entityType, tableName) => {
		const { ctx, moduleDetailTableRows } = createMockContext();
		const routes = createNativeRoutes();
		const id = `registry-${entityType}`;
		const adminRequest = createAdminRequest();

		await routes["registry/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				id,
				code: `MD-${entityType}`,
				label: `Module ${entityType}`,
				entityType,
				sensitivity: "internal",
				provinceCode: "62",
				regencyCode: "6201",
				districtCode: "620101",
				villageCode: "6201010001",
				publicSummary: `Summary ${entityType}`,
			},
		} as any);

		expect(moduleDetailTableRows[tableName]!).toContainEqual(
			expect.objectContaining({ registry_entity_id: id }),
		);
	});

	it("generates D1-backed 20-digit SIKESRA IDs during registry save", async () => {
		const {
			ctx,
			registryEntityTableRows,
			codeSequenceTableRows,
			codeHistoryTableRows,
			auditTableRows,
		} = createMockContext();
		const routes = createNativeRoutes();
		const adminRequest = createAdminRequest();

		for (const id of ["registry-seq-01", "registry-seq-02"]) {
			await routes["registry/save"]!.handler({
				...ctx,
				request: adminRequest,
				input: {
					id,
					code: id,
					label: id,
					entityType: "rumah_ibadah",
					typeCode: "01",
					subtypeCode: "02",
					villageCode: "6201010001",
				},
			} as any);
		}

		expect(registryEntityTableRows.find((row) => row.id === "registry-seq-01")).toMatchObject({
			sikesra_id_20: "62010100010102000001",
		});
		expect(registryEntityTableRows.find((row) => row.id === "registry-seq-02")).toMatchObject({
			sikesra_id_20: "62010100010102000002",
		});
		expect(codeSequenceTableRows).toContainEqual(
			expect.objectContaining({ sequence_key: "6201010001:01:02", last_value: 2 }),
		);
		expect(codeHistoryTableRows).toHaveLength(2);
		expect(codeHistoryTableRows[0]?.sikesra_id_20).toHaveLength(20);

		const corrected = (await routes["registry/sikesra-id/correct"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				registryEntityId: "registry-seq-01",
				sikesraId20: "62010100010304000009",
				reason: "Corrected source subtype after document verification.",
			},
		} as any)) as any;

		expect(corrected.success).toBe(true);
		expect(registryEntityTableRows.find((row) => row.id === "registry-seq-01")).toMatchObject({
			sikesra_id_20: "62010100010304000009",
		});
		expect(codeHistoryTableRows).toContainEqual(
			expect.objectContaining({
				registry_entity_id: "registry-seq-01",
				sikesra_id_20: "62010100010304000009",
				previous_sikesra_id_20: "62010100010102000001",
				event_type: "correction",
				correction_reason: "Corrected source subtype after document verification.",
			}),
		);
		expect(auditTableRows).toContainEqual(
			expect.objectContaining({ kind: "registry.sikesra_id.correct" }),
		);
	});

	it("blocks import promotion while staged rows have validation errors", async () => {
		const { ctx, collections, importBatchTableRows, importStagingRowTableRows } =
			createMockContext();
		const routes = createNativeRoutes();
		const adminRequest = createAdminRequest();

		const result = (await routes["import/promote"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				rows: [
					{
						code: "",
						label: "Invalid Import Row",
						entityType: "rumah_ibadah",
						provinceCode: "62",
						regencyCode: "6201",
						districtCode: "620101",
						villageCode: "6201010001",
					},
				],
			},
		} as any)) as any;

		expect(result.success).toBe(false);
		expect(result.error.code).toBe("VALIDATION_ERROR");
		expect(result.error.details.invalidRows).toEqual([{ row: 1, fields: ["code"] }]);
		expect(importBatchTableRows).toContainEqual(
			expect.objectContaining({ status: "validation_failed", invalid_rows: 1 }),
		);
		expect(importStagingRowTableRows).toContainEqual(
			expect.objectContaining({ validation_status: "invalid", validation_errors_json: '["code"]' }),
		);
		expect(collections.registryEntities.size).toBe(0);
		expect(collections.auditEvents.size).toBe(0);
	});

	it("builds staged import UI payloads through create then promote contracts", () => {
		const rows = [
			{
				id: "registry-import-ui-01",
				code: "IMP-UI-001",
				label: "Imported UI Row",
				entityType: "rumah_ibadah",
			},
		];
		const createPayload = createSikesraImportPreviewCreatePayload({
			batchId: "batch-ui-01",
			rows,
			columnMappings: { code: "A", label: "B" },
			fileName: "sikesra.xlsx",
			selectedSheet: "Sheet1",
		});

		expect(createPayload).toMatchObject({
			batchId: "batch-ui-01",
			mappingTemplateId: "batch-ui-01:mapping",
			mappingTemplateName: "Sheet1",
			fileFormat: "xlsx",
			sourceFilename: "sikesra.xlsx",
			mapping: { code: "A", label: "B" },
			rows,
		});
		expect(createSikesraImportPreviewPromotePayload(createPayload.batchId!)).toEqual({
			batchId: "batch-ui-01",
		});
	});

	it("creates a D1 staged import batch before promoting valid rows", async () => {
		const {
			ctx,
			registryEntityTableRows,
			customAttributeValueTableRows,
			importBatchTableRows,
			importStagingRowTableRows,
			importMappingTemplateTableRows,
			auditTableRows,
			customAttributeChangeEventTableRows,
		} = createMockContext();
		const routes = createNativeRoutes();
		const adminRequest = createAdminRequest();
		await routes["custom-attributes/definitions/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				id: "custom-attr-import-01",
				key: "import_local_code",
				label: "Import Local Code",
				scope: "entity_type",
				entityType: "rumah_ibadah",
				dataClass: "non_personal",
				dataType: "string",
				isImportable: true,
			},
		} as any);
		const rows = [
			{
				id: "registry-import-01",
				code: "IMP-001",
				label: "Imported Row",
				entityType: "rumah_ibadah",
				provinceCode: "62",
				regencyCode: "6201",
				districtCode: "620101",
				villageCode: "6201010001",
				"custom:import_local_code": "LC-001",
			},
		];

		const created = (await routes["import/create"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				batchId: "batch-import-01",
				mappingTemplateId: "mapping-import-01",
				entityType: "rumah_ibadah",
				mapping: { code: "Kode", label: "Nama" },
				rows,
			},
		} as any)) as any;

		expect(created.success).toBe(true);
		expect(created.batchId).toBe("batch-import-01");
		expect(importMappingTemplateTableRows).toContainEqual(
			expect.objectContaining({ id: "mapping-import-01", entity_type: "rumah_ibadah" }),
		);
		expect(importBatchTableRows).toContainEqual(
			expect.objectContaining({ id: "batch-import-01", status: "validated", total_rows: 1 }),
		);
		expect(importStagingRowTableRows).toContainEqual(
			expect.objectContaining({ batch_id: "batch-import-01", validation_status: "valid" }),
		);

		const promoted = (await routes["import/promote"]!.handler({
			...ctx,
			request: adminRequest,
			input: { batchId: "batch-import-01" },
		} as any)) as any;

		expect(promoted.success).toBe(true);
		expect(promoted.count).toBe(1);
		expect(registryEntityTableRows).toContainEqual(
			expect.objectContaining({ id: "registry-import-01", code: "IMP-001" }),
		);
		expect(customAttributeValueTableRows).toContainEqual(
			expect.objectContaining({
				id: "registry-import-01:custom-attr-import-01:import",
				attribute_definition_id: "custom-attr-import-01",
				registry_entity_id: "registry-import-01",
				value_display: "LC-001",
				source: "import",
			}),
		);
		expect(importStagingRowTableRows).toContainEqual(
			expect.objectContaining({
				id: "batch-import-01:row:1",
				promotion_status: "promoted",
				promoted_registry_entity_id: "registry-import-01",
			}),
		);
		expect(auditTableRows).toContainEqual(
			expect.objectContaining({ kind: "registry.import.create" }),
		);
		expect(auditTableRows).toContainEqual(
			expect.objectContaining({ kind: "registry.import.promote" }),
		);
		expect(auditTableRows).toContainEqual(
			expect.objectContaining({ kind: "custom_attribute.import.mapping" }),
		);
		expect(customAttributeChangeEventTableRows).toContainEqual(
			expect.objectContaining({ event_type: "custom_attribute.import.mapping" }),
		);
	});

	it("stores duplicate candidates and blocks high-risk duplicate import promotion", async () => {
		const {
			ctx,
			registryEntityTableRows,
			duplicateCandidateTableRows,
			duplicateDecisionTableRows,
			importBatchTableRows,
			importStagingRowTableRows,
			auditTableRows,
		} = createMockContext();
		const routes = createNativeRoutes();
		const adminRequest = createAdminRequest();
		const rows = [
			{
				id: "registry-dup-01",
				code: "DUP-001",
				label: "Duplicate One",
				entityType: "rumah_ibadah",
				provinceCode: "62",
				regencyCode: "6201",
				districtCode: "620101",
				villageCode: "6201010001",
			},
			{
				id: "registry-dup-02",
				code: "DUP-001",
				label: "Duplicate Two",
				entityType: "rumah_ibadah",
				provinceCode: "62",
				regencyCode: "6201",
				districtCode: "620101",
				villageCode: "6201010001",
			},
		];

		await routes["import/create"]!.handler({
			...ctx,
			request: adminRequest,
			input: { batchId: "batch-dup-01", entityType: "rumah_ibadah", rows },
		} as any);

		expect(importBatchTableRows).toContainEqual(
			expect.objectContaining({
				id: "batch-dup-01",
				status: "duplicate_review",
				duplicate_risk_rows: 1,
			}),
		);
		expect(importStagingRowTableRows).toContainEqual(
			expect.objectContaining({ id: "batch-dup-01:row:2", duplicate_status: "duplicate_risk" }),
		);
		expect(duplicateCandidateTableRows).toContainEqual(
			expect.objectContaining({
				id: "batch-dup-01:row:2:duplicate-code",
				source_type: "import_row",
				candidate_id: "batch-dup-01:row:1",
				risk_level: "high",
			}),
		);

		const promoted = (await routes["import/promote"]!.handler({
			...ctx,
			request: adminRequest,
			input: { batchId: "batch-dup-01" },
		} as any)) as any;
		expect(promoted.success).toBe(false);
		expect(promoted.error.code).toBe("DUPLICATE_REVIEW_REQUIRED");

		const decision = (await routes["duplicates/decide"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				id: "decision-dup-01",
				candidateId: "batch-dup-01:row:2:duplicate-code",
				decision: "not_duplicate",
				reason: "Operator confirmed this row is a separate entity with a reused local code.",
			},
		} as any)) as any;
		expect(decision.success).toBe(true);
		expect(duplicateDecisionTableRows).toContainEqual(
			expect.objectContaining({
				id: "decision-dup-01",
				candidate_id: "batch-dup-01:row:2:duplicate-code",
				decision: "not_duplicate",
			}),
		);
		expect(importStagingRowTableRows).toContainEqual(
			expect.objectContaining({ id: "batch-dup-01:row:2", duplicate_status: "cleared" }),
		);

		const promotedAfterDecision = (await routes["import/promote"]!.handler({
			...ctx,
			request: adminRequest,
			input: { batchId: "batch-dup-01" },
		} as any)) as any;

		expect(promotedAfterDecision.success).toBe(true);
		expect(promotedAfterDecision.count).toBe(2);
		expect(registryEntityTableRows).toContainEqual(
			expect.objectContaining({ id: "registry-dup-01" }),
		);
		expect(registryEntityTableRows).toContainEqual(
			expect.objectContaining({ id: "registry-dup-02" }),
		);
		expect(auditTableRows).toContainEqual(expect.objectContaining({ kind: "duplicate.decision" }));
	});

	it("requires permission and reason for restricted export jobs", async () => {
		const { ctx, exportJobTableRows, auditTableRows } = createMockContext();
		const routes = createNativeRoutes();
		const editorRequest = new Request("https://example.test", {
			headers: { "X-Sikesra-User-Id": "user-demo-editor" },
		});
		const adminRequest = new Request("https://example.test", {
			headers: { "X-Sikesra-User-Id": "user-demo-sikesra-admin" },
		});

		const missingReason = (await routes["exports/create"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				exportType: "registry",
				requestedFields: ["code", "nik"],
				sensitivityLevel: "restricted",
			},
		} as any)) as any;
		expect(missingReason.success).toBe(false);
		expect(missingReason.error.details.fields).toEqual(["reason"]);

		const denied = (await routes["exports/create"]!.handler({
			...ctx,
			request: editorRequest,
			input: {
				exportType: "registry",
				requestedFields: ["code", "nik"],
				sensitivityLevel: "restricted",
				reason: "Case review",
			},
		} as any)) as any;
		expect(denied.success).toBe(false);
		expect(denied.error.code).toBe("FORBIDDEN");
		expect(exportJobTableRows).toHaveLength(0);

		const allowed = (await routes["exports/create"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				id: "export-restricted-01",
				exportType: "registry",
				requestedFields: ["code", "nik"],
				sensitivityLevel: "restricted",
				reason: "Case review",
			},
		} as any)) as any;

		expect(allowed.success).toBe(true);
		expect(exportJobTableRows).toContainEqual(
			expect.objectContaining({
				id: "export-restricted-01",
				sensitivity_level: "restricted",
				reason: "Case review",
			}),
		);
		expect(JSON.parse(String(exportJobTableRows[0]?.requested_fields_json))).toEqual([
			"code",
			"nik",
		]);
		expect(auditTableRows).toContainEqual(expect.objectContaining({ kind: "export.complete" }));
	});

	it("creates audited D1 export jobs with public-safe field exclusion", async () => {
		const { ctx, exportJobTableRows, auditTableRows } = createMockContext();
		const routes = createNativeRoutes();
		const adminRequest = new Request("https://example.test", {
			headers: { "X-Sikesra-User-Id": "user-demo-sikesra-admin", "X-Sikesra-User-Name": "Admin" },
		});

		const created = (await routes["exports/create"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				id: "export-job-01",
				exportType: "registry",
				entityType: "rumah_ibadah",
				requestedFields: ["code", "label", "nik", "alamat_ktp"],
				sensitivityLevel: "public_safe",
			},
		} as any)) as any;

		expect(created.success).toBe(true);
		expect(created.item.resultSummary).toMatchObject({
			allowedFields: ["code", "label"],
			excludedFields: ["nik", "alamat_ktp"],
		});
		expect(exportJobTableRows).toContainEqual(
			expect.objectContaining({
				id: "export-job-01",
				actor_user_id: "user-demo-sikesra-admin",
				sensitivity_level: "public_safe",
				status: "completed",
			}),
		);
		expect(JSON.parse(String(exportJobTableRows[0]?.requested_fields_json))).toEqual([
			"code",
			"label",
			"nik",
			"alamat_ktp",
		]);
		expect(auditTableRows).toContainEqual(expect.objectContaining({ kind: "export.create" }));
		expect(auditTableRows).toContainEqual(expect.objectContaining({ kind: "export.complete" }));

		const listed = (await routes["exports/list"]!.handler({
			...ctx,
			request: adminRequest,
			input: {},
		} as any)) as any;
		expect(listed.items).toContainEqual(expect.objectContaining({ id: "export-job-01" }));
		expect(auditTableRows).toContainEqual(expect.objectContaining({ kind: "export.access" }));
	});

	it("creates scoped custom attributes and masks sensitive values by default", async () => {
		const {
			ctx,
			collections,
			customAttributeDefinitionTableRows,
			customAttributeValueTableRows,
			customAttributeChangeEventTableRows,
			auditTableRows,
		} = createMockContext();
		const routes = createNativeRoutes();
		const adminRequest = new Request("https://example.test", {
			headers: { "X-Sikesra-User-Id": "user-demo-sikesra-admin" },
		});
		const editorRequest = new Request("https://example.test", {
			headers: { "X-Sikesra-User-Id": "user-demo-editor" },
		});

		const invalid = (await routes["custom-attributes/definitions/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				key: "sikesra_id_20",
				label: "Protected",
				scope: "entity_type",
				entityType: "rumah_ibadah",
				dataClass: "personal",
				dataType: "string",
				publicSafe: true,
			},
		} as any)) as any;
		expect(invalid.success).toBe(false);
		expect(invalid.error.details.fields).toEqual(["key", "publicSafe"]);

		const savedDefinition = (await routes["custom-attributes/definitions/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				id: "custom-attr-01",
				key: "local_program_note",
				label: "Local Program Note",
				scope: "entity_type",
				entityType: "rumah_ibadah",
				dataClass: "sensitive_personal",
				dataType: "text",
				maskByDefault: true,
				isExportable: false,
			},
		} as any)) as any;
		expect(savedDefinition.success).toBe(true);
		expect(customAttributeDefinitionTableRows).toContainEqual(
			expect.objectContaining({
				id: "custom-attr-01",
				attribute_key: "local_program_note",
				scope_type: "entity_type",
				entity_type: "rumah_ibadah",
				data_class: "sensitive_personal",
			}),
		);

		const missingScopeTarget = (await routes["custom-attributes/definitions/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				id: "custom-attr-sikesra-id-invalid",
				key: "specific_note_invalid",
				label: "Specific Note Invalid",
				scope: "sikesra_id_20",
				dataClass: "non_personal",
				dataType: "string",
			},
		} as any)) as any;
		expect(missingScopeTarget.success).toBe(false);
		expect(missingScopeTarget.error.details.fields).toEqual(["targetSikesraId20"]);

		const scopedDefinitions = [
			{
				id: "custom-attr-public-export-01",
				key: "public_program_code",
				label: "Public Program Code",
				scope: "global",
				dataClass: "non_personal",
				dataType: "string",
				publicSafe: true,
				isExportable: true,
			},
			{
				id: "custom-attr-subtype-01",
				key: "subtype_program_flag",
				label: "Subtype Program Flag",
				scope: "subtype",
				entityType: "rumah_ibadah",
				subtypeCode: "masjid",
				dataClass: "non_personal",
				dataType: "boolean",
			},
			{
				id: "custom-attr-registry-01",
				key: "registry_specific_note",
				label: "Registry Specific Note",
				scope: "registry_entity",
				targetRegistryEntityId: "registry-entity-custom-01",
				dataClass: "personal",
				dataType: "text",
			},
			{
				id: "custom-attr-sikesra-id-01",
				key: "sikesra_id_specific_note",
				label: "SIKESRA ID Specific Note",
				scope: "sikesra_id_20",
				targetSikesraId20: "62010100010102000001",
				dataClass: "restricted",
				dataType: "date",
				isExportable: true,
			},
			{
				id: "custom-attr-email-01",
				key: "public_contact_email",
				label: "Public Contact Email",
				scope: "global",
				dataClass: "non_personal",
				dataType: "email",
			},
		];
		for (const definition of scopedDefinitions) {
			const result = (await routes["custom-attributes/definitions/save"]!.handler({
				...ctx,
				request: adminRequest,
				input: definition,
			} as any)) as any;
			expect(result.success).toBe(true);
		}
		expect(customAttributeDefinitionTableRows).toContainEqual(
			expect.objectContaining({
				id: "custom-attr-sikesra-id-01",
				scope_type: "sikesra_id_20",
				target_sikesra_id_20: "62010100010102000001",
				data_type: "date",
			}),
		);

		const publicCustomExport = (await routes["exports/create"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				id: "export-custom-public-01",
				exportType: "registry",
				requestedFields: [
					"code",
					"custom:public_program_code",
					"custom:local_program_note",
					"custom:sikesra_id_specific_note",
				],
				sensitivityLevel: "public_safe",
			},
		} as any)) as any;
		expect(publicCustomExport.success).toBe(true);
		expect(publicCustomExport.item.resultSummary.allowedFields).toEqual([
			"code",
			"custom:public_program_code",
		]);
		expect(publicCustomExport.item.resultSummary.excludedFields).toEqual([
			"custom:local_program_note",
			"custom:sikesra_id_specific_note",
		]);

		const restrictedCustomExport = (await routes["exports/create"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				id: "export-custom-restricted-01",
				exportType: "registry",
				requestedFields: ["custom:sikesra_id_specific_note"],
				sensitivityLevel: "restricted",
				reason: "Authorized case review",
			},
		} as any)) as any;
		expect(restrictedCustomExport.success).toBe(true);
		expect(restrictedCustomExport.item.resultSummary.allowedFields).toEqual([
			"custom:sikesra_id_specific_note",
		]);

		const sensitiveCustomValue = "Sensitive local note";
		const savedValue = (await routes["custom-attributes/values/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				id: "custom-value-01",
				definitionId: "custom-attr-01",
				registryEntityId: "registry-entity-custom-01",
				entityType: "rumah_ibadah",
				value: sensitiveCustomValue,
			},
		} as any)) as any;
		expect(savedValue.success).toBe(true);

		const mismatchedScopedValue = (await routes["custom-attributes/values/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				id: "custom-value-sikesra-id-invalid",
				definitionId: "custom-attr-sikesra-id-01",
				registryEntityId: "registry-entity-custom-01",
				sikesraId20: "62010100010102000002",
				value: "2026-01-01",
			},
		} as any)) as any;
		expect(mismatchedScopedValue.success).toBe(false);
		expect(mismatchedScopedValue.error.details.fields).toEqual(["sikesraId20"]);

		const invalidDateValue = (await routes["custom-attributes/values/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				id: "custom-value-sikesra-id-date-invalid",
				definitionId: "custom-attr-sikesra-id-01",
				registryEntityId: "registry-entity-custom-01",
				sikesraId20: "62010100010102000001",
				value: "not-a-date",
			},
		} as any)) as any;
		expect(invalidDateValue.success).toBe(false);
		expect(invalidDateValue.error.details.fields).toEqual(["value"]);

		const invalidLongEmailValue = (await routes["custom-attributes/values/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				id: "custom-value-email-invalid",
				definitionId: "custom-attr-email-01",
				registryEntityId: "registry-entity-custom-01",
				value: `${"a".repeat(255)}@example.test`,
			},
		} as any)) as any;
		expect(invalidLongEmailValue.success).toBe(false);
		expect(invalidLongEmailValue.error.details.fields).toEqual(["value"]);

		const savedSikesraIdValue = (await routes["custom-attributes/values/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				id: "custom-value-sikesra-id-01",
				definitionId: "custom-attr-sikesra-id-01",
				registryEntityId: "registry-entity-custom-01",
				sikesraId20: "62010100010102000001",
				value: "2026-01-01",
			},
		} as any)) as any;
		expect(savedSikesraIdValue.success).toBe(true);
		collections.rolePermissionAssignments.set("site-editor", {
			roleSlug: "site-editor",
			permissions: ["sikesra.custom_attribute.read"],
			updatedAt: "2026-01-01T00:00:00.000Z",
		});
		expect(customAttributeValueTableRows).toContainEqual(
			expect.objectContaining({
				id: "custom-value-01",
				attribute_definition_id: "custom-attr-01",
				registry_entity_id: "registry-entity-custom-01",
				value_display: "Sensitive local note",
				sensitivity: "sensitive_personal",
			}),
		);
		expect(customAttributeValueTableRows).toContainEqual(
			expect.objectContaining({
				id: "custom-value-sikesra-id-01",
				sikesra_id_20: "62010100010102000001",
				value_date: "2026-01-01",
				sensitivity: "restricted",
			}),
		);

		const masked = (await routes["custom-attributes/values/list"]!.handler({
			...ctx,
			request: editorRequest,
			input: {},
		} as any)) as any;
		expect(masked.items).toContainEqual(
			expect.objectContaining({ id: "custom-value-01", valueDisplay: "[REDACTED]", masked: true }),
		);
		expect(customAttributeChangeEventTableRows.length).toBeGreaterThanOrEqual(2);
		expect(auditTableRows).toContainEqual(
			expect.objectContaining({ kind: "custom_attribute.definition.save" }),
		);
		expect(auditTableRows).toContainEqual(
			expect.objectContaining({ kind: "custom_attribute.value.save" }),
		);
		expect(auditTableRows).toContainEqual(
			expect.objectContaining({ kind: "custom_attribute.export.include" }),
		);
		const valueAudit = auditTableRows.find((row) => row.kind === "custom_attribute.value.save")!;
		const exportChangeEvent = customAttributeChangeEventTableRows.find(
			(row) => row.event_type === "custom_attribute.export.include",
		)!;
		const valueChangeEvent = customAttributeChangeEventTableRows.find(
			(row) => row.event_type === "custom_attribute.value.update",
		)!;
		expect(JSON.parse(String(exportChangeEvent.metadata_json))).toMatchObject({
			key: "public_program_code",
		});
		expect(JSON.stringify(JSON.parse(String(valueAudit.metadata_json)))).not.toContain(
			sensitiveCustomValue,
		);
		expect(JSON.stringify(JSON.parse(String(valueChangeEvent.metadata_json)))).not.toContain(
			sensitiveCustomValue,
		);
		expect(JSON.parse(String(valueAudit.metadata_json))).toMatchObject({ valueRedacted: true });
	});

	it("requires super-admin permission, confirmation, snapshot, and review access for permanent delete requests", async () => {
		const {
			ctx,
			collections,
			deleteRequestTableRows,
			deleteApprovalTableRows,
			deleteSnapshotTableRows,
			deleteEventTableRows,
			registryEntityTableRows,
			supportingDocumentTableRows,
			userRoleAssignmentTableRows,
			auditTableRows,
		} = createMockContext();
		const routes = createNativeRoutes();
		const adminRequest = new Request("https://example.test", {
			headers: { "X-Sikesra-User-Id": "user-demo-sikesra-admin" },
		});
		const superAdminRequest = new Request("https://example.test", {
			headers: { "X-Sikesra-User-Id": "user-demo-super-admin" },
		});

		const missingConfirmation = (await routes["crud/permanent-delete/request"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				targetTable: "sikesra_registry_entities",
				targetRecordId: "registry-entity-custom-01",
				targetType: "registry_entity",
				reason: "Wrong test data",
				confirmation: "DELETE",
			},
		} as any)) as any;
		expect(missingConfirmation.success).toBe(false);
		expect(missingConfirmation.error.details.fields).toEqual(["confirmation"]);

		const denied = (await routes["crud/permanent-delete/request"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				targetTable: "sikesra_registry_entities",
				targetRecordId: "registry-entity-custom-01",
				targetType: "registry_entity",
				reason: "Wrong test data",
				confirmation: "PERMANENT DELETE",
			},
		} as any)) as any;
		expect(denied.success).toBe(false);
		expect(denied.error.code).toBe("FORBIDDEN");

		collections.userRoleAssignments.set("user-demo-super-admin", {
			userId: "user-demo-super-admin",
			roles: ["sikesra_super_admin"],
			updatedAt: "2026-01-01T00:00:00.000Z",
		});
		const allowed = (await routes["crud/permanent-delete/request"]!.handler({
			...ctx,
			request: superAdminRequest,
			input: {
				id: "delete-request-01",
				targetTable: "sikesra_registry_entities",
				targetRecordId: "registry-entity-custom-01",
				targetType: "registry_entity",
				reason: "Wrong test data",
				confirmation: "PERMANENT DELETE",
			},
		} as any)) as any;

		expect(allowed.success).toBe(true);
		expect(deleteRequestTableRows).toContainEqual(
			expect.objectContaining({
				id: "delete-request-01",
				target_table: "sikesra_registry_entities",
				operation_type: "permanent_delete",
				requested_by: "user-demo-super-admin",
			}),
		);
		expect(deleteSnapshotTableRows).toContainEqual(
			expect.objectContaining({
				id: "delete-request-01:snapshot",
				delete_request_id: "delete-request-01",
			}),
		);
		expect(deleteEventTableRows).toContainEqual(
			expect.objectContaining({
				delete_request_id: "delete-request-01",
				event_kind: "crud.permanent_delete.request",
			}),
		);
		expect(auditTableRows).toContainEqual(
			expect.objectContaining({ kind: "crud.permanent_delete.request" }),
		);

		const listDenied = (await routes["crud/permanent-delete/requests/list"]!.handler({
			...ctx,
			input: {},
			request: new Request("https://example.test", {
				headers: {
					"X-Sikesra-User-Id": "user-demo-village",
				},
			}),
		} as any)) as { success: false; error: { code: string } };
		expect(listDenied.success).toBe(false);
		expect(listDenied.error.code).toBe("FORBIDDEN");

		const listAllowed = (await routes["crud/permanent-delete/requests/list"]!.handler({
			...ctx,
			input: {},
			request: new Request("https://example.test", {
				headers: {
					"X-Sikesra-User-Id": "user-demo-super-admin",
				},
			}),
		} as any)) as {
			items: Array<{ id: string; targetTable: string; targetRecordId: string; status: string }>;
		};
		expect(listAllowed.items).toContainEqual(
			expect.objectContaining({
				id: "delete-request-01",
				targetTable: "sikesra_registry_entities",
				targetRecordId: "registry-entity-custom-01",
				status: "requested",
			}),
		);

		const approved = (await routes["crud/permanent-delete/approve"]!.handler({
			...ctx,
			request: superAdminRequest,
			input: {
				id: "delete-request-01:approval:01",
				deleteRequestId: "delete-request-01",
				decision: "approved",
				notes: "Snapshot reviewed before execution.",
			},
		} as any)) as any;
		expect(approved.success).toBe(true);
		expect(deleteApprovalTableRows).toContainEqual(
			expect.objectContaining({
				id: "delete-request-01:approval:01",
				delete_request_id: "delete-request-01",
				approval_level: "super_admin",
				decision: "approved",
			}),
		);
		expect(deleteRequestTableRows).toContainEqual(
			expect.objectContaining({ id: "delete-request-01", status: "approved" }),
		);
		expect(deleteEventTableRows).toContainEqual(
			expect.objectContaining({
				delete_request_id: "delete-request-01",
				event_kind: "crud.permanent_delete.approve",
			}),
		);
		expect(auditTableRows).toContainEqual(
			expect.objectContaining({ kind: "crud.permanent_delete.approve" }),
		);

		supportingDocumentTableRows.push({
			tenant_id: "t-local-dev",
			site_id: "default",
			id: "doc-blocking-delete-01",
			registry_entity_id: "registry-entity-custom-01",
		});
		const blockedExecution = (await routes["crud/permanent-delete/execute"]!.handler({
			...ctx,
			request: superAdminRequest,
			input: {
				deleteRequestId: "delete-request-01",
				confirmation: "PERMANENT DELETE",
			},
		} as any)) as any;
		expect(blockedExecution.success).toBe(false);
		expect(blockedExecution.error.code).toBe("DELETE_BLOCKED_REFERENCES");
		expect(blockedExecution.error.details.references).toContain("supporting_documents");
		expect(deleteEventTableRows).toContainEqual(
			expect.objectContaining({
				delete_request_id: "delete-request-01",
				event_kind: "crud.permanent_delete.blocked",
			}),
		);
		expect(auditTableRows).toContainEqual(
			expect.objectContaining({ kind: "crud.permanent_delete.blocked" }),
		);

		await routes["registry/save"]!.handler({
			...ctx,
			request: superAdminRequest,
			input: {
				id: "registry-entity-execute-01",
				code: "DELETE-EXEC-01",
				label: "Delete Execution Candidate",
				entityType: "rumah_ibadah",
				sensitivity: "public_safe",
				provinceCode: "62",
				regencyCode: "6201",
				districtCode: "620101",
				villageCode: "6201010001",
			},
		} as any);
		await routes["crud/permanent-delete/request"]!.handler({
			...ctx,
			request: superAdminRequest,
			input: {
				id: "delete-request-02",
				targetTable: "sikesra_registry_entities",
				targetRecordId: "registry-entity-execute-01",
				targetType: "registry_entity",
				reason: "Duplicate test-only row",
				confirmation: "PERMANENT DELETE",
			},
		} as any);
		await routes["crud/permanent-delete/approve"]!.handler({
			...ctx,
			request: superAdminRequest,
			input: {
				id: "delete-request-02:approval:01",
				deleteRequestId: "delete-request-02",
				decision: "approved",
				notes: "No protected references found.",
			},
		} as any);
		const executed = (await routes["crud/permanent-delete/execute"]!.handler({
			...ctx,
			request: superAdminRequest,
			input: {
				deleteRequestId: "delete-request-02",
				confirmation: "PERMANENT DELETE",
			},
		} as any)) as any;
		expect(executed.success).toBe(true);
		expect(registryEntityTableRows.some((row) => row.id === "registry-entity-execute-01")).toBe(
			false,
		);
		expect(deleteRequestTableRows).toContainEqual(
			expect.objectContaining({ id: "delete-request-02", status: "executed" }),
		);
		expect(deleteEventTableRows).toContainEqual(
			expect.objectContaining({
				delete_request_id: "delete-request-02",
				event_kind: "crud.permanent_delete.execute",
			}),
		);
		expect(auditTableRows).toContainEqual(
			expect.objectContaining({ kind: "crud.permanent_delete.execute" }),
		);

		userRoleAssignmentTableRows.push({
			tenant_id: "t-local-dev",
			site_id: "default",
			id: "assignment-delete-01",
			emdash_user_id: "user-demo-doc-reviewer",
			role_slug: "sikesra_viewer_laporan",
			is_active: 0,
			deleted_at: "2026-01-01T00:00:00.000Z",
		});
		collections.userRoleAssignments.set("user-demo-doc-reviewer", {
			userId: "user-demo-doc-reviewer",
			roles: ["sikesra_viewer_laporan"],
			isActive: false,
		});
		await routes["crud/permanent-delete/request"]!.handler({
			...ctx,
			request: superAdminRequest,
			input: {
				id: "delete-request-03",
				targetTable: "sikesra_user_role_assignments",
				targetRecordId: "assignment-delete-01",
				targetType: "user_assignment",
				reason: "Expired inactive SIKESRA assignment after retention review",
				confirmation: "PERMANENT DELETE",
			},
		} as any);
		await routes["crud/permanent-delete/approve"]!.handler({
			...ctx,
			request: superAdminRequest,
			input: {
				id: "delete-request-03:approval:01",
				deleteRequestId: "delete-request-03",
				decision: "approved",
				notes: "Assignment-only deletion; EmDash user remains untouched.",
			},
		} as any);
		const assignmentExecuted = (await routes["crud/permanent-delete/execute"]!.handler({
			...ctx,
			request: superAdminRequest,
			input: {
				deleteRequestId: "delete-request-03",
				confirmation: "PERMANENT DELETE",
			},
		} as any)) as any;
		expect(assignmentExecuted.success).toBe(true);
		expect(userRoleAssignmentTableRows.some((row) => row.id === "assignment-delete-01")).toBe(
			false,
		);
		expect(await ctx.users.get("user-demo-doc-reviewer")).toMatchObject({
			id: "user-demo-doc-reviewer",
		});
		expect(deleteEventTableRows).toContainEqual(
			expect.objectContaining({
				delete_request_id: "delete-request-03",
				event_kind: "crud.permanent_delete.execute",
			}),
		);
	});

	it("migrates legacy registry blobs into D1 and document blobs into plugin storage on read", async () => {
		const {
			ctx,
			collections,
			kvData,
			registryEntityTableRows,
			fileObjectTableRows,
			supportingDocumentTableRows,
		} = createMockContext();
		kvData.set("custom:registryEntities", [
			{
				id: "registry-entity-legacy-01",
				code: "LG-001",
				label: "Legacy Registry Entity",
				entityType: "rumah_ibadah",
				sensitivity: "public_safe",
				region: {
					provinceCode: "62",
					regencyCode: "6201",
					districtCode: "620101",
					villageCode: "6201010001",
				},
				verificationStage: "draft",
				supportingDocumentIds: [],
				publicSummary: "Legacy registry summary",
			},
		]);
		kvData.set("custom:supportingDocuments", [
			{
				id: "doc-legacy-01",
				registryEntityId: "registry-entity-legacy-01",
				documentType: "surat_keterangan",
				title: "Legacy Document",
				sensitivity: "internal",
				issuedAt: "2026-01-01T00:00:00.000Z",
				verifiedBy: "legacy-verifier",
			},
		]);
		const routes = createNativeRoutes();
		const adminRequest = createAdminRequest();

		const registry = (await routes["registry/list"]!.handler({
			...ctx,
			request: adminRequest,
			input: {},
		} as any)) as any;
		const documents = (await routes["documents/list"]!.handler({
			...ctx,
			request: adminRequest,
			input: {},
		} as any)) as any;

		expect(registry.items.some((item: any) => item.id === "registry-entity-legacy-01")).toBe(true);
		expect(documents.items.some((item: any) => item.id === "doc-legacy-01")).toBe(true);
		expect(kvData.has("custom:registryEntities")).toBe(false);
		expect(kvData.has("custom:supportingDocuments")).toBe(false);
		expect(registryEntityTableRows).toContainEqual(
			expect.objectContaining({
				id: "registry-entity-legacy-01",
				code: "LG-001",
			}),
		);
		expect(collections.registryEntities.get("registry-entity-legacy-01")).toBeUndefined();
		expect(
			registry.items.find((item: any) => item.id === "registry-entity-legacy-01"),
		).toMatchObject({
			code: "LG-001",
		});
		expect(collections.supportingDocuments.get("doc-legacy-01")).toBeUndefined();
		expect(supportingDocumentTableRows).toContainEqual(
			expect.objectContaining({
				id: "doc-legacy-01",
				registry_entity_id: "registry-entity-legacy-01",
			}),
		);
		expect(fileObjectTableRows).toContainEqual(
			expect.objectContaining({
				id: "doc-legacy-01:file",
				classification: "internal",
			}),
		);
	});

	it("records lifecycle and cron behavior", async () => {
		const { ctx, cron, collections } = createMockContext();
		const hooks = createSharedHooks();

		const activate =
			typeof hooks?.["plugin:activate"] === "function"
				? hooks["plugin:activate"]
				: hooks?.["plugin:activate"]?.handler;
		const cronHook = typeof hooks?.cron === "function" ? hooks.cron : hooks?.cron?.handler;

		await activate!({} as any, ctx as any);
		await cronHook!(
			{
				name: "governance-summary",
				schedule: "0 * * * *",
				triggeredAt: new Date().toISOString(),
			} as any,
			ctx as any,
		);

		expect(cron.schedule).toHaveBeenCalledWith("governance-summary", { schedule: "0 * * * *" });
		expect(collections.auditEvents.size).toBeGreaterThan(1);
		expect(collections.permissionCatalog.size).toBeGreaterThan(0);
		expect(collections.roleCatalog.get("admin-sikesra")).toMatchObject({ slug: "admin-sikesra" });
		expect(collections.roleCatalog.get("sikesra_admin")).toMatchObject({ slug: "sikesra_admin" });
		expect(collections.permissionCatalog.get("sikesra.registry.read")).toMatchObject({
			slug: "sikesra.registry.read",
		});
		expect(collections.rolePermissionAssignments.get("sikesra_admin")).toMatchObject({
			roleSlug: "sikesra_admin",
			permissions: expect.arrayContaining([
				"sikesra.registry.read",
				"sikesra.rbac.manage",
				"sikesra.lifecycle.create",
				"sikesra.lifecycle.read_detail",
			]),
		});
		const sikesraAdminAssignment = collections.rolePermissionAssignments.get("sikesra_admin") as
			| { permissions: string[] }
			| undefined;
		expect(sikesraAdminAssignment?.permissions).not.toContain("sikesra.lifecycle.permanent_delete");
		expect(sikesraAdminAssignment?.permissions).not.toContain("sikesra.registry.permanent_delete");
		expect(sikesraAdminAssignment?.permissions).not.toContain(
			"sikesra.audit.retention_purge_execute",
		);
		expect(collections.rolePermissionAssignments.get("sikesra_super_admin")).toMatchObject({
			roleSlug: "sikesra_super_admin",
			permissions: expect.arrayContaining([
				"sikesra.lifecycle.permanent_delete",
				"sikesra.permanent_delete.request",
				"sikesra.audit.retention_purge_execute",
			]),
		});
		expect(collections.userRoleAssignments.get("user-demo-village")).toMatchObject({
			userId: "user-demo-village",
			roles: ["verifier-desa-kelurahan"],
		});
		expect(collections.pluginState.size).toBeGreaterThan(0);
		expect(collections.pluginState.get("state:lastLifecycle")).toMatchObject({
			key: "state:lastLifecycle",
			value: "plugin:activate",
		});
		expect(collections.pluginState.get("state:lastCronAt")).toMatchObject({
			key: "state:lastCronAt",
		});
		expect(collections.pluginState.get("state:lastPreviewUserId")).toMatchObject({
			key: "state:lastPreviewUserId",
			value: "user-demo-editor",
		});
		expect(collections.pluginState.get("state:lastAbacPreviewSubjectId")).toMatchObject({
			key: "state:lastAbacPreviewSubjectId",
			value: "user-demo-editor",
		});
		expect(collections.pluginState.get("state:lastAbacPreviewResourceId")).toMatchObject({
			key: "state:lastAbacPreviewResourceId",
			value: "resource-public-post",
		});
	});

	it("migrates legacy plugin storage collections into prefixed collections on activate", async () => {
		const { ctx, collections, dbRows, seedDbRow, auditTableRows } = createMockContext();
		const hooks = createSharedHooks();
		const activate =
			typeof hooks?.["plugin:activate"] === "function"
				? hooks["plugin:activate"]
				: hooks?.["plugin:activate"]?.handler;

		seedDbRow({
			plugin_id: "awcms-micro-example",
			collection: "auditEvents",
			id: "audit-legacy-01",
			data: JSON.stringify({
				id: "audit-legacy-01",
				timestamp: "2026-01-01T00:00:00.000Z",
				kind: "legacy.audit",
				scope: "lifecycle",
				actor: "system",
				summary: "Legacy audit row",
				metadata: {},
			}),
			created_at: "2026-01-01T00:00:00.000Z",
			updated_at: "2026-01-01T00:00:00.000Z",
		});
		seedDbRow({
			plugin_id: AWCMS_SIKESRA_PLUGIN_ID,
			collection: "sikesra_audit_events",
			id: "audit-legacy-01",
			data: JSON.stringify({
				id: "audit-legacy-01",
				timestamp: "2026-02-01T00:00:00.000Z",
				kind: "current.audit",
				scope: "lifecycle",
				actor: "system",
				summary: "Current audit row",
				metadata: {},
			}),
			created_at: "2026-02-01T00:00:00.000Z",
			updated_at: "2026-02-01T00:00:00.000Z",
		});
		auditTableRows.push({
			id: "audit-legacy-01",
			timestamp: "2026-02-01T00:00:00.000Z",
			kind: "current.audit",
			scope: "lifecycle",
			actor: "system",
			summary: "Current audit row",
			metadata: "{}",
			user_id: null,
			user_name: null,
			created_at: "2026-02-01T00:00:00.000Z",
			updated_at: "2026-02-01T00:00:00.000Z",
		});

		await activate!({} as any, ctx as any);

		const auditList = (await createNativeRoutes()["audit/list"]!.handler({
			...ctx,
			request: new Request("https://example.test", {
				headers: { "X-Sikesra-User-Id": "user-demo-sikesra-admin" },
			}),
			input: {},
		} as any)) as any;
		expect(
			auditList.items.some(
				(item: any) => item.id === "audit-legacy-01" && item.summary === "Current audit row",
			),
		).toBe(true);
		expect(dbRows.some((row) => row.collection === "auditEvents")).toBe(false);
		expect(auditTableRows.some((row) => row.id === "audit-legacy-01")).toBe(true);
		expect(collections.auditEvents.get("audit-legacy-01")).toMatchObject({
			kind: "current.audit",
			summary: "Current audit row",
		});
	});

	it("migrates legacy runtime state into dedicated D1 tables on activate", async () => {
		const {
			ctx,
			collections,
			kvData,
			settingsTableRows,
			dataTypeTableRows,
			dataSubtypeTableRows,
			officialRegionTableRows,
			localRegionTableRows,
			verificationStageTableRows,
		} = createMockContext();
		const hooks = createSharedHooks();
		const activate =
			typeof hooks?.["plugin:activate"] === "function"
				? hooks["plugin:activate"]
				: hooks?.["plugin:activate"]?.handler;

		collections.settingsState.set("siteName", {
			key: "siteName",
			value: "Legacy SIKESRA",
			updatedAt: "2026-01-01T00:00:00.000Z",
		});
		collections.verificationStageState.set("registry-entity-01", {
			registryEntityId: "registry-entity-01",
			stage: "verified_sopd",
			updatedAt: "2026-01-01T00:00:00.000Z",
		});
		kvData.set("custom:data-types", [
			{
				id: "legacy-type",
				code: "LEGACY",
				label: "Legacy Type",
				subTypes: [{ code: "legacy-subtype", label: "Legacy Subtype" }],
			},
		]);
		kvData.set("custom:regions", [
			{
				code: "32",
				name: "Jawa Barat",
				regencies: [
					{
						code: "3204",
						name: "Kabupaten Bandung",
						districts: [{ code: "320401", name: "Soreang", villages: [] }],
					},
				],
			},
		]);
		kvData.set("custom:local-regions", [
			{
				code: "local-service-area-01",
				name: "Local Service Area 01",
				regencies: [],
			},
		]);
		kvData.set("state:sikesraVerificationStages", {
			"registry-entity-02": "verified_kabupaten",
		});

		await activate!({} as any, ctx as any);

		expect(settingsTableRows).toContainEqual(
			expect.objectContaining({ key: "siteName", value_json: JSON.stringify("Legacy SIKESRA") }),
		);
		expect(dataTypeTableRows).toContainEqual(
			expect.objectContaining({ id: "legacy-type", code: "LEGACY", label: "Legacy Type" }),
		);
		expect(dataSubtypeTableRows).toContainEqual(
			expect.objectContaining({
				data_type_id: "legacy-type",
				code: "legacy-subtype",
				label: "Legacy Subtype",
			}),
		);
		expect(officialRegionTableRows).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ code: "32", level: "province", name: "Jawa Barat" }),
				expect.objectContaining({ code: "3204", parent_code: "32", level: "regency" }),
				expect.objectContaining({ code: "320401", parent_code: "3204", level: "district" }),
			]),
		);
		expect(localRegionTableRows).toContainEqual(
			expect.objectContaining({
				code: "local-service-area-01",
				level: "province",
				local_type: "operator_defined",
			}),
		);
		expect(verificationStageTableRows).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					registry_entity_id: "registry-entity-01",
					stage: "verified_sopd",
					current_level: "kabupaten_admin",
				}),
				expect.objectContaining({
					registry_entity_id: "registry-entity-02",
					stage: "verified_kabupaten",
					current_level: "tampil",
				}),
			]),
		);
		expect(kvData.has("state:sikesraVerificationStages")).toBe(false);
		expect(collections.auditEvents.size).toBeGreaterThan(0);
	});

	it("records content and media hooks", async () => {
		const { ctx, collections } = createMockContext();
		const hooks = createSharedHooks();

		const beforeSave =
			typeof hooks?.["content:beforeSave"] === "function"
				? hooks["content:beforeSave"]
				: hooks?.["content:beforeSave"]?.handler;
		const afterPublish =
			typeof hooks?.["content:afterPublish"] === "function"
				? hooks["content:afterPublish"]
				: hooks?.["content:afterPublish"]?.handler;
		const beforeUpload =
			typeof hooks?.["media:beforeUpload"] === "function"
				? hooks["media:beforeUpload"]
				: hooks?.["media:beforeUpload"]?.handler;
		const afterUpload =
			typeof hooks?.["media:afterUpload"] === "function"
				? hooks["media:afterUpload"]
				: hooks?.["media:afterUpload"]?.handler;

		await beforeSave!(
			{ collection: "posts", isNew: false, content: { id: "post-1", slug: "hello" } } as any,
			ctx as any,
		);
		await afterPublish!(
			{ collection: "posts", content: { id: "post-1", authorId: "user-1" } } as any,
			ctx as any,
		);
		await beforeUpload!(
			{ file: { name: "logo.png", type: "image/png", size: 1234 } } as any,
			ctx as any,
		);
		await afterUpload!({ media: { id: "media-1", mimeType: "image/png" } } as any, ctx as any);

		expect(collections.contentSnapshots.size).toBe(1);
		expect(collections.auditEvents.size).toBeGreaterThanOrEqual(4);
	});

	it("supports access-rights catalog create, list, matrix, and preview flows", async () => {
		const {
			ctx,
			collections,
			permissionCatalogTableRows,
			roleCatalogTableRows,
			rolePermissionAssignmentTableRows,
			userRoleAssignmentTableRows,
		} = createMockContext();
		const routes = createNativeRoutes();
		const adminRequest = createAdminRequest();

		const permissionsBefore = (await routes["access/permissions/list"]!.handler({
			...ctx,
			request: adminRequest,
			input: {},
		} as any)) as any;
		expect(permissionsBefore.items.length).toBeGreaterThan(0);

		const users = (await routes["access/users/list"]!.handler({
			...ctx,
			request: adminRequest,
			input: { limit: 100 },
		} as any)) as any;
		expect(users.items).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: "user-demo-doc-reviewer",
					email: "reviewer@example.test",
				}),
			]),
		);

		await routes["access/permissions/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				slug: "documents.review",
				label: "Review Documents",
				description: "Allows reviewing governed documents.",
				scope: "documents",
			},
		} as any);

		await routes["access/roles/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				slug: "document-reviewer",
				label: "Document Reviewer",
				description: "Reviews controlled documents.",
			},
		} as any);

		await routes["access/matrix/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				roleSlug: "document-reviewer",
				permissions: ["documents.review", "audit.read.events"],
			},
		} as any);

		await routes["access/users/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				emdashUserId: "user-demo-doc-reviewer",
				roles: ["document-reviewer"],
			},
		} as any);
		collections.rolePermissionAssignments.delete("document-reviewer");
		collections.userRoleAssignments.delete("user-demo-doc-reviewer");

		const preview = (await routes["access/preview"]!.handler({
			...ctx,
			request: adminRequest,
			input: { userId: "user-demo-doc-reviewer", permissionSlug: "documents.review" },
		} as any)) as any;

		expect(preview.allowed).toBe(true);
		expect(preview.matchedRoles).toContain("document-reviewer");
		expect(permissionCatalogTableRows.some((row) => row.slug === "documents.review")).toBe(true);
		expect(roleCatalogTableRows.some((row) => row.slug === "document-reviewer")).toBe(true);
		expect(
			rolePermissionAssignmentTableRows.some((row) => row.permission_slug === "documents.review"),
		).toBe(true);
		expect(
			userRoleAssignmentTableRows.some((row) => row.emdash_user_id === "user-demo-doc-reviewer"),
		).toBe(true);

		await routes["access/users/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				emdashUserId: "user-demo-doc-reviewer",
				roles: ["document-reviewer"],
				isActive: false,
			},
		} as any);

		const inactivePreview = (await routes["access/preview"]!.handler({
			...ctx,
			request: adminRequest,
			input: { userId: "user-demo-doc-reviewer", permissionSlug: "documents.review" },
		} as any)) as any;

		expect(inactivePreview.allowed).toBe(false);
		expect(
			userRoleAssignmentTableRows.some(
				(row) => row.emdash_user_id === "user-demo-doc-reviewer" && row.is_active === 0,
			),
		).toBe(true);
		expect(collections.accessChangeEvents.size).toBeGreaterThanOrEqual(4);
	});

	it("supports EmDash user region and organization scope assignments", async () => {
		const { ctx, collections, userScopeAssignmentTableRows } = createMockContext();
		const routes = createNativeRoutes();
		const adminRequest = createAdminRequest();

		const saved = (await routes["access/scopes/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				userId: "user-demo-doc-reviewer",
				regionScopeType: "regency",
				regionScopeCode: "3372",
				organizationScopeType: "sopd",
				organizationScopeCode: "dinsos",
				isActive: true,
				validFrom: "2026-01-01",
				validUntil: "2026-12-31",
			},
		} as any)) as any;

		const list = (await routes["access/scopes/list"]!.handler({
			...ctx,
			request: adminRequest,
			input: {},
		} as any)) as any;

		expect(saved.success).toBe(true);
		expect(saved.item).toMatchObject({
			userId: "user-demo-doc-reviewer",
			regionScopeType: "regency",
			regionScopeCode: "3372",
			organizationScopeType: "sopd",
			organizationScopeCode: "dinsos",
		});
		expect(list.items.some((item: any) => item.userId === "user-demo-doc-reviewer")).toBe(true);
		expect(collections.userScopeAssignments.has("user-demo-doc-reviewer")).toBe(true);
		expect(userScopeAssignmentTableRows).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					emdash_user_id: "user-demo-doc-reviewer",
					region_scope_type: "regency",
					region_scope_code: "3372",
					organization_scope_type: "sopd",
					organization_scope_code: "dinsos",
				}),
			]),
		);
		expect(collections.accessChangeEvents.size).toBeGreaterThanOrEqual(1);
		expect(collections.auditEvents.size).toBeGreaterThanOrEqual(1);
	});

	it("validates EmDash user scope assignments", async () => {
		const { ctx, collections } = createMockContext();
		const routes = createNativeRoutes();
		const adminRequest = createAdminRequest();

		const missingUser = (await routes["access/scopes/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: { userId: " ", regionScopeType: "regency", organizationScopeType: "sopd" },
		} as any)) as any;
		const invalidRegion = (await routes["access/scopes/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: { userId: "user-demo-doc-reviewer", regionScopeType: "planet" },
		} as any)) as any;
		const invalidOrganization = (await routes["access/scopes/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: { userId: "user-demo-doc-reviewer", organizationScopeType: "unknown_org" },
		} as any)) as any;

		expect(missingUser.success).toBe(false);
		expect(missingUser.error.message).toContain("EmDash user reference");
		expect(invalidRegion.success).toBe(false);
		expect(invalidRegion.error.message).toContain("region scope");
		expect(invalidOrganization.success).toBe(false);
		expect(invalidOrganization.error.message).toContain("organization scope");
		expect(collections.userScopeAssignments.has("user-demo-doc-reviewer")).toBe(false);
		expect(collections.accessChangeEvents.size).toBe(0);
	});

	it("requires an EmDash user reference and SIKESRA role for user assignments", async () => {
		const { ctx, collections } = createMockContext();
		const routes = createNativeRoutes();
		const adminRequest = createAdminRequest();

		const missingUser = (await routes["access/users/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: { userId: " ", roles: ["document-reviewer"] },
		} as any)) as any;
		const missingRole = (await routes["access/users/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: { userId: "user-demo-doc-reviewer", roles: [] },
		} as any)) as any;

		expect(missingUser.success).toBe(false);
		expect(missingUser.error.code).toBe("VALIDATION_ERROR");
		expect(missingRole.success).toBe(false);
		expect(missingRole.error.message).toContain("EmDash user reference");
		expect(collections.userRoleAssignments.has("")).toBe(false);
		expect(collections.userRoleAssignments.has("user-demo-doc-reviewer")).toBe(false);
		expect(collections.accessChangeEvents.size).toBe(0);
	});

	it("requires role and permissions for role matrix assignments", async () => {
		const { ctx, collections } = createMockContext();
		const routes = createNativeRoutes();
		const adminRequest = createAdminRequest();

		const missingRole = (await routes["access/matrix/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: { roleSlug: " ", permissions: ["documents.review"] },
		} as any)) as any;
		const missingPermissions = (await routes["access/matrix/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: { roleSlug: "document-reviewer", permissions: [] },
		} as any)) as any;

		expect(missingRole.success).toBe(false);
		expect(missingRole.error.code).toBe("VALIDATION_ERROR");
		expect(missingPermissions.success).toBe(false);
		expect(missingPermissions.error.message).toContain("at least one permission");
		expect(collections.rolePermissionAssignments.has("document-reviewer")).toBe(false);
		expect(collections.accessChangeEvents.size).toBe(0);
	});

	it("returns a deterministic denied access preview when roles do not grant the permission", async () => {
		const { ctx } = createMockContext();
		const routes = createNativeRoutes();
		const adminRequest = createAdminRequest();

		const preview = (await routes["access/preview"]!.handler({
			...ctx,
			request: adminRequest,
			input: { userId: "user-demo-editor", permissionSlug: "content.review.publish" },
		} as any)) as any;

		expect(preview.allowed).toBe(false);
		expect(preview.reason).toContain("not granted");
	});

	it("validates ABAC attribute form-builder keys", async () => {
		const { ctx, collections } = createMockContext();
		const routes = createNativeRoutes();
		const adminRequest = createAdminRequest();

		const invalidKey = (await routes["abac/attributes/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: { key: "Owner User", label: "Owner User", targetType: "subject" },
		} as any)) as any;
		const invalidTarget = (await routes["abac/attributes/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: { key: "owner_user", label: "Owner User", targetType: "global" },
		} as any)) as any;

		expect(invalidKey.success).toBe(false);
		expect(invalidKey.error.message).toContain("snake_case");
		expect(invalidTarget.success).toBe(false);
		expect(invalidTarget.error.message).toContain("subject, resource, or context");
		expect(collections.abacAttributeCatalog.has("Owner User")).toBe(false);
		expect(collections.abacAttributeCatalog.has("owner_user")).toBe(false);
		expect(collections.abacChangeEvents.size).toBe(0);
	});

	it("validates ABAC policy form-builder inputs", async () => {
		const { ctx, collections } = createMockContext();
		const routes = createNativeRoutes();
		const adminRequest = createAdminRequest();

		const invalidId = (await routes["abac/policies/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: { id: "Policy 1", effect: "allow", actions: ["content.read"] },
		} as any)) as any;
		const invalidEffect = (await routes["abac/policies/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: { id: "policy_one", effect: "maybe", actions: ["content.read"] },
		} as any)) as any;
		const missingAction = (await routes["abac/policies/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: { id: "policy_two", effect: "allow", actions: [] },
		} as any)) as any;

		expect(invalidId.success).toBe(false);
		expect(invalidId.error.message).toContain("lowercase slug");
		expect(invalidEffect.success).toBe(false);
		expect(invalidEffect.error.message).toContain("allow or deny");
		expect(missingAction.success).toBe(false);
		expect(missingAction.error.message).toContain("at least one action");
		expect(collections.abacPolicyRules.has("policy_one")).toBe(false);
		expect(collections.abacPolicyRules.has("policy_two")).toBe(false);
		expect(collections.abacChangeEvents.size).toBe(0);
	});

	it("supports ABAC attribute, policy, preview, and sensitive-action audit flows", async () => {
		const {
			ctx,
			collections,
			abacAttributeCatalogTableRows,
			abacSubjectAssignmentTableRows,
			abacResourceAssignmentTableRows,
			abacPolicyRuleTableRows,
		} = createMockContext();
		const routes = createNativeRoutes();
		const adminRequest = createAdminRequest();

		const attributes = (await routes["abac/attributes/list"]!.handler({
			...ctx,
			request: adminRequest,
			input: {},
		} as any)) as any;
		expect(attributes.items.length).toBeGreaterThan(0);

		await routes["abac/attributes/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				key: "action",
				label: "Action",
				targetType: "context",
				description: "Action under review",
			},
		} as any);

		await routes["abac/policies/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				id: "allow-published-read-kotawaringin-barat",
				label: "Allow published read in Kotawaringin Barat",
				effect: "allow",
				actions: ["content.read"],
				requiredSubject: { tenant_id: "tenant-a" },
				requiredResource: { resource_status: "published", resource_sensitivity: "public" },
				requiredContext: { region_scope: "6201" },
			},
		} as any);
		await routes["abac/subjects/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				subjectId: "user-demo-editor",
				attributes: { tenant_id: "tenant-a", site_id: "site-main", region_scope: "6201" },
			},
		} as any);
		await routes["abac/resources/save"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				resourceId: "resource-public-post",
				attributes: { resource_status: "published", resource_sensitivity: "public" },
			},
		} as any);
		collections.abacSubjectAssignments.delete("user-demo-editor");
		collections.abacResourceAssignments.delete("resource-public-post");
		collections.abacPolicyRules.delete("allow-published-read-kotawaringin-barat");

		const allow = (await routes["abac/preview"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				subjectId: "user-demo-editor",
				resourceId: "resource-public-post",
				action: "content.read",
				contextAttributes: { region_scope: "6201" },
			},
		} as any)) as any;

		expect(allow.allowed).toBe(true);
		expect(allow.effect).toBe("allow");
		expect(abacAttributeCatalogTableRows.some((row) => row.key === "action")).toBe(true);
		expect(
			abacSubjectAssignmentTableRows.some((row) => row.emdash_user_id === "user-demo-editor"),
		).toBe(true);
		expect(
			abacResourceAssignmentTableRows.some((row) => row.resource_id === "resource-public-post"),
		).toBe(true);
		expect(
			abacPolicyRuleTableRows.some(
				(row) => row.id === "allow-published-read-kotawaringin-barat",
			),
		).toBe(true);

		const deny = (await routes["abac/preview"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				subjectId: "user-demo-reviewer",
				resourceId: "resource-sensitive-policy",
				action: "content.publish_sensitive",
				contextAttributes: {},
			},
		} as any)) as any;

		expect(deny.allowed).toBe(false);
		expect(deny.reason).toContain("Explicit deny");

		const missing = (await routes["abac/preview"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				subjectId: "user-demo-editor",
				resourceId: "resource-public-post",
				action: "content.read",
				contextAttributes: {},
			},
		} as any)) as any;

		expect(missing.allowed).toBe(false);
		expect(missing.reason).toContain("Missing required attributes");

		const regionMismatch = (await routes["abac/preview"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				subjectId: "user-demo-editor",
				resourceId: "resource-public-post",
				action: "content.read",
				contextAttributes: { region_scope: "id-bandung" },
			},
		} as any)) as any;

		expect(regionMismatch.allowed).toBe(false);
		expect(regionMismatch.reason).toBe("No matching allow policy for action content.read");

		await routes["abac/enforce-demo"]!.handler({
			...ctx,
			request: adminRequest,
			input: {
				subjectId: "user-demo-reviewer",
				resourceId: "resource-sensitive-policy",
				action: "content.publish_sensitive",
				contextAttributes: { action: "content.publish_sensitive" },
			},
		} as any);

		expect(collections.abacChangeEvents.size).toBeGreaterThanOrEqual(3);
	});

	it("exports a sandbox-compatible server entry", () => {
		expect(sandboxPlugin.hooks?.["plugin:install"]).toBeTruthy();
		expect(sandboxPlugin.routes?.["public/status"]).toBeTruthy();
	});

	it("keeps the manifest aligned with the implemented plugin surface", () => {
		const manifestPath = resolve(import.meta.dirname, "../emdash-plugin.jsonc");
		const manifest = parseJsoncObject<any>(readFileSync(manifestPath, "utf8"));

		expect(packageJson.files).toEqual(expect.arrayContaining(["migrations", "seeds", "docs"]));
		expect(manifest.slug).toBe("awcms-micro-sikesra");
		expect(manifest.version).toBe(packageJson.version);
		expect(manifest.publisher).toBe("ahliweb.co.id");
		expect(manifest.author.name).toBe("AWCMS-Micro / AhliWeb");
		expect(manifest.name).toBe("AWCMS-Micro SIKESRA Plugin");
		expect(manifest.description).toContain("SIKESRA welfare and social-religious registry plugin");
		expect(manifest.description).not.toContain("demo");
		expect(manifest.description).not.toContain("demonstrating");
		expect(manifest.name).not.toContain("Example Plugin");
		expect(manifest.keywords).not.toContain("example");
		expect(manifest.capabilities).toEqual([...AWCMS_SIKESRA_CAPABILITIES]);
		expect(manifest.admin.pages.map((page: { path: string }) => page.path).toSorted()).toEqual(
			[...SIKESRA_REQUIRED_ADMIN_PAGE_PATHS].toSorted(),
		);
		expect(manifest.admin.widgets[0].id).toBe("governance-status");
		expect(manifest.admin.widgets[1].id).toBe("access-rights-health");
		expect(manifest.admin.widgets[2].id).toBe("abac-policy-status");
		expect(Object.keys(manifest.storage).toSorted()).toEqual([
			"sikesra_abac_attribute_catalog",
			"sikesra_abac_change_events",
			"sikesra_abac_policy_rules",
			"sikesra_abac_resource_assignments",
			"sikesra_abac_subject_assignments",
			"sikesra_access_change_events",
			"sikesra_content_snapshots",
			"sikesra_permission_catalog",
			"sikesra_plugin_state",
			"sikesra_registry_entities",
			"sikesra_role_catalog",
			"sikesra_role_permission_assignments",
			"sikesra_settings_state",
			"sikesra_supporting_documents",
			"sikesra_user_role_assignments",
			"sikesra_verification_events",
			"sikesra_verification_stage_state",
		]);
	});

	it("uses the SIKESRA factory in maintained templates", () => {
		const localTemplateConfig = readFileSync(
			resolve(import.meta.dirname, "../../../../templates/awcms-micro-default/astro.config.mjs"),
			"utf8",
		);
		const cloudflareTemplateConfig = readFileSync(
			resolve(
				import.meta.dirname,
				"../../../../templates/awcms-micro-default-cloudflare/astro.config.mjs",
			),
			"utf8",
		);

		for (const config of [localTemplateConfig, cloudflareTemplateConfig]) {
			expect(config).toContain("awcmsMicroSikesraPlugin");
			expect(config).not.toContain("awcmsMicroExamplePlugin");
		}
	});
});
