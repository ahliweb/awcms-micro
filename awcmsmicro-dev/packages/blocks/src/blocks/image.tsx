import type { ImageBlock } from "../types.js";
import { isSafePreviewUrl } from "../utils.js";

export function ImageBlockComponent({ block }: { block: ImageBlock }) {
	const src = isSafePreviewUrl(block.url) ? block.url : undefined;
	return (
		<figure>
			<img src={src} alt={block.alt} className="max-w-full rounded" />
			{block.title && (
				<figcaption className="mt-1 text-sm text-kumo-subtle">{block.title}</figcaption>
			)}
		</figure>
	);
}
