/**
 * `newsletter` permission catalog constants (Issue #272, ADR-0033 §6) — the
 * module key + activity codes the admin API guards on and the sql/092 permission
 * seed declares. Kept in `domain/` (pure, no imports) so both the route handlers
 * and the `module.ts` descriptor reference the same literals.
 */
export const NEWSLETTER_MODULE_KEY = "newsletter";

/** Activity for the MASKED subscriber + consent-evidence view. */
export const NEWSLETTER_SUBSCRIBERS_ACTIVITY_CODE = "subscribers";

/** Activity for topic / subscription-list CRUD. */
export const NEWSLETTER_TOPICS_ACTIVITY_CODE = "topics";

/** Activity for the suppression deny-list (read + manual add). */
export const NEWSLETTER_SUPPRESSION_ACTIVITY_CODE = "suppression";

/** Activity for the campaign/digest compose + schedule + dispatch + cancel lifecycle. */
export const NEWSLETTER_CAMPAIGNS_ACTIVITY_CODE = "campaigns";
