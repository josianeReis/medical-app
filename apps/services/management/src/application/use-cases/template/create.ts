import { Template } from '@/domain/entities/template';
import {
	CreateTemplateData,
	TemplateRepository,
} from '@/application/ports/out/template-repository';

export class CreateTemplateUseCase {
	constructor(private readonly templateRepository: TemplateRepository) {}

	async execute(data: CreateTemplateData): Promise<Template> {
		return this.templateRepository.create(data);
	}
}
