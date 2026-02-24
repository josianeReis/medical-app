import { relations, sql } from 'drizzle-orm';
import {
	AnyPgColumn,
	date,
	pgTable,
	text,
	timestamp,
} from 'drizzle-orm/pg-core';
import { generateId } from '../../utils';
import { organization, user } from '../auth/auth-schema';
import { patient } from '../patient/patient-schema';
import { room } from './room-schema';

export const appointmentStatusEnum = [
	'SCHEDULED',
	'RESCHEDULED',
	'CANCELLED',
	'COMPLETED',
] as const;
export type AppointmentStatus = (typeof appointmentStatusEnum)[number];

export const appointment = pgTable('appointment', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => generateId()),
	organizationId: text('organization_id')
		.notNull()
		.references(() => organization.id, { onDelete: 'cascade' }),
	patientId: text('patient_id')
		.notNull()
		.references(() => patient.id, { onDelete: 'cascade' }),
	doctorId: text('doctor_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	roomId: text('room_id')
		.notNull()
		.references(() => room.id, { onDelete: 'cascade' }),
	start: timestamp('start', { mode: 'date', withTimezone: true }).notNull(),
	end: timestamp('end', { mode: 'date', withTimezone: true }).notNull(),
	status: text('status').$type<AppointmentStatus>().default('SCHEDULED'),
	recurrenceRule: text('recurrence_rule'),
	seriesId: text('series_id')
		.references((): AnyPgColumn => appointment.id)
		.default(sql`NULL`),
	overrideDate: date('override_date'),
	createdBy: text('created_by').references(() => user.id),
	updatedBy: text('updated_by').references(() => user.id),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const appointmentRelations = relations(appointment, ({ one, many }) => ({
	organization: one(organization, {
		fields: [appointment.organizationId],
		references: [organization.id],
	}),
	patient: one(patient, {
		fields: [appointment.patientId],
		references: [patient.id],
	}),
	doctor: one(user, { fields: [appointment.doctorId], references: [user.id] }),
	room: one(room, { fields: [appointment.roomId], references: [room.id] }),
	seriesParent: one(appointment, {
		fields: [appointment.seriesId],
		references: [appointment.id],
	}),
	seriesChildren: many(appointment),
}));
