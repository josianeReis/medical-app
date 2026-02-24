import { DefaultResponse } from '@/domain/shared/default-response';
import { ListCategoriesInput } from '@/application/ports/in/category-model';
import {
	CategoryFilters,
	CategoryRepository,
} from '@/application/ports/out/category-repository';
import {
	buildPaginationResponse,
	PaginatedResponse,
} from '@/application/utils/build-pagination-links';
import { Category } from '@/domain/entities/category';
import { Pagination } from '@/domain/entities/pagination';

type FindAllCategoriesInput = {
	organizationId: string;
	filters: CategoryFilters;
	requestQuery: ListCategoriesInput;
	pagination: Pagination;
	baseUrl: string;
	sort?: string;
};

export type FindAllCategoriesOutput = DefaultResponse<
	PaginatedResponse<Category[]>,
	null
>;

export class FindAllCategoriesUseCase {
	constructor(private readonly categoryRepository: CategoryRepository) {}

	async execute(
		input: FindAllCategoriesInput,
	): Promise<FindAllCategoriesOutput> {
		const { organizationId, filters, requestQuery, pagination, baseUrl, sort } =
			input;
		const { page, limit } = pagination;

		const [categories, total] = await Promise.all([
			this.categoryRepository.findAll(
				organizationId,
				filters,
				pagination,
				sort,
			),
			this.categoryRepository.count(organizationId, filters),
		]);

		const totalPages = Math.ceil(total / limit);

		return buildPaginationResponse({
			items: categories,
			baseUrl,
			page,
			totalPages,
			filters: requestQuery,
			limit,
			total,
		});
	}
}
