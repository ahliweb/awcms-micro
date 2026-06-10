# AWCMS-Micro Divergence Log

This log tracks downstream SIKESRA and AWCMS-Micro behavior that intentionally differs from upstream EmDash while staying inside approved downstream boundaries.

## Plugin Registration Matrix

| Plugin | Source | Local template | Cloudflare template |
| ------ | ------ | -------------- | ------------------- |
| `awcms-micro-docs` | `packages/plugins/awcms-micro-docs/` | ✓ | ✓ |
| `awcms-email-mailketing` | `packages/plugins/awcms-micro-email-mailketing/` | ✓ | ✓ |
| `awcms-micro-gallery` | `packages/plugins/awcms-micro-gallery/` | ✓ | ✓ |
| `awcms-micro-website-social` | `packages/plugins/awcms-micro-website-social/` | ✓ | ✓ |
| `awcms-micro-sikesra` | `packages/plugins/awcms-micro-sikesra/` | ✓ | ✓ |

## Current SIKESRA Downstream Boundaries

- SIKESRA plugin source: `packages/plugins/awcms-micro-sikesra/`
- Local template registration: `templates/awcms-micro-default/`
- Cloudflare template registration: `templates/awcms-micro-default-cloudflare/`
- AWCMS-Micro docs boundary: `docs/awcms-micro/`

## Active Divergence Notes

- SIKESRA registers as a downstream plugin through normal EmDash plugin configuration; EmDash core is not modified.
- SIKESRA D1 tables and migrations use `sikesra_` prefixes and are owned by the plugin boundary.
- SIKESRA keeps temporary plugin-storage compatibility collections until runtime-state migration to dedicated D1 tables is complete.
- Development-only route fixtures may send `X-Sikesra-User-*` headers, but production runtime must not trust those headers as identity.

## Required Update Rule

Update this log when a sync pass introduces a new downstream patch, persistent compatibility workaround, or intentional AWCMS-Micro behavior that must survive future EmDash rebuilds.
