import { QueueEntry } from '@/domain/entities/queue-entry';
import {
	CreateQueueEntryData,
	QueueEntryRepository,
} from '@/application/ports/out/queue-entry-repository';
import {
	DefaultResponse,
	defaultResponse,
} from '@/domain/shared/default-response';
import { publishQueueUpdate } from '@/infrastructure/plugins/event-bus';

export type CheckInInput = CreateQueueEntryData & {
	roomId: string;
};

export type CheckInOutput = DefaultResponse<QueueEntry, null>;

export class CheckInUseCase {
	constructor(private readonly queueRepository: QueueEntryRepository) {}

	async execute(input: CheckInInput): Promise<CheckInOutput> {
		// TODO: add validation such as duplicate ticket check, sequence generation, etc.
		const entry = await this.queueRepository.create({ ...input });
		publishQueueUpdate({
			roomId: entry.roomId,
			entryId: entry.id,
			state: entry.state,
			ticketNo: entry.ticketNo,
		});
		return defaultResponse(entry);
	}
}
