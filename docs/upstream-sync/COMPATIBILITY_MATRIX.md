# Compatibility Matrix

This matrix compares upstream EmDash features with AWCMS-Micro usage decisions.

## Current Position

AWCMS-Micro currently adopts upstream EmDash core directly and keeps downstream behavior in isolated plugin, template, documentation, demo, and validation surfaces.

| EmDash upstream feature | AWCMS-Micro usage | Compatibility status | Risk | Action |
| --- | --- | --- | --- | --- |
| Core content modeling and runtime | Adopt directly through upstream sync | Compatible | Low | adopt |
| Built-in templates | Preserve unchanged; do not modify in place | Compatible | Low | adopt |
| Built-in plugin packages | Preserve unchanged; do not modify in place | Compatible | Low | adopt |
| Parent repository governance docs | Root-only AWCMS-Micro documentation layer | Compatible | Low | adapt |
| `templates/awcms-micro-default` | Isolated Node/SQLite reference template | Compatible | Low | adapt |
| `templates/awcms-micro-default-cloudflare` | Isolated Cloudflare reference template with plugin wiring | Compatible | Medium | adapt |
| `packages/plugins/awcms-micro-example` | Isolated example plugin carrying AWCMS-Micro navigation and governance overlays | Compatible | Medium | adapt |
| `packages/plugins/awcms-micro-gallery` | Isolated gallery/media plugin with template-owned rendering | Compatible | Medium | adapt |
| Plugin-owned navigation compatibility layer | Keep navigation normalization and label resolution in plugin exports rather than a new shared core layer | Compatible | Medium | adapt |
| Supporting docs, demos, and E2E boundaries | Keep as validation and operator surfaces only | Compatible | Low | adapt |
| Cloudflare deployment overlays | Document as environment-specific deployment guidance | Compatible | Medium | adapt |
| Compliance and security baselines | Document as operational guidance rather than core changes | Compatible | Low | adapt |

## Usage Notes

- `adopt` means AWCMS-Micro uses upstream behavior directly.
- `adapt` means AWCMS-Micro adds isolated examples or documentation without changing EmDash core.
- `delay` means the feature should be reviewed later.
- `reject` means the feature is intentionally out of scope.
