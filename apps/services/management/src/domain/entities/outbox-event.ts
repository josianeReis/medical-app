import { outboxEvent } from '@packages/data-access';
import { InferSelectModel } from 'drizzle-orm';

export type OutboxEvent = InferSelectModel<typeof outboxEvent>;
