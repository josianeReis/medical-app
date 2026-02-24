import { AIUseCase } from '@/application/use-cases/ai/create';
import Elysia, { t } from 'elysia';
import i18next from 'i18next';

export const AIRoutes = (app: Elysia) =>
	app.group('/:organizationId/reports', (app) =>
		app

			.derive(() => {
				return {
					t: i18next.t,
				};
			})
			.post(
				'/generate',
				async ({ body }) => {
					const useCase = new AIUseCase();

					const result = await useCase.execute(body);

					return {
						data: result,
					};
				},
				{
					body: t.Object({
						name: t.String(),
						procedureId: t.String(),
						equipament: t.Union([t.String(), t.Null()]),
						templateId: t.Union([t.String(), t.Null()]),
					}),
					auth: true,
				},
			),
	);
