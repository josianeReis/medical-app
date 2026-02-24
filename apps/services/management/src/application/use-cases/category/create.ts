import {
	CategoryRepository,
	CreateCategoryData,
} from '@/application/ports/out/category-repository';
import { Category } from '@/domain/entities/category';

export class CreateCategoryUseCase {
	constructor(private readonly categoryRepository: CategoryRepository) {}

	async execute(data: CreateCategoryData): Promise<Category> {
		return this.categoryRepository.create(data);
	}
}
