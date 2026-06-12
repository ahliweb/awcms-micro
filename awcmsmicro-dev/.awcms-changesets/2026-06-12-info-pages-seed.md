---
"@awcms-micro/template-default-cloudflare": minor
"@awcms-micro/template-default-example": minor
---

Add info pages as EN/ID CMS `pages` seed entries (issue #190). Eight new entries cover contact, hiring, knowledgebase, and payment in both English and Indonesian. The existing `about` page was already seeded. All pages render via `[slug].astro` with PortableText content and full SEO metadata. Pages are accessible at `/contact`, `/hiring`, `/knowledgebase`, and `/payment` and can be linked from admin-managed navigation menus.
