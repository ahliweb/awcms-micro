# Scheduled Publishing Architecture

EmDash 0.18.0 introduces a production-ready scheduled publishing pipeline. This document explains the architecture and how AWCMS-Micro's Cloudflare template integrates with it.

## How It Works

Content marked `scheduled` with a future `scheduled_at` timestamp is auto-published when the deadline passes. On Cloudflare Workers, a **Cron Trigger** fires the sweep every minute; on Node.js, a `setTimeout`-based scheduler polls every 1–60 seconds.

```mermaid
sequenceDiagram
    participant CF as Cloudflare Cron Trigger<br/>(* * * * *)
    participant W as Worker scheduled()
    participant RT as EmDash Runtime
    participant D1 as D1 Database
    participant Cache as Edge Cache

    CF->>W: scheduled event
    W->>RT: runScheduledTasks()
    RT->>D1: SELECT * WHERE status='scheduled'<br/>AND scheduled_at <= now()
    D1-->>RT: due content refs
    loop for each collection batch
        RT->>D1: UPDATE status='published'
        D1-->>RT: published refs
        RT->>Cache: invalidate cache tags<br/>(collection + id)
    end
    RT->>D1: plugin cron tasks
    RT->>D1: system cleanup (stale locks, expired sessions)
    W-->>CF: waitUntil resolved
```

## Worker Entry Point

The Cloudflare template `src/worker.ts` re-exports the complete worker from `@emdash-cms/cloudflare/worker`:

```typescript
export { default, PluginBridge } from "@emdash-cms/cloudflare/worker";
```

This single re-export provides:
- `default` — the Astro SSR handler for HTTP requests
- `scheduled()` — the cron handler that drives publishing, plugin cron, and system cleanup
- `PluginBridge` — the Durable Object re-exported so the sandbox binding resolves

## Wrangler Configuration

`wrangler.jsonc` must include a Cron Trigger so Cloudflare fires the `scheduled()` handler:

```jsonc
"triggers": {
    "crons": ["* * * * *"]
}
```

Without this trigger, scheduled content never auto-publishes on Cloudflare Workers.

## D1 Batch Coalescing (0.18.0)

The same Cloudflare package now ships an opt-in coalescing D1 driver. SELECT queries issued in the same event-loop turn are batched into one `D1.batch()` call, replacing N sequential round trips with one:

```mermaid
flowchart LR
    subgraph Before["Before (0.17.x)"]
        Q1[SELECT posts] --> R1[15–40ms]
        Q2[SELECT news] --> R2[15–40ms]
        Q3[SELECT services] --> R3[15–40ms]
        Q4[SELECT pages] --> R4[15–40ms]
    end

    subgraph After["After (0.18.0 coalescing)"]
        B[D1.batch — 4 SELECTs] --> RB[15–40ms total]
    end
```

## Content References Schema (Migration 043)

Migration 043 (auto-runs on next boot) adds the foundation for typed content-to-content relationships:

```mermaid
erDiagram
    _emdash_relations {
        text id PK
        text name
        text parent_collection
        text child_collection
        text parent_label
        text child_label
        text locale
        text translation_group
        text created_at
        text updated_at
    }

    _emdash_content_references {
        text id PK
        text relation_group
        text parent_group
        text child_group
        integer sort_order
        text created_at
    }

    _emdash_relations ||--o{ _emdash_content_references : "relation_group"
```

Both tables are locale-aware and use `translation_group` ULIDs to link content across locales without SQL foreign keys, following the same pattern as taxonomy edges.

## Node.js Dev Environment

In the Node template, `NodeCronScheduler` (new in 0.18.0) polls every 1–60 seconds using `setTimeout`. The cap is 60 seconds to match Cloudflare Cron Trigger cadence:

```mermaid
stateDiagram-v2
    [*] --> Idle: start()
    Idle --> Calculating: timer fires
    Calculating --> Running: getNextDueTime()
    Running --> Publishing: publishDueContent()
    Publishing --> Cleanup: system cleanup
    Cleanup --> Idle: re-arm setTimeout
    Running --> Idle: no due tasks (re-arm, up to 60s)
```

## References

- EmDash PR #1312 — scheduling heartbeat driver (32 files)
- EmDash commit `c39789c` — `fix(scheduling): drive scheduled publishing from a real heartbeat`
- New file: `packages/cloudflare/src/worker.ts`
- New file: `packages/core/src/scheduled-publish.ts`
- New file: `packages/core/src/plugins/scheduler/node.ts`
- GitHub issue [#201](https://github.com/ahliweb/awcms-micro/issues/201) — adopt new worker.ts pattern
- GitHub issue [#202](https://github.com/ahliweb/awcms-micro/issues/202) — content references planning
