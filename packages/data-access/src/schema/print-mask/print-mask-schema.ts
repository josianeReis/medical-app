import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { generateId } from '../../utils';
import { organization, user } from '../auth/auth-schema';

export const printMask = pgTable('print_mask', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => generateId()),
    name: text('name').notNull(),
    headerHtml: text('header_html'),
    footerHtml: text('footer_html'),
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

export const printMaskRelations = relations(printMask, ({ one }) => ({
    organization: one(organization, {
        fields: [printMask.organizationId],
        references: [organization.id],
    }),
    createdByUser: one(user, {
        fields: [printMask.createdBy],
        references: [user.id],
    }),
    updatedByUser: one(user, {
        fields: [printMask.updatedBy],
        references: [user.id],
    }),
    deletedByUser: one(user, {
        fields: [printMask.deletedBy],
        references: [user.id],
    }),
})); 