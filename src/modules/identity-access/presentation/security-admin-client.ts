/**
 * Browser controller for the full-online auth security admin screen
 * (`/admin/security`) — presentation layer per ADR-0038, moved out of that
 * page's inline `<script>` by Issue #372.
 *
 * The three validation predicates exported below are the reason this move
 * mattered. Each of them decides whether a mutation is even attempted, and
 * each was unreachable by any test while it lived inside a `.astro` file:
 *
 *   - `requiresBreakGlassOwner` — the client-side half of the issue's own
 *     acceptance criterion "UI prevents enabling `sso_required` unless a
 *     valid break-glass local owner/account exists". Deliberately NOT a
 *     second source of truth: `saveTenantAuthPolicy`'s fresh DB read (Issue
 *     #591) stays authoritative, and a request that slips past this still
 *     gets a clear `409 BREAK_GLASS_REQUIRED` mapped through
 *     `errorMessages` like any other rejection. This only avoids an
 *     obviously-doomed round trip.
 *   - `isCreateProviderSecretChoiceValid` — creating a provider needs
 *     EXACTLY ONE of an inline secret or an env-var name (XOR).
 *   - `isEditProviderSecretChoiceValid` — editing may send NEITHER (leave
 *     the stored secret untouched) but never BOTH.
 *
 * Getting either secret predicate backwards would either store a secret the
 * admin meant to keep in an env var, or reject a legitimate edit. See
 * `tests/unit/security-admin-client.test.ts`.
 */
import {
  asyncHandler,
  lockElement,
  readClientStrings,
  reloadAfterDelay,
  showBanner,
  submitJson
} from "../../../lib/ui/admin-form-client";
import {
  resolveMutationFeedback,
  shouldReloadAfterMutation,
  type MutationOutcome
} from "./admin-mutation-feedback";

export interface SecurityStrings {
  policySaveSuccess: string;
  createProviderSuccess: string;
  updateProviderSuccess: string;
  deleteProviderSuccess: string;
  deleteProviderPrompt: string;
  breakGlassClientWarning: string;
  invalidSecretChoice: string;
  invalidCreateSecretChoice: string;
  networkError: string;
  pleaseWait: string;
  errorMessages?: Record<string, string>;
}

const BANNER_ID = "action-banner";

/** Splits a comma-separated admin input (email domains, identity ids) into
 *  trimmed, non-empty entries. */
export function parseDelimitedList(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

/**
 * A tenant that requires SSO, or that has turned password login off, must
 * keep at least one break-glass owner — otherwise a broken IdP locks
 * everyone out permanently.
 */
export function requiresBreakGlassOwner(policy: {
  passwordLoginEnabled: boolean;
  ssoRequired: boolean;
}): boolean {
  return policy.ssoRequired || !policy.passwordLoginEnabled;
}

/** Exactly one of the two secret sources, never both and never neither. */
export function isCreateProviderSecretChoiceValid(
  clientSecret: string,
  clientSecretEnvVar: string
): boolean {
  return clientSecret.length > 0 !== clientSecretEnvVar.length > 0;
}

/** On edit, sending neither is legal (keep the stored secret); both is not. */
export function isEditProviderSecretChoiceValid(
  clientSecret: string,
  clientSecretEnvVar: string
): boolean {
  return !(clientSecret.length > 0 && clientSecretEnvVar.length > 0);
}

function submitButtonOf(form: HTMLFormElement): HTMLButtonElement | null {
  return form.querySelector('button[type="submit"]');
}

function applyFeedback(result: MutationOutcome, successMessage: string): void {
  const feedback = resolveMutationFeedback(result, successMessage);
  showBanner(BANNER_ID, feedback.message, feedback.variant);
  if (shouldReloadAfterMutation(result)) reloadAfterDelay();
}

function trimmedField(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

export function initSecurityAdmin(
  strings: SecurityStrings = readClientStrings<SecurityStrings>()
): void {
  document.getElementById("policy-form")?.addEventListener(
    "submit",
    asyncHandler(async (event) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const button = document.getElementById(
        "policy-save-button"
      ) as HTMLButtonElement | null;
      if (button?.disabled) return;

      const formData = new FormData(form);
      const passwordLoginEnabled =
        formData.get("passwordLoginEnabled") === "on";
      const ssoRequired = formData.get("ssoRequired") === "on";
      const breakGlassIdentityIds = formData.has("breakGlassIdentityIds")
        ? (formData.getAll("breakGlassIdentityIds") as string[])
        : parseDelimitedList(formData.get("breakGlassIdentityIdsManual"));

      if (
        requiresBreakGlassOwner({ passwordLoginEnabled, ssoRequired }) &&
        breakGlassIdentityIds.length === 0
      ) {
        showBanner(BANNER_ID, strings.breakGlassClientWarning, "error");
        return;
      }

      const unlock = button ? lockElement(button, strings.pleaseWait) : null;
      try {
        const result = await submitJson(
          "/api/v1/identity/sso/policy",
          "PATCH",
          {
            passwordLoginEnabled,
            ssoEnabled: formData.get("ssoEnabled") === "on",
            ssoRequired,
            autoLinkVerifiedEmail:
              formData.get("autoLinkVerifiedEmail") === "on",
            allowedEmailDomains: parseDelimitedList(
              formData.get("allowedEmailDomains")
            ),
            breakGlassIdentityIds
          },
          strings
        );
        applyFeedback(result, strings.policySaveSuccess);
      } finally {
        unlock?.();
      }
    })
  );

  document.getElementById("create-provider-form")?.addEventListener(
    "submit",
    asyncHandler(async (event) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const button = submitButtonOf(form);
      if (button?.disabled) return;

      const formData = new FormData(form);
      const clientSecret = trimmedField(formData, "clientSecret");
      const clientSecretEnvVar = trimmedField(formData, "clientSecretEnvVar");

      if (
        !isCreateProviderSecretChoiceValid(clientSecret, clientSecretEnvVar)
      ) {
        showBanner(BANNER_ID, strings.invalidCreateSecretChoice, "error");
        return;
      }

      const unlock = button ? lockElement(button, strings.pleaseWait) : null;
      try {
        const result = await submitJson(
          "/api/v1/identity/sso/providers",
          "POST",
          {
            providerKey: formData.get("providerKey"),
            displayName: formData.get("displayName"),
            issuerUrl: formData.get("issuerUrl"),
            clientId: formData.get("clientId"),
            clientSecret: clientSecret.length > 0 ? clientSecret : null,
            clientSecretEnvVar:
              clientSecretEnvVar.length > 0 ? clientSecretEnvVar : null,
            scopes: formData.get("scopes"),
            allowedEmailDomains: parseDelimitedList(
              formData.get("allowedEmailDomains")
            ),
            enabled: formData.get("enabled") === "on"
          },
          strings
        );
        applyFeedback(result, strings.createProviderSuccess);
      } finally {
        unlock?.();
      }
    })
  );

  document.querySelectorAll(".edit-provider-form").forEach((formEl) => {
    formEl.addEventListener(
      "submit",
      asyncHandler(async (event) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const button = submitButtonOf(form);
        if (button?.disabled) return;

        const providerId = form.dataset.providerId!;
        const formData = new FormData(form);
        const clientSecret = trimmedField(formData, "clientSecret");
        const clientSecretEnvVar = trimmedField(formData, "clientSecretEnvVar");

        if (
          !isEditProviderSecretChoiceValid(clientSecret, clientSecretEnvVar)
        ) {
          showBanner(BANNER_ID, strings.invalidSecretChoice, "error");
          return;
        }

        const unlock = button ? lockElement(button, strings.pleaseWait) : null;
        try {
          const body: Record<string, unknown> = {
            displayName: formData.get("displayName"),
            issuerUrl: formData.get("issuerUrl"),
            clientId: formData.get("clientId"),
            scopes: formData.get("scopes"),
            allowedEmailDomains: parseDelimitedList(
              formData.get("allowedEmailDomains")
            ),
            enabled: formData.get("enabled") === "on"
          };
          if (clientSecret.length > 0) body.clientSecret = clientSecret;
          if (clientSecretEnvVar.length > 0) {
            body.clientSecretEnvVar = clientSecretEnvVar;
          }

          const result = await submitJson(
            `/api/v1/identity/sso/providers/${providerId}`,
            "PATCH",
            body,
            strings
          );
          applyFeedback(result, strings.updateProviderSuccess);
        } finally {
          unlock?.();
        }
      })
    );
  });

  document.querySelectorAll(".delete-provider-button").forEach((button) => {
    button.addEventListener(
      "click",
      asyncHandler(async () => {
        const el = button as HTMLButtonElement;
        if (el.disabled) return;

        const providerId = el.dataset.deleteProvider!;
        const reason = window.prompt(strings.deleteProviderPrompt);
        if (!reason || reason.trim().length === 0) return;

        const unlock = lockElement(el, strings.pleaseWait);
        try {
          const result = await submitJson(
            `/api/v1/identity/sso/providers/${providerId}`,
            "DELETE",
            { reason },
            strings
          );
          applyFeedback(result, strings.deleteProviderSuccess);
        } finally {
          unlock();
        }
      })
    );
  });
}
