/**
 * Client controller for the admin moderation queue (Issue #271, ADR-0032). Talks
 * to the ABAC-guarded `/api/v1/comments/admin/*` API (server re-checks every
 * permission; this is a convenience layer only). Comment bodies in the queue are
 * shown as PLAIN TEXT via `textContent` (moderators see the raw text, never
 * rendered HTML), so there is no XSS surface here either.
 */
type AdminStrings = {
  loadError: string;
  reasonPrompt: string;
  actionError: string;
  empty: string;
  approve: string;
  reject: string;
  spam: string;
  archive: string;
  restore: string;
  reports: string;
  statusLabel: string;
};

type QueueItem = {
  id: string;
  resourceType: string;
  resourceUrl: string;
  bodyText: string;
  status: string;
  authorDisplayName: string | null;
  authorEmailMasked: string | null;
  moderationReasonCode: string | null;
  reportCount: number;
  createdAt: string;
};

function uuid(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function initCommentsAdmin(root: HTMLElement): void {
  const tenantId = root.dataset.tenantId ?? "";
  const strings: AdminStrings = JSON.parse(root.dataset.strings ?? "{}");
  const listEl = root.querySelector<HTMLElement>("[data-queue-list]");
  const statusFilter = root.querySelector<HTMLSelectElement>(
    "[data-queue-status]"
  );
  const emptyEl = root.querySelector<HTMLElement>("[data-queue-empty]");
  const bannerEl = root.querySelector<HTMLElement>("[data-queue-banner]");
  if (!listEl) return;

  const authHeaders = (): Record<string, string> => ({
    "content-type": "application/json",
    "x-awcms-micro-tenant-id": tenantId
  });

  const setBanner = (message: string, tone: "error" | "success") => {
    if (!bannerEl) return;
    bannerEl.textContent = message;
    bannerEl.setAttribute("data-tone", tone);
  };

  const moderate = async (
    id: string,
    endpoint: string,
    payload: Record<string, unknown>
  ): Promise<void> => {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { ...authHeaders(), "idempotency-key": uuid() },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        setBanner(strings.actionError, "error");
        return;
      }
      await load();
    } catch {
      setBanner(strings.actionError, "error");
    }
  };

  const actionButton = (
    label: string,
    onClick: () => void
  ): HTMLButtonElement => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "comments-admin__action";
    btn.textContent = label;
    btn.addEventListener("click", onClick);
    return btn;
  };

  const renderItem = (item: QueueItem): HTMLElement => {
    const li = document.createElement("li");
    li.className = "comments-admin__item";

    const meta = document.createElement("div");
    meta.className = "comments-admin__meta";
    meta.textContent = [
      item.authorDisplayName || "—",
      item.authorEmailMasked || "",
      `${strings.statusLabel}: ${item.status}`,
      item.reportCount > 0 ? `${strings.reports}: ${item.reportCount}` : ""
    ]
      .filter(Boolean)
      .join("  ·  ");

    const body = document.createElement("p");
    body.className = "comments-admin__body";
    body.textContent = item.bodyText; // plain text — never rendered HTML

    const actions = document.createElement("div");
    actions.className = "comments-admin__actions";
    const moderateUrl = `/api/v1/comments/admin/${encodeURIComponent(item.id)}/moderate`;

    if (
      item.status === "pending" ||
      item.status === "rejected" ||
      item.status === "spam"
    ) {
      actions.append(
        actionButton(
          strings.approve,
          () => void moderate(item.id, moderateUrl, { decision: "approve" })
        )
      );
    }
    if (item.status === "pending" || item.status === "approved") {
      actions.append(
        actionButton(strings.reject, () => {
          const reason = window.prompt(strings.reasonPrompt);
          if (reason)
            void moderate(item.id, moderateUrl, {
              decision: "reject",
              reasonCode: reason
            });
        }),
        actionButton(strings.spam, () => {
          const reason = window.prompt(strings.reasonPrompt);
          if (reason)
            void moderate(item.id, moderateUrl, {
              decision: "spam",
              reasonCode: reason
            });
        })
      );
    }
    if (item.status === "approved") {
      actions.append(
        actionButton(
          strings.archive,
          () =>
            void moderate(
              item.id,
              `/api/v1/comments/admin/${encodeURIComponent(item.id)}/archive`,
              {}
            )
        )
      );
    }
    if (item.status === "rejected" || item.status === "spam") {
      actions.append(
        actionButton(
          strings.restore,
          () =>
            void moderate(
              item.id,
              `/api/v1/comments/admin/${encodeURIComponent(item.id)}/restore`,
              {}
            )
        )
      );
    }

    li.append(meta, body, actions);
    return li;
  };

  const load = async (): Promise<void> => {
    const params = new URLSearchParams();
    const status = statusFilter?.value;
    if (status) params.set("status", status);
    try {
      const res = await fetch(
        `/api/v1/comments/admin/queue?${params.toString()}`,
        {
          headers: authHeaders()
        }
      );
      if (!res.ok) {
        setBanner(strings.loadError, "error");
        return;
      }
      const json = await res.json();
      const items: QueueItem[] = json?.data?.items ?? [];
      listEl.textContent = "";
      for (const item of items) listEl.append(renderItem(item));
      if (emptyEl) emptyEl.hidden = items.length > 0;
    } catch {
      setBanner(strings.loadError, "error");
    }
  };

  statusFilter?.addEventListener("change", () => void load());
  void load();
}
