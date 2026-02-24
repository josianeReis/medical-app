import { AnyPgColumn, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { generateId } from '../../utils';
import { organization, user } from '../auth/auth-schema';
import { procedureCategories } from '../procedure/procedure-schema';

export const category = pgTable('category', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => generateId()),
	name: text('name').notNull().unique(),
	parentId: text('parent_id')
		.references((): AnyPgColumn => category.id, {
			onDelete: 'cascade',
		})
		.default(sql`NULL`),
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
export const categoryRelations = relations(category, ({ many, one }) => ({
	organization: one(organization, {
		fields: [category.organizationId],
		references: [organization.id],
	}),
	createdByUser: one(user, {
		fields: [category.createdBy],
		references: [user.id],
	}),
	updatedByUser: one(user, {
		fields: [category.updatedBy],
		references: [user.id],
	}),
	deletedByUser: one(user, {
		fields: [category.deletedBy],
		references: [user.id],
	}),
	parent: one(category, {
		fields: [category.parentId],
		references: [category.id],
	}),
	children: many(category),
	procedureCategories: many(procedureCategories),
}));
