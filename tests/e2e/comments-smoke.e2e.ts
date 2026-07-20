/**
 * E2E smoke spec (Playwright + Bun, skill `awcms-micro-browser-test`) — Issue
 * #271 (ADR-0032). Exercises the PUBLIC comment surfaces against a running
 * dev/preview server + real Postgres: submit → pending (invisible) → approve →
 * appears in the public list (escaped), plus the `/comments/demo` reference page.
 *
 * Pure HTTP via Bun's native `fetch` — deliberately NOT Playwright's `request`
 * fixture, which crashes under `bun --bun playwright test` on any `Set-Cookie`
 * response ([[awcms-micro-e2e-not-in-check]]); `fetch` needs an ABSOLUTE URL
 * resolved against `use.baseURL`. The moderation APPROVE step is applied directly
 * via SQL (the admin moderation API + ABAC is covered by integration tests) so
 * the spec stays hermetic without wiring a full authenticated moderator session.
 *
 * Requires:
 *   - `E2E_SEED_DATABASE_URL` — privileged Postgres role: seeds a tenant, a
 *     published blog post (the commentable resource), a comment-settings row with
 *     the timing floor disabled, and points `awcms_micro_setup_state` at the
 *     tenant so localhost's default resolution serves it.
 *   - The server under `E2E_BASE_URL` (default `http://localhost:4321`) against
 *     the SAME database.
 *
 * Run: build + start the server (with DATABASE_URL), then
 * `bun run test:e2e tests/e2e/comments-smoke.e2e.ts`.
 */
import { test, expect } from "@playwright/test";

const SEED_URL = process.env.E2E_SEED_DATABASE_URL ?? "";

test.describe.configure({ mode: "serial" });

let seededTenantId = "";
let seededPostId = "";

test.beforeAll(async () => {
  if (SEED_URL.length === 0) {
    throw new Error(
      "E2E_SEED_DATABASE_URL must be set for the comments smoke spec."
    );
  }
  const unique = crypto.randomUUID().slice(0, 12);
  const code = `cm-e2e-${unique}`;
  const sql = new Bun.SQL(SEED_URL);
  try {
    const tenantRows = await sql`
      INSERT INTO awcms_micro_tenants
        (tenant_code, tenant_name, legal_name, status, default_locale, default_theme)
      VALUES (${code}, 'Comments E2E', 'CM E2E Legal', 'active', 'en', 'light')
      RETURNING id
    `;
    seededTenantId = tenantRows[0]!.id as string;

    const postRows = await sql`
      INSERT INTO awcms_micro_blog_posts
        (tenant_id, author_tenant_user_id, title, slug, content_json, content_text,
         status, visibility, locale, published_at, created_at, updated_at)
      VALUES (${seededTenantId}, ${crypto.randomUUID()}, 'E2E Commentable Post',
        'e2e-commentable', '{}'::jsonb, 'body', 'published', 'public', 'en',
        now(), now(), now())
      RETURNING id
    `;
    seededPostId = postRows[0]!.id as string;

    // Disable the submit-timing floor so a token-less HTTP submit is accepted.
    await sql`
      INSERT INTO awcms_micro_comments_settings
        (tenant_id, default_policy_mode, require_moderation, allow_anonymous, min_submit_seconds)
      VALUES (${seededTenantId}, 'moderated-anonymous', true, true, 0)
      ON CONFLICT (tenant_id) DO UPDATE SET min_submit_seconds = 0
    `;

    // No `awcms_micro_tenant_modules` row is needed: with no explicit row the
    // module resolves as enabled (`fetchTenantModuleEntry` → `tenantEnabled:
    // row?.enabled ?? true`), and the settings row above keeps the policy active.

    await sql`
      INSERT INTO awcms_micro_setup_state (id, tenant_id, locked_at)
      VALUES (true, ${seededTenantId}, now())
      ON CONFLICT (id) DO UPDATE SET tenant_id = EXCLUDED.tenant_id
    `;
  } finally {
    await sql.end();
  }
});

test.afterAll(async () => {
  if (SEED_URL.length === 0 || seededTenantId === "") return;
  const sql = new Bun.SQL(SEED_URL);
  try {
    await sql`
      UPDATE awcms_micro_setup_state SET tenant_id = NULL
      WHERE id = true AND tenant_id = ${seededTenantId}
    `;
  } finally {
    await sql.end();
  }
});

function url(path: string, baseURL: string | undefined): string {
  return new URL(path, baseURL).toString();
}

test.describe("comments public smoke (#271)", () => {
  test("submitting a comment starts it PENDING (not publicly visible)", async ({
    baseURL
  }) => {
    const res = await fetch(url("/api/v1/comments", baseURL), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "idempotency-key": crypto.randomUUID()
      },
      body: JSON.stringify({
        resourceType: "blog_post",
        resourceId: seededPostId,
        locale: "en",
        body: "Hello from <b>E2E</b> — https://example.com",
        authorDisplayName: "E2E Visitor",
        website: ""
      })
    });
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      success?: boolean;
      data?: { status: string; commentId?: string };
      status?: string;
    };
    // moderated-anonymous → accepted-but-pending returns the SAME neutral
    // "received" ack as a block/unresolved case, so the response is not an
    // oracle (security audit M1). The comment is pending INTERNALLY, verified by
    // the empty public list below + the approve step in the next test.
    expect(json.data?.status ?? json.status).toBe("received");
    expect(json.data?.commentId).toBeUndefined();

    // Not shown in the public list while pending.
    const list = await fetch(
      url(
        `/api/v1/comments?resourceType=blog_post&resourceId=${seededPostId}&locale=en`,
        baseURL
      )
    );
    const listJson = (await list.json()) as { data: { items: unknown[] } };
    expect(listJson.data.items).toHaveLength(0);
  });

  test("after moderation approve, the comment appears with ESCAPED body", async ({
    baseURL
  }) => {
    // Approve directly (admin API + ABAC covered by integration tests).
    const sql = new Bun.SQL(SEED_URL);
    try {
      // The neutral submit ack no longer returns the id (oracle-free, M1), so
      // resolve the pending comment the moderator would act on directly.
      const rows = await sql`
        SELECT id FROM awcms_micro_comments_comments
        WHERE tenant_id = ${seededTenantId} AND status = 'pending'
        ORDER BY created_at DESC
        LIMIT 1
      `;
      const commentId = (rows[0] as { id: string }).id;
      await sql`
        UPDATE awcms_micro_comments_comments
        SET status = 'approved', published_at = now()
        WHERE id = ${commentId} AND tenant_id = ${seededTenantId}
      `;
    } finally {
      await sql.end();
    }

    const list = await fetch(
      url(
        `/api/v1/comments?resourceType=blog_post&resourceId=${seededPostId}&locale=en`,
        baseURL
      )
    );
    expect(list.status).toBe(200);
    const json = (await list.json()) as {
      success: boolean;
      data: { items: { bodyHtml: string; authorDisplayName: string }[] };
    };
    expect(json.data.items.length).toBeGreaterThan(0);
    const item = json.data.items[0]!;
    // No stored HTML — the <b> is escaped; the safe autolink is present.
    expect(item.bodyHtml).toContain("&lt;b&gt;");
    expect(item.bodyHtml).not.toContain("<b>");
    expect(item.bodyHtml).toContain('rel="nofollow ugc noopener noreferrer"');
    expect(item.authorDisplayName).toBe("E2E Visitor");
  });

  test("a submission against a NON-existent resource returns a neutral ack", async ({
    baseURL
  }) => {
    const res = await fetch(url("/api/v1/comments", baseURL), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "idempotency-key": crypto.randomUUID()
      },
      body: JSON.stringify({
        resourceType: "blog_post",
        resourceId: crypto.randomUUID(),
        locale: "en",
        body: "should never be stored",
        website: ""
      })
    });
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      data?: { status?: string };
      status?: string;
    };
    // Neutral: indistinguishable "received" — no existence oracle.
    const status = json.data?.status ?? json.status;
    expect(status).toBe("received");
  });

  test("the /comments/demo reference page renders the comments island", async ({
    baseURL
  }) => {
    const res = await fetch(
      url(
        `/comments/demo?resourceType=blog_post&resourceId=${seededPostId}&locale=en`,
        baseURL
      )
    );
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain("data-comments");
    expect(body).toContain(seededPostId);
    // The demo page is non-indexable.
    expect(body).toContain('content="noindex');
  });
});
