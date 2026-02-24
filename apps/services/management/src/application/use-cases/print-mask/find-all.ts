import { DefaultResponse } from '@/domain/shared/default-response';
import { Pagination } from '@/domain/entities/pagination';
import { PrintMask } from '@/domain/entities/print-mask';
import {
	PrintMaskFilters,
	PrintMaskRepository,
} from '@/application/ports/out/print-mask-repository';
import {
	buildPaginationResponse,
	PaginatedResponse,
} from '@/application/utils/build-pagination-links';
import { ListPrintMasksInput } from '@/application/ports/in/print-mask-model';

type FindAllPrintMasksInput = {
	organizationId: string;
	filters: PrintMaskFilters;
	requestQuery: ListPrintMasksInput;
	pagination: Pagination;
	baseUrl: string;
	sort?: string;
};

export type FindAllPrintMasksOutput = DefaultResponse<
	PaginatedResponse<PrintMask[]>,
	null
>;

export class FindAllPrintMasksUseCase {
	constructor(private readonly printMaskRepository: PrintMaskRepository) {}

	async execute(
		input: FindAllPrintMasksInput,
	): Promise<FindAllPrintMasksOutput> {
		const { organizationId, filters, requestQuery, pagination, baseUrl, sort } =
			input;
		const { page, limit } = pagination;

		const [masks, total] = await Promise.all([
			this.printMaskRepository.findAll(
				organizationId,
				filters,
				pagination,
				sort,
			),
			this.printMaskRepository.count(organizationId, filters),
		]);

		const totalPages = Math.ceil(total / limit);

		return buildPaginationResponse({
			items: masks,
			baseUrl,
			page,
			totalPages,
			filters: requestQuery,
			limit,
			total,
		});
	}
}
