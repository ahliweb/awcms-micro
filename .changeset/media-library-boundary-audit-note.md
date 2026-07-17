---
"awcms-micro": patch
---

Record the cross-module import audit findings in `media_library`'s README as supporting evidence for the ADR-0026 extraction: `social_publishing`'s documented narrow exception to reach `news-portal/domain/news-media-r2-config` exists only because media config is misfiled, and `module-boundary.test.ts` scans only the `blog_content` ↔ `news_portal` pair so it never sees that edge.
