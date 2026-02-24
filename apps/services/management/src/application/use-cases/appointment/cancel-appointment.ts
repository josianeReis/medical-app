import { AppointmentRepository } from '@/application/ports/out/appointment-repository';
import {
	DefaultResponse,
	defaultResponse,
} from '@/domain/shared/default-response';
import { publishAppointmentEvent } from '@/infrastructure/plugins/event-bus';

export type CancelAppointmentInput = {
	id: string;
	canceledBy: string;
};

export type CancelAppointmentOutput = DefaultResponse<null, string>;

export class CancelAppointmentUseCase {
	constructor(private readonly appointmentRepository: AppointmentRepository) {}

	async execute(
		input: CancelAppointmentInput,
	): Promise<CancelAppointmentOutput> {
		const { id } = input;
		const appointment = await this.appointmentRepository.findById(id);
		if (!appointment) {
			return defaultResponse(null, 'errors.appointment_not_found');
		}
		const updated = await this.appointmentRepository.update(id, {
			status: 'CANCELLED',
			updatedAt: new Date(),
			updatedBy: input.canceledBy,
		});
		if (updated) {
			publishAppointmentEvent({
				organizationId: updated.organizationId,
				appointmentId: updated.id,
				type: 'CANCELLED',
				data: updated,
			});
		}
		return defaultResponse(null);
	}
}
