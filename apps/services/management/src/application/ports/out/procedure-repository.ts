import { Procedure, ProcedureWithCategory } from '@/domain/entities/procedure';
import { Pagination } from '@/domain/entities/pagination';
import { Filter } from '@packages/utils';

export type CreateProcedureData = Omit<
	Procedure,
	| 'id'
	| 'createdAt'
	| 'updatedAt'
	| 'isDeleted'
	| 'deletedAt'
	| 'deletedBy'
	| 'updatedBy'
	| 'equipament'
	| 'duration'
	| 'code'
> & {
	name: string;
	categoryId: string;
	equipament?: string;
	duration?: number;
	code?: number;
};

export type UpdateProcedureData = Partial<CreateProcedureData> & {
	updatedBy: string;
	updatedAt: Date;
};

export type ProcedureFilters = Filter[];

export type ProcedureRepository = {
	create(data: CreateProcedureData): Promise<Procedure>;
	update(id: string, data: UpdateProcedureData): Promise<Procedure>;
	softDelete(id: string, deletedBy: string): Promise<void>;
	permanentDelete(id: string): Promise<void>;
	findById(id: string): Promise<ProcedureWithCategory | null>;
	findAll(
		organizationId: string,
		filters: ProcedureFilters,
		pagination: Pagination,
		sort?: string,
	): Promise<ProcedureWithCategory[]>;
	count(organizationId: string, filters: ProcedureFilters): Promise<number>;
};
