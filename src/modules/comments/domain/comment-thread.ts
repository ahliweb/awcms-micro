/**
 * Bounded-depth thread builder (Issue #271, ADR-0032). Pure domain — no I/O.
 * Assembles a flat list of approved comments into a bounded-depth reply tree and
 * REJECTS unbounded recursion. A reply's depth is always parent.depth + 1, hard-
 * capped at `HARD_MAX_DEPTH` (matches the DB CHECK on `depth`); a tenant's
 * `max_depth` may only tighten this, never exceed it.
 */
export const HARD_MAX_DEPTH = 4;

export type ThreadCommentInput = {
  id: string;
  parentId: string | null;
  depth: number;
  createdAt: Date;
};

export type ThreadNode<T extends ThreadCommentInput> = T & {
  replies: ThreadNode<T>[];
};

/**
 * Computes the depth a reply to `parentDepth` would have, throwing if it would
 * exceed the effective max (min of the tenant setting and the hard cap). A
 * top-level comment passes `parentDepth = null` and gets depth 0.
 */
export function resolveReplyDepth(
  parentDepth: number | null,
  tenantMaxDepth: number
): number {
  const effectiveMax = Math.min(
    Math.max(0, Math.trunc(tenantMaxDepth)),
    HARD_MAX_DEPTH
  );
  if (parentDepth === null) return 0;
  const depth = parentDepth + 1;
  if (depth > effectiveMax) {
    throw new CommentDepthExceededError(depth, effectiveMax);
  }
  return depth;
}

/**
 * Builds a bounded-depth tree from a flat list. Any node whose parent is missing
 * from the list (e.g. a reply to a non-approved comment) is treated as a root so
 * an approved reply is never silently dropped. Cycles are impossible because the
 * source `depth` is monotonic and validated on write, but we still guard against
 * a self/ancestor reference by only attaching to an already-seen ancestor.
 */
export function buildBoundedThread<T extends ThreadCommentInput>(
  comments: readonly T[]
): ThreadNode<T>[] {
  const byId = new Map<string, ThreadNode<T>>();
  for (const c of comments) {
    byId.set(c.id, { ...c, replies: [] });
  }

  const roots: ThreadNode<T>[] = [];
  for (const c of comments) {
    const node = byId.get(c.id)!;
    const parent = c.parentId ? byId.get(c.parentId) : undefined;
    if (parent && parent.id !== node.id && parent.depth < node.depth) {
      parent.replies.push(node);
    } else {
      roots.push(node);
    }
  }

  const sortByCreated = (a: ThreadNode<T>, b: ThreadNode<T>): number =>
    a.createdAt.getTime() - b.createdAt.getTime();
  const sortRec = (nodes: ThreadNode<T>[]): void => {
    nodes.sort(sortByCreated);
    for (const n of nodes) sortRec(n.replies);
  };
  sortRec(roots);
  return roots;
}

export class CommentDepthExceededError extends Error {
  constructor(
    public readonly attempted: number,
    public readonly max: number
  ) {
    super(
      `Comment reply depth ${attempted} exceeds the maximum allowed depth ${max}.`
    );
    this.name = "CommentDepthExceededError";
  }
}
