/**
 * Client-side controller for the public comments island (Issue #271, ADR-0032).
 * Talks ONLY to the public `/api/v1/comments` JSON API. Comment bodies are
 * assigned from the server's PRE-ESCAPED `bodyHtml` (never built from raw text on
 * the client), so there is no client-side XSS surface. Sends a fresh
 * `Idempotency-Key` per submission and echoes the render-time timing token +
 * honeypot for anti-abuse.
 */
type Strings = {
  submitting: string;
  submitError: string;
  loadError: string;
  awaitingModeration: string;
  empty: string;
  reply: string;
  report: string;
  reportPrompt: string;
  reported: string;
};

type PublicComment = {
  id: string;
  parentId: string | null;
  depth: number;
  bodyHtml: string;
  authorDisplayName: string | null;
  authorKind: string;
  createdAt: string;
  editedAt: string | null;
};

function uuid(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function initCommentsSection(root: HTMLElement): void {
  const resourceType = root.dataset.resourceType ?? "";
  const resourceId = root.dataset.resourceId ?? "";
  const locale = root.dataset.locale ?? "";
  const timingToken = root.dataset.timingToken ?? "";
  const strings: Strings = JSON.parse(root.dataset.strings ?? "{}");

  const listEl = root.querySelector<HTMLElement>("[data-comments-list]");
  const emptyEl = root.querySelector<HTMLElement>("[data-comments-empty]");
  const moreBtn = root.querySelector<HTMLButtonElement>("[data-comments-more]");
  const form = root.querySelector<HTMLFormElement>("[data-comments-form]");
  const statusEl = root.querySelector<HTMLElement>("[data-comments-status]");
  const parentInput = root.querySelector<HTMLInputElement>(
    "[data-comments-parent]"
  );
  if (!listEl || !form || !statusEl) return;

  let cursor: string | null = null;

  const setStatus = (message: string, tone: "error" | "success" | "") => {
    statusEl.textContent = message;
    if (tone) statusEl.setAttribute("data-tone", tone);
    else statusEl.removeAttribute("data-tone");
  };

  const renderComment = (comment: PublicComment): HTMLElement => {
    const li = document.createElement("li");
    li.className = "comments-comment";
    li.dataset.commentId = comment.id;

    const meta = document.createElement("div");
    meta.className = "comments-comment__meta";
    const name = document.createElement("span");
    name.textContent = comment.authorDisplayName || "—";
    const time = document.createElement("time");
    time.dateTime = comment.createdAt;
    time.textContent = new Date(comment.createdAt).toLocaleString();
    meta.append(name, time);

    const bodyEl = document.createElement("div");
    bodyEl.className = "comments-comment__body";
    // Server-escaped safe HTML (only fixed <a>/<br> tags) — never raw text.
    bodyEl.innerHTML = comment.bodyHtml;

    const actions = document.createElement("div");
    actions.className = "comments-comment__actions";
    const replyBtn = document.createElement("button");
    replyBtn.type = "button";
    replyBtn.textContent = strings.reply;
    replyBtn.addEventListener("click", () => {
      if (parentInput) parentInput.value = comment.id;
      form.querySelector<HTMLTextAreaElement>("[name=body]")?.focus();
    });
    const reportBtn = document.createElement("button");
    reportBtn.type = "button";
    reportBtn.textContent = strings.report;
    reportBtn.addEventListener("click", () => {
      void reportComment(comment.id);
    });
    actions.append(replyBtn, reportBtn);

    li.append(meta, bodyEl, actions);
    return li;
  };

  const reportComment = async (commentId: string): Promise<void> => {
    if (!window.confirm(strings.reportPrompt)) return;
    try {
      await fetch(`/api/v1/comments/${encodeURIComponent(commentId)}/report`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reason: "other" })
      });
      setStatus(strings.reported, "success");
    } catch {
      setStatus(strings.submitError, "error");
    }
  };

  const loadList = async (append: boolean): Promise<void> => {
    const params = new URLSearchParams({ resourceType, resourceId });
    if (locale) params.set("locale", locale);
    if (append && cursor) params.set("cursor", cursor);
    try {
      const res = await fetch(`/api/v1/comments?${params.toString()}`, {
        headers: { accept: "application/json" }
      });
      const json = await res.json();
      const items: PublicComment[] = json?.data?.items ?? [];
      cursor = json?.data?.nextCursor ?? null;
      if (!append)
        listEl.querySelectorAll("[data-comment-id]").forEach((n) => n.remove());
      for (const comment of items) listEl.append(renderComment(comment));
      if (emptyEl)
        emptyEl.hidden = listEl.querySelector("[data-comment-id]") !== null;
      if (moreBtn) moreBtn.hidden = cursor === null;
    } catch {
      setStatus(strings.loadError, "error");
    }
  };

  moreBtn?.addEventListener("click", () => void loadList(true));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const submitBtn = form.querySelector<HTMLButtonElement>("[type=submit]");
    if (submitBtn) submitBtn.disabled = true;
    setStatus(strings.submitting, "");

    const parentId = (parentInput?.value || "").trim() || null;
    const payload = {
      resourceType,
      resourceId,
      locale: locale || undefined,
      body: String(data.get("body") ?? ""),
      authorDisplayName: String(data.get("authorDisplayName") ?? "") || null,
      authorEmail: String(data.get("authorEmail") ?? "") || null,
      subscribeToReplies: data.get("subscribeToReplies") === "1",
      website: String(data.get("website") ?? ""),
      timingToken,
      parentId
    };

    const url = parentId
      ? `/api/v1/comments/${encodeURIComponent(parentId)}/replies`
      : "/api/v1/comments";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "idempotency-key": uuid()
        },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      const status = json?.data?.status;
      if (status === "approved") {
        form.reset();
        if (parentInput) parentInput.value = "";
        await loadList(false);
        setStatus("", "");
      } else {
        // pending / received — held for moderation (or neutral). Same message.
        form.reset();
        if (parentInput) parentInput.value = "";
        setStatus(strings.awaitingModeration, "success");
      }
    } catch {
      setStatus(strings.submitError, "error");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  void loadList(false);
}
