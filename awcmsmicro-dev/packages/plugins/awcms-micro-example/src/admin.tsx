import { Button, Input, InputArea, Select } from "@cloudflare/kumo";
import type { PluginAdminExports } from "emdash";
import { apiFetch, getErrorMessage, parseApiResponse } from "emdash/plugin-utils";
import * as React from "react";

const PLUGIN_API_BASE = "/_emdash/api/plugins/awcms-micro-example";
const JSON_HEADERS = { "Content-Type": "application/json" } as const;

type JsonMap = Record<string, string>;
type GovernanceMode = "observe" | "review" | "enforce-demo";
type AbacTargetType = "subject" | "resource" | "context";
type AbacEffect = "allow" | "deny";

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
	return <div className={cx("space-y-6", width === "wide" ? "max-w-6xl" : "max-w-4xl")}>{children}</div>;
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
		<div className="flex flex-col gap-4 rounded-2xl border bg-white/70 p-5 shadow-sm md:flex-row md:items-start md:justify-between">
			<div className="space-y-2">
				{eyebrow ? <div className="text-xs font-semibold uppercase tracking-wide text-kumo-subtle">{eyebrow}</div> : null}
				<h1 className="text-3xl font-bold tracking-tight">{title}</h1>
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
		<section className="rounded-2xl border bg-white p-5 shadow-sm">
			{title || description || actions ? (
				<div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
					<div>
						{title ? <h2 className="text-lg font-semibold">{title}</h2> : null}
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
		<div className="rounded-2xl border bg-white p-4 shadow-sm">
			<div className="text-sm text-kumo-subtle">{label}</div>
			<div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
			{hint ? <div className="mt-2 text-xs text-kumo-subtle">{hint}</div> : null}
		</div>
	);
}

function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "success" | "warning" | "danger" }) {
	const className = cx(
		"inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
		tone === "success" && "bg-green-100 text-green-700",
		tone === "warning" && "bg-amber-100 text-amber-700",
		tone === "danger" && "bg-red-100 text-red-700",
		tone === "neutral" && "bg-slate-100 text-slate-700",
	);
	return <span className={className}>{children}</span>;
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
	return (
		<label className="block text-sm">
			<span className="mb-1 block font-medium">{label}</span>
			{children}
			{hint ? <span className="mt-1 block text-xs leading-5 text-kumo-subtle">{hint}</span> : null}
		</label>
	);
}

function LoadingState({ label }: { label: string }) {
	return <div className="rounded-2xl border bg-white p-5 text-sm text-kumo-subtle">{label}</div>;
}

function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
	return (
		<div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
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
		<div className="rounded-xl border border-dashed p-5 text-sm">
			<div className="font-medium">{title}</div>
			<div className="mt-1 text-kumo-subtle">{description}</div>
		</div>
	);
}

function Feedback({ message, tone = "success" }: { message: string | null; tone?: "success" | "danger" }) {
	if (!message) return null;
	return (
		<div
			className={cx(
				"rounded-xl border p-3 text-sm",
				tone === "success" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700",
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
				<div className="rounded-xl bg-slate-50 p-3" key={label}>
					<dt className="text-xs font-medium uppercase tracking-wide text-kumo-subtle">{label}</dt>
					<dd className="mt-1 break-words font-medium">{value}</dd>
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
				title="Access & Audit Demo"
				description="A guided admin surface for plugin-owned audit logs, lifecycle status, RBAC catalogs, and ABAC policy simulation without changing EmDash core."
				actions={
					<Button variant="secondary" size="sm" onClick={() => void reload()} type="button">
						Refresh
					</Button>
				}
			/>

			<div className="grid gap-4 md:grid-cols-3">
				<MetricCard label="Audit events" value={data.counters.auditCount} hint="Stored plugin activity" />
				<MetricCard label="Lifecycle events" value={data.counters.lifecycleCount} hint={`Last: ${formatDateTime(data.lastLifecycle)}`} />
				<MetricCard label="Public status hits" value={data.counters.publicHits} hint={`Cron: ${formatDateTime(data.lastCronAt)}`} />
			</div>

			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
				<Card title="Plugin settings" description="Tune demo behavior and metadata values used by the plugin routes.">
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
									className="w-full rounded border px-3 py-2"
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
							<div className="rounded-xl border p-3" key={item.id}>
								<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
									<div className="font-medium">{item.summary}</div>
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
					<div className="overflow-hidden rounded-xl border">
						<div className="grid grid-cols-[1fr_160px_160px] gap-3 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-kumo-subtle max-md:hidden">
							<div>Summary</div>
							<div>Scope / actor</div>
							<div>Time</div>
						</div>
						{data.items.map((item) => (
							<div className="grid gap-2 border-t px-4 py-3 text-sm md:grid-cols-[1fr_160px_160px]" key={item.id}>
								<div>
									<div className="font-medium">{item.summary}</div>
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
								<div className="rounded-xl border p-4" key={item.slug}>
									<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
										<div className="font-medium">{item.label}</div>
										<Pill>{item.scope}</Pill>
									</div>
									<div className="mt-1 break-all text-sm text-kumo-subtle">{item.slug}</div>
									<p className="mt-2 text-sm leading-6">{item.description || "No description provided."}</p>
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
								<div className="rounded-xl border p-4" key={item.slug}>
									<div className="font-medium">{item.label}</div>
									<div className="mt-1 text-sm text-kumo-subtle">{item.slug}</div>
									<p className="mt-2 text-sm leading-6">{item.description || "No description provided."}</p>
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
								<div className="rounded-xl border p-4" key={item.userId}>
									<div className="font-medium">{item.userId}</div>
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
								<label className={cx("flex items-start gap-3 rounded-xl border p-4 transition", checked && "bg-slate-50")} key={permission.slug}>
									<input type="checkbox" className="mt-1" checked={checked} onChange={(event: React.ChangeEvent<HTMLInputElement>) => togglePermission(permission.slug, event.target.checked)} />
									<span>
										<span className="block font-medium">{permission.label}</span>
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
					<p className="text-sm leading-6">{preview.reason}</p>
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
							<div className="mb-3 rounded-xl border p-3" key={item.key}>
								<div className="font-medium">{item.label}</div>
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
							<div className="mb-3 rounded-xl border p-3" key={item.subjectId ?? `subject-${index}`}>
								<div className="font-medium">{item.subjectId ?? "Unknown subject"}</div>
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
							<div className="mb-3 rounded-xl border p-3" key={item.resourceId ?? `resource-${index}`}>
								<div className="font-medium">{item.resourceId ?? "Unknown resource"}</div>
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
								<div className="rounded-xl border p-4" key={item.id}>
									<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
										<div className="font-medium">{item.label}</div>
										<Pill tone={item.effect === "allow" ? "success" : "danger"}>{item.effect}</Pill>
									</div>
									<div className="mt-1 break-all text-sm text-kumo-subtle">{item.id}</div>
									<div className="mt-2 text-sm">Actions: {toCsv(item.actions) || "None"}</div>
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
					<p className="text-sm leading-6">{preview.reason}</p>
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
				<label className="block text-sm font-medium" htmlFor={id}>
					{label} {required ? <span className="text-red-600">*</span> : null}
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
