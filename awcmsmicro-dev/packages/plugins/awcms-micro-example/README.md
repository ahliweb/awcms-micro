# AWCMS-Micro Example Plugin

This package is an AWCMS-Micro example plugin that demonstrates an EmDash-compatible plugin without modifying EmDash core.

## What It Demonstrates

- plugin descriptor factory
- manifest-style metadata in `module.manifest.json`
- admin page export example
- API route example
- permissions constants and namespace pattern
- audit logging example
- tenant-ready storage naming examples

## Permission Namespace

The example uses the `awcms:example:<resource>:<action>` namespace.

## Safe Enablement

This plugin is intentionally not registered globally in EmDash core. Enable it from a compatible project through the normal `plugins: []` configuration path.
