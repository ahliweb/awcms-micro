export type SikesraFieldDataClass =
	| "non_personal"
	| "personal"
	| "sensitive_personal"
	| "restricted";

export type SikesraFieldGroup =
	| "core"
	| "region"
	| "address"
	| "institution"
	| "person"
	| "welfare"
	| "document"
	| "verification"
	| "audit";

export type SikesraFieldDataType =
	| "string"
	| "number"
	| "boolean"
	| "date"
	| "datetime"
	| "enum"
	| "json";

export type SikesraDataModule =
	| "rumah_ibadah"
	| "lembaga_keagamaan"
	| "pendidikan_keagamaan"
	| "lks"
	| "guru_agama"
	| "anak_yatim"
	| "disabilitas"
	| "lansia_terlantar";

export interface SikesraFieldStandardDto {
	key: string;
	label: string;
	module: SikesraDataModule;
	fieldGroup: SikesraFieldGroup;
	dataClass: SikesraFieldDataClass;
	required: boolean;
	dataType: SikesraFieldDataType;
	maxLength?: number;
	enumValues?: string[];
	storageTable: string;
	importable: boolean;
	exportable: boolean;
	publicSafe: boolean;
	maskByDefault: boolean;
	validationRules: string[];
	notes?: string;
}

export interface SikesraModuleFieldValidationSchema {
	module: SikesraDataModule;
	requiredFields: string[];
	importableFields: string[];
	exportableFields: string[];
	publicSafeFields: string[];
	ktpAddressFields: string[];
	domicileAddressFields: string[];
	restrictedExportFields: string[];
}
