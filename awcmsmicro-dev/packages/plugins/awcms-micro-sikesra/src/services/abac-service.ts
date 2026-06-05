import type { SikesraAbacDecisionDto, SikesraAbacPreviewRequest } from "../contracts/index.js";
import { SIKESRA_ERROR_CODES, sikesraError } from "../contracts/index.js";
import { serviceOk, type SikesraServiceResult } from "./service-result.js";

export interface SikesraAbacService {
	preview(input: SikesraAbacPreviewRequest): Promise<SikesraServiceResult<SikesraAbacDecisionDto>>;
}

export interface SikesraAbacAttributeAssignment {
	id: string;
	attributes: Record<string, string>;
}

export interface SikesraAbacPolicyRule {
	id: string;
	actions: string[];
	effect: "allow" | "deny";
	requiredSubject?: Record<string, string>;
	requiredResource?: Record<string, string>;
	requiredContext?: Record<string, string>;
}

export interface SikesraAbacServiceOptions {
	subjects?: SikesraAbacAttributeAssignment[];
	resources?: SikesraAbacAttributeAssignment[];
	policies?: SikesraAbacPolicyRule[];
}

function validateAbacPreview(input: SikesraAbacPreviewRequest) {
	const fieldErrors: Record<string, string[]> = {};
	if (!input.subjectId.trim()) fieldErrors.subjectId = ["Subject ID is required."];
	if (!input.resourceId.trim()) fieldErrors.resourceId = ["Resource ID is required."];
	if (!input.action.trim()) fieldErrors.action = ["Action is required."];
	return fieldErrors;
}

function normalizeStringRecord(input: Record<string, unknown> | undefined) {
	const output: Record<string, string> = {};
	for (const [key, value] of Object.entries(input ?? {})) {
		if (typeof value === "string" && value.trim()) output[key] = value.trim();
	}
	return output;
}

function uniqueSorted(values: string[]) {
	return [...new Set(values.map((value) => value.trim()).filter(Boolean))].toSorted((a, b) =>
		a.localeCompare(b),
	);
}

function missingAttributes(required: Record<string, string>, available: Record<string, string>) {
	return Object.keys(required).filter((key) => available[key] === undefined);
}

function attributesMatch(required: Record<string, string>, available: Record<string, string>) {
	return Object.entries(required).every(([key, value]) => available[key] === value);
}

export function createAbacService(options: SikesraAbacServiceOptions = {}): SikesraAbacService {
	return {
		async preview(input) {
			const fieldErrors = validateAbacPreview(input);
			if (Object.keys(fieldErrors).length > 0) {
				return sikesraError({
					code: SIKESRA_ERROR_CODES.validation,
					message: "ABAC preview failed validation.",
					fieldErrors,
				});
			}

			const subjectId = input.subjectId.trim();
			const resourceId = input.resourceId.trim();
			const action = input.action.trim();
			const subject = options.subjects?.find((item) => item.id.trim() === subjectId);
			const resource = options.resources?.find((item) => item.id.trim() === resourceId);

			if (!subject || !resource) {
				return serviceOk({
					allowed: false,
					effect: "deny",
					matchedPolicies: [],
					reasons: [
						!subject
							? `No subject assignment found for ${subjectId}.`
							: `No resource assignment found for ${resourceId}.`,
					],
				});
			}

			const context = normalizeStringRecord(input.context);
			const relevantPolicies = (options.policies ?? []).filter((policy) =>
				policy.actions.map((policyAction) => policyAction.trim()).includes(action),
			);
			const missing = new Set<string>();
			const allowPolicies: string[] = [];
			const denyPolicies: string[] = [];

			for (const policy of relevantPolicies) {
				const requiredSubject = policy.requiredSubject ?? {};
				const requiredResource = policy.requiredResource ?? {};
				const requiredContext = policy.requiredContext ?? {};
				for (const key of [
					...missingAttributes(requiredSubject, subject.attributes),
					...missingAttributes(requiredResource, resource.attributes),
					...missingAttributes(requiredContext, context),
				]) {
					missing.add(key);
				}

				if (
					attributesMatch(requiredSubject, subject.attributes) &&
					attributesMatch(requiredResource, resource.attributes) &&
					attributesMatch(requiredContext, context)
				) {
					if (policy.effect === "deny") denyPolicies.push(policy.id);
					else allowPolicies.push(policy.id);
				}
			}

			if (denyPolicies.length > 0) {
				const matchedPolicies = uniqueSorted(denyPolicies);
				return serviceOk({
					allowed: false,
					effect: "deny",
					matchedPolicies,
					reasons: [`Explicit deny from policy ${matchedPolicies.join(", ")}.`],
				});
			}

			if (allowPolicies.length > 0) {
				const matchedPolicies = uniqueSorted(allowPolicies);
				return serviceOk({
					allowed: true,
					effect: "allow",
					matchedPolicies,
					reasons: [`Allowed by policy ${matchedPolicies.join(", ")}.`],
				});
			}

			const missingList = uniqueSorted([...missing]);
			return serviceOk({
				allowed: false,
				effect: "deny",
				matchedPolicies: [],
				reasons: [
					missingList.length > 0
						? `Missing required attributes: ${missingList.join(", ")}.`
						: `No matching allow policy for action ${action}.`,
				],
			});
		},
	};
}
