import type { ImageBlock } from "../types.js";

function sanitizeImageUrl(url: string): string | null {
	if (!url) return null;
	if (url.startsWith("/")) {
		return url.startsWith("//") ? null : url;
	}
	try {
		const parsed = new URL(url);
		return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.toString() : null;
	} catch {
		return null;
	}
}

export function ImageBlockComponent({ block }: { block: ImageBlock }) {
	const src = sanitizeImageUrl(block.url);
	const alt = block.alt ?? "";
	const caption = block.title ?? null;

	if (!src) return null;

	return (
		<figure>
			<img src={src} alt={alt} className="max-w-full rounded" />
			{caption && <figcaption className="mt-1 text-sm text-kumo-subtle">{caption}</figcaption>}
		</figure>
	);
}
