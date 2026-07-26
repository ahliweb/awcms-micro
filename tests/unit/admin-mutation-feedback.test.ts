/**
 * Issue #372 — the mutation-result branch every admin form in
 * `identity_access` shares, now that it lives in a `.ts` module
 * (`modules/identity-access/presentation/admin-mutation-feedback.ts`)
 * instead of being copy-pasted eleven times inside two `.astro` `<script>`
 * blocks where nothing could import it.
 *
 * The FAILURE branch is what these tests are really for: it decides whether
 * an admin sees the API's real rejection reason or a success message, and
 * whether the page reloads out from under them. `bun test` has no DOM, so
 * the `showBanner`/`reloadAfterDelay` calls themselves stay covered by the
 * Playwright specs; everything that decides *what* to show is pure and
 * covered here.
 */
import { describe, expect, test } from "bun:test";

import {
  resolveMutationFeedback,
  shouldReloadAfterMutation
} from "../../src/modules/identity-access/presentation/admin-mutation-feedback";

describe("resolveMutationFeedback (Issue #372)", () => {
  test("success shows the caller's own translated success sentence", () => {
    expect(
      resolveMutationFeedback({ ok: true, message: "" }, "Role created.")
    ).toEqual({ message: "Role created.", variant: "success" });
  });

  test("failure shows the resolved API message, never the success text", () => {
    const feedback = resolveMutationFeedback(
      { ok: false, message: "A break-glass owner is required." },
      "Policy saved."
    );

    expect(feedback.variant).toBe("error");
    expect(feedback.message).toBe("A break-glass owner is required.");
    expect(feedback.message).not.toBe("Policy saved.");
  });

  test("failure keeps an empty API message rather than substituting success copy", () => {
    // `submitJson` always resolves a message, but a future caller passing a
    // blank one must still land in the error branch — silently falling back
    // to the success sentence would report a failed mutation as done.
    expect(
      resolveMutationFeedback({ ok: false, message: "" }, "Saved.")
    ).toEqual({ message: "", variant: "error" });
  });

  test("only a successful mutation triggers the page reload", () => {
    expect(shouldReloadAfterMutation({ ok: true, message: "" })).toBe(true);
    expect(shouldReloadAfterMutation({ ok: false, message: "nope" })).toBe(
      false
    );
  });
});
