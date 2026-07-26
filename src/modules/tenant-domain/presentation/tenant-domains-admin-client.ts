/**
 * Browser controller for the tenant-domain admin screen
 * (`/admin/tenant/domains`) — presentation layer per ADR-0038, moved out of
 * that page's inline `<script>` by Issue #372.
 *
 * Every mutation goes through the already-guarded/audited
 * `/api/v1/tenant/domains/**` endpoints. Verify and set-primary are the two
 * actions the API requires an `Idempotency-Key` for (Issue #562): a fresh
 * `crypto.randomUUID()` per user click. Create/update/delete are idempotent
 * by construction (same body -> same end state; repeating a soft delete is
 * a no-op), so they carry no key. Every mutating control is
 * `lockElement`-guarded against a fast double-click regardless.
 *
 * `looksLikeValidHostname` is exported for unit testing
 * (`tests/unit/tenant-domains-admin-client.test.ts`): it is the page's only
 * real client-side validation branch, and while it lived inside a `.astro`
 * `<script>` no test could reach it — a shape rule that silently stopped
 * matching the server's would have shown up only as a confusing round trip.
 */
import {
  asyncHandler,
  lockElement,
  newIdempotencyKey,
  readClientStrings,
  reloadAfterDelay,
  showBanner,
  submitJson
} from "../../../lib/ui/admin-form-client";
import { openConfirmDialog } from "../../../lib/ui/confirm-dialog-client";

export interface TenantDomainStrings {
  createSuccess: string;
  updateSuccess: string;
  deleteSuccess: string;
  verifySuccess: string;
  setPrimarySuccess: string;
  deleteReasonPrompt: string;
  deleteConfirm: string;
  deleteConfirmTitle: string;
  verifyConfirm: string;
  verifyConfirmTitle: string;
  setPrimaryConfirm: string;
  setPrimaryConfirmTitle: string;
  invalidHostname: string;
  copySuccess: string;
  copyError: string;
  confirmButton: string;
  cancelButton: string;
  reasonRequiredError: string;
  networkError: string;
  pleaseWait: string;
  errorMessages?: Record<string, string>;
}

const BANNER_ID = "action-banner";
const CONFIRM_DIALOG_ID = "domain-confirm-dialog";

/**
 * UX-nicety-only client-side hostname shape check — mirrors (does not
 * replace) `normalizePublicHost()`'s shape rules (Issue #559): no
 * whitespace, no port, no leading/trailing/doubled dots, no underscore,
 * RFC-1035-ish per-label charset, overall length <= 253. The API
 * (`validateCreateTenantDomainInput`, reusing `normalizePublicHost()`
 * itself) remains the actual enforcement boundary — this only avoids a
 * round trip for an obviously-invalid value.
 */
export function looksLikeValidHostname(value: string): boolean {
  const trimmed = value.trim().toLowerCase();

  if (
    trimmed.length === 0 ||
    trimmed.length > 253 ||
    trimmed.includes(":") ||
    trimmed.includes("..") ||
    trimmed.startsWith(".") ||
    trimmed.endsWith(".") ||
    trimmed.includes("_") ||
    /\s/.test(trimmed)
  ) {
    return false;
  }

  return trimmed
    .split(".")
    .every((label) => /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(label));
}

/** `""` -> `null`: an untouched optional text field must clear the column,
 *  not store an empty string. */
export function optionalTrimmed(
  value: FormDataEntryValue | null
): string | null {
  return String(value ?? "").trim() || null;
}

function submitButtonOf(form: HTMLFormElement): HTMLButtonElement | null {
  return form.querySelector('button[type="submit"]');
}

function applyFeedback(
  result: { ok: boolean; message: string },
  successMessage: string
): void {
  showBanner(
    BANNER_ID,
    result.ok ? successMessage : result.message,
    result.ok ? "success" : "error"
  );
  if (result.ok) reloadAfterDelay();
}

export function initTenantDomainsAdmin(
  strings: TenantDomainStrings = readClientStrings<TenantDomainStrings>()
): void {
  document.getElementById("create-domain-form")?.addEventListener(
    "submit",
    asyncHandler(async (event) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const button = submitButtonOf(form);
      if (button?.disabled) return;

      const formData = new FormData(form);
      const hostname = String(formData.get("hostname") ?? "").trim();

      if (!looksLikeValidHostname(hostname)) {
        showBanner(BANNER_ID, strings.invalidHostname, "error");
        return;
      }

      const unlock = button ? lockElement(button, strings.pleaseWait) : null;
      try {
        const result = await submitJson(
          "/api/v1/tenant/domains",
          "POST",
          {
            hostname,
            domainType: formData.get("domainType"),
            routeMode: formData.get("routeMode"),
            verificationMethod: optionalTrimmed(
              formData.get("verificationMethod")
            ),
            verificationRecordName: optionalTrimmed(
              formData.get("verificationRecordName")
            ),
            verificationRecordValue: optionalTrimmed(
              formData.get("verificationRecordValue")
            ),
            redirectToPrimary: formData.get("redirectToPrimary") === "on"
          },
          strings
        );

        applyFeedback(result, strings.createSuccess);
      } finally {
        unlock?.();
      }
    })
  );

  document.querySelectorAll(".edit-domain-form").forEach((form) => {
    form.addEventListener(
      "submit",
      asyncHandler(async (event) => {
        event.preventDefault();
        const el = event.target as HTMLFormElement;
        const button = submitButtonOf(el);
        if (button?.disabled) return;
        const unlock = button ? lockElement(button, strings.pleaseWait) : null;

        try {
          const domainId = el.dataset.domainId!;
          const formData = new FormData(el);
          // The status <select> always renders (Issue #563 post-review fix),
          // with a "no change" option (value="") — only send `status` when the
          // admin actually picked a real value, so leaving it on "no change"
          // never accidentally re-submits the current status as an explicit
          // transition.
          const statusValue = String(formData.get("status") ?? "");

          const body: Record<string, unknown> = {
            domainType: formData.get("domainType"),
            routeMode: formData.get("routeMode"),
            verificationMethod: optionalTrimmed(
              formData.get("verificationMethod")
            ),
            verificationRecordName: optionalTrimmed(
              formData.get("verificationRecordName")
            ),
            verificationRecordValue: optionalTrimmed(
              formData.get("verificationRecordValue")
            ),
            redirectToPrimary: formData.get("redirectToPrimary") === "on"
          };
          if (statusValue !== "") {
            body.status = statusValue;
          }

          const result = await submitJson(
            `/api/v1/tenant/domains/${domainId}`,
            "PATCH",
            body,
            strings
          );

          applyFeedback(result, strings.updateSuccess);
        } finally {
          unlock?.();
        }
      })
    );
  });

  document.querySelectorAll(".verify-domain-button").forEach((button) => {
    button.addEventListener(
      "click",
      asyncHandler(async () => {
        const el = button as HTMLButtonElement;
        if (el.disabled) return;
        const confirmation = await openConfirmDialog(CONFIRM_DIALOG_ID, {
          title: strings.verifyConfirmTitle,
          body: strings.verifyConfirm,
          confirmLabel: strings.confirmButton,
          cancelLabel: strings.cancelButton
        });
        if (!confirmation.confirmed) return;

        const unlock = lockElement(el, strings.pleaseWait);
        try {
          const domainId = el.dataset.domainId!;
          const result = await submitJson(
            `/api/v1/tenant/domains/${domainId}/verify`,
            "POST",
            {},
            strings,
            { "Idempotency-Key": newIdempotencyKey() }
          );
          applyFeedback(result, strings.verifySuccess);
        } finally {
          unlock();
        }
      })
    );
  });

  document.querySelectorAll(".set-primary-domain-button").forEach((button) => {
    button.addEventListener(
      "click",
      asyncHandler(async () => {
        const el = button as HTMLButtonElement;
        if (el.disabled) return;
        const confirmation = await openConfirmDialog(CONFIRM_DIALOG_ID, {
          title: strings.setPrimaryConfirmTitle,
          body: strings.setPrimaryConfirm,
          confirmLabel: strings.confirmButton,
          cancelLabel: strings.cancelButton
        });
        if (!confirmation.confirmed) return;

        const unlock = lockElement(el, strings.pleaseWait);
        try {
          const domainId = el.dataset.domainId!;
          const result = await submitJson(
            `/api/v1/tenant/domains/${domainId}/set-primary`,
            "POST",
            {},
            strings,
            { "Idempotency-Key": newIdempotencyKey() }
          );
          applyFeedback(result, strings.setPrimarySuccess);
        } finally {
          unlock();
        }
      })
    );
  });

  document.querySelectorAll(".delete-domain-button").forEach((button) => {
    button.addEventListener(
      "click",
      asyncHandler(async () => {
        const el = button as HTMLButtonElement;
        if (el.disabled) return;

        const confirmation = await openConfirmDialog(CONFIRM_DIALOG_ID, {
          title: strings.deleteConfirmTitle,
          body: strings.deleteConfirm,
          confirmLabel: strings.confirmButton,
          cancelLabel: strings.cancelButton,
          requireReason: true,
          reasonLabel: strings.deleteReasonPrompt,
          reasonRequiredError: strings.reasonRequiredError
        });
        if (!confirmation.confirmed || !confirmation.reason) return;
        const reason = confirmation.reason;

        const unlock = lockElement(el, strings.pleaseWait);
        try {
          const domainId = el.dataset.domainId!;
          const result = await submitJson(
            `/api/v1/tenant/domains/${domainId}`,
            "DELETE",
            { reason },
            strings
          );
          applyFeedback(result, strings.deleteSuccess);
        } finally {
          unlock();
        }
      })
    );
  });

  document.querySelectorAll(".copy-record-button").forEach((button) => {
    button.addEventListener(
      "click",
      asyncHandler(async () => {
        const el = button as HTMLButtonElement;
        const value = el.dataset.copyValue ?? "";

        try {
          await navigator.clipboard.writeText(value);
          showBanner(BANNER_ID, strings.copySuccess, "success");
        } catch {
          // Clipboard access is denied outside a secure context and in some
          // embedded webviews — the admin gets a real error line instead of a
          // silently unchanged clipboard.
          showBanner(BANNER_ID, strings.copyError, "error");
        }
      })
    );
  });
}
