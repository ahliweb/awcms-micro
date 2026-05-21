import { definePlugin } from "emdash";
import type { PluginDescriptor } from "emdash";

export interface ExamplePluginOptions {
  enabled?: boolean;
  maxEntries?: number;
}

export function awcmsExamplePlugin(options: ExamplePluginOptions = {}): PluginDescriptor {
  return {
    id: "awcms-example",
    version: "0.1.0",
    format: "native",
    entrypoint: "awcms-example-plugin",
    options: options as Record<string, unknown>,
  };
}

export function createPlugin(options: ExamplePluginOptions = {}) {
  return definePlugin({
    id: "awcms-example",
    version: "0.1.0",

    capabilities: ["read:content"],

    storage: {
      entries: { indexes: ["timestamp", "type"] },
    },

    admin: {
      settingsSchema: {
        enabled: { type: "boolean", label: "Enabled", default: options.enabled ?? true },
        maxEntries: { type: "number", label: "Max Entries", default: options.maxEntries ?? 50, min: 1, max: 500 },
      },
      pages: [{ path: "/example", label: "Example", icon: "star" }],
      widgets: [{ id: "example-widget", title: "Example Widget", size: "third" }],
    },

    hooks: {
      "plugin:install": async (_event, ctx) => {
        ctx.log.info("AWCMS Example plugin installed");
      },

      "content:afterSave": async (event, ctx) => {
        const enabled = await ctx.kv.get<boolean>("settings:enabled");
        if (enabled === false) return;

        await ctx.storage.entries.put(`entry_${Date.now()}`, {
          type: "content:save",
          collection: event.collection,
          contentId: event.content.id,
          timestamp: new Date().toISOString(),
        });
      },
    },

    routes: {
      stats: {
        handler: async (ctx) => {
          const result = await ctx.storage.entries.query({
            orderBy: { timestamp: "desc" },
            limit: 10,
          });
          return { entries: result.items };
        },
      },
    },
  });
}

export default createPlugin;
