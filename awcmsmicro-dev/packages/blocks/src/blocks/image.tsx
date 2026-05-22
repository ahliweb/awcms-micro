import type { ImageBlock } from "../types.js";

function getSafeImageUrl(value: string): string | null {
	if (value.startsWith("/")) return value;

	try {
		const url = new URL(value);
		return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
	} catch {
		return null;
	}
}

export function ImageBlockComponent({ block }: { block: ImageBlock }) {
	const safeUrl = getSafeImageUrl(block.url);
	if (!safeUrl) return null;

	return (
		<figure>
			<img src={safeUrl} alt={block.alt} className="max-w-full rounded" />
			{block.title && (
				<figcaption className="mt-1 text-sm text-kumo-subtle">{block.title}</figcaption>
			)}
		</figure>
	);
}
