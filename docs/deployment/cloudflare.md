# Cloudflare Deployment Runbook

This document describes the Cloudflare deployment model for AWCMS-Micro example environments.

## Scope

This runbook applies to AWCMS-Micro example deployments built from plugin and template boundaries, especially `awcmsmicro-dev/templates/awcms-micro-default-cloudflare/`.

## Example Production Shape

- Base domain: `awcms-micro.ahlikoding.com`
- Storage domain: `awcms-micro-s3.ahlikoding.com`
- D1 database name: `awcms-micro-d1`

Use committed placeholders only. Keep real identifiers and credentials outside git.

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
| `D1` / database binding | Primary application database | template `wrangler.jsonc` | Use placeholder IDs in git |
| `MEDIA` | Media object storage | template `wrangler.jsonc` | Backed by R2 |
| `LOADER` | Worker Loader / plugin sandbox support | template `wrangler.jsonc` | Keep prepared even if no sandboxed plugin is active yet |
| session namespace or equivalent | Session storage | template config / deployment env | Keep final ID outside committed docs when sensitive |
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
2. Open `awcmsmicro-dev/templates/awcms-micro-default-cloudflare/` and review `wrangler.jsonc` placeholders.
3. Create the D1 database if needed.
4. Create the R2 bucket if needed.
5. Inject real binding identifiers locally or in CI.
6. Confirm template dependencies and plugin registrations still match the intended deployment shape.
7. Build locally.
8. Deploy to the target Worker.
9. Run smoke checks.
10. Promote DNS or custom-domain routing only after smoke checks pass.

## Pre-Deploy Checks

Before any production deploy, confirm all of the following:

- `awcmsmicro-dev` is synced to the intended upstream EmDash snapshot
- the selected plugins and templates are within approved boundaries
- no secrets are staged in tracked files
- the template still points at placeholder-safe committed values
- real IDs and secrets are injected only through local or CI configuration
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
- `GET /_emdash/api/plugins/awcms-micro-example/public/status` returns the public-safe plugin response
- media upload and retrieval work against the configured R2 bucket

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

Never commit live Cloudflare tokens, account IDs, zone IDs, database IDs, or private credentials to repository documentation. Use placeholders in committed examples.

## Deploy Token

Use a dedicated GitHub secret named `CLOUDFLARE_DEPLOY_TOKEN` for the deploy workflow. Keep the token value out of git; if you need to bootstrap it from a local `.env`, load it in your shell and set the secret from there.
