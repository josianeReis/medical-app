import { CreateAddressDTO } from '@/application/ports/out/patient/address-repository';
import { CreateDocumentDTO } from '@/application/ports/out/patient/document-repository';
import { CreatePatientDTO } from '@/application/ports/out/patient/patient-repository';
import { UnitOfWork } from '@/application/ports/out/unit-of-work';
import { Address } from '@/domain/entities/address';
import { PatientDocument, PatientWithDetails } from '@/domain/entities/patient';
import { BadRequestError } from '@/domain/errors/bad-request-error';
import { ValidationError } from '@/domain/errors/validation-error';
import { parsePhoneNumber } from 'awesome-phonenumber';

type CreatePatientInput = CreatePatientDTO & {
	documents: CreateDocumentDTO[];
	address: CreateAddressDTO[];
};

function generateDefaultEmail(
	name: string,
	document: string,
	birthdate: string,
): string {
	const initials = name
		.split(' ')
		.filter(Boolean)
		.map((part) => part[0].toLowerCase())
		.join('');
	const birthDigits = birthdate ? birthdate.replace(/[^0-9]/g, '') : '00000000';
	const docDigits = document.replace(/[^0-9A-Za-z]/g, '');
	return `${initials}${docDigits}${birthDigits}@patient.nexdoc.clinic`;
}

export class CreatePatientUseCase {
	constructor(
		private readonly runInTx: <T>(
			w: (u: UnitOfWork) => Promise<T>,
		) => Promise<T>,
	) {}

	async execute(
		organizationId: string,
		createdById: string,
		input: CreatePatientInput,
	): Promise<PatientWithDetails> {
		let { email, phoneNumber } = input;
		const {
			name,
			phoneNumber: _,
			documents = [],
			address = [],
			...patientInfo
		} = input;
		const parsedPhoneNumber = parsePhoneNumber(phoneNumber ?? '');
		phoneNumber = parsedPhoneNumber.number?.e164;

		// 1. Try to locate an existing patient by email if its provided
		const existingPatient: PatientWithDetails | undefined = await this.runInTx(
			async (uow) => {
				return phoneNumber && phoneNumber.length > 0
					? await uow.patients.findByPhoneNumber(phoneNumber)
					: email && email.length > 0
						? await uow.patients.findByEmail(email)
						: undefined;
			},
		);
		// inside same transaction
		return await this.runInTx(async (uow) => {
			// -- If we found a patient ------------------------
			if (existingPatient) {
				let patientAddress: Address[] = [];
				let patientDocuments: PatientDocument[] = [];

				if (!existingPatient.user) {
					throw new BadRequestError('errors.patient_not_found');
				}

				const isMember = await uow.members.findByUserAndOrganization(
					existingPatient.user.id,
					organizationId,
				);

				if (isMember) {
					throw new BadRequestError('errors.patient_already_exists');
				}

				// Link patient to organization
				await uow.members.addToOrganization(
					existingPatient.user.id,
					organizationId,
				);

				// Sync documents (add missing, update changed)
				if (documents.length) {
					patientDocuments = await uow.documents.syncDocuments(
						existingPatient.id,
						documents.map((d) => ({ ...d, patientId: existingPatient.id })),
					);
				}

				if (address.length) {
					patientAddress = await this.createAddress(
						address,
						existingPatient.id,
					);
				}

				return {
					...existingPatient,
					documents: patientDocuments,
					addresses: patientAddress,
				};
			}
			//-------------------------------------------------
			// -- If no patient found: create new -------------

			const primaryDoc = documents[0];
			if (!primaryDoc) {
				throw new ValidationError({
					documents: ['errors.primary_document_required'],
				});
			}
			if (
				!parsedPhoneNumber.valid ||
				!parsedPhoneNumber.possible ||
				!parsedPhoneNumber.regionCode
			) {
				throw new ValidationError({
					phoneNumber: ['errors.invalid_phone_number'],
				});
			}
			if (!email) {
				email = generateDefaultEmail(
					name,
					primaryDoc.number,
					patientInfo.birthdate,
				) as string;
			}

			const username = parsedPhoneNumber.number.e164;
			const names = name.split(' ');
			const firstName = names[0];
			const lastName = names.slice(1).join(' ') || firstName;

			const signupResponse = await uow.users.create({
				email: email as string,
				username,
				name,
				firstName,
				lastName,
				terms: false,
			});

			if (signupResponse.error || !signupResponse.data?.user.id) {
				throw new BadRequestError('errors.failed_to_create_user');
			}

			const userId = signupResponse.data.user.id;

			const patient = await uow.patients.create(createdById, userId, {
				...patientInfo,
				email,
				name,
				phoneNumber,
				secondPhoneNumber: patientInfo.secondPhoneNumber,
				gender: patientInfo.gender,
				birthdate: patientInfo.birthdate,
			});

			const createdDocuments = await uow.documents.create(
				patient.id,
				documents,
			);

			await uow.members.addToOrganization(userId, organizationId);

			return { ...patient, documents: createdDocuments };
		});
	}

	private async createAddress(
		address: CreateAddressDTO[],
		patientId: string,
	): Promise<Address[]> {
		return this.runInTx(async (uow) => {
			return uow.addresses.create(patientId, address);
		});
	}
}
