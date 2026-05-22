# AWCMS-Micro Example Plugin

This package is an AWCMS-Micro example plugin that demonstrates an EmDash-compatible plugin without modifying EmDash core.

## What It Demonstrates

- plugin descriptor factory
- EmDash registry manifest scaffolding in `emdash-plugin.jsonc`
- admin page export example
- API route example
- permissions constants and namespace pattern
- audit logging example
- tenant-ready storage naming examples

## Permission Namespace

The example uses the `awcms:example:<resource>:<action>` namespace.

## Safe Enablement

This plugin is intentionally not registered globally in EmDash core. Enable it from project-level configuration through the normal `plugins: []` configuration path.

## Standalone Usage

1. Copy this folder into its own repository or into a local packages directory in your project.
2. Run `pnpm install` in the plugin repository, or from the workspace root if you placed it inside a pnpm workspace.
3. Run `pnpm build` to produce the `dist/` output.
4. Review `emdash-plugin.jsonc` and replace the example publisher with the real atproto DID or handle before publishing. DID is preferred; handle is also accepted.
5. If you want repository or security metadata in the published manifest, add your own `repo` and `security` fields to `emdash-plugin.jsonc` before publishing.
6. Set `repository` and `homepage` metadata in `package.json` to match the real source location before publishing, including monorepo subdirectory metadata when applicable.
7. Reference the plugin from your EmDash project as a local package or publish it to your own registry.

The package now uses published dependency versions, a local TypeScript toolchain, and a local `tsdown` build so it can be developed and packaged outside this monorepo.

For a release-oriented pass, use `docs/INTERNAL_PUBLISH_CHECKLIST.md`.
For concrete `repo` and `security` snippets, use `docs/MANIFEST_METADATA_EXAMPLES.md`.
For completed scenario-based manifests, use `docs/FINAL_MANIFEST_EXAMPLES.md`.
The default flow is to update the checked-in `emdash-plugin.jsonc` in place.
If you want a fresh starting point for registry metadata, copy `docs/emdash-plugin.template.jsonc` over `emdash-plugin.jsonc` first, then adapt it for your release.
