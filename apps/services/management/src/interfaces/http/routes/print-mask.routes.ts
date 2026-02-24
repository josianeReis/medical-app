import Elysia, { NotFoundError } from 'elysia';

import {
	printMaskIdModel,
	createPrintMask,
	listPrintMasksModel,
	updatePrintMask,
} from '@/application/ports/in/print-mask-model';
import { CreatePrintMaskUseCase } from '@/application/use-cases/print-mask/create';
import { DeletePrintMaskUseCase } from '@/application/use-cases/print-mask/delete';
import { FindAllPrintMasksUseCase } from '@/application/use-cases/print-mask/find-all';
import { FindByIdPrintMaskUseCase } from '@/application/use-cases/print-mask/find-by-id';
import { UpdatePrintMaskUseCase } from '@/application/use-cases/print-mask/update';
import { DrizzlePrintMaskRepository } from '@/infrastructure/database/drizzle-print-mask.repository';
import { createAuthMacroPlugin } from '@/infrastructure/plugins/auth-macro-plugin';
import { wrapResponse } from '@/infrastructure/plugins/response-envelope-plugin';
import { createUseCaseQuery, parseQuery, QueryConfigs } from '@packages/utils';

const printMaskRepository = new DrizzlePrintMaskRepository();

export const printMaskRoutes = (app: Elysia) =>
	app.group('/print-masks', (app) =>
		app
			.use(createAuthMacroPlugin())
			.get(
				'/:id',
				async ({ params }) => {
					const useCase = new FindByIdPrintMaskUseCase(printMaskRepository);

					const result = await useCase.execute(params.id);

					if (!result) {
						throw new NotFoundError('errors.print_mask_not_found');
					}

					return wrapResponse(result);
				},
				{
					params: printMaskIdModel,
					auth: 'printMask:read',
				},
			)
			.delete(
				'/:id',
				async ({ params, authData }) => {
					const useCase = new DeletePrintMaskUseCase(printMaskRepository);
					await useCase.execute(params.id, authData.user.id);
					return wrapResponse({ deleted: true });
				},
				{
					params: printMaskIdModel,
					auth: 'printMask:delete',
				},
			)
			.patch(
				'/:id',
				async ({ params, authData, body }) => {
					const useCase = new UpdatePrintMaskUseCase(printMaskRepository);

					const result = await useCase.execute(params.id, {
						...body,
						updatedBy: authData.user.id,
						updatedAt: new Date(),
					});

					return wrapResponse(result);
				},
				{
					params: printMaskIdModel,
					body: updatePrintMask,
					auth: 'printMask:update',
				},
			)
			.get(
				'/',
				async ({ query, request, authData }) => {
					const parsedQuery = parseQuery(query, QueryConfigs.templates);
					// Using templates config for now; adjust if needed.
					const useCaseQuery = createUseCaseQuery(
						parsedQuery,
						query,
						authData.member.organizationId,
						`${request.url.split('?')[0]}`,
					);

					const useCase = new FindAllPrintMasksUseCase(printMaskRepository);
					const data = await useCase.execute(useCaseQuery);

					return wrapResponse(data);
				},
				{
					query: listPrintMasksModel,
					auth: 'printMask:read',
				},
			)
			.post(
				'/',
				async ({ body, authData }) => {
					const useCase = new CreatePrintMaskUseCase(printMaskRepository);

					const result = await useCase.execute({
						...body,
						createdBy: authData.user.id,
						organizationId: authData.member.organizationId,
					});

					return wrapResponse(result);
				},
				{
					body: createPrintMask,
					auth: 'printMask:create',
				},
			),
	);
