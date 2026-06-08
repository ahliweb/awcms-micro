# Last Validation

## Validation Run Metadata

- Date:
  - Started: 2026-06-08T14:30:33Z
  - Completed: 2026-06-08T14:33:02Z
- Operator: unggul
- Branch: `main`
- Upstream commit SHA: `1986dd45427ecd59da28674affb66e892fa47307`
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
Scope: all 62 workspace projects
[WARN] There are cyclic workspace dependencies: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/auth-atproto, /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/core
Lockfile is up to date, resolution step is skipped
Progress: resolved 1, reused 0, downloaded 0, added 0
Packages: +1651
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Progress: resolved 1651, reused 1622, downloaded 0, added 1651, done

devDependencies:
+ @axe-core/playwright 4.11.3
+ @changesets/changelog-github 0.7.0
+ @changesets/cli 2.31.0
+ @e18e/eslint-plugin 0.5.0
+ @lunariajs/core 0.1.1
+ @playwright/test 1.60.0
+ @types/node 24.10.13
+ @typescript/native-preview 7.0.0-dev.20260421.2
+ emdash 0.17.2 <- packages/core
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
.../plugins/awcms-micro-website-social prepare$ node --run build
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-docs/tsdown.config.ts[24m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m entry: [34msrc/index.ts, src/admin.tsx[39m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m target: [34mes2023[39m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m Build start
.../plugins/awcms-micro-website-social prepare: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/plugins/awcms-micro-docs prepare: [34mℹ[39m Cleaning 10 files
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/tsdown.config.ts[24m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m entry: [34msrc/index.ts, src/admin.tsx, src/navigation.ts, src/sandbox.ts[39m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m target: [34mes2023[39m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m Build start
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m Cleaning 11 files
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-gallery/tsdown.config.ts[24m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m entry: [34msrc/index.ts, src/sandbox.ts[39m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m target: [34mes2023[39m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m Build start
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m Cleaning 10 files
.../plugins/awcms-micro-website-social prepare: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-website-social/tsdown.config.ts[24m
.../plugins/awcms-micro-website-social prepare: [34mℹ[39m entry: [34msrc/index.ts, src/admin.tsx[39m
.../plugins/awcms-micro-website-social prepare: [34mℹ[39m target: [34mes2023[39m
.../plugins/awcms-micro-website-social prepare: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
.../plugins/awcms-micro-website-social prepare: [34mℹ[39m Build start
.../plugins/awcms-micro-website-social prepare: [34mℹ[39m Cleaning 8 files
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22m[1mindex.mjs[22m                    [2m29.33 kB[22m [2m│ gzip:  6.78 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22m[1msandbox.mjs[22m                  [2m26.63 kB[22m [2m│ gzip:  6.02 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22mindex.mjs.map                [2m55.59 kB[22m [2m│ gzip: 12.29 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22msandbox.mjs.map              [2m51.85 kB[22m [2m│ gzip: 11.35 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22mvalidation-IIdTEAKI.mjs.map  [2m28.07 kB[22m [2m│ gzip:  6.75 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22mvalidation-IIdTEAKI.mjs      [2m17.00 kB[22m [2m│ gzip:  4.47 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22mindex.d.mts.map              [2m 0.87 kB[22m [2m│ gzip:  0.36 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22msandbox.d.mts.map            [2m 0.12 kB[22m [2m│ gzip:  0.12 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.mts[22m[39m                  [2m 3.57 kB[22m [2m│ gzip:  1.02 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m [2mdist/[22m[32m[1msandbox.d.mts[22m[39m                [2m 0.21 kB[22m [2m│ gzip:  0.16 kB[22m
packages/plugins/awcms-micro-gallery prepare: [34mℹ[39m 10 files, total: 213.24 kB
packages/plugins/awcms-micro-gallery prepare: [32m✔[39m Build complete in [32m2557ms[39m
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
packages/plugins/awcms-micro-docs prepare: [32m✔[39m Build complete in [32m3017ms[39m
packages/plugins/awcms-micro-docs prepare: Done
.../plugins/awcms-micro-website-social prepare: [34mℹ[39m [2mdist/[22m[1madmin.js[22m        [2m4.48 kB[22m [2m│ gzip: 1.67 kB[22m
.../plugins/awcms-micro-website-social prepare: [34mℹ[39m [2mdist/[22m[1mindex.js[22m        [2m1.17 kB[22m [2m│ gzip: 0.47 kB[22m
.../plugins/awcms-micro-website-social prepare: [34mℹ[39m [2mdist/[22madmin.js.map    [2m6.29 kB[22m [2m│ gzip: 2.32 kB[22m
.../plugins/awcms-micro-website-social prepare: [34mℹ[39m [2mdist/[22mindex.js.map    [2m1.66 kB[22m [2m│ gzip: 0.67 kB[22m
.../plugins/awcms-micro-website-social prepare: [34mℹ[39m [2mdist/[22mindex.d.ts.map  [2m0.20 kB[22m [2m│ gzip: 0.16 kB[22m
.../plugins/awcms-micro-website-social prepare: [34mℹ[39m [2mdist/[22madmin.d.ts.map  [2m0.12 kB[22m [2m│ gzip: 0.12 kB[22m
.../plugins/awcms-micro-website-social prepare: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.ts[22m[39m      [2m0.70 kB[22m [2m│ gzip: 0.33 kB[22m
.../plugins/awcms-micro-website-social prepare: [34mℹ[39m [2mdist/[22m[32m[1madmin.d.ts[22m[39m      [2m0.21 kB[22m [2m│ gzip: 0.15 kB[22m
.../plugins/awcms-micro-website-social prepare: [34mℹ[39m 8 files, total: 14.83 kB
.../plugins/awcms-micro-website-social prepare: [32m✔[39m Build complete in [32m3339ms[39m
.../plugins/awcms-micro-website-social prepare: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugins. Here is a breakdown:
.../plugins/awcms-micro-website-social prepare:   - rolldown-plugin-dts:generate (80%)
.../plugins/awcms-micro-website-social prepare:   - tsdown:external (20%)
.../plugins/awcms-micro-website-social prepare: See https://rolldown.rs/options/checks#plugintimings for more details.
.../plugins/awcms-micro-website-social prepare: Done
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22m[1madmin.js[22m                           [2m360.78 kB[22m [2m│ gzip: 54.33 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22m[1mindex.js[22m                           [2m  2.79 kB[22m [2m│ gzip:  0.99 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22m[1mnavigation.js[22m                      [2m  0.78 kB[22m [2m│ gzip:  0.32 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22m[1msandbox.js[22m                         [2m  0.30 kB[22m [2m│ gzip:  0.21 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22mruntime-5dclkDQF.js                [2m381.89 kB[22m [2m│ gzip: 77.95 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22mfield-standards-DPRMDU-F.js        [2m 30.46 kB[22m [2m│ gzip:  5.13 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22mAwcmsPluginHeaderMenu-V7ITPBZD.js  [2m 13.98 kB[22m [2m│ gzip:  3.29 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.ts[22m[39m                         [2m  7.29 kB[22m [2m│ gzip:  1.91 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22m[32m[1mnavigation.d.ts[22m[39m                    [2m  6.04 kB[22m [2m│ gzip:  1.38 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22m[32m[1madmin.d.ts[22m[39m                         [2m  3.20 kB[22m [2m│ gzip:  1.04 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m [2mdist/[22m[32m[1msandbox.d.ts[22m[39m                       [2m  2.23 kB[22m [2m│ gzip:  0.50 kB[22m
packages/plugins/awcms-micro-sikesra prepare: [34mℹ[39m 11 files, total: 809.74 kB
packages/plugins/awcms-micro-sikesra prepare: [32m✔[39m Build complete in [32m3763ms[39m
packages/plugins/awcms-micro-sikesra prepare: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugin `rolldown-plugin-dts:generate`. See https://rolldown.rs/options/checks#plugintimings for more details.
packages/plugins/awcms-micro-sikesra prepare: Done
Done in 16.4s using pnpm v11.5.1
$ pnpm --filter emdash build
==> pnpm-build-emdash
$ tsdown
[34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
[34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/core/tsdown.config.ts[24m
[34mℹ[39m entry: [34msrc/index.ts, src/request-context.ts, src/astro/index.ts, src/astro/middleware.ts, src/astro/middleware/setup.ts, src/astro/middleware/auth.ts, src/astro/middleware/redirect.ts, src/astro/middleware/request-context.ts, src/astro/types.ts, src/db/index.ts, src/db/sqlite.ts, src/db/libsql.ts, src/db/postgres.ts, src/database/instrumentation.ts, src/storage/local.ts, src/storage/s3.ts, src/media/index.ts, src/media/local-runtime.ts, src/runtime.ts, src/seed/index.ts, src/cli/index.ts, src/client/index.ts, src/client/cf-access.ts, src/seo/index.ts, src/page/index.ts, src/plugin-utils.ts, src/plugin-types.ts, src/plugins/adapt-sandbox-entry.ts, src/api/route-utils.ts, src/api/schemas/index.ts, src/auth/providers/github.ts, src/auth/providers/google.ts[39m
[34mℹ[39m tsconfig: [34mtsconfig.json[39m
[34mℹ[39m Build start
[34mℹ[39m Cleaning 1114 files
[34mℹ[39m Granting execute permission to [4mdist/cli/index.mjs[24m
[34mℹ[39m [2mdist/[22m[1mcli/index.mjs[22m                                                            [2m146.68 kB[22m [2m│ gzip: 37.08 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/middleware.mjs[22m                                                     [2m 96.59 kB[22m [2m│ gzip: 25.00 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/openapi.json.mjs[22m                                        [2m 90.41 kB[22m [2m│ gzip: 14.40 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/mcp.mjs[22m                                                 [2m 68.08 kB[22m [2m│ gzip: 15.09 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/index.mjs[22m                                                          [2m 64.43 kB[22m [2m│ gzip: 14.99 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/middleware/request-context.mjs[22m                                     [2m 41.28 kB[22m [2m│ gzip: 10.35 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/execute.mjs[22m                            [2m 26.48 kB[22m [2m│ gzip:  8.21 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/middleware/auth.mjs[22m                                                [2m 21.78 kB[22m [2m│ gzip:  6.02 kB[22m
[34mℹ[39m [2mdist/[22m[1mpage/index.mjs[22m                                                           [2m 13.75 kB[22m [2m│ gzip:  4.05 kB[22m
[34mℹ[39m [2mdist/[22m[1mclient/index.mjs[22m                                                         [2m 13.03 kB[22m [2m│ gzip:  3.53 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/registry/artifact.mjs[22m                     [2m 12.64 kB[22m [2m│ gzip:  4.54 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/authorize.mjs[22m                                     [2m 11.85 kB[22m [2m│ gzip:  3.50 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/analyze.mjs[22m                            [2m  9.96 kB[22m [2m│ gzip:  3.36 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/snapshot.mjs[22m                                            [2m  9.29 kB[22m [2m│ gzip:  3.58 kB[22m
[34mℹ[39m [2mdist/[22m[1mindex.mjs[22m                                                                [2m  8.49 kB[22m [2m│ gzip:  2.58 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/comments/_collection_/_contentId_/index.mjs[22m             [2m  8.32 kB[22m [2m│ gzip:  2.58 kB[22m
[34mℹ[39m [2mdist/[22m[1mapi/schemas/index.mjs[22m                                                    [2m  8.31 kB[22m [2m│ gzip:  1.95 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress-plugin/execute.mjs[22m                     [2m  8.17 kB[22m [2m│ gzip:  2.75 kB[22m
[34mℹ[39m [2mdist/[22m[1mstorage/s3.mjs[22m                                                           [2m  7.78 kB[22m [2m│ gzip:  2.79 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/media.mjs[22m                              [2m  6.56 kB[22m [2m│ gzip:  2.13 kB[22m
[34mℹ[39m [2mdist/[22m[1mplugins/adapt-sandbox-entry.mjs[22m                                          [2m  5.88 kB[22m [2m│ gzip:  2.21 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/media.mjs[22m                                               [2m  5.75 kB[22m [2m│ gzip:  2.13 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/oauth/_provider_/callback.mjs[22m                      [2m  5.73 kB[22m [2m│ gzip:  2.02 kB[22m
[34mℹ[39m [2mdist/[22m[1mclient/cf-access.mjs[22m                                                     [2m  5.69 kB[22m [2m│ gzip:  2.17 kB[22m
[34mℹ[39m [2mdist/[22m[1mstorage/local.mjs[22m                                                        [2m  5.56 kB[22m [2m│ gzip:  2.04 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/rewrite-urls.mjs[22m                       [2m  5.56 kB[22m [2m│ gzip:  1.82 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_.mjs[22m                           [2m  5.12 kB[22m [2m│ gzip:  1.46 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/dev-bypass.mjs[22m                                    [2m  5.05 kB[22m [2m│ gzip:  2.00 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/token.mjs[22m                                         [2m  4.98 kB[22m [2m│ gzip:  1.69 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/sitemap-_collection_.xml.mjs[22m                                [2m  4.90 kB[22m [2m│ gzip:  1.84 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/rewrite-url-helpers.mjs[22m                [2m  4.64 kB[22m [2m│ gzip:  1.71 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs[22m          [2m  4.57 kB[22m [2m│ gzip:  1.49 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/register.mjs[22m                                      [2m  4.42 kB[22m [2m│ gzip:  1.65 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/registry/install.mjs[22m                      [2m  4.40 kB[22m [2m│ gzip:  1.73 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/_id_/index.mjs[22m                              [2m  4.37 kB[22m [2m│ gzip:  1.46 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/prepare.mjs[22m                            [2m  4.34 kB[22m [2m│ gzip:  1.62 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/settings/email.mjs[22m                                      [2m  4.32 kB[22m [2m│ gzip:  1.72 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/registry/_id_/update.mjs[22m                  [2m  4.27 kB[22m [2m│ gzip:  1.58 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/_slug_/index.mjs[22m                     [2m  3.81 kB[22m [2m│ gzip:  1.14 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/index.mjs[22m                                         [2m  3.76 kB[22m [2m│ gzip:  1.42 kB[22m
[34mℹ[39m [2mdist/[22m[1mmedia/local-runtime.mjs[22m                                                  [2m  3.75 kB[22m [2m│ gzip:  1.18 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs[22m        [2m  3.72 kB[22m [2m│ gzip:  1.04 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/admin-verify.mjs[22m                                  [2m  3.69 kB[22m [2m│ gzip:  1.40 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/_name_/widgets/_id_.mjs[22m                    [2m  3.65 kB[22m [2m│ gzip:  1.11 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/marketplace/_id_/install.mjs[22m              [2m  3.58 kB[22m [2m│ gzip:  1.31 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/upload-url.mjs[22m                                    [2m  3.54 kB[22m [2m│ gzip:  1.47 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/register/verify.mjs[22m                        [2m  3.52 kB[22m [2m│ gzip:  1.35 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/_id_/status.mjs[22m                          [2m  3.49 kB[22m [2m│ gzip:  1.31 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/taxonomies/_name_/terms/_slug_/translations.mjs[22m         [2m  3.48 kB[22m [2m│ gzip:  1.12 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/_id_.mjs[22m                                          [2m  3.43 kB[22m [2m│ gzip:  1.04 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/taxonomies/_name_/terms/_slug_.mjs[22m                      [2m  3.42 kB[22m [2m│ gzip:  0.96 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/update.mjs[22m                           [2m  3.30 kB[22m [2m│ gzip:  1.20 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/schedule.mjs[22m                  [2m  3.20 kB[22m [2m│ gzip:  1.01 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/preview-url.mjs[22m               [2m  3.19 kB[22m [2m│ gzip:  1.32 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/_slug_/fields/index.mjs[22m              [2m  3.19 kB[22m [2m│ gzip:  1.00 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/providers/_providerId_/index.mjs[22m                  [2m  3.15 kB[22m [2m│ gzip:  1.14 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/updates.mjs[22m                               [2m  3.15 kB[22m [2m│ gzip:  1.13 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/bylines/index.mjs[22m                                 [2m  3.11 kB[22m [2m│ gzip:  1.20 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/bylines/_id_/index.mjs[22m                            [2m  3.10 kB[22m [2m│ gzip:  1.07 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/registry/_id_/uninstall.mjs[22m               [2m  3.10 kB[22m [2m│ gzip:  1.10 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/plugins/_pluginId_/_...path_.mjs[22m                        [2m  3.09 kB[22m [2m│ gzip:  1.37 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/middleware/redirect.mjs[22m                                            [2m  3.08 kB[22m [2m│ gzip:  1.30 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/admin.mjs[22m                                         [2m  3.07 kB[22m [2m│ gzip:  1.25 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/index.mjs[22m                          [2m  3.03 kB[22m [2m│ gzip:  1.14 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/oauth/_provider_.mjs[22m                               [2m  3.00 kB[22m [2m│ gzip:  1.17 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/oauth-clients/_id_.mjs[22m                            [2m  3.00 kB[22m [2m│ gzip:  0.97 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/themes/marketplace/index.mjs[22m                      [2m  2.99 kB[22m [2m│ gzip:  1.12 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/uninstall.mjs[22m                        [2m  2.99 kB[22m [2m│ gzip:  1.10 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/bylines/_id_/translations.mjs[22m                     [2m  2.98 kB[22m [2m│ gzip:  1.13 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/enable.mjs[22m                           [2m  2.97 kB[22m [2m│ gzip:  1.08 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/index.mjs[22m                            [2m  2.92 kB[22m [2m│ gzip:  0.99 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/allowed-domains/_domain_.mjs[22m                      [2m  2.86 kB[22m [2m│ gzip:  0.99 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/_slug_/fields/reorder.mjs[22m            [2m  2.83 kB[22m [2m│ gzip:  0.96 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/publish.mjs[22m                   [2m  2.81 kB[22m [2m│ gzip:  1.15 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/marketplace/index.mjs[22m                     [2m  2.80 kB[22m [2m│ gzip:  1.03 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/redirects/_id_.mjs[22m                                      [2m  2.80 kB[22m [2m│ gzip:  0.84 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/disable.mjs[22m                          [2m  2.80 kB[22m [2m│ gzip:  1.03 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/_id_.mjs[22m                                   [2m  2.78 kB[22m [2m│ gzip:  0.98 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/signup/complete.mjs[22m                                [2m  2.78 kB[22m [2m│ gzip:  1.16 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/allowed-domains/index.mjs[22m                         [2m  2.77 kB[22m [2m│ gzip:  1.05 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/invite/complete.mjs[22m                                [2m  2.75 kB[22m [2m│ gzip:  1.14 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/dev-bypass.mjs[22m                                     [2m  2.72 kB[22m [2m│ gzip:  1.27 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress-plugin/analyze.mjs[22m                     [2m  2.71 kB[22m [2m│ gzip:  1.14 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/orphans/_slug_.mjs[22m                               [2m  2.69 kB[22m [2m│ gzip:  1.00 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/marketplace/_id_/index.mjs[22m                [2m  2.67 kB[22m [2m│ gzip:  0.95 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_/translations.mjs[22m                           [2m  2.66 kB[22m [2m│ gzip:  0.94 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/typegen.mjs[22m                                             [2m  2.66 kB[22m [2m│ gzip:  1.06 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/themes/marketplace/_id_/index.mjs[22m                 [2m  2.65 kB[22m [2m│ gzip:  0.95 kB[22m
[34mℹ[39m [2mdist/[22m[1mseo/index.mjs[22m                                                            [2m  2.65 kB[22m [2m│ gzip:  1.04 kB[22m
[34mℹ[39m [2mdist/[22m[1mplugin-utils.mjs[22m                                                         [2m  2.63 kB[22m [2m│ gzip:  1.21 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/options.mjs[22m                                [2m  2.60 kB[22m [2m│ gzip:  1.07 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/register/options.mjs[22m                       [2m  2.58 kB[22m [2m│ gzip:  1.07 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/sections/_slug_.mjs[22m                                     [2m  2.58 kB[22m [2m│ gzip:  0.79 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/index.mjs[22m                            [2m  2.56 kB[22m [2m│ gzip:  0.96 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/index.mjs[22m                                        [2m  2.54 kB[22m [2m│ gzip:  1.11 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/index.mjs[22m                                  [2m  2.53 kB[22m [2m│ gzip:  1.01 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/taxonomies/_name_/terms/index.mjs[22m                       [2m  2.52 kB[22m [2m│ gzip:  0.90 kB[22m
[34mℹ[39m [2mdist/[22m[1mdatabase/instrumentation.mjs[22m                                             [2m  2.51 kB[22m [2m│ gzip:  1.22 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/redirects/404s/index.mjs[22m                                [2m  2.48 kB[22m [2m│ gzip:  0.81 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/verify.mjs[22m                                 [2m  2.47 kB[22m [2m│ gzip:  1.02 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/_id_/confirm.mjs[22m                                  [2m  2.44 kB[22m [2m│ gzip:  1.08 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_.mjs[22m                                        [2m  2.41 kB[22m [2m│ gzip:  0.75 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/magic-link/send.mjs[22m                                [2m  2.41 kB[22m [2m│ gzip:  0.98 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/sitemap.xml.mjs[22m                                             [2m  2.40 kB[22m [2m│ gzip:  1.10 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/status.mjs[22m                                        [2m  2.39 kB[22m [2m│ gzip:  1.03 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/byline-fields/_slug_.mjs[22m                          [2m  2.37 kB[22m [2m│ gzip:  0.75 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/hooks/exclusive/_hookName_.mjs[22m                    [2m  2.36 kB[22m [2m│ gzip:  1.04 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/providers/_providerId_/_itemId_.mjs[22m               [2m  2.36 kB[22m [2m│ gzip:  0.78 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/_name_/widgets.mjs[22m                         [2m  2.36 kB[22m [2m│ gzip:  1.03 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/index.mjs[22m                                 [2m  2.33 kB[22m [2m│ gzip:  0.90 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/invite/index.mjs[22m                                   [2m  2.32 kB[22m [2m│ gzip:  1.07 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/invite/register-options.mjs[22m                        [2m  2.31 kB[22m [2m│ gzip:  1.01 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/settings.mjs[22m                                            [2m  2.28 kB[22m [2m│ gzip:  0.92 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/orphans/index.mjs[22m                                [2m  2.28 kB[22m [2m│ gzip:  0.84 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/signup/request.mjs[22m                                 [2m  2.27 kB[22m [2m│ gzip:  0.99 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_/items/_id_.mjs[22m                             [2m  2.24 kB[22m [2m│ gzip:  0.78 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/taxonomies/index.mjs[22m                                    [2m  2.23 kB[22m [2m│ gzip:  0.84 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/oauth-clients/index.mjs[22m                           [2m  2.20 kB[22m [2m│ gzip:  0.91 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/themes/preview.mjs[22m                                      [2m  2.15 kB[22m [2m│ gzip:  0.98 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/rebuild.mjs[22m                                      [2m  2.15 kB[22m [2m│ gzip:  0.93 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/_name_.mjs[22m                                 [2m  2.15 kB[22m [2m│ gzip:  0.79 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/api-tokens/index.mjs[22m                              [2m  2.13 kB[22m [2m│ gzip:  0.93 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/redirects/index.mjs[22m                                     [2m  2.13 kB[22m [2m│ gzip:  0.79 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/_id_/send-recovery.mjs[22m                      [2m  2.03 kB[22m [2m│ gzip:  0.96 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/device/token.mjs[22m                                  [2m  2.01 kB[22m [2m│ gzip:  0.94 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/index.mjs[22m                                        [2m  2.01 kB[22m [2m│ gzip:  0.95 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/index.mjs[22m                                   [2m  2.00 kB[22m [2m│ gzip:  0.95 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/enable.mjs[22m                                       [2m  1.98 kB[22m [2m│ gzip:  0.87 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/_id_/disable.mjs[22m                            [2m  1.96 kB[22m [2m│ gzip:  0.90 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/sections/index.mjs[22m                                      [2m  1.93 kB[22m [2m│ gzip:  0.74 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/_name_/reorder.mjs[22m                         [2m  1.93 kB[22m [2m│ gzip:  0.87 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/robots.txt.mjs[22m                                              [2m  1.88 kB[22m [2m│ gzip:  0.85 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/middleware/setup.mjs[22m                                               [2m  1.86 kB[22m [2m│ gzip:  0.86 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/file/_...key_.mjs[22m                                 [2m  1.84 kB[22m [2m│ gzip:  0.95 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/duplicate.mjs[22m                 [2m  1.81 kB[22m [2m│ gzip:  0.77 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/device/code.mjs[22m                                   [2m  1.80 kB[22m [2m│ gzip:  0.84 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/me.mjs[22m                                             [2m  1.77 kB[22m [2m│ gzip:  0.85 kB[22m
[34mℹ[39m [2mdist/[22m[1mrequest-context.mjs[22m                                                      [2m  1.76 kB[22m [2m│ gzip:  0.90 kB[22m
[34mℹ[39m [2mdist/[22m[1mapi/route-utils.mjs[22m                                                      [2m  1.76 kB[22m [2m│ gzip:  0.84 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/byline-fields/index.mjs[22m                           [2m  1.73 kB[22m [2m│ gzip:  0.67 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/restore.mjs[22m                   [2m  1.72 kB[22m [2m│ gzip:  0.74 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/discard-draft.mjs[22m             [2m  1.71 kB[22m [2m│ gzip:  0.73 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/_id_.mjs[22m                                 [2m  1.70 kB[22m [2m│ gzip:  0.66 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/unpublish.mjs[22m                 [2m  1.70 kB[22m [2m│ gzip:  0.73 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/suggest.mjs[22m                                      [2m  1.68 kB[22m [2m│ gzip:  0.83 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/index.mjs[22m                                         [2m  1.66 kB[22m [2m│ gzip:  0.68 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/magic-link/verify.mjs[22m                              [2m  1.65 kB[22m [2m│ gzip:  0.72 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/revisions/_revisionId_/restore.mjs[22m                      [2m  1.64 kB[22m [2m│ gzip:  0.70 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/translations.mjs[22m              [2m  1.58 kB[22m [2m│ gzip:  0.77 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs[22m             [2m  1.56 kB[22m [2m│ gzip:  0.76 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/manifest.mjs[22m                                            [2m  1.56 kB[22m [2m│ gzip:  0.80 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/marketplace/_id_/icon.mjs[22m                 [2m  1.54 kB[22m [2m│ gzip:  0.74 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/index.mjs[22m                                [2m  1.48 kB[22m [2m│ gzip:  0.69 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/bulk.mjs[22m                                 [2m  1.48 kB[22m [2m│ gzip:  0.67 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/redirects/404s/summary.mjs[22m                              [2m  1.46 kB[22m [2m│ gzip:  0.66 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/hooks/exclusive/index.mjs[22m                         [2m  1.45 kB[22m [2m│ gzip:  0.72 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_/reorder.mjs[22m                                [2m  1.44 kB[22m [2m│ gzip:  0.67 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_/items.mjs[22m                                  [2m  1.43 kB[22m [2m│ gzip:  0.67 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/probe.mjs[22m                                        [2m  1.38 kB[22m [2m│ gzip:  0.66 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/well-known/auth.mjs[22m                                     [2m  1.37 kB[22m [2m│ gzip:  0.66 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/device/authorize.mjs[22m                              [2m  1.34 kB[22m [2m│ gzip:  0.69 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/signup/verify.mjs[22m                                  [2m  1.32 kB[22m [2m│ gzip:  0.71 kB[22m
[34mℹ[39m [2mdist/[22m[1mruntime.mjs[22m                                                              [2m  1.32 kB[22m [2m│ gzip:  0.64 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/invite/accept.mjs[22m                                  [2m  1.28 kB[22m [2m│ gzip:  0.68 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/_id_/enable.mjs[22m                             [2m  1.28 kB[22m [2m│ gzip:  0.67 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/byline-fields/reorder.mjs[22m                         [2m  1.24 kB[22m [2m│ gzip:  0.56 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/api-tokens/_id_.mjs[22m                               [2m  1.24 kB[22m [2m│ gzip:  0.66 kB[22m
[34mℹ[39m [2mdist/[22m[1mdb/index.mjs[22m                                                             [2m  1.22 kB[22m [2m│ gzip:  0.56 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/token/refresh.mjs[22m                                 [2m  1.19 kB[22m [2m│ gzip:  0.62 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/well-known/oauth-authorization-server.mjs[22m               [2m  1.18 kB[22m [2m│ gzip:  0.58 kB[22m
[34mℹ[39m [2mdist/[22m[1mmedia/index.mjs[22m                                                          [2m  1.18 kB[22m [2m│ gzip:  0.59 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/trash.mjs[22m                          [2m  1.17 kB[22m [2m│ gzip:  0.58 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/token/revoke.mjs[22m                                  [2m  1.14 kB[22m [2m│ gzip:  0.60 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/index.mjs[22m                                  [2m  1.07 kB[22m [2m│ gzip:  0.60 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/revisions.mjs[22m                 [2m  1.04 kB[22m [2m│ gzip:  0.56 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/stats.mjs[22m                                        [2m  1.03 kB[22m [2m│ gzip:  0.56 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/permanent.mjs[22m                 [2m  1.02 kB[22m [2m│ gzip:  0.53 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/dev-reset.mjs[22m                                     [2m  1.01 kB[22m [2m│ gzip:  0.56 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/byline-fields/_slug_/usage.mjs[22m                    [2m  0.99 kB[22m [2m│ gzip:  0.51 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/dashboard.mjs[22m                                           [2m  0.99 kB[22m [2m│ gzip:  0.54 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress-plugin/callback.mjs[22m                    [2m  0.97 kB[22m [2m│ gzip:  0.53 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/counts.mjs[22m                               [2m  0.95 kB[22m [2m│ gzip:  0.50 kB[22m
[34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/mode.mjs[22m                                           [2m  0.94 kB[22m [2m│ gzip:  0.56 kB[22m
[34mℹ[39m [2mdist/[22m[1mseed/index.mjs[22m                                                           [2m  0.92 kB[22m [2m│ gzip:  0.41 kB[22m
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
[34mℹ[39m [2mdist/[22mapi-B7GATEYo.mjs.map                                                     [2m306.40 kB[22m [2m│ gzip: 66.57 kB[22m
[34mℹ[39m [2mdist/[22mcli/index.mjs.map                                                        [2m291.41 kB[22m [2m│ gzip: 67.35 kB[22m
[34mℹ[39m [2mdist/[22mrunner-BiuUfx-V.mjs.map                                                  [2m261.25 kB[22m [2m│ gzip: 48.93 kB[22m
[34mℹ[39m [2mdist/[22mastro/middleware.mjs.map                                                 [2m214.17 kB[22m [2m│ gzip: 54.84 kB[22m
[34mℹ[39m [2mdist/[22mmenus-nmHL66Ks.mjs.map                                                   [2m186.63 kB[22m [2m│ gzip: 41.87 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/openapi.json.mjs.map                                    [2m170.45 kB[22m [2m│ gzip: 23.58 kB[22m
[34mℹ[39m [2mdist/[22mapi-B7GATEYo.mjs                                                         [2m144.89 kB[22m [2m│ gzip: 32.89 kB[22m
[34mℹ[39m [2mdist/[22mastro/index.mjs.map                                                      [2m138.48 kB[22m [2m│ gzip: 33.13 kB[22m
[34mℹ[39m [2mdist/[22mrunner-BiuUfx-V.mjs                                                      [2m137.39 kB[22m [2m│ gzip: 25.75 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/mcp.mjs.map                                             [2m126.65 kB[22m [2m│ gzip: 24.52 kB[22m
[34mℹ[39m [2mdist/[22mimport-Dh8bWmyq.mjs.map                                                  [2m112.07 kB[22m [2m│ gzip: 25.69 kB[22m
[34mℹ[39m [2mdist/[22mredirects-C0L9JUk4.mjs.map                                               [2m 97.42 kB[22m [2m│ gzip: 16.62 kB[22m
[34mℹ[39m [2mdist/[22mmenus-nmHL66Ks.mjs                                                       [2m 86.17 kB[22m [2m│ gzip: 19.80 kB[22m
[34mℹ[39m [2mdist/[22mbyline-CAhk4FrG.mjs.map                                                  [2m 78.05 kB[22m [2m│ gzip: 20.58 kB[22m
[34mℹ[39m [2mdist/[22mcontext-Ca0HkaIh.mjs.map                                                 [2m 66.64 kB[22m [2m│ gzip: 15.80 kB[22m
[34mℹ[39m [2mdist/[22mapply-BrVqULFe.mjs.map                                                   [2m 65.82 kB[22m [2m│ gzip: 16.76 kB[22m
[34mℹ[39m [2mdist/[22mcontent-C7aJ7keg.mjs.map                                                 [2m 64.02 kB[22m [2m│ gzip: 13.88 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/execute.mjs.map                        [2m 59.52 kB[22m [2m│ gzip: 17.62 kB[22m
[34mℹ[39m [2mdist/[22mregistry-C-T_PWgp.mjs.map                                                [2m 54.83 kB[22m [2m│ gzip: 13.21 kB[22m
[34mℹ[39m [2mdist/[22mmenus-PFp8FDuO.mjs.map                                                   [2m 50.90 kB[22m [2m│ gzip: 12.05 kB[22m
[34mℹ[39m [2mdist/[22mloader-BxyvbrZP.mjs.map                                                  [2m 49.36 kB[22m [2m│ gzip: 13.97 kB[22m
[34mℹ[39m [2mdist/[22mastro/middleware/request-context.mjs.map                                 [2m 49.16 kB[22m [2m│ gzip: 12.37 kB[22m
[34mℹ[39m [2mdist/[22mquery-Cc649nDl.mjs.map                                                   [2m 49.09 kB[22m [2m│ gzip: 14.83 kB[22m
[34mℹ[39m [2mdist/[22mimport-Dh8bWmyq.mjs                                                      [2m 48.70 kB[22m [2m│ gzip: 11.84 kB[22m
[34mℹ[39m [2mdist/[22mredirects-C0L9JUk4.mjs                                                   [2m 47.32 kB[22m [2m│ gzip:  9.55 kB[22m
[34mℹ[39m [2mdist/[22mastro/middleware/auth.mjs.map                                            [2m 44.81 kB[22m [2m│ gzip: 12.43 kB[22m
[34mℹ[39m [2mdist/[22mbyline-CAhk4FrG.mjs                                                      [2m 39.30 kB[22m [2m│ gzip: 10.76 kB[22m
[34mℹ[39m [2mdist/[22mindex-CXyVSXzH.d.mts.map                                                 [2m 36.59 kB[22m [2m│ gzip: 10.10 kB[22m
[34mℹ[39m [2mdist/[22mvalidate-DWmnRg6E.mjs.map                                                [2m 34.77 kB[22m [2m│ gzip:  7.51 kB[22m
[34mℹ[39m [2mdist/[22mtaxonomies-C0bVme_m.mjs.map                                              [2m 34.53 kB[22m [2m│ gzip:  8.01 kB[22m
[34mℹ[39m [2mdist/[22mbyline-registry-CxK5g559.mjs.map                                         [2m 33.30 kB[22m [2m│ gzip:  9.67 kB[22m
[34mℹ[39m [2mdist/[22mclient/index.mjs.map                                                     [2m 33.25 kB[22m [2m│ gzip:  7.97 kB[22m
[34mℹ[39m [2mdist/[22mcontent-C7aJ7keg.mjs                                                     [2m 32.67 kB[22m [2m│ gzip:  7.67 kB[22m
[34mℹ[39m [2mdist/[22mredirects-C1UgU9E0.mjs.map                                               [2m 32.59 kB[22m [2m│ gzip:  8.18 kB[22m
[34mℹ[39m [2mdist/[22mapply-BrVqULFe.mjs                                                       [2m 32.53 kB[22m [2m│ gzip:  8.26 kB[22m
[34mℹ[39m [2mdist/[22mpage/index.mjs.map                                                       [2m 31.02 kB[22m [2m│ gzip:  8.42 kB[22m
[34mℹ[39m [2mdist/[22mdevice-flow-ptLrVINd.mjs.map                                             [2m 29.83 kB[22m [2m│ gzip:  7.18 kB[22m
[34mℹ[39m [2mdist/[22mcontext-Ca0HkaIh.mjs                                                     [2m 28.49 kB[22m [2m│ gzip:  7.55 kB[22m
[34mℹ[39m [2mdist/[22merror-Bk9s3Ism.mjs.map                                                   [2m 27.57 kB[22m [2m│ gzip:  6.54 kB[22m
[34mℹ[39m [2mdist/[22mregistry-C-T_PWgp.mjs                                                    [2m 27.45 kB[22m [2m│ gzip:  6.96 kB[22m
[34mℹ[39m [2mdist/[22msearch-BrF7k0Ho.mjs.map                                                  [2m 26.55 kB[22m [2m│ gzip:  8.20 kB[22m
[34mℹ[39m [2mdist/[22mredirect-C-FeA4j9.mjs.map                                                [2m 26.36 kB[22m [2m│ gzip:  6.98 kB[22m
[34mℹ[39m [2mdist/[22mtransport--Ck3RBin.mjs.map                                               [2m 26.06 kB[22m [2m│ gzip:  7.48 kB[22m
[34mℹ[39m [2mdist/[22mtaxonomies-CGD6y79Q.mjs.map                                              [2m 25.55 kB[22m [2m│ gzip:  6.21 kB[22m
[34mℹ[39m [2mdist/[22msecrets-YYbTgB1w.mjs.map                                                 [2m 24.92 kB[22m [2m│ gzip:  8.49 kB[22m
[34mℹ[39m [2mdist/[22mfts-manager-XpDfbIKo.mjs.map                                             [2m 24.82 kB[22m [2m│ gzip:  6.62 kB[22m
[34mℹ[39m [2mdist/[22mloader-BxyvbrZP.mjs                                                      [2m 24.07 kB[22m [2m│ gzip:  7.25 kB[22m
[34mℹ[39m [2mdist/[22mquery-Cc649nDl.mjs                                                       [2m 23.69 kB[22m [2m│ gzip:  7.71 kB[22m
[34mℹ[39m [2mdist/[22mssrf-BsVGIE0Z.mjs.map                                                    [2m 23.59 kB[22m [2m│ gzip:  8.30 kB[22m
[34mℹ[39m [2mdist/[22mmenus-PFp8FDuO.mjs                                                       [2m 23.34 kB[22m [2m│ gzip:  5.93 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/authorize.mjs.map                                 [2m 22.43 kB[22m [2m│ gzip:  6.46 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/analyze.mjs.map                        [2m 22.30 kB[22m [2m│ gzip:  6.90 kB[22m
[34mℹ[39m [2mdist/[22mtaxonomy-Db5xwphL.mjs.map                                                [2m 21.42 kB[22m [2m│ gzip:  5.59 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/artifact.mjs.map                 [2m 20.68 kB[22m [2m│ gzip:  7.13 kB[22m
[34mℹ[39m [2mdist/[22mcomment-DkAfGX9E.mjs.map                                                 [2m 20.47 kB[22m [2m│ gzip:  4.87 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/snapshot.mjs.map                                        [2m 19.89 kB[22m [2m│ gzip:  6.77 kB[22m
[34mℹ[39m [2mdist/[22msections-8DEa-dWt.mjs.map                                                [2m 19.39 kB[22m [2m│ gzip:  4.78 kB[22m
[34mℹ[39m [2mdist/[22mbyline-fields-Dr-xcb6S.mjs.map                                           [2m 19.35 kB[22m [2m│ gzip:  4.77 kB[22m
[34mℹ[39m [2mdist/[22mzod-generator-MMm56Prt.mjs.map                                           [2m 18.45 kB[22m [2m│ gzip:  5.43 kB[22m
[34mℹ[39m [2mdist/[22mbyline-registry-CxK5g559.mjs                                             [2m 18.31 kB[22m [2m│ gzip:  5.90 kB[22m
[34mℹ[39m [2mdist/[22moauth-authorization-DvBAL75d.mjs.map                                     [2m 17.99 kB[22m [2m│ gzip:  4.89 kB[22m
[34mℹ[39m [2mdist/[22merror-Bk9s3Ism.mjs                                                       [2m 17.36 kB[22m [2m│ gzip:  4.23 kB[22m
[34mℹ[39m [2mdist/[22mtypes-jbkzJ1j_.d.mts.map                                                 [2m 16.99 kB[22m [2m│ gzip:  4.66 kB[22m
[34mℹ[39m [2mdist/[22mutils-C4Ih4DML.mjs.map                                                   [2m 16.93 kB[22m [2m│ gzip:  5.01 kB[22m
[34mℹ[39m [2mdist/[22mvalidate-DWmnRg6E.mjs                                                    [2m 16.79 kB[22m [2m│ gzip:  3.79 kB[22m
[34mℹ[39m [2mdist/[22mcron-DZovZUnC.mjs.map                                                    [2m 16.65 kB[22m [2m│ gzip:  5.39 kB[22m
[34mℹ[39m [2mdist/[22mmedia-Cyz5BhSN.mjs.map                                                   [2m 16.58 kB[22m [2m│ gzip:  4.99 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/execute.mjs.map                 [2m 16.41 kB[22m [2m│ gzip:  5.34 kB[22m
[34mℹ[39m [2mdist/[22mredirects-C1UgU9E0.mjs                                                   [2m 16.07 kB[22m [2m│ gzip:  4.26 kB[22m
[34mℹ[39m [2mdist/[22mbylines-DCczH3AV.mjs.map                                                 [2m 16.00 kB[22m [2m│ gzip:  5.36 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/comments/_collection_/_contentId_/index.mjs.map         [2m 15.95 kB[22m [2m│ gzip:  4.89 kB[22m
[34mℹ[39m [2mdist/[22msettings-Jro4YcUb.mjs.map                                                [2m 15.73 kB[22m [2m│ gzip:  5.04 kB[22m
[34mℹ[39m [2mdist/[22mtaxonomies-C0bVme_m.mjs                                                  [2m 15.58 kB[22m [2m│ gzip:  3.76 kB[22m
[34mℹ[39m [2mdist/[22moauth-clients-8mPDStMv.mjs.map                                           [2m 15.58 kB[22m [2m│ gzip:  3.61 kB[22m
[34mℹ[39m [2mdist/[22mstorage/s3.mjs.map                                                       [2m 15.38 kB[22m [2m│ gzip:  5.03 kB[22m
[34mℹ[39m [2mdist/[22mtaxonomies-CGD6y79Q.mjs                                                  [2m 14.94 kB[22m [2m│ gzip:  3.84 kB[22m
[34mℹ[39m [2mdist/[22mdevice-flow-ptLrVINd.mjs                                                 [2m 14.86 kB[22m [2m│ gzip:  3.82 kB[22m
[34mℹ[39m [2mdist/[22mplugins/adapt-sandbox-entry.mjs.map                                      [2m 14.73 kB[22m [2m│ gzip:  5.14 kB[22m
[34mℹ[39m [2mdist/[22mservice-9P2cdyR_.mjs.map                                                 [2m 14.62 kB[22m [2m│ gzip:  4.39 kB[22m
[34mℹ[39m [2mdist/[22mfts-manager-XpDfbIKo.mjs                                                 [2m 13.79 kB[22m [2m│ gzip:  3.92 kB[22m
[34mℹ[39m [2mdist/[22msecrets-YYbTgB1w.mjs                                                     [2m 13.77 kB[22m [2m│ gzip:  5.15 kB[22m
[34mℹ[39m [2mdist/[22mcomments-DLFnXs7J.mjs.map                                                [2m 13.34 kB[22m [2m│ gzip:  3.37 kB[22m
[34mℹ[39m [2mdist/[22msearch-BrF7k0Ho.mjs                                                      [2m 13.23 kB[22m [2m│ gzip:  4.32 kB[22m
[34mℹ[39m [2mdist/[22mbylines-CbrD7STW.mjs.map                                                 [2m 13.07 kB[22m [2m│ gzip:  4.32 kB[22m
[34mℹ[39m [2mdist/[22mtypes-D8bhH891.mjs.map                                                   [2m 12.80 kB[22m [2m│ gzip:  3.79 kB[22m
[34mℹ[39m [2mdist/[22mssrf-BsVGIE0Z.mjs                                                        [2m 12.75 kB[22m [2m│ gzip:  5.03 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/media.mjs.map                          [2m 12.71 kB[22m [2m│ gzip:  3.84 kB[22m
[34mℹ[39m [2mdist/[22mmanifest-schema-Cj-YrzrF.mjs.map                                         [2m 12.21 kB[22m [2m│ gzip:  3.36 kB[22m
[34mℹ[39m [2mdist/[22mredirect-C-FeA4j9.mjs                                                    [2m 12.07 kB[22m [2m│ gzip:  3.71 kB[22m
[34mℹ[39m [2mdist/[22mtransport--Ck3RBin.mjs                                                   [2m 12.05 kB[22m [2m│ gzip:  3.86 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/rewrite-urls.mjs.map                   [2m 11.45 kB[22m [2m│ gzip:  3.70 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/oauth/_provider_/callback.mjs.map                  [2m 11.29 kB[22m [2m│ gzip:  3.77 kB[22m
[34mℹ[39m [2mdist/[22mstorage/local.mjs.map                                                    [2m 11.26 kB[22m [2m│ gzip:  3.76 kB[22m
[34mℹ[39m [2mdist/[22mvalidation-BQ_TP-On.mjs.map                                              [2m 11.09 kB[22m [2m│ gzip:  4.18 kB[22m
[34mℹ[39m [2mdist/[22mtaxonomy-Db5xwphL.mjs                                                    [2m 10.92 kB[22m [2m│ gzip:  3.06 kB[22m
[34mℹ[39m [2mdist/[22muser-tLdHUEXV.mjs.map                                                    [2m 10.46 kB[22m [2m│ gzip:  3.28 kB[22m
[34mℹ[39m [2mdist/[22mbyline-fields-Dr-xcb6S.mjs                                               [2m 10.44 kB[22m [2m│ gzip:  3.04 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media.mjs.map                                           [2m 10.31 kB[22m [2m│ gzip:  3.58 kB[22m
[34mℹ[39m [2mdist/[22mtokens-Bx2afeT-.mjs.map                                                  [2m 10.30 kB[22m [2m│ gzip:  3.28 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/sitemap-_collection_.xml.mjs.map                            [2m 10.23 kB[22m [2m│ gzip:  3.64 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_.mjs.map                       [2m 10.22 kB[22m [2m│ gzip:  2.75 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/token.mjs.map                                     [2m 10.07 kB[22m [2m│ gzip:  3.04 kB[22m
[34mℹ[39m [2mdist/[22mnormalize-DVV8nbrL.mjs.map                                               [2m 10.06 kB[22m [2m│ gzip:  3.02 kB[22m
[34mℹ[39m [2mdist/[22mtypes-CfyYQ7eY.mjs.map                                                   [2m  9.36 kB[22m [2m│ gzip:  3.57 kB[22m
[34mℹ[39m [2mdist/[22msections-8DEa-dWt.mjs                                                    [2m  9.34 kB[22m [2m│ gzip:  2.48 kB[22m
[34mℹ[39m [2mdist/[22mseo-CKr7pLfA.mjs.map                                                     [2m  9.19 kB[22m [2m│ gzip:  3.06 kB[22m
[34mℹ[39m [2mdist/[22mcomment-DkAfGX9E.mjs                                                     [2m  9.18 kB[22m [2m│ gzip:  2.50 kB[22m
[34mℹ[39m [2mdist/[22mresolve-BqYMVG0D.mjs.map                                                 [2m  9.12 kB[22m [2m│ gzip:  3.20 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/rewrite-url-helpers.mjs.map            [2m  9.07 kB[22m [2m│ gzip:  3.12 kB[22m
[34mℹ[39m [2mdist/[22mbyline-fields-DC3Wkk-U.mjs.map                                           [2m  8.96 kB[22m [2m│ gzip:  2.15 kB[22m
[34mℹ[39m [2mdist/[22mcron-DZovZUnC.mjs                                                        [2m  8.95 kB[22m [2m│ gzip:  3.19 kB[22m
[34mℹ[39m [2mdist/[22mpatterns-CqG5Ya3i.mjs.map                                                [2m  8.92 kB[22m [2m│ gzip:  3.02 kB[22m
[34mℹ[39m [2mdist/[22mclient/cf-access.mjs.map                                                 [2m  8.87 kB[22m [2m│ gzip:  3.14 kB[22m
[34mℹ[39m [2mdist/[22mbyline-fields-BNy7Ng1U.d.mts.map                                         [2m  8.85 kB[22m [2m│ gzip:  1.54 kB[22m
[34mℹ[39m [2mdist/[22mmedia/index.mjs.map                                                      [2m  8.84 kB[22m [2m│ gzip:  2.92 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/prepare.mjs.map                        [2m  8.65 kB[22m [2m│ gzip:  3.13 kB[22m
[34mℹ[39m [2mdist/[22moauth-authorization-DvBAL75d.mjs                                         [2m  8.64 kB[22m [2m│ gzip:  2.58 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/dev-bypass.mjs.map                                [2m  8.60 kB[22m [2m│ gzip:  3.24 kB[22m
[34mℹ[39m [2mdist/[22mapi-tokens-VrXNiNvV.mjs.map                                              [2m  8.50 kB[22m [2m│ gzip:  2.44 kB[22m
[34mℹ[39m [2mdist/[22mmedia/local-runtime.mjs.map                                              [2m  8.45 kB[22m [2m│ gzip:  2.58 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs.map      [2m  8.42 kB[22m [2m│ gzip:  2.72 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/register.mjs.map                                  [2m  8.19 kB[22m [2m│ gzip:  2.94 kB[22m
[34mℹ[39m [2mdist/[22mdialect-helpers-DRI5pyY3.mjs.map                                         [2m  8.19 kB[22m [2m│ gzip:  2.27 kB[22m
[34mℹ[39m [2mdist/[22mallowed-origins-CyYLEJkp.mjs.map                                         [2m  8.19 kB[22m [2m│ gzip:  3.02 kB[22m
[34mℹ[39m [2mdist/[22mrequest-meta-7ByVLxB-.mjs.map                                            [2m  8.19 kB[22m [2m│ gzip:  3.15 kB[22m
[34mℹ[39m [2mdist/[22mutils-C4Ih4DML.mjs                                                       [2m  8.16 kB[22m [2m│ gzip:  2.90 kB[22m
[34mℹ[39m [2mdist/[22mzod-generator-MMm56Prt.mjs                                               [2m  8.10 kB[22m [2m│ gzip:  2.42 kB[22m
[34mℹ[39m [2mdist/[22mrate-limit-BI1OdpQH.mjs.map                                              [2m  8.07 kB[22m [2m│ gzip:  3.40 kB[22m
[34mℹ[39m [2mdist/[22mplaceholder-BZxr8W1j.mjs.map                                             [2m  7.97 kB[22m [2m│ gzip:  2.92 kB[22m
[34mℹ[39m [2mdist/[22msettings-Jro4YcUb.mjs                                                    [2m  7.86 kB[22m [2m│ gzip:  2.65 kB[22m
[34mℹ[39m [2mdist/[22mdashboard-BrfLIsX1.mjs.map                                               [2m  7.78 kB[22m [2m│ gzip:  2.87 kB[22m
[34mℹ[39m [2mdist/[22moptions-BL4X94qY.mjs.map                                                 [2m  7.78 kB[22m [2m│ gzip:  2.31 kB[22m
[34mℹ[39m [2mdist/[22mseo/index.mjs.map                                                        [2m  7.67 kB[22m [2m│ gzip:  2.77 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/index.mjs.map                          [2m  7.59 kB[22m [2m│ gzip:  2.39 kB[22m
[34mℹ[39m [2mdist/[22moauth-clients-8mPDStMv.mjs                                               [2m  7.56 kB[22m [2m│ gzip:  1.83 kB[22m
[34mℹ[39m [2mdist/[22mmedia-Cyz5BhSN.mjs                                                       [2m  7.41 kB[22m [2m│ gzip:  2.50 kB[22m
[34mℹ[39m [2mdist/[22mbylines-DCczH3AV.mjs                                                     [2m  6.72 kB[22m [2m│ gzip:  2.54 kB[22m
[34mℹ[39m [2mdist/[22mmanifest-schema-Cj-YrzrF.mjs                                             [2m  6.66 kB[22m [2m│ gzip:  2.24 kB[22m
[34mℹ[39m [2mdist/[22mbylines-CbrD7STW.mjs                                                     [2m  6.54 kB[22m [2m│ gzip:  2.24 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/widgets/_id_.mjs.map                [2m  6.52 kB[22m [2m│ gzip:  1.77 kB[22m
[34mℹ[39m [2mdist/[22mseo-DfjLvu8i.mjs.map                                                     [2m  6.47 kB[22m [2m│ gzip:  2.62 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/settings/email.mjs.map                                  [2m  6.47 kB[22m [2m│ gzip:  2.40 kB[22m
[34mℹ[39m [2mdist/[22mwidgets-DzlINGI6.mjs.map                                                 [2m  6.46 kB[22m [2m│ gzip:  2.29 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/plugins/_pluginId_/_...path_.mjs.map                    [2m  6.43 kB[22m [2m│ gzip:  2.62 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/admin-verify.mjs.map                              [2m  6.33 kB[22m [2m│ gzip:  2.31 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/_id_.mjs.map                                      [2m  6.28 kB[22m [2m│ gzip:  1.75 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/upload-url.mjs.map                                [2m  6.24 kB[22m [2m│ gzip:  2.44 kB[22m
[34mℹ[39m [2mdist/[22mrequest-cache-BYMs-BGX.mjs.map                                           [2m  6.23 kB[22m [2m│ gzip:  2.42 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/admin.mjs.map                                     [2m  6.21 kB[22m [2m│ gzip:  2.51 kB[22m
[34mℹ[39m [2mdist/[22mservice-9P2cdyR_.mjs                                                     [2m  6.21 kB[22m [2m│ gzip:  2.19 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/index.mjs.map                                     [2m  6.16 kB[22m [2m│ gzip:  2.40 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/oauth/_provider_.mjs.map                           [2m  6.14 kB[22m [2m│ gzip:  2.26 kB[22m
[34mℹ[39m [2mdist/[22mtypes-DawhLFwy.d.mts.map                                                 [2m  6.05 kB[22m [2m│ gzip:  1.03 kB[22m
[34mℹ[39m [2mdist/[22mpublic-url-egRHCy1m.mjs.map                                              [2m  5.92 kB[22m [2m│ gzip:  2.40 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/register/verify.mjs.map                    [2m  5.90 kB[22m [2m│ gzip:  2.22 kB[22m
[34mℹ[39m [2mdist/[22mvalidate-VPnKoIzW.mjs.map                                                [2m  5.90 kB[22m [2m│ gzip:  1.70 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/preview-url.mjs.map           [2m  5.90 kB[22m [2m│ gzip:  2.39 kB[22m
[34mℹ[39m [2mdist/[22mastro/middleware/redirect.mjs.map                                        [2m  5.82 kB[22m [2m│ gzip:  2.33 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/_id_/status.mjs.map                      [2m  5.69 kB[22m [2m│ gzip:  2.00 kB[22m
[34mℹ[39m [2mdist/[22mresolve-BqYMVG0D.mjs                                                     [2m  5.63 kB[22m [2m│ gzip:  2.12 kB[22m
[34mℹ[39m [2mdist/[22mvalidation-BQ_TP-On.mjs                                                  [2m  5.61 kB[22m [2m│ gzip:  2.25 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/dev-bypass.mjs.map                                 [2m  5.58 kB[22m [2m│ gzip:  2.30 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/install.mjs.map                  [2m  5.56 kB[22m [2m│ gzip:  2.38 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/schedule.mjs.map              [2m  5.56 kB[22m [2m│ gzip:  1.63 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/providers/_providerId_/index.mjs.map              [2m  5.54 kB[22m [2m│ gzip:  1.81 kB[22m
[34mℹ[39m [2mdist/[22mcomments-DLFnXs7J.mjs                                                    [2m  5.49 kB[22m [2m│ gzip:  1.74 kB[22m
[34mℹ[39m [2mdist/[22mpreview-BfuRkVKW.mjs.map                                                 [2m  5.44 kB[22m [2m│ gzip:  1.93 kB[22m
[34mℹ[39m [2mdist/[22mparse-B-K21lvm.mjs.map                                                   [2m  5.35 kB[22m [2m│ gzip:  1.95 kB[22m
[34mℹ[39m [2mdist/[22mallowed-origins-CyYLEJkp.mjs                                             [2m  5.31 kB[22m [2m│ gzip:  2.05 kB[22m
[34mℹ[39m [2mdist/[22mtypes-DpFmlNyB.mjs.map                                                   [2m  5.27 kB[22m [2m│ gzip:  1.85 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/bylines/_id_/translations.mjs.map                 [2m  5.21 kB[22m [2m│ gzip:  1.88 kB[22m
[34mℹ[39m [2mdist/[22mseo-CKr7pLfA.mjs                                                         [2m  5.12 kB[22m [2m│ gzip:  1.82 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/status.mjs.map                                    [2m  5.09 kB[22m [2m│ gzip:  1.96 kB[22m
[34mℹ[39m [2mdist/[22mpatterns-CqG5Ya3i.mjs                                                    [2m  5.05 kB[22m [2m│ gzip:  1.85 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/index.mjs.map                      [2m  4.98 kB[22m [2m│ gzip:  1.84 kB[22m
[34mℹ[39m [2mdist/[22mclient/index.d.mts.map                                                   [2m  4.98 kB[22m [2m│ gzip:  1.43 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/_slug_/translations.mjs.map     [2m  4.98 kB[22m [2m│ gzip:  1.50 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/_id_.mjs.map                               [2m  4.95 kB[22m [2m│ gzip:  1.56 kB[22m
[34mℹ[39m [2mdist/[22mtokens-Bx2afeT-.mjs                                                      [2m  4.94 kB[22m [2m│ gzip:  1.73 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/_slug_.mjs.map                  [2m  4.92 kB[22m [2m│ gzip:  1.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/typegen.mjs.map                                         [2m  4.90 kB[22m [2m│ gzip:  1.79 kB[22m
[34mℹ[39m [2mdist/[22mrequest-context.mjs.map                                                  [2m  4.88 kB[22m [2m│ gzip:  2.14 kB[22m
[34mℹ[39m [2mdist/[22mnormalize-DVV8nbrL.mjs                                                   [2m  4.86 kB[22m [2m│ gzip:  1.48 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/allowed-domains/_domain_.mjs.map                  [2m  4.84 kB[22m [2m│ gzip:  1.49 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/oauth-clients/_id_.mjs.map                        [2m  4.75 kB[22m [2m│ gzip:  1.34 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/analyze.mjs.map                 [2m  4.74 kB[22m [2m│ gzip:  1.92 kB[22m
[34mℹ[39m [2mdist/[22muser-tLdHUEXV.mjs                                                        [2m  4.74 kB[22m [2m│ gzip:  1.69 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/byline-fields/_slug_.mjs.map                      [2m  4.70 kB[22m [2m│ gzip:  1.46 kB[22m
[34mℹ[39m [2mdist/[22mdatabase/instrumentation.mjs.map                                         [2m  4.63 kB[22m [2m│ gzip:  2.02 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/publish.mjs.map               [2m  4.63 kB[22m [2m│ gzip:  1.84 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/allowed-domains/index.mjs.map                     [2m  4.61 kB[22m [2m│ gzip:  1.60 kB[22m
[34mℹ[39m [2mdist/[22mrequest-meta-7ByVLxB-.mjs                                                [2m  4.58 kB[22m [2m│ gzip:  1.93 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/bylines/_id_/index.mjs.map                        [2m  4.54 kB[22m [2m│ gzip:  1.61 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/index.mjs.map                                    [2m  4.52 kB[22m [2m│ gzip:  1.76 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/translations.mjs.map                       [2m  4.49 kB[22m [2m│ gzip:  1.48 kB[22m
[34mℹ[39m [2mdist/[22mplugin-utils.mjs.map                                                     [2m  4.46 kB[22m [2m│ gzip:  1.89 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/signup/request.mjs.map                             [2m  4.45 kB[22m [2m│ gzip:  1.92 kB[22m
[34mℹ[39m [2mdist/[22mrate-limit-BI1OdpQH.mjs                                                  [2m  4.43 kB[22m [2m│ gzip:  2.07 kB[22m
[34mℹ[39m [2mdist/[22mtrusted-proxy-B4AfnoAp.mjs.map                                           [2m  4.43 kB[22m [2m│ gzip:  1.96 kB[22m
[34mℹ[39m [2mdist/[22mastro/types.d.mts.map                                                    [2m  4.42 kB[22m [2m│ gzip:  1.23 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/magic-link/send.mjs.map                            [2m  4.40 kB[22m [2m│ gzip:  1.78 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/index.mjs.map                              [2m  4.39 kB[22m [2m│ gzip:  1.57 kB[22m
[34mℹ[39m [2mdist/[22mplaceholder-BZxr8W1j.mjs                                                 [2m  4.39 kB[22m [2m│ gzip:  1.77 kB[22m
[34mℹ[39m [2mdist/[22mvalidate-VPnKoIzW.mjs                                                    [2m  4.35 kB[22m [2m│ gzip:  1.32 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/signup/complete.mjs.map                            [2m  4.33 kB[22m [2m│ gzip:  1.74 kB[22m
[34mℹ[39m [2mdist/[22mbase64-CqR-7kqF.mjs.map                                                  [2m  4.31 kB[22m [2m│ gzip:  1.41 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/options.mjs.map                            [2m  4.30 kB[22m [2m│ gzip:  1.76 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/_id_/confirm.mjs.map                              [2m  4.30 kB[22m [2m│ gzip:  1.76 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/complete.mjs.map                            [2m  4.29 kB[22m [2m│ gzip:  1.72 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/themes/preview.mjs.map                                  [2m  4.25 kB[22m [2m│ gzip:  1.80 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/index.mjs.map                               [2m  4.23 kB[22m [2m│ gzip:  1.83 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/hooks/exclusive/_hookName_.mjs.map                [2m  4.20 kB[22m [2m│ gzip:  1.71 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/register/options.mjs.map                   [2m  4.18 kB[22m [2m│ gzip:  1.69 kB[22m
[34mℹ[39m [2mdist/[22moauth-state-store-BJ7YtrfD.mjs.map                                       [2m  4.17 kB[22m [2m│ gzip:  1.51 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/redirects/_id_.mjs.map                                  [2m  4.17 kB[22m [2m│ gzip:  1.10 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/_id_/update.mjs.map              [2m  4.09 kB[22m [2m│ gzip:  1.70 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/register-options.mjs.map                    [2m  4.09 kB[22m [2m│ gzip:  1.75 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/bylines/index.mjs.map                             [2m  4.08 kB[22m [2m│ gzip:  1.48 kB[22m
[34mℹ[39m [2mdist/[22mastro/middleware/setup.mjs.map                                           [2m  4.08 kB[22m [2m│ gzip:  1.67 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/sitemap.xml.mjs.map                                         [2m  4.05 kB[22m [2m│ gzip:  1.66 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/manifest.mjs.map                                        [2m  4.04 kB[22m [2m│ gzip:  1.84 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/sections/_slug_.mjs.map                                 [2m  3.99 kB[22m [2m│ gzip:  1.04 kB[22m
[34mℹ[39m [2mdist/[22mapi-tokens-VrXNiNvV.mjs                                                  [2m  3.95 kB[22m [2m│ gzip:  1.26 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/providers/_providerId_/_itemId_.mjs.map           [2m  3.95 kB[22m [2m│ gzip:  1.20 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_.mjs.map                             [2m  3.86 kB[22m [2m│ gzip:  1.25 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/index.mjs.map                 [2m  3.83 kB[22m [2m│ gzip:  1.15 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_.mjs.map                                    [2m  3.79 kB[22m [2m│ gzip:  1.00 kB[22m
[34mℹ[39m [2mdist/[22mdb/index.mjs.map                                                         [2m  3.77 kB[22m [2m│ gzip:  1.42 kB[22m
[34mℹ[39m [2mdist/[22mbyline-fields-DC3Wkk-U.mjs                                               [2m  3.74 kB[22m [2m│ gzip:  0.97 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/widgets.mjs.map                     [2m  3.74 kB[22m [2m│ gzip:  1.48 kB[22m
[34mℹ[39m [2mdist/[22moptions-BL4X94qY.mjs                                                     [2m  3.69 kB[22m [2m│ gzip:  1.26 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/redirects/404s/index.mjs.map                            [2m  3.64 kB[22m [2m│ gzip:  1.07 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/duplicate.mjs.map             [2m  3.62 kB[22m [2m│ gzip:  1.48 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs.map    [2m  3.60 kB[22m [2m│ gzip:  1.01 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/updates.mjs.map                           [2m  3.56 kB[22m [2m│ gzip:  1.51 kB[22m
[34mℹ[39m [2mdist/[22mcache-DIHHyPkt.mjs.map                                                   [2m  3.54 kB[22m [2m│ gzip:  1.45 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/verify.mjs.map                             [2m  3.54 kB[22m [2m│ gzip:  1.42 kB[22m
[34mℹ[39m [2mdist/[22mdashboard-BrfLIsX1.mjs                                                   [2m  3.54 kB[22m [2m│ gzip:  1.51 kB[22m
[34mℹ[39m [2mdist/[22mrequest-cache-BYMs-BGX.mjs                                               [2m  3.53 kB[22m [2m│ gzip:  1.51 kB[22m
[34mℹ[39m [2mdist/[22mmime-CCEzze7W.mjs.map                                                    [2m  3.52 kB[22m [2m│ gzip:  1.48 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/device/token.mjs.map                              [2m  3.50 kB[22m [2m│ gzip:  1.56 kB[22m
[34mℹ[39m [2mdist/[22mcomponents-CTfpu3PZ.mjs.map                                              [2m  3.46 kB[22m [2m│ gzip:  0.99 kB[22m
[34mℹ[39m [2mdist/[22mchallenge-store-DGwuCc4R.mjs.map                                         [2m  3.43 kB[22m [2m│ gzip:  1.34 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/disable.mjs.map                        [2m  3.43 kB[22m [2m│ gzip:  1.49 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/byline-fields/index.mjs.map                       [2m  3.38 kB[22m [2m│ gzip:  1.34 kB[22m
[34mℹ[39m [2mdist/[22mpublic-url-egRHCy1m.mjs                                                  [2m  3.37 kB[22m [2m│ gzip:  1.50 kB[22m
[34mℹ[39m [2mdist/[22mtypes-DWnN7weG.d.mts.map                                                 [2m  3.35 kB[22m [2m│ gzip:  1.20 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/items/_id_.mjs.map                         [2m  3.34 kB[22m [2m│ gzip:  1.04 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/index.mjs.map                   [2m  3.33 kB[22m [2m│ gzip:  1.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/file/_...key_.mjs.map                             [2m  3.33 kB[22m [2m│ gzip:  1.52 kB[22m
[34mℹ[39m [2mdist/[22mdialect-helpers-DRI5pyY3.mjs                                             [2m  3.33 kB[22m [2m│ gzip:  1.12 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/oauth-clients/index.mjs.map                       [2m  3.32 kB[22m [2m│ gzip:  1.25 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/robots.txt.mjs.map                                          [2m  3.28 kB[22m [2m│ gzip:  1.34 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/send-recovery.mjs.map                  [2m  3.27 kB[22m [2m│ gzip:  1.44 kB[22m
[34mℹ[39m [2mdist/[22mwidgets-DzlINGI6.mjs                                                     [2m  3.27 kB[22m [2m│ gzip:  1.22 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/restore.mjs.map               [2m  3.25 kB[22m [2m│ gzip:  1.34 kB[22m
[34mℹ[39m [2mdist/[22mdb-errors-CtzxKBxe.mjs.map                                               [2m  3.25 kB[22m [2m│ gzip:  1.28 kB[22m
[34mℹ[39m [2mdist/[22memail-console-DHT2Fbpj.mjs.map                                           [2m  3.23 kB[22m [2m│ gzip:  1.54 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/magic-link/verify.mjs.map                          [2m  3.18 kB[22m [2m│ gzip:  1.34 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/discard-draft.mjs.map         [2m  3.18 kB[22m [2m│ gzip:  1.31 kB[22m
[34mℹ[39m [2mdist/[22mvalidate-Dy6nkNls.d.mts.map                                              [2m  3.17 kB[22m [2m│ gzip:  0.98 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/reorder.mjs.map                     [2m  3.16 kB[22m [2m│ gzip:  1.32 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/api-tokens/index.mjs.map                          [2m  3.11 kB[22m [2m│ gzip:  1.21 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/unpublish.mjs.map             [2m  3.11 kB[22m [2m│ gzip:  1.27 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/_id_/install.mjs.map          [2m  3.10 kB[22m [2m│ gzip:  1.31 kB[22m
[34mℹ[39m [2mdist/[22mmode-BjlXswIw.mjs.map                                                    [2m  3.04 kB[22m [2m│ gzip:  1.13 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/me.mjs.map                                         [2m  3.04 kB[22m [2m│ gzip:  1.31 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/search/rebuild.mjs.map                                  [2m  3.02 kB[22m [2m│ gzip:  1.23 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs.map         [2m  2.97 kB[22m [2m│ gzip:  1.31 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/revisions/_revisionId_/restore.mjs.map                  [2m  2.94 kB[22m [2m│ gzip:  1.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/_id_/icon.mjs.map             [2m  2.94 kB[22m [2m│ gzip:  1.30 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/index.mjs.map                               [2m  2.94 kB[22m [2m│ gzip:  1.30 kB[22m
[34mℹ[39m [2mdist/[22mruntime.mjs.map                                                          [2m  2.91 kB[22m [2m│ gzip:  1.25 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/settings.mjs.map                                        [2m  2.89 kB[22m [2m│ gzip:  1.06 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/index.mjs.map                                [2m  2.89 kB[22m [2m│ gzip:  1.02 kB[22m
[34mℹ[39m [2mdist/[22mtypes-D8bhH891.mjs                                                       [2m  2.88 kB[22m [2m│ gzip:  1.33 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/redirects/index.mjs.map                                 [2m  2.86 kB[22m [2m│ gzip:  1.00 kB[22m
[34mℹ[39m [2mdist/[22mpreview-BfuRkVKW.mjs                                                     [2m  2.85 kB[22m [2m│ gzip:  1.02 kB[22m
[34mℹ[39m [2mdist/[22mparse-B-K21lvm.mjs                                                       [2m  2.83 kB[22m [2m│ gzip:  1.15 kB[22m
[34mℹ[39m [2mdist/[22mdefault-xLFNSsZ9.mjs.map                                                 [2m  2.82 kB[22m [2m│ gzip:  0.81 kB[22m
[34mℹ[39m [2mdist/[22mpasskey-config-BDVM86Tj.mjs.map                                          [2m  2.81 kB[22m [2m│ gzip:  1.25 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/search/index.mjs.map                                    [2m  2.78 kB[22m [2m│ gzip:  1.33 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/well-known/auth.mjs.map                                 [2m  2.75 kB[22m [2m│ gzip:  1.22 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/device/code.mjs.map                               [2m  2.74 kB[22m [2m│ gzip:  1.27 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/sections/index.mjs.map                                  [2m  2.71 kB[22m [2m│ gzip:  0.96 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/update.mjs.map                       [2m  2.71 kB[22m [2m│ gzip:  1.12 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/translations.mjs.map          [2m  2.70 kB[22m [2m│ gzip:  1.28 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/_id_.mjs.map                             [2m  2.68 kB[22m [2m│ gzip:  0.92 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/search/enable.mjs.map                                   [2m  2.65 kB[22m [2m│ gzip:  1.12 kB[22m
[34mℹ[39m [2mdist/[22mtypes-CfyYQ7eY.mjs                                                       [2m  2.64 kB[22m [2m│ gzip:  1.19 kB[22m
[34mℹ[39m [2mdist/[22mseo-DfjLvu8i.mjs                                                         [2m  2.59 kB[22m [2m│ gzip:  1.21 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/callback.mjs.map                [2m  2.55 kB[22m [2m│ gzip:  1.19 kB[22m
[34mℹ[39m [2mdist/[22mplaceholder-B9lUUEmj.d.mts.map                                           [2m  2.50 kB[22m [2m│ gzip:  0.92 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/index.mjs.map                                     [2m  2.48 kB[22m [2m│ gzip:  0.97 kB[22m
[34mℹ[39m [2mdist/[22mconfig-CVssduLe.mjs.map                                                  [2m  2.48 kB[22m [2m│ gzip:  1.09 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/themes/marketplace/index.mjs.map                  [2m  2.44 kB[22m [2m│ gzip:  1.06 kB[22m
[34mℹ[39m [2mdist/[22mschema-BpCJh2lU.mjs.map                                                  [2m  2.44 kB[22m [2m│ gzip:  1.04 kB[22m
[34mℹ[39m [2mdist/[22mbase64-CqR-7kqF.mjs                                                      [2m  2.44 kB[22m [2m│ gzip:  0.92 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/index.mjs.map                        [2m  2.42 kB[22m [2m│ gzip:  0.89 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/index.mjs.map          [2m  2.41 kB[22m [2m│ gzip:  0.83 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/_id_/uninstall.mjs.map           [2m  2.39 kB[22m [2m│ gzip:  1.08 kB[22m
[34mℹ[39m [2mdist/[22mindex-D60_SzHG.d.mts.map                                                 [2m  2.36 kB[22m [2m│ gzip:  0.80 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/hooks/exclusive/index.mjs.map                     [2m  2.33 kB[22m [2m│ gzip:  1.11 kB[22m
[34mℹ[39m [2mdist/[22mtransaction-NQj4VJ7Z.mjs.map                                             [2m  2.32 kB[22m [2m│ gzip:  1.10 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/signup/verify.mjs.map                              [2m  2.29 kB[22m [2m│ gzip:  1.13 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/enable.mjs.map                       [2m  2.28 kB[22m [2m│ gzip:  1.05 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/mode.mjs.map                                       [2m  2.27 kB[22m [2m│ gzip:  1.13 kB[22m
[34mℹ[39m [2mdist/[22mauthorize-CLTmOUyx.mjs.map                                               [2m  2.24 kB[22m [2m│ gzip:  0.85 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/accept.mjs.map                              [2m  2.22 kB[22m [2m│ gzip:  1.09 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/well-known/oauth-authorization-server.mjs.map           [2m  2.21 kB[22m [2m│ gzip:  0.97 kB[22m
[34mℹ[39m [2mdist/[22moptions-tb7DJROi.d.mts.map                                               [2m  2.19 kB[22m [2m│ gzip:  0.83 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/search/suggest.mjs.map                                  [2m  2.19 kB[22m [2m│ gzip:  1.06 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/uninstall.mjs.map                    [2m  2.18 kB[22m [2m│ gzip:  0.98 kB[22m
[34mℹ[39m [2mdist/[22mhash-9w3pd3-m.mjs.map                                                    [2m  2.18 kB[22m [2m│ gzip:  1.05 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/index.mjs.map                              [2m  2.11 kB[22m [2m│ gzip:  1.03 kB[22m
[34mℹ[39m [2mdist/[22mdb-errors-CtzxKBxe.mjs                                                   [2m  2.10 kB[22m [2m│ gzip:  0.89 kB[22m
[34mℹ[39m [2mdist/[22msetup-complete-VoEZfasi.mjs.map                                          [2m  2.08 kB[22m [2m│ gzip:  0.91 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/device/authorize.mjs.map                          [2m  2.06 kB[22m [2m│ gzip:  1.00 kB[22m
[34mℹ[39m [2mdist/[22mslugify-Cjh1ssOZ.mjs.map                                                 [2m  2.04 kB[22m [2m│ gzip:  1.01 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/index.mjs.map                            [2m  2.01 kB[22m [2m│ gzip:  0.90 kB[22m
[34mℹ[39m [2mdist/[22mtrusted-proxy-B4AfnoAp.mjs                                               [2m  1.99 kB[22m [2m│ gzip:  0.97 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/enable.mjs.map                         [2m  1.99 kB[22m [2m│ gzip:  0.94 kB[22m
[34mℹ[39m [2mdist/[22mcomponents-CTfpu3PZ.mjs                                                  [2m  1.99 kB[22m [2m│ gzip:  0.71 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/bulk.mjs.map                             [2m  1.98 kB[22m [2m│ gzip:  0.88 kB[22m
[34mℹ[39m [2mdist/[22mcache-DIHHyPkt.mjs                                                       [2m  1.97 kB[22m [2m│ gzip:  0.80 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/index.mjs.map                 [2m  1.91 kB[22m [2m│ gzip:  0.86 kB[22m
[34mℹ[39m [2mdist/[22msettings-DYVzINdn.mjs.map                                                [2m  1.91 kB[22m [2m│ gzip:  0.71 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/reorder.mjs.map                            [2m  1.88 kB[22m [2m│ gzip:  0.86 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/items.mjs.map                              [2m  1.87 kB[22m [2m│ gzip:  0.86 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/probe.mjs.map                                    [2m  1.84 kB[22m [2m│ gzip:  0.87 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/byline-fields/reorder.mjs.map                     [2m  1.82 kB[22m [2m│ gzip:  0.87 kB[22m
[34mℹ[39m [2mdist/[22moauth-state-store-BJ7YtrfD.mjs                                           [2m  1.79 kB[22m [2m│ gzip:  0.72 kB[22m
[34mℹ[39m [2mdist/[22mmedia-allowlist-CMcoYIjQ.mjs.map                                         [2m  1.77 kB[22m [2m│ gzip:  0.94 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/setup/dev-reset.mjs.map                                 [2m  1.77 kB[22m [2m│ gzip:  0.89 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/disable.mjs.map                      [2m  1.77 kB[22m [2m│ gzip:  0.82 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/orphans/_slug_.mjs.map                           [2m  1.77 kB[22m [2m│ gzip:  0.81 kB[22m
[34mℹ[39m [2mdist/[22mpage/index.d.mts.map                                                     [2m  1.75 kB[22m [2m│ gzip:  0.67 kB[22m
[34mℹ[39m [2mdist/[22mtypes-DbCWhHet.d.mts.map                                                 [2m  1.74 kB[22m [2m│ gzip:  0.52 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/token/refresh.mjs.map                             [2m  1.72 kB[22m [2m│ gzip:  0.87 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/byline-fields/_slug_/usage.mjs.map                [2m  1.69 kB[22m [2m│ gzip:  0.87 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/api-tokens/_id_.mjs.map                           [2m  1.68 kB[22m [2m│ gzip:  0.85 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/redirects/404s/summary.mjs.map                          [2m  1.68 kB[22m [2m│ gzip:  0.79 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/oauth/token/revoke.mjs.map                              [2m  1.68 kB[22m [2m│ gzip:  0.87 kB[22m
[34mℹ[39m [2mdist/[22memail-console-DHT2Fbpj.mjs                                               [2m  1.67 kB[22m [2m│ gzip:  0.86 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/revisions.mjs.map             [2m  1.67 kB[22m [2m│ gzip:  0.84 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/well-known/oauth-protected-resource.mjs.map             [2m  1.64 kB[22m [2m│ gzip:  0.85 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/permanent.mjs.map             [2m  1.62 kB[22m [2m│ gzip:  0.79 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/reorder.mjs.map        [2m  1.60 kB[22m [2m│ gzip:  0.72 kB[22m
[34mℹ[39m [2mdist/[22mchallenge-store-DGwuCc4R.mjs                                             [2m  1.59 kB[22m [2m│ gzip:  0.68 kB[22m
[34mℹ[39m [2mdist/[22mpasskey-config-BDVM86Tj.mjs                                              [2m  1.56 kB[22m [2m│ gzip:  0.74 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/trash.mjs.map                      [2m  1.55 kB[22m [2m│ gzip:  0.77 kB[22m
[34mℹ[39m [2mdist/[22mapi/route-utils.mjs.map                                                  [2m  1.54 kB[22m [2m│ gzip:  0.70 kB[22m
[34mℹ[39m [2mdist/[22mtypes-kwqCOUxj.d.mts.map                                                 [2m  1.53 kB[22m [2m│ gzip:  0.67 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/index.mjs.map                        [2m  1.48 kB[22m [2m│ gzip:  0.74 kB[22m
[34mℹ[39m [2mdist/[22mtypes-i8_uzhMD.d.mts.map                                                 [2m  1.48 kB[22m [2m│ gzip:  0.53 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/_id_/index.mjs.map            [2m  1.45 kB[22m [2m│ gzip:  0.72 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/auth/logout.mjs.map                                     [2m  1.44 kB[22m [2m│ gzip:  0.77 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/themes/marketplace/_id_/index.mjs.map             [2m  1.43 kB[22m [2m│ gzip:  0.72 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/dev/emails.mjs.map                                      [2m  1.43 kB[22m [2m│ gzip:  0.63 kB[22m
[34mℹ[39m [2mdist/[22moauth-user-lookup-BdDSDvjF.mjs.map                                       [2m  1.41 kB[22m [2m│ gzip:  0.76 kB[22m
[34mℹ[39m [2mdist/[22mdefault-xLFNSsZ9.mjs                                                     [2m  1.35 kB[22m [2m│ gzip:  0.50 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/dashboard.mjs.map                                       [2m  1.34 kB[22m [2m│ gzip:  0.71 kB[22m
[34mℹ[39m [2mdist/[22mslugify-Cjh1ssOZ.mjs                                                     [2m  1.31 kB[22m [2m│ gzip:  0.71 kB[22m
[34mℹ[39m [2mdist/[22mplugin-types.d.mts.map                                                   [2m  1.31 kB[22m [2m│ gzip:  0.48 kB[22m
[34mℹ[39m [2mdist/[22msite-url-Cm8-sJy7.mjs.map                                                [2m  1.30 kB[22m [2m│ gzip:  0.73 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/counts.mjs.map                           [2m  1.30 kB[22m [2m│ gzip:  0.65 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/search/stats.mjs.map                                    [2m  1.29 kB[22m [2m│ gzip:  0.69 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/revisions/_revisionId_/index.mjs.map                    [2m  1.29 kB[22m [2m│ gzip:  0.68 kB[22m
[34mℹ[39m [2mdist/[22mload-CF5oETkh.mjs.map                                                    [2m  1.28 kB[22m [2m│ gzip:  0.64 kB[22m
[34mℹ[39m [2mdist/[22mmime-CCEzze7W.mjs                                                        [2m  1.28 kB[22m [2m│ gzip:  0.64 kB[22m
[34mℹ[39m [2mdist/[22mauthorize-CLTmOUyx.mjs                                                   [2m  1.28 kB[22m [2m│ gzip:  0.52 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/index.mjs.map                             [2m  1.27 kB[22m [2m│ gzip:  0.67 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/compare.mjs.map               [2m  1.25 kB[22m [2m│ gzip:  0.67 kB[22m
[34mℹ[39m [2mdist/[22mconfig-CVssduLe.mjs                                                      [2m  1.23 kB[22m [2m│ gzip:  0.58 kB[22m
[34mℹ[39m [2mdist/[22mmedia-allowlist-CMcoYIjQ.mjs                                             [2m  1.21 kB[22m [2m│ gzip:  0.70 kB[22m
[34mℹ[39m [2mdist/[22mhash-9w3pd3-m.mjs                                                        [2m  1.21 kB[22m [2m│ gzip:  0.66 kB[22m
[34mℹ[39m [2mdist/[22mschema-BpCJh2lU.mjs                                                      [2m  1.20 kB[22m [2m│ gzip:  0.59 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/media/providers/index.mjs.map                           [2m  1.16 kB[22m [2m│ gzip:  0.62 kB[22m
[34mℹ[39m [2mdist/[22msettings-DYVzINdn.mjs                                                    [2m  1.16 kB[22m [2m│ gzip:  0.48 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/PluginRegistry.mjs.map                                      [2m  1.15 kB[22m [2m│ gzip:  0.57 kB[22m
[34mℹ[39m [2mdist/[22mdb/postgres.mjs.map                                                      [2m  1.14 kB[22m [2m│ gzip:  0.53 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/orphans/index.mjs.map                            [2m  1.14 kB[22m [2m│ gzip:  0.57 kB[22m
[34mℹ[39m [2mdist/[22msetup-complete-VoEZfasi.mjs                                              [2m  1.12 kB[22m [2m│ gzip:  0.51 kB[22m
[34mℹ[39m [2mdist/[22msetup-nonce-Bm0uKqmf.mjs.map                                             [2m  1.10 kB[22m [2m│ gzip:  0.63 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/execute.d.mts.map                      [2m  1.09 kB[22m [2m│ gzip:  0.53 kB[22m
[34mℹ[39m [2mdist/[22msetup-nonce-Bm0uKqmf.mjs                                                 [2m  1.02 kB[22m [2m│ gzip:  0.58 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/analyze.d.mts.map                      [2m  1.00 kB[22m [2m│ gzip:  0.43 kB[22m
[34mℹ[39m [2mdist/[22mauth/providers/github.mjs.map                                            [2m  0.99 kB[22m [2m│ gzip:  0.51 kB[22m
[34mℹ[39m [2mdist/[22mauth/providers/google.mjs.map                                            [2m  0.99 kB[22m [2m│ gzip:  0.51 kB[22m
[34mℹ[39m [2mdist/[22mtypes-Qa7-HJJC.d.mts.map                                                 [2m  0.94 kB[22m [2m│ gzip:  0.46 kB[22m
[34mℹ[39m [2mdist/[22mtransaction-NQj4VJ7Z.mjs                                                 [2m  0.92 kB[22m [2m│ gzip:  0.48 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/widget-components.mjs.map                               [2m  0.91 kB[22m [2m│ gzip:  0.51 kB[22m
[34mℹ[39m [2mdist/[22mdb/sqlite.mjs.map                                                        [2m  0.91 kB[22m [2m│ gzip:  0.51 kB[22m
[34mℹ[39m [2mdist/[22mchunks-DnnHlRG3.mjs.map                                                  [2m  0.90 kB[22m [2m│ gzip:  0.57 kB[22m
[34mℹ[39m [2mdist/[22moauth-user-lookup-BdDSDvjF.mjs                                           [2m  0.81 kB[22m [2m│ gzip:  0.49 kB[22m
[34mℹ[39m [2mdist/[22mchunks-DnnHlRG3.mjs                                                      [2m  0.80 kB[22m [2m│ gzip:  0.51 kB[22m
[34mℹ[39m [2mdist/[22mredirect-Cw3JTlmj.mjs.map                                                [2m  0.75 kB[22m [2m│ gzip:  0.49 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/rewrite-url-helpers.d.mts.map          [2m  0.74 kB[22m [2m│ gzip:  0.34 kB[22m
[34mℹ[39m [2mdist/[22mdb/libsql.mjs.map                                                        [2m  0.71 kB[22m [2m│ gzip:  0.41 kB[22m
[34mℹ[39m [2mdist/[22mload-CF5oETkh.mjs                                                        [2m  0.70 kB[22m [2m│ gzip:  0.38 kB[22m
[34mℹ[39m [2mdist/[22merrors-9P_FDrJ_.mjs.map                                                  [2m  0.67 kB[22m [2m│ gzip:  0.45 kB[22m
[34mℹ[39m [2mdist/[22madapters-C5AWLJSD.d.mts.map                                              [2m  0.67 kB[22m [2m│ gzip:  0.32 kB[22m
[34mℹ[39m [2mdist/[22mstorage/s3.d.mts.map                                                     [2m  0.67 kB[22m [2m│ gzip:  0.33 kB[22m
[34mℹ[39m [2mdist/[22mseo/index.d.mts.map                                                      [2m  0.64 kB[22m [2m│ gzip:  0.36 kB[22m
[34mℹ[39m [2mdist/[22mstorage/local.d.mts.map                                                  [2m  0.62 kB[22m [2m│ gzip:  0.32 kB[22m
[34mℹ[39m [2mdist/[22mtypes-DX6v9KzJ.d.mts.map                                                 [2m  0.59 kB[22m [2m│ gzip:  0.31 kB[22m
[34mℹ[39m [2mdist/[22mversion-Bfzo4Tqq.mjs.map                                                 [2m  0.59 kB[22m [2m│ gzip:  0.33 kB[22m
[34mℹ[39m [2mdist/[22mescape-bIyGoW5W.mjs.map                                                  [2m  0.58 kB[22m [2m│ gzip:  0.34 kB[22m
[34mℹ[39m [2mdist/[22mmode-BjlXswIw.mjs                                                        [2m  0.58 kB[22m [2m│ gzip:  0.36 kB[22m
[34mℹ[39m [2mdist/[22mrequest-context.d.mts.map                                                [2m  0.57 kB[22m [2m│ gzip:  0.31 kB[22m
[34mℹ[39m [2mdist/[22mplugin-utils.d.mts.map                                                   [2m  0.56 kB[22m [2m│ gzip:  0.30 kB[22m
[34mℹ[39m [2mdist/[22mdatabase/instrumentation.d.mts.map                                       [2m  0.53 kB[22m [2m│ gzip:  0.28 kB[22m
[34mℹ[39m [2mdist/[22mredirect-Cw3JTlmj.mjs                                                    [2m  0.53 kB[22m [2m│ gzip:  0.37 kB[22m
[34mℹ[39m [2mdist/[22merrors-9P_FDrJ_.mjs                                                      [2m  0.53 kB[22m [2m│ gzip:  0.34 kB[22m
[34mℹ[39m [2mdist/[22mtransport-OnMNbsIA.d.mts.map                                             [2m  0.49 kB[22m [2m│ gzip:  0.28 kB[22m
[34mℹ[39m [2mdist/[22mrunner-DM1yR5qd.d.mts.map                                                [2m  0.49 kB[22m [2m│ gzip:  0.25 kB[22m
[34mℹ[39m [2mdist/[22mclient/cf-access.d.mts.map                                               [2m  0.49 kB[22m [2m│ gzip:  0.27 kB[22m
[34mℹ[39m [2mdist/[22mapi/route-utils.d.mts.map                                                [2m  0.48 kB[22m [2m│ gzip:  0.27 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/media.d.mts.map                        [2m  0.45 kB[22m [2m│ gzip:  0.25 kB[22m
[34mℹ[39m [2mdist/[22msite-url-Cm8-sJy7.mjs                                                    [2m  0.44 kB[22m [2m│ gzip:  0.30 kB[22m
[34mℹ[39m [2mdist/[22mmedia/local-runtime.d.mts.map                                            [2m  0.40 kB[22m [2m│ gzip:  0.23 kB[22m
[34mℹ[39m [2mdist/[22mastro/index.d.mts.map                                                    [2m  0.36 kB[22m [2m│ gzip:  0.22 kB[22m
[34mℹ[39m [2mdist/[22mtypes-DpFmlNyB.mjs                                                       [2m  0.36 kB[22m [2m│ gzip:  0.24 kB[22m
[34mℹ[39m [2mdist/[22mescape-bIyGoW5W.mjs                                                      [2m  0.36 kB[22m [2m│ gzip:  0.25 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/rewrite-urls.d.mts.map                 [2m  0.34 kB[22m [2m│ gzip:  0.23 kB[22m
[34mℹ[39m [2mdist/[22mastro/middleware/auth.d.mts.map                                          [2m  0.33 kB[22m [2m│ gzip:  0.22 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/execute.d.mts.map               [2m  0.32 kB[22m [2m│ gzip:  0.23 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/prepare.d.mts.map                      [2m  0.32 kB[22m [2m│ gzip:  0.21 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/plugins/_pluginId_/_...path_.d.mts.map                  [2m  0.29 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/analyze.d.mts.map               [2m  0.27 kB[22m [2m│ gzip:  0.20 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.d.mts.map  [2m  0.26 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/PluginRegistry.d.mts.map                                    [2m  0.26 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22mtypes-Cj2S6FuC.mjs                                                       [2m  0.25 kB[22m [2m│ gzip:  0.16 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/_slug_.d.mts.map                [2m  0.25 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22mapi-tokens-B6VgoE6M.mjs                                                  [2m  0.25 kB[22m [2m│ gzip:  0.17 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/terms/_taxonomy_.d.mts.map    [2m  0.24 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/import/probe.d.mts.map                                  [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/index.d.mts.map               [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/oauth-clients/_id_.d.mts.map                      [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/_slug_/translations.d.mts.map   [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/byline-fields/_slug_.d.mts.map                    [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
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
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/byline-fields/index.d.mts.map                     [2m  0.20 kB[22m [2m│ gzip:  0.17 kB[22m
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
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/byline-fields/_slug_/usage.d.mts.map              [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
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
[34mℹ[39m [2mdist/[22mastro/routes/api/admin/byline-fields/reorder.d.mts.map                   [2m  0.18 kB[22m [2m│ gzip:  0.16 kB[22m
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
[34mℹ[39m [2mdist/[22mversion-Bfzo4Tqq.mjs                                                     [2m  0.17 kB[22m [2m│ gzip:  0.16 kB[22m
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
[34mℹ[39m [2mdist/[22mssrf-BvgVcfNQ.mjs                                                        [2m  0.01 kB[22m [2m│ gzip:  0.03 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mindex.d.mts[22m[39m                                                              [2m 18.25 kB[22m [2m│ gzip:  4.84 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/types.d.mts[22m[39m                                                        [2m 13.02 kB[22m [2m│ gzip:  3.97 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mclient/index.d.mts[22m[39m                                                       [2m 11.50 kB[22m [2m│ gzip:  3.14 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mapi/schemas/index.d.mts[22m[39m                                                  [2m  8.30 kB[22m [2m│ gzip:  1.94 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mpage/index.d.mts[22m[39m                                                         [2m  6.82 kB[22m [2m│ gzip:  2.27 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mplugin-types.d.mts[22m[39m                                                       [2m  6.61 kB[22m [2m│ gzip:  2.36 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/execute.d.mts[22m[39m                          [2m  3.92 kB[22m [2m│ gzip:  1.55 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mapi/route-utils.d.mts[22m[39m                                                    [2m  2.94 kB[22m [2m│ gzip:  1.35 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mplugin-utils.d.mts[22m[39m                                                       [2m  2.85 kB[22m [2m│ gzip:  1.24 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mrequest-context.d.mts[22m[39m                                                    [2m  2.81 kB[22m [2m│ gzip:  1.29 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/index.d.mts[22m[39m                                                        [2m  2.60 kB[22m [2m│ gzip:  1.17 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mclient/cf-access.d.mts[22m[39m                                                   [2m  2.55 kB[22m [2m│ gzip:  1.03 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/analyze.d.mts[22m[39m                          [2m  2.52 kB[22m [2m│ gzip:  0.95 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mseo/index.d.mts[22m[39m                                                          [2m  2.45 kB[22m [2m│ gzip:  1.01 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/rewrite-url-helpers.d.mts[22m[39m              [2m  2.14 kB[22m [2m│ gzip:  0.89 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mdatabase/instrumentation.d.mts[22m[39m                                           [2m  2.00 kB[22m [2m│ gzip:  0.95 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mstorage/s3.d.mts[22m[39m                                                         [2m  1.61 kB[22m [2m│ gzip:  0.75 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mmedia/index.d.mts[22m[39m                                                        [2m  1.52 kB[22m [2m│ gzip:  0.63 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mstorage/local.d.mts[22m[39m                                                      [2m  1.50 kB[22m [2m│ gzip:  0.70 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mplugins/adapt-sandbox-entry.d.mts[22m[39m                                        [2m  1.37 kB[22m [2m│ gzip:  0.65 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mmedia/local-runtime.d.mts[22m[39m                                                [2m  1.34 kB[22m [2m│ gzip:  0.60 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mruntime.d.mts[22m[39m                                                            [2m  1.10 kB[22m [2m│ gzip:  0.58 kB[22m
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
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/byline-fields/_slug_.d.mts[22m[39m                        [2m  0.32 kB[22m [2m│ gzip:  0.21 kB[22m
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
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/byline-fields/index.d.mts[22m[39m                         [2m  0.27 kB[22m [2m│ gzip:  0.19 kB[22m
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
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/byline-fields/_slug_/usage.d.mts[22m[39m                  [2m  0.24 kB[22m [2m│ gzip:  0.19 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/byline-fields/reorder.d.mts[22m[39m                       [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
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
[34mℹ[39m [2mdist/[22m[32mindex-CXyVSXzH.d.mts[39m                                                     [2m154.91 kB[22m [2m│ gzip: 41.94 kB[22m
[34mℹ[39m [2mdist/[22m[32mbyline-fields-BNy7Ng1U.d.mts[39m                                             [2m 79.04 kB[22m [2m│ gzip:  9.29 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-jbkzJ1j_.d.mts[39m                                                     [2m 40.10 kB[22m [2m│ gzip: 10.71 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-DawhLFwy.d.mts[39m                                                     [2m 12.69 kB[22m [2m│ gzip:  2.85 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-DWnN7weG.d.mts[39m                                                     [2m  9.78 kB[22m [2m│ gzip:  3.24 kB[22m
[34mℹ[39m [2mdist/[22m[32mvalidate-Dy6nkNls.d.mts[39m                                                  [2m  9.46 kB[22m [2m│ gzip:  2.96 kB[22m
[34mℹ[39m [2mdist/[22m[32mplaceholder-B9lUUEmj.d.mts[39m                                               [2m  8.70 kB[22m [2m│ gzip:  2.96 kB[22m
[34mℹ[39m [2mdist/[22m[32mindex-D60_SzHG.d.mts[39m                                                     [2m  7.74 kB[22m [2m│ gzip:  2.83 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-i8_uzhMD.d.mts[39m                                                     [2m  6.54 kB[22m [2m│ gzip:  2.54 kB[22m
[34mℹ[39m [2mdist/[22m[32moptions-tb7DJROi.d.mts[39m                                                   [2m  6.44 kB[22m [2m│ gzip:  2.43 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-Qa7-HJJC.d.mts[39m                                                     [2m  6.19 kB[22m [2m│ gzip:  2.34 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-DbCWhHet.d.mts[39m                                                     [2m  6.03 kB[22m [2m│ gzip:  1.79 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-kwqCOUxj.d.mts[39m                                                     [2m  5.04 kB[22m [2m│ gzip:  1.78 kB[22m
[34mℹ[39m [2mdist/[22m[32madapters-C5AWLJSD.d.mts[39m                                                  [2m  3.21 kB[22m [2m│ gzip:  1.32 kB[22m
[34mℹ[39m [2mdist/[22m[32mtypes-DX6v9KzJ.d.mts[39m                                                     [2m  2.64 kB[22m [2m│ gzip:  1.17 kB[22m
[34mℹ[39m [2mdist/[22m[32mrunner-DM1yR5qd.d.mts[39m                                                    [2m  1.98 kB[22m [2m│ gzip:  0.93 kB[22m
[34mℹ[39m [2mdist/[22m[32mtransport-OnMNbsIA.d.mts[39m                                                 [2m  1.67 kB[22m [2m│ gzip:  0.76 kB[22m
[34mℹ[39m 1019 files, total: 7274.49 kB
[33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugins. Here is a breakdown:
  - rolldown-plugin-dts:generate (55%)
  - rolldown-plugin-dts:resolver (33%)
See https://rolldown.rs/options/checks#plugintimings for more details.

[32m✔[39m Build complete in [32m6135ms[39m
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
[32m✔[39m Build complete in [32m654ms[39m
$ pnpm build
==> pnpm-build-workspace
$ pnpm run --filter {./packages/**} build
Scope: 33 of 62 workspace projects
packages/auth build$ tsdown
packages/blocks build$ tsdown
packages/contentful-to-portable-text build$ tsdown src/index.ts --format esm --dts --clean
packages/create-emdash build$ tsdown
packages/auth build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/blocks build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/contentful-to-portable-text build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/contentful-to-portable-text build: [34mℹ[39m entry: [34msrc/index.ts[39m
packages/contentful-to-portable-text build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/contentful-to-portable-text build: [34mℹ[39m Build start
packages/contentful-to-portable-text build: [34mℹ[39m Cleaning 4 files
packages/create-emdash build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/auth build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/auth/tsdown.config.ts[24m
packages/auth build: [34mℹ[39m entry: [34msrc/index.ts, src/passkey/index.ts, src/adapters/kysely.ts, src/oauth/providers/github.ts, src/oauth/providers/google.ts[39m
packages/auth build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/auth build: [34mℹ[39m Build start
packages/auth build: [34mℹ[39m Cleaning 32 files
packages/blocks build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/blocks/tsdown.config.ts[24m
packages/blocks build: [34mℹ[39m entry: [34msrc/index.ts, src/server.ts[39m
packages/blocks build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/blocks build: [34mℹ[39m Build start
packages/blocks build: [34mℹ[39m Cleaning 10 files
packages/create-emdash build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/create-emdash/tsdown.config.ts[24m
packages/create-emdash build: [34mℹ[39m entry: [34msrc/index.ts[39m
packages/create-emdash build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/create-emdash build: [34mℹ[39m Build start
packages/create-emdash build: [34mℹ[39m Cleaning 3 files
packages/contentful-to-portable-text build: [34mℹ[39m [2mdist/[22m[1mindex.mjs[22m        [2m15.95 kB[22m [2m│ gzip: 4.30 kB[22m
packages/contentful-to-portable-text build: [34mℹ[39m [2mdist/[22mindex.mjs.map    [2m39.25 kB[22m [2m│ gzip: 9.30 kB[22m
packages/contentful-to-portable-text build: [34mℹ[39m [2mdist/[22mindex.d.mts.map  [2m 0.66 kB[22m [2m│ gzip: 0.33 kB[22m
packages/contentful-to-portable-text build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.mts[22m[39m      [2m 2.15 kB[22m [2m│ gzip: 0.88 kB[22m
packages/contentful-to-portable-text build: [34mℹ[39m 4 files, total: 58.01 kB
packages/contentful-to-portable-text build: [32m✔[39m Build complete in [32m603ms[39m
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
packages/create-emdash build: [32m✔[39m Build complete in [32m759ms[39m
packages/create-emdash build: Done
packages/plugin-types build$ tsdown
packages/plugin-types build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/plugin-types build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugin-types/tsdown.config.ts[24m
packages/plugin-types build: [34mℹ[39m entry: [34msrc/index.ts[39m
packages/plugin-types build: [34mℹ[39m target: [34mes2023[39m
packages/plugin-types build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugin-types build: [34mℹ[39m Build start
packages/plugin-types build: [34mℹ[39m Cleaning 4 files
packages/gutenberg-to-portable-text build: [34mℹ[39m [2mdist/[22m[1mindex.mjs[22m           [2m43.04 kB[22m [2m│ gzip:  9.98 kB[22m
packages/gutenberg-to-portable-text build: [34mℹ[39m [2mdist/[22mindex.mjs.map       [2m92.72 kB[22m [2m│ gzip: 20.21 kB[22m
packages/gutenberg-to-portable-text build: [34mℹ[39m [2mdist/[22mindex.d.mts.map     [2m 3.63 kB[22m [2m│ gzip:  1.02 kB[22m
packages/gutenberg-to-portable-text build: [34mℹ[39m [2mdist/[22mchunk-DQk6qfdC.mjs  [2m 0.38 kB[22m [2m│ gzip:  0.26 kB[22m
packages/gutenberg-to-portable-text build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.mts[22m[39m         [2m11.56 kB[22m [2m│ gzip:  2.98 kB[22m
packages/gutenberg-to-portable-text build: [34mℹ[39m 5 files, total: 151.34 kB
packages/gutenberg-to-portable-text build: [32m✔[39m Build complete in [32m601ms[39m
packages/plugin-types build: [34mℹ[39m [2mdist/[22m[1mindex.js[22m        [2m 4.31 kB[22m [2m│ gzip: 1.96 kB[22m
packages/plugin-types build: [34mℹ[39m [2mdist/[22mindex.js.map    [2m13.45 kB[22m [2m│ gzip: 4.90 kB[22m
packages/plugin-types build: [34mℹ[39m [2mdist/[22mindex.d.ts.map  [2m 1.23 kB[22m [2m│ gzip: 0.56 kB[22m
packages/plugin-types build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.ts[22m[39m      [2m10.06 kB[22m [2m│ gzip: 3.84 kB[22m
packages/plugin-types build: [34mℹ[39m 4 files, total: 29.04 kB
packages/plugin-types build: [32m✔[39m Build complete in [32m391ms[39m
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
packages/registry-lexicons build$ pnpm run build:lexicons && pnpm run build:types
packages/auth build: [32m✔[39m Build complete in [32m1372ms[39m
packages/plugin-types build: Done
packages/x402 build$ tsdown
packages/auth build: Done
packages/x402 build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/x402 build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/x402/tsdown.config.ts[24m
packages/x402 build: [34mℹ[39m entry: [34msrc/index.ts, src/middleware.ts[39m
packages/x402 build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/x402 build: [34mℹ[39m Build start
packages/x402 build: [34mℹ[39m Cleaning 10 files
packages/registry-lexicons build: $ node scripts/copy-lexicons.mjs
packages/registry-lexicons build: using in-package lexicon copy at /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-lexicons/lexicons/com/emdashcms/experimental (no source at /home/data/dev_react/awcms-micro/awcmsmicro-dev/lexicons/com/emdashcms/experimental)
packages/blocks build: [34mℹ[39m [2mdist/[22m[1mindex.js[22m                      [2m31.73 kB[22m [2m│ gzip:  7.17 kB[22m
packages/blocks build: [34mℹ[39m [2mdist/[22m[1mserver.js[22m                     [2m 0.14 kB[22m [2m│ gzip:  0.11 kB[22m
packages/blocks build: [34mℹ[39m [2mdist/[22mvalidation-Dq-a7CXm.js.map    [2m79.81 kB[22m [2m│ gzip: 10.78 kB[22m
packages/blocks build: [34mℹ[39m [2mdist/[22mindex.js.map                  [2m61.72 kB[22m [2m│ gzip: 13.83 kB[22m
packages/blocks build: [34mℹ[39m [2mdist/[22mvalidation-Dq-a7CXm.js        [2m39.60 kB[22m [2m│ gzip:  5.81 kB[22m
packages/blocks build: [34mℹ[39m [2mdist/[22mvalidation-5vL6669b.d.ts.map  [2m 7.29 kB[22m [2m│ gzip:  1.42 kB[22m
packages/blocks build: [34mℹ[39m [2mdist/[22mindex.d.ts.map                [2m 0.50 kB[22m [2m│ gzip:  0.28 kB[22m
packages/blocks build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.ts[22m[39m                    [2m 2.83 kB[22m [2m│ gzip:  1.01 kB[22m
packages/blocks build: [34mℹ[39m [2mdist/[22m[32m[1mserver.d.ts[22m[39m                   [2m 1.22 kB[22m [2m│ gzip:  0.45 kB[22m
packages/blocks build: [34mℹ[39m [2mdist/[22m[32mvalidation-5vL6669b.d.ts[39m      [2m15.63 kB[22m [2m│ gzip:  3.89 kB[22m
packages/blocks build: [34mℹ[39m 10 files, total: 240.44 kB
packages/blocks build: [32m✔[39m Build complete in [32m1866ms[39m
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
packages/x402 build: [32m✔[39m Build complete in [32m1179ms[39m
packages/x402 build: Done
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
packages/registry-lexicons build: [32m✔[39m Build complete in [32m728ms[39m
packages/registry-lexicons build: Done
packages/blocks/playground build$ vite build
packages/registry-client build$ tsdown
packages/registry-client build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/registry-client build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-client/tsdown.config.ts[24m
packages/registry-client build: [34mℹ[39m entry: [34msrc/index.ts, src/credentials/index.ts, src/discovery/index.ts, src/env/index.ts, src/publishing/index.ts[39m
packages/registry-client build: [34mℹ[39m target: [34mnode22[39m
packages/registry-client build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/registry-client build: [34mℹ[39m Build start
packages/registry-client build: [34mℹ[39m Cleaning 30 files
packages/blocks/playground build: vite v6.4.3 building for production...
packages/blocks/playground build: transforming...
packages/registry-client build: [34mℹ[39m [2mdist/[22m[1mdiscovery/index.js[22m          [2m 6.51 kB[22m [2m│ gzip:  2.58 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[1menv/index.js[22m                [2m 5.11 kB[22m [2m│ gzip:  2.05 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[1mpublishing/index.js[22m         [2m 5.04 kB[22m [2m│ gzip:  1.73 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[1mcredentials/index.js[22m        [2m 1.65 kB[22m [2m│ gzip:  0.73 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[1mindex.js[22m                    [2m 0.88 kB[22m [2m│ gzip:  0.32 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mvalid-CMFHzT1o.js.map       [2m66.95 kB[22m [2m│ gzip: 16.20 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mvalid-CMFHzT1o.js           [2m34.01 kB[22m [2m│ gzip:  7.36 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mmemory-CIuLotqL.js.map      [2m25.98 kB[22m [2m│ gzip:  8.65 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mpublishing/index.js.map     [2m14.70 kB[22m [2m│ gzip:  4.44 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mdiscovery/index.js.map      [2m11.96 kB[22m [2m│ gzip:  4.19 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mmemory-CIuLotqL.js          [2m11.32 kB[22m [2m│ gzip:  4.14 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22menv/index.js.map            [2m 8.42 kB[22m [2m│ gzip:  3.12 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mcredentials/index.js.map    [2m 2.23 kB[22m [2m│ gzip:  0.95 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mpublishing/index.d.ts.map   [2m 1.59 kB[22m [2m│ gzip:  0.56 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mmemory-Ci3gbSC-.d.ts.map    [2m 1.12 kB[22m [2m│ gzip:  0.37 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mdiscovery/index.d.ts.map    [2m 1.02 kB[22m [2m│ gzip:  0.42 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22menv/index.d.ts.map          [2m 0.61 kB[22m [2m│ gzip:  0.34 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mtypes-DNGNVV4Q.d.ts.map     [2m 0.58 kB[22m [2m│ gzip:  0.30 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22mcredentials/index.d.ts.map  [2m 0.16 kB[22m [2m│ gzip:  0.14 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[32m[1mdiscovery/index.d.ts[22m[39m        [2m 6.11 kB[22m [2m│ gzip:  2.40 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[32m[1mpublishing/index.d.ts[22m[39m       [2m 5.79 kB[22m [2m│ gzip:  2.03 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[32m[1menv/index.d.ts[22m[39m              [2m 5.03 kB[22m [2m│ gzip:  1.99 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.ts[22m[39m                  [2m 1.32 kB[22m [2m│ gzip:  0.43 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[32m[1mcredentials/index.d.ts[22m[39m      [2m 1.13 kB[22m [2m│ gzip:  0.53 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[32mtypes-DNGNVV4Q.d.ts[39m         [2m 3.66 kB[22m [2m│ gzip:  1.65 kB[22m
packages/registry-client build: [34mℹ[39m [2mdist/[22m[32mmemory-Ci3gbSC-.d.ts[39m        [2m 1.94 kB[22m [2m│ gzip:  0.60 kB[22m
packages/registry-client build: [34mℹ[39m 26 files, total: 224.81 kB
packages/registry-client build: [32m✔[39m Build complete in [32m733ms[39m
packages/registry-client build: Done
packages/blocks/playground build: ✓ 5241 modules transformed.
packages/blocks/playground build: rendering chunks...
packages/blocks/playground build: computing gzip size...
packages/blocks/playground build: dist/index.html                     0.40 kB │ gzip:   0.28 kB
packages/blocks/playground build: dist/assets/index-J7vdwgIc.css    138.44 kB │ gzip:  22.18 kB
packages/blocks/playground build: dist/assets/index-B5Q0pG0V.js   1,240.53 kB │ gzip: 398.77 kB
packages/blocks/playground build: ✓ built in 5.37s
packages/blocks/playground build: (!) Some chunks are larger than 500 kB after minification. Consider:
packages/blocks/playground build: - Using dynamic import() to code-split the application
packages/blocks/playground build: - Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
packages/blocks/playground build: - Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
packages/blocks/playground build: Done
packages/admin build$ node --run locale:compile && tsdown && node --run locale:copy && npx @tailwindcss/cli -i src/styles.css -o dist/styles.css --minify
packages/plugin-cli build$ node --run gen-schema && tsdown
packages/plugin-cli build: Wrote /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugin-cli/schemas/emdash-plugin.schema.json
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
packages/admin build: Compiling message catalogs…
packages/admin build: Done in 534ms
packages/admin build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/plugin-cli build: [34mℹ[39m Granting execute permission to [4mdist/index.mjs[24m
packages/admin build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tsdown.config.ts[24m
packages/admin build: [34mℹ[39m entry: [34msrc/index.ts, src/locales/index.ts[39m
packages/admin build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/admin build: [34mℹ[39m Build start
packages/admin build: [34mℹ[39m Cleaning 86 files
packages/plugin-cli build: [34mℹ[39m [2mdist/[22m[1mindex.mjs[22m  [2m270.52 kB[22m [2m│ gzip: 83.16 kB[22m
packages/plugin-cli build: [34mℹ[39m 1 files, total: 270.52 kB
packages/plugin-cli build: [32m✔[39m Build complete in [32m1175ms[39m
packages/plugin-cli build: [34mℹ[39m [2mdist/[22m[1mapi.mjs[22m        [2m107.86 kB[22m [2m│ gzip: 33.30 kB[22m
packages/plugin-cli build: [34mℹ[39m [2mdist/[22mapi.mjs.map    [2m225.30 kB[22m [2m│ gzip: 60.60 kB[22m
packages/plugin-cli build: [34mℹ[39m [2mdist/[22mapi.d.mts.map  [2m  3.73 kB[22m [2m│ gzip:  1.30 kB[22m
packages/plugin-cli build: [34mℹ[39m [2mdist/[22m[32m[1mapi.d.mts[22m[39m      [2m 18.09 kB[22m [2m│ gzip:  5.83 kB[22m
packages/plugin-cli build: [34mℹ[39m 4 files, total: 354.98 kB
packages/plugin-cli build: [32m✔[39m Build complete in [32m1190ms[39m
packages/plugin-cli build: Done
packages/admin build: [34mℹ[39m [2mdist/[22m[1mindex.js[22m                                 [2m1278.50 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22m[1mlocales/index.js[22m                         [2m   0.42 kB[22m [2m│ gzip:  0.21 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mindex.js.map                             [2m2041.78 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-DrMj1Hby.js.map                 [2m 153.41 kB[22m [2m│ gzip: 33.03 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-DrMj1Hby.js                     [2m 137.30 kB[22m [2m│ gzip: 32.13 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-CjirHcRw.js.map                 [2m 120.24 kB[22m [2m│ gzip: 32.15 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-DzQ203Bb.js.map                 [2m 116.16 kB[22m [2m│ gzip: 32.48 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-Du-_Uh8B.js.map                 [2m 111.33 kB[22m [2m│ gzip: 32.48 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-CjirHcRw.js                     [2m 104.24 kB[22m [2m│ gzip: 30.93 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-BKmEGNNr.js.map                 [2m 104.09 kB[22m [2m│ gzip: 31.67 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-BunNlQic.js.map                 [2m 103.51 kB[22m [2m│ gzip: 31.87 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-rxZmXkNz.js.map                 [2m 100.01 kB[22m [2m│ gzip: 31.24 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-DzQ203Bb.js                     [2m  99.81 kB[22m [2m│ gzip: 31.41 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-BPzwf13U.js.map                 [2m  98.31 kB[22m [2m│ gzip: 31.49 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-DM8WFh_S.js.map                 [2m  98.16 kB[22m [2m│ gzip: 30.83 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-BLyCd3bH.js.map                 [2m  96.01 kB[22m [2m│ gzip: 31.16 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-Du-_Uh8B.js                     [2m  95.47 kB[22m [2m│ gzip: 31.42 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-ClrLd7GR.js.map                 [2m  94.86 kB[22m [2m│ gzip: 31.52 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-C4ONkHEI.js.map                 [2m  94.17 kB[22m [2m│ gzip: 30.58 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-CkDIrR_T.js.map                 [2m  93.23 kB[22m [2m│ gzip: 29.29 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-amIeQ8HY.js.map                 [2m  89.19 kB[22m [2m│ gzip: 28.32 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-ngvpRuG5.js.map                 [2m  88.92 kB[22m [2m│ gzip: 29.09 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-C3wS1VMq.js.map                 [2m  88.45 kB[22m [2m│ gzip: 28.33 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-BKmEGNNr.js                     [2m  88.14 kB[22m [2m│ gzip: 30.27 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-DW5uspYc.js.map                 [2m  87.63 kB[22m [2m│ gzip: 30.96 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-BunNlQic.js                     [2m  87.55 kB[22m [2m│ gzip: 30.63 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-C55KydOS.js.map                 [2m  87.33 kB[22m [2m│ gzip: 30.00 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-rxZmXkNz.js                     [2m  84.03 kB[22m [2m│ gzip: 29.89 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-BPzwf13U.js                     [2m  82.28 kB[22m [2m│ gzip: 30.31 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-DM8WFh_S.js                     [2m  82.21 kB[22m [2m│ gzip: 29.47 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-BLyCd3bH.js                     [2m  80.00 kB[22m [2m│ gzip: 29.84 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-ClrLd7GR.js                     [2m  78.60 kB[22m [2m│ gzip: 30.17 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-C4ONkHEI.js                     [2m  78.17 kB[22m [2m│ gzip: 29.27 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-CkDIrR_T.js                     [2m  77.37 kB[22m [2m│ gzip: 27.97 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-amIeQ8HY.js                     [2m  73.67 kB[22m [2m│ gzip: 27.06 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-ngvpRuG5.js                     [2m  72.92 kB[22m [2m│ gzip: 27.80 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-C3wS1VMq.js                     [2m  72.45 kB[22m [2m│ gzip: 27.04 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-DW5uspYc.js                     [2m  71.62 kB[22m [2m│ gzip: 29.73 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mmessages-C55KydOS.js                     [2m  71.30 kB[22m [2m│ gzip: 28.76 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mindex.d.ts.map                           [2m  35.20 kB[22m [2m│ gzip:  7.98 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mLocaleDirectionProvider-LB7Qjnv1.js.map  [2m  15.21 kB[22m [2m│ gzip:  5.27 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mplugins-BZzztFdK.js.map                  [2m  11.23 kB[22m [2m│ gzip:  3.78 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mLocaleDirectionProvider-LB7Qjnv1.js      [2m   9.18 kB[22m [2m│ gzip:  3.22 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mplugins-BZzztFdK.js                      [2m   3.95 kB[22m [2m│ gzip:  1.50 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22mconfig-76UcBWeH.d.ts.map                 [2m   0.70 kB[22m [2m│ gzip:  0.38 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.ts[22m[39m                               [2m 128.88 kB[22m [2m│ gzip: 24.66 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22m[32m[1mlocales/index.d.ts[22m[39m                       [2m   0.47 kB[22m [2m│ gzip:  0.24 kB[22m
packages/admin build: [34mℹ[39m [2mdist/[22m[32mconfig-76UcBWeH.d.ts[39m                     [2m   2.97 kB[22m [2m│ gzip:  1.25 kB[22m
packages/admin build: [34mℹ[39m 48 files, total: 6890.60 kB
packages/admin build: [32m✔[39m Build complete in [32m4873ms[39m
packages/admin build: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugins. Here is a breakdown:
packages/admin build:   - rolldown-plugin-dts:generate (58%)
packages/admin build:   - tsdown:external (29%)
packages/admin build: See https://rolldown.rs/options/checks#plugintimings for more details.
packages/admin build: ≈ tailwindcss v4.3.0
packages/admin build: Done in 311ms
packages/admin build: Done
packages/core build$ tsdown
packages/core build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/core build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/core/tsdown.config.ts[24m
packages/core build: [34mℹ[39m entry: [34msrc/index.ts, src/request-context.ts, src/astro/index.ts, src/astro/middleware.ts, src/astro/middleware/setup.ts, src/astro/middleware/auth.ts, src/astro/middleware/redirect.ts, src/astro/middleware/request-context.ts, src/astro/types.ts, src/db/index.ts, src/db/sqlite.ts, src/db/libsql.ts, src/db/postgres.ts, src/database/instrumentation.ts, src/storage/local.ts, src/storage/s3.ts, src/media/index.ts, src/media/local-runtime.ts, src/runtime.ts, src/seed/index.ts, src/cli/index.ts, src/client/index.ts, src/client/cf-access.ts, src/seo/index.ts, src/page/index.ts, src/plugin-utils.ts, src/plugin-types.ts, src/plugins/adapt-sandbox-entry.ts, src/api/route-utils.ts, src/api/schemas/index.ts, src/auth/providers/github.ts, src/auth/providers/google.ts[39m
packages/core build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/core build: [34mℹ[39m Build start
packages/core build: [34mℹ[39m Cleaning 1114 files
packages/core build: [34mℹ[39m Granting execute permission to [4mdist/cli/index.mjs[24m
packages/core build: [34mℹ[39m [2mdist/[22m[1mcli/index.mjs[22m                                                            [2m146.68 kB[22m [2m│ gzip: 37.08 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/middleware.mjs[22m                                                     [2m 96.59 kB[22m [2m│ gzip: 25.00 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/openapi.json.mjs[22m                                        [2m 90.41 kB[22m [2m│ gzip: 14.40 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/mcp.mjs[22m                                                 [2m 68.08 kB[22m [2m│ gzip: 15.09 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/index.mjs[22m                                                          [2m 64.43 kB[22m [2m│ gzip: 14.99 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/middleware/request-context.mjs[22m                                     [2m 41.28 kB[22m [2m│ gzip: 10.35 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/execute.mjs[22m                            [2m 26.48 kB[22m [2m│ gzip:  8.21 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/middleware/auth.mjs[22m                                                [2m 21.78 kB[22m [2m│ gzip:  6.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mpage/index.mjs[22m                                                           [2m 13.75 kB[22m [2m│ gzip:  4.05 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mclient/index.mjs[22m                                                         [2m 13.03 kB[22m [2m│ gzip:  3.53 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/registry/artifact.mjs[22m                     [2m 12.64 kB[22m [2m│ gzip:  4.54 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/authorize.mjs[22m                                     [2m 11.85 kB[22m [2m│ gzip:  3.50 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/analyze.mjs[22m                            [2m  9.96 kB[22m [2m│ gzip:  3.36 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/snapshot.mjs[22m                                            [2m  9.29 kB[22m [2m│ gzip:  3.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mindex.mjs[22m                                                                [2m  8.49 kB[22m [2m│ gzip:  2.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/comments/_collection_/_contentId_/index.mjs[22m             [2m  8.32 kB[22m [2m│ gzip:  2.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mapi/schemas/index.mjs[22m                                                    [2m  8.31 kB[22m [2m│ gzip:  1.95 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress-plugin/execute.mjs[22m                     [2m  8.17 kB[22m [2m│ gzip:  2.75 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mstorage/s3.mjs[22m                                                           [2m  7.78 kB[22m [2m│ gzip:  2.79 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/media.mjs[22m                              [2m  6.56 kB[22m [2m│ gzip:  2.13 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mplugins/adapt-sandbox-entry.mjs[22m                                          [2m  5.88 kB[22m [2m│ gzip:  2.21 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/media.mjs[22m                                               [2m  5.75 kB[22m [2m│ gzip:  2.13 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/oauth/_provider_/callback.mjs[22m                      [2m  5.73 kB[22m [2m│ gzip:  2.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mclient/cf-access.mjs[22m                                                     [2m  5.69 kB[22m [2m│ gzip:  2.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mstorage/local.mjs[22m                                                        [2m  5.56 kB[22m [2m│ gzip:  2.04 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/rewrite-urls.mjs[22m                       [2m  5.56 kB[22m [2m│ gzip:  1.82 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_.mjs[22m                           [2m  5.12 kB[22m [2m│ gzip:  1.46 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/dev-bypass.mjs[22m                                    [2m  5.05 kB[22m [2m│ gzip:  2.00 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/token.mjs[22m                                         [2m  4.98 kB[22m [2m│ gzip:  1.69 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/sitemap-_collection_.xml.mjs[22m                                [2m  4.90 kB[22m [2m│ gzip:  1.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/rewrite-url-helpers.mjs[22m                [2m  4.64 kB[22m [2m│ gzip:  1.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs[22m          [2m  4.57 kB[22m [2m│ gzip:  1.49 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/register.mjs[22m                                      [2m  4.42 kB[22m [2m│ gzip:  1.65 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/registry/install.mjs[22m                      [2m  4.40 kB[22m [2m│ gzip:  1.73 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/_id_/index.mjs[22m                              [2m  4.37 kB[22m [2m│ gzip:  1.46 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress/prepare.mjs[22m                            [2m  4.34 kB[22m [2m│ gzip:  1.62 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/settings/email.mjs[22m                                      [2m  4.32 kB[22m [2m│ gzip:  1.72 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/registry/_id_/update.mjs[22m                  [2m  4.27 kB[22m [2m│ gzip:  1.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/_slug_/index.mjs[22m                     [2m  3.81 kB[22m [2m│ gzip:  1.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/index.mjs[22m                                         [2m  3.76 kB[22m [2m│ gzip:  1.42 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mmedia/local-runtime.mjs[22m                                                  [2m  3.75 kB[22m [2m│ gzip:  1.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs[22m        [2m  3.72 kB[22m [2m│ gzip:  1.04 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/admin-verify.mjs[22m                                  [2m  3.69 kB[22m [2m│ gzip:  1.40 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/_name_/widgets/_id_.mjs[22m                    [2m  3.65 kB[22m [2m│ gzip:  1.11 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/marketplace/_id_/install.mjs[22m              [2m  3.58 kB[22m [2m│ gzip:  1.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/upload-url.mjs[22m                                    [2m  3.54 kB[22m [2m│ gzip:  1.47 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/register/verify.mjs[22m                        [2m  3.52 kB[22m [2m│ gzip:  1.35 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/_id_/status.mjs[22m                          [2m  3.49 kB[22m [2m│ gzip:  1.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/taxonomies/_name_/terms/_slug_/translations.mjs[22m         [2m  3.48 kB[22m [2m│ gzip:  1.12 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/_id_.mjs[22m                                          [2m  3.43 kB[22m [2m│ gzip:  1.04 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/taxonomies/_name_/terms/_slug_.mjs[22m                      [2m  3.42 kB[22m [2m│ gzip:  0.96 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/update.mjs[22m                           [2m  3.30 kB[22m [2m│ gzip:  1.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/schedule.mjs[22m                  [2m  3.20 kB[22m [2m│ gzip:  1.01 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/preview-url.mjs[22m               [2m  3.19 kB[22m [2m│ gzip:  1.32 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/_slug_/fields/index.mjs[22m              [2m  3.19 kB[22m [2m│ gzip:  1.00 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/providers/_providerId_/index.mjs[22m                  [2m  3.15 kB[22m [2m│ gzip:  1.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/updates.mjs[22m                               [2m  3.15 kB[22m [2m│ gzip:  1.13 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/bylines/index.mjs[22m                                 [2m  3.11 kB[22m [2m│ gzip:  1.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/bylines/_id_/index.mjs[22m                            [2m  3.10 kB[22m [2m│ gzip:  1.07 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/registry/_id_/uninstall.mjs[22m               [2m  3.10 kB[22m [2m│ gzip:  1.10 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/plugins/_pluginId_/_...path_.mjs[22m                        [2m  3.09 kB[22m [2m│ gzip:  1.37 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/middleware/redirect.mjs[22m                                            [2m  3.08 kB[22m [2m│ gzip:  1.30 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/admin.mjs[22m                                         [2m  3.07 kB[22m [2m│ gzip:  1.25 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/index.mjs[22m                          [2m  3.03 kB[22m [2m│ gzip:  1.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/oauth/_provider_.mjs[22m                               [2m  3.00 kB[22m [2m│ gzip:  1.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/oauth-clients/_id_.mjs[22m                            [2m  3.00 kB[22m [2m│ gzip:  0.97 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/themes/marketplace/index.mjs[22m                      [2m  2.99 kB[22m [2m│ gzip:  1.12 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/uninstall.mjs[22m                        [2m  2.99 kB[22m [2m│ gzip:  1.10 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/bylines/_id_/translations.mjs[22m                     [2m  2.98 kB[22m [2m│ gzip:  1.13 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/enable.mjs[22m                           [2m  2.97 kB[22m [2m│ gzip:  1.08 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/index.mjs[22m                            [2m  2.92 kB[22m [2m│ gzip:  0.99 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/allowed-domains/_domain_.mjs[22m                      [2m  2.86 kB[22m [2m│ gzip:  0.99 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/collections/_slug_/fields/reorder.mjs[22m            [2m  2.83 kB[22m [2m│ gzip:  0.96 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/publish.mjs[22m                   [2m  2.81 kB[22m [2m│ gzip:  1.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/marketplace/index.mjs[22m                     [2m  2.80 kB[22m [2m│ gzip:  1.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/redirects/_id_.mjs[22m                                      [2m  2.80 kB[22m [2m│ gzip:  0.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/disable.mjs[22m                          [2m  2.80 kB[22m [2m│ gzip:  1.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/_id_.mjs[22m                                   [2m  2.78 kB[22m [2m│ gzip:  0.98 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/signup/complete.mjs[22m                                [2m  2.78 kB[22m [2m│ gzip:  1.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/allowed-domains/index.mjs[22m                         [2m  2.77 kB[22m [2m│ gzip:  1.05 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/invite/complete.mjs[22m                                [2m  2.75 kB[22m [2m│ gzip:  1.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/dev-bypass.mjs[22m                                     [2m  2.72 kB[22m [2m│ gzip:  1.27 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress-plugin/analyze.mjs[22m                     [2m  2.71 kB[22m [2m│ gzip:  1.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/orphans/_slug_.mjs[22m                               [2m  2.69 kB[22m [2m│ gzip:  1.00 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/marketplace/_id_/index.mjs[22m                [2m  2.67 kB[22m [2m│ gzip:  0.95 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_/translations.mjs[22m                           [2m  2.66 kB[22m [2m│ gzip:  0.94 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/typegen.mjs[22m                                             [2m  2.66 kB[22m [2m│ gzip:  1.06 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/themes/marketplace/_id_/index.mjs[22m                 [2m  2.65 kB[22m [2m│ gzip:  0.95 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mseo/index.mjs[22m                                                            [2m  2.65 kB[22m [2m│ gzip:  1.04 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mplugin-utils.mjs[22m                                                         [2m  2.63 kB[22m [2m│ gzip:  1.21 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/options.mjs[22m                                [2m  2.60 kB[22m [2m│ gzip:  1.07 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/register/options.mjs[22m                       [2m  2.58 kB[22m [2m│ gzip:  1.07 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/sections/_slug_.mjs[22m                                     [2m  2.58 kB[22m [2m│ gzip:  0.79 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/_id_/index.mjs[22m                            [2m  2.56 kB[22m [2m│ gzip:  0.96 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/index.mjs[22m                                        [2m  2.54 kB[22m [2m│ gzip:  1.11 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/index.mjs[22m                                  [2m  2.53 kB[22m [2m│ gzip:  1.01 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/taxonomies/_name_/terms/index.mjs[22m                       [2m  2.52 kB[22m [2m│ gzip:  0.90 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mdatabase/instrumentation.mjs[22m                                             [2m  2.51 kB[22m [2m│ gzip:  1.22 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/redirects/404s/index.mjs[22m                                [2m  2.48 kB[22m [2m│ gzip:  0.81 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/verify.mjs[22m                                 [2m  2.47 kB[22m [2m│ gzip:  1.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/_id_/confirm.mjs[22m                                  [2m  2.44 kB[22m [2m│ gzip:  1.08 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_.mjs[22m                                        [2m  2.41 kB[22m [2m│ gzip:  0.75 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/magic-link/send.mjs[22m                                [2m  2.41 kB[22m [2m│ gzip:  0.98 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/sitemap.xml.mjs[22m                                             [2m  2.40 kB[22m [2m│ gzip:  1.10 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/status.mjs[22m                                        [2m  2.39 kB[22m [2m│ gzip:  1.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/byline-fields/_slug_.mjs[22m                          [2m  2.37 kB[22m [2m│ gzip:  0.75 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/hooks/exclusive/_hookName_.mjs[22m                    [2m  2.36 kB[22m [2m│ gzip:  1.04 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/providers/_providerId_/_itemId_.mjs[22m               [2m  2.36 kB[22m [2m│ gzip:  0.78 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/_name_/widgets.mjs[22m                         [2m  2.36 kB[22m [2m│ gzip:  1.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/index.mjs[22m                                 [2m  2.33 kB[22m [2m│ gzip:  0.90 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/invite/index.mjs[22m                                   [2m  2.32 kB[22m [2m│ gzip:  1.07 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/invite/register-options.mjs[22m                        [2m  2.31 kB[22m [2m│ gzip:  1.01 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/settings.mjs[22m                                            [2m  2.28 kB[22m [2m│ gzip:  0.92 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/schema/orphans/index.mjs[22m                                [2m  2.28 kB[22m [2m│ gzip:  0.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/signup/request.mjs[22m                                 [2m  2.27 kB[22m [2m│ gzip:  0.99 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_/items/_id_.mjs[22m                             [2m  2.24 kB[22m [2m│ gzip:  0.78 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/taxonomies/index.mjs[22m                                    [2m  2.23 kB[22m [2m│ gzip:  0.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/oauth-clients/index.mjs[22m                           [2m  2.20 kB[22m [2m│ gzip:  0.91 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/themes/preview.mjs[22m                                      [2m  2.15 kB[22m [2m│ gzip:  0.98 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/rebuild.mjs[22m                                      [2m  2.15 kB[22m [2m│ gzip:  0.93 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/_name_.mjs[22m                                 [2m  2.15 kB[22m [2m│ gzip:  0.79 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/api-tokens/index.mjs[22m                              [2m  2.13 kB[22m [2m│ gzip:  0.93 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/redirects/index.mjs[22m                                     [2m  2.13 kB[22m [2m│ gzip:  0.79 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/_id_/send-recovery.mjs[22m                      [2m  2.03 kB[22m [2m│ gzip:  0.96 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/device/token.mjs[22m                                  [2m  2.01 kB[22m [2m│ gzip:  0.94 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/index.mjs[22m                                        [2m  2.01 kB[22m [2m│ gzip:  0.95 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/index.mjs[22m                                   [2m  2.00 kB[22m [2m│ gzip:  0.95 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/enable.mjs[22m                                       [2m  1.98 kB[22m [2m│ gzip:  0.87 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/_id_/disable.mjs[22m                            [2m  1.96 kB[22m [2m│ gzip:  0.90 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/sections/index.mjs[22m                                      [2m  1.93 kB[22m [2m│ gzip:  0.74 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/widget-areas/_name_/reorder.mjs[22m                         [2m  1.93 kB[22m [2m│ gzip:  0.87 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/robots.txt.mjs[22m                                              [2m  1.88 kB[22m [2m│ gzip:  0.85 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/middleware/setup.mjs[22m                                               [2m  1.86 kB[22m [2m│ gzip:  0.86 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/media/file/_...key_.mjs[22m                                 [2m  1.84 kB[22m [2m│ gzip:  0.95 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/duplicate.mjs[22m                 [2m  1.81 kB[22m [2m│ gzip:  0.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/device/code.mjs[22m                                   [2m  1.80 kB[22m [2m│ gzip:  0.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/me.mjs[22m                                             [2m  1.77 kB[22m [2m│ gzip:  0.85 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mrequest-context.mjs[22m                                                      [2m  1.76 kB[22m [2m│ gzip:  0.90 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mapi/route-utils.mjs[22m                                                      [2m  1.76 kB[22m [2m│ gzip:  0.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/byline-fields/index.mjs[22m                           [2m  1.73 kB[22m [2m│ gzip:  0.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/restore.mjs[22m                   [2m  1.72 kB[22m [2m│ gzip:  0.74 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/discard-draft.mjs[22m             [2m  1.71 kB[22m [2m│ gzip:  0.73 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/_id_.mjs[22m                                 [2m  1.70 kB[22m [2m│ gzip:  0.66 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/unpublish.mjs[22m                 [2m  1.70 kB[22m [2m│ gzip:  0.73 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/suggest.mjs[22m                                      [2m  1.68 kB[22m [2m│ gzip:  0.83 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/index.mjs[22m                                         [2m  1.66 kB[22m [2m│ gzip:  0.68 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/magic-link/verify.mjs[22m                              [2m  1.65 kB[22m [2m│ gzip:  0.72 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/revisions/_revisionId_/restore.mjs[22m                      [2m  1.64 kB[22m [2m│ gzip:  0.70 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/translations.mjs[22m              [2m  1.58 kB[22m [2m│ gzip:  0.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs[22m             [2m  1.56 kB[22m [2m│ gzip:  0.76 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/manifest.mjs[22m                                            [2m  1.56 kB[22m [2m│ gzip:  0.80 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/plugins/marketplace/_id_/icon.mjs[22m                 [2m  1.54 kB[22m [2m│ gzip:  0.74 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/index.mjs[22m                                [2m  1.48 kB[22m [2m│ gzip:  0.69 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/bulk.mjs[22m                                 [2m  1.48 kB[22m [2m│ gzip:  0.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/redirects/404s/summary.mjs[22m                              [2m  1.46 kB[22m [2m│ gzip:  0.66 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/hooks/exclusive/index.mjs[22m                         [2m  1.45 kB[22m [2m│ gzip:  0.72 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_/reorder.mjs[22m                                [2m  1.44 kB[22m [2m│ gzip:  0.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/menus/_name_/items.mjs[22m                                  [2m  1.43 kB[22m [2m│ gzip:  0.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/probe.mjs[22m                                        [2m  1.38 kB[22m [2m│ gzip:  0.66 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/well-known/auth.mjs[22m                                     [2m  1.37 kB[22m [2m│ gzip:  0.66 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/device/authorize.mjs[22m                              [2m  1.34 kB[22m [2m│ gzip:  0.69 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/signup/verify.mjs[22m                                  [2m  1.32 kB[22m [2m│ gzip:  0.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mruntime.mjs[22m                                                              [2m  1.32 kB[22m [2m│ gzip:  0.64 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/invite/accept.mjs[22m                                  [2m  1.28 kB[22m [2m│ gzip:  0.68 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/users/_id_/enable.mjs[22m                             [2m  1.28 kB[22m [2m│ gzip:  0.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/byline-fields/reorder.mjs[22m                         [2m  1.24 kB[22m [2m│ gzip:  0.56 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/api-tokens/_id_.mjs[22m                               [2m  1.24 kB[22m [2m│ gzip:  0.66 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mdb/index.mjs[22m                                                             [2m  1.22 kB[22m [2m│ gzip:  0.56 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/token/refresh.mjs[22m                                 [2m  1.19 kB[22m [2m│ gzip:  0.62 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/well-known/oauth-authorization-server.mjs[22m               [2m  1.18 kB[22m [2m│ gzip:  0.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mmedia/index.mjs[22m                                                          [2m  1.18 kB[22m [2m│ gzip:  0.59 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/trash.mjs[22m                          [2m  1.17 kB[22m [2m│ gzip:  0.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/oauth/token/revoke.mjs[22m                                  [2m  1.14 kB[22m [2m│ gzip:  0.60 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/passkey/index.mjs[22m                                  [2m  1.07 kB[22m [2m│ gzip:  0.60 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/revisions.mjs[22m                 [2m  1.04 kB[22m [2m│ gzip:  0.56 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/search/stats.mjs[22m                                        [2m  1.03 kB[22m [2m│ gzip:  0.56 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/content/_collection_/_id_/permanent.mjs[22m                 [2m  1.02 kB[22m [2m│ gzip:  0.53 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/setup/dev-reset.mjs[22m                                     [2m  1.01 kB[22m [2m│ gzip:  0.56 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/byline-fields/_slug_/usage.mjs[22m                    [2m  0.99 kB[22m [2m│ gzip:  0.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/dashboard.mjs[22m                                           [2m  0.99 kB[22m [2m│ gzip:  0.54 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/import/wordpress-plugin/callback.mjs[22m                    [2m  0.97 kB[22m [2m│ gzip:  0.53 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/admin/comments/counts.mjs[22m                               [2m  0.95 kB[22m [2m│ gzip:  0.50 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mastro/routes/api/auth/mode.mjs[22m                                           [2m  0.94 kB[22m [2m│ gzip:  0.56 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[1mseed/index.mjs[22m                                                           [2m  0.92 kB[22m [2m│ gzip:  0.41 kB[22m
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
packages/core build: [34mℹ[39m [2mdist/[22mapi-B7GATEYo.mjs.map                                                     [2m306.40 kB[22m [2m│ gzip: 66.57 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcli/index.mjs.map                                                        [2m291.41 kB[22m [2m│ gzip: 67.35 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrunner-BiuUfx-V.mjs.map                                                  [2m261.25 kB[22m [2m│ gzip: 48.93 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/middleware.mjs.map                                                 [2m214.17 kB[22m [2m│ gzip: 54.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmenus-nmHL66Ks.mjs.map                                                   [2m186.63 kB[22m [2m│ gzip: 41.87 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/openapi.json.mjs.map                                    [2m170.45 kB[22m [2m│ gzip: 23.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mapi-B7GATEYo.mjs                                                         [2m144.89 kB[22m [2m│ gzip: 32.89 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/index.mjs.map                                                      [2m138.48 kB[22m [2m│ gzip: 33.13 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrunner-BiuUfx-V.mjs                                                      [2m137.39 kB[22m [2m│ gzip: 25.75 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/mcp.mjs.map                                             [2m126.65 kB[22m [2m│ gzip: 24.52 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mimport-Dh8bWmyq.mjs.map                                                  [2m112.07 kB[22m [2m│ gzip: 25.69 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mredirects-C0L9JUk4.mjs.map                                               [2m 97.42 kB[22m [2m│ gzip: 16.62 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmenus-nmHL66Ks.mjs                                                       [2m 86.17 kB[22m [2m│ gzip: 19.80 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbyline-CAhk4FrG.mjs.map                                                  [2m 78.05 kB[22m [2m│ gzip: 20.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcontext-Ca0HkaIh.mjs.map                                                 [2m 66.64 kB[22m [2m│ gzip: 15.80 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mapply-BrVqULFe.mjs.map                                                   [2m 65.82 kB[22m [2m│ gzip: 16.76 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcontent-C7aJ7keg.mjs.map                                                 [2m 64.02 kB[22m [2m│ gzip: 13.88 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/execute.mjs.map                        [2m 59.52 kB[22m [2m│ gzip: 17.62 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mregistry-C-T_PWgp.mjs.map                                                [2m 54.83 kB[22m [2m│ gzip: 13.21 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmenus-PFp8FDuO.mjs.map                                                   [2m 50.90 kB[22m [2m│ gzip: 12.05 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mloader-BxyvbrZP.mjs.map                                                  [2m 49.36 kB[22m [2m│ gzip: 13.97 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/middleware/request-context.mjs.map                                 [2m 49.16 kB[22m [2m│ gzip: 12.37 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mquery-Cc649nDl.mjs.map                                                   [2m 49.09 kB[22m [2m│ gzip: 14.83 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mimport-Dh8bWmyq.mjs                                                      [2m 48.70 kB[22m [2m│ gzip: 11.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mredirects-C0L9JUk4.mjs                                                   [2m 47.32 kB[22m [2m│ gzip:  9.55 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/middleware/auth.mjs.map                                            [2m 44.81 kB[22m [2m│ gzip: 12.43 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbyline-CAhk4FrG.mjs                                                      [2m 39.30 kB[22m [2m│ gzip: 10.76 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mindex-BK-J-DhV.d.mts.map                                                 [2m 36.59 kB[22m [2m│ gzip: 10.10 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mvalidate-DWmnRg6E.mjs.map                                                [2m 34.77 kB[22m [2m│ gzip:  7.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtaxonomies-C0bVme_m.mjs.map                                              [2m 34.53 kB[22m [2m│ gzip:  8.01 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbyline-registry-CxK5g559.mjs.map                                         [2m 33.30 kB[22m [2m│ gzip:  9.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mclient/index.mjs.map                                                     [2m 33.25 kB[22m [2m│ gzip:  7.97 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcontent-C7aJ7keg.mjs                                                     [2m 32.67 kB[22m [2m│ gzip:  7.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mredirects-C1UgU9E0.mjs.map                                               [2m 32.59 kB[22m [2m│ gzip:  8.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mapply-BrVqULFe.mjs                                                       [2m 32.53 kB[22m [2m│ gzip:  8.26 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mpage/index.mjs.map                                                       [2m 31.02 kB[22m [2m│ gzip:  8.42 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdevice-flow-ptLrVINd.mjs.map                                             [2m 29.83 kB[22m [2m│ gzip:  7.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcontext-Ca0HkaIh.mjs                                                     [2m 28.49 kB[22m [2m│ gzip:  7.55 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22merror-Bk9s3Ism.mjs.map                                                   [2m 27.57 kB[22m [2m│ gzip:  6.54 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mregistry-C-T_PWgp.mjs                                                    [2m 27.45 kB[22m [2m│ gzip:  6.96 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msearch-BrF7k0Ho.mjs.map                                                  [2m 26.55 kB[22m [2m│ gzip:  8.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mredirect-C-FeA4j9.mjs.map                                                [2m 26.36 kB[22m [2m│ gzip:  6.98 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtransport--Ck3RBin.mjs.map                                               [2m 26.06 kB[22m [2m│ gzip:  7.48 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtaxonomies-CGD6y79Q.mjs.map                                              [2m 25.55 kB[22m [2m│ gzip:  6.21 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msecrets-YYbTgB1w.mjs.map                                                 [2m 24.92 kB[22m [2m│ gzip:  8.49 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mfts-manager-XpDfbIKo.mjs.map                                             [2m 24.82 kB[22m [2m│ gzip:  6.62 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mloader-BxyvbrZP.mjs                                                      [2m 24.07 kB[22m [2m│ gzip:  7.25 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mquery-Cc649nDl.mjs                                                       [2m 23.69 kB[22m [2m│ gzip:  7.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mssrf-BsVGIE0Z.mjs.map                                                    [2m 23.59 kB[22m [2m│ gzip:  8.30 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmenus-PFp8FDuO.mjs                                                       [2m 23.34 kB[22m [2m│ gzip:  5.93 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/authorize.mjs.map                                 [2m 22.43 kB[22m [2m│ gzip:  6.46 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/analyze.mjs.map                        [2m 22.30 kB[22m [2m│ gzip:  6.90 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtaxonomy-Db5xwphL.mjs.map                                                [2m 21.42 kB[22m [2m│ gzip:  5.59 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/artifact.mjs.map                 [2m 20.68 kB[22m [2m│ gzip:  7.13 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcomment-DkAfGX9E.mjs.map                                                 [2m 20.47 kB[22m [2m│ gzip:  4.87 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/snapshot.mjs.map                                        [2m 19.89 kB[22m [2m│ gzip:  6.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msections-8DEa-dWt.mjs.map                                                [2m 19.39 kB[22m [2m│ gzip:  4.78 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbyline-fields-Dr-xcb6S.mjs.map                                           [2m 19.35 kB[22m [2m│ gzip:  4.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mzod-generator-MMm56Prt.mjs.map                                           [2m 18.45 kB[22m [2m│ gzip:  5.43 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbyline-registry-CxK5g559.mjs                                             [2m 18.31 kB[22m [2m│ gzip:  5.90 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moauth-authorization-DvBAL75d.mjs.map                                     [2m 17.99 kB[22m [2m│ gzip:  4.89 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22merror-Bk9s3Ism.mjs                                                       [2m 17.36 kB[22m [2m│ gzip:  4.23 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-jbkzJ1j_.d.mts.map                                                 [2m 16.99 kB[22m [2m│ gzip:  4.66 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mutils-C4Ih4DML.mjs.map                                                   [2m 16.93 kB[22m [2m│ gzip:  5.01 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mvalidate-DWmnRg6E.mjs                                                    [2m 16.79 kB[22m [2m│ gzip:  3.79 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcron-DZovZUnC.mjs.map                                                    [2m 16.65 kB[22m [2m│ gzip:  5.39 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmedia-Cyz5BhSN.mjs.map                                                   [2m 16.58 kB[22m [2m│ gzip:  4.99 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/execute.mjs.map                 [2m 16.41 kB[22m [2m│ gzip:  5.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mredirects-C1UgU9E0.mjs                                                   [2m 16.07 kB[22m [2m│ gzip:  4.26 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbylines-DCczH3AV.mjs.map                                                 [2m 16.00 kB[22m [2m│ gzip:  5.36 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/comments/_collection_/_contentId_/index.mjs.map         [2m 15.95 kB[22m [2m│ gzip:  4.89 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msettings-Jro4YcUb.mjs.map                                                [2m 15.73 kB[22m [2m│ gzip:  5.04 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtaxonomies-C0bVme_m.mjs                                                  [2m 15.58 kB[22m [2m│ gzip:  3.76 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moauth-clients-8mPDStMv.mjs.map                                           [2m 15.58 kB[22m [2m│ gzip:  3.61 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mstorage/s3.mjs.map                                                       [2m 15.38 kB[22m [2m│ gzip:  5.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtaxonomies-CGD6y79Q.mjs                                                  [2m 14.94 kB[22m [2m│ gzip:  3.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdevice-flow-ptLrVINd.mjs                                                 [2m 14.86 kB[22m [2m│ gzip:  3.82 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mplugins/adapt-sandbox-entry.mjs.map                                      [2m 14.73 kB[22m [2m│ gzip:  5.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mservice-9P2cdyR_.mjs.map                                                 [2m 14.62 kB[22m [2m│ gzip:  4.39 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mfts-manager-XpDfbIKo.mjs                                                 [2m 13.79 kB[22m [2m│ gzip:  3.92 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msecrets-YYbTgB1w.mjs                                                     [2m 13.77 kB[22m [2m│ gzip:  5.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcomments-DLFnXs7J.mjs.map                                                [2m 13.34 kB[22m [2m│ gzip:  3.37 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msearch-BrF7k0Ho.mjs                                                      [2m 13.23 kB[22m [2m│ gzip:  4.32 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbylines-CbrD7STW.mjs.map                                                 [2m 13.07 kB[22m [2m│ gzip:  4.32 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-D8bhH891.mjs.map                                                   [2m 12.80 kB[22m [2m│ gzip:  3.79 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mssrf-BsVGIE0Z.mjs                                                        [2m 12.75 kB[22m [2m│ gzip:  5.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/media.mjs.map                          [2m 12.71 kB[22m [2m│ gzip:  3.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmanifest-schema-Cj-YrzrF.mjs.map                                         [2m 12.21 kB[22m [2m│ gzip:  3.36 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mredirect-C-FeA4j9.mjs                                                    [2m 12.07 kB[22m [2m│ gzip:  3.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtransport--Ck3RBin.mjs                                                   [2m 12.05 kB[22m [2m│ gzip:  3.86 kB[22m
packages/core build: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugins. Here is a breakdown:
packages/core build:   - rolldown-plugin-dts:generate (47%)
packages/core build:   - rolldown-plugin-dts:resolver (30%)
packages/core build: See https://rolldown.rs/options/checks#plugintimings for more details.
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/rewrite-urls.mjs.map                   [2m 11.45 kB[22m [2m│ gzip:  3.70 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/oauth/_provider_/callback.mjs.map                  [2m 11.29 kB[22m [2m│ gzip:  3.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mstorage/local.mjs.map                                                    [2m 11.26 kB[22m [2m│ gzip:  3.76 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mvalidation-BQ_TP-On.mjs.map                                              [2m 11.09 kB[22m [2m│ gzip:  4.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtaxonomy-Db5xwphL.mjs                                                    [2m 10.92 kB[22m [2m│ gzip:  3.06 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22muser-tLdHUEXV.mjs.map                                                    [2m 10.46 kB[22m [2m│ gzip:  3.28 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbyline-fields-Dr-xcb6S.mjs                                               [2m 10.44 kB[22m [2m│ gzip:  3.04 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media.mjs.map                                           [2m 10.31 kB[22m [2m│ gzip:  3.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtokens-Bx2afeT-.mjs.map                                                  [2m 10.30 kB[22m [2m│ gzip:  3.28 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/sitemap-_collection_.xml.mjs.map                            [2m 10.23 kB[22m [2m│ gzip:  3.64 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_.mjs.map                       [2m 10.22 kB[22m [2m│ gzip:  2.75 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/token.mjs.map                                     [2m 10.07 kB[22m [2m│ gzip:  3.04 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mnormalize-DVV8nbrL.mjs.map                                               [2m 10.06 kB[22m [2m│ gzip:  3.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-CfyYQ7eY.mjs.map                                                   [2m  9.36 kB[22m [2m│ gzip:  3.57 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msections-8DEa-dWt.mjs                                                    [2m  9.34 kB[22m [2m│ gzip:  2.48 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mseo-CKr7pLfA.mjs.map                                                     [2m  9.19 kB[22m [2m│ gzip:  3.06 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcomment-DkAfGX9E.mjs                                                     [2m  9.18 kB[22m [2m│ gzip:  2.50 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mresolve-BqYMVG0D.mjs.map                                                 [2m  9.12 kB[22m [2m│ gzip:  3.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/rewrite-url-helpers.mjs.map            [2m  9.07 kB[22m [2m│ gzip:  3.12 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbyline-fields-DC3Wkk-U.mjs.map                                           [2m  8.96 kB[22m [2m│ gzip:  2.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcron-DZovZUnC.mjs                                                        [2m  8.95 kB[22m [2m│ gzip:  3.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mpatterns-CqG5Ya3i.mjs.map                                                [2m  8.92 kB[22m [2m│ gzip:  3.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mclient/cf-access.mjs.map                                                 [2m  8.87 kB[22m [2m│ gzip:  3.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbyline-fields-DZR77qzY.d.mts.map                                         [2m  8.85 kB[22m [2m│ gzip:  1.54 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmedia/index.mjs.map                                                      [2m  8.84 kB[22m [2m│ gzip:  2.92 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/prepare.mjs.map                        [2m  8.65 kB[22m [2m│ gzip:  3.13 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moauth-authorization-DvBAL75d.mjs                                         [2m  8.64 kB[22m [2m│ gzip:  2.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/setup/dev-bypass.mjs.map                                [2m  8.60 kB[22m [2m│ gzip:  3.24 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mapi-tokens-VrXNiNvV.mjs.map                                              [2m  8.50 kB[22m [2m│ gzip:  2.44 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmedia/local-runtime.mjs.map                                              [2m  8.45 kB[22m [2m│ gzip:  2.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs.map      [2m  8.42 kB[22m [2m│ gzip:  2.72 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/register.mjs.map                                  [2m  8.19 kB[22m [2m│ gzip:  2.94 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdialect-helpers-DRI5pyY3.mjs.map                                         [2m  8.19 kB[22m [2m│ gzip:  2.27 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mallowed-origins-CyYLEJkp.mjs.map                                         [2m  8.19 kB[22m [2m│ gzip:  3.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrequest-meta-7ByVLxB-.mjs.map                                            [2m  8.19 kB[22m [2m│ gzip:  3.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mutils-C4Ih4DML.mjs                                                       [2m  8.16 kB[22m [2m│ gzip:  2.90 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mzod-generator-MMm56Prt.mjs                                               [2m  8.10 kB[22m [2m│ gzip:  2.42 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrate-limit-BI1OdpQH.mjs.map                                              [2m  8.07 kB[22m [2m│ gzip:  3.40 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mplaceholder-BZxr8W1j.mjs.map                                             [2m  7.97 kB[22m [2m│ gzip:  2.92 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msettings-Jro4YcUb.mjs                                                    [2m  7.86 kB[22m [2m│ gzip:  2.65 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdashboard-BrfLIsX1.mjs.map                                               [2m  7.78 kB[22m [2m│ gzip:  2.87 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moptions-BL4X94qY.mjs.map                                                 [2m  7.78 kB[22m [2m│ gzip:  2.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mseo/index.mjs.map                                                        [2m  7.67 kB[22m [2m│ gzip:  2.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/index.mjs.map                          [2m  7.59 kB[22m [2m│ gzip:  2.39 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moauth-clients-8mPDStMv.mjs                                               [2m  7.56 kB[22m [2m│ gzip:  1.83 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmedia-Cyz5BhSN.mjs                                                       [2m  7.41 kB[22m [2m│ gzip:  2.50 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbylines-DCczH3AV.mjs                                                     [2m  6.72 kB[22m [2m│ gzip:  2.54 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmanifest-schema-Cj-YrzrF.mjs                                             [2m  6.66 kB[22m [2m│ gzip:  2.24 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbylines-CbrD7STW.mjs                                                     [2m  6.54 kB[22m [2m│ gzip:  2.24 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/widgets/_id_.mjs.map                [2m  6.52 kB[22m [2m│ gzip:  1.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mseo-DfjLvu8i.mjs.map                                                     [2m  6.47 kB[22m [2m│ gzip:  2.62 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/settings/email.mjs.map                                  [2m  6.47 kB[22m [2m│ gzip:  2.40 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mwidgets-DzlINGI6.mjs.map                                                 [2m  6.46 kB[22m [2m│ gzip:  2.29 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/plugins/_pluginId_/_...path_.mjs.map                    [2m  6.43 kB[22m [2m│ gzip:  2.62 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/setup/admin-verify.mjs.map                              [2m  6.33 kB[22m [2m│ gzip:  2.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media/_id_.mjs.map                                      [2m  6.28 kB[22m [2m│ gzip:  1.75 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media/upload-url.mjs.map                                [2m  6.24 kB[22m [2m│ gzip:  2.44 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrequest-cache-BYMs-BGX.mjs.map                                           [2m  6.23 kB[22m [2m│ gzip:  2.42 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/setup/admin.mjs.map                                     [2m  6.21 kB[22m [2m│ gzip:  2.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mservice-9P2cdyR_.mjs                                                     [2m  6.21 kB[22m [2m│ gzip:  2.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/setup/index.mjs.map                                     [2m  6.16 kB[22m [2m│ gzip:  2.40 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/oauth/_provider_.mjs.map                           [2m  6.14 kB[22m [2m│ gzip:  2.26 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-DawhLFwy.d.mts.map                                                 [2m  6.05 kB[22m [2m│ gzip:  1.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mpublic-url-egRHCy1m.mjs.map                                              [2m  5.92 kB[22m [2m│ gzip:  2.40 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/register/verify.mjs.map                    [2m  5.90 kB[22m [2m│ gzip:  2.22 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mvalidate-VPnKoIzW.mjs.map                                                [2m  5.90 kB[22m [2m│ gzip:  1.70 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/preview-url.mjs.map           [2m  5.90 kB[22m [2m│ gzip:  2.39 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/middleware/redirect.mjs.map                                        [2m  5.82 kB[22m [2m│ gzip:  2.33 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/_id_/status.mjs.map                      [2m  5.69 kB[22m [2m│ gzip:  2.00 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mresolve-BqYMVG0D.mjs                                                     [2m  5.63 kB[22m [2m│ gzip:  2.12 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mvalidation-BQ_TP-On.mjs                                                  [2m  5.61 kB[22m [2m│ gzip:  2.25 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/dev-bypass.mjs.map                                 [2m  5.58 kB[22m [2m│ gzip:  2.30 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/install.mjs.map                  [2m  5.56 kB[22m [2m│ gzip:  2.38 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/schedule.mjs.map              [2m  5.56 kB[22m [2m│ gzip:  1.63 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media/providers/_providerId_/index.mjs.map              [2m  5.54 kB[22m [2m│ gzip:  1.81 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcomments-DLFnXs7J.mjs                                                    [2m  5.49 kB[22m [2m│ gzip:  1.74 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mpreview-BfuRkVKW.mjs.map                                                 [2m  5.44 kB[22m [2m│ gzip:  1.93 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mparse-B-K21lvm.mjs.map                                                   [2m  5.35 kB[22m [2m│ gzip:  1.95 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mallowed-origins-CyYLEJkp.mjs                                             [2m  5.31 kB[22m [2m│ gzip:  2.05 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-DpFmlNyB.mjs.map                                                   [2m  5.27 kB[22m [2m│ gzip:  1.85 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/bylines/_id_/translations.mjs.map                 [2m  5.21 kB[22m [2m│ gzip:  1.88 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mseo-CKr7pLfA.mjs                                                         [2m  5.12 kB[22m [2m│ gzip:  1.82 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/setup/status.mjs.map                                    [2m  5.09 kB[22m [2m│ gzip:  1.96 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mpatterns-CqG5Ya3i.mjs                                                    [2m  5.05 kB[22m [2m│ gzip:  1.85 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/index.mjs.map                      [2m  4.98 kB[22m [2m│ gzip:  1.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mclient/index.d.mts.map                                                   [2m  4.98 kB[22m [2m│ gzip:  1.43 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/_slug_/translations.mjs.map     [2m  4.98 kB[22m [2m│ gzip:  1.50 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/_id_.mjs.map                               [2m  4.95 kB[22m [2m│ gzip:  1.56 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtokens-Bx2afeT-.mjs                                                      [2m  4.94 kB[22m [2m│ gzip:  1.73 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/_slug_.mjs.map                  [2m  4.92 kB[22m [2m│ gzip:  1.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/typegen.mjs.map                                         [2m  4.90 kB[22m [2m│ gzip:  1.79 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrequest-context.mjs.map                                                  [2m  4.88 kB[22m [2m│ gzip:  2.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mnormalize-DVV8nbrL.mjs                                                   [2m  4.86 kB[22m [2m│ gzip:  1.48 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/allowed-domains/_domain_.mjs.map                  [2m  4.84 kB[22m [2m│ gzip:  1.49 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/oauth-clients/_id_.mjs.map                        [2m  4.75 kB[22m [2m│ gzip:  1.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/analyze.mjs.map                 [2m  4.74 kB[22m [2m│ gzip:  1.92 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22muser-tLdHUEXV.mjs                                                        [2m  4.74 kB[22m [2m│ gzip:  1.69 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/byline-fields/_slug_.mjs.map                      [2m  4.70 kB[22m [2m│ gzip:  1.46 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdatabase/instrumentation.mjs.map                                         [2m  4.63 kB[22m [2m│ gzip:  2.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/publish.mjs.map               [2m  4.63 kB[22m [2m│ gzip:  1.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/allowed-domains/index.mjs.map                     [2m  4.61 kB[22m [2m│ gzip:  1.60 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrequest-meta-7ByVLxB-.mjs                                                [2m  4.58 kB[22m [2m│ gzip:  1.93 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/bylines/_id_/index.mjs.map                        [2m  4.54 kB[22m [2m│ gzip:  1.61 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/index.mjs.map                                    [2m  4.52 kB[22m [2m│ gzip:  1.76 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/translations.mjs.map                       [2m  4.49 kB[22m [2m│ gzip:  1.48 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mplugin-utils.mjs.map                                                     [2m  4.46 kB[22m [2m│ gzip:  1.89 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/signup/request.mjs.map                             [2m  4.45 kB[22m [2m│ gzip:  1.92 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrate-limit-BI1OdpQH.mjs                                                  [2m  4.43 kB[22m [2m│ gzip:  2.07 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtrusted-proxy-B4AfnoAp.mjs.map                                           [2m  4.43 kB[22m [2m│ gzip:  1.96 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/types.d.mts.map                                                    [2m  4.42 kB[22m [2m│ gzip:  1.23 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/magic-link/send.mjs.map                            [2m  4.40 kB[22m [2m│ gzip:  1.78 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/index.mjs.map                              [2m  4.39 kB[22m [2m│ gzip:  1.57 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mplaceholder-BZxr8W1j.mjs                                                 [2m  4.39 kB[22m [2m│ gzip:  1.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mvalidate-VPnKoIzW.mjs                                                    [2m  4.35 kB[22m [2m│ gzip:  1.32 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/signup/complete.mjs.map                            [2m  4.33 kB[22m [2m│ gzip:  1.74 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbase64-CqR-7kqF.mjs.map                                                  [2m  4.31 kB[22m [2m│ gzip:  1.41 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/options.mjs.map                            [2m  4.30 kB[22m [2m│ gzip:  1.76 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media/_id_/confirm.mjs.map                              [2m  4.30 kB[22m [2m│ gzip:  1.76 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/complete.mjs.map                            [2m  4.29 kB[22m [2m│ gzip:  1.72 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/themes/preview.mjs.map                                  [2m  4.25 kB[22m [2m│ gzip:  1.80 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/index.mjs.map                               [2m  4.23 kB[22m [2m│ gzip:  1.83 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/hooks/exclusive/_hookName_.mjs.map                [2m  4.20 kB[22m [2m│ gzip:  1.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/register/options.mjs.map                   [2m  4.18 kB[22m [2m│ gzip:  1.69 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moauth-state-store-BJ7YtrfD.mjs.map                                       [2m  4.17 kB[22m [2m│ gzip:  1.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/redirects/_id_.mjs.map                                  [2m  4.17 kB[22m [2m│ gzip:  1.10 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/_id_/update.mjs.map              [2m  4.09 kB[22m [2m│ gzip:  1.70 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/register-options.mjs.map                    [2m  4.09 kB[22m [2m│ gzip:  1.75 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/bylines/index.mjs.map                             [2m  4.08 kB[22m [2m│ gzip:  1.48 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/middleware/setup.mjs.map                                           [2m  4.08 kB[22m [2m│ gzip:  1.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/sitemap.xml.mjs.map                                         [2m  4.05 kB[22m [2m│ gzip:  1.66 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/manifest.mjs.map                                        [2m  4.04 kB[22m [2m│ gzip:  1.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/sections/_slug_.mjs.map                                 [2m  3.99 kB[22m [2m│ gzip:  1.04 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mapi-tokens-VrXNiNvV.mjs                                                  [2m  3.95 kB[22m [2m│ gzip:  1.26 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media/providers/_providerId_/_itemId_.mjs.map           [2m  3.95 kB[22m [2m│ gzip:  1.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_.mjs.map                             [2m  3.86 kB[22m [2m│ gzip:  1.25 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/index.mjs.map                 [2m  3.83 kB[22m [2m│ gzip:  1.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_.mjs.map                                    [2m  3.79 kB[22m [2m│ gzip:  1.00 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdb/index.mjs.map                                                         [2m  3.77 kB[22m [2m│ gzip:  1.42 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbyline-fields-DC3Wkk-U.mjs                                               [2m  3.74 kB[22m [2m│ gzip:  0.97 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/widgets.mjs.map                     [2m  3.74 kB[22m [2m│ gzip:  1.48 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moptions-BL4X94qY.mjs                                                     [2m  3.69 kB[22m [2m│ gzip:  1.26 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/redirects/404s/index.mjs.map                            [2m  3.64 kB[22m [2m│ gzip:  1.07 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/duplicate.mjs.map             [2m  3.62 kB[22m [2m│ gzip:  1.48 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs.map    [2m  3.60 kB[22m [2m│ gzip:  1.01 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/updates.mjs.map                           [2m  3.56 kB[22m [2m│ gzip:  1.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcache-DIHHyPkt.mjs.map                                                   [2m  3.54 kB[22m [2m│ gzip:  1.45 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/verify.mjs.map                             [2m  3.54 kB[22m [2m│ gzip:  1.42 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdashboard-BrfLIsX1.mjs                                                   [2m  3.54 kB[22m [2m│ gzip:  1.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrequest-cache-BYMs-BGX.mjs                                               [2m  3.53 kB[22m [2m│ gzip:  1.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmime-CCEzze7W.mjs.map                                                    [2m  3.52 kB[22m [2m│ gzip:  1.48 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/device/token.mjs.map                              [2m  3.50 kB[22m [2m│ gzip:  1.56 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcomponents-CTfpu3PZ.mjs.map                                              [2m  3.46 kB[22m [2m│ gzip:  0.99 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mchallenge-store-DGwuCc4R.mjs.map                                         [2m  3.43 kB[22m [2m│ gzip:  1.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/disable.mjs.map                        [2m  3.43 kB[22m [2m│ gzip:  1.49 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/byline-fields/index.mjs.map                       [2m  3.38 kB[22m [2m│ gzip:  1.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mpublic-url-egRHCy1m.mjs                                                  [2m  3.37 kB[22m [2m│ gzip:  1.50 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-DWnN7weG.d.mts.map                                                 [2m  3.35 kB[22m [2m│ gzip:  1.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/items/_id_.mjs.map                         [2m  3.34 kB[22m [2m│ gzip:  1.04 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/index.mjs.map                   [2m  3.33 kB[22m [2m│ gzip:  1.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media/file/_...key_.mjs.map                             [2m  3.33 kB[22m [2m│ gzip:  1.52 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdialect-helpers-DRI5pyY3.mjs                                             [2m  3.33 kB[22m [2m│ gzip:  1.12 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/oauth-clients/index.mjs.map                       [2m  3.32 kB[22m [2m│ gzip:  1.25 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/robots.txt.mjs.map                                          [2m  3.28 kB[22m [2m│ gzip:  1.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/send-recovery.mjs.map                  [2m  3.27 kB[22m [2m│ gzip:  1.44 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mwidgets-DzlINGI6.mjs                                                     [2m  3.27 kB[22m [2m│ gzip:  1.22 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/restore.mjs.map               [2m  3.25 kB[22m [2m│ gzip:  1.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdb-errors-CtzxKBxe.mjs.map                                               [2m  3.25 kB[22m [2m│ gzip:  1.28 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22memail-console-DHT2Fbpj.mjs.map                                           [2m  3.23 kB[22m [2m│ gzip:  1.54 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/magic-link/verify.mjs.map                          [2m  3.18 kB[22m [2m│ gzip:  1.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/discard-draft.mjs.map         [2m  3.18 kB[22m [2m│ gzip:  1.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mvalidate-Dy6nkNls.d.mts.map                                              [2m  3.17 kB[22m [2m│ gzip:  0.98 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/widget-areas/_name_/reorder.mjs.map                     [2m  3.16 kB[22m [2m│ gzip:  1.32 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/api-tokens/index.mjs.map                          [2m  3.11 kB[22m [2m│ gzip:  1.21 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/unpublish.mjs.map             [2m  3.11 kB[22m [2m│ gzip:  1.27 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/_id_/install.mjs.map          [2m  3.10 kB[22m [2m│ gzip:  1.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmode-BjlXswIw.mjs.map                                                    [2m  3.04 kB[22m [2m│ gzip:  1.13 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/me.mjs.map                                         [2m  3.04 kB[22m [2m│ gzip:  1.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/search/rebuild.mjs.map                                  [2m  3.02 kB[22m [2m│ gzip:  1.23 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs.map         [2m  2.97 kB[22m [2m│ gzip:  1.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/revisions/_revisionId_/restore.mjs.map                  [2m  2.94 kB[22m [2m│ gzip:  1.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/_id_/icon.mjs.map             [2m  2.94 kB[22m [2m│ gzip:  1.30 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/index.mjs.map                               [2m  2.94 kB[22m [2m│ gzip:  1.30 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mruntime.mjs.map                                                          [2m  2.91 kB[22m [2m│ gzip:  1.25 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/settings.mjs.map                                        [2m  2.89 kB[22m [2m│ gzip:  1.06 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/index.mjs.map                                [2m  2.89 kB[22m [2m│ gzip:  1.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-D8bhH891.mjs                                                       [2m  2.88 kB[22m [2m│ gzip:  1.33 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/redirects/index.mjs.map                                 [2m  2.86 kB[22m [2m│ gzip:  1.00 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mpreview-BfuRkVKW.mjs                                                     [2m  2.85 kB[22m [2m│ gzip:  1.02 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mparse-B-K21lvm.mjs                                                       [2m  2.83 kB[22m [2m│ gzip:  1.15 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdefault-xLFNSsZ9.mjs.map                                                 [2m  2.82 kB[22m [2m│ gzip:  0.81 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mpasskey-config-BDVM86Tj.mjs.map                                          [2m  2.81 kB[22m [2m│ gzip:  1.25 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/search/index.mjs.map                                    [2m  2.78 kB[22m [2m│ gzip:  1.33 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/well-known/auth.mjs.map                                 [2m  2.75 kB[22m [2m│ gzip:  1.22 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/device/code.mjs.map                               [2m  2.74 kB[22m [2m│ gzip:  1.27 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/sections/index.mjs.map                                  [2m  2.71 kB[22m [2m│ gzip:  0.96 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/update.mjs.map                       [2m  2.71 kB[22m [2m│ gzip:  1.12 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/translations.mjs.map          [2m  2.70 kB[22m [2m│ gzip:  1.28 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/_id_.mjs.map                             [2m  2.68 kB[22m [2m│ gzip:  0.92 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/search/enable.mjs.map                                   [2m  2.65 kB[22m [2m│ gzip:  1.12 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-CfyYQ7eY.mjs                                                       [2m  2.64 kB[22m [2m│ gzip:  1.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mseo-DfjLvu8i.mjs                                                         [2m  2.59 kB[22m [2m│ gzip:  1.21 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/callback.mjs.map                [2m  2.55 kB[22m [2m│ gzip:  1.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mplaceholder-B9lUUEmj.d.mts.map                                           [2m  2.50 kB[22m [2m│ gzip:  0.92 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/menus/index.mjs.map                                     [2m  2.48 kB[22m [2m│ gzip:  0.97 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mconfig-CVssduLe.mjs.map                                                  [2m  2.48 kB[22m [2m│ gzip:  1.09 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/themes/marketplace/index.mjs.map                  [2m  2.44 kB[22m [2m│ gzip:  1.06 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mschema-BpCJh2lU.mjs.map                                                  [2m  2.44 kB[22m [2m│ gzip:  1.04 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mbase64-CqR-7kqF.mjs                                                      [2m  2.44 kB[22m [2m│ gzip:  0.92 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/index.mjs.map                        [2m  2.42 kB[22m [2m│ gzip:  0.89 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/index.mjs.map          [2m  2.41 kB[22m [2m│ gzip:  0.83 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/registry/_id_/uninstall.mjs.map           [2m  2.39 kB[22m [2m│ gzip:  1.08 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mindex-D60_SzHG.d.mts.map                                                 [2m  2.36 kB[22m [2m│ gzip:  0.80 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/hooks/exclusive/index.mjs.map                     [2m  2.33 kB[22m [2m│ gzip:  1.11 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtransaction-NQj4VJ7Z.mjs.map                                             [2m  2.32 kB[22m [2m│ gzip:  1.10 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/signup/verify.mjs.map                              [2m  2.29 kB[22m [2m│ gzip:  1.13 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/enable.mjs.map                       [2m  2.28 kB[22m [2m│ gzip:  1.05 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/mode.mjs.map                                       [2m  2.27 kB[22m [2m│ gzip:  1.13 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mauthorize-CLTmOUyx.mjs.map                                               [2m  2.24 kB[22m [2m│ gzip:  0.85 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/invite/accept.mjs.map                              [2m  2.22 kB[22m [2m│ gzip:  1.09 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/well-known/oauth-authorization-server.mjs.map           [2m  2.21 kB[22m [2m│ gzip:  0.97 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moptions-tb7DJROi.d.mts.map                                               [2m  2.19 kB[22m [2m│ gzip:  0.83 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/search/suggest.mjs.map                                  [2m  2.19 kB[22m [2m│ gzip:  1.06 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/uninstall.mjs.map                    [2m  2.18 kB[22m [2m│ gzip:  0.98 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mhash-9w3pd3-m.mjs.map                                                    [2m  2.18 kB[22m [2m│ gzip:  1.05 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/passkey/index.mjs.map                              [2m  2.11 kB[22m [2m│ gzip:  1.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdb-errors-CtzxKBxe.mjs                                                   [2m  2.10 kB[22m [2m│ gzip:  0.89 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msetup-complete-VoEZfasi.mjs.map                                          [2m  2.08 kB[22m [2m│ gzip:  0.91 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/device/authorize.mjs.map                          [2m  2.06 kB[22m [2m│ gzip:  1.00 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mslugify-Cjh1ssOZ.mjs.map                                                 [2m  2.04 kB[22m [2m│ gzip:  1.01 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/index.mjs.map                            [2m  2.01 kB[22m [2m│ gzip:  0.90 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtrusted-proxy-B4AfnoAp.mjs                                               [2m  1.99 kB[22m [2m│ gzip:  0.97 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/users/_id_/enable.mjs.map                         [2m  1.99 kB[22m [2m│ gzip:  0.94 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcomponents-CTfpu3PZ.mjs                                                  [2m  1.99 kB[22m [2m│ gzip:  0.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/bulk.mjs.map                             [2m  1.98 kB[22m [2m│ gzip:  0.88 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mcache-DIHHyPkt.mjs                                                       [2m  1.97 kB[22m [2m│ gzip:  0.80 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/index.mjs.map                 [2m  1.91 kB[22m [2m│ gzip:  0.86 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msettings-DYVzINdn.mjs.map                                                [2m  1.91 kB[22m [2m│ gzip:  0.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/reorder.mjs.map                            [2m  1.88 kB[22m [2m│ gzip:  0.86 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/menus/_name_/items.mjs.map                              [2m  1.87 kB[22m [2m│ gzip:  0.86 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/probe.mjs.map                                    [2m  1.84 kB[22m [2m│ gzip:  0.87 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/byline-fields/reorder.mjs.map                     [2m  1.82 kB[22m [2m│ gzip:  0.87 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moauth-state-store-BJ7YtrfD.mjs                                           [2m  1.79 kB[22m [2m│ gzip:  0.72 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmedia-allowlist-CMcoYIjQ.mjs.map                                         [2m  1.77 kB[22m [2m│ gzip:  0.94 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/setup/dev-reset.mjs.map                                 [2m  1.77 kB[22m [2m│ gzip:  0.89 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/disable.mjs.map                      [2m  1.77 kB[22m [2m│ gzip:  0.82 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/orphans/_slug_.mjs.map                           [2m  1.77 kB[22m [2m│ gzip:  0.81 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mpage/index.d.mts.map                                                     [2m  1.75 kB[22m [2m│ gzip:  0.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-DbCWhHet.d.mts.map                                                 [2m  1.74 kB[22m [2m│ gzip:  0.52 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/token/refresh.mjs.map                             [2m  1.72 kB[22m [2m│ gzip:  0.87 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/byline-fields/_slug_/usage.mjs.map                [2m  1.69 kB[22m [2m│ gzip:  0.87 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/api-tokens/_id_.mjs.map                           [2m  1.68 kB[22m [2m│ gzip:  0.85 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/redirects/404s/summary.mjs.map                          [2m  1.68 kB[22m [2m│ gzip:  0.79 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/oauth/token/revoke.mjs.map                              [2m  1.68 kB[22m [2m│ gzip:  0.87 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22memail-console-DHT2Fbpj.mjs                                               [2m  1.67 kB[22m [2m│ gzip:  0.86 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/revisions.mjs.map             [2m  1.67 kB[22m [2m│ gzip:  0.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/well-known/oauth-protected-resource.mjs.map             [2m  1.64 kB[22m [2m│ gzip:  0.85 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/permanent.mjs.map             [2m  1.62 kB[22m [2m│ gzip:  0.79 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/reorder.mjs.map        [2m  1.60 kB[22m [2m│ gzip:  0.72 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mchallenge-store-DGwuCc4R.mjs                                             [2m  1.59 kB[22m [2m│ gzip:  0.68 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mpasskey-config-BDVM86Tj.mjs                                              [2m  1.56 kB[22m [2m│ gzip:  0.74 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/trash.mjs.map                      [2m  1.55 kB[22m [2m│ gzip:  0.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mapi/route-utils.mjs.map                                                  [2m  1.54 kB[22m [2m│ gzip:  0.70 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-kwqCOUxj.d.mts.map                                                 [2m  1.53 kB[22m [2m│ gzip:  0.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/_id_/index.mjs.map                        [2m  1.48 kB[22m [2m│ gzip:  0.74 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-i8_uzhMD.d.mts.map                                                 [2m  1.48 kB[22m [2m│ gzip:  0.53 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/marketplace/_id_/index.mjs.map            [2m  1.45 kB[22m [2m│ gzip:  0.72 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/auth/logout.mjs.map                                     [2m  1.44 kB[22m [2m│ gzip:  0.77 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/themes/marketplace/_id_/index.mjs.map             [2m  1.43 kB[22m [2m│ gzip:  0.72 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/dev/emails.mjs.map                                      [2m  1.43 kB[22m [2m│ gzip:  0.63 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moauth-user-lookup-BdDSDvjF.mjs.map                                       [2m  1.41 kB[22m [2m│ gzip:  0.76 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdefault-xLFNSsZ9.mjs                                                     [2m  1.35 kB[22m [2m│ gzip:  0.50 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/dashboard.mjs.map                                       [2m  1.34 kB[22m [2m│ gzip:  0.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mslugify-Cjh1ssOZ.mjs                                                     [2m  1.31 kB[22m [2m│ gzip:  0.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mplugin-types.d.mts.map                                                   [2m  1.31 kB[22m [2m│ gzip:  0.48 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msite-url-Cm8-sJy7.mjs.map                                                [2m  1.30 kB[22m [2m│ gzip:  0.73 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/comments/counts.mjs.map                           [2m  1.30 kB[22m [2m│ gzip:  0.65 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/search/stats.mjs.map                                    [2m  1.29 kB[22m [2m│ gzip:  0.69 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/revisions/_revisionId_/index.mjs.map                    [2m  1.29 kB[22m [2m│ gzip:  0.68 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mload-CF5oETkh.mjs.map                                                    [2m  1.28 kB[22m [2m│ gzip:  0.64 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmime-CCEzze7W.mjs                                                        [2m  1.28 kB[22m [2m│ gzip:  0.64 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mauthorize-CLTmOUyx.mjs                                                   [2m  1.28 kB[22m [2m│ gzip:  0.52 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/plugins/index.mjs.map                             [2m  1.27 kB[22m [2m│ gzip:  0.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/compare.mjs.map               [2m  1.25 kB[22m [2m│ gzip:  0.67 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mconfig-CVssduLe.mjs                                                      [2m  1.23 kB[22m [2m│ gzip:  0.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmedia-allowlist-CMcoYIjQ.mjs                                             [2m  1.21 kB[22m [2m│ gzip:  0.70 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mhash-9w3pd3-m.mjs                                                        [2m  1.21 kB[22m [2m│ gzip:  0.66 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mschema-BpCJh2lU.mjs                                                      [2m  1.20 kB[22m [2m│ gzip:  0.59 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/media/providers/index.mjs.map                           [2m  1.16 kB[22m [2m│ gzip:  0.62 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msettings-DYVzINdn.mjs                                                    [2m  1.16 kB[22m [2m│ gzip:  0.48 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/PluginRegistry.mjs.map                                      [2m  1.15 kB[22m [2m│ gzip:  0.57 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdb/postgres.mjs.map                                                      [2m  1.14 kB[22m [2m│ gzip:  0.53 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/orphans/index.mjs.map                            [2m  1.14 kB[22m [2m│ gzip:  0.57 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msetup-complete-VoEZfasi.mjs                                              [2m  1.12 kB[22m [2m│ gzip:  0.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msetup-nonce-Bm0uKqmf.mjs.map                                             [2m  1.10 kB[22m [2m│ gzip:  0.63 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/execute.d.mts.map                      [2m  1.09 kB[22m [2m│ gzip:  0.53 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msetup-nonce-Bm0uKqmf.mjs                                                 [2m  1.02 kB[22m [2m│ gzip:  0.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/analyze.d.mts.map                      [2m  1.00 kB[22m [2m│ gzip:  0.43 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mauth/providers/github.mjs.map                                            [2m  0.99 kB[22m [2m│ gzip:  0.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mauth/providers/google.mjs.map                                            [2m  0.99 kB[22m [2m│ gzip:  0.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-Qa7-HJJC.d.mts.map                                                 [2m  0.94 kB[22m [2m│ gzip:  0.46 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtransaction-NQj4VJ7Z.mjs                                                 [2m  0.92 kB[22m [2m│ gzip:  0.48 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/widget-components.mjs.map                               [2m  0.91 kB[22m [2m│ gzip:  0.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdb/sqlite.mjs.map                                                        [2m  0.91 kB[22m [2m│ gzip:  0.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mchunks-DnnHlRG3.mjs.map                                                  [2m  0.90 kB[22m [2m│ gzip:  0.57 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22moauth-user-lookup-BdDSDvjF.mjs                                           [2m  0.81 kB[22m [2m│ gzip:  0.49 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mchunks-DnnHlRG3.mjs                                                      [2m  0.80 kB[22m [2m│ gzip:  0.51 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mredirect-Cw3JTlmj.mjs.map                                                [2m  0.75 kB[22m [2m│ gzip:  0.49 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/rewrite-url-helpers.d.mts.map          [2m  0.74 kB[22m [2m│ gzip:  0.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdb/libsql.mjs.map                                                        [2m  0.71 kB[22m [2m│ gzip:  0.41 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mload-CF5oETkh.mjs                                                        [2m  0.70 kB[22m [2m│ gzip:  0.38 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22merrors-9P_FDrJ_.mjs.map                                                  [2m  0.67 kB[22m [2m│ gzip:  0.45 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22madapters-C5AWLJSD.d.mts.map                                              [2m  0.67 kB[22m [2m│ gzip:  0.32 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mstorage/s3.d.mts.map                                                     [2m  0.67 kB[22m [2m│ gzip:  0.33 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mseo/index.d.mts.map                                                      [2m  0.64 kB[22m [2m│ gzip:  0.36 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mstorage/local.d.mts.map                                                  [2m  0.62 kB[22m [2m│ gzip:  0.32 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-DX6v9KzJ.d.mts.map                                                 [2m  0.59 kB[22m [2m│ gzip:  0.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mversion-Bfzo4Tqq.mjs.map                                                 [2m  0.59 kB[22m [2m│ gzip:  0.33 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mescape-bIyGoW5W.mjs.map                                                  [2m  0.58 kB[22m [2m│ gzip:  0.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmode-BjlXswIw.mjs                                                        [2m  0.58 kB[22m [2m│ gzip:  0.36 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrequest-context.d.mts.map                                                [2m  0.57 kB[22m [2m│ gzip:  0.31 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mplugin-utils.d.mts.map                                                   [2m  0.56 kB[22m [2m│ gzip:  0.30 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mdatabase/instrumentation.d.mts.map                                       [2m  0.53 kB[22m [2m│ gzip:  0.28 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mredirect-Cw3JTlmj.mjs                                                    [2m  0.53 kB[22m [2m│ gzip:  0.37 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22merrors-9P_FDrJ_.mjs                                                      [2m  0.53 kB[22m [2m│ gzip:  0.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtransport-OnMNbsIA.d.mts.map                                             [2m  0.49 kB[22m [2m│ gzip:  0.28 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mrunner-DM1yR5qd.d.mts.map                                                [2m  0.49 kB[22m [2m│ gzip:  0.25 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mclient/cf-access.d.mts.map                                               [2m  0.49 kB[22m [2m│ gzip:  0.27 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mapi/route-utils.d.mts.map                                                [2m  0.48 kB[22m [2m│ gzip:  0.27 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/media.d.mts.map                        [2m  0.45 kB[22m [2m│ gzip:  0.25 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22msite-url-Cm8-sJy7.mjs                                                    [2m  0.44 kB[22m [2m│ gzip:  0.30 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mmedia/local-runtime.d.mts.map                                            [2m  0.40 kB[22m [2m│ gzip:  0.23 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/index.d.mts.map                                                    [2m  0.36 kB[22m [2m│ gzip:  0.22 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-DpFmlNyB.mjs                                                       [2m  0.36 kB[22m [2m│ gzip:  0.24 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mescape-bIyGoW5W.mjs                                                      [2m  0.36 kB[22m [2m│ gzip:  0.25 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/rewrite-urls.d.mts.map                 [2m  0.34 kB[22m [2m│ gzip:  0.23 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/middleware/auth.d.mts.map                                          [2m  0.33 kB[22m [2m│ gzip:  0.22 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/execute.d.mts.map               [2m  0.32 kB[22m [2m│ gzip:  0.23 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress/prepare.d.mts.map                      [2m  0.32 kB[22m [2m│ gzip:  0.21 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/plugins/_pluginId_/_...path_.d.mts.map                  [2m  0.29 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/wordpress-plugin/analyze.d.mts.map               [2m  0.27 kB[22m [2m│ gzip:  0.20 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.d.mts.map  [2m  0.26 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/PluginRegistry.d.mts.map                                    [2m  0.26 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mtypes-Cj2S6FuC.mjs                                                       [2m  0.25 kB[22m [2m│ gzip:  0.16 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/_slug_.d.mts.map                [2m  0.25 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mapi-tokens-B6VgoE6M.mjs                                                  [2m  0.25 kB[22m [2m│ gzip:  0.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/content/_collection_/_id_/terms/_taxonomy_.d.mts.map    [2m  0.24 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/import/probe.d.mts.map                                  [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/schema/collections/_slug_/index.d.mts.map               [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/oauth-clients/_id_.d.mts.map                      [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/taxonomies/_name_/terms/_slug_/translations.d.mts.map   [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/byline-fields/_slug_.d.mts.map                    [2m  0.23 kB[22m [2m│ gzip:  0.18 kB[22m
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
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/byline-fields/index.d.mts.map                     [2m  0.20 kB[22m [2m│ gzip:  0.17 kB[22m
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
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/byline-fields/_slug_/usage.d.mts.map              [2m  0.19 kB[22m [2m│ gzip:  0.16 kB[22m
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
packages/core build: [34mℹ[39m [2mdist/[22mastro/routes/api/admin/byline-fields/reorder.d.mts.map                   [2m  0.18 kB[22m [2m│ gzip:  0.16 kB[22m
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
packages/core build: [34mℹ[39m [2mdist/[22mversion-Bfzo4Tqq.mjs                                                     [2m  0.17 kB[22m [2m│ gzip:  0.16 kB[22m
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
packages/core build: [34mℹ[39m [2mdist/[22mssrf-BvgVcfNQ.mjs                                                        [2m  0.01 kB[22m [2m│ gzip:  0.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.mts[22m[39m                                                              [2m 18.25 kB[22m [2m│ gzip:  4.84 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/types.d.mts[22m[39m                                                        [2m 13.02 kB[22m [2m│ gzip:  3.97 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mclient/index.d.mts[22m[39m                                                       [2m 11.50 kB[22m [2m│ gzip:  3.14 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mapi/schemas/index.d.mts[22m[39m                                                  [2m  8.30 kB[22m [2m│ gzip:  1.94 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mpage/index.d.mts[22m[39m                                                         [2m  6.82 kB[22m [2m│ gzip:  2.27 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mplugin-types.d.mts[22m[39m                                                       [2m  6.61 kB[22m [2m│ gzip:  2.36 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/execute.d.mts[22m[39m                          [2m  3.92 kB[22m [2m│ gzip:  1.55 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mapi/route-utils.d.mts[22m[39m                                                    [2m  2.94 kB[22m [2m│ gzip:  1.35 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mplugin-utils.d.mts[22m[39m                                                       [2m  2.85 kB[22m [2m│ gzip:  1.24 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mrequest-context.d.mts[22m[39m                                                    [2m  2.81 kB[22m [2m│ gzip:  1.29 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/index.d.mts[22m[39m                                                        [2m  2.60 kB[22m [2m│ gzip:  1.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mclient/cf-access.d.mts[22m[39m                                                   [2m  2.55 kB[22m [2m│ gzip:  1.03 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/analyze.d.mts[22m[39m                          [2m  2.52 kB[22m [2m│ gzip:  0.95 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mseo/index.d.mts[22m[39m                                                          [2m  2.45 kB[22m [2m│ gzip:  1.01 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/import/wordpress/rewrite-url-helpers.d.mts[22m[39m              [2m  2.14 kB[22m [2m│ gzip:  0.89 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mdatabase/instrumentation.d.mts[22m[39m                                           [2m  2.00 kB[22m [2m│ gzip:  0.95 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mstorage/s3.d.mts[22m[39m                                                         [2m  1.61 kB[22m [2m│ gzip:  0.75 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mmedia/index.d.mts[22m[39m                                                        [2m  1.52 kB[22m [2m│ gzip:  0.63 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mstorage/local.d.mts[22m[39m                                                      [2m  1.50 kB[22m [2m│ gzip:  0.70 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mplugins/adapt-sandbox-entry.d.mts[22m[39m                                        [2m  1.37 kB[22m [2m│ gzip:  0.65 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mmedia/local-runtime.d.mts[22m[39m                                                [2m  1.34 kB[22m [2m│ gzip:  0.60 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mruntime.d.mts[22m[39m                                                            [2m  1.10 kB[22m [2m│ gzip:  0.58 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/middleware/auth.d.mts[22m[39m                                              [2m  0.97 kB[22m [2m│ gzip:  0.50 kB[22m
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
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mauth/providers/google.d.mts[22m[39m                                              [2m  0.45 kB[22m [2m│ gzip:  0.30 kB[22m
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
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/byline-fields/_slug_.d.mts[22m[39m                        [2m  0.32 kB[22m [2m│ gzip:  0.21 kB[22m
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
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/byline-fields/index.d.mts[22m[39m                         [2m  0.27 kB[22m [2m│ gzip:  0.19 kB[22m
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
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/byline-fields/_slug_/usage.d.mts[22m[39m                  [2m  0.24 kB[22m [2m│ gzip:  0.19 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32m[1mastro/routes/api/admin/byline-fields/reorder.d.mts[22m[39m                       [2m  0.24 kB[22m [2m│ gzip:  0.18 kB[22m
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
packages/core build: [34mℹ[39m [2mdist/[22m[32mindex-BK-J-DhV.d.mts[39m                                                     [2m154.91 kB[22m [2m│ gzip: 41.94 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mbyline-fields-DZR77qzY.d.mts[39m                                             [2m 79.04 kB[22m [2m│ gzip:  9.29 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mtypes-jbkzJ1j_.d.mts[39m                                                     [2m 40.10 kB[22m [2m│ gzip: 10.71 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mtypes-DawhLFwy.d.mts[39m                                                     [2m 12.69 kB[22m [2m│ gzip:  2.85 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mtypes-DWnN7weG.d.mts[39m                                                     [2m  9.78 kB[22m [2m│ gzip:  3.24 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mvalidate-Dy6nkNls.d.mts[39m                                                  [2m  9.46 kB[22m [2m│ gzip:  2.96 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mplaceholder-B9lUUEmj.d.mts[39m                                               [2m  8.70 kB[22m [2m│ gzip:  2.96 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mindex-D60_SzHG.d.mts[39m                                                     [2m  7.74 kB[22m [2m│ gzip:  2.83 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mtypes-i8_uzhMD.d.mts[39m                                                     [2m  6.54 kB[22m [2m│ gzip:  2.54 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32moptions-tb7DJROi.d.mts[39m                                                   [2m  6.44 kB[22m [2m│ gzip:  2.43 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mtypes-Qa7-HJJC.d.mts[39m                                                     [2m  6.19 kB[22m [2m│ gzip:  2.34 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mtypes-DbCWhHet.d.mts[39m                                                     [2m  6.03 kB[22m [2m│ gzip:  1.79 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mtypes-kwqCOUxj.d.mts[39m                                                     [2m  5.04 kB[22m [2m│ gzip:  1.78 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32madapters-C5AWLJSD.d.mts[39m                                                  [2m  3.21 kB[22m [2m│ gzip:  1.32 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mtypes-DX6v9KzJ.d.mts[39m                                                     [2m  2.64 kB[22m [2m│ gzip:  1.17 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mrunner-DM1yR5qd.d.mts[39m                                                    [2m  1.98 kB[22m [2m│ gzip:  0.93 kB[22m
packages/core build: [34mℹ[39m [2mdist/[22m[32mtransport-OnMNbsIA.d.mts[39m                                                 [2m  1.67 kB[22m [2m│ gzip:  0.76 kB[22m
packages/core build: [34mℹ[39m 1019 files, total: 7274.49 kB
packages/core build: [32m✔[39m Build complete in [32m5074ms[39m
packages/core build: Done
packages/cloudflare build$ tsdown
packages/plugins/atproto build$ node node_modules/@emdash-cms/plugin-cli/dist/index.mjs build
packages/plugins/audit-log build$ node node_modules/@emdash-cms/plugin-cli/dist/index.mjs build
packages/plugins/awcms-micro-docs build$ tsdown
packages/cloudflare build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/plugins/awcms-micro-docs build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/plugins/awcms-micro-docs build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-docs/tsdown.config.ts[24m
packages/cloudflare build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/cloudflare/tsdown.config.ts[24m
packages/cloudflare build: [34mℹ[39m entry: [34msrc/index.ts, src/db/d1.ts, src/db/do.ts, src/db/playground.ts, src/db/playground-middleware.ts, src/storage/r2.ts, src/auth/index.ts, src/sandbox/index.ts, src/plugins/index.ts, src/media/images-runtime.ts, src/media/stream-runtime.ts, src/cache/runtime.ts, src/cache/config.ts[39m
packages/cloudflare build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/awcms-micro-docs build: [34mℹ[39m entry: [34msrc/index.ts, src/admin.tsx[39m
packages/plugins/awcms-micro-docs build: [34mℹ[39m target: [34mes2023[39m
packages/plugins/awcms-micro-docs build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/cloudflare build: [34mℹ[39m Build start
packages/plugins/awcms-micro-docs build: [34mℹ[39m Build start
packages/cloudflare build: [34mℹ[39m Cleaning 41 files
packages/plugins/awcms-micro-docs build: [34mℹ[39m Cleaning 10 files
packages/plugins/audit-log build: ◐ Building plugin...
packages/plugins/atproto build: ◐ Building plugin...
packages/plugins/atproto build: ℹ Manifest: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/atproto/emdash-plugin.jsonc
packages/plugins/atproto build: ℹ Plugin entry: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/atproto/src/plugin.ts
packages/plugins/atproto build: ℹ Package: @emdash-cms/plugin-atproto
packages/plugins/audit-log build: ℹ Manifest: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/audit-log/emdash-plugin.jsonc
packages/plugins/audit-log build: ℹ Plugin entry: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/audit-log/src/plugin.ts
packages/plugins/audit-log build: ℹ Package: @emdash-cms/plugin-audit-log
packages/plugins/audit-log build: ◐ Building runtime entry...
packages/plugins/audit-log build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/audit-log build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/audit-log build: [34mℹ[39m Build start
packages/plugins/atproto build: ◐ Building runtime entry...
packages/plugins/atproto build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/atproto build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/atproto build: [34mℹ[39m Build start
packages/plugins/audit-log build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-Wcqoep/runtime/[22m[1mplugin.mjs[22m        [2m 4.80 kB[22m [2m│ gzip: 1.60 kB[22m
packages/plugins/audit-log build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-Wcqoep/runtime/[22mplugin.mjs.map    [2m17.30 kB[22m [2m│ gzip: 4.37 kB[22m
packages/plugins/audit-log build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-Wcqoep/runtime/[22mplugin.d.mts.map  [2m 0.40 kB[22m [2m│ gzip: 0.21 kB[22m
packages/plugins/audit-log build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-Wcqoep/runtime/[22m[32m[1mplugin.d.mts[22m[39m      [2m 4.76 kB[22m [2m│ gzip: 0.81 kB[22m
packages/plugins/audit-log build: [34mℹ[39m 4 files, total: 27.26 kB
packages/plugins/audit-log build: [32m✔[39m Build complete in [32m1910ms[39m
packages/plugins/audit-log build: ✔ Built plugin.mjs
packages/plugins/audit-log build: ◐ Probing plugin surface...
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
packages/cloudflare build: [32m✔[39m Build complete in [32m2031ms[39m
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
packages/plugins/audit-log build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-Wcqoep/plugin-probe/[22m[1mplugin.mjs[22m  [2m8.20 kB[22m [2m│ gzip: 2.12 kB[22m
packages/plugins/audit-log build: [34mℹ[39m 1 files, total: 8.20 kB
packages/plugins/audit-log build: [32m✔[39m Build complete in [32m9ms[39m
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
packages/plugins/awcms-micro-gallery build$ tsdown
packages/cloudflare build: Done
packages/plugins/awcms-micro-sikesra build$ tsdown
packages/plugins/awcms-micro-gallery build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/plugins/atproto build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-JmZBHP/runtime/[22m[1mplugin.mjs[22m        [2m20.02 kB[22m [2m│ gzip:  5.90 kB[22m
packages/plugins/atproto build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-JmZBHP/runtime/[22mplugin.mjs.map    [2m77.27 kB[22m [2m│ gzip: 17.16 kB[22m
packages/plugins/atproto build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-JmZBHP/runtime/[22mplugin.d.mts.map  [2m 0.79 kB[22m [2m│ gzip:  0.32 kB[22m
packages/plugins/atproto build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-JmZBHP/runtime/[22m[32m[1mplugin.d.mts[22m[39m      [2m 3.14 kB[22m [2m│ gzip:  0.80 kB[22m
packages/plugins/atproto build: [34mℹ[39m 4 files, total: 101.22 kB
packages/plugins/awcms-micro-gallery build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-gallery/tsdown.config.ts[24m
packages/plugins/atproto build: [32m✔[39m Build complete in [32m2080ms[39m
packages/plugins/atproto build: ✔ Built plugin.mjs
packages/plugins/atproto build: ◐ Probing plugin surface...
packages/plugins/awcms-micro-gallery build: [34mℹ[39m entry: [34msrc/index.ts, src/sandbox.ts[39m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m target: [34mes2023[39m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/atproto build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/atproto build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/atproto build: [34mℹ[39m Build start
packages/plugins/awcms-micro-gallery build: [34mℹ[39m Build start
packages/plugins/awcms-micro-gallery build: [34mℹ[39m Cleaning 10 files
packages/plugins/atproto build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-JmZBHP/plugin-probe/[22m[1mplugin.mjs[22m  [2m36.48 kB[22m [2m│ gzip: 8.53 kB[22m
packages/plugins/atproto build: [34mℹ[39m 1 files, total: 36.48 kB
packages/plugins/atproto build: [32m✔[39m Build complete in [32m12ms[39m
packages/plugins/atproto build: ℹ   Hooks: plugin:install, content:afterSave, content:afterPublish, content:afterDelete, page:metadata
packages/plugins/atproto build: ℹ   Routes: status, test-connection, sync-publication, recent-syncs, verification, admin
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/tsdown.config.ts[24m
packages/plugins/atproto build: ✔ Wrote manifest.json
packages/plugins/atproto build: ◐ Generating descriptor module...
packages/plugins/atproto build: ✔ Wrote index.mjs
packages/plugins/atproto build: ✔ Plugin built: atproto@0.2.0
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m entry: [34msrc/index.ts, src/admin.tsx, src/navigation.ts, src/sandbox.ts[39m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m target: [34mes2023[39m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m Build start
packages/plugins/atproto build: ℹ Output:
packages/plugins/atproto build:   /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/atproto/dist/index.mjs
packages/plugins/atproto build:   /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/atproto/dist/plugin.mjs
packages/plugins/atproto build:   /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/atproto/dist/manifest.json
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m Cleaning 11 files
packages/plugins/atproto build: Done
.../plugins/awcms-micro-website-social build$ tsdown
.../plugins/awcms-micro-website-social build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
.../plugins/awcms-micro-website-social build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-website-social/tsdown.config.ts[24m
.../plugins/awcms-micro-website-social build: [34mℹ[39m entry: [34msrc/index.ts, src/admin.tsx[39m
.../plugins/awcms-micro-website-social build: [34mℹ[39m target: [34mes2023[39m
.../plugins/awcms-micro-website-social build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
.../plugins/awcms-micro-website-social build: [34mℹ[39m Build start
.../plugins/awcms-micro-website-social build: [34mℹ[39m Cleaning 8 files
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
packages/plugins/awcms-micro-docs build: [32m✔[39m Build complete in [32m2963ms[39m
packages/plugins/awcms-micro-docs build: Done
packages/plugins/marketplace-test build$ node node_modules/@emdash-cms/plugin-cli/dist/index.mjs build
packages/plugins/marketplace-test build: ◐ Building plugin...
packages/plugins/marketplace-test build: ℹ Manifest: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/marketplace-test/emdash-plugin.jsonc
packages/plugins/marketplace-test build: ℹ Plugin entry: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/marketplace-test/src/plugin.ts
packages/plugins/marketplace-test build: ℹ Package: @emdash-cms/plugin-marketplace-test
packages/plugins/marketplace-test build: ◐ Building runtime entry...
packages/plugins/marketplace-test build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/marketplace-test build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/marketplace-test build: [34mℹ[39m Build start
packages/plugins/awcms-micro-gallery build: [34mℹ[39m [2mdist/[22m[1mindex.mjs[22m                    [2m29.33 kB[22m [2m│ gzip:  6.78 kB[22m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m [2mdist/[22m[1msandbox.mjs[22m                  [2m26.63 kB[22m [2m│ gzip:  6.02 kB[22m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m [2mdist/[22mindex.mjs.map                [2m55.59 kB[22m [2m│ gzip: 12.29 kB[22m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m [2mdist/[22msandbox.mjs.map              [2m51.85 kB[22m [2m│ gzip: 11.35 kB[22m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m [2mdist/[22mvalidation-IIdTEAKI.mjs.map  [2m28.07 kB[22m [2m│ gzip:  6.75 kB[22m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m [2mdist/[22mvalidation-IIdTEAKI.mjs      [2m17.00 kB[22m [2m│ gzip:  4.47 kB[22m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m [2mdist/[22mindex.d.mts.map              [2m 0.87 kB[22m [2m│ gzip:  0.36 kB[22m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m [2mdist/[22msandbox.d.mts.map            [2m 0.12 kB[22m [2m│ gzip:  0.12 kB[22m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.mts[22m[39m                  [2m 3.57 kB[22m [2m│ gzip:  1.02 kB[22m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m [2mdist/[22m[32m[1msandbox.d.mts[22m[39m                [2m 0.21 kB[22m [2m│ gzip:  0.16 kB[22m
packages/plugins/awcms-micro-gallery build: [34mℹ[39m 10 files, total: 213.24 kB
packages/plugins/awcms-micro-gallery build: [32m✔[39m Build complete in [32m1911ms[39m
packages/plugins/awcms-micro-gallery build: Done
packages/plugins/sandboxed-test build$ node node_modules/@emdash-cms/plugin-cli/dist/index.mjs build
packages/plugins/sandboxed-test build: ◐ Building plugin...
packages/plugins/sandboxed-test build: ℹ Manifest: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/sandboxed-test/emdash-plugin.jsonc
packages/plugins/sandboxed-test build: ℹ Plugin entry: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/sandboxed-test/src/plugin.ts
packages/plugins/sandboxed-test build: ℹ Package: @emdash-cms/plugin-sandboxed-test
packages/plugins/sandboxed-test build: ◐ Building runtime entry...
packages/plugins/sandboxed-test build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/sandboxed-test build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/sandboxed-test build: [34mℹ[39m Build start
packages/plugins/marketplace-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-unYUQ4/runtime/[22m[1mplugin.mjs[22m        [2m0.58 kB[22m [2m│ gzip: 0.34 kB[22m
packages/plugins/marketplace-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-unYUQ4/runtime/[22mplugin.mjs.map    [2m2.47 kB[22m [2m│ gzip: 1.12 kB[22m
packages/plugins/marketplace-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-unYUQ4/runtime/[22mplugin.d.mts.map  [2m0.18 kB[22m [2m│ gzip: 0.15 kB[22m
packages/plugins/marketplace-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-unYUQ4/runtime/[22m[32m[1mplugin.d.mts[22m[39m      [2m1.59 kB[22m [2m│ gzip: 0.70 kB[22m
packages/plugins/marketplace-test build: [34mℹ[39m 4 files, total: 4.82 kB
packages/plugins/marketplace-test build: [32m✔[39m Build complete in [32m1695ms[39m
packages/plugins/marketplace-test build: ✔ Built plugin.mjs
packages/plugins/marketplace-test build: ◐ Probing plugin surface...
packages/plugins/marketplace-test build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/marketplace-test build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/marketplace-test build: [34mℹ[39m Build start
packages/plugins/marketplace-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-unYUQ4/plugin-probe/[22m[1mplugin.mjs[22m  [2m0.85 kB[22m [2m│ gzip: 0.44 kB[22m
packages/plugins/marketplace-test build: [34mℹ[39m 1 files, total: 0.85 kB
packages/plugins/marketplace-test build: [32m✔[39m Build complete in [32m12ms[39m
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
packages/plugins/webhook-notifier build$ node node_modules/@emdash-cms/plugin-cli/dist/index.mjs build
packages/plugins/webhook-notifier build: ◐ Building plugin...
packages/plugins/webhook-notifier build: ℹ Manifest: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/webhook-notifier/emdash-plugin.jsonc
packages/plugins/webhook-notifier build: ℹ Plugin entry: /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/webhook-notifier/src/plugin.ts
packages/plugins/webhook-notifier build: ℹ Package: @emdash-cms/plugin-webhook-notifier
packages/plugins/webhook-notifier build: ◐ Building runtime entry...
packages/plugins/webhook-notifier build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/webhook-notifier build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/webhook-notifier build: [34mℹ[39m Build start
.../plugins/awcms-micro-website-social build: [34mℹ[39m [2mdist/[22m[1madmin.js[22m        [2m4.48 kB[22m [2m│ gzip: 1.67 kB[22m
.../plugins/awcms-micro-website-social build: [34mℹ[39m [2mdist/[22m[1mindex.js[22m        [2m1.17 kB[22m [2m│ gzip: 0.47 kB[22m
.../plugins/awcms-micro-website-social build: [34mℹ[39m [2mdist/[22madmin.js.map    [2m6.29 kB[22m [2m│ gzip: 2.32 kB[22m
.../plugins/awcms-micro-website-social build: [34mℹ[39m [2mdist/[22mindex.js.map    [2m1.66 kB[22m [2m│ gzip: 0.67 kB[22m
.../plugins/awcms-micro-website-social build: [34mℹ[39m [2mdist/[22mindex.d.ts.map  [2m0.20 kB[22m [2m│ gzip: 0.16 kB[22m
.../plugins/awcms-micro-website-social build: [34mℹ[39m [2mdist/[22madmin.d.ts.map  [2m0.12 kB[22m [2m│ gzip: 0.12 kB[22m
.../plugins/awcms-micro-website-social build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.ts[22m[39m      [2m0.70 kB[22m [2m│ gzip: 0.33 kB[22m
.../plugins/awcms-micro-website-social build: [34mℹ[39m [2mdist/[22m[32m[1madmin.d.ts[22m[39m      [2m0.21 kB[22m [2m│ gzip: 0.15 kB[22m
.../plugins/awcms-micro-website-social build: [34mℹ[39m 8 files, total: 14.83 kB
.../plugins/awcms-micro-website-social build: [32m✔[39m Build complete in [32m2886ms[39m
.../plugins/awcms-micro-website-social build: Done
packages/workerd build$ tsdown
packages/workerd build: [34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
packages/workerd build: [34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/workerd/tsdown.config.ts[24m
packages/workerd build: [34mℹ[39m entry: [34msrc/index.ts, src/sandbox/index.ts[39m
packages/workerd build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/workerd build: [34mℹ[39m Build start
packages/workerd build: [34mℹ[39m Cleaning 7 files
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22m[1madmin.js[22m                           [2m360.78 kB[22m [2m│ gzip: 54.33 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22m[1mindex.js[22m                           [2m  2.79 kB[22m [2m│ gzip:  0.99 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22m[1mnavigation.js[22m                      [2m  0.78 kB[22m [2m│ gzip:  0.32 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22m[1msandbox.js[22m                         [2m  0.30 kB[22m [2m│ gzip:  0.21 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22mruntime-5dclkDQF.js                [2m381.89 kB[22m [2m│ gzip: 77.95 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22mfield-standards-DPRMDU-F.js        [2m 30.46 kB[22m [2m│ gzip:  5.13 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22mAwcmsPluginHeaderMenu-V7ITPBZD.js  [2m 13.98 kB[22m [2m│ gzip:  3.29 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22m[32m[1mindex.d.ts[22m[39m                         [2m  7.29 kB[22m [2m│ gzip:  1.91 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22m[32m[1mnavigation.d.ts[22m[39m                    [2m  6.04 kB[22m [2m│ gzip:  1.38 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22m[32m[1madmin.d.ts[22m[39m                         [2m  3.20 kB[22m [2m│ gzip:  1.04 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m [2mdist/[22m[32m[1msandbox.d.ts[22m[39m                       [2m  2.23 kB[22m [2m│ gzip:  0.50 kB[22m
packages/plugins/awcms-micro-sikesra build: [34mℹ[39m 11 files, total: 809.74 kB
packages/plugins/awcms-micro-sikesra build: [32m✔[39m Build complete in [32m3324ms[39m
packages/plugins/awcms-micro-sikesra build: [33m[PLUGIN_TIMINGS] Warning:[0m Your build spent significant time in plugin `rolldown-plugin-dts:generate`. See https://rolldown.rs/options/checks#plugintimings for more details.
packages/plugins/awcms-micro-sikesra build: Done
packages/plugins/sandboxed-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-lvDEaO/runtime/[22m[1mplugin.mjs[22m        [2m19.59 kB[22m [2m│ gzip:  5.31 kB[22m
packages/plugins/sandboxed-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-lvDEaO/runtime/[22mplugin.mjs.map    [2m62.07 kB[22m [2m│ gzip: 13.43 kB[22m
packages/plugins/sandboxed-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-lvDEaO/runtime/[22mplugin.d.mts.map  [2m 1.75 kB[22m [2m│ gzip:  0.37 kB[22m
packages/plugins/sandboxed-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-lvDEaO/runtime/[22m[32m[1mplugin.d.mts[22m[39m      [2m 8.47 kB[22m [2m│ gzip:  1.15 kB[22m
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
packages/plugins/sandboxed-test build: [32m✔[39m Build complete in [32m1764ms[39m
packages/plugins/sandboxed-test build: ✔ Built plugin.mjs
packages/plugins/sandboxed-test build: ◐ Probing plugin surface...
packages/plugins/sandboxed-test build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/sandboxed-test build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/sandboxed-test build: [34mℹ[39m Build start
packages/plugins/sandboxed-test build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-lvDEaO/plugin-probe/[22m[1mplugin.mjs[22m  [2m29.37 kB[22m [2m│ gzip: 6.51 kB[22m
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
packages/plugins/webhook-notifier build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-j7t5cl/runtime/[22m[1mplugin.mjs[22m        [2m 9.25 kB[22m [2m│ gzip: 3.05 kB[22m
packages/plugins/webhook-notifier build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-j7t5cl/runtime/[22mplugin.mjs.map    [2m28.71 kB[22m [2m│ gzip: 7.20 kB[22m
packages/plugins/webhook-notifier build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-j7t5cl/runtime/[22mplugin.d.mts.map  [2m 0.30 kB[22m [2m│ gzip: 0.21 kB[22m
packages/plugins/webhook-notifier build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-j7t5cl/runtime/[22m[32m[1mplugin.d.mts[22m[39m      [2m 2.94 kB[22m [2m│ gzip: 0.70 kB[22m
packages/plugins/webhook-notifier build: [34mℹ[39m 4 files, total: 41.20 kB
packages/plugins/webhook-notifier build: [32m✔[39m Build complete in [32m1750ms[39m
packages/plugins/webhook-notifier build: ✔ Built plugin.mjs
packages/plugins/webhook-notifier build: ◐ Probing plugin surface...
packages/plugins/webhook-notifier build: [34mℹ[39m entry: [34msrc/plugin.ts[39m
packages/plugins/webhook-notifier build: [34mℹ[39m tsconfig: [34mtsconfig.json[39m
packages/plugins/webhook-notifier build: [34mℹ[39m Build start
packages/plugins/webhook-notifier build: [34mℹ[39m [2m../../../../../../../../tmp/emdash-build-j7t5cl/plugin-probe/[22m[1mplugin.mjs[22m  [2m14.88 kB[22m [2m│ gzip: 3.94 kB[22m
packages/plugins/webhook-notifier build: [34mℹ[39m 1 files, total: 14.88 kB
packages/plugins/webhook-notifier build: [32m✔[39m Build complete in [32m10ms[39m
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
packages/workerd build: [32m✔[39m Build complete in [32m1762ms[39m
packages/workerd build: Done
$ node scripts/relink-bins-if-needed.mjs
$ pnpm typecheck
==> pnpm-typecheck
$ pnpm run --filter {./packages/**} typecheck
Scope: 33 of 62 workspace projects
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
.../plugins/awcms-micro-website-social typecheck$ tsc --noEmit -p tsconfig.json
packages/plugins/awcms-micro-gallery typecheck: Done
packages/plugins/color typecheck$ tsgo --noEmit
packages/plugins/color typecheck: Done
packages/plugins/embeds typecheck$ tsgo --noEmit
packages/plugins/embeds typecheck: Done
packages/plugins/field-kit typecheck$ tsgo --noEmit
packages/plugins/awcms-micro-docs typecheck: Done
packages/plugins/forms typecheck$ tsgo --noEmit
.../plugins/awcms-micro-website-social typecheck: Done
packages/plugins/marketplace-test typecheck$ tsgo --noEmit
packages/plugins/field-kit typecheck: Done
packages/plugins/sandboxed-test typecheck$ tsgo --noEmit
packages/plugins/marketplace-test typecheck: Done
packages/plugins/webhook-notifier typecheck$ tsgo --noEmit
packages/plugins/sandboxed-test typecheck: Done
packages/workerd typecheck$ tsgo --noEmit
packages/plugins/webhook-notifier typecheck: Done
packages/plugins/forms typecheck: Done
packages/workerd typecheck: Done
packages/plugins/awcms-micro-sikesra typecheck: Done
$ pnpm lint:quick
==> pnpm-lint-quick
$ oxlint -f json
{ "diagnostics": [{"message": "Function 'inferVerifierLevel' is declared but never used.","code": "eslint(no-unused-vars)","severity": "warning","causes": [],"url": "https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unused-vars.html","help": "Consider removing this declaration.","filename": "packages/plugins/awcms-micro-sikesra/src/runtime.ts","labels": [{"label": "'inferVerifierLevel' is declared here","span": {"offset": 59262,"length": 18,"line": 2015,"column": 10}}],"related": []}],
              "number_of_files": 2019,
              "number_of_rules": 138,
              "threads_count": 20,
              "start_time": 2.185132174
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
   Start at  21:31:44
   Duration  1.29s (transform 241ms, setup 0ms, import 1.17s, tests 17ms, environment 0ms)

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
   Start at  21:31:47
   Duration  2.48s (transform 1.19s, setup 0ms, import 2.37s, tests 10ms, environment 0ms)

$ vitest run tests/plugin.test.ts -t 'declares admin pages'

 RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-sikesra


 Test Files  1 passed (1)
      Tests  1 passed | 144 skipped (145)
   Start at  21:31:50
   Duration  2.70s (transform 1.32s, setup 0ms, import 2.59s, tests 4ms, environment 0ms)

$ tsc --noEmit -p tsconfig.json
$ vitest run

 RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-sikesra


 Test Files  7 passed (7)
      Tests  206 passed (206)
   Start at  21:31:59
   Duration  2.85s (transform 2.93s, setup 0ms, import 6.28s, tests 424ms, environment 1ms)

$ tsdown
[34mℹ[39m tsdown [2mv0.20.3[22m powered by rolldown [2mv1.0.0-rc.3[22m
[34mℹ[39m config file: [4m/home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/tsdown.config.ts[24m
[34mℹ[39m entry: [34msrc/index.ts, src/admin.tsx, src/navigation.ts, src/sandbox.ts[39m
[34mℹ[39m target: [34mes2023[39m
[34mℹ[39m tsconfig: [34mtsconfig.json[39m
[34mℹ[39m Build start
[34mℹ[39m Cleaning 11 files
[34mℹ[39m [2mdist/[22m[1madmin.js[22m                           [2m360.78 kB[22m [2m│ gzip: 54.33 kB[22m
[34mℹ[39m [2mdist/[22m[1mindex.js[22m                           [2m  2.79 kB[22m [2m│ gzip:  0.99 kB[22m
[34mℹ[39m [2mdist/[22m[1mnavigation.js[22m                      [2m  0.78 kB[22m [2m│ gzip:  0.32 kB[22m
[34mℹ[39m [2mdist/[22m[1msandbox.js[22m                         [2m  0.30 kB[22m [2m│ gzip:  0.21 kB[22m
[34mℹ[39m [2mdist/[22mruntime-5dclkDQF.js                [2m381.89 kB[22m [2m│ gzip: 77.95 kB[22m
[34mℹ[39m [2mdist/[22mfield-standards-DPRMDU-F.js        [2m 30.46 kB[22m [2m│ gzip:  5.13 kB[22m
[34mℹ[39m [2mdist/[22mAwcmsPluginHeaderMenu-V7ITPBZD.js  [2m 13.98 kB[22m [2m│ gzip:  3.29 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mindex.d.ts[22m[39m                         [2m  7.29 kB[22m [2m│ gzip:  1.91 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1mnavigation.d.ts[22m[39m                    [2m  6.04 kB[22m [2m│ gzip:  1.38 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1madmin.d.ts[22m[39m                         [2m  3.20 kB[22m [2m│ gzip:  1.04 kB[22m
[34mℹ[39m [2mdist/[22m[32m[1msandbox.d.ts[22m[39m                       [2m  2.23 kB[22m [2m│ gzip:  0.50 kB[22m
[34mℹ[39m 11 files, total: 809.74 kB
[32m✔[39m Build complete in [32m2591ms[39m
$ pnpm --filter @emdash-cms/admin exec node --run locale:compile
==> pnpm-admin-locale-compile
Compiling message catalogs…
Done in 534ms
$ pnpm --filter @emdash-cms/admin exec playwright install chromium
==> playwright-install-chromium
BEWARE: your OS is not officially supported by Playwright; downloading fallback build for ubuntu24.04-x64.
BEWARE: your OS is not officially supported by Playwright; downloading fallback build for ubuntu24.04-x64.
BEWARE: your OS is not officially supported by Playwright; downloading fallback build for ubuntu24.04-x64.
$ pnpm test
==> pnpm-test
$ pnpm run --filter {./packages/*} test
Scope: 17 of 62 workspace projects
packages/atproto-test-utils test$ vitest run
packages/auth test$ vitest
packages/blocks test$ vitest
packages/contentful-to-portable-text test$ vitest
packages/contentful-to-portable-text test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/contentful-to-portable-text
packages/auth test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/auth
packages/blocks test: 9:32:08 PM [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
packages/blocks test: `optimizeDeps.rollupOptions` / `ssr.optimizeDeps.rollupOptions` is deprecated. Use `optimizeDeps.rolldownOptions` instead. Note that this option may be set by a plugin. Set VITE_DEPRECATION_TRACE=1 to see where it is called.
packages/atproto-test-utils test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/atproto-test-utils
packages/blocks test: Both esbuild and oxc options were set. oxc options will be used and esbuild options will be ignored. The following esbuild options were set: `{ jsx: 'automatic', jsxImportSource: undefined }`
packages/blocks test: [vite:react-babel] We recommend switching to `@vitejs/plugin-react-oxc` for improved performance. More information at https://vite.dev/rolldown
packages/blocks test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/blocks
packages/contentful-to-portable-text test:  Test Files  2 passed (2)
packages/contentful-to-portable-text test:       Tests  60 passed (60)
packages/contentful-to-portable-text test:    Start at  21:32:08
packages/contentful-to-portable-text test:    Duration  322ms (transform 213ms, setup 0ms, import 307ms, tests 37ms, environment 0ms)
packages/contentful-to-portable-text test: Done
packages/create-emdash test$ vitest run
packages/auth test:  Test Files  5 passed (5)
packages/auth test:       Tests  57 passed (57)
packages/auth test:    Start at  21:32:08
packages/auth test:    Duration  355ms (transform 268ms, setup 0ms, import 559ms, tests 332ms, environment 1ms)
packages/auth test: Done
packages/gutenberg-to-portable-text test$ vitest
packages/atproto-test-utils test:  Test Files  1 passed (1)
packages/atproto-test-utils test:       Tests  17 passed (17)
packages/atproto-test-utils test:    Start at  21:32:08
packages/atproto-test-utils test:    Duration  589ms (transform 106ms, setup 0ms, import 298ms, tests 176ms, environment 0ms)
packages/atproto-test-utils test: Done
packages/marketplace test$ vitest
packages/create-emdash test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/create-emdash
packages/gutenberg-to-portable-text test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/gutenberg-to-portable-text
packages/create-emdash test:  Test Files  2 passed (2)
packages/create-emdash test:       Tests  103 passed (103)
packages/create-emdash test:    Start at  21:32:08
packages/create-emdash test:    Duration  239ms (transform 83ms, setup 0ms, import 168ms, tests 38ms, environment 0ms)
packages/marketplace test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/marketplace
packages/create-emdash test: Done
packages/plugin-types test$ vitest run
packages/gutenberg-to-portable-text test:  Test Files  2 passed (2)
packages/gutenberg-to-portable-text test:       Tests  140 passed (140)
packages/gutenberg-to-portable-text test:    Start at  21:32:08
packages/gutenberg-to-portable-text test:    Duration  354ms (transform 156ms, setup 0ms, import 249ms, tests 89ms, environment 0ms)
packages/blocks test:  Test Files  3 passed (3)
packages/blocks test:       Tests  97 passed (97)
packages/blocks test:    Start at  21:32:08
packages/blocks test:    Duration  1.01s (transform 441ms, setup 0ms, import 962ms, tests 246ms, environment 1.03s)
packages/gutenberg-to-portable-text test: Done
packages/registry-lexicons test$ vitest run
packages/blocks test: Done
packages/x402 test$ vitest
packages/marketplace test:  Test Files  4 passed (4)
packages/marketplace test:       Tests  43 passed (43)
packages/marketplace test:    Start at  21:32:08
packages/marketplace test:    Duration  206ms (transform 165ms, setup 0ms, import 242ms, tests 39ms, environment 0ms)
packages/plugin-types test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugin-types
packages/marketplace test: Done
packages/registry-lexicons test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-lexicons
packages/x402 test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/x402
packages/plugin-types test:  Test Files  2 passed (2)
packages/plugin-types test:       Tests  27 passed (27)
packages/plugin-types test:    Start at  21:32:09
packages/plugin-types test:    Duration  157ms (transform 42ms, setup 0ms, import 62ms, tests 13ms, environment 0ms)
packages/plugin-types test: Done
packages/registry-lexicons test:  Test Files  1 passed (1)
packages/registry-lexicons test:       Tests  10 passed (10)
packages/registry-lexicons test:    Start at  21:32:09
packages/registry-lexicons test:    Duration  229ms (transform 80ms, setup 0ms, import 128ms, tests 8ms, environment 0ms)
packages/x402 test:  Test Files  1 passed (1)
packages/x402 test:       Tests  17 passed (17)
packages/x402 test:    Start at  21:32:09
packages/x402 test:    Duration  230ms (transform 67ms, setup 0ms, import 76ms, tests 59ms, environment 0ms)
packages/x402 test: Done
packages/registry-lexicons test: Done
packages/registry-client test$ vitest run
packages/registry-client test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/registry-client
packages/registry-client test:  Test Files  4 passed (4)
packages/registry-client test:       Tests  70 passed (70)
packages/registry-client test:    Start at  21:32:09
packages/registry-client test:    Duration  275ms (transform 214ms, setup 0ms, import 380ms, tests 107ms, environment 0ms)
packages/registry-client test: Done
packages/admin test$ vitest
packages/plugin-cli test$ vitest run
packages/admin test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin
packages/plugin-cli test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/plugin-cli
packages/admin test: Loaded  vitest@4.1.5  and  @vitest/browser@4.1.7 .
packages/admin test: Running mixed versions is not supported and may lead into bugs
packages/admin test: Update your dependencies and make sure the versions match.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/components/RevisionHistory.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/editor/bubble-menu.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/editor/slash-menu.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/editor/toolbar.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/components/settings/AllowedDomainsSettings.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/plugin-cli test:  Test Files  20 passed (20)
packages/plugin-cli test:       Tests  391 passed (391)
packages/plugin-cli test:    Start at  21:32:10
packages/plugin-cli test:    Duration  11.84s (transform 4.24s, setup 0ms, import 7.93s, tests 11.84s, environment 2ms)
packages/plugin-cli test: Done
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/editor/block-menu.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/components/users/InviteUserModal.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/components/users/UserDetail.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  DEPRECATED  /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/admin/tests/lib/hooks.test.tsx tries to load a deprecated "@vitest/browser/context" module. This import will stop working in the next major version. Please, use "vitest/browser" instead.
packages/admin test:  Test Files  79 passed (79)
packages/admin test:       Tests  987 passed (987)
packages/admin test:    Start at  21:32:10
packages/admin test:    Duration  23.55s (transform 0ms, setup 6.79s, import 142.53s, tests 71.05s, environment 0ms)
packages/admin test: Done
packages/auth-atproto test$ vitest run
packages/core test$ vitest
packages/core test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/core
packages/auth-atproto test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/auth-atproto
packages/auth-atproto test:  Test Files  3 passed (3)
packages/auth-atproto test:       Tests  27 passed (27)
packages/auth-atproto test:    Start at  21:32:34
packages/auth-atproto test:    Duration  398ms (transform 345ms, setup 0ms, import 503ms, tests 169ms, environment 0ms)
packages/auth-atproto test: Done
packages/core test:  Test Files  249 passed (249)
packages/core test:       Tests  3774 passed (3774)
packages/core test:    Start at  21:32:34
packages/core test:    Duration  18.17s (transform 27.78s, setup 0ms, import 123.81s, tests 166.86s, environment 34ms)
packages/core test: Done
packages/cloudflare test$ vitest run
packages/workerd test$ vitest run
packages/cloudflare test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/cloudflare
packages/workerd test:  RUN  v4.1.5 /home/data/dev_react/awcms-micro/awcmsmicro-dev/packages/workerd
packages/cloudflare test:  Test Files  8 passed (8)
packages/cloudflare test:       Tests  155 passed (155)
packages/cloudflare test:    Start at  21:32:52
packages/cloudflare test:    Duration  316ms (transform 415ms, setup 0ms, import 768ms, tests 96ms, environment 1ms)
packages/cloudflare test: Done
packages/workerd test:  Test Files  11 passed (11)
packages/workerd test:       Tests  73 passed (73)
packages/workerd test:    Start at  21:32:52
packages/workerd test:    Duration  9.38s (transform 6.44s, setup 0ms, import 12.01s, tests 8.95s, environment 1ms)
packages/workerd test: Done
```
