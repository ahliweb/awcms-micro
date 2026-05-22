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
};

export const pages: PluginAdminExports["pages"] = {
	"/overview": OverviewPage,
	"/audit": AuditPage,
};

export const fields: PluginAdminExports["fields"] = {
	"status-badge": StatusBadgeField,
};
