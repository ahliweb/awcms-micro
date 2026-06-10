# Changelog

## 0.2.0 - 2026-06-10

- Fixes Mailketing API integration: corrects base URL to `api.mailketing.co.id` subdomain, switches authentication from `Authorization: Bearer` header to `api_token` form field, changes content type to `application/x-www-form-urlencoded`, and aligns request field names (`recipient`, `from_email`, `content`) with the Mailketing API spec.
- `testConnection` now correctly detects HTTP 5xx server errors and invalid-token strings in the API response body instead of only checking for HTTP 401.
- Send error messages now include the API response body (truncated) so failed entries in the Send Log show the actual rejection reason.
- Send Log table shows a new `Error` column for failed entries.
- Adds `EmailStatusWidget` and `SendStatsWidget` dashboard widget components as a named `widgets` export from `admin.tsx`, fixing 404 errors shown for the "Email Status" and "Send Statistics" cards on the EmDash admin dashboard.

## 0.1.0 - 2026-06-09

- Initial release of the AWCMS-Micro Email Mailketing plugin: integrates Mailketing.co.id as an EmDash email provider with send-log CRUD, RBAC/ABAC, settings management, and audit support.
