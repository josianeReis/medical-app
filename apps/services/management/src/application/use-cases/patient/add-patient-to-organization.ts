import { PatientRepository } from '@/application/ports/out/patient/patient-repository';

type AddPatientToOrganizationInput = {
	userId: string;
	organizationId: string;
};

export class AddPatientToOrganizationUseCase {
	constructor(private readonly patientRepository: PatientRepository) {}

	async execute(input: AddPatientToOrganizationInput): Promise<void> {
		await this.patientRepository.addToOrganization(
			input.userId,
			input.organizationId,
		);
	}
}
