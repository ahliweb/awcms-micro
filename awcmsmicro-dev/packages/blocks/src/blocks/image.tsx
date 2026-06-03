import type { ImageBlock } from "../types.js";

export function ImageBlockComponent({ block }: { block: ImageBlock }) {
	const src = sanitizeImageSrc(block.url);
	return (
		<figure>
			{src && <img src={src} alt={block.alt} className="max-w-full rounded" />}
			{block.title && (
				<figcaption className="mt-1 text-sm text-kumo-subtle">{block.title}</figcaption>
			)}
		</figure>
	);
}

function sanitizeImageSrc(value: string) {
	try {
		const url = new URL(value, "https://emdash.local");
		if (url.protocol !== "http:" && url.protocol !== "https:") return null;
		if (url.origin === "https://emdash.local") return `${url.pathname}${url.search}${url.hash}`;
		return url.href;
	} catch {
		return null;
	}
}
