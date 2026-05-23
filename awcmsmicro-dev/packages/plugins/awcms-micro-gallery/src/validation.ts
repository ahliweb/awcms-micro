export const AWCMS_GALLERY_COLLECTION = "galleries";

export const GALLERY_TYPES = ["photo", "video", "mixed"] as const;
export const GALLERY_LAYOUTS = ["grid", "masonry", "carousel", "slider"] as const;
export const IMAGE_MIME_PREFIX = "image/";
export const VIDEO_MIME_PREFIX = "video/";
export const DEFAULT_MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const DEFAULT_MAX_VIDEO_BYTES = 250 * 1024 * 1024;

export type GalleryType = (typeof GALLERY_TYPES)[number];
export type GalleryLayout = (typeof GALLERY_LAYOUTS)[number];
export type GalleryItemType = "image" | "video";

export interface GalleryItem {
	type: GalleryItemType;
	src: string;
	mimeType?: string;
	filename?: string;
	sizeBytes?: number;
	alt?: string;
	caption?: string;
	poster?: string;
	provider?: "emdash-media" | "cloudflare-images" | "cloudflare-stream" | "external";
}

export interface GalleryValidationOptions {
	maxImageBytes?: number;
	maxVideoBytes?: number;
}

export interface GalleryValidationResult {
	valid: boolean;
	errors: string[];
}

const SAFE_FILENAME_RE = /^[a-z0-9][a-z0-9._-]{0,127}$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAllowedType(value: unknown, allowed: readonly string[]): value is string {
	return typeof value === "string" && allowed.includes(value);
}

function isSafePublicUrl(value: string): boolean {
	if (value.startsWith("/_emdash/api/media/file/")) return true;
	if (value.startsWith("/uploads/")) return true;
	if (value.startsWith("https://")) return true;
	return false;
}

function validateFilename(filename: string | undefined, index: number, errors: string[]): void {
	if (!filename) return;
	if (filename.includes("/") || filename.includes("\\") || filename.includes("..")) {
		errors.push(`Item ${index + 1} filename must not include path segments`);
		return;
	}
	if (!SAFE_FILENAME_RE.test(filename)) {
		errors.push(`Item ${index + 1} filename must use only letters, numbers, dots, dashes, and underscores`);
	}
}

export function validateGalleryItem(
	value: unknown,
	index = 0,
	options: GalleryValidationOptions = {},
): GalleryValidationResult {
	const errors: string[] = [];
	const maxImageBytes = options.maxImageBytes ?? DEFAULT_MAX_IMAGE_BYTES;
	const maxVideoBytes = options.maxVideoBytes ?? DEFAULT_MAX_VIDEO_BYTES;

	if (!isRecord(value)) {
		return { valid: false, errors: [`Item ${index + 1} must be an object`] };
	}

	const type = value.type;
	const src = value.src;
	const mimeType = value.mimeType;
	const sizeBytes = value.sizeBytes;
	const filename = value.filename;

	if (type !== "image" && type !== "video") {
		errors.push(`Item ${index + 1} type must be image or video`);
	}
	if (typeof src !== "string" || src.length === 0 || !isSafePublicUrl(src)) {
		errors.push(`Item ${index + 1} must use a public EmDash media URL or HTTPS URL`);
	}
	if (typeof mimeType === "string") {
		if (type === "image" && !mimeType.startsWith(IMAGE_MIME_PREFIX)) {
			errors.push(`Item ${index + 1} image MIME type must start with image/`);
		}
		if (type === "video" && !mimeType.startsWith(VIDEO_MIME_PREFIX)) {
			errors.push(`Item ${index + 1} video MIME type must start with video/`);
		}
	}
	if (typeof sizeBytes === "number") {
		if (type === "image" && sizeBytes > maxImageBytes) {
			errors.push(`Item ${index + 1} image exceeds the ${maxImageBytes} byte limit`);
		}
		if (type === "video" && sizeBytes > maxVideoBytes) {
			errors.push(`Item ${index + 1} video exceeds the ${maxVideoBytes} byte limit`);
		}
	}
	if (typeof filename === "string") validateFilename(filename, index, errors);
	if (type === "image" && typeof value.alt !== "string") {
		errors.push(`Item ${index + 1} image requires alt text`);
	}
	if (type === "video" && typeof value.caption !== "string") {
		errors.push(`Item ${index + 1} video requires a caption`);
	}

	return { valid: errors.length === 0, errors };
}

export function validateGalleryContent(
	content: unknown,
	options: GalleryValidationOptions = {},
): GalleryValidationResult {
	const errors: string[] = [];
	if (!isRecord(content)) return { valid: false, errors: ["Gallery content must be an object"] };

	if (typeof content.title !== "string" || content.title.trim().length === 0) {
		errors.push("Gallery title is required");
	}
	if (!isAllowedType(content.gallery_type, GALLERY_TYPES)) {
		errors.push("Gallery type must be photo, video, or mixed");
	}
	if (!isAllowedType(content.layout_variant, GALLERY_LAYOUTS)) {
		errors.push("Layout variant must be grid, masonry, carousel, or slider");
	}
	if (!Array.isArray(content.gallery_items)) {
		errors.push("Gallery items must be an array");
	} else {
		content.gallery_items.forEach((item, index) => {
			errors.push(...validateGalleryItem(item, index, options).errors);
		});
	}

	return { valid: errors.length === 0, errors };
}

export function sanitizeGallerySettings(value: Record<string, unknown>) {
	return {
		maxImageBytes:
			typeof value.maxImageBytes === "number" && value.maxImageBytes > 0
				? Math.floor(value.maxImageBytes)
				: DEFAULT_MAX_IMAGE_BYTES,
		maxVideoBytes:
			typeof value.maxVideoBytes === "number" && value.maxVideoBytes > 0
				? Math.floor(value.maxVideoBytes)
				: DEFAULT_MAX_VIDEO_BYTES,
		cloudflareImagesEnabled: value.cloudflareImagesEnabled === true,
		cloudflareStreamEnabled: value.cloudflareStreamEnabled === true,
	};
}
