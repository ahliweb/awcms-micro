---
name: database-d1-postgres
description: Database work for AWCMS-Micro and EmDash using Cloudflare D1, SQLite, PostgreSQL, Kysely, migrations, repositories, seeds, data preservation, indexes, and query safety. Use when changing schema, D1 tables, repositories, SQL, migrations, or database tests.
---

# Database: D1, SQLite, And PostgreSQL

Use this skill for database schema, migrations, repositories, query safety, D1/SQLite/PostgreSQL compatibility, seed export/import, and data preservation.

## Priority Sources

Prefer the local Claude/EmDash skill and repository guidance in this order:

1. `awcmsmicro-dev/AGENTS.md` for database, migration, SQL safety, content table, index, localization, and query performance rules.
2. `awcmsmicro-dev/skills/building-emdash-site/SKILL.md` for seed/schema expectations in EmDash sites.
3. `awcmsmicro-dev/skills/creating-plugins/SKILL.md` for plugin storage, KV, settings, capabilities, and plugin data isolation.
4. Root `AGENTS.md`, `docs/awcms-micro-implementation-boundaries.md`, and SIKESRA governance docs for downstream data-boundary rules.
5. Cloudflare D1 and Wrangler docs/skills when changing D1 bindings, migrations, remote/local execution, or deployment behavior.

## Non-Negotiable SQL Rules

- Never interpolate untrusted values into SQL strings.
- Use Kysely builders or `sql` tagged templates for values.
- Use `sql.ref()` or validated identifiers for dynamic table/column names.
- Validate identifiers before any raw SQL identifier use.
- Do not store project-owned production data in generic core tables when project-specific tables are required.

## Migration Rules

- Migrations are forward-only for production data. Do not write migrations that make existing content inaccessible.
- Keep static migration registries updated when the package requires static imports for Workers bundling.
- Use project-specific prefixes for project-owned tables. SIKESRA canonical tables must use `sikesra_`.
- Add indexes for foreign keys, lookup fields, status/lifecycle fields, and common filters.
- Add destructive-migration guardrails or tests when data preservation is a requirement.

## D1, SQLite, And PostgreSQL Compatibility

- Treat D1 as SQLite-compatible but latency-sensitive; minimize round trips and prefer batch queries over probe queries.
- For dialect-sensitive repository code, test with the repo's dialect wrappers where available.
- Keep PostgreSQL compatibility in mind for shared EmDash query-builder code; avoid SQLite-only behavior unless isolated to D1/SQLite-specific paths.
- Handle missing-table transition states safely when the product has staged migrations or production bootstrapping.

## Repository And Service Rules

- Keep database access in repository layers where the project already has repositories.
- Return internal models to services and public-safe serialized models to routes/UI.
- Keep soft delete as default for sensitive business data unless a governed permanent-delete workflow exists.
- Preserve audit trails for security-sensitive lifecycle events.

## Data Preservation

- Add or update Mermaid diagrams when changing schema, migration flow, preservation behavior, import/export, masking, RBAC/ABAC, or deployment topology.
- Update docs and validation scripts when a new data rule must survive rebuilds.
- For SIKESRA, preserve EmDash users as shared identity references and store SIKESRA roles, permissions, scopes, ABAC attributes, policies, and audit data in `sikesra_` tables.

## Verification

Use the closest relevant checks:

- migration-prefix tests
- repository/service tests
- destructive migration guards
- `pnpm typecheck`
- `pnpm test`
- D1 local/remote migration commands only when explicitly needed and credentials/bindings are available
- SIKESRA: `pnpm --filter @awcms-micro/plugin-sikesra awcms:sikesra:validate-after-emdash-sync`
