/**
 * Client controller for the newsletter admin dashboard (Issue #272, ADR-0033).
 * Talks to the ABAC-guarded `/api/v1/newsletter/admin/*` API (the server re-checks
 * every permission; this is a convenience layer only). Renders read-only lists of
 * campaigns, topics, MASKED subscribers, and suppressions. All text nodes are set
 * via `textContent` (never innerHTML), so there is no XSS surface here.
 */
type AdminStrings = {
  loadError: string;
  empty: string;
  campaignsHeading: string;
  topicsHeading: string;
  subscribersHeading: string;
  suppressionHeading: string;
  statusLabel: string;
};

type Campaign = {
  id: string;
  kind: string;
  status: string;
  subject: string;
};
type Topic = { id: string; name: string; topicKey: string; isActive: boolean };
type Subscriber = { id: string; emailMasked: string; state: string };
type Suppression = { id: string; emailMasked: string | null; reason: string };

export function initNewsletterAdmin(root: HTMLElement): void {
  const tenantId = root.dataset.tenantId ?? "";
  const strings: AdminStrings = JSON.parse(root.dataset.strings ?? "{}");
  const bannerEl = root.querySelector<HTMLElement>("[data-newsletter-banner]");

  const clearSkeletons = (): void => {
    root.querySelectorAll("[data-skeleton]").forEach((node) => node.remove());
  };

  const authHeaders = (): Record<string, string> => ({
    "content-type": "application/json",
    "x-awcms-micro-tenant-id": tenantId
  });

  const setError = (message: string): void => {
    if (!bannerEl) return;
    bannerEl.textContent = message;
    bannerEl.setAttribute("data-tone", "error");
  };

  const renderList = <T>(
    selector: string,
    items: readonly T[],
    label: (item: T) => string
  ): void => {
    const listEl = root.querySelector<HTMLElement>(selector);
    if (!listEl) return;
    listEl.textContent = "";
    if (items.length === 0) {
      const li = document.createElement("li");
      li.className = "newsletter-admin__item newsletter-admin__meta";
      li.textContent = strings.empty;
      listEl.appendChild(li);
      return;
    }
    for (const item of items) {
      const li = document.createElement("li");
      li.className = "newsletter-admin__item";
      li.textContent = label(item);
      listEl.appendChild(li);
    }
  };

  const loadJson = async <T>(url: string): Promise<T | null> => {
    try {
      const res = await fetch(url, { headers: authHeaders() });
      if (!res.ok) return null;
      const payload = (await res.json()) as { data?: T };
      return payload.data ?? null;
    } catch {
      return null;
    }
  };

  const load = async (): Promise<void> => {
    const campaigns = await loadJson<{ items: Campaign[] }>(
      "/api/v1/newsletter/admin/campaigns"
    );
    const topics = await loadJson<{ items: Topic[] }>(
      "/api/v1/newsletter/admin/topics"
    );
    const subscribers = await loadJson<{ items: Subscriber[] }>(
      "/api/v1/newsletter/admin/subscribers"
    );
    const suppression = await loadJson<{ items: Suppression[] }>(
      "/api/v1/newsletter/admin/suppression"
    );

    if (!campaigns && !topics && !subscribers && !suppression) {
      clearSkeletons();
      setError(strings.loadError);
      return;
    }

    renderList<Campaign>(
      "[data-campaigns-list]",
      campaigns?.items ?? [],
      (c) => `${c.subject} — ${c.kind} · ${strings.statusLabel}: ${c.status}`
    );
    renderList<Topic>(
      "[data-topics-list]",
      topics?.items ?? [],
      (topic) =>
        `${topic.name} (${topic.topicKey})${topic.isActive ? "" : " · inactive"}`
    );
    renderList<Subscriber>(
      "[data-subscribers-list]",
      subscribers?.items ?? [],
      (s) => `${s.emailMasked} · ${s.state}`
    );
    renderList<Suppression>(
      "[data-suppression-list]",
      suppression?.items ?? [],
      (s) => `${s.emailMasked ?? "***"} · ${s.reason}`
    );
  };

  void load();
}
