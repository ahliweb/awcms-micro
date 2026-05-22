import type { PluginAdminExports } from "emdash";
import { apiFetch, getErrorMessage, parseApiResponse } from "emdash/plugin-utils";
import * as React from "react";

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
	targetType: "subject" | "resource" | "context";
	description: string;
	updatedAt: string;
}

interface AbacAssignmentItem {
	subjectId?: string;
	resourceId?: string;
	attributes: Record<string, string>;
	updatedAt: string;
}

interface AbacPolicyItem {
	id: string;
	label: string;
	effect: "allow" | "deny";
	actions: string[];
	requiredSubject: Record<string, string>;
	requiredResource: Record<string, string>;
	requiredContext: Record<string, string>;
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
	effect: "allow" | "deny";
	missingAttributes: string[];
}

interface AbacHealthResponse {
	attributeCount: number;
	policyCount: number;
	subjectCount: number;
	resourceCount: number;
	explicitDenyCount: number;
}

function usePluginData<T>(url: string, init?: RequestInit) {
	const [data, setData] = React.useState<T | null>(null);
	const [error, setError] = React.useState<string | null>(null);
	const [loading, setLoading] = React.useState(true);

	const run = React.useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await apiFetch(url, init);
			if (!response.ok) {
				setError(await getErrorMessage(response, "Request failed"));
				return;
			}
			setData(await parseApiResponse<T>(response));
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Request failed");
		} finally {
			setLoading(false);
		}
	}, [init, url]);

	React.useEffect(() => {
		void run();
	}, [run]);

	return { data, error, loading, reload: run };
}

function GovernanceWidget() {
	const { data, error, loading, reload } = usePluginData<SummaryResponse>(
		"/_emdash/api/plugins/awcms-micro-example/overview/summary",
		{ method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" },
	);

	if (loading) return <div className="text-sm text-kumo-subtle">Loading status...</div>;
	if (error) return <div className="text-sm text-red-600">{error}</div>;
	if (!data) return <div className="text-sm text-kumo-subtle">No data available.</div>;

	return (
		<div className="space-y-3">
			<div className="grid grid-cols-3 gap-2 text-sm">
				<div>
					<div className="text-kumo-subtle">Audit events</div>
					<div className="font-semibold">{data.counters.auditCount}</div>
				</div>
				<div>
					<div className="text-kumo-subtle">Lifecycle</div>
					<div className="font-semibold">{data.counters.lifecycleCount}</div>
				</div>
				<div>
					<div className="text-kumo-subtle">Public hits</div>
					<div className="font-semibold">{data.counters.publicHits}</div>
				</div>
			</div>
			<div className="text-xs text-kumo-subtle">
				Mode: {data.settings.governanceMode} | Last lifecycle: {data.lastLifecycle ?? "n/a"}
			</div>
			<button className="text-xs text-kumo-subtle hover:text-kumo-foreground" onClick={() => void reload()}>
				Refresh
			</button>
		</div>
	);
}

function AccessRightsHealthWidget() {
	const { data, error, loading, reload } = usePluginData<AccessHealthResponse>(
		"/_emdash/api/plugins/awcms-micro-example/access/health",
		{ method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" },
	);

	if (loading) return <div className="text-sm text-kumo-subtle">Loading health...</div>;
	if (error) return <div className="text-sm text-red-600">{error}</div>;
	if (!data) return <div className="text-sm text-kumo-subtle">No health data available.</div>;

	return (
		<div className="space-y-3">
			<div className="grid grid-cols-2 gap-2 text-sm">
				<div>
					<div className="text-kumo-subtle">Permissions</div>
					<div className="font-semibold">{data.permissionCount}</div>
				</div>
				<div>
					<div className="text-kumo-subtle">Roles</div>
					<div className="font-semibold">{data.roleCount}</div>
				</div>
				<div>
					<div className="text-kumo-subtle">Role matrices</div>
					<div className="font-semibold">{data.assignmentCount}</div>
				</div>
				<div>
					<div className="text-kumo-subtle">User assignments</div>
					<div className="font-semibold">{data.userAssignmentCount}</div>
				</div>
			</div>
			<div className="text-xs text-kumo-subtle">
				{data.rolesWithoutPermissions.length === 0 && data.usersWithoutRoles.length === 0
					? "No obvious catalog health gaps detected."
					: `Gaps: ${data.rolesWithoutPermissions.length} role(s) without permissions, ${data.usersWithoutRoles.length} user assignment(s) without roles.`}
			</div>
			<button className="text-xs text-kumo-subtle hover:text-kumo-foreground" onClick={() => void reload()}>
				Refresh
			</button>
		</div>
	);
}

function AbacPolicyStatusWidget() {
	const { data, error, loading, reload } = usePluginData<AbacHealthResponse>(
		"/_emdash/api/plugins/awcms-micro-example/abac/health",
		{ method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" },
	);

	if (loading) return <div className="text-sm text-kumo-subtle">Loading ABAC status...</div>;
	if (error) return <div className="text-sm text-red-600">{error}</div>;
	if (!data) return <div className="text-sm text-kumo-subtle">No ABAC data available.</div>;

	return (
		<div className="space-y-3">
			<div className="grid grid-cols-2 gap-2 text-sm">
				<div>
					<div className="text-kumo-subtle">Attributes</div>
					<div className="font-semibold">{data.attributeCount}</div>
				</div>
				<div>
					<div className="text-kumo-subtle">Policies</div>
					<div className="font-semibold">{data.policyCount}</div>
				</div>
				<div>
					<div className="text-kumo-subtle">Subjects</div>
					<div className="font-semibold">{data.subjectCount}</div>
				</div>
				<div>
					<div className="text-kumo-subtle">Resources</div>
					<div className="font-semibold">{data.resourceCount}</div>
				</div>
			</div>
			<div className="text-xs text-kumo-subtle">Explicit deny policies: {data.explicitDenyCount}</div>
			<button className="text-xs text-kumo-subtle hover:text-kumo-foreground" onClick={() => void reload()}>
				Refresh
			</button>
		</div>
	);
}

function OverviewPage() {
	const { data, error, loading, reload } = usePluginData<SummaryResponse>(
		"/_emdash/api/plugins/awcms-micro-example/overview/summary",
		{ method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" },
	);
	const [saving, setSaving] = React.useState(false);
	const [formState, setFormState] = React.useState({
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
			governanceMode: data.settings.governanceMode,
			metadataCanonicalBase: data.settings.metadataCanonicalBase,
		});
	}, [data]);

	const saveSettings = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSaving(true);
		try {
			const response = await apiFetch("/_emdash/api/plugins/awcms-micro-example/settings/save", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					publicStatusLabel: formState.publicStatusLabel,
					auditRetentionDays: Number(formState.auditRetentionDays),
					governanceMode: formState.governanceMode,
					metadataCanonicalBase: formState.metadataCanonicalBase,
				}),
			});
			if (!response.ok) {
				throw new Error(await getErrorMessage(response, "Failed to save settings"));
			}
			await parseApiResponse(response);
			await reload();
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <div className="text-kumo-subtle">Loading overview...</div>;
	if (error) return <div className="text-red-600">{error}</div>;
	if (!data) return <div className="text-kumo-subtle">No overview data available.</div>;

	return (
		<div className="space-y-6 max-w-3xl">
			<div>
				<h1 className="text-3xl font-bold">AWCMS-Micro Access & Audit Demo</h1>
				<p className="text-kumo-subtle mt-2">
					This example plugin demonstrates routes, KV, storage, lifecycle hooks, cron, media hooks,
					page metadata, a dashboard widget, a field widget, and a Portable Text block without editing
					EmDash core.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<div className="rounded border p-4">
					<div className="text-sm text-kumo-subtle">Audit events</div>
					<div className="text-2xl font-semibold">{data.counters.auditCount}</div>
				</div>
				<div className="rounded border p-4">
					<div className="text-sm text-kumo-subtle">Lifecycle events</div>
					<div className="text-2xl font-semibold">{data.counters.lifecycleCount}</div>
				</div>
				<div className="rounded border p-4">
					<div className="text-sm text-kumo-subtle">Public status hits</div>
					<div className="text-2xl font-semibold">{data.counters.publicHits}</div>
				</div>
			</div>

			<form className="space-y-4 rounded border p-4" onSubmit={saveSettings}>
				<h2 className="text-xl font-semibold">Plugin Settings Demo</h2>
				<label className="block text-sm">
					<span className="mb-1 block">Public Status Label</span>
					<input
						className="w-full rounded border px-3 py-2"
						value={formState.publicStatusLabel}
						onChange={(event) =>
							setFormState((current) => ({ ...current, publicStatusLabel: event.target.value }))
						}
					/>
				</label>
				<label className="block text-sm">
					<span className="mb-1 block">Audit Retention Days</span>
					<input
						type="number"
						className="w-full rounded border px-3 py-2"
						value={formState.auditRetentionDays}
						onChange={(event) =>
							setFormState((current) => ({ ...current, auditRetentionDays: event.target.value }))
						}
					/>
				</label>
				<label className="block text-sm">
					<span className="mb-1 block">Governance Mode</span>
					<select
						className="w-full rounded border px-3 py-2"
						value={formState.governanceMode}
						onChange={(event) =>
							setFormState((current) => ({ ...current, governanceMode: event.target.value }))
						}
					>
						<option value="observe">Observe</option>
						<option value="review">Review</option>
						<option value="enforce-demo">Enforce Demo</option>
					</select>
				</label>
				<label className="block text-sm">
					<span className="mb-1 block">Metadata Canonical Base</span>
					<input
						className="w-full rounded border px-3 py-2"
						value={formState.metadataCanonicalBase}
						onChange={(event) =>
							setFormState((current) => ({ ...current, metadataCanonicalBase: event.target.value }))
						}
					/>
				</label>
				<button className="rounded bg-black px-4 py-2 text-white" disabled={saving} type="submit">
					{saving ? "Saving..." : "Save Settings"}
				</button>
			</form>

			<div className="rounded border p-4">
				<h2 className="text-xl font-semibold">Recent Audit Events</h2>
				<ul className="mt-3 space-y-2 text-sm">
					{data.recentEvents.map((item) => (
						<li className="rounded bg-gray-50 p-2" key={item.id}>
							<div className="font-medium">{item.summary}</div>
							<div className="text-kumo-subtle">
								{item.kind} | {item.actor} | {item.timestamp}
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

function AuditPage() {
	const { data, error, loading, reload } = usePluginData<AuditListResponse>(
		"/_emdash/api/plugins/awcms-micro-example/audit/list",
		{ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ limit: 25 }) },
	);

	if (loading) return <div className="text-kumo-subtle">Loading audit log...</div>;
	if (error) return <div className="text-red-600">{error}</div>;

	return (
		<div className="space-y-4 max-w-4xl">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Audit Event History</h1>
					<p className="text-kumo-subtle mt-2">Example storage-backed audit stream for plugin behavior.</p>
				</div>
				<button className="rounded border px-3 py-2 text-sm" onClick={() => void reload()}>
					Refresh
				</button>
			</div>

			<ul className="space-y-2">
				{data?.items.map((item) => (
					<li className="rounded border p-3" key={item.id}>
						<div className="font-medium">{item.summary}</div>
						<div className="text-sm text-kumo-subtle">
							{item.kind} | {item.scope} | {item.actor}
						</div>
						<div className="text-xs text-kumo-subtle mt-1">{item.timestamp}</div>
					</li>
				))}
			</ul>
		</div>
	);
}

function PermissionsPage() {
	const { data, error, loading, reload } = usePluginData<AccessPermissionsResponse>(
		"/_emdash/api/plugins/awcms-micro-example/access/permissions/list",
		{ method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" },
	);
	const [formState, setFormState] = React.useState({ slug: "", label: "", description: "", scope: "content" });

	const savePermission = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const response = await apiFetch("/_emdash/api/plugins/awcms-micro-example/access/permissions/save", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formState),
		});
		if (!response.ok) throw new Error(await getErrorMessage(response, "Failed to save permission"));
		await parseApiResponse(response);
		setFormState({ slug: "", label: "", description: "", scope: "content" });
		await reload();
	};

	if (loading) return <div className="text-kumo-subtle">Loading permissions...</div>;
	if (error) return <div className="text-red-600">{error}</div>;

	return (
		<div className="space-y-6 max-w-4xl">
			<div>
				<h1 className="text-3xl font-bold">Permission Catalog</h1>
				<p className="text-kumo-subtle mt-2">Demonstrative permission catalog stored inside the example plugin.</p>
			</div>
			<form className="space-y-3 rounded border p-4" onSubmit={(event) => void savePermission(event)}>
				<input className="w-full rounded border px-3 py-2" placeholder="permission slug" value={formState.slug} onChange={(event) => setFormState((current) => ({ ...current, slug: event.target.value }))} />
				<input className="w-full rounded border px-3 py-2" placeholder="label" value={formState.label} onChange={(event) => setFormState((current) => ({ ...current, label: event.target.value }))} />
				<input className="w-full rounded border px-3 py-2" placeholder="scope" value={formState.scope} onChange={(event) => setFormState((current) => ({ ...current, scope: event.target.value }))} />
				<textarea className="w-full rounded border px-3 py-2" placeholder="description" value={formState.description} onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))} />
				<button className="rounded bg-black px-4 py-2 text-white" type="submit">Save Permission</button>
			</form>
			<ul className="space-y-2">
				{data?.items.map((item) => (
					<li className="rounded border p-3" key={item.slug}>
						<div className="font-medium">{item.label}</div>
						<div className="text-sm text-kumo-subtle">{item.slug} | {item.scope}</div>
						<div className="text-sm">{item.description}</div>
					</li>
				))}
			</ul>
		</div>
	);
}

function RolesPage() {
	const { data, error, loading, reload } = usePluginData<AccessRolesResponse>(
		"/_emdash/api/plugins/awcms-micro-example/access/roles/list",
		{ method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" },
	);
	const [roleState, setRoleState] = React.useState({ slug: "", label: "", description: "" });
	const [userState, setUserState] = React.useState({ userId: "", roles: "" });

	const saveRole = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const response = await apiFetch("/_emdash/api/plugins/awcms-micro-example/access/roles/save", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(roleState),
		});
		if (!response.ok) throw new Error(await getErrorMessage(response, "Failed to save role"));
		await parseApiResponse(response);
		setRoleState({ slug: "", label: "", description: "" });
		await reload();
	};

	const saveUserAssignment = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const roles = userState.roles.split(",").map((item) => item.trim()).filter(Boolean);
		const response = await apiFetch("/_emdash/api/plugins/awcms-micro-example/access/users/save", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ userId: userState.userId, roles }),
		});
		if (!response.ok) throw new Error(await getErrorMessage(response, "Failed to save user assignment"));
		await parseApiResponse(response);
		setUserState({ userId: "", roles: "" });
		await reload();
	};

	if (loading) return <div className="text-kumo-subtle">Loading roles...</div>;
	if (error) return <div className="text-red-600">{error}</div>;

	return (
		<div className="space-y-6 max-w-4xl">
			<div>
				<h1 className="text-3xl font-bold">Role Catalog</h1>
				<p className="text-kumo-subtle mt-2">Demonstrative role catalog and user-role assignment examples.</p>
			</div>
			<form className="space-y-3 rounded border p-4" onSubmit={(event) => void saveRole(event)}>
				<input className="w-full rounded border px-3 py-2" placeholder="role slug" value={roleState.slug} onChange={(event) => setRoleState((current) => ({ ...current, slug: event.target.value }))} />
				<input className="w-full rounded border px-3 py-2" placeholder="label" value={roleState.label} onChange={(event) => setRoleState((current) => ({ ...current, label: event.target.value }))} />
				<textarea className="w-full rounded border px-3 py-2" placeholder="description" value={roleState.description} onChange={(event) => setRoleState((current) => ({ ...current, description: event.target.value }))} />
				<button className="rounded bg-black px-4 py-2 text-white" type="submit">Save Role</button>
			</form>
			<form className="space-y-3 rounded border p-4" onSubmit={(event) => void saveUserAssignment(event)}>
				<h2 className="text-xl font-semibold">User Role Assignment Example</h2>
				<input className="w-full rounded border px-3 py-2" placeholder="user id" value={userState.userId} onChange={(event) => setUserState((current) => ({ ...current, userId: event.target.value }))} />
				<input className="w-full rounded border px-3 py-2" placeholder="roles,comma,separated" value={userState.roles} onChange={(event) => setUserState((current) => ({ ...current, roles: event.target.value }))} />
				<button className="rounded bg-black px-4 py-2 text-white" type="submit">Save User Assignment</button>
			</form>
			<div className="grid gap-4 md:grid-cols-2">
				<div>
					<h2 className="text-xl font-semibold">Roles</h2>
					<ul className="space-y-2">
						{data?.roles.map((item) => (
							<li className="rounded border p-3" key={item.slug}>
								<div className="font-medium">{item.label}</div>
								<div className="text-sm text-kumo-subtle">{item.slug}</div>
								<div className="text-sm">{item.description}</div>
							</li>
						))}
					</ul>
				</div>
				<div>
					<h2 className="text-xl font-semibold">User Assignments</h2>
					<ul className="space-y-2">
						{data?.userAssignments.map((item) => (
							<li className="rounded border p-3" key={item.userId}>
								<div className="font-medium">{item.userId}</div>
								<div className="text-sm text-kumo-subtle">{item.roles.join(", ") || "No roles"}</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}

function MatrixPage() {
	const { data, error, loading, reload } = usePluginData<AccessMatrixResponse>(
		"/_emdash/api/plugins/awcms-micro-example/access/matrix/get",
		{ method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" },
	);
	const [selectedRole, setSelectedRole] = React.useState("");
	const [selectedPermissions, setSelectedPermissions] = React.useState<string[]>([]);

	React.useEffect(() => {
		if (!data?.roles.length) return;
		const roleSlug = selectedRole || data.roles[0]!.slug;
		setSelectedRole(roleSlug);
		const assignment = data.assignments.find((item) => item.roleSlug === roleSlug);
		setSelectedPermissions(assignment?.permissions ?? []);
	}, [data, selectedRole]);

	const saveMatrix = async () => {
		const response = await apiFetch("/_emdash/api/plugins/awcms-micro-example/access/matrix/save", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ roleSlug: selectedRole, permissions: selectedPermissions }),
		});
		if (!response.ok) throw new Error(await getErrorMessage(response, "Failed to save matrix"));
		await parseApiResponse(response);
		await reload();
	};

	if (loading) return <div className="text-kumo-subtle">Loading role matrix...</div>;
	if (error) return <div className="text-red-600">{error}</div>;

	return (
		<div className="space-y-6 max-w-4xl">
			<div>
				<h1 className="text-3xl font-bold">Role And Permission Matrix</h1>
				<p className="text-kumo-subtle mt-2">Save demonstrative role-permission mappings without editing EmDash core authorization internals.</p>
			</div>
			<select className="rounded border px-3 py-2" value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)}>
				{data?.roles.map((role) => <option key={role.slug} value={role.slug}>{role.label}</option>)}
			</select>
			<div className="grid gap-2">
				{data?.permissions.map((permission) => {
					const checked = selectedPermissions.includes(permission.slug);
					return (
						<label className="flex items-start gap-3 rounded border p-3" key={permission.slug}>
							<input
								type="checkbox"
								checked={checked}
								onChange={(event) =>
									setSelectedPermissions((current) =>
										event.target.checked ? [...current, permission.slug] : current.filter((item) => item !== permission.slug),
									)
								}
							/>
							<div>
								<div className="font-medium">{permission.label}</div>
								<div className="text-sm text-kumo-subtle">{permission.slug} | {permission.scope}</div>
							</div>
						</label>
					);
				})}
			</div>
			<button className="rounded bg-black px-4 py-2 text-white" onClick={() => void saveMatrix()} type="button">Save Matrix</button>
		</div>
	);
}

function PreviewPage() {
	const { data: rolesData } = usePluginData<AccessRolesResponse>(
		"/_emdash/api/plugins/awcms-micro-example/access/roles/list",
		{ method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" },
	);
	const { data: permissionsData } = usePluginData<AccessPermissionsResponse>(
		"/_emdash/api/plugins/awcms-micro-example/access/permissions/list",
		{ method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" },
	);
	const [userId, setUserId] = React.useState("user-demo-editor");
	const [permissionSlug, setPermissionSlug] = React.useState("content.read.public");
	const [preview, setPreview] = React.useState<AccessPreviewResponse | null>(null);
	const [error, setError] = React.useState<string | null>(null);

	const runPreview = async () => {
		setError(null);
		const response = await apiFetch("/_emdash/api/plugins/awcms-micro-example/access/preview", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ userId, permissionSlug }),
		});
		if (!response.ok) {
			setError(await getErrorMessage(response, "Failed to preview access"));
			return;
		}
		setPreview(await parseApiResponse<AccessPreviewResponse>(response));
	};

	return (
		<div className="space-y-6 max-w-4xl">
			<div>
				<h1 className="text-3xl font-bold">Effective Access Preview</h1>
				<p className="text-kumo-subtle mt-2">Deterministic preview based on plugin-owned role and permission assignments.</p>
			</div>
			<div className="grid gap-4 md:grid-cols-2">
				<label className="block text-sm">
					<span className="mb-1 block">User</span>
					<select className="w-full rounded border px-3 py-2" value={userId} onChange={(event) => setUserId(event.target.value)}>
						{rolesData?.userAssignments.map((item) => <option key={item.userId} value={item.userId}>{item.userId}</option>)}
					</select>
				</label>
				<label className="block text-sm">
					<span className="mb-1 block">Permission</span>
					<select className="w-full rounded border px-3 py-2" value={permissionSlug} onChange={(event) => setPermissionSlug(event.target.value)}>
						{permissionsData?.items.map((item) => <option key={item.slug} value={item.slug}>{item.slug}</option>)}
					</select>
				</label>
			</div>
			<button className="rounded bg-black px-4 py-2 text-white" onClick={() => void runPreview()} type="button">Preview Access</button>
			{error ? <div className="text-red-600">{error}</div> : null}
			{preview ? (
				<div className="rounded border p-4">
					<div className="font-medium">{preview.allowed ? "Allowed" : "Denied"}</div>
					<div className="text-sm text-kumo-subtle">{preview.reason}</div>
					<div className="mt-2 text-sm">Matched roles: {preview.matchedRoles.join(", ") || "None"}</div>
					<div className="mt-2 text-sm">Effective permissions: {preview.effectivePermissions.join(", ") || "None"}</div>
				</div>
			) : null}
		</div>
	);
}

function AbacAttributesPage() {
	const { data, error, loading, reload } = usePluginData<AbacAttributesResponse>(
		"/_emdash/api/plugins/awcms-micro-example/abac/attributes/list",
		{ method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" },
	);
	const { data: subjectData, reload: reloadSubjects } = usePluginData<AbacAssignmentsResponse>(
		"/_emdash/api/plugins/awcms-micro-example/abac/subjects/list",
		{ method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" },
	);
	const { data: resourceData, reload: reloadResources } = usePluginData<AbacAssignmentsResponse>(
		"/_emdash/api/plugins/awcms-micro-example/abac/resources/list",
		{ method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" },
	);
	const [attributeState, setAttributeState] = React.useState({ key: "", label: "", targetType: "context", description: "" });
	const [subjectState, setSubjectState] = React.useState({ subjectId: "", attributes: '{"tenant_id":"tenant-a"}' });
	const [resourceState, setResourceState] = React.useState({ resourceId: "", attributes: '{"resource_type":"policy"}' });

	const parseAttributes = (value: string) => {
		try {
			return JSON.parse(value) as Record<string, string>;
		} catch {
			return {};
		}
	};

	const saveAttribute = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const response = await apiFetch("/_emdash/api/plugins/awcms-micro-example/abac/attributes/save", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(attributeState),
		});
		if (!response.ok) throw new Error(await getErrorMessage(response, "Failed to save ABAC attribute"));
		await parseApiResponse(response);
		setAttributeState({ key: "", label: "", targetType: "context", description: "" });
		await reload();
	};

	const saveSubject = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const response = await apiFetch("/_emdash/api/plugins/awcms-micro-example/abac/subjects/save", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ subjectId: subjectState.subjectId, attributes: parseAttributes(subjectState.attributes) }),
		});
		if (!response.ok) throw new Error(await getErrorMessage(response, "Failed to save ABAC subject"));
		await parseApiResponse(response);
		setSubjectState({ subjectId: "", attributes: '{"tenant_id":"tenant-a"}' });
		await reloadSubjects();
	};

	const saveResource = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const response = await apiFetch("/_emdash/api/plugins/awcms-micro-example/abac/resources/save", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ resourceId: resourceState.resourceId, attributes: parseAttributes(resourceState.attributes) }),
		});
		if (!response.ok) throw new Error(await getErrorMessage(response, "Failed to save ABAC resource"));
		await parseApiResponse(response);
		setResourceState({ resourceId: "", attributes: '{"resource_type":"policy"}' });
		await reloadResources();
	};

	if (loading) return <div className="text-kumo-subtle">Loading ABAC attributes...</div>;
	if (error) return <div className="text-red-600">{error}</div>;

	return (
		<div className="space-y-6 max-w-5xl">
			<div>
				<h1 className="text-3xl font-bold">ABAC Attribute Catalog</h1>
				<p className="text-kumo-subtle mt-2">Define subject, resource, and context attributes for the AWCMS-Micro ABAC demo.</p>
			</div>
			<form className="space-y-3 rounded border p-4" onSubmit={(event) => void saveAttribute(event)}>
				<input className="w-full rounded border px-3 py-2" placeholder="attribute key" value={attributeState.key} onChange={(event) => setAttributeState((current) => ({ ...current, key: event.target.value }))} />
				<input className="w-full rounded border px-3 py-2" placeholder="label" value={attributeState.label} onChange={(event) => setAttributeState((current) => ({ ...current, label: event.target.value }))} />
				<select className="w-full rounded border px-3 py-2" value={attributeState.targetType} onChange={(event) => setAttributeState((current) => ({ ...current, targetType: event.target.value }))}>
					<option value="subject">subject</option>
					<option value="resource">resource</option>
					<option value="context">context</option>
				</select>
				<textarea className="w-full rounded border px-3 py-2" placeholder="description" value={attributeState.description} onChange={(event) => setAttributeState((current) => ({ ...current, description: event.target.value }))} />
				<button className="rounded bg-black px-4 py-2 text-white" type="submit">Save Attribute</button>
			</form>
			<div className="grid gap-4 md:grid-cols-2">
				<form className="space-y-3 rounded border p-4" onSubmit={(event) => void saveSubject(event)}>
					<h2 className="text-xl font-semibold">Subject Assignment Example</h2>
					<input className="w-full rounded border px-3 py-2" placeholder="subject id" value={subjectState.subjectId} onChange={(event) => setSubjectState((current) => ({ ...current, subjectId: event.target.value }))} />
					<textarea className="w-full rounded border px-3 py-2 font-mono text-sm" value={subjectState.attributes} onChange={(event) => setSubjectState((current) => ({ ...current, attributes: event.target.value }))} />
					<button className="rounded bg-black px-4 py-2 text-white" type="submit">Save Subject</button>
				</form>
				<form className="space-y-3 rounded border p-4" onSubmit={(event) => void saveResource(event)}>
					<h2 className="text-xl font-semibold">Resource Assignment Example</h2>
					<input className="w-full rounded border px-3 py-2" placeholder="resource id" value={resourceState.resourceId} onChange={(event) => setResourceState((current) => ({ ...current, resourceId: event.target.value }))} />
					<textarea className="w-full rounded border px-3 py-2 font-mono text-sm" value={resourceState.attributes} onChange={(event) => setResourceState((current) => ({ ...current, attributes: event.target.value }))} />
					<button className="rounded bg-black px-4 py-2 text-white" type="submit">Save Resource</button>
				</form>
			</div>
			<div className="grid gap-4 md:grid-cols-3">
				<div>
					<h2 className="text-xl font-semibold">Attributes</h2>
					<ul className="space-y-2">
						{data?.items.map((item) => (
							<li className="rounded border p-3" key={item.key}><div className="font-medium">{item.label}</div><div className="text-sm text-kumo-subtle">{item.key} | {item.targetType}</div></li>
						))}
					</ul>
				</div>
				<div>
					<h2 className="text-xl font-semibold">Subjects</h2>
					<ul className="space-y-2">
						{subjectData?.items.map((item) => (
							<li className="rounded border p-3" key={item.subjectId}><div className="font-medium">{item.subjectId}</div><div className="text-sm text-kumo-subtle">{Object.entries(item.attributes).map(([key, value]) => `${key}=${value}`).join(", ")}</div></li>
						))}
					</ul>
				</div>
				<div>
					<h2 className="text-xl font-semibold">Resources</h2>
					<ul className="space-y-2">
						{resourceData?.items.map((item) => (
							<li className="rounded border p-3" key={item.resourceId}><div className="font-medium">{item.resourceId}</div><div className="text-sm text-kumo-subtle">{Object.entries(item.attributes).map(([key, value]) => `${key}=${value}`).join(", ")}</div></li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}

function AbacPoliciesPage() {
	const { data, error, loading, reload } = usePluginData<AbacPoliciesResponse>(
		"/_emdash/api/plugins/awcms-micro-example/abac/policies/list",
		{ method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" },
	);
	const [formState, setFormState] = React.useState({
		id: "",
		label: "",
		effect: "allow",
		actions: "content.read",
		requiredSubject: '{"tenant_id":"tenant-a"}',
		requiredResource: '{"resource_status":"published"}',
		requiredContext: '{"region_scope":"id-jakarta"}',
	});

	const parseAttributes = (value: string) => {
		try {
			return JSON.parse(value) as Record<string, string>;
		} catch {
			return {};
		}
	};

	const savePolicy = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const response = await apiFetch("/_emdash/api/plugins/awcms-micro-example/abac/policies/save", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: formState.id,
				label: formState.label,
				effect: formState.effect,
				actions: formState.actions.split(",").map((item) => item.trim()).filter(Boolean),
				requiredSubject: parseAttributes(formState.requiredSubject),
				requiredResource: parseAttributes(formState.requiredResource),
				requiredContext: parseAttributes(formState.requiredContext),
			}),
		});
		if (!response.ok) throw new Error(await getErrorMessage(response, "Failed to save ABAC policy"));
		await parseApiResponse(response);
		setFormState({ id: "", label: "", effect: "allow", actions: "content.read", requiredSubject: '{"tenant_id":"tenant-a"}', requiredResource: '{"resource_status":"published"}', requiredContext: '{"region_scope":"id-jakarta"}' });
		await reload();
	};

	if (loading) return <div className="text-kumo-subtle">Loading ABAC policies...</div>;
	if (error) return <div className="text-red-600">{error}</div>;

	return (
		<div className="space-y-6 max-w-5xl">
			<div>
				<h1 className="text-3xl font-bold">ABAC Policy Rules</h1>
				<p className="text-kumo-subtle mt-2">Create explicit allow and deny rules for the demonstrative ABAC engine.</p>
			</div>
			<form className="space-y-3 rounded border p-4" onSubmit={(event) => void savePolicy(event)}>
				<input className="w-full rounded border px-3 py-2" placeholder="policy id" value={formState.id} onChange={(event) => setFormState((current) => ({ ...current, id: event.target.value }))} />
				<input className="w-full rounded border px-3 py-2" placeholder="label" value={formState.label} onChange={(event) => setFormState((current) => ({ ...current, label: event.target.value }))} />
				<select className="w-full rounded border px-3 py-2" value={formState.effect} onChange={(event) => setFormState((current) => ({ ...current, effect: event.target.value }))}>
					<option value="allow">allow</option>
					<option value="deny">deny</option>
				</select>
				<input className="w-full rounded border px-3 py-2" placeholder="actions,comma,separated" value={formState.actions} onChange={(event) => setFormState((current) => ({ ...current, actions: event.target.value }))} />
				<textarea className="w-full rounded border px-3 py-2 font-mono text-sm" value={formState.requiredSubject} onChange={(event) => setFormState((current) => ({ ...current, requiredSubject: event.target.value }))} />
				<textarea className="w-full rounded border px-3 py-2 font-mono text-sm" value={formState.requiredResource} onChange={(event) => setFormState((current) => ({ ...current, requiredResource: event.target.value }))} />
				<textarea className="w-full rounded border px-3 py-2 font-mono text-sm" value={formState.requiredContext} onChange={(event) => setFormState((current) => ({ ...current, requiredContext: event.target.value }))} />
				<button className="rounded bg-black px-4 py-2 text-white" type="submit">Save Policy</button>
			</form>
			<ul className="space-y-2">
				{data?.items.map((item) => (
					<li className="rounded border p-3" key={item.id}>
						<div className="font-medium">{item.label}</div>
						<div className="text-sm text-kumo-subtle">{item.id} | {item.effect} | {item.actions.join(", ")}</div>
					</li>
				))}
			</ul>
		</div>
	);
}

function AbacPreviewPage() {
	const { data: subjectData } = usePluginData<AbacAssignmentsResponse>(
		"/_emdash/api/plugins/awcms-micro-example/abac/subjects/list",
		{ method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" },
	);
	const { data: resourceData } = usePluginData<AbacAssignmentsResponse>(
		"/_emdash/api/plugins/awcms-micro-example/abac/resources/list",
		{ method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" },
	);
	const [subjectId, setSubjectId] = React.useState("user-demo-editor");
	const [resourceId, setResourceId] = React.useState("resource-public-post");
	const [action, setAction] = React.useState("content.read");
	const [contextAttributes, setContextAttributes] = React.useState('{"region_scope":"id-jakarta"}');
	const [preview, setPreview] = React.useState<AbacPreviewResponse | null>(null);
	const [error, setError] = React.useState<string | null>(null);

	const parseAttributes = (value: string) => {
		try {
			return JSON.parse(value) as Record<string, string>;
		} catch {
			return {};
		}
	};

	const runPreview = async (route: "abac/preview" | "abac/enforce-demo") => {
		setError(null);
		const response = await apiFetch(`/_emdash/api/plugins/awcms-micro-example/${route}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ subjectId, resourceId, action, contextAttributes: parseAttributes(contextAttributes) }),
		});
		if (!response.ok) {
			setError(await getErrorMessage(response, "Failed to evaluate ABAC policy"));
			return;
		}
		setPreview(await parseApiResponse<AbacPreviewResponse>(response));
	};

	return (
		<div className="space-y-6 max-w-4xl">
			<div>
				<h1 className="text-3xl font-bold">ABAC Decision Preview</h1>
				<p className="text-kumo-subtle mt-2">Preview and enforce the demonstrative ABAC decision engine without touching EmDash core authorization.</p>
			</div>
			<div className="grid gap-4 md:grid-cols-2">
				<label className="block text-sm">
					<span className="mb-1 block">Subject</span>
					<select className="w-full rounded border px-3 py-2" value={subjectId} onChange={(event) => setSubjectId(event.target.value)}>
						{subjectData?.items.map((item) => <option key={item.subjectId} value={item.subjectId}>{item.subjectId}</option>)}
					</select>
				</label>
				<label className="block text-sm">
					<span className="mb-1 block">Resource</span>
					<select className="w-full rounded border px-3 py-2" value={resourceId} onChange={(event) => setResourceId(event.target.value)}>
						{resourceData?.items.map((item) => <option key={item.resourceId} value={item.resourceId}>{item.resourceId}</option>)}
					</select>
				</label>
			</div>
			<input className="w-full rounded border px-3 py-2" placeholder="action" value={action} onChange={(event) => setAction(event.target.value)} />
			<textarea className="w-full rounded border px-3 py-2 font-mono text-sm" value={contextAttributes} onChange={(event) => setContextAttributes(event.target.value)} />
			<div className="flex gap-3">
				<button className="rounded bg-black px-4 py-2 text-white" onClick={() => void runPreview("abac/preview")} type="button">Preview Policy</button>
				<button className="rounded border px-4 py-2" onClick={() => void runPreview("abac/enforce-demo")} type="button">Run Protected Demo</button>
			</div>
			{error ? <div className="text-red-600">{error}</div> : null}
			{preview ? (
				<div className="rounded border p-4">
					<div className="font-medium">{preview.allowed ? "Allowed" : "Denied"} ({preview.effect})</div>
					<div className="text-sm text-kumo-subtle">{preview.reason}</div>
					<div className="mt-2 text-sm">Matched policies: {preview.matchedPolicyIds.join(", ") || "None"}</div>
					<div className="mt-2 text-sm">Missing attributes: {preview.missingAttributes.join(", ") || "None"}</div>
				</div>
			) : null}
		</div>
	);
}

interface FieldWidgetProps {
	value: unknown;
	onChange: (value: unknown) => void;
	label: string;
	id: string;
	minimal?: boolean;
	required?: boolean;
}

function StatusBadgeField({ value, onChange, label, id, minimal, required }: FieldWidgetProps) {
	const current = typeof value === "string" && value ? value : "draft";
	const badgeClass =
		current === "approved"
			? "bg-green-100 text-green-700"
			: current === "review"
				? "bg-amber-100 text-amber-700"
				: "bg-slate-100 text-slate-700";

	return (
		<div className="space-y-2">
			{!minimal && (
				<label className="block text-sm font-medium" htmlFor={id}>
					{label}
					{required ? <span className="ms-1 text-red-600">*</span> : null}
				</label>
			)}
			<div className="flex items-center gap-3">
				<select
					className="rounded border px-3 py-2"
					id={id}
					value={current}
					onChange={(event) => onChange(event.target.value)}
				>
					<option value="draft">Draft</option>
					<option value="review">Review</option>
					<option value="approved">Approved</option>
				</select>
				<span className={`rounded px-2 py-1 text-xs font-semibold ${badgeClass}`}>{current}</span>
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
