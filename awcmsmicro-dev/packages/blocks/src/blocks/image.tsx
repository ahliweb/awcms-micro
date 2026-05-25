import type { ImageBlock } from "../types.js";

function safeImageSrc(url: string): string | null {
	if (!url || url.startsWith("//") || url.includes("\\")) return null;

	try {
		const parsed = new URL(url, "https://example.invalid");
		if (url.startsWith("/")) {
			return parsed.protocol === "https:" || parsed.protocol === "http:" ? url : null;
		}
		return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.href : null;
	} catch {
		return null;
	}
}

export function ImageBlockComponent({ block }: { block: ImageBlock }) {
	const src = safeImageSrc(block.url);
	if (!src) return null;

	return (
		<figure>
			<img src={src} alt={block.alt} className="max-w-full rounded" />
			{block.title && (
				<figcaption className="mt-1 text-sm text-kumo-subtle">{block.title}</figcaption>
			)}
		</figure>
	);
}
