import { DefaultResponse } from '@/domain/shared/default-response';
import { Pagination } from '@/domain/entities/pagination';
import { ProcedureWithCategory } from '@/domain/entities/procedure';
import {
	ProcedureFilters,
	ProcedureRepository,
} from '@/application/ports/out/procedure-repository';
import {
	buildPaginationResponse,
	PaginatedResponse,
} from '@/application/utils/build-pagination-links';
import { ListProceduresInput } from '@/application/ports/in/procedure-model';

type FindAllProceduresInput = {
	organizationId: string;
	filters: ProcedureFilters;
	requestQuery: ListProceduresInput;
	pagination: Pagination;
	baseUrl: string;
	sort?: string;
};

export type FindAllProceduresOutput = DefaultResponse<
	PaginatedResponse<ProcedureWithCategory[]>,
	null
>;

export class FindAllProceduresUseCase {
	constructor(private readonly procedureRepository: ProcedureRepository) {}

	async execute(
		input: FindAllProceduresInput,
	): Promise<FindAllProceduresOutput> {
		const { organizationId, filters, requestQuery, pagination, baseUrl, sort } =
			input;
		const { page, limit } = pagination;

		const [procedures, total] = await Promise.all([
			this.procedureRepository.findAll(
				organizationId,
				filters,
				pagination,
				sort,
			),
			this.procedureRepository.count(organizationId, filters),
		]);

		const totalPages = Math.ceil(total / limit);

		return buildPaginationResponse({
			items: procedures,
			baseUrl,
			page,
			totalPages,
			filters: requestQuery,
			limit,
			total,
		});
	}
}
