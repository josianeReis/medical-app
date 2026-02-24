import { OutboxEvent } from '@/domain/entities/outbox-event';

export type OutboxRepository = {
	enqueue(
		event: Omit<OutboxEvent, 'id' | 'occurredAt' | 'processedAt' | 'attempts'>,
	): Promise<void>;
	fetchPending(limit: number): Promise<OutboxEvent[]>;
	markProcessed(id: string): Promise<void>;
	incrementAttempts(id: string): Promise<void>;
};
