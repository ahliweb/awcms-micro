/**
 * The one decision every admin mutation handler in this module repeats
 * after `submitJson()` resolves (Issue #372):
 *
 * ```ts
 * showBanner(
 *   "action-banner",
 *   result.ok ? strings.createUserSuccess : result.message,
 *   result.ok ? "success" : "error"
 * );
 * if (result.ok) reloadAfterDelay();
 * ```
 *
 * That five-line shape occurred 7× in `admin/access-users.astro`'s inline
 * script and 4× in `admin/security.astro`'s — eleven copies of the same
 * branch, none of them reachable by any test while they lived inside a
 * `.astro` file. Pulled out here as a pure function so the **failure**
 * branch (the one that decides an admin sees the API's error message
 * instead of a success message) is unit-testable without a DOM: see
 * `tests/unit/admin-mutation-feedback.test.ts`.
 *
 * Presentation layer per ADR-0038 — browser code owned by `identity_access`.
 */

/** The subset of `SubmitResult` (`src/lib/ui/admin-form-client.ts`) this decision needs. */
export interface MutationOutcome {
  ok: boolean;
  message: string;
}

export interface BannerFeedback {
  message: string;
  variant: "success" | "error";
}

/**
 * Success -> the caller's own translated success sentence; failure -> the
 * message `submitJson` already resolved (API error code mapped through the
 * page's `errorMessages` catalog, or the network-error fallback). The
 * failure message is deliberately NOT replaced with a generic string: the
 * mapped message is what tells an admin *why* the mutation was rejected
 * (e.g. `409 BREAK_GLASS_REQUIRED`).
 */
export function resolveMutationFeedback(
  result: MutationOutcome,
  successMessage: string
): BannerFeedback {
  return result.ok
    ? { message: successMessage, variant: "success" }
    : { message: result.message, variant: "error" };
}

/** A failed mutation must never reload the page — that would discard the
 *  banner the admin has not read yet, and every field they typed. */
export function shouldReloadAfterMutation(result: MutationOutcome): boolean {
  return result.ok;
}
