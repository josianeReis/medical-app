import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { generateId } from '../../utils';
import { organization, user } from '../auth/auth-schema';
import { patient } from '../patient/patient-schema';
import { procedure } from '../procedure/procedure-schema';
import { template } from '../template/template-schema';
import { printMask } from '../print-mask/print-mask-schema';

export type ReportStatus = 'draft' | 'review' | 'published';

export const report = pgTable('report', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => generateId()),
	patientId: text('patient_id').references(() => patient.id),
	doctorId: text('doctor_id').references(() => user.id),
	reviewedById: text('reviewed_by_id').references(() => user.id),
	procedureId: text('procedure_id').references(() => procedure.id),
	templateId: text('template_id').references(() => template.id),
	maskId: text('mask_id').references(() => printMask.id),
	htmlContent: text('html_content'),
	pdfUrl: text('pdf_url'),
	status: text('status').$type<ReportStatus>().default('draft').notNull(),
	publishedAt: timestamp('published_at'),
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

export const reportRelations = relations(report, ({ one }) => ({
	organization: one(organization, {
		fields: [report.organizationId],
		references: [organization.id],
	}),
	patient: one(patient, {
		fields: [report.patientId],
		references: [patient.id],
	}),
	doctor: one(user, {
		fields: [report.doctorId],
		references: [user.id],
	}),
	reviewer: one(user, {
		fields: [report.reviewedById],
		references: [user.id],
	}),
	procedure: one(procedure, {
		fields: [report.procedureId],
		references: [procedure.id],
	}),
	template: one(template, {
		fields: [report.templateId],
		references: [template.id],
	}),
	mask: one(printMask, {
		fields: [report.maskId],
		references: [printMask.id],
	}),
})); 