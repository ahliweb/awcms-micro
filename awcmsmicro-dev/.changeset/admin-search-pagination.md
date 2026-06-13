---
"@emdash-cms/plugin-forms": patch
"@awcms-micro/plugin-email-mailketing": patch
"@awcms-micro/plugin-sikesra": patch
---

Adds client-side search to admin list pages and cursor-based "Load More" pagination to form submissions.

- Forms: search filters the forms list by name or slug; submissions page loads additional entries on demand with a "Load More" button backed by cursor pagination.
- Mailketing: search filters the plugin users list by name or email, and the roles list by label or slug.
- SIKESRA: search filters the audit log by kind, scope, or summary; permissions catalog by slug, label, or scope; roles list by slug or label.
