export const SIKESRA_ERROR_CODES = {
	validation: "SIKESRA_VALIDATION_ERROR",
	permissionDenied: "SIKESRA_PERMISSION_DENIED",
	abacDenied: "SIKESRA_ABAC_DENIED",
	notFound: "SIKESRA_NOT_FOUND",
	serverError: "SIKESRA_SERVER_ERROR",
} as const;

export type SikesraErrorCode = (typeof SIKESRA_ERROR_CODES)[keyof typeof SIKESRA_ERROR_CODES];

export interface SikesraApiWarning {
	code: string;
	message: string;
}

export interface SikesraApiErrorBody {
	code: SikesraErrorCode;
	message: string;
	fieldErrors?: Record<string, string[]>;
	requestId?: string;
}
