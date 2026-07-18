# Changelog

## [0.3.1]

### Patch Changes

- Fix `bun run changeset:version` to always produce a bracketed `## [X.Y.Z]` CHANGELOG heading, matching this repo's documented Keep a Changelog convention and `scripts/release-verify.ts`'s enforcement of it.

  `@changesets/cli` itself always writes a bare `## X.Y.Z` heading — the `changelog` entry in `.changeset/config.json` only shapes each entry's bullet body, not the heading, and nothing in this repo customized it. `release:verify` (correctly) rejects a bare heading, so the very first real tag-push release attempted for this repo (`v0.3.0`) failed at `release.yml`'s `validate` job before any image, SBOM, or GitHub Release was built — nothing was published, so per `release-process.md`'s rollback guidance the `v0.3.0` tag is left in place and this fix ships as `v0.3.1` instead of retagging.

  `changeset:version` now chains a new idempotent post-processing step (`scripts/changelog-heading-brackets.ts`) that brackets any bare version heading in `CHANGELOG.md`, including the pre-existing `## 0.3.0` entry from the failed release — so every future `changeset:version` run produces a `release:verify`-passing CHANGELOG automatically, instead of relying on a human remembering an extra manual step.

## [0.3.0]

### Minor Changes

- 8946e88: Add the media library admin browser at `/admin/media` (ADR-0026 step 5d) — the first UI for the media registry `media_library` owns, and this module's first `navigation` entry (gated on `media_library.media.read`, order 45).

  Lists every media object with its thumbnail, status, dimensions and — the point of the screen — its id, which `admin/news-portal/ad-placements.astro` previously required an editor to type as a UUID with no way to find it short of a database query. Filters by status/owner type/include-deleted, mirroring `GET /api/v1/media/objects`'s own defaults. Lifecycle actions (attach/detach/delete/restore/purge) call the real guarded endpoints with a fresh `Idempotency-Key` per attempt rather than reimplementing their rules in page frontmatter; a button renders only when the permission is held and the status admits the transition, which is UX courtesy on top of the server's enforcement, never instead of it.

  Also maps two error codes that were never translated: `NOT_FOUND` (used by 17 routes, 16 of which predate the media work — all of them previously fell through to an English-only raw message) and `INVALID_MEDIA_STATUS`. Unifying `NOT_FOUND` with the canonical `RESOURCE_NOT_FOUND` is deliberately left out — that changes 17 endpoints' response bodies and needs its own PR and OpenAPI diff.

- a365ba4: Add `application/pdf` as an operator-opt-in media type (ADR-0026 step 5c) — the first non-image type the media library can store.

  The work is in the **sniffer**, not the config allow-list. `media-mime-sniffer.ts` gains a `%PDF-` signature, `MIME_TYPE_TO_EXTENSION` gains a reviewed `.pdf` mapping, and `NEWS_MEDIA_R2_KNOWN_MIME_TYPES` gains the type so `config:validate` accepts it. Three sets that used to be identical are now deliberately different: what the sniffer recognizes (5 types), what a deployment allows by default (the 4 rasters), and what an operator may legitimately opt into (6, including SVG). Conflating any two is a silent error in both directions — an allowed type with no signature is a no-op that rejects everything (which is what allow-listing `image/svg+xml` has always been), and recognizing a type must never mean every deployment starts accepting it on upgrade.

  PDF is **opt-in, not default-allowed**, on the repo's own V14.3 terms ("konfigurasi aman by default"). Unlike SVG — which is excluded permanently, because an SVG served from a tenant's media domain executes its `<script>` in that origin — a PDF renders in the browser's sandboxed viewer and cannot script the linking page. What an operator accepts by opting in is stated plainly in the config and the architecture doc: a PDF can embed JavaScript and carry malware or phishing content, and MIME sniffing proves only that the bytes are a real PDF. `security:readiness` reports the opt-in via a new `checkNewsMediaR2DocumentTypesOptIn` (warning) so a go-live reviewer sees what the site accepts.

  Corrects a comment in `news-portal`'s `ad-placement-policy.ts` that became false: its `allowedMediaTypes` check described itself as "currently redundant — a verified media object's mimeType is always one of these four". A deployment that opts into PDF can hold verified PDF objects, and `/admin/media` shows editors those ids — so the defense-in-depth machinery is now load-bearing, and is what keeps a PDF out of a live ad slot.

  Also adds the first unit tests for `checkNewsMediaR2SvgNotAllowed`, which has been shipping untested since Issue #635.

- 6e10f12: Add the managed-media enforcement switch: `GET`/`POST /api/v1/media/enforcement` (ADR-0026 step 5a).

  Steps 3-4 made a brochure site (`blog_content` + `tenant_domain`, no news portal) able to have managed media architecturally, but left the flag writable only by `news_portal`'s R2-only preset — the operator had the capability and no button. This is the button, and it pays off the debt those steps recorded.

  - **`POST /api/v1/media/enforcement`** turns enforcement on for the caller's tenant, gated by the new `media_library.enforcement.enable` permission (`sql/079`) and a deployment-readiness check. Rejects `409 MANAGED_MEDIA_NOT_READY` (not 400) when the deployment's media storage is not configured — the request is fine; the deployment is what must change. Idempotent, no `Idempotency-Key` needed.
  - **`GET /api/v1/media/enforcement`** reports whether enforcement is active and, when it cannot be enabled, why — naming environment variables, never their values. Gated by `media_library.enforcement.read`.
  - **`enforcement` is a separate activity code from `media`**, deliberately: `media.*` governs individual objects, `enforcement.*` governs a tenant-wide content policy. Folding it into `media.create` would hand the policy switch to every editor who uploads images.

  **Enforcement is one-way and must stay one-way.** There is no `disable` action, no "unmark" function, and no code path that deletes from `awcms_micro_media_library_tenant_state`. This is a security property, not an unfinished API: `sql/043`'s header records that the earlier design was confirmed exploitable end-to-end precisely because a tenant could clear its own marker and silently switch off all of its media validation. Four independent guards pin this, verified to fail when a disable path is re-introduced. A deployment that must roll back changes its `NEWS_MEDIA_R2_*` config — an operator act outside the tenant's reach.

  Existing tenants do not retroactively gain the new permissions (the standard limitation of every permission-seed migration here); only tenants created after `sql/079` runs get them via setup.

- b51d1fa: Invert media capability ownership: `media_library` now provides the media port, and a site can have managed media without a news portal (ADR-0026 steps 3-4).

  The `news_media` capability is **retired**. `media_library` provides `media_library` (`_shared/ports/media-library-port.ts`) instead, and `news_portal` — which only ever provided the old one because the media registry happened to be born inside it — is now a consumer like `blog_content` and `social_publishing`.

  Steps 3 and 4 were planned separately but landed as one, because the coupling lived in the port CONTRACT rather than the adapter: `NewsMediaPort.isFullOnlineR2ModeActiveForTenant` asked a `news_portal` editorial question, so renaming the port without splitting the contract would have inverted nothing.

  - **Closes the product gap.** "Must this tenant's media references be registry-backed?" is now a media question, answered from `media_library`'s own readiness (`domain/managed-media-readiness.ts`) and its own per-tenant flag (`sql/078`). `news_portal`'s R2-only preset is one WRITER of that flag, not its owner — so a brochure site (`blog_content` + `tenant_domain`, no news portal) can have managed media, which was previously unreachable by construction.
  - **No enforcement is lost on deploy.** `sql/078` backfills from `awcms_micro_news_portal_tenant_state`, so every tenant that applied the R2-only preset keeps enforcement, with its original timestamp. Without the backfill this refactor would have silently switched media validation OFF for exactly the tenants who opted into it.
  - **Breaking for derived repositories** pinning the `news_media` capability: it is removed from `CAPABILITY_CONTRACT_VERSIONS` rather than MAJOR-bumped, so a stale pin fails to resolve outright instead of binding to a port that no longer asks what it asked.

  Still open (step 5): no `media_library`-owned preset/endpoint exists to turn the flag on, so a brochure site's operator has no button yet. That must not be solved via `awcms_micro_module_settings` — it is tenant-writable through a generic endpoint, which would let a tenant disable its own media validation.

- 002c653: ADR-0026 step 2: move the media registry, presigned upload flow, R2 config/client, verification, reconciliation, and the 9 media permissions out of `news_portal` and into `media_library`, which flips from `experimental` to `active`. Permission keys move from `news_portal.media.*` to `media_library.media.*` via `sql/077`, which repoints existing role grants rather than revoking them.
- 14233f3: Register the `media_library` module (ADR-0026 step 1 of 5) as the declared owner of the tenant media registry.

  Registered `experimental` and owning no code yet: the registry it will own still lives in `news_portal` until step 2. This is deliberate — it makes the ownership decision visible in the registry and gives the extraction a home, without claiming a capability that does not work yet.

- 5abaf4a: Add the media object lifecycle API — attach, detach, soft delete, restore, purge (ADR-0026 step 5). **All 9 media permissions are now reachable; the seeded-but-inert gap is closed.**

  `attach`, `detach`, `delete`, `restore`, and `purge` were declared and seeded by Issue #634 with working application functions behind them (Issue #633 built the whole directory) and no route, so granting one conferred nothing. They confer real authority now — a tenant that already granted `media_library.media.purge` gains real purge access with this release.

  - `POST /{id}/attach` — `verified -> attached`. Does not check the owning resource exists: `media_library` never reads another module's tables (ADR-0013 §6), and `ownerResourceId` is deliberately not a foreign key for the same reason.
  - `POST /{id}/detach` — `attached -> verified`. Its own permission, separate from `attach`: detaching strips an image from live content, so a role may add media without being allowed to remove it from a published article.
  - `DELETE /{id}` — soft delete, `reason` required (same convention as `DELETE /api/v1/blog/posts/{id}`). Deliberately does not detach first, so the owner reference survives and restore genuinely undoes the delete.
  - `POST /{id}/restore` — undoes a soft delete into the object's prior state.
  - `POST /{id}/purge` — irreversible, and requires a prior soft delete. Purge is not a shortcut for delete: two deliberate acts under two distinct permissions before anything becomes irreversible.

  **Purge does not delete the stored object, and cannot.** It drops the metadata row; the bytes are swept asynchronously by `news-media:r2:reconcile` once older than the orphan grace period. Deleting from R2 is a provider call and must never happen inside a DB transaction (ADR-0006) — the async sweep is the design this repo already chose, documented in `media-reconciliation-categorization.ts`. The object stays publicly reachable at its `publicUrl` until then; the OpenAPI says so plainly rather than implying otherwise.

  Wrong-state transitions return **409 naming the object's actual state, never 404** — telling a caller their object "does not exist" when it is merely already attached sends them looking in the wrong place. All mutating routes require `Idempotency-Key`.

  `AccessAction` gains `attach`/`detach`, following this repo's established "seed the permission first, add the action when a real endpoint needs it" pattern (`verify`, `set_primary`, `preview`). Neither is high-risk: each is reversible by its counterpart and touches no credential-bearing state.

- 7fac469: Add the media object read API — `GET /api/v1/media/objects` and `GET /api/v1/media/objects/{id}` (ADR-0026 step 5).

  These are the first routes to enforce `media_library.media.read`, which has been declared and seeded since Issue #634 while nothing checked it. A tenant that already granted `read` to a role gains real read access the moment this ships — the key was a contract waiting to be implemented, not a name being coined. `tests/unit/media-permission-reachability.test.ts` failed by name when this landed, exactly as designed, and now records that 4 of 9 media permissions are reachable (`attach`, `detach`, `delete`, `restore`, `purge` remain inert, each with a working application function and no route).

  - Bounded list (default 20, max 100), newest-first, soft-deleted excluded unless `includeDeleted=true`. Filters: `status`, `ownerResourceType` + `ownerResourceId` (the "which media is attached to this post?" lookup), all index-backed by `sql/041`.
  - Unknown filter values are a 400, never a silently-empty list — a typo must not read as "you have no media".
  - Responses omit `objectKey`/`bucketName`/`storageDriver`/`checksumSha256`: physical-storage detail no consumer needs, which would narrow the search space for anyone probing the bucket. `publicUrl` is the supported way to reach the bytes.
  - Another tenant's id returns 404, not 403 — a 403 would confirm the id exists.

  **Corrects ADR-0026's own evidence.** The ADR argued the registry was already generic by citing `module_key text NOT NULL DEFAULT 'news_portal'` as "a column with no reason to exist unless designed to serve multiple modules". That missed `sql/041`'s `CHECK (module_key = 'news_portal')`, which forbids every other value — and `createPendingNewsMediaObject` never sets the column, so every media object is stamped `news_portal` regardless of which module it serves. The real discriminator is `owner_resource_type`. The ADR's conclusion stands; its evidence is now accurate. `awcms-mini` carries the identical CHECK, so this is inherited upstream shape.

  Consequently the list offers no `moduleKey` filter: it could only ever match one value, and an API must not document a filter that lies. A new integration test pins the constraint against real PostgreSQL and fails if a future migration relaxes it, forcing whoever does so to state the new allowed set and restore the filter.

- 12622c9: Add responsive image `srcset` to public content rendering (ADR-0026 step 5b) — the last item on the media-library admission roadmap, and a standalone feature rather than debt repayment.

  The `srcset` is computed **purely at render time** through Cloudflare's on-the-fly image resizing (`/cdn-cgi/image/...`): no transcoder library, no stored variant objects, no async job, no new table. ADR-0026 §4/§5 originally sketched variants as a CLAIM/UPLOAD/FINALIZE job; step 5b deliberately takes the other road, recorded in the ADR. The trade — leaning on one provider's edge feature — is stated openly and made opt-in.

  The builder lives in `_shared/rendering/responsive-image.ts` (neutral ground, no I/O, imports neither module's `application`/`domain` tree) so both `blog_content` and `news_portal` public rendering call it without re-coupling — the same rule `gallery-block-renderer.ts` follows. `media-library/application/media-responsive-image.ts` is the single place that resolves the env config into the transform, so no public route re-derives when resizing is on.

  Eligibility is strict, because `/cdn-cgi/image/` is served by the zone transforming a source on the same zone: a URL is rewritten **only** when its origin matches the configured public base URL exactly (an external/legacy gallery `url` is left untouched) and its path ends in a resizable raster extension (`.jpg/.jpeg/.png/.webp`). `.gif` is excluded so an animated GIF is never silently de-animated to one frame; `.pdf`/`.svg` are not images. `fit=scale-down` never upscales a genuinely small original.

  Opt-in via `NEWS_MEDIA_R2_IMAGE_RESIZING_ENABLED` (default `false`), and the flag alone is not enough — it only works when `NEWS_MEDIA_R2_PUBLIC_BASE_URL` is a real custom domain on a Cloudflare zone with Image Resizing turned on. `security:readiness` gains `checkNewsMediaR2ImageResizingSafe` (warning) that flags the flag-on-but-base-URL-unsuitable combination before go-live, and — since it cannot read the zone's dashboard toggle — keeps a confirm-this reminder on the board even when the base URL is fine.

  `srcset` is purely additive: `src` stays the original URL, so with resizing off (or a browser ignoring `srcset`) every call site renders byte-for-byte its pre-5b HTML. The `imageTransform` argument on `renderContentJsonToHtml`/`renderGalleryBlockHtml` defaults to a no-op, so every existing caller is unchanged.

### Patch Changes

- 61d745c: Remove the stale `reference-data:contributions:check` step from `ci.yml` (the script was dropped with the unported `reference_data` module), and add `tests/unit/workflow-script-parity.test.ts` asserting every `bun run <script>` a workflow invokes resolves to a real `package.json` script.
- 74f2177: Bump `github/codeql-action/init` and `github/codeql-action/analyze` from 4.37.0 to 4.37.1 together — CodeQL requires both to run the same version.
- 69c8938: bump actions/upload-artifact from 4.6.2 to 7.0.1
- 76d4f22: bump actions/attest-build-provenance from 2.4.0 to 4.1.1
- 50445f0: bump actions/download-artifact from 5.0.0 to 8.0.1
- b8b277a: bump @changesets/cli from 2.31.0 to 2.31.1
- 85fca9a: bump astro from 7.0.7 to 7.1.0
- 13a1b42: Full repository docs↔scripts consistency audit (Issue #255) — fixes ~15 confirmed instances of documentation prose describing stale script behavior, beyond what `bun run check`'s automated docs-consistency gates already catch.

  Most safety-relevant: `production-readiness.md` still instructed running `bun run db:migrate` as an unconditional early `production:preflight` step — literally the mutating-preflight bug Issue #684 fixed by reworking the script to be read-only by default. That section, along with `production-preflight-runbook.md`'s self-contradicting stage counts (9 vs 8, actual 11), `derived-application-guide.md`'s stale preflight stage order, and a stale `release.yml` inline comment claiming `main` has no branch protection (it's been protected since 2026-07-17), are now corrected.

  Also fixed: `README.md`/`module-management/README.md` still said "16 base modules" and listed `media_library` as not-yet-implemented (it landed via ADR-0026, 2026-07-17); `18_configuration_env_reference.md`/`database-capacity-runbook.md`/`deployment-profiles.md` cited stale worker-script counts (9, even 7, vs actual 14 — now pointing at the generated registry instead of a number that will drift again); `deployment-profiles.md` described `STORAGE_DRIVER`/`LOCAL_STORAGE_PATH` as "fully supported" when doc 18 already marks them deprecated dead code; `04_erd_data_dictionary.md` described the tenant `default_locale` 'id'→'en' flip as pending when migration 016 already shipped it; `05_openapi_asyncapi_detail.md`/`blog-content/README.md` undercounted blog-content's AsyncAPI channels (26 vs actual 27) and the endpoint table was missing 4 endpoints Issue #641 added; `branch-protection.md`/`release-process.md` cited a stale 13-step `bun run check` (actual 20) and had a stale no-branch-protection claim; and `changeset:status`/`changeset:tag` had zero documentation anywhere, now documented in doc 09 §Versioning dengan Changesets.

  Also fixed `.claude/skills/`: `awcms-micro-new-module`'s own module list/count was stale and, worse, listed seven ERP modules (`workflow-approval`, `idn-admin-regions`, `data-exchange`, `document-infrastructure`, `integration-hub`, `organization-structure`, `reference-data`) as if registered in this repo — they are explicitly excluded per ADR-0025 and don't exist in `src/modules/index.ts`, an unadapted copy-paste artifact from upstream awcms-mini's own skill. `.claude/skills/README.md`'s catalog table and dependency mermaid diagram had the same root cause: six rows/nodes pointing at skill directories that don't exist in this repo (five ERP-scope, one orphaned `legacy-migration` reference) — removed, with a new scope note to stop this recurring.

  Post-review fixes (`awcms-micro-reviewer` + `awcms-micro-security-auditor`, both run on this PR): `production-readiness.md`'s own rewrite still undercounted `production:preflight`'s stages (said "9", omitted `modules:compose:check`/`extension:check`, actual 11 — now cross-checked against `production-preflight-runbook.md` and, where illustrative rather than load-bearing, pointed at the authoritative doc instead of a hardcoded count) and mischaracterized `--acknowledge-target` as a database name instead of the `APP_ENV` value it actually must match. The `legacy-migration` skill cleanup above was also incomplete — three more dangling references (`12_generator_prompt.md`, `13_final_master_index_traceability.md`, `awcms-micro-new-event/SKILL.md`) are now removed too. `AGENTS.md`'s own stale "16 modul" claim (same root cause as the README fix above) is now 17.

  No script or application behavior changes — documentation, skill catalog, and one workflow-file comment only.

- d2407ac: Collapse the login account-enumeration response-body oracle on `POST /api/v1/auth/login` (the response-body half of the awcms-mini base standard's Issue #840; the timing half shipped separately).

  The handler distinguished deny reasons that are only reachable **after** an identity resolves, which enumerates accounts for an unauthenticated caller (OWASP ASVS V2.2.1 / WSTG-IDNT-04):

  - `locked` returned `401 AUTH_INVALID_CREDENTIALS` with the message `"Account is temporarily locked."` — reachable in ~6 requests on a default deployment by tripping `AUTH_LOGIN_MAX_ATTEMPTS`, then reading the message back.
  - `password_login_disabled` returned a distinct `403 PASSWORD_LOGIN_DISABLED`, which under a tenant with password login disabled fingerprinted exactly the tenant's break-glass identities (`403` = "exists and not break-glass", `401` = "unknown or break-glass").

  Both now collapse into the same `401 AUTH_INVALID_CREDENTIALS "Invalid login identifier or password."` an unknown identifier already gets. `tenant_inactive` stays a distinct `403 ACCESS_DENIED` because it is decided from the tenant header alone, before any identity lookup, so it cannot enumerate.

  Behavior change: the `403 PASSWORD_LOGIN_DISABLED` login response is gone (it was never in OpenAPI and has no client consumer). Its `error-messages.ts` catalog entry is retained as vocabulary with a comment — do not wire a UI branch to it. Accepted tradeoff (same as the base standard): a locked user, and a user at an SSO-required tenant, now get the generic message with no hint why; those hints belong on channels that cannot be probed anonymously. `tests/integration/tenant-sso-flow.integration.test.ts` now asserts the disabled-identity denial is byte-identical to an unknown identifier's, and that the break-glass owner can still log in — the collapse hides the reason without disabling the escape hatch.

- b9e8be6: Close the login account-enumeration timing oracle on `POST /api/v1/auth/login` (ported from the awcms-mini base standard, Issue #840).

  The handler skipped `verifyPassword` entirely for an unknown `loginIdentifier` (`identityRow ? await verifyPassword(...) : false`). On the base standard's harness that made an unknown identifier answer in a median of ~4 ms against ~80 ms for a known one — a ~19x timing gap that enumerates accounts in a single unauthenticated request, needs no lockout to trip, and works on default configuration (OWASP ASVS V2.2.1 / WSTG-IDNT-04).

  `src/lib/auth/password.ts` gains `verifyPasswordOrDummy(password, hash | null)`: when `hash` is `null` it performs an equivalent argon2id verify against a process-memoized dummy hash and returns `false`, so the KDF cost is paid whether or not the identity exists. The dummy is produced by `hashPassword` itself (not a pinned literal), so it always carries the same argon2id parameters as real hashes even if Bun's defaults move. `hash === null` is the only thing that selects the dummy path — never a property of attacker input — so the work performed does not vary with the request. A once-per-process cold-start hash is documented and skews the safe (slower-unknown) direction.

  `login.ts` now calls `verifyPasswordOrDummy(password, identityRow?.password_hash ?? null)`. No API/response-shape change. Pinned by a unit test (`tests/unit/password-timing-equalization.test.ts`, mutation-verified) and an end-to-end integration test (`tests/integration/login-enumeration.integration.test.ts`, skipped without `DATABASE_URL`).

- 14a97ea: Record the cross-module import audit findings in `media_library`'s README as supporting evidence for the ADR-0026 extraction: `social_publishing`'s documented narrow exception to reach `news-portal/domain/news-media-r2-config` exists only because media config is misfiled, and `module-boundary.test.ts` scans only the `blog_content` ↔ `news_portal` pair so it never sees that edge.
- 2d9c0f8: Record that 6 of the 9 declared `media_library.media.*` permissions are seeded but unreachable, and pin the fact with a test.

  `module.ts` declares 9 media permissions and `sql/042`/`sql/077` seed all of them, but only `create`, `verify`, and `cancel` have a guard. `read`, `attach`, `detach`, `delete`, `restore`, and `purge` are grantable authority that confers nothing — no endpoint exists. This is exactly what `media-permissions.ts`'s original header warned against ("a permission that 'exists' but is unreachable") before Issue #634 declared the full set while shipping only the upload flow.

  Documentation and a test only — no behaviour change. It matters because the inert grants become meaningful the moment ADR-0026 step 5's media object API lands: a tenant that granted `media_library.media.purge` today would silently gain real purge authority then. That step must treat these keys as a contract it is implementing, not as free naming.

  `tests/unit/media-permission-reachability.test.ts` makes this mechanical: adding a route that guards `media.read` fails the test by name, forcing whoever lands it to update the list and read the header. It scans all of `src/` rather than just `src/pages/` — `verify`'s guard lives in the application layer while its route delegates, and an audit that only looked at route files reported it as unenforced, a false finding this scope prevents repeating.

  Also corrects this session's own earlier revision of that header, which claimed all 9 were enforced.

- a43b269: Fix `module-presets.integration.test.ts`, which still asserted tenant module state for seven unported ERP modules and did not account for the newly registered `media_library`. These assertions never ran locally (integration tests skip without `DATABASE_URL`), so the drift was only visible in CI.
- 8aca1ff: Correct two now-false claims that `main` has no branch protection: `release.yml`'s header and `branch-protection.md`'s intro. Protection was applied (6 required checks, `strict`, `enforce_admins`), so both documents were describing the opposite of reality.
- 48bbb5c: Fix `release.yml`'s GitHub Release title to match the format used by `awcms` and `awcms-mini`: bare `${{ github.ref_name }}` (e.g. `v0.2.0`), not product-name-prefixed `"awcms-micro ${{ github.ref_name }}"`.

  Everything else in the tag/release pipeline was already consistent with both sibling repos: the `v*.*.*` tag trigger, `scripts/release-verify.ts`'s `v`-prefix-stripping tag↔`package.json` version comparison, `.changeset/config.json`'s `privatePackages.tag: true` (which makes `bun run changeset:tag` emit `vX.Y.Z` tags, not the Changesets-default `<name>@<version>`), and the product-prefixed release asset filenames (`awcms-micro-X.Y.Z-source.tar.gz`, matching the equivalent `awcms-mini-X.Y.Z-...`/`awcms-X.Y.Z-...` pattern in the other two repos). The release title was the one line still carrying the product-name prefix both siblings dropped.

  No change to the CHANGELOG.md entry-header format (`## [X.Y.Z] — status`, Keep a Changelog style) — that's an explicit, documented choice in doc 09, unlike the release title, which had no stated rationale for diverging from the shared family convention.

- b83b940: Secret-scanning #2: swap the high-entropy synthetic Telegram Bot Token test fixture in `tests/unit/social-account-validation.test.ts` for a low-entropy repeated-character placeholder of the same shape.

  `looksLikeRawSecretToken`'s own detection regex for a Telegram-shaped token (`\d{6,10}:[A-Za-z0-9_-]{30,45}`) is close enough to GitHub's real Telegram Bot Token secret-scanning pattern that any sufficiently random-looking fixture value in that charset trips the scanner, whether or not it's a real credential — this happened twice in a row (alert #1, then its "fixed" replacement became alert #2). The sibling fixture two lines below, which uses repeated-character padding, has never been flagged; this change matches that shape so the code path under test is unchanged but the fixture no longer reads as high-entropy secret material.

- 63e4312: Security-scan triage: two test-fixture cleanups with no runtime behavior change.

  - CodeQL `js/unused-local-variable` (#291): drop the dead `MEDIA_PERMISSIONS` import from `tests/modules/news-portal-module.test.ts`. Its parity assertion moved to `media-library-module.test.ts` under ADR-0026 step 2; the remaining media-absence test filters by `activityCode === "media"` and never needs the constant.
  - Secret-scanning #1 (Telegram Bot Token): replace the canonical public Telegram-docs example token — a shape fixture for `looksLikeRawSecretToken`, never a live credential — with an inert synthetic value of the same `\d{6,10}:[A-Za-z0-9_-]{30,45}` shape. Alert resolved as `used_in_tests`.

  The remaining open code-scanning alerts (283–290) were confirmed CodeQL false positives and dismissed via the API per the `awcms-micro-codeql-triage` catalog; no code change was warranted.

Seluruh perubahan penting AWCMS-Micro dicatat di berkas ini.

Format mengikuti [Keep a Changelog](https://keepachangelog.com/id/1.1.0/), dan
proyek ini memakai [Semantic Versioning](https://semver.org/lang/id/). Berkas ini
dikelola lewat [Changesets](.changeset/README.md) — jangan sunting bagian versi
secara manual; tambahkan changeset di setiap PR yang mengubah perilaku, lalu
`bun run changeset:version` yang menuliskannya ke sini (doc 09 §Versioning).

## Riwayat versi sebelum 0.2.0

Rilis terakhir garis keturunan lama AWCMS-Micro adalah tag **`0.1.32`** — basis
kode `emdash` (Astro + pnpm + Cloudflare Workers/D1) yang **dihapus seluruhnya**
pada commit `1b7e6b6`. CHANGELOG era itu tidak dibawa: ia mendeskripsikan produk
yang tidak lagi ada di repositori ini, dan menyambungnya ke riwayat baru akan
menyesatkan pembaca yang menelusuri sebuah versi ke belakang. Riwayatnya tetap
utuh di git dan di 177 issue GitHub berlabel `deprecated`.

Karena itu penomoran dilanjutkan dari `0.1.32` ke **`0.2.0`**, bukan direset ke
`0.1.0` (mundur) dan bukan mengikuti `0.24.0` milik upstream `awcms-mini` (nomor
itu milik riwayat rilis repositori lain — lihat ADR-0025). Dalam SemVer 0.x, bump
minor adalah sinyal breaking change yang tepat untuk penggantian basis kode total.

## [0.2.0] — belum dirilis

Refaktor penuh: AWCMS-Micro dibangun ulang sebagai **turunan scope website** dari
standar [`ahliweb/awcms-mini`](https://github.com/ahliweb/awcms-mini), sejajar
dengan `ahliweb/awcms` yang turunan scope ERP. Keputusan lengkap beserta alasan,
konsekuensi, dan alternatif yang ditolak ada di
[ADR-0025](docs/adr/0025-website-scope-derivation-from-awcms-mini.md).

### Ditambahkan

- Fondasi standar AWCMS-Mini secara utuh: modular monolith Bun + Astro 7 SSR +
  PostgreSQL dengan RLS, chokepoint tunggal `withTenant()`, RBAC/ABAC default-deny
  lewat `authorizeInTransaction()` di dalam transaksi yang sama, audit trail
  ber-redaksi, correlation ID, structured logging, metrics port, work-class
  backpressure + circuit breaker, dan migration runner ber-checksum + advisory lock.
- Registry **16 modul** scope website — fondasi (`tenant_admin`, `profile_identity`,
  `identity_access`, `logging`, `module_management`), layanan platform
  (`sync_storage`, `domain_event_runtime`, `data_lifecycle`, `reporting`, `email`,
  `form_drafts`), dan website (`tenant_domain`, `blog_content`, `news_portal`,
  `social_publishing`, `visitor_analytics`).
- Kontrak OpenAPI (ber-fragment + bundler) dan AsyncAPI, keduanya diverifikasi
  parity dua arah terhadap route dan registry event.
- Rantai gate CI `bun run check` (20 gate berurutan) termasuk typecheck, 2.955
  test, dan build.
- [ADR-0025](docs/adr/0025-website-scope-derivation-from-awcms-mini.md) — rekaman
  keputusan scope, termasuk aturan turunan "pemangkasan harus tuntas sampai
  artefak generated + gate CI".

### Dihapus

- Seluruh basis kode `emdash` sebelumnya (Astro + pnpm + Cloudflare Workers/D1),
  termasuk konfigurasi wrangler dan GitHub Actions era itu.
- Tujuh modul scope ERP milik upstream yang **tidak diport** (ADR-0025 §3):
  `workflow`, `organization_structure`, `document_infrastructure`, `data_exchange`,
  `integration_hub`, `reference_data`, `idn_admin_regions` — beserta migrasi,
  route, permission seed, channel AsyncAPI, fragment OpenAPI, kunci i18n, dan
  entri registry work-class miliknya.

### Diperbaiki

- **Generic idempotency store dipertahankan saat `workflow` dipangkas.** Di upstream
  `awcms_mini_idempotency_keys` lahir di dalam migrasi `workflow` semata-mata karena
  workflow decision kebetulan endpoint pertama yang butuh `Idempotency-Key` — padahal
  store itu infrastruktur bersama yang dipakai `_shared/idempotency.ts` untuk setiap
  mutation high-risk. Migrasi `012` ditulis ulang memuat store itu saja
  (`012_awcms_micro_idempotency_store_schema.sql`), dengan test regresi yang
  memastikan ia bertahan independen dari workflow.
- **`THEME_INIT_SCRIPT_HASH` dihitung ulang.** Body script berubah oleh rename
  (`awcms_micro_theme`), sehingga hash CSP warisan tidak lagi cocok. Membawanya apa
  adanya akan membuat CSP memblokir script anti-flash tema — diam-diam, dan hanya di
  browser sungguhan.

### Catatan

- Utang dokumentasi yang diakui: sebagian `docs/awcms-micro/` masih diselaraskan
  dengan registry 16 modul. Sampai tuntas, **`src/`, `sql/`, dan gate CI adalah
  sumber kebenaran** (ADR-0025 §Konsekuensi, AGENTS.md §Sumber kebenaran).
