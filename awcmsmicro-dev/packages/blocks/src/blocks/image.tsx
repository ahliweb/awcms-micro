import type { ImageBlock } from "../types.js";

const SAFE_IMAGE_URL_RE = /^(https?:|\/(?!\/))/i;

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

function sanitizeImageUrl(url: string): string | null {
	if (!url) return null;
	return SAFE_IMAGE_URL_RE.test(url) ? url : null;
}

export function ImageBlockComponent({ block }: { block: ImageBlock }) {
	const src = sanitizeImageUrl(block.url);
	const alt = escapeHtml(block.alt ?? "");
	const caption = block.title ? escapeHtml(block.title) : null;

	if (!src) return null;

	return (
		<figure>
			<img src={src} alt={alt} className="max-w-full rounded" />
			{caption && <figcaption className="mt-1 text-sm text-kumo-subtle">{caption}</figcaption>}
		</figure>
	);
}
