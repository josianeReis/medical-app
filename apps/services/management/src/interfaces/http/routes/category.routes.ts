import Elysia, { NotFoundError } from 'elysia';

import {
	categoryIdModel,
	createCategory,
	listCategoriesModel,
	updateCategory,
} from '@/application/ports/in/category-model';
import { CreateCategoryUseCase } from '@/application/use-cases/category/create';
import { DeleteCategoryUseCase } from '@/application/use-cases/category/delete';
import { FindAllCategoriesUseCase } from '@/application/use-cases/category/find-all';
import { FindByIdCategoryUseCase } from '@/application/use-cases/category/find-by-id';
import { UpdateCategoryUseCase } from '@/application/use-cases/category/update';
import { DrizzleCategoryRepository } from '@/infrastructure/database/drizzle-category.repository';
import { createAuthMacroPlugin } from '@/infrastructure/plugins/auth-macro-plugin';
import { wrapResponse } from '@/infrastructure/plugins/response-envelope-plugin';
import { createUseCaseQuery, parseQuery, QueryConfigs } from '@packages/utils';

const categoryRepository = new DrizzleCategoryRepository();

export const categoryRoutes = (app: Elysia) =>
	app.group('/categories', (app) =>
		app
			.use(createAuthMacroPlugin())
			.get(
				'/:id',
				async ({ params }) => {
					const useCase = new FindByIdCategoryUseCase(categoryRepository);

					const result = await useCase.execute(params.id);

					if (!result) {
						throw new NotFoundError('errors.category_not_found');
					}

					return wrapResponse(result);
				},
				{
					params: categoryIdModel,
					auth: 'category:read',
				},
			)
			.delete(
				'/:id',
				async ({ params }) => {
					const useCase = new DeleteCategoryUseCase(categoryRepository);

					const result = await useCase.execute(params.id);

					if (!result) {
						throw new NotFoundError('errors.category_not_found');
					}

					return wrapResponse(result);
				},
				{
					params: categoryIdModel,
					auth: 'category:delete',
				},
			)
			.patch(
				'/:id',
				async ({ params, authData, body }) => {
					const useCase = new UpdateCategoryUseCase(categoryRepository);

					const result = await useCase.execute({
						id: params.id,
						data: {
							...body,
							updatedBy: authData.user.id,
							updatedAt: new Date(),
						},
					});

					if (!result) {
						throw new NotFoundError('errors.category_not_found');
					}

					return wrapResponse(result);
				},
				{
					params: categoryIdModel,
					body: updateCategory,
					auth: 'category:update',
				},
			)
			.get(
				'/',
				async ({ query, request, authData }) => {
					// Parse query using generic parser with category-specific configuration
					const parsedQuery = parseQuery(query, QueryConfigs.categories);

					// Create use case query
					const useCaseQuery = createUseCaseQuery(
						parsedQuery,
						query,
						authData.member.organizationId,
						`${request.url.split('?')[0]}`,
					);

					const useCase = new FindAllCategoriesUseCase(categoryRepository);
					const data = await useCase.execute(useCaseQuery);

					return wrapResponse(data);
				},
				{
					query: listCategoriesModel,
					auth: 'category:read',
				},
			)
			.post(
				'/',
				async ({ body, authData }) => {
					const useCase = new CreateCategoryUseCase(categoryRepository);

					const result = await useCase.execute({
						...body,
						createdBy: authData.user.id,
						organizationId: authData.member.organizationId,
					});

					return wrapResponse(result);
				},
				{
					body: createCategory,
					auth: 'category:create',
				},
			),
	);
