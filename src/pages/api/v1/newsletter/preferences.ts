import type { APIRoute } from "astro";

import { getDatabaseClient } from "../../../../lib/database/client";
import {
  checkRateLimit,
  resolveClientIp
} from "../../../../lib/security/rate-limit";
import {
  bodyTooLargeResponse,
  readJsonBody
} from "../../../../lib/security/request-body-limit";
import { fail, ok } from "../../../../modules/_shared/api-response";
import {
  GENERIC_ACCEPTED,
  GENERIC_PREFERENCES_EMPTY
} from "../../../../modules/newsletter/domain/generic-response";
import {
  getPreferences,
  updatePreferences
} from "../../../../modules/newsletter/application/subscriber-service";
import { withNewsletterTenant } from "../../../../modules/newsletter/application/public-newsletter-tenant-resolution";

/**
 * `GET/POST /api/v1/newsletter/preferences` — PUBLIC, token-scoped preference
 * center (Issue #272, ADR-0033 §5). The reusable `preferences` token is a bearer
 * capability keyed on the token (never an address), so a VALID token may view/
 * update its own topic subscriptions + locale; a bad token returns the SAME
 * generic empty (GET) / accepted (POST) body. No raw email in any log/response.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const GET: APIRoute = async ({ request, url, clientAddress }) => {
  const clientIp = resolveClientIp(request, clientAddress);
  const rate = checkRateLimit(`newsletter:prefs:${clientIp}`, {
    maxAttempts: 120,
    windowMs: 60 * 1000
  });
  if (!rate.allowed) {
    return fail(429, "RATE_LIMITED", "Too many requests.", {}, undefined, {
      "retry-after": String(rate.retryAfterSec)
    });
  }

  const token = url.searchParams.get("token");
  const sql = getDatabaseClient();

  const result = await withNewsletterTenant(
    sql,
    request,
    async (tx, tenant) => {
      return getPreferences(tx, tenant.tenantId, token);
    }
  );

  // Generic empty for a bad token / unresolved tenant (no existence oracle).
  return ok(result ?? GENERIC_PREFERENCES_EMPTY);
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const clientIp = resolveClientIp(request, clientAddress);
  const rate = checkRateLimit(`newsletter:prefs:${clientIp}`, {
    maxAttempts: 60,
    windowMs: 60 * 60 * 1000
  });
  if (!rate.allowed) {
    return fail(429, "RATE_LIMITED", "Too many requests.", {}, undefined, {
      "retry-after": String(rate.retryAfterSec)
    });
  }

  const bodyRead = await readJsonBody(request);
  if (bodyRead.tooLarge) return bodyTooLargeResponse(bodyRead.limitBytes);
  const body = bodyRead.value;
  const token =
    isRecord(body) && typeof body.token === "string" ? body.token : null;
  const locale =
    isRecord(body) && typeof body.locale === "string" ? body.locale : null;
  const topics =
    isRecord(body) && Array.isArray(body.topics)
      ? body.topics
          .filter(
            (t): t is { topicId: string; subscribed: boolean } =>
              isRecord(t) &&
              typeof t.topicId === "string" &&
              typeof t.subscribed === "boolean"
          )
          .slice(0, 100)
      : [];

  const sql = getDatabaseClient();
  await withNewsletterTenant(sql, request, async (tx, tenant) => {
    await updatePreferences(tx, tenant.tenantId, token, { locale, topics });
    return null;
  });

  return ok(GENERIC_ACCEPTED);
};
