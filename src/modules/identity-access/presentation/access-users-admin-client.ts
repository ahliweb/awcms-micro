/**
 * Browser controller for the Access & Users admin screen
 * (`/admin/access-users`) — presentation layer per ADR-0038.
 *
 * Moved verbatim out of that page's inline `<script>` (Issue #372). While
 * it lived inside the `.astro` file it was invisible to `tsc` and to every
 * test in this repo; as a `.ts` module it is type-checked with the rest of
 * the codebase and its decision points are importable (see
 * `admin-mutation-feedback.ts`, unit-tested).
 *
 * All mutations go through the real `/api/v1/users`, `/api/v1/roles`,
 * `/api/v1/access/assignments` endpoints — the same ABAC-guarded, audited
 * endpoints any other API client would use, so the UI has no privileged
 * shortcut. `lockElement` disables the triggering control for the duration
 * of the request so a fast double-click can't fire it twice (doc 14 §Form
 * UX "cegah double-submit"); errors leave the control re-enabled and every
 * field exactly as the user left it.
 */
import {
  asyncHandler,
  lockElement,
  readClientStrings,
  reloadAfterDelay,
  showBanner,
  submitJson
} from "../../../lib/ui/admin-form-client";
import { openConfirmDialog } from "../../../lib/ui/confirm-dialog-client";
import {
  resolveMutationFeedback,
  shouldReloadAfterMutation,
  type MutationOutcome
} from "./admin-mutation-feedback";

export interface AccessUsersStrings {
  createUserSuccess: string;
  createRoleSuccess: string;
  updateRoleSuccess: string;
  deleteRoleSuccess: string;
  updateStatusSuccess: string;
  assignRoleSuccess: string;
  unassignRoleSuccess: string;
  deleteRolePrompt: string;
  deleteRoleConfirmTitle: string;
  deleteRoleConfirmBody: string;
  confirmButton: string;
  cancelButton: string;
  reasonRequiredError: string;
  networkError: string;
  pleaseWait: string;
  errorMessages?: Record<string, string>;
}

const BANNER_ID = "action-banner";
const CONFIRM_DIALOG_ID = "au-confirm-dialog";

function submitButtonOf(form: HTMLFormElement): HTMLButtonElement | null {
  return form.querySelector('button[type="submit"]');
}

function applyFeedback(result: MutationOutcome, successMessage: string): void {
  const feedback = resolveMutationFeedback(result, successMessage);
  showBanner(BANNER_ID, feedback.message, feedback.variant);
  if (shouldReloadAfterMutation(result)) reloadAfterDelay();
}

export function initAccessUsersAdmin(
  strings: AccessUsersStrings = readClientStrings<AccessUsersStrings>()
): void {
  document.getElementById("create-user-form")?.addEventListener(
    "submit",
    asyncHandler(async (event) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const button = submitButtonOf(form);
      if (button?.disabled) return;
      const unlock = button ? lockElement(button, strings.pleaseWait) : null;

      try {
        const formData = new FormData(form);
        const roleIds = formData.getAll("roleIds") as string[];

        const result = await submitJson(
          "/api/v1/users",
          "POST",
          {
            displayName: formData.get("displayName"),
            loginIdentifier: formData.get("loginIdentifier"),
            password: formData.get("password"),
            roleIds
          },
          strings
        );

        applyFeedback(result, strings.createUserSuccess);
      } finally {
        unlock?.();
      }
    })
  );

  document.getElementById("create-role-form")?.addEventListener(
    "submit",
    asyncHandler(async (event) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const button = submitButtonOf(form);
      if (button?.disabled) return;
      const unlock = button ? lockElement(button, strings.pleaseWait) : null;

      try {
        const formData = new FormData(form);
        const permissionIds = formData.getAll("permissionIds") as string[];

        const result = await submitJson(
          "/api/v1/roles",
          "POST",
          {
            roleCode: formData.get("roleCode"),
            roleName: formData.get("roleName"),
            permissionIds
          },
          strings
        );

        applyFeedback(result, strings.createRoleSuccess);
      } finally {
        unlock?.();
      }
    })
  );

  document.querySelectorAll(".edit-role-form").forEach((form) => {
    form.addEventListener(
      "submit",
      asyncHandler(async (event) => {
        event.preventDefault();
        const el = event.target as HTMLFormElement;
        const button = submitButtonOf(el);
        if (button?.disabled) return;
        const unlock = button ? lockElement(button, strings.pleaseWait) : null;

        try {
          const roleId = el.dataset.roleId!;
          const isSystem = el.dataset.roleSystem === "true";
          const formData = new FormData(el);

          const body: Record<string, unknown> = {
            roleName: formData.get("roleName")
          };
          if (!isSystem) {
            body.permissionIds = formData.getAll("permissionIds");
          }

          const result = await submitJson(
            `/api/v1/roles/${roleId}`,
            "PATCH",
            body,
            strings
          );
          applyFeedback(result, strings.updateRoleSuccess);
        } finally {
          unlock?.();
        }
      })
    );
  });

  document.querySelectorAll(".delete-role-button").forEach((button) => {
    button.addEventListener(
      "click",
      asyncHandler(async () => {
        const el = button as HTMLButtonElement;
        if (el.disabled) return;

        const roleId = el.dataset.deleteRole!;
        const confirmation = await openConfirmDialog(CONFIRM_DIALOG_ID, {
          title: strings.deleteRoleConfirmTitle,
          body: strings.deleteRoleConfirmBody,
          confirmLabel: strings.confirmButton,
          cancelLabel: strings.cancelButton,
          requireReason: true,
          reasonLabel: strings.deleteRolePrompt,
          reasonRequiredError: strings.reasonRequiredError
        });
        if (!confirmation.confirmed || !confirmation.reason) return;
        const reason = confirmation.reason;

        const unlock = lockElement(el, strings.pleaseWait);
        try {
          const result = await submitJson(
            `/api/v1/roles/${roleId}`,
            "DELETE",
            { reason },
            strings
          );
          applyFeedback(result, strings.deleteRoleSuccess);
        } finally {
          unlock();
        }
      })
    );
  });

  document.querySelectorAll(".toggle-status-button").forEach((button) => {
    button.addEventListener(
      "click",
      asyncHandler(async () => {
        const el = button as HTMLButtonElement;
        if (el.disabled) return;
        const unlock = lockElement(el, strings.pleaseWait);

        try {
          const tenantUserId = el.dataset.toggleUser!;
          const nextStatus = el.dataset.nextStatus!;

          const result = await submitJson(
            `/api/v1/users/${tenantUserId}`,
            "PATCH",
            { status: nextStatus },
            strings
          );
          applyFeedback(result, strings.updateStatusSuccess);
        } finally {
          unlock();
        }
      })
    );
  });

  document.querySelectorAll(".assign-role-form").forEach((form) => {
    form.addEventListener(
      "submit",
      asyncHandler(async (event) => {
        event.preventDefault();
        const el = event.target as HTMLFormElement;
        const button = submitButtonOf(el);
        if (button?.disabled) return;

        const formData = new FormData(el);
        const roleId = formData.get("roleId");
        if (!roleId) return;

        const unlock = button ? lockElement(button, strings.pleaseWait) : null;
        try {
          const tenantUserId = el.dataset.assignUser!;
          const result = await submitJson(
            "/api/v1/access/assignments",
            "POST",
            { tenantUserId, roleId },
            strings
          );
          applyFeedback(result, strings.assignRoleSuccess);
        } finally {
          unlock?.();
        }
      })
    );
  });

  document.querySelectorAll(".role-chip-remove").forEach((button) => {
    button.addEventListener(
      "click",
      asyncHandler(async () => {
        const el = button as HTMLButtonElement;
        if (el.disabled) return;
        const unlock = lockElement(el);

        try {
          const tenantUserId = el.dataset.unassignUser!;
          const roleId = el.dataset.unassignRole!;

          const result = await submitJson(
            "/api/v1/access/assignments",
            "DELETE",
            { tenantUserId, roleId },
            strings
          );
          applyFeedback(result, strings.unassignRoleSuccess);
        } finally {
          unlock();
        }
      })
    );
  });
}
