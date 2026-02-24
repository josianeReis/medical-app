import {
	appointmentIdModel,
	createAppointmentModel,
	listAppointmentsModel,
	updateAppointmentModel,
} from '@/application/ports/in/appointment-model';
import { ListAppointmentsFilters } from '@/application/ports/out/appointment-repository';
import { CancelAppointmentUseCase } from '@/application/use-cases/appointment/cancel-appointment';
import { ListAppointmentsUseCase } from '@/application/use-cases/appointment/list-appointments';
import { ScheduleAppointmentUseCase } from '@/application/use-cases/appointment/schedule-appointment';
import { UpdateAppointmentUseCase } from '@/application/use-cases/appointment/update-appointment';
import { DrizzleAppointmentRepository } from '@/infrastructure/database/drizzle-appointment.repository';
import { createAppointmentSSEPlugin } from '@/infrastructure/plugins/appointment-sse.plugin';
import { createAuthMacroPlugin } from '@/infrastructure/plugins/auth-macro-plugin';
import { wrapResponse } from '@/infrastructure/plugins/response-envelope-plugin';
import Elysia, { NotFoundError } from 'elysia';

const appointmentRepository = new DrizzleAppointmentRepository();

export const appointmentRoutes = (app: Elysia) =>
	app.group('/appointments', (app) =>
		app
			.use(createAuthMacroPlugin())
			.use(createAppointmentSSEPlugin())
			// List appointments
			.get(
				'/',
				async ({ query, authData, request }) => {
					const filters: ListAppointmentsFilters = {
						doctorId: query.doctorId,
						roomId: query.roomId,
						from: query.from ? new Date(query.from) : undefined,
						to: query.to ? new Date(query.to) : undefined,
					};

					const pagination = {
						page: query.page ? Number(query.page) : 1,
						limit: query.limit ? Number(query.limit) : 10,
					};

					const listUC = new ListAppointmentsUseCase(appointmentRepository);
					const data = await listUC.execute({
						organizationId: authData.member.organizationId,
						filters,
						pagination,
						baseUrl: `${request.url.split('?')[0]}`,
					});
					return wrapResponse(data);
				},
				{
					auth: 'appointment:read',
					query: listAppointmentsModel,
				},
			)
			// Create appointment
			.post(
				'/',
				async ({ body, authData }) => {
					const scheduleUC = new ScheduleAppointmentUseCase(
						appointmentRepository,
					);
					const result = await scheduleUC.execute({
						...body,
						start: new Date(body.start),
						end: new Date(body.end),
						recurrenceRule: body.recurrenceRule ?? null,
						organizationId: authData.member.organizationId,
						createdBy: authData.user.id,
						updatedBy: authData.user.id,
						seriesId: body.seriesId ?? null,
						overrideDate: body.overrideDate ?? null,
					});
					return wrapResponse(result);
				},
				{
					auth: 'appointment:create',
					body: createAppointmentModel,
				},
			)
			// Update appointment
			.patch(
				'/:id',
				async ({ params, body, authData }) => {
					const updateUC = new UpdateAppointmentUseCase(appointmentRepository);
					const result = await updateUC.execute({
						id: params.id,
						data: {
							...body,
							start: body.start ? new Date(body.start) : undefined,
							end: body.end ? new Date(body.end) : undefined,
							updatedAt: new Date(),
							updatedBy: authData.user.id,
						},
					});
					if (!result.data) {
						throw new NotFoundError('errors.appointment_not_found');
					}
					return wrapResponse(result);
				},
				{
					auth: 'appointment:update',
					params: appointmentIdModel,
					body: updateAppointmentModel,
				},
			)
			// Cancel appointment
			.delete(
				'/:id',
				async ({ params, authData }) => {
					const cancelUC = new CancelAppointmentUseCase(appointmentRepository);
					const result = await cancelUC.execute({
						id: params.id,
						canceledBy: authData.user.id,
					});
					if (result.error) {
						throw new NotFoundError(result.error);
					}
					return wrapResponse(result);
				},
				{
					auth: 'appointment:delete',
					params: appointmentIdModel,
				},
			),
	);
