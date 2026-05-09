// SIKESRA Standalone Worker Entrypoint
// Deployable without astro build step
// Source: SIKESRA implementation scaffold

export default {
  async fetch(request: Request, env: { SIKESRA_DB: unknown; MEDIA: unknown }): Promise<Response> {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === "/" || url.pathname === "") {
      return new Response(JSON.stringify({
        service: "AWCMS-Micro SIKESRA",
        status: "operational",
        database: env.DB ? "connected" : "not_available",
        storage: env.MEDIA ? "connected" : "not_available",
        timestamp: new Date().toISOString(),
      }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Public metadata endpoint
    if (url.pathname === "/_emdash/api/plugins/sikesra/public/metadata") {
      return new Response(JSON.stringify({
        ok: true,
        requestId: crypto.randomUUID(),
        data: {
          enabled: true,
          title: "SIKESRA",
          description: "Sistem Informasi Kesejahteraan Rakyat",
          dataScopeNote: "Data ditampilkan dalam bentuk agregat",
          latestUpdateAt: new Date().toISOString(),
        },
      }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      ok: false,
      error: { code: "NOT_FOUND", message: "Route not found" },
    }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  },
};
