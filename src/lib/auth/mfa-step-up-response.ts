/**
 * Shared HTTP mapping for the MFA step-up failure codes (Issue #329) so the
 * two endpoints that gate on `verifyMfaStepUp` — `mfa/totp/disable` and
 * `mfa/recovery-codes/regenerate` — return an identical status + message for
 * the same failure instead of drifting apart. The codes themselves are the
 * `verifyMfaStepUp` result's own union; kept here (not in the application
 * layer) because status/copy is an HTTP-surface concern.
 */
export type MfaStepUpFailureCode =
  | "MFA_STEP_UP_REQUIRED"
  | "MFA_STEP_UP_INVALID"
  | "MFA_MISCONFIGURED"
  | "MFA_NOT_ACTIVE";

/**
 * `MFA_MISCONFIGURED` is a server fault (500); `MFA_NOT_ACTIVE` matches the
 * mutation's own 409; the two step-up codes are authentication outcomes (401).
 */
export function mfaStepUpStatus(code: MfaStepUpFailureCode): number {
  switch (code) {
    case "MFA_MISCONFIGURED":
      return 500;
    case "MFA_NOT_ACTIVE":
      return 409;
    default:
      return 401;
  }
}

export function mfaStepUpMessage(code: MfaStepUpFailureCode): string {
  switch (code) {
    case "MFA_STEP_UP_REQUIRED":
      return "A current TOTP code or your account password is required to perform this action.";
    case "MFA_STEP_UP_INVALID":
      return "The verification code or password is incorrect.";
    case "MFA_MISCONFIGURED":
      return "Multi-factor authentication is misconfigured on this server.";
    case "MFA_NOT_ACTIVE":
      return "Multi-factor authentication is not currently active for this account.";
  }
}
