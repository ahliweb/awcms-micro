export type SikesraUiStateStatus =
	| "idle"
	| "loading"
	| "success"
	| "empty"
	| "validation_error"
	| "permission_denied"
	| "abac_denied"
	| "server_error"
	| "stale_data"
	| "saving"
	| "saved";

export interface SikesraUiState<TData = unknown> {
	status: SikesraUiStateStatus;
	data?: TData;
	message?: string;
	fieldErrors?: Record<string, string[]>;
	requestId?: string;
}

export function createSikesraUiState<TData>(status: SikesraUiStateStatus, data?: TData): SikesraUiState<TData> {
	return data === undefined ? { status } : { status, data };
}
