import { Pagination } from '@/domain/entities/pagination';
import { Report } from '@/domain/entities/report';
import { Filter } from '@packages/utils';

export type CreateReportData = Omit<
	Report,
	| 'id'
	| 'createdAt'
	| 'updatedAt'
	| 'deletedAt'
	| 'deletedBy'
	| 'updatedBy'
	| 'publishedAt'
	| 'pdfUrl'
	| 'status'
> & {
	htmlContent?: string;
};

export type UpdateReportData = Partial<CreateReportData> & {
	updatedBy: string;
	updatedAt: Date;
};

export type ReportFilters = Filter[];

export type ReportRepository = {
	create(data: CreateReportData): Promise<Report>;
	update(id: string, data: UpdateReportData): Promise<Report>;
	publish(id: string, publishedBy: string, pdfUrl: string): Promise<Report>;
	softDelete(id: string, deletedBy: string): Promise<void>;
	permanentDelete(id: string): Promise<void>;
	findById(id: string): Promise<Report | null>;
	findAll(
		organizationId: string,
		filters: ReportFilters,
		pagination: Pagination,
		sort?: string,
	): Promise<Report[]>;
	count(organizationId: string, filters: ReportFilters): Promise<number>;
};
