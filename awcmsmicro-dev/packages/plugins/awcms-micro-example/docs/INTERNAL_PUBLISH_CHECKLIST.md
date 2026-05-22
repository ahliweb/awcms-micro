# Internal Publish Checklist

Use this checklist before publishing `@awcms-micro/plugin-example` to an internal registry or distributing it as a reusable package.

## Identity

- Replace `publisher` in `emdash-plugin.jsonc` with the real atproto DID or handle that will own the release.
- Confirm `slug` is final and stable.
- Bump `version` in both `package.json` and `emdash-plugin.jsonc`.

## Package Metadata

- If the plugin lives in its own repository, set `repository` and `homepage` in `package.json`.
- If you want published manifest metadata for source and security review, add `repo` and `security` to `emdash-plugin.jsonc`.
- Confirm `license`, `author`, `name`, `description`, and `keywords` still match the package you are publishing.

## Trust Contract

- Review `capabilities` in `emdash-plugin.jsonc` and remove anything not strictly required.
- If `network:request` is used, set `allowedHosts` to the smallest correct allow-list.
- Keep `storage` aligned with the plugin's real runtime collections and indexes.
- Re-check admin pages and icons in `emdash-plugin.jsonc` against the current plugin UI.

## Build And Test

- Run `pnpm install`.
- Run `pnpm typecheck`.
- Run `pnpm test`.
- Run `pnpm build` and confirm `dist/` is regenerated.

## Distribution Review

- Confirm published files are limited to `dist/`, `emdash-plugin.jsonc`, `docs/`, and `README.md`.
- Confirm `main`, `types`, and `exports` in `package.json` point only to built `dist/` files.
- Confirm no monorepo-only specifiers remain in `package.json`.

## Final Sanity Check

- Read `README.md` as if you were consuming the plugin from another repository.
- Verify placeholder values are gone.
- Verify the manifest comments still describe the package accurately.
