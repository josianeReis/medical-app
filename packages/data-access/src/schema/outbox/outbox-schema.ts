import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';

export const outboxEvent = pgTable('outbox_event', {
  id: uuid('id').defaultRandom().primaryKey(),
  aggregateId: uuid('aggregate_id').notNull(),
  aggregateType: text('aggregate_type').notNull(),
  eventType: text('event_type').notNull(),
  payload: text('payload').notNull(),
  occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
  processedAt: timestamp('processed_at', { withTimezone: true }),
  attempts: integer('attempts').default(0).notNull(),
});