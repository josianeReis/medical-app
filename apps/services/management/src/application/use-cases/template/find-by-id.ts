import { TemplateWithProcedure } from '@/domain/entities/template';
import { TemplateRepository } from '@/application/ports/out/template-repository';

export class FindByIdTemplateUseCase {
	constructor(private readonly templateRepository: TemplateRepository) {}

	async execute(id: string): Promise<TemplateWithProcedure | null> {
		return this.templateRepository.findById(id);
	}
}
