import {
	TemplateRepository,
	UpdateTemplateData,
} from '@/application/ports/out/template-repository';
import { Template } from '@/domain/entities/template';

type UpdateTemplateInput = {
	id: string;
	data: UpdateTemplateData;
};

export class UpdateTemplateUseCase {
	constructor(private readonly templateRepository: TemplateRepository) {}

	async execute({ id, data }: UpdateTemplateInput): Promise<Template> {
		return this.templateRepository.update(id, data);
	}
}
