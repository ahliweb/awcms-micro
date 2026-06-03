# Last Validation

## Validation Run Metadata

- Date:
  - Started: 2026-06-03T05:29:44Z
  - Completed: 2026-06-03T05:31:45Z
- Operator: unggul
- Branch: `main`
- Upstream commit SHA: `cd2dcc6a56d19f38d6e13ba55e8563ceaab90ef8`
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
Packages: +1633
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Progress: resolved 1633, reused 1617, downloaded 1, added 1630
Progress: resolved 1633, reused 1617, downloaded 2, added 1633, done

devDependencies:
+ @axe-core/playwright 4.11.3
+ @changesets/changelog-github 0.7.0
+ @changesets/cli 2.31.0
+ @e18e/eslint-plugin 0.5.0
+ @lunariajs/core 0.1.1
+ @playwright/test 1.60.0
+ @types/node 24.10.13
+ @typescript/native-preview 7.0.0-dev.20260421.2
+ emdash 0.16.1 <- packages/core
+ knip 5.84.1
+ oxfmt 0.52.0
+ oxlint 1.67.0
+ oxlint-tsgolint 0.23.0
+ pkg-pr-new 0.0.75
+ prettier 3.8.3
+ prettier-plugin-astro 0.14.1
+ typescript 6.0.0-beta

packages/plugins/awcms-micro-docs prepare$ node --run build
packages/plugins/awcms-micro-gallery prepare$ node --run build
packages/plugins/awcms-micro-sikesra prepare$ node --run build
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-gallery/tsdown.config.ts[24m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m entry: [34msrc/index.ts, src/sandbox.ts[39m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m target: [34mes2023[39m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m Build start
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m Cleaning 10 files
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-docs/tsdown.config.ts[24m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m entry: [34msrc/index.ts, src/admin.tsx[39m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m target: [34mes2023[39m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m Build start
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m Cleaning 10 files
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/tsdown.config.ts[24m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m entry: [34msrc/index.ts, src/admin.tsx, src/navigation.ts, src/sandbox.ts[39m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m target: [34mes2023[39m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m Build start
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m Cleaning 11 files
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22m[1mindex.mjs[22m                    [2m29.41 kB[22m [2m│ gzip:  6.79 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22m[1msandbox.mjs[22m                  [2m22.16 kB[22m [2m│ gzip:  5.32 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22mindex.mjs.map                [2m55.97 kB[22m [2m│ gzip: 12.38 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22msandbox.mjs.map              [2m43.13 kB[22m [2m│ gzip:  9.87 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22mvalidation-DWdjFPTC.mjs.map  [2m24.91 kB[22m [2m│ gzip:  5.77 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22mvalidation-DWdjFPTC.mjs      [2m15.10 kB[22m [2m│ gzip:  3.76 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22mindex.d.mts.map              [2m 0.87 kB[22m [2m│ gzip:  0.36 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22msandbox.d.mts.map            [2m 0.12 kB[22m [2m│ gzip:  0.12 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.mts[22m[39m                  [2m 3.57 kB[22m [2m│ gzip:  1.02 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22m[32m[1msandbox.d.mts[22m[39m                [2m 0.21 kB[22m [2m│ gzip:  0.16 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m 10 files, total: 195.45 kB
packages/plugins/awcms-micro-gallery prepare: [32m✔[39m Build complete in [32m1705ms[39m
packages/plugins/awcms-micro-gallery prepare: Done
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m [2mdist/[22m[1madmin.js[22m                 [2m 4.17 kB[22m [2m│ gzip: 0.98 kB[22m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m [2mdist/[22m[1mindex.js[22m                 [2m 0.97 kB[22m [2m│ gzip: 0.45 kB[22m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m [2mdist/[22mcontent-DohiaJ-8.js.map  [2m10.48 kB[22m [2m│ gzip: 2.98 kB[22m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m [2mdist/[22mcontent-DohiaJ-8.js      [2m 7.35 kB[22m [2m│ gzip: 2.43 kB[22m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m [2mdist/[22madmin.js.map             [2m 4.94 kB[22m [2m│ gzip: 1.46 kB[22m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m [2mdist/[22mindex.js.map             [2m 1.51 kB[22m [2m│ gzip: 0.63 kB[22m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m [2mdist/[22mindex.d.ts.map           [2m 0.58 kB[22m [2m│ gzip: 0.27 kB[22m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m [2mdist/[22madmin.d.ts.map           [2m 0.12 kB[22m [2m│ gzip: 0.12 kB[22m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.ts[22m[39m               [2m 1.30 kB[22m [2m│ gzip: 0.51 kB[22m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m [2mdist/[22m[32m[1madmin.d.ts[22m[39m               [2m 0.21 kB[22m [2m│ gzip: 0.15 kB[22m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m 10 files, total: 31.64 kB
packages/plugins/awcms-micro-docs prepare: [32m✔[39m Build complete in [32m2483ms[39m
packages/plugins/awcms-micro-docs prepare: Done
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22m[1madmin.js[22m                           [2m345.56 kB[22m [2m│ gzip: 58.76 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22m[1mindex.js[22m                           [2m  2.78 kB[22m [2m│ gzip:  0.99 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22m[1mnavigation.js[22m                      [2m  0.78 kB[22m [2m│ gzip:  0.32 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22m[1msandbox.js[22m                         [2m  0.30 kB[22m [2m│ gzip:  0.21 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22mruntime-BH7Sl_fq.js                [2m305.15 kB[22m [2m│ gzip: 57.72 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22mfield-standards-DPRMDU-F.js        [2m 30.46 kB[22m [2m│ gzip:  5.13 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22mAwcmsPluginHeaderMenu-CQR6c-xk.js  [2m 13.95 kB[22m [2m│ gzip:  3.27 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.ts[22m[39m                         [2m  7.30 kB[22m [2m│ gzip:  1.91 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22m[32m[1mnavigation.d.ts[22m[39m                    [2m  6.04 kB[22m [2m│ gzip:  1.38 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22m[32m[1madmin.d.ts[22m[39m                         [2m  2.25 kB[22m [2m│ gzip:  0.81 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22m[32m[1msandbox.d.ts[22m[39m                       [2m  2.23 kB[22m [2m│ gzip:  0.50 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m 11 files, total: 716.79 kB
packages/plugins/awcms-micro-sikesra prepare: [32m✔[39m Build complete in [32m2748ms[39m
packages/plugins/awcms-micro-sikesra prepare: Done
Done in 14.6s using pnpm v11.5.0
$ pnpm --filter emdash build
==> pnpm-build-emdash
$ tsdown
[34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
[34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/core/tsdown.config.ts[24m
[34mℹ[39m entry: [34msrc/index.ts, src/request-context.ts, src/astro/index.ts, src/astro/middleware.ts, src/astro/middleware/setup.ts, src/astro/middleware/auth.ts, src/astro/middleware/redirect.ts, src/astro/middleware/request-context.ts, src/astro/types.ts, src/db/index.ts, src/db/sqlite.ts, src/db/libsql.ts, src/db/postgres.ts, src/database/instrumentation.ts, src/storage/local.ts, src/storage/s3.ts, src/media/index.ts, src/media/local-runtime.ts, src/runtime.ts, src/seed/index.ts, src/cli/index.ts, src/client/index.ts, src/client/cf-access.ts, src/seo/index.ts, src/page/index.ts, src/plugin-utils.ts, src/plugin-types.ts, src/plugins/adapt-sandbox-entry.ts, src/api/route-utils.ts, src/api/schemas/index.ts, src/auth/providers/github.ts, src/auth/providers/google.ts[39m
[34mℹ[39m tsconfig: [34mtsconfig.json[39m
[34mℹ[39m Build start
[34mℹ[39m Cleaning 1092 files
[34mℹ[39m Granting execute permission to [4mdist/cli/index.mjs[24m
[34mℹ[39m [2mdist/[22m[1mcli/index.mjs[22m                                                            [2m142.25 kB[22m [2m│ gzip: 35.70 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/middleware.mjs[22m                                                     [2m 95.67 kB[22m [2m│ gzip: 24.64 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/openapi.json.mjs[22m                                        [2m 90.30 kB[22m [2m│ gzip: 14.40 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/mcp.mjs[22m                                                 [2m 67.85 kB[22m [2m│ gzip: 15.05 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/index.mjs[22m                                                          [2m 63.45 kB[22m [2m│ gzip: 14.86 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/middleware/request-context.mjs[22m                                     [2m 41.28 kB[22m [2m│ gzip: 10.35 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/execute.mjs[22m                            [2m 26.43 kB[22m [2m│ gzip:  8.19 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/middleware/auth.mjs[22m                                                [2m 21.78 kB[22m [2m│ gzip:  6.02 kB[22m
[34mℹ[39m [2mdist/[22m[1mpage/index.mjs[22m                                                           [2m 13.75 kB[22m [2m│ gzip:  4.05 kB[22m
[34mℹ[39m [2mdist/[22m[1mclient/index.mjs[22m                                                         [2m 12.89 kB[22m [2m│ gzip:  3.52 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/registry/artifact.mjs[22m                     [2m 12.58 kB[22m [2m│ gzip:  4.53 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/authorize.mjs[22m                                     [2m 11.85 kB[22m [2m│ gzip:  3.50 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/analyze.mjs[22m                            [2m  9.96 kB[22m [2m│ gzip:  3.36 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/snapshot.mjs[22m                                            [2m  9.29 kB[22m [2m│ gzip:  3.58 kB[22m
[34mℹ[39m [2mdist/[22m[1mindex.mjs[22m                                                                [2m  8.44 kB[22m [2m│ gzip:  2.57 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/comments/_collection_/_contentId_/index.mjs[22m             [2m  8.32 kB[22m [2m│ gzip:  2.57 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress-plugin/execute.mjs[22m                     [2m  8.06 kB[22m [2m│ gzip:  2.71 kB[22m
[34mℹ[39m [2mdist/[22m[1mapi/schemas/index.mjs[22m                                                    [2m  7.95 kB[22m [2m│ gzip:  1.89 kB[22m
[34mℹ[39m [2mdist/[22m[1mstorage/s3.mjs[22m                                                           [2m  7.78 kB[22m [2m│ gzip:  2.79 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/media.mjs[22m                              [2m  6.55 kB[22m [2m│ gzip:  2.12 kB[22m
[34mℹ[39m [2mdist/[22m[1mplugins/adapt-sandbox-entry.mjs[22m                                          [2m  5.88 kB[22m [2m│ gzip:  2.21 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/media.mjs[22m                                               [2m  5.74 kB[22m [2m│ gzip:  2.12 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/oauth/_provider_/callback.mjs[22m                      [2m  5.73 kB[22m [2m│ gzip:  2.03 kB[22m
[34mℹ[39m [2mdist/[22m[1mclient/cf-access.mjs[22m                                                     [2m  5.69 kB[22m [2m│ gzip:  2.17 kB[22m
[34mℹ[39m [2mdist/[22m[1mstorage/local.mjs[22m                                                        [2m  5.56 kB[22m [2m│ gzip:  2.04 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/rewrite-urls.mjs[22m                       [2m  5.55 kB[22m [2m│ gzip:  1.81 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_.mjs[22m                           [2m  5.01 kB[22m [2m│ gzip:  1.43 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/dev-bypass.mjs[22m                                    [2m  5.00 kB[22m [2m│ gzip:  2.00 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/token.mjs[22m                                         [2m  4.98 kB[22m [2m│ gzip:  1.69 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/sitemap-_collection_.xml.mjs[22m                                [2m  4.90 kB[22m [2m│ gzip:  1.84 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/rewrite-url-helpers.mjs[22m                [2m  4.64 kB[22m [2m│ gzip:  1.71 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs[22m          [2m  4.56 kB[22m [2m│ gzip:  1.48 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/register.mjs[22m                                      [2m  4.42 kB[22m [2m│ gzip:  1.65 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/_id_/index.mjs[22m                              [2m  4.36 kB[22m [2m│ gzip:  1.45 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/prepare.mjs[22m                            [2m  4.34 kB[22m [2m│ gzip:  1.62 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/registry/install.mjs[22m                      [2m  4.33 kB[22m [2m│ gzip:  1.72 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/settings/email.mjs[22m                                      [2m  4.32 kB[22m [2m│ gzip:  1.72 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/registry/_id_/update.mjs[22m                  [2m  4.20 kB[22m [2m│ gzip:  1.57 kB[22m
[34mℹ[39m [2mdist/[22m[1mmedia/local-runtime.mjs[22m                                                  [2m  3.75 kB[22m [2m│ gzip:  1.18 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/_slug_/index.mjs[22m                     [2m  3.74 kB[22m [2m│ gzip:  1.14 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/index.mjs[22m                                         [2m  3.71 kB[22m [2m│ gzip:  1.41 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/admin-verify.mjs[22m                                  [2m  3.68 kB[22m [2m│ gzip:  1.39 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs[22m        [2m  3.65 kB[22m [2m│ gzip:  1.03 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/_name_/widgets/_id_.mjs[22m                    [2m  3.64 kB[22m [2m│ gzip:  1.10 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/upload-url.mjs[22m                                    [2m  3.53 kB[22m [2m│ gzip:  1.46 kB[22m
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
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/plugins/_pluginId_/_...path_.mjs[22m                        [2m  3.09 kB[22m [2m│ gzip:  1.37 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/bylines/_id_/index.mjs[22m                            [2m  3.09 kB[22m [2m│ gzip:  0.97 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/updates.mjs[22m                               [2m  3.08 kB[22m [2m│ gzip:  1.12 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/admin.mjs[22m                                         [2m  3.06 kB[22m [2m│ gzip:  1.23 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/registry/_id_/uninstall.mjs[22m               [2m  3.03 kB[22m [2m│ gzip:  1.09 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/index.mjs[22m                          [2m  3.02 kB[22m [2m│ gzip:  1.13 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/bylines/index.mjs[22m                                 [2m  3.02 kB[22m [2m│ gzip:  1.16 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/oauth/_provider_.mjs[22m                               [2m  3.00 kB[22m [2m│ gzip:  1.17 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/oauth-clients/_id_.mjs[22m                            [2m  3.00 kB[22m [2m│ gzip:  0.97 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/middleware/redirect.mjs[22m                                            [2m  2.93 kB[22m [2m│ gzip:  1.24 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/themes/marketplace/index.mjs[22m                      [2m  2.92 kB[22m [2m│ gzip:  1.11 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/uninstall.mjs[22m                        [2m  2.92 kB[22m [2m│ gzip:  1.10 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/bylines/_id_/translations.mjs[22m                     [2m  2.92 kB[22m [2m│ gzip:  1.11 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/enable.mjs[22m                           [2m  2.91 kB[22m [2m│ gzip:  1.07 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/index.mjs[22m                            [2m  2.86 kB[22m [2m│ gzip:  0.98 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/allowed-domains/_domain_.mjs[22m                      [2m  2.85 kB[22m [2m│ gzip:  0.98 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/publish.mjs[22m                   [2m  2.80 kB[22m [2m│ gzip:  1.14 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/redirects/_id_.mjs[22m                                      [2m  2.79 kB[22m [2m│ gzip:  0.83 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/_id_.mjs[22m                                   [2m  2.77 kB[22m [2m│ gzip:  0.98 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/signup/complete.mjs[22m                                [2m  2.77 kB[22m [2m│ gzip:  1.15 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/_slug_/fields/reorder.mjs[22m            [2m  2.77 kB[22m [2m│ gzip:  0.95 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/allowed-domains/index.mjs[22m                         [2m  2.76 kB[22m [2m│ gzip:  1.05 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/invite/complete.mjs[22m                                [2m  2.75 kB[22m [2m│ gzip:  1.13 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/marketplace/index.mjs[22m                     [2m  2.74 kB[22m [2m│ gzip:  1.02 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/disable.mjs[22m                          [2m  2.73 kB[22m [2m│ gzip:  1.02 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/dev-bypass.mjs[22m                                     [2m  2.72 kB[22m [2m│ gzip:  1.26 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress-plugin/analyze.mjs[22m                     [2m  2.71 kB[22m [2m│ gzip:  1.13 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/typegen.mjs[22m                                             [2m  2.66 kB[22m [2m│ gzip:  1.06 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_/translations.mjs[22m                           [2m  2.65 kB[22m [2m│ gzip:  0.93 kB[22m
[34mℹ[39m [2mdist/[22m[1mplugin-utils.mjs[22m                                                         [2m  2.63 kB[22m [2m│ gzip:  1.21 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/orphans/_slug_.mjs[22m                               [2m  2.63 kB[22m [2m│ gzip:  0.99 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/marketplace/_id_/index.mjs[22m                [2m  2.60 kB[22m [2m│ gzip:  0.94 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/options.mjs[22m                                [2m  2.59 kB[22m [2m│ gzip:  1.06 kB[22m
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
[34mℹ[39m [2mdist/[22m[1mastro/routes/sitemap.xml.mjs[22m                                             [2m  2.40 kB[22m [2m│ gzip:  1.11 kB[22m
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
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/orphans/index.mjs[22m                                [2m  2.21 kB[22m [2m│ gzip:  0.83 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/oauth-clients/index.mjs[22m                           [2m  2.20 kB[22m [2m│ gzip:  0.90 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/themes/preview.mjs[22m                                      [2m  2.15 kB[22m [2m│ gzip:  0.98 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/_name_.mjs[22m                                 [2m  2.15 kB[22m [2m│ gzip:  0.79 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/rebuild.mjs[22m                                      [2m  2.14 kB[22m [2m│ gzip:  0.92 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/api-tokens/index.mjs[22m                              [2m  2.13 kB[22m [2m│ gzip:  0.93 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/redirects/index.mjs[22m                                     [2m  2.12 kB[22m [2m│ gzip:  0.78 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/_id_/send-recovery.mjs[22m                      [2m  2.03 kB[22m [2m│ gzip:  0.96 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/device/token.mjs[22m                                  [2m  2.01 kB[22m [2m│ gzip:  0.94 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/index.mjs[22m                                        [2m  2.00 kB[22m [2m│ gzip:  0.95 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/index.mjs[22m                                   [2m  1.99 kB[22m [2m│ gzip:  0.94 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/enable.mjs[22m                                       [2m  1.97 kB[22m [2m│ gzip:  0.87 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/_id_/disable.mjs[22m                            [2m  1.96 kB[22m [2m│ gzip:  0.90 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/sections/index.mjs[22m                                      [2m  1.93 kB[22m [2m│ gzip:  0.73 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/_name_/reorder.mjs[22m                         [2m  1.92 kB[22m [2m│ gzip:  0.87 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/robots.txt.mjs[22m                                              [2m  1.88 kB[22m [2m│ gzip:  0.85 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/middleware/setup.mjs[22m                                               [2m  1.86 kB[22m [2m│ gzip:  0.86 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/file/_...key_.mjs[22m                                 [2m  1.84 kB[22m [2m│ gzip:  0.95 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/duplicate.mjs[22m                 [2m  1.81 kB[22m [2m│ gzip:  0.77 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/device/code.mjs[22m                                   [2m  1.80 kB[22m [2m│ gzip:  0.84 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/me.mjs[22m                                             [2m  1.77 kB[22m [2m│ gzip:  0.84 kB[22m
[34mℹ[39m [2mdist/[22m[1mrequest-context.mjs[22m                                                      [2m  1.76 kB[22m [2m│ gzip:  0.90 kB[22m
[34mℹ[39m [2mdist/[22m[1mapi/route-utils.mjs[22m                                                      [2m  1.76 kB[22m [2m│ gzip:  0.84 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/restore.mjs[22m                   [2m  1.72 kB[22m [2m│ gzip:  0.74 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/discard-draft.mjs[22m             [2m  1.71 kB[22m [2m│ gzip:  0.73 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/_id_.mjs[22m                                 [2m  1.70 kB[22m [2m│ gzip:  0.65 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/unpublish.mjs[22m                 [2m  1.70 kB[22m [2m│ gzip:  0.73 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/suggest.mjs[22m                                      [2m  1.67 kB[22m [2m│ gzip:  0.82 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/index.mjs[22m                                         [2m  1.65 kB[22m [2m│ gzip:  0.68 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/magic-link/verify.mjs[22m                              [2m  1.65 kB[22m [2m│ gzip:  0.71 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/revisions/_revisionId_/restore.mjs[22m                      [2m  1.64 kB[22m [2m│ gzip:  0.70 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/translations.mjs[22m              [2m  1.58 kB[22m [2m│ gzip:  0.77 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs[22m             [2m  1.56 kB[22m [2m│ gzip:  0.75 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/manifest.mjs[22m                                            [2m  1.56 kB[22m [2m│ gzip:  0.80 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/marketplace/_id_/icon.mjs[22m                 [2m  1.54 kB[22m [2m│ gzip:  0.75 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/index.mjs[22m                                [2m  1.48 kB[22m [2m│ gzip:  0.68 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/bulk.mjs[22m                                 [2m  1.47 kB[22m [2m│ gzip:  0.66 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/hooks/exclusive/index.mjs[22m                         [2m  1.45 kB[22m [2m│ gzip:  0.72 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/redirects/404s/summary.mjs[22m                              [2m  1.45 kB[22m [2m│ gzip:  0.66 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_/reorder.mjs[22m                                [2m  1.43 kB[22m [2m│ gzip:  0.66 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_/items.mjs[22m                                  [2m  1.42 kB[22m [2m│ gzip:  0.67 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/probe.mjs[22m                                        [2m  1.37 kB[22m [2m│ gzip:  0.66 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/well-known/auth.mjs[22m                                     [2m  1.37 kB[22m [2m│ gzip:  0.66 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/device/authorize.mjs[22m                              [2m  1.34 kB[22m [2m│ gzip:  0.69 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/signup/verify.mjs[22m                                  [2m  1.32 kB[22m [2m│ gzip:  0.71 kB[22m
[34mℹ[39m [2mdist/[22m[1mruntime.mjs[22m                                                              [2m  1.32 kB[22m [2m│ gzip:  0.64 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/invite/accept.mjs[22m                                  [2m  1.28 kB[22m [2m│ gzip:  0.68 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/_id_/enable.mjs[22m                             [2m  1.28 kB[22m [2m│ gzip:  0.67 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/api-tokens/_id_.mjs[22m                               [2m  1.24 kB[22m [2m│ gzip:  0.65 kB[22m
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
[34mℹ[39m [2mdist/[22mapi-hhZPD60y.mjs.map                                                     [2m306.36 kB[22m [2m│ gzip: 66.56 kB[22m
[34mℹ[39m [2mdist/[22mcli/index.mjs.map                                                        [2m283.02 kB[22m [2m│ gzip: 64.93 kB[22m
[34mℹ[39m [2mdist/[22mrunner-CI81ODxm.mjs.map                                                  [2m251.77 kB[22m [2m│ gzip: 47.02 kB[22m
[34mℹ[39m [2mdist/[22mastro/middleware.mjs.map                                                 [2m212.52 kB[22m [2m│ gzip: 54.26 kB[22m
[34mℹ[39m [2mdist/[22mmenus-Db69unQr.mjs.map                                                   [2m186.63 kB[22m [2m│ gzip: 41.87 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/openapi.json.mjs.map                                    [2m170.23 kB[22m [2m│ gzip: 23.57 kB[22m
[34mℹ[39m [2mdist/[22mapi-hhZPD60y.mjs                                                         [2m144.88 kB[22m [2m│ gzip: 32.88 kB[22m
[34mℹ[39m [2mdist/[22mastro/index.mjs.map                                                      [2m136.12 kB[22m [2m│ gzip: 32.58 kB[22m
[34mℹ[39m [2mdist/[22mrunner-CI81ODxm.mjs                                                      [2m131.39 kB[22m [2m│ gzip: 24.27 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/mcp.mjs.map                                             [2m126.22 kB[22m [2m│ gzip: 24.49 kB[22m
[34mℹ[39m [2mdist/[22mimport-DG80rC_I.mjs.map                                                  [2m112.07 kB[22m [2m│ gzip: 25.69 kB[22m
[34mℹ[39m [2mdist/[22mredirects-BBHGtre3.mjs.map                                               [2m 95.13 kB[22m [2m│ gzip: 15.97 kB[22m
[34mℹ[39m [2mdist/[22mmenus-Db69unQr.mjs                                                       [2m 86.17 kB[22m [2m│ gzip: 19.80 kB[22m
[34mℹ[39m [2mdist/[22mcontext-B4P2Z1qj.mjs.map                                                 [2m 66.64 kB[22m [2m│ gzip: 15.80 kB[22m
[34mℹ[39m [2mdist/[22mapply-Da3UD2mq.mjs.map                                                   [2m 65.82 kB[22m [2m│ gzip: 16.76 kB[22m
[34mℹ[39m [2mdist/[22mcontent-DyxDxgmj.mjs.map                                                 [2m 64.02 kB[22m [2m│ gzip: 13.88 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/execute.mjs.map                        [2m 59.52 kB[22m [2m│ gzip: 17.62 kB[22m
[34mℹ[39m [2mdist/[22mregistry-CjGQLO1Z.mjs.map                                                [2m 54.83 kB[22m [2m│ gzip: 13.21 kB[22m
[34mℹ[39m [2mdist/[22mmenus-PSiW74iS.mjs.map                                                   [2m 50.90 kB[22m [2m│ gzip: 12.05 kB[22m
[34mℹ[39m [2mdist/[22mloader-bZR1z7LT.mjs.map                                                  [2m 49.36 kB[22m [2m│ gzip: 13.97 kB[22m
[34mℹ[39m [2mdist/[22mastro/middleware/request-context.mjs.map                                 [2m 49.16 kB[22m [2m│ gzip: 12.37 kB[22m
[34mℹ[39m [2mdist/[22mquery-B0mBNMjj.mjs.map                                                   [2m 49.00 kB[22m [2m│ gzip: 14.82 kB[22m
[34mℹ[39m [2mdist/[22mimport-DG80rC_I.mjs                                                      [2m 48.70 kB[22m [2m│ gzip: 11.84 kB[22m
[34mℹ[39m [2mdist/[22mredirects-BBHGtre3.mjs                                                   [2m 47.10 kB[22m [2m│ gzip:  9.52 kB[22m
[34mℹ[39m [2mdist/[22mastro/middleware/auth.mjs.map                                            [2m 44.81 kB[22m [2m│ gzip: 12.43 kB[22m
[34mℹ[39m [2mdist/[22mindex-ByzreLAZ.d.mts.map                                                 [2m 36.58 kB[22m [2m│ gzip: 10.10 kB[22m
[34mℹ[39m [2mdist/[22mbyline-CstL9b86.mjs.map                                                  [2m 35.41 kB[22m [2m│ gzip:  9.24 kB[22m
[34mℹ[39m [2mdist/[22mvalidate-CXUcXc-l.mjs.map                                                [2m 34.77 kB[22m [2m│ gzip:  7.51 kB[22m
[34mℹ[39m [2mdist/[22mtaxonomies-2PvZXH44.mjs.map                                              [2m 34.53 kB[22m [2m│ gzip:  8.02 kB[22m
[34mℹ[39m [2mdist/[22mclient/index.mjs.map                                                     [2m 32.97 kB[22m [2m│ gzip:  7.93 kB[22m
[34mℹ[39m [2mdist/[22mcontent-DyxDxgmj.mjs                                                     [2m 32.67 kB[22m [2m│ gzip:  7.67 kB[22m
[34mℹ[39m [2mdist/[22mredirects-R7KQg4PF.mjs.map                                               [2m 32.59 kB[22m [2m│ gzip:  8.18 kB[22m
[34mℹ[39m [2mdist/[22mapply-Da3UD2mq.mjs                                                       [2m 32.53 kB[22m [2m│ gzip:  8.26 kB[22m
[34mℹ[39m [2mdist/[22mpage/index.mjs.map                                                       [2m 31.02 kB[22m [2m│ gzip:  8.42 kB[22m
[34mℹ[39m [2mdist/[22mdevice-flow-B9oG8PwP.mjs.map                                             [2m 29.83 kB[22m [2m│ gzip:  7.18 kB[22m
[34mℹ[39m [2mdist/[22mcontext-B4P2Z1qj.mjs                                                     [2m 28.49 kB[22m [2m│ gzip:  7.55 kB[22m
[34mℹ[39m [2mdist/[22mregistry-CjGQLO1Z.mjs                                                    [2m 27.45 kB[22m [2m│ gzip:  6.96 kB[22m
[34mℹ[39m [2mdist/[22merror-BpfiIgsi.mjs.map                                                   [2m 27.13 kB[22m [2m│ gzip:  6.40 kB[22m
[34mℹ[39m [2mdist/[22msearch-B9Bz1U91.mjs.map                                                  [2m 26.55 kB[22m [2m│ gzip:  8.21 kB[22m
[34mℹ[39m [2mdist/[22mredirect-BUfqFptM.mjs.map                                                [2m 26.36 kB[22m [2m│ gzip:  6.98 kB[22m
[34mℹ[39m [2mdist/[22mtransport-B6CHddbu.mjs.map                                               [2m 26.06 kB[22m [2m│ gzip:  7.48 kB[22m
[34mℹ[39m [2mdist/[22mtaxonomies-B4kDFVLs.mjs.map                                              [2m 25.55 kB[22m [2m│ gzip:  6.21 kB[22m
[34mℹ[39m [2mdist/[22msecrets-rPdhEBkD.mjs.map                                                 [2m 24.92 kB[22m [2m│ gzip:  8.49 kB[22m
[34mℹ[39m [2mdist/[22mfts-manager-7GbTRjhQ.mjs.map                                             [2m 24.82 kB[22m [2m│ gzip:  6.62 kB[22m
[34mℹ[39m [2mdist/[22mloader-bZR1z7LT.mjs                                                      [2m 24.07 kB[22m [2m│ gzip:  7.26 kB[22m
[34mℹ[39m [2mdist/[22mssrf-MZ-zrG6-.mjs.map                                                    [2m 23.59 kB[22m [2m│ gzip:  8.30 kB[22m
[34mℹ[39m [2mdist/[22mquery-B0mBNMjj.mjs                                                       [2m 23.49 kB[22m [2m│ gzip:  7.67 kB[22m
[34mℹ[39m [2mdist/[22mmenus-PSiW74iS.mjs                                                       [2m 23.34 kB[22m [2m│ gzip:  5.93 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/authorize.mjs.map                                 [2m 22.43 kB[22m [2m│ gzip:  6.46 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/analyze.mjs.map                        [2m 22.30 kB[22m [2m│ gzip:  6.90 kB[22m
[34mℹ[39m [2mdist/[22mtaxonomy-BvXPbuTx.mjs.map                                                [2m 21.42 kB[22m [2m│ gzip:  5.59 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/artifact.mjs.map                 [2m 20.68 kB[22m [2m│ gzip:  7.13 kB[22m
[34mℹ[39m [2mdist/[22mcomment-B6e8kaGZ.mjs.map                                                 [2m 20.47 kB[22m [2m│ gzip:  4.87 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/snapshot.mjs.map                                        [2m 19.89 kB[22m [2m│ gzip:  6.77 kB[22m
[34mℹ[39m [2mdist/[22msections-BclBhXBd.mjs.map                                                [2m 19.39 kB[22m [2m│ gzip:  4.78 kB[22m
[34mℹ[39m [2mdist/[22mbyline-CstL9b86.mjs                                                      [2m 18.61 kB[22m [2m│ gzip:  5.14 kB[22m
[34mℹ[39m [2mdist/[22mzod-generator-D0CFhOHV.mjs.map                                           [2m 18.45 kB[22m [2m│ gzip:  5.43 kB[22m
[34mℹ[39m [2mdist/[22moauth-authorization-CTMeVfvj.mjs.map                                     [2m 17.99 kB[22m [2m│ gzip:  4.89 kB[22m
[34mℹ[39m [2mdist/[22merror-BpfiIgsi.mjs                                                       [2m 17.21 kB[22m [2m│ gzip:  4.20 kB[22m
[34mℹ[39m [2mdist/[22mtypes-DSWHB41B.d.mts.map                                                 [2m 16.99 kB[22m [2m│ gzip:  4.66 kB[22m
[34mℹ[39m [2mdist/[22mutils-C3wTAP-P.mjs.map                                                   [2m 16.93 kB[22m [2m│ gzip:  5.01 kB[22m
[34mℹ[39m [2mdist/[22mvalidate-CXUcXc-l.mjs                                                    [2m 16.79 kB[22m [2m│ gzip:  3.79 kB[22m
[34mℹ[39m [2mdist/[22mcron-Bd3b3iuj.mjs.map                                                    [2m 16.65 kB[22m [2m│ gzip:  5.39 kB[22m
[34mℹ[39m [2mdist/[22mmedia-DGP4jrX7.mjs.map                                                   [2m 16.58 kB[22m [2m│ gzip:  4.99 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/execute.mjs.map                 [2m 16.41 kB[22m [2m│ gzip:  5.34 kB[22m
[34mℹ[39m [2mdist/[22mredirects-R7KQg4PF.mjs                                                   [2m 16.07 kB[22m [2m│ gzip:  4.26 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/comments/_collection_/_contentId_/index.mjs.map         [2m 15.95 kB[22m [2m│ gzip:  4.89 kB[22m
[34mℹ[39m [2mdist/[22msettings-kxA32mfK.mjs.map                                                [2m 15.73 kB[22m [2m│ gzip:  5.04 kB[22m
[34mℹ[39m [2mdist/[22mtaxonomies-2PvZXH44.mjs                                                  [2m 15.58 kB[22m [2m│ gzip:  3.77 kB[22m
[34mℹ[39m [2mdist/[22moauth-clients-eJCbkVSG.mjs.map                                           [2m 15.58 kB[22m [2m│ gzip:  3.61 kB[22m
[34mℹ[39m [2mdist/[22mstorage/s3.mjs.map                                                       [2m 15.38 kB[22m [2m│ gzip:  5.03 kB[22m
[34mℹ[39m [2mdist/[22mtaxonomies-B4kDFVLs.mjs                                                  [2m 14.94 kB[22m [2m│ gzip:  3.84 kB[22m
[34mℹ[39m [2mdist/[22mdevice-flow-B9oG8PwP.mjs                                                 [2m 14.86 kB[22m [2m│ gzip:  3.83 kB[22m
[34mℹ[39m [2mdist/[22mplugins/adapt-sandbox-entry.mjs.map                                      [2m 14.73 kB[22m [2m│ gzip:  5.14 kB[22m
[34mℹ[39m [2mdist/[22mservice-C_cRTpA_.mjs.map                                                 [2m 14.62 kB[22m [2m│ gzip:  4.38 kB[22m
[34mℹ[39m [2mdist/[22mbylines-MtpvnsH-.mjs.map                                                 [2m 14.10 kB[22m [2m│ gzip:  4.74 kB[22m
[34mℹ[39m [2mdist/[22mfts-manager-7GbTRjhQ.mjs                                                 [2m 13.79 kB[22m [2m│ gzip:  3.92 kB[22m
[34mℹ[39m [2mdist/[22msecrets-rPdhEBkD.mjs                                                     [2m 13.77 kB[22m [2m│ gzip:  5.15 kB[22m
[34mℹ[39m [2mdist/[22mcomments-BwdV-Diu.mjs.map                                                [2m 13.34 kB[22m [2m│ gzip:  3.37 kB[22m
[34mℹ[39m [2mdist/[22msearch-B9Bz1U91.mjs                                                      [2m 13.23 kB[22m [2m│ gzip:  4.33 kB[22m
[34mℹ[39m [2mdist/[22mssrf-MZ-zrG6-.mjs                                                        [2m 12.75 kB[22m [2m│ gzip:  5.03 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/media.mjs.map                          [2m 12.71 kB[22m [2m│ gzip:  3.84 kB[22m
[34mℹ[39m [2mdist/[22mmanifest-schema-Czqf0TLu.mjs.map                                         [2m 12.21 kB[22m [2m│ gzip:  3.36 kB[22m
[34mℹ[39m [2mdist/[22mredirect-BUfqFptM.mjs                                                    [2m 12.07 kB[22m [2m│ gzip:  3.71 kB[22m
[34mℹ[39m [2mdist/[22mtransport-B6CHddbu.mjs                                                   [2m 12.05 kB[22m [2m│ gzip:  3.86 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/rewrite-urls.mjs.map                   [2m 11.45 kB[22m [2m│ gzip:  3.70 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/oauth/_provider_/callback.mjs.map                  [2m 11.29 kB[22m [2m│ gzip:  3.77 kB[22m
[34mℹ[39m [2mdist/[22mstorage/local.mjs.map                                                    [2m 11.26 kB[22m [2m│ gzip:  3.76 kB[22m
[34mℹ[39m [2mdist/[22mvalidation-HCnW6Iv2.mjs.map                                              [2m 11.09 kB[22m [2m│ gzip:  4.18 kB[22m
[34mℹ[39m [2mdist/[22mtaxonomy-BvXPbuTx.mjs                                                    [2m 10.92 kB[22m [2m│ gzip:  3.06 kB[22m
[34mℹ[39m [2mdist/[22muser-C7smaFYQ.mjs.map                                                    [2m 10.46 kB[22m [2m│ gzip:  3.27 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media.mjs.map                                           [2m 10.31 kB[22m [2m│ gzip:  3.58 kB[22m
[34mℹ[39m [2mdist/[22mtokens-N8otWMmj.mjs.map                                                  [2m 10.30 kB[22m [2m│ gzip:  3.28 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/sitemap-_collection_.xml.mjs.map                            [2m 10.23 kB[22m [2m│ gzip:  3.64 kB[22m
[34mℹ[39m [2mdist/[22msetup-CY80tTMA.mjs.map                                                   [2m 10.10 kB[22m [2m│ gzip:  1.99 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/token.mjs.map                                     [2m 10.07 kB[22m [2m│ gzip:  3.04 kB[22m
[34mℹ[39m [2mdist/[22mnormalize-CN5kRSMC.mjs.map                                               [2m 10.06 kB[22m [2m│ gzip:  3.02 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_.mjs.map                       [2m 10.05 kB[22m [2m│ gzip:  2.71 kB[22m
[34mℹ[39m [2mdist/[22msections-BclBhXBd.mjs                                                    [2m  9.34 kB[22m [2m│ gzip:  2.48 kB[22m
[34mℹ[39m [2mdist/[22mseo-B2vqDA_Q.mjs.map                                                     [2m  9.19 kB[22m [2m│ gzip:  3.06 kB[22m
[34mℹ[39m [2mdist/[22mcomment-B6e8kaGZ.mjs                                                     [2m  9.18 kB[22m [2m│ gzip:  2.50 kB[22m
[34mℹ[39m [2mdist/[22mresolve-D6sM-SgF.mjs.map                                                 [2m  9.12 kB[22m [2m│ gzip:  3.20 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/rewrite-url-helpers.mjs.map            [2m  9.07 kB[22m [2m│ gzip:  3.12 kB[22m
[34mℹ[39m [2mdist/[22mcron-Bd3b3iuj.mjs                                                        [2m  8.95 kB[22m [2m│ gzip:  3.19 kB[22m
[34mℹ[39m [2mdist/[22mpatterns-CqG5Ya3i.mjs.map                                                [2m  8.92 kB[22m [2m│ gzip:  3.02 kB[22m
[34mℹ[39m [2mdist/[22mclient/cf-access.mjs.map                                                 [2m  8.87 kB[22m [2m│ gzip:  3.14 kB[22m
[34mℹ[39m [2mdist/[22mmedia/index.mjs.map                                                      [2m  8.84 kB[22m [2m│ gzip:  2.92 kB[22m
[34mℹ[39m [2mdist/[22mtypes-D8QBfkBe.mjs.map                                                   [2m  8.75 kB[22m [2m│ gzip:  3.34 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/prepare.mjs.map                        [2m  8.65 kB[22m [2m│ gzip:  3.13 kB[22m
[34mℹ[39m [2mdist/[22moauth-authorization-CTMeVfvj.mjs                                         [2m  8.64 kB[22m [2m│ gzip:  2.58 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/dev-bypass.mjs.map                                [2m  8.60 kB[22m [2m│ gzip:  3.24 kB[22m
[34mℹ[39m [2mdist/[22mapi-tokens-ucpcNXDt.mjs.map                                              [2m  8.50 kB[22m [2m│ gzip:  2.44 kB[22m
[34mℹ[39m [2mdist/[22mbylines-DctOoid7.d.mts.map                                               [2m  8.48 kB[22m [2m│ gzip:  1.48 kB[22m
[34mℹ[39m [2mdist/[22mmedia/local-runtime.mjs.map                                              [2m  8.45 kB[22m [2m│ gzip:  2.58 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs.map      [2m  8.42 kB[22m [2m│ gzip:  2.72 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/register.mjs.map                                  [2m  8.19 kB[22m [2m│ gzip:  2.94 kB[22m
[34mℹ[39m [2mdist/[22mallowed-origins-D0fFk9a6.mjs.map                                         [2m  8.19 kB[22m [2m│ gzip:  3.02 kB[22m
[34mℹ[39m [2mdist/[22mrequest-meta-C_Cjii-T.mjs.map                                            [2m  8.19 kB[22m [2m│ gzip:  3.14 kB[22m
[34mℹ[39m [2mdist/[22mutils-C3wTAP-P.mjs                                                       [2m  8.16 kB[22m [2m│ gzip:  2.90 kB[22m
[34mℹ[39m [2mdist/[22mzod-generator-D0CFhOHV.mjs                                               [2m  8.10 kB[22m [2m│ gzip:  2.42 kB[22m
[34mℹ[39m [2mdist/[22mrate-limit-sO9bWu9Y.mjs.map                                              [2m  8.07 kB[22m [2m│ gzip:  3.40 kB[22m
[34mℹ[39m [2mdist/[22mtypes-DSZl1Dsv.mjs.map                                                   [2m  7.98 kB[22m [2m│ gzip:  2.22 kB[22m
[34mℹ[39m [2mdist/[22mplaceholder-LqmHqvBw.mjs.map                                             [2m  7.97 kB[22m [2m│ gzip:  2.92 kB[22m
[34mℹ[39m [2mdist/[22msettings-kxA32mfK.mjs                                                    [2m  7.86 kB[22m [2m│ gzip:  2.66 kB[22m
[34mℹ[39m [2mdist/[22mdashboard-B72rF3w7.mjs.map                                               [2m  7.78 kB[22m [2m│ gzip:  2.88 kB[22m
[34mℹ[39m [2mdist/[22moptions-BL4X94qY.mjs.map                                                 [2m  7.78 kB[22m [2m│ gzip:  2.31 kB[22m
[34mℹ[39m [2mdist/[22mdialect-helpers-BKCvISIQ.mjs.map                                         [2m  7.72 kB[22m [2m│ gzip:  2.08 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/index.mjs.map                          [2m  7.59 kB[22m [2m│ gzip:  2.39 kB[22m
[34mℹ[39m [2mdist/[22moauth-clients-eJCbkVSG.mjs                                               [2m  7.56 kB[22m [2m│ gzip:  1.83 kB[22m
[34mℹ[39m [2mdist/[22mmedia-DGP4jrX7.mjs                                                       [2m  7.41 kB[22m [2m│ gzip:  2.50 kB[22m
[34mℹ[39m [2mdist/[22mseo/index.mjs.map                                                        [2m  7.10 kB[22m [2m│ gzip:  2.58 kB[22m
[34mℹ[39m [2mdist/[22mbylines-DfLV0Soq.mjs.map                                                 [2m  7.04 kB[22m [2m│ gzip:  2.56 kB[22m
[34mℹ[39m [2mdist/[22mmanifest-schema-Czqf0TLu.mjs                                             [2m  6.66 kB[22m [2m│ gzip:  2.24 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/widgets/_id_.mjs.map                [2m  6.52 kB[22m [2m│ gzip:  1.77 kB[22m
[34mℹ[39m [2mdist/[22mseo-Dq707mNQ.mjs.map                                                     [2m  6.47 kB[22m [2m│ gzip:  2.62 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/settings/email.mjs.map                                  [2m  6.47 kB[22m [2m│ gzip:  2.40 kB[22m
[34mℹ[39m [2mdist/[22mwidgets-BKnSIFPg.mjs.map                                                 [2m  6.46 kB[22m [2m│ gzip:  2.29 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/plugins/_pluginId_/_...path_.mjs.map                    [2m  6.43 kB[22m [2m│ gzip:  2.62 kB[22m
[34mℹ[39m [2mdist/[22mbylines-MtpvnsH-.mjs                                                     [2m  6.39 kB[22m [2m│ gzip:  2.45 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/admin-verify.mjs.map                              [2m  6.33 kB[22m [2m│ gzip:  2.31 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/_id_.mjs.map                                      [2m  6.28 kB[22m [2m│ gzip:  1.75 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/upload-url.mjs.map                                [2m  6.24 kB[22m [2m│ gzip:  2.44 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/admin.mjs.map                                     [2m  6.21 kB[22m [2m│ gzip:  2.51 kB[22m
[34mℹ[39m [2mdist/[22mservice-C_cRTpA_.mjs                                                     [2m  6.21 kB[22m [2m│ gzip:  2.19 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/index.mjs.map                                     [2m  6.16 kB[22m [2m│ gzip:  2.40 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/oauth/_provider_.mjs.map                           [2m  6.14 kB[22m [2m│ gzip:  2.26 kB[22m
[34mℹ[39m [2mdist/[22mpublic-url-CUWWFME2.mjs.map                                              [2m  5.92 kB[22m [2m│ gzip:  2.40 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/register/verify.mjs.map                    [2m  5.90 kB[22m [2m│ gzip:  2.22 kB[22m
[34mℹ[39m [2mdist/[22mvalidate-VPnKoIzW.mjs.map                                                [2m  5.90 kB[22m [2m│ gzip:  1.70 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/preview-url.mjs.map           [2m  5.90 kB[22m [2m│ gzip:  2.39 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/_id_/status.mjs.map                      [2m  5.69 kB[22m [2m│ gzip:  2.00 kB[22m
[34mℹ[39m [2mdist/[22mresolve-D6sM-SgF.mjs                                                     [2m  5.63 kB[22m [2m│ gzip:  2.12 kB[22m
[34mℹ[39m [2mdist/[22mvalidation-HCnW6Iv2.mjs                                                  [2m  5.61 kB[22m [2m│ gzip:  2.26 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/dev-bypass.mjs.map                                 [2m  5.58 kB[22m [2m│ gzip:  2.30 kB[22m
[34mℹ[39m [2mdist/[22mtypes-DaqNzqVt.d.mts.map                                                 [2m  5.58 kB[22m [2m│ gzip:  0.93 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/install.mjs.map                  [2m  5.56 kB[22m [2m│ gzip:  2.38 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/schedule.mjs.map              [2m  5.56 kB[22m [2m│ gzip:  1.63 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/providers/_providerId_/index.mjs.map              [2m  5.54 kB[22m [2m│ gzip:  1.81 kB[22m
[34mℹ[39m [2mdist/[22mastro/middleware/redirect.mjs.map                                        [2m  5.50 kB[22m [2m│ gzip:  2.23 kB[22m
[34mℹ[39m [2mdist/[22mcomments-BwdV-Diu.mjs                                                    [2m  5.49 kB[22m [2m│ gzip:  1.74 kB[22m
[34mℹ[39m [2mdist/[22mpreview-D4z0WONU.mjs.map                                                 [2m  5.44 kB[22m [2m│ gzip:  1.93 kB[22m
[34mℹ[39m [2mdist/[22mparse-B6s9lMve.mjs.map                                                   [2m  5.35 kB[22m [2m│ gzip:  1.94 kB[22m
[34mℹ[39m [2mdist/[22mallowed-origins-D0fFk9a6.mjs                                             [2m  5.31 kB[22m [2m│ gzip:  2.06 kB[22m
[34mℹ[39m [2mdist/[22msetup-CY80tTMA.mjs                                                       [2m  5.27 kB[22m [2m│ gzip:  1.31 kB[22m
[34mℹ[39m [2mdist/[22mtypes-Cd9UCu3t.mjs.map                                                   [2m  5.27 kB[22m [2m│ gzip:  1.85 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/bylines/_id_/translations.mjs.map                 [2m  5.21 kB[22m [2m│ gzip:  1.88 kB[22m
[34mℹ[39m [2mdist/[22mrequest-cache-dzCt8TZB.mjs.map                                           [2m  5.19 kB[22m [2m│ gzip:  2.07 kB[22m
[34mℹ[39m [2mdist/[22mseo-B2vqDA_Q.mjs                                                         [2m  5.12 kB[22m [2m│ gzip:  1.82 kB[22m
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
[34mℹ[39m [2mdist/[22muser-C7smaFYQ.mjs                                                        [2m  4.74 kB[22m [2m│ gzip:  1.69 kB[22m
[34mℹ[39m [2mdist/[22mdatabase/instrumentation.mjs.map                                         [2m  4.63 kB[22m [2m│ gzip:  2.02 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/publish.mjs.map               [2m  4.63 kB[22m [2m│ gzip:  1.84 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/allowed-domains/index.mjs.map                     [2m  4.61 kB[22m [2m│ gzip:  1.60 kB[22m
[34mℹ[39m [2mdist/[22mrequest-meta-C_Cjii-T.mjs                                                [2m  4.58 kB[22m [2m│ gzip:  1.93 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/index.mjs.map                                    [2m  4.52 kB[22m [2m│ gzip:  1.76 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/translations.mjs.map                       [2m  4.49 kB[22m [2m│ gzip:  1.48 kB[22m
[34mℹ[39m [2mdist/[22mplugin-utils.mjs.map                                                     [2m  4.46 kB[22m [2m│ gzip:  1.89 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/signup/request.mjs.map                             [2m  4.45 kB[22m [2m│ gzip:  1.92 kB[22m
[34mℹ[39m [2mdist/[22mrate-limit-sO9bWu9Y.mjs                                                  [2m  4.43 kB[22m [2m│ gzip:  2.06 kB[22m
[34mℹ[39m [2mdist/[22mtrusted-proxy-97pajC2f.mjs.map                                           [2m  4.43 kB[22m [2m│ gzip:  1.96 kB[22m
[34mℹ[39m [2mdist/[22mastro/types.d.mts.map                                                    [2m  4.41 kB[22m [2m│ gzip:  1.23 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/magic-link/send.mjs.map                            [2m  4.40 kB[22m [2m│ gzip:  1.78 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/index.mjs.map                              [2m  4.39 kB[22m [2m│ gzip:  1.57 kB[22m
[34mℹ[39m [2mdist/[22mplaceholder-LqmHqvBw.mjs                                                 [2m  4.39 kB[22m [2m│ gzip:  1.77 kB[22m
[34mℹ[39m [2mdist/[22mvalidate-VPnKoIzW.mjs                                                    [2m  4.35 kB[22m [2m│ gzip:  1.32 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/signup/complete.mjs.map                            [2m  4.33 kB[22m [2m│ gzip:  1.74 kB[22m
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
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/_id_/update.mjs.map              [2m  4.09 kB[22m [2m│ gzip:  1.70 kB[22m
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
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_.mjs.map                                    [2m  3.79 kB[22m [2m│ gzip:  1.00 kB[22m
[34mℹ[39m [2mdist/[22mdb/index.mjs.map                                                         [2m  3.77 kB[22m [2m│ gzip:  1.42 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/widgets.mjs.map                     [2m  3.74 kB[22m [2m│ gzip:  1.48 kB[22m
[34mℹ[39m [2mdist/[22moptions-BL4X94qY.mjs                                                     [2m  3.69 kB[22m [2m│ gzip:  1.26 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/redirects/404s/index.mjs.map                            [2m  3.64 kB[22m [2m│ gzip:  1.07 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/duplicate.mjs.map             [2m  3.62 kB[22m [2m│ gzip:  1.48 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs.map    [2m  3.60 kB[22m [2m│ gzip:  1.01 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/updates.mjs.map                           [2m  3.56 kB[22m [2m│ gzip:  1.51 kB[22m
[34mℹ[39m [2mdist/[22mcache-TLGC4FOa.mjs.map                                                   [2m  3.54 kB[22m [2m│ gzip:  1.45 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/verify.mjs.map                             [2m  3.54 kB[22m [2m│ gzip:  1.42 kB[22m
[34mℹ[39m [2mdist/[22mdashboard-B72rF3w7.mjs                                                   [2m  3.54 kB[22m [2m│ gzip:  1.51 kB[22m
[34mℹ[39m [2mdist/[22mmime-KV5TqkMN.mjs.map                                                    [2m  3.52 kB[22m [2m│ gzip:  1.48 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/device/token.mjs.map                              [2m  3.50 kB[22m [2m│ gzip:  1.56 kB[22m
[34mℹ[39m [2mdist/[22mcomponents-Dx3DM0gg.mjs.map                                              [2m  3.46 kB[22m [2m│ gzip:  0.99 kB[22m
[34mℹ[39m [2mdist/[22mchallenge-store-Dng1SxKT.mjs.map                                         [2m  3.43 kB[22m [2m│ gzip:  1.34 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/disable.mjs.map                        [2m  3.43 kB[22m [2m│ gzip:  1.49 kB[22m
[34mℹ[39m [2mdist/[22mpublic-url-CUWWFME2.mjs                                                  [2m  3.37 kB[22m [2m│ gzip:  1.50 kB[22m
[34mℹ[39m [2mdist/[22mbylines-DfLV0Soq.mjs                                                     [2m  3.36 kB[22m [2m│ gzip:  1.27 kB[22m
[34mℹ[39m [2mdist/[22mtypes-bYmRn_Uy.d.mts.map                                                 [2m  3.35 kB[22m [2m│ gzip:  1.20 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/items/_id_.mjs.map                         [2m  3.34 kB[22m [2m│ gzip:  1.04 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/index.mjs.map                   [2m  3.33 kB[22m [2m│ gzip:  1.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/file/_...key_.mjs.map                             [2m  3.33 kB[22m [2m│ gzip:  1.52 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/oauth-clients/index.mjs.map                       [2m  3.32 kB[22m [2m│ gzip:  1.25 kB[22m
[34mℹ[39m [2mdist/[22mdialect-helpers-BKCvISIQ.mjs                                             [2m  3.31 kB[22m [2m│ gzip:  1.12 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/robots.txt.mjs.map                                          [2m  3.28 kB[22m [2m│ gzip:  1.34 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/send-recovery.mjs.map                  [2m  3.27 kB[22m [2m│ gzip:  1.44 kB[22m
[34mℹ[39m [2mdist/[22mwidgets-BKnSIFPg.mjs                                                     [2m  3.27 kB[22m [2m│ gzip:  1.22 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/restore.mjs.map               [2m  3.25 kB[22m [2m│ gzip:  1.34 kB[22m
[34mℹ[39m [2mdist/[22mdb-errors-BiYqoX-n.mjs.map                                               [2m  3.25 kB[22m [2m│ gzip:  1.28 kB[22m
[34mℹ[39m [2mdist/[22memail-console-CubRll9q.mjs.map                                           [2m  3.23 kB[22m [2m│ gzip:  1.54 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/magic-link/verify.mjs.map                          [2m  3.18 kB[22m [2m│ gzip:  1.34 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/discard-draft.mjs.map         [2m  3.18 kB[22m [2m│ gzip:  1.31 kB[22m
[34mℹ[39m [2mdist/[22mvalidate-0_3g7fpb.d.mts.map                                              [2m  3.17 kB[22m [2m│ gzip:  0.98 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/reorder.mjs.map                     [2m  3.16 kB[22m [2m│ gzip:  1.32 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/api-tokens/index.mjs.map                          [2m  3.11 kB[22m [2m│ gzip:  1.21 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/unpublish.mjs.map             [2m  3.11 kB[22m [2m│ gzip:  1.27 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/_id_/install.mjs.map          [2m  3.10 kB[22m [2m│ gzip:  1.31 kB[22m
[34mℹ[39m [2mdist/[22mmode-CaaiebZI.mjs.map                                                    [2m  3.04 kB[22m [2m│ gzip:  1.13 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/me.mjs.map                                         [2m  3.04 kB[22m [2m│ gzip:  1.31 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/search/rebuild.mjs.map                                  [2m  3.02 kB[22m [2m│ gzip:  1.23 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs.map         [2m  2.97 kB[22m [2m│ gzip:  1.31 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/revisions/_revisionId_/restore.mjs.map                  [2m  2.94 kB[22m [2m│ gzip:  1.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/_id_/icon.mjs.map             [2m  2.94 kB[22m [2m│ gzip:  1.30 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/index.mjs.map                               [2m  2.94 kB[22m [2m│ gzip:  1.30 kB[22m
[34mℹ[39m [2mdist/[22mruntime.mjs.map                                                          [2m  2.91 kB[22m [2m│ gzip:  1.25 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/settings.mjs.map                                        [2m  2.89 kB[22m [2m│ gzip:  1.06 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/index.mjs.map                                [2m  2.89 kB[22m [2m│ gzip:  1.02 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/redirects/index.mjs.map                                 [2m  2.86 kB[22m [2m│ gzip:  1.00 kB[22m
[34mℹ[39m [2mdist/[22mpreview-D4z0WONU.mjs                                                     [2m  2.85 kB[22m [2m│ gzip:  1.03 kB[22m
[34mℹ[39m [2mdist/[22mparse-B6s9lMve.mjs                                                       [2m  2.83 kB[22m [2m│ gzip:  1.15 kB[22m
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
[34mℹ[39m [2mdist/[22mtypes-D8QBfkBe.mjs                                                       [2m  2.64 kB[22m [2m│ gzip:  1.20 kB[22m
[34mℹ[39m [2mdist/[22mseo-Dq707mNQ.mjs                                                         [2m  2.59 kB[22m [2m│ gzip:  1.21 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/callback.mjs.map                [2m  2.55 kB[22m [2m│ gzip:  1.19 kB[22m
[34mℹ[39m [2mdist/[22mplaceholder-KCkkCtgQ.d.mts.map                                           [2m  2.50 kB[22m [2m│ gzip:  0.92 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/index.mjs.map                                     [2m  2.48 kB[22m [2m│ gzip:  0.97 kB[22m
[34mℹ[39m [2mdist/[22mconfig-CVssduLe.mjs.map                                                  [2m  2.48 kB[22m [2m│ gzip:  1.09 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/themes/marketplace/index.mjs.map                  [2m  2.44 kB[22m [2m│ gzip:  1.06 kB[22m
[34mℹ[39m [2mdist/[22mschema-CQUT48My.mjs.map                                                  [2m  2.44 kB[22m [2m│ gzip:  1.04 kB[22m
[34mℹ[39m [2mdist/[22mbase64-CqR-7kqF.mjs                                                      [2m  2.44 kB[22m [2m│ gzip:  0.92 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/index.mjs.map                        [2m  2.42 kB[22m [2m│ gzip:  0.89 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/index.mjs.map          [2m  2.41 kB[22m [2m│ gzip:  0.83 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/_id_/uninstall.mjs.map           [2m  2.39 kB[22m [2m│ gzip:  1.08 kB[22m
[34mℹ[39m [2mdist/[22mindex-CC42STEm.d.mts.map                                                 [2m  2.36 kB[22m [2m│ gzip:  0.80 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/hooks/exclusive/index.mjs.map                     [2m  2.33 kB[22m [2m│ gzip:  1.11 kB[22m
[34mℹ[39m [2mdist/[22mtransaction-NQj4VJ7Z.mjs.map                                             [2m  2.32 kB[22m [2m│ gzip:  1.10 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/signup/verify.mjs.map                              [2m  2.29 kB[22m [2m│ gzip:  1.13 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/enable.mjs.map                       [2m  2.28 kB[22m [2m│ gzip:  1.05 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/mode.mjs.map                                       [2m  2.27 kB[22m [2m│ gzip:  1.13 kB[22m
[34mℹ[39m [2mdist/[22mauthorize-DcdT4sLv.mjs.map                                               [2m  2.24 kB[22m [2m│ gzip:  0.85 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/accept.mjs.map                              [2m  2.22 kB[22m [2m│ gzip:  1.09 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/well-known/oauth-authorization-server.mjs.map           [2m  2.21 kB[22m [2m│ gzip:  0.97 kB[22m
[34mℹ[39m [2mdist/[22moptions-bpdOI25k.d.mts.map                                               [2m  2.19 kB[22m [2m│ gzip:  0.83 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/search/suggest.mjs.map                                  [2m  2.19 kB[22m [2m│ gzip:  1.06 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/uninstall.mjs.map                    [2m  2.18 kB[22m [2m│ gzip:  0.98 kB[22m
[34mℹ[39m [2mdist/[22mhash-DlUxGhQS.mjs.map                                                    [2m  2.18 kB[22m [2m│ gzip:  1.05 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/index.mjs.map                              [2m  2.11 kB[22m [2m│ gzip:  1.03 kB[22m
[34mℹ[39m [2mdist/[22mdb-errors-BiYqoX-n.mjs                                                   [2m  2.10 kB[22m [2m│ gzip:  0.89 kB[22m
[34mℹ[39m [2mdist/[22msetup-complete-MzzN9u0b.mjs.map                                          [2m  2.08 kB[22m [2m│ gzip:  0.91 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/device/authorize.mjs.map                          [2m  2.06 kB[22m [2m│ gzip:  1.00 kB[22m
[34mℹ[39m [2mdist/[22mslugify-Cjh1ssOZ.mjs.map                                                 [2m  2.04 kB[22m [2m│ gzip:  1.01 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/index.mjs.map                            [2m  2.01 kB[22m [2m│ gzip:  0.90 kB[22m
[34mℹ[39m [2mdist/[22mtrusted-proxy-97pajC2f.mjs                                               [2m  1.99 kB[22m [2m│ gzip:  0.97 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/enable.mjs.map                         [2m  1.99 kB[22m [2m│ gzip:  0.94 kB[22m
[34mℹ[39m [2mdist/[22mcomponents-Dx3DM0gg.mjs                                                  [2m  1.99 kB[22m [2m│ gzip:  0.71 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/bulk.mjs.map                             [2m  1.98 kB[22m [2m│ gzip:  0.88 kB[22m
[34mℹ[39m [2mdist/[22mcache-TLGC4FOa.mjs                                                       [2m  1.97 kB[22m [2m│ gzip:  0.80 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/index.mjs.map                 [2m  1.91 kB[22m [2m│ gzip:  0.86 kB[22m
[34mℹ[39m [2mdist/[22msettings-BJNIHNLp.mjs.map                                                [2m  1.91 kB[22m [2m│ gzip:  0.71 kB[22m
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
[34mℹ[39m [2mdist/[22mpasskey-config-BloQOT3y.mjs                                              [2m  1.56 kB[22m [2m│ gzip:  0.74 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/trash.mjs.map                      [2m  1.55 kB[22m [2m│ gzip:  0.77 kB[22m
[34mℹ[39m [2mdist/[22mapi/route-utils.mjs.map                                                  [2m  1.54 kB[22m [2m│ gzip:  0.70 kB[22m
[34mℹ[39m [2mdist/[22mtypes-CkDSF81F.d.mts.map                                                 [2m  1.53 kB[22m [2m│ gzip:  0.67 kB[22m
[34mℹ[39m [2mdist/[22mtypes-DSZl1Dsv.mjs                                                       [2m  1.49 kB[22m [2m│ gzip:  0.70 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/index.mjs.map                        [2m  1.48 kB[22m [2m│ gzip:  0.74 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/_id_/index.mjs.map            [2m  1.45 kB[22m [2m│ gzip:  0.72 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/logout.mjs.map                                     [2m  1.44 kB[22m [2m│ gzip:  0.77 kB[22m
[34mℹ[39m [2mdist/[22mtypes-gT5WUneM.d.mts.map                                                 [2m  1.44 kB[22m [2m│ gzip:  0.51 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/themes/marketplace/_id_/index.mjs.map             [2m  1.43 kB[22m [2m│ gzip:  0.72 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/dev/emails.mjs.map                                      [2m  1.43 kB[22m [2m│ gzip:  0.63 kB[22m
[34mℹ[39m [2mdist/[22moauth-user-lookup-3JwsVw6N.mjs.map                                       [2m  1.41 kB[22m [2m│ gzip:  0.76 kB[22m
[34mℹ[39m [2mdist/[22mdefault-BvTAYCzx.mjs                                                     [2m  1.35 kB[22m [2m│ gzip:  0.50 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/dashboard.mjs.map                                       [2m  1.34 kB[22m [2m│ gzip:  0.71 kB[22m
[34mℹ[39m [2mdist/[22mslugify-Cjh1ssOZ.mjs                                                     [2m  1.31 kB[22m [2m│ gzip:  0.71 kB[22m
[34mℹ[39m [2mdist/[22mplugin-types.d.mts.map                                                   [2m  1.31 kB[22m [2m│ gzip:  0.48 kB[22m
[34mℹ[39m [2mdist/[22msite-url-xkhw1tcz.mjs.map                                                [2m  1.30 kB[22m [2m│ gzip:  0.73 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/counts.mjs.map                           [2m  1.30 kB[22m [2m│ gzip:  0.65 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/search/stats.mjs.map                                    [2m  1.29 kB[22m [2m│ gzip:  0.69 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/revisions/_revisionId_/index.mjs.map                    [2m  1.29 kB[22m [2m│ gzip:  0.68 kB[22m
[34mℹ[39m [2mdist/[22mload-DmRYiTq9.mjs.map                                                    [2m  1.28 kB[22m [2m│ gzip:  0.64 kB[22m
[34mℹ[39m [2mdist/[22mmime-KV5TqkMN.mjs                                                        [2m  1.28 kB[22m [2m│ gzip:  0.64 kB[22m
[34mℹ[39m [2mdist/[22mauthorize-DcdT4sLv.mjs                                                   [2m  1.28 kB[22m [2m│ gzip:  0.51 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/index.mjs.map                             [2m  1.27 kB[22m [2m│ gzip:  0.67 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/compare.mjs.map               [2m  1.25 kB[22m [2m│ gzip:  0.67 kB[22m
[34mℹ[39m [2mdist/[22mconfig-CVssduLe.mjs                                                      [2m  1.23 kB[22m [2m│ gzip:  0.58 kB[22m
[34mℹ[39m [2mdist/[22mmedia-allowlist-BNloC69x.mjs                                             [2m  1.21 kB[22m [2m│ gzip:  0.71 kB[22m
[34mℹ[39m [2mdist/[22mhash-DlUxGhQS.mjs                                                        [2m  1.21 kB[22m [2m│ gzip:  0.66 kB[22m
[34mℹ[39m [2mdist/[22mschema-CQUT48My.mjs                                                      [2m  1.20 kB[22m [2m│ gzip:  0.60 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/providers/index.mjs.map                           [2m  1.16 kB[22m [2m│ gzip:  0.62 kB[22m
[34mℹ[39m [2mdist/[22msettings-BJNIHNLp.mjs                                                    [2m  1.16 kB[22m [2m│ gzip:  0.48 kB[22m
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
[34mℹ[39m [2mdist/[22mchunks-z2vEgDtL.mjs.map                                                  [2m  0.90 kB[22m [2m│ gzip:  0.57 kB[22m
[34mℹ[39m [2mdist/[22moauth-user-lookup-3JwsVw6N.mjs                                           [2m  0.81 kB[22m [2m│ gzip:  0.49 kB[22m
[34mℹ[39m [2mdist/[22mchunks-z2vEgDtL.mjs                                                      [2m  0.80 kB[22m [2m│ gzip:  0.51 kB[22m
[34mℹ[39m [2mdist/[22mredirect-BINiRYq4.mjs.map                                                [2m  0.75 kB[22m [2m│ gzip:  0.49 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/rewrite-url-helpers.d.mts.map          [2m  0.74 kB[22m [2m│ gzip:  0.34 kB[22m
[34mℹ[39m [2mdist/[22mdb/libsql.mjs.map                                                        [2m  0.71 kB[22m [2m│ gzip:  0.41 kB[22m
[34mℹ[39m [2mdist/[22mload-DmRYiTq9.mjs                                                        [2m  0.70 kB[22m [2m│ gzip:  0.38 kB[22m
[34mℹ[39m [2mdist/[22merrors-9P_FDrJ_.mjs.map                                                  [2m  0.67 kB[22m [2m│ gzip:  0.45 kB[22m
[34mℹ[39m [2mdist/[22madapters-C4yd_UJR.d.mts.map                                              [2m  0.67 kB[22m [2m│ gzip:  0.32 kB[22m
[34mℹ[39m [2mdist/[22mstorage/s3.d.mts.map                                                     [2m  0.67 kB[22m [2m│ gzip:  0.33 kB[22m
[34mℹ[39m [2mdist/[22mseo/index.d.mts.map                                                      [2m  0.64 kB[22m [2m│ gzip:  0.36 kB[22m
[34mℹ[39m [2mdist/[22mstorage/local.d.mts.map                                                  [2m  0.62 kB[22m [2m│ gzip:  0.32 kB[22m
[34mℹ[39m [2mdist/[22mtypes-Dgo6y-Ut.d.mts.map                                                 [2m  0.59 kB[22m [2m│ gzip:  0.31 kB[22m
[34mℹ[39m [2mdist/[22mversion-Ckp2pIft.mjs.map                                                 [2m  0.59 kB[22m [2m│ gzip:  0.33 kB[22m
[34mℹ[39m [2mdist/[22mescape-Cg6kMELH.mjs.map                                                  [2m  0.58 kB[22m [2m│ gzip:  0.34 kB[22m
[34mℹ[39m [2mdist/[22mmode-CaaiebZI.mjs                                                        [2m  0.58 kB[22m [2m│ gzip:  0.36 kB[22m
[34mℹ[39m [2mdist/[22mrequest-context.d.mts.map                                                [2m  0.57 kB[22m [2m│ gzip:  0.31 kB[22m
[34mℹ[39m [2mdist/[22mplugin-utils.d.mts.map                                                   [2m  0.56 kB[22m [2m│ gzip:  0.30 kB[22m
[34mℹ[39m [2mdist/[22mdatabase/instrumentation.d.mts.map                                       [2m  0.53 kB[22m [2m│ gzip:  0.28 kB[22m
[34mℹ[39m [2mdist/[22mredirect-BINiRYq4.mjs                                                    [2m  0.53 kB[22m [2m│ gzip:  0.37 kB[22m
[34mℹ[39m [2mdist/[22merrors-9P_FDrJ_.mjs                                                      [2m  0.53 kB[22m [2m│ gzip:  0.34 kB[22m
[34mℹ[39m [2mdist/[22mtransport-C2MGqtL6.d.mts.map                                             [2m  0.49 kB[22m [2m│ gzip:  0.28 kB[22m
[34mℹ[39m [2mdist/[22mrunner-DSQBurMS.d.mts.map                                                [2m  0.49 kB[22m [2m│ gzip:  0.25 kB[22m
[34mℹ[39m [2mdist/[22mclient/cf-access.d.mts.map                                               [2m  0.49 kB[22m [2m│ gzip:  0.27 kB[22m
[34mℹ[39m [2mdist/[22mapi/route-utils.d.mts.map                                                [2m  0.48 kB[22m [2m│ gzip:  0.27 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/media.d.mts.map                        [2m  0.45 kB[22m [2m│ gzip:  0.25 kB[22m
[34mℹ[39m [2mdist/[22msite-url-xkhw1tcz.mjs                                                    [2m  0.44 kB[22m [2m│ gzip:  0.30 kB[22m
[34mℹ[39m [2mdist/[22mmedia/local-runtime.d.mts.map                                            [2m  0.40 kB[22m [2m│ gzip:  0.23 kB[22m
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
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/artifact.d.mts.map               [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
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
[34mℹ[39m [2mdist/[22mversion-Ckp2pIft.mjs                                                     [2m  0.17 kB[22m [2m│ gzip:  0.16 kB[22m
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
[34mℹ[39m [2mdist/[22m[32m[1mindex.d.mts[22m[39m                                                              [2m 18.24 kB[22m [2m│ gzip:  4.84 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/types.d.mts[22m[39m                                                        [2m 12.99 kB[22m [2m│ gzip:  3.96 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mclient/index.d.mts[22m[39m                                                       [2m 11.48 kB[22m [2m│ gzip:  3.14 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mapi/schemas/index.d.mts[22m[39m                                                  [2m  7.93 kB[22m [2m│ gzip:  1.88 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mpage/index.d.mts[22m[39m                                                         [2m  6.82 kB[22m [2m│ gzip:  2.27 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mplugin-types.d.mts[22m[39m                                                       [2m  6.61 kB[22m [2m│ gzip:  2.36 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/execute.d.mts[22m[39m                          [2m  3.91 kB[22m [2m│ gzip:  1.54 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mapi/route-utils.d.mts[22m[39m                                                    [2m  2.94 kB[22m [2m│ gzip:  1.35 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mplugin-utils.d.mts[22m[39m                                                       [2m  2.84 kB[22m [2m│ gzip:  1.24 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mrequest-context.d.mts[22m[39m                                                    [2m  2.81 kB[22m [2m│ gzip:  1.29 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/index.d.mts[22m[39m                                                        [2m  2.60 kB[22m [2m│ gzip:  1.17 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mclient/cf-access.d.mts[22m[39m                                                   [2m  2.55 kB[22m [2m│ gzip:  1.04 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/analyze.d.mts[22m[39m                          [2m  2.52 kB[22m [2m│ gzip:  0.95 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mseo/index.d.mts[22m[39m                                                          [2m  2.45 kB[22m [2m│ gzip:  1.01 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/rewrite-url-helpers.d.mts[22m[39m              [2m  2.14 kB[22m [2m│ gzip:  0.89 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mdatabase/instrumentation.d.mts[22m[39m                                           [2m  2.00 kB[22m [2m│ gzip:  0.95 kB[22m
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
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/registry/artifact.d.mts[22m[39m                   [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
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
[34mℹ[39m [2mdist/[22m[32mindex-ByzreLAZ.d.mts[39m                                                     [2m154.89 kB[22m [2m│ gzip: 41.94 kB[22m
[34mℹ[39m [2mdist/[22m[32mbylines-DctOoid7.d.mts[39m                                                   [2m 74.39 kB[22m [2m│ gzip:  8.52 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-DSWHB41B.d.mts[39m                                                     [2m 40.10 kB[22m [2m│ gzip: 10.71 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-DaqNzqVt.d.mts[39m                                                     [2m 11.55 kB[22m [2m│ gzip:  2.61 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-bYmRn_Uy.d.mts[39m                                                     [2m  9.78 kB[22m [2m│ gzip:  3.24 kB[22m
[34mℹ[39m [2mdist/[22m[32mvalidate-0_3g7fpb.d.mts[39m                                                  [2m  9.46 kB[22m [2m│ gzip:  2.96 kB[22m
[34mℹ[39m [2mdist/[22m[32mplaceholder-KCkkCtgQ.d.mts[39m                                               [2m  8.70 kB[22m [2m│ gzip:  2.96 kB[22m
[34mℹ[39m [2mdist/[22m[32mindex-CC42STEm.d.mts[39m                                                     [2m  7.74 kB[22m [2m│ gzip:  2.83 kB[22m
[34mℹ[39m [2mdist/[22m[32moptions-bpdOI25k.d.mts[39m                                                   [2m  6.44 kB[22m [2m│ gzip:  2.43 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-D599-ruj.d.mts[39m                                                     [2m  6.19 kB[22m [2m│ gzip:  2.34 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-gT5WUneM.d.mts[39m                                                     [2m  5.94 kB[22m [2m│ gzip:  2.29 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-CpUuGcd5.d.mts[39m                                                     [2m  5.73 kB[22m [2m│ gzip:  1.66 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-CkDSF81F.d.mts[39m                                                     [2m  5.04 kB[22m [2m│ gzip:  1.78 kB[22m
[34mℹ[39m [2mdist/[22m[32madapters-C4yd_UJR.d.mts[39m                                                  [2m  3.21 kB[22m [2m│ gzip:  1.32 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-Dgo6y-Ut.d.mts[39m                                                     [2m  2.64 kB[22m [2m│ gzip:  1.17 kB[22m
[34mℹ[39m [2mdist/[22m[32mrunner-DSQBurMS.d.mts[39m                                                    [2m  1.98 kB[22m [2m│ gzip:  0.93 kB[22m
[34mℹ[39m [2mdist/[22m[32mtransport-C2MGqtL6.d.mts[39m                                                 [2m  1.67 kB[22m [2m│ gzip:  0.76 kB[22m
[34mℹ[39m 999 files, total: 7040.18 kB
[33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugins. Here is a breakdown:
  - rolldown-plugin-dts:generate (52%)
  - rolldown-plugin-dts:resolver (37%)
See https://rolldown.rs/options/checks#plugintimings for more details.

[32m✔[39m Build complete in [32m6087ms[39m
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
[34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/package/release.js[22m                    [2m 4.10 kB[22m [2m│ gzip: 0.81 kB[22m
[34mℹ[39m [2mdist/[22m[1mindex.js[22m                                                                         [2m 3.85 kB[22m [2m│ gzip: 1.00 kB[22m
[34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/aggregator/defs.js[22m                    [2m 2.53 kB[22m [2m│ gzip: 0.64 kB[22m
[34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/publisher/profile.js[22m                  [2m 2.01 kB[22m [2m│ gzip: 0.58 kB[22m
[34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/aggregator/searchPackages.js[22m          [2m 1.55 kB[22m [2m│ gzip: 0.53 kB[22m
[34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/aggregator/listReleases.js[22m            [2m 1.41 kB[22m [2m│ gzip: 0.53 kB[22m
[34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/publisher/verification.js[22m             [2m 0.99 kB[22m [2m│ gzip: 0.45 kB[22m
[34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/aggregator/getLatestRelease.js[22m        [2m 0.87 kB[22m [2m│ gzip: 0.44 kB[22m
[34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/aggregator/resolvePackage.js[22m          [2m 0.86 kB[22m [2m│ gzip: 0.44 kB[22m
[34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/aggregator/getPackage.js[22m              [2m 0.84 kB[22m [2m│ gzip: 0.44 kB[22m
[34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/package/release.js.map                [2m11.73 kB[22m [2m│ gzip: 3.21 kB[22m
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
[34mℹ[39m [2mdist/[22m[32m[1mgenerated/types/com/emdashcms/experimental/package/release.d.ts[22m[39m                  [2m 8.64 kB[22m [2m│ gzip: 2.55 kB[22m
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
[34mℹ[39m 49 files, total: 155.30 kB
[32m✔[39m Build complete in [32m705ms[39m
$ pnpm build
==> pnpm-build-workspace
$ pnpm run --filter {./packages/**} build
Scope: 32 of 61 workspace projects
packages/auth build$ tsdown
packages/blocks build$ tsdown
packages/contentful-to-portable-text build$ tsdown src/index.ts --format esm --dts --clean
packages/create-emdash build$ tsdown
packages/blocks build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/create-emdash build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/auth build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/contentful-to-portable-text build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/create-emdash build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/create-emdash/tsdown.config.ts[24m
packages/create-emdash build: [34mℹ[39m entry: [34msrc/index.ts[39m
packages/create-emdash build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/create-emdash build: [34mℹ[39m Build start
packages/blocks build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/blocks/tsdown.config.ts[24m
packages/create-emdash build: [34mℹ[39m Cleaning 3 files
packages/blocks build: [34mℹ[39m entry: [34msrc/index.ts, src/server.ts[39m
packages/blocks build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/blocks build: [34mℹ[39m Build start
packages/blocks build: [34mℹ[39m Cleaning 10 files
packages/contentful-to-portable-text build: [34mℹ[39m entry: [34msrc/index.ts[39m
packages/contentful-to-portable-text build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/contentful-to-portable-text build: [34mℹ[39m Build start
packages/contentful-to-portable-text build: [34mℹ[39m Cleaning 4 files
packages/auth build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/auth/tsdown.config.ts[24m
packages/auth build: [34mℹ[39m entry: [34msrc/index.ts, src/passkey/index.ts, src/adapters/kysely.ts, src/oauth/providers/github.ts, src/oauth/providers/google.ts[39m
packages/auth build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/auth build: [34mℹ[39m Build start
packages/auth build: [34mℹ[39m Cleaning 32 files
packages/contentful-to-portable-text build: [34mℹ[39m [2mdist/[22m[1mindex.mjs[22m        [2m15.95 kB[22m [2m│ gzip: 4.30 kB[22m
packages/contentful-to-portable-text build: [34mℹ[39m [2mdist/[22mindex.mjs.map    [2m39.25 kB[22m [2m│ gzip: 9.30 kB[22m
packages/contentful-to-portable-text build: [34mℹ[39m [2mdist/[22mindex.d.mts.map  [2m 0.66 kB[22m [2m│ gzip: 0.33 kB[22m
packages/contentful-to-portable-text build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.mts[22m[39m      [2m 2.15 kB[22m [2m│ gzip: 0.88 kB[22m
packages/contentful-to-portable-text build: [34mℹ[39m 4 files, total: 58.01 kB
packages/contentful-to-portable-text build: [32m✔[39m Build complete in [32m794ms[39m
packages/create-emdash build: [34mℹ[39m Granting execute permission to [4mdist/index.mjs[24m
packages/create-emdash build: [34mℹ[39m [2mdist/[22m[1mindex.mjs[22m      [2m20.18 kB[22m [2m│ gzip:  6.50 kB[22m
packages/create-emdash build: [34mℹ[39m [2mdist/[22mindex.mjs.map  [2m38.84 kB[22m [2m│ gzip: 11.84 kB[22m
packages/contentful-to-portable-text build: Done
packages/create-emdash build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.mts[22m[39m    [2m 0.01 kB[22m [2m│ gzip:  0.03 kB[22m
packages/create-emdash build: [34mℹ[39m 3 files, total: 59.03 kB
packages/create-emdash build: [32m✔[39m Build complete in [32m824ms[39m
packages/gutenberg-to-portable-text build$ tsdown src/index.ts --format esm --dts --clean
packages/create-emdash build: Done
packages/plugin-types build$ tsdown
packages/gutenberg-to-portable-text build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/gutenberg-to-portable-text build: [34mℹ[39m entry: [34msrc/index.ts[39m
packages/gutenberg-to-portable-text build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/gutenberg-to-portable-text build: [34mℹ[39m Build start
packages/plugin-types build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/gutenberg-to-portable-text build: [34mℹ[39m Cleaning 5 files
packages/plugin-types build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugin-types/tsdown.config.ts[24m
packages/plugin-types build: [34mℹ[39m entry: [34msrc/index.ts[39m
packages/plugin-types build: [34mℹ[39m target: [34mes2023[39m
packages/plugin-types build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugin-types build: [34mℹ[39m Build start
packages/plugin-types build: [34mℹ[39m Cleaning 4 files
packages/plugin-types build: [34mℹ[39m [2mdist/[22m[1mindex.js[22m        [2m 4.31 kB[22m [2m│ gzip: 1.96 kB[22m
packages/plugin-types build: [34mℹ[39m [2mdist/[22mindex.js.map    [2m13.45 kB[22m [2m│ gzip: 4.90 kB[22m
packages/plugin-types build: [34mℹ[39m [2mdist/[22mindex.d.ts.map  [2m 1.23 kB[22m [2m│ gzip: 0.56 kB[22m
packages/plugin-types build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.ts[22m[39m      [2m10.06 kB[22m [2m│ gzip: 3.84 kB[22m
packages/plugin-types build: [34mℹ[39m 4 files, total: 29.04 kB
packages/plugin-types build: [32m✔[39m Build complete in [32m376ms[39m
packages/plugin-types build: Done
packages/registry-lexicons build$ pnpm run build:lexicons && pnpm run build:types
packages/gutenberg-to-portable-text build: [34mℹ[39m [2mdist/[22m[1mindex.mjs[22m           [2m42.66 kB[22m [2m│ gzip:  9.88 kB[22m
packages/gutenberg-to-portable-text build: [34mℹ[39m [2mdist/[22mindex.mjs.map       [2m92.08 kB[22m [2m│ gzip: 20.03 kB[22m
packages/gutenberg-to-portable-text build: [34mℹ[39m [2mdist/[22mindex.d.mts.map     [2m 3.63 kB[22m [2m│ gzip:  1.03 kB[22m
packages/gutenberg-to-portable-text build: [34mℹ[39m [2mdist/[22mchunk-DQk6qfdC.mjs  [2m 0.38 kB[22m [2m│ gzip:  0.26 kB[22m
packages/gutenberg-to-portable-text build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.mts[22m[39m         [2m11.56 kB[22m [2m│ gzip:  2.98 kB[22m
packages/gutenberg-to-portable-text build: [34mℹ[39m 5 files, total: 150.32 kB
packages/gutenberg-to-portable-text build: [32m✔[39m Build complete in [32m754ms[39m
packages/gutenberg-to-portable-text build: Done
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
packages/x402 build$ tsdown
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
packages/auth build: [32m✔[39m Build complete in [32m1672ms[39m
packages/auth build: Done
packages/registry-lexicons build: $ node scripts/copy-lexicons.mjs
packages/registry-lexicons build: using in-package lexicon copy at /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-lexicons/lexicons/com/emdashcms/experimental (no source at /home/data/dev_react/awcms-micro/awcmsmicro-dev/lexicons/com/emdashcms/experimental)
packages/x402 build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/x402 build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/x402/tsdown.config.ts[24m
packages/x402 build: [34mℹ[39m entry: [34msrc/index.ts, src/middleware.ts[39m
packages/x402 build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/x402 build: [34mℹ[39m Build start
packages/x402 build: [34mℹ[39m Cleaning 10 files
packages/registry-lexicons build: $ tsdown
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
packages/blocks build: [32m✔[39m Build complete in [32m2128ms[39m
packages/blocks build: Done
packages/registry-lexicons build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/registry-lexicons build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-lexicons/tsdown.config.ts[24m
packages/registry-lexicons build: [34mℹ[39m entry: [34msrc/index.ts, src/generated/types/com/emdashcms/experimental/aggregator/defs.ts, src/generated/types/com/emdashcms/experimental/aggregator/getLatestRelease.ts, src/generated/types/com/emdashcms/experimental/aggregator/getPackage.ts, src/generated/types/com/emdashcms/experimental/aggregator/listReleases.ts, src/generated/types/com/emdashcms/experimental/aggregator/resolvePackage.ts, src/generated/types/com/emdashcms/experimental/aggregator/searchPackages.ts, src/generated/types/com/emdashcms/experimental/package/profile.ts, src/generated/types/com/emdashcms/experimental/package/release.ts, src/generated/types/com/emdashcms/experimental/package/releaseExtension.ts, src/generated/types/com/emdashcms/experimental/publisher/profile.ts, src/generated/types/com/emdashcms/experimental/publisher/verification.ts[39m
packages/registry-lexicons build: [34mℹ[39m target: [34mes2023[39m
packages/registry-lexicons build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/registry-lexicons build: [34mℹ[39m Build start
packages/registry-lexicons build: [34mℹ[39m Cleaning 57 files
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/package/releaseExtension.js[22m           [2m 5.50 kB[22m [2m│ gzip: 0.86 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/package/profile.js[22m                    [2m 4.45 kB[22m [2m│ gzip: 0.78 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/package/release.js[22m                    [2m 4.10 kB[22m [2m│ gzip: 0.81 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[1mindex.js[22m                                                                         [2m 3.85 kB[22m [2m│ gzip: 1.00 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/aggregator/defs.js[22m                    [2m 2.53 kB[22m [2m│ gzip: 0.64 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/publisher/profile.js[22m                  [2m 2.01 kB[22m [2m│ gzip: 0.58 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/aggregator/searchPackages.js[22m          [2m 1.55 kB[22m [2m│ gzip: 0.53 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/aggregator/listReleases.js[22m            [2m 1.41 kB[22m [2m│ gzip: 0.53 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/publisher/verification.js[22m             [2m 0.99 kB[22m [2m│ gzip: 0.45 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/aggregator/getLatestRelease.js[22m        [2m 0.87 kB[22m [2m│ gzip: 0.44 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/aggregator/resolvePackage.js[22m          [2m 0.86 kB[22m [2m│ gzip: 0.44 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[1mgenerated/types/com/emdashcms/experimental/aggregator/getPackage.js[22m              [2m 0.84 kB[22m [2m│ gzip: 0.44 kB[22m
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22mgenerated/types/com/emdashcms/experimental/package/release.js.map                [2m11.73 kB[22m [2m│ gzip: 3.21 kB[22m
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
packages/registry-lexicons build: [34mℹ[39m [2mdist/[22m[32m[1mgenerated/types/com/emdashcms/experimental/package/release.d.ts[22m[39m                  [2m 8.64 kB[22m [2m│ gzip: 2.55 kB[22m
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
packages/registry-lexicons build: [34mℹ[39m 49 files, total: 155.30 kB
packages/registry-lexicons build: [32m✔[39m Build complete in [32m667ms[39m
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
packages/x402 build: [32m✔[39m Build complete in [32m1078ms[39m
packages/registry-lexicons build: Done
packages/x402 build: Done
packages/blocks/playground build$ vite build
packages/registry-client build$ tsdown
packages/registry-client build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/registry-client build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-client/tsdown.config.ts[24m
packages/registry-client build: [34mℹ[39m entry: [34msrc/index.ts, src/credentials/index.ts, src/discovery/index.ts, src/env/index.ts, src/publishing/index.ts[39m
packages/registry-client build: [34mℹ[39m target: [34mnode22[39m
packages/registry-client build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/registry-client build: [34mℹ[39m Build start
packages/registry-client build: [34mℹ[39m Cleaning 28 files
packages/blocks/playground build: vite v6.4.3 building for production...
packages/blocks/playground build: transforming...
packages/registry-client build: [34mℹ[39m [2mdist/[22m[1mdiscovery/index.js[22m          [2m 6.51 kB[22m [2m│ gzip: 2.58 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[1menv/index.js[22m                [2m 5.58 kB[22m [2m│ gzip: 2.28 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[1mpublishing/index.js[22m         [2m 5.04 kB[22m [2m│ gzip: 1.73 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[1mcredentials/index.js[22m        [2m 1.65 kB[22m [2m│ gzip: 0.74 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[1mindex.js[22m                    [2m 0.85 kB[22m [2m│ gzip: 0.31 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mmemory-DFUebEv3.js.map      [2m25.98 kB[22m [2m│ gzip: 8.65 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mpublishing/index.js.map     [2m14.70 kB[22m [2m│ gzip: 4.44 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mdiscovery/index.js.map      [2m11.96 kB[22m [2m│ gzip: 4.19 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mmemory-DFUebEv3.js          [2m11.32 kB[22m [2m│ gzip: 4.14 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22menv/index.js.map            [2m 8.35 kB[22m [2m│ gzip: 3.09 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mcredentials/index.js.map    [2m 2.23 kB[22m [2m│ gzip: 0.95 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mpublishing/index.d.ts.map   [2m 1.59 kB[22m [2m│ gzip: 0.56 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mmemory-BJDHdZ1M.d.ts.map    [2m 1.12 kB[22m [2m│ gzip: 0.37 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mdiscovery/index.d.ts.map    [2m 1.02 kB[22m [2m│ gzip: 0.42 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22menv/index.d.ts.map          [2m 0.61 kB[22m [2m│ gzip: 0.34 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mtypes-CVqU18IH.d.ts.map     [2m 0.58 kB[22m [2m│ gzip: 0.30 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mcredentials/index.d.ts.map  [2m 0.16 kB[22m [2m│ gzip: 0.14 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[32m[1mdiscovery/index.d.ts[22m[39m        [2m 6.11 kB[22m [2m│ gzip: 2.40 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[32m[1mpublishing/index.d.ts[22m[39m       [2m 5.79 kB[22m [2m│ gzip: 2.03 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[32m[1menv/index.d.ts[22m[39m              [2m 5.03 kB[22m [2m│ gzip: 1.99 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.ts[22m[39m                  [2m 1.32 kB[22m [2m│ gzip: 0.44 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[32m[1mcredentials/index.d.ts[22m[39m      [2m 1.13 kB[22m [2m│ gzip: 0.53 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[32mtypes-CVqU18IH.d.ts[39m         [2m 3.66 kB[22m [2m│ gzip: 1.65 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[32mmemory-BJDHdZ1M.d.ts[39m        [2m 1.94 kB[22m [2m│ gzip: 0.60 kB[22m
packages/registry-client build: [34mℹ[39m 24 files, total: 124.22 kB
packages/registry-client build: [32m✔[39m Build complete in [32m761ms[39m
packages/registry-client build: Done
packages/blocks/playground build: ✓ 5241 modules transformed.
packages/blocks/playground build: rendering chunks...
packages/blocks/playground build: computing gzip size...
packages/blocks/playground build: dist/index.html                     0.40 kB │ gzip:   0.28 kB
packages/blocks/playground build: dist/assets/index-J7vdwgIc.css    138.44 kB │ gzip:  22.18 kB
packages/blocks/playground build: dist/assets/index-nfgW9lZx.js   1,240.30 kB │ gzip: 398.67 kB
packages/blocks/playground build: ✓ built in 5.22s
packages/blocks/playground build: (!) Some chunks are larger than 500 kB after minification. Consider:
packages/blocks/playground build: - Using dynamic import() to code-split the application
packages/blocks/playground build: - Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
packages/blocks/playground build: - Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
packages/blocks/playground build: Done
packages/admin build$ node --run locale:compile && tsdown && node --run locale:copy && npx @tailwindcss/cli -i src/styles.css -o dist/styles.css --minify
packages/plugin-cli build$ node --run gen-schema && tsdown
packages/plugin-cli build: Wrote /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugin-cli/schemas/emdash-plugin.schema.json
packages/plugin-cli build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/admin build: Compiling message catalogs…
packages/plugin-cli build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugin-cli/tsdown.config.ts[24m
packages/plugin-cli build: [34mℹ[39m entry: [34msrc/index.ts[39m
packages/plugin-cli build: [34mℹ[39m target: [34mnode22[39m
packages/plugin-cli build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugin-cli build: [34mℹ[39m entry: [34msrc/api.ts[39m
packages/plugin-cli build: [34mℹ[39m target: [34mnode22[39m
packages/plugin-cli build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugin-cli build: [34mℹ[39m Build start
packages/plugin-cli build: [34mℹ[39m Cleaning 5 files
packages/admin build: Done in 535ms
packages/admin build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/admin build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tsdown.config.ts[24m
packages/admin build: [34mℹ[39m entry: [34msrc/index.ts, src/locales/index.ts[39m
packages/admin build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/admin build: [34mℹ[39m Build start
packages/admin build: [34mℹ[39m Cleaning 82 files
packages/plugin-cli build: [34mℹ[39m Granting execute permission to [4mdist/index.mjs[24m
packages/plugin-cli build: [34mℹ[39m [2mdist/[22m[1mindex.mjs[22m  [2m270.52 kB[22m [2m│ gzip: 83.16 kB[22m
packages/plugin-cli build: [34mℹ[39m 1 files, total: 270.52 kB
packages/plugin-cli build: [32m✔[39m Build complete in [32m1184ms[39m
packages/plugin-cli build: [34mℹ[39m [2mdist/[22m[1mapi.mjs[22m        [2m107.86 kB[22m [2m│ gzip: 33.30 kB[22m
packages/plugin-cli build: [34mℹ[39m [2mdist/[22mapi.mjs.map    [2m225.30 kB[22m [2m│ gzip: 60.60 kB[22m
packages/plugin-cli build: [34mℹ[39m [2mdist/[22mapi.d.mts.map  [2m  3.73 kB[22m [2m│ gzip:  1.30 kB[22m
packages/plugin-cli build: [34mℹ[39m [2mdist/[22m[32m[1mapi.d.mts[22m[39m      [2m 18.09 kB[22m [2m│ gzip:  5.83 kB[22m
packages/plugin-cli build: [34mℹ[39m 4 files, total: 354.98 kB
packages/plugin-cli build: [32m✔[39m Build complete in [32m1199ms[39m
packages/plugin-cli build: Done
packages/admin build: [34mℹ[39m [2mdist/[22m[1mindex.js[22m                                 [2m1244.45 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22m[1mlocales/index.js[22m                         [2m   0.42 kB[22m [2m│ gzip:  0.21 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mindex.js.map                             [2m1982.03 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-DM4nTj5f.js.map                 [2m 148.87 kB[22m [2m│ gzip: 31.76 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-DM4nTj5f.js                     [2m 133.31 kB[22m [2m│ gzip: 30.90 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-BN4vyHiG.js.map                 [2m 115.48 kB[22m [2m│ gzip: 31.01 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-i106aRME.js.map                 [2m 112.74 kB[22m [2m│ gzip: 31.11 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-BhJZUdNM.js.map                 [2m 107.91 kB[22m [2m│ gzip: 31.34 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-BVOoPS1P.js.map                 [2m 100.67 kB[22m [2m│ gzip: 30.38 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-hjLReItz.js.map                 [2m 100.09 kB[22m [2m│ gzip: 30.69 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-BN4vyHiG.js                     [2m 100.06 kB[22m [2m│ gzip: 29.79 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-i106aRME.js                     [2m  96.99 kB[22m [2m│ gzip: 30.07 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-BD_65K0V.js.map                 [2m  96.59 kB[22m [2m│ gzip: 29.93 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-Ci3qWtgU.js.map                 [2m  94.89 kB[22m [2m│ gzip: 30.31 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-D-_SGbOz.js.map                 [2m  94.74 kB[22m [2m│ gzip: 29.52 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-BhJZUdNM.js                     [2m  92.64 kB[22m [2m│ gzip: 30.30 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-BmrcnPkH.js.map                 [2m  92.59 kB[22m [2m│ gzip: 30.06 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-DmYn03-Q.js.map                 [2m  91.44 kB[22m [2m│ gzip: 30.42 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-DvbCodDU.js.map                 [2m  90.75 kB[22m [2m│ gzip: 29.44 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-BFHftbXk.js.map                 [2m  85.81 kB[22m [2m│ gzip: 27.12 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-DrlXH8qs.js.map                 [2m  85.50 kB[22m [2m│ gzip: 28.07 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-BVOoPS1P.js                     [2m  85.32 kB[22m [2m│ gzip: 29.05 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-DipaPvXM.js.map                 [2m  85.04 kB[22m [2m│ gzip: 27.33 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-hjLReItz.js                     [2m  84.72 kB[22m [2m│ gzip: 29.54 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-DifdYhaM.js.map                 [2m  84.21 kB[22m [2m│ gzip: 29.83 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-lm2mXTE8.js.map                 [2m  83.91 kB[22m [2m│ gzip: 28.65 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-BD_65K0V.js                     [2m  81.20 kB[22m [2m│ gzip: 28.65 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-Ci3qWtgU.js                     [2m  79.45 kB[22m [2m│ gzip: 29.20 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-D-_SGbOz.js                     [2m  79.38 kB[22m [2m│ gzip: 28.27 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-BmrcnPkH.js                     [2m  77.17 kB[22m [2m│ gzip: 28.77 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-DmYn03-Q.js                     [2m  75.77 kB[22m [2m│ gzip: 29.09 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-DvbCodDU.js                     [2m  75.34 kB[22m [2m│ gzip: 28.18 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-BFHftbXk.js                     [2m  70.85 kB[22m [2m│ gzip: 25.88 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-DrlXH8qs.js                     [2m  70.09 kB[22m [2m│ gzip: 26.75 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-DipaPvXM.js                     [2m  69.62 kB[22m [2m│ gzip: 26.00 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-DifdYhaM.js                     [2m  68.79 kB[22m [2m│ gzip: 28.62 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-lm2mXTE8.js                     [2m  68.47 kB[22m [2m│ gzip: 27.44 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mindex.d.ts.map                           [2m  34.21 kB[22m [2m│ gzip:  7.72 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mLocaleDirectionProvider-KBW4MIs4.js.map  [2m  15.08 kB[22m [2m│ gzip:  5.23 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mplugins-BZzztFdK.js.map                  [2m  11.23 kB[22m [2m│ gzip:  3.78 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mLocaleDirectionProvider-KBW4MIs4.js      [2m   9.05 kB[22m [2m│ gzip:  3.19 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mplugins-BZzztFdK.js                      [2m   3.95 kB[22m [2m│ gzip:  1.50 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mconfig-BRdaN73J.d.ts.map                 [2m   0.70 kB[22m [2m│ gzip:  0.38 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.ts[22m[39m                               [2m 123.66 kB[22m [2m│ gzip: 23.27 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22m[32m[1mlocales/index.d.ts[22m[39m                       [2m   0.47 kB[22m [2m│ gzip:  0.24 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22m[32mconfig-BRdaN73J.d.ts[39m                     [2m   2.97 kB[22m [2m│ gzip:  1.25 kB[22m
packages/admin build: [34mℹ[39m 46 files, total: 6508.64 kB
packages/admin build: [32m✔[39m Build complete in [32m4506ms[39m
packages/admin build: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugins. Here is a breakdown:
packages/admin build:   - rolldown-plugin-dts:generate (58%)
packages/admin build:   - lingui-macro (19%)
packages/admin build:   - tsdown:external (18%)
packages/admin build: See https://rolldown.rs/options/checks#plugintimings for more details.
packages/admin build: ≈ tailwindcss v4.3.0
packages/admin build: Done in 321ms
packages/admin build: Done
packages/core build$ tsdown
packages/core build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/core build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/core/tsdown.config.ts[24m
packages/core build: [34mℹ[39m entry: [34msrc/index.ts, src/request-context.ts, src/astro/index.ts, src/astro/middleware.ts, src/astro/middleware/setup.ts, src/astro/middleware/auth.ts, src/astro/middleware/redirect.ts, src/astro/middleware/request-context.ts, src/astro/types.ts, src/db/index.ts, src/db/sqlite.ts, src/db/libsql.ts, src/db/postgres.ts, src/database/instrumentation.ts, src/storage/local.ts, src/storage/s3.ts, src/media/index.ts, src/media/local-runtime.ts, src/runtime.ts, src/seed/index.ts, src/cli/index.ts, src/client/index.ts, src/client/cf-access.ts, src/seo/index.ts, src/page/index.ts, src/plugin-utils.ts, src/plugin-types.ts, src/plugins/adapt-sandbox-entry.ts, src/api/route-utils.ts, src/api/schemas/index.ts, src/auth/providers/github.ts, src/auth/providers/google.ts[39m
packages/core build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/core build: [34mℹ[39m Build start
packages/core build: [34mℹ[39m Cleaning 1092 files
packages/core build: [34mℹ[39m Granting execute permission to [4mdist/cli/index.mjs[24m
packages/core build: [34mℹ[39m [2mdist/[22m[1mcli/index.mjs[22m                                                            [2m142.25 kB[22m [2m│ gzip: 35.70 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/middleware.mjs[22m                                                     [2m 95.67 kB[22m [2m│ gzip: 24.64 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/openapi.json.mjs[22m                                        [2m 90.30 kB[22m [2m│ gzip: 14.40 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/mcp.mjs[22m                                                 [2m 67.85 kB[22m [2m│ gzip: 15.05 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/index.mjs[22m                                                          [2m 63.45 kB[22m [2m│ gzip: 14.86 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/middleware/request-context.mjs[22m                                     [2m 41.28 kB[22m [2m│ gzip: 10.35 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/execute.mjs[22m                            [2m 26.43 kB[22m [2m│ gzip:  8.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/middleware/auth.mjs[22m                                                [2m 21.78 kB[22m [2m│ gzip:  6.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mpage/index.mjs[22m                                                           [2m 13.75 kB[22m [2m│ gzip:  4.05 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mclient/index.mjs[22m                                                         [2m 12.89 kB[22m [2m│ gzip:  3.52 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/registry/artifact.mjs[22m                     [2m 12.58 kB[22m [2m│ gzip:  4.53 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/authorize.mjs[22m                                     [2m 11.85 kB[22m [2m│ gzip:  3.50 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/analyze.mjs[22m                            [2m  9.96 kB[22m [2m│ gzip:  3.36 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/snapshot.mjs[22m                                            [2m  9.29 kB[22m [2m│ gzip:  3.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mindex.mjs[22m                                                                [2m  8.44 kB[22m [2m│ gzip:  2.57 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/comments/_collection_/_contentId_/index.mjs[22m             [2m  8.32 kB[22m [2m│ gzip:  2.57 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress-plugin/execute.mjs[22m                     [2m  8.06 kB[22m [2m│ gzip:  2.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mapi/schemas/index.mjs[22m                                                    [2m  7.95 kB[22m [2m│ gzip:  1.89 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mstorage/s3.mjs[22m                                                           [2m  7.78 kB[22m [2m│ gzip:  2.79 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/media.mjs[22m                              [2m  6.55 kB[22m [2m│ gzip:  2.12 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mplugins/adapt-sandbox-entry.mjs[22m                                          [2m  5.88 kB[22m [2m│ gzip:  2.21 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/media.mjs[22m                                               [2m  5.74 kB[22m [2m│ gzip:  2.12 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/oauth/_provider_/callback.mjs[22m                      [2m  5.73 kB[22m [2m│ gzip:  2.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mclient/cf-access.mjs[22m                                                     [2m  5.69 kB[22m [2m│ gzip:  2.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mstorage/local.mjs[22m                                                        [2m  5.56 kB[22m [2m│ gzip:  2.04 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/rewrite-urls.mjs[22m                       [2m  5.55 kB[22m [2m│ gzip:  1.81 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_.mjs[22m                           [2m  5.01 kB[22m [2m│ gzip:  1.43 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/dev-bypass.mjs[22m                                    [2m  5.00 kB[22m [2m│ gzip:  2.00 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/token.mjs[22m                                         [2m  4.98 kB[22m [2m│ gzip:  1.69 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/sitemap-_collection_.xml.mjs[22m                                [2m  4.90 kB[22m [2m│ gzip:  1.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/rewrite-url-helpers.mjs[22m                [2m  4.64 kB[22m [2m│ gzip:  1.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs[22m          [2m  4.56 kB[22m [2m│ gzip:  1.48 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/register.mjs[22m                                      [2m  4.42 kB[22m [2m│ gzip:  1.65 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/_id_/index.mjs[22m                              [2m  4.36 kB[22m [2m│ gzip:  1.45 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/prepare.mjs[22m                            [2m  4.34 kB[22m [2m│ gzip:  1.62 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/registry/install.mjs[22m                      [2m  4.33 kB[22m [2m│ gzip:  1.72 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/settings/email.mjs[22m                                      [2m  4.32 kB[22m [2m│ gzip:  1.72 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/registry/_id_/update.mjs[22m                  [2m  4.20 kB[22m [2m│ gzip:  1.57 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mmedia/local-runtime.mjs[22m                                                  [2m  3.75 kB[22m [2m│ gzip:  1.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/_slug_/index.mjs[22m                     [2m  3.74 kB[22m [2m│ gzip:  1.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/index.mjs[22m                                         [2m  3.71 kB[22m [2m│ gzip:  1.41 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/admin-verify.mjs[22m                                  [2m  3.68 kB[22m [2m│ gzip:  1.39 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs[22m        [2m  3.65 kB[22m [2m│ gzip:  1.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/_name_/widgets/_id_.mjs[22m                    [2m  3.64 kB[22m [2m│ gzip:  1.10 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/upload-url.mjs[22m                                    [2m  3.53 kB[22m [2m│ gzip:  1.46 kB[22m
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
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/plugins/_pluginId_/_...path_.mjs[22m                        [2m  3.09 kB[22m [2m│ gzip:  1.37 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/bylines/_id_/index.mjs[22m                            [2m  3.09 kB[22m [2m│ gzip:  0.97 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/updates.mjs[22m                               [2m  3.08 kB[22m [2m│ gzip:  1.12 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/admin.mjs[22m                                         [2m  3.06 kB[22m [2m│ gzip:  1.23 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/registry/_id_/uninstall.mjs[22m               [2m  3.03 kB[22m [2m│ gzip:  1.09 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/index.mjs[22m                          [2m  3.02 kB[22m [2m│ gzip:  1.13 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/bylines/index.mjs[22m                                 [2m  3.02 kB[22m [2m│ gzip:  1.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/oauth/_provider_.mjs[22m                               [2m  3.00 kB[22m [2m│ gzip:  1.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/oauth-clients/_id_.mjs[22m                            [2m  3.00 kB[22m [2m│ gzip:  0.97 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/middleware/redirect.mjs[22m                                            [2m  2.93 kB[22m [2m│ gzip:  1.24 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/themes/marketplace/index.mjs[22m                      [2m  2.92 kB[22m [2m│ gzip:  1.11 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/uninstall.mjs[22m                        [2m  2.92 kB[22m [2m│ gzip:  1.10 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/bylines/_id_/translations.mjs[22m                     [2m  2.92 kB[22m [2m│ gzip:  1.11 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/enable.mjs[22m                           [2m  2.91 kB[22m [2m│ gzip:  1.07 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/index.mjs[22m                            [2m  2.86 kB[22m [2m│ gzip:  0.98 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/allowed-domains/_domain_.mjs[22m                      [2m  2.85 kB[22m [2m│ gzip:  0.98 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/publish.mjs[22m                   [2m  2.80 kB[22m [2m│ gzip:  1.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/redirects/_id_.mjs[22m                                      [2m  2.79 kB[22m [2m│ gzip:  0.83 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/_id_.mjs[22m                                   [2m  2.77 kB[22m [2m│ gzip:  0.98 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/signup/complete.mjs[22m                                [2m  2.77 kB[22m [2m│ gzip:  1.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/_slug_/fields/reorder.mjs[22m            [2m  2.77 kB[22m [2m│ gzip:  0.95 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/allowed-domains/index.mjs[22m                         [2m  2.76 kB[22m [2m│ gzip:  1.05 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/invite/complete.mjs[22m                                [2m  2.75 kB[22m [2m│ gzip:  1.13 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/marketplace/index.mjs[22m                     [2m  2.74 kB[22m [2m│ gzip:  1.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/disable.mjs[22m                          [2m  2.73 kB[22m [2m│ gzip:  1.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/dev-bypass.mjs[22m                                     [2m  2.72 kB[22m [2m│ gzip:  1.26 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress-plugin/analyze.mjs[22m                     [2m  2.71 kB[22m [2m│ gzip:  1.13 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/typegen.mjs[22m                                             [2m  2.66 kB[22m [2m│ gzip:  1.06 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_/translations.mjs[22m                           [2m  2.65 kB[22m [2m│ gzip:  0.93 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mplugin-utils.mjs[22m                                                         [2m  2.63 kB[22m [2m│ gzip:  1.21 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/orphans/_slug_.mjs[22m                               [2m  2.63 kB[22m [2m│ gzip:  0.99 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/marketplace/_id_/index.mjs[22m                [2m  2.60 kB[22m [2m│ gzip:  0.94 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/options.mjs[22m                                [2m  2.59 kB[22m [2m│ gzip:  1.06 kB[22m
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
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/sitemap.xml.mjs[22m                                             [2m  2.40 kB[22m [2m│ gzip:  1.11 kB[22m
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
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/orphans/index.mjs[22m                                [2m  2.21 kB[22m [2m│ gzip:  0.83 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/oauth-clients/index.mjs[22m                           [2m  2.20 kB[22m [2m│ gzip:  0.90 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/themes/preview.mjs[22m                                      [2m  2.15 kB[22m [2m│ gzip:  0.98 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/_name_.mjs[22m                                 [2m  2.15 kB[22m [2m│ gzip:  0.79 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/rebuild.mjs[22m                                      [2m  2.14 kB[22m [2m│ gzip:  0.92 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/api-tokens/index.mjs[22m                              [2m  2.13 kB[22m [2m│ gzip:  0.93 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/redirects/index.mjs[22m                                     [2m  2.12 kB[22m [2m│ gzip:  0.78 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/_id_/send-recovery.mjs[22m                      [2m  2.03 kB[22m [2m│ gzip:  0.96 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/device/token.mjs[22m                                  [2m  2.01 kB[22m [2m│ gzip:  0.94 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/index.mjs[22m                                        [2m  2.00 kB[22m [2m│ gzip:  0.95 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/index.mjs[22m                                   [2m  1.99 kB[22m [2m│ gzip:  0.94 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/enable.mjs[22m                                       [2m  1.97 kB[22m [2m│ gzip:  0.87 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/_id_/disable.mjs[22m                            [2m  1.96 kB[22m [2m│ gzip:  0.90 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/sections/index.mjs[22m                                      [2m  1.93 kB[22m [2m│ gzip:  0.73 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/_name_/reorder.mjs[22m                         [2m  1.92 kB[22m [2m│ gzip:  0.87 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/robots.txt.mjs[22m                                              [2m  1.88 kB[22m [2m│ gzip:  0.85 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/middleware/setup.mjs[22m                                               [2m  1.86 kB[22m [2m│ gzip:  0.86 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/file/_...key_.mjs[22m                                 [2m  1.84 kB[22m [2m│ gzip:  0.95 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/duplicate.mjs[22m                 [2m  1.81 kB[22m [2m│ gzip:  0.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/device/code.mjs[22m                                   [2m  1.80 kB[22m [2m│ gzip:  0.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/me.mjs[22m                                             [2m  1.77 kB[22m [2m│ gzip:  0.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mrequest-context.mjs[22m                                                      [2m  1.76 kB[22m [2m│ gzip:  0.90 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mapi/route-utils.mjs[22m                                                      [2m  1.76 kB[22m [2m│ gzip:  0.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/restore.mjs[22m                   [2m  1.72 kB[22m [2m│ gzip:  0.74 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/discard-draft.mjs[22m             [2m  1.71 kB[22m [2m│ gzip:  0.73 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/_id_.mjs[22m                                 [2m  1.70 kB[22m [2m│ gzip:  0.65 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/unpublish.mjs[22m                 [2m  1.70 kB[22m [2m│ gzip:  0.73 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/suggest.mjs[22m                                      [2m  1.67 kB[22m [2m│ gzip:  0.82 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/index.mjs[22m                                         [2m  1.65 kB[22m [2m│ gzip:  0.68 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/magic-link/verify.mjs[22m                              [2m  1.65 kB[22m [2m│ gzip:  0.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/revisions/_revisionId_/restore.mjs[22m                      [2m  1.64 kB[22m [2m│ gzip:  0.70 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/translations.mjs[22m              [2m  1.58 kB[22m [2m│ gzip:  0.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs[22m             [2m  1.56 kB[22m [2m│ gzip:  0.75 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/manifest.mjs[22m                                            [2m  1.56 kB[22m [2m│ gzip:  0.80 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/marketplace/_id_/icon.mjs[22m                 [2m  1.54 kB[22m [2m│ gzip:  0.75 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/index.mjs[22m                                [2m  1.48 kB[22m [2m│ gzip:  0.68 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/bulk.mjs[22m                                 [2m  1.47 kB[22m [2m│ gzip:  0.66 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/hooks/exclusive/index.mjs[22m                         [2m  1.45 kB[22m [2m│ gzip:  0.72 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/redirects/404s/summary.mjs[22m                              [2m  1.45 kB[22m [2m│ gzip:  0.66 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_/reorder.mjs[22m                                [2m  1.43 kB[22m [2m│ gzip:  0.66 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_/items.mjs[22m                                  [2m  1.42 kB[22m [2m│ gzip:  0.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/probe.mjs[22m                                        [2m  1.37 kB[22m [2m│ gzip:  0.66 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/well-known/auth.mjs[22m                                     [2m  1.37 kB[22m [2m│ gzip:  0.66 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/device/authorize.mjs[22m                              [2m  1.34 kB[22m [2m│ gzip:  0.69 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/signup/verify.mjs[22m                                  [2m  1.32 kB[22m [2m│ gzip:  0.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mruntime.mjs[22m                                                              [2m  1.32 kB[22m [2m│ gzip:  0.64 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/invite/accept.mjs[22m                                  [2m  1.28 kB[22m [2m│ gzip:  0.68 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/_id_/enable.mjs[22m                             [2m  1.28 kB[22m [2m│ gzip:  0.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/api-tokens/_id_.mjs[22m                               [2m  1.24 kB[22m [2m│ gzip:  0.65 kB[22m
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
packages/core build: [34mℹ[39m [2mdist/[22mapi-hhZPD60y.mjs.map                                                     [2m306.36 kB[22m [2m│ gzip: 66.56 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcli/index.mjs.map                                                        [2m283.02 kB[22m [2m│ gzip: 64.93 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrunner-CI81ODxm.mjs.map                                                  [2m251.77 kB[22m [2m│ gzip: 47.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/middleware.mjs.map                                                 [2m212.52 kB[22m [2m│ gzip: 54.26 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmenus-Db69unQr.mjs.map                                                   [2m186.63 kB[22m [2m│ gzip: 41.87 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/openapi.json.mjs.map                                    [2m170.23 kB[22m [2m│ gzip: 23.57 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mapi-hhZPD60y.mjs                                                         [2m144.88 kB[22m [2m│ gzip: 32.88 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/index.mjs.map                                                      [2m136.12 kB[22m [2m│ gzip: 32.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrunner-CI81ODxm.mjs                                                      [2m131.39 kB[22m [2m│ gzip: 24.27 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/mcp.mjs.map                                             [2m126.22 kB[22m [2m│ gzip: 24.49 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mimport-DG80rC_I.mjs.map                                                  [2m112.07 kB[22m [2m│ gzip: 25.69 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mredirects-BBHGtre3.mjs.map                                               [2m 95.13 kB[22m [2m│ gzip: 15.97 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmenus-Db69unQr.mjs                                                       [2m 86.17 kB[22m [2m│ gzip: 19.80 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcontext-B4P2Z1qj.mjs.map                                                 [2m 66.64 kB[22m [2m│ gzip: 15.80 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mapply-Da3UD2mq.mjs.map                                                   [2m 65.82 kB[22m [2m│ gzip: 16.76 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcontent-DyxDxgmj.mjs.map                                                 [2m 64.02 kB[22m [2m│ gzip: 13.88 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/execute.mjs.map                        [2m 59.52 kB[22m [2m│ gzip: 17.62 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mregistry-CjGQLO1Z.mjs.map                                                [2m 54.83 kB[22m [2m│ gzip: 13.21 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmenus-PSiW74iS.mjs.map                                                   [2m 50.90 kB[22m [2m│ gzip: 12.05 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mloader-bZR1z7LT.mjs.map                                                  [2m 49.36 kB[22m [2m│ gzip: 13.97 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/middleware/request-context.mjs.map                                 [2m 49.16 kB[22m [2m│ gzip: 12.37 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mquery-B0mBNMjj.mjs.map                                                   [2m 49.00 kB[22m [2m│ gzip: 14.82 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mimport-DG80rC_I.mjs                                                      [2m 48.70 kB[22m [2m│ gzip: 11.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mredirects-BBHGtre3.mjs                                                   [2m 47.10 kB[22m [2m│ gzip:  9.52 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/middleware/auth.mjs.map                                            [2m 44.81 kB[22m [2m│ gzip: 12.43 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mindex-ByzreLAZ.d.mts.map                                                 [2m 36.58 kB[22m [2m│ gzip: 10.10 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbyline-CstL9b86.mjs.map                                                  [2m 35.41 kB[22m [2m│ gzip:  9.24 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mvalidate-CXUcXc-l.mjs.map                                                [2m 34.77 kB[22m [2m│ gzip:  7.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtaxonomies-2PvZXH44.mjs.map                                              [2m 34.53 kB[22m [2m│ gzip:  8.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mclient/index.mjs.map                                                     [2m 32.97 kB[22m [2m│ gzip:  7.93 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcontent-DyxDxgmj.mjs                                                     [2m 32.67 kB[22m [2m│ gzip:  7.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mredirects-R7KQg4PF.mjs.map                                               [2m 32.59 kB[22m [2m│ gzip:  8.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mapply-Da3UD2mq.mjs                                                       [2m 32.53 kB[22m [2m│ gzip:  8.26 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mpage/index.mjs.map                                                       [2m 31.02 kB[22m [2m│ gzip:  8.42 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdevice-flow-B9oG8PwP.mjs.map                                             [2m 29.83 kB[22m [2m│ gzip:  7.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcontext-B4P2Z1qj.mjs                                                     [2m 28.49 kB[22m [2m│ gzip:  7.55 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mregistry-CjGQLO1Z.mjs                                                    [2m 27.45 kB[22m [2m│ gzip:  6.96 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22merror-BpfiIgsi.mjs.map                                                   [2m 27.13 kB[22m [2m│ gzip:  6.40 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msearch-B9Bz1U91.mjs.map                                                  [2m 26.55 kB[22m [2m│ gzip:  8.21 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mredirect-BUfqFptM.mjs.map                                                [2m 26.36 kB[22m [2m│ gzip:  6.98 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtransport-B6CHddbu.mjs.map                                               [2m 26.06 kB[22m [2m│ gzip:  7.48 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtaxonomies-B4kDFVLs.mjs.map                                              [2m 25.55 kB[22m [2m│ gzip:  6.21 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msecrets-rPdhEBkD.mjs.map                                                 [2m 24.92 kB[22m [2m│ gzip:  8.49 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mfts-manager-7GbTRjhQ.mjs.map                                             [2m 24.82 kB[22m [2m│ gzip:  6.62 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mloader-bZR1z7LT.mjs                                                      [2m 24.07 kB[22m [2m│ gzip:  7.26 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mssrf-MZ-zrG6-.mjs.map                                                    [2m 23.59 kB[22m [2m│ gzip:  8.30 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mquery-B0mBNMjj.mjs                                                       [2m 23.49 kB[22m [2m│ gzip:  7.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmenus-PSiW74iS.mjs                                                       [2m 23.34 kB[22m [2m│ gzip:  5.93 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/authorize.mjs.map                                 [2m 22.43 kB[22m [2m│ gzip:  6.46 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/analyze.mjs.map                        [2m 22.30 kB[22m [2m│ gzip:  6.90 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtaxonomy-BvXPbuTx.mjs.map                                                [2m 21.42 kB[22m [2m│ gzip:  5.59 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/artifact.mjs.map                 [2m 20.68 kB[22m [2m│ gzip:  7.13 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcomment-B6e8kaGZ.mjs.map                                                 [2m 20.47 kB[22m [2m│ gzip:  4.87 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/snapshot.mjs.map                                        [2m 19.89 kB[22m [2m│ gzip:  6.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msections-BclBhXBd.mjs.map                                                [2m 19.39 kB[22m [2m│ gzip:  4.78 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbyline-CstL9b86.mjs                                                      [2m 18.61 kB[22m [2m│ gzip:  5.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mzod-generator-D0CFhOHV.mjs.map                                           [2m 18.45 kB[22m [2m│ gzip:  5.43 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moauth-authorization-CTMeVfvj.mjs.map                                     [2m 17.99 kB[22m [2m│ gzip:  4.89 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22merror-BpfiIgsi.mjs                                                       [2m 17.21 kB[22m [2m│ gzip:  4.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-DSWHB41B.d.mts.map                                                 [2m 16.99 kB[22m [2m│ gzip:  4.66 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mutils-C3wTAP-P.mjs.map                                                   [2m 16.93 kB[22m [2m│ gzip:  5.01 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mvalidate-CXUcXc-l.mjs                                                    [2m 16.79 kB[22m [2m│ gzip:  3.79 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcron-Bd3b3iuj.mjs.map                                                    [2m 16.65 kB[22m [2m│ gzip:  5.39 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmedia-DGP4jrX7.mjs.map                                                   [2m 16.58 kB[22m [2m│ gzip:  4.99 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/execute.mjs.map                 [2m 16.41 kB[22m [2m│ gzip:  5.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mredirects-R7KQg4PF.mjs                                                   [2m 16.07 kB[22m [2m│ gzip:  4.26 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/comments/_collection_/_contentId_/index.mjs.map         [2m 15.95 kB[22m [2m│ gzip:  4.89 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msettings-kxA32mfK.mjs.map                                                [2m 15.73 kB[22m [2m│ gzip:  5.04 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtaxonomies-2PvZXH44.mjs                                                  [2m 15.58 kB[22m [2m│ gzip:  3.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moauth-clients-eJCbkVSG.mjs.map                                           [2m 15.58 kB[22m [2m│ gzip:  3.61 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mstorage/s3.mjs.map                                                       [2m 15.38 kB[22m [2m│ gzip:  5.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtaxonomies-B4kDFVLs.mjs                                                  [2m 14.94 kB[22m [2m│ gzip:  3.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdevice-flow-B9oG8PwP.mjs                                                 [2m 14.86 kB[22m [2m│ gzip:  3.83 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mplugins/adapt-sandbox-entry.mjs.map                                      [2m 14.73 kB[22m [2m│ gzip:  5.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mservice-C_cRTpA_.mjs.map                                                 [2m 14.62 kB[22m [2m│ gzip:  4.38 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbylines-MtpvnsH-.mjs.map                                                 [2m 14.10 kB[22m [2m│ gzip:  4.74 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mfts-manager-7GbTRjhQ.mjs                                                 [2m 13.79 kB[22m [2m│ gzip:  3.92 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msecrets-rPdhEBkD.mjs                                                     [2m 13.77 kB[22m [2m│ gzip:  5.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcomments-BwdV-Diu.mjs.map                                                [2m 13.34 kB[22m [2m│ gzip:  3.37 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msearch-B9Bz1U91.mjs                                                      [2m 13.23 kB[22m [2m│ gzip:  4.33 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mssrf-MZ-zrG6-.mjs                                                        [2m 12.75 kB[22m [2m│ gzip:  5.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/media.mjs.map                          [2m 12.71 kB[22m [2m│ gzip:  3.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmanifest-schema-Czqf0TLu.mjs.map                                         [2m 12.21 kB[22m [2m│ gzip:  3.36 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mredirect-BUfqFptM.mjs                                                    [2m 12.07 kB[22m [2m│ gzip:  3.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtransport-B6CHddbu.mjs                                                   [2m 12.05 kB[22m [2m│ gzip:  3.86 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/rewrite-urls.mjs.map                   [2m 11.45 kB[22m [2m│ gzip:  3.70 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/oauth/_provider_/callback.mjs.map                  [2m 11.29 kB[22m [2m│ gzip:  3.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mstorage/local.mjs.map                                                    [2m 11.26 kB[22m [2m│ gzip:  3.76 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mvalidation-HCnW6Iv2.mjs.map                                              [2m 11.09 kB[22m [2m│ gzip:  4.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtaxonomy-BvXPbuTx.mjs                                                    [2m 10.92 kB[22m [2m│ gzip:  3.06 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22muser-C7smaFYQ.mjs.map                                                    [2m 10.46 kB[22m [2m│ gzip:  3.27 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media.mjs.map                                           [2m 10.31 kB[22m [2m│ gzip:  3.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtokens-N8otWMmj.mjs.map                                                  [2m 10.30 kB[22m [2m│ gzip:  3.28 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/sitemap-_collection_.xml.mjs.map                            [2m 10.23 kB[22m [2m│ gzip:  3.64 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msetup-CY80tTMA.mjs.map                                                   [2m 10.10 kB[22m [2m│ gzip:  1.99 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/token.mjs.map                                     [2m 10.07 kB[22m [2m│ gzip:  3.04 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mnormalize-CN5kRSMC.mjs.map                                               [2m 10.06 kB[22m [2m│ gzip:  3.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_.mjs.map                       [2m 10.05 kB[22m [2m│ gzip:  2.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msections-BclBhXBd.mjs                                                    [2m  9.34 kB[22m [2m│ gzip:  2.48 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mseo-B2vqDA_Q.mjs.map                                                     [2m  9.19 kB[22m [2m│ gzip:  3.06 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcomment-B6e8kaGZ.mjs                                                     [2m  9.18 kB[22m [2m│ gzip:  2.50 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mresolve-D6sM-SgF.mjs.map                                                 [2m  9.12 kB[22m [2m│ gzip:  3.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/rewrite-url-helpers.mjs.map            [2m  9.07 kB[22m [2m│ gzip:  3.12 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcron-Bd3b3iuj.mjs                                                        [2m  8.95 kB[22m [2m│ gzip:  3.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mpatterns-CqG5Ya3i.mjs.map                                                [2m  8.92 kB[22m [2m│ gzip:  3.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mclient/cf-access.mjs.map                                                 [2m  8.87 kB[22m [2m│ gzip:  3.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmedia/index.mjs.map                                                      [2m  8.84 kB[22m [2m│ gzip:  2.92 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-D8QBfkBe.mjs.map                                                   [2m  8.75 kB[22m [2m│ gzip:  3.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/prepare.mjs.map                        [2m  8.65 kB[22m [2m│ gzip:  3.13 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moauth-authorization-CTMeVfvj.mjs                                         [2m  8.64 kB[22m [2m│ gzip:  2.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/setup/dev-bypass.mjs.map                                [2m  8.60 kB[22m [2m│ gzip:  3.24 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mapi-tokens-ucpcNXDt.mjs.map                                              [2m  8.50 kB[22m [2m│ gzip:  2.44 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbylines-DctOoid7.d.mts.map                                               [2m  8.48 kB[22m [2m│ gzip:  1.48 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmedia/local-runtime.mjs.map                                              [2m  8.45 kB[22m [2m│ gzip:  2.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs.map      [2m  8.42 kB[22m [2m│ gzip:  2.72 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/register.mjs.map                                  [2m  8.19 kB[22m [2m│ gzip:  2.94 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mallowed-origins-D0fFk9a6.mjs.map                                         [2m  8.19 kB[22m [2m│ gzip:  3.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrequest-meta-C_Cjii-T.mjs.map                                            [2m  8.19 kB[22m [2m│ gzip:  3.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mutils-C3wTAP-P.mjs                                                       [2m  8.16 kB[22m [2m│ gzip:  2.90 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mzod-generator-D0CFhOHV.mjs                                               [2m  8.10 kB[22m [2m│ gzip:  2.42 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrate-limit-sO9bWu9Y.mjs.map                                              [2m  8.07 kB[22m [2m│ gzip:  3.40 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-DSZl1Dsv.mjs.map                                                   [2m  7.98 kB[22m [2m│ gzip:  2.22 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mplaceholder-LqmHqvBw.mjs.map                                             [2m  7.97 kB[22m [2m│ gzip:  2.92 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msettings-kxA32mfK.mjs                                                    [2m  7.86 kB[22m [2m│ gzip:  2.66 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdashboard-B72rF3w7.mjs.map                                               [2m  7.78 kB[22m [2m│ gzip:  2.88 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moptions-BL4X94qY.mjs.map                                                 [2m  7.78 kB[22m [2m│ gzip:  2.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdialect-helpers-BKCvISIQ.mjs.map                                         [2m  7.72 kB[22m [2m│ gzip:  2.08 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/index.mjs.map                          [2m  7.59 kB[22m [2m│ gzip:  2.39 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moauth-clients-eJCbkVSG.mjs                                               [2m  7.56 kB[22m [2m│ gzip:  1.83 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmedia-DGP4jrX7.mjs                                                       [2m  7.41 kB[22m [2m│ gzip:  2.50 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mseo/index.mjs.map                                                        [2m  7.10 kB[22m [2m│ gzip:  2.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbylines-DfLV0Soq.mjs.map                                                 [2m  7.04 kB[22m [2m│ gzip:  2.56 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmanifest-schema-Czqf0TLu.mjs                                             [2m  6.66 kB[22m [2m│ gzip:  2.24 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/widgets/_id_.mjs.map                [2m  6.52 kB[22m [2m│ gzip:  1.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mseo-Dq707mNQ.mjs.map                                                     [2m  6.47 kB[22m [2m│ gzip:  2.62 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/settings/email.mjs.map                                  [2m  6.47 kB[22m [2m│ gzip:  2.40 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mwidgets-BKnSIFPg.mjs.map                                                 [2m  6.46 kB[22m [2m│ gzip:  2.29 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/plugins/_pluginId_/_...path_.mjs.map                    [2m  6.43 kB[22m [2m│ gzip:  2.62 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbylines-MtpvnsH-.mjs                                                     [2m  6.39 kB[22m [2m│ gzip:  2.45 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/setup/admin-verify.mjs.map                              [2m  6.33 kB[22m [2m│ gzip:  2.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media/_id_.mjs.map                                      [2m  6.28 kB[22m [2m│ gzip:  1.75 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media/upload-url.mjs.map                                [2m  6.24 kB[22m [2m│ gzip:  2.44 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/setup/admin.mjs.map                                     [2m  6.21 kB[22m [2m│ gzip:  2.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mservice-C_cRTpA_.mjs                                                     [2m  6.21 kB[22m [2m│ gzip:  2.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/setup/index.mjs.map                                     [2m  6.16 kB[22m [2m│ gzip:  2.40 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/oauth/_provider_.mjs.map                           [2m  6.14 kB[22m [2m│ gzip:  2.26 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mpublic-url-CUWWFME2.mjs.map                                              [2m  5.92 kB[22m [2m│ gzip:  2.40 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/register/verify.mjs.map                    [2m  5.90 kB[22m [2m│ gzip:  2.22 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mvalidate-VPnKoIzW.mjs.map                                                [2m  5.90 kB[22m [2m│ gzip:  1.70 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/preview-url.mjs.map           [2m  5.90 kB[22m [2m│ gzip:  2.39 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/_id_/status.mjs.map                      [2m  5.69 kB[22m [2m│ gzip:  2.00 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mresolve-D6sM-SgF.mjs                                                     [2m  5.63 kB[22m [2m│ gzip:  2.12 kB[22m
packages/core build: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugins. Here is a breakdown:
packages/core build:   - rolldown-plugin-dts:generate (34%)
packages/core build:   - rolldown-plugin-dts:resolver (34%)
packages/core build:   - rolldown-plugin-dts:fake-js (24%)
packages/core build: See https://rolldown.rs/options/checks#plugintimings for more details.
packages/core build: [34mℹ[39m [2mdist/[22mvalidation-HCnW6Iv2.mjs                                                  [2m  5.61 kB[22m [2m│ gzip:  2.26 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/dev-bypass.mjs.map                                 [2m  5.58 kB[22m [2m│ gzip:  2.30 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-DaqNzqVt.d.mts.map                                                 [2m  5.58 kB[22m [2m│ gzip:  0.93 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/install.mjs.map                  [2m  5.56 kB[22m [2m│ gzip:  2.38 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/schedule.mjs.map              [2m  5.56 kB[22m [2m│ gzip:  1.63 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media/providers/_providerId_/index.mjs.map              [2m  5.54 kB[22m [2m│ gzip:  1.81 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/middleware/redirect.mjs.map                                        [2m  5.50 kB[22m [2m│ gzip:  2.23 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcomments-BwdV-Diu.mjs                                                    [2m  5.49 kB[22m [2m│ gzip:  1.74 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mpreview-D4z0WONU.mjs.map                                                 [2m  5.44 kB[22m [2m│ gzip:  1.93 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mparse-B6s9lMve.mjs.map                                                   [2m  5.35 kB[22m [2m│ gzip:  1.94 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mallowed-origins-D0fFk9a6.mjs                                             [2m  5.31 kB[22m [2m│ gzip:  2.06 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msetup-CY80tTMA.mjs                                                       [2m  5.27 kB[22m [2m│ gzip:  1.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-Cd9UCu3t.mjs.map                                                   [2m  5.27 kB[22m [2m│ gzip:  1.85 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/bylines/_id_/translations.mjs.map                 [2m  5.21 kB[22m [2m│ gzip:  1.88 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrequest-cache-dzCt8TZB.mjs.map                                           [2m  5.19 kB[22m [2m│ gzip:  2.07 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mseo-B2vqDA_Q.mjs                                                         [2m  5.12 kB[22m [2m│ gzip:  1.82 kB[22m
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
packages/core build: [34mℹ[39m [2mdist/[22muser-C7smaFYQ.mjs                                                        [2m  4.74 kB[22m [2m│ gzip:  1.69 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdatabase/instrumentation.mjs.map                                         [2m  4.63 kB[22m [2m│ gzip:  2.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/publish.mjs.map               [2m  4.63 kB[22m [2m│ gzip:  1.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/allowed-domains/index.mjs.map                     [2m  4.61 kB[22m [2m│ gzip:  1.60 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrequest-meta-C_Cjii-T.mjs                                                [2m  4.58 kB[22m [2m│ gzip:  1.93 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/index.mjs.map                                    [2m  4.52 kB[22m [2m│ gzip:  1.76 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/translations.mjs.map                       [2m  4.49 kB[22m [2m│ gzip:  1.48 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mplugin-utils.mjs.map                                                     [2m  4.46 kB[22m [2m│ gzip:  1.89 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/signup/request.mjs.map                             [2m  4.45 kB[22m [2m│ gzip:  1.92 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrate-limit-sO9bWu9Y.mjs                                                  [2m  4.43 kB[22m [2m│ gzip:  2.06 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtrusted-proxy-97pajC2f.mjs.map                                           [2m  4.43 kB[22m [2m│ gzip:  1.96 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/types.d.mts.map                                                    [2m  4.41 kB[22m [2m│ gzip:  1.23 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/magic-link/send.mjs.map                            [2m  4.40 kB[22m [2m│ gzip:  1.78 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/index.mjs.map                              [2m  4.39 kB[22m [2m│ gzip:  1.57 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mplaceholder-LqmHqvBw.mjs                                                 [2m  4.39 kB[22m [2m│ gzip:  1.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mvalidate-VPnKoIzW.mjs                                                    [2m  4.35 kB[22m [2m│ gzip:  1.32 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/signup/complete.mjs.map                            [2m  4.33 kB[22m [2m│ gzip:  1.74 kB[22m
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
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/_id_/update.mjs.map              [2m  4.09 kB[22m [2m│ gzip:  1.70 kB[22m
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
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_.mjs.map                                    [2m  3.79 kB[22m [2m│ gzip:  1.00 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdb/index.mjs.map                                                         [2m  3.77 kB[22m [2m│ gzip:  1.42 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/widgets.mjs.map                     [2m  3.74 kB[22m [2m│ gzip:  1.48 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moptions-BL4X94qY.mjs                                                     [2m  3.69 kB[22m [2m│ gzip:  1.26 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/redirects/404s/index.mjs.map                            [2m  3.64 kB[22m [2m│ gzip:  1.07 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/duplicate.mjs.map             [2m  3.62 kB[22m [2m│ gzip:  1.48 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs.map    [2m  3.60 kB[22m [2m│ gzip:  1.01 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/updates.mjs.map                           [2m  3.56 kB[22m [2m│ gzip:  1.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcache-TLGC4FOa.mjs.map                                                   [2m  3.54 kB[22m [2m│ gzip:  1.45 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/verify.mjs.map                             [2m  3.54 kB[22m [2m│ gzip:  1.42 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdashboard-B72rF3w7.mjs                                                   [2m  3.54 kB[22m [2m│ gzip:  1.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmime-KV5TqkMN.mjs.map                                                    [2m  3.52 kB[22m [2m│ gzip:  1.48 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/device/token.mjs.map                              [2m  3.50 kB[22m [2m│ gzip:  1.56 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcomponents-Dx3DM0gg.mjs.map                                              [2m  3.46 kB[22m [2m│ gzip:  0.99 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mchallenge-store-Dng1SxKT.mjs.map                                         [2m  3.43 kB[22m [2m│ gzip:  1.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/disable.mjs.map                        [2m  3.43 kB[22m [2m│ gzip:  1.49 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mpublic-url-CUWWFME2.mjs                                                  [2m  3.37 kB[22m [2m│ gzip:  1.50 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbylines-DfLV0Soq.mjs                                                     [2m  3.36 kB[22m [2m│ gzip:  1.27 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-bYmRn_Uy.d.mts.map                                                 [2m  3.35 kB[22m [2m│ gzip:  1.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/items/_id_.mjs.map                         [2m  3.34 kB[22m [2m│ gzip:  1.04 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/index.mjs.map                   [2m  3.33 kB[22m [2m│ gzip:  1.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media/file/_...key_.mjs.map                             [2m  3.33 kB[22m [2m│ gzip:  1.52 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/oauth-clients/index.mjs.map                       [2m  3.32 kB[22m [2m│ gzip:  1.25 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdialect-helpers-BKCvISIQ.mjs                                             [2m  3.31 kB[22m [2m│ gzip:  1.12 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/robots.txt.mjs.map                                          [2m  3.28 kB[22m [2m│ gzip:  1.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/send-recovery.mjs.map                  [2m  3.27 kB[22m [2m│ gzip:  1.44 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mwidgets-BKnSIFPg.mjs                                                     [2m  3.27 kB[22m [2m│ gzip:  1.22 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/restore.mjs.map               [2m  3.25 kB[22m [2m│ gzip:  1.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdb-errors-BiYqoX-n.mjs.map                                               [2m  3.25 kB[22m [2m│ gzip:  1.28 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22memail-console-CubRll9q.mjs.map                                           [2m  3.23 kB[22m [2m│ gzip:  1.54 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/magic-link/verify.mjs.map                          [2m  3.18 kB[22m [2m│ gzip:  1.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/discard-draft.mjs.map         [2m  3.18 kB[22m [2m│ gzip:  1.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mvalidate-0_3g7fpb.d.mts.map                                              [2m  3.17 kB[22m [2m│ gzip:  0.98 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/reorder.mjs.map                     [2m  3.16 kB[22m [2m│ gzip:  1.32 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/api-tokens/index.mjs.map                          [2m  3.11 kB[22m [2m│ gzip:  1.21 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/unpublish.mjs.map             [2m  3.11 kB[22m [2m│ gzip:  1.27 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/_id_/install.mjs.map          [2m  3.10 kB[22m [2m│ gzip:  1.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmode-CaaiebZI.mjs.map                                                    [2m  3.04 kB[22m [2m│ gzip:  1.13 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/me.mjs.map                                         [2m  3.04 kB[22m [2m│ gzip:  1.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/search/rebuild.mjs.map                                  [2m  3.02 kB[22m [2m│ gzip:  1.23 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs.map         [2m  2.97 kB[22m [2m│ gzip:  1.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/revisions/_revisionId_/restore.mjs.map                  [2m  2.94 kB[22m [2m│ gzip:  1.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/_id_/icon.mjs.map             [2m  2.94 kB[22m [2m│ gzip:  1.30 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/index.mjs.map                               [2m  2.94 kB[22m [2m│ gzip:  1.30 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mruntime.mjs.map                                                          [2m  2.91 kB[22m [2m│ gzip:  1.25 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/settings.mjs.map                                        [2m  2.89 kB[22m [2m│ gzip:  1.06 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/index.mjs.map                                [2m  2.89 kB[22m [2m│ gzip:  1.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/redirects/index.mjs.map                                 [2m  2.86 kB[22m [2m│ gzip:  1.00 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mpreview-D4z0WONU.mjs                                                     [2m  2.85 kB[22m [2m│ gzip:  1.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mparse-B6s9lMve.mjs                                                       [2m  2.83 kB[22m [2m│ gzip:  1.15 kB[22m
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
packages/core build: [34mℹ[39m [2mdist/[22mtypes-D8QBfkBe.mjs                                                       [2m  2.64 kB[22m [2m│ gzip:  1.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mseo-Dq707mNQ.mjs                                                         [2m  2.59 kB[22m [2m│ gzip:  1.21 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/callback.mjs.map                [2m  2.55 kB[22m [2m│ gzip:  1.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mplaceholder-KCkkCtgQ.d.mts.map                                           [2m  2.50 kB[22m [2m│ gzip:  0.92 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/menus/index.mjs.map                                     [2m  2.48 kB[22m [2m│ gzip:  0.97 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mconfig-CVssduLe.mjs.map                                                  [2m  2.48 kB[22m [2m│ gzip:  1.09 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/themes/marketplace/index.mjs.map                  [2m  2.44 kB[22m [2m│ gzip:  1.06 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mschema-CQUT48My.mjs.map                                                  [2m  2.44 kB[22m [2m│ gzip:  1.04 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbase64-CqR-7kqF.mjs                                                      [2m  2.44 kB[22m [2m│ gzip:  0.92 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/index.mjs.map                        [2m  2.42 kB[22m [2m│ gzip:  0.89 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/index.mjs.map          [2m  2.41 kB[22m [2m│ gzip:  0.83 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/_id_/uninstall.mjs.map           [2m  2.39 kB[22m [2m│ gzip:  1.08 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mindex-CC42STEm.d.mts.map                                                 [2m  2.36 kB[22m [2m│ gzip:  0.80 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/hooks/exclusive/index.mjs.map                     [2m  2.33 kB[22m [2m│ gzip:  1.11 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtransaction-NQj4VJ7Z.mjs.map                                             [2m  2.32 kB[22m [2m│ gzip:  1.10 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/signup/verify.mjs.map                              [2m  2.29 kB[22m [2m│ gzip:  1.13 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/enable.mjs.map                       [2m  2.28 kB[22m [2m│ gzip:  1.05 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/mode.mjs.map                                       [2m  2.27 kB[22m [2m│ gzip:  1.13 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mauthorize-DcdT4sLv.mjs.map                                               [2m  2.24 kB[22m [2m│ gzip:  0.85 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/accept.mjs.map                              [2m  2.22 kB[22m [2m│ gzip:  1.09 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/well-known/oauth-authorization-server.mjs.map           [2m  2.21 kB[22m [2m│ gzip:  0.97 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moptions-bpdOI25k.d.mts.map                                               [2m  2.19 kB[22m [2m│ gzip:  0.83 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/search/suggest.mjs.map                                  [2m  2.19 kB[22m [2m│ gzip:  1.06 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/uninstall.mjs.map                    [2m  2.18 kB[22m [2m│ gzip:  0.98 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mhash-DlUxGhQS.mjs.map                                                    [2m  2.18 kB[22m [2m│ gzip:  1.05 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/index.mjs.map                              [2m  2.11 kB[22m [2m│ gzip:  1.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdb-errors-BiYqoX-n.mjs                                                   [2m  2.10 kB[22m [2m│ gzip:  0.89 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msetup-complete-MzzN9u0b.mjs.map                                          [2m  2.08 kB[22m [2m│ gzip:  0.91 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/device/authorize.mjs.map                          [2m  2.06 kB[22m [2m│ gzip:  1.00 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mslugify-Cjh1ssOZ.mjs.map                                                 [2m  2.04 kB[22m [2m│ gzip:  1.01 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/index.mjs.map                            [2m  2.01 kB[22m [2m│ gzip:  0.90 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtrusted-proxy-97pajC2f.mjs                                               [2m  1.99 kB[22m [2m│ gzip:  0.97 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/enable.mjs.map                         [2m  1.99 kB[22m [2m│ gzip:  0.94 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcomponents-Dx3DM0gg.mjs                                                  [2m  1.99 kB[22m [2m│ gzip:  0.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/bulk.mjs.map                             [2m  1.98 kB[22m [2m│ gzip:  0.88 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcache-TLGC4FOa.mjs                                                       [2m  1.97 kB[22m [2m│ gzip:  0.80 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/index.mjs.map                 [2m  1.91 kB[22m [2m│ gzip:  0.86 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msettings-BJNIHNLp.mjs.map                                                [2m  1.91 kB[22m [2m│ gzip:  0.71 kB[22m
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
packages/core build: [34mℹ[39m [2mdist/[22mpasskey-config-BloQOT3y.mjs                                              [2m  1.56 kB[22m [2m│ gzip:  0.74 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/trash.mjs.map                      [2m  1.55 kB[22m [2m│ gzip:  0.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mapi/route-utils.mjs.map                                                  [2m  1.54 kB[22m [2m│ gzip:  0.70 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-CkDSF81F.d.mts.map                                                 [2m  1.53 kB[22m [2m│ gzip:  0.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-DSZl1Dsv.mjs                                                       [2m  1.49 kB[22m [2m│ gzip:  0.70 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/index.mjs.map                        [2m  1.48 kB[22m [2m│ gzip:  0.74 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/_id_/index.mjs.map            [2m  1.45 kB[22m [2m│ gzip:  0.72 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/logout.mjs.map                                     [2m  1.44 kB[22m [2m│ gzip:  0.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-gT5WUneM.d.mts.map                                                 [2m  1.44 kB[22m [2m│ gzip:  0.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/themes/marketplace/_id_/index.mjs.map             [2m  1.43 kB[22m [2m│ gzip:  0.72 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/dev/emails.mjs.map                                      [2m  1.43 kB[22m [2m│ gzip:  0.63 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moauth-user-lookup-3JwsVw6N.mjs.map                                       [2m  1.41 kB[22m [2m│ gzip:  0.76 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdefault-BvTAYCzx.mjs                                                     [2m  1.35 kB[22m [2m│ gzip:  0.50 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/dashboard.mjs.map                                       [2m  1.34 kB[22m [2m│ gzip:  0.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mslugify-Cjh1ssOZ.mjs                                                     [2m  1.31 kB[22m [2m│ gzip:  0.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mplugin-types.d.mts.map                                                   [2m  1.31 kB[22m [2m│ gzip:  0.48 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msite-url-xkhw1tcz.mjs.map                                                [2m  1.30 kB[22m [2m│ gzip:  0.73 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/counts.mjs.map                           [2m  1.30 kB[22m [2m│ gzip:  0.65 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/search/stats.mjs.map                                    [2m  1.29 kB[22m [2m│ gzip:  0.69 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/revisions/_revisionId_/index.mjs.map                    [2m  1.29 kB[22m [2m│ gzip:  0.68 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mload-DmRYiTq9.mjs.map                                                    [2m  1.28 kB[22m [2m│ gzip:  0.64 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmime-KV5TqkMN.mjs                                                        [2m  1.28 kB[22m [2m│ gzip:  0.64 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mauthorize-DcdT4sLv.mjs                                                   [2m  1.28 kB[22m [2m│ gzip:  0.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/index.mjs.map                             [2m  1.27 kB[22m [2m│ gzip:  0.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/compare.mjs.map               [2m  1.25 kB[22m [2m│ gzip:  0.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mconfig-CVssduLe.mjs                                                      [2m  1.23 kB[22m [2m│ gzip:  0.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmedia-allowlist-BNloC69x.mjs                                             [2m  1.21 kB[22m [2m│ gzip:  0.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mhash-DlUxGhQS.mjs                                                        [2m  1.21 kB[22m [2m│ gzip:  0.66 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mschema-CQUT48My.mjs                                                      [2m  1.20 kB[22m [2m│ gzip:  0.60 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media/providers/index.mjs.map                           [2m  1.16 kB[22m [2m│ gzip:  0.62 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msettings-BJNIHNLp.mjs                                                    [2m  1.16 kB[22m [2m│ gzip:  0.48 kB[22m
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
packages/core build: [34mℹ[39m [2mdist/[22mchunks-z2vEgDtL.mjs.map                                                  [2m  0.90 kB[22m [2m│ gzip:  0.57 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moauth-user-lookup-3JwsVw6N.mjs                                           [2m  0.81 kB[22m [2m│ gzip:  0.49 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mchunks-z2vEgDtL.mjs                                                      [2m  0.80 kB[22m [2m│ gzip:  0.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mredirect-BINiRYq4.mjs.map                                                [2m  0.75 kB[22m [2m│ gzip:  0.49 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/rewrite-url-helpers.d.mts.map          [2m  0.74 kB[22m [2m│ gzip:  0.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdb/libsql.mjs.map                                                        [2m  0.71 kB[22m [2m│ gzip:  0.41 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mload-DmRYiTq9.mjs                                                        [2m  0.70 kB[22m [2m│ gzip:  0.38 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22merrors-9P_FDrJ_.mjs.map                                                  [2m  0.67 kB[22m [2m│ gzip:  0.45 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22madapters-C4yd_UJR.d.mts.map                                              [2m  0.67 kB[22m [2m│ gzip:  0.32 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mstorage/s3.d.mts.map                                                     [2m  0.67 kB[22m [2m│ gzip:  0.33 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mseo/index.d.mts.map                                                      [2m  0.64 kB[22m [2m│ gzip:  0.36 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mstorage/local.d.mts.map                                                  [2m  0.62 kB[22m [2m│ gzip:  0.32 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-Dgo6y-Ut.d.mts.map                                                 [2m  0.59 kB[22m [2m│ gzip:  0.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mversion-Ckp2pIft.mjs.map                                                 [2m  0.59 kB[22m [2m│ gzip:  0.33 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mescape-Cg6kMELH.mjs.map                                                  [2m  0.58 kB[22m [2m│ gzip:  0.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmode-CaaiebZI.mjs                                                        [2m  0.58 kB[22m [2m│ gzip:  0.36 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrequest-context.d.mts.map                                                [2m  0.57 kB[22m [2m│ gzip:  0.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mplugin-utils.d.mts.map                                                   [2m  0.56 kB[22m [2m│ gzip:  0.30 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdatabase/instrumentation.d.mts.map                                       [2m  0.53 kB[22m [2m│ gzip:  0.28 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mredirect-BINiRYq4.mjs                                                    [2m  0.53 kB[22m [2m│ gzip:  0.37 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22merrors-9P_FDrJ_.mjs                                                      [2m  0.53 kB[22m [2m│ gzip:  0.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtransport-C2MGqtL6.d.mts.map                                             [2m  0.49 kB[22m [2m│ gzip:  0.28 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrunner-DSQBurMS.d.mts.map                                                [2m  0.49 kB[22m [2m│ gzip:  0.25 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mclient/cf-access.d.mts.map                                               [2m  0.49 kB[22m [2m│ gzip:  0.27 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mapi/route-utils.d.mts.map                                                [2m  0.48 kB[22m [2m│ gzip:  0.27 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/media.d.mts.map                        [2m  0.45 kB[22m [2m│ gzip:  0.25 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msite-url-xkhw1tcz.mjs                                                    [2m  0.44 kB[22m [2m│ gzip:  0.30 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmedia/local-runtime.d.mts.map                                            [2m  0.40 kB[22m [2m│ gzip:  0.23 kB[22m
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
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/artifact.d.mts.map               [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
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
packages/core build: [34mℹ[39m [2mdist/[22mversion-Ckp2pIft.mjs                                                     [2m  0.17 kB[22m [2m│ gzip:  0.16 kB[22m
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
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.mts[22m[39m                                                              [2m 18.24 kB[22m [2m│ gzip:  4.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/types.d.mts[22m[39m                                                        [2m 12.99 kB[22m [2m│ gzip:  3.96 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mclient/index.d.mts[22m[39m                                                       [2m 11.48 kB[22m [2m│ gzip:  3.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mapi/schemas/index.d.mts[22m[39m                                                  [2m  7.93 kB[22m [2m│ gzip:  1.88 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mpage/index.d.mts[22m[39m                                                         [2m  6.82 kB[22m [2m│ gzip:  2.27 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mplugin-types.d.mts[22m[39m                                                       [2m  6.61 kB[22m [2m│ gzip:  2.36 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/execute.d.mts[22m[39m                          [2m  3.91 kB[22m [2m│ gzip:  1.54 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mapi/route-utils.d.mts[22m[39m                                                    [2m  2.94 kB[22m [2m│ gzip:  1.35 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mplugin-utils.d.mts[22m[39m                                                       [2m  2.84 kB[22m [2m│ gzip:  1.24 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mrequest-context.d.mts[22m[39m                                                    [2m  2.81 kB[22m [2m│ gzip:  1.29 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/index.d.mts[22m[39m                                                        [2m  2.60 kB[22m [2m│ gzip:  1.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mclient/cf-access.d.mts[22m[39m                                                   [2m  2.55 kB[22m [2m│ gzip:  1.04 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/analyze.d.mts[22m[39m                          [2m  2.52 kB[22m [2m│ gzip:  0.95 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mseo/index.d.mts[22m[39m                                                          [2m  2.45 kB[22m [2m│ gzip:  1.01 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/rewrite-url-helpers.d.mts[22m[39m              [2m  2.14 kB[22m [2m│ gzip:  0.89 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mdatabase/instrumentation.d.mts[22m[39m                                           [2m  2.00 kB[22m [2m│ gzip:  0.95 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mstorage/s3.d.mts[22m[39m                                                         [2m  1.61 kB[22m [2m│ gzip:  0.75 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mmedia/index.d.mts[22m[39m                                                        [2m  1.52 kB[22m [2m│ gzip:  0.63 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mstorage/local.d.mts[22m[39m                                                      [2m  1.50 kB[22m [2m│ gzip:  0.70 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mplugins/adapt-sandbox-entry.d.mts[22m[39m                                        [2m  1.37 kB[22m [2m│ gzip:  0.64 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mmedia/local-runtime.d.mts[22m[39m                                                [2m  1.33 kB[22m [2m│ gzip:  0.59 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mruntime.d.mts[22m[39m                                                            [2m  1.09 kB[22m [2m│ gzip:  0.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/middleware/auth.d.mts[22m[39m                                              [2m  0.97 kB[22m [2m│ gzip:  0.50 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/media.d.mts[22m[39m                            [2m  0.96 kB[22m [2m│ gzip:  0.47 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mseed/index.d.mts[22m[39m                                                         [2m  0.82 kB[22m [2m│ gzip:  0.34 kB[22m
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
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/plugins/registry/artifact.d.mts[22m[39m                   [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
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
packages/core build: [34mℹ[39m [2mdist/[22m[32mindex-ByzreLAZ.d.mts[39m                                                     [2m154.89 kB[22m [2m│ gzip: 41.94 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mbylines-DctOoid7.d.mts[39m                                                   [2m 74.39 kB[22m [2m│ gzip:  8.52 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mtypes-DSWHB41B.d.mts[39m                                                     [2m 40.10 kB[22m [2m│ gzip: 10.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mtypes-DaqNzqVt.d.mts[39m                                                     [2m 11.55 kB[22m [2m│ gzip:  2.61 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mtypes-bYmRn_Uy.d.mts[39m                                                     [2m  9.78 kB[22m [2m│ gzip:  3.24 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mvalidate-0_3g7fpb.d.mts[39m                                                  [2m  9.46 kB[22m [2m│ gzip:  2.96 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mplaceholder-KCkkCtgQ.d.mts[39m                                               [2m  8.70 kB[22m [2m│ gzip:  2.96 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mindex-CC42STEm.d.mts[39m                                                     [2m  7.74 kB[22m [2m│ gzip:  2.83 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32moptions-bpdOI25k.d.mts[39m                                                   [2m  6.44 kB[22m [2m│ gzip:  2.43 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mtypes-D599-ruj.d.mts[39m                                                     [2m  6.19 kB[22m [2m│ gzip:  2.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mtypes-gT5WUneM.d.mts[39m                                                     [2m  5.94 kB[22m [2m│ gzip:  2.29 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mtypes-CpUuGcd5.d.mts[39m                                                     [2m  5.73 kB[22m [2m│ gzip:  1.66 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mtypes-CkDSF81F.d.mts[39m                                                     [2m  5.04 kB[22m [2m│ gzip:  1.78 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32madapters-C4yd_UJR.d.mts[39m                                                  [2m  3.21 kB[22m [2m│ gzip:  1.32 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mtypes-Dgo6y-Ut.d.mts[39m                                                     [2m  2.64 kB[22m [2m│ gzip:  1.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mrunner-DSQBurMS.d.mts[39m                                                    [2m  1.98 kB[22m [2m│ gzip:  0.93 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mtransport-C2MGqtL6.d.mts[39m                                                 [2m  1.67 kB[22m [2m│ gzip:  0.76 kB[22m
packages/core build: [34mℹ[39m 999 files, total: 7040.18 kB
packages/core build: [32m✔[39m Build complete in [32m4960ms[39m
packages/core build: Done
packages/cloudflare build$ tsdown
packages/plugins/atproto build$ node node_modules/@emdash-cms/plugin-cli/dist/index.mjs build
packages/plugins/audit-log build$ node node_modules/@emdash-cms/plugin-cli/dist/index.mjs build
packages/plugins/awcms-micro-docs build$ tsdown
packages/plugins/awcms-micro-docs build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/cloudflare build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/plugins/awcms-micro-docs build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-docs/tsdown.config.ts[24m
packages/plugins/awcms-micro-docs build: [34mℹ[39m entry: [34msrc/index.ts, src/admin.tsx[39m
packages/plugins/awcms-micro-docs build: [34mℹ[39m target: [34mes2023[39m
packages/plugins/awcms-micro-docs build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/awcms-micro-docs build: [34mℹ[39m Build start
packages/plugins/awcms-micro-docs build: [34mℹ[39m Cleaning 10 files
packages/cloudflare build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/cloudflare/tsdown.config.ts[24m
packages/cloudflare build: [34mℹ[39m entry: [34msrc/index.ts, src/db/d1.ts, src/db/do.ts, src/db/playground.ts, src/db/playground-middleware.ts, src/storage/r2.ts, src/auth/index.ts, src/sandbox/index.ts, src/plugins/index.ts, src/media/images-runtime.ts, src/media/stream-runtime.ts, src/cache/runtime.ts, src/cache/config.ts[39m
packages/cloudflare build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/cloudflare build: [34mℹ[39m Build start
packages/cloudflare build: [34mℹ[39m Cleaning 41 files
packages/plugins/atproto build: ◐ Building plugin...
packages/plugins/atproto build: ℹ Manifest: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/atproto/emdash-plugin.jsonc
packages/plugins/atproto build: ℹ Plugin entry: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/atproto/src/plugin.ts
packages/plugins/atproto build: ℹ Package: @emdash-cms/plugin-atproto
packages/plugins/audit-log build: ◐ Building plugin...
packages/plugins/atproto build: ◐ Building runtime entry...
packages/plugins/atproto build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/atproto build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/atproto build: [34mℹ[39m Build start
packages/plugins/audit-log build: ℹ Manifest: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/audit-log/emdash-plugin.jsonc
packages/plugins/audit-log build: ℹ Plugin entry: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/audit-log/src/plugin.ts
packages/plugins/audit-log build: ℹ Package: @emdash-cms/plugin-audit-log
packages/plugins/audit-log build: ◐ Building runtime entry...
packages/plugins/audit-log build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/audit-log build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/audit-log build: [34mℹ[39m Build start
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
packages/cloudflare build: [32m✔[39m Build complete in [32m2121ms[39m
packages/cloudflare build: Done
packages/plugins/awcms-micro-gallery build$ tsdown
packages/plugins/awcms-micro-gallery build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/plugins/audit-log build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-zpa0vz/runtime/[22m[1mplugin.mjs[22m        [2m 4.80 kB[22m [2m│ gzip: 1.60 kB[22m
packages/plugins/audit-log build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-zpa0vz/runtime/[22mplugin.mjs.map    [2m17.30 kB[22m [2m│ gzip: 4.37 kB[22m
packages/plugins/audit-log build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-zpa0vz/runtime/[22mplugin.d.mts.map  [2m 0.40 kB[22m [2m│ gzip: 0.21 kB[22m
packages/plugins/audit-log build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-zpa0vz/runtime/[22m[32m[1mplugin.d.mts[22m[39m      [2m 4.76 kB[22m [2m│ gzip: 0.81 kB[22m
packages/plugins/audit-log build: [34mℹ[39m 4 files, total: 27.26 kB
packages/plugins/audit-log build: [32m✔[39m Build complete in [32m2122ms[39m
packages/plugins/audit-log build: ✔ Built plugin.mjs
packages/plugins/audit-log build: ◐ Probing plugin surface...
packages/plugins/audit-log build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/audit-log build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/audit-log build: [34mℹ[39m Build start
packages/plugins/audit-log build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-zpa0vz/plugin-probe/[22m[1mplugin.mjs[22m  [2m8.20 kB[22m [2m│ gzip: 2.12 kB[22m
packages/plugins/audit-log build: [34mℹ[39m 1 files, total: 8.20 kB
packages/plugins/audit-log build: [32m✔[39m Build complete in [32m9ms[39m
packages/plugins/audit-log build: ℹ   Hooks: plugin:install, plugin:activate, plugin:deactivate, plugin:uninstall, content:beforeSave, content:afterSave, content:beforeDelete, content:afterDelete, media:afterUpload
packages/plugins/audit-log build: ℹ   Routes: admin, recent, history
packages/plugins/awcms-micro-gallery build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-gallery/tsdown.config.ts[24m
packages/plugins/audit-log build: ✔ Wrote manifest.json
packages/plugins/audit-log build: ◐ Generating descriptor module...
packages/plugins/audit-log build: ✔ Wrote index.mjs
packages/plugins/audit-log build: ✔ Plugin built: audit-log@0.2.0
packages/plugins/awcms-micro-gallery build: [34mℹ[39m entry: [34msrc/index.ts, src/sandbox.ts[39m
packages/plugins/audit-log build: ℹ Output:
packages/plugins/audit-log build:   /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/audit-log/dist/index.mjs
packages/plugins/audit-log build:   /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/audit-log/dist/plugin.mjs
packages/plugins/audit-log build:   /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/audit-log/dist/manifest.json
packages/plugins/awcms-micro-gallery build: [34mℹ[39m target: [34mes2023[39m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m Build start
packages/plugins/awcms-micro-gallery build: [34mℹ[39m Cleaning 10 files
packages/plugins/audit-log build: Done
packages/plugins/awcms-micro-sikesra build$ tsdown
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/tsdown.config.ts[24m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m entry: [34msrc/index.ts, src/admin.tsx, src/navigation.ts, src/sandbox.ts[39m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m target: [34mes2023[39m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m Build start
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m Cleaning 11 files
packages/plugins/atproto build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-9PSaDG/runtime/[22m[1mplugin.mjs[22m        [2m19.93 kB[22m [2m│ gzip:  5.86 kB[22m
packages/plugins/atproto build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-9PSaDG/runtime/[22mplugin.mjs.map    [2m76.81 kB[22m [2m│ gzip: 17.04 kB[22m
packages/plugins/atproto build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-9PSaDG/runtime/[22mplugin.d.mts.map  [2m 0.79 kB[22m [2m│ gzip:  0.32 kB[22m
packages/plugins/atproto build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-9PSaDG/runtime/[22m[32m[1mplugin.d.mts[22m[39m      [2m 3.14 kB[22m [2m│ gzip:  0.80 kB[22m
packages/plugins/atproto build: [34mℹ[39m 4 files, total: 100.67 kB
packages/plugins/atproto build: [32m✔[39m Build complete in [32m2390ms[39m
packages/plugins/atproto build: ✔ Built plugin.mjs
packages/plugins/atproto build: ◐ Probing plugin surface...
packages/plugins/atproto build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/atproto build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/atproto build: [34mℹ[39m Build start
packages/plugins/atproto build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-9PSaDG/plugin-probe/[22m[1mplugin.mjs[22m  [2m36.24 kB[22m [2m│ gzip: 8.45 kB[22m
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
packages/plugins/atproto build: Done
packages/plugins/marketplace-test build$ node node_modules/@emdash-cms/plugin-cli/dist/index.mjs build
packages/plugins/awcms-micro-docs build: [34mℹ[39m [2mdist/[22m[1madmin.js[22m                 [2m 4.17 kB[22m [2m│ gzip: 0.98 kB[22m
packages/plugins/awcms-micro-docs build: [34mℹ[39m [2mdist/[22m[1mindex.js[22m                 [2m 0.97 kB[22m [2m│ gzip: 0.45 kB[22m
packages/plugins/awcms-micro-docs build: [34mℹ[39m [2mdist/[22mcontent-DohiaJ-8.js.map  [2m10.48 kB[22m [2m│ gzip: 2.98 kB[22m
packages/plugins/awcms-micro-docs build: [34mℹ[39m [2mdist/[22mcontent-DohiaJ-8.js      [2m 7.35 kB[22m [2m│ gzip: 2.43 kB[22m
packages/plugins/awcms-micro-docs build: [34mℹ[39m [2mdist/[22madmin.js.map             [2m 4.94 kB[22m [2m│ gzip: 1.46 kB[22m
packages/plugins/awcms-micro-docs build: [34mℹ[39m [2mdist/[22mindex.js.map             [2m 1.51 kB[22m [2m│ gzip: 0.63 kB[22m
packages/plugins/awcms-micro-docs build: [34mℹ[39m [2mdist/[22mindex.d.ts.map           [2m 0.58 kB[22m [2m│ gzip: 0.27 kB[22m
packages/plugins/awcms-micro-docs build: [34mℹ[39m [2mdist/[22madmin.d.ts.map           [2m 0.12 kB[22m [2m│ gzip: 0.12 kB[22m
packages/plugins/awcms-micro-docs build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.ts[22m[39m               [2m 1.30 kB[22m [2m│ gzip: 0.51 kB[22m
packages/plugins/awcms-micro-docs build: [34mℹ[39m [2mdist/[22m[32m[1madmin.d.ts[22m[39m               [2m 0.21 kB[22m [2m│ gzip: 0.15 kB[22m
packages/plugins/awcms-micro-docs build: [34mℹ[39m 10 files, total: 31.64 kB
packages/plugins/awcms-micro-docs build: [32m✔[39m Build complete in [32m2854ms[39m
packages/plugins/marketplace-test build: ◐ Building plugin...
packages/plugins/marketplace-test build: ℹ Manifest: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/marketplace-test/emdash-plugin.jsonc
packages/plugins/marketplace-test build: ℹ Plugin entry: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/marketplace-test/src/plugin.ts
packages/plugins/marketplace-test build: ℹ Package: @emdash-cms/plugin-marketplace-test
packages/plugins/awcms-micro-docs build: Done
packages/plugins/sandboxed-test build$ node node_modules/@emdash-cms/plugin-cli/dist/index.mjs build
packages/plugins/marketplace-test build: ◐ Building runtime entry...
packages/plugins/marketplace-test build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/marketplace-test build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/marketplace-test build: [34mℹ[39m Build start
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
packages/plugins/awcms-micro-gallery build: [34mℹ[39m [2mdist/[22mvalidation-DWdjFPTC.mjs.map  [2m24.91 kB[22m [2m│ gzip:  5.77 kB[22m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m [2mdist/[22mvalidation-DWdjFPTC.mjs      [2m15.10 kB[22m [2m│ gzip:  3.76 kB[22m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m [2mdist/[22mindex.d.mts.map              [2m 0.87 kB[22m [2m│ gzip:  0.36 kB[22m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m [2mdist/[22msandbox.d.mts.map            [2m 0.12 kB[22m [2m│ gzip:  0.12 kB[22m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.mts[22m[39m                  [2m 3.57 kB[22m [2m│ gzip:  1.02 kB[22m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m [2mdist/[22m[32m[1msandbox.d.mts[22m[39m                [2m 0.21 kB[22m [2m│ gzip:  0.16 kB[22m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m 10 files, total: 195.45 kB
packages/plugins/awcms-micro-gallery build: [32m✔[39m Build complete in [32m1531ms[39m
packages/plugins/awcms-micro-gallery build: Done
packages/plugins/webhook-notifier build$ node node_modules/@emdash-cms/plugin-cli/dist/index.mjs build
packages/plugins/webhook-notifier build: ◐ Building plugin...
packages/plugins/webhook-notifier build: ℹ Manifest: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/webhook-notifier/emdash-plugin.jsonc
packages/plugins/webhook-notifier build: ℹ Plugin entry: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/webhook-notifier/src/plugin.ts
packages/plugins/webhook-notifier build: ℹ Package: @emdash-cms/plugin-webhook-notifier
packages/plugins/webhook-notifier build: ◐ Building runtime entry...
packages/plugins/webhook-notifier build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/webhook-notifier build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/webhook-notifier build: [34mℹ[39m Build start
packages/plugins/marketplace-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-eQpkBs/runtime/[22m[1mplugin.mjs[22m        [2m0.58 kB[22m [2m│ gzip: 0.34 kB[22m
packages/plugins/marketplace-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-eQpkBs/runtime/[22mplugin.mjs.map    [2m2.47 kB[22m [2m│ gzip: 1.12 kB[22m
packages/plugins/marketplace-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-eQpkBs/runtime/[22mplugin.d.mts.map  [2m0.18 kB[22m [2m│ gzip: 0.15 kB[22m
packages/plugins/marketplace-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-eQpkBs/runtime/[22m[32m[1mplugin.d.mts[22m[39m      [2m1.59 kB[22m [2m│ gzip: 0.70 kB[22m
packages/plugins/marketplace-test build: [34mℹ[39m 4 files, total: 4.82 kB
packages/plugins/marketplace-test build: [32m✔[39m Build complete in [32m1764ms[39m
packages/plugins/marketplace-test build: ✔ Built plugin.mjs
packages/plugins/marketplace-test build: ◐ Probing plugin surface...
packages/plugins/marketplace-test build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/marketplace-test build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/marketplace-test build: [34mℹ[39m Build start
packages/plugins/marketplace-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-eQpkBs/plugin-probe/[22m[1mplugin.mjs[22m  [2m0.85 kB[22m [2m│ gzip: 0.44 kB[22m
packages/plugins/marketplace-test build: [34mℹ[39m 1 files, total: 0.85 kB
packages/plugins/marketplace-test build: [32m✔[39m Build complete in [32m11ms[39m
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
packages/workerd build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/workerd build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/workerd/tsdown.config.ts[24m
packages/workerd build: [34mℹ[39m entry: [34msrc/index.ts, src/sandbox/index.ts[39m
packages/workerd build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/workerd build: [34mℹ[39m Build start
packages/workerd build: [34mℹ[39m Cleaning 7 files
packages/plugins/sandboxed-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-4aCKkN/runtime/[22m[1mplugin.mjs[22m        [2m19.59 kB[22m [2m│ gzip:  5.31 kB[22m
packages/plugins/sandboxed-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-4aCKkN/runtime/[22mplugin.mjs.map    [2m62.07 kB[22m [2m│ gzip: 13.43 kB[22m
packages/plugins/sandboxed-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-4aCKkN/runtime/[22mplugin.d.mts.map  [2m 1.75 kB[22m [2m│ gzip:  0.37 kB[22m
packages/plugins/sandboxed-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-4aCKkN/runtime/[22m[32m[1mplugin.d.mts[22m[39m      [2m 8.47 kB[22m [2m│ gzip:  1.15 kB[22m
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
packages/plugins/sandboxed-test build: [32m✔[39m Build complete in [32m1794ms[39m
packages/plugins/sandboxed-test build: ✔ Built plugin.mjs
packages/plugins/sandboxed-test build: ◐ Probing plugin surface...
packages/plugins/sandboxed-test build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/sandboxed-test build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/sandboxed-test build: [34mℹ[39m Build start
packages/plugins/sandboxed-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-4aCKkN/plugin-probe/[22m[1mplugin.mjs[22m  [2m29.37 kB[22m [2m│ gzip: 6.51 kB[22m
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
packages/plugins/sandboxed-test build: [32m✔[39m Build complete in [32m14ms[39m
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
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22m[1madmin.js[22m                           [2m345.56 kB[22m [2m│ gzip: 58.76 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22m[1mindex.js[22m                           [2m  2.78 kB[22m [2m│ gzip:  0.99 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22m[1mnavigation.js[22m                      [2m  0.78 kB[22m [2m│ gzip:  0.32 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22m[1msandbox.js[22m                         [2m  0.30 kB[22m [2m│ gzip:  0.21 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22mruntime-BH7Sl_fq.js                [2m305.15 kB[22m [2m│ gzip: 57.72 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22mfield-standards-DPRMDU-F.js        [2m 30.46 kB[22m [2m│ gzip:  5.13 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22mAwcmsPluginHeaderMenu-CQR6c-xk.js  [2m 13.95 kB[22m [2m│ gzip:  3.27 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.ts[22m[39m                         [2m  7.30 kB[22m [2m│ gzip:  1.91 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22m[32m[1mnavigation.d.ts[22m[39m                    [2m  6.04 kB[22m [2m│ gzip:  1.38 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22m[32m[1madmin.d.ts[22m[39m                         [2m  2.25 kB[22m [2m│ gzip:  0.81 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22m[32m[1msandbox.d.ts[22m[39m                       [2m  2.23 kB[22m [2m│ gzip:  0.50 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m 11 files, total: 716.79 kB
packages/plugins/awcms-micro-sikesra build: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugin `rolldown-plugin-dts:generate`. See https://rolldown.rs/options/checks#plugintimings for more details.
packages/plugins/awcms-micro-sikesra build: [32m✔[39m Build complete in [32m3236ms[39m
packages/plugins/webhook-notifier build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-qVzvR9/runtime/[22m[1mplugin.mjs[22m        [2m 9.25 kB[22m [2m│ gzip: 3.05 kB[22m
packages/plugins/webhook-notifier build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-qVzvR9/runtime/[22mplugin.mjs.map    [2m28.71 kB[22m [2m│ gzip: 7.20 kB[22m
packages/plugins/webhook-notifier build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-qVzvR9/runtime/[22mplugin.d.mts.map  [2m 0.30 kB[22m [2m│ gzip: 0.21 kB[22m
packages/plugins/webhook-notifier build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-qVzvR9/runtime/[22m[32m[1mplugin.d.mts[22m[39m      [2m 2.94 kB[22m [2m│ gzip: 0.70 kB[22m
packages/plugins/webhook-notifier build: [34mℹ[39m 4 files, total: 41.20 kB
packages/plugins/webhook-notifier build: [32m✔[39m Build complete in [32m1563ms[39m
packages/plugins/webhook-notifier build: ✔ Built plugin.mjs
packages/plugins/webhook-notifier build: ◐ Probing plugin surface...
packages/plugins/webhook-notifier build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/webhook-notifier build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/webhook-notifier build: [34mℹ[39m Build start
packages/plugins/webhook-notifier build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-qVzvR9/plugin-probe/[22m[1mplugin.mjs[22m  [2m14.88 kB[22m [2m│ gzip: 3.94 kB[22m
packages/plugins/webhook-notifier build: [34mℹ[39m 1 files, total: 14.88 kB
packages/plugins/webhook-notifier build: [32m✔[39m Build complete in [32m12ms[39m
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
packages/plugins/awcms-micro-sikesra build: Done
packages/plugins/webhook-notifier build: Done
packages/workerd build: [34mℹ[39m [2mdist/[22m[1msandbox/index.mjs[22m              [2m 0.24 kB[22m [2m│ gzip:  0.15 kB[22m
packages/workerd build: [34mℹ[39m [2mdist/[22m[1mindex.mjs[22m                      [2m 0.18 kB[22m [2m│ gzip:  0.13 kB[22m
packages/workerd build: [34mℹ[39m [2mdist/[22mrunner-DPvq5mbQ.mjs            [2m83.97 kB[22m [2m│ gzip: 21.86 kB[22m
packages/workerd build: [34mℹ[39m [2mdist/[22m[32m[1msandbox/index.d.mts[22m[39m            [2m 0.25 kB[22m [2m│ gzip:  0.15 kB[22m
packages/workerd build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.mts[22m[39m                    [2m 0.18 kB[22m [2m│ gzip:  0.14 kB[22m
packages/workerd build: [34mℹ[39m [2mdist/[22m[32mbridge-handler-O1ayzB49.d.mts[39m  [2m11.52 kB[22m [2m│ gzip:  3.97 kB[22m
packages/workerd build: [34mℹ[39m 6 files, total: 96.34 kB
packages/workerd build: [32m✔[39m Build complete in [32m1652ms[39m
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
packages/atproto-test-utils typecheck: Done
packages/create-emdash typecheck$ tsgo --noEmit
packages/contentful-to-portable-text typecheck: Done
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
packages/workerd typecheck: Done
packages/plugins/awcms-micro-gallery typecheck: Done
packages/plugins/awcms-micro-docs typecheck: Done
packages/plugins/awcms-micro-sikesra typecheck: Done
$ pnpm lint:quick
==> pnpm-lint-quick
$ oxlint -f json
{ "diagnostics": [{"message": "Variable 'settingsTableRows' is declared but never used. Unused variables should start with a '_'.","code": "eslint(no-unused-vars)","severity": "warning","causes": [],"url": "https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unused-vars.html","help": "Consider removing this declaration.","filename": "packages/plugins/awcms-micro-sikesra/tests/plugin.test.ts","labels": [{"label": "'settingsTableRows' is declared here","span": {"offset": 71133,"length": 17,"line": 2008,"column": 29}}],"related": []},
{"message": "Variable 'verificationStageTableRows' is declared but never used. Unused variables should start with a '_'.","code": "eslint(no-unused-vars)","severity": "warning","causes": [],"url": "https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unused-vars.html","help": "Consider removing this declaration.","filename": "packages/plugins/awcms-micro-sikesra/tests/plugin.test.ts","labels": [{"label": "'verificationStageTableRows' is declared here","span": {"offset": 103251,"length": 26,"line": 3041,"column": 29}}],"related": []},
{"message": "Variable 'verificationEventTableRows' is declared but never used. Unused variables should start with a '_'.","code": "eslint(no-unused-vars)","severity": "warning","causes": [],"url": "https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unused-vars.html","help": "Consider removing this declaration.","filename": "packages/plugins/awcms-micro-sikesra/tests/plugin.test.ts","labels": [{"label": "'verificationEventTableRows' is declared here","span": {"offset": 103279,"length": 26,"line": 3041,"column": 57}}],"related": []},
{"message": "Variable 'verificationStageTableRows' is declared but never used. Unused variables should start with a '_'.","code": "eslint(no-unused-vars)","severity": "warning","causes": [],"url": "https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unused-vars.html","help": "Consider removing this declaration.","filename": "packages/plugins/awcms-micro-sikesra/tests/plugin.test.ts","labels": [{"label": "'verificationStageTableRows' is declared here","span": {"offset": 103957,"length": 26,"line": 3060,"column": 29}}],"related": []},
{"message": "Variable 'verificationEventTableRows' is declared but never used. Unused variables should start with a '_'.","code": "eslint(no-unused-vars)","severity": "warning","causes": [],"url": "https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unused-vars.html","help": "Consider removing this declaration.","filename": "packages/plugins/awcms-micro-sikesra/tests/plugin.test.ts","labels": [{"label": "'verificationEventTableRows' is declared here","span": {"offset": 103985,"length": 26,"line": 3060,"column": 57}}],"related": []},
{"message": "Variable 'importBatchTableRows' is declared but never used. Unused variables should start with a '_'.","code": "eslint(no-unused-vars)","severity": "warning","causes": [],"url": "https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unused-vars.html","help": "Consider removing this declaration.","filename": "packages/plugins/awcms-micro-sikesra/tests/plugin.test.ts","labels": [{"label": "'importBatchTableRows' is declared here","span": {"offset": 104879,"length": 20,"line": 3085,"column": 29}}],"related": []},
{"message": "Variable 'importStagingRowTableRows' is declared but never used. Unused variables should start with a '_'.","code": "eslint(no-unused-vars)","severity": "warning","causes": [],"url": "https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unused-vars.html","help": "Consider removing this declaration.","filename": "packages/plugins/awcms-micro-sikesra/tests/plugin.test.ts","labels": [{"label": "'importStagingRowTableRows' is declared here","span": {"offset": 104901,"length": 25,"line": 3085,"column": 51}}],"related": []},
{"message": "Identifier 'AWCMS_SIKESRA_PLUGIN_ID' is imported but never used.","code": "eslint(no-unused-vars)","severity": "warning","causes": [],"url": "https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unused-vars.html","help": "Consider removing this import.","filename": "packages/plugins/awcms-micro-sikesra/src/admin.tsx","labels": [{"label": "'AWCMS_SIKESRA_PLUGIN_ID' is imported here","span": {"offset": 1187,"length": 23,"line": 36,"column": 2}}],"related": []},
{"message": "Function 'ContractAlignedPage' is declared but never used.","code": "eslint(no-unused-vars)","severity": "warning","causes": [],"url": "https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unused-vars.html","help": "Consider removing this declaration.","filename": "packages/plugins/awcms-micro-sikesra/src/admin.tsx","labels": [{"label": "'ContractAlignedPage' is declared here","span": {"offset": 26024,"length": 19,"line": 1000,"column": 10}}],"related": []}],
              "number_of_files": 1971,
              "number_of_rules": 138,
              "threads_count": 20,
              "start_time": 1.931389037
            }
            $ pnpm --filter @emdash-cms/admin exec node --run locale:compile
==> pnpm-admin-locale-compile
Compiling message catalogs…
Done in 508ms
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
packages/auth test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/auth
packages/contentful-to-portable-text test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/contentful-to-portable-text
packages/blocks test: 12:30:52 PM [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
packages/blocks test: `optimizeDeps.rollupOptions` / `ssr.optimizeDeps.rollupOptions` is deprecated. Use `optimizeDeps.rolldownOptions` instead. Note that this option may be set by a plugin. Set VITE_DEPRECATION_TRACE=1 to see where it is called.
packages/blocks test: Both esbuild and oxc options were set. oxc options will be used and esbuild options will be ignored. The following esbuild options were set: `{ jsx: 'automatic', jsxImportSource: undefined }`
packages/blocks test: [vite:react-babel] We recommend switching to `@vitejs/plugin-react-oxc` for improved performance. More information at https://vite.dev/rolldown
packages/blocks test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/blocks
packages/atproto-test-utils test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/atproto-test-utils
packages/contentful-to-portable-text test:  Test Files  2 passed (2)
packages/contentful-to-portable-text test:       Tests  60 passed (60)
packages/contentful-to-portable-text test:    Start at  12:30:52
packages/contentful-to-portable-text test:    Duration  274ms (transform 120ms, setup 0ms, import 221ms, tests 36ms, environment 0ms)
packages/contentful-to-portable-text test: Done
packages/create-emdash test$ vitest run
packages/auth test:  Test Files  5 passed (5)
packages/auth test:       Tests  57 passed (57)
packages/auth test:    Start at  12:30:52
packages/auth test:    Duration  417ms (transform 207ms, setup 0ms, import 464ms, tests 430ms, environment 0ms)
packages/auth test: Done
packages/gutenberg-to-portable-text test$ vitest
packages/create-emdash test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/create-emdash
packages/atproto-test-utils test:  Test Files  1 passed (1)
packages/atproto-test-utils test:       Tests  17 passed (17)
packages/atproto-test-utils test:    Start at  12:30:52
packages/atproto-test-utils test:    Duration  561ms (transform 84ms, setup 0ms, import 224ms, tests 190ms, environment 0ms)
packages/atproto-test-utils test: Done
packages/marketplace test$ vitest
packages/gutenberg-to-portable-text test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/gutenberg-to-portable-text
packages/create-emdash test:  Test Files  2 passed (2)
packages/create-emdash test:       Tests  103 passed (103)
packages/create-emdash test:    Start at  12:30:52
packages/create-emdash test:    Duration  215ms (transform 91ms, setup 0ms, import 131ms, tests 31ms, environment 0ms)
packages/create-emdash test: Done
packages/plugin-types test$ vitest run
packages/marketplace test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/marketplace
packages/blocks test:  Test Files  3 passed (3)
packages/blocks test:       Tests  96 passed (96)
packages/blocks test:    Start at  12:30:52
packages/blocks test:    Duration  925ms (transform 409ms, setup 0ms, import 729ms, tests 291ms, environment 971ms)
packages/gutenberg-to-portable-text test:  Test Files  2 passed (2)
packages/gutenberg-to-portable-text test:       Tests  140 passed (140)
packages/gutenberg-to-portable-text test:    Start at  12:30:52
packages/gutenberg-to-portable-text test:    Duration  309ms (transform 127ms, setup 0ms, import 247ms, tests 64ms, environment 0ms)
packages/blocks test: Done
packages/registry-lexicons test$ vitest run
packages/gutenberg-to-portable-text test: Done
packages/x402 test$ vitest
packages/plugin-types test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugin-types
packages/marketplace test:  Test Files  4 passed (4)
packages/marketplace test:       Tests  43 passed (43)
packages/marketplace test:    Start at  12:30:53
packages/marketplace test:    Duration  220ms (transform 130ms, setup 0ms, import 244ms, tests 43ms, environment 0ms)
packages/marketplace test: Done
packages/plugin-types test:  Test Files  2 passed (2)
packages/plugin-types test:       Tests  27 passed (27)
packages/plugin-types test:    Start at  12:30:53
packages/plugin-types test:    Duration  148ms (transform 46ms, setup 0ms, import 70ms, tests 10ms, environment 0ms)
packages/x402 test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/x402
packages/registry-lexicons test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-lexicons
packages/plugin-types test: Done
packages/x402 test:  Test Files  1 passed (1)
packages/x402 test:       Tests  17 passed (17)
packages/x402 test:    Start at  12:30:53
packages/x402 test:    Duration  193ms (transform 51ms, setup 0ms, import 58ms, tests 41ms, environment 0ms)
packages/x402 test: Done
packages/registry-lexicons test:  Test Files  1 passed (1)
packages/registry-lexicons test:       Tests  10 passed (10)
packages/registry-lexicons test:    Start at  12:30:53
packages/registry-lexicons test:    Duration  212ms (transform 73ms, setup 0ms, import 115ms, tests 7ms, environment 0ms)
packages/registry-lexicons test: Done
packages/registry-client test$ vitest run
packages/registry-client test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-client
packages/registry-client test:  Test Files  4 passed (4)
packages/registry-client test:       Tests  70 passed (70)
packages/registry-client test:    Start at  12:30:54
packages/registry-client test:    Duration  269ms (transform 218ms, setup 0ms, import 403ms, tests 100ms, environment 0ms)
packages/registry-client test: Done
packages/admin test$ vitest
packages/plugin-cli test$ vitest run
packages/plugin-cli test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugin-cli
packages/admin test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin
packages/admin test: Loaded  vitest@4.1.5  and  @vitest/browser@4.1.7 .
packages/admin test: Running mixed versions is not supported and may lead into bugs
packages/admin test: Update your dependencies and make sure the versions match.
packages/admin test: 12:30:54 PM [vite] (client) Re-optimizing dependencies because lockfile has changed
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/editor/slash-menu.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/components/RevisionHistory.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/editor/toolbar.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/components/users/UserDetail.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/editor/bubble-menu.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/components/settings/AllowedDomainsSettings.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/plugin-cli test:  Test Files  20 passed (20)
packages/plugin-cli test:       Tests  391 passed (391)
packages/plugin-cli test:    Start at  12:30:54
packages/plugin-cli test:    Duration  10.90s (transform 4.02s, setup 0ms, import 7.93s, tests 11.05s, environment 2ms)
packages/plugin-cli test: Done
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/editor/block-menu.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/components/users/InviteUserModal.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/lib/hooks.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  Test Files  77 passed (77)
packages/admin test:       Tests  988 passed (988)
packages/admin test:    Start at  12:30:54
packages/admin test:    Duration  23.94s (transform 0ms, setup 7.20s, import 135.06s, tests 65.66s, environment 0ms)
packages/admin test: Done
packages/auth-atproto test$ vitest run
packages/core test$ vitest
packages/core test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/core
packages/auth-atproto test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/auth-atproto
packages/auth-atproto test:  Test Files  3 passed (3)
packages/auth-atproto test:       Tests  30 passed (30)
packages/auth-atproto test:    Start at  12:31:19
packages/auth-atproto test:    Duration  329ms (transform 199ms, setup 0ms, import 309ms, tests 163ms, environment 0ms)
packages/auth-atproto test: Done
packages/core test:  Test Files  236 passed (236)
packages/core test:       Tests  3583 passed (3583)
packages/core test:    Start at  12:31:19
packages/core test:    Duration  16.79s (transform 26.73s, setup 0ms, import 118.91s, tests 150.34s, environment 34ms)
packages/core test: Done
packages/cloudflare test$ vitest run
packages/workerd test$ vitest run
packages/cloudflare test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/cloudflare
packages/workerd test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/workerd
packages/cloudflare test:  Test Files  8 passed (8)
packages/cloudflare test:       Tests  157 passed (157)
packages/cloudflare test:    Start at  12:31:36
packages/cloudflare test:    Duration  285ms (transform 415ms, setup 0ms, import 728ms, tests 93ms, environment 1ms)
packages/cloudflare test: Done
packages/workerd test:  Test Files  11 passed (11)
packages/workerd test:       Tests  73 passed (73)
packages/workerd test:    Start at  12:31:36
packages/workerd test:    Duration  9.24s (transform 5.42s, setup 0ms, import 10.85s, tests 8.84s, environment 1ms)
packages/workerd test: Done
```
