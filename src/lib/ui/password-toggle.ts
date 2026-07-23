/**
 * Password show/hide toggle — shared by every auth screen with a password
 * field (login, reset-password, register). Pure progressive enhancement,
 * wired from the page's module `<script>` (no inline handler) so the strict
 * CSP is respected. Absent-safe: a no-op if either element is missing, so a
 * page can drop the toggle button without breaking.
 *
 * The button markup each caller renders:
 *   <button type="button" id="<toggleId>" class="auth-password-toggle"
 *           aria-pressed="false" aria-controls="<inputId>"
 *           aria-label={t("auth.password_show_aria")}>
 *     <span class="auth-password-toggle-label">{t("auth.password_show")}</span>
 *   </button>
 *
 * Localised labels come from the page's injected i18n JSON blob (the `.po`
 * catalog is server-side only), so they are passed in rather than hardcoded.
 */
export interface PasswordToggleStrings {
  passwordShow: string;
  passwordHide: string;
  passwordShowAria: string;
  passwordHideAria: string;
}

export function wirePasswordToggle(
  inputId: string,
  toggleId: string,
  strings: PasswordToggleStrings
): void {
  const input = document.getElementById(inputId) as HTMLInputElement | null;
  const toggle = document.getElementById(toggleId) as HTMLButtonElement | null;
  if (!input || !toggle) return;

  const label = toggle.querySelector(".auth-password-toggle-label");

  toggle.addEventListener("click", () => {
    const reveal = input.type === "password";
    input.type = reveal ? "text" : "password";
    toggle.setAttribute("aria-pressed", String(reveal));
    toggle.setAttribute(
      "aria-label",
      reveal ? strings.passwordHideAria : strings.passwordShowAria
    );
    if (label) {
      label.textContent = reveal ? strings.passwordHide : strings.passwordShow;
    }
  });
}
