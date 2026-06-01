export interface SikesraD1Result<T> {
	results?: T[];
}

export interface SikesraD1PreparedStatement<T = unknown> {
	bind(...values: unknown[]): SikesraD1PreparedStatement<T>;
	all(): Promise<SikesraD1Result<T>>;
	first(): Promise<T | null>;
}

export interface SikesraD1Database {
	prepare<T = unknown>(query: string): SikesraD1PreparedStatement<T>;
}

export interface SikesraRepositoryScope {
	tenantId: string;
	siteId: string;
}

export function requireSikesraD1Database(db: SikesraD1Database | null | undefined): SikesraD1Database {
	if (!db) {
		throw new Error("SIKESRA D1 database binding is required for repository access.");
	}

	return db;
}
