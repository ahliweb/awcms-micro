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

## Mailketing Plugin Integration Notes

The `awcms-email-mailketing` plugin integrates with the Mailketing.co.id transactional email API. These details are AWCMS-Micro-specific and must survive future EmDash syncs:

- **API base**: `https://api.mailketing.co.id` (the `api.` subdomain — NOT the main site `mailketing.co.id`)
- **Auth**: `api_token` field in the form-encoded request body — NOT an `Authorization: Bearer` header
- **Content-Type**: `application/x-www-form-urlencoded`
- **Key request fields**: `recipient`, `from_email`, `from_name`, `subject`, `content`
- **allowedHosts**: `["api.mailketing.co.id"]` — must match the actual API subdomain
- **Dashboard widgets**: plugin exports both `pages` and `widgets` named exports from `admin.tsx`; widget IDs `email-status` and `send-stats` match `AWCMS_MAILKETING_ADMIN_WIDGETS` in `runtime.ts`
- **`testConnection` probe**: detects invalid tokens from API response body (`"Wrong API Token"` / `"Invalid Token"` strings), not HTTP 401; detects server errors via HTTP 5xx

## Social Sharing / OG Meta Tag Notes

Both templates override EmDashHead's OG image behavior for improved social sharing compatibility:

- **`og-image.png`**: A real PNG (1200×630) generated via ImageMagick — gradient `#0ea5e9→#6366f1` with logo + site name. Used as fallback when neither a page-level `image` prop nor a CMS `defaultOgImage` is configured. Files: `templates/*/public/og-image.png`.
- **`og:url` always set**: Layouts pass `canonical || Astro.url.href` to `createPublicPageContext` so `og:url` is always emitted even when no explicit `canonical` prop is provided. Without this, WhatsApp shows only the raw domain instead of title/image.
- **`twitter:card` hardcoded to `summary_large_image`**: Since a fallback image is always guaranteed, the card type is always large image.
- **Image format rule**: OG fallback image must be a real PNG (magic bytes `89504e47`). `dashboard_mockup.png` and `network_showcase.png` in `public/` are JPEG files misnamed as `.png` — do NOT use them as `og:image` fallback. Only `og-image.png` and `awcms-logo.png` are true PNGs.
- **Duplicate meta tags**: `<meta name="description">` and `<meta name="twitter:card">` appear twice in rendered HTML — once from the layout's own `<head>` (early-guarantee) and once from EmDashHead. Both have identical values; first occurrence wins in all major scrapers.

## Required Update Rule

Update this log when a sync pass introduces a new downstream patch, persistent compatibility workaround, or intentional AWCMS-Micro behavior that must survive future EmDash rebuilds.
