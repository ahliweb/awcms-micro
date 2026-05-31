# Last Validation

## Validation Run Metadata

- Date:
  - Started: 2026-05-31T01:25:56Z
  - Completed: 2026-05-31T01:27:58Z
- Operator: unggul
- Branch: `main`
- Upstream commit SHA: `90ebf8a7af2004f24af58c88d7570a4a43af4a7b`
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

- Overall status: Passed
- Notes: Current step: Completed

## Failure Classification

| Category | Status | Details |
| --- | --- | --- |
| Script failure | Not triggered | Validation wrapper or shell orchestration failure |
| Dependency install failure | Not triggered | `pnpm install` failed |
| Upstream EmDash test failure | Not triggered | `pnpm --filter @emdash-cms/admin exec node --run locale:compile` or `pnpm test` failed |
| AWCMS-Micro added file failure | Not triggered | `pnpm --filter emdash build`, `pnpm typecheck`, `pnpm lint:quick`, or `pnpm build` failed |

## Detailed Output

```text
$ bash -lc rm -rf node_modules && pnpm install --frozen-lockfile
==> pnpm-install
Scope: all 61 workspace projects
[WARN] There are cyclic workspace dependencies: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/auth-atproto, /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/core
Lockfile is up to date, resolution step is skipped
Progress: resolved 1, reused 0, downloaded 0, added 0
Packages: +1685
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Progress: resolved 1685, reused 1652, downloaded 0, added 1685, done

devDependencies:
+ @axe-core/playwright 4.11.1
+ @changesets/changelog-github 0.5.2
+ @changesets/cli 2.29.8
+ @e18e/eslint-plugin 0.2.0
+ @lunariajs/core 0.1.1
+ @playwright/test 1.58.0
+ @types/node 24.10.13
+ @typescript/native-preview 7.0.0-dev.20260421.2
+ emdash 0.15.0 <- packages/core
+ knip 5.84.1
+ oxfmt 0.34.0
+ oxlint 1.66.0
+ oxlint-tsgolint 0.23.0
+ prettier 3.8.1
+ prettier-plugin-astro 0.14.1
+ typescript 6.0.0-beta

packages/plugins/awcms-micro-docs prepare$ node --run build
packages/plugins/awcms-micro-gallery prepare$ node --run build
packages/plugins/awcms-micro-sikesra prepare$ node --run build
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-docs/tsdown.config.ts[24m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m entry: [34msrc/index.ts, src/admin.tsx[39m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m target: [34mes2023[39m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m Build start
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m Cleaning 10 files
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/tsdown.config.ts[24m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-gallery/tsdown.config.ts[24m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m entry: [34msrc/index.ts, src/admin.tsx, src/navigation.ts, src/sandbox.ts[39m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m target: [34mes2023[39m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m entry: [34msrc/index.ts, src/sandbox.ts[39m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m target: [34mes2023[39m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m Build start
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m Build start
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m Cleaning 10 files
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m Cleaning 10 files
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22m[1mindex.mjs[22m                    [2m29.41 kB[22m [2m│ gzip:  6.79 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22m[1msandbox.mjs[22m                  [2m22.16 kB[22m [2m│ gzip:  5.32 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22mindex.mjs.map                [2m55.97 kB[22m [2m│ gzip: 12.38 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22msandbox.mjs.map              [2m43.13 kB[22m [2m│ gzip:  9.87 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22mvalidation-DzkH05cg.mjs.map  [2m24.53 kB[22m [2m│ gzip:  5.62 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22mvalidation-DzkH05cg.mjs      [2m14.98 kB[22m [2m│ gzip:  3.73 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22mindex.d.mts.map              [2m 0.87 kB[22m [2m│ gzip:  0.36 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22msandbox.d.mts.map            [2m 0.12 kB[22m [2m│ gzip:  0.12 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.mts[22m[39m                  [2m 3.57 kB[22m [2m│ gzip:  1.02 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22m[32m[1msandbox.d.mts[22m[39m                [2m 0.21 kB[22m [2m│ gzip:  0.16 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m 10 files, total: 194.95 kB
packages/plugins/awcms-micro-gallery prepare: [32m✔[39m Build complete in [32m1953ms[39m
packages/plugins/awcms-micro-gallery prepare: Done
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m [2mdist/[22m[1madmin.js[22m                 [2m 4.17 kB[22m [2m│ gzip: 0.98 kB[22m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m [2mdist/[22m[1mindex.js[22m                 [2m 0.97 kB[22m [2m│ gzip: 0.45 kB[22m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m [2mdist/[22mcontent-BL3jARXI.js.map  [2m10.48 kB[22m [2m│ gzip: 2.98 kB[22m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m [2mdist/[22mcontent-BL3jARXI.js      [2m 7.35 kB[22m [2m│ gzip: 2.43 kB[22m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m [2mdist/[22madmin.js.map             [2m 4.94 kB[22m [2m│ gzip: 1.46 kB[22m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m [2mdist/[22mindex.js.map             [2m 1.51 kB[22m [2m│ gzip: 0.63 kB[22m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m [2mdist/[22mindex.d.ts.map           [2m 0.58 kB[22m [2m│ gzip: 0.27 kB[22m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m [2mdist/[22madmin.d.ts.map           [2m 0.12 kB[22m [2m│ gzip: 0.12 kB[22m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.ts[22m[39m               [2m 1.30 kB[22m [2m│ gzip: 0.51 kB[22m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m [2mdist/[22m[32m[1madmin.d.ts[22m[39m               [2m 0.21 kB[22m [2m│ gzip: 0.15 kB[22m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m 10 files, total: 31.64 kB
packages/plugins/awcms-micro-docs prepare: [32m✔[39m Build complete in [32m2806ms[39m
packages/plugins/awcms-micro-docs prepare: Done
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22m[1madmin.js[22m                           [2m256.66 kB[22m [2m│ gzip: 45.94 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22m[1mindex.js[22m                           [2m  1.91 kB[22m [2m│ gzip:  0.71 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22m[1mnavigation.js[22m                      [2m  0.78 kB[22m [2m│ gzip:  0.32 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22m[1msandbox.js[22m                         [2m  0.30 kB[22m [2m│ gzip:  0.21 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22mruntime-BaXF2ney.js                [2m108.24 kB[22m [2m│ gzip: 20.48 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22mAwcmsPluginHeaderMenu-CnQixOjS.js  [2m 13.95 kB[22m [2m│ gzip:  3.27 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22m[32m[1mnavigation.d.ts[22m[39m                    [2m  6.04 kB[22m [2m│ gzip:  1.38 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.ts[22m[39m                         [2m  3.34 kB[22m [2m│ gzip:  0.97 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22m[32m[1msandbox.d.ts[22m[39m                       [2m  2.23 kB[22m [2m│ gzip:  0.50 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22m[32m[1madmin.d.ts[22m[39m                         [2m  1.17 kB[22m [2m│ gzip:  0.47 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m 10 files, total: 394.61 kB
packages/plugins/awcms-micro-sikesra prepare: [32m✔[39m Build complete in [32m3035ms[39m
packages/plugins/awcms-micro-sikesra prepare: Done
Done in 19.3s using pnpm v11.1.3
$ pnpm --filter emdash build
==> pnpm-build-emdash
$ tsdown
[34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
[34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/core/tsdown.config.ts[24m
[34mℹ[39m entry: [34msrc/index.ts, src/request-context.ts, src/astro/index.ts, src/astro/middleware.ts, src/astro/middleware/setup.ts, src/astro/middleware/auth.ts, src/astro/middleware/redirect.ts, src/astro/middleware/request-context.ts, src/astro/types.ts, src/db/index.ts, src/db/sqlite.ts, src/db/libsql.ts, src/db/postgres.ts, src/database/instrumentation.ts, src/storage/local.ts, src/storage/s3.ts, src/media/index.ts, src/media/local-runtime.ts, src/runtime.ts, src/seed/index.ts, src/cli/index.ts, src/client/index.ts, src/client/cf-access.ts, src/seo/index.ts, src/page/index.ts, src/plugin-utils.ts, src/plugin-types.ts, src/plugins/adapt-sandbox-entry.ts, src/api/route-utils.ts, src/api/schemas/index.ts, src/auth/providers/github.ts, src/auth/providers/google.ts[39m
[34mℹ[39m tsconfig: [34mtsconfig.json[39m
[34mℹ[39m Build start
[34mℹ[39m Cleaning 1088 files
[34mℹ[39m Granting execute permission to [4mdist/cli/index.mjs[24m
[34mℹ[39m [2mdist/[22m[1mcli/index.mjs[22m                                                            [2m140.16 kB[22m [2m│ gzip: 35.03 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/middleware.mjs[22m                                                     [2m 95.65 kB[22m [2m│ gzip: 24.64 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/openapi.json.mjs[22m                                        [2m 90.30 kB[22m [2m│ gzip: 14.40 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/mcp.mjs[22m                                                 [2m 67.85 kB[22m [2m│ gzip: 15.05 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/index.mjs[22m                                                          [2m 62.20 kB[22m [2m│ gzip: 14.46 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/middleware/request-context.mjs[22m                                     [2m 41.28 kB[22m [2m│ gzip: 10.36 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/execute.mjs[22m                            [2m 26.43 kB[22m [2m│ gzip:  8.19 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/middleware/auth.mjs[22m                                                [2m 21.70 kB[22m [2m│ gzip:  5.99 kB[22m
[34mℹ[39m [2mdist/[22m[1mpage/index.mjs[22m                                                           [2m 13.75 kB[22m [2m│ gzip:  4.05 kB[22m
[34mℹ[39m [2mdist/[22m[1mclient/index.mjs[22m                                                         [2m 12.89 kB[22m [2m│ gzip:  3.52 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/authorize.mjs[22m                                     [2m 11.85 kB[22m [2m│ gzip:  3.50 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/analyze.mjs[22m                            [2m  9.96 kB[22m [2m│ gzip:  3.36 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/snapshot.mjs[22m                                            [2m  9.27 kB[22m [2m│ gzip:  3.56 kB[22m
[34mℹ[39m [2mdist/[22m[1mindex.mjs[22m                                                                [2m  8.44 kB[22m [2m│ gzip:  2.57 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/comments/_collection_/_contentId_/index.mjs[22m             [2m  8.32 kB[22m [2m│ gzip:  2.57 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress-plugin/execute.mjs[22m                     [2m  8.06 kB[22m [2m│ gzip:  2.71 kB[22m
[34mℹ[39m [2mdist/[22m[1mapi/schemas/index.mjs[22m                                                    [2m  7.95 kB[22m [2m│ gzip:  1.88 kB[22m
[34mℹ[39m [2mdist/[22m[1mstorage/s3.mjs[22m                                                           [2m  7.78 kB[22m [2m│ gzip:  2.79 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/media.mjs[22m                              [2m  6.55 kB[22m [2m│ gzip:  2.13 kB[22m
[34mℹ[39m [2mdist/[22m[1mplugins/adapt-sandbox-entry.mjs[22m                                          [2m  5.86 kB[22m [2m│ gzip:  2.20 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/media.mjs[22m                                               [2m  5.73 kB[22m [2m│ gzip:  2.11 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/oauth/_provider_/callback.mjs[22m                      [2m  5.73 kB[22m [2m│ gzip:  2.03 kB[22m
[34mℹ[39m [2mdist/[22m[1mclient/cf-access.mjs[22m                                                     [2m  5.69 kB[22m [2m│ gzip:  2.17 kB[22m
[34mℹ[39m [2mdist/[22m[1mstorage/local.mjs[22m                                                        [2m  5.56 kB[22m [2m│ gzip:  2.04 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/rewrite-urls.mjs[22m                       [2m  5.51 kB[22m [2m│ gzip:  1.80 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_.mjs[22m                           [2m  5.01 kB[22m [2m│ gzip:  1.43 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/dev-bypass.mjs[22m                                    [2m  5.00 kB[22m [2m│ gzip:  1.99 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/token.mjs[22m                                         [2m  4.98 kB[22m [2m│ gzip:  1.69 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/sitemap-_collection_.xml.mjs[22m                                [2m  4.90 kB[22m [2m│ gzip:  1.84 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/register.mjs[22m                                      [2m  4.42 kB[22m [2m│ gzip:  1.65 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/_id_/index.mjs[22m                              [2m  4.36 kB[22m [2m│ gzip:  1.45 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/prepare.mjs[22m                            [2m  4.34 kB[22m [2m│ gzip:  1.62 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/settings/email.mjs[22m                                      [2m  4.32 kB[22m [2m│ gzip:  1.72 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs[22m          [2m  4.16 kB[22m [2m│ gzip:  1.39 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/rewrite-url-helpers.mjs[22m                [2m  4.02 kB[22m [2m│ gzip:  1.41 kB[22m
[34mℹ[39m [2mdist/[22m[1mmedia/local-runtime.mjs[22m                                                  [2m  3.75 kB[22m [2m│ gzip:  1.17 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/_slug_/index.mjs[22m                     [2m  3.74 kB[22m [2m│ gzip:  1.14 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/index.mjs[22m                                         [2m  3.71 kB[22m [2m│ gzip:  1.40 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/admin-verify.mjs[22m                                  [2m  3.68 kB[22m [2m│ gzip:  1.39 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs[22m        [2m  3.65 kB[22m [2m│ gzip:  1.03 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/_name_/widgets/_id_.mjs[22m                    [2m  3.64 kB[22m [2m│ gzip:  1.10 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/registry/install.mjs[22m                      [2m  3.55 kB[22m [2m│ gzip:  1.36 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/upload-url.mjs[22m                                    [2m  3.53 kB[22m [2m│ gzip:  1.46 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/registry/_id_/update.mjs[22m                  [2m  3.52 kB[22m [2m│ gzip:  1.28 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/marketplace/_id_/install.mjs[22m              [2m  3.52 kB[22m [2m│ gzip:  1.30 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/register/verify.mjs[22m                        [2m  3.51 kB[22m [2m│ gzip:  1.35 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/_id_/status.mjs[22m                          [2m  3.48 kB[22m [2m│ gzip:  1.30 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/taxonomies/_name_/terms/_slug_/translations.mjs[22m         [2m  3.47 kB[22m [2m│ gzip:  1.12 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/_id_.mjs[22m                                          [2m  3.42 kB[22m [2m│ gzip:  1.03 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/taxonomies/_name_/terms/_slug_.mjs[22m                      [2m  3.42 kB[22m [2m│ gzip:  0.96 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/update.mjs[22m                           [2m  3.23 kB[22m [2m│ gzip:  1.19 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/schedule.mjs[22m                  [2m  3.19 kB[22m [2m│ gzip:  1.00 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/preview-url.mjs[22m               [2m  3.19 kB[22m [2m│ gzip:  1.32 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/providers/_providerId_/index.mjs[22m                  [2m  3.15 kB[22m [2m│ gzip:  1.14 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/_slug_/fields/index.mjs[22m              [2m  3.12 kB[22m [2m│ gzip:  0.99 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/bylines/_id_/index.mjs[22m                            [2m  3.09 kB[22m [2m│ gzip:  0.97 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/updates.mjs[22m                               [2m  3.08 kB[22m [2m│ gzip:  1.12 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/admin.mjs[22m                                         [2m  3.06 kB[22m [2m│ gzip:  1.23 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/registry/_id_/uninstall.mjs[22m               [2m  3.03 kB[22m [2m│ gzip:  1.09 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/index.mjs[22m                          [2m  3.02 kB[22m [2m│ gzip:  1.13 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/bylines/index.mjs[22m                                 [2m  3.02 kB[22m [2m│ gzip:  1.16 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/oauth/_provider_.mjs[22m                               [2m  3.00 kB[22m [2m│ gzip:  1.17 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/oauth-clients/_id_.mjs[22m                            [2m  3.00 kB[22m [2m│ gzip:  0.97 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/plugins/_pluginId_/_...path_.mjs[22m                        [2m  2.96 kB[22m [2m│ gzip:  1.32 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/middleware/redirect.mjs[22m                                            [2m  2.93 kB[22m [2m│ gzip:  1.24 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/themes/marketplace/index.mjs[22m                      [2m  2.92 kB[22m [2m│ gzip:  1.10 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/uninstall.mjs[22m                        [2m  2.92 kB[22m [2m│ gzip:  1.09 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/bylines/_id_/translations.mjs[22m                     [2m  2.92 kB[22m [2m│ gzip:  1.11 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/enable.mjs[22m                           [2m  2.91 kB[22m [2m│ gzip:  1.07 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/index.mjs[22m                            [2m  2.86 kB[22m [2m│ gzip:  0.98 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/allowed-domains/_domain_.mjs[22m                      [2m  2.85 kB[22m [2m│ gzip:  0.98 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/publish.mjs[22m                   [2m  2.80 kB[22m [2m│ gzip:  1.14 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/redirects/_id_.mjs[22m                                      [2m  2.79 kB[22m [2m│ gzip:  0.84 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/_id_.mjs[22m                                   [2m  2.77 kB[22m [2m│ gzip:  0.98 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/signup/complete.mjs[22m                                [2m  2.77 kB[22m [2m│ gzip:  1.15 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/_slug_/fields/reorder.mjs[22m            [2m  2.77 kB[22m [2m│ gzip:  0.95 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/allowed-domains/index.mjs[22m                         [2m  2.76 kB[22m [2m│ gzip:  1.05 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/invite/complete.mjs[22m                                [2m  2.75 kB[22m [2m│ gzip:  1.13 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/marketplace/index.mjs[22m                     [2m  2.74 kB[22m [2m│ gzip:  1.02 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/disable.mjs[22m                          [2m  2.73 kB[22m [2m│ gzip:  1.02 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/dev-bypass.mjs[22m                                     [2m  2.72 kB[22m [2m│ gzip:  1.27 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress-plugin/analyze.mjs[22m                     [2m  2.71 kB[22m [2m│ gzip:  1.13 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/typegen.mjs[22m                                             [2m  2.66 kB[22m [2m│ gzip:  1.06 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_/translations.mjs[22m                           [2m  2.65 kB[22m [2m│ gzip:  0.93 kB[22m
[34mℹ[39m [2mdist/[22m[1mplugin-utils.mjs[22m                                                         [2m  2.63 kB[22m [2m│ gzip:  1.21 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/orphans/_slug_.mjs[22m                               [2m  2.63 kB[22m [2m│ gzip:  1.00 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/marketplace/_id_/index.mjs[22m                [2m  2.60 kB[22m [2m│ gzip:  0.94 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/options.mjs[22m                                [2m  2.59 kB[22m [2m│ gzip:  1.07 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/themes/marketplace/_id_/index.mjs[22m                 [2m  2.58 kB[22m [2m│ gzip:  0.94 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/register/options.mjs[22m                       [2m  2.57 kB[22m [2m│ gzip:  1.06 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/sections/_slug_.mjs[22m                                     [2m  2.57 kB[22m [2m│ gzip:  0.78 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/index.mjs[22m                                        [2m  2.54 kB[22m [2m│ gzip:  1.11 kB[22m
[34mℹ[39m [2mdist/[22m[1mseo/index.mjs[22m                                                            [2m  2.53 kB[22m [2m│ gzip:  1.02 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/index.mjs[22m                                  [2m  2.52 kB[22m [2m│ gzip:  1.00 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/taxonomies/_name_/terms/index.mjs[22m                       [2m  2.52 kB[22m [2m│ gzip:  0.90 kB[22m
[34mℹ[39m [2mdist/[22m[1mdatabase/instrumentation.mjs[22m                                             [2m  2.51 kB[22m [2m│ gzip:  1.22 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/index.mjs[22m                            [2m  2.49 kB[22m [2m│ gzip:  0.94 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/redirects/404s/index.mjs[22m                                [2m  2.47 kB[22m [2m│ gzip:  0.80 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/verify.mjs[22m                                 [2m  2.46 kB[22m [2m│ gzip:  1.01 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/_id_/confirm.mjs[22m                                  [2m  2.43 kB[22m [2m│ gzip:  1.07 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_.mjs[22m                                        [2m  2.40 kB[22m [2m│ gzip:  0.74 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/sitemap.xml.mjs[22m                                             [2m  2.40 kB[22m [2m│ gzip:  1.10 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/magic-link/send.mjs[22m                                [2m  2.40 kB[22m [2m│ gzip:  0.98 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/status.mjs[22m                                        [2m  2.39 kB[22m [2m│ gzip:  1.02 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/hooks/exclusive/_hookName_.mjs[22m                    [2m  2.36 kB[22m [2m│ gzip:  1.04 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/providers/_providerId_/_itemId_.mjs[22m               [2m  2.36 kB[22m [2m│ gzip:  0.78 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/_name_/widgets.mjs[22m                         [2m  2.35 kB[22m [2m│ gzip:  1.02 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/invite/index.mjs[22m                                   [2m  2.31 kB[22m [2m│ gzip:  1.06 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/invite/register-options.mjs[22m                        [2m  2.31 kB[22m [2m│ gzip:  1.00 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/index.mjs[22m                                 [2m  2.27 kB[22m [2m│ gzip:  0.89 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/settings.mjs[22m                                            [2m  2.27 kB[22m [2m│ gzip:  0.91 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/signup/request.mjs[22m                                 [2m  2.26 kB[22m [2m│ gzip:  0.98 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_/items/_id_.mjs[22m                             [2m  2.23 kB[22m [2m│ gzip:  0.77 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/taxonomies/index.mjs[22m                                    [2m  2.22 kB[22m [2m│ gzip:  0.84 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/orphans/index.mjs[22m                                [2m  2.21 kB[22m [2m│ gzip:  0.84 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/oauth-clients/index.mjs[22m                           [2m  2.20 kB[22m [2m│ gzip:  0.90 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/themes/preview.mjs[22m                                      [2m  2.15 kB[22m [2m│ gzip:  0.98 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/_name_.mjs[22m                                 [2m  2.15 kB[22m [2m│ gzip:  0.79 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/rebuild.mjs[22m                                      [2m  2.14 kB[22m [2m│ gzip:  0.92 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/api-tokens/index.mjs[22m                              [2m  2.13 kB[22m [2m│ gzip:  0.93 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/redirects/index.mjs[22m                                     [2m  2.12 kB[22m [2m│ gzip:  0.78 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/_id_/send-recovery.mjs[22m                      [2m  2.03 kB[22m [2m│ gzip:  0.97 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/device/token.mjs[22m                                  [2m  2.01 kB[22m [2m│ gzip:  0.94 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/index.mjs[22m                                        [2m  2.00 kB[22m [2m│ gzip:  0.94 kB[22m
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
[34mℹ[39m [2mdist/[22m[1mapi/route-utils.mjs[22m                                                      [2m  1.76 kB[22m [2m│ gzip:  0.83 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/restore.mjs[22m                   [2m  1.72 kB[22m [2m│ gzip:  0.74 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/discard-draft.mjs[22m             [2m  1.71 kB[22m [2m│ gzip:  0.74 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/_id_.mjs[22m                                 [2m  1.70 kB[22m [2m│ gzip:  0.66 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/unpublish.mjs[22m                 [2m  1.70 kB[22m [2m│ gzip:  0.73 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/suggest.mjs[22m                                      [2m  1.67 kB[22m [2m│ gzip:  0.82 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/index.mjs[22m                                         [2m  1.65 kB[22m [2m│ gzip:  0.67 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/magic-link/verify.mjs[22m                              [2m  1.65 kB[22m [2m│ gzip:  0.72 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/revisions/_revisionId_/restore.mjs[22m                      [2m  1.64 kB[22m [2m│ gzip:  0.70 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/translations.mjs[22m              [2m  1.58 kB[22m [2m│ gzip:  0.77 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs[22m             [2m  1.56 kB[22m [2m│ gzip:  0.75 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/manifest.mjs[22m                                            [2m  1.56 kB[22m [2m│ gzip:  0.80 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/marketplace/_id_/icon.mjs[22m                 [2m  1.54 kB[22m [2m│ gzip:  0.75 kB[22m
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
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/well-known/oauth-authorization-server.mjs[22m               [2m  1.18 kB[22m [2m│ gzip:  0.59 kB[22m
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
[34mℹ[39m [2mdist/[22mapi-CLwG_3dh.mjs.map                                                     [2m300.70 kB[22m [2m│ gzip: 65.00 kB[22m
[34mℹ[39m [2mdist/[22mcli/index.mjs.map                                                        [2m279.18 kB[22m [2m│ gzip: 63.71 kB[22m
[34mℹ[39m [2mdist/[22mrunner-CGlojznK.mjs.map                                                  [2m248.91 kB[22m [2m│ gzip: 46.33 kB[22m
[34mℹ[39m [2mdist/[22mastro/middleware.mjs.map                                                 [2m212.30 kB[22m [2m│ gzip: 54.22 kB[22m
[34mℹ[39m [2mdist/[22mmenus-BJHdFWhH.mjs.map                                                   [2m183.91 kB[22m [2m│ gzip: 40.93 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/openapi.json.mjs.map                                    [2m170.23 kB[22m [2m│ gzip: 23.57 kB[22m
[34mℹ[39m [2mdist/[22mapi-CLwG_3dh.mjs                                                         [2m142.04 kB[22m [2m│ gzip: 32.04 kB[22m
[34mℹ[39m [2mdist/[22mastro/index.mjs.map                                                      [2m134.24 kB[22m [2m│ gzip: 32.05 kB[22m
[34mℹ[39m [2mdist/[22mrunner-CGlojznK.mjs                                                      [2m129.47 kB[22m [2m│ gzip: 23.69 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/mcp.mjs.map                                             [2m126.22 kB[22m [2m│ gzip: 24.49 kB[22m
[34mℹ[39m [2mdist/[22mimport-DG80rC_I.mjs.map                                                  [2m112.07 kB[22m [2m│ gzip: 25.69 kB[22m
[34mℹ[39m [2mdist/[22mredirects-COMLwsV5.mjs.map                                               [2m 94.38 kB[22m [2m│ gzip: 15.77 kB[22m
[34mℹ[39m [2mdist/[22mmenus-BJHdFWhH.mjs                                                       [2m 85.50 kB[22m [2m│ gzip: 19.61 kB[22m
[34mℹ[39m [2mdist/[22mcontext-sAnCaUIR.mjs.map                                                 [2m 66.64 kB[22m [2m│ gzip: 15.80 kB[22m
[34mℹ[39m [2mdist/[22mcontent-C0ooIs-f.mjs.map                                                 [2m 62.23 kB[22m [2m│ gzip: 13.27 kB[22m
[34mℹ[39m [2mdist/[22mapply-7BGAk1OC.mjs.map                                                   [2m 60.88 kB[22m [2m│ gzip: 15.23 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/execute.mjs.map                        [2m 59.52 kB[22m [2m│ gzip: 17.62 kB[22m
[34mℹ[39m [2mdist/[22mregistry-DqrAQDXH.mjs.map                                                [2m 54.01 kB[22m [2m│ gzip: 13.04 kB[22m
[34mℹ[39m [2mdist/[22mmenus-Bjf5R1Qq.mjs.map                                                   [2m 50.90 kB[22m [2m│ gzip: 12.05 kB[22m
[34mℹ[39m [2mdist/[22mastro/middleware/request-context.mjs.map                                 [2m 49.16 kB[22m [2m│ gzip: 12.37 kB[22m
[34mℹ[39m [2mdist/[22mimport-DG80rC_I.mjs                                                      [2m 48.70 kB[22m [2m│ gzip: 11.84 kB[22m
[34mℹ[39m [2mdist/[22mquery-DSGjG7Qa.mjs.map                                                   [2m 48.27 kB[22m [2m│ gzip: 14.61 kB[22m
[34mℹ[39m [2mdist/[22mredirects-COMLwsV5.mjs                                                   [2m 46.92 kB[22m [2m│ gzip:  9.49 kB[22m
[34mℹ[39m [2mdist/[22mastro/middleware/auth.mjs.map                                            [2m 44.73 kB[22m [2m│ gzip: 12.39 kB[22m
[34mℹ[39m [2mdist/[22mloader-Chm5h7Gr.mjs.map                                                  [2m 40.46 kB[22m [2m│ gzip: 11.37 kB[22m
[34mℹ[39m [2mdist/[22mindex-D2-g1b1o.d.mts.map                                                 [2m 36.26 kB[22m [2m│ gzip: 10.02 kB[22m
[34mℹ[39m [2mdist/[22mtaxonomies-CZJfsjP8.mjs.map                                              [2m 34.53 kB[22m [2m│ gzip:  8.02 kB[22m
[34mℹ[39m [2mdist/[22mbyline-CTaWkMh5.mjs.map                                                  [2m 33.46 kB[22m [2m│ gzip:  8.89 kB[22m
[34mℹ[39m [2mdist/[22mclient/index.mjs.map                                                     [2m 32.97 kB[22m [2m│ gzip:  7.93 kB[22m
[34mℹ[39m [2mdist/[22mredirects-B-CUZ1Xh.mjs.map                                               [2m 32.59 kB[22m [2m│ gzip:  8.18 kB[22m
[34mℹ[39m [2mdist/[22mvalidate-mz87i8_1.mjs.map                                                [2m 32.16 kB[22m [2m│ gzip:  6.86 kB[22m
[34mℹ[39m [2mdist/[22mcontent-C0ooIs-f.mjs                                                     [2m 31.82 kB[22m [2m│ gzip:  7.33 kB[22m
[34mℹ[39m [2mdist/[22mpage/index.mjs.map                                                       [2m 31.02 kB[22m [2m│ gzip:  8.42 kB[22m
[34mℹ[39m [2mdist/[22mapply-7BGAk1OC.mjs                                                       [2m 30.10 kB[22m [2m│ gzip:  7.49 kB[22m
[34mℹ[39m [2mdist/[22mdevice-flow-B9oG8PwP.mjs.map                                             [2m 29.83 kB[22m [2m│ gzip:  7.18 kB[22m
[34mℹ[39m [2mdist/[22mcontext-sAnCaUIR.mjs                                                     [2m 28.49 kB[22m [2m│ gzip:  7.54 kB[22m
[34mℹ[39m [2mdist/[22mregistry-DqrAQDXH.mjs                                                    [2m 27.13 kB[22m [2m│ gzip:  6.93 kB[22m
[34mℹ[39m [2mdist/[22merror-CPh_8eLq.mjs.map                                                   [2m 27.02 kB[22m [2m│ gzip:  6.38 kB[22m
[34mℹ[39m [2mdist/[22msearch-By-NN3da.mjs.map                                                  [2m 26.55 kB[22m [2m│ gzip:  8.21 kB[22m
[34mℹ[39m [2mdist/[22mredirect-CNv4mHX2.mjs.map                                                [2m 26.36 kB[22m [2m│ gzip:  6.98 kB[22m
[34mℹ[39m [2mdist/[22mtransport-B6CHddbu.mjs.map                                               [2m 26.06 kB[22m [2m│ gzip:  7.48 kB[22m
[34mℹ[39m [2mdist/[22mtaxonomies-Cm_lrGRG.mjs.map                                              [2m 25.55 kB[22m [2m│ gzip:  6.21 kB[22m
[34mℹ[39m [2mdist/[22msecrets-rPdhEBkD.mjs.map                                                 [2m 24.92 kB[22m [2m│ gzip:  8.49 kB[22m
[34mℹ[39m [2mdist/[22mfts-manager-Mnrtn-r2.mjs.map                                             [2m 24.82 kB[22m [2m│ gzip:  6.62 kB[22m
[34mℹ[39m [2mdist/[22mssrf-MZ-zrG6-.mjs.map                                                    [2m 23.59 kB[22m [2m│ gzip:  8.30 kB[22m
[34mℹ[39m [2mdist/[22mquery-DSGjG7Qa.mjs                                                       [2m 23.36 kB[22m [2m│ gzip:  7.62 kB[22m
[34mℹ[39m [2mdist/[22mmenus-Bjf5R1Qq.mjs                                                       [2m 23.34 kB[22m [2m│ gzip:  5.93 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/authorize.mjs.map                                 [2m 22.43 kB[22m [2m│ gzip:  6.46 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/analyze.mjs.map                        [2m 22.30 kB[22m [2m│ gzip:  6.90 kB[22m
[34mℹ[39m [2mdist/[22mtaxonomy-D4Uc2LsZ.mjs.map                                                [2m 21.42 kB[22m [2m│ gzip:  5.59 kB[22m
[34mℹ[39m [2mdist/[22mcomment-_yzlBYPx.mjs.map                                                 [2m 20.47 kB[22m [2m│ gzip:  4.87 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/snapshot.mjs.map                                        [2m 19.86 kB[22m [2m│ gzip:  6.75 kB[22m
[34mℹ[39m [2mdist/[22mloader-Chm5h7Gr.mjs                                                      [2m 19.56 kB[22m [2m│ gzip:  5.83 kB[22m
[34mℹ[39m [2mdist/[22msections-DcBIlOq1.mjs.map                                                [2m 19.39 kB[22m [2m│ gzip:  4.78 kB[22m
[34mℹ[39m [2mdist/[22mzod-generator-dvxgmd1M.mjs.map                                           [2m 18.45 kB[22m [2m│ gzip:  5.43 kB[22m
[34mℹ[39m [2mdist/[22moauth-authorization-CTMeVfvj.mjs.map                                     [2m 17.99 kB[22m [2m│ gzip:  4.89 kB[22m
[34mℹ[39m [2mdist/[22mbyline-CTaWkMh5.mjs                                                      [2m 17.77 kB[22m [2m│ gzip:  5.05 kB[22m
[34mℹ[39m [2mdist/[22merror-CPh_8eLq.mjs                                                       [2m 17.13 kB[22m [2m│ gzip:  4.18 kB[22m
[34mℹ[39m [2mdist/[22mutils-C3wTAP-P.mjs.map                                                   [2m 16.93 kB[22m [2m│ gzip:  5.01 kB[22m
[34mℹ[39m [2mdist/[22mtypes-DGHWRQgr.d.mts.map                                                 [2m 16.93 kB[22m [2m│ gzip:  4.65 kB[22m
[34mℹ[39m [2mdist/[22mcron-Bd3b3iuj.mjs.map                                                    [2m 16.65 kB[22m [2m│ gzip:  5.39 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/execute.mjs.map                 [2m 16.41 kB[22m [2m│ gzip:  5.34 kB[22m
[34mℹ[39m [2mdist/[22mredirects-B-CUZ1Xh.mjs                                                   [2m 16.07 kB[22m [2m│ gzip:  4.26 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/comments/_collection_/_contentId_/index.mjs.map         [2m 15.95 kB[22m [2m│ gzip:  4.89 kB[22m
[34mℹ[39m [2mdist/[22mmedia-oqRcNiQf.mjs.map                                                   [2m 15.91 kB[22m [2m│ gzip:  4.75 kB[22m
[34mℹ[39m [2mdist/[22msettings-hcubRfkr.mjs.map                                                [2m 15.73 kB[22m [2m│ gzip:  5.04 kB[22m
[34mℹ[39m [2mdist/[22mvalidate-mz87i8_1.mjs                                                    [2m 15.70 kB[22m [2m│ gzip:  3.51 kB[22m
[34mℹ[39m [2mdist/[22mtaxonomies-CZJfsjP8.mjs                                                  [2m 15.58 kB[22m [2m│ gzip:  3.76 kB[22m
[34mℹ[39m [2mdist/[22moauth-clients-eJCbkVSG.mjs.map                                           [2m 15.58 kB[22m [2m│ gzip:  3.61 kB[22m
[34mℹ[39m [2mdist/[22mstorage/s3.mjs.map                                                       [2m 15.38 kB[22m [2m│ gzip:  5.03 kB[22m
[34mℹ[39m [2mdist/[22mtaxonomies-Cm_lrGRG.mjs                                                  [2m 14.94 kB[22m [2m│ gzip:  3.84 kB[22m
[34mℹ[39m [2mdist/[22mdevice-flow-B9oG8PwP.mjs                                                 [2m 14.86 kB[22m [2m│ gzip:  3.83 kB[22m
[34mℹ[39m [2mdist/[22mplugins/adapt-sandbox-entry.mjs.map                                      [2m 14.69 kB[22m [2m│ gzip:  5.13 kB[22m
[34mℹ[39m [2mdist/[22mservice-BuuTdGAT.mjs.map                                                 [2m 14.62 kB[22m [2m│ gzip:  4.38 kB[22m
[34mℹ[39m [2mdist/[22mbylines-DJBgjPbo.mjs.map                                                 [2m 14.10 kB[22m [2m│ gzip:  4.74 kB[22m
[34mℹ[39m [2mdist/[22mfts-manager-Mnrtn-r2.mjs                                                 [2m 13.79 kB[22m [2m│ gzip:  3.92 kB[22m
[34mℹ[39m [2mdist/[22msecrets-rPdhEBkD.mjs                                                     [2m 13.77 kB[22m [2m│ gzip:  5.15 kB[22m
[34mℹ[39m [2mdist/[22mcomments-DxID-rsd.mjs.map                                                [2m 13.34 kB[22m [2m│ gzip:  3.37 kB[22m
[34mℹ[39m [2mdist/[22msearch-By-NN3da.mjs                                                      [2m 13.23 kB[22m [2m│ gzip:  4.32 kB[22m
[34mℹ[39m [2mdist/[22mssrf-MZ-zrG6-.mjs                                                        [2m 12.75 kB[22m [2m│ gzip:  5.03 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/media.mjs.map                          [2m 12.71 kB[22m [2m│ gzip:  3.84 kB[22m
[34mℹ[39m [2mdist/[22mmanifest-schema-Czqf0TLu.mjs.map                                         [2m 12.21 kB[22m [2m│ gzip:  3.36 kB[22m
[34mℹ[39m [2mdist/[22mredirect-CNv4mHX2.mjs                                                    [2m 12.07 kB[22m [2m│ gzip:  3.71 kB[22m
[34mℹ[39m [2mdist/[22mtransport-B6CHddbu.mjs                                                   [2m 12.05 kB[22m [2m│ gzip:  3.86 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/oauth/_provider_/callback.mjs.map                  [2m 11.29 kB[22m [2m│ gzip:  3.77 kB[22m
[34mℹ[39m [2mdist/[22mstorage/local.mjs.map                                                    [2m 11.26 kB[22m [2m│ gzip:  3.76 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/rewrite-urls.mjs.map                   [2m 11.19 kB[22m [2m│ gzip:  3.58 kB[22m
[34mℹ[39m [2mdist/[22mvalidation-DKHhXjPr.mjs.map                                              [2m 11.09 kB[22m [2m│ gzip:  4.18 kB[22m
[34mℹ[39m [2mdist/[22mtaxonomy-D4Uc2LsZ.mjs                                                    [2m 10.92 kB[22m [2m│ gzip:  3.06 kB[22m
[34mℹ[39m [2mdist/[22muser-D3BD5zdT.mjs.map                                                    [2m 10.46 kB[22m [2m│ gzip:  3.27 kB[22m
[34mℹ[39m [2mdist/[22mtokens-N8otWMmj.mjs.map                                                  [2m 10.30 kB[22m [2m│ gzip:  3.28 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media.mjs.map                                           [2m 10.28 kB[22m [2m│ gzip:  3.57 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/sitemap-_collection_.xml.mjs.map                            [2m 10.23 kB[22m [2m│ gzip:  3.64 kB[22m
[34mℹ[39m [2mdist/[22msetup-Cf_TyOv5.mjs.map                                                   [2m 10.10 kB[22m [2m│ gzip:  1.99 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/token.mjs.map                                     [2m 10.07 kB[22m [2m│ gzip:  3.04 kB[22m
[34mℹ[39m [2mdist/[22mnormalize-CN5kRSMC.mjs.map                                               [2m 10.06 kB[22m [2m│ gzip:  3.02 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_.mjs.map                       [2m 10.05 kB[22m [2m│ gzip:  2.71 kB[22m
[34mℹ[39m [2mdist/[22msections-DcBIlOq1.mjs                                                    [2m  9.34 kB[22m [2m│ gzip:  2.47 kB[22m
[34mℹ[39m [2mdist/[22mseo-bjDoq9Eg.mjs.map                                                     [2m  9.19 kB[22m [2m│ gzip:  3.06 kB[22m
[34mℹ[39m [2mdist/[22mcomment-_yzlBYPx.mjs                                                     [2m  9.18 kB[22m [2m│ gzip:  2.50 kB[22m
[34mℹ[39m [2mdist/[22mresolve-CNCNJ3Sy.mjs.map                                                 [2m  9.12 kB[22m [2m│ gzip:  3.20 kB[22m
[34mℹ[39m [2mdist/[22mcron-Bd3b3iuj.mjs                                                        [2m  8.95 kB[22m [2m│ gzip:  3.19 kB[22m
[34mℹ[39m [2mdist/[22mpatterns-CqG5Ya3i.mjs.map                                                [2m  8.92 kB[22m [2m│ gzip:  3.02 kB[22m
[34mℹ[39m [2mdist/[22mclient/cf-access.mjs.map                                                 [2m  8.87 kB[22m [2m│ gzip:  3.14 kB[22m
[34mℹ[39m [2mdist/[22mmedia/index.mjs.map                                                      [2m  8.84 kB[22m [2m│ gzip:  2.92 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/prepare.mjs.map                        [2m  8.65 kB[22m [2m│ gzip:  3.13 kB[22m
[34mℹ[39m [2mdist/[22moauth-authorization-CTMeVfvj.mjs                                         [2m  8.64 kB[22m [2m│ gzip:  2.58 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/dev-bypass.mjs.map                                [2m  8.60 kB[22m [2m│ gzip:  3.24 kB[22m
[34mℹ[39m [2mdist/[22mapi-tokens-ucpcNXDt.mjs.map                                              [2m  8.50 kB[22m [2m│ gzip:  2.44 kB[22m
[34mℹ[39m [2mdist/[22mmedia/local-runtime.mjs.map                                              [2m  8.45 kB[22m [2m│ gzip:  2.58 kB[22m
[34mℹ[39m [2mdist/[22mbylines-Be4yT0xl.d.mts.map                                               [2m  8.45 kB[22m [2m│ gzip:  1.47 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/register.mjs.map                                  [2m  8.19 kB[22m [2m│ gzip:  2.94 kB[22m
[34mℹ[39m [2mdist/[22mallowed-origins-D0fFk9a6.mjs.map                                         [2m  8.19 kB[22m [2m│ gzip:  3.02 kB[22m
[34mℹ[39m [2mdist/[22mrequest-meta-C_Cjii-T.mjs.map                                            [2m  8.19 kB[22m [2m│ gzip:  3.14 kB[22m
[34mℹ[39m [2mdist/[22mutils-C3wTAP-P.mjs                                                       [2m  8.16 kB[22m [2m│ gzip:  2.90 kB[22m
[34mℹ[39m [2mdist/[22mzod-generator-dvxgmd1M.mjs                                               [2m  8.10 kB[22m [2m│ gzip:  2.42 kB[22m
[34mℹ[39m [2mdist/[22mrate-limit-D_-gAeJ0.mjs.map                                              [2m  8.07 kB[22m [2m│ gzip:  3.40 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/rewrite-url-helpers.mjs.map            [2m  8.07 kB[22m [2m│ gzip:  2.68 kB[22m
[34mℹ[39m [2mdist/[22mtypes-DSZl1Dsv.mjs.map                                                   [2m  7.98 kB[22m [2m│ gzip:  2.22 kB[22m
[34mℹ[39m [2mdist/[22mplaceholder-LqmHqvBw.mjs.map                                             [2m  7.97 kB[22m [2m│ gzip:  2.92 kB[22m
[34mℹ[39m [2mdist/[22msettings-hcubRfkr.mjs                                                    [2m  7.86 kB[22m [2m│ gzip:  2.65 kB[22m
[34mℹ[39m [2mdist/[22mdashboard-Cqw3ay2X.mjs.map                                               [2m  7.78 kB[22m [2m│ gzip:  2.88 kB[22m
[34mℹ[39m [2mdist/[22moptions-BL4X94qY.mjs.map                                                 [2m  7.78 kB[22m [2m│ gzip:  2.31 kB[22m
[34mℹ[39m [2mdist/[22mdialect-helpers-BKCvISIQ.mjs.map                                         [2m  7.72 kB[22m [2m│ gzip:  2.08 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/index.mjs.map                          [2m  7.59 kB[22m [2m│ gzip:  2.39 kB[22m
[34mℹ[39m [2mdist/[22moauth-clients-eJCbkVSG.mjs                                               [2m  7.56 kB[22m [2m│ gzip:  1.83 kB[22m
[34mℹ[39m [2mdist/[22mtypes-ByV5sgsv.mjs.map                                                   [2m  7.35 kB[22m [2m│ gzip:  2.77 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs.map      [2m  7.35 kB[22m [2m│ gzip:  2.38 kB[22m
[34mℹ[39m [2mdist/[22mmedia-oqRcNiQf.mjs                                                       [2m  7.22 kB[22m [2m│ gzip:  2.43 kB[22m
[34mℹ[39m [2mdist/[22mseo/index.mjs.map                                                        [2m  7.10 kB[22m [2m│ gzip:  2.58 kB[22m
[34mℹ[39m [2mdist/[22mbylines-H0Xh5TMy.mjs.map                                                 [2m  7.04 kB[22m [2m│ gzip:  2.56 kB[22m
[34mℹ[39m [2mdist/[22mmanifest-schema-Czqf0TLu.mjs                                             [2m  6.66 kB[22m [2m│ gzip:  2.24 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/widgets/_id_.mjs.map                [2m  6.52 kB[22m [2m│ gzip:  1.77 kB[22m
[34mℹ[39m [2mdist/[22mseo-Dq707mNQ.mjs.map                                                     [2m  6.47 kB[22m [2m│ gzip:  2.62 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/settings/email.mjs.map                                  [2m  6.47 kB[22m [2m│ gzip:  2.40 kB[22m
[34mℹ[39m [2mdist/[22mwidgets-lShIQXU5.mjs.map                                                 [2m  6.46 kB[22m [2m│ gzip:  2.29 kB[22m
[34mℹ[39m [2mdist/[22mbylines-DJBgjPbo.mjs                                                     [2m  6.39 kB[22m [2m│ gzip:  2.45 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/admin-verify.mjs.map                              [2m  6.33 kB[22m [2m│ gzip:  2.31 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/_id_.mjs.map                                      [2m  6.28 kB[22m [2m│ gzip:  1.75 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/upload-url.mjs.map                                [2m  6.24 kB[22m [2m│ gzip:  2.44 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/admin.mjs.map                                     [2m  6.21 kB[22m [2m│ gzip:  2.51 kB[22m
[34mℹ[39m [2mdist/[22mservice-BuuTdGAT.mjs                                                     [2m  6.21 kB[22m [2m│ gzip:  2.19 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/index.mjs.map                                     [2m  6.16 kB[22m [2m│ gzip:  2.40 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/plugins/_pluginId_/_...path_.mjs.map                    [2m  6.16 kB[22m [2m│ gzip:  2.52 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/oauth/_provider_.mjs.map                           [2m  6.14 kB[22m [2m│ gzip:  2.26 kB[22m
[34mℹ[39m [2mdist/[22mpublic-url-CUWWFME2.mjs.map                                              [2m  5.92 kB[22m [2m│ gzip:  2.40 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/register/verify.mjs.map                    [2m  5.90 kB[22m [2m│ gzip:  2.22 kB[22m
[34mℹ[39m [2mdist/[22mvalidate-VPnKoIzW.mjs.map                                                [2m  5.90 kB[22m [2m│ gzip:  1.70 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/preview-url.mjs.map           [2m  5.90 kB[22m [2m│ gzip:  2.39 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/_id_/status.mjs.map                      [2m  5.69 kB[22m [2m│ gzip:  2.00 kB[22m
[34mℹ[39m [2mdist/[22mresolve-CNCNJ3Sy.mjs                                                     [2m  5.63 kB[22m [2m│ gzip:  2.12 kB[22m
[34mℹ[39m [2mdist/[22mvalidation-DKHhXjPr.mjs                                                  [2m  5.61 kB[22m [2m│ gzip:  2.26 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/dev-bypass.mjs.map                                 [2m  5.58 kB[22m [2m│ gzip:  2.30 kB[22m
[34mℹ[39m [2mdist/[22mtypes-DaqNzqVt.d.mts.map                                                 [2m  5.58 kB[22m [2m│ gzip:  0.93 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/schedule.mjs.map              [2m  5.56 kB[22m [2m│ gzip:  1.63 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/providers/_providerId_/index.mjs.map              [2m  5.54 kB[22m [2m│ gzip:  1.81 kB[22m
[34mℹ[39m [2mdist/[22mastro/middleware/redirect.mjs.map                                        [2m  5.50 kB[22m [2m│ gzip:  2.23 kB[22m
[34mℹ[39m [2mdist/[22mcomments-DxID-rsd.mjs                                                    [2m  5.49 kB[22m [2m│ gzip:  1.74 kB[22m
[34mℹ[39m [2mdist/[22mpreview-D4z0WONU.mjs.map                                                 [2m  5.44 kB[22m [2m│ gzip:  1.93 kB[22m
[34mℹ[39m [2mdist/[22mparse-3-caTKgt.mjs.map                                                   [2m  5.35 kB[22m [2m│ gzip:  1.95 kB[22m
[34mℹ[39m [2mdist/[22mallowed-origins-D0fFk9a6.mjs                                             [2m  5.31 kB[22m [2m│ gzip:  2.06 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/install.mjs.map                  [2m  5.28 kB[22m [2m│ gzip:  2.30 kB[22m
[34mℹ[39m [2mdist/[22msetup-Cf_TyOv5.mjs                                                       [2m  5.27 kB[22m [2m│ gzip:  1.31 kB[22m
[34mℹ[39m [2mdist/[22mtypes-Cd9UCu3t.mjs.map                                                   [2m  5.27 kB[22m [2m│ gzip:  1.85 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/bylines/_id_/translations.mjs.map                 [2m  5.21 kB[22m [2m│ gzip:  1.88 kB[22m
[34mℹ[39m [2mdist/[22mrequest-cache-dzCt8TZB.mjs.map                                           [2m  5.19 kB[22m [2m│ gzip:  2.07 kB[22m
[34mℹ[39m [2mdist/[22mseo-bjDoq9Eg.mjs                                                         [2m  5.12 kB[22m [2m│ gzip:  1.82 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/status.mjs.map                                    [2m  5.09 kB[22m [2m│ gzip:  1.96 kB[22m
[34mℹ[39m [2mdist/[22mpatterns-CqG5Ya3i.mjs                                                    [2m  5.05 kB[22m [2m│ gzip:  1.85 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/index.mjs.map                      [2m  4.98 kB[22m [2m│ gzip:  1.84 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/_slug_/translations.mjs.map     [2m  4.98 kB[22m [2m│ gzip:  1.50 kB[22m
[34mℹ[39m [2mdist/[22mclient/index.d.mts.map                                                   [2m  4.96 kB[22m [2m│ gzip:  1.42 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/_id_.mjs.map                               [2m  4.95 kB[22m [2m│ gzip:  1.56 kB[22m
[34mℹ[39m [2mdist/[22mtokens-N8otWMmj.mjs                                                      [2m  4.94 kB[22m [2m│ gzip:  1.73 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/_slug_.mjs.map                  [2m  4.92 kB[22m [2m│ gzip:  1.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/typegen.mjs.map                                         [2m  4.90 kB[22m [2m│ gzip:  1.79 kB[22m
[34mℹ[39m [2mdist/[22mrequest-context.mjs.map                                                  [2m  4.88 kB[22m [2m│ gzip:  2.14 kB[22m
[34mℹ[39m [2mdist/[22mnormalize-CN5kRSMC.mjs                                                   [2m  4.86 kB[22m [2m│ gzip:  1.48 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/allowed-domains/_domain_.mjs.map                  [2m  4.84 kB[22m [2m│ gzip:  1.49 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/oauth-clients/_id_.mjs.map                        [2m  4.75 kB[22m [2m│ gzip:  1.34 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/analyze.mjs.map                 [2m  4.74 kB[22m [2m│ gzip:  1.92 kB[22m
[34mℹ[39m [2mdist/[22muser-D3BD5zdT.mjs                                                        [2m  4.74 kB[22m [2m│ gzip:  1.69 kB[22m
[34mℹ[39m [2mdist/[22mdatabase/instrumentation.mjs.map                                         [2m  4.63 kB[22m [2m│ gzip:  2.02 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/publish.mjs.map               [2m  4.63 kB[22m [2m│ gzip:  1.84 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/allowed-domains/index.mjs.map                     [2m  4.61 kB[22m [2m│ gzip:  1.60 kB[22m
[34mℹ[39m [2mdist/[22mrequest-meta-C_Cjii-T.mjs                                                [2m  4.58 kB[22m [2m│ gzip:  1.93 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/index.mjs.map                                    [2m  4.52 kB[22m [2m│ gzip:  1.76 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/translations.mjs.map                       [2m  4.49 kB[22m [2m│ gzip:  1.48 kB[22m
[34mℹ[39m [2mdist/[22mplugin-utils.mjs.map                                                     [2m  4.46 kB[22m [2m│ gzip:  1.89 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/signup/request.mjs.map                             [2m  4.45 kB[22m [2m│ gzip:  1.92 kB[22m
[34mℹ[39m [2mdist/[22mrate-limit-D_-gAeJ0.mjs                                                  [2m  4.43 kB[22m [2m│ gzip:  2.07 kB[22m
[34mℹ[39m [2mdist/[22mtrusted-proxy-97pajC2f.mjs.map                                           [2m  4.43 kB[22m [2m│ gzip:  1.96 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/magic-link/send.mjs.map                            [2m  4.40 kB[22m [2m│ gzip:  1.78 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/index.mjs.map                              [2m  4.39 kB[22m [2m│ gzip:  1.57 kB[22m
[34mℹ[39m [2mdist/[22mplaceholder-LqmHqvBw.mjs                                                 [2m  4.39 kB[22m [2m│ gzip:  1.77 kB[22m
[34mℹ[39m [2mdist/[22mvalidate-VPnKoIzW.mjs                                                    [2m  4.35 kB[22m [2m│ gzip:  1.32 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/signup/complete.mjs.map                            [2m  4.33 kB[22m [2m│ gzip:  1.74 kB[22m
[34mℹ[39m [2mdist/[22mastro/types.d.mts.map                                                    [2m  4.32 kB[22m [2m│ gzip:  1.20 kB[22m
[34mℹ[39m [2mdist/[22mbase64-CqR-7kqF.mjs.map                                                  [2m  4.31 kB[22m [2m│ gzip:  1.41 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/options.mjs.map                            [2m  4.30 kB[22m [2m│ gzip:  1.76 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/bylines/_id_/index.mjs.map                        [2m  4.30 kB[22m [2m│ gzip:  1.24 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/_id_/confirm.mjs.map                              [2m  4.30 kB[22m [2m│ gzip:  1.76 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/complete.mjs.map                            [2m  4.29 kB[22m [2m│ gzip:  1.72 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/themes/preview.mjs.map                                  [2m  4.25 kB[22m [2m│ gzip:  1.80 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/index.mjs.map                               [2m  4.23 kB[22m [2m│ gzip:  1.83 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/hooks/exclusive/_hookName_.mjs.map                [2m  4.20 kB[22m [2m│ gzip:  1.71 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/register/options.mjs.map                   [2m  4.18 kB[22m [2m│ gzip:  1.69 kB[22m
[34mℹ[39m [2mdist/[22moauth-state-store-vOSdOeGe.mjs.map                                       [2m  4.17 kB[22m [2m│ gzip:  1.51 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/redirects/_id_.mjs.map                                  [2m  4.17 kB[22m [2m│ gzip:  1.10 kB[22m
[34mℹ[39m [2mdist/[22mconnection-2igzM-AT.mjs.map                                              [2m  4.14 kB[22m [2m│ gzip:  1.79 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/register-options.mjs.map                    [2m  4.09 kB[22m [2m│ gzip:  1.75 kB[22m
[34mℹ[39m [2mdist/[22mastro/middleware/setup.mjs.map                                           [2m  4.08 kB[22m [2m│ gzip:  1.67 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/sitemap.xml.mjs.map                                         [2m  4.05 kB[22m [2m│ gzip:  1.66 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/manifest.mjs.map                                        [2m  4.04 kB[22m [2m│ gzip:  1.84 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/bylines/index.mjs.map                             [2m  4.03 kB[22m [2m│ gzip:  1.46 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/sections/_slug_.mjs.map                                 [2m  3.99 kB[22m [2m│ gzip:  1.04 kB[22m
[34mℹ[39m [2mdist/[22mapi-tokens-ucpcNXDt.mjs                                                  [2m  3.95 kB[22m [2m│ gzip:  1.26 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/providers/_providerId_/_itemId_.mjs.map           [2m  3.95 kB[22m [2m│ gzip:  1.20 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_.mjs.map                             [2m  3.86 kB[22m [2m│ gzip:  1.25 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/index.mjs.map                 [2m  3.83 kB[22m [2m│ gzip:  1.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/_id_/update.mjs.map              [2m  3.83 kB[22m [2m│ gzip:  1.62 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_.mjs.map                                    [2m  3.79 kB[22m [2m│ gzip:  1.00 kB[22m
[34mℹ[39m [2mdist/[22mdb/index.mjs.map                                                         [2m  3.77 kB[22m [2m│ gzip:  1.42 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/widgets.mjs.map                     [2m  3.74 kB[22m [2m│ gzip:  1.48 kB[22m
[34mℹ[39m [2mdist/[22moptions-BL4X94qY.mjs                                                     [2m  3.69 kB[22m [2m│ gzip:  1.26 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/redirects/404s/index.mjs.map                            [2m  3.64 kB[22m [2m│ gzip:  1.07 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/duplicate.mjs.map             [2m  3.62 kB[22m [2m│ gzip:  1.48 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs.map    [2m  3.60 kB[22m [2m│ gzip:  1.01 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/updates.mjs.map                           [2m  3.56 kB[22m [2m│ gzip:  1.51 kB[22m
[34mℹ[39m [2mdist/[22mcache-CNk1jIxp.mjs.map                                                   [2m  3.54 kB[22m [2m│ gzip:  1.45 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/verify.mjs.map                             [2m  3.54 kB[22m [2m│ gzip:  1.42 kB[22m
[34mℹ[39m [2mdist/[22mdashboard-Cqw3ay2X.mjs                                                   [2m  3.54 kB[22m [2m│ gzip:  1.51 kB[22m
[34mℹ[39m [2mdist/[22mmime-KV5TqkMN.mjs.map                                                    [2m  3.52 kB[22m [2m│ gzip:  1.48 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/device/token.mjs.map                              [2m  3.50 kB[22m [2m│ gzip:  1.56 kB[22m
[34mℹ[39m [2mdist/[22mcomponents-Dx3DM0gg.mjs.map                                              [2m  3.46 kB[22m [2m│ gzip:  0.99 kB[22m
[34mℹ[39m [2mdist/[22mchallenge-store-Dng1SxKT.mjs.map                                         [2m  3.43 kB[22m [2m│ gzip:  1.34 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/disable.mjs.map                        [2m  3.43 kB[22m [2m│ gzip:  1.49 kB[22m
[34mℹ[39m [2mdist/[22mpublic-url-CUWWFME2.mjs                                                  [2m  3.37 kB[22m [2m│ gzip:  1.50 kB[22m
[34mℹ[39m [2mdist/[22mbylines-H0Xh5TMy.mjs                                                     [2m  3.36 kB[22m [2m│ gzip:  1.27 kB[22m
[34mℹ[39m [2mdist/[22mtypes-bYmRn_Uy.d.mts.map                                                 [2m  3.35 kB[22m [2m│ gzip:  1.20 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/items/_id_.mjs.map                         [2m  3.34 kB[22m [2m│ gzip:  1.04 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/index.mjs.map                   [2m  3.33 kB[22m [2m│ gzip:  1.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/file/_...key_.mjs.map                             [2m  3.33 kB[22m [2m│ gzip:  1.52 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/oauth-clients/index.mjs.map                       [2m  3.32 kB[22m [2m│ gzip:  1.25 kB[22m
[34mℹ[39m [2mdist/[22mdialect-helpers-BKCvISIQ.mjs                                             [2m  3.31 kB[22m [2m│ gzip:  1.12 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/robots.txt.mjs.map                                          [2m  3.28 kB[22m [2m│ gzip:  1.34 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/send-recovery.mjs.map                  [2m  3.27 kB[22m [2m│ gzip:  1.44 kB[22m
[34mℹ[39m [2mdist/[22mwidgets-lShIQXU5.mjs                                                     [2m  3.27 kB[22m [2m│ gzip:  1.22 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/restore.mjs.map               [2m  3.25 kB[22m [2m│ gzip:  1.34 kB[22m
[34mℹ[39m [2mdist/[22memail-console-CubRll9q.mjs.map                                           [2m  3.23 kB[22m [2m│ gzip:  1.54 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/magic-link/verify.mjs.map                          [2m  3.18 kB[22m [2m│ gzip:  1.34 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/discard-draft.mjs.map         [2m  3.18 kB[22m [2m│ gzip:  1.31 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/reorder.mjs.map                     [2m  3.16 kB[22m [2m│ gzip:  1.32 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/api-tokens/index.mjs.map                          [2m  3.11 kB[22m [2m│ gzip:  1.21 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/unpublish.mjs.map             [2m  3.11 kB[22m [2m│ gzip:  1.27 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/_id_/install.mjs.map          [2m  3.10 kB[22m [2m│ gzip:  1.31 kB[22m
[34mℹ[39m [2mdist/[22mmode-CaaiebZI.mjs.map                                                    [2m  3.04 kB[22m [2m│ gzip:  1.13 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/search/rebuild.mjs.map                                  [2m  3.02 kB[22m [2m│ gzip:  1.23 kB[22m
[34mℹ[39m [2mdist/[22mvalidate-DQtHw9NT.d.mts.map                                              [2m  3.01 kB[22m [2m│ gzip:  0.94 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs.map         [2m  2.97 kB[22m [2m│ gzip:  1.31 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/revisions/_revisionId_/restore.mjs.map                  [2m  2.94 kB[22m [2m│ gzip:  1.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/_id_/icon.mjs.map             [2m  2.94 kB[22m [2m│ gzip:  1.30 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/index.mjs.map                               [2m  2.94 kB[22m [2m│ gzip:  1.30 kB[22m
[34mℹ[39m [2mdist/[22mruntime.mjs.map                                                          [2m  2.91 kB[22m [2m│ gzip:  1.25 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/settings.mjs.map                                        [2m  2.89 kB[22m [2m│ gzip:  1.06 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/index.mjs.map                                [2m  2.89 kB[22m [2m│ gzip:  1.02 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/redirects/index.mjs.map                                 [2m  2.86 kB[22m [2m│ gzip:  1.00 kB[22m
[34mℹ[39m [2mdist/[22mpreview-D4z0WONU.mjs                                                     [2m  2.85 kB[22m [2m│ gzip:  1.03 kB[22m
[34mℹ[39m [2mdist/[22mparse-3-caTKgt.mjs                                                       [2m  2.83 kB[22m [2m│ gzip:  1.15 kB[22m
[34mℹ[39m [2mdist/[22mdefault-BvTAYCzx.mjs.map                                                 [2m  2.82 kB[22m [2m│ gzip:  0.81 kB[22m
[34mℹ[39m [2mdist/[22mpasskey-config-BloQOT3y.mjs.map                                          [2m  2.81 kB[22m [2m│ gzip:  1.25 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/search/index.mjs.map                                    [2m  2.78 kB[22m [2m│ gzip:  1.33 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/well-known/auth.mjs.map                                 [2m  2.75 kB[22m [2m│ gzip:  1.22 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/device/code.mjs.map                               [2m  2.74 kB[22m [2m│ gzip:  1.27 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/sections/index.mjs.map                                  [2m  2.71 kB[22m [2m│ gzip:  0.96 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/update.mjs.map                       [2m  2.71 kB[22m [2m│ gzip:  1.12 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/translations.mjs.map          [2m  2.70 kB[22m [2m│ gzip:  1.28 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/_id_.mjs.map                             [2m  2.68 kB[22m [2m│ gzip:  0.92 kB[22m
[34mℹ[39m [2mdist/[22mrequest-cache-dzCt8TZB.mjs                                               [2m  2.67 kB[22m [2m│ gzip:  1.19 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/search/enable.mjs.map                                   [2m  2.65 kB[22m [2m│ gzip:  1.12 kB[22m
[34mℹ[39m [2mdist/[22mtypes-ByV5sgsv.mjs                                                       [2m  2.64 kB[22m [2m│ gzip:  1.19 kB[22m
[34mℹ[39m [2mdist/[22mseo-Dq707mNQ.mjs                                                         [2m  2.59 kB[22m [2m│ gzip:  1.21 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/callback.mjs.map                [2m  2.55 kB[22m [2m│ gzip:  1.19 kB[22m
[34mℹ[39m [2mdist/[22mplaceholder-KCkkCtgQ.d.mts.map                                           [2m  2.50 kB[22m [2m│ gzip:  0.92 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/index.mjs.map                                     [2m  2.48 kB[22m [2m│ gzip:  0.97 kB[22m
[34mℹ[39m [2mdist/[22mconfig-CVssduLe.mjs.map                                                  [2m  2.48 kB[22m [2m│ gzip:  1.09 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/themes/marketplace/index.mjs.map                  [2m  2.44 kB[22m [2m│ gzip:  1.06 kB[22m
[34mℹ[39m [2mdist/[22mschema-Djdlfi5G.mjs.map                                                  [2m  2.44 kB[22m [2m│ gzip:  1.04 kB[22m
[34mℹ[39m [2mdist/[22mbase64-CqR-7kqF.mjs                                                      [2m  2.44 kB[22m [2m│ gzip:  0.92 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/index.mjs.map                        [2m  2.42 kB[22m [2m│ gzip:  0.89 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/index.mjs.map          [2m  2.41 kB[22m [2m│ gzip:  0.83 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/me.mjs.map                                         [2m  2.40 kB[22m [2m│ gzip:  1.02 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/_id_/uninstall.mjs.map           [2m  2.39 kB[22m [2m│ gzip:  1.08 kB[22m
[34mℹ[39m [2mdist/[22mconnection-2igzM-AT.mjs                                                  [2m  2.38 kB[22m [2m│ gzip:  1.06 kB[22m
[34mℹ[39m [2mdist/[22mindex-CC42STEm.d.mts.map                                                 [2m  2.36 kB[22m [2m│ gzip:  0.79 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/hooks/exclusive/index.mjs.map                     [2m  2.33 kB[22m [2m│ gzip:  1.11 kB[22m
[34mℹ[39m [2mdist/[22mtransaction-NQj4VJ7Z.mjs.map                                             [2m  2.32 kB[22m [2m│ gzip:  1.10 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/signup/verify.mjs.map                              [2m  2.29 kB[22m [2m│ gzip:  1.13 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/enable.mjs.map                       [2m  2.28 kB[22m [2m│ gzip:  1.05 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/mode.mjs.map                                       [2m  2.27 kB[22m [2m│ gzip:  1.13 kB[22m
[34mℹ[39m [2mdist/[22mdb-errors-CGN9kJfo.mjs.map                                               [2m  2.24 kB[22m [2m│ gzip:  1.03 kB[22m
[34mℹ[39m [2mdist/[22mauthorize-Bkwe8kuL.mjs.map                                               [2m  2.24 kB[22m [2m│ gzip:  0.85 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/accept.mjs.map                              [2m  2.22 kB[22m [2m│ gzip:  1.09 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/well-known/oauth-authorization-server.mjs.map           [2m  2.21 kB[22m [2m│ gzip:  0.97 kB[22m
[34mℹ[39m [2mdist/[22moptions-DhV-gwJb.d.mts.map                                               [2m  2.19 kB[22m [2m│ gzip:  0.83 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/search/suggest.mjs.map                                  [2m  2.19 kB[22m [2m│ gzip:  1.06 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/uninstall.mjs.map                    [2m  2.18 kB[22m [2m│ gzip:  0.98 kB[22m
[34mℹ[39m [2mdist/[22mhash-DlUxGhQS.mjs.map                                                    [2m  2.18 kB[22m [2m│ gzip:  1.05 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/index.mjs.map                              [2m  2.11 kB[22m [2m│ gzip:  1.03 kB[22m
[34mℹ[39m [2mdist/[22msetup-complete-MzzN9u0b.mjs.map                                          [2m  2.08 kB[22m [2m│ gzip:  0.91 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/device/authorize.mjs.map                          [2m  2.06 kB[22m [2m│ gzip:  1.00 kB[22m
[34mℹ[39m [2mdist/[22mslugify-Cjh1ssOZ.mjs.map                                                 [2m  2.04 kB[22m [2m│ gzip:  1.01 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/index.mjs.map                            [2m  2.01 kB[22m [2m│ gzip:  0.90 kB[22m
[34mℹ[39m [2mdist/[22mtrusted-proxy-97pajC2f.mjs                                               [2m  1.99 kB[22m [2m│ gzip:  0.97 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/enable.mjs.map                         [2m  1.99 kB[22m [2m│ gzip:  0.94 kB[22m
[34mℹ[39m [2mdist/[22mcomponents-Dx3DM0gg.mjs                                                  [2m  1.99 kB[22m [2m│ gzip:  0.71 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/bulk.mjs.map                             [2m  1.98 kB[22m [2m│ gzip:  0.88 kB[22m
[34mℹ[39m [2mdist/[22mcache-CNk1jIxp.mjs                                                       [2m  1.97 kB[22m [2m│ gzip:  0.80 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/index.mjs.map                 [2m  1.91 kB[22m [2m│ gzip:  0.86 kB[22m
[34mℹ[39m [2mdist/[22msettings-CJnKiWuR.mjs.map                                                [2m  1.91 kB[22m [2m│ gzip:  0.71 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/reorder.mjs.map                            [2m  1.88 kB[22m [2m│ gzip:  0.86 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/items.mjs.map                              [2m  1.87 kB[22m [2m│ gzip:  0.86 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/probe.mjs.map                                    [2m  1.84 kB[22m [2m│ gzip:  0.87 kB[22m
[34mℹ[39m [2mdist/[22moauth-state-store-vOSdOeGe.mjs                                           [2m  1.79 kB[22m [2m│ gzip:  0.71 kB[22m
[34mℹ[39m [2mdist/[22mmedia-allowlist-BNloC69x.mjs.map                                         [2m  1.77 kB[22m [2m│ gzip:  0.95 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/dev-reset.mjs.map                                 [2m  1.77 kB[22m [2m│ gzip:  0.89 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/disable.mjs.map                      [2m  1.77 kB[22m [2m│ gzip:  0.82 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/orphans/_slug_.mjs.map                           [2m  1.76 kB[22m [2m│ gzip:  0.81 kB[22m
[34mℹ[39m [2mdist/[22mpage/index.d.mts.map                                                     [2m  1.75 kB[22m [2m│ gzip:  0.67 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/token/refresh.mjs.map                             [2m  1.72 kB[22m [2m│ gzip:  0.87 kB[22m
[34mℹ[39m [2mdist/[22mtypes-CpUuGcd5.d.mts.map                                                 [2m  1.72 kB[22m [2m│ gzip:  0.51 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/api-tokens/_id_.mjs.map                           [2m  1.68 kB[22m [2m│ gzip:  0.85 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/redirects/404s/summary.mjs.map                          [2m  1.68 kB[22m [2m│ gzip:  0.79 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/token/revoke.mjs.map                              [2m  1.68 kB[22m [2m│ gzip:  0.87 kB[22m
[34mℹ[39m [2mdist/[22memail-console-CubRll9q.mjs                                               [2m  1.67 kB[22m [2m│ gzip:  0.86 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/revisions.mjs.map             [2m  1.67 kB[22m [2m│ gzip:  0.84 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/well-known/oauth-protected-resource.mjs.map             [2m  1.64 kB[22m [2m│ gzip:  0.85 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/permanent.mjs.map             [2m  1.62 kB[22m [2m│ gzip:  0.79 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/reorder.mjs.map        [2m  1.60 kB[22m [2m│ gzip:  0.72 kB[22m
[34mℹ[39m [2mdist/[22mchallenge-store-Dng1SxKT.mjs                                             [2m  1.59 kB[22m [2m│ gzip:  0.68 kB[22m
[34mℹ[39m [2mdist/[22mdb-errors-CGN9kJfo.mjs                                                   [2m  1.57 kB[22m [2m│ gzip:  0.77 kB[22m
[34mℹ[39m [2mdist/[22mpasskey-config-BloQOT3y.mjs                                              [2m  1.56 kB[22m [2m│ gzip:  0.74 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/trash.mjs.map                      [2m  1.55 kB[22m [2m│ gzip:  0.77 kB[22m
[34mℹ[39m [2mdist/[22mapi/route-utils.mjs.map                                                  [2m  1.54 kB[22m [2m│ gzip:  0.70 kB[22m
[34mℹ[39m [2mdist/[22mtypes-CkDSF81F.d.mts.map                                                 [2m  1.53 kB[22m [2m│ gzip:  0.67 kB[22m
[34mℹ[39m [2mdist/[22mtypes-DSZl1Dsv.mjs                                                       [2m  1.49 kB[22m [2m│ gzip:  0.70 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/index.mjs.map                        [2m  1.48 kB[22m [2m│ gzip:  0.74 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/_id_/index.mjs.map            [2m  1.45 kB[22m [2m│ gzip:  0.72 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/logout.mjs.map                                     [2m  1.44 kB[22m [2m│ gzip:  0.77 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/themes/marketplace/_id_/index.mjs.map             [2m  1.43 kB[22m [2m│ gzip:  0.72 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/dev/emails.mjs.map                                      [2m  1.43 kB[22m [2m│ gzip:  0.63 kB[22m
[34mℹ[39m [2mdist/[22moauth-user-lookup-3JwsVw6N.mjs.map                                       [2m  1.41 kB[22m [2m│ gzip:  0.76 kB[22m
[34mℹ[39m [2mdist/[22mdefault-BvTAYCzx.mjs                                                     [2m  1.35 kB[22m [2m│ gzip:  0.50 kB[22m
[34mℹ[39m [2mdist/[22mtypes-DaYDYW6g.d.mts.map                                                 [2m  1.34 kB[22m [2m│ gzip:  0.46 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/dashboard.mjs.map                                       [2m  1.34 kB[22m [2m│ gzip:  0.71 kB[22m
[34mℹ[39m [2mdist/[22mslugify-Cjh1ssOZ.mjs                                                     [2m  1.31 kB[22m [2m│ gzip:  0.71 kB[22m
[34mℹ[39m [2mdist/[22msite-url-xkhw1tcz.mjs.map                                                [2m  1.30 kB[22m [2m│ gzip:  0.73 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/counts.mjs.map                           [2m  1.30 kB[22m [2m│ gzip:  0.65 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/search/stats.mjs.map                                    [2m  1.29 kB[22m [2m│ gzip:  0.69 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/revisions/_revisionId_/index.mjs.map                    [2m  1.29 kB[22m [2m│ gzip:  0.68 kB[22m
[34mℹ[39m [2mdist/[22mload-DmXNVhst.mjs.map                                                    [2m  1.28 kB[22m [2m│ gzip:  0.64 kB[22m
[34mℹ[39m [2mdist/[22mmime-KV5TqkMN.mjs                                                        [2m  1.28 kB[22m [2m│ gzip:  0.64 kB[22m
[34mℹ[39m [2mdist/[22mauthorize-Bkwe8kuL.mjs                                                   [2m  1.28 kB[22m [2m│ gzip:  0.52 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/index.mjs.map                             [2m  1.27 kB[22m [2m│ gzip:  0.67 kB[22m
[34mℹ[39m [2mdist/[22mplugin-types.d.mts.map                                                   [2m  1.25 kB[22m [2m│ gzip:  0.46 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/compare.mjs.map               [2m  1.25 kB[22m [2m│ gzip:  0.67 kB[22m
[34mℹ[39m [2mdist/[22mconfig-CVssduLe.mjs                                                      [2m  1.23 kB[22m [2m│ gzip:  0.58 kB[22m
[34mℹ[39m [2mdist/[22mmedia-allowlist-BNloC69x.mjs                                             [2m  1.21 kB[22m [2m│ gzip:  0.71 kB[22m
[34mℹ[39m [2mdist/[22mhash-DlUxGhQS.mjs                                                        [2m  1.21 kB[22m [2m│ gzip:  0.66 kB[22m
[34mℹ[39m [2mdist/[22mschema-Djdlfi5G.mjs                                                      [2m  1.20 kB[22m [2m│ gzip:  0.59 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/providers/index.mjs.map                           [2m  1.16 kB[22m [2m│ gzip:  0.62 kB[22m
[34mℹ[39m [2mdist/[22msettings-CJnKiWuR.mjs                                                    [2m  1.16 kB[22m [2m│ gzip:  0.47 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/PluginRegistry.mjs.map                                      [2m  1.15 kB[22m [2m│ gzip:  0.57 kB[22m
[34mℹ[39m [2mdist/[22mdb/postgres.mjs.map                                                      [2m  1.14 kB[22m [2m│ gzip:  0.53 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/orphans/index.mjs.map                            [2m  1.14 kB[22m [2m│ gzip:  0.57 kB[22m
[34mℹ[39m [2mdist/[22msetup-complete-MzzN9u0b.mjs                                              [2m  1.12 kB[22m [2m│ gzip:  0.52 kB[22m
[34mℹ[39m [2mdist/[22msetup-nonce-DXuriHsg.mjs.map                                             [2m  1.10 kB[22m [2m│ gzip:  0.63 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/execute.d.mts.map                      [2m  1.09 kB[22m [2m│ gzip:  0.53 kB[22m
[34mℹ[39m [2mdist/[22msetup-nonce-DXuriHsg.mjs                                                 [2m  1.02 kB[22m [2m│ gzip:  0.58 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/analyze.d.mts.map                      [2m  1.00 kB[22m [2m│ gzip:  0.43 kB[22m
[34mℹ[39m [2mdist/[22mauth/providers/github.mjs.map                                            [2m  0.99 kB[22m [2m│ gzip:  0.51 kB[22m
[34mℹ[39m [2mdist/[22mauth/providers/google.mjs.map                                            [2m  0.99 kB[22m [2m│ gzip:  0.51 kB[22m
[34mℹ[39m [2mdist/[22mtypes-D599-ruj.d.mts.map                                                 [2m  0.94 kB[22m [2m│ gzip:  0.46 kB[22m
[34mℹ[39m [2mdist/[22mtransaction-NQj4VJ7Z.mjs                                                 [2m  0.92 kB[22m [2m│ gzip:  0.48 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-components.mjs.map                               [2m  0.91 kB[22m [2m│ gzip:  0.51 kB[22m
[34mℹ[39m [2mdist/[22mdb/sqlite.mjs.map                                                        [2m  0.91 kB[22m [2m│ gzip:  0.51 kB[22m
[34mℹ[39m [2mdist/[22mchunks-BkfVdD-3.mjs.map                                                  [2m  0.90 kB[22m [2m│ gzip:  0.57 kB[22m
[34mℹ[39m [2mdist/[22moauth-user-lookup-3JwsVw6N.mjs                                           [2m  0.81 kB[22m [2m│ gzip:  0.49 kB[22m
[34mℹ[39m [2mdist/[22mchunks-BkfVdD-3.mjs                                                      [2m  0.80 kB[22m [2m│ gzip:  0.51 kB[22m
[34mℹ[39m [2mdist/[22mredirect-BINiRYq4.mjs.map                                                [2m  0.75 kB[22m [2m│ gzip:  0.49 kB[22m
[34mℹ[39m [2mdist/[22mdb/libsql.mjs.map                                                        [2m  0.71 kB[22m [2m│ gzip:  0.41 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/rewrite-url-helpers.d.mts.map          [2m  0.70 kB[22m [2m│ gzip:  0.33 kB[22m
[34mℹ[39m [2mdist/[22mload-DmXNVhst.mjs                                                        [2m  0.70 kB[22m [2m│ gzip:  0.38 kB[22m
[34mℹ[39m [2mdist/[22madapters-C4yd_UJR.d.mts.map                                              [2m  0.67 kB[22m [2m│ gzip:  0.32 kB[22m
[34mℹ[39m [2mdist/[22mstorage/s3.d.mts.map                                                     [2m  0.67 kB[22m [2m│ gzip:  0.33 kB[22m
[34mℹ[39m [2mdist/[22mseo/index.d.mts.map                                                      [2m  0.64 kB[22m [2m│ gzip:  0.36 kB[22m
[34mℹ[39m [2mdist/[22mstorage/local.d.mts.map                                                  [2m  0.62 kB[22m [2m│ gzip:  0.32 kB[22m
[34mℹ[39m [2mdist/[22mtypes-Dgo6y-Ut.d.mts.map                                                 [2m  0.59 kB[22m [2m│ gzip:  0.31 kB[22m
[34mℹ[39m [2mdist/[22mversion-w3SQnBSs.mjs.map                                                 [2m  0.59 kB[22m [2m│ gzip:  0.33 kB[22m
[34mℹ[39m [2mdist/[22mescape-Cg6kMELH.mjs.map                                                  [2m  0.58 kB[22m [2m│ gzip:  0.34 kB[22m
[34mℹ[39m [2mdist/[22mmode-CaaiebZI.mjs                                                        [2m  0.58 kB[22m [2m│ gzip:  0.36 kB[22m
[34mℹ[39m [2mdist/[22mrequest-context.d.mts.map                                                [2m  0.57 kB[22m [2m│ gzip:  0.31 kB[22m
[34mℹ[39m [2mdist/[22mplugin-utils.d.mts.map                                                   [2m  0.56 kB[22m [2m│ gzip:  0.30 kB[22m
[34mℹ[39m [2mdist/[22mdatabase/instrumentation.d.mts.map                                       [2m  0.53 kB[22m [2m│ gzip:  0.28 kB[22m
[34mℹ[39m [2mdist/[22mredirect-BINiRYq4.mjs                                                    [2m  0.53 kB[22m [2m│ gzip:  0.37 kB[22m
[34mℹ[39m [2mdist/[22mtransport-DOxLfUir.d.mts.map                                             [2m  0.49 kB[22m [2m│ gzip:  0.28 kB[22m
[34mℹ[39m [2mdist/[22mclient/cf-access.d.mts.map                                               [2m  0.49 kB[22m [2m│ gzip:  0.27 kB[22m
[34mℹ[39m [2mdist/[22mapi/route-utils.d.mts.map                                                [2m  0.48 kB[22m [2m│ gzip:  0.27 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/media.d.mts.map                        [2m  0.45 kB[22m [2m│ gzip:  0.25 kB[22m
[34mℹ[39m [2mdist/[22msite-url-xkhw1tcz.mjs                                                    [2m  0.44 kB[22m [2m│ gzip:  0.30 kB[22m
[34mℹ[39m [2mdist/[22mmedia/local-runtime.d.mts.map                                            [2m  0.40 kB[22m [2m│ gzip:  0.23 kB[22m
[34mℹ[39m [2mdist/[22mrunner-CNHRo1mT.d.mts.map                                                [2m  0.40 kB[22m [2m│ gzip:  0.23 kB[22m
[34mℹ[39m [2mdist/[22mastro/index.d.mts.map                                                    [2m  0.36 kB[22m [2m│ gzip:  0.22 kB[22m
[34mℹ[39m [2mdist/[22mtypes-Cd9UCu3t.mjs                                                       [2m  0.36 kB[22m [2m│ gzip:  0.24 kB[22m
[34mℹ[39m [2mdist/[22mescape-Cg6kMELH.mjs                                                      [2m  0.36 kB[22m [2m│ gzip:  0.25 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/rewrite-urls.d.mts.map                 [2m  0.34 kB[22m [2m│ gzip:  0.23 kB[22m
[34mℹ[39m [2mdist/[22mastro/middleware/auth.d.mts.map                                          [2m  0.33 kB[22m [2m│ gzip:  0.22 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/execute.d.mts.map               [2m  0.32 kB[22m [2m│ gzip:  0.23 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/prepare.d.mts.map                      [2m  0.32 kB[22m [2m│ gzip:  0.21 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/plugins/_pluginId_/_...path_.d.mts.map                  [2m  0.29 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/analyze.d.mts.map               [2m  0.27 kB[22m [2m│ gzip:  0.20 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.d.mts.map  [2m  0.26 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/PluginRegistry.d.mts.map                                    [2m  0.26 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22mtypes-1NNkmTIn.mjs                                                       [2m  0.25 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/_slug_.d.mts.map                [2m  0.25 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22mapi-tokens-iPIHAY8N.mjs                                                  [2m  0.25 kB[22m [2m│ gzip:  0.17 kB[22m
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
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/bylines/_id_/translations.d.mts.map               [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
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
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/bylines/index.d.mts.map                           [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
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
[34mℹ[39m [2mdist/[22mastro/routes/sitemap-_collection_.xml.d.mts.map                          [2m  0.18 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/hooks/exclusive/index.d.mts.map                   [2m  0.18 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/typegen.d.mts.map                                       [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/widgets.d.mts.map                   [2m  0.18 kB[22m [2m│ gzip:  0.16 kB[22m
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
[34mℹ[39m [2mdist/[22mversion-w3SQnBSs.mjs                                                     [2m  0.17 kB[22m [2m│ gzip:  0.16 kB[22m
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
[34mℹ[39m [2mdist/[22mssrf-BIcd-aXW.mjs                                                        [2m  0.01 kB[22m [2m│ gzip:  0.03 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mindex.d.mts[22m[39m                                                              [2m 18.12 kB[22m [2m│ gzip:  4.80 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/types.d.mts[22m[39m                                                        [2m 12.64 kB[22m [2m│ gzip:  3.83 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mclient/index.d.mts[22m[39m                                                       [2m 11.48 kB[22m [2m│ gzip:  3.14 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mapi/schemas/index.d.mts[22m[39m                                                  [2m  7.93 kB[22m [2m│ gzip:  1.88 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mpage/index.d.mts[22m[39m                                                         [2m  6.82 kB[22m [2m│ gzip:  2.27 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mplugin-types.d.mts[22m[39m                                                       [2m  6.38 kB[22m [2m│ gzip:  2.28 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/execute.d.mts[22m[39m                          [2m  3.91 kB[22m [2m│ gzip:  1.54 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mapi/route-utils.d.mts[22m[39m                                                    [2m  2.94 kB[22m [2m│ gzip:  1.35 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mplugin-utils.d.mts[22m[39m                                                       [2m  2.84 kB[22m [2m│ gzip:  1.24 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mrequest-context.d.mts[22m[39m                                                    [2m  2.81 kB[22m [2m│ gzip:  1.29 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/index.d.mts[22m[39m                                                        [2m  2.60 kB[22m [2m│ gzip:  1.17 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mclient/cf-access.d.mts[22m[39m                                                   [2m  2.55 kB[22m [2m│ gzip:  1.03 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/analyze.d.mts[22m[39m                          [2m  2.52 kB[22m [2m│ gzip:  0.95 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mseo/index.d.mts[22m[39m                                                          [2m  2.45 kB[22m [2m│ gzip:  1.01 kB[22m
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
[34mℹ[39m [2mdist/[22m[32m[1mseed/index.d.mts[22m[39m                                                         [2m  0.82 kB[22m [2m│ gzip:  0.33 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/middleware/redirect.d.mts[22m[39m                                          [2m  0.72 kB[22m [2m│ gzip:  0.45 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress-plugin/execute.d.mts[22m[39m                   [2m  0.67 kB[22m [2m│ gzip:  0.38 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/middleware/setup.d.mts[22m[39m                                             [2m  0.67 kB[22m [2m│ gzip:  0.40 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/middleware/request-context.d.mts[22m[39m                                   [2m  0.64 kB[22m [2m│ gzip:  0.40 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/rewrite-urls.d.mts[22m[39m                     [2m  0.59 kB[22m [2m│ gzip:  0.33 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/settings.d.mts[22m[39m                                          [2m  0.58 kB[22m [2m│ gzip:  0.33 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mdb/index.d.mts[22m[39m                                                           [2m  0.58 kB[22m [2m│ gzip:  0.27 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/settings/email.d.mts[22m[39m                                    [2m  0.53 kB[22m [2m│ gzip:  0.32 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/search/index.d.mts[22m[39m                                      [2m  0.51 kB[22m [2m│ gzip:  0.31 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/media/_id_.d.mts[22m[39m                                        [2m  0.51 kB[22m [2m│ gzip:  0.28 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/probe.d.mts[22m[39m                                      [2m  0.50 kB[22m [2m│ gzip:  0.30 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/typegen.d.mts[22m[39m                                           [2m  0.49 kB[22m [2m│ gzip:  0.32 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/api-tokens/index.d.mts[22m[39m                            [2m  0.48 kB[22m [2m│ gzip:  0.31 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/prepare.d.mts[22m[39m                          [2m  0.47 kB[22m [2m│ gzip:  0.27 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/search/suggest.d.mts[22m[39m                                    [2m  0.47 kB[22m [2m│ gzip:  0.30 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress-plugin/analyze.d.mts[22m[39m                   [2m  0.47 kB[22m [2m│ gzip:  0.29 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mauth/providers/github.d.mts[22m[39m                                              [2m  0.45 kB[22m [2m│ gzip:  0.30 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mauth/providers/google.d.mts[22m[39m                                              [2m  0.45 kB[22m [2m│ gzip:  0.29 kB[22m
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
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/bylines/_id_/translations.d.mts[22m[39m                   [2m  0.28 kB[22m [2m│ gzip:  0.20 kB[22m
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
[34mℹ[39m [2mdist/[22m[32mindex-D2-g1b1o.d.mts[39m                                                     [2m152.20 kB[22m [2m│ gzip: 40.96 kB[22m
[34mℹ[39m [2mdist/[22m[32mbylines-Be4yT0xl.d.mts[39m                                                   [2m 73.07 kB[22m [2m│ gzip:  8.46 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-DGHWRQgr.d.mts[39m                                                     [2m 39.71 kB[22m [2m│ gzip: 10.61 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-DaqNzqVt.d.mts[39m                                                     [2m 11.55 kB[22m [2m│ gzip:  2.61 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-bYmRn_Uy.d.mts[39m                                                     [2m  9.78 kB[22m [2m│ gzip:  3.24 kB[22m
[34mℹ[39m [2mdist/[22m[32mplaceholder-KCkkCtgQ.d.mts[39m                                               [2m  8.70 kB[22m [2m│ gzip:  2.96 kB[22m
[34mℹ[39m [2mdist/[22m[32mvalidate-DQtHw9NT.d.mts[39m                                                  [2m  8.64 kB[22m [2m│ gzip:  2.67 kB[22m
[34mℹ[39m [2mdist/[22m[32mindex-CC42STEm.d.mts[39m                                                     [2m  7.74 kB[22m [2m│ gzip:  2.83 kB[22m
[34mℹ[39m [2mdist/[22m[32moptions-DhV-gwJb.d.mts[39m                                                   [2m  6.44 kB[22m [2m│ gzip:  2.43 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-D599-ruj.d.mts[39m                                                     [2m  6.19 kB[22m [2m│ gzip:  2.34 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-CpUuGcd5.d.mts[39m                                                     [2m  5.73 kB[22m [2m│ gzip:  1.66 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-CkDSF81F.d.mts[39m                                                     [2m  5.04 kB[22m [2m│ gzip:  1.78 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-DaYDYW6g.d.mts[39m                                                     [2m  4.57 kB[22m [2m│ gzip:  1.72 kB[22m
[34mℹ[39m [2mdist/[22m[32madapters-C4yd_UJR.d.mts[39m                                                  [2m  3.21 kB[22m [2m│ gzip:  1.32 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-Dgo6y-Ut.d.mts[39m                                                     [2m  2.64 kB[22m [2m│ gzip:  1.17 kB[22m
[34mℹ[39m [2mdist/[22m[32mrunner-CNHRo1mT.d.mts[39m                                                    [2m  1.83 kB[22m [2m│ gzip:  0.91 kB[22m
[34mℹ[39m [2mdist/[22m[32mtransport-DOxLfUir.d.mts[39m                                                 [2m  1.67 kB[22m [2m│ gzip:  0.76 kB[22m
[34mℹ[39m 995 files, total: 6933.02 kB
[33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugins. Here is a breakdown:
  - rolldown-plugin-dts:generate (40%)
  - rolldown-plugin-dts:resolver (29%)
  - rolldown-plugin-dts:fake-js (25%)
See https://rolldown.rs/options/checks#plugintimings for more details.

[32m✔[39m Build complete in [32m4927ms[39m
$ pnpm --filter @emdash-cms/registry-lexicons build
==> pnpm-build-registry-lexicons
$ pnpm run build:lexicons && pnpm run build:types
$ node scripts/copy-lexicons.mjs
using in-package lexicon copy at /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-lexicons/lexicons/com/emdashcms/experimental (no source at /home/data/dev_react/awcms-micro/awcmsmicro-dev/lexicons/com/emdashcms/experimental)
$ tsdown
[34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
[34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-lexicons/tsdown.config.ts[24m
[34mℹ[39m entry: [34msrc/index.ts, src/generated/types/com/emdashcms/experimental/aggregator/defs.ts, src/generated/types/com/emdashcms/experimental/aggregator/getLatestRelease.ts, src/generated/types/com/emdashcms/experimental/aggregator/getPackage.ts, src/generated/types/com/emdashcms/experimental/aggregator/listReleases.ts, src/generated/types/com/emdashcms/experimental/aggregator/resolvePackage.ts, src/generated/types/com/emdashcms/experimental/aggregator/searchPackages.ts, src/generated/types/com/emdashcms/experimental/package/profile.ts, src/generated/types/com/emdashcms/experimental/package/release.ts, src/generated/types/com/emdashcms/experimental/package/releaseExtension.ts, src/generated/types/com/emdashcms/experimental/publisher/profile.ts, src/generated/types/com/emdashcms/experimental/publisher/verification.ts[39m
[34mℹ[39m target: [34mes2023[39m
[34mℹ[39m tsconfig: [34mtsconfig.json[39m
[34mℹ[39m Build start
[34mℹ[39m Cleaning 57 files
[34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/package/releaseExtension.js[22m           [2m 5.50 kB[22m [2m│ gzip: 0.86 kB[22m
[34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/package/profile.js[22m                    [2m 4.45 kB[22m [2m│ gzip: 0.78 kB[22m
[34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/package/release.js[22m                    [2m 4.01 kB[22m [2m│ gzip: 0.78 kB[22m
[34mℹ[39m [2mdist/[22m[1mindex.js[22m                                                                         [2m 3.85 kB[22m [2m│ gzip: 1.00 kB[22m
[34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/aggregator/defs.js[22m                    [2m 2.53 kB[22m [2m│ gzip: 0.64 kB[22m
[34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/publisher/profile.js[22m                  [2m 2.01 kB[22m [2m│ gzip: 0.58 kB[22m
[34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/aggregator/searchPackages.js[22m          [2m 1.55 kB[22m [2m│ gzip: 0.53 kB[22m
[34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/aggregator/listReleases.js[22m            [2m 1.41 kB[22m [2m│ gzip: 0.53 kB[22m
[34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/publisher/verification.js[22m             [2m 0.99 kB[22m [2m│ gzip: 0.45 kB[22m
[34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/aggregator/getLatestRelease.js[22m        [2m 0.87 kB[22m [2m│ gzip: 0.44 kB[22m
[34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/aggregator/resolvePackage.js[22m          [2m 0.86 kB[22m [2m│ gzip: 0.44 kB[22m
[34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/aggregator/getPackage.js[22m              [2m 0.84 kB[22m [2m│ gzip: 0.44 kB[22m
[34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/package/release.js.map                [2m11.34 kB[22m [2m│ gzip: 3.07 kB[22m
[34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/package/releaseExtension.js.map       [2m11.30 kB[22m [2m│ gzip: 2.06 kB[22m
[34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/package/profile.js.map                [2m10.94 kB[22m [2m│ gzip: 2.32 kB[22m
[34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/aggregator/defs.js.map                [2m 6.74 kB[22m [2m│ gzip: 1.81 kB[22m
[34mℹ[39m [2mdist/[22mindex.js.map                                                                     [2m 6.29 kB[22m [2m│ gzip: 1.85 kB[22m
[34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/publisher/profile.js.map              [2m 4.96 kB[22m [2m│ gzip: 1.56 kB[22m
[34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/aggregator/searchPackages.js.map      [2m 3.95 kB[22m [2m│ gzip: 1.27 kB[22m
[34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/aggregator/listReleases.js.map        [2m 3.40 kB[22m [2m│ gzip: 1.11 kB[22m
[34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/publisher/verification.js.map         [2m 2.91 kB[22m [2m│ gzip: 1.14 kB[22m
[34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/package/releaseExtension.d.ts.map     [2m 2.29 kB[22m [2m│ gzip: 0.67 kB[22m
[34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/aggregator/resolvePackage.js.map      [2m 1.85 kB[22m [2m│ gzip: 0.79 kB[22m
[34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/aggregator/getLatestRelease.js.map    [2m 1.83 kB[22m [2m│ gzip: 0.78 kB[22m
[34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/aggregator/getPackage.js.map          [2m 1.80 kB[22m [2m│ gzip: 0.77 kB[22m
[34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/package/release.d.ts.map              [2m 1.01 kB[22m [2m│ gzip: 0.40 kB[22m
[34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/package/profile.d.ts.map              [2m 1.00 kB[22m [2m│ gzip: 0.42 kB[22m
[34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/publisher/profile.d.ts.map            [2m 0.61 kB[22m [2m│ gzip: 0.32 kB[22m
[34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/aggregator/defs.d.ts.map              [2m 0.59 kB[22m [2m│ gzip: 0.27 kB[22m
[34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/aggregator/searchPackages.d.ts.map    [2m 0.51 kB[22m [2m│ gzip: 0.28 kB[22m
[34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/aggregator/listReleases.d.ts.map      [2m 0.50 kB[22m [2m│ gzip: 0.28 kB[22m
[34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/aggregator/getLatestRelease.d.ts.map  [2m 0.48 kB[22m [2m│ gzip: 0.28 kB[22m
[34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/aggregator/resolvePackage.d.ts.map    [2m 0.48 kB[22m [2m│ gzip: 0.28 kB[22m
[34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/aggregator/getPackage.d.ts.map        [2m 0.47 kB[22m [2m│ gzip: 0.28 kB[22m
[34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/publisher/verification.d.ts.map       [2m 0.44 kB[22m [2m│ gzip: 0.27 kB[22m
[34mℹ[39m [2mdist/[22mchunk-BYypO7fO.js                                                                [2m 0.38 kB[22m [2m│ gzip: 0.26 kB[22m
[34mℹ[39m [2mdist/[22mindex.d.ts.map                                                                   [2m 0.35 kB[22m [2m│ gzip: 0.21 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mgenerated/types/com/emdashcms/experimental/package/releaseExtension.d.ts[22m[39m         [2m 9.12 kB[22m [2m│ gzip: 1.61 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mgenerated/types/com/emdashcms/experimental/package/release.d.ts[22m[39m                  [2m 8.37 kB[22m [2m│ gzip: 2.45 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mgenerated/types/com/emdashcms/experimental/package/profile.d.ts[22m[39m                  [2m 7.34 kB[22m [2m│ gzip: 1.68 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mindex.d.ts[22m[39m                                                                       [2m 5.22 kB[22m [2m│ gzip: 1.34 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mgenerated/types/com/emdashcms/experimental/aggregator/defs.d.ts[22m[39m                  [2m 5.12 kB[22m [2m│ gzip: 1.44 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mgenerated/types/com/emdashcms/experimental/publisher/profile.d.ts[22m[39m                [2m 3.47 kB[22m [2m│ gzip: 1.16 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mgenerated/types/com/emdashcms/experimental/aggregator/searchPackages.d.ts[22m[39m        [2m 2.48 kB[22m [2m│ gzip: 0.94 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mgenerated/types/com/emdashcms/experimental/publisher/verification.d.ts[22m[39m           [2m 2.38 kB[22m [2m│ gzip: 0.96 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mgenerated/types/com/emdashcms/experimental/aggregator/listReleases.d.ts[22m[39m          [2m 2.07 kB[22m [2m│ gzip: 0.80 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mgenerated/types/com/emdashcms/experimental/aggregator/resolvePackage.d.ts[22m[39m        [2m 1.26 kB[22m [2m│ gzip: 0.59 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mgenerated/types/com/emdashcms/experimental/aggregator/getLatestRelease.d.ts[22m[39m      [2m 1.25 kB[22m [2m│ gzip: 0.58 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mgenerated/types/com/emdashcms/experimental/aggregator/getPackage.d.ts[22m[39m            [2m 1.20 kB[22m [2m│ gzip: 0.57 kB[22m
[34mℹ[39m 49 files, total: 154.54 kB
[32m✔[39m Build complete in [32m628ms[39m
$ pnpm build
==> pnpm-build-workspace
$ pnpm run --filter {./packages/**} build
Scope: 32 of 61 workspace projects
packages/auth build$ tsdown
packages/blocks build$ tsdown
packages/contentful-to-portable-text build$ tsdown src/index.ts --format esm --dts --clean
packages/create-emdash build$ tsdown
packages/auth build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/create-emdash build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/blocks build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/contentful-to-portable-text build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/auth build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/auth/tsdown.config.ts[24m
packages/auth build: [34mℹ[39m entry: [34msrc/index.ts, src/passkey/index.ts, src/adapters/kysely.ts, src/oauth/providers/github.ts, src/oauth/providers/google.ts[39m
packages/auth build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/auth build: [34mℹ[39m Build start
packages/contentful-to-portable-text build: [34mℹ[39m entry: [34msrc/index.ts[39m
packages/contentful-to-portable-text build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/contentful-to-portable-text build: [34mℹ[39m Build start
packages/auth build: [34mℹ[39m Cleaning 32 files
packages/contentful-to-portable-text build: [34mℹ[39m Cleaning 4 files
packages/create-emdash build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/create-emdash/tsdown.config.ts[24m
packages/create-emdash build: [34mℹ[39m entry: [34msrc/index.ts[39m
packages/create-emdash build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/create-emdash build: [34mℹ[39m Build start
packages/create-emdash build: [34mℹ[39m Cleaning 3 files
packages/blocks build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/blocks/tsdown.config.ts[24m
packages/blocks build: [34mℹ[39m entry: [34msrc/index.ts, src/server.ts[39m
packages/blocks build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/blocks build: [34mℹ[39m Build start
packages/blocks build: [34mℹ[39m Cleaning 10 files
packages/contentful-to-portable-text build: [34mℹ[39m [2mdist/[22m[1mindex.mjs[22m        [2m15.95 kB[22m [2m│ gzip: 4.30 kB[22m
packages/contentful-to-portable-text build: [34mℹ[39m [2mdist/[22mindex.mjs.map    [2m39.25 kB[22m [2m│ gzip: 9.30 kB[22m
packages/contentful-to-portable-text build: [34mℹ[39m [2mdist/[22mindex.d.mts.map  [2m 0.66 kB[22m [2m│ gzip: 0.33 kB[22m
packages/contentful-to-portable-text build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.mts[22m[39m      [2m 2.15 kB[22m [2m│ gzip: 0.88 kB[22m
packages/contentful-to-portable-text build: [34mℹ[39m 4 files, total: 58.01 kB
packages/contentful-to-portable-text build: [32m✔[39m Build complete in [32m763ms[39m
packages/contentful-to-portable-text build: Done
packages/gutenberg-to-portable-text build$ tsdown src/index.ts --format esm --dts --clean
packages/gutenberg-to-portable-text build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/gutenberg-to-portable-text build: [34mℹ[39m entry: [34msrc/index.ts[39m
packages/gutenberg-to-portable-text build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/gutenberg-to-portable-text build: [34mℹ[39m Build start
packages/gutenberg-to-portable-text build: [34mℹ[39m Cleaning 5 files
packages/create-emdash build: [34mℹ[39m Granting execute permission to [4mdist/index.mjs[24m
packages/create-emdash build: [34mℹ[39m [2mdist/[22m[1mindex.mjs[22m      [2m20.18 kB[22m [2m│ gzip:  6.50 kB[22m
packages/create-emdash build: [34mℹ[39m [2mdist/[22mindex.mjs.map  [2m38.84 kB[22m [2m│ gzip: 11.84 kB[22m
packages/create-emdash build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.mts[22m[39m    [2m 0.01 kB[22m [2m│ gzip:  0.03 kB[22m
packages/create-emdash build: [34mℹ[39m 3 files, total: 59.03 kB
packages/create-emdash build: [32m✔[39m Build complete in [32m997ms[39m
packages/create-emdash build: Done
packages/plugin-types build$ tsdown
packages/plugin-types build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/plugin-types build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugin-types/tsdown.config.ts[24m
packages/plugin-types build: [34mℹ[39m entry: [34msrc/index.ts[39m
packages/plugin-types build: [34mℹ[39m target: [34mes2023[39m
packages/plugin-types build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugin-types build: [34mℹ[39m Build start
packages/plugin-types build: [34mℹ[39m Cleaning 4 files
packages/gutenberg-to-portable-text build: [34mℹ[39m [2mdist/[22m[1mindex.mjs[22m           [2m42.66 kB[22m [2m│ gzip:  9.88 kB[22m
packages/gutenberg-to-portable-text build: [34mℹ[39m [2mdist/[22mindex.mjs.map       [2m92.08 kB[22m [2m│ gzip: 20.03 kB[22m
packages/gutenberg-to-portable-text build: [34mℹ[39m [2mdist/[22mindex.d.mts.map     [2m 3.63 kB[22m [2m│ gzip:  1.03 kB[22m
packages/gutenberg-to-portable-text build: [34mℹ[39m [2mdist/[22mchunk-DQk6qfdC.mjs  [2m 0.38 kB[22m [2m│ gzip:  0.26 kB[22m
packages/gutenberg-to-portable-text build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.mts[22m[39m         [2m11.56 kB[22m [2m│ gzip:  2.98 kB[22m
packages/gutenberg-to-portable-text build: [34mℹ[39m 5 files, total: 150.32 kB
packages/gutenberg-to-portable-text build: [32m✔[39m Build complete in [32m651ms[39m
packages/gutenberg-to-portable-text build: Done
packages/registry-lexicons build$ pnpm run build:lexicons && pnpm run build:types
packages/auth build: [34mℹ[39m [2mdist/[22m[1mindex.mjs[22m                         [2m26.94 kB[22m [2m│ gzip:  6.91 kB[22m
packages/auth build: [34mℹ[39m [2mdist/[22m[1madapters/kysely.mjs[22m               [2m14.12 kB[22m [2m│ gzip:  3.19 kB[22m
packages/auth build: [34mℹ[39m [2mdist/[22m[1moauth/providers/github.mjs[22m        [2m 1.64 kB[22m [2m│ gzip:  0.81 kB[22m
packages/auth build: [34mℹ[39m [2mdist/[22m[1moauth/providers/google.mjs[22m        [2m 0.80 kB[22m [2m│ gzip:  0.44 kB[22m
packages/auth build: [34mℹ[39m [2mdist/[22m[1mpasskey/index.mjs[22m                 [2m 0.47 kB[22m [2m│ gzip:  0.20 kB[22m
packages/auth build: [34mℹ[39m [2mdist/[22mindex.mjs.map                     [2m54.67 kB[22m [2m│ gzip: 13.41 kB[22m
packages/auth build: [34mℹ[39m [2mdist/[22mauthenticate-BiDGbUVY.mjs.map     [2m32.88 kB[22m [2m│ gzip:  8.68 kB[22m
packages/auth build: [34mℹ[39m [2mdist/[22madapters/kysely.mjs.map           [2m31.05 kB[22m [2m│ gzip:  6.62 kB[22m
packages/auth build: [34mℹ[39m [2mdist/[22mauthenticate-BiDGbUVY.mjs         [2m17.29 kB[22m [2m│ gzip:  4.89 kB[22m
packages/auth build: [34mℹ[39m [2mdist/[22mtypes-ndj-bYfi.mjs.map            [2m11.74 kB[22m [2m│ gzip:  2.90 kB[22m
packages/auth build: [34mℹ[39m [2mdist/[22mindex.d.mts.map                   [2m 4.35 kB[22m [2m│ gzip:  1.21 kB[22m
packages/auth build: [34mℹ[39m [2mdist/[22mtypes-DZ0waGOT.d.mts.map          [2m 3.67 kB[22m [2m│ gzip:  0.93 kB[22m
packages/auth build: [34mℹ[39m [2mdist/[22moauth/providers/github.mjs.map    [2m 2.98 kB[22m [2m│ gzip:  1.30 kB[22m
packages/auth build: [34mℹ[39m [2mdist/[22mauthenticate-Da9jec28.d.mts.map   [2m 2.05 kB[22m [2m│ gzip:  0.62 kB[22m
packages/auth build: [34mℹ[39m [2mdist/[22mtypes-ndj-bYfi.mjs                [2m 1.53 kB[22m [2m│ gzip:  0.73 kB[22m
packages/auth build: [34mℹ[39m [2mdist/[22moauth/providers/google.mjs.map    [2m 1.41 kB[22m [2m│ gzip:  0.69 kB[22m
packages/auth build: [34mℹ[39m [2mdist/[22madapters/kysely.d.mts.map         [2m 0.80 kB[22m [2m│ gzip:  0.31 kB[22m
packages/auth build: [34mℹ[39m [2mdist/[22mtypes-Bu4irX9A.d.mts.map          [2m 0.39 kB[22m [2m│ gzip:  0.21 kB[22m
packages/auth build: [34mℹ[39m [2mdist/[22moauth/providers/github.d.mts.map  [2m 0.18 kB[22m [2m│ gzip:  0.16 kB[22m
packages/auth build: [34mℹ[39m [2mdist/[22moauth/providers/google.d.mts.map  [2m 0.14 kB[22m [2m│ gzip:  0.13 kB[22m
packages/auth build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.mts[22m[39m                       [2m18.52 kB[22m [2m│ gzip:  4.93 kB[22m
packages/auth build: [34mℹ[39m [2mdist/[22m[32m[1madapters/kysely.d.mts[22m[39m             [2m 3.46 kB[22m [2m│ gzip:  1.05 kB[22m
packages/auth build: [34mℹ[39m [2mdist/[22m[32m[1mpasskey/index.d.mts[22m[39m               [2m 1.00 kB[22m [2m│ gzip:  0.30 kB[22m
packages/auth build: [34mℹ[39m [2mdist/[22m[32m[1moauth/providers/github.d.mts[22m[39m      [2m 0.43 kB[22m [2m│ gzip:  0.29 kB[22m
packages/auth build: [34mℹ[39m [2mdist/[22m[32m[1moauth/providers/google.d.mts[22m[39m      [2m 0.21 kB[22m [2m│ gzip:  0.17 kB[22m
packages/auth build: [34mℹ[39m [2mdist/[22m[32mtypes-DZ0waGOT.d.mts[39m              [2m 6.77 kB[22m [2m│ gzip:  1.87 kB[22m
packages/auth build: [34mℹ[39m [2mdist/[22m[32mauthenticate-Da9jec28.d.mts[39m       [2m 5.21 kB[22m [2m│ gzip:  1.49 kB[22m
packages/auth build: [34mℹ[39m [2mdist/[22m[32mtypes-Bu4irX9A.d.mts[39m              [2m 0.76 kB[22m [2m│ gzip:  0.38 kB[22m
packages/auth build: [34mℹ[39m 28 files, total: 245.46 kB
packages/auth build: [32m✔[39m Build complete in [32m1664ms[39m
packages/plugin-types build: [34mℹ[39m [2mdist/[22m[1mindex.js[22m        [2m 4.31 kB[22m [2m│ gzip: 1.96 kB[22m
packages/plugin-types build: [34mℹ[39m [2mdist/[22mindex.js.map    [2m13.45 kB[22m [2m│ gzip: 4.90 kB[22m
packages/plugin-types build: [34mℹ[39m [2mdist/[22mindex.d.ts.map  [2m 1.23 kB[22m [2m│ gzip: 0.56 kB[22m
packages/plugin-types build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.ts[22m[39m      [2m10.06 kB[22m [2m│ gzip: 3.84 kB[22m
packages/plugin-types build: [34mℹ[39m 4 files, total: 29.04 kB
packages/plugin-types build: [32m✔[39m Build complete in [32m481ms[39m
packages/auth build: Done
packages/x402 build$ tsdown
packages/plugin-types build: Done
packages/x402 build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/x402 build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/x402/tsdown.config.ts[24m
packages/x402 build: [34mℹ[39m entry: [34msrc/index.ts, src/middleware.ts[39m
packages/x402 build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/x402 build: [34mℹ[39m Build start
packages/x402 build: [34mℹ[39m Cleaning 10 files
packages/registry-lexicons build: $ node scripts/copy-lexicons.mjs
packages/registry-lexicons build: using in-package lexicon copy at /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-lexicons/lexicons/com/emdashcms/experimental (no source at /home/data/dev_react/awcms-micro/awcmsmicro-dev/lexicons/com/emdashcms/experimental)
packages/blocks build: [34mℹ[39m [2mdist/[22m[1mindex.js[22m                      [2m31.37 kB[22m [2m│ gzip:  7.04 kB[22m
packages/blocks build: [34mℹ[39m [2mdist/[22m[1mserver.js[22m                     [2m 0.14 kB[22m [2m│ gzip:  0.11 kB[22m
packages/blocks build: [34mℹ[39m [2mdist/[22mvalidation-Dq-a7CXm.js.map    [2m79.81 kB[22m [2m│ gzip: 10.78 kB[22m
packages/blocks build: [34mℹ[39m [2mdist/[22mindex.js.map                  [2m61.08 kB[22m [2m│ gzip: 13.60 kB[22m
packages/blocks build: [34mℹ[39m [2mdist/[22mvalidation-Dq-a7CXm.js        [2m39.60 kB[22m [2m│ gzip:  5.81 kB[22m
packages/blocks build: [34mℹ[39m [2mdist/[22mvalidation-5vL6669b.d.ts.map  [2m 7.29 kB[22m [2m│ gzip:  1.42 kB[22m
packages/blocks build: [34mℹ[39m [2mdist/[22mindex.d.ts.map                [2m 0.50 kB[22m [2m│ gzip:  0.28 kB[22m
packages/blocks build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.ts[22m[39m                    [2m 2.83 kB[22m [2m│ gzip:  1.01 kB[22m
packages/blocks build: [34mℹ[39m [2mdist/[22m[32m[1mserver.d.ts[22m[39m                   [2m 1.22 kB[22m [2m│ gzip:  0.45 kB[22m
packages/blocks build: [34mℹ[39m [2mdist/[22m[32mvalidation-5vL6669b.d.ts[39m      [2m15.63 kB[22m [2m│ gzip:  3.89 kB[22m
packages/blocks build: [34mℹ[39m 10 files, total: 239.45 kB
packages/blocks build: [32m✔[39m Build complete in [32m2228ms[39m
packages/blocks build: Done
packages/registry-lexicons build: $ tsdown
packages/registry-lexicons build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/registry-lexicons build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-lexicons/tsdown.config.ts[24m
packages/registry-lexicons build: [34mℹ[39m entry: [34msrc/index.ts, src/generated/types/com/emdashcms/experimental/aggregator/defs.ts, src/generated/types/com/emdashcms/experimental/aggregator/getLatestRelease.ts, src/generated/types/com/emdashcms/experimental/aggregator/getPackage.ts, src/generated/types/com/emdashcms/experimental/aggregator/listReleases.ts, src/generated/types/com/emdashcms/experimental/aggregator/resolvePackage.ts, src/generated/types/com/emdashcms/experimental/aggregator/searchPackages.ts, src/generated/types/com/emdashcms/experimental/package/profile.ts, src/generated/types/com/emdashcms/experimental/package/release.ts, src/generated/types/com/emdashcms/experimental/package/releaseExtension.ts, src/generated/types/com/emdashcms/experimental/publisher/profile.ts, src/generated/types/com/emdashcms/experimental/publisher/verification.ts[39m
packages/registry-lexicons build: [34mℹ[39m target: [34mes2023[39m
packages/registry-lexicons build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/registry-lexicons build: [34mℹ[39m Build start
packages/registry-lexicons build: [34mℹ[39m Cleaning 57 files
packages/x402 build: [34mℹ[39m [2mdist/[22m[1mmiddleware.mjs[22m           [2m 6.17 kB[22m [2m│ gzip: 2.21 kB[22m
packages/x402 build: [34mℹ[39m [2mdist/[22m[1mindex.mjs[22m                [2m 0.90 kB[22m [2m│ gzip: 0.47 kB[22m
packages/x402 build: [34mℹ[39m [2mdist/[22mserver-BKVUFgbf.mjs.map  [2m12.72 kB[22m [2m│ gzip: 4.15 kB[22m
packages/x402 build: [34mℹ[39m [2mdist/[22mmiddleware.mjs.map       [2m11.59 kB[22m [2m│ gzip: 3.91 kB[22m
packages/x402 build: [34mℹ[39m [2mdist/[22mserver-BKVUFgbf.mjs      [2m 5.41 kB[22m [2m│ gzip: 2.04 kB[22m
packages/x402 build: [34mℹ[39m [2mdist/[22mindex.mjs.map            [2m 3.29 kB[22m [2m│ gzip: 1.36 kB[22m
packages/x402 build: [34mℹ[39m [2mdist/[22mindex.d.mts.map          [2m 1.01 kB[22m [2m│ gzip: 0.49 kB[22m
packages/x402 build: [34mℹ[39m [2mdist/[22mmiddleware.d.mts.map     [2m 0.12 kB[22m [2m│ gzip: 0.12 kB[22m
packages/x402 build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.mts[22m[39m              [2m 4.73 kB[22m [2m│ gzip: 1.83 kB[22m
packages/x402 build: [34mℹ[39m [2mdist/[22m[32m[1mmiddleware.d.mts[22m[39m         [2m 0.38 kB[22m [2m│ gzip: 0.26 kB[22m
packages/x402 build: [34mℹ[39m 10 files, total: 46.34 kB
packages/x402 build: [32m✔[39m Build complete in [32m1260ms[39m
packages/x402 build: Done
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/package/releaseExtension.js[22m           [2m 5.50 kB[22m [2m│ gzip: 0.86 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/package/profile.js[22m                    [2m 4.45 kB[22m [2m│ gzip: 0.78 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/package/release.js[22m                    [2m 4.01 kB[22m [2m│ gzip: 0.78 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[1mindex.js[22m                                                                         [2m 3.85 kB[22m [2m│ gzip: 1.00 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/aggregator/defs.js[22m                    [2m 2.53 kB[22m [2m│ gzip: 0.64 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/publisher/profile.js[22m                  [2m 2.01 kB[22m [2m│ gzip: 0.58 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/aggregator/searchPackages.js[22m          [2m 1.55 kB[22m [2m│ gzip: 0.53 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/aggregator/listReleases.js[22m            [2m 1.41 kB[22m [2m│ gzip: 0.53 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/publisher/verification.js[22m             [2m 0.99 kB[22m [2m│ gzip: 0.45 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/aggregator/getLatestRelease.js[22m        [2m 0.87 kB[22m [2m│ gzip: 0.44 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/aggregator/resolvePackage.js[22m          [2m 0.86 kB[22m [2m│ gzip: 0.44 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/aggregator/getPackage.js[22m              [2m 0.84 kB[22m [2m│ gzip: 0.44 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/package/release.js.map                [2m11.34 kB[22m [2m│ gzip: 3.07 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/package/releaseExtension.js.map       [2m11.30 kB[22m [2m│ gzip: 2.06 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/package/profile.js.map                [2m10.94 kB[22m [2m│ gzip: 2.32 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/aggregator/defs.js.map                [2m 6.74 kB[22m [2m│ gzip: 1.81 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22mindex.js.map                                                                     [2m 6.29 kB[22m [2m│ gzip: 1.85 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/publisher/profile.js.map              [2m 4.96 kB[22m [2m│ gzip: 1.56 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/aggregator/searchPackages.js.map      [2m 3.95 kB[22m [2m│ gzip: 1.27 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/aggregator/listReleases.js.map        [2m 3.40 kB[22m [2m│ gzip: 1.11 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/publisher/verification.js.map         [2m 2.91 kB[22m [2m│ gzip: 1.14 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/package/releaseExtension.d.ts.map     [2m 2.29 kB[22m [2m│ gzip: 0.67 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/aggregator/resolvePackage.js.map      [2m 1.85 kB[22m [2m│ gzip: 0.79 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/aggregator/getLatestRelease.js.map    [2m 1.83 kB[22m [2m│ gzip: 0.78 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/aggregator/getPackage.js.map          [2m 1.80 kB[22m [2m│ gzip: 0.77 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/package/release.d.ts.map              [2m 1.01 kB[22m [2m│ gzip: 0.40 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/package/profile.d.ts.map              [2m 1.00 kB[22m [2m│ gzip: 0.42 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/publisher/profile.d.ts.map            [2m 0.61 kB[22m [2m│ gzip: 0.32 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/aggregator/defs.d.ts.map              [2m 0.59 kB[22m [2m│ gzip: 0.27 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/aggregator/searchPackages.d.ts.map    [2m 0.51 kB[22m [2m│ gzip: 0.28 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/aggregator/listReleases.d.ts.map      [2m 0.50 kB[22m [2m│ gzip: 0.28 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/aggregator/getLatestRelease.d.ts.map  [2m 0.48 kB[22m [2m│ gzip: 0.28 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/aggregator/resolvePackage.d.ts.map    [2m 0.48 kB[22m [2m│ gzip: 0.28 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/aggregator/getPackage.d.ts.map        [2m 0.47 kB[22m [2m│ gzip: 0.28 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/publisher/verification.d.ts.map       [2m 0.44 kB[22m [2m│ gzip: 0.27 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22mchunk-BYypO7fO.js                                                                [2m 0.38 kB[22m [2m│ gzip: 0.26 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22mindex.d.ts.map                                                                   [2m 0.35 kB[22m [2m│ gzip: 0.21 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[32m[1mgenerated/types/com/emdashcms/experimental/package/releaseExtension.d.ts[22m[39m         [2m 9.12 kB[22m [2m│ gzip: 1.61 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[32m[1mgenerated/types/com/emdashcms/experimental/package/release.d.ts[22m[39m                  [2m 8.37 kB[22m [2m│ gzip: 2.45 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[32m[1mgenerated/types/com/emdashcms/experimental/package/profile.d.ts[22m[39m                  [2m 7.34 kB[22m [2m│ gzip: 1.68 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.ts[22m[39m                                                                       [2m 5.22 kB[22m [2m│ gzip: 1.34 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[32m[1mgenerated/types/com/emdashcms/experimental/aggregator/defs.d.ts[22m[39m                  [2m 5.12 kB[22m [2m│ gzip: 1.44 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[32m[1mgenerated/types/com/emdashcms/experimental/publisher/profile.d.ts[22m[39m                [2m 3.47 kB[22m [2m│ gzip: 1.16 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[32m[1mgenerated/types/com/emdashcms/experimental/aggregator/searchPackages.d.ts[22m[39m        [2m 2.48 kB[22m [2m│ gzip: 0.94 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[32m[1mgenerated/types/com/emdashcms/experimental/publisher/verification.d.ts[22m[39m           [2m 2.38 kB[22m [2m│ gzip: 0.96 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[32m[1mgenerated/types/com/emdashcms/experimental/aggregator/listReleases.d.ts[22m[39m          [2m 2.07 kB[22m [2m│ gzip: 0.80 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[32m[1mgenerated/types/com/emdashcms/experimental/aggregator/resolvePackage.d.ts[22m[39m        [2m 1.26 kB[22m [2m│ gzip: 0.59 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[32m[1mgenerated/types/com/emdashcms/experimental/aggregator/getLatestRelease.d.ts[22m[39m      [2m 1.25 kB[22m [2m│ gzip: 0.58 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[32m[1mgenerated/types/com/emdashcms/experimental/aggregator/getPackage.d.ts[22m[39m            [2m 1.20 kB[22m [2m│ gzip: 0.57 kB[22m
packages/registry-lexicons build: [34mℹ[39m 49 files, total: 154.54 kB
packages/registry-lexicons build: [32m✔[39m Build complete in [32m796ms[39m
packages/registry-lexicons build: Done
packages/blocks/playground build$ vite build
packages/registry-client build$ tsdown
packages/registry-client build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/registry-client build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-client/tsdown.config.ts[24m
packages/registry-client build: [34mℹ[39m entry: [34msrc/index.ts, src/credentials/index.ts, src/discovery/index.ts, src/publishing/index.ts[39m
packages/registry-client build: [34mℹ[39m target: [34mnode22[39m
packages/registry-client build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/registry-client build: [34mℹ[39m Build start
packages/registry-client build: [34mℹ[39m Cleaning 23 files
packages/blocks/playground build: vite v6.4.1 building for production...
packages/blocks/playground build: transforming...
packages/registry-client build: [34mℹ[39m [2mdist/[22m[1mdiscovery/index.js[22m          [2m 6.51 kB[22m [2m│ gzip: 2.58 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[1mpublishing/index.js[22m         [2m 5.04 kB[22m [2m│ gzip: 1.73 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[1mcredentials/index.js[22m        [2m 1.65 kB[22m [2m│ gzip: 0.74 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[1mindex.js[22m                    [2m 0.57 kB[22m [2m│ gzip: 0.22 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mmemory-DFUebEv3.js.map      [2m25.98 kB[22m [2m│ gzip: 8.65 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mpublishing/index.js.map     [2m14.70 kB[22m [2m│ gzip: 4.44 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mdiscovery/index.js.map      [2m11.96 kB[22m [2m│ gzip: 4.19 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mmemory-DFUebEv3.js          [2m11.32 kB[22m [2m│ gzip: 4.14 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mcredentials/index.js.map    [2m 2.23 kB[22m [2m│ gzip: 0.95 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mpublishing/index.d.ts.map   [2m 1.59 kB[22m [2m│ gzip: 0.56 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mmemory-BJDHdZ1M.d.ts.map    [2m 1.12 kB[22m [2m│ gzip: 0.37 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mdiscovery/index.d.ts.map    [2m 1.02 kB[22m [2m│ gzip: 0.42 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mtypes-CVqU18IH.d.ts.map     [2m 0.58 kB[22m [2m│ gzip: 0.30 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mcredentials/index.d.ts.map  [2m 0.16 kB[22m [2m│ gzip: 0.14 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[32m[1mdiscovery/index.d.ts[22m[39m        [2m 6.11 kB[22m [2m│ gzip: 2.40 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[32m[1mpublishing/index.d.ts[22m[39m       [2m 5.79 kB[22m [2m│ gzip: 2.03 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[32m[1mcredentials/index.d.ts[22m[39m      [2m 1.13 kB[22m [2m│ gzip: 0.53 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.ts[22m[39m                  [2m 0.94 kB[22m [2m│ gzip: 0.32 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[32mtypes-CVqU18IH.d.ts[39m         [2m 3.66 kB[22m [2m│ gzip: 1.65 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[32mmemory-BJDHdZ1M.d.ts[39m        [2m 1.94 kB[22m [2m│ gzip: 0.60 kB[22m
packages/registry-client build: [34mℹ[39m 20 files, total: 103.99 kB
packages/registry-client build: [32m✔[39m Build complete in [32m776ms[39m
packages/registry-client build: Done
packages/blocks/playground build: ✓ 5241 modules transformed.
packages/blocks/playground build: rendering chunks...
packages/blocks/playground build: computing gzip size...
packages/blocks/playground build: dist/index.html                     0.40 kB │ gzip:   0.28 kB
packages/blocks/playground build: dist/assets/index-D8pXNJuf.css    136.92 kB │ gzip:  21.83 kB
packages/blocks/playground build: dist/assets/index-DNIjwPqS.js   1,235.87 kB │ gzip: 397.50 kB
packages/blocks/playground build: ✓ built in 5.32s
packages/blocks/playground build: (!) Some chunks are larger than 500 kB after minification. Consider:
packages/blocks/playground build: - Using dynamic import() to code-split the application
packages/blocks/playground build: - Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
packages/blocks/playground build: - Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
packages/blocks/playground build: Done
packages/admin build$ node --run locale:compile && tsdown && node --run locale:copy && npx @tailwindcss/cli -i src/styles.css -o dist/styles.css --minify
packages/plugin-cli build$ node --run gen-schema && tsdown
packages/plugin-cli build: Wrote /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugin-cli/schemas/emdash-plugin.schema.json
packages/admin build: Compiling message catalogs…
packages/plugin-cli build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/plugin-cli build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugin-cli/tsdown.config.ts[24m
packages/plugin-cli build: [34mℹ[39m entry: [34msrc/index.ts[39m
packages/plugin-cli build: [34mℹ[39m target: [34mnode22[39m
packages/plugin-cli build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugin-cli build: [34mℹ[39m entry: [34msrc/api.ts[39m
packages/plugin-cli build: [34mℹ[39m target: [34mnode22[39m
packages/plugin-cli build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugin-cli build: [34mℹ[39m Build start
packages/plugin-cli build: [34mℹ[39m Cleaning 5 files
packages/admin build: Done in 563ms
packages/admin build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/admin build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tsdown.config.ts[24m
packages/admin build: [34mℹ[39m entry: [34msrc/index.ts, src/locales/index.ts[39m
packages/admin build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/admin build: [34mℹ[39m Build start
packages/admin build: [34mℹ[39m Cleaning 78 files
packages/plugin-cli build: [34mℹ[39m Granting execute permission to [4mdist/index.mjs[24m
packages/plugin-cli build: [34mℹ[39m [2mdist/[22m[1mindex.mjs[22m  [2m247.04 kB[22m [2m│ gzip: 76.25 kB[22m
packages/plugin-cli build: [34mℹ[39m 1 files, total: 247.04 kB
packages/plugin-cli build: [32m✔[39m Build complete in [32m1169ms[39m
packages/plugin-cli build: [34mℹ[39m [2mdist/[22m[1mapi.mjs[22m        [2m 98.97 kB[22m [2m│ gzip: 30.73 kB[22m
packages/plugin-cli build: [34mℹ[39m [2mdist/[22mapi.mjs.map    [2m203.16 kB[22m [2m│ gzip: 55.38 kB[22m
packages/plugin-cli build: [34mℹ[39m [2mdist/[22mapi.d.mts.map  [2m  3.23 kB[22m [2m│ gzip:  1.17 kB[22m
packages/plugin-cli build: [34mℹ[39m [2mdist/[22m[32m[1mapi.d.mts[22m[39m      [2m 14.51 kB[22m [2m│ gzip:  4.80 kB[22m
packages/plugin-cli build: [34mℹ[39m 4 files, total: 319.87 kB
packages/plugin-cli build: [32m✔[39m Build complete in [32m1205ms[39m
packages/plugin-cli build: Done
packages/admin build: [34mℹ[39m [2mdist/[22m[1mindex.js[22m                                 [2m1212.60 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22m[1mlocales/index.js[22m                         [2m   0.42 kB[22m [2m│ gzip:  0.21 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mindex.js.map                             [2m1924.70 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-qYhBOhtE.js.map                 [2m 113.57 kB[22m [2m│ gzip: 30.43 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-Dv_Ubjzx.js.map                 [2m 111.77 kB[22m [2m│ gzip: 30.43 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-BMFLZDHo.js.map                 [2m 106.55 kB[22m [2m│ gzip: 30.80 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-DW1BWiJ5.js.map                 [2m  99.31 kB[22m [2m│ gzip: 29.78 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-CA-O-TjM.js.map                 [2m  98.72 kB[22m [2m│ gzip: 30.13 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-qYhBOhtE.js                     [2m  98.39 kB[22m [2m│ gzip: 29.22 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-Dv_Ubjzx.js                     [2m  96.15 kB[22m [2m│ gzip: 29.36 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-BWDz4uQu.js.map                 [2m  93.52 kB[22m [2m│ gzip: 29.77 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-CX3dih9c.js.map                 [2m  92.94 kB[22m [2m│ gzip: 29.13 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-BMFLZDHo.js                     [2m  91.52 kB[22m [2m│ gzip: 29.73 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-rxCTcw_6.js.map                 [2m  91.21 kB[22m [2m│ gzip: 29.52 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-hYPn9ilH.js.map                 [2m  90.06 kB[22m [2m│ gzip: 29.87 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-BXt6OWYC.js.map                 [2m  89.37 kB[22m [2m│ gzip: 28.90 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-B4SjKBpv.js.map                 [2m  84.98 kB[22m [2m│ gzip: 28.10 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-DKO6LBEg.js.map                 [2m  84.26 kB[22m [2m│ gzip: 26.56 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-DW1BWiJ5.js                     [2m  84.20 kB[22m [2m│ gzip: 28.48 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-B1vNWgt7.js.map                 [2m  84.11 kB[22m [2m│ gzip: 27.57 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-Cz2f6Su-.js.map                 [2m  83.65 kB[22m [2m│ gzip: 26.85 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-CA-O-TjM.js                     [2m  83.59 kB[22m [2m│ gzip: 29.00 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-DpMKfmmV.js.map                 [2m  82.82 kB[22m [2m│ gzip: 29.29 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-xPgX6gCQ.js.map                 [2m  82.52 kB[22m [2m│ gzip: 27.91 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-BWDz4uQu.js                     [2m  78.32 kB[22m [2m│ gzip: 28.66 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-CX3dih9c.js                     [2m  77.82 kB[22m [2m│ gzip: 27.91 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-rxCTcw_6.js                     [2m  76.02 kB[22m [2m│ gzip: 28.28 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-hYPn9ilH.js                     [2m  74.63 kB[22m [2m│ gzip: 28.60 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-BXt6OWYC.js                     [2m  74.20 kB[22m [2m│ gzip: 27.70 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-B4SjKBpv.js                     [2m  69.81 kB[22m [2m│ gzip: 26.86 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-DKO6LBEg.js                     [2m  69.57 kB[22m [2m│ gzip: 25.33 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-B1vNWgt7.js                     [2m  68.93 kB[22m [2m│ gzip: 26.30 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-Cz2f6Su-.js                     [2m  68.47 kB[22m [2m│ gzip: 25.54 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-DpMKfmmV.js                     [2m  67.64 kB[22m [2m│ gzip: 28.11 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-xPgX6gCQ.js                     [2m  67.33 kB[22m [2m│ gzip: 26.78 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mindex.d.ts.map                           [2m  33.93 kB[22m [2m│ gzip:  7.61 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mLocaleDirectionProvider-DCXEekGc.js.map  [2m  14.98 kB[22m [2m│ gzip:  5.20 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mplugins-BZzztFdK.js.map                  [2m  11.13 kB[22m [2m│ gzip:  3.74 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mLocaleDirectionProvider-DCXEekGc.js      [2m   8.93 kB[22m [2m│ gzip:  3.16 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mplugins-BZzztFdK.js                      [2m   3.95 kB[22m [2m│ gzip:  1.50 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mconfig-ZP4qGbGk.d.ts.map                 [2m   0.70 kB[22m [2m│ gzip:  0.38 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.ts[22m[39m                               [2m 122.35 kB[22m [2m│ gzip: 22.77 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22m[32m[1mlocales/index.d.ts[22m[39m                       [2m   0.47 kB[22m [2m│ gzip:  0.24 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22m[32mconfig-ZP4qGbGk.d.ts[39m                     [2m   2.97 kB[22m [2m│ gzip:  1.25 kB[22m
packages/admin build: [34mℹ[39m 44 files, total: 6073.04 kB
packages/admin build: [32m✔[39m Build complete in [32m4593ms[39m
packages/admin build: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugins. Here is a breakdown:
packages/admin build:   - rolldown-plugin-dts:generate (59%)
packages/admin build:   - tsdown:external (25%)
packages/admin build: See https://rolldown.rs/options/checks#plugintimings for more details.
packages/admin build: ≈ tailwindcss v4.1.18
packages/admin build: Done in 358ms
packages/admin build: Done
packages/core build$ tsdown
packages/core build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/core build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/core/tsdown.config.ts[24m
packages/core build: [34mℹ[39m entry: [34msrc/index.ts, src/request-context.ts, src/astro/index.ts, src/astro/middleware.ts, src/astro/middleware/setup.ts, src/astro/middleware/auth.ts, src/astro/middleware/redirect.ts, src/astro/middleware/request-context.ts, src/astro/types.ts, src/db/index.ts, src/db/sqlite.ts, src/db/libsql.ts, src/db/postgres.ts, src/database/instrumentation.ts, src/storage/local.ts, src/storage/s3.ts, src/media/index.ts, src/media/local-runtime.ts, src/runtime.ts, src/seed/index.ts, src/cli/index.ts, src/client/index.ts, src/client/cf-access.ts, src/seo/index.ts, src/page/index.ts, src/plugin-utils.ts, src/plugin-types.ts, src/plugins/adapt-sandbox-entry.ts, src/api/route-utils.ts, src/api/schemas/index.ts, src/auth/providers/github.ts, src/auth/providers/google.ts[39m
packages/core build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/core build: [34mℹ[39m Build start
packages/core build: [34mℹ[39m Cleaning 1088 files
packages/core build: [34mℹ[39m Granting execute permission to [4mdist/cli/index.mjs[24m
packages/core build: [34mℹ[39m [2mdist/[22m[1mcli/index.mjs[22m                                                            [2m140.16 kB[22m [2m│ gzip: 35.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/middleware.mjs[22m                                                     [2m 95.65 kB[22m [2m│ gzip: 24.64 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/openapi.json.mjs[22m                                        [2m 90.30 kB[22m [2m│ gzip: 14.40 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/mcp.mjs[22m                                                 [2m 67.85 kB[22m [2m│ gzip: 15.05 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/index.mjs[22m                                                          [2m 62.20 kB[22m [2m│ gzip: 14.46 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/middleware/request-context.mjs[22m                                     [2m 41.28 kB[22m [2m│ gzip: 10.36 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/execute.mjs[22m                            [2m 26.43 kB[22m [2m│ gzip:  8.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/middleware/auth.mjs[22m                                                [2m 21.70 kB[22m [2m│ gzip:  5.99 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mpage/index.mjs[22m                                                           [2m 13.75 kB[22m [2m│ gzip:  4.05 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mclient/index.mjs[22m                                                         [2m 12.89 kB[22m [2m│ gzip:  3.52 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/authorize.mjs[22m                                     [2m 11.85 kB[22m [2m│ gzip:  3.50 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/analyze.mjs[22m                            [2m  9.96 kB[22m [2m│ gzip:  3.36 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/snapshot.mjs[22m                                            [2m  9.27 kB[22m [2m│ gzip:  3.56 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mindex.mjs[22m                                                                [2m  8.44 kB[22m [2m│ gzip:  2.57 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/comments/_collection_/_contentId_/index.mjs[22m             [2m  8.32 kB[22m [2m│ gzip:  2.57 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress-plugin/execute.mjs[22m                     [2m  8.06 kB[22m [2m│ gzip:  2.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mapi/schemas/index.mjs[22m                                                    [2m  7.95 kB[22m [2m│ gzip:  1.88 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mstorage/s3.mjs[22m                                                           [2m  7.78 kB[22m [2m│ gzip:  2.79 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/media.mjs[22m                              [2m  6.55 kB[22m [2m│ gzip:  2.13 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mplugins/adapt-sandbox-entry.mjs[22m                                          [2m  5.86 kB[22m [2m│ gzip:  2.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/media.mjs[22m                                               [2m  5.73 kB[22m [2m│ gzip:  2.11 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/oauth/_provider_/callback.mjs[22m                      [2m  5.73 kB[22m [2m│ gzip:  2.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mclient/cf-access.mjs[22m                                                     [2m  5.69 kB[22m [2m│ gzip:  2.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mstorage/local.mjs[22m                                                        [2m  5.56 kB[22m [2m│ gzip:  2.04 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/rewrite-urls.mjs[22m                       [2m  5.51 kB[22m [2m│ gzip:  1.80 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_.mjs[22m                           [2m  5.01 kB[22m [2m│ gzip:  1.43 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/dev-bypass.mjs[22m                                    [2m  5.00 kB[22m [2m│ gzip:  1.99 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/token.mjs[22m                                         [2m  4.98 kB[22m [2m│ gzip:  1.69 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/sitemap-_collection_.xml.mjs[22m                                [2m  4.90 kB[22m [2m│ gzip:  1.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/register.mjs[22m                                      [2m  4.42 kB[22m [2m│ gzip:  1.65 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/_id_/index.mjs[22m                              [2m  4.36 kB[22m [2m│ gzip:  1.45 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/prepare.mjs[22m                            [2m  4.34 kB[22m [2m│ gzip:  1.62 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/settings/email.mjs[22m                                      [2m  4.32 kB[22m [2m│ gzip:  1.72 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs[22m          [2m  4.16 kB[22m [2m│ gzip:  1.39 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/rewrite-url-helpers.mjs[22m                [2m  4.02 kB[22m [2m│ gzip:  1.41 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mmedia/local-runtime.mjs[22m                                                  [2m  3.75 kB[22m [2m│ gzip:  1.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/_slug_/index.mjs[22m                     [2m  3.74 kB[22m [2m│ gzip:  1.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/index.mjs[22m                                         [2m  3.71 kB[22m [2m│ gzip:  1.40 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/admin-verify.mjs[22m                                  [2m  3.68 kB[22m [2m│ gzip:  1.39 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs[22m        [2m  3.65 kB[22m [2m│ gzip:  1.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/_name_/widgets/_id_.mjs[22m                    [2m  3.64 kB[22m [2m│ gzip:  1.10 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/registry/install.mjs[22m                      [2m  3.55 kB[22m [2m│ gzip:  1.36 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/upload-url.mjs[22m                                    [2m  3.53 kB[22m [2m│ gzip:  1.46 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/registry/_id_/update.mjs[22m                  [2m  3.52 kB[22m [2m│ gzip:  1.28 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/marketplace/_id_/install.mjs[22m              [2m  3.52 kB[22m [2m│ gzip:  1.30 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/register/verify.mjs[22m                        [2m  3.51 kB[22m [2m│ gzip:  1.35 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/_id_/status.mjs[22m                          [2m  3.48 kB[22m [2m│ gzip:  1.30 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/taxonomies/_name_/terms/_slug_/translations.mjs[22m         [2m  3.47 kB[22m [2m│ gzip:  1.12 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/_id_.mjs[22m                                          [2m  3.42 kB[22m [2m│ gzip:  1.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/taxonomies/_name_/terms/_slug_.mjs[22m                      [2m  3.42 kB[22m [2m│ gzip:  0.96 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/update.mjs[22m                           [2m  3.23 kB[22m [2m│ gzip:  1.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/schedule.mjs[22m                  [2m  3.19 kB[22m [2m│ gzip:  1.00 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/preview-url.mjs[22m               [2m  3.19 kB[22m [2m│ gzip:  1.32 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/providers/_providerId_/index.mjs[22m                  [2m  3.15 kB[22m [2m│ gzip:  1.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/_slug_/fields/index.mjs[22m              [2m  3.12 kB[22m [2m│ gzip:  0.99 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/bylines/_id_/index.mjs[22m                            [2m  3.09 kB[22m [2m│ gzip:  0.97 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/updates.mjs[22m                               [2m  3.08 kB[22m [2m│ gzip:  1.12 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/admin.mjs[22m                                         [2m  3.06 kB[22m [2m│ gzip:  1.23 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/registry/_id_/uninstall.mjs[22m               [2m  3.03 kB[22m [2m│ gzip:  1.09 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/index.mjs[22m                          [2m  3.02 kB[22m [2m│ gzip:  1.13 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/bylines/index.mjs[22m                                 [2m  3.02 kB[22m [2m│ gzip:  1.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/oauth/_provider_.mjs[22m                               [2m  3.00 kB[22m [2m│ gzip:  1.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/oauth-clients/_id_.mjs[22m                            [2m  3.00 kB[22m [2m│ gzip:  0.97 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/plugins/_pluginId_/_...path_.mjs[22m                        [2m  2.96 kB[22m [2m│ gzip:  1.32 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/middleware/redirect.mjs[22m                                            [2m  2.93 kB[22m [2m│ gzip:  1.24 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/themes/marketplace/index.mjs[22m                      [2m  2.92 kB[22m [2m│ gzip:  1.10 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/uninstall.mjs[22m                        [2m  2.92 kB[22m [2m│ gzip:  1.09 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/bylines/_id_/translations.mjs[22m                     [2m  2.92 kB[22m [2m│ gzip:  1.11 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/enable.mjs[22m                           [2m  2.91 kB[22m [2m│ gzip:  1.07 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/index.mjs[22m                            [2m  2.86 kB[22m [2m│ gzip:  0.98 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/allowed-domains/_domain_.mjs[22m                      [2m  2.85 kB[22m [2m│ gzip:  0.98 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/publish.mjs[22m                   [2m  2.80 kB[22m [2m│ gzip:  1.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/redirects/_id_.mjs[22m                                      [2m  2.79 kB[22m [2m│ gzip:  0.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/_id_.mjs[22m                                   [2m  2.77 kB[22m [2m│ gzip:  0.98 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/signup/complete.mjs[22m                                [2m  2.77 kB[22m [2m│ gzip:  1.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/_slug_/fields/reorder.mjs[22m            [2m  2.77 kB[22m [2m│ gzip:  0.95 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/allowed-domains/index.mjs[22m                         [2m  2.76 kB[22m [2m│ gzip:  1.05 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/invite/complete.mjs[22m                                [2m  2.75 kB[22m [2m│ gzip:  1.13 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/marketplace/index.mjs[22m                     [2m  2.74 kB[22m [2m│ gzip:  1.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/disable.mjs[22m                          [2m  2.73 kB[22m [2m│ gzip:  1.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/dev-bypass.mjs[22m                                     [2m  2.72 kB[22m [2m│ gzip:  1.27 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress-plugin/analyze.mjs[22m                     [2m  2.71 kB[22m [2m│ gzip:  1.13 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/typegen.mjs[22m                                             [2m  2.66 kB[22m [2m│ gzip:  1.06 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_/translations.mjs[22m                           [2m  2.65 kB[22m [2m│ gzip:  0.93 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mplugin-utils.mjs[22m                                                         [2m  2.63 kB[22m [2m│ gzip:  1.21 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/orphans/_slug_.mjs[22m                               [2m  2.63 kB[22m [2m│ gzip:  1.00 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/marketplace/_id_/index.mjs[22m                [2m  2.60 kB[22m [2m│ gzip:  0.94 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/options.mjs[22m                                [2m  2.59 kB[22m [2m│ gzip:  1.07 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/themes/marketplace/_id_/index.mjs[22m                 [2m  2.58 kB[22m [2m│ gzip:  0.94 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/register/options.mjs[22m                       [2m  2.57 kB[22m [2m│ gzip:  1.06 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/sections/_slug_.mjs[22m                                     [2m  2.57 kB[22m [2m│ gzip:  0.78 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/index.mjs[22m                                        [2m  2.54 kB[22m [2m│ gzip:  1.11 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mseo/index.mjs[22m                                                            [2m  2.53 kB[22m [2m│ gzip:  1.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/index.mjs[22m                                  [2m  2.52 kB[22m [2m│ gzip:  1.00 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/taxonomies/_name_/terms/index.mjs[22m                       [2m  2.52 kB[22m [2m│ gzip:  0.90 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mdatabase/instrumentation.mjs[22m                                             [2m  2.51 kB[22m [2m│ gzip:  1.22 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/index.mjs[22m                            [2m  2.49 kB[22m [2m│ gzip:  0.94 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/redirects/404s/index.mjs[22m                                [2m  2.47 kB[22m [2m│ gzip:  0.80 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/verify.mjs[22m                                 [2m  2.46 kB[22m [2m│ gzip:  1.01 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/_id_/confirm.mjs[22m                                  [2m  2.43 kB[22m [2m│ gzip:  1.07 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_.mjs[22m                                        [2m  2.40 kB[22m [2m│ gzip:  0.74 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/sitemap.xml.mjs[22m                                             [2m  2.40 kB[22m [2m│ gzip:  1.10 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/magic-link/send.mjs[22m                                [2m  2.40 kB[22m [2m│ gzip:  0.98 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/status.mjs[22m                                        [2m  2.39 kB[22m [2m│ gzip:  1.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/hooks/exclusive/_hookName_.mjs[22m                    [2m  2.36 kB[22m [2m│ gzip:  1.04 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/providers/_providerId_/_itemId_.mjs[22m               [2m  2.36 kB[22m [2m│ gzip:  0.78 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/_name_/widgets.mjs[22m                         [2m  2.35 kB[22m [2m│ gzip:  1.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/invite/index.mjs[22m                                   [2m  2.31 kB[22m [2m│ gzip:  1.06 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/invite/register-options.mjs[22m                        [2m  2.31 kB[22m [2m│ gzip:  1.00 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/index.mjs[22m                                 [2m  2.27 kB[22m [2m│ gzip:  0.89 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/settings.mjs[22m                                            [2m  2.27 kB[22m [2m│ gzip:  0.91 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/signup/request.mjs[22m                                 [2m  2.26 kB[22m [2m│ gzip:  0.98 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_/items/_id_.mjs[22m                             [2m  2.23 kB[22m [2m│ gzip:  0.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/taxonomies/index.mjs[22m                                    [2m  2.22 kB[22m [2m│ gzip:  0.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/orphans/index.mjs[22m                                [2m  2.21 kB[22m [2m│ gzip:  0.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/oauth-clients/index.mjs[22m                           [2m  2.20 kB[22m [2m│ gzip:  0.90 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/themes/preview.mjs[22m                                      [2m  2.15 kB[22m [2m│ gzip:  0.98 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/_name_.mjs[22m                                 [2m  2.15 kB[22m [2m│ gzip:  0.79 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/rebuild.mjs[22m                                      [2m  2.14 kB[22m [2m│ gzip:  0.92 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/api-tokens/index.mjs[22m                              [2m  2.13 kB[22m [2m│ gzip:  0.93 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/redirects/index.mjs[22m                                     [2m  2.12 kB[22m [2m│ gzip:  0.78 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/_id_/send-recovery.mjs[22m                      [2m  2.03 kB[22m [2m│ gzip:  0.97 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/device/token.mjs[22m                                  [2m  2.01 kB[22m [2m│ gzip:  0.94 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/index.mjs[22m                                        [2m  2.00 kB[22m [2m│ gzip:  0.94 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/index.mjs[22m                                   [2m  1.99 kB[22m [2m│ gzip:  0.94 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/enable.mjs[22m                                       [2m  1.97 kB[22m [2m│ gzip:  0.86 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/_id_/disable.mjs[22m                            [2m  1.96 kB[22m [2m│ gzip:  0.90 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/sections/index.mjs[22m                                      [2m  1.93 kB[22m [2m│ gzip:  0.73 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/_name_/reorder.mjs[22m                         [2m  1.92 kB[22m [2m│ gzip:  0.87 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/robots.txt.mjs[22m                                              [2m  1.88 kB[22m [2m│ gzip:  0.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/middleware/setup.mjs[22m                                               [2m  1.86 kB[22m [2m│ gzip:  0.86 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/file/_...key_.mjs[22m                                 [2m  1.84 kB[22m [2m│ gzip:  0.95 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/duplicate.mjs[22m                 [2m  1.81 kB[22m [2m│ gzip:  0.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/device/code.mjs[22m                                   [2m  1.80 kB[22m [2m│ gzip:  0.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mrequest-context.mjs[22m                                                      [2m  1.76 kB[22m [2m│ gzip:  0.90 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mapi/route-utils.mjs[22m                                                      [2m  1.76 kB[22m [2m│ gzip:  0.83 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/restore.mjs[22m                   [2m  1.72 kB[22m [2m│ gzip:  0.74 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/discard-draft.mjs[22m             [2m  1.71 kB[22m [2m│ gzip:  0.74 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/_id_.mjs[22m                                 [2m  1.70 kB[22m [2m│ gzip:  0.66 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/unpublish.mjs[22m                 [2m  1.70 kB[22m [2m│ gzip:  0.73 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/suggest.mjs[22m                                      [2m  1.67 kB[22m [2m│ gzip:  0.82 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/index.mjs[22m                                         [2m  1.65 kB[22m [2m│ gzip:  0.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/magic-link/verify.mjs[22m                              [2m  1.65 kB[22m [2m│ gzip:  0.72 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/revisions/_revisionId_/restore.mjs[22m                      [2m  1.64 kB[22m [2m│ gzip:  0.70 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/translations.mjs[22m              [2m  1.58 kB[22m [2m│ gzip:  0.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs[22m             [2m  1.56 kB[22m [2m│ gzip:  0.75 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/manifest.mjs[22m                                            [2m  1.56 kB[22m [2m│ gzip:  0.80 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/marketplace/_id_/icon.mjs[22m                 [2m  1.54 kB[22m [2m│ gzip:  0.75 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/index.mjs[22m                                [2m  1.48 kB[22m [2m│ gzip:  0.68 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/bulk.mjs[22m                                 [2m  1.47 kB[22m [2m│ gzip:  0.66 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/hooks/exclusive/index.mjs[22m                         [2m  1.45 kB[22m [2m│ gzip:  0.72 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/redirects/404s/summary.mjs[22m                              [2m  1.45 kB[22m [2m│ gzip:  0.66 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/me.mjs[22m                                             [2m  1.44 kB[22m [2m│ gzip:  0.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_/reorder.mjs[22m                                [2m  1.43 kB[22m [2m│ gzip:  0.66 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_/items.mjs[22m                                  [2m  1.42 kB[22m [2m│ gzip:  0.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/probe.mjs[22m                                        [2m  1.37 kB[22m [2m│ gzip:  0.66 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/well-known/auth.mjs[22m                                     [2m  1.37 kB[22m [2m│ gzip:  0.66 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/device/authorize.mjs[22m                              [2m  1.34 kB[22m [2m│ gzip:  0.69 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/signup/verify.mjs[22m                                  [2m  1.32 kB[22m [2m│ gzip:  0.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mruntime.mjs[22m                                                              [2m  1.32 kB[22m [2m│ gzip:  0.64 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/invite/accept.mjs[22m                                  [2m  1.28 kB[22m [2m│ gzip:  0.68 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/_id_/enable.mjs[22m                             [2m  1.28 kB[22m [2m│ gzip:  0.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/api-tokens/_id_.mjs[22m                               [2m  1.24 kB[22m [2m│ gzip:  0.66 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mdb/index.mjs[22m                                                             [2m  1.22 kB[22m [2m│ gzip:  0.56 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/token/refresh.mjs[22m                                 [2m  1.19 kB[22m [2m│ gzip:  0.62 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/well-known/oauth-authorization-server.mjs[22m               [2m  1.18 kB[22m [2m│ gzip:  0.59 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mmedia/index.mjs[22m                                                          [2m  1.18 kB[22m [2m│ gzip:  0.59 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/trash.mjs[22m                          [2m  1.16 kB[22m [2m│ gzip:  0.57 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/token/revoke.mjs[22m                                  [2m  1.14 kB[22m [2m│ gzip:  0.60 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/index.mjs[22m                                  [2m  1.07 kB[22m [2m│ gzip:  0.60 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/revisions.mjs[22m                 [2m  1.04 kB[22m [2m│ gzip:  0.56 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/stats.mjs[22m                                        [2m  1.03 kB[22m [2m│ gzip:  0.56 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/permanent.mjs[22m                 [2m  1.02 kB[22m [2m│ gzip:  0.53 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/dev-reset.mjs[22m                                     [2m  1.01 kB[22m [2m│ gzip:  0.56 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/dashboard.mjs[22m                                           [2m  0.99 kB[22m [2m│ gzip:  0.53 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress-plugin/callback.mjs[22m                    [2m  0.97 kB[22m [2m│ gzip:  0.53 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/counts.mjs[22m                               [2m  0.95 kB[22m [2m│ gzip:  0.49 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/mode.mjs[22m                                           [2m  0.94 kB[22m [2m│ gzip:  0.56 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mseed/index.mjs[22m                                                           [2m  0.88 kB[22m [2m│ gzip:  0.40 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/compare.mjs[22m                   [2m  0.84 kB[22m [2m│ gzip:  0.47 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/dev/emails.mjs[22m                                          [2m  0.83 kB[22m [2m│ gzip:  0.41 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/logout.mjs[22m                                         [2m  0.81 kB[22m [2m│ gzip:  0.47 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/revisions/_revisionId_/index.mjs[22m                        [2m  0.78 kB[22m [2m│ gzip:  0.45 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/providers/index.mjs[22m                               [2m  0.77 kB[22m [2m│ gzip:  0.45 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/well-known/oauth-protected-resource.mjs[22m                 [2m  0.74 kB[22m [2m│ gzip:  0.46 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/PluginRegistry.mjs[22m                                          [2m  0.73 kB[22m [2m│ gzip:  0.41 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mdb/postgres.mjs[22m                                                          [2m  0.69 kB[22m [2m│ gzip:  0.36 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-components.mjs[22m                                   [2m  0.61 kB[22m [2m│ gzip:  0.36 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mdb/sqlite.mjs[22m                                                            [2m  0.52 kB[22m [2m│ gzip:  0.32 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mauth/providers/github.mjs[22m                                                [2m  0.44 kB[22m [2m│ gzip:  0.29 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mauth/providers/google.mjs[22m                                                [2m  0.44 kB[22m [2m│ gzip:  0.29 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mdb/libsql.mjs[22m                                                            [2m  0.44 kB[22m [2m│ gzip:  0.28 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/types.mjs[22m                                                          [2m  0.01 kB[22m [2m│ gzip:  0.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mplugin-types.mjs[22m                                                         [2m  0.01 kB[22m [2m│ gzip:  0.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mapi-CLwG_3dh.mjs.map                                                     [2m300.70 kB[22m [2m│ gzip: 65.00 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcli/index.mjs.map                                                        [2m279.18 kB[22m [2m│ gzip: 63.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrunner-CGlojznK.mjs.map                                                  [2m248.91 kB[22m [2m│ gzip: 46.33 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/middleware.mjs.map                                                 [2m212.30 kB[22m [2m│ gzip: 54.22 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmenus-BJHdFWhH.mjs.map                                                   [2m183.91 kB[22m [2m│ gzip: 40.93 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/openapi.json.mjs.map                                    [2m170.23 kB[22m [2m│ gzip: 23.57 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mapi-CLwG_3dh.mjs                                                         [2m142.04 kB[22m [2m│ gzip: 32.04 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/index.mjs.map                                                      [2m134.24 kB[22m [2m│ gzip: 32.05 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrunner-CGlojznK.mjs                                                      [2m129.47 kB[22m [2m│ gzip: 23.69 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/mcp.mjs.map                                             [2m126.22 kB[22m [2m│ gzip: 24.49 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mimport-DG80rC_I.mjs.map                                                  [2m112.07 kB[22m [2m│ gzip: 25.69 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mredirects-COMLwsV5.mjs.map                                               [2m 94.38 kB[22m [2m│ gzip: 15.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmenus-BJHdFWhH.mjs                                                       [2m 85.50 kB[22m [2m│ gzip: 19.61 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcontext-sAnCaUIR.mjs.map                                                 [2m 66.64 kB[22m [2m│ gzip: 15.80 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcontent-C0ooIs-f.mjs.map                                                 [2m 62.23 kB[22m [2m│ gzip: 13.27 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mapply-7BGAk1OC.mjs.map                                                   [2m 60.88 kB[22m [2m│ gzip: 15.23 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/execute.mjs.map                        [2m 59.52 kB[22m [2m│ gzip: 17.62 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mregistry-DqrAQDXH.mjs.map                                                [2m 54.01 kB[22m [2m│ gzip: 13.04 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmenus-Bjf5R1Qq.mjs.map                                                   [2m 50.90 kB[22m [2m│ gzip: 12.05 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/middleware/request-context.mjs.map                                 [2m 49.16 kB[22m [2m│ gzip: 12.37 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mimport-DG80rC_I.mjs                                                      [2m 48.70 kB[22m [2m│ gzip: 11.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mquery-DSGjG7Qa.mjs.map                                                   [2m 48.27 kB[22m [2m│ gzip: 14.61 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mredirects-COMLwsV5.mjs                                                   [2m 46.92 kB[22m [2m│ gzip:  9.49 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/middleware/auth.mjs.map                                            [2m 44.73 kB[22m [2m│ gzip: 12.39 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mloader-Chm5h7Gr.mjs.map                                                  [2m 40.46 kB[22m [2m│ gzip: 11.37 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mindex-C-Y4tcPk.d.mts.map                                                 [2m 36.26 kB[22m [2m│ gzip: 10.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtaxonomies-CZJfsjP8.mjs.map                                              [2m 34.53 kB[22m [2m│ gzip:  8.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbyline-CTaWkMh5.mjs.map                                                  [2m 33.46 kB[22m [2m│ gzip:  8.89 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mclient/index.mjs.map                                                     [2m 32.97 kB[22m [2m│ gzip:  7.93 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mredirects-B-CUZ1Xh.mjs.map                                               [2m 32.59 kB[22m [2m│ gzip:  8.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mvalidate-mz87i8_1.mjs.map                                                [2m 32.16 kB[22m [2m│ gzip:  6.86 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcontent-C0ooIs-f.mjs                                                     [2m 31.82 kB[22m [2m│ gzip:  7.33 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mpage/index.mjs.map                                                       [2m 31.02 kB[22m [2m│ gzip:  8.42 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mapply-7BGAk1OC.mjs                                                       [2m 30.10 kB[22m [2m│ gzip:  7.49 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdevice-flow-B9oG8PwP.mjs.map                                             [2m 29.83 kB[22m [2m│ gzip:  7.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcontext-sAnCaUIR.mjs                                                     [2m 28.49 kB[22m [2m│ gzip:  7.54 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mregistry-DqrAQDXH.mjs                                                    [2m 27.13 kB[22m [2m│ gzip:  6.93 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22merror-CPh_8eLq.mjs.map                                                   [2m 27.02 kB[22m [2m│ gzip:  6.38 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msearch-By-NN3da.mjs.map                                                  [2m 26.55 kB[22m [2m│ gzip:  8.21 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mredirect-CNv4mHX2.mjs.map                                                [2m 26.36 kB[22m [2m│ gzip:  6.98 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtransport-B6CHddbu.mjs.map                                               [2m 26.06 kB[22m [2m│ gzip:  7.48 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtaxonomies-Cm_lrGRG.mjs.map                                              [2m 25.55 kB[22m [2m│ gzip:  6.21 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msecrets-rPdhEBkD.mjs.map                                                 [2m 24.92 kB[22m [2m│ gzip:  8.49 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mfts-manager-Mnrtn-r2.mjs.map                                             [2m 24.82 kB[22m [2m│ gzip:  6.62 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mssrf-MZ-zrG6-.mjs.map                                                    [2m 23.59 kB[22m [2m│ gzip:  8.30 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mquery-DSGjG7Qa.mjs                                                       [2m 23.36 kB[22m [2m│ gzip:  7.62 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmenus-Bjf5R1Qq.mjs                                                       [2m 23.34 kB[22m [2m│ gzip:  5.93 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/authorize.mjs.map                                 [2m 22.43 kB[22m [2m│ gzip:  6.46 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/analyze.mjs.map                        [2m 22.30 kB[22m [2m│ gzip:  6.90 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtaxonomy-D4Uc2LsZ.mjs.map                                                [2m 21.42 kB[22m [2m│ gzip:  5.59 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcomment-_yzlBYPx.mjs.map                                                 [2m 20.47 kB[22m [2m│ gzip:  4.87 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/snapshot.mjs.map                                        [2m 19.86 kB[22m [2m│ gzip:  6.75 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mloader-Chm5h7Gr.mjs                                                      [2m 19.56 kB[22m [2m│ gzip:  5.83 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msections-DcBIlOq1.mjs.map                                                [2m 19.39 kB[22m [2m│ gzip:  4.78 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mzod-generator-dvxgmd1M.mjs.map                                           [2m 18.45 kB[22m [2m│ gzip:  5.43 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moauth-authorization-CTMeVfvj.mjs.map                                     [2m 17.99 kB[22m [2m│ gzip:  4.89 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbyline-CTaWkMh5.mjs                                                      [2m 17.77 kB[22m [2m│ gzip:  5.05 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22merror-CPh_8eLq.mjs                                                       [2m 17.13 kB[22m [2m│ gzip:  4.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mutils-C3wTAP-P.mjs.map                                                   [2m 16.93 kB[22m [2m│ gzip:  5.01 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-DGHWRQgr.d.mts.map                                                 [2m 16.93 kB[22m [2m│ gzip:  4.65 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcron-Bd3b3iuj.mjs.map                                                    [2m 16.65 kB[22m [2m│ gzip:  5.39 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/execute.mjs.map                 [2m 16.41 kB[22m [2m│ gzip:  5.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mredirects-B-CUZ1Xh.mjs                                                   [2m 16.07 kB[22m [2m│ gzip:  4.26 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/comments/_collection_/_contentId_/index.mjs.map         [2m 15.95 kB[22m [2m│ gzip:  4.89 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmedia-oqRcNiQf.mjs.map                                                   [2m 15.91 kB[22m [2m│ gzip:  4.75 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msettings-hcubRfkr.mjs.map                                                [2m 15.73 kB[22m [2m│ gzip:  5.04 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mvalidate-mz87i8_1.mjs                                                    [2m 15.70 kB[22m [2m│ gzip:  3.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtaxonomies-CZJfsjP8.mjs                                                  [2m 15.58 kB[22m [2m│ gzip:  3.76 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moauth-clients-eJCbkVSG.mjs.map                                           [2m 15.58 kB[22m [2m│ gzip:  3.61 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mstorage/s3.mjs.map                                                       [2m 15.38 kB[22m [2m│ gzip:  5.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtaxonomies-Cm_lrGRG.mjs                                                  [2m 14.94 kB[22m [2m│ gzip:  3.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdevice-flow-B9oG8PwP.mjs                                                 [2m 14.86 kB[22m [2m│ gzip:  3.83 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mplugins/adapt-sandbox-entry.mjs.map                                      [2m 14.69 kB[22m [2m│ gzip:  5.13 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mservice-BuuTdGAT.mjs.map                                                 [2m 14.62 kB[22m [2m│ gzip:  4.38 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbylines-DJBgjPbo.mjs.map                                                 [2m 14.10 kB[22m [2m│ gzip:  4.74 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mfts-manager-Mnrtn-r2.mjs                                                 [2m 13.79 kB[22m [2m│ gzip:  3.92 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msecrets-rPdhEBkD.mjs                                                     [2m 13.77 kB[22m [2m│ gzip:  5.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcomments-DxID-rsd.mjs.map                                                [2m 13.34 kB[22m [2m│ gzip:  3.37 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msearch-By-NN3da.mjs                                                      [2m 13.23 kB[22m [2m│ gzip:  4.32 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mssrf-MZ-zrG6-.mjs                                                        [2m 12.75 kB[22m [2m│ gzip:  5.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/media.mjs.map                          [2m 12.71 kB[22m [2m│ gzip:  3.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmanifest-schema-Czqf0TLu.mjs.map                                         [2m 12.21 kB[22m [2m│ gzip:  3.36 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mredirect-CNv4mHX2.mjs                                                    [2m 12.07 kB[22m [2m│ gzip:  3.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtransport-B6CHddbu.mjs                                                   [2m 12.05 kB[22m [2m│ gzip:  3.86 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/oauth/_provider_/callback.mjs.map                  [2m 11.29 kB[22m [2m│ gzip:  3.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mstorage/local.mjs.map                                                    [2m 11.26 kB[22m [2m│ gzip:  3.76 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/rewrite-urls.mjs.map                   [2m 11.19 kB[22m [2m│ gzip:  3.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mvalidation-DKHhXjPr.mjs.map                                              [2m 11.09 kB[22m [2m│ gzip:  4.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtaxonomy-D4Uc2LsZ.mjs                                                    [2m 10.92 kB[22m [2m│ gzip:  3.06 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22muser-D3BD5zdT.mjs.map                                                    [2m 10.46 kB[22m [2m│ gzip:  3.27 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtokens-N8otWMmj.mjs.map                                                  [2m 10.30 kB[22m [2m│ gzip:  3.28 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media.mjs.map                                           [2m 10.28 kB[22m [2m│ gzip:  3.57 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/sitemap-_collection_.xml.mjs.map                            [2m 10.23 kB[22m [2m│ gzip:  3.64 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msetup-Cf_TyOv5.mjs.map                                                   [2m 10.10 kB[22m [2m│ gzip:  1.99 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/token.mjs.map                                     [2m 10.07 kB[22m [2m│ gzip:  3.04 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mnormalize-CN5kRSMC.mjs.map                                               [2m 10.06 kB[22m [2m│ gzip:  3.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_.mjs.map                       [2m 10.05 kB[22m [2m│ gzip:  2.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msections-DcBIlOq1.mjs                                                    [2m  9.34 kB[22m [2m│ gzip:  2.47 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mseo-bjDoq9Eg.mjs.map                                                     [2m  9.19 kB[22m [2m│ gzip:  3.06 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcomment-_yzlBYPx.mjs                                                     [2m  9.18 kB[22m [2m│ gzip:  2.50 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mresolve-CNCNJ3Sy.mjs.map                                                 [2m  9.12 kB[22m [2m│ gzip:  3.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcron-Bd3b3iuj.mjs                                                        [2m  8.95 kB[22m [2m│ gzip:  3.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mpatterns-CqG5Ya3i.mjs.map                                                [2m  8.92 kB[22m [2m│ gzip:  3.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mclient/cf-access.mjs.map                                                 [2m  8.87 kB[22m [2m│ gzip:  3.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmedia/index.mjs.map                                                      [2m  8.84 kB[22m [2m│ gzip:  2.92 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/prepare.mjs.map                        [2m  8.65 kB[22m [2m│ gzip:  3.13 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moauth-authorization-CTMeVfvj.mjs                                         [2m  8.64 kB[22m [2m│ gzip:  2.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/setup/dev-bypass.mjs.map                                [2m  8.60 kB[22m [2m│ gzip:  3.24 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mapi-tokens-ucpcNXDt.mjs.map                                              [2m  8.50 kB[22m [2m│ gzip:  2.44 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmedia/local-runtime.mjs.map                                              [2m  8.45 kB[22m [2m│ gzip:  2.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbylines-C12gnDuK.d.mts.map                                               [2m  8.45 kB[22m [2m│ gzip:  1.47 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/register.mjs.map                                  [2m  8.19 kB[22m [2m│ gzip:  2.94 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mallowed-origins-D0fFk9a6.mjs.map                                         [2m  8.19 kB[22m [2m│ gzip:  3.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrequest-meta-C_Cjii-T.mjs.map                                            [2m  8.19 kB[22m [2m│ gzip:  3.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mutils-C3wTAP-P.mjs                                                       [2m  8.16 kB[22m [2m│ gzip:  2.90 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mzod-generator-dvxgmd1M.mjs                                               [2m  8.10 kB[22m [2m│ gzip:  2.42 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrate-limit-D_-gAeJ0.mjs.map                                              [2m  8.07 kB[22m [2m│ gzip:  3.40 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/rewrite-url-helpers.mjs.map            [2m  8.07 kB[22m [2m│ gzip:  2.68 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-DSZl1Dsv.mjs.map                                                   [2m  7.98 kB[22m [2m│ gzip:  2.22 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mplaceholder-LqmHqvBw.mjs.map                                             [2m  7.97 kB[22m [2m│ gzip:  2.92 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msettings-hcubRfkr.mjs                                                    [2m  7.86 kB[22m [2m│ gzip:  2.65 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdashboard-Cqw3ay2X.mjs.map                                               [2m  7.78 kB[22m [2m│ gzip:  2.88 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moptions-BL4X94qY.mjs.map                                                 [2m  7.78 kB[22m [2m│ gzip:  2.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdialect-helpers-BKCvISIQ.mjs.map                                         [2m  7.72 kB[22m [2m│ gzip:  2.08 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/index.mjs.map                          [2m  7.59 kB[22m [2m│ gzip:  2.39 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moauth-clients-eJCbkVSG.mjs                                               [2m  7.56 kB[22m [2m│ gzip:  1.83 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-ByV5sgsv.mjs.map                                                   [2m  7.35 kB[22m [2m│ gzip:  2.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs.map      [2m  7.35 kB[22m [2m│ gzip:  2.38 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmedia-oqRcNiQf.mjs                                                       [2m  7.22 kB[22m [2m│ gzip:  2.43 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mseo/index.mjs.map                                                        [2m  7.10 kB[22m [2m│ gzip:  2.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbylines-H0Xh5TMy.mjs.map                                                 [2m  7.04 kB[22m [2m│ gzip:  2.56 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmanifest-schema-Czqf0TLu.mjs                                             [2m  6.66 kB[22m [2m│ gzip:  2.24 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/widgets/_id_.mjs.map                [2m  6.52 kB[22m [2m│ gzip:  1.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mseo-Dq707mNQ.mjs.map                                                     [2m  6.47 kB[22m [2m│ gzip:  2.62 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/settings/email.mjs.map                                  [2m  6.47 kB[22m [2m│ gzip:  2.40 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mwidgets-lShIQXU5.mjs.map                                                 [2m  6.46 kB[22m [2m│ gzip:  2.29 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbylines-DJBgjPbo.mjs                                                     [2m  6.39 kB[22m [2m│ gzip:  2.45 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/setup/admin-verify.mjs.map                              [2m  6.33 kB[22m [2m│ gzip:  2.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media/_id_.mjs.map                                      [2m  6.28 kB[22m [2m│ gzip:  1.75 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media/upload-url.mjs.map                                [2m  6.24 kB[22m [2m│ gzip:  2.44 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/setup/admin.mjs.map                                     [2m  6.21 kB[22m [2m│ gzip:  2.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mservice-BuuTdGAT.mjs                                                     [2m  6.21 kB[22m [2m│ gzip:  2.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/setup/index.mjs.map                                     [2m  6.16 kB[22m [2m│ gzip:  2.40 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/plugins/_pluginId_/_...path_.mjs.map                    [2m  6.16 kB[22m [2m│ gzip:  2.52 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/oauth/_provider_.mjs.map                           [2m  6.14 kB[22m [2m│ gzip:  2.26 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mpublic-url-CUWWFME2.mjs.map                                              [2m  5.92 kB[22m [2m│ gzip:  2.40 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/register/verify.mjs.map                    [2m  5.90 kB[22m [2m│ gzip:  2.22 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mvalidate-VPnKoIzW.mjs.map                                                [2m  5.90 kB[22m [2m│ gzip:  1.70 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/preview-url.mjs.map           [2m  5.90 kB[22m [2m│ gzip:  2.39 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/_id_/status.mjs.map                      [2m  5.69 kB[22m [2m│ gzip:  2.00 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mresolve-CNCNJ3Sy.mjs                                                     [2m  5.63 kB[22m [2m│ gzip:  2.12 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mvalidation-DKHhXjPr.mjs                                                  [2m  5.61 kB[22m [2m│ gzip:  2.26 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/dev-bypass.mjs.map                                 [2m  5.58 kB[22m [2m│ gzip:  2.30 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-DaqNzqVt.d.mts.map                                                 [2m  5.58 kB[22m [2m│ gzip:  0.93 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/schedule.mjs.map              [2m  5.56 kB[22m [2m│ gzip:  1.63 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media/providers/_providerId_/index.mjs.map              [2m  5.54 kB[22m [2m│ gzip:  1.81 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/middleware/redirect.mjs.map                                        [2m  5.50 kB[22m [2m│ gzip:  2.23 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcomments-DxID-rsd.mjs                                                    [2m  5.49 kB[22m [2m│ gzip:  1.74 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mpreview-D4z0WONU.mjs.map                                                 [2m  5.44 kB[22m [2m│ gzip:  1.93 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mparse-3-caTKgt.mjs.map                                                   [2m  5.35 kB[22m [2m│ gzip:  1.95 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mallowed-origins-D0fFk9a6.mjs                                             [2m  5.31 kB[22m [2m│ gzip:  2.06 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/install.mjs.map                  [2m  5.28 kB[22m [2m│ gzip:  2.30 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msetup-Cf_TyOv5.mjs                                                       [2m  5.27 kB[22m [2m│ gzip:  1.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-Cd9UCu3t.mjs.map                                                   [2m  5.27 kB[22m [2m│ gzip:  1.85 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/bylines/_id_/translations.mjs.map                 [2m  5.21 kB[22m [2m│ gzip:  1.88 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrequest-cache-dzCt8TZB.mjs.map                                           [2m  5.19 kB[22m [2m│ gzip:  2.07 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mseo-bjDoq9Eg.mjs                                                         [2m  5.12 kB[22m [2m│ gzip:  1.82 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/setup/status.mjs.map                                    [2m  5.09 kB[22m [2m│ gzip:  1.96 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mpatterns-CqG5Ya3i.mjs                                                    [2m  5.05 kB[22m [2m│ gzip:  1.85 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/index.mjs.map                      [2m  4.98 kB[22m [2m│ gzip:  1.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/_slug_/translations.mjs.map     [2m  4.98 kB[22m [2m│ gzip:  1.50 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mclient/index.d.mts.map                                                   [2m  4.96 kB[22m [2m│ gzip:  1.42 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/_id_.mjs.map                               [2m  4.95 kB[22m [2m│ gzip:  1.56 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtokens-N8otWMmj.mjs                                                      [2m  4.94 kB[22m [2m│ gzip:  1.73 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/_slug_.mjs.map                  [2m  4.92 kB[22m [2m│ gzip:  1.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/typegen.mjs.map                                         [2m  4.90 kB[22m [2m│ gzip:  1.79 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrequest-context.mjs.map                                                  [2m  4.88 kB[22m [2m│ gzip:  2.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mnormalize-CN5kRSMC.mjs                                                   [2m  4.86 kB[22m [2m│ gzip:  1.48 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/allowed-domains/_domain_.mjs.map                  [2m  4.84 kB[22m [2m│ gzip:  1.49 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/oauth-clients/_id_.mjs.map                        [2m  4.75 kB[22m [2m│ gzip:  1.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/analyze.mjs.map                 [2m  4.74 kB[22m [2m│ gzip:  1.92 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22muser-D3BD5zdT.mjs                                                        [2m  4.74 kB[22m [2m│ gzip:  1.69 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdatabase/instrumentation.mjs.map                                         [2m  4.63 kB[22m [2m│ gzip:  2.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/publish.mjs.map               [2m  4.63 kB[22m [2m│ gzip:  1.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/allowed-domains/index.mjs.map                     [2m  4.61 kB[22m [2m│ gzip:  1.60 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrequest-meta-C_Cjii-T.mjs                                                [2m  4.58 kB[22m [2m│ gzip:  1.93 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/index.mjs.map                                    [2m  4.52 kB[22m [2m│ gzip:  1.76 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/translations.mjs.map                       [2m  4.49 kB[22m [2m│ gzip:  1.48 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mplugin-utils.mjs.map                                                     [2m  4.46 kB[22m [2m│ gzip:  1.89 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/signup/request.mjs.map                             [2m  4.45 kB[22m [2m│ gzip:  1.92 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrate-limit-D_-gAeJ0.mjs                                                  [2m  4.43 kB[22m [2m│ gzip:  2.07 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtrusted-proxy-97pajC2f.mjs.map                                           [2m  4.43 kB[22m [2m│ gzip:  1.96 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/magic-link/send.mjs.map                            [2m  4.40 kB[22m [2m│ gzip:  1.78 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/index.mjs.map                              [2m  4.39 kB[22m [2m│ gzip:  1.57 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mplaceholder-LqmHqvBw.mjs                                                 [2m  4.39 kB[22m [2m│ gzip:  1.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mvalidate-VPnKoIzW.mjs                                                    [2m  4.35 kB[22m [2m│ gzip:  1.32 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/signup/complete.mjs.map                            [2m  4.33 kB[22m [2m│ gzip:  1.74 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/types.d.mts.map                                                    [2m  4.32 kB[22m [2m│ gzip:  1.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbase64-CqR-7kqF.mjs.map                                                  [2m  4.31 kB[22m [2m│ gzip:  1.41 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/options.mjs.map                            [2m  4.30 kB[22m [2m│ gzip:  1.76 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/bylines/_id_/index.mjs.map                        [2m  4.30 kB[22m [2m│ gzip:  1.24 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media/_id_/confirm.mjs.map                              [2m  4.30 kB[22m [2m│ gzip:  1.76 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/complete.mjs.map                            [2m  4.29 kB[22m [2m│ gzip:  1.72 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/themes/preview.mjs.map                                  [2m  4.25 kB[22m [2m│ gzip:  1.80 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/index.mjs.map                               [2m  4.23 kB[22m [2m│ gzip:  1.83 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/hooks/exclusive/_hookName_.mjs.map                [2m  4.20 kB[22m [2m│ gzip:  1.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/register/options.mjs.map                   [2m  4.18 kB[22m [2m│ gzip:  1.69 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moauth-state-store-vOSdOeGe.mjs.map                                       [2m  4.17 kB[22m [2m│ gzip:  1.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/redirects/_id_.mjs.map                                  [2m  4.17 kB[22m [2m│ gzip:  1.10 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mconnection-2igzM-AT.mjs.map                                              [2m  4.14 kB[22m [2m│ gzip:  1.79 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/register-options.mjs.map                    [2m  4.09 kB[22m [2m│ gzip:  1.75 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/middleware/setup.mjs.map                                           [2m  4.08 kB[22m [2m│ gzip:  1.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/sitemap.xml.mjs.map                                         [2m  4.05 kB[22m [2m│ gzip:  1.66 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/manifest.mjs.map                                        [2m  4.04 kB[22m [2m│ gzip:  1.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/bylines/index.mjs.map                             [2m  4.03 kB[22m [2m│ gzip:  1.46 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/sections/_slug_.mjs.map                                 [2m  3.99 kB[22m [2m│ gzip:  1.04 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mapi-tokens-ucpcNXDt.mjs                                                  [2m  3.95 kB[22m [2m│ gzip:  1.26 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media/providers/_providerId_/_itemId_.mjs.map           [2m  3.95 kB[22m [2m│ gzip:  1.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_.mjs.map                             [2m  3.86 kB[22m [2m│ gzip:  1.25 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/index.mjs.map                 [2m  3.83 kB[22m [2m│ gzip:  1.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/_id_/update.mjs.map              [2m  3.83 kB[22m [2m│ gzip:  1.62 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_.mjs.map                                    [2m  3.79 kB[22m [2m│ gzip:  1.00 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdb/index.mjs.map                                                         [2m  3.77 kB[22m [2m│ gzip:  1.42 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/widgets.mjs.map                     [2m  3.74 kB[22m [2m│ gzip:  1.48 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moptions-BL4X94qY.mjs                                                     [2m  3.69 kB[22m [2m│ gzip:  1.26 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/redirects/404s/index.mjs.map                            [2m  3.64 kB[22m [2m│ gzip:  1.07 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/duplicate.mjs.map             [2m  3.62 kB[22m [2m│ gzip:  1.48 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs.map    [2m  3.60 kB[22m [2m│ gzip:  1.01 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/updates.mjs.map                           [2m  3.56 kB[22m [2m│ gzip:  1.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcache-CNk1jIxp.mjs.map                                                   [2m  3.54 kB[22m [2m│ gzip:  1.45 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/verify.mjs.map                             [2m  3.54 kB[22m [2m│ gzip:  1.42 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdashboard-Cqw3ay2X.mjs                                                   [2m  3.54 kB[22m [2m│ gzip:  1.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmime-KV5TqkMN.mjs.map                                                    [2m  3.52 kB[22m [2m│ gzip:  1.48 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/device/token.mjs.map                              [2m  3.50 kB[22m [2m│ gzip:  1.56 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcomponents-Dx3DM0gg.mjs.map                                              [2m  3.46 kB[22m [2m│ gzip:  0.99 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mchallenge-store-Dng1SxKT.mjs.map                                         [2m  3.43 kB[22m [2m│ gzip:  1.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/disable.mjs.map                        [2m  3.43 kB[22m [2m│ gzip:  1.49 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mpublic-url-CUWWFME2.mjs                                                  [2m  3.37 kB[22m [2m│ gzip:  1.50 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbylines-H0Xh5TMy.mjs                                                     [2m  3.36 kB[22m [2m│ gzip:  1.27 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-bYmRn_Uy.d.mts.map                                                 [2m  3.35 kB[22m [2m│ gzip:  1.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/items/_id_.mjs.map                         [2m  3.34 kB[22m [2m│ gzip:  1.04 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/index.mjs.map                   [2m  3.33 kB[22m [2m│ gzip:  1.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media/file/_...key_.mjs.map                             [2m  3.33 kB[22m [2m│ gzip:  1.52 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/oauth-clients/index.mjs.map                       [2m  3.32 kB[22m [2m│ gzip:  1.25 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdialect-helpers-BKCvISIQ.mjs                                             [2m  3.31 kB[22m [2m│ gzip:  1.12 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/robots.txt.mjs.map                                          [2m  3.28 kB[22m [2m│ gzip:  1.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/send-recovery.mjs.map                  [2m  3.27 kB[22m [2m│ gzip:  1.44 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mwidgets-lShIQXU5.mjs                                                     [2m  3.27 kB[22m [2m│ gzip:  1.22 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/restore.mjs.map               [2m  3.25 kB[22m [2m│ gzip:  1.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22memail-console-CubRll9q.mjs.map                                           [2m  3.23 kB[22m [2m│ gzip:  1.54 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/magic-link/verify.mjs.map                          [2m  3.18 kB[22m [2m│ gzip:  1.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/discard-draft.mjs.map         [2m  3.18 kB[22m [2m│ gzip:  1.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/reorder.mjs.map                     [2m  3.16 kB[22m [2m│ gzip:  1.32 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/api-tokens/index.mjs.map                          [2m  3.11 kB[22m [2m│ gzip:  1.21 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/unpublish.mjs.map             [2m  3.11 kB[22m [2m│ gzip:  1.27 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/_id_/install.mjs.map          [2m  3.10 kB[22m [2m│ gzip:  1.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmode-CaaiebZI.mjs.map                                                    [2m  3.04 kB[22m [2m│ gzip:  1.13 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/search/rebuild.mjs.map                                  [2m  3.02 kB[22m [2m│ gzip:  1.23 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mvalidate-DQtHw9NT.d.mts.map                                              [2m  3.01 kB[22m [2m│ gzip:  0.94 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs.map         [2m  2.97 kB[22m [2m│ gzip:  1.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/revisions/_revisionId_/restore.mjs.map                  [2m  2.94 kB[22m [2m│ gzip:  1.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/_id_/icon.mjs.map             [2m  2.94 kB[22m [2m│ gzip:  1.30 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/index.mjs.map                               [2m  2.94 kB[22m [2m│ gzip:  1.30 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mruntime.mjs.map                                                          [2m  2.91 kB[22m [2m│ gzip:  1.25 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/settings.mjs.map                                        [2m  2.89 kB[22m [2m│ gzip:  1.06 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/index.mjs.map                                [2m  2.89 kB[22m [2m│ gzip:  1.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/redirects/index.mjs.map                                 [2m  2.86 kB[22m [2m│ gzip:  1.00 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mpreview-D4z0WONU.mjs                                                     [2m  2.85 kB[22m [2m│ gzip:  1.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mparse-3-caTKgt.mjs                                                       [2m  2.83 kB[22m [2m│ gzip:  1.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdefault-BvTAYCzx.mjs.map                                                 [2m  2.82 kB[22m [2m│ gzip:  0.81 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mpasskey-config-BloQOT3y.mjs.map                                          [2m  2.81 kB[22m [2m│ gzip:  1.25 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/search/index.mjs.map                                    [2m  2.78 kB[22m [2m│ gzip:  1.33 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/well-known/auth.mjs.map                                 [2m  2.75 kB[22m [2m│ gzip:  1.22 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/device/code.mjs.map                               [2m  2.74 kB[22m [2m│ gzip:  1.27 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/sections/index.mjs.map                                  [2m  2.71 kB[22m [2m│ gzip:  0.96 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/update.mjs.map                       [2m  2.71 kB[22m [2m│ gzip:  1.12 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/translations.mjs.map          [2m  2.70 kB[22m [2m│ gzip:  1.28 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/_id_.mjs.map                             [2m  2.68 kB[22m [2m│ gzip:  0.92 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrequest-cache-dzCt8TZB.mjs                                               [2m  2.67 kB[22m [2m│ gzip:  1.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/search/enable.mjs.map                                   [2m  2.65 kB[22m [2m│ gzip:  1.12 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-ByV5sgsv.mjs                                                       [2m  2.64 kB[22m [2m│ gzip:  1.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mseo-Dq707mNQ.mjs                                                         [2m  2.59 kB[22m [2m│ gzip:  1.21 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/callback.mjs.map                [2m  2.55 kB[22m [2m│ gzip:  1.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mplaceholder-KCkkCtgQ.d.mts.map                                           [2m  2.50 kB[22m [2m│ gzip:  0.92 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/menus/index.mjs.map                                     [2m  2.48 kB[22m [2m│ gzip:  0.97 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mconfig-CVssduLe.mjs.map                                                  [2m  2.48 kB[22m [2m│ gzip:  1.09 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/themes/marketplace/index.mjs.map                  [2m  2.44 kB[22m [2m│ gzip:  1.06 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mschema-Djdlfi5G.mjs.map                                                  [2m  2.44 kB[22m [2m│ gzip:  1.04 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbase64-CqR-7kqF.mjs                                                      [2m  2.44 kB[22m [2m│ gzip:  0.92 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/index.mjs.map                        [2m  2.42 kB[22m [2m│ gzip:  0.89 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/index.mjs.map          [2m  2.41 kB[22m [2m│ gzip:  0.83 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/me.mjs.map                                         [2m  2.40 kB[22m [2m│ gzip:  1.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/_id_/uninstall.mjs.map           [2m  2.39 kB[22m [2m│ gzip:  1.08 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mconnection-2igzM-AT.mjs                                                  [2m  2.38 kB[22m [2m│ gzip:  1.06 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mindex-CC42STEm.d.mts.map                                                 [2m  2.36 kB[22m [2m│ gzip:  0.79 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/hooks/exclusive/index.mjs.map                     [2m  2.33 kB[22m [2m│ gzip:  1.11 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtransaction-NQj4VJ7Z.mjs.map                                             [2m  2.32 kB[22m [2m│ gzip:  1.10 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/signup/verify.mjs.map                              [2m  2.29 kB[22m [2m│ gzip:  1.13 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/enable.mjs.map                       [2m  2.28 kB[22m [2m│ gzip:  1.05 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/mode.mjs.map                                       [2m  2.27 kB[22m [2m│ gzip:  1.13 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdb-errors-CGN9kJfo.mjs.map                                               [2m  2.24 kB[22m [2m│ gzip:  1.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mauthorize-Bkwe8kuL.mjs.map                                               [2m  2.24 kB[22m [2m│ gzip:  0.85 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/accept.mjs.map                              [2m  2.22 kB[22m [2m│ gzip:  1.09 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/well-known/oauth-authorization-server.mjs.map           [2m  2.21 kB[22m [2m│ gzip:  0.97 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moptions-DhV-gwJb.d.mts.map                                               [2m  2.19 kB[22m [2m│ gzip:  0.83 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/search/suggest.mjs.map                                  [2m  2.19 kB[22m [2m│ gzip:  1.06 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/uninstall.mjs.map                    [2m  2.18 kB[22m [2m│ gzip:  0.98 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mhash-DlUxGhQS.mjs.map                                                    [2m  2.18 kB[22m [2m│ gzip:  1.05 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/index.mjs.map                              [2m  2.11 kB[22m [2m│ gzip:  1.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msetup-complete-MzzN9u0b.mjs.map                                          [2m  2.08 kB[22m [2m│ gzip:  0.91 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/device/authorize.mjs.map                          [2m  2.06 kB[22m [2m│ gzip:  1.00 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mslugify-Cjh1ssOZ.mjs.map                                                 [2m  2.04 kB[22m [2m│ gzip:  1.01 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/index.mjs.map                            [2m  2.01 kB[22m [2m│ gzip:  0.90 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtrusted-proxy-97pajC2f.mjs                                               [2m  1.99 kB[22m [2m│ gzip:  0.97 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/enable.mjs.map                         [2m  1.99 kB[22m [2m│ gzip:  0.94 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcomponents-Dx3DM0gg.mjs                                                  [2m  1.99 kB[22m [2m│ gzip:  0.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/bulk.mjs.map                             [2m  1.98 kB[22m [2m│ gzip:  0.88 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcache-CNk1jIxp.mjs                                                       [2m  1.97 kB[22m [2m│ gzip:  0.80 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/index.mjs.map                 [2m  1.91 kB[22m [2m│ gzip:  0.86 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msettings-CJnKiWuR.mjs.map                                                [2m  1.91 kB[22m [2m│ gzip:  0.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/reorder.mjs.map                            [2m  1.88 kB[22m [2m│ gzip:  0.86 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/items.mjs.map                              [2m  1.87 kB[22m [2m│ gzip:  0.86 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/probe.mjs.map                                    [2m  1.84 kB[22m [2m│ gzip:  0.87 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moauth-state-store-vOSdOeGe.mjs                                           [2m  1.79 kB[22m [2m│ gzip:  0.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmedia-allowlist-BNloC69x.mjs.map                                         [2m  1.77 kB[22m [2m│ gzip:  0.95 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/setup/dev-reset.mjs.map                                 [2m  1.77 kB[22m [2m│ gzip:  0.89 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/disable.mjs.map                      [2m  1.77 kB[22m [2m│ gzip:  0.82 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/orphans/_slug_.mjs.map                           [2m  1.76 kB[22m [2m│ gzip:  0.81 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mpage/index.d.mts.map                                                     [2m  1.75 kB[22m [2m│ gzip:  0.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/token/refresh.mjs.map                             [2m  1.72 kB[22m [2m│ gzip:  0.87 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-CpUuGcd5.d.mts.map                                                 [2m  1.72 kB[22m [2m│ gzip:  0.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/api-tokens/_id_.mjs.map                           [2m  1.68 kB[22m [2m│ gzip:  0.85 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/redirects/404s/summary.mjs.map                          [2m  1.68 kB[22m [2m│ gzip:  0.79 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/token/revoke.mjs.map                              [2m  1.68 kB[22m [2m│ gzip:  0.87 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22memail-console-CubRll9q.mjs                                               [2m  1.67 kB[22m [2m│ gzip:  0.86 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/revisions.mjs.map             [2m  1.67 kB[22m [2m│ gzip:  0.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/well-known/oauth-protected-resource.mjs.map             [2m  1.64 kB[22m [2m│ gzip:  0.85 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/permanent.mjs.map             [2m  1.62 kB[22m [2m│ gzip:  0.79 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/reorder.mjs.map        [2m  1.60 kB[22m [2m│ gzip:  0.72 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mchallenge-store-Dng1SxKT.mjs                                             [2m  1.59 kB[22m [2m│ gzip:  0.68 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdb-errors-CGN9kJfo.mjs                                                   [2m  1.57 kB[22m [2m│ gzip:  0.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mpasskey-config-BloQOT3y.mjs                                              [2m  1.56 kB[22m [2m│ gzip:  0.74 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/trash.mjs.map                      [2m  1.55 kB[22m [2m│ gzip:  0.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mapi/route-utils.mjs.map                                                  [2m  1.54 kB[22m [2m│ gzip:  0.70 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-CkDSF81F.d.mts.map                                                 [2m  1.53 kB[22m [2m│ gzip:  0.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-DSZl1Dsv.mjs                                                       [2m  1.49 kB[22m [2m│ gzip:  0.70 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/index.mjs.map                        [2m  1.48 kB[22m [2m│ gzip:  0.74 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/_id_/index.mjs.map            [2m  1.45 kB[22m [2m│ gzip:  0.72 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/logout.mjs.map                                     [2m  1.44 kB[22m [2m│ gzip:  0.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/themes/marketplace/_id_/index.mjs.map             [2m  1.43 kB[22m [2m│ gzip:  0.72 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/dev/emails.mjs.map                                      [2m  1.43 kB[22m [2m│ gzip:  0.63 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moauth-user-lookup-3JwsVw6N.mjs.map                                       [2m  1.41 kB[22m [2m│ gzip:  0.76 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdefault-BvTAYCzx.mjs                                                     [2m  1.35 kB[22m [2m│ gzip:  0.50 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-DaYDYW6g.d.mts.map                                                 [2m  1.34 kB[22m [2m│ gzip:  0.46 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/dashboard.mjs.map                                       [2m  1.34 kB[22m [2m│ gzip:  0.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mslugify-Cjh1ssOZ.mjs                                                     [2m  1.31 kB[22m [2m│ gzip:  0.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msite-url-xkhw1tcz.mjs.map                                                [2m  1.30 kB[22m [2m│ gzip:  0.73 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/counts.mjs.map                           [2m  1.30 kB[22m [2m│ gzip:  0.65 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/search/stats.mjs.map                                    [2m  1.29 kB[22m [2m│ gzip:  0.69 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/revisions/_revisionId_/index.mjs.map                    [2m  1.29 kB[22m [2m│ gzip:  0.68 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mload-DmXNVhst.mjs.map                                                    [2m  1.28 kB[22m [2m│ gzip:  0.64 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmime-KV5TqkMN.mjs                                                        [2m  1.28 kB[22m [2m│ gzip:  0.64 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mauthorize-Bkwe8kuL.mjs                                                   [2m  1.28 kB[22m [2m│ gzip:  0.52 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/index.mjs.map                             [2m  1.27 kB[22m [2m│ gzip:  0.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mplugin-types.d.mts.map                                                   [2m  1.25 kB[22m [2m│ gzip:  0.46 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/compare.mjs.map               [2m  1.25 kB[22m [2m│ gzip:  0.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mconfig-CVssduLe.mjs                                                      [2m  1.23 kB[22m [2m│ gzip:  0.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmedia-allowlist-BNloC69x.mjs                                             [2m  1.21 kB[22m [2m│ gzip:  0.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mhash-DlUxGhQS.mjs                                                        [2m  1.21 kB[22m [2m│ gzip:  0.66 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mschema-Djdlfi5G.mjs                                                      [2m  1.20 kB[22m [2m│ gzip:  0.59 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media/providers/index.mjs.map                           [2m  1.16 kB[22m [2m│ gzip:  0.62 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msettings-CJnKiWuR.mjs                                                    [2m  1.16 kB[22m [2m│ gzip:  0.47 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/PluginRegistry.mjs.map                                      [2m  1.15 kB[22m [2m│ gzip:  0.57 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdb/postgres.mjs.map                                                      [2m  1.14 kB[22m [2m│ gzip:  0.53 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/orphans/index.mjs.map                            [2m  1.14 kB[22m [2m│ gzip:  0.57 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msetup-complete-MzzN9u0b.mjs                                              [2m  1.12 kB[22m [2m│ gzip:  0.52 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msetup-nonce-DXuriHsg.mjs.map                                             [2m  1.10 kB[22m [2m│ gzip:  0.63 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/execute.d.mts.map                      [2m  1.09 kB[22m [2m│ gzip:  0.53 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msetup-nonce-DXuriHsg.mjs                                                 [2m  1.02 kB[22m [2m│ gzip:  0.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/analyze.d.mts.map                      [2m  1.00 kB[22m [2m│ gzip:  0.43 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mauth/providers/github.mjs.map                                            [2m  0.99 kB[22m [2m│ gzip:  0.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mauth/providers/google.mjs.map                                            [2m  0.99 kB[22m [2m│ gzip:  0.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-D599-ruj.d.mts.map                                                 [2m  0.94 kB[22m [2m│ gzip:  0.46 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtransaction-NQj4VJ7Z.mjs                                                 [2m  0.92 kB[22m [2m│ gzip:  0.48 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/widget-components.mjs.map                               [2m  0.91 kB[22m [2m│ gzip:  0.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdb/sqlite.mjs.map                                                        [2m  0.91 kB[22m [2m│ gzip:  0.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mchunks-BkfVdD-3.mjs.map                                                  [2m  0.90 kB[22m [2m│ gzip:  0.57 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moauth-user-lookup-3JwsVw6N.mjs                                           [2m  0.81 kB[22m [2m│ gzip:  0.49 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mchunks-BkfVdD-3.mjs                                                      [2m  0.80 kB[22m [2m│ gzip:  0.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mredirect-BINiRYq4.mjs.map                                                [2m  0.75 kB[22m [2m│ gzip:  0.49 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdb/libsql.mjs.map                                                        [2m  0.71 kB[22m [2m│ gzip:  0.41 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/rewrite-url-helpers.d.mts.map          [2m  0.70 kB[22m [2m│ gzip:  0.33 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mload-DmXNVhst.mjs                                                        [2m  0.70 kB[22m [2m│ gzip:  0.38 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22madapters-C4yd_UJR.d.mts.map                                              [2m  0.67 kB[22m [2m│ gzip:  0.32 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mstorage/s3.d.mts.map                                                     [2m  0.67 kB[22m [2m│ gzip:  0.33 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mseo/index.d.mts.map                                                      [2m  0.64 kB[22m [2m│ gzip:  0.36 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mstorage/local.d.mts.map                                                  [2m  0.62 kB[22m [2m│ gzip:  0.32 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-Dgo6y-Ut.d.mts.map                                                 [2m  0.59 kB[22m [2m│ gzip:  0.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mversion-w3SQnBSs.mjs.map                                                 [2m  0.59 kB[22m [2m│ gzip:  0.33 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mescape-Cg6kMELH.mjs.map                                                  [2m  0.58 kB[22m [2m│ gzip:  0.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmode-CaaiebZI.mjs                                                        [2m  0.58 kB[22m [2m│ gzip:  0.36 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrequest-context.d.mts.map                                                [2m  0.57 kB[22m [2m│ gzip:  0.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mplugin-utils.d.mts.map                                                   [2m  0.56 kB[22m [2m│ gzip:  0.30 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdatabase/instrumentation.d.mts.map                                       [2m  0.53 kB[22m [2m│ gzip:  0.28 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mredirect-BINiRYq4.mjs                                                    [2m  0.53 kB[22m [2m│ gzip:  0.37 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtransport-DOxLfUir.d.mts.map                                             [2m  0.49 kB[22m [2m│ gzip:  0.28 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mclient/cf-access.d.mts.map                                               [2m  0.49 kB[22m [2m│ gzip:  0.27 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mapi/route-utils.d.mts.map                                                [2m  0.48 kB[22m [2m│ gzip:  0.27 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/media.d.mts.map                        [2m  0.45 kB[22m [2m│ gzip:  0.25 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msite-url-xkhw1tcz.mjs                                                    [2m  0.44 kB[22m [2m│ gzip:  0.30 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmedia/local-runtime.d.mts.map                                            [2m  0.40 kB[22m [2m│ gzip:  0.23 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrunner-CNHRo1mT.d.mts.map                                                [2m  0.40 kB[22m [2m│ gzip:  0.23 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/index.d.mts.map                                                    [2m  0.36 kB[22m [2m│ gzip:  0.22 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-Cd9UCu3t.mjs                                                       [2m  0.36 kB[22m [2m│ gzip:  0.24 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mescape-Cg6kMELH.mjs                                                      [2m  0.36 kB[22m [2m│ gzip:  0.25 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/rewrite-urls.d.mts.map                 [2m  0.34 kB[22m [2m│ gzip:  0.23 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/middleware/auth.d.mts.map                                          [2m  0.33 kB[22m [2m│ gzip:  0.22 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/execute.d.mts.map               [2m  0.32 kB[22m [2m│ gzip:  0.23 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/prepare.d.mts.map                      [2m  0.32 kB[22m [2m│ gzip:  0.21 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/plugins/_pluginId_/_...path_.d.mts.map                  [2m  0.29 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/analyze.d.mts.map               [2m  0.27 kB[22m [2m│ gzip:  0.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.d.mts.map  [2m  0.26 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/PluginRegistry.d.mts.map                                    [2m  0.26 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-1NNkmTIn.mjs                                                       [2m  0.25 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/_slug_.d.mts.map                [2m  0.25 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mapi-tokens-iPIHAY8N.mjs                                                  [2m  0.25 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/terms/_taxonomy_.d.mts.map    [2m  0.24 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/probe.d.mts.map                                  [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/index.d.mts.map               [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/oauth-clients/_id_.d.mts.map                      [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/_slug_/translations.d.mts.map   [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/bylines/_id_/index.d.mts.map                      [2m  0.23 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/comments/_collection_/_contentId_/index.d.mts.map       [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media/providers/_providerId_/_itemId_.d.mts.map         [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_.d.mts.map                     [2m  0.23 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media/providers/_providerId_/index.d.mts.map            [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/redirects/404s/index.d.mts.map                          [2m  0.23 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/index.d.mts.map        [2m  0.22 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/bylines/_id_/translations.d.mts.map               [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/index.d.mts.map                 [2m  0.22 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/schedule.d.mts.map            [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/api-tokens/index.d.mts.map                        [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media/_id_.d.mts.map                                    [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/sections/_slug_.d.mts.map                               [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/allowed-domains/_domain_.d.mts.map                [2m  0.22 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mplugins/adapt-sandbox-entry.d.mts.map                                    [2m  0.22 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_.d.mts.map                                  [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/redirects/_id_.d.mts.map                                [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/oauth-clients/index.d.mts.map                     [2m  0.21 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/widgets/_id_.d.mts.map              [2m  0.21 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/allowed-domains/index.d.mts.map                   [2m  0.21 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/translations.d.mts.map                     [2m  0.21 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/settings/email.d.mts.map                                [2m  0.21 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/well-known/oauth-authorization-server.d.mts.map         [2m  0.21 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/_id_.d.mts.map                           [2m  0.21 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/index.d.mts.map                        [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/index.d.mts.map                    [2m  0.20 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/well-known/oauth-protected-resource.d.mts.map           [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/items/_id_.d.mts.map                       [2m  0.20 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/discard-draft.d.mts.map       [2m  0.20 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/index.d.mts.map                      [2m  0.20 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/themes/marketplace/_id_/thumbnail.d.mts.map       [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/index.d.mts.map                              [2m  0.20 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/_id_/uninstall.d.mts.map         [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/_id_.d.mts.map                             [2m  0.20 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/translations.d.mts.map        [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/reorder.d.mts.map      [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/settings.d.mts.map                                      [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/preview-url.d.mts.map         [2m  0.20 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/_id_/install.d.mts.map        [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/bylines/index.d.mts.map                           [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/setup/dev-bypass.d.mts.map                              [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/dev-bypass.d.mts.map                               [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/mcp.d.mts.map                                           [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/authorize.d.mts.map                               [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/_id_/update.d.mts.map            [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_.d.mts.map                           [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/_id_/index.d.mts.map          [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/send-recovery.d.mts.map                [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/duplicate.d.mts.map           [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/permanent.d.mts.map           [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/revisions.d.mts.map           [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/unpublish.d.mts.map           [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/index.d.mts.map                            [2m  0.20 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/hooks/exclusive/_hookName_.d.mts.map              [2m  0.19 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/themes/marketplace/_id_/index.d.mts.map           [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmedia/index.d.mts.map                                                    [2m  0.19 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/_id_/icon.d.mts.map           [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/register.d.mts.map                                [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/register-options.d.mts.map                  [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/publish.d.mts.map             [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media.d.mts.map                                         [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/redirects/index.d.mts.map                               [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/compare.d.mts.map             [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/restore.d.mts.map             [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/install.d.mts.map                [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/oauth/_provider_/callback.d.mts.map                [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/sections/index.d.mts.map                                [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/uninstall.d.mts.map                  [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/callback.d.mts.map              [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/token.d.mts.map                                   [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/index.d.mts.map               [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/register/options.d.mts.map                 [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/menus/index.d.mts.map                                   [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/themes/marketplace/index.d.mts.map                [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/register/verify.d.mts.map                  [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/dev/emails.d.mts.map                                    [2m  0.19 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/me.d.mts.map                                       [2m  0.18 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/revisions/_revisionId_/restore.d.mts.map                [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/middleware/request-context.d.mts.map                               [2m  0.18 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/_id_/status.d.mts.map                    [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/disable.d.mts.map                    [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/sitemap-_collection_.xml.d.mts.map                          [2m  0.18 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/hooks/exclusive/index.d.mts.map                   [2m  0.18 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/typegen.d.mts.map                                       [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/widgets.d.mts.map                   [2m  0.18 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/enable.d.mts.map                     [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/update.d.mts.map                     [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/disable.d.mts.map                      [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/reorder.d.mts.map                   [2m  0.18 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mruntime.d.mts.map                                                        [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/revisions/_revisionId_/index.d.mts.map                  [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/index.d.mts.map                      [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/enable.d.mts.map                       [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/oauth/_provider_.d.mts.map                         [2m  0.18 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/device/authorize.d.mts.map                        [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/trash.d.mts.map                    [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/updates.d.mts.map                         [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/redirects/404s/summary.d.mts.map                        [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/complete.d.mts.map                          [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/magic-link/verify.d.mts.map                        [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/signup/complete.d.mts.map                          [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media/file/_...key_.d.mts.map                           [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media/providers/index.d.mts.map                         [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/setup/admin-verify.d.mts.map                            [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/widget-components.d.mts.map                             [2m  0.18 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/api-tokens/_id_.d.mts.map                         [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/counts.d.mts.map                         [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/index.d.mts.map                          [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/options.d.mts.map                          [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/signup/request.d.mts.map                           [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/reorder.d.mts.map                          [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/orphans/_slug_.d.mts.map                         [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mversion-w3SQnBSs.mjs                                                     [2m  0.17 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/middleware/redirect.d.mts.map                                      [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/token/refresh.d.mts.map                           [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/verify.d.mts.map                           [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/orphans/index.d.mts.map                          [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/search/suggest.d.mts.map                                [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/index.d.mts.map                           [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/accept.d.mts.map                            [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/magic-link/send.d.mts.map                          [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/signup/verify.d.mts.map                            [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media/_id_/confirm.d.mts.map                            [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/device/token.d.mts.map                            [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/token/revoke.d.mts.map                            [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/bulk.d.mts.map                           [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/index.d.mts.map                            [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media/upload-url.d.mts.map                              [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/items.d.mts.map                            [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/search/enable.d.mts.map                                 [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/search/rebuild.d.mts.map                                [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/index.d.mts.map                             [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/index.d.mts.map                             [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/device/code.d.mts.map                             [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/search/index.d.mts.map                                  [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/setup/dev-reset.d.mts.map                               [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/themes/preview.d.mts.map                                [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/middleware/setup.d.mts.map                                         [2m  0.17 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/openapi.json.d.mts.map                                  [2m  0.17 kB[22m [2m│ gzip:  0.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/search/stats.d.mts.map                                  [2m  0.16 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/well-known/auth.d.mts.map                               [2m  0.16 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/index.d.mts.map                                  [2m  0.16 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/setup/status.d.mts.map                                  [2m  0.16 kB[22m [2m│ gzip:  0.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/logout.d.mts.map                                   [2m  0.16 kB[22m [2m│ gzip:  0.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/setup/admin.d.mts.map                                   [2m  0.16 kB[22m [2m│ gzip:  0.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/setup/index.d.mts.map                                   [2m  0.16 kB[22m [2m│ gzip:  0.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/dashboard.d.mts.map                                     [2m  0.16 kB[22m [2m│ gzip:  0.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/manifest.d.mts.map                                      [2m  0.16 kB[22m [2m│ gzip:  0.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/snapshot.d.mts.map                                      [2m  0.16 kB[22m [2m│ gzip:  0.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/mode.d.mts.map                                     [2m  0.16 kB[22m [2m│ gzip:  0.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/sitemap.xml.d.mts.map                                       [2m  0.16 kB[22m [2m│ gzip:  0.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/middleware.d.mts.map                                               [2m  0.15 kB[22m [2m│ gzip:  0.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/robots.txt.d.mts.map                                        [2m  0.15 kB[22m [2m│ gzip:  0.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdb/postgres.d.mts.map                                                    [2m  0.15 kB[22m [2m│ gzip:  0.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mauth/providers/github.d.mts.map                                          [2m  0.15 kB[22m [2m│ gzip:  0.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mauth/providers/google.d.mts.map                                          [2m  0.15 kB[22m [2m│ gzip:  0.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdb/libsql.d.mts.map                                                      [2m  0.14 kB[22m [2m│ gzip:  0.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdb/sqlite.d.mts.map                                                      [2m  0.14 kB[22m [2m│ gzip:  0.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mssrf-BIcd-aXW.mjs                                                        [2m  0.01 kB[22m [2m│ gzip:  0.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.mts[22m[39m                                                              [2m 18.12 kB[22m [2m│ gzip:  4.80 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/types.d.mts[22m[39m                                                        [2m 12.64 kB[22m [2m│ gzip:  3.83 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mclient/index.d.mts[22m[39m                                                       [2m 11.48 kB[22m [2m│ gzip:  3.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mapi/schemas/index.d.mts[22m[39m                                                  [2m  7.93 kB[22m [2m│ gzip:  1.88 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mpage/index.d.mts[22m[39m                                                         [2m  6.82 kB[22m [2m│ gzip:  2.27 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mplugin-types.d.mts[22m[39m                                                       [2m  6.38 kB[22m [2m│ gzip:  2.28 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/execute.d.mts[22m[39m                          [2m  3.91 kB[22m [2m│ gzip:  1.54 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mapi/route-utils.d.mts[22m[39m                                                    [2m  2.94 kB[22m [2m│ gzip:  1.35 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mplugin-utils.d.mts[22m[39m                                                       [2m  2.84 kB[22m [2m│ gzip:  1.24 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mrequest-context.d.mts[22m[39m                                                    [2m  2.81 kB[22m [2m│ gzip:  1.29 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/index.d.mts[22m[39m                                                        [2m  2.60 kB[22m [2m│ gzip:  1.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mclient/cf-access.d.mts[22m[39m                                                   [2m  2.55 kB[22m [2m│ gzip:  1.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/analyze.d.mts[22m[39m                          [2m  2.52 kB[22m [2m│ gzip:  0.95 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mseo/index.d.mts[22m[39m                                                          [2m  2.45 kB[22m [2m│ gzip:  1.01 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mdatabase/instrumentation.d.mts[22m[39m                                           [2m  2.00 kB[22m [2m│ gzip:  0.95 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/rewrite-url-helpers.d.mts[22m[39m              [2m  1.63 kB[22m [2m│ gzip:  0.64 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mstorage/s3.d.mts[22m[39m                                                         [2m  1.61 kB[22m [2m│ gzip:  0.75 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mmedia/index.d.mts[22m[39m                                                        [2m  1.52 kB[22m [2m│ gzip:  0.63 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mstorage/local.d.mts[22m[39m                                                      [2m  1.50 kB[22m [2m│ gzip:  0.70 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mplugins/adapt-sandbox-entry.d.mts[22m[39m                                        [2m  1.37 kB[22m [2m│ gzip:  0.64 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mmedia/local-runtime.d.mts[22m[39m                                                [2m  1.33 kB[22m [2m│ gzip:  0.59 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mruntime.d.mts[22m[39m                                                            [2m  1.09 kB[22m [2m│ gzip:  0.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/middleware/auth.d.mts[22m[39m                                              [2m  0.97 kB[22m [2m│ gzip:  0.49 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/media.d.mts[22m[39m                            [2m  0.96 kB[22m [2m│ gzip:  0.47 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mseed/index.d.mts[22m[39m                                                         [2m  0.82 kB[22m [2m│ gzip:  0.33 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/middleware/redirect.d.mts[22m[39m                                          [2m  0.72 kB[22m [2m│ gzip:  0.45 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress-plugin/execute.d.mts[22m[39m                   [2m  0.67 kB[22m [2m│ gzip:  0.38 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/middleware/setup.d.mts[22m[39m                                             [2m  0.67 kB[22m [2m│ gzip:  0.40 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/middleware/request-context.d.mts[22m[39m                                   [2m  0.64 kB[22m [2m│ gzip:  0.40 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/rewrite-urls.d.mts[22m[39m                     [2m  0.59 kB[22m [2m│ gzip:  0.33 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/settings.d.mts[22m[39m                                          [2m  0.58 kB[22m [2m│ gzip:  0.33 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mdb/index.d.mts[22m[39m                                                           [2m  0.58 kB[22m [2m│ gzip:  0.27 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/settings/email.d.mts[22m[39m                                    [2m  0.53 kB[22m [2m│ gzip:  0.32 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/search/index.d.mts[22m[39m                                      [2m  0.51 kB[22m [2m│ gzip:  0.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/media/_id_.d.mts[22m[39m                                        [2m  0.51 kB[22m [2m│ gzip:  0.28 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/probe.d.mts[22m[39m                                      [2m  0.50 kB[22m [2m│ gzip:  0.30 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/typegen.d.mts[22m[39m                                           [2m  0.49 kB[22m [2m│ gzip:  0.32 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/api-tokens/index.d.mts[22m[39m                            [2m  0.48 kB[22m [2m│ gzip:  0.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/prepare.d.mts[22m[39m                          [2m  0.47 kB[22m [2m│ gzip:  0.27 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/search/suggest.d.mts[22m[39m                                    [2m  0.47 kB[22m [2m│ gzip:  0.30 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress-plugin/analyze.d.mts[22m[39m                   [2m  0.47 kB[22m [2m│ gzip:  0.29 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mauth/providers/github.d.mts[22m[39m                                              [2m  0.45 kB[22m [2m│ gzip:  0.30 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mauth/providers/google.d.mts[22m[39m                                              [2m  0.45 kB[22m [2m│ gzip:  0.29 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/comments/_collection_/_contentId_/index.d.mts[22m[39m           [2m  0.43 kB[22m [2m│ gzip:  0.28 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/search/enable.d.mts[22m[39m                                     [2m  0.42 kB[22m [2m│ gzip:  0.27 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/oauth-clients/_id_.d.mts[22m[39m                          [2m  0.41 kB[22m [2m│ gzip:  0.24 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/mcp.d.mts[22m[39m                                               [2m  0.41 kB[22m [2m│ gzip:  0.25 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/taxonomies/_name_/terms/_slug_.d.mts[22m[39m                    [2m  0.39 kB[22m [2m│ gzip:  0.24 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/plugins/_pluginId_/_...path_.d.mts[22m[39m                      [2m  0.39 kB[22m [2m│ gzip:  0.23 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/_id_/terms/_taxonomy_.d.mts[22m[39m        [2m  0.39 kB[22m [2m│ gzip:  0.26 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/media/providers/_providerId_/_itemId_.d.mts[22m[39m             [2m  0.39 kB[22m [2m│ gzip:  0.24 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/PluginRegistry.d.mts[22m[39m                                        [2m  0.38 kB[22m [2m│ gzip:  0.25 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/comments/_id_.d.mts[22m[39m                               [2m  0.38 kB[22m [2m│ gzip:  0.26 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/allowed-domains/_domain_.d.mts[22m[39m                    [2m  0.37 kB[22m [2m│ gzip:  0.24 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/media/providers/_providerId_/index.d.mts[22m[39m                [2m  0.37 kB[22m [2m│ gzip:  0.23 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/middleware.d.mts[22m[39m                                                   [2m  0.37 kB[22m [2m│ gzip:  0.25 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/media.d.mts[22m[39m                                             [2m  0.37 kB[22m [2m│ gzip:  0.24 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/allowed-domains/index.d.mts[22m[39m                       [2m  0.36 kB[22m [2m│ gzip:  0.23 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/oauth-clients/index.d.mts[22m[39m                         [2m  0.36 kB[22m [2m│ gzip:  0.23 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/search/rebuild.d.mts[22m[39m                                    [2m  0.35 kB[22m [2m│ gzip:  0.24 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/taxonomies/index.d.mts[22m[39m                                  [2m  0.35 kB[22m [2m│ gzip:  0.22 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/taxonomies/_name_/terms/index.d.mts[22m[39m                     [2m  0.34 kB[22m [2m│ gzip:  0.23 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/passkey/_id_.d.mts[22m[39m                                 [2m  0.34 kB[22m [2m│ gzip:  0.23 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/me.d.mts[22m[39m                                           [2m  0.34 kB[22m [2m│ gzip:  0.23 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mdb/postgres.d.mts[22m[39m                                                        [2m  0.34 kB[22m [2m│ gzip:  0.22 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.d.mts[22m[39m      [2m  0.33 kB[22m [2m│ gzip:  0.22 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/schema/collections/_slug_/index.d.mts[22m[39m                   [2m  0.32 kB[22m [2m│ gzip:  0.21 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mdb/libsql.d.mts[22m[39m                                                          [2m  0.31 kB[22m [2m│ gzip:  0.22 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mdb/sqlite.d.mts[22m[39m                                                          [2m  0.31 kB[22m [2m│ gzip:  0.22 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/bylines/_id_/index.d.mts[22m[39m                          [2m  0.31 kB[22m [2m│ gzip:  0.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/_id_.d.mts[22m[39m                         [2m  0.31 kB[22m [2m│ gzip:  0.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/redirects/404s/index.d.mts[22m[39m                              [2m  0.31 kB[22m [2m│ gzip:  0.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/sections/_slug_.d.mts[22m[39m                                   [2m  0.30 kB[22m [2m│ gzip:  0.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/media/upload-url.d.mts[22m[39m                                  [2m  0.30 kB[22m [2m│ gzip:  0.21 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/menus/_name_.d.mts[22m[39m                                      [2m  0.30 kB[22m [2m│ gzip:  0.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/redirects/_id_.d.mts[22m[39m                                    [2m  0.30 kB[22m [2m│ gzip:  0.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/taxonomies/_name_/terms/_slug_/translations.d.mts[22m[39m       [2m  0.30 kB[22m [2m│ gzip:  0.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/_id_/schedule.d.mts[22m[39m                [2m  0.29 kB[22m [2m│ gzip:  0.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/bylines/_id_/translations.d.mts[22m[39m                   [2m  0.28 kB[22m [2m│ gzip:  0.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/schema/collections/_slug_/fields/index.d.mts[22m[39m            [2m  0.28 kB[22m [2m│ gzip:  0.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/widget-areas/_name_/widgets/_id_.d.mts[22m[39m                  [2m  0.28 kB[22m [2m│ gzip:  0.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/media/providers/index.d.mts[22m[39m                             [2m  0.28 kB[22m [2m│ gzip:  0.21 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/menus/_name_/translations.d.mts[22m[39m                         [2m  0.28 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/api-tokens/_id_.d.mts[22m[39m                             [2m  0.28 kB[22m [2m│ gzip:  0.21 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/comments/index.d.mts[22m[39m                              [2m  0.28 kB[22m [2m│ gzip:  0.21 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/index.d.mts[22m[39m                        [2m  0.27 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/menus/_name_/items/_id_.d.mts[22m[39m                           [2m  0.27 kB[22m [2m│ gzip:  0.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/oauth/register.d.mts[22m[39m                                    [2m  0.27 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/schema/collections/index.d.mts[22m[39m                          [2m  0.27 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/widget-areas/_name_.d.mts[22m[39m                               [2m  0.27 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/media/_id_/confirm.d.mts[22m[39m                                [2m  0.27 kB[22m [2m│ gzip:  0.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/well-known/oauth-authorization-server.d.mts[22m[39m             [2m  0.27 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/setup/dev-bypass.d.mts[22m[39m                                  [2m  0.27 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/users/_id_/index.d.mts[22m[39m                            [2m  0.27 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/dev-bypass.d.mts[22m[39m                                   [2m  0.27 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/bylines/index.d.mts[22m[39m                               [2m  0.27 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/oauth/authorize.d.mts[22m[39m                                   [2m  0.27 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/oauth/token.d.mts[22m[39m                                       [2m  0.27 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/well-known/oauth-protected-resource.d.mts[22m[39m               [2m  0.26 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/widget-areas/index.d.mts[22m[39m                                [2m  0.26 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/dev/emails.d.mts[22m[39m                                        [2m  0.26 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/redirects/index.d.mts[22m[39m                                   [2m  0.26 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/search/stats.d.mts[22m[39m                                      [2m  0.26 kB[22m [2m│ gzip:  0.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/sections/index.d.mts[22m[39m                                    [2m  0.26 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/_id_/discard-draft.d.mts[22m[39m           [2m  0.26 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/menus/index.d.mts[22m[39m                                       [2m  0.26 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/_id_/permanent.d.mts[22m[39m               [2m  0.26 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/_id_/preview-url.d.mts[22m[39m             [2m  0.26 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/_id_/translations.d.mts[22m[39m            [2m  0.26 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/schema/collections/_slug_/fields/reorder.d.mts[22m[39m          [2m  0.25 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/registry/_id_/uninstall.d.mts[22m[39m             [2m  0.25 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/themes/marketplace/_id_/thumbnail.d.mts[22m[39m           [2m  0.25 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/marketplace/_id_/install.d.mts[22m[39m            [2m  0.25 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/invite/register-options.d.mts[22m[39m                      [2m  0.25 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/_id_/duplicate.d.mts[22m[39m               [2m  0.25 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/_id_/unpublish.d.mts[22m[39m               [2m  0.25 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/users/_id_/send-recovery.d.mts[22m[39m                    [2m  0.25 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/_id_/revisions.d.mts[22m[39m               [2m  0.25 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/sitemap-_collection_.xml.d.mts[22m[39m                              [2m  0.25 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/hooks/exclusive/_hookName_.d.mts[22m[39m                  [2m  0.25 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/registry/_id_/update.d.mts[22m[39m                [2m  0.25 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/_id_/publish.d.mts[22m[39m                 [2m  0.25 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/_id_/restore.d.mts[22m[39m                 [2m  0.25 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/marketplace/_id_/index.d.mts[22m[39m              [2m  0.25 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/themes/marketplace/_id_/index.d.mts[22m[39m               [2m  0.24 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/_id_/compare.d.mts[22m[39m                 [2m  0.24 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress-plugin/callback.d.mts[22m[39m                  [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/_id_/uninstall.d.mts[22m[39m                      [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/marketplace/_id_/icon.d.mts[22m[39m               [2m  0.24 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/registry/install.d.mts[22m[39m                    [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/revisions/_revisionId_/restore.d.mts[22m[39m                    [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/oauth/_provider_/callback.d.mts[22m[39m                    [2m  0.24 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/passkey/register/options.d.mts[22m[39m                     [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/marketplace/index.d.mts[22m[39m                   [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/passkey/register/verify.d.mts[22m[39m                      [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/widget-areas/_name_/reorder.d.mts[22m[39m                       [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/widget-areas/_name_/widgets.d.mts[22m[39m                       [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/_id_/disable.d.mts[22m[39m                        [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/themes/marketplace/index.d.mts[22m[39m                    [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/widget-components.d.mts[22m[39m                                 [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/_id_/enable.d.mts[22m[39m                         [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/_id_/update.d.mts[22m[39m                         [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/users/_id_/disable.d.mts[22m[39m                          [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/oauth/device/authorize.d.mts[22m[39m                            [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/revisions/_revisionId_/index.d.mts[22m[39m                      [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/comments/_id_/status.d.mts[22m[39m                        [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/hooks/exclusive/index.d.mts[22m[39m                       [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/setup/admin-verify.d.mts[22m[39m                                [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/users/_id_/enable.d.mts[22m[39m                           [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/oauth/_provider_.d.mts[22m[39m                             [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/content/_collection_/trash.d.mts[22m[39m                        [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/invite/complete.d.mts[22m[39m                              [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/signup/complete.d.mts[22m[39m                              [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/_id_/index.d.mts[22m[39m                          [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/passkey/options.d.mts[22m[39m                              [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/menus/_name_/reorder.d.mts[22m[39m                              [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/redirects/404s/summary.d.mts[22m[39m                            [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/schema/orphans/_slug_.d.mts[22m[39m                             [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/updates.d.mts[22m[39m                             [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/magic-link/verify.d.mts[22m[39m                            [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/signup/request.d.mts[22m[39m                               [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/oauth/token/refresh.d.mts[22m[39m                               [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/comments/counts.d.mts[22m[39m                             [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/passkey/verify.d.mts[22m[39m                               [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/media/file/_...key_.d.mts[22m[39m                               [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/magic-link/send.d.mts[22m[39m                              [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/oauth/token/revoke.d.mts[22m[39m                                [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/setup/dev-reset.d.mts[22m[39m                                   [2m  0.23 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/comments/bulk.d.mts[22m[39m                               [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/menus/_name_/items.d.mts[22m[39m                                [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/oauth/device/token.d.mts[22m[39m                                [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/schema/orphans/index.d.mts[22m[39m                              [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/index.d.mts[22m[39m                               [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/invite/accept.d.mts[22m[39m                                [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/invite/index.d.mts[22m[39m                                 [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/signup/verify.d.mts[22m[39m                                [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/openapi.json.d.mts[22m[39m                                      [2m  0.23 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/passkey/index.d.mts[22m[39m                                [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/oauth/device/code.d.mts[22m[39m                                 [2m  0.23 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/themes/preview.d.mts[22m[39m                                    [2m  0.23 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/users/index.d.mts[22m[39m                                 [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/logout.d.mts[22m[39m                                       [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/well-known/auth.d.mts[22m[39m                                   [2m  0.22 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/dashboard.d.mts[22m[39m                                         [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/setup/admin.d.mts[22m[39m                                       [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/setup/index.d.mts[22m[39m                                       [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/setup/status.d.mts[22m[39m                                      [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/sitemap.xml.d.mts[22m[39m                                           [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/schema/index.d.mts[22m[39m                                      [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/manifest.d.mts[22m[39m                                          [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/snapshot.d.mts[22m[39m                                          [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/robots.txt.d.mts[22m[39m                                            [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/auth/mode.d.mts[22m[39m                                         [2m  0.22 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mcli/index.d.mts[22m[39m                                                          [2m  0.01 kB[22m [2m│ gzip:  0.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mindex-C-Y4tcPk.d.mts[39m                                                     [2m152.20 kB[22m [2m│ gzip: 40.96 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mbylines-C12gnDuK.d.mts[39m                                                   [2m 73.07 kB[22m [2m│ gzip:  8.45 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mtypes-DGHWRQgr.d.mts[39m                                                     [2m 39.71 kB[22m [2m│ gzip: 10.61 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mtypes-DaqNzqVt.d.mts[39m                                                     [2m 11.55 kB[22m [2m│ gzip:  2.61 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mtypes-bYmRn_Uy.d.mts[39m                                                     [2m  9.78 kB[22m [2m│ gzip:  3.24 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mplaceholder-KCkkCtgQ.d.mts[39m                                               [2m  8.70 kB[22m [2m│ gzip:  2.96 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mvalidate-DQtHw9NT.d.mts[39m                                                  [2m  8.64 kB[22m [2m│ gzip:  2.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mindex-CC42STEm.d.mts[39m                                                     [2m  7.74 kB[22m [2m│ gzip:  2.83 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32moptions-DhV-gwJb.d.mts[39m                                                   [2m  6.44 kB[22m [2m│ gzip:  2.43 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mtypes-D599-ruj.d.mts[39m                                                     [2m  6.19 kB[22m [2m│ gzip:  2.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mtypes-CpUuGcd5.d.mts[39m                                                     [2m  5.73 kB[22m [2m│ gzip:  1.66 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mtypes-CkDSF81F.d.mts[39m                                                     [2m  5.04 kB[22m [2m│ gzip:  1.78 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mtypes-DaYDYW6g.d.mts[39m                                                     [2m  4.57 kB[22m [2m│ gzip:  1.72 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32madapters-C4yd_UJR.d.mts[39m                                                  [2m  3.21 kB[22m [2m│ gzip:  1.32 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mtypes-Dgo6y-Ut.d.mts[39m                                                     [2m  2.64 kB[22m [2m│ gzip:  1.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mrunner-CNHRo1mT.d.mts[39m                                                    [2m  1.83 kB[22m [2m│ gzip:  0.91 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mtransport-DOxLfUir.d.mts[39m                                                 [2m  1.67 kB[22m [2m│ gzip:  0.76 kB[22m
packages/core build: [34mℹ[39m 995 files, total: 6933.02 kB
packages/core build: [32m✔[39m Build complete in [32m5036ms[39m
packages/core build: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugins. Here is a breakdown:
packages/core build:   - rolldown-plugin-dts:generate (42%)
packages/core build:   - rolldown-plugin-dts:resolver (30%)
packages/core build:   - rolldown-plugin-dts:fake-js (21%)
packages/core build: See https://rolldown.rs/options/checks#plugintimings for more details.
packages/core build: Done
packages/cloudflare build$ tsdown
packages/plugins/audit-log build$ node node_modules/@emdash-cms/plugin-cli/dist/index.mjs build
packages/plugins/awcms-micro-docs build$ tsdown
packages/plugins/atproto build$ node node_modules/@emdash-cms/plugin-cli/dist/index.mjs build
packages/cloudflare build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/plugins/awcms-micro-docs build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/cloudflare build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/cloudflare/tsdown.config.ts[24m
packages/cloudflare build: [34mℹ[39m entry: [34msrc/index.ts, src/db/d1.ts, src/db/do.ts, src/db/playground.ts, src/db/playground-middleware.ts, src/storage/r2.ts, src/auth/index.ts, src/sandbox/index.ts, src/plugins/index.ts, src/media/images-runtime.ts, src/media/stream-runtime.ts, src/cache/runtime.ts, src/cache/config.ts[39m
packages/cloudflare build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/cloudflare build: [34mℹ[39m Build start
packages/plugins/awcms-micro-docs build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-docs/tsdown.config.ts[24m
packages/cloudflare build: [34mℹ[39m Cleaning 41 files
packages/plugins/awcms-micro-docs build: [34mℹ[39m entry: [34msrc/index.ts, src/admin.tsx[39m
packages/plugins/awcms-micro-docs build: [34mℹ[39m target: [34mes2023[39m
packages/plugins/awcms-micro-docs build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/awcms-micro-docs build: [34mℹ[39m Build start
packages/plugins/awcms-micro-docs build: [34mℹ[39m Cleaning 10 files
packages/plugins/atproto build: ◐ Building plugin...
packages/plugins/atproto build: ℹ Manifest: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/atproto/emdash-plugin.jsonc
packages/plugins/atproto build: ℹ Plugin entry: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/atproto/src/plugin.ts
packages/plugins/atproto build: ℹ Package: @emdash-cms/plugin-atproto
packages/plugins/atproto build: ◐ Building runtime entry...
packages/plugins/atproto build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/atproto build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/atproto build: [34mℹ[39m Build start
packages/plugins/audit-log build: ◐ Building plugin...
packages/plugins/audit-log build: ℹ Manifest: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/audit-log/emdash-plugin.jsonc
packages/plugins/audit-log build: ℹ Plugin entry: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/audit-log/src/plugin.ts
packages/plugins/audit-log build: ℹ Package: @emdash-cms/plugin-audit-log
packages/plugins/audit-log build: ◐ Building runtime entry...
packages/plugins/audit-log build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/audit-log build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/audit-log build: [34mℹ[39m Build start
packages/plugins/atproto build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-3zFeJd/runtime/[22m[1mplugin.mjs[22m        [2m19.93 kB[22m [2m│ gzip:  5.86 kB[22m
packages/plugins/atproto build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-3zFeJd/runtime/[22mplugin.mjs.map    [2m76.81 kB[22m [2m│ gzip: 17.04 kB[22m
packages/plugins/atproto build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-3zFeJd/runtime/[22mplugin.d.mts.map  [2m 0.79 kB[22m [2m│ gzip:  0.32 kB[22m
packages/plugins/atproto build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-3zFeJd/runtime/[22m[32m[1mplugin.d.mts[22m[39m      [2m 3.14 kB[22m [2m│ gzip:  0.80 kB[22m
packages/plugins/atproto build: [34mℹ[39m 4 files, total: 100.67 kB
packages/plugins/atproto build: [32m✔[39m Build complete in [32m1840ms[39m
packages/plugins/atproto build: ✔ Built plugin.mjs
packages/plugins/atproto build: ◐ Probing plugin surface...
packages/plugins/atproto build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/atproto build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/atproto build: [34mℹ[39m Build start
packages/plugins/atproto build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-3zFeJd/plugin-probe/[22m[1mplugin.mjs[22m  [2m36.24 kB[22m [2m│ gzip: 8.45 kB[22m
packages/plugins/atproto build: [34mℹ[39m 1 files, total: 36.24 kB
packages/plugins/atproto build: [32m✔[39m Build complete in [32m12ms[39m
packages/plugins/atproto build: ℹ   Hooks: plugin:install, content:afterSave, content:afterPublish, content:afterDelete, page:metadata
packages/plugins/atproto build: ℹ   Routes: status, test-connection, sync-publication, recent-syncs, verification, admin
packages/plugins/atproto build: ✔ Wrote manifest.json
packages/plugins/atproto build: ◐ Generating descriptor module...
packages/plugins/atproto build: ✔ Wrote index.mjs
packages/plugins/atproto build: ✔ Plugin built: atproto@0.2.0
packages/plugins/atproto build: ℹ Output:
packages/plugins/atproto build:   /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/atproto/dist/index.mjs
packages/plugins/atproto build:   /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/atproto/dist/plugin.mjs
packages/plugins/atproto build:   /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/atproto/dist/manifest.json
packages/plugins/audit-log build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-kUbY3t/runtime/[22m[1mplugin.mjs[22m        [2m 4.80 kB[22m [2m│ gzip: 1.60 kB[22m
packages/plugins/audit-log build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-kUbY3t/runtime/[22mplugin.mjs.map    [2m17.30 kB[22m [2m│ gzip: 4.37 kB[22m
packages/plugins/audit-log build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-kUbY3t/runtime/[22mplugin.d.mts.map  [2m 0.40 kB[22m [2m│ gzip: 0.21 kB[22m
packages/plugins/audit-log build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-kUbY3t/runtime/[22m[32m[1mplugin.d.mts[22m[39m      [2m 4.76 kB[22m [2m│ gzip: 0.81 kB[22m
packages/plugins/audit-log build: [34mℹ[39m 4 files, total: 27.26 kB
packages/plugins/audit-log build: [32m✔[39m Build complete in [32m1768ms[39m
packages/plugins/audit-log build: ✔ Built plugin.mjs
packages/plugins/audit-log build: ◐ Probing plugin surface...
packages/plugins/audit-log build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/audit-log build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/audit-log build: [34mℹ[39m Build start
packages/plugins/audit-log build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-kUbY3t/plugin-probe/[22m[1mplugin.mjs[22m  [2m8.20 kB[22m [2m│ gzip: 2.12 kB[22m
packages/plugins/audit-log build: [34mℹ[39m 1 files, total: 8.20 kB
packages/plugins/audit-log build: [32m✔[39m Build complete in [32m7ms[39m
packages/plugins/audit-log build: ℹ   Hooks: plugin:install, plugin:activate, plugin:deactivate, plugin:uninstall, content:beforeSave, content:afterSave, content:beforeDelete, content:afterDelete, media:afterUpload
packages/plugins/audit-log build: ℹ   Routes: admin, recent, history
packages/plugins/audit-log build: ✔ Wrote manifest.json
packages/plugins/audit-log build: ◐ Generating descriptor module...
packages/plugins/audit-log build: ✔ Wrote index.mjs
packages/plugins/audit-log build: ✔ Plugin built: audit-log@0.2.0
packages/plugins/audit-log build: ℹ Output:
packages/plugins/audit-log build:   /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/audit-log/dist/index.mjs
packages/plugins/audit-log build:   /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/audit-log/dist/plugin.mjs
packages/plugins/audit-log build:   /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/audit-log/dist/manifest.json
packages/plugins/atproto build: Done
packages/plugins/awcms-micro-gallery build$ tsdown
packages/plugins/audit-log build: Done
packages/plugins/awcms-micro-sikesra build$ tsdown
packages/plugins/awcms-micro-gallery build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-gallery/tsdown.config.ts[24m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m entry: [34msrc/index.ts, src/sandbox.ts[39m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m target: [34mes2023[39m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m Build start
packages/plugins/awcms-micro-gallery build: [34mℹ[39m Cleaning 10 files
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/tsdown.config.ts[24m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m entry: [34msrc/index.ts, src/admin.tsx, src/navigation.ts, src/sandbox.ts[39m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m target: [34mes2023[39m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m Build start
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m Cleaning 10 files
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[1msandbox/index.mjs[22m                  [2m43.63 kB[22m [2m│ gzip: 11.90 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[1mdb/playground-middleware.mjs[22m       [2m26.77 kB[22m [2m│ gzip:  8.07 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[1mdb/do.mjs[22m                          [2m17.43 kB[22m [2m│ gzip:  6.26 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[1mmedia/images-runtime.mjs[22m           [2m 7.44 kB[22m [2m│ gzip:  2.19 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[1mmedia/stream-runtime.mjs[22m           [2m 7.32 kB[22m [2m│ gzip:  2.27 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[1mcache/runtime.mjs[22m                  [2m 6.89 kB[22m [2m│ gzip:  2.50 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[1mindex.mjs[22m                          [2m 5.91 kB[22m [2m│ gzip:  2.22 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[1mplugins/index.mjs[22m                  [2m 5.33 kB[22m [2m│ gzip:  1.81 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[1mauth/index.mjs[22m                     [2m 4.71 kB[22m [2m│ gzip:  1.87 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[1mstorage/r2.mjs[22m                     [2m 4.19 kB[22m [2m│ gzip:  1.55 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[1mdb/d1.mjs[22m                          [2m 3.70 kB[22m [2m│ gzip:  1.72 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[1mcache/config.mjs[22m                   [2m 1.63 kB[22m [2m│ gzip:  0.83 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[1mdb/playground.mjs[22m                  [2m 1.14 kB[22m [2m│ gzip:  0.61 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22mdo-class-DYgovHsQ.mjs              [2m 6.67 kB[22m [2m│ gzip:  2.66 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22md1-introspector-DodJMbYx.mjs       [2m 1.92 kB[22m [2m│ gzip:  0.92 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22mdo-playground-routes-CmwFeGwJ.mjs  [2m 1.63 kB[22m [2m│ gzip:  0.77 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22mdo-dialect-CU1pWN54.mjs            [2m 1.37 kB[22m [2m│ gzip:  0.56 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[32m[1msandbox/index.d.mts[22m[39m                [2m 8.59 kB[22m [2m│ gzip:  2.48 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.mts[22m[39m                        [2m 5.80 kB[22m [2m│ gzip:  2.13 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[32m[1mdb/do.d.mts[22m[39m                        [2m 3.60 kB[22m [2m│ gzip:  1.46 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[32m[1mauth/index.d.mts[22m[39m                   [2m 2.17 kB[22m [2m│ gzip:  0.93 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[32m[1mcache/config.d.mts[22m[39m                 [2m 1.80 kB[22m [2m│ gzip:  0.85 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[32m[1mdb/d1.d.mts[22m[39m                        [2m 1.69 kB[22m [2m│ gzip:  0.83 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[32m[1mdb/playground.d.mts[22m[39m                [2m 1.57 kB[22m [2m│ gzip:  0.79 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[32m[1mcache/runtime.d.mts[22m[39m                [2m 1.17 kB[22m [2m│ gzip:  0.52 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[32m[1mstorage/r2.d.mts[22m[39m                   [2m 1.07 kB[22m [2m│ gzip:  0.52 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[32m[1mplugins/index.d.mts[22m[39m                [2m 0.89 kB[22m [2m│ gzip:  0.45 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[32m[1mdb/playground-middleware.d.mts[22m[39m     [2m 0.82 kB[22m [2m│ gzip:  0.49 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[32m[1mmedia/images-runtime.d.mts[22m[39m         [2m 0.36 kB[22m [2m│ gzip:  0.22 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[32m[1mmedia/stream-runtime.d.mts[22m[39m         [2m 0.36 kB[22m [2m│ gzip:  0.22 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[32mdo-class-BTfbOeYE.d.mts[39m            [2m 2.33 kB[22m [2m│ gzip:  1.09 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[32mimages-4RT9Ag8_.d.mts[39m              [2m 2.10 kB[22m [2m│ gzip:  0.76 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[32mstream-DdbcvKi0.d.mts[39m              [2m 1.93 kB[22m [2m│ gzip:  0.74 kB[22m
packages/cloudflare build: [34mℹ[39m [2mdist/[22m[32mdo-types-CY0G0oyh.d.mts[39m            [2m 0.47 kB[22m [2m│ gzip:  0.30 kB[22m
packages/cloudflare build: [34mℹ[39m 34 files, total: 184.40 kB
packages/cloudflare build: src/db/playground-middleware.ts (16:33) [33m[UNRESOLVED_IMPORT] Warning:[0m Could not resolve 'astro:middleware' in src/db/playground-middleware.ts
packages/cloudflare build:     [38;5;246m╭[0m[38;5;246m─[0m[38;5;246m[[0m src/db/playground-middleware.ts:16:34 [38;5;246m][0m
packages/cloudflare build:     [38;5;246m│[0m
packages/cloudflare build:  [38;5;246m16 │[0m [38;5;249mi[0m[38;5;249mm[0m[38;5;249mp[0m[38;5;249mo[0m[38;5;249mr[0m[38;5;249mt[0m[38;5;249m [0m[38;5;249m{[0m[38;5;249m [0m[38;5;249md[0m[38;5;249me[0m[38;5;249mf[0m[38;5;249mi[0m[38;5;249mn[0m[38;5;249me[0m[38;5;249mM[0m[38;5;249mi[0m[38;5;249md[0m[38;5;249md[0m[38;5;249ml[0m[38;5;249me[0m[38;5;249mw[0m[38;5;249ma[0m[38;5;249mr[0m[38;5;249me[0m[38;5;249m [0m[38;5;249m}[0m[38;5;249m [0m[38;5;249mf[0m[38;5;249mr[0m[38;5;249mo[0m[38;5;249mm[0m[38;5;249m [0m"astro:middleware"[38;5;249m;[0m
packages/cloudflare build:  [38;5;240m   │[0m                                  ─────────┬────────
packages/cloudflare build:  [38;5;240m   │[0m                                           ╰────────── Module not found, treating it as an external dependency
packages/cloudflare build: [38;5;246m────╯[0m
packages/cloudflare build: src/db/playground-middleware.ts (21:26) [33m[UNRESOLVED_IMPORT] Warning:[0m Could not resolve 'virtual:emdash/config' in src/db/playground-middleware.ts
packages/cloudflare build:     [38;5;246m╭[0m[38;5;246m─[0m[38;5;246m[[0m src/db/playground-middleware.ts:21:27 [38;5;246m][0m
packages/cloudflare build:     [38;5;246m│[0m
packages/cloudflare build:  [38;5;246m21 │[0m [38;5;249mi[0m[38;5;249mm[0m[38;5;249mp[0m[38;5;249mo[0m[38;5;249mr[0m[38;5;249mt[0m[38;5;249m [0m[38;5;249mv[0m[38;5;249mi[0m[38;5;249mr[0m[38;5;249mt[0m[38;5;249mu[0m[38;5;249ma[0m[38;5;249ml[0m[38;5;249mC[0m[38;5;249mo[0m[38;5;249mn[0m[38;5;249mf[0m[38;5;249mi[0m[38;5;249mg[0m[38;5;249m [0m[38;5;249mf[0m[38;5;249mr[0m[38;5;249mo[0m[38;5;249mm[0m[38;5;249m [0m"virtual:emdash/config"[38;5;249m;[0m
packages/cloudflare build:  [38;5;240m   │[0m                           ───────────┬───────────
packages/cloudflare build:  [38;5;240m   │[0m                                      ╰───────────── Module not found, treating it as an external dependency
packages/cloudflare build: [38;5;246m────╯[0m
packages/cloudflare build: [32m✔[39m Build complete in [32m2202ms[39m
packages/cloudflare build: Done
packages/plugins/marketplace-test build$ node node_modules/@emdash-cms/plugin-cli/dist/index.mjs build
packages/plugins/marketplace-test build: ◐ Building plugin...
packages/plugins/marketplace-test build: ℹ Manifest: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/marketplace-test/emdash-plugin.jsonc
packages/plugins/marketplace-test build: ℹ Plugin entry: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/marketplace-test/src/plugin.ts
packages/plugins/marketplace-test build: ℹ Package: @emdash-cms/plugin-marketplace-test
packages/plugins/marketplace-test build: ◐ Building runtime entry...
packages/plugins/marketplace-test build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/marketplace-test build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/marketplace-test build: [34mℹ[39m Build start
packages/plugins/awcms-micro-docs build: [34mℹ[39m [2mdist/[22m[1madmin.js[22m                 [2m 4.17 kB[22m [2m│ gzip: 0.98 kB[22m
packages/plugins/awcms-micro-docs build: [34mℹ[39m [2mdist/[22m[1mindex.js[22m                 [2m 0.97 kB[22m [2m│ gzip: 0.45 kB[22m
packages/plugins/awcms-micro-docs build: [34mℹ[39m [2mdist/[22mcontent-BL3jARXI.js.map  [2m10.48 kB[22m [2m│ gzip: 2.98 kB[22m
packages/plugins/awcms-micro-docs build: [34mℹ[39m [2mdist/[22mcontent-BL3jARXI.js      [2m 7.35 kB[22m [2m│ gzip: 2.43 kB[22m
packages/plugins/awcms-micro-docs build: [34mℹ[39m [2mdist/[22madmin.js.map             [2m 4.94 kB[22m [2m│ gzip: 1.46 kB[22m
packages/plugins/awcms-micro-docs build: [34mℹ[39m [2mdist/[22mindex.js.map             [2m 1.51 kB[22m [2m│ gzip: 0.63 kB[22m
packages/plugins/awcms-micro-docs build: [34mℹ[39m [2mdist/[22mindex.d.ts.map           [2m 0.58 kB[22m [2m│ gzip: 0.27 kB[22m
packages/plugins/awcms-micro-docs build: [34mℹ[39m [2mdist/[22madmin.d.ts.map           [2m 0.12 kB[22m [2m│ gzip: 0.12 kB[22m
packages/plugins/awcms-micro-docs build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.ts[22m[39m               [2m 1.30 kB[22m [2m│ gzip: 0.51 kB[22m
packages/plugins/awcms-micro-docs build: [34mℹ[39m [2mdist/[22m[32m[1madmin.d.ts[22m[39m               [2m 0.21 kB[22m [2m│ gzip: 0.15 kB[22m
packages/plugins/awcms-micro-docs build: [34mℹ[39m 10 files, total: 31.64 kB
packages/plugins/awcms-micro-docs build: [32m✔[39m Build complete in [32m3041ms[39m
packages/plugins/awcms-micro-docs build: Done
packages/plugins/sandboxed-test build$ node node_modules/@emdash-cms/plugin-cli/dist/index.mjs build
packages/plugins/sandboxed-test build: ◐ Building plugin...
packages/plugins/sandboxed-test build: ℹ Manifest: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/sandboxed-test/emdash-plugin.jsonc
packages/plugins/sandboxed-test build: ℹ Plugin entry: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/sandboxed-test/src/plugin.ts
packages/plugins/sandboxed-test build: ℹ Package: @emdash-cms/plugin-sandboxed-test
packages/plugins/sandboxed-test build: ◐ Building runtime entry...
packages/plugins/sandboxed-test build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/sandboxed-test build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/sandboxed-test build: [34mℹ[39m Build start
packages/plugins/awcms-micro-gallery build: [34mℹ[39m [2mdist/[22m[1mindex.mjs[22m                    [2m29.41 kB[22m [2m│ gzip:  6.79 kB[22m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m [2mdist/[22m[1msandbox.mjs[22m                  [2m22.16 kB[22m [2m│ gzip:  5.32 kB[22m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m [2mdist/[22mindex.mjs.map                [2m55.97 kB[22m [2m│ gzip: 12.38 kB[22m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m [2mdist/[22msandbox.mjs.map              [2m43.13 kB[22m [2m│ gzip:  9.87 kB[22m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m [2mdist/[22mvalidation-DzkH05cg.mjs.map  [2m24.53 kB[22m [2m│ gzip:  5.62 kB[22m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m [2mdist/[22mvalidation-DzkH05cg.mjs      [2m14.98 kB[22m [2m│ gzip:  3.73 kB[22m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m [2mdist/[22mindex.d.mts.map              [2m 0.87 kB[22m [2m│ gzip:  0.36 kB[22m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m [2mdist/[22msandbox.d.mts.map            [2m 0.12 kB[22m [2m│ gzip:  0.12 kB[22m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.mts[22m[39m                  [2m 3.57 kB[22m [2m│ gzip:  1.02 kB[22m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m [2mdist/[22m[32m[1msandbox.d.mts[22m[39m                [2m 0.21 kB[22m [2m│ gzip:  0.16 kB[22m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m 10 files, total: 194.95 kB
packages/plugins/awcms-micro-gallery build: [32m✔[39m Build complete in [32m1815ms[39m
packages/plugins/awcms-micro-gallery build: Done
packages/plugins/webhook-notifier build$ node node_modules/@emdash-cms/plugin-cli/dist/index.mjs build
packages/plugins/marketplace-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-MVBQz7/runtime/[22m[1mplugin.mjs[22m        [2m0.58 kB[22m [2m│ gzip: 0.34 kB[22m
packages/plugins/marketplace-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-MVBQz7/runtime/[22mplugin.mjs.map    [2m2.47 kB[22m [2m│ gzip: 1.12 kB[22m
packages/plugins/marketplace-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-MVBQz7/runtime/[22mplugin.d.mts.map  [2m0.18 kB[22m [2m│ gzip: 0.15 kB[22m
packages/plugins/marketplace-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-MVBQz7/runtime/[22m[32m[1mplugin.d.mts[22m[39m      [2m1.59 kB[22m [2m│ gzip: 0.70 kB[22m
packages/plugins/marketplace-test build: [34mℹ[39m 4 files, total: 4.82 kB
packages/plugins/marketplace-test build: [32m✔[39m Build complete in [32m1632ms[39m
packages/plugins/marketplace-test build: ✔ Built plugin.mjs
packages/plugins/marketplace-test build: ◐ Probing plugin surface...
packages/plugins/marketplace-test build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/marketplace-test build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/marketplace-test build: [34mℹ[39m Build start
packages/plugins/marketplace-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-MVBQz7/plugin-probe/[22m[1mplugin.mjs[22m  [2m0.85 kB[22m [2m│ gzip: 0.44 kB[22m
packages/plugins/marketplace-test build: [34mℹ[39m 1 files, total: 0.85 kB
packages/plugins/marketplace-test build: [32m✔[39m Build complete in [32m8ms[39m
packages/plugins/marketplace-test build: ℹ   Hooks: content:beforeSave
packages/plugins/marketplace-test build: ℹ   Routes: ping, events
packages/plugins/marketplace-test build: ✔ Wrote manifest.json
packages/plugins/marketplace-test build: ◐ Generating descriptor module...
packages/plugins/marketplace-test build: ✔ Wrote index.mjs
packages/plugins/marketplace-test build: ✔ Plugin built: marketplace-test@0.1.2
packages/plugins/marketplace-test build: ℹ Output:
packages/plugins/marketplace-test build:   /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/marketplace-test/dist/index.mjs
packages/plugins/marketplace-test build:   /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/marketplace-test/dist/plugin.mjs
packages/plugins/marketplace-test build:   /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/marketplace-test/dist/manifest.json
packages/plugins/marketplace-test build: Done
packages/workerd build$ tsdown
packages/plugins/webhook-notifier build: ◐ Building plugin...
packages/plugins/webhook-notifier build: ℹ Manifest: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/webhook-notifier/emdash-plugin.jsonc
packages/plugins/webhook-notifier build: ℹ Plugin entry: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/webhook-notifier/src/plugin.ts
packages/plugins/webhook-notifier build: ℹ Package: @emdash-cms/plugin-webhook-notifier
packages/workerd build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/plugins/webhook-notifier build: ◐ Building runtime entry...
packages/plugins/webhook-notifier build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/webhook-notifier build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/webhook-notifier build: [34mℹ[39m Build start
packages/workerd build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/workerd/tsdown.config.ts[24m
packages/workerd build: [34mℹ[39m entry: [34msrc/index.ts, src/sandbox/index.ts[39m
packages/workerd build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/workerd build: [34mℹ[39m Build start
packages/workerd build: [34mℹ[39m Cleaning 7 files
packages/plugins/sandboxed-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-QMVN38/runtime/[22m[1mplugin.mjs[22m        [2m19.59 kB[22m [2m│ gzip:  5.31 kB[22m
packages/plugins/sandboxed-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-QMVN38/runtime/[22mplugin.mjs.map    [2m62.07 kB[22m [2m│ gzip: 13.43 kB[22m
packages/plugins/sandboxed-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-QMVN38/runtime/[22mplugin.d.mts.map  [2m 1.75 kB[22m [2m│ gzip:  0.37 kB[22m
packages/plugins/sandboxed-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-QMVN38/runtime/[22m[32m[1mplugin.d.mts[22m[39m      [2m 8.47 kB[22m [2m│ gzip:  1.15 kB[22m
packages/plugins/sandboxed-test build: [34mℹ[39m 4 files, total: 91.88 kB
packages/plugins/sandboxed-test build: src/plugin.ts (359:24) [33m[EVAL] Warning:[0m Use of direct `eval` function is strongly discouraged as it poses security risks and may cause issues with minification.
packages/plugins/sandboxed-test build:      [38;5;246m╭[0m[38;5;246m─[0m[38;5;246m[[0m src/plugin.ts:359:25 [38;5;246m][0m
packages/plugins/sandboxed-test build:      [38;5;246m│[0m
packages/plugins/sandboxed-test build:  [38;5;246m359 │[0m [38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249mc[0m[38;5;249mo[0m[38;5;249mn[0m[38;5;249ms[0m[38;5;249mt[0m[38;5;249m [0m[38;5;249me[0m[38;5;249mv[0m[38;5;249ma[0m[38;5;249ml[0m[38;5;249mR[0m[38;5;249me[0m[38;5;249ms[0m[38;5;249mu[0m[38;5;249ml[0m[38;5;249mt[0m[38;5;249m [0m[38;5;249m=[0m[38;5;249m [0meval[38;5;249m([0m[38;5;249m"[0m[38;5;249m1[0m[38;5;249m [0m[38;5;249m+[0m[38;5;249m [0m[38;5;249m1[0m[38;5;249m"[0m[38;5;249m)[0m[38;5;249m;[0m
packages/plugins/sandboxed-test build:  [38;5;240m    │[0m                                  ──┬─
packages/plugins/sandboxed-test build:  [38;5;240m    │[0m                                    ╰─── Use of direct `eval` here.
packages/plugins/sandboxed-test build:  [38;5;240m    │[0m
packages/plugins/sandboxed-test build:  [38;5;240m    │[0m [38;5;115mHelp[0m: Consider using indirect eval. For more information, check the documentation: https://rolldown.rs/guide/troubleshooting#avoiding-direct-eval
packages/plugins/sandboxed-test build: [38;5;246m─────╯[0m
packages/plugins/sandboxed-test build: src/plugin.ts (1049:2) [33m[EVAL] Warning:[0m Use of direct `eval` function is strongly discouraged as it poses security risks and may cause issues with minification.
packages/plugins/sandboxed-test build:       [38;5;246m╭[0m[38;5;246m─[0m[38;5;246m[[0m src/plugin.ts:1049:3 [38;5;246m][0m
packages/plugins/sandboxed-test build:       [38;5;246m│[0m
packages/plugins/sandboxed-test build:  [38;5;246m1049 │[0m [38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0meval[38;5;249m([0m[38;5;249m"[0m[38;5;249m1[0m[38;5;249m+[0m[38;5;249m1[0m[38;5;249m"[0m[38;5;249m)[0m[38;5;249m;[0m
packages/plugins/sandboxed-test build:  [38;5;240m     │[0m        ──┬─
packages/plugins/sandboxed-test build:  [38;5;240m     │[0m          ╰─── Use of direct `eval` here.
packages/plugins/sandboxed-test build:  [38;5;240m     │[0m
packages/plugins/sandboxed-test build:  [38;5;240m     │[0m [38;5;115mHelp[0m: Consider using indirect eval. For more information, check the documentation: https://rolldown.rs/guide/troubleshooting#avoiding-direct-eval
packages/plugins/sandboxed-test build: [38;5;246m──────╯[0m
packages/plugins/sandboxed-test build: [32m✔[39m Build complete in [32m1748ms[39m
packages/plugins/sandboxed-test build: ✔ Built plugin.mjs
packages/plugins/sandboxed-test build: ◐ Probing plugin surface...
packages/plugins/sandboxed-test build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/sandboxed-test build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/sandboxed-test build: [34mℹ[39m Build start
packages/plugins/sandboxed-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-QMVN38/plugin-probe/[22m[1mplugin.mjs[22m  [2m29.37 kB[22m [2m│ gzip: 6.51 kB[22m
packages/plugins/sandboxed-test build: [34mℹ[39m 1 files, total: 29.37 kB
packages/plugins/sandboxed-test build: src/plugin.ts (359:24) [33m[EVAL] Warning:[0m Use of direct `eval` function is strongly discouraged as it poses security risks and may cause issues with minification.
packages/plugins/sandboxed-test build:      [38;5;246m╭[0m[38;5;246m─[0m[38;5;246m[[0m src/plugin.ts:359:25 [38;5;246m][0m
packages/plugins/sandboxed-test build:      [38;5;246m│[0m
packages/plugins/sandboxed-test build:  [38;5;246m359 │[0m [38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249mc[0m[38;5;249mo[0m[38;5;249mn[0m[38;5;249ms[0m[38;5;249mt[0m[38;5;249m [0m[38;5;249me[0m[38;5;249mv[0m[38;5;249ma[0m[38;5;249ml[0m[38;5;249mR[0m[38;5;249me[0m[38;5;249ms[0m[38;5;249mu[0m[38;5;249ml[0m[38;5;249mt[0m[38;5;249m [0m[38;5;249m=[0m[38;5;249m [0meval[38;5;249m([0m[38;5;249m"[0m[38;5;249m1[0m[38;5;249m [0m[38;5;249m+[0m[38;5;249m [0m[38;5;249m1[0m[38;5;249m"[0m[38;5;249m)[0m[38;5;249m;[0m
packages/plugins/sandboxed-test build:  [38;5;240m    │[0m                                  ──┬─
packages/plugins/sandboxed-test build:  [38;5;240m    │[0m                                    ╰─── Use of direct `eval` here.
packages/plugins/sandboxed-test build:  [38;5;240m    │[0m
packages/plugins/sandboxed-test build:  [38;5;240m    │[0m [38;5;115mHelp[0m: Consider using indirect eval. For more information, check the documentation: https://rolldown.rs/guide/troubleshooting#avoiding-direct-eval
packages/plugins/sandboxed-test build: [38;5;246m─────╯[0m
packages/plugins/sandboxed-test build: src/plugin.ts (1049:2) [33m[EVAL] Warning:[0m Use of direct `eval` function is strongly discouraged as it poses security risks and may cause issues with minification.
packages/plugins/sandboxed-test build:       [38;5;246m╭[0m[38;5;246m─[0m[38;5;246m[[0m src/plugin.ts:1049:3 [38;5;246m][0m
packages/plugins/sandboxed-test build:       [38;5;246m│[0m
packages/plugins/sandboxed-test build:  [38;5;246m1049 │[0m [38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0meval[38;5;249m([0m[38;5;249m"[0m[38;5;249m1[0m[38;5;249m+[0m[38;5;249m1[0m[38;5;249m"[0m[38;5;249m)[0m[38;5;249m;[0m
packages/plugins/sandboxed-test build:  [38;5;240m     │[0m        ──┬─
packages/plugins/sandboxed-test build:  [38;5;240m     │[0m          ╰─── Use of direct `eval` here.
packages/plugins/sandboxed-test build:  [38;5;240m     │[0m
packages/plugins/sandboxed-test build:  [38;5;240m     │[0m [38;5;115mHelp[0m: Consider using indirect eval. For more information, check the documentation: https://rolldown.rs/guide/troubleshooting#avoiding-direct-eval
packages/plugins/sandboxed-test build: [38;5;246m──────╯[0m
packages/plugins/sandboxed-test build: [32m✔[39m Build complete in [32m11ms[39m
packages/plugins/sandboxed-test build: ℹ   Hooks: content:beforeSave, content:afterSave
packages/plugins/sandboxed-test build: ℹ   Routes: admin, ping, debug/http, kv/test, storage/test, content/list, http/test, enforce/blocked-host, enforce/kv-isolation, enforce/storage-isolation, enforce/no-direct-db, enforce/globals-blocked, evil/exfil-to-attacker, evil/steal-other-plugin-kv, evil/steal-other-plugin-storage, evil/access-raw-db, evil/escalate-capabilities, evil/run-all, enforce/run-all
packages/plugins/sandboxed-test build: ✔ Wrote manifest.json
packages/plugins/sandboxed-test build: ◐ Generating descriptor module...
packages/plugins/sandboxed-test build: ✔ Wrote index.mjs
packages/plugins/sandboxed-test build: ✔ Plugin built: sandboxed-test@0.0.3
packages/plugins/sandboxed-test build: ℹ Output:
packages/plugins/sandboxed-test build:   /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/sandboxed-test/dist/index.mjs
packages/plugins/sandboxed-test build:   /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/sandboxed-test/dist/plugin.mjs
packages/plugins/sandboxed-test build:   /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/sandboxed-test/dist/manifest.json
packages/plugins/sandboxed-test build: Done
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22m[1madmin.js[22m                           [2m256.66 kB[22m [2m│ gzip: 45.94 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22m[1mindex.js[22m                           [2m  1.91 kB[22m [2m│ gzip:  0.71 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22m[1mnavigation.js[22m                      [2m  0.78 kB[22m [2m│ gzip:  0.32 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22m[1msandbox.js[22m                         [2m  0.30 kB[22m [2m│ gzip:  0.21 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22mruntime-BaXF2ney.js                [2m108.24 kB[22m [2m│ gzip: 20.48 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22mAwcmsPluginHeaderMenu-CnQixOjS.js  [2m 13.95 kB[22m [2m│ gzip:  3.27 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22m[32m[1mnavigation.d.ts[22m[39m                    [2m  6.04 kB[22m [2m│ gzip:  1.38 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.ts[22m[39m                         [2m  3.34 kB[22m [2m│ gzip:  0.97 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22m[32m[1msandbox.d.ts[22m[39m                       [2m  2.23 kB[22m [2m│ gzip:  0.50 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22m[32m[1madmin.d.ts[22m[39m                         [2m  1.17 kB[22m [2m│ gzip:  0.47 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m 10 files, total: 394.61 kB
packages/plugins/awcms-micro-sikesra build: [32m✔[39m Build complete in [32m3277ms[39m
packages/plugins/awcms-micro-sikesra build: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugin `rolldown-plugin-dts:generate`. See https://rolldown.rs/options/checks#plugintimings for more details.
packages/plugins/awcms-micro-sikesra build: Done
packages/plugins/webhook-notifier build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-Mr7TTk/runtime/[22m[1mplugin.mjs[22m        [2m 9.25 kB[22m [2m│ gzip: 3.05 kB[22m
packages/plugins/webhook-notifier build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-Mr7TTk/runtime/[22mplugin.mjs.map    [2m28.71 kB[22m [2m│ gzip: 7.20 kB[22m
packages/plugins/webhook-notifier build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-Mr7TTk/runtime/[22mplugin.d.mts.map  [2m 0.30 kB[22m [2m│ gzip: 0.21 kB[22m
packages/plugins/webhook-notifier build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-Mr7TTk/runtime/[22m[32m[1mplugin.d.mts[22m[39m      [2m 2.94 kB[22m [2m│ gzip: 0.70 kB[22m
packages/plugins/webhook-notifier build: [34mℹ[39m 4 files, total: 41.20 kB
packages/plugins/webhook-notifier build: [32m✔[39m Build complete in [32m1740ms[39m
packages/plugins/webhook-notifier build: ✔ Built plugin.mjs
packages/plugins/webhook-notifier build: ◐ Probing plugin surface...
packages/plugins/webhook-notifier build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/webhook-notifier build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/webhook-notifier build: [34mℹ[39m Build start
packages/plugins/webhook-notifier build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-Mr7TTk/plugin-probe/[22m[1mplugin.mjs[22m  [2m14.88 kB[22m [2m│ gzip: 3.94 kB[22m
packages/plugins/webhook-notifier build: [34mℹ[39m 1 files, total: 14.88 kB
packages/plugins/webhook-notifier build: [32m✔[39m Build complete in [32m8ms[39m
packages/plugins/webhook-notifier build: ℹ   Hooks: content:afterSave, content:afterDelete, media:afterUpload
packages/plugins/webhook-notifier build: ℹ   Routes: admin, status, settings, settings/save, test
packages/plugins/webhook-notifier build: ✔ Wrote manifest.json
packages/plugins/webhook-notifier build: ◐ Generating descriptor module...
packages/plugins/webhook-notifier build: ✔ Wrote index.mjs
packages/plugins/webhook-notifier build: ✔ Plugin built: webhook-notifier@0.2.0
packages/plugins/webhook-notifier build: ℹ Output:
packages/plugins/webhook-notifier build:   /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/webhook-notifier/dist/index.mjs
packages/plugins/webhook-notifier build:   /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/webhook-notifier/dist/plugin.mjs
packages/plugins/webhook-notifier build:   /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/webhook-notifier/dist/manifest.json
packages/plugins/webhook-notifier build: Done
packages/workerd build: [34mℹ[39m [2mdist/[22m[1msandbox/index.mjs[22m              [2m 0.24 kB[22m [2m│ gzip:  0.15 kB[22m
packages/workerd build: [34mℹ[39m [2mdist/[22m[1mindex.mjs[22m                      [2m 0.18 kB[22m [2m│ gzip:  0.13 kB[22m
packages/workerd build: [34mℹ[39m [2mdist/[22mrunner-DPvq5mbQ.mjs            [2m83.97 kB[22m [2m│ gzip: 21.86 kB[22m
packages/workerd build: [34mℹ[39m [2mdist/[22m[32m[1msandbox/index.d.mts[22m[39m            [2m 0.25 kB[22m [2m│ gzip:  0.15 kB[22m
packages/workerd build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.mts[22m[39m                    [2m 0.18 kB[22m [2m│ gzip:  0.14 kB[22m
packages/workerd build: [34mℹ[39m [2mdist/[22m[32mbridge-handler-O1ayzB49.d.mts[39m  [2m11.52 kB[22m [2m│ gzip:  3.97 kB[22m
packages/workerd build: [34mℹ[39m 6 files, total: 96.34 kB
packages/workerd build: [32m✔[39m Build complete in [32m1792ms[39m
packages/workerd build: Done
$ node scripts/relink-bins-if-needed.mjs
$ pnpm typecheck
==> pnpm-typecheck
$ pnpm run --filter {./packages/**} typecheck
Scope: 32 of 61 workspace projects
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
packages/registry-lexicons typecheck$ tsgo --noEmit
packages/plugin-types typecheck: Done
packages/x402 typecheck$ tsgo --noEmit
packages/blocks typecheck: Done
packages/registry-lexicons typecheck: Done
packages/x402 typecheck: Done
packages/marketplace typecheck: Done
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
packages/plugins/awcms-micro-docs typecheck$ tsc --noEmit -p tsconfig.json
packages/plugins/atproto typecheck: Done
packages/plugins/awcms-micro-gallery typecheck$ tsc --noEmit -p tsconfig.json
packages/cloudflare typecheck: Done
packages/plugins/awcms-micro-sikesra typecheck$ tsc --noEmit -p tsconfig.json
packages/plugins/ai-moderation typecheck: Done
packages/plugins/color typecheck$ tsgo --noEmit
packages/plugins/color typecheck: Done
packages/plugins/embeds typecheck$ tsgo --noEmit
packages/plugins/embeds typecheck: Done
packages/plugins/field-kit typecheck$ tsgo --noEmit
packages/plugins/field-kit typecheck: Done
packages/plugins/forms typecheck$ tsgo --noEmit
packages/plugins/forms typecheck: Done
packages/plugins/marketplace-test typecheck$ tsgo --noEmit
packages/plugins/marketplace-test typecheck: Done
packages/plugins/sandboxed-test typecheck$ tsgo --noEmit
packages/plugins/sandboxed-test typecheck: Done
packages/plugins/webhook-notifier typecheck$ tsgo --noEmit
packages/plugins/webhook-notifier typecheck: Done
packages/workerd typecheck$ tsgo --noEmit
packages/plugins/awcms-micro-gallery typecheck: Done
packages/workerd typecheck: Done
packages/plugins/awcms-micro-docs typecheck: Done
packages/plugins/awcms-micro-sikesra typecheck: Done
$ pnpm lint:quick
==> pnpm-lint-quick
$ oxlint -f json
{ "diagnostics": [],
              "number_of_files": 1867,
              "number_of_rules": 138,
              "threads_count": 20,
              "start_time": 1.679157937
            }
            $ pnpm --filter @emdash-cms/admin exec node --run locale:compile
==> pnpm-admin-locale-compile
Compiling message catalogs…
Done in 486ms
$ pnpm --filter @emdash-cms/admin exec playwright install chromium
==> playwright-install-chromium
BEWARE: your OS is not officially supported by Playwright; downloading fallback build for ubuntu24.04-x64.
BEWARE: your OS is not officially supported by Playwright; downloading fallback build for ubuntu24.04-x64.
BEWARE: your OS is not officially supported by Playwright; downloading fallback build for ubuntu24.04-x64.
$ pnpm test
==> pnpm-test
$ pnpm run --filter {./packages/*} test
Scope: 17 of 61 workspace projects
packages/atproto-test-utils test$ vitest run
packages/blocks test$ vitest
packages/auth test$ vitest
packages/contentful-to-portable-text test$ vitest
packages/blocks test: 8:27:09 AM [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
packages/blocks test: `optimizeDeps.rollupOptions` / `ssr.optimizeDeps.rollupOptions` is deprecated. Use `optimizeDeps.rolldownOptions` instead. Note that this option may be set by a plugin. Set VITE_DEPRECATION_TRACE=1 to see where it is called.
packages/blocks test: Both esbuild and oxc options were set. oxc options will be used and esbuild options will be ignored. The following esbuild options were set: `{ jsx: 'automatic', jsxImportSource: undefined }`
packages/auth test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/auth
packages/blocks test: [vite:react-babel] We recommend switching to `@vitejs/plugin-react-oxc` for improved performance. More information at https://vite.dev/rolldown
packages/atproto-test-utils test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/atproto-test-utils
packages/blocks test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/blocks
packages/contentful-to-portable-text test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/contentful-to-portable-text
packages/contentful-to-portable-text test:  Test Files  2 passed (2)
packages/contentful-to-portable-text test:       Tests  60 passed (60)
packages/contentful-to-portable-text test:    Start at  08:27:09
packages/contentful-to-portable-text test:    Duration  328ms (transform 292ms, setup 0ms, import 357ms, tests 36ms, environment 0ms)
packages/auth test:  Test Files  5 passed (5)
packages/auth test:       Tests  57 passed (57)
packages/auth test:    Start at  08:27:09
packages/auth test:    Duration  380ms (transform 299ms, setup 0ms, import 592ms, tests 289ms, environment 1ms)
packages/contentful-to-portable-text test: Done
packages/create-emdash test$ vitest run
packages/auth test: Done
packages/gutenberg-to-portable-text test$ vitest
packages/atproto-test-utils test:  Test Files  1 passed (1)
packages/atproto-test-utils test:       Tests  17 passed (17)
packages/atproto-test-utils test:    Start at  08:27:09
packages/atproto-test-utils test:    Duration  614ms (transform 101ms, setup 0ms, import 291ms, tests 179ms, environment 0ms)
packages/atproto-test-utils test: Done
packages/marketplace test$ vitest
packages/gutenberg-to-portable-text test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/gutenberg-to-portable-text
packages/create-emdash test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/create-emdash
packages/blocks test:  Test Files  3 passed (3)
packages/blocks test:       Tests  96 passed (96)
packages/blocks test:    Start at  08:27:09
packages/blocks test:    Duration  894ms (transform 303ms, setup 0ms, import 601ms, tests 274ms, environment 1.10s)
packages/create-emdash test:  Test Files  2 passed (2)
packages/create-emdash test:       Tests  103 passed (103)
packages/create-emdash test:    Start at  08:27:10
packages/create-emdash test:    Duration  206ms (transform 103ms, setup 0ms, import 149ms, tests 36ms, environment 0ms)
packages/blocks test: Done
packages/plugin-types test$ vitest run
packages/gutenberg-to-portable-text test:  Test Files  2 passed (2)
packages/gutenberg-to-portable-text test:       Tests  140 passed (140)
packages/gutenberg-to-portable-text test:    Start at  08:27:10
packages/gutenberg-to-portable-text test:    Duration  290ms (transform 146ms, setup 0ms, import 241ms, tests 61ms, environment 0ms)
packages/create-emdash test: Done
packages/marketplace test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/marketplace
packages/registry-lexicons test$ vitest run
packages/gutenberg-to-portable-text test: Done
packages/x402 test$ vitest
packages/marketplace test:  Test Files  4 passed (4)
packages/marketplace test:       Tests  43 passed (43)
packages/marketplace test:    Start at  08:27:10
packages/marketplace test:    Duration  206ms (transform 113ms, setup 0ms, import 216ms, tests 39ms, environment 0ms)
packages/registry-lexicons test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-lexicons
packages/marketplace test: Done
packages/plugin-types test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugin-types
packages/x402 test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/x402
packages/plugin-types test:  Test Files  2 passed (2)
packages/plugin-types test:       Tests  27 passed (27)
packages/plugin-types test:    Start at  08:27:11
packages/plugin-types test:    Duration  165ms (transform 66ms, setup 0ms, import 99ms, tests 14ms, environment 0ms)
packages/plugin-types test: Done
packages/registry-lexicons test:  Test Files  1 passed (1)
packages/registry-lexicons test:       Tests  10 passed (10)
packages/registry-lexicons test:    Start at  08:27:11
packages/registry-lexicons test:    Duration  240ms (transform 72ms, setup 0ms, import 122ms, tests 13ms, environment 0ms)
packages/registry-lexicons test: Done
packages/x402 test:  Test Files  1 passed (1)
packages/x402 test:       Tests  17 passed (17)
packages/x402 test:    Start at  08:27:11
packages/x402 test:    Duration  239ms (transform 53ms, setup 0ms, import 58ms, tests 46ms, environment 0ms)
packages/x402 test: Done
packages/registry-client test$ vitest run
packages/registry-client test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-client
packages/registry-client test:  Test Files  3 passed (3)
packages/registry-client test:       Tests  37 passed (37)
packages/registry-client test:    Start at  08:27:11
packages/registry-client test:    Duration  279ms (transform 171ms, setup 0ms, import 321ms, tests 82ms, environment 0ms)
packages/registry-client test: Done
packages/admin test$ vitest
packages/plugin-cli test$ vitest run
packages/plugin-cli test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugin-cli
packages/admin test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin
packages/admin test: 8:27:12 AM [vite] (client) Re-optimizing dependencies because lockfile has changed
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/editor/slash-menu.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/editor/bubble-menu.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/components/settings/AllowedDomainsSettings.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/editor/toolbar.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/components/users/UserDetail.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/components/RevisionHistory.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/plugin-cli test:  Test Files  18 passed (18)
packages/plugin-cli test:       Tests  316 passed (316)
packages/plugin-cli test:    Start at  08:27:12
packages/plugin-cli test:    Duration  10.40s (transform 2.83s, setup 0ms, import 5.42s, tests 10.48s, environment 2ms)
packages/plugin-cli test: Done
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/components/users/InviteUserModal.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/editor/block-menu.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/lib/hooks.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  Test Files  68 passed (68)
packages/admin test:       Tests  918 passed (918)
packages/admin test:    Start at  08:27:12
packages/admin test:    Duration  21.28s (transform 0ms, setup 5.56s, import 118.14s, tests 58.65s, environment 0ms)
packages/admin test: Done
packages/auth-atproto test$ vitest run
packages/core test$ vitest
packages/core test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/core
packages/auth-atproto test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/auth-atproto
packages/auth-atproto test:  Test Files  3 passed (3)
packages/auth-atproto test:       Tests  30 passed (30)
packages/auth-atproto test:    Start at  08:27:34
packages/auth-atproto test:    Duration  327ms (transform 287ms, setup 0ms, import 422ms, tests 129ms, environment 0ms)
packages/auth-atproto test: Done
packages/core test:  Test Files  221 passed (221)
packages/core test:       Tests  3481 passed (3481)
packages/core test:    Start at  08:27:34
packages/core test:    Duration  15.02s (transform 23.66s, setup 0ms, import 100.21s, tests 139.65s, environment 29ms)
packages/core test: Done
packages/cloudflare test$ vitest run
packages/workerd test$ vitest run
packages/cloudflare test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/cloudflare
packages/workerd test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/workerd
packages/cloudflare test:  Test Files  8 passed (8)
packages/cloudflare test:       Tests  157 passed (157)
packages/cloudflare test:    Start at  08:27:49
packages/cloudflare test:    Duration  372ms (transform 335ms, setup 0ms, import 743ms, tests 109ms, environment 1ms)
packages/cloudflare test: Done
packages/workerd test:  Test Files  11 passed (11)
packages/workerd test:       Tests  73 passed (73)
packages/workerd test:    Start at  08:27:49
packages/workerd test:    Duration  9.21s (transform 5.83s, setup 0ms, import 10.68s, tests 8.78s, environment 1ms)
packages/workerd test: Done
```
