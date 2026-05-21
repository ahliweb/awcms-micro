import { z } from "astro/zod";
import { definePlugin, type PluginDescriptor, type ResolvedPlugin } from "emdash";

const PLUGIN_ID = "awcms-micro";
const PLUGIN_VERSION = "0.2.0";
const DEFAULT_MAX_AUDIT_ENTRIES = 150;

export interface AWCMSMicroPluginOptions {
  enabled?: boolean;
  analyticsEnabled?: boolean;
  maxAuditEntries?: number;
}

type AuditEntry = {
  timestamp: string;
  type:
    | "content:create"
    | "content:update"
    | "content:delete"
    | "content:publish"
    | "content:unpublish"
    | "media:upload"
    | "comment:create"
    | "comment:moderate"
    | "email:afterSend";
  collection?: string;
  resourceId?: string;
  message: string;
  metadata?: Record<string, unknown>;
};

type AnalyticsEntry = {
  bucket: string;
  metric: string;
  count: number;
  recordedAt: string;
};

type NotificationEntry = {
  createdAt: string;
  status: "unread" | "read";
  title: string;
  body: string;
};

type CommentEntry = {
  createdAt: string;
  status: string;
  collection: string;
  contentId: string;
  authorName: string;
  reason?: string;
};

function todayBucket() {
  return new Date().toISOString().slice(0, 10);
}

function toResourceId(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "unknown";
}

async function persistDefaults(
  ctx: { kv: { set: (key: string, value: unknown) => Promise<void> } },
  options: AWCMSMicroPluginOptions,
) {
  await ctx.kv.set("settings:enabled", options.enabled ?? true);
  await ctx.kv.set("settings:analyticsEnabled", options.analyticsEnabled ?? true);
  await ctx.kv.set(
    "settings:maxAuditEntries",
    options.maxAuditEntries ?? DEFAULT_MAX_AUDIT_ENTRIES,
  );
  await ctx.kv.set("settings:theme", "system");
}

async function addAudit(ctx: any, entry: AuditEntry) {
  await ctx.storage.audit.put(`audit:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`, entry);
}

async function addAnalytics(ctx: any, metric: string) {
  const enabled = (await ctx.kv.get("settings:analyticsEnabled")) ?? true;
  if (!enabled) return;

  await ctx.storage.analytics.put(
    `analytics:${metric}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
    {
      bucket: todayBucket(),
      metric,
      count: 1,
      recordedAt: new Date().toISOString(),
    } satisfies AnalyticsEntry,
  );
}

async function addNotification(ctx: any, title: string, body: string) {
  await ctx.storage.notifications.put(
    `notification:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
    {
      createdAt: new Date().toISOString(),
      status: "unread",
      title,
      body,
    } satisfies NotificationEntry,
  );
}

async function trimCollection(ctx: any, collectionName: "audit" | "notifications", maxEntries: number) {
  const result = await ctx.storage[collectionName].query({
    orderBy: collectionName === "audit" ? { timestamp: "desc" } : { createdAt: "desc" },
    limit: maxEntries + 50,
  });

  if (result.items.length <= maxEntries) return;

  const toDelete = result.items.slice(maxEntries).map((item: { id: string }) => item.id);
  await ctx.storage[collectionName].deleteMany(toDelete);
}

async function deleteAll(ctx: any, collectionName: string) {
  let cursor: string | undefined;
  do {
    const result = await ctx.storage[collectionName].query({ limit: 100, cursor });
    if (result.items.length > 0) {
      await ctx.storage[collectionName].deleteMany(
        result.items.map((item: { id: string }) => item.id),
      );
    }
    cursor = result.cursor;
  } while (cursor);
}

export function awcmsMicroPlugin(
  options: AWCMSMicroPluginOptions = {},
): PluginDescriptor<AWCMSMicroPluginOptions> {
  return {
    id: PLUGIN_ID,
    version: PLUGIN_VERSION,
    format: "native",
    entrypoint: "awcms-micro-plugin",
    adminEntry: "awcms-micro-plugin/admin",
    componentsEntry: "awcms-micro-plugin/astro",
    options,
    capabilities: [
      "content:read",
      "content:write",
      "media:read",
      "media:write",
      "users:read",
      "network:request",
      "email:send",
      "hooks.email-events:register",
      "hooks.page-fragments:register",
    ],
    allowedHosts: ["api.github.com"],
    adminPages: [
      { path: "/", label: "Overview", icon: "chart" },
      { path: "/activity", label: "Activity", icon: "history" },
      { path: "/comments", label: "Comments", icon: "message-square" },
      { path: "/settings", label: "Settings", icon: "settings" },
    ],
    adminWidgets: [
      { id: "activity-summary", title: "Activity Summary", size: "half" },
      { id: "quick-stats", title: "Quick Stats", size: "third" },
      { id: "recent-content", title: "Recent Content", size: "third" },
    ],
    storage: {
      audit: { indexes: ["timestamp", "type", "collection"] },
      analytics: { indexes: ["bucket", "metric", "recordedAt"] },
      notifications: { indexes: ["status", "createdAt"] },
      comments: { indexes: ["status", "collection", "createdAt"] },
    },
  };
}

export function createPlugin(options: AWCMSMicroPluginOptions = {}): ResolvedPlugin {
  return definePlugin({
    id: PLUGIN_ID,
    version: PLUGIN_VERSION,
    capabilities: [
      "content:read",
      "content:write",
      "media:read",
      "media:write",
      "users:read",
      "network:request",
      "email:send",
      "hooks.email-events:register",
      "hooks.page-fragments:register",
    ],
    allowedHosts: ["api.github.com"],
    storage: {
      audit: { indexes: ["timestamp", "type", "collection"] },
      analytics: { indexes: ["bucket", "metric", "recordedAt"] },
      notifications: { indexes: ["status", "createdAt"] },
      comments: { indexes: ["status", "collection", "createdAt"] },
    },
    admin: {
      entry: "awcms-micro-plugin/admin",
      settingsSchema: {
        enabled: { type: "boolean", label: "Plugin enabled", default: options.enabled ?? true },
        analyticsEnabled: {
          type: "boolean",
          label: "Analytics enabled",
          default: options.analyticsEnabled ?? true,
        },
        maxAuditEntries: {
          type: "number",
          label: "Max audit entries",
          default: options.maxAuditEntries ?? DEFAULT_MAX_AUDIT_ENTRIES,
          min: 25,
          max: 1000,
        },
        notifyEmail: { type: "email", label: "Notification email" },
        docsUrl: { type: "url", label: "Reference URL", default: "https://docs.emdashcms.com" },
        apiKey: { type: "secret", label: "Example secret key" },
        theme: {
          type: "select",
          label: "Plugin theme",
          default: "system",
          options: [
            { label: "System", value: "system" },
            { label: "Light", value: "light" },
            { label: "Dark", value: "dark" },
          ],
        },
      },
      pages: [
        { path: "/", label: "Overview", icon: "chart" },
        { path: "/activity", label: "Activity", icon: "history" },
        { path: "/comments", label: "Comments", icon: "message-square" },
        { path: "/settings", label: "Settings", icon: "settings" },
      ],
      widgets: [
        { id: "activity-summary", title: "Activity Summary", size: "half" },
        { id: "quick-stats", title: "Quick Stats", size: "third" },
        { id: "recent-content", title: "Recent Content", size: "third" },
      ],
      portableTextBlocks: [
        {
          type: "awcms-callout",
          label: "AWCMS Callout",
          icon: "link",
          description: "Highlight implementation notes inside Portable Text.",
          fields: [
            { type: "text_input", action_id: "title", label: "Title" },
            { type: "text_input", action_id: "body", label: "Body" },
            {
              type: "select",
              action_id: "tone",
              label: "Tone",
              options: [
                { label: "Info", value: "info" },
                { label: "Warning", value: "warning" },
                { label: "Success", value: "success" },
                { label: "Danger", value: "danger" },
              ],
            },
          ],
        },
        {
          type: "awcms-video",
          label: "AWCMS Video",
          icon: "video",
          description: "Embed a YouTube or Vimeo video.",
          fields: [
            { type: "text_input", action_id: "id", label: "Video URL" },
            { type: "text_input", action_id: "title", label: "Title" },
          ],
        },
      ],
    },
    hooks: {
      "plugin:install": async (_event, ctx) => {
        await persistDefaults(ctx, options);
        await ctx.kv.set("state:installedAt", new Date().toISOString());
        ctx.log.info("AWCMS-Micro plugin installed");
      },
      "plugin:activate": async (_event, ctx) => {
        await ctx.cron?.schedule("audit-cleanup", { schedule: "0 3 * * *" });
        ctx.log.info("AWCMS-Micro plugin activated");
      },
      "plugin:deactivate": async (_event, ctx) => {
        await ctx.cron?.cancel("audit-cleanup").catch(() => undefined);
        ctx.log.info("AWCMS-Micro plugin deactivated");
      },
      "plugin:uninstall": async (event, ctx) => {
        if (!event.deleteData) return;
        await Promise.all([
          deleteAll(ctx, "audit"),
          deleteAll(ctx, "analytics"),
          deleteAll(ctx, "notifications"),
          deleteAll(ctx, "comments"),
        ]);
      },
      "content:beforeSave": {
        handler: async (event) => {
          const next = { ...event.content } as Record<string, unknown>;
          if (typeof next.title === "string") {
            next.title = next.title.trim();
            if (!next.title) throw new Error("Content title cannot be empty");
          }
          return next;
        },
      },
      "content:afterSave": {
        errorPolicy: "continue",
        handler: async (event, ctx) => {
          await addAudit(ctx, {
            timestamp: new Date().toISOString(),
            type: event.isNew ? "content:create" : "content:update",
            collection: event.collection,
            resourceId: toResourceId((event.content as Record<string, unknown>).id),
            message: `${event.isNew ? "Created" : "Updated"} ${event.collection}`,
          });
          await addAnalytics(ctx, event.isNew ? "content.create" : "content.update");
          await addNotification(
            ctx,
            event.isNew ? "Content created" : "Content updated",
            `${event.collection} ${toResourceId((event.content as Record<string, unknown>).id)} was saved.`,
          );
        },
      },
      "content:beforeDelete": {
        handler: async (event, ctx) => {
          ctx.log.info("Preparing to delete content", event);
          return true;
        },
      },
      "content:afterDelete": {
        errorPolicy: "continue",
        handler: async (event, ctx) => {
          await addAudit(ctx, {
            timestamp: new Date().toISOString(),
            type: "content:delete",
            collection: event.collection,
            resourceId: event.id,
            message: `Deleted ${event.collection}/${event.id}`,
          });
          await addAnalytics(ctx, "content.delete");
        },
      },
      "content:afterPublish": {
        errorPolicy: "continue",
        handler: async (event, ctx) => {
          await addAudit(ctx, {
            timestamp: new Date().toISOString(),
            type: "content:publish",
            collection: event.collection,
            resourceId: toResourceId((event.content as Record<string, unknown>).id),
            message: `Published ${event.collection}`,
          });
          await addAnalytics(ctx, "content.publish");

          const notifyEmail = await ctx.kv.get<string>("settings:notifyEmail");
          if (notifyEmail && ctx.email) {
            await ctx.email.send({
              to: notifyEmail,
              subject: `Published: ${String((event.content as Record<string, unknown>).title ?? "Untitled")}`,
              text: `A ${event.collection} entry was published by the AWCMS-Micro example plugin.`,
            });
          }
        },
      },
      "content:afterUnpublish": {
        errorPolicy: "continue",
        handler: async (event, ctx) => {
          await addAudit(ctx, {
            timestamp: new Date().toISOString(),
            type: "content:unpublish",
            collection: event.collection,
            resourceId: toResourceId((event.content as Record<string, unknown>).id),
            message: `Unpublished ${event.collection}`,
          });
        },
      },
      "media:beforeUpload": {
        handler: async (event) => {
          if (event.file.size > 10 * 1024 * 1024) {
            throw new Error("Example plugin limit: uploads must be 10MB or smaller");
          }
          return {
            ...event.file,
            name: `${Date.now()}-${event.file.name.replace(/\s+/g, "-")}`,
          };
        },
      },
      "media:afterUpload": {
        errorPolicy: "continue",
        handler: async (event, ctx) => {
          await addAudit(ctx, {
            timestamp: new Date().toISOString(),
            type: "media:upload",
            resourceId: event.media.id,
            message: `Uploaded ${event.media.filename}`,
          });
          await addAnalytics(ctx, "media.upload");
        },
      },
      "email:beforeSend": {
        errorPolicy: "continue",
        handler: async (event) => {
          return {
            ...event.message,
            text: `${event.message.text}\n\nSent via the AWCMS-Micro example plugin.`,
          };
        },
      },
      "email:afterSend": {
        errorPolicy: "continue",
        handler: async (event, ctx) => {
          await addAudit(ctx, {
            timestamp: new Date().toISOString(),
            type: "email:afterSend",
            message: `Email sent to ${event.message.to}`,
            metadata: { source: event.source },
          });
        },
      },
      "comment:beforeCreate": {
        errorPolicy: "continue",
        handler: async (event) => {
          if (event.comment.authorEmail.endsWith("@example.invalid")) {
            return false;
          }

          event.metadata.hasLinks = /https?:\/\//i.test(event.comment.body);
          event.metadata.bodyLength = event.comment.body.length;
          return event;
        },
      },
      "comment:moderate": {
        exclusive: true,
        handler: async (event) => {
          if (String(event.metadata.hasLinks) === "true" && event.comment.body.length > 240) {
            return { status: "pending", reason: "Comment contains links and needs review" };
          }

          if (event.collectionSettings.commentsModeration === "all") {
            return { status: "pending", reason: "Collection requires moderation" };
          }

          if (
            event.collectionSettings.commentsModeration === "first_time" &&
            event.priorApprovedCount === 0 &&
            !event.comment.authorUserId
          ) {
            return { status: "pending", reason: "First-time commenter" };
          }

          if (event.comment.authorUserId && event.collectionSettings.commentsAutoApproveUsers) {
            return { status: "approved", reason: "Authenticated commenter" };
          }

          return { status: "approved", reason: "Passed example moderation rules" };
        },
      },
      "comment:afterCreate": {
        errorPolicy: "continue",
        handler: async (event, ctx) => {
          await ctx.storage.comments.put(
            `comment:${event.comment.id}`,
            {
              createdAt: event.comment.createdAt,
              status: event.comment.status,
              collection: event.comment.collection,
              contentId: event.comment.contentId,
              authorName: event.comment.authorName,
              reason: typeof event.metadata.reason === "string" ? event.metadata.reason : undefined,
            } satisfies CommentEntry,
          );
          await addAudit(ctx, {
            timestamp: new Date().toISOString(),
            type: "comment:create",
            collection: event.comment.collection,
            resourceId: event.comment.id,
            message: `Comment created on ${event.content.slug}`,
          });
        },
      },
      "comment:afterModerate": {
        errorPolicy: "continue",
        handler: async (event, ctx) => {
          await addAudit(ctx, {
            timestamp: new Date().toISOString(),
            type: "comment:moderate",
            collection: event.comment.collection,
            resourceId: event.comment.id,
            message: `Comment moved from ${event.previousStatus} to ${event.newStatus}`,
            metadata: { moderatorId: event.moderator.id },
          });
        },
      },
      "page:metadata": async (event) => {
        if (event.page.kind !== "content") return null;

        if (event.page.content?.collection === "posts") {
          return [
            { kind: "meta", name: "generator", content: "AWCMS-Micro / EmDash" },
            {
              kind: "jsonld",
              id: `schema:${event.page.content.id}`,
              graph: {
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                headline: event.page.pageTitle ?? event.page.title,
                description: event.page.description,
                image: event.page.image ?? undefined,
              },
            },
          ];
        }

        return [{ kind: "meta", name: "generator", content: "AWCMS-Micro / EmDash" }];
      },
      "page:fragments": async (event, ctx) => {
        const enabled = (await ctx.kv.get<boolean>("settings:analyticsEnabled")) ?? true;
        if (!enabled) return null;

        return [
          {
            kind: "inline-script",
            placement: "body:end",
            code: `window.awcmsMicroExample = { path: ${JSON.stringify(event.page.path)} };`,
          },
        ];
      },
      cron: {
        errorPolicy: "continue",
        handler: async (event, ctx) => {
          if (event.name !== "audit-cleanup") return;

          const maxEntries =
            (await ctx.kv.get<number>("settings:maxAuditEntries")) ??
            options.maxAuditEntries ??
            DEFAULT_MAX_AUDIT_ENTRIES;

          await trimCollection(ctx, "audit", maxEntries);
          await trimCollection(ctx, "notifications", Math.max(50, Math.floor(maxEntries / 2)));
        },
      },
    },
    routes: {
      overview: {
        handler: async (ctx) => {
          const [auditCount, analyticsCount, notificationsCount, commentsCount, tasks] = await Promise.all([
            ctx.storage.audit.count(),
            ctx.storage.analytics.count(),
            ctx.storage.notifications.count(),
            ctx.storage.comments.count(),
            ctx.cron?.list() ?? Promise.resolve([]),
          ]);

          return {
            pluginId: ctx.plugin.id,
            version: ctx.plugin.version,
            auditCount,
            analyticsCount,
            notificationsCount,
            commentsCount,
            scheduledTasks: tasks,
          };
        },
      },
      "activity/list": {
        input: z.object({ limit: z.number().min(1).max(50).default(15), cursor: z.string().optional() }),
        handler: async (ctx) => {
          const input = ctx.input as { limit: number; cursor?: string };
          const result = await ctx.storage.audit.query({
            orderBy: { timestamp: "desc" },
            limit: input.limit,
            cursor: input.cursor,
          });

          return {
            items: result.items.map((item: { id: string; data: unknown }) => ({
              id: item.id,
              ...(item.data as AuditEntry),
            })),
            cursor: result.cursor,
            hasMore: result.hasMore,
          };
        },
      },
      "comments/list": {
        handler: async (ctx) => {
          const result = await ctx.storage.comments.query({
            orderBy: { createdAt: "desc" },
            limit: 20,
          });

          return {
            items: result.items.map((item: { id: string; data: unknown }) => ({
              id: item.id,
              ...(item.data as CommentEntry),
            })),
          };
        },
      },
      settings: {
        handler: async (ctx) => {
          const entries = await ctx.kv.list("settings:");
          const result: Record<string, unknown> = {};
          for (const entry of entries) {
            result[entry.key.replace("settings:", "")] = entry.value;
          }
          return result;
        },
      },
      "settings/save": {
        input: z.object({
          enabled: z.boolean().optional(),
          analyticsEnabled: z.boolean().optional(),
          maxAuditEntries: z.number().min(25).max(1000).optional(),
          notifyEmail: z.email().optional(),
          docsUrl: z.url().optional(),
          apiKey: z.string().optional(),
          theme: z.enum(["system", "light", "dark"]).optional(),
        }),
        handler: async (ctx) => {
          for (const [key, value] of Object.entries(ctx.input)) {
            if (value !== undefined) {
              await ctx.kv.set(`settings:${key}`, value);
            }
          }
          return { success: true };
        },
      },
      "network/ping": {
        handler: async (ctx) => {
          if (!ctx.http) return { ok: false, error: "Network capability unavailable" };

          const response = await ctx.http.fetch("https://api.github.com/repos/emdash-cms/emdash", {
            headers: { Accept: "application/vnd.github+json" },
          });

          if (!response.ok) {
            return { ok: false, status: response.status };
          }

          const payload = (await response.json()) as Record<string, unknown>;
          return {
            ok: true,
            repo: payload.full_name,
            stars: payload.stargazers_count,
            updatedAt: payload.updated_at,
          };
        },
      },
      "users/summary": {
        handler: async (ctx) => {
          if (!ctx.users) return { count: 0, items: [] };
          const result = await ctx.users.list({ limit: 5 });
          return { count: result.items.length, items: result.items };
        },
      },
      "media/upload-url": {
        input: z.object({ filename: z.string().min(1), contentType: z.string().min(1) }),
        handler: async (ctx) => {
          const input = ctx.input as { filename: string; contentType: string };
          if (!ctx.media?.getUploadUrl) {
            return { ok: false, error: "Media write capability unavailable" };
          }
          const upload = await ctx.media.getUploadUrl(input.filename, input.contentType);
          return { ok: true, ...upload };
        },
      },
      "content/recent": {
        public: true,
        handler: async (ctx) => {
          if (!ctx.content) return { items: [] };
          const result = await ctx.content.list("posts", { limit: 5 });
          return {
            items: result.items.map((item: any) => ({
              id: item.id,
              title: item.data?.title,
              status: item.status,
            })),
          };
        },
      },
      notifications: {
        handler: async (ctx) => {
          const result = await ctx.storage.notifications.query({
            where: { status: "unread" },
            orderBy: { createdAt: "desc" },
            limit: 10,
          });
          return {
            items: result.items.map((item: { id: string; data: unknown }) => ({
              id: item.id,
              ...(item.data as NotificationEntry),
            })),
          };
        },
      },
    },
  });
}

export default awcmsMicroPlugin;
