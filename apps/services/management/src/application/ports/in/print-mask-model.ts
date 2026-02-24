import { t } from 'elysia';
import { paginationModel } from './pagination-model';

export const printMaskIdModel = t.Object({
	id: t.String(),
});

export const createPrintMask = t.Object({
	name: t.String(),
	headerHtml: t.Optional(t.String()),
	footerHtml: t.Optional(t.String()),
	active: t.Optional(t.Boolean()),
});

export const updatePrintMask = t.Object({
	name: t.Optional(t.String()),
	headerHtml: t.Optional(t.String()),
	footerHtml: t.Optional(t.String()),
	active: t.Optional(t.Boolean()),
});

export const listPrintMasksModel = t.Composite([
	paginationModel,
	t.Object({
		filters: t.Optional(t.String()),
		name: t.Optional(t.String()),
		active: t.Optional(t.String()),
		sort: t.Optional(t.String()),
	}),
]);

export type ListPrintMasksInput = typeof listPrintMasksModel.static;
export type CreatePrintMaskBody = typeof createPrintMask.static;
export type UpdatePrintMaskBody = typeof updatePrintMask.static;
export type PrintMaskIdBody = typeof printMaskIdModel.static;
