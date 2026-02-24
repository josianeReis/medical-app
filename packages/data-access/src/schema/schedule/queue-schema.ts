import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { generateId } from '../../utils';
import { patient } from '../patient/patient-schema';
import { appointment } from './appointment-schema';
import { room } from './room-schema';

export const queueEntryStateEnum = [
	'WAITING',
	'CALLED',
	'SKIPPED',
	'FINISHED',
] as const;
export type QueueEntryState = (typeof queueEntryStateEnum)[number];

export const queueEntry = pgTable('queue_entry', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => generateId()),
	roomId: text('room_id')
		.notNull()
		.references(() => room.id, { onDelete: 'cascade' }),
	patientId: text('patient_id')
		.notNull()
		.references(() => patient.id, { onDelete: 'cascade' }),
	appointmentId: text('appointment_id').references(() => appointment.id, {
		onDelete: 'set null',
	}),
	ticketNo: text('ticket_no').notNull(),
	priority: integer('priority').notNull().default(0),
	state: text('state').$type<QueueEntryState>().default('WAITING'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const queueEntryRelations = relations(queueEntry, ({ one }) => ({
	room: one(room, { fields: [queueEntry.roomId], references: [room.id] }),
	patient: one(patient, {
		fields: [queueEntry.patientId],
		references: [patient.id],
	}),
	appointment: one(appointment, {
		fields: [queueEntry.appointmentId],
		references: [appointment.id],
	}),
}));
