/**
 * Serializer for the `<script type="application/json">` data islands that hand
 * server-rendered values to client scripts (`ClientJsonData.astro`,
 * `readClientStrings()`).
 *
 * `JSON.stringify` escapes nothing HTML-significant — `<` and `/` come through
 * verbatim — so a payload containing `</script>` CLOSES the data island and
 * everything after it is parsed as live HTML. Every call site today passes
 * repo-controlled i18n strings, but the component advertises itself as taking
 * "any JSON-serializable payload" and 35 admin pages are candidates to adopt
 * it; the first one that hands it a tenant's domain name or a user's display
 * name would turn that into stored XSS in the admin.
 *
 * Escaping `<` as the JSON escape `<` is a no-op for `JSON.parse` (it
 * decodes straight back to `<`) and closes the hole for every future payload,
 * rather than relying on each call site to stay harmless.
 */
export function serializeClientJson(payload: unknown): string {
  return JSON.stringify(payload).replaceAll("<", "\\u003c");
}
