# Plugin Notes

## Scope

This package demonstrates how AWCMS-Micro can add a trusted example plugin without changing EmDash core or modifying built-in plugin packages.

## Highlights

- tenant-ready naming examples in storage path guidance
- namespaced permissions under `awcms:example:*`
- isolated route and admin examples
- simple audit logging helper
- EmDash registry manifest in `emdash-plugin.jsonc`

## Safe Enablement

Add the plugin from project-level configuration only. Do not hardcode it into EmDash core registries.

This example package now uses published dependency versions and a local build step so it can be copied into a standalone repository or local package workspace without rewriting monorepo-only specifiers.

Replace the example publisher value in `emdash-plugin.jsonc` with the real atproto DID or handle before any internal or registry publish.
If you move the package into its own repository, also set `repository` and `homepage` in `package.json` for your new location.
Add `repo` and `security` to `emdash-plugin.jsonc` only after you know the final standalone repository and security contact URLs.

Use `docs/INTERNAL_PUBLISH_CHECKLIST.md` before any internal or registry release.
Use `docs/MANIFEST_METADATA_EXAMPLES.md` for ready-to-copy `repo` and `security` examples.
The default flow is to edit `emdash-plugin.jsonc` in place.
Use `docs/emdash-plugin.template.jsonc` only when you want to replace it with a fresh checklist-oriented starting point.
