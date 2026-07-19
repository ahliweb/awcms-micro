import type { APIRoute } from "astro";

import { serveActiveThemeTokensCss } from "../../lib/theming/theme-public-css";

/**
 * `GET /theming/tokens.css` (Issue #269, ADR-0029 §7) — the active published
 * theme's design-token custom properties for the request's host-resolved tenant,
 * as an EXTERNAL same-origin `text/css` stylesheet the public layout links (never
 * an inline `<style>`, so the app's CSP `style-src 'self'` is never weakened).
 *
 * Always a valid 200/304 (default theme tokens when no tenant/active theme
 * resolves), so there is no host-enumeration oracle. Unauthenticated by design (a
 * public presentation asset, like `/robots.txt`); tenant/host resolution + the
 * `theming`-enabled gate + cache validators live in `serveActiveThemeTokensCss`.
 */
export const GET: APIRoute = ({ request }) =>
  serveActiveThemeTokensCss(request);
