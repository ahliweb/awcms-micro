import { Button, LinkButton } from "@cloudflare/kumo";
import { useLingui } from "@lingui/react";
import type { PluginAdminExports } from "emdash";
import * as React from "react";

import { getMailketingAdminCopy } from "./admin-copy.js";
import { getMailketingPlugin, postMailketingPlugin } from "./admin/api/client.js";
import type {
	MailketingAuditEvent,
	MailketingAuditListResponse,
	MailketingOverviewStats,
	MailketingPermission,
	MailketingRole,
	MailketingRoleListResponse,
	MailketingSendLogEntry,
	MailketingSendLogListResponse,
	MailketingSettingsGetResponse,
	MailketingUserListResponse,
	MailketingUserSummary,
} from "./contracts/index.js";

// ── Shared helpers ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
	const colorMap: Record<string, string> = {
		sent: "bg-green-100 text-green-800",
		failed: "bg-red-100 text-red-800",
		pending: "bg-yellow-100 text-yellow-800",
		cancelled: "bg-gray-100 text-gray-700",
		active: "bg-green-100 text-green-800",
	};
	const cls = colorMap[status.toLowerCase()] ?? "bg-gray-100 text-gray-700";
	return (
		<span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${cls}`}>
			{status}
		</span>
	);
}

function Pagination({
	page,
	totalPages,
	onPrev,
	onNext,
	copy,
}: {
	page: number;
	totalPages: number;
	onPrev: () => void;
	onNext: () => void;
	copy: ReturnType<typeof getMailketingAdminCopy>;
}) {
	return (
		<div className="flex items-center justify-between mt-4 text-sm text-kumo-subtle">
			<span>
				{copy("mailketing.common.page")} {page} {copy("mailketing.common.of")} {totalPages}
			</span>
			<div className="flex gap-2">
				<Button size="sm" variant="secondary" onClick={onPrev} disabled={page <= 1}>
					{copy("mailketing.common.prev")}
				</Button>
				<Button size="sm" variant="secondary" onClick={onNext} disabled={page >= totalPages}>
					{copy("mailketing.common.next")}
				</Button>
			</div>
		</div>
	);
}

function ErrorBanner({ message }: { message: string }) {
	return (
		<div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
			{message}
		</div>
	);
}

// ── Overview page ─────────────────────────────────────────────────────────────

function OverviewPage() {
	const { i18n } = useLingui();
	const copy = getMailketingAdminCopy(i18n.locale);
	const [stats, setStats] = React.useState<MailketingOverviewStats | null>(null);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);

	React.useEffect(() => {
		setLoading(true);
		getMailketingPlugin<MailketingOverviewStats>({ path: "overview/stats" })
			.then(setStats)
			.catch((e) => setError(e instanceof Error ? e.message : String(e)))
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return <p className="text-kumo-subtle text-sm">{copy("mailketing.overview.loading")}</p>;
	}
	if (error) return <ErrorBanner message={error} />;

	const providerStatusLabel = !stats?.providerConfigured
		? copy("mailketing.overview.statusNotConfigured")
		: !stats.providerEnabled
			? copy("mailketing.overview.statusDisabled")
			: copy("mailketing.overview.statusActive");

	const providerStatusColor =
		!stats?.providerConfigured || !stats.providerEnabled
			? "text-red-600"
			: "text-green-600";

	return (
		<div className="space-y-8">
			<section className="space-y-3">
				<h1 className="text-3xl font-semibold text-kumo-foreground">
					{copy("mailketing.overview.title")}
				</h1>
				<p className="max-w-3xl text-sm leading-6 text-kumo-subtle">
					{copy("mailketing.overview.description")}
				</p>
				<div className="flex flex-wrap gap-3">
					<LinkButton href="/_emdash/admin/plugins/awcms-email-mailketing/settings" external>
						{copy("mailketing.overview.configureSettings")}
					</LinkButton>
					<LinkButton href="/_emdash/admin/plugins/awcms-email-mailketing/send-log" external>
						{copy("mailketing.overview.viewSendLog")}
					</LinkButton>
				</div>
			</section>

			{stats && (
				<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{/* Provider status */}
					<article className="rounded-lg border border-kumo-border bg-kumo-background p-4 space-y-1">
						<p className="text-xs font-medium uppercase tracking-wider text-kumo-subtle">
							{copy("mailketing.overview.providerStatus")}
						</p>
						<p className={`text-lg font-semibold ${providerStatusColor}`}>
							{providerStatusLabel}
						</p>
						{stats.fromEmail && (
							<p className="text-xs text-kumo-subtle">
								{copy("mailketing.overview.fromEmail")}: {stats.fromEmail}
							</p>
						)}
						{stats.fromName && (
							<p className="text-xs text-kumo-subtle">
								{copy("mailketing.overview.fromName")}: {stats.fromName}
							</p>
						)}
					</article>

					{/* Totals */}
					{(
						[
							["mailketing.overview.statSent", stats.totalSent, "text-green-600"],
							["mailketing.overview.statFailed", stats.totalFailed, "text-red-600"],
							["mailketing.overview.statPending", stats.totalPending, "text-yellow-600"],
							["mailketing.overview.stat24hSent", stats.last24hSent, "text-green-600"],
							["mailketing.overview.stat24hFailed", stats.last24hFailed, "text-red-600"],
						] as const
					).map(([key, value, color]) => (
						<article
							key={key}
							className="rounded-lg border border-kumo-border bg-kumo-background p-4 space-y-1"
						>
							<p className="text-xs font-medium uppercase tracking-wider text-kumo-subtle">
								{copy(key)}
							</p>
							<p className={`text-2xl font-bold ${color}`}>{value}</p>
						</article>
					))}
				</section>
			)}
		</div>
	);
}

// ── Send Log page ─────────────────────────────────────────────────────────────

function SendLogPage() {
	const { i18n } = useLingui();
	const copy = getMailketingAdminCopy(i18n.locale);

	const [page, setPage] = React.useState(1);
	const [statusFilter, setStatusFilter] = React.useState("");
	const [recipientFilter, setRecipientFilter] = React.useState("");
	const [includeDeleted, setIncludeDeleted] = React.useState(false);
	const [data, setData] = React.useState<MailketingSendLogListResponse | null>(null);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);
	const [confirmDelete, setConfirmDelete] = React.useState<string | null>(null);
	const [confirmPermanent, setConfirmPermanent] = React.useState<string | null>(null);
	const [permanentReason, setPermanentReason] = React.useState("");

	const load = React.useCallback(() => {
		setLoading(true);
		setError(null);
		postMailketingPlugin<MailketingSendLogListResponse>({
			path: "send-log/list",
			payload: {
				page,
				pageSize: 20,
				status: statusFilter || undefined,
				recipient: recipientFilter || undefined,
				includeDeleted,
			},
		})
			.then(setData)
			.catch((e) => setError(e instanceof Error ? e.message : String(e)))
			.finally(() => setLoading(false));
	}, [page, statusFilter, recipientFilter, includeDeleted]);

	React.useEffect(() => {
		load();
	}, [load]);

	const handleSoftDelete = async (id: string) => {
		try {
			await postMailketingPlugin({ path: "send-log/soft-delete", payload: { id } });
			load();
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		}
		setConfirmDelete(null);
	};

	const handleRestore = async (id: string) => {
		try {
			await postMailketingPlugin({ path: "send-log/restore", payload: { id } });
			load();
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		}
	};

	const handlePermanentDelete = async (id: string) => {
		if (!permanentReason.trim()) {
			setError(copy("mailketing.sendLog.reasonRequired"));
			return;
		}
		try {
			await postMailketingPlugin({
				path: "send-log/permanent-delete",
				payload: { id, reason: permanentReason },
			});
			load();
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		}
		setConfirmPermanent(null);
		setPermanentReason("");
	};

	return (
		<div className="space-y-6">
			<div className="space-y-1">
				<h1 className="text-2xl font-semibold text-kumo-foreground">
					{copy("mailketing.sendLog.title")}
				</h1>
				<p className="text-sm text-kumo-subtle">{copy("mailketing.sendLog.description")}</p>
			</div>

			{/* Filters */}
			<div className="flex flex-wrap gap-3 items-end">
				<div>
					<label className="block text-xs font-medium text-kumo-subtle mb-1">
						{copy("mailketing.sendLog.filterStatus")}
					</label>
					<select
						className="rounded border border-kumo-border bg-kumo-background px-2 py-1.5 text-sm text-kumo-foreground"
						value={statusFilter}
						onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
					>
						<option value="">— All —</option>
						<option value="sent">{copy("mailketing.sendLog.statusSent")}</option>
						<option value="failed">{copy("mailketing.sendLog.statusFailed")}</option>
						<option value="pending">{copy("mailketing.sendLog.statusPending")}</option>
						<option value="cancelled">{copy("mailketing.sendLog.statusCancelled")}</option>
					</select>
				</div>
				<div>
					<label className="block text-xs font-medium text-kumo-subtle mb-1">
						{copy("mailketing.sendLog.filterRecipient")}
					</label>
					<input
						className="rounded border border-kumo-border bg-kumo-background px-2 py-1.5 text-sm text-kumo-foreground"
						value={recipientFilter}
						onChange={(e) => { setRecipientFilter(e.target.value); setPage(1); }}
						placeholder="email@example.com"
					/>
				</div>
				<label className="flex items-center gap-2 text-sm text-kumo-subtle cursor-pointer">
					<input
						type="checkbox"
						checked={includeDeleted}
						onChange={(e) => { setIncludeDeleted(e.target.checked); setPage(1); }}
					/>
					{copy("mailketing.sendLog.filterIncludeDeleted")}
				</label>
			</div>

			{error && <ErrorBanner message={error} />}

			{loading ? (
				<p className="text-sm text-kumo-subtle">{copy("mailketing.sendLog.loading")}</p>
			) : (
				<>
					{/* Confirm soft delete modal */}
					{confirmDelete && (
						<div className="rounded-md bg-yellow-50 border border-yellow-200 p-4 flex justify-between items-center">
							<span className="text-sm text-yellow-800">{copy("mailketing.sendLog.confirmDelete")}</span>
							<div className="flex gap-2">
								<Button size="sm" variant="destructive" onClick={() => handleSoftDelete(confirmDelete)}>
									{copy("mailketing.common.delete")}
								</Button>
								<Button size="sm" variant="secondary" onClick={() => setConfirmDelete(null)}>
									{copy("mailketing.common.cancel")}
								</Button>
							</div>
						</div>
					)}

					{/* Confirm permanent delete modal */}
					{confirmPermanent && (
						<div className="rounded-md bg-red-50 border border-red-200 p-4 space-y-3">
							<p className="text-sm text-red-800">{copy("mailketing.sendLog.confirmPermanentDelete")}</p>
							<input
								className="block w-full rounded border border-red-300 bg-white px-2 py-1.5 text-sm"
								placeholder={copy("mailketing.sendLog.reasonRequired")}
								value={permanentReason}
								onChange={(e) => setPermanentReason(e.target.value)}
							/>
							<div className="flex gap-2">
								<Button size="sm" variant="destructive" onClick={() => handlePermanentDelete(confirmPermanent)}>
									{copy("mailketing.sendLog.actionPermanentDelete")}
								</Button>
								<Button
									size="sm"
									variant="secondary"
									onClick={() => { setConfirmPermanent(null); setPermanentReason(""); }}
								>
									{copy("mailketing.common.cancel")}
								</Button>
							</div>
						</div>
					)}

					{data?.items.length === 0 ? (
						<p className="text-sm text-kumo-subtle">{copy("mailketing.sendLog.noEntries")}</p>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-sm border-collapse">
								<thead>
									<tr className="border-b border-kumo-border text-left text-xs font-medium uppercase tracking-wider text-kumo-subtle">
										<th className="py-2 pr-4">{copy("mailketing.sendLog.colRecipient")}</th>
										<th className="py-2 pr-4">{copy("mailketing.sendLog.colSubject")}</th>
										<th className="py-2 pr-4">{copy("mailketing.sendLog.colStatus")}</th>
										<th className="py-2 pr-4">{copy("mailketing.sendLog.colSentAt")}</th>
										<th className="py-2">{copy("mailketing.sendLog.colActions")}</th>
									</tr>
								</thead>
								<tbody>
									{data?.items.map((entry: MailketingSendLogEntry) => (
										<tr
											key={entry.id}
											className={`border-b border-kumo-border/50 ${entry.deletedAt ? "opacity-50" : ""}`}
										>
											<td className="py-2 pr-4 font-mono text-xs">{entry.recipient}</td>
											<td className="py-2 pr-4 max-w-xs truncate">{entry.subject}</td>
											<td className="py-2 pr-4">
												<StatusBadge status={entry.status} />
											</td>
											<td className="py-2 pr-4 text-xs text-kumo-subtle">
												{entry.sentAt ? new Date(entry.sentAt).toLocaleString() : "—"}
											</td>
											<td className="py-2 flex gap-1 flex-wrap">
												{!entry.deletedAt ? (
													<Button
														size="sm"
														variant="secondary"
														onClick={() => setConfirmDelete(entry.id)}
													>
														{copy("mailketing.sendLog.actionDelete")}
													</Button>
												) : (
													<Button size="sm" variant="secondary" onClick={() => handleRestore(entry.id)}>
														{copy("mailketing.sendLog.actionRestore")}
													</Button>
												)}
												{entry.deletedAt && (
													<Button
														size="sm"
														variant="destructive"
														onClick={() => setConfirmPermanent(entry.id)}
													>
														{copy("mailketing.sendLog.actionPermanentDelete")}
													</Button>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}

					{data && data.totalPages > 1 && (
						<Pagination
							page={page}
							totalPages={data.totalPages}
							onPrev={() => setPage((p) => Math.max(1, p - 1))}
							onNext={() => setPage((p) => Math.min(data.totalPages, p + 1))}
							copy={copy}
						/>
					)}
				</>
			)}
		</div>
	);
}

// ── Settings page ─────────────────────────────────────────────────────────────

function SettingsPage() {
	const { i18n } = useLingui();
	const copy = getMailketingAdminCopy(i18n.locale);

	const [loading, setLoading] = React.useState(true);
	const [saving, setSaving] = React.useState(false);
	const [testing, setTesting] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const [toast, setToast] = React.useState<string | null>(null);
	const [configured, setConfigured] = React.useState(false);

	const [apiToken, setApiToken] = React.useState("");
	const [fromEmail, setFromEmail] = React.useState("");
	const [fromName, setFromName] = React.useState("AWCMS Email");
	const [enabled, setEnabled] = React.useState(true);
	const [logOutbound, setLogOutbound] = React.useState(true);

	React.useEffect(() => {
		setLoading(true);
		getMailketingPlugin<MailketingSettingsGetResponse>({ path: "settings/get" })
			.then((res) => {
				setConfigured(res.configured);
				setApiToken(res.settings.apiToken);
				setFromEmail(res.settings.fromEmail);
				setFromName(res.settings.fromName);
				setEnabled(res.settings.enabled);
				setLogOutbound(res.settings.logOutbound);
			})
			.catch((e) => setError(e instanceof Error ? e.message : String(e)))
			.finally(() => setLoading(false));
	}, []);

	const handleSave = async () => {
		setSaving(true);
		setError(null);
		try {
			await postMailketingPlugin({
				path: "settings/save",
				payload: { apiToken, fromEmail, fromName, enabled, logOutbound },
			});
			setToast(copy("mailketing.settings.saveSuccess"));
			setConfigured(!!apiToken && !!fromEmail && apiToken !== "••••••••");
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		} finally {
			setSaving(false);
		}
	};

	const handleTest = async () => {
		setTesting(true);
		setError(null);
		try {
			const result = await postMailketingPlugin<{ ok: boolean; error?: string }>({
				path: "settings/test-connection",
				payload: {},
			});
			if (result.ok) {
				setToast(copy("mailketing.settings.testSuccess"));
			} else {
				setError(`${copy("mailketing.settings.testFailed")}: ${result.error ?? "Unknown"}`);
			}
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		} finally {
			setTesting(false);
		}
	};

	if (loading) {
		return <p className="text-sm text-kumo-subtle">{copy("mailketing.settings.loading")}</p>;
	}

	return (
		<div className="space-y-6 max-w-2xl">
			<div className="space-y-1">
				<h1 className="text-2xl font-semibold text-kumo-foreground">
					{copy("mailketing.settings.title")}
				</h1>
				<p className="text-sm text-kumo-subtle">{copy("mailketing.settings.description")}</p>
				{configured ? (
					<span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
						✓ {copy("mailketing.settings.configured")}
					</span>
				) : (
					<p className="text-sm text-amber-600">{copy("mailketing.settings.notConfigured")}</p>
				)}
			</div>

			{toast && (
				<div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700 flex justify-between">
					<span>{toast}</span>
					<button onClick={() => setToast(null)} className="text-green-600 hover:text-green-800">
						✕
					</button>
				</div>
			)}
			{error && <ErrorBanner message={error} />}

			<div className="space-y-5">
				<div>
					<label className="block text-sm font-medium text-kumo-foreground mb-1">
						{copy("mailketing.settings.apiToken")}
					</label>
					<input
						type="password"
						className="block w-full rounded border border-kumo-border bg-kumo-background px-3 py-2 text-sm text-kumo-foreground"
						value={apiToken}
						onChange={(e) => setApiToken(e.target.value)}
						placeholder="••••••••••••••••"
					/>
					<p className="mt-1 text-xs text-kumo-subtle">{copy("mailketing.settings.apiTokenHint")}</p>
				</div>

				<div>
					<label className="block text-sm font-medium text-kumo-foreground mb-1">
						{copy("mailketing.settings.fromEmail")}
					</label>
					<input
						type="email"
						className="block w-full rounded border border-kumo-border bg-kumo-background px-3 py-2 text-sm text-kumo-foreground"
						value={fromEmail}
						onChange={(e) => setFromEmail(e.target.value)}
						placeholder="noreply@yourdomain.com"
					/>
					<p className="mt-1 text-xs text-kumo-subtle">{copy("mailketing.settings.fromEmailHint")}</p>
				</div>

				<div>
					<label className="block text-sm font-medium text-kumo-foreground mb-1">
						{copy("mailketing.settings.fromName")}
					</label>
					<input
						type="text"
						className="block w-full rounded border border-kumo-border bg-kumo-background px-3 py-2 text-sm text-kumo-foreground"
						value={fromName}
						onChange={(e) => setFromName(e.target.value)}
						placeholder="My Website"
					/>
					<p className="mt-1 text-xs text-kumo-subtle">{copy("mailketing.settings.fromNameHint")}</p>
				</div>

				<div className="flex items-center gap-3">
					<input
						id="mk-enabled"
						type="checkbox"
						className="h-4 w-4 rounded border-kumo-border"
						checked={enabled}
						onChange={(e) => setEnabled(e.target.checked)}
					/>
					<div>
						<label
							htmlFor="mk-enabled"
							className="text-sm font-medium text-kumo-foreground cursor-pointer"
						>
							{copy("mailketing.settings.enabled")}
						</label>
						<p className="text-xs text-kumo-subtle">{copy("mailketing.settings.enabledHint")}</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<input
						id="mk-log"
						type="checkbox"
						className="h-4 w-4 rounded border-kumo-border"
						checked={logOutbound}
						onChange={(e) => setLogOutbound(e.target.checked)}
					/>
					<div>
						<label
							htmlFor="mk-log"
							className="text-sm font-medium text-kumo-foreground cursor-pointer"
						>
							{copy("mailketing.settings.logOutbound")}
						</label>
						<p className="text-xs text-kumo-subtle">{copy("mailketing.settings.logOutboundHint")}</p>
					</div>
				</div>
			</div>

			<div className="flex flex-wrap gap-3 pt-2">
				<Button variant="primary" onClick={handleSave} disabled={saving}>
					{saving ? copy("mailketing.common.loading") : copy("mailketing.settings.save")}
				</Button>
				<Button variant="secondary" onClick={handleTest} disabled={testing}>
					{testing ? copy("mailketing.common.loading") : copy("mailketing.settings.testConnection")}
				</Button>
			</div>
		</div>
	);
}

// ── Access — Users page ───────────────────────────────────────────────────────

function AccessUsersPage() {
	const { i18n } = useLingui();
	const copy = getMailketingAdminCopy(i18n.locale);

	const [page, setPage] = React.useState(1);
	const [data, setData] = React.useState<MailketingUserListResponse | null>(null);
	const [roles, setRoles] = React.useState<MailketingRole[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);
	const [assigningUser, setAssigningUser] = React.useState<string | null>(null);
	const [selectedRole, setSelectedRole] = React.useState("");

	const load = React.useCallback(() => {
		setLoading(true);
		Promise.all([
			postMailketingPlugin<MailketingUserListResponse>({
				path: "access/users/list",
				payload: { page, pageSize: 20 },
			}),
			postMailketingPlugin<MailketingRoleListResponse>({
				path: "access/roles/list",
				payload: { page: 1, pageSize: 100 },
			}),
		])
			.then(([users, roleData]) => {
				setData(users);
				setRoles(roleData.items);
			})
			.catch((e) => setError(e instanceof Error ? e.message : String(e)))
			.finally(() => setLoading(false));
	}, [page]);

	React.useEffect(() => { load(); }, [load]);

	const handleAssign = async (userId: string) => {
		if (!selectedRole) return;
		try {
			await postMailketingPlugin({
				path: "access/users/assign-role",
				payload: { userId, roleId: selectedRole },
			});
			setAssigningUser(null);
			setSelectedRole("");
			load();
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		}
	};

	const handleRevoke = async (userId: string, roleId: string) => {
		try {
			await postMailketingPlugin({
				path: "access/users/revoke-role",
				payload: { userId, roleId },
			});
			load();
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		}
	};

	return (
		<div className="space-y-6">
			<div className="space-y-1">
				<h1 className="text-2xl font-semibold text-kumo-foreground">
					{copy("mailketing.access.usersTitle")}
				</h1>
				<p className="text-sm text-kumo-subtle">{copy("mailketing.access.usersDescription")}</p>
			</div>

			{error && <ErrorBanner message={error} />}

			{loading ? (
				<p className="text-sm text-kumo-subtle">{copy("mailketing.access.loading")}</p>
			) : data?.items.length === 0 ? (
				<p className="text-sm text-kumo-subtle">{copy("mailketing.access.noUsers")}</p>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full text-sm border-collapse">
						<thead>
							<tr className="border-b border-kumo-border text-left text-xs font-medium uppercase tracking-wider text-kumo-subtle">
								<th className="py-2 pr-4">{copy("mailketing.access.colUser")}</th>
								<th className="py-2 pr-4">{copy("mailketing.access.colEmail")}</th>
								<th className="py-2 pr-4">{copy("mailketing.access.colRoles")}</th>
								<th className="py-2">{copy("mailketing.access.colActions")}</th>
							</tr>
						</thead>
						<tbody>
							{data?.items.map((user: MailketingUserSummary) => (
								<tr key={user.userId} className="border-b border-kumo-border/50">
									<td className="py-2 pr-4 text-kumo-foreground">
										{user.name ?? user.email}
									</td>
									<td className="py-2 pr-4 text-kumo-subtle font-mono text-xs">
										{user.email}
									</td>
									<td className="py-2 pr-4">
										<div className="flex flex-wrap gap-1">
											{user.roles.map((r) =>
												r ? (
													<span
														key={r.id}
														className="inline-flex items-center gap-1 rounded bg-kumo-border/30 px-2 py-0.5 text-xs"
													>
														{r.label}
														<button
															onClick={() => handleRevoke(user.userId, r.id)}
															className="text-red-500 hover:text-red-700 ml-1 leading-none"
															aria-label={copy("mailketing.access.revokeRole")}
														>
															✕
														</button>
													</span>
												) : null,
											)}
										</div>
									</td>
									<td className="py-2">
										{assigningUser === user.userId ? (
											<div className="flex gap-2 items-center">
												<select
													className="rounded border border-kumo-border bg-kumo-background px-2 py-1 text-sm"
													value={selectedRole}
													onChange={(e) => setSelectedRole(e.target.value)}
												>
													<option value="">— {copy("mailketing.access.roleLabel")} —</option>
													{roles.map((r) => (
														<option key={r.id} value={r.id}>
															{r.label}
														</option>
													))}
												</select>
												<Button size="sm" variant="primary" onClick={() => handleAssign(user.userId)}>
													{copy("mailketing.common.save")}
												</Button>
												<Button
													size="sm"
													variant="secondary"
													onClick={() => setAssigningUser(null)}
												>
													{copy("mailketing.common.cancel")}
												</Button>
											</div>
										) : (
											<Button
												size="sm"
												variant="secondary"
												onClick={() => setAssigningUser(user.userId)}
											>
												{copy("mailketing.access.assignRole")}
											</Button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{data && data.totalPages > 1 && (
				<Pagination
					page={page}
					totalPages={data.totalPages}
					onPrev={() => setPage((p) => Math.max(1, p - 1))}
					onNext={() => setPage((p) => Math.min(data.totalPages, p + 1))}
					copy={copy}
				/>
			)}
		</div>
	);
}

// ── Access — Roles page ───────────────────────────────────────────────────────

function AccessRolesPage() {
	const { i18n } = useLingui();
	const copy = getMailketingAdminCopy(i18n.locale);

	const [page, setPage] = React.useState(1);
	const [data, setData] = React.useState<MailketingRoleListResponse | null>(null);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);
	const [creating, setCreating] = React.useState(false);
	const [newSlug, setNewSlug] = React.useState("");
	const [newLabel, setNewLabel] = React.useState("");
	const [newDesc, setNewDesc] = React.useState("");
	const [editId, setEditId] = React.useState<string | null>(null);
	const [editLabel, setEditLabel] = React.useState("");
	const [editDesc, setEditDesc] = React.useState("");

	const load = React.useCallback(() => {
		setLoading(true);
		postMailketingPlugin<MailketingRoleListResponse>({
			path: "access/roles/list",
			payload: { page, pageSize: 20 },
		})
			.then(setData)
			.catch((e) => setError(e instanceof Error ? e.message : String(e)))
			.finally(() => setLoading(false));
	}, [page]);

	React.useEffect(() => { load(); }, [load]);

	const handleCreate = async () => {
		if (!newSlug || !newLabel) return;
		try {
			await postMailketingPlugin({
				path: "access/roles/create",
				payload: { slug: newSlug, label: newLabel, description: newDesc },
			});
			setCreating(false);
			setNewSlug(""); setNewLabel(""); setNewDesc("");
			load();
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		}
	};

	const handleUpdate = async (id: string) => {
		try {
			await postMailketingPlugin({
				path: "access/roles/update",
				payload: { id, label: editLabel, description: editDesc },
			});
			setEditId(null);
			load();
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await postMailketingPlugin({ path: "access/roles/delete", payload: { id } });
			load();
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-start justify-between">
				<div className="space-y-1">
					<h1 className="text-2xl font-semibold text-kumo-foreground">
						{copy("mailketing.access.rolesTitle")}
					</h1>
					<p className="text-sm text-kumo-subtle">{copy("mailketing.access.rolesDescription")}</p>
				</div>
				<Button variant="primary" onClick={() => setCreating(true)}>
					{copy("mailketing.access.createRole")}
				</Button>
			</div>

			{error && <ErrorBanner message={error} />}

			{creating && (
				<div className="rounded-lg border border-kumo-border bg-kumo-background p-4 space-y-3">
					<h3 className="text-sm font-semibold text-kumo-foreground">
						{copy("mailketing.access.createRole")}
					</h3>
					<div className="grid gap-3 sm:grid-cols-2">
						<div>
							<label className="block text-xs font-medium text-kumo-subtle mb-1">
								{copy("mailketing.access.roleSlug")}
							</label>
							<input
								className="block w-full rounded border border-kumo-border bg-kumo-background px-2 py-1.5 text-sm"
								value={newSlug}
								onChange={(e) => setNewSlug(e.target.value)}
								placeholder="viewer"
							/>
						</div>
						<div>
							<label className="block text-xs font-medium text-kumo-subtle mb-1">
								{copy("mailketing.access.roleLabel")}
							</label>
							<input
								className="block w-full rounded border border-kumo-border bg-kumo-background px-2 py-1.5 text-sm"
								value={newLabel}
								onChange={(e) => setNewLabel(e.target.value)}
								placeholder="Viewer"
							/>
						</div>
						<div className="sm:col-span-2">
							<label className="block text-xs font-medium text-kumo-subtle mb-1">
								{copy("mailketing.access.roleDescription")}
							</label>
							<input
								className="block w-full rounded border border-kumo-border bg-kumo-background px-2 py-1.5 text-sm"
								value={newDesc}
								onChange={(e) => setNewDesc(e.target.value)}
							/>
						</div>
					</div>
					<div className="flex gap-2">
						<Button size="sm" variant="primary" onClick={handleCreate}>
							{copy("mailketing.common.create")}
						</Button>
						<Button size="sm" variant="secondary" onClick={() => setCreating(false)}>
							{copy("mailketing.common.cancel")}
						</Button>
					</div>
				</div>
			)}

			{loading ? (
				<p className="text-sm text-kumo-subtle">{copy("mailketing.access.loading")}</p>
			) : data?.items.length === 0 ? (
				<p className="text-sm text-kumo-subtle">{copy("mailketing.access.noRoles")}</p>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full text-sm border-collapse">
						<thead>
							<tr className="border-b border-kumo-border text-left text-xs font-medium uppercase tracking-wider text-kumo-subtle">
								<th className="py-2 pr-4">{copy("mailketing.access.roleSlug")}</th>
								<th className="py-2 pr-4">{copy("mailketing.access.roleLabel")}</th>
								<th className="py-2 pr-4">{copy("mailketing.access.roleDescription")}</th>
								<th className="py-2">{copy("mailketing.access.colActions")}</th>
							</tr>
						</thead>
						<tbody>
							{data?.items.map((role: MailketingRole) => (
								<tr key={role.id} className="border-b border-kumo-border/50">
									{editId === role.id ? (
										<>
											<td className="py-2 pr-4 font-mono text-xs text-kumo-subtle">
												{role.slug}
											</td>
											<td className="py-2 pr-4">
												<input
													className="block w-full rounded border border-kumo-border bg-kumo-background px-2 py-1 text-sm"
													value={editLabel}
													onChange={(e) => setEditLabel(e.target.value)}
												/>
											</td>
											<td className="py-2 pr-4">
												<input
													className="block w-full rounded border border-kumo-border bg-kumo-background px-2 py-1 text-sm"
													value={editDesc}
													onChange={(e) => setEditDesc(e.target.value)}
												/>
											</td>
											<td className="py-2 flex gap-1">
												<Button size="sm" variant="primary" onClick={() => handleUpdate(role.id)}>
													{copy("mailketing.common.save")}
												</Button>
												<Button size="sm" variant="secondary" onClick={() => setEditId(null)}>
													{copy("mailketing.common.cancel")}
												</Button>
											</td>
										</>
									) : (
										<>
											<td className="py-2 pr-4 font-mono text-xs text-kumo-subtle">
												{role.slug}
											</td>
											<td className="py-2 pr-4 text-kumo-foreground">{role.label}</td>
											<td className="py-2 pr-4 text-kumo-subtle">{role.description ?? "—"}</td>
											<td className="py-2 flex gap-1">
												{!role.isSystemRole && (
													<>
														<Button
															size="sm"
															variant="secondary"
															onClick={() => {
																setEditId(role.id);
																setEditLabel(role.label);
																setEditDesc(role.description ?? "");
															}}
														>
															{copy("mailketing.common.edit")}
														</Button>
														<Button
															size="sm"
															variant="destructive"
															onClick={() => handleDelete(role.id)}
														>
															{copy("mailketing.common.delete")}
														</Button>
													</>
												)}
											</td>
										</>
									)}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{data && data.totalPages > 1 && (
				<Pagination
					page={page}
					totalPages={data.totalPages}
					onPrev={() => setPage((p) => Math.max(1, p - 1))}
					onNext={() => setPage((p) => Math.min(data.totalPages, p + 1))}
					copy={copy}
				/>
			)}
		</div>
	);
}

// ── Access — Permissions page ─────────────────────────────────────────────────

function AccessPermissionsPage() {
	const { i18n } = useLingui();
	const copy = getMailketingAdminCopy(i18n.locale);
	const [perms, setPerms] = React.useState<MailketingPermission[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);

	React.useEffect(() => {
		setLoading(true);
		getMailketingPlugin<MailketingPermission[]>({ path: "access/permissions/list" })
			.then(setPerms)
			.catch((e) => setError(e instanceof Error ? e.message : String(e)))
			.finally(() => setLoading(false));
	}, []);

	return (
		<div className="space-y-6">
			<div className="space-y-1">
				<h1 className="text-2xl font-semibold text-kumo-foreground">
					{copy("mailketing.access.permissionsTitle")}
				</h1>
				<p className="text-sm text-kumo-subtle">
					{copy("mailketing.access.permissionsDescription")}
				</p>
			</div>

			{error && <ErrorBanner message={error} />}

			{loading ? (
				<p className="text-sm text-kumo-subtle">{copy("mailketing.access.loading")}</p>
			) : perms.length === 0 ? (
				<p className="text-sm text-kumo-subtle">{copy("mailketing.access.noPermissions")}</p>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full text-sm border-collapse">
						<thead>
							<tr className="border-b border-kumo-border text-left text-xs font-medium uppercase tracking-wider text-kumo-subtle">
								<th className="py-2 pr-4">{copy("mailketing.access.roleSlug")}</th>
								<th className="py-2 pr-4">{copy("mailketing.access.roleLabel")}</th>
								<th className="py-2 pr-4">{copy("mailketing.access.roleDescription")}</th>
								<th className="py-2">Scope</th>
							</tr>
						</thead>
						<tbody>
							{perms.map((p: MailketingPermission) => (
								<tr key={p.id} className="border-b border-kumo-border/50">
									<td className="py-2 pr-4 font-mono text-xs text-kumo-subtle">{p.slug}</td>
									<td className="py-2 pr-4 text-kumo-foreground">{p.label}</td>
									<td className="py-2 pr-4 text-kumo-subtle">{p.description ?? "—"}</td>
									<td className="py-2 text-kumo-subtle">{p.scope}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

// ── Audit Log page ────────────────────────────────────────────────────────────

function AuditLogPage() {
	const { i18n } = useLingui();
	const copy = getMailketingAdminCopy(i18n.locale);

	const [page, setPage] = React.useState(1);
	const [kindFilter, setKindFilter] = React.useState("");
	const [data, setData] = React.useState<MailketingAuditListResponse | null>(null);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);

	const load = React.useCallback(() => {
		setLoading(true);
		postMailketingPlugin<MailketingAuditListResponse>({
			path: "audit/list",
			payload: {
				page,
				pageSize: 20,
				eventKind: kindFilter || undefined,
			},
		})
			.then(setData)
			.catch((e) => setError(e instanceof Error ? e.message : String(e)))
			.finally(() => setLoading(false));
	}, [page, kindFilter]);

	React.useEffect(() => { load(); }, [load]);

	return (
		<div className="space-y-6">
			<div className="space-y-1">
				<h1 className="text-2xl font-semibold text-kumo-foreground">
					{copy("mailketing.audit.title")}
				</h1>
				<p className="text-sm text-kumo-subtle">{copy("mailketing.audit.description")}</p>
			</div>

			<div className="flex flex-wrap gap-3 items-end">
				<div>
					<label className="block text-xs font-medium text-kumo-subtle mb-1">
						{copy("mailketing.audit.filterKind")}
					</label>
					<input
						className="rounded border border-kumo-border bg-kumo-background px-2 py-1.5 text-sm"
						value={kindFilter}
						onChange={(e) => { setKindFilter(e.target.value); setPage(1); }}
						placeholder="e.g. settings.save"
					/>
				</div>
			</div>

			{error && <ErrorBanner message={error} />}

			{loading ? (
				<p className="text-sm text-kumo-subtle">{copy("mailketing.audit.loading")}</p>
			) : data?.items.length === 0 ? (
				<p className="text-sm text-kumo-subtle">{copy("mailketing.audit.noEntries")}</p>
			) : (
				<>
					<div className="overflow-x-auto">
						<table className="w-full text-sm border-collapse">
							<thead>
								<tr className="border-b border-kumo-border text-left text-xs font-medium uppercase tracking-wider text-kumo-subtle">
									<th className="py-2 pr-4">{copy("mailketing.audit.colKind")}</th>
									<th className="py-2 pr-4">{copy("mailketing.audit.colActor")}</th>
									<th className="py-2 pr-4">{copy("mailketing.audit.colSummary")}</th>
									<th className="py-2">{copy("mailketing.audit.colTime")}</th>
								</tr>
							</thead>
							<tbody>
								{data?.items.map((ev: MailketingAuditEvent) => (
									<tr key={ev.id} className="border-b border-kumo-border/50">
										<td className="py-2 pr-4 font-mono text-xs text-kumo-subtle">
											{ev.eventKind}
										</td>
										<td className="py-2 pr-4 text-xs text-kumo-subtle">
											{ev.actorEmail ?? ev.actorId ?? "—"}
										</td>
										<td className="py-2 pr-4 text-kumo-foreground max-w-xs truncate">
											{ev.summary}
										</td>
										<td className="py-2 text-xs text-kumo-subtle whitespace-nowrap">
											{new Date(ev.createdAt).toLocaleString()}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					{data && data.totalPages > 1 && (
						<Pagination
							page={page}
							totalPages={data.totalPages}
							onPrev={() => setPage((p) => Math.max(1, p - 1))}
							onNext={() => setPage((p) => Math.min(data.totalPages, p + 1))}
							copy={copy}
						/>
					)}
				</>
			)}
		</div>
	);
}

// ── Plugin admin exports ──────────────────────────────────────────────────────

const pluginAdminExports: PluginAdminExports = {
	pages: {
		"/overview": <OverviewPage />,
		"/send-log": <SendLogPage />,
		"/settings": <SettingsPage />,
		"/access/users": <AccessUsersPage />,
		"/access/roles": <AccessRolesPage />,
		"/access/permissions": <AccessPermissionsPage />,
		"/audit": <AuditLogPage />,
	},
};

export default pluginAdminExports;
