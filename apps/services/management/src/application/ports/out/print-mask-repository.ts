import { Pagination } from '@/domain/entities/pagination';
import { PrintMask } from '@/domain/entities/print-mask';
import { Filter } from '@packages/utils';

export type CreatePrintMaskData = Omit<
	PrintMask,
	'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'deletedBy' | 'updatedBy'
>;

export type UpdatePrintMaskData = Partial<CreatePrintMaskData> & {
	updatedBy: string;
	updatedAt: Date;
};

export type PrintMaskFilters = Filter[];

export type PrintMaskRepository = {
	create(data: CreatePrintMaskData): Promise<PrintMask>;
	update(id: string, data: UpdatePrintMaskData): Promise<PrintMask>;
	softDelete(id: string, deletedBy: string): Promise<void>;
	permanentDelete(id: string): Promise<void>;
	findById(id: string): Promise<PrintMask | null>;
	findAll(
		organizationId: string,
		filters: PrintMaskFilters,
		pagination: Pagination,
		sort?: string,
	): Promise<PrintMask[]>;
	count(organizationId: string, filters: PrintMaskFilters): Promise<number>;
};
