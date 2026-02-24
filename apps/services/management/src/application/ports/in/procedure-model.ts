import { t } from 'elysia';
import { paginationModel } from './pagination-model';

export const procedureIdModel = t.Object({
	id: t.String(),
});

export const createProcedure = t.Object({
	name: t.String(),
	categoryId: t.String(),
	duration: t.Optional(t.Number()),
	code: t.Optional(t.Number()),
	equipment: t.Optional(t.String()),
});

export const updateProcedure = t.Object({
	name: t.Optional(t.String()),
	categoryId: t.Optional(t.String()),
	duration: t.Optional(t.Number()),
	code: t.Optional(t.Number()),
});

export const listProceduresModel = t.Composite([
	paginationModel,
	t.Object({
		filters: t.Optional(t.String()),
		name: t.Optional(t.String()),
		categoryId: t.Optional(t.Array(t.String())),
		duration: t.Optional(t.String()),
		code: t.Optional(t.String()),
		organizationId: t.Optional(t.String()),
		sort: t.Optional(t.String()),
	}),
]);

export type ListProceduresInput = typeof listProceduresModel.static;
export type CreateProcedureBody = typeof createProcedure.static;
export type UpdateProcedureBody = typeof updateProcedure.static;
export type ProcedureIdBody = typeof procedureIdModel.static;
