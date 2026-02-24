import { ProcedureRepository } from '@/application/ports/out/procedure-repository';

export class DeleteProcedureUseCase {
	constructor(private readonly procedureRepository: ProcedureRepository) {}

	async execute(id: string, deletedBy: string): Promise<void> {
		return this.procedureRepository.softDelete(id, deletedBy);
	}
}
