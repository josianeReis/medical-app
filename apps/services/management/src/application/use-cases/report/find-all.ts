import { DefaultResponse } from '@/domain/shared/default-response';
import { Pagination } from '@/domain/entities/pagination';
import { Report } from '@/domain/entities/report';
import {
	ReportFilters,
	ReportRepository,
} from '@/application/ports/out/report-repository';
import {
	buildPaginationResponse,
	PaginatedResponse,
} from '@/application/utils/build-pagination-links';
import { ListReportsInput } from '@/application/ports/in/report-model';

type FindAllReportsInput = {
	organizationId: string;
	filters: ReportFilters;
	requestQuery: ListReportsInput;
	pagination: Pagination;
	baseUrl: string;
	sort?: string;
};

export type FindAllReportsOutput = DefaultResponse<
	PaginatedResponse<Report[]>,
	null
>;

export class FindAllReportsUseCase {
	constructor(private readonly reportRepository: ReportRepository) {}

	async execute(input: FindAllReportsInput): Promise<FindAllReportsOutput> {
		const { organizationId, filters, requestQuery, pagination, baseUrl, sort } =
			input;
		const { page, limit } = pagination;

		const [reports, total] = await Promise.all([
			this.reportRepository.findAll(organizationId, filters, pagination, sort),
			this.reportRepository.count(organizationId, filters),
		]);

		const totalPages = Math.ceil(total / limit);

		return buildPaginationResponse({
			items: reports,
			baseUrl,
			page,
			totalPages,
			filters: requestQuery,
			limit,
			total,
		});
	}
}
