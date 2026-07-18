/**
 * Bridges this module's R2 config to the pure `_shared` responsive-image
 * transform (ADR-0026 step 5b). The one place that decides, from deployment
 * config, whether public image rendering emits Cloudflare `srcset` URLs — so no
 * public route re-derives that mapping and they can never disagree about when
 * resizing is on.
 *
 * Reads env only through `resolveNewsMediaR2Config` (env is trusted here, same
 * as every other config resolution). The transform it returns is pure and safe
 * to hand to `renderContentJsonToHtml`/`renderGalleryBlockHtml`; when resizing is
 * disabled it is the no-op transform, so callers pass the result
 * unconditionally.
 */
import {
  resolveNewsMediaR2Config,
  type NewsMediaR2Config
} from "../domain/media-r2-config";
import {
  buildResponsiveImageTransform,
  type ResponsiveImageTransform
} from "../../_shared/rendering/responsive-image";

export function buildNewsMediaResponsiveImageTransform(
  env: NodeJS.ProcessEnv = process.env
): ResponsiveImageTransform {
  return responsiveImageTransformFromConfig(resolveNewsMediaR2Config(env));
}

/** Split out so a test can drive it from a config object without env plumbing. */
export function responsiveImageTransformFromConfig(
  config: NewsMediaR2Config
): ResponsiveImageTransform {
  return buildResponsiveImageTransform({
    // Resizing is only meaningful when R2 itself is on — a disabled deployment
    // has no `publicBaseUrl` to build zone URLs from. Requiring both here means
    // a stray `NEWS_MEDIA_R2_IMAGE_RESIZING_ENABLED=true` on an R2-disabled
    // deployment stays inert rather than emitting `/cdn-cgi/image/` URLs against
    // an empty origin.
    enabled: config.enabled && config.imageResizingEnabled,
    publicBaseUrl: config.publicBaseUrl
  });
}
