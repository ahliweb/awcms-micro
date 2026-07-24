---
"awcms-micro": patch
---

Refresh the committed `graphify-out/` knowledge graph after the docs/skills drift-sync (#341) and prior merges (#335–#340). Incremental `graphify update` re-extraction: 9002 nodes / 30246 edges / 434 communities. The force-graph `graph.html` exceeded the viz node limit and was replaced by a collapsible-tree `GRAPH_TREE.html`. Dated graph backups (`graphify-out/YYYY-MM-DD/`) are now git-ignored alongside `cache/`. Generated artifacts only; no runtime code or behavior change.
