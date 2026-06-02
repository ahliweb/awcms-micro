import { sikesraError, sikesraOk, type SikesraApiResponse } from "./api.js";
import { SIKESRA_ERROR_CODES } from "./errors.js";

export interface SikesraContractRouteContext<TInput = unknown> {
	input: TInput;
	requestId?: string;
}

export type SikesraContractValidator<TInput, TParsed> = (
	input: TInput,
) =>
	| { ok: true; data: TParsed }
	| { ok: false; fieldErrors: Record<string, string[]>; message?: string };

export async function handleSikesraContractRoute<TInput, TParsed, TData>(
	context: SikesraContractRouteContext<TInput>,
	validator: SikesraContractValidator<TInput, TParsed>,
	handler: (input: TParsed) => Promise<TData>,
): Promise<SikesraApiResponse<TData>> {
	const parsed = validator(context.input);
	if (!parsed.ok) {
		return sikesraError({
			code: SIKESRA_ERROR_CODES.validation,
			message: parsed.message ?? "Invalid SIKESRA request payload.",
			fieldErrors: parsed.fieldErrors,
			requestId: context.requestId,
		});
	}

	try {
		return sikesraOk(await handler(parsed.data), { requestId: context.requestId });
	} catch {
		return sikesraError({
			code: SIKESRA_ERROR_CODES.serverError,
			message: "SIKESRA request failed.",
			requestId: context.requestId,
		});
	}
}

export function requireStringField<T extends Record<string, unknown>>(
	input: T,
	field: keyof T & string,
) {
	const value = input[field];
	if (typeof value !== "string" || value.trim().length === 0) {
		return { ok: false as const, fieldErrors: { [field]: ["Required"] } };
	}
	return { ok: true as const, data: value.trim() };
}
