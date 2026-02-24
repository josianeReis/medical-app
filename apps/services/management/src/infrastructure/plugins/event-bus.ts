import { EventEmitter } from 'events';

export const queueBus = new EventEmitter();

export type QueueUpdatePayload = {
	roomId: string;
	entryId: string;
	state: string;
	firstName?: string;
	ticketNo: string;
};

export function publishQueueUpdate(payload: QueueUpdatePayload) {
	queueBus.emit('queue.update', payload);
}

export type AppointmentEventPayload = {
	organizationId: string;
	appointmentId: string;
	type: 'CREATED' | 'UPDATED' | 'CANCELLED';
	data: unknown;
};

export function publishAppointmentEvent(payload: AppointmentEventPayload) {
	queueBus.emit('appointment.update', payload);
}
