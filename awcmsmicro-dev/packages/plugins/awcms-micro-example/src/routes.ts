import { createAuditRecord } from "./audit.js";

export function createExampleRoutes() {
	return {
		"dashboard/summary": {
			handler: async (ctx: {
				log: { info: (message: string, metadata?: Record<string, unknown>) => void };
				plugin: { id: string; version: string };
				input?: unknown;
			}) => {
				const audit = createAuditRecord({
					action: "dashboard.read",
					resource: "dashboard",
					metadata: { input: ctx.input ?? null },
				});

				ctx.log.info("AWCMS-Micro example dashboard summary requested", audit);

				return {
					plugin: ctx.plugin,
					status: "ok",
					tenantReadyPaths: [
						"tenants/default/sites/main/modules/awcms-micro-example/",
						"tenants/{tenant_id}/sites/{site_id}/modules/awcms-micro-example/",
					],
					audit,
				};
			},
		},
	};
}
