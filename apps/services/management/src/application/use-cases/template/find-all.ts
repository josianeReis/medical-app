import { DefaultResponse } from '@/domain/shared/default-response';
import { Pagination } from '@/domain/entities/pagination';
import { TemplateWithProcedure } from '@/domain/entities/template';
import {
	TemplateFilters,
	TemplateRepository,
} from '@/application/ports/out/template-repository';
import {
	buildPaginationResponse,
	PaginatedResponse,
} from '@/application/utils/build-pagination-links';
import { ListTemplatesInput } from '@/application/ports/in/template-model';

type FindAllTemplatesInput = {
	organizationId: string;
	filters: TemplateFilters;
	requestQuery: ListTemplatesInput;
	pagination: Pagination;
	baseUrl: string;
	sort?: string;
};

export type FindAllTemplatesOutput = DefaultResponse<
	PaginatedResponse<TemplateWithProcedure[]>,
	null
>;

export class FindAllTemplatesUseCase {
	constructor(private readonly templateRepository: TemplateRepository) {}

	async execute(input: FindAllTemplatesInput): Promise<FindAllTemplatesOutput> {
		const { organizationId, filters, requestQuery, pagination, baseUrl, sort } =
			input;
		const { page, limit } = pagination;

		const [templates, total] = await Promise.all([
			this.templateRepository.findAll(
				organizationId,
				filters,
				pagination,
				sort,
			),
			this.templateRepository.count(organizationId, filters),
		]);

		const totalPages = Math.ceil(total / limit);

		return buildPaginationResponse({
			items: templates,
			baseUrl,
			page,
			totalPages,
			filters: requestQuery,
			limit,
			total,
		});
	}
}
