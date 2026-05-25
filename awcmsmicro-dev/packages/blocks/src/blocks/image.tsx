import type { ImageBlock } from "../types.js";

const HAS_SCHEME_RE = /^[a-z][a-z0-9+.-]*:/i;

function isSafePreviewUrl(url: string): boolean {
	if (!url) return false;
	if (HAS_SCHEME_RE.test(url)) {
		try {
			const parsed = new URL(url);
			return parsed.protocol === "http:" || parsed.protocol === "https:";
		} catch {
			return false;
		}
	}
	return url.startsWith("/") && !url.startsWith("//") && !url.includes("\\");
}

export function ImageBlockComponent({ block }: { block: ImageBlock }) {
	const url = block.url;
	const canPreview = isSafePreviewUrl(url);
	if (!canPreview) return null;

	return (
		<figure>
			<img src={url} alt={block.alt} className="max-w-full rounded" referrerPolicy="no-referrer" />
			{block.title && (
				<figcaption className="mt-1 text-sm text-kumo-subtle">{block.title}</figcaption>
			)}
		</figure>
	);
}
