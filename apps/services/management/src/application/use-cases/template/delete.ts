import { TemplateRepository } from '@/application/ports/out/template-repository';

export class DeleteTemplateUseCase {
	constructor(private readonly templateRepository: TemplateRepository) {}

	async execute(id: string, deletedBy: string): Promise<void> {
		return this.templateRepository.softDelete(id, deletedBy);
	}
}
