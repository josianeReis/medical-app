import { QueueEntry } from '@/domain/entities/queue-entry';
import { QueueEntryRepository } from '@/application/ports/out/queue-entry-repository';
import { publishQueueUpdate } from '@/infrastructure/plugins/event-bus';
import {
	DefaultResponse,
	defaultResponse,
} from '@/domain/shared/default-response';

export type CallNextInput = {
	roomId: string;
};

export type CallNextOutput = DefaultResponse<QueueEntry | null, string>;

export class CallNextPatientUseCase {
	constructor(private readonly queueRepository: QueueEntryRepository) {}

	async execute(input: CallNextInput): Promise<CallNextOutput> {
		const next = await this.queueRepository.getAndLockNextWaiting(input.roomId);
		if (!next) {
			return defaultResponse(null, 'errors.queue.empty');
		}

		publishQueueUpdate({
			roomId: next.roomId,
			entryId: next.id,
			state: next.state,
			ticketNo: next.ticketNo,
		});
		return defaultResponse(next);
	}
}
