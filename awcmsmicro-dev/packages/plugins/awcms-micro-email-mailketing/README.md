# AWCMS Email Mailketing Plugin

Email provider plugin for AWCMS-Micro that integrates the [Mailketing.co.id](https://mailketing.co.id) API as an EmDash `email:deliver` provider.

## Features

- Delivers emails via the Mailketing REST API
- Full send-log CRUD with soft delete, restore, and permanent delete (with reason and audit trail)
- Plugin-scoped RBAC: roles, permissions, and user-role assignments
- User profile management per plugin user
- Audit log for all plugin activity
- English (en) and Indonesian (id) admin UI translations

## Plugin ID

`awcms-email-mailketing`

## Capabilities

- `email:provide` — registers as an EmDash `email:deliver` provider
- `network:request` — outbound HTTP to `mailketing.co.id`
- `users:read` — reads EmDash users for access management

## Quick Start

```ts
import { awcmsEmailMailketingPlugin } from "@awcms-micro/plugin-email-mailketing";

// In your EmDash config:
plugins: [
  awcmsEmailMailketingPlugin({
    tenantId: "my-org",
    siteId:   "my-site",
  }),
]
```

Then navigate to **Admin → Email Mailketing → Settings** and enter your Mailketing API token and sender details.

## Settings

| Key | Description |
|-----|-------------|
| `apiToken` | Mailketing API bearer token |
| `fromEmail` | Verified sender email address |
| `fromName` | Display name shown in From field |
| `enabled` | Whether the provider is active |
| `logOutbound` | Whether to write each attempt to the send log |

## D1 Database Tables

All tables use the `mailketing_` prefix:

- `mailketing_settings`
- `mailketing_plugin_state`
- `mailketing_send_log`
- `mailketing_permission_catalog`
- `mailketing_role_catalog`
- `mailketing_role_permission_assignments`
- `mailketing_user_role_assignments`
- `mailketing_user_profile`
- `mailketing_audit_events`

## Admin Pages

| Path | Description |
|------|-------------|
| `/overview` | Stats dashboard |
| `/send-log` | Send log list with filters, soft delete, restore, permanent delete |
| `/settings` | API token, sender config, enable/disable, logging toggle |
| `/access/users` | Assign/revoke plugin roles to EmDash users |
| `/access/roles` | Create/edit/delete plugin-scoped roles |
| `/access/permissions` | View plugin-defined permissions |
| `/audit` | Immutable audit event log |

## License

LicenseRef-AW-NC-1.0 — see LICENSE.md
