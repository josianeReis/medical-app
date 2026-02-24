import { Appointment } from '@/domain/entities/appointment';
import {
	AppointmentRepository,
	CreateAppointmentData,
} from '@/application/ports/out/appointment-repository';
import {
	DefaultResponse,
	defaultResponse,
} from '@/domain/shared/default-response';
import { publishAppointmentEvent } from '@/infrastructure/plugins/event-bus';

export type ScheduleAppointmentInput = CreateAppointmentData & {
	organizationId: string;
};

export type ScheduleAppointmentOutput = DefaultResponse<
	Appointment | null,
	string
>;

export class ScheduleAppointmentUseCase {
	constructor(private readonly appointmentRepository: AppointmentRepository) {}

	async execute(
		input: ScheduleAppointmentInput,
	): Promise<ScheduleAppointmentOutput> {
		// Series handling: if recurrenceRule present create parent row otherwise regular.
		const appointment = await this.appointmentRepository.create({ ...input });
		publishAppointmentEvent({
			organizationId: appointment.organizationId,
			appointmentId: appointment.id,
			type: 'CREATED',
			data: appointment,
		});

		return defaultResponse(appointment);
	}
}
