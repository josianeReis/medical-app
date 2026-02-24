import Elysia, { NotFoundError } from 'elysia';
import {
	reportIdModel,
	createReportModel,
	updateReportModel,
	listReportsModel,
} from '@/application/ports/in/report-model';
import { DrizzleReportRepository } from '@/infrastructure/database/drizzle-report.repository';
import { FindAllReportsUseCase } from '@/application/use-cases/report/find-all';
import { FindByIdReportUseCase } from '@/application/use-cases/report/find-by-id';
import { CreateReportUseCase } from '@/application/use-cases/report/create';
import { UpdateReportUseCase } from '@/application/use-cases/report/update';
import { PublishReportUseCase } from '@/application/use-cases/report/publish';
import { createAuthMacroPlugin } from '@/infrastructure/plugins/auth-macro-plugin';
import { wrapResponse } from '@/infrastructure/plugins/response-envelope-plugin';
import { createUseCaseQuery, parseQuery, QueryConfigs } from '@packages/utils';
import { DrizzleOutboxRepository } from '@/infrastructure/database/drizzle-outbox.repository';
import { db } from '@/infrastructure/config/db';

export const reportRoutes = (app: Elysia) =>
	app.group('/reports', (app) =>
		app
			.use(createAuthMacroPlugin())
			// list
			.get(
				'/',
				async ({ query, request, authData }) => {
					const repo = new DrizzleReportRepository();
					const parsed = parseQuery(query, QueryConfigs.templates); // reuse
					const search = createUseCaseQuery(
						parsed,
						query,
						authData.member.organizationId,
						request.url.split('?')[0],
					);
					const uc = new FindAllReportsUseCase(repo);
					const data = await uc.execute(search);
					return wrapResponse(data);
				},
				{ query: listReportsModel, auth: 'report:read' },
			)
			// get by id
			.get(
				'/:id',
				async ({ params }) => {
					const repo = new DrizzleReportRepository();
					const uc = new FindByIdReportUseCase(repo);
					const r = await uc.execute(params.id);
					if (!r) throw new NotFoundError('errors.report_not_found');
					return wrapResponse(r);
				},
				{ params: reportIdModel, auth: 'report:read' },
			)
			// create
			.post(
				'/',
				async ({ body, authData }) => {
					const repo = new DrizzleReportRepository();
					const uc = new CreateReportUseCase(repo);
					const res = await uc.execute({
						...body,
						reviewedById: body.reviewedById ?? null,
						organizationId: authData.member.organizationId,
						createdBy: authData.user.id,
					});
					return wrapResponse(res);
				},
				{ body: createReportModel, auth: 'report:create' },
			)
			// update
			.patch(
				'/:id',
				async ({ params, body, authData }) => {
					const repo = new DrizzleReportRepository();
					const uc = new UpdateReportUseCase(repo);
					const res = await uc.execute(params.id, {
						...body,
						updatedBy: authData.user.id,
						updatedAt: new Date(),
					});
					return wrapResponse(res);
				},
				{
					params: reportIdModel,
					body: updateReportModel,
					auth: 'report:update',
				},
			)
			// publish
			.patch(
				'/:id/publish',
				async ({ params, authData }) => {
					return await db.transaction(async (tx) => {
						const repo = new DrizzleReportRepository(tx);
						const outbox = new DrizzleOutboxRepository(tx);
						const uc = new PublishReportUseCase(repo, outbox);
						const r = await uc.execute(params.id, authData.user.id, '');
						return wrapResponse(r);
					});
				},
				{ params: reportIdModel, auth: 'report:update' },
			),
	);
