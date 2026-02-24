import { Procedure } from '@/domain/entities/procedure';
import { ProcedureRepository } from '@/application/ports/out/procedure-repository';

export class FindByIdProcedureUseCase {
	constructor(private readonly procedureRepository: ProcedureRepository) {}

	async execute(id: string): Promise<Procedure | null> {
		return this.procedureRepository.findById(id);
	}
}
