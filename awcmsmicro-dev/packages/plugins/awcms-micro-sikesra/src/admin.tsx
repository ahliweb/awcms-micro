import { Badge, Button, Input, InputArea, LinkButton, Select } from "@cloudflare/kumo";
import { useLingui } from "@lingui/react";
import type { PluginAdminExports } from "emdash";
import { apiFetch } from "emdash/plugin-utils";
import * as React from "react";

import { getExampleAdminCopy } from "./admin-copy.js";
import {
	postSikesraPlugin,
	advanceVerification,
	approvePermanentDelete,
	createImportBatch,
	decideDuplicate,
	executePermanentDelete,
	previewAbac,
	previewAccess,
	promoteImportRows,
	requestPermanentDelete,
	restoreRegistry,
	runAbacEnforceDemo,
	saveAccessMatrix,
	saveAbacAttribute,
	saveAbacPolicy,
	saveAbacResource,
	saveAbacSubject,
	savePermission as saveAccessPermission,
	saveRole as saveAccessRole,
	saveScope as saveAccessScope,
	saveUserRoles,
	saveDocument,
	saveDataTypes,
	saveRegions,
	saveRegistry as saveRegistryEntity,
	rejectVerification,
	saveSettings as saveSikesraSettings,
	saveCustomAttributeDefinition,
	saveCustomAttributeValue,
	type SikesraAdminApiPath,
} from "./admin/api/index.js";
import {
	SIKESRA_CUSTOM_ATTRIBUTE_BUILDER_SECTIONS,
	SIKESRA_IMPORT_WORKFLOW_STEPS,
	SIKESRA_ADMIN_ROUTE_BASE,
	SIKESRA_PAGE_PATTERN_CONTRACTS,
	toSikesraAdminHref,
	type SikesraPagePatternContract,
} from "./admin/ui-standards.js";
import type {
	SikesraCustomAttributeDefinitionDto,
	SikesraCustomAttributeDefinitionRequest,
	SikesraCustomAttributeValueRequest,
	SikesraImportCreateRequest,
	SikesraImportPromotionRequest,
} from "./contracts/index.js";
import {
	SIKESRA_FIELD_STANDARDS,
	SIKESRA_MODULE_FIELD_VALIDATION_SCHEMAS,
} from "./field-standards.js";
import {
	SIKESRA_REFERENCE_FIXTURES,
	maskSensitive,
	maskSensitiveBySensitivity,
	type SikesraReferenceRegistryEntity,
	type SikesraSensitivity,
	type SikesraReferenceSupportingDocument,
	type SikesraUserLevel,
} from "./fixtures.js";
import { normalizeAdminNav, PluginLocalNav } from "./navigation.js";
import {
	AWCMS_SIKESRA_MANIFEST,
	DEFAULT_DATA_TYPES,
	type SikesraParentType,
} from "./runtime.js";

interface AdministrativeRegion {
	code: string;
	name: string;
}

interface AdministrativeDistrict extends AdministrativeRegion {
	villages: AdministrativeRegion[];
}

interface AdministrativeRegency extends AdministrativeRegion {
	districts: AdministrativeDistrict[];
}

interface AdministrativeProvince extends AdministrativeRegion {
	regencies: AdministrativeRegency[];
}

type JsonMap = Record<string, string>;
type GovernanceMode = "observe" | "review" | "enforce-demo";
type AbacTargetType = "subject" | "resource" | "context";
type AbacEffect = "allow" | "deny";

interface SikesraSettingsState {
	publicStatusLabel: string;
	auditRetentionDays: number;
	governanceMode: string;
	metadataCanonicalBase: string;
	smallCellThreshold: number;
	sikesraPublicEnabled: boolean;
}

interface DashboardModuleCard {
	id: string;
	title: string;
	description: string;
	href: string;
	status: string;
	badge?: string | number;
}

interface PluginHeaderMenuItem {
	id: string;
	label: string;
	href: string;
	permission?: string;
	children?: PluginHeaderMenuItem[];
}

interface SummaryResponse {
	settings: SikesraSettingsState;
	counters: {
		auditCount: number;
		lifecycleCount: number;
		publicHits: number;
	};
	lastCronAt: string | null;
	lastLifecycle: string | null;
	recentEvents: Array<{
		id: string;
		timestamp: string;
		kind: string;
		summary: string;
		actor: string;
		userId?: string;
		userName?: string;
	}>;
}

const DEFAULT_SUMMARY_SETTINGS: SikesraSettingsState = {
	publicStatusLabel: "healthy",
	auditRetentionDays: 30,
	governanceMode: "review",
	metadataCanonicalBase: "",
	smallCellThreshold: 3,
	sikesraPublicEnabled: true,
};

function isObjectRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function numberOrDefault(value: unknown, fallback: number): number {
	return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function normalizeSummaryResponse(value: unknown): SummaryResponse | null {
	if (!isObjectRecord(value)) return null;

	const rawSettings: Record<string, unknown> = isObjectRecord(value.settings) ? value.settings : {};
	const rawCounters: Record<string, unknown> = isObjectRecord(value.counters) ? value.counters : {};

	return {
		...value,
		settings: {
			publicStatusLabel:
				typeof rawSettings.publicStatusLabel === "string"
					? rawSettings.publicStatusLabel
					: DEFAULT_SUMMARY_SETTINGS.publicStatusLabel,
			auditRetentionDays: numberOrDefault(
				rawSettings.auditRetentionDays,
				DEFAULT_SUMMARY_SETTINGS.auditRetentionDays,
			),
			governanceMode:
				typeof rawSettings.governanceMode === "string"
					? rawSettings.governanceMode
					: DEFAULT_SUMMARY_SETTINGS.governanceMode,
			metadataCanonicalBase:
				typeof rawSettings.metadataCanonicalBase === "string"
					? rawSettings.metadataCanonicalBase
					: DEFAULT_SUMMARY_SETTINGS.metadataCanonicalBase,
			smallCellThreshold: numberOrDefault(
				rawSettings.smallCellThreshold,
				DEFAULT_SUMMARY_SETTINGS.smallCellThreshold,
			),
			sikesraPublicEnabled:
				typeof rawSettings.sikesraPublicEnabled === "boolean"
					? rawSettings.sikesraPublicEnabled
					: DEFAULT_SUMMARY_SETTINGS.sikesraPublicEnabled,
		},
		counters: {
			auditCount: numberOrDefault(rawCounters.auditCount, 0),
			lifecycleCount: numberOrDefault(rawCounters.lifecycleCount, 0),
			publicHits: numberOrDefault(rawCounters.publicHits, 0),
		},
		lastCronAt: typeof value.lastCronAt === "string" ? value.lastCronAt : null,
		lastLifecycle: typeof value.lastLifecycle === "string" ? value.lastLifecycle : null,
		recentEvents: Array.isArray(value.recentEvents) ? value.recentEvents : [],
	};
}

interface AuditListResponse {
	items: Array<{
		id: string;
		timestamp: string;
		kind: string;
		scope: string;
		actor: string;
		summary: string;
		userId?: string;
		userName?: string;
	}>;
}

interface VerificationItem {
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
	verificationStage: string;
	inputLevel: string;
	currentLevel: string;
	nextStage: string | null;
	nextLevel: string | null;
	canAdvance: boolean;
	supportingDocumentIds: string[];
	publicSummary: string;
}

interface VerificationResponse {
	items: VerificationItem[];
	events: Array<{
		id: string;
		registryEntityId: string;
		stage: string;
		actor: string;
		inputLevel?: string;
		verifierLevel?: string;
		verifierRegionScope?: string;
		verifierOrgScope?: string;
		result: "approved" | "needs_review" | "rejected";
		notes: string;
		createdAt: string;
	}>;
	currentVerifierLevels: string[];
}

interface VerificationAdvanceResponse {
	success: boolean;
	item: VerificationItem;
	items: VerificationItem[];
	event: {
		id: string;
		timestamp: string;
		kind: string;
		scope: string;
		actor: string;
		summary: string;
		metadata: JsonMap;
	};
}

interface ImportRouteResult {
	success: boolean;
	batchId?: string;
	error?: { message?: string };
}

interface AccessPermissionItem {
	slug: string;
	label: string;
	description: string;
	scope: string;
	updatedAt: string;
}

interface AccessRoleItem {
	slug: string;
	label: string;
	description: string;
	updatedAt: string;
}

interface UserRoleAssignmentItem {
	userId: string;
	roles: string[];
	isActive: boolean;
	updatedAt: string;
}

interface UserScopeAssignmentItem {
	userId: string;
	regionScopeType: string;
	regionScopeCode: string;
	organizationScopeType: string;
	organizationScopeCode: string;
	isActive: boolean;
	validFrom: string;
	validUntil: string;
	updatedAt: string;
}

interface RolePermissionAssignmentItem {
	roleSlug: string;
	permissions: string[];
	updatedAt: string;
}

interface AccessPermissionsResponse {
	items: AccessPermissionItem[];
}

interface AccessRolesResponse {
	roles: AccessRoleItem[];
	userAssignments: UserRoleAssignmentItem[];
	scopeAssignments?: UserScopeAssignmentItem[];
}

interface EmDashUserReferenceItem {
	id: string;
	email: string;
	name: string | null;
	role: number;
	createdAt: string;
}

interface EmDashUsersResponse {
	items: EmDashUserReferenceItem[];
	nextCursor?: string;
}

interface AccessScopesResponse {
	items: UserScopeAssignmentItem[];
}

interface AccessMatrixResponse {
	permissions: AccessPermissionItem[];
	roles: AccessRoleItem[];
	assignments: RolePermissionAssignmentItem[];
}

interface AccessPreviewResponse {
	allowed: boolean;
	reason: string;
	matchedRoles: string[];
	effectivePermissions: string[];
}

interface AccessHealthResponse {
	permissionCount: number;
	roleCount: number;
	assignmentCount: number;
	userAssignmentCount: number;
	scopeAssignmentCount?: number;
	rolesWithoutPermissions: string[];
	usersWithoutRoles: string[];
}

export function normalizeAccessHealthResponse(data: AccessHealthResponse): AccessHealthResponse {
	return {
		...data,
		rolesWithoutPermissions: Array.isArray(data.rolesWithoutPermissions)
			? data.rolesWithoutPermissions
			: [],
		usersWithoutRoles: Array.isArray(data.usersWithoutRoles) ? data.usersWithoutRoles : [],
	};
}

interface AbacAttributeItem {
	key: string;
	label: string;
	targetType: AbacTargetType;
	description: string;
	updatedAt: string;
}

interface AbacAssignmentItem {
	subjectId?: string;
	resourceId?: string;
	attributes: JsonMap;
	updatedAt: string;
}

interface AbacPolicyItem {
	id: string;
	label: string;
	effect: AbacEffect;
	actions: string[];
	requiredSubject: JsonMap;
	requiredResource: JsonMap;
	requiredContext: JsonMap;
	updatedAt: string;
}

interface AbacAttributesResponse {
	items: AbacAttributeItem[];
}

interface AbacAssignmentsResponse {
	items: AbacAssignmentItem[];
}

interface AbacPoliciesResponse {
	items: AbacPolicyItem[];
}

interface AbacPreviewResponse {
	allowed: boolean;
	reason: string;
	matchedPolicyIds: string[];
	effect: AbacEffect;
	missingAttributes: string[];
}

interface AbacHealthResponse {
	attributeCount: number;
	policyCount: number;
	subjectCount: number;
	resourceCount: number;
	explicitDenyCount: number;
}

interface CustomAttributeDefinitionItem extends SikesraCustomAttributeDefinitionDto {
	isActive?: boolean;
	isImportable?: boolean;
	isExportable?: boolean;
}

interface CustomAttributeValueItem {
	id: string;
	definitionId: string;
	registryEntityId?: string;
	sikesraId20?: string;
	valueDisplay: string;
	sensitivity: string;
	masked: boolean;
}

interface CustomAttributeDefinitionsResponse {
	items: CustomAttributeDefinitionItem[];
}

interface CustomAttributeValuesResponse {
	items: CustomAttributeValueItem[];
}

interface ArchivedRegistryEntity extends SikesraReferenceRegistryEntity {
	deletedAt?: string;
}

interface RegistryArchiveResponse {
	items: ArchivedRegistryEntity[];
}

type RegistryCustomAttributeContext = {
	entityType?: string;
	subtypeCode?: string;
	registryEntityId?: string;
	sikesraId20?: string;
	region?: Partial<SikesraReferenceRegistryEntity["region"]>;
};

function customAttributeAppliesToRegistry(
	definition: CustomAttributeDefinitionItem,
	context: RegistryCustomAttributeContext,
) {
	if (definition.isActive === false) return false;
	if (definition.scope === "global") return true;
	if (definition.scope === "entity_type")
		return !definition.entityType || definition.entityType === context.entityType;
	if (definition.scope === "subtype")
		return !definition.subtypeCode || definition.subtypeCode === context.subtypeCode;
	if (definition.scope === "registry_entity")
		return definition.targetRegistryEntityId === context.registryEntityId;
	if (definition.scope === "sikesra_id_20")
		return definition.targetSikesraId20 === context.sikesraId20;
	if (definition.scope === "region_scope") {
		const scopeValue = definition.scopeValue;
		return Boolean(
			scopeValue &&
			[
				context.region?.provinceCode,
				context.region?.regencyCode,
				context.region?.districtCode,
				context.region?.villageCode,
			].includes(scopeValue),
		);
	}
	return false;
}

interface PermanentDeleteRequestItem {
	id: string;
	targetTable: string;
	targetRecordId: string;
	targetSikesraId20?: string;
	targetType: string;
	operationType: string;
	reason: string;
	riskLevel: string;
	requestedBy: string;
	requestedAt: string;
	status: string;
}

interface PermanentDeleteRequestsResponse {
	items: PermanentDeleteRequestItem[];
}

interface FieldWidgetProps {
	value: unknown;
	onChange: (value: unknown) => void;
	label: string;
	id: string;
	minimal?: boolean;
	required?: boolean;
}

function getDashboardModuleCards(locale: string | undefined): DashboardModuleCard[] {
	const copy = getExampleAdminCopy(locale);
	const cards = copy.dashboardCards;
	return [
		{
			id: "rumah_ibadah",
			title: cards[0]!.title,
			description: cards[0]!.description,
			status: cards[0]!.status,
			badge: cards[0]!.badge,
			href: toSikesraAdminHref("/registry"),
		},
		{
			id: "lembaga_keagamaan",
			title: cards[1]!.title,
			description: cards[1]!.description,
			status: cards[1]!.status,
			badge: cards[1]!.badge,
			href: toSikesraAdminHref("/registry"),
		},
		{
			id: "pendidikan_keagamaan",
			title: cards[2]!.title,
			description: cards[2]!.description,
			status: cards[2]!.status,
			badge: cards[2]!.badge,
			href: toSikesraAdminHref("/verification"),
		},
		{
			id: "lks",
			title: cards[3]!.title,
			description: cards[3]!.description,
			status: cards[3]!.status,
			badge: cards[3]!.badge,
			href: toSikesraAdminHref("/reports"),
		},
		{
			id: "guru_agama",
			title: cards[4]!.title,
			description: cards[4]!.description,
			status: cards[4]!.status,
			badge: cards[4]!.badge,
			href: toSikesraAdminHref("/access/roles"),
		},
		{
			id: "anak_yatim",
			title: cards[5]!.title,
			description: cards[5]!.description,
			status: cards[5]!.status,
			badge: cards[5]!.badge,
			href: toSikesraAdminHref("/audit"),
		},
		{
			id: "disabilitas",
			title: cards[6]!.title,
			description: cards[6]!.description,
			status: cards[6]!.status,
			badge: cards[6]!.badge,
			href: toSikesraAdminHref("/abac/preview"),
		},
		{
			id: "lansia_terlantar",
			title: cards[7]!.title,
			description: cards[7]!.description,
			status: cards[7]!.status,
			badge: cards[7]!.badge,
			href: toSikesraAdminHref("/documents"),
		},
	];
}

export const AWCMS_SIKESRA_DASHBOARD_MODULE_CARDS = getDashboardModuleCards("en");

export const AWCMS_SIKESRA_PLUGIN_HEADER_MENU: PluginHeaderMenuItem[] = [
	{
		id: "overview",
		label: "Overview",
		href: "/overview",
		permission: "awcms:sikesra:dashboard:read",
	},
	{
		id: "data-entry",
		label: "Data Entry",
		href: "/registry",
		permission: "awcms:sikesra:dashboard:read",
		children: [
			{
				id: "registry",
				label: "Registry",
				href: "/registry",
				permission: "awcms:sikesra:dashboard:read",
			},
			{
				id: "documents",
				label: "Documents",
				href: "/documents",
				permission: "awcms:sikesra:dashboard:read",
			},
		],
	},
	{
		id: "verification",
		label: "Verification",
		href: "/verification",
		permission: "awcms:sikesra:audit:read",
	},
	{
		id: "reports",
		label: "Reports",
		href: "/reports",
		permission: "awcms:sikesra:audit:read",
	},
	{
		id: "settings",
		label: "Settings",
		href: "/access/permissions",
		permission: "awcms:sikesra:settings:read",
		children: [
			{
				id: "permissions",
				label: "Permissions",
				href: "/access/permissions",
				permission: "awcms:sikesra:permissions:read",
			},
			{
				id: "roles",
				label: "Roles",
				href: "/access/roles",
				permission: "awcms:sikesra:roles:read",
			},
			{
				id: "regions",
				label: "Official Regions",
				href: "/regions",
				permission: "awcms:sikesra:settings:read",
			},
		],
	},
];

export function filterPluginHeaderMenu(
	items: PluginHeaderMenuItem[],
	hasPermission: (permission?: string) => boolean,
): PluginHeaderMenuItem[] {
	return items
		.filter((item) => hasPermission(item.permission))
		.map((item) => {
			const children = item.children
				? filterPluginHeaderMenu(item.children, hasPermission)
				: undefined;
			return {
				...item,
				children: children?.length ? children : undefined,
			};
		})
		.filter((item) => item.children?.length || !item.children);
}
function cx(...classes: Array<string | false | null | undefined>) {
	return classes.filter(Boolean).join(" ");
}

function toCsv(items: string[]) {
	return items.join(", ");
}

function fromCsv(value: string) {
	return value
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);
}

function formatDateTime(value: string | null | undefined, locale: string | undefined = "en") {
	if (!value) return getExampleAdminCopy(locale).never;
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleString(locale);
}

function getCurrentAdminLocale() {
	if (typeof document !== "undefined") {
		return document.documentElement.lang || "en";
	}
	return "en";
}

function parseJsonMap(value: string): { ok: true; data: JsonMap } | { ok: false; error: string } {
	const copy = getExampleAdminCopy(getCurrentAdminLocale());
	try {
		const parsed = JSON.parse(value) as unknown;
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
			return { ok: false, error: copy.jsonObjectExampleError };
		}

		const entries = Object.entries(parsed).map(([key, item]) => [key, String(item)] as const);
		return { ok: true, data: Object.fromEntries(entries) };
	} catch {
		return { ok: false, error: copy.invalidJsonError };
	}
}

const TWO_CHAR_CODE_RE = /^[0-9a-zA-Z]{2}$/;
const LOWER_ID_RE = /^[a-z0-9_]+$/;

let cachedUserPromise: Promise<{ id: string; name?: string } | null> | null = null;

async function getCachedUser(): Promise<{ id: string; name?: string } | null> {
	if (cachedUserPromise) return cachedUserPromise;
	cachedUserPromise = (async () => {
		try {
			const meResponse = await apiFetch("/_emdash/api/auth/me");
			if (meResponse.ok) {
				const meData = await meResponse.json();
				if (meData && typeof meData === "object" && "id" in meData) {
					return { id: String(meData.id), name: (meData as { name?: string }).name };
				}
			}
		} catch (err) {
			console.error("Failed to fetch me info", err);
		}
		return null;
	})();
	return cachedUserPromise;
}

async function postPlugin<T>(path: SikesraAdminApiPath, payload: unknown = {}) {
	const copy = getExampleAdminCopy(getCurrentAdminLocale());
	const user = await getCachedUser();
	return postSikesraPlugin<T>({
		path,
		payload,
		user,
		requestFailedMessage: copy.requestFailed,
	});
}

async function createAdminApiRequestOptions() {
	const copy = getExampleAdminCopy(getCurrentAdminLocale());
	const user = await getCachedUser();
	return { user, requestFailedMessage: copy.requestFailed };
}

function usePluginData<T>(path: SikesraAdminApiPath, payload: unknown = {}) {
	const payloadKey = JSON.stringify(payload ?? {});
	const [data, setData] = React.useState<T | null>(null);
	const [error, setError] = React.useState<string | null>(null);
	const [loading, setLoading] = React.useState(true);

	const reload = React.useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			setData(await postPlugin<T>(path, JSON.parse(payloadKey) as unknown));
		} catch (cause) {
			setError(
				cause instanceof Error
					? cause.message
					: getExampleAdminCopy(getCurrentAdminLocale()).requestFailed,
			);
		} finally {
			setLoading(false);
		}
	}, [path, payloadKey]);

	React.useEffect(() => {
		void reload();
	}, [reload]);

	return { data, error, loading, reload };
}

// --- Entity type visual helpers ---

const ENTITY_TYPE_META: Record<string, { icon: string }> = {
	rumah_ibadah: { icon: "🕌" },
	lembaga_keagamaan: { icon: "🏛️" },
	pendidikan_keagamaan: { icon: "📚" },
	lks: { icon: "🤝" },
	guru_agama: { icon: "🎓" },
	anak_yatim: { icon: "🌱" },
	disabilitas: { icon: "♿" },
	lansia_terlantar: { icon: "🏠" },
};

function getEntityIcon(type: string): string {
	return ENTITY_TYPE_META[type]?.icon ?? "📋";
}

// --- Layout ---

function PageShell({
	children,
	width = "wide",
}: {
	children: React.ReactNode;
	width?: "normal" | "wide";
}) {
	return (
		<div
			className={cx("space-y-6 text-kumo-default", width === "wide" ? "max-w-full" : "max-w-4xl")}
		>
			<PluginHeaderMenu />
			{children}
		</div>
	);
}

function PluginHeaderMenu() {
	const currentPath = typeof window === "undefined" ? "" : window.location.pathname;
	const { i18n } = useLingui();
	const locale = i18n.locale;
	const copy = getExampleAdminCopy(locale);

	const normalizedGroups = normalizeAdminNav([AWCMS_SIKESRA_MANIFEST], {
		hasPermission: (permission) => !permission || permission.endsWith(":read"),
	});

	return (
		<PluginLocalNav
			groups={normalizedGroups}
			currentPath={currentPath}
			locale={locale}
			messages={AWCMS_SIKESRA_MANIFEST.i18n?.messages}
			title={copy.navTitle}
			description={copy.navDescription}
		/>
	);
}

function PageHeader({
	eyebrow,
	title,
	description,
	actions,
	icon,
}: {
	eyebrow?: string;
	title: string;
	description: string;
	actions?: React.ReactNode;
	icon?: string;
}) {
	return (
		<div className="overflow-hidden rounded-2xl border border-kumo-line bg-kumo-base text-kumo-default shadow-sm">
			<div className="h-1 bg-gradient-to-r from-kumo-brand/80 via-kumo-brand/50 to-kumo-brand/10" />
			<div
				className="flex flex-col gap-4 p-6 md:flex-row md:items-start md:justify-between"
				style={{ padding: "24px" }}
			>
				<div className="flex items-start gap-4">
					{icon ? (
						<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-kumo-line bg-kumo-tint text-xl shadow-sm">
							{icon}
						</div>
					) : null}
					<div className="space-y-1.5">
						{eyebrow ? (
							<div className="inline-flex items-center rounded-full border border-kumo-line bg-kumo-tint px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-kumo-subtle">
								{eyebrow}
							</div>
						) : null}
						<h1 className="text-2xl font-bold tracking-tight text-kumo-default">{title}</h1>
						<p className="max-w-3xl text-sm leading-6 text-kumo-subtle">{description}</p>
					</div>
				</div>
				{actions ? <div className="flex shrink-0 items-center gap-2 pt-1">{actions}</div> : null}
			</div>
		</div>
	);
}

function Card({
	title,
	description,
	children,
	actions,
	icon,
}: {
	title?: string;
	description?: string;
	children: React.ReactNode;
	actions?: React.ReactNode;
	icon?: string;
}) {
	const hasHeader = !!(title || description || actions);
	return (
		<section className="overflow-hidden rounded-2xl border border-kumo-line bg-kumo-base text-kumo-default shadow-sm">
			{hasHeader ? (
				<div
					className="flex flex-col gap-3 border-b border-kumo-line bg-kumo-tint/40 px-5 py-4 md:flex-row md:items-start md:justify-between"
					style={{ padding: "16px 20px" }}
				>
					<div className="flex items-center gap-3">
						{icon ? (
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-kumo-line bg-kumo-base text-base">
								{icon}
							</div>
						) : null}
						<div>
							{title ? <h2 className="text-sm font-semibold text-kumo-default">{title}</h2> : null}
							{description ? (
								<p className="mt-0.5 text-xs text-kumo-subtle">{description}</p>
							) : null}
						</div>
					</div>
					{actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
				</div>
			) : null}
			<div className="p-5" style={{ padding: "20px" }}>{children}</div>
		</section>
	);
}

function MetricCard({
	label,
	value,
	hint,
	icon,
	accent,
}: {
	label: string;
	value: React.ReactNode;
	hint?: string;
	icon?: string;
	accent?: "blue" | "purple" | "emerald";
}) {
	const accentColors: Record<string, string> = {
		blue: "#3b82f6",
		purple: "#a855f7",
		emerald: "#10b981",
	};
	const borderAccent = accent ? accentColors[accent] : undefined;
	return (
		<div
			className="rounded-2xl border border-kumo-line bg-kumo-base text-kumo-default shadow-sm hover:shadow-md transition-all"
			style={{
				padding: "20px",
				borderTop: borderAccent ? `4px solid ${borderAccent}` : undefined,
			}}
		>
			<div className="flex items-start justify-between gap-2" style={{ marginBottom: "12px" }}>
				<div className="text-xs font-semibold uppercase tracking-wide text-kumo-subtle">{label}</div>
				{icon ? <div className="shrink-0 text-xl opacity-60">{icon}</div> : null}
			</div>
			<div className="text-3xl font-extrabold tracking-tight text-kumo-default">
				{typeof value === "number" ? value.toLocaleString() : value}
			</div>
			{hint ? (
				<div className="text-xs leading-5 text-kumo-subtle" style={{ marginTop: "6px" }}>
					{hint}
				</div>
			) : null}
		</div>
	);
}

function Pill({
	children,
	tone = "neutral",
}: {
	children: React.ReactNode;
	tone?: "neutral" | "success" | "warning" | "danger";
}) {
	const className = cx(
		"inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
		tone === "success" && "bg-kumo-success/10 text-kumo-success",
		tone === "warning" && "bg-kumo-warning/10 text-kumo-warning",
		tone === "danger" && "bg-kumo-danger/10 text-kumo-danger",
		tone === "neutral" && "bg-kumo-tint text-kumo-default",
	);
	return <span className={className}>{children}</span>;
}

function Field({
	label,
	hint,
	children,
}: {
	label: string;
	hint?: string;
	children: React.ReactNode;
}) {
	return (
		<label className="block text-sm text-kumo-default">
			<span className="mb-1 block font-medium text-kumo-default">{label}</span>
			{children}
			{hint ? <span className="mt-1 block text-xs leading-5 text-kumo-subtle">{hint}</span> : null}
		</label>
	);
}

function LoadingState({ label }: { label: string }) {
	return (
		<div className="flex items-center gap-3 rounded-2xl border border-kumo-line bg-kumo-base p-5 text-sm text-kumo-default">
			<span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-kumo-brand border-t-transparent" />
			<span className="text-kumo-subtle">{label}</span>
		</div>
	);
}

function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
	const { i18n } = useLingui();
	const copy = getExampleAdminCopy(i18n.locale);
	return (
		<div className="rounded-2xl border border-kumo-danger/30 bg-kumo-danger/10 p-5 text-kumo-danger">
			<div className="flex items-start gap-3">
				<span className="mt-0.5 shrink-0 text-lg">⚠️</span>
				<div className="min-w-0 flex-1">
					<div className="text-sm font-semibold">{copy.somethingWentWrong}</div>
					<div className="mt-1 break-words text-sm opacity-80">{message}</div>
					{onRetry ? (
						<Button className="mt-3" variant="secondary" size="sm" onClick={onRetry} type="button">
							{copy.retry}
						</Button>
					) : null}
				</div>
			</div>
		</div>
	);
}

function EmptyState({ title, description }: { title: string; description: string }) {
	return (
		<div
			className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-kumo-line bg-kumo-tint/20 text-center"
			style={{
				padding: "40px 24px",
				backgroundColor: "rgba(100, 116, 139, 0.03)",
				borderColor: "var(--kumo-line)",
			}}
		>
			<div className="text-3xl opacity-50" style={{ marginBottom: "12px" }}>📭</div>
			<div className="text-sm font-bold text-kumo-default">{title}</div>
			<div
				className="max-w-sm text-xs leading-relaxed"
				style={{
					marginTop: "6px",
					color: "var(--kumo-subtle, #4b5563)",
				}}
			>
				{description}
			</div>
		</div>
	);
}

type SikesraAdminPagePath = SikesraPagePatternContract["path"];

function getSikesraPageContract(path: SikesraAdminPagePath): SikesraPagePatternContract {
	const contract = SIKESRA_PAGE_PATTERN_CONTRACTS.find((item) => item.path === path);
	if (!contract) {
		throw new Error(`Missing SIKESRA page contract for ${path}`);
	}
	return contract;
}

function _ContractAlignedPage({ path }: { path: SikesraAdminPagePath }) {
	const contract = getSikesraPageContract(path);
	return (
		<PageShell width="wide">
			<PageHeader
				eyebrow="SIKESRA UI/UX standard"
				title={contract.title}
				description={contract.purpose}
			/>
			<div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
				<Card
					title="Page anatomy"
					description="This page follows the canonical SIKESRA admin interaction contract."
				>
					<div className="grid gap-3 sm:grid-cols-2">
						{contract.anatomy.map((item) => (
							<div
								key={item}
								className="rounded-xl border border-kumo-line bg-kumo-tint/30 px-3 py-2 text-sm text-kumo-default"
							>
								{item}
							</div>
						))}
					</div>
				</Card>
				<Card
					title="Workflow safeguards"
					description="Required permissions, privacy, and audit friction."
				>
					<div className="space-y-3 text-sm text-kumo-default">
						<div className="flex items-center justify-between gap-3">
							<span className="text-kumo-subtle">Permission</span>
							<Badge variant="secondary">{contract.primaryPermissionSlug ?? "standard"}</Badge>
						</div>
						<div className="flex items-center justify-between gap-3">
							<span className="text-kumo-subtle">Workflow</span>
							<Badge variant="outline">{contract.workflowModel ?? "standard"}</Badge>
						</div>
						<div className="flex items-center justify-between gap-3">
							<span className="text-kumo-subtle">Privacy indicators</span>
							<Pill tone={contract.requiresPrivacyIndicators ? "warning" : "neutral"}>
								{contract.requiresPrivacyIndicators ? "Required" : "Standard"}
							</Pill>
						</div>
						<div className="flex items-center justify-between gap-3">
							<span className="text-kumo-subtle">Reason flow</span>
							<Pill tone={contract.requiresReasonFlow ? "warning" : "neutral"}>
								{contract.requiresReasonFlow ? "Required" : "Standard"}
							</Pill>
						</div>
						<EmptyState
							title={contract.emptyState}
							description={`Use ${toSikesraAdminHref(path)} for the protected admin route.`}
						/>
					</div>
				</Card>
			</div>
		</PageShell>
	);
}

function RegistryCreatePage() {
	const contract = getSikesraPageContract("/registry/new");
	const { data: customDefinitions } = usePluginData<CustomAttributeDefinitionsResponse>(
		"custom-attributes/definitions/list",
	);
	const [saving, setSaving] = React.useState(false);
	const [notice, setNotice] = React.useState<string | null>(null);
	const [saveError, setSaveError] = React.useState<string | null>(null);
	const [customValues, setCustomValues] = React.useState<Record<string, string>>({});
	const [formState, setFormState] = React.useState({
		label: "",
		code: "",
		entityType: "rumah_ibadah",
		subtypeCode: "",
		provinceCode: "",
		regencyCode: "",
		districtCode: "",
		villageCode: "",
		sensitivity: "public_safe" as SikesraSensitivity,
		publicSummary: "",
	});
	const applicableCustomDefinitions = (customDefinitions?.items ?? []).filter((definition) =>
		customAttributeAppliesToRegistry(definition, {
			entityType: formState.entityType,
			subtypeCode: formState.subtypeCode,
			region: {
				provinceCode: formState.provinceCode,
				regencyCode: formState.regencyCode,
				districtCode: formState.districtCode,
				villageCode: formState.villageCode,
			},
		}),
	);

	const saveRegistry = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSaving(true);
		setNotice(null);
		setSaveError(null);
		try {
			const registryPayload = {
				...formState,
				fields: {
					code: formState.code,
					provinceCode: formState.provinceCode,
					regencyCode: formState.regencyCode,
					districtCode: formState.districtCode,
					villageCode: formState.villageCode,
					publicSummary: formState.publicSummary,
				},
			};
			const result = await saveRegistryEntity<{
				success: boolean;
				item?: SikesraReferenceRegistryEntity;
			}>(registryPayload, await createAdminApiRequestOptions());
			if (result.item) {
				for (const definition of applicableCustomDefinitions) {
					const value = customValues[definition.id]?.trim();
					if (!value) continue;
					await saveCustomAttributeValue(
						{
							definitionId: definition.id,
							ownerType: "registry_entity",
							ownerId: result.item.id,
							registryEntityId: result.item.id,
							sikesraId20: result.item.sikesraId20,
							value,
						},
						await createAdminApiRequestOptions(),
					);
				}
			}
			setNotice(
				`Registry record saved${result.item?.sikesraId20 ? ` with SIKESRA ID ${result.item.sikesraId20}` : ""}.`,
			);
			setFormState((current) => ({
				...current,
				label: "",
				code: "",
				publicSummary: "",
			}));
			setCustomValues({});
		} catch (cause) {
			setSaveError(cause instanceof Error ? cause.message : "Failed to save registry record.");
		} finally {
			setSaving(false);
		}
	};

	return (
		<PageShell width="wide">
			<PageHeader
				eyebrow="SIKESRA registry wizard"
				title={contract.title}
				description={contract.purpose}
			/>
			<Feedback message={notice} />
			<Feedback message={saveError} tone="danger" />
			<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
				<Card
					title="Create registry draft"
					description="Save a draft-style record that enters the SIKESRA verification workflow."
				>
					<form className="space-y-4" onSubmit={(event) => void saveRegistry(event)}>
						<div className="grid gap-4 md:grid-cols-2">
							<Field label="Name / label">
								<Input
									value={formState.label}
									onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
										setFormState((current) => ({ ...current, label: event.target.value }))
									}
									required
								/>
							</Field>
							<Field label="Local code">
								<Input
									value={formState.code}
									onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
										setFormState((current) => ({ ...current, code: event.target.value }))
									}
									required
								/>
							</Field>
						</div>
						<div className="grid gap-4 md:grid-cols-2">
							<Field label="Module">
								<Select
									value={formState.entityType}
									onValueChange={(value) =>
										setFormState((current) => ({ ...current, entityType: value ?? "rumah_ibadah" }))
									}
								>
									{DEFAULT_DATA_TYPES.map((type) => (
										<Select.Option key={type.id} value={type.id}>
											{type.label}
										</Select.Option>
									))}
								</Select>
							</Field>
							<Field label="Subtype code">
								<Input
									value={formState.subtypeCode}
									onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
										setFormState((current) => ({ ...current, subtypeCode: event.target.value }))
									}
								/>
							</Field>
						</div>
						<div className="grid gap-4 md:grid-cols-4">
							{(
								[
									["provinceCode", "Province"],
									["regencyCode", "Regency"],
									["districtCode", "District"],
									["villageCode", "Village"],
								] as Array<
									["provinceCode" | "regencyCode" | "districtCode" | "villageCode", string]
								>
							).map(([key, label]) => (
								<Field key={key} label={label}>
									<Input
										value={formState[key]}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
											setFormState((current) => ({ ...current, [key]: event.target.value }))
										}
									/>
								</Field>
							))}
						</div>
						<Field label="Sensitivity">
							<Select
								value={formState.sensitivity}
								onValueChange={(value) =>
									setFormState((current) => ({
										...current,
										sensitivity: (value as SikesraSensitivity | null) ?? "public_safe",
									}))
								}
							>
								<Select.Option value="public_safe">Public safe</Select.Option>
								<Select.Option value="internal">Internal</Select.Option>
								<Select.Option value="restricted">Restricted</Select.Option>
								<Select.Option value="highly_restricted">Highly restricted</Select.Option>
							</Select>
						</Field>
						<Field
							label="Public summary"
							hint="Public-safe summary only; do not include personal or document metadata."
						>
							<InputArea
								value={formState.publicSummary}
								onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
									setFormState((current) => ({ ...current, publicSummary: event.target.value }))
								}
							/>
						</Field>
						{applicableCustomDefinitions.length > 0 ? (
							<div className="rounded-2xl border border-kumo-line bg-kumo-tint/20 p-4">
								<div className="text-sm font-semibold text-kumo-default">
									Applicable custom attributes
								</div>
								<p className="mt-1 text-xs text-kumo-subtle">
									These fields are loaded from active definitions that match the selected module,
									subtype, region, or record scope.
								</p>
								<div className="mt-4 grid gap-4 md:grid-cols-2">
									{applicableCustomDefinitions.map((definition) => (
										<Field
											key={definition.id}
											label={definition.label}
											hint={`${definition.scope} · ${definition.dataType} · ${definition.dataClass}`}
										>
											<Input
												value={customValues[definition.id] ?? ""}
												onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
													setCustomValues((current) => ({
														...current,
														[definition.id]: event.target.value,
													}))
												}
											/>
										</Field>
									))}
								</div>
							</div>
						) : null}
						<Button variant="primary" type="submit" disabled={saving}>
							{saving ? "Saving..." : "Save registry record"}
						</Button>
					</form>
				</Card>
				<Card
					title="Wizard safeguards"
					description="The full registry workflow requires these steps before verification."
				>
					<div className="space-y-3">
						{contract.anatomy.map((item) => (
							<div
								key={item}
								className="rounded-xl border border-kumo-line bg-kumo-tint/30 px-3 py-2 text-sm text-kumo-default"
							>
								{item}
							</div>
						))}
					</div>
				</Card>
			</div>
		</PageShell>
	);
}

function RegistryDetailPage() {
	const contract = getSikesraPageContract("/registry/:id");
	const routeRegistryId = React.useMemo(() => {
		if (typeof window === "undefined") return "";
		const registryDetailPrefix = `${SIKESRA_ADMIN_ROUTE_BASE}/registry/`;
		if (!window.location.pathname.startsWith(registryDetailPrefix)) return "";
		const rawId = window.location.pathname.slice(registryDetailPrefix.length).split("/")[0] ?? "";
		try {
			return decodeURIComponent(rawId);
		} catch {
			return rawId;
		}
	}, []);
	const { data, error, loading, reload } = usePluginData<{
		items: SikesraReferenceRegistryEntity[];
	}>("registry/list");
	const { data: customDefinitions } = usePluginData<CustomAttributeDefinitionsResponse>(
		"custom-attributes/definitions/list",
	);
	const { data: customValues } = usePluginData<CustomAttributeValuesResponse>(
		"custom-attributes/values/list",
	);
	const [selectedId, setSelectedId] = React.useState(routeRegistryId);
	const selected = selectedId ? data?.items.find((item) => item.id === selectedId) : data?.items[0];
	const applicableCustomDefinitions = selected
		? (customDefinitions?.items ?? []).filter((definition) =>
				customAttributeAppliesToRegistry(definition, {
					entityType: selected.entityType,
					registryEntityId: selected.id,
					sikesraId20: selected.sikesraId20,
					region: selected.region,
				}),
			)
		: [];
	const customDefinitionById = new Map(
		applicableCustomDefinitions.map((definition) => [definition.id, definition]),
	);
	const selectedCustomValues = (customValues?.items ?? []).filter(
		(value) =>
			customDefinitionById.has(value.definitionId) &&
			(value.registryEntityId === selected?.id ||
				(selected?.sikesraId20 && value.sikesraId20 === selected.sikesraId20)),
	);

	React.useEffect(() => {
		if (!routeRegistryId && !selectedId && data?.items[0]?.id) setSelectedId(data.items[0].id);
	}, [data?.items, routeRegistryId, selectedId]);

	if (loading) return <LoadingState label="Loading registry detail..." />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;

	return (
		<PageShell width="wide">
			<PageHeader
				eyebrow="SIKESRA registry detail"
				title={contract.title}
				description={contract.purpose}
			/>
			{!data?.items.length || !selected ? (
				<EmptyState
					title={routeRegistryId ? "Registry record not found" : contract.emptyState}
					description={
						routeRegistryId
							? `No registry record matched ${routeRegistryId}. Check the URL or return to the registry queue.`
							: "Create a registry record before reviewing detail state."
					}
				/>
			) : (
				<div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
					<Card
						title="Select record"
						description="Review one registry entity without leaving table context."
					>
						<div className="space-y-2">
							{data.items.map((item) => (
								<button
									key={item.id}
									type="button"
									onClick={() => setSelectedId(item.id)}
									className={cx(
										"w-full rounded-xl border px-3 py-2 text-start text-sm transition",
										selected.id === item.id
											? "border-kumo-brand bg-kumo-tint text-kumo-default"
											: "border-kumo-line bg-kumo-base text-kumo-subtle",
									)}
								>
									<div className="font-semibold">{item.label}</div>
									<div className="mt-1 font-mono text-xs">{item.code || item.id}</div>
								</button>
							))}
						</div>
					</Card>
					<div className="space-y-6">
						<Card
							title={selected.label}
							description="Masked detail, verification state, document links, and audit context."
						>
							<div className="grid gap-4 md:grid-cols-3">
								<MetricCard label="Module" value={selected.entityType} />
								<MetricCard label="Verification" value={selected.verificationStage} />
								<MetricCard label="Documents" value={selected.supportingDocumentIds.length} />
							</div>
							<div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
								<div className="rounded-xl border border-kumo-line bg-kumo-tint/20 p-3">
									<div className="text-xs font-semibold uppercase tracking-wide text-kumo-subtle">
										SIKESRA ID
									</div>
									<div className="mt-1 font-mono text-kumo-default">
										{selected.sikesraId20 ?? "Pending generation"}
									</div>
								</div>
								<div className="rounded-xl border border-kumo-line bg-kumo-tint/20 p-3">
									<div className="text-xs font-semibold uppercase tracking-wide text-kumo-subtle">
										Sensitivity
									</div>
									<div className="mt-1">
										<Pill tone={selected.sensitivity === "public_safe" ? "success" : "warning"}>
											{selected.sensitivity}
										</Pill>
									</div>
								</div>
							</div>
							<div className="mt-5 rounded-xl border border-kumo-line bg-kumo-base p-4">
								<div className="text-xs font-semibold uppercase tracking-wide text-kumo-subtle">
									Public-safe summary
								</div>
								<p className="mt-2 text-sm leading-6 text-kumo-default">
									{selected.publicSummary || "No public-safe summary supplied."}
								</p>
							</div>
						</Card>
						<Card
							title="Region and audit context"
							description="Detail view keeps regional scope visible for RBAC/ABAC review."
						>
							<div className="grid gap-3 text-sm md:grid-cols-4">
								<span>Province: {selected.region.provinceCode || "-"}</span>
								<span>Regency: {selected.region.regencyCode || "-"}</span>
								<span>District: {selected.region.districtCode || "-"}</span>
								<span>Village: {selected.region.villageCode || "-"}</span>
							</div>
						</Card>
						<Card
							title="Applicable custom attributes"
							description="Dynamic fields are filtered by module, record, SIKESRA ID, and region scope."
						>
							{applicableCustomDefinitions.length === 0 ? (
								<EmptyState
									title="No applicable custom attributes"
									description="Create an active definition that matches this registry record to show dynamic fields here."
								/>
							) : (
								<div className="space-y-3">
									{applicableCustomDefinitions.map((definition) => {
										const value = selectedCustomValues.find(
											(item) => item.definitionId === definition.id,
										);
										return (
											<div
												key={definition.id}
												className="rounded-xl border border-kumo-line bg-kumo-base p-4"
											>
												<div className="flex flex-wrap items-start justify-between gap-3">
													<div>
														<div className="font-semibold text-kumo-default">
															{definition.label}
														</div>
														<div className="mt-1 font-mono text-xs text-kumo-subtle">
															{definition.key}
														</div>
													</div>
													<div className="flex flex-wrap gap-2">
														<Badge variant="outline">{definition.scope}</Badge>
														<Pill
															tone={definition.dataClass === "non_personal" ? "success" : "warning"}
														>
															{definition.dataClass}
														</Pill>
														{value ? (
															<Pill tone={value.masked ? "warning" : "success"}>
																{value.masked ? "Masked" : "Visible"}
															</Pill>
														) : null}
													</div>
												</div>
												<div className="mt-3 rounded-lg bg-kumo-tint/30 px-3 py-2 text-sm text-kumo-default">
													{value?.valueDisplay ?? "No value saved for this registry record."}
												</div>
											</div>
										);
									})}
								</div>
							)}
						</Card>
					</div>
				</div>
			)}
		</PageShell>
	);
}

function AccessUsersPage() {
	const contract = getSikesraPageContract("/access/users");
	const { data, error, loading, reload } = usePluginData<AccessRolesResponse>("access/roles/list");
	const { data: usersData } = usePluginData<EmDashUsersResponse>("access/users/list", {
		limit: 100,
	});
	const [userState, setUserState] = React.useState({ userId: "", roles: "", isActive: true });
	const [notice, setNotice] = React.useState<string | null>(null);
	const [saveError, setSaveError] = React.useState<string | null>(null);
	const [saving, setSaving] = React.useState(false);

	const saveUserAssignment = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSaving(true);
		setNotice(null);
		setSaveError(null);
		try {
			await saveUserRoles(
				{
					emdashUserId: userState.userId,
					roles: fromCsv(userState.roles),
					isActive: userState.isActive,
				},
				await createAdminApiRequestOptions(),
			);
			setUserState({ userId: "", roles: "", isActive: true });
			setNotice("EmDash user role assignment saved with SIKESRA audit tracking.");
			await reload();
		} catch (cause) {
			setSaveError(cause instanceof Error ? cause.message : "Failed to save user assignment.");
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <LoadingState label="Loading SIKESRA user assignments..." />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;
	const emdashUsers = usersData?.items ?? [];

	return (
		<PageShell width="wide">
			<PageHeader eyebrow="SIKESRA access" title={contract.title} description={contract.purpose} />
			<Feedback message={notice} />
			<Feedback message={saveError} tone="danger" />
			<div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
				<Card
					title="Assign roles to EmDash user"
					description="Use trusted EmDash user IDs as references; do not duplicate user accounts."
				>
					<form className="space-y-4" onSubmit={(event) => void saveUserAssignment(event)}>
						<Field label="EmDash user ID">
							<Input
								list="sikesra-emdash-users"
								value={userState.userId}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setUserState((current) => ({ ...current, userId: event.target.value }))
								}
								required
							/>
							<datalist id="sikesra-emdash-users">
								{emdashUsers.map((user) => (
									<option key={user.id} value={user.id}>
										{user.name ? `${user.name} <${user.email}>` : user.email}
									</option>
								))}
							</datalist>
						</Field>
						<Field label="Role slugs" hint="Comma-separated SIKESRA role slugs.">
							<Input
								value={userState.roles}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setUserState((current) => ({ ...current, roles: event.target.value }))
								}
								required
							/>
						</Field>
						<label className="flex items-center gap-2 text-sm text-kumo-default">
							<input
								type="checkbox"
								checked={userState.isActive}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setUserState((current) => ({ ...current, isActive: event.target.checked }))
								}
							/>
							Active assignment
						</label>
						<Button variant="primary" type="submit" disabled={saving}>
							{saving ? "Saving..." : "Save assignment"}
						</Button>
					</form>
				</Card>
				<Card
					title="Current user assignments"
					description="Role assignments are SIKESRA-owned references to EmDash users."
				>
					{!data?.userAssignments.length ? (
						<EmptyState
							title={contract.emptyState}
							description="Assign a SIKESRA role to an EmDash user reference."
						/>
					) : (
						<div className="grid gap-3 md:grid-cols-2">
							{data.userAssignments.map((item) => (
								<div
									key={item.userId}
									className="rounded-xl border border-kumo-line bg-kumo-base p-4"
								>
									<div className="font-semibold text-kumo-default">{item.userId}</div>
									<div className="mt-2 flex flex-wrap gap-2">
										{item.roles.map((role) => (
											<Pill key={role}>{role}</Pill>
										))}
									</div>
									<div className="mt-3">
										<Pill tone={item.isActive ? "success" : "warning"}>
											{item.isActive ? "Active" : "Inactive"}
										</Pill>
									</div>
									<div className="mt-3 text-xs text-kumo-subtle">
										Updated {formatDateTime(item.updatedAt, "en")}
									</div>
								</div>
							))}
						</div>
					)}
				</Card>
			</div>
			<Card
				title="EmDash users"
				description="Read-only trusted users exposed by EmDash for assignment reference."
			>
				{emdashUsers.length === 0 ? (
					<EmptyState
						title="No EmDash users available"
						description="The plugin can still save assignments by exact EmDash user ID."
					/>
				) : (
					<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
						{emdashUsers.map((user) => (
							<button
								key={user.id}
								type="button"
								className="rounded-xl border border-kumo-line bg-kumo-base p-4 text-start transition hover:border-kumo-brand"
								onClick={() => setUserState((current) => ({ ...current, userId: user.id }))}
							>
								<div className="font-semibold text-kumo-default">{user.name || user.email}</div>
								<div className="mt-1 text-xs text-kumo-subtle">{user.email}</div>
								<div className="mt-3 font-mono text-xs text-kumo-subtle">{user.id}</div>
							</button>
						))}
					</div>
				)}
			</Card>
			<Card title="Available roles" description="Use these slugs in the user assignment form.">
				<div className="flex flex-wrap gap-2">
					{data?.roles.map((role) => (
						<Badge key={role.slug} variant="outline">
							{role.slug}
						</Badge>
					))}
				</div>
			</Card>
		</PageShell>
	);
}

function AccessScopesPage() {
	const contract = getSikesraPageContract("/access/scopes");
	const { data, error, loading, reload } =
		usePluginData<AccessScopesResponse>("access/scopes/list");
	const [scopeState, setScopeState] = React.useState({
		userId: "",
		regionScopeType: "all",
		regionScopeCode: "",
		organizationScopeType: "all",
		organizationScopeCode: "",
	});
	const [notice, setNotice] = React.useState<string | null>(null);
	const [saveError, setSaveError] = React.useState<string | null>(null);
	const [saving, setSaving] = React.useState(false);

	const saveScope = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSaving(true);
		setNotice(null);
		setSaveError(null);
		try {
			await saveAccessScope(scopeState, await createAdminApiRequestOptions());
			setNotice("User region and organization scopes saved for the EmDash user reference.");
			setScopeState({
				userId: "",
				regionScopeType: "all",
				regionScopeCode: "",
				organizationScopeType: "all",
				organizationScopeCode: "",
			});
			await reload();
		} catch (cause) {
			setSaveError(cause instanceof Error ? cause.message : "Failed to save user scopes.");
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <LoadingState label="Loading SIKESRA access scopes..." />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;

	return (
		<PageShell width="wide">
			<PageHeader eyebrow="SIKESRA access" title={contract.title} description={contract.purpose} />
			<Feedback message={notice} />
			<Feedback message={saveError} tone="danger" />
			<div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
				<Card
					title="Assign user scopes"
					description="Scopes are stored as SIKESRA user-scope assignments for EmDash user references."
				>
					<form className="space-y-4" onSubmit={(event) => void saveScope(event)}>
						<Field label="EmDash user ID">
							<Input
								value={scopeState.userId}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setScopeState((current) => ({ ...current, userId: event.target.value }))
								}
								required
							/>
						</Field>
						<Field label="Region scope type">
							<Input
								value={scopeState.regionScopeType}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setScopeState((current) => ({ ...current, regionScopeType: event.target.value }))
								}
								required
							/>
						</Field>
						<Field label="Region scope code">
							<Input
								value={scopeState.regionScopeCode}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setScopeState((current) => ({ ...current, regionScopeCode: event.target.value }))
								}
							/>
						</Field>
						<Field label="Organization scope type">
							<Input
								value={scopeState.organizationScopeType}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setScopeState((current) => ({
										...current,
										organizationScopeType: event.target.value,
									}))
								}
								required
							/>
						</Field>
						<Field label="Organization scope code">
							<Input
								value={scopeState.organizationScopeCode}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setScopeState((current) => ({
										...current,
										organizationScopeCode: event.target.value,
									}))
								}
							/>
						</Field>
						<Button variant="primary" type="submit" disabled={saving}>
							{saving ? "Saving..." : "Save scopes"}
						</Button>
					</form>
				</Card>
				<Card
					title="Current user scopes"
					description="These assignments constrain SIKESRA region and organization access."
				>
					{!data?.items.length ? (
						<EmptyState
							title={contract.emptyState}
							description="Assign region or organization scopes to an EmDash user reference."
						/>
					) : (
						<div className="grid gap-3 md:grid-cols-2">
							{data.items.map((item) => (
								<div
									key={item.userId}
									className="rounded-xl border border-kumo-line bg-kumo-base p-4"
								>
									<div className="font-semibold text-kumo-default">{item.userId}</div>
									<div className="mt-3 grid gap-2 text-xs text-kumo-subtle">
										<span>
											Region: {item.regionScopeType} {item.regionScopeCode || "all"}
										</span>
										<span>
											Organization: {item.organizationScopeType}{" "}
											{item.organizationScopeCode || "all"}
										</span>
										<span>Status: {item.isActive ? "Active" : "Inactive"}</span>
									</div>
								</div>
							))}
						</div>
					)}
				</Card>
			</div>
		</PageShell>
	);
}

function FieldStandardsPage() {
	const contract = getSikesraPageContract("/field-standards");
	const [moduleFilter, setModuleFilter] = React.useState("all");
	const [classFilter, setClassFilter] = React.useState("all");
	const filteredStandards = SIKESRA_FIELD_STANDARDS.filter((standard) => {
		const matchesModule = moduleFilter === "all" || standard.module === moduleFilter;
		const matchesClass = classFilter === "all" || standard.dataClass === classFilter;
		return matchesModule && matchesClass;
	});
	const activeSchema =
		moduleFilter === "all"
			? null
			: SIKESRA_MODULE_FIELD_VALIDATION_SCHEMAS.find((schema) => schema.module === moduleFilter);

	return (
		<PageShell width="wide">
			<PageHeader
				eyebrow="SIKESRA field contract"
				title={contract.title}
				description={contract.purpose}
			/>
			<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
				<Card
					title="Field catalog"
					description="Canonical fields by module, data class, storage table, and public/export policy."
				>
					<div className="mb-4 grid gap-4 md:grid-cols-2">
						<Field label="Module">
							<Select
								value={moduleFilter}
								onValueChange={(value) => setModuleFilter(value ?? "all")}
							>
								<Select.Option value="all">All modules</Select.Option>
								{DEFAULT_DATA_TYPES.map((type) => (
									<Select.Option key={type.id} value={type.id}>
										{type.label}
									</Select.Option>
								))}
							</Select>
						</Field>
						<Field label="Data class">
							<Select value={classFilter} onValueChange={(value) => setClassFilter(value ?? "all")}>
								<Select.Option value="all">All data classes</Select.Option>
								<Select.Option value="non_personal">Non-personal</Select.Option>
								<Select.Option value="personal">Personal</Select.Option>
								<Select.Option value="sensitive_personal">Sensitive personal</Select.Option>
								<Select.Option value="restricted">Restricted</Select.Option>
							</Select>
						</Field>
					</div>
					<div className="overflow-hidden rounded-xl border border-kumo-line">
						<div className="grid grid-cols-[minmax(220px,1.3fr)_140px_150px_160px_180px] gap-3 border-b border-kumo-line bg-kumo-tint/50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-kumo-subtle">
							<span>Field</span>
							<span>Module</span>
							<span>Data class</span>
							<span>Storage</span>
							<span>Policy</span>
						</div>
						<div className="max-h-[680px] divide-y divide-kumo-line overflow-auto">
							{filteredStandards.map((standard) => (
								<div
									key={`${standard.module}:${standard.key}`}
									className="grid grid-cols-[minmax(220px,1.3fr)_140px_150px_160px_180px] gap-3 px-4 py-3 text-sm text-kumo-default"
								>
									<div>
										<div className="font-semibold">{standard.label}</div>
										<div className="mt-1 font-mono text-xs text-kumo-subtle">{standard.key}</div>
									</div>
									<span className="text-kumo-subtle">{standard.module}</span>
									<div>
										<Pill tone={standard.dataClass === "non_personal" ? "success" : "warning"}>
											{standard.dataClass}
										</Pill>
									</div>
									<span className="font-mono text-xs text-kumo-subtle">
										{standard.storageTable}
									</span>
									<div className="flex flex-wrap gap-1.5">
										{standard.required ? <Badge variant="secondary">Required</Badge> : null}
										{standard.importable ? <Badge variant="outline">Import</Badge> : null}
										{standard.exportable ? <Badge variant="outline">Export</Badge> : null}
										{standard.publicSafe ? <Badge variant="secondary">Public safe</Badge> : null}
										{standard.maskByDefault ? <Badge variant="outline">Masked</Badge> : null}
									</div>
								</div>
							))}
						</div>
					</div>
				</Card>

				<Card
					title="Validation summary"
					description="Module-level import/export and privacy constraints."
				>
					{activeSchema ? (
						<div className="space-y-4 text-sm text-kumo-default">
							<div>
								<div className="text-xs font-semibold uppercase tracking-wide text-kumo-subtle">
									Required
								</div>
								<div className="mt-2 flex flex-wrap gap-1.5">
									{activeSchema.requiredFields.map((field) => (
										<Badge key={field} variant="outline">
											{field}
										</Badge>
									))}
								</div>
							</div>
							<div>
								<div className="text-xs font-semibold uppercase tracking-wide text-kumo-subtle">
									Address groups
								</div>
								<div className="mt-2 grid gap-2 text-xs text-kumo-subtle">
									<span>KTP fields: {activeSchema.ktpAddressFields.length}</span>
									<span>Domicile fields: {activeSchema.domicileAddressFields.length}</span>
								</div>
							</div>
							<div>
								<div className="text-xs font-semibold uppercase tracking-wide text-kumo-subtle">
									Restricted export
								</div>
								<div className="mt-2 flex flex-wrap gap-1.5">
									{activeSchema.restrictedExportFields.map((field) => (
										<Badge key={field} variant="secondary">
											{field}
										</Badge>
									))}
								</div>
							</div>
						</div>
					) : (
						<EmptyState
							title="Select a module"
							description="Choose one SIKESRA module to review required fields, KTP and domicile address groups, and restricted export rules."
						/>
					)}
				</Card>
			</div>
		</PageShell>
	);
}

function CustomAttributeDefinitionsPage() {
	const contract = getSikesraPageContract("/custom-attributes/definitions");
	const { data, error, loading, reload } = usePluginData<CustomAttributeDefinitionsResponse>(
		"custom-attributes/definitions/list",
	);
	const [notice, setNotice] = React.useState<string | null>(null);
	const [saveError, setSaveError] = React.useState<string | null>(null);
	const [saving, setSaving] = React.useState(false);
	const [formState, setFormState] = React.useState<SikesraCustomAttributeDefinitionRequest>({
		key: "",
		label: "",
		scope: "entity_type",
		entityType: "rumah_ibadah",
		dataClass: "non_personal",
		dataType: "string",
		publicSafe: false,
		maskByDefault: false,
		isImportable: true,
		isExportable: false,
	});

	const saveDefinition = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSaving(true);
		setNotice(null);
		setSaveError(null);

		try {
			await saveCustomAttributeDefinition(formState, await createAdminApiRequestOptions());
			setFormState((current) => ({
				...current,
				key: "",
				label: "",
				description: "",
			}));
			setNotice("Custom attribute definition saved with audit tracking.");
			await reload();
		} catch (cause) {
			setSaveError(
				cause instanceof Error ? cause.message : "Failed to save custom attribute definition.",
			);
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <LoadingState label="Loading custom attribute definitions..." />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;

	return (
		<PageShell width="wide">
			<PageHeader
				eyebrow="SIKESRA UI/UX standard"
				title={contract.title}
				description={contract.purpose}
			/>
			<Feedback message={notice} />
			<Feedback message={saveError} tone="danger" />

			<div className="grid gap-6 xl:grid-cols-[minmax(360px,0.85fr)_minmax(0,1.15fr)]">
				<Card
					title="Controlled attribute builder"
					description="Create scoped fields with validation, privacy, import, and export rules."
				>
					<div className="mb-4 grid gap-2 sm:grid-cols-5">
						{SIKESRA_CUSTOM_ATTRIBUTE_BUILDER_SECTIONS.map((step, index) => (
							<div key={step.id} className="rounded-xl border border-kumo-line bg-kumo-tint/30 p-3">
								<div className="text-[10px] font-semibold uppercase tracking-wider text-kumo-subtle">
									Step {index + 1}
								</div>
								<div className="mt-1 text-xs font-semibold text-kumo-default">{step.label}</div>
							</div>
						))}
					</div>

					<form className="space-y-4" onSubmit={(event) => void saveDefinition(event)}>
						<div className="grid gap-4 md:grid-cols-2">
							<Field
								label="Attribute key"
								hint="Use lowercase snake_case. Protected SIKESRA keys are blocked."
							>
								<Input
									value={formState.key ?? ""}
									onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
										setFormState((current) => ({ ...current, key: event.target.value }))
									}
									required
								/>
							</Field>
							<Field label="Label">
								<Input
									value={formState.label ?? ""}
									onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
										setFormState((current) => ({ ...current, label: event.target.value }))
									}
									required
								/>
							</Field>
						</div>
						<Field label="Description">
							<InputArea
								value={formState.description ?? ""}
								onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
									setFormState((current) => ({ ...current, description: event.target.value }))
								}
							/>
						</Field>
						<div className="grid gap-4 md:grid-cols-2">
							<Field label="Scope">
								<Select
									value={formState.scope ?? "entity_type"}
									onValueChange={(value) =>
										setFormState((current) => ({ ...current, scope: value ?? "entity_type" }))
									}
								>
									<Select.Option value="global">Global</Select.Option>
									<Select.Option value="entity_type">Entity Type</Select.Option>
									<Select.Option value="subtype">Subtype</Select.Option>
									<Select.Option value="registry_entity">Registry Entity</Select.Option>
									<Select.Option value="sikesra_id_20">SIKESRA ID</Select.Option>
								</Select>
							</Field>
							<Field label="Entity type">
								<Select
									value={formState.entityType ?? "rumah_ibadah"}
									onValueChange={(value) =>
										setFormState((current) => ({ ...current, entityType: value ?? "rumah_ibadah" }))
									}
								>
									{DEFAULT_DATA_TYPES.map((type) => (
										<Select.Option key={type.id} value={type.id}>
											{type.label}
										</Select.Option>
									))}
								</Select>
							</Field>
						</div>
						<div className="grid gap-4 md:grid-cols-2">
							<Field label="Data class">
								<Select
									value={formState.dataClass ?? "non_personal"}
									onValueChange={(value) =>
										setFormState((current) => ({
											...current,
											dataClass:
												(value as SikesraCustomAttributeDefinitionRequest["dataClass"]) ??
												"non_personal",
											publicSafe: value === "non_personal" ? current.publicSafe : false,
											maskByDefault: value === "non_personal" ? current.maskByDefault : true,
										}))
									}
								>
									<Select.Option value="non_personal">Non-personal</Select.Option>
									<Select.Option value="personal">Personal</Select.Option>
									<Select.Option value="sensitive_personal">Sensitive personal</Select.Option>
									<Select.Option value="restricted">Restricted</Select.Option>
								</Select>
							</Field>
							<Field label="Data type">
								<Select
									value={formState.dataType ?? "string"}
									onValueChange={(value) =>
										setFormState((current) => ({ ...current, dataType: value ?? "string" }))
									}
								>
									<Select.Option value="string">String</Select.Option>
									<Select.Option value="text">Text</Select.Option>
									<Select.Option value="number">Number</Select.Option>
									<Select.Option value="boolean">Boolean</Select.Option>
									<Select.Option value="date">Date</Select.Option>
									<Select.Option value="json">JSON</Select.Option>
								</Select>
							</Field>
						</div>
						<div className="grid gap-3 md:grid-cols-2">
							{(
								[
									["publicSafe", "Public-safe aggregate"],
									["maskByDefault", "Mask by default"],
									["isImportable", "Importable"],
									["isExportable", "Exportable"],
								] as Array<[keyof SikesraCustomAttributeDefinitionRequest, string]>
							).map(([key, label]) => (
								<label
									key={key}
									className="flex items-center justify-between gap-3 rounded-xl border border-kumo-line bg-kumo-tint/20 px-3 py-2 text-sm text-kumo-default"
								>
									<span>{label}</span>
									<input
										type="checkbox"
										checked={Boolean(formState[key])}
										disabled={key === "publicSafe" && formState.dataClass !== "non_personal"}
										onChange={(event) =>
											setFormState((current) => ({ ...current, [key]: event.target.checked }))
										}
									/>
								</label>
							))}
						</div>
						<Button variant="primary" type="submit" disabled={saving}>
							{saving ? "Saving..." : "Save custom attribute"}
						</Button>
					</form>
				</Card>

				<Card
					title="Definitions"
					description="Active custom attributes with privacy and scope badges."
				>
					{!data?.items.length ? (
						<EmptyState
							title={contract.emptyState}
							description="Create a controlled custom field to extend registry forms."
						/>
					) : (
						<div className="space-y-3">
							{data.items.map((item) => (
								<div key={item.id} className="rounded-xl border border-kumo-line bg-kumo-base p-4">
									<div className="flex flex-wrap items-start justify-between gap-3">
										<div>
											<div className="font-semibold text-kumo-default">{item.label}</div>
											<div className="mt-1 font-mono text-xs text-kumo-subtle">{item.key}</div>
										</div>
										<div className="flex flex-wrap gap-2">
											<Badge variant="secondary">{item.scope}</Badge>
											<Badge variant="outline">{item.dataType}</Badge>
											<Pill tone={item.dataClass === "non_personal" ? "success" : "warning"}>
												{item.dataClass}
											</Pill>
										</div>
									</div>
									<div className="mt-3 grid gap-2 text-xs text-kumo-subtle sm:grid-cols-3">
										<span>Entity: {item.entityType ?? "Any"}</span>
										<span>Public safe: {item.publicSafe ? "Yes" : "No"}</span>
										<span>Masked: {item.maskByDefault ? "Yes" : "No"}</span>
									</div>
								</div>
							))}
						</div>
					)}
				</Card>
			</div>
		</PageShell>
	);
}

function CustomAttributeValuesPage() {
	const contract = getSikesraPageContract("/custom-attributes/values");
	const { data: definitions } = usePluginData<CustomAttributeDefinitionsResponse>(
		"custom-attributes/definitions/list",
	);
	const { data, error, loading, reload } = usePluginData<CustomAttributeValuesResponse>(
		"custom-attributes/values/list",
	);
	const [notice, setNotice] = React.useState<string | null>(null);
	const [saveError, setSaveError] = React.useState<string | null>(null);
	const [saving, setSaving] = React.useState(false);
	const [formState, setFormState] = React.useState<SikesraCustomAttributeValueRequest>({
		definitionId: "",
		ownerType: "registry_entity",
		ownerId: "",
		registryEntityId: "",
		value: "",
	});
	const formValueText = typeof formState.value === "string" ? formState.value : JSON.stringify(formState.value ?? "");

	React.useEffect(() => {
		const firstDefinitionId = definitions?.items[0]?.id;
		if (firstDefinitionId && !formState.definitionId) {
			setFormState((current) => ({ ...current, definitionId: firstDefinitionId }));
		}
	}, [definitions?.items, formState.definitionId]);

	const saveValue = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSaving(true);
		setNotice(null);
		setSaveError(null);

		try {
			await saveCustomAttributeValue(
				{
					...formState,
					registryEntityId: formState.registryEntityId || formState.ownerId,
				},
				await createAdminApiRequestOptions(),
			);
			setNotice("Custom attribute value saved with masking policy applied.");
			setFormState((current) => ({ ...current, ownerId: "", registryEntityId: "", value: "" }));
			await reload();
		} catch (cause) {
			setSaveError(
				cause instanceof Error ? cause.message : "Failed to save custom attribute value.",
			);
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <LoadingState label="Loading custom attribute values..." />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;

	return (
		<PageShell width="wide">
			<PageHeader
				eyebrow="SIKESRA UI/UX standard"
				title={contract.title}
				description={contract.purpose}
			/>
			<Feedback message={notice} />
			<Feedback message={saveError} tone="danger" />

			<div className="grid gap-6 xl:grid-cols-[minmax(340px,0.8fr)_minmax(0,1.2fr)]">
				<Card
					title="Assign value"
					description="Attach custom values to a registry entity or SIKESRA ID."
				>
					<form className="space-y-4" onSubmit={(event) => void saveValue(event)}>
						<Field label="Definition">
							<Select
								value={formState.definitionId}
								onValueChange={(value) =>
									setFormState((current) => ({ ...current, definitionId: value ?? "" }))
								}
							>
								{definitions?.items.map((item) => (
									<Select.Option key={item.id} value={item.id}>
										{item.label}
									</Select.Option>
								))}
							</Select>
						</Field>
						<Field label="Registry entity ID">
							<Input
								value={formState.registryEntityId ?? ""}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setFormState((current) => ({
										...current,
										ownerId: event.target.value,
										registryEntityId: event.target.value,
									}))
								}
								required
							/>
						</Field>
						<Field label="SIKESRA 20-digit ID" hint="Optional link for ID-specific attributes.">
							<Input
								value={formState.sikesraId20 ?? ""}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setFormState((current) => ({ ...current, sikesraId20: event.target.value }))
								}
							/>
						</Field>
						<Field label="Value">
							<InputArea
								value={formValueText}
								onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
									setFormState((current) => ({ ...current, value: event.target.value }))
								}
								required
							/>
						</Field>
						<Button variant="primary" type="submit" disabled={saving || !definitions?.items.length}>
							{saving ? "Saving..." : "Save value"}
						</Button>
					</form>
				</Card>

				<Card
					title="Current values"
					description="Masked values stay redacted unless sensitive-read access is granted."
				>
					{!data?.items.length ? (
						<EmptyState
							title={contract.emptyState}
							description="Save a custom value to review masking and ownership."
						/>
					) : (
						<div className="space-y-3">
							{data.items.map((item) => (
								<div key={item.id} className="rounded-xl border border-kumo-line bg-kumo-base p-4">
									<div className="flex flex-wrap items-start justify-between gap-3">
										<div>
											<div className="font-mono text-xs text-kumo-subtle">{item.id}</div>
											<div className="mt-1 text-sm font-semibold text-kumo-default">
												{item.valueDisplay}
											</div>
										</div>
										<div className="flex flex-wrap gap-2">
											<Badge variant="outline">{item.sensitivity}</Badge>
											<Pill tone={item.masked ? "warning" : "success"}>
												{item.masked ? "Masked" : "Visible"}
											</Pill>
										</div>
									</div>
									<div className="mt-3 grid gap-2 text-xs text-kumo-subtle sm:grid-cols-3">
										<span>Definition: {item.definitionId}</span>
										<span>Registry: {item.registryEntityId ?? "-"}</span>
										<span>SIKESRA ID: {item.sikesraId20 ?? "-"}</span>
									</div>
								</div>
							))}
						</div>
					)}
				</Card>
			</div>
		</PageShell>
	);
}

function DeleteRequestsPage() {
	const contract = getSikesraPageContract("/delete-requests");
	const { data, error, loading, reload } = usePluginData<PermanentDeleteRequestsResponse>(
		"crud/permanent-delete/requests/list",
		{},
	);
	const [notice, setNotice] = React.useState<string | null>(null);
	const [saveError, setSaveError] = React.useState<string | null>(null);
	const [requestState, setRequestState] = React.useState({
		targetTable: "sikesra_registry_entities",
		targetRecordId: "",
		targetType: "registry_entity",
		reason: "",
		confirmation: "",
	});
	const [decisionState, setDecisionState] = React.useState<
		Record<string, { notes: string; confirmation: string }>
	>({});
	const [busyId, setBusyId] = React.useState<string | null>(null);

	const requestDelete = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setBusyId("request");
		setNotice(null);
		setSaveError(null);
		try {
			await requestPermanentDelete(requestState, await createAdminApiRequestOptions());
			setNotice("Permanent delete request created with snapshot review pending.");
			setRequestState((current) => ({
				...current,
				targetRecordId: "",
				reason: "",
				confirmation: "",
			}));
			await reload();
		} catch (cause) {
			setSaveError(cause instanceof Error ? cause.message : "Failed to create delete request.");
		} finally {
			setBusyId(null);
		}
	};

	const decideDelete = async (
		item: PermanentDeleteRequestItem,
		decision: "approved" | "rejected",
	) => {
		setBusyId(`${item.id}:${decision}`);
		setNotice(null);
		setSaveError(null);
		try {
			await approvePermanentDelete(
				{
					deleteRequestId: item.id,
					decision,
					notes: decisionState[item.id]?.notes ?? "",
				},
				await createAdminApiRequestOptions(),
			);
			setNotice(`Permanent delete request ${decision}.`);
			await reload();
		} catch (cause) {
			setSaveError(cause instanceof Error ? cause.message : `Failed to mark request ${decision}.`);
		} finally {
			setBusyId(null);
		}
	};

	const executeDelete = async (item: PermanentDeleteRequestItem) => {
		setBusyId(`${item.id}:execute`);
		setNotice(null);
		setSaveError(null);
		try {
			if (decisionState[item.id]?.confirmation !== "PERMANENT DELETE") {
				throw new Error("Type PERMANENT DELETE before executing the permanent delete request.");
			}
			await executePermanentDelete(
				{
					deleteRequestId: item.id,
					confirmation: "PERMANENT DELETE",
				},
				await createAdminApiRequestOptions(),
			);
			setNotice("Permanent delete request executed after confirmation.");
			await reload();
		} catch (cause) {
			setSaveError(cause instanceof Error ? cause.message : "Failed to execute delete request.");
		} finally {
			setBusyId(null);
		}
	};

	if (loading) return <LoadingState label="Loading permanent delete requests..." />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;

	return (
		<PageShell width="wide">
			<PageHeader
				eyebrow="SIKESRA governance"
				title={contract.title}
				description={contract.purpose}
			/>
			<Feedback message={notice} />
			<Feedback message={saveError} tone="danger" />

			<div className="grid gap-6 xl:grid-cols-[minmax(340px,0.8fr)_minmax(0,1.2fr)]">
				<Card
					title="Create delete request"
					description="Highest-admin workflow requires reason, snapshot, and exact confirmation."
				>
					<form className="space-y-4" onSubmit={(event) => void requestDelete(event)}>
						<Field label="Target table">
							<Input
								value={requestState.targetTable}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setRequestState((current) => ({ ...current, targetTable: event.target.value }))
								}
								required
							/>
						</Field>
						<Field label="Target record ID">
							<Input
								value={requestState.targetRecordId}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setRequestState((current) => ({ ...current, targetRecordId: event.target.value }))
								}
								required
							/>
						</Field>
						<Field label="Reason" hint="Required for audit review.">
							<InputArea
								value={requestState.reason}
								onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
									setRequestState((current) => ({ ...current, reason: event.target.value }))
								}
								required
							/>
						</Field>
						<Field label="Confirmation phrase" hint="Type PERMANENT DELETE to create the request.">
							<Input
								value={requestState.confirmation}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setRequestState((current) => ({ ...current, confirmation: event.target.value }))
								}
								required
							/>
						</Field>
						<Button variant="primary" type="submit" disabled={busyId === "request"}>
							{busyId === "request" ? "Requesting..." : "Create request"}
						</Button>
					</form>
				</Card>

				<Card
					title="Review queue"
					description="Approve, reject, or execute with high-friction confirmation."
				>
					{!data?.items.length ? (
						<EmptyState
							title={contract.emptyState}
							description="No permanent delete requests are waiting for review."
						/>
					) : (
						<div className="space-y-4">
							{data.items.map((item) => (
								<div key={item.id} className="rounded-xl border border-kumo-line bg-kumo-base p-4">
									<div className="flex flex-wrap items-start justify-between gap-3">
										<div>
											<div className="font-semibold text-kumo-default">{item.targetRecordId}</div>
											<div className="mt-1 font-mono text-xs text-kumo-subtle">
												{item.targetTable}
											</div>
										</div>
										<div className="flex flex-wrap gap-2">
											<Badge variant="outline">{item.riskLevel}</Badge>
											<Pill
												tone={
													item.status === "approved"
														? "warning"
														: item.status === "executed"
															? "danger"
															: "neutral"
												}
											>
												{item.status}
											</Pill>
										</div>
									</div>
									<p className="mt-3 text-sm text-kumo-subtle">{item.reason}</p>
									<div className="mt-3 grid gap-2 text-xs text-kumo-subtle sm:grid-cols-3">
										<span>Requested by: {item.requestedBy}</span>
										<span>Requested: {formatDateTime(item.requestedAt, "en")}</span>
										<span>Type: {item.targetType}</span>
									</div>
									<div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
										<Input
											value={decisionState[item.id]?.notes ?? ""}
											placeholder="Decision notes"
											onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
												setDecisionState((current) => ({
													...current,
													[item.id]: {
														notes: event.target.value,
														confirmation: current[item.id]?.confirmation ?? "",
													},
												}))
											}
										/>
										<div className="flex flex-wrap gap-2">
											<Button
												size="sm"
												variant="secondary"
												type="button"
												onClick={() => void decideDelete(item, "approved")}
											>
												Approve
											</Button>
											<Button
												size="sm"
												variant="secondary"
												type="button"
												onClick={() => void decideDelete(item, "rejected")}
											>
												Reject
											</Button>
										</div>
									</div>
									<div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
										<Input
											value={decisionState[item.id]?.confirmation ?? ""}
											placeholder="PERMANENT DELETE"
											onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
												setDecisionState((current) => ({
													...current,
													[item.id]: {
														notes: current[item.id]?.notes ?? "",
														confirmation: event.target.value,
													},
												}))
											}
										/>
										<Button
											size="sm"
											variant="primary"
											type="button"
											onClick={() => void executeDelete(item)}
										>
											Execute
										</Button>
									</div>
								</div>
							))}
						</div>
					)}
				</Card>
			</div>
		</PageShell>
	);
}

function ArchivesPage() {
	const contract = getSikesraPageContract("/archives");
	const { data, error, loading, reload } = usePluginData<RegistryArchiveResponse>(
		"registry/archive/list",
		{},
	);
	const [restoreReasons, setRestoreReasons] = React.useState<Record<string, string>>({});
	const [notice, setNotice] = React.useState<string | null>(null);
	const [saveError, setSaveError] = React.useState<string | null>(null);
	const [restoringId, setRestoringId] = React.useState<string | null>(null);

	const restoreEntity = async (entity: ArchivedRegistryEntity) => {
		setRestoringId(entity.id);
		setNotice(null);
		setSaveError(null);
		try {
			await restoreRegistry(
				{
					id: entity.id,
					reason: restoreReasons[entity.id] ?? "",
				},
				await createAdminApiRequestOptions(),
			);
			setNotice(`Restored archived registry entity ${entity.code || entity.id}.`);
			await reload();
		} catch (cause) {
			setSaveError(
				cause instanceof Error ? cause.message : "Failed to restore archived registry entity.",
			);
		} finally {
			setRestoringId(null);
		}
	};

	if (loading) return <LoadingState label="Loading archived registry entities..." />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;

	return (
		<PageShell width="wide">
			<PageHeader
				eyebrow="SIKESRA governance"
				title={contract.title}
				description={contract.purpose}
			/>
			<Feedback message={notice} />
			<Feedback message={saveError} tone="danger" />
			<Card
				title="Archived registry records"
				description="Restore actions require a reason and are audited."
			>
				{!data?.items.length ? (
					<EmptyState
						title={contract.emptyState}
						description="No archived registry records are available for restore."
					/>
				) : (
					<div className="space-y-4">
						{data.items.map((entity) => (
							<div key={entity.id} className="rounded-xl border border-kumo-line bg-kumo-base p-4">
								<div className="flex flex-wrap items-start justify-between gap-3">
									<div>
										<div className="font-semibold text-kumo-default">{entity.label}</div>
										<div className="mt-1 font-mono text-xs text-kumo-subtle">
											{entity.code || entity.id}
										</div>
									</div>
									<div className="flex flex-wrap gap-2">
										<Badge variant="outline">{entity.entityType}</Badge>
										<Pill tone="neutral">Archived</Pill>
									</div>
								</div>
								<p className="mt-3 text-sm text-kumo-subtle">
									{entity.publicSummary || "Archived registry entity pending restore review."}
								</p>
								<div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
									<Input
										value={restoreReasons[entity.id] ?? ""}
										placeholder="Restore reason"
										onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
											setRestoreReasons((current) => ({
												...current,
												[entity.id]: event.target.value,
											}))
										}
									/>
									<Button
										size="sm"
										variant="primary"
										type="button"
										disabled={restoringId === entity.id}
										onClick={() => void restoreEntity(entity)}
									>
										{restoringId === entity.id ? "Restoring..." : "Restore"}
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</Card>
		</PageShell>
	);
}

function SettingsPage() {
	const contract = getSikesraPageContract("/settings");
	const { data, error, loading, reload } = usePluginData<SikesraSettingsState>("settings/get", {});
	const [saving, setSaving] = React.useState(false);
	const [notice, setNotice] = React.useState<string | null>(null);
	const [saveError, setSaveError] = React.useState<string | null>(null);
	const [formState, setFormState] = React.useState({
		publicStatusLabel: "healthy",
		auditRetentionDays: "30",
		governanceMode: "review" as GovernanceMode,
		metadataCanonicalBase: "",
		smallCellThreshold: "3",
		sikesraPublicEnabled: true,
	});

	React.useEffect(() => {
		if (!data) return;
		setFormState({
			publicStatusLabel: data.publicStatusLabel,
			auditRetentionDays: String(data.auditRetentionDays),
			governanceMode: (data.governanceMode as GovernanceMode) ?? "review",
			metadataCanonicalBase: data.metadataCanonicalBase,
			smallCellThreshold: String(data.smallCellThreshold ?? 3),
			sikesraPublicEnabled: data.sikesraPublicEnabled !== false,
		});
	}, [data]);

	const saveSettings = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSaving(true);
		setNotice(null);
		setSaveError(null);
		try {
			await saveSikesraSettings(
				{
					publicStatusLabel: formState.publicStatusLabel.trim(),
					auditRetentionDays: Number(formState.auditRetentionDays),
					governanceMode: formState.governanceMode,
					metadataCanonicalBase: formState.metadataCanonicalBase.trim(),
					smallCellThreshold: Number(formState.smallCellThreshold),
					sikesraPublicEnabled: formState.sikesraPublicEnabled,
				},
				await createAdminApiRequestOptions(),
			);
			setNotice("SIKESRA settings saved with audit tracking.");
			await reload();
		} catch (cause) {
			setSaveError(cause instanceof Error ? cause.message : "Failed to save SIKESRA settings.");
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <LoadingState label="Loading SIKESRA settings..." />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;

	return (
		<PageShell>
			<PageHeader
				eyebrow="SIKESRA configuration"
				title={contract.title}
				description={contract.purpose}
			/>
			<Feedback message={notice} />
			<Feedback message={saveError} tone="danger" />
			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
				<Card
					title="Public and governance settings"
					description="Controls public-safe status, aggregate safety, and audit retention."
				>
					<form className="space-y-4" onSubmit={(event) => void saveSettings(event)}>
						<Field label="Public status label">
							<Input
								value={formState.publicStatusLabel}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setFormState((current) => ({ ...current, publicStatusLabel: event.target.value }))
								}
								required
							/>
						</Field>
						<div className="grid gap-4 md:grid-cols-2">
							<Field label="Audit retention days">
								<Input
									type="number"
									min={1}
									value={formState.auditRetentionDays}
									onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
										setFormState((current) => ({
											...current,
											auditRetentionDays: event.target.value,
										}))
									}
									required
								/>
							</Field>
							<Field
								label="Small-cell threshold"
								hint="Counts below this value are suppressed in public aggregate output."
							>
								<Input
									type="number"
									min={1}
									value={formState.smallCellThreshold}
									onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
										setFormState((current) => ({
											...current,
											smallCellThreshold: event.target.value,
										}))
									}
									required
								/>
							</Field>
						</div>
						<Field label="Governance mode">
							<Select
								value={formState.governanceMode}
								onValueChange={(value) =>
									setFormState((current) => ({
										...current,
										governanceMode: (value as GovernanceMode | null) ?? "review",
									}))
								}
							>
								<Select.Option value="observe">Observe</Select.Option>
								<Select.Option value="review">Review</Select.Option>
								<Select.Option value="enforce-demo">Enforce Demo</Select.Option>
							</Select>
						</Field>
						<Field label="Metadata canonical base" hint="Optional HTTP or HTTPS base URL.">
							<Input
								value={formState.metadataCanonicalBase}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setFormState((current) => ({
										...current,
										metadataCanonicalBase: event.target.value,
									}))
								}
							/>
						</Field>
						<label className="flex items-center justify-between gap-3 rounded-xl border border-kumo-line bg-kumo-tint/20 px-3 py-2 text-sm text-kumo-default">
							<span>Enable public-safe SIKESRA aggregate API</span>
							<input
								type="checkbox"
								checked={formState.sikesraPublicEnabled}
								onChange={(event) =>
									setFormState((current) => ({
										...current,
										sikesraPublicEnabled: event.target.checked,
									}))
								}
							/>
						</label>
						<Button variant="primary" type="submit" disabled={saving}>
							{saving ? "Saving..." : "Save settings"}
						</Button>
					</form>
				</Card>
				<Card title="Safety summary" description="Current public and privacy controls.">
					<div className="space-y-3 text-sm text-kumo-default">
						<div className="flex items-center justify-between gap-3">
							<span className="text-kumo-subtle">Public API</span>
							<Pill tone={formState.sikesraPublicEnabled ? "success" : "warning"}>
								{formState.sikesraPublicEnabled ? "Enabled" : "Disabled"}
							</Pill>
						</div>
						<div className="flex items-center justify-between gap-3">
							<span className="text-kumo-subtle">Suppression threshold</span>
							<Badge variant="outline">{formState.smallCellThreshold}</Badge>
						</div>
						<div className="flex items-center justify-between gap-3">
							<span className="text-kumo-subtle">Governance</span>
							<Badge variant="secondary">{formState.governanceMode}</Badge>
						</div>
						<EmptyState
							title="Public-safe aggregate only"
							description="Settings cannot expose personal, sensitive, restricted, KTP, domicile, or document metadata through public output."
						/>
					</div>
				</Card>
			</div>
		</PageShell>
	);
}

function Feedback({
	message,
	tone = "success",
}: {
	message: string | null;
	tone?: "success" | "danger" | "info";
}) {
	if (!message) return null;
	return (
		<div
			className={cx(
				"flex items-start gap-2.5 rounded-xl border p-3.5 text-sm",
				tone === "success"
					? "border-kumo-success/30 bg-kumo-success/10 text-kumo-success"
					: tone === "danger"
						? "border-kumo-danger/30 bg-kumo-danger/10 text-kumo-danger"
						: "border-kumo-brand/30 bg-kumo-brand/10 text-kumo-brand",
			)}
			style={{ padding: "14px" }}
		>
			<span className="mt-0.5 shrink-0">
				{tone === "success" ? "✅" : tone === "danger" ? "❌" : "ℹ️"}
			</span>
			<span>{message}</span>
		</div>
	);
}

function KeyValueList({ items }: { items: Array<[string, React.ReactNode]> }) {
	return (
		<dl className="grid gap-3 text-sm md:grid-cols-2">
			{items.map(([label, value]) => (
				<div className="rounded-xl border border-kumo-line bg-kumo-tint/50 p-3" key={label}>
					<dt className="text-xs font-medium uppercase tracking-wide text-kumo-subtle">{label}</dt>
					<dd className="mt-1 break-words font-medium text-kumo-default">{value}</dd>
				</div>
			))}
		</dl>
	);
}

function GovernanceWidget() {
	const { data, error, loading, reload } = usePluginData<SummaryResponse>("overview/summary");
	const { i18n } = useLingui();
	const copy = getExampleAdminCopy(i18n.locale);

	if (loading) return <LoadingState label={copy.loadingGovernanceStatus} />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;
	const summary = normalizeSummaryResponse(data);
	if (!summary)
		return <EmptyState title={copy.noStatusYet} description={copy.noStatusYetDescription} />;

	return (
		<div className="space-y-3">
			<div className="grid grid-cols-3 gap-2 text-sm">
				<MetricCard label={copy.audit} value={summary.counters.auditCount} />
				<MetricCard label={copy.lifecycle} value={summary.counters.lifecycleCount} />
				<MetricCard label={copy.publicHits} value={summary.counters.publicHits} />
			</div>
			<KeyValueList
				items={[
					[copy.mode, <Pill key="mode">{summary.settings.governanceMode}</Pill>],
					[copy.lastLifecycle, formatDateTime(summary.lastLifecycle, i18n.locale)],
				]}
			/>
			<Button variant="ghost" size="sm" onClick={() => void reload()} type="button">
				{copy.refresh}
			</Button>
		</div>
	);
}

function AccessRightsHealthWidget() {
	const { data, error, loading, reload } = usePluginData<AccessHealthResponse>("access/health");
	const { i18n } = useLingui();
	const copy = getExampleAdminCopy(i18n.locale);

	if (loading) return <LoadingState label={copy.loadingAccessHealth} />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;
	if (!data)
		return <EmptyState title={copy.noHealthData} description={copy.noHealthDataDescription} />;

	const health = normalizeAccessHealthResponse(data);
	const hasGaps = health.rolesWithoutPermissions.length > 0 || health.usersWithoutRoles.length > 0;

	return (
		<div className="space-y-3">
			<div className="grid grid-cols-2 gap-2 text-sm">
				<MetricCard label={copy.permissions} value={health.permissionCount} />
				<MetricCard label={copy.roles} value={health.roleCount} />
				<MetricCard label={copy.matrices} value={health.assignmentCount} />
				<MetricCard label={copy.users} value={health.userAssignmentCount} />
			</div>
			<div className="text-sm">
				<Pill tone={hasGaps ? "warning" : "success"}>
					{hasGaps ? copy.reviewNeeded : copy.healthy}
				</Pill>
				<p className="mt-2 text-kumo-subtle">
					{hasGaps
						? copy.catalogGapSummary(
								health.rolesWithoutPermissions.length,
								health.usersWithoutRoles.length,
							)
						: copy.catalogGapNone}
				</p>
			</div>
			<Button variant="ghost" size="sm" onClick={() => void reload()} type="button">
				{copy.refresh}
			</Button>
		</div>
	);
}

function AbacPolicyStatusWidget() {
	const { data, error, loading, reload } = usePluginData<AbacHealthResponse>("abac/health");
	const { i18n } = useLingui();
	const copy = getExampleAdminCopy(i18n.locale);

	if (loading) return <LoadingState label={copy.loadingAbacStatus} />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;
	if (!data) return <EmptyState title={copy.noAbacData} description={copy.noAbacDataDescription} />;

	return (
		<div className="space-y-3">
			<div className="grid grid-cols-2 gap-2 text-sm">
				<MetricCard label={copy.attributes} value={data.attributeCount} />
				<MetricCard label={copy.policies} value={data.policyCount} />
				<MetricCard label={copy.subjects} value={data.subjectCount} />
				<MetricCard label={copy.resources} value={data.resourceCount} />
			</div>
			<div className="text-sm text-kumo-subtle">
				{copy.explicitDenyPolicies(data.explicitDenyCount)}
			</div>
			<Button variant="ghost" size="sm" onClick={() => void reload()} type="button">
				{copy.refresh}
			</Button>
		</div>
	);
}

function SikesraStatsChart({
	categories,
	isReferenceData = false,
}: {
	categories: any[];
	isReferenceData?: boolean;
}) {
	const maxVal = Math.max(...categories.map((c) => c.total), 1);

	return (
		<div
			className="rounded-2xl border border-kumo-line bg-kumo-base text-kumo-default shadow-sm mt-2 overflow-hidden"
			style={{
				border: "1px solid var(--kumo-line)",
				backgroundColor: "var(--kumo-base)",
			}}
		>
			<div
				className="flex items-center justify-between border-b border-kumo-line"
				style={{
					backgroundColor: "rgba(100, 116, 139, 0.04)",
					borderBottom: "1px solid var(--kumo-line)",
					padding: "16px 24px",
				}}
			>
				<div>
					<h2 className="text-sm font-semibold">Grafik Rekapitulasi Data SIKESRA</h2>
					<p className="text-xs text-kumo-subtle mt-0.5">
						Perbandingan jumlah total entitas terdaftar dengan data terverifikasi per kategori.
					</p>
				</div>
				{isReferenceData && (
					<span
						className="inline-flex items-center gap-1.5 rounded-full border"
						style={{
							backgroundColor: "rgba(245, 158, 11, 0.1)",
							color: "#d97706",
							borderColor: "rgba(245, 158, 11, 0.25)",
							padding: "4px 10px",
							fontSize: "12px",
							fontWeight: 500,
						}}
					>
						<span
							className="h-1.5 w-1.5 rounded-full"
							style={{ backgroundColor: "#f59e0b" }}
						/>
						Data Referensi
					</span>
				)}
			</div>

			<div
				style={{
					padding: "24px",
					display: "flex",
					flexDirection: "column",
					gap: "20px",
				}}
			>
				{categories.map((cat) => {
					const isSuppressed = isReferenceData ? false : !!cat.suppressed;
					const totalPct = (cat.total / maxVal) * 100;
					const verifiedPct = (cat.verified / maxVal) * 100;
					const verifiedOfTotal = cat.total > 0 ? Math.round((cat.verified / cat.total) * 100) : 0;

					return (
						<div key={cat.code} className="space-y-1.5">
							<div
								className="flex items-center justify-between"
								style={{
									fontSize: "14px",
									marginBottom: "6px",
								}}
							>
								<span className="font-medium text-kumo-default">{cat.label}</span>
								{isSuppressed ? (
									<span className="text-[11px] text-kumo-subtle italic">Disupresi</span>
								) : (
									<div className="flex items-center gap-3 text-xs">
										<span className="text-blue-600 font-semibold">{cat.total}</span>
										<span className="text-kumo-line">/</span>
										<span className="text-emerald-600 font-semibold">{cat.verified} ✓</span>
										<span className="text-kumo-subtle font-medium">({verifiedOfTotal}%)</span>
									</div>
								)}
							</div>

							{isSuppressed ? (
								<div
									className="rounded-xl border border-dashed flex items-center"
									style={{
										height: "32px",
										padding: "0 16px",
										backgroundColor: "var(--kumo-tint, rgba(100, 116, 139, 0.05))",
										borderColor: "var(--kumo-line, rgba(100, 116, 139, 0.25))",
									}}
								>
									<div
										className="flex items-center gap-2 font-medium"
										style={{
											fontSize: "12px",
											color: "var(--kumo-subtle, #4b5563)",
										}}
									>
										<span role="img" aria-label="lock" style={{ opacity: 0.7, fontSize: "14px" }}>🔒</span>
										<span>Jumlah terlalu rendah untuk keamanan privasi (&lt; 3)</span>
									</div>
								</div>
							) : (
								<div
									className="relative w-full rounded-lg overflow-hidden"
									style={{
										height: "28px",
										backgroundColor: "var(--kumo-tint, rgba(100, 116, 139, 0.08))",
									}}
								>
									<div
										className="absolute inset-y-0 left-0 rounded-lg transition-all duration-700"
										style={{
											width: `${totalPct}%`,
											backgroundColor: "rgba(59, 130, 246, 0.2)",
										}}
									/>
									<div
										className="absolute inset-y-0 left-0 rounded-lg transition-all duration-700"
										style={{
											width: `${verifiedPct}%`,
											backgroundColor: "#10b981",
										}}
									/>
								</div>
							)}
						</div>
					);
				})}
			</div>

			<div
				className="flex items-center border-t border-kumo-line text-kumo-subtle"
				style={{
					borderTop: "1px solid var(--kumo-line)",
					padding: "12px 24px",
					fontSize: "12px",
					gap: "20px",
				}}
			>
				<div className="flex items-center" style={{ gap: "6px" }}>
					<span
						className="rounded inline-block border"
						style={{
							width: "12px",
							height: "12px",
							backgroundColor: "rgba(59, 130, 246, 0.2)",
							borderColor: "rgba(59, 130, 246, 0.3)",
						}}
					/>
					<span style={{ color: "var(--kumo-subtle, #4b5563)" }}>Total Entitas</span>
				</div>
				<div className="flex items-center" style={{ gap: "6px" }}>
					<span
						className="rounded inline-block"
						style={{
							width: "12px",
							height: "12px",
							backgroundColor: "#10b981",
						}}
					/>
					<span style={{ color: "var(--kumo-subtle, #4b5563)" }}>Terverifikasi</span>
				</div>
			</div>
		</div>
	);
}

function OverviewPage() {
	const { data, error, loading, reload } = usePluginData<SummaryResponse>("overview/summary");
	const { data: publicStatus } = usePluginData<any>("public/status");
	const { data: healthData, reload: reloadHealth } = usePluginData<AccessHealthResponse>("access/health");
	const [settingsOpen, setSettingsOpen] = React.useState(false);
	const { i18n } = useLingui();
	const copy = getExampleAdminCopy(i18n.locale);
	const [saving, setSaving] = React.useState(false);
	const [notice, setNotice] = React.useState<string | null>(null);
	const [saveError, setSaveError] = React.useState<string | null>(null);
	const [formState, setFormState] = React.useState<{
		publicStatusLabel: string;
		auditRetentionDays: string;
		governanceMode: GovernanceMode;
		metadataCanonicalBase: string;
		smallCellThreshold: string;
		sikesraPublicEnabled: boolean;
	}>({
		publicStatusLabel: "",
		auditRetentionDays: "30",
		governanceMode: "review",
		metadataCanonicalBase: "",
		smallCellThreshold: "3",
		sikesraPublicEnabled: true,
	});

	React.useEffect(() => {
		const summary = normalizeSummaryResponse(data);
		if (!summary) return;
		setFormState({
			publicStatusLabel: summary.settings.publicStatusLabel,
			auditRetentionDays: String(summary.settings.auditRetentionDays),
			governanceMode: (summary.settings.governanceMode as GovernanceMode) ?? "review",
			metadataCanonicalBase: summary.settings.metadataCanonicalBase,
			smallCellThreshold: String(summary.settings.smallCellThreshold ?? 3),
			sikesraPublicEnabled: summary.settings.sikesraPublicEnabled !== false,
		});
	}, [data]);

	const saveSettings = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSaving(true);
		setNotice(null);
		setSaveError(null);

		try {
			await saveSikesraSettings(
				{
					publicStatusLabel: formState.publicStatusLabel.trim(),
					auditRetentionDays: Number(formState.auditRetentionDays),
					governanceMode: formState.governanceMode,
					metadataCanonicalBase: formState.metadataCanonicalBase.trim(),
					smallCellThreshold: Number(formState.smallCellThreshold),
					sikesraPublicEnabled: formState.sikesraPublicEnabled,
				},
				await createAdminApiRequestOptions(),
			);
			setNotice(copy.settingsSavedSuccessfully);
			await reload();
			if (reloadHealth) {
				await reloadHealth();
			}
		} catch (cause) {
			setSaveError(cause instanceof Error ? cause.message : copy.failedToSaveSettings);
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <LoadingState label={copy.loadingPluginOverview} />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;
	const summary = normalizeSummaryResponse(data);
	if (!summary)
		return <EmptyState title={copy.noOverviewData} description={copy.noOverviewDataDescription} />;
	const dashboardCards = getDashboardModuleCards(i18n.locale);

	const normalizedHealth = healthData ? normalizeAccessHealthResponse(healthData) : null;
	const healthGapsCount = normalizedHealth
		? normalizedHealth.rolesWithoutPermissions.length + normalizedHealth.usersWithoutRoles.length
		: 0;
	const isSystemHealthy = healthGapsCount === 0;

	const fallbackCategories = SIKESRA_REFERENCE_FIXTURES.publicAggregate.categories;
	const allModuleCategories = DEFAULT_DATA_TYPES.map((dt) => {
		const existing = fallbackCategories.find((cat) => cat.code === dt.id);
		return existing ?? { code: dt.id, label: dt.label, total: 0, verified: 0, suppressed: true };
	});
	const chartCategories =
		publicStatus?.publicAggregate?.categories?.length > 0
			? publicStatus.publicAggregate.categories
			: allModuleCategories;

	const isUsingReferenceData = !(publicStatus?.publicAggregate?.categories?.length > 0);

	return (
		<PageShell width="wide">
			{/* Premium Gradient Hero Banner */}
			<div
				className="relative overflow-hidden rounded-2xl p-6 md:p-8 shadow-lg mb-6"
				style={{
					background: "linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #4c1d95 100%)",
					color: "#ffffff",
				}}
			>
				<div className="absolute right-0 top-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
				<div className="absolute bottom-0 left-1/3 -mb-20 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />

				<div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
					<div className="space-y-2 max-w-3xl">
						<div className="flex flex-wrap items-center gap-2.5">
							<span
								className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-md"
								style={{ backgroundColor: "rgba(255, 255, 255, 0.12)", color: "#ffffff" }}
							>
								🚀 {copy.overviewEyebrow}
							</span>
							<span
								className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border backdrop-blur-md"
								style={{
									backgroundColor: "rgba(255, 255, 255, 0.08)",
									color: "#93c5fd",
									borderColor: "rgba(255, 255, 255, 0.15)",
								}}
							>
								{copy.pluginVersion}: 1.0.0
							</span>
							<span
								className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border backdrop-blur-md"
								style={{
									backgroundColor: "rgba(16, 185, 129, 0.15)",
									color: "#a7f3d0",
									borderColor: "rgba(16, 185, 129, 0.3)",
								}}
							>
								<span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
								{copy.governanceModeLabel}: {summary.settings.governanceMode}
							</span>
						</div>
						<h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mt-1">
							{copy.overviewTitle}
						</h1>
						<p
							className="text-sm md:text-base font-medium leading-relaxed max-w-2xl"
							style={{ color: "rgba(255, 255, 255, 0.88)" }}
						>
							{copy.overviewDescription}
						</p>
					</div>
					<div className="flex flex-row md:flex-col items-start md:items-end justify-between md:justify-center gap-4 shrink-0">
						<div
							className="backdrop-blur-md rounded-xl p-3 flex items-center gap-3 shadow-inner"
							style={{
								backgroundColor: "rgba(0, 0, 0, 0.25)",
								border: "1px solid rgba(255, 255, 255, 0.15)",
							}}
						>
							<span className="relative flex h-3 w-3">
								{isSystemHealthy ? (
									<>
										<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
										<span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
									</>
								) : (
									<>
										<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
										<span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
									</>
								)}
							</span>
							<div>
								<div className="text-xs font-semibold text-white/95">
									{isSystemHealthy ? copy.systemHealthy : copy.systemDegraded}
								</div>
								<div className="text-[10px] mt-0.5" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
									{isSystemHealthy ? copy.healthy : copy.reviewNeeded}
								</div>
							</div>
						</div>

						<Button
							variant="secondary"
							size="sm"
							onClick={() => {
								void reload();
								if (reloadHealth) void reloadHealth();
							}}
							type="button"
							className="hover:bg-white/20 text-white hover:text-white rounded-lg px-4 py-2 text-xs font-semibold transition-all"
							style={{
								backgroundColor: "rgba(255, 255, 255, 0.12)",
								border: "1px solid rgba(255, 255, 255, 0.18)",
							}}
						>
							🔄 {copy.refreshDashboard}
						</Button>
					</div>
				</div>
			</div>

			<Feedback message={notice} />
			<Feedback message={saveError} tone="danger" />

			{/* Metric Cards Row */}
			<div className="grid gap-5 md:grid-cols-3 mt-2 mb-6">
				<MetricCard
					label={copy.auditEventsStored}
					value={summary.counters.auditCount}
					hint={copy.auditEventsStoredHint}
					icon="📋"
					accent="blue"
				/>
				<MetricCard
					label={copy.lifecycleTriggers}
					value={summary.counters.lifecycleCount}
					hint={copy.lastRecorded(formatDateTime(summary.lastLifecycle, i18n.locale))}
					icon="⚙️"
					accent="purple"
				/>
				<MetricCard
					label={copy.publicApiHits}
					value={summary.counters.publicHits}
					hint={copy.lastCron(formatDateTime(summary.lastCronAt, i18n.locale))}
					icon="🌐"
					accent="emerald"
				/>
			</div>

			{/* Module Cards Grid */}
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
				{dashboardCards.map((card) => {
					const accents: Record<string, string> = {
						rumah_ibadah: "#3b82f6",
						lembaga_keagamaan: "#a855f7",
						pendidikan_keagamaan: "#10b981",
						lks: "#14b8a6",
						guru_agama: "#f59e0b",
						anak_yatim: "#f43f5e",
						disabilitas: "#6366f1",
						lansia_terlantar: "#f97316",
					};
					const icons: Record<string, string> = {
						rumah_ibadah: "🕌",
						lembaga_keagamaan: "🏛️",
						pendidikan_keagamaan: "📚",
						lks: "🤝",
						guru_agama: "🎓",
						anak_yatim: "🌱",
						disabilitas: "♿",
						lansia_terlantar: "🏠",
					};

					const catData = chartCategories.find((cat: any) => cat.code === card.id) || {
						total: 0,
						verified: 0,
					};
					const verifiedPercent = catData.total > 0 ? Math.round((catData.verified / catData.total) * 100) : 0;
					const cardColor = accents[card.id] || "#3b82f6";

					return (
						<section
							className="rounded-2xl border border-kumo-line bg-kumo-base text-kumo-default shadow-sm hover:shadow-md hover:scale-[1.01] transition-all flex flex-col justify-between min-h-[230px]"
							style={{
								borderTop: `4px solid ${cardColor}`,
								padding: "20px",
							}}
							key={card.id}
						>
							<div className="space-y-4">
								<div className="flex items-start justify-between gap-3">
									<div className="flex items-start gap-2.5">
										<span className="text-2xl shrink-0" role="img" aria-label={card.title}>
											{icons[card.id] || "📋"}
										</span>
										<div>
											<div className="text-sm font-bold text-kumo-default leading-tight">{card.title}</div>
											<div
												className="text-xs leading-normal text-kumo-subtle min-h-[32px] line-clamp-2"
												style={{ marginTop: "6px" }}
											>
												{card.description}
											</div>
										</div>
									</div>
									<div className="flex flex-col items-end gap-1.5 shrink-0">
										<Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">{card.status}</Badge>
										{card.badge != null ? <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">{card.badge}</Badge> : null}
									</div>
								</div>

								{/* Stats progress bar inside module card */}
								<div className="pt-3" style={{ borderTop: "1px solid rgba(100, 116, 139, 0.15)", marginTop: "16px" }}>
									<div className="flex items-baseline justify-between text-[11px] font-medium text-kumo-subtle" style={{ marginBottom: "6px" }}>
										<span>{copy.totalEntities}: <span className="font-bold text-kumo-default">{catData.total}</span></span>
										<span>{copy.verifiedEntities}: <span className="font-bold text-emerald-600 dark:text-emerald-400">{catData.verified} ({verifiedPercent}%)</span></span>
									</div>
									<div className="h-1.5 w-full bg-kumo-tint rounded-full overflow-hidden" style={{ marginTop: "6px" }}>
										<div
											className="h-full rounded-full transition-all duration-500"
											style={{ width: `${verifiedPercent}%`, backgroundColor: cardColor }}
										/>
									</div>
								</div>
							</div>
							<LinkButton
								href={card.href}
								variant="secondary"
								size="sm"
								className="w-full justify-center text-xs font-semibold"
								style={{ marginTop: "20px", padding: "6px 12px" }}
							>
								{copy.openModule}
							</LinkButton>
						</section>
					);
				})}
			</div>

			{/* Stats Chart */}
			<div className="mb-6">
				<SikesraStatsChart categories={chartCategories} isReferenceData={isUsingReferenceData} />
			</div>

			{/* Recent Audit Events - Premium Timeline Style */}
			<div className="mb-6">
				<Card title={copy.recentAuditEvents} description={copy.recentAuditEventsDescription}>
					{summary.recentEvents.length === 0 ? (
						<EmptyState title={copy.noRecentEvents} description={copy.noRecentEventsDescription} />
					) : (
						<div
							className="relative border-l border-kumo-line/60"
							style={{
								paddingLeft: "24px",
								marginLeft: "12px",
								display: "flex",
								flexDirection: "column",
								gap: "16px",
								paddingTop: "8px",
								paddingBottom: "8px",
							}}
						>
							{summary.recentEvents.slice(0, 6).map((item) => {
								const kindColors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
									create: { bg: "rgba(37, 99, 235, 0.08)", text: "#2563eb", border: "1px solid rgba(37, 99, 235, 0.2)", dot: "#2563eb" },
									update: { bg: "rgba(147, 51, 234, 0.08)", text: "#9333ea", border: "1px solid rgba(147, 51, 234, 0.2)", dot: "#9333ea" },
									delete: { bg: "rgba(220, 38, 38, 0.08)", text: "#dc2626", border: "1px solid rgba(220, 38, 38, 0.2)", dot: "#dc2626" },
									verify: { bg: "rgba(5, 150, 105, 0.08)", text: "#059669", border: "1px solid rgba(5, 150, 105, 0.2)", dot: "#059669" },
								};
								const colors = kindColors[item.kind.toLowerCase()] || { bg: "rgba(100, 116, 139, 0.08)", text: "var(--kumo-default)", border: "1px solid rgba(100, 116, 139, 0.2)", dot: "#64748b" };

								return (
									<div className="relative group" key={item.id}>
										{/* Timeline marker */}
										<div
											className="absolute flex items-center justify-center"
											style={{
												left: "-33px",
												top: "6px",
											}}
										>
											<div className="h-4 w-4 rounded-full border border-kumo-line bg-kumo-base flex items-center justify-center transition-all duration-300 group-hover:scale-125">
												<div className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.dot }} />
											</div>
										</div>

										{/* Event Content */}
										<div
											className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-kumo-line bg-kumo-base hover:bg-kumo-tint/[0.2] hover:shadow-sm transition-all duration-200"
											style={{ padding: "16px" }}
										>
											<div className="space-y-1">
												<div className="flex flex-wrap items-center gap-2">
													<span className="text-sm font-semibold text-kumo-default">
														{item.summary}
													</span>
													<span
														className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
														style={{ backgroundColor: colors.bg, color: colors.text, border: colors.border }}
													>
														{item.kind}
													</span>
												</div>
												<div className="text-xs text-kumo-subtle flex items-center gap-1.5 flex-wrap">
													<span className="font-semibold text-kumo-default">{item.actor}</span>
													<span>•</span>
													<span className="font-mono">{formatDateTime(item.timestamp, i18n.locale)}</span>
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</Card>
			</div>

			{/* Collapsible Settings Section */}
			<div className="rounded-2xl border border-kumo-line bg-kumo-base text-kumo-default shadow-sm overflow-hidden mt-6">
				<button
					type="button"
					onClick={() => setSettingsOpen(!settingsOpen)}
					className="w-full flex items-center justify-between px-6 py-5 bg-kumo-tint/30 hover:bg-kumo-tint/50 transition-all border-b border-kumo-line"
				>
					<div className="flex items-center gap-3">
						<span className="text-xl">⚙️</span>
						<div className="text-left">
							<h2 className="text-sm font-bold text-kumo-default">{copy.settingsAndConfiguration}</h2>
							<p className="text-xs text-kumo-subtle mt-0.5">
								{copy.pluginConfigurationDescription}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Badge variant="outline" className="text-xs">
							{summary.settings.governanceMode}
						</Badge>
						<span className={cx("text-kumo-subtle transition-transform duration-300 transform", settingsOpen ? "rotate-180" : "rotate-0")}>
							▼
						</span>
					</div>
				</button>

				{settingsOpen && (
					<div className="bg-kumo-base/50" style={{ padding: "24px" }}>
						<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
							<div className="space-y-4">
								<form className="space-y-4" onSubmit={(event) => void saveSettings(event)}>
									<Field label={copy.publicStatusLabel} hint={copy.publicStatusLabelHint}>
										<Input
											value={formState.publicStatusLabel}
											onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
												setFormState((current) => ({ ...current, publicStatusLabel: event.target.value }))
											}
										/>
									</Field>

									<div className="grid gap-4 md:grid-cols-2">
										<Field label={copy.auditRetentionDays} hint={copy.auditRetentionDaysHint}>
											<input
												type="number"
												min="1"
												className="w-full rounded border border-kumo-line bg-kumo-base px-3 py-2 text-kumo-default"
												value={formState.auditRetentionDays}
												onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
													setFormState((current) => ({
														...current,
														auditRetentionDays: event.target.value,
													}))
												}
											/>
										</Field>

										<Field label={copy.governanceMode} hint={copy.governanceModeHint}>
											<Select
												value={formState.governanceMode}
												onValueChange={(value) =>
													setFormState((current) => ({
														...current,
														governanceMode: (value as GovernanceMode | null) ?? "review",
													}))
												}
											>
												<Select.Option value="observe">{copy.observe}</Select.Option>
												<Select.Option value="review">{copy.review}</Select.Option>
												<Select.Option value="enforce-demo">{copy.enforceDemo}</Select.Option>
											</Select>
										</Field>
									</div>

									<div className="grid gap-4 md:grid-cols-2">
										<Field label={copy.smallCellThreshold} hint={copy.smallCellThresholdHint}>
											<input
												type="number"
												min="1"
												className="w-full rounded border border-kumo-line bg-kumo-base px-3 py-2 text-kumo-default"
												value={formState.smallCellThreshold}
												onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
													setFormState((current) => ({
														...current,
														smallCellThreshold: event.target.value,
													}))
												}
											/>
										</Field>

										<Field label={copy.sikesraPublicEnabled} hint={copy.sikesraPublicEnabledHint}>
											<Select
												value={formState.sikesraPublicEnabled ? "true" : "false"}
												onValueChange={(value) =>
													setFormState((current) => ({
														...current,
														sikesraPublicEnabled: value === "true",
													}))
												}
											>
												<Select.Option value="true">{copy.enabled}</Select.Option>
												<Select.Option value="false">{copy.disabled}</Select.Option>
											</Select>
										</Field>
									</div>

									<Field label={copy.metadataCanonicalBase} hint={copy.metadataCanonicalBaseHint}>
										<Input
											value={formState.metadataCanonicalBase}
											onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
												setFormState((current) => ({
													...current,
													metadataCanonicalBase: event.target.value,
												}))
											}
										/>
									</Field>

									<div className="flex items-center gap-3 pt-2">
										<Button variant="primary" disabled={saving} type="submit">
											{saving ? copy.saving : copy.saveSettings}
										</Button>
										<span className="text-xs text-kumo-subtle">
											{copy.modeLabel(summary.settings.governanceMode)}
										</span>
									</div>
								</form>
							</div>

							<div className="space-y-4">
								<div
									className="rounded-xl border border-kumo-line/50"
									style={{
										padding: "16px",
										backgroundColor: "var(--kumo-tint, rgba(100, 116, 139, 0.05))",
									}}
								>
									<h3 className="text-xs font-bold text-kumo-default uppercase tracking-wider mb-3">
										{copy.currentStatus}
									</h3>
									<KeyValueList
										items={[
											[copy.statusLabel, summary.settings.publicStatusLabel || copy.notSet],
											[copy.retention, copy.retentionDays(summary.settings.auditRetentionDays)],
											[copy.governance, <Pill key="governance" tone="neutral">{summary.settings.governanceMode}</Pill>],
											[copy.canonicalBase, summary.settings.metadataCanonicalBase || copy.notSet],
											[copy.smallCellThreshold, String(summary.settings.smallCellThreshold ?? 3)],
											[
												copy.sikesraPublicEnabled,
												summary.settings.sikesraPublicEnabled !== false ? copy.enabled : copy.disabled,
											],
										]}
									/>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</PageShell>
	);
}

function resolveRegionNames(
	region: { provinceCode: string; regencyCode: string; districtCode: string; villageCode: string },
	regions: AdministrativeProvince[],
) {
	const prov = regions.find((p) => p.code === region.provinceCode);
	const reg = prov?.regencies?.find((r) => r.code === region.regencyCode);
	const dist = reg?.districts?.find((d) => d.code === region.districtCode);
	const vill = dist?.villages?.find((v) => v.code === region.villageCode);

	return {
		provinceName: prov ? prov.name : region.provinceCode,
		regencyName: reg ? reg.name : region.regencyCode,
		districtName: dist ? dist.name : region.districtCode,
		villageName: vill ? vill.name : region.villageCode,
	};
}

function resolveVerificationLevelLabel(
	level: string | null | undefined,
	copy: ReturnType<typeof getExampleAdminCopy>,
) {
	if (level === "desa_kelurahan") return copy.villageLevel;
	if (level === "kecamatan") return copy.districtLevel;
	if (level === "sopd") return copy.sopdLevel;
	if (level === "kabupaten_admin") return copy.regencyAdminLevel;
	if (level === "tampil") return copy.publishedLevel;
	return level ?? copy.notSet;
}

function getVerifierLevelOptions(level: string | null | undefined) {
	if (level === "desa_kelurahan") return ["desa_kelurahan"];
	if (level === "kecamatan") return ["kecamatan"];
	if (level === "sopd") return ["sopd"];
	if (level === "kabupaten_admin") return ["kabupaten", "admin_sikesra"];
	return [];
}

function resolveVerifierUserLevelLabel(
	level: string | null | undefined,
	copy: ReturnType<typeof getExampleAdminCopy>,
) {
	if (level === "desa_kelurahan") return copy.villageLevel;
	if (level === "kecamatan") return copy.districtLevel;
	if (level === "sopd") return copy.sopdLevel;
	if (level === "kabupaten") return copy.regencyLevel;
	if (level === "admin_sikesra") return copy.sikesraAdminLevel;
	return level ?? copy.notSet;
}

function inferVerifierLevelFromActor(actor: string) {
	if (actor.includes("village")) return "desa_kelurahan";
	if (actor.includes("district")) return "kecamatan";
	if (actor.includes("sopd")) return "sopd";
	if (actor.includes("regency")) return "kabupaten";
	if (actor.includes("sikesra-admin") || actor.includes("sikesra_admin")) return "admin_sikesra";
	return null;
}

function resolveDataTypeNames(code: string, dataTypes: SikesraParentType[]) {
	if (!code || code.length < 14) return { parentLabel: "Unknown", subLabel: "Unknown" };
	const parentCode = code.slice(10, 12);
	const subCode = code.slice(12, 14);

	const parent = dataTypes.find((p) => p.code === parentCode);
	const subtype = parent?.subTypes?.find((s) => s.code === subCode);

	return {
		parentLabel: parent?.label ?? "Unknown",
		subLabel: subtype?.label ?? "Unknown",
	};
}

function RegistryPage() {
	const { i18n } = useLingui();
	const copy = getExampleAdminCopy(i18n.locale);
	const {
		data,
		error,
		loading,
		reload,
	} = usePluginData<{ items: SikesraReferenceRegistryEntity[] }>("registry/list");
	const { data: regionsData, loading: loadingRegions } =
		usePluginData<AdministrativeProvince[]>("regions/get");
	const { data: dataTypesData, loading: loadingDataTypes } =
		usePluginData<SikesraParentType[]>("data-types/get");
	const [step, setStep] = React.useState(0);
	const [submitting, setSubmitting] = React.useState(false);
	const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
	const [errMsg, setErrMsg] = React.useState<string | null>(null);
	const [activeSubTab, setActiveSubTab] = React.useState<"queue" | "intake">("queue");

	// Temp document form states
	const [tempDocTitle, setTempDocTitle] = React.useState("");
	const [tempDocType, setTempDocType] = React.useState("surat_keterangan");
	const [tempDocSensitivity, setTempDocSensitivity] =
		React.useState<SikesraSensitivity>("public_safe");
	const [tempDocFile, setTempDocFile] = React.useState<string | null>(null);
	const nextDocumentIndexRef = React.useRef(1);

	// 11-step wizard state
	const [wizardState, setWizardState] = React.useState({
		entityType: "rumah_ibadah",
		subTypeCode: "01",
		subtype: "Masjid",
		provinceCode: "62",
		regencyCode: "6201",
		districtCode: "620102",
		villageCode: "6201021009",
		rt: "001",
		rw: "001",
		address: "Jl. Merdeka No. 12",
		label: "Rumah Ibadah Al-Barokah",
		description: "Pusat kegiatan keagamaan",
		religion: "Islam",
		desil: "3",
		moduleDetails: "Kapasitas Jamaah: 200 Orang",
		caregiverName: "H. Ahmad",
		caregiverPhone: "081234567890",
		documents: [] as Array<{
			id: string;
			title: string;
			documentType: string;
			sensitivity: SikesraSensitivity;
		}>,
		isValidated: false,
		code: "", // SIKESRA ID
		sensitivity: "public_safe" as SikesraSensitivity,
		inputLevel: "desa_kelurahan" as SikesraUserLevel,
	});

	React.useEffect(() => {
		if (regionsData && regionsData.length > 0) {
			const prov = regionsData[0];
			const reg = prov?.regencies?.[0];
			const dist = reg?.districts?.[0];
			const vill = dist?.villages?.[0];

			const activeTypes = dataTypesData ?? DEFAULT_DATA_TYPES;
			const defaultParent = activeTypes[0];
			const defaultSub = defaultParent?.subTypes?.[0];

			setWizardState((prev) => ({
				...prev,
				provinceCode: prov?.code ?? "62",
				regencyCode: reg?.code ?? "6201",
				districtCode: dist?.code ?? "620102",
				villageCode: vill?.code ?? "6201021009",
				entityType: defaultParent?.id ?? "rumah_ibadah",
				subTypeCode: defaultSub?.code ?? "01",
				subtype: defaultSub?.label ?? "Masjid",
			}));
		}
	}, [regionsData, dataTypesData]);

	const [filterType, setFilterType] = React.useState<string>("all");
	const [searchQuery, setSearchQuery] = React.useState<string>("");

	const isUsingFixtures = data === null && Boolean(error);
	const registryEntities = isUsingFixtures
		? SIKESRA_REFERENCE_FIXTURES.registryEntities
		: (data?.items ?? []);

	const filteredEntities = registryEntities.filter((entity) => {
		const matchesType = filterType === "all" || entity.entityType === filterType;
		const matchesSearch =
			entity.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
			entity.code.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesType && matchesSearch;
	});

	const verifiedCount = registryEntities.filter(
		(entity) => entity.verificationStage === "active_verified",
	).length;
	const restrictedCount = registryEntities.filter(
		(entity) => entity.sensitivity !== "public_safe",
	).length;

	const runValidationCheck = () => {
		if (!wizardState.label || !wizardState.villageCode || !wizardState.entityType) {
			setErrMsg(copy.identityRegionDataTypeRequired);
			return;
		}
		if (!wizardState.provinceCode || !wizardState.regencyCode || !wizardState.districtCode) {
			setErrMsg(copy.completeRegionScopeRequired);
			return;
		}
		if (!wizardState.subTypeCode) {
			setErrMsg(copy.subtypeRequired);
			return;
		}
		setWizardState((prev) => ({ ...prev, isValidated: true }));
		setSuccessMsg(copy.localCompletenessPassed);
		setErrMsg(null);
	};

	const generateSikesraId = () => {
		const activeTypes = dataTypesData ?? DEFAULT_DATA_TYPES;
		const parentType = activeTypes.find((p) => p.id === wizardState.entityType);
		const jenis = parentType?.code ?? "00";
		const subjenis = wizardState.subTypeCode || "01";
		const compiledId = `DRAFT-${wizardState.villageCode || "REGION"}-${jenis}${subjenis}`;

		setWizardState((prev) => ({ ...prev, code: compiledId }));
		setSuccessMsg(copy.preparedDraftRegistryCode(compiledId));
	};

	const handleWizardSubmit = async () => {
		if (!wizardState.isValidated) {
			setErrMsg(copy.runCompletenessBeforeSubmit);
			return;
		}
		if (!wizardState.code) {
			setErrMsg(copy.prepareDraftRegistryCodeFirst);
			return;
		}
		setSubmitting(true);
		setErrMsg(null);
		setSuccessMsg(null);
		try {
			const activeTypes = dataTypesData ?? DEFAULT_DATA_TYPES;
			const parentType = activeTypes.find((item) => item.id === wizardState.entityType);
			const registryPayload = {
				code: wizardState.code,
				label: wizardState.label,
				entityType: wizardState.entityType,
				subtypeCode: wizardState.subTypeCode,
				sensitivity: wizardState.sensitivity,
				provinceCode: wizardState.provinceCode,
				regencyCode: wizardState.regencyCode,
				districtCode: wizardState.districtCode,
				villageCode: wizardState.villageCode,
				publicSummary:
					wizardState.sensitivity === "public_safe"
						? copy.publicSafePendingSummary(wizardState.label, wizardState.subtype || "-")
						: copy.suppressedUntilPrivacyReview,
				inputLevel: wizardState.inputLevel,
				fields: {
					typeCode: parentType?.code ?? "99",
					subtypeCode: wizardState.subTypeCode,
					subtype: wizardState.subtype,
					address: wizardState.address,
					rt: wizardState.rt,
					rw: wizardState.rw,
					religion: wizardState.religion,
					desil: wizardState.desil,
					caregiverName: wizardState.caregiverName,
				},
			};
			const res = await saveRegistryEntity<{ item: SikesraReferenceRegistryEntity }>(
				registryPayload,
				await createAdminApiRequestOptions(),
			);

			for (const doc of wizardState.documents) {
				await saveDocument(
					{
						registryEntityId: res.item.id,
						title: doc.title,
						documentType: doc.documentType,
						classification: doc.sensitivity,
					},
					await createAdminApiRequestOptions(),
				);
			}

			setSuccessMsg(copy.registrySubmittedToQueue);
			setStep(0);
			setWizardState({
				entityType: "rumah_ibadah",
				subTypeCode: "01",
				subtype: "Masjid",
				provinceCode: regionsData?.[0]?.code ?? "62",
				regencyCode: regionsData?.[0]?.regencies?.[0]?.code ?? "6201",
				districtCode: regionsData?.[0]?.regencies?.[0]?.districts?.[0]?.code ?? "620102",
				villageCode:
					regionsData?.[0]?.regencies?.[0]?.districts?.[0]?.villages?.[0]?.code ?? "6201021009",
				rt: "001",
				rw: "001",
				address: "Jl. Merdeka No. 12",
				label: "Rumah Ibadah Al-Barokah",
				description: "Pusat kegiatan keagamaan",
				religion: "Islam",
				desil: "3",
				moduleDetails: "Kapasitas Jamaah: 200 Orang",
				caregiverName: "H. Ahmad",
				caregiverPhone: "081234567890",
				documents: [],
				isValidated: false,
				code: "",
				sensitivity: "public_safe",
				inputLevel: "desa_kelurahan",
			});
			setTempDocTitle("");
			setTempDocFile(null);
			await reload();
		} catch (err) {
			setErrMsg(err instanceof Error ? err.message : copy.failedToSaveEntity);
		} finally {
			setSubmitting(false);
		}
	};

	const handleProvinceChange = (provinceCode: string) => {
		const activeRegionData = regionsData || [];
		const prov = activeRegionData.find((p) => p.code === provinceCode);
		const reg = prov?.regencies?.[0];
		const dist = reg?.districts?.[0];
		const vill = dist?.villages?.[0];
		setWizardState((prev) => ({
			...prev,
			provinceCode,
			regencyCode: reg?.code ?? "",
			districtCode: dist?.code ?? "",
			villageCode: vill?.code ?? "",
		}));
	};

	const handleRegencyChange = (regencyCode: string) => {
		const activeRegionData = regionsData || [];
		const prov = activeRegionData.find((p) => p.code === wizardState.provinceCode);
		const reg = prov?.regencies?.find((r) => r.code === regencyCode);
		const dist = reg?.districts?.[0];
		const vill = dist?.villages?.[0];
		setWizardState((prev) => ({
			...prev,
			regencyCode,
			districtCode: dist?.code ?? "",
			villageCode: vill?.code ?? "",
		}));
	};

	const handleDistrictChange = (districtCode: string) => {
		const activeRegionData = regionsData || [];
		const prov = activeRegionData.find((p) => p.code === wizardState.provinceCode);
		const reg = prov?.regencies?.find((r) => r.code === wizardState.regencyCode);
		const dist = reg?.districts?.find((d) => d.code === districtCode);
		const vill = dist?.villages?.[0];
		setWizardState((prev) => ({
			...prev,
			districtCode,
			villageCode: vill?.code ?? "",
		}));
	};

	const addDocumentToList = () => {
		if (!tempDocTitle) return;
		const nextDocumentIndex = nextDocumentIndexRef.current++;
		const nextDoc = {
			id: `doc-wizard-${nextDocumentIndex}`,
			title: tempDocTitle,
			documentType: tempDocType,
			sensitivity: tempDocSensitivity,
		};
		setWizardState((prev) => ({
			...prev,
			documents: [...prev.documents, nextDoc],
		}));
		setTempDocTitle("");
		setTempDocFile(null);
	};

	if (loading || loadingRegions || loadingDataTypes)
		return (
			<PageShell>
				<LoadingState label={copy.loadingPluginOverview} />
			</PageShell>
		);

	return (
		<PageShell>
			<PageHeader
				eyebrow={copy.registryEyebrow}
				title={copy.registryTitle}
				description={copy.registryDescription}
			/>

			<div className="grid gap-5 md:grid-cols-3">
				<MetricCard
					label={copy.registryEntities}
					value={registryEntities.length}
					hint={copy.registryEntitiesHint}
					accent="blue"
				/>
				<MetricCard
					label={copy.verifiedRecords}
					value={verifiedCount}
					hint={copy.verifiedRecordsHint}
					accent="emerald"
				/>
				<MetricCard
					label={copy.restrictedEntries}
					value={restrictedCount}
					hint={copy.restrictedEntriesHint}
					accent="purple"
				/>
			</div>

			<div className="mb-6 flex gap-2 border-b border-kumo-line/80 mt-5 pb-px">
				<button
					type="button"
					className={cx(
						"px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-all duration-200 flex items-center gap-2",
						activeSubTab === "queue"
							? "border-kumo-brand text-kumo-brand font-bold"
							: "border-transparent text-kumo-subtle hover:text-kumo-default hover:border-kumo-line",
					)}
					onClick={() => setActiveSubTab("queue")}
				>
					<span>📋</span> {copy.registryQueue}
				</button>
				<button
					type="button"
					className={cx(
						"px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-all duration-200 flex items-center gap-2",
						activeSubTab === "intake"
							? "border-kumo-brand text-kumo-brand font-bold"
							: "border-transparent text-kumo-subtle hover:text-kumo-default hover:border-kumo-line",
					)}
					onClick={() => setActiveSubTab("intake")}
				>
					<span>⚡</span> {copy.progressiveInputWizard}
				</button>
			</div>

			<div className="grid gap-6">
					{activeSubTab === "queue" && (
					<Card title={copy.registryQueue} description={copy.registryQueueDescription}>
						{isUsingFixtures && (
							<div className="mb-4">
								<Feedback message={copy.showingReferenceFixturesMessage} tone="info" />
							</div>
						)}
						<div className="mb-4 flex flex-col gap-3 sm:flex-row">
							<div className="flex-1">
								<Input
									placeholder={copy.searchEntityNameOrCode}
									value={searchQuery}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										setSearchQuery(e.target.value)
									}
								/>
							</div>
							<div className="w-48">
								<Select value={filterType} onValueChange={(val) => setFilterType(val ?? "all")}>
									<Select.Option value="all">{copy.allTypes}</Select.Option>
									<Select.Option value="rumah_ibadah">Rumah Ibadah</Select.Option>
									<Select.Option value="lembaga_keagamaan">Lembaga Keagamaan</Select.Option>
									<Select.Option value="pendidikan_keagamaan">Pendidikan Keagamaan</Select.Option>
									<Select.Option value="lks">Lembaga Kesejahteraan Sosial</Select.Option>
									<Select.Option value="guru_agama">Guru Agama</Select.Option>
									<Select.Option value="anak_yatim">Anak Yatim</Select.Option>
									<Select.Option value="disabilitas">Disabilitas</Select.Option>
									<Select.Option value="lansia_terlantar">Lansia Terlantar</Select.Option>
								</Select>
							</div>
						</div>

						<div className="overflow-hidden rounded-xl border border-kumo-line bg-kumo-base text-kumo-default">
							<div
								className="grid grid-cols-[1.1fr_.8fr_.9fr_.9fr] gap-4 border-b border-kumo-line bg-kumo-tint/50 px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-kumo-subtle max-md:hidden"
								style={{ padding: "14px 24px" }}
							>
								<div>{copy.entity}</div>
								<div>{copy.region}</div>
								<div>{copy.sensitivity}</div>
								<div>{copy.stage}</div>
							</div>
							{filteredEntities.length === 0 ? (
								<div className="p-8 text-center text-sm text-kumo-subtle italic" style={{ padding: "32px" }}>
									{registryEntities.length === 0
										? copy.registryNoEntitiesYet
										: copy.registryNoEntitiesMatch}
								</div>
							) : (
								filteredEntities.map((entity) => {
									const names = resolveRegionNames(entity.region, regionsData || []);
									const activeDataTypes = dataTypesData ?? DEFAULT_DATA_TYPES;
									const resolvedTypeNames = resolveDataTypeNames(entity.code, activeDataTypes);
									return (
										<div
											className="grid gap-4 border-t border-kumo-line px-6 py-5 text-sm md:grid-cols-[1.1fr_.8fr_.9fr_.9fr] hover:bg-kumo-tint/15 transition-all"
											style={{ padding: "20px 24px" }}
											key={entity.id}
										>
											<div className="flex items-start gap-3">
												<span className="text-xl shrink-0 mt-0.5" title={entity.entityType}>
													{getEntityIcon(entity.entityType)}
												</span>
												<div className="space-y-1">
													<div className="font-semibold text-kumo-default">{entity.label}</div>
													<div className="break-all text-xs text-kumo-brand font-mono font-bold">
												{entity.code || copy.pendingRegistryCode}
													</div>
													<div className="text-xs text-kumo-subtle capitalize">
														{resolvedTypeNames.parentLabel} • {resolvedTypeNames.subLabel}
													</div>
													<div className="mt-3 text-xs text-kumo-subtle leading-relaxed bg-kumo-tint/40 p-3 rounded-xl border border-kumo-line/50">
														{entity.publicSummary}
													</div>
												</div>
											</div>
											<div className="text-kumo-subtle leading-relaxed space-y-1">
												<span className="font-bold text-[10px] uppercase tracking-wide block text-kumo-subtle/80 mb-0.5">
													{copy.regionScopeLabel}:
												</span>
												<div className="font-medium text-kumo-default text-xs">
													{names.provinceName} • {names.regencyName}
												</div>
												<div className="font-semibold text-kumo-brand text-xs">
													{names.districtName} • {names.villageName}
												</div>
												<div className="pt-1 font-mono text-[9px] opacity-60">
													({entity.region.provinceCode}/{entity.region.regencyCode}/
													{entity.region.districtCode}/{entity.region.villageCode})
												</div>
											</div>
											<div className="flex items-start">
												<Pill
													tone={
														entity.sensitivity === "public_safe"
															? "success"
															: entity.sensitivity === "restricted"
																? "warning"
																: "danger"
													}
												>
													{entity.sensitivity}
												</Pill>
											</div>
											<div className="flex items-start">
												<Badge
													variant={
														entity.verificationStage === "active_verified" ? "success" : "warning"
													}
												>
													{entity.verificationStage}
												</Badge>
											</div>
										</div>
									);
								})
							)}
						</div>
					</Card>
				)}

				{activeSubTab === "intake" && (
					<Card
						title={copy.progressiveInputWizard}
						description={copy.progressiveInputWizardDescription}
					>
						<div className="space-y-4">
							<Feedback message={successMsg} tone="success" />
							<Feedback message={errMsg} tone="danger" />

							<div className="flex flex-col gap-6">
								{/* Horizontal Stepper Progress Track */}
								<div className="w-full overflow-x-auto pb-4 mb-2 flex items-center justify-between gap-2 border-b border-kumo-line/40 select-none">
									<div className="flex items-center min-w-max w-full px-2 justify-between relative" style={{ minWidth: "900px" }}>
										{/* Background connecting track line */}
										<div className="absolute top-[18px] left-[5%] right-[5%] h-0.5 bg-kumo-line z-0" />
										
										{copy.registrySteps.map((label, index) => {
											const isActive = index === step;
											const isCompleted = index < step;
											return (
												<button
													key={label}
													onClick={() => setStep(index)}
													type="button"
													className="relative z-10 flex flex-col items-center group focus:outline-none"
													style={{ width: "80px" }}
												>
													<span
														className={cx(
															"flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold border transition-all duration-300",
															isActive ? "scale-110 shadow-md ring-4 ring-blue-500/25" : "",
														)}
														style={
															isActive
																? { backgroundColor: "#2563eb", borderColor: "#2563eb", color: "#ffffff" }
																: isCompleted
																	? { backgroundColor: "#10b981", borderColor: "#10b981", color: "#ffffff" }
																	: { backgroundColor: "var(--kumo-base, #ffffff)", borderColor: "var(--kumo-line, #e2e8f0)", color: "var(--kumo-subtle, #64748b)" }
														}
													>
														{isCompleted ? "✓" : index + 1}
													</span>
													<span
														className={cx(
															"mt-2 text-[10px] font-medium transition-all duration-200 text-center break-words w-full px-1",
															isActive
																? "text-kumo-brand font-bold"
																: isCompleted
																	? "text-emerald-600 dark:text-emerald-400"
																	: "text-kumo-subtle group-hover:text-kumo-default",
														)}
														style={
															isActive
																? { color: "#2563eb" }
																: isCompleted
																	? { color: "#10b981" }
																	: undefined
														}
													>
														{label}
													</span>
												</button>
											);
										})}
									</div>
								</div>

								{/* Right Form Content */}
								<div className="w-full min-w-0">
									<div className="rounded-2xl border border-kumo-line bg-kumo-base p-6 shadow-sm">
										<div className="text-sm font-bold text-kumo-default border-b border-kumo-line/60 pb-3 mb-5 flex items-center justify-between">
											<span>
												Step {step + 1}: {copy.registrySteps[step]}
											</span>
											<span className="text-[10px] px-2 py-0.5 rounded-full bg-kumo-tint text-kumo-subtle font-mono">
												{Math.round(((step + 1) / copy.registrySteps.length) * 100)}%
											</span>
										</div>

										<div className="space-y-5">
											{step === 0 && (
												<>
													<Field
														label="Jenis Data Induk"
														hint="Pilih Jenis Data Induk SIKESRA (Wajib)"
													>
														<Select
															value={wizardState.entityType}
															onValueChange={(val) => {
																const type = val ?? "rumah_ibadah";
																const activeTypes = dataTypesData ?? DEFAULT_DATA_TYPES;
																const parent = activeTypes.find((p) => p.id === type);
																const defaultSub = parent?.subTypes?.[0];
																setWizardState((prev) => ({
																	...prev,
																	entityType: type,
																	subTypeCode: defaultSub?.code ?? "01",
																	subtype: defaultSub?.label ?? "Lainnya",
																}));
															}}
														>
															{(dataTypesData ?? DEFAULT_DATA_TYPES).map((p) => (
																<Select.Option value={p.id} key={p.id}>
																	{p.label} ({p.code})
																</Select.Option>
															))}
														</Select>
													</Field>
													<Field label="Sub Jenis Data" hint="Pilih Sub Jenis Data SIKESRA (Wajib)">
														<Select
															value={wizardState.subTypeCode}
															onValueChange={(val) => {
																const code = val ?? "01";
																const activeTypes = dataTypesData ?? DEFAULT_DATA_TYPES;
																const parent = activeTypes.find(
																	(p) => p.id === wizardState.entityType,
																);
																const label =
																	parent?.subTypes?.find((s) => s.code === code)?.label ??
																	"Lainnya";
																setWizardState((prev) => ({
																	...prev,
																	subTypeCode: code,
																	subtype: label,
																}));
															}}
														>
															{(
																(dataTypesData ?? DEFAULT_DATA_TYPES).find(
																	(p) => p.id === wizardState.entityType,
																)?.subTypes || []
															).map((sub) => (
																<Select.Option value={sub.code} key={sub.code}>
																	{sub.label} ({sub.code})
																</Select.Option>
															))}
														</Select>
													</Field>
													<Field
														label="Sensitivity classification"
														hint="Determine visibility of this entity records (Mandatory)"
													>
														<Select
															value={wizardState.sensitivity}
															onValueChange={(val) =>
																setWizardState((prev) => ({
																	...prev,
																	sensitivity: (val as SikesraSensitivity) ?? "public_safe",
																}))
															}
														>
															<Select.Option value="public_safe">Public Safe</Select.Option>
															<Select.Option value="internal">Internal</Select.Option>
															<Select.Option value="restricted">Restricted</Select.Option>
															<Select.Option value="highly_restricted">
																Highly Restricted
															</Select.Option>
														</Select>
													</Field>
													<Field label={copy.inputLevel} hint={copy.verificationInputPolicy}>
														<Select
															value={wizardState.inputLevel}
															onValueChange={(val) =>
																setWizardState((prev) => ({
																	...prev,
																	inputLevel: (val as SikesraUserLevel) ?? "desa_kelurahan",
																}))
															}
														>
															<Select.Option value="desa_kelurahan">
																{copy.villageLevel}
															</Select.Option>
															<Select.Option value="kecamatan">{copy.districtLevel}</Select.Option>
															<Select.Option value="sopd">{copy.sopdLevel}</Select.Option>
															<Select.Option value="kabupaten">{copy.regencyLevel}</Select.Option>
															<Select.Option value="admin_sikesra">
																{copy.sikesraAdminLevel}
															</Select.Option>
														</Select>
													</Field>
												</>
											)}

											{step === 1 && (
												<>
													<div className="grid gap-3 grid-cols-2">
														<Field label="Province" hint="Cascading lookup selector">
															<Select
																value={wizardState.provinceCode}
																onValueChange={(val) => {
																	if (val) handleProvinceChange(val);
																}}
															>
																{(regionsData || []).map((p) => (
																	<Select.Option value={p.code} key={p.code}>
																		{p.name}
																	</Select.Option>
																))}
															</Select>
														</Field>
														<Field label="Regency / City" hint="Filtered by Province">
															<Select
																value={wizardState.regencyCode}
																onValueChange={(val) => {
																	if (val) handleRegencyChange(val);
																}}
															>
																{(regionsData || [])
																	.find((p) => p.code === wizardState.provinceCode)
																	?.regencies?.map((r) => (
																		<Select.Option value={r.code} key={r.code}>
																			{r.name}
																		</Select.Option>
																	)) ?? (
																	<Select.Option value="">-- Select Regency --</Select.Option>
																)}
															</Select>
														</Field>
													</div>
													<div className="grid gap-3 grid-cols-2">
														<Field label="District (Kecamatan)" hint="Filtered by Regency">
															<Select
																value={wizardState.districtCode}
																onValueChange={(val) => {
																	if (val) handleDistrictChange(val);
																}}
															>
																{(regionsData || [])
																	.find((p) => p.code === wizardState.provinceCode)
																	?.regencies?.find((r) => r.code === wizardState.regencyCode)
																	?.districts?.map((d) => (
																		<Select.Option value={d.code} key={d.code}>
																			{d.name}
																		</Select.Option>
																	)) ?? (
																	<Select.Option value="">-- Select District --</Select.Option>
																)}
															</Select>
														</Field>
														<Field label="Village (Desa / Kelurahan)" hint="Filtered by District">
															<Select
																value={wizardState.villageCode}
																onValueChange={(val) =>
																	setWizardState((prev) => ({ ...prev, villageCode: val ?? "" }))
																}
															>
																{(regionsData || [])
																	.find((p) => p.code === wizardState.provinceCode)
																	?.regencies?.find((r) => r.code === wizardState.regencyCode)
																	?.districts?.find((d) => d.code === wizardState.districtCode)
																	?.villages?.map((v) => (
																		<Select.Option value={v.code} key={v.code}>
																			{v.name}
																		</Select.Option>
																	)) ?? (
																	<Select.Option value="">-- Select Village --</Select.Option>
																)}
															</Select>
														</Field>
													</div>
												</>
											)}

											{step === 2 && (
												<>
													<div className="grid gap-3 grid-cols-2">
														<Field label="RT" hint="Optional (e.g. 001)">
															<Input
																value={wizardState.rt}
																onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
																	setWizardState((prev) => ({ ...prev, rt: e.target.value }))
																}
															/>
														</Field>
														<Field label="RW" hint="Optional (e.g. 002)">
															<Input
																value={wizardState.rw}
																onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
																	setWizardState((prev) => ({ ...prev, rw: e.target.value }))
																}
															/>
														</Field>
													</div>
													<Field
														label="Specific Local Address"
														hint="Optional specific street details"
													>
														<Input
															value={wizardState.address}
															onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
																setWizardState((prev) => ({ ...prev, address: e.target.value }))
															}
														/>
													</Field>
												</>
											)}

											{step === 3 && (
												<>
													<Field
														label="Identity Name / Label"
														hint="Human-readable name (Mandatory)"
													>
														<Input
															value={wizardState.label}
															onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
																setWizardState((prev) => ({ ...prev, label: e.target.value }))
															}
															placeholder="e.g. Rumah Ibadah Al-Barokah"
														/>
													</Field>
													<Field label="Brief Description" hint="Optional summary details">
														<Input
															value={wizardState.description}
															onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
																setWizardState((prev) => ({ ...prev, description: e.target.value }))
															}
														/>
													</Field>
												</>
											)}

											{step === 4 && (
												<>
													<Field label="Religion Connection" hint="Optional attribute connection">
														<Select
															value={wizardState.religion}
															onValueChange={(val) =>
																setWizardState((prev) => ({ ...prev, religion: val ?? "" }))
															}
														>
															<Select.Option value="">Tidak diisi (Opsional)</Select.Option>
															<Select.Option value="Islam">Islam</Select.Option>
															<Select.Option value="Kristen">Kristen</Select.Option>
															<Select.Option value="Katolik">Katolik</Select.Option>
															<Select.Option value="Hindu">Hindu</Select.Option>
															<Select.Option value="Buddha">Buddha</Select.Option>
															<Select.Option value="Khonghucu">Khonghucu</Select.Option>
														</Select>
													</Field>
													<Field
														label="Social Desil Status (1-10)"
														hint="Optional socio-economic classification"
													>
														<Select
															value={wizardState.desil}
															onValueChange={(val) =>
																setWizardState((prev) => ({ ...prev, desil: val ?? "" }))
															}
														>
															<Select.Option value="">Tidak diisi (Opsional)</Select.Option>
															{Array.from(Array(10), (_, i) => (
																<Select.Option value={String(i + 1)} key={i}>
																	Desil {i + 1}
																</Select.Option>
															))}
														</Select>
													</Field>
												</>
											)}

											{step === 5 && (
												<Field
													label="Module specific data details"
													hint="Additional parameters unique to the module type (Optional)"
												>
													<InputArea
														value={wizardState.moduleDetails}
														onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
															setWizardState((prev) => ({ ...prev, moduleDetails: e.target.value }))
														}
													/>
												</Field>
											)}

											{step === 6 && (
												<>
													<Field label="Caregiver / PIC Name" hint="Optional contact person">
														<Input
															value={wizardState.caregiverName}
															onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
																setWizardState((prev) => ({
																	...prev,
																	caregiverName: e.target.value,
																}))
															}
														/>
													</Field>
													<Field label="Caregiver Phone Number" hint="Optional phone number">
														<Input
															value={wizardState.caregiverPhone}
															onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
																setWizardState((prev) => ({
																	...prev,
																	caregiverPhone: e.target.value,
																}))
															}
														/>
													</Field>
												</>
											)}

											{step === 7 && (
												<div className="space-y-4">
													<div className="rounded-xl border border-kumo-line bg-kumo-tint/10 p-4">
														<div className="text-xs font-semibold mb-3 text-kumo-default flex items-center justify-between">
															<span>Attached Documents ({wizardState.documents.length})</span>
															{wizardState.documents.length === 0 && (
																<span className="text-kumo-danger text-[10px] font-bold uppercase">
																	No documents attached (Optional)
																</span>
															)}
														</div>
														{wizardState.documents.length > 0 ? (
															<div className="space-y-2">
																{wizardState.documents.map((doc) => (
																	<div
																		className="flex items-center justify-between text-xs bg-kumo-base border border-kumo-line rounded-lg px-3 py-2 font-medium text-kumo-default shadow-sm"
																		key={doc.id}
																	>
																		<div className="flex items-center gap-2">
																			<span className="text-sm">📁</span>
																			<div>
																				<strong>{doc.title}</strong>
																				<span className="ml-1 text-[10px] text-kumo-brand bg-kumo-tint px-1.5 py-0.5 rounded font-mono uppercase">
																					{doc.documentType}
																				</span>
																				<span className="ml-1 text-[10px] text-kumo-subtle">
																					({doc.sensitivity})
																				</span>
																			</div>
																		</div>
																		<Button
																			variant="secondary"
																			size="xs"
																			onClick={() =>
																				setWizardState((prev) => ({
																					...prev,
																					documents: prev.documents.filter((d) => d.id !== doc.id),
																				}))
																			}
																		>
																			Remove
																		</Button>
																	</div>
																))}
															</div>
														) : (
															<div className="text-xs text-kumo-subtle italic text-center py-4">
																No documents added yet. Use the form below to attach files.
															</div>
														)}
													</div>

													<div className="rounded-xl border border-kumo-line bg-kumo-base p-4 space-y-3">
														<div className="text-xs font-bold text-kumo-default uppercase tracking-wider">
															Add New Document
														</div>
														<Field label="Supporting Document Title">
															<Input
																value={tempDocTitle}
																onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
																	setTempDocTitle(e.target.value)
																}
																placeholder="e.g. Surat Keterangan Domisili"
															/>
														</Field>
														<div className="grid gap-3 grid-cols-2">
															<Field label="Doc Type">
																<Select
																	value={tempDocType}
																	onValueChange={(val) => setTempDocType(val ?? "surat_keterangan")}
																>
																	<Select.Option value="surat_keterangan">
																		Surat Keterangan
																	</Select.Option>
																	<Select.Option value="identitas">Identitas Utama</Select.Option>
																	<Select.Option value="sertifikat">Sertifikat Resmi</Select.Option>
																</Select>
															</Field>
															<Field label="Doc Sensitivity">
																<Select
																	value={tempDocSensitivity}
																	onValueChange={(val) =>
																		setTempDocSensitivity(
																			(val as SikesraSensitivity) ?? "public_safe",
																		)
																	}
																>
																	<Select.Option value="public_safe">Public Safe</Select.Option>
																	<Select.Option value="internal">Internal</Select.Option>
																	<Select.Option value="restricted">Restricted</Select.Option>
																	<Select.Option value="highly_restricted">
																		Highly Restricted
																	</Select.Option>
																</Select>
															</Field>
														</div>

														<Field
															label="Select Supporting File"
															hint="Allowed types: PDF, PNG, JPEG. Max Size: 5MB"
														>
															<div className="relative border-2 border-dashed border-kumo-line/80 rounded-xl p-5 bg-kumo-tint/10 hover:bg-kumo-tint/20 hover:border-kumo-brand/50 transition-all flex flex-col items-center justify-center cursor-pointer">
																<input
																	type="file"
																	className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
																	onChange={(e) => {
																		const file = e.target.files?.[0];
																		if (file) {
																			setTempDocFile(file.name);
																			setTempDocTitle(
																				(prev) => prev || file.name.split(".")[0] || "",
																			);
																		}
																	}}
																/>
																<span className="text-xl mb-1.5">📁</span>
																<span className="text-xs font-semibold text-kumo-brand">
																	{tempDocFile ? "Change File" : "Choose File or Drag Here"}
																</span>
															</div>
														</Field>

														{tempDocFile && (
															<div className="text-xs text-kumo-success font-medium flex items-center gap-1.5 bg-kumo-success/5 border border-kumo-success/20 rounded-lg p-2.5">
																<span>✓ Selected file:</span>{" "}
																<span className="font-mono break-all">{tempDocFile}</span>
															</div>
														)}

														<Button
															variant="secondary"
															className="w-full justify-center"
															disabled={!tempDocTitle}
															onClick={addDocumentToList}
														>
															+ Add Document to List
														</Button>
													</div>
												</div>
											)}

											{step === 8 && (
												<div className="rounded-lg border border-dashed border-kumo-line bg-kumo-tint/20 p-4 text-center">
													<p className="text-xs text-kumo-subtle mb-3">
														Checks for formatting compliance and potential duplicate records.
													</p>
													<Button
														variant="secondary"
														size="sm"
														onClick={runValidationCheck}
														type="button"
													>
														Run Validation Check
													</Button>
												</div>
											)}

											{step === 9 && (
												<div className="rounded-lg border border-kumo-line bg-kumo-tint/10 p-4 text-center">
													<p className="text-xs text-kumo-subtle mb-3">
														Prepare a draft registry code for submission. The server generates the
														canonical 20-digit SIKESRA ID from village, type, subtype, and sequence.
													</p>
													<Button
														variant="primary"
														size="sm"
														onClick={generateSikesraId}
														type="button"
													>
														Prepare Draft Registry Code
													</Button>
													{wizardState.code && (
														<div className="mt-3 text-lg font-mono font-bold text-kumo-brand bg-kumo-base p-2 border rounded select-all break-all">
															{wizardState.code}
														</div>
													)}
												</div>
											)}

											{step === 10 && (
												<div className="rounded-lg border border-kumo-line bg-kumo-base p-4 text-xs space-y-2">
													<div className="font-semibold text-sm mb-2 text-kumo-default">
														Summary Intake:
													</div>
													<div className="grid grid-cols-2 gap-2">
														<div>
															<strong>Label:</strong> {wizardState.label}
														</div>
														<div>
															<strong>SIKESRA ID:</strong> {wizardState.code || "NOT GENERATED"}
														</div>
														<div>
															<strong>Type:</strong> {wizardState.entityType} (
															{wizardState.subtype || "-"})
														</div>
														<div>
															<strong>Religion / Desil:</strong>{" "}
															{wizardState.religion || "Tidak diisi"} / Desil{" "}
															{wizardState.desil || "Tidak diisi"}
														</div>
														<div>
															<strong>Official Region:</strong> {wizardState.provinceCode}/
															{wizardState.regencyCode}/{wizardState.districtCode}/
															{wizardState.villageCode}
														</div>
														<div>
															<strong>Local Region:</strong> RT {wizardState.rt || "00"} / RW{" "}
															{wizardState.rw || "00"}, {wizardState.address || "-"}
														</div>
														<div>
															<strong>Caregiver:</strong> {wizardState.caregiverName || "-"} (
															{wizardState.caregiverPhone || "-"})
														</div>
														<div>
															<strong>Attached Documents:</strong> {wizardState.documents.length}{" "}
															File(s)
														</div>
													</div>
													<div className="pt-3 border-t">
														<Button
															variant="primary"
															className="w-full justify-center"
															disabled={submitting}
															onClick={() => void handleWizardSubmit()}
														>
															{submitting ? "Submitting..." : "Submit to Verification Queue"}
														</Button>
													</div>
												</div>
											)}
										</div>

										<div className="mt-8 flex items-center justify-between border-t border-kumo-line pt-5">
											<Button
												variant="secondary"
												size="sm"
												type="button"
												disabled={step === 0}
												onClick={() => setStep((current) => Math.max(0, current - 1))}
											>
												{copy.previous}
											</Button>
											<div className="text-xs text-kumo-subtle font-medium">
												Step {step + 1} of {copy.registrySteps.length}
											</div>
											<Button
												variant="secondary"
												size="sm"
												type="button"
												disabled={step === copy.registrySteps.length - 1}
												onClick={() =>
													setStep((current) => Math.min(copy.registrySteps.length - 1, current + 1))
												}
											>
												{copy.next}
											</Button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card>
				)}
			</div>
		</PageShell>
	);
}

function VerificationPage() {
	const { i18n } = useLingui();
	const copy = getExampleAdminCopy(i18n.locale);
	const { data, error, loading, reload } = usePluginData<VerificationResponse>("verification/list");
	const [actionNotes, setActionNotes] = React.useState<Record<string, string>>({});
	const [verifierLevels, setVerifierLevels] = React.useState<Record<string, string>>({});
	const [submittingId, setSubmittingId] = React.useState<string | null>(null);
	const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
	const [mutationError, setMutationError] = React.useState<string | null>(null);

	const queue = data?.items ?? [];
	const verificationEvents = data?.events ?? SIKESRA_REFERENCE_FIXTURES.verificationEvents;
	const currentVerifierLevels = data?.currentVerifierLevels ?? [];
	const pending = queue.filter((item) => item.canAdvance).length;
	const approved = queue.filter((item) => item.verificationStage === "active_verified").length;

	if (loading)
		return (
			<PageShell>
				<LoadingState label={copy.loadingVerificationQueue} />
			</PageShell>
		);
	if (error)
		return (
			<PageShell>
				<ErrorState message={error} onRetry={() => void reload()} />
			</PageShell>
		);

	async function handleVerifyAction(entityId: string, actionType: "approve" | "needs_revision") {
		setSubmittingId(entityId);
		setMutationError(null);
		setStatusMessage(null);

		const rawNotes = actionNotes[entityId]?.trim() ?? "";
		if (actionType === "needs_revision" && !rawNotes) {
			setMutationError(copy.verificationRevisionReasonRequired);
			setSubmittingId(null);
			return;
		}
		const notes = rawNotes || "Verification processed via admin console";

		try {
			const item = queue.find((entry) => entry.registryEntityId === entityId);
			const fallbackLevel = item
				? (getVerifierLevelOptions(item.currentLevel)[0] ?? "desa_kelurahan")
				: "desa_kelurahan";
			const verifierLevel = verifierLevels[entityId] ?? fallbackLevel;
			if (actionType === "approve") {
				const response = await advanceVerification<VerificationAdvanceResponse>(
					{
						registryEntityId: entityId,
						verifierLevel,
						notes: notes,
					},
					await createAdminApiRequestOptions(),
				);
				setStatusMessage(
					`Approved successfully: ${response.item.code} advanced to ${response.item.verificationStage}`,
				);
			} else {
				const response = await rejectVerification<VerificationAdvanceResponse>(
					{
						registryEntityId: entityId,
						verifierLevel,
						notes,
					},
					await createAdminApiRequestOptions(),
				);
				setStatusMessage(
					`Needs revision: ${response.item.code} returned to ${response.item.verificationStage}.`,
				);
			}

			// Clear notes
			setActionNotes((prev) => {
				const next = { ...prev };
				delete next[entityId];
				return next;
			});
			await reload();
		} catch (cause) {
			setMutationError(cause instanceof Error ? cause.message : copy.requestFailed);
		} finally {
			setSubmittingId(null);
		}
	}

	return (
		<PageShell>
			<PageHeader
				eyebrow={copy.verificationEyebrow}
				title={copy.verificationTitle}
				description={copy.verificationDescription}
			/>
			<div className="rounded-xl border border-kumo-line bg-kumo-tint/15 px-4 py-3 text-sm text-kumo-subtle">
				{copy.verificationInputPolicy}
				<div className="mt-2">
					<strong>{copy.assignedVerifierLevels}:</strong>{" "}
					{currentVerifierLevels.length > 0
						? currentVerifierLevels
								.map((level) => resolveVerifierUserLevelLabel(level, copy))
								.join(", ")
						: copy.notSet}
				</div>
				<div className="mt-1">{copy.verificationReadOnly}</div>
			</div>

			{statusMessage ? (
				<div className="rounded-xl border border-kumo-success/30 bg-kumo-success/10 px-4 py-3 text-sm text-kumo-default flex items-center gap-2">
					<span>✓</span> <span>{statusMessage}</span>
				</div>
			) : null}
			{mutationError ? (
				<div className="rounded-xl border border-kumo-danger/30 bg-kumo-danger/10 px-4 py-3 text-sm text-kumo-default flex items-center gap-2">
					<span>⚠️</span> <span>{mutationError}</span>
				</div>
			) : null}

			<div className="grid gap-5 md:grid-cols-3">
				<MetricCard
					label={copy.queuedEvents}
					value={queue.length}
					hint={copy.queuedEventsHint}
					icon="📥"
				/>
				<MetricCard label={copy.approved} value={approved} hint={copy.approvedHint} icon="✅" />
				<MetricCard
					label={copy.needsReview}
					value={pending}
					hint={copy.needsReviewHint}
					icon="⏳"
				/>
			</div>

			<Card
				title={copy.registryVerificationQueue}
				description={copy.registryVerificationQueueDescription}
			>
				<div className="space-y-4">
					{queue.length === 0 ? (
						<div className="p-8 text-center text-sm text-kumo-subtle italic">
							No entities in the verification queue.
						</div>
					) : (
						queue.map((item) => {
							const allowedVerifierLevels = getVerifierLevelOptions(item.currentLevel);
							const canCurrentUserAdvance = allowedVerifierLevels.some((level) =>
								currentVerifierLevels.includes(level),
							);
							return (
								<div
									className="rounded-xl border border-kumo-line bg-kumo-base p-4 hover:border-kumo-brand/40 transition-all shadow-sm"
									key={item.id}
								>
									<div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
										<div className="flex-1 flex items-start gap-3">
											<span
												className="text-2xl shrink-0 mt-0.5"
												role="img"
												aria-label={item.entityType}
											>
												{getEntityIcon(item.entityType)}
											</span>
											<div className="min-w-0 flex-1">
												<div className="font-semibold text-kumo-default text-base">
													{item.label}
												</div>
												<div className="mt-1 text-xs font-mono text-kumo-brand font-bold bg-kumo-tint px-2 py-0.5 rounded inline-block">
													{item.code}
												</div>
												<div className="mt-2 text-xs text-kumo-subtle leading-relaxed bg-kumo-tint/20 p-2.5 rounded-lg border border-kumo-line/50">
													{item.publicSummary}
												</div>

												{/* Action inputs */}
												{item.canAdvance && canCurrentUserAdvance && (
													<div className="mt-3 max-w-md space-y-2 border-t border-kumo-line/50 pt-3">
														<label className="block text-xs font-medium text-kumo-default mb-1">
															Verifier Notes:
														</label>
														<Input
															placeholder="Write justification notes..."
															value={actionNotes[item.registryEntityId] || ""}
															onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
																const val = e.target.value;
																setActionNotes((prev) => ({
																	...prev,
																	[item.registryEntityId]: val,
																}));
															}}
														/>
														<div>
															<label className="block text-xs font-medium text-kumo-default mb-1">
																{copy.verifierLevel}:
															</label>
															<Select
																value={
																	verifierLevels[item.registryEntityId] ??
																	getVerifierLevelOptions(item.currentLevel)[0] ??
																	"desa_kelurahan"
																}
																onValueChange={(value) =>
																	setVerifierLevels((prev) => ({
																		...prev,
																		[item.registryEntityId]:
																			value ??
																			getVerifierLevelOptions(item.currentLevel)[0] ??
																			"desa_kelurahan",
																	}))
																}
															>
																{getVerifierLevelOptions(item.currentLevel).map((level) => (
																	<Select.Option key={level} value={level}>
																		{resolveVerifierUserLevelLabel(level, copy)}
																	</Select.Option>
																))}
															</Select>
														</div>
														<div className="grid gap-1 text-xs text-kumo-subtle md:grid-cols-2">
															<div>
																<strong>{copy.inputLevel}:</strong> {copy.allUserLevels}
															</div>
															<div>
																<strong>{copy.approverLevel}:</strong>{" "}
																{resolveVerifierUserLevelLabel(
																	verifierLevels[item.registryEntityId] ??
																		getVerifierLevelOptions(item.currentLevel)[0] ??
																		"desa_kelurahan",
																	copy,
																)}
															</div>
														</div>
														<div className="flex gap-2 pt-1">
															<Button
																disabled={submittingId !== null}
																onClick={() =>
																	void handleVerifyAction(item.registryEntityId, "approve")
																}
																size="xs"
																variant="primary"
															>
																{submittingId === item.registryEntityId
																	? "Processing..."
																	: `✓ Approve to ${item.nextStage}`}
															</Button>
															<Button
																disabled={submittingId !== null}
																onClick={() =>
																	void handleVerifyAction(item.registryEntityId, "needs_revision")
																}
																size="xs"
																variant="secondary"
															>
																✗ Needs Revision
															</Button>
														</div>
													</div>
												)}
												{item.canAdvance && !canCurrentUserAdvance ? (
													<div className="mt-3 rounded-lg border border-kumo-line/50 bg-kumo-tint/10 px-3 py-2 text-xs text-kumo-subtle">
														{copy.verificationReadOnly}
													</div>
												) : null}
											</div>
										</div>
										<div className="flex flex-col items-end gap-2 shrink-0 max-md:items-start max-md:mt-2">
											<div className="flex gap-1.5 flex-wrap">
												<Badge variant={item.canAdvance ? "warning" : "success"}>
													{item.verificationStage}
												</Badge>
												{item.nextStage && <Badge variant="outline">Next: {item.nextStage}</Badge>}
											</div>
											<div className="text-xs text-kumo-subtle space-y-1 text-end max-md:text-start">
												<div>
													<strong>{copy.inputLevel}:</strong>{" "}
													{resolveVerifierUserLevelLabel(item.inputLevel, copy)}
												</div>
												<div>
													<strong>{copy.currentLevel}:</strong>{" "}
													{resolveVerificationLevelLabel(item.currentLevel, copy)}
												</div>
												{item.nextLevel ? (
													<div>
														<strong>{copy.nextLevel}:</strong>{" "}
														{resolveVerificationLevelLabel(item.nextLevel, copy)}
													</div>
												) : null}
											</div>
											<div className="text-xs text-kumo-subtle flex items-center gap-1">
												<span>📁 Documents:</span>{" "}
												<strong>{item.supportingDocumentIds.length}</strong>
											</div>
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>
			</Card>

			<Card
				title={copy.referenceVerificationEvents}
				description={copy.referenceVerificationEventsDescription}
			>
				<div className="space-y-3">
					{verificationEvents.map((item) => (
						<div className="rounded-xl border border-kumo-line bg-kumo-base p-4" key={item.id}>
							<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
								<div>
									<div className="font-semibold text-kumo-default text-sm">
										{item.registryEntityId}
									</div>
									<div className="mt-1 text-sm text-kumo-subtle leading-relaxed bg-kumo-tint/20 px-3 py-2 rounded-lg border border-kumo-line/50">
										{item.notes}
									</div>
								</div>
								<div className="flex items-center gap-1.5 shrink-0">
									<Pill
										tone={
											item.result === "approved"
												? "success"
												: item.result === "needs_review"
													? "warning"
													: "danger"
										}
									>
										{item.result}
									</Pill>
									<Pill>{item.stage}</Pill>
								</div>
							</div>
							<div className="mt-3 grid gap-2 text-xs text-kumo-subtle md:grid-cols-3 pt-2.5 border-t border-kumo-line/50">
								<div>
									<strong>Actor:</strong> {item.actor}
								</div>
								<div>
									<strong>{copy.inputLevel}:</strong>{" "}
									{item.inputLevel
										? resolveVerifierUserLevelLabel(item.inputLevel, copy)
										: copy.notSet}
								</div>
								<div>
									<strong>{copy.approverLevel}:</strong>{" "}
									{resolveVerifierUserLevelLabel(
										item.verifierLevel ?? inferVerifierLevelFromActor(item.actor),
										copy,
									)}
								</div>
								{item.verifierRegionScope ? (
									<div>
										<strong>{copy.regionScope}:</strong> {item.verifierRegionScope}
									</div>
								) : null}
								{item.verifierOrgScope ? (
									<div>
										<strong>{copy.orgScope}:</strong> {item.verifierOrgScope}
									</div>
								) : null}
								<div>
									<strong>Created:</strong> {formatDateTime(item.createdAt, i18n.locale)}
								</div>
								<div>
									<strong>ID Label:</strong> {maskSensitive(item.id, false)}
								</div>
							</div>
						</div>
					))}
				</div>
			</Card>
		</PageShell>
	);
}

function createSafeDocumentFilename(fileName: string) {
	return (
		fileName
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9._-]+/g, "-")
			.replace(/^-+|-+$/g, "") || "supporting-document"
	);
}

async function calculateDocumentChecksum(file: File) {
	const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
	return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function DocumentsPage() {
	const { i18n } = useLingui();
	const copy = getExampleAdminCopy(i18n.locale);
	const { data: registryData } = usePluginData<{ items: SikesraReferenceRegistryEntity[] }>(
		"registry/list",
	);
	const { data, loading, reload } = usePluginData<{ items: SikesraReferenceSupportingDocument[] }>(
		"documents/list",
	);

	const [uploadState, setUploadState] = React.useState({
		title: "",
		documentType: "surat_keterangan",
		sensitivity: "public_safe" as SikesraSensitivity,
		registryEntityId: "",
		fileSelected: false,
		fileName: "",
		fileSize: 0,
		fileType: "",
	});

	const [progress, setProgress] = React.useState<number | null>(null);
	const [notice, setNotice] = React.useState<string | null>(null);
	const [error, setError] = React.useState<string | null>(null);
	const [checksum, setChecksum] = React.useState<string | null>(null);

	const docs = data?.items ?? SIKESRA_REFERENCE_FIXTURES.supportingDocuments;
	const sensitiveCount = docs.filter((doc) => doc.sensitivity !== "public_safe").length;
	const entities = registryData?.items ?? SIKESRA_REFERENCE_FIXTURES.registryEntities;

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validation rules: PDF, PNG, JPG, MAX 5MB
		const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
		if (!allowedTypes.includes(file.type)) {
			setError("Invalid file type! Only PDF, PNG, and JPEG are allowed.");
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			setError("File size exceeds maximum limit of 5MB!");
			return;
		}

		setError(null);
		setUploadState((prev) => ({
			...prev,
			fileSelected: true,
			fileName: file.name,
			fileSize: file.size,
			fileType: file.type,
		}));


		try {
			setChecksum(await calculateDocumentChecksum(file));
		} catch {
			setError("Failed to calculate document checksum.");
			setChecksum(null);
		}
	};

	const handleUploadSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!uploadState.fileSelected || !uploadState.registryEntityId || !uploadState.title || !checksum) {
			setError("Please fill all mandatory fields and select a valid file!");
			return;
		}

		setError(null);
		setProgress(30);

		try {
			await saveDocument(
				{
					title: uploadState.title,
					documentType: uploadState.documentType,
					classification: uploadState.sensitivity,
					registryEntityId: uploadState.registryEntityId,
					contentType: uploadState.fileType,
					fileSizeBytes: uploadState.fileSize,
					checksumSha256: checksum,
					originalFilename: uploadState.fileName,
					safeFilename: createSafeDocumentFilename(uploadState.fileName),
				},
				await createAdminApiRequestOptions(),
			);
			setProgress(100);

			setNotice(`Document metadata saved with checksum: ${checksum}`);
			setProgress(null);
			setUploadState({
				title: "",
				documentType: "surat_keterangan",
				sensitivity: "public_safe",
				registryEntityId: "",
				fileSelected: false,
				fileName: "",
				fileSize: 0,
				fileType: "",
			});
			setChecksum(null);
			await reload();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to save document metadata");
			setProgress(null);
		}
	};

	if (loading)
		return (
			<PageShell>
				<LoadingState label={copy.loadingPluginOverview} />
			</PageShell>
		);

	return (
		<PageShell>
			<PageHeader
				eyebrow={copy.documentsEyebrow}
				title={copy.documentsTitle}
				description={copy.documentsDescription}
			/>

			<div className="grid gap-5 md:grid-cols-3">
				<MetricCard
					label={copy.documentsMetric}
					value={docs.length}
					hint={copy.documentsMetricHint}
					icon="📁"
				/>
				<MetricCard
					label={copy.sensitiveDocs}
					value={sensitiveCount}
					hint={copy.sensitiveDocsHint}
					icon="🔐"
				/>
				<MetricCard
					label={copy.verifiedSources}
					value={new Set(docs.map((doc) => doc.verifiedBy)).size}
					hint={copy.verifiedSourcesHint}
					icon="🛡️"
				/>
			</div>

			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px] mt-2">
				<Card title={copy.documentCatalog} description={copy.documentCatalogDescription}>
					<div className="space-y-3">
						{docs.length === 0 ? (
							<EmptyState
								title="No Documents"
								description="Upload document metadata on the right to populate the catalog."
							/>
						) : (
							docs.map((doc) => {
								const isPdf =
									doc.title.toLowerCase().endsWith(".pdf") ||
									doc.documentType === "pdf" ||
									doc.documentType === "surat_keterangan";
								const fileIcon = isPdf ? "📄" : "🖼️";
								return (
									<div
										className="rounded-xl border border-kumo-line bg-kumo-base p-4 hover:border-kumo-brand/40 transition-all shadow-sm"
										key={doc.id}
									>
										<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
											<div className="flex items-center gap-2.5">
												<span className="text-2xl shrink-0" role="img" aria-label="file format">
													{fileIcon}
												</span>
												<div>
													<div className="font-semibold text-kumo-default">{doc.title}</div>
													<div className="mt-1 text-[10px] font-mono bg-kumo-tint px-2 py-0.5 rounded inline-block text-kumo-brand uppercase font-bold">
														{doc.documentType.replace("_", " ")}
													</div>
												</div>
											</div>
											<div className="flex items-center gap-2 max-md:mt-2">
												<Pill
													tone={
														doc.sensitivity === "public_safe"
															? "success"
															: doc.sensitivity === "restricted"
																? "warning"
																: "danger"
													}
												>
													{doc.sensitivity}
												</Pill>
							<Button variant="secondary" size="xs" disabled>
								Preview pending storage workflow
							</Button>
											</div>
										</div>
										<div className="mt-3 grid gap-2 text-xs text-kumo-subtle md:grid-cols-3 pt-2.5 border-t border-kumo-line/50">
											<div>
												<strong>Entity:</strong>{" "}
												{maskSensitiveBySensitivity(doc.registryEntityId, doc.sensitivity)}
											</div>
											<div>
												<strong>Issued:</strong> {formatDateTime(doc.issuedAt, i18n.locale)}
											</div>
											<div>
												<strong>Verifier:</strong> {doc.verifiedBy}
											</div>
										</div>
									</div>
								);
							})
						)}
					</div>
				</Card>

					<Card
						title="Save Document Metadata"
						description="Save metadata for a supporting file before controlled storage preview/download is enabled."
					>
					<form className="space-y-4" onSubmit={(e) => void handleUploadSubmit(e)}>
						<Feedback message={notice} tone="success" />
						<Feedback message={error} tone="danger" />

						<Field
							label="Document Title"
							hint="Name of document for verification reference (Mandatory)"
						>
							<Input
								value={uploadState.title}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setUploadState((prev) => ({ ...prev, title: e.target.value }))
								}
								placeholder="e.g. Surat Keputusan Kemenag"
							/>
						</Field>

						<Field label="Linked SIKESRA Entity" hint="Mandatory target link">
							<Select
								value={uploadState.registryEntityId}
								onValueChange={(val) =>
									setUploadState((prev) => ({ ...prev, registryEntityId: val ?? "" }))
								}
							>
								<Select.Option value="">-- Select Target Entity --</Select.Option>
								{entities.map((ent) => (
									<Select.Option value={ent.id} key={ent.id}>
										{ent.label} ({ent.code})
									</Select.Option>
								))}
							</Select>
						</Field>

						<div className="grid gap-3 grid-cols-2">
							<Field label="Doc Type">
								<Select
									value={uploadState.documentType}
									onValueChange={(val) =>
										setUploadState((prev) => ({ ...prev, documentType: val ?? "surat_keterangan" }))
									}
								>
									<Select.Option value="surat_keterangan">Surat Keterangan</Select.Option>
									<Select.Option value="identitas">Identitas</Select.Option>
									<Select.Option value="sertifikat">Sertifikat</Select.Option>
								</Select>
							</Field>

							<Field label="Classification">
								<Select
									value={uploadState.sensitivity}
									onValueChange={(val) =>
										setUploadState((prev) => ({
											...prev,
											sensitivity: (val as SikesraSensitivity) ?? "public_safe",
										}))
									}
								>
									<Select.Option value="public_safe">Public Safe</Select.Option>
									<Select.Option value="internal">Internal</Select.Option>
									<Select.Option value="restricted">Restricted</Select.Option>
									<Select.Option value="highly_restricted">Highly Restricted</Select.Option>
								</Select>
							</Field>
						</div>

						<Field
							label="Select Supporting File"
							hint="Allowed types: PDF, PNG, JPEG. Max Size: 5MB"
						>
							<input
								type="file"
								accept="application/pdf,image/png,image/jpeg"
								className="w-full text-xs text-kumo-subtle border border-kumo-line bg-kumo-base rounded px-2 py-1.5"
								onChange={handleFileSelect}
							/>
						</Field>

						{uploadState.fileSelected && (
							<div className="rounded border bg-kumo-tint/20 p-3 text-xs space-y-1">
								<div>
									<strong>File:</strong> {uploadState.fileName} (
									{Math.round(uploadState.fileSize / 1024)} KB)
								</div>
								<div>
									<strong>Checksum:</strong>{" "}
									<code className="font-mono text-[10px] break-all">{checksum}</code>
								</div>
							</div>
						)}

						{progress !== null && (
							<div className="w-full bg-kumo-line rounded-full h-2">
								<div
									className="bg-kumo-brand h-2 rounded-full transition-all duration-300"
									style={{ width: `${progress}%` }}
								></div>
							</div>
						)}

						<Button
							variant="primary"
							type="submit"
							className="w-full justify-center animate-pulse"
							disabled={progress !== null}
						>
							{progress !== null ? `Saving ${progress}%` : "Save document metadata"}
						</Button>
					</form>
				</Card>
			</div>
		</PageShell>
	);
}

function ReportsPage() {
	const { i18n } = useLingui();
	const copy = getExampleAdminCopy(i18n.locale);
	const aggregate = SIKESRA_REFERENCE_FIXTURES.publicAggregate;
	const suppressedCount = aggregate.categories.filter((item) => item.suppressed).length;

	return (
		<PageShell>
			<PageHeader
				eyebrow={copy.reportsEyebrow}
				title={copy.reportsTitle}
				description={copy.reportsDescription}
			/>

			<div className="grid gap-5 md:grid-cols-3">
				<MetricCard
					label={copy.categories}
					value={aggregate.categories.length}
					hint={copy.categoriesHint}
					icon="📊"
				/>
				<MetricCard
					label={copy.suppressed}
					value={suppressedCount}
					hint={copy.suppressedHint}
					icon="🔐"
				/>
				<MetricCard
					label={copy.visible}
					value={aggregate.categories.length - suppressedCount}
					hint={copy.visibleHint}
					icon="👁️"
				/>
			</div>

			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] mt-2">
				<Card title={copy.aggregateCategories} description={copy.aggregateCategoriesDescription}>
					<div className="overflow-hidden rounded-xl border border-kumo-line bg-kumo-base text-kumo-default shadow-sm">
						<div className="grid grid-cols-[1.2fr_.7fr_.7fr_.7fr] gap-3 border-b border-kumo-line bg-kumo-tint/50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-kumo-subtle max-md:hidden">
							<div>{copy.category}</div>
							<div>{copy.total}</div>
							<div>{copy.verified}</div>
							<div>{copy.status}</div>
						</div>
						{aggregate.categories.map((item) => (
							<div
								className="grid gap-2 border-t border-kumo-line px-4 py-3.5 text-sm md:grid-cols-[1.2fr_.7fr_.7fr_.7fr] hover:bg-kumo-tint/20 transition-all"
								key={item.code}
							>
								<div className="font-semibold text-kumo-default">
									<div>{item.label}</div>
									<div className="mt-1 break-all text-[10px] font-mono text-kumo-subtle font-normal">
										{maskSensitive(item.code, !item.suppressed)}
									</div>
								</div>
								<div className="text-kumo-subtle font-medium">
									{item.suppressed ? (
										<span className="text-kumo-subtle italic">{copy.suppressed.toLowerCase()}</span>
									) : (
										<div className="flex flex-col gap-1.5">
											<span>{item.total}</span>
											<div className="w-16 bg-kumo-line rounded-full h-1 overflow-hidden">
												<div
													className="bg-kumo-brand h-full rounded-full"
													style={{ width: `${(item.verified / Math.max(item.total, 1)) * 100}%` }}
												></div>
											</div>
										</div>
									)}
								</div>
								<div className="text-kumo-subtle font-semibold">{item.verified}</div>
								<div>
									<Pill tone={item.suppressed ? "warning" : "success"}>
										{item.suppressed ? copy.masked : copy.visible.toLowerCase()}
									</Pill>
								</div>
							</div>
						))}
					</div>
				</Card>

				<Card title={copy.publicNote} description={copy.publicNoteDescription}>
					<p className="text-sm leading-relaxed text-kumo-subtle">{aggregate.caveat}</p>
					<div className="mt-4 rounded-xl border border-kumo-line bg-kumo-tint/15 p-4 text-xs text-kumo-subtle leading-relaxed space-y-1.5">
						<div className="font-bold text-kumo-default uppercase tracking-wider">
							{copy.displayRule}
						</div>
						<div>{copy.displayRuleDescription}</div>
					</div>
				</Card>
			</div>
		</PageShell>
	);
}

function AuditPage() {
	const { i18n } = useLingui();
	const copy = getExampleAdminCopy(i18n.locale);
	const { data, error, loading, reload } = usePluginData<AuditListResponse>("audit/list", {
		limit: 25,
	});

	if (loading) return <LoadingState label={copy.loadingAuditLog} />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;

	return (
		<PageShell>
			<PageHeader
				eyebrow={copy.auditEyebrow}
				title={copy.auditTitle}
				description={copy.auditDescription}
				actions={
					<Button variant="secondary" size="sm" onClick={() => void reload()} type="button">
						{copy.refresh}
					</Button>
				}
			/>
			<Card
				title="Chronological Log Activity"
				description="System audit records matching active security policies."
			>
				{!data?.items.length ? (
					<EmptyState title={copy.noAuditEvents} description={copy.noAuditEventsDescription} />
				) : (
					<div className="space-y-3.5">
						{data.items.map((item) => {
							const scopeColors: Record<string, string> = {
								registry: "border-l-4 border-l-blue-500",
								documents: "border-l-4 border-l-emerald-500",
								verification: "border-l-4 border-l-amber-500",
								abac: "border-l-4 border-l-purple-500",
								access: "border-l-4 border-l-pink-500",
							};
							const scopeIcons: Record<string, string> = {
								registry: "🕌",
								documents: "📄",
								verification: "⚖️",
								abac: "🛡️",
								access: "🔐",
							};
							return (
								<div
									className={cx(
										"rounded-xl border border-kumo-line bg-kumo-base p-4 hover:border-kumo-brand/35 transition-all shadow-sm flex gap-3.5 items-start",
										scopeColors[item.scope] || "border-l-4 border-l-kumo-subtle",
									)}
									key={item.id}
								>
									<span className="text-2xl shrink-0 mt-0.5" role="img" aria-label="scope icon">
										{scopeIcons[item.scope] || "📋"}
									</span>
									<div className="min-w-0 flex-1">
										<div className="flex flex-wrap items-center gap-2">
											<span className="text-xs font-mono font-bold text-kumo-brand bg-kumo-tint px-2 py-0.5 rounded leading-none uppercase">
												{item.kind}
											</span>
											<span className="text-xs text-kumo-subtle">
												• scope: <strong className="capitalize">{item.scope}</strong>
											</span>
										</div>
										<div className="mt-2 text-sm font-semibold text-kumo-default leading-relaxed">
											{item.summary}
										</div>
										<div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-kumo-subtle pt-2 border-t border-kumo-line/50">
											<div>
												<strong>Actor:</strong> {item.actor}
											</div>
											{item.userName || item.userId ? (
												<div>
													<strong>{copy.userLabel}:</strong> {item.userName || item.userId}
													{item.userId ? ` (${item.userId})` : ""}
												</div>
											) : null}
											<div>
												<strong>Timestamp:</strong> {formatDateTime(item.timestamp, i18n.locale)}
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</Card>
		</PageShell>
	);
}

function PermissionsPage() {
	const { i18n } = useLingui();
	const copy = getExampleAdminCopy(i18n.locale);
	const { data, error, loading, reload } =
		usePluginData<AccessPermissionsResponse>("access/permissions/list");
	const [saving, setSaving] = React.useState(false);
	const [notice, setNotice] = React.useState<string | null>(null);
	const [saveError, setSaveError] = React.useState<string | null>(null);
	const [formState, setFormState] = React.useState({
		slug: "",
		label: "",
		description: "",
		scope: "content",
	});

	const savePermission = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSaving(true);
		setNotice(null);
		setSaveError(null);

		try {
			await saveAccessPermission(formState, await createAdminApiRequestOptions());
			setFormState({ slug: "", label: "", description: "", scope: "content" });
			setNotice(copy.permissionSaved);
			await reload();
		} catch (cause) {
			setSaveError(cause instanceof Error ? cause.message : copy.failedToSavePermission);
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <LoadingState label={copy.loadingPermissions} />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;

	return (
		<PageShell>
			<PageHeader
				eyebrow={copy.accessEyebrow}
				title={copy.permissionCatalog}
				description={copy.permissionCatalogDescription}
			/>
			<div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
				<Card title={copy.addPermission} description={copy.addPermissionDescription}>
					<form className="space-y-4" onSubmit={(event) => void savePermission(event)}>
						<Feedback message={notice} />
						<Feedback message={saveError} tone="danger" />
						<Field label={copy.slug}>
							<Input
								value={formState.slug}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setFormState((current) => ({ ...current, slug: event.target.value }))
								}
							/>
						</Field>
						<Field label={copy.label}>
							<Input
								value={formState.label}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setFormState((current) => ({ ...current, label: event.target.value }))
								}
							/>
						</Field>
						<Field label={copy.scope}>
							<Input
								value={formState.scope}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setFormState((current) => ({ ...current, scope: event.target.value }))
								}
							/>
						</Field>
						<Field label={copy.descriptionLabel}>
							<InputArea
								value={formState.description}
								onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
									setFormState((current) => ({ ...current, description: event.target.value }))
								}
							/>
						</Field>
						<Button variant="primary" disabled={saving} type="submit">
							{saving ? copy.saving : copy.savePermission}
						</Button>
					</form>
				</Card>

				<Card
					title={copy.existingPermissions}
					description={copy.existingPermissionsDescription(data?.items.length ?? 0)}
				>
					{!data?.items.length ? (
						<EmptyState
							title={copy.noPermissionsYet}
							description={copy.noPermissionsYetDescription}
						/>
					) : (
						<div className="grid gap-3">
							{data.items.map((item) => (
								<div
									className="rounded-xl border border-kumo-line bg-kumo-base p-4 text-kumo-default"
									key={item.slug}
								>
									<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
										<div className="font-medium text-kumo-default">{item.label}</div>
										<Pill>{item.scope}</Pill>
									</div>
									<div className="mt-1 break-all text-sm text-kumo-subtle">{item.slug}</div>
									<p className="mt-2 text-sm leading-6 text-kumo-subtle">
										{item.description || copy.noDescriptionProvided}
									</p>
								</div>
							))}
						</div>
					)}
				</Card>
			</div>
		</PageShell>
	);
}

function RolesPage() {
	const { i18n } = useLingui();
	const copy = getExampleAdminCopy(i18n.locale);
	const { data, error, loading, reload } = usePluginData<AccessRolesResponse>("access/roles/list");
	const [roleSaving, setRoleSaving] = React.useState(false);
	const [userSaving, setUserSaving] = React.useState(false);
	const [notice, setNotice] = React.useState<string | null>(null);
	const [saveError, setSaveError] = React.useState<string | null>(null);
	const [roleState, setRoleState] = React.useState({ slug: "", label: "", description: "" });
	const [userState, setUserState] = React.useState({ userId: "", roles: "" });

	const saveRole = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setRoleSaving(true);
		setNotice(null);
		setSaveError(null);

		try {
			await saveAccessRole(roleState, await createAdminApiRequestOptions());
			setRoleState({ slug: "", label: "", description: "" });
			setNotice(copy.roleSaved);
			await reload();
		} catch (cause) {
			setSaveError(cause instanceof Error ? cause.message : copy.failedToSaveRole);
		} finally {
			setRoleSaving(false);
		}
	};

	const saveUserAssignment = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setUserSaving(true);
		setNotice(null);
		setSaveError(null);

		try {
			await saveUserRoles(
				{
					emdashUserId: userState.userId,
					roles: fromCsv(userState.roles),
				},
				await createAdminApiRequestOptions(),
			);
			setUserState({ userId: "", roles: "" });
			setNotice(copy.userRoleAssignmentSaved);
			await reload();
		} catch (cause) {
			setSaveError(cause instanceof Error ? cause.message : copy.failedToSaveUserAssignment);
		} finally {
			setUserSaving(false);
		}
	};

	if (loading) return <LoadingState label={copy.loadingRoles} />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;

	return (
		<PageShell>
			<PageHeader
				eyebrow={copy.accessEyebrow}
				title={copy.rolesAndAssignments}
				description={copy.rolesAndAssignmentsDescription}
			/>
			<Feedback message={notice} />
			<Feedback message={saveError} tone="danger" />

			<div className="grid gap-6 lg:grid-cols-2">
				<Card title={copy.addRole} description={copy.addRoleDescription}>
					<form className="space-y-4" onSubmit={(event) => void saveRole(event)}>
						<Field label={copy.roleSlug}>
							<Input
								value={roleState.slug}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setRoleState((current) => ({ ...current, slug: event.target.value }))
								}
							/>
						</Field>
						<Field label={copy.label}>
							<Input
								value={roleState.label}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setRoleState((current) => ({ ...current, label: event.target.value }))
								}
							/>
						</Field>
						<Field label={copy.descriptionLabel}>
							<InputArea
								value={roleState.description}
								onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
									setRoleState((current) => ({ ...current, description: event.target.value }))
								}
							/>
						</Field>
						<Button variant="primary" disabled={roleSaving} type="submit">
							{roleSaving ? copy.saving : copy.saveRole}
						</Button>
					</form>
				</Card>

				<Card title={copy.assignUserRoles} description={copy.assignUserRolesDescription}>
					<form className="space-y-4" onSubmit={(event) => void saveUserAssignment(event)}>
						<Field label={copy.userId}>
							<Input
								value={userState.userId}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setUserState((current) => ({ ...current, userId: event.target.value }))
								}
							/>
						</Field>
						<Field label={copy.roles}>
							<Input
								value={userState.roles}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setUserState((current) => ({ ...current, roles: event.target.value }))
								}
							/>
						</Field>
						<Button variant="primary" disabled={userSaving} type="submit">
							{userSaving ? copy.saving : copy.saveAssignment}
						</Button>
					</form>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card title={copy.rolesTitle} description={copy.rolesDescription(data?.roles.length ?? 0)}>
					{!data?.roles.length ? (
						<EmptyState title={copy.noRolesYet} description={copy.noRolesYetDescription} />
					) : (
						<div className="space-y-3">
							{data.roles.map((item) => (
								<div
									className="rounded-xl border border-kumo-line bg-kumo-base p-4 text-kumo-default"
									key={item.slug}
								>
									<div className="font-medium text-kumo-default">{item.label}</div>
									<div className="mt-1 text-sm text-kumo-subtle">{item.slug}</div>
									<p className="mt-2 text-sm leading-6 text-kumo-subtle">
										{item.description || copy.noDescriptionProvided}
									</p>
								</div>
							))}
						</div>
					)}
				</Card>

				<Card
					title={copy.userAssignments}
					description={copy.userAssignmentsDescription(data?.userAssignments.length ?? 0)}
				>
					{!data?.userAssignments.length ? (
						<EmptyState
							title={copy.noAssignmentsYet}
							description={copy.noAssignmentsYetDescription}
						/>
					) : (
						<div className="space-y-3">
							{data.userAssignments.map((item) => (
								<div
									className="rounded-xl border border-kumo-line bg-kumo-base p-4 text-kumo-default"
									key={item.userId}
								>
									<div className="font-medium text-kumo-default">{item.userId}</div>
									<div className="mt-2 flex flex-wrap gap-2">
										{item.roles.length ? (
											item.roles.map((role) => <Pill key={role}>{role}</Pill>)
										) : (
											<Pill tone="warning">{copy.noRolesPill}</Pill>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</Card>
			</div>
		</PageShell>
	);
}

function MatrixPage() {
	const { i18n } = useLingui();
	const copy = getExampleAdminCopy(i18n.locale);
	const { data, error, loading, reload } = usePluginData<AccessMatrixResponse>("access/matrix/get");
	const [selectedRole, setSelectedRole] = React.useState("");
	const [selectedPermissions, setSelectedPermissions] = React.useState<string[]>([]);
	const [saving, setSaving] = React.useState(false);
	const [notice, setNotice] = React.useState<string | null>(null);
	const [saveError, setSaveError] = React.useState<string | null>(null);

	React.useEffect(() => {
		if (!data || selectedRole) return;
		setSelectedRole(data.roles[0]?.slug ?? "");
	}, [data, selectedRole]);

	React.useEffect(() => {
		if (!data || !selectedRole) return;
		const assignment = data.assignments.find((item) => item.roleSlug === selectedRole);
		setSelectedPermissions(assignment?.permissions ?? []);
	}, [data, selectedRole]);

	const togglePermission = (slug: string, checked: boolean) => {
		setSelectedPermissions((current) =>
			checked ? [...new Set([...current, slug])] : current.filter((item) => item !== slug),
		);
	};

	const saveMatrix = async () => {
		setSaving(true);
		setNotice(null);
		setSaveError(null);

		try {
			await saveAccessMatrix(
				{
					roleSlug: selectedRole,
					permissions: selectedPermissions,
				},
				await createAdminApiRequestOptions(),
			);
			setNotice(copy.roleMatrixSaved);
			await reload();
		} catch (cause) {
			setSaveError(cause instanceof Error ? cause.message : copy.failedToSaveMatrix);
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <LoadingState label={copy.loadingRoleMatrix} />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;

	return (
		<PageShell>
			<PageHeader
				eyebrow={copy.accessEyebrow}
				title={copy.rolePermissionMatrix}
				description={copy.rolePermissionMatrixDescription}
			/>
			<Feedback message={notice} />
			<Feedback message={saveError} tone="danger" />

			{!data?.roles.length || !data.permissions.length ? (
				<EmptyState
					title={copy.catalogIncomplete}
					description={copy.catalogIncompleteDescription}
				/>
			) : (
				<Card
					title={copy.editMatrix}
					description={copy.editMatrixDescription(selectedPermissions.length)}
					actions={
						<Button
							variant="primary"
							disabled={saving || !selectedRole}
							onClick={() => void saveMatrix()}
							type="button"
						>
							{saving ? copy.saving : copy.saveMatrix}
						</Button>
					}
				>
					<div className="mb-5 max-w-sm">
						<Field label={copy.role}>
							<Select value={selectedRole} onValueChange={(value) => setSelectedRole(value ?? "")}>
								{data.roles.map((role) => (
									<Select.Option key={role.slug} value={role.slug}>
										{role.label}
									</Select.Option>
								))}
							</Select>
						</Field>
					</div>

					<div className="grid gap-3 md:grid-cols-2">
						{data.permissions.map((permission) => {
							const checked = selectedPermissions.includes(permission.slug);
							return (
								<label
									className={cx(
										"flex cursor-pointer items-start gap-3 rounded-xl border border-kumo-line bg-kumo-base p-4 text-kumo-default transition",
										checked && "bg-kumo-tint/30",
									)}
									key={permission.slug}
								>
									<input
										type="checkbox"
										className="mt-1 accent-current"
										checked={checked}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
											togglePermission(permission.slug, event.target.checked)
										}
									/>
									<span>
										<span className="block font-medium text-kumo-default">{permission.label}</span>
										<span className="mt-1 block break-all text-sm text-kumo-subtle">
											{permission.slug}
										</span>
										<span className="mt-2 block">
											<Pill>{permission.scope}</Pill>
										</span>
									</span>
								</label>
							);
						})}
					</div>
				</Card>
			)}
		</PageShell>
	);
}

function PreviewPage() {
	const { i18n } = useLingui();
	const copy = getExampleAdminCopy(i18n.locale);
	const { data: rolesData } = usePluginData<AccessRolesResponse>("access/roles/list");
	const { data: permissionsData } =
		usePluginData<AccessPermissionsResponse>("access/permissions/list");
	const [userId, setUserId] = React.useState("user-demo-editor");
	const [permissionSlug, setPermissionSlug] = React.useState("content.read.public");
	const [preview, setPreview] = React.useState<AccessPreviewResponse | null>(null);
	const [error, setError] = React.useState<string | null>(null);
	const [running, setRunning] = React.useState(false);

	const runPreview = async () => {
		setRunning(true);
		setError(null);
		setPreview(null);

		try {
			setPreview(
				await previewAccess<AccessPreviewResponse>(
					{ userId, permissionSlug },
					await createAdminApiRequestOptions(),
				),
			);
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : copy.failedToPreviewAccess);
		} finally {
			setRunning(false);
		}
	};

	return (
		<PageShell width="wide">
			<PageHeader
				eyebrow={copy.accessEyebrow}
				title={copy.effectiveAccessPreview}
				description={copy.effectiveAccessPreviewDescription}
			/>
			<Card title={copy.previewInput} description={copy.previewInputDescription}>
				<div className="grid gap-4 md:grid-cols-2">
					<Field label={copy.user}>
						<Select value={userId} onValueChange={(value) => setUserId(value ?? "")}>
							{rolesData?.userAssignments.map((item) => (
								<Select.Option key={item.userId} value={item.userId}>
									{item.userId}
								</Select.Option>
							))}
						</Select>
					</Field>
					<Field label={copy.permission}>
						<Select
							value={permissionSlug}
							onValueChange={(value) => setPermissionSlug(value ?? "")}
						>
							{permissionsData?.items.map((item) => (
								<Select.Option key={item.slug} value={item.slug}>
									{item.slug}
								</Select.Option>
							))}
						</Select>
					</Field>
				</div>
				<div className="mt-4">
					<Button
						variant="primary"
						disabled={running}
						onClick={() => void runPreview()}
						type="button"
					>
						{running ? copy.loadingAccessPreview : copy.previewAccess}
					</Button>
				</div>
			</Card>

			<Feedback message={error} tone="danger" />
			{preview ? (
				<Card title={copy.decisionResult}>
					<div className="mb-4">
						<Pill tone={preview.allowed ? "success" : "danger"}>
							{preview.allowed ? copy.allowed : copy.denied}
						</Pill>
					</div>
					<p className="text-sm leading-6 text-kumo-subtle">{preview.reason}</p>
					<KeyValueList
						items={[
							[copy.matchedRoles, toCsv(preview.matchedRoles) || copy.none],
							[copy.effectivePermissions, toCsv(preview.effectivePermissions) || copy.none],
						]}
					/>
				</Card>
			) : null}
		</PageShell>
	);
}

function AbacAttributesPage() {
	const { i18n } = useLingui();
	const copy = getExampleAdminCopy(i18n.locale);
	const { data, error, loading, reload } =
		usePluginData<AbacAttributesResponse>("abac/attributes/list");
	const { data: subjectData, reload: reloadSubjects } =
		usePluginData<AbacAssignmentsResponse>("abac/subjects/list");
	const { data: resourceData, reload: reloadResources } =
		usePluginData<AbacAssignmentsResponse>("abac/resources/list");
	const [notice, setNotice] = React.useState<string | null>(null);
	const [saveError, setSaveError] = React.useState<string | null>(null);
	const [attributeState, setAttributeState] = React.useState<{
		key: string;
		label: string;
		targetType: AbacTargetType;
		description: string;
	}>({ key: "", label: "", targetType: "context", description: "" });
	const [subjectState, setSubjectState] = React.useState({
		subjectId: "",
		attributes: '{"tenant_id":"tenant-a"}',
	});
	const [resourceState, setResourceState] = React.useState({
		resourceId: "",
		attributes: '{"resource_type":"policy"}',
	});

	const saveAttribute = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setNotice(null);
		setSaveError(null);

		try {
			await saveAbacAttribute(attributeState, await createAdminApiRequestOptions());
			setAttributeState({ key: "", label: "", targetType: "context", description: "" });
			setNotice(copy.attributeSaved);
			await reload();
		} catch (cause) {
			setSaveError(cause instanceof Error ? cause.message : copy.failedToSaveAbacAttribute);
		}
	};

	const saveSubject = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setNotice(null);
		setSaveError(null);
		const parsed = parseJsonMap(subjectState.attributes);
		if (!parsed.ok) {
			setSaveError(parsed.error);
			return;
		}

		try {
			await saveAbacSubject(
				{
					subjectId: subjectState.subjectId,
					attributes: parsed.data,
				},
				await createAdminApiRequestOptions(),
			);
			setSubjectState({ subjectId: "", attributes: '{"tenant_id":"tenant-a"}' });
			setNotice(copy.subjectAttributesSaved);
			await reloadSubjects();
		} catch (cause) {
			setSaveError(cause instanceof Error ? cause.message : copy.failedToSaveAbacSubject);
		}
	};

	const saveResource = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setNotice(null);
		setSaveError(null);
		const parsed = parseJsonMap(resourceState.attributes);
		if (!parsed.ok) {
			setSaveError(parsed.error);
			return;
		}

		try {
			await saveAbacResource(
				{
					resourceId: resourceState.resourceId,
					attributes: parsed.data,
				},
				await createAdminApiRequestOptions(),
			);
			setResourceState({ resourceId: "", attributes: '{"resource_type":"policy"}' });
			setNotice(copy.resourceAttributesSaved);
			await reloadResources();
		} catch (cause) {
			setSaveError(cause instanceof Error ? cause.message : copy.failedToSaveAbacResource);
		}
	};

	if (loading) return <LoadingState label={copy.loadingAbacAttributes} />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;

	return (
		<PageShell>
			<PageHeader
				eyebrow={copy.abacEyebrow}
				title={copy.attributeCatalog}
				description={copy.attributeCatalogDescription}
			/>
			<Feedback message={notice} />
			<Feedback message={saveError} tone="danger" />

			<div className="grid gap-6 lg:grid-cols-3">
				<Card title={copy.attributeDefinition}>
					<form className="space-y-4" onSubmit={(event) => void saveAttribute(event)}>
						<Field label={copy.key}>
							<Input
								value={attributeState.key}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setAttributeState((current) => ({ ...current, key: event.target.value }))
								}
							/>
						</Field>
						<Field label={copy.label}>
							<Input
								value={attributeState.label}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setAttributeState((current) => ({ ...current, label: event.target.value }))
								}
							/>
						</Field>
						<Field label={copy.targetType}>
							<Select
								value={attributeState.targetType}
								onValueChange={(value) =>
									setAttributeState((current) => ({
										...current,
										targetType: (value as AbacTargetType | null) ?? "context",
									}))
								}
							>
								<Select.Option value="subject">{copy.subject}</Select.Option>
								<Select.Option value="resource">{copy.resource}</Select.Option>
								<Select.Option value="context">{copy.context}</Select.Option>
							</Select>
						</Field>
						<Field label={copy.descriptionLabel}>
							<InputArea
								value={attributeState.description}
								onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
									setAttributeState((current) => ({ ...current, description: event.target.value }))
								}
							/>
						</Field>
						<Button variant="primary" type="submit">
							{copy.saveAttribute}
						</Button>
					</form>
				</Card>

				<Card title={copy.subjectAssignment}>
					<form className="space-y-4" onSubmit={(event) => void saveSubject(event)}>
						<Field label={copy.subjectId}>
							<Input
								value={subjectState.subjectId}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setSubjectState((current) => ({ ...current, subjectId: event.target.value }))
								}
							/>
						</Field>
						<Field label={copy.attributesJson} hint={copy.attributesJsonExampleSubject}>
							<InputArea
								value={subjectState.attributes}
								onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
									setSubjectState((current) => ({ ...current, attributes: event.target.value }))
								}
							/>
						</Field>
						<Button variant="primary" type="submit">
							{copy.saveSubject}
						</Button>
					</form>
				</Card>

				<Card title={copy.resourceAssignment}>
					<form className="space-y-4" onSubmit={(event) => void saveResource(event)}>
						<Field label={copy.resourceId}>
							<Input
								value={resourceState.resourceId}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setResourceState((current) => ({ ...current, resourceId: event.target.value }))
								}
							/>
						</Field>
						<Field label={copy.attributesJson} hint={copy.attributesJsonExampleResource}>
							<InputArea
								value={resourceState.attributes}
								onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
									setResourceState((current) => ({ ...current, attributes: event.target.value }))
								}
							/>
						</Field>
						<Button variant="primary" type="submit">
							{copy.saveResource}
						</Button>
					</form>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				<Card title={copy.attributesTitle}>
					{!data?.items.length ? (
						<EmptyState title={copy.noAttributes} description={copy.noAttributesDescription} />
					) : (
						data.items.map((item) => (
							<div
								className="mb-3 rounded-xl border border-kumo-line bg-kumo-base p-3 text-kumo-default"
								key={item.key}
							>
								<div className="font-medium text-kumo-default">{item.label}</div>
								<div className="mt-1 text-sm text-kumo-subtle">{item.key}</div>
								<div className="mt-2">
									<Pill>{item.targetType}</Pill>
								</div>
							</div>
						))
					)}
				</Card>
				<Card title={copy.subjectsTitle}>
					{!subjectData?.items.length ? (
						<EmptyState title={copy.noSubjects} description={copy.noSubjectsDescription} />
					) : (
						subjectData.items.map((item, index) => (
							<div
								className="mb-3 rounded-xl border border-kumo-line bg-kumo-base p-3 text-kumo-default"
								key={item.subjectId ?? `subject-${index}`}
							>
								<div className="font-medium text-kumo-default">
									{item.subjectId ?? copy.unknownSubject}
								</div>
								<div className="mt-1 break-all text-sm text-kumo-subtle">
									{Object.entries(item.attributes)
										.map(([key, value]) => `${key}=${value}`)
										.join(", ")}
								</div>
							</div>
						))
					)}
				</Card>
				<Card title={copy.resourcesTitle}>
					{!resourceData?.items.length ? (
						<EmptyState title={copy.noResources} description={copy.noResourcesDescription} />
					) : (
						resourceData.items.map((item, index) => (
							<div
								className="mb-3 rounded-xl border border-kumo-line bg-kumo-base p-3 text-kumo-default"
								key={item.resourceId ?? `resource-${index}`}
							>
								<div className="font-medium text-kumo-default">
									{item.resourceId ?? copy.unknownResource}
								</div>
								<div className="mt-1 break-all text-sm text-kumo-subtle">
									{Object.entries(item.attributes)
										.map(([key, value]) => `${key}=${value}`)
										.join(", ")}
								</div>
							</div>
						))
					)}
				</Card>
			</div>
		</PageShell>
	);
}

function AbacPoliciesPage() {
	const { i18n } = useLingui();
	const copy = getExampleAdminCopy(i18n.locale);
	const { data, error, loading, reload } =
		usePluginData<AbacPoliciesResponse>("abac/policies/list");
	const [notice, setNotice] = React.useState<string | null>(null);
	const [saveError, setSaveError] = React.useState<string | null>(null);
	const [formState, setFormState] = React.useState<{
		id: string;
		label: string;
		effect: AbacEffect;
		actions: string;
		requiredSubject: string;
		requiredResource: string;
		requiredContext: string;
	}>({
		id: "",
		label: "",
		effect: "allow",
		actions: "content.read",
		requiredSubject: '{"tenant_id":"tenant-a"}',
		requiredResource: '{"resource_status":"published"}',
		requiredContext: '{"region_scope":"6201"}',
	});

	const savePolicy = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setNotice(null);
		setSaveError(null);

		const subject = parseJsonMap(formState.requiredSubject);
		const resource = parseJsonMap(formState.requiredResource);
		const context = parseJsonMap(formState.requiredContext);

		if (!subject.ok || !resource.ok || !context.ok) {
			setSaveError(copy.oneOrMoreJsonInvalid);
			return;
		}

		try {
			await saveAbacPolicy(
				{
					id: formState.id,
					label: formState.label,
					effect: formState.effect,
					actions: fromCsv(formState.actions),
					requiredSubject: subject.data,
					requiredResource: resource.data,
					requiredContext: context.data,
				},
				await createAdminApiRequestOptions(),
			);
			setFormState({
				id: "",
				label: "",
				effect: "allow",
				actions: "content.read",
				requiredSubject: '{"tenant_id":"tenant-a"}',
				requiredResource: '{"resource_status":"published"}',
				requiredContext: '{"region_scope":"6201"}',
			});
			setNotice(copy.policySaved);
			await reload();
		} catch (cause) {
			setSaveError(cause instanceof Error ? cause.message : copy.failedToSaveAbacPolicy);
		}
	};

	if (loading) return <LoadingState label={copy.loadingAbacPolicies} />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;

	return (
		<PageShell>
			<PageHeader
				eyebrow={copy.abacEyebrow}
				title={copy.policyRules}
				description={copy.policyRulesDescription}
			/>
			<div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
				<Card title={copy.addPolicy} description={copy.addPolicyDescription}>
					<form className="space-y-4" onSubmit={(event) => void savePolicy(event)}>
						<Feedback message={notice} />
						<Feedback message={saveError} tone="danger" />
						<Field label={copy.policyId}>
							<Input
								value={formState.id}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setFormState((current) => ({ ...current, id: event.target.value }))
								}
							/>
						</Field>
						<Field label={copy.label}>
							<Input
								value={formState.label}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setFormState((current) => ({ ...current, label: event.target.value }))
								}
							/>
						</Field>
						<Field label={copy.effect}>
							<Select
								value={formState.effect}
								onValueChange={(value) =>
									setFormState((current) => ({
										...current,
										effect: (value as AbacEffect | null) ?? "allow",
									}))
								}
							>
								<Select.Option value="allow">{copy.allow}</Select.Option>
								<Select.Option value="deny">{copy.deny}</Select.Option>
							</Select>
						</Field>
						<Field label={copy.actions} hint={copy.actionsHint}>
							<Input
								value={formState.actions}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setFormState((current) => ({ ...current, actions: event.target.value }))
								}
							/>
						</Field>
						<Field label={copy.requiredSubjectJson}>
							<InputArea
								value={formState.requiredSubject}
								onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
									setFormState((current) => ({ ...current, requiredSubject: event.target.value }))
								}
							/>
						</Field>
						<Field label={copy.requiredResourceJson}>
							<InputArea
								value={formState.requiredResource}
								onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
									setFormState((current) => ({ ...current, requiredResource: event.target.value }))
								}
							/>
						</Field>
						<Field label={copy.requiredContextJson}>
							<InputArea
								value={formState.requiredContext}
								onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
									setFormState((current) => ({ ...current, requiredContext: event.target.value }))
								}
							/>
						</Field>
						<Button variant="primary" type="submit">
							{copy.savePolicy}
						</Button>
					</form>
				</Card>

				<Card
					title={copy.existingPolicies}
					description={copy.existingPoliciesDescription(data?.items.length ?? 0)}
				>
					{!data?.items.length ? (
						<EmptyState title={copy.noPolicies} description={copy.noPoliciesDescription} />
					) : (
						<div className="space-y-3">
							{data.items.map((item) => (
								<div
									className="rounded-xl border border-kumo-line bg-kumo-base p-4 text-kumo-default"
									key={item.id}
								>
									<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
										<div className="font-medium text-kumo-default">{item.label}</div>
										<Pill tone={item.effect === "allow" ? "success" : "danger"}>{item.effect}</Pill>
									</div>
									<div className="mt-1 break-all text-sm text-kumo-subtle">{item.id}</div>
									<div className="mt-2 text-sm text-kumo-subtle">
										{copy.actionsLabel}: {toCsv(item.actions) || copy.none}
									</div>
								</div>
							))}
						</div>
					)}
				</Card>
			</div>
		</PageShell>
	);
}

function AbacPreviewPage() {
	const { i18n } = useLingui();
	const copy = getExampleAdminCopy(i18n.locale);
	const { data: subjectData } = usePluginData<AbacAssignmentsResponse>("abac/subjects/list");
	const { data: resourceData } = usePluginData<AbacAssignmentsResponse>("abac/resources/list");
	const [subjectId, setSubjectId] = React.useState("user-demo-editor");
	const [resourceId, setResourceId] = React.useState("resource-public-post");
	const [action, setAction] = React.useState("content.read");
	const [contextAttributes, setContextAttributes] = React.useState('{"region_scope":"6201"}');
	const [preview, setPreview] = React.useState<AbacPreviewResponse | null>(null);
	const [error, setError] = React.useState<string | null>(null);
	const [running, setRunning] = React.useState(false);

	const runPreview = async (route: "abac/preview" | "abac/enforce-demo") => {
		setError(null);
		setPreview(null);
		const parsed = parseJsonMap(contextAttributes);
		if (!parsed.ok) {
			setError(parsed.error);
			return;
		}

		setRunning(true);
		try {
			const payload = {
				subjectId,
				resourceId,
				action,
				contextAttributes: parsed.data,
			};
			setPreview(
				route === "abac/enforce-demo"
					? await runAbacEnforceDemo<AbacPreviewResponse>(
							payload,
							await createAdminApiRequestOptions(),
						)
					: await previewAbac<AbacPreviewResponse>(
							payload,
							await createAdminApiRequestOptions(),
						),
			);
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : copy.failedToEvaluateAbacPolicy);
		} finally {
			setRunning(false);
		}
	};

	return (
		<PageShell width="wide">
			<PageHeader
				eyebrow={copy.abacEyebrow}
				title={copy.decisionPreview}
				description={copy.decisionPreviewDescription}
			/>
			<Card title={copy.decisionInput}>
				<div className="grid gap-4 md:grid-cols-2">
					<Field label={copy.subject}>
						<Select value={subjectId} onValueChange={(value) => setSubjectId(value ?? "")}>
							{subjectData?.items.map((item, index) => {
								const value = item.subjectId ?? `subject-${index}`;
								return (
									<Select.Option key={value} value={value}>
										{item.subjectId ?? value}
									</Select.Option>
								);
							})}
						</Select>
					</Field>
					<Field label={copy.resource}>
						<Select value={resourceId} onValueChange={(value) => setResourceId(value ?? "")}>
							{resourceData?.items.map((item, index) => {
								const value = item.resourceId ?? `resource-${index}`;
								return (
									<Select.Option key={value} value={value}>
										{item.resourceId ?? value}
									</Select.Option>
								);
							})}
						</Select>
					</Field>
				</div>
				<div className="mt-4 grid gap-4 md:grid-cols-2">
					<Field label={copy.action}>
						<Input
							value={action}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
								setAction(event.target.value)
							}
						/>
					</Field>
					<Field label={copy.contextAttributesJson}>
						<InputArea
							value={contextAttributes}
							onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
								setContextAttributes(event.target.value)
							}
						/>
					</Field>
				</div>
				<div className="mt-4 flex flex-wrap gap-3">
					<Button
						variant="primary"
						disabled={running}
						onClick={() => void runPreview("abac/preview")}
						type="button"
					>
						{running ? copy.loadingAbacDecision : copy.previewPolicy}
					</Button>
					<Button
						variant="secondary"
						disabled={running}
						onClick={() => void runPreview("abac/enforce-demo")}
						type="button"
					>
						{copy.runProtectedDemo}
					</Button>
				</div>
			</Card>

			<Feedback message={error} tone="danger" />
			{preview ? (
				<Card title={copy.decisionResult}>
					<div className="mb-4 flex items-center gap-2">
						<Pill tone={preview.allowed ? "success" : "danger"}>
							{preview.allowed ? copy.allowed : copy.denied}
						</Pill>
						<Pill>{preview.effect}</Pill>
					</div>
					<p className="text-sm leading-6 text-kumo-subtle">{preview.reason}</p>
					<KeyValueList
						items={[
							[copy.matchedPolicies, toCsv(preview.matchedPolicyIds) || copy.none],
							[copy.missingAttributes, toCsv(preview.missingAttributes) || copy.none],
						]}
					/>
				</Card>
			) : null}
		</PageShell>
	);
}

function StatusBadgeField({ value, onChange, label, id, minimal, required }: FieldWidgetProps) {
	const copy = getExampleAdminCopy(getCurrentAdminLocale());
	const current = typeof value === "string" && value ? value : "draft";
	const tone = current === "approved" ? "success" : current === "review" ? "warning" : "neutral";

	return (
		<div className="space-y-2">
			{!minimal ? (
				<label className="block text-sm font-medium text-kumo-default" htmlFor={id}>
					{label} {required ? <span className="text-kumo-danger">*</span> : null}
				</label>
			) : null}
			<div className="flex items-center gap-3">
				<Select value={current} onValueChange={(nextValue) => onChange(nextValue ?? "")}>
					<Select.Option value="draft">{copy.draft}</Select.Option>
					<Select.Option value="review">{copy.review}</Select.Option>
					<Select.Option value="approved">{copy.approved}</Select.Option>
				</Select>
				<Pill tone={tone}>
					{current === "approved" ? copy.approved : current === "review" ? copy.review : copy.draft}
				</Pill>
			</div>
		</div>
	);
}

export function createSikesraImportPreviewCreatePayload({
	batchId,
	rows,
	columnMappings,
	fileName,
	selectedSheet,
}: {
	batchId: string;
	rows: unknown[];
	columnMappings: Record<string, string>;
	fileName: string | null;
	selectedSheet: string;
}): SikesraImportCreateRequest {
	return {
		batchId,
		mappingTemplateId: `${batchId}:mapping`,
		mappingTemplateName: selectedSheet,
		fileFormat: "xlsx",
		sourceFilename: fileName ?? "sikesra-preview.xlsx",
		mapping: columnMappings,
		rows,
	};
}

export function createSikesraImportPreviewPromotePayload(
	batchId: string,
): SikesraImportPromotionRequest {
	return { batchId };
}

const EXCEL_FILE_EXTENSION_REGEX = /\.(xlsx|xls)$/i;

function ImportPage() {
	const { i18n } = useLingui();
	const copy = getExampleAdminCopy(i18n.locale);
	const importStepIds = SIKESRA_IMPORT_WORKFLOW_STEPS.map((step) => step.id);
	const getImportStepIndex = (id: string) => importStepIds.indexOf(id);
	const clearingDuplicateDecisions = new Set(["not_duplicate", "cleared", "false_positive"]);
	const [importStep, setImportStep] = React.useState(0);
	const [fileName, setFileName] = React.useState<string | null>(null);
	const [selectedSheet, setSelectedSheet] = React.useState<string>("Sheet1");
	const [columnMappings, setColumnMappings] = React.useState<Record<string, string>>({
		code: "A",
		label: "B",
		entityType: "C",
		sensitivity: "D",
		villageCode: "E",
		publicSummary: "F",
	});
	const [notice, setNotice] = React.useState<string | null>(null);
	const [error, setError] = React.useState<string | null>(null);
	const [promoting, setPromoting] = React.useState(false);
	const [duplicateDecisions, setDuplicateDecisions] = React.useState<
		Record<string, { decision: string; reason: string }>
	>({});

	const sheets = ["Sheet1", "Sheet2_Templates", "Sheet3_References"];

	const stagingRows = [
		{
			id: "staged-01",
			code: "DUP-102",
			label: "Masjid Raya Baiturrahman",
			entityType: "rumah_ibadah",
			sensitivity: "public_safe",
			provinceCode: "62",
			regencyCode: "6201",
			districtCode: "620102",
			villageCode: "6201021009",
			publicSummary: "Masjid Raya Baiturrahman di desa referensi.",
		},
		{
			id: "staged-02",
			code: "DUP-102",
			label: "Ustadz H. Syukron",
			entityType: "guru_agama",
			sensitivity: "restricted",
			provinceCode: "62",
			regencyCode: "6201",
			districtCode: "620102",
			villageCode: "6201021005",
			publicSummary: "Data pengajar ustadz referensi.",
		},
		{
			id: "staged-03",
			code: "DS-502",
			label: "Slamet Rahardjo",
			entityType: "disabilitas",
			sensitivity: "highly_restricted",
			provinceCode: "62",
			regencyCode: "6201",
			districtCode: "620102",
			villageCode: "6201021003",
			publicSummary: "Data disabilitas di wilayah referensi.",
		},
	];
	const validationErrors: Array<{ rowId: string; message: string }> = [];
	const duplicateCandidates = [
		{
			rowId: "staged-02",
			rowNumber: 2,
			incomingLabel: "Ustadz H. Syukron",
			existingLabel: "Ustadz Syukron",
			matchScore: "91%",
			reason: "Similar label, entity type, and village scope.",
		},
	];
	const unresolvedDuplicates = duplicateCandidates.filter((candidate) => {
		const decision = duplicateDecisions[candidate.rowId];
		return (
			!decision?.decision ||
			!clearingDuplicateDecisions.has(decision.decision) ||
			!decision.reason.trim()
		);
	});
	const canPromote = validationErrors.length === 0 && unresolvedDuplicates.length === 0;

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const allowedWorkbook = EXCEL_FILE_EXTENSION_REGEX.test(file.name);
		if (!allowedWorkbook) {
			setFileName(null);
			setError("Select a valid Excel workbook with .xlsx or .xls extension.");
			setImportStep(getImportStepIndex("upload"));
			return;
		}
		setError(null);
		setFileName(file.name);
		setImportStep(getImportStepIndex("preview"));
	};

	const handlePromote = async () => {
		if (!canPromote) {
			setError("Resolve validation errors and duplicate-review decisions before promotion.");
			return;
		}
		setPromoting(true);
		setError(null);
		try {
			const batchId = `ui-import-${Date.now()}`;
			const created = await createImportBatch<ImportRouteResult>(
				createSikesraImportPreviewCreatePayload({
					batchId,
					rows: stagingRows,
					columnMappings,
					fileName,
					selectedSheet,
				}),
				await createAdminApiRequestOptions(),
			);
			if (!created.success) throw new Error(created.error?.message ?? copy.requestFailed);
			const createdBatchId = created.batchId ?? batchId;
			for (const candidate of duplicateCandidates) {
				const decision = duplicateDecisions[candidate.rowId];
				if (!decision) continue;
				const decided = await decideDuplicate<ImportRouteResult>(
					{
						candidateId: `${createdBatchId}:row:${candidate.rowNumber}:duplicate-code`,
						decision: decision.decision,
						reason: decision.reason,
					},
					await createAdminApiRequestOptions(),
				);
				if (!decided.success) throw new Error(decided.error?.message ?? copy.requestFailed);
			}
			const promoted = await promoteImportRows<ImportRouteResult>(
				createSikesraImportPreviewPromotePayload(createdBatchId),
				await createAdminApiRequestOptions(),
			);
			if (!promoted.success) throw new Error(promoted.error?.message ?? copy.requestFailed);
			setNotice(copy.promotedSuccessfully);
			setImportStep(getImportStepIndex("summary"));
		} catch (err) {
			setError(err instanceof Error ? err.message : copy.requestFailed);
		} finally {
			setPromoting(false);
		}
	};

	return (
		<PageShell>
			<PageHeader
				eyebrow={copy.importEyebrow}
				title={copy.importTitle}
				description={copy.importDescription}
			/>

			{/* Progress Steps Header */}
			<div className="w-full overflow-x-auto pb-5 mb-6 flex items-center justify-between gap-2 border-b border-kumo-line/40 select-none">
				<div className="flex items-center min-w-max w-full px-2 justify-between relative" style={{ minWidth: "650px" }}>
					{/* Background connecting track line */}
					<div className="absolute top-[18px] left-[5%] right-[5%] h-0.5 bg-kumo-line z-0" />
					
					{SIKESRA_IMPORT_WORKFLOW_STEPS.map((step, index) => {
						const isActive = index === importStep;
						const isCompleted = index < importStep;
						return (
							<div
								key={step.id}
								className="relative z-10 flex flex-col items-center"
								style={{ width: "132px" }}
							>
								<span
									className={cx(
										"flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold border transition-all duration-300",
										isActive ? "scale-110 shadow-md ring-4 ring-blue-500/25" : "",
									)}
									style={
										isActive
											? { backgroundColor: "#2563eb", borderColor: "#2563eb", color: "#ffffff" }
											: isCompleted
												? { backgroundColor: "#10b981", borderColor: "#10b981", color: "#ffffff" }
												: { backgroundColor: "var(--kumo-base, #ffffff)", borderColor: "var(--kumo-line, #e2e8f0)", color: "var(--kumo-subtle, #64748b)" }
									}
								>
									{isCompleted ? "✓" : index + 1}
								</span>
								<span
									className={cx(
										"mt-2 text-[10px] font-semibold transition-all duration-200 text-center w-full px-1",
										isActive
											? "text-kumo-brand font-bold"
											: isCompleted
												? "text-emerald-600 dark:text-emerald-400"
												: "text-kumo-subtle",
									)}
									style={
										isActive
											? { color: "#2563eb" }
											: isCompleted
												? { color: "#10b981" }
												: undefined
									}
								>
									{step.label}
								</span>
							</div>
						);
					})}
				</div>
			</div>

			<Feedback message={notice} tone="success" />
			<Feedback message={error} tone="danger" />

			<div className="grid gap-6">
				{importStep === 0 && (
					<Card title={copy.uploadWorkbook}>
						<div className="border-2 border-dashed rounded-xl p-8 text-center bg-kumo-base/50 text-kumo-default">
							<p className="text-sm text-kumo-subtle mb-4">{copy.workbookFile}</p>
							<input
								type="file"
								accept=".xlsx, .xls"
								id="excel-file-upload"
								className="hidden"
								onChange={handleFileSelect}
							/>
							<label htmlFor="excel-file-upload" className="inline-block">
								<span className="inline-flex items-center justify-center rounded-xl bg-kumo-brand px-4 py-2 text-sm font-semibold text-white cursor-pointer hover:bg-kumo-brand/90 transition">
									{copy.selectFile}
								</span>
							</label>
						</div>
					</Card>
				)}

				{importStep === 1 && (
					<Card title={copy.selectSheet}>
						<div className="space-y-4">
							<p className="text-sm text-kumo-subtle">
								Selected file: <strong>{fileName}</strong>
							</p>
							<Field label="Choose Spreadsheet Sheet">
								<Select
									value={selectedSheet}
									onValueChange={(val) => setSelectedSheet(val ?? "Sheet1")}
								>
									{sheets.map((sh) => (
										<Select.Option value={sh} key={sh}>
											{sh}
										</Select.Option>
									))}
								</Select>
							</Field>
							<div className="flex gap-2">
								<Button variant="secondary" onClick={() => setImportStep(getImportStepIndex("upload"))}>
									Back
								</Button>
								<Button variant="primary" onClick={() => setImportStep(getImportStepIndex("map"))}>
									Next
								</Button>
							</div>
						</div>
					</Card>
				)}

				{importStep === getImportStepIndex("map") && (
					<Card title={copy.mapColumns}>
						<div className="space-y-4">
							<p className="text-sm text-kumo-subtle">
								Map Excel columns (A, B, C...) to SIKESRA fields:
							</p>
							<div className="grid gap-4 md:grid-cols-3">
								<Field label="Entity Code (SIKESRA ID)">
									<Input
										value={columnMappings.code}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											setColumnMappings((prev) => ({ ...prev, code: e.target.value }))
										}
									/>
								</Field>
								<Field label="Identity Label / Name">
									<Input
										value={columnMappings.label}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											setColumnMappings((prev) => ({ ...prev, label: e.target.value }))
										}
									/>
								</Field>
								<Field label="Entity Type Column">
									<Input
										value={columnMappings.entityType}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											setColumnMappings((prev) => ({ ...prev, entityType: e.target.value }))
										}
									/>
								</Field>
								<Field label="Sensitivity classification">
									<Input
										value={columnMappings.sensitivity}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											setColumnMappings((prev) => ({ ...prev, sensitivity: e.target.value }))
										}
									/>
								</Field>
								<Field label="Village Code Column">
									<Input
										value={columnMappings.villageCode}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											setColumnMappings((prev) => ({ ...prev, villageCode: e.target.value }))
										}
									/>
								</Field>
								<Field label="Public Summary Column">
									<Input
										value={columnMappings.publicSummary}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											setColumnMappings((prev) => ({ ...prev, publicSummary: e.target.value }))
										}
									/>
								</Field>
							</div>
							<div className="flex gap-2">
								<Button variant="secondary" onClick={() => setImportStep(getImportStepIndex("preview"))}>
									Back
								</Button>
								<Button
									variant="primary"
									onClick={() => {
										setNotice(copy.mappingValidationPassed);
										setImportStep(getImportStepIndex("validate"));
									}}
								>
									Validate & Next
								</Button>
							</div>
						</div>
					</Card>
				)}

				{importStep === getImportStepIndex("validate") && (
					<Card
						title={copy.previewStaging}
						description="Inspect valid rows staged for duplicate review and promotion. Identifiers and types are verified."
					>
						<div className="space-y-4">
							<div className="grid gap-3 md:grid-cols-3">
								<MetricCard label="Valid rows" value={String(stagingRows.length - validationErrors.length)} />
								<MetricCard label="Invalid rows" value={String(validationErrors.length)} />
								<MetricCard label="Duplicate candidates" value={String(duplicateCandidates.length)} />
							</div>
							<div className="overflow-x-auto rounded-xl border">
								<table className="w-full text-xs text-left">
									<thead>
										<tr className="bg-kumo-tint border-b uppercase font-semibold text-kumo-subtle">
											<th className="p-3" style={{ padding: "12px" }}>Code</th>
											<th className="p-3" style={{ padding: "12px" }}>Label</th>
											<th className="p-3" style={{ padding: "12px" }}>Type</th>
											<th className="p-3" style={{ padding: "12px" }}>Region (Desa)</th>
											<th className="p-3" style={{ padding: "12px" }}>Sensitivity</th>
										</tr>
									</thead>
									<tbody>
										{stagingRows.map((row) => (
											<tr className="border-b" key={row.id}>
												<td className="p-3 font-mono font-bold text-kumo-brand" style={{ padding: "12px" }}>{row.code}</td>
												<td className="p-3 font-medium text-kumo-default" style={{ padding: "12px" }}>{row.label}</td>
												<td className="p-3 text-kumo-subtle" style={{ padding: "12px" }}>{row.entityType}</td>
												<td className="p-3 text-kumo-subtle" style={{ padding: "12px" }}>{row.villageCode}</td>
												<td className="p-3" style={{ padding: "12px" }}>
													<Pill tone={row.sensitivity === "public_safe" ? "success" : "warning"}>
														{row.sensitivity}
													</Pill>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							<div className="flex gap-2">
								<Button variant="secondary" onClick={() => setImportStep(getImportStepIndex("map"))}>
									Back
								</Button>
								<Button variant="primary" onClick={() => setImportStep(getImportStepIndex("duplicate-review"))}>
									Review duplicates
								</Button>
							</div>
						</div>
					</Card>
				)}

				{importStep === getImportStepIndex("duplicate-review") && (
					<Card
						title="Duplicate review"
						description="Resolve duplicate-risk rows before promotion. Every decision requires a reason and is audit-relevant."
					>
						<div className="space-y-4">
							{duplicateCandidates.map((candidate) => {
								const decision = duplicateDecisions[candidate.rowId] ?? { decision: "", reason: "" };
								return (
									<div className="rounded-xl border p-4" key={candidate.rowId}>
										<div className="grid gap-3 md:grid-cols-3">
											<div>
												<p className="text-xs font-semibold text-kumo-subtle">Incoming row</p>
												<p className="font-medium text-kumo-default">{candidate.incomingLabel}</p>
											</div>
											<div>
												<p className="text-xs font-semibold text-kumo-subtle">Possible match</p>
												<p className="font-medium text-kumo-default">{candidate.existingLabel}</p>
											</div>
											<div>
												<p className="text-xs font-semibold text-kumo-subtle">Match score</p>
												<Pill tone="warning">{candidate.matchScore}</Pill>
											</div>
										</div>
										<p className="mt-3 text-sm text-kumo-subtle">{candidate.reason}</p>
										<div className="mt-4 grid gap-3 md:grid-cols-2">
											<Field label="Decision">
												<Select
													value={decision.decision}
													onValueChange={(value) =>
														setDuplicateDecisions((prev) => ({
															...prev,
															[candidate.rowId]: { ...decision, decision: value ?? "" },
														}))
													}
												>
													<Select.Option value="not_duplicate">Create as separate record</Select.Option>
													<Select.Option value="cleared">Cleared after manual review</Select.Option>
													<Select.Option value="false_positive">False-positive duplicate match</Select.Option>
												</Select>
											</Field>
											<Field label="Decision reason">
												<InputArea
													value={decision.reason}
													onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
														setDuplicateDecisions((prev) => ({
															...prev,
															[candidate.rowId]: { ...decision, reason: e.target.value },
														}))
													}
												/>
											</Field>
										</div>
									</div>
								);
							})}
							{!canPromote && (
								<Feedback
									message="Promotion is blocked until each duplicate candidate has a decision and reason."
									tone="info"
								/>
							)}
							<div className="flex gap-2">
								<Button variant="secondary" onClick={() => setImportStep(getImportStepIndex("validate"))}>
									Back
								</Button>
								<Button
									variant="primary"
									disabled={!canPromote}
									onClick={() => setImportStep(getImportStepIndex("promote"))}
								>
									Continue to promote
								</Button>
							</div>
						</div>
					</Card>
				)}

				{importStep === getImportStepIndex("promote") && (
					<Card title="Promote valid rows" description="Final promotion is available only after validation and duplicate review pass.">
						<div className="space-y-4">
							<div className="grid gap-3 md:grid-cols-3">
								<MetricCard label="Rows ready" value={String(stagingRows.length - validationErrors.length)} />
								<MetricCard label="Duplicate decisions" value={String(duplicateCandidates.length - unresolvedDuplicates.length)} />
								<MetricCard label="Audit events" value={String(duplicateCandidates.length + 1)} />
							</div>
							<div className="flex gap-2">
								<Button variant="secondary" onClick={() => setImportStep(getImportStepIndex("duplicate-review"))}>
									Back
								</Button>
								<Button variant="primary" disabled={promoting || !canPromote} onClick={() => void handlePromote()}>
									{promoting ? "Promoting..." : copy.promoteSelectedRows}
								</Button>
							</div>
						</div>
					</Card>
				)}

				{importStep === getImportStepIndex("summary") && (
					<Card title={copy.importReport}>
						<div className="text-center p-6 space-y-4 bg-kumo-tint/20 rounded-xl text-kumo-default">
							<div className="text-4xl">🎉</div>
							<h3 className="font-semibold text-lg text-kumo-default">
								{copy.promotedSuccessfully}
							</h3>
							<p className="text-xs text-kumo-subtle">
								Promoted {stagingRows.length} entities into SIKESRA Registry queue.
							</p>
							<Button
								variant="primary"
								onClick={() => {
									setNotice(null);
									setImportStep(0);
								}}
							>
								Upload New File
							</Button>
						</div>
					</Card>
				)}
			</div>
		</PageShell>
	);
}

export const widgets: PluginAdminExports["widgets"] = {
	"governance-status": GovernanceWidget,
	"access-rights-health": AccessRightsHealthWidget,
	"abac-policy-status": AbacPolicyStatusWidget,
};

export function RegionsPage() {
	const { i18n } = useLingui();
	const copy = getExampleAdminCopy(i18n.locale);

	const {
		data: fetchedRegions,
		loading: loadingRegions,
		reload: reloadRegions,
	} = usePluginData<AdministrativeProvince[]>("regions/get");
	const [regions, setRegions] = React.useState<AdministrativeProvince[]>([]);
	const [saving, setSaving] = React.useState(false);
	const [isDirty, setIsDirty] = React.useState(false);
	const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
	const [errMsg, setErrMsg] = React.useState<string | null>(null);

	// Selections
	const [selectedProvinceCode, setSelectedProvinceCode] = React.useState<string>("");
	const [selectedRegencyCode, setSelectedRegencyCode] = React.useState<string>("");
	const [selectedDistrictCode, setSelectedDistrictCode] = React.useState<string>("");
	const [selectedVillageCode, setSelectedVillageCode] = React.useState<string>("");

	// Active Form for CRUD operations
	// type: 'add' | 'edit', level: 'province' | 'regency' | 'district' | 'village'
	const [activeForm, setActiveForm] = React.useState<{
		type: "add" | "edit";
		level: "province" | "regency" | "district" | "village";
		oldCode?: string;
		name: string;
		code: string;
	} | null>(null);

	React.useEffect(() => {
		if (fetchedRegions) {
			setRegions(fetchedRegions);
		}
	}, [fetchedRegions]);

	// Counts
	const totalProvinces = regions.length;
	const totalRegencies = regions.reduce((acc, p) => acc + (p.regencies?.length ?? 0), 0);
	const totalDistricts = regions.reduce(
		(acc, p) => acc + (p.regencies?.reduce((acc2, r) => acc2 + (r.districts?.length ?? 0), 0) ?? 0),
		0,
	);
	const totalVillages = regions.reduce(
		(acc, p) =>
			acc +
			(p.regencies?.reduce(
				(acc2, r) =>
					acc2 + (r.districts?.reduce((acc3, d) => acc3 + (d.villages?.length ?? 0), 0) ?? 0),
				0,
			) ?? 0),
		0,
	);

	const activeProvince = regions.find((p) => p.code === selectedProvinceCode);
	const activeRegency = activeProvince?.regencies?.find((r) => r.code === selectedRegencyCode);
	const activeDistrict = activeRegency?.districts?.find((d) => d.code === selectedDistrictCode);

	// CRUD functions
	const handleSaveToBackend = async () => {
		setSaving(true);
		setSuccessMsg(null);
		setErrMsg(null);
		try {
			await saveRegions(regions, await createAdminApiRequestOptions());
			setSuccessMsg(copy.regionsSavedSuccessfully);
			setIsDirty(false);
			await reloadRegions();
		} catch (cause) {
			setErrMsg(cause instanceof Error ? cause.message : copy.failedToSaveRegions);
		} finally {
			setSaving(false);
		}
	};

	const handleReset = () => {
		if (fetchedRegions) {
			setRegions(fetchedRegions);
			setIsDirty(false);
			setSuccessMsg(null);
			setErrMsg(null);
			setActiveForm(null);
		}
	};

	// Validation check
	const validateCodeUniqueness = (level: string, code: string, oldCode?: string) => {
		if (!code.trim()) return false;
		if (code === oldCode) return true;

		if (level === "province") {
			return !regions.some((p) => p.code === code);
		}
		if (level === "regency") {
			return !regions.some((p) => p.regencies?.some((r) => r.code === code));
		}
		if (level === "district") {
			return !regions.some((p) =>
				p.regencies?.some((r) => r.districts?.some((d) => d.code === code)),
			);
		}
		if (level === "village") {
			return !regions.some((p) =>
				p.regencies?.some((r) =>
					r.districts?.some((d) => d.villages?.some((v) => v.code === code)),
				),
			);
		}
		return true;
	};

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!activeForm) return;

		const { type, level, oldCode, name, code } = activeForm;

		if (!name.trim()) {
			setErrMsg(copy.invalidName);
			return;
		}
		if (!code.trim() || !validateCodeUniqueness(level, code, oldCode)) {
			setErrMsg(copy.invalidCode);
			return;
		}

		setErrMsg(null);
		setIsDirty(true);

		if (type === "add") {
			if (level === "province") {
				setRegions((prev) => [...prev, { name, code, regencies: [] }]);
				setSelectedProvinceCode(code);
			} else if (level === "regency") {
				setRegions((prev) =>
					prev.map((p) =>
						p.code === selectedProvinceCode
							? {
									...p,
									regencies: [...(p.regencies ?? []), { name, code, districts: [] }],
								}
							: p,
					),
				);
				setSelectedRegencyCode(code);
			} else if (level === "district") {
				setRegions((prev) =>
					prev.map((p) =>
						p.code === selectedProvinceCode
							? {
									...p,
									regencies: p.regencies.map((r) =>
										r.code === selectedRegencyCode
											? {
													...r,
													districts: [...(r.districts ?? []), { name, code, villages: [] }],
												}
											: r,
									),
								}
							: p,
					),
				);
				setSelectedDistrictCode(code);
			} else if (level === "village") {
				setRegions((prev) =>
					prev.map((p) =>
						p.code === selectedProvinceCode
							? {
									...p,
									regencies: p.regencies.map((r) =>
										r.code === selectedRegencyCode
											? {
													...r,
													districts: r.districts.map((d) =>
														d.code === selectedDistrictCode
															? {
																	...d,
																	villages: [...(d.villages ?? []), { name, code }],
																}
															: d,
													),
												}
											: r,
									),
								}
							: p,
					),
				);
				setSelectedVillageCode(code);
			}
		} else {
			// Edit
			if (level === "province") {
				setRegions((prev) => prev.map((p) => (p.code === oldCode ? { ...p, name, code } : p)));
				setSelectedProvinceCode(code);
			} else if (level === "regency") {
				setRegions((prev) =>
					prev.map((p) =>
						p.code === selectedProvinceCode
							? {
									...p,
									regencies: p.regencies.map((r) =>
										r.code === oldCode ? { ...r, name, code } : r,
									),
								}
							: p,
					),
				);
				setSelectedRegencyCode(code);
			} else if (level === "district") {
				setRegions((prev) =>
					prev.map((p) =>
						p.code === selectedProvinceCode
							? {
									...p,
									regencies: p.regencies.map((r) =>
										r.code === selectedRegencyCode
											? {
													...r,
													districts: r.districts.map((d) =>
														d.code === oldCode ? { ...d, name, code } : d,
													),
												}
											: r,
									),
								}
							: p,
					),
				);
				setSelectedDistrictCode(code);
			} else if (level === "village") {
				setRegions((prev) =>
					prev.map((p) =>
						p.code === selectedProvinceCode
							? {
									...p,
									regencies: p.regencies.map((r) =>
										r.code === selectedRegencyCode
											? {
													...r,
													districts: r.districts.map((d) =>
														d.code === selectedDistrictCode
															? {
																	...d,
																	villages: d.villages.map((v) =>
																		v.code === oldCode ? { ...v, name, code } : v,
																	),
																}
															: d,
													),
												}
											: r,
									),
								}
							: p,
					),
				);
				setSelectedVillageCode(code);
			}
		}

		setActiveForm(null);
	};

	const handleDeleteNode = (
		level: "province" | "regency" | "district" | "village",
		code: string,
	) => {
		if (!window.confirm(copy.deleteConfirm)) return;

		setIsDirty(true);
		setErrMsg(null);

		if (level === "province") {
			setRegions((prev) => prev.filter((p) => p.code !== code));
			if (selectedProvinceCode === code) {
				setSelectedProvinceCode("");
				setSelectedRegencyCode("");
				setSelectedDistrictCode("");
				setSelectedVillageCode("");
			}
		} else if (level === "regency") {
			setRegions((prev) =>
				prev.map((p) =>
					p.code === selectedProvinceCode
						? {
								...p,
								regencies: p.regencies.filter((r) => r.code !== code),
							}
						: p,
				),
			);
			if (selectedRegencyCode === code) {
				setSelectedRegencyCode("");
				setSelectedDistrictCode("");
				setSelectedVillageCode("");
			}
		} else if (level === "district") {
			setRegions((prev) =>
				prev.map((p) =>
					p.code === selectedProvinceCode
						? {
								...p,
								regencies: p.regencies.map((r) =>
									r.code === selectedRegencyCode
										? {
												...r,
												districts: r.districts.filter((d) => d.code !== code),
											}
										: r,
								),
							}
						: p,
				),
			);
			if (selectedDistrictCode === code) {
				setSelectedDistrictCode("");
				setSelectedVillageCode("");
			}
		} else if (level === "village") {
			setRegions((prev) =>
				prev.map((p) =>
					p.code === selectedProvinceCode
						? {
								...p,
								regencies: p.regencies.map((r) =>
									r.code === selectedRegencyCode
										? {
												...r,
												districts: r.districts.map((d) =>
													d.code === selectedDistrictCode
														? {
																...d,
																villages: d.villages.filter((v) => v.code !== code),
															}
														: d,
												),
											}
										: r,
								),
							}
						: p,
				),
			);
			if (selectedVillageCode === code) {
				setSelectedVillageCode("");
			}
		}
	};

	if (loadingRegions)
		return (
			<PageShell>
				<LoadingState label={copy.loadingPluginOverview} />
			</PageShell>
		);

	return (
		<PageShell width="wide">
			<PageHeader
				eyebrow="SIKESRA"
				title={copy.regionsTitle}
				description={copy.regionsDescription}
				actions={
					<div className="flex gap-2">
						{isDirty && (
							<Button variant="secondary" onClick={handleReset}>
								Reset
							</Button>
						)}
						<Button
							variant="primary"
							disabled={saving || !isDirty}
							onClick={() => void handleSaveToBackend()}
						>
							{saving ? copy.saving : copy.saveRegions}
						</Button>
					</div>
				}
			/>

			{isDirty && (
				<div
					className="rounded-xl border border-kumo-warning/30 bg-kumo-warning/10 px-4 py-3 text-sm text-kumo-warning flex items-center gap-2"
					style={{ padding: "12px 16px", marginBottom: "16px" }}
				>
					<span>⚠️</span>
					<span>
						Anda memiliki perubahan wilayah resmi yang belum disimpan ke server Cloudflare. Klik
						tombol &quot;Simpan Perubahan Wilayah&quot; di atas untuk menyimpan.
					</span>
				</div>
			)}

			<Feedback message={successMsg} tone="success" />
			<Feedback message={errMsg} tone="danger" />

			<div className="grid gap-4 grid-cols-2 md:grid-cols-4">
				<MetricCard label={copy.totalProvinces} value={totalProvinces} icon="🗺️" />
				<MetricCard label={copy.totalRegencies} value={totalRegencies} icon="🏛️" />
				<MetricCard label={copy.totalDistricts} value={totalDistricts} icon="🏘️" />
				<MetricCard label={copy.totalVillages} value={totalVillages} icon="🏠" />
			</div>

			<div className="grid gap-6">
				{/* Explorer Panel */}
				<section className="overflow-hidden rounded-2xl border border-kumo-line bg-kumo-base text-kumo-default shadow-sm">
					<div
						className="border-b border-kumo-line bg-kumo-tint/40 px-5 py-4 flex items-center justify-between"
						style={{ padding: "16px 20px" }}
					>
						<div>
							<h2 className="text-sm font-semibold text-kumo-default">
								Explorer Wilayah Administratif Resmi
							</h2>
							<p className="mt-0.5 text-xs text-kumo-subtle">
								Telusuri dan kelola struktur hierarki wilayah resmi di bawah ini.
							</p>
						</div>
					</div>
					<div
						className="p-5 grid gap-4 md:grid-cols-4 min-h-[400px]"
						style={{ padding: "20px" }}
					>
						{/* Provinces Column */}
						<div
							className="flex flex-col border border-kumo-line/80 rounded-xl bg-kumo-tint/10 p-3.5 space-y-3"
							style={{ padding: "14px" }}
						>
							<div className="flex items-center justify-between border-b border-kumo-line/60 pb-2">
								<span className="text-xs font-bold uppercase tracking-wider text-kumo-default">
									{copy.province}
								</span>
								<Button
									variant="secondary"
									size="xs"
									onClick={() =>
										setActiveForm({ type: "add", level: "province", name: "", code: "" })
									}
								>
									+ Tambah
								</Button>
							</div>
							<div className="flex-1 overflow-y-auto space-y-2 max-h-[300px] pr-1">
								{regions.map((p) => {
									const isSelected = p.code === selectedProvinceCode;
									return (
										<div
											key={p.code}
											className={cx(
												"group relative flex items-center justify-between px-3 py-2 text-xs rounded-lg border transition-all cursor-pointer",
												isSelected
													? "bg-kumo-brand/10 border-kumo-brand text-kumo-brand font-bold shadow-sm"
													: "bg-kumo-base border-kumo-line/60 text-kumo-default hover:bg-kumo-tint/40",
											)}
											onClick={() => {
												setSelectedProvinceCode(p.code);
												setSelectedRegencyCode("");
												setSelectedDistrictCode("");
												setSelectedVillageCode("");
											}}
										>
											<div className="truncate pr-12">
												<div>{p.name}</div>
												<div className="font-mono text-[9px] opacity-75 mt-0.5">Kode: {p.code}</div>
											</div>
											<div className="absolute right-2 top-2.5 hidden group-hover:flex items-center gap-1">
												<button
													type="button"
													className="p-1 text-kumo-brand hover:bg-kumo-brand/10 rounded"
													title="Edit"
													onClick={(e) => {
														e.stopPropagation();
														setActiveForm({
															type: "edit",
															level: "province",
															oldCode: p.code,
															name: p.name,
															code: p.code,
														});
													}}
												>
													✏️
												</button>
												<button
													type="button"
													className="p-1 text-kumo-danger hover:bg-kumo-danger/10 rounded"
													title="Delete"
													onClick={(e) => {
														e.stopPropagation();
														handleDeleteNode("province", p.code);
													}}
												>
													🗑️
												</button>
											</div>
										</div>
									);
								})}
							</div>
						</div>

						{/* Regencies Column */}
						<div
							className="flex flex-col border border-kumo-line/80 rounded-xl bg-kumo-tint/10 p-3.5 space-y-3"
							style={{ padding: "14px" }}
						>
							<div className="flex items-center justify-between border-b border-kumo-line/60 pb-2">
								<span className="text-xs font-bold uppercase tracking-wider text-kumo-default">
									{copy.regency}
								</span>
								<Button
									variant="secondary"
									size="xs"
									disabled={!selectedProvinceCode}
									onClick={() =>
										setActiveForm({ type: "add", level: "regency", name: "", code: "" })
									}
								>
									+ Tambah
								</Button>
							</div>
							<div className="flex-1 overflow-y-auto space-y-2 max-h-[300px] pr-1">
								{!selectedProvinceCode ? (
									<div className="text-center text-xs text-kumo-subtle italic py-10">
										Pilih provinsi terlebih dahulu.
									</div>
								) : activeProvince?.regencies?.length === 0 ? (
									<div className="text-center text-xs text-kumo-subtle italic py-10">
										Belum ada data kabupaten.
									</div>
								) : (
									activeProvince?.regencies?.map((r) => {
										const isSelected = r.code === selectedRegencyCode;
										return (
											<div
												key={r.code}
												className={cx(
													"group relative flex items-center justify-between px-3 py-2 text-xs rounded-lg border transition-all cursor-pointer",
													isSelected
														? "bg-kumo-brand/10 border-kumo-brand text-kumo-brand font-bold shadow-sm"
														: "bg-kumo-base border-kumo-line/60 text-kumo-default hover:bg-kumo-tint/40",
												)}
												onClick={() => {
													setSelectedRegencyCode(r.code);
													setSelectedDistrictCode("");
													setSelectedVillageCode("");
												}}
											>
												<div className="truncate pr-12">
													<div>{r.name}</div>
													<div className="font-mono text-[9px] opacity-75 mt-0.5">
														Kode: {r.code}
													</div>
												</div>
												<div className="absolute right-2 top-2.5 hidden group-hover:flex items-center gap-1">
													<button
														type="button"
														className="p-1 text-kumo-brand hover:bg-kumo-brand/10 rounded"
														title="Edit"
														onClick={(e) => {
															e.stopPropagation();
															setActiveForm({
																type: "edit",
																level: "regency",
																oldCode: r.code,
																name: r.name,
																code: r.code,
															});
														}}
													>
														✏️
													</button>
													<button
														type="button"
														className="p-1 text-kumo-danger hover:bg-kumo-danger/10 rounded"
														title="Delete"
														onClick={(e) => {
															e.stopPropagation();
															handleDeleteNode("regency", r.code);
														}}
													>
														🗑️
													</button>
												</div>
											</div>
										);
									})
								)}
							</div>
						</div>

						{/* Districts Column */}
						<div
							className="flex flex-col border border-kumo-line/80 rounded-xl bg-kumo-tint/10 p-3.5 space-y-3"
							style={{ padding: "14px" }}
						>
							<div className="flex items-center justify-between border-b border-kumo-line/60 pb-2">
								<span className="text-xs font-bold uppercase tracking-wider text-kumo-default">
									{copy.district}
								</span>
								<Button
									variant="secondary"
									size="xs"
									disabled={!selectedRegencyCode}
									onClick={() =>
										setActiveForm({ type: "add", level: "district", name: "", code: "" })
									}
								>
									+ Tambah
								</Button>
							</div>
							<div className="flex-1 overflow-y-auto space-y-2 max-h-[300px] pr-1">
								{!selectedRegencyCode ? (
									<div className="text-center text-xs text-kumo-subtle italic py-10">
										Pilih kabupaten terlebih dahulu.
									</div>
								) : activeRegency?.districts?.length === 0 ? (
									<div className="text-center text-xs text-kumo-subtle italic py-10">
										Belum ada data kecamatan.
									</div>
								) : (
									activeRegency?.districts?.map((d) => {
										const isSelected = d.code === selectedDistrictCode;
										return (
											<div
												key={d.code}
												className={cx(
													"group relative flex items-center justify-between px-3 py-2 text-xs rounded-lg border transition-all cursor-pointer",
													isSelected
														? "bg-kumo-brand/10 border-kumo-brand text-kumo-brand font-bold shadow-sm"
														: "bg-kumo-base border-kumo-line/60 text-kumo-default hover:bg-kumo-tint/40",
												)}
												onClick={() => {
													setSelectedDistrictCode(d.code);
													setSelectedVillageCode("");
												}}
											>
												<div className="truncate pr-12">
													<div>{d.name}</div>
													<div className="font-mono text-[9px] opacity-75 mt-0.5">
														Kode: {d.code}
													</div>
												</div>
												<div className="absolute right-2 top-2.5 hidden group-hover:flex items-center gap-1">
													<button
														type="button"
														className="p-1 text-kumo-brand hover:bg-kumo-brand/10 rounded"
														title="Edit"
														onClick={(e) => {
															e.stopPropagation();
															setActiveForm({
																type: "edit",
																level: "district",
																oldCode: d.code,
																name: d.name,
																code: d.code,
															});
														}}
													>
														✏️
													</button>
													<button
														type="button"
														className="p-1 text-kumo-danger hover:bg-kumo-danger/10 rounded"
														title="Delete"
														onClick={(e) => {
															e.stopPropagation();
															handleDeleteNode("district", d.code);
														}}
													>
														🗑️
													</button>
												</div>
											</div>
										);
									})
								)}
							</div>
						</div>

						{/* Villages Column */}
						<div
							className="flex flex-col border border-kumo-line/80 rounded-xl bg-kumo-tint/10 p-3.5 space-y-3"
							style={{ padding: "14px" }}
						>
							<div className="flex items-center justify-between border-b border-kumo-line/60 pb-2">
								<span className="text-xs font-bold uppercase tracking-wider text-kumo-default">
									{copy.village}
								</span>
								<Button
									variant="secondary"
									size="xs"
									disabled={!selectedDistrictCode}
									onClick={() =>
										setActiveForm({ type: "add", level: "village", name: "", code: "" })
									}
								>
									+ Tambah
								</Button>
							</div>
							<div className="flex-1 overflow-y-auto space-y-2 max-h-[300px] pr-1">
								{!selectedDistrictCode ? (
									<div className="text-center text-xs text-kumo-subtle italic py-10">
										Pilih kecamatan terlebih dahulu.
									</div>
								) : activeDistrict?.villages?.length === 0 ? (
									<div className="text-center text-xs text-kumo-subtle italic py-10">
										Belum ada data desa/kelurahan.
									</div>
								) : (
									activeDistrict?.villages?.map((v) => {
										const isSelected = v.code === selectedVillageCode;
										return (
											<div
												key={v.code}
												className={cx(
													"group relative flex items-center justify-between px-3 py-2 text-xs rounded-lg border transition-all cursor-pointer",
													isSelected
														? "bg-kumo-brand/10 border-kumo-brand text-kumo-brand font-bold shadow-sm"
														: "bg-kumo-base border-kumo-line/60 text-kumo-default hover:bg-kumo-tint/40",
												)}
												onClick={() => {
													setSelectedVillageCode(v.code);
												}}
											>
												<div className="truncate pr-12">
													<div>{v.name}</div>
													<div className="font-mono text-[9px] opacity-75 mt-0.5">
														Kode: {v.code}
													</div>
												</div>
												<div className="absolute right-2 top-2.5 hidden group-hover:flex items-center gap-1">
													<button
														type="button"
														className="p-1 text-kumo-brand hover:bg-kumo-brand/10 rounded"
														title="Edit"
														onClick={(e) => {
															e.stopPropagation();
															setActiveForm({
																type: "edit",
																level: "village",
																oldCode: v.code,
																name: v.name,
																code: v.code,
															});
														}}
													>
														✏️
													</button>
													<button
														type="button"
														className="p-1 text-kumo-danger hover:bg-kumo-danger/10 rounded"
														title="Delete"
														onClick={(e) => {
															e.stopPropagation();
															handleDeleteNode("village", v.code);
														}}
													>
														🗑️
													</button>
												</div>
											</div>
										);
									})
								)}
							</div>
						</div>
					</div>
				</section>

				{/* Editor Overlay Card */}
				{activeForm && (
					<Card
						title={
							activeForm.type === "add"
								? `${copy.addProvince.replace("Provinsi", "")} ${activeForm.level.toUpperCase()}`
								: `${copy.editNode} (${activeForm.level.toUpperCase()})`
						}
						description={`Masukkan nama dan kode unik untuk tingkat administratif ${activeForm.level}.`}
						actions={
							<Button variant="ghost" size="xs" onClick={() => setActiveForm(null)}>
								Tutup ✕
							</Button>
						}
					>
						<form onSubmit={handleFormSubmit} className="space-y-4 max-w-md">
							<Field label={copy.nodeName}>
								<Input
									value={activeForm.name}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										setActiveForm((prev) => (prev ? { ...prev, name: e.target.value } : null))
									}
									placeholder="Nama wilayah"
									required
								/>
							</Field>
							<Field
								label={copy.nodeCode}
								hint="Pastikan kode unik dan sesuai dengan pedoman administratif (BPS/Kemendagri)."
							>
								<Input
									value={activeForm.code}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										setActiveForm((prev) => (prev ? { ...prev, code: e.target.value } : null))
									}
									placeholder="Kode wilayah"
									required
								/>
							</Field>
							<div className="flex gap-2 pt-2">
								<Button variant="primary" type="submit">
									Konfirmasi
								</Button>
								<Button variant="secondary" type="button" onClick={() => setActiveForm(null)}>
									Batal
								</Button>
							</div>
						</form>
					</Card>
				)}
			</div>
		</PageShell>
	);
}

export function DataTypesPage() {
	const { i18n } = useLingui();
	const copy = getExampleAdminCopy(i18n.locale);

	const {
		data: fetchedDataTypes,
		loading: loadingDataTypes,
		reload: reloadDataTypes,
	} = usePluginData<SikesraParentType[]>("data-types/get");
	const [dataTypes, setDataTypes] = React.useState<SikesraParentType[]>([]);
	const [saving, setSaving] = React.useState(false);
	const [isDirty, setIsDirty] = React.useState(false);
	const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
	const [errMsg, setErrMsg] = React.useState<string | null>(null);

	// Selections
	const [selectedParentId, setSelectedParentId] = React.useState<string>("");

	// Active Form for CRUD operations
	// type: 'add' | 'edit', level: 'parent' | 'subtype'
	const [activeForm, setActiveForm] = React.useState<{
		type: "add" | "edit";
		level: "parent" | "subtype";
		oldCode?: string;
		oldId?: string;
		id: string; // for parent
		code: string; // 2 digits
		label: string;
	} | null>(null);

	React.useEffect(() => {
		if (fetchedDataTypes) {
			setDataTypes(fetchedDataTypes);
			if (fetchedDataTypes.length > 0 && !selectedParentId) {
				setSelectedParentId(fetchedDataTypes[0]?.id || "");
			}
		}
	}, [fetchedDataTypes]);

	// Counts
	const totalParents = dataTypes.length;
	const totalSubtypes = dataTypes.reduce((acc, p) => acc + (p.subTypes?.length ?? 0), 0);

	const activeParent = dataTypes.find((p) => p.id === selectedParentId);

	// CRUD functions
	const handleSaveToBackend = async () => {
		setSaving(true);
		setSuccessMsg(null);
		setErrMsg(null);
		try {
			await saveDataTypes(dataTypes, await createAdminApiRequestOptions());
			setSuccessMsg(copy.dataTypesSavedSuccessfully);
			setIsDirty(false);
			await reloadDataTypes();
		} catch (cause) {
			setErrMsg(cause instanceof Error ? cause.message : copy.failedToSaveDataTypes);
		} finally {
			setSaving(false);
		}
	};

	const handleReset = () => {
		if (fetchedDataTypes) {
			setDataTypes(fetchedDataTypes);
			setIsDirty(false);
			setSuccessMsg(null);
			setErrMsg(null);
			setActiveForm(null);
		}
	};

	// Validation checks
	const validateCodeUniqueness = (level: "parent" | "subtype", code: string, oldCode?: string) => {
		if (code.length !== 2) return false;
		if (code === oldCode) return true;

		if (level === "parent") {
			return !dataTypes.some((p) => p.code === code);
		}
		if (level === "subtype" && activeParent) {
			return !activeParent.subTypes?.some((s) => s.code === code);
		}
		return true;
	};

	const validateIdUniqueness = (id: string, oldId?: string) => {
		if (!id.trim()) return false;
		if (id === oldId) return true;
		return !dataTypes.some((p) => p.id === id);
	};

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!activeForm) return;

		const { type, level, oldCode, oldId, id, code, label } = activeForm;

		if (!label.trim()) {
			setErrMsg(copy.invalidName);
			return;
		}

		if (code.length !== 2 || !TWO_CHAR_CODE_RE.test(code)) {
			setErrMsg(copy.invalidTypeCode);
			return;
		}

		if (!validateCodeUniqueness(level, code, oldCode)) {
			setErrMsg(copy.invalidCode);
			return;
		}

		if (level === "parent") {
			if (!id.trim() || !LOWER_ID_RE.test(id)) {
				setErrMsg("ID must be unique and alphanumeric lowercase with underscores.");
				return;
			}
			if (!validateIdUniqueness(id, oldId)) {
				setErrMsg("ID must be unique.");
				return;
			}
		}

		// Update state
		setDataTypes((prev) => {
			const updated = [...prev];
			if (level === "parent") {
				if (type === "add") {
					updated.push({
						id,
						code,
						label,
						subTypes: [],
					});
				} else {
					const idx = updated.findIndex((p) => p.id === oldId);
					const existing = updated[idx];
					if (idx !== -1 && existing) {
						updated[idx] = {
							id,
							code,
							label,
							subTypes: existing.subTypes || [],
						};
					}
				}
			} else if (level === "subtype" && selectedParentId) {
				const parentIdx = updated.findIndex((p) => p.id === selectedParentId);
				const parent = updated[parentIdx];
				if (parentIdx !== -1 && parent) {
					const subTypes = parent.subTypes ? [...parent.subTypes] : [];
					if (type === "add") {
						subTypes.push({ code, label });
					} else {
						const subIdx = subTypes.findIndex((s) => s.code === oldCode);
						if (subIdx !== -1) {
							subTypes[subIdx] = { code, label };
						}
					}
					updated[parentIdx] = {
						id: parent.id,
						code: parent.code,
						label: parent.label,
						subTypes,
					};
				}
			}
			return updated;
		});

		if (level === "parent" && type === "add") {
			setSelectedParentId(id);
		}

		setIsDirty(true);
		setErrMsg(null);
		setActiveForm(null);
	};

	const handleDeleteNode = (level: "parent" | "subtype", codeOrId: string) => {
		if (!confirm(copy.deleteConfirm)) return;

		setDataTypes((prev) => {
			const updated = [...prev];
			if (level === "parent") {
				const filtered = updated.filter((p) => p.id !== codeOrId);
				return filtered;
			} else if (level === "subtype" && selectedParentId) {
				const parentIdx = updated.findIndex((p) => p.id === selectedParentId);
				const parent = updated[parentIdx];
				if (parentIdx !== -1 && parent) {
					const subTypes = (parent.subTypes ?? []).filter((s) => s.code !== codeOrId);
					updated[parentIdx] = {
						id: parent.id,
						code: parent.code,
						label: parent.label,
						subTypes,
					};
				}
			}
			return updated;
		});

		setIsDirty(true);
		if (level === "parent" && selectedParentId === codeOrId) {
			setSelectedParentId("");
		}
	};

	if (loadingDataTypes) {
		return (
			<PageShell>
				<LoadingState label={copy.loadingPluginOverview} />
			</PageShell>
		);
	}

	return (
		<PageShell width="wide">
			<PageHeader
				eyebrow="SIKESRA"
				title={copy.dataTypesTitle}
				description={copy.dataTypesDescription}
				actions={
					<div className="flex gap-2">
						{isDirty && (
							<Button variant="secondary" disabled={saving} onClick={handleReset}>
								Reset
							</Button>
						)}
						<Button
							variant="primary"
							disabled={saving || !isDirty}
							onClick={() => void handleSaveToBackend()}
						>
							{saving ? copy.saving : copy.saveDataTypes}
						</Button>
					</div>
				}
			/>

			{isDirty && (
				<div
					className="rounded-xl border border-kumo-warning/30 bg-kumo-warning/10 px-4 py-3 text-sm text-kumo-warning flex items-center gap-2 mt-4"
					style={{ padding: "12px 16px", marginTop: "16px" }}
				>
					<span>⚠️</span>
					<span>
						Anda memiliki perubahan jenis data yang belum disimpan ke server Cloudflare. Klik tombol
						&quot;Simpan Perubahan Jenis Data&quot; di atas untuk menyimpan.
					</span>
				</div>
			)}

			<div className="space-y-6 mt-6">
				{successMsg && (
					<div
						className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-md text-sm"
						style={{ padding: "12px" }}
					>
						{successMsg}
					</div>
				)}
				{errMsg && (
					<div
						className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md text-sm"
						style={{ padding: "12px" }}
					>
						{errMsg}
					</div>
				)}

				{/* Summary Cards */}
				<div className="grid grid-cols-2 gap-4">
					<div
						className="border border-kumo-line bg-kumo-base rounded-xl"
						style={{ padding: "16px" }}
					>
						<div className="text-xs text-kumo-subtle uppercase tracking-wider">
							{copy.parentTypes}
						</div>
						<div className="text-2xl font-bold mt-1 text-blue-600">{totalParents}</div>
					</div>
					<div
						className="border border-kumo-line bg-kumo-base rounded-xl"
						style={{ padding: "16px" }}
					>
						<div className="text-xs text-kumo-subtle uppercase tracking-wider">{copy.subTypes}</div>
						<div className="text-2xl font-bold mt-1 text-teal-600">{totalSubtypes}</div>
					</div>
				</div>

				<section
					className="border border-kumo-line bg-kumo-base rounded-2xl"
					style={{ padding: "24px" }}
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Parent Types Panel */}
						<div
							className="space-y-4 pr-0 md:pr-6"
							style={{ borderRight: "1px solid var(--kumo-line, rgba(100, 116, 139, 0.15))" }}
						>
							<div className="flex justify-between items-center">
								<h3 className="font-semibold text-kumo-default">{copy.parentTypes}</h3>
								<Button
									variant="ghost"
									size="xs"
									onClick={() =>
										setActiveForm({ type: "add", level: "parent", id: "", code: "", label: "" })
									}
								>
									+ {copy.addParentType}
								</Button>
							</div>

							<div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
								{dataTypes.length === 0 ? (
									<div className="text-sm text-kumo-subtle italic p-3 text-center">
										Belum ada jenis data induk
									</div>
								) : (
									dataTypes.map((p) => {
										const isSelected = p.id === selectedParentId;
										return (
											<div
												key={p.id}
												onClick={() => setSelectedParentId(p.id)}
												className="rounded-xl flex justify-between items-center cursor-pointer transition-all border hover:shadow-sm"
												style={{
													padding: "12px",
													...(isSelected
														? {
																backgroundColor: "rgba(59, 130, 246, 0.1)",
																borderColor: "rgba(59, 130, 246, 0.35)",
																color: "#2563eb",
																fontWeight: 600,
															}
														: {
																backgroundColor: "var(--kumo-base)",
																borderColor: "var(--kumo-line)",
																color: "var(--kumo-subtle)",
															}),
												}}
											>
												<div className="flex gap-2 items-center">
													<Badge variant="blue">{p.code}</Badge>
													<div className="text-sm font-medium">{p.label}</div>
													<div className="text-xs text-kumo-subtle">({p.id})</div>
												</div>
												<div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
													<Button
														variant="ghost"
														size="xs"
														onClick={() =>
															setActiveForm({
																type: "edit",
																level: "parent",
																oldId: p.id,
																oldCode: p.code,
																id: p.id,
																code: p.code,
																label: p.label,
															})
														}
													>
														✏️
													</Button>
													<Button
														variant="ghost"
														size="xs"
														onClick={() => handleDeleteNode("parent", p.id)}
													>
														🗑️
													</Button>
												</div>
											</div>
										);
									})
								)}
							</div>
						</div>

						{/* Subtypes Panel */}
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<h3 className="font-semibold text-kumo-default">
									{copy.subTypes} {activeParent ? `— ${activeParent.label}` : ""}
								</h3>
								{activeParent && (
									<Button
										variant="ghost"
										size="xs"
										onClick={() =>
											setActiveForm({ type: "add", level: "subtype", code: "", label: "", id: "" })
										}
									>
										+ {copy.addSubtype}
									</Button>
								)}
							</div>

							<div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
								{!activeParent ? (
									<div className="text-sm text-kumo-subtle italic p-3 text-center">
										Pilih jenis data induk terlebih dahulu
									</div>
								) : !activeParent.subTypes || activeParent.subTypes.length === 0 ? (
									<div className="text-sm text-kumo-subtle italic p-3 text-center">
										Belum ada sub jenis data
									</div>
								) : (
									activeParent.subTypes.map((s) => {
										return (
											<div
												key={s.code}
												className="border border-kumo-line bg-kumo-base rounded-xl flex justify-between items-center text-kumo-default hover:border-kumo-brand/30 transition-all shadow-sm"
												style={{ padding: "12px" }}
											>
												<div className="flex gap-2 items-center">
													<Badge variant="teal">{s.code}</Badge>
													<div className="text-sm font-medium">{s.label}</div>
												</div>
												<div className="flex gap-1">
													<Button
														variant="ghost"
														size="xs"
														onClick={() =>
															setActiveForm({
																type: "edit",
																level: "subtype",
																oldCode: s.code,
																code: s.code,
																label: s.label,
																id: "",
															})
														}
													>
														✏️
													</Button>
													<Button
														variant="ghost"
														size="xs"
														onClick={() => handleDeleteNode("subtype", s.code)}
													>
														🗑️
													</Button>
												</div>
											</div>
										);
									})
								)}
							</div>
						</div>
					</div>
				</section>

				{/* Editor Overlay Card */}
				{activeForm && (
					<Card
						title={
							activeForm.type === "add"
								? activeForm.level === "parent"
									? copy.addParentType
									: copy.addSubtype
								: `${copy.editNode.replace("Name & Code", "")} ${activeForm.level === "parent" ? copy.parentTypes : copy.subTypes}`
						}
						description={`Masukkan nama/label dan kode 2 digit unik.`}
						actions={
							<Button variant="ghost" size="xs" onClick={() => setActiveForm(null)}>
								Tutup ✕
							</Button>
						}
					>
						<form onSubmit={handleFormSubmit} className="space-y-4 max-w-md">
							<Field label="Label/Nama">
								<Input
									value={activeForm.label}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										setActiveForm((prev) => (prev ? { ...prev, label: e.target.value } : null))
									}
									placeholder="Nama klasifikasi"
									required
								/>
							</Field>
							{activeForm.level === "parent" && (
								<Field
									label="ID String"
									hint="Gunakan format lowercase dan underscore (contoh: rumah_ibadah)."
								>
									<Input
										value={activeForm.id}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											setActiveForm((prev) => (prev ? { ...prev, id: e.target.value } : null))
										}
										placeholder="id_jenis_data"
										required
										disabled={activeForm.type === "edit"}
									/>
								</Field>
							)}
							<Field
								label="Kode (2 Digit)"
								hint="Harus berupa 2 karakter unik (contoh: 01, 02, 99)."
							>
								<Input
									value={activeForm.code}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										setActiveForm((prev) => (prev ? { ...prev, code: e.target.value } : null))
									}
									placeholder="01"
									required
									maxLength={2}
								/>
							</Field>
							<div className="flex gap-2 pt-2">
								<Button variant="primary" type="submit">
									Konfirmasi
								</Button>
								<Button variant="secondary" type="button" onClick={() => setActiveForm(null)}>
									Batal
								</Button>
							</div>
						</form>
					</Card>
				)}
			</div>
		</PageShell>
	);
}

export const pages: PluginAdminExports["pages"] = {
	"/": OverviewPage,
	"/overview": OverviewPage,
	"/registry": RegistryPage,
	"/registry/new": RegistryCreatePage,
	"/registry/:id": RegistryDetailPage,
	"/verification": VerificationPage,
	"/documents": DocumentsPage,
	"/reports": ReportsPage,
	"/import": ImportPage,
	"/audit": AuditPage,
	"/access/users": AccessUsersPage,
	"/access/permissions": PermissionsPage,
	"/access/roles": RolesPage,
	"/access/matrix": MatrixPage,
	"/access/scopes": AccessScopesPage,
	"/access/preview": PreviewPage,
	"/abac/attributes": AbacAttributesPage,
	"/abac/policies": AbacPoliciesPage,
	"/abac/preview": AbacPreviewPage,
	"/regions": RegionsPage,
	"/data-types": DataTypesPage,
	"/field-standards": FieldStandardsPage,
	"/custom-attributes/definitions": CustomAttributeDefinitionsPage,
	"/custom-attributes/values": CustomAttributeValuesPage,
	"/delete-requests": DeleteRequestsPage,
	"/archives": ArchivesPage,
	"/settings": SettingsPage,
};

export const fields: PluginAdminExports["fields"] = {
	"status-badge": StatusBadgeField,
};
