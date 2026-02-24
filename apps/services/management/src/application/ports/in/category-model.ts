import { t } from 'elysia';
import { paginationModel } from './pagination-model';

export const categoryIdModel = t.Object({
	id: t.String(),
});

export const createCategory = t.Object({
	name: t.String(),
	parentId: t.Optional(t.String()),
});

export const updateCategory = t.Object({
	name: t.String(),
});

export const listCategoriesModel = t.Composite([
	paginationModel,
	t.Object({
		filters: t.Optional(t.String()),
		name: t.Optional(t.String()),
		organizationId: t.Optional(t.String()),
		sort: t.Optional(t.String()),
	}),
]);

export type ListCategoriesInput = typeof listCategoriesModel.static;
export type CreateCategoryBody = typeof createCategory.static;
export type UpdateCategoryBody = typeof updateCategory.static;
export type CategoryIdBody = typeof categoryIdModel.static;
