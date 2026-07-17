---
"awcms-micro": minor
---

Add `application/pdf` as an operator-opt-in media type (ADR-0026 step 5c) — the first non-image type the media library can store.

The work is in the **sniffer**, not the config allow-list. `media-mime-sniffer.ts` gains a `%PDF-` signature, `MIME_TYPE_TO_EXTENSION` gains a reviewed `.pdf` mapping, and `NEWS_MEDIA_R2_KNOWN_MIME_TYPES` gains the type so `config:validate` accepts it. Three sets that used to be identical are now deliberately different: what the sniffer recognizes (5 types), what a deployment allows by default (the 4 rasters), and what an operator may legitimately opt into (6, including SVG). Conflating any two is a silent error in both directions — an allowed type with no signature is a no-op that rejects everything (which is what allow-listing `image/svg+xml` has always been), and recognizing a type must never mean every deployment starts accepting it on upgrade.

PDF is **opt-in, not default-allowed**, on the repo's own V14.3 terms ("konfigurasi aman by default"). Unlike SVG — which is excluded permanently, because an SVG served from a tenant's media domain executes its `<script>` in that origin — a PDF renders in the browser's sandboxed viewer and cannot script the linking page. What an operator accepts by opting in is stated plainly in the config and the architecture doc: a PDF can embed JavaScript and carry malware or phishing content, and MIME sniffing proves only that the bytes are a real PDF. `security:readiness` reports the opt-in via a new `checkNewsMediaR2DocumentTypesOptIn` (warning) so a go-live reviewer sees what the site accepts.

Corrects a comment in `news-portal`'s `ad-placement-policy.ts` that became false: its `allowedMediaTypes` check described itself as "currently redundant — a verified media object's mimeType is always one of these four". A deployment that opts into PDF can hold verified PDF objects, and `/admin/media` shows editors those ids — so the defense-in-depth machinery is now load-bearing, and is what keeps a PDF out of a live ad slot.

Also adds the first unit tests for `checkNewsMediaR2SvgNotAllowed`, which has been shipping untested since Issue #635.
