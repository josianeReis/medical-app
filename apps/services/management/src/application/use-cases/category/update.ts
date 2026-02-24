import { Category } from '@/domain/entities/category';
import {
	CategoryRepository,
	UpdateCategoryData,
} from '@/application/ports/out/category-repository';

type UpdateCategoryInput = {
	id: string;
	data: UpdateCategoryData;
};

export class UpdateCategoryUseCase {
	constructor(private readonly categoryRepository: CategoryRepository) {}

	async execute({ id, data }: UpdateCategoryInput): Promise<Category> {
		return this.categoryRepository.update(id, data);
	}
}
