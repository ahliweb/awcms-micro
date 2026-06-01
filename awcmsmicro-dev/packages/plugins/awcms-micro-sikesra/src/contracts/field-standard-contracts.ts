export type SikesraFieldDataClass = "non_personal" | "personal" | "sensitive_personal" | "restricted";

export interface SikesraFieldStandardDto {
	key: string;
	label: string;
	module: string;
	fieldGroup: string;
	dataClass: SikesraFieldDataClass;
	required: boolean;
	dataType: string;
	storageTable: string;
	importable: boolean;
	exportable: boolean;
	publicSafe: boolean;
	maskByDefault: boolean;
	validationRules: string[];
}
