import { Badge, Button, Input, InputArea, LinkButton, Select } from "@cloudflare/kumo";
import type { PluginAdminExports } from "emdash";
import { apiFetch, getErrorMessage, parseApiResponse } from "emdash/plugin-utils";
import * as React from "react";
import { useLingui } from "@lingui/react";
import { normalizeAdminNav, PluginLocalNav } from "@awcms-micro/core";
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

const REGISTRY_WIZARD_STEPS = ["Identity", "Region", "Documents", "Review"] as const;

export const AWCMS_EXAMPLE_DASHBOARD_MODULE_CARDS: DashboardModuleCard[] = [
	{
		id: "registry",
		title: "Worship Places",
		description: "Register worship place records and keep region scope visible for operators.",
		href: "/registry",
		status: "Ready",
		badge: "Core",
	},
	{
		id: "institutions",
		title: "Religious Institutions",
		description: "Track institutional records and their verification progress.",
		href: "/registry",
		status: "Ready",
		badge: "Core",
	},
	{
		id: "education",
		title: "Religious Education",
		description: "Keep education entries staged for verification and reporting.",
		href: "/verification",
		status: "Review",
		badge: "Queue",
	},
	{
		id: "welfare",
		title: "Social Welfare Institutions",
		description: "Review welfare-related records with public-safe aggregation in mind.",
		href: "/reports",
		status: "Ready",
		badge: "Report",
	},
	{
		id: "teachers",
		title: "Religion Teachers",
		description: "Keep staff metadata aligned with the access and verification workflow.",
		href: "/access/roles",
		status: "Ready",
		badge: "Access",
	},
	{
		id: "orphans",
		title: "Orphans",
		description: "Reference child-support records with careful masking and audit traces.",
		href: "/audit",
		status: "Audit",
		badge: "Audit",
	},
	{
		id: "disabilities",
		title: "Disabilities",
		description: "Manage sensitive records with ABAC-ready preview surfaces.",
		href: "/abac/preview",
		status: "Restricted",
		badge: "ABAC",
	},
	{
		id: "elderly",
		title: "Abandoned Elderly",
		description: "Keep high-sensitivity examples available without exposing public identifiers.",
		href: "/documents",
		status: "Locked",
		badge: "Docs",
	},
];
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

function formatDateTime(value: string | null | undefined) {
	if (!value) return "Never";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleString();
}

function parseJsonMap(value: string): { ok: true; data: JsonMap } | { ok: false; error: string } {
	try {
		const parsed = JSON.parse(value) as unknown;
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
			return { ok: false, error: 'Use a JSON object, for example {"tenant_id":"tenant-a"}.' };
		}

		const entries = Object.entries(parsed).map(([key, item]) => [key, String(item)] as const);
		return { ok: true, data: Object.fromEntries(entries) };
	} catch {
		return { ok: false, error: "Invalid JSON. Check quotes, commas, and braces." };
	}
}

async function postPlugin<T>(path: string, payload: unknown = {}) {
	const response = await apiFetch(`${PLUGIN_API_BASE}/${path}`, {
		method: "POST",
		headers: JSON_HEADERS,
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		throw new Error(await getErrorMessage(response, "Request failed"));
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
			setError(cause instanceof Error ? cause.message : "Request failed");
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

	const normalizedGroups = normalizeAdminNav([AWCMS_EXAMPLE_MANIFEST], {
		hasPermission: (permission) => !permission || permission.endsWith(":read"),
	});

	return (
		<PluginLocalNav
			groups={normalizedGroups}
			currentPath={currentPath}
			locale={locale}
			messages={AWCMS_EXAMPLE_MANIFEST.i18n?.messages}
			title="Plugin Operations Center"
			description="Reference navigation for registry, verification, reports, access, and ABAC flows."
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
	return (
		<div className="rounded-2xl border border-kumo-danger/30 bg-kumo-danger/10 p-5 text-sm text-kumo-danger">
			<div className="font-medium">Something went wrong</div>
			<div className="mt-1">{message}</div>
			{onRetry ? (
				<Button className="mt-3" variant="secondary" size="sm" onClick={onRetry} type="button">
					Retry
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

	if (loading) return <LoadingState label="Loading governance status..." />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;
	if (!data) return <EmptyState title="No status yet" description="The plugin did not return summary data." />;

	return (
		<div className="space-y-3">
			<div className="grid grid-cols-3 gap-2 text-sm">
				<MetricCard label="Audit" value={data.counters.auditCount} />
				<MetricCard label="Lifecycle" value={data.counters.lifecycleCount} />
				<MetricCard label="Public hits" value={data.counters.publicHits} />
			</div>
			<KeyValueList
				items={[
					["Mode", <Pill key="mode">{data.settings.governanceMode}</Pill>],
					["Last lifecycle", formatDateTime(data.lastLifecycle)],
				]}
			/>
			<Button variant="ghost" size="sm" onClick={() => void reload()} type="button">
				Refresh
			</Button>
		</div>
	);
}

function AccessRightsHealthWidget() {
	const { data, error, loading, reload } = usePluginData<AccessHealthResponse>("access/health");

	if (loading) return <LoadingState label="Loading access health..." />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;
	if (!data) return <EmptyState title="No health data" description="The access catalog did not return health data." />;

	const hasGaps = data.rolesWithoutPermissions.length > 0 || data.usersWithoutRoles.length > 0;

	return (
		<div className="space-y-3">
			<div className="grid grid-cols-2 gap-2 text-sm">
				<MetricCard label="Permissions" value={data.permissionCount} />
				<MetricCard label="Roles" value={data.roleCount} />
				<MetricCard label="Matrices" value={data.assignmentCount} />
				<MetricCard label="Users" value={data.userAssignmentCount} />
			</div>
			<div className="text-sm">
				<Pill tone={hasGaps ? "warning" : "success"}>{hasGaps ? "Review needed" : "Healthy"}</Pill>
				<p className="mt-2 text-kumo-subtle">
					{hasGaps
						? `${data.rolesWithoutPermissions.length} role(s) without permissions and ${data.usersWithoutRoles.length} user assignment(s) without roles.`
						: "No obvious catalog health gaps detected."}
				</p>
			</div>
			<Button variant="ghost" size="sm" onClick={() => void reload()} type="button">
				Refresh
			</Button>
		</div>
	);
}

function AbacPolicyStatusWidget() {
	const { data, error, loading, reload } = usePluginData<AbacHealthResponse>("abac/health");

	if (loading) return <LoadingState label="Loading ABAC status..." />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;
	if (!data) return <EmptyState title="No ABAC data" description="The ABAC routes did not return health data." />;

	return (
		<div className="space-y-3">
			<div className="grid grid-cols-2 gap-2 text-sm">
				<MetricCard label="Attributes" value={data.attributeCount} />
				<MetricCard label="Policies" value={data.policyCount} />
				<MetricCard label="Subjects" value={data.subjectCount} />
				<MetricCard label="Resources" value={data.resourceCount} />
			</div>
			<div className="text-sm text-kumo-subtle">Explicit deny policies: {data.explicitDenyCount}</div>
			<Button variant="ghost" size="sm" onClick={() => void reload()} type="button">
				Refresh
			</Button>
		</div>
	);
}

function OverviewPage() {
	const { data, error, loading, reload } = usePluginData<SummaryResponse>("overview/summary");
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
			setNotice("Settings saved successfully.");
			await reload();
		} catch (cause) {
			setSaveError(cause instanceof Error ? cause.message : "Failed to save settings");
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <LoadingState label="Loading plugin overview..." />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;
	if (!data) return <EmptyState title="No overview data" description="The plugin did not return overview data." />;

	return (
		<PageShell>
			<PageHeader
				eyebrow="AWCMS-Micro plugin"
				title="Plugin Operations Center"
				description="Welcome to the AWCMS-Micro demonstration plugin. This console allows you to manage audit logs, lifecycle events, and simulate Role-Based and Attribute-Based Access Control (RBAC/ABAC) policies securely without modifying the EmDash core."
				actions={
					<Button variant="secondary" size="sm" onClick={() => void reload()} type="button">
						Refresh Dashboard
					</Button>
				}
			/>

			<Feedback message="Dashboard initialized successfully. All plugin sub-systems (Audit, RBAC, ABAC) are fully active and connected to the underlying D1 database." tone="success" />

			<div className="grid gap-5 md:grid-cols-3 mt-2">
				<MetricCard label="Audit Events Stored" value={data.counters.auditCount} hint="Tracks all critical plugin activity" />
				<MetricCard label="Lifecycle Triggers" value={data.counters.lifecycleCount} hint={`Last recorded: ${formatDateTime(data.lastLifecycle)}`} />
				<MetricCard label="Public API Hits" value={data.counters.publicHits} hint={`Last chron: ${formatDateTime(data.lastCronAt)}`} />
			</div>

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{AWCMS_EXAMPLE_DASHBOARD_MODULE_CARDS.map((card) => (
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
							Open module
						</LinkButton>
					</section>
				))}
			</div>

			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] mt-2">
				<Card title="Plugin Configuration" description="Manage global settings for this plugin. These settings dictate how the public status route and governance workflows behave.">
					<form className="space-y-4" onSubmit={(event) => void saveSettings(event)}>
						<Feedback message={notice} />
						<Feedback message={saveError} tone="danger" />

						<Field label="Public status label" hint="Shown by the public-safe status route.">
							<Input
								value={formState.publicStatusLabel}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setFormState((current) => ({ ...current, publicStatusLabel: event.target.value }))
								}
							/>
						</Field>

						<div className="grid gap-4 md:grid-cols-2">
							<Field label="Audit retention days" hint="Use a positive number. Example: 30.">
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

							<Field label="Governance mode" hint="Observe logs only, review, or run the demo enforcement path.">
								<Select
									value={formState.governanceMode}
									onValueChange={(value) =>
										setFormState((current) => ({ ...current, governanceMode: (value as GovernanceMode | null) ?? "review" }))
									}
								>
									<Select.Option value="observe">Observe</Select.Option>
									<Select.Option value="review">Review</Select.Option>
									<Select.Option value="enforce-demo">Enforce demo</Select.Option>
								</Select>
							</Field>
						</div>

						<Field label="Metadata canonical base" hint="Optional base URL for page metadata examples.">
							<Input
								value={formState.metadataCanonicalBase}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setFormState((current) => ({ ...current, metadataCanonicalBase: event.target.value }))
								}
							/>
						</Field>

						<div className="flex items-center gap-3">
							<Button variant="primary" disabled={saving} type="submit">
								{saving ? "Saving..." : "Save settings"}
							</Button>
							<span className="text-xs text-kumo-subtle">Mode: {data.settings.governanceMode}</span>
						</div>
					</form>
				</Card>

				<Card title="Current status">
					<KeyValueList
						items={[
							["Status label", data.settings.publicStatusLabel || "Not set"],
							["Retention", `${data.settings.auditRetentionDays} day(s)`],
							["Governance", <Pill key="governance">{data.settings.governanceMode}</Pill>],
							["Canonical base", data.settings.metadataCanonicalBase || "Not set"],
						]}
					/>
				</Card>
			</div>

			<Card title="Recent audit events" description="Latest plugin activity, useful for quick verification after changing settings.">
				{data.recentEvents.length === 0 ? (
					<EmptyState title="No recent events" description="Trigger plugin actions to populate the audit stream." />
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
	const codePreview = maskSensitive(wizardState.code, step === REGISTRY_WIZARD_STEPS.length - 1);

	return (
		<PageShell>
			<PageHeader
				eyebrow="Registry"
				title="Registry intake and verification"
				description="Reference UI for onboarding registry entities, tracking their region scope, and showing how sensitive identifiers stay masked until the review step."
			/>

			<div className="grid gap-5 md:grid-cols-3">
				<MetricCard label="Registry entities" value={registryEntities.length} hint="Reference records in the sample queue" />
				<MetricCard label="Verified records" value={verifiedCount} hint="Records that reached active verification" />
				<MetricCard label="Restricted entries" value={restrictedCount} hint="Rows that require masking in operator views" />
			</div>

			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] mt-2">
				<Card title="Registry queue" description="Deterministic SIKESRA reference records with stage, sensitivity, and region scope.">
					<div className="overflow-hidden rounded-xl border border-kumo-line bg-kumo-base text-kumo-default">
						<div className="grid grid-cols-[1.1fr_.8fr_.9fr_.9fr] gap-3 border-b border-kumo-line bg-kumo-tint/50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-kumo-subtle max-md:hidden">
							<div>Entity</div>
							<div>Region</div>
							<div>Sensitivity</div>
							<div>Stage</div>
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

				<Card title="Progressive input wizard" description="A compact operator flow that stages the data entry and only reveals the reference code at the final review step.">
					<div className="space-y-4">
						<div className="grid grid-cols-4 gap-2 text-xs font-medium uppercase tracking-wide text-kumo-subtle">
							{REGISTRY_WIZARD_STEPS.map((label, index) => (
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
							<div className="text-sm font-semibold text-kumo-default">Step {step + 1}: {REGISTRY_WIZARD_STEPS[step]}</div>
							<p className="mt-2 text-sm leading-6 text-kumo-subtle">
								{step === 0 ? "Start with identity details and a human-readable label." : null}
								{step === 1 ? "Add region scope fields so reviewers can check jurisdiction boundaries." : null}
								{step === 2 ? "Attach documents and keep the sensitive metadata out of the public view." : null}
								{step === 3 ? "Review the masked reference code and verify the final stage before activation." : null}
							</p>
							<div className="mt-4 space-y-3">
								<Field label="Registry label" hint="Reference entry name shown to operators.">
									<Input value={wizardState.label} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setWizardState((current) => ({ ...current, label: event.target.value }))} />
								</Field>
								<div className="grid gap-4 md:grid-cols-2">
									<Field label="Province code" hint="Administrative region code.">
										<Input value={wizardState.provinceCode} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setWizardState((current) => ({ ...current, provinceCode: event.target.value }))} />
									</Field>
									<Field label="Sensitivity" hint="Controls masking and public exposure.">
								<Select value={wizardState.sensitivity} onValueChange={(value) => setWizardState((current) => ({ ...current, sensitivity: (value as typeof SIKESRA_REFERENCE_FIXTURES["registryEntities"][number]["sensitivity"] | null) ?? "public_safe" }))}>
											<Select.Option value="public_safe">public_safe</Select.Option>
											<Select.Option value="internal">internal</Select.Option>
											<Select.Option value="restricted">restricted</Select.Option>
											<Select.Option value="highly_restricted">highly_restricted</Select.Option>
										</Select>
									</Field>
								</div>
								<div className="rounded-lg border border-dashed border-kumo-line bg-kumo-tint/30 p-4 text-sm text-kumo-subtle">
									<div className="font-medium text-kumo-default">Preview</div>
									<div className="mt-2 grid gap-1">
										<div>Code: {codePreview}</div>
										<div>Label: {wizardState.label || "Untitled registry entity"}</div>
										<div>Region: {wizardState.provinceCode || "--"}</div>
										<div>Sensitivity: {wizardState.sensitivity}</div>
									</div>
								</div>
							</div>

							<div className="mt-4 flex items-center gap-2">
								<Button variant="secondary" size="sm" type="button" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))}>
									Previous
								</Button>
								<Button variant="secondary" size="sm" type="button" disabled={step === REGISTRY_WIZARD_STEPS.length - 1} onClick={() => setStep((current) => Math.min(REGISTRY_WIZARD_STEPS.length - 1, current + 1))}>
									Next
								</Button>
							</div>

							<div className="mt-4 rounded-xl border border-kumo-line bg-kumo-base p-4 text-sm text-kumo-subtle">
								<div className="font-medium text-kumo-default">Active reference record</div>
								<div className="mt-2">{activeEntity?.label}</div>
								<div className="mt-1">{maskSensitive(activeEntity?.code ?? null, step === REGISTRY_WIZARD_STEPS.length - 1)}</div>
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
	const { data, error, loading, reload } = usePluginData<VerificationResponse>("verification/list");
	const [isAdvancing, setIsAdvancing] = React.useState(false);
	const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
	const [mutationError, setMutationError] = React.useState<string | null>(null);
	const queue = data?.items ?? [];
	const pending = queue.filter((item) => item.canAdvance).length;
	const approved = queue.filter((item) => item.verificationStage === "active_verified").length;
	const nextCandidate = queue.find((item) => item.canAdvance) ?? null;

	if (loading) return <PageShell><LoadingState label="Loading verification queue..." /></PageShell>;
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
				notes: "Advanced from the reference verification UI",
			});
			setStatusMessage(`Advanced ${response.item.code} to ${response.item.verificationStage}.`);
			await reload();
		} catch (cause) {
			setMutationError(cause instanceof Error ? cause.message : "Request failed");
		} finally {
			setIsAdvancing(false);
		}
	}

	return (
		<PageShell>
			<PageHeader
				eyebrow="Verification"
				title="Verification queue"
				description="A compact queue view for staged approvals, pending review, and escalation across village, district, and regency steps."
				actions={
					nextCandidate ? (
						<Button disabled={isAdvancing} onClick={() => void advanceNextStage()} size="sm" variant="secondary">
							{isAdvancing ? "Advancing..." : `Advance ${nextCandidate.code} to ${nextCandidate.nextStage}`}
						</Button>
					) : null
				}
			/>

			{statusMessage ? <div className="rounded-xl border border-kumo-success/30 bg-kumo-success/10 px-4 py-3 text-sm text-kumo-default">{statusMessage}</div> : null}
			{mutationError ? <div className="rounded-xl border border-kumo-danger/30 bg-kumo-danger/10 px-4 py-3 text-sm text-kumo-default">{mutationError}</div> : null}

			<div className="grid gap-5 md:grid-cols-3">
				<MetricCard label="Queued events" value={queue.length} hint="Deterministic reference history" />
				<MetricCard label="Approved" value={approved} hint="Accepted verification checkpoints" />
				<MetricCard label="Needs review" value={pending} hint="Items that still need follow-up" />
			</div>

			<Card title="Registry verification queue" description="Live verification state that can be advanced one stage at a time from the reference UI.">
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
									<Pill>{item.nextStage ?? "final"}</Pill>
								</div>
							</div>
							<div className="mt-3 grid gap-2 text-xs text-kumo-subtle md:grid-cols-3">
								<div>Region: {item.region.provinceCode}/{item.region.regencyCode}</div>
								<div>Documents: {item.supportingDocumentIds.length}</div>
								<div>ID: {maskSensitive(item.id, false)}</div>
							</div>
						</div>
					))}
				</div>
			</Card>

			<Card title="Reference verification events" description="Stage progression from draft to active verification.">
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
								<div>Actor: {item.actor}</div>
								<div>Created: {formatDateTime(item.createdAt)}</div>
								<div>ID: {maskSensitive(item.id, false)}</div>
							</div>
						</div>
					))}
				</div>
			</Card>
		</PageShell>
	);
}

function DocumentsPage() {
	const docs = SIKESRA_REFERENCE_FIXTURES.supportingDocuments;
	const sensitiveCount = docs.filter((doc) => doc.sensitivity !== "public_safe").length;

	return (
		<PageShell>
			<PageHeader
				eyebrow="Documents"
				title="Supporting documents"
				description="Document metadata for the registry reference model, including sensitivity classification and verification source."
			/>

			<div className="grid gap-5 md:grid-cols-3">
				<MetricCard label="Documents" value={docs.length} hint="Reference document metadata" />
				<MetricCard label="Sensitive docs" value={sensitiveCount} hint="Records that should remain masked" />
				<MetricCard label="Verified sources" value={new Set(docs.map((doc) => doc.verifiedBy)).size} hint="Unique verifier identifiers" />
			</div>

			<Card title="Document catalog" description="The linked entity identifier is masked unless the document is explicitly public-safe.">
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
								<div>Entity: {maskSensitive(doc.registryEntityId, doc.sensitivity === "public_safe")}</div>
								<div>Issued: {formatDateTime(doc.issuedAt)}</div>
								<div>Verified by: {doc.verifiedBy}</div>
							</div>
						</div>
					))}
				</div>
			</Card>
		</PageShell>
	);
}

function ReportsPage() {
	const aggregate = SIKESRA_REFERENCE_FIXTURES.publicAggregate;
	const suppressedCount = aggregate.categories.filter((item) => item.suppressed).length;

	return (
		<PageShell>
			<PageHeader
				eyebrow="Reports"
				title="Public aggregate"
				description="A public-safe reporting surface that exposes only coarse counts and avoids private identifiers or sensitive record details."
			/>

			<div className="grid gap-5 md:grid-cols-3">
				<MetricCard label="Categories" value={aggregate.categories.length} hint="Public-safe summary buckets" />
				<MetricCard label="Suppressed" value={suppressedCount} hint="Buckets hidden from public detail" />
				<MetricCard label="Visible" value={aggregate.categories.length - suppressedCount} hint="Buckets safe to display openly" />
			</div>

			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] mt-2">
				<Card title="Aggregate categories" description="Counts are shown only when the category is not suppressed.">
					<div className="overflow-hidden rounded-xl border border-kumo-line bg-kumo-base text-kumo-default">
						<div className="grid grid-cols-[1.2fr_.7fr_.7fr_.7fr] gap-3 border-b border-kumo-line bg-kumo-tint/50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-kumo-subtle max-md:hidden">
							<div>Category</div>
							<div>Total</div>
							<div>Verified</div>
							<div>Status</div>
						</div>
						{aggregate.categories.map((item) => (
							<div className="grid gap-2 border-t border-kumo-line px-4 py-3 text-sm md:grid-cols-[1.2fr_.7fr_.7fr_.7fr]" key={item.code}>
								<div>
									<div className="font-medium text-kumo-default">{item.label}</div>
									<div className="mt-1 break-all text-xs text-kumo-subtle">{maskSensitive(item.code, !item.suppressed)}</div>
								</div>
								<div className="text-kumo-subtle">{item.suppressed ? "suppressed" : item.total}</div>
								<div className="text-kumo-subtle">{item.verified}</div>
								<div>
									<Pill tone={item.suppressed ? "warning" : "success"}>{item.suppressed ? "masked" : "visible"}</Pill>
								</div>
							</div>
						))}
					</div>
				</Card>

				<Card title="Public note" description="The caveat explains why the aggregate is safe for public display.">
					<p className="text-sm leading-6 text-kumo-subtle">{aggregate.caveat}</p>
					<div className="mt-4 rounded-xl border border-kumo-line bg-kumo-base p-4 text-sm text-kumo-subtle">
						<div className="font-medium text-kumo-default">Display rule</div>
						<div className="mt-2">Masked buckets remain summarized but do not reveal entity-level details, matching the public-safe aggregate pattern.</div>
					</div>
				</Card>
			</div>
		</PageShell>
	);
}

function AuditPage() {
	const { data, error, loading, reload } = usePluginData<AuditListResponse>("audit/list", { limit: 25 });

	if (loading) return <LoadingState label="Loading audit log..." />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;

	return (
		<PageShell>
			<PageHeader
				eyebrow="Audit"
				title="Event history"
				description="Storage-backed stream showing plugin behavior, actors, scopes, and timestamps."
				actions={
					<Button variant="secondary" size="sm" onClick={() => void reload()} type="button">
						Refresh
					</Button>
				}
			/>
			<Card>
				{!data?.items.length ? (
					<EmptyState title="No audit events" description="Plugin actions will appear here after hooks or routes run." />
				) : (
					<div className="overflow-hidden rounded-xl border border-kumo-line bg-kumo-base text-kumo-default">
						<div className="grid grid-cols-[1fr_160px_160px] gap-3 border-b border-kumo-line bg-kumo-tint/50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-kumo-subtle max-md:hidden">
							<div>Summary</div>
							<div>Scope / actor</div>
							<div>Time</div>
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
								<div className="text-kumo-subtle">{formatDateTime(item.timestamp)}</div>
							</div>
						))}
					</div>
				)}
			</Card>
		</PageShell>
	);
}

function PermissionsPage() {
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
			setNotice("Permission saved.");
			await reload();
		} catch (cause) {
			setSaveError(cause instanceof Error ? cause.message : "Failed to save permission");
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <LoadingState label="Loading permissions..." />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;

	return (
		<PageShell>
			<PageHeader eyebrow="Access" title="Permission catalog" description="Create plugin-owned permissions with explicit slugs, labels, scopes, and descriptions." />
			<div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
				<Card title="Add permission" description="Use stable dot-separated slugs such as content.read.public.">
					<form className="space-y-4" onSubmit={(event) => void savePermission(event)}>
						<Feedback message={notice} />
						<Feedback message={saveError} tone="danger" />
						<Field label="Slug">
							<Input value={formState.slug} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormState((current) => ({ ...current, slug: event.target.value }))} />
						</Field>
						<Field label="Label">
							<Input value={formState.label} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormState((current) => ({ ...current, label: event.target.value }))} />
						</Field>
						<Field label="Scope">
							<Input value={formState.scope} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormState((current) => ({ ...current, scope: event.target.value }))} />
						</Field>
						<Field label="Description">
							<InputArea value={formState.description} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setFormState((current) => ({ ...current, description: event.target.value }))} />
						</Field>
						<Button variant="primary" disabled={saving} type="submit">
							{saving ? "Saving..." : "Save permission"}
						</Button>
					</form>
				</Card>

				<Card title="Existing permissions" description={`${data?.items.length ?? 0} permission(s) in the plugin catalog.`}>
					{!data?.items.length ? (
						<EmptyState title="No permissions yet" description="Create a permission to begin building the role matrix." />
					) : (
						<div className="grid gap-3">
							{data.items.map((item) => (
								<div className="rounded-xl border border-kumo-line bg-kumo-base p-4 text-kumo-default" key={item.slug}>
									<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
										<div className="font-medium text-kumo-default">{item.label}</div>
										<Pill>{item.scope}</Pill>
									</div>
									<div className="mt-1 break-all text-sm text-kumo-subtle">{item.slug}</div>
									<p className="mt-2 text-sm leading-6 text-kumo-subtle">{item.description || "No description provided."}</p>
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
			setNotice("Role saved.");
			await reload();
		} catch (cause) {
			setSaveError(cause instanceof Error ? cause.message : "Failed to save role");
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
			setNotice("User role assignment saved.");
			await reload();
		} catch (cause) {
			setSaveError(cause instanceof Error ? cause.message : "Failed to save user assignment");
		} finally {
			setUserSaving(false);
		}
	};

	if (loading) return <LoadingState label="Loading roles..." />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;

	return (
		<PageShell>
			<PageHeader eyebrow="Access" title="Roles and assignments" description="Manage plugin-owned role definitions and assign users to demo roles." />
			<Feedback message={notice} />
			<Feedback message={saveError} tone="danger" />

			<div className="grid gap-6 lg:grid-cols-2">
				<Card title="Add role" description="Create reusable role labels before mapping permissions.">
					<form className="space-y-4" onSubmit={(event) => void saveRole(event)}>
						<Field label="Role slug">
							<Input value={roleState.slug} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setRoleState((current) => ({ ...current, slug: event.target.value }))} />
						</Field>
						<Field label="Label">
							<Input value={roleState.label} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setRoleState((current) => ({ ...current, label: event.target.value }))} />
						</Field>
						<Field label="Description">
							<InputArea value={roleState.description} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setRoleState((current) => ({ ...current, description: event.target.value }))} />
						</Field>
						<Button variant="primary" disabled={roleSaving} type="submit">
							{roleSaving ? "Saving..." : "Save role"}
						</Button>
					</form>
				</Card>

				<Card title="Assign user roles" description="Use comma-separated role slugs, for example editor, reviewer.">
					<form className="space-y-4" onSubmit={(event) => void saveUserAssignment(event)}>
						<Field label="User ID">
							<Input value={userState.userId} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUserState((current) => ({ ...current, userId: event.target.value }))} />
						</Field>
						<Field label="Roles">
							<Input value={userState.roles} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUserState((current) => ({ ...current, roles: event.target.value }))} />
						</Field>
						<Button variant="primary" disabled={userSaving} type="submit">
							{userSaving ? "Saving..." : "Save assignment"}
						</Button>
					</form>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card title="Roles" description={`${data?.roles.length ?? 0} role(s) available.`}>
					{!data?.roles.length ? (
						<EmptyState title="No roles yet" description="Create a role before assigning permissions." />
					) : (
						<div className="space-y-3">
							{data.roles.map((item) => (
								<div className="rounded-xl border border-kumo-line bg-kumo-base p-4 text-kumo-default" key={item.slug}>
									<div className="font-medium text-kumo-default">{item.label}</div>
									<div className="mt-1 text-sm text-kumo-subtle">{item.slug}</div>
									<p className="mt-2 text-sm leading-6 text-kumo-subtle">{item.description || "No description provided."}</p>
								</div>
							))}
						</div>
					)}
				</Card>

				<Card title="User assignments" description={`${data?.userAssignments.length ?? 0} user assignment(s).`}>
					{!data?.userAssignments.length ? (
						<EmptyState title="No assignments yet" description="Assign a user to one or more roles." />
					) : (
						<div className="space-y-3">
							{data.userAssignments.map((item) => (
								<div className="rounded-xl border border-kumo-line bg-kumo-base p-4 text-kumo-default" key={item.userId}>
									<div className="font-medium text-kumo-default">{item.userId}</div>
									<div className="mt-2 flex flex-wrap gap-2">
										{item.roles.length ? item.roles.map((role) => <Pill key={role}>{role}</Pill>) : <Pill tone="warning">No roles</Pill>}
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
			setNotice("Role matrix saved.");
			await reload();
		} catch (cause) {
			setSaveError(cause instanceof Error ? cause.message : "Failed to save matrix");
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <LoadingState label="Loading role matrix..." />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;

	return (
		<PageShell>
			<PageHeader eyebrow="Access" title="Role and permission matrix" description="Map permissions to roles in the plugin-owned catalog. This preview does not replace EmDash core authorization." />
			<Feedback message={notice} />
			<Feedback message={saveError} tone="danger" />

			{!data?.roles.length || !data.permissions.length ? (
				<EmptyState title="Catalog incomplete" description="Create at least one role and one permission before editing the matrix." />
			) : (
				<Card
					title="Edit matrix"
					description={`${selectedPermissions.length} permission(s) selected for the current role.`}
					actions={
						<Button variant="primary" disabled={saving || !selectedRole} onClick={() => void saveMatrix()} type="button">
							{saving ? "Saving..." : "Save matrix"}
						</Button>
					}
				>
					<div className="mb-5 max-w-sm">
						<Field label="Role">
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
			setError(cause instanceof Error ? cause.message : "Failed to preview access");
		} finally {
			setRunning(false);
		}
	};

	return (
		<PageShell width="normal">
			<PageHeader eyebrow="Access" title="Effective access preview" description="Simulate whether a user has a plugin-owned permission based on current role assignments." />
			<Card title="Preview input" description="Select a user and permission, then run the deterministic access preview.">
				<div className="grid gap-4 md:grid-cols-2">
					<Field label="User">
						<Select value={userId} onValueChange={(value) => setUserId(value ?? "")}>
							{rolesData?.userAssignments.map((item) => (
								<Select.Option key={item.userId} value={item.userId}>
									{item.userId}
								</Select.Option>
							))}
						</Select>
					</Field>
					<Field label="Permission">
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
						{running ? "Checking..." : "Preview access"}
					</Button>
				</div>
			</Card>

			<Feedback message={error} tone="danger" />
			{preview ? (
				<Card title="Decision result">
					<div className="mb-4">
						<Pill tone={preview.allowed ? "success" : "danger"}>{preview.allowed ? "Allowed" : "Denied"}</Pill>
					</div>
					<p className="text-sm leading-6 text-kumo-subtle">{preview.reason}</p>
					<KeyValueList
						items={[
							["Matched roles", toCsv(preview.matchedRoles) || "None"],
							["Effective permissions", toCsv(preview.effectivePermissions) || "None"],
						]}
					/>
				</Card>
			) : null}
		</PageShell>
	);
}

function AbacAttributesPage() {
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
			setNotice("Attribute saved.");
			await reload();
		} catch (cause) {
			setSaveError(cause instanceof Error ? cause.message : "Failed to save ABAC attribute");
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
			setNotice("Subject attributes saved.");
			await reloadSubjects();
		} catch (cause) {
			setSaveError(cause instanceof Error ? cause.message : "Failed to save ABAC subject");
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
			setNotice("Resource attributes saved.");
			await reloadResources();
		} catch (cause) {
			setSaveError(cause instanceof Error ? cause.message : "Failed to save ABAC resource");
		}
	};

	if (loading) return <LoadingState label="Loading ABAC attributes..." />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;

	return (
		<PageShell>
			<PageHeader eyebrow="ABAC" title="Attribute catalog" description="Define subject, resource, and context attributes used by the demo ABAC policy engine." />
			<Feedback message={notice} />
			<Feedback message={saveError} tone="danger" />

			<div className="grid gap-6 lg:grid-cols-3">
				<Card title="Attribute definition">
					<form className="space-y-4" onSubmit={(event) => void saveAttribute(event)}>
						<Field label="Key">
							<Input value={attributeState.key} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAttributeState((current) => ({ ...current, key: event.target.value }))} />
						</Field>
						<Field label="Label">
							<Input value={attributeState.label} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAttributeState((current) => ({ ...current, label: event.target.value }))} />
						</Field>
						<Field label="Target type">
							<Select
								value={attributeState.targetType}
								onValueChange={(value) => setAttributeState((current) => ({ ...current, targetType: (value as AbacTargetType | null) ?? "context" }))}
							>
								<Select.Option value="subject">Subject</Select.Option>
								<Select.Option value="resource">Resource</Select.Option>
								<Select.Option value="context">Context</Select.Option>
							</Select>
						</Field>
						<Field label="Description">
							<InputArea value={attributeState.description} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setAttributeState((current) => ({ ...current, description: event.target.value }))} />
						</Field>
						<Button variant="primary" type="submit">
							Save attribute
						</Button>
					</form>
				</Card>

				<Card title="Subject assignment">
					<form className="space-y-4" onSubmit={(event) => void saveSubject(event)}>
						<Field label="Subject ID">
							<Input value={subjectState.subjectId} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSubjectState((current) => ({ ...current, subjectId: event.target.value }))} />
						</Field>
						<Field label="Attributes JSON" hint='Example: {"tenant_id":"tenant-a"}'>
							<InputArea value={subjectState.attributes} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setSubjectState((current) => ({ ...current, attributes: event.target.value }))} />
						</Field>
						<Button variant="primary" type="submit">
							Save subject
						</Button>
					</form>
				</Card>

				<Card title="Resource assignment">
					<form className="space-y-4" onSubmit={(event) => void saveResource(event)}>
						<Field label="Resource ID">
							<Input value={resourceState.resourceId} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setResourceState((current) => ({ ...current, resourceId: event.target.value }))} />
						</Field>
						<Field label="Attributes JSON" hint='Example: {"resource_type":"policy"}'>
							<InputArea value={resourceState.attributes} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setResourceState((current) => ({ ...current, attributes: event.target.value }))} />
						</Field>
						<Button variant="primary" type="submit">
							Save resource
						</Button>
					</form>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				<Card title="Attributes">
					{!data?.items.length ? (
						<EmptyState title="No attributes" description="Create an attribute definition first." />
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
				<Card title="Subjects">
					{!subjectData?.items.length ? (
						<EmptyState title="No subjects" description="Create a subject assignment to test policies." />
					) : (
						subjectData.items.map((item, index) => (
							<div className="mb-3 rounded-xl border border-kumo-line bg-kumo-base p-3 text-kumo-default" key={item.subjectId ?? `subject-${index}`}>
								<div className="font-medium text-kumo-default">{item.subjectId ?? "Unknown subject"}</div>
								<div className="mt-1 break-all text-sm text-kumo-subtle">{Object.entries(item.attributes).map(([key, value]) => `${key}=${value}`).join(", ")}</div>
							</div>
						))
					)}
				</Card>
				<Card title="Resources">
					{!resourceData?.items.length ? (
						<EmptyState title="No resources" description="Create a resource assignment to test policies." />
					) : (
						resourceData.items.map((item, index) => (
							<div className="mb-3 rounded-xl border border-kumo-line bg-kumo-base p-3 text-kumo-default" key={item.resourceId ?? `resource-${index}`}>
								<div className="font-medium text-kumo-default">{item.resourceId ?? "Unknown resource"}</div>
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
			setSaveError("One or more JSON condition fields are invalid.");
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
			setNotice("Policy saved.");
			await reload();
		} catch (cause) {
			setSaveError(cause instanceof Error ? cause.message : "Failed to save ABAC policy");
		}
	};

	if (loading) return <LoadingState label="Loading ABAC policies..." />;
	if (error) return <ErrorState message={error} onRetry={() => void reload()} />;

	return (
		<PageShell>
			<PageHeader eyebrow="ABAC" title="Policy rules" description="Create explicit allow and deny rules for the demonstrative ABAC engine." />
			<div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
				<Card title="Add policy" description="Deny rules take precedence in the demo decision model.">
					<form className="space-y-4" onSubmit={(event) => void savePolicy(event)}>
						<Feedback message={notice} />
						<Feedback message={saveError} tone="danger" />
						<Field label="Policy ID">
							<Input value={formState.id} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormState((current) => ({ ...current, id: event.target.value }))} />
						</Field>
						<Field label="Label">
							<Input value={formState.label} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormState((current) => ({ ...current, label: event.target.value }))} />
						</Field>
						<Field label="Effect">
							<Select value={formState.effect} onValueChange={(value) => setFormState((current) => ({ ...current, effect: (value as AbacEffect | null) ?? "allow" }))}>
								<Select.Option value="allow">Allow</Select.Option>
								<Select.Option value="deny">Deny</Select.Option>
							</Select>
						</Field>
						<Field label="Actions" hint="Comma-separated actions.">
							<Input value={formState.actions} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormState((current) => ({ ...current, actions: event.target.value }))} />
						</Field>
						<Field label="Required subject JSON">
							<InputArea value={formState.requiredSubject} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setFormState((current) => ({ ...current, requiredSubject: event.target.value }))} />
						</Field>
						<Field label="Required resource JSON">
							<InputArea value={formState.requiredResource} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setFormState((current) => ({ ...current, requiredResource: event.target.value }))} />
						</Field>
						<Field label="Required context JSON">
							<InputArea value={formState.requiredContext} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setFormState((current) => ({ ...current, requiredContext: event.target.value }))} />
						</Field>
						<Button variant="primary" type="submit">
							Save policy
						</Button>
					</form>
				</Card>

				<Card title="Existing policies" description={`${data?.items.length ?? 0} policy rule(s).`}>
					{!data?.items.length ? (
						<EmptyState title="No policies" description="Create a policy to use the ABAC decision preview." />
					) : (
						<div className="space-y-3">
							{data.items.map((item) => (
								<div className="rounded-xl border border-kumo-line bg-kumo-base p-4 text-kumo-default" key={item.id}>
									<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
										<div className="font-medium text-kumo-default">{item.label}</div>
										<Pill tone={item.effect === "allow" ? "success" : "danger"}>{item.effect}</Pill>
									</div>
									<div className="mt-1 break-all text-sm text-kumo-subtle">{item.id}</div>
									<div className="mt-2 text-sm text-kumo-subtle">Actions: {toCsv(item.actions) || "None"}</div>
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
			setError(cause instanceof Error ? cause.message : "Failed to evaluate ABAC policy");
		} finally {
			setRunning(false);
		}
	};

	return (
		<PageShell width="normal">
			<PageHeader eyebrow="ABAC" title="Decision preview" description="Preview or run the protected demo route using subject, resource, action, and context attributes." />
			<Card title="Decision input">
				<div className="grid gap-4 md:grid-cols-2">
					<Field label="Subject">
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
					<Field label="Resource">
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
					<Field label="Action">
						<Input value={action} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAction(event.target.value)} />
					</Field>
					<Field label="Context attributes JSON">
						<InputArea value={contextAttributes} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setContextAttributes(event.target.value)} />
					</Field>
				</div>
				<div className="mt-4 flex flex-wrap gap-3">
					<Button variant="primary" disabled={running} onClick={() => void runPreview("abac/preview")} type="button">
						{running ? "Evaluating..." : "Preview policy"}
					</Button>
					<Button variant="secondary" disabled={running} onClick={() => void runPreview("abac/enforce-demo")} type="button">
						Run protected demo
					</Button>
				</div>
			</Card>

			<Feedback message={error} tone="danger" />
			{preview ? (
				<Card title="Decision result">
					<div className="mb-4 flex items-center gap-2">
						<Pill tone={preview.allowed ? "success" : "danger"}>{preview.allowed ? "Allowed" : "Denied"}</Pill>
						<Pill>{preview.effect}</Pill>
					</div>
					<p className="text-sm leading-6 text-kumo-subtle">{preview.reason}</p>
					<KeyValueList
						items={[
							["Matched policies", toCsv(preview.matchedPolicyIds) || "None"],
							["Missing attributes", toCsv(preview.missingAttributes) || "None"],
						]}
					/>
				</Card>
			) : null}
		</PageShell>
	);
}

function StatusBadgeField({ value, onChange, label, id, minimal, required }: FieldWidgetProps) {
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
					<Select.Option value="draft">Draft</Select.Option>
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
