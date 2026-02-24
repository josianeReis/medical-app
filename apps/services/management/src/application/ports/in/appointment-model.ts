import { t } from 'elysia';
import { paginationModel } from './pagination-model';

export const appointmentIdModel = t.Object({
	id: t.String(),
});

export const createAppointmentModel = t.Object({
	patientId: t.String(),
	doctorId: t.String(),
	roomId: t.String(),
	start: t.String({ format: 'date-time' }),
	end: t.String({ format: 'date-time' }),
	recurrenceRule: t.Optional(t.String()),
	seriesId: t.Optional(t.String()),
	overrideDate: t.Optional(t.String({ format: 'date-time' })),
});

export const updateAppointmentModel = t.Partial(createAppointmentModel);

export const listAppointmentsModel = t.Composite([
	paginationModel,
	t.Object({
		roomId: t.Optional(t.String()),
		doctorId: t.Optional(t.String()),
		from: t.Optional(t.String({ format: 'date-time' })),
		to: t.Optional(t.String({ format: 'date-time' })),
		sort: t.Optional(t.String()),
	}),
]);

export type AppointmentIdParams = typeof appointmentIdModel.static;
export type CreateAppointmentBody = typeof createAppointmentModel.static;
export type UpdateAppointmentBody = typeof updateAppointmentModel.static;
export type ListAppointmentsInput = typeof listAppointmentsModel.static;
