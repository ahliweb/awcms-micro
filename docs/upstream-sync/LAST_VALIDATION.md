# Last Validation

## Validation Run Metadata

- Date:
  - Started: 2026-07-03T09:03:02Z
  - Completed: 2026-07-03T09:05:39Z
- Operator: unggul
- Branch: `main`
- Upstream commit SHA: `932f4ba3adef8be21abc39b4cc7612609895e88c`
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
Scope: all 66 workspace projects
[WARN] There are cyclic workspace dependencies: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/auth-atproto, /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/core
Lockfile is up to date, resolution step is skipped
Progress: resolved 1, reused 0, downloaded 0, added 0
Packages: +1660
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Progress: resolved 1660, reused 1644, downloaded 0, added 1660, done

devDependencies:
+ @axe-core/playwright 4.12.1
+ @changesets/changelog-github 0.7.0
+ @changesets/cli 2.31.0
+ @e18e/eslint-plugin 0.5.1
+ @lunariajs/core 0.1.1
+ @playwright/test 1.61.1
+ @types/node 24.10.13
+ @typescript/native-preview 7.0.0-dev.20260421.2
+ emdash 0.27.0 <- packages/core
+ knip 5.84.1
+ oxfmt 0.56.0
+ oxlint 1.71.0
+ oxlint-tsgolint 0.23.0
+ pkg-pr-new 0.0.75
+ prettier 3.9.1
+ prettier-plugin-astro 0.14.1
+ typescript 6.0.0-beta

packages/plugins/awcms-micro-docs prepare$ node --run build
.../plugins/awcms-micro-email-mailketing prepare$ node --run build
packages/plugins/awcms-micro-gallery prepare$ node --run build
packages/plugins/awcms-micro-sikesra prepare$ node --run build
.../plugins/awcms-micro-website-social prepare$ node --run build
packages/plugins/awcms-micro-docs prepare: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
.../plugins/awcms-micro-email-mailketing prepare: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/plugins/awcms-micro-sikesra prepare: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
.../plugins/awcms-micro-website-social prepare: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/plugins/awcms-micro-gallery prepare: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
.../plugins/awcms-micro-website-social prepare: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-website-social/tsdown.config.ts
.../plugins/awcms-micro-email-mailketing prepare: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-email-mailketing/tsdown.config.ts
packages/plugins/awcms-micro-docs prepare: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-docs/tsdown.config.ts
.../plugins/awcms-micro-email-mailketing prepare: ℹ entry: src/index.ts, src/admin.tsx, src/sandbox.ts
.../plugins/awcms-micro-email-mailketing prepare: ℹ target: es2023
.../plugins/awcms-micro-email-mailketing prepare: ℹ tsconfig: tsconfig.json
.../plugins/awcms-micro-website-social prepare: ℹ entry: src/index.ts, src/admin.tsx
.../plugins/awcms-micro-website-social prepare: ℹ target: es2023
.../plugins/awcms-micro-website-social prepare: ℹ tsconfig: tsconfig.json
.../plugins/awcms-micro-website-social prepare: ℹ Build start
.../plugins/awcms-micro-email-mailketing prepare: ℹ Build start
packages/plugins/awcms-micro-docs prepare: ℹ entry: src/index.ts, src/admin.tsx
packages/plugins/awcms-micro-docs prepare: ℹ target: es2023
packages/plugins/awcms-micro-docs prepare: ℹ tsconfig: tsconfig.json
packages/plugins/awcms-micro-docs prepare: ℹ Build start
.../plugins/awcms-micro-email-mailketing prepare: ℹ Cleaning 8 files
.../plugins/awcms-micro-website-social prepare: ℹ Cleaning 8 files
packages/plugins/awcms-micro-docs prepare: ℹ Cleaning 10 files
packages/plugins/awcms-micro-sikesra prepare: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/tsdown.config.ts
packages/plugins/awcms-micro-sikesra prepare: ℹ entry: src/index.ts, src/admin.tsx, src/navigation.ts, src/sandbox.ts
packages/plugins/awcms-micro-sikesra prepare: ℹ target: es2023
packages/plugins/awcms-micro-sikesra prepare: ℹ tsconfig: tsconfig.json
packages/plugins/awcms-micro-sikesra prepare: ℹ Build start
packages/plugins/awcms-micro-gallery prepare: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-gallery/tsdown.config.ts
packages/plugins/awcms-micro-gallery prepare: ℹ entry: src/index.ts, src/sandbox.ts
packages/plugins/awcms-micro-gallery prepare: ℹ target: es2023
packages/plugins/awcms-micro-gallery prepare: ℹ tsconfig: tsconfig.json
packages/plugins/awcms-micro-gallery prepare: ℹ Build start
packages/plugins/awcms-micro-sikesra prepare: ℹ Cleaning 11 files
packages/plugins/awcms-micro-gallery prepare: ℹ Cleaning 10 files
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
packages/plugins/awcms-micro-gallery prepare: ✔ Build complete in 2480ms
packages/plugins/awcms-micro-gallery prepare: Done
packages/plugins/awcms-micro-docs prepare: ℹ dist/admin.js                  5.05 kB │ gzip: 1.02 kB
packages/plugins/awcms-micro-docs prepare: ℹ dist/index.js                  0.97 kB │ gzip: 0.45 kB
packages/plugins/awcms-micro-docs prepare: ℹ dist/content-s6AnXlIg.js.map  12.78 kB │ gzip: 3.61 kB
packages/plugins/awcms-micro-docs prepare: ℹ dist/content-s6AnXlIg.js       9.25 kB │ gzip: 3.05 kB
packages/plugins/awcms-micro-docs prepare: ℹ dist/admin.js.map              5.82 kB │ gzip: 1.54 kB
packages/plugins/awcms-micro-docs prepare: ℹ dist/index.js.map              1.51 kB │ gzip: 0.63 kB
packages/plugins/awcms-micro-docs prepare: ℹ dist/index.d.ts.map            0.58 kB │ gzip: 0.27 kB
packages/plugins/awcms-micro-docs prepare: ℹ dist/admin.d.ts.map            0.11 kB │ gzip: 0.12 kB
packages/plugins/awcms-micro-docs prepare: ℹ dist/index.d.ts                1.30 kB │ gzip: 0.51 kB
packages/plugins/awcms-micro-docs prepare: ℹ dist/admin.d.ts                0.19 kB │ gzip: 0.15 kB
packages/plugins/awcms-micro-docs prepare: ℹ 10 files, total: 37.57 kB
packages/plugins/awcms-micro-docs prepare: ✔ Build complete in 3633ms
packages/plugins/awcms-micro-docs prepare: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugin `rolldown-plugin-dts:generate`. See https://rolldown.rs/options/checks#plugintimings for more details.
packages/plugins/awcms-micro-docs prepare: Done
.../plugins/awcms-micro-email-mailketing prepare: ℹ dist/admin.js              54.09 kB │ gzip: 7.63 kB
.../plugins/awcms-micro-email-mailketing prepare: ℹ dist/index.js               1.78 kB │ gzip: 0.61 kB
.../plugins/awcms-micro-email-mailketing prepare: ℹ dist/sandbox.js             0.26 kB │ gzip: 0.18 kB
.../plugins/awcms-micro-email-mailketing prepare: ℹ dist/runtime-reZKFWrt.js   35.19 kB │ gzip: 7.26 kB
.../plugins/awcms-micro-email-mailketing prepare: ℹ dist/messages-BWIQRjzR.js  13.93 kB │ gzip: 3.06 kB
.../plugins/awcms-micro-email-mailketing prepare: ℹ dist/index.d.ts             0.71 kB │ gzip: 0.32 kB
.../plugins/awcms-micro-email-mailketing prepare: ℹ dist/sandbox.d.ts           0.44 kB │ gzip: 0.27 kB
.../plugins/awcms-micro-email-mailketing prepare: ℹ dist/admin.d.ts             0.21 kB │ gzip: 0.15 kB
.../plugins/awcms-micro-email-mailketing prepare: ℹ 8 files, total: 106.61 kB
.../plugins/awcms-micro-email-mailketing prepare: ✔ Build complete in 3894ms
.../plugins/awcms-micro-email-mailketing prepare: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugin `rolldown-plugin-dts:generate`. See https://rolldown.rs/options/checks#plugintimings for more details.
.../plugins/awcms-micro-email-mailketing prepare: Done
.../plugins/awcms-micro-website-social prepare: ℹ dist/admin.js        5.02 kB │ gzip: 1.83 kB
.../plugins/awcms-micro-website-social prepare: ℹ dist/index.js        1.17 kB │ gzip: 0.47 kB
.../plugins/awcms-micro-website-social prepare: ℹ dist/admin.js.map    6.88 kB │ gzip: 2.51 kB
.../plugins/awcms-micro-website-social prepare: ℹ dist/index.js.map    1.66 kB │ gzip: 0.67 kB
.../plugins/awcms-micro-website-social prepare: ℹ dist/index.d.ts.map  0.20 kB │ gzip: 0.16 kB
.../plugins/awcms-micro-website-social prepare: ℹ dist/admin.d.ts.map  0.11 kB │ gzip: 0.12 kB
.../plugins/awcms-micro-website-social prepare: ℹ dist/index.d.ts      0.70 kB │ gzip: 0.33 kB
.../plugins/awcms-micro-website-social prepare: ℹ dist/admin.d.ts      0.19 kB │ gzip: 0.15 kB
.../plugins/awcms-micro-website-social prepare: ℹ 8 files, total: 15.93 kB
.../plugins/awcms-micro-website-social prepare: ✔ Build complete in 4377ms
.../plugins/awcms-micro-website-social prepare: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugin `rolldown-plugin-dts:generate`. See https://rolldown.rs/options/checks#plugintimings for more details.
.../plugins/awcms-micro-website-social prepare: Done
packages/plugins/awcms-micro-sikesra prepare: ℹ dist/admin.js                           364.00 kB │ gzip: 54.79 kB
packages/plugins/awcms-micro-sikesra prepare: ℹ dist/index.js                             2.79 kB │ gzip:  0.99 kB
packages/plugins/awcms-micro-sikesra prepare: ℹ dist/navigation.js                        0.78 kB │ gzip:  0.32 kB
packages/plugins/awcms-micro-sikesra prepare: ℹ dist/sandbox.js                           0.30 kB │ gzip:  0.22 kB
packages/plugins/awcms-micro-sikesra prepare: ℹ dist/runtime-NtGB6YT_.js                382.84 kB │ gzip: 78.18 kB
packages/plugins/awcms-micro-sikesra prepare: ℹ dist/field-standards-DPRMDU-F.js         30.46 kB │ gzip:  5.13 kB
packages/plugins/awcms-micro-sikesra prepare: ℹ dist/AwcmsPluginHeaderMenu-V7ITPBZD.js   13.98 kB │ gzip:  3.29 kB
packages/plugins/awcms-micro-sikesra prepare: ℹ dist/index.d.ts                           7.29 kB │ gzip:  1.91 kB
packages/plugins/awcms-micro-sikesra prepare: ℹ dist/navigation.d.ts                      6.04 kB │ gzip:  1.38 kB
packages/plugins/awcms-micro-sikesra prepare: ℹ dist/admin.d.ts                           3.20 kB │ gzip:  1.04 kB
packages/plugins/awcms-micro-sikesra prepare: ℹ dist/sandbox.d.ts                         2.51 kB │ gzip:  0.53 kB
packages/plugins/awcms-micro-sikesra prepare: ℹ 11 files, total: 814.19 kB
packages/plugins/awcms-micro-sikesra prepare: ✔ Build complete in 5828ms
packages/plugins/awcms-micro-sikesra prepare: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugins. Here is a breakdown:
packages/plugins/awcms-micro-sikesra prepare:   - rolldown-plugin-dts:generate (75%)
packages/plugins/awcms-micro-sikesra prepare:   - rolldown-plugin-dts:resolver (21%)
packages/plugins/awcms-micro-sikesra prepare: See https://rolldown.rs/options/checks#plugintimings for more details.
packages/plugins/awcms-micro-sikesra prepare: Done
Done in 16.2s using pnpm v11.5.1
$ pnpm --filter emdash build
==> pnpm-build-emdash
$ tsdown
ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/core/tsdown.config.ts
ℹ entry: src/index.ts, src/request-context.ts, src/astro/index.ts, src/astro/middleware.ts, src/astro/middleware/setup.ts, src/astro/middleware/auth.ts, src/astro/middleware/redirect.ts, src/astro/middleware/request-context.ts, src/astro/types.ts, src/db/index.ts, src/db/sqlite.ts, src/db/libsql.ts, src/db/postgres.ts, src/database/instrumentation.ts, src/storage/local.ts, src/storage/s3.ts, src/object-cache/memory.ts, src/media/index.ts, src/media/local-runtime.ts, src/media/image-endpoint.ts, src/astro/image-endpoint.ts, src/runtime.ts, src/seed/index.ts, src/cli/index.ts, src/client/index.ts, src/client/cf-access.ts, src/seo/index.ts, src/page/index.ts, src/plugin-utils.ts, src/plugin-types.ts, src/plugins/adapt-sandbox-entry.ts, src/api/route-utils.ts, src/api/schemas/index.ts, src/auth/providers/github.ts, src/auth/providers/google.ts
ℹ tsconfig: tsconfig.json
ℹ Build start
ℹ Cleaning 1159 files
ℹ Granting execute permission to dist/cli/index.mjs
ℹ dist/cli/index.mjs                                                            147.54 kB │ gzip: 37.41 kB
ℹ dist/astro/middleware.mjs                                                     117.50 kB │ gzip: 31.92 kB
ℹ dist/astro/routes/api/openapi.json.mjs                                         90.97 kB │ gzip: 14.48 kB
ℹ dist/astro/routes/api/mcp.mjs                                                  76.69 kB │ gzip: 16.62 kB
ℹ dist/astro/index.mjs                                                           76.48 kB │ gzip: 18.44 kB
ℹ dist/astro/middleware/request-context.mjs                                      41.39 kB │ gzip: 10.38 kB
ℹ dist/astro/routes/api/import/wordpress/execute.mjs                             26.61 kB │ gzip:  8.25 kB
ℹ dist/astro/middleware/auth.mjs                                                 21.94 kB │ gzip:  6.06 kB
ℹ dist/page/index.mjs                                                            13.84 kB │ gzip:  4.09 kB
ℹ dist/client/index.mjs                                                          13.07 kB │ gzip:  3.55 kB
ℹ dist/astro/routes/api/admin/plugins/registry/artifact.mjs                      12.85 kB │ gzip:  4.60 kB
ℹ dist/astro/routes/api/oauth/authorize.mjs                                      11.85 kB │ gzip:  3.50 kB
ℹ dist/astro/routes/api/import/wordpress/analyze.mjs                              9.96 kB │ gzip:  3.36 kB
ℹ dist/astro/routes/api/snapshot.mjs                                              9.42 kB │ gzip:  3.62 kB
ℹ dist/index.mjs                                                                  9.40 kB │ gzip:  2.81 kB
ℹ dist/api/schemas/index.mjs                                                      8.51 kB │ gzip:  2.00 kB
ℹ dist/astro/routes/api/comments/_collection_/_contentId_/index.mjs               8.47 kB │ gzip:  2.62 kB
ℹ dist/astro/routes/api/import/wordpress-plugin/execute.mjs                       8.37 kB │ gzip:  2.81 kB
ℹ dist/storage/s3.mjs                                                             7.78 kB │ gzip:  2.79 kB
ℹ dist/astro/routes/api/import/wordpress/media.mjs                                6.89 kB │ gzip:  2.22 kB
ℹ dist/astro/routes/api/comments/_collection_/_contentId_/reactions.mjs           6.25 kB │ gzip:  2.01 kB
ℹ dist/plugins/adapt-sandbox-entry.mjs                                            6.05 kB │ gzip:  2.25 kB
ℹ dist/media/image-endpoint.mjs                                                   5.81 kB │ gzip:  2.62 kB
ℹ dist/astro/routes/api/media.mjs                                                 5.78 kB │ gzip:  2.14 kB
ℹ dist/astro/routes/api/auth/oauth/_provider_/callback.mjs                        5.73 kB │ gzip:  2.02 kB
ℹ dist/client/cf-access.mjs                                                       5.69 kB │ gzip:  2.17 kB
ℹ dist/astro/routes/api/import/wordpress/rewrite-urls.mjs                         5.60 kB │ gzip:  1.83 kB
ℹ dist/storage/local.mjs                                                          5.56 kB │ gzip:  2.04 kB
ℹ dist/astro/routes/sitemap-_collection_.xml.mjs                                  5.49 kB │ gzip:  1.99 kB
ℹ dist/astro/routes/api/setup/dev-bypass.mjs                                      5.42 kB │ gzip:  2.11 kB
ℹ dist/astro/routes/api/content/_collection_/_id_.mjs                             5.23 kB │ gzip:  1.48 kB
ℹ dist/astro/routes/api/oauth/token.mjs                                           4.98 kB │ gzip:  1.68 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs            4.71 kB │ gzip:  1.51 kB
ℹ dist/astro/routes/api/import/wordpress/rewrite-url-helpers.mjs                  4.64 kB │ gzip:  1.71 kB
ℹ dist/astro/routes/api/admin/plugins/registry/install.mjs                        4.61 kB │ gzip:  1.78 kB
ℹ dist/media/local-runtime.mjs                                                    4.51 kB │ gzip:  1.32 kB
ℹ dist/astro/routes/api/admin/plugins/registry/_id_/update.mjs                    4.49 kB │ gzip:  1.64 kB
ℹ dist/astro/routes/api/admin/users/_id_/index.mjs                                4.42 kB │ gzip:  1.47 kB
ℹ dist/astro/routes/api/oauth/register.mjs                                        4.42 kB │ gzip:  1.65 kB
ℹ dist/astro/routes/api/import/wordpress/prepare.mjs                              4.39 kB │ gzip:  1.63 kB
ℹ dist/astro/routes/api/media/_id_/confirm.mjs                                    4.34 kB │ gzip:  1.80 kB
ℹ dist/astro/routes/api/settings/email.mjs                                        4.32 kB │ gzip:  1.71 kB
ℹ dist/astro/routes/api/schema/collections/_slug_/index.mjs                       4.02 kB │ gzip:  1.21 kB
ℹ dist/astro/routes/api/setup/index.mjs                                           3.95 kB │ gzip:  1.48 kB
ℹ dist/astro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs          3.94 kB │ gzip:  1.10 kB
ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/install.mjs                3.80 kB │ gzip:  1.37 kB
ℹ dist/astro/routes/api/widget-areas/_name_/widgets/_id_.mjs                      3.75 kB │ gzip:  1.14 kB
ℹ dist/astro/routes/api/setup/admin-verify.mjs                                    3.73 kB │ gzip:  1.42 kB
ℹ dist/astro/routes/api/admin/comments/_id_/status.mjs                            3.64 kB │ gzip:  1.35 kB
ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_/translations.mjs           3.63 kB │ gzip:  1.17 kB
ℹ dist/astro/routes/api/media/upload-url.mjs                                      3.58 kB │ gzip:  1.48 kB
ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_.mjs                        3.57 kB │ gzip:  1.01 kB
ℹ dist/astro/routes/api/auth/passkey/register/verify.mjs                          3.57 kB │ gzip:  1.36 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/update.mjs                             3.50 kB │ gzip:  1.26 kB
ℹ dist/astro/routes/api/media/_id_.mjs                                            3.47 kB │ gzip:  1.05 kB
ℹ dist/astro/middleware/redirect.mjs                                              3.45 kB │ gzip:  1.38 kB
ℹ dist/astro/routes/api/schema/collections/_slug_/fields/index.mjs                3.41 kB │ gzip:  1.06 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/schedule.mjs                    3.39 kB │ gzip:  1.05 kB
ℹ dist/astro/routes/api/admin/plugins/updates.mjs                                 3.34 kB │ gzip:  1.19 kB
ℹ dist/database/instrumentation.mjs                                               3.34 kB │ gzip:  1.61 kB
ℹ dist/astro/routes/api/admin/plugins/registry/_id_/uninstall.mjs                 3.32 kB │ gzip:  1.16 kB
ℹ dist/astro/routes/api/admin/bylines/_id_/index.mjs                              3.31 kB │ gzip:  1.13 kB
ℹ dist/astro/routes/api/admin/bylines/index.mjs                                   3.31 kB │ gzip:  1.25 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/preview-url.mjs                 3.29 kB │ gzip:  1.35 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/enable.mjs                             3.21 kB │ gzip:  1.16 kB
ℹ dist/astro/routes/api/admin/themes/marketplace/index.mjs                        3.19 kB │ gzip:  1.18 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/uninstall.mjs                          3.19 kB │ gzip:  1.16 kB
ℹ dist/astro/routes/api/admin/bylines/_id_/translations.mjs                       3.19 kB │ gzip:  1.18 kB
ℹ dist/astro/routes/api/media/providers/_providerId_/index.mjs                    3.15 kB │ gzip:  1.14 kB
ℹ dist/astro/routes/api/setup/admin.mjs                                           3.12 kB │ gzip:  1.25 kB
ℹ dist/astro/routes/api/schema/collections/index.mjs                              3.11 kB │ gzip:  1.05 kB
ℹ dist/astro/routes/api/plugins/_pluginId_/_...path_.mjs                          3.09 kB │ gzip:  1.37 kB
ℹ dist/astro/routes/api/content/_collection_/index.mjs                            3.08 kB │ gzip:  1.15 kB
ℹ dist/astro/routes/api/schema/collections/_slug_/fields/reorder.mjs              3.05 kB │ gzip:  1.02 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/disable.mjs                            3.04 kB │ gzip:  1.10 kB
ℹ dist/astro/routes/api/admin/plugins/marketplace/index.mjs                       3.01 kB │ gzip:  1.09 kB
ℹ dist/astro/routes/api/auth/oauth/_provider_.mjs                                 3.00 kB │ gzip:  1.17 kB
ℹ dist/astro/routes/api/admin/oauth-clients/_id_.mjs                              3.00 kB │ gzip:  0.97 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/publish.mjs                     2.93 kB │ gzip:  1.19 kB
ℹ dist/astro/routes/api/admin/allowed-domains/_domain_.mjs                        2.90 kB │ gzip:  1.00 kB
ℹ dist/astro/routes/api/schema/orphans/_slug_.mjs                                 2.89 kB │ gzip:  1.07 kB
ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/index.mjs                  2.88 kB │ gzip:  1.01 kB
ℹ dist/astro/routes/api/admin/themes/marketplace/_id_/index.mjs                   2.87 kB │ gzip:  1.01 kB
ℹ dist/astro/routes/api/redirects/_id_.mjs                                        2.84 kB │ gzip:  0.85 kB
ℹ dist/astro/routes/api/auth/passkey/_id_.mjs                                     2.83 kB │ gzip:  1.00 kB
ℹ dist/astro/routes/api/auth/signup/complete.mjs                                  2.83 kB │ gzip:  1.17 kB
ℹ dist/astro/routes/api/admin/allowed-domains/index.mjs                           2.81 kB │ gzip:  1.07 kB
ℹ dist/astro/routes/api/auth/invite/complete.mjs                                  2.80 kB │ gzip:  1.15 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/index.mjs                              2.80 kB │ gzip:  1.02 kB
ℹ dist/astro/routes/api/menus/_name_/translations.mjs                             2.80 kB │ gzip:  0.98 kB
ℹ dist/astro/routes/api/import/wordpress-plugin/analyze.mjs                       2.76 kB │ gzip:  1.16 kB
ℹ dist/astro/routes/api/auth/dev-bypass.mjs                                       2.72 kB │ gzip:  1.26 kB
ℹ dist/astro/routes/api/taxonomies/_name_/terms/index.mjs                         2.67 kB │ gzip:  0.95 kB
ℹ dist/astro/routes/api/typegen.mjs                                               2.66 kB │ gzip:  1.06 kB
ℹ dist/astro/routes/api/auth/passkey/options.mjs                                  2.65 kB │ gzip:  1.09 kB
ℹ dist/plugin-utils.mjs                                                           2.63 kB │ gzip:  1.21 kB
ℹ dist/astro/routes/api/auth/passkey/register/options.mjs                         2.63 kB │ gzip:  1.07 kB
ℹ dist/astro/routes/api/widget-areas/index.mjs                                    2.62 kB │ gzip:  1.04 kB
ℹ dist/astro/routes/api/sections/_slug_.mjs                                       2.62 kB │ gzip:  0.80 kB
ℹ dist/astro/routes/api/schema/index.mjs                                          2.59 kB │ gzip:  1.15 kB
ℹ dist/astro/routes/api/admin/plugins/index.mjs                                   2.56 kB │ gzip:  0.97 kB
ℹ dist/astro/routes/api/menus/_name_.mjs                                          2.54 kB │ gzip:  0.80 kB
ℹ dist/astro/routes/api/redirects/404s/index.mjs                                  2.52 kB │ gzip:  0.82 kB
ℹ dist/astro/routes/api/auth/passkey/verify.mjs                                   2.51 kB │ gzip:  1.03 kB
ℹ dist/astro/routes/sitemap.xml.mjs                                               2.48 kB │ gzip:  1.13 kB
ℹ dist/astro/routes/api/schema/orphans/index.mjs                                  2.47 kB │ gzip:  0.90 kB
ℹ dist/astro/routes/api/auth/magic-link/send.mjs                                  2.45 kB │ gzip:  1.00 kB
ℹ dist/astro/routes/api/widget-areas/_name_/widgets.mjs                           2.45 kB │ gzip:  1.06 kB
ℹ dist/astro/routes/api/admin/byline-fields/_slug_.mjs                            2.41 kB │ gzip:  0.76 kB
ℹ dist/astro/routes/api/settings.mjs                                              2.40 kB │ gzip:  0.96 kB
ℹ dist/astro/routes/api/menus/_name_/items/_id_.mjs                               2.39 kB │ gzip:  0.82 kB
ℹ dist/astro/routes/api/setup/status.mjs                                          2.39 kB │ gzip:  1.03 kB
ℹ dist/astro/routes/api/auth/invite/index.mjs                                     2.36 kB │ gzip:  1.08 kB
ℹ dist/astro/routes/api/admin/hooks/exclusive/_hookName_.mjs                      2.36 kB │ gzip:  1.04 kB
ℹ dist/astro/routes/api/auth/invite/register-options.mjs                          2.36 kB │ gzip:  1.02 kB
ℹ dist/astro/routes/api/media/providers/_providerId_/_itemId_.mjs                 2.36 kB │ gzip:  0.78 kB
ℹ dist/astro/routes/api/taxonomies/index.mjs                                      2.36 kB │ gzip:  0.89 kB
ℹ dist/astro/routes/api/auth/signup/request.mjs                                   2.32 kB │ gzip:  1.00 kB
ℹ dist/seo/index.mjs                                                              2.25 kB │ gzip:  0.95 kB
ℹ dist/astro/routes/api/admin/oauth-clients/index.mjs                             2.20 kB │ gzip:  0.91 kB
ℹ dist/astro/routes/api/widget-areas/_name_.mjs                                   2.19 kB │ gzip:  0.81 kB
ℹ dist/astro/routes/api/themes/preview.mjs                                        2.19 kB │ gzip:  1.00 kB
ℹ dist/astro/routes/api/search/rebuild.mjs                                        2.19 kB │ gzip:  0.94 kB
ℹ dist/astro/routes/api/redirects/index.mjs                                       2.17 kB │ gzip:  0.80 kB
ℹ dist/astro/routes/api/admin/api-tokens/index.mjs                                2.13 kB │ gzip:  0.93 kB
ℹ dist/astro/image-endpoint.mjs                                                   2.06 kB │ gzip:  0.91 kB
ℹ dist/astro/routes/api/search/index.mjs                                          2.05 kB │ gzip:  0.97 kB
ℹ dist/astro/routes/api/admin/users/index.mjs                                     2.04 kB │ gzip:  0.96 kB
ℹ dist/astro/routes/api/admin/users/_id_/send-recovery.mjs                        2.03 kB │ gzip:  0.96 kB
ℹ dist/astro/routes/api/search/enable.mjs                                         2.02 kB │ gzip:  0.89 kB
ℹ dist/astro/routes/api/oauth/device/token.mjs                                    2.01 kB │ gzip:  0.94 kB
ℹ dist/astro/routes/api/sections/index.mjs                                        1.98 kB │ gzip:  0.75 kB
ℹ dist/astro/routes/api/widget-areas/_name_/reorder.mjs                           1.97 kB │ gzip:  0.89 kB
ℹ dist/astro/routes/api/manifest.mjs                                              1.97 kB │ gzip:  0.93 kB
ℹ dist/astro/routes/robots.txt.mjs                                                1.96 kB │ gzip:  0.87 kB
ℹ dist/astro/routes/api/admin/users/_id_/disable.mjs                              1.96 kB │ gzip:  0.90 kB
ℹ dist/astro/middleware/setup.mjs                                                 1.86 kB │ gzip:  0.86 kB
ℹ dist/api/route-utils.mjs                                                        1.86 kB │ gzip:  0.88 kB
ℹ dist/astro/routes/api/media/file/_...key_.mjs                                   1.84 kB │ gzip:  0.95 kB
ℹ dist/astro/routes/api/auth/me.mjs                                               1.82 kB │ gzip:  0.85 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/duplicate.mjs                   1.81 kB │ gzip:  0.77 kB
ℹ dist/astro/routes/api/oauth/device/code.mjs                                     1.80 kB │ gzip:  0.84 kB
ℹ dist/astro/routes/api/admin/comments/_id_.mjs                                   1.80 kB │ gzip:  0.69 kB
ℹ dist/astro/routes/api/menus/index.mjs                                           1.79 kB │ gzip:  0.73 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/discard-draft.mjs               1.78 kB │ gzip:  0.77 kB
ℹ dist/request-context.mjs                                                        1.77 kB │ gzip:  0.90 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/unpublish.mjs                   1.77 kB │ gzip:  0.76 kB
ℹ dist/astro/routes/api/admin/byline-fields/index.mjs                             1.77 kB │ gzip:  0.68 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/restore.mjs                     1.72 kB │ gzip:  0.74 kB
ℹ dist/astro/routes/api/search/suggest.mjs                                        1.72 kB │ gzip:  0.84 kB
ℹ dist/astro/routes/api/auth/magic-link/verify.mjs                                1.65 kB │ gzip:  0.71 kB
ℹ dist/astro/routes/api/revisions/_revisionId_/restore.mjs                        1.64 kB │ gzip:  0.70 kB
ℹ dist/astro/routes/api/admin/comments/index.mjs                                  1.62 kB │ gzip:  0.73 kB
ℹ dist/astro/routes/api/admin/comments/bulk.mjs                                   1.62 kB │ gzip:  0.71 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/translations.mjs                1.58 kB │ gzip:  0.77 kB
ℹ dist/astro/routes/api/menus/_name_/reorder.mjs                                  1.58 kB │ gzip:  0.72 kB
ℹ dist/astro/routes/api/menus/_name_/items.mjs                                    1.57 kB │ gzip:  0.72 kB
ℹ dist/astro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs               1.56 kB │ gzip:  0.76 kB
ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/icon.mjs                   1.54 kB │ gzip:  0.74 kB
ℹ dist/object-cache/memory.mjs                                                    1.52 kB │ gzip:  0.72 kB
ℹ dist/astro/routes/api/redirects/404s/summary.mjs                                1.50 kB │ gzip:  0.68 kB
ℹ dist/astro/routes/api/admin/hooks/exclusive/index.mjs                           1.45 kB │ gzip:  0.72 kB
ℹ dist/astro/routes/api/import/probe.mjs                                          1.42 kB │ gzip:  0.68 kB
ℹ dist/astro/routes/api/well-known/auth.mjs                                       1.37 kB │ gzip:  0.66 kB
ℹ dist/astro/routes/api/oauth/device/authorize.mjs                                1.34 kB │ gzip:  0.69 kB
ℹ dist/astro/routes/api/auth/signup/verify.mjs                                    1.32 kB │ gzip:  0.71 kB
ℹ dist/runtime.mjs                                                                1.32 kB │ gzip:  0.64 kB
ℹ dist/media/index.mjs                                                            1.29 kB │ gzip:  0.63 kB
ℹ dist/astro/routes/api/admin/byline-fields/reorder.mjs                           1.28 kB │ gzip:  0.57 kB
ℹ dist/astro/routes/api/auth/invite/accept.mjs                                    1.28 kB │ gzip:  0.68 kB
ℹ dist/astro/routes/api/admin/users/_id_/enable.mjs                               1.28 kB │ gzip:  0.67 kB
ℹ dist/astro/routes/api/admin/api-tokens/_id_.mjs                                 1.24 kB │ gzip:  0.66 kB
ℹ dist/db/index.mjs                                                               1.22 kB │ gzip:  0.56 kB
ℹ dist/astro/routes/api/content/_collection_/trash.mjs                            1.22 kB │ gzip:  0.59 kB
ℹ dist/astro/routes/api/oauth/token/refresh.mjs                                   1.19 kB │ gzip:  0.62 kB
ℹ dist/astro/routes/api/well-known/oauth-authorization-server.mjs                 1.18 kB │ gzip:  0.59 kB
ℹ dist/astro/routes/api/oauth/token/revoke.mjs                                    1.14 kB │ gzip:  0.60 kB
ℹ dist/astro/routes/api/dashboard.mjs                                             1.07 kB │ gzip:  0.56 kB
ℹ dist/astro/routes/api/auth/passkey/index.mjs                                    1.07 kB │ gzip:  0.60 kB
ℹ dist/astro/routes/api/admin/comments/counts.mjs                                 1.04 kB │ gzip:  0.53 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/revisions.mjs                   1.04 kB │ gzip:  0.56 kB
ℹ dist/astro/routes/api/search/stats.mjs                                          1.03 kB │ gzip:  0.56 kB
ℹ dist/seed/index.mjs                                                             1.03 kB │ gzip:  0.46 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/permanent.mjs                   1.02 kB │ gzip:  0.53 kB
ℹ dist/astro/routes/api/setup/dev-reset.mjs                                       1.01 kB │ gzip:  0.56 kB
ℹ dist/astro/routes/api/admin/byline-fields/_slug_/usage.mjs                      0.99 kB │ gzip:  0.51 kB
ℹ dist/astro/routes/api/import/wordpress-plugin/callback.mjs                      0.97 kB │ gzip:  0.53 kB
ℹ dist/astro/routes/api/auth/mode.mjs                                             0.94 kB │ gzip:  0.56 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/compare.mjs                     0.84 kB │ gzip:  0.47 kB
ℹ dist/astro/routes/api/dev/emails.mjs                                            0.83 kB │ gzip:  0.41 kB
ℹ dist/astro/routes/api/auth/logout.mjs                                           0.81 kB │ gzip:  0.47 kB
ℹ dist/astro/routes/api/content/_collection_/authors.mjs                          0.80 kB │ gzip:  0.45 kB
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
ℹ dist/api-BjvcjbbA.mjs.map                                                     320.59 kB │ gzip: 69.82 kB
ℹ dist/cli/index.mjs.map                                                        293.01 kB │ gzip: 67.88 kB
ℹ dist/runner-DH_2MI_9.mjs.map                                                  289.45 kB │ gzip: 54.22 kB
ℹ dist/astro/middleware.mjs.map                                                 263.83 kB │ gzip: 69.65 kB
ℹ dist/menus-DagBF7aa.mjs.map                                                   204.64 kB │ gzip: 46.97 kB
ℹ dist/astro/routes/api/openapi.json.mjs.map                                    171.47 kB │ gzip: 23.66 kB
ℹ dist/astro/index.mjs.map                                                      165.72 kB │ gzip: 40.82 kB
ℹ dist/runner-DH_2MI_9.mjs                                                      155.31 kB │ gzip: 29.74 kB
ℹ dist/api-BjvcjbbA.mjs                                                         152.07 kB │ gzip: 34.77 kB
ℹ dist/astro/routes/api/mcp.mjs.map                                             141.48 kB │ gzip: 26.81 kB
ℹ dist/import-Bb1T9WJS.mjs.map                                                  112.07 kB │ gzip: 25.69 kB
ℹ dist/redirects-Dcbuisoj.mjs.map                                               101.22 kB │ gzip: 17.53 kB
ℹ dist/menus-DagBF7aa.mjs                                                        95.82 kB │ gzip: 22.93 kB
ℹ dist/content-DoedtINi.mjs.map                                                  73.89 kB │ gzip: 16.89 kB
ℹ dist/byline-BRsQgaMb.mjs.map                                                   72.26 kB │ gzip: 18.47 kB
ℹ dist/context-i9zkOXT1.mjs.map                                                  71.02 kB │ gzip: 17.11 kB
ℹ dist/query-Cb_9xruO.mjs.map                                                    70.32 kB │ gzip: 20.76 kB
ℹ dist/apply-BKAgynWq.mjs.map                                                    66.86 kB │ gzip: 17.16 kB
ℹ dist/loader-DiVLEHUQ.mjs.map                                                   65.45 kB │ gzip: 19.18 kB
ℹ dist/astro/routes/api/import/wordpress/execute.mjs.map                         59.52 kB │ gzip: 17.63 kB
ℹ dist/registry-BTHvnidp.mjs.map                                                 56.50 kB │ gzip: 13.73 kB
ℹ dist/menus-DBLT6biX.mjs.map                                                    51.44 kB │ gzip: 12.16 kB
ℹ dist/astro/middleware/request-context.mjs.map                                  49.54 kB │ gzip: 12.52 kB
ℹ dist/redirects-Dcbuisoj.mjs                                                    48.94 kB │ gzip:  9.94 kB
ℹ dist/import-Bb1T9WJS.mjs                                                       48.70 kB │ gzip: 11.84 kB
ℹ dist/astro/middleware/auth.mjs.map                                             44.92 kB │ gzip: 12.45 kB
ℹ dist/taxonomies-CP6BTAVo.mjs.map                                               40.89 kB │ gzip: 11.22 kB
ℹ dist/index-Cpz6-8gg.d.mts.map                                                  40.06 kB │ gzip: 11.03 kB
ℹ dist/byline-BRsQgaMb.mjs                                                       38.21 kB │ gzip: 10.25 kB
ℹ dist/content-DoedtINi.mjs                                                      37.26 kB │ gzip:  9.09 kB
ℹ dist/taxonomies-DiEnl8Yj.mjs.map                                               36.46 kB │ gzip:  8.73 kB
ℹ dist/validate-DNOAL_Fm.mjs.map                                                 35.48 kB │ gzip:  7.73 kB
ℹ dist/byline-registry-BOjqDOim.mjs.map                                          33.30 kB │ gzip:  9.67 kB
ℹ dist/client/index.mjs.map                                                      33.25 kB │ gzip:  7.97 kB
ℹ dist/redirects-DctmKGXI.mjs.map                                                33.20 kB │ gzip:  8.44 kB
ℹ dist/apply-BKAgynWq.mjs                                                        32.73 kB │ gzip:  8.28 kB
ℹ dist/page/index.mjs.map                                                        31.64 kB │ gzip:  8.67 kB
ℹ dist/query-Cb_9xruO.mjs                                                        31.35 kB │ gzip:  9.65 kB
ℹ dist/loader-DiVLEHUQ.mjs                                                       31.26 kB │ gzip:  9.60 kB
ℹ dist/context-i9zkOXT1.mjs                                                      30.33 kB │ gzip:  8.11 kB
ℹ dist/device-flow-DENDCQ9F.mjs.map                                              29.83 kB │ gzip:  7.18 kB
ℹ dist/registry-BTHvnidp.mjs                                                     28.18 kB │ gzip:  7.18 kB
ℹ dist/object-cache-CHbHv83-.mjs.map                                             27.68 kB │ gzip:  9.48 kB
ℹ dist/error-DNHeDYPh.mjs.map                                                    27.64 kB │ gzip:  6.56 kB
ℹ dist/search-C7XY71qe.mjs.map                                                   26.64 kB │ gzip:  8.22 kB
ℹ dist/redirect-B2I1L2Qs.mjs.map                                                 26.36 kB │ gzip:  6.98 kB
ℹ dist/secrets-BSf9pRRY.mjs.map                                                  25.68 kB │ gzip:  8.77 kB
ℹ dist/fts-manager-4RwEG1Bi.mjs.map                                              24.82 kB │ gzip:  6.62 kB
ℹ dist/taxonomy-DF5mNlo5.mjs.map                                                 24.65 kB │ gzip:  6.36 kB
ℹ dist/menus-DBLT6biX.mjs                                                        23.72 kB │ gzip:  6.00 kB
ℹ dist/ssrf-BRKb343l.mjs.map                                                     23.59 kB │ gzip:  8.30 kB
ℹ dist/astro/routes/api/oauth/authorize.mjs.map                                  22.43 kB │ gzip:  6.46 kB
ℹ dist/astro/routes/api/import/wordpress/analyze.mjs.map                         22.30 kB │ gzip:  6.90 kB
ℹ dist/zod-generator-D-Z7uBCM.mjs.map                                            21.76 kB │ gzip:  6.71 kB
ℹ dist/taxonomies-CP6BTAVo.mjs                                                   21.38 kB │ gzip:  5.81 kB
ℹ dist/comment-CIyZkO-O.mjs.map                                                  20.99 kB │ gzip:  4.99 kB
ℹ dist/astro/routes/api/admin/plugins/registry/artifact.mjs.map                  20.68 kB │ gzip:  7.13 kB
ℹ dist/astro/routes/api/snapshot.mjs.map                                         19.96 kB │ gzip:  6.78 kB
ℹ dist/sections-BfDrU7Mf.mjs.map                                                 19.39 kB │ gzip:  4.78 kB
ℹ dist/byline-fields-eyJMblSr.mjs.map                                            19.35 kB │ gzip:  4.77 kB
ℹ dist/bylines-QIC7qsUk.mjs.map                                                  18.64 kB │ gzip:  6.11 kB
ℹ dist/byline-registry-BOjqDOim.mjs                                              18.31 kB │ gzip:  5.89 kB
ℹ dist/oauth-authorization-CsvzIp_F.mjs.map                                      17.99 kB │ gzip:  4.89 kB
ℹ dist/types-DKwtts2d.d.mts.map                                                  17.62 kB │ gzip:  4.76 kB
ℹ dist/cron-C5LVoNmP.mjs.map                                                     17.49 kB │ gzip:  5.76 kB
ℹ dist/error-DNHeDYPh.mjs                                                        17.42 kB │ gzip:  4.24 kB
ℹ dist/validate-DNOAL_Fm.mjs                                                     17.06 kB │ gzip:  3.83 kB
ℹ dist/portable-text-BICg8bTk.mjs.map                                            17.04 kB │ gzip:  4.72 kB
ℹ dist/utils-B7A57fm9.mjs.map                                                    16.93 kB │ gzip:  5.01 kB
ℹ dist/media-D6UwDm00.mjs.map                                                    16.93 kB │ gzip:  5.05 kB
ℹ dist/manifest-schema-kPGX7VS-.mjs.map                                          16.76 kB │ gzip:  4.71 kB
ℹ dist/astro/routes/api/import/wordpress-plugin/execute.mjs.map                  16.41 kB │ gzip:  5.34 kB
ℹ dist/redirects-DctmKGXI.mjs                                                    16.27 kB │ gzip:  4.35 kB
ℹ dist/settings-8LHCxR9S.mjs.map                                                 16.18 kB │ gzip:  5.23 kB
ℹ dist/astro/routes/api/comments/_collection_/_contentId_/index.mjs.map          15.95 kB │ gzip:  4.89 kB
ℹ dist/taxonomies-DiEnl8Yj.mjs                                                   15.83 kB │ gzip:  3.87 kB
ℹ dist/oauth-clients-C9SYwEbZ.mjs.map                                            15.58 kB │ gzip:  3.61 kB
ℹ dist/storage/s3.mjs.map                                                        15.38 kB │ gzip:  5.03 kB
ℹ dist/plugins/adapt-sandbox-entry.mjs.map                                       15.31 kB │ gzip:  5.33 kB
ℹ dist/device-flow-DENDCQ9F.mjs                                                  14.86 kB │ gzip:  3.83 kB
ℹ dist/service-DZi0B1XO.mjs.map                                                  14.62 kB │ gzip:  4.39 kB
ℹ dist/object-cache-CHbHv83-.mjs                                                 14.57 kB │ gzip:  5.36 kB
ℹ dist/secrets-BSf9pRRY.mjs                                                      14.41 kB │ gzip:  5.42 kB
ℹ dist/fts-manager-4RwEG1Bi.mjs                                                  13.79 kB │ gzip:  3.92 kB
ℹ dist/types-tM44hEcf.mjs.map                                                    13.39 kB │ gzip:  4.02 kB
ℹ dist/comments-EfE1-H-U.mjs.map                                                 13.34 kB │ gzip:  3.37 kB
ℹ dist/search-C7XY71qe.mjs                                                       13.27 kB │ gzip:  4.33 kB
ℹ dist/astro/routes/api/import/wordpress/media.mjs.map                           13.14 kB │ gzip:  3.98 kB
ℹ dist/enrich-BQ0mxJRs.mjs.map                                                   13.08 kB │ gzip:  4.66 kB
ℹ dist/bylines-BQlQokM0.mjs.map                                                  13.08 kB │ gzip:  4.32 kB
ℹ dist/taxonomy-DF5mNlo5.mjs                                                     12.86 kB │ gzip:  3.56 kB
ℹ dist/ssrf-BRKb343l.mjs                                                         12.75 kB │ gzip:  5.03 kB
ℹ dist/astro/routes/api/comments/_collection_/_contentId_/reactions.mjs.map      12.08 kB │ gzip:  3.84 kB
ℹ dist/redirect-B2I1L2Qs.mjs                                                     12.07 kB │ gzip:  3.71 kB
ℹ dist/user-B4y-aRCH.mjs.map                                                     11.54 kB │ gzip:  3.64 kB
ℹ dist/normalize-CeglrBT9.mjs.map                                                11.49 kB │ gzip:  3.40 kB
ℹ dist/astro/routes/api/import/wordpress/rewrite-urls.mjs.map                    11.45 kB │ gzip:  3.70 kB
ℹ dist/types-BDNJow_f.mjs.map                                                    11.38 kB │ gzip:  4.26 kB
ℹ dist/astro/routes/api/auth/oauth/_provider_/callback.mjs.map                   11.29 kB │ gzip:  3.77 kB
ℹ dist/storage/local.mjs.map                                                     11.26 kB │ gzip:  3.76 kB
ℹ dist/astro/routes/sitemap-_collection_.xml.mjs.map                             11.15 kB │ gzip:  3.90 kB
ℹ dist/validation-BTRcg5uD.mjs.map                                               11.09 kB │ gzip:  4.18 kB
ℹ dist/byline-fields-eyJMblSr.mjs                                                10.44 kB │ gzip:  3.04 kB
ℹ dist/astro/routes/api/media.mjs.map                                            10.43 kB │ gzip:  3.69 kB
ℹ dist/media/local-runtime.mjs.map                                               10.41 kB │ gzip:  3.18 kB
ℹ dist/astro/routes/api/content/_collection_/_id_.mjs.map                        10.36 kB │ gzip:  2.77 kB
ℹ dist/tokens-LeuXF9gG.mjs.map                                                   10.30 kB │ gzip:  3.28 kB
ℹ dist/astro/routes/api/oauth/token.mjs.map                                      10.07 kB │ gzip:  3.04 kB
ℹ dist/zod-generator-D-Z7uBCM.mjs                                                 9.98 kB │ gzip:  3.21 kB
ℹ dist/field-defs-cache-CaPy3177.mjs.map                                          9.76 kB │ gzip:  3.92 kB
ℹ dist/single-flight-cache-Cdfkic3t.mjs.map                                       9.65 kB │ gzip:  3.88 kB
ℹ dist/cron-C5LVoNmP.mjs                                                          9.56 kB │ gzip:  3.49 kB
ℹ dist/comment-CIyZkO-O.mjs                                                       9.49 kB │ gzip:  2.56 kB
ℹ dist/media/index.mjs.map                                                        9.47 kB │ gzip:  3.04 kB
ℹ dist/astro/routes/api/setup/dev-bypass.mjs.map                                  9.43 kB │ gzip:  3.57 kB
ℹ dist/seo-4f_H0FIw.mjs.map                                                       9.39 kB │ gzip:  3.12 kB
ℹ dist/sections-BfDrU7Mf.mjs                                                      9.34 kB │ gzip:  2.47 kB
ℹ dist/api-tokens-D6ppjIVi.mjs.map                                                9.31 kB │ gzip:  2.68 kB
ℹ dist/manifest-schema-kPGX7VS-.mjs                                               9.14 kB │ gzip:  3.01 kB
ℹ dist/transport-_2nBz7e9.mjs.map                                                 9.12 kB │ gzip:  3.18 kB
ℹ dist/resolve-C7I0qiR0.mjs.map                                                   9.12 kB │ gzip:  3.20 kB
ℹ dist/astro/routes/api/import/wordpress/rewrite-url-helpers.mjs.map              9.07 kB │ gzip:  3.12 kB
ℹ dist/byline-fields-CQDFmXjE.d.mts.map                                           9.02 kB │ gzip:  1.55 kB
ℹ dist/byline-fields-DaMKzkhO.mjs.map                                             8.96 kB │ gzip:  2.15 kB
ℹ dist/patterns-BKmjvM7K.mjs.map                                                  8.92 kB │ gzip:  3.02 kB
ℹ dist/settings-8LHCxR9S.mjs                                                      8.90 kB │ gzip:  3.10 kB
ℹ dist/client/cf-access.mjs.map                                                   8.87 kB │ gzip:  3.14 kB
ℹ dist/bylines-QIC7qsUk.mjs                                                       8.67 kB │ gzip:  3.16 kB
ℹ dist/astro/routes/api/import/wordpress/prepare.mjs.map                          8.65 kB │ gzip:  3.13 kB
ℹ dist/oauth-authorization-CsvzIp_F.mjs                                           8.64 kB │ gzip:  2.58 kB
ℹ dist/media/image-endpoint.mjs.map                                               8.47 kB │ gzip:  3.51 kB
ℹ dist/seo-BkhuuaaE.mjs.map                                                       8.44 kB │ gzip:  3.45 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs.map        8.42 kB │ gzip:  2.72 kB
ℹ dist/astro/routes/api/oauth/register.mjs.map                                    8.19 kB │ gzip:  2.94 kB
ℹ dist/dialect-helpers-DRI5pyY3.mjs.map                                           8.19 kB │ gzip:  2.27 kB
ℹ dist/allowed-origins-D5FxMUo8.mjs.map                                           8.19 kB │ gzip:  3.02 kB
ℹ dist/request-meta-CmS1tDFf.mjs.map                                              8.19 kB │ gzip:  3.14 kB
ℹ dist/utils-B7A57fm9.mjs                                                         8.16 kB │ gzip:  2.90 kB
ℹ dist/astro/routes/api/media/_id_/confirm.mjs.map                                8.10 kB │ gzip:  3.11 kB
ℹ dist/rate-limit-DIPf9dmr.mjs.map                                                8.07 kB │ gzip:  3.40 kB
ℹ dist/dashboard-nA_fxkd0.mjs.map                                                 7.78 kB │ gzip:  2.87 kB
ℹ dist/options-DTTML-Tx.mjs.map                                                   7.78 kB │ gzip:  2.31 kB
ℹ dist/portable-text-BICg8bTk.mjs                                                 7.62 kB │ gzip:  2.38 kB
ℹ dist/astro/routes/api/admin/users/_id_/index.mjs.map                            7.59 kB │ gzip:  2.39 kB
ℹ dist/media-D6UwDm00.mjs                                                         7.58 kB │ gzip:  2.53 kB
ℹ dist/oauth-clients-C9SYwEbZ.mjs                                                 7.56 kB │ gzip:  1.84 kB
ℹ dist/init-lock-6b309ZrF.mjs.map                                                 7.20 kB │ gzip:  3.02 kB
ℹ dist/types-xIfVRNLp.d.mts.map                                                   6.96 kB │ gzip:  1.15 kB
ℹ dist/enrich-BQ0mxJRs.mjs                                                        6.84 kB │ gzip:  2.70 kB
ℹ dist/bylines-BQlQokM0.mjs                                                       6.83 kB │ gzip:  2.33 kB
ℹ dist/widgets-BgKf3c-x.mjs.map                                                   6.73 kB │ gzip:  2.37 kB
ℹ dist/astro/middleware/redirect.mjs.map                                          6.65 kB │ gzip:  2.52 kB
ℹ dist/comment-reaction-C6cSXp1W.mjs.map                                          6.61 kB │ gzip:  2.24 kB
ℹ dist/astro/routes/api/widget-areas/_name_/widgets/_id_.mjs.map                  6.52 kB │ gzip:  1.77 kB
ℹ dist/seo/index.mjs.map                                                          6.49 kB │ gzip:  2.40 kB
ℹ dist/astro/routes/api/settings/email.mjs.map                                    6.47 kB │ gzip:  2.40 kB
ℹ dist/astro/routes/api/plugins/_pluginId_/_...path_.mjs.map                      6.43 kB │ gzip:  2.62 kB
ℹ dist/astro/routes/api/setup/admin-verify.mjs.map                                6.33 kB │ gzip:  2.31 kB
ℹ dist/astro/routes/api/media/_id_.mjs.map                                        6.28 kB │ gzip:  1.75 kB
ℹ dist/astro/routes/api/media/upload-url.mjs.map                                  6.25 kB │ gzip:  2.44 kB
ℹ dist/request-cache-KCNHp_RJ.mjs.map                                             6.23 kB │ gzip:  2.43 kB
ℹ dist/astro/routes/api/setup/admin.mjs.map                                       6.21 kB │ gzip:  2.51 kB
ℹ dist/service-DZi0B1XO.mjs                                                       6.21 kB │ gzip:  2.19 kB
ℹ dist/astro/routes/api/setup/index.mjs.map                                       6.16 kB │ gzip:  2.40 kB
ℹ dist/database/instrumentation.mjs.map                                           6.15 kB │ gzip:  2.62 kB
ℹ dist/astro/routes/api/auth/oauth/_provider_.mjs.map                             6.14 kB │ gzip:  2.26 kB
ℹ dist/public-url-CTVqgMmg.mjs.map                                                5.92 kB │ gzip:  2.40 kB
ℹ dist/astro/routes/api/auth/passkey/register/verify.mjs.map                      5.90 kB │ gzip:  2.22 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/preview-url.mjs.map             5.90 kB │ gzip:  2.39 kB
ℹ dist/validate-VPnKoIzW.mjs.map                                                  5.90 kB │ gzip:  1.70 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/schedule.mjs.map                5.82 kB │ gzip:  1.68 kB
ℹ dist/astro/routes/api/admin/comments/_id_/status.mjs.map                        5.70 kB │ gzip:  2.00 kB
ℹ dist/resolve-C7I0qiR0.mjs                                                       5.63 kB │ gzip:  2.12 kB
ℹ dist/validation-BTRcg5uD.mjs                                                    5.61 kB │ gzip:  2.26 kB
ℹ dist/astro/routes/api/auth/dev-bypass.mjs.map                                   5.58 kB │ gzip:  2.30 kB
ℹ dist/astro/routes/api/admin/plugins/registry/install.mjs.map                    5.57 kB │ gzip:  2.38 kB
ℹ dist/astro/routes/api/media/providers/_providerId_/index.mjs.map                5.54 kB │ gzip:  1.81 kB
ℹ dist/normalize-CeglrBT9.mjs                                                     5.51 kB │ gzip:  1.60 kB
ℹ dist/comments-EfE1-H-U.mjs                                                      5.49 kB │ gzip:  1.74 kB
ℹ dist/preview-DKGCt2_p.mjs.map                                                   5.44 kB │ gzip:  1.93 kB
ℹ dist/user-B4y-aRCH.mjs                                                          5.37 kB │ gzip:  1.94 kB
ℹ dist/parse-X-otjCXc.mjs.map                                                     5.35 kB │ gzip:  1.94 kB
ℹ dist/allowed-origins-D5FxMUo8.mjs                                               5.31 kB │ gzip:  2.06 kB
ℹ dist/seo-4f_H0FIw.mjs                                                           5.28 kB │ gzip:  1.87 kB
ℹ dist/types-CQAugunJ.mjs.map                                                     5.27 kB │ gzip:  1.85 kB
ℹ dist/astro/routes/api/manifest.mjs.map                                          5.26 kB │ gzip:  2.30 kB
ℹ dist/request-context.mjs.map                                                    5.22 kB │ gzip:  2.28 kB
ℹ dist/astro/routes/api/admin/bylines/_id_/translations.mjs.map                   5.22 kB │ gzip:  1.88 kB
ℹ dist/astro/routes/api/setup/status.mjs.map                                      5.09 kB │ gzip:  1.96 kB
ℹ dist/patterns-BKmjvM7K.mjs                                                      5.05 kB │ gzip:  1.85 kB
ℹ dist/astro/routes/api/content/_collection_/index.mjs.map                        4.99 kB │ gzip:  1.84 kB
ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_/translations.mjs.map       4.98 kB │ gzip:  1.50 kB
ℹ dist/client/index.d.mts.map                                                     4.98 kB │ gzip:  1.43 kB
ℹ dist/astro/routes/api/auth/passkey/_id_.mjs.map                                 4.95 kB │ gzip:  1.56 kB
ℹ dist/tokens-LeuXF9gG.mjs                                                        4.94 kB │ gzip:  1.73 kB
ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_.mjs.map                    4.92 kB │ gzip:  1.17 kB
ℹ dist/astro/routes/api/typegen.mjs.map                                           4.90 kB │ gzip:  1.79 kB
ℹ dist/astro/routes/api/admin/allowed-domains/_domain_.mjs.map                    4.84 kB │ gzip:  1.49 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/publish.mjs.map                 4.76 kB │ gzip:  1.89 kB
ℹ dist/astro/routes/api/schema/index.mjs.map                                      4.75 kB │ gzip:  1.93 kB
ℹ dist/astro/routes/api/admin/oauth-clients/_id_.mjs.map                          4.75 kB │ gzip:  1.34 kB
ℹ dist/astro/routes/api/import/wordpress-plugin/analyze.mjs.map                   4.74 kB │ gzip:  1.92 kB
ℹ dist/astro/routes/api/admin/byline-fields/_slug_.mjs.map                        4.70 kB │ gzip:  1.46 kB
ℹ dist/astro/routes/api/admin/allowed-domains/index.mjs.map                       4.61 kB │ gzip:  1.60 kB
ℹ dist/astro/types.d.mts.map                                                      4.60 kB │ gzip:  1.26 kB
ℹ dist/request-meta-CmS1tDFf.mjs                                                  4.58 kB │ gzip:  1.93 kB
ℹ dist/single-flight-cache-Cdfkic3t.mjs                                           4.56 kB │ gzip:  2.03 kB
ℹ dist/astro/routes/api/admin/bylines/_id_/index.mjs.map                          4.54 kB │ gzip:  1.61 kB
ℹ dist/transport-_2nBz7e9.mjs                                                     4.50 kB │ gzip:  1.70 kB
ℹ dist/astro/routes/api/menus/_name_/translations.mjs.map                         4.50 kB │ gzip:  1.48 kB
ℹ dist/api-tokens-D6ppjIVi.mjs                                                    4.48 kB │ gzip:  1.47 kB
ℹ dist/plugin-utils.mjs.map                                                       4.46 kB │ gzip:  1.89 kB
ℹ dist/astro/routes/api/auth/signup/request.mjs.map                               4.45 kB │ gzip:  1.92 kB
ℹ dist/astro/image-endpoint.mjs.map                                               4.45 kB │ gzip:  1.88 kB
ℹ dist/rate-limit-DIPf9dmr.mjs                                                    4.43 kB │ gzip:  2.06 kB
ℹ dist/trusted-proxy-DZY5WCn2.mjs.map                                             4.43 kB │ gzip:  1.96 kB
ℹ dist/astro/routes/api/auth/magic-link/send.mjs.map                              4.40 kB │ gzip:  1.78 kB
ℹ dist/astro/routes/api/widget-areas/index.mjs.map                                4.39 kB │ gzip:  1.57 kB
ℹ dist/validate-VPnKoIzW.mjs                                                      4.35 kB │ gzip:  1.32 kB
ℹ dist/astro/routes/api/auth/signup/complete.mjs.map                              4.33 kB │ gzip:  1.74 kB
ℹ dist/base64-CmWvODNW.mjs.map                                                    4.31 kB │ gzip:  1.41 kB
ℹ dist/astro/routes/api/auth/passkey/options.mjs.map                              4.30 kB │ gzip:  1.76 kB
ℹ dist/astro/routes/api/auth/invite/complete.mjs.map                              4.29 kB │ gzip:  1.72 kB
ℹ dist/astro/routes/api/themes/preview.mjs.map                                    4.25 kB │ gzip:  1.80 kB
ℹ dist/astro/routes/api/auth/invite/index.mjs.map                                 4.23 kB │ gzip:  1.83 kB
ℹ dist/astro/routes/api/admin/hooks/exclusive/_hookName_.mjs.map                  4.20 kB │ gzip:  1.71 kB
ℹ dist/object-cache/memory.mjs.map                                                4.18 kB │ gzip:  1.81 kB
ℹ dist/astro/routes/api/auth/passkey/register/options.mjs.map                     4.18 kB │ gzip:  1.69 kB
ℹ dist/oauth-state-store---zrApfB.mjs.map                                         4.17 kB │ gzip:  1.51 kB
ℹ dist/astro/routes/api/redirects/_id_.mjs.map                                    4.17 kB │ gzip:  1.10 kB
ℹ dist/astro/routes/api/admin/plugins/registry/_id_/update.mjs.map                4.10 kB │ gzip:  1.70 kB
ℹ dist/astro/routes/api/auth/invite/register-options.mjs.map                      4.09 kB │ gzip:  1.75 kB
ℹ dist/astro/routes/api/admin/bylines/index.mjs.map                               4.09 kB │ gzip:  1.48 kB
ℹ dist/astro/middleware/setup.mjs.map                                             4.08 kB │ gzip:  1.67 kB
ℹ dist/astro/routes/sitemap.xml.mjs.map                                           4.05 kB │ gzip:  1.66 kB
ℹ dist/astro/routes/api/sections/_slug_.mjs.map                                   3.99 kB │ gzip:  1.04 kB
ℹ dist/astro/routes/api/media/providers/_providerId_/_itemId_.mjs.map             3.95 kB │ gzip:  1.20 kB
ℹ dist/astro/routes/api/widget-areas/_name_.mjs.map                               3.86 kB │ gzip:  1.25 kB
ℹ dist/astro/routes/api/schema/collections/_slug_/index.mjs.map                   3.84 kB │ gzip:  1.15 kB
ℹ dist/seo-BkhuuaaE.mjs                                                           3.81 kB │ gzip:  1.83 kB
ℹ dist/astro/routes/api/menus/_name_.mjs.map                                      3.79 kB │ gzip:  1.00 kB
ℹ dist/db/index.mjs.map                                                           3.77 kB │ gzip:  1.42 kB
ℹ dist/astro/routes/api/widget-areas/_name_/widgets.mjs.map                       3.74 kB │ gzip:  1.48 kB
ℹ dist/byline-fields-DaMKzkhO.mjs                                                 3.74 kB │ gzip:  0.97 kB
ℹ dist/options-DTTML-Tx.mjs                                                       3.69 kB │ gzip:  1.25 kB
ℹ dist/astro/routes/api/redirects/404s/index.mjs.map                              3.64 kB │ gzip:  1.07 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/duplicate.mjs.map               3.62 kB │ gzip:  1.48 kB
ℹ dist/astro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs.map      3.60 kB │ gzip:  1.01 kB
ℹ dist/astro/routes/api/admin/plugins/updates.mjs.map                             3.56 kB │ gzip:  1.51 kB
ℹ dist/astro/routes/api/auth/passkey/verify.mjs.map                               3.54 kB │ gzip:  1.42 kB
ℹ dist/cache-D7wGv8oE.mjs.map                                                     3.54 kB │ gzip:  1.45 kB
ℹ dist/dashboard-nA_fxkd0.mjs                                                     3.54 kB │ gzip:  1.51 kB
ℹ dist/request-cache-KCNHp_RJ.mjs                                                 3.53 kB │ gzip:  1.51 kB
ℹ dist/mime-CCEzze7W.mjs.map                                                      3.52 kB │ gzip:  1.48 kB
ℹ dist/astro/routes/api/oauth/device/token.mjs.map                                3.50 kB │ gzip:  1.56 kB
ℹ dist/components-CYt4uVK9.mjs.map                                                3.46 kB │ gzip:  0.99 kB
ℹ dist/widgets-BgKf3c-x.mjs                                                       3.44 kB │ gzip:  1.29 kB
ℹ dist/challenge-store-LhiqMccz.mjs.map                                           3.43 kB │ gzip:  1.34 kB
ℹ dist/astro/routes/api/admin/users/_id_/disable.mjs.map                          3.43 kB │ gzip:  1.49 kB
ℹ dist/comment-reaction-C6cSXp1W.mjs                                              3.40 kB │ gzip:  1.25 kB
ℹ dist/astro/routes/api/admin/byline-fields/index.mjs.map                         3.38 kB │ gzip:  1.34 kB
ℹ dist/public-url-CTVqgMmg.mjs                                                    3.37 kB │ gzip:  1.50 kB
ℹ dist/astro/routes/api/menus/_name_/items/_id_.mjs.map                           3.35 kB │ gzip:  1.04 kB
ℹ dist/types-Dbqff978.d.mts.map                                                   3.35 kB │ gzip:  1.20 kB
ℹ dist/astro/routes/api/taxonomies/_name_/terms/index.mjs.map                     3.34 kB │ gzip:  1.16 kB
ℹ dist/astro/routes/api/media/file/_...key_.mjs.map                               3.33 kB │ gzip:  1.52 kB
ℹ dist/dialect-helpers-DRI5pyY3.mjs                                               3.33 kB │ gzip:  1.12 kB
ℹ dist/astro/routes/api/admin/oauth-clients/index.mjs.map                         3.32 kB │ gzip:  1.25 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/discard-draft.mjs.map           3.31 kB │ gzip:  1.36 kB
ℹ dist/astro/routes/robots.txt.mjs.map                                            3.28 kB │ gzip:  1.34 kB
ℹ dist/astro/routes/api/admin/users/_id_/send-recovery.mjs.map                    3.27 kB │ gzip:  1.44 kB
ℹ dist/field-defs-cache-CaPy3177.mjs                                              3.25 kB │ gzip:  1.48 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/restore.mjs.map                 3.25 kB │ gzip:  1.34 kB
ℹ dist/db-errors-CK46D-ly.mjs.map                                                 3.25 kB │ gzip:  1.28 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/unpublish.mjs.map               3.24 kB │ gzip:  1.32 kB
ℹ dist/email-console-DJP32ucW.mjs.map                                             3.23 kB │ gzip:  1.54 kB
ℹ dist/types-BDNJow_f.mjs                                                         3.22 kB │ gzip:  1.41 kB
ℹ dist/astro/routes/api/auth/magic-link/verify.mjs.map                            3.18 kB │ gzip:  1.34 kB
ℹ dist/astro/routes/api/widget-areas/_name_/reorder.mjs.map                       3.17 kB │ gzip:  1.32 kB
ℹ dist/validate-9ECmtEpJ.d.mts.map                                                3.16 kB │ gzip:  0.94 kB
ℹ dist/astro/routes/api/admin/api-tokens/index.mjs.map                            3.11 kB │ gzip:  1.21 kB
ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/install.mjs.map            3.11 kB │ gzip:  1.31 kB
ℹ dist/session-user-B8aLtKAH.mjs.map                                              3.11 kB │ gzip:  1.52 kB
ℹ dist/mode-BB0F8xTC.mjs.map                                                      3.04 kB │ gzip:  1.13 kB
ℹ dist/astro/routes/api/auth/me.mjs.map                                           3.04 kB │ gzip:  1.31 kB
ℹ dist/astro/routes/api/search/rebuild.mjs.map                                    3.02 kB │ gzip:  1.23 kB
ℹ dist/astro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs.map           2.97 kB │ gzip:  1.31 kB
ℹ dist/after-B1IIdH3Y.mjs.map                                                     2.96 kB │ gzip:  1.50 kB
ℹ dist/astro/routes/api/revisions/_revisionId_/restore.mjs.map                    2.94 kB │ gzip:  1.17 kB
ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/icon.mjs.map               2.94 kB │ gzip:  1.30 kB
ℹ dist/astro/routes/api/admin/users/index.mjs.map                                 2.94 kB │ gzip:  1.30 kB
ℹ dist/runtime.mjs.map                                                            2.91 kB │ gzip:  1.25 kB
ℹ dist/astro/routes/api/settings.mjs.map                                          2.90 kB │ gzip:  1.06 kB
ℹ dist/astro/routes/api/taxonomies/index.mjs.map                                  2.89 kB │ gzip:  1.02 kB
ℹ dist/types-tM44hEcf.mjs                                                         2.88 kB │ gzip:  1.32 kB
ℹ dist/astro/routes/api/redirects/index.mjs.map                                   2.86 kB │ gzip:  1.00 kB
ℹ dist/preview-DKGCt2_p.mjs                                                       2.85 kB │ gzip:  1.03 kB
ℹ dist/parse-X-otjCXc.mjs                                                         2.83 kB │ gzip:  1.15 kB
ℹ dist/default-CeRG-Ot4.mjs.map                                                   2.82 kB │ gzip:  0.81 kB
ℹ dist/passkey-config-C0YfSBko.mjs.map                                            2.81 kB │ gzip:  1.25 kB
ℹ dist/astro/routes/api/search/index.mjs.map                                      2.78 kB │ gzip:  1.33 kB
ℹ dist/astro/routes/api/well-known/auth.mjs.map                                   2.75 kB │ gzip:  1.22 kB
ℹ dist/astro/routes/api/oauth/device/code.mjs.map                                 2.74 kB │ gzip:  1.27 kB
ℹ dist/schema-CWsb53_h.mjs.map                                                    2.72 kB │ gzip:  1.15 kB
ℹ dist/astro/routes/api/sections/index.mjs.map                                    2.71 kB │ gzip:  0.96 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/update.mjs.map                         2.71 kB │ gzip:  1.13 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/translations.mjs.map            2.70 kB │ gzip:  1.28 kB
ℹ dist/astro/routes/api/admin/comments/_id_.mjs.map                               2.69 kB │ gzip:  0.92 kB
ℹ dist/astro/routes/api/search/enable.mjs.map                                     2.65 kB │ gzip:  1.12 kB
ℹ dist/placeholder-Cuce9U-m.d.mts.map                                             2.62 kB │ gzip:  0.98 kB
ℹ dist/astro/routes/api/import/wordpress-plugin/callback.mjs.map                  2.55 kB │ gzip:  1.19 kB
ℹ dist/astro/routes/api/menus/index.mjs.map                                       2.48 kB │ gzip:  0.97 kB
ℹ dist/config-CVssduLe.mjs.map                                                    2.48 kB │ gzip:  1.09 kB
ℹ dist/astro/routes/api/admin/themes/marketplace/index.mjs.map                    2.44 kB │ gzip:  1.06 kB
ℹ dist/base64-CmWvODNW.mjs                                                        2.44 kB │ gzip:  0.92 kB
ℹ dist/astro/routes/api/schema/collections/index.mjs.map                          2.42 kB │ gzip:  0.89 kB
ℹ dist/astro/routes/api/schema/collections/_slug_/fields/index.mjs.map            2.42 kB │ gzip:  0.83 kB
ℹ dist/astro/routes/api/admin/plugins/registry/_id_/uninstall.mjs.map             2.39 kB │ gzip:  1.08 kB
ℹ dist/index-DGIjmUXQ.d.mts.map                                                   2.36 kB │ gzip:  0.80 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/enable.mjs.map                         2.35 kB │ gzip:  1.07 kB
ℹ dist/astro/routes/api/admin/hooks/exclusive/index.mjs.map                       2.33 kB │ gzip:  1.11 kB
ℹ dist/transaction-qfqpPVpu.mjs.map                                               2.32 kB │ gzip:  1.10 kB
ℹ dist/astro/routes/api/auth/signup/verify.mjs.map                                2.29 kB │ gzip:  1.13 kB
ℹ dist/session-user-B8aLtKAH.mjs                                                  2.27 kB │ gzip:  1.17 kB
ℹ dist/astro/routes/api/auth/mode.mjs.map                                         2.27 kB │ gzip:  1.13 kB
ℹ dist/authorize-D_OmXF9h.mjs.map                                                 2.24 kB │ gzip:  0.85 kB
ℹ dist/astro/routes/api/auth/invite/accept.mjs.map                                2.22 kB │ gzip:  1.09 kB
ℹ dist/astro/routes/api/well-known/oauth-authorization-server.mjs.map             2.21 kB │ gzip:  0.97 kB
ℹ dist/init-lock-6b309ZrF.mjs                                                     2.19 kB │ gzip:  1.03 kB
ℹ dist/options-41nCWqi9.d.mts.map                                                 2.19 kB │ gzip:  0.83 kB
ℹ dist/astro/routes/api/search/suggest.mjs.map                                    2.19 kB │ gzip:  1.06 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/uninstall.mjs.map                      2.19 kB │ gzip:  0.98 kB
ℹ dist/hash-DrvzIXcz.mjs.map                                                      2.18 kB │ gzip:  1.05 kB
ℹ dist/astro/routes/api/auth/passkey/index.mjs.map                                2.11 kB │ gzip:  1.03 kB
ℹ dist/db-errors-CK46D-ly.mjs                                                     2.10 kB │ gzip:  0.89 kB
ℹ dist/setup-complete-gEiySUc-.mjs.map                                            2.08 kB │ gzip:  0.91 kB
ℹ dist/astro/routes/api/oauth/device/authorize.mjs.map                            2.06 kB │ gzip:  1.00 kB
ℹ dist/slugify-Cce3dTdg.mjs.map                                                   2.04 kB │ gzip:  1.01 kB
ℹ dist/astro/routes/api/admin/comments/index.mjs.map                              2.02 kB │ gzip:  0.91 kB
ℹ dist/trusted-proxy-DZY5WCn2.mjs                                                 1.99 kB │ gzip:  0.97 kB
ℹ dist/astro/routes/api/admin/users/_id_/enable.mjs.map                           1.99 kB │ gzip:  0.94 kB
ℹ dist/components-CYt4uVK9.mjs                                                    1.99 kB │ gzip:  0.71 kB
ℹ dist/astro/routes/api/admin/comments/bulk.mjs.map                               1.98 kB │ gzip:  0.88 kB
ℹ dist/cache-D7wGv8oE.mjs                                                         1.97 kB │ gzip:  0.81 kB
ℹ dist/astro/routes/api/admin/plugins/marketplace/index.mjs.map                   1.92 kB │ gzip:  0.86 kB
ℹ dist/settings-BH48Xi75.mjs.map                                                  1.91 kB │ gzip:  0.71 kB
ℹ dist/astro/routes/api/menus/_name_/reorder.mjs.map                              1.89 kB │ gzip:  0.86 kB
ℹ dist/astro/routes/api/menus/_name_/items.mjs.map                                1.87 kB │ gzip:  0.86 kB
ℹ dist/astro/routes/api/import/probe.mjs.map                                      1.84 kB │ gzip:  0.87 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/disable.mjs.map                        1.84 kB │ gzip:  0.85 kB
ℹ dist/astro/routes/api/admin/byline-fields/reorder.mjs.map                       1.82 kB │ gzip:  0.87 kB
ℹ dist/page/index.d.mts.map                                                       1.81 kB │ gzip:  0.69 kB
ℹ dist/oauth-state-store---zrApfB.mjs                                             1.79 kB │ gzip:  0.72 kB
ℹ dist/media-allowlist-Du8t1u6a.mjs.map                                           1.77 kB │ gzip:  0.95 kB
ℹ dist/astro/routes/api/setup/dev-reset.mjs.map                                   1.77 kB │ gzip:  0.89 kB
ℹ dist/astro/routes/api/schema/orphans/_slug_.mjs.map                             1.77 kB │ gzip:  0.81 kB
ℹ dist/types-CNlaBFzx.d.mts.map                                                   1.76 kB │ gzip:  0.54 kB
ℹ dist/media-url-O4rm9-SQ.mjs.map                                                 1.74 kB │ gzip:  0.88 kB
ℹ dist/astro/routes/api/oauth/token/refresh.mjs.map                               1.72 kB │ gzip:  0.87 kB
ℹ dist/astro/routes/api/admin/byline-fields/_slug_/usage.mjs.map                  1.69 kB │ gzip:  0.87 kB
ℹ dist/astro/routes/api/admin/api-tokens/_id_.mjs.map                             1.68 kB │ gzip:  0.85 kB
ℹ dist/astro/routes/api/redirects/404s/summary.mjs.map                            1.68 kB │ gzip:  0.79 kB
ℹ dist/astro/routes/api/oauth/token/revoke.mjs.map                                1.68 kB │ gzip:  0.87 kB
ℹ dist/email-console-DJP32ucW.mjs                                                 1.67 kB │ gzip:  0.86 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/revisions.mjs.map               1.67 kB │ gzip:  0.84 kB
ℹ dist/astro/routes/api/content/_collection_/authors.mjs.map                      1.66 kB │ gzip:  0.89 kB
ℹ dist/astro/routes/api/well-known/oauth-protected-resource.mjs.map               1.64 kB │ gzip:  0.85 kB
ℹ dist/types-ETmO_jQr.d.mts.map                                                   1.64 kB │ gzip:  0.59 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/permanent.mjs.map               1.62 kB │ gzip:  0.79 kB
ℹ dist/astro/routes/api/schema/collections/_slug_/fields/reorder.mjs.map          1.61 kB │ gzip:  0.72 kB
ℹ dist/challenge-store-LhiqMccz.mjs                                               1.59 kB │ gzip:  0.68 kB
ℹ dist/passkey-config-C0YfSBko.mjs                                                1.56 kB │ gzip:  0.74 kB
ℹ dist/astro/routes/api/content/_collection_/trash.mjs.map                        1.55 kB │ gzip:  0.77 kB
ℹ dist/api/route-utils.mjs.map                                                    1.54 kB │ gzip:  0.70 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/index.mjs.map                          1.53 kB │ gzip:  0.76 kB
ℹ dist/types-ByChcBgE.d.mts.map                                                   1.53 kB │ gzip:  0.67 kB
ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/index.mjs.map              1.45 kB │ gzip:  0.72 kB
ℹ dist/astro/routes/api/auth/logout.mjs.map                                       1.44 kB │ gzip:  0.77 kB
ℹ dist/astro/routes/api/admin/themes/marketplace/_id_/index.mjs.map               1.43 kB │ gzip:  0.72 kB
ℹ dist/astro/routes/api/dev/emails.mjs.map                                        1.43 kB │ gzip:  0.63 kB
ℹ dist/oauth-user-lookup-SHsWRlG9.mjs.map                                         1.41 kB │ gzip:  0.76 kB
ℹ dist/status-vUK0SA17.mjs.map                                                    1.39 kB │ gzip:  0.74 kB
ℹ dist/schema-CWsb53_h.mjs                                                        1.39 kB │ gzip:  0.67 kB
ℹ dist/plugin-types.d.mts.map                                                     1.38 kB │ gzip:  0.49 kB
ℹ dist/default-CeRG-Ot4.mjs                                                       1.35 kB │ gzip:  0.50 kB
ℹ dist/astro/routes/api/dashboard.mjs.map                                         1.34 kB │ gzip:  0.71 kB
ℹ dist/astro/routes/api/admin/plugins/index.mjs.map                               1.32 kB │ gzip:  0.68 kB
ℹ dist/slugify-Cce3dTdg.mjs                                                       1.31 kB │ gzip:  0.71 kB
ℹ dist/site-url-BLebyON8.mjs.map                                                  1.30 kB │ gzip:  0.73 kB
ℹ dist/astro/routes/api/admin/comments/counts.mjs.map                             1.30 kB │ gzip:  0.65 kB
ℹ dist/astro/routes/api/search/stats.mjs.map                                      1.29 kB │ gzip:  0.69 kB
ℹ dist/astro/routes/api/revisions/_revisionId_/index.mjs.map                      1.29 kB │ gzip:  0.68 kB
ℹ dist/load-B6inflnK.mjs.map                                                      1.28 kB │ gzip:  0.64 kB
ℹ dist/mime-CCEzze7W.mjs                                                          1.28 kB │ gzip:  0.64 kB
ℹ dist/authorize-D_OmXF9h.mjs                                                     1.28 kB │ gzip:  0.52 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/compare.mjs.map                 1.25 kB │ gzip:  0.67 kB
ℹ dist/config-CVssduLe.mjs                                                        1.23 kB │ gzip:  0.58 kB
ℹ dist/media-allowlist-Du8t1u6a.mjs                                               1.21 kB │ gzip:  0.70 kB
ℹ dist/hash-DrvzIXcz.mjs                                                          1.21 kB │ gzip:  0.67 kB
ℹ dist/astro/routes/api/media/providers/index.mjs.map                             1.16 kB │ gzip:  0.62 kB
ℹ dist/settings-BH48Xi75.mjs                                                      1.16 kB │ gzip:  0.48 kB
ℹ dist/astro/routes/PluginRegistry.mjs.map                                        1.15 kB │ gzip:  0.57 kB
ℹ dist/astro/routes/api/schema/orphans/index.mjs.map                              1.14 kB │ gzip:  0.57 kB
ℹ dist/db/postgres.mjs.map                                                        1.14 kB │ gzip:  0.53 kB
ℹ dist/media-url-O4rm9-SQ.mjs                                                     1.12 kB │ gzip:  0.61 kB
ℹ dist/setup-complete-gEiySUc-.mjs                                                1.12 kB │ gzip:  0.51 kB
ℹ dist/setup-nonce-DzS50zme.mjs.map                                               1.10 kB │ gzip:  0.63 kB
ℹ dist/status-vUK0SA17.mjs                                                        1.08 kB │ gzip:  0.58 kB
ℹ dist/astro/routes/api/import/wordpress/execute.d.mts.map                        1.06 kB │ gzip:  0.52 kB
ℹ dist/setup-nonce-DzS50zme.mjs                                                   1.02 kB │ gzip:  0.58 kB
ℹ dist/astro/routes/api/import/wordpress/analyze.d.mts.map                        1.00 kB │ gzip:  0.43 kB
ℹ dist/auth/providers/github.mjs.map                                              0.99 kB │ gzip:  0.51 kB
ℹ dist/auth/providers/google.mjs.map                                              0.99 kB │ gzip:  0.51 kB
ℹ dist/types-CvuKO5Pn.d.mts.map                                                   0.94 kB │ gzip:  0.46 kB
ℹ dist/transaction-qfqpPVpu.mjs                                                   0.92 kB │ gzip:  0.47 kB
ℹ dist/astro/routes/api/widget-components.mjs.map                                 0.91 kB │ gzip:  0.51 kB
ℹ dist/db/sqlite.mjs.map                                                          0.91 kB │ gzip:  0.51 kB
ℹ dist/chunks-B7hMIk8G.mjs.map                                                    0.90 kB │ gzip:  0.57 kB
ℹ dist/oauth-user-lookup-SHsWRlG9.mjs                                             0.81 kB │ gzip:  0.49 kB
ℹ dist/chunks-B7hMIk8G.mjs                                                        0.80 kB │ gzip:  0.51 kB
ℹ dist/after-B1IIdH3Y.mjs                                                         0.79 kB │ gzip:  0.48 kB
ℹ dist/redirect-CS-PHtNh.mjs.map                                                  0.75 kB │ gzip:  0.48 kB
ℹ dist/astro/routes/api/import/wordpress/rewrite-url-helpers.d.mts.map            0.74 kB │ gzip:  0.34 kB
ℹ dist/db/libsql.mjs.map                                                          0.71 kB │ gzip:  0.41 kB
ℹ dist/load-B6inflnK.mjs                                                          0.70 kB │ gzip:  0.38 kB
ℹ dist/errors-9P_FDrJ_.mjs.map                                                    0.67 kB │ gzip:  0.45 kB
ℹ dist/adapters-u037EnTR.d.mts.map                                                0.67 kB │ gzip:  0.32 kB
ℹ dist/storage/s3.d.mts.map                                                       0.67 kB │ gzip:  0.33 kB
ℹ dist/seo/index.d.mts.map                                                        0.64 kB │ gzip:  0.36 kB
ℹ dist/database/instrumentation.d.mts.map                                         0.64 kB │ gzip:  0.32 kB
ℹ dist/storage/local.d.mts.map                                                    0.62 kB │ gzip:  0.32 kB
ℹ dist/astro/routes/api/import/wordpress/media.d.mts.map                          0.60 kB │ gzip:  0.31 kB
ℹ dist/media/image-endpoint.d.mts.map                                             0.60 kB │ gzip:  0.32 kB
ℹ dist/types-BkZ8DUEI.d.mts.map                                                   0.59 kB │ gzip:  0.31 kB
ℹ dist/version-Bsqjg21k.mjs.map                                                   0.59 kB │ gzip:  0.33 kB
ℹ dist/request-context.d.mts.map                                                  0.59 kB │ gzip:  0.32 kB
ℹ dist/escape-Bjio4ZsM.mjs.map                                                    0.58 kB │ gzip:  0.34 kB
ℹ dist/mode-BB0F8xTC.mjs                                                          0.58 kB │ gzip:  0.36 kB
ℹ dist/plugin-utils.d.mts.map                                                     0.57 kB │ gzip:  0.31 kB
ℹ dist/types-Y09-wtyU.d.mts.map                                                   0.55 kB │ gzip:  0.30 kB
ℹ dist/astro/index.d.mts.map                                                      0.54 kB │ gzip:  0.30 kB
ℹ dist/redirect-CS-PHtNh.mjs                                                      0.53 kB │ gzip:  0.37 kB
ℹ dist/errors-9P_FDrJ_.mjs                                                        0.53 kB │ gzip:  0.34 kB
ℹ dist/transport-Blrl2k_o.d.mts.map                                               0.49 kB │ gzip:  0.28 kB
ℹ dist/runner-BbR3DfrL.d.mts.map                                                  0.49 kB │ gzip:  0.25 kB
ℹ dist/client/cf-access.d.mts.map                                                 0.49 kB │ gzip:  0.27 kB
ℹ dist/api/route-utils.d.mts.map                                                  0.48 kB │ gzip:  0.27 kB
ℹ dist/media/index.d.mts.map                                                      0.48 kB │ gzip:  0.27 kB
ℹ dist/types-BvbeGEtr.mjs                                                         0.45 kB │ gzip:  0.20 kB
ℹ dist/media/local-runtime.d.mts.map                                              0.45 kB │ gzip:  0.25 kB
ℹ dist/site-url-BLebyON8.mjs                                                      0.44 kB │ gzip:  0.29 kB
ℹ dist/types-CQAugunJ.mjs                                                         0.36 kB │ gzip:  0.24 kB
ℹ dist/escape-Bjio4ZsM.mjs                                                        0.36 kB │ gzip:  0.25 kB
ℹ dist/astro/routes/api/import/wordpress/rewrite-urls.d.mts.map                   0.34 kB │ gzip:  0.23 kB
ℹ dist/astro/middleware/auth.d.mts.map                                            0.33 kB │ gzip:  0.22 kB
ℹ dist/astro/routes/api/import/wordpress-plugin/execute.d.mts.map                 0.32 kB │ gzip:  0.23 kB
ℹ dist/astro/routes/api/import/wordpress/prepare.d.mts.map                        0.32 kB │ gzip:  0.21 kB
ℹ dist/astro/routes/api/plugins/_pluginId_/_...path_.d.mts.map                    0.29 kB │ gzip:  0.19 kB
ℹ dist/astro/middleware.d.mts.map                                                 0.27 kB │ gzip:  0.20 kB
ℹ dist/astro/routes/api/import/wordpress-plugin/analyze.d.mts.map                 0.27 kB │ gzip:  0.20 kB
ℹ dist/astro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.d.mts.map    0.26 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/PluginRegistry.d.mts.map                                      0.26 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_.d.mts.map                  0.25 kB │ gzip:  0.18 kB
ℹ dist/api-tokens-B4BQybOp.mjs                                                    0.25 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/content/_collection_/_id_/terms/_taxonomy_.d.mts.map      0.24 kB │ gzip:  0.19 kB
ℹ dist/astro/routes/api/import/probe.d.mts.map                                    0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/schema/collections/_slug_/index.d.mts.map                 0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/admin/oauth-clients/_id_.d.mts.map                        0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_/translations.d.mts.map     0.24 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/admin/byline-fields/_slug_.d.mts.map                      0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/admin/bylines/_id_/index.d.mts.map                        0.23 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/comments/_collection_/_contentId_/index.d.mts.map         0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/media/providers/_providerId_/_itemId_.d.mts.map           0.23 kB │ gzip:  0.18 kB
ℹ dist/astro/routes/api/comments/_collection_/_contentId_/reactions.d.mts.map     0.23 kB │ gzip:  0.18 kB
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
ℹ dist/plugins/adapt-sandbox-entry.d.mts.map                                      0.22 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/admin/allowed-domains/_domain_.d.mts.map                  0.22 kB │ gzip:  0.18 kB
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
ℹ dist/astro/routes/api/content/_collection_/authors.d.mts.map                    0.18 kB │ gzip:  0.16 kB
ℹ dist/astro/routes/api/typegen.d.mts.map                                         0.18 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/widget-areas/_name_/widgets.d.mts.map                     0.18 kB │ gzip:  0.16 kB
ℹ dist/runtime.d.mts.map                                                          0.18 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/enable.d.mts.map                       0.18 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/admin/plugins/_id_/update.d.mts.map                       0.18 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/admin/users/_id_/disable.d.mts.map                        0.18 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/widget-areas/_name_/reorder.d.mts.map                     0.18 kB │ gzip:  0.16 kB
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
ℹ dist/version-Bsqjg21k.mjs                                                       0.17 kB │ gzip:  0.16 kB
ℹ dist/astro/middleware/redirect.d.mts.map                                        0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/oauth/token/refresh.d.mts.map                             0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/auth/passkey/verify.d.mts.map                             0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/media/_id_/confirm.d.mts.map                              0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/schema/orphans/index.d.mts.map                            0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/search/suggest.d.mts.map                                  0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/admin/plugins/index.d.mts.map                             0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/auth/invite/accept.d.mts.map                              0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/auth/magic-link/send.d.mts.map                            0.17 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/auth/signup/verify.d.mts.map                              0.17 kB │ gzip:  0.15 kB
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
ℹ dist/scheduled-publish-BMljtY5G.d.mts.map                                       0.16 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/auth/logout.d.mts.map                                     0.16 kB │ gzip:  0.15 kB
ℹ dist/astro/routes/api/setup/admin.d.mts.map                                     0.16 kB │ gzip:  0.14 kB
ℹ dist/astro/routes/api/setup/index.d.mts.map                                     0.16 kB │ gzip:  0.14 kB
ℹ dist/astro/routes/api/dashboard.d.mts.map                                       0.16 kB │ gzip:  0.14 kB
ℹ dist/astro/routes/api/manifest.d.mts.map                                        0.16 kB │ gzip:  0.14 kB
ℹ dist/astro/routes/api/snapshot.d.mts.map                                        0.16 kB │ gzip:  0.14 kB
ℹ dist/astro/routes/api/auth/mode.d.mts.map                                       0.16 kB │ gzip:  0.14 kB
ℹ dist/astro/routes/sitemap.xml.d.mts.map                                         0.16 kB │ gzip:  0.14 kB
ℹ dist/astro/image-endpoint.d.mts.map                                             0.15 kB │ gzip:  0.14 kB
ℹ dist/astro/routes/robots.txt.d.mts.map                                          0.15 kB │ gzip:  0.14 kB
ℹ dist/db/postgres.d.mts.map                                                      0.15 kB │ gzip:  0.14 kB
ℹ dist/auth/providers/github.d.mts.map                                            0.15 kB │ gzip:  0.14 kB
ℹ dist/auth/providers/google.d.mts.map                                            0.15 kB │ gzip:  0.14 kB
ℹ dist/db/libsql.d.mts.map                                                        0.14 kB │ gzip:  0.14 kB
ℹ dist/db/sqlite.d.mts.map                                                        0.14 kB │ gzip:  0.14 kB
ℹ dist/object-cache/memory.d.mts.map                                              0.14 kB │ gzip:  0.13 kB
ℹ dist/ssrf-CcX9zvMK.mjs                                                          0.01 kB │ gzip:  0.03 kB
ℹ dist/index.d.mts                                                               19.65 kB │ gzip:  5.14 kB
ℹ dist/astro/types.d.mts                                                         13.48 kB │ gzip:  4.07 kB
ℹ dist/client/index.d.mts                                                        11.50 kB │ gzip:  3.14 kB
ℹ dist/api/schemas/index.d.mts                                                    8.46 kB │ gzip:  1.97 kB
ℹ dist/plugin-types.d.mts                                                         7.09 kB │ gzip:  2.45 kB
ℹ dist/page/index.d.mts                                                           6.93 kB │ gzip:  2.30 kB
ℹ dist/astro/routes/api/import/wordpress/execute.d.mts                            3.97 kB │ gzip:  1.57 kB
ℹ dist/media/image-endpoint.d.mts                                                 3.97 kB │ gzip:  1.83 kB
ℹ dist/astro/index.d.mts                                                          3.65 kB │ gzip:  1.58 kB
ℹ dist/database/instrumentation.d.mts                                             3.31 kB │ gzip:  1.51 kB
ℹ dist/media/index.d.mts                                                          3.29 kB │ gzip:  1.40 kB
ℹ dist/request-context.d.mts                                                      3.11 kB │ gzip:  1.42 kB
ℹ dist/api/route-utils.d.mts                                                      2.94 kB │ gzip:  1.35 kB
ℹ dist/plugin-utils.d.mts                                                         2.89 kB │ gzip:  1.26 kB
ℹ dist/client/cf-access.d.mts                                                     2.55 kB │ gzip:  1.04 kB
ℹ dist/astro/routes/api/import/wordpress/analyze.d.mts                            2.52 kB │ gzip:  0.95 kB
ℹ dist/seo/index.d.mts                                                            2.45 kB │ gzip:  1.01 kB
ℹ dist/astro/routes/api/import/wordpress/rewrite-url-helpers.d.mts                2.14 kB │ gzip:  0.89 kB
ℹ dist/astro/routes/api/import/wordpress/media.d.mts                              1.80 kB │ gzip:  0.77 kB
ℹ dist/media/local-runtime.d.mts                                                  1.80 kB │ gzip:  0.84 kB
ℹ dist/storage/s3.d.mts                                                           1.61 kB │ gzip:  0.75 kB
ℹ dist/storage/local.d.mts                                                        1.50 kB │ gzip:  0.70 kB
ℹ dist/plugins/adapt-sandbox-entry.d.mts                                          1.42 kB │ gzip:  0.67 kB
ℹ dist/astro/middleware.d.mts                                                     1.26 kB │ gzip:  0.70 kB
ℹ dist/runtime.d.mts                                                              1.14 kB │ gzip:  0.60 kB
ℹ dist/astro/middleware/auth.d.mts                                                1.02 kB │ gzip:  0.52 kB
ℹ dist/seed/index.d.mts                                                           0.82 kB │ gzip:  0.33 kB
ℹ dist/astro/middleware/redirect.d.mts                                            0.72 kB │ gzip:  0.45 kB
ℹ dist/astro/routes/api/import/wordpress-plugin/execute.d.mts                     0.67 kB │ gzip:  0.38 kB
ℹ dist/astro/middleware/setup.d.mts                                               0.67 kB │ gzip:  0.40 kB
ℹ dist/astro/middleware/request-context.d.mts                                     0.64 kB │ gzip:  0.40 kB
ℹ dist/astro/routes/api/import/wordpress/rewrite-urls.d.mts                       0.59 kB │ gzip:  0.33 kB
ℹ dist/astro/routes/api/settings.d.mts                                            0.58 kB │ gzip:  0.33 kB
ℹ dist/db/index.d.mts                                                             0.58 kB │ gzip:  0.27 kB
ℹ dist/astro/routes/api/settings/email.d.mts                                      0.53 kB │ gzip:  0.32 kB
ℹ dist/astro/routes/api/search/index.d.mts                                        0.51 kB │ gzip:  0.31 kB
ℹ dist/astro/routes/api/media/_id_.d.mts                                          0.51 kB │ gzip:  0.28 kB
ℹ dist/object-cache/memory.d.mts                                                  0.50 kB │ gzip:  0.34 kB
ℹ dist/astro/routes/api/import/probe.d.mts                                        0.50 kB │ gzip:  0.30 kB
ℹ dist/astro/routes/api/typegen.d.mts                                             0.49 kB │ gzip:  0.32 kB
ℹ dist/astro/routes/api/admin/api-tokens/index.d.mts                              0.48 kB │ gzip:  0.31 kB
ℹ dist/astro/routes/api/import/wordpress/prepare.d.mts                            0.47 kB │ gzip:  0.27 kB
ℹ dist/astro/routes/api/search/suggest.d.mts                                      0.47 kB │ gzip:  0.30 kB
ℹ dist/astro/routes/api/import/wordpress-plugin/analyze.d.mts                     0.47 kB │ gzip:  0.29 kB
ℹ dist/auth/providers/github.d.mts                                                0.45 kB │ gzip:  0.30 kB
ℹ dist/auth/providers/google.d.mts                                                0.45 kB │ gzip:  0.29 kB
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
ℹ dist/astro/routes/api/comments/_collection_/_contentId_/reactions.d.mts         0.29 kB │ gzip:  0.20 kB
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
ℹ dist/astro/routes/api/content/_collection_/authors.d.mts                        0.24 kB │ gzip:  0.18 kB
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
ℹ dist/astro/image-endpoint.d.mts                                                 0.22 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/schema/index.d.mts                                        0.22 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/manifest.d.mts                                            0.22 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/snapshot.d.mts                                            0.22 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/robots.txt.d.mts                                              0.22 kB │ gzip:  0.17 kB
ℹ dist/astro/routes/api/auth/mode.d.mts                                           0.22 kB │ gzip:  0.17 kB
ℹ dist/cli/index.d.mts                                                            0.01 kB │ gzip:  0.03 kB
ℹ dist/index-Cpz6-8gg.d.mts                                                     179.43 kB │ gzip: 49.47 kB
ℹ dist/byline-fields-CQDFmXjE.d.mts                                              82.12 kB │ gzip:  9.56 kB
ℹ dist/types-DKwtts2d.d.mts                                                      41.82 kB │ gzip: 11.01 kB
ℹ dist/types-xIfVRNLp.d.mts                                                      14.69 kB │ gzip:  3.18 kB
ℹ dist/validate-9ECmtEpJ.d.mts                                                   10.04 kB │ gzip:  3.24 kB
ℹ dist/types-Dbqff978.d.mts                                                       9.78 kB │ gzip:  3.24 kB
ℹ dist/placeholder-Cuce9U-m.d.mts                                                 9.39 kB │ gzip:  3.12 kB
ℹ dist/types-ETmO_jQr.d.mts                                                       7.90 kB │ gzip:  3.04 kB
ℹ dist/index-DGIjmUXQ.d.mts                                                       7.74 kB │ gzip:  2.83 kB
ℹ dist/types-CNlaBFzx.d.mts                                                       6.54 kB │ gzip:  2.02 kB
ℹ dist/options-41nCWqi9.d.mts                                                     6.44 kB │ gzip:  2.43 kB
ℹ dist/types-CvuKO5Pn.d.mts                                                       6.19 kB │ gzip:  2.34 kB
ℹ dist/types-Y09-wtyU.d.mts                                                       5.06 kB │ gzip:  2.19 kB
ℹ dist/types-ByChcBgE.d.mts                                                       5.04 kB │ gzip:  1.78 kB
ℹ dist/adapters-u037EnTR.d.mts                                                    3.21 kB │ gzip:  1.32 kB
ℹ dist/types-BkZ8DUEI.d.mts                                                       2.64 kB │ gzip:  1.17 kB
ℹ dist/runner-BbR3DfrL.d.mts                                                      1.98 kB │ gzip:  0.93 kB
ℹ dist/transport-Blrl2k_o.d.mts                                                   1.67 kB │ gzip:  0.76 kB
ℹ dist/scheduled-publish-BMljtY5G.d.mts                                           0.30 kB │ gzip:  0.22 kB
ℹ 1063 files, total: 7905.09 kB
[33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugins. Here is a breakdown:
  - rolldown-plugin-dts:generate (61%)
  - rolldown-plugin-dts:resolver (29%)
See https://rolldown.rs/options/checks#plugintimings for more details.

✔ Build complete in 7509ms
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
ℹ dist/generated/types/com/emdashcms/experimental/package/releaseExtension.js            8.10 kB │ gzip: 1.10 kB
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
ℹ dist/generated/types/com/emdashcms/experimental/package/releaseExtension.js.map       16.85 kB │ gzip: 2.73 kB
ℹ dist/generated/types/com/emdashcms/experimental/package/release.js.map                11.73 kB │ gzip: 3.21 kB
ℹ dist/generated/types/com/emdashcms/experimental/package/profile.js.map                10.94 kB │ gzip: 2.32 kB
ℹ dist/generated/types/com/emdashcms/experimental/aggregator/defs.js.map                 6.74 kB │ gzip: 1.81 kB
ℹ dist/index.js.map                                                                      6.29 kB │ gzip: 1.85 kB
ℹ dist/generated/types/com/emdashcms/experimental/publisher/profile.js.map               4.96 kB │ gzip: 1.56 kB
ℹ dist/generated/types/com/emdashcms/experimental/aggregator/searchPackages.js.map       3.95 kB │ gzip: 1.27 kB
ℹ dist/generated/types/com/emdashcms/experimental/aggregator/listReleases.js.map         3.40 kB │ gzip: 1.11 kB
ℹ dist/generated/types/com/emdashcms/experimental/package/releaseExtension.d.ts.map      3.37 kB │ gzip: 0.85 kB
ℹ dist/generated/types/com/emdashcms/experimental/publisher/verification.js.map          2.91 kB │ gzip: 1.14 kB
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
ℹ dist/generated/types/com/emdashcms/experimental/package/releaseExtension.d.ts         13.71 kB │ gzip: 2.20 kB
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
ℹ 49 files, total: 169.12 kB
✔ Build complete in 717ms
$ pnpm build
==> pnpm-build-workspace
$ pnpm run --filter {./packages/**} build
Scope: 34 of 66 workspace projects
packages/auth build$ tsdown
packages/blocks build$ tsdown
packages/contentful-to-portable-text build$ tsdown src/index.ts --format esm --dts --clean
packages/create-emdash build$ tsdown
packages/contentful-to-portable-text build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/blocks build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/auth build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/create-emdash build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/contentful-to-portable-text build: ℹ entry: src/index.ts
packages/contentful-to-portable-text build: ℹ tsconfig: tsconfig.json
packages/contentful-to-portable-text build: ℹ Build start
packages/contentful-to-portable-text build: ℹ Cleaning 4 files
packages/blocks build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/blocks/tsdown.config.ts
packages/blocks build: ℹ entry: src/index.ts, src/server.ts
packages/blocks build: ℹ tsconfig: tsconfig.json
packages/blocks build: ℹ Build start
packages/blocks build: ℹ Cleaning 10 files
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
packages/contentful-to-portable-text build: ℹ dist/index.mjs        15.95 kB │ gzip: 4.30 kB
packages/contentful-to-portable-text build: ℹ dist/index.mjs.map    39.25 kB │ gzip: 9.30 kB
packages/contentful-to-portable-text build: ℹ dist/index.d.mts.map   0.66 kB │ gzip: 0.33 kB
packages/contentful-to-portable-text build: ℹ dist/index.d.mts       2.15 kB │ gzip: 0.88 kB
packages/contentful-to-portable-text build: ℹ 4 files, total: 58.01 kB
packages/contentful-to-portable-text build: ✔ Build complete in 900ms
packages/contentful-to-portable-text build: Done
packages/gutenberg-to-portable-text build$ tsdown src/index.ts --format esm --dts --clean
packages/gutenberg-to-portable-text build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/gutenberg-to-portable-text build: ℹ entry: src/index.ts
packages/gutenberg-to-portable-text build: ℹ tsconfig: tsconfig.json
packages/gutenberg-to-portable-text build: ℹ Build start
packages/gutenberg-to-portable-text build: ℹ Cleaning 5 files
packages/create-emdash build: ℹ Granting execute permission to dist/index.mjs
packages/create-emdash build: ℹ dist/index.mjs      20.49 kB │ gzip:  6.60 kB
packages/create-emdash build: ℹ dist/index.mjs.map  39.98 kB │ gzip: 12.21 kB
packages/create-emdash build: ℹ dist/index.d.mts     0.01 kB │ gzip:  0.03 kB
packages/create-emdash build: ℹ 3 files, total: 60.48 kB
packages/create-emdash build: ✔ Build complete in 1149ms
packages/create-emdash build: Done
packages/plugin-types build$ tsdown
packages/plugin-types build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/plugin-types build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugin-types/tsdown.config.ts
packages/plugin-types build: ℹ entry: src/index.ts
packages/plugin-types build: ℹ target: es2023
packages/plugin-types build: ℹ tsconfig: tsconfig.json
packages/plugin-types build: ℹ Build start
packages/plugin-types build: ℹ Cleaning 4 files
packages/gutenberg-to-portable-text build: ℹ dist/index.mjs           43.04 kB │ gzip:  9.98 kB
packages/gutenberg-to-portable-text build: ℹ dist/index.mjs.map       92.72 kB │ gzip: 20.21 kB
packages/gutenberg-to-portable-text build: ℹ dist/index.d.mts.map      3.63 kB │ gzip:  1.02 kB
packages/gutenberg-to-portable-text build: ℹ dist/chunk-DQk6qfdC.mjs   0.38 kB │ gzip:  0.26 kB
packages/gutenberg-to-portable-text build: ℹ dist/index.d.mts         11.56 kB │ gzip:  2.98 kB
packages/gutenberg-to-portable-text build: ℹ 5 files, total: 151.34 kB
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
packages/auth build: ✔ Build complete in 1849ms
packages/gutenberg-to-portable-text build: ✔ Build complete in 831ms
packages/plugin-types build: ℹ dist/index.js         7.69 kB │ gzip: 2.88 kB
packages/plugin-types build: ℹ dist/index.js.map    21.67 kB │ gzip: 7.13 kB
packages/plugin-types build: ℹ dist/index.d.ts.map   1.79 kB │ gzip: 0.72 kB
packages/plugin-types build: ℹ dist/index.d.ts      13.70 kB │ gzip: 4.95 kB
packages/plugin-types build: ℹ 4 files, total: 44.85 kB
packages/plugin-types build: ✔ Build complete in 484ms
packages/gutenberg-to-portable-text build: Done
packages/registry-lexicons build$ pnpm run build:lexicons && pnpm run build:types
packages/plugin-types build: Done
packages/x402 build$ tsdown
packages/auth build: Done
packages/x402 build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/x402 build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/x402/tsdown.config.ts
packages/x402 build: ℹ entry: src/index.ts, src/middleware.ts
packages/x402 build: ℹ tsconfig: tsconfig.json
packages/x402 build: ℹ Build start
packages/x402 build: ℹ Cleaning 10 files
packages/registry-lexicons build: $ node scripts/copy-lexicons.mjs
packages/registry-lexicons build: using in-package lexicon copy at /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-lexicons/lexicons/com/emdashcms/experimental (no source at /home/data/dev_react/awcms-micro/awcmsmicro-dev/lexicons/com/emdashcms/experimental)
packages/registry-lexicons build: $ tsdown
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
packages/blocks build: ✔ Build complete in 2715ms
packages/blocks build: Done
packages/registry-lexicons build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/registry-lexicons build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-lexicons/tsdown.config.ts
packages/registry-lexicons build: ℹ entry: src/index.ts, src/generated/types/com/emdashcms/experimental/aggregator/defs.ts, src/generated/types/com/emdashcms/experimental/aggregator/getLatestRelease.ts, src/generated/types/com/emdashcms/experimental/aggregator/getPackage.ts, src/generated/types/com/emdashcms/experimental/aggregator/listReleases.ts, src/generated/types/com/emdashcms/experimental/aggregator/resolvePackage.ts, src/generated/types/com/emdashcms/experimental/aggregator/searchPackages.ts, src/generated/types/com/emdashcms/experimental/package/profile.ts, src/generated/types/com/emdashcms/experimental/package/release.ts, src/generated/types/com/emdashcms/experimental/package/releaseExtension.ts, src/generated/types/com/emdashcms/experimental/publisher/profile.ts, src/generated/types/com/emdashcms/experimental/publisher/verification.ts
packages/registry-lexicons build: ℹ target: es2023
packages/registry-lexicons build: ℹ tsconfig: tsconfig.json
packages/registry-lexicons build: ℹ Build start
packages/registry-lexicons build: ℹ Cleaning 57 files
packages/x402 build: ℹ dist/middleware.mjs            6.89 kB │ gzip: 2.59 kB
packages/x402 build: ℹ dist/index.mjs                 0.90 kB │ gzip: 0.47 kB
packages/x402 build: ℹ dist/server-BKVUFgbf.mjs.map  12.72 kB │ gzip: 4.15 kB
packages/x402 build: ℹ dist/middleware.mjs.map       12.28 kB │ gzip: 4.30 kB
packages/x402 build: ℹ dist/server-BKVUFgbf.mjs       5.41 kB │ gzip: 2.04 kB
packages/x402 build: ℹ dist/index.mjs.map             3.29 kB │ gzip: 1.36 kB
packages/x402 build: ℹ dist/index.d.mts.map           1.01 kB │ gzip: 0.49 kB
packages/x402 build: ℹ dist/middleware.d.mts.map      0.12 kB │ gzip: 0.12 kB
packages/x402 build: ℹ dist/index.d.mts               4.73 kB │ gzip: 1.83 kB
packages/x402 build: ℹ dist/middleware.d.mts          0.38 kB │ gzip: 0.26 kB
packages/x402 build: ℹ 10 files, total: 47.75 kB
packages/x402 build: ✔ Build complete in 1379ms
packages/x402 build: Done
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/package/releaseExtension.js            8.10 kB │ gzip: 1.10 kB
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
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/package/releaseExtension.js.map       16.85 kB │ gzip: 2.73 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/package/release.js.map                11.73 kB │ gzip: 3.21 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/package/profile.js.map                10.94 kB │ gzip: 2.32 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/aggregator/defs.js.map                 6.74 kB │ gzip: 1.81 kB
packages/registry-lexicons build: ℹ dist/index.js.map                                                                      6.29 kB │ gzip: 1.85 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/publisher/profile.js.map               4.96 kB │ gzip: 1.56 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/aggregator/searchPackages.js.map       3.95 kB │ gzip: 1.27 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/aggregator/listReleases.js.map         3.40 kB │ gzip: 1.11 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/package/releaseExtension.d.ts.map      3.37 kB │ gzip: 0.85 kB
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/publisher/verification.js.map          2.91 kB │ gzip: 1.14 kB
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
packages/registry-lexicons build: ℹ dist/generated/types/com/emdashcms/experimental/package/releaseExtension.d.ts         13.71 kB │ gzip: 2.20 kB
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
packages/registry-lexicons build: ℹ 49 files, total: 169.12 kB
packages/registry-lexicons build: ✔ Build complete in 743ms
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
packages/blocks/playground build: 4:03:34 PM [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
packages/blocks/playground build: `optimizeDeps.rollupOptions` / `ssr.optimizeDeps.rollupOptions` is deprecated. Use `optimizeDeps.rolldownOptions` instead. Note that this option may be set by a plugin. Set VITE_DEPRECATION_TRACE=1 to see where it is called.
packages/blocks/playground build: [vite:react-babel] We recommend switching to `@vitejs/plugin-react-oxc` for improved performance. More information at https://vite.dev/rolldown
packages/blocks/playground build: vite v8.0.16 building client environment for production...
packages/blocks/playground build: [2K
packages/blocks/playground build: transforming...✓ 5238 modules transformed.
packages/blocks/playground build: rendering chunks...
packages/registry-client build: ℹ dist/discovery/index.js           6.51 kB │ gzip:  2.58 kB
packages/registry-client build: ℹ dist/env/index.js                 5.11 kB │ gzip:  2.05 kB
packages/registry-client build: ℹ dist/publishing/index.js          5.04 kB │ gzip:  1.73 kB
packages/registry-client build: ℹ dist/credentials/index.js         1.65 kB │ gzip:  0.73 kB
packages/registry-client build: ℹ dist/index.js                     0.88 kB │ gzip:  0.32 kB
packages/registry-client build: ℹ dist/valid-EldeUiw4.js.map       66.63 kB │ gzip: 16.09 kB
packages/registry-client build: ℹ dist/valid-EldeUiw4.js           33.91 kB │ gzip:  7.33 kB
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
packages/registry-client build: ℹ 26 files, total: 224.38 kB
packages/blocks/playground build: computing gzip size...
packages/registry-client build: ✔ Build complete in 1343ms
packages/registry-client build: Done
packages/blocks/playground build: dist/index.html                     0.39 kB │ gzip:   0.28 kB
packages/blocks/playground build: dist/assets/index-L5u1fiAh.css    145.37 kB │ gzip:  22.80 kB
packages/blocks/playground build: dist/assets/index-CPBRSRwd.js   1,238.78 kB │ gzip: 397.62 kB
packages/blocks/playground build: ✓ built in 1.28s
packages/blocks/playground build: [plugin builtin:vite-reporter]
packages/blocks/playground build: (!) Some chunks are larger than 500 kB after minification. Consider:
packages/blocks/playground build: - Using dynamic import() to code-split the application
packages/blocks/playground build: - Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
packages/blocks/playground build: - Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
packages/blocks/playground build: Done
packages/admin build$ node --run locale:compile && tsdown && node --run locale:copy && npx @tailwindcss/cli -i src/styles.css -o dist/styles.css --minify
packages/plugin-cli build$ node --run gen-schema && tsdown
packages/plugin-cli build: Wrote /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugin-cli/schemas/emdash-plugin.schema.json
packages/plugin-cli build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/admin build: Compiling message catalogs…
packages/plugin-cli build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugin-cli/tsdown.config.ts
packages/plugin-cli build: ℹ entry: src/index.ts
packages/plugin-cli build: ℹ target: node22
packages/plugin-cli build: ℹ tsconfig: tsconfig.json
packages/plugin-cli build: ℹ entry: src/api.ts
packages/plugin-cli build: ℹ target: node22
packages/plugin-cli build: ℹ tsconfig: tsconfig.json
packages/plugin-cli build: ℹ Build start
packages/plugin-cli build: ℹ Cleaning 5 files
packages/admin build: Done in 731ms
packages/admin build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/admin build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tsdown.config.ts
packages/admin build: ℹ entry: src/index.ts, src/locales/index.ts
packages/admin build: ℹ tsconfig: tsconfig.json
packages/admin build: ℹ Build start
packages/admin build: ℹ Cleaning 98 files
packages/plugin-cli build: ℹ Granting execute permission to dist/index.mjs
packages/plugin-cli build: ℹ dist/index.mjs  268.05 kB │ gzip: 82.42 kB
packages/plugin-cli build: ℹ 1 files, total: 268.05 kB
packages/plugin-cli build: ✔ Build complete in 1462ms
packages/plugin-cli build: ℹ dist/api.mjs        105.38 kB │ gzip: 32.65 kB
packages/plugin-cli build: ℹ dist/api.mjs.map    219.48 kB │ gzip: 59.08 kB
packages/plugin-cli build: ℹ dist/api.d.mts.map    3.72 kB │ gzip:  1.30 kB
packages/plugin-cli build: ℹ dist/api.d.mts       18.09 kB │ gzip:  5.83 kB
packages/plugin-cli build: ℹ 4 files, total: 346.67 kB
packages/plugin-cli build: ✔ Build complete in 1495ms
packages/plugin-cli build: Done
packages/admin build: ℹ dist/index.js                                 1308.91 kB
packages/admin build: ℹ dist/locales/index.js                            0.42 kB │ gzip:  0.21 kB
packages/admin build: ℹ dist/index.js.map                             2097.36 kB
packages/admin build: ℹ dist/messages-DBzgje1G.js.map                  156.60 kB │ gzip: 34.28 kB
packages/admin build: ℹ dist/messages-DBzgje1G.js                      139.82 kB │ gzip: 33.31 kB
packages/admin build: ℹ dist/messages-3sesjT8a.js.map                  124.35 kB │ gzip: 33.30 kB
packages/admin build: ℹ dist/messages-8fTMJtWA.js.map                  119.34 kB │ gzip: 33.71 kB
packages/admin build: ℹ dist/messages-CIm8G_NT.js.map                  114.51 kB │ gzip: 33.58 kB
packages/admin build: ℹ dist/messages-BXAjXbUr.js.map                  108.55 kB │ gzip: 32.60 kB
packages/admin build: ℹ dist/messages-3sesjT8a.js                      107.69 kB │ gzip: 32.00 kB
packages/admin build: ℹ dist/messages-Cqpd51ck.js.map                  106.69 kB │ gzip: 32.98 kB
packages/admin build: ℹ dist/messages-DjTHn-jd.js.map                  103.70 kB │ gzip: 31.98 kB
packages/admin build: ℹ dist/messages-umZ9RCq_.js.map                  103.20 kB │ gzip: 32.39 kB
packages/admin build: ℹ dist/messages-8fTMJtWA.js                      102.34 kB │ gzip: 32.61 kB
packages/admin build: ℹ dist/messages-itTyZdsM.js.map                  101.49 kB │ gzip: 31.57 kB
packages/admin build: ℹ dist/messages-BBhuGu6K.js.map                  101.49 kB │ gzip: 32.64 kB
packages/admin build: ℹ dist/messages-BT9Q9atq.js.map                  101.34 kB │ gzip: 31.96 kB
packages/admin build: ℹ dist/messages-DxYrdNN-.js.map                   99.19 kB │ gzip: 32.24 kB
packages/admin build: ℹ dist/messages-KiGKwzQW.js.map                   98.05 kB │ gzip: 32.62 kB
packages/admin build: ℹ dist/messages-CIm8G_NT.js                       97.99 kB │ gzip: 32.52 kB
packages/admin build: ℹ dist/messages-DEC9v1nR.js.map                   97.35 kB │ gzip: 31.66 kB
packages/admin build: ℹ dist/messages-ChEF0PwF.js.map                   96.42 kB │ gzip: 30.45 kB
packages/admin build: ℹ dist/messages-DLzrZh6y.js.map                   92.73 kB │ gzip: 29.09 kB
packages/admin build: ℹ dist/messages-FkTGnwV-.js.map                   92.10 kB │ gzip: 30.15 kB
packages/admin build: ℹ dist/messages-BXAjXbUr.js                       92.02 kB │ gzip: 31.22 kB
packages/admin build: ℹ dist/messages-otHOIv0j.js.map                   91.64 kB │ gzip: 29.40 kB
packages/admin build: ℹ dist/messages-Cl5m9q7M.js.map                   91.64 kB │ gzip: 29.40 kB
packages/admin build: ℹ dist/messages-DOJAmOSK.js.map                   90.81 kB │ gzip: 32.10 kB
packages/admin build: ℹ dist/messages-C6_69h5z.js.map                   90.32 kB │ gzip: 30.61 kB
packages/admin build: ℹ dist/messages-Cqpd51ck.js                       90.08 kB │ gzip: 31.73 kB
packages/admin build: ℹ dist/messages-DjTHn-jd.js                       87.09 kB │ gzip: 30.74 kB
packages/admin build: ℹ dist/messages-umZ9RCq_.js                       86.56 kB │ gzip: 31.00 kB
packages/admin build: ℹ dist/messages-itTyZdsM.js                       84.88 kB │ gzip: 30.20 kB
packages/admin build: ℹ dist/messages-BBhuGu6K.js                       84.81 kB │ gzip: 31.39 kB
packages/admin build: ℹ dist/messages-BT9Q9atq.js                       84.73 kB │ gzip: 30.55 kB
packages/admin build: ℹ dist/messages-DxYrdNN-.js                       82.52 kB │ gzip: 30.89 kB
packages/admin build: ℹ dist/messages-KiGKwzQW.js                       81.13 kB │ gzip: 31.23 kB
packages/admin build: ℹ dist/messages-DEC9v1nR.js                       80.69 kB │ gzip: 30.27 kB
packages/admin build: ℹ dist/messages-ChEF0PwF.js                       79.90 kB │ gzip: 29.09 kB
packages/admin build: ℹ dist/messages-DLzrZh6y.js                       76.55 kB │ gzip: 27.75 kB
packages/admin build: ℹ dist/messages-FkTGnwV-.js                       75.44 kB │ gzip: 28.80 kB
packages/admin build: ℹ dist/messages-otHOIv0j.js                       74.98 kB │ gzip: 28.03 kB
packages/admin build: ℹ dist/messages-Cl5m9q7M.js                       74.98 kB │ gzip: 28.03 kB
packages/admin build: ℹ dist/messages-DOJAmOSK.js                       74.15 kB │ gzip: 30.79 kB
packages/admin build: ℹ dist/messages-C6_69h5z.js                       73.64 kB │ gzip: 29.38 kB
packages/admin build: ℹ dist/index.d.ts.map                             36.15 kB │ gzip:  8.24 kB
packages/admin build: ℹ dist/LocaleDirectionProvider-fvBV6hBt.js.map    15.56 kB │ gzip:  5.34 kB
packages/admin build: ℹ dist/plugins-G9Z9NQ7n.js.map                    11.38 kB │ gzip:  3.80 kB
packages/admin build: ℹ dist/LocaleDirectionProvider-fvBV6hBt.js         9.55 kB │ gzip:  3.30 kB
packages/admin build: ℹ dist/plugins-G9Z9NQ7n.js                         4.21 kB │ gzip:  1.57 kB
packages/admin build: ℹ dist/config-DpQrGzsu.d.ts.map                    0.70 kB │ gzip:  0.38 kB
packages/admin build: ℹ dist/index.d.ts                                132.61 kB │ gzip: 25.74 kB
packages/admin build: ℹ dist/locales/index.d.ts                          0.47 kB │ gzip:  0.23 kB
packages/admin build: ℹ dist/config-DpQrGzsu.d.ts                        2.97 kB │ gzip:  1.25 kB
packages/admin build: ℹ 54 files, total: 7633.77 kB
packages/admin build: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugins. Here is a breakdown:
packages/admin build:   - rolldown-plugin-dts:generate (55%)
packages/admin build:   - tsdown:external (29%)
packages/admin build: See https://rolldown.rs/options/checks#plugintimings for more details.
packages/admin build: ✔ Build complete in 5542ms
packages/admin build: ≈ tailwindcss v4.3.1
packages/admin build: Done in 328ms
packages/admin build: Done
packages/core build$ tsdown
packages/core build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/core build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/core/tsdown.config.ts
packages/core build: ℹ entry: src/index.ts, src/request-context.ts, src/astro/index.ts, src/astro/middleware.ts, src/astro/middleware/setup.ts, src/astro/middleware/auth.ts, src/astro/middleware/redirect.ts, src/astro/middleware/request-context.ts, src/astro/types.ts, src/db/index.ts, src/db/sqlite.ts, src/db/libsql.ts, src/db/postgres.ts, src/database/instrumentation.ts, src/storage/local.ts, src/storage/s3.ts, src/object-cache/memory.ts, src/media/index.ts, src/media/local-runtime.ts, src/media/image-endpoint.ts, src/astro/image-endpoint.ts, src/runtime.ts, src/seed/index.ts, src/cli/index.ts, src/client/index.ts, src/client/cf-access.ts, src/seo/index.ts, src/page/index.ts, src/plugin-utils.ts, src/plugin-types.ts, src/plugins/adapt-sandbox-entry.ts, src/api/route-utils.ts, src/api/schemas/index.ts, src/auth/providers/github.ts, src/auth/providers/google.ts
packages/core build: ℹ tsconfig: tsconfig.json
packages/core build: ℹ Build start
packages/core build: ℹ Cleaning 1159 files
packages/core build: ℹ Granting execute permission to dist/cli/index.mjs
packages/core build: ℹ dist/cli/index.mjs                                                            147.54 kB │ gzip: 37.41 kB
packages/core build: ℹ dist/astro/middleware.mjs                                                     117.50 kB │ gzip: 31.92 kB
packages/core build: ℹ dist/astro/routes/api/openapi.json.mjs                                         90.97 kB │ gzip: 14.48 kB
packages/core build: ℹ dist/astro/routes/api/mcp.mjs                                                  76.69 kB │ gzip: 16.62 kB
packages/core build: ℹ dist/astro/index.mjs                                                           76.48 kB │ gzip: 18.44 kB
packages/core build: ℹ dist/astro/middleware/request-context.mjs                                      41.39 kB │ gzip: 10.38 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/execute.mjs                             26.61 kB │ gzip:  8.25 kB
packages/core build: ℹ dist/astro/middleware/auth.mjs                                                 21.94 kB │ gzip:  6.06 kB
packages/core build: ℹ dist/page/index.mjs                                                            13.84 kB │ gzip:  4.09 kB
packages/core build: ℹ dist/client/index.mjs                                                          13.07 kB │ gzip:  3.55 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/registry/artifact.mjs                      12.85 kB │ gzip:  4.60 kB
packages/core build: ℹ dist/astro/routes/api/oauth/authorize.mjs                                      11.85 kB │ gzip:  3.50 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/analyze.mjs                              9.96 kB │ gzip:  3.36 kB
packages/core build: ℹ dist/astro/routes/api/snapshot.mjs                                              9.42 kB │ gzip:  3.62 kB
packages/core build: ℹ dist/index.mjs                                                                  9.40 kB │ gzip:  2.81 kB
packages/core build: ℹ dist/api/schemas/index.mjs                                                      8.51 kB │ gzip:  2.00 kB
packages/core build: ℹ dist/astro/routes/api/comments/_collection_/_contentId_/index.mjs               8.47 kB │ gzip:  2.62 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress-plugin/execute.mjs                       8.37 kB │ gzip:  2.81 kB
packages/core build: ℹ dist/storage/s3.mjs                                                             7.78 kB │ gzip:  2.79 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/media.mjs                                6.89 kB │ gzip:  2.22 kB
packages/core build: ℹ dist/astro/routes/api/comments/_collection_/_contentId_/reactions.mjs           6.25 kB │ gzip:  2.01 kB
packages/core build: ℹ dist/plugins/adapt-sandbox-entry.mjs                                            6.05 kB │ gzip:  2.25 kB
packages/core build: ℹ dist/media/image-endpoint.mjs                                                   5.81 kB │ gzip:  2.62 kB
packages/core build: ℹ dist/astro/routes/api/media.mjs                                                 5.78 kB │ gzip:  2.14 kB
packages/core build: ℹ dist/astro/routes/api/auth/oauth/_provider_/callback.mjs                        5.73 kB │ gzip:  2.02 kB
packages/core build: ℹ dist/client/cf-access.mjs                                                       5.69 kB │ gzip:  2.17 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/rewrite-urls.mjs                         5.60 kB │ gzip:  1.83 kB
packages/core build: ℹ dist/storage/local.mjs                                                          5.56 kB │ gzip:  2.04 kB
packages/core build: ℹ dist/astro/routes/sitemap-_collection_.xml.mjs                                  5.49 kB │ gzip:  1.99 kB
packages/core build: ℹ dist/astro/routes/api/setup/dev-bypass.mjs                                      5.42 kB │ gzip:  2.11 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_.mjs                             5.23 kB │ gzip:  1.48 kB
packages/core build: ℹ dist/astro/routes/api/oauth/token.mjs                                           4.98 kB │ gzip:  1.68 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs            4.71 kB │ gzip:  1.51 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/rewrite-url-helpers.mjs                  4.64 kB │ gzip:  1.71 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/registry/install.mjs                        4.61 kB │ gzip:  1.78 kB
packages/core build: ℹ dist/media/local-runtime.mjs                                                    4.51 kB │ gzip:  1.32 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/registry/_id_/update.mjs                    4.49 kB │ gzip:  1.64 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/_id_/index.mjs                                4.42 kB │ gzip:  1.47 kB
packages/core build: ℹ dist/astro/routes/api/oauth/register.mjs                                        4.42 kB │ gzip:  1.65 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/prepare.mjs                              4.39 kB │ gzip:  1.63 kB
packages/core build: ℹ dist/astro/routes/api/media/_id_/confirm.mjs                                    4.34 kB │ gzip:  1.80 kB
packages/core build: ℹ dist/astro/routes/api/settings/email.mjs                                        4.32 kB │ gzip:  1.71 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/_slug_/index.mjs                       4.02 kB │ gzip:  1.21 kB
packages/core build: ℹ dist/astro/routes/api/setup/index.mjs                                           3.95 kB │ gzip:  1.48 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs          3.94 kB │ gzip:  1.10 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/install.mjs                3.80 kB │ gzip:  1.37 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/_name_/widgets/_id_.mjs                      3.75 kB │ gzip:  1.14 kB
packages/core build: ℹ dist/astro/routes/api/setup/admin-verify.mjs                                    3.73 kB │ gzip:  1.42 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/_id_/status.mjs                            3.64 kB │ gzip:  1.35 kB
packages/core build: ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_/translations.mjs           3.63 kB │ gzip:  1.17 kB
packages/core build: ℹ dist/astro/routes/api/media/upload-url.mjs                                      3.58 kB │ gzip:  1.48 kB
packages/core build: ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_.mjs                        3.57 kB │ gzip:  1.01 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/register/verify.mjs                          3.57 kB │ gzip:  1.36 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/update.mjs                             3.50 kB │ gzip:  1.26 kB
packages/core build: ℹ dist/astro/routes/api/media/_id_.mjs                                            3.47 kB │ gzip:  1.05 kB
packages/core build: ℹ dist/astro/middleware/redirect.mjs                                              3.45 kB │ gzip:  1.38 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/_slug_/fields/index.mjs                3.41 kB │ gzip:  1.06 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/schedule.mjs                    3.39 kB │ gzip:  1.05 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/updates.mjs                                 3.34 kB │ gzip:  1.19 kB
packages/core build: ℹ dist/database/instrumentation.mjs                                               3.34 kB │ gzip:  1.61 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/registry/_id_/uninstall.mjs                 3.32 kB │ gzip:  1.16 kB
packages/core build: ℹ dist/astro/routes/api/admin/bylines/_id_/index.mjs                              3.31 kB │ gzip:  1.13 kB
packages/core build: ℹ dist/astro/routes/api/admin/bylines/index.mjs                                   3.31 kB │ gzip:  1.25 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/preview-url.mjs                 3.29 kB │ gzip:  1.35 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/enable.mjs                             3.21 kB │ gzip:  1.16 kB
packages/core build: ℹ dist/astro/routes/api/admin/themes/marketplace/index.mjs                        3.19 kB │ gzip:  1.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/uninstall.mjs                          3.19 kB │ gzip:  1.16 kB
packages/core build: ℹ dist/astro/routes/api/admin/bylines/_id_/translations.mjs                       3.19 kB │ gzip:  1.18 kB
packages/core build: ℹ dist/astro/routes/api/media/providers/_providerId_/index.mjs                    3.15 kB │ gzip:  1.14 kB
packages/core build: ℹ dist/astro/routes/api/setup/admin.mjs                                           3.12 kB │ gzip:  1.25 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/index.mjs                              3.11 kB │ gzip:  1.05 kB
packages/core build: ℹ dist/astro/routes/api/plugins/_pluginId_/_...path_.mjs                          3.09 kB │ gzip:  1.37 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/index.mjs                            3.08 kB │ gzip:  1.15 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/_slug_/fields/reorder.mjs              3.05 kB │ gzip:  1.02 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/disable.mjs                            3.04 kB │ gzip:  1.10 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/marketplace/index.mjs                       3.01 kB │ gzip:  1.09 kB
packages/core build: ℹ dist/astro/routes/api/auth/oauth/_provider_.mjs                                 3.00 kB │ gzip:  1.17 kB
packages/core build: ℹ dist/astro/routes/api/admin/oauth-clients/_id_.mjs                              3.00 kB │ gzip:  0.97 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/publish.mjs                     2.93 kB │ gzip:  1.19 kB
packages/core build: ℹ dist/astro/routes/api/admin/allowed-domains/_domain_.mjs                        2.90 kB │ gzip:  1.00 kB
packages/core build: ℹ dist/astro/routes/api/schema/orphans/_slug_.mjs                                 2.89 kB │ gzip:  1.07 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/index.mjs                  2.88 kB │ gzip:  1.01 kB
packages/core build: ℹ dist/astro/routes/api/admin/themes/marketplace/_id_/index.mjs                   2.87 kB │ gzip:  1.01 kB
packages/core build: ℹ dist/astro/routes/api/redirects/_id_.mjs                                        2.84 kB │ gzip:  0.85 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/_id_.mjs                                     2.83 kB │ gzip:  1.00 kB
packages/core build: ℹ dist/astro/routes/api/auth/signup/complete.mjs                                  2.83 kB │ gzip:  1.17 kB
packages/core build: ℹ dist/astro/routes/api/admin/allowed-domains/index.mjs                           2.81 kB │ gzip:  1.07 kB
packages/core build: ℹ dist/astro/routes/api/auth/invite/complete.mjs                                  2.80 kB │ gzip:  1.15 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/index.mjs                              2.80 kB │ gzip:  1.02 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_/translations.mjs                             2.80 kB │ gzip:  0.98 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress-plugin/analyze.mjs                       2.76 kB │ gzip:  1.16 kB
packages/core build: ℹ dist/astro/routes/api/auth/dev-bypass.mjs                                       2.72 kB │ gzip:  1.26 kB
packages/core build: ℹ dist/astro/routes/api/taxonomies/_name_/terms/index.mjs                         2.67 kB │ gzip:  0.95 kB
packages/core build: ℹ dist/astro/routes/api/typegen.mjs                                               2.66 kB │ gzip:  1.06 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/options.mjs                                  2.65 kB │ gzip:  1.09 kB
packages/core build: ℹ dist/plugin-utils.mjs                                                           2.63 kB │ gzip:  1.21 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/register/options.mjs                         2.63 kB │ gzip:  1.07 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/index.mjs                                    2.62 kB │ gzip:  1.04 kB
packages/core build: ℹ dist/astro/routes/api/sections/_slug_.mjs                                       2.62 kB │ gzip:  0.80 kB
packages/core build: ℹ dist/astro/routes/api/schema/index.mjs                                          2.59 kB │ gzip:  1.15 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/index.mjs                                   2.56 kB │ gzip:  0.97 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_.mjs                                          2.54 kB │ gzip:  0.80 kB
packages/core build: ℹ dist/astro/routes/api/redirects/404s/index.mjs                                  2.52 kB │ gzip:  0.82 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/verify.mjs                                   2.51 kB │ gzip:  1.03 kB
packages/core build: ℹ dist/astro/routes/sitemap.xml.mjs                                               2.48 kB │ gzip:  1.13 kB
packages/core build: ℹ dist/astro/routes/api/schema/orphans/index.mjs                                  2.47 kB │ gzip:  0.90 kB
packages/core build: ℹ dist/astro/routes/api/auth/magic-link/send.mjs                                  2.45 kB │ gzip:  1.00 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/_name_/widgets.mjs                           2.45 kB │ gzip:  1.06 kB
packages/core build: ℹ dist/astro/routes/api/admin/byline-fields/_slug_.mjs                            2.41 kB │ gzip:  0.76 kB
packages/core build: ℹ dist/astro/routes/api/settings.mjs                                              2.40 kB │ gzip:  0.96 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_/items/_id_.mjs                               2.39 kB │ gzip:  0.82 kB
packages/core build: ℹ dist/astro/routes/api/setup/status.mjs                                          2.39 kB │ gzip:  1.03 kB
packages/core build: ℹ dist/astro/routes/api/auth/invite/index.mjs                                     2.36 kB │ gzip:  1.08 kB
packages/core build: ℹ dist/astro/routes/api/admin/hooks/exclusive/_hookName_.mjs                      2.36 kB │ gzip:  1.04 kB
packages/core build: ℹ dist/astro/routes/api/auth/invite/register-options.mjs                          2.36 kB │ gzip:  1.02 kB
packages/core build: ℹ dist/astro/routes/api/media/providers/_providerId_/_itemId_.mjs                 2.36 kB │ gzip:  0.78 kB
packages/core build: ℹ dist/astro/routes/api/taxonomies/index.mjs                                      2.36 kB │ gzip:  0.89 kB
packages/core build: ℹ dist/astro/routes/api/auth/signup/request.mjs                                   2.32 kB │ gzip:  1.00 kB
packages/core build: ℹ dist/seo/index.mjs                                                              2.25 kB │ gzip:  0.95 kB
packages/core build: ℹ dist/astro/routes/api/admin/oauth-clients/index.mjs                             2.20 kB │ gzip:  0.91 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/_name_.mjs                                   2.19 kB │ gzip:  0.81 kB
packages/core build: ℹ dist/astro/routes/api/themes/preview.mjs                                        2.19 kB │ gzip:  1.00 kB
packages/core build: ℹ dist/astro/routes/api/search/rebuild.mjs                                        2.19 kB │ gzip:  0.94 kB
packages/core build: ℹ dist/astro/routes/api/redirects/index.mjs                                       2.17 kB │ gzip:  0.80 kB
packages/core build: ℹ dist/astro/routes/api/admin/api-tokens/index.mjs                                2.13 kB │ gzip:  0.93 kB
packages/core build: ℹ dist/astro/image-endpoint.mjs                                                   2.06 kB │ gzip:  0.91 kB
packages/core build: ℹ dist/astro/routes/api/search/index.mjs                                          2.05 kB │ gzip:  0.97 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/index.mjs                                     2.04 kB │ gzip:  0.96 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/_id_/send-recovery.mjs                        2.03 kB │ gzip:  0.96 kB
packages/core build: ℹ dist/astro/routes/api/search/enable.mjs                                         2.02 kB │ gzip:  0.89 kB
packages/core build: ℹ dist/astro/routes/api/oauth/device/token.mjs                                    2.01 kB │ gzip:  0.94 kB
packages/core build: ℹ dist/astro/routes/api/sections/index.mjs                                        1.98 kB │ gzip:  0.75 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/_name_/reorder.mjs                           1.97 kB │ gzip:  0.89 kB
packages/core build: ℹ dist/astro/routes/api/manifest.mjs                                              1.97 kB │ gzip:  0.93 kB
packages/core build: ℹ dist/astro/routes/robots.txt.mjs                                                1.96 kB │ gzip:  0.87 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/_id_/disable.mjs                              1.96 kB │ gzip:  0.90 kB
packages/core build: ℹ dist/astro/middleware/setup.mjs                                                 1.86 kB │ gzip:  0.86 kB
packages/core build: ℹ dist/api/route-utils.mjs                                                        1.86 kB │ gzip:  0.88 kB
packages/core build: ℹ dist/astro/routes/api/media/file/_...key_.mjs                                   1.84 kB │ gzip:  0.95 kB
packages/core build: ℹ dist/astro/routes/api/auth/me.mjs                                               1.82 kB │ gzip:  0.85 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/duplicate.mjs                   1.81 kB │ gzip:  0.77 kB
packages/core build: ℹ dist/astro/routes/api/oauth/device/code.mjs                                     1.80 kB │ gzip:  0.84 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/_id_.mjs                                   1.80 kB │ gzip:  0.69 kB
packages/core build: ℹ dist/astro/routes/api/menus/index.mjs                                           1.79 kB │ gzip:  0.73 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/discard-draft.mjs               1.78 kB │ gzip:  0.77 kB
packages/core build: ℹ dist/request-context.mjs                                                        1.77 kB │ gzip:  0.90 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/unpublish.mjs                   1.77 kB │ gzip:  0.76 kB
packages/core build: ℹ dist/astro/routes/api/admin/byline-fields/index.mjs                             1.77 kB │ gzip:  0.68 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/restore.mjs                     1.72 kB │ gzip:  0.74 kB
packages/core build: ℹ dist/astro/routes/api/search/suggest.mjs                                        1.72 kB │ gzip:  0.84 kB
packages/core build: ℹ dist/astro/routes/api/auth/magic-link/verify.mjs                                1.65 kB │ gzip:  0.71 kB
packages/core build: ℹ dist/astro/routes/api/revisions/_revisionId_/restore.mjs                        1.64 kB │ gzip:  0.70 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/index.mjs                                  1.62 kB │ gzip:  0.73 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/bulk.mjs                                   1.62 kB │ gzip:  0.71 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/translations.mjs                1.58 kB │ gzip:  0.77 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_/reorder.mjs                                  1.58 kB │ gzip:  0.72 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_/items.mjs                                    1.57 kB │ gzip:  0.72 kB
packages/core build: ℹ dist/astro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs               1.56 kB │ gzip:  0.76 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/icon.mjs                   1.54 kB │ gzip:  0.74 kB
packages/core build: ℹ dist/object-cache/memory.mjs                                                    1.52 kB │ gzip:  0.72 kB
packages/core build: ℹ dist/astro/routes/api/redirects/404s/summary.mjs                                1.50 kB │ gzip:  0.68 kB
packages/core build: ℹ dist/astro/routes/api/admin/hooks/exclusive/index.mjs                           1.45 kB │ gzip:  0.72 kB
packages/core build: ℹ dist/astro/routes/api/import/probe.mjs                                          1.42 kB │ gzip:  0.68 kB
packages/core build: ℹ dist/astro/routes/api/well-known/auth.mjs                                       1.37 kB │ gzip:  0.66 kB
packages/core build: ℹ dist/astro/routes/api/oauth/device/authorize.mjs                                1.34 kB │ gzip:  0.69 kB
packages/core build: ℹ dist/astro/routes/api/auth/signup/verify.mjs                                    1.32 kB │ gzip:  0.71 kB
packages/core build: ℹ dist/runtime.mjs                                                                1.32 kB │ gzip:  0.64 kB
packages/core build: ℹ dist/media/index.mjs                                                            1.29 kB │ gzip:  0.63 kB
packages/core build: ℹ dist/astro/routes/api/admin/byline-fields/reorder.mjs                           1.28 kB │ gzip:  0.57 kB
packages/core build: ℹ dist/astro/routes/api/auth/invite/accept.mjs                                    1.28 kB │ gzip:  0.68 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/_id_/enable.mjs                               1.28 kB │ gzip:  0.67 kB
packages/core build: ℹ dist/astro/routes/api/admin/api-tokens/_id_.mjs                                 1.24 kB │ gzip:  0.66 kB
packages/core build: ℹ dist/db/index.mjs                                                               1.22 kB │ gzip:  0.56 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/trash.mjs                            1.22 kB │ gzip:  0.59 kB
packages/core build: ℹ dist/astro/routes/api/oauth/token/refresh.mjs                                   1.19 kB │ gzip:  0.62 kB
packages/core build: ℹ dist/astro/routes/api/well-known/oauth-authorization-server.mjs                 1.18 kB │ gzip:  0.59 kB
packages/core build: ℹ dist/astro/routes/api/oauth/token/revoke.mjs                                    1.14 kB │ gzip:  0.60 kB
packages/core build: ℹ dist/astro/routes/api/dashboard.mjs                                             1.07 kB │ gzip:  0.56 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/index.mjs                                    1.07 kB │ gzip:  0.60 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/counts.mjs                                 1.04 kB │ gzip:  0.53 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/revisions.mjs                   1.04 kB │ gzip:  0.56 kB
packages/core build: ℹ dist/astro/routes/api/search/stats.mjs                                          1.03 kB │ gzip:  0.56 kB
packages/core build: ℹ dist/seed/index.mjs                                                             1.03 kB │ gzip:  0.46 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/permanent.mjs                   1.02 kB │ gzip:  0.53 kB
packages/core build: ℹ dist/astro/routes/api/setup/dev-reset.mjs                                       1.01 kB │ gzip:  0.56 kB
packages/core build: ℹ dist/astro/routes/api/admin/byline-fields/_slug_/usage.mjs                      0.99 kB │ gzip:  0.51 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress-plugin/callback.mjs                      0.97 kB │ gzip:  0.53 kB
packages/core build: ℹ dist/astro/routes/api/auth/mode.mjs                                             0.94 kB │ gzip:  0.56 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/compare.mjs                     0.84 kB │ gzip:  0.47 kB
packages/core build: ℹ dist/astro/routes/api/dev/emails.mjs                                            0.83 kB │ gzip:  0.41 kB
packages/core build: ℹ dist/astro/routes/api/auth/logout.mjs                                           0.81 kB │ gzip:  0.47 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/authors.mjs                          0.80 kB │ gzip:  0.45 kB
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
packages/core build: ℹ dist/api-BjvcjbbA.mjs.map                                                     320.59 kB │ gzip: 69.82 kB
packages/core build: ℹ dist/cli/index.mjs.map                                                        293.01 kB │ gzip: 67.88 kB
packages/core build: ℹ dist/runner-DH_2MI_9.mjs.map                                                  289.45 kB │ gzip: 54.22 kB
packages/core build: ℹ dist/astro/middleware.mjs.map                                                 263.83 kB │ gzip: 69.65 kB
packages/core build: ℹ dist/menus-DagBF7aa.mjs.map                                                   204.64 kB │ gzip: 46.97 kB
packages/core build: ℹ dist/astro/routes/api/openapi.json.mjs.map                                    171.47 kB │ gzip: 23.66 kB
packages/core build: ℹ dist/astro/index.mjs.map                                                      165.72 kB │ gzip: 40.82 kB
packages/core build: ℹ dist/runner-DH_2MI_9.mjs                                                      155.31 kB │ gzip: 29.74 kB
packages/core build: ℹ dist/api-BjvcjbbA.mjs                                                         152.07 kB │ gzip: 34.77 kB
packages/core build: ℹ dist/astro/routes/api/mcp.mjs.map                                             141.48 kB │ gzip: 26.81 kB
packages/core build: ℹ dist/import-Bb1T9WJS.mjs.map                                                  112.07 kB │ gzip: 25.69 kB
packages/core build: ℹ dist/redirects-Dcbuisoj.mjs.map                                               101.22 kB │ gzip: 17.53 kB
packages/core build: ℹ dist/menus-DagBF7aa.mjs                                                        95.82 kB │ gzip: 22.93 kB
packages/core build: ℹ dist/content-DoedtINi.mjs.map                                                  73.89 kB │ gzip: 16.89 kB
packages/core build: ℹ dist/byline-BRsQgaMb.mjs.map                                                   72.26 kB │ gzip: 18.47 kB
packages/core build: ℹ dist/context-i9zkOXT1.mjs.map                                                  71.02 kB │ gzip: 17.11 kB
packages/core build: ℹ dist/query-Cb_9xruO.mjs.map                                                    70.32 kB │ gzip: 20.76 kB
packages/core build: ℹ dist/apply-BKAgynWq.mjs.map                                                    66.86 kB │ gzip: 17.16 kB
packages/core build: ℹ dist/loader-DiVLEHUQ.mjs.map                                                   65.45 kB │ gzip: 19.18 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/execute.mjs.map                         59.52 kB │ gzip: 17.63 kB
packages/core build: ℹ dist/registry-BTHvnidp.mjs.map                                                 56.50 kB │ gzip: 13.73 kB
packages/core build: ℹ dist/menus-DBLT6biX.mjs.map                                                    51.44 kB │ gzip: 12.16 kB
packages/core build: ℹ dist/astro/middleware/request-context.mjs.map                                  49.54 kB │ gzip: 12.52 kB
packages/core build: ℹ dist/redirects-Dcbuisoj.mjs                                                    48.94 kB │ gzip:  9.94 kB
packages/core build: ℹ dist/import-Bb1T9WJS.mjs                                                       48.70 kB │ gzip: 11.84 kB
packages/core build: ℹ dist/astro/middleware/auth.mjs.map                                             44.92 kB │ gzip: 12.45 kB
packages/core build: ℹ dist/taxonomies-CP6BTAVo.mjs.map                                               40.89 kB │ gzip: 11.22 kB
packages/core build: ℹ dist/index-BKnKlPqM.d.mts.map                                                  40.06 kB │ gzip: 11.03 kB
packages/core build: ℹ dist/byline-BRsQgaMb.mjs                                                       38.21 kB │ gzip: 10.25 kB
packages/core build: ℹ dist/content-DoedtINi.mjs                                                      37.26 kB │ gzip:  9.09 kB
packages/core build: ℹ dist/taxonomies-DiEnl8Yj.mjs.map                                               36.46 kB │ gzip:  8.73 kB
packages/core build: ℹ dist/validate-DNOAL_Fm.mjs.map                                                 35.48 kB │ gzip:  7.73 kB
packages/core build: ℹ dist/byline-registry-BOjqDOim.mjs.map                                          33.30 kB │ gzip:  9.67 kB
packages/core build: ℹ dist/client/index.mjs.map                                                      33.25 kB │ gzip:  7.97 kB
packages/core build: ℹ dist/redirects-DctmKGXI.mjs.map                                                33.20 kB │ gzip:  8.44 kB
packages/core build: ℹ dist/apply-BKAgynWq.mjs                                                        32.73 kB │ gzip:  8.28 kB
packages/core build: ℹ dist/page/index.mjs.map                                                        31.64 kB │ gzip:  8.67 kB
packages/core build: ℹ dist/query-Cb_9xruO.mjs                                                        31.35 kB │ gzip:  9.65 kB
packages/core build: ℹ dist/loader-DiVLEHUQ.mjs                                                       31.26 kB │ gzip:  9.60 kB
packages/core build: ℹ dist/context-i9zkOXT1.mjs                                                      30.33 kB │ gzip:  8.11 kB
packages/core build: ℹ dist/device-flow-DENDCQ9F.mjs.map                                              29.83 kB │ gzip:  7.18 kB
packages/core build: ℹ dist/registry-BTHvnidp.mjs                                                     28.18 kB │ gzip:  7.18 kB
packages/core build: ℹ dist/object-cache-CHbHv83-.mjs.map                                             27.68 kB │ gzip:  9.48 kB
packages/core build: ℹ dist/error-DNHeDYPh.mjs.map                                                    27.64 kB │ gzip:  6.56 kB
packages/core build: ℹ dist/search-C7XY71qe.mjs.map                                                   26.64 kB │ gzip:  8.22 kB
packages/core build: ℹ dist/redirect-B2I1L2Qs.mjs.map                                                 26.36 kB │ gzip:  6.98 kB
packages/core build: ℹ dist/secrets-BSf9pRRY.mjs.map                                                  25.68 kB │ gzip:  8.77 kB
packages/core build: ℹ dist/fts-manager-4RwEG1Bi.mjs.map                                              24.82 kB │ gzip:  6.62 kB
packages/core build: ℹ dist/taxonomy-DF5mNlo5.mjs.map                                                 24.65 kB │ gzip:  6.36 kB
packages/core build: ℹ dist/menus-DBLT6biX.mjs                                                        23.72 kB │ gzip:  6.00 kB
packages/core build: ℹ dist/ssrf-BRKb343l.mjs.map                                                     23.59 kB │ gzip:  8.30 kB
packages/core build: ℹ dist/astro/routes/api/oauth/authorize.mjs.map                                  22.43 kB │ gzip:  6.46 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/analyze.mjs.map                         22.30 kB │ gzip:  6.90 kB
packages/core build: ℹ dist/zod-generator-D-Z7uBCM.mjs.map                                            21.76 kB │ gzip:  6.71 kB
packages/core build: ℹ dist/taxonomies-CP6BTAVo.mjs                                                   21.38 kB │ gzip:  5.81 kB
packages/core build: ℹ dist/comment-CIyZkO-O.mjs.map                                                  20.99 kB │ gzip:  4.99 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/registry/artifact.mjs.map                  20.68 kB │ gzip:  7.13 kB
packages/core build: ℹ dist/astro/routes/api/snapshot.mjs.map                                         19.96 kB │ gzip:  6.78 kB
packages/core build: ℹ dist/sections-BfDrU7Mf.mjs.map                                                 19.39 kB │ gzip:  4.78 kB
packages/core build: ℹ dist/byline-fields-eyJMblSr.mjs.map                                            19.35 kB │ gzip:  4.77 kB
packages/core build: ℹ dist/bylines-QIC7qsUk.mjs.map                                                  18.64 kB │ gzip:  6.11 kB
packages/core build: ℹ dist/byline-registry-BOjqDOim.mjs                                              18.31 kB │ gzip:  5.89 kB
packages/core build: ℹ dist/oauth-authorization-CsvzIp_F.mjs.map                                      17.99 kB │ gzip:  4.89 kB
packages/core build: ℹ dist/types-DKwtts2d.d.mts.map                                                  17.62 kB │ gzip:  4.76 kB
packages/core build: ℹ dist/cron-C5LVoNmP.mjs.map                                                     17.49 kB │ gzip:  5.76 kB
packages/core build: ℹ dist/error-DNHeDYPh.mjs                                                        17.42 kB │ gzip:  4.24 kB
packages/core build: ℹ dist/validate-DNOAL_Fm.mjs                                                     17.06 kB │ gzip:  3.83 kB
packages/core build: ℹ dist/portable-text-BICg8bTk.mjs.map                                            17.04 kB │ gzip:  4.72 kB
packages/core build: ℹ dist/utils-B7A57fm9.mjs.map                                                    16.93 kB │ gzip:  5.01 kB
packages/core build: ℹ dist/media-D6UwDm00.mjs.map                                                    16.93 kB │ gzip:  5.05 kB
packages/core build: ℹ dist/manifest-schema-kPGX7VS-.mjs.map                                          16.76 kB │ gzip:  4.71 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress-plugin/execute.mjs.map                  16.41 kB │ gzip:  5.34 kB
packages/core build: ℹ dist/redirects-DctmKGXI.mjs                                                    16.27 kB │ gzip:  4.35 kB
packages/core build: ℹ dist/settings-8LHCxR9S.mjs.map                                                 16.18 kB │ gzip:  5.23 kB
packages/core build: ℹ dist/astro/routes/api/comments/_collection_/_contentId_/index.mjs.map          15.95 kB │ gzip:  4.89 kB
packages/core build: ℹ dist/taxonomies-DiEnl8Yj.mjs                                                   15.83 kB │ gzip:  3.87 kB
packages/core build: ℹ dist/oauth-clients-C9SYwEbZ.mjs.map                                            15.58 kB │ gzip:  3.61 kB
packages/core build: ℹ dist/storage/s3.mjs.map                                                        15.38 kB │ gzip:  5.03 kB
packages/core build: ℹ dist/plugins/adapt-sandbox-entry.mjs.map                                       15.31 kB │ gzip:  5.33 kB
packages/core build: ℹ dist/device-flow-DENDCQ9F.mjs                                                  14.86 kB │ gzip:  3.83 kB
packages/core build: ℹ dist/service-DZi0B1XO.mjs.map                                                  14.62 kB │ gzip:  4.39 kB
packages/core build: ℹ dist/object-cache-CHbHv83-.mjs                                                 14.57 kB │ gzip:  5.36 kB
packages/core build: ℹ dist/secrets-BSf9pRRY.mjs                                                      14.41 kB │ gzip:  5.42 kB
packages/core build: ℹ dist/fts-manager-4RwEG1Bi.mjs                                                  13.79 kB │ gzip:  3.92 kB
packages/core build: ℹ dist/types-tM44hEcf.mjs.map                                                    13.39 kB │ gzip:  4.02 kB
packages/core build: ℹ dist/comments-EfE1-H-U.mjs.map                                                 13.34 kB │ gzip:  3.37 kB
packages/core build: ℹ dist/search-C7XY71qe.mjs                                                       13.27 kB │ gzip:  4.33 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/media.mjs.map                           13.14 kB │ gzip:  3.98 kB
packages/core build: ℹ dist/enrich-BQ0mxJRs.mjs.map                                                   13.08 kB │ gzip:  4.66 kB
packages/core build: ℹ dist/bylines-BQlQokM0.mjs.map                                                  13.08 kB │ gzip:  4.32 kB
packages/core build: ℹ dist/taxonomy-DF5mNlo5.mjs                                                     12.86 kB │ gzip:  3.56 kB
packages/core build: ℹ dist/ssrf-BRKb343l.mjs                                                         12.75 kB │ gzip:  5.03 kB
packages/core build: ℹ dist/astro/routes/api/comments/_collection_/_contentId_/reactions.mjs.map      12.08 kB │ gzip:  3.84 kB
packages/core build: ℹ dist/redirect-B2I1L2Qs.mjs                                                     12.07 kB │ gzip:  3.71 kB
packages/core build: ℹ dist/user-B4y-aRCH.mjs.map                                                     11.54 kB │ gzip:  3.64 kB
packages/core build: ℹ dist/normalize-CeglrBT9.mjs.map                                                11.49 kB │ gzip:  3.40 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/rewrite-urls.mjs.map                    11.45 kB │ gzip:  3.70 kB
packages/core build: ℹ dist/types-BDNJow_f.mjs.map                                                    11.38 kB │ gzip:  4.26 kB
packages/core build: ℹ dist/astro/routes/api/auth/oauth/_provider_/callback.mjs.map                   11.29 kB │ gzip:  3.77 kB
packages/core build: ℹ dist/storage/local.mjs.map                                                     11.26 kB │ gzip:  3.76 kB
packages/core build: ℹ dist/astro/routes/sitemap-_collection_.xml.mjs.map                             11.15 kB │ gzip:  3.90 kB
packages/core build: ℹ dist/validation-BTRcg5uD.mjs.map                                               11.09 kB │ gzip:  4.18 kB
packages/core build: ℹ dist/byline-fields-eyJMblSr.mjs                                                10.44 kB │ gzip:  3.04 kB
packages/core build: ℹ dist/astro/routes/api/media.mjs.map                                            10.43 kB │ gzip:  3.69 kB
packages/core build: ℹ dist/media/local-runtime.mjs.map                                               10.41 kB │ gzip:  3.18 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_.mjs.map                        10.36 kB │ gzip:  2.77 kB
packages/core build: ℹ dist/tokens-LeuXF9gG.mjs.map                                                   10.30 kB │ gzip:  3.28 kB
packages/core build: ℹ dist/astro/routes/api/oauth/token.mjs.map                                      10.07 kB │ gzip:  3.04 kB
packages/core build: ℹ dist/zod-generator-D-Z7uBCM.mjs                                                 9.98 kB │ gzip:  3.21 kB
packages/core build: ℹ dist/field-defs-cache-CaPy3177.mjs.map                                          9.76 kB │ gzip:  3.92 kB
packages/core build: ℹ dist/single-flight-cache-Cdfkic3t.mjs.map                                       9.65 kB │ gzip:  3.88 kB
packages/core build: ℹ dist/cron-C5LVoNmP.mjs                                                          9.56 kB │ gzip:  3.49 kB
packages/core build: ℹ dist/comment-CIyZkO-O.mjs                                                       9.49 kB │ gzip:  2.56 kB
packages/core build: ℹ dist/media/index.mjs.map                                                        9.47 kB │ gzip:  3.04 kB
packages/core build: ℹ dist/astro/routes/api/setup/dev-bypass.mjs.map                                  9.43 kB │ gzip:  3.57 kB
packages/core build: ℹ dist/seo-4f_H0FIw.mjs.map                                                       9.39 kB │ gzip:  3.12 kB
packages/core build: ℹ dist/sections-BfDrU7Mf.mjs                                                      9.34 kB │ gzip:  2.47 kB
packages/core build: ℹ dist/api-tokens-D6ppjIVi.mjs.map                                                9.31 kB │ gzip:  2.68 kB
packages/core build: ℹ dist/manifest-schema-kPGX7VS-.mjs                                               9.14 kB │ gzip:  3.01 kB
packages/core build: ℹ dist/transport-_2nBz7e9.mjs.map                                                 9.12 kB │ gzip:  3.18 kB
packages/core build: ℹ dist/resolve-C7I0qiR0.mjs.map                                                   9.12 kB │ gzip:  3.20 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/rewrite-url-helpers.mjs.map              9.07 kB │ gzip:  3.12 kB
packages/core build: ℹ dist/byline-fields--hmN9XvS.d.mts.map                                           9.02 kB │ gzip:  1.55 kB
packages/core build: ℹ dist/byline-fields-DaMKzkhO.mjs.map                                             8.96 kB │ gzip:  2.15 kB
packages/core build: ℹ dist/patterns-BKmjvM7K.mjs.map                                                  8.92 kB │ gzip:  3.02 kB
packages/core build: ℹ dist/settings-8LHCxR9S.mjs                                                      8.90 kB │ gzip:  3.10 kB
packages/core build: ℹ dist/client/cf-access.mjs.map                                                   8.87 kB │ gzip:  3.14 kB
packages/core build: ℹ dist/bylines-QIC7qsUk.mjs                                                       8.67 kB │ gzip:  3.16 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/prepare.mjs.map                          8.65 kB │ gzip:  3.13 kB
packages/core build: ℹ dist/oauth-authorization-CsvzIp_F.mjs                                           8.64 kB │ gzip:  2.58 kB
packages/core build: ℹ dist/media/image-endpoint.mjs.map                                               8.47 kB │ gzip:  3.51 kB
packages/core build: ℹ dist/seo-BkhuuaaE.mjs.map                                                       8.44 kB │ gzip:  3.45 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs.map        8.42 kB │ gzip:  2.72 kB
packages/core build: ℹ dist/astro/routes/api/oauth/register.mjs.map                                    8.19 kB │ gzip:  2.94 kB
packages/core build: ℹ dist/dialect-helpers-DRI5pyY3.mjs.map                                           8.19 kB │ gzip:  2.27 kB
packages/core build: ℹ dist/allowed-origins-D5FxMUo8.mjs.map                                           8.19 kB │ gzip:  3.02 kB
packages/core build: ℹ dist/request-meta-CmS1tDFf.mjs.map                                              8.19 kB │ gzip:  3.14 kB
packages/core build: ℹ dist/utils-B7A57fm9.mjs                                                         8.16 kB │ gzip:  2.90 kB
packages/core build: ℹ dist/astro/routes/api/media/_id_/confirm.mjs.map                                8.10 kB │ gzip:  3.11 kB
packages/core build: ℹ dist/rate-limit-DIPf9dmr.mjs.map                                                8.07 kB │ gzip:  3.40 kB
packages/core build: ℹ dist/dashboard-nA_fxkd0.mjs.map                                                 7.78 kB │ gzip:  2.87 kB
packages/core build: ℹ dist/options-DTTML-Tx.mjs.map                                                   7.78 kB │ gzip:  2.31 kB
packages/core build: ℹ dist/portable-text-BICg8bTk.mjs                                                 7.62 kB │ gzip:  2.38 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/_id_/index.mjs.map                            7.59 kB │ gzip:  2.39 kB
packages/core build: ℹ dist/media-D6UwDm00.mjs                                                         7.58 kB │ gzip:  2.53 kB
packages/core build: ℹ dist/oauth-clients-C9SYwEbZ.mjs                                                 7.56 kB │ gzip:  1.84 kB
packages/core build: ℹ dist/init-lock-6b309ZrF.mjs.map                                                 7.20 kB │ gzip:  3.02 kB
packages/core build: ℹ dist/types-xIfVRNLp.d.mts.map                                                   6.96 kB │ gzip:  1.15 kB
packages/core build: ℹ dist/enrich-BQ0mxJRs.mjs                                                        6.84 kB │ gzip:  2.70 kB
packages/core build: ℹ dist/bylines-BQlQokM0.mjs                                                       6.83 kB │ gzip:  2.33 kB
packages/core build: ℹ dist/widgets-BgKf3c-x.mjs.map                                                   6.73 kB │ gzip:  2.37 kB
packages/core build: ℹ dist/astro/middleware/redirect.mjs.map                                          6.65 kB │ gzip:  2.52 kB
packages/core build: ℹ dist/comment-reaction-C6cSXp1W.mjs.map                                          6.61 kB │ gzip:  2.24 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/_name_/widgets/_id_.mjs.map                  6.52 kB │ gzip:  1.77 kB
packages/core build: ℹ dist/seo/index.mjs.map                                                          6.49 kB │ gzip:  2.40 kB
packages/core build: ℹ dist/astro/routes/api/settings/email.mjs.map                                    6.47 kB │ gzip:  2.40 kB
packages/core build: ℹ dist/astro/routes/api/plugins/_pluginId_/_...path_.mjs.map                      6.43 kB │ gzip:  2.62 kB
packages/core build: ℹ dist/astro/routes/api/setup/admin-verify.mjs.map                                6.33 kB │ gzip:  2.31 kB
packages/core build: ℹ dist/astro/routes/api/media/_id_.mjs.map                                        6.28 kB │ gzip:  1.75 kB
packages/core build: ℹ dist/astro/routes/api/media/upload-url.mjs.map                                  6.25 kB │ gzip:  2.44 kB
packages/core build: ℹ dist/request-cache-KCNHp_RJ.mjs.map                                             6.23 kB │ gzip:  2.43 kB
packages/core build: ℹ dist/astro/routes/api/setup/admin.mjs.map                                       6.21 kB │ gzip:  2.51 kB
packages/core build: ℹ dist/service-DZi0B1XO.mjs                                                       6.21 kB │ gzip:  2.19 kB
packages/core build: ℹ dist/astro/routes/api/setup/index.mjs.map                                       6.16 kB │ gzip:  2.40 kB
packages/core build: ℹ dist/database/instrumentation.mjs.map                                           6.15 kB │ gzip:  2.62 kB
packages/core build: ℹ dist/astro/routes/api/auth/oauth/_provider_.mjs.map                             6.14 kB │ gzip:  2.26 kB
packages/core build: ℹ dist/public-url-CTVqgMmg.mjs.map                                                5.92 kB │ gzip:  2.40 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/register/verify.mjs.map                      5.90 kB │ gzip:  2.22 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/preview-url.mjs.map             5.90 kB │ gzip:  2.39 kB
packages/core build: ℹ dist/validate-VPnKoIzW.mjs.map                                                  5.90 kB │ gzip:  1.70 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/schedule.mjs.map                5.82 kB │ gzip:  1.68 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/_id_/status.mjs.map                        5.70 kB │ gzip:  2.00 kB
packages/core build: ℹ dist/resolve-C7I0qiR0.mjs                                                       5.63 kB │ gzip:  2.12 kB
packages/core build: ℹ dist/validation-BTRcg5uD.mjs                                                    5.61 kB │ gzip:  2.26 kB
packages/core build: ℹ dist/astro/routes/api/auth/dev-bypass.mjs.map                                   5.58 kB │ gzip:  2.30 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/registry/install.mjs.map                    5.57 kB │ gzip:  2.38 kB
packages/core build: ℹ dist/astro/routes/api/media/providers/_providerId_/index.mjs.map                5.54 kB │ gzip:  1.81 kB
packages/core build: ℹ dist/normalize-CeglrBT9.mjs                                                     5.51 kB │ gzip:  1.60 kB
packages/core build: ℹ dist/comments-EfE1-H-U.mjs                                                      5.49 kB │ gzip:  1.74 kB
packages/core build: ℹ dist/preview-DKGCt2_p.mjs.map                                                   5.44 kB │ gzip:  1.93 kB
packages/core build: ℹ dist/user-B4y-aRCH.mjs                                                          5.37 kB │ gzip:  1.94 kB
packages/core build: ℹ dist/parse-X-otjCXc.mjs.map                                                     5.35 kB │ gzip:  1.94 kB
packages/core build: ℹ dist/allowed-origins-D5FxMUo8.mjs                                               5.31 kB │ gzip:  2.06 kB
packages/core build: ℹ dist/seo-4f_H0FIw.mjs                                                           5.28 kB │ gzip:  1.87 kB
packages/core build: ℹ dist/types-CQAugunJ.mjs.map                                                     5.27 kB │ gzip:  1.85 kB
packages/core build: ℹ dist/astro/routes/api/manifest.mjs.map                                          5.26 kB │ gzip:  2.30 kB
packages/core build: ℹ dist/request-context.mjs.map                                                    5.22 kB │ gzip:  2.28 kB
packages/core build: ℹ dist/astro/routes/api/admin/bylines/_id_/translations.mjs.map                   5.22 kB │ gzip:  1.88 kB
packages/core build: ℹ dist/astro/routes/api/setup/status.mjs.map                                      5.09 kB │ gzip:  1.96 kB
packages/core build: ℹ dist/patterns-BKmjvM7K.mjs                                                      5.05 kB │ gzip:  1.85 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/index.mjs.map                        4.99 kB │ gzip:  1.84 kB
packages/core build: ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_/translations.mjs.map       4.98 kB │ gzip:  1.50 kB
packages/core build: ℹ dist/client/index.d.mts.map                                                     4.98 kB │ gzip:  1.43 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/_id_.mjs.map                                 4.95 kB │ gzip:  1.56 kB
packages/core build: ℹ dist/tokens-LeuXF9gG.mjs                                                        4.94 kB │ gzip:  1.73 kB
packages/core build: ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_.mjs.map                    4.92 kB │ gzip:  1.17 kB
packages/core build: ℹ dist/astro/routes/api/typegen.mjs.map                                           4.90 kB │ gzip:  1.79 kB
packages/core build: ℹ dist/astro/routes/api/admin/allowed-domains/_domain_.mjs.map                    4.84 kB │ gzip:  1.49 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/publish.mjs.map                 4.76 kB │ gzip:  1.89 kB
packages/core build: ℹ dist/astro/routes/api/schema/index.mjs.map                                      4.75 kB │ gzip:  1.93 kB
packages/core build: ℹ dist/astro/routes/api/admin/oauth-clients/_id_.mjs.map                          4.75 kB │ gzip:  1.34 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress-plugin/analyze.mjs.map                   4.74 kB │ gzip:  1.92 kB
packages/core build: ℹ dist/astro/routes/api/admin/byline-fields/_slug_.mjs.map                        4.70 kB │ gzip:  1.46 kB
packages/core build: ℹ dist/astro/routes/api/admin/allowed-domains/index.mjs.map                       4.61 kB │ gzip:  1.60 kB
packages/core build: ℹ dist/astro/types.d.mts.map                                                      4.60 kB │ gzip:  1.26 kB
packages/core build: ℹ dist/request-meta-CmS1tDFf.mjs                                                  4.58 kB │ gzip:  1.93 kB
packages/core build: ℹ dist/single-flight-cache-Cdfkic3t.mjs                                           4.56 kB │ gzip:  2.03 kB
packages/core build: ℹ dist/astro/routes/api/admin/bylines/_id_/index.mjs.map                          4.54 kB │ gzip:  1.61 kB
packages/core build: ℹ dist/transport-_2nBz7e9.mjs                                                     4.50 kB │ gzip:  1.70 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_/translations.mjs.map                         4.50 kB │ gzip:  1.48 kB
packages/core build: ℹ dist/api-tokens-D6ppjIVi.mjs                                                    4.48 kB │ gzip:  1.47 kB
packages/core build: ℹ dist/plugin-utils.mjs.map                                                       4.46 kB │ gzip:  1.89 kB
packages/core build: ℹ dist/astro/routes/api/auth/signup/request.mjs.map                               4.45 kB │ gzip:  1.92 kB
packages/core build: ℹ dist/astro/image-endpoint.mjs.map                                               4.45 kB │ gzip:  1.88 kB
packages/core build: ℹ dist/rate-limit-DIPf9dmr.mjs                                                    4.43 kB │ gzip:  2.06 kB
packages/core build: ℹ dist/trusted-proxy-DZY5WCn2.mjs.map                                             4.43 kB │ gzip:  1.96 kB
packages/core build: ℹ dist/astro/routes/api/auth/magic-link/send.mjs.map                              4.40 kB │ gzip:  1.78 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/index.mjs.map                                4.39 kB │ gzip:  1.57 kB
packages/core build: ℹ dist/validate-VPnKoIzW.mjs                                                      4.35 kB │ gzip:  1.32 kB
packages/core build: ℹ dist/astro/routes/api/auth/signup/complete.mjs.map                              4.33 kB │ gzip:  1.74 kB
packages/core build: ℹ dist/base64-CmWvODNW.mjs.map                                                    4.31 kB │ gzip:  1.41 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/options.mjs.map                              4.30 kB │ gzip:  1.76 kB
packages/core build: ℹ dist/astro/routes/api/auth/invite/complete.mjs.map                              4.29 kB │ gzip:  1.72 kB
packages/core build: ℹ dist/astro/routes/api/themes/preview.mjs.map                                    4.25 kB │ gzip:  1.80 kB
packages/core build: ℹ dist/astro/routes/api/auth/invite/index.mjs.map                                 4.23 kB │ gzip:  1.83 kB
packages/core build: ℹ dist/astro/routes/api/admin/hooks/exclusive/_hookName_.mjs.map                  4.20 kB │ gzip:  1.71 kB
packages/core build: ℹ dist/object-cache/memory.mjs.map                                                4.18 kB │ gzip:  1.81 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/register/options.mjs.map                     4.18 kB │ gzip:  1.69 kB
packages/core build: ℹ dist/oauth-state-store---zrApfB.mjs.map                                         4.17 kB │ gzip:  1.51 kB
packages/core build: ℹ dist/astro/routes/api/redirects/_id_.mjs.map                                    4.17 kB │ gzip:  1.10 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/registry/_id_/update.mjs.map                4.10 kB │ gzip:  1.70 kB
packages/core build: ℹ dist/astro/routes/api/auth/invite/register-options.mjs.map                      4.09 kB │ gzip:  1.75 kB
packages/core build: ℹ dist/astro/routes/api/admin/bylines/index.mjs.map                               4.09 kB │ gzip:  1.48 kB
packages/core build: ℹ dist/astro/middleware/setup.mjs.map                                             4.08 kB │ gzip:  1.67 kB
packages/core build: ℹ dist/astro/routes/sitemap.xml.mjs.map                                           4.05 kB │ gzip:  1.66 kB
packages/core build: ℹ dist/astro/routes/api/sections/_slug_.mjs.map                                   3.99 kB │ gzip:  1.04 kB
packages/core build: ℹ dist/astro/routes/api/media/providers/_providerId_/_itemId_.mjs.map             3.95 kB │ gzip:  1.20 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/_name_.mjs.map                               3.86 kB │ gzip:  1.25 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/_slug_/index.mjs.map                   3.84 kB │ gzip:  1.15 kB
packages/core build: ℹ dist/seo-BkhuuaaE.mjs                                                           3.81 kB │ gzip:  1.83 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_.mjs.map                                      3.79 kB │ gzip:  1.00 kB
packages/core build: ℹ dist/db/index.mjs.map                                                           3.77 kB │ gzip:  1.42 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/_name_/widgets.mjs.map                       3.74 kB │ gzip:  1.48 kB
packages/core build: ℹ dist/byline-fields-DaMKzkhO.mjs                                                 3.74 kB │ gzip:  0.97 kB
packages/core build: ℹ dist/options-DTTML-Tx.mjs                                                       3.69 kB │ gzip:  1.25 kB
packages/core build: ℹ dist/astro/routes/api/redirects/404s/index.mjs.map                              3.64 kB │ gzip:  1.07 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/duplicate.mjs.map               3.62 kB │ gzip:  1.48 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs.map      3.60 kB │ gzip:  1.01 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/updates.mjs.map                             3.56 kB │ gzip:  1.51 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/verify.mjs.map                               3.54 kB │ gzip:  1.42 kB
packages/core build: ℹ dist/cache-D7wGv8oE.mjs.map                                                     3.54 kB │ gzip:  1.45 kB
packages/core build: ℹ dist/dashboard-nA_fxkd0.mjs                                                     3.54 kB │ gzip:  1.51 kB
packages/core build: ℹ dist/request-cache-KCNHp_RJ.mjs                                                 3.53 kB │ gzip:  1.51 kB
packages/core build: ℹ dist/mime-CCEzze7W.mjs.map                                                      3.52 kB │ gzip:  1.48 kB
packages/core build: ℹ dist/astro/routes/api/oauth/device/token.mjs.map                                3.50 kB │ gzip:  1.56 kB
packages/core build: ℹ dist/components-CYt4uVK9.mjs.map                                                3.46 kB │ gzip:  0.99 kB
packages/core build: ℹ dist/widgets-BgKf3c-x.mjs                                                       3.44 kB │ gzip:  1.29 kB
packages/core build: ℹ dist/challenge-store-LhiqMccz.mjs.map                                           3.43 kB │ gzip:  1.34 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/_id_/disable.mjs.map                          3.43 kB │ gzip:  1.49 kB
packages/core build: ℹ dist/comment-reaction-C6cSXp1W.mjs                                              3.40 kB │ gzip:  1.25 kB
packages/core build: ℹ dist/astro/routes/api/admin/byline-fields/index.mjs.map                         3.38 kB │ gzip:  1.34 kB
packages/core build: ℹ dist/public-url-CTVqgMmg.mjs                                                    3.37 kB │ gzip:  1.50 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_/items/_id_.mjs.map                           3.35 kB │ gzip:  1.04 kB
packages/core build: ℹ dist/types-Dbqff978.d.mts.map                                                   3.35 kB │ gzip:  1.20 kB
packages/core build: ℹ dist/astro/routes/api/taxonomies/_name_/terms/index.mjs.map                     3.34 kB │ gzip:  1.16 kB
packages/core build: ℹ dist/astro/routes/api/media/file/_...key_.mjs.map                               3.33 kB │ gzip:  1.52 kB
packages/core build: ℹ dist/dialect-helpers-DRI5pyY3.mjs                                               3.33 kB │ gzip:  1.12 kB
packages/core build: ℹ dist/astro/routes/api/admin/oauth-clients/index.mjs.map                         3.32 kB │ gzip:  1.25 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/discard-draft.mjs.map           3.31 kB │ gzip:  1.36 kB
packages/core build: ℹ dist/astro/routes/robots.txt.mjs.map                                            3.28 kB │ gzip:  1.34 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/_id_/send-recovery.mjs.map                    3.27 kB │ gzip:  1.44 kB
packages/core build: ℹ dist/field-defs-cache-CaPy3177.mjs                                              3.25 kB │ gzip:  1.48 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/restore.mjs.map                 3.25 kB │ gzip:  1.34 kB
packages/core build: ℹ dist/db-errors-CK46D-ly.mjs.map                                                 3.25 kB │ gzip:  1.28 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/unpublish.mjs.map               3.24 kB │ gzip:  1.32 kB
packages/core build: ℹ dist/email-console-DJP32ucW.mjs.map                                             3.23 kB │ gzip:  1.54 kB
packages/core build: ℹ dist/types-BDNJow_f.mjs                                                         3.22 kB │ gzip:  1.41 kB
packages/core build: ℹ dist/astro/routes/api/auth/magic-link/verify.mjs.map                            3.18 kB │ gzip:  1.34 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/_name_/reorder.mjs.map                       3.17 kB │ gzip:  1.32 kB
packages/core build: ℹ dist/validate-9ECmtEpJ.d.mts.map                                                3.16 kB │ gzip:  0.94 kB
packages/core build: ℹ dist/astro/routes/api/admin/api-tokens/index.mjs.map                            3.11 kB │ gzip:  1.21 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/install.mjs.map            3.11 kB │ gzip:  1.31 kB
packages/core build: ℹ dist/session-user-B8aLtKAH.mjs.map                                              3.11 kB │ gzip:  1.52 kB
packages/core build: ℹ dist/mode-BB0F8xTC.mjs.map                                                      3.04 kB │ gzip:  1.13 kB
packages/core build: ℹ dist/astro/routes/api/auth/me.mjs.map                                           3.04 kB │ gzip:  1.31 kB
packages/core build: ℹ dist/astro/routes/api/search/rebuild.mjs.map                                    3.02 kB │ gzip:  1.23 kB
packages/core build: ℹ dist/astro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs.map           2.97 kB │ gzip:  1.31 kB
packages/core build: ℹ dist/after-B1IIdH3Y.mjs.map                                                     2.96 kB │ gzip:  1.50 kB
packages/core build: ℹ dist/astro/routes/api/revisions/_revisionId_/restore.mjs.map                    2.94 kB │ gzip:  1.17 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/icon.mjs.map               2.94 kB │ gzip:  1.30 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/index.mjs.map                                 2.94 kB │ gzip:  1.30 kB
packages/core build: ℹ dist/runtime.mjs.map                                                            2.91 kB │ gzip:  1.25 kB
packages/core build: ℹ dist/astro/routes/api/settings.mjs.map                                          2.90 kB │ gzip:  1.06 kB
packages/core build: ℹ dist/astro/routes/api/taxonomies/index.mjs.map                                  2.89 kB │ gzip:  1.02 kB
packages/core build: ℹ dist/types-tM44hEcf.mjs                                                         2.88 kB │ gzip:  1.32 kB
packages/core build: ℹ dist/astro/routes/api/redirects/index.mjs.map                                   2.86 kB │ gzip:  1.00 kB
packages/core build: ℹ dist/preview-DKGCt2_p.mjs                                                       2.85 kB │ gzip:  1.03 kB
packages/core build: ℹ dist/parse-X-otjCXc.mjs                                                         2.83 kB │ gzip:  1.15 kB
packages/core build: ℹ dist/default-CeRG-Ot4.mjs.map                                                   2.82 kB │ gzip:  0.81 kB
packages/core build: ℹ dist/passkey-config-C0YfSBko.mjs.map                                            2.81 kB │ gzip:  1.25 kB
packages/core build: ℹ dist/astro/routes/api/search/index.mjs.map                                      2.78 kB │ gzip:  1.33 kB
packages/core build: ℹ dist/astro/routes/api/well-known/auth.mjs.map                                   2.75 kB │ gzip:  1.22 kB
packages/core build: ℹ dist/astro/routes/api/oauth/device/code.mjs.map                                 2.74 kB │ gzip:  1.27 kB
packages/core build: ℹ dist/schema-CWsb53_h.mjs.map                                                    2.72 kB │ gzip:  1.15 kB
packages/core build: ℹ dist/astro/routes/api/sections/index.mjs.map                                    2.71 kB │ gzip:  0.96 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/update.mjs.map                         2.71 kB │ gzip:  1.13 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/translations.mjs.map            2.70 kB │ gzip:  1.28 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/_id_.mjs.map                               2.69 kB │ gzip:  0.92 kB
packages/core build: ℹ dist/astro/routes/api/search/enable.mjs.map                                     2.65 kB │ gzip:  1.12 kB
packages/core build: ℹ dist/placeholder-Cuce9U-m.d.mts.map                                             2.62 kB │ gzip:  0.98 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress-plugin/callback.mjs.map                  2.55 kB │ gzip:  1.19 kB
packages/core build: ℹ dist/astro/routes/api/menus/index.mjs.map                                       2.48 kB │ gzip:  0.97 kB
packages/core build: ℹ dist/config-CVssduLe.mjs.map                                                    2.48 kB │ gzip:  1.09 kB
packages/core build: ℹ dist/astro/routes/api/admin/themes/marketplace/index.mjs.map                    2.44 kB │ gzip:  1.06 kB
packages/core build: ℹ dist/base64-CmWvODNW.mjs                                                        2.44 kB │ gzip:  0.92 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/index.mjs.map                          2.42 kB │ gzip:  0.89 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/_slug_/fields/index.mjs.map            2.42 kB │ gzip:  0.83 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/registry/_id_/uninstall.mjs.map             2.39 kB │ gzip:  1.08 kB
packages/core build: ℹ dist/index-DGIjmUXQ.d.mts.map                                                   2.36 kB │ gzip:  0.80 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/enable.mjs.map                         2.35 kB │ gzip:  1.07 kB
packages/core build: ℹ dist/astro/routes/api/admin/hooks/exclusive/index.mjs.map                       2.33 kB │ gzip:  1.11 kB
packages/core build: ℹ dist/transaction-qfqpPVpu.mjs.map                                               2.32 kB │ gzip:  1.10 kB
packages/core build: ℹ dist/astro/routes/api/auth/signup/verify.mjs.map                                2.29 kB │ gzip:  1.13 kB
packages/core build: ℹ dist/session-user-B8aLtKAH.mjs                                                  2.27 kB │ gzip:  1.17 kB
packages/core build: ℹ dist/astro/routes/api/auth/mode.mjs.map                                         2.27 kB │ gzip:  1.13 kB
packages/core build: ℹ dist/authorize-D_OmXF9h.mjs.map                                                 2.24 kB │ gzip:  0.85 kB
packages/core build: ℹ dist/astro/routes/api/auth/invite/accept.mjs.map                                2.22 kB │ gzip:  1.09 kB
packages/core build: ℹ dist/astro/routes/api/well-known/oauth-authorization-server.mjs.map             2.21 kB │ gzip:  0.97 kB
packages/core build: ℹ dist/init-lock-6b309ZrF.mjs                                                     2.19 kB │ gzip:  1.03 kB
packages/core build: ℹ dist/options-41nCWqi9.d.mts.map                                                 2.19 kB │ gzip:  0.83 kB
packages/core build: ℹ dist/astro/routes/api/search/suggest.mjs.map                                    2.19 kB │ gzip:  1.06 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/uninstall.mjs.map                      2.19 kB │ gzip:  0.98 kB
packages/core build: ℹ dist/hash-DrvzIXcz.mjs.map                                                      2.18 kB │ gzip:  1.05 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/index.mjs.map                                2.11 kB │ gzip:  1.03 kB
packages/core build: ℹ dist/db-errors-CK46D-ly.mjs                                                     2.10 kB │ gzip:  0.89 kB
packages/core build: ℹ dist/setup-complete-gEiySUc-.mjs.map                                            2.08 kB │ gzip:  0.91 kB
packages/core build: ℹ dist/astro/routes/api/oauth/device/authorize.mjs.map                            2.06 kB │ gzip:  1.00 kB
packages/core build: ℹ dist/slugify-Cce3dTdg.mjs.map                                                   2.04 kB │ gzip:  1.01 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/index.mjs.map                              2.02 kB │ gzip:  0.91 kB
packages/core build: ℹ dist/trusted-proxy-DZY5WCn2.mjs                                                 1.99 kB │ gzip:  0.97 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/_id_/enable.mjs.map                           1.99 kB │ gzip:  0.94 kB
packages/core build: ℹ dist/components-CYt4uVK9.mjs                                                    1.99 kB │ gzip:  0.71 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/bulk.mjs.map                               1.98 kB │ gzip:  0.88 kB
packages/core build: ℹ dist/cache-D7wGv8oE.mjs                                                         1.97 kB │ gzip:  0.81 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/marketplace/index.mjs.map                   1.92 kB │ gzip:  0.86 kB
packages/core build: ℹ dist/settings-BH48Xi75.mjs.map                                                  1.91 kB │ gzip:  0.71 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_/reorder.mjs.map                              1.89 kB │ gzip:  0.86 kB
packages/core build: ℹ dist/astro/routes/api/menus/_name_/items.mjs.map                                1.87 kB │ gzip:  0.86 kB
packages/core build: ℹ dist/astro/routes/api/import/probe.mjs.map                                      1.84 kB │ gzip:  0.87 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/disable.mjs.map                        1.84 kB │ gzip:  0.85 kB
packages/core build: ℹ dist/astro/routes/api/admin/byline-fields/reorder.mjs.map                       1.82 kB │ gzip:  0.87 kB
packages/core build: ℹ dist/page/index.d.mts.map                                                       1.81 kB │ gzip:  0.69 kB
packages/core build: ℹ dist/oauth-state-store---zrApfB.mjs                                             1.79 kB │ gzip:  0.72 kB
packages/core build: ℹ dist/media-allowlist-Du8t1u6a.mjs.map                                           1.77 kB │ gzip:  0.95 kB
packages/core build: ℹ dist/astro/routes/api/setup/dev-reset.mjs.map                                   1.77 kB │ gzip:  0.89 kB
packages/core build: ℹ dist/astro/routes/api/schema/orphans/_slug_.mjs.map                             1.77 kB │ gzip:  0.81 kB
packages/core build: ℹ dist/types-CNlaBFzx.d.mts.map                                                   1.76 kB │ gzip:  0.54 kB
packages/core build: ℹ dist/media-url-O4rm9-SQ.mjs.map                                                 1.74 kB │ gzip:  0.88 kB
packages/core build: ℹ dist/astro/routes/api/oauth/token/refresh.mjs.map                               1.72 kB │ gzip:  0.87 kB
packages/core build: ℹ dist/astro/routes/api/admin/byline-fields/_slug_/usage.mjs.map                  1.69 kB │ gzip:  0.87 kB
packages/core build: ℹ dist/astro/routes/api/admin/api-tokens/_id_.mjs.map                             1.68 kB │ gzip:  0.85 kB
packages/core build: ℹ dist/astro/routes/api/redirects/404s/summary.mjs.map                            1.68 kB │ gzip:  0.79 kB
packages/core build: ℹ dist/astro/routes/api/oauth/token/revoke.mjs.map                                1.68 kB │ gzip:  0.87 kB
packages/core build: ℹ dist/email-console-DJP32ucW.mjs                                                 1.67 kB │ gzip:  0.86 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/revisions.mjs.map               1.67 kB │ gzip:  0.84 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/authors.mjs.map                      1.66 kB │ gzip:  0.89 kB
packages/core build: ℹ dist/astro/routes/api/well-known/oauth-protected-resource.mjs.map               1.64 kB │ gzip:  0.85 kB
packages/core build: ℹ dist/types-ETmO_jQr.d.mts.map                                                   1.64 kB │ gzip:  0.59 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/permanent.mjs.map               1.62 kB │ gzip:  0.79 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/_slug_/fields/reorder.mjs.map          1.61 kB │ gzip:  0.72 kB
packages/core build: ℹ dist/challenge-store-LhiqMccz.mjs                                               1.59 kB │ gzip:  0.68 kB
packages/core build: ℹ dist/passkey-config-C0YfSBko.mjs                                                1.56 kB │ gzip:  0.74 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/trash.mjs.map                        1.55 kB │ gzip:  0.77 kB
packages/core build: ℹ dist/api/route-utils.mjs.map                                                    1.54 kB │ gzip:  0.70 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/index.mjs.map                          1.53 kB │ gzip:  0.76 kB
packages/core build: ℹ dist/types-ByChcBgE.d.mts.map                                                   1.53 kB │ gzip:  0.67 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/marketplace/_id_/index.mjs.map              1.45 kB │ gzip:  0.72 kB
packages/core build: ℹ dist/astro/routes/api/auth/logout.mjs.map                                       1.44 kB │ gzip:  0.77 kB
packages/core build: ℹ dist/astro/routes/api/admin/themes/marketplace/_id_/index.mjs.map               1.43 kB │ gzip:  0.72 kB
packages/core build: ℹ dist/astro/routes/api/dev/emails.mjs.map                                        1.43 kB │ gzip:  0.63 kB
packages/core build: ℹ dist/oauth-user-lookup-SHsWRlG9.mjs.map                                         1.41 kB │ gzip:  0.76 kB
packages/core build: ℹ dist/status-vUK0SA17.mjs.map                                                    1.39 kB │ gzip:  0.74 kB
packages/core build: ℹ dist/schema-CWsb53_h.mjs                                                        1.39 kB │ gzip:  0.67 kB
packages/core build: ℹ dist/plugin-types.d.mts.map                                                     1.38 kB │ gzip:  0.49 kB
packages/core build: ℹ dist/default-CeRG-Ot4.mjs                                                       1.35 kB │ gzip:  0.50 kB
packages/core build: ℹ dist/astro/routes/api/dashboard.mjs.map                                         1.34 kB │ gzip:  0.71 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/index.mjs.map                               1.32 kB │ gzip:  0.68 kB
packages/core build: ℹ dist/slugify-Cce3dTdg.mjs                                                       1.31 kB │ gzip:  0.71 kB
packages/core build: ℹ dist/site-url-BLebyON8.mjs.map                                                  1.30 kB │ gzip:  0.73 kB
packages/core build: ℹ dist/astro/routes/api/admin/comments/counts.mjs.map                             1.30 kB │ gzip:  0.65 kB
packages/core build: ℹ dist/astro/routes/api/search/stats.mjs.map                                      1.29 kB │ gzip:  0.69 kB
packages/core build: ℹ dist/astro/routes/api/revisions/_revisionId_/index.mjs.map                      1.29 kB │ gzip:  0.68 kB
packages/core build: ℹ dist/load-B6inflnK.mjs.map                                                      1.28 kB │ gzip:  0.64 kB
packages/core build: ℹ dist/mime-CCEzze7W.mjs                                                          1.28 kB │ gzip:  0.64 kB
packages/core build: ℹ dist/authorize-D_OmXF9h.mjs                                                     1.28 kB │ gzip:  0.52 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/compare.mjs.map                 1.25 kB │ gzip:  0.67 kB
packages/core build: ℹ dist/config-CVssduLe.mjs                                                        1.23 kB │ gzip:  0.58 kB
packages/core build: ℹ dist/media-allowlist-Du8t1u6a.mjs                                               1.21 kB │ gzip:  0.70 kB
packages/core build: ℹ dist/hash-DrvzIXcz.mjs                                                          1.21 kB │ gzip:  0.67 kB
packages/core build: ℹ dist/astro/routes/api/media/providers/index.mjs.map                             1.16 kB │ gzip:  0.62 kB
packages/core build: ℹ dist/settings-BH48Xi75.mjs                                                      1.16 kB │ gzip:  0.48 kB
packages/core build: ℹ dist/astro/routes/PluginRegistry.mjs.map                                        1.15 kB │ gzip:  0.57 kB
packages/core build: ℹ dist/astro/routes/api/schema/orphans/index.mjs.map                              1.14 kB │ gzip:  0.57 kB
packages/core build: ℹ dist/db/postgres.mjs.map                                                        1.14 kB │ gzip:  0.53 kB
packages/core build: ℹ dist/media-url-O4rm9-SQ.mjs                                                     1.12 kB │ gzip:  0.61 kB
packages/core build: ℹ dist/setup-complete-gEiySUc-.mjs                                                1.12 kB │ gzip:  0.51 kB
packages/core build: ℹ dist/setup-nonce-DzS50zme.mjs.map                                               1.10 kB │ gzip:  0.63 kB
packages/core build: ℹ dist/status-vUK0SA17.mjs                                                        1.08 kB │ gzip:  0.58 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/execute.d.mts.map                        1.06 kB │ gzip:  0.52 kB
packages/core build: ℹ dist/setup-nonce-DzS50zme.mjs                                                   1.02 kB │ gzip:  0.58 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/analyze.d.mts.map                        1.00 kB │ gzip:  0.43 kB
packages/core build: ℹ dist/auth/providers/github.mjs.map                                              0.99 kB │ gzip:  0.51 kB
packages/core build: ℹ dist/auth/providers/google.mjs.map                                              0.99 kB │ gzip:  0.51 kB
packages/core build: ℹ dist/types-CvuKO5Pn.d.mts.map                                                   0.94 kB │ gzip:  0.46 kB
packages/core build: ℹ dist/transaction-qfqpPVpu.mjs                                                   0.92 kB │ gzip:  0.47 kB
packages/core build: ℹ dist/astro/routes/api/widget-components.mjs.map                                 0.91 kB │ gzip:  0.51 kB
packages/core build: ℹ dist/db/sqlite.mjs.map                                                          0.91 kB │ gzip:  0.51 kB
packages/core build: ℹ dist/chunks-B7hMIk8G.mjs.map                                                    0.90 kB │ gzip:  0.57 kB
packages/core build: ℹ dist/oauth-user-lookup-SHsWRlG9.mjs                                             0.81 kB │ gzip:  0.49 kB
packages/core build: ℹ dist/chunks-B7hMIk8G.mjs                                                        0.80 kB │ gzip:  0.51 kB
packages/core build: ℹ dist/after-B1IIdH3Y.mjs                                                         0.79 kB │ gzip:  0.48 kB
packages/core build: ℹ dist/redirect-CS-PHtNh.mjs.map                                                  0.75 kB │ gzip:  0.48 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/rewrite-url-helpers.d.mts.map            0.74 kB │ gzip:  0.34 kB
packages/core build: ℹ dist/db/libsql.mjs.map                                                          0.71 kB │ gzip:  0.41 kB
packages/core build: ℹ dist/load-B6inflnK.mjs                                                          0.70 kB │ gzip:  0.38 kB
packages/core build: ℹ dist/errors-9P_FDrJ_.mjs.map                                                    0.67 kB │ gzip:  0.45 kB
packages/core build: ℹ dist/adapters-u037EnTR.d.mts.map                                                0.67 kB │ gzip:  0.32 kB
packages/core build: ℹ dist/storage/s3.d.mts.map                                                       0.67 kB │ gzip:  0.33 kB
packages/core build: ℹ dist/seo/index.d.mts.map                                                        0.64 kB │ gzip:  0.36 kB
packages/core build: ℹ dist/database/instrumentation.d.mts.map                                         0.64 kB │ gzip:  0.32 kB
packages/core build: ℹ dist/storage/local.d.mts.map                                                    0.62 kB │ gzip:  0.32 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/media.d.mts.map                          0.60 kB │ gzip:  0.31 kB
packages/core build: ℹ dist/media/image-endpoint.d.mts.map                                             0.60 kB │ gzip:  0.32 kB
packages/core build: ℹ dist/types-BkZ8DUEI.d.mts.map                                                   0.59 kB │ gzip:  0.31 kB
packages/core build: ℹ dist/version-Bsqjg21k.mjs.map                                                   0.59 kB │ gzip:  0.33 kB
packages/core build: ℹ dist/request-context.d.mts.map                                                  0.59 kB │ gzip:  0.32 kB
packages/core build: ℹ dist/escape-Bjio4ZsM.mjs.map                                                    0.58 kB │ gzip:  0.34 kB
packages/core build: ℹ dist/mode-BB0F8xTC.mjs                                                          0.58 kB │ gzip:  0.36 kB
packages/core build: ℹ dist/plugin-utils.d.mts.map                                                     0.57 kB │ gzip:  0.31 kB
packages/core build: ℹ dist/types-Y09-wtyU.d.mts.map                                                   0.55 kB │ gzip:  0.30 kB
packages/core build: ℹ dist/astro/index.d.mts.map                                                      0.54 kB │ gzip:  0.30 kB
packages/core build: ℹ dist/redirect-CS-PHtNh.mjs                                                      0.53 kB │ gzip:  0.37 kB
packages/core build: ℹ dist/errors-9P_FDrJ_.mjs                                                        0.53 kB │ gzip:  0.34 kB
packages/core build: ℹ dist/transport-Blrl2k_o.d.mts.map                                               0.49 kB │ gzip:  0.28 kB
packages/core build: ℹ dist/runner-BbR3DfrL.d.mts.map                                                  0.49 kB │ gzip:  0.25 kB
packages/core build: ℹ dist/client/cf-access.d.mts.map                                                 0.49 kB │ gzip:  0.27 kB
packages/core build: ℹ dist/api/route-utils.d.mts.map                                                  0.48 kB │ gzip:  0.27 kB
packages/core build: ℹ dist/media/index.d.mts.map                                                      0.48 kB │ gzip:  0.27 kB
packages/core build: ℹ dist/types-BvbeGEtr.mjs                                                         0.45 kB │ gzip:  0.20 kB
packages/core build: ℹ dist/media/local-runtime.d.mts.map                                              0.45 kB │ gzip:  0.25 kB
packages/core build: ℹ dist/site-url-BLebyON8.mjs                                                      0.44 kB │ gzip:  0.29 kB
packages/core build: ℹ dist/types-CQAugunJ.mjs                                                         0.36 kB │ gzip:  0.24 kB
packages/core build: ℹ dist/escape-Bjio4ZsM.mjs                                                        0.36 kB │ gzip:  0.25 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/rewrite-urls.d.mts.map                   0.34 kB │ gzip:  0.23 kB
packages/core build: ℹ dist/astro/middleware/auth.d.mts.map                                            0.33 kB │ gzip:  0.22 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress-plugin/execute.d.mts.map                 0.32 kB │ gzip:  0.23 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/prepare.d.mts.map                        0.32 kB │ gzip:  0.21 kB
packages/core build: ℹ dist/astro/routes/api/plugins/_pluginId_/_...path_.d.mts.map                    0.29 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/middleware.d.mts.map                                                 0.27 kB │ gzip:  0.20 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress-plugin/analyze.d.mts.map                 0.27 kB │ gzip:  0.20 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.d.mts.map    0.26 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/PluginRegistry.d.mts.map                                      0.26 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_.d.mts.map                  0.25 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/api-tokens-B4BQybOp.mjs                                                    0.25 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/content/_collection_/_id_/terms/_taxonomy_.d.mts.map      0.24 kB │ gzip:  0.19 kB
packages/core build: ℹ dist/astro/routes/api/import/probe.d.mts.map                                    0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/schema/collections/_slug_/index.d.mts.map                 0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/oauth-clients/_id_.d.mts.map                        0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/taxonomies/_name_/terms/_slug_/translations.d.mts.map     0.24 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/byline-fields/_slug_.d.mts.map                      0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/admin/bylines/_id_/index.d.mts.map                        0.23 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/comments/_collection_/_contentId_/index.d.mts.map         0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/media/providers/_providerId_/_itemId_.d.mts.map           0.23 kB │ gzip:  0.18 kB
packages/core build: ℹ dist/astro/routes/api/comments/_collection_/_contentId_/reactions.d.mts.map     0.23 kB │ gzip:  0.18 kB
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
packages/core build: ℹ dist/plugins/adapt-sandbox-entry.d.mts.map                                      0.22 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/admin/allowed-domains/_domain_.d.mts.map                  0.22 kB │ gzip:  0.18 kB
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
packages/core build: ℹ dist/astro/routes/api/content/_collection_/authors.d.mts.map                    0.18 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/routes/api/typegen.d.mts.map                                         0.18 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/_name_/widgets.d.mts.map                     0.18 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/runtime.d.mts.map                                                          0.18 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/enable.d.mts.map                       0.18 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/_id_/update.d.mts.map                       0.18 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/admin/users/_id_/disable.d.mts.map                        0.18 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/widget-areas/_name_/reorder.d.mts.map                     0.18 kB │ gzip:  0.16 kB
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
packages/core build: ℹ dist/version-Bsqjg21k.mjs                                                       0.17 kB │ gzip:  0.16 kB
packages/core build: ℹ dist/astro/middleware/redirect.d.mts.map                                        0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/oauth/token/refresh.d.mts.map                             0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/auth/passkey/verify.d.mts.map                             0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/media/_id_/confirm.d.mts.map                              0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/schema/orphans/index.d.mts.map                            0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/search/suggest.d.mts.map                                  0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/admin/plugins/index.d.mts.map                             0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/auth/invite/accept.d.mts.map                              0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/auth/magic-link/send.d.mts.map                            0.17 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/auth/signup/verify.d.mts.map                              0.17 kB │ gzip:  0.15 kB
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
packages/core build: ℹ dist/scheduled-publish-BMljtY5G.d.mts.map                                       0.16 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/auth/logout.d.mts.map                                     0.16 kB │ gzip:  0.15 kB
packages/core build: ℹ dist/astro/routes/api/setup/admin.d.mts.map                                     0.16 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/astro/routes/api/setup/index.d.mts.map                                     0.16 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/astro/routes/api/dashboard.d.mts.map                                       0.16 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/astro/routes/api/manifest.d.mts.map                                        0.16 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/astro/routes/api/snapshot.d.mts.map                                        0.16 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/astro/routes/api/auth/mode.d.mts.map                                       0.16 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/astro/routes/sitemap.xml.d.mts.map                                         0.16 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/astro/image-endpoint.d.mts.map                                             0.15 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/astro/routes/robots.txt.d.mts.map                                          0.15 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/db/postgres.d.mts.map                                                      0.15 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/auth/providers/github.d.mts.map                                            0.15 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/auth/providers/google.d.mts.map                                            0.15 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/db/libsql.d.mts.map                                                        0.14 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/db/sqlite.d.mts.map                                                        0.14 kB │ gzip:  0.14 kB
packages/core build: ℹ dist/object-cache/memory.d.mts.map                                              0.14 kB │ gzip:  0.13 kB
packages/core build: ℹ dist/ssrf-CcX9zvMK.mjs                                                          0.01 kB │ gzip:  0.03 kB
packages/core build: ℹ dist/index.d.mts                                                               19.65 kB │ gzip:  5.14 kB
packages/core build: ℹ dist/astro/types.d.mts                                                         13.48 kB │ gzip:  4.06 kB
packages/core build: ℹ dist/client/index.d.mts                                                        11.50 kB │ gzip:  3.14 kB
packages/core build: ℹ dist/api/schemas/index.d.mts                                                    8.46 kB │ gzip:  1.97 kB
packages/core build: ℹ dist/plugin-types.d.mts                                                         7.09 kB │ gzip:  2.45 kB
packages/core build: ℹ dist/page/index.d.mts                                                           6.93 kB │ gzip:  2.30 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/execute.d.mts                            3.97 kB │ gzip:  1.57 kB
packages/core build: ℹ dist/media/image-endpoint.d.mts                                                 3.97 kB │ gzip:  1.83 kB
packages/core build: ℹ dist/astro/index.d.mts                                                          3.65 kB │ gzip:  1.57 kB
packages/core build: ℹ dist/database/instrumentation.d.mts                                             3.31 kB │ gzip:  1.51 kB
packages/core build: ℹ dist/media/index.d.mts                                                          3.29 kB │ gzip:  1.40 kB
packages/core build: ℹ dist/request-context.d.mts                                                      3.11 kB │ gzip:  1.42 kB
packages/core build: ℹ dist/api/route-utils.d.mts                                                      2.94 kB │ gzip:  1.35 kB
packages/core build: ℹ dist/plugin-utils.d.mts                                                         2.89 kB │ gzip:  1.26 kB
packages/core build: ℹ dist/client/cf-access.d.mts                                                     2.55 kB │ gzip:  1.04 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/analyze.d.mts                            2.52 kB │ gzip:  0.95 kB
packages/core build: ℹ dist/seo/index.d.mts                                                            2.45 kB │ gzip:  1.01 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/rewrite-url-helpers.d.mts                2.14 kB │ gzip:  0.89 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/media.d.mts                              1.80 kB │ gzip:  0.77 kB
packages/core build: ℹ dist/media/local-runtime.d.mts                                                  1.80 kB │ gzip:  0.84 kB
packages/core build: ℹ dist/storage/s3.d.mts                                                           1.61 kB │ gzip:  0.75 kB
packages/core build: ℹ dist/storage/local.d.mts                                                        1.50 kB │ gzip:  0.70 kB
packages/core build: ℹ dist/plugins/adapt-sandbox-entry.d.mts                                          1.42 kB │ gzip:  0.67 kB
packages/core build: ℹ dist/astro/middleware.d.mts                                                     1.26 kB │ gzip:  0.70 kB
packages/core build: ℹ dist/runtime.d.mts                                                              1.14 kB │ gzip:  0.60 kB
packages/core build: ℹ dist/astro/middleware/auth.d.mts                                                1.02 kB │ gzip:  0.52 kB
packages/core build: ℹ dist/seed/index.d.mts                                                           0.82 kB │ gzip:  0.33 kB
packages/core build: ℹ dist/astro/middleware/redirect.d.mts                                            0.72 kB │ gzip:  0.45 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress-plugin/execute.d.mts                     0.67 kB │ gzip:  0.38 kB
packages/core build: ℹ dist/astro/middleware/setup.d.mts                                               0.67 kB │ gzip:  0.40 kB
packages/core build: ℹ dist/astro/middleware/request-context.d.mts                                     0.64 kB │ gzip:  0.40 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/rewrite-urls.d.mts                       0.59 kB │ gzip:  0.33 kB
packages/core build: ℹ dist/astro/routes/api/settings.d.mts                                            0.58 kB │ gzip:  0.33 kB
packages/core build: ℹ dist/db/index.d.mts                                                             0.58 kB │ gzip:  0.27 kB
packages/core build: ℹ dist/astro/routes/api/settings/email.d.mts                                      0.53 kB │ gzip:  0.32 kB
packages/core build: ℹ dist/astro/routes/api/search/index.d.mts                                        0.51 kB │ gzip:  0.31 kB
packages/core build: ℹ dist/astro/routes/api/media/_id_.d.mts                                          0.51 kB │ gzip:  0.28 kB
packages/core build: ℹ dist/object-cache/memory.d.mts                                                  0.50 kB │ gzip:  0.34 kB
packages/core build: ℹ dist/astro/routes/api/import/probe.d.mts                                        0.50 kB │ gzip:  0.30 kB
packages/core build: ℹ dist/astro/routes/api/typegen.d.mts                                             0.49 kB │ gzip:  0.32 kB
packages/core build: ℹ dist/astro/routes/api/admin/api-tokens/index.d.mts                              0.48 kB │ gzip:  0.31 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress/prepare.d.mts                            0.47 kB │ gzip:  0.27 kB
packages/core build: ℹ dist/astro/routes/api/search/suggest.d.mts                                      0.47 kB │ gzip:  0.30 kB
packages/core build: ℹ dist/astro/routes/api/import/wordpress-plugin/analyze.d.mts                     0.47 kB │ gzip:  0.29 kB
packages/core build: ℹ dist/auth/providers/github.d.mts                                                0.45 kB │ gzip:  0.30 kB
packages/core build: ℹ dist/auth/providers/google.d.mts                                                0.45 kB │ gzip:  0.29 kB
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
packages/core build: ℹ dist/astro/routes/api/comments/_collection_/_contentId_/reactions.d.mts         0.29 kB │ gzip:  0.20 kB
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
packages/core build: ℹ dist/astro/routes/api/content/_collection_/authors.d.mts                        0.24 kB │ gzip:  0.18 kB
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
packages/core build: ℹ dist/astro/image-endpoint.d.mts                                                 0.22 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/schema/index.d.mts                                        0.22 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/manifest.d.mts                                            0.22 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/snapshot.d.mts                                            0.22 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/robots.txt.d.mts                                              0.22 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/astro/routes/api/auth/mode.d.mts                                           0.22 kB │ gzip:  0.17 kB
packages/core build: ℹ dist/cli/index.d.mts                                                            0.01 kB │ gzip:  0.03 kB
packages/core build: ℹ dist/index-BKnKlPqM.d.mts                                                     179.43 kB │ gzip: 49.47 kB
packages/core build: ℹ dist/byline-fields--hmN9XvS.d.mts                                              82.12 kB │ gzip:  9.56 kB
packages/core build: ℹ dist/types-DKwtts2d.d.mts                                                      41.82 kB │ gzip: 11.01 kB
packages/core build: ℹ dist/types-xIfVRNLp.d.mts                                                      14.69 kB │ gzip:  3.18 kB
packages/core build: ℹ dist/validate-9ECmtEpJ.d.mts                                                   10.04 kB │ gzip:  3.24 kB
packages/core build: ℹ dist/types-Dbqff978.d.mts                                                       9.78 kB │ gzip:  3.24 kB
packages/core build: ℹ dist/placeholder-Cuce9U-m.d.mts                                                 9.39 kB │ gzip:  3.12 kB
packages/core build: ℹ dist/types-ETmO_jQr.d.mts                                                       7.90 kB │ gzip:  3.04 kB
packages/core build: ℹ dist/index-DGIjmUXQ.d.mts                                                       7.74 kB │ gzip:  2.83 kB
packages/core build: ℹ dist/types-CNlaBFzx.d.mts                                                       6.54 kB │ gzip:  2.02 kB
packages/core build: ℹ dist/options-41nCWqi9.d.mts                                                     6.44 kB │ gzip:  2.43 kB
packages/core build: ℹ dist/types-CvuKO5Pn.d.mts                                                       6.19 kB │ gzip:  2.34 kB
packages/core build: ℹ dist/types-Y09-wtyU.d.mts                                                       5.06 kB │ gzip:  2.19 kB
packages/core build: ℹ dist/types-ByChcBgE.d.mts                                                       5.04 kB │ gzip:  1.78 kB
packages/core build: ℹ dist/adapters-u037EnTR.d.mts                                                    3.21 kB │ gzip:  1.32 kB
packages/core build: ℹ dist/types-BkZ8DUEI.d.mts                                                       2.64 kB │ gzip:  1.17 kB
packages/core build: ℹ dist/runner-BbR3DfrL.d.mts                                                      1.98 kB │ gzip:  0.93 kB
packages/core build: ℹ dist/transport-Blrl2k_o.d.mts                                                   1.67 kB │ gzip:  0.76 kB
packages/core build: ℹ dist/scheduled-publish-BMljtY5G.d.mts                                           0.30 kB │ gzip:  0.22 kB
packages/core build: ℹ 1063 files, total: 7905.09 kB
packages/core build: ✔ Build complete in 6617ms
packages/core build: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugin `rolldown-plugin-dts:generate`. See https://rolldown.rs/options/checks#plugintimings for more details.
packages/core build: Done
packages/cloudflare build$ tsdown
packages/plugins/atproto build$ node node_modules/@emdash-cms/plugin-cli/dist/index.mjs build
packages/plugins/audit-log build$ node node_modules/@emdash-cms/plugin-cli/dist/index.mjs build
packages/plugins/awcms-micro-docs build$ tsdown
packages/cloudflare build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/plugins/awcms-micro-docs build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/cloudflare build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/cloudflare/tsdown.config.ts
packages/cloudflare build: ℹ entry: src/index.ts, src/db/d1.ts, src/db/hyperdrive.ts, src/db/do.ts, src/db/do-sql.ts, src/db/playground.ts, src/db/playground-middleware.ts, src/storage/r2.ts, src/image-endpoint.ts, src/auth/index.ts, src/sandbox/index.ts, src/worker.ts, src/plugins/index.ts, src/plugins/cloudflare-email.ts, src/media/images-runtime.ts, src/media/stream-runtime.ts, src/cache/runtime.ts, src/cache/config.ts, src/cache/kv.ts
packages/cloudflare build: ℹ tsconfig: tsconfig.json
packages/cloudflare build: ℹ Build start
packages/cloudflare build: ℹ Cleaning 56 files
packages/plugins/awcms-micro-docs build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-docs/tsdown.config.ts
packages/plugins/awcms-micro-docs build: ℹ entry: src/index.ts, src/admin.tsx
packages/plugins/awcms-micro-docs build: ℹ target: es2023
packages/plugins/awcms-micro-docs build: ℹ tsconfig: tsconfig.json
packages/plugins/awcms-micro-docs build: ℹ Build start
packages/plugins/awcms-micro-docs build: ℹ Cleaning 10 files
packages/plugins/audit-log build: ◐ Building plugin...
packages/plugins/audit-log build: ℹ Manifest: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/audit-log/emdash-plugin.jsonc
packages/plugins/audit-log build: ℹ Plugin entry: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/audit-log/src/plugin.ts
packages/plugins/audit-log build: ℹ Package: @emdash-cms/plugin-audit-log
packages/plugins/atproto build: ◐ Building plugin...
packages/plugins/atproto build: ℹ Manifest: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/atproto/emdash-plugin.jsonc
packages/plugins/atproto build: ℹ Plugin entry: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/atproto/src/plugin.ts
packages/plugins/atproto build: ℹ Package: @emdash-cms/plugin-atproto
packages/plugins/audit-log build: ◐ Building runtime entry...
packages/plugins/audit-log build: ℹ entry: src/plugin.ts
packages/plugins/audit-log build: ℹ tsconfig: tsconfig.json
packages/plugins/audit-log build: ℹ Build start
packages/plugins/atproto build: ◐ Building runtime entry...
packages/plugins/atproto build: ℹ entry: src/plugin.ts
packages/plugins/atproto build: ℹ tsconfig: tsconfig.json
packages/plugins/atproto build: ℹ Build start
packages/plugins/audit-log build: ℹ ../../../../../../../../tmp/emdash-build-7ljlVW/runtime/plugin.mjs         4.80 kB │ gzip: 1.60 kB
packages/plugins/audit-log build: ℹ ../../../../../../../../tmp/emdash-build-7ljlVW/runtime/plugin.mjs.map    17.30 kB │ gzip: 4.37 kB
packages/plugins/audit-log build: ℹ ../../../../../../../../tmp/emdash-build-7ljlVW/runtime/plugin.d.mts.map   0.40 kB │ gzip: 0.21 kB
packages/plugins/audit-log build: ℹ ../../../../../../../../tmp/emdash-build-7ljlVW/runtime/plugin.d.mts       4.76 kB │ gzip: 0.81 kB
packages/plugins/audit-log build: ℹ 4 files, total: 27.26 kB
packages/plugins/audit-log build: ✔ Build complete in 1806ms
packages/plugins/audit-log build: ✔ Built plugin.mjs
packages/plugins/audit-log build: ◐ Probing plugin surface...
packages/plugins/audit-log build: ℹ entry: src/plugin.ts
packages/plugins/audit-log build: ℹ tsconfig: tsconfig.json
packages/plugins/audit-log build: ℹ Build start
packages/plugins/audit-log build: ℹ ../../../../../../../../tmp/emdash-build-7ljlVW/plugin-probe/plugin.mjs  8.20 kB │ gzip: 2.12 kB
packages/plugins/audit-log build: ℹ 1 files, total: 8.20 kB
packages/plugins/audit-log build: ✔ Build complete in 9ms
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
packages/plugins/atproto build: ℹ ../../../../../../../../tmp/emdash-build-sn3tgj/runtime/plugin.mjs        20.41 kB │ gzip:  6.02 kB
packages/plugins/atproto build: ℹ ../../../../../../../../tmp/emdash-build-sn3tgj/runtime/plugin.mjs.map    81.86 kB │ gzip: 18.76 kB
packages/plugins/atproto build: ℹ ../../../../../../../../tmp/emdash-build-sn3tgj/runtime/plugin.d.mts.map   0.79 kB │ gzip:  0.32 kB
packages/plugins/atproto build: ℹ ../../../../../../../../tmp/emdash-build-sn3tgj/runtime/plugin.d.mts       3.14 kB │ gzip:  0.80 kB
packages/plugins/atproto build: ℹ 4 files, total: 106.20 kB
packages/plugins/atproto build: ✔ Build complete in 1944ms
packages/plugins/atproto build: ✔ Built plugin.mjs
packages/plugins/atproto build: ◐ Probing plugin surface...
packages/plugins/atproto build: ℹ entry: src/plugin.ts
packages/plugins/atproto build: ℹ tsconfig: tsconfig.json
packages/plugins/atproto build: ℹ Build start
packages/plugins/atproto build: ℹ ../../../../../../../../tmp/emdash-build-sn3tgj/plugin-probe/plugin.mjs  37.45 kB │ gzip: 8.81 kB
packages/plugins/atproto build: ℹ 1 files, total: 37.45 kB
packages/plugins/atproto build: ✔ Build complete in 11ms
packages/plugins/atproto build: ℹ   Hooks: plugin:install, content:afterSave, content:afterPublish, content:afterDelete, page:metadata
packages/plugins/atproto build: ℹ   Routes: status, test-connection, sync-publication, recent-syncs, verification, admin
packages/plugins/atproto build: ✔ Wrote manifest.json
packages/plugins/atproto build: ◐ Generating descriptor module...
packages/plugins/atproto build: ✔ Wrote index.mjs
packages/plugins/atproto build: ✔ Plugin built: atproto@0.2.1
packages/plugins/atproto build: ℹ Output:
packages/plugins/atproto build:   /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/atproto/dist/index.mjs
packages/plugins/atproto build:   /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/atproto/dist/plugin.mjs
packages/plugins/atproto build:   /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/atproto/dist/manifest.json
.../plugins/awcms-micro-email-mailketing build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/plugins/atproto build: Done
packages/plugins/awcms-micro-gallery build$ tsdown
.../plugins/awcms-micro-email-mailketing build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-email-mailketing/tsdown.config.ts
.../plugins/awcms-micro-email-mailketing build: ℹ entry: src/index.ts, src/admin.tsx, src/sandbox.ts
.../plugins/awcms-micro-email-mailketing build: ℹ target: es2023
.../plugins/awcms-micro-email-mailketing build: ℹ tsconfig: tsconfig.json
.../plugins/awcms-micro-email-mailketing build: ℹ Build start
.../plugins/awcms-micro-email-mailketing build: ℹ Cleaning 8 files
packages/plugins/awcms-micro-gallery build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/cloudflare build: ℹ dist/db/playground-middleware.mjs       26.77 kB │ gzip:  8.07 kB
packages/cloudflare build: ℹ dist/db/do-sql.mjs                      21.74 kB │ gzip:  7.40 kB
packages/cloudflare build: ℹ dist/db/do.mjs                          17.43 kB │ gzip:  6.26 kB
packages/cloudflare build: ℹ dist/db/d1.mjs                          12.40 kB │ gzip:  4.72 kB
packages/cloudflare build: ℹ dist/index.mjs                          10.82 kB │ gzip:  4.01 kB
packages/cloudflare build: ℹ dist/db/hyperdrive.mjs                   8.36 kB │ gzip:  3.38 kB
packages/cloudflare build: ℹ dist/media/images-runtime.mjs            7.44 kB │ gzip:  2.19 kB
packages/cloudflare build: ℹ dist/media/stream-runtime.mjs            7.32 kB │ gzip:  2.27 kB
packages/cloudflare build: ℹ dist/cache/runtime.mjs                   6.89 kB │ gzip:  2.50 kB
packages/cloudflare build: ℹ dist/plugins/index.mjs                   5.47 kB │ gzip:  1.85 kB
packages/cloudflare build: ℹ dist/auth/index.mjs                      4.70 kB │ gzip:  1.86 kB
packages/cloudflare build: ℹ dist/storage/r2.mjs                      4.19 kB │ gzip:  1.55 kB
packages/cloudflare build: ℹ dist/plugins/cloudflare-email.mjs        3.73 kB │ gzip:  1.55 kB
packages/cloudflare build: ℹ dist/cache/kv.mjs                        3.11 kB │ gzip:  1.57 kB
packages/cloudflare build: ℹ dist/image-endpoint.mjs                  3.02 kB │ gzip:  1.34 kB
packages/cloudflare build: ℹ dist/worker.mjs                          2.52 kB │ gzip:  1.20 kB
packages/cloudflare build: ℹ dist/cache/config.mjs                    1.58 kB │ gzip:  0.82 kB
packages/cloudflare build: ℹ dist/db/playground.mjs                   1.14 kB │ gzip:  0.61 kB
packages/cloudflare build: ℹ dist/sandbox/index.mjs                   0.29 kB │ gzip:  0.17 kB
packages/cloudflare build: ℹ dist/runner-B3ZSHaY0.mjs                43.65 kB │ gzip: 11.91 kB
packages/cloudflare build: ℹ dist/do-class-DYgovHsQ.mjs               6.67 kB │ gzip:  2.66 kB
packages/cloudflare build: ℹ dist/d1-introspector-DodJMbYx.mjs        1.92 kB │ gzip:  0.92 kB
packages/cloudflare build: ℹ dist/do-playground-routes-CmwFeGwJ.mjs   1.63 kB │ gzip:  0.77 kB
packages/cloudflare build: ℹ dist/do-dialect-CU1pWN54.mjs             1.37 kB │ gzip:  0.56 kB
packages/cloudflare build: ℹ dist/index.d.mts                        15.04 kB │ gzip:  5.46 kB
packages/cloudflare build: ℹ dist/db/do-sql.d.mts                     3.98 kB │ gzip:  1.75 kB
packages/cloudflare build: ℹ dist/db/hyperdrive.d.mts                 3.76 kB │ gzip:  1.70 kB
packages/cloudflare build: ℹ dist/db/do.d.mts                         3.60 kB │ gzip:  1.46 kB
packages/cloudflare build: ℹ dist/db/d1.d.mts                         2.26 kB │ gzip:  1.04 kB
packages/cloudflare build: ℹ dist/plugins/cloudflare-email.d.mts      2.22 kB │ gzip:  0.96 kB
packages/cloudflare build: ℹ dist/auth/index.d.mts                    2.17 kB │ gzip:  0.93 kB
packages/cloudflare build: ℹ dist/cache/config.d.mts                  1.75 kB │ gzip:  0.83 kB
packages/cloudflare build: ℹ dist/db/playground.d.mts                 1.57 kB │ gzip:  0.79 kB
packages/cloudflare build: ℹ dist/cache/runtime.d.mts                 1.17 kB │ gzip:  0.52 kB
packages/cloudflare build: ℹ dist/plugins/index.d.mts                 1.07 kB │ gzip:  0.51 kB
packages/cloudflare build: ℹ dist/storage/r2.d.mts                    1.07 kB │ gzip:  0.52 kB
packages/cloudflare build: ℹ dist/worker.d.mts                        1.06 kB │ gzip:  0.46 kB
packages/cloudflare build: ℹ dist/db/playground-middleware.d.mts      0.82 kB │ gzip:  0.49 kB
packages/cloudflare build: ℹ dist/sandbox/index.d.mts                 0.38 kB │ gzip:  0.19 kB
packages/cloudflare build: ℹ dist/media/images-runtime.d.mts          0.36 kB │ gzip:  0.22 kB
packages/cloudflare build: ℹ dist/media/stream-runtime.d.mts          0.36 kB │ gzip:  0.22 kB
packages/cloudflare build: ℹ dist/cache/kv.d.mts                      0.18 kB │ gzip:  0.13 kB
packages/cloudflare build: ℹ dist/image-endpoint.d.mts                0.17 kB │ gzip:  0.14 kB
packages/cloudflare build: ℹ dist/wrapper-UO6E7tIu.d.mts              8.62 kB │ gzip:  2.50 kB
packages/cloudflare build: ℹ dist/do-sql-types-BRfvIdoO.d.mts         2.47 kB │ gzip:  1.09 kB
packages/cloudflare build: ℹ dist/do-class-iZ1os53l.d.mts             2.33 kB │ gzip:  1.09 kB
packages/cloudflare build: ℹ dist/images-8pzIkVKN.d.mts               2.10 kB │ gzip:  0.76 kB
packages/cloudflare build: ℹ dist/stream-Cq6HYyUK.d.mts               1.93 kB │ gzip:  0.74 kB
packages/cloudflare build: ℹ dist/do-types-BJix_n_E.d.mts             0.47 kB │ gzip:  0.30 kB
packages/cloudflare build: ℹ 49 files, total: 265.07 kB
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
packages/cloudflare build: ✔ Build complete in 2242ms
packages/plugins/awcms-micro-gallery build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-gallery/tsdown.config.ts
packages/plugins/awcms-micro-gallery build: ℹ entry: src/index.ts, src/sandbox.ts
packages/plugins/awcms-micro-gallery build: ℹ target: es2023
packages/plugins/awcms-micro-gallery build: ℹ tsconfig: tsconfig.json
packages/plugins/awcms-micro-gallery build: ℹ Build start
packages/plugins/awcms-micro-gallery build: ℹ Cleaning 10 files
packages/cloudflare build: Done
packages/plugins/awcms-micro-sikesra build$ tsdown
packages/plugins/awcms-micro-sikesra build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/plugins/awcms-micro-sikesra build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/tsdown.config.ts
packages/plugins/awcms-micro-sikesra build: ℹ entry: src/index.ts, src/admin.tsx, src/navigation.ts, src/sandbox.ts
packages/plugins/awcms-micro-sikesra build: ℹ target: es2023
packages/plugins/awcms-micro-sikesra build: ℹ tsconfig: tsconfig.json
packages/plugins/awcms-micro-sikesra build: ℹ Build start
packages/plugins/awcms-micro-sikesra build: ℹ Cleaning 11 files
packages/plugins/awcms-micro-docs build: ℹ dist/admin.js                  5.05 kB │ gzip: 1.02 kB
packages/plugins/awcms-micro-docs build: ℹ dist/index.js                  0.97 kB │ gzip: 0.45 kB
packages/plugins/awcms-micro-docs build: ℹ dist/content-s6AnXlIg.js.map  12.78 kB │ gzip: 3.61 kB
packages/plugins/awcms-micro-docs build: ℹ dist/content-s6AnXlIg.js       9.25 kB │ gzip: 3.05 kB
packages/plugins/awcms-micro-docs build: ℹ dist/admin.js.map              5.82 kB │ gzip: 1.54 kB
packages/plugins/awcms-micro-docs build: ℹ dist/index.js.map              1.51 kB │ gzip: 0.63 kB
packages/plugins/awcms-micro-docs build: ℹ dist/index.d.ts.map            0.58 kB │ gzip: 0.27 kB
packages/plugins/awcms-micro-docs build: ℹ dist/admin.d.ts.map            0.11 kB │ gzip: 0.12 kB
packages/plugins/awcms-micro-docs build: ℹ dist/index.d.ts                1.30 kB │ gzip: 0.51 kB
packages/plugins/awcms-micro-docs build: ℹ dist/admin.d.ts                0.19 kB │ gzip: 0.15 kB
packages/plugins/awcms-micro-docs build: ℹ 10 files, total: 37.57 kB
packages/plugins/awcms-micro-docs build: ✔ Build complete in 2883ms
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
packages/plugins/awcms-micro-gallery build: ✔ Build complete in 1849ms
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
.../plugins/awcms-micro-email-mailketing build: ℹ dist/admin.js              54.09 kB │ gzip: 7.63 kB
.../plugins/awcms-micro-email-mailketing build: ℹ dist/index.js               1.78 kB │ gzip: 0.61 kB
.../plugins/awcms-micro-email-mailketing build: ℹ dist/sandbox.js             0.26 kB │ gzip: 0.18 kB
.../plugins/awcms-micro-email-mailketing build: ℹ dist/runtime-reZKFWrt.js   35.19 kB │ gzip: 7.26 kB
.../plugins/awcms-micro-email-mailketing build: ℹ dist/messages-BWIQRjzR.js  13.93 kB │ gzip: 3.06 kB
.../plugins/awcms-micro-email-mailketing build: ℹ dist/index.d.ts             0.71 kB │ gzip: 0.32 kB
.../plugins/awcms-micro-email-mailketing build: ℹ dist/sandbox.d.ts           0.44 kB │ gzip: 0.27 kB
.../plugins/awcms-micro-email-mailketing build: ℹ dist/admin.d.ts             0.21 kB │ gzip: 0.15 kB
.../plugins/awcms-micro-email-mailketing build: ℹ 8 files, total: 106.61 kB
.../plugins/awcms-micro-email-mailketing build: ✔ Build complete in 3715ms
.../plugins/awcms-micro-email-mailketing build: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugin `rolldown-plugin-dts:generate`. See https://rolldown.rs/options/checks#plugintimings for more details.
.../plugins/awcms-micro-email-mailketing build: Done
packages/plugins/sandboxed-test build$ node node_modules/@emdash-cms/plugin-cli/dist/index.mjs build
packages/plugins/awcms-micro-sikesra build: ℹ dist/admin.js                           364.00 kB │ gzip: 54.79 kB
packages/plugins/awcms-micro-sikesra build: ℹ dist/index.js                             2.79 kB │ gzip:  0.99 kB
packages/plugins/awcms-micro-sikesra build: ℹ dist/navigation.js                        0.78 kB │ gzip:  0.32 kB
packages/plugins/awcms-micro-sikesra build: ℹ dist/sandbox.js                           0.30 kB │ gzip:  0.22 kB
packages/plugins/awcms-micro-sikesra build: ℹ dist/runtime-NtGB6YT_.js                382.84 kB │ gzip: 78.18 kB
packages/plugins/awcms-micro-sikesra build: ℹ dist/field-standards-DPRMDU-F.js         30.46 kB │ gzip:  5.13 kB
packages/plugins/awcms-micro-sikesra build: ℹ dist/AwcmsPluginHeaderMenu-V7ITPBZD.js   13.98 kB │ gzip:  3.29 kB
packages/plugins/awcms-micro-sikesra build: ℹ dist/index.d.ts                           7.29 kB │ gzip:  1.91 kB
packages/plugins/awcms-micro-sikesra build: ℹ dist/navigation.d.ts                      6.04 kB │ gzip:  1.38 kB
packages/plugins/awcms-micro-sikesra build: ℹ dist/admin.d.ts                           3.20 kB │ gzip:  1.04 kB
packages/plugins/awcms-micro-sikesra build: ℹ dist/sandbox.d.ts                         2.51 kB │ gzip:  0.53 kB
packages/plugins/awcms-micro-sikesra build: ℹ 11 files, total: 814.19 kB
packages/plugins/awcms-micro-sikesra build: ✔ Build complete in 3659ms
packages/plugins/awcms-micro-sikesra build: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugin `rolldown-plugin-dts:generate`. See https://rolldown.rs/options/checks#plugintimings for more details.
packages/plugins/sandboxed-test build: ◐ Building plugin...
packages/plugins/sandboxed-test build: ℹ Manifest: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/sandboxed-test/emdash-plugin.jsonc
packages/plugins/sandboxed-test build: ℹ Plugin entry: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/sandboxed-test/src/plugin.ts
packages/plugins/sandboxed-test build: ℹ Package: @emdash-cms/plugin-sandboxed-test
.../plugins/awcms-micro-website-social build: ℹ dist/admin.js        5.02 kB │ gzip: 1.83 kB
.../plugins/awcms-micro-website-social build: ℹ dist/index.js        1.17 kB │ gzip: 0.47 kB
.../plugins/awcms-micro-website-social build: ℹ dist/admin.js.map    6.88 kB │ gzip: 2.51 kB
.../plugins/awcms-micro-website-social build: ℹ dist/index.js.map    1.66 kB │ gzip: 0.67 kB
.../plugins/awcms-micro-website-social build: ℹ dist/index.d.ts.map  0.20 kB │ gzip: 0.16 kB
.../plugins/awcms-micro-website-social build: ℹ dist/admin.d.ts.map  0.11 kB │ gzip: 0.12 kB
.../plugins/awcms-micro-website-social build: ℹ dist/index.d.ts      0.70 kB │ gzip: 0.33 kB
.../plugins/awcms-micro-website-social build: ℹ dist/admin.d.ts      0.19 kB │ gzip: 0.15 kB
.../plugins/awcms-micro-website-social build: ℹ 8 files, total: 15.93 kB
.../plugins/awcms-micro-website-social build: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugins. Here is a breakdown:
.../plugins/awcms-micro-website-social build:   - rolldown-plugin-dts:generate (80%)
.../plugins/awcms-micro-website-social build:   - tsdown:external (20%)
.../plugins/awcms-micro-website-social build: See https://rolldown.rs/options/checks#plugintimings for more details.
.../plugins/awcms-micro-website-social build: ✔ Build complete in 3069ms
packages/plugins/awcms-micro-sikesra build: Done
packages/plugins/webhook-notifier build$ node node_modules/@emdash-cms/plugin-cli/dist/index.mjs build
packages/plugins/sandboxed-test build: ◐ Building runtime entry...
packages/plugins/sandboxed-test build: ℹ entry: src/plugin.ts
packages/plugins/sandboxed-test build: ℹ tsconfig: tsconfig.json
packages/plugins/sandboxed-test build: ℹ Build start
.../plugins/awcms-micro-website-social build: Done
packages/workerd build$ tsdown
packages/workerd build: ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
packages/workerd build: ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/workerd/tsdown.config.ts
packages/workerd build: ℹ entry: src/index.ts, src/sandbox/index.ts
packages/workerd build: ℹ tsconfig: tsconfig.json
packages/workerd build: ℹ Build start
packages/workerd build: ℹ Cleaning 7 files
packages/plugins/marketplace-test build: ℹ ../../../../../../../../tmp/emdash-build-CPiLVZ/runtime/plugin.mjs        0.58 kB │ gzip: 0.34 kB
packages/plugins/marketplace-test build: ℹ ../../../../../../../../tmp/emdash-build-CPiLVZ/runtime/plugin.mjs.map    2.47 kB │ gzip: 1.12 kB
packages/plugins/marketplace-test build: ℹ ../../../../../../../../tmp/emdash-build-CPiLVZ/runtime/plugin.d.mts.map  0.18 kB │ gzip: 0.15 kB
packages/plugins/marketplace-test build: ℹ ../../../../../../../../tmp/emdash-build-CPiLVZ/runtime/plugin.d.mts      1.59 kB │ gzip: 0.70 kB
packages/plugins/marketplace-test build: ℹ 4 files, total: 4.82 kB
packages/plugins/marketplace-test build: ✔ Build complete in 1938ms
packages/plugins/marketplace-test build: ✔ Built plugin.mjs
packages/plugins/marketplace-test build: ◐ Probing plugin surface...
packages/plugins/marketplace-test build: ℹ entry: src/plugin.ts
packages/plugins/marketplace-test build: ℹ tsconfig: tsconfig.json
packages/plugins/marketplace-test build: ℹ Build start
packages/plugins/webhook-notifier build: ◐ Building plugin...
packages/plugins/marketplace-test build: ℹ ../../../../../../../../tmp/emdash-build-CPiLVZ/plugin-probe/plugin.mjs  0.85 kB │ gzip: 0.44 kB
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
packages/plugins/webhook-notifier build: ℹ Manifest: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/webhook-notifier/emdash-plugin.jsonc
packages/plugins/webhook-notifier build: ℹ Plugin entry: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/webhook-notifier/src/plugin.ts
packages/plugins/webhook-notifier build: ℹ Package: @emdash-cms/plugin-webhook-notifier
packages/plugins/marketplace-test build: Done
packages/plugins/webhook-notifier build: ◐ Building runtime entry...
packages/plugins/webhook-notifier build: ℹ entry: src/plugin.ts
packages/plugins/webhook-notifier build: ℹ tsconfig: tsconfig.json
packages/plugins/webhook-notifier build: ℹ Build start
packages/workerd build: ℹ dist/sandbox/index.mjs               0.24 kB │ gzip:  0.15 kB
packages/workerd build: ℹ dist/index.mjs                       0.18 kB │ gzip:  0.13 kB
packages/workerd build: ℹ dist/runner-DPvq5mbQ.mjs            83.97 kB │ gzip: 21.86 kB
packages/workerd build: ℹ dist/sandbox/index.d.mts             0.25 kB │ gzip:  0.15 kB
packages/workerd build: ℹ dist/index.d.mts                     0.18 kB │ gzip:  0.14 kB
packages/workerd build: ℹ dist/bridge-handler-O1ayzB49.d.mts  11.52 kB │ gzip:  3.97 kB
packages/workerd build: ℹ 6 files, total: 96.34 kB
packages/workerd build: ✔ Build complete in 1785ms
packages/workerd build: Done
packages/plugins/sandboxed-test build: ℹ ../../../../../../../../tmp/emdash-build-XqGM0P/runtime/plugin.mjs        19.59 kB │ gzip:  5.31 kB
packages/plugins/sandboxed-test build: ℹ ../../../../../../../../tmp/emdash-build-XqGM0P/runtime/plugin.mjs.map    62.07 kB │ gzip: 13.43 kB
packages/plugins/sandboxed-test build: ℹ ../../../../../../../../tmp/emdash-build-XqGM0P/runtime/plugin.d.mts.map   1.75 kB │ gzip:  0.37 kB
packages/plugins/sandboxed-test build: ℹ ../../../../../../../../tmp/emdash-build-XqGM0P/runtime/plugin.d.mts       8.47 kB │ gzip:  1.15 kB
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
packages/plugins/sandboxed-test build: ✔ Build complete in 2039ms
packages/plugins/sandboxed-test build: ✔ Built plugin.mjs
packages/plugins/sandboxed-test build: ◐ Probing plugin surface...
packages/plugins/sandboxed-test build: ℹ entry: src/plugin.ts
packages/plugins/sandboxed-test build: ℹ tsconfig: tsconfig.json
packages/plugins/sandboxed-test build: ℹ Build start
packages/plugins/sandboxed-test build: ℹ ../../../../../../../../tmp/emdash-build-XqGM0P/plugin-probe/plugin.mjs  29.37 kB │ gzip: 6.51 kB
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
packages/plugins/sandboxed-test build: ✔ Build complete in 13ms
packages/plugins/sandboxed-test build: src/plugin.ts (1049:2) [33m[EVAL] Warning:[0m Use of direct `eval` function is strongly discouraged as it poses security risks and may cause issues with minification.
packages/plugins/sandboxed-test build:       [38;5;246m╭[0m[38;5;246m─[0m[38;5;246m[[0m src/plugin.ts:1049:3 [38;5;246m][0m
packages/plugins/sandboxed-test build:       [38;5;246m│[0m
packages/plugins/sandboxed-test build:  [38;5;246m1049 │[0m [38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0meval[38;5;249m([0m[38;5;249m"[0m[38;5;249m1[0m[38;5;249m+[0m[38;5;249m1[0m[38;5;249m"[0m[38;5;249m)[0m[38;5;249m;[0m
packages/plugins/sandboxed-test build:  [38;5;240m     │[0m        ──┬─
packages/plugins/sandboxed-test build:  [38;5;240m     │[0m          ╰─── Use of direct `eval` here.
packages/plugins/sandboxed-test build:  [38;5;240m     │[0m
packages/plugins/sandboxed-test build:  [38;5;240m     │[0m [38;5;115mHelp[0m: Consider using indirect eval. For more information, check the documentation: https://rolldown.rs/guide/troubleshooting#avoiding-direct-eval
packages/plugins/sandboxed-test build: [38;5;246m──────╯[0m
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
packages/plugins/webhook-notifier build: ℹ ../../../../../../../../tmp/emdash-build-h1vv14/runtime/plugin.mjs         9.25 kB │ gzip: 3.05 kB
packages/plugins/webhook-notifier build: ℹ ../../../../../../../../tmp/emdash-build-h1vv14/runtime/plugin.mjs.map    28.71 kB │ gzip: 7.20 kB
packages/plugins/webhook-notifier build: ℹ ../../../../../../../../tmp/emdash-build-h1vv14/runtime/plugin.d.mts.map   0.30 kB │ gzip: 0.21 kB
packages/plugins/webhook-notifier build: ℹ ../../../../../../../../tmp/emdash-build-h1vv14/runtime/plugin.d.mts       2.94 kB │ gzip: 0.70 kB
packages/plugins/webhook-notifier build: ℹ 4 files, total: 41.20 kB
packages/plugins/webhook-notifier build: ✔ Build complete in 1843ms
packages/plugins/webhook-notifier build: ✔ Built plugin.mjs
packages/plugins/webhook-notifier build: ◐ Probing plugin surface...
packages/plugins/webhook-notifier build: ℹ entry: src/plugin.ts
packages/plugins/webhook-notifier build: ℹ tsconfig: tsconfig.json
packages/plugins/webhook-notifier build: ℹ Build start
packages/plugins/webhook-notifier build: ℹ ../../../../../../../../tmp/emdash-build-h1vv14/plugin-probe/plugin.mjs  14.88 kB │ gzip: 3.94 kB
packages/plugins/webhook-notifier build: ℹ 1 files, total: 14.88 kB
packages/plugins/webhook-notifier build: ✔ Build complete in 7ms
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
$ node scripts/relink-bins-if-needed.mjs
$ pnpm typecheck
==> pnpm-typecheck
$ pnpm run --filter {./packages/**} typecheck
Scope: 34 of 66 workspace projects
packages/atproto-test-utils typecheck$ tsgo --noEmit
packages/auth typecheck$ tsgo --noEmit
packages/blocks typecheck$ tsgo --noEmit
packages/contentful-to-portable-text typecheck$ tsgo --noEmit
packages/atproto-test-utils typecheck: Done
packages/create-emdash typecheck$ tsgo --noEmit
packages/contentful-to-portable-text typecheck: Done
packages/gutenberg-to-portable-text typecheck$ tsgo --noEmit
packages/create-emdash typecheck: Done
packages/auth typecheck: Done
packages/marketplace typecheck$ tsc --noEmit
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
packages/plugins/audit-log typecheck$ tsgo --noEmit
packages/plugins/atproto typecheck$ tsgo --noEmit
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
.../plugins/awcms-micro-email-mailketing typecheck: Done
packages/plugins/field-kit typecheck$ tsgo --noEmit
packages/plugins/embeds typecheck: Done
packages/plugins/forms typecheck$ tsgo --noEmit
packages/plugins/forms typecheck: Done
packages/plugins/marketplace-test typecheck$ tsgo --noEmit
packages/plugins/field-kit typecheck: Done
packages/plugins/sandboxed-test typecheck$ tsgo --noEmit
packages/plugins/marketplace-test typecheck: Done
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
{"message": "Each then() should return a value or throw","code": "promise(always-return)","severity": "warning","causes": [],"url": "https://oxc.rs/docs/guide/usage/linter/rules/promise/always-return.html","filename": "packages/plugins/awcms-micro-email-mailketing/src/admin.tsx","labels": [{"span": {"offset": 16399,"length": 256,"line": 457,"column": 10}}],"related": []},
{"message": "Each then() should return a value or throw","code": "promise(always-return)","severity": "warning","causes": [],"url": "https://oxc.rs/docs/guide/usage/linter/rules/promise/always-return.html","filename": "packages/plugins/awcms-micro-email-mailketing/src/admin.tsx","labels": [{"span": {"offset": 23176,"length": 79,"line": 657,"column": 10}}],"related": []}],
              "number_of_files": 2237,
              "number_of_rules": 139,
              "threads_count": 20,
              "start_time": 2.227637149
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
   Start at  16:04:17
   Duration  1.37s (transform 305ms, setup 0ms, import 1.26s, tests 19ms, environment 0ms)

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
   Start at  16:04:20
   Duration  2.51s (transform 1.21s, setup 0ms, import 2.40s, tests 10ms, environment 0ms)

$ vitest run tests/plugin.test.ts -t 'declares admin pages'

 RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-sikesra


 Test Files  1 passed (1)
      Tests  1 passed | 144 skipped (145)
   Start at  16:04:23
   Duration  2.60s (transform 1.32s, setup 0ms, import 2.51s, tests 4ms, environment 0ms)

$ tsc --noEmit -p tsconfig.json
$ vitest run

 RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-sikesra


 Test Files  7 passed (7)
      Tests  206 passed (206)
   Start at  16:04:31
   Duration  2.85s (transform 3.44s, setup 0ms, import 6.38s, tests 462ms, environment 1ms)

$ tsdown
ℹ tsdown v0.20.3 powered by rolldown v1.0.0-rc.3
ℹ config file: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/tsdown.config.ts
ℹ entry: src/index.ts, src/admin.tsx, src/navigation.ts, src/sandbox.ts
ℹ target: es2023
ℹ tsconfig: tsconfig.json
ℹ Build start
ℹ Cleaning 11 files
ℹ dist/admin.js                           364.00 kB │ gzip: 54.79 kB
ℹ dist/index.js                             2.79 kB │ gzip:  0.99 kB
ℹ dist/navigation.js                        0.78 kB │ gzip:  0.32 kB
ℹ dist/sandbox.js                           0.30 kB │ gzip:  0.22 kB
ℹ dist/runtime-NtGB6YT_.js                382.84 kB │ gzip: 78.18 kB
ℹ dist/field-standards-DPRMDU-F.js         30.46 kB │ gzip:  5.13 kB
ℹ dist/AwcmsPluginHeaderMenu-V7ITPBZD.js   13.98 kB │ gzip:  3.29 kB
ℹ dist/index.d.ts                           7.29 kB │ gzip:  1.91 kB
ℹ dist/navigation.d.ts                      6.04 kB │ gzip:  1.38 kB
ℹ dist/admin.d.ts                           3.20 kB │ gzip:  1.04 kB
ℹ dist/sandbox.d.ts                         2.51 kB │ gzip:  0.53 kB
ℹ 11 files, total: 814.19 kB
✔ Build complete in 2501ms
$ pnpm --filter @emdash-cms/admin exec node --run locale:compile
==> pnpm-admin-locale-compile
Compiling message catalogs…
Done in 643ms
$ pnpm --filter @emdash-cms/admin exec playwright install chromium
==> playwright-install-chromium
BEWARE: your OS is not officially supported by Playwright; downloading fallback build for ubuntu24.04-x64.
BEWARE: your OS is not officially supported by Playwright; downloading fallback build for ubuntu24.04-x64.
BEWARE: your OS is not officially supported by Playwright; downloading fallback build for ubuntu24.04-x64.
$ pnpm test
==> pnpm-test
$ pnpm run --filter {./packages/*} test
Scope: 17 of 66 workspace projects
packages/atproto-test-utils test$ vitest run
packages/auth test$ vitest
packages/blocks test$ vitest
packages/contentful-to-portable-text test$ vitest
packages/auth test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/auth
packages/contentful-to-portable-text test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/contentful-to-portable-text
packages/blocks test: 4:04:40 PM [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
packages/blocks test: `optimizeDeps.rollupOptions` / `ssr.optimizeDeps.rollupOptions` is deprecated. Use `optimizeDeps.rolldownOptions` instead. Note that this option may be set by a plugin. Set VITE_DEPRECATION_TRACE=1 to see where it is called.
packages/blocks test: Both esbuild and oxc options were set. oxc options will be used and esbuild options will be ignored. The following esbuild options were set: `{ jsx: 'automatic', jsxImportSource: undefined }`
packages/blocks test: [vite:react-babel] We recommend switching to `@vitejs/plugin-react-oxc` for improved performance. More information at https://vite.dev/rolldown
packages/atproto-test-utils test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/atproto-test-utils
packages/blocks test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/blocks
packages/contentful-to-portable-text test:  Test Files  2 passed (2)
packages/contentful-to-portable-text test:       Tests  60 passed (60)
packages/contentful-to-portable-text test:    Start at  16:04:40
packages/contentful-to-portable-text test:    Duration  270ms (transform 194ms, setup 0ms, import 261ms, tests 35ms, environment 0ms)
packages/contentful-to-portable-text test: Done
packages/create-emdash test$ vitest run
packages/auth test:  Test Files  5 passed (5)
packages/auth test:       Tests  57 passed (57)
packages/auth test:    Start at  16:04:40
packages/auth test:    Duration  354ms (transform 261ms, setup 0ms, import 518ms, tests 345ms, environment 1ms)
packages/auth test: Done
packages/gutenberg-to-portable-text test$ vitest
packages/create-emdash test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/create-emdash
packages/gutenberg-to-portable-text test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/gutenberg-to-portable-text
packages/atproto-test-utils test:  Test Files  1 passed (1)
packages/atproto-test-utils test:       Tests  17 passed (17)
packages/atproto-test-utils test:    Start at  16:04:40
packages/atproto-test-utils test:    Duration  568ms (transform 92ms, setup 0ms, import 297ms, tests 155ms, environment 0ms)
packages/atproto-test-utils test: Done
packages/marketplace test$ vitest
packages/create-emdash test:  Test Files  2 passed (2)
packages/create-emdash test:       Tests  103 passed (103)
packages/create-emdash test:    Start at  16:04:41
packages/create-emdash test:    Duration  202ms (transform 61ms, setup 0ms, import 101ms, tests 43ms, environment 0ms)
packages/create-emdash test: Done
packages/plugin-types test$ vitest run
packages/marketplace test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/marketplace
packages/gutenberg-to-portable-text test:  Test Files  2 passed (2)
packages/gutenberg-to-portable-text test:       Tests  140 passed (140)
packages/gutenberg-to-portable-text test:    Start at  16:04:41
packages/gutenberg-to-portable-text test:    Duration  314ms (transform 172ms, setup 0ms, import 276ms, tests 64ms, environment 0ms)
packages/gutenberg-to-portable-text test: Done
packages/registry-lexicons test$ vitest run
packages/blocks test:  Test Files  3 passed (3)
packages/blocks test:       Tests  97 passed (97)
packages/blocks test:    Start at  16:04:40
packages/blocks test:    Duration  927ms (transform 361ms, setup 0ms, import 737ms, tests 309ms, environment 1.00s)
packages/blocks test: Done
packages/x402 test$ vitest
packages/marketplace test:  Test Files  4 passed (4)
packages/marketplace test:       Tests  43 passed (43)
packages/marketplace test:    Start at  16:04:41
packages/marketplace test:    Duration  178ms (transform 149ms, setup 0ms, import 243ms, tests 37ms, environment 0ms)
packages/marketplace test: Done
packages/plugin-types test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugin-types
packages/registry-lexicons test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-lexicons
packages/x402 test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/x402
packages/plugin-types test:  Test Files  2 passed (2)
packages/plugin-types test:       Tests  32 passed (32)
packages/plugin-types test:    Start at  16:04:41
packages/plugin-types test:    Duration  193ms (transform 49ms, setup 0ms, import 91ms, tests 49ms, environment 0ms)
packages/plugin-types test: Done
packages/registry-lexicons test:  Test Files  1 passed (1)
packages/registry-lexicons test:       Tests  10 passed (10)
packages/registry-lexicons test:    Start at  16:04:41
packages/registry-lexicons test:    Duration  235ms (transform 86ms, setup 0ms, import 129ms, tests 10ms, environment 0ms)
packages/x402 test:  Test Files  1 passed (1)
packages/x402 test:       Tests  17 passed (17)
packages/x402 test:    Start at  16:04:41
packages/x402 test:    Duration  200ms (transform 56ms, setup 0ms, import 62ms, tests 43ms, environment 0ms)
packages/x402 test: Done
packages/registry-lexicons test: Done
packages/registry-client test$ vitest run
packages/registry-client test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-client
packages/registry-client test:  Test Files  4 passed (4)
packages/registry-client test:       Tests  70 passed (70)
packages/registry-client test:    Start at  16:04:42
packages/registry-client test:    Duration  273ms (transform 225ms, setup 0ms, import 396ms, tests 94ms, environment 0ms)
packages/registry-client test: Done
packages/admin test$ vitest
packages/plugin-cli test$ vitest run
packages/plugin-cli test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugin-cli
packages/admin test: 4:04:42 PM [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
packages/admin test: `optimizeDeps.rollupOptions` / `ssr.optimizeDeps.rollupOptions` is deprecated. Use `optimizeDeps.rolldownOptions` instead. Note that this option may be set by a plugin. Set VITE_DEPRECATION_TRACE=1 to see where it is called.
packages/admin test: Both esbuild and oxc options were set. oxc options will be used and esbuild options will be ignored. The following esbuild options were set: `{ jsx: 'automatic', jsxImportSource: undefined }`
packages/admin test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin
packages/admin test: Loaded  vitest@4.1.5  and  @vitest/browser@4.1.9 .
packages/admin test: Running mixed versions is not supported and may lead into bugs
packages/admin test: Update your dependencies and make sure the versions match.
packages/admin test: 4:04:42 PM [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
packages/admin test: `optimizeDeps.rollupOptions` / `ssr.optimizeDeps.rollupOptions` is deprecated. Use `optimizeDeps.rolldownOptions` instead. Note that this option may be set by a plugin. Set VITE_DEPRECATION_TRACE=1 to see where it is called.
packages/admin test: You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/editor/slash-menu.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/editor/toolbar.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/editor/bubble-menu.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/components/RevisionHistory.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test: 4:04:49 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:49 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:49 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:49 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:49 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:49 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:49 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:49 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:49 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:49 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:49 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:49 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:49 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:49 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:49 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:49 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:49 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:49 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:49 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:49 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:49 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:49 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:49 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:49 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:49 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:50 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/editor/block-menu.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:51 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] Warning: useRouter must be used inside a <RouterProvider> component!
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:52 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:53 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:53 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/components/settings/AllowedDomainsSettings.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test: 4:04:53 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:53 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:53 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:53 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:54 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:54 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:54 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:54 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:54 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:54 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:54 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:54 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:54 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/plugin-cli test:  Test Files  20 passed (20)
packages/plugin-cli test:       Tests  393 passed (393)
packages/plugin-cli test:    Start at  16:04:42
packages/plugin-cli test:    Duration  11.63s (transform 3.51s, setup 0ms, import 6.67s, tests 11.72s, environment 2ms)
packages/admin test: 4:04:54 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/components/users/UserDetail.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/plugin-cli test: Done
packages/admin test: 4:04:54 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:54 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:54 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:54 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:54 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:54 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:54 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:54 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:54 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:54 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:54 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:54 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:54 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:54 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:54 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:54 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:55 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:55 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:55 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:55 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:55 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:55 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:55 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:55 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:55 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:56 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:56 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:56 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:56 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:56 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:56 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:57 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:57 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:57 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:57 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/components/users/InviteUserModal.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test: 4:04:57 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:57 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:57 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:57 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:57 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:57 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:57 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:57 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:57 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:57 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:57 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:58 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:58 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:58 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:58 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:58 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:59 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:59 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:59 PM [vite] (client) [console.error] An update to LocaleButton inside a test was not wrapped in act(...).
packages/admin test: When testing, code that causes React state updates should be wrapped into act(...):
packages/admin test: act(() => {
packages/admin test:   /* fire events that update state */
packages/admin test: });
packages/admin test: /* assert on the output */
packages/admin test: This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
packages/admin test: 4:04:59 PM [vite] (client) [console.error] An update to LocaleDirectionProvider inside a test was not wrapped in act(...).
packages/admin test: When testing, code that causes React state updates should be wrapped into act(...):
packages/admin test: act(() => {
packages/admin test:   /* fire events that update state */
packages/admin test: });
packages/admin test: /* assert on the output */
packages/admin test: This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
packages/admin test: 4:04:59 PM [vite] (client) [console.error] An update to I18nProvider inside a test was not wrapped in act(...).
packages/admin test: When testing, code that causes React state updates should be wrapped into act(...):
packages/admin test: act(() => {
packages/admin test:   /* fire events that update state */
packages/admin test: });
packages/admin test: /* assert on the output */
packages/admin test: This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
packages/admin test: 4:04:59 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:59 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:59 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:59 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:59 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:59 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:59 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:59 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:59 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:04:59 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:05:00 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:05:00 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test: 4:05:00 PM [vite] (client) [console.warn] [Kumo Input]: Input must have an accessible name. Provide either:
packages/admin test:   - label prop: <Input label='Email' />
packages/admin test:   - aria-label: <Input aria-label='Email address' />
packages/admin test:   - aria-labelledby for custom label association
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/lib/hooks.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  Test Files  84 passed (84)
packages/admin test:       Tests  1030 passed (1030)
packages/admin test:    Start at  16:04:42
packages/admin test:    Duration  21.54s (transform 0ms, setup 9.10s, import 123.68s, tests 68.99s, environment 0ms)
packages/admin test: Done
packages/auth-atproto test$ vitest run
packages/core test$ vitest
packages/auth-atproto test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/auth-atproto
packages/core test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/core
packages/auth-atproto test:  Test Files  3 passed (3)
packages/auth-atproto test:       Tests  27 passed (27)
packages/auth-atproto test:    Start at  16:05:04
packages/auth-atproto test:    Duration  351ms (transform 121ms, setup 0ms, import 221ms, tests 259ms, environment 0ms)
packages/auth-atproto test: Done
packages/core test:  Test Files  314 passed (314)
packages/core test:       Tests  4278 passed (4278)
packages/core test:    Start at  16:05:04
packages/core test:    Duration  24.65s (transform 41.37s, setup 0ms, import 188.67s, tests 210.63s, environment 40ms)
packages/core test: Done
packages/cloudflare test$ vitest run
packages/workerd test$ vitest run
packages/workerd test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/workerd
packages/cloudflare test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/cloudflare
packages/cloudflare test:  Test Files  15 passed (15)
packages/cloudflare test:       Tests  214 passed (214)
packages/cloudflare test:    Start at  16:05:29
packages/cloudflare test:    Duration  1.81s (transform 3.29s, setup 0ms, import 5.15s, tests 281ms, environment 2ms)
packages/cloudflare test: Done
packages/workerd test:  Test Files  11 passed (11)
packages/workerd test:       Tests  73 passed (73)
packages/workerd test:    Start at  16:05:29
packages/workerd test:    Duration  9.64s (transform 7.73s, setup 0ms, import 14.08s, tests 8.88s, environment 1ms)
packages/workerd test: Done
```
