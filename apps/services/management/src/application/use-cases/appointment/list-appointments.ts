import { Appointment } from '@/domain/entities/appointment';
import { Pagination } from '@/domain/entities/pagination';
import {
	AppointmentRepository,
	ListAppointmentsFilters,
} from '@/application/ports/out/appointment-repository';
import {
	PaginatedResponse,
	buildPaginationResponse,
} from '@/application/utils/build-pagination-links';
import { DefaultResponse } from '@/domain/shared/default-response';
import { expandRecurrence } from '@/application/utils/rrule-helper';

type ListAppointmentsInput = {
	organizationId: string;
	filters: ListAppointmentsFilters;
	pagination: Pagination;
	baseUrl: string;
};

export type ListAppointmentsOutput = DefaultResponse<
	PaginatedResponse<Appointment[]>,
	null
>;

export class ListAppointmentsUseCase {
	constructor(private readonly appointmentRepository: AppointmentRepository) {}

	async execute(input: ListAppointmentsInput): Promise<ListAppointmentsOutput> {
		const { organizationId, filters, pagination, baseUrl } = input;
		const { limit, page } = pagination;

		const [appointments, total] = await Promise.all([
			this.appointmentRepository.findAll(organizationId, filters, pagination),
			this.appointmentRepository.count(organizationId, filters),
		]);

		// Expand recurring appointments
		if (filters.from && filters.to) {
			const recurringParents =
				await this.appointmentRepository.findRecurringParents(organizationId);
			const fromDate =
				filters.from instanceof Date ? filters.from : new Date(filters.from);
			const toDate =
				filters.to instanceof Date ? filters.to : new Date(filters.to);

			const expanded: Appointment[] = [];
			for (const parent of recurringParents) {
				expanded.push(...expandRecurrence(parent, fromDate, toDate));
			}

			// merge, ensuring overrides replace occurrences (by id prefix + overrideDate)
			const merged = [...appointments, ...expanded];
			const mergedTotalPages = Math.ceil(merged.length / limit);
			return buildPaginationResponse({
				items: merged,
				baseUrl,
				page,
				totalPages: mergedTotalPages,
				filters,
				limit,
				total: merged.length,
			});
		}

		// default behaviour
		const totalPages = Math.ceil(total / limit);

		return buildPaginationResponse({
			items: appointments,
			baseUrl,
			page,
			totalPages,
			filters,
			limit,
			total,
		});
	}
}
