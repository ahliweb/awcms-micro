---
"@awcms-micro/template-default-cloudflare": minor
"@awcms-micro/template-default-example": minor
---

Add legal pages as EN/ID CMS `pages` entries and wire all legal links in the footer (issue #191). Twelve new seed entries cover privacy, terms, aup, sla, perjanjian-layanan, and kebijakan-smki in both English and Indonesian. The footer Company column now links all six legal pages and is locale-aware (using `toLocalePath`) for `/about`, `/privacy`, `/terms`, `/aup`, `/sla`, `/perjanjian-layanan`, and `/kebijakan-smki`. Four new i18n keys (`footerLinkAup`, `footerLinkSla`, `footerLinkPerjanjian`, `footerLinkSmki`) added to EN + ID `.po` catalogs and `messages.ts` in both templates.
