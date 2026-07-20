import type { APIRoute } from "astro";

import { hashSessionToken } from "../../../../../../../lib/auth/session-token";
import { getDatabaseClient } from "../../../../../../../lib/database/client";
import { withTenant } from "../../../../../../../lib/database/tenant-context";
import { fail, ok } from "../../../../../../../modules/_shared/api-response";
import {
  authorizeInTransaction,
  resolveAuthInputs
} from "../../../../../../../modules/identity-access/application/access-guard";
import {
  NEWSLETTER_CAMPAIGNS_ACTIVITY_CODE,
  NEWSLETTER_MODULE_KEY
} from "../../../../../../../modules/newsletter/domain/newsletter-permissions";
import { renderCampaignPreview } from "../../../../../../../modules/newsletter/domain/campaign-preview";
import { getCampaign } from "../../../../../../../modules/newsletter/application/campaign-service";

/**
 * `GET /api/v1/newsletter/admin/campaigns/{id}/preview` — safe HTML preview of a
 * campaign/digest (Issue #272, ADR-0033). ABAC-guarded (`newsletter.campaigns.read`).
 * The stored `body_html_source` (or `body_text`) is rendered through the
 * escape-then-allow-only-safe-constructs `renderCampaignPreview` — never emitted as
 * stored HTML, so there is no stored-XSS surface.
 */
const READ_GUARD = {
  moduleKey: NEWSLETTER_MODULE_KEY,
  activityCode: NEWSLETTER_CAMPAIGNS_ACTIVITY_CODE,
  action: "read" as const
};

export const GET: APIRoute = async ({ request, cookies, params }) => {
  const campaignId = params.id;
  if (!campaignId)
    return fail(400, "VALIDATION_ERROR", "Campaign id is required.");

  const { tenantId, token } = resolveAuthInputs(request, cookies);
  if (!tenantId)
    return fail(400, "TENANT_REQUIRED", "Tenant header is required.");
  if (!token) return fail(401, "AUTH_REQUIRED", "Authentication required.");

  const sql = getDatabaseClient();
  const tokenHash = hashSessionToken(token);
  const now = new Date();

  return withTenant(sql, tenantId, async (tx) => {
    const auth = await authorizeInTransaction(
      tx,
      tenantId,
      tokenHash,
      now,
      READ_GUARD
    );
    if (!auth.allowed) return auth.denied;

    const campaign = await getCampaign(tx, tenantId, campaignId);
    if (!campaign) return fail(404, "NOT_FOUND", "Campaign not found.");

    const bodyRows = (await tx`
      SELECT body_text, body_html_source FROM awcms_micro_newsletter_campaigns
      WHERE tenant_id = ${tenantId} AND id = ${campaignId}
    `) as { body_text: string; body_html_source: string | null }[];
    const source =
      bodyRows[0]?.body_html_source ?? bodyRows[0]?.body_text ?? "";

    return ok({
      subject: campaign.subject,
      html: renderCampaignPreview(source)
    });
  });
};
