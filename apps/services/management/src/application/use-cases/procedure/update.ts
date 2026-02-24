import {
	ProcedureRepository,
	UpdateProcedureData,
} from '@/application/ports/out/procedure-repository';
import { Procedure } from '@/domain/entities/procedure';

type UpdateProcedureInput = {
	id: string;
	data: UpdateProcedureData;
};

export class UpdateProcedureUseCase {
	constructor(private readonly procedureRepository: ProcedureRepository) {}

	async execute({ id, data }: UpdateProcedureInput): Promise<Procedure> {
		return this.procedureRepository.update(id, data);
	}
}
