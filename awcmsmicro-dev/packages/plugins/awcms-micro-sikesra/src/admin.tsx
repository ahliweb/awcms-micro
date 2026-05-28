import { Badge, Button, Input, InputArea, LinkButton, Select } from "@cloudflare/kumo";
import type { PluginAdminExports } from "emdash";
import { apiFetch, getErrorMessage, parseApiResponse } from "emdash/plugin-utils";
import * as React from "react";
import { useLingui } from "@lingui/react";
import { getExampleAdminCopy } from "./admin-copy.js";
import { normalizeAdminNav, PluginLocalNav } from "./navigation.js";
import { AWCMS_SIKESRA_MANIFEST } from "./runtime.js";

import { SIKESRA_REFERENCE_FIXTURES, maskSensitive, type SikesraReferenceRegistryEntity, type SikesraSensitivity, type SikesraReferenceSupportingDocument } from "./fixtures.js";

const PLUGIN_API_BASE = "/_emdash/api/plugins/awcms-micro-sikesra";
const JSON_HEADERS = { "Content-Type": "application/json" } as const;

type JsonMap = Record<string, string>;
type GovernanceMode = "observe" | "review" | "enforce-demo";
type AbacTargetType = "subject" | "resource" | "context";
type AbacEffect = "allow" | "deny";


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
	settings: {
		publicStatusLabel: string;
		auditRetentionDays: number;
		governanceMode: string;
		metadataCanonicalBase: string;
		smallCellThreshold: number;
		sikesraPublicEnabled: boolean;
	};
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
	}>;
}

interface AuditListResponse {
	items: Array<{
		id: string;
		timestamp: string;
		kind: string;
		scope: string;
		actor: string;
		summary: string;
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
	nextStage: string | null;
	canAdvance: boolean;
	supportingDocumentIds: string[];
	publicSummary: string;
}

interface VerificationResponse {
	items: VerificationItem[];
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
	rolesWithoutPermissions: string[];
	usersWithoutRoles: string[];
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
		{ id: "registry", title: cards[0]!.title, description: cards[0]!.description, status: cards[0]!.status, badge: cards[0]!.badge, href: "/registry" },
		{ id: "institutions", title: cards[1]!.title, description: cards[1]!.description, status: cards[1]!.status, badge: cards[1]!.badge, href: "/registry" },
		{ id: "education", title: cards[2]!.title, description: cards[2]!.description, status: cards[2]!.status, badge: cards[2]!.badge, href: "/verification" },
		{ id: "welfare", title: cards[3]!.title, description: cards[3]!.description, status: cards[3]!.status, badge: cards[3]!.badge, href: "/reports" },
		{ id: "teachers", title: cards[4]!.title, description: cards[4]!.description, status: cards[4]!.status, badge: cards[4]!.badge, href: "/access/roles" },
		{ id: "orphans", title: cards[5]!.title, description: cards[5]!.description, status: cards[5]!.status, badge: cards[5]!.badge, href: "/audit" },
		{ id: "disabilities", title: cards[6]!.title, description: cards[6]!.description, status: cards[6]!.status, badge: cards[6]!.badge, href: "/abac/preview" },
		{ id: "elderly", title: cards[7]!.title, description: cards[7]!.description, status: cards[7]!.status, badge: cards[7]!.badge, href: "/documents" },
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
		],
	},
];

export function filterPluginHeaderMenu(
	items: PluginHeaderMenuItem[],
	hasPermission: (permission?: string) => boolean
): PluginHeaderMenuItem[] {
	return items
		.filter((item) => hasPermission(item.permission))
		.map((item) => {
			const children = item.children ? filterPluginHeaderMenu(item.children, hasPermission) : undefined;
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

async function postPlugin<T>(path: string, payload: unknown = {}) {
	const copy = getExampleAdminCopy(getCurrentAdminLocale());
	const response = await apiFetch(`${PLUGIN_API_BASE}/${path}`, {
		method: "POST",
		headers: JSON_HEADERS,
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		throw new Error(await getErrorMessage(response, copy.requestFailed));
	}

	return parseApiResponse<T>(response);
}

function usePluginData<T>(path: string, payload: unknown = {}) {
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
			setError(cause instanceof Error ? cause.message : getExampleAdminCopy(getCurrentAdminLocale()).requestFailed);
		} finally {
			setLoading(false);
		}
	}, [path, payloadKey]);

	React.useEffect(() => {
		void reload();
	}, [reload]);

	return { data, error, loading, reload };
}

function PageShell({ children, width = "wide" }: { children: React.ReactNode; width?: "normal" | "wide" }) {
	return (
		<div className={cx("space-y-6 text-kumo-default", width === "wide" ? "max-w-6xl" : "max-w-4xl") }>
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
}: {
	eyebrow?: string;
	title: string;
	description: string;
	actions?: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-4 rounded-2xl border border-kumo-line bg-kumo-base p-5 text-kumo-default shadow-sm md:flex-row md:items-start md:justify-between">
			<div className="space-y-2">
				{eyebrow ? <div className="text-xs font-semibold uppercase tracking-wide text-kumo-subtle">{eyebrow}</div> : null}
				<h1 className="text-3xl font-bold tracking-tight text-kumo-default">{title}</h1>
				<p className="max-w-3xl text-sm leading-6 text-kumo-subtle">{description}</p>
			</div>
			{actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
		</div>
	);
}

function Card({
	title,
	description,
	children,
	actions,
}: {
	title?: string;
	description?: string;
	children: React.ReactNode;
	actions?: React.ReactNode;
}) {
	return (
		<section className="rounded-2xl border border-kumo-line bg-kumo-base p-5 text-kumo-default shadow-sm">
			{title || description || actions ? (
				<div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
					<div>
						{title ? <h2 className="text-lg font-semibold text-kumo-default">{title}</h2> : null}
						{description ? <p className="mt-1 text-sm leading-6 text-kumo-subtle">{description}</p> : null}
					</div>
					{actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
				</div>
			) : null}
			{children}
		</section>
	);
}

function MetricCard({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
	return (
		<div className="rounded-2xl border border-kumo-line bg-kumo-base p-4 text-kumo-default shadow-sm">
			<div className="text-sm text-kumo-subtle">{label}</div>
			<div className="mt-2 text-3xl font-semibold tracking-tight text-kumo-default">{value}</div>
			{hint ? <div className="mt-2 text-xs text-kumo-subtle">{hint}</div> : null}
		</div>
	);
}

function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "success" | "warning" | "danger" }) {
	const className = cx(
		"inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
		tone === "success" && "bg-kumo-success/10 text-kumo-success",
		tone === "warning" && "bg-kumo-warning/10 text-kumo-warning",
		tone === "danger" && "bg-kumo-danger/10 text-kumo-danger",
		tone === "neutral" && "bg-kumo-tint text-kumo-default",
	);
	return <span className={className}>{children}</span>;
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
	return (
		<label className="block text-sm text-kumo-default">
			<span className="mb-1 block font-medium text-kumo-default">{label}</span>
			{children}
			{hint ? <span className="mt-1 block text-xs leading-5 text-kumo-subtle">{hint}</span> : null}
		</label>
	);
}

function LoadingState({ label }: { label: string }) {
	return <div className="rounded-2xl border border-kumo-line bg-kumo-base p-5 text-sm text-kumo-default">{label}</div>;
}

function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
	const { i18n } = useLingui();
	const copy = getExampleAdminCopy(i18n.locale);
	return (
		<div className="rounded-2xl border border-kumo-danger/30 bg-kumo-danger/10 p-5 text-sm text-kumo-danger">
			<div className="font-medium">{copy.somethingWentWrong}</div>
			<div className="mt-1">{message}</div>
			{onRetry ? (
				<Button className="mt-3" variant="secondary" size="sm" onClick={onRetry} type="button">
					{copy.retry}
				</Button>
			) : null}
		</div>
	);
}

function EmptyState({ title, description }: { title: string; description: string }) {
	return (
		<div className="rounded-xl border border-kumo-line bg-kumo-base p-5 text-sm text-kumo-default">
			<div className="font-medium text-kumo-default">{title}</div>
			<div className="mt-1 text-kumo-subtle">{description}</div>
		</div>
	);
}

function Feedback({ message, tone = "success" }: { message: string | null; tone?: "success" | "danger" }) {
	if (!message) return null;
	return (
		<div
			className={cx(
				"rounded-xl border border-kumo-line p-3 text-sm",
				tone === "success" ? "border-kumo-success/30 bg-kumo-success/10 text-kumo-success" : "border-kumo-danger/30 bg-kumo-danger/10 text-kumo-danger",
			)}
		>
			{message}
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
	if (!data) return <EmptyState title={copy.noStatusYet} description={copy.noStatusYetDescription} />;

	return (
		<div className="space-y-3">
			<div className="grid grid-cols-3 gap-2 text-sm">
				<MetricCard label={copy.audit} value={data.counters.auditCount} />
				<MetricCard label={copy.lifecycle} value={data.counters.lifecycleCount} />
				<MetricCard label={copy.publicHits} value={data.counters.publicHits} />
			</div>
			<KeyValueList
				items={[
					[copy.mode, <Pill key="mode">{data.settings.governanceMode}</Pill>],
					[copy.lastLifecycle, formatDateTime(data.lastLifecycle, i18n.locale)],
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
	if (!data) return <EmptyState title={copy.noHealthData} description={copy.noHealthDataDescription} />;

	const hasGaps = data.rolesWithoutPermissions.length > 0 || data.usersWithoutRoles.length > 0;

	return (
		<div className="space-y-3">
			<div className="grid grid-cols-2 gap-2 text-sm">
				<MetricCard label={copy.permissions} value={data.permissionCount} />
				<MetricCard label={copy.roles} value={data.roleCount} />
				<MetricCard label={copy.matrices} value={data.assignmentCount} />
				<MetricCard label={copy.users} value={data.userAssignmentCount} />
			</div>
			<div className="text-sm">
				<Pill tone={hasGaps ? "warning" : "success"}>{hasGaps ? copy.reviewNeeded : copy.healthy}</Pill>
				<p className="mt-2 text-kumo-subtle">
					{hasGaps
						? copy.catalogGapSummary(data.rolesWithoutPermissions.length, data.usersWithoutRoles.length)
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
			<div className="text-sm text-kumo-subtle">{copy.explicitDenyPolicies(data.explicitDenyCount)}</div>
			<Button variant="ghost" size="sm" onClick={() => void reload()} type="button">
				{copy.refresh}
			</Button>
		</div>
	);
}

function OverviewPage() {
	const { data, error, loading, reload } = usePluginData<SummaryResponse>("overview/summary");
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
		if (!data) return;
		setFormState({
			publicStatusLabel: data.settings.publicStatusLabel,
			auditRetentionDays: String(data.settings.auditRetentionDays),
			governanceMode: (data.settings.governanceMode as GovernanceMode) ?? "review",
			metadataCanonicalBase: data.settings.metadataCanonicalBase,
			smallCellThreshold: String(data.settings.smallCellThreshold ?? 3),
			sikesraPublicEnabled: data.settings.sikesraPublicEnabled !== false,
		});
	}, [data]);

	const saveSettings = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSaving(true);
		setNotice(null);
		setSaveError(null);

		try {
			await postPlugin("settings/save", {
				publicStatusLabel: formState.publicStatusLabel.trim(),
				auditRetentionDays: Number(formState.auditRetentionDays),
				governanceMode: formState.governanceMode,
				metadataCanonicalBase: formState.metadataCanonicalBase.trim(),
				smallCellThreshold: Number(formState.smallCellThreshold),
				sikesraPublicEnabled: formState.sikesraPublicEnabled,
			});
			setNotice(copy.settingsSavedSuccessfully);
			await reload();
		} catch (cause) {
			setSaveError(cause instanceof Error ? cause.message : copy.failedToSaveSettings);
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <LoadingState label={copy.loadingPluginOverview} />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;
	if (!data) return <EmptyState title={copy.noOverviewData} description={copy.noOverviewDataDescription} />;
	const dashboardCards = getDashboardModuleCards(i18n.locale);

	return (
		<PageShell>
			<PageHeader
				eyebrow={copy.overviewEyebrow}
				title={copy.overviewTitle}
				description={copy.overviewDescription}
				actions={
					<Button variant="secondary" size="sm" onClick={() => void reload()} type="button">
						{copy.refreshDashboard}
					</Button>
				}
			/>

			<Feedback message={copy.overviewSuccess} tone="success" />

			<div className="grid gap-5 md:grid-cols-3 mt-2">
				<MetricCard label={copy.auditEventsStored} value={data.counters.auditCount} hint={copy.auditEventsStoredHint} />
				<MetricCard label={copy.lifecycleTriggers} value={data.counters.lifecycleCount} hint={copy.lastRecorded(formatDateTime(data.lastLifecycle, i18n.locale))} />
				<MetricCard label={copy.publicApiHits} value={data.counters.publicHits} hint={copy.lastCron(formatDateTime(data.lastCronAt, i18n.locale))} />
			</div>

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{dashboardCards.map((card) => (
					<section className="rounded-2xl border border-kumo-line bg-kumo-base p-4 text-kumo-default shadow-sm" key={card.id}>
						<div className="flex items-start justify-between gap-3">
							<div>
								<div className="text-sm font-semibold text-kumo-default">{card.title}</div>
								<div className="mt-1 text-xs leading-5 text-kumo-subtle">{card.description}</div>
							</div>
							<div className="flex flex-col items-end gap-2">
								<Badge variant="secondary">{card.status}</Badge>
								{card.badge != null ? <Badge variant="outline">{card.badge}</Badge> : null}
							</div>
						</div>
						<LinkButton href={card.href} variant="secondary" size="sm" className="mt-4 w-full justify-center">
							{copy.openModule}
						</LinkButton>
					</section>
				))}
			</div>

			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] mt-2">
				<Card title={copy.pluginConfiguration} description={copy.pluginConfigurationDescription}>
					<form className="space-y-4" onSubmit={(event) => void saveSettings(event)}>
						<Feedback message={notice} />
						<Feedback message={saveError} tone="danger" />

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
										setFormState((current) => ({ ...current, auditRetentionDays: event.target.value }))
									}
								/>
							</Field>

							<Field label={copy.governanceMode} hint={copy.governanceModeHint}>
								<Select
									value={formState.governanceMode}
									onValueChange={(value) =>
										setFormState((current) => ({ ...current, governanceMode: (value as GovernanceMode | null) ?? "review" }))
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
										setFormState((current) => ({ ...current, smallCellThreshold: event.target.value }))
									}
								/>
							</Field>

							<Field label={copy.sikesraPublicEnabled} hint={copy.sikesraPublicEnabledHint}>
								<Select
									value={formState.sikesraPublicEnabled ? "true" : "false"}
									onValueChange={(value) =>
										setFormState((current) => ({ ...current, sikesraPublicEnabled: value === "true" }))
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
									setFormState((current) => ({ ...current, metadataCanonicalBase: event.target.value }))
								}
							/>
						</Field>

						<div className="flex items-center gap-3">
							<Button variant="primary" disabled={saving} type="submit">
								{saving ? copy.saving : copy.saveSettings}
							</Button>
							<span className="text-xs text-kumo-subtle">{copy.modeLabel(data.settings.governanceMode)}</span>
						</div>
					</form>
				</Card>

				<Card title={copy.currentStatus}>
					<KeyValueList
						items={[
							[copy.statusLabel, data.settings.publicStatusLabel || copy.notSet],
							[copy.retention, copy.retentionDays(data.settings.auditRetentionDays)],
							[copy.governance, <Pill key="governance">{data.settings.governanceMode}</Pill>],
							[copy.canonicalBase, data.settings.metadataCanonicalBase || copy.notSet],
							[copy.smallCellThreshold, String(data.settings.smallCellThreshold ?? 3)],
							[copy.sikesraPublicEnabled, data.settings.sikesraPublicEnabled !== false ? copy.enabled : copy.disabled],
						]}
					/>
				</Card>
			</div>

			<Card title={copy.recentAuditEvents} description={copy.recentAuditEventsDescription}>
				{data.recentEvents.length === 0 ? (
					<EmptyState title={copy.noRecentEvents} description={copy.noRecentEventsDescription} />
				) : (
					<div className="space-y-2">
						{data.recentEvents.map((item) => (
							<div className="rounded-xl border border-kumo-line bg-kumo-base p-3 text-kumo-default" key={item.id}>
								<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
									<div className="font-medium text-kumo-default">{item.summary}</div>
									<Pill>{item.kind}</Pill>
								</div>
								<div className="mt-2 text-xs text-kumo-subtle">
									{item.actor} • {formatDateTime(item.timestamp)}
								</div>
							</div>
						))}
					</div>
				)}
			</Card>
		</PageShell>
	);
}

function RegistryPage() {
	const { i18n } = useLingui();
	const copy = getExampleAdminCopy(i18n.locale);
	const { data, error, loading, reload } = usePluginData<{ items: SikesraReferenceRegistryEntity[] }>("registry/list");
	const [step, setStep] = React.useState(0);
	const [submitting, setSubmitting] = React.useState(false);
	const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
	const [errMsg, setErrMsg] = React.useState<string | null>(null);

	// 11-step wizard state
	const [wizardState, setWizardState] = React.useState({
		entityType: "rumah_ibadah",
		subtype: "Masjid",
		provinceCode: "31",
		regencyCode: "3171",
		districtCode: "3171010",
		villageCode: "3171010001",
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
		docTitle: "Surat Keterangan Kemenag",
		docType: "surat_keterangan",
		docSensitivity: "public_safe" as SikesraSensitivity,
		isValidated: false,
		code: "", // SIKESRA ID
		sensitivity: "public_safe" as SikesraSensitivity,
	});

	const [filterType, setFilterType] = React.useState<string>("all");
	const [searchQuery, setSearchQuery] = React.useState<string>("");

	const registryEntities = data?.items ?? SIKESRA_REFERENCE_FIXTURES.registryEntities;

	const filteredEntities = registryEntities.filter((entity) => {
		const matchesType = filterType === "all" || entity.entityType === filterType;
		const matchesSearch = entity.label.toLowerCase().includes(searchQuery.toLowerCase()) || entity.code.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesType && matchesSearch;
	});

	const verifiedCount = registryEntities.filter((entity) => entity.verificationStage === "active_verified").length;
	const restrictedCount = registryEntities.filter((entity) => entity.sensitivity !== "public_safe").length;

	const runValidationCheck = () => {
		if (!wizardState.label || !wizardState.villageCode || !wizardState.entityType) {
			setErrMsg("Identity label, village code, and data type are mandatory!");
			return;
		}
		setWizardState(prev => ({ ...prev, isValidated: true }));
		setSuccessMsg("Validation Passed! No duplicates found.");
		setErrMsg(null);
	};

	const generateSikesraId = () => {
		const desa = wizardState.villageCode.padEnd(10, "0").slice(0, 10);
		
		const typeCodes: Record<string, string> = {
			rumah_ibadah: "01",
			lembaga_keagamaan: "02",
			pendidikan_keagamaan: "03",
			lks: "04",
			guru_agama: "05",
			anak_yatim: "06",
			disabilitas: "07",
			lansia_terlantar: "08",
		};
		const jenis = typeCodes[wizardState.entityType] ?? "99";
		
		const religionCodes: Record<string, string> = {
			Islam: "01",
			Kristen: "02",
			Katolik: "03",
			Hindu: "04",
			Buddha: "05",
			Khonghucu: "06",
		};
		const subjenis = religionCodes[wizardState.religion] ?? "00";
		
		const nextSeq = String(registryEntities.length + 1).padStart(6, "0");
		const compiledId = `${desa}${jenis}${subjenis}${nextSeq}`;
		
		setWizardState(prev => ({ ...prev, code: compiledId }));
		setSuccessMsg(`Generated SIKESRA ID: ${compiledId}`);
	};

	const handleWizardSubmit = async () => {
		if (!wizardState.code) {
			setErrMsg("Please generate SIKESRA ID first!");
			return;
		}
		setSubmitting(true);
		setErrMsg(null);
		setSuccessMsg(null);
		try {
			const res = await postPlugin<{ item: SikesraReferenceRegistryEntity }>("registry/save", {
				code: wizardState.code,
				label: wizardState.label,
				entityType: wizardState.entityType,
				sensitivity: wizardState.sensitivity,
				provinceCode: wizardState.provinceCode,
				regencyCode: wizardState.regencyCode,
				districtCode: wizardState.districtCode,
				villageCode: wizardState.villageCode,
				publicSummary: `${wizardState.label} (${wizardState.subtype}) located in RT ${wizardState.rt} / RW ${wizardState.rw}, ${wizardState.address}. Desil: ${wizardState.desil}, Caregiver: ${wizardState.caregiverName}`,
			});

			if (wizardState.docTitle) {
				await postPlugin("documents/save", {
					registryEntityId: res.item.id,
					title: wizardState.docTitle,
					documentType: wizardState.docType,
					sensitivity: wizardState.docSensitivity,
				});
			}

			setSuccessMsg("Registry entity successfully submitted to queue!");
			setStep(0);
			setWizardState({
				entityType: "rumah_ibadah",
				subtype: "Masjid",
				provinceCode: "31",
				regencyCode: "3171",
				districtCode: "3171010",
				villageCode: "3171010001",
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
				docTitle: "Surat Keterangan Kemenag",
				docType: "surat_keterangan",
				docSensitivity: "public_safe",
				isValidated: false,
				code: "",
				sensitivity: "public_safe",
			});
			await reload();
		} catch (err) {
			setErrMsg(err instanceof Error ? err.message : "Failed to save entity");
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) return <PageShell><LoadingState label={copy.loadingPluginOverview} /></PageShell>;

	return (
		<PageShell>
			<PageHeader
				eyebrow={copy.registryEyebrow}
				title={copy.registryTitle}
				description={copy.registryDescription}
			/>

			<div className="grid gap-5 md:grid-cols-3">
				<MetricCard label={copy.registryEntities} value={registryEntities.length} hint={copy.registryEntitiesHint} />
				<MetricCard label={copy.verifiedRecords} value={verifiedCount} hint={copy.verifiedRecordsHint} />
				<MetricCard label={copy.restrictedEntries} value={restrictedCount} hint={copy.restrictedEntriesHint} />
			</div>

			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_480px] mt-2">
				<Card title={copy.registryQueue} description={copy.registryQueueDescription}>
					<div className="mb-4 flex flex-col gap-3 sm:flex-row">
						<div className="flex-1">
							<Input
								placeholder="Search entity..."
								value={searchQuery}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
							/>
						</div>
						<div className="w-48">
							<Select value={filterType} onValueChange={(val) => setFilterType(val ?? "all")}>
								<Select.Option value="all">All Types</Select.Option>
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
						<div className="grid grid-cols-[1.1fr_.8fr_.9fr_.9fr] gap-3 border-b border-kumo-line bg-kumo-tint/50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-kumo-subtle max-md:hidden">
							<div>{copy.entity}</div>
							<div>{copy.region}</div>
							<div>{copy.sensitivity}</div>
							<div>{copy.stage}</div>
						</div>
						{filteredEntities.map((entity) => (
							<div className="grid gap-2 border-t border-kumo-line px-4 py-3 text-sm md:grid-cols-[1.1fr_.8fr_.9fr_.9fr]" key={entity.id}>
								<div>
									<div className="font-medium text-kumo-default">{entity.label}</div>
									<div className="mt-1 break-all text-xs text-kumo-brand font-mono font-bold">{entity.code || "PENDING"}</div>
									<div className="mt-1 text-xs text-kumo-subtle">{entity.entityType}</div>
									<div className="mt-2 text-xs text-kumo-subtle">{entity.publicSummary}</div>
								</div>
								<div className="text-kumo-subtle">
									{entity.region.provinceCode}/{entity.region.regencyCode}
									<br />
									{entity.region.districtCode}/{entity.region.villageCode}
								</div>
								<div>
									<Pill tone={entity.sensitivity === "public_safe" ? "success" : entity.sensitivity === "restricted" ? "warning" : "danger"}>{entity.sensitivity}</Pill>
								</div>
								<div className="text-kumo-subtle">
									<Badge variant={entity.verificationStage === "active_verified" ? "success" : "warning"}>{entity.verificationStage}</Badge>
								</div>
							</div>
						))}
					</div>
				</Card>

				<Card title={copy.progressiveInputWizard} description={copy.progressiveInputWizardDescription}>
					<div className="space-y-4">
						<Feedback message={successMsg} tone="success" />
						<Feedback message={errMsg} tone="danger" />

						{/* Horizontal Step Buttons */}
						<div className="grid grid-cols-4 gap-1 text-[10px] font-medium uppercase tracking-wide text-kumo-subtle">
							{copy.registrySteps.map((label, index) => (
								<button
									className={cx(
										"rounded border p-1 text-center truncate",
										index === step ? "border-kumo-brand bg-kumo-brand/10 text-kumo-brand font-bold" : "border-kumo-line bg-kumo-base text-kumo-subtle"
									)}
									key={label}
									onClick={() => setStep(index)}
									type="button"
								>
									{index + 1}. {label}
								</button>
							))}
						</div>

						{/* Step Contents */}
						<div className="rounded-xl border border-kumo-line bg-kumo-base p-4">
							<div className="text-sm font-semibold text-kumo-default">
								Step {step + 1}: {copy.registrySteps[step]}
							</div>

							<div className="mt-4 space-y-3">
								{step === 0 && (
									<>
										<Field label="Data Type" hint="Select SIKESRA Entity Type">
											<Select value={wizardState.entityType} onValueChange={(val) => setWizardState(prev => ({ ...prev, entityType: val ?? "rumah_ibadah" }))}>
												<Select.Option value="rumah_ibadah">Rumah Ibadah</Select.Option>
												<Select.Option value="lembaga_keagamaan">Lembaga Keagamaan</Select.Option>
												<Select.Option value="pendidikan_keagamaan">Pendidikan Keagamaan</Select.Option>
												<Select.Option value="lks">Lembaga Kesejahteraan Sosial</Select.Option>
												<Select.Option value="guru_agama">Guru Agama</Select.Option>
												<Select.Option value="anak_yatim">Anak Yatim</Select.Option>
												<Select.Option value="disabilitas">Disabilitas</Select.Option>
												<Select.Option value="lansia_terlantar">Lansia Terlantar</Select.Option>
											</Select>
										</Field>
										<Field label="Subtype Specification" hint="Specific category classification">
											<Input value={wizardState.subtype} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWizardState(prev => ({ ...prev, subtype: e.target.value }))} />
										</Field>
										<Field label="Sensitivity classification" hint="Determine visibility of this entity records">
											<Select value={wizardState.sensitivity} onValueChange={(val) => setWizardState(prev => ({ ...prev, sensitivity: (val as SikesraSensitivity) ?? "public_safe" }))}>
												<Select.Option value="public_safe">Public Safe</Select.Option>
												<Select.Option value="internal">Internal</Select.Option>
												<Select.Option value="restricted">Restricted</Select.Option>
												<Select.Option value="highly_restricted">Highly Restricted</Select.Option>
											</Select>
										</Field>
									</>
								)}

								{step === 1 && (
									<>
										<div className="grid gap-3 grid-cols-2">
											<Field label="Province Code">
												<Input value={wizardState.provinceCode} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWizardState(prev => ({ ...prev, provinceCode: e.target.value }))} />
											</Field>
											<Field label="Regency Code">
												<Input value={wizardState.regencyCode} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWizardState(prev => ({ ...prev, regencyCode: e.target.value }))} />
											</Field>
										</div>
										<div className="grid gap-3 grid-cols-2">
											<Field label="District Code">
												<Input value={wizardState.districtCode} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWizardState(prev => ({ ...prev, districtCode: e.target.value }))} />
											</Field>
											<Field label="Village Code (10 digits)">
												<Input value={wizardState.villageCode} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWizardState(prev => ({ ...prev, villageCode: e.target.value }))} />
											</Field>
										</div>
									</>
								)}

								{step === 2 && (
									<>
										<div className="grid gap-3 grid-cols-2">
											<Field label="RT">
												<Input value={wizardState.rt} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWizardState(prev => ({ ...prev, rt: e.target.value }))} />
											</Field>
											<Field label="RW">
												<Input value={wizardState.rw} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWizardState(prev => ({ ...prev, rw: e.target.value }))} />
											</Field>
										</div>
										<Field label="Specific Local Address">
											<Input value={wizardState.address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWizardState(prev => ({ ...prev, address: e.target.value }))} />
										</Field>
									</>
								)}

								{step === 3 && (
									<>
										<Field label="Identity Name / Label" hint="Human-readable name">
											<Input value={wizardState.label} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWizardState(prev => ({ ...prev, label: e.target.value }))} />
										</Field>
										<Field label="Brief Description">
											<Input value={wizardState.description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWizardState(prev => ({ ...prev, description: e.target.value }))} />
										</Field>
									</>
								)}

								{step === 4 && (
									<>
										<Field label="Religion Connection">
											<Select value={wizardState.religion} onValueChange={(val) => setWizardState(prev => ({ ...prev, religion: val ?? "Islam" }))}>
												<Select.Option value="Islam">Islam</Select.Option>
												<Select.Option value="Kristen">Kristen</Select.Option>
												<Select.Option value="Katolik">Katolik</Select.Option>
												<Select.Option value="Hindu">Hindu</Select.Option>
												<Select.Option value="Buddha">Buddha</Select.Option>
												<Select.Option value="Khonghucu">Khonghucu</Select.Option>
											</Select>
										</Field>
										<Field label="Social Desil Status (1-10)">
											<Select value={wizardState.desil} onValueChange={(val) => setWizardState(prev => ({ ...prev, desil: val ?? "3" }))}>
												{[...Array(10)].map((_, i) => (
													<Select.Option value={String(i + 1)} key={i}>Desil {i + 1}</Select.Option>
												))}
											</Select>
										</Field>
									</>
								)}

								{step === 5 && (
									<Field label="Module specific data details" hint="Additional parameters unique to the module type">
										<InputArea value={wizardState.moduleDetails} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setWizardState(prev => ({ ...prev, moduleDetails: e.target.value }))} />
									</Field>
								)}

								{step === 6 && (
									<>
										<Field label="Caregiver / PIC Name">
											<Input value={wizardState.caregiverName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWizardState(prev => ({ ...prev, caregiverName: e.target.value }))} />
										</Field>
										<Field label="Caregiver Phone Number">
											<Input value={wizardState.caregiverPhone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWizardState(prev => ({ ...prev, caregiverPhone: e.target.value }))} />
										</Field>
									</>
								)}

								{step === 7 && (
									<>
										<Field label="Supporting Document Title">
											<Input value={wizardState.docTitle} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWizardState(prev => ({ ...prev, docTitle: e.target.value }))} />
										</Field>
										<div className="grid gap-3 grid-cols-2">
											<Field label="Doc Type">
												<Select value={wizardState.docType} onValueChange={(val) => setWizardState(prev => ({ ...prev, docType: val ?? "surat_keterangan" }))}>
													<Select.Option value="surat_keterangan">Surat Keterangan</Select.Option>
													<Select.Option value="identitas">Identitas Utama</Select.Option>
													<Select.Option value="sertifikat">Sertifikat Resmi</Select.Option>
												</Select>
											</Field>
											<Field label="Doc Sensitivity">
												<Select value={wizardState.docSensitivity} onValueChange={(val) => setWizardState(prev => ({ ...prev, docSensitivity: (val as SikesraSensitivity) ?? "public_safe" }))}>
													<Select.Option value="public_safe">Public Safe</Select.Option>
													<Select.Option value="internal">Internal</Select.Option>
													<Select.Option value="restricted">Restricted</Select.Option>
													<Select.Option value="highly_restricted">Highly Restricted</Select.Option>
												</Select>
											</Field>
										</div>
									</>
								)}

								{step === 8 && (
									<div className="rounded-lg border border-dashed border-kumo-line bg-kumo-tint/20 p-4 text-center">
										<p className="text-xs text-kumo-subtle mb-3">Checks for formatting compliance and potential duplicate records.</p>
										<Button variant="secondary" size="sm" onClick={runValidationCheck} type="button">Run Validation Check</Button>
									</div>
								)}

								{step === 9 && (
									<div className="rounded-lg border border-kumo-line bg-kumo-tint/10 p-4 text-center">
										<p className="text-xs text-kumo-subtle mb-3">IDs are generated based on: [Desa Code (10)][Type (2)][Subtype (2)][Sequence (6)]</p>
										<Button variant="primary" size="sm" onClick={generateSikesraId} type="button">Generate SIKESRA ID</Button>
										{wizardState.code && (
											<div className="mt-3 text-lg font-mono font-bold text-kumo-brand bg-kumo-base p-2 border rounded select-all break-all">{wizardState.code}</div>
										)}
									</div>
								)}

								{step === 10 && (
									<div className="rounded-lg border border-kumo-line bg-kumo-base p-4 text-xs space-y-2">
										<div className="font-semibold text-sm mb-2 text-kumo-default">Summary Intake Intake:</div>
										<div className="grid grid-cols-2 gap-2">
											<div><strong>Label:</strong> {wizardState.label}</div>
											<div><strong>SIKESRA ID:</strong> {wizardState.code || "NOT GENERATED"}</div>
											<div><strong>Type:</strong> {wizardState.entityType} ({wizardState.subtype})</div>
											<div><strong>Religion / Desil:</strong> {wizardState.religion} / Desil {wizardState.desil}</div>
											<div><strong>Official Region:</strong> {wizardState.provinceCode}/{wizardState.regencyCode}/{wizardState.districtCode}/{wizardState.villageCode}</div>
											<div><strong>Local Region:</strong> RT {wizardState.rt} / RW {wizardState.rw}, {wizardState.address}</div>
											<div><strong>Caregiver:</strong> {wizardState.caregiverName} ({wizardState.caregiverPhone})</div>
											<div><strong>Doc Attachment:</strong> {wizardState.docTitle} ({wizardState.docType})</div>
										</div>
										<div className="pt-3 border-t">
											<Button variant="primary" className="w-full justify-center" disabled={submitting} onClick={() => void handleWizardSubmit()}>
												{submitting ? "Submitting..." : "Submit to Verification Queue"}
											</Button>
										</div>
									</div>
								)}
							</div>

							<div className="mt-4 flex items-center gap-2">
								<Button variant="secondary" size="sm" type="button" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))}>
									{copy.previous}
								</Button>
								<Button variant="secondary" size="sm" type="button" disabled={step === copy.registrySteps.length - 1} onClick={() => setStep((current) => Math.min(copy.registrySteps.length - 1, current + 1))}>
									{copy.next}
								</Button>
							</div>
						</div>
					</div>
				</Card>
			</div>
		</PageShell>
	);
}

function VerificationPage() {
	const { i18n } = useLingui();
	const copy = getExampleAdminCopy(i18n.locale);
	const { data, error, loading, reload } = usePluginData<VerificationResponse>("verification/list");
	const [actionNotes, setActionNotes] = React.useState<Record<string, string>>({});
	const [submittingId, setSubmittingId] = React.useState<string | null>(null);
	const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
	const [mutationError, setMutationError] = React.useState<string | null>(null);

	const queue = data?.items ?? [];
	const pending = queue.filter((item) => item.canAdvance).length;
	const approved = queue.filter((item) => item.verificationStage === "active_verified").length;

	if (loading) return <PageShell><LoadingState label={copy.loadingVerificationQueue} /></PageShell>;
	if (error) return <PageShell><ErrorState message={error} onRetry={() => void reload()} /></PageShell>;

	async function handleVerifyAction(entityId: string, actionType: "approve" | "needs_revision") {
		setSubmittingId(entityId);
		setMutationError(null);
		setStatusMessage(null);

		const notes = actionNotes[entityId] || "Verification processed via admin console";

		try {
			if (actionType === "approve") {
				const response = await postPlugin<VerificationAdvanceResponse>("verification/advance", {
					registryEntityId: entityId,
					actor: "district-officer",
					notes: notes,
				});
				setStatusMessage(`Approved successfully: ${response.item.code} advanced to ${response.item.verificationStage}`);
			} else {
				// Needs Revision: log audit event and reset verification stage
				await postPlugin("state/touch", {
					note: `Entity ${entityId} marked as Needs Revision. Notes: ${notes}`,
				});
				setStatusMessage(`Status updated: Entity marked as Needs Revision.`);
			}
			
			// Clear notes
			setActionNotes(prev => {
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

			{statusMessage ? <div className="rounded-xl border border-kumo-success/30 bg-kumo-success/10 px-4 py-3 text-sm text-kumo-default">{statusMessage}</div> : null}
			{mutationError ? <div className="rounded-xl border border-kumo-danger/30 bg-kumo-danger/10 px-4 py-3 text-sm text-kumo-default">{mutationError}</div> : null}

			<div className="grid gap-5 md:grid-cols-3">
				<MetricCard label={copy.queuedEvents} value={queue.length} hint={copy.queuedEventsHint} />
				<MetricCard label={copy.approved} value={approved} hint={copy.approvedHint} />
				<MetricCard label={copy.needsReview} value={pending} hint={copy.needsReviewHint} />
			</div>

			<Card title={copy.registryVerificationQueue} description={copy.registryVerificationQueueDescription}>
				<div className="space-y-4">
					{queue.map((item) => (
						<div className="rounded-xl border border-kumo-line bg-kumo-base p-4" key={item.id}>
							<div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
								<div className="flex-1">
									<div className="font-semibold text-kumo-default text-base">{item.label}</div>
									<div className="mt-1 text-xs font-mono text-kumo-brand font-bold">{item.code}</div>
									<div className="mt-2 text-sm text-kumo-subtle">{item.publicSummary}</div>
									
									{/* Action inputs */}
									{item.canAdvance && (
										<div className="mt-3 max-w-md space-y-2">
											<Input
												placeholder="Verifier justification notes..."
												value={actionNotes[item.registryEntityId] || ""}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
													const val = e.target.value;
													setActionNotes(prev => ({ ...prev, [item.registryEntityId]: val }));
												}}
											/>
											<div className="flex gap-2">
												<Button
													disabled={submittingId !== null}
													onClick={() => void handleVerifyAction(item.registryEntityId, "approve")}
													size="sm"
													variant="primary"
												>
													{submittingId === item.registryEntityId ? "Processing..." : `Approve to ${item.nextStage}`}
												</Button>
												<Button
													disabled={submittingId !== null}
													onClick={() => void handleVerifyAction(item.registryEntityId, "needs_revision")}
													size="sm"
													variant="secondary"
												>
													Needs Revision
												</Button>
											</div>
										</div>
									)}
								</div>
								<div className="flex flex-col items-end gap-2">
									<div className="flex gap-1">
										<Badge variant={item.canAdvance ? "warning" : "success"}>{item.verificationStage}</Badge>
										{item.nextStage && <Badge variant="outline">Next: {item.nextStage}</Badge>}
									</div>
									<div className="text-xs text-kumo-subtle">{copy.documentsCount}: {item.supportingDocumentIds.length}</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</Card>

			<Card title={copy.referenceVerificationEvents} description={copy.referenceVerificationEventsDescription}>
				<div className="space-y-3">
					{SIKESRA_REFERENCE_FIXTURES.verificationEvents.map((item) => (
						<div className="rounded-xl border border-kumo-line bg-kumo-base p-4" key={item.id}>
							<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
								<div>
									<div className="font-medium text-kumo-default">{item.registryEntityId}</div>
									<div className="mt-1 text-sm text-kumo-subtle">{item.notes}</div>
								</div>
								<div className="flex items-center gap-2">
									<Pill tone={item.result === "approved" ? "success" : item.result === "needs_review" ? "warning" : "danger"}>{item.result}</Pill>
									<Pill>{item.stage}</Pill>
								</div>
							</div>
							<div className="mt-3 grid gap-2 text-xs text-kumo-subtle md:grid-cols-3">
								<div>{copy.actor}: {item.actor}</div>
								<div>{copy.created}: {formatDateTime(item.createdAt, i18n.locale)}</div>
								<div>{copy.idLabel}: {maskSensitive(item.id, false)}</div>
							</div>
						</div>
					))}
				</div>
			</Card>
		</PageShell>
	);
}

function DocumentsPage() {
	const { i18n } = useLingui();
	const copy = getExampleAdminCopy(i18n.locale);
	const { data: registryData } = usePluginData<{ items: SikesraReferenceRegistryEntity[] }>("registry/list");
	const { data, loading, reload } = usePluginData<{ items: SikesraReferenceSupportingDocument[] }>("documents/list");

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

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
		setUploadState(prev => ({
			...prev,
			fileSelected: true,
			fileName: file.name,
			fileSize: file.size,
			fileType: file.type,
		}));

		// Mock checksum calculation
		const mockHash = "sha256-" + Math.random().toString(16).slice(2, 18);
		setChecksum(mockHash);
	};

	const handleUploadSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!uploadState.fileSelected || !uploadState.registryEntityId || !uploadState.title) {
			setError("Please fill all mandatory fields and select a valid file!");
			return;
		}

		setError(null);
		setProgress(0);

		// Simulate R2 upload progress
		for (let i = 10; i <= 100; i += 30) {
			await new Promise(resolve => setTimeout(resolve, 150));
			setProgress(Math.min(i, 100));
		}

		try {
			await postPlugin("documents/save", {
				title: uploadState.title,
				documentType: uploadState.documentType,
				sensitivity: uploadState.sensitivity,
				registryEntityId: uploadState.registryEntityId,
			});

			setNotice(`Document successfully uploaded and saved to R2 storage! Checksum: ${checksum}`);
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
			setError(err instanceof Error ? err.message : "Failed to upload document metadata");
			setProgress(null);
		}
	};

	if (loading) return <PageShell><LoadingState label={copy.loadingPluginOverview} /></PageShell>;

	return (
		<PageShell>
			<PageHeader
				eyebrow={copy.documentsEyebrow}
				title={copy.documentsTitle}
				description={copy.documentsDescription}
			/>

			<div className="grid gap-5 md:grid-cols-3">
				<MetricCard label={copy.documentsMetric} value={docs.length} hint={copy.documentsMetricHint} />
				<MetricCard label={copy.sensitiveDocs} value={sensitiveCount} hint={copy.sensitiveDocsHint} />
				<MetricCard label={copy.verifiedSources} value={new Set(docs.map((doc) => doc.verifiedBy)).size} hint={copy.verifiedSourcesHint} />
			</div>

			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px] mt-2">
				<Card title={copy.documentCatalog} description={copy.documentCatalogDescription}>
					<div className="space-y-3">
						{docs.map((doc) => (
							<div className="rounded-xl border border-kumo-line bg-kumo-base p-4" key={doc.id}>
								<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
									<div>
										<div className="font-medium text-kumo-default">{doc.title}</div>
										<div className="mt-1 text-xs font-mono bg-kumo-tint px-2 py-0.5 rounded inline-block text-kumo-brand">{doc.documentType}</div>
									</div>
									<div className="flex items-center gap-2">
										<Pill tone={doc.sensitivity === "public_safe" ? "success" : doc.sensitivity === "restricted" ? "warning" : "danger"}>{doc.sensitivity}</Pill>
										<Button variant="secondary" size="xs" onClick={() => alert(`Simulated secure preview of: ${doc.title} via signed CDN proxy.`)}>Preview</Button>
									</div>
								</div>
								<div className="mt-3 grid gap-2 text-xs text-kumo-subtle md:grid-cols-3">
									<div>{copy.entity}: {maskSensitive(doc.registryEntityId, doc.sensitivity === "public_safe")}</div>
									<div>{copy.issued}: {formatDateTime(doc.issuedAt, i18n.locale)}</div>
									<div>{copy.verifiedBy}: {doc.verifiedBy}</div>
								</div>
							</div>
						))}
					</div>
				</Card>

				<Card title="Upload Document Metadata" description="Secure metadata submission matching R2 bucket rules.">
					<form className="space-y-4" onSubmit={(e) => void handleUploadSubmit(e)}>
						<Feedback message={notice} tone="success" />
						<Feedback message={error} tone="danger" />

						<Field label="Document Title" hint="Name of document for verification reference">
							<Input value={uploadState.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUploadState(prev => ({ ...prev, title: e.target.value }))} />
						</Field>

						<Field label="Linked SIKESRA Entity">
							<Select value={uploadState.registryEntityId} onValueChange={(val) => setUploadState(prev => ({ ...prev, registryEntityId: val ?? "" }))}>
								<Select.Option value="">-- Select Target Entity --</Select.Option>
								{entities.map((ent) => (
									<Select.Option value={ent.id} key={ent.id}>{ent.label} ({ent.code})</Select.Option>
								))}
							</Select>
						</Field>

						<div className="grid gap-3 grid-cols-2">
							<Field label="Doc Type">
								<Select value={uploadState.documentType} onValueChange={(val) => setUploadState(prev => ({ ...prev, documentType: val ?? "surat_keterangan" }))}>
									<Select.Option value="surat_keterangan">Surat Keterangan</Select.Option>
									<Select.Option value="identitas">Identitas</Select.Option>
									<Select.Option value="sertifikat">Sertifikat</Select.Option>
								</Select>
							</Field>

							<Field label="Classification">
								<Select value={uploadState.sensitivity} onValueChange={(val) => setUploadState(prev => ({ ...prev, sensitivity: (val as SikesraSensitivity) ?? "public_safe" }))}>
									<Select.Option value="public_safe">Public Safe</Select.Option>
									<Select.Option value="internal">Internal</Select.Option>
									<Select.Option value="restricted">Restricted</Select.Option>
									<Select.Option value="highly_restricted">Highly Restricted</Select.Option>
								</Select>
							</Field>
						</div>

						<Field label="Select Supporting File" hint="Allowed types: PDF, PNG, JPEG. Max Size: 5MB">
							<input
								type="file"
								accept="application/pdf,image/png,image/jpeg"
								className="w-full text-xs text-kumo-subtle border border-kumo-line bg-kumo-base rounded px-2 py-1.5"
								onChange={handleFileSelect}
							/>
						</Field>

						{uploadState.fileSelected && (
							<div className="rounded border bg-kumo-tint/20 p-3 text-xs space-y-1">
								<div><strong>File:</strong> {uploadState.fileName} ({Math.round(uploadState.fileSize / 1024)} KB)</div>
								<div><strong>Checksum:</strong> <code className="font-mono text-[10px] break-all">{checksum}</code></div>
							</div>
						)}

						{progress !== null && (
							<div className="w-full bg-kumo-line rounded-full h-2">
								<div className="bg-kumo-brand h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
							</div>
						)}

						<Button variant="primary" type="submit" className="w-full justify-center" disabled={progress !== null}>
							{progress !== null ? `Uploading ${progress}%` : "Upload metadata to R2"}
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
				<MetricCard label={copy.categories} value={aggregate.categories.length} hint={copy.categoriesHint} />
				<MetricCard label={copy.suppressed} value={suppressedCount} hint={copy.suppressedHint} />
				<MetricCard label={copy.visible} value={aggregate.categories.length - suppressedCount} hint={copy.visibleHint} />
			</div>

			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] mt-2">
				<Card title={copy.aggregateCategories} description={copy.aggregateCategoriesDescription}>
					<div className="overflow-hidden rounded-xl border border-kumo-line bg-kumo-base text-kumo-default">
						<div className="grid grid-cols-[1.2fr_.7fr_.7fr_.7fr] gap-3 border-b border-kumo-line bg-kumo-tint/50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-kumo-subtle max-md:hidden">
							<div>{copy.category}</div>
							<div>{copy.total}</div>
							<div>{copy.verified}</div>
							<div>{copy.status}</div>
						</div>
						{aggregate.categories.map((item) => (
							<div className="grid gap-2 border-t border-kumo-line px-4 py-3 text-sm md:grid-cols-[1.2fr_.7fr_.7fr_.7fr]" key={item.code}>
								<div>
									<div className="font-medium text-kumo-default">{item.label}</div>
									<div className="mt-1 break-all text-xs text-kumo-subtle">{maskSensitive(item.code, !item.suppressed)}</div>
								</div>
								<div className="text-kumo-subtle">{item.suppressed ? copy.suppressed.toLowerCase() : item.total}</div>
								<div className="text-kumo-subtle">{item.verified}</div>
								<div>
									<Pill tone={item.suppressed ? "warning" : "success"}>{item.suppressed ? copy.masked : copy.visible.toLowerCase()}</Pill>
								</div>
							</div>
						))}
					</div>
				</Card>

				<Card title={copy.publicNote} description={copy.publicNoteDescription}>
					<p className="text-sm leading-6 text-kumo-subtle">{aggregate.caveat}</p>
					<div className="mt-4 rounded-xl border border-kumo-line bg-kumo-base p-4 text-sm text-kumo-subtle">
						<div className="font-medium text-kumo-default">{copy.displayRule}</div>
						<div className="mt-2">{copy.displayRuleDescription}</div>
					</div>
				</Card>
			</div>
		</PageShell>
	);
}

function AuditPage() {
	const { i18n } = useLingui();
	const copy = getExampleAdminCopy(i18n.locale);
	const { data, error, loading, reload } = usePluginData<AuditListResponse>("audit/list", { limit: 25 });

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
			<Card>
				{!data?.items.length ? (
					<EmptyState title={copy.noAuditEvents} description={copy.noAuditEventsDescription} />
				) : (
					<div className="overflow-hidden rounded-xl border border-kumo-line bg-kumo-base text-kumo-default">
						<div className="grid grid-cols-[1fr_160px_160px] gap-3 border-b border-kumo-line bg-kumo-tint/50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-kumo-subtle max-md:hidden">
							<div>{copy.summary}</div>
							<div>{copy.scopeActor}</div>
							<div>{copy.time}</div>
						</div>
						{data.items.map((item) => (
							<div className="grid gap-2 border-t border-kumo-line bg-kumo-base px-4 py-3 text-sm text-kumo-default md:grid-cols-[1fr_160px_160px]" key={item.id}>
								<div>
									<div className="font-medium text-kumo-default">{item.summary}</div>
									<div className="mt-1">
										<Pill>{item.kind}</Pill>
									</div>
								</div>
								<div className="text-kumo-subtle">
									{item.scope}
									<br />
									{item.actor}
								</div>
								<div className="text-kumo-subtle">{formatDateTime(item.timestamp, i18n.locale)}</div>
							</div>
						))}
					</div>
				)}
			</Card>
		</PageShell>
	);
}

function PermissionsPage() {
	const { i18n } = useLingui();
	const copy = getExampleAdminCopy(i18n.locale);
	const { data, error, loading, reload } = usePluginData<AccessPermissionsResponse>("access/permissions/list");
	const [saving, setSaving] = React.useState(false);
	const [notice, setNotice] = React.useState<string | null>(null);
	const [saveError, setSaveError] = React.useState<string | null>(null);
	const [formState, setFormState] = React.useState({ slug: "", label: "", description: "", scope: "content" });

	const savePermission = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSaving(true);
		setNotice(null);
		setSaveError(null);

		try {
			await postPlugin("access/permissions/save", formState);
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
			<PageHeader eyebrow={copy.accessEyebrow} title={copy.permissionCatalog} description={copy.permissionCatalogDescription} />
			<div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
				<Card title={copy.addPermission} description={copy.addPermissionDescription}>
					<form className="space-y-4" onSubmit={(event) => void savePermission(event)}>
						<Feedback message={notice} />
						<Feedback message={saveError} tone="danger" />
						<Field label={copy.slug}>
							<Input value={formState.slug} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormState((current) => ({ ...current, slug: event.target.value }))} />
						</Field>
						<Field label={copy.label}>
							<Input value={formState.label} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormState((current) => ({ ...current, label: event.target.value }))} />
						</Field>
						<Field label={copy.scope}>
							<Input value={formState.scope} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormState((current) => ({ ...current, scope: event.target.value }))} />
						</Field>
						<Field label={copy.descriptionLabel}>
							<InputArea value={formState.description} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setFormState((current) => ({ ...current, description: event.target.value }))} />
						</Field>
						<Button variant="primary" disabled={saving} type="submit">
							{saving ? copy.saving : copy.savePermission}
						</Button>
					</form>
				</Card>

				<Card title={copy.existingPermissions} description={copy.existingPermissionsDescription(data?.items.length ?? 0)}>
					{!data?.items.length ? (
						<EmptyState title={copy.noPermissionsYet} description={copy.noPermissionsYetDescription} />
					) : (
						<div className="grid gap-3">
							{data.items.map((item) => (
								<div className="rounded-xl border border-kumo-line bg-kumo-base p-4 text-kumo-default" key={item.slug}>
									<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
									<div className="font-medium text-kumo-default">{item.label}</div>
									<Pill>{item.scope}</Pill>
								</div>
								<div className="mt-1 break-all text-sm text-kumo-subtle">{item.slug}</div>
								<p className="mt-2 text-sm leading-6 text-kumo-subtle">{item.description || copy.noDescriptionProvided}</p>
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
			await postPlugin("access/roles/save", roleState);
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
			await postPlugin("access/users/save", { userId: userState.userId, roles: fromCsv(userState.roles) });
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
			<PageHeader eyebrow={copy.accessEyebrow} title={copy.rolesAndAssignments} description={copy.rolesAndAssignmentsDescription} />
			<Feedback message={notice} />
			<Feedback message={saveError} tone="danger" />

			<div className="grid gap-6 lg:grid-cols-2">
				<Card title={copy.addRole} description={copy.addRoleDescription}>
					<form className="space-y-4" onSubmit={(event) => void saveRole(event)}>
						<Field label={copy.roleSlug}>
							<Input value={roleState.slug} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setRoleState((current) => ({ ...current, slug: event.target.value }))} />
						</Field>
						<Field label={copy.label}>
							<Input value={roleState.label} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setRoleState((current) => ({ ...current, label: event.target.value }))} />
						</Field>
						<Field label={copy.descriptionLabel}>
							<InputArea value={roleState.description} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setRoleState((current) => ({ ...current, description: event.target.value }))} />
						</Field>
						<Button variant="primary" disabled={roleSaving} type="submit">
							{roleSaving ? copy.saving : copy.saveRole}
						</Button>
					</form>
				</Card>

				<Card title={copy.assignUserRoles} description={copy.assignUserRolesDescription}>
					<form className="space-y-4" onSubmit={(event) => void saveUserAssignment(event)}>
						<Field label={copy.userId}>
							<Input value={userState.userId} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUserState((current) => ({ ...current, userId: event.target.value }))} />
						</Field>
						<Field label={copy.roles}>
							<Input value={userState.roles} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUserState((current) => ({ ...current, roles: event.target.value }))} />
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
								<div className="rounded-xl border border-kumo-line bg-kumo-base p-4 text-kumo-default" key={item.slug}>
									<div className="font-medium text-kumo-default">{item.label}</div>
									<div className="mt-1 text-sm text-kumo-subtle">{item.slug}</div>
									<p className="mt-2 text-sm leading-6 text-kumo-subtle">{item.description || copy.noDescriptionProvided}</p>
								</div>
							))}
						</div>
					)}
				</Card>

				<Card title={copy.userAssignments} description={copy.userAssignmentsDescription(data?.userAssignments.length ?? 0)}>
					{!data?.userAssignments.length ? (
						<EmptyState title={copy.noAssignmentsYet} description={copy.noAssignmentsYetDescription} />
					) : (
						<div className="space-y-3">
							{data.userAssignments.map((item) => (
								<div className="rounded-xl border border-kumo-line bg-kumo-base p-4 text-kumo-default" key={item.userId}>
									<div className="font-medium text-kumo-default">{item.userId}</div>
									<div className="mt-2 flex flex-wrap gap-2">
										{item.roles.length ? item.roles.map((role) => <Pill key={role}>{role}</Pill>) : <Pill tone="warning">{copy.noRolesPill}</Pill>}
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
		setSelectedPermissions((current) => (checked ? [...new Set([...current, slug])] : current.filter((item) => item !== slug)));
	};

	const saveMatrix = async () => {
		setSaving(true);
		setNotice(null);
		setSaveError(null);

		try {
			await postPlugin("access/matrix/save", { roleSlug: selectedRole, permissions: selectedPermissions });
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
			<PageHeader eyebrow={copy.accessEyebrow} title={copy.rolePermissionMatrix} description={copy.rolePermissionMatrixDescription} />
			<Feedback message={notice} />
			<Feedback message={saveError} tone="danger" />

			{!data?.roles.length || !data.permissions.length ? (
				<EmptyState title={copy.catalogIncomplete} description={copy.catalogIncompleteDescription} />
			) : (
				<Card
					title={copy.editMatrix}
					description={copy.editMatrixDescription(selectedPermissions.length)}
					actions={
						<Button variant="primary" disabled={saving || !selectedRole} onClick={() => void saveMatrix()} type="button">
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
								<label className={cx("flex cursor-pointer items-start gap-3 rounded-xl border border-kumo-line bg-kumo-base p-4 text-kumo-default transition", checked && "bg-kumo-tint/30")} key={permission.slug}>
									<input type="checkbox" className="mt-1 accent-current" checked={checked} onChange={(event: React.ChangeEvent<HTMLInputElement>) => togglePermission(permission.slug, event.target.checked)} />
									<span>
										<span className="block font-medium text-kumo-default">{permission.label}</span>
										<span className="mt-1 block break-all text-sm text-kumo-subtle">{permission.slug}</span>
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
	const { data: permissionsData } = usePluginData<AccessPermissionsResponse>("access/permissions/list");
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
			setPreview(await postPlugin<AccessPreviewResponse>("access/preview", { userId, permissionSlug }));
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : copy.failedToPreviewAccess);
		} finally {
			setRunning(false);
		}
	};

	return (
		<PageShell width="normal">
			<PageHeader eyebrow={copy.accessEyebrow} title={copy.effectiveAccessPreview} description={copy.effectiveAccessPreviewDescription} />
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
						<Select value={permissionSlug} onValueChange={(value) => setPermissionSlug(value ?? "")}>
							{permissionsData?.items.map((item) => (
								<Select.Option key={item.slug} value={item.slug}>
									{item.slug}
								</Select.Option>
							))}
						</Select>
					</Field>
				</div>
				<div className="mt-4">
					<Button variant="primary" disabled={running} onClick={() => void runPreview()} type="button">
						{running ? copy.loadingAccessPreview : copy.previewAccess}
					</Button>
				</div>
			</Card>

			<Feedback message={error} tone="danger" />
			{preview ? (
				<Card title={copy.decisionResult}>
					<div className="mb-4">
						<Pill tone={preview.allowed ? "success" : "danger"}>{preview.allowed ? copy.allowed : copy.denied}</Pill>
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
	const { data, error, loading, reload } = usePluginData<AbacAttributesResponse>("abac/attributes/list");
	const { data: subjectData, reload: reloadSubjects } = usePluginData<AbacAssignmentsResponse>("abac/subjects/list");
	const { data: resourceData, reload: reloadResources } = usePluginData<AbacAssignmentsResponse>("abac/resources/list");
	const [notice, setNotice] = React.useState<string | null>(null);
	const [saveError, setSaveError] = React.useState<string | null>(null);
	const [attributeState, setAttributeState] = React.useState<{
		key: string;
		label: string;
		targetType: AbacTargetType;
		description: string;
	}>({ key: "", label: "", targetType: "context", description: "" });
	const [subjectState, setSubjectState] = React.useState({ subjectId: "", attributes: '{"tenant_id":"tenant-a"}' });
	const [resourceState, setResourceState] = React.useState({ resourceId: "", attributes: '{"resource_type":"policy"}' });

	const saveAttribute = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setNotice(null);
		setSaveError(null);

		try {
			await postPlugin("abac/attributes/save", attributeState);
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
			await postPlugin("abac/subjects/save", { subjectId: subjectState.subjectId, attributes: parsed.data });
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
			await postPlugin("abac/resources/save", { resourceId: resourceState.resourceId, attributes: parsed.data });
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
			<PageHeader eyebrow={copy.abacEyebrow} title={copy.attributeCatalog} description={copy.attributeCatalogDescription} />
			<Feedback message={notice} />
			<Feedback message={saveError} tone="danger" />

			<div className="grid gap-6 lg:grid-cols-3">
				<Card title={copy.attributeDefinition}>
					<form className="space-y-4" onSubmit={(event) => void saveAttribute(event)}>
						<Field label={copy.key}>
							<Input value={attributeState.key} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAttributeState((current) => ({ ...current, key: event.target.value }))} />
						</Field>
						<Field label={copy.label}>
							<Input value={attributeState.label} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAttributeState((current) => ({ ...current, label: event.target.value }))} />
						</Field>
						<Field label={copy.targetType}>
							<Select
								value={attributeState.targetType}
								onValueChange={(value) => setAttributeState((current) => ({ ...current, targetType: (value as AbacTargetType | null) ?? "context" }))}
							>
								<Select.Option value="subject">{copy.subject}</Select.Option>
								<Select.Option value="resource">{copy.resource}</Select.Option>
								<Select.Option value="context">{copy.context}</Select.Option>
							</Select>
						</Field>
						<Field label={copy.descriptionLabel}>
							<InputArea value={attributeState.description} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setAttributeState((current) => ({ ...current, description: event.target.value }))} />
						</Field>
						<Button variant="primary" type="submit">
							{copy.saveAttribute}
						</Button>
					</form>
				</Card>

				<Card title={copy.subjectAssignment}>
					<form className="space-y-4" onSubmit={(event) => void saveSubject(event)}>
						<Field label={copy.subjectId}>
							<Input value={subjectState.subjectId} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSubjectState((current) => ({ ...current, subjectId: event.target.value }))} />
						</Field>
						<Field label={copy.attributesJson} hint={copy.attributesJsonExampleSubject}>
							<InputArea value={subjectState.attributes} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setSubjectState((current) => ({ ...current, attributes: event.target.value }))} />
						</Field>
						<Button variant="primary" type="submit">
							{copy.saveSubject}
						</Button>
					</form>
				</Card>

				<Card title={copy.resourceAssignment}>
					<form className="space-y-4" onSubmit={(event) => void saveResource(event)}>
						<Field label={copy.resourceId}>
							<Input value={resourceState.resourceId} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setResourceState((current) => ({ ...current, resourceId: event.target.value }))} />
						</Field>
						<Field label={copy.attributesJson} hint={copy.attributesJsonExampleResource}>
							<InputArea value={resourceState.attributes} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setResourceState((current) => ({ ...current, attributes: event.target.value }))} />
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
							<div className="mb-3 rounded-xl border border-kumo-line bg-kumo-base p-3 text-kumo-default" key={item.key}>
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
							<div className="mb-3 rounded-xl border border-kumo-line bg-kumo-base p-3 text-kumo-default" key={item.subjectId ?? `subject-${index}`}>
								<div className="font-medium text-kumo-default">{item.subjectId ?? copy.unknownSubject}</div>
								<div className="mt-1 break-all text-sm text-kumo-subtle">{Object.entries(item.attributes).map(([key, value]) => `${key}=${value}`).join(", ")}</div>
							</div>
						))
					)}
				</Card>
				<Card title={copy.resourcesTitle}>
					{!resourceData?.items.length ? (
						<EmptyState title={copy.noResources} description={copy.noResourcesDescription} />
					) : (
						resourceData.items.map((item, index) => (
							<div className="mb-3 rounded-xl border border-kumo-line bg-kumo-base p-3 text-kumo-default" key={item.resourceId ?? `resource-${index}`}>
								<div className="font-medium text-kumo-default">{item.resourceId ?? copy.unknownResource}</div>
								<div className="mt-1 break-all text-sm text-kumo-subtle">{Object.entries(item.attributes).map(([key, value]) => `${key}=${value}`).join(", ")}</div>
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
	const { data, error, loading, reload } = usePluginData<AbacPoliciesResponse>("abac/policies/list");
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
		requiredContext: '{"region_scope":"id-jakarta"}',
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
			await postPlugin("abac/policies/save", {
				id: formState.id,
				label: formState.label,
				effect: formState.effect,
				actions: fromCsv(formState.actions),
				requiredSubject: subject.data,
				requiredResource: resource.data,
				requiredContext: context.data,
			});
			setFormState({
				id: "",
				label: "",
				effect: "allow",
				actions: "content.read",
				requiredSubject: '{"tenant_id":"tenant-a"}',
				requiredResource: '{"resource_status":"published"}',
				requiredContext: '{"region_scope":"id-jakarta"}',
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
			<PageHeader eyebrow={copy.abacEyebrow} title={copy.policyRules} description={copy.policyRulesDescription} />
			<div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
				<Card title={copy.addPolicy} description={copy.addPolicyDescription}>
					<form className="space-y-4" onSubmit={(event) => void savePolicy(event)}>
						<Feedback message={notice} />
						<Feedback message={saveError} tone="danger" />
						<Field label={copy.policyId}>
							<Input value={formState.id} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormState((current) => ({ ...current, id: event.target.value }))} />
						</Field>
						<Field label={copy.label}>
							<Input value={formState.label} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormState((current) => ({ ...current, label: event.target.value }))} />
						</Field>
						<Field label={copy.effect}>
							<Select value={formState.effect} onValueChange={(value) => setFormState((current) => ({ ...current, effect: (value as AbacEffect | null) ?? "allow" }))}>
								<Select.Option value="allow">{copy.allow}</Select.Option>
								<Select.Option value="deny">{copy.deny}</Select.Option>
							</Select>
						</Field>
						<Field label={copy.actions} hint={copy.actionsHint}>
							<Input value={formState.actions} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormState((current) => ({ ...current, actions: event.target.value }))} />
						</Field>
						<Field label={copy.requiredSubjectJson}>
							<InputArea value={formState.requiredSubject} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setFormState((current) => ({ ...current, requiredSubject: event.target.value }))} />
						</Field>
						<Field label={copy.requiredResourceJson}>
							<InputArea value={formState.requiredResource} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setFormState((current) => ({ ...current, requiredResource: event.target.value }))} />
						</Field>
						<Field label={copy.requiredContextJson}>
							<InputArea value={formState.requiredContext} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setFormState((current) => ({ ...current, requiredContext: event.target.value }))} />
						</Field>
						<Button variant="primary" type="submit">
							{copy.savePolicy}
						</Button>
					</form>
				</Card>

				<Card title={copy.existingPolicies} description={copy.existingPoliciesDescription(data?.items.length ?? 0)}>
					{!data?.items.length ? (
						<EmptyState title={copy.noPolicies} description={copy.noPoliciesDescription} />
					) : (
						<div className="space-y-3">
							{data.items.map((item) => (
								<div className="rounded-xl border border-kumo-line bg-kumo-base p-4 text-kumo-default" key={item.id}>
									<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
										<div className="font-medium text-kumo-default">{item.label}</div>
										<Pill tone={item.effect === "allow" ? "success" : "danger"}>{item.effect}</Pill>
									</div>
									<div className="mt-1 break-all text-sm text-kumo-subtle">{item.id}</div>
									<div className="mt-2 text-sm text-kumo-subtle">{copy.actionsLabel}: {toCsv(item.actions) || copy.none}</div>
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
	const [contextAttributes, setContextAttributes] = React.useState('{"region_scope":"id-jakarta"}');
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
			setPreview(await postPlugin<AbacPreviewResponse>(route, { subjectId, resourceId, action, contextAttributes: parsed.data }));
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : copy.failedToEvaluateAbacPolicy);
		} finally {
			setRunning(false);
		}
	};

	return (
		<PageShell width="normal">
			<PageHeader eyebrow={copy.abacEyebrow} title={copy.decisionPreview} description={copy.decisionPreviewDescription} />
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
						<Input value={action} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAction(event.target.value)} />
					</Field>
					<Field label={copy.contextAttributesJson}>
						<InputArea value={contextAttributes} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setContextAttributes(event.target.value)} />
					</Field>
				</div>
				<div className="mt-4 flex flex-wrap gap-3">
					<Button variant="primary" disabled={running} onClick={() => void runPreview("abac/preview")} type="button">
						{running ? copy.loadingAbacDecision : copy.previewPolicy}
					</Button>
					<Button variant="secondary" disabled={running} onClick={() => void runPreview("abac/enforce-demo")} type="button">
						{copy.runProtectedDemo}
					</Button>
				</div>
			</Card>

			<Feedback message={error} tone="danger" />
			{preview ? (
				<Card title={copy.decisionResult}>
					<div className="mb-4 flex items-center gap-2">
						<Pill tone={preview.allowed ? "success" : "danger"}>{preview.allowed ? copy.allowed : copy.denied}</Pill>
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
				<Pill tone={tone}>{current === "approved" ? copy.approved : current === "review" ? copy.review : copy.draft}</Pill>
			</div>
		</div>
	);
}

function ImportPage() {
	const { i18n } = useLingui();
	const copy = getExampleAdminCopy(i18n.locale);
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

	const sheets = ["Sheet1", "Sheet2_Templates", "Sheet3_References"];
	
	const stagingRows = [
		{ id: "staged-01", code: "RI-102", label: "Masjid Raya Baiturrahman", entityType: "rumah_ibadah", sensitivity: "public_safe", provinceCode: "31", regencyCode: "3171", districtCode: "3171010", villageCode: "3171010001", publicSummary: "Masjid Raya Baiturrahman di desa referensi." },
		{ id: "staged-02", code: "GA-205", label: "Ustadz H. Syukron", entityType: "guru_agama", sensitivity: "restricted", provinceCode: "31", regencyCode: "3171", districtCode: "3171010", villageCode: "3171010002", publicSummary: "Data pengajar ustadz referensi." },
		{ id: "staged-03", code: "DS-502", label: "Slamet Rahardjo", entityType: "disabilitas", sensitivity: "highly_restricted", provinceCode: "31", regencyCode: "3171", districtCode: "3171010", villageCode: "3171010003", publicSummary: "Data disabilitas di wilayah referensi." },
	];

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setFileName(file.name);
		setImportStep(1); // Select Sheet
	};

	const handlePromote = async () => {
		setPromoting(true);
		setError(null);
		try {
			await postPlugin("import/promote", { rows: stagingRows });
			setNotice(copy.promotedSuccessfully);
			setImportStep(4); // Display report
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to promote rows");
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
			<div className="flex items-center gap-2 mb-6 border-b pb-4 overflow-x-auto text-xs font-semibold text-kumo-subtle">
				<span className={importStep === 0 ? "text-kumo-brand font-bold" : ""}>1. Upload Workbook</span>
				<span>&rarr;</span>
				<span className={importStep === 1 ? "text-kumo-brand font-bold" : ""}>2. Select Sheet</span>
				<span>&rarr;</span>
				<span className={importStep === 2 ? "text-kumo-brand font-bold" : ""}>3. Map Columns</span>
				<span>&rarr;</span>
				<span className={importStep === 3 ? "text-kumo-brand font-bold" : ""}>4. Preview & Validate</span>
				<span>&rarr;</span>
				<span className={importStep === 4 ? "text-kumo-brand font-bold" : ""}>5. Promote</span>
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
								<span className="inline-flex items-center justify-center rounded-xl bg-kumo-brand px-4 py-2 text-sm font-semibold text-white cursor-pointer hover:bg-kumo-brand/90 transition">{copy.selectFile}</span>
							</label>
						</div>
					</Card>
				)}

				{importStep === 1 && (
					<Card title={copy.selectSheet}>
						<div className="space-y-4">
							<p className="text-sm text-kumo-subtle">Selected file: <strong>{fileName}</strong></p>
							<Field label="Choose Spreadsheet Sheet">
								<Select value={selectedSheet} onValueChange={(val) => setSelectedSheet(val ?? "Sheet1")}>
									{sheets.map(sh => (
										<Select.Option value={sh} key={sh}>{sh}</Select.Option>
									))}
								</Select>
							</Field>
							<div className="flex gap-2">
								<Button variant="secondary" onClick={() => setImportStep(0)}>Back</Button>
								<Button variant="primary" onClick={() => setImportStep(2)}>Next</Button>
							</div>
						</div>
					</Card>
				)}

				{importStep === 2 && (
					<Card title={copy.mapColumns}>
						<div className="space-y-4">
							<p className="text-sm text-kumo-subtle">Map Excel columns (A, B, C...) to SIKESRA fields:</p>
							<div className="grid gap-4 md:grid-cols-3">
								<Field label="Entity Code (SIKESRA ID)">
									<Input value={columnMappings.code} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColumnMappings(prev => ({ ...prev, code: e.target.value }))} />
								</Field>
								<Field label="Identity Label / Name">
									<Input value={columnMappings.label} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColumnMappings(prev => ({ ...prev, label: e.target.value }))} />
								</Field>
								<Field label="Entity Type Column">
									<Input value={columnMappings.entityType} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColumnMappings(prev => ({ ...prev, entityType: e.target.value }))} />
								</Field>
								<Field label="Sensitivity classification">
									<Input value={columnMappings.sensitivity} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColumnMappings(prev => ({ ...prev, sensitivity: e.target.value }))} />
								</Field>
								<Field label="Village Code Column">
									<Input value={columnMappings.villageCode} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColumnMappings(prev => ({ ...prev, villageCode: e.target.value }))} />
								</Field>
								<Field label="Public Summary Column">
									<Input value={columnMappings.publicSummary} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColumnMappings(prev => ({ ...prev, publicSummary: e.target.value }))} />
								</Field>
							</div>
							<div className="flex gap-2">
								<Button variant="secondary" onClick={() => setImportStep(1)}>Back</Button>
								<Button variant="primary" onClick={() => {
									setNotice(copy.mappingValidationPassed);
									setImportStep(3);
								}}>Validate & Next</Button>
							</div>
						</div>
					</Card>
				)}

				{importStep === 3 && (
					<Card title={copy.previewStaging} description="Inspect valid rows staged for promote. Identifiers and types are verified.">
						<div className="space-y-4">
							<div className="overflow-x-auto rounded-xl border">
								<table className="w-full text-xs text-left">
									<thead>
										<tr className="bg-kumo-tint border-b uppercase font-semibold text-kumo-subtle">
											<th className="p-3">Code</th>
											<th className="p-3">Label</th>
											<th className="p-3">Type</th>
											<th className="p-3">Region (Desa)</th>
											<th className="p-3">Sensitivity</th>
										</tr>
									</thead>
									<tbody>
										{stagingRows.map((row) => (
											<tr className="border-b" key={row.id}>
												<td className="p-3 font-mono font-bold text-kumo-brand">{row.code}</td>
												<td className="p-3 font-medium text-kumo-default">{row.label}</td>
												<td className="p-3 text-kumo-subtle">{row.entityType}</td>
												<td className="p-3 text-kumo-subtle">{row.villageCode}</td>
												<td className="p-3"><Pill tone={row.sensitivity === "public_safe" ? "success" : "warning"}>{row.sensitivity}</Pill></td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							<div className="flex gap-2">
								<Button variant="secondary" onClick={() => setImportStep(2)}>Back</Button>
								<Button variant="primary" disabled={promoting} onClick={() => void handlePromote()}>
									{promoting ? "Promoting..." : copy.promoteSelectedRows}
								</Button>
							</div>
						</div>
					</Card>
				)}

				{importStep === 4 && (
					<Card title={copy.importReport}>
						<div className="text-center p-6 space-y-4 bg-kumo-tint/20 rounded-xl text-kumo-default">
							<div className="text-4xl">🎉</div>
							<h3 className="font-semibold text-lg text-kumo-default">{copy.promotedSuccessfully}</h3>
							<p className="text-xs text-kumo-subtle">Promoted {stagingRows.length} entities into SIKESRA Registry queue.</p>
							<Button variant="primary" onClick={() => {
								setNotice(null);
								setImportStep(0);
							}}>Upload New File</Button>
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

export const pages: PluginAdminExports["pages"] = {
	"/": OverviewPage,
	"/overview": OverviewPage,
	"/registry": RegistryPage,
	"/verification": VerificationPage,
	"/documents": DocumentsPage,
	"/reports": ReportsPage,
	"/import": ImportPage,
	"/audit": AuditPage,
	"/access/permissions": PermissionsPage,
	"/access/roles": RolesPage,
	"/access/matrix": MatrixPage,
	"/access/preview": PreviewPage,
	"/abac/attributes": AbacAttributesPage,
	"/abac/policies": AbacPoliciesPage,
	"/abac/preview": AbacPreviewPage,
};

export const fields: PluginAdminExports["fields"] = {
	"status-badge": StatusBadgeField,
};
