import { PatientRepository } from '@/application/ports/out/patient/patient-repository';
import { NotFoundError } from '@/domain/errors/not-found-error';

type LinkPatientToUserInput = {
	document: string;
	documentType: string;
	birthdate: string;
	currentUserId: string;
};

export class LinkPatientToUserUseCase {
	constructor(private readonly patientRepository: PatientRepository) {}

	async execute(input: LinkPatientToUserInput): Promise<void> {
		const { document, documentType, birthdate, currentUserId } = input;
		const patient = await this.patientRepository.findByDocumentAndBirthdate(
			document,
			documentType,
			birthdate,
		);

		if (!patient) {
			throw new NotFoundError('errors.patient_not_found_or_already_linked');
		}

		await this.patientRepository.update(patient.id, { userId: currentUserId });
	}
}
