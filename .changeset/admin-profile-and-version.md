---
"awcms-micro": minor
---

Add a self-service account view and surface the app version in the admin shell:

- **Topbar profile icon → "My Profile" (`/admin/profile`).** A new functional profile button in the admin topbar links every user to their own account overview: display name, login identifier, profile type, account status + verification (as status badges), roles, and last login — read-only, with links out to the existing password-reset flow and (only when the user holds `profile_identity.profile_management.read`) the full CRM party-governance screen. The page is deliberately **not** permission-gated: it shows only the caller's own account via `fetchAccountOverview`, which filters to `context.identityId` inside the tenant RLS transaction (a different authorization question from the tenant-wide party directory). New shared application function `fetchAccountOverview` (identity-access), fully token-driven page, ≥44px touch target on the icon, transform-only surface (no opacity-fade), and i18n across en/id.
- **Repo version in the sidebar footer.** The admin sidebar now pins a `Version v<x.y.z>` footer read from `package.json` (the same source the module-management app-version checks use), so it never drifts from the released version.
