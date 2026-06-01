import type { SikesraApiErrorBody, SikesraApiWarning } from "./errors.js";
import type { SikesraPagination } from "./pagination.js";

export interface SikesraApiSuccess<T> {
	ok: true;
	data: T;
	meta?: {
		requestId?: string;
		pagination?: SikesraPagination;
		warnings?: SikesraApiWarning[];
	};
}

export interface SikesraApiError {
	ok: false;
	error: SikesraApiErrorBody;
}

export type SikesraApiResponse<T> = SikesraApiSuccess<T> | SikesraApiError;

export function sikesraOk<T>(
	data: T,
	meta?: SikesraApiSuccess<T>["meta"],
): SikesraApiSuccess<T> {
	return meta ? { ok: true, data, meta } : { ok: true, data };
}

export function sikesraError(error: SikesraApiErrorBody): SikesraApiError {
	return { ok: false, error };
}
