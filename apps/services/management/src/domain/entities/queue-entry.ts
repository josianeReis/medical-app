export type QueueEntryState = 'WAITING' | 'CALLED' | 'SKIPPED' | 'FINISHED';

export type QueueEntry = {
	id: string;
	roomId: string;
	patientId: string;
	appointmentId?: string | null;
	ticketNo: string; // formatted string like "017"
	priority: number; // 0 = normal, higher = more priority
	state: QueueEntryState;
	createdAt: Date;
	updatedAt: Date;
};
