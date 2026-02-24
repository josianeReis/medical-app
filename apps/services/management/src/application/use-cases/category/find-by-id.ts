import { CategoryRepository } from '../../ports/out/category-repository';
import { Category } from './../../../domain/entities/category';

export class FindByIdCategoryUseCase {
	constructor(private readonly categoryRepository: CategoryRepository) {}

	async execute(id: string): Promise<Category | null> {
		return this.categoryRepository.findById(id);
	}
}
