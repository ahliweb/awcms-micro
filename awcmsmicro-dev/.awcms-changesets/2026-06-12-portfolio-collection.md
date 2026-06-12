---
"@awcms-micro/template-default-cloudflare": minor
"@awcms-micro/template-default-example": minor
---

Add an admin-editable `portfolio` EmDash collection to both default templates, seeded with the ahliweb.com (ahliwebcom) client project list (13 completed + 4 in-development) in EN and ID. Adds a `PortfolioCard` public component, a `/portfolio` index page that groups items by stage with locale-aware category labels and external project links, and a homepage portfolio teaser section sourced from the collection. Extends the public design system and i18n catalogs accordingly (also syncs pre-existing PO catalog drift in the Cloudflare template).
