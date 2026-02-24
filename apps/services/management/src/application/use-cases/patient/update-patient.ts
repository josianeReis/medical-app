import { Patient } from '@/domain/entities/patient';
import {
	PatientRepository,
	UpdatePatientData,
} from '@/application/ports/out/patient/patient-repository';

type UpdatePatientInput = {
	id: string;
	data: UpdatePatientData;
};

export class UpdatePatientUseCase {
	constructor(private readonly patientRepository: PatientRepository) {}

	async execute({ id, data }: UpdatePatientInput): Promise<Patient> {
		return this.patientRepository.update(id, data);
	}
}
