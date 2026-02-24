import { QueueEntry } from '@/domain/entities/queue-entry';
import { QueueEntryRepository } from '@/application/ports/out/queue-entry-repository';
import {
	DefaultResponse,
	defaultResponse,
} from '@/domain/shared/default-response';
import { publishQueueUpdate } from '@/infrastructure/plugins/event-bus';

export type UpdatePriorityInput = { entryId: string; priority: number };
export type UpdatePriorityOutput = DefaultResponse<QueueEntry | null, string>;

export class UpdatePriorityUseCase {
	constructor(private readonly queueRepository: QueueEntryRepository) {}

	async execute(input: UpdatePriorityInput): Promise<UpdatePriorityOutput> {
		const { entryId, priority } = input;
		const entry = await this.queueRepository.updatePriority(entryId, priority);
		if (!entry) {
			return defaultResponse(null, 'errors.queue.entry_not_found');
		}
		publishQueueUpdate({
			roomId: entry.roomId,
			entryId: entry.id,
			state: entry.state,
			ticketNo: entry.ticketNo,
		});
		return defaultResponse(entry);
	}
}
