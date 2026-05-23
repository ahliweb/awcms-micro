# AWCMS-Micro Gallery Plugin

This plugin adds AWCMS-Micro gallery management helpers while leaving EmDash core untouched.

- Public rendering lives in the AWCMS-Micro Astro templates.
- The `galleries` collection is seeded through the template seed file.
- The plugin provides settings, public list, media validation, and audit-ready hooks under `/_emdash/api/plugins/awcms-micro-gallery/*`.
- Cloudflare R2 remains the canonical media store. Cloudflare Images and Stream are optional flags, not hardcoded secrets.

Routes:

- `GET /_emdash/api/plugins/awcms-micro-gallery/settings`
- `POST /_emdash/api/plugins/awcms-micro-gallery/settings`
- `GET /_emdash/api/plugins/awcms-micro-gallery/public/list`
- `POST /_emdash/api/plugins/awcms-micro-gallery/media/validate`

The admin page is rendered through EmDash Block Kit at the plugin's `Gallery` admin page.
