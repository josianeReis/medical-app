import { Procedure } from '@/domain/entities/procedure';
import {
	CreateProcedureData,
	ProcedureRepository,
} from '@/application/ports/out/procedure-repository';

export class CreateProcedureUseCase {
	constructor(private readonly procedureRepository: ProcedureRepository) {}

	async execute(data: CreateProcedureData): Promise<Procedure> {
		return this.procedureRepository.create(data);
	}
}
