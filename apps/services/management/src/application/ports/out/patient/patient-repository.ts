import { Pagination } from '@/domain/entities/pagination';
import {
	Patient,
	PatientGender,
	PatientWithDetails,
} from '@/domain/entities/patient';
import { Filter } from '@packages/utils';

export type CreatePatientData = Omit<
	Patient,
	| 'id'
	| 'createdAt'
	| 'updatedAt'
	| 'isDeleted'
	| 'deletedAt'
	| 'deletedBy'
	| 'updatedBy'
	| 'phoneNumber'
	| 'secondPhoneNumber'
	| 'email'
	| 'gender'
	| 'birthdate'
	| 'createdBy'
> & {
	birthdate: string;
	createdBy: string;
	phoneNumber?: string;
	secondPhoneNumber?: string;
	email?: string;
	gender?: PatientGender;
};

export type CreatePatientDTO = Omit<CreatePatientData, 'createdBy'>;

export type UpdatePatientData = Partial<CreatePatientData> & {
	updatedBy: string;
	updatedAt: Date;
};

export type PatientFilters = Filter[];

export type PatientRepository = {
	/**
	 * Creates a new patient.
	 * @param createdById - The ID of the user creating the patient.
	 * @param userId - The ID of the user associated with the patient.
	 * @param data - The patient data to create.
	 * @returns Promise resolving to the created patient with details.
	 */
	create(
		createdById: string,
		userId: string,
		data: CreatePatientDTO,
	): Promise<PatientWithDetails>;
	/**
	 * Finds a patient by their ID.
	 * @param id - The ID of the patient to find.
	 * @returns Promise resolving to the patient with details if found, undefined otherwise.
	 */
	findById(id: string): Promise<PatientWithDetails | undefined>;
	/**
	 * Finds all patients in an organization with optional filtering and pagination.
	 * @param organizationId - The ID of the organization to search in.
	 * @param filters - Optional filters to apply to the search.
	 * @param pagination - Pagination parameters for the results.
	 * @returns Promise resolving to an array of patients with details.
	 */
	findAll(
		organizationId: string,
		filters: PatientFilters,
		pagination: Pagination,
		sort?: string,
	): Promise<PatientWithDetails[]>;
	/**
	 * Counts the total number of patients in an organization matching the given filters.
	 * @param organizationId - The ID of the organization to count patients in.
	 * @param filters - Optional filters to apply to the count.
	 * @returns Promise resolving to the total count of matching patients.
	 */
	count(organizationId: string, filters: PatientFilters): Promise<number>;
	/**
	 * Updates a patient.
	 * @param id - The ID of the patient to update.
	 * @param data - The data to update the patient with.
	 * @returns Promise resolving to the updated patient with details.
	 * @throws {NotFoundError} If the patient is not found.
	 */
	update(id: string, data: UpdatePatientData): Promise<PatientWithDetails>;
	/**
	 * Finds a patient matching the given email address.
	 * @param email - The email address to search for.
	 * @returns Promise resolving to the patient with details if found, undefined otherwise.
	 */
	findByEmail(email: string): Promise<PatientWithDetails | undefined>;
	/**
	 * Finds a patient matching the given phone number.
	 * @param phoneNumber - The phone number to search for.
	 * @returns Promise resolving to the patient with details if found, undefined otherwise.
	 */
	findByPhoneNumber(
		phoneNumber: string,
	): Promise<PatientWithDetails | undefined>;
	/**
	 * Soft deletes a patient by setting the deletedAt and deletedBy fields.
	 * @param id - The ID of the patient to soft delete.
	 * @param deletedBy - The ID of the user performing the deletion.
	 * @returns Promise resolving to void.
	 */
	softDelete(id: string, deletedBy: string): Promise<void>;
	findByDocumentAndBirthdate(
		document: string,
		documentType: string,
		birthdate: string,
	): Promise<Patient | null>;
};
