import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { generateId } from '../../utils';
import { organization, user } from '../auth/auth-schema';
import { procedure } from '../procedure/procedure-schema';

export const template = pgTable('template', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => generateId()),
	name: text('name').notNull(),
	content: text('content'),
	procedureId: text('procedure_id').references(() => procedure.id),
	active: boolean('active').notNull().default(true),
	organizationId: text('organization_id').references(() => organization.id, {
		onDelete: 'cascade',
	}),
	createdBy: text('created_by').references(() => user.id),
	updatedBy: text('updated_by').references(() => user.id),
	deletedAt: timestamp('deleted_at'),
	deletedBy: text('deleted_by').references(() => user.id),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

// Relations
export const templateRelations = relations(template, ({ one }) => ({
	organization: one(organization, {
		fields: [template.organizationId],
		references: [organization.id],
	}),
	createdByUser: one(user, {
		fields: [template.createdBy],
		references: [user.id],
	}),
	updatedByUser: one(user, {
		fields: [template.updatedBy],
		references: [user.id],
	}),
	deletedByUser: one(user, {
		fields: [template.deletedBy],
		references: [user.id],
	}),
	procedure: one(procedure, {
		fields: [template.procedureId],
		references: [procedure.id],
	}),
}));
