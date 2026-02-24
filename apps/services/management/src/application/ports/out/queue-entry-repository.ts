import { QueueEntry, QueueEntryState } from '@/domain/entities/queue-entry';

export type CreateQueueEntryData = Omit<
	QueueEntry,
	'id' | 'createdAt' | 'updatedAt' | 'state' | 'ticketNo'
> & {
	state?: QueueEntryState;
	/** pre-generated ticket number, optional (repo may generate) */
	ticketNo?: string;
};

export type QueueEntryRepository = {
	create(data: CreateQueueEntryData): Promise<QueueEntry>;
	findWaitingByRoom(roomId: string): Promise<QueueEntry[]>;
	getAndLockNextWaiting(roomId: string): Promise<QueueEntry | null>;
	updateState(id: string, state: QueueEntryState): Promise<QueueEntry | null>;
	updatePriority(id: string, priority: number): Promise<QueueEntry | null>;
	transfer(id: string, targetRoomId: string): Promise<QueueEntry | null>;
	findById(id: string): Promise<QueueEntry | null>;
};
