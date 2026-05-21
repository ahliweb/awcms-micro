# Compatibility Matrix

This matrix compares upstream EmDash features with AWCMS-Micro usage decisions.

| EmDash upstream feature | AWCMS-Micro usage | Compatibility status | Risk | Action |
| --- | --- | --- | --- | --- |
| Core content modeling and runtime | Adopt directly through upstream sync | Compatible | Low | adopt |
| Built-in templates | Preserve unchanged; do not modify in place | Compatible | Low | adopt |
| Built-in plugin packages | Preserve unchanged; do not modify in place | Compatible | Low | adopt |
| Parent repository governance docs | Root-only AWCMS-Micro documentation layer | Compatible | Low | adapt |
| AWCMS-Micro example template | Add as a new isolated example template folder | Compatible | Low | adapt |
| AWCMS-Micro example plugin | Add as a new isolated example plugin package | Compatible | Medium | adapt |
| Cloudflare deployment overlays | Document as environment-specific deployment guidance | Compatible | Medium | adapt |
| Compliance and security baselines | Document as operational guidance rather than core changes | Compatible | Low | adapt |

## Usage Notes

- `adopt` means AWCMS-Micro uses upstream behavior directly.
- `adapt` means AWCMS-Micro adds isolated examples or documentation without changing EmDash core.
- `delay` means the feature should be reviewed later.
- `reject` means the feature is intentionally out of scope.
