import Elysia from 'elysia';

import { organizationIdModel } from '@/application/ports/in/params/organization-id';
import {
	createTemplateModel,
	listTemplatesModel,
	templateIdModel,
	updateTemplate,
} from '@/application/ports/in/template-model';
import { CreateTemplateUseCase } from '@/application/use-cases/template/create';
import { DeleteTemplateUseCase } from '@/application/use-cases/template/delete';
import { FindAllTemplatesUseCase } from '@/application/use-cases/template/find-all';
import { FindByIdTemplateUseCase } from '@/application/use-cases/template/find-by-id';
import { UpdateTemplateUseCase } from '@/application/use-cases/template/update';
import { NotFoundError } from '@/domain/errors/not-found-error';
import { DrizzleTemplateRepository } from '@/infrastructure/database/drizzle-template.repository';
import { createAuthMacroPlugin } from '@/infrastructure/plugins/auth-macro-plugin';
import { wrapResponse } from '@/infrastructure/plugins/response-envelope-plugin';
import { createUseCaseQuery, parseQuery, QueryConfigs } from '@packages/utils';

const templateRepository = new DrizzleTemplateRepository();

export const templateRoutes = (app: Elysia) =>
	app.group('/templates', (app) =>
		app
			.use(createAuthMacroPlugin())
			.get(
				'/:id',
				async ({ params }) => {
					const useCase = new FindByIdTemplateUseCase(templateRepository);

					const result = await useCase.execute(params.id);

					if (!result) {
						throw new NotFoundError('errors.template_not_found');
					}

					return wrapResponse(result);
				},
				{
					params: templateIdModel,
					auth: 'template:read',
				},
			)
			.delete(
				'/:id',
				async ({ params, set, authData }) => {
					const useCase = new DeleteTemplateUseCase(templateRepository);

					await useCase.execute(params.id, authData.user.id);

					set.status = 200;
					return wrapResponse(null);
				},
				{
					params: templateIdModel,
					auth: 'template:delete',
				},
			)

			.patch(
				'/:id',
				async ({ params, body, authData }) => {
					const useCase = new UpdateTemplateUseCase(templateRepository);

					const result = await useCase.execute({
						id: params.id,
						data: {
							...body,
							updatedBy: authData.user.id,
							updatedAt: new Date(),
						},
					});

					if (!result) {
						throw new NotFoundError('errors.template_not_found');
					}

					return wrapResponse(result);
				},
				{
					params: templateIdModel,
					body: updateTemplate,
					auth: 'template:update',
				},
			)
			.get(
				'/',
				async ({ query, request, authData }) => {
					// Parse query using generic parser with template-specific configuration
					const parsedQuery = parseQuery(query, QueryConfigs.templates);

					// Create use case query
					const useCaseQuery = createUseCaseQuery(
						parsedQuery,
						query,
						authData.member.organizationId,
						`${request.url.split('?')[0]}`,
					);

					const useCase = new FindAllTemplatesUseCase(templateRepository);
					const result = await useCase.execute(useCaseQuery);

					return wrapResponse(result);
				},
				{
					query: listTemplatesModel,
					auth: 'template:read',
				},
			)
			.post(
				'/',
				async ({ body, params, authData }) => {
					const { organizationId } = params;

					const useCase = new CreateTemplateUseCase(templateRepository);

					const result = await useCase.execute({
						...body,
						organizationId,
						createdBy: authData.user.id,
					});

					return wrapResponse(result);
				},
				{
					body: createTemplateModel,
					params: organizationIdModel,
					auth: true,
				},
			),
	);
