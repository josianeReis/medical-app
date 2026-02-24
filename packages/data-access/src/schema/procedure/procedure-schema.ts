import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { generateId } from '../../utils';
import { organization, user } from '../auth/auth-schema';
import { category } from '../category/category-schema';

export const procedure = pgTable('procedure', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => generateId()),
	name: text('name').notNull(),
	code: integer('code'),
	duration: integer('duration'),
	equipament: text('equipament'),
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

export const procedureCategories = pgTable('procedure_categories', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => generateId()),
	procedureId: text('procedure_id')
		.notNull()
		.references(() => procedure.id, { onDelete: 'cascade' }),
	categoryId: text('category_id')
		.notNull()
		.references(() => category.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Relations
export const procedureRelations = relations(procedure, ({ many, one }) => ({
	organization: one(organization, {
		fields: [procedure.organizationId],
		references: [organization.id],
	}),
	createdByUser: one(user, {
		fields: [procedure.createdBy],
		references: [user.id],
	}),
	updatedByUser: one(user, {
		fields: [procedure.updatedBy],
		references: [user.id],
	}),
	deletedByUser: one(user, {
		fields: [procedure.deletedBy],
		references: [user.id],
	}),
	procedureCategories: many(procedureCategories),
}));

export const procedureCategoriesRelations = relations(
	procedureCategories,
	({ one }) => ({
		procedure: one(procedure, {
			fields: [procedureCategories.procedureId],
			references: [procedure.id],
		}),
		category: one(category, {
			fields: [procedureCategories.categoryId],
			references: [category.id],
		}),
	}),
);
