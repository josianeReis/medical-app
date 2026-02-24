import { Category } from '@/domain/entities/category';
import { Pagination } from '@/domain/entities/pagination';
import { Filter } from '@packages/utils';

export type CreateCategoryData = Omit<
	Category,
	| 'id'
	| 'createdAt'
	| 'updatedAt'
	| 'isDeleted'
	| 'deletedAt'
	| 'deletedBy'
	| 'updatedBy'
	| 'parentId'
> & {
	parentId?: string;
};

export type UpdateCategoryData = Partial<CreateCategoryData> & {
	updatedBy: string;
	updatedAt: Date;
};

export type CategoryFilters = Filter[];

export type CategoryRepository = {
	create(data: CreateCategoryData): Promise<Category>;
	update(id: string, data: UpdateCategoryData): Promise<Category>;
	softDelete(id: string, deletedBy: string): Promise<void>;
	permanentDelete(id: string): Promise<void>;
	findById(id: string): Promise<Category | null>;
	findAll(
		organizationId: string,
		filters: CategoryFilters,
		pagination: Pagination,
		sort?: string,
	): Promise<Category[]>;
	count(organizationId: string, filters: CategoryFilters): Promise<number>;
};
