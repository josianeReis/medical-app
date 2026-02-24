import { t } from 'elysia';
import { organizationIdModel } from './params/organization-id';
import { paginationModel } from './pagination-model';

export const templateIdModel = t.Composite([
	t.Object({
		id: t.String(),
	}),
	organizationIdModel,
]);

export const createTemplateModel = t.Object({
	name: t.String(),
	procedureId: t.String(),
	content: t.String(),
	active: t.Boolean(),
});

export const updateTemplate = t.Partial(createTemplateModel);

export const listTemplatesModel = t.Composite([
	paginationModel,
	t.Object({
		filters: t.Optional(t.String()),
		name: t.Optional(t.String()),
		procedureId: t.Optional(t.Array(t.String())),
		content: t.Optional(t.String()),
		active: t.Optional(t.String()),
		organizationId: t.Optional(t.String()),
		sort: t.Optional(t.String()),
	}),
]);

export type ListTemplatesInput = typeof listTemplatesModel.static;
export type CreateTemplateBody = typeof createTemplateModel.static;
export type UpdateTemplateBody = typeof updateTemplate.static;
export type TemplateIdBody = typeof templateIdModel.static;
