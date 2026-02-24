import { CategoryRepository } from '../../ports/out/category-repository';
import { Category } from './../../../domain/entities/category';

export class DeleteCategoryUseCase {
	constructor(private readonly categoryRepository: CategoryRepository) {}

	async execute(id: string): Promise<Category> {
		return this.categoryRepository.delete(id);
	}
}
