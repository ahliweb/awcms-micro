import type { ImageBlock } from "../types.js";

function safeImageSrc(url: string): string | null {
	if (url.startsWith("http://") || url.startsWith("https://")) return url;
	if (url.startsWith("/") && !url.startsWith("//") && !url.includes("\\")) return url;
	return null;
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
