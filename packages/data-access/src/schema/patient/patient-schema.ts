import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { generateId } from '../../utils';
import { address } from '../address/address-schema';
import { user } from '../auth/auth-schema';

export type PatientGender = 'M' | 'F' | 'O';

export const patient = pgTable('patient', {
	id: text('id')
		.primaryKey()
		.references(() => user.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	email: text('email'),
	gender: text('gender').$type<PatientGender>(),
	birthdate: text('birthdate'),
	phoneNumber: text('phone_number'),
	secondPhoneNumber: text('second_phone_number'),
	deletedAt: timestamp('deleted_at'),
	deletedBy: text('deleted_by').references(() => user.id),
	createdBy: text('created_by').references(() => user.id),
	updatedBy: text('updated_by').references(() => user.id),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const patientDocument = pgTable('patient_document', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => generateId()),
	patientId: text('patient_id')
		.notNull()
		.references(() => patient.id, { onDelete: 'cascade' }),
	type: text('type').notNull(),
	number: text('number').notNull(),
	country: text('country'), // ISO 3166-1 alpha-2 country code
	issuedAt: timestamp('issued_at'),
	expiresAt: timestamp('expires_at'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const patientDocumentRelations = relations(
	patientDocument,
	({ one }) => ({
		patient: one(patient, {
			fields: [patientDocument.patientId],
			references: [patient.id],
		}),
	}),
);

export const patientRelations = relations(patient, ({ many, one }) => ({
	addresses: many(address),
	documents: many(patientDocument),
	user: one(user, {
		fields: [patient.id],
		references: [user.id],
	}),
}));
