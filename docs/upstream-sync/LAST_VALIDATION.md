# Last Validation

## Validation Run Metadata

- Date:
  - Started: 2026-05-22T12:45:42Z
  - Completed: 2026-05-22T12:47:38Z
- Operator: Placeholder: update manually if needed
- Branch: `main`
- Upstream commit SHA: `b70df0d8047583b2ee781223dae2a31fcb9a6784`
- Validation scope: `awcmsmicro-dev` workspace validation

## Commands

```bash
bash scripts/validate-awcmsmicro-dev.sh
bash -n scripts/update-emdash-latest.sh
bash -n scripts/update-awcmsmicro-dev.sh
bash -n scripts/validate-awcmsmicro-dev.sh
bash -n scripts/sync-and-validate-awcmsmicro-dev.sh
```

## Result Summary

- Overall status: Failed
- Notes: Current step: pnpm-test

## Failure Classification

| Category | Status | Details |
| --- | --- | --- |
| Script failure | Not triggered | Validation wrapper or shell orchestration failure |
| Dependency install failure | Not triggered | `pnpm install` failed |
| Upstream EmDash test failure | Failed | `pnpm --filter @emdash-cms/admin exec node --run locale:compile` or `pnpm test` failed |
| AWCMS-Micro added file failure | Not triggered | `pnpm --filter emdash build`, `pnpm typecheck`, `pnpm lint:quick`, or `pnpm build` failed |

## Detailed Output

```text
$ pnpm install
==> pnpm-install
Scope: all 58 workspace projects
[WARN] There are cyclic workspace dependencies: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/auth-atproto, /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/core
packages/workerd                         | [WARN] Could not find preferred package kysely@0.27.6 in lockfile
Progress: resolved 1, reused 0, downloaded 0, added 0
Progress: resolved 79, reused 79, downloaded 0, added 0
Progress: resolved 141, reused 141, downloaded 0, added 0
Progress: resolved 170, reused 170, downloaded 0, added 0
Progress: resolved 181, reused 181, downloaded 0, added 0
Progress: resolved 182, reused 182, downloaded 0, added 0
Progress: resolved 183, reused 183, downloaded 0, added 0
Progress: resolved 229, reused 204, downloaded 0, added 0
Progress: resolved 556, reused 485, downloaded 0, added 0
Progress: resolved 796, reused 688, downloaded 0, added 0
Progress: resolved 1198, reused 975, downloaded 0, added 0
Progress: resolved 1480, reused 1226, downloaded 0, added 0
Progress: resolved 1757, reused 1469, downloaded 0, added 0
Progress: resolved 1806, reused 1518, downloaded 0, added 0
Progress: resolved 1812, reused 1524, downloaded 0, added 0
Progress: resolved 1813, reused 1524, downloaded 0, added 0
Progress: resolved 1813, reused 1525, downloaded 0, added 0
[WARN] 5 deprecated subdependencies found: glob@11.1.0, node-domexception@1.0.0, prebuild-install@7.1.3, tar@6.2.1, whatwg-encoding@3.1.1
Already up to date
Progress: resolved 1813, reused 1525, downloaded 0, added 0, done
packages/plugins/awcms-micro-example prepare$ node --run build
packages/plugins/awcms-micro-example prepare: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/plugins/awcms-micro-example prepare: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-example/tsdown.config.ts[24m 
packages/plugins/awcms-micro-example prepare: [34mℹ[39m entry: [34msrc/index.ts, src/admin.tsx, src/sandbox.ts[39m
packages/plugins/awcms-micro-example prepare: [34mℹ[39m target: [34mes2023[39m
packages/plugins/awcms-micro-example prepare: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/awcms-micro-example prepare: [34mℹ[39m Build start
packages/plugins/awcms-micro-example prepare: [34mℹ[39m Cleaning 7 files
packages/plugins/awcms-micro-example prepare: [34mℹ[39m [2mdist/[22m[1madmin.js[22m             [2m54.25 kB[22m [2m│ gzip: 6.68 kB[22m
packages/plugins/awcms-micro-example prepare: [34mℹ[39m [2mdist/[22m[1mindex.js[22m             [2m 1.69 kB[22m [2m│ gzip: 0.64 kB[22m
packages/plugins/awcms-micro-example prepare: [34mℹ[39m [2mdist/[22m[1msandbox.js[22m           [2m 0.26 kB[22m [2m│ gzip: 0.18 kB[22m
packages/plugins/awcms-micro-example prepare: [34mℹ[39m [2mdist/[22mruntime-BW0VeIkA.js  [2m41.37 kB[22m [2m│ gzip: 8.04 kB[22m
packages/plugins/awcms-micro-example prepare: [34mℹ[39m [2mdist/[22m[32m[1msandbox.d.ts[22m[39m         [2m 2.23 kB[22m [2m│ gzip: 0.50 kB[22m
packages/plugins/awcms-micro-example prepare: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.ts[22m[39m           [2m 0.51 kB[22m [2m│ gzip: 0.23 kB[22m
packages/plugins/awcms-micro-example prepare: [34mℹ[39m [2mdist/[22m[32m[1madmin.d.ts[22m[39m           [2m 0.27 kB[22m [2m│ gzip: 0.16 kB[22m
packages/plugins/awcms-micro-example prepare: [34mℹ[39m 7 files, total: 100.58 kB
packages/plugins/awcms-micro-example prepare: [32m✔[39m Build complete in [32m1594ms[39m
packages/plugins/awcms-micro-example prepare: Done
[WARN] Issues with peer dependencies found. Run "pnpm peers check" to list them.

Done in 23.5s using pnpm v11.1.3
$ pnpm --filter emdash build
==> pnpm-build-emdash
$ tsdown
[34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
[34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/core/tsdown.config.ts[24m 
[34mℹ[39m entry: [34msrc/index.ts, src/request-context.ts, src/astro/index.ts, src/astro/middleware.ts, src/astro/middleware/setup.ts, src/astro/middleware/auth.ts, src/astro/middleware/redirect.ts, src/astro/middleware/request-context.ts, src/astro/types.ts, src/db/index.ts, src/db/sqlite.ts, src/db/libsql.ts, src/db/postgres.ts, src/database/instrumentation.ts, src/storage/local.ts, src/storage/s3.ts, src/media/index.ts, src/media/local-runtime.ts, src/runtime.ts, src/seed/index.ts, src/cli/index.ts, src/client/index.ts, src/client/cf-access.ts, src/seo/index.ts, src/page/index.ts, src/plugin-utils.ts, src/plugin-types.ts, src/plugins/adapt-sandbox-entry.ts, src/api/route-utils.ts, src/api/schemas/index.ts, src/auth/providers/github.ts, src/auth/providers/google.ts[39m
[34mℹ[39m tsconfig: [34mtsconfig.json[39m
[34mℹ[39m Build start
[34mℹ[39m Cleaning 1080 files
[34mℹ[39m Granting execute permission to [4mdist/cli/index.mjs[24m
[34mℹ[39m [2mdist/[22m[1mcli/index.mjs[22m                                                            [2m140.16 kB[22m [2m│ gzip: 35.03 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/middleware.mjs[22m                                                     [2m 94.98 kB[22m [2m│ gzip: 24.50 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/openapi.json.mjs[22m                                        [2m 90.30 kB[22m [2m│ gzip: 14.39 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/mcp.mjs[22m                                                 [2m 67.85 kB[22m [2m│ gzip: 15.05 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/index.mjs[22m                                                          [2m 62.05 kB[22m [2m│ gzip: 14.45 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/middleware/request-context.mjs[22m                                     [2m 41.28 kB[22m [2m│ gzip: 10.36 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/execute.mjs[22m                            [2m 26.37 kB[22m [2m│ gzip:  8.18 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/middleware/auth.mjs[22m                                                [2m 21.70 kB[22m [2m│ gzip:  5.99 kB[22m
[34mℹ[39m [2mdist/[22m[1mpage/index.mjs[22m                                                           [2m 13.75 kB[22m [2m│ gzip:  4.05 kB[22m
[34mℹ[39m [2mdist/[22m[1mclient/index.mjs[22m                                                         [2m 12.89 kB[22m [2m│ gzip:  3.52 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/authorize.mjs[22m                                     [2m 11.85 kB[22m [2m│ gzip:  3.50 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/analyze.mjs[22m                            [2m  9.96 kB[22m [2m│ gzip:  3.36 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/snapshot.mjs[22m                                            [2m  9.27 kB[22m [2m│ gzip:  3.56 kB[22m
[34mℹ[39m [2mdist/[22m[1mindex.mjs[22m                                                                [2m  8.41 kB[22m [2m│ gzip:  2.56 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/comments/_collection_/_contentId_/index.mjs[22m             [2m  8.32 kB[22m [2m│ gzip:  2.58 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress-plugin/execute.mjs[22m                     [2m  8.06 kB[22m [2m│ gzip:  2.71 kB[22m
[34mℹ[39m [2mdist/[22m[1mapi/schemas/index.mjs[22m                                                    [2m  7.82 kB[22m [2m│ gzip:  1.87 kB[22m
[34mℹ[39m [2mdist/[22m[1mstorage/s3.mjs[22m                                                           [2m  7.78 kB[22m [2m│ gzip:  2.79 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/media.mjs[22m                              [2m  6.55 kB[22m [2m│ gzip:  2.13 kB[22m
[34mℹ[39m [2mdist/[22m[1mplugins/adapt-sandbox-entry.mjs[22m                                          [2m  5.86 kB[22m [2m│ gzip:  2.20 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/media.mjs[22m                                               [2m  5.73 kB[22m [2m│ gzip:  2.12 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/oauth/_provider_/callback.mjs[22m                      [2m  5.73 kB[22m [2m│ gzip:  2.03 kB[22m
[34mℹ[39m [2mdist/[22m[1mclient/cf-access.mjs[22m                                                     [2m  5.69 kB[22m [2m│ gzip:  2.17 kB[22m
[34mℹ[39m [2mdist/[22m[1mstorage/local.mjs[22m                                                        [2m  5.56 kB[22m [2m│ gzip:  2.04 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/rewrite-urls.mjs[22m                       [2m  5.51 kB[22m [2m│ gzip:  1.80 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_.mjs[22m                           [2m  5.01 kB[22m [2m│ gzip:  1.43 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/dev-bypass.mjs[22m                                    [2m  5.00 kB[22m [2m│ gzip:  1.99 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/token.mjs[22m                                         [2m  4.98 kB[22m [2m│ gzip:  1.68 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/register.mjs[22m                                      [2m  4.42 kB[22m [2m│ gzip:  1.65 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/_id_/index.mjs[22m                              [2m  4.36 kB[22m [2m│ gzip:  1.45 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/prepare.mjs[22m                            [2m  4.34 kB[22m [2m│ gzip:  1.62 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/settings/email.mjs[22m                                      [2m  4.32 kB[22m [2m│ gzip:  1.72 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs[22m          [2m  4.11 kB[22m [2m│ gzip:  1.38 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/rewrite-url-helpers.mjs[22m                [2m  4.02 kB[22m [2m│ gzip:  1.41 kB[22m
[34mℹ[39m [2mdist/[22m[1mmedia/local-runtime.mjs[22m                                                  [2m  3.75 kB[22m [2m│ gzip:  1.17 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/index.mjs[22m                                         [2m  3.71 kB[22m [2m│ gzip:  1.41 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/_slug_/index.mjs[22m                     [2m  3.69 kB[22m [2m│ gzip:  1.12 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/admin-verify.mjs[22m                                  [2m  3.68 kB[22m [2m│ gzip:  1.39 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/_name_/widgets/_id_.mjs[22m                    [2m  3.64 kB[22m [2m│ gzip:  1.10 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs[22m        [2m  3.60 kB[22m [2m│ gzip:  1.02 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/upload-url.mjs[22m                                    [2m  3.53 kB[22m [2m│ gzip:  1.47 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/register/verify.mjs[22m                        [2m  3.51 kB[22m [2m│ gzip:  1.35 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/registry/install.mjs[22m                      [2m  3.50 kB[22m [2m│ gzip:  1.35 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/_id_/status.mjs[22m                          [2m  3.48 kB[22m [2m│ gzip:  1.30 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/registry/_id_/update.mjs[22m                  [2m  3.47 kB[22m [2m│ gzip:  1.26 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/marketplace/_id_/install.mjs[22m              [2m  3.46 kB[22m [2m│ gzip:  1.29 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/_id_.mjs[22m                                          [2m  3.42 kB[22m [2m│ gzip:  1.03 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/taxonomies/_name_/terms/_slug_/translations.mjs[22m         [2m  3.42 kB[22m [2m│ gzip:  1.11 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/taxonomies/_name_/terms/_slug_.mjs[22m                      [2m  3.37 kB[22m [2m│ gzip:  0.94 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/schedule.mjs[22m                  [2m  3.19 kB[22m [2m│ gzip:  1.01 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/preview-url.mjs[22m               [2m  3.19 kB[22m [2m│ gzip:  1.32 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/update.mjs[22m                           [2m  3.18 kB[22m [2m│ gzip:  1.18 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/providers/_providerId_/index.mjs[22m                  [2m  3.15 kB[22m [2m│ gzip:  1.14 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/bylines/_id_/index.mjs[22m                            [2m  3.14 kB[22m [2m│ gzip:  1.03 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/_slug_/fields/index.mjs[22m              [2m  3.07 kB[22m [2m│ gzip:  0.97 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/admin.mjs[22m                                         [2m  3.06 kB[22m [2m│ gzip:  1.23 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/updates.mjs[22m                               [2m  3.04 kB[22m [2m│ gzip:  1.11 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/index.mjs[22m                          [2m  3.02 kB[22m [2m│ gzip:  1.13 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/oauth/_provider_.mjs[22m                               [2m  3.00 kB[22m [2m│ gzip:  1.17 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/oauth-clients/_id_.mjs[22m                            [2m  3.00 kB[22m [2m│ gzip:  0.97 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/registry/_id_/uninstall.mjs[22m               [2m  2.98 kB[22m [2m│ gzip:  1.07 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/plugins/_pluginId_/_...path_.mjs[22m                        [2m  2.96 kB[22m [2m│ gzip:  1.32 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/middleware/redirect.mjs[22m                                            [2m  2.93 kB[22m [2m│ gzip:  1.24 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/themes/marketplace/index.mjs[22m                      [2m  2.87 kB[22m [2m│ gzip:  1.09 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/uninstall.mjs[22m                        [2m  2.87 kB[22m [2m│ gzip:  1.08 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/enable.mjs[22m                           [2m  2.86 kB[22m [2m│ gzip:  1.06 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/allowed-domains/_domain_.mjs[22m                      [2m  2.85 kB[22m [2m│ gzip:  0.98 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/sitemap-_collection_.xml.mjs[22m                                [2m  2.82 kB[22m [2m│ gzip:  1.24 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/index.mjs[22m                            [2m  2.81 kB[22m [2m│ gzip:  0.97 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/publish.mjs[22m                   [2m  2.80 kB[22m [2m│ gzip:  1.14 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/redirects/_id_.mjs[22m                                      [2m  2.79 kB[22m [2m│ gzip:  0.84 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/_id_.mjs[22m                                   [2m  2.77 kB[22m [2m│ gzip:  0.98 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/signup/complete.mjs[22m                                [2m  2.77 kB[22m [2m│ gzip:  1.15 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/allowed-domains/index.mjs[22m                         [2m  2.76 kB[22m [2m│ gzip:  1.05 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/invite/complete.mjs[22m                                [2m  2.75 kB[22m [2m│ gzip:  1.13 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/dev-bypass.mjs[22m                                     [2m  2.72 kB[22m [2m│ gzip:  1.26 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/_slug_/fields/reorder.mjs[22m            [2m  2.71 kB[22m [2m│ gzip:  0.94 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress-plugin/analyze.mjs[22m                     [2m  2.71 kB[22m [2m│ gzip:  1.14 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/marketplace/index.mjs[22m                     [2m  2.69 kB[22m [2m│ gzip:  1.00 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/disable.mjs[22m                          [2m  2.69 kB[22m [2m│ gzip:  1.00 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/typegen.mjs[22m                                             [2m  2.66 kB[22m [2m│ gzip:  1.06 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_/translations.mjs[22m                           [2m  2.65 kB[22m [2m│ gzip:  0.93 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/options.mjs[22m                                [2m  2.59 kB[22m [2m│ gzip:  1.07 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/orphans/_slug_.mjs[22m                               [2m  2.58 kB[22m [2m│ gzip:  0.98 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/register/options.mjs[22m                       [2m  2.57 kB[22m [2m│ gzip:  1.06 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/sections/_slug_.mjs[22m                                     [2m  2.57 kB[22m [2m│ gzip:  0.78 kB[22m
[34mℹ[39m [2mdist/[22m[1mplugin-utils.mjs[22m                                                         [2m  2.57 kB[22m [2m│ gzip:  1.19 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/marketplace/_id_/index.mjs[22m                [2m  2.55 kB[22m [2m│ gzip:  0.93 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/index.mjs[22m                                        [2m  2.54 kB[22m [2m│ gzip:  1.11 kB[22m
[34mℹ[39m [2mdist/[22m[1mseo/index.mjs[22m                                                            [2m  2.53 kB[22m [2m│ gzip:  1.02 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/themes/marketplace/_id_/index.mjs[22m                 [2m  2.53 kB[22m [2m│ gzip:  0.93 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/index.mjs[22m                                  [2m  2.52 kB[22m [2m│ gzip:  1.00 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/bylines/index.mjs[22m                                 [2m  2.51 kB[22m [2m│ gzip:  1.01 kB[22m
[34mℹ[39m [2mdist/[22m[1mdatabase/instrumentation.mjs[22m                                             [2m  2.51 kB[22m [2m│ gzip:  1.22 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/redirects/404s/index.mjs[22m                                [2m  2.47 kB[22m [2m│ gzip:  0.80 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/taxonomies/_name_/terms/index.mjs[22m                       [2m  2.47 kB[22m [2m│ gzip:  0.89 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/verify.mjs[22m                                 [2m  2.46 kB[22m [2m│ gzip:  1.01 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/index.mjs[22m                            [2m  2.44 kB[22m [2m│ gzip:  0.93 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/_id_/confirm.mjs[22m                                  [2m  2.43 kB[22m [2m│ gzip:  1.07 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_.mjs[22m                                        [2m  2.40 kB[22m [2m│ gzip:  0.75 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/sitemap.xml.mjs[22m                                             [2m  2.40 kB[22m [2m│ gzip:  1.10 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/magic-link/send.mjs[22m                                [2m  2.40 kB[22m [2m│ gzip:  0.98 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/status.mjs[22m                                        [2m  2.39 kB[22m [2m│ gzip:  1.03 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/hooks/exclusive/_hookName_.mjs[22m                    [2m  2.36 kB[22m [2m│ gzip:  1.04 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/providers/_providerId_/_itemId_.mjs[22m               [2m  2.36 kB[22m [2m│ gzip:  0.78 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/_name_/widgets.mjs[22m                         [2m  2.35 kB[22m [2m│ gzip:  1.02 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/invite/index.mjs[22m                                   [2m  2.31 kB[22m [2m│ gzip:  1.06 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/invite/register-options.mjs[22m                        [2m  2.31 kB[22m [2m│ gzip:  1.01 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/settings.mjs[22m                                            [2m  2.27 kB[22m [2m│ gzip:  0.91 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/signup/request.mjs[22m                                 [2m  2.26 kB[22m [2m│ gzip:  0.98 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_/items/_id_.mjs[22m                             [2m  2.23 kB[22m [2m│ gzip:  0.77 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/index.mjs[22m                                 [2m  2.23 kB[22m [2m│ gzip:  0.88 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/oauth-clients/index.mjs[22m                           [2m  2.20 kB[22m [2m│ gzip:  0.91 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/taxonomies/index.mjs[22m                                    [2m  2.17 kB[22m [2m│ gzip:  0.82 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/orphans/index.mjs[22m                                [2m  2.17 kB[22m [2m│ gzip:  0.82 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/themes/preview.mjs[22m                                      [2m  2.15 kB[22m [2m│ gzip:  0.98 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/_name_.mjs[22m                                 [2m  2.15 kB[22m [2m│ gzip:  0.79 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/rebuild.mjs[22m                                      [2m  2.14 kB[22m [2m│ gzip:  0.92 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/api-tokens/index.mjs[22m                              [2m  2.13 kB[22m [2m│ gzip:  0.93 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/redirects/index.mjs[22m                                     [2m  2.12 kB[22m [2m│ gzip:  0.78 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/_id_/send-recovery.mjs[22m                      [2m  2.03 kB[22m [2m│ gzip:  0.96 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/device/token.mjs[22m                                  [2m  2.01 kB[22m [2m│ gzip:  0.94 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/index.mjs[22m                                        [2m  2.00 kB[22m [2m│ gzip:  0.95 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/index.mjs[22m                                   [2m  1.99 kB[22m [2m│ gzip:  0.94 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/enable.mjs[22m                                       [2m  1.97 kB[22m [2m│ gzip:  0.86 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/_id_/disable.mjs[22m                            [2m  1.96 kB[22m [2m│ gzip:  0.90 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/sections/index.mjs[22m                                      [2m  1.93 kB[22m [2m│ gzip:  0.73 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/_name_/reorder.mjs[22m                         [2m  1.92 kB[22m [2m│ gzip:  0.87 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/robots.txt.mjs[22m                                              [2m  1.88 kB[22m [2m│ gzip:  0.84 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/middleware/setup.mjs[22m                                               [2m  1.86 kB[22m [2m│ gzip:  0.86 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/file/_...key_.mjs[22m                                 [2m  1.84 kB[22m [2m│ gzip:  0.95 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/duplicate.mjs[22m                 [2m  1.81 kB[22m [2m│ gzip:  0.77 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/device/code.mjs[22m                                   [2m  1.80 kB[22m [2m│ gzip:  0.84 kB[22m
[34mℹ[39m [2mdist/[22m[1mrequest-context.mjs[22m                                                      [2m  1.76 kB[22m [2m│ gzip:  0.90 kB[22m
[34mℹ[39m [2mdist/[22m[1mapi/route-utils.mjs[22m                                                      [2m  1.76 kB[22m [2m│ gzip:  0.84 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/restore.mjs[22m                   [2m  1.72 kB[22m [2m│ gzip:  0.74 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/discard-draft.mjs[22m             [2m  1.71 kB[22m [2m│ gzip:  0.74 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/_id_.mjs[22m                                 [2m  1.70 kB[22m [2m│ gzip:  0.66 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/unpublish.mjs[22m                 [2m  1.70 kB[22m [2m│ gzip:  0.73 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/suggest.mjs[22m                                      [2m  1.67 kB[22m [2m│ gzip:  0.82 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/index.mjs[22m                                         [2m  1.65 kB[22m [2m│ gzip:  0.68 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/magic-link/verify.mjs[22m                              [2m  1.65 kB[22m [2m│ gzip:  0.71 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/revisions/_revisionId_/restore.mjs[22m                      [2m  1.64 kB[22m [2m│ gzip:  0.70 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/translations.mjs[22m              [2m  1.58 kB[22m [2m│ gzip:  0.77 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs[22m             [2m  1.56 kB[22m [2m│ gzip:  0.75 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/manifest.mjs[22m                                            [2m  1.56 kB[22m [2m│ gzip:  0.80 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/marketplace/_id_/icon.mjs[22m                 [2m  1.54 kB[22m [2m│ gzip:  0.74 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/index.mjs[22m                                [2m  1.48 kB[22m [2m│ gzip:  0.68 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/bulk.mjs[22m                                 [2m  1.47 kB[22m [2m│ gzip:  0.66 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/hooks/exclusive/index.mjs[22m                         [2m  1.45 kB[22m [2m│ gzip:  0.72 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/redirects/404s/summary.mjs[22m                              [2m  1.45 kB[22m [2m│ gzip:  0.66 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/me.mjs[22m                                             [2m  1.44 kB[22m [2m│ gzip:  0.67 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_/reorder.mjs[22m                                [2m  1.43 kB[22m [2m│ gzip:  0.66 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_/items.mjs[22m                                  [2m  1.42 kB[22m [2m│ gzip:  0.67 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/probe.mjs[22m                                        [2m  1.37 kB[22m [2m│ gzip:  0.66 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/well-known/auth.mjs[22m                                     [2m  1.37 kB[22m [2m│ gzip:  0.66 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/device/authorize.mjs[22m                              [2m  1.34 kB[22m [2m│ gzip:  0.69 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/signup/verify.mjs[22m                                  [2m  1.32 kB[22m [2m│ gzip:  0.71 kB[22m
[34mℹ[39m [2mdist/[22m[1mruntime.mjs[22m                                                              [2m  1.32 kB[22m [2m│ gzip:  0.64 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/invite/accept.mjs[22m                                  [2m  1.28 kB[22m [2m│ gzip:  0.68 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/_id_/enable.mjs[22m                             [2m  1.28 kB[22m [2m│ gzip:  0.67 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/api-tokens/_id_.mjs[22m                               [2m  1.24 kB[22m [2m│ gzip:  0.66 kB[22m
[34mℹ[39m [2mdist/[22m[1mdb/index.mjs[22m                                                             [2m  1.22 kB[22m [2m│ gzip:  0.56 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/token/refresh.mjs[22m                                 [2m  1.19 kB[22m [2m│ gzip:  0.62 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/well-known/oauth-authorization-server.mjs[22m               [2m  1.18 kB[22m [2m│ gzip:  0.58 kB[22m
[34mℹ[39m [2mdist/[22m[1mmedia/index.mjs[22m                                                          [2m  1.18 kB[22m [2m│ gzip:  0.59 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/trash.mjs[22m                          [2m  1.16 kB[22m [2m│ gzip:  0.57 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/token/revoke.mjs[22m                                  [2m  1.14 kB[22m [2m│ gzip:  0.60 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/index.mjs[22m                                  [2m  1.07 kB[22m [2m│ gzip:  0.60 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/revisions.mjs[22m                 [2m  1.04 kB[22m [2m│ gzip:  0.56 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/stats.mjs[22m                                        [2m  1.03 kB[22m [2m│ gzip:  0.56 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/permanent.mjs[22m                 [2m  1.02 kB[22m [2m│ gzip:  0.53 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/dev-reset.mjs[22m                                     [2m  1.01 kB[22m [2m│ gzip:  0.56 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/dashboard.mjs[22m                                           [2m  0.99 kB[22m [2m│ gzip:  0.53 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress-plugin/callback.mjs[22m                    [2m  0.97 kB[22m [2m│ gzip:  0.53 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/counts.mjs[22m                               [2m  0.95 kB[22m [2m│ gzip:  0.49 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/mode.mjs[22m                                           [2m  0.94 kB[22m [2m│ gzip:  0.56 kB[22m
[34mℹ[39m [2mdist/[22m[1mseed/index.mjs[22m                                                           [2m  0.88 kB[22m [2m│ gzip:  0.40 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/compare.mjs[22m                   [2m  0.84 kB[22m [2m│ gzip:  0.47 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/dev/emails.mjs[22m                                          [2m  0.83 kB[22m [2m│ gzip:  0.41 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/logout.mjs[22m                                         [2m  0.81 kB[22m [2m│ gzip:  0.47 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/revisions/_revisionId_/index.mjs[22m                        [2m  0.78 kB[22m [2m│ gzip:  0.45 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/providers/index.mjs[22m                               [2m  0.77 kB[22m [2m│ gzip:  0.45 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/well-known/oauth-protected-resource.mjs[22m                 [2m  0.74 kB[22m [2m│ gzip:  0.46 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/PluginRegistry.mjs[22m                                          [2m  0.73 kB[22m [2m│ gzip:  0.41 kB[22m
[34mℹ[39m [2mdist/[22m[1mdb/postgres.mjs[22m                                                          [2m  0.69 kB[22m [2m│ gzip:  0.36 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-components.mjs[22m                                   [2m  0.61 kB[22m [2m│ gzip:  0.36 kB[22m
[34mℹ[39m [2mdist/[22m[1mdb/sqlite.mjs[22m                                                            [2m  0.52 kB[22m [2m│ gzip:  0.32 kB[22m
[34mℹ[39m [2mdist/[22m[1mauth/providers/github.mjs[22m                                                [2m  0.44 kB[22m [2m│ gzip:  0.29 kB[22m
[34mℹ[39m [2mdist/[22m[1mauth/providers/google.mjs[22m                                                [2m  0.44 kB[22m [2m│ gzip:  0.29 kB[22m
[34mℹ[39m [2mdist/[22m[1mdb/libsql.mjs[22m                                                            [2m  0.44 kB[22m [2m│ gzip:  0.28 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/types.mjs[22m                                                          [2m  0.01 kB[22m [2m│ gzip:  0.03 kB[22m
[34mℹ[39m [2mdist/[22m[1mplugin-types.mjs[22m                                                         [2m  0.01 kB[22m [2m│ gzip:  0.03 kB[22m
[34mℹ[39m [2mdist/[22mapi-BA_sBu7N.mjs.map                                                     [2m295.13 kB[22m [2m│ gzip: 63.45 kB[22m
[34mℹ[39m [2mdist/[22mcli/index.mjs.map                                                        [2m279.18 kB[22m [2m│ gzip: 63.71 kB[22m
[34mℹ[39m [2mdist/[22mrunner-0xM5n5fG.mjs.map                                                  [2m219.88 kB[22m [2m│ gzip: 41.38 kB[22m
[34mℹ[39m [2mdist/[22mastro/middleware.mjs.map                                                 [2m209.80 kB[22m [2m│ gzip: 53.45 kB[22m
[34mℹ[39m [2mdist/[22mmenus-QBJvVSp2.mjs.map                                                   [2m183.91 kB[22m [2m│ gzip: 40.93 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/openapi.json.mjs.map                                    [2m170.24 kB[22m [2m│ gzip: 23.57 kB[22m
[34mℹ[39m [2mdist/[22mapi-BA_sBu7N.mjs                                                         [2m140.14 kB[22m [2m│ gzip: 31.62 kB[22m
[34mℹ[39m [2mdist/[22mastro/index.mjs.map                                                      [2m134.06 kB[22m [2m│ gzip: 32.04 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/mcp.mjs.map                                             [2m126.25 kB[22m [2m│ gzip: 24.50 kB[22m
[34mℹ[39m [2mdist/[22mrunner-0xM5n5fG.mjs                                                      [2m113.20 kB[22m [2m│ gzip: 21.94 kB[22m
[34mℹ[39m [2mdist/[22mimport-CNfLOgDE.mjs.map                                                  [2m112.07 kB[22m [2m│ gzip: 25.69 kB[22m
[34mℹ[39m [2mdist/[22mredirects-Dmj6KRU3.mjs.map                                               [2m 92.02 kB[22m [2m│ gzip: 15.27 kB[22m
[34mℹ[39m [2mdist/[22mmenus-QBJvVSp2.mjs                                                       [2m 85.50 kB[22m [2m│ gzip: 19.62 kB[22m
[34mℹ[39m [2mdist/[22mcontext-l57bJzuj.mjs.map                                                 [2m 66.66 kB[22m [2m│ gzip: 15.80 kB[22m
[34mℹ[39m [2mdist/[22mcontent-CUKtTvlp.mjs.map                                                 [2m 62.23 kB[22m [2m│ gzip: 13.27 kB[22m
[34mℹ[39m [2mdist/[22mapply-C0ifQTsT.mjs.map                                                   [2m 60.88 kB[22m [2m│ gzip: 15.23 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/execute.mjs.map                        [2m 59.52 kB[22m [2m│ gzip: 17.63 kB[22m
[34mℹ[39m [2mdist/[22mregistry-BG-HY3Fe.mjs.map                                                [2m 54.01 kB[22m [2m│ gzip: 13.04 kB[22m
[34mℹ[39m [2mdist/[22mmenus-0oPALNc0.mjs.map                                                   [2m 50.91 kB[22m [2m│ gzip: 12.05 kB[22m
[34mℹ[39m [2mdist/[22mastro/middleware/request-context.mjs.map                                 [2m 49.17 kB[22m [2m│ gzip: 12.38 kB[22m
[34mℹ[39m [2mdist/[22mimport-CNfLOgDE.mjs                                                      [2m 48.70 kB[22m [2m│ gzip: 11.84 kB[22m
[34mℹ[39m [2mdist/[22mquery-BQOjytvO.mjs.map                                                   [2m 47.87 kB[22m [2m│ gzip: 14.53 kB[22m
[34mℹ[39m [2mdist/[22mredirects-Dmj6KRU3.mjs                                                   [2m 46.13 kB[22m [2m│ gzip:  9.43 kB[22m
[34mℹ[39m [2mdist/[22mastro/middleware/auth.mjs.map                                            [2m 44.74 kB[22m [2m│ gzip: 12.41 kB[22m
[34mℹ[39m [2mdist/[22mloader-xeoyhykt.mjs.map                                                  [2m 40.47 kB[22m [2m│ gzip: 11.37 kB[22m
[34mℹ[39m [2mdist/[22mindex-ByKWp8rL.d.mts.map                                                 [2m 36.24 kB[22m [2m│ gzip: 10.02 kB[22m
[34mℹ[39m [2mdist/[22mtaxonomies-CTaM2no_.mjs.map                                              [2m 34.53 kB[22m [2m│ gzip:  8.01 kB[22m
[34mℹ[39m [2mdist/[22mclient/index.mjs.map                                                     [2m 32.99 kB[22m [2m│ gzip:  7.94 kB[22m
[34mℹ[39m [2mdist/[22mredirects-CM55yTjh.mjs.map                                               [2m 32.59 kB[22m [2m│ gzip:  8.18 kB[22m
[34mℹ[39m [2mdist/[22mvalidate-O5eaLZz5.mjs.map                                                [2m 32.16 kB[22m [2m│ gzip:  6.86 kB[22m
[34mℹ[39m [2mdist/[22mcontent-CUKtTvlp.mjs                                                     [2m 31.82 kB[22m [2m│ gzip:  7.33 kB[22m
[34mℹ[39m [2mdist/[22mpage/index.mjs.map                                                       [2m 31.02 kB[22m [2m│ gzip:  8.42 kB[22m
[34mℹ[39m [2mdist/[22mapply-C0ifQTsT.mjs                                                       [2m 30.10 kB[22m [2m│ gzip:  7.49 kB[22m
[34mℹ[39m [2mdist/[22mdevice-flow-BqJRxa0Q.mjs.map                                             [2m 29.83 kB[22m [2m│ gzip:  7.18 kB[22m
[34mℹ[39m [2mdist/[22mcontext-l57bJzuj.mjs                                                     [2m 28.49 kB[22m [2m│ gzip:  7.55 kB[22m
[34mℹ[39m [2mdist/[22mtaxonomies-DTJCvuVN.mjs.map                                              [2m 27.41 kB[22m [2m│ gzip:  6.76 kB[22m
[34mℹ[39m [2mdist/[22mregistry-BG-HY3Fe.mjs                                                    [2m 27.13 kB[22m [2m│ gzip:  6.94 kB[22m
[34mℹ[39m [2mdist/[22merror-s1XoiG3W.mjs.map                                                   [2m 27.02 kB[22m [2m│ gzip:  6.38 kB[22m
[34mℹ[39m [2mdist/[22msearch-B1kCRaLQ.mjs.map                                                  [2m 26.55 kB[22m [2m│ gzip:  8.21 kB[22m
[34mℹ[39m [2mdist/[22mredirect-BoyRnGcq.mjs.map                                                [2m 26.36 kB[22m [2m│ gzip:  6.98 kB[22m
[34mℹ[39m [2mdist/[22mtransport-fw-mKJzT.mjs.map                                               [2m 26.06 kB[22m [2m│ gzip:  7.48 kB[22m
[34mℹ[39m [2mdist/[22msecrets-6pgZyq0K.mjs.map                                                 [2m 24.94 kB[22m [2m│ gzip:  8.49 kB[22m
[34mℹ[39m [2mdist/[22mfts-manager-DNaDiVXH.mjs.map                                             [2m 24.82 kB[22m [2m│ gzip:  6.62 kB[22m
[34mℹ[39m [2mdist/[22mssrf-DzFN_qV-.mjs.map                                                    [2m 23.59 kB[22m [2m│ gzip:  8.30 kB[22m
[34mℹ[39m [2mdist/[22mmenus-0oPALNc0.mjs                                                       [2m 23.34 kB[22m [2m│ gzip:  5.93 kB[22m
[34mℹ[39m [2mdist/[22mquery-BQOjytvO.mjs                                                       [2m 23.24 kB[22m [2m│ gzip:  7.61 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/authorize.mjs.map                                 [2m 22.43 kB[22m [2m│ gzip:  6.46 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/analyze.mjs.map                        [2m 22.30 kB[22m [2m│ gzip:  6.90 kB[22m
[34mℹ[39m [2mdist/[22mtaxonomy-y_mUNpDL.mjs.map                                                [2m 21.42 kB[22m [2m│ gzip:  5.59 kB[22m
[34mℹ[39m [2mdist/[22mcomment-UdRBH_DP.mjs.map                                                 [2m 20.47 kB[22m [2m│ gzip:  4.87 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/snapshot.mjs.map                                        [2m 19.86 kB[22m [2m│ gzip:  6.75 kB[22m
[34mℹ[39m [2mdist/[22mloader-xeoyhykt.mjs                                                      [2m 19.56 kB[22m [2m│ gzip:  5.83 kB[22m
[34mℹ[39m [2mdist/[22msections-yGZPSAWR.mjs.map                                                [2m 19.39 kB[22m [2m│ gzip:  4.78 kB[22m
[34mℹ[39m [2mdist/[22mzod-generator-Dne5my-f.mjs.map                                           [2m 18.45 kB[22m [2m│ gzip:  5.43 kB[22m
[34mℹ[39m [2mdist/[22moauth-authorization-62GmpGIH.mjs.map                                     [2m 17.99 kB[22m [2m│ gzip:  4.89 kB[22m
[34mℹ[39m [2mdist/[22mbyline-C1RPthwW.mjs.map                                                  [2m 17.82 kB[22m [2m│ gzip:  4.69 kB[22m
[34mℹ[39m [2mdist/[22merror-s1XoiG3W.mjs                                                       [2m 17.13 kB[22m [2m│ gzip:  4.18 kB[22m
[34mℹ[39m [2mdist/[22mutils-_F-rWBTN.mjs.map                                                   [2m 16.93 kB[22m [2m│ gzip:  5.01 kB[22m
[34mℹ[39m [2mdist/[22mtypes-JFYwrjee.d.mts.map                                                 [2m 16.93 kB[22m [2m│ gzip:  4.65 kB[22m
[34mℹ[39m [2mdist/[22mcron-H8eJ46dv.mjs.map                                                    [2m 16.65 kB[22m [2m│ gzip:  5.39 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/execute.mjs.map                 [2m 16.42 kB[22m [2m│ gzip:  5.34 kB[22m
[34mℹ[39m [2mdist/[22mtaxonomies-DTJCvuVN.mjs                                                  [2m 16.30 kB[22m [2m│ gzip:  4.27 kB[22m
[34mℹ[39m [2mdist/[22mredirects-CM55yTjh.mjs                                                   [2m 16.07 kB[22m [2m│ gzip:  4.26 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/comments/_collection_/_contentId_/index.mjs.map         [2m 15.95 kB[22m [2m│ gzip:  4.89 kB[22m
[34mℹ[39m [2mdist/[22mmedia-BpaSwsAk.mjs.map                                                   [2m 15.91 kB[22m [2m│ gzip:  4.75 kB[22m
[34mℹ[39m [2mdist/[22msettings-D1b_mQa-.mjs.map                                                [2m 15.76 kB[22m [2m│ gzip:  5.04 kB[22m
[34mℹ[39m [2mdist/[22mvalidate-O5eaLZz5.mjs                                                    [2m 15.70 kB[22m [2m│ gzip:  3.52 kB[22m
[34mℹ[39m [2mdist/[22moauth-clients-D_B0_-Bz.mjs.map                                           [2m 15.58 kB[22m [2m│ gzip:  3.61 kB[22m
[34mℹ[39m [2mdist/[22mtaxonomies-CTaM2no_.mjs                                                  [2m 15.58 kB[22m [2m│ gzip:  3.76 kB[22m
[34mℹ[39m [2mdist/[22mstorage/s3.mjs.map                                                       [2m 15.40 kB[22m [2m│ gzip:  5.04 kB[22m
[34mℹ[39m [2mdist/[22mdevice-flow-BqJRxa0Q.mjs                                                 [2m 14.86 kB[22m [2m│ gzip:  3.82 kB[22m
[34mℹ[39m [2mdist/[22mplugins/adapt-sandbox-entry.mjs.map                                      [2m 14.69 kB[22m [2m│ gzip:  5.13 kB[22m
[34mℹ[39m [2mdist/[22mservice-CqiZLe6l.mjs.map                                                 [2m 14.62 kB[22m [2m│ gzip:  4.39 kB[22m
[34mℹ[39m [2mdist/[22mfts-manager-DNaDiVXH.mjs                                                 [2m 13.79 kB[22m [2m│ gzip:  3.92 kB[22m
[34mℹ[39m [2mdist/[22msecrets-6pgZyq0K.mjs                                                     [2m 13.77 kB[22m [2m│ gzip:  5.15 kB[22m
[34mℹ[39m [2mdist/[22mcomments-skOMjUSI.mjs.map                                                [2m 13.34 kB[22m [2m│ gzip:  3.37 kB[22m
[34mℹ[39m [2mdist/[22msearch-B1kCRaLQ.mjs                                                      [2m 13.23 kB[22m [2m│ gzip:  4.32 kB[22m
[34mℹ[39m [2mdist/[22mssrf-DzFN_qV-.mjs                                                        [2m 12.75 kB[22m [2m│ gzip:  5.03 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/media.mjs.map                          [2m 12.71 kB[22m [2m│ gzip:  3.84 kB[22m
[34mℹ[39m [2mdist/[22mmanifest-schema-HCtSh4Jq.mjs.map                                         [2m 12.21 kB[22m [2m│ gzip:  3.36 kB[22m
[34mℹ[39m [2mdist/[22mredirect-BoyRnGcq.mjs                                                    [2m 12.07 kB[22m [2m│ gzip:  3.70 kB[22m
[34mℹ[39m [2mdist/[22mtransport-fw-mKJzT.mjs                                                   [2m 12.05 kB[22m [2m│ gzip:  3.86 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/oauth/_provider_/callback.mjs.map                  [2m 11.31 kB[22m [2m│ gzip:  3.78 kB[22m
[34mℹ[39m [2mdist/[22mstorage/local.mjs.map                                                    [2m 11.27 kB[22m [2m│ gzip:  3.76 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/rewrite-urls.mjs.map                   [2m 11.21 kB[22m [2m│ gzip:  3.58 kB[22m
[34mℹ[39m [2mdist/[22mvalidation-DS8VZzH8.mjs.map                                              [2m 11.09 kB[22m [2m│ gzip:  4.18 kB[22m
[34mℹ[39m [2mdist/[22mtaxonomy-y_mUNpDL.mjs                                                    [2m 10.92 kB[22m [2m│ gzip:  3.06 kB[22m
[34mℹ[39m [2mdist/[22muser-C75pYdwO.mjs.map                                                    [2m 10.46 kB[22m [2m│ gzip:  3.27 kB[22m
[34mℹ[39m [2mdist/[22mtokens-DILYNZMi.mjs.map                                                  [2m 10.30 kB[22m [2m│ gzip:  3.28 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media.mjs.map                                           [2m 10.28 kB[22m [2m│ gzip:  3.57 kB[22m
[34mℹ[39m [2mdist/[22msetup-BGAJ2uXs.mjs.map                                                   [2m 10.10 kB[22m [2m│ gzip:  1.99 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_.mjs.map                       [2m 10.10 kB[22m [2m│ gzip:  2.71 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/token.mjs.map                                     [2m 10.07 kB[22m [2m│ gzip:  3.04 kB[22m
[34mℹ[39m [2mdist/[22mnormalize-CN5kRSMC.mjs.map                                               [2m 10.06 kB[22m [2m│ gzip:  3.02 kB[22m
[34mℹ[39m [2mdist/[22msections-yGZPSAWR.mjs                                                    [2m  9.34 kB[22m [2m│ gzip:  2.47 kB[22m
[34mℹ[39m [2mdist/[22mseo-CETyuBpQ.mjs.map                                                     [2m  9.19 kB[22m [2m│ gzip:  3.06 kB[22m
[34mℹ[39m [2mdist/[22mcomment-UdRBH_DP.mjs                                                     [2m  9.18 kB[22m [2m│ gzip:  2.50 kB[22m
[34mℹ[39m [2mdist/[22mcron-H8eJ46dv.mjs                                                        [2m  8.95 kB[22m [2m│ gzip:  3.19 kB[22m
[34mℹ[39m [2mdist/[22mpatterns-CqG5Ya3i.mjs.map                                                [2m  8.92 kB[22m [2m│ gzip:  3.02 kB[22m
[34mℹ[39m [2mdist/[22mclient/cf-access.mjs.map                                                 [2m  8.87 kB[22m [2m│ gzip:  3.14 kB[22m
[34mℹ[39m [2mdist/[22mmedia/index.mjs.map                                                      [2m  8.84 kB[22m [2m│ gzip:  2.92 kB[22m
[34mℹ[39m [2mdist/[22mbyline-C1RPthwW.mjs                                                      [2m  8.76 kB[22m [2m│ gzip:  2.52 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/prepare.mjs.map                        [2m  8.66 kB[22m [2m│ gzip:  3.14 kB[22m
[34mℹ[39m [2mdist/[22moauth-authorization-62GmpGIH.mjs                                         [2m  8.64 kB[22m [2m│ gzip:  2.58 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/dev-bypass.mjs.map                                [2m  8.60 kB[22m [2m│ gzip:  3.24 kB[22m
[34mℹ[39m [2mdist/[22mapi-tokens-eYymBhIT.mjs.map                                              [2m  8.50 kB[22m [2m│ gzip:  2.44 kB[22m
[34mℹ[39m [2mdist/[22mmedia/local-runtime.mjs.map                                              [2m  8.45 kB[22m [2m│ gzip:  2.58 kB[22m
[34mℹ[39m [2mdist/[22mbylines-D8L5-7Sj.d.mts.map                                               [2m  8.34 kB[22m [2m│ gzip:  1.46 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/register.mjs.map                                  [2m  8.19 kB[22m [2m│ gzip:  2.94 kB[22m
[34mℹ[39m [2mdist/[22mallowed-origins-CDdG-4Gd.mjs.map                                         [2m  8.19 kB[22m [2m│ gzip:  3.02 kB[22m
[34mℹ[39m [2mdist/[22mrequest-meta-CLCwSQOS.mjs.map                                            [2m  8.19 kB[22m [2m│ gzip:  3.15 kB[22m
[34mℹ[39m [2mdist/[22mutils-_F-rWBTN.mjs                                                       [2m  8.16 kB[22m [2m│ gzip:  2.90 kB[22m
[34mℹ[39m [2mdist/[22mbylines-D-2giLFj.mjs.map                                                 [2m  8.14 kB[22m [2m│ gzip:  2.88 kB[22m
[34mℹ[39m [2mdist/[22mzod-generator-Dne5my-f.mjs                                               [2m  8.10 kB[22m [2m│ gzip:  2.42 kB[22m
[34mℹ[39m [2mdist/[22mrate-limit-wBfyngn1.mjs.map                                              [2m  8.08 kB[22m [2m│ gzip:  3.40 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/rewrite-url-helpers.mjs.map            [2m  8.07 kB[22m [2m│ gzip:  2.68 kB[22m
[34mℹ[39m [2mdist/[22mtypes-DSZl1Dsv.mjs.map                                                   [2m  7.98 kB[22m [2m│ gzip:  2.22 kB[22m
[34mℹ[39m [2mdist/[22mplaceholder-LqmHqvBw.mjs.map                                             [2m  7.97 kB[22m [2m│ gzip:  2.92 kB[22m
[34mℹ[39m [2mdist/[22msettings-D1b_mQa-.mjs                                                    [2m  7.86 kB[22m [2m│ gzip:  2.65 kB[22m
[34mℹ[39m [2mdist/[22moptions-BL4X94qY.mjs.map                                                 [2m  7.80 kB[22m [2m│ gzip:  2.31 kB[22m
[34mℹ[39m [2mdist/[22mdashboard-CkVQrZIn.mjs.map                                               [2m  7.78 kB[22m [2m│ gzip:  2.88 kB[22m
[34mℹ[39m [2mdist/[22mdialect-helpers-BKCvISIQ.mjs.map                                         [2m  7.72 kB[22m [2m│ gzip:  2.08 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/index.mjs.map                          [2m  7.59 kB[22m [2m│ gzip:  2.39 kB[22m
[34mℹ[39m [2mdist/[22moauth-clients-D_B0_-Bz.mjs                                               [2m  7.56 kB[22m [2m│ gzip:  1.83 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs.map      [2m  7.37 kB[22m [2m│ gzip:  2.38 kB[22m
[34mℹ[39m [2mdist/[22mmedia-BpaSwsAk.mjs                                                       [2m  7.22 kB[22m [2m│ gzip:  2.43 kB[22m
[34mℹ[39m [2mdist/[22mseo/index.mjs.map                                                        [2m  7.10 kB[22m [2m│ gzip:  2.58 kB[22m
[34mℹ[39m [2mdist/[22mtypes-VdNuNoaN.mjs.map                                                   [2m  6.81 kB[22m [2m│ gzip:  2.55 kB[22m
[34mℹ[39m [2mdist/[22mmanifest-schema-HCtSh4Jq.mjs                                             [2m  6.66 kB[22m [2m│ gzip:  2.25 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/widgets/_id_.mjs.map                [2m  6.52 kB[22m [2m│ gzip:  1.77 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/settings/email.mjs.map                                  [2m  6.47 kB[22m [2m│ gzip:  2.40 kB[22m
[34mℹ[39m [2mdist/[22mwidgets-Cyvv9LLz.mjs.map                                                 [2m  6.46 kB[22m [2m│ gzip:  2.29 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/admin-verify.mjs.map                              [2m  6.33 kB[22m [2m│ gzip:  2.31 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/_id_.mjs.map                                      [2m  6.28 kB[22m [2m│ gzip:  1.75 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/upload-url.mjs.map                                [2m  6.25 kB[22m [2m│ gzip:  2.44 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/admin.mjs.map                                     [2m  6.21 kB[22m [2m│ gzip:  2.51 kB[22m
[34mℹ[39m [2mdist/[22mservice-CqiZLe6l.mjs                                                     [2m  6.21 kB[22m [2m│ gzip:  2.19 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/index.mjs.map                                     [2m  6.16 kB[22m [2m│ gzip:  2.40 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/plugins/_pluginId_/_...path_.mjs.map                    [2m  6.16 kB[22m [2m│ gzip:  2.52 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/oauth/_provider_.mjs.map                           [2m  6.16 kB[22m [2m│ gzip:  2.27 kB[22m
[34mℹ[39m [2mdist/[22mpublic-url-CseXl9Fv.mjs.map                                              [2m  5.92 kB[22m [2m│ gzip:  2.40 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/register/verify.mjs.map                    [2m  5.90 kB[22m [2m│ gzip:  2.22 kB[22m
[34mℹ[39m [2mdist/[22mvalidate-VPnKoIzW.mjs.map                                                [2m  5.90 kB[22m [2m│ gzip:  1.70 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/preview-url.mjs.map           [2m  5.90 kB[22m [2m│ gzip:  2.39 kB[22m
[34mℹ[39m [2mdist/[22mseo-BoR4wCUh.mjs.map                                                     [2m  5.84 kB[22m [2m│ gzip:  2.39 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/_id_/status.mjs.map                      [2m  5.69 kB[22m [2m│ gzip:  2.00 kB[22m
[34mℹ[39m [2mdist/[22mvalidation-DS8VZzH8.mjs                                                  [2m  5.61 kB[22m [2m│ gzip:  2.26 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/dev-bypass.mjs.map                                 [2m  5.58 kB[22m [2m│ gzip:  2.30 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/schedule.mjs.map              [2m  5.57 kB[22m [2m│ gzip:  1.64 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/providers/_providerId_/index.mjs.map              [2m  5.54 kB[22m [2m│ gzip:  1.81 kB[22m
[34mℹ[39m [2mdist/[22mtypes-C1KKK4VP.d.mts.map                                                 [2m  5.51 kB[22m [2m│ gzip:  0.91 kB[22m
[34mℹ[39m [2mdist/[22mastro/middleware/redirect.mjs.map                                        [2m  5.50 kB[22m [2m│ gzip:  2.23 kB[22m
[34mℹ[39m [2mdist/[22mcomments-skOMjUSI.mjs                                                    [2m  5.49 kB[22m [2m│ gzip:  1.74 kB[22m
[34mℹ[39m [2mdist/[22mpreview-C1LOEbWZ.mjs.map                                                 [2m  5.44 kB[22m [2m│ gzip:  1.93 kB[22m
[34mℹ[39m [2mdist/[22mparse-D_XBSKm5.mjs.map                                                   [2m  5.35 kB[22m [2m│ gzip:  1.95 kB[22m
[34mℹ[39m [2mdist/[22mallowed-origins-CDdG-4Gd.mjs                                             [2m  5.31 kB[22m [2m│ gzip:  2.05 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/install.mjs.map                  [2m  5.28 kB[22m [2m│ gzip:  2.30 kB[22m
[34mℹ[39m [2mdist/[22msetup-BGAJ2uXs.mjs                                                       [2m  5.27 kB[22m [2m│ gzip:  1.31 kB[22m
[34mℹ[39m [2mdist/[22mtypes-Dz9CGX_d.mjs.map                                                   [2m  5.27 kB[22m [2m│ gzip:  1.85 kB[22m
[34mℹ[39m [2mdist/[22mrequest-cache-dzCt8TZB.mjs.map                                           [2m  5.21 kB[22m [2m│ gzip:  2.08 kB[22m
[34mℹ[39m [2mdist/[22mseo-CETyuBpQ.mjs                                                         [2m  5.12 kB[22m [2m│ gzip:  1.82 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/status.mjs.map                                    [2m  5.09 kB[22m [2m│ gzip:  1.96 kB[22m
[34mℹ[39m [2mdist/[22mpatterns-CqG5Ya3i.mjs                                                    [2m  5.05 kB[22m [2m│ gzip:  1.85 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/index.mjs.map                      [2m  4.98 kB[22m [2m│ gzip:  1.84 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/_slug_/translations.mjs.map     [2m  4.98 kB[22m [2m│ gzip:  1.50 kB[22m
[34mℹ[39m [2mdist/[22mclient/index.d.mts.map                                                   [2m  4.96 kB[22m [2m│ gzip:  1.42 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/_id_.mjs.map                               [2m  4.95 kB[22m [2m│ gzip:  1.56 kB[22m
[34mℹ[39m [2mdist/[22mtokens-DILYNZMi.mjs                                                      [2m  4.94 kB[22m [2m│ gzip:  1.73 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/_slug_.mjs.map                  [2m  4.92 kB[22m [2m│ gzip:  1.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/typegen.mjs.map                                         [2m  4.90 kB[22m [2m│ gzip:  1.79 kB[22m
[34mℹ[39m [2mdist/[22mrequest-context.mjs.map                                                  [2m  4.89 kB[22m [2m│ gzip:  2.14 kB[22m
[34mℹ[39m [2mdist/[22mnormalize-CN5kRSMC.mjs                                                   [2m  4.86 kB[22m [2m│ gzip:  1.48 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/allowed-domains/_domain_.mjs.map                  [2m  4.84 kB[22m [2m│ gzip:  1.49 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/sitemap-_collection_.xml.mjs.map                            [2m  4.83 kB[22m [2m│ gzip:  1.86 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/oauth-clients/_id_.mjs.map                        [2m  4.75 kB[22m [2m│ gzip:  1.34 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/analyze.mjs.map                 [2m  4.74 kB[22m [2m│ gzip:  1.92 kB[22m
[34mℹ[39m [2mdist/[22muser-C75pYdwO.mjs                                                        [2m  4.74 kB[22m [2m│ gzip:  1.69 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/bylines/_id_/index.mjs.map                        [2m  4.70 kB[22m [2m│ gzip:  1.45 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/publish.mjs.map               [2m  4.64 kB[22m [2m│ gzip:  1.85 kB[22m
[34mℹ[39m [2mdist/[22mdatabase/instrumentation.mjs.map                                         [2m  4.63 kB[22m [2m│ gzip:  2.02 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/allowed-domains/index.mjs.map                     [2m  4.61 kB[22m [2m│ gzip:  1.60 kB[22m
[34mℹ[39m [2mdist/[22mrequest-meta-CLCwSQOS.mjs                                                [2m  4.58 kB[22m [2m│ gzip:  1.93 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/index.mjs.map                                    [2m  4.52 kB[22m [2m│ gzip:  1.76 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/translations.mjs.map                       [2m  4.49 kB[22m [2m│ gzip:  1.48 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/signup/request.mjs.map                             [2m  4.45 kB[22m [2m│ gzip:  1.92 kB[22m
[34mℹ[39m [2mdist/[22mtrusted-proxy-CJhQIk65.mjs.map                                           [2m  4.44 kB[22m [2m│ gzip:  1.97 kB[22m
[34mℹ[39m [2mdist/[22mrate-limit-wBfyngn1.mjs                                                  [2m  4.43 kB[22m [2m│ gzip:  2.06 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/magic-link/send.mjs.map                            [2m  4.40 kB[22m [2m│ gzip:  1.78 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/index.mjs.map                              [2m  4.39 kB[22m [2m│ gzip:  1.57 kB[22m
[34mℹ[39m [2mdist/[22mplaceholder-LqmHqvBw.mjs                                                 [2m  4.39 kB[22m [2m│ gzip:  1.77 kB[22m
[34mℹ[39m [2mdist/[22mvalidate-VPnKoIzW.mjs                                                    [2m  4.35 kB[22m [2m│ gzip:  1.32 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/signup/complete.mjs.map                            [2m  4.33 kB[22m [2m│ gzip:  1.74 kB[22m
[34mℹ[39m [2mdist/[22mbase64-CqR-7kqF.mjs.map                                                  [2m  4.31 kB[22m [2m│ gzip:  1.41 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/options.mjs.map                            [2m  4.30 kB[22m [2m│ gzip:  1.76 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/_id_/confirm.mjs.map                              [2m  4.30 kB[22m [2m│ gzip:  1.76 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/complete.mjs.map                            [2m  4.29 kB[22m [2m│ gzip:  1.72 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/themes/preview.mjs.map                                  [2m  4.25 kB[22m [2m│ gzip:  1.80 kB[22m
[34mℹ[39m [2mdist/[22mastro/types.d.mts.map                                                    [2m  4.24 kB[22m [2m│ gzip:  1.19 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/index.mjs.map                               [2m  4.23 kB[22m [2m│ gzip:  1.83 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/hooks/exclusive/_hookName_.mjs.map                [2m  4.20 kB[22m [2m│ gzip:  1.71 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/register/options.mjs.map                   [2m  4.18 kB[22m [2m│ gzip:  1.69 kB[22m
[34mℹ[39m [2mdist/[22moauth-state-store-DpsZViTu.mjs.map                                       [2m  4.17 kB[22m [2m│ gzip:  1.51 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/redirects/_id_.mjs.map                                  [2m  4.17 kB[22m [2m│ gzip:  1.10 kB[22m
[34mℹ[39m [2mdist/[22mconnection-2igzM-AT.mjs.map                                              [2m  4.14 kB[22m [2m│ gzip:  1.79 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/register-options.mjs.map                    [2m  4.09 kB[22m [2m│ gzip:  1.75 kB[22m
[34mℹ[39m [2mdist/[22mastro/middleware/setup.mjs.map                                           [2m  4.08 kB[22m [2m│ gzip:  1.67 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/sitemap.xml.mjs.map                                         [2m  4.05 kB[22m [2m│ gzip:  1.66 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/manifest.mjs.map                                        [2m  4.04 kB[22m [2m│ gzip:  1.84 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/sections/_slug_.mjs.map                                 [2m  3.99 kB[22m [2m│ gzip:  1.05 kB[22m
[34mℹ[39m [2mdist/[22mapi-tokens-eYymBhIT.mjs                                                  [2m  3.95 kB[22m [2m│ gzip:  1.26 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/providers/_providerId_/_itemId_.mjs.map           [2m  3.95 kB[22m [2m│ gzip:  1.20 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_.mjs.map                             [2m  3.86 kB[22m [2m│ gzip:  1.25 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/index.mjs.map                 [2m  3.85 kB[22m [2m│ gzip:  1.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/_id_/update.mjs.map              [2m  3.83 kB[22m [2m│ gzip:  1.62 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_.mjs.map                                    [2m  3.79 kB[22m [2m│ gzip:  1.00 kB[22m
[34mℹ[39m [2mdist/[22mdb/index.mjs.map                                                         [2m  3.77 kB[22m [2m│ gzip:  1.42 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/widgets.mjs.map                     [2m  3.74 kB[22m [2m│ gzip:  1.48 kB[22m
[34mℹ[39m [2mdist/[22mbylines-D-2giLFj.mjs                                                     [2m  3.69 kB[22m [2m│ gzip:  1.53 kB[22m
[34mℹ[39m [2mdist/[22moptions-BL4X94qY.mjs                                                     [2m  3.69 kB[22m [2m│ gzip:  1.26 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/duplicate.mjs.map             [2m  3.64 kB[22m [2m│ gzip:  1.49 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/redirects/404s/index.mjs.map                            [2m  3.64 kB[22m [2m│ gzip:  1.08 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs.map    [2m  3.61 kB[22m [2m│ gzip:  1.01 kB[22m
[34mℹ[39m [2mdist/[22mplugin-utils.mjs.map                                                     [2m  3.57 kB[22m [2m│ gzip:  1.59 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/updates.mjs.map                           [2m  3.56 kB[22m [2m│ gzip:  1.51 kB[22m
[34mℹ[39m [2mdist/[22mcache-BjpmXt90.mjs.map                                                   [2m  3.54 kB[22m [2m│ gzip:  1.45 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/bylines/index.mjs.map                             [2m  3.54 kB[22m [2m│ gzip:  1.34 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/verify.mjs.map                             [2m  3.54 kB[22m [2m│ gzip:  1.42 kB[22m
[34mℹ[39m [2mdist/[22mdashboard-CkVQrZIn.mjs                                                   [2m  3.54 kB[22m [2m│ gzip:  1.51 kB[22m
[34mℹ[39m [2mdist/[22mmime-KV5TqkMN.mjs.map                                                    [2m  3.52 kB[22m [2m│ gzip:  1.48 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/device/token.mjs.map                              [2m  3.50 kB[22m [2m│ gzip:  1.56 kB[22m
[34mℹ[39m [2mdist/[22mcomponents-mZem7pbe.mjs.map                                              [2m  3.46 kB[22m [2m│ gzip:  0.99 kB[22m
[34mℹ[39m [2mdist/[22mchallenge-store-CJ0OOHOr.mjs.map                                         [2m  3.43 kB[22m [2m│ gzip:  1.34 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/disable.mjs.map                        [2m  3.43 kB[22m [2m│ gzip:  1.49 kB[22m
[34mℹ[39m [2mdist/[22mpublic-url-CseXl9Fv.mjs                                                  [2m  3.37 kB[22m [2m│ gzip:  1.50 kB[22m
[34mℹ[39m [2mdist/[22mtypes-Cb2UCDJg.d.mts.map                                                 [2m  3.35 kB[22m [2m│ gzip:  1.20 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/items/_id_.mjs.map                         [2m  3.34 kB[22m [2m│ gzip:  1.04 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/file/_...key_.mjs.map                             [2m  3.33 kB[22m [2m│ gzip:  1.52 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/index.mjs.map                   [2m  3.33 kB[22m [2m│ gzip:  1.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/oauth-clients/index.mjs.map                       [2m  3.32 kB[22m [2m│ gzip:  1.25 kB[22m
[34mℹ[39m [2mdist/[22mdialect-helpers-BKCvISIQ.mjs                                             [2m  3.31 kB[22m [2m│ gzip:  1.12 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/robots.txt.mjs.map                                          [2m  3.28 kB[22m [2m│ gzip:  1.34 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/send-recovery.mjs.map                  [2m  3.27 kB[22m [2m│ gzip:  1.44 kB[22m
[34mℹ[39m [2mdist/[22mwidgets-Cyvv9LLz.mjs                                                     [2m  3.27 kB[22m [2m│ gzip:  1.22 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/restore.mjs.map               [2m  3.27 kB[22m [2m│ gzip:  1.34 kB[22m
[34mℹ[39m [2mdist/[22memail-console-Dmp5Q-P2.mjs.map                                           [2m  3.23 kB[22m [2m│ gzip:  1.54 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/discard-draft.mjs.map         [2m  3.20 kB[22m [2m│ gzip:  1.31 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/magic-link/verify.mjs.map                          [2m  3.18 kB[22m [2m│ gzip:  1.34 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/reorder.mjs.map                     [2m  3.16 kB[22m [2m│ gzip:  1.32 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/unpublish.mjs.map             [2m  3.12 kB[22m [2m│ gzip:  1.28 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/api-tokens/index.mjs.map                          [2m  3.11 kB[22m [2m│ gzip:  1.21 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/_id_/install.mjs.map          [2m  3.10 kB[22m [2m│ gzip:  1.31 kB[22m
[34mℹ[39m [2mdist/[22mmode-DPRPvJYm.mjs.map                                                    [2m  3.04 kB[22m [2m│ gzip:  1.13 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/search/rebuild.mjs.map                                  [2m  3.02 kB[22m [2m│ gzip:  1.23 kB[22m
[34mℹ[39m [2mdist/[22mvalidate-BpQGsmd7.d.mts.map                                              [2m  3.01 kB[22m [2m│ gzip:  0.94 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs.map         [2m  2.97 kB[22m [2m│ gzip:  1.31 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/revisions/_revisionId_/restore.mjs.map                  [2m  2.94 kB[22m [2m│ gzip:  1.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/_id_/icon.mjs.map             [2m  2.94 kB[22m [2m│ gzip:  1.30 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/index.mjs.map                               [2m  2.94 kB[22m [2m│ gzip:  1.30 kB[22m
[34mℹ[39m [2mdist/[22mruntime.mjs.map                                                          [2m  2.91 kB[22m [2m│ gzip:  1.25 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/settings.mjs.map                                        [2m  2.89 kB[22m [2m│ gzip:  1.06 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/index.mjs.map                                [2m  2.88 kB[22m [2m│ gzip:  1.02 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/redirects/index.mjs.map                                 [2m  2.86 kB[22m [2m│ gzip:  1.00 kB[22m
[34mℹ[39m [2mdist/[22mpreview-C1LOEbWZ.mjs                                                     [2m  2.85 kB[22m [2m│ gzip:  1.03 kB[22m
[34mℹ[39m [2mdist/[22mparse-D_XBSKm5.mjs                                                       [2m  2.83 kB[22m [2m│ gzip:  1.15 kB[22m
[34mℹ[39m [2mdist/[22mdefault-Dbs22Gg4.mjs.map                                                 [2m  2.82 kB[22m [2m│ gzip:  0.81 kB[22m
[34mℹ[39m [2mdist/[22mpasskey-config-Cg86_ISa.mjs.map                                          [2m  2.81 kB[22m [2m│ gzip:  1.25 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/search/index.mjs.map                                    [2m  2.78 kB[22m [2m│ gzip:  1.33 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/well-known/auth.mjs.map                                 [2m  2.75 kB[22m [2m│ gzip:  1.22 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/device/code.mjs.map                               [2m  2.74 kB[22m [2m│ gzip:  1.27 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/sections/index.mjs.map                                  [2m  2.71 kB[22m [2m│ gzip:  0.96 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/translations.mjs.map          [2m  2.71 kB[22m [2m│ gzip:  1.28 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/update.mjs.map                       [2m  2.70 kB[22m [2m│ gzip:  1.12 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/_id_.mjs.map                             [2m  2.68 kB[22m [2m│ gzip:  0.92 kB[22m
[34mℹ[39m [2mdist/[22mrequest-cache-dzCt8TZB.mjs                                               [2m  2.67 kB[22m [2m│ gzip:  1.19 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/search/enable.mjs.map                                   [2m  2.65 kB[22m [2m│ gzip:  1.12 kB[22m
[34mℹ[39m [2mdist/[22mtypes-VdNuNoaN.mjs                                                       [2m  2.64 kB[22m [2m│ gzip:  1.19 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/callback.mjs.map                [2m  2.55 kB[22m [2m│ gzip:  1.19 kB[22m
[34mℹ[39m [2mdist/[22mplaceholder-D3cFCU9y.d.mts.map                                           [2m  2.50 kB[22m [2m│ gzip:  0.93 kB[22m
[34mℹ[39m [2mdist/[22mseo-BoR4wCUh.mjs                                                         [2m  2.48 kB[22m [2m│ gzip:  1.17 kB[22m
[34mℹ[39m [2mdist/[22mconfig-CVssduLe.mjs.map                                                  [2m  2.48 kB[22m [2m│ gzip:  1.10 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/index.mjs.map                                     [2m  2.48 kB[22m [2m│ gzip:  0.97 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/themes/marketplace/index.mjs.map                  [2m  2.45 kB[22m [2m│ gzip:  1.07 kB[22m
[34mℹ[39m [2mdist/[22mschema-Jdu-gsim.mjs.map                                                  [2m  2.44 kB[22m [2m│ gzip:  1.04 kB[22m
[34mℹ[39m [2mdist/[22mbase64-CqR-7kqF.mjs                                                      [2m  2.44 kB[22m [2m│ gzip:  0.92 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/index.mjs.map          [2m  2.43 kB[22m [2m│ gzip:  0.85 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/index.mjs.map                        [2m  2.43 kB[22m [2m│ gzip:  0.89 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/me.mjs.map                                         [2m  2.40 kB[22m [2m│ gzip:  1.02 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/_id_/uninstall.mjs.map           [2m  2.39 kB[22m [2m│ gzip:  1.08 kB[22m
[34mℹ[39m [2mdist/[22mconnection-2igzM-AT.mjs                                                  [2m  2.38 kB[22m [2m│ gzip:  1.06 kB[22m
[34mℹ[39m [2mdist/[22mindex-D2gvztOP.d.mts.map                                                 [2m  2.36 kB[22m [2m│ gzip:  0.79 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/hooks/exclusive/index.mjs.map                     [2m  2.33 kB[22m [2m│ gzip:  1.11 kB[22m
[34mℹ[39m [2mdist/[22mtransaction-NQj4VJ7Z.mjs.map                                             [2m  2.32 kB[22m [2m│ gzip:  1.10 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/signup/verify.mjs.map                              [2m  2.29 kB[22m [2m│ gzip:  1.13 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/enable.mjs.map                       [2m  2.28 kB[22m [2m│ gzip:  1.05 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/mode.mjs.map                                       [2m  2.27 kB[22m [2m│ gzip:  1.13 kB[22m
[34mℹ[39m [2mdist/[22mdb-errors-CGN9kJfo.mjs.map                                               [2m  2.24 kB[22m [2m│ gzip:  1.03 kB[22m
[34mℹ[39m [2mdist/[22mauthorize-CEcshbF2.mjs.map                                               [2m  2.24 kB[22m [2m│ gzip:  0.85 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/accept.mjs.map                              [2m  2.22 kB[22m [2m│ gzip:  1.09 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/well-known/oauth-authorization-server.mjs.map           [2m  2.21 kB[22m [2m│ gzip:  0.97 kB[22m
[34mℹ[39m [2mdist/[22moptions-DRqvdw2a.d.mts.map                                               [2m  2.19 kB[22m [2m│ gzip:  0.83 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/search/suggest.mjs.map                                  [2m  2.19 kB[22m [2m│ gzip:  1.06 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/uninstall.mjs.map                    [2m  2.18 kB[22m [2m│ gzip:  0.98 kB[22m
[34mℹ[39m [2mdist/[22mhash-DlUxGhQS.mjs.map                                                    [2m  2.18 kB[22m [2m│ gzip:  1.05 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/index.mjs.map                              [2m  2.11 kB[22m [2m│ gzip:  1.03 kB[22m
[34mℹ[39m [2mdist/[22msetup-complete-C6ZCLhKo.mjs.map                                          [2m  2.08 kB[22m [2m│ gzip:  0.91 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/device/authorize.mjs.map                          [2m  2.06 kB[22m [2m│ gzip:  1.00 kB[22m
[34mℹ[39m [2mdist/[22mslugify-Cjh1ssOZ.mjs.map                                                 [2m  2.04 kB[22m [2m│ gzip:  1.01 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/index.mjs.map                            [2m  2.01 kB[22m [2m│ gzip:  0.90 kB[22m
[34mℹ[39m [2mdist/[22mtrusted-proxy-CJhQIk65.mjs                                               [2m  1.99 kB[22m [2m│ gzip:  0.97 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/enable.mjs.map                         [2m  1.99 kB[22m [2m│ gzip:  0.94 kB[22m
[34mℹ[39m [2mdist/[22mcomponents-mZem7pbe.mjs                                                  [2m  1.99 kB[22m [2m│ gzip:  0.71 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/bulk.mjs.map                             [2m  1.98 kB[22m [2m│ gzip:  0.88 kB[22m
[34mℹ[39m [2mdist/[22mcache-BjpmXt90.mjs                                                       [2m  1.97 kB[22m [2m│ gzip:  0.80 kB[22m
[34mℹ[39m [2mdist/[22msettings-DWPE33K3.mjs.map                                                [2m  1.91 kB[22m [2m│ gzip:  0.71 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/index.mjs.map                 [2m  1.91 kB[22m [2m│ gzip:  0.86 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/reorder.mjs.map                            [2m  1.88 kB[22m [2m│ gzip:  0.86 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/items.mjs.map                              [2m  1.87 kB[22m [2m│ gzip:  0.86 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/probe.mjs.map                                    [2m  1.84 kB[22m [2m│ gzip:  0.87 kB[22m
[34mℹ[39m [2mdist/[22moauth-state-store-DpsZViTu.mjs                                           [2m  1.79 kB[22m [2m│ gzip:  0.72 kB[22m
[34mℹ[39m [2mdist/[22mmedia-allowlist-B8EX01DH.mjs.map                                         [2m  1.77 kB[22m [2m│ gzip:  0.95 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/dev-reset.mjs.map                                 [2m  1.77 kB[22m [2m│ gzip:  0.89 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/disable.mjs.map                      [2m  1.77 kB[22m [2m│ gzip:  0.82 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/orphans/_slug_.mjs.map                           [2m  1.76 kB[22m [2m│ gzip:  0.81 kB[22m
[34mℹ[39m [2mdist/[22mpage/index.d.mts.map                                                     [2m  1.75 kB[22m [2m│ gzip:  0.67 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/token/refresh.mjs.map                             [2m  1.72 kB[22m [2m│ gzip:  0.87 kB[22m
[34mℹ[39m [2mdist/[22mtypes-BWhaSS7U.d.mts.map                                                 [2m  1.72 kB[22m [2m│ gzip:  0.51 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/api-tokens/_id_.mjs.map                           [2m  1.68 kB[22m [2m│ gzip:  0.85 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/redirects/404s/summary.mjs.map                          [2m  1.68 kB[22m [2m│ gzip:  0.79 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/token/revoke.mjs.map                              [2m  1.68 kB[22m [2m│ gzip:  0.87 kB[22m
[34mℹ[39m [2mdist/[22memail-console-Dmp5Q-P2.mjs                                               [2m  1.67 kB[22m [2m│ gzip:  0.86 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/revisions.mjs.map             [2m  1.67 kB[22m [2m│ gzip:  0.84 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/well-known/oauth-protected-resource.mjs.map             [2m  1.64 kB[22m [2m│ gzip:  0.85 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/permanent.mjs.map             [2m  1.62 kB[22m [2m│ gzip:  0.79 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/reorder.mjs.map        [2m  1.60 kB[22m [2m│ gzip:  0.72 kB[22m
[34mℹ[39m [2mdist/[22mchallenge-store-CJ0OOHOr.mjs                                             [2m  1.59 kB[22m [2m│ gzip:  0.68 kB[22m
[34mℹ[39m [2mdist/[22mdb-errors-CGN9kJfo.mjs                                                   [2m  1.57 kB[22m [2m│ gzip:  0.77 kB[22m
[34mℹ[39m [2mdist/[22mpasskey-config-Cg86_ISa.mjs                                              [2m  1.56 kB[22m [2m│ gzip:  0.74 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/trash.mjs.map                      [2m  1.55 kB[22m [2m│ gzip:  0.77 kB[22m
[34mℹ[39m [2mdist/[22mapi/route-utils.mjs.map                                                  [2m  1.54 kB[22m [2m│ gzip:  0.70 kB[22m
[34mℹ[39m [2mdist/[22mtypes-DmxPPXGf.d.mts.map                                                 [2m  1.53 kB[22m [2m│ gzip:  0.67 kB[22m
[34mℹ[39m [2mdist/[22mtypes-DSZl1Dsv.mjs                                                       [2m  1.49 kB[22m [2m│ gzip:  0.70 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/index.mjs.map                        [2m  1.48 kB[22m [2m│ gzip:  0.74 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/_id_/index.mjs.map            [2m  1.45 kB[22m [2m│ gzip:  0.72 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/logout.mjs.map                                     [2m  1.44 kB[22m [2m│ gzip:  0.77 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/themes/marketplace/_id_/index.mjs.map             [2m  1.43 kB[22m [2m│ gzip:  0.72 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/dev/emails.mjs.map                                      [2m  1.43 kB[22m [2m│ gzip:  0.63 kB[22m
[34mℹ[39m [2mdist/[22moauth-user-lookup-meyS2oB1.mjs.map                                       [2m  1.41 kB[22m [2m│ gzip:  0.76 kB[22m
[34mℹ[39m [2mdist/[22mdefault-Dbs22Gg4.mjs                                                     [2m  1.35 kB[22m [2m│ gzip:  0.50 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/dashboard.mjs.map                                       [2m  1.34 kB[22m [2m│ gzip:  0.71 kB[22m
[34mℹ[39m [2mdist/[22mslugify-Cjh1ssOZ.mjs                                                     [2m  1.31 kB[22m [2m│ gzip:  0.71 kB[22m
[34mℹ[39m [2mdist/[22msite-url-D-M4Fd8O.mjs.map                                                [2m  1.30 kB[22m [2m│ gzip:  0.73 kB[22m
[34mℹ[39m [2mdist/[22mtypes-CzvJd1ND.d.mts.map                                                 [2m  1.30 kB[22m [2m│ gzip:  0.44 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/counts.mjs.map                           [2m  1.30 kB[22m [2m│ gzip:  0.65 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/search/stats.mjs.map                                    [2m  1.29 kB[22m [2m│ gzip:  0.69 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/revisions/_revisionId_/index.mjs.map                    [2m  1.29 kB[22m [2m│ gzip:  0.68 kB[22m
[34mℹ[39m [2mdist/[22mload-DbZkcPDT.mjs.map                                                    [2m  1.28 kB[22m [2m│ gzip:  0.64 kB[22m
[34mℹ[39m [2mdist/[22mmime-KV5TqkMN.mjs                                                        [2m  1.28 kB[22m [2m│ gzip:  0.64 kB[22m
[34mℹ[39m [2mdist/[22mauthorize-CEcshbF2.mjs                                                   [2m  1.28 kB[22m [2m│ gzip:  0.52 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/index.mjs.map                             [2m  1.26 kB[22m [2m│ gzip:  0.67 kB[22m
[34mℹ[39m [2mdist/[22mplugin-types.d.mts.map                                                   [2m  1.25 kB[22m [2m│ gzip:  0.46 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/compare.mjs.map               [2m  1.25 kB[22m [2m│ gzip:  0.67 kB[22m
[34mℹ[39m [2mdist/[22mconfig-CVssduLe.mjs                                                      [2m  1.23 kB[22m [2m│ gzip:  0.58 kB[22m
[34mℹ[39m [2mdist/[22mmedia-allowlist-B8EX01DH.mjs                                             [2m  1.21 kB[22m [2m│ gzip:  0.71 kB[22m
[34mℹ[39m [2mdist/[22mhash-DlUxGhQS.mjs                                                        [2m  1.21 kB[22m [2m│ gzip:  0.66 kB[22m
[34mℹ[39m [2mdist/[22mschema-Jdu-gsim.mjs                                                      [2m  1.20 kB[22m [2m│ gzip:  0.59 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/providers/index.mjs.map                           [2m  1.16 kB[22m [2m│ gzip:  0.62 kB[22m
[34mℹ[39m [2mdist/[22msettings-DWPE33K3.mjs                                                    [2m  1.16 kB[22m [2m│ gzip:  0.48 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/PluginRegistry.mjs.map                                      [2m  1.15 kB[22m [2m│ gzip:  0.57 kB[22m
[34mℹ[39m [2mdist/[22mdb/postgres.mjs.map                                                      [2m  1.14 kB[22m [2m│ gzip:  0.53 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/orphans/index.mjs.map                            [2m  1.14 kB[22m [2m│ gzip:  0.58 kB[22m
[34mℹ[39m [2mdist/[22msetup-complete-C6ZCLhKo.mjs                                              [2m  1.12 kB[22m [2m│ gzip:  0.52 kB[22m
[34mℹ[39m [2mdist/[22msetup-nonce-CY1gQiAU.mjs.map                                             [2m  1.10 kB[22m [2m│ gzip:  0.63 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/execute.d.mts.map                      [2m  1.09 kB[22m [2m│ gzip:  0.53 kB[22m
[34mℹ[39m [2mdist/[22msetup-nonce-CY1gQiAU.mjs                                                 [2m  1.02 kB[22m [2m│ gzip:  0.58 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/analyze.d.mts.map                      [2m  1.00 kB[22m [2m│ gzip:  0.43 kB[22m
[34mℹ[39m [2mdist/[22mauth/providers/github.mjs.map                                            [2m  0.99 kB[22m [2m│ gzip:  0.51 kB[22m
[34mℹ[39m [2mdist/[22mauth/providers/google.mjs.map                                            [2m  0.99 kB[22m [2m│ gzip:  0.51 kB[22m
[34mℹ[39m [2mdist/[22mtypes-DFowNO60.d.mts.map                                                 [2m  0.94 kB[22m [2m│ gzip:  0.46 kB[22m
[34mℹ[39m [2mdist/[22mtransaction-NQj4VJ7Z.mjs                                                 [2m  0.92 kB[22m [2m│ gzip:  0.48 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-components.mjs.map                               [2m  0.91 kB[22m [2m│ gzip:  0.51 kB[22m
[34mℹ[39m [2mdist/[22mdb/sqlite.mjs.map                                                        [2m  0.91 kB[22m [2m│ gzip:  0.51 kB[22m
[34mℹ[39m [2mdist/[22mchunks-Bx72LI7_.mjs.map                                                  [2m  0.90 kB[22m [2m│ gzip:  0.57 kB[22m
[34mℹ[39m [2mdist/[22moauth-user-lookup-meyS2oB1.mjs                                           [2m  0.81 kB[22m [2m│ gzip:  0.49 kB[22m
[34mℹ[39m [2mdist/[22mchunks-Bx72LI7_.mjs                                                      [2m  0.80 kB[22m [2m│ gzip:  0.51 kB[22m
[34mℹ[39m [2mdist/[22mredirect-DGRsLO2I.mjs.map                                                [2m  0.75 kB[22m [2m│ gzip:  0.49 kB[22m
[34mℹ[39m [2mdist/[22mdb/libsql.mjs.map                                                        [2m  0.71 kB[22m [2m│ gzip:  0.41 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/rewrite-url-helpers.d.mts.map          [2m  0.70 kB[22m [2m│ gzip:  0.33 kB[22m
[34mℹ[39m [2mdist/[22mload-DbZkcPDT.mjs                                                        [2m  0.70 kB[22m [2m│ gzip:  0.38 kB[22m
[34mℹ[39m [2mdist/[22madapters-9DybjTO6.d.mts.map                                              [2m  0.67 kB[22m [2m│ gzip:  0.32 kB[22m
[34mℹ[39m [2mdist/[22mstorage/s3.d.mts.map                                                     [2m  0.67 kB[22m [2m│ gzip:  0.33 kB[22m
[34mℹ[39m [2mdist/[22mseo/index.d.mts.map                                                      [2m  0.64 kB[22m [2m│ gzip:  0.36 kB[22m
[34mℹ[39m [2mdist/[22mstorage/local.d.mts.map                                                  [2m  0.62 kB[22m [2m│ gzip:  0.32 kB[22m
[34mℹ[39m [2mdist/[22mtypes-DW1l0gCv.d.mts.map                                                 [2m  0.59 kB[22m [2m│ gzip:  0.31 kB[22m
[34mℹ[39m [2mdist/[22mversion-CORx8dAQ.mjs.map                                                 [2m  0.59 kB[22m [2m│ gzip:  0.33 kB[22m
[34mℹ[39m [2mdist/[22mescape-B8bdIryO.mjs.map                                                  [2m  0.58 kB[22m [2m│ gzip:  0.34 kB[22m
[34mℹ[39m [2mdist/[22mmode-DPRPvJYm.mjs                                                        [2m  0.58 kB[22m [2m│ gzip:  0.36 kB[22m
[34mℹ[39m [2mdist/[22mrequest-context.d.mts.map                                                [2m  0.57 kB[22m [2m│ gzip:  0.31 kB[22m
[34mℹ[39m [2mdist/[22mdatabase/instrumentation.d.mts.map                                       [2m  0.53 kB[22m [2m│ gzip:  0.28 kB[22m
[34mℹ[39m [2mdist/[22mredirect-DGRsLO2I.mjs                                                    [2m  0.53 kB[22m [2m│ gzip:  0.37 kB[22m
[34mℹ[39m [2mdist/[22mtransport-FtawFa7l.d.mts.map                                             [2m  0.49 kB[22m [2m│ gzip:  0.28 kB[22m
[34mℹ[39m [2mdist/[22mclient/cf-access.d.mts.map                                               [2m  0.49 kB[22m [2m│ gzip:  0.27 kB[22m
[34mℹ[39m [2mdist/[22mapi/route-utils.d.mts.map                                                [2m  0.48 kB[22m [2m│ gzip:  0.27 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/media.d.mts.map                        [2m  0.45 kB[22m [2m│ gzip:  0.25 kB[22m
[34mℹ[39m [2mdist/[22msite-url-D-M4Fd8O.mjs                                                    [2m  0.44 kB[22m [2m│ gzip:  0.30 kB[22m
[34mℹ[39m [2mdist/[22mplugin-utils.d.mts.map                                                   [2m  0.42 kB[22m [2m│ gzip:  0.24 kB[22m
[34mℹ[39m [2mdist/[22mmedia/local-runtime.d.mts.map                                            [2m  0.40 kB[22m [2m│ gzip:  0.23 kB[22m
[34mℹ[39m [2mdist/[22mrunner-DcfZewkO.d.mts.map                                                [2m  0.40 kB[22m [2m│ gzip:  0.23 kB[22m
[34mℹ[39m [2mdist/[22mastro/index.d.mts.map                                                    [2m  0.36 kB[22m [2m│ gzip:  0.22 kB[22m
[34mℹ[39m [2mdist/[22mtypes-Dz9CGX_d.mjs                                                       [2m  0.36 kB[22m [2m│ gzip:  0.25 kB[22m
[34mℹ[39m [2mdist/[22mescape-B8bdIryO.mjs                                                      [2m  0.36 kB[22m [2m│ gzip:  0.25 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/rewrite-urls.d.mts.map                 [2m  0.34 kB[22m [2m│ gzip:  0.23 kB[22m
[34mℹ[39m [2mdist/[22mastro/middleware/auth.d.mts.map                                          [2m  0.33 kB[22m [2m│ gzip:  0.22 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/execute.d.mts.map               [2m  0.32 kB[22m [2m│ gzip:  0.23 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/prepare.d.mts.map                      [2m  0.32 kB[22m [2m│ gzip:  0.21 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/plugins/_pluginId_/_...path_.d.mts.map                  [2m  0.29 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/analyze.d.mts.map               [2m  0.27 kB[22m [2m│ gzip:  0.20 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.d.mts.map  [2m  0.26 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/PluginRegistry.d.mts.map                                    [2m  0.26 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22mtypes-Db67HHlU.mjs                                                       [2m  0.25 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/_slug_.d.mts.map                [2m  0.25 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22mapi-tokens-D3C9v02m.mjs                                                  [2m  0.25 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/terms/_taxonomy_.d.mts.map    [2m  0.24 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/probe.d.mts.map                                  [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/index.d.mts.map               [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/oauth-clients/_id_.d.mts.map                      [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/_slug_/translations.d.mts.map   [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/bylines/_id_/index.d.mts.map                      [2m  0.23 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/comments/_collection_/_contentId_/index.d.mts.map       [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/providers/_providerId_/_itemId_.d.mts.map         [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_.d.mts.map                     [2m  0.23 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/providers/_providerId_/index.d.mts.map            [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/redirects/404s/index.d.mts.map                          [2m  0.23 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/index.d.mts.map        [2m  0.22 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/index.d.mts.map                 [2m  0.22 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/schedule.d.mts.map            [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/api-tokens/index.d.mts.map                        [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/_id_.d.mts.map                                    [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/sections/_slug_.d.mts.map                               [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/allowed-domains/_domain_.d.mts.map                [2m  0.22 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22mplugins/adapt-sandbox-entry.d.mts.map                                    [2m  0.22 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_.d.mts.map                                  [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/redirects/_id_.d.mts.map                                [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/oauth-clients/index.d.mts.map                     [2m  0.21 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/widgets/_id_.d.mts.map              [2m  0.21 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/allowed-domains/index.d.mts.map                   [2m  0.21 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/translations.d.mts.map                     [2m  0.21 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/settings/email.d.mts.map                                [2m  0.21 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/well-known/oauth-authorization-server.d.mts.map         [2m  0.21 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/_id_.d.mts.map                           [2m  0.21 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/index.d.mts.map                        [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/index.d.mts.map                    [2m  0.20 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/well-known/oauth-protected-resource.d.mts.map           [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/items/_id_.d.mts.map                       [2m  0.20 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/discard-draft.d.mts.map       [2m  0.20 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/index.d.mts.map                      [2m  0.20 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/themes/marketplace/_id_/thumbnail.d.mts.map       [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/index.d.mts.map                              [2m  0.20 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/_id_/uninstall.d.mts.map         [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/_id_.d.mts.map                             [2m  0.20 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/translations.d.mts.map        [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/reorder.d.mts.map      [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/settings.d.mts.map                                      [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/preview-url.d.mts.map         [2m  0.20 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/_id_/install.d.mts.map        [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/bylines/index.d.mts.map                           [2m  0.20 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/dev-bypass.d.mts.map                              [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/dev-bypass.d.mts.map                               [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/mcp.d.mts.map                                           [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/authorize.d.mts.map                               [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/_id_/update.d.mts.map            [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_.d.mts.map                           [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/_id_/index.d.mts.map          [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/send-recovery.d.mts.map                [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/duplicate.d.mts.map           [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/permanent.d.mts.map           [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/revisions.d.mts.map           [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/unpublish.d.mts.map           [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/index.d.mts.map                            [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/hooks/exclusive/_hookName_.d.mts.map              [2m  0.19 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/themes/marketplace/_id_/index.d.mts.map           [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mmedia/index.d.mts.map                                                    [2m  0.19 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/_id_/icon.d.mts.map           [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/register.d.mts.map                                [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/register-options.d.mts.map                  [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/publish.d.mts.map             [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media.d.mts.map                                         [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/redirects/index.d.mts.map                               [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/compare.d.mts.map             [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/restore.d.mts.map             [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/install.d.mts.map                [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/oauth/_provider_/callback.d.mts.map                [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/sections/index.d.mts.map                                [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/uninstall.d.mts.map                  [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/callback.d.mts.map              [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/token.d.mts.map                                   [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/index.d.mts.map               [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/register/options.d.mts.map                 [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/index.d.mts.map                                   [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/themes/marketplace/index.d.mts.map                [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/register/verify.d.mts.map                  [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/dev/emails.d.mts.map                                    [2m  0.19 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/me.d.mts.map                                       [2m  0.18 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/revisions/_revisionId_/restore.d.mts.map                [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/middleware/request-context.d.mts.map                               [2m  0.18 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/_id_/status.d.mts.map                    [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/disable.d.mts.map                    [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/hooks/exclusive/index.d.mts.map                   [2m  0.18 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/typegen.d.mts.map                                       [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/widgets.d.mts.map                   [2m  0.18 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/sitemap-_collection_.xml.d.mts.map                          [2m  0.18 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/enable.d.mts.map                     [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/update.d.mts.map                     [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/disable.d.mts.map                      [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/reorder.d.mts.map                   [2m  0.18 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mruntime.d.mts.map                                                        [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/revisions/_revisionId_/index.d.mts.map                  [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/index.d.mts.map                      [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/enable.d.mts.map                       [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/oauth/_provider_.d.mts.map                         [2m  0.18 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/device/authorize.d.mts.map                        [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/trash.d.mts.map                    [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/updates.d.mts.map                         [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/redirects/404s/summary.d.mts.map                        [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/complete.d.mts.map                          [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/magic-link/verify.d.mts.map                        [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/signup/complete.d.mts.map                          [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/file/_...key_.d.mts.map                           [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/providers/index.d.mts.map                         [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/admin-verify.d.mts.map                            [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-components.d.mts.map                             [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/api-tokens/_id_.d.mts.map                         [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/counts.d.mts.map                         [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/index.d.mts.map                          [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/options.d.mts.map                          [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/signup/request.d.mts.map                           [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/reorder.d.mts.map                          [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/orphans/_slug_.d.mts.map                         [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mversion-CORx8dAQ.mjs                                                     [2m  0.17 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/middleware/redirect.d.mts.map                                      [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/token/refresh.d.mts.map                           [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/verify.d.mts.map                           [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/orphans/index.d.mts.map                          [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/search/suggest.d.mts.map                                [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/index.d.mts.map                           [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/accept.d.mts.map                            [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/magic-link/send.d.mts.map                          [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/signup/verify.d.mts.map                            [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/_id_/confirm.d.mts.map                            [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/device/token.d.mts.map                            [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/token/revoke.d.mts.map                            [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/bulk.d.mts.map                           [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/index.d.mts.map                            [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/upload-url.d.mts.map                              [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/items.d.mts.map                            [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/search/enable.d.mts.map                                 [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/search/rebuild.d.mts.map                                [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/index.d.mts.map                             [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/index.d.mts.map                             [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/device/code.d.mts.map                             [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/search/index.d.mts.map                                  [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/dev-reset.d.mts.map                               [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/themes/preview.d.mts.map                                [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/middleware/setup.d.mts.map                                         [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/openapi.json.d.mts.map                                  [2m  0.17 kB[22m [2m│ gzip:  0.14 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/search/stats.d.mts.map                                  [2m  0.16 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/well-known/auth.d.mts.map                               [2m  0.16 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/index.d.mts.map                                  [2m  0.16 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/status.d.mts.map                                  [2m  0.16 kB[22m [2m│ gzip:  0.14 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/logout.d.mts.map                                   [2m  0.16 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/admin.d.mts.map                                   [2m  0.16 kB[22m [2m│ gzip:  0.14 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/index.d.mts.map                                   [2m  0.16 kB[22m [2m│ gzip:  0.14 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/dashboard.d.mts.map                                     [2m  0.16 kB[22m [2m│ gzip:  0.14 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/manifest.d.mts.map                                      [2m  0.16 kB[22m [2m│ gzip:  0.14 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/snapshot.d.mts.map                                      [2m  0.16 kB[22m [2m│ gzip:  0.14 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/mode.d.mts.map                                     [2m  0.16 kB[22m [2m│ gzip:  0.14 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/sitemap.xml.d.mts.map                                       [2m  0.16 kB[22m [2m│ gzip:  0.14 kB[22m
[34mℹ[39m [2mdist/[22mastro/middleware.d.mts.map                                               [2m  0.15 kB[22m [2m│ gzip:  0.14 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/robots.txt.d.mts.map                                        [2m  0.15 kB[22m [2m│ gzip:  0.14 kB[22m
[34mℹ[39m [2mdist/[22mdb/postgres.d.mts.map                                                    [2m  0.15 kB[22m [2m│ gzip:  0.14 kB[22m
[34mℹ[39m [2mdist/[22mauth/providers/github.d.mts.map                                          [2m  0.15 kB[22m [2m│ gzip:  0.14 kB[22m
[34mℹ[39m [2mdist/[22mauth/providers/google.d.mts.map                                          [2m  0.15 kB[22m [2m│ gzip:  0.14 kB[22m
[34mℹ[39m [2mdist/[22mdb/libsql.d.mts.map                                                      [2m  0.14 kB[22m [2m│ gzip:  0.14 kB[22m
[34mℹ[39m [2mdist/[22mdb/sqlite.d.mts.map                                                      [2m  0.14 kB[22m [2m│ gzip:  0.14 kB[22m
[34mℹ[39m [2mdist/[22mssrf-CTul4uQi.mjs                                                        [2m  0.01 kB[22m [2m│ gzip:  0.03 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mindex.d.mts[22m[39m                                                              [2m 18.12 kB[22m [2m│ gzip:  4.80 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/types.d.mts[22m[39m                                                        [2m 12.52 kB[22m [2m│ gzip:  3.83 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mclient/index.d.mts[22m[39m                                                       [2m 11.48 kB[22m [2m│ gzip:  3.14 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mapi/schemas/index.d.mts[22m[39m                                                  [2m  7.79 kB[22m [2m│ gzip:  1.86 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mpage/index.d.mts[22m[39m                                                         [2m  6.82 kB[22m [2m│ gzip:  2.27 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mplugin-types.d.mts[22m[39m                                                       [2m  6.38 kB[22m [2m│ gzip:  2.28 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/execute.d.mts[22m[39m                          [2m  3.91 kB[22m [2m│ gzip:  1.54 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mapi/route-utils.d.mts[22m[39m                                                    [2m  2.94 kB[22m [2m│ gzip:  1.35 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mrequest-context.d.mts[22m[39m                                                    [2m  2.81 kB[22m [2m│ gzip:  1.29 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/index.d.mts[22m[39m                                                        [2m  2.60 kB[22m [2m│ gzip:  1.17 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mclient/cf-access.d.mts[22m[39m                                                   [2m  2.55 kB[22m [2m│ gzip:  1.03 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/analyze.d.mts[22m[39m                          [2m  2.52 kB[22m [2m│ gzip:  0.95 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mseo/index.d.mts[22m[39m                                                          [2m  2.45 kB[22m [2m│ gzip:  1.01 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mplugin-utils.d.mts[22m[39m                                                       [2m  2.21 kB[22m [2m│ gzip:  1.01 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mdatabase/instrumentation.d.mts[22m[39m                                           [2m  2.00 kB[22m [2m│ gzip:  0.95 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/rewrite-url-helpers.d.mts[22m[39m              [2m  1.63 kB[22m [2m│ gzip:  0.64 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mstorage/s3.d.mts[22m[39m                                                         [2m  1.61 kB[22m [2m│ gzip:  0.75 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mmedia/index.d.mts[22m[39m                                                        [2m  1.52 kB[22m [2m│ gzip:  0.63 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mstorage/local.d.mts[22m[39m                                                      [2m  1.50 kB[22m [2m│ gzip:  0.70 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mplugins/adapt-sandbox-entry.d.mts[22m[39m                                        [2m  1.37 kB[22m [2m│ gzip:  0.64 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mmedia/local-runtime.d.mts[22m[39m                                                [2m  1.33 kB[22m [2m│ gzip:  0.59 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mruntime.d.mts[22m[39m                                                            [2m  1.09 kB[22m [2m│ gzip:  0.58 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/middleware/auth.d.mts[22m[39m                                              [2m  0.97 kB[22m [2m│ gzip:  0.50 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/media.d.mts[22m[39m                            [2m  0.96 kB[22m [2m│ gzip:  0.47 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mseed/index.d.mts[22m[39m                                                         [2m  0.82 kB[22m [2m│ gzip:  0.34 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/middleware/redirect.d.mts[22m[39m                                          [2m  0.72 kB[22m [2m│ gzip:  0.45 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress-plugin/execute.d.mts[22m[39m                   [2m  0.67 kB[22m [2m│ gzip:  0.38 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/middleware/setup.d.mts[22m[39m                                             [2m  0.67 kB[22m [2m│ gzip:  0.40 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/middleware/request-context.d.mts[22m[39m                                   [2m  0.64 kB[22m [2m│ gzip:  0.40 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/rewrite-urls.d.mts[22m[39m                     [2m  0.59 kB[22m [2m│ gzip:  0.33 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/settings.d.mts[22m[39m                                          [2m  0.58 kB[22m [2m│ gzip:  0.33 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mdb/index.d.mts[22m[39m                                                           [2m  0.58 kB[22m [2m│ gzip:  0.28 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/settings/email.d.mts[22m[39m                                    [2m  0.53 kB[22m [2m│ gzip:  0.32 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/search/index.d.mts[22m[39m                                      [2m  0.51 kB[22m [2m│ gzip:  0.31 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/media/_id_.d.mts[22m[39m                                        [2m  0.51 kB[22m [2m│ gzip:  0.28 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/probe.d.mts[22m[39m                                      [2m  0.50 kB[22m [2m│ gzip:  0.29 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/typegen.d.mts[22m[39m                                           [2m  0.49 kB[22m [2m│ gzip:  0.32 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/api-tokens/index.d.mts[22m[39m                            [2m  0.48 kB[22m [2m│ gzip:  0.31 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/prepare.d.mts[22m[39m                          [2m  0.47 kB[22m [2m│ gzip:  0.27 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/search/suggest.d.mts[22m[39m                                    [2m  0.47 kB[22m [2m│ gzip:  0.30 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress-plugin/analyze.d.mts[22m[39m                   [2m  0.47 kB[22m [2m│ gzip:  0.29 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mauth/providers/github.d.mts[22m[39m                                              [2m  0.45 kB[22m [2m│ gzip:  0.30 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mauth/providers/google.d.mts[22m[39m                                              [2m  0.45 kB[22m [2m│ gzip:  0.30 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/comments/_collection_/_contentId_/index.d.mts[22m[39m           [2m  0.43 kB[22m [2m│ gzip:  0.28 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/search/enable.d.mts[22m[39m                                     [2m  0.42 kB[22m [2m│ gzip:  0.27 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/oauth-clients/_id_.d.mts[22m[39m                          [2m  0.41 kB[22m [2m│ gzip:  0.24 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/mcp.d.mts[22m[39m                                               [2m  0.41 kB[22m [2m│ gzip:  0.25 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/taxonomies/_name_/terms/_slug_.d.mts[22m[39m                    [2m  0.39 kB[22m [2m│ gzip:  0.24 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/plugins/_pluginId_/_...path_.d.mts[22m[39m                      [2m  0.39 kB[22m [2m│ gzip:  0.23 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/_id_/terms/_taxonomy_.d.mts[22m[39m        [2m  0.39 kB[22m [2m│ gzip:  0.26 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/media/providers/_providerId_/_itemId_.d.mts[22m[39m             [2m  0.39 kB[22m [2m│ gzip:  0.24 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/PluginRegistry.d.mts[22m[39m                                        [2m  0.38 kB[22m [2m│ gzip:  0.25 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/comments/_id_.d.mts[22m[39m                               [2m  0.38 kB[22m [2m│ gzip:  0.26 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/allowed-domains/_domain_.d.mts[22m[39m                    [2m  0.37 kB[22m [2m│ gzip:  0.24 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/media/providers/_providerId_/index.d.mts[22m[39m                [2m  0.37 kB[22m [2m│ gzip:  0.23 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/middleware.d.mts[22m[39m                                                   [2m  0.37 kB[22m [2m│ gzip:  0.25 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/media.d.mts[22m[39m                                             [2m  0.37 kB[22m [2m│ gzip:  0.24 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/allowed-domains/index.d.mts[22m[39m                       [2m  0.36 kB[22m [2m│ gzip:  0.23 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/oauth-clients/index.d.mts[22m[39m                         [2m  0.36 kB[22m [2m│ gzip:  0.23 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/search/rebuild.d.mts[22m[39m                                    [2m  0.35 kB[22m [2m│ gzip:  0.24 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/taxonomies/index.d.mts[22m[39m                                  [2m  0.35 kB[22m [2m│ gzip:  0.22 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/taxonomies/_name_/terms/index.d.mts[22m[39m                     [2m  0.34 kB[22m [2m│ gzip:  0.23 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/passkey/_id_.d.mts[22m[39m                                 [2m  0.34 kB[22m [2m│ gzip:  0.23 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/me.d.mts[22m[39m                                           [2m  0.34 kB[22m [2m│ gzip:  0.23 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mdb/postgres.d.mts[22m[39m                                                        [2m  0.34 kB[22m [2m│ gzip:  0.22 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.d.mts[22m[39m      [2m  0.33 kB[22m [2m│ gzip:  0.22 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/schema/collections/_slug_/index.d.mts[22m[39m                   [2m  0.32 kB[22m [2m│ gzip:  0.21 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mdb/libsql.d.mts[22m[39m                                                          [2m  0.31 kB[22m [2m│ gzip:  0.22 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mdb/sqlite.d.mts[22m[39m                                                          [2m  0.31 kB[22m [2m│ gzip:  0.22 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/bylines/_id_/index.d.mts[22m[39m                          [2m  0.31 kB[22m [2m│ gzip:  0.20 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/_id_.d.mts[22m[39m                         [2m  0.31 kB[22m [2m│ gzip:  0.20 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/redirects/404s/index.d.mts[22m[39m                              [2m  0.31 kB[22m [2m│ gzip:  0.20 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/sections/_slug_.d.mts[22m[39m                                   [2m  0.30 kB[22m [2m│ gzip:  0.20 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/media/upload-url.d.mts[22m[39m                                  [2m  0.30 kB[22m [2m│ gzip:  0.21 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/menus/_name_.d.mts[22m[39m                                      [2m  0.30 kB[22m [2m│ gzip:  0.20 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/redirects/_id_.d.mts[22m[39m                                    [2m  0.30 kB[22m [2m│ gzip:  0.20 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/taxonomies/_name_/terms/_slug_/translations.d.mts[22m[39m       [2m  0.30 kB[22m [2m│ gzip:  0.20 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/_id_/schedule.d.mts[22m[39m                [2m  0.29 kB[22m [2m│ gzip:  0.20 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/schema/collections/_slug_/fields/index.d.mts[22m[39m            [2m  0.28 kB[22m [2m│ gzip:  0.20 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/widget-areas/_name_/widgets/_id_.d.mts[22m[39m                  [2m  0.28 kB[22m [2m│ gzip:  0.20 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/media/providers/index.d.mts[22m[39m                             [2m  0.28 kB[22m [2m│ gzip:  0.21 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/menus/_name_/translations.d.mts[22m[39m                         [2m  0.28 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/api-tokens/_id_.d.mts[22m[39m                             [2m  0.28 kB[22m [2m│ gzip:  0.21 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/comments/index.d.mts[22m[39m                              [2m  0.28 kB[22m [2m│ gzip:  0.21 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/index.d.mts[22m[39m                        [2m  0.27 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/menus/_name_/items/_id_.d.mts[22m[39m                           [2m  0.27 kB[22m [2m│ gzip:  0.20 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/oauth/register.d.mts[22m[39m                                    [2m  0.27 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/schema/collections/index.d.mts[22m[39m                          [2m  0.27 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/widget-areas/_name_.d.mts[22m[39m                               [2m  0.27 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/media/_id_/confirm.d.mts[22m[39m                                [2m  0.27 kB[22m [2m│ gzip:  0.20 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/well-known/oauth-authorization-server.d.mts[22m[39m             [2m  0.27 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/setup/dev-bypass.d.mts[22m[39m                                  [2m  0.27 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/users/_id_/index.d.mts[22m[39m                            [2m  0.27 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/dev-bypass.d.mts[22m[39m                                   [2m  0.27 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/bylines/index.d.mts[22m[39m                               [2m  0.27 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/oauth/authorize.d.mts[22m[39m                                   [2m  0.27 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/oauth/token.d.mts[22m[39m                                       [2m  0.27 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/well-known/oauth-protected-resource.d.mts[22m[39m               [2m  0.26 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/widget-areas/index.d.mts[22m[39m                                [2m  0.26 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/dev/emails.d.mts[22m[39m                                        [2m  0.26 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/redirects/index.d.mts[22m[39m                                   [2m  0.26 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/search/stats.d.mts[22m[39m                                      [2m  0.26 kB[22m [2m│ gzip:  0.20 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/sections/index.d.mts[22m[39m                                    [2m  0.26 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/_id_/discard-draft.d.mts[22m[39m           [2m  0.26 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/menus/index.d.mts[22m[39m                                       [2m  0.26 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/_id_/permanent.d.mts[22m[39m               [2m  0.26 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/_id_/preview-url.d.mts[22m[39m             [2m  0.26 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/_id_/translations.d.mts[22m[39m            [2m  0.26 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/schema/collections/_slug_/fields/reorder.d.mts[22m[39m          [2m  0.25 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/registry/_id_/uninstall.d.mts[22m[39m             [2m  0.25 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/themes/marketplace/_id_/thumbnail.d.mts[22m[39m           [2m  0.25 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/marketplace/_id_/install.d.mts[22m[39m            [2m  0.25 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/invite/register-options.d.mts[22m[39m                      [2m  0.25 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/_id_/duplicate.d.mts[22m[39m               [2m  0.25 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/_id_/unpublish.d.mts[22m[39m               [2m  0.25 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/users/_id_/send-recovery.d.mts[22m[39m                    [2m  0.25 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/_id_/revisions.d.mts[22m[39m               [2m  0.25 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/sitemap-_collection_.xml.d.mts[22m[39m                              [2m  0.25 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/hooks/exclusive/_hookName_.d.mts[22m[39m                  [2m  0.25 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/registry/_id_/update.d.mts[22m[39m                [2m  0.25 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/_id_/publish.d.mts[22m[39m                 [2m  0.25 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/_id_/restore.d.mts[22m[39m                 [2m  0.25 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/marketplace/_id_/index.d.mts[22m[39m              [2m  0.25 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/themes/marketplace/_id_/index.d.mts[22m[39m               [2m  0.24 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/_id_/compare.d.mts[22m[39m                 [2m  0.24 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress-plugin/callback.d.mts[22m[39m                  [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/_id_/uninstall.d.mts[22m[39m                      [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/marketplace/_id_/icon.d.mts[22m[39m               [2m  0.24 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/registry/install.d.mts[22m[39m                    [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/revisions/_revisionId_/restore.d.mts[22m[39m                    [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/oauth/_provider_/callback.d.mts[22m[39m                    [2m  0.24 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/passkey/register/options.d.mts[22m[39m                     [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/marketplace/index.d.mts[22m[39m                   [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/passkey/register/verify.d.mts[22m[39m                      [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/widget-areas/_name_/reorder.d.mts[22m[39m                       [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/widget-areas/_name_/widgets.d.mts[22m[39m                       [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/_id_/disable.d.mts[22m[39m                        [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/themes/marketplace/index.d.mts[22m[39m                    [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/widget-components.d.mts[22m[39m                                 [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/_id_/enable.d.mts[22m[39m                         [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/_id_/update.d.mts[22m[39m                         [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/users/_id_/disable.d.mts[22m[39m                          [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/oauth/device/authorize.d.mts[22m[39m                            [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/revisions/_revisionId_/index.d.mts[22m[39m                      [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/comments/_id_/status.d.mts[22m[39m                        [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/hooks/exclusive/index.d.mts[22m[39m                       [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/setup/admin-verify.d.mts[22m[39m                                [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/users/_id_/enable.d.mts[22m[39m                           [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/oauth/_provider_.d.mts[22m[39m                             [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/trash.d.mts[22m[39m                        [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/invite/complete.d.mts[22m[39m                              [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/signup/complete.d.mts[22m[39m                              [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/_id_/index.d.mts[22m[39m                          [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/passkey/options.d.mts[22m[39m                              [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/menus/_name_/reorder.d.mts[22m[39m                              [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/redirects/404s/summary.d.mts[22m[39m                            [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/schema/orphans/_slug_.d.mts[22m[39m                             [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/updates.d.mts[22m[39m                             [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/magic-link/verify.d.mts[22m[39m                            [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/signup/request.d.mts[22m[39m                               [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/oauth/token/refresh.d.mts[22m[39m                               [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/comments/counts.d.mts[22m[39m                             [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/passkey/verify.d.mts[22m[39m                               [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/media/file/_...key_.d.mts[22m[39m                               [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/magic-link/send.d.mts[22m[39m                              [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/oauth/token/revoke.d.mts[22m[39m                                [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/setup/dev-reset.d.mts[22m[39m                                   [2m  0.23 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/comments/bulk.d.mts[22m[39m                               [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/menus/_name_/items.d.mts[22m[39m                                [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/oauth/device/token.d.mts[22m[39m                                [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/schema/orphans/index.d.mts[22m[39m                              [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/index.d.mts[22m[39m                               [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/invite/accept.d.mts[22m[39m                                [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/invite/index.d.mts[22m[39m                                 [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/signup/verify.d.mts[22m[39m                                [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/openapi.json.d.mts[22m[39m                                      [2m  0.23 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/passkey/index.d.mts[22m[39m                                [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/oauth/device/code.d.mts[22m[39m                                 [2m  0.23 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/themes/preview.d.mts[22m[39m                                    [2m  0.23 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/users/index.d.mts[22m[39m                                 [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/logout.d.mts[22m[39m                                       [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/well-known/auth.d.mts[22m[39m                                   [2m  0.22 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/dashboard.d.mts[22m[39m                                         [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/setup/admin.d.mts[22m[39m                                       [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/setup/index.d.mts[22m[39m                                       [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/setup/status.d.mts[22m[39m                                      [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/sitemap.xml.d.mts[22m[39m                                           [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/schema/index.d.mts[22m[39m                                      [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/manifest.d.mts[22m[39m                                          [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/snapshot.d.mts[22m[39m                                          [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/robots.txt.d.mts[22m[39m                                            [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/mode.d.mts[22m[39m                                         [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mcli/index.d.mts[22m[39m                                                          [2m  0.01 kB[22m [2m│ gzip:  0.03 kB[22m
[34mℹ[39m [2mdist/[22m[32mindex-ByKWp8rL.d.mts[39m                                                     [2m151.43 kB[22m [2m│ gzip: 40.66 kB[22m
[34mℹ[39m [2mdist/[22m[32mbylines-D8L5-7Sj.d.mts[39m                                                   [2m 71.29 kB[22m [2m│ gzip:  8.35 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-JFYwrjee.d.mts[39m                                                     [2m 39.71 kB[22m [2m│ gzip: 10.61 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-C1KKK4VP.d.mts[39m                                                     [2m 10.82 kB[22m [2m│ gzip:  2.32 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-Cb2UCDJg.d.mts[39m                                                     [2m  9.78 kB[22m [2m│ gzip:  3.24 kB[22m
[34mℹ[39m [2mdist/[22m[32mplaceholder-D3cFCU9y.d.mts[39m                                               [2m  8.70 kB[22m [2m│ gzip:  2.96 kB[22m
[34mℹ[39m [2mdist/[22m[32mvalidate-BpQGsmd7.d.mts[39m                                                  [2m  8.64 kB[22m [2m│ gzip:  2.67 kB[22m
[34mℹ[39m [2mdist/[22m[32mindex-D2gvztOP.d.mts[39m                                                     [2m  7.74 kB[22m [2m│ gzip:  2.83 kB[22m
[34mℹ[39m [2mdist/[22m[32moptions-DRqvdw2a.d.mts[39m                                                   [2m  6.44 kB[22m [2m│ gzip:  2.43 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-DFowNO60.d.mts[39m                                                     [2m  6.19 kB[22m [2m│ gzip:  2.34 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-BWhaSS7U.d.mts[39m                                                     [2m  5.73 kB[22m [2m│ gzip:  1.66 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-DmxPPXGf.d.mts[39m                                                     [2m  5.04 kB[22m [2m│ gzip:  1.78 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-CzvJd1ND.d.mts[39m                                                     [2m  4.04 kB[22m [2m│ gzip:  1.50 kB[22m
[34mℹ[39m [2mdist/[22m[32madapters-9DybjTO6.d.mts[39m                                                  [2m  3.21 kB[22m [2m│ gzip:  1.32 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-DW1l0gCv.d.mts[39m                                                     [2m  2.64 kB[22m [2m│ gzip:  1.17 kB[22m
[34mℹ[39m [2mdist/[22m[32mrunner-DcfZewkO.d.mts[39m                                                    [2m  1.83 kB[22m [2m│ gzip:  0.91 kB[22m
[34mℹ[39m [2mdist/[22m[32mtransport-FtawFa7l.d.mts[39m                                                 [2m  1.67 kB[22m [2m│ gzip:  0.76 kB[22m
[34mℹ[39m 987 files, total: 6792.89 kB
[33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugins. Here is a breakdown:
  - rolldown-plugin-dts:generate (37%)
  - rolldown-plugin-dts:resolver (32%)
  - rolldown-plugin-dts:fake-js (25%)
See https://rolldown.rs/options/checks#plugintimings for more details.

[32m✔[39m Build complete in [32m5692ms[39m
$ pnpm typecheck
==> pnpm-typecheck
$ pnpm run --filter {./packages/**} typecheck
Scope: 30 of 58 workspace projects
packages/atproto-test-utils typecheck$ tsgo --noEmit
packages/auth typecheck$ tsgo --noEmit
packages/blocks typecheck$ tsgo --noEmit
packages/contentful-to-portable-text typecheck$ tsgo --noEmit
packages/contentful-to-portable-text typecheck: Done
packages/create-emdash typecheck$ tsgo --noEmit
packages/atproto-test-utils typecheck: Done
packages/gutenberg-to-portable-text typecheck$ tsgo --noEmit
packages/auth typecheck: Done
packages/marketplace typecheck$ tsc --noEmit
packages/create-emdash typecheck: Done
packages/plugin-types typecheck$ tsgo --noEmit
packages/gutenberg-to-portable-text typecheck: Done
packages/plugins/awcms-micro-example typecheck$ tsc --noEmit -p tsconfig.json
packages/plugin-types typecheck: Done
packages/registry-lexicons typecheck$ tsgo --noEmit
packages/blocks typecheck: Done
packages/x402 typecheck$ tsgo --noEmit
packages/registry-lexicons typecheck: Done
packages/x402 typecheck: Done
packages/marketplace typecheck: Done
packages/plugins/awcms-micro-example typecheck: Done
packages/registry-client typecheck$ tsgo --noEmit
packages/registry-client typecheck: Done
packages/admin typecheck$ tsgo --noEmit
packages/plugin-cli typecheck$ tsgo --noEmit
packages/plugin-cli typecheck: Done
packages/admin typecheck: Done
packages/auth-atproto typecheck$ tsgo --noEmit
packages/core typecheck$ tsgo --noEmit
packages/auth-atproto typecheck: Done
packages/core typecheck: Done
packages/cloudflare typecheck$ tsgo --noEmit
packages/plugins/ai-moderation typecheck$ tsgo --noEmit
packages/plugins/atproto typecheck$ tsgo --noEmit
packages/plugins/audit-log typecheck$ tsgo --noEmit
packages/plugins/audit-log typecheck: Done
packages/plugins/color typecheck$ tsgo --noEmit
packages/plugins/atproto typecheck: Done
packages/plugins/embeds typecheck$ tsgo --noEmit
packages/cloudflare typecheck: Done
packages/plugins/field-kit typecheck$ tsgo --noEmit
packages/plugins/ai-moderation typecheck: Done
packages/plugins/forms typecheck$ tsgo --noEmit
packages/plugins/color typecheck: Done
packages/plugins/marketplace-test typecheck$ tsgo --noEmit
packages/plugins/embeds typecheck: Done
packages/plugins/sandboxed-test typecheck$ tsgo --noEmit
packages/plugins/marketplace-test typecheck: Done
packages/plugins/webhook-notifier typecheck$ tsgo --noEmit
packages/plugins/sandboxed-test typecheck: Done
packages/plugins/field-kit typecheck: Done
packages/plugins/webhook-notifier typecheck: Done
packages/plugins/forms typecheck: Done
$ pnpm lint:quick
==> pnpm-lint-quick
$ oxlint -f json
{ "diagnostics": [{"message": "Function `parseAttributes` does not capture any variables from its parent scope","code": "eslint-plugin-unicorn(consistent-function-scoping)","severity": "warning","causes": [],"url": "https://oxc.rs/docs/guide/usage/linter/rules/unicorn/consistent-function-scoping.html","help": "Move `parseAttributes` to the outer scope to avoid recreating it on every call.","filename": "packages/plugins/awcms-micro-example/src/admin.tsx","labels": [{"label": "Outer scope where this function is defined","span": {"offset": 27348,"length": 18,"line": 740,"column": 10}},{"label": "This function does not use any variables from the parent function","span": {"offset": 28473,"length": 15,"line": 757,"column": 8}}],"related": []},
{"message": "Function `parseAttributes` does not capture any variables from its parent scope","code": "eslint-plugin-unicorn(consistent-function-scoping)","severity": "warning","causes": [],"url": "https://oxc.rs/docs/guide/usage/linter/rules/unicorn/consistent-function-scoping.html","help": "Move `parseAttributes` to the outer scope to avoid recreating it on every call.","filename": "packages/plugins/awcms-micro-example/src/admin.tsx","labels": [{"label": "Outer scope where this function is defined","span": {"offset": 34868,"length": 16,"line": 868,"column": 10}},{"label": "This function does not use any variables from the parent function","span": {"offset": 35408,"length": 15,"line": 883,"column": 8}}],"related": []},
{"message": "Function `parseAttributes` does not capture any variables from its parent scope","code": "eslint-plugin-unicorn(consistent-function-scoping)","severity": "warning","causes": [],"url": "https://oxc.rs/docs/guide/usage/linter/rules/unicorn/consistent-function-scoping.html","help": "Move `parseAttributes` to the outer scope to avoid recreating it on every call.","filename": "packages/plugins/awcms-micro-example/src/admin.tsx","labels": [{"label": "Outer scope where this function is defined","span": {"offset": 39068,"length": 15,"line": 946,"column": 10}},{"label": "This function does not use any variables from the parent function","span": {"offset": 39998,"length": 15,"line": 962,"column": 8}}],"related": []}],
              "number_of_files": 1762,
              "number_of_rules": 135,
              "threads_count": 20,
              "start_time": 1.6023525570000001
            }
            $ pnpm --filter @emdash-cms/admin exec node --run locale:compile
==> pnpm-admin-locale-compile
Compiling message catalogs…
Done in 551ms
$ pnpm test
==> pnpm-test
$ pnpm run --filter {./packages/*} test
Scope: 17 of 58 workspace projects
packages/atproto-test-utils test$ vitest run
packages/auth test$ vitest
packages/blocks test$ vitest
packages/contentful-to-portable-text test$ vitest
packages/atproto-test-utils test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/atproto-test-utils
packages/auth test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/auth
packages/blocks test: 7:46:25 PM [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
packages/blocks test: `optimizeDeps.rollupOptions` / `ssr.optimizeDeps.rollupOptions` is deprecated. Use `optimizeDeps.rolldownOptions` instead. Note that this option may be set by a plugin. Set VITE_DEPRECATION_TRACE=1 to see where it is called.
packages/blocks test: Both esbuild and oxc options were set. oxc options will be used and esbuild options will be ignored. The following esbuild options were set: `{ jsx: 'automatic', jsxImportSource: undefined }`
packages/blocks test: [vite:react-babel] We recommend switching to `@vitejs/plugin-react-oxc` for improved performance. More information at https://vite.dev/rolldown
packages/contentful-to-portable-text test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/contentful-to-portable-text
packages/blocks test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/blocks
packages/contentful-to-portable-text test:  Test Files  2 passed (2)
packages/contentful-to-portable-text test:       Tests  60 passed (60)
packages/contentful-to-portable-text test:    Start at  19:46:25
packages/contentful-to-portable-text test:    Duration  310ms (transform 237ms, setup 0ms, import 314ms, tests 25ms, environment 0ms)
packages/contentful-to-portable-text test: Done
packages/create-emdash test$ vitest run
packages/auth test:  Test Files  5 passed (5)
packages/auth test:       Tests  57 passed (57)
packages/auth test:    Start at  19:46:25
packages/auth test:    Duration  398ms (transform 320ms, setup 0ms, import 683ms, tests 320ms, environment 1ms)
packages/auth test: Done
packages/gutenberg-to-portable-text test$ vitest
packages/atproto-test-utils test:  Test Files  1 passed (1)
packages/atproto-test-utils test:       Tests  17 passed (17)
packages/atproto-test-utils test:    Start at  19:46:25
packages/atproto-test-utils test:    Duration  582ms (transform 97ms, setup 0ms, import 315ms, tests 136ms, environment 0ms)
packages/atproto-test-utils test: Done
packages/marketplace test$ vitest
packages/create-emdash test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/create-emdash
packages/gutenberg-to-portable-text test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/gutenberg-to-portable-text
packages/marketplace test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/marketplace
packages/create-emdash test:  Test Files  2 passed (2)
packages/create-emdash test:       Tests  103 passed (103)
packages/create-emdash test:    Start at  19:46:26
packages/create-emdash test:    Duration  273ms (transform 81ms, setup 0ms, import 164ms, tests 52ms, environment 0ms)
packages/create-emdash test: Done
packages/plugin-types test$ vitest run
packages/blocks test:  Test Files  3 passed (3)
packages/blocks test:       Tests  96 passed (96)
packages/blocks test:    Start at  19:46:25
packages/blocks test:    Duration  994ms (transform 435ms, setup 0ms, import 789ms, tests 320ms, environment 1.09s)
packages/blocks test: Done
packages/registry-lexicons test$ vitest run
packages/gutenberg-to-portable-text test:  Test Files  2 passed (2)
packages/gutenberg-to-portable-text test:       Tests  140 passed (140)
packages/gutenberg-to-portable-text test:    Start at  19:46:26
packages/gutenberg-to-portable-text test:    Duration  354ms (transform 285ms, setup 0ms, import 375ms, tests 71ms, environment 0ms)
packages/gutenberg-to-portable-text test: Done
packages/x402 test$ vitest
packages/marketplace test:  Test Files  4 passed (4)
packages/marketplace test:       Tests  43 passed (43)
packages/marketplace test:    Start at  19:46:26
packages/marketplace test:    Duration  235ms (transform 118ms, setup 0ms, import 226ms, tests 42ms, environment 0ms)
packages/marketplace test: Done
packages/plugin-types test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugin-types
packages/registry-lexicons test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-lexicons
packages/x402 test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/x402
packages/plugin-types test:  Test Files  2 passed (2)
packages/plugin-types test:       Tests  27 passed (27)
packages/plugin-types test:    Start at  19:46:26
packages/plugin-types test:    Duration  165ms (transform 79ms, setup 0ms, import 106ms, tests 12ms, environment 0ms)
packages/plugin-types test: Done
packages/registry-lexicons test:  Test Files  1 passed (1)
packages/registry-lexicons test:       Tests  10 passed (10)
packages/registry-lexicons test:    Start at  19:46:27
packages/registry-lexicons test:    Duration  265ms (transform 84ms, setup 0ms, import 140ms, tests 7ms, environment 0ms)
packages/x402 test:  Test Files  1 passed (1)
packages/x402 test:       Tests  17 passed (17)
packages/x402 test:    Start at  19:46:27
packages/x402 test:    Duration  254ms (transform 64ms, setup 0ms, import 70ms, tests 48ms, environment 0ms)
packages/x402 test: Done
packages/registry-lexicons test: Done
packages/registry-client test$ vitest run
packages/registry-client test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-client
packages/registry-client test:  Test Files  3 passed (3)
packages/registry-client test:       Tests  37 passed (37)
packages/registry-client test:    Start at  19:46:27
packages/registry-client test:    Duration  319ms (transform 162ms, setup 0ms, import 358ms, tests 107ms, environment 0ms)
packages/registry-client test: Done
packages/admin test$ vitest
packages/plugin-cli test$ vitest run
packages/plugin-cli test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugin-cli
packages/admin test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/editor/bubble-menu.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/editor/toolbar.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/editor/slash-menu.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/components/users/UserDetail.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/components/RevisionHistory.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/components/settings/AllowedDomainsSettings.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/editor/block-menu.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/plugin-cli test:  Test Files  16 passed (16)
packages/plugin-cli test:       Tests  264 passed (264)
packages/plugin-cli test:    Start at  19:46:28
packages/plugin-cli test:    Duration  15.75s (transform 3.21s, setup 0ms, import 6.22s, tests 15.70s, environment 2ms)
packages/plugin-cli test: Done
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/components/users/InviteUserModal.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/lib/hooks.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  Test Files  62 passed (62)
packages/admin test:       Tests  879 passed (879)
packages/admin test:    Start at  19:46:28
packages/admin test:    Duration  25.24s (transform 0ms, setup 9.35s, import 146.91s, tests 67.10s, environment 0ms)
packages/admin test: Done
packages/auth-atproto test$ vitest run
packages/core test$ vitest
packages/core test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/core
packages/auth-atproto test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/auth-atproto
packages/auth-atproto test:  Test Files  3 passed (3)
packages/auth-atproto test:       Tests  30 passed (30)
packages/auth-atproto test:    Start at  19:46:54
packages/auth-atproto test:    Duration  610ms (transform 508ms, setup 0ms, import 776ms, tests 273ms, environment 0ms)
packages/auth-atproto test: Done
packages/core test:  Test Files  216 passed (216)
packages/core test:       Tests  3375 passed (3375)
packages/core test:    Start at  19:46:54
packages/core test:    Duration  22.63s (transform 41.11s, setup 0ms, import 182.30s, tests 181.96s, environment 36ms)
packages/core test: Done
packages/cloudflare test$ vitest run
packages/workerd test$ vitest run
packages/workerd test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/workerd
packages/cloudflare test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/cloudflare
packages/cloudflare test:  Test Files  8 passed (8)
packages/cloudflare test:       Tests  157 passed (157)
packages/cloudflare test:    Start at  19:47:17
packages/cloudflare test:    Duration  474ms (transform 572ms, setup 0ms, import 1.07s, tests 112ms, environment 1ms)
packages/cloudflare test: Done
packages/workerd test: [emdash:workerd] *** Fatal uncaught kj::Exception: kj/async-io-unix.c++:945: failed: ::bind(sockfd, &addr.generic, addrlen): Address already in use; toString() = 127.0.0.1:18789
packages/workerd test: stack: /home/data/dev_react/awcms-micro/awcmsmicro-dev/node_modules/.pnpm/workerd@1.20260507.1/node_modules/workerd/bin/workerd@5292b76 /home/data/dev_react/awcms-micro/awcmsmicro-dev/node_modules/.pnpm/workerd@1.20260507.1/node_modules/workerd/bin/workerd@5292949 /home/data/dev_react/awcms-micro/awcmsmicro-dev/node_modules/.pnpm/workerd@1.20260507.1/node_modules/workerd/bin/workerd@5290dcc /home/data/dev_react/awcms-micro/awcmsmicro-dev/node_modules/.pnpm/workerd@1.20260507.1/node_modules/workerd/bin/workerd@201922c /home/data/dev_react/awcms-micro/awcmsmicro-dev/node_modules/.pnpm/workerd@1.20260507.1/node_modules/workerd/bin/workerd@2019b91 /home/data/dev_react/awcms-micro/awcmsmicro-dev/node_modules/.pnpm/workerd@1.20260507.1/node_modules/workerd/bin/workerd@201a6bd /home/data/dev_react/awcms-micro/awcmsmicro-dev/node_modules/.pnpm/workerd@1.20260507.1/node_modules/workerd/bin/workerd@201bd3a /home/data/dev_react/awcms-micro/awcmsmicro-dev/node_modules/.pnpm/workerd@1.20260507.1/node_modules/workerd/bin/workerd@1f6f389 /home/data/dev_react/awcms-micro/awcmsmicro-dev/node_modules/.pnpm/workerd@1.20260507.1/node_modules/workerd/bin/workerd@52c6865 /home/data/dev_react/awcms-micro/awcmsmicro-dev/node_modules/.pnpm/workerd@1.20260507.1/node_modules/workerd/bin/workerd@52c6d88 /home/data/dev_react/awcms-micro/awcmsmicro-dev/node_modules/.pnpm/workerd@1.20260507.1/node_modules/workerd/bin/workerd@52c484e /home/data/dev_react/awcms-micro/awcmsmicro-dev/node_modules/.pnpm/workerd@1.20260507.1/node_modules/workerd/bin/workerd@52c464e /home/data/dev_react/awcms-micro/awcmsmicro-dev/node_modules/.pnpm/workerd@1.20260507.1/node_modules/workerd/bin/workerd@1f56d17 /lib/x86_64-linux-gnu/libc.so.6@2a1c9 /lib/x86_64-linux-gnu/libc.so.6@2a28a /home/data/dev_react/awcms-micro/awcmsmicro-dev/node_modules/.pnpm/workerd@1.20260507.1/node_modules/workerd/bin/workerd@1f56024
packages/workerd test: stderr | test/workerd-integration.test.ts > WorkerdSandboxRunner integration > loads multiple plugins simultaneously
packages/workerd test: [emdash:workerd] workerd exited with code 1
packages/workerd test: [emdash:workerd] restarting in 1000ms (attempt 1/5)
packages/workerd test: stderr | test/workerd-integration.test.ts > WorkerdSandboxRunner integration > loads multiple plugins simultaneously
packages/workerd test: [emdash:workerd] eager start failed: Error: [emdash:workerd] workerd failed to start within 10 seconds
packages/workerd test:     at WorkerdSandboxRunner.waitForReady (/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/workerd/src/sandbox/runner.ts:741:9)
packages/workerd test:     at WorkerdSandboxRunner.restart (/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/workerd/src/sandbox/runner.ts:718:3)
packages/workerd test: [emdash:workerd] restarting in 2000ms (attempt 2/5)
packages/workerd test:  ❯ test/workerd-integration.test.ts (6 tests | 1 failed) 17927ms
packages/workerd test:      × loads multiple plugins simultaneously 10062ms
packages/workerd test: ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
packages/workerd test:  FAIL  test/workerd-integration.test.ts > WorkerdSandboxRunner integration > loads multiple plugins simultaneously
packages/workerd test: Error: [emdash:workerd] workerd failed to start within 10 seconds
packages/workerd test:  ❯ WorkerdSandboxRunner.waitForReady src/sandbox/runner.ts:741:9
packages/workerd test:     739|   }
packages/workerd test:     740|
packages/workerd test:     741|   throw new Error("[emdash:workerd] workerd failed to start within 10 …
packages/workerd test:        |         ^
packages/workerd test:     742|  }
packages/workerd test:     743|
packages/workerd test:  ❯ WorkerdSandboxRunner.restart src/sandbox/runner.ts:718:3
packages/workerd test: ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
packages/workerd test:  Test Files  1 failed | 10 passed (11)
packages/workerd test:       Tests  1 failed | 72 passed (73)
packages/workerd test:    Start at  19:47:17
packages/workerd test:    Duration  19.88s (transform 7.94s, setup 0ms, import 16.52s, tests 19.37s, environment 1ms)
packages/workerd test: Failed
/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/workerd:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @emdash-cms/sandbox-workerd@0.0.1 test: `vitest run`
Exit status 1
[ELIFECYCLE] Test failed. See above for more details.
```
