import { ListPatientsInput } from '@/application/ports/in/patient/patient-model';
import {
	PatientFilters,
	PatientRepository,
} from '@/application/ports/out/patient/patient-repository';
import {
	buildPaginationResponse,
	PaginatedResponse,
} from '@/application/utils/build-pagination-links';
import { Pagination } from '@/domain/entities/pagination';
import { Patient } from '@/domain/entities/patient';
import { DefaultResponse } from '@/domain/shared/default-response';

type FindAllPatientsInput = {
	organizationId: string;
	filters: PatientFilters;
	requestQuery: ListPatientsInput;
	pagination: Pagination;
	baseUrl: string;
	sort?: string;
};

export type FindAllPatientsOutput = DefaultResponse<
	PaginatedResponse<Patient[]>,
	null
>;

export class FindAllPatientsUseCase {
	constructor(private readonly patientRepository: PatientRepository) {}

	async execute(input: FindAllPatientsInput): Promise<FindAllPatientsOutput> {
		const { organizationId, filters, requestQuery, pagination, baseUrl, sort } =
			input;
		const { page, limit } = pagination;

		const [patients, total] = await Promise.all([
			this.patientRepository.findAll(organizationId, filters, pagination, sort),
			this.patientRepository.count(organizationId, filters),
		]);

		const totalPages = Math.ceil(total / limit);

		return buildPaginationResponse({
			items: patients,
			baseUrl,
			page,
			totalPages,
			filters: requestQuery,
			limit,
			total,
		});
	}
}
