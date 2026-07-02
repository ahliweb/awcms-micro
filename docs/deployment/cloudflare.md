# Cloudflare Deployment Runbook

This document describes the Cloudflare deployment model for AWCMS-Micro example environments.

## Scope

This runbook applies to AWCMS-Micro example deployments built from plugin and template boundaries, especially `awcmsmicro-dev/templates/awcms-micro-default-cloudflare/`.

## Example Production Shape

- Base domain: `awcms-micro.ahlikoding.com`
- Storage domain: `awcms-micro-s3.ahlikoding.com`
- D1 database name: `awcms-micro-d1-20260530`
- D1 database ID: `90a77136-8ad0-4247-bd48-7f728c2c0a0c`

Do not commit tokens, secrets, or private credentials. This repository's reference Cloudflare template may commit non-secret resource identifiers such as D1 and KV binding IDs when they are part of the checked-in example deployment shape.

## Supported Deployment Surface

- Product behavior should come from AWCMS-Micro plugins and templates.
- Root scripts and root docs support deployment operations but are not the deployed product.
- The Cloudflare reference site is the template at `awcmsmicro-dev/templates/awcms-micro-default-cloudflare/`.

## Required Cloudflare Resources

- Workers runtime for the public application
- D1 database for application data
- R2 bucket for media and file storage
- KV only when a specific feature requires it
- environment variables and secrets for deployment-time configuration
- custom domains for the app and public storage edge
- SSL/TLS for all public endpoints
- WAF and baseline hardening rules

```mermaid
flowchart LR
  User[User] --> Route[Cloudflare route]
  Route --> Worker[AWCMS-Micro Worker]
  Worker --> D1[(D1 database)]
  Worker --> R2[(R2 media bucket)]
  Worker --> KV[(Session KV)]
  Worker --> Loader[Worker Loader]
  Worker --> Plugins[AWCMS-Micro plugins]
```

## Resource Preparation Checklist

1. Create or confirm the Worker target.
2. Create or confirm the D1 database.
3. Create or confirm the R2 media bucket.
4. Create or confirm any KV namespaces required by the selected template or plugin set.
5. Confirm custom domains and DNS ownership.
6. Confirm TLS, WAF, and access policies are in place before public cutover.

## Binding Matrix

| Binding / value | Purpose | Source of truth | Notes |
| --- | --- | --- | --- |
| `D1` / database binding | Primary application database | template `wrangler.jsonc` | Keep the committed ID aligned with the intended example deployment target |
| `MEDIA` | Media object storage | template `wrangler.jsonc` | Backed by R2 |
| `LOADER` | Worker Loader / plugin sandbox support | template `wrangler.jsonc` | Keep prepared even if no sandboxed plugin is active yet |
| session namespace or equivalent | Session storage | template config / deployment env | Keep the committed ID aligned with the intended example deployment target |
| public app hostname | User-facing site domain | DNS + Worker route config | Example: `awcms-micro.ahlikoding.com` |
| storage hostname | Public storage edge domain | DNS + R2/public edge config | Example: `awcms-micro-s3.ahlikoding.com` |

## Secrets And Variables

Keep real values in Cloudflare secrets, CI secrets, or local operator environment files.

Suggested categories:

- deploy token
- account and zone identifiers
- OAuth or email provider secrets
- session or signing secrets
- database identifiers if you do not want them committed

## Provisioning Sequence

1. Validate the local workspace with `bash scripts/validate-awcmsmicro-dev.sh`.
2. Open `awcmsmicro-dev/templates/awcms-micro-default-cloudflare/` and review the committed bindings in `wrangler.jsonc`.
3. Create the D1 database if needed.
4. Create the R2 bucket if needed.
5. Inject real binding identifiers locally or in CI.
6. Confirm template dependencies and plugin registrations still match the intended deployment shape.
7. Build locally.
8. Deploy to the target Worker.
9. Run smoke checks.
10. Promote DNS or custom-domain routing only after smoke checks pass.

```mermaid
flowchart TD
  Validate[Validate local workspace] --> Bindings[Review wrangler bindings]
  Bindings --> Resources[Confirm D1, R2, KV, domains]
  Resources --> Secrets[Inject secrets outside git]
  Secrets --> Build[Build template]
  Build --> DryRun[Run wrangler deploy --dry-run]
  DryRun --> Deploy[Deploy Worker]
  Deploy --> Smoke[Run smoke checks]
  Smoke -->|Pass| Cutover[Promote route or DNS]
  Smoke -->|Fail| Rollback[Rollback and restore previous state]
```

## Latest Local/Production Consistency Audit

The 2026-07-02 sync verified the checked-in Cloudflare deployment shape locally:

- `pnpm --dir awcmsmicro-dev/templates/awcms-micro-default-cloudflare validate:cloudflare-env` passed without requiring credentials.
- `pnpm --dir awcmsmicro-dev/templates/awcms-micro-default-cloudflare test` passed.
- `pnpm --dir awcmsmicro-dev/templates/awcms-micro-default-cloudflare build` passed.
- `pnpm --dir awcmsmicro-dev/templates/awcms-micro-default-cloudflare exec wrangler deploy --dry-run` passed with Wrangler `4.100.0` and reported the expected `SESSION`, `DB`, `MEDIA`, `IMAGES`, `ASSETS`, `LOADER`, and production `AWCMS_MICRO_*` bindings.

Production was later observed on Worker version `5be81778-b5ba-45e5-aa1c-164655845a5d`, deployed at `2026-07-02T04:14:49.517603Z`. D1 migrations 044-048 were applied and verified against `awcms-micro-d1-20260530`; see `docs/upstream-sync/EMDASH_0_26_D1_MIGRATION_VERIFICATION.md`.

## Pre-Deploy Checks

Before any production deploy, confirm all of the following:

- `awcmsmicro-dev` is synced to the intended upstream EmDash snapshot
- the selected plugins and templates are within approved boundaries
- no secrets are staged in tracked files
- the template still points at the intended committed example bindings and domains
- secrets and private credentials are injected only through local or CI configuration
- the D1 schema is compatible with the target release
- the R2 bucket and public media access model are confirmed

## Deploy Procedure

From `awcmsmicro-dev/templates/awcms-micro-default-cloudflare/`:

1. Run `pnpm typecheck`.
2. Run `pnpm build`.
3. Run `pnpm deploy`.
4. Record the deployment time, operator, and template/plugin versions in your operational notes.

## Smoke Checks

Minimum checks after deploy:

- `GET /` returns the public homepage
- `GET /posts` returns the posts index
- `GET /news` returns the news index
- `GET /aggregate` returns the public-safe summary page
- `GET /about` returns the published page route
- `GET /_emdash/admin` redirects unauthenticated users to `/_emdash/admin/login`
- `GET /_emdash/api/plugins/awcms-micro-sikesra/public/status` returns the public-safe plugin response
- media upload and retrieval work against the configured R2 bucket

Latest recorded production deployment verification on 2026-07-02 used Worker version `5be81778-b5ba-45e5-aa1c-164655845a5d` and confirmed public smoke checks, setup/auth mode checks, remote D1 `_emdash_migrations` count `47`, and schema objects for migrations 044-048.

## Rollback Procedure

1. Re-deploy the previously known-good Worker artifact or commit.
2. Restore the previous route or custom-domain binding if routing changed.
3. If the issue is template-owned, revert the template change and re-deploy.
4. If the issue is plugin-owned, disable or revert the affected plugin release and re-deploy.
5. If the issue is data-layer related, restore the last known-good D1 backup or re-run reviewed forward migrations against a replacement database.
6. Re-run the smoke checks before declaring recovery complete.

## Incident Notes To Capture

For each failed deployment or rollback, capture:

- operator
- timestamp
- target environment
- deployed commit or package version
- failing route or binding
- whether the fault was plugin-owned, template-owned, or infrastructure-owned
- remediation steps taken

## Security Rule

Never commit live Cloudflare tokens, secret values, or private credentials to repository documentation. Treat committed non-secret binding IDs as operational identifiers and review them before deploy.

## Deploy Token

Use a dedicated GitHub secret named `CLOUDFLARE_DEPLOY_TOKEN` for the deploy workflow. Keep the token value out of git; if you need to bootstrap it from a local `.env`, load it in your shell and set the secret from there.
