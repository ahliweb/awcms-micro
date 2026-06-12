---
"@awcms-micro/template-default-cloudflare": patch
"@awcms-micro/template-default-example": patch
---

Fix CMS content localization on `/id/` routes (issue #200). Pass `locale: currentLocale` to every `getEmDashCollection` and `getEmDashEntry` call in both templates so collection queries respect the active locale set by the middleware (`Astro.locals.awcmsLocale`). Previously all collection pages (posts, news, pages, galleries, services, portfolio, testimonials) returned English content on `/id/` routes because EmDash middleware strips the `/id/` prefix before the ALS locale is resolved; the fix is explicit locale forwarding at the query level. The locale computation is now always moved before the collection/entry fetch so the value is available.
