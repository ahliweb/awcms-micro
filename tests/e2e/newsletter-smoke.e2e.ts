/**
 * E2E smoke spec (Playwright + Bun, skill `awcms-micro-browser-test`) — Issue
 * #272 (ADR-0033). Exercises the PUBLIC, ANTI-ENUMERATION newsletter surfaces
 * against a running dev/preview server + real Postgres: subscribe → confirm →
 * fake-provider forgery rejected → unsubscribe → suppressed resend returns the
 * IDENTICAL generic body, plus the `/newsletter/demo` reference page.
 *
 * Pure HTTP via Bun's native `fetch` — deliberately NOT Playwright's `request`
 * fixture (crashes under `bun --bun playwright test` on `Set-Cookie`,
 * [[awcms-micro-e2e-not-in-check]]); `fetch` needs an ABSOLUTE URL resolved
 * against `use.baseURL`. Confirm/unsubscribe tokens are seeded directly via SQL
 * (the HTTP subscribe endpoint never returns a token — the email path does), so
 * the spec stays hermetic; token SEEDS are idempotent and survive a retry.
 *
 * Requires:
 *   - `E2E_SEED_DATABASE_URL` — privileged Postgres role: seeds a tenant, a
 *     pending subscriber + confirm/unsubscribe tokens, and points
 *     `awcms_micro_setup_state` at the tenant so localhost's default resolution
 *     serves it.
 *   - The server under `E2E_BASE_URL` (default `http://localhost:4321`) against
 *     the SAME database.
 */
import { test, expect } from "@playwright/test";

import { deriveSubscriberEmailParts } from "../../src/modules/newsletter/domain/subscriber-identity";
import { hashToken } from "../../src/modules/newsletter/domain/newsletter-token";

const SEED_URL = process.env.E2E_SEED_DATABASE_URL ?? "";
const EMAIL = "newsletter-e2e@example.com";
const CONFIRM_TOKEN = "e2e-confirm-token-fixed";
const UNSUB_TOKEN = "e2e-unsub-token-fixed";

test.describe.configure({ mode: "serial" });

let seededTenantId = "";

test.beforeAll(async () => {
  if (SEED_URL.length === 0) {
    throw new Error(
      "E2E_SEED_DATABASE_URL must be set for the newsletter smoke spec."
    );
  }
  const unique = crypto.randomUUID().slice(0, 12);
  const code = `nl-e2e-${unique}`;
  const parts = deriveSubscriberEmailParts(EMAIL);
  const sql = new Bun.SQL(SEED_URL);
  try {
    const tenantRows = await sql`
      INSERT INTO awcms_micro_tenants
        (tenant_code, tenant_name, legal_name, status, default_locale, default_theme)
      VALUES (${code}, 'Newsletter E2E', 'NL E2E Legal', 'active', 'en', 'light')
      RETURNING id
    `;
    seededTenantId = tenantRows[0]!.id as string;

    // Pending subscriber + fixed confirm/unsubscribe tokens (idempotent seeds).
    const subRows = await sql`
      INSERT INTO awcms_micro_newsletter_subscribers
        (tenant_id, email_hash, email_masked, email_encrypted, locale, state)
      VALUES (${seededTenantId}, ${parts.hash}, ${parts.masked}, 'unresolvable', 'en', 'pending')
      ON CONFLICT (tenant_id, email_hash) DO UPDATE SET state = 'pending'
      RETURNING id
    `;
    const subscriberId = subRows[0]!.id as string;
    // Reset consumed_at + refresh expiry on conflict so a Playwright retry
    // re-arms a token this worker may already have consumed (the confirm/unsub
    // consume is single-use); DO NOTHING would leave it spent and the retry
    // would fail even though the seed claims to survive one.
    await sql`
      INSERT INTO awcms_micro_newsletter_tokens
        (tenant_id, subscriber_id, token_hash, purpose, expires_at)
      VALUES (${seededTenantId}, ${subscriberId}, ${hashToken(CONFIRM_TOKEN)}, 'confirm', now() + interval '1 day')
      ON CONFLICT (token_hash) DO UPDATE SET consumed_at = NULL, expires_at = now() + interval '1 day'
    `;
    await sql`
      INSERT INTO awcms_micro_newsletter_tokens
        (tenant_id, subscriber_id, token_hash, purpose, expires_at)
      VALUES (${seededTenantId}, ${subscriberId}, ${hashToken(UNSUB_TOKEN)}, 'unsubscribe', now() + interval '30 days')
      ON CONFLICT (token_hash) DO UPDATE SET consumed_at = NULL, expires_at = now() + interval '30 days'
    `;

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

async function subscribeBody(baseURL: string | undefined): Promise<string> {
  const res = await fetch(url("/api/v1/newsletter/subscribe", baseURL), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: EMAIL })
  });
  expect(res.status).toBe(200);
  return res.text();
}

test.describe("newsletter public smoke (#272)", () => {
  test("subscribe returns the generic accepted acknowledgement", async ({
    baseURL
  }) => {
    const body = await subscribeBody(baseURL);
    const json = JSON.parse(body) as { data?: { status?: string } };
    expect(json.data?.status).toBe("accepted");
  });

  test("confirm transitions the subscriber to subscribed", async ({
    baseURL
  }) => {
    const res = await fetch(url("/api/v1/newsletter/confirm", baseURL), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: CONFIRM_TOKEN })
    });
    expect(res.status).toBe(200);

    const sql = new Bun.SQL(SEED_URL);
    try {
      const parts = deriveSubscriberEmailParts(EMAIL);
      const rows = await sql`
        SELECT state FROM awcms_micro_newsletter_subscribers
        WHERE tenant_id = ${seededTenantId} AND email_hash = ${parts.hash}
      `;
      expect((rows[0] as { state: string }).state).toBe("subscribed");
    } finally {
      await sql.end();
    }
  });

  test("a forged provider callback is rejected (bad signature)", async ({
    baseURL
  }) => {
    const res = await fetch(
      url("/api/v1/newsletter/provider-callback", baseURL),
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-newsletter-signature": "forged"
        },
        body: JSON.stringify({ provider: "acme", eventType: "delivered" })
      }
    );
    expect(res.status).toBe(400);
  });

  test("unsubscribe suppresses the address", async ({ baseURL }) => {
    const res = await fetch(url("/api/v1/newsletter/unsubscribe", baseURL), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: UNSUB_TOKEN })
    });
    expect(res.status).toBe(200);

    const sql = new Bun.SQL(SEED_URL);
    try {
      const parts = deriveSubscriberEmailParts(EMAIL);
      const sub = await sql`
        SELECT state FROM awcms_micro_newsletter_subscribers
        WHERE tenant_id = ${seededTenantId} AND email_hash = ${parts.hash}
      `;
      expect((sub[0] as { state: string }).state).toBe("unsubscribed");
      const supp = await sql`
        SELECT reason FROM awcms_micro_newsletter_suppressions
        WHERE tenant_id = ${seededTenantId} AND email_hash = ${parts.hash}
      `;
      expect((supp[0] as { reason: string }).reason).toBe("unsubscribe");
    } finally {
      await sql.end();
    }
  });

  test("a suppressed resend returns the IDENTICAL generic body (anti-enumeration)", async ({
    baseURL
  }) => {
    // A never-seen address and the now-suppressed address must be byte-identical
    // EXCEPT for the per-request `meta.correlationId` that every API response
    // carries by design — normalize it out so this asserts the anti-enumeration
    // property, not correlation-id uniqueness.
    const stripCorrelationId = (body: string): string =>
      body.replace(/"correlationId":"[^"]*"/, '"correlationId":"<normalized>"');
    const suppressed = await subscribeBody(baseURL);
    const fresh = await fetch(url("/api/v1/newsletter/subscribe", baseURL), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: `fresh-${crypto.randomUUID()}@example.com`
      })
    }).then((r) => r.text());
    expect(stripCorrelationId(suppressed)).toBe(stripCorrelationId(fresh));
  });

  test("the /newsletter/demo reference page renders", async ({ baseURL }) => {
    const res = await fetch(url("/newsletter/demo", baseURL));
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html.toLowerCase()).toContain("newsletter");
  });
});
