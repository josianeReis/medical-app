import { organizationIdModel } from '@/application/ports/in/params/organization-id';
import {
	createPatientModel,
	listPatientsModel,
	patientIdModel,
	updatePatientModel,
} from '@/application/ports/in/patient/patient-model';
import { CreatePatientUseCase } from '@/application/use-cases/patient/create';
import { FindAllPatientsUseCase } from '@/application/use-cases/patient/find-all-patients';
import { FindPatientByIdUseCase } from '@/application/use-cases/patient/find-patient-by-id';
import { SoftDeletePatientUseCase } from '@/application/use-cases/patient/soft-delete-patient';
import { UpdatePatientUseCase } from '@/application/use-cases/patient/update-patient';
import { NotFoundError } from '@/domain/errors/not-found-error';
import { DrizzlePatientRepository } from '@/infrastructure/database/drizzle-patient-repository';
import { withUnitOfWork } from '@/infrastructure/database/with-unit-of-work';
import { createAuthMacroPlugin } from '@/infrastructure/plugins/auth-macro-plugin';
import { wrapResponse } from '@/infrastructure/plugins/response-envelope-plugin';
import { createUseCaseQuery, parseQuery, QueryConfigs } from '@packages/utils';
import Elysia from 'elysia';

const patientRepository = new DrizzlePatientRepository();

export const patientRoutes = (app: Elysia) =>
	app.group('/patients', (app) =>
		app
			.use(createAuthMacroPlugin())
			.post(
				'/',
				async ({ body, params, set, authData }) => {
					try {
						const { organizationId } = params;
						if (!organizationId) {
							throw new NotFoundError('errors.organization_not_found');
						}

						const processedDocuments = (body.documents ?? []).map((doc) => {
							const processed = {
								...doc,
								number: Array.isArray(doc.number)
									? doc.number.join('')
									: doc.number,
								country: doc.country || null,
							};
							return processed;
						});

						const createPatientUC = new CreatePatientUseCase(withUnitOfWork);

						const patient = await createPatientUC.execute(
							organizationId,
							authData.user.id,
							{
								name: body.name,
								email: body.email,
								documents: processedDocuments,
								gender: body.gender,
								birthdate: body.birthdate,
								phoneNumber: body.phoneNumber,
								secondPhoneNumber: body.secondPhoneNumber,
								address: body.address ?? [],
							},
						);

						set.status = 201;
						return wrapResponse(patient);
					} catch (error) {
						// eslint-disable-next-line no-console
						console.error('Error in patient creation route:', error);
						throw error;
					}
				},
				{
					body: createPatientModel,
					auth: 'patient:create',
					params: organizationIdModel,
				},
			)
			.get(
				'/',
				async ({ request, query, params }) => {
					const { organizationId = '' } =
						(params as {
							organizationId: string;
						}) || {};
					if (!organizationId) {
						throw new NotFoundError('errors.organization_not_found');
					}

					// Parse query using generic parser with patient-specific configuration
					const parsedQuery = parseQuery(query, QueryConfigs.patients);

					// Create use case query
					const useCaseQuery = createUseCaseQuery(
						parsedQuery,
						query,
						organizationId,
						`${request.url.split('?')[0]}`,
					);

					const findAllPatients = new FindAllPatientsUseCase(patientRepository);
					const result = await findAllPatients.execute(useCaseQuery);
					return wrapResponse(result);
				},
				{
					query: listPatientsModel,
					params: organizationIdModel,
					auth: 'patient:read',
				},
			)
			.get(
				'/:id',
				async ({ params }) => {
					const findPatientById = new FindPatientByIdUseCase(patientRepository);
					const patient = await findPatientById.execute(params.id);
					if (!patient) {
						throw new NotFoundError('errors.patient_not_found');
					}
					return wrapResponse(patient);
				},
				{
					params: patientIdModel,
					auth: 'patient:read',
				},
			)
			.patch(
				'/:id',
				async ({ params, body, authData }) => {
					const updatePatient = new UpdatePatientUseCase(patientRepository);
					const patient = await updatePatient.execute({
						id: params.id,
						data: {
							...body,
							updatedAt: new Date(),
							updatedBy: authData.user.id,
						},
					});
					return wrapResponse(patient);
				},
				{
					params: patientIdModel,
					body: updatePatientModel,
					auth: 'patient:update',
				},
			)
			.delete(
				'/:id',
				async ({ params, authData, set }) => {
					const { organizationId } = params;

					if (!organizationId) {
						throw new NotFoundError('errors.organization_not_found');
					}
					const deletePatient = new SoftDeletePatientUseCase(withUnitOfWork);
					await deletePatient.execute({
						id: params.id,
						organizationId: organizationId,
						deletedById: authData.user.id,
					});

					set.status = 204;
					return wrapResponse(null);
				},
				{
					params: patientIdModel,
					auth: 'patient:delete',
				},
			),
	);
