---
"@awcms-micro/template-default-cloudflare": minor
"@awcms-micro/template-default-example": minor
---

Adopt the ahliweb.com (ahliwebcom) public-page architecture across both default templates while preserving all existing content and EmDash admin integration. Adds a shared public design system (`src/styles/public.css`), ported public components (`HeroGraphic`, `SectionHeading`, `ServiceCard`, `TestimonialCard`, `FaqItem`), and a client-side Mermaid initializer in the base layout for CMS PortableText diagrams. Introduces an admin-editable `services` EmDash collection (SEO + url pattern) seeded with ten bilingual (EN/ID) services ported from ahliwebcom, plus `/services` index and `/services/[slug]` detail pages and a homepage services section sourced from the collection. The `services` collection flows into the auto-injected `/sitemap.xml`.
