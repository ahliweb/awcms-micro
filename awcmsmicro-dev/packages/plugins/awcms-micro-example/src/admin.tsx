import { Badge, Button, Input, InputArea, LinkButton, Select } from "@cloudflare/kumo";
import type { PluginAdminExports } from "emdash";
import { apiFetch, getErrorMessage, parseApiResponse } from "emdash/plugin-utils";
import * as React from "react";
import { useLingui } from "@lingui/react";
import { getExampleAdminCopy } from "./admin-copy.js";
import { normalizeAdminNav, PluginLocalNav } from "./navigation.js";
import { AWCMS_EXAMPLE_MANIFEST } from "./runtime.js";

import { SIKESRA_REFERENCE_FIXTURES, maskSensitive } from "./fixtures.js";

const PLUGIN_API_BASE = "/_emdash/api/plugins/awcms-micro-example";
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

export const AWCMS_EXAMPLE_DASHBOARD_MODULE_CARDS = getDashboardModuleCards("en");

export const AWCMS_EXAMPLE_PLUGIN_HEADER_MENU: PluginHeaderMenuItem[] = [
	{
		id: "overview",
		label: "Overview",
		href: "/overview",
		permission: "awcms:example:dashboard:read",
	},
	{
		id: "data-entry",
		label: "Data Entry",
		href: "/registry",
		permission: "awcms:example:dashboard:read",
		children: [
			{
				id: "registry",
				label: "Registry",
				href: "/registry",
				permission: "awcms:example:dashboard:read",
			},
			{
				id: "documents",
				label: "Documents",
				href: "/documents",
				permission: "awcms:example:dashboard:read",
			},
		],
	},
	{
		id: "verification",
		label: "Verification",
		href: "/verification",
		permission: "awcms:example:audit:read",
	},
	{
		id: "reports",
		label: "Reports",
		href: "/reports",
		permission: "awcms:example:audit:read",
	},
	{
		id: "settings",
		label: "Settings",
		href: "/access/permissions",
		permission: "awcms:example:settings:read",
		children: [
			{
				id: "permissions",
				label: "Permissions",
				href: "/access/permissions",
				permission: "awcms:example:permissions:read",
			},
			{
				id: "roles",
				label: "Roles",
				href: "/access/roles",
				permission: "awcms:example:roles:read",
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

	const normalizedGroups = normalizeAdminNav([AWCMS_EXAMPLE_MANIFEST], {
		hasPermission: (permission) => !permission || permission.endsWith(":read"),
	});

	return (
		<PluginLocalNav
			groups={normalizedGroups}
			currentPath={currentPath}
			locale={locale}
			messages={AWCMS_EXAMPLE_MANIFEST.i18n?.messages}
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
	}>({
		publicStatusLabel: "",
		auditRetentionDays: "30",
		governanceMode: "review",
		metadataCanonicalBase: "",
	});

	React.useEffect(() => {
		if (!data) return;
		setFormState({
			publicStatusLabel: data.settings.publicStatusLabel,
			auditRetentionDays: String(data.settings.auditRetentionDays),
			governanceMode: (data.settings.governanceMode as GovernanceMode) ?? "review",
			metadataCanonicalBase: data.settings.metadataCanonicalBase,
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
	const [step, setStep] = React.useState(0);
	const [wizardState, setWizardState] = React.useState({
		label: SIKESRA_REFERENCE_FIXTURES.registryEntities[0]?.label ?? "",
		provinceCode: SIKESRA_REFERENCE_FIXTURES.registryEntities[0]?.region.provinceCode ?? "",
		sensitivity: SIKESRA_REFERENCE_FIXTURES.registryEntities[0]?.sensitivity ?? "public_safe",
		code: SIKESRA_REFERENCE_FIXTURES.registryEntities[0]?.code ?? "",
	});

	const registryEntities = SIKESRA_REFERENCE_FIXTURES.registryEntities;
	const activeEntity = registryEntities[Math.min(step, registryEntities.length - 1)] ?? registryEntities[0];
	const verifiedCount = registryEntities.filter((entity) => entity.verificationStage === "active_verified").length;
	const restrictedCount = registryEntities.filter((entity) => entity.sensitivity !== "public_safe").length;
	const codePreview = maskSensitive(wizardState.code, step === copy.registrySteps.length - 1);
	const currentStepLabel = copy.registrySteps[step] || copy.registrySteps[0] || "";

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

			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] mt-2">
				<Card title={copy.registryQueue} description={copy.registryQueueDescription}>
					<div className="overflow-hidden rounded-xl border border-kumo-line bg-kumo-base text-kumo-default">
						<div className="grid grid-cols-[1.1fr_.8fr_.9fr_.9fr] gap-3 border-b border-kumo-line bg-kumo-tint/50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-kumo-subtle max-md:hidden">
							<div>{copy.entity}</div>
							<div>{copy.region}</div>
							<div>{copy.sensitivity}</div>
							<div>{copy.stage}</div>
						</div>
						{registryEntities.map((entity) => (
							<div className="grid gap-2 border-t border-kumo-line px-4 py-3 text-sm md:grid-cols-[1.1fr_.8fr_.9fr_.9fr]" key={entity.id}>
								<div>
									<div className="font-medium text-kumo-default">{entity.label}</div>
									<div className="mt-1 break-all text-xs text-kumo-subtle">{maskSensitive(entity.code, entity.sensitivity === "public_safe")}</div>
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
								<div className="text-kumo-subtle">{entity.verificationStage}</div>
							</div>
						))}
					</div>
				</Card>

				<Card title={copy.progressiveInputWizard} description={copy.progressiveInputWizardDescription}>
					<div className="space-y-4">
						<div className="grid grid-cols-4 gap-2 text-xs font-medium uppercase tracking-wide text-kumo-subtle">
							{copy.registrySteps.map((label, index) => (
								<button
									className={cx("rounded-full border px-3 py-2 text-start", index === step ? "border-kumo-brand bg-kumo-brand/10 text-kumo-brand" : "border-kumo-line bg-kumo-base text-kumo-subtle")}
									key={label}
									onClick={() => setStep(index)}
									type="button"
								>
									{index + 1}. {label}
								</button>
							))}
						</div>

						<div className="rounded-xl border border-kumo-line bg-kumo-base p-4">
							<div className="text-sm font-semibold text-kumo-default">{copy.stepLabel(step + 1, currentStepLabel)}</div>
							<p className="mt-2 text-sm leading-6 text-kumo-subtle">
								{step === 0 ? copy.registryStepIdentity : null}
								{step === 1 ? copy.registryStepRegion : null}
								{step === 2 ? copy.registryStepDocuments : null}
								{step === 3 ? copy.registryStepReview : null}
							</p>
							<div className="mt-4 space-y-3">
								<Field label={copy.registryLabel} hint={copy.registryLabelHint}>
									<Input value={wizardState.label} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setWizardState((current) => ({ ...current, label: event.target.value }))} />
								</Field>
								<div className="grid gap-4 md:grid-cols-2">
									<Field label={copy.provinceCode} hint={copy.provinceCodeHint}>
										<Input value={wizardState.provinceCode} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setWizardState((current) => ({ ...current, provinceCode: event.target.value }))} />
									</Field>
									<Field label={copy.sensitivity} hint={copy.sensitivityHint}>
								<Select value={wizardState.sensitivity} onValueChange={(value) => setWizardState((current) => ({ ...current, sensitivity: (value as typeof SIKESRA_REFERENCE_FIXTURES["registryEntities"][number]["sensitivity"] | null) ?? "public_safe" }))}>
						<Select.Option value="public_safe">{copy.publicSafe}</Select.Option>
						<Select.Option value="internal">{copy.internal}</Select.Option>
						<Select.Option value="restricted">{copy.restricted}</Select.Option>
						<Select.Option value="highly_restricted">{copy.highlyRestricted}</Select.Option>
										</Select>
									</Field>
								</div>
								<div className="rounded-lg border border-dashed border-kumo-line bg-kumo-tint/30 p-4 text-sm text-kumo-subtle">
									<div className="font-medium text-kumo-default">{copy.preview}</div>
									<div className="mt-2 grid gap-1">
										<div>{copy.code}: {codePreview}</div>
										<div>{copy.label}: {wizardState.label || copy.untitledRegistryEntity}</div>
										<div>{copy.region}: {wizardState.provinceCode || "--"}</div>
										<div>{copy.sensitivity}: {wizardState.sensitivity}</div>
									</div>
								</div>
							</div>

							<div className="mt-4 flex items-center gap-2">
								<Button variant="secondary" size="sm" type="button" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))}>
									{copy.previous}
								</Button>
								<Button variant="secondary" size="sm" type="button" disabled={step === copy.registrySteps.length - 1} onClick={() => setStep((current) => Math.min(copy.registrySteps.length - 1, current + 1))}>
									{copy.next}
								</Button>
							</div>

							<div className="mt-4 rounded-xl border border-kumo-line bg-kumo-base p-4 text-sm text-kumo-subtle">
								<div className="font-medium text-kumo-default">{copy.activeReferenceRecord}</div>
								<div className="mt-2">{activeEntity?.label}</div>
								<div className="mt-1">{maskSensitive(activeEntity?.code ?? null, step === copy.registrySteps.length - 1)}</div>
								<div className="mt-1">{activeEntity?.verificationStage}</div>
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
	const [isAdvancing, setIsAdvancing] = React.useState(false);
	const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
	const [mutationError, setMutationError] = React.useState<string | null>(null);
	const queue = data?.items ?? [];
	const pending = queue.filter((item) => item.canAdvance).length;
	const approved = queue.filter((item) => item.verificationStage === "active_verified").length;
	const nextCandidate = queue.find((item) => item.canAdvance) ?? null;

	if (loading) return <PageShell><LoadingState label={copy.loadingVerificationQueue} /></PageShell>;
	if (error) return <PageShell><ErrorState message={error} onRetry={() => void reload()} /></PageShell>;

	async function advanceNextStage() {
		if (!nextCandidate) return;
		setIsAdvancing(true);
		setMutationError(null);
		setStatusMessage(null);
		try {
			const response = await postPlugin<VerificationAdvanceResponse>("verification/advance", {
				registryEntityId: nextCandidate.registryEntityId,
				actor: "district-officer",
								notes: copy.verificationAdvanceNote,
			});
			setStatusMessage(copy.advancedTo(response.item.code, response.item.verificationStage));
			await reload();
		} catch (cause) {
			setMutationError(cause instanceof Error ? cause.message : copy.requestFailed);
		} finally {
			setIsAdvancing(false);
		}
	}

	return (
		<PageShell>
			<PageHeader
				eyebrow={copy.verificationEyebrow}
				title={copy.verificationTitle}
				description={copy.verificationDescription}
				actions={
					nextCandidate ? (
						<Button disabled={isAdvancing} onClick={() => void advanceNextStage()} size="sm" variant="secondary">
							{isAdvancing ? copy.advancing : copy.advanceTo(nextCandidate.code, nextCandidate.nextStage)}
						</Button>
					) : null
				}
			/>

			{statusMessage ? <div className="rounded-xl border border-kumo-success/30 bg-kumo-success/10 px-4 py-3 text-sm text-kumo-default">{statusMessage}</div> : null}
			{mutationError ? <div className="rounded-xl border border-kumo-danger/30 bg-kumo-danger/10 px-4 py-3 text-sm text-kumo-default">{mutationError}</div> : null}

			<div className="grid gap-5 md:grid-cols-3">
				<MetricCard label={copy.queuedEvents} value={queue.length} hint={copy.queuedEventsHint} />
				<MetricCard label={copy.approved} value={approved} hint={copy.approvedHint} />
				<MetricCard label={copy.needsReview} value={pending} hint={copy.needsReviewHint} />
			</div>

			<Card title={copy.registryVerificationQueue} description={copy.registryVerificationQueueDescription}>
				<div className="space-y-3">
					{queue.map((item) => (
						<div className="rounded-xl border border-kumo-line bg-kumo-base p-4" key={item.id}>
							<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
								<div>
									<div className="font-medium text-kumo-default">{item.label}</div>
									<div className="mt-1 text-sm text-kumo-subtle">{item.publicSummary}</div>
								</div>
								<div className="flex items-center gap-2">
									<Pill tone={item.canAdvance ? "warning" : "success"}>{item.verificationStage}</Pill>
									<Pill>{item.nextStage ?? copy.final}</Pill>
								</div>
							</div>
							<div className="mt-3 grid gap-2 text-xs text-kumo-subtle md:grid-cols-3">
								<div>{copy.region}: {item.region.provinceCode}/{item.region.regencyCode}</div>
								<div>{copy.documentsCount}: {item.supportingDocumentIds.length}</div>
								<div>{copy.idLabel}: {maskSensitive(item.id, false)}</div>
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
	const docs = SIKESRA_REFERENCE_FIXTURES.supportingDocuments;
	const sensitiveCount = docs.filter((doc) => doc.sensitivity !== "public_safe").length;

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

			<Card title={copy.documentCatalog} description={copy.documentCatalogDescription}>
				<div className="space-y-3">
					{docs.map((doc) => (
						<div className="rounded-xl border border-kumo-line bg-kumo-base p-4" key={doc.id}>
							<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
								<div>
									<div className="font-medium text-kumo-default">{doc.title}</div>
									<div className="mt-1 text-sm text-kumo-subtle">{doc.documentType}</div>
								</div>
								<Pill tone={doc.sensitivity === "public_safe" ? "success" : doc.sensitivity === "restricted" ? "warning" : "danger"}>{doc.sensitivity}</Pill>
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
					<Select.Option value="review">Review</Select.Option>
					<Select.Option value="approved">Approved</Select.Option>
				</Select>
				<Pill tone={tone}>{current}</Pill>
			</div>
		</div>
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
