# Plugin Notes

## Scope

This package demonstrates how AWCMS-Micro can add a trusted example plugin without changing EmDash core or modifying built-in plugin packages.

## Highlights

- tenant-ready naming examples in storage path guidance
- namespaced permissions under `awcms:example:*`
- isolated route and admin examples
- simple audit logging helper

## Safe Enablement

Add the plugin from project-level configuration only. Do not hardcode it into EmDash core registries.

This example package currently assumes the EmDash monorepo workspace dependency model.
