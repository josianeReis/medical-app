import { PatientWithDetails } from '@/domain/entities/patient';
import { PatientRepository } from '@/application/ports/out/patient/patient-repository';

export class FindPatientByIdUseCase {
	constructor(private readonly patientRepository: PatientRepository) {}

	async execute(id: string): Promise<PatientWithDetails | undefined> {
		return this.patientRepository.findById(id);
	}
}
