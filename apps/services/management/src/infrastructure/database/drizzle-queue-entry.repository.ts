/*
 * Drizzle implementation of QueueEntryRepository
 */
import {
	QueueEntryRepository,
	CreateQueueEntryData,
} from '@/application/ports/out/queue-entry-repository';
import { QueueEntry, QueueEntryState } from '@/domain/entities/queue-entry';
import { db as globalDb } from '@/infrastructure/config/db';
import { schema } from '@packages/data-access';
import { eq, and, sql } from 'drizzle-orm';
import { DbClientTransaction } from '@packages/data-access';

export class DrizzleQueueEntryRepository implements QueueEntryRepository {
	private readonly dbClient: DbClientTransaction | typeof globalDb;
	constructor(private readonly tx?: DbClientTransaction) {
		this.dbClient = this.tx ? this.tx : globalDb;
	}

	async create(data: CreateQueueEntryData): Promise<QueueEntry> {
		// Generate ticket if not provided: sequence per room + day (YYYYMMDD)
		let ticketNo = data.ticketNo;
		if (!ticketNo) {
			const today = new Date();
			const dayKey = today.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
			// count existing entries
			const [{ count }] = await this.dbClient
				.select({ count: sql<number>`count(*)`.mapWith(Number) })
				.from(schema.queueEntry)
				.where(
					and(
						eq(schema.queueEntry.roomId, data.roomId!),
						eq(
							sql`to_char(${schema.queueEntry.createdAt}, 'YYYYMMDD')`,
							dayKey,
						),
					),
				);
			ticketNo = String(count + 1).padStart(3, '0');
		}

		const [row] = await this.dbClient
			.insert(schema.queueEntry)
			.values({
				...data,
				ticketNo,
				state: data.state ?? 'WAITING',
			})
			.returning();
		return row;
	}

	async findWaitingByRoom(roomId: string): Promise<QueueEntry[]> {
		return this.dbClient
			.select()
			.from(schema.queueEntry)
			.where(
				and(
					eq(schema.queueEntry.roomId, roomId),
					eq(schema.queueEntry.state, 'WAITING'),
				),
			)
			.orderBy(sql`priority DESC`, sql`created_at ASC`);
	}

	async getAndLockNextWaiting(roomId: string): Promise<QueueEntry | null> {
		// Use FOR UPDATE SKIP LOCKED; Not available high-level; use raw.
		const result = await this.dbClient.execute<QueueEntry>(sql`
			WITH next_entry AS (
				SELECT * FROM queue_entry
				WHERE room_id = ${roomId} AND state = 'WAITING'
				ORDER BY priority DESC, created_at ASC
				LIMIT 1
				FOR UPDATE SKIP LOCKED
			)
			UPDATE queue_entry
			SET state = 'CALLED', updated_at = NOW()
			FROM next_entry
			WHERE queue_entry.id = next_entry.id
			RETURNING queue_entry.*;
		`);
		return result.rows[0] ?? null;
	}

	async updateState(
		id: string,
		state: QueueEntryState,
	): Promise<QueueEntry | null> {
		const [row] = await this.dbClient
			.update(schema.queueEntry)
			.set({ state, updatedAt: new Date() })
			.where(eq(schema.queueEntry.id, id))
			.returning();
		return row ?? null;
	}

	async updatePriority(
		id: string,
		priority: number,
	): Promise<QueueEntry | null> {
		const [row] = await this.dbClient
			.update(schema.queueEntry)
			.set({ priority, updatedAt: new Date() })
			.where(eq(schema.queueEntry.id, id))
			.returning();
		return row ?? null;
	}

	async transfer(id: string, targetRoomId: string): Promise<QueueEntry | null> {
		const [row] = await this.dbClient
			.update(schema.queueEntry)
			.set({ roomId: targetRoomId, updatedAt: new Date() })
			.where(eq(schema.queueEntry.id, id))
			.returning();
		return row ?? null;
	}

	async findById(id: string): Promise<QueueEntry | null> {
		return (
			(await this.dbClient.query.queueEntry.findFirst({
				where: eq(schema.queueEntry.id, id),
			})) ?? null
		);
	}
}
