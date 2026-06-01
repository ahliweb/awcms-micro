export type SikesraSortDirection = "asc" | "desc";

export interface SikesraPaginationRequest {
	page?: number;
	pageSize?: number;
	sortBy?: string;
	sortDirection?: SikesraSortDirection;
	search?: string;
	filters?: Record<string, string | number | boolean | null>;
	includeDeleted?: boolean;
	viewMode?: "table" | "cards" | "queue" | "audit";
}

export interface SikesraPagination {
	page: number;
	pageSize: number;
	total?: number;
	nextCursor?: string;
}

export function normalizeSikesraPagination(input: SikesraPaginationRequest = {}): Required<Pick<SikesraPaginationRequest, "page" | "pageSize" | "sortDirection">> {
	return {
		page: Math.max(1, Math.trunc(input.page ?? 1)),
		pageSize: Math.min(100, Math.max(1, Math.trunc(input.pageSize ?? 25))),
		sortDirection: input.sortDirection === "asc" ? "asc" : "desc",
	};
}
