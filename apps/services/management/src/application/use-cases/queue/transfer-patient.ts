import { QueueEntry } from '@/domain/entities/queue-entry';
import { QueueEntryRepository } from '@/application/ports/out/queue-entry-repository';
import {
	DefaultResponse,
	defaultResponse,
} from '@/domain/shared/default-response';
import { publishQueueUpdate } from '@/infrastructure/plugins/event-bus';

export type TransferPatientInput = { entryId: string; targetRoomId: string };
export type TransferPatientOutput = DefaultResponse<QueueEntry | null, string>;

export class TransferPatientUseCase {
	constructor(private readonly queueRepository: QueueEntryRepository) {}

	async execute(input: TransferPatientInput): Promise<TransferPatientOutput> {
		const { entryId, targetRoomId } = input;
		const entry = await this.queueRepository.transfer(entryId, targetRoomId);
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
