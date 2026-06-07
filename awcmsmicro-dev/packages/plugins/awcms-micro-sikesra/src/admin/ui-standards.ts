import { AWCMS_SIKESRA_PLUGIN_ID } from "../runtime.js";

export const SIKESRA_ADMIN_ROUTE_BASE = `/_emdash/admin/plugins/${AWCMS_SIKESRA_PLUGIN_ID}`;

const SCHEME_REGEX = /^[a-z][a-z0-9+.-]*:/i;

export function toSikesraAdminHref(path: string) {
	const trimmedPath = path.trim();
	if (
		!trimmedPath ||
		trimmedPath.includes("\\") ||
		trimmedPath.includes("?") ||
		trimmedPath.includes("#") ||
		SCHEME_REGEX.test(trimmedPath) ||
		trimmedPath.startsWith("//")
	) {
		throw new Error(`Invalid SIKESRA admin path: ${path}`);
	}
	const normalizedPath = trimmedPath.startsWith("/") ? trimmedPath : `/${trimmedPath}`;
	if (
		normalizedPath.split("/").some((segment) => segment === ".." || segment === ".") ||
		normalizedPath.includes("//")
	) {
		throw new Error(`Invalid SIKESRA admin path: ${path}`);
	}
	return `${SIKESRA_ADMIN_ROUTE_BASE}${normalizedPath}`;
}

export function isSikesraAdminHref(href: string) {
	return href.startsWith(`${SIKESRA_ADMIN_ROUTE_BASE}/`);
}

export const SIKESRA_OPERATOR_WORKFLOW_STEPS = [
	"Configure",
	"Input or Import",
	"Validate",
	"Verify",
	"Publish Aggregate",
	"Report or Export",
	"Audit or Govern",
] as const;

export const SIKESRA_OVERVIEW_SECTIONS = [
	"System readiness banner",
	"Operational KPIs",
	"Workflow shortcuts",
	"Eight module cards",
	"Public aggregate preview",
	"Recent audit or lifecycle activity",
] as const;

export const SIKESRA_OVERVIEW_KPIS = [
	"Total records",
	"Draft records",
	"Pending verification",
	"Verified records",
	"Incomplete documents",
	"Import batches waiting review",
	"Restricted export requests",
	"Audit events requiring review",
] as const;

export const SIKESRA_OVERVIEW_SHORTCUTS = [
	{
		label: "Add record",
		href: toSikesraAdminHref("registry/new"),
		permissionSlug: "sikesra.registry.create",
	},
	{
		label: "Import data",
		href: toSikesraAdminHref("import"),
		permissionSlug: "sikesra.import.create",
	},
	{
		label: "Verification queue",
		href: toSikesraAdminHref("verification"),
		permissionSlug: "sikesra.verification.read",
	},
	{
		label: "Duplicate review",
		href: toSikesraAdminHref("import"),
		permissionSlug: "sikesra.import.validate",
	},
	{ label: "Reports", href: toSikesraAdminHref("reports"), permissionSlug: "sikesra.report.read" },
	{
		label: "Access management",
		href: toSikesraAdminHref("access/roles"),
		permissionSlug: "sikesra.rbac.read",
	},
	{ label: "Audit", href: toSikesraAdminHref("audit"), permissionSlug: "sikesra.audit.read" },
] as const;

export const SIKESRA_PAGE_ANATOMY = [
	"Page header",
	"Purpose description",
	"Primary action area",
	"Filters or search",
	"Status summary",
	"Main content table, card, or form",
	"Context panel or detail drawer",
	"Audit or status footer",
	"Empty, loading, and error states",
] as const;

export const SIKESRA_STATUS_BADGES = [
	"Draft",
	"Needs Review",
	"Pending Desa",
	"Pending Kecamatan",
	"Pending SOPD",
	"Pending Kabupaten",
	"Verified",
	"Rejected",
	"Needs Revision",
	"Archived",
	"Suppressed",
	"Public Safe",
	"Sensitive",
	"Restricted",
	"Orphaned User",
] as const;

export const SIKESRA_STANDARD_EMPTY_STATES = [
	"No records yet",
	"No pending verification",
	"No documents uploaded",
	"No import batch",
	"No audit event",
	"No user assignment",
	"No ABAC policy",
] as const;

export interface SikesraWorkflowStepDefinition {
	id: string;
	label: string;
	description: string;
	permissionSlug?: string;
	requiresReason?: boolean;
	requiresAudit?: boolean;
	privacyCheck?: boolean;
}

export const SIKESRA_REGISTRY_WIZARD_STEPS: SikesraWorkflowStepDefinition[] = [
	{
		id: "module",
		label: "Select module and subtype",
		description: "Choose one of the eight SIKESRA modules and its subtype.",
		permissionSlug: "sikesra.registry.create",
	},
	{
		id: "region",
		label: "Select official or local region",
		description: "Attach province, regency, district, village, and optional local service scope.",
	},
	{
		id: "identity",
		label: "Fill core identity",
		description:
			"Capture label, SIKESRA ID input hints, public summary, and verification starting state.",
	},
	{
		id: "details",
		label: "Fill personal or institution details",
		description: "Render module-specific fields from the field standard catalog.",
		privacyCheck: true,
	},
	{
		id: "addresses",
		label: "Fill KTP and domicile address",
		description:
			"Show KTP and domicile address groups when the selected module stores person data.",
		privacyCheck: true,
	},
	{
		id: "custom-attributes",
		label: "Fill dynamic custom attributes",
		description:
			"Render active custom attributes scoped to the module, subtype, region, organization, or SIKESRA ID.",
	},
	{
		id: "documents",
		label: "Attach document metadata",
		description:
			"Add document checklist items, classification, checksum, and linked file metadata.",
		permissionSlug: "sikesra.document.upload",
		privacyCheck: true,
	},
	{
		id: "review",
		label: "Review validation and privacy",
		description:
			"Confirm validation status, masking, public-safe flags, and audit impact before save.",
		requiresAudit: true,
	},
];

export const SIKESRA_IMPORT_WORKFLOW_STEPS: SikesraWorkflowStepDefinition[] = [
	{
		id: "upload",
		label: "Upload",
		description: "Select a CSV or XLSX file and expected SIKESRA module.",
		permissionSlug: "sikesra.import.create",
	},
	{
		id: "preview",
		label: "Preview",
		description: "Show row counts, headers, unmapped columns, and detected sensitive columns.",
	},
	{
		id: "map",
		label: "Map columns",
		description:
			"Map source columns to known field standards, including KTP and domicile address groups.",
	},
	{
		id: "validate",
		label: "Validate",
		description: "Run required-field, type, sensitivity, and module-specific validation.",
		permissionSlug: "sikesra.import.validate",
	},
	{
		id: "duplicate-review",
		label: "Duplicate review",
		description: "Require decisions for duplicate-risk rows before promotion.",
		requiresReason: true,
		requiresAudit: true,
	},
	{
		id: "promote",
		label: "Promote valid rows",
		description: "Promote only valid and reviewed staged rows into canonical D1 tables.",
		permissionSlug: "sikesra.import.promote",
		requiresAudit: true,
	},
	{
		id: "summary",
		label: "Summary",
		description: "Show promoted, skipped, invalid, duplicate-risk, and audit totals.",
	},
];

export const SIKESRA_VERIFICATION_QUEUE_TABS = [
	{ id: "desa_kelurahan", label: "Desa/Kelurahan", permissionSlug: "sikesra.verification.read" },
	{ id: "kecamatan", label: "Kecamatan", permissionSlug: "sikesra.verification.read" },
	{ id: "sopd", label: "SOPD", permissionSlug: "sikesra.verification.read" },
	{ id: "kabupaten_admin", label: "Kabupaten/Admin", permissionSlug: "sikesra.verification.read" },
] as const;

export const SIKESRA_ACCESS_ASSIGNMENT_STEPS: SikesraWorkflowStepDefinition[] = [
	{
		id: "select-user",
		label: "Select EmDash user",
		description: "Search or select an existing trusted EmDash user reference.",
		permissionSlug: "sikesra.rbac.manage",
	},
	{
		id: "assign-role",
		label: "Assign SIKESRA role",
		description:
			"Attach one or more SIKESRA operational roles without modifying EmDash core user tables.",
		permissionSlug: "sikesra.rbac.manage",
		requiresAudit: true,
	},
	{
		id: "assign-region-scope",
		label: "Assign region scope",
		description: "Choose all, province, regency, district, village, or custom region scope.",
		permissionSlug: "sikesra.rbac.manage",
		requiresAudit: true,
	},
	{
		id: "assign-organization-scope",
		label: "Assign organization scope",
		description:
			"Choose SOPD, LKS, lembaga, pendidikan, or other organization scope where required.",
		permissionSlug: "sikesra.rbac.manage",
		requiresAudit: true,
	},
	{
		id: "preview",
		label: "Preview effective access",
		description:
			"Show effective permissions, ABAC decision, inactive/orphaned status, and denial reasons.",
		permissionSlug: "sikesra.rbac.manage",
	},
];

export const SIKESRA_CUSTOM_ATTRIBUTE_BUILDER_SECTIONS: SikesraWorkflowStepDefinition[] = [
	{
		id: "scope",
		label: "Choose scope",
		description:
			"Set global, data type, subtype, entity, SIKESRA ID, region, organization, or program scope.",
	},
	{
		id: "field",
		label: "Configure field",
		description: "Set key, label, data type, validation, placeholder, help text, and sort order.",
	},
	{
		id: "privacy",
		label: "Configure privacy",
		description: "Set data class, masking, public-safe, importable, and exportable flags.",
		privacyCheck: true,
	},
	{
		id: "preview",
		label: "Preview form impact",
		description: "Preview how the attribute appears in registry forms and import/export mappings.",
	},
	{
		id: "save",
		label: "Save with audit",
		description: "Save only after protected-key, privacy, and impact checks pass.",
		permissionSlug: "sikesra.custom_attribute.create",
		requiresAudit: true,
	},
];

export const SIKESRA_GOVERNANCE_REVIEW_STEPS: SikesraWorkflowStepDefinition[] = [
	{
		id: "request",
		label: "Create request",
		description: "Capture target, affected records, reason, and confirmation phrase.",
		permissionSlug: "sikesra.permanent_delete.request",
		requiresReason: true,
		requiresAudit: true,
	},
	{
		id: "snapshot",
		label: "Review snapshot",
		description: "Show redacted record snapshot and protected references before approval.",
		privacyCheck: true,
	},
	{
		id: "approve",
		label: "Approve or reject",
		description: "Highest-admin reviewer records a decision with notes.",
		permissionSlug: "sikesra.permanent_delete.approve",
		requiresReason: true,
		requiresAudit: true,
	},
	{
		id: "execute",
		label: "Execute final action",
		description: "Execute only approved requests after confirmation and integrity checks.",
		permissionSlug: "sikesra.permanent_delete.execute",
		requiresReason: true,
		requiresAudit: true,
	},
];

export const SIKESRA_ACCESSIBILITY_CHECKLIST = [
	"Keyboard navigation works for tables, steppers, dialogs, drawers, and menus.",
	"Every form control has a visible or programmatic label.",
	"Error text is connected to the field it describes.",
	"Icon-only actions have ARIA labels.",
	"Status is communicated with text, not color alone.",
	"Light and dark mode contrast remains readable.",
] as const;

export interface SikesraPagePatternContract {
	path: (typeof SIKESRA_REQUIRED_ADMIN_PAGE_PATHS)[number];
	title: string;
	purpose: string;
	primaryPermissionSlug?: string;
	anatomy: readonly (typeof SIKESRA_PAGE_ANATOMY)[number][];
	emptyState: (typeof SIKESRA_STANDARD_EMPTY_STATES)[number];
	workflowModel?:
		| "overview"
		| "registry-wizard"
		| "import"
		| "verification"
		| "access"
		| "abac"
		| "custom-attributes"
		| "governance";
	requiresPrivacyIndicators?: boolean;
	requiresReasonFlow?: boolean;
}

const DEFAULT_PAGE_ANATOMY = [...SIKESRA_PAGE_ANATOMY] as const;

export const SIKESRA_PAGE_PATTERN_CONTRACTS: SikesraPagePatternContract[] = [
	{
		path: "/overview",
		title: "Overview",
		purpose:
			"Show readiness, KPIs, workflow shortcuts, module cards, and public aggregate preview.",
		primaryPermissionSlug: "sikesra.dashboard.read",
		anatomy: DEFAULT_PAGE_ANATOMY,
		emptyState: "No records yet",
		workflowModel: "overview",
	},
	{
		path: "/registry",
		title: "Registry",
		purpose: "List and filter all eight SIKESRA modules with masked sensitive columns.",
		primaryPermissionSlug: "sikesra.registry.read",
		anatomy: DEFAULT_PAGE_ANATOMY,
		emptyState: "No records yet",
		requiresPrivacyIndicators: true,
	},
	{
		path: "/registry/new",
		title: "Create Registry Record",
		purpose:
			"Guide operators through module, region, identity, details, documents, and review steps.",
		primaryPermissionSlug: "sikesra.registry.create",
		anatomy: DEFAULT_PAGE_ANATOMY,
		emptyState: "No records yet",
		workflowModel: "registry-wizard",
		requiresPrivacyIndicators: true,
	},
	{
		path: "/registry/:id",
		title: "Registry Detail",
		purpose:
			"Show record detail, masked sensitive values, documents, verification state, and audit trail.",
		primaryPermissionSlug: "sikesra.registry.read",
		anatomy: DEFAULT_PAGE_ANATOMY,
		emptyState: "No records yet",
		requiresPrivacyIndicators: true,
	},
	{
		path: "/documents",
		title: "Documents",
		purpose: "Manage document metadata, classification, validation status, and controlled access.",
		primaryPermissionSlug: "sikesra.document.read",
		anatomy: DEFAULT_PAGE_ANATOMY,
		emptyState: "No documents uploaded",
		requiresPrivacyIndicators: true,
	},
	{
		path: "/import",
		title: "Import",
		purpose:
			"Run staged upload, preview, mapping, validation, duplicate review, promotion, and summary.",
		primaryPermissionSlug: "sikesra.import.create",
		anatomy: DEFAULT_PAGE_ANATOMY,
		emptyState: "No import batch",
		workflowModel: "import",
		requiresReasonFlow: true,
	},
	{
		path: "/verification",
		title: "Verification",
		purpose: "Review queue items by level, scope, module, pending age, and document completeness.",
		primaryPermissionSlug: "sikesra.verification.read",
		anatomy: DEFAULT_PAGE_ANATOMY,
		emptyState: "No pending verification",
		workflowModel: "verification",
		requiresReasonFlow: true,
	},
	{
		path: "/reports",
		title: "Reports",
		purpose: "Create reports and exports with public-safe defaults and restricted export friction.",
		primaryPermissionSlug: "sikesra.report.read",
		anatomy: DEFAULT_PAGE_ANATOMY,
		emptyState: "No records yet",
		requiresPrivacyIndicators: true,
		requiresReasonFlow: true,
	},
	{
		path: "/audit",
		title: "Audit",
		purpose: "Review redacted audit events, sensitive access events, and lifecycle timelines.",
		primaryPermissionSlug: "sikesra.audit.read",
		anatomy: DEFAULT_PAGE_ANATOMY,
		emptyState: "No audit event",
		requiresPrivacyIndicators: true,
	},
	{
		path: "/access/users",
		title: "Access Users",
		purpose: "Assign SIKESRA roles and scopes to trusted EmDash user references.",
		primaryPermissionSlug: "sikesra.rbac.manage",
		anatomy: DEFAULT_PAGE_ANATOMY,
		emptyState: "No user assignment",
		workflowModel: "access",
	},
	{
		path: "/access/roles",
		title: "Access Roles",
		purpose: "Manage SIKESRA role catalog and user assignments.",
		primaryPermissionSlug: "sikesra.rbac.manage",
		anatomy: DEFAULT_PAGE_ANATOMY,
		emptyState: "No user assignment",
		workflowModel: "access",
	},
	{
		path: "/access/permissions",
		title: "Access Permissions",
		purpose: "Review permission catalog and permission scope grouping.",
		primaryPermissionSlug: "sikesra.rbac.manage",
		anatomy: DEFAULT_PAGE_ANATOMY,
		emptyState: "No user assignment",
		workflowModel: "access",
	},
	{
		path: "/access/matrix",
		title: "Access Matrix",
		purpose: "Map roles to permissions and identify missing assignments.",
		primaryPermissionSlug: "sikesra.rbac.manage",
		anatomy: DEFAULT_PAGE_ANATOMY,
		emptyState: "No user assignment",
		workflowModel: "access",
	},
	{
		path: "/access/scopes",
		title: "Access Scopes",
		purpose: "Assign region and organization scopes for EmDash user references.",
		primaryPermissionSlug: "sikesra.rbac.manage",
		anatomy: DEFAULT_PAGE_ANATOMY,
		emptyState: "No user assignment",
		workflowModel: "access",
	},
	{
		path: "/access/preview",
		title: "Access Preview",
		purpose: "Preview effective permissions and denial reasons for a user reference.",
		primaryPermissionSlug: "sikesra.rbac.manage",
		anatomy: DEFAULT_PAGE_ANATOMY,
		emptyState: "No user assignment",
		workflowModel: "access",
	},
	{
		path: "/abac/attributes",
		title: "ABAC Attributes",
		purpose: "Manage subject, resource, and context attributes for policy decisions.",
		primaryPermissionSlug: "sikesra.abac.manage",
		anatomy: DEFAULT_PAGE_ANATOMY,
		emptyState: "No ABAC policy",
		workflowModel: "abac",
	},
	{
		path: "/abac/policies",
		title: "ABAC Policies",
		purpose: "Manage explicit allow and deny policies with safe previews.",
		primaryPermissionSlug: "sikesra.abac.manage",
		anatomy: DEFAULT_PAGE_ANATOMY,
		emptyState: "No ABAC policy",
		workflowModel: "abac",
	},
	{
		path: "/abac/preview",
		title: "ABAC Preview",
		purpose: "Simulate ABAC decisions for user, resource, action, and context attributes.",
		primaryPermissionSlug: "sikesra.abac.manage",
		anatomy: DEFAULT_PAGE_ANATOMY,
		emptyState: "No ABAC policy",
		workflowModel: "abac",
	},
	{
		path: "/regions",
		title: "Regions",
		purpose: "Manage official and local region trees used by registry and access scopes.",
		primaryPermissionSlug: "sikesra.region.read",
		anatomy: DEFAULT_PAGE_ANATOMY,
		emptyState: "No records yet",
	},
	{
		path: "/data-types",
		title: "Data Types",
		purpose: "Manage SIKESRA module and subtype catalogs.",
		primaryPermissionSlug: "sikesra.data_type.read",
		anatomy: DEFAULT_PAGE_ANATOMY,
		emptyState: "No records yet",
	},
	{
		path: "/field-standards",
		title: "Field Standards",
		purpose:
			"Review field definitions, data classes, storage tables, masking, import, and export rules.",
		primaryPermissionSlug: "sikesra.field_standard.read",
		anatomy: DEFAULT_PAGE_ANATOMY,
		emptyState: "No records yet",
		requiresPrivacyIndicators: true,
	},
	{
		path: "/custom-attributes/definitions",
		title: "Custom Attribute Definitions",
		purpose: "Create controlled custom fields with scope, validation, privacy, and impact preview.",
		primaryPermissionSlug: "sikesra.custom_attribute.read",
		anatomy: DEFAULT_PAGE_ANATOMY,
		emptyState: "No records yet",
		workflowModel: "custom-attributes",
		requiresPrivacyIndicators: true,
	},
	{
		path: "/custom-attributes/values",
		title: "Custom Attribute Values",
		purpose: "Review custom values with masking, sensitivity, and current-value indicators.",
		primaryPermissionSlug: "sikesra.custom_attribute.read",
		anatomy: DEFAULT_PAGE_ANATOMY,
		emptyState: "No records yet",
		workflowModel: "custom-attributes",
		requiresPrivacyIndicators: true,
	},
	{
		path: "/delete-requests",
		title: "Delete Requests",
		purpose:
			"Review highest-admin permanent-delete requests, snapshots, approvals, and execution status.",
		primaryPermissionSlug: "sikesra.permanent_delete.review",
		anatomy: DEFAULT_PAGE_ANATOMY,
		emptyState: "No records yet",
		workflowModel: "governance",
		requiresReasonFlow: true,
	},
	{
		path: "/archives",
		title: "Archives",
		purpose: "Review archived records and restore actions with reason-aware audit outcomes.",
		primaryPermissionSlug: "sikesra.lifecycle.archive",
		anatomy: DEFAULT_PAGE_ANATOMY,
		emptyState: "No records yet",
		workflowModel: "governance",
		requiresReasonFlow: true,
	},
	{
		path: "/settings",
		title: "Settings",
		purpose:
			"Manage public status, safety thresholds, governance mode, and metadata configuration.",
		primaryPermissionSlug: "sikesra.settings.read",
		anatomy: DEFAULT_PAGE_ANATOMY,
		emptyState: "No records yet",
	},
];

export const SIKESRA_REQUIRED_ADMIN_PAGE_PATHS = [
	"/overview",
	"/registry",
	"/registry/new",
	"/registry/:id",
	"/documents",
	"/import",
	"/verification",
	"/reports",
	"/audit",
	"/access/users",
	"/access/roles",
	"/access/permissions",
	"/access/matrix",
	"/access/scopes",
	"/access/preview",
	"/abac/attributes",
	"/abac/policies",
	"/abac/preview",
	"/regions",
	"/data-types",
	"/field-standards",
	"/custom-attributes/definitions",
	"/custom-attributes/values",
	"/delete-requests",
	"/archives",
	"/settings",
] as const;

export const SIKESRA_REQUIRED_ADMIN_COMPONENTS = [
	"SikesraPageHeader",
	"SikesraStatusBanner",
	"SikesraMetricCard",
	"SikesraModuleCard",
	"SikesraFilterBar",
	"SikesraDataTable",
	"SikesraDetailDrawer",
	"SikesraStepper",
	"SikesraFieldGroup",
	"SikesraSensitiveField",
	"SikesraMaskedValue",
	"SikesraRevealButton",
	"SikesraStatusBadge",
	"SikesraScopeBadge",
	"SikesraAuditTimeline",
	"SikesraEmptyState",
	"SikesraErrorState",
	"SikesraConfirmDialog",
	"SikesraReasonInput",
	"SikesraAccessPreviewPanel",
	"SikesraAbacDecisionPanel",
] as const;

export type SikesraStatusTone =
	| "neutral"
	| "info"
	| "success"
	| "warning"
	| "danger"
	| "restricted";

export const SIKESRA_STATUS_BADGE_TONES: Record<
	(typeof SIKESRA_STATUS_BADGES)[number],
	SikesraStatusTone
> = {
	Draft: "neutral",
	"Needs Review": "warning",
	"Pending Desa": "info",
	"Pending Kecamatan": "info",
	"Pending SOPD": "info",
	"Pending Kabupaten": "info",
	Verified: "success",
	Rejected: "danger",
	"Needs Revision": "warning",
	Archived: "neutral",
	Suppressed: "warning",
	"Public Safe": "success",
	Sensitive: "danger",
	Restricted: "restricted",
	"Orphaned User": "warning",
};

export function getSikesraStatusTone(label: string): SikesraStatusTone {
	return SIKESRA_STATUS_BADGE_TONES[label as (typeof SIKESRA_STATUS_BADGES)[number]] ?? "neutral";
}

export interface SikesraMaskedValueState {
	displayValue: string;
	masked: boolean;
	revealAllowed: boolean;
	reason: string;
}

export function createSikesraMaskedValueState(
	value: unknown,
	options: { sensitive?: boolean; revealAllowed?: boolean; maskLabel?: string } = {},
): SikesraMaskedValueState {
	const sensitive = options.sensitive === true;
	const revealAllowed = options.revealAllowed === true;
	if (sensitive && !revealAllowed) {
		return {
			displayValue: options.maskLabel ?? "[REDACTED]",
			masked: true,
			revealAllowed: false,
			reason: "Sensitive value is masked until reveal permission is granted.",
		};
	}
	return {
		displayValue:
			value == null
				? ""
				: typeof value === "string" || typeof value === "number" || typeof value === "boolean"
					? String(value)
					: JSON.stringify(value),
		masked: false,
		revealAllowed,
		reason: sensitive ? "Reveal permission granted." : "Value is public-safe for this surface.",
	};
}

export interface SikesraEmptyStateModel {
	title: string;
	description: string;
	recommendedAction?: string;
	permissionRequired?: string;
}

export function createSikesraEmptyState(
	title: (typeof SIKESRA_STANDARD_EMPTY_STATES)[number],
	description: string,
	options: Pick<SikesraEmptyStateModel, "recommendedAction" | "permissionRequired"> = {},
): SikesraEmptyStateModel {
	return { title, description, ...options };
}

export type SikesraPageState = "loading" | "empty" | "ready" | "permission_denied" | "error";

export function getSikesraPageState(input: {
	loading?: boolean;
	error?: unknown;
	permissionDenied?: boolean;
	itemCount?: number;
}): SikesraPageState {
	if (input.loading) return "loading";
	if (input.permissionDenied) return "permission_denied";
	if (input.error) return "error";
	if ((input.itemCount ?? 0) === 0) return "empty";
	return "ready";
}

export type SikesraCrudActionKind =
	| "create"
	| "edit"
	| "soft_delete"
	| "restore"
	| "archive"
	| "permanent_delete";

export interface SikesraCrudActionDefinition {
	kind: SikesraCrudActionKind;
	label: string;
	permissionSlug: string;
	requiresReason: boolean;
	requiresConfirmation: boolean;
	destructive: boolean;
	hiddenByDefault: boolean;
}

export const SIKESRA_CRUD_ACTIONS: SikesraCrudActionDefinition[] = [
	{
		kind: "create",
		label: "Create",
		permissionSlug: "sikesra.registry.create",
		requiresReason: false,
		requiresConfirmation: false,
		destructive: false,
		hiddenByDefault: false,
	},
	{
		kind: "edit",
		label: "Edit",
		permissionSlug: "sikesra.registry.update",
		requiresReason: false,
		requiresConfirmation: false,
		destructive: false,
		hiddenByDefault: false,
	},
	{
		kind: "soft_delete",
		label: "Soft delete",
		permissionSlug: "sikesra.registry.soft_delete",
		requiresReason: true,
		requiresConfirmation: false,
		destructive: true,
		hiddenByDefault: false,
	},
	{
		kind: "restore",
		label: "Restore",
		permissionSlug: "sikesra.registry.restore",
		requiresReason: true,
		requiresConfirmation: false,
		destructive: false,
		hiddenByDefault: false,
	},
	{
		kind: "archive",
		label: "Archive",
		permissionSlug: "sikesra.lifecycle.archive",
		requiresReason: true,
		requiresConfirmation: false,
		destructive: true,
		hiddenByDefault: false,
	},
	{
		kind: "permanent_delete",
		label: "Permanent delete",
		permissionSlug: "sikesra.permanent_delete.execute",
		requiresReason: true,
		requiresConfirmation: true,
		destructive: true,
		hiddenByDefault: true,
	},
];

export function getSikesraCrudActionState(input: {
	action: SikesraCrudActionKind;
	permissions: readonly string[];
	abacAllowed?: boolean;
	archived?: boolean;
	superAdmin?: boolean;
}) {
	const definition = SIKESRA_CRUD_ACTIONS.find((action) => action.kind === input.action);
	if (!definition) return { visible: false, enabled: false, reason: "Unknown action." };
	if (definition.kind === "restore" && !input.archived) {
		return {
			visible: false,
			enabled: false,
			reason: "Restore is shown only for archived records.",
		};
	}
	if (definition.kind === "permanent_delete" && !input.superAdmin) {
		return {
			visible: false,
			enabled: false,
			reason: "Permanent delete is hidden unless highest-admin workflow is active.",
		};
	}
	if (!input.permissions.includes(definition.permissionSlug)) {
		return {
			visible: !definition.hiddenByDefault,
			enabled: false,
			reason: `Missing permission ${definition.permissionSlug}.`,
		};
	}
	if (input.abacAllowed === false) {
		return { visible: true, enabled: false, reason: "ABAC scope does not allow this action." };
	}
	return { visible: true, enabled: true, reason: "Action allowed." };
}
