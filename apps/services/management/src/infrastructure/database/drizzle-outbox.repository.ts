import { OutboxRepository } from '@/application/ports/out/outbox-repository';
import { OutboxEvent } from '@/domain/entities/outbox-event';
import { db as globalDb } from '@/infrastructure/config/db';
import { DbClientTransaction, outboxEvent } from '@packages/data-access';
import { eq, isNull, sql } from 'drizzle-orm';

export class DrizzleOutboxRepository implements OutboxRepository {
	private readonly dbClient: DbClientTransaction | typeof globalDb;
	constructor(private readonly tx?: DbClientTransaction) {
		this.dbClient = this.tx ? this.tx : globalDb;
	}

	async enqueue(
		event: Omit<OutboxEvent, 'id' | 'occurredAt' | 'processedAt' | 'attempts'>,
	) {
		await this.dbClient.insert(outboxEvent).values(event);
	}

	async fetchPending(limit: number): Promise<OutboxEvent[]> {
		return this.dbClient
			.select()
			.from(outboxEvent)
			.where(isNull(outboxEvent.processedAt))
			.limit(limit);
	}

	async markProcessed(id: string): Promise<void> {
		await this.dbClient
			.update(outboxEvent)
			.set({ processedAt: new Date() })
			.where(eq(outboxEvent.id, id));
	}

	async incrementAttempts(id: string): Promise<void> {
		await this.dbClient
			.update(outboxEvent)
			.set({ attempts: sql`${outboxEvent.attempts} + 1` })
			.where(eq(outboxEvent.id, id));
	}
}
