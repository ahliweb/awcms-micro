/**
 * Self-registration feature flag (opt-in). When
 * `AUTH_SELF_REGISTRATION_ENABLED=true`, the public `/register` page and the
 * `POST /api/v1/auth/register` endpoint are active, and `/login` shows a
 * "Create account" link. Off by default on purpose: a public account-request
 * form is a spam/abuse surface, and self-registered accounts only ever become
 * login-eligible after an ADMIN approves them (they are created as pending
 * requests, never as active identities) — so an operator opts in per
 * deployment, mirroring `isLoginTenantPickerEnabled`'s shape.
 *
 * Approval-gated by design (Issue: self-registration): a self-registered user
 * is NOT active until an admin approves the request from
 * `/admin/access-users` → this is the security control that keeps the public
 * endpoint from ever granting login access on its own.
 */
export function isSelfRegistrationEnabled(
  env: NodeJS.ProcessEnv = process.env
): boolean {
  return env.AUTH_SELF_REGISTRATION_ENABLED === "true";
}
