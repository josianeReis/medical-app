import { QueueEntry } from '@/domain/entities/queue-entry';
import { QueueEntryRepository } from '@/application/ports/out/queue-entry-repository';
import {
	DefaultResponse,
	defaultResponse,
} from '@/domain/shared/default-response';
import { publishQueueUpdate } from '@/infrastructure/plugins/event-bus';

export type SkipPatientInput = { entryId: string };
export type SkipPatientOutput = DefaultResponse<QueueEntry | null, string>;

export class SkipPatientUseCase {
	constructor(private readonly queueRepository: QueueEntryRepository) {}

	async execute(input: SkipPatientInput): Promise<SkipPatientOutput> {
		const entry = await this.queueRepository.updateState(
			input.entryId,
			'SKIPPED',
		);
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
