import { Pagination } from '@/domain/entities/pagination';
import { Template, TemplateWithProcedure } from '@/domain/entities/template';
import { Filter } from '@packages/utils';

export type CreateTemplateData = Omit<
	Template,
	| 'id'
	| 'createdAt'
	| 'updatedAt'
	| 'isDeleted'
	| 'deletedAt'
	| 'deletedBy'
	| 'updatedBy'
> & {
	procedureId?: string;
	content?: string;
	active?: boolean;
};

export type UpdateTemplateData = Partial<CreateTemplateData> & {
	updatedBy: string;
	updatedAt: Date;
};

export type TemplateFilters = Filter[];

export type TemplateRepository = {
	create(data: CreateTemplateData): Promise<Template>;
	update(id: string, data: UpdateTemplateData): Promise<Template>;
	softDelete(id: string, deletedBy: string): Promise<void>;
	permanentDelete(id: string): Promise<void>;
	findById(id: string): Promise<TemplateWithProcedure | null>;
	findAll(
		organizationId: string,
		filters: TemplateFilters,
		pagination: Pagination,
		sort?: string,
	): Promise<TemplateWithProcedure[]>;
	count(organizationId: string, filters: TemplateFilters): Promise<number>;
};
