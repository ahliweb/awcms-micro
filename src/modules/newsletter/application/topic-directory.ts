/**
 * Topic / subscription-list data access (Issue #272, ADR-0033) over
 * `awcms_micro_newsletter_topics` (sql/091). Every query runs inside a
 * caller-provided tenant transaction (RLS FORCE'd). Topics are never hard-deleted
 * (append-only-evidence posture) — a topic is deactivated via `is_active=false`.
 */
export type NewsletterTopic = {
  id: string;
  topicKey: string;
  name: string;
  description: string | null;
  locale: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type TopicRow = {
  id: string;
  topic_key: string;
  name: string;
  description: string | null;
  locale: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

function toTopic(row: TopicRow): NewsletterTopic {
  return {
    id: row.id,
    topicKey: row.topic_key,
    name: row.name,
    description: row.description,
    locale: row.locale,
    isDefault: row.is_default,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

const TOPIC_COLUMNS =
  "id, topic_key, name, description, locale, is_default, is_active, created_at, updated_at";

export async function listTopics(
  tx: Bun.SQL,
  tenantId: string,
  options: { activeOnly?: boolean } = {}
): Promise<NewsletterTopic[]> {
  const activeOnly = options.activeOnly ?? false;
  const rows = (await tx`
    SELECT ${tx.unsafe(TOPIC_COLUMNS)}
    FROM awcms_micro_newsletter_topics
    WHERE tenant_id = ${tenantId}
      AND (${activeOnly}::boolean = false OR is_active = true)
    ORDER BY is_default DESC, name ASC
  `) as TopicRow[];
  return rows.map(toTopic);
}

export async function findTopicById(
  tx: Bun.SQL,
  tenantId: string,
  topicId: string
): Promise<NewsletterTopic | null> {
  const rows = (await tx`
    SELECT ${tx.unsafe(TOPIC_COLUMNS)}
    FROM awcms_micro_newsletter_topics
    WHERE tenant_id = ${tenantId} AND id = ${topicId}
  `) as TopicRow[];
  return rows[0] ? toTopic(rows[0]) : null;
}

/** Resolve (or lazily create) the default topic for a tenant/locale — the list a bare subscribe opts into. */
export async function getOrCreateDefaultTopic(
  tx: Bun.SQL,
  tenantId: string,
  locale: string
): Promise<NewsletterTopic> {
  const existing = (await tx`
    SELECT ${tx.unsafe(TOPIC_COLUMNS)}
    FROM awcms_micro_newsletter_topics
    WHERE tenant_id = ${tenantId} AND is_default = true AND is_active = true
    ORDER BY created_at ASC
    LIMIT 1
  `) as TopicRow[];
  if (existing[0]) return toTopic(existing[0]);

  const rows = (await tx`
    INSERT INTO awcms_micro_newsletter_topics
      (tenant_id, topic_key, name, description, locale, is_default, is_active)
    VALUES (${tenantId}, 'general', 'General', 'Default subscription list', ${locale}, true, true)
    ON CONFLICT (tenant_id, topic_key) DO UPDATE SET updated_at = now()
    RETURNING ${tx.unsafe(TOPIC_COLUMNS)}
  `) as TopicRow[];
  return toTopic(rows[0]!);
}

export async function createTopic(
  tx: Bun.SQL,
  tenantId: string,
  input: {
    topicKey: string;
    name: string;
    description: string | null;
    locale: string;
    isDefault: boolean;
  }
): Promise<NewsletterTopic> {
  const rows = (await tx`
    INSERT INTO awcms_micro_newsletter_topics
      (tenant_id, topic_key, name, description, locale, is_default, is_active)
    VALUES (${tenantId}, ${input.topicKey}, ${input.name}, ${input.description},
            ${input.locale}, ${input.isDefault}, true)
    RETURNING ${tx.unsafe(TOPIC_COLUMNS)}
  `) as TopicRow[];
  return toTopic(rows[0]!);
}

export async function updateTopic(
  tx: Bun.SQL,
  tenantId: string,
  topicId: string,
  input: {
    name: string;
    description: string | null;
    isDefault: boolean;
    isActive: boolean;
  }
): Promise<NewsletterTopic | null> {
  const rows = (await tx`
    UPDATE awcms_micro_newsletter_topics
    SET name = ${input.name},
        description = ${input.description},
        is_default = ${input.isDefault},
        is_active = ${input.isActive},
        updated_at = now()
    WHERE tenant_id = ${tenantId} AND id = ${topicId}
    RETURNING ${tx.unsafe(TOPIC_COLUMNS)}
  `) as TopicRow[];
  return rows[0] ? toTopic(rows[0]) : null;
}
