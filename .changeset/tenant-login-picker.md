---
"awcms-micro": minor
---

Add an opt-in `AUTH_LOGIN_TENANT_PICKER` flag that renders `/login`'s tenant field as a dropdown of active tenant names instead of the default manual tenant-id text input. Off by default — enabling it exposes the active-tenant list pre-auth (tenant enumeration), which is acceptable for single/few-tenant deployments but an information disclosure for multi-tenant ones, so it must be opted into per deployment. The option value remains the tenant UUID; only the visible label is the friendly tenant name.
