import { t } from 'elysia';
import { paginationModel } from './pagination-model';

export const reportIdModel = t.Object({
	id: t.String(),
});

export const createReportModel = t.Object({
	patientId: t.String(),
	doctorId: t.String(),
	reviewedById: t.Optional(t.String()),
	procedureId: t.String(),
	templateId: t.String(),
	maskId: t.String(),
	htmlContent: t.String(),
	status: t.Optional(t.String()),
});

export const updateReportModel = t.Partial(createReportModel);

export const publishReport = t.Object({
	pdfUrl: t.String(),
});

export const listReportsModel = t.Composite([
	paginationModel,
	t.Object({
		status: t.Optional(t.String()),
		patient: t.Optional(t.String()),
		doctor: t.Optional(t.String()),
		dateFrom: t.Optional(t.String()),
		dateTo: t.Optional(t.String()),
		sort: t.Optional(t.String()),
	}),
]);

export type CreateReportBody = typeof createReportModel.static;
export type UpdateReportBody = typeof updateReportModel.static;
export type PublishReportBody = typeof publishReport.static;
export type ReportIdBody = typeof reportIdModel.static;
export type ListReportsInput = typeof listReportsModel.static;
