import type { PluginDescriptor } from "emdash";

export interface AWCMSMicroPluginOptions {
  enabled?: boolean;
  maxAuditEntries?: number;
  analyticsEnabled?: boolean;
}

export function awcmsMicroPlugin(options: AWCMSMicroPluginOptions = {}): PluginDescriptor {
  const maxAuditEntries = options.maxAuditEntries ?? 100;

  return {
    id: "awcms-micro",
    version: "0.1.0",
    format: "native",
    entrypoint: "awcms-micro-plugin",
    options: options as Record<string, unknown>,
    adminEntry: "awcms-micro-plugin/admin",
    componentsEntry: "awcms-micro-plugin/astro",
    capabilities: [
      "read:content",
      "write:content",
      "read:media",
      "network:request",
      "email:send",
      "users:read",
      "hooks.page-fragments:register",
    ],
    allowedHosts: ["api.example.com", "analytics.example.com"],
    admin: {
      entry: "awcms-micro-plugin/admin",
      settingsSchema: {
        enabled: { type: "boolean", label: "Plugin Enabled", default: options.enabled ?? true },
        maxAuditEntries: { type: "number", label: "Max Audit Entries", default: maxAuditEntries, min: 10, max: 1000 },
        analyticsEnabled: { type: "boolean", label: "Analytics Enabled", default: options.analyticsEnabled ?? false },
        webhookUrl: { type: "url", label: "Webhook URL", description: "URL for content change notifications" },
        apiKey: { type: "secret", label: "API Key" },
        notificationEmail: { type: "email", label: "Notification Email" },
        theme: {
          type: "select",
          label: "Theme",
          options: [
            { label: "Light", value: "light" },
            { label: "Dark", value: "dark" },
            { label: "System", value: "system" },
          ],
          default: "system",
        },
      },
      pages: [
        { path: "/dashboard", label: "Dashboard", icon: "chart" },
        { path: "/audit", label: "Audit Log", icon: "history" },
        { path: "/analytics", label: "Analytics", icon: "chart" },
        { path: "/settings", label: "Settings", icon: "settings" },
      ],
      widgets: [
        { id: "activity-summary", title: "Activity Summary", size: "half" },
        { id: "quick-stats", title: "Quick Stats", size: "third" },
        { id: "recent-content", title: "Recent Content", size: "third" },
      ],
      portableTextBlocks: [
        {
          type: "callout",
          label: "Callout Box",
          icon: "link",
          placeholder: "Enter callout text...",
          fields: [
            { type: "text_input", action_id: "title", label: "Title" },
            { type: "text_input", action_id: "body", label: "Body Text" },
            {
              type: "select",
              action_id: "variant",
              label: "Variant",
              options: [
                { label: "Info", value: "info" },
                { label: "Warning", value: "warning" },
                { label: "Error", value: "error" },
                { label: "Success", value: "success" },
              ],
            },
          ],
        },
        {
          type: "video-embed",
          label: "Video Embed",
          icon: "video",
          placeholder: "Paste video URL...",
          fields: [
            { type: "text_input", action_id: "url", label: "Video URL" },
            { type: "text_input", action_id: "title", label: "Title" },
            { type: "text_input", action_id: "poster", label: "Poster Image URL" },
          ],
        },
      ],
    },
    storage: {
      audit: { indexes: ["timestamp", "action", "collection"] },
      analytics: { indexes: ["type", "date"] },
      notifications: { indexes: ["status", "createdAt"] },
    },
    hooks: {
      "plugin:install": async (_event: any, ctx: any) => {
        ctx.log.info("AWCMS Micro plugin installed");
        await ctx.kv.set("settings:enabled", options.enabled ?? true);
        await ctx.kv.set("settings:maxAuditEntries", maxAuditEntries);
        await ctx.kv.set("state:installDate", new Date().toISOString());
      },
      "plugin:activate": async (_event: any, ctx: any) => {
        ctx.log.info("AWCMS Micro plugin activated");
      },
      "plugin:deactivate": async (_event: any, ctx: any) => {
        ctx.log.info("AWCMS Micro plugin deactivated");
      },
      "plugin:uninstall": async (event: any, ctx: any) => {
        ctx.log.info("AWCMS Micro plugin uninstalled", { deleteData: event.deleteData });
        if (event.deleteData) {
          const auditResult = await ctx.storage.audit.query({ limit: 1000 });
          await ctx.storage.audit.deleteMany(auditResult.items.map((i: any) => i.id));
          const analyticsResult = await ctx.storage.analytics.query({ limit: 1000 });
          await ctx.storage.analytics.deleteMany(analyticsResult.items.map((i: any) => i.id));
        }
      },
      "content:beforeSave": {
        priority: 50,
        handler: async (event: any, ctx: any) => {
          const enabled = await ctx.kv.get<boolean>("settings:enabled");
          if (enabled === false) return;
          if (event.collection === "posts" && typeof event.content.title === "string") {
            event.content.title = event.content.title.trim();
            if (!event.content.title) {
              throw new Error("Post title cannot be empty");
            }
          }
          return event.content;
        },
      },
      "content:afterSave": {
        priority: 100,
        handler: async (event: any, ctx: any) => {
          const enabled = await ctx.kv.get<boolean>("settings:enabled");
          if (enabled === false) return;
          await ctx.storage.audit.put(`audit_${Date.now()}`, {
            action: event.isNew ? "create" : "update",
            collection: event.collection,
            contentId: event.content.id,
            timestamp: new Date().toISOString(),
            userId: "system",
          });
          const analyticsEnabled = await ctx.kv.get<boolean>("settings:analyticsEnabled");
          if (analyticsEnabled) {
            const today = new Date().toISOString().split("T")[0];
            await ctx.storage.analytics.put(`analytics_${Date.now()}`, {
              type: "content:save",
              collection: event.collection,
              date: today,
              count: 1,
            });
          }
          const webhookUrl = await ctx.kv.get<string>("settings:webhookUrl");
          if (webhookUrl && ctx.http) {
            try {
              await ctx.http.fetch(webhookUrl, {
                method: "POST",
                body: JSON.stringify({
                  event: "content:save",
                  collection: event.collection,
                  contentId: event.content.id,
                  isNew: event.isNew,
                }),
              });
            } catch (err) {
              ctx.log.warn("Webhook notification failed", { error: String(err) });
            }
          }
        },
      },
      "content:beforeDelete": {
        handler: async (event: any, ctx: any) => {
          ctx.log.info("Content delete attempted", { collection: event.collection, id: event.id });
          return true;
        },
      },
      "content:afterDelete": {
        handler: async (event: any, ctx: any) => {
          await ctx.storage.audit.put(`audit_${Date.now()}`, {
            action: "delete",
            collection: event.collection,
            contentId: event.id,
            timestamp: new Date().toISOString(),
            userId: "system",
          });
        },
      },
      "content:afterPublish": {
        handler: async (event: any, ctx: any) => {
          ctx.log.info("Content published", { collection: event.collection, id: event.content.id });
          const notificationEmail = await ctx.kv.get<string>("settings:notificationEmail");
          if (notificationEmail && ctx.email) {
            try {
              await ctx.email.send({
                to: notificationEmail,
                subject: `New post published: ${event.content.title ?? "Untitled"}`,
                text: `A new post has been published in the ${event.collection} collection.`,
              });
            } catch (err) {
              ctx.log.warn("Email notification failed", { error: String(err) });
            }
          }
        },
      },
      "content:afterUnpublish": {
        handler: async (event: any, ctx: any) => {
          ctx.log.info("Content unpublished", { collection: event.collection, id: event.content.id });
        },
      },
      "media:afterUpload": {
        handler: async (event: any, ctx: any) => {
          ctx.log.info("Media uploaded", { filename: event.media.filename, size: event.media.size });
        },
      },
      "page:metadata": async (event: any, _ctx: any) => {
        if (event.page.kind !== "content") return null;
        const contributions: any[] = [];
        if (event.page.content?.collection === "posts") {
          contributions.push({
            kind: "jsonld",
            id: `schema:blogpost:${event.page.content.id}`,
            graph: {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: event.page.pageTitle ?? event.page.title,
              description: event.page.description,
              image: event.page.image ?? undefined,
              datePublished: new Date().toISOString(),
            },
          });
        }
        contributions.push({
          kind: "meta",
          name: "generator",
          content: "AWCMS-Micro / EmDash",
        });
        return contributions;
      },
      "page:fragments": async (event: any, ctx: any) => {
        const analyticsEnabled = await ctx.kv.get<boolean>("settings:analyticsEnabled");
        if (!analyticsEnabled) return null;
        return [
          {
            kind: "inline-script",
            placement: "body:end",
            code: `window.awcmsMicro = { pagePath: ${JSON.stringify(event.page.path)} };`,
          },
        ];
      },
      cron: {
        handler: async (_event: any, ctx: any) => {
          const maxEntries = (await ctx.kv.get<number>("settings:maxAuditEntries")) ?? maxAuditEntries;
          const result = await ctx.storage.audit.query({
            orderBy: { timestamp: "desc" },
            limit: maxEntries + 50,
          });
          if (result.items.length > maxEntries) {
            const toDelete = result.items.slice(maxEntries);
            await ctx.storage.audit.deleteMany(toDelete.map((i: any) => i.id));
            ctx.log.info("Cleaned up old audit entries", { deleted: toDelete.length });
          }
        },
      },
    },
    routes: {
      stats: {
        handler: async (ctx: any) => {
          const auditCount = await ctx.storage.audit.count();
          const analyticsCount = await ctx.storage.analytics.count();
          const today = new Date().toISOString().split("T")[0];
          const todayActions = await ctx.storage.audit.count({ timestamp: { gte: today } });
          return { auditCount, analyticsCount, todayActions, pluginVersion: "0.1.0" };
        },
      },
      "audit/recent": {
        input: {} as any,
        handler: async (ctx: any) => {
          const result = await ctx.storage.audit.query({ orderBy: { timestamp: "desc" }, limit: 20 });
          return {
            entries: result.items.map((item: any) => ({ id: item.id, ...(item.data as Record<string, unknown>) })),
            hasMore: result.hasMore,
            cursor: result.cursor,
          };
        },
      },
      "analytics/summary": {
        handler: async (ctx: any) => {
          const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
          const result = await ctx.storage.analytics.query({
            where: { date: { gte: sevenDaysAgo } },
            orderBy: { date: "desc" },
            limit: 7,
          });
          return {
            daily: result.items.map((item: any) => ({
              date: item.data.date,
              type: item.data.type,
              count: item.data.count,
            })),
          };
        },
      },
      settings: {
        handler: async (ctx: any) => {
          const settings = await ctx.kv.list("settings:");
          const result: Record<string, unknown> = {};
          for (const entry of settings) {
            result[entry.key.replace("settings:", "")] = entry.value;
          }
          return result;
        },
      },
      "settings/save": {
        handler: async (ctx: any) => {
          const body = (ctx as any).input;
          if (body && typeof body === "object") {
            for (const [key, value] of Object.entries(body)) {
              if (value !== undefined) {
                await ctx.kv.set(`settings:${key}`, value);
              }
            }
          }
          return { success: true };
        },
      },
      notifications: {
        handler: async (ctx: any) => {
          const result = await ctx.storage.notifications.query({
            where: { status: "unread" },
            orderBy: { createdAt: "desc" },
            limit: 10,
          });
          return {
            notifications: result.items.map((item: any) => ({ id: item.id, ...(item.data as Record<string, unknown>) })),
          };
        },
      },
      "content/activity": {
        public: true,
        handler: async (ctx: any) => {
          if (!ctx.content) throw new Error("Content access not granted");
          const posts = await ctx.content.list("posts", { limit: 5, orderBy: { createdAt: "desc" } });
          return {
            recentPosts: posts.items.map((p: any) => ({
              id: p.id,
              title: p.data.title,
              createdAt: p.data.createdAt,
            })),
          };
        },
      },
    },
  };
}

export default awcmsMicroPlugin;
export const createPlugin = awcmsMicroPlugin;
