import Elysia from 'elysia';

import {
	createProcedure,
	listProceduresModel,
	procedureIdModel,
	updateProcedure,
} from '@/application/ports/in/procedure-model';
import { CreateProcedureUseCase } from '@/application/use-cases/procedure/create';
import { DeleteProcedureUseCase } from '@/application/use-cases/procedure/delete';
import { FindAllProceduresUseCase } from '@/application/use-cases/procedure/find-all';
import { FindByIdProcedureUseCase } from '@/application/use-cases/procedure/find-by-id';
import { UpdateProcedureUseCase } from '@/application/use-cases/procedure/update';
import { NotFoundError } from '@/domain/errors/not-found-error';
import { DrizzleProcedureRepository } from '@/infrastructure/database/drizzle-procedure.repository';
import { createAuthMacroPlugin } from '@/infrastructure/plugins/auth-macro-plugin';
import { wrapResponse } from '@/infrastructure/plugins/response-envelope-plugin';
import { createUseCaseQuery, parseQuery, QueryConfigs } from '@packages/utils';

const procedureRepository = new DrizzleProcedureRepository();

export const procedureRoutes = (app: Elysia) =>
	app.group('/procedures', (app) =>
		app
			.use(createAuthMacroPlugin())
			.get(
				'/:id',
				async ({ params }) => {
					const useCase = new FindByIdProcedureUseCase(procedureRepository);

					const result = await useCase.execute(params.id);

					if (!result) {
						throw new NotFoundError('errors.procedure_not_found');
					}

					return wrapResponse(result);
				},
				{
					params: procedureIdModel,
					auth: 'procedure:read',
				},
			)
			.delete(
				'/:id',
				async ({ params, authData }) => {
					const useCase = new DeleteProcedureUseCase(procedureRepository);

					await useCase.execute(params.id, authData.user.id);

					return wrapResponse(null);
				},
				{
					params: procedureIdModel,
					auth: 'procedure:delete',
				},
			)
			.patch(
				'/:id',
				async ({ params, body, authData }) => {
					const useCase = new UpdateProcedureUseCase(procedureRepository);

					const result = await useCase.execute({
						id: params.id,
						data: {
							...body,
							updatedBy: authData.user.id,
							updatedAt: new Date(),
						},
					});

					if (!result) {
						throw new NotFoundError('errors.procedure_not_found');
					}

					return wrapResponse(result);
				},
				{
					params: procedureIdModel,
					body: updateProcedure,
					auth: 'procedure:update',
				},
			)
			.get(
				'/',
				async ({ query, request, authData }) => {
					// Parse query using generic parser with procedure-specific configuration
					const parsedQuery = parseQuery(query, QueryConfigs.procedures);

					// Create use case query
					const useCaseQuery = createUseCaseQuery(
						parsedQuery,
						query,
						authData.member.organizationId,
						`${request.url.split('?')[0]}`,
					);

					const useCase = new FindAllProceduresUseCase(procedureRepository);
					const data = await useCase.execute(useCaseQuery);

					return wrapResponse(data);
				},
				{
					query: listProceduresModel,
					auth: 'procedure:read',
				},
			)
			.post(
				'/',
				async (ctx) => {
					const { body } = ctx;
					const { user, member } = ctx as typeof ctx & {
						user: { id: string };
						member: { organizationId: string };
					};

					const useCase = new CreateProcedureUseCase(procedureRepository);

					const result = await useCase.execute({
						...body,
						organizationId: member.organizationId,
						createdBy: user.id,
					});

					return wrapResponse(result);
				},
				{
					body: createProcedure,
					auth: 'procedure:create',
				},
			),
	);
