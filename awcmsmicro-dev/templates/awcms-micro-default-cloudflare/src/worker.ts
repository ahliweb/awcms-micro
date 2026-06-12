// Cloudflare Worker entry for AWCMS-Micro.
// Delegates to @emdash-cms/cloudflare/worker which bundles:
//   - the Astro SSR handler (default export)
//   - a scheduled() handler that drives cron-based scheduled publishing
//     and fires content:afterPublish hooks (edge-cache invalidation etc.)
//   - PluginBridge Durable Object for EmDash sandbox
//
// Requires a Cron Trigger in wrangler.jsonc:
//   "triggers": { "crons": ["* * * * *"] }
export { default, PluginBridge } from "@emdash-cms/cloudflare/worker";
