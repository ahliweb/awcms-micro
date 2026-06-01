import { sikesraError, sikesraOk, type SikesraApiResponse } from "../contracts/index.js";
import { SIKESRA_ERROR_CODES } from "../contracts/index.js";

export type SikesraServiceResult<T> = SikesraApiResponse<T>;

export function serviceOk<T>(data: T): SikesraServiceResult<T> {
	return sikesraOk(data);
}

export function serviceNotImplemented<T>(workflow: string): SikesraServiceResult<T> {
	return sikesraError({
		code: SIKESRA_ERROR_CODES.serverError,
		message: `${workflow} service is defined but not implemented yet.`,
	});
}
