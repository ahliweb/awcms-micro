// AWCMS-Micro Cloudflare Worker Entrypoint
// EmDash-compatible host runtime
// This worker is the deployment target for the EmDash host site.
// SIKESRA is loaded as a plugin via astro.config.mjs plugins array.

export default {
  async fetch(request: Request, env: { DB: unknown; MEDIA: unknown }): Promise<Response> {
    return new Response(JSON.stringify({
      service: "AWCMS-Micro",
      description: "EmDash-compatible host runtime",
      timestamp: new Date().toISOString(),
    }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
