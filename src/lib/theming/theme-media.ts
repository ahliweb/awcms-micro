/**
 * Theme asset media resolution composition root (Issue #269, ADR-0029 §7). Lives
 * in `src/lib` (never inside the module's own `application`/`domain`) because it
 * is where the `media_library` adapter is wired into `theming` — the same
 * ports-and-adapters composition-root convention `src/lib/seo/discovery-providers.ts`
 * uses. A `theming` config stores media OBJECT IDS (never URLs); this resolves
 * them to safe, same-tenant, verified public URLs through `MediaLibraryPort`,
 * dropping any id that does not resolve.
 */
import { mediaLibraryPortAdapter } from "../../modules/media-library/application/media-library-port-adapter";
import type { ThemeConfig } from "../../modules/theming/domain/theme-config";

export type ResolvedThemeAsset = { url: string; altText: string | null };

/**
 * Resolve a theme config's `assetRefs` (assetSlotKey -> media UUID) to public
 * URLs. Uses `MediaLibraryPort.resolveMediaReferences`, which returns only ids
 * that are safe (exist, same-tenant, verified) — an unsafe/cross-tenant/absent
 * id is simply omitted, so a stale or foreign id can never surface a URL.
 */
export async function resolveThemeAssetUrls(
  tx: Bun.SQL,
  tenantId: string,
  config: ThemeConfig
): Promise<Record<string, ResolvedThemeAsset>> {
  const entries = Object.entries(config.assetRefs);
  if (entries.length === 0) return {};
  const ids = entries.map(([, mediaId]) => mediaId);
  const resolved = await mediaLibraryPortAdapter.resolveMediaReferences(
    tx,
    tenantId,
    ids
  );
  const out: Record<string, ResolvedThemeAsset> = {};
  for (const [slotKey, mediaId] of entries) {
    const media = resolved.get(mediaId);
    if (media) {
      out[slotKey] = { url: media.publicUrl, altText: media.altText };
    }
  }
  return out;
}
