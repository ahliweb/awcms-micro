# AWCMS-Micro Navigation Standard

This document records the upstream-safe navigation pattern for AWCMS-Micro.

## Rules

- Public nested navigation belongs in the template layer.
- Plugin nested navigation belongs inside the plugin page itself.
- EmDash admin sidebar stays native, flat, and unchanged.
- Navigation filtering is UX only; backend authorization still enforces access.

## Public Template

- Use EmDash `getMenu("primary")`.
- Render recursive submenu items.
- Keep active state, focus state, and mobile layout accessible.
- Keep local and Cloudflare templates behaviorally aligned.

## Plugin Example

- Use a plugin-owned header menu model.
- Filter menu items by permission or ABAC hints.
- Use tabs, cards, link groups, or breadcrumbs when dropdowns are not a good fit.
- Do not patch the EmDash sidebar for plugin navigation.

## Reference-Only SIKESRA Style

- Use SIKESRA-style labels only as example content.
- Keep public pages aggregate-safe.
- Keep sensitive or restricted data out of unauthorized navigation.

## Downstream Use

Downstream product repos such as `ahliweb/sikesra` can adopt the same layered pattern without carrying this repo's example data verbatim.
