import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { generateId } from '../../utils';
import { organization } from '../auth/auth-schema';
import { appointment } from './appointment-schema';
import { queueEntry } from './queue-schema';

export const room = pgTable('room', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => generateId()),
	organizationId: text('organization_id')
		.notNull()
		.references(() => organization.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	floor: integer('floor'),
	status: text('status').default('ACTIVE'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const roomRelations = relations(room, ({ one, many }) => ({
	organization: one(organization, {
		fields: [room.organizationId],
		references: [organization.id],
	}),
	appointments: many(appointment),
	queueEntries: many(queueEntry),
}));
