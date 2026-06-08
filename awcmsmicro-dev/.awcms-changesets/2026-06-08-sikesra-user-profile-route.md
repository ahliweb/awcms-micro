---
"@awcms-micro/plugin-sikesra": minor
---

Add a read-only per-user SIKESRA profile aggregation route (`access/users/profile`). It consolidates the trusted EmDash identity reference (read-only, never mutating EmDash core users), SIKESRA role assignments, region/organization scope assignments, ABAC subject attributes, effective permissions, and a redacted recent-audit summary from `sikesra_` tables. The route is tenant/site scoped, surfaces an `orphaned` flag when the EmDash user reference is missing, returns a validation error when no user reference is supplied, and excludes sensitive audit metadata by default. Adds typed contracts (`SikesraUserProfileRequest`, `SikesraUserProfileDto` and related DTOs), the `getUserProfile` admin API client, and focused permission/aggregation/orphaned-state tests.
