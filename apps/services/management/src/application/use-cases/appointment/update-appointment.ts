import { Appointment } from '@/domain/entities/appointment';
import {
	AppointmentRepository,
	UpdateAppointmentData,
} from '@/application/ports/out/appointment-repository';
import {
	DefaultResponse,
	defaultResponse,
} from '@/domain/shared/default-response';
import { publishAppointmentEvent } from '@/infrastructure/plugins/event-bus';

export type UpdateAppointmentInput = {
	id: string;
	data: UpdateAppointmentData;
};

export type UpdateAppointmentOutput = DefaultResponse<
	Appointment | null,
	string
>;

export class UpdateAppointmentUseCase {
	constructor(private readonly appointmentRepository: AppointmentRepository) {}

	async execute(
		input: UpdateAppointmentInput,
	): Promise<UpdateAppointmentOutput> {
		const { id, data } = input;
		const updated = await this.appointmentRepository.update(id, data);
		if (!updated) {
			return defaultResponse(null, 'errors.appointment_not_found');
		}

		publishAppointmentEvent({
			organizationId: updated.organizationId,
			appointmentId: updated.id,
			type: 'UPDATED',
			data: updated,
		});
		return defaultResponse(updated);
	}
}
