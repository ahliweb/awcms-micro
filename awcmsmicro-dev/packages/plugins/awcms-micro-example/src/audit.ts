export interface ExampleAuditEvent {
	action: string;
	resource: string;
	actor?: string;
	metadata?: Record<string, unknown>;
}

export function createAuditRecord(event: ExampleAuditEvent) {
	return {
		timestamp: new Date().toISOString(),
		action: event.action,
		resource: event.resource,
		actor: event.actor ?? "system",
		metadata: event.metadata ?? {},
	};
}
