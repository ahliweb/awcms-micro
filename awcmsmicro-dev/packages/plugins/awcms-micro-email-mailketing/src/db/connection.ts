export interface MailketingD1Result<T> {
	results?: T[];
}

export interface MailketingD1PreparedStatement<T = unknown> {
	bind(...values: unknown[]): MailketingD1PreparedStatement<T>;
	all(): Promise<MailketingD1Result<T>>;
	first(): Promise<T | null>;
	run?(): Promise<unknown>;
}

export interface MailketingD1Database {
	prepare<T = unknown>(query: string): MailketingD1PreparedStatement<T>;
}

export interface MailketingRepositoryScope {
	tenantId: string;
	siteId: string;
}

export function requireMailketingD1Database(
	db: MailketingD1Database | null | undefined,
): MailketingD1Database {
	if (!db) {
		throw new Error("Mailketing D1 database binding is required.");
	}
	return db;
}
