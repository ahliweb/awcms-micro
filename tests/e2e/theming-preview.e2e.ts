/**
 * E2E smoke spec (Playwright + Bun) — Issue #269, ADR-0029. Exercises the
 * `theming` module end-to-end against a running dev/preview server + real
 * Postgres, through the real middleware + route pipeline:
 *
 *  - the public token stylesheet (`/theming/tokens.css`) reflects the tenant's
 *    PUBLISHED theme tokens, served as external `text/css` (CSP-safe);
 *  - the preview page (`/theming/preview/{token}`) renders the DRAFT, is
 *    `noindex` + `private, no-store` (non-indexable + not publicly cacheable),
 *    and the preview token CSS is served from a distinct namespace;
 *  - an invalid/expired preview token 404s;
 *  - axe-core finds no critical/serious a11y violations on the rendered theme
 *    (contrast, landmarks, headings, keyboard/focus).
 *
 * State is created through the REAL admin API via Bun's native `fetch` (NOT
 * Playwright's `request`/APIRequestContext fixture, which crashes under
 * `bun --bun playwright test` on any `Set-Cookie` response — see
 * tests/e2e/seo-discovery-smoke.e2e.ts). Only the a11y test drives a browser.
 *
 * Requires:
 *   - `E2E_SEED_DATABASE_URL` — the PRIVILEGED (superuser) Postgres role, to seed
 *     a tenant/owner and point `awcms_micro_setup_state` at it so localhost
 *     resolves to that tenant.
 *   - The dev/preview server under `E2E_BASE_URL` (default http://localhost:4321)
 *     on the SAME database.
 *
 * Run: build + boot the server, then
 * `bun run test:e2e tests/e2e/theming-preview.e2e.ts`.
 */
import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

import { seedOwnerTenant } from "./helpers/seed-owner-tenant";
import {
  acquireSetupStateOwnership,
  type SetupStateOwnership
} from "./helpers/setup-state-ownership";

const SEED_URL = process.env.E2E_SEED_DATABASE_URL ?? "";
const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:4321";
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"];
const FAILING_IMPACTS = new Set(["critical", "serious"]);

test.describe.configure({ mode: "serial" });

// Distinct, AA-contrast primaries: white text on either meets WCAG AA (the
// preview a11y test renders the DRAFT, so its primary must keep contrast).
const PUBLISHED_COLOR = "#b91c5c";
const DRAFT_COLOR = "#1d4ed8";

let tenantId = "";
let token = "";
let previewUrl = "";
let priorSetupTenant: string | null = null;
// Held for the file's lifetime so no sibling spec repoints the shared
// `awcms_micro_setup_state` singleton between our seed and our HTTP assertions.
let setupStateOwnership: SetupStateOwnership | null = null;

function draftBody(color: string) {
  return {
    themeKey: "aria",
    tokenOverrides: { color_primary: color },
    slotSelections: { header: "centered" },
    sectionOrder: ["hero", "cta"],
    navPlacement: "top"
  };
}

test.beforeAll(async () => {
  if (SEED_URL.length === 0) {
    throw new Error(
      "E2E_SEED_DATABASE_URL must be set for the theming smoke spec."
    );
  }
  setupStateOwnership = await acquireSetupStateOwnership(SEED_URL);
  const code = `th-e2e-${crypto.randomUUID().slice(0, 12)}`;
  const owner = await seedOwnerTenant(SEED_URL, code);
  tenantId = owner.tenantId;

  // Point the setup-state singleton at this tenant so localhost resolves to it
  // (public token CSS resolves tenant by host → falls back to setup_state).
  const sql = new Bun.SQL(SEED_URL);
  try {
    const existing =
      (await sql`SELECT tenant_id FROM awcms_micro_setup_state WHERE id = true`) as {
        tenant_id: string | null;
      }[];
    priorSetupTenant = existing[0]?.tenant_id ?? null;
    await sql`
      INSERT INTO awcms_micro_setup_state (id, tenant_id, locked_at)
      VALUES (true, ${tenantId}, now())
      ON CONFLICT (id) DO UPDATE SET tenant_id = ${tenantId}
    `;
  } finally {
    await sql.end();
  }

  // Log in (owner has every permission, incl. theming.*).
  const login = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-awcms-micro-tenant-id": tenantId
    },
    body: JSON.stringify({
      loginIdentifier: owner.loginIdentifier,
      password: owner.password
    })
  });
  expect(login.status).toBe(200);
  token = ((await login.json()) as { data: { token: string } }).data.token;

  const authHeaders = (extra: Record<string, string> = {}) => ({
    "content-type": "application/json",
    "x-awcms-micro-tenant-id": tenantId,
    authorization: `Bearer ${token}`,
    ...extra
  });

  // Save + publish a draft (PUBLISHED_COLOR), then save a NEW draft (DRAFT_COLOR)
  // so preview and published are visibly different.
  const put1 = await fetch(`${BASE_URL}/api/v1/theming/draft`, {
    method: "PUT",
    headers: authHeaders({ "idempotency-key": "e2e-d1" }),
    body: JSON.stringify(draftBody(PUBLISHED_COLOR))
  });
  expect(put1.status).toBe(200);
  const pub = await fetch(`${BASE_URL}/api/v1/theming/publish`, {
    method: "POST",
    headers: authHeaders({ "idempotency-key": "e2e-p1" })
  });
  expect(pub.status).toBe(200);

  const put2 = await fetch(`${BASE_URL}/api/v1/theming/draft`, {
    method: "PUT",
    headers: authHeaders({ "idempotency-key": "e2e-d2" }),
    body: JSON.stringify(draftBody(DRAFT_COLOR))
  });
  expect(put2.status).toBe(200);

  const preview = await fetch(`${BASE_URL}/api/v1/theming/preview`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ ttlMinutes: 60 })
  });
  expect(preview.status).toBe(200);
  previewUrl = ((await preview.json()) as { data: { previewUrl: string } }).data
    .previewUrl;
  expect(previewUrl).toContain("/theming/preview/");
});

test.afterAll(async () => {
  try {
    const sql = new Bun.SQL(SEED_URL);
    try {
      // Restore the setup-state singleton so we don't strand a dev database.
      await sql`UPDATE awcms_micro_setup_state SET tenant_id = ${priorSetupTenant} WHERE id = true`;
      if (tenantId) {
        await sql`DELETE FROM awcms_micro_theming_preview_sessions WHERE tenant_id = ${tenantId}`;
      }
    } finally {
      await sql.end();
    }
  } finally {
    // Release LAST so the lock is freed for the next setup_state-owning spec.
    await setupStateOwnership?.release();
    setupStateOwnership = null;
  }
});

test("public /theming/tokens.css serves the PUBLISHED tokens as external text/css", async () => {
  const res = await fetch(`${BASE_URL}/theming/tokens.css`);
  expect(res.status).toBe(200);
  expect(res.headers.get("content-type") ?? "").toContain("text/css");
  const body = await res.text();
  expect(body).toContain(`--awcms-theme-color_primary: ${PUBLISHED_COLOR};`);
  // Public asset is cacheable (not no-store).
  expect(res.headers.get("cache-control") ?? "").toContain("public");
});

test("preview page is non-indexable and not publicly cacheable, and renders the theme", async () => {
  const res = await fetch(`${BASE_URL}${previewUrl}`, { redirect: "manual" });
  expect(res.status).toBe(200);
  expect((res.headers.get("x-robots-tag") ?? "").toLowerCase()).toContain(
    "noindex"
  );
  expect((res.headers.get("cache-control") ?? "").toLowerCase()).toContain(
    "no-store"
  );
  const html = await res.text();
  expect(html.toLowerCase()).toContain("preview");
  expect(html).toContain('rel="stylesheet"');
});

test("preview token CSS reflects the DRAFT and is no-store (isolated from public cache)", async () => {
  const urlToken = previewUrl.replace("/theming/preview/", "");
  const res = await fetch(`${BASE_URL}/theming/preview-tokens/${urlToken}.css`);
  expect(res.status).toBe(200);
  expect((res.headers.get("cache-control") ?? "").toLowerCase()).toContain(
    "no-store"
  );
  const body = await res.text();
  expect(body).toContain(`--awcms-theme-color_primary: ${DRAFT_COLOR};`);
});

test("an invalid preview token 404s (no leak of whether it merely expired)", async () => {
  const res = await fetch(
    `${BASE_URL}/theming/preview/${tenantId}~${"0".repeat(64)}`,
    {
      redirect: "manual"
    }
  );
  expect(res.status).toBe(404);
  expect((res.headers.get("x-robots-tag") ?? "").toLowerCase()).toContain(
    "noindex"
  );
});

async function assertNoSeriousViolations(
  page: Page,
  label: string
): Promise<void> {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  const serious = results.violations.filter(
    (v) => v.impact && FAILING_IMPACTS.has(v.impact)
  );
  if (serious.length > 0) {
    const summary = serious
      .map(
        (v) => `${v.id} (${v.impact}): ${v.nodes.length} node(s) — ${v.help}`
      )
      .join("\n");
    throw new Error(
      `${label}: ${serious.length} critical/serious a11y violation(s):\n${summary}`
    );
  }
}

test("rendered theme preview has no critical/serious a11y violations (axe, WCAG 2.2 AA)", async ({
  page
}) => {
  await page.goto(previewUrl);
  await page.waitForSelector("main#main");
  await assertNoSeriousViolations(page, "theming preview");
});
