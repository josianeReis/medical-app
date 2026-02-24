import { Appointment } from '@/domain/entities/appointment';
import { Pagination } from '@/domain/entities/pagination';

export type CreateAppointmentData = Omit<
	Appointment,
	'id' | 'createdAt' | 'updatedAt' | 'status'
> & {
	status?: Appointment['status'];
};

export type UpdateAppointmentData = Partial<Omit<Appointment, 'id'>> & {
	updatedAt: Date;
	updatedBy: string;
};

export type ListAppointmentsFilters = {
	doctorId?: string;
	roomId?: string;
	from?: Date;
	to?: Date;
};

export type AppointmentRepository = {
	create(data: CreateAppointmentData): Promise<Appointment>;
	update(id: string, data: UpdateAppointmentData): Promise<Appointment | null>;
	delete(id: string): Promise<void>;
	findById(id: string): Promise<Appointment | null>;
	findAll(
		organizationId: string,
		filters: ListAppointmentsFilters,
		pagination: Pagination,
		sort?: string,
	): Promise<Appointment[]>;
	count(
		organizationId: string,
		filters: ListAppointmentsFilters,
	): Promise<number>;
	findRecurringParents(organizationId: string): Promise<Appointment[]>;
};
