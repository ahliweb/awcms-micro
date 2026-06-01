export interface SikesraAbacPreviewRequest {
	subjectId: string;
	resourceId: string;
	action: string;
	context?: Record<string, unknown>;
}

export interface SikesraAbacDecisionDto {
	allowed: boolean;
	effect: "allow" | "deny";
	matchedPolicies: string[];
	reasons: string[];
}
