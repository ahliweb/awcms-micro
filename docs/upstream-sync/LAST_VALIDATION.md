# Last Validation

## Validation Run Metadata

- Date:
  - Started: 2026-06-12T14:18:45Z
  - Completed: 2026-06-12T14:21:13Z
- Operator: unggul
- Branch: `main`
- Upstream commit SHA: `ff5855ab41ef8a5417889ac123a7cbd82c9fa3fa`
- Validation scope: `awcmsmicro-dev` workspace validation

## Commands

```bash
bash scripts/validate-awcmsmicro-dev.sh
bash -n scripts/update-emdash-latest.sh
bash -n scripts/update-awcmsmicro-dev.sh
bash -n scripts/validate-awcmsmicro-dev.sh
bash -n scripts/sync-and-validate-awcmsmicro-dev.sh
pnpm --filter @awcms-micro/plugin-sikesra awcms:sikesra:validate-after-emdash-sync
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
Scope: all 63 workspace projects
[WARN] There are cyclic workspace dependencies: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/auth-atproto, /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/core
Lockfile is up to date, resolution step is skipped
Progress: resolved 1, reused 0, downloaded 0, added 0
Packages: +1652
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Progress: resolved 1652, reused 1622, downloaded 0, added 1652, done

devDependencies:
+ @axe-core/playwright 4.11.3
+ @changesets/changelog-github 0.7.0
+ @changesets/cli 2.31.0
+ @e18e/eslint-plugin 0.5.0
+ @lunariajs/core 0.1.1
+ @playwright/test 1.60.0
+ @types/node 24.10.13
+ @typescript/native-preview 7.0.0-dev.20260421.2
+ emdash 0.18.0 <- packages/core
+ knip 5.84.1
+ oxfmt 0.52.0
+ oxlint 1.67.0
+ oxlint-tsgolint 0.23.0
+ pkg-pr-new 0.0.75
+ prettier 3.8.3
+ prettier-plugin-astro 0.14.1
+ typescript 6.0.0-beta

packages/plugins/awcms-micro-docs prepare$ node --run build
.../plugins/awcms-micro-email-mailketing prepare$ node --run build
packages/plugins/awcms-micro-gallery prepare$ node --run build
packages/plugins/awcms-micro-sikesra prepare$ node --run build
.../plugins/awcms-micro-website-social prepare$ node --run build
.../plugins/awcms-micro-email-mailketing prepare: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/plugins/awcms-micro-docs prepare: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/plugins/awcms-micro-gallery prepare: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
.../plugins/awcms-micro-website-social prepare: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/plugins/awcms-micro-docs prepare: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-docs/tsdown.config.ts
packages/plugins/awcms-micro-docs prepare: ℹ entry: src/index.ts, src/admin.tsx
packages/plugins/awcms-micro-docs prepare: ℹ target: es2023
packages/plugins/awcms-micro-docs prepare: ℹ tsconfig: tsconfig.json
packages/plugins/awcms-micro-docs prepare: ℹ Build start
packages/plugins/awcms-micro-gallery prepare: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-gallery/tsdown.config.ts
packages/plugins/awcms-micro-gallery prepare: ℹ entry: src/index.ts, src/sandbox.ts
packages/plugins/awcms-micro-gallery prepare: ℹ target: es2023
packages/plugins/awcms-micro-gallery prepare: ℹ tsconfig: tsconfig.json
packages/plugins/awcms-micro-gallery prepare: ℹ Build start
packages/plugins/awcms-micro-docs prepare: ℹ Cleaning 10 files
packages/plugins/awcms-micro-sikesra prepare: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/plugins/awcms-micro-gallery prepare: ℹ Cleaning 10 files
.../plugins/awcms-micro-email-mailketing prepare: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-email-mailketing/tsdown.config.ts
.../plugins/awcms-micro-email-mailketing prepare: ℹ entry: src/index.ts, src/admin.tsx, src/sandbox.ts
.../plugins/awcms-micro-email-mailketing prepare: ℹ target: es2023
.../plugins/awcms-micro-email-mailketing prepare: ℹ tsconfig: tsconfig.json
.../plugins/awcms-micro-email-mailketing prepare: ℹ Build start
.../plugins/awcms-micro-email-mailketing prepare: ℹ Cleaning 8 files
.../plugins/awcms-micro-website-social prepare: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-website-social/tsdown.config.ts
.../plugins/awcms-micro-website-social prepare: ℹ entry: src/index.ts, src/admin.tsx
.../plugins/awcms-micro-website-social prepare: ℹ target: es2023
.../plugins/awcms-micro-website-social prepare: ℹ tsconfig: tsconfig.json
.../plugins/awcms-micro-website-social prepare: ℹ Build start
.../plugins/awcms-micro-website-social prepare: ℹ Cleaning 8 files
packages/plugins/awcms-micro-sikesra prepare: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/tsdown.config.ts
packages/plugins/awcms-micro-sikesra prepare: ℹ entry: src/index.ts, src/admin.tsx, src/navigation.ts, src/sandbox.ts
packages/plugins/awcms-micro-sikesra prepare: ℹ target: es2023
packages/plugins/awcms-micro-sikesra prepare: ℹ tsconfig: tsconfig.json
packages/plugins/awcms-micro-sikesra prepare: ℹ Build start
packages/plugins/awcms-micro-sikesra prepare: ℹ Cleaning 11 files
packages/plugins/awcms-micro-gallery prepare: ℹ dist/index.mjs                    29.33 kB │ gzip:  6.78 kB
packages/plugins/awcms-micro-gallery prepare: ℹ dist/sandbox.mjs                  26.63 kB │ gzip:  6.02 kB
packages/plugins/awcms-micro-gallery prepare: ℹ dist/index.mjs.map                55.59 kB │ gzip: 12.29 kB
packages/plugins/awcms-micro-gallery prepare: ℹ dist/sandbox.mjs.map              51.85 kB │ gzip: 11.35 kB
packages/plugins/awcms-micro-gallery prepare: ℹ dist/validation-IIdTEAKI.mjs.map  28.07 kB │ gzip:  6.75 kB
packages/plugins/awcms-micro-gallery prepare: ℹ dist/validation-IIdTEAKI.mjs      17.00 kB │ gzip:  4.47 kB
packages/plugins/awcms-micro-gallery prepare: ℹ dist/index.d.mts.map               0.87 kB │ gzip:  0.36 kB
packages/plugins/awcms-micro-gallery prepare: ℹ dist/sandbox.d.mts.map             0.12 kB │ gzip:  0.12 kB
packages/plugins/awcms-micro-gallery prepare: ℹ dist/index.d.mts                   3.57 kB │ gzip:  1.02 kB
packages/plugins/awcms-micro-gallery prepare: ℹ dist/sandbox.d.mts                 0.21 kB │ gzip:  0.16 kB
packages/plugins/awcms-micro-gallery prepare: ℹ 10 files, total: 213.24 kB
packages/plugins/awcms-micro-gallery prepare: ✔ Build complete in 2152ms
packages/plugins/awcms-micro-gallery prepare: Done
.../plugins/awcms-micro-website-social prepare: ℹ dist/admin.js        5.09 kB │ gzip: 1.86 kB
.../plugins/awcms-micro-website-social prepare: ℹ dist/index.js        1.17 kB │ gzip: 0.47 kB
.../plugins/awcms-micro-website-social prepare: ℹ dist/admin.js.map    6.97 kB │ gzip: 2.54 kB
.../plugins/awcms-micro-website-social prepare: ℹ dist/index.js.map    1.66 kB │ gzip: 0.67 kB
.../plugins/awcms-micro-website-social prepare: ℹ dist/index.d.ts.map  0.20 kB │ gzip: 0.16 kB
.../plugins/awcms-micro-website-social prepare: ℹ dist/admin.d.ts.map  0.12 kB │ gzip: 0.12 kB
.../plugins/awcms-micro-website-social prepare: ℹ dist/index.d.ts      0.70 kB │ gzip: 0.33 kB
.../plugins/awcms-micro-website-social prepare: ℹ dist/admin.d.ts      0.21 kB │ gzip: 0.15 kB
.../plugins/awcms-micro-website-social prepare: ℹ 8 files, total: 16.12 kB
.../plugins/awcms-micro-website-social prepare: ✔ Build complete in 3312ms
.../plugins/awcms-micro-website-social prepare: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugins. Here is a breakdown:
.../plugins/awcms-micro-website-social prepare:   - rolldown-plugin-dts:generate (75%)
.../plugins/awcms-micro-website-social prepare:   - tsdown:external (25%)
.../plugins/awcms-micro-website-social prepare: See https://rolldown.rs/options/checks#plugintimings for more details.
.../plugins/awcms-micro-website-social prepare: Done
packages/plugins/awcms-micro-docs prepare: ℹ dist/admin.js                  5.12 kB │ gzip: 1.05 kB
packages/plugins/awcms-micro-docs prepare: ℹ dist/index.js                  0.97 kB │ gzip: 0.45 kB
packages/plugins/awcms-micro-docs prepare: ℹ dist/content-s6AnXlIg.js.map  12.78 kB │ gzip: 3.61 kB
packages/plugins/awcms-micro-docs prepare: ℹ dist/content-s6AnXlIg.js       9.25 kB │ gzip: 3.05 kB
packages/plugins/awcms-micro-docs prepare: ℹ dist/admin.js.map              5.91 kB │ gzip: 1.57 kB
packages/plugins/awcms-micro-docs prepare: ℹ dist/index.js.map              1.51 kB │ gzip: 0.63 kB
packages/plugins/awcms-micro-docs prepare: ℹ dist/index.d.ts.map            0.58 kB │ gzip: 0.27 kB
packages/plugins/awcms-micro-docs prepare: ℹ dist/admin.d.ts.map            0.12 kB │ gzip: 0.12 kB
packages/plugins/awcms-micro-docs prepare: ℹ dist/index.d.ts                1.30 kB │ gzip: 0.51 kB
packages/plugins/awcms-micro-docs prepare: ℹ dist/admin.d.ts                0.21 kB │ gzip: 0.15 kB
packages/plugins/awcms-micro-docs prepare: ℹ 10 files, total: 37.76 kB
packages/plugins/awcms-micro-docs prepare: ✔ Build complete in 3393ms
packages/plugins/awcms-micro-docs prepare: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugin `rolldown-plugin-dts:generate`. See https://rolldown.rs/options/checks#plugintimings for more details.
packages/plugins/awcms-micro-docs prepare: Done
.../plugins/awcms-micro-email-mailketing prepare: ℹ dist/admin.js              51.52 kB │ gzip: 7.27 kB
.../plugins/awcms-micro-email-mailketing prepare: ℹ dist/index.js               1.78 kB │ gzip: 0.61 kB
.../plugins/awcms-micro-email-mailketing prepare: ℹ dist/sandbox.js             0.26 kB │ gzip: 0.18 kB
.../plugins/awcms-micro-email-mailketing prepare: ℹ dist/runtime-BG998H6G.js   35.19 kB │ gzip: 7.26 kB
.../plugins/awcms-micro-email-mailketing prepare: ℹ dist/messages-CyXQWqnu.js  12.95 kB │ gzip: 2.86 kB
.../plugins/awcms-micro-email-mailketing prepare: ℹ dist/index.d.ts             0.71 kB │ gzip: 0.32 kB
.../plugins/awcms-micro-email-mailketing prepare: ℹ dist/sandbox.d.ts           0.44 kB │ gzip: 0.27 kB
.../plugins/awcms-micro-email-mailketing prepare: ℹ dist/admin.d.ts             0.21 kB │ gzip: 0.15 kB
.../plugins/awcms-micro-email-mailketing prepare: ℹ 8 files, total: 103.06 kB
.../plugins/awcms-micro-email-mailketing prepare: ✔ Build complete in 3457ms
.../plugins/awcms-micro-email-mailketing prepare: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugin `rolldown-plugin-dts:generate`. See https://rolldown.rs/options/checks#plugintimings for more details.
.../plugins/awcms-micro-email-mailketing prepare: Done
packages/plugins/awcms-micro-sikesra prepare: ℹ dist/admin.js                           360.78 kB │ gzip: 54.33 kB
packages/plugins/awcms-micro-sikesra prepare: ℹ dist/index.js                             2.79 kB │ gzip:  0.99 kB
packages/plugins/awcms-micro-sikesra prepare: ℹ dist/navigation.js                        0.78 kB │ gzip:  0.32 kB
packages/plugins/awcms-micro-sikesra prepare: ℹ dist/sandbox.js                           0.30 kB │ gzip:  0.21 kB
packages/plugins/awcms-micro-sikesra prepare: ℹ dist/runtime-5dclkDQF.js                381.89 kB │ gzip: 77.95 kB
packages/plugins/awcms-micro-sikesra prepare: ℹ dist/field-standards-DPRMDU-F.js         30.46 kB │ gzip:  5.13 kB
packages/plugins/awcms-micro-sikesra prepare: ℹ dist/AwcmsPluginHeaderMenu-V7ITPBZD.js   13.98 kB │ gzip:  3.29 kB
packages/plugins/awcms-micro-sikesra prepare: ℹ dist/index.d.ts                           7.29 kB │ gzip:  1.91 kB
packages/plugins/awcms-micro-sikesra prepare: ℹ dist/navigation.d.ts                      6.04 kB │ gzip:  1.38 kB
packages/plugins/awcms-micro-sikesra prepare: ℹ dist/admin.d.ts                           3.20 kB │ gzip:  1.04 kB
packages/plugins/awcms-micro-sikesra prepare: ℹ dist/sandbox.d.ts                         2.23 kB │ gzip:  0.50 kB
packages/plugins/awcms-micro-sikesra prepare: ℹ 11 files, total: 809.74 kB
packages/plugins/awcms-micro-sikesra prepare: ✔ Build complete in 3963ms
packages/plugins/awcms-micro-sikesra prepare: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugin `rolldown-plugin-dts:generate`. See https://rolldown.rs/options/checks#plugintimings for more details.
packages/plugins/awcms-micro-sikesra prepare: Done
Done in 16.6s using pnpm v11.5.1
$ pnpm --filter emdash build
==> pnpm-build-emdash
$ tsdown
ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/core/tsdown.config.ts
ℹ entry: src/index.ts, src/request-context.ts, src/astro/index.ts, src/astro/middleware.ts, src/astro/middleware/setup.ts, src/astro/middleware/auth.ts, src/astro/middleware/redirect.ts, src/astro/middleware/request-context.ts, src/astro/types.ts, src/db/index.ts, src/db/sqlite.ts, src/db/libsql.ts, src/db/postgres.ts, src/database/instrumentation.ts, src/storage/local.ts, src/storage/s3.ts, src/media/index.ts, src/media/local-runtime.ts, src/runtime.ts, src/seed/index.ts, src/cli/index.ts, src/client/index.ts, src/client/cf-access.ts, src/seo/index.ts, src/page/index.ts, src/plugin-utils.ts, src/plugin-types.ts, src/plugins/adapt-sandbox-entry.ts, src/api/route-utils.ts, src/api/schemas/index.ts, src/auth/providers/github.ts, src/auth/providers/google.ts
ℹ tsconfig: tsconfig.json
ℹ Build start
ℹ Cleaning 1114 files
ℹ Granting execute permission to dist/cli/index.mjs
ℹ dist/cli/index.mjs                                                            146.68 kB │ gzip: 37.09 kB
ℹ dist/astro/middleware.mjs                                                     106.38 kB │ gzip: 28.59 kB
ℹ dist/astro/routes/api/openapi.json.mjs                                         90.41 kB │ gzip: 14.40 kB
ℹ dist/astro/routes/api/mcp.mjs                                                  68.08 kB │ gzip: 15.08 kB
ℹ dist/astro/index.mjs                                                           66.04 kB │ gzip: 15.45 kB
ℹ dist/astro/middleware/request-context.mjs                                      41.28 kB │ gzip: 10.35 kB
ℹ dist/astro/routes/api/import/wordpress/execute.mjs                             26.48 kB │ gzip:  8.21 kB
ℹ dist/astro/middleware/auth.mjs                                                 21.78 kB │ gzip:  6.02 kB
ℹ dist/page/index.mjs                                                            13.75 kB │ gzip:  4.05 kB
ℹ dist/client/index.mjs                                                          13.03 kB │ gzip:  3.53 kB
ℹ dist/astro/routes/api/admin/plugins/registry/artifact.mjs                      12.64 kB │ gzip:  4.54 kB
ℹ dist/astro/routes/api/oauth/authorize.mjs                                      11.85 kB │ gzip:  3.50 kB
ℹ dist/astro/routes/api/import/wordpress/analyze.mjs                              9.96 kB │ gzip:  3.37 kB
ℹ dist/astro/routes/api/snapshot.mjs                                              9.29 kB │ gzip:  3.58 kB
ℹ dist/index.mjs                                                                  8.53 kB │ gzip:  2.60 kB
ℹ dist/astro/routes/api/comments/_collection_/_contentId_/index.mjs               8.32 kB │ gzip:  2.59 kB
ℹ dist/api/schemas/index.mjs                                                      8.31 kB │ gzip:  1.95 kB
ℹ dist/astro/routes/api/import/wordpress-plugin/execute.mjs                       8.17 kB │ gzip:  2.75 kB
ℹ dist/storage/s3.mjs                                                             7.78 kB │ gzip:  2.79 kB
ℹ dist/astro/routes/api/import/wordpress/media.mjs                                6.56 kB │ gzip:  2.13 kB
ℹ dist/plugins/adapt-sandbox-entry.mjs                                            5.88 kB │ gzip:  2.21 kB
ℹ dist/astro/routes/api/media.mjs                                                 5.75 kB │ gzip:  2.13 kB
ℹ dist/astro/routes/api/auth/oauth/_provider_/callback.mjs                        5.73 kB │ gzip:  2.02 kB
ℹ dist/client/cf-access.mjs                                                       5.69 kB │ gzip:  2.17 kB
ℹ dist/storage/local.mjs                                                          5.56 kB │ gzip:  2.04 kB
ℹ dist/astro/routes/api/import/wordpress/rewrite-urls.mjs                         5.56 kB │ gzip:  1.82 kB
ℹ dist/astro/routes/api/content/_collection_/_id_.mjs                             5.19 kB │ gzip:  1.47 kB
ℹ dist/astro/routes/api/setup/dev-bypass.mjs                                      5.05 kB │ gzip:  2.01 kB
ℹ dist/astro/routes/api/oauth/token.mjs                                           4.98 kB │ gzip:  1.68 kB
ℹ dist/astro/routes/sitemap-_collection_.xml.mjs                                  4.90 kB │ gzip:  1.84 kB
ℹ dist/astro/routes/api/import/wordpress/rewrite-url-helpers.mjs                  4.64 kB │ gzip:  1.71 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs            4.57 kB │ gzip:  1.49 kB
ℹ dist/astro/routes/api/oauth/register.mjs                                        4.42 kB │ gzip:  1.65 kB
ℹ dist/astro/routes/api/admin/plugins/registry/install.mjs                        4.40 kB │ gzip:  1.73 kB
ℹ dist/astro/routes/api/admin/users/_id_/index.mjs                                4.37 kB │ gzip:  1.46 kB
ℹ dist/astro/routes/api/import/wordpress/prepare.mjs                              4.34 kB │ gzip:  1.62 kB
ℹ dist/astro/routes/api/settings/email.mjs                                        4.32 kB │ gzip:  1.72 kB
ℹ dist/astro/routes/api/admin/plugins/registry/_id_/update.mjs                    4.27 kB │ gzip:  1.59 kB
ℹ dist/astro/routes/api/schema/collections/_slug_/index.mjs                       3.81 kB │ gzip:  1.15 kB
ℹ dist/astro/routes/api/setup/index.mjs                                           3.76 kB │ gzip:  1.42 kB
ℹ dist/media/local-runtime.mjs                                                    3.75 kB │ gzip:  1.18 kB
ℹ dist/astro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs          3.72 kB │ gzip:  1.04 kB
ℹ dist/astro/routes/api/setup/admin-verify.mjs                                    3.69 kB │ gzip:  1.41 kB
ℹ dist/astro/routes/api/widget-areas/_name_/widgets/_id_.mjs                      3.65 kB │ gzip:  1.11 kB
ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/install.mjs                3.58 kB │ gzip:  1.32 kB
ℹ dist/astro/routes/api/media/upload-url.mjs                                      3.54 kB │ gzip:  1.47 kB
ℹ dist/astro/routes/api/auth/passkey/register/verify.mjs                          3.52 kB │ gzip:  1.36 kB
ℹ dist/astro/routes/api/admin/comments/_id_/status.mjs                            3.49 kB │ gzip:  1.31 kB
ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_/translations.mjs           3.48 kB │ gzip:  1.13 kB
ℹ dist/astro/routes/api/media/_id_.mjs                                            3.43 kB │ gzip:  1.04 kB
ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_.mjs                        3.42 kB │ gzip:  0.96 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/schedule.mjs                    3.34 kB │ gzip:  1.04 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/update.mjs                             3.30 kB │ gzip:  1.21 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/preview-url.mjs                 3.19 kB │ gzip:  1.33 kB
ℹ dist/astro/routes/api/schema/collections/_slug_/fields/index.mjs                3.19 kB │ gzip:  1.00 kB
ℹ dist/astro/routes/api/media/providers/_providerId_/index.mjs                    3.15 kB │ gzip:  1.14 kB
ℹ dist/astro/routes/api/admin/plugins/updates.mjs                                 3.15 kB │ gzip:  1.14 kB
ℹ dist/astro/routes/api/admin/bylines/index.mjs                                   3.11 kB │ gzip:  1.20 kB
ℹ dist/astro/routes/api/admin/bylines/_id_/index.mjs                              3.10 kB │ gzip:  1.07 kB
ℹ dist/astro/routes/api/admin/plugins/registry/_id_/uninstall.mjs                 3.10 kB │ gzip:  1.11 kB
ℹ dist/astro/routes/api/plugins/_pluginId_/_...path_.mjs                          3.09 kB │ gzip:  1.37 kB
ℹ dist/astro/middleware/redirect.mjs                                              3.08 kB │ gzip:  1.30 kB
ℹ dist/astro/routes/api/setup/admin.mjs                                           3.07 kB │ gzip:  1.24 kB
ℹ dist/astro/routes/api/content/_collection_/index.mjs                            3.03 kB │ gzip:  1.14 kB
ℹ dist/astro/routes/api/auth/oauth/_provider_.mjs                                 3.00 kB │ gzip:  1.17 kB
ℹ dist/astro/routes/api/admin/oauth-clients/_id_.mjs                              3.00 kB │ gzip:  0.97 kB
ℹ dist/astro/routes/api/admin/themes/marketplace/index.mjs                        2.99 kB │ gzip:  1.12 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/uninstall.mjs                          2.99 kB │ gzip:  1.11 kB
ℹ dist/astro/routes/api/admin/bylines/_id_/translations.mjs                       2.98 kB │ gzip:  1.13 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/enable.mjs                             2.97 kB │ gzip:  1.09 kB
ℹ dist/astro/routes/api/schema/collections/index.mjs                              2.92 kB │ gzip:  0.99 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/publish.mjs                     2.88 kB │ gzip:  1.18 kB
ℹ dist/astro/routes/api/admin/allowed-domains/_domain_.mjs                        2.86 kB │ gzip:  0.99 kB
ℹ dist/astro/routes/api/schema/collections/_slug_/fields/reorder.mjs              2.83 kB │ gzip:  0.97 kB
ℹ dist/astro/routes/api/admin/plugins/marketplace/index.mjs                       2.80 kB │ gzip:  1.03 kB
ℹ dist/astro/routes/api/redirects/_id_.mjs                                        2.80 kB │ gzip:  0.84 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/disable.mjs                            2.80 kB │ gzip:  1.04 kB
ℹ dist/astro/routes/api/auth/passkey/_id_.mjs                                     2.78 kB │ gzip:  0.98 kB
ℹ dist/astro/routes/api/auth/signup/complete.mjs                                  2.78 kB │ gzip:  1.16 kB
ℹ dist/astro/routes/api/admin/allowed-domains/index.mjs                           2.77 kB │ gzip:  1.05 kB
ℹ dist/astro/routes/api/auth/invite/complete.mjs                                  2.75 kB │ gzip:  1.14 kB
ℹ dist/astro/routes/api/auth/dev-bypass.mjs                                       2.72 kB │ gzip:  1.27 kB
ℹ dist/astro/routes/api/import/wordpress-plugin/analyze.mjs                       2.71 kB │ gzip:  1.14 kB
ℹ dist/astro/routes/api/schema/orphans/_slug_.mjs                                 2.69 kB │ gzip:  1.01 kB
ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/index.mjs                  2.67 kB │ gzip:  0.95 kB
ℹ dist/astro/routes/api/menus/_name_/translations.mjs                             2.66 kB │ gzip:  0.94 kB
ℹ dist/astro/routes/api/typegen.mjs                                               2.66 kB │ gzip:  1.06 kB
ℹ dist/astro/routes/api/admin/themes/marketplace/_id_/index.mjs                   2.65 kB │ gzip:  0.96 kB
ℹ dist/seo/index.mjs                                                              2.65 kB │ gzip:  1.04 kB
ℹ dist/plugin-utils.mjs                                                           2.63 kB │ gzip:  1.21 kB
ℹ dist/astro/routes/api/auth/passkey/options.mjs                                  2.60 kB │ gzip:  1.07 kB
ℹ dist/astro/routes/api/auth/passkey/register/options.mjs                         2.58 kB │ gzip:  1.06 kB
ℹ dist/astro/routes/api/sections/_slug_.mjs                                       2.58 kB │ gzip:  0.79 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/index.mjs                              2.56 kB │ gzip:  0.96 kB
ℹ dist/astro/routes/api/schema/index.mjs                                          2.54 kB │ gzip:  1.11 kB
ℹ dist/astro/routes/api/widget-areas/index.mjs                                    2.53 kB │ gzip:  1.01 kB
ℹ dist/astro/routes/api/taxonomies/_name_/terms/index.mjs                         2.52 kB │ gzip:  0.91 kB
ℹ dist/database/instrumentation.mjs                                               2.51 kB │ gzip:  1.22 kB
ℹ dist/astro/routes/api/redirects/404s/index.mjs                                  2.48 kB │ gzip:  0.81 kB
ℹ dist/astro/routes/api/auth/passkey/verify.mjs                                   2.47 kB │ gzip:  1.02 kB
ℹ dist/astro/routes/api/media/_id_/confirm.mjs                                    2.44 kB │ gzip:  1.08 kB
ℹ dist/astro/routes/api/menus/_name_.mjs                                          2.41 kB │ gzip:  0.75 kB
ℹ dist/astro/routes/api/auth/magic-link/send.mjs                                  2.41 kB │ gzip:  0.98 kB
ℹ dist/astro/routes/sitemap.xml.mjs                                               2.40 kB │ gzip:  1.10 kB
ℹ dist/astro/routes/api/setup/status.mjs                                          2.39 kB │ gzip:  1.03 kB
ℹ dist/astro/routes/api/admin/byline-fields/_slug_.mjs                            2.37 kB │ gzip:  0.75 kB
ℹ dist/astro/routes/api/admin/hooks/exclusive/_hookName_.mjs                      2.36 kB │ gzip:  1.04 kB
ℹ dist/astro/routes/api/media/providers/_providerId_/_itemId_.mjs                 2.36 kB │ gzip:  0.78 kB
ℹ dist/astro/routes/api/widget-areas/_name_/widgets.mjs                           2.36 kB │ gzip:  1.03 kB
ℹ dist/astro/routes/api/admin/plugins/index.mjs                                   2.33 kB │ gzip:  0.91 kB
ℹ dist/astro/routes/api/auth/invite/index.mjs                                     2.32 kB │ gzip:  1.07 kB
ℹ dist/astro/routes/api/auth/invite/register-options.mjs                          2.31 kB │ gzip:  1.01 kB
ℹ dist/astro/routes/api/settings.mjs                                              2.28 kB │ gzip:  0.92 kB
ℹ dist/astro/routes/api/schema/orphans/index.mjs                                  2.28 kB │ gzip:  0.85 kB
ℹ dist/astro/routes/api/auth/signup/request.mjs                                   2.27 kB │ gzip:  0.99 kB
ℹ dist/astro/routes/api/menus/_name_/items/_id_.mjs                               2.24 kB │ gzip:  0.78 kB
ℹ dist/astro/routes/api/taxonomies/index.mjs                                      2.23 kB │ gzip:  0.85 kB
ℹ dist/astro/routes/api/admin/oauth-clients/index.mjs                             2.20 kB │ gzip:  0.90 kB
ℹ dist/astro/routes/api/themes/preview.mjs                                        2.15 kB │ gzip:  0.98 kB
ℹ dist/astro/routes/api/search/rebuild.mjs                                        2.15 kB │ gzip:  0.93 kB
ℹ dist/astro/routes/api/widget-areas/_name_.mjs                                   2.15 kB │ gzip:  0.79 kB
ℹ dist/astro/routes/api/admin/api-tokens/index.mjs                                2.13 kB │ gzip:  0.93 kB
ℹ dist/astro/routes/api/redirects/index.mjs                                       2.13 kB │ gzip:  0.79 kB
ℹ dist/astro/routes/api/admin/users/_id_/send-recovery.mjs                        2.03 kB │ gzip:  0.97 kB
ℹ dist/astro/routes/api/oauth/device/token.mjs                                    2.01 kB │ gzip:  0.94 kB
ℹ dist/astro/routes/api/search/index.mjs                                          2.01 kB │ gzip:  0.95 kB
ℹ dist/astro/routes/api/admin/users/index.mjs                                     2.00 kB │ gzip:  0.95 kB
ℹ dist/astro/routes/api/search/enable.mjs                                         1.98 kB │ gzip:  0.87 kB
ℹ dist/astro/routes/api/admin/users/_id_/disable.mjs                              1.96 kB │ gzip:  0.90 kB
ℹ dist/astro/routes/api/sections/index.mjs                                        1.93 kB │ gzip:  0.74 kB
ℹ dist/astro/routes/api/widget-areas/_name_/reorder.mjs                           1.93 kB │ gzip:  0.88 kB
ℹ dist/astro/routes/robots.txt.mjs                                                1.88 kB │ gzip:  0.85 kB
ℹ dist/astro/middleware/setup.mjs                                                 1.86 kB │ gzip:  0.86 kB
ℹ dist/astro/routes/api/media/file/_...key_.mjs                                   1.84 kB │ gzip:  0.95 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/duplicate.mjs                   1.81 kB │ gzip:  0.77 kB
ℹ dist/astro/routes/api/oauth/device/code.mjs                                     1.80 kB │ gzip:  0.84 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/discard-draft.mjs               1.78 kB │ gzip:  0.77 kB
ℹ dist/astro/routes/api/auth/me.mjs                                               1.77 kB │ gzip:  0.84 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/unpublish.mjs                   1.77 kB │ gzip:  0.76 kB
ℹ dist/request-context.mjs                                                        1.76 kB │ gzip:  0.90 kB
ℹ dist/api/route-utils.mjs                                                        1.76 kB │ gzip:  0.83 kB
ℹ dist/astro/routes/api/admin/byline-fields/index.mjs                             1.73 kB │ gzip:  0.67 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/restore.mjs                     1.72 kB │ gzip:  0.74 kB
ℹ dist/astro/routes/api/admin/comments/_id_.mjs                                   1.70 kB │ gzip:  0.66 kB
ℹ dist/astro/routes/api/search/suggest.mjs                                        1.68 kB │ gzip:  0.83 kB
ℹ dist/astro/routes/api/menus/index.mjs                                           1.66 kB │ gzip:  0.68 kB
ℹ dist/astro/routes/api/auth/magic-link/verify.mjs                                1.65 kB │ gzip:  0.72 kB
ℹ dist/astro/routes/api/revisions/_revisionId_/restore.mjs                        1.64 kB │ gzip:  0.70 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/translations.mjs                1.58 kB │ gzip:  0.77 kB
ℹ dist/astro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs               1.56 kB │ gzip:  0.76 kB
ℹ dist/astro/routes/api/manifest.mjs                                              1.56 kB │ gzip:  0.80 kB
ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/icon.mjs                   1.54 kB │ gzip:  0.75 kB
ℹ dist/astro/routes/api/admin/comments/index.mjs                                  1.48 kB │ gzip:  0.69 kB
ℹ dist/astro/routes/api/admin/comments/bulk.mjs                                   1.48 kB │ gzip:  0.67 kB
ℹ dist/astro/routes/api/redirects/404s/summary.mjs                                1.46 kB │ gzip:  0.67 kB
ℹ dist/astro/routes/api/admin/hooks/exclusive/index.mjs                           1.45 kB │ gzip:  0.73 kB
ℹ dist/astro/routes/api/menus/_name_/reorder.mjs                                  1.44 kB │ gzip:  0.67 kB
ℹ dist/astro/routes/api/menus/_name_/items.mjs                                    1.43 kB │ gzip:  0.67 kB
ℹ dist/astro/routes/api/import/probe.mjs                                          1.38 kB │ gzip:  0.67 kB
ℹ dist/astro/routes/api/well-known/auth.mjs                                       1.37 kB │ gzip:  0.66 kB
ℹ dist/astro/routes/api/oauth/device/authorize.mjs                                1.34 kB │ gzip:  0.69 kB
ℹ dist/astro/routes/api/auth/signup/verify.mjs                                    1.32 kB │ gzip:  0.71 kB
ℹ dist/runtime.mjs                                                                1.32 kB │ gzip:  0.64 kB
ℹ dist/astro/routes/api/auth/invite/accept.mjs                                    1.28 kB │ gzip:  0.68 kB
ℹ dist/astro/routes/api/admin/users/_id_/enable.mjs                               1.28 kB │ gzip:  0.67 kB
ℹ dist/astro/routes/api/admin/byline-fields/reorder.mjs                           1.24 kB │ gzip:  0.56 kB
ℹ dist/astro/routes/api/admin/api-tokens/_id_.mjs                                 1.24 kB │ gzip:  0.66 kB
ℹ dist/db/index.mjs                                                               1.22 kB │ gzip:  0.56 kB
ℹ dist/astro/routes/api/oauth/token/refresh.mjs                                   1.19 kB │ gzip:  0.62 kB
ℹ dist/astro/routes/api/well-known/oauth-authorization-server.mjs                 1.18 kB │ gzip:  0.58 kB
ℹ dist/media/index.mjs                                                            1.18 kB │ gzip:  0.59 kB
ℹ dist/astro/routes/api/content/_collection_/trash.mjs                            1.17 kB │ gzip:  0.58 kB
ℹ dist/astro/routes/api/oauth/token/revoke.mjs                                    1.14 kB │ gzip:  0.60 kB
ℹ dist/astro/routes/api/auth/passkey/index.mjs                                    1.07 kB │ gzip:  0.60 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/revisions.mjs                   1.04 kB │ gzip:  0.56 kB
ℹ dist/astro/routes/api/search/stats.mjs                                          1.03 kB │ gzip:  0.56 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/permanent.mjs                   1.02 kB │ gzip:  0.53 kB
ℹ dist/astro/routes/api/setup/dev-reset.mjs                                       1.01 kB │ gzip:  0.57 kB
ℹ dist/astro/routes/api/admin/byline-fields/_slug_/usage.mjs                      0.99 kB │ gzip:  0.51 kB
ℹ dist/astro/routes/api/dashboard.mjs                                             0.99 kB │ gzip:  0.53 kB
ℹ dist/astro/routes/api/import/wordpress-plugin/callback.mjs                      0.97 kB │ gzip:  0.53 kB
ℹ dist/astro/routes/api/admin/comments/counts.mjs                                 0.95 kB │ gzip:  0.50 kB
ℹ dist/astro/routes/api/auth/mode.mjs                                             0.94 kB │ gzip:  0.56 kB
ℹ dist/seed/index.mjs                                                             0.92 kB │ gzip:  0.42 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/compare.mjs                     0.84 kB │ gzip:  0.47 kB
ℹ dist/astro/routes/api/dev/emails.mjs                                            0.83 kB │ gzip:  0.41 kB
ℹ dist/astro/routes/api/auth/logout.mjs                                           0.81 kB │ gzip:  0.47 kB
ℹ dist/astro/routes/api/revisions/_revisionId_/index.mjs                          0.78 kB │ gzip:  0.45 kB
ℹ dist/astro/routes/api/media/providers/index.mjs                                 0.77 kB │ gzip:  0.45 kB
ℹ dist/astro/routes/api/well-known/oauth-protected-resource.mjs                   0.74 kB │ gzip:  0.46 kB
ℹ dist/astro/routes/PluginRegistry.mjs                                            0.73 kB │ gzip:  0.41 kB
ℹ dist/db/postgres.mjs                                                            0.69 kB │ gzip:  0.36 kB
ℹ dist/astro/routes/api/widget-components.mjs                                     0.61 kB │ gzip:  0.36 kB
ℹ dist/db/sqlite.mjs                                                              0.52 kB │ gzip:  0.32 kB
ℹ dist/auth/providers/github.mjs                                                  0.44 kB │ gzip:  0.29 kB
ℹ dist/auth/providers/google.mjs                                                  0.44 kB │ gzip:  0.29 kB
ℹ dist/db/libsql.mjs                                                              0.44 kB │ gzip:  0.28 kB
ℹ dist/astro/types.mjs                                                            0.01 kB │ gzip:  0.03 kB
ℹ dist/plugin-types.mjs                                                           0.01 kB │ gzip:  0.03 kB
ℹ dist/api-CYMbRBfh.mjs.map                                                     306.93 kB │ gzip: 66.70 kB
ℹ dist/cli/index.mjs.map                                                        291.41 kB │ gzip: 67.35 kB
ℹ dist/runner--4wMWwKM.mjs.map                                                  268.58 kB │ gzip: 50.03 kB
ℹ dist/astro/middleware.mjs.map                                                 238.66 kB │ gzip: 62.83 kB
ℹ dist/menus-BeM6cZbr.mjs.map                                                   194.34 kB │ gzip: 44.20 kB
ℹ dist/astro/routes/api/openapi.json.mjs.map                                    170.45 kB │ gzip: 23.58 kB
ℹ dist/api-CYMbRBfh.mjs                                                         145.09 kB │ gzip: 32.93 kB
ℹ dist/runner--4wMWwKM.mjs                                                      141.59 kB │ gzip: 26.50 kB
ℹ dist/astro/index.mjs.map                                                      141.06 kB │ gzip: 33.81 kB
ℹ dist/astro/routes/api/mcp.mjs.map                                             126.65 kB │ gzip: 24.52 kB
ℹ dist/import-Dh8bWmyq.mjs.map                                                  112.07 kB │ gzip: 25.69 kB
ℹ dist/redirects-C0L9JUk4.mjs.map                                                97.42 kB │ gzip: 16.62 kB
ℹ dist/menus-BeM6cZbr.mjs                                                        89.61 kB │ gzip: 20.90 kB
ℹ dist/byline-CgrE_Ryv.mjs.map                                                   78.05 kB │ gzip: 20.58 kB
ℹ dist/content-BUDtGVH9.mjs.map                                                  69.84 kB │ gzip: 15.90 kB
ℹ dist/context-CNmZ3Nda.mjs.map                                                  66.64 kB │ gzip: 15.80 kB
ℹ dist/apply-CX9AE40u.mjs.map                                                    65.82 kB │ gzip: 16.76 kB
ℹ dist/astro/routes/api/import/wordpress/execute.mjs.map                         59.52 kB │ gzip: 17.62 kB
ℹ dist/registry-D9s4iDbE.mjs.map                                                 54.83 kB │ gzip: 13.21 kB
ℹ dist/menus-0A34Oekk.mjs.map                                                    50.90 kB │ gzip: 12.05 kB
ℹ dist/loader-CjtldvSH.mjs.map                                                   49.36 kB │ gzip: 13.97 kB
ℹ dist/astro/middleware/request-context.mjs.map                                  49.16 kB │ gzip: 12.37 kB
ℹ dist/query-BaWRTEos.mjs.map                                                    49.09 kB │ gzip: 14.83 kB
ℹ dist/import-Dh8bWmyq.mjs                                                       48.70 kB │ gzip: 11.84 kB
ℹ dist/redirects-C0L9JUk4.mjs                                                    47.32 kB │ gzip:  9.55 kB
ℹ dist/astro/middleware/auth.mjs.map                                             44.81 kB │ gzip: 12.43 kB
ℹ dist/byline-CgrE_Ryv.mjs                                                       39.30 kB │ gzip: 10.76 kB
ℹ dist/index-nN0g71HX.d.mts.map                                                  37.37 kB │ gzip: 10.34 kB
ℹ dist/content-BUDtGVH9.mjs                                                      34.87 kB │ gzip:  8.41 kB
ℹ dist/validate-DK_97kMR.mjs.map                                                 34.77 kB │ gzip:  7.51 kB
ℹ dist/taxonomies-D3Li3jCd.mjs.map                                               34.53 kB │ gzip:  8.01 kB
ℹ dist/byline-registry-CxK5g559.mjs.map                                          33.30 kB │ gzip:  9.67 kB
ℹ dist/client/index.mjs.map                                                      33.25 kB │ gzip:  7.97 kB
ℹ dist/redirects-dNHo3LUJ.mjs.map                                                32.59 kB │ gzip:  8.18 kB
ℹ dist/apply-CX9AE40u.mjs                                                        32.53 kB │ gzip:  8.25 kB
ℹ dist/page/index.mjs.map                                                        31.02 kB │ gzip:  8.42 kB
ℹ dist/device-flow-ptLrVINd.mjs.map                                              29.83 kB │ gzip:  7.18 kB
ℹ dist/context-CNmZ3Nda.mjs                                                      28.49 kB │ gzip:  7.55 kB
ℹ dist/error-RwM4dD35.mjs.map                                                    27.57 kB │ gzip:  6.54 kB
ℹ dist/registry-D9s4iDbE.mjs                                                     27.45 kB │ gzip:  6.96 kB
ℹ dist/search-DYlf61Nt.mjs.map                                                   26.55 kB │ gzip:  8.21 kB
ℹ dist/redirect-BCeA5KRZ.mjs.map                                                 26.36 kB │ gzip:  6.98 kB
ℹ dist/transport--Ck3RBin.mjs.map                                                26.06 kB │ gzip:  7.48 kB
ℹ dist/taxonomies-CzsEHhdJ.mjs.map                                               25.78 kB │ gzip:  6.33 kB
ℹ dist/secrets-YYbTgB1w.mjs.map                                                  24.92 kB │ gzip:  8.49 kB
ℹ dist/fts-manager-1RgHmopc.mjs.map                                              24.82 kB │ gzip:  6.62 kB
ℹ dist/loader-CjtldvSH.mjs                                                       24.07 kB │ gzip:  7.25 kB
ℹ dist/query-BaWRTEos.mjs                                                        23.69 kB │ gzip:  7.71 kB
ℹ dist/ssrf-BsVGIE0Z.mjs.map                                                     23.59 kB │ gzip:  8.30 kB
ℹ dist/menus-0A34Oekk.mjs                                                        23.34 kB │ gzip:  5.93 kB
ℹ dist/astro/routes/api/oauth/authorize.mjs.map                                  22.43 kB │ gzip:  6.46 kB
ℹ dist/astro/routes/api/import/wordpress/analyze.mjs.map                         22.30 kB │ gzip:  6.90 kB
ℹ dist/taxonomy-CI9gGqcA.mjs.map                                                 21.42 kB │ gzip:  5.59 kB
ℹ dist/astro/routes/api/admin/plugins/registry/artifact.mjs.map                  20.68 kB │ gzip:  7.13 kB
ℹ dist/comment-C6lZcT98.mjs.map                                                  20.47 kB │ gzip:  4.87 kB
ℹ dist/astro/routes/api/snapshot.mjs.map                                         19.89 kB │ gzip:  6.77 kB
ℹ dist/sections-DQvNo_rn.mjs.map                                                 19.39 kB │ gzip:  4.78 kB
ℹ dist/byline-fields-Dr-xcb6S.mjs.map                                            19.35 kB │ gzip:  4.77 kB
ℹ dist/zod-generator-Djo_VHCt.mjs.map                                            18.73 kB │ gzip:  5.52 kB
ℹ dist/byline-registry-CxK5g559.mjs                                              18.31 kB │ gzip:  5.90 kB
ℹ dist/oauth-authorization-DvBAL75d.mjs.map                                      17.99 kB │ gzip:  4.89 kB
ℹ dist/error-RwM4dD35.mjs                                                        17.36 kB │ gzip:  4.23 kB
ℹ dist/types-jbkzJ1j_.d.mts.map                                                  16.99 kB │ gzip:  4.66 kB
ℹ dist/utils-C4Ih4DML.mjs.map                                                    16.93 kB │ gzip:  5.01 kB
ℹ dist/validate-DK_97kMR.mjs                                                     16.79 kB │ gzip:  3.79 kB
ℹ dist/cron-BJ2ClIlj.mjs.map                                                     16.70 kB │ gzip:  5.42 kB
ℹ dist/media-JOf3pNkw.mjs.map                                                    16.58 kB │ gzip:  4.99 kB
ℹ dist/astro/routes/api/import/wordpress-plugin/execute.mjs.map                  16.41 kB │ gzip:  5.34 kB
ℹ dist/redirects-dNHo3LUJ.mjs                                                    16.07 kB │ gzip:  4.26 kB
ℹ dist/bylines-BA5-5vIG.mjs.map                                                  16.00 kB │ gzip:  5.36 kB
ℹ dist/astro/routes/api/comments/_collection_/_contentId_/index.mjs.map          15.95 kB │ gzip:  4.89 kB
ℹ dist/settings-DOxkRlis.mjs.map                                                 15.73 kB │ gzip:  5.04 kB
ℹ dist/taxonomies-D3Li3jCd.mjs                                                   15.58 kB │ gzip:  3.77 kB
ℹ dist/oauth-clients-8mPDStMv.mjs.map                                            15.58 kB │ gzip:  3.61 kB
ℹ dist/storage/s3.mjs.map                                                        15.38 kB │ gzip:  5.03 kB
ℹ dist/taxonomies-CzsEHhdJ.mjs                                                   15.00 kB │ gzip:  3.88 kB
ℹ dist/device-flow-ptLrVINd.mjs                                                  14.86 kB │ gzip:  3.82 kB
ℹ dist/plugins/adapt-sandbox-entry.mjs.map                                       14.73 kB │ gzip:  5.14 kB
ℹ dist/service-CKhjL4RP.mjs.map                                                  14.62 kB │ gzip:  4.39 kB
ℹ dist/fts-manager-1RgHmopc.mjs                                                  13.79 kB │ gzip:  3.92 kB
ℹ dist/secrets-YYbTgB1w.mjs                                                      13.77 kB │ gzip:  5.15 kB
ℹ dist/comments-CVWNAwU6.mjs.map                                                 13.34 kB │ gzip:  3.37 kB
ℹ dist/search-DYlf61Nt.mjs                                                       13.23 kB │ gzip:  4.32 kB
ℹ dist/bylines-CDkunS1W.mjs.map                                                  13.07 kB │ gzip:  4.32 kB
ℹ dist/types-D8bhH891.mjs.map                                                    12.80 kB │ gzip:  3.79 kB
ℹ dist/ssrf-BsVGIE0Z.mjs                                                         12.75 kB │ gzip:  5.03 kB
ℹ dist/astro/routes/api/import/wordpress/media.mjs.map                           12.71 kB │ gzip:  3.84 kB
ℹ dist/manifest-schema-Cj-YrzrF.mjs.map                                          12.21 kB │ gzip:  3.36 kB
ℹ dist/redirect-BCeA5KRZ.mjs                                                     12.07 kB │ gzip:  3.71 kB
ℹ dist/transport--Ck3RBin.mjs                                                    12.05 kB │ gzip:  3.86 kB
ℹ dist/astro/routes/api/import/wordpress/rewrite-urls.mjs.map                    11.45 kB │ gzip:  3.70 kB
ℹ dist/astro/routes/api/auth/oauth/_provider_/callback.mjs.map                   11.29 kB │ gzip:  3.77 kB
ℹ dist/storage/local.mjs.map                                                     11.26 kB │ gzip:  3.76 kB
ℹ dist/validation-ClE2ybVZ.mjs.map                                               11.09 kB │ gzip:  4.18 kB
ℹ dist/taxonomy-CI9gGqcA.mjs                                                     10.92 kB │ gzip:  3.06 kB
ℹ dist/user-BiaLC_X-.mjs.map                                                     10.46 kB │ gzip:  3.27 kB
ℹ dist/byline-fields-Dr-xcb6S.mjs                                                10.44 kB │ gzip:  3.04 kB
ℹ dist/astro/routes/api/content/_collection_/_id_.mjs.map                        10.35 kB │ gzip:  2.77 kB
ℹ dist/astro/routes/api/media.mjs.map                                            10.31 kB │ gzip:  3.58 kB
ℹ dist/tokens-Bx2afeT-.mjs.map                                                   10.30 kB │ gzip:  3.28 kB
ℹ dist/astro/routes/sitemap-_collection_.xml.mjs.map                             10.23 kB │ gzip:  3.64 kB
ℹ dist/astro/routes/api/oauth/token.mjs.map                                      10.07 kB │ gzip:  3.04 kB
ℹ dist/normalize-DVV8nbrL.mjs.map                                                10.06 kB │ gzip:  3.02 kB
ℹ dist/types-BXSUSAjt.mjs.map                                                     9.98 kB │ gzip:  3.78 kB
ℹ dist/sections-DQvNo_rn.mjs                                                      9.34 kB │ gzip:  2.47 kB
ℹ dist/seo-Bt03PZdi.mjs.map                                                       9.19 kB │ gzip:  3.06 kB
ℹ dist/comment-C6lZcT98.mjs                                                       9.18 kB │ gzip:  2.50 kB
ℹ dist/resolve-BqYMVG0D.mjs.map                                                   9.12 kB │ gzip:  3.20 kB
ℹ dist/astro/routes/api/import/wordpress/rewrite-url-helpers.mjs.map              9.07 kB │ gzip:  3.12 kB
ℹ dist/cron-BJ2ClIlj.mjs                                                          9.00 kB │ gzip:  3.22 kB
ℹ dist/byline-fields-DC3Wkk-U.mjs.map                                             8.96 kB │ gzip:  2.15 kB
ℹ dist/patterns-CqG5Ya3i.mjs.map                                                  8.92 kB │ gzip:  3.02 kB
ℹ dist/client/cf-access.mjs.map                                                   8.87 kB │ gzip:  3.14 kB
ℹ dist/byline-fields-CSxsd9Dv.d.mts.map                                           8.85 kB │ gzip:  1.54 kB
ℹ dist/media/index.mjs.map                                                        8.84 kB │ gzip:  2.92 kB
ℹ dist/astro/routes/api/import/wordpress/prepare.mjs.map                          8.65 kB │ gzip:  3.13 kB
ℹ dist/oauth-authorization-DvBAL75d.mjs                                           8.64 kB │ gzip:  2.58 kB
ℹ dist/astro/routes/api/setup/dev-bypass.mjs.map                                  8.60 kB │ gzip:  3.24 kB
ℹ dist/api-tokens-VrXNiNvV.mjs.map                                                8.50 kB │ gzip:  2.44 kB
ℹ dist/media/local-runtime.mjs.map                                                8.45 kB │ gzip:  2.58 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs.map        8.42 kB │ gzip:  2.72 kB
ℹ dist/astro/routes/api/oauth/register.mjs.map                                    8.19 kB │ gzip:  2.94 kB
ℹ dist/dialect-helpers-DRI5pyY3.mjs.map                                           8.19 kB │ gzip:  2.27 kB
ℹ dist/allowed-origins-CyYLEJkp.mjs.map                                           8.19 kB │ gzip:  3.02 kB
ℹ dist/request-meta-7ByVLxB-.mjs.map                                              8.19 kB │ gzip:  3.15 kB
ℹ dist/zod-generator-Djo_VHCt.mjs                                                 8.17 kB │ gzip:  2.45 kB
ℹ dist/utils-C4Ih4DML.mjs                                                         8.16 kB │ gzip:  2.90 kB
ℹ dist/rate-limit-ClFFUga6.mjs.map                                                8.07 kB │ gzip:  3.40 kB
ℹ dist/placeholder-BZxr8W1j.mjs.map                                               7.97 kB │ gzip:  2.92 kB
ℹ dist/settings-DOxkRlis.mjs                                                      7.86 kB │ gzip:  2.65 kB
ℹ dist/dashboard-Bavjdlk0.mjs.map                                                 7.78 kB │ gzip:  2.87 kB
ℹ dist/options-BL4X94qY.mjs.map                                                   7.78 kB │ gzip:  2.31 kB
ℹ dist/seo/index.mjs.map                                                          7.67 kB │ gzip:  2.77 kB
ℹ dist/astro/routes/api/admin/users/_id_/index.mjs.map                            7.59 kB │ gzip:  2.39 kB
ℹ dist/oauth-clients-8mPDStMv.mjs                                                 7.56 kB │ gzip:  1.83 kB
ℹ dist/media-JOf3pNkw.mjs                                                         7.41 kB │ gzip:  2.50 kB
ℹ dist/bylines-BA5-5vIG.mjs                                                       6.72 kB │ gzip:  2.54 kB
ℹ dist/manifest-schema-Cj-YrzrF.mjs                                               6.66 kB │ gzip:  2.24 kB
ℹ dist/bylines-CDkunS1W.mjs                                                       6.54 kB │ gzip:  2.24 kB
ℹ dist/astro/routes/api/widget-areas/_name_/widgets/_id_.mjs.map                  6.52 kB │ gzip:  1.77 kB
ℹ dist/seo-DfjLvu8i.mjs.map                                                       6.47 kB │ gzip:  2.62 kB
ℹ dist/astro/routes/api/settings/email.mjs.map                                    6.47 kB │ gzip:  2.40 kB
ℹ dist/widgets-5Bpf86nz.mjs.map                                                   6.46 kB │ gzip:  2.29 kB
ℹ dist/astro/routes/api/plugins/_pluginId_/_...path_.mjs.map                      6.43 kB │ gzip:  2.62 kB
ℹ dist/types-OT_Es5mp.d.mts.map                                                   6.37 kB │ gzip:  1.09 kB
ℹ dist/astro/routes/api/setup/admin-verify.mjs.map                                6.33 kB │ gzip:  2.31 kB
ℹ dist/astro/routes/api/media/_id_.mjs.map                                        6.28 kB │ gzip:  1.75 kB
ℹ dist/astro/routes/api/media/upload-url.mjs.map                                  6.24 kB │ gzip:  2.44 kB
ℹ dist/request-cache-BYMs-BGX.mjs.map                                             6.23 kB │ gzip:  2.42 kB
ℹ dist/astro/routes/api/setup/admin.mjs.map                                       6.21 kB │ gzip:  2.51 kB
ℹ dist/service-CKhjL4RP.mjs                                                       6.21 kB │ gzip:  2.19 kB
ℹ dist/astro/routes/api/setup/index.mjs.map                                       6.16 kB │ gzip:  2.40 kB
ℹ dist/astro/routes/api/auth/oauth/_provider_.mjs.map                             6.14 kB │ gzip:  2.26 kB
ℹ dist/public-url-egRHCy1m.mjs.map                                                5.92 kB │ gzip:  2.40 kB
ℹ dist/astro/routes/api/auth/passkey/register/verify.mjs.map                      5.90 kB │ gzip:  2.22 kB
ℹ dist/validate-VPnKoIzW.mjs.map                                                  5.90 kB │ gzip:  1.70 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/preview-url.mjs.map             5.90 kB │ gzip:  2.39 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/schedule.mjs.map                5.82 kB │ gzip:  1.68 kB
ℹ dist/astro/middleware/redirect.mjs.map                                          5.82 kB │ gzip:  2.33 kB
ℹ dist/astro/routes/api/admin/comments/_id_/status.mjs.map                        5.69 kB │ gzip:  2.00 kB
ℹ dist/resolve-BqYMVG0D.mjs                                                       5.63 kB │ gzip:  2.12 kB
ℹ dist/validation-ClE2ybVZ.mjs                                                    5.61 kB │ gzip:  2.25 kB
ℹ dist/astro/routes/api/auth/dev-bypass.mjs.map                                   5.58 kB │ gzip:  2.30 kB
ℹ dist/astro/routes/api/admin/plugins/registry/install.mjs.map                    5.56 kB │ gzip:  2.38 kB
ℹ dist/astro/routes/api/media/providers/_providerId_/index.mjs.map                5.54 kB │ gzip:  1.81 kB
ℹ dist/comments-CVWNAwU6.mjs                                                      5.49 kB │ gzip:  1.74 kB
ℹ dist/preview-BfuRkVKW.mjs.map                                                   5.44 kB │ gzip:  1.93 kB
ℹ dist/parse-CrGndy1A.mjs.map                                                     5.35 kB │ gzip:  1.94 kB
ℹ dist/allowed-origins-CyYLEJkp.mjs                                               5.31 kB │ gzip:  2.05 kB
ℹ dist/types-DpFmlNyB.mjs.map                                                     5.27 kB │ gzip:  1.85 kB
ℹ dist/astro/routes/api/admin/bylines/_id_/translations.mjs.map                   5.21 kB │ gzip:  1.88 kB
ℹ dist/seo-Bt03PZdi.mjs                                                           5.12 kB │ gzip:  1.82 kB
ℹ dist/astro/routes/api/setup/status.mjs.map                                      5.09 kB │ gzip:  1.96 kB
ℹ dist/patterns-CqG5Ya3i.mjs                                                      5.05 kB │ gzip:  1.85 kB
ℹ dist/astro/routes/api/content/_collection_/index.mjs.map                        4.98 kB │ gzip:  1.84 kB
ℹ dist/client/index.d.mts.map                                                     4.98 kB │ gzip:  1.43 kB
ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_/translations.mjs.map       4.98 kB │ gzip:  1.50 kB
ℹ dist/astro/routes/api/auth/passkey/_id_.mjs.map                                 4.95 kB │ gzip:  1.56 kB
ℹ dist/tokens-Bx2afeT-.mjs                                                        4.94 kB │ gzip:  1.73 kB
ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_.mjs.map                    4.92 kB │ gzip:  1.17 kB
ℹ dist/astro/routes/api/typegen.mjs.map                                           4.90 kB │ gzip:  1.79 kB
ℹ dist/request-context.mjs.map                                                    4.88 kB │ gzip:  2.14 kB
ℹ dist/normalize-DVV8nbrL.mjs                                                     4.86 kB │ gzip:  1.48 kB
ℹ dist/astro/routes/api/admin/allowed-domains/_domain_.mjs.map                    4.84 kB │ gzip:  1.49 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/publish.mjs.map                 4.76 kB │ gzip:  1.89 kB
ℹ dist/astro/routes/api/admin/oauth-clients/_id_.mjs.map                          4.75 kB │ gzip:  1.34 kB
ℹ dist/astro/routes/api/import/wordpress-plugin/analyze.mjs.map                   4.74 kB │ gzip:  1.92 kB
ℹ dist/user-BiaLC_X-.mjs                                                          4.74 kB │ gzip:  1.69 kB
ℹ dist/astro/routes/api/admin/byline-fields/_slug_.mjs.map                        4.70 kB │ gzip:  1.46 kB
ℹ dist/database/instrumentation.mjs.map                                           4.63 kB │ gzip:  2.02 kB
ℹ dist/astro/routes/api/admin/allowed-domains/index.mjs.map                       4.61 kB │ gzip:  1.60 kB
ℹ dist/request-meta-7ByVLxB-.mjs                                                  4.58 kB │ gzip:  1.93 kB
ℹ dist/astro/routes/api/admin/bylines/_id_/index.mjs.map                          4.54 kB │ gzip:  1.61 kB
ℹ dist/astro/routes/api/schema/index.mjs.map                                      4.52 kB │ gzip:  1.76 kB
ℹ dist/astro/routes/api/menus/_name_/translations.mjs.map                         4.49 kB │ gzip:  1.48 kB
ℹ dist/plugin-utils.mjs.map                                                       4.46 kB │ gzip:  1.89 kB
ℹ dist/astro/routes/api/auth/signup/request.mjs.map                               4.45 kB │ gzip:  1.92 kB
ℹ dist/rate-limit-ClFFUga6.mjs                                                    4.43 kB │ gzip:  2.06 kB
ℹ dist/astro/types.d.mts.map                                                      4.43 kB │ gzip:  1.23 kB
ℹ dist/trusted-proxy-B4AfnoAp.mjs.map                                             4.43 kB │ gzip:  1.96 kB
ℹ dist/astro/routes/api/auth/magic-link/send.mjs.map                              4.40 kB │ gzip:  1.78 kB
ℹ dist/astro/routes/api/widget-areas/index.mjs.map                                4.39 kB │ gzip:  1.57 kB
ℹ dist/placeholder-BZxr8W1j.mjs                                                   4.39 kB │ gzip:  1.77 kB
ℹ dist/validate-VPnKoIzW.mjs                                                      4.35 kB │ gzip:  1.32 kB
ℹ dist/astro/routes/api/auth/signup/complete.mjs.map                              4.33 kB │ gzip:  1.74 kB
ℹ dist/base64-CqR-7kqF.mjs.map                                                    4.31 kB │ gzip:  1.41 kB
ℹ dist/astro/routes/api/auth/passkey/options.mjs.map                              4.30 kB │ gzip:  1.76 kB
ℹ dist/astro/routes/api/media/_id_/confirm.mjs.map                                4.30 kB │ gzip:  1.76 kB
ℹ dist/astro/routes/api/auth/invite/complete.mjs.map                              4.29 kB │ gzip:  1.72 kB
ℹ dist/astro/routes/api/themes/preview.mjs.map                                    4.25 kB │ gzip:  1.80 kB
ℹ dist/astro/routes/api/auth/invite/index.mjs.map                                 4.23 kB │ gzip:  1.83 kB
ℹ dist/astro/routes/api/admin/hooks/exclusive/_hookName_.mjs.map                  4.20 kB │ gzip:  1.71 kB
ℹ dist/astro/routes/api/auth/passkey/register/options.mjs.map                     4.18 kB │ gzip:  1.69 kB
ℹ dist/oauth-state-store-BJ7YtrfD.mjs.map                                         4.17 kB │ gzip:  1.51 kB
ℹ dist/astro/routes/api/redirects/_id_.mjs.map                                    4.17 kB │ gzip:  1.10 kB
ℹ dist/astro/routes/api/admin/plugins/registry/_id_/update.mjs.map                4.09 kB │ gzip:  1.70 kB
ℹ dist/astro/routes/api/auth/invite/register-options.mjs.map                      4.09 kB │ gzip:  1.75 kB
ℹ dist/astro/routes/api/admin/bylines/index.mjs.map                               4.08 kB │ gzip:  1.48 kB
ℹ dist/astro/middleware/setup.mjs.map                                             4.08 kB │ gzip:  1.67 kB
ℹ dist/astro/routes/sitemap.xml.mjs.map                                           4.05 kB │ gzip:  1.66 kB
ℹ dist/astro/routes/api/manifest.mjs.map                                          4.04 kB │ gzip:  1.84 kB
ℹ dist/astro/routes/api/sections/_slug_.mjs.map                                   3.99 kB │ gzip:  1.04 kB
ℹ dist/api-tokens-VrXNiNvV.mjs                                                    3.95 kB │ gzip:  1.26 kB
ℹ dist/astro/routes/api/media/providers/_providerId_/_itemId_.mjs.map             3.95 kB │ gzip:  1.20 kB
ℹ dist/astro/routes/api/widget-areas/_name_.mjs.map                               3.86 kB │ gzip:  1.25 kB
ℹ dist/astro/routes/api/schema/collections/_slug_/index.mjs.map                   3.83 kB │ gzip:  1.15 kB
ℹ dist/astro/routes/api/menus/_name_.mjs.map                                      3.79 kB │ gzip:  1.00 kB
ℹ dist/db/index.mjs.map                                                           3.77 kB │ gzip:  1.42 kB
ℹ dist/byline-fields-DC3Wkk-U.mjs                                                 3.74 kB │ gzip:  0.97 kB
ℹ dist/astro/routes/api/widget-areas/_name_/widgets.mjs.map                       3.74 kB │ gzip:  1.48 kB
ℹ dist/options-BL4X94qY.mjs                                                       3.69 kB │ gzip:  1.26 kB
ℹ dist/astro/routes/api/redirects/404s/index.mjs.map                              3.64 kB │ gzip:  1.07 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/duplicate.mjs.map               3.62 kB │ gzip:  1.48 kB
ℹ dist/astro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs.map      3.60 kB │ gzip:  1.01 kB
ℹ dist/astro/routes/api/admin/plugins/updates.mjs.map                             3.56 kB │ gzip:  1.51 kB
ℹ dist/cache-CsmSDivr.mjs.map                                                     3.54 kB │ gzip:  1.44 kB
ℹ dist/astro/routes/api/auth/passkey/verify.mjs.map                               3.54 kB │ gzip:  1.42 kB
ℹ dist/dashboard-Bavjdlk0.mjs                                                     3.54 kB │ gzip:  1.51 kB
ℹ dist/request-cache-BYMs-BGX.mjs                                                 3.53 kB │ gzip:  1.51 kB
ℹ dist/mime-CCEzze7W.mjs.map                                                      3.52 kB │ gzip:  1.48 kB
ℹ dist/astro/routes/api/oauth/device/token.mjs.map                                3.50 kB │ gzip:  1.56 kB
ℹ dist/components-CTfpu3PZ.mjs.map                                                3.46 kB │ gzip:  0.99 kB
ℹ dist/challenge-store-DGwuCc4R.mjs.map                                           3.43 kB │ gzip:  1.34 kB
ℹ dist/astro/routes/api/admin/users/_id_/disable.mjs.map                          3.43 kB │ gzip:  1.49 kB
ℹ dist/astro/routes/api/admin/byline-fields/index.mjs.map                         3.38 kB │ gzip:  1.34 kB
ℹ dist/public-url-egRHCy1m.mjs                                                    3.37 kB │ gzip:  1.50 kB
ℹ dist/types-DWnN7weG.d.mts.map                                                   3.35 kB │ gzip:  1.20 kB
ℹ dist/astro/routes/api/menus/_name_/items/_id_.mjs.map                           3.34 kB │ gzip:  1.04 kB
ℹ dist/astro/routes/api/taxonomies/_name_/terms/index.mjs.map                     3.33 kB │ gzip:  1.16 kB
ℹ dist/astro/routes/api/media/file/_...key_.mjs.map                               3.33 kB │ gzip:  1.52 kB
ℹ dist/dialect-helpers-DRI5pyY3.mjs                                               3.33 kB │ gzip:  1.12 kB
ℹ dist/astro/routes/api/admin/oauth-clients/index.mjs.map                         3.32 kB │ gzip:  1.25 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/discard-draft.mjs.map           3.31 kB │ gzip:  1.36 kB
ℹ dist/astro/routes/robots.txt.mjs.map                                            3.28 kB │ gzip:  1.34 kB
ℹ dist/astro/routes/api/admin/users/_id_/send-recovery.mjs.map                    3.27 kB │ gzip:  1.44 kB
ℹ dist/widgets-5Bpf86nz.mjs                                                       3.27 kB │ gzip:  1.22 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/restore.mjs.map                 3.25 kB │ gzip:  1.34 kB
ℹ dist/db-errors-CtzxKBxe.mjs.map                                                 3.25 kB │ gzip:  1.28 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/unpublish.mjs.map               3.24 kB │ gzip:  1.32 kB
ℹ dist/email-console-DHT2Fbpj.mjs.map                                             3.23 kB │ gzip:  1.54 kB
ℹ dist/types-BXSUSAjt.mjs                                                         3.22 kB │ gzip:  1.41 kB
ℹ dist/astro/routes/api/auth/magic-link/verify.mjs.map                            3.18 kB │ gzip:  1.34 kB
ℹ dist/validate-c7q7DID3.d.mts.map                                                3.17 kB │ gzip:  0.98 kB
ℹ dist/astro/routes/api/widget-areas/_name_/reorder.mjs.map                       3.16 kB │ gzip:  1.32 kB
ℹ dist/astro/routes/api/admin/api-tokens/index.mjs.map                            3.11 kB │ gzip:  1.21 kB
ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/install.mjs.map            3.10 kB │ gzip:  1.31 kB
ℹ dist/mode-BjlXswIw.mjs.map                                                      3.04 kB │ gzip:  1.13 kB
ℹ dist/astro/routes/api/auth/me.mjs.map                                           3.04 kB │ gzip:  1.31 kB
ℹ dist/astro/routes/api/search/rebuild.mjs.map                                    3.02 kB │ gzip:  1.23 kB
ℹ dist/astro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs.map           2.97 kB │ gzip:  1.31 kB
ℹ dist/astro/routes/api/revisions/_revisionId_/restore.mjs.map                    2.94 kB │ gzip:  1.17 kB
ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/icon.mjs.map               2.94 kB │ gzip:  1.30 kB
ℹ dist/astro/routes/api/admin/users/index.mjs.map                                 2.94 kB │ gzip:  1.30 kB
ℹ dist/runtime.mjs.map                                                            2.91 kB │ gzip:  1.25 kB
ℹ dist/astro/routes/api/settings.mjs.map                                          2.89 kB │ gzip:  1.06 kB
ℹ dist/astro/routes/api/taxonomies/index.mjs.map                                  2.89 kB │ gzip:  1.02 kB
ℹ dist/types-D8bhH891.mjs                                                         2.88 kB │ gzip:  1.33 kB
ℹ dist/astro/routes/api/redirects/index.mjs.map                                   2.86 kB │ gzip:  1.00 kB
ℹ dist/preview-BfuRkVKW.mjs                                                       2.85 kB │ gzip:  1.02 kB
ℹ dist/parse-CrGndy1A.mjs                                                         2.83 kB │ gzip:  1.15 kB
ℹ dist/default-xLFNSsZ9.mjs.map                                                   2.82 kB │ gzip:  0.81 kB
ℹ dist/passkey-config-BDVM86Tj.mjs.map                                            2.81 kB │ gzip:  1.25 kB
ℹ dist/astro/routes/api/search/index.mjs.map                                      2.78 kB │ gzip:  1.33 kB
ℹ dist/astro/routes/api/well-known/auth.mjs.map                                   2.75 kB │ gzip:  1.22 kB
ℹ dist/astro/routes/api/oauth/device/code.mjs.map                                 2.74 kB │ gzip:  1.27 kB
ℹ dist/astro/routes/api/sections/index.mjs.map                                    2.71 kB │ gzip:  0.96 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/update.mjs.map                         2.71 kB │ gzip:  1.12 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/translations.mjs.map            2.70 kB │ gzip:  1.28 kB
ℹ dist/astro/routes/api/admin/comments/_id_.mjs.map                               2.68 kB │ gzip:  0.92 kB
ℹ dist/astro/routes/api/search/enable.mjs.map                                     2.65 kB │ gzip:  1.12 kB
ℹ dist/seo-DfjLvu8i.mjs                                                           2.59 kB │ gzip:  1.21 kB
ℹ dist/astro/routes/api/import/wordpress-plugin/callback.mjs.map                  2.55 kB │ gzip:  1.19 kB
ℹ dist/placeholder-B9lUUEmj.d.mts.map                                             2.50 kB │ gzip:  0.92 kB
ℹ dist/astro/routes/api/menus/index.mjs.map                                       2.48 kB │ gzip:  0.97 kB
ℹ dist/config-CVssduLe.mjs.map                                                    2.48 kB │ gzip:  1.09 kB
ℹ dist/astro/routes/api/admin/themes/marketplace/index.mjs.map                    2.44 kB │ gzip:  1.06 kB
ℹ dist/schema-CPHAoECW.mjs.map                                                    2.44 kB │ gzip:  1.04 kB
ℹ dist/base64-CqR-7kqF.mjs                                                        2.44 kB │ gzip:  0.92 kB
ℹ dist/astro/routes/api/schema/collections/index.mjs.map                          2.42 kB │ gzip:  0.89 kB
ℹ dist/astro/routes/api/schema/collections/_slug_/fields/index.mjs.map            2.41 kB │ gzip:  0.83 kB
ℹ dist/astro/routes/api/admin/plugins/registry/_id_/uninstall.mjs.map             2.39 kB │ gzip:  1.08 kB
ℹ dist/index-BpYeJO1E.d.mts.map                                                   2.36 kB │ gzip:  0.80 kB
ℹ dist/astro/routes/api/admin/hooks/exclusive/index.mjs.map                       2.33 kB │ gzip:  1.11 kB
ℹ dist/transaction-NQj4VJ7Z.mjs.map                                               2.32 kB │ gzip:  1.10 kB
ℹ dist/astro/routes/api/auth/signup/verify.mjs.map                                2.29 kB │ gzip:  1.13 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/enable.mjs.map                         2.28 kB │ gzip:  1.05 kB
ℹ dist/astro/routes/api/auth/mode.mjs.map                                         2.27 kB │ gzip:  1.13 kB
ℹ dist/authorize-C_8t2KGa.mjs.map                                                 2.24 kB │ gzip:  0.85 kB
ℹ dist/astro/routes/api/auth/invite/accept.mjs.map                                2.22 kB │ gzip:  1.09 kB
ℹ dist/astro/routes/api/well-known/oauth-authorization-server.mjs.map             2.21 kB │ gzip:  0.97 kB
ℹ dist/options-xfkUPCKd.d.mts.map                                                 2.19 kB │ gzip:  0.83 kB
ℹ dist/astro/routes/api/search/suggest.mjs.map                                    2.19 kB │ gzip:  1.06 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/uninstall.mjs.map                      2.18 kB │ gzip:  0.98 kB
ℹ dist/hash-9w3pd3-m.mjs.map                                                      2.18 kB │ gzip:  1.05 kB
ℹ dist/astro/routes/api/auth/passkey/index.mjs.map                                2.11 kB │ gzip:  1.03 kB
ℹ dist/db-errors-CtzxKBxe.mjs                                                     2.10 kB │ gzip:  0.89 kB
ℹ dist/setup-complete-VoEZfasi.mjs.map                                            2.08 kB │ gzip:  0.91 kB
ℹ dist/astro/routes/api/oauth/device/authorize.mjs.map                            2.06 kB │ gzip:  1.00 kB
ℹ dist/slugify-Cjh1ssOZ.mjs.map                                                   2.04 kB │ gzip:  1.01 kB
ℹ dist/astro/routes/api/admin/comments/index.mjs.map                              2.01 kB │ gzip:  0.90 kB
ℹ dist/trusted-proxy-B4AfnoAp.mjs                                                 1.99 kB │ gzip:  0.97 kB
ℹ dist/astro/routes/api/admin/users/_id_/enable.mjs.map                           1.99 kB │ gzip:  0.94 kB
ℹ dist/components-CTfpu3PZ.mjs                                                    1.99 kB │ gzip:  0.71 kB
ℹ dist/astro/routes/api/admin/comments/bulk.mjs.map                               1.98 kB │ gzip:  0.88 kB
ℹ dist/cache-CsmSDivr.mjs                                                         1.97 kB │ gzip:  0.80 kB
ℹ dist/astro/routes/api/admin/plugins/marketplace/index.mjs.map                   1.91 kB │ gzip:  0.86 kB
ℹ dist/settings-CDB3cLbV.mjs.map                                                  1.91 kB │ gzip:  0.71 kB
ℹ dist/astro/routes/api/menus/_name_/reorder.mjs.map                              1.88 kB │ gzip:  0.86 kB
ℹ dist/astro/routes/api/menus/_name_/items.mjs.map                                1.87 kB │ gzip:  0.86 kB
ℹ dist/astro/routes/api/import/probe.mjs.map                                      1.84 kB │ gzip:  0.87 kB
ℹ dist/astro/routes/api/admin/byline-fields/reorder.mjs.map                       1.82 kB │ gzip:  0.87 kB
ℹ dist/oauth-state-store-BJ7YtrfD.mjs                                             1.79 kB │ gzip:  0.72 kB
ℹ dist/media-allowlist-CMcoYIjQ.mjs.map                                           1.77 kB │ gzip:  0.94 kB
ℹ dist/astro/routes/api/setup/dev-reset.mjs.map                                   1.77 kB │ gzip:  0.89 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/disable.mjs.map                        1.77 kB │ gzip:  0.82 kB
ℹ dist/astro/routes/api/schema/orphans/_slug_.mjs.map                             1.77 kB │ gzip:  0.81 kB
ℹ dist/page/index.d.mts.map                                                       1.75 kB │ gzip:  0.67 kB
ℹ dist/types-DbCWhHet.d.mts.map                                                   1.74 kB │ gzip:  0.52 kB
ℹ dist/astro/routes/api/oauth/token/refresh.mjs.map                               1.72 kB │ gzip:  0.87 kB
ℹ dist/astro/routes/api/admin/byline-fields/_slug_/usage.mjs.map                  1.69 kB │ gzip:  0.87 kB
ℹ dist/astro/routes/api/admin/api-tokens/_id_.mjs.map                             1.68 kB │ gzip:  0.85 kB
ℹ dist/astro/routes/api/redirects/404s/summary.mjs.map                            1.68 kB │ gzip:  0.79 kB
ℹ dist/astro/routes/api/oauth/token/revoke.mjs.map                                1.68 kB │ gzip:  0.87 kB
ℹ dist/email-console-DHT2Fbpj.mjs                                                 1.67 kB │ gzip:  0.86 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/revisions.mjs.map               1.67 kB │ gzip:  0.84 kB
ℹ dist/astro/routes/api/well-known/oauth-protected-resource.mjs.map               1.64 kB │ gzip:  0.85 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/permanent.mjs.map               1.62 kB │ gzip:  0.79 kB
ℹ dist/astro/routes/api/schema/collections/_slug_/fields/reorder.mjs.map          1.60 kB │ gzip:  0.72 kB
ℹ dist/challenge-store-DGwuCc4R.mjs                                               1.59 kB │ gzip:  0.68 kB
ℹ dist/passkey-config-BDVM86Tj.mjs                                                1.56 kB │ gzip:  0.74 kB
ℹ dist/astro/routes/api/content/_collection_/trash.mjs.map                        1.55 kB │ gzip:  0.77 kB
ℹ dist/api/route-utils.mjs.map                                                    1.54 kB │ gzip:  0.70 kB
ℹ dist/types-kwqCOUxj.d.mts.map                                                   1.53 kB │ gzip:  0.67 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/index.mjs.map                          1.48 kB │ gzip:  0.74 kB
ℹ dist/types-i8_uzhMD.d.mts.map                                                   1.48 kB │ gzip:  0.53 kB
ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/index.mjs.map              1.45 kB │ gzip:  0.72 kB
ℹ dist/astro/routes/api/auth/logout.mjs.map                                       1.44 kB │ gzip:  0.77 kB
ℹ dist/astro/routes/api/admin/themes/marketplace/_id_/index.mjs.map               1.43 kB │ gzip:  0.72 kB
ℹ dist/astro/routes/api/dev/emails.mjs.map                                        1.43 kB │ gzip:  0.63 kB
ℹ dist/oauth-user-lookup-BdDSDvjF.mjs.map                                         1.41 kB │ gzip:  0.76 kB
ℹ dist/default-xLFNSsZ9.mjs                                                       1.35 kB │ gzip:  0.50 kB
ℹ dist/astro/routes/api/dashboard.mjs.map                                         1.34 kB │ gzip:  0.71 kB
ℹ dist/slugify-Cjh1ssOZ.mjs                                                       1.31 kB │ gzip:  0.71 kB
ℹ dist/plugin-types.d.mts.map                                                     1.31 kB │ gzip:  0.48 kB
ℹ dist/site-url-Cm8-sJy7.mjs.map                                                  1.30 kB │ gzip:  0.73 kB
ℹ dist/astro/routes/api/admin/comments/counts.mjs.map                             1.30 kB │ gzip:  0.65 kB
ℹ dist/astro/routes/api/search/stats.mjs.map                                      1.29 kB │ gzip:  0.69 kB
ℹ dist/astro/routes/api/revisions/_revisionId_/index.mjs.map                      1.29 kB │ gzip:  0.68 kB
ℹ dist/load-B84ohfBk.mjs.map                                                      1.28 kB │ gzip:  0.64 kB
ℹ dist/mime-CCEzze7W.mjs                                                          1.28 kB │ gzip:  0.64 kB
ℹ dist/authorize-C_8t2KGa.mjs                                                     1.28 kB │ gzip:  0.52 kB
ℹ dist/astro/routes/api/admin/plugins/index.mjs.map                               1.27 kB │ gzip:  0.67 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/compare.mjs.map                 1.25 kB │ gzip:  0.67 kB
ℹ dist/config-CVssduLe.mjs                                                        1.23 kB │ gzip:  0.58 kB
ℹ dist/media-allowlist-CMcoYIjQ.mjs                                               1.21 kB │ gzip:  0.70 kB
ℹ dist/hash-9w3pd3-m.mjs                                                          1.21 kB │ gzip:  0.66 kB
ℹ dist/schema-CPHAoECW.mjs                                                        1.20 kB │ gzip:  0.59 kB
ℹ dist/astro/routes/api/media/providers/index.mjs.map                             1.16 kB │ gzip:  0.62 kB
ℹ dist/settings-CDB3cLbV.mjs                                                      1.16 kB │ gzip:  0.48 kB
ℹ dist/astro/routes/PluginRegistry.mjs.map                                        1.15 kB │ gzip:  0.57 kB
ℹ dist/db/postgres.mjs.map                                                        1.14 kB │ gzip:  0.53 kB
ℹ dist/astro/routes/api/schema/orphans/index.mjs.map                              1.14 kB │ gzip:  0.57 kB
ℹ dist/setup-complete-VoEZfasi.mjs                                                1.12 kB │ gzip:  0.51 kB
ℹ dist/setup-nonce-Bm0uKqmf.mjs.map                                               1.10 kB │ gzip:  0.63 kB
ℹ dist/astro/routes/api/import/wordpress/execute.d.mts.map                        1.09 kB │ gzip:  0.53 kB
ℹ dist/setup-nonce-Bm0uKqmf.mjs                                                   1.02 kB │ gzip:  0.58 kB
ℹ dist/astro/routes/api/import/wordpress/analyze.d.mts.map                        1.00 kB │ gzip:  0.43 kB
ℹ dist/auth/providers/github.mjs.map                                              0.99 kB │ gzip:  0.51 kB
ℹ dist/auth/providers/google.mjs.map                                              0.99 kB │ gzip:  0.51 kB
ℹ dist/types-Qa7-HJJC.d.mts.map                                                   0.94 kB │ gzip:  0.46 kB
ℹ dist/transaction-NQj4VJ7Z.mjs                                                   0.92 kB │ gzip:  0.48 kB
ℹ dist/astro/routes/api/widget-components.mjs.map                                 0.91 kB │ gzip:  0.51 kB
ℹ dist/db/sqlite.mjs.map                                                          0.91 kB │ gzip:  0.51 kB
ℹ dist/chunks-BsrLu7w3.mjs.map                                                    0.90 kB │ gzip:  0.57 kB
ℹ dist/oauth-user-lookup-BdDSDvjF.mjs                                             0.81 kB │ gzip:  0.49 kB
ℹ dist/chunks-BsrLu7w3.mjs                                                        0.80 kB │ gzip:  0.51 kB
ℹ dist/redirect-Cw3JTlmj.mjs.map                                                  0.75 kB │ gzip:  0.49 kB
ℹ dist/astro/routes/api/import/wordpress/rewrite-url-helpers.d.mts.map            0.74 kB │ gzip:  0.34 kB
ℹ dist/db/libsql.mjs.map                                                          0.71 kB │ gzip:  0.41 kB
ℹ dist/load-B84ohfBk.mjs                                                          0.70 kB │ gzip:  0.38 kB
ℹ dist/errors-9P_FDrJ_.mjs.map                                                    0.67 kB │ gzip:  0.45 kB
ℹ dist/adapters-C5AWLJSD.d.mts.map                                                0.67 kB │ gzip:  0.32 kB
ℹ dist/storage/s3.d.mts.map                                                       0.67 kB │ gzip:  0.33 kB
ℹ dist/seo/index.d.mts.map                                                        0.64 kB │ gzip:  0.36 kB
ℹ dist/storage/local.d.mts.map                                                    0.62 kB │ gzip:  0.32 kB
ℹ dist/types-DX6v9KzJ.d.mts.map                                                   0.59 kB │ gzip:  0.31 kB
ℹ dist/version-CyfxLO9-.mjs.map                                                   0.59 kB │ gzip:  0.33 kB
ℹ dist/escape-bIyGoW5W.mjs.map                                                    0.58 kB │ gzip:  0.34 kB
ℹ dist/mode-BjlXswIw.mjs                                                          0.58 kB │ gzip:  0.36 kB
ℹ dist/request-context.d.mts.map                                                  0.57 kB │ gzip:  0.31 kB
ℹ dist/plugin-utils.d.mts.map                                                     0.56 kB │ gzip:  0.30 kB
ℹ dist/database/instrumentation.d.mts.map                                         0.53 kB │ gzip:  0.28 kB
ℹ dist/redirect-Cw3JTlmj.mjs                                                      0.53 kB │ gzip:  0.37 kB
ℹ dist/errors-9P_FDrJ_.mjs                                                        0.53 kB │ gzip:  0.34 kB
ℹ dist/transport-OnMNbsIA.d.mts.map                                               0.49 kB │ gzip:  0.28 kB
ℹ dist/runner-BcRuXq_h.d.mts.map                                                  0.49 kB │ gzip:  0.25 kB
ℹ dist/client/cf-access.d.mts.map                                                 0.49 kB │ gzip:  0.27 kB
ℹ dist/api/route-utils.d.mts.map                                                  0.48 kB │ gzip:  0.27 kB
ℹ dist/astro/routes/api/import/wordpress/media.d.mts.map                          0.45 kB │ gzip:  0.25 kB
ℹ dist/site-url-Cm8-sJy7.mjs                                                      0.44 kB │ gzip:  0.30 kB
ℹ dist/media/local-runtime.d.mts.map                                              0.40 kB │ gzip:  0.23 kB
ℹ dist/astro/middleware.d.mts.map                                                 0.36 kB │ gzip:  0.24 kB
ℹ dist/astro/index.d.mts.map                                                      0.36 kB │ gzip:  0.22 kB
ℹ dist/types-DpFmlNyB.mjs                                                         0.36 kB │ gzip:  0.24 kB
ℹ dist/escape-bIyGoW5W.mjs                                                        0.36 kB │ gzip:  0.25 kB
ℹ dist/astro/routes/api/import/wordpress/rewrite-urls.d.mts.map                   0.34 kB │ gzip:  0.23 kB
ℹ dist/astro/middleware/auth.d.mts.map                                            0.33 kB │ gzip:  0.22 kB
ℹ dist/astro/routes/api/import/wordpress-plugin/execute.d.mts.map                 0.32 kB │ gzip:  0.23 kB
ℹ dist/astro/routes/api/import/wordpress/prepare.d.mts.map                        0.32 kB │ gzip:  0.21 kB
ℹ dist/astro/routes/api/plugins/_pluginId_/_...path_.d.mts.map                    0.29 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/import/wordpress-plugin/analyze.d.mts.map                 0.27 kB │ gzip:  0.20 kB
ℹ dist/astro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.d.mts.map    0.26 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/PluginRegistry.d.mts.map                                      0.26 kB │ gzip:  0.18 kB
ℹ dist/types-Cj2S6FuC.mjs                                                         0.25 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_.d.mts.map                  0.25 kB │ gzip:  0.18 kB
ℹ dist/api-tokens-B6VgoE6M.mjs                                                    0.25 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/terms/_taxonomy_.d.mts.map      0.24 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/import/probe.d.mts.map                                    0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/schema/collections/_slug_/index.d.mts.map                 0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/admin/oauth-clients/_id_.d.mts.map                        0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_/translations.d.mts.map     0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/admin/byline-fields/_slug_.d.mts.map                      0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/admin/bylines/_id_/index.d.mts.map                        0.23 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/comments/_collection_/_contentId_/index.d.mts.map         0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/media/providers/_providerId_/_itemId_.d.mts.map           0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/content/_collection_/_id_.d.mts.map                       0.23 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/media/providers/_providerId_/index.d.mts.map              0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/redirects/404s/index.d.mts.map                            0.23 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/schema/collections/_slug_/fields/index.d.mts.map          0.22 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/admin/bylines/_id_/translations.d.mts.map                 0.22 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/taxonomies/_name_/terms/index.d.mts.map                   0.22 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/schedule.d.mts.map              0.22 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/admin/api-tokens/index.d.mts.map                          0.22 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/media/_id_.d.mts.map                                      0.22 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/sections/_slug_.d.mts.map                                 0.22 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/admin/allowed-domains/_domain_.d.mts.map                  0.22 kB │ gzip:  0.18 kB
ℹ dist/plugins/adapt-sandbox-entry.d.mts.map                                      0.22 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/menus/_name_.d.mts.map                                    0.22 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/redirects/_id_.d.mts.map                                  0.22 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/admin/oauth-clients/index.d.mts.map                       0.21 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/widget-areas/_name_/widgets/_id_.d.mts.map                0.21 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/admin/allowed-domains/index.d.mts.map                     0.21 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/menus/_name_/translations.d.mts.map                       0.21 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/settings/email.d.mts.map                                  0.21 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/well-known/oauth-authorization-server.d.mts.map           0.21 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/admin/comments/_id_.d.mts.map                             0.21 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/admin/users/_id_/index.d.mts.map                          0.20 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/content/_collection_/index.d.mts.map                      0.20 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/well-known/oauth-protected-resource.d.mts.map             0.20 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/admin/byline-fields/index.d.mts.map                       0.20 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/menus/_name_/items/_id_.d.mts.map                         0.20 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/discard-draft.d.mts.map         0.20 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/schema/collections/index.d.mts.map                        0.20 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/admin/themes/marketplace/_id_/thumbnail.d.mts.map         0.20 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/taxonomies/index.d.mts.map                                0.20 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/admin/plugins/registry/_id_/uninstall.d.mts.map           0.20 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/auth/passkey/_id_.d.mts.map                               0.20 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/translations.d.mts.map          0.20 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/schema/collections/_slug_/fields/reorder.d.mts.map        0.20 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/settings.d.mts.map                                        0.20 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/preview-url.d.mts.map           0.20 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/install.d.mts.map          0.20 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/admin/bylines/index.d.mts.map                             0.20 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/setup/dev-bypass.d.mts.map                                0.20 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/auth/dev-bypass.d.mts.map                                 0.20 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/mcp.d.mts.map                                             0.20 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/oauth/authorize.d.mts.map                                 0.20 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/admin/plugins/registry/_id_/update.d.mts.map              0.20 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/widget-areas/_name_.d.mts.map                             0.20 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/index.d.mts.map            0.20 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/admin/users/_id_/send-recovery.d.mts.map                  0.20 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/duplicate.d.mts.map             0.20 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/permanent.d.mts.map             0.20 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/revisions.d.mts.map             0.20 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/unpublish.d.mts.map             0.20 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/widget-areas/index.d.mts.map                              0.20 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/admin/hooks/exclusive/_hookName_.d.mts.map                0.19 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/admin/themes/marketplace/_id_/index.d.mts.map             0.19 kB │ gzip:  0.16 kB
ℹ dist/media/index.d.mts.map                                                      0.19 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/icon.d.mts.map             0.19 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/oauth/register.d.mts.map                                  0.19 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/admin/plugins/registry/artifact.d.mts.map                 0.19 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/auth/invite/register-options.d.mts.map                    0.19 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/publish.d.mts.map               0.19 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/media.d.mts.map                                           0.19 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/redirects/index.d.mts.map                                 0.19 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/compare.d.mts.map               0.19 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/restore.d.mts.map               0.19 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/admin/plugins/registry/install.d.mts.map                  0.19 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/auth/oauth/_provider_/callback.d.mts.map                  0.19 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/sections/index.d.mts.map                                  0.19 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/admin/byline-fields/_slug_/usage.d.mts.map                0.19 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/uninstall.d.mts.map                    0.19 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/import/wordpress-plugin/callback.d.mts.map                0.19 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/oauth/token.d.mts.map                                     0.19 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/admin/plugins/marketplace/index.d.mts.map                 0.19 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/auth/passkey/register/options.d.mts.map                   0.19 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/menus/index.d.mts.map                                     0.19 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/admin/themes/marketplace/index.d.mts.map                  0.19 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/auth/passkey/register/verify.d.mts.map                    0.19 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/dev/emails.d.mts.map                                      0.19 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/auth/me.d.mts.map                                         0.18 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/revisions/_revisionId_/restore.d.mts.map                  0.18 kB │ gzip:  0.15 kB
ℹ dist/astro/middleware/request-context.d.mts.map                                 0.18 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/admin/comments/_id_/status.d.mts.map                      0.18 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/disable.d.mts.map                      0.18 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/sitemap-_collection_.xml.d.mts.map                            0.18 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/admin/byline-fields/reorder.d.mts.map                     0.18 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/admin/hooks/exclusive/index.d.mts.map                     0.18 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/typegen.d.mts.map                                         0.18 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/widget-areas/_name_/widgets.d.mts.map                     0.18 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/enable.d.mts.map                       0.18 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/update.d.mts.map                       0.18 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/admin/users/_id_/disable.d.mts.map                        0.18 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/widget-areas/_name_/reorder.d.mts.map                     0.18 kB │ gzip:  0.16 kB
ℹ dist/runtime.d.mts.map                                                          0.18 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/revisions/_revisionId_/index.d.mts.map                    0.18 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/index.d.mts.map                        0.18 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/admin/users/_id_/enable.d.mts.map                         0.18 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/auth/oauth/_provider_.d.mts.map                           0.18 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/oauth/device/authorize.d.mts.map                          0.18 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/content/_collection_/trash.d.mts.map                      0.18 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/admin/plugins/updates.d.mts.map                           0.18 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/redirects/404s/summary.d.mts.map                          0.18 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/auth/invite/complete.d.mts.map                            0.18 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/auth/magic-link/verify.d.mts.map                          0.18 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/auth/signup/complete.d.mts.map                            0.18 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/media/file/_...key_.d.mts.map                             0.18 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/media/providers/index.d.mts.map                           0.18 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/setup/admin-verify.d.mts.map                              0.18 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/widget-components.d.mts.map                               0.18 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/admin/api-tokens/_id_.d.mts.map                           0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/admin/comments/counts.d.mts.map                           0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/admin/comments/index.d.mts.map                            0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/auth/passkey/options.d.mts.map                            0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/auth/signup/request.d.mts.map                             0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/menus/_name_/reorder.d.mts.map                            0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/schema/orphans/_slug_.d.mts.map                           0.17 kB │ gzip:  0.15 kB
ℹ dist/version-CyfxLO9-.mjs                                                       0.17 kB │ gzip:  0.16 kB
ℹ dist/astro/middleware/redirect.d.mts.map                                        0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/oauth/token/refresh.d.mts.map                             0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/auth/passkey/verify.d.mts.map                             0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/schema/orphans/index.d.mts.map                            0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/search/suggest.d.mts.map                                  0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/admin/plugins/index.d.mts.map                             0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/auth/invite/accept.d.mts.map                              0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/auth/magic-link/send.d.mts.map                            0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/auth/signup/verify.d.mts.map                              0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/media/_id_/confirm.d.mts.map                              0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/oauth/device/token.d.mts.map                              0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/oauth/token/revoke.d.mts.map                              0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/admin/comments/bulk.d.mts.map                             0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/auth/passkey/index.d.mts.map                              0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/media/upload-url.d.mts.map                                0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/menus/_name_/items.d.mts.map                              0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/search/enable.d.mts.map                                   0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/search/rebuild.d.mts.map                                  0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/admin/users/index.d.mts.map                               0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/auth/invite/index.d.mts.map                               0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/oauth/device/code.d.mts.map                               0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/search/index.d.mts.map                                    0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/setup/dev-reset.d.mts.map                                 0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/themes/preview.d.mts.map                                  0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/middleware/setup.d.mts.map                                           0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/openapi.json.d.mts.map                                    0.17 kB │ gzip:  0.14 kB
ℹ dist/astro/routes/api/search/stats.d.mts.map                                    0.16 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/well-known/auth.d.mts.map                                 0.16 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/schema/index.d.mts.map                                    0.16 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/setup/status.d.mts.map                                    0.16 kB │ gzip:  0.14 kB
ℹ dist/astro/routes/api/auth/logout.d.mts.map                                     0.16 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/setup/admin.d.mts.map                                     0.16 kB │ gzip:  0.14 kB
ℹ dist/astro/routes/api/setup/index.d.mts.map                                     0.16 kB │ gzip:  0.14 kB
ℹ dist/astro/routes/api/dashboard.d.mts.map                                       0.16 kB │ gzip:  0.14 kB
ℹ dist/astro/routes/api/manifest.d.mts.map                                        0.16 kB │ gzip:  0.14 kB
ℹ dist/astro/routes/api/snapshot.d.mts.map                                        0.16 kB │ gzip:  0.14 kB
ℹ dist/astro/routes/api/auth/mode.d.mts.map                                       0.16 kB │ gzip:  0.14 kB
ℹ dist/astro/routes/sitemap.xml.d.mts.map                                         0.16 kB │ gzip:  0.14 kB
ℹ dist/astro/routes/robots.txt.d.mts.map                                          0.15 kB │ gzip:  0.14 kB
ℹ dist/db/postgres.d.mts.map                                                      0.15 kB │ gzip:  0.14 kB
ℹ dist/auth/providers/github.d.mts.map                                            0.15 kB │ gzip:  0.14 kB
ℹ dist/auth/providers/google.d.mts.map                                            0.15 kB │ gzip:  0.14 kB
ℹ dist/db/libsql.d.mts.map                                                        0.14 kB │ gzip:  0.14 kB
ℹ dist/db/sqlite.d.mts.map                                                        0.14 kB │ gzip:  0.14 kB
ℹ dist/ssrf-BvgVcfNQ.mjs                                                          0.01 kB │ gzip:  0.03 kB
ℹ dist/index.d.mts                                                               18.38 kB │ gzip:  4.88 kB
ℹ dist/astro/types.d.mts                                                         13.05 kB │ gzip:  3.97 kB
ℹ dist/client/index.d.mts                                                        11.50 kB │ gzip:  3.14 kB
ℹ dist/api/schemas/index.d.mts                                                    8.30 kB │ gzip:  1.94 kB
ℹ dist/page/index.d.mts                                                           6.82 kB │ gzip:  2.27 kB
ℹ dist/plugin-types.d.mts                                                         6.61 kB │ gzip:  2.36 kB
ℹ dist/astro/routes/api/import/wordpress/execute.d.mts                            3.92 kB │ gzip:  1.55 kB
ℹ dist/api/route-utils.d.mts                                                      2.94 kB │ gzip:  1.35 kB
ℹ dist/plugin-utils.d.mts                                                         2.85 kB │ gzip:  1.24 kB
ℹ dist/request-context.d.mts                                                      2.81 kB │ gzip:  1.29 kB
ℹ dist/astro/index.d.mts                                                          2.60 kB │ gzip:  1.17 kB
ℹ dist/client/cf-access.d.mts                                                     2.55 kB │ gzip:  1.03 kB
ℹ dist/astro/routes/api/import/wordpress/analyze.d.mts                            2.52 kB │ gzip:  0.95 kB
ℹ dist/seo/index.d.mts                                                            2.45 kB │ gzip:  1.01 kB
ℹ dist/astro/routes/api/import/wordpress/rewrite-url-helpers.d.mts                2.14 kB │ gzip:  0.89 kB
ℹ dist/database/instrumentation.d.mts                                             2.00 kB │ gzip:  0.95 kB
ℹ dist/storage/s3.d.mts                                                           1.61 kB │ gzip:  0.75 kB
ℹ dist/media/index.d.mts                                                          1.52 kB │ gzip:  0.63 kB
ℹ dist/storage/local.d.mts                                                        1.50 kB │ gzip:  0.70 kB
ℹ dist/astro/middleware.d.mts                                                     1.40 kB │ gzip:  0.74 kB
ℹ dist/plugins/adapt-sandbox-entry.d.mts                                          1.37 kB │ gzip:  0.65 kB
ℹ dist/media/local-runtime.d.mts                                                  1.34 kB │ gzip:  0.60 kB
ℹ dist/runtime.d.mts                                                              1.10 kB │ gzip:  0.59 kB
ℹ dist/astro/middleware/auth.d.mts                                                0.97 kB │ gzip:  0.50 kB
ℹ dist/astro/routes/api/import/wordpress/media.d.mts                              0.96 kB │ gzip:  0.47 kB
ℹ dist/seed/index.d.mts                                                           0.82 kB │ gzip:  0.34 kB
ℹ dist/astro/middleware/redirect.d.mts                                            0.72 kB │ gzip:  0.45 kB
ℹ dist/astro/routes/api/import/wordpress-plugin/execute.d.mts                     0.67 kB │ gzip:  0.38 kB
ℹ dist/astro/middleware/setup.d.mts                                               0.67 kB │ gzip:  0.40 kB
ℹ dist/astro/middleware/request-context.d.mts                                     0.64 kB │ gzip:  0.40 kB
ℹ dist/astro/routes/api/import/wordpress/rewrite-urls.d.mts                       0.59 kB │ gzip:  0.33 kB
ℹ dist/astro/routes/api/settings.d.mts                                            0.58 kB │ gzip:  0.33 kB
ℹ dist/db/index.d.mts                                                             0.58 kB │ gzip:  0.28 kB
ℹ dist/astro/routes/api/settings/email.d.mts                                      0.53 kB │ gzip:  0.32 kB
ℹ dist/astro/routes/api/search/index.d.mts                                        0.51 kB │ gzip:  0.31 kB
ℹ dist/astro/routes/api/media/_id_.d.mts                                          0.51 kB │ gzip:  0.28 kB
ℹ dist/astro/routes/api/import/probe.d.mts                                        0.50 kB │ gzip:  0.30 kB
ℹ dist/astro/routes/api/typegen.d.mts                                             0.49 kB │ gzip:  0.32 kB
ℹ dist/astro/routes/api/admin/api-tokens/index.d.mts                              0.48 kB │ gzip:  0.31 kB
ℹ dist/astro/routes/api/import/wordpress/prepare.d.mts                            0.47 kB │ gzip:  0.27 kB
ℹ dist/astro/routes/api/search/suggest.d.mts                                      0.47 kB │ gzip:  0.30 kB
ℹ dist/astro/routes/api/import/wordpress-plugin/analyze.d.mts                     0.47 kB │ gzip:  0.29 kB
ℹ dist/auth/providers/github.d.mts                                                0.45 kB │ gzip:  0.30 kB
ℹ dist/auth/providers/google.d.mts                                                0.45 kB │ gzip:  0.30 kB
ℹ dist/astro/routes/api/comments/_collection_/_contentId_/index.d.mts             0.43 kB │ gzip:  0.28 kB
ℹ dist/astro/routes/api/search/enable.d.mts                                       0.42 kB │ gzip:  0.27 kB
ℹ dist/astro/routes/api/admin/oauth-clients/_id_.d.mts                            0.41 kB │ gzip:  0.24 kB
ℹ dist/astro/routes/api/mcp.d.mts                                                 0.41 kB │ gzip:  0.25 kB
ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_.d.mts                      0.39 kB │ gzip:  0.24 kB
ℹ dist/astro/routes/api/plugins/_pluginId_/_...path_.d.mts                        0.39 kB │ gzip:  0.23 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/terms/_taxonomy_.d.mts          0.39 kB │ gzip:  0.26 kB
ℹ dist/astro/routes/api/media/providers/_providerId_/_itemId_.d.mts               0.39 kB │ gzip:  0.24 kB
ℹ dist/astro/routes/PluginRegistry.d.mts                                          0.38 kB │ gzip:  0.25 kB
ℹ dist/astro/routes/api/admin/comments/_id_.d.mts                                 0.38 kB │ gzip:  0.26 kB
ℹ dist/astro/routes/api/admin/allowed-domains/_domain_.d.mts                      0.37 kB │ gzip:  0.24 kB
ℹ dist/astro/routes/api/media/providers/_providerId_/index.d.mts                  0.37 kB │ gzip:  0.23 kB
ℹ dist/astro/routes/api/media.d.mts                                               0.37 kB │ gzip:  0.24 kB
ℹ dist/astro/routes/api/admin/allowed-domains/index.d.mts                         0.36 kB │ gzip:  0.23 kB
ℹ dist/astro/routes/api/admin/oauth-clients/index.d.mts                           0.36 kB │ gzip:  0.23 kB
ℹ dist/astro/routes/api/search/rebuild.d.mts                                      0.35 kB │ gzip:  0.24 kB
ℹ dist/astro/routes/api/taxonomies/index.d.mts                                    0.35 kB │ gzip:  0.22 kB
ℹ dist/astro/routes/api/taxonomies/_name_/terms/index.d.mts                       0.34 kB │ gzip:  0.23 kB
ℹ dist/astro/routes/api/auth/passkey/_id_.d.mts                                   0.34 kB │ gzip:  0.23 kB
ℹ dist/astro/routes/api/auth/me.d.mts                                             0.34 kB │ gzip:  0.23 kB
ℹ dist/db/postgres.d.mts                                                          0.34 kB │ gzip:  0.22 kB
ℹ dist/astro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.d.mts        0.33 kB │ gzip:  0.22 kB
ℹ dist/astro/routes/api/admin/byline-fields/_slug_.d.mts                          0.32 kB │ gzip:  0.21 kB
ℹ dist/astro/routes/api/schema/collections/_slug_/index.d.mts                     0.32 kB │ gzip:  0.21 kB
ℹ dist/db/libsql.d.mts                                                            0.31 kB │ gzip:  0.22 kB
ℹ dist/db/sqlite.d.mts                                                            0.31 kB │ gzip:  0.22 kB
ℹ dist/astro/routes/api/admin/bylines/_id_/index.d.mts                            0.31 kB │ gzip:  0.20 kB
ℹ dist/astro/routes/api/content/_collection_/_id_.d.mts                           0.31 kB │ gzip:  0.20 kB
ℹ dist/astro/routes/api/redirects/404s/index.d.mts                                0.31 kB │ gzip:  0.20 kB
ℹ dist/astro/routes/api/sections/_slug_.d.mts                                     0.30 kB │ gzip:  0.20 kB
ℹ dist/astro/routes/api/media/upload-url.d.mts                                    0.30 kB │ gzip:  0.21 kB
ℹ dist/astro/routes/api/menus/_name_.d.mts                                        0.30 kB │ gzip:  0.20 kB
ℹ dist/astro/routes/api/redirects/_id_.d.mts                                      0.30 kB │ gzip:  0.20 kB
ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_/translations.d.mts         0.30 kB │ gzip:  0.20 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/schedule.d.mts                  0.29 kB │ gzip:  0.20 kB
ℹ dist/astro/routes/api/admin/bylines/_id_/translations.d.mts                     0.28 kB │ gzip:  0.20 kB
ℹ dist/astro/routes/api/schema/collections/_slug_/fields/index.d.mts              0.28 kB │ gzip:  0.20 kB
ℹ dist/astro/routes/api/widget-areas/_name_/widgets/_id_.d.mts                    0.28 kB │ gzip:  0.20 kB
ℹ dist/astro/routes/api/media/providers/index.d.mts                               0.28 kB │ gzip:  0.21 kB
ℹ dist/astro/routes/api/menus/_name_/translations.d.mts                           0.28 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/admin/api-tokens/_id_.d.mts                               0.28 kB │ gzip:  0.21 kB
ℹ dist/astro/routes/api/admin/comments/index.d.mts                                0.28 kB │ gzip:  0.21 kB
ℹ dist/astro/routes/api/content/_collection_/index.d.mts                          0.27 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/menus/_name_/items/_id_.d.mts                             0.27 kB │ gzip:  0.20 kB
ℹ dist/astro/routes/api/admin/byline-fields/index.d.mts                           0.27 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/oauth/register.d.mts                                      0.27 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/schema/collections/index.d.mts                            0.27 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/widget-areas/_name_.d.mts                                 0.27 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/media/_id_/confirm.d.mts                                  0.27 kB │ gzip:  0.20 kB
ℹ dist/astro/routes/api/well-known/oauth-authorization-server.d.mts               0.27 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/setup/dev-bypass.d.mts                                    0.27 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/admin/users/_id_/index.d.mts                              0.27 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/auth/dev-bypass.d.mts                                     0.27 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/admin/bylines/index.d.mts                                 0.27 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/oauth/authorize.d.mts                                     0.27 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/oauth/token.d.mts                                         0.27 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/well-known/oauth-protected-resource.d.mts                 0.26 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/widget-areas/index.d.mts                                  0.26 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/dev/emails.d.mts                                          0.26 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/redirects/index.d.mts                                     0.26 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/search/stats.d.mts                                        0.26 kB │ gzip:  0.20 kB
ℹ dist/astro/routes/api/sections/index.d.mts                                      0.26 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/discard-draft.d.mts             0.26 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/menus/index.d.mts                                         0.26 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/permanent.d.mts                 0.26 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/preview-url.d.mts               0.26 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/translations.d.mts              0.26 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/schema/collections/_slug_/fields/reorder.d.mts            0.25 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/admin/plugins/registry/_id_/uninstall.d.mts               0.25 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/admin/themes/marketplace/_id_/thumbnail.d.mts             0.25 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/install.d.mts              0.25 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/auth/invite/register-options.d.mts                        0.25 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/duplicate.d.mts                 0.25 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/unpublish.d.mts                 0.25 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/admin/users/_id_/send-recovery.d.mts                      0.25 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/revisions.d.mts                 0.25 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/sitemap-_collection_.xml.d.mts                                0.25 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/admin/hooks/exclusive/_hookName_.d.mts                    0.25 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/admin/plugins/registry/_id_/update.d.mts                  0.25 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/publish.d.mts                   0.25 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/restore.d.mts                   0.25 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/index.d.mts                0.25 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/admin/themes/marketplace/_id_/index.d.mts                 0.24 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/compare.d.mts                   0.24 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/import/wordpress-plugin/callback.d.mts                    0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/uninstall.d.mts                        0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/icon.d.mts                 0.24 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/admin/plugins/registry/artifact.d.mts                     0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/admin/plugins/registry/install.d.mts                      0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/revisions/_revisionId_/restore.d.mts                      0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/auth/oauth/_provider_/callback.d.mts                      0.24 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/auth/passkey/register/options.d.mts                       0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/admin/byline-fields/_slug_/usage.d.mts                    0.24 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/admin/byline-fields/reorder.d.mts                         0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/admin/plugins/marketplace/index.d.mts                     0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/auth/passkey/register/verify.d.mts                        0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/widget-areas/_name_/reorder.d.mts                         0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/widget-areas/_name_/widgets.d.mts                         0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/disable.d.mts                          0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/admin/themes/marketplace/index.d.mts                      0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/widget-components.d.mts                                   0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/enable.d.mts                           0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/update.d.mts                           0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/admin/users/_id_/disable.d.mts                            0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/oauth/device/authorize.d.mts                              0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/revisions/_revisionId_/index.d.mts                        0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/admin/comments/_id_/status.d.mts                          0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/admin/hooks/exclusive/index.d.mts                         0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/setup/admin-verify.d.mts                                  0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/admin/users/_id_/enable.d.mts                             0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/auth/oauth/_provider_.d.mts                               0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/content/_collection_/trash.d.mts                          0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/auth/invite/complete.d.mts                                0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/auth/signup/complete.d.mts                                0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/index.d.mts                            0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/auth/passkey/options.d.mts                                0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/menus/_name_/reorder.d.mts                                0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/redirects/404s/summary.d.mts                              0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/schema/orphans/_slug_.d.mts                               0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/admin/plugins/updates.d.mts                               0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/auth/magic-link/verify.d.mts                              0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/auth/signup/request.d.mts                                 0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/oauth/token/refresh.d.mts                                 0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/admin/comments/counts.d.mts                               0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/auth/passkey/verify.d.mts                                 0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/media/file/_...key_.d.mts                                 0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/auth/magic-link/send.d.mts                                0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/oauth/token/revoke.d.mts                                  0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/setup/dev-reset.d.mts                                     0.23 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/admin/comments/bulk.d.mts                                 0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/menus/_name_/items.d.mts                                  0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/oauth/device/token.d.mts                                  0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/schema/orphans/index.d.mts                                0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/admin/plugins/index.d.mts                                 0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/auth/invite/accept.d.mts                                  0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/auth/invite/index.d.mts                                   0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/auth/signup/verify.d.mts                                  0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/openapi.json.d.mts                                        0.23 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/auth/passkey/index.d.mts                                  0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/oauth/device/code.d.mts                                   0.23 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/themes/preview.d.mts                                      0.23 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/admin/users/index.d.mts                                   0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/auth/logout.d.mts                                         0.22 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/well-known/auth.d.mts                                     0.22 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/dashboard.d.mts                                           0.22 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/setup/admin.d.mts                                         0.22 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/setup/index.d.mts                                         0.22 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/setup/status.d.mts                                        0.22 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/sitemap.xml.d.mts                                             0.22 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/schema/index.d.mts                                        0.22 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/manifest.d.mts                                            0.22 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/snapshot.d.mts                                            0.22 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/robots.txt.d.mts                                              0.22 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/auth/mode.d.mts                                           0.22 kB │ gzip:  0.17 kB
ℹ dist/cli/index.d.mts                                                            0.01 kB │ gzip:  0.03 kB
ℹ dist/index-nN0g71HX.d.mts                                                     158.55 kB │ gzip: 43.19 kB
ℹ dist/byline-fields-CSxsd9Dv.d.mts                                              79.04 kB │ gzip:  9.28 kB
ℹ dist/types-jbkzJ1j_.d.mts                                                      40.10 kB │ gzip: 10.71 kB
ℹ dist/types-OT_Es5mp.d.mts                                                      13.42 kB │ gzip:  2.98 kB
ℹ dist/types-DWnN7weG.d.mts                                                       9.78 kB │ gzip:  3.24 kB
ℹ dist/validate-c7q7DID3.d.mts                                                    9.46 kB │ gzip:  2.97 kB
ℹ dist/placeholder-B9lUUEmj.d.mts                                                 8.70 kB │ gzip:  2.96 kB
ℹ dist/index-BpYeJO1E.d.mts                                                       7.74 kB │ gzip:  2.83 kB
ℹ dist/types-i8_uzhMD.d.mts                                                       6.54 kB │ gzip:  2.54 kB
ℹ dist/options-xfkUPCKd.d.mts                                                     6.44 kB │ gzip:  2.43 kB
ℹ dist/types-Qa7-HJJC.d.mts                                                       6.19 kB │ gzip:  2.34 kB
ℹ dist/types-DbCWhHet.d.mts                                                       6.03 kB │ gzip:  1.79 kB
ℹ dist/types-kwqCOUxj.d.mts                                                       5.04 kB │ gzip:  1.78 kB
ℹ dist/adapters-C5AWLJSD.d.mts                                                    3.21 kB │ gzip:  1.32 kB
ℹ dist/types-DX6v9KzJ.d.mts                                                       2.64 kB │ gzip:  1.17 kB
ℹ dist/runner-BcRuXq_h.d.mts                                                      1.98 kB │ gzip:  0.93 kB
ℹ dist/transport-OnMNbsIA.d.mts                                                   1.67 kB │ gzip:  0.76 kB
ℹ 1019 files, total: 7354.47 kB
[33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugins. Here is a breakdown:
  - rolldown-plugin-dts:generate (37%)
  - rolldown-plugin-dts:resolver (37%)
  - rolldown-plugin-dts:fake-js (20%)
See https://rolldown.rs/options/checks#plugintimings for more details.

✔ Build complete in 4723ms
$ pnpm --filter @emdash-cms/registry-lexicons build
==> pnpm-build-registry-lexicons
$ pnpm run build:lexicons && pnpm run build:types
$ node scripts/copy-lexicons.mjs
using in-package lexicon copy at /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-lexicons/lexicons/com/emdashcms/experimental (no source at /home/data/dev_react/awcms-micro/awcmsmicro-dev/lexicons/com/emdashcms/experimental)
$ tsdown
ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-lexicons/tsdown.config.ts
ℹ entry: src/index.ts, src/generated/types/com/emdashcms/experimental/aggregator/defs.ts, src/generated/types/com/emdashcms/experimental/aggregator/getLatestRelease.ts, src/generated/types/com/emdashcms/experimental/aggregator/getPackage.ts, src/generated/types/com/emdashcms/experimental/aggregator/listReleases.ts, src/generated/types/com/emdashcms/experimental/aggregator/resolvePackage.ts, src/generated/types/com/emdashcms/experimental/aggregator/searchPackages.ts, src/generated/types/com/emdashcms/experimental/package/profile.ts, src/generated/types/com/emdashcms/experimental/package/release.ts, src/generated/types/com/emdashcms/experimental/package/releaseExtension.ts, src/generated/types/com/emdashcms/experimental/publisher/profile.ts, src/generated/types/com/emdashcms/experimental/publisher/verification.ts
ℹ target: es2023
ℹ tsconfig: tsconfig.json
ℹ Build start
ℹ Cleaning 57 files
ℹ dist/generated/types/com/emdashcms/experimental/package/releaseExtension.js            5.50 kB │ gzip: 0.86 kB
ℹ dist/generated/types/com/emdashcms/experimental/package/profile.js                     4.45 kB │ gzip: 0.78 kB
ℹ dist/generated/types/com/emdashcms/experimental/package/release.js                     4.10 kB │ gzip: 0.81 kB
ℹ dist/index.js                                                                          3.85 kB │ gzip: 1.00 kB
ℹ dist/generated/types/com/emdashcms/experimental/aggregator/defs.js                     2.53 kB │ gzip: 0.64 kB
ℹ dist/generated/types/com/emdashcms/experimental/publisher/profile.js                   2.01 kB │ gzip: 0.58 kB
ℹ dist/generated/types/com/emdashcms/experimental/aggregator/searchPackages.js           1.55 kB │ gzip: 0.53 kB
ℹ dist/generated/types/com/emdashcms/experimental/aggregator/listReleases.js             1.41 kB │ gzip: 0.53 kB
ℹ dist/generated/types/com/emdashcms/experimental/publisher/verification.js              0.99 kB │ gzip: 0.45 kB
ℹ dist/generated/types/com/emdashcms/experimental/aggregator/getLatestRelease.js         0.87 kB │ gzip: 0.44 kB
ℹ dist/generated/types/com/emdashcms/experimental/aggregator/resolvePackage.js           0.86 kB │ gzip: 0.44 kB
ℹ dist/generated/types/com/emdashcms/experimental/aggregator/getPackage.js               0.84 kB │ gzip: 0.44 kB
ℹ dist/generated/types/com/emdashcms/experimental/package/release.js.map                11.73 kB │ gzip: 3.21 kB
ℹ dist/generated/types/com/emdashcms/experimental/package/releaseExtension.js.map       11.30 kB │ gzip: 2.06 kB
ℹ dist/generated/types/com/emdashcms/experimental/package/profile.js.map                10.94 kB │ gzip: 2.32 kB
ℹ dist/generated/types/com/emdashcms/experimental/aggregator/defs.js.map                 6.74 kB │ gzip: 1.81 kB
ℹ dist/index.js.map                                                                      6.29 kB │ gzip: 1.85 kB
ℹ dist/generated/types/com/emdashcms/experimental/publisher/profile.js.map               4.96 kB │ gzip: 1.56 kB
ℹ dist/generated/types/com/emdashcms/experimental/aggregator/searchPackages.js.map       3.95 kB │ gzip: 1.27 kB
ℹ dist/generated/types/com/emdashcms/experimental/aggregator/listReleases.js.map         3.40 kB │ gzip: 1.11 kB
ℹ dist/generated/types/com/emdashcms/experimental/publisher/verification.js.map          2.91 kB │ gzip: 1.14 kB
ℹ dist/generated/types/com/emdashcms/experimental/package/releaseExtension.d.ts.map      2.29 kB │ gzip: 0.67 kB
ℹ dist/generated/types/com/emdashcms/experimental/aggregator/resolvePackage.js.map       1.85 kB │ gzip: 0.79 kB
ℹ dist/generated/types/com/emdashcms/experimental/aggregator/getLatestRelease.js.map     1.83 kB │ gzip: 0.78 kB
ℹ dist/generated/types/com/emdashcms/experimental/aggregator/getPackage.js.map           1.80 kB │ gzip: 0.77 kB
ℹ dist/generated/types/com/emdashcms/experimental/package/release.d.ts.map               1.01 kB │ gzip: 0.40 kB
ℹ dist/generated/types/com/emdashcms/experimental/package/profile.d.ts.map               1.00 kB │ gzip: 0.42 kB
ℹ dist/generated/types/com/emdashcms/experimental/publisher/profile.d.ts.map             0.61 kB │ gzip: 0.32 kB
ℹ dist/generated/types/com/emdashcms/experimental/aggregator/defs.d.ts.map               0.59 kB │ gzip: 0.27 kB
ℹ dist/generated/types/com/emdashcms/experimental/aggregator/searchPackages.d.ts.map     0.51 kB │ gzip: 0.28 kB
ℹ dist/generated/types/com/emdashcms/experimental/aggregator/listReleases.d.ts.map       0.50 kB │ gzip: 0.28 kB
ℹ dist/generated/types/com/emdashcms/experimental/aggregator/getLatestRelease.d.ts.map   0.48 kB │ gzip: 0.28 kB
ℹ dist/generated/types/com/emdashcms/experimental/aggregator/resolvePackage.d.ts.map     0.48 kB │ gzip: 0.28 kB
ℹ dist/generated/types/com/emdashcms/experimental/aggregator/getPackage.d.ts.map         0.47 kB │ gzip: 0.28 kB
ℹ dist/generated/types/com/emdashcms/experimental/publisher/verification.d.ts.map        0.44 kB │ gzip: 0.27 kB
ℹ dist/chunk-BYypO7fO.js                                                                 0.38 kB │ gzip: 0.26 kB
ℹ dist/index.d.ts.map                                                                    0.35 kB │ gzip: 0.21 kB
ℹ dist/generated/types/com/emdashcms/experimental/package/releaseExtension.d.ts          9.12 kB │ gzip: 1.61 kB
ℹ dist/generated/types/com/emdashcms/experimental/package/release.d.ts                   8.64 kB │ gzip: 2.55 kB
ℹ dist/generated/types/com/emdashcms/experimental/package/profile.d.ts                   7.34 kB │ gzip: 1.68 kB
ℹ dist/index.d.ts                                                                        5.22 kB │ gzip: 1.34 kB
ℹ dist/generated/types/com/emdashcms/experimental/aggregator/defs.d.ts                   5.12 kB │ gzip: 1.44 kB
ℹ dist/generated/types/com/emdashcms/experimental/publisher/profile.d.ts                 3.47 kB │ gzip: 1.16 kB
ℹ dist/generated/types/com/emdashcms/experimental/aggregator/searchPackages.d.ts         2.48 kB │ gzip: 0.94 kB
ℹ dist/generated/types/com/emdashcms/experimental/publisher/verification.d.ts            2.38 kB │ gzip: 0.96 kB
ℹ dist/generated/types/com/emdashcms/experimental/aggregator/listReleases.d.ts           2.07 kB │ gzip: 0.80 kB
ℹ dist/generated/types/com/emdashcms/experimental/aggregator/resolvePackage.d.ts         1.26 kB │ gzip: 0.59 kB
ℹ dist/generated/types/com/emdashcms/experimental/aggregator/getLatestRelease.d.ts       1.25 kB │ gzip: 0.58 kB
ℹ dist/generated/types/com/emdashcms/experimental/aggregator/getPackage.d.ts             1.20 kB │ gzip: 0.57 kB
ℹ 49 files, total: 155.30 kB
✔ Build complete in 658ms
$ pnpm build
==> pnpm-build-workspace
$ pnpm run --filter {./packages/**} build
Scope: 34 of 63 workspace projects
packages/auth build$ tsdown
packages/blocks build$ tsdown
packages/contentful-to-portable-text build$ tsdown src/index.ts --format esm --dts --clean
packages/create-emdash build$ tsdown
packages/create-emdash build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/contentful-to-portable-text build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/auth build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/blocks build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/contentful-to-portable-text build: ℹ entry: src/index.ts
packages/contentful-to-portable-text build: ℹ tsconfig: tsconfig.json
packages/contentful-to-portable-text build: ℹ Build start
packages/contentful-to-portable-text build: ℹ Cleaning 4 files
packages/create-emdash build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/create-emdash/tsdown.config.ts
packages/create-emdash build: ℹ entry: src/index.ts
packages/create-emdash build: ℹ tsconfig: tsconfig.json
packages/create-emdash build: ℹ Build start
packages/auth build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/auth/tsdown.config.ts
packages/create-emdash build: ℹ Cleaning 3 files
packages/auth build: ℹ entry: src/index.ts, src/passkey/index.ts, src/adapters/kysely.ts, src/oauth/providers/github.ts, src/oauth/providers/google.ts
packages/auth build: ℹ tsconfig: tsconfig.json
packages/auth build: ℹ Build start
packages/auth build: ℹ Cleaning 32 files
packages/blocks build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/blocks/tsdown.config.ts
packages/blocks build: ℹ entry: src/index.ts, src/server.ts
packages/blocks build: ℹ tsconfig: tsconfig.json
packages/blocks build: ℹ Build start
packages/blocks build: ℹ Cleaning 10 files
packages/contentful-to-portable-text build: ℹ dist/index.mjs        15.95 kB │ gzip: 4.30 kB
packages/contentful-to-portable-text build: ℹ dist/index.mjs.map    39.25 kB │ gzip: 9.30 kB
packages/contentful-to-portable-text build: ℹ dist/index.d.mts.map   0.66 kB │ gzip: 0.33 kB
packages/contentful-to-portable-text build: ℹ dist/index.d.mts       2.15 kB │ gzip: 0.88 kB
packages/contentful-to-portable-text build: ℹ 4 files, total: 58.01 kB
packages/contentful-to-portable-text build: ✔ Build complete in 732ms
packages/contentful-to-portable-text build: Done
packages/gutenberg-to-portable-text build$ tsdown src/index.ts --format esm --dts --clean
packages/gutenberg-to-portable-text build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/gutenberg-to-portable-text build: ℹ entry: src/index.ts
packages/gutenberg-to-portable-text build: ℹ tsconfig: tsconfig.json
packages/gutenberg-to-portable-text build: ℹ Build start
packages/gutenberg-to-portable-text build: ℹ Cleaning 5 files
packages/create-emdash build: ℹ Granting execute permission to dist/index.mjs
packages/create-emdash build: ℹ dist/index.mjs      20.18 kB │ gzip:  6.50 kB
packages/create-emdash build: ℹ dist/index.mjs.map  38.84 kB │ gzip: 11.84 kB
packages/create-emdash build: ℹ dist/index.d.mts     0.01 kB │ gzip:  0.03 kB
packages/create-emdash build: ℹ 3 files, total: 59.03 kB
packages/create-emdash build: ✔ Build complete in 1186ms
packages/create-emdash build: Done
packages/plugin-types build$ tsdown
packages/plugin-types build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/plugin-types build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugin-types/tsdown.config.ts
packages/plugin-types build: ℹ entry: src/index.ts
packages/plugin-types build: ℹ target: es2023
packages/plugin-types build: ℹ tsconfig: tsconfig.json
packages/plugin-types build: ℹ Build start
packages/plugin-types build: ℹ Cleaning 4 files
packages/auth build: ℹ dist/index.mjs                         26.94 kB │ gzip:  6.91 kB
packages/auth build: ℹ dist/adapters/kysely.mjs               14.12 kB │ gzip:  3.19 kB
packages/auth build: ℹ dist/oauth/providers/github.mjs         1.64 kB │ gzip:  0.81 kB
packages/auth build: ℹ dist/oauth/providers/google.mjs         0.80 kB │ gzip:  0.44 kB
packages/auth build: ℹ dist/passkey/index.mjs                  0.47 kB │ gzip:  0.20 kB
packages/auth build: ℹ dist/index.mjs.map                     54.67 kB │ gzip: 13.41 kB
packages/auth build: ℹ dist/authenticate-BiDGbUVY.mjs.map     32.88 kB │ gzip:  8.68 kB
packages/auth build: ℹ dist/adapters/kysely.mjs.map           31.05 kB │ gzip:  6.62 kB
packages/auth build: ℹ dist/authenticate-BiDGbUVY.mjs         17.29 kB │ gzip:  4.89 kB
packages/auth build: ℹ dist/types-ndj-bYfi.mjs.map            11.74 kB │ gzip:  2.90 kB
packages/auth build: ℹ dist/index.d.mts.map                    4.35 kB │ gzip:  1.21 kB
packages/auth build: ℹ dist/types-DZ0waGOT.d.mts.map           3.67 kB │ gzip:  0.93 kB
packages/auth build: ℹ dist/oauth/providers/github.mjs.map     2.98 kB │ gzip:  1.30 kB
packages/auth build: ℹ dist/authenticate-Da9jec28.d.mts.map    2.05 kB │ gzip:  0.62 kB
packages/auth build: ℹ dist/types-ndj-bYfi.mjs                 1.53 kB │ gzip:  0.73 kB
packages/auth build: ℹ dist/oauth/providers/google.mjs.map     1.41 kB │ gzip:  0.69 kB
packages/auth build: ℹ dist/adapters/kysely.d.mts.map          0.80 kB │ gzip:  0.31 kB
packages/auth build: ℹ dist/types-Bu4irX9A.d.mts.map           0.39 kB │ gzip:  0.21 kB
packages/auth build: ℹ dist/oauth/providers/github.d.mts.map   0.18 kB │ gzip:  0.16 kB
packages/auth build: ℹ dist/oauth/providers/google.d.mts.map   0.14 kB │ gzip:  0.13 kB
packages/auth build: ℹ dist/index.d.mts                       18.52 kB │ gzip:  4.93 kB
packages/auth build: ℹ dist/adapters/kysely.d.mts              3.46 kB │ gzip:  1.05 kB
packages/auth build: ℹ dist/passkey/index.d.mts                1.00 kB │ gzip:  0.30 kB
packages/auth build: ℹ dist/oauth/providers/github.d.mts       0.43 kB │ gzip:  0.29 kB
packages/auth build: ℹ dist/oauth/providers/google.d.mts       0.21 kB │ gzip:  0.17 kB
packages/auth build: ℹ dist/types-DZ0waGOT.d.mts               6.77 kB │ gzip:  1.87 kB
packages/auth build: ℹ dist/authenticate-Da9jec28.d.mts        5.21 kB │ gzip:  1.49 kB
packages/auth build: ℹ dist/types-Bu4irX9A.d.mts               0.76 kB │ gzip:  0.38 kB
packages/auth build: ℹ 28 files, total: 245.46 kB
packages/auth build: ✔ Build complete in 1471ms
packages/auth build: Done
packages/registry-lexicons build$ pnpm run build:lexicons && pnpm run build:types
packages/gutenberg-to-portable-text build: ℹ dist/index.mjs           43.04 kB │ gzip:  9.98 kB
packages/gutenberg-to-portable-text build: ℹ dist/index.mjs.map       92.72 kB │ gzip: 20.21 kB
packages/gutenberg-to-portable-text build: ℹ dist/index.d.mts.map      3.63 kB │ gzip:  1.02 kB
packages/gutenberg-to-portable-text build: ℹ dist/chunk-DQk6qfdC.mjs   0.38 kB │ gzip:  0.26 kB
packages/gutenberg-to-portable-text build: ℹ dist/index.d.mts         11.56 kB │ gzip:  2.98 kB
packages/gutenberg-to-portable-text build: ℹ 5 files, total: 151.34 kB
packages/gutenberg-to-portable-text build: ✔ Build complete in 739ms
packages/gutenberg-to-portable-text build: Done
packages/x402 build$ tsdown
packages/x402 build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/x402 build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/x402/tsdown.config.ts
packages/x402 build: ℹ entry: src/index.ts, src/middleware.ts
packages/x402 build: ℹ tsconfig: tsconfig.json
packages/x402 build: ℹ Build start
packages/x402 build: ℹ Cleaning 10 files
packages/plugin-types build: ℹ dist/index.js         4.31 kB │ gzip: 1.96 kB
packages/plugin-types build: ℹ dist/index.js.map    13.45 kB │ gzip: 4.90 kB
packages/plugin-types build: ℹ dist/index.d.ts.map   1.23 kB │ gzip: 0.56 kB
packages/plugin-types build: ℹ dist/index.d.ts      10.06 kB │ gzip: 3.84 kB
packages/plugin-types build: ℹ 4 files, total: 29.04 kB
packages/plugin-types build: ✔ Build complete in 458ms
packages/plugin-types build: Done
packages/registry-lexicons build: $ node scripts/copy-lexicons.mjs
packages/registry-lexicons build: using in-package lexicon copy at /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-lexicons/lexicons/com/emdashcms/experimental (no source at /home/data/dev_react/awcms-micro/awcmsmicro-dev/lexicons/com/emdashcms/experimental)
packages/registry-lexicons build: $ tsdown
packages/registry-lexicons build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/registry-lexicons build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-lexicons/tsdown.config.ts
packages/registry-lexicons build: ℹ entry: src/index.ts, src/generated/types/com/emdashcms/experimental/aggregator/defs.ts, src/generated/types/com/emdashcms/experimental/aggregator/getLatestRelease.ts, src/generated/types/com/emdashcms/experimental/aggregator/getPackage.ts, src/generated/types/com/emdashcms/experimental/aggregator/listReleases.ts, src/generated/types/com/emdashcms/experimental/aggregator/resolvePackage.ts, src/generated/types/com/emdashcms/experimental/aggregator/searchPackages.ts, src/generated/types/com/emdashcms/experimental/package/profile.ts, src/generated/types/com/emdashcms/experimental/package/release.ts, src/generated/types/com/emdashcms/experimental/package/releaseExtension.ts, src/generated/types/com/emdashcms/experimental/publisher/profile.ts, src/generated/types/com/emdashcms/experimental/publisher/verification.ts
packages/registry-lexicons build: ℹ target: es2023
packages/registry-lexicons build: ℹ tsconfig: tsconfig.json
packages/registry-lexicons build: ℹ Build start
packages/registry-lexicons build: ℹ Cleaning 57 files
packages/blocks build: ℹ dist/index.js                      31.73 kB │ gzip:  7.17 kB
packages/blocks build: ℹ dist/server.js                      0.14 kB │ gzip:  0.11 kB
packages/blocks build: ℹ dist/validation-Dq-a7CXm.js.map    79.81 kB │ gzip: 10.78 kB
packages/blocks build: ℹ dist/index.js.map                  61.72 kB │ gzip: 13.83 kB
packages/blocks build: ℹ dist/validation-Dq-a7CXm.js        39.60 kB │ gzip:  5.81 kB
packages/blocks build: ℹ dist/validation-5vL6669b.d.ts.map   7.29 kB │ gzip:  1.42 kB
packages/blocks build: ℹ dist/index.d.ts.map                 0.50 kB │ gzip:  0.28 kB
packages/blocks build: ℹ dist/index.d.ts                     2.83 kB │ gzip:  1.01 kB
packages/blocks build: ℹ dist/server.d.ts                    1.22 kB │ gzip:  0.45 kB
packages/blocks build: ℹ dist/validation-5vL6669b.d.ts      15.63 kB │ gzip:  3.89 kB
packages/blocks build: ℹ 10 files, total: 240.44 kB
packages/blocks build: ✔ Build complete in 2428ms
packages/blocks build: Done
packages/x402 build: ℹ dist/middleware.mjs            6.17 kB │ gzip: 2.21 kB
packages/x402 build: ℹ dist/index.mjs                 0.90 kB │ gzip: 0.47 kB
packages/x402 build: ℹ dist/server-BKVUFgbf.mjs.map  12.72 kB │ gzip: 4.15 kB
packages/x402 build: ℹ dist/middleware.mjs.map       11.59 kB │ gzip: 3.91 kB
packages/x402 build: ℹ dist/server-BKVUFgbf.mjs       5.41 kB │ gzip: 2.04 kB
packages/x402 build: ℹ dist/index.mjs.map             3.29 kB │ gzip: 1.36 kB
packages/x402 build: ℹ dist/index.d.mts.map           1.01 kB │ gzip: 0.49 kB
packages/x402 build: ℹ dist/middleware.d.mts.map      0.12 kB │ gzip: 0.12 kB
packages/x402 build: ℹ dist/index.d.mts               4.73 kB │ gzip: 1.83 kB
packages/x402 build: ℹ dist/middleware.d.mts          0.38 kB │ gzip: 0.26 kB
packages/x402 build: ℹ 10 files, total: 46.34 kB
packages/x402 build: ✔ Build complete in 1221ms
packages/x402 build: Done
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/package/releaseExtension.js            5.50 kB │ gzip: 0.86 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/package/profile.js                     4.45 kB │ gzip: 0.78 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/package/release.js                     4.10 kB │ gzip: 0.81 kB
packages/registry-lexicons build: ℹ dist/index.js                                                                          3.85 kB │ gzip: 1.00 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/aggregator/defs.js                     2.53 kB │ gzip: 0.64 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/publisher/profile.js                   2.01 kB │ gzip: 0.58 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/aggregator/searchPackages.js           1.55 kB │ gzip: 0.53 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/aggregator/listReleases.js             1.41 kB │ gzip: 0.53 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/publisher/verification.js              0.99 kB │ gzip: 0.45 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/aggregator/getLatestRelease.js         0.87 kB │ gzip: 0.44 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/aggregator/resolvePackage.js           0.86 kB │ gzip: 0.44 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/aggregator/getPackage.js               0.84 kB │ gzip: 0.44 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/package/release.js.map                11.73 kB │ gzip: 3.21 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/package/releaseExtension.js.map       11.30 kB │ gzip: 2.06 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/package/profile.js.map                10.94 kB │ gzip: 2.32 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/aggregator/defs.js.map                 6.74 kB │ gzip: 1.81 kB
packages/registry-lexicons build: ℹ dist/index.js.map                                                                      6.29 kB │ gzip: 1.85 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/publisher/profile.js.map               4.96 kB │ gzip: 1.56 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/aggregator/searchPackages.js.map       3.95 kB │ gzip: 1.27 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/aggregator/listReleases.js.map         3.40 kB │ gzip: 1.11 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/publisher/verification.js.map          2.91 kB │ gzip: 1.14 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/package/releaseExtension.d.ts.map      2.29 kB │ gzip: 0.67 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/aggregator/resolvePackage.js.map       1.85 kB │ gzip: 0.79 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/aggregator/getLatestRelease.js.map     1.83 kB │ gzip: 0.78 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/aggregator/getPackage.js.map           1.80 kB │ gzip: 0.77 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/package/release.d.ts.map               1.01 kB │ gzip: 0.40 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/package/profile.d.ts.map               1.00 kB │ gzip: 0.42 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/publisher/profile.d.ts.map             0.61 kB │ gzip: 0.32 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/aggregator/defs.d.ts.map               0.59 kB │ gzip: 0.27 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/aggregator/searchPackages.d.ts.map     0.51 kB │ gzip: 0.28 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/aggregator/listReleases.d.ts.map       0.50 kB │ gzip: 0.28 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/aggregator/getLatestRelease.d.ts.map   0.48 kB │ gzip: 0.28 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/aggregator/resolvePackage.d.ts.map     0.48 kB │ gzip: 0.28 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/aggregator/getPackage.d.ts.map         0.47 kB │ gzip: 0.28 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/publisher/verification.d.ts.map        0.44 kB │ gzip: 0.27 kB
packages/registry-lexicons build: ℹ dist/chunk-BYypO7fO.js                                                                 0.38 kB │ gzip: 0.26 kB
packages/registry-lexicons build: ℹ dist/index.d.ts.map                                                                    0.35 kB │ gzip: 0.21 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/package/releaseExtension.d.ts          9.12 kB │ gzip: 1.61 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/package/release.d.ts                   8.64 kB │ gzip: 2.55 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/package/profile.d.ts                   7.34 kB │ gzip: 1.68 kB
packages/registry-lexicons build: ℹ dist/index.d.ts                                                                        5.22 kB │ gzip: 1.34 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/aggregator/defs.d.ts                   5.12 kB │ gzip: 1.44 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/publisher/profile.d.ts                 3.47 kB │ gzip: 1.16 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/aggregator/searchPackages.d.ts         2.48 kB │ gzip: 0.94 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/publisher/verification.d.ts            2.38 kB │ gzip: 0.96 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/aggregator/listReleases.d.ts           2.07 kB │ gzip: 0.80 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/aggregator/resolvePackage.d.ts         1.26 kB │ gzip: 0.59 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/aggregator/getLatestRelease.d.ts       1.25 kB │ gzip: 0.58 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/aggregator/getPackage.d.ts             1.20 kB │ gzip: 0.57 kB
packages/registry-lexicons build: ℹ 49 files, total: 155.30 kB
packages/registry-lexicons build: ✔ Build complete in 708ms
packages/registry-lexicons build: Done
packages/blocks/playground build$ vite build
packages/registry-client build$ tsdown
packages/registry-client build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/registry-client build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-client/tsdown.config.ts
packages/registry-client build: ℹ entry: src/index.ts, src/credentials/index.ts, src/discovery/index.ts, src/env/index.ts, src/publishing/index.ts
packages/registry-client build: ℹ target: node22
packages/registry-client build: ℹ tsconfig: tsconfig.json
packages/registry-client build: ℹ Build start
packages/registry-client build: ℹ Cleaning 30 files
packages/blocks/playground build: vite v6.4.3 building for production...
packages/blocks/playground build: transforming...
packages/registry-client build: ℹ dist/discovery/index.js           6.51 kB │ gzip:  2.58 kB
packages/registry-client build: ℹ dist/env/index.js                 5.11 kB │ gzip:  2.05 kB
packages/registry-client build: ℹ dist/publishing/index.js          5.04 kB │ gzip:  1.73 kB
packages/registry-client build: ℹ dist/credentials/index.js         1.65 kB │ gzip:  0.73 kB
packages/registry-client build: ℹ dist/index.js                     0.88 kB │ gzip:  0.32 kB
packages/registry-client build: ℹ dist/valid-CMFHzT1o.js.map       66.95 kB │ gzip: 16.20 kB
packages/registry-client build: ℹ dist/valid-CMFHzT1o.js           34.01 kB │ gzip:  7.36 kB
packages/registry-client build: ℹ dist/memory-CIuLotqL.js.map      25.98 kB │ gzip:  8.65 kB
packages/registry-client build: ℹ dist/publishing/index.js.map     14.70 kB │ gzip:  4.44 kB
packages/registry-client build: ℹ dist/discovery/index.js.map      11.96 kB │ gzip:  4.19 kB
packages/registry-client build: ℹ dist/memory-CIuLotqL.js          11.32 kB │ gzip:  4.14 kB
packages/registry-client build: ℹ dist/env/index.js.map             8.42 kB │ gzip:  3.12 kB
packages/registry-client build: ℹ dist/credentials/index.js.map     2.23 kB │ gzip:  0.95 kB
packages/registry-client build: ℹ dist/publishing/index.d.ts.map    1.59 kB │ gzip:  0.56 kB
packages/registry-client build: ℹ dist/memory-Ci3gbSC-.d.ts.map     1.12 kB │ gzip:  0.37 kB
packages/registry-client build: ℹ dist/discovery/index.d.ts.map     1.02 kB │ gzip:  0.42 kB
packages/registry-client build: ℹ dist/env/index.d.ts.map           0.61 kB │ gzip:  0.34 kB
packages/registry-client build: ℹ dist/types-DNGNVV4Q.d.ts.map      0.58 kB │ gzip:  0.30 kB
packages/registry-client build: ℹ dist/credentials/index.d.ts.map   0.16 kB │ gzip:  0.14 kB
packages/registry-client build: ℹ dist/discovery/index.d.ts         6.11 kB │ gzip:  2.40 kB
packages/registry-client build: ℹ dist/publishing/index.d.ts        5.79 kB │ gzip:  2.03 kB
packages/registry-client build: ℹ dist/env/index.d.ts               5.03 kB │ gzip:  1.99 kB
packages/registry-client build: ℹ dist/index.d.ts                   1.32 kB │ gzip:  0.43 kB
packages/registry-client build: ℹ dist/credentials/index.d.ts       1.13 kB │ gzip:  0.53 kB
packages/registry-client build: ℹ dist/types-DNGNVV4Q.d.ts          3.66 kB │ gzip:  1.65 kB
packages/registry-client build: ℹ dist/memory-Ci3gbSC-.d.ts         1.94 kB │ gzip:  0.60 kB
packages/registry-client build: ℹ 26 files, total: 224.81 kB
packages/registry-client build: ✔ Build complete in 860ms
packages/registry-client build: Done
packages/blocks/playground build: ✓ 5241 modules transformed.
packages/blocks/playground build: rendering chunks...
packages/blocks/playground build: computing gzip size...
packages/blocks/playground build: dist/index.html                     0.40 kB │ gzip:   0.28 kB
packages/blocks/playground build: dist/assets/index-J7vdwgIc.css    138.44 kB │ gzip:  22.18 kB
packages/blocks/playground build: dist/assets/index-B5Q0pG0V.js   1,240.53 kB │ gzip: 398.77 kB
packages/blocks/playground build: ✓ built in 5.30s
packages/blocks/playground build: (!) Some chunks are larger than 500 kB after minification. Consider:
packages/blocks/playground build: - Using dynamic import() to code-split the application
packages/blocks/playground build: - Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
packages/blocks/playground build: - Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
packages/blocks/playground build: Done
packages/admin build$ node --run locale:compile && tsdown && node --run locale:copy && npx @tailwindcss/cli -i src/styles.css -o dist/styles.css --minify
packages/plugin-cli build$ node --run gen-schema && tsdown
packages/plugin-cli build: Wrote /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugin-cli/schemas/emdash-plugin.schema.json
packages/plugin-cli build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/plugin-cli build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugin-cli/tsdown.config.ts
packages/plugin-cli build: ℹ entry: src/index.ts
packages/plugin-cli build: ℹ target: node22
packages/plugin-cli build: ℹ tsconfig: tsconfig.json
packages/plugin-cli build: ℹ entry: src/api.ts
packages/plugin-cli build: ℹ target: node22
packages/plugin-cli build: ℹ tsconfig: tsconfig.json
packages/plugin-cli build: ℹ Build start
packages/plugin-cli build: ℹ Cleaning 5 files
packages/admin build: Compiling message catalogs…
packages/admin build: Done in 555ms
packages/admin build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/admin build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tsdown.config.ts
packages/admin build: ℹ entry: src/index.ts, src/locales/index.ts
packages/admin build: ℹ tsconfig: tsconfig.json
packages/admin build: ℹ Build start
packages/admin build: ℹ Cleaning 86 files
packages/plugin-cli build: ℹ Granting execute permission to dist/index.mjs
packages/plugin-cli build: ℹ dist/index.mjs  270.52 kB │ gzip: 83.16 kB
packages/plugin-cli build: ℹ 1 files, total: 270.52 kB
packages/plugin-cli build: ✔ Build complete in 1309ms
packages/plugin-cli build: ℹ dist/api.mjs        107.86 kB │ gzip: 33.30 kB
packages/plugin-cli build: ℹ dist/api.mjs.map    225.30 kB │ gzip: 60.60 kB
packages/plugin-cli build: ℹ dist/api.d.mts.map    3.73 kB │ gzip:  1.30 kB
packages/plugin-cli build: ℹ dist/api.d.mts       18.09 kB │ gzip:  5.83 kB
packages/plugin-cli build: ℹ 4 files, total: 354.98 kB
packages/plugin-cli build: ✔ Build complete in 1324ms
packages/plugin-cli build: Done
packages/admin build: ℹ dist/index.js                                 1282.62 kB
packages/admin build: ℹ dist/locales/index.js                            0.42 kB │ gzip:  0.21 kB
packages/admin build: ℹ dist/index.js.map                             2050.41 kB
packages/admin build: ℹ dist/messages-DrMj1Hby.js.map                  153.41 kB │ gzip: 33.03 kB
packages/admin build: ℹ dist/messages-DrMj1Hby.js                      137.30 kB │ gzip: 32.13 kB
packages/admin build: ℹ dist/messages-CjirHcRw.js.map                  120.24 kB │ gzip: 32.15 kB
packages/admin build: ℹ dist/messages-DzQ203Bb.js.map                  116.16 kB │ gzip: 32.48 kB
packages/admin build: ℹ dist/messages-Du-_Uh8B.js.map                  111.33 kB │ gzip: 32.48 kB
packages/admin build: ℹ dist/messages-birF26ra.js.map                  105.37 kB │ gzip: 31.44 kB
packages/admin build: ℹ dist/messages-CjirHcRw.js                      104.24 kB │ gzip: 30.93 kB
packages/admin build: ℹ dist/messages-BunNlQic.js.map                  103.51 kB │ gzip: 31.87 kB
packages/admin build: ℹ dist/messages-rxZmXkNz.js.map                  100.01 kB │ gzip: 31.24 kB
packages/admin build: ℹ dist/messages-DzQ203Bb.js                       99.81 kB │ gzip: 31.41 kB
packages/admin build: ℹ dist/messages-BPzwf13U.js.map                   98.31 kB │ gzip: 31.49 kB
packages/admin build: ℹ dist/messages-DM8WFh_S.js.map                   98.16 kB │ gzip: 30.83 kB
packages/admin build: ℹ dist/messages-BLyCd3bH.js.map                   96.01 kB │ gzip: 31.16 kB
packages/admin build: ℹ dist/messages-Du-_Uh8B.js                       95.47 kB │ gzip: 31.42 kB
packages/admin build: ℹ dist/messages-ClrLd7GR.js.map                   94.86 kB │ gzip: 31.52 kB
packages/admin build: ℹ dist/messages-C4ONkHEI.js.map                   94.17 kB │ gzip: 30.58 kB
packages/admin build: ℹ dist/messages-CkDIrR_T.js.map                   93.23 kB │ gzip: 29.29 kB
packages/admin build: ℹ dist/messages-birF26ra.js                       89.49 kB │ gzip: 30.05 kB
packages/admin build: ℹ dist/messages-Cc5L5f4F.js.map                   89.44 kB │ gzip: 28.04 kB
packages/admin build: ℹ dist/messages-ngvpRuG5.js.map                   88.92 kB │ gzip: 29.09 kB
packages/admin build: ℹ dist/messages-C3wS1VMq.js.map                   88.45 kB │ gzip: 28.33 kB
packages/admin build: ℹ dist/messages-DW5uspYc.js.map                   87.63 kB │ gzip: 30.96 kB
packages/admin build: ℹ dist/messages-BunNlQic.js                       87.55 kB │ gzip: 30.63 kB
packages/admin build: ℹ dist/messages-C78AzU3C.js.map                   87.24 kB │ gzip: 29.57 kB
packages/admin build: ℹ dist/messages-rxZmXkNz.js                       84.03 kB │ gzip: 29.89 kB
packages/admin build: ℹ dist/messages-BPzwf13U.js                       82.28 kB │ gzip: 30.31 kB
packages/admin build: ℹ dist/messages-DM8WFh_S.js                       82.21 kB │ gzip: 29.47 kB
packages/admin build: ℹ dist/messages-BLyCd3bH.js                       80.00 kB │ gzip: 29.84 kB
packages/admin build: ℹ dist/messages-ClrLd7GR.js                       78.60 kB │ gzip: 30.17 kB
packages/admin build: ℹ dist/messages-C4ONkHEI.js                       78.17 kB │ gzip: 29.27 kB
packages/admin build: ℹ dist/messages-CkDIrR_T.js                       77.37 kB │ gzip: 27.97 kB
packages/admin build: ℹ dist/messages-Cc5L5f4F.js                       73.91 kB │ gzip: 26.79 kB
packages/admin build: ℹ dist/messages-ngvpRuG5.js                       72.92 kB │ gzip: 27.80 kB
packages/admin build: ℹ dist/messages-C3wS1VMq.js                       72.45 kB │ gzip: 27.04 kB
packages/admin build: ℹ dist/messages-DW5uspYc.js                       71.62 kB │ gzip: 29.73 kB
packages/admin build: ℹ dist/messages-C78AzU3C.js                       71.21 kB │ gzip: 28.37 kB
packages/admin build: ℹ dist/index.d.ts.map                             35.43 kB │ gzip:  8.02 kB
packages/admin build: ℹ dist/LocaleDirectionProvider-BaWxbGDJ.js.map    15.21 kB │ gzip:  5.27 kB
packages/admin build: ℹ dist/plugins-BZzztFdK.js.map                    11.23 kB │ gzip:  3.78 kB
packages/admin build: ℹ dist/LocaleDirectionProvider-BaWxbGDJ.js         9.18 kB │ gzip:  3.22 kB
packages/admin build: ℹ dist/plugins-BZzztFdK.js                         3.95 kB │ gzip:  1.50 kB
packages/admin build: ℹ dist/config-76UcBWeH.d.ts.map                    0.70 kB │ gzip:  0.38 kB
packages/admin build: ℹ dist/index.d.ts                                129.18 kB │ gzip: 24.68 kB
packages/admin build: ℹ dist/locales/index.d.ts                          0.47 kB │ gzip:  0.24 kB
packages/admin build: ℹ dist/config-76UcBWeH.d.ts                        2.97 kB │ gzip:  1.25 kB
packages/admin build: ℹ 48 files, total: 6906.82 kB
packages/admin build: ✔ Build complete in 4807ms
packages/admin build: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugins. Here is a breakdown:
packages/admin build:   - rolldown-plugin-dts:generate (59%)
packages/admin build:   - tsdown:external (30%)
packages/admin build: See https://rolldown.rs/options/checks#plugintimings for more details.
packages/admin build: ≈ tailwindcss v4.3.0
packages/admin build: Done in 335ms
packages/admin build: Done
packages/core build$ tsdown
packages/core build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/core build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/core/tsdown.config.ts
packages/core build: ℹ entry: src/index.ts, src/request-context.ts, src/astro/index.ts, src/astro/middleware.ts, src/astro/middleware/setup.ts, src/astro/middleware/auth.ts, src/astro/middleware/redirect.ts, src/astro/middleware/request-context.ts, src/astro/types.ts, src/db/index.ts, src/db/sqlite.ts, src/db/libsql.ts, src/db/postgres.ts, src/database/instrumentation.ts, src/storage/local.ts, src/storage/s3.ts, src/media/index.ts, src/media/local-runtime.ts, src/runtime.ts, src/seed/index.ts, src/cli/index.ts, src/client/index.ts, src/client/cf-access.ts, src/seo/index.ts, src/page/index.ts, src/plugin-utils.ts, src/plugin-types.ts, src/plugins/adapt-sandbox-entry.ts, src/api/route-utils.ts, src/api/schemas/index.ts, src/auth/providers/github.ts, src/auth/providers/google.ts
packages/core build: ℹ tsconfig: tsconfig.json
packages/core build: ℹ Build start
packages/core build: ℹ Cleaning 1114 files
packages/core build: ℹ Granting execute permission to dist/cli/index.mjs
packages/core build: ℹ dist/cli/index.mjs                                                            146.68 kB │ gzip: 37.09 kB
packages/core build: ℹ dist/astro/middleware.mjs                                                     106.38 kB │ gzip: 28.59 kB
packages/core build: ℹ dist/astro/routes/api/openapi.json.mjs                                         90.41 kB │ gzip: 14.40 kB
packages/core build: ℹ dist/astro/routes/api/mcp.mjs                                                  68.08 kB │ gzip: 15.08 kB
packages/core build: ℹ dist/astro/index.mjs                                                           66.04 kB │ gzip: 15.45 kB
packages/core build: ℹ dist/astro/middleware/request-context.mjs                                      41.28 kB │ gzip: 10.35 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/execute.mjs                             26.48 kB │ gzip:  8.21 kB
packages/core build: ℹ dist/astro/middleware/auth.mjs                                                 21.78 kB │ gzip:  6.02 kB
packages/core build: ℹ dist/page/index.mjs                                                            13.75 kB │ gzip:  4.05 kB
packages/core build: ℹ dist/client/index.mjs                                                          13.03 kB │ gzip:  3.53 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/registry/artifact.mjs                      12.64 kB │ gzip:  4.54 kB
packages/core build: ℹ dist/astro/routes/api/oauth/authorize.mjs                                      11.85 kB │ gzip:  3.50 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/analyze.mjs                              9.96 kB │ gzip:  3.37 kB
packages/core build: ℹ dist/astro/routes/api/snapshot.mjs                                              9.29 kB │ gzip:  3.58 kB
packages/core build: ℹ dist/index.mjs                                                                  8.53 kB │ gzip:  2.60 kB
packages/core build: ℹ dist/astro/routes/api/comments/_collection_/_contentId_/index.mjs               8.32 kB │ gzip:  2.59 kB
packages/core build: ℹ dist/api/schemas/index.mjs                                                      8.31 kB │ gzip:  1.95 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress-plugin/execute.mjs                       8.17 kB │ gzip:  2.75 kB
packages/core build: ℹ dist/storage/s3.mjs                                                             7.78 kB │ gzip:  2.79 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/media.mjs                                6.56 kB │ gzip:  2.13 kB
packages/core build: ℹ dist/plugins/adapt-sandbox-entry.mjs                                            5.88 kB │ gzip:  2.21 kB
packages/core build: ℹ dist/astro/routes/api/media.mjs                                                 5.75 kB │ gzip:  2.13 kB
packages/core build: ℹ dist/astro/routes/api/auth/oauth/_provider_/callback.mjs                        5.73 kB │ gzip:  2.02 kB
packages/core build: ℹ dist/client/cf-access.mjs                                                       5.69 kB │ gzip:  2.17 kB
packages/core build: ℹ dist/storage/local.mjs                                                          5.56 kB │ gzip:  2.04 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/rewrite-urls.mjs                         5.56 kB │ gzip:  1.82 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_.mjs                             5.19 kB │ gzip:  1.47 kB
packages/core build: ℹ dist/astro/routes/api/setup/dev-bypass.mjs                                      5.05 kB │ gzip:  2.01 kB
packages/core build: ℹ dist/astro/routes/api/oauth/token.mjs                                           4.98 kB │ gzip:  1.68 kB
packages/core build: ℹ dist/astro/routes/sitemap-_collection_.xml.mjs                                  4.90 kB │ gzip:  1.84 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/rewrite-url-helpers.mjs                  4.64 kB │ gzip:  1.71 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs            4.57 kB │ gzip:  1.49 kB
packages/core build: ℹ dist/astro/routes/api/oauth/register.mjs                                        4.42 kB │ gzip:  1.65 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/registry/install.mjs                        4.40 kB │ gzip:  1.73 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/_id_/index.mjs                                4.37 kB │ gzip:  1.46 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/prepare.mjs                              4.34 kB │ gzip:  1.62 kB
packages/core build: ℹ dist/astro/routes/api/settings/email.mjs                                        4.32 kB │ gzip:  1.72 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/registry/_id_/update.mjs                    4.27 kB │ gzip:  1.59 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/_slug_/index.mjs                       3.81 kB │ gzip:  1.15 kB
packages/core build: ℹ dist/astro/routes/api/setup/index.mjs                                           3.76 kB │ gzip:  1.42 kB
packages/core build: ℹ dist/media/local-runtime.mjs                                                    3.75 kB │ gzip:  1.18 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs          3.72 kB │ gzip:  1.04 kB
packages/core build: ℹ dist/astro/routes/api/setup/admin-verify.mjs                                    3.69 kB │ gzip:  1.41 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/_name_/widgets/_id_.mjs                      3.65 kB │ gzip:  1.11 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/install.mjs                3.58 kB │ gzip:  1.32 kB
packages/core build: ℹ dist/astro/routes/api/media/upload-url.mjs                                      3.54 kB │ gzip:  1.47 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/register/verify.mjs                          3.52 kB │ gzip:  1.36 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/_id_/status.mjs                            3.49 kB │ gzip:  1.31 kB
packages/core build: ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_/translations.mjs           3.48 kB │ gzip:  1.13 kB
packages/core build: ℹ dist/astro/routes/api/media/_id_.mjs                                            3.43 kB │ gzip:  1.04 kB
packages/core build: ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_.mjs                        3.42 kB │ gzip:  0.96 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/schedule.mjs                    3.34 kB │ gzip:  1.04 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/update.mjs                             3.30 kB │ gzip:  1.21 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/preview-url.mjs                 3.19 kB │ gzip:  1.33 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/_slug_/fields/index.mjs                3.19 kB │ gzip:  1.00 kB
packages/core build: ℹ dist/astro/routes/api/media/providers/_providerId_/index.mjs                    3.15 kB │ gzip:  1.14 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/updates.mjs                                 3.15 kB │ gzip:  1.14 kB
packages/core build: ℹ dist/astro/routes/api/admin/bylines/index.mjs                                   3.11 kB │ gzip:  1.20 kB
packages/core build: ℹ dist/astro/routes/api/admin/bylines/_id_/index.mjs                              3.10 kB │ gzip:  1.07 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/registry/_id_/uninstall.mjs                 3.10 kB │ gzip:  1.11 kB
packages/core build: ℹ dist/astro/routes/api/plugins/_pluginId_/_...path_.mjs                          3.09 kB │ gzip:  1.37 kB
packages/core build: ℹ dist/astro/middleware/redirect.mjs                                              3.08 kB │ gzip:  1.30 kB
packages/core build: ℹ dist/astro/routes/api/setup/admin.mjs                                           3.07 kB │ gzip:  1.24 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/index.mjs                            3.03 kB │ gzip:  1.14 kB
packages/core build: ℹ dist/astro/routes/api/auth/oauth/_provider_.mjs                                 3.00 kB │ gzip:  1.17 kB
packages/core build: ℹ dist/astro/routes/api/admin/oauth-clients/_id_.mjs                              3.00 kB │ gzip:  0.97 kB
packages/core build: ℹ dist/astro/routes/api/admin/themes/marketplace/index.mjs                        2.99 kB │ gzip:  1.12 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/uninstall.mjs                          2.99 kB │ gzip:  1.11 kB
packages/core build: ℹ dist/astro/routes/api/admin/bylines/_id_/translations.mjs                       2.98 kB │ gzip:  1.13 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/enable.mjs                             2.97 kB │ gzip:  1.09 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/index.mjs                              2.92 kB │ gzip:  0.99 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/publish.mjs                     2.88 kB │ gzip:  1.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/allowed-domains/_domain_.mjs                        2.86 kB │ gzip:  0.99 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/_slug_/fields/reorder.mjs              2.83 kB │ gzip:  0.97 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/marketplace/index.mjs                       2.80 kB │ gzip:  1.03 kB
packages/core build: ℹ dist/astro/routes/api/redirects/_id_.mjs                                        2.80 kB │ gzip:  0.84 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/disable.mjs                            2.80 kB │ gzip:  1.04 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/_id_.mjs                                     2.78 kB │ gzip:  0.98 kB
packages/core build: ℹ dist/astro/routes/api/auth/signup/complete.mjs                                  2.78 kB │ gzip:  1.16 kB
packages/core build: ℹ dist/astro/routes/api/admin/allowed-domains/index.mjs                           2.77 kB │ gzip:  1.05 kB
packages/core build: ℹ dist/astro/routes/api/auth/invite/complete.mjs                                  2.75 kB │ gzip:  1.14 kB
packages/core build: ℹ dist/astro/routes/api/auth/dev-bypass.mjs                                       2.72 kB │ gzip:  1.27 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress-plugin/analyze.mjs                       2.71 kB │ gzip:  1.14 kB
packages/core build: ℹ dist/astro/routes/api/schema/orphans/_slug_.mjs                                 2.69 kB │ gzip:  1.01 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/index.mjs                  2.67 kB │ gzip:  0.95 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_/translations.mjs                             2.66 kB │ gzip:  0.94 kB
packages/core build: ℹ dist/astro/routes/api/typegen.mjs                                               2.66 kB │ gzip:  1.06 kB
packages/core build: ℹ dist/astro/routes/api/admin/themes/marketplace/_id_/index.mjs                   2.65 kB │ gzip:  0.96 kB
packages/core build: ℹ dist/seo/index.mjs                                                              2.65 kB │ gzip:  1.04 kB
packages/core build: ℹ dist/plugin-utils.mjs                                                           2.63 kB │ gzip:  1.21 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/options.mjs                                  2.60 kB │ gzip:  1.07 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/register/options.mjs                         2.58 kB │ gzip:  1.06 kB
packages/core build: ℹ dist/astro/routes/api/sections/_slug_.mjs                                       2.58 kB │ gzip:  0.79 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/index.mjs                              2.56 kB │ gzip:  0.96 kB
packages/core build: ℹ dist/astro/routes/api/schema/index.mjs                                          2.54 kB │ gzip:  1.11 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/index.mjs                                    2.53 kB │ gzip:  1.01 kB
packages/core build: ℹ dist/astro/routes/api/taxonomies/_name_/terms/index.mjs                         2.52 kB │ gzip:  0.91 kB
packages/core build: ℹ dist/database/instrumentation.mjs                                               2.51 kB │ gzip:  1.22 kB
packages/core build: ℹ dist/astro/routes/api/redirects/404s/index.mjs                                  2.48 kB │ gzip:  0.81 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/verify.mjs                                   2.47 kB │ gzip:  1.02 kB
packages/core build: ℹ dist/astro/routes/api/media/_id_/confirm.mjs                                    2.44 kB │ gzip:  1.08 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_.mjs                                          2.41 kB │ gzip:  0.75 kB
packages/core build: ℹ dist/astro/routes/api/auth/magic-link/send.mjs                                  2.41 kB │ gzip:  0.98 kB
packages/core build: ℹ dist/astro/routes/sitemap.xml.mjs                                               2.40 kB │ gzip:  1.10 kB
packages/core build: ℹ dist/astro/routes/api/setup/status.mjs                                          2.39 kB │ gzip:  1.03 kB
packages/core build: ℹ dist/astro/routes/api/admin/byline-fields/_slug_.mjs                            2.37 kB │ gzip:  0.75 kB
packages/core build: ℹ dist/astro/routes/api/admin/hooks/exclusive/_hookName_.mjs                      2.36 kB │ gzip:  1.04 kB
packages/core build: ℹ dist/astro/routes/api/media/providers/_providerId_/_itemId_.mjs                 2.36 kB │ gzip:  0.78 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/_name_/widgets.mjs                           2.36 kB │ gzip:  1.03 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/index.mjs                                   2.33 kB │ gzip:  0.91 kB
packages/core build: ℹ dist/astro/routes/api/auth/invite/index.mjs                                     2.32 kB │ gzip:  1.07 kB
packages/core build: ℹ dist/astro/routes/api/auth/invite/register-options.mjs                          2.31 kB │ gzip:  1.01 kB
packages/core build: ℹ dist/astro/routes/api/settings.mjs                                              2.28 kB │ gzip:  0.92 kB
packages/core build: ℹ dist/astro/routes/api/schema/orphans/index.mjs                                  2.28 kB │ gzip:  0.85 kB
packages/core build: ℹ dist/astro/routes/api/auth/signup/request.mjs                                   2.27 kB │ gzip:  0.99 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_/items/_id_.mjs                               2.24 kB │ gzip:  0.78 kB
packages/core build: ℹ dist/astro/routes/api/taxonomies/index.mjs                                      2.23 kB │ gzip:  0.85 kB
packages/core build: ℹ dist/astro/routes/api/admin/oauth-clients/index.mjs                             2.20 kB │ gzip:  0.90 kB
packages/core build: ℹ dist/astro/routes/api/themes/preview.mjs                                        2.15 kB │ gzip:  0.98 kB
packages/core build: ℹ dist/astro/routes/api/search/rebuild.mjs                                        2.15 kB │ gzip:  0.93 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/_name_.mjs                                   2.15 kB │ gzip:  0.79 kB
packages/core build: ℹ dist/astro/routes/api/admin/api-tokens/index.mjs                                2.13 kB │ gzip:  0.93 kB
packages/core build: ℹ dist/astro/routes/api/redirects/index.mjs                                       2.13 kB │ gzip:  0.79 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/_id_/send-recovery.mjs                        2.03 kB │ gzip:  0.97 kB
packages/core build: ℹ dist/astro/routes/api/oauth/device/token.mjs                                    2.01 kB │ gzip:  0.94 kB
packages/core build: ℹ dist/astro/routes/api/search/index.mjs                                          2.01 kB │ gzip:  0.95 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/index.mjs                                     2.00 kB │ gzip:  0.95 kB
packages/core build: ℹ dist/astro/routes/api/search/enable.mjs                                         1.98 kB │ gzip:  0.87 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/_id_/disable.mjs                              1.96 kB │ gzip:  0.90 kB
packages/core build: ℹ dist/astro/routes/api/sections/index.mjs                                        1.93 kB │ gzip:  0.74 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/_name_/reorder.mjs                           1.93 kB │ gzip:  0.88 kB
packages/core build: ℹ dist/astro/routes/robots.txt.mjs                                                1.88 kB │ gzip:  0.85 kB
packages/core build: ℹ dist/astro/middleware/setup.mjs                                                 1.86 kB │ gzip:  0.86 kB
packages/core build: ℹ dist/astro/routes/api/media/file/_...key_.mjs                                   1.84 kB │ gzip:  0.95 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/duplicate.mjs                   1.81 kB │ gzip:  0.77 kB
packages/core build: ℹ dist/astro/routes/api/oauth/device/code.mjs                                     1.80 kB │ gzip:  0.84 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/discard-draft.mjs               1.78 kB │ gzip:  0.77 kB
packages/core build: ℹ dist/astro/routes/api/auth/me.mjs                                               1.77 kB │ gzip:  0.84 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/unpublish.mjs                   1.77 kB │ gzip:  0.76 kB
packages/core build: ℹ dist/request-context.mjs                                                        1.76 kB │ gzip:  0.90 kB
packages/core build: ℹ dist/api/route-utils.mjs                                                        1.76 kB │ gzip:  0.83 kB
packages/core build: ℹ dist/astro/routes/api/admin/byline-fields/index.mjs                             1.73 kB │ gzip:  0.67 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/restore.mjs                     1.72 kB │ gzip:  0.74 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/_id_.mjs                                   1.70 kB │ gzip:  0.66 kB
packages/core build: ℹ dist/astro/routes/api/search/suggest.mjs                                        1.68 kB │ gzip:  0.83 kB
packages/core build: ℹ dist/astro/routes/api/menus/index.mjs                                           1.66 kB │ gzip:  0.68 kB
packages/core build: ℹ dist/astro/routes/api/auth/magic-link/verify.mjs                                1.65 kB │ gzip:  0.72 kB
packages/core build: ℹ dist/astro/routes/api/revisions/_revisionId_/restore.mjs                        1.64 kB │ gzip:  0.70 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/translations.mjs                1.58 kB │ gzip:  0.77 kB
packages/core build: ℹ dist/astro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs               1.56 kB │ gzip:  0.76 kB
packages/core build: ℹ dist/astro/routes/api/manifest.mjs                                              1.56 kB │ gzip:  0.80 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/icon.mjs                   1.54 kB │ gzip:  0.75 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/index.mjs                                  1.48 kB │ gzip:  0.69 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/bulk.mjs                                   1.48 kB │ gzip:  0.67 kB
packages/core build: ℹ dist/astro/routes/api/redirects/404s/summary.mjs                                1.46 kB │ gzip:  0.67 kB
packages/core build: ℹ dist/astro/routes/api/admin/hooks/exclusive/index.mjs                           1.45 kB │ gzip:  0.73 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_/reorder.mjs                                  1.44 kB │ gzip:  0.67 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_/items.mjs                                    1.43 kB │ gzip:  0.67 kB
packages/core build: ℹ dist/astro/routes/api/import/probe.mjs                                          1.38 kB │ gzip:  0.67 kB
packages/core build: ℹ dist/astro/routes/api/well-known/auth.mjs                                       1.37 kB │ gzip:  0.66 kB
packages/core build: ℹ dist/astro/routes/api/oauth/device/authorize.mjs                                1.34 kB │ gzip:  0.69 kB
packages/core build: ℹ dist/astro/routes/api/auth/signup/verify.mjs                                    1.32 kB │ gzip:  0.71 kB
packages/core build: ℹ dist/runtime.mjs                                                                1.32 kB │ gzip:  0.64 kB
packages/core build: ℹ dist/astro/routes/api/auth/invite/accept.mjs                                    1.28 kB │ gzip:  0.68 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/_id_/enable.mjs                               1.28 kB │ gzip:  0.67 kB
packages/core build: ℹ dist/astro/routes/api/admin/byline-fields/reorder.mjs                           1.24 kB │ gzip:  0.56 kB
packages/core build: ℹ dist/astro/routes/api/admin/api-tokens/_id_.mjs                                 1.24 kB │ gzip:  0.66 kB
packages/core build: ℹ dist/db/index.mjs                                                               1.22 kB │ gzip:  0.56 kB
packages/core build: ℹ dist/astro/routes/api/oauth/token/refresh.mjs                                   1.19 kB │ gzip:  0.62 kB
packages/core build: ℹ dist/astro/routes/api/well-known/oauth-authorization-server.mjs                 1.18 kB │ gzip:  0.58 kB
packages/core build: ℹ dist/media/index.mjs                                                            1.18 kB │ gzip:  0.59 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/trash.mjs                            1.17 kB │ gzip:  0.58 kB
packages/core build: ℹ dist/astro/routes/api/oauth/token/revoke.mjs                                    1.14 kB │ gzip:  0.60 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/index.mjs                                    1.07 kB │ gzip:  0.60 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/revisions.mjs                   1.04 kB │ gzip:  0.56 kB
packages/core build: ℹ dist/astro/routes/api/search/stats.mjs                                          1.03 kB │ gzip:  0.56 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/permanent.mjs                   1.02 kB │ gzip:  0.53 kB
packages/core build: ℹ dist/astro/routes/api/setup/dev-reset.mjs                                       1.01 kB │ gzip:  0.57 kB
packages/core build: ℹ dist/astro/routes/api/admin/byline-fields/_slug_/usage.mjs                      0.99 kB │ gzip:  0.51 kB
packages/core build: ℹ dist/astro/routes/api/dashboard.mjs                                             0.99 kB │ gzip:  0.53 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress-plugin/callback.mjs                      0.97 kB │ gzip:  0.53 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/counts.mjs                                 0.95 kB │ gzip:  0.50 kB
packages/core build: ℹ dist/astro/routes/api/auth/mode.mjs                                             0.94 kB │ gzip:  0.56 kB
packages/core build: ℹ dist/seed/index.mjs                                                             0.92 kB │ gzip:  0.42 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/compare.mjs                     0.84 kB │ gzip:  0.47 kB
packages/core build: ℹ dist/astro/routes/api/dev/emails.mjs                                            0.83 kB │ gzip:  0.41 kB
packages/core build: ℹ dist/astro/routes/api/auth/logout.mjs                                           0.81 kB │ gzip:  0.47 kB
packages/core build: ℹ dist/astro/routes/api/revisions/_revisionId_/index.mjs                          0.78 kB │ gzip:  0.45 kB
packages/core build: ℹ dist/astro/routes/api/media/providers/index.mjs                                 0.77 kB │ gzip:  0.45 kB
packages/core build: ℹ dist/astro/routes/api/well-known/oauth-protected-resource.mjs                   0.74 kB │ gzip:  0.46 kB
packages/core build: ℹ dist/astro/routes/PluginRegistry.mjs                                            0.73 kB │ gzip:  0.41 kB
packages/core build: ℹ dist/db/postgres.mjs                                                            0.69 kB │ gzip:  0.36 kB
packages/core build: ℹ dist/astro/routes/api/widget-components.mjs                                     0.61 kB │ gzip:  0.36 kB
packages/core build: ℹ dist/db/sqlite.mjs                                                              0.52 kB │ gzip:  0.32 kB
packages/core build: ℹ dist/auth/providers/github.mjs                                                  0.44 kB │ gzip:  0.29 kB
packages/core build: ℹ dist/auth/providers/google.mjs                                                  0.44 kB │ gzip:  0.29 kB
packages/core build: ℹ dist/db/libsql.mjs                                                              0.44 kB │ gzip:  0.28 kB
packages/core build: ℹ dist/astro/types.mjs                                                            0.01 kB │ gzip:  0.03 kB
packages/core build: ℹ dist/plugin-types.mjs                                                           0.01 kB │ gzip:  0.03 kB
packages/core build: ℹ dist/api-CYMbRBfh.mjs.map                                                     306.93 kB │ gzip: 66.70 kB
packages/core build: ℹ dist/cli/index.mjs.map                                                        291.41 kB │ gzip: 67.35 kB
packages/core build: ℹ dist/runner--4wMWwKM.mjs.map                                                  268.58 kB │ gzip: 50.03 kB
packages/core build: ℹ dist/astro/middleware.mjs.map                                                 238.66 kB │ gzip: 62.83 kB
packages/core build: ℹ dist/menus-BeM6cZbr.mjs.map                                                   194.34 kB │ gzip: 44.20 kB
packages/core build: ℹ dist/astro/routes/api/openapi.json.mjs.map                                    170.45 kB │ gzip: 23.58 kB
packages/core build: ℹ dist/api-CYMbRBfh.mjs                                                         145.09 kB │ gzip: 32.93 kB
packages/core build: ℹ dist/runner--4wMWwKM.mjs                                                      141.59 kB │ gzip: 26.50 kB
packages/core build: ℹ dist/astro/index.mjs.map                                                      141.06 kB │ gzip: 33.81 kB
packages/core build: ℹ dist/astro/routes/api/mcp.mjs.map                                             126.65 kB │ gzip: 24.52 kB
packages/core build: ℹ dist/import-Dh8bWmyq.mjs.map                                                  112.07 kB │ gzip: 25.69 kB
packages/core build: ℹ dist/redirects-C0L9JUk4.mjs.map                                                97.42 kB │ gzip: 16.62 kB
packages/core build: ℹ dist/menus-BeM6cZbr.mjs                                                        89.61 kB │ gzip: 20.90 kB
packages/core build: ℹ dist/byline-CgrE_Ryv.mjs.map                                                   78.05 kB │ gzip: 20.58 kB
packages/core build: ℹ dist/content-BUDtGVH9.mjs.map                                                  69.84 kB │ gzip: 15.90 kB
packages/core build: ℹ dist/context-CNmZ3Nda.mjs.map                                                  66.64 kB │ gzip: 15.80 kB
packages/core build: ℹ dist/apply-CX9AE40u.mjs.map                                                    65.82 kB │ gzip: 16.76 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/execute.mjs.map                         59.52 kB │ gzip: 17.62 kB
packages/core build: ℹ dist/registry-D9s4iDbE.mjs.map                                                 54.83 kB │ gzip: 13.21 kB
packages/core build: ℹ dist/menus-0A34Oekk.mjs.map                                                    50.90 kB │ gzip: 12.05 kB
packages/core build: ℹ dist/loader-CjtldvSH.mjs.map                                                   49.36 kB │ gzip: 13.97 kB
packages/core build: ℹ dist/astro/middleware/request-context.mjs.map                                  49.16 kB │ gzip: 12.37 kB
packages/core build: ℹ dist/query-BaWRTEos.mjs.map                                                    49.09 kB │ gzip: 14.83 kB
packages/core build: ℹ dist/import-Dh8bWmyq.mjs                                                       48.70 kB │ gzip: 11.84 kB
packages/core build: ℹ dist/redirects-C0L9JUk4.mjs                                                    47.32 kB │ gzip:  9.55 kB
packages/core build: ℹ dist/astro/middleware/auth.mjs.map                                             44.81 kB │ gzip: 12.43 kB
packages/core build: ℹ dist/byline-CgrE_Ryv.mjs                                                       39.30 kB │ gzip: 10.76 kB
packages/core build: ℹ dist/index-Ch7w7zqc.d.mts.map                                                  37.37 kB │ gzip: 10.34 kB
packages/core build: ℹ dist/content-BUDtGVH9.mjs                                                      34.87 kB │ gzip:  8.41 kB
packages/core build: ℹ dist/validate-DK_97kMR.mjs.map                                                 34.77 kB │ gzip:  7.51 kB
packages/core build: ℹ dist/taxonomies-D3Li3jCd.mjs.map                                               34.53 kB │ gzip:  8.01 kB
packages/core build: ℹ dist/byline-registry-CxK5g559.mjs.map                                          33.30 kB │ gzip:  9.67 kB
packages/core build: ℹ dist/client/index.mjs.map                                                      33.25 kB │ gzip:  7.97 kB
packages/core build: ℹ dist/redirects-dNHo3LUJ.mjs.map                                                32.59 kB │ gzip:  8.18 kB
packages/core build: ℹ dist/apply-CX9AE40u.mjs                                                        32.53 kB │ gzip:  8.25 kB
packages/core build: ℹ dist/page/index.mjs.map                                                        31.02 kB │ gzip:  8.42 kB
packages/core build: ℹ dist/device-flow-ptLrVINd.mjs.map                                              29.83 kB │ gzip:  7.18 kB
packages/core build: ℹ dist/context-CNmZ3Nda.mjs                                                      28.49 kB │ gzip:  7.55 kB
packages/core build: ℹ dist/error-RwM4dD35.mjs.map                                                    27.57 kB │ gzip:  6.54 kB
packages/core build: ℹ dist/registry-D9s4iDbE.mjs                                                     27.45 kB │ gzip:  6.96 kB
packages/core build: ℹ dist/search-DYlf61Nt.mjs.map                                                   26.55 kB │ gzip:  8.21 kB
packages/core build: ℹ dist/redirect-BCeA5KRZ.mjs.map                                                 26.36 kB │ gzip:  6.98 kB
packages/core build: ℹ dist/transport--Ck3RBin.mjs.map                                                26.06 kB │ gzip:  7.48 kB
packages/core build: ℹ dist/taxonomies-CzsEHhdJ.mjs.map                                               25.78 kB │ gzip:  6.33 kB
packages/core build: ℹ dist/secrets-YYbTgB1w.mjs.map                                                  24.92 kB │ gzip:  8.49 kB
packages/core build: ℹ dist/fts-manager-1RgHmopc.mjs.map                                              24.82 kB │ gzip:  6.62 kB
packages/core build: ℹ dist/loader-CjtldvSH.mjs                                                       24.07 kB │ gzip:  7.25 kB
packages/core build: ℹ dist/query-BaWRTEos.mjs                                                        23.69 kB │ gzip:  7.71 kB
packages/core build: ℹ dist/ssrf-BsVGIE0Z.mjs.map                                                     23.59 kB │ gzip:  8.30 kB
packages/core build: ℹ dist/menus-0A34Oekk.mjs                                                        23.34 kB │ gzip:  5.93 kB
packages/core build: ℹ dist/astro/routes/api/oauth/authorize.mjs.map                                  22.43 kB │ gzip:  6.46 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/analyze.mjs.map                         22.30 kB │ gzip:  6.90 kB
packages/core build: ℹ dist/taxonomy-CI9gGqcA.mjs.map                                                 21.42 kB │ gzip:  5.59 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/registry/artifact.mjs.map                  20.68 kB │ gzip:  7.13 kB
packages/core build: ℹ dist/comment-C6lZcT98.mjs.map                                                  20.47 kB │ gzip:  4.87 kB
packages/core build: ℹ dist/astro/routes/api/snapshot.mjs.map                                         19.89 kB │ gzip:  6.77 kB
packages/core build: ℹ dist/sections-DQvNo_rn.mjs.map                                                 19.39 kB │ gzip:  4.78 kB
packages/core build: ℹ dist/byline-fields-Dr-xcb6S.mjs.map                                            19.35 kB │ gzip:  4.77 kB
packages/core build: ℹ dist/zod-generator-Djo_VHCt.mjs.map                                            18.73 kB │ gzip:  5.52 kB
packages/core build: ℹ dist/byline-registry-CxK5g559.mjs                                              18.31 kB │ gzip:  5.90 kB
packages/core build: ℹ dist/oauth-authorization-DvBAL75d.mjs.map                                      17.99 kB │ gzip:  4.89 kB
packages/core build: ℹ dist/error-RwM4dD35.mjs                                                        17.36 kB │ gzip:  4.23 kB
packages/core build: ℹ dist/types-jbkzJ1j_.d.mts.map                                                  16.99 kB │ gzip:  4.66 kB
packages/core build: ℹ dist/utils-C4Ih4DML.mjs.map                                                    16.93 kB │ gzip:  5.01 kB
packages/core build: ℹ dist/validate-DK_97kMR.mjs                                                     16.79 kB │ gzip:  3.79 kB
packages/core build: ℹ dist/cron-BJ2ClIlj.mjs.map                                                     16.70 kB │ gzip:  5.42 kB
packages/core build: ℹ dist/media-JOf3pNkw.mjs.map                                                    16.58 kB │ gzip:  4.99 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress-plugin/execute.mjs.map                  16.41 kB │ gzip:  5.34 kB
packages/core build: ℹ dist/redirects-dNHo3LUJ.mjs                                                    16.07 kB │ gzip:  4.26 kB
packages/core build: ℹ dist/bylines-BA5-5vIG.mjs.map                                                  16.00 kB │ gzip:  5.36 kB
packages/core build: ℹ dist/astro/routes/api/comments/_collection_/_contentId_/index.mjs.map          15.95 kB │ gzip:  4.89 kB
packages/core build: ℹ dist/settings-DOxkRlis.mjs.map                                                 15.73 kB │ gzip:  5.04 kB
packages/core build: ℹ dist/taxonomies-D3Li3jCd.mjs                                                   15.58 kB │ gzip:  3.77 kB
packages/core build: ℹ dist/oauth-clients-8mPDStMv.mjs.map                                            15.58 kB │ gzip:  3.61 kB
packages/core build: ℹ dist/storage/s3.mjs.map                                                        15.38 kB │ gzip:  5.03 kB
packages/core build: ℹ dist/taxonomies-CzsEHhdJ.mjs                                                   15.00 kB │ gzip:  3.88 kB
packages/core build: ℹ dist/device-flow-ptLrVINd.mjs                                                  14.86 kB │ gzip:  3.82 kB
packages/core build: ℹ dist/plugins/adapt-sandbox-entry.mjs.map                                       14.73 kB │ gzip:  5.14 kB
packages/core build: ℹ dist/service-CKhjL4RP.mjs.map                                                  14.62 kB │ gzip:  4.39 kB
packages/core build: ℹ dist/fts-manager-1RgHmopc.mjs                                                  13.79 kB │ gzip:  3.92 kB
packages/core build: ℹ dist/secrets-YYbTgB1w.mjs                                                      13.77 kB │ gzip:  5.15 kB
packages/core build: ℹ dist/comments-CVWNAwU6.mjs.map                                                 13.34 kB │ gzip:  3.37 kB
packages/core build: ℹ dist/search-DYlf61Nt.mjs                                                       13.23 kB │ gzip:  4.32 kB
packages/core build: ℹ dist/bylines-CDkunS1W.mjs.map                                                  13.07 kB │ gzip:  4.32 kB
packages/core build: ℹ dist/types-D8bhH891.mjs.map                                                    12.80 kB │ gzip:  3.79 kB
packages/core build: ℹ dist/ssrf-BsVGIE0Z.mjs                                                         12.75 kB │ gzip:  5.03 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/media.mjs.map                           12.71 kB │ gzip:  3.84 kB
packages/core build: ℹ dist/manifest-schema-Cj-YrzrF.mjs.map                                          12.21 kB │ gzip:  3.36 kB
packages/core build: ℹ dist/redirect-BCeA5KRZ.mjs                                                     12.07 kB │ gzip:  3.71 kB
packages/core build: ℹ dist/transport--Ck3RBin.mjs                                                    12.05 kB │ gzip:  3.86 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/rewrite-urls.mjs.map                    11.45 kB │ gzip:  3.70 kB
packages/core build: ℹ dist/astro/routes/api/auth/oauth/_provider_/callback.mjs.map                   11.29 kB │ gzip:  3.77 kB
packages/core build: ℹ dist/storage/local.mjs.map                                                     11.26 kB │ gzip:  3.76 kB
packages/core build: ℹ dist/validation-ClE2ybVZ.mjs.map                                               11.09 kB │ gzip:  4.18 kB
packages/core build: ℹ dist/taxonomy-CI9gGqcA.mjs                                                     10.92 kB │ gzip:  3.06 kB
packages/core build: ℹ dist/user-BiaLC_X-.mjs.map                                                     10.46 kB │ gzip:  3.27 kB
packages/core build: ℹ dist/byline-fields-Dr-xcb6S.mjs                                                10.44 kB │ gzip:  3.04 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_.mjs.map                        10.35 kB │ gzip:  2.77 kB
packages/core build: ℹ dist/astro/routes/api/media.mjs.map                                            10.31 kB │ gzip:  3.58 kB
packages/core build: ℹ dist/tokens-Bx2afeT-.mjs.map                                                   10.30 kB │ gzip:  3.28 kB
packages/core build: ℹ dist/astro/routes/sitemap-_collection_.xml.mjs.map                             10.23 kB │ gzip:  3.64 kB
packages/core build: ℹ dist/astro/routes/api/oauth/token.mjs.map                                      10.07 kB │ gzip:  3.04 kB
packages/core build: ℹ dist/normalize-DVV8nbrL.mjs.map                                                10.06 kB │ gzip:  3.02 kB
packages/core build: ℹ dist/types-BXSUSAjt.mjs.map                                                     9.98 kB │ gzip:  3.78 kB
packages/core build: ℹ dist/sections-DQvNo_rn.mjs                                                      9.34 kB │ gzip:  2.47 kB
packages/core build: ℹ dist/seo-Bt03PZdi.mjs.map                                                       9.19 kB │ gzip:  3.06 kB
packages/core build: ℹ dist/comment-C6lZcT98.mjs                                                       9.18 kB │ gzip:  2.50 kB
packages/core build: ℹ dist/resolve-BqYMVG0D.mjs.map                                                   9.12 kB │ gzip:  3.20 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/rewrite-url-helpers.mjs.map              9.07 kB │ gzip:  3.12 kB
packages/core build: ℹ dist/cron-BJ2ClIlj.mjs                                                          9.00 kB │ gzip:  3.22 kB
packages/core build: ℹ dist/byline-fields-DC3Wkk-U.mjs.map                                             8.96 kB │ gzip:  2.15 kB
packages/core build: ℹ dist/patterns-CqG5Ya3i.mjs.map                                                  8.92 kB │ gzip:  3.02 kB
packages/core build: ℹ dist/client/cf-access.mjs.map                                                   8.87 kB │ gzip:  3.14 kB
packages/core build: ℹ dist/byline-fields-Cx1i-q-m.d.mts.map                                           8.85 kB │ gzip:  1.54 kB
packages/core build: ℹ dist/media/index.mjs.map                                                        8.84 kB │ gzip:  2.92 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/prepare.mjs.map                          8.65 kB │ gzip:  3.13 kB
packages/core build: ℹ dist/oauth-authorization-DvBAL75d.mjs                                           8.64 kB │ gzip:  2.58 kB
packages/core build: ℹ dist/astro/routes/api/setup/dev-bypass.mjs.map                                  8.60 kB │ gzip:  3.24 kB
packages/core build: ℹ dist/api-tokens-VrXNiNvV.mjs.map                                                8.50 kB │ gzip:  2.44 kB
packages/core build: ℹ dist/media/local-runtime.mjs.map                                                8.45 kB │ gzip:  2.58 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs.map        8.42 kB │ gzip:  2.72 kB
packages/core build: ℹ dist/astro/routes/api/oauth/register.mjs.map                                    8.19 kB │ gzip:  2.94 kB
packages/core build: ℹ dist/dialect-helpers-DRI5pyY3.mjs.map                                           8.19 kB │ gzip:  2.27 kB
packages/core build: ℹ dist/allowed-origins-CyYLEJkp.mjs.map                                           8.19 kB │ gzip:  3.02 kB
packages/core build: ℹ dist/request-meta-7ByVLxB-.mjs.map                                              8.19 kB │ gzip:  3.15 kB
packages/core build: ℹ dist/zod-generator-Djo_VHCt.mjs                                                 8.17 kB │ gzip:  2.45 kB
packages/core build: ℹ dist/utils-C4Ih4DML.mjs                                                         8.16 kB │ gzip:  2.90 kB
packages/core build: ℹ dist/rate-limit-ClFFUga6.mjs.map                                                8.07 kB │ gzip:  3.40 kB
packages/core build: ℹ dist/placeholder-BZxr8W1j.mjs.map                                               7.97 kB │ gzip:  2.92 kB
packages/core build: ℹ dist/settings-DOxkRlis.mjs                                                      7.86 kB │ gzip:  2.65 kB
packages/core build: ℹ dist/dashboard-Bavjdlk0.mjs.map                                                 7.78 kB │ gzip:  2.87 kB
packages/core build: ℹ dist/options-BL4X94qY.mjs.map                                                   7.78 kB │ gzip:  2.31 kB
packages/core build: ℹ dist/seo/index.mjs.map                                                          7.67 kB │ gzip:  2.77 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/_id_/index.mjs.map                            7.59 kB │ gzip:  2.39 kB
packages/core build: ℹ dist/oauth-clients-8mPDStMv.mjs                                                 7.56 kB │ gzip:  1.83 kB
packages/core build: ℹ dist/media-JOf3pNkw.mjs                                                         7.41 kB │ gzip:  2.50 kB
packages/core build: ℹ dist/bylines-BA5-5vIG.mjs                                                       6.72 kB │ gzip:  2.54 kB
packages/core build: ℹ dist/manifest-schema-Cj-YrzrF.mjs                                               6.66 kB │ gzip:  2.24 kB
packages/core build: ℹ dist/bylines-CDkunS1W.mjs                                                       6.54 kB │ gzip:  2.24 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/_name_/widgets/_id_.mjs.map                  6.52 kB │ gzip:  1.77 kB
packages/core build: ℹ dist/seo-DfjLvu8i.mjs.map                                                       6.47 kB │ gzip:  2.62 kB
packages/core build: ℹ dist/astro/routes/api/settings/email.mjs.map                                    6.47 kB │ gzip:  2.40 kB
packages/core build: ℹ dist/widgets-5Bpf86nz.mjs.map                                                   6.46 kB │ gzip:  2.29 kB
packages/core build: ℹ dist/astro/routes/api/plugins/_pluginId_/_...path_.mjs.map                      6.43 kB │ gzip:  2.62 kB
packages/core build: ℹ dist/types-OT_Es5mp.d.mts.map                                                   6.37 kB │ gzip:  1.09 kB
packages/core build: ℹ dist/astro/routes/api/setup/admin-verify.mjs.map                                6.33 kB │ gzip:  2.31 kB
packages/core build: ℹ dist/astro/routes/api/media/_id_.mjs.map                                        6.28 kB │ gzip:  1.75 kB
packages/core build: ℹ dist/astro/routes/api/media/upload-url.mjs.map                                  6.24 kB │ gzip:  2.44 kB
packages/core build: ℹ dist/request-cache-BYMs-BGX.mjs.map                                             6.23 kB │ gzip:  2.42 kB
packages/core build: ℹ dist/astro/routes/api/setup/admin.mjs.map                                       6.21 kB │ gzip:  2.51 kB
packages/core build: ℹ dist/service-CKhjL4RP.mjs                                                       6.21 kB │ gzip:  2.19 kB
packages/core build: ℹ dist/astro/routes/api/setup/index.mjs.map                                       6.16 kB │ gzip:  2.40 kB
packages/core build: ℹ dist/astro/routes/api/auth/oauth/_provider_.mjs.map                             6.14 kB │ gzip:  2.26 kB
packages/core build: ℹ dist/public-url-egRHCy1m.mjs.map                                                5.92 kB │ gzip:  2.40 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/register/verify.mjs.map                      5.90 kB │ gzip:  2.22 kB
packages/core build: ℹ dist/validate-VPnKoIzW.mjs.map                                                  5.90 kB │ gzip:  1.70 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/preview-url.mjs.map             5.90 kB │ gzip:  2.39 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/schedule.mjs.map                5.82 kB │ gzip:  1.68 kB
packages/core build: ℹ dist/astro/middleware/redirect.mjs.map                                          5.82 kB │ gzip:  2.33 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/_id_/status.mjs.map                        5.69 kB │ gzip:  2.00 kB
packages/core build: ℹ dist/resolve-BqYMVG0D.mjs                                                       5.63 kB │ gzip:  2.12 kB
packages/core build: ℹ dist/validation-ClE2ybVZ.mjs                                                    5.61 kB │ gzip:  2.25 kB
packages/core build: ℹ dist/astro/routes/api/auth/dev-bypass.mjs.map                                   5.58 kB │ gzip:  2.30 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/registry/install.mjs.map                    5.56 kB │ gzip:  2.38 kB
packages/core build: ℹ dist/astro/routes/api/media/providers/_providerId_/index.mjs.map                5.54 kB │ gzip:  1.81 kB
packages/core build: ℹ dist/comments-CVWNAwU6.mjs                                                      5.49 kB │ gzip:  1.74 kB
packages/core build: ℹ dist/preview-BfuRkVKW.mjs.map                                                   5.44 kB │ gzip:  1.93 kB
packages/core build: ℹ dist/parse-CrGndy1A.mjs.map                                                     5.35 kB │ gzip:  1.94 kB
packages/core build: ℹ dist/allowed-origins-CyYLEJkp.mjs                                               5.31 kB │ gzip:  2.05 kB
packages/core build: ℹ dist/types-DpFmlNyB.mjs.map                                                     5.27 kB │ gzip:  1.85 kB
packages/core build: ℹ dist/astro/routes/api/admin/bylines/_id_/translations.mjs.map                   5.21 kB │ gzip:  1.88 kB
packages/core build: ℹ dist/seo-Bt03PZdi.mjs                                                           5.12 kB │ gzip:  1.82 kB
packages/core build: ℹ dist/astro/routes/api/setup/status.mjs.map                                      5.09 kB │ gzip:  1.96 kB
packages/core build: ℹ dist/patterns-CqG5Ya3i.mjs                                                      5.05 kB │ gzip:  1.85 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/index.mjs.map                        4.98 kB │ gzip:  1.84 kB
packages/core build: ℹ dist/client/index.d.mts.map                                                     4.98 kB │ gzip:  1.43 kB
packages/core build: ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_/translations.mjs.map       4.98 kB │ gzip:  1.50 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/_id_.mjs.map                                 4.95 kB │ gzip:  1.56 kB
packages/core build: ℹ dist/tokens-Bx2afeT-.mjs                                                        4.94 kB │ gzip:  1.73 kB
packages/core build: ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_.mjs.map                    4.92 kB │ gzip:  1.17 kB
packages/core build: ℹ dist/astro/routes/api/typegen.mjs.map                                           4.90 kB │ gzip:  1.79 kB
packages/core build: ℹ dist/request-context.mjs.map                                                    4.88 kB │ gzip:  2.14 kB
packages/core build: ℹ dist/normalize-DVV8nbrL.mjs                                                     4.86 kB │ gzip:  1.48 kB
packages/core build: ℹ dist/astro/routes/api/admin/allowed-domains/_domain_.mjs.map                    4.84 kB │ gzip:  1.49 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/publish.mjs.map                 4.76 kB │ gzip:  1.89 kB
packages/core build: ℹ dist/astro/routes/api/admin/oauth-clients/_id_.mjs.map                          4.75 kB │ gzip:  1.34 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress-plugin/analyze.mjs.map                   4.74 kB │ gzip:  1.92 kB
packages/core build: ℹ dist/user-BiaLC_X-.mjs                                                          4.74 kB │ gzip:  1.69 kB
packages/core build: ℹ dist/astro/routes/api/admin/byline-fields/_slug_.mjs.map                        4.70 kB │ gzip:  1.46 kB
packages/core build: ℹ dist/database/instrumentation.mjs.map                                           4.63 kB │ gzip:  2.02 kB
packages/core build: ℹ dist/astro/routes/api/admin/allowed-domains/index.mjs.map                       4.61 kB │ gzip:  1.60 kB
packages/core build: ℹ dist/request-meta-7ByVLxB-.mjs                                                  4.58 kB │ gzip:  1.93 kB
packages/core build: ℹ dist/astro/routes/api/admin/bylines/_id_/index.mjs.map                          4.54 kB │ gzip:  1.61 kB
packages/core build: ℹ dist/astro/routes/api/schema/index.mjs.map                                      4.52 kB │ gzip:  1.76 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_/translations.mjs.map                         4.49 kB │ gzip:  1.48 kB
packages/core build: ℹ dist/plugin-utils.mjs.map                                                       4.46 kB │ gzip:  1.89 kB
packages/core build: ℹ dist/astro/routes/api/auth/signup/request.mjs.map                               4.45 kB │ gzip:  1.92 kB
packages/core build: ℹ dist/rate-limit-ClFFUga6.mjs                                                    4.43 kB │ gzip:  2.06 kB
packages/core build: ℹ dist/astro/types.d.mts.map                                                      4.43 kB │ gzip:  1.23 kB
packages/core build: ℹ dist/trusted-proxy-B4AfnoAp.mjs.map                                             4.43 kB │ gzip:  1.96 kB
packages/core build: ℹ dist/astro/routes/api/auth/magic-link/send.mjs.map                              4.40 kB │ gzip:  1.78 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/index.mjs.map                                4.39 kB │ gzip:  1.57 kB
packages/core build: ℹ dist/placeholder-BZxr8W1j.mjs                                                   4.39 kB │ gzip:  1.77 kB
packages/core build: ℹ dist/validate-VPnKoIzW.mjs                                                      4.35 kB │ gzip:  1.32 kB
packages/core build: ℹ dist/astro/routes/api/auth/signup/complete.mjs.map                              4.33 kB │ gzip:  1.74 kB
packages/core build: ℹ dist/base64-CqR-7kqF.mjs.map                                                    4.31 kB │ gzip:  1.41 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/options.mjs.map                              4.30 kB │ gzip:  1.76 kB
packages/core build: ℹ dist/astro/routes/api/media/_id_/confirm.mjs.map                                4.30 kB │ gzip:  1.76 kB
packages/core build: ℹ dist/astro/routes/api/auth/invite/complete.mjs.map                              4.29 kB │ gzip:  1.72 kB
packages/core build: ℹ dist/astro/routes/api/themes/preview.mjs.map                                    4.25 kB │ gzip:  1.80 kB
packages/core build: ℹ dist/astro/routes/api/auth/invite/index.mjs.map                                 4.23 kB │ gzip:  1.83 kB
packages/core build: ℹ dist/astro/routes/api/admin/hooks/exclusive/_hookName_.mjs.map                  4.20 kB │ gzip:  1.71 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/register/options.mjs.map                     4.18 kB │ gzip:  1.69 kB
packages/core build: ℹ dist/oauth-state-store-BJ7YtrfD.mjs.map                                         4.17 kB │ gzip:  1.51 kB
packages/core build: ℹ dist/astro/routes/api/redirects/_id_.mjs.map                                    4.17 kB │ gzip:  1.10 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/registry/_id_/update.mjs.map                4.09 kB │ gzip:  1.70 kB
packages/core build: ℹ dist/astro/routes/api/auth/invite/register-options.mjs.map                      4.09 kB │ gzip:  1.75 kB
packages/core build: ℹ dist/astro/routes/api/admin/bylines/index.mjs.map                               4.08 kB │ gzip:  1.48 kB
packages/core build: ℹ dist/astro/middleware/setup.mjs.map                                             4.08 kB │ gzip:  1.67 kB
packages/core build: ℹ dist/astro/routes/sitemap.xml.mjs.map                                           4.05 kB │ gzip:  1.66 kB
packages/core build: ℹ dist/astro/routes/api/manifest.mjs.map                                          4.04 kB │ gzip:  1.84 kB
packages/core build: ℹ dist/astro/routes/api/sections/_slug_.mjs.map                                   3.99 kB │ gzip:  1.04 kB
packages/core build: ℹ dist/api-tokens-VrXNiNvV.mjs                                                    3.95 kB │ gzip:  1.26 kB
packages/core build: ℹ dist/astro/routes/api/media/providers/_providerId_/_itemId_.mjs.map             3.95 kB │ gzip:  1.20 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/_name_.mjs.map                               3.86 kB │ gzip:  1.25 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/_slug_/index.mjs.map                   3.83 kB │ gzip:  1.15 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_.mjs.map                                      3.79 kB │ gzip:  1.00 kB
packages/core build: ℹ dist/db/index.mjs.map                                                           3.77 kB │ gzip:  1.42 kB
packages/core build: ℹ dist/byline-fields-DC3Wkk-U.mjs                                                 3.74 kB │ gzip:  0.97 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/_name_/widgets.mjs.map                       3.74 kB │ gzip:  1.48 kB
packages/core build: ℹ dist/options-BL4X94qY.mjs                                                       3.69 kB │ gzip:  1.26 kB
packages/core build: ℹ dist/astro/routes/api/redirects/404s/index.mjs.map                              3.64 kB │ gzip:  1.07 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/duplicate.mjs.map               3.62 kB │ gzip:  1.48 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs.map      3.60 kB │ gzip:  1.01 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/updates.mjs.map                             3.56 kB │ gzip:  1.51 kB
packages/core build: ℹ dist/cache-CsmSDivr.mjs.map                                                     3.54 kB │ gzip:  1.44 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/verify.mjs.map                               3.54 kB │ gzip:  1.42 kB
packages/core build: ℹ dist/dashboard-Bavjdlk0.mjs                                                     3.54 kB │ gzip:  1.51 kB
packages/core build: ℹ dist/request-cache-BYMs-BGX.mjs                                                 3.53 kB │ gzip:  1.51 kB
packages/core build: ℹ dist/mime-CCEzze7W.mjs.map                                                      3.52 kB │ gzip:  1.48 kB
packages/core build: ℹ dist/astro/routes/api/oauth/device/token.mjs.map                                3.50 kB │ gzip:  1.56 kB
packages/core build: ℹ dist/components-CTfpu3PZ.mjs.map                                                3.46 kB │ gzip:  0.99 kB
packages/core build: ℹ dist/challenge-store-DGwuCc4R.mjs.map                                           3.43 kB │ gzip:  1.34 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/_id_/disable.mjs.map                          3.43 kB │ gzip:  1.49 kB
packages/core build: ℹ dist/astro/routes/api/admin/byline-fields/index.mjs.map                         3.38 kB │ gzip:  1.34 kB
packages/core build: ℹ dist/public-url-egRHCy1m.mjs                                                    3.37 kB │ gzip:  1.50 kB
packages/core build: ℹ dist/types-DWnN7weG.d.mts.map                                                   3.35 kB │ gzip:  1.20 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_/items/_id_.mjs.map                           3.34 kB │ gzip:  1.04 kB
packages/core build: ℹ dist/astro/routes/api/taxonomies/_name_/terms/index.mjs.map                     3.33 kB │ gzip:  1.16 kB
packages/core build: ℹ dist/astro/routes/api/media/file/_...key_.mjs.map                               3.33 kB │ gzip:  1.52 kB
packages/core build: ℹ dist/dialect-helpers-DRI5pyY3.mjs                                               3.33 kB │ gzip:  1.12 kB
packages/core build: ℹ dist/astro/routes/api/admin/oauth-clients/index.mjs.map                         3.32 kB │ gzip:  1.25 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/discard-draft.mjs.map           3.31 kB │ gzip:  1.36 kB
packages/core build: ℹ dist/astro/routes/robots.txt.mjs.map                                            3.28 kB │ gzip:  1.34 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/_id_/send-recovery.mjs.map                    3.27 kB │ gzip:  1.44 kB
packages/core build: ℹ dist/widgets-5Bpf86nz.mjs                                                       3.27 kB │ gzip:  1.22 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/restore.mjs.map                 3.25 kB │ gzip:  1.34 kB
packages/core build: ℹ dist/db-errors-CtzxKBxe.mjs.map                                                 3.25 kB │ gzip:  1.28 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/unpublish.mjs.map               3.24 kB │ gzip:  1.32 kB
packages/core build: ℹ dist/email-console-DHT2Fbpj.mjs.map                                             3.23 kB │ gzip:  1.54 kB
packages/core build: ℹ dist/types-BXSUSAjt.mjs                                                         3.22 kB │ gzip:  1.41 kB
packages/core build: ℹ dist/astro/routes/api/auth/magic-link/verify.mjs.map                            3.18 kB │ gzip:  1.34 kB
packages/core build: ℹ dist/validate-c7q7DID3.d.mts.map                                                3.17 kB │ gzip:  0.98 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/_name_/reorder.mjs.map                       3.16 kB │ gzip:  1.32 kB
packages/core build: ℹ dist/astro/routes/api/admin/api-tokens/index.mjs.map                            3.11 kB │ gzip:  1.21 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/install.mjs.map            3.10 kB │ gzip:  1.31 kB
packages/core build: ℹ dist/mode-BjlXswIw.mjs.map                                                      3.04 kB │ gzip:  1.13 kB
packages/core build: ℹ dist/astro/routes/api/auth/me.mjs.map                                           3.04 kB │ gzip:  1.31 kB
packages/core build: ℹ dist/astro/routes/api/search/rebuild.mjs.map                                    3.02 kB │ gzip:  1.23 kB
packages/core build: ℹ dist/astro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs.map           2.97 kB │ gzip:  1.31 kB
packages/core build: ℹ dist/astro/routes/api/revisions/_revisionId_/restore.mjs.map                    2.94 kB │ gzip:  1.17 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/icon.mjs.map               2.94 kB │ gzip:  1.30 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/index.mjs.map                                 2.94 kB │ gzip:  1.30 kB
packages/core build: ℹ dist/runtime.mjs.map                                                            2.91 kB │ gzip:  1.25 kB
packages/core build: ℹ dist/astro/routes/api/settings.mjs.map                                          2.89 kB │ gzip:  1.06 kB
packages/core build: ℹ dist/astro/routes/api/taxonomies/index.mjs.map                                  2.89 kB │ gzip:  1.02 kB
packages/core build: ℹ dist/types-D8bhH891.mjs                                                         2.88 kB │ gzip:  1.33 kB
packages/core build: ℹ dist/astro/routes/api/redirects/index.mjs.map                                   2.86 kB │ gzip:  1.00 kB
packages/core build: ℹ dist/preview-BfuRkVKW.mjs                                                       2.85 kB │ gzip:  1.02 kB
packages/core build: ℹ dist/parse-CrGndy1A.mjs                                                         2.83 kB │ gzip:  1.15 kB
packages/core build: ℹ dist/default-xLFNSsZ9.mjs.map                                                   2.82 kB │ gzip:  0.81 kB
packages/core build: ℹ dist/passkey-config-BDVM86Tj.mjs.map                                            2.81 kB │ gzip:  1.25 kB
packages/core build: ℹ dist/astro/routes/api/search/index.mjs.map                                      2.78 kB │ gzip:  1.33 kB
packages/core build: ℹ dist/astro/routes/api/well-known/auth.mjs.map                                   2.75 kB │ gzip:  1.22 kB
packages/core build: ℹ dist/astro/routes/api/oauth/device/code.mjs.map                                 2.74 kB │ gzip:  1.27 kB
packages/core build: ℹ dist/astro/routes/api/sections/index.mjs.map                                    2.71 kB │ gzip:  0.96 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/update.mjs.map                         2.71 kB │ gzip:  1.12 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/translations.mjs.map            2.70 kB │ gzip:  1.28 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/_id_.mjs.map                               2.68 kB │ gzip:  0.92 kB
packages/core build: ℹ dist/astro/routes/api/search/enable.mjs.map                                     2.65 kB │ gzip:  1.12 kB
packages/core build: ℹ dist/seo-DfjLvu8i.mjs                                                           2.59 kB │ gzip:  1.21 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress-plugin/callback.mjs.map                  2.55 kB │ gzip:  1.19 kB
packages/core build: ℹ dist/placeholder-B9lUUEmj.d.mts.map                                             2.50 kB │ gzip:  0.92 kB
packages/core build: ℹ dist/astro/routes/api/menus/index.mjs.map                                       2.48 kB │ gzip:  0.97 kB
packages/core build: ℹ dist/config-CVssduLe.mjs.map                                                    2.48 kB │ gzip:  1.09 kB
packages/core build: ℹ dist/astro/routes/api/admin/themes/marketplace/index.mjs.map                    2.44 kB │ gzip:  1.06 kB
packages/core build: ℹ dist/schema-CPHAoECW.mjs.map                                                    2.44 kB │ gzip:  1.04 kB
packages/core build: ℹ dist/base64-CqR-7kqF.mjs                                                        2.44 kB │ gzip:  0.92 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/index.mjs.map                          2.42 kB │ gzip:  0.89 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/_slug_/fields/index.mjs.map            2.41 kB │ gzip:  0.83 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/registry/_id_/uninstall.mjs.map             2.39 kB │ gzip:  1.08 kB
packages/core build: ℹ dist/index-BpYeJO1E.d.mts.map                                                   2.36 kB │ gzip:  0.80 kB
packages/core build: ℹ dist/astro/routes/api/admin/hooks/exclusive/index.mjs.map                       2.33 kB │ gzip:  1.11 kB
packages/core build: ℹ dist/transaction-NQj4VJ7Z.mjs.map                                               2.32 kB │ gzip:  1.10 kB
packages/core build: ℹ dist/astro/routes/api/auth/signup/verify.mjs.map                                2.29 kB │ gzip:  1.13 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/enable.mjs.map                         2.28 kB │ gzip:  1.05 kB
packages/core build: ℹ dist/astro/routes/api/auth/mode.mjs.map                                         2.27 kB │ gzip:  1.13 kB
packages/core build: ℹ dist/authorize-C_8t2KGa.mjs.map                                                 2.24 kB │ gzip:  0.85 kB
packages/core build: ℹ dist/astro/routes/api/auth/invite/accept.mjs.map                                2.22 kB │ gzip:  1.09 kB
packages/core build: ℹ dist/astro/routes/api/well-known/oauth-authorization-server.mjs.map             2.21 kB │ gzip:  0.97 kB
packages/core build: ℹ dist/options-xfkUPCKd.d.mts.map                                                 2.19 kB │ gzip:  0.83 kB
packages/core build: ℹ dist/astro/routes/api/search/suggest.mjs.map                                    2.19 kB │ gzip:  1.06 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/uninstall.mjs.map                      2.18 kB │ gzip:  0.98 kB
packages/core build: ℹ dist/hash-9w3pd3-m.mjs.map                                                      2.18 kB │ gzip:  1.05 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/index.mjs.map                                2.11 kB │ gzip:  1.03 kB
packages/core build: ℹ dist/db-errors-CtzxKBxe.mjs                                                     2.10 kB │ gzip:  0.89 kB
packages/core build: ℹ dist/setup-complete-VoEZfasi.mjs.map                                            2.08 kB │ gzip:  0.91 kB
packages/core build: ℹ dist/astro/routes/api/oauth/device/authorize.mjs.map                            2.06 kB │ gzip:  1.00 kB
packages/core build: ℹ dist/slugify-Cjh1ssOZ.mjs.map                                                   2.04 kB │ gzip:  1.01 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/index.mjs.map                              2.01 kB │ gzip:  0.90 kB
packages/core build: ℹ dist/trusted-proxy-B4AfnoAp.mjs                                                 1.99 kB │ gzip:  0.97 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/_id_/enable.mjs.map                           1.99 kB │ gzip:  0.94 kB
packages/core build: ℹ dist/components-CTfpu3PZ.mjs                                                    1.99 kB │ gzip:  0.71 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/bulk.mjs.map                               1.98 kB │ gzip:  0.88 kB
packages/core build: ℹ dist/cache-CsmSDivr.mjs                                                         1.97 kB │ gzip:  0.80 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/marketplace/index.mjs.map                   1.91 kB │ gzip:  0.86 kB
packages/core build: ℹ dist/settings-CDB3cLbV.mjs.map                                                  1.91 kB │ gzip:  0.71 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_/reorder.mjs.map                              1.88 kB │ gzip:  0.86 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_/items.mjs.map                                1.87 kB │ gzip:  0.86 kB
packages/core build: ℹ dist/astro/routes/api/import/probe.mjs.map                                      1.84 kB │ gzip:  0.87 kB
packages/core build: ℹ dist/astro/routes/api/admin/byline-fields/reorder.mjs.map                       1.82 kB │ gzip:  0.87 kB
packages/core build: ℹ dist/oauth-state-store-BJ7YtrfD.mjs                                             1.79 kB │ gzip:  0.72 kB
packages/core build: ℹ dist/media-allowlist-CMcoYIjQ.mjs.map                                           1.77 kB │ gzip:  0.94 kB
packages/core build: ℹ dist/astro/routes/api/setup/dev-reset.mjs.map                                   1.77 kB │ gzip:  0.89 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/disable.mjs.map                        1.77 kB │ gzip:  0.82 kB
packages/core build: ℹ dist/astro/routes/api/schema/orphans/_slug_.mjs.map                             1.77 kB │ gzip:  0.81 kB
packages/core build: ℹ dist/page/index.d.mts.map                                                       1.75 kB │ gzip:  0.67 kB
packages/core build: ℹ dist/types-DbCWhHet.d.mts.map                                                   1.74 kB │ gzip:  0.52 kB
packages/core build: ℹ dist/astro/routes/api/oauth/token/refresh.mjs.map                               1.72 kB │ gzip:  0.87 kB
packages/core build: ℹ dist/astro/routes/api/admin/byline-fields/_slug_/usage.mjs.map                  1.69 kB │ gzip:  0.87 kB
packages/core build: ℹ dist/astro/routes/api/admin/api-tokens/_id_.mjs.map                             1.68 kB │ gzip:  0.85 kB
packages/core build: ℹ dist/astro/routes/api/redirects/404s/summary.mjs.map                            1.68 kB │ gzip:  0.79 kB
packages/core build: ℹ dist/astro/routes/api/oauth/token/revoke.mjs.map                                1.68 kB │ gzip:  0.87 kB
packages/core build: ℹ dist/email-console-DHT2Fbpj.mjs                                                 1.67 kB │ gzip:  0.86 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/revisions.mjs.map               1.67 kB │ gzip:  0.84 kB
packages/core build: ℹ dist/astro/routes/api/well-known/oauth-protected-resource.mjs.map               1.64 kB │ gzip:  0.85 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/permanent.mjs.map               1.62 kB │ gzip:  0.79 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/_slug_/fields/reorder.mjs.map          1.60 kB │ gzip:  0.72 kB
packages/core build: ℹ dist/challenge-store-DGwuCc4R.mjs                                               1.59 kB │ gzip:  0.68 kB
packages/core build: ℹ dist/passkey-config-BDVM86Tj.mjs                                                1.56 kB │ gzip:  0.74 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/trash.mjs.map                        1.55 kB │ gzip:  0.77 kB
packages/core build: ℹ dist/api/route-utils.mjs.map                                                    1.54 kB │ gzip:  0.70 kB
packages/core build: ℹ dist/types-kwqCOUxj.d.mts.map                                                   1.53 kB │ gzip:  0.67 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/index.mjs.map                          1.48 kB │ gzip:  0.74 kB
packages/core build: ℹ dist/types-i8_uzhMD.d.mts.map                                                   1.48 kB │ gzip:  0.53 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/index.mjs.map              1.45 kB │ gzip:  0.72 kB
packages/core build: ℹ dist/astro/routes/api/auth/logout.mjs.map                                       1.44 kB │ gzip:  0.77 kB
packages/core build: ℹ dist/astro/routes/api/admin/themes/marketplace/_id_/index.mjs.map               1.43 kB │ gzip:  0.72 kB
packages/core build: ℹ dist/astro/routes/api/dev/emails.mjs.map                                        1.43 kB │ gzip:  0.63 kB
packages/core build: ℹ dist/oauth-user-lookup-BdDSDvjF.mjs.map                                         1.41 kB │ gzip:  0.76 kB
packages/core build: ℹ dist/default-xLFNSsZ9.mjs                                                       1.35 kB │ gzip:  0.50 kB
packages/core build: ℹ dist/astro/routes/api/dashboard.mjs.map                                         1.34 kB │ gzip:  0.71 kB
packages/core build: ℹ dist/slugify-Cjh1ssOZ.mjs                                                       1.31 kB │ gzip:  0.71 kB
packages/core build: ℹ dist/plugin-types.d.mts.map                                                     1.31 kB │ gzip:  0.48 kB
packages/core build: ℹ dist/site-url-Cm8-sJy7.mjs.map                                                  1.30 kB │ gzip:  0.73 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/counts.mjs.map                             1.30 kB │ gzip:  0.65 kB
packages/core build: ℹ dist/astro/routes/api/search/stats.mjs.map                                      1.29 kB │ gzip:  0.69 kB
packages/core build: ℹ dist/astro/routes/api/revisions/_revisionId_/index.mjs.map                      1.29 kB │ gzip:  0.68 kB
packages/core build: ℹ dist/load-B84ohfBk.mjs.map                                                      1.28 kB │ gzip:  0.64 kB
packages/core build: ℹ dist/mime-CCEzze7W.mjs                                                          1.28 kB │ gzip:  0.64 kB
packages/core build: ℹ dist/authorize-C_8t2KGa.mjs                                                     1.28 kB │ gzip:  0.52 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/index.mjs.map                               1.27 kB │ gzip:  0.67 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/compare.mjs.map                 1.25 kB │ gzip:  0.67 kB
packages/core build: ℹ dist/config-CVssduLe.mjs                                                        1.23 kB │ gzip:  0.58 kB
packages/core build: ℹ dist/media-allowlist-CMcoYIjQ.mjs                                               1.21 kB │ gzip:  0.70 kB
packages/core build: ℹ dist/hash-9w3pd3-m.mjs                                                          1.21 kB │ gzip:  0.66 kB
packages/core build: ℹ dist/schema-CPHAoECW.mjs                                                        1.20 kB │ gzip:  0.59 kB
packages/core build: ℹ dist/astro/routes/api/media/providers/index.mjs.map                             1.16 kB │ gzip:  0.62 kB
packages/core build: ℹ dist/settings-CDB3cLbV.mjs                                                      1.16 kB │ gzip:  0.48 kB
packages/core build: ℹ dist/astro/routes/PluginRegistry.mjs.map                                        1.15 kB │ gzip:  0.57 kB
packages/core build: ℹ dist/db/postgres.mjs.map                                                        1.14 kB │ gzip:  0.53 kB
packages/core build: ℹ dist/astro/routes/api/schema/orphans/index.mjs.map                              1.14 kB │ gzip:  0.57 kB
packages/core build: ℹ dist/setup-complete-VoEZfasi.mjs                                                1.12 kB │ gzip:  0.51 kB
packages/core build: ℹ dist/setup-nonce-Bm0uKqmf.mjs.map                                               1.10 kB │ gzip:  0.63 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/execute.d.mts.map                        1.09 kB │ gzip:  0.53 kB
packages/core build: ℹ dist/setup-nonce-Bm0uKqmf.mjs                                                   1.02 kB │ gzip:  0.58 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/analyze.d.mts.map                        1.00 kB │ gzip:  0.43 kB
packages/core build: ℹ dist/auth/providers/github.mjs.map                                              0.99 kB │ gzip:  0.51 kB
packages/core build: ℹ dist/auth/providers/google.mjs.map                                              0.99 kB │ gzip:  0.51 kB
packages/core build: ℹ dist/types-Qa7-HJJC.d.mts.map                                                   0.94 kB │ gzip:  0.46 kB
packages/core build: ℹ dist/transaction-NQj4VJ7Z.mjs                                                   0.92 kB │ gzip:  0.48 kB
packages/core build: ℹ dist/astro/routes/api/widget-components.mjs.map                                 0.91 kB │ gzip:  0.51 kB
packages/core build: ℹ dist/db/sqlite.mjs.map                                                          0.91 kB │ gzip:  0.51 kB
packages/core build: ℹ dist/chunks-BsrLu7w3.mjs.map                                                    0.90 kB │ gzip:  0.57 kB
packages/core build: ℹ dist/oauth-user-lookup-BdDSDvjF.mjs                                             0.81 kB │ gzip:  0.49 kB
packages/core build: ℹ dist/chunks-BsrLu7w3.mjs                                                        0.80 kB │ gzip:  0.51 kB
packages/core build: ℹ dist/redirect-Cw3JTlmj.mjs.map                                                  0.75 kB │ gzip:  0.49 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/rewrite-url-helpers.d.mts.map            0.74 kB │ gzip:  0.34 kB
packages/core build: ℹ dist/db/libsql.mjs.map                                                          0.71 kB │ gzip:  0.41 kB
packages/core build: ℹ dist/load-B84ohfBk.mjs                                                          0.70 kB │ gzip:  0.38 kB
packages/core build: ℹ dist/errors-9P_FDrJ_.mjs.map                                                    0.67 kB │ gzip:  0.45 kB
packages/core build: ℹ dist/adapters-C5AWLJSD.d.mts.map                                                0.67 kB │ gzip:  0.32 kB
packages/core build: ℹ dist/storage/s3.d.mts.map                                                       0.67 kB │ gzip:  0.33 kB
packages/core build: ℹ dist/seo/index.d.mts.map                                                        0.64 kB │ gzip:  0.36 kB
packages/core build: ℹ dist/storage/local.d.mts.map                                                    0.62 kB │ gzip:  0.32 kB
packages/core build: ℹ dist/types-DX6v9KzJ.d.mts.map                                                   0.59 kB │ gzip:  0.31 kB
packages/core build: ℹ dist/version-CyfxLO9-.mjs.map                                                   0.59 kB │ gzip:  0.33 kB
packages/core build: ℹ dist/escape-bIyGoW5W.mjs.map                                                    0.58 kB │ gzip:  0.34 kB
packages/core build: ℹ dist/mode-BjlXswIw.mjs                                                          0.58 kB │ gzip:  0.36 kB
packages/core build: ℹ dist/request-context.d.mts.map                                                  0.57 kB │ gzip:  0.31 kB
packages/core build: ℹ dist/plugin-utils.d.mts.map                                                     0.56 kB │ gzip:  0.30 kB
packages/core build: ℹ dist/database/instrumentation.d.mts.map                                         0.53 kB │ gzip:  0.28 kB
packages/core build: ℹ dist/redirect-Cw3JTlmj.mjs                                                      0.53 kB │ gzip:  0.37 kB
packages/core build: ℹ dist/errors-9P_FDrJ_.mjs                                                        0.53 kB │ gzip:  0.34 kB
packages/core build: ℹ dist/transport-OnMNbsIA.d.mts.map                                               0.49 kB │ gzip:  0.28 kB
packages/core build: ℹ dist/runner-BcRuXq_h.d.mts.map                                                  0.49 kB │ gzip:  0.25 kB
packages/core build: ℹ dist/client/cf-access.d.mts.map                                                 0.49 kB │ gzip:  0.27 kB
packages/core build: ℹ dist/api/route-utils.d.mts.map                                                  0.48 kB │ gzip:  0.27 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/media.d.mts.map                          0.45 kB │ gzip:  0.25 kB
packages/core build: ℹ dist/site-url-Cm8-sJy7.mjs                                                      0.44 kB │ gzip:  0.30 kB
packages/core build: ℹ dist/media/local-runtime.d.mts.map                                              0.40 kB │ gzip:  0.23 kB
packages/core build: ℹ dist/astro/middleware.d.mts.map                                                 0.36 kB │ gzip:  0.24 kB
packages/core build: ℹ dist/astro/index.d.mts.map                                                      0.36 kB │ gzip:  0.22 kB
packages/core build: ℹ dist/types-DpFmlNyB.mjs                                                         0.36 kB │ gzip:  0.24 kB
packages/core build: ℹ dist/escape-bIyGoW5W.mjs                                                        0.36 kB │ gzip:  0.25 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/rewrite-urls.d.mts.map                   0.34 kB │ gzip:  0.23 kB
packages/core build: ℹ dist/astro/middleware/auth.d.mts.map                                            0.33 kB │ gzip:  0.22 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress-plugin/execute.d.mts.map                 0.32 kB │ gzip:  0.23 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/prepare.d.mts.map                        0.32 kB │ gzip:  0.21 kB
packages/core build: ℹ dist/astro/routes/api/plugins/_pluginId_/_...path_.d.mts.map                    0.29 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress-plugin/analyze.d.mts.map                 0.27 kB │ gzip:  0.20 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.d.mts.map    0.26 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/PluginRegistry.d.mts.map                                      0.26 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/types-Cj2S6FuC.mjs                                                         0.25 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_.d.mts.map                  0.25 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/api-tokens-B6VgoE6M.mjs                                                    0.25 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/terms/_taxonomy_.d.mts.map      0.24 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/import/probe.d.mts.map                                    0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/_slug_/index.d.mts.map                 0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/oauth-clients/_id_.d.mts.map                        0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_/translations.d.mts.map     0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/byline-fields/_slug_.d.mts.map                      0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/bylines/_id_/index.d.mts.map                        0.23 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/comments/_collection_/_contentId_/index.d.mts.map         0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/media/providers/_providerId_/_itemId_.d.mts.map           0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_.d.mts.map                       0.23 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/media/providers/_providerId_/index.d.mts.map              0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/redirects/404s/index.d.mts.map                            0.23 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/_slug_/fields/index.d.mts.map          0.22 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/bylines/_id_/translations.d.mts.map                 0.22 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/taxonomies/_name_/terms/index.d.mts.map                   0.22 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/schedule.d.mts.map              0.22 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/admin/api-tokens/index.d.mts.map                          0.22 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/media/_id_.d.mts.map                                      0.22 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/sections/_slug_.d.mts.map                                 0.22 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/admin/allowed-domains/_domain_.d.mts.map                  0.22 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/plugins/adapt-sandbox-entry.d.mts.map                                      0.22 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_.d.mts.map                                    0.22 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/redirects/_id_.d.mts.map                                  0.22 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/admin/oauth-clients/index.d.mts.map                       0.21 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/_name_/widgets/_id_.d.mts.map                0.21 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/admin/allowed-domains/index.d.mts.map                     0.21 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_/translations.d.mts.map                       0.21 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/settings/email.d.mts.map                                  0.21 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/well-known/oauth-authorization-server.d.mts.map           0.21 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/_id_.d.mts.map                             0.21 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/_id_/index.d.mts.map                          0.20 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/index.d.mts.map                      0.20 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/well-known/oauth-protected-resource.d.mts.map             0.20 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/admin/byline-fields/index.d.mts.map                       0.20 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_/items/_id_.d.mts.map                         0.20 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/discard-draft.d.mts.map         0.20 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/index.d.mts.map                        0.20 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/admin/themes/marketplace/_id_/thumbnail.d.mts.map         0.20 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/taxonomies/index.d.mts.map                                0.20 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/registry/_id_/uninstall.d.mts.map           0.20 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/_id_.d.mts.map                               0.20 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/translations.d.mts.map          0.20 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/_slug_/fields/reorder.d.mts.map        0.20 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/settings.d.mts.map                                        0.20 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/preview-url.d.mts.map           0.20 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/install.d.mts.map          0.20 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/admin/bylines/index.d.mts.map                             0.20 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/setup/dev-bypass.d.mts.map                                0.20 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/auth/dev-bypass.d.mts.map                                 0.20 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/mcp.d.mts.map                                             0.20 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/oauth/authorize.d.mts.map                                 0.20 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/registry/_id_/update.d.mts.map              0.20 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/_name_.d.mts.map                             0.20 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/index.d.mts.map            0.20 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/_id_/send-recovery.d.mts.map                  0.20 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/duplicate.d.mts.map             0.20 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/permanent.d.mts.map             0.20 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/revisions.d.mts.map             0.20 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/unpublish.d.mts.map             0.20 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/index.d.mts.map                              0.20 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/admin/hooks/exclusive/_hookName_.d.mts.map                0.19 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/admin/themes/marketplace/_id_/index.d.mts.map             0.19 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/media/index.d.mts.map                                                      0.19 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/icon.d.mts.map             0.19 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/oauth/register.d.mts.map                                  0.19 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/registry/artifact.d.mts.map                 0.19 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/auth/invite/register-options.d.mts.map                    0.19 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/publish.d.mts.map               0.19 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/media.d.mts.map                                           0.19 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/redirects/index.d.mts.map                                 0.19 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/compare.d.mts.map               0.19 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/restore.d.mts.map               0.19 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/registry/install.d.mts.map                  0.19 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/auth/oauth/_provider_/callback.d.mts.map                  0.19 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/sections/index.d.mts.map                                  0.19 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/admin/byline-fields/_slug_/usage.d.mts.map                0.19 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/uninstall.d.mts.map                    0.19 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress-plugin/callback.d.mts.map                0.19 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/oauth/token.d.mts.map                                     0.19 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/marketplace/index.d.mts.map                 0.19 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/register/options.d.mts.map                   0.19 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/menus/index.d.mts.map                                     0.19 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/admin/themes/marketplace/index.d.mts.map                  0.19 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/register/verify.d.mts.map                    0.19 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/dev/emails.d.mts.map                                      0.19 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/auth/me.d.mts.map                                         0.18 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/revisions/_revisionId_/restore.d.mts.map                  0.18 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/middleware/request-context.d.mts.map                                 0.18 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/_id_/status.d.mts.map                      0.18 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/disable.d.mts.map                      0.18 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/sitemap-_collection_.xml.d.mts.map                            0.18 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/admin/byline-fields/reorder.d.mts.map                     0.18 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/admin/hooks/exclusive/index.d.mts.map                     0.18 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/typegen.d.mts.map                                         0.18 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/_name_/widgets.d.mts.map                     0.18 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/enable.d.mts.map                       0.18 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/update.d.mts.map                       0.18 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/_id_/disable.d.mts.map                        0.18 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/_name_/reorder.d.mts.map                     0.18 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/runtime.d.mts.map                                                          0.18 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/revisions/_revisionId_/index.d.mts.map                    0.18 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/index.d.mts.map                        0.18 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/_id_/enable.d.mts.map                         0.18 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/auth/oauth/_provider_.d.mts.map                           0.18 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/oauth/device/authorize.d.mts.map                          0.18 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/trash.d.mts.map                      0.18 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/updates.d.mts.map                           0.18 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/redirects/404s/summary.d.mts.map                          0.18 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/auth/invite/complete.d.mts.map                            0.18 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/auth/magic-link/verify.d.mts.map                          0.18 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/auth/signup/complete.d.mts.map                            0.18 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/media/file/_...key_.d.mts.map                             0.18 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/media/providers/index.d.mts.map                           0.18 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/setup/admin-verify.d.mts.map                              0.18 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/widget-components.d.mts.map                               0.18 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/admin/api-tokens/_id_.d.mts.map                           0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/counts.d.mts.map                           0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/index.d.mts.map                            0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/options.d.mts.map                            0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/auth/signup/request.d.mts.map                             0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_/reorder.d.mts.map                            0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/schema/orphans/_slug_.d.mts.map                           0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/version-CyfxLO9-.mjs                                                       0.17 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/middleware/redirect.d.mts.map                                        0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/oauth/token/refresh.d.mts.map                             0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/verify.d.mts.map                             0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/schema/orphans/index.d.mts.map                            0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/search/suggest.d.mts.map                                  0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/index.d.mts.map                             0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/auth/invite/accept.d.mts.map                              0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/auth/magic-link/send.d.mts.map                            0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/auth/signup/verify.d.mts.map                              0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/media/_id_/confirm.d.mts.map                              0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/oauth/device/token.d.mts.map                              0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/oauth/token/revoke.d.mts.map                              0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/bulk.d.mts.map                             0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/index.d.mts.map                              0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/media/upload-url.d.mts.map                                0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_/items.d.mts.map                              0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/search/enable.d.mts.map                                   0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/search/rebuild.d.mts.map                                  0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/index.d.mts.map                               0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/auth/invite/index.d.mts.map                               0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/oauth/device/code.d.mts.map                               0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/search/index.d.mts.map                                    0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/setup/dev-reset.d.mts.map                                 0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/themes/preview.d.mts.map                                  0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/middleware/setup.d.mts.map                                           0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/openapi.json.d.mts.map                                    0.17 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/astro/routes/api/search/stats.d.mts.map                                    0.16 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/well-known/auth.d.mts.map                                 0.16 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/schema/index.d.mts.map                                    0.16 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/setup/status.d.mts.map                                    0.16 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/astro/routes/api/auth/logout.d.mts.map                                     0.16 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/setup/admin.d.mts.map                                     0.16 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/astro/routes/api/setup/index.d.mts.map                                     0.16 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/astro/routes/api/dashboard.d.mts.map                                       0.16 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/astro/routes/api/manifest.d.mts.map                                        0.16 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/astro/routes/api/snapshot.d.mts.map                                        0.16 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/astro/routes/api/auth/mode.d.mts.map                                       0.16 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/astro/routes/sitemap.xml.d.mts.map                                         0.16 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/astro/routes/robots.txt.d.mts.map                                          0.15 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/db/postgres.d.mts.map                                                      0.15 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/auth/providers/github.d.mts.map                                            0.15 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/auth/providers/google.d.mts.map                                            0.15 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/db/libsql.d.mts.map                                                        0.14 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/db/sqlite.d.mts.map                                                        0.14 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/ssrf-BvgVcfNQ.mjs                                                          0.01 kB │ gzip:  0.03 kB
packages/core build: ℹ dist/index.d.mts                                                               18.38 kB │ gzip:  4.88 kB
packages/core build: ℹ dist/astro/types.d.mts                                                         13.05 kB │ gzip:  3.97 kB
packages/core build: ℹ dist/client/index.d.mts                                                        11.50 kB │ gzip:  3.14 kB
packages/core build: ℹ dist/api/schemas/index.d.mts                                                    8.30 kB │ gzip:  1.94 kB
packages/core build: ℹ dist/page/index.d.mts                                                           6.82 kB │ gzip:  2.27 kB
packages/core build: ℹ dist/plugin-types.d.mts                                                         6.61 kB │ gzip:  2.36 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/execute.d.mts                            3.92 kB │ gzip:  1.55 kB
packages/core build: ℹ dist/api/route-utils.d.mts                                                      2.94 kB │ gzip:  1.35 kB
packages/core build: ℹ dist/plugin-utils.d.mts                                                         2.85 kB │ gzip:  1.24 kB
packages/core build: ℹ dist/request-context.d.mts                                                      2.81 kB │ gzip:  1.29 kB
packages/core build: ℹ dist/astro/index.d.mts                                                          2.60 kB │ gzip:  1.17 kB
packages/core build: ℹ dist/client/cf-access.d.mts                                                     2.55 kB │ gzip:  1.03 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/analyze.d.mts                            2.52 kB │ gzip:  0.95 kB
packages/core build: ℹ dist/seo/index.d.mts                                                            2.45 kB │ gzip:  1.01 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/rewrite-url-helpers.d.mts                2.14 kB │ gzip:  0.89 kB
packages/core build: ℹ dist/database/instrumentation.d.mts                                             2.00 kB │ gzip:  0.95 kB
packages/core build: ℹ dist/storage/s3.d.mts                                                           1.61 kB │ gzip:  0.75 kB
packages/core build: ℹ dist/media/index.d.mts                                                          1.52 kB │ gzip:  0.63 kB
packages/core build: ℹ dist/storage/local.d.mts                                                        1.50 kB │ gzip:  0.70 kB
packages/core build: ℹ dist/astro/middleware.d.mts                                                     1.40 kB │ gzip:  0.74 kB
packages/core build: ℹ dist/plugins/adapt-sandbox-entry.d.mts                                          1.37 kB │ gzip:  0.65 kB
packages/core build: ℹ dist/media/local-runtime.d.mts                                                  1.34 kB │ gzip:  0.60 kB
packages/core build: ℹ dist/runtime.d.mts                                                              1.10 kB │ gzip:  0.58 kB
packages/core build: ℹ dist/astro/middleware/auth.d.mts                                                0.97 kB │ gzip:  0.50 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/media.d.mts                              0.96 kB │ gzip:  0.47 kB
packages/core build: ℹ dist/seed/index.d.mts                                                           0.82 kB │ gzip:  0.34 kB
packages/core build: ℹ dist/astro/middleware/redirect.d.mts                                            0.72 kB │ gzip:  0.45 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress-plugin/execute.d.mts                     0.67 kB │ gzip:  0.38 kB
packages/core build: ℹ dist/astro/middleware/setup.d.mts                                               0.67 kB │ gzip:  0.40 kB
packages/core build: ℹ dist/astro/middleware/request-context.d.mts                                     0.64 kB │ gzip:  0.40 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/rewrite-urls.d.mts                       0.59 kB │ gzip:  0.33 kB
packages/core build: ℹ dist/astro/routes/api/settings.d.mts                                            0.58 kB │ gzip:  0.33 kB
packages/core build: ℹ dist/db/index.d.mts                                                             0.58 kB │ gzip:  0.28 kB
packages/core build: ℹ dist/astro/routes/api/settings/email.d.mts                                      0.53 kB │ gzip:  0.32 kB
packages/core build: ℹ dist/astro/routes/api/search/index.d.mts                                        0.51 kB │ gzip:  0.31 kB
packages/core build: ℹ dist/astro/routes/api/media/_id_.d.mts                                          0.51 kB │ gzip:  0.28 kB
packages/core build: ℹ dist/astro/routes/api/import/probe.d.mts                                        0.50 kB │ gzip:  0.30 kB
packages/core build: ℹ dist/astro/routes/api/typegen.d.mts                                             0.49 kB │ gzip:  0.32 kB
packages/core build: ℹ dist/astro/routes/api/admin/api-tokens/index.d.mts                              0.48 kB │ gzip:  0.31 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/prepare.d.mts                            0.47 kB │ gzip:  0.27 kB
packages/core build: ℹ dist/astro/routes/api/search/suggest.d.mts                                      0.47 kB │ gzip:  0.30 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress-plugin/analyze.d.mts                     0.47 kB │ gzip:  0.29 kB
packages/core build: ℹ dist/auth/providers/github.d.mts                                                0.45 kB │ gzip:  0.30 kB
packages/core build: ℹ dist/auth/providers/google.d.mts                                                0.45 kB │ gzip:  0.30 kB
packages/core build: ℹ dist/astro/routes/api/comments/_collection_/_contentId_/index.d.mts             0.43 kB │ gzip:  0.28 kB
packages/core build: ℹ dist/astro/routes/api/search/enable.d.mts                                       0.42 kB │ gzip:  0.27 kB
packages/core build: ℹ dist/astro/routes/api/admin/oauth-clients/_id_.d.mts                            0.41 kB │ gzip:  0.24 kB
packages/core build: ℹ dist/astro/routes/api/mcp.d.mts                                                 0.41 kB │ gzip:  0.25 kB
packages/core build: ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_.d.mts                      0.39 kB │ gzip:  0.24 kB
packages/core build: ℹ dist/astro/routes/api/plugins/_pluginId_/_...path_.d.mts                        0.39 kB │ gzip:  0.23 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/terms/_taxonomy_.d.mts          0.39 kB │ gzip:  0.26 kB
packages/core build: ℹ dist/astro/routes/api/media/providers/_providerId_/_itemId_.d.mts               0.39 kB │ gzip:  0.24 kB
packages/core build: ℹ dist/astro/routes/PluginRegistry.d.mts                                          0.38 kB │ gzip:  0.25 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/_id_.d.mts                                 0.38 kB │ gzip:  0.26 kB
packages/core build: ℹ dist/astro/routes/api/admin/allowed-domains/_domain_.d.mts                      0.37 kB │ gzip:  0.24 kB
packages/core build: ℹ dist/astro/routes/api/media/providers/_providerId_/index.d.mts                  0.37 kB │ gzip:  0.23 kB
packages/core build: ℹ dist/astro/routes/api/media.d.mts                                               0.37 kB │ gzip:  0.24 kB
packages/core build: ℹ dist/astro/routes/api/admin/allowed-domains/index.d.mts                         0.36 kB │ gzip:  0.23 kB
packages/core build: ℹ dist/astro/routes/api/admin/oauth-clients/index.d.mts                           0.36 kB │ gzip:  0.23 kB
packages/core build: ℹ dist/astro/routes/api/search/rebuild.d.mts                                      0.35 kB │ gzip:  0.24 kB
packages/core build: ℹ dist/astro/routes/api/taxonomies/index.d.mts                                    0.35 kB │ gzip:  0.22 kB
packages/core build: ℹ dist/astro/routes/api/taxonomies/_name_/terms/index.d.mts                       0.34 kB │ gzip:  0.23 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/_id_.d.mts                                   0.34 kB │ gzip:  0.23 kB
packages/core build: ℹ dist/astro/routes/api/auth/me.d.mts                                             0.34 kB │ gzip:  0.23 kB
packages/core build: ℹ dist/db/postgres.d.mts                                                          0.34 kB │ gzip:  0.22 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.d.mts        0.33 kB │ gzip:  0.22 kB
packages/core build: ℹ dist/astro/routes/api/admin/byline-fields/_slug_.d.mts                          0.32 kB │ gzip:  0.21 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/_slug_/index.d.mts                     0.32 kB │ gzip:  0.21 kB
packages/core build: ℹ dist/db/libsql.d.mts                                                            0.31 kB │ gzip:  0.22 kB
packages/core build: ℹ dist/db/sqlite.d.mts                                                            0.31 kB │ gzip:  0.22 kB
packages/core build: ℹ dist/astro/routes/api/admin/bylines/_id_/index.d.mts                            0.31 kB │ gzip:  0.20 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_.d.mts                           0.31 kB │ gzip:  0.20 kB
packages/core build: ℹ dist/astro/routes/api/redirects/404s/index.d.mts                                0.31 kB │ gzip:  0.20 kB
packages/core build: ℹ dist/astro/routes/api/sections/_slug_.d.mts                                     0.30 kB │ gzip:  0.20 kB
packages/core build: ℹ dist/astro/routes/api/media/upload-url.d.mts                                    0.30 kB │ gzip:  0.21 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_.d.mts                                        0.30 kB │ gzip:  0.20 kB
packages/core build: ℹ dist/astro/routes/api/redirects/_id_.d.mts                                      0.30 kB │ gzip:  0.20 kB
packages/core build: ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_/translations.d.mts         0.30 kB │ gzip:  0.20 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/schedule.d.mts                  0.29 kB │ gzip:  0.20 kB
packages/core build: ℹ dist/astro/routes/api/admin/bylines/_id_/translations.d.mts                     0.28 kB │ gzip:  0.20 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/_slug_/fields/index.d.mts              0.28 kB │ gzip:  0.20 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/_name_/widgets/_id_.d.mts                    0.28 kB │ gzip:  0.20 kB
packages/core build: ℹ dist/astro/routes/api/media/providers/index.d.mts                               0.28 kB │ gzip:  0.21 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_/translations.d.mts                           0.28 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/admin/api-tokens/_id_.d.mts                               0.28 kB │ gzip:  0.21 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/index.d.mts                                0.28 kB │ gzip:  0.21 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/index.d.mts                          0.27 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_/items/_id_.d.mts                             0.27 kB │ gzip:  0.20 kB
packages/core build: ℹ dist/astro/routes/api/admin/byline-fields/index.d.mts                           0.27 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/oauth/register.d.mts                                      0.27 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/index.d.mts                            0.27 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/_name_.d.mts                                 0.27 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/media/_id_/confirm.d.mts                                  0.27 kB │ gzip:  0.20 kB
packages/core build: ℹ dist/astro/routes/api/well-known/oauth-authorization-server.d.mts               0.27 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/setup/dev-bypass.d.mts                                    0.27 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/_id_/index.d.mts                              0.27 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/auth/dev-bypass.d.mts                                     0.27 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/bylines/index.d.mts                                 0.27 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/oauth/authorize.d.mts                                     0.27 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/oauth/token.d.mts                                         0.27 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/well-known/oauth-protected-resource.d.mts                 0.26 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/index.d.mts                                  0.26 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/dev/emails.d.mts                                          0.26 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/redirects/index.d.mts                                     0.26 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/search/stats.d.mts                                        0.26 kB │ gzip:  0.20 kB
packages/core build: ℹ dist/astro/routes/api/sections/index.d.mts                                      0.26 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/discard-draft.d.mts             0.26 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/menus/index.d.mts                                         0.26 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/permanent.d.mts                 0.26 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/preview-url.d.mts               0.26 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/translations.d.mts              0.26 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/_slug_/fields/reorder.d.mts            0.25 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/registry/_id_/uninstall.d.mts               0.25 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/admin/themes/marketplace/_id_/thumbnail.d.mts             0.25 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/install.d.mts              0.25 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/auth/invite/register-options.d.mts                        0.25 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/duplicate.d.mts                 0.25 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/unpublish.d.mts                 0.25 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/_id_/send-recovery.d.mts                      0.25 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/revisions.d.mts                 0.25 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/sitemap-_collection_.xml.d.mts                                0.25 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/admin/hooks/exclusive/_hookName_.d.mts                    0.25 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/registry/_id_/update.d.mts                  0.25 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/publish.d.mts                   0.25 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/restore.d.mts                   0.25 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/index.d.mts                0.25 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/admin/themes/marketplace/_id_/index.d.mts                 0.24 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/compare.d.mts                   0.24 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress-plugin/callback.d.mts                    0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/uninstall.d.mts                        0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/icon.d.mts                 0.24 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/registry/artifact.d.mts                     0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/registry/install.d.mts                      0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/revisions/_revisionId_/restore.d.mts                      0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/auth/oauth/_provider_/callback.d.mts                      0.24 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/register/options.d.mts                       0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/byline-fields/_slug_/usage.d.mts                    0.24 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/admin/byline-fields/reorder.d.mts                         0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/marketplace/index.d.mts                     0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/register/verify.d.mts                        0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/_name_/reorder.d.mts                         0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/_name_/widgets.d.mts                         0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/disable.d.mts                          0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/themes/marketplace/index.d.mts                      0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/widget-components.d.mts                                   0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/enable.d.mts                           0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/update.d.mts                           0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/_id_/disable.d.mts                            0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/oauth/device/authorize.d.mts                              0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/revisions/_revisionId_/index.d.mts                        0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/_id_/status.d.mts                          0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/hooks/exclusive/index.d.mts                         0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/setup/admin-verify.d.mts                                  0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/_id_/enable.d.mts                             0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/auth/oauth/_provider_.d.mts                               0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/trash.d.mts                          0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/auth/invite/complete.d.mts                                0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/auth/signup/complete.d.mts                                0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/index.d.mts                            0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/options.d.mts                                0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_/reorder.d.mts                                0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/redirects/404s/summary.d.mts                              0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/schema/orphans/_slug_.d.mts                               0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/updates.d.mts                               0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/auth/magic-link/verify.d.mts                              0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/auth/signup/request.d.mts                                 0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/oauth/token/refresh.d.mts                                 0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/counts.d.mts                               0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/verify.d.mts                                 0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/media/file/_...key_.d.mts                                 0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/auth/magic-link/send.d.mts                                0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/oauth/token/revoke.d.mts                                  0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/setup/dev-reset.d.mts                                     0.23 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/bulk.d.mts                                 0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_/items.d.mts                                  0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/oauth/device/token.d.mts                                  0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/schema/orphans/index.d.mts                                0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/index.d.mts                                 0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/auth/invite/accept.d.mts                                  0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/auth/invite/index.d.mts                                   0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/auth/signup/verify.d.mts                                  0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/openapi.json.d.mts                                        0.23 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/index.d.mts                                  0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/oauth/device/code.d.mts                                   0.23 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/themes/preview.d.mts                                      0.23 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/index.d.mts                                   0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/auth/logout.d.mts                                         0.22 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/well-known/auth.d.mts                                     0.22 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/dashboard.d.mts                                           0.22 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/setup/admin.d.mts                                         0.22 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/setup/index.d.mts                                         0.22 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/setup/status.d.mts                                        0.22 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/sitemap.xml.d.mts                                             0.22 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/schema/index.d.mts                                        0.22 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/manifest.d.mts                                            0.22 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/snapshot.d.mts                                            0.22 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/robots.txt.d.mts                                              0.22 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/auth/mode.d.mts                                           0.22 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/cli/index.d.mts                                                            0.01 kB │ gzip:  0.03 kB
packages/core build: ℹ dist/index-Ch7w7zqc.d.mts                                                     158.55 kB │ gzip: 43.19 kB
packages/core build: ℹ dist/byline-fields-Cx1i-q-m.d.mts                                              79.04 kB │ gzip:  9.29 kB
packages/core build: ℹ dist/types-jbkzJ1j_.d.mts                                                      40.10 kB │ gzip: 10.71 kB
packages/core build: ℹ dist/types-OT_Es5mp.d.mts                                                      13.42 kB │ gzip:  2.98 kB
packages/core build: ℹ dist/types-DWnN7weG.d.mts                                                       9.78 kB │ gzip:  3.24 kB
packages/core build: ℹ dist/validate-c7q7DID3.d.mts                                                    9.46 kB │ gzip:  2.97 kB
packages/core build: ℹ dist/placeholder-B9lUUEmj.d.mts                                                 8.70 kB │ gzip:  2.96 kB
packages/core build: ℹ dist/index-BpYeJO1E.d.mts                                                       7.74 kB │ gzip:  2.83 kB
packages/core build: ℹ dist/types-i8_uzhMD.d.mts                                                       6.54 kB │ gzip:  2.54 kB
packages/core build: ℹ dist/options-xfkUPCKd.d.mts                                                     6.44 kB │ gzip:  2.43 kB
packages/core build: ℹ dist/types-Qa7-HJJC.d.mts                                                       6.19 kB │ gzip:  2.34 kB
packages/core build: ℹ dist/types-DbCWhHet.d.mts                                                       6.03 kB │ gzip:  1.79 kB
packages/core build: ℹ dist/types-kwqCOUxj.d.mts                                                       5.04 kB │ gzip:  1.78 kB
packages/core build: ℹ dist/adapters-C5AWLJSD.d.mts                                                    3.21 kB │ gzip:  1.32 kB
packages/core build: ℹ dist/types-DX6v9KzJ.d.mts                                                       2.64 kB │ gzip:  1.17 kB
packages/core build: ℹ dist/runner-BcRuXq_h.d.mts                                                      1.98 kB │ gzip:  0.93 kB
packages/core build: ℹ dist/transport-OnMNbsIA.d.mts                                                   1.67 kB │ gzip:  0.76 kB
packages/core build: ℹ 1019 files, total: 7354.47 kB
packages/core build: ✔ Build complete in 4824ms
packages/core build: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugins. Here is a breakdown:
packages/core build:   - rolldown-plugin-dts:generate (38%)
packages/core build:   - rolldown-plugin-dts:resolver (36%)
packages/core build:   - rolldown-plugin-dts:fake-js (18%)
packages/core build: See https://rolldown.rs/options/checks#plugintimings for more details.
packages/core build: Done
packages/cloudflare build$ tsdown
packages/plugins/atproto build$ node node_modules/@emdash-cms/plugin-cli/dist/index.mjs build
packages/plugins/awcms-micro-docs build$ tsdown
packages/plugins/audit-log build$ node node_modules/@emdash-cms/plugin-cli/dist/index.mjs build
packages/plugins/awcms-micro-docs build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/cloudflare build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/plugins/awcms-micro-docs build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-docs/tsdown.config.ts
packages/plugins/awcms-micro-docs build: ℹ entry: src/index.ts, src/admin.tsx
packages/plugins/awcms-micro-docs build: ℹ target: es2023
packages/plugins/awcms-micro-docs build: ℹ tsconfig: tsconfig.json
packages/plugins/awcms-micro-docs build: ℹ Build start
packages/plugins/awcms-micro-docs build: ℹ Cleaning 10 files
packages/cloudflare build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/cloudflare/tsdown.config.ts
packages/cloudflare build: ℹ entry: src/index.ts, src/db/d1.ts, src/db/do.ts, src/db/playground.ts, src/db/playground-middleware.ts, src/storage/r2.ts, src/auth/index.ts, src/sandbox/index.ts, src/worker.ts, src/plugins/index.ts, src/media/images-runtime.ts, src/media/stream-runtime.ts, src/cache/runtime.ts, src/cache/config.ts
packages/cloudflare build: ℹ tsconfig: tsconfig.json
packages/cloudflare build: ℹ Build start
packages/cloudflare build: ℹ Cleaning 45 files
packages/plugins/audit-log build: ◐ Building plugin...
packages/plugins/audit-log build: ℹ Manifest: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/audit-log/emdash-plugin.jsonc
packages/plugins/audit-log build: ℹ Plugin entry: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/audit-log/src/plugin.ts
packages/plugins/audit-log build: ℹ Package: @emdash-cms/plugin-audit-log
packages/plugins/atproto build: ◐ Building plugin...
packages/plugins/audit-log build: ◐ Building runtime entry...
packages/plugins/audit-log build: ℹ entry: src/plugin.ts
packages/plugins/audit-log build: ℹ tsconfig: tsconfig.json
packages/plugins/audit-log build: ℹ Build start
packages/plugins/atproto build: ℹ Manifest: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/atproto/emdash-plugin.jsonc
packages/plugins/atproto build: ℹ Plugin entry: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/atproto/src/plugin.ts
packages/plugins/atproto build: ℹ Package: @emdash-cms/plugin-atproto
packages/plugins/atproto build: ◐ Building runtime entry...
packages/plugins/atproto build: ℹ entry: src/plugin.ts
packages/plugins/atproto build: ℹ tsconfig: tsconfig.json
packages/plugins/atproto build: ℹ Build start
packages/plugins/atproto build: ℹ ../../../../../../../../tmp/emdash-build-fJnopw/runtime/plugin.mjs        20.02 kB │ gzip:  5.90 kB
packages/plugins/atproto build: ℹ ../../../../../../../../tmp/emdash-build-fJnopw/runtime/plugin.mjs.map    77.27 kB │ gzip: 17.16 kB
packages/plugins/atproto build: ℹ ../../../../../../../../tmp/emdash-build-fJnopw/runtime/plugin.d.mts.map   0.79 kB │ gzip:  0.32 kB
packages/plugins/atproto build: ℹ ../../../../../../../../tmp/emdash-build-fJnopw/runtime/plugin.d.mts       3.14 kB │ gzip:  0.80 kB
packages/plugins/atproto build: ℹ 4 files, total: 101.22 kB
packages/plugins/atproto build: ✔ Build complete in 1937ms
packages/plugins/atproto build: ✔ Built plugin.mjs
packages/plugins/atproto build: ◐ Probing plugin surface...
packages/plugins/atproto build: ℹ entry: src/plugin.ts
packages/plugins/atproto build: ℹ tsconfig: tsconfig.json
packages/plugins/atproto build: ℹ Build start
packages/plugins/audit-log build: ℹ ../../../../../../../../tmp/emdash-build-sR4QE8/runtime/plugin.mjs         4.80 kB │ gzip: 1.60 kB
packages/plugins/audit-log build: ℹ ../../../../../../../../tmp/emdash-build-sR4QE8/runtime/plugin.mjs.map    17.30 kB │ gzip: 4.37 kB
packages/plugins/audit-log build: ℹ ../../../../../../../../tmp/emdash-build-sR4QE8/runtime/plugin.d.mts.map   0.40 kB │ gzip: 0.21 kB
packages/plugins/audit-log build: ℹ ../../../../../../../../tmp/emdash-build-sR4QE8/runtime/plugin.d.mts       4.76 kB │ gzip: 0.81 kB
packages/plugins/audit-log build: ℹ 4 files, total: 27.26 kB
packages/plugins/atproto build: ℹ ../../../../../../../../tmp/emdash-build-fJnopw/plugin-probe/plugin.mjs  36.48 kB │ gzip: 8.53 kB
packages/plugins/atproto build: ℹ 1 files, total: 36.48 kB
packages/plugins/atproto build: ✔ Build complete in 10ms
packages/plugins/audit-log build: ✔ Build complete in 1990ms
packages/plugins/audit-log build: ✔ Built plugin.mjs
packages/plugins/audit-log build: ◐ Probing plugin surface...
packages/plugins/audit-log build: ℹ entry: src/plugin.ts
packages/plugins/audit-log build: ℹ tsconfig: tsconfig.json
packages/plugins/atproto build: ℹ   Hooks: plugin:install, content:afterSave, content:afterPublish, content:afterDelete, page:metadata
packages/plugins/audit-log build: ℹ Build start
packages/plugins/atproto build: ℹ   Routes: status, test-connection, sync-publication, recent-syncs, verification, admin
packages/plugins/atproto build: ✔ Wrote manifest.json
packages/plugins/atproto build: ◐ Generating descriptor module...
packages/plugins/atproto build: ✔ Wrote index.mjs
packages/plugins/atproto build: ✔ Plugin built: atproto@0.2.0
packages/plugins/atproto build: ℹ Output:
packages/plugins/atproto build:   /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/atproto/dist/index.mjs
packages/plugins/atproto build:   /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/atproto/dist/plugin.mjs
packages/plugins/atproto build:   /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/atproto/dist/manifest.json
packages/plugins/audit-log build: ℹ ../../../../../../../../tmp/emdash-build-sR4QE8/plugin-probe/plugin.mjs  8.20 kB │ gzip: 2.12 kB
packages/plugins/audit-log build: ℹ 1 files, total: 8.20 kB
packages/plugins/audit-log build: ✔ Build complete in 8ms
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
packages/plugins/audit-log build: Done
.../plugins/awcms-micro-email-mailketing build$ tsdown
packages/plugins/atproto build: Done
packages/plugins/awcms-micro-gallery build$ tsdown
packages/cloudflare build: ℹ dist/db/playground-middleware.mjs       26.77 kB │ gzip:  8.07 kB
packages/cloudflare build: ℹ dist/db/do.mjs                          17.43 kB │ gzip:  6.26 kB
packages/cloudflare build: ℹ dist/db/d1.mjs                          11.71 kB │ gzip:  4.54 kB
packages/cloudflare build: ℹ dist/media/images-runtime.mjs            7.44 kB │ gzip:  2.19 kB
packages/cloudflare build: ℹ dist/media/stream-runtime.mjs            7.32 kB │ gzip:  2.27 kB
packages/cloudflare build: ℹ dist/cache/runtime.mjs                   6.89 kB │ gzip:  2.50 kB
packages/cloudflare build: ℹ dist/index.mjs                           5.91 kB │ gzip:  2.22 kB
packages/cloudflare build: ℹ dist/plugins/index.mjs                   5.33 kB │ gzip:  1.81 kB
packages/cloudflare build: ℹ dist/auth/index.mjs                      4.71 kB │ gzip:  1.87 kB
packages/cloudflare build: ℹ dist/storage/r2.mjs                      4.19 kB │ gzip:  1.55 kB
packages/cloudflare build: ℹ dist/worker.mjs                          2.52 kB │ gzip:  1.20 kB
packages/cloudflare build: ℹ dist/cache/config.mjs                    1.63 kB │ gzip:  0.83 kB
packages/cloudflare build: ℹ dist/db/playground.mjs                   1.14 kB │ gzip:  0.61 kB
packages/cloudflare build: ℹ dist/sandbox/index.mjs                   0.29 kB │ gzip:  0.17 kB
packages/cloudflare build: ℹ dist/runner-B3ZSHaY0.mjs                43.65 kB │ gzip: 11.91 kB
packages/cloudflare build: ℹ dist/do-class-DYgovHsQ.mjs               6.67 kB │ gzip:  2.66 kB
packages/cloudflare build: ℹ dist/d1-introspector-DodJMbYx.mjs        1.92 kB │ gzip:  0.92 kB
packages/cloudflare build: ℹ dist/do-playground-routes-CmwFeGwJ.mjs   1.63 kB │ gzip:  0.77 kB
packages/cloudflare build: ℹ dist/do-dialect-CU1pWN54.mjs             1.37 kB │ gzip:  0.56 kB
packages/cloudflare build: ℹ dist/index.d.mts                         7.09 kB │ gzip:  2.68 kB
packages/cloudflare build: ℹ dist/db/do.d.mts                         3.60 kB │ gzip:  1.46 kB
packages/cloudflare build: ℹ dist/auth/index.d.mts                    2.17 kB │ gzip:  0.93 kB
packages/cloudflare build: ℹ dist/cache/config.d.mts                  1.80 kB │ gzip:  0.85 kB
packages/cloudflare build: ℹ dist/db/d1.d.mts                         1.72 kB │ gzip:  0.84 kB
packages/cloudflare build: ℹ dist/db/playground.d.mts                 1.57 kB │ gzip:  0.79 kB
packages/cloudflare build: ℹ dist/cache/runtime.d.mts                 1.17 kB │ gzip:  0.52 kB
packages/cloudflare build: ℹ dist/storage/r2.d.mts                    1.07 kB │ gzip:  0.52 kB
packages/cloudflare build: ℹ dist/worker.d.mts                        1.06 kB │ gzip:  0.46 kB
packages/cloudflare build: ℹ dist/plugins/index.d.mts                 0.89 kB │ gzip:  0.45 kB
packages/cloudflare build: ℹ dist/db/playground-middleware.d.mts      0.82 kB │ gzip:  0.49 kB
packages/cloudflare build: ℹ dist/sandbox/index.d.mts                 0.38 kB │ gzip:  0.19 kB
packages/cloudflare build: ℹ dist/media/images-runtime.d.mts          0.36 kB │ gzip:  0.22 kB
packages/cloudflare build: ℹ dist/media/stream-runtime.d.mts          0.36 kB │ gzip:  0.21 kB
packages/cloudflare build: ℹ dist/wrapper-CD0IG-Rl.d.mts              8.62 kB │ gzip:  2.50 kB
packages/cloudflare build: ℹ dist/do-class-C6YMosci.d.mts             2.33 kB │ gzip:  1.09 kB
packages/cloudflare build: ℹ dist/images-DyrHbrpw.d.mts               2.10 kB │ gzip:  0.76 kB
packages/cloudflare build: ℹ dist/stream-C1v14LaP.d.mts               1.93 kB │ gzip:  0.74 kB
packages/cloudflare build: ℹ dist/do-types-CNmdmS8-.d.mts             0.47 kB │ gzip:  0.30 kB
packages/cloudflare build: ℹ 38 files, total: 198.02 kB
packages/cloudflare build: ✔ Build complete in 2177ms
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
packages/cloudflare build: Done
packages/plugins/awcms-micro-sikesra build$ tsdown
packages/plugins/awcms-micro-gallery build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
.../plugins/awcms-micro-email-mailketing build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/plugins/awcms-micro-gallery build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-gallery/tsdown.config.ts
packages/plugins/awcms-micro-gallery build: ℹ entry: src/index.ts, src/sandbox.ts
packages/plugins/awcms-micro-gallery build: ℹ target: es2023
packages/plugins/awcms-micro-gallery build: ℹ tsconfig: tsconfig.json
packages/plugins/awcms-micro-gallery build: ℹ Build start
packages/plugins/awcms-micro-gallery build: ℹ Cleaning 10 files
.../plugins/awcms-micro-email-mailketing build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-email-mailketing/tsdown.config.ts
.../plugins/awcms-micro-email-mailketing build: ℹ entry: src/index.ts, src/admin.tsx, src/sandbox.ts
.../plugins/awcms-micro-email-mailketing build: ℹ target: es2023
.../plugins/awcms-micro-email-mailketing build: ℹ tsconfig: tsconfig.json
.../plugins/awcms-micro-email-mailketing build: ℹ Build start
.../plugins/awcms-micro-email-mailketing build: ℹ Cleaning 8 files
packages/plugins/awcms-micro-sikesra build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/plugins/awcms-micro-sikesra build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/tsdown.config.ts
packages/plugins/awcms-micro-sikesra build: ℹ entry: src/index.ts, src/admin.tsx, src/navigation.ts, src/sandbox.ts
packages/plugins/awcms-micro-sikesra build: ℹ target: es2023
packages/plugins/awcms-micro-sikesra build: ℹ tsconfig: tsconfig.json
packages/plugins/awcms-micro-sikesra build: ℹ Build start
packages/plugins/awcms-micro-sikesra build: ℹ Cleaning 11 files
packages/plugins/awcms-micro-docs build: ℹ dist/admin.js                  5.12 kB │ gzip: 1.05 kB
packages/plugins/awcms-micro-docs build: ℹ dist/index.js                  0.97 kB │ gzip: 0.45 kB
packages/plugins/awcms-micro-docs build: ℹ dist/content-s6AnXlIg.js.map  12.78 kB │ gzip: 3.61 kB
packages/plugins/awcms-micro-docs build: ℹ dist/content-s6AnXlIg.js       9.25 kB │ gzip: 3.05 kB
packages/plugins/awcms-micro-docs build: ℹ dist/admin.js.map              5.91 kB │ gzip: 1.57 kB
packages/plugins/awcms-micro-docs build: ℹ dist/index.js.map              1.51 kB │ gzip: 0.63 kB
packages/plugins/awcms-micro-docs build: ℹ dist/index.d.ts.map            0.58 kB │ gzip: 0.27 kB
packages/plugins/awcms-micro-docs build: ℹ dist/admin.d.ts.map            0.12 kB │ gzip: 0.12 kB
packages/plugins/awcms-micro-docs build: ℹ dist/index.d.ts                1.30 kB │ gzip: 0.51 kB
packages/plugins/awcms-micro-docs build: ℹ dist/admin.d.ts                0.21 kB │ gzip: 0.15 kB
packages/plugins/awcms-micro-docs build: ℹ 10 files, total: 37.76 kB
packages/plugins/awcms-micro-docs build: ✔ Build complete in 3299ms
packages/plugins/awcms-micro-docs build: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugins. Here is a breakdown:
packages/plugins/awcms-micro-docs build:   - rolldown-plugin-dts:generate (80%)
packages/plugins/awcms-micro-docs build:   - tsdown:external (20%)
packages/plugins/awcms-micro-docs build: See https://rolldown.rs/options/checks#plugintimings for more details.
packages/plugins/awcms-micro-docs build: Done
.../plugins/awcms-micro-website-social build$ tsdown
.../plugins/awcms-micro-website-social build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
.../plugins/awcms-micro-website-social build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-website-social/tsdown.config.ts
.../plugins/awcms-micro-website-social build: ℹ entry: src/index.ts, src/admin.tsx
.../plugins/awcms-micro-website-social build: ℹ target: es2023
.../plugins/awcms-micro-website-social build: ℹ tsconfig: tsconfig.json
.../plugins/awcms-micro-website-social build: ℹ Build start
.../plugins/awcms-micro-website-social build: ℹ Cleaning 8 files
packages/plugins/awcms-micro-gallery build: ℹ dist/index.mjs                    29.33 kB │ gzip:  6.78 kB
packages/plugins/awcms-micro-gallery build: ℹ dist/sandbox.mjs                  26.63 kB │ gzip:  6.02 kB
packages/plugins/awcms-micro-gallery build: ℹ dist/index.mjs.map                55.59 kB │ gzip: 12.29 kB
packages/plugins/awcms-micro-gallery build: ℹ dist/sandbox.mjs.map              51.85 kB │ gzip: 11.35 kB
packages/plugins/awcms-micro-gallery build: ℹ dist/validation-IIdTEAKI.mjs.map  28.07 kB │ gzip:  6.75 kB
packages/plugins/awcms-micro-gallery build: ℹ dist/validation-IIdTEAKI.mjs      17.00 kB │ gzip:  4.47 kB
packages/plugins/awcms-micro-gallery build: ℹ dist/index.d.mts.map               0.87 kB │ gzip:  0.36 kB
packages/plugins/awcms-micro-gallery build: ℹ dist/sandbox.d.mts.map             0.12 kB │ gzip:  0.12 kB
packages/plugins/awcms-micro-gallery build: ℹ dist/index.d.mts                   3.57 kB │ gzip:  1.02 kB
packages/plugins/awcms-micro-gallery build: ℹ dist/sandbox.d.mts                 0.21 kB │ gzip:  0.16 kB
packages/plugins/awcms-micro-gallery build: ℹ 10 files, total: 213.24 kB
packages/plugins/awcms-micro-gallery build: ✔ Build complete in 1822ms
packages/plugins/awcms-micro-gallery build: Done
packages/plugins/marketplace-test build$ node node_modules/@emdash-cms/plugin-cli/dist/index.mjs build
packages/plugins/marketplace-test build: ◐ Building plugin...
packages/plugins/marketplace-test build: ℹ Manifest: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/marketplace-test/emdash-plugin.jsonc
packages/plugins/marketplace-test build: ℹ Plugin entry: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/marketplace-test/src/plugin.ts
packages/plugins/marketplace-test build: ℹ Package: @emdash-cms/plugin-marketplace-test
packages/plugins/marketplace-test build: ◐ Building runtime entry...
packages/plugins/marketplace-test build: ℹ entry: src/plugin.ts
packages/plugins/marketplace-test build: ℹ tsconfig: tsconfig.json
packages/plugins/marketplace-test build: ℹ Build start
packages/plugins/awcms-micro-sikesra build: ℹ dist/admin.js                           360.78 kB │ gzip: 54.33 kB
packages/plugins/awcms-micro-sikesra build: ℹ dist/index.js                             2.79 kB │ gzip:  0.99 kB
packages/plugins/awcms-micro-sikesra build: ℹ dist/navigation.js                        0.78 kB │ gzip:  0.32 kB
packages/plugins/awcms-micro-sikesra build: ℹ dist/sandbox.js                           0.30 kB │ gzip:  0.21 kB
packages/plugins/awcms-micro-sikesra build: ℹ dist/runtime-5dclkDQF.js                381.89 kB │ gzip: 77.95 kB
packages/plugins/awcms-micro-sikesra build: ℹ dist/field-standards-DPRMDU-F.js         30.46 kB │ gzip:  5.13 kB
packages/plugins/awcms-micro-sikesra build: ℹ dist/AwcmsPluginHeaderMenu-V7ITPBZD.js   13.98 kB │ gzip:  3.29 kB
packages/plugins/awcms-micro-sikesra build: ℹ dist/index.d.ts                           7.29 kB │ gzip:  1.91 kB
packages/plugins/awcms-micro-sikesra build: ℹ dist/navigation.d.ts                      6.04 kB │ gzip:  1.38 kB
packages/plugins/awcms-micro-sikesra build: ℹ dist/admin.d.ts                           3.20 kB │ gzip:  1.04 kB
packages/plugins/awcms-micro-sikesra build: ℹ dist/sandbox.d.ts                         2.23 kB │ gzip:  0.50 kB
packages/plugins/awcms-micro-sikesra build: ℹ 11 files, total: 809.74 kB
packages/plugins/awcms-micro-sikesra build: ✔ Build complete in 3209ms
packages/plugins/awcms-micro-sikesra build: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugin `rolldown-plugin-dts:generate`. See https://rolldown.rs/options/checks#plugintimings for more details.
packages/plugins/awcms-micro-sikesra build: Done
packages/plugins/sandboxed-test build$ node node_modules/@emdash-cms/plugin-cli/dist/index.mjs build
.../plugins/awcms-micro-email-mailketing build: ℹ dist/admin.js              51.52 kB │ gzip: 7.27 kB
.../plugins/awcms-micro-email-mailketing build: ℹ dist/index.js               1.78 kB │ gzip: 0.61 kB
.../plugins/awcms-micro-email-mailketing build: ℹ dist/sandbox.js             0.26 kB │ gzip: 0.18 kB
.../plugins/awcms-micro-email-mailketing build: ℹ dist/runtime-BG998H6G.js   35.19 kB │ gzip: 7.26 kB
.../plugins/awcms-micro-email-mailketing build: ℹ dist/messages-CyXQWqnu.js  12.95 kB │ gzip: 2.86 kB
.../plugins/awcms-micro-email-mailketing build: ℹ dist/index.d.ts             0.71 kB │ gzip: 0.32 kB
.../plugins/awcms-micro-email-mailketing build: ℹ dist/sandbox.d.ts           0.44 kB │ gzip: 0.27 kB
.../plugins/awcms-micro-email-mailketing build: ℹ dist/admin.d.ts             0.21 kB │ gzip: 0.15 kB
.../plugins/awcms-micro-email-mailketing build: ℹ 8 files, total: 103.06 kB
.../plugins/awcms-micro-email-mailketing build: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugin `rolldown-plugin-dts:generate`. See https://rolldown.rs/options/checks#plugintimings for more details.
.../plugins/awcms-micro-email-mailketing build: ✔ Build complete in 3422ms
.../plugins/awcms-micro-email-mailketing build: Done
packages/plugins/webhook-notifier build$ node node_modules/@emdash-cms/plugin-cli/dist/index.mjs build
packages/plugins/sandboxed-test build: ◐ Building plugin...
packages/plugins/sandboxed-test build: ℹ Manifest: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/sandboxed-test/emdash-plugin.jsonc
packages/plugins/sandboxed-test build: ℹ Plugin entry: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/sandboxed-test/src/plugin.ts
packages/plugins/sandboxed-test build: ℹ Package: @emdash-cms/plugin-sandboxed-test
packages/plugins/sandboxed-test build: ◐ Building runtime entry...
packages/plugins/sandboxed-test build: ℹ entry: src/plugin.ts
packages/plugins/sandboxed-test build: ℹ tsconfig: tsconfig.json
packages/plugins/sandboxed-test build: ℹ Build start
packages/plugins/webhook-notifier build: ◐ Building plugin...
packages/plugins/webhook-notifier build: ℹ Manifest: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/webhook-notifier/emdash-plugin.jsonc
packages/plugins/webhook-notifier build: ℹ Plugin entry: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/webhook-notifier/src/plugin.ts
packages/plugins/webhook-notifier build: ℹ Package: @emdash-cms/plugin-webhook-notifier
packages/plugins/webhook-notifier build: ◐ Building runtime entry...
packages/plugins/webhook-notifier build: ℹ entry: src/plugin.ts
packages/plugins/webhook-notifier build: ℹ tsconfig: tsconfig.json
packages/plugins/webhook-notifier build: ℹ Build start
packages/plugins/marketplace-test build: ℹ ../../../../../../../../tmp/emdash-build-ZpEzNy/runtime/plugin.mjs        0.58 kB │ gzip: 0.34 kB
packages/plugins/marketplace-test build: ℹ ../../../../../../../../tmp/emdash-build-ZpEzNy/runtime/plugin.mjs.map    2.47 kB │ gzip: 1.12 kB
packages/plugins/marketplace-test build: ℹ ../../../../../../../../tmp/emdash-build-ZpEzNy/runtime/plugin.d.mts.map  0.18 kB │ gzip: 0.15 kB
packages/plugins/marketplace-test build: ℹ ../../../../../../../../tmp/emdash-build-ZpEzNy/runtime/plugin.d.mts      1.59 kB │ gzip: 0.70 kB
packages/plugins/marketplace-test build: ℹ 4 files, total: 4.82 kB
packages/plugins/marketplace-test build: ✔ Build complete in 1607ms
packages/plugins/marketplace-test build: ✔ Built plugin.mjs
packages/plugins/marketplace-test build: ◐ Probing plugin surface...
packages/plugins/marketplace-test build: ℹ entry: src/plugin.ts
packages/plugins/marketplace-test build: ℹ tsconfig: tsconfig.json
packages/plugins/marketplace-test build: ℹ Build start
packages/plugins/marketplace-test build: ℹ ../../../../../../../../tmp/emdash-build-ZpEzNy/plugin-probe/plugin.mjs  0.85 kB │ gzip: 0.44 kB
packages/plugins/marketplace-test build: ℹ 1 files, total: 0.85 kB
packages/plugins/marketplace-test build: ✔ Build complete in 7ms
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
packages/workerd build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/workerd build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/workerd/tsdown.config.ts
packages/workerd build: ℹ entry: src/index.ts, src/sandbox/index.ts
packages/workerd build: ℹ tsconfig: tsconfig.json
packages/workerd build: ℹ Build start
packages/workerd build: ℹ Cleaning 7 files
.../plugins/awcms-micro-website-social build: ℹ dist/admin.js        5.09 kB │ gzip: 1.86 kB
.../plugins/awcms-micro-website-social build: ℹ dist/index.js        1.17 kB │ gzip: 0.47 kB
.../plugins/awcms-micro-website-social build: ℹ dist/admin.js.map    6.97 kB │ gzip: 2.54 kB
.../plugins/awcms-micro-website-social build: ℹ dist/index.js.map    1.66 kB │ gzip: 0.67 kB
.../plugins/awcms-micro-website-social build: ℹ dist/index.d.ts.map  0.20 kB │ gzip: 0.16 kB
.../plugins/awcms-micro-website-social build: ℹ dist/admin.d.ts.map  0.12 kB │ gzip: 0.12 kB
.../plugins/awcms-micro-website-social build: ℹ dist/index.d.ts      0.70 kB │ gzip: 0.33 kB
.../plugins/awcms-micro-website-social build: ℹ dist/admin.d.ts      0.21 kB │ gzip: 0.15 kB
.../plugins/awcms-micro-website-social build: ℹ 8 files, total: 16.12 kB
.../plugins/awcms-micro-website-social build: ✔ Build complete in 2925ms
.../plugins/awcms-micro-website-social build: Done
packages/plugins/sandboxed-test build: ℹ ../../../../../../../../tmp/emdash-build-LH1TMO/runtime/plugin.mjs        19.59 kB │ gzip:  5.31 kB
packages/plugins/sandboxed-test build: ℹ ../../../../../../../../tmp/emdash-build-LH1TMO/runtime/plugin.mjs.map    62.07 kB │ gzip: 13.43 kB
packages/plugins/sandboxed-test build: ℹ ../../../../../../../../tmp/emdash-build-LH1TMO/runtime/plugin.d.mts.map   1.75 kB │ gzip:  0.37 kB
packages/plugins/sandboxed-test build: ℹ ../../../../../../../../tmp/emdash-build-LH1TMO/runtime/plugin.d.mts       8.47 kB │ gzip:  1.15 kB
packages/plugins/sandboxed-test build: ℹ 4 files, total: 91.88 kB
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
packages/plugins/sandboxed-test build: ✔ Build complete in 1501ms
packages/plugins/sandboxed-test build: ✔ Built plugin.mjs
packages/plugins/sandboxed-test build: ◐ Probing plugin surface...
packages/plugins/sandboxed-test build: ℹ entry: src/plugin.ts
packages/plugins/sandboxed-test build: ℹ tsconfig: tsconfig.json
packages/plugins/sandboxed-test build: ℹ Build start
packages/plugins/sandboxed-test build: ℹ ../../../../../../../../tmp/emdash-build-LH1TMO/plugin-probe/plugin.mjs  29.37 kB │ gzip: 6.51 kB
packages/plugins/sandboxed-test build: ℹ 1 files, total: 29.37 kB
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
packages/plugins/sandboxed-test build: ✔ Build complete in 13ms
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
packages/plugins/webhook-notifier build: ℹ ../../../../../../../../tmp/emdash-build-wQqZGm/runtime/plugin.mjs         9.25 kB │ gzip: 3.05 kB
packages/plugins/webhook-notifier build: ℹ ../../../../../../../../tmp/emdash-build-wQqZGm/runtime/plugin.mjs.map    28.71 kB │ gzip: 7.20 kB
packages/plugins/webhook-notifier build: ℹ ../../../../../../../../tmp/emdash-build-wQqZGm/runtime/plugin.d.mts.map   0.30 kB │ gzip: 0.21 kB
packages/plugins/webhook-notifier build: ℹ ../../../../../../../../tmp/emdash-build-wQqZGm/runtime/plugin.d.mts       2.94 kB │ gzip: 0.70 kB
packages/plugins/webhook-notifier build: ℹ 4 files, total: 41.20 kB
packages/plugins/webhook-notifier build: ✔ Build complete in 1586ms
packages/plugins/webhook-notifier build: ✔ Built plugin.mjs
packages/plugins/webhook-notifier build: ◐ Probing plugin surface...
packages/plugins/webhook-notifier build: ℹ entry: src/plugin.ts
packages/plugins/webhook-notifier build: ℹ tsconfig: tsconfig.json
packages/plugins/webhook-notifier build: ℹ Build start
packages/plugins/webhook-notifier build: ℹ ../../../../../../../../tmp/emdash-build-wQqZGm/plugin-probe/plugin.mjs  14.88 kB │ gzip: 3.94 kB
packages/plugins/webhook-notifier build: ℹ 1 files, total: 14.88 kB
packages/plugins/webhook-notifier build: ✔ Build complete in 8ms
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
packages/workerd build: ℹ dist/sandbox/index.mjs               0.24 kB │ gzip:  0.15 kB
packages/workerd build: ℹ dist/index.mjs                       0.18 kB │ gzip:  0.13 kB
packages/workerd build: ℹ dist/runner-DPvq5mbQ.mjs            83.97 kB │ gzip: 21.86 kB
packages/workerd build: ℹ dist/sandbox/index.d.mts             0.25 kB │ gzip:  0.15 kB
packages/workerd build: ℹ dist/index.d.mts                     0.18 kB │ gzip:  0.14 kB
packages/workerd build: ℹ dist/bridge-handler-O1ayzB49.d.mts  11.52 kB │ gzip:  3.97 kB
packages/workerd build: ℹ 6 files, total: 96.34 kB
packages/workerd build: ✔ Build complete in 1847ms
packages/workerd build: Done
$ node scripts/relink-bins-if-needed.mjs
$ pnpm typecheck
==> pnpm-typecheck
$ pnpm run --filter {./packages/**} typecheck
Scope: 34 of 63 workspace projects
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
.../plugins/awcms-micro-email-mailketing typecheck$ tsc --noEmit -p tsconfig.json
packages/cloudflare typecheck: Done
packages/plugins/awcms-micro-gallery typecheck$ tsc --noEmit -p tsconfig.json
packages/plugins/ai-moderation typecheck: Done
packages/plugins/awcms-micro-sikesra typecheck$ tsc --noEmit -p tsconfig.json
packages/plugins/awcms-micro-gallery typecheck: Done
.../plugins/awcms-micro-website-social typecheck$ tsc --noEmit -p tsconfig.json
packages/plugins/awcms-micro-docs typecheck: Done
packages/plugins/color typecheck$ tsgo --noEmit
packages/plugins/color typecheck: Done
packages/plugins/embeds typecheck$ tsgo --noEmit
packages/plugins/embeds typecheck: Done
packages/plugins/field-kit typecheck$ tsgo --noEmit
.../plugins/awcms-micro-email-mailketing typecheck: Done
packages/plugins/forms typecheck$ tsgo --noEmit
packages/plugins/field-kit typecheck: Done
packages/plugins/marketplace-test typecheck$ tsgo --noEmit
packages/plugins/marketplace-test typecheck: Done
packages/plugins/sandboxed-test typecheck$ tsgo --noEmit
packages/plugins/forms typecheck: Done
packages/plugins/webhook-notifier typecheck$ tsgo --noEmit
packages/plugins/sandboxed-test typecheck: Done
packages/workerd typecheck$ tsgo --noEmit
packages/plugins/webhook-notifier typecheck: Done
packages/workerd typecheck: Done
.../plugins/awcms-micro-website-social typecheck: Done
packages/plugins/awcms-micro-sikesra typecheck: Done
$ pnpm lint:quick
==> pnpm-lint-quick
$ oxlint -f json
{ "diagnostics": [{"message": "Function 'inferVerifierLevel' is declared but never used.","code": "eslint(no-unused-vars)","severity": "warning","causes": [],"url": "https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unused-vars.html","help": "Consider removing this declaration.","filename": "packages/plugins/awcms-micro-sikesra/src/runtime.ts","labels": [{"label": "'inferVerifierLevel' is declared here","span": {"offset": 59262,"length": 18,"line": 2015,"column": 10}}],"related": []},
{"message": "Each then() should return a value or throw","code": "promise(always-return)","severity": "warning","causes": [],"url": "https://oxc.rs/docs/guide/usage/linter/rules/promise/always-return.html","filename": "packages/plugins/awcms-micro-email-mailketing/src/admin.tsx","labels": [{"span": {"offset": 16392,"length": 256,"line": 457,"column": 10}}],"related": []},
{"message": "Each then() should return a value or throw","code": "promise(always-return)","severity": "warning","causes": [],"url": "https://oxc.rs/docs/guide/usage/linter/rules/promise/always-return.html","filename": "packages/plugins/awcms-micro-email-mailketing/src/admin.tsx","labels": [{"span": {"offset": 23110,"length": 79,"line": 656,"column": 10}}],"related": []}],
              "number_of_files": 2073,
              "number_of_rules": 138,
              "threads_count": 20,
              "start_time": 2.093916827
            }
            $ pnpm --filter @awcms-micro/plugin-sikesra awcms:sikesra:validate-after-emdash-sync
==> pnpm-sikesra-sync-guardrails
$ pnpm awcms:sikesra:check-boundary && pnpm awcms:sikesra:check-d1-prefix && pnpm awcms:sikesra:check-data-boundary && pnpm awcms:sikesra:check-destructive-migrations && pnpm awcms:sikesra:check-user-references && pnpm awcms:sikesra:check-file-links && pnpm awcms:sikesra:check-seeds && pnpm awcms:sikesra:check-routes && pnpm awcms:sikesra:check-admin-pages && pnpm typecheck && pnpm test && pnpm build
$ node scripts/check-boundary.mjs
SIKESRA boundary check passed: no upstream EmDash core/admin references found.
$ vitest run tests/migration-prefix.test.ts

 RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-sikesra


 Test Files  1 passed (1)
      Tests  13 passed (13)
   Start at  21:19:55
   Duration  1.30s (transform 264ms, setup 0ms, import 1.19s, tests 18ms, environment 0ms)

$ node scripts/check-data-boundary.mjs
SIKESRA data-boundary guard passed.
$ node scripts/check-destructive-migrations.mjs
SIKESRA destructive migration guard passed.
$ node scripts/check-user-references.mjs
SIKESRA user-reference guard passed.
$ node scripts/check-file-links.mjs
SIKESRA file-link guard passed.
$ node scripts/check-seeds.mjs
SIKESRA seed guard passed.
$ vitest run tests/plugin.test.ts -t 'registers required SIKESRA plugin routes|uses GET for SIKESRA admin read APIs'

 RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-sikesra


 Test Files  1 passed (1)
      Tests  2 passed | 143 skipped (145)
   Start at  21:19:59
   Duration  2.60s (transform 1.30s, setup 0ms, import 2.49s, tests 10ms, environment 0ms)

$ vitest run tests/plugin.test.ts -t 'declares admin pages'

 RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-sikesra


 Test Files  1 passed (1)
      Tests  1 passed | 144 skipped (145)
   Start at  21:20:02
   Duration  2.55s (transform 1.25s, setup 0ms, import 2.44s, tests 4ms, environment 0ms)

$ tsc --noEmit -p tsconfig.json
$ vitest run

 RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-sikesra


 Test Files  7 passed (7)
      Tests  206 passed (206)
   Start at  21:20:10
   Duration  2.58s (transform 2.85s, setup 0ms, import 5.83s, tests 407ms, environment 1ms)

$ tsdown
ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/tsdown.config.ts
ℹ entry: src/index.ts, src/admin.tsx, src/navigation.ts, src/sandbox.ts
ℹ target: es2023
ℹ tsconfig: tsconfig.json
ℹ Build start
ℹ Cleaning 11 files
ℹ dist/admin.js                           360.78 kB │ gzip: 54.33 kB
ℹ dist/index.js                             2.79 kB │ gzip:  0.99 kB
ℹ dist/navigation.js                        0.78 kB │ gzip:  0.32 kB
ℹ dist/sandbox.js                           0.30 kB │ gzip:  0.21 kB
ℹ dist/runtime-5dclkDQF.js                381.89 kB │ gzip: 77.95 kB
ℹ dist/field-standards-DPRMDU-F.js         30.46 kB │ gzip:  5.13 kB
ℹ dist/AwcmsPluginHeaderMenu-V7ITPBZD.js   13.98 kB │ gzip:  3.29 kB
ℹ dist/index.d.ts                           7.29 kB │ gzip:  1.91 kB
ℹ dist/navigation.d.ts                      6.04 kB │ gzip:  1.38 kB
ℹ dist/admin.d.ts                           3.20 kB │ gzip:  1.04 kB
ℹ dist/sandbox.d.ts                         2.23 kB │ gzip:  0.50 kB
ℹ 11 files, total: 809.74 kB
✔ Build complete in 2590ms
$ pnpm --filter @emdash-cms/admin exec node --run locale:compile
==> pnpm-admin-locale-compile
Compiling message catalogs…
Done in 531ms
$ pnpm --filter @emdash-cms/admin exec playwright install chromium
==> playwright-install-chromium
BEWARE: your OS is not officially supported by Playwright; downloading fallback build for ubuntu24.04-x64.
BEWARE: your OS is not officially supported by Playwright; downloading fallback build for ubuntu24.04-x64.
BEWARE: your OS is not officially supported by Playwright; downloading fallback build for ubuntu24.04-x64.
$ pnpm test
==> pnpm-test
$ pnpm run --filter {./packages/*} test
Scope: 17 of 63 workspace projects
packages/atproto-test-utils test$ vitest run
packages/auth test$ vitest
packages/blocks test$ vitest
packages/contentful-to-portable-text test$ vitest
packages/blocks test: 9:20:18 PM [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
packages/blocks test: `optimizeDeps.rollupOptions` / `ssr.optimizeDeps.rollupOptions` is deprecated. Use `optimizeDeps.rolldownOptions` instead. Note that this option may be set by a plugin. Set VITE_DEPRECATION_TRACE=1 to see where it is called.
packages/atproto-test-utils test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/atproto-test-utils
packages/blocks test: Both esbuild and oxc options were set. oxc options will be used and esbuild options will be ignored. The following esbuild options were set: `{ jsx: 'automatic', jsxImportSource: undefined }`
packages/auth test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/auth
packages/blocks test: [vite:react-babel] We recommend switching to `@vitejs/plugin-react-oxc` for improved performance. More information at https://vite.dev/rolldown
packages/blocks test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/blocks
packages/contentful-to-portable-text test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/contentful-to-portable-text
packages/contentful-to-portable-text test:  Test Files  2 passed (2)
packages/contentful-to-portable-text test:       Tests  60 passed (60)
packages/contentful-to-portable-text test:    Start at  21:20:18
packages/contentful-to-portable-text test:    Duration  278ms (transform 188ms, setup 0ms, import 276ms, tests 36ms, environment 0ms)
packages/contentful-to-portable-text test: Done
packages/create-emdash test$ vitest run
packages/auth test:  Test Files  5 passed (5)
packages/auth test:       Tests  57 passed (57)
packages/auth test:    Start at  21:20:18
packages/auth test:    Duration  476ms (transform 268ms, setup 0ms, import 531ms, tests 495ms, environment 0ms)
packages/auth test: Done
packages/gutenberg-to-portable-text test$ vitest
packages/create-emdash test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/create-emdash
packages/atproto-test-utils test:  Test Files  1 passed (1)
packages/atproto-test-utils test:       Tests  17 passed (17)
packages/atproto-test-utils test:    Start at  21:20:18
packages/atproto-test-utils test:    Duration  605ms (transform 95ms, setup 0ms, import 286ms, tests 174ms, environment 0ms)
packages/atproto-test-utils test: Done
packages/marketplace test$ vitest
packages/create-emdash test:  Test Files  2 passed (2)
packages/create-emdash test:       Tests  103 passed (103)
packages/create-emdash test:    Start at  21:20:19
packages/create-emdash test:    Duration  217ms (transform 76ms, setup 0ms, import 113ms, tests 39ms, environment 0ms)
packages/create-emdash test: Done
packages/plugin-types test$ vitest run
packages/gutenberg-to-portable-text test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/gutenberg-to-portable-text
packages/marketplace test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/marketplace
packages/blocks test:  Test Files  3 passed (3)
packages/blocks test:       Tests  97 passed (97)
packages/blocks test:    Start at  21:20:18
packages/blocks test:    Duration  1.01s (transform 388ms, setup 0ms, import 817ms, tests 274ms, environment 1.18s)
packages/plugin-types test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugin-types
packages/blocks test: Done
packages/registry-lexicons test$ vitest run
packages/marketplace test:  Test Files  4 passed (4)
packages/marketplace test:       Tests  43 passed (43)
packages/marketplace test:    Start at  21:20:19
packages/marketplace test:    Duration  202ms (transform 82ms, setup 0ms, import 182ms, tests 40ms, environment 0ms)
packages/gutenberg-to-portable-text test:  Test Files  2 passed (2)
packages/gutenberg-to-portable-text test:       Tests  140 passed (140)
packages/gutenberg-to-portable-text test:    Start at  21:20:19
packages/gutenberg-to-portable-text test:    Duration  313ms (transform 220ms, setup 0ms, import 305ms, tests 68ms, environment 0ms)
packages/gutenberg-to-portable-text test: Done
packages/x402 test$ vitest
packages/marketplace test: Done
packages/plugin-types test:  Test Files  2 passed (2)
packages/plugin-types test:       Tests  27 passed (27)
packages/plugin-types test:    Start at  21:20:19
packages/plugin-types test:    Duration  147ms (transform 62ms, setup 0ms, import 83ms, tests 10ms, environment 0ms)
packages/plugin-types test: Done
packages/registry-lexicons test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-lexicons
packages/x402 test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/x402
packages/registry-lexicons test:  Test Files  1 passed (1)
packages/registry-lexicons test:       Tests  10 passed (10)
packages/registry-lexicons test:    Start at  21:20:20
packages/registry-lexicons test:    Duration  204ms (transform 69ms, setup 0ms, import 108ms, tests 8ms, environment 0ms)
packages/registry-lexicons test: Done
packages/x402 test:  Test Files  1 passed (1)
packages/x402 test:       Tests  17 passed (17)
packages/x402 test:    Start at  21:20:20
packages/x402 test:    Duration  215ms (transform 59ms, setup 0ms, import 68ms, tests 45ms, environment 0ms)
packages/x402 test: Done
packages/registry-client test$ vitest run
packages/registry-client test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-client
packages/registry-client test:  Test Files  4 passed (4)
packages/registry-client test:       Tests  70 passed (70)
packages/registry-client test:    Start at  21:20:20
packages/registry-client test:    Duration  262ms (transform 263ms, setup 0ms, import 408ms, tests 92ms, environment 0ms)
packages/registry-client test: Done
packages/admin test$ vitest
packages/plugin-cli test$ vitest run
packages/plugin-cli test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugin-cli
packages/admin test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin
packages/admin test: Loaded  vitest@4.1.5  and  @vitest/browser@4.1.7 .
packages/admin test: Running mixed versions is not supported and may lead into bugs
packages/admin test: Update your dependencies and make sure the versions match.
packages/admin test: 9:20:21 PM [vite] (client) Re-optimizing dependencies because lockfile has changed
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/components/RevisionHistory.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/editor/bubble-menu.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/editor/toolbar.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/editor/slash-menu.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/components/users/UserDetail.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/plugin-cli test:  Test Files  20 passed (20)
packages/plugin-cli test:       Tests  391 passed (391)
packages/plugin-cli test:    Start at  21:20:21
packages/plugin-cli test:    Duration  10.47s (transform 4.10s, setup 0ms, import 7.62s, tests 10.49s, environment 2ms)
packages/plugin-cli test: Done
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/components/settings/AllowedDomainsSettings.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/editor/block-menu.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/components/users/InviteUserModal.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/lib/hooks.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  Test Files  80 passed (80)
packages/admin test:       Tests  997 passed (997)
packages/admin test:    Start at  21:20:21
packages/admin test:    Duration  23.77s (transform 0ms, setup 7.55s, import 135.12s, tests 65.59s, environment 0ms)
packages/admin test: Done
packages/auth-atproto test$ vitest run
packages/core test$ vitest
packages/core test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/core
packages/auth-atproto test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/auth-atproto
packages/auth-atproto test:  Test Files  3 passed (3)
packages/auth-atproto test:       Tests  27 passed (27)
packages/auth-atproto test:    Start at  21:20:45
packages/auth-atproto test:    Duration  343ms (transform 370ms, setup 0ms, import 470ms, tests 121ms, environment 0ms)
packages/auth-atproto test: Done
packages/core test:  Test Files  257 passed (257)
packages/core test:       Tests  3842 passed (3842)
packages/core test:    Start at  21:20:45
packages/core test:    Duration  17.95s (transform 28.81s, setup 0ms, import 125.32s, tests 164.69s, environment 36ms)
packages/core test: Done
packages/cloudflare test$ vitest run
packages/workerd test$ vitest run
packages/cloudflare test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/cloudflare
packages/workerd test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/workerd
packages/cloudflare test:  Test Files  9 passed (9)
packages/cloudflare test:       Tests  163 passed (163)
packages/cloudflare test:    Start at  21:21:03
packages/cloudflare test:    Duration  415ms (transform 690ms, setup 0ms, import 1.31s, tests 153ms, environment 1ms)
packages/cloudflare test: Done
packages/workerd test:  Test Files  11 passed (11)
packages/workerd test:       Tests  73 passed (73)
packages/workerd test:    Start at  21:21:03
packages/workerd test:    Duration  9.42s (transform 6.60s, setup 0ms, import 12.12s, tests 8.84s, environment 1ms)
packages/workerd test: Done
```
